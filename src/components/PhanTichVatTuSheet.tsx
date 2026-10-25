import React, { useState } from 'react';
import { WorkItem, MaterialBreakdown, LaborBreakdown, MachineBreakdown } from '../types/estimate';
import { formatQuantity, formatVND } from '../utils/calculator';
import { Search } from 'lucide-react';

interface PhanTichVatTuSheetProps {
  items: WorkItem[];
  onUpdateWorkItem: (itemId: string, patch: Partial<WorkItem>) => void;
}

export const PhanTichVatTuSheet: React.FC<PhanTichVatTuSheetProps> = ({
  items,
  onUpdateWorkItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Filter toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm công tác trong phân tích vật tư..."
              className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded bg-white w-64 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            Hiển thị định mức chi tiết theo Thông tư 12/2021/TT-BXD
          </span>
        </div>
        <div className="text-[11px] text-slate-600">
          Tổng số công tác phân tích: <strong>{filteredItems.length}</strong>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              <th className="f1-header-cell w-12">STT</th>
              <th className="f1-header-cell w-28">Mã hiệu</th>
              <th className="f1-header-cell min-w-[300px] text-left px-3">Tên công tác & thành phần hao phí</th>
              <th className="f1-header-cell w-20">Đơn vị</th>
              <th className="f1-header-cell w-24">Định mức</th>
              <th className="f1-header-cell w-24">Khối lượng</th>
              <th className="f1-header-cell w-28">Tổng hao phí</th>
              <th className="f1-header-cell w-28">Đơn giá (VNĐ)</th>
              <th className="f1-header-cell w-32">Thành tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const q = item.quantity || 0;
              let itemMatTotal = 0;
              let itemLabTotal = 0;
              let itemMacTotal = 0;

              (item.materials || []).forEach(m => itemMatTotal += q * m.norm * m.price);
              (item.labors || []).forEach(l => itemLabTotal += q * l.norm * l.price);
              (item.machines || []).forEach(mac => itemMacTotal += q * mac.norm * mac.price);
              const itemTotal = itemMatTotal + itemLabTotal + itemMacTotal;

              return (
                <React.Fragment key={item.id}>
                  {/* Dòng công tác cha */}
                  <tr className="bg-slate-200/90 font-bold text-slate-900 border-t border-slate-300">
                    <td className="f1-cell text-center font-mono">{item.stt}</td>
                    <td className="f1-cell text-center font-mono text-blue-700">{item.code}</td>
                    <td className="f1-cell px-3 font-semibold">{item.name}</td>
                    <td className="f1-cell text-center">{item.unit}</td>
                    <td className="f1-cell text-center text-slate-400">-</td>
                    <td className="f1-cell text-right tabular-nums text-slate-900 font-mono">{formatQuantity(q)}</td>
                    <td className="f1-cell text-center text-slate-400">-</td>
                    <td className="f1-cell text-center text-slate-400">-</td>
                    <td className="f1-cell text-right tabular-nums font-bold text-blue-800 bg-slate-300/60">
                      {formatVND(itemTotal)}
                    </td>
                  </tr>

                  {/* Phân tích Vật liệu */}
                  {item.materials && item.materials.length > 0 && (
                    <>
                      <tr className="bg-blue-50/60 text-blue-900 font-semibold text-[11px]">
                        <td className="f1-cell text-center text-slate-400 font-mono">*</td>
                        <td className="f1-cell text-center font-mono text-slate-400">VL</td>
                        <td colSpan={6} className="f1-cell pl-6 text-blue-900">1. Vật liệu</td>
                        <td className="f1-cell text-right tabular-nums text-blue-900 font-semibold">{formatVND(itemMatTotal)}</td>
                      </tr>
                      {item.materials.map((m, mIdx) => {
                        const totalNorm = q * m.norm;
                        const amount = totalNorm * m.price;
                        return (
                          <tr key={m.code + mIdx} className="hover:bg-slate-50 text-[11px]">
                            <td className="f1-cell text-center text-slate-400 font-mono">{mIdx + 1}</td>
                            <td className="f1-cell text-center font-mono text-slate-500">{m.code}</td>
                            <td className="f1-cell pl-8 text-slate-700">{m.name}</td>
                            <td className="f1-cell text-center text-slate-500">{m.unit}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">
                              <input
                                type="number"
                                step="any"
                                value={m.norm}
                                onChange={(e) => {
                                  const newNorm = parseFloat(e.target.value) || 0;
                                  const updatedMats = item.materials.map(mat => mat.code === m.code ? { ...mat, norm: newNorm } : mat);
                                  onUpdateWorkItem(item.id, { materials: updatedMats });
                                }}
                                className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">{formatQuantity(q)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800 font-mono font-medium">{formatQuantity(totalNorm)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">
                              <input
                                type="number"
                                value={m.price}
                                onChange={(e) => {
                                  const newPrice = parseFloat(e.target.value) || 0;
                                  const updatedMats = item.materials.map(mat => mat.code === m.code ? { ...mat, price: newPrice } : mat);
                                  onUpdateWorkItem(item.id, { materials: updatedMats });
                                }}
                                className="w-20 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(amount)}</td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Phân tích Nhân công */}
                  {item.labors && item.labors.length > 0 && (
                    <>
                      <tr className="bg-amber-50/60 text-amber-900 font-semibold text-[11px]">
                        <td className="f1-cell text-center text-slate-400 font-mono">*</td>
                        <td className="f1-cell text-center font-mono text-slate-400">NC</td>
                        <td colSpan={6} className="f1-cell pl-6 text-amber-900">2. Nhân công</td>
                        <td className="f1-cell text-right tabular-nums text-amber-900 font-semibold">{formatVND(itemLabTotal)}</td>
                      </tr>
                      {item.labors.map((l, lIdx) => {
                        const totalNorm = q * l.norm;
                        const amount = totalNorm * l.price;
                        return (
                          <tr key={l.code + lIdx} className="hover:bg-slate-50 text-[11px]">
                            <td className="f1-cell text-center text-slate-400 font-mono">{lIdx + 1}</td>
                            <td className="f1-cell text-center font-mono text-slate-500">{l.code}</td>
                            <td className="f1-cell pl-8 text-slate-700">{`${l.name} (${l.rank})`}</td>
                            <td className="f1-cell text-center text-slate-500">{l.unit}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">
                              <input
                                type="number"
                                step="any"
                                value={l.norm}
                                onChange={(e) => {
                                  const newNorm = parseFloat(e.target.value) || 0;
                                  const updatedLabors = item.labors.map(lab => lab.code === l.code ? { ...lab, norm: newNorm } : lab);
                                  onUpdateWorkItem(item.id, { labors: updatedLabors });
                                }}
                                className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">{formatQuantity(q)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800 font-mono font-medium">{formatQuantity(totalNorm)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">{formatVND(l.price)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(amount)}</td>
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Phân tích Máy thi công */}
                  {item.machines && item.machines.length > 0 && (
                    <>
                      <tr className="bg-emerald-50/60 text-emerald-900 font-semibold text-[11px]">
                        <td className="f1-cell text-center text-slate-400 font-mono">*</td>
                        <td className="f1-cell text-center font-mono text-slate-400">MTC</td>
                        <td colSpan={6} className="f1-cell pl-6 text-emerald-900">3. Máy thi công</td>
                        <td className="f1-cell text-right tabular-nums text-emerald-900 font-semibold">{formatVND(itemMacTotal)}</td>
                      </tr>
                      {item.machines.map((mac, macIdx) => {
                        const totalNorm = q * mac.norm;
                        const amount = totalNorm * mac.price;
                        return (
                          <tr key={mac.code + macIdx} className="hover:bg-slate-50 text-[11px]">
                            <td className="f1-cell text-center text-slate-400 font-mono">{macIdx + 1}</td>
                            <td className="f1-cell text-center font-mono text-slate-500">{mac.code}</td>
                            <td className="f1-cell pl-8 text-slate-700">{mac.name}</td>
                            <td className="f1-cell text-center text-slate-500">{mac.unit}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">
                              <input
                                type="number"
                                step="any"
                                value={mac.norm}
                                onChange={(e) => {
                                  const newNorm = parseFloat(e.target.value) || 0;
                                  const updatedMacs = item.machines.map(m => m.code === mac.code ? { ...m, norm: newNorm } : m);
                                  onUpdateWorkItem(item.id, { machines: updatedMacs });
                                }}
                                className="w-16 text-right bg-transparent focus:bg-white focus:outline-hidden px-1 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-400 font-mono">{formatQuantity(q)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800 font-mono font-medium">{formatQuantity(totalNorm)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-700 font-mono">{formatVND(mac.price)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(amount)}</td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
