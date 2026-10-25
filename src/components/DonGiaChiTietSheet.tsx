import React, { useState } from 'react';
import { WorkItem, ProjectSettings } from '../types/estimate';
import { computeDetailedUnitPrices, formatVND } from '../utils/calculator';
import { Search } from 'lucide-react';

interface DonGiaChiTietSheetProps {
  items: WorkItem[];
  settings: ProjectSettings;
}

export const DonGiaChiTietSheet: React.FC<DonGiaChiTietSheetProps> = ({
  items,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const detailed = computeDetailedUnitPrices(items, settings);

  const filtered = detailed.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm công tác trong đơn giá chi tiết..."
              className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded bg-white w-64 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Quy chuẩn: Thông tư 11/2021/TT-BXD (Chi phí chung 7.3%, Nhà tạm 1.2%, TL 5.5%)
          </span>
        </div>
        <div className="text-[11px] text-slate-600">
          Tổng số đơn giá: <strong>{filtered.length}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th rowSpan={2} className="f1-header-cell w-10">STT</th>
              <th rowSpan={2} className="f1-header-cell w-24">Mã hiệu</th>
              <th rowSpan={2} className="f1-header-cell min-w-[240px] text-left px-3">Tên công tác</th>
              <th rowSpan={2} className="f1-header-cell w-16">ĐVT</th>
              <th colSpan={4} className="f1-header-cell">Chi phí trực tiếp (T)</th>
              <th colSpan={3} className="f1-header-cell">Chi phí gián tiếp (GT)</th>
              <th rowSpan={2} className="f1-header-cell w-24 bg-amber-50">Lãi định mức (TL)</th>
              <th rowSpan={2} className="f1-header-cell w-28 bg-slate-200 font-bold">Đơn giá trước thuế (G)</th>
              <th rowSpan={2} className="f1-header-cell w-24">Thuế VAT ({(settings.vatRate * 100).toFixed(0)}%)</th>
              <th rowSpan={2} className="f1-header-cell w-32 bg-blue-100 font-bold text-blue-950">Đơn giá sau thuế</th>
            </tr>
            <tr className="border-b border-slate-300 bg-slate-50">
              <th className="f1-header-cell w-20">Vật liệu</th>
              <th className="f1-header-cell w-20">Nhân công</th>
              <th className="f1-header-cell w-20">Máy</th>
              <th className="f1-header-cell w-24 font-bold bg-slate-100">Cộng TT (T)</th>
              <th className="f1-header-cell w-20">Chung (C)</th>
              <th className="f1-header-cell w-20">Nhà tạm (LT)</th>
              <th className="f1-header-cell w-24 font-bold bg-slate-100">Cộng GT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={d.workItemId} className="hover:bg-slate-50 transition-colors">
                <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                <td className="f1-cell text-center font-mono font-medium text-blue-700">{d.code}</td>
                <td className="f1-cell px-3 text-slate-800 font-medium">{d.name}</td>
                <td className="f1-cell text-center text-slate-600">{d.unit}</td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(d.materialCost)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(d.laborCost)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(d.machineCost)}</td>
                <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-slate-50">{formatVND(d.directCost)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(d.generalCost)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(d.temporaryCampCost)}</td>
                <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-slate-50">{formatVND(d.indirectCostTotal)}</td>
                <td className="f1-cell text-right tabular-nums text-amber-800 bg-amber-50/30">{formatVND(d.taxableProfit)}</td>
                <td className="f1-cell text-right tabular-nums font-bold text-slate-900 bg-slate-100">{formatVND(d.unitPricePreTax)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-700">{formatVND(d.vatAmount)}</td>
                <td className="f1-cell text-right tabular-nums font-bold text-blue-900 bg-blue-50/50">{formatVND(d.unitPricePostTax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
