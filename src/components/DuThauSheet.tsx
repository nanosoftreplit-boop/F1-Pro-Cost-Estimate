import React, { useState } from 'react';
import { WorkItem, ProjectSettings } from '../types/estimate';
import { computeDetailedUnitPrices, formatQuantity, formatVND } from '../utils/calculator';
import { Tag, TrendingDown } from 'lucide-react';

interface DuThauSheetProps {
  items: WorkItem[];
  settings: ProjectSettings;
}

export const DuThauSheet: React.FC<DuThauSheetProps> = ({
  items,
  settings,
}) => {
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const detailed = computeDetailedUnitPrices(items, settings);

  let totalPreTax = 0;
  let totalPostTax = 0;

  detailed.forEach((d, idx) => {
    const q = items[idx]?.quantity || 0;
    totalPreTax += q * d.unitPricePreTax;
    totalPostTax += q * d.unitPricePostTax;
  });

  const discountAmount = totalPostTax * (discountPercent / 100);
  const finalBidPrice = totalPostTax - discountAmount;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Top summary and discount controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] text-slate-600 font-medium">Tỷ lệ giảm giá dự thầu:</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-14 text-center font-bold text-blue-700 bg-blue-50/50 border border-blue-200 rounded px-1 text-xs"
            />
            <span className="text-slate-500 font-bold">%</span>
          </div>

          {discountPercent > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Tiết kiệm giảm giá: -{formatVND(discountAmount)} VNĐ</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-500 text-[11px] block">Giá dự thầu trước thuế:</span>
            <span className="font-semibold text-slate-800">{formatVND(totalPreTax)} VNĐ</span>
          </div>
          <div className="text-right pl-4 border-l border-slate-300">
            <span className="text-slate-500 text-[11px] block">TỔNG GIÁ DỰ THẦU SAU GIẢM GIÁ:</span>
            <span className="font-bold text-sm text-blue-700">{formatVND(finalBidPrice)} VNĐ</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th className="f1-header-cell w-10">STT</th>
              <th className="f1-header-cell w-24">Mã hiệu</th>
              <th className="f1-header-cell min-w-[280px] text-left px-3">Tên công tác mời thầu</th>
              <th className="f1-header-cell w-16">ĐVT</th>
              <th className="f1-header-cell w-24">Khối lượng</th>
              <th className="f1-header-cell w-32">Đơn giá dự thầu (chưa VAT)</th>
              <th className="f1-header-cell w-36">Thành tiền (chưa VAT)</th>
              <th className="f1-header-cell w-32 bg-blue-50 text-blue-900">Đơn giá dự thầu (có VAT)</th>
              <th className="f1-header-cell w-36 bg-blue-100/70 font-bold text-blue-950">Thành tiền dự thầu (có VAT)</th>
            </tr>
          </thead>
          <tbody>
            {detailed.map((d, idx) => {
              const item = items[idx];
              const q = item?.quantity || 0;
              const preTaxTotal = q * d.unitPricePreTax;
              const postTaxTotal = q * d.unitPricePostTax;

              return (
                <tr key={d.workItemId} className="hover:bg-slate-50 transition-colors">
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell text-center font-mono font-medium text-blue-700">{d.code}</td>
                  <td className="f1-cell px-3 text-slate-800 font-medium">{d.name}</td>
                  <td className="f1-cell text-center text-slate-600">{d.unit}</td>
                  <td className="f1-cell text-right tabular-nums font-mono font-semibold text-slate-900">
                    {formatQuantity(q)}
                  </td>
                  <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">
                    {formatVND(d.unitPricePreTax)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-medium text-slate-800">
                    {formatVND(preTaxTotal)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-mono text-blue-900 bg-blue-50/30">
                    {formatVND(d.unitPricePostTax)}
                  </td>
                  <td className="f1-cell text-right tabular-nums font-bold text-slate-900 bg-slate-100">
                    {formatVND(postTaxTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-10 bg-slate-900 text-white font-bold text-xs shadow-md">
            <tr className="border-t-2 border-slate-700">
              <td colSpan={4} className="f1-cell text-center py-2 text-slate-300">
                TỔNG CỘNG GIÁ DỰ THẦU
              </td>
              <td className="f1-cell text-center text-slate-400 font-mono">{items.length} công tác</td>
              <td className="f1-cell text-slate-500"></td>
              <td className="f1-cell text-right tabular-nums text-slate-300">{formatVND(totalPreTax)}</td>
              <td className="f1-cell text-slate-500"></td>
              <td className="f1-cell text-right tabular-nums text-emerald-400 font-bold bg-slate-800 text-sm">
                {formatVND(totalPostTax)}
              </td>
            </tr>
            {discountPercent > 0 && (
              <tr className="bg-slate-800 border-t border-slate-700 text-amber-300">
                <td colSpan={8} className="f1-cell text-right py-1.5 pr-4 text-xs font-medium">
                  GIÁ DỰ THẦU SAU GIẢM GIÁ ({discountPercent}%):
                </td>
                <td className="f1-cell text-right tabular-nums text-amber-400 font-bold text-sm bg-slate-950">
                  {formatVND(finalBidPrice)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );
};
