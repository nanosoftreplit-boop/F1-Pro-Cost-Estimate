import React from 'react';
import { WorkItem, SubCalculation } from '../types/estimate';
import { evaluateMathExpression } from '../utils/calculator';

interface FormulaBarProps {
  selectedItem?: WorkItem;
  selectedSubCalc?: SubCalculation;
  onUpdateExpression: (expr: string) => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedItem,
  selectedSubCalc,
  onUpdateExpression,
}) => {
  const currentExpression = selectedSubCalc
    ? selectedSubCalc.expression
    : selectedItem?.subCalculations?.[0]?.expression || (selectedItem ? String(selectedItem.quantity) : '');

  const calculatedVal = evaluateMathExpression(currentExpression);

  const displayTarget = selectedSubCalc
    ? `[Diễn giải] ${selectedSubCalc.name}`
    : selectedItem
    ? `[${selectedItem.code}] ${selectedItem.name}`
    : 'Chưa chọn công tác';

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white border-b border-slate-200 text-xs text-slate-700 shadow-xs">
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800 min-w-[200px] max-w-[260px] truncate">
        <span className="text-slate-400 font-semibold select-none">Vị trí:</span>
        <span className="truncate" title={displayTarget}>{displayTarget}</span>
      </div>

      <div className="flex items-center font-bold text-slate-400 px-1 select-none font-serif italic text-sm">
        fx
      </div>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={currentExpression}
          onChange={(e) => onUpdateExpression(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
              if (selectedItem) {
                const qtyInput = document.getElementById(`cell-quantity-${selectedItem.id}`);
                qtyInput?.focus();
              }
            }
          }}
          placeholder="Nhập công thức diễn giải (Ví dụ: 12 * 1.8 * 1.8 * 0.6 hoặc 2 * (3.5 + 4.2) * 0.22)..."
          className="w-full px-2 py-1 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono text-xs text-slate-900"
        />
        {currentExpression && (
          <div className="flex items-center gap-1 shrink-0 text-slate-500 font-mono text-[11px]">
            <span>=</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {calculatedVal.toLocaleString('vi-VN')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
