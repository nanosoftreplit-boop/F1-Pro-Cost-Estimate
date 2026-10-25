import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { 
  WorkItem, 
  ProjectSettings, 
  Category, 
  SettlementItem, 
  GanttTask, 
  AuditDiffItem,
  AdminReportConfig
} from '../types/estimate';
import { computeTHKP, formatVND, formatQuantity, aggregateMaterials } from './calculator';
import { ActiveTab } from '../components/HeaderRibbon';

// Cached base64 fonts
let cachedRobotoFont: string | null = null;
let fontLoadAttempted = false;

/**
 * Tải font Unicode Roboto hỗ trợ đầy đủ 100% tiếng Việt có dấu
 */
async function loadUnicodeFont(doc: jsPDF): Promise<string> {
  if (cachedRobotoFont) {
    try {
      doc.addFileToVFS('Roboto-Regular.ttf', cachedRobotoFont);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.setFont('Roboto');
      return 'Roboto';
    } catch {
      return 'helvetica';
    }
  }

  if (!fontLoadAttempted) {
    fontLoadAttempted = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        cachedRobotoFont = btoa(binary);

        doc.addFileToVFS('Roboto-Regular.ttf', cachedRobotoFont);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');
        return 'Roboto';
      }
    } catch {
      // Offline fallback
    }
  }

  return 'helvetica';
}

/**
 * Đọc số tiền thành chữ tiếng Việt chuẩn quy chuẩn tài chính
 */
export function docSoTienBangChu(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'Không đồng';
  const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const Tien = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

  function docBaSo(baSo: number, dayDu: boolean): string {
    let tram = Math.floor(baSo / 100);
    let chuc = Math.floor((baSo % 100) / 10);
    let donVi = baSo % 10;
    let ketQua = '';

    if (tram === 0 && chuc === 0 && donVi === 0) return '';

    if (dayDu || tram > 0) {
      ketQua += `${ChuSo[tram]} trăm `;
      if (chuc === 0 && donVi > 0) ketQua += 'lẻ ';
    }

    if (chuc === 1) {
      ketQua += 'mười ';
    } else if (chuc > 1) {
      ketQua += `${ChuSo[chuc]} mươi `;
    }

    if (chuc > 0 && donVi === 1) {
      ketQua += 'mốt';
    } else if (chuc > 1 && donVi === 5) {
      ketQua += 'lăm';
    } else if (donVi > 0) {
      ketQua += ChuSo[donVi];
    }

    return ketQua.trim();
  }

  let so = Math.round(num);
  let chuoiKetQua = '';
  let viTri = 0;
  let coPhanTruoc = false;

  while (so > 0) {
    const baSo = so % 1000;
    if (baSo > 0) {
      const chuoiBaSo = docBaSo(baSo, coPhanTruoc && so >= 1000);
      chuoiKetQua = `${chuoiBaSo} ${Tien[viTri]} ${chuoiKetQua}`.trim();
    }
    so = Math.floor(so / 1000);
    viTri++;
    coPhanTruoc = true;
  }

  chuoiKetQua = chuoiKetQua.trim() + ' đồng chẵn';
  return chuoiKetQua.charAt(0).toUpperCase() + chuoiKetQua.slice(1);
}

export interface DirectExportPdfOptions {
  activeTab: ActiveTab;
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
  settlements?: SettlementItem[];
  tasks?: GanttTask[];
  auditDiffs?: AuditDiffItem[];
}

/**
 * Xuất trực tiếp bảng tính hiện tại ra file PDF chuẩn hành chính Nhà nước (Nghị định 30/2020/NĐ-CP)
 */
