import React, { useState } from 'react';
import { SettlementItem, ProjectSettings } from '../types/estimate';
import { formatQuantity, formatVND } from '../utils/calculator';
import { Plus, Trash2, Printer, CheckCircle, FileCheck, Layers } from 'lucide-react';

interface ThanhQuyetToanSheetProps {
  settlements: SettlementItem[];
  settings: ProjectSettings;
  onUpdateSettlement: (id: string, patch: Partial<SettlementItem>) => void;
  onAddSettlementItem: (isAdditional: boolean) => void;
  onDeleteSettlementItem: (id: string) => void;
}

export const ThanhQuyetToanSheet: React.FC<ThanhQuyetToanSheetProps> = ({
  settlements,
  settings,
  onUpdateSettlement,
  onAddSettlementItem,
  onDeleteSettlementItem,
}) => {
  const [period, setPeriod] = useState<string>('Đợt 2 (Nghiệm thu phần thân)');
  const [advanceDeductionRate, setAdvanceDeductionRate] = useState<number>(15); // Khấu trừ tạm ứng 15%
  const [retentionRate, setRetentionRate] = useState<number>(5); // Giữ lại bảo hành 5%

  const inContractItems = settlements.filter(s => !s.isAdditional);
  const additionalItems = settlements.filter(s => s.isAdditional);

  let thisPeriodTotalInContract = 0;
  let contractTotalAll = 0;
  inContractItems.forEach(s => {
    contractTotalAll += s.contractQty * s.contractPrice;
    thisPeriodTotalInContract += s.thisPeriodQty * s.contractPrice;
  });

  let thisPeriodTotalAdditional = 0;
  additionalItems.forEach(s => {
    thisPeriodTotalAdditional += s.thisPeriodQty * s.contractPrice;
  });

  const totalThisPeriodGross = thisPeriodTotalInContract + thisPeriodTotalAdditional;
  const advanceDeductionAmount = totalThisPeriodGross * (advanceDeductionRate / 100);
  const retentionAmount = totalThisPeriodGross * (retentionRate / 100);
  const netPaymentAmount = totalThisPeriodGross - advanceDeductionAmount - retentionAmount;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Top Settlement Parameter Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Kỳ thanh toán:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium text-slate-800"
            >
              <option value="Đợt 1 (Nghiệm thu phần móng ngầm)">Đợt 1 (Nghiệm thu phần móng ngầm)</option>
              <option value="Đợt 2 (Nghiệm thu phần thân)">Đợt 2 (Nghiệm thu phần thân)</option>
              <option value="Đợt 3 (Nghiệm thu hoàn thiện & M&E)">Đợt 3 (Nghiệm thu hoàn thiện & M&E)</option>
              <option value="Quyết toán hợp đồng A-B cuối cùng">Quyết toán hợp đồng A-B cuối cùng</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-300">
            <span className="text-[11px] text-slate-500">Khấu trừ tạm ứng:</span>
            <input
              type="number"
              value={advanceDeductionRate}
              onChange={(e) => setAdvanceDeductionRate(parseFloat(e.target.value) || 0)}
              className="w-12 text-center text-xs font-mono font-bold border border-slate-300 rounded py-0.5"
            />
            <span className="text-slate-500">%</span>

            <span className="text-[11px] text-slate-500 ml-2">Bảo hành:</span>
            <input
              type="number"
              value={retentionRate}
              onChange={(e) => setRetentionRate(parseFloat(e.target.value) || 0)}
              className="w-12 text-center text-xs font-mono font-bold border border-slate-300 rounded py-0.5"
            />
            <span className="text-slate-500">%</span>
          </div>

          <button
            onClick={() => onAddSettlementItem(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-medium transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Thêm KL phát sinh (03b)</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">Tổng nghiệm thu kỳ này:</span>
            <span className="font-semibold text-slate-800">{formatVND(totalThisPeriodGross)} VNĐ</span>
          </div>
          <div className="text-right pl-3 border-l border-slate-300">
            <span className="text-emerald-600 text-[10px] font-bold block">THỰC LĨNH THANH TOÁN:</span>
            <span className="font-bold text-sm text-emerald-700">{formatVND(netPaymentAmount)} VNĐ</span>
          </div>
        </div>
      </div>

      {/* Main Settlement Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th rowSpan={2} className="f1-header-cell w-10">STT</th>
              <th rowSpan={2} className="f1-header-cell w-24">Mã hiệu</th>
              <th rowSpan={2} className="f1-header-cell min-w-[260px] text-left px-3">Nội dung công việc</th>
              <th rowSpan={2} className="f1-header-cell w-14">ĐVT</th>
              <th colSpan={2} className="f1-header-cell">Hợp đồng</th>
              <th colSpan={3} className="f1-header-cell">Khối lượng thực hiện</th>
              <th rowSpan={2} className="f1-header-cell w-32 bg-emerald-50 text-emerald-950 font-bold">Thành tiền kỳ này</th>
              <th rowSpan={2} className="f1-header-cell w-12">Xóa</th>
            </tr>
            <tr className="border-b border-slate-300 bg-slate-50">
              <th className="f1-header-cell w-20">Khối lượng</th>
              <th className="f1-header-cell w-24">Đơn giá HĐ</th>
              <th className="f1-header-cell w-20">Lũy kế trước</th>
              <th className="f1-header-cell w-20 bg-amber-50">Kỳ này</th>
              <th className="f1-header-cell w-20">Lũy kế này</th>
            </tr>
          </thead>
          <tbody>
            {/* Phụ lục 03.a: Khối lượng trong hợp đồng */}
            <tr className="bg-blue-100/90 font-bold text-blue-950 border-y border-blue-200">
              <td className="f1-cell text-center">A</td>
              <td colSpan={8} className="f1-cell px-3">
                PHỤ LỤC 03.a: KHỐI LƯỢNG HOÀN THÀNH THEO HỢP ĐỒNG BAN ĐẦU
              </td>
              <td className="f1-cell text-right tabular-nums bg-blue-200/50">{formatVND(thisPeriodTotalInContract)}</td>
              <td className="f1-cell text-center"></td>
            </tr>

            {inContractItems.map((s, idx) => {
              const thisAmount = s.thisPeriodQty * s.contractPrice;
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell text-center font-mono font-medium text-blue-700">{s.code}</td>
                  <td className="f1-cell px-3 text-slate-800 font-medium">{s.name}</td>
                  <td className="f1-cell text-center text-slate-600">{s.unit}</td>
                  <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">{formatQuantity(s.contractQty)}</td>
                  <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">{formatVND(s.contractPrice)}</td>
                  <td className="f1-cell text-right tabular-nums text-slate-500 font-mono">{formatQuantity(s.prevAccumulatedQty)}</td>
                  <td className="f1-cell text-right tabular-nums bg-amber-50/40">
                    <input
                      type="number"
                      step="any"
                      value={s.thisPeriodQty}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateSettlement(s.id, {
                          thisPeriodQty: val,
                          totalAccumulatedQty: s.prevAccumulatedQty + val
                        });
                      }}
                      className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono font-semibold text-amber-900"
                    />
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-900 font-semibold font-mono">
                    {formatQuantity(s.totalAccumulatedQty)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-bold text-emerald-800 bg-emerald-50/30">
                    {formatVND(thisAmount)}
                  </td>
                  <td className="f1-cell text-center">
                    <button
                      onClick={() => onDeleteSettlementItem(s.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Phụ lục 03.b: Khối lượng phát sinh ngoài hợp đồng */}
            <tr className="bg-amber-100/90 font-bold text-amber-950 border-y border-amber-200">
              <td className="f1-cell text-center">B</td>
              <td colSpan={8} className="f1-cell px-3">
                PHỤ LỤC 03.b: KHỐI LƯỢNG CÔNG VIỆC PHÁT SINH NGOÀI HỢP ĐỒNG (BỔ SUNG)
              </td>
              <td className="f1-cell text-right tabular-nums bg-amber-200/50">{formatVND(thisPeriodTotalAdditional)}</td>
              <td className="f1-cell text-center"></td>
            </tr>

            {additionalItems.map((s, idx) => {
              const thisAmount = s.thisPeriodQty * s.contractPrice;
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors bg-amber-50/10">
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell text-center font-mono font-medium text-amber-700">{s.code}</td>
                  <td className="f1-cell px-3 text-slate-800 font-medium">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => onUpdateSettlement(s.id, { name: e.target.value })}
                      className="w-full bg-transparent focus:bg-white focus:outline-hidden px-1 rounded text-amber-950 font-medium"
                    />
                  </td>
                  <td className="f1-cell text-center text-slate-600">{s.unit}</td>
                  <td className="f1-cell text-center text-slate-400">-</td>
                  <td className="f1-cell text-right tabular-nums font-mono">
                    <input
                      type="number"
                      value={s.contractPrice}
                      onChange={(e) => onUpdateSettlement(s.id, { contractPrice: parseFloat(e.target.value) || 0 })}
                      className="w-20 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono"
                    />
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">{formatQuantity(s.prevAccumulatedQty)}</td>
                  <td className="f1-cell text-right tabular-nums bg-amber-50/40">
                    <input
                      type="number"
                      step="any"
                      value={s.thisPeriodQty}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateSettlement(s.id, {
                          thisPeriodQty: val,
                          totalAccumulatedQty: s.prevAccumulatedQty + val
                        });
                      }}
                      className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono font-semibold text-amber-900"
                    />
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-900 font-semibold font-mono">
                    {formatQuantity(s.totalAccumulatedQty)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-bold text-amber-900 bg-amber-50/30">
                    {formatVND(thisAmount)}
                  </td>
                  <td className="f1-cell text-center">
                    <button
                      onClick={() => onDeleteSettlementItem(s.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-10 bg-slate-900 text-white font-bold text-xs shadow-md">
            <tr className="border-t-2 border-slate-700">
              <td colSpan={9} className="f1-cell text-right py-2 pr-4 text-slate-300">
                1. TỔNG GIÁ TRỊ KHỐI LƯỢNG HOÀN THÀNH KỲ NÀY (PL 03a + PL 03b):
              </td>
              <td className="f1-cell text-right tabular-nums text-emerald-400 font-bold bg-slate-800 text-sm">
                {formatVND(totalThisPeriodGross)}
              </td>
              <td className="f1-cell"></td>
            </tr>
            <tr className="bg-slate-850 text-slate-300">
              <td colSpan={9} className="f1-cell text-right py-1 pr-4 text-amber-400">
                2. Giảm trừ: Khấu trừ tạm ứng hợp đồng ({advanceDeductionRate}%):
              </td>
              <td className="f1-cell text-right tabular-nums text-amber-400">
                -{formatVND(advanceDeductionAmount)}
              </td>
              <td className="f1-cell"></td>
            </tr>
            <tr className="bg-slate-850 text-slate-300">
              <td colSpan={9} className="f1-cell text-right py-1 pr-4 text-amber-400">
                3. Giảm trừ: Tiền giữ lại bảo hành công trình ({retentionRate}%):
              </td>
              <td className="f1-cell text-right tabular-nums text-amber-400">
                -{formatVND(retentionAmount)}
              </td>
              <td className="f1-cell"></td>
            </tr>
            <tr className="bg-emerald-950 text-white border-t border-emerald-700 text-sm">
              <td colSpan={9} className="f1-cell text-right py-2 pr-4 font-extrabold text-emerald-300">
                4. SỐ TIỀN CHỦ ĐẦU TƯ THANH TOÁN KỲ NÀY CHO NHÀ THẦU (THỰC LĨNH):
              </td>
              <td className="f1-cell text-right tabular-nums text-emerald-300 font-extrabold bg-emerald-900">
                {formatVND(netPaymentAmount)}
              </td>
              <td className="f1-cell"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
