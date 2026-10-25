import React, { useState, useMemo } from 'react';
import { AuditDiffItem, ProjectSettings } from '../types/estimate';
import { formatQuantity, formatVND } from '../utils/calculator';
import { 
  CheckCircle2, AlertTriangle, XCircle, Search, Filter, 
  ShieldCheck, ArrowDownRight, ArrowUpRight, FileText, 
  Printer, Download, GitCompare, Eye, Sliders, Check, 
  Layers, ChevronRight, X
} from 'lucide-react';

interface VersionItemCompare {
  id: string;
  code: string;
  name: string;
  unit: string;
  v1Qty: number;
  v1Price: number;
  v1Total: number;
  v2Qty: number;
  v2Price: number;
  v2Total: number;
  diffQty: number;
  diffTotal: number;
  diffPercent: number;
  status: 'exceeded' | 'reduced' | 'matched' | 'new_item';
  exceededReason: string;
  legalNormStandard: string;
}

interface ThamTraSheetProps {
  auditDiffs: AuditDiffItem[];
  settings: ProjectSettings;
  onUpdateAuditDiff: (index: number, patch: Partial<AuditDiffItem>) => void;
  onApplyAllAuditChanges: () => void;
}

export type ThamTraViewMode = 'audit_diff' | 'version_compare';
export type VersionComparePreset = 'tk_vs_bvtc' | 'du_toan_vs_quyet_toan' | 'trinh_duyet_vs_tham_tra';

