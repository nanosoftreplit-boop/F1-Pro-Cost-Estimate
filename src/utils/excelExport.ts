import * as XLSX from 'xlsx';
import { WorkItem, ProjectSettings, Category, SettlementItem, GanttTask } from '../types/estimate';
import { aggregateMaterials, computeDetailedUnitPrices, computeTHKP } from './calculator';

export function exportProjectToExcel(
  items: WorkItem[],
  categories: Category[],
  settings: ProjectSettings,
  settlements: SettlementItem[],
  tasks: GanttTask[]
) {
  const wb = XLSX.utils.book_new();

  // 1. SHEET BẢNG CÔNG TRÌNH
  const congTrinhData: any[] = [
    ['CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    ['Độc lập - Tự do - Hạnh phúc'],
    [''],
    ['BẢNG DỰ TOÁN CHI PHÍ XÂY DỰNG CÔNG TRÌNH'],
    [`Tên công trình: ${settings.projectName}`],
    [`Địa điểm: ${settings.locationProvince} - Vùng lương ${settings.salaryRegion}`],
    [`Chủ đầu tư: ${settings.investor} | Đơn vị thi công: ${settings.contractor}`],
    [''],
    [
      'STT', 'Mã hiệu', 'Tên công tác & quy cách', 'Đơn vị', 'Khối lượng',
      'Đơn giá Vật liệu', 'Đơn giá Nhân công', 'Đơn giá Máy',
      'Thành tiền Vật liệu', 'Thành tiền Nhân công', 'Thành tiền Máy', 'Tổng thành tiền'
    ]
  ];

  let totalMatAll = 0;
  let totalLabAll = 0;
  let totalMacAll = 0;

  for (const cat of categories) {
    congTrinhData.push(['', '', cat.name.toUpperCase(), '', '', '', '', '', '', '', '', '']);
    const catItems = items.filter(i => i.categoryId === cat.id);
    for (const item of catItems) {
      const q = item.quantity;
      const tMat = q * item.unitPriceMaterial;
      const tLab = q * item.unitPriceLabor;
      const tMac = q * item.unitPriceMachine;
      const tTotal = tMat + tLab + tMac;
      totalMatAll += tMat;
      totalLabAll += tLab;
      totalMacAll += tMac;

      congTrinhData.push([
        item.stt,
        item.code,
        item.name,
        item.unit,
        q,
        item.unitPriceMaterial,
        item.unitPriceLabor,
        item.unitPriceMachine,
        tMat,
        tLab,
        tMac,
        tTotal
      ]);

      // Thêm các dòng diễn giải con nếu có
      if (item.subCalculations && item.subCalculations.length > 0) {
        for (const sub of item.subCalculations) {
          congTrinhData.push([
            '',
            '',
            `   - ${sub.name}: ${sub.expression}`,
            '',
            sub.quantity,
            '', '', '', '', '', '', ''
          ]);
        }
      }
    }
  }

  congTrinhData.push([
    '', '', 'TỔNG CỘNG CHI PHÍ TRỰC TIẾP TRƯỚC THUẾ', '', '', '', '', '',
    totalMatAll, totalLabAll, totalMacAll, totalMatAll + totalLabAll + totalMacAll
  ]);

  const wsCongTrinh = XLSX.utils.aoa_to_sheet(congTrinhData);
  XLSX.utils.book_append_sheet(wb, wsCongTrinh, 'Bảng Công Trình');

  // 2. SHEET PHÂN TÍCH VẬT TƯ (PTVT)
  const ptvtData: any[] = [
    ['BẢNG PHÂN TÍCH HAO PHÍ VẬT TƯ CHO CÁC CÔNG TÁC'],
    ['STT', 'Mã hiệu', 'Tên công tác / Thành phần hao phí', 'Đơn vị', 'Định mức 1 ĐV', 'Khối lượng CV', 'Tổng hao phí', 'Đơn giá', 'Thành tiền']
  ];

  for (const item of items) {
    ptvtData.push([item.stt, item.code, item.name, item.unit, '', item.quantity, '', '', '']);
    // Vật liệu
    for (const m of item.materials || []) {
      const totalNorm = item.quantity * m.norm;
      ptvtData.push(['', m.code, `  [VL] ${m.name}`, m.unit, m.norm, '', totalNorm, m.price, totalNorm * m.price]);
    }
    // Nhân công
    for (const l of item.labors || []) {
      const totalNorm = item.quantity * l.norm;
      ptvtData.push(['', l.code, `  [NC] ${l.name} (${l.rank})`, l.unit, l.norm, '', totalNorm, l.price, totalNorm * l.price]);
    }
    // Máy
    for (const mac of item.machines || []) {
      const totalNorm = item.quantity * mac.norm;
      ptvtData.push(['', mac.code, `  [MTC] ${mac.name}`, mac.unit, mac.norm, '', totalNorm, mac.price, totalNorm * mac.price]);
    }
  }
  const wsPTVT = XLSX.utils.aoa_to_sheet(ptvtData);
  XLSX.utils.book_append_sheet(wb, wsPTVT, 'Phân Tích Vật Tư');

  // 3. SHEET TỔNG HỢP VẬT TƯ (THVT) & GIÁ THÁNG
  const agg = aggregateMaterials(items);
  const thvtData: any[] = [
    ['BẢNG TỔNG HỢP VẬT TƯ VÀ BÙ GIÁ THÁNG'],
    ['Mã VT', 'Tên vật tư, nhân công, máy', 'Đơn vị', 'Khối lượng tổng', 'Giá gốc', 'Giá tháng', 'Chênh lệch', 'Thành tiền gốc', 'Thành tiền tháng', 'Tiền bù giá']
  ];

  thvtData.push(['---', 'I. PHẦN VẬT LIỆU', '', '', '', '', '', '', '', '']);
  for (const m of agg.materials) {
    thvtData.push([m.code, m.name, m.unit, m.totalQuantity, m.basePrice, m.monthlyPrice, m.diffPrice, m.baseAmount, m.monthlyAmount, m.diffAmount]);
  }

  thvtData.push(['---', 'II. PHẦN NHÂN CÔNG', '', '', '', '', '', '', '', '']);
  for (const l of agg.labors) {
    thvtData.push([l.code, l.name, l.unit, l.totalQuantity, l.basePrice, l.monthlyPrice, l.diffPrice, l.baseAmount, l.monthlyAmount, l.diffAmount]);
  }

  thvtData.push(['---', 'III. PHẦN MÁY THI CÔNG', '', '', '', '', '', '', '', '']);
  for (const mac of agg.machines) {
    thvtData.push([mac.code, mac.name, mac.unit, mac.totalQuantity, mac.basePrice, mac.monthlyPrice, mac.diffPrice, mac.baseAmount, mac.monthlyAmount, mac.diffAmount]);
  }

  const wsTHVT = XLSX.utils.aoa_to_sheet(thvtData);
  XLSX.utils.book_append_sheet(wb, wsTHVT, 'Tổng Hợp Vật Tư');

  // 4. SHEET ĐƠN GIÁ CHI TIẾT
  const dgct = computeDetailedUnitPrices(items, settings);
  const dgctData: any[] = [
    ['BẢNG ĐƠN GIÁ CHI TIẾT (THEO THÔNG TƯ 11/2021/TT-BXD)'],
    [
      'STT', 'Mã hiệu', 'Tên công tác', 'Đơn vị',
      'Chi phí TT (T)', 'Chi phí chung', 'Nhà tạm', 'Không xác định',
      'Chi phí gián tiếp (GT)', 'Thu nhập chịu thuế (TL)', 'Đơn giá trước thuế (G)', 'Thuế VAT', 'Đơn giá sau thuế'
    ]
  ];
  dgct.forEach((d, idx) => {
    dgctData.push([
      idx + 1, d.code, d.name, d.unit,
      d.directCost, d.generalCost, d.temporaryCampCost, d.unallocatedCost,
      d.indirectCostTotal, d.taxableProfit, d.unitPricePreTax, d.vatAmount, d.unitPricePostTax
    ]);
  });
  const wsDGCT = XLSX.utils.aoa_to_sheet(dgctData);
  XLSX.utils.book_append_sheet(wb, wsDGCT, 'Đơn Giá Chi Tiết');

  // 5. SHEET TỔNG HỢP KINH PHÍ (THKP)
  const thkp = computeTHKP(items, settings, categories);
  const thkpData: any[] = [
    ['BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN XÂY DỰNG'],
    [`Tiêu chuẩn áp dụng: ${settings.standardCircular} (Tự động hóa theo loại công trình & danh mục)`],
    ['STT', 'Khoản mục chi phí', 'Ký hiệu', 'Cách tính', 'Thành tiền (VNĐ)'],
    [1, 'Chi phí vật liệu', 'VL', 'Khối lượng * Giá tháng', thkp.directMaterial + thkp.diffMaterial],
    [2, 'Chi phí nhân công', 'NC', 'Khối lượng * Giá NC', thkp.directLabor + thkp.diffLabor],
    [3, 'Chi phí máy thi công', 'M', 'Khối lượng * Giá ca máy', thkp.directMachine + thkp.diffMachine],
    [4, 'CHI PHÍ TRỰC TIẾP', 'T', 'VL + NC + M', thkp.directCostTotal],
    [5, 'Chi phí chung', 'C', `T * ${(thkp.generalCostRate * 100).toFixed(2)}% (${thkp.scaleDescription})`, thkp.generalCost],
    [6, 'Chi phí nhà tạm để ở và điều hành', 'LT', `T * ${(thkp.temporaryCampRate * 100).toFixed(2)}%`, thkp.temporaryCampCost],
    [7, 'Một số công việc không xác định từ TK', 'TT', `T * ${(thkp.unallocatedWorkRate * 100).toFixed(2)}%`, thkp.unallocatedCost],
    [8, 'CHI PHÍ GIÁN TIẾP', 'GT', 'C + LT + TT', thkp.indirectCostTotal],
    [9, 'THU NHẬP CHỊU THUẾ TÍNH TRƯỚC', 'TL', `(T + GT) * ${(thkp.taxableProfitRate * 100).toFixed(2)}%`, thkp.taxableProfit],
    [10, 'CHI PHÍ XÂY DỰNG TRƯỚC THUẾ', 'G', 'T + GT + TL', thkp.preTaxTotal],
    [11, `THUẾ GIÁ TRỊ GIA TĂNG (${thkp.vatRate * 100}%)`, 'VAT', 'G * Thuế suất', thkp.vatAmount],
    [12, 'TỔNG CHI PHÍ XÂY DỰNG SAU THUẾ', 'Gxd', 'G + VAT', thkp.constructionTotal],
    [13, 'Chi phí dự phòng (5%)', 'Gdp', 'Gxd * 5%', thkp.contingencyCost],
    [14, 'TỔNG MỨC ĐẦU TƯ DỰ TOÁN CÔNG TRÌNH', 'TMĐT', 'Gxd + Gdp', thkp.grandTotal]
  ];
  const wsTHKP = XLSX.utils.aoa_to_sheet(thkpData);
  XLSX.utils.book_append_sheet(wb, wsTHKP, 'Tổng Hợp Kinh Phí THKP');

  // 6. SHEET THANH QUYẾT TOÁN 03a & 03b
  const stData: any[] = [
    ['BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH (PHỤ LỤC 03.a & 03.b)'],
    ['Mã hiệu', 'Tên công tác', 'ĐVT', 'Khối lượng HĐ', 'Đơn giá HĐ', 'Lũy kế kỳ trước', 'Thực hiện kỳ này', 'Lũy kế kỳ này', 'Thành tiền kỳ này', 'Loại']
  ];
  for (const s of settlements) {
    const thisAmount = s.thisPeriodQty * s.contractPrice;
    stData.push([
      s.code,
      s.name,
      s.unit,
      s.contractQty,
      s.contractPrice,
      s.prevAccumulatedQty,
      s.thisPeriodQty,
      s.totalAccumulatedQty,
      thisAmount,
      s.isAdditional ? 'Phát sinh (03b)' : 'Trong HĐ (03a)'
    ]);
  }
  const wsSettlement = XLSX.utils.aoa_to_sheet(stData);
  XLSX.utils.book_append_sheet(wb, wsSettlement, 'Thanh Quyết Toán');

  // 7. SHEET TIẾN ĐỘ THI CÔNG
  const ganttData: any[] = [
    ['BẢNG TIẾN ĐỘ VÀ KẾ HOẠCH THI CÔNG CÔNG TRÌNH'],
    ['STT', 'Hạng mục / Công tác', 'Ngày bắt đầu', 'Ngày kết thúc', 'Số ngày', 'Tiến độ %', 'Nhân lực (người/ngày)']
  ];
  tasks.forEach((t, i) => {
    ganttData.push([i + 1, t.name, t.startDate, t.endDate, t.durationDays, `${t.progressPercent}%`, t.workersRequired]);
  });
  const wsGantt = XLSX.utils.aoa_to_sheet(ganttData);
  XLSX.utils.book_append_sheet(wb, wsGantt, 'Tiến Độ Thi Công');

  // Xuất file
  const fileName = `Du_Toan_F1_${settings.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Đọc file Excel người dùng tải lên và nhập dữ liệu vào ứng dụng
 */
export async function parseExcelFile(file: File): Promise<{ items: Partial<WorkItem>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const parsedItems: Partial<WorkItem>[] = [];
        // Tìm dòng tiêu đề cột
        let startRow = 0;
        for (let i = 0; i < Math.min(rawJson.length, 15); i++) {
          const rowStr = JSON.stringify(rawJson[i] || []).toLowerCase();
          if (rowStr.includes('mã') || rowStr.includes('tên công tác') || rowStr.includes('đơn vị')) {
            startRow = i + 1;
            break;
          }
        }

        for (let i = startRow; i < rawJson.length; i++) {
          const row = rawJson[i];
          if (!row || row.length === 0) continue;
          
          // Giả định định dạng cột thông dụng: STT, Mã hiệu, Tên, Đơn vị, Khối lượng, Giá VL, Giá NC, Giá Máy
          const code = String(row[1] || '').trim();
          const name = String(row[2] || '').trim();
          const unit = String(row[3] || '').trim();
          const qty = Number(row[4]) || 0;
          const matPrice = Number(row[5]) || 0;
          const labPrice = Number(row[6]) || 0;
          const macPrice = Number(row[7]) || 0;

          if (name && (code || qty > 0)) {
            parsedItems.push({
              code: code || 'AF.TEMP',
              name,
              unit: unit || 'công tác',
              quantity: qty,
              unitPriceMaterial: matPrice,
              unitPriceLabor: labPrice,
              unitPriceMachine: macPrice,
              subCalculations: [],
              materials: [],
              labors: [],
              machines: []
            });
          }
        }
        resolve({ items: parsedItems });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Tải file Excel mẫu chuẩn (.xlsx) để người dùng điền số liệu và nạp lên phần mềm
 */
export function exportSampleExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const templateData = [
    ['BẢNG DỰ TOÁN CHI PHÍ XÂY DỰNG CÔNG TRÌNH (FILE MẪU NHẬP LIỆU F1 PRO)'],
    ['Căn cứ định mức: Thông tư 12/2021/TT-BXD của Bộ Xây dựng'],
    ['Lưu ý: Giữ nguyên các tiêu đề cột tại dòng 5. Nhập số liệu công tác từ dòng 6 trở đi.'],
    [''],
    [
      'STT', 
      'Mã hiệu', 
      'Tên công tác & quy cách', 
      'Đơn vị', 
      'Khối lượng', 
      'Đơn giá Vật liệu', 
      'Đơn giá Nhân công', 
      'Đơn giá Máy thi công',
      'Ghi chú'
    ],
    [1, 'AA.11111', 'Phát hoang dọn dẹp mặt bằng bằng thủ công', '100m2', 4.5, 0, 185000, 0, 'Chuẩn bị mặt bằng'],
    [2, 'AB.21121', 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II', 'm3', 68.4, 0, 245000, 45000, 'Móng M1, M2'],
    [3, 'AF.11111', 'Bê tông lót móng đá 4x6 mác 100, vữa XM PC30', 'm3', 6.8, 920000, 185000, 42000, 'Lót đáy móng'],
    [4, 'AF.12210', 'Bê tông móng đá 1x2 mác 200, vữa XM PC40', 'm3', 38.5, 1365000, 210000, 75000, 'Thân móng BTCT'],
    [5, 'AF.61120', 'Sản xuất, lắp dựng cốt thép móng đường kính <= 18mm', 'tấn', 3.45, 16800000, 2850000, 450000, 'Thép móng phi 14-16'],
    [6, 'AF.12320', 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250', 'm3', 28.8, 1420000, 265000, 85000, 'Cột các tầng'],
    [7, 'BB.11111', 'Xây tường gạch ống 8x8x19 dày 10cm, vữa XM mác 75', 'm3', 64.0, 1250000, 445000, 0, 'Tường ngăn phòng'],
    [8, 'AK.51110', 'Trát tường trong dày 1.5cm, vữa xi măng mác 75', 'm2', 320.0, 32000, 68000, 0, 'Hoàn thiện trát trong']
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã hiệu
    { wch: 55 }, // Tên công tác
    { wch: 10 }, // Đơn vị
    { wch: 12 }, // Khối lượng
    { wch: 18 }, // Đơn giá VL
    { wch: 18 }, // Đơn giá NC
    { wch: 18 }, // Đơn giá Máy
    { wch: 22 }, // Ghi chú
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bảng Công Trình');
  XLSX.writeFile(wb, 'File_Mau_Nhap_Du_Toan_F1_Chuan.xlsx');
}

