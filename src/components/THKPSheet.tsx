import React, { useState } from 'react';
import { WorkItem, ProjectSettings, Category, ProjectType, IndirectCostMethod } from '../types/estimate';
import { computeTHKP, formatVND } from '../utils/calculator';
import { 
  Printer, Download, FileText, Settings2, Sliders, Check, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, Building, 
  Layers, ArrowRight, Info, CheckCircle2, QrCode
} from 'lucide-react';
import { QRCodeTHKPModal } from './QRCodeTHKPModal';

interface THKPSheetProps {
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
  onUpdateSettings: (newSettings: ProjectSettings) => void;
  onUpdateCategories?: (newCategories: Category[]) => void;
  onExportExcel: () => void;
  onOpenAdminPrint?: () => void;
}

const PROJECT_TYPE_LABELS: Record<ProjectType, { name: string; rateCivil: string; icon: string }> = {
  civil: { name: 'Dân dụng', rateCivil: '7.30% - 4.40%', icon: '🏢' },
  industrial: { name: 'Công nghiệp', rateCivil: '6.20% - 4.10%', icon: '🏭' },
  transport: { name: 'Giao thông', rateCivil: '5.50% - 3.80%', icon: '🛣️' },
  agriculture: { name: 'Nông nghiệp & PTNT', rateCivil: '5.80% - 4.00%', icon: '🌾' },
  infrastructure: { name: 'Hạ tầng kỹ thuật', rateCivil: '5.00% - 3.40%', icon: '🏗️' },
};