export const ThamTraSheet: React.FC<ThamTraSheetProps> = ({
  auditDiffs,
  settings,
  onUpdateAuditDiff,
  onApplyAllAuditChanges,
}) => {
  const [viewMode, setViewMode] = useState<ThamTraViewMode>('version_compare');
  const [comparePreset, setComparePreset] = useState<VersionComparePreset>('trinh_duyet_vs_tham_tra');
  const [filterStatus, setFilterStatus] = useState<'all' | 'exceeded' | 'reduced' | 'matched' | 'new_item'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Dữ liệu so sánh 2 phiên bản mẫu chuẩn kỹ thuật
  const [versionItems, setVersionItems] = useState<VersionItemCompare[]>([
    {
      id: 'cmp-1',
      code: 'AB.11111',
      name: 'Đào móng công trình bằng máy đào 0.8m3, đất cấp II',
      unit: '100m3',
      v1Qty: 18.50,
      v1Price: 3200000,
      v1Total: 59200000,
      v2Qty: 15.20,
      v2Price: 3200000,
      v2Total: 48640000,
      diffQty: -3.30,
      diffTotal: -10560000,
      diffPercent: -17.84,
      status: 'reduced',
      exceededReason: 'Đo bóc thừa khối lượng đào taluy ngoài phạm vi thiết kế quy định',
      legalNormStandard: 'Định mức AB.11111 TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-2',
      code: 'AF.11111',
      name: 'Bê tông lót móng đá 4x6 mác 100, vữa xi măng PCB30',
      unit: 'm3',
      v1Qty: 42.00,
      v1Price: 980000,
      v1Total: 41160000,
      v2Qty: 38.50,
      v2Price: 980000,
      v2Total: 37730000,
      diffQty: -3.50,
      diffTotal: -3430000,
      diffPercent: -8.33,
      status: 'reduced',
      exceededReason: 'Tính trùng diện tích giao nhau giữa các đế móng đơn',
      legalNormStandard: 'Định mức AF.11111 TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-3',
      code: 'AF.12210',
      name: 'Bê tông móng cột, dầm móng đá 1x2 mác 250, vữa PCB40',
      unit: 'm3',
      v1Qty: 110.00,
      v1Price: 1550000,
      v1Total: 170500000,
      v2Qty: 122.50,
      v2Price: 1550000,
      v2Total: 189875000,
      diffQty: 12.50,
      diffTotal: 19375000,
      diffPercent: 11.36,
      status: 'exceeded',
      exceededReason: 'VƯỢT ĐỊNH MỨC: Bổ sung chiều dày bản móng theo văn bản xử lý kỹ thuật số 04/XLKT',
      legalNormStandard: 'Định mức AF.12210 TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-4',
      code: 'AF.61110',
      name: 'Sản xuất, lắp dựng cốt thép móng đường kính <= 18mm',
      unit: 'tấn',
      v1Qty: 9.80,
      v1Price: 18500000,
      v1Total: 181300000,
      v2Qty: 11.20,
      v2Price: 18500000,
      v2Total: 207200000,
      diffQty: 1.40,
      diffTotal: 25900000,
      diffPercent: 14.29,
      status: 'exceeded',
      exceededReason: 'VƯỢT ĐỊNH MỨC: Tính thừa tỷ lệ thép nối chồng 5% vượt quá quy định 3% trong TCVN 4453',
      legalNormStandard: 'Mục 3.2 Chương AF TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-5',
      code: 'AF.81111',
      name: 'Ván khuôn móng cột, ván khuôn dầm móng bằng gỗ phủ phim',
      unit: '100m2',
      v1Qty: 3.50,
      v1Price: 14200000,
      v1Total: 49700000,
      v2Qty: 3.50,
      v2Price: 14200000,
      v2Total: 49700000,
      diffQty: 0,
      diffTotal: 0,
      diffPercent: 0,
      status: 'matched',
      exceededReason: 'Khối lượng và định mức phù hợp hồ sơ bản vẽ thiết kế',
      legalNormStandard: 'Định mức AF.81111 TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-6',
      code: 'AK.11110',
      name: 'Xây tường gạch đặc không nung dày <= 11cm mác 75',
      unit: 'm3',
      v1Qty: 68.00,
      v1Price: 1450000,
      v1Total: 98600000,
      v2Qty: 60.50,
      v2Price: 1450000,
      v2Total: 87725000,
      diffQty: -7.50,
      diffTotal: -10875000,
      diffPercent: -11.03,
      status: 'reduced',
      exceededReason: 'Chưa trừ diện tích các ô cửa sổ và cửa đi kích thước > 0.25m2',
      legalNormStandard: 'Đo bóc theo TT 13/2021/TT-BXD & TT 12'
    },
    {
      id: 'cmp-7',
      code: 'AK.21110',
      name: 'Trát tường ngoài nhà bằng vữa xi măng mác 75 dày 1.5cm',
      unit: '100m2',
      v1Qty: 5.60,
      v1Price: 8900000,
      v1Total: 49840000,
      v2Qty: 4.80,
      v2Price: 8900000,
      v2Total: 42720000,
      diffQty: -0.80,
      diffTotal: -7120000,
      diffPercent: -14.29,
      status: 'reduced',
      exceededReason: 'Đo thừa diện tích phần ốp đá granite tầng 1',
      legalNormStandard: 'Định mức AK.21110 TT 12/2021/TT-BXD'
    },
    {
      id: 'cmp-8',
      code: 'PS.002',
      name: 'Bổ sung màng chống thấm khò nóng gốc Bitum 3mm sàn vệ sinh',
      unit: 'm2',
      v1Qty: 0,
      v1Price: 185000,
      v1Total: 0,
      v2Qty: 145.00,
      v2Price: 185000,
      v2Total: 26825000,
      diffQty: 145.00,
      diffTotal: 26825000,
      diffPercent: 100,
      status: 'new_item',
      exceededReason: 'Hạng mục phát sinh bổ sung theo biên bản hiện trường xử lý thấm',
      legalNormStandard: 'Định mức AK.95111 TT 12/2021/TT-BXD'
    }
  ]);

  // Nhãn các phiên bản
  const PRESET_LABELS: Record<VersionComparePreset, { v1Name: string; v2Name: string; title: string }> = {
    trinh_duyet_vs_tham_tra: {
      v1Name: 'Hồ sơ Trình duyệt ban đầu (V1)',
      v2Name: 'Hồ sơ Sau Thẩm tra phê duyệt (V2)',
      title: 'So sánh Dự toán Trình duyệt vs Sau thẩm tra'
    },
    tk_vs_bvtc: {
      v1Name: 'Dự toán Thiết kế cơ sở (V1)',
      v2Name: 'Dự toán Bản vẽ thi công (V2)',
      title: 'So sánh Dự toán Thiết kế cơ sở vs BVTC'
    },
    du_toan_vs_quyet_toan: {
      v1Name: 'Dự toán Hợp đồng trúng thầu (V1)',
      v2Name: 'Giá trị Quyết toán A-B thực tế (V2)',
      title: 'So sánh Dự toán Hợp đồng vs Quyết toán A-B'
    }
  };

  const currentPreset = PRESET_LABELS[comparePreset];

  // Tính toán tổng số liệu so sánh
  const summary = useMemo(() => {
    let totalV1 = 0;
    let totalV2 = 0;
    let totalExceeded = 0;
    let totalReduced = 0;
    let countExceeded = 0;
    let countReduced = 0;

    versionItems.forEach(item => {
      totalV1 += item.v1Total;
      totalV2 += item.v2Total;
      if (item.diffTotal > 0) {
        totalExceeded += item.diffTotal;
        countExceeded++;
      } else if (item.diffTotal < 0) {
        totalReduced += Math.abs(item.diffTotal);
        countReduced++;
      }
    });

    const netDiff = totalV2 - totalV1;
    const netPercent = totalV1 > 0 ? (netDiff / totalV1) * 100 : 0;

    return {
      totalV1,
      totalV2,
      netDiff,
      netPercent,
      totalExceeded,
      totalReduced,
      countExceeded,
      countReduced,
      totalItems: versionItems.length,
    };
  }, [versionItems]);

  // Bộ lọc danh sách so sánh
  const filteredVersionItems = useMemo(() => {
    return versionItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.exceededReason.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (filterStatus === 'all') return true;
      if (filterStatus === 'exceeded') return item.diffTotal > 0;
      if (filterStatus === 'reduced') return item.diffTotal < 0;
      if (filterStatus === 'matched') return item.diffTotal === 0;
      if (filterStatus === 'new_item') return item.status === 'new_item';
      return true;
    });
  }, [versionItems, filterStatus, searchQuery]);

  // Cập nhật giá trị V2 của một hạng mục
  const handleUpdateV2 = (id: string, newV2Qty: number, newV2Price: number, reason: string) => {
    setVersionItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const v2Total = newV2Qty * newV2Price;
      const diffQty = newV2Qty - item.v1Qty;
      const diffTotal = v2Total - item.v1Total;
      const diffPercent = item.v1Total > 0 ? (diffTotal / item.v1Total) * 100 : (v2Total > 0 ? 100 : 0);
      let status: 'exceeded' | 'reduced' | 'matched' | 'new_item' = 'matched';
      if (item.v1Qty === 0) status = 'new_item';
      else if (diffTotal > 0) status = 'exceeded';
      else if (diffTotal < 0) status = 'reduced';

      return {
        ...item,
        v2Qty: newV2Qty,
        v2Price: newV2Price,
        v2Total,
        diffQty,
        diffTotal,
        diffPercent,
        status,
        exceededReason: reason
      };
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs select-none">
      {/* 1. Header Toolbar & View Mode Switcher */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
              <GitCompare className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                Hệ Thống Thẩm Tra & So Sánh Sai Lệch Dự Toán
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  TT 11/2021/TT-BXD
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Phát hiện đo bóc vượt định mức, chênh lệch đơn giá và so sánh biến động giữa các phiên bản
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded px-2 py-1">
            <span className="text-[11px] text-slate-400 mr-1.5">Kịch bản:</span>
            <select
              value={comparePreset}
              onChange={(e) => setComparePreset(e.target.value as VersionComparePreset)}
              className="bg-transparent text-white text-[11px] font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="trinh_duyet_vs_tham_tra" className="bg-slate-800">Trình duyệt vs Sau Thẩm tra</option>
              <option value="tk_vs_bvtc" className="bg-slate-800">Thiết kế cơ sở vs BVTC</option>
              <option value="du_toan_vs_quyet_toan" className="bg-slate-800">Dự toán HĐ vs Quyết toán A-B</option>
            </select>
          </div>

          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Xuất Báo Cáo Thẩm Tra PDF
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-100 border-b border-slate-200">
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block truncate">{currentPreset.v1Name}:</span>
          <span className="text-base font-bold text-slate-800 font-mono">{formatVND(summary.totalV1)} VNĐ</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tổng giá trị ban đầu</span>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block truncate">{currentPreset.v2Name}:</span>
          <span className="text-base font-bold text-blue-700 font-mono">{formatVND(summary.totalV2)} VNĐ</span>
          <span className="text-[10px] text-blue-600 font-medium block mt-0.5">
            {summary.netDiff >= 0 ? `+${formatVND(summary.netDiff)}` : `-${formatVND(Math.abs(summary.netDiff))}`} ({summary.netPercent.toFixed(2)}%)
          </span>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-rose-200 bg-rose-50/40 shadow-xs">
          <span className="text-[11px] text-rose-800 font-medium block">Hạng mục VƯỢT ĐỊNH MỨC / Tăng:</span>
          <div className="flex items-center gap-1 text-rose-700">
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span className="text-base font-bold font-mono">
              +{formatVND(summary.totalExceeded)} VNĐ
            </span>
          </div>
          <span className="text-[10px] text-rose-600 block mt-0.5">
            {summary.countExceeded} công tác phát sinh / vượt định mức
          </span>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-800 font-medium block">Giá trị GIẢM TRỪ THẨM TRA:</span>
            <div className="flex items-center gap-1 text-emerald-700">
              <ArrowDownRight className="w-4 h-4 shrink-0" />
              <span className="text-base font-bold font-mono">
                -{formatVND(summary.totalReduced)} VNĐ
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              {summary.countReduced} công tác được điều chỉnh giảm
            </span>
          </div>
          <button
            onClick={onApplyAllAuditChanges}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px] shadow-xs transition-colors shrink-0"
            title="Đồng bộ kết quả thẩm tra vào Bảng Công trình chính"
          >
            Áp dụng kết quả
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã hiệu, tên công tác, lý do..."
              className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded bg-white w-64 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({versionItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('exceeded')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                filterStatus === 'exceeded' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              Vượt định mức ({summary.countExceeded})
            </button>
            <button
              onClick={() => setFilterStatus('reduced')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                filterStatus === 'reduced' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Giảm trừ ({summary.countReduced})
            </button>
            <button
              onClick={() => setFilterStatus('matched')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'matched' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khớp (1)
            </button>
            <button
              onClick={() => setFilterStatus('new_item')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'new_item' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:bg-purple-100'
              }`}
            >
              Phát sinh mới (1)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Vượt mức / Tăng
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Cắt giảm thẩm tra
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Trùng khớp
          </span>
        </div>
      </div>

      {/* 4. Side-by-Side Version Comparison Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text text-xs">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th rowSpan={2} className="f1-header-cell w-10 text-center">STT</th>
              <th rowSpan={2} className="f1-header-cell w-28 text-center">Trạng thái</th>
              <th rowSpan={2} className="f1-header-cell w-24 text-center">Mã hiệu</th>
              <th rowSpan={2} className="f1-header-cell min-w-[220px] text-left px-3">Tên công tác đối chiếu</th>
              <th rowSpan={2} className="f1-header-cell w-14 text-center">ĐVT</th>
              <th colSpan={3} className="f1-header-cell bg-slate-200/90 text-center">{currentPreset.v1Name}</th>
              <th colSpan={3} className="f1-header-cell bg-blue-100 text-blue-900 text-center">{currentPreset.v2Name}</th>
              <th colSpan={2} className="f1-header-cell bg-amber-100 text-amber-900 text-center">Chênh lệch (Δ)</th>
              <th rowSpan={2} className="f1-header-cell min-w-[260px] text-left px-3">Lý do & Căn cứ pháp lý sai lệch</th>
            </tr>
            <tr className="border-b border-slate-300 bg-slate-50">
              {/* V1 Columns */}
              <th className="f1-header-cell w-16 text-right">Khối lượng</th>
              <th className="f1-header-cell w-24 text-right">Đơn giá</th>
              <th className="f1-header-cell w-28 text-right">Thành tiền</th>
              {/* V2 Columns */}
              <th className="f1-header-cell w-16 text-right bg-blue-50/80">Khối lượng</th>
              <th className="f1-header-cell w-24 text-right bg-blue-50/80">Đơn giá</th>
              <th className="f1-header-cell w-28 text-right bg-blue-50/80 font-bold">Thành tiền</th>
              {/* Delta Columns */}
              <th className="f1-header-cell w-28 text-right font-bold">Δ Tiền (VNĐ)</th>
              <th className="f1-header-cell w-20 text-center font-bold">Tỷ lệ %</th>
            </tr>
          </thead>
          <tbody>
            {filteredVersionItems.map((item, idx) => {
              const isExceeded = item.diffTotal > 0;
              const isReduced = item.diffTotal < 0;
              const isMatched = item.diffTotal === 0;
              const isNew = item.status === 'new_item';

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors border-b border-slate-200 ${
                    isExceeded ? 'bg-rose-50/30' : isReduced ? 'bg-emerald-50/20' : isNew ? 'bg-purple-50/30' : ''
                  }`}
                >
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell text-center px-1">
                    {isExceeded && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" /> VƯỢT ĐỊNH MỨC
                      </span>
                    )}
                    {isReduced && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                        <ArrowDownRight className="w-3 h-3" /> GIẢM TRỪ
                      </span>
                    )}
                    {isMatched && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> KHỚP
                      </span>
                    )}
                    {isNew && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">
                        <Layers className="w-3 h-3" /> BỔ SUNG MỚI
                      </span>
                    )}
                  </td>
                  <td className="f1-cell text-center font-mono font-medium text-blue-700">{item.code}</td>
                  <td className="f1-cell px-3 text-slate-800 font-medium">{item.name}</td>
                  <td className="f1-cell text-center text-slate-600">{item.unit}</td>
                  
                  {/* V1 Cells */}
                  <td className="f1-cell text-right tabular-nums text-slate-600 font-mono">
                    {formatQuantity(item.v1Qty)}
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-600 font-mono">
                    {formatVND(item.v1Price)}
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-700 font-mono font-medium">
                    {formatVND(item.v1Total)}
                  </td>

                  {/* V2 Cells with Inline Editing */}
                  <td className="f1-cell text-right tabular-nums text-blue-800 font-semibold font-mono bg-blue-50/20">
                    <input
                      type="number"
                      step="any"
                      value={item.v2Qty}
                      onChange={(e) => handleUpdateV2(item.id, parseFloat(e.target.value) || 0, item.v2Price, item.exceededReason)}
                      className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono font-bold"
                    />
                  </td>
                  <td className="f1-cell text-right tabular-nums text-blue-800 font-mono bg-blue-50/20">
                    {formatVND(item.v2Price)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-bold text-blue-900 bg-blue-50/40 font-mono">
                    {formatVND(item.v2Total)}
                  </td>

                  {/* Delta Cells */}
                  <td className={`f1-cell text-right tabular-nums font-bold font-mono ${
                    isExceeded ? 'text-rose-700 bg-rose-50/50' : isReduced ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-400'
                  }`}>
                    {item.diffTotal > 0 ? `+${formatVND(item.diffTotal)}` : item.diffTotal < 0 ? `-${formatVND(Math.abs(item.diffTotal))}` : '0'}
                  </td>
                  <td className="f1-cell text-center tabular-nums font-mono text-[11px]">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isExceeded ? 'bg-rose-100 text-rose-700' : isReduced ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'
                    }`}>
                      {item.diffPercent > 0 ? `+${item.diffPercent.toFixed(1)}%` : `${item.diffPercent.toFixed(1)}%`}
                    </span>
                  </td>

                  {/* Reason & Law */}
                  <td className="f1-cell px-3">
                    <div className="space-y-0.5">
                      <input
                        type="text"
                        value={item.exceededReason}
                        onChange={(e) => handleUpdateV2(item.id, item.v2Qty, item.v2Price, e.target.value)}
                        className="w-full bg-transparent focus:bg-white focus:outline-hidden text-slate-800 font-medium px-1 rounded"
                      />
                      <span className="text-[10px] text-slate-400 block px-1">
                        Căn cứ: {item.legalNormStandard}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-10 bg-slate-900 text-white font-bold text-xs shadow-md">
            <tr className="border-t-2 border-slate-700">
              <td colSpan={5} className="f1-cell text-center py-2.5 text-slate-300">
                TỔNG CỘNG CHÊNH LỆCH SO SÁNH (G_xd)
              </td>
              <td colSpan={3} className="f1-cell text-right tabular-nums text-slate-300 font-mono px-3">
                {formatVND(summary.totalV1)} VNĐ
              </td>
              <td colSpan={3} className="f1-cell text-right tabular-nums text-blue-400 font-mono px-3">
                {formatVND(summary.totalV2)} VNĐ
              </td>
              <td className="f1-cell text-right tabular-nums text-emerald-400 font-bold bg-slate-800 text-sm font-mono px-3">
                {summary.netDiff >= 0 ? `+${formatVND(summary.netDiff)}` : `-${formatVND(Math.abs(summary.netDiff))}`}
              </td>
              <td className="f1-cell text-center text-emerald-400 font-mono">
                {summary.netPercent > 0 ? `+${summary.netPercent.toFixed(2)}%` : `${summary.netPercent.toFixed(2)}%`}
              </td>
              <td className="f1-cell px-3 text-slate-300 font-normal">
                {summary.countExceeded} mục vượt định mức (+{formatVND(summary.totalExceeded)}) | {summary.countReduced} mục giảm trừ (-{formatVND(summary.totalReduced)})
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. PDF Export Modal (Formatted according to Decree 15/2021/ND-CP & Circular 11/2021/TT-BXD) */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm">Báo Cáo Kết Quả Thẩm Tra Dự Toán Công Trình (Mẫu số 01/TTr)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  In / Lưu PDF (A4)
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet Preview */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-200">
              <div className="bg-white p-10 max-w-3xl mx-auto shadow-lg border border-slate-300 text-slate-900 text-xs leading-normal font-serif">
                {/* Official National Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-6">
                  <div className="text-center font-sans">
                    <div className="font-bold text-xs uppercase tracking-tight text-slate-700">CƠ QUAN THẨM TRA DỰ TOÁN</div>
                    <div className="font-extrabold text-xs uppercase text-slate-900">CÔNG TY CP TƯ VẤN KIỂM ĐỊNH F1</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Số: 88/BCTT-F1PRO/2026</div>
                  </div>
                  <div className="text-center font-sans">
                    <div className="font-bold text-xs uppercase text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="font-bold text-xs text-slate-800">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-[10px] italic text-slate-500 mt-0.5">Hà Nội, ngày 21 tháng 10 năm 2026</div>
                  </div>
                </div>

                {/* Report Title */}
                <div className="text-center my-6">
                  <h1 className="text-base font-extrabold uppercase text-slate-900 tracking-tight font-sans">
                    BÁO CÁO KẾT QUẢ THẨM TRA DỰ TOÁN XÂY DỰNG CÔNG TRÌNH
                  </h1>
                  <div className="text-xs font-bold text-slate-700 mt-1">
                    Công trình: {settings.projectName}
                  </div>
                  <div className="text-[11px] text-slate-600 italic">
                    (Áp dụng theo Nghị định số 15/2021/NĐ-CP & Thông tư số 11/2021/TT-BXD, TT 12/2021/TT-BXD)
                  </div>
                </div>

                {/* Section I: Project Metadata */}
                <div className="space-y-1.5 mb-6 text-xs font-sans">
                  <div className="font-bold text-slate-900 uppercase">I. THÔNG TIN CHUNG DỰ ÁN:</div>
                  <div className="grid grid-cols-2 gap-2 pl-3">
                    <div>1. Chủ đầu tư: <strong>{settings.investor}</strong></div>
                    <div>2. Nhà thầu lập dự toán: <strong>{settings.contractor}</strong></div>
                    <div>3. Địa điểm xây dựng: <strong>{settings.locationProvince} (Vùng {settings.salaryRegion})</strong></div>
                    <div>4. Tiêu chuẩn định mức: <strong>{settings.standardCircular}</strong></div>
                  </div>
                </div>

                {/* Section II: Summary Comparison Table */}
                <div className="space-y-2 mb-6 font-sans">
                  <div className="font-bold text-slate-900 uppercase">II. TỔNG HỢP KẾT QUẢ THẨM TRA:</div>
                  <table className="w-full border-collapse border border-slate-400 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-400 p-1.5">Nội dung chi phí</th>
                        <th className="border border-slate-400 p-1.5">Giá trị trình duyệt (V1)</th>
                        <th className="border border-slate-400 p-1.5">Giá trị sau thẩm tra (V2)</th>
                        <th className="border border-slate-400 p-1.5">Chênh lệch (Δ)</th>
                        <th className="border border-slate-400 p-1.5">Tỷ lệ %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-1.5 font-bold">1. Chi phí xây dựng (G_xd)</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">{formatVND(summary.totalV1)} VNĐ</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">{formatVND(summary.totalV2)} VNĐ</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono text-emerald-700 font-bold">
                          {summary.netDiff >= 0 ? `+${formatVND(summary.netDiff)}` : `-${formatVND(Math.abs(summary.netDiff))}`}
                        </td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono font-bold">
                          {summary.netPercent.toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-1.5 font-bold text-rose-700">Trong đó: Các mục VƯỢT ĐỊNH MỨC</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">-</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">-</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono text-rose-700 font-bold">+{formatVND(summary.totalExceeded)} VNĐ</td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono text-rose-700">+{((summary.totalExceeded / summary.totalV1) * 100).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-1.5 font-bold text-emerald-700">Trong đó: Giá trị GIẢM TRỪ THẨM TRA</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">-</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">-</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono text-emerald-700 font-bold">-{formatVND(summary.totalReduced)} VNĐ</td>
                        <td className="border border-slate-400 p-1.5 text-center font-mono text-emerald-700">-{((summary.totalReduced / summary.totalV1) * 100).toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section III: Detailed Table of Exceeded and Adjusted Items */}
                <div className="space-y-2 mb-6 font-sans">
                  <div className="font-bold text-slate-900 uppercase">
                    III. CHI TIẾT CÁC HẠNG MỤC SAI LỆCH VƯỢT ĐỊNH MỨC & CẮT GIẢM:
                  </div>
                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-400 p-1 w-8">STT</th>
                        <th className="border border-slate-400 p-1 w-16">Mã hiệu</th>
                        <th className="border border-slate-400 p-1 text-left">Tên công tác</th>
                        <th className="border border-slate-400 p-1 w-10">ĐVT</th>
                        <th className="border border-slate-400 p-1 text-right">KL Trình</th>
                        <th className="border border-slate-400 p-1 text-right">KL Duyệt</th>
                        <th className="border border-slate-400 p-1 text-right">Chênh lệch (VNĐ)</th>
                        <th className="border border-slate-400 p-1 text-left">Nguyên nhân & Căn cứ TT12</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versionItems.filter(i => i.diffTotal !== 0).map((it, idx) => (
                        <tr key={it.id}>
                          <td className="border border-slate-400 p-1 text-center font-mono">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono font-bold text-blue-700">{it.code}</td>
                          <td className="border border-slate-400 p-1 font-medium">{it.name}</td>
                          <td className="border border-slate-400 p-1 text-center">{it.unit}</td>
                          <td className="border border-slate-400 p-1 text-right font-mono">{formatQuantity(it.v1Qty)}</td>
                          <td className="border border-slate-400 p-1 text-right font-mono font-bold">{formatQuantity(it.v2Qty)}</td>
                          <td className={`border border-slate-400 p-1 text-right font-mono font-bold ${it.diffTotal > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {it.diffTotal > 0 ? `+${formatVND(it.diffTotal)}` : `-${formatVND(Math.abs(it.diffTotal))}`}
                          </td>
                          <td className="border border-slate-400 p-1 text-[9px] text-slate-700 leading-tight">
                            {it.exceededReason} ({it.legalNormStandard})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section IV: Conclusion & Signatures */}
                <div className="space-y-2 mb-8 font-sans">
                  <div className="font-bold text-slate-900 uppercase">IV. KẾT LUẬN & KIẾN NGHỊ:</div>
                  <p className="text-[11px] leading-relaxed text-slate-800 pl-3">
                    Sau khi đối chiếu hồ sơ bản vẽ thiết kế với tiêu chuẩn định mức xây dựng tại Thông tư 12/2021/TT-BXD và đơn giá xây dựng tỉnh {settings.locationProvince}, cơ quan thẩm tra đã rà soát cắt giảm các khối lượng đo bóc trùng lặp, tính thừa với tổng giá trị giảm trừ là <strong>{formatVND(summary.totalReduced)} VNĐ</strong>, đồng thời bổ sung các công tác phát sinh kỹ thuật hợp lệ <strong>{formatVND(summary.totalExceeded)} VNĐ</strong>. Kính trình Chủ đầu tư phê duyệt dự toán làm cơ sở quản lý chi phí.
                  </p>
                </div>

                {/* Signature Block */}
                <div className="grid grid-cols-3 text-center font-sans mt-10 pt-4">
                  <div>
                    <div className="font-bold text-xs uppercase text-slate-800">NGƯỜI LẬP BÁO CÁO</div>
                    <div className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</div>
                    <div className="h-16" />
                    <div className="font-bold text-xs text-slate-900">KS. Nguyễn Văn An</div>
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase text-slate-800">CHỦ TRÌ THẨM TRA</div>
                    <div className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</div>
                    <div className="h-16" />
                    <div className="font-bold text-xs text-slate-900">ThS. Trần Đức Minh</div>
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase text-slate-800">THỦ TRƯỞNG CƠ QUAN THẨM TRA</div>
                    <div className="text-[10px] text-slate-400 italic">(Ký tên và đóng dấu)</div>
                    <div className="h-16" />
                    <div className="font-bold text-xs text-slate-900">TS. Phạm Quốc Hùng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
