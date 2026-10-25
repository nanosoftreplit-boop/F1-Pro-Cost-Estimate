import React, { useState } from 'react';
import { ProjectSettings, Category, WorkItem } from '../types/estimate';
import { computeTHKP, formatVND } from '../utils/calculator';
import { 
  Building, MapPin, CheckCircle2, ChevronRight, Layers, 
  Calendar, ArrowLeft, Download, Share2, ShieldCheck, 
  ExternalLink, BarChart3, Coins, Sparkles, RefreshCw
} from 'lucide-react';

interface MobileTHKPSummaryViewProps {
  settings: ProjectSettings;
  items: WorkItem[];
  categories: Category[];
  onExitMobileView?: () => void;
}

export const MobileTHKPSummaryView: React.FC<MobileTHKPSummaryViewProps> = ({
  settings,
  items,
  categories,
  onExitMobileView,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown'>('summary');
  const [copied, setCopied] = useState(false);

  const thkp = computeTHKP(items, settings, categories);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Tổng hợp kinh phí - ${settings.projectName}`,
        text: `Tổng mức đầu tư công trình ${settings.projectName}: ${formatVND(thkp.grandTotal)} VNĐ (Dự toán F1 Pro)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between max-w-md mx-auto shadow-2xl relative select-none">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-red-600 rounded-md text-white font-black text-xs flex items-center justify-center shadow-xs">
            F1
          </span>
          <div>
            <h1 className="text-xs font-bold text-white tracking-tight">DỰ TOÁN F1 MOBILE</h1>
            <p className="text-[10px] text-slate-400">Tóm tắt kinh phí dự án</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">{copied ? 'Đã chép' : 'Chia sẻ'}</span>
          </button>

          {onExitMobileView && (
            <button
              onClick={onExitMobileView}
              className="p-1.5 text-blue-300 hover:text-white bg-blue-900/60 hover:bg-blue-800 rounded-lg text-xs flex items-center gap-1 transition-colors border border-blue-700/60 cursor-pointer"
              title="Chuyển sang bản bàn làm việc đầy đủ trên máy tính (Phím tắt F6)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-semibold">Bản PC (F6)</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="p-4 space-y-3.5 flex-1 overflow-y-auto pb-10">
        {/* Project Metadata Card */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              {settings.projectType === 'civil' ? 'Công trình Dân dụng' : 
               settings.projectType === 'industrial' ? 'Công trình Công nghiệp' :
               settings.projectType === 'transport' ? 'Công trình Giao thông' : 'Hạ tầng kỹ thuật'}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date().toLocaleDateString('vi-VN')}</span>
            </span>
          </div>

          <h2 className="text-sm font-extrabold text-white leading-snug">
            {settings.projectName}
          </h2>

          <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400">Chủ đầu tư:</span>
              <span className="font-medium text-slate-200 truncate">{settings.investor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400">Địa điểm:</span>
              <span className="font-medium text-slate-200">{settings.locationProvince} (Vùng {settings.salaryRegion})</span>
            </div>
          </div>
        </div>

        {/* Grand Total Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
              TỔNG MỨC ĐẦU TƯ CÔNG TRÌNH
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-white drop-shadow-xs">
              {formatVND(thkp.grandTotal)} <span className="text-sm font-bold">VNĐ</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-100 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Chuẩn Thông tư 12/2021 & TT 11/2021/TT-BXD</span>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Cost Structure Card */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              Cơ cấu Chi phí Dự toán
            </span>
            <span className="text-[10px] font-mono text-slate-400">{items.length} công tác</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300">1. Chi phí trực tiếp (T):</span>
              <span className="font-mono font-bold text-white">{formatVND(thkp.directCostTotal)} VNĐ</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pl-3">
              <span>• Vật liệu (VL):</span>
              <span className="font-mono">{formatVND(thkp.directMaterial + thkp.diffMaterial)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pl-3">
              <span>• Nhân công (NC):</span>
              <span className="font-mono">{formatVND(thkp.directLabor + thkp.diffLabor)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pl-3">
              <span>• Máy thi công (M):</span>
              <span className="font-mono">{formatVND(thkp.directMachine + thkp.diffMachine)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-700/50">
              <span className="text-slate-300">2. Chi phí gián tiếp (GT):</span>
              <span className="font-mono font-bold text-amber-400">{formatVND(thkp.indirectCostTotal)} VNĐ</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pl-3">
              <span>• Chi phí chung (C):</span>
              <span className="font-mono">{formatVND(thkp.generalCost)} ({(thkp.generalCostRate * 100).toFixed(2)}%)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pl-3">
              <span>• Nhà tạm & điều hành:</span>
              <span className="font-mono">{formatVND(thkp.temporaryCampCost)} ({(thkp.temporaryCampRate * 100).toFixed(1)}%)</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-700/50">
              <span className="text-slate-300">3. Thu nhập tính trước (TL):</span>
              <span className="font-mono font-bold text-emerald-400">{formatVND(thkp.taxableProfit)} VNĐ</span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-slate-900/60 px-2.5 rounded-lg border border-slate-700/60">
              <span className="font-bold text-white">4. Chi phí XD trước thuế (G):</span>
              <span className="font-mono font-bold text-blue-400">{formatVND(thkp.preTaxTotal)} VNĐ</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-300">5. Thuế GTGT (VAT 10%):</span>
              <span className="font-mono text-slate-200">{formatVND(thkp.vatAmount)} VNĐ</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-300">6. Chi phí dự phòng (5%):</span>
              <span className="font-mono text-slate-200">{formatVND(thkp.contingencyCost)} VNĐ</span>
            </div>
          </div>

          {/* Visual Percentage Progress */}
          <div className="pt-2 border-t border-slate-700/80 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Tỷ lệ phân bổ chi phí</span>
              <span className="font-mono">Trực tiếp: {((thkp.directCostTotal / thkp.grandTotal) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 flex overflow-hidden border border-slate-700">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(thkp.directCostTotal / thkp.grandTotal) * 100}%` }}
                title="Chi phí trực tiếp"
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${(thkp.indirectCostTotal / thkp.grandTotal) * 100}%` }}
                title="Chi phí gián tiếp"
              />
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${(thkp.taxableProfit / thkp.grandTotal) * 100}%` }}
                title="Thu nhập tính trước"
              />
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${((thkp.vatAmount + thkp.contingencyCost) / thkp.grandTotal) * 100}%` }}
                title="VAT và Dự phòng"
              />
            </div>
            <div className="flex flex-wrap justify-between text-[9px] text-slate-400 pt-0.5">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Trực tiếp</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Gián tiếp</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Thu nhập</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Thuế & DP</span>
            </div>
          </div>
        </div>

        {/* Security & Statutory Badge */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Dữ liệu số hóa chính thức từ Phần mềm Dự toán F1 Pro.</span>
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="sticky bottom-0 bg-slate-950 border-t border-slate-800 p-3 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-400">
          Chế độ xem di động QR Code
        </div>
        {onExitMobileView && (
          <button
            onClick={onExitMobileView}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-xs"
          >
            Mở Bản Đầy Đủ
          </button>
        )}
      </footer>
    </div>
  );
};
