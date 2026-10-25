import React, { useEffect } from 'react';
import { WorkItem, ProjectSettings, Category, ProjectType } from '../types/estimate';
import { computeTHKP, formatVND } from '../utils/calculator';
import { 
  X, Calculator, ArrowRight, Printer, Download, 
  Building2, Percent, Layers, ShieldCheck, Sparkles 
} from 'lucide-react';

interface QuickTHKPModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
  onNavigateToTHKPTab: () => void;
  onExportExcel?: () => void;
  onOpenAdminPrint?: () => void;
}

const PROJECT_TYPE_NAMES: Record<ProjectType, string> = {
  civil: 'Công trình Dân dụng',
  industrial: 'Công trình Công nghiệp',
  transport: 'Công trình Giao thông',
  agriculture: 'Nông nghiệp & PTNT',
  infrastructure: 'Hạ tầng kỹ thuật',
};

export const QuickTHKPModal: React.FC<QuickTHKPModalProps> = ({
  isOpen,
  onClose,
  items,
  categories,
  settings,
  onNavigateToTHKPTab,
  onExportExcel,
  onOpenAdminPrint,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const thkp = computeTHKP(items, settings, categories);

  const rows = [
    { stt: '1', name: 'Chi phí vật liệu', code: 'VL', formula: 'Khối lượng × Giá VL', amount: thkp.directMaterial + thkp.diffMaterial, highlight: false },
    { stt: '2', name: 'Chi phí nhân công', code: 'NC', formula: `Khối lượng × Đơn giá NC (Vùng ${settings.salaryRegion})`, amount: thkp.directLabor + thkp.diffLabor, highlight: false },
    { stt: '3', name: 'Chi phí máy thi công', code: 'M', formula: 'Khối lượng × Giá ca máy', amount: thkp.directMachine + thkp.diffMachine, highlight: false },
    { 
      stt: 'I', 
      name: 'CHI PHÍ TRỰC TIẾP', 
      code: 'T', 
      formula: 'VL + NC + M', 
      amount: thkp.directCostTotal, 
      highlight: true,
      bg: 'bg-blue-50 text-blue-900 font-bold' 
    },
    { 
      stt: '4', 
      name: 'Chi phí chung', 
      code: 'C', 
      formula: `T × ${(thkp.generalCostRate * 100).toFixed(2)}%`, 
      amount: thkp.generalCost, 
      highlight: false 
    },
    { 
      stt: '5', 
      name: 'Chi phí nhà tạm để ở và điều hành thi công', 
      code: 'LT', 
      formula: `T × ${(thkp.temporaryCampRate * 100).toFixed(2)}%`, 
      amount: thkp.temporaryCampCost, 
      highlight: false 
    },
    { 
      stt: '6', 
      name: 'Một số công việc không xác định được khối lượng từ thiết kế', 
      code: 'TT', 
      formula: `T × ${(thkp.unallocatedWorkRate * 100).toFixed(2)}%`, 
      amount: thkp.unallocatedCost, 
      highlight: false 
    },
    { 
      stt: 'II', 
      name: 'CHI PHÍ GIÁN TIẾP', 
      code: 'GT', 
      formula: 'C + LT + TT', 
      amount: thkp.indirectCostTotal, 
      highlight: true,
      bg: 'bg-amber-50 text-amber-900 font-bold' 
    },
    { 
      stt: 'III', 
      name: 'THU NHẬP CHỊU THUẾ TÍNH TRƯỚC', 
      code: 'TL', 
      formula: `(T + GT) × ${(thkp.taxableProfitRate * 100).toFixed(2)}%`, 
      amount: thkp.taxableProfit, 
      highlight: true,
      bg: 'bg-emerald-50 text-emerald-900 font-bold' 
    },
    { 
      stt: 'IV', 
      name: 'CHI PHÍ XÂY DỰNG TRƯỚC THUẾ', 
      code: 'G', 
      formula: 'T + GT + TL', 
      amount: thkp.preTaxTotal, 
      highlight: true,
      bg: 'bg-slate-100 text-slate-900 font-bold' 
    },
    { 
      stt: 'V', 
      name: `THUẾ GIÁ TRỊ GIA TĂNG (${(thkp.vatRate * 100).toFixed(0)}%)`, 
      code: 'VAT', 
      formula: `G × ${(thkp.vatRate * 100).toFixed(0)}%`, 
      amount: thkp.vatAmount, 
      highlight: false 
    },
    { 
      stt: 'VI', 
      name: 'TỔNG CHI PHÍ XÂY DỰNG SAU THUẾ', 
      code: 'Gxd', 
      formula: 'G + VAT', 
      amount: thkp.constructionTotal, 
      highlight: true,
      bg: 'bg-blue-100 text-blue-950 font-bold' 
    },
    { 
      stt: 'VII', 
      name: 'Chi phí dự phòng (5.0%)', 
      code: 'Gdp', 
      formula: 'Gxd × 5.0%', 
      amount: thkp.contingencyCost, 
      highlight: false 
    },
    { 
      stt: 'VIII', 
      name: 'TỔNG MỨC ĐẦU TƯ DỰ TOÁN CÔNG TRÌNH', 
      code: 'TMĐT', 
      formula: 'Gxd + Gdp', 
      amount: thkp.grandTotal, 
      highlight: true,
      bg: 'bg-slate-900 text-amber-300 font-extrabold text-sm' 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm tracking-wide text-white">DỰ TOÁN TÀI CHÍNH TỔNG HỢP (THKP)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Phím tắt F7
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-800/60 text-blue-200 border border-blue-700/50">
                  TT 11/2021/TT-BXD
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {settings.projectName || 'Dự án Xây dựng'} · {PROJECT_TYPE_NAMES[settings.projectType] || 'Dân dụng'} · {items.length} công tác · {categories.length} hạng mục
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              title="Đóng cửa sổ (Esc / F7)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-2xs">
            <div className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">I. Chi phí trực tiếp (T)</div>
            <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
              {formatVND(thkp.directCostTotal)} <span className="text-[10px] font-normal text-slate-500">đ</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
              <span>VL: {((thkp.directMaterial / (thkp.directCostTotal || 1)) * 100).toFixed(0)}%</span>
              <span>NC: {((thkp.directLabor / (thkp.directCostTotal || 1)) * 100).toFixed(0)}%</span>
              <span>M: {((thkp.directMachine / (thkp.directCostTotal || 1)) * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
            <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">II. Chi phí gián tiếp (GT)</div>
            <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
              {formatVND(thkp.indirectCostTotal)} <span className="text-[10px] font-normal text-slate-500">đ</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Chung: {(thkp.generalCostRate * 100).toFixed(1)}%</span>
              <span>Nhà tạm: {(thkp.temporaryCampRate * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">VI. Xây dựng sau thuế (Gxd)</div>
            <div className="text-base font-bold text-emerald-700 mt-0.5 font-mono">
              {formatVND(thkp.constructionTotal)} <span className="text-[10px] font-normal text-slate-500">đ</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Bao gồm VAT {(thkp.vatRate * 100).toFixed(0)}%: {formatVND(thkp.vatAmount)} đ
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-3 rounded-lg border border-slate-700 shadow-2xs text-white">
            <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">VIII. Tổng Mức Đầu Tư (TMĐT)</div>
            <div className="text-base font-bold text-amber-300 mt-0.5 font-mono">
              {formatVND(thkp.grandTotal)} <span className="text-[10px] font-normal text-slate-400">đ</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">
              Gxd + 5% Dự phòng ({formatVND(thkp.contingencyCost)} đ)
            </div>
          </div>
        </div>

        {/* Financial Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-[11px]">
                  <th className="py-2 px-2.5 text-center w-10 border-r border-slate-200">STT</th>
                  <th className="py-2 px-3 border-r border-slate-200">Khoản mục chi phí</th>
                  <th className="py-2 px-2 text-center w-14 border-r border-slate-200">Ký hiệu</th>
                  <th className="py-2 px-3 border-r border-slate-200">Cách tính / Căn cứ pháp lý</th>
                  <th className="py-2 px-3 text-right w-36 border-r border-slate-200">Thành tiền (VNĐ)</th>
                  <th className="py-2 px-2 text-center w-16">Tỷ trọng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => {
                  const percent = thkp.grandTotal > 0 ? (row.amount / thkp.grandTotal) * 100 : 0;
                  return (
                    <tr 
                      key={row.stt} 
                      className={`hover:bg-slate-50 transition-colors ${row.bg || ''}`}
                    >
                      <td className="py-1.5 px-2.5 text-center border-r border-slate-200 font-mono text-[11px]">
                        {row.stt}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 font-medium">
                        {row.name}
                      </td>
                      <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono font-semibold text-[11px]">
                        {row.code}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                        {row.formula}
                      </td>
                      <td className="py-1.5 px-3 text-right border-r border-slate-200 font-mono tabular-nums font-semibold">
                        {formatVND(row.amount)}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono text-slate-500 text-[11px]">
                        {percent > 0 ? `${percent.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Categories Sub-Breakdown if > 1 category */}
          {categories.length > 1 && (
            <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2 font-semibold text-blue-900 text-xs">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Phân bổ chi phí trực tiếp theo từng Hạng mục / Phân đoạn:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {categories.map((cat, idx) => {
                  const catItems = items.filter(i => (i.categoryId || categories[0]?.id) === cat.id);
                  const catDirect = catItems.reduce((acc, it) => {
                    const q = it.quantity || 0;
                    return acc + q * (it.unitPriceMaterial + it.unitPriceLabor + it.unitPriceMachine);
                  }, 0);
                  const catShare = thkp.directCostTotal > 0 ? (catDirect / thkp.directCostTotal) * 100 : 0;

                  return (
                    <div key={cat.id} className="bg-white p-2.5 rounded border border-blue-200 text-[11px]">
                      <div className="font-semibold text-slate-800 truncate" title={cat.name}>
                        {idx + 1}. {cat.name}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-slate-600">
                        <span>{catItems.length} công tác</span>
                        <span className="font-mono font-bold text-blue-700">{formatVND(catDirect)} đ</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(catShare, 100)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đã kiểm toán định mức và tỷ lệ theo Thông tư 11/2021/TT-BXD và 12/2021/TT-BXD</span>
          </div>

          <div className="flex items-center gap-2">
            {onExportExcel && (
              <button
                type="button"
                onClick={onExportExcel}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel</span>
              </button>
            )}

            {onOpenAdminPrint && (
              <button
                type="button"
                onClick={onOpenAdminPrint}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>In biểu mẫu</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToTHKPTab();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Xem Bảng THKP Đầy Đủ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