export async function exportCurrentSheetToDirectPdf({
  activeTab,
  items,
  categories,
  settings,
  settlements = [],
  tasks = [],
  auditDiffs = []
}: DirectExportPdfOptions): Promise<void> {
  // Tạo tài liệu PDF khổ A4 Ngang (Landscape) chuẩn các biểu mẫu dự toán công trình
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const fontName = await loadUnicodeFont(doc);

  const admin: AdminReportConfig = {
    documentTitle: settings.adminReportConfig?.documentTitle,
    documentSubTitle: settings.adminReportConfig?.documentSubTitle,
    documentNumber: settings.adminReportConfig?.documentNumber || 'Số: .../TTr-DA',
    superiorAgency: settings.adminReportConfig?.superiorAgency || 'UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG',
    consultantUnit: settings.adminReportConfig?.consultantUnit || settings.contractor || 'CÔNG TY CP XÂY DỰNG & CÔNG NGHỆ F1',
    investorUnit: settings.adminReportConfig?.investorUnit || settings.investor || 'BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG',
    creatorName: settings.adminReportConfig?.creatorName || 'KS. Nguyễn Văn An',
    creatorTitle: settings.adminReportConfig?.creatorTitle || 'Kỹ sư Định giá Xây dựng',
    chiefEngineer: settings.adminReportConfig?.chiefEngineer || 'ThS. Trần Quốc Bảo',
    chiefEngineerTitle: settings.adminReportConfig?.chiefEngineerTitle || 'Chủ nhiệm Lập dự toán',
    approverName: settings.adminReportConfig?.approverName || 'TS. Lê Hoàng Nam',
    approverTitle: settings.adminReportConfig?.approverTitle || 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN',
    signDatePlace: settings.adminReportConfig?.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
    nationalHeaderLine1: settings.adminReportConfig?.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    nationalHeaderLine2: settings.adminReportConfig?.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc',
  };

  // Xác định Tiêu đề & Căn cứ biểu mẫu theo từng Tab
  let mainTitle = 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH';
  let subCode = 'Căn cứ Thông tư số 11/2021/TT-BXD & TT 12/2021/TT-BXD';

  switch (activeTab) {
    case 'cong-trinh':
      mainTitle = 'BẢNG TIÊN LƯỢNG & DỰ TOÁN CHI TIẾT KHỐI LƯỢNG CÔNG TRÌNH';
      subCode = 'Biểu số: 01/DT-KL - Căn cứ định mức Thông tư số 12/2021/TT-BXD của Bộ Xây dựng';
      break;
    case 'thkp':
      mainTitle = admin.documentTitle || 'BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN XÂY DỰNG';
      subCode = 'Biểu số: 06/THKP - Mẫu bảng 3.1 & 3.2 ban hành kèm theo Thông tư 11/2021/TT-BXD';
      break;
    case 'thvt':
      mainTitle = 'BẢNG TỔNG HỢP & CHÊNH LỆCH VẬT TƯ (VẬT LIỆU, NHÂN CÔNG, MÁY)';
      subCode = `Biểu số: 03/THVT - Áp dụng giá thông báo tháng của Sở Xây dựng ${settings.locationProvince}`;
      break;
    case 'ptvt':
      mainTitle = 'BẢNG PHÂN TÍCH HAO PHÍ ĐỊNH MỨC VẬT TƯ CHO TỪNG CÔNG TÁC';
      subCode = 'Biểu số: 02/PTVT - Chuẩn Thông tư số 12/2021/TT-BXD';
      break;
    case 'dgct':
      mainTitle = 'BẢNG PHÂN TÍCH ĐƠN GIÁ XÂY DỰNG CHI TIẾT';
      subCode = 'Biểu số: 04/DGCT - Thông tư 11/2021/TT-BXD & TT 12/2021/TT-BXD';
      break;
    case 'du-thau':
      mainTitle = 'BẢNG GIÁ DỰ THẦU & ĐƠN GIÁ TỔNG HỢP ĐẦY ĐỦ';
      subCode = 'Mẫu biểu số 05/DTH - Luật Đấu thầu số 22/2023/QH15 & Nghị định 24/2024/NĐ-CP';
      break;
    case 'tham-tra':
      mainTitle = 'BÁO CÁO KẾT QUẢ THẨM TRA & SO SÁNH SAI LỆCH DỰ TOÁN';
      subCode = 'Mẫu biểu: 01/TTr-KTXD - Nghị định 10/2021/NĐ-CP & TT 11/2021/TT-BXD';
      break;
    case 'quyet-toan':
      mainTitle = 'BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH (MẪU 03a/03b)';
      subCode = 'Phụ lục ban hành kèm theo Nghị định số 99/2021/NĐ-CP về quản lý thanh toán vốn';
      break;
    case 'tien-do':
      mainTitle = 'BẢNG TIẾN ĐỘ THI CÔNG & KẾ HOẠCH GIẢI NGÂN DỰ ÁN';
      subCode = 'Biểu kế hoạch tiến độ thi công tổng thể công trình xây dựng';
      break;
    case 'dau-thau':
      mainTitle = 'HỒ SƠ MỜI THẦU & BẢNG TIÊN LƯỢNG TRỰC TUYẾN';
      subCode = 'Hệ thống mạng Đấu thầu Quốc gia (E-GP) - Chuẩn Bộ Kế hoạch & Đầu tư';
      break;
    case 'phan-tich-rui-ro':
      mainTitle = 'BÁO CÁO PHÂN TÍCH BIẾN ĐỘNG CHI PHÍ & RỦI RO DỰ TOÁN';
      subCode = 'Phương pháp mô phỏng rủi ro tài chính dự án đầu tư xây dựng';
      break;
    case 'python-api':
      mainTitle = 'BẢNG THÔNG SỐ ENGINE DỰ TOÁN PYTHON & REST API';
      subCode = 'Hệ thống tính toán độc lập F1 Pro - Bảo mật thuật toán chi phí';
      break;
  }

  // ==============================================================
  // 1. HEADER HÀNH CHÍNH NHÀ NƯỚC (THEO NGHỊ ĐỊNH 30/2020/NĐ-CP)
  // ==============================================================
  doc.setFont(fontName, 'normal');

  // Khối bên trái: Cơ quan ban hành & Đơn vị lập biểu
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text((admin.superiorAgency || '').toUpperCase(), 14, 14);

  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.text((admin.consultantUnit || '').toUpperCase(), 14, 19);

  // Kẻ nét gạch phân cách dưới đơn vị tư vấn
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(14, 21, 65, 21);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(8.5);
  doc.text(admin.documentNumber || 'Số: .../TTr-DA', 14, 26);

  // Khối bên phải: Quốc hiệu & Tiêu ngữ
  const rightCenterX = 225;
  doc.setFont(fontName, 'bold');
  doc.setFontSize(10);
  doc.text((admin.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM').toUpperCase(), rightCenterX, 14, { align: 'center' });

  doc.setFontSize(10.5);
  doc.text(admin.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc', rightCenterX, 19, { align: 'center' });

  // Nét liền dưới tiêu ngữ
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(rightCenterX - 30, 21.5, rightCenterX + 30, 21.5);

  // ==============================================================
  // 2. TIÊU ĐỀ CHÍNH CỦA VĂN BẢN
  // ==============================================================
  const pageCenterX = 148.5;
  doc.setFont(fontName, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(mainTitle, pageCenterX, 34, { align: 'center' });

  doc.setFont(fontName, 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(subCode, pageCenterX, 39, { align: 'center' });

  // ==============================================================
  // 3. THÔNG TIN DỰ ÁN & CÔNG TRÌNH (PROJECT METADATA)
  // ==============================================================
  doc.setFont(fontName, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Hàng 1
  doc.text(`Tên công trình:`, 14, 46);
  doc.setFont(fontName, 'bold');
  doc.text(settings.projectName || 'Công trình xây dựng', 38, 46);

  doc.setFont(fontName, 'normal');
  doc.text(`Địa điểm:`, 155, 46);
  doc.setFont(fontName, 'bold');
  doc.text(`${settings.locationProvince} (Vùng ${settings.salaryRegion})`, 172, 46);

  // Hàng 2
  doc.setFont(fontName, 'normal');
  doc.text(`Chủ đầu tư:`, 14, 51);
  doc.setFont(fontName, 'bold');
  doc.text(settings.investor || 'Ban QLDA Đầu tư Xây dựng', 38, 51);

  doc.setFont(fontName, 'normal');
  doc.text(`Đơn vị tư vấn:`, 155, 51);
  doc.setFont(fontName, 'bold');
  doc.text(settings.contractor || 'Công ty CP Xây dựng F1', 176, 51);

  // ==============================================================
  // 4. BẢNG DỮ LIỆU TƯƠNG ỨNG VỚI TAB HIỆN TẠI (AUTOTABLE)
  // ==============================================================
  const startTableY = 56;

  let head: string[][] = [];
  let body: any[][] = [];
  let columnStyles: Record<number, any> = {};

  if (activeTab === 'cong-trinh') {
    head = [[
      'STT', 'Mã hiệu', 'Nội dung công tác', 'ĐVT', 'Khối lượng',
      'Đơn giá VL', 'Đơn giá NC', 'Đơn giá Máy',
      'Thành tiền VL', 'Thành tiền NC', 'Thành tiền Máy', 'Tổng cộng'
    ]];

    let totalMat = 0;
    let totalLab = 0;
    let totalMac = 0;

    categories.forEach((cat, catIdx) => {
      const catItems = items.filter(i => (i.categoryId || categories[0]?.id) === cat.id);
      if (catItems.length === 0) return;

      let catMat = 0;
      let catLab = 0;
      let catMac = 0;

      catItems.forEach(i => {
        const q = i.quantity || 0;
        catMat += q * (i.unitPriceMaterial || 0);
        catLab += q * (i.unitPriceLabor || 0);
        catMac += q * (i.unitPriceMachine || 0);
      });

      totalMat += catMat;
      totalLab += catLab;
      totalMac += catMac;

      // Dòng phân đoạn / Hạng mục
      body.push([
        { content: `${catIdx + 1}`, styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: `HM.${catIdx + 1}`, styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: cat.name.toUpperCase(), colSpan: 6, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: formatVND(catMat), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: formatVND(catLab), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: formatVND(catMac), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: formatVND(catMat + catLab + catMac), styles: { fontStyle: 'bold', halign: 'right', fillColor: [226, 232, 240] } }
      ]);

      // Danh sách công tác thuộc hạng mục
      catItems.forEach((item, itemIdx) => {
        const q = item.quantity || 0;
        const mat = q * (item.unitPriceMaterial || 0);
        const lab = q * (item.unitPriceLabor || 0);
        const mac = q * (item.unitPriceMachine || 0);
        const tot = mat + lab + mac;

        body.push([
          `${catIdx + 1}.${itemIdx + 1}`,
          item.code,
          item.name,
          item.unit,
          formatQuantity(q),
          formatVND(item.unitPriceMaterial),
          formatVND(item.unitPriceLabor),
          formatVND(item.unitPriceMachine),
          formatVND(mat),
          formatVND(lab),
          formatVND(mac),
          formatVND(tot)
        ]);
      });
    });

    // Dòng tổng kết cuối bảng
    const grandTotal = totalMat + totalLab + totalMac;
    body.push([
      { content: 'TỔNG CỘNG TOÀN BỘ CÔNG TRÌNH', colSpan: 8, styles: { fontStyle: 'bold', halign: 'center', fillColor: [226, 232, 240] } },
      { content: formatVND(totalMat), styles: { fontStyle: 'bold', halign: 'right', fillColor: [226, 232, 240] } },
      { content: formatVND(totalLab), styles: { fontStyle: 'bold', halign: 'right', fillColor: [226, 232, 240] } },
      { content: formatVND(totalMac), styles: { fontStyle: 'bold', halign: 'right', fillColor: [226, 232, 240] } },
      { content: formatVND(grandTotal), styles: { fontStyle: 'bold', halign: 'right', fillColor: [203, 213, 225] } }
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 18 },
      2: { cellWidth: 62 },
      3: { halign: 'center', cellWidth: 12 },
      4: { halign: 'right', cellWidth: 18 },
      5: { halign: 'right', cellWidth: 20 },
      6: { halign: 'right', cellWidth: 20 },
      7: { halign: 'right', cellWidth: 20 },
      8: { halign: 'right', cellWidth: 21 },
      9: { halign: 'right', cellWidth: 21 },
      10: { halign: 'right', cellWidth: 21 },
      11: { halign: 'right', cellWidth: 24, fontStyle: 'bold' }
    };
  } else if (activeTab === 'thkp') {
    const thkp = computeTHKP(items, settings, categories);
    head = [[
      'STT', 'Khoản mục chi phí xây dựng', 'Ký hiệu', 'Cách tính', 'Thành tiền (VNĐ)', 'Căn cứ & Ghi chú'
    ]];

    body = [
      ['1', 'Chi phí trực tiếp (Vật liệu + Nhân công + Máy)', 'T', 'VL + NC + M', formatVND(thkp.directCostTotal), 'Khối lượng x Đơn giá hiện trường'],
      [' - ', 'Trong đó: Chi phí Vật liệu', 'VL', 'Tổng tiền VL', formatVND(thkp.directMaterial), 'Giá gốc + Chênh lệch giá tháng'],
      [' - ', 'Trong đó: Chi phí Nhân công', 'NC', 'Tổng tiền NC', formatVND(thkp.directLabor), `Mức lương vùng ${settings.salaryRegion}`],
      [' - ', 'Trong đó: Chi phí Máy thi công', 'M', 'Tổng tiền M', formatVND(thkp.directMachine), 'Nhiên liệu & giá ca máy BXD'],
      ['2', `Chi phí gián tiếp (Tỷ lệ ${(thkp.generalCostRate * 100).toFixed(1)}%)`, 'GT', 'C + NT + KTXĐ', formatVND(thkp.indirectCostTotal), 'Bảng 3.1 Thông tư 11/2021/TT-BXD'],
      [' - ', `+ Chi phí chung (${(thkp.generalCostRate * 100).toFixed(1)}%)`, 'C', `T x ${(thkp.generalCostRate * 100).toFixed(1)}%`, formatVND(thkp.generalCost), 'Định mức chi phí quản lý điều hành'],
      [' - ', `+ Chi phí nhà tạm để ở & điều hành (${(thkp.temporaryCampRate * 100).toFixed(1)}%)`, 'NT', `T x ${(thkp.temporaryCampRate * 100).toFixed(1)}%`, formatVND(thkp.temporaryCampCost), thkp.isLineProject ? 'Công trình theo tuyến (2.2%)' : 'Công trình tại chỗ (1.2%)'],
      [' - ', `+ Chi phí một số công việc KTXĐ từ thiết kế (${(thkp.unallocatedWorkRate * 100).toFixed(1)}%)`, 'KTXĐ', `T x ${(thkp.unallocatedWorkRate * 100).toFixed(1)}%`, formatVND(thkp.unallocatedCost), 'Thí nghiệm, an toàn lao động, bơm nước'],
      ['3', `Thu nhập chịu thuế tính trước (${(thkp.taxableProfitRate * 100).toFixed(1)}%)`, 'TL', `(T + GT) x ${(thkp.taxableProfitRate * 100).toFixed(1)}%`, formatVND(thkp.taxableProfit), 'Lợi nhuận định mức của nhà thầu'],
      ['4', 'Chi phí xây dựng trước thuế', 'G', 'T + GT + TL', formatVND(thkp.preTaxTotal), 'Tổng chi phí trước thuế'],
      ['5', `Thuế giá trị gia tăng (${(settings.vatRate * 100).toFixed(0)}%)`, 'GTGT', `G x ${(settings.vatRate * 100).toFixed(0)}%`, formatVND(thkp.vatAmount), 'Nghị quyết Quốc hội & Nghị định CP'],
      ['6', 'Chi phí xây dựng sau thuế', 'G_xd', 'G + GTGT', formatVND(thkp.constructionTotal), 'Chi phí xây dựng hoàn thành'],
      ['7', `Chi phí dự phòng (${(thkp.contingencyRate * 100).toFixed(0)}%)`, 'G_dp', `G_xd x ${(thkp.contingencyRate * 100).toFixed(0)}%`, formatVND(thkp.contingencyCost), 'Dự phòng yếu tố khối lượng & trượt giá'],
      [
        { content: 'TỔNG CỘNG DỰ TOÁN KINH PHÍ XÂY DỰNG', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } },
        { content: formatVND(thkp.grandTotal), styles: { fontStyle: 'bold', halign: 'right', fillColor: [203, 213, 225] } },
        { content: 'G_xd + G_dp', styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } }
      ]
    ];

    columnStyles = {
      0: { halign: 'center', cellWidth: 14 },
      1: { cellWidth: 90 },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 45 },
      4: { halign: 'right', cellWidth: 45, fontStyle: 'bold' },
      5: { cellWidth: 55 }
    };
  } else if (activeTab === 'thvt') {
    const agg = aggregateMaterials(items);
    head = [[
      'STT', 'Mã hiệu', 'Tên chủng loại vật tư', 'ĐVT', 'Khối lượng',
      'Giá gốc (đ)', 'Giá thông báo (đ)', 'Chênh lệch (đ)',
      'Thành tiền gốc', 'Thành tiền TB', 'Chênh lệch TT'
    ]];

    const addSection = (title: string, list: any[]) => {
      let subBase = 0;
      let subMonth = 0;
      let subDiff = 0;

      list.forEach(item => {
        subBase += item.baseAmount;
        subMonth += item.monthlyAmount;
        subDiff += item.diffAmount;
      });

      body.push([
        { content: title, colSpan: 8, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: formatVND(subBase), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: formatVND(subMonth), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: formatVND(subDiff), styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } }
      ]);

      list.forEach((item, idx) => {
        body.push([
          `${idx + 1}`,
          item.code,
          item.name,
          item.unit,
          formatQuantity(item.totalQuantity),
          formatVND(item.basePrice),
          formatVND(item.monthlyPrice),
          formatVND(item.diffPrice),
          formatVND(item.baseAmount),
          formatVND(item.monthlyAmount),
          formatVND(item.diffAmount)
        ]);
      });
    };

    addSection('I. VẬT LIỆU XÂY DỰNG', agg.materials);
    addSection('II. NHÂN CÔNG XÂY DỰNG', agg.labors);
    addSection('III. MÁY & THIẾT BỊ THI CÔNG', agg.machines);

    columnStyles = {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 18 },
      2: { cellWidth: 64 },
      3: { halign: 'center', cellWidth: 14 },
      4: { halign: 'right', cellWidth: 20 },
      5: { halign: 'right', cellWidth: 22 },
      6: { halign: 'right', cellWidth: 22 },
      7: { halign: 'right', cellWidth: 22 },
      8: { halign: 'right', cellWidth: 25 },
      9: { halign: 'right', cellWidth: 25 },
      10: { halign: 'right', cellWidth: 25, fontStyle: 'bold' }
    };
  } else if (activeTab === 'dgct') {
    head = [[
      'STT', 'Mã hiệu', 'Tên công tác & Chiết tính thành phần hao phí', 'ĐVT', 'Định mức', 'Đơn giá (đ)', 'Thành tiền (đ)'
    ]];

    items.forEach((item, idx) => {
      const unitMat = item.unitPriceMaterial || 0;
      const unitLab = item.unitPriceLabor || 0;
      const unitMac = item.unitPriceMachine || 0;
      const unitTotal = unitMat + unitLab + unitMac;

      body.push([
        { content: `${idx + 1}`, styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: item.code, styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: item.name.toUpperCase(), styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: item.unit, styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: '1.000', styles: { fontStyle: 'bold', halign: 'right', fillColor: [241, 245, 249] } },
        { content: '-', styles: { halign: 'center', fillColor: [241, 245, 249] } },
        { content: formatVND(unitTotal), styles: { fontStyle: 'bold', halign: 'right', fillColor: [226, 232, 240] } }
      ]);

      // Vật liệu
      item.materials.forEach(m => {
        body.push([
          '',
          m.code,
          `  + Vật liệu: ${m.name}`,
          m.unit,
          formatQuantity(m.norm, 4),
          formatVND(m.monthlyPrice || m.price),
          formatVND(m.norm * (m.monthlyPrice || m.price))
        ]);
      });

      // Nhân công
      item.labors.forEach(l => {
        body.push([
          '',
          l.code,
          `  + Nhân công: ${l.name} (${l.rank})`,
          l.unit,
          formatQuantity(l.norm, 4),
          formatVND(l.price),
          formatVND(l.norm * l.price)
        ]);
      });

      // Máy thi công
      item.machines.forEach(mac => {
        body.push([
          '',
          mac.code,
          `  + Máy thi công: ${mac.name}`,
          mac.unit,
          formatQuantity(mac.norm, 4),
          formatVND(mac.price),
          formatVND(mac.norm * mac.price)
        ]);
      });
    });

    columnStyles = {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 105 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 26 },
      5: { halign: 'right', cellWidth: 38 },
      6: { halign: 'right', cellWidth: 48, fontStyle: 'bold' }
    };
  } else if (activeTab === 'du-thau') {
    head = [[
      'STT', 'Mã hiệu', 'Danh mục công tác & quy cách chất lượng', 'ĐVT', 'Khối lượng', 'Đơn giá dự thầu (đ)', 'Thành tiền dự thầu (đ)'
    ]];

    let totalBidding = 0;
    items.forEach((item, idx) => {
      const q = item.quantity || 0;
      const biddingPrice = (item.unitPriceMaterial + item.unitPriceLabor + item.unitPriceMachine) * 1.15; // Phân bổ chi phí chung + thuế
      const amount = q * biddingPrice;
      totalBidding += amount;

      body.push([
        `${idx + 1}`,
        item.code,
        item.name,
        item.unit,
        formatQuantity(q),
        formatVND(biddingPrice),
        formatVND(amount)
      ]);
    });

    body.push([
      { content: 'TỔNG CỘNG GIÁ DỰ THẦU (BAO GỒM THUẾ & TOÀN BỘ CHI PHÍ)', colSpan: 6, styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } },
      { content: formatVND(totalBidding), styles: { fontStyle: 'bold', halign: 'right', fillColor: [203, 213, 225] } }
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'center', cellWidth: 24 },
      2: { cellWidth: 110 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'right', cellWidth: 26 },
      5: { halign: 'right', cellWidth: 38 },
      6: { halign: 'right', cellWidth: 39, fontStyle: 'bold' }
    };
  } else if (activeTab === 'tham-tra') {
    head = [[
      'STT', 'Mã hiệu', 'Nội dung công việc thẩm tra', 'ĐVT', 'KL Trình', 'KL Thẩm tra', 'Chênh lệch KL', 'Thành tiền Trình (đ)', 'Chênh lệch TT (đ)', 'Đánh giá & Xử lý'
    ]];

    let totalDiffAmount = 0;
    auditDiffs.forEach((diff, idx) => {
      const diffQty = diff.auditQty - diff.originalQty;
      const diffAmt = diff.diffTotal || (diff.auditTotal - diff.originalTotal);
      totalDiffAmount += diffAmt;

      body.push([
        `${idx + 1}`,
        diff.code,
        diff.name,
        diff.unit,
        formatQuantity(diff.originalQty),
        formatQuantity(diff.auditQty),
        formatQuantity(diffQty),
        formatVND(diff.originalTotal),
        formatVND(diffAmt),
        diff.reason || (diffQty < 0 ? 'Giảm trừ theo bóc tách thực tế' : 'Bổ sung thiếu theo bản vẽ')
      ]);
    });

    body.push([
      { content: 'TỔNG CỘNG CHÊNH LỆCH SAU THẨM TRA', colSpan: 8, styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } },
      { content: formatVND(totalDiffAmount), styles: { fontStyle: 'bold', halign: 'right', fillColor: [203, 213, 225] } },
      { content: totalDiffAmount <= 0 ? 'Giảm trừ ngân sách' : 'Phát sinh dự toán', styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } }
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 20 },
      2: { cellWidth: 65 },
      3: { halign: 'center', cellWidth: 12 },
      4: { halign: 'right', cellWidth: 18 },
      5: { halign: 'right', cellWidth: 18 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'right', cellWidth: 26 },
      8: { halign: 'right', cellWidth: 26, fontStyle: 'bold' },
      9: { cellWidth: 54 }
    };
  } else if (activeTab === 'quyet-toan') {
    head = [[
      'STT', 'Nội dung công việc nghiệm thu', 'ĐVT', 'KL Hợp đồng', 'Đơn giá HĐ (đ)', 'KL Lũy kế', 'Thành tiền nghiệm thu (đ)'
    ]];

    let totalSettlement = 0;
    settlements.forEach((s, idx) => {
      const amt = (s.totalAccumulatedQty || 0) * (s.contractPrice || 0);
      totalSettlement += amt;

      body.push([
        `${idx + 1}`,
        s.name,
        s.unit,
        formatQuantity(s.contractQty),
        formatVND(s.contractPrice),
        formatQuantity(s.totalAccumulatedQty),
        formatVND(amt)
      ]);
    });

    body.push([
      { content: 'TỔNG CỘNG GIÁ TRỊ NGHIỆM THU HOÀN THÀNH', colSpan: 6, styles: { fontStyle: 'bold', halign: 'center', fillColor: [203, 213, 225] } },
      { content: formatVND(totalSettlement), styles: { fontStyle: 'bold', halign: 'right', fillColor: [203, 213, 225] } }
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 14 },
      1: { cellWidth: 105 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 32 },
      5: { halign: 'right', cellWidth: 28 },
      6: { halign: 'right', cellWidth: 44, fontStyle: 'bold' }
    };
  } else if (activeTab === 'tien-do') {
    head = [[
      'STT', 'Tên công việc / Hạng mục', 'Ngày bắt đầu', 'Ngày kết thúc', 'Thời gian (ngày)', 'Tỷ lệ hoàn thành (%)', 'Trạng thái'
    ]];

    tasks.forEach((t, idx) => {
      const progress = t.progressPercent || 0;
      body.push([
        `${idx + 1}`,
        t.name,
        t.startDate || '2026-10-01',
        t.endDate || '2026-11-15',
        `${t.durationDays || 45}`,
        `${progress}%`,
        progress >= 100 ? 'Đã hoàn thành' : progress > 0 ? 'Đang thi công' : 'Chưa bắt đầu'
      ]);
    });

    columnStyles = {
      0: { halign: 'center', cellWidth: 14 },
      1: { cellWidth: 110 },
      2: { halign: 'center', cellWidth: 30 },
      3: { halign: 'center', cellWidth: 30 },
      4: { halign: 'center', cellWidth: 25 },
      5: { halign: 'center', cellWidth: 28 },
      6: { halign: 'center', cellWidth: 32 }
    };
  } else {
    // Default fallback to compact Cong Trinh
    head = [['STT', 'Mã hiệu', 'Nội dung công tác', 'ĐVT', 'Khối lượng', 'Thành tiền (đ)']];
    items.forEach((item, idx) => {
      const q = item.quantity || 0;
      const tot = q * (item.unitPriceMaterial + item.unitPriceLabor + item.unitPriceMachine);
      body.push([
        `${idx + 1}`,
        item.code,
        item.name,
        item.unit,
        formatQuantity(q),
        formatVND(tot)
      ]);
    });
  }

  // Khởi tạo bảng với AutoTable
  const autoTableOptions: UserOptions = {
    head,
    body,
    startY: startTableY,
    margin: { left: 14, right: 14, top: 12, bottom: 14 },
    theme: 'grid',
    styles: {
      font: fontName,
      fontSize: 8,
      cellPadding: 1.6,
      textColor: [30, 41, 59],
      lineColor: [148, 163, 184],
      lineWidth: 0.15,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.2,
      lineColor: [100, 116, 139]
    },
    columnStyles,
    didDrawPage: (data) => {
      // Header nhắc lại trang sau
      if (data.pageNumber > 1) {
        doc.setFont(fontName, 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`${settings.projectName} - ${mainTitle} (Tiếp theo trang ${data.pageNumber - 1})`, 14, 8);
      }

      // Footer cố định cuối mỗi trang theo Nghị định 30/2020/NĐ-CP
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFont(fontName, 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Hệ thống Phần mềm Dự toán F1 Pro - Tiêu chuẩn Thông tư 11/2021/TT-BXD, TT 12/2021/TT-BXD & Nghị định 30/2020/NĐ-CP',
        14,
        pageHeight - 6
      );
    }
  };

  autoTable(doc, autoTableOptions);

  // ==============================================================
  // 5. KHỐI CHỮ KÝ HÀNH CHÍNH NHÀ NƯỚC (THEO NGHỊ ĐỊNH 30/2020/NĐ-CP)
  // ==============================================================
  const lastTableY = (doc as any).lastAutoTable?.finalY || 160;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Nếu phần còn lại của trang < 48mm thì sang trang mới để khối chữ ký không bị cắt xén
  if (lastTableY + 48 > pageHeight - 12) {
    doc.addPage();
  }

  const currentFinalY = (doc as any).lastAutoTable?.finalY && lastTableY + 48 <= pageHeight - 12
    ? lastTableY + 8
    : 20;

  // Dòng địa danh, ngày tháng năm (căn phải)
  doc.setFont(fontName, 'italic');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(
    admin.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
    283,
    currentFinalY,
    { align: 'right' }
  );

  // 4 Cột chữ ký: Người lập biểu, Chủ nhiệm/Chủ trì, Đơn vị tư vấn, Chủ đầu tư
  const sigY = currentFinalY + 5;
  const colCenters = [45, 112, 180, 248];

  // 1. Người lập biểu
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.text('NGƯỜI LẬP BIỂU', colCenters[0], sigY, { align: 'center' });
  doc.setFont(fontName, 'italic');
  doc.setFontSize(8);
  doc.text('(Ký, ghi rõ họ tên)', colCenters[0], sigY + 4, { align: 'center' });
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9);
  doc.text(admin.creatorName || 'KS. Nguyễn Văn An', colCenters[0], sigY + 28, { align: 'center' });
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.text(admin.creatorTitle || 'Kỹ sư Định giá Xây dựng', colCenters[0], sigY + 32, { align: 'center' });

  // 2. Chủ nhiệm / Chủ trì
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.text('CHỦ NHIỆM / CHỦ TRÌ', colCenters[1], sigY, { align: 'center' });
  doc.setFont(fontName, 'italic');
  doc.setFontSize(8);
  doc.text('(Ký, ghi rõ họ tên)', colCenters[1], sigY + 4, { align: 'center' });
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9);
  doc.text(admin.chiefEngineer || 'ThS. Trần Quốc Bảo', colCenters[1], sigY + 28, { align: 'center' });
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.text(admin.chiefEngineerTitle || 'Chủ nhiệm Lập dự toán', colCenters[1], sigY + 32, { align: 'center' });

  // 3. Đơn vị tư vấn
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.text('ĐƠN VỊ TƯ VẤN LẬP DỰ TOÁN', colCenters[2], sigY, { align: 'center' });
  doc.setFont(fontName, 'italic');
  doc.setFontSize(8);
  doc.text('(Ký tên, đóng dấu)', colCenters[2], sigY + 4, { align: 'center' });
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9);
  doc.text(admin.consultantUnit || settings.contractor, colCenters[2], sigY + 28, { align: 'center' });
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.text('Đơn vị tư vấn', colCenters[2], sigY + 32, { align: 'center' });

  // 4. Chủ đầu tư / Ban QLDA
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9.5);
  doc.text('CHỦ ĐẦU TƯ / BAN QLDA', colCenters[3], sigY, { align: 'center' });
  doc.setFont(fontName, 'italic');
  doc.setFontSize(8);
  doc.text('(Ký tên, đóng dấu phê duyệt)', colCenters[3], sigY + 4, { align: 'center' });
  doc.setFont(fontName, 'bold');
  doc.setFontSize(9);
  doc.text(admin.approverName || 'TS. Lê Hoàng Nam', colCenters[3], sigY + 28, { align: 'center' });
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.text(admin.approverTitle || 'GIÁM ĐỐC BAN QLDA', colCenters[3], sigY + 32, { align: 'center' });

  // Đánh số trang "Trang X / Y" trên toàn bộ trang
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pWidth = doc.internal.pageSize.getWidth();
    const pHeight = doc.internal.pageSize.getHeight();
    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Trang ${i} / ${totalPages}`, pWidth - 14, pHeight - 6, { align: 'right' });
  }

  // Lưu file PDF trực tiếp về máy tính người dùng
  const cleanProjectName = (settings.projectName || 'Du_Toan_F1')
    .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `Du_Toan_F1_${activeTab.toUpperCase()}_${cleanProjectName}_ND30.pdf`;
  doc.save(filename);
}