export const THKPSheet: React.FC<THKPSheetProps> = ({
  items,
  categories,
  settings,
  onUpdateSettings,
  onUpdateCategories,
  onExportExcel,
  onOpenAdminPrint,
}) => {
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);
  const [showScaleTableModal, setShowScaleTableModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  const thkp = computeTHKP(items, settings, categories);

  const currentConfig = settings.indirectCostConfig || {
    enabledAuto: true,
    method: 'by_scale',
    isLineProject: false,
    categorySettings: {}
  };

  // Thay đổi loại công trình chính
  const handleSelectProjectType = (type: ProjectType) => {
    onUpdateSettings({
      ...settings,
      projectType: type,
    });
  };

  // Thay đổi phương pháp tính toán chi phí gián tiếp
  const handleChangeMethod = (method: IndirectCostMethod) => {
    onUpdateSettings({
      ...settings,
      indirectCostConfig: {
        ...currentConfig,
        method
      }
    });
  };

  // Bật/tắt công trình theo tuyến (tăng chi phí nhà tạm lên 2.2% theo Bảng 3.2 TT 11)
  const handleToggleLineProject = () => {
    onUpdateSettings({
      ...settings,
      indirectCostConfig: {
        ...currentConfig,
        isLineProject: !currentConfig.isLineProject
      }
    });
  };

  // Cập nhật loại công trình cho từng hạng mục công việc
  const handleCategoryProjectTypeChange = (catId: string, pType: ProjectType) => {
    const updatedCategorySettings = {
      ...(currentConfig.categorySettings || {}),
      [catId]: {
        ...(currentConfig.categorySettings?.[catId] || {}),
        projectType: pType
      }
    };

    onUpdateSettings({
      ...settings,
      indirectCostConfig: {
        ...currentConfig,
        method: 'by_category',
        categorySettings: updatedCategorySettings
      }
    });

    if (onUpdateCategories) {
      onUpdateCategories(
        categories.map(c => c.id === catId ? { ...c, projectType: pType } : c)
      );
    }
  };

  const rows = [
    { stt: '1', name: 'Chi phí vật liệu', code: 'VL', formula: 'Khối lượng × Giá tháng', amount: thkp.directMaterial + thkp.diffMaterial, isBold: false, isHeader: false },
    { stt: '2', name: 'Chi phí nhân công', code: 'NC', formula: `Khối lượng × Giá NC (Vùng ${settings.salaryRegion})`, amount: thkp.directLabor + thkp.diffLabor, isBold: false, isHeader: false },
    { stt: '3', name: 'Chi phí máy thi công', code: 'M', formula: 'Khối lượng × Giá ca máy', amount: thkp.directMachine + thkp.diffMachine, isBold: false, isHeader: false },
    { stt: 'I', name: 'CHI PHÍ TRỰC TIẾP', code: 'T', formula: 'VL + NC + M', amount: thkp.directCostTotal, isBold: true, isHeader: true, bg: 'bg-blue-50/80' },
    
    { 
      stt: '4', 
      name: 'Chi phí chung', 
      code: 'C', 
      formula: `T × ${(thkp.generalCostRate * 100).toFixed(2)}% (${
        thkp.calculationMethod === 'by_category' 
          ? 'Tự động phân bổ theo 3 hạng mục' 
          : thkp.scaleDescription
      })`, 
      amount: thkp.generalCost, 
      isBold: false, 
      isHeader: false 
    },
    { 
      stt: '5', 
      name: 'Chi phí nhà tạm để ở và điều hành thi công', 
      code: 'LT', 
      formula: `T × ${(thkp.temporaryCampRate * 100).toFixed(2)}% (${thkp.isLineProject ? 'Công trình theo tuyến 2.2%' : 'Công trình tại chỗ 1.2%'})`, 
      amount: thkp.temporaryCampCost, 
      isBold: false, 
      isHeader: false 
    },
    { 
      stt: '6', 
      name: 'Một số công việc không xác định được khối lượng từ TK', 
      code: 'TT', 
      formula: `T × ${(thkp.unallocatedWorkRate * 100).toFixed(2)}% (Thông tư 11/2021/TT-BXD)`, 
      amount: thkp.unallocatedCost, 
      isBold: false, 
      isHeader: false 
    },
    { 
      stt: 'II', 
      name: 'CHI PHÍ GIÁN TIẾP', 
      code: 'GT', 
      formula: 'C + LT + TT', 
      amount: thkp.indirectCostTotal, 
      isBold: true, 
      isHeader: true, 
      bg: 'bg-amber-50/80' 
    },

    { 
      stt: 'III', 
      name: 'THU NHẬP CHỊU THUẾ TÍNH TRƯỚC', 
      code: 'TL', 
      formula: `(T + GT) × ${(thkp.taxableProfitRate * 100).toFixed(2)}% (Công trình ${PROJECT_TYPE_LABELS[settings.projectType]?.name})`, 
      amount: thkp.taxableProfit, 
      isBold: true, 
      isHeader: true, 
      bg: 'bg-emerald-50/80' 
    },
    { 
      stt: 'IV', 
      name: 'CHI PHÍ XÂY DỰNG TRƯỚC THUẾ', 
      code: 'G', 
      formula: 'T + GT + TL', 
      amount: thkp.preTaxTotal, 
      isBold: true, 
      isHeader: true, 
      bg: 'bg-slate-100 font-bold' 
    },

    { 
      stt: 'V', 
      name: `THUẾ GIÁ TRỊ GIA TĂNG (${(thkp.vatRate * 100).toFixed(0)}%)`, 
      code: 'VAT', 
      formula: `G × ${(thkp.vatRate * 100).toFixed(0)}%`, 
      amount: thkp.vatAmount, 
      isBold: true, 
      isHeader: false 
    },
    { 
      stt: 'VI', 
      name: 'TỔNG CHI PHÍ XÂY DỰNG SAU THUẾ', 
      code: 'Gxd', 
      formula: 'G + VAT', 
      amount: thkp.constructionTotal, 
      isBold: true, 
      isHeader: true, 
      bg: 'bg-blue-100 font-bold text-blue-950' 
    },

    { 
      stt: 'VII', 
      name: 'Chi phí dự phòng (5%)', 
      code: 'Gdp', 
      formula: 'Gxd × 5.0% (Khối lượng phát sinh & Trượt giá)', 
      amount: thkp.contingencyCost, 
      isBold: false, 
      isHeader: false 
    },
    { 
      stt: 'VIII', 
      name: 'TỔNG MỨC ĐẦU TƯ DỰ TOÁN CÔNG TRÌNH', 
      code: 'TMĐT', 
      formula: 'Gxd + Gdp', 
      amount: thkp.grandTotal, 
      isBold: true, 
      isHeader: true, 
      bg: 'bg-slate-900 text-white font-extrabold text-sm' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-auto p-4 text-xs">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        
        {/* ========================================================= */}
        {/* BẢNG ĐIỀU KHIỂN TỰ ĐỘNG HÓA CHI PHÍ GIÁN TIẾP (MỚI) */}
        {/* ========================================================= */}
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-600 text-white rounded shadow-xs">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>TỰ ĐỘNG HÓA TÍNH TOÁN CHI PHÍ GIÁN TIẾP & THU NHẬP CHỊU THUẾ TÍNH TRƯỚC</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-semibold border border-blue-200">
                    Thông tư 11/2021/TT-BXD
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tự động tra cứu, nội suy tuyến tính định mức chi phí chung (C), nhà tạm (NT) và thu nhập chịu thuế tính trước (TL) dựa trên loại công trình & danh mục công tác.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScaleTableModal(!showScaleTableModal)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded border border-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bảng tra định mức TT11</span>
              </button>
              <button
                onClick={() => setShowQRCodeModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                title="Tạo mã QR Code để quét và xem tóm tắt chi phí dự án trên điện thoại di động"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Xuất QR Code Di Động</span>
              </button>
              {onOpenAdminPrint && (
                <button
                  onClick={onOpenAdminPrint}
                  className="flex items-center gap-1.5 px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  title="Xuất bảng Tổng hợp kinh phí ra file PDF theo mẫu in ấn hành chính nhà nước (Nghị định 30/2020/NĐ-CP)"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Xuất PDF Hành chính</span>
                </button>
              )}
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Excel THKP</span>
              </button>
            </div>
          </div>

          {/* Hàng điều khiển 1: Chọn loại công trình chủ đạo */}
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 text-slate-700 font-semibold text-xs flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              <span>1. Loại công trình chủ đạo:</span>
            </div>
            <div className="md:col-span-9 flex flex-wrap gap-1.5">
              {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((type) => {
                const info = PROJECT_TYPE_LABELS[type];
                const isSelected = settings.projectType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleSelectProjectType(type)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{info.name}</span>
                    <span className={`text-[10px] ml-1 px-1 rounded ${isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                      {info.rateCivil}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng điều khiển 2: Phương pháp tính tự động & Công trình theo tuyến */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 text-slate-700 font-semibold text-xs flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span>2. Cơ chế tự động hóa:</span>
            </div>
            <div className="md:col-span-9 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChangeMethod('by_scale')}
                  className={`px-3 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    currentConfig.method === 'by_scale'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Tự động theo Quy mô chi phí (Nội suy tuyến tính)
                </button>
                <button
                  onClick={() => handleChangeMethod('by_category')}
                  className={`px-3 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    currentConfig.method === 'by_category'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  📑 Tự động phân bổ theo từng Hạng mục / Công việc
                </button>
              </div>

              {/* Tùy chọn công trình theo tuyến */}
              <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-300 text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={currentConfig.isLineProject}
                  onChange={handleToggleLineProject}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Công trình theo tuyến</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-mono font-bold">
                  Nhà tạm 2.2%
                </span>
              </label>
            </div>
          </div>

          {/* Thẻ hiển thị thông số tự động thời gian thực */}
          <div className="mt-3.5 p-3 bg-gradient-to-r from-blue-50 via-slate-50 to-emerald-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-medium">Chi phí trực tiếp (T)</div>
                <div className="font-bold font-mono text-blue-900 text-xs mt-0.5">
                  {formatVND(thkp.directCostTotal)} đ
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  {thkp.scaleDescription}
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-medium">Tỷ lệ Chi phí chung (C)</div>
                <div className="font-bold font-mono text-emerald-700 text-sm mt-0.5">
                  {(thkp.generalCostRate * 100).toFixed(2)}%
                </div>
                <div className="text-[9px] text-emerald-600 font-medium mt-0.5">
                  = {formatVND(thkp.generalCost)} đ
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-medium">Nhà tạm thi công (NT)</div>
                <div className="font-bold font-mono text-slate-800 text-sm mt-0.5">
                  {(thkp.temporaryCampRate * 100).toFixed(2)}%
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  = {formatVND(thkp.temporaryCampCost)} đ
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-medium">Không xác định (KTXĐ)</div>
                <div className="font-bold font-mono text-slate-800 text-sm mt-0.5">
                  {(thkp.unallocatedWorkRate * 100).toFixed(2)}%
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  = {formatVND(thkp.unallocatedCost)} đ
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-amber-200 shadow-2xs bg-amber-50/50">
                <div className="text-[10px] text-amber-800 font-semibold">Tổng Chi phí Gián tiếp (GT)</div>
                <div className="font-bold font-mono text-amber-900 text-xs mt-0.5">
                  {formatVND(thkp.indirectCostTotal)} đ
                </div>
                <div className="text-[9px] text-amber-700 mt-0.5">
                  C + NT + KTXĐ
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-emerald-200 shadow-2xs bg-emerald-50/50">
                <div className="text-[10px] text-emerald-800 font-semibold">Thu nhập chịu thuế (TL)</div>
                <div className="font-bold font-mono text-emerald-900 text-sm mt-0.5">
                  {(thkp.taxableProfitRate * 100).toFixed(2)}%
                </div>
                <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                  = {formatVND(thkp.taxableProfit)} đ
                </div>
              </div>
            </div>

            {/* Nút xem bảng phân bổ chi tiết theo hạng mục */}
            <div className="mt-2.5 pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {showCategoryBreakdown ? 'Thu gọn bảng phân tích từng hạng mục' : 'Xem chi tiết phân bổ Chi phí gián tiếp theo từng Hạng mục'}
                </span>
                {showCategoryBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="text-[11px] text-slate-500 italic">
                * Tự động đồng bộ và cập nhật trực tiếp vào từng dòng của Bảng THKP bên dưới.
              </div>
            </div>

            {/* Bảng phân bổ chi tiết từng hạng mục */}
            {showCategoryBreakdown && (
              <div className="mt-3 overflow-x-auto border border-slate-300 rounded bg-white p-2">
                <div className="font-bold text-slate-800 mb-1.5 flex items-center justify-between text-xs">
                  <span>CHI TIẾT PHÂN BỔ CHI PHÍ GIÁN TIẾP THEO TỪNG HẠNG MỤC CÔNG VIỆC:</span>
                  <span className="text-[11px] text-blue-700 font-normal">
                    Bạn có thể chọn loại công trình riêng biệt cho từng hạng mục bên dưới
                  </span>
                </div>
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                      <th className="p-1.5">Tên hạng mục</th>
                      <th className="p-1.5">Loại công trình áp dụng</th>
                      <th className="p-1.5 text-right">Chi phí trực tiếp (T)</th>
                      <th className="p-1.5 text-center">Tỷ lệ C%</th>
                      <th className="p-1.5 text-right">Chi phí chung (C)</th>
                      <th className="p-1.5 text-right">Chi phí Gián tiếp (GT)</th>
                      <th className="p-1.5 text-center">Tỷ lệ TL%</th>
                      <th className="p-1.5 text-right">Thu nhập chịu thuế (TL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thkp.categoryBreakdown.map((cat, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-1.5 font-medium text-slate-900">{cat.categoryName}</td>
                        <td className="p-1.5">
                          <select
                            value={cat.projectType}
                            onChange={(e) => handleCategoryProjectTypeChange(cat.categoryId, e.target.value as ProjectType)}
                            className="bg-white border border-slate-300 rounded px-2 py-0.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="civil">🏢 Dân dụng (7.3%)</option>
                            <option value="industrial">🏭 Công nghiệp (6.2%)</option>
                            <option value="transport">🛣️ Giao thông (5.5%)</option>
                            <option value="agriculture">🌾 Nông nghiệp & PTNT (5.8%)</option>
                            <option value="infrastructure">🏗️ Hạ tầng kỹ thuật (5.0%)</option>
                          </select>
                        </td>
                        <td className="p-1.5 text-right font-mono">{formatVND(cat.directCost)} đ</td>
                        <td className="p-1.5 text-center font-mono font-semibold text-emerald-700">
                          {(cat.generalCostRate * 100).toFixed(2)}%
                        </td>
                        <td className="p-1.5 text-right font-mono">{formatVND(cat.generalCost)} đ</td>
                        <td className="p-1.5 text-right font-mono font-semibold text-amber-800">
                          {formatVND(cat.indirectCostTotal)} đ
                        </td>
                        <td className="p-1.5 text-center font-mono font-semibold text-blue-700">
                          {(cat.taxableProfitRate * 100).toFixed(2)}%
                        </td>
                        <td className="p-1.5 text-right font-mono font-semibold text-emerald-800">
                          {formatVND(cat.taxableProfit)} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                      <td colSpan={2} className="p-1.5">TỔNG CỘNG HỢP NHẤT:</td>
                      <td className="p-1.5 text-right font-mono text-blue-900">{formatVND(thkp.directCostTotal)} đ</td>
                      <td className="p-1.5 text-center font-mono text-emerald-800">{(thkp.generalCostRate * 100).toFixed(2)}%</td>
                      <td className="p-1.5 text-right font-mono text-emerald-900">{formatVND(thkp.generalCost)} đ</td>
                      <td className="p-1.5 text-right font-mono text-amber-900">{formatVND(thkp.indirectCostTotal)} đ</td>
                      <td className="p-1.5 text-center font-mono text-blue-800">{(thkp.taxableProfitRate * 100).toFixed(2)}%</td>
                      <td className="p-1.5 text-right font-mono text-emerald-900">{formatVND(thkp.taxableProfit)} đ</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BẢNG TỔNG HỢP KINH PHÍ PHÁP LÝ (THEO THÔNG TƯ 11/2021) */}
        {/* ========================================================= */}
        <div className="bg-white border border-slate-300 rounded shadow-xs p-6">
          {/* Document Header */}
          <div className="text-center pb-4 mb-4 border-b border-slate-200">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-[11px] font-medium text-slate-600 mb-2">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN XÂY DỰNG
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-2">
              <span>(Áp dụng Thông tư số 11/2021/TT-BXD &amp; Thông tư số 14/2023/TT-BXD của Bộ Xây dựng)</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                Tự động hóa: ĐANG BẬT
              </span>
            </div>
          </div>

          {/* Project Meta Info */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-4 p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-slate-500">Tên công trình:</span>{' '}
              <strong className="text-slate-900">{settings.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Địa điểm:</span>{' '}
              <strong className="text-slate-900">{settings.locationProvince} (Vùng lương {settings.salaryRegion})</strong>
            </div>
            <div>
              <span className="text-slate-500">Chủ đầu tư:</span>{' '}
              <strong className="text-slate-900">{settings.investor}</strong>
            </div>
            <div>
              <span className="text-slate-500">Đơn vị lập dự toán:</span>{' '}
              <strong className="text-slate-900">{settings.contractor}</strong>
            </div>
          </div>

          {/* THKP Table */}
          <div className="overflow-hidden border border-slate-300 rounded">
            <table className="w-full border-collapse table-auto select-text">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                  <th className="f1-header-cell w-12">STT</th>
                  <th className="f1-header-cell text-left px-3">Khoản mục chi phí</th>
                  <th className="f1-header-cell w-20">Ký hiệu</th>
                  <th className="f1-header-cell min-w-[240px] text-left px-3">Phương pháp tính toán</th>
                  <th className="f1-header-cell w-44 text-right pr-4">Thành tiền (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-200 transition-colors ${row.bg || 'hover:bg-slate-50/80'} ${
                      row.isBold ? 'font-semibold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    <td className="f1-cell text-center font-mono text-[11px]">{row.stt}</td>
                    <td className="f1-cell px-3">{row.name}</td>
                    <td className="f1-cell text-center font-mono font-bold text-blue-700 text-[11px]">{row.code}</td>
                    <td className="f1-cell px-3 text-slate-600 font-mono text-[11px]">{row.formula}</td>
                    <td className="f1-cell text-right tabular-nums pr-4 font-mono font-medium">
                      {formatVND(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs mt-8 pt-4">
            <div>
              <div className="font-bold text-slate-800 uppercase">NGƯỜI LẬP DỰ TOÁN</div>
              <div className="text-slate-400 italic text-[11px] mb-12">(Ký, ghi rõ họ tên)</div>
              <div className="font-semibold text-slate-700">Kỹ sư Định giá Xây dựng</div>
            </div>
            <div>
              <div className="font-bold text-slate-800 uppercase">CHỦ ĐẦU TƯ / ĐẠI DIỆN PHÊ DUYỆT</div>
              <div className="text-slate-400 italic text-[11px] mb-12">(Ký, đóng dấu phê duyệt)</div>
              <div className="font-semibold text-slate-700">{settings.investor}</div>
            </div>
          </div>
        </div>

        {/* Modal tra cứu bảng nội suy Bảng 3.1 TT 11 */}
        {showScaleTableModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden text-xs">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white font-bold">
                <span>BẢNG 3.1: ĐỊNH MỨC TỶ LỆ CHI PHÍ CHUNG (THÔNG TƯ 11/2021/TT-BXD)</span>
                <button
                  onClick={() => setShowScaleTableModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2">Loại công trình</th>
                      <th className="border border-slate-300 p-2 text-center">≤ 15 tỷ</th>
                      <th className="border border-slate-300 p-2 text-center">50 tỷ</th>
                      <th className="border border-slate-300 p-2 text-center">100 tỷ</th>
                      <th className="border border-slate-300 p-2 text-center">500 tỷ</th>
                      <th className="border border-slate-300 p-2 text-center">1.000 tỷ</th>
                      <th className="border border-slate-300 p-2 text-center">&gt; 1.000 tỷ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-slate-300 p-2 font-medium">1. Công trình dân dụng</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">7.3%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">6.9%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">6.4%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.6%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.0%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.4%</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-slate-300 p-2 font-medium">2. Công trình công nghiệp</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">6.2%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.8%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.5%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.0%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.5%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.1%</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-slate-300 p-2 font-medium">3. Công trình giao thông</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.5%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.2%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.9%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.5%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.1%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">3.8%</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-slate-300 p-2 font-medium">4. Nông nghiệp &amp; PTNT</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.8%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.5%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.2%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.7%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.3%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.0%</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-slate-300 p-2 font-medium">5. Hạ tầng kỹ thuật</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">5.0%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.7%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.4%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">4.0%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">3.7%</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">3.4%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 text-slate-500 text-[11px] space-y-1">
                  <p>• Nếu giá trị chi phí trực tiếp $T$ nằm giữa các mốc trên, phần mềm Dự toán F1 tự động nội suy tuyến tính chính xác.</p>
                  <p>• Thu nhập chịu thuế tính trước: Công trình xây dựng là <strong>5.5%</strong> tính trên $(T + GT)$.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button
                  onClick={() => setShowScaleTableModal(false)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-xs cursor-pointer"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xuất QR Code Tổng hợp kinh phí */}
        {showQRCodeModal && (
          <QRCodeTHKPModal
            isOpen={showQRCodeModal}
            onClose={() => setShowQRCodeModal(false)}
            items={items}
            categories={categories}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
};
