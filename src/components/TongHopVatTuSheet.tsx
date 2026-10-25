import React from 'react';
import { WorkItem, ProjectSettings } from '../types/estimate';
import { aggregateMaterials, formatQuantity, formatVND } from '../utils/calculator';
import { Coins, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TongHopVatTuSheetProps {
  items: WorkItem[];
  settings: ProjectSettings;
  onUpdateMonthlyPrice: (matCode: string, newMonthlyPrice: number) => void;
  onOpenMonthlyPriceModal: () => void;
}

export const TongHopVatTuSheet: React.FC<TongHopVatTuSheetProps> = ({
  items,
  settings,
  onUpdateMonthlyPrice,
  onOpenMonthlyPriceModal,
}) => {
  const aggregated = aggregateMaterials(items);

  let totalBaseMat = 0;
  let totalMonthMat = 0;
  let totalDiffMat = 0;
  aggregated.materials.forEach(m => {
    totalBaseMat += m.baseAmount;
    totalMonthMat += m.monthlyAmount;
    totalDiffMat += m.diffAmount;
  });

  let totalBaseLab = 0;
  let totalMonthLab = 0;
  aggregated.labors.forEach(l => {
    totalBaseLab += l.baseAmount;
    totalMonthLab += l.monthlyAmount;
  });

  let totalBaseMac = 0;
  let totalMonthMac = 0;
  aggregated.machines.forEach(mac => {
    totalBaseMac += mac.baseAmount;
    totalMonthMac += mac.monthlyAmount;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Top action & stat strip */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMonthlyPriceModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow-xs transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Lắp giá thông báo Sở XD ({settings.locationProvince})</span>
          </button>
          <span className="text-[11px] text-slate-500">
            Cho phép sửa trực tiếp cột <strong>Giá tháng</strong> để tính bù chênh lệch vật liệu tức thì
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Tiền bù giá VL:</span>
            <span className={`font-bold ${totalDiffMat >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {totalDiffMat >= 0 ? `+${formatVND(totalDiffMat)}` : formatVND(totalDiffMat)} VNĐ
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Tổng tiền VL giá tháng:</span>
            <strong className="text-slate-900 font-bold">{formatVND(totalMonthMat)} VNĐ</strong>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th className="f1-header-cell w-10">STT</th>
              <th className="f1-header-cell w-24">Mã VT</th>
              <th className="f1-header-cell min-w-[260px] text-left px-3">Tên vật tư, quy cách</th>
              <th className="f1-header-cell w-16">ĐVT</th>
              <th className="f1-header-cell w-24">Khối lượng</th>
              <th className="f1-header-cell w-24">Giá gốc</th>
              <th className="f1-header-cell w-28 bg-amber-100/70 font-bold text-amber-900">Giá tháng</th>
              <th className="f1-header-cell w-24">Chênh lệch</th>
              <th className="f1-header-cell w-28">Thành tiền gốc</th>
              <th className="f1-header-cell w-32 bg-slate-200">Thành tiền tháng</th>
              <th className="f1-header-cell w-28 bg-amber-50">Tiền chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            {/* 1. PHẦN VẬT LIỆU */}
            <tr className="bg-blue-100/90 font-bold text-blue-950 border-y border-blue-200">
              <td className="f1-cell text-center">I</td>
              <td colSpan={7} className="f1-cell px-3">PHẦN VẬT LIỆU XÂY DỰNG</td>
              <td className="f1-cell text-right tabular-nums">{formatVND(totalBaseMat)}</td>
              <td className="f1-cell text-right tabular-nums bg-blue-200/50">{formatVND(totalMonthMat)}</td>
              <td className="f1-cell text-right tabular-nums text-amber-800 font-bold">{formatVND(totalDiffMat)}</td>
            </tr>

            {aggregated.materials.map((m, idx) => {
              const hasDiff = m.diffPrice !== 0;
              return (
                <tr key={m.code} className="hover:bg-slate-50 transition-colors">
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell text-center font-mono text-slate-600">{m.code}</td>
                  <td className="f1-cell px-3 text-slate-800 font-medium">{m.name}</td>
                  <td className="f1-cell text-center text-slate-600">{m.unit}</td>
                  <td className="f1-cell text-right tabular-nums font-mono font-medium text-slate-900">
                    {formatQuantity(m.totalQuantity)}
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(m.basePrice)}</td>
                  <td className="f1-cell text-right tabular-nums bg-amber-50/50">
                    <input
                      type="number"
                      value={m.monthlyPrice}
                      onChange={(e) => onUpdateMonthlyPrice(m.code, parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-mono font-semibold text-amber-900"
                    />
                  </td>
                  <td className={`f1-cell text-right tabular-nums font-mono ${hasDiff ? (m.diffPrice > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold') : 'text-slate-400'}`}>
                    {hasDiff && (m.diffPrice > 0 ? `+${formatVND(m.diffPrice)}` : formatVND(m.diffPrice))}
                    {!hasDiff && '0'}
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-700">{formatVND(m.baseAmount)}</td>
                  <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-slate-50">{formatVND(m.monthlyAmount)}</td>
                  <td className={`f1-cell text-right tabular-nums font-mono font-medium ${hasDiff ? 'text-amber-800 bg-amber-50/30' : 'text-slate-400'}`}>
                    {formatVND(m.diffAmount)}
                  </td>
                </tr>
              );
            })}

            {/* 2. PHẦN NHÂN CÔNG */}
            <tr className="bg-amber-100/90 font-bold text-amber-950 border-y border-amber-200">
              <td className="f1-cell text-center">II</td>
              <td colSpan={7} className="f1-cell px-3">PHẦN NHÂN CÔNG XÂY DỰNG (THEO KHU VỰC {settings.salaryRegion})</td>
              <td className="f1-cell text-right tabular-nums">{formatVND(totalBaseLab)}</td>
              <td className="f1-cell text-right tabular-nums bg-amber-200/50">{formatVND(totalMonthLab)}</td>
              <td className="f1-cell text-right tabular-nums text-slate-400">0</td>
            </tr>

            {aggregated.labors.map((l, idx) => (
              <tr key={l.code} className="hover:bg-slate-50 transition-colors">
                <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                <td className="f1-cell text-center font-mono text-slate-600">{l.code}</td>
                <td className="f1-cell px-3 text-slate-800 font-medium">{l.name}</td>
                <td className="f1-cell text-center text-slate-600">{l.unit}</td>
                <td className="f1-cell text-right tabular-nums font-mono font-medium text-slate-900">
                  {formatQuantity(l.totalQuantity)}
                </td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(l.basePrice)}</td>
                <td className="f1-cell text-right tabular-nums font-mono text-slate-700">{formatVND(l.monthlyPrice)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">0</td>
                <td className="f1-cell text-right tabular-nums text-slate-700">{formatVND(l.baseAmount)}</td>
                <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-slate-50">{formatVND(l.monthlyAmount)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">0</td>
              </tr>
            ))}

            {/* 3. PHẦN MÁY THI CÔNG */}
            <tr className="bg-emerald-100/90 font-bold text-emerald-950 border-y border-emerald-200">
              <td className="f1-cell text-center">III</td>
              <td colSpan={7} className="f1-cell px-3">PHẦN MÁY THI CÔNG</td>
              <td className="f1-cell text-right tabular-nums">{formatVND(totalBaseMac)}</td>
              <td className="f1-cell text-right tabular-nums bg-emerald-200/50">{formatVND(totalMonthMac)}</td>
              <td className="f1-cell text-right tabular-nums text-slate-400">0</td>
            </tr>

            {aggregated.machines.map((mac, idx) => (
              <tr key={mac.code} className="hover:bg-slate-50 transition-colors">
                <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                <td className="f1-cell text-center font-mono text-slate-600">{mac.code}</td>
                <td className="f1-cell px-3 text-slate-800 font-medium">{mac.name}</td>
                <td className="f1-cell text-center text-slate-600">{mac.unit}</td>
                <td className="f1-cell text-right tabular-nums font-mono font-medium text-slate-900">
                  {formatQuantity(mac.totalQuantity)}
                </td>
                <td className="f1-cell text-right tabular-nums text-slate-600">{formatVND(mac.basePrice)}</td>
                <td className="f1-cell text-right tabular-nums font-mono text-slate-700">{formatVND(mac.monthlyPrice)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">0</td>
                <td className="f1-cell text-right tabular-nums text-slate-700">{formatVND(mac.baseAmount)}</td>
                <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-slate-50">{formatVND(mac.monthlyAmount)}</td>
                <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">0</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 z-10 bg-slate-900 text-white font-bold text-xs shadow-md">
            <tr className="border-t-2 border-slate-700">
              <td colSpan={4} className="f1-cell text-center py-2 text-slate-300">
                TỔNG CỘNG TOÀN BỘ VẬT TƯ (VL + NC + MÁY)
              </td>
              <td className="f1-cell text-center text-slate-400 font-mono">
                {aggregated.materials.length + aggregated.labors.length + aggregated.machines.length} danh mục
              </td>
              <td colSpan={3} className="f1-cell text-slate-500"></td>
              <td className="f1-cell text-right tabular-nums text-slate-300">
                {formatVND(totalBaseMat + totalBaseLab + totalBaseMac)}
              </td>
              <td className="f1-cell text-right tabular-nums text-emerald-400 font-bold bg-slate-800 text-sm">
                {formatVND(totalMonthMat + totalMonthLab + totalMonthMac)}
              </td>
              <td className="f1-cell text-right tabular-nums text-amber-400 font-bold">
                {formatVND(totalDiffMat)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
