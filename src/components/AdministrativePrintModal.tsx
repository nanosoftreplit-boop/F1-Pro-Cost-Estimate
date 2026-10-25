import React, { useState, useRef, useMemo } from 'react';
import { 
  WorkItem, ProjectSettings, Category, SettlementItem, 
  GanttTask, AuditDiffItem, AdminReportConfig 
} from '../types/estimate';
import { computeTHKP, formatVND, formatQuantity, aggregateMaterials } from '../utils/calculator';
import { 
  Printer, X, Download, Sliders, Check, FileText, 
  Building2, Calendar, MapPin, Eye, RefreshCw, Sparkles, Layers,
  ChevronDown, HelpCircle, CheckCircle2
} from 'lucide-react';

interface AdministrativePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
  settlements?: SettlementItem[];
  tasks?: GanttTask[];
  auditDiffs?: AuditDiffItem[];
  onOpenSettingsModal?: (tab?: 'technical' | 'admin_print') => void;
}

export type PrintableSheetType = 
  | 'current'
  | 'thkp' 
  | 'cong-trinh' 
  | 'thvt' 
  | 'dgct' 
  | 'du-thau' 
  | 'ptvt' 
  | 'tham-tra' 
  | 'quyet-toan' 
  | 'tien-do';

export const AdministrativePrintModal: React.FC<AdministrativePrintModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  items,
  categories,
  settings,
  settlements = [],
  tasks = [],
  auditDiffs = [],
  onOpenSettingsModal,
}) => {
  // Mặc định chọn in bảng tính hiện tại
  const [selectedSheet, setSelectedSheet] = useState<PrintableSheetType>('current');
  const [paperSize, setPaperSize] = useState<'landscape' | 'portrait'>(() => {
    return settings.adminReportConfig?.paperOrientation || 'landscape';
  });
  const [showSignatures, setShowSignatures] = useState<boolean>(() => {
    return settings.adminReportConfig?.showSignatures !== false;
  });
  const [showSubCalculations, setShowSubCalculations] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Xác định sheet thực tế cần hiển thị
  const activeSheetType = selectedSheet === 'current' ? (currentTab as PrintableSheetType) : selectedSheet;

  // Cấu hình hành chính từ ProjectSettings
  const admin: AdminReportConfig = useMemo(() => {
    const existing = settings.adminReportConfig || {};
    return {
      documentTitle: existing.documentTitle || 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH',
      documentSubTitle: existing.documentSubTitle || 'Căn cứ Nghị định số 10/2021/NĐ-CP & Thông tư số 11/2021/TT-BXD, TT 12/2021/TT-BXD',
      documentNumber: existing.documentNumber || 'Số: .../TTr-DA',
      superiorAgency: existing.superiorAgency || 'UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG',
      consultantUnit: existing.consultantUnit || settings.contractor || 'Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam',
      investorUnit: existing.investorUnit || settings.investor || 'Ban Quản lý Dự án Đầu tư Xây dựng',
      appraisalUnit: existing.appraisalUnit || 'Sở Xây dựng / Chi cục Giám định Xây dựng',
      creatorName: existing.creatorName || 'KS. Nguyễn Văn An',
      creatorTitle: existing.creatorTitle || 'Kỹ sư Định giá Xây dựng',
      chiefEngineer: existing.chiefEngineer || 'ThS. Trần Quốc Bảo',
      chiefEngineerTitle: existing.chiefEngineerTitle || 'Chủ trì Lập dự toán',
      approverName: existing.approverName || 'TS. Lê Hoàng Nam',
      approverTitle: existing.approverTitle || 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN',
      signDatePlace: existing.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
      nationalHeaderLine1: existing.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
      nationalHeaderLine2: existing.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc',
      paperOrientation: existing.paperOrientation || 'landscape',
      showSignatures: existing.showSignatures !== false
    };
  }, [settings]);

  // Dữ liệu tính toán THKP
  const thkp = useMemo(() => computeTHKP(items, settings, categories), [items, settings, categories]);

  // Tổng hợp vật tư
  const aggregated = useMemo(() => aggregateMaterials(items), [items]);

  if (!isOpen) return null;

  // Lấy tiêu đề tương ứng với sheet đang in
  const getSheetTitle = (): { mainTitle: string; subCode: string } => {
    switch (activeSheetType) {
      case 'thkp':
        return {
          mainTitle: admin.documentTitle || 'BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN XÂY DỰNG',
          subCode: 'Biểu số: 06/THKP - Ban hành kèm theo Thông tư 11/2021/TT-BXD'
        };
      case 'cong-trinh':
        return {
          mainTitle: 'BẢNG TIÊN LƯỢNG & DỰ TOÁN CHI TIẾT KHỐI LƯỢNG CÔNG TRÌNH',
          subCode: 'Biểu số: 01/DT-KL - Căn cứ định mức Thông tư số 12/2021/TT-BXD'
        };
      case 'thvt':
        return {
          mainTitle: 'BẢNG TỔNG HỢP & CHÊNH LỆCH VẬT TƯ (VẬT LIỆU, NHÂN CÔNG, MÁY)',
          subCode: 'Biểu số: 03/THVT - Áp dụng giá thông báo tháng Sở Xây dựng'
        };
      case 'dgct':
        return {
          mainTitle: 'BẢNG PHÂN TÍCH ĐƠN GIÁ XÂY DỰNG CHI TIẾT',
          subCode: 'Biểu số: 04/DGCT - Thông tư 11/2021/TT-BXD & TT 12/2021/TT-BXD'
        };
      case 'du-thau':
        return {
          mainTitle: 'BẢNG GIÁ DỰ THẦU & ĐƠN GIÁ TỔNG HỢP ĐẦY ĐỦ',
          subCode: 'Mẫu biểu số 05/DTH - Luật Đấu thầu số 22/2023/QH15 & Nghị định 24/2024/NĐ-CP'
        };
      case 'ptvt':
        return {
          mainTitle: 'BẢNG PHÂN TÍCH HAO PHÍ ĐỊNH MỨC VẬT TƯ CHO TỪNG CÔNG TÁC',
          subCode: 'Biểu số: 02/PTVT - Chuẩn Thông tư số 12/2021/TT-BXD'
        };
      case 'tham-tra':
        return {
          mainTitle: 'BÁO CÁO KẾT QUẢ THẨM TRA & SO SÁNH SAI LỆCH DỰ TOÁN',
          subCode: 'Mẫu biểu: 01/TTr-KTXD - Nghị định 10/2021/NĐ-CP & TT 11/2021/TT-BXD'
        };
      case 'quyet-toan':
        return {
          mainTitle: 'BẢNG XÁC ĐỊNH GIÁ TRỊ KHỐI LƯỢNG CÔNG VIỆC HOÀN THÀNH (MẪU 03a/03b)',
          subCode: 'Phụ lục kèm theo Nghị định số 99/2021/NĐ-CP về thanh toán vốn đầu tư'
        };
      case 'tien-do':
        return {
          mainTitle: 'BẢNG TIẾN ĐỘ THI CÔNG & KẾ HOẠCH GIẢI NGÂN DỰ ÁN',
          subCode: 'Biểu tiến độ thi công tổng thể công trình xây dựng'
        };
      default:
        return {
          mainTitle: admin.documentTitle || 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH',
          subCode: admin.documentSubTitle || 'Căn cứ Thông tư số 11/2021/TT-BXD & TT 12/2021/TT-BXD'
        };
    }
  };

  const sheetTitleInfo = getSheetTitle();

  // Kích hoạt In ấn chuẩn trình duyệt (Browser Print -> Save as PDF)
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Tải file HTML in ấn độc lập
  const handleDownloadStandaloneHtml = () => {
    const printDoc = document.getElementById('admin-print-document');
    if (!printDoc) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${settings.projectName} - ${sheetTitleInfo.mainTitle}</title>
  <style>
    @page {
      size: A4 ${paperSize};
      margin: 12mm 10mm 12mm 10mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px 6px;
      font-size: 9.5pt;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .font-bold { font-weight: bold; }
    .italic { font-style: italic; }
    .uppercase { text-transform: uppercase; }
    .national-line {
      width: 140px;
      height: 1px;
      background-color: #000;
      margin: 2px auto 6px auto;
    }
    .unit-line {
      width: 80px;
      height: 1px;
      background-color: #000;
      margin: 2px auto 6px auto;
    }
  </style>
</head>
<body>
  ${printDoc.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mau_In_Hanh_Chinh_${activeSheetType.toUpperCase()}_${settings.projectName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-xs select-none">
      {/* Print Overlay CSS: Injected directly into head during render */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #admin-print-document,
          #admin-print-document * {
            visibility: visible !important;
          }
          #admin-print-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4 ${paperSize};
            margin: 12mm 10mm 12mm 10mm;
          }
        }
      `}</style>

      {/* Top Navigation & Print Controls Toolbar (Hidden in print) */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800 text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30">
            <Printer className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white uppercase">
                XUẤT BẢNG TÍNH PDF - THEO MẪU IN HÀNH CHÍNH NHÀ NƯỚC
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                Nghị định 30/2020/NĐ-CP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Biểu mẫu chuẩn Quốc hiệu, Tiêu ngữ, Bảng kẻ, Đơn vị thực hiện và Khối ký duyệt thẩm tra phê duyệt
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Chọn Bảng tính cần in */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 font-medium">Bảng in:</span>
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value as PrintableSheetType)}
              className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="current" className="bg-slate-900 text-white">
                Bảng tính hiện tại ({currentTab})
              </option>
              <option value="thkp" className="bg-slate-900 text-white">1. Bảng Tổng hợp kinh phí (THKP)</option>
              <option value="cong-trinh" className="bg-slate-900 text-white">2. Bảng Dự toán khối lượng (Công trình)</option>
              <option value="ptvt" className="bg-slate-900 text-white">3. Bảng Phân tích hao phí vật tư</option>
              <option value="thvt" className="bg-slate-900 text-white">4. Bảng Tổng hợp & Chênh lệch VT</option>
              <option value="dgct" className="bg-slate-900 text-white">5. Bảng Đơn giá chi tiết (DGCT)</option>
              <option value="du-thau" className="bg-slate-900 text-white">6. Bảng Giá dự thầu</option>
              <option value="tham-tra" className="bg-slate-900 text-white">7. Báo cáo Thẩm tra sai lệch</option>
              <option value="quyet-toan" className="bg-slate-900 text-white">8. Bảng Quyết toán (Mẫu 03a/03b)</option>
              <option value="tien-do" className="bg-slate-900 text-white">9. Bảng Tiến độ thi công</option>
            </select>
          </div>

          {/* Chọn Hướng giấy A4 */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setPaperSize('landscape')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                paperSize === 'landscape' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              A4 Ngang
            </button>
            <button
              onClick={() => setPaperSize('portrait')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                paperSize === 'portrait' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              A4 Dọc
            </button>
          </div>

          {/* Toggle Chữ ký */}
          <label className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showSignatures}
              onChange={(e) => setShowSignatures(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Khối chữ ký</span>
          </label>

          {/* Tùy chỉnh thông tin hành chính trong ProjectSettings */}
          {onOpenSettingsModal && (
            <button
              onClick={() => onOpenSettingsModal('admin_print')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Sửa tiêu đề văn bản, tên đơn vị tư vấn, cơ quan phê duyệt trong ProjectSettings"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Sửa Tiêu đề & Đơn vị</span>
            </button>
          )}

          {/* Tải HTML */}
          <button
            onClick={handleDownloadStandaloneHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Tải file HTML độc lập có thể xem offline hoặc gửi qua email"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Tải file HTML</span>
          </button>

          {/* NÚT IN CHÍNH / LƯU PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-950 transition-all cursor-pointer"
            title="In ra máy in vật lý hoặc Chọn 'Save as PDF' trong hộp thoại in"
          >
            <Printer className="w-4 h-4" />
            <span>IN ẤN / XUẤT RA FILE PDF</span>
          </button>

          {/* Đóng Modal */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container (Scrollable) */}
      <div className="flex-1 overflow-auto bg-slate-900/80 p-6 flex justify-center items-start">
        {/* Printable Paper Document (Authentic State Administrative Styling) */}
        <div
          id="admin-print-document"
          className={`bg-white text-black shadow-2xl transition-all duration-200 ${
            paperSize === 'landscape' 
              ? 'w-[1120px] min-h-[792px] p-10' 
              : 'w-[820px] min-h-[1160px] p-10'
          }`}
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* ============================================================== */}
          {/* PHẦN 1: QUỐC HIỆU, TIÊU NGỮ & ĐƠN VỊ THỰC HIỆN (THEO NĐ 30/2020) */}
          {/* ============================================================== */}
          <div className="flex items-start justify-between pb-4 border-b border-black/20">
            {/* Góc trái: Cơ quan & Đơn vị thực hiện */}
            <div className="text-center w-[45%] text-[12pt] leading-tight">
              <div className="uppercase font-normal text-[10.5pt] tracking-tight">
                {admin.superiorAgency || 'UBND THÀNH PHỐ HÀ NỘI'}
              </div>
              <div className="uppercase font-bold text-[11.5pt] mt-0.5 tracking-tight">
                {admin.consultantUnit || settings.contractor || 'CÔNG TY CP TƯ VẤN & XÂY DỰNG F1'}
              </div>
              <div className="w-24 h-[1px] bg-black mx-auto my-1" />
              <div className="text-[10pt] font-mono italic mt-1">
                {admin.documentNumber || 'Số: .../TTr-DA'}
              </div>
            </div>

            {/* Góc phải: Quốc hiệu & Tiêu ngữ */}
            <div className="text-center w-[50%] text-[12pt] leading-tight">
              <div className="uppercase font-bold text-[11pt] tracking-wider">
                {admin.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'}
              </div>
              <div className="font-bold text-[11.5pt] mt-0.5">
                {admin.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc'}
              </div>
              <div className="w-36 h-[1px] bg-black mx-auto my-1" />
              <div className="text-[10pt] italic mt-1">
                {admin.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày 21 tháng 10 năm 2026`}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PHẦN 2: TIÊU ĐỀ VĂN BẢN / HỒ SƠ DỰ TOÁN */}
          {/* ============================================================== */}
          <div className="text-center my-6 space-y-1">
            <h1 className="text-[16pt] font-bold uppercase tracking-tight text-black">
              {sheetTitleInfo.mainTitle}
            </h1>
            <p className="text-[11pt] italic text-neutral-800">
              ({admin.documentSubTitle || sheetTitleInfo.subCode})
            </p>
          </div>

          {/* ============================================================== */}
          {/* PHẦN 3: THÔNG TIN DỰ ÁN & ĐƠN GIÁ ĐỊNH MỨC ÁP DỤNG */}
          {/* ============================================================== */}
          <div className="mb-6 text-[10.5pt] leading-relaxed border border-black/40 p-3.5 bg-neutral-50/50">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <span className="font-bold">Tên công trình:</span>{' '}
                <span>{settings.projectName}</span>
              </div>
              <div>
                <span className="font-bold">Địa điểm xây dựng:</span>{' '}
                <span>{settings.locationProvince} (Vùng lương {settings.salaryRegion})</span>
              </div>
              <div>
                <span className="font-bold">Chủ đầu tư:</span>{' '}
                <span>{admin.investorUnit || settings.investor}</span>
              </div>
              <div>
                <span className="font-bold">Đơn vị lập dự toán:</span>{' '}
                <span>{admin.consultantUnit || settings.contractor}</span>
              </div>
              <div>
                <span className="font-bold">Loại công trình:</span>{' '}
                <span className="capitalize">{settings.projectType} (Theo NĐ 10/2021 &amp; TT 11/2021)</span>
              </div>
              <div>
                <span className="font-bold">Tiêu chuẩn định mức:</span>{' '}
                <span>{settings.standardCircular}</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PHẦN 4: NỘI DUNG TOÀN BỘ BẢNG TÍNH HIỆN TẠI (THEO TỪNG SHEET) */}
          {/* ============================================================== */}
          <div className="w-full text-[10pt] mb-8">
            {/* SHEET 1: TỔNG HỢP KINH PHÍ (THKP) */}
            {activeSheetType === 'thkp' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-12">STT</th>
                    <th className="border border-black p-2 text-left">KHOẢN MỤC CHI PHÍ</th>
                    <th className="border border-black p-2 w-16">KÝ HIỆU</th>
                    <th className="border border-black p-2 text-left">PHƯƠNG PHÁP XÁC ĐỊNH / CÔNG THỨC</th>
                    <th className="border border-black p-2 w-48 text-right">THÀNH TIỀN (ĐỒNG)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 text-center">1</td>
                    <td className="border border-black p-2">Chi phí vật liệu</td>
                    <td className="border border-black p-2 text-center font-bold">VL</td>
                    <td className="border border-black p-2">Khối lượng × Giá tháng công bố</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.directMaterial + thkp.diffMaterial)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">2</td>
                    <td className="border border-black p-2">Chi phí nhân công</td>
                    <td className="border border-black p-2 text-center font-bold">NC</td>
                    <td className="border border-black p-2">Khối lượng × Giá NC Vùng {settings.salaryRegion}</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.directLabor + thkp.diffLabor)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">3</td>
                    <td className="border border-black p-2">Chi phí máy thi công</td>
                    <td className="border border-black p-2 text-center font-bold">M</td>
                    <td className="border border-black p-2">Khối lượng × Giá ca máy công bố</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.directMachine + thkp.diffMachine)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-100">
                    <td className="border border-black p-2 text-center">I</td>
                    <td className="border border-black p-2 uppercase">CHI PHÍ TRỰC TIẾP</td>
                    <td className="border border-black p-2 text-center">T</td>
                    <td className="border border-black p-2">VL + NC + M</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.directCostTotal)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">4</td>
                    <td className="border border-black p-2">Chi phí chung (nội suy TT11/2021)</td>
                    <td className="border border-black p-2 text-center font-bold">C</td>
                    <td className="border border-black p-2">T × {(thkp.generalCostRate * 100).toFixed(2)}% ({thkp.scaleDescription})</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.generalCost)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">5</td>
                    <td className="border border-black p-2">Chi phí nhà tạm để ở và điều hành thi công</td>
                    <td className="border border-black p-2 text-center font-bold">LT</td>
                    <td className="border border-black p-2">T × {(thkp.temporaryCampRate * 100).toFixed(2)}% ({thkp.isLineProject ? 'Công trình tuyến 2.2%' : 'Tại chỗ 1.2%'})</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.temporaryCampCost)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">6</td>
                    <td className="border border-black p-2">Một số công việc không xác định được khối lượng từ thiết kế</td>
                    <td className="border border-black p-2 text-center font-bold">TT</td>
                    <td className="border border-black p-2">T × {(thkp.unallocatedWorkRate * 100).toFixed(2)}% (Bảng 3.2 TT 11)</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.unallocatedCost)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-100">
                    <td className="border border-black p-2 text-center">II</td>
                    <td className="border border-black p-2 uppercase">CHI PHÍ GIÁN TIẾP</td>
                    <td className="border border-black p-2 text-center">GT</td>
                    <td className="border border-black p-2">C + LT + TT</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.indirectCostTotal)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-100">
                    <td className="border border-black p-2 text-center">III</td>
                    <td className="border border-black p-2 uppercase">THU NHẬP CHỊU THUẾ TÍNH TRƯỚC</td>
                    <td className="border border-black p-2 text-center">TL</td>
                    <td className="border border-black p-2">(T + GT) × {(thkp.taxableProfitRate * 100).toFixed(2)}%</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.taxableProfit)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-200">
                    <td className="border border-black p-2 text-center">IV</td>
                    <td className="border border-black p-2 uppercase">CHI PHÍ XÂY DỰNG TRƯỚC THUẾ</td>
                    <td className="border border-black p-2 text-center">G</td>
                    <td className="border border-black p-2">T + GT + TL</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.preTaxTotal)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">V</td>
                    <td className="border border-black p-2 font-bold">Thuế giá trị gia tăng (VAT {(thkp.vatRate * 100).toFixed(0)}%)</td>
                    <td className="border border-black p-2 text-center font-bold">VAT</td>
                    <td className="border border-black p-2">G × {(thkp.vatRate * 100).toFixed(0)}%</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.vatAmount)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-200">
                    <td className="border border-black p-2 text-center">VI</td>
                    <td className="border border-black p-2 uppercase">TỔNG CHI PHÍ XÂY DỰNG SAU THUẾ</td>
                    <td className="border border-black p-2 text-center">Gxd</td>
                    <td className="border border-black p-2">G + VAT</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.constructionTotal)}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 text-center">VII</td>
                    <td className="border border-black p-2">Chi phí dự phòng (5%)</td>
                    <td className="border border-black p-2 text-center font-bold">Gdp</td>
                    <td className="border border-black p-2">Gxd × 5% (Trượt giá &amp; khối lượng phát sinh)</td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.contingencyCost)}</td>
                  </tr>
                  <tr className="font-bold bg-neutral-300 text-[11pt]">
                    <td className="border border-black p-2.5 text-center">VIII</td>
                    <td className="border border-black p-2.5 uppercase">TỔNG MỨC ĐẦU TƯ DỰ TOÁN CÔNG TRÌNH</td>
                    <td className="border border-black p-2.5 text-center">TMĐT</td>
                    <td className="border border-black p-2.5">Gxd + Gdp</td>
                    <td className="border border-black p-2.5 text-right font-bold">{formatVND(thkp.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* SHEET 2: BẢNG DỰ TOÁN CÔNG TRÌNH (KHỐI LƯỢNG) */}
            {activeSheetType === 'cong-trinh' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-10">STT</th>
                    <th className="border border-black p-2 w-24">Mã hiệu</th>
                    <th className="border border-black p-2 text-left">Nội dung công tác &amp; Diễn giải chi tiết</th>
                    <th className="border border-black p-2 w-16">ĐVT</th>
                    <th className="border border-black p-2 w-20 text-right">Khối lượng</th>
                    <th className="border border-black p-2 w-28 text-right">Đơn giá VL</th>
                    <th className="border border-black p-2 w-28 text-right">Đơn giá NC</th>
                    <th className="border border-black p-2 w-28 text-right">Đơn giá Máy</th>
                    <th className="border border-black p-2 w-32 text-right">Thành tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, catIdx) => {
                    const catItems = items.filter(it => it.categoryId === cat.id);
                    const catTotal = catItems.reduce((sum, it) => {
                      const totalUnitPrice = it.unitPriceMaterial + it.unitPriceLabor + it.unitPriceMachine;
                      return sum + (it.quantity * totalUnitPrice);
                    }, 0);

                    return (
                      <React.Fragment key={cat.id}>
                        {/* Dòng Tiêu đề Hạng mục */}
                        <tr className="font-bold bg-neutral-200">
                          <td className="border border-black p-2 text-center">{String.fromCharCode(65 + catIdx)}</td>
                          <td colSpan={7} className="border border-black p-2 text-left uppercase">
                            {cat.name}
                          </td>
                          <td className="border border-black p-2 text-right">{formatVND(catTotal)}</td>
                        </tr>

                        {/* Các công tác trong hạng mục */}
                        {catItems.map((item, itemIdx) => {
                          const unitPrice = item.unitPriceMaterial + item.unitPriceLabor + item.unitPriceMachine;
                          const lineTotal = item.quantity * unitPrice;

                          return (
                            <React.Fragment key={item.id}>
                              <tr>
                                <td className="border border-black p-1.5 text-center">{itemIdx + 1}</td>
                                <td className="border border-black p-1.5 text-center font-bold font-mono text-[9pt]">
                                  {item.code}
                                </td>
                                <td className="border border-black p-1.5 text-left font-medium">
                                  {item.name}
                                </td>
                                <td className="border border-black p-1.5 text-center">{item.unit}</td>
                                <td className="border border-black p-1.5 text-right font-bold">
                                  {formatQuantity(item.quantity)}
                                </td>
                                <td className="border border-black p-1.5 text-right">{formatVND(item.unitPriceMaterial)}</td>
                                <td className="border border-black p-1.5 text-right">{formatVND(item.unitPriceLabor)}</td>
                                <td className="border border-black p-1.5 text-right">{formatVND(item.unitPriceMachine)}</td>
                                <td className="border border-black p-1.5 text-right font-bold">{formatVND(lineTotal)}</td>
                              </tr>

                              {/* Dòng diễn giải con (kích thước dài x rộng x cao) */}
                              {showSubCalculations && item.subCalculations && item.subCalculations.map((sub, sIdx) => (
                                <tr key={sub.id || sIdx} className="italic text-[9pt] text-neutral-700 bg-neutral-50/50">
                                  <td className="border border-black/40 p-1 text-center"></td>
                                  <td className="border border-black/40 p-1 text-center text-neutral-500">-</td>
                                  <td className="border border-black/40 p-1 pl-4 text-left">
                                    {sub.name}: <span className="font-mono not-italic">{sub.expression}</span>
                                  </td>
                                  <td className="border border-black/40 p-1 text-center">{item.unit}</td>
                                  <td className="border border-black/40 p-1 text-right font-mono font-normal">
                                    {formatQuantity(sub.quantity)}
                                  </td>
                                  <td colSpan={4} className="border border-black/40 p-1"></td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-200 font-bold text-[10.5pt]">
                    <td colSpan={4} className="border border-black p-2 text-center uppercase">
                      TỔNG CỘNG CHI PHÍ TRỰC TIẾP (T):
                    </td>
                    <td colSpan={4} className="border border-black p-2 text-right"></td>
                    <td className="border border-black p-2 text-right">{formatVND(thkp.directCostTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            {/* SHEET 3: BẢNG TỔNG HỢP VẬT TƯ (THVT) */}
            {activeSheetType === 'thvt' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-10">STT</th>
                    <th className="border border-black p-2 w-24">Mã VT</th>
                    <th className="border border-black p-2 text-left">Tên vật tư, quy cách kỹ thuật</th>
                    <th className="border border-black p-2 w-16">ĐVT</th>
                    <th className="border border-black p-2 w-24 text-right">Khối lượng</th>
                    <th className="border border-black p-2 w-28 text-right">Giá gốc</th>
                    <th className="border border-black p-2 w-28 text-right">Giá thông báo</th>
                    <th className="border border-black p-2 w-28 text-right">Chênh lệch</th>
                    <th className="border border-black p-2 w-32 text-right">Thành tiền TT (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* PHẦN I: VẬT LIỆU */}
                  <tr className="bg-neutral-200 font-bold">
                    <td className="border border-black p-1.5 text-center">I</td>
                    <td colSpan={7} className="border border-black p-1.5 uppercase">VẬT LIỆU XÂY DỰNG</td>
                    <td className="border border-black p-1.5 text-right font-bold">
                      {formatVND(aggregated.materials.reduce((s, m) => s + m.monthlyAmount, 0))}
                    </td>
                  </tr>
                  {aggregated.materials.map((m, idx) => (
                    <tr key={idx}>
                      <td className="border border-black p-1 text-center">{idx + 1}</td>
                      <td className="border border-black p-1 text-center font-mono text-[9pt]">{m.code}</td>
                      <td className="border border-black p-1 text-left font-medium">{m.name}</td>
                      <td className="border border-black p-1 text-center">{m.unit}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatQuantity(m.totalQuantity)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(m.basePrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(m.monthlyPrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(m.diffPrice)}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatVND(m.monthlyAmount)}</td>
                    </tr>
                  ))}

                  {/* PHẦN II: NHÂN CÔNG */}
                  <tr className="bg-neutral-200 font-bold">
                    <td className="border border-black p-1.5 text-center">II</td>
                    <td colSpan={7} className="border border-black p-1.5 uppercase">NHÂN CÔNG XÂY DỰNG</td>
                    <td className="border border-black p-1.5 text-right font-bold">
                      {formatVND(aggregated.labors.reduce((s, m) => s + m.monthlyAmount, 0))}
                    </td>
                  </tr>
                  {aggregated.labors.map((l, idx) => (
                    <tr key={idx}>
                      <td className="border border-black p-1 text-center">{idx + 1}</td>
                      <td className="border border-black p-1 text-center font-mono text-[9pt]">{l.code}</td>
                      <td className="border border-black p-1 text-left font-medium">{l.name}</td>
                      <td className="border border-black p-1 text-center">{l.unit}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatQuantity(l.totalQuantity)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(l.basePrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(l.monthlyPrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(l.diffPrice)}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatVND(l.monthlyAmount)}</td>
                    </tr>
                  ))}

                  {/* PHẦN III: MÁY THI CÔNG */}
                  <tr className="bg-neutral-200 font-bold">
                    <td className="border border-black p-1.5 text-center">III</td>
                    <td colSpan={7} className="border border-black p-1.5 uppercase">MÁY THI CÔNG</td>
                    <td className="border border-black p-1.5 text-right font-bold">
                      {formatVND(aggregated.machines.reduce((s, m) => s + m.monthlyAmount, 0))}
                    </td>
                  </tr>
                  {aggregated.machines.map((mac, idx) => (
                    <tr key={idx}>
                      <td className="border border-black p-1 text-center">{idx + 1}</td>
                      <td className="border border-black p-1 text-center font-mono text-[9pt]">{mac.code}</td>
                      <td className="border border-black p-1 text-left font-medium">{mac.name}</td>
                      <td className="border border-black p-1 text-center">{mac.unit}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatQuantity(mac.totalQuantity)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(mac.basePrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(mac.monthlyPrice)}</td>
                      <td className="border border-black p-1 text-right">{formatVND(mac.diffPrice)}</td>
                      <td className="border border-black p-1 text-right font-bold">{formatVND(mac.monthlyAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* CÁC SHEET KHÁC (DỰ THẦU, THẨM TRA, QUYẾT TOÁN, ĐƠN GIÁ...) */}
            {activeSheetType === 'du-thau' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-12">STT</th>
                    <th className="border border-black p-2 w-24">Mã hiệu</th>
                    <th className="border border-black p-2 text-left">Danh mục công tác mời thầu</th>
                    <th className="border border-black p-2 w-16">ĐVT</th>
                    <th className="border border-black p-2 w-24 text-right">Khối lượng</th>
                    <th className="border border-black p-2 w-32 text-right">Đơn giá dự thầu</th>
                    <th className="border border-black p-2 w-36 text-right">Thành tiền dự thầu</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => {
                    const fullRate = (it.unitPriceMaterial + it.unitPriceLabor + it.unitPriceMachine) * 1.15;
                    const amount = it.quantity * fullRate;
                    return (
                      <tr key={it.id}>
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2 text-center font-mono">{it.code}</td>
                        <td className="border border-black p-2 font-medium">{it.name}</td>
                        <td className="border border-black p-2 text-center">{it.unit}</td>
                        <td className="border border-black p-2 text-right font-bold">{formatQuantity(it.quantity)}</td>
                        <td className="border border-black p-2 text-right">{formatVND(fullRate)}</td>
                        <td className="border border-black p-2 text-right font-bold">{formatVND(amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeSheetType === 'tham-tra' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-12">STT</th>
                    <th className="border border-black p-2 w-24">Mã hiệu</th>
                    <th className="border border-black p-2 text-left">Tên công việc thẩm tra</th>
                    <th className="border border-black p-2 w-20 text-right">KL Hồ sơ</th>
                    <th className="border border-black p-2 w-20 text-right">KL Thẩm tra</th>
                    <th className="border border-black p-2 w-20 text-right">Chênh lệch</th>
                    <th className="border border-black p-2 w-28 text-right">Đơn giá</th>
                    <th className="border border-black p-2 w-32 text-right">Tiền chênh lệch</th>
                  </tr>
                </thead>
                <tbody>
                  {auditDiffs.map((diff, idx) => {
                    const diffQty = diff.diffQty ?? (diff.auditQty - diff.originalQty);
                    const unitPrice = diff.auditMatPrice || 0;
                    const diffAmount = diff.diffTotal ?? (diffQty * unitPrice);
                    return (
                      <tr key={idx}>
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2 text-center font-mono">{diff.code}</td>
                        <td className="border border-black p-2 font-medium">{diff.name}</td>
                        <td className="border border-black p-2 text-right">{formatQuantity(diff.originalQty)}</td>
                        <td className="border border-black p-2 text-right font-bold">{formatQuantity(diff.auditQty)}</td>
                        <td className="border border-black p-2 text-right font-bold text-red-700">{formatQuantity(diffQty)}</td>
                        <td className="border border-black p-2 text-right">{formatVND(unitPrice)}</td>
                        <td className="border border-black p-2 text-right font-bold text-red-700">{formatVND(diffAmount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeSheetType === 'quyet-toan' && (
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-center">
                    <th className="border border-black p-2 w-12">STT</th>
                    <th className="border border-black p-2 text-left">Nội dung công việc nghiệm thu</th>
                    <th className="border border-black p-2 w-16">ĐVT</th>
                    <th className="border border-black p-2 w-20 text-right">KL Hợp đồng</th>
                    <th className="border border-black p-2 w-28 text-right">Đơn giá HĐ</th>
                    <th className="border border-black p-2 w-20 text-right">KL Lũy kế</th>
                    <th className="border border-black p-2 w-32 text-right">Thành tiền nghiệm thu</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td className="border border-black p-2 text-center">{idx + 1}</td>
                      <td className="border border-black p-2 font-medium">{s.name}</td>
                      <td className="border border-black p-2 text-center">{s.unit}</td>
                      <td className="border border-black p-2 text-right">{formatQuantity(s.contractQty)}</td>
                      <td className="border border-black p-2 text-right">{formatVND(s.contractPrice)}</td>
                      <td className="border border-black p-2 text-right font-bold">{formatQuantity(s.totalAccumulatedQty)}</td>
                      <td className="border border-black p-2 text-right font-bold">{formatVND(s.totalAccumulatedQty * s.contractPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ============================================================== */}
          {/* PHẦN 5: KHỐI CHỮ KÝ HÀNH CHÍNH NHÀ NƯỚC (THEO NĐ 30/2020/NĐ-CP) */}
          {/* ============================================================== */}
          {showSignatures && (
            <div className="mt-12 pt-4 page-break-inside-avoid">
              <div className="text-right text-[10.5pt] italic mb-3">
                {admin.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày 21 tháng 10 năm 2026`}
              </div>
              <div className="grid grid-cols-4 gap-4 text-center text-[10pt]">
                {/* 1. Người lập biểu */}
                <div className="space-y-1">
                  <div className="font-bold uppercase">NGƯỜI LẬP BIỂU</div>
                  <div className="text-[9pt] italic text-neutral-600">(Ký, ghi rõ họ tên)</div>
                  <div className="h-20" />
                  <div className="font-bold text-[10.5pt]">{admin.creatorName || 'KS. Nguyễn Văn An'}</div>
                  <div className="text-[9pt] text-neutral-600">{admin.creatorTitle || 'Kỹ sư Định giá Xây dựng'}</div>
                </div>

                {/* 2. Chủ trì thiết kế / dự toán */}
                <div className="space-y-1">
                  <div className="font-bold uppercase">CHỦ NHIỆM / CHỦ TRÌ</div>
                  <div className="text-[9pt] italic text-neutral-600">(Ký, ghi rõ họ tên)</div>
                  <div className="h-20" />
                  <div className="font-bold text-[10.5pt]">{admin.chiefEngineer || 'ThS. Trần Quốc Bảo'}</div>
                  <div className="text-[9pt] text-neutral-600">{admin.chiefEngineerTitle || 'Chủ nhiệm Lập dự toán'}</div>
                </div>

                {/* 3. Đại diện đơn vị tư vấn thiết kế */}
                <div className="space-y-1">
                  <div className="font-bold uppercase">ĐƠN VỊ TƯ VẤN LẬP DỰ TOÁN</div>
                  <div className="text-[9pt] italic text-neutral-600">(Ký tên, đóng dấu)</div>
                  <div className="h-20" />
                  <div className="font-bold text-[10.5pt]">{admin.consultantUnit || settings.contractor}</div>
                  <div className="text-[9pt] text-neutral-600">Đơn vị tư vấn</div>
                </div>

                {/* 4. Đại diện chủ đầu tư / Ban quản lý dự án */}
                <div className="space-y-1">
                  <div className="font-bold uppercase">CHỦ ĐẦU TƯ / BAN QLDA</div>
                  <div className="text-[9pt] italic text-neutral-600">(Ký tên, đóng dấu phê duyệt)</div>
                  <div className="h-20" />
                  <div className="font-bold text-[10.5pt]">{admin.approverName || 'TS. Lê Hoàng Nam'}</div>
                  <div className="text-[9pt] text-neutral-600">{admin.approverTitle || 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer note in document */}
          <div className="mt-8 pt-3 border-t border-black/20 flex justify-between items-center text-[8.5pt] italic text-neutral-600">
            <span>Hệ thống Phần mềm Dự toán F1 Pro - Tiêu chuẩn Thông tư 12/2021/TT-BXD &amp; TT 11/2021/TT-BXD</span>
            <span>Trang 1 / 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
