import React, { useState, useEffect, useRef } from 'react';
import { NormTemplate } from '../types/estimate';
import { NORMS_CATALOG, searchNorms, removeVietnameseTones } from '../data/normsData';
import { formatVND } from '../utils/calculator';
import { Search, Plus, Check, Layers, X, BookOpen, Filter, Sparkles, Hash, Type, RotateCcw } from 'lucide-react';

interface NormLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNorm: (norm: NormTemplate) => void;
}

const CHAPTER_FILTERS = [
  { id: 'all', prefix: 'ALL', label: 'Tất cả các chương' },
  { id: 'prefix:AA', prefix: 'AA', label: 'AA: Chuẩn bị mặt bằng' },
  { id: 'prefix:AB', prefix: 'AB', label: 'AB: Đào đắp đất đá' },
  { id: 'prefix:AC', prefix: 'AC', label: 'AC: Cọc & nền móng' },
  { id: 'prefix:AD', prefix: 'AD', label: 'AD: Đường & hạ tầng' },
  { id: 'prefix:AE', prefix: 'AE', label: 'AE: Xây gạch & đá' },
  { id: 'prefix:AF', prefix: 'AF', label: 'AF: Bê tông tại chỗ' },
  { id: 'prefix:AG', prefix: 'AG', label: 'AG: Bê tông đúc sẵn' },
  { id: 'prefix:AH', prefix: 'AH', label: 'AH: Cốt thép bê tông' },
  { id: 'prefix:AI', prefix: 'AI', label: 'AI: Ván khuôn coffa' },
  { id: 'prefix:AK', prefix: 'AK', label: 'AK: Hoàn thiện công trình' },
  { id: 'prefix:AL', prefix: 'AL', label: 'AL: Kết cấu thép & kim loại' },
  { id: 'prefix:BA-BD', prefix: 'BA-BD', label: 'BA-BD: Cơ điện MEP & PCCC' },
  { id: 'prefix:SA', prefix: 'SA', label: 'SA: Sửa chữa phá dỡ' },
];

const QUICK_KEYWORD_TAGS = [
  { label: 'Bê tông', kw: 'bê tông' },
  { label: 'Cốt thép', kw: 'cốt thép' },
  { label: 'Ván khuôn', kw: 'ván khuôn' },
  { label: 'Đào đất móng', kw: 'đào' },
  { label: 'Xây gạch', kw: 'xây' },
  { label: 'Trát tường', kw: 'trát' },
  { label: 'Lát nền', kw: 'lát' },
  { label: 'Ốp đá Granite', kw: 'ốp đá' },
  { label: 'Sơn bả', kw: 'sơn' },
  { label: 'Cọc ép/nhồi', kw: 'cọc' },
  { label: 'Ống cấp nước', kw: 'ống' },
  { label: 'Dây điện', kw: 'dây điện' },
  { label: 'PCCC Sprinkler', kw: 'chữa cháy' },
  { label: 'Phá dỡ', kw: 'phá dỡ' },
];

function highlightText(text: string, searchTerms: string[]) {
  const validTerms = searchTerms
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (validTerms.length === 0) return text;

  const textNorm = removeVietnameseTones(text.toLowerCase());

  for (const term of validTerms) {
    const termNorm = removeVietnameseTones(term.toLowerCase());
    const idx = textNorm.indexOf(termNorm);
    if (idx !== -1 && termNorm.length > 0) {
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + term.length);
      const after = text.slice(idx + term.length);
      return (
        <span>
          {before}
          <mark className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded shadow-2xs">
            {match}
          </mark>
          {after}
        </span>
      );
    }
  }

  return text;
}

export const NormLookupModal: React.FC<NormLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectNorm,
}) => {
  const [globalQuery, setGlobalQuery] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedPreviewNorm, setSelectedPreviewNorm] = useState<NormTemplate>(NORMS_CATALOG[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Compute filtered results based on chapter, global query, code filter, and name filter
  const results = React.useMemo(() => {
    let list = searchNorms(globalQuery, selectedChapter);

    if (codeFilter.trim()) {
      const cQuery = codeFilter.toLowerCase().trim();
      const cClean = cQuery.replace(/[^a-z0-9]/g, '');
      list = list.filter(n => {
        const nCode = n.code.toLowerCase();
        const nClean = nCode.replace(/[^a-z0-9]/g, '');
        return nCode.includes(cQuery) || (cClean.length > 0 && nClean.includes(cClean));
      });
    }

    if (nameFilter.trim()) {
      const nQueryClean = removeVietnameseTones(nameFilter.toLowerCase().trim());
      list = list.filter(n => {
        const nNameClean = removeVietnameseTones(n.name.toLowerCase());
        return nNameClean.includes(nQueryClean) || n.name.toLowerCase().includes(nameFilter.toLowerCase().trim());
      });
    }

    return list;
  }, [globalQuery, selectedChapter, codeFilter, nameFilter]);

  // Keep preview norm in sync with results
  useEffect(() => {
    if (results.length > 0) {
      const exists = results.some(r => r.code === selectedPreviewNorm?.code);
      if (!exists) {
        setSelectedPreviewNorm(results[0]);
        setSelectedIndex(0);
      } else {
        const idx = results.findIndex(r => r.code === selectedPreviewNorm?.code);
        setSelectedIndex(idx >= 0 ? idx : 0);
      }
    }
  }, [results, selectedPreviewNorm?.code]);

  // Handle arrow key navigation and Enter selection
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing with shift/ctrl
      if (e.target instanceof HTMLInputElement && e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = Math.min(prev + 1, results.length - 1);
          if (results[next]) setSelectedPreviewNorm(results[next]);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = Math.max(prev - 1, 0);
          if (results[next]) setSelectedPreviewNorm(results[next]);
          return next;
        });
      } else if (e.key === 'Enter') {
        if (results.length > 0 && selectedPreviewNorm) {
          e.preventDefault();
          handleSelectAndClose(selectedPreviewNorm);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedPreviewNorm]);

  if (!isOpen) return null;

  // Helper count for each filter tab
  const getFilterCount = (filterId: string) => {
    if (filterId === 'all') return NORMS_CATALOG.length;
    if (filterId === 'prefix:BA-BD') {
      return NORMS_CATALOG.filter(n =>
        n.code.startsWith('BA') || n.code.startsWith('BB') || n.code.startsWith('BC') || n.code.startsWith('BD')
      ).length;
    }
    if (filterId === 'prefix:AL') {
      return NORMS_CATALOG.filter(n => n.code.startsWith('AL')).length;
    }
    if (filterId.startsWith('prefix:')) {
      const p = filterId.replace('prefix:', '');
      return NORMS_CATALOG.filter(n => n.code.startsWith(p)).length;
    }
    return NORMS_CATALOG.filter(n => n.chapter?.includes(filterId)).length;
  };

  const handleSelectAndClose = (norm: NormTemplate) => {
    onSelectNorm(norm);
    onClose();
  };

  const hasActiveFilters = globalQuery || codeFilter || nameFilter || selectedChapter !== 'all';

  const resetAllFilters = () => {
    setGlobalQuery('');
    setCodeFilter('');
    setNameFilter('');
    setSelectedChapter('all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[90vh] flex flex-col text-xs text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/40">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white uppercase">
                  TRA CỨU ĐỊNH MỨC DỰ TOÁN XÂY DỰNG TOÀN DIỆN (BXD)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                  Thông tư 12/2021/TT-BXD & TT 14/2023/TT-BXD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tra cứu tức thì bằng từ khóa theo tên công tác hoặc mã hiệu mà không cần cuộn danh sách
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Keyword Search Bar with Dual Filters */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-col gap-2 shrink-0">
          {/* Main Search Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Lọc theo tên công tác / từ khóa chính */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                autoFocus
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="🔍 Nhập từ khóa tên công tác: bê tông móng, trát tường, cốt thép, đào đất, sơn bả..."
                className="w-full pl-9 pr-7 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium shadow-2xs placeholder:text-slate-400"
              />
              {nameFilter && (
                <button
                  onClick={() => setNameFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Xóa từ khóa tên"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Lọc nhanh theo mã hiệu BXD */}
            <div className="relative w-56 min-w-[180px]">
              <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                type="text"
                value={codeFilter}
                onChange={(e) => setCodeFilter(e.target.value)}
                placeholder="Mã hiệu (AF, AK, AB, 12...)"
                className="w-full pl-8 pr-7 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-bold text-amber-900 shadow-2xs placeholder:font-normal placeholder:text-slate-400"
              />
              {codeFilter && (
                <button
                  onClick={() => setCodeFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Xóa mã hiệu lọc"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status counter & reset button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2.5 py-1.5 rounded-xl bg-blue-100 text-blue-900 font-bold font-mono text-xs border border-blue-200">
                Tìm thấy: <strong>{results.length}</strong> công tác
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Đặt lại toàn bộ từ khóa tìm kiếm"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Keyword Click Chips */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-[11px]">
            <span className="text-slate-400 text-[10px] shrink-0 font-semibold uppercase tracking-wider">Từ khóa nhanh:</span>
            {QUICK_KEYWORD_TAGS.map(t => {
              const isActive = nameFilter.toLowerCase() === t.kw.toLowerCase();
              return (
                <button
                  key={t.label}
                  onClick={() => {
                    setNameFilter(isActive ? '' : t.kw);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-bold ring-1 ring-blue-700'
                      : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapter Quick Filter Chips with Prefix & Counts */}
        <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
          {CHAPTER_FILTERS.map((f) => {
            const isSelected = selectedChapter === f.id;
            const count = getFilterCount(f.id);
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedChapter(f.id);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Split View: List (Left) + Norm Breakdown Preview (Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Candidate List */}
          <div ref={tableContainerRef} className="w-7/12 border-r border-slate-200 overflow-y-auto flex flex-col">
            {/* Keyboard shortcut hint banner */}
            <div className="px-3 py-1 bg-amber-50/70 border-b border-amber-200/60 text-[10px] text-amber-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span>Phím tắt:</span>
                <span className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">↑ / ↓</span>
                <span>Di chuyển chọn dòng</span>
                <span>•</span>
                <span className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">Enter</span>
                <span>Chọn vào dự toán</span>
                <span>•</span>
                <span className="font-mono bg-white px-1 py-0.2 rounded border border-amber-300">Esc</span>
                <span>Đóng cửa sổ</span>
              </div>
              <span className="text-slate-500 font-mono">
                {results.length > 0 ? `Dòng ${selectedIndex + 1}/${results.length}` : '0 kết quả'}
              </span>
            </div>

            <table className="w-full border-collapse table-auto select-text">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs border-b border-slate-200 text-slate-700 shadow-2xs z-10">
                <tr>
                  <th className="f1-header-cell w-28">Mã hiệu</th>
                  <th className="f1-header-cell text-left px-3">Tên công tác định mức BXD</th>
                  <th className="f1-header-cell w-16">ĐVT</th>
                  <th className="f1-header-cell w-20">Chọn</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-600">
                          Không tìm thấy công tác nào phù hợp với từ khóa đã nhập.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Hãy thử xóa bớt điều kiện lọc hoặc bấm nút "Xóa lọc" ở thanh trên.
                        </p>
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-xs"
                        >
                          Hiển thị tất cả công tác
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  results.map((norm, idx) => {
                    const isSelected = selectedPreviewNorm.code === norm.code;
                    return (
                      <tr
                        key={norm.code}
                        onClick={() => {
                          setSelectedPreviewNorm(norm);
                          setSelectedIndex(idx);
                        }}
                        onDoubleClick={() => handleSelectAndClose(norm)}
                        className={`cursor-pointer border-b border-slate-100 transition-colors ${
                          isSelected
                            ? 'bg-blue-50/90 font-medium text-blue-950 ring-1 ring-blue-500/30'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <td className="f1-cell text-center font-mono font-bold">
                          <span className={`px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-blue-100/70 text-blue-800 border-blue-200'
                          }`}>
                            {highlightText(norm.code, [codeFilter, globalQuery])}
                          </span>
                        </td>
                        <td className="f1-cell px-3 py-2">
                          <div className="font-semibold text-slate-900 leading-snug">
                            {highlightText(norm.name, [nameFilter, globalQuery])}
                          </div>
                          {norm.chapter && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {norm.chapter} {norm.categoryGroup ? `• ${norm.categoryGroup}` : ''}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>VL: <strong className="font-mono text-slate-700">{formatVND(norm.defaultPriceMat)}</strong></span>
                            <span>•</span>
                            <span>NC: <strong className="font-mono text-slate-700">{formatVND(norm.defaultPriceLab)}</strong></span>
                            <span>•</span>
                            <span>Máy: <strong className="font-mono text-slate-700">{formatVND(norm.defaultPriceMac)}</strong></span>
                          </div>
                        </td>
                        <td className="f1-cell text-center text-slate-600 font-medium">{norm.unit}</td>
                        <td className="f1-cell text-center px-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAndClose(norm);
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold shadow-2xs transition-colors flex items-center justify-center gap-1 mx-auto"
                            title="Chọn công tác này vào bảng dự toán (hoặc bấm Enter)"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Chọn</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Norm Breakdown Preview */}
          <div className="w-5/12 bg-slate-50/80 p-4 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-extrabold text-blue-700 text-xs">
                    Mã hiệu: {selectedPreviewNorm.code} ({selectedPreviewNorm.unit})
                  </span>
                  {selectedPreviewNorm.categoryGroup && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedPreviewNorm.categoryGroup}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">
                  {selectedPreviewNorm.name}
                </h4>
                {selectedPreviewNorm.chapter && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedPreviewNorm.chapter} • Chuẩn Thông tư 12/2021/TT-BXD
                  </p>
                )}
              </div>

              {/* Composition details */}
              <div className="space-y-3">
                {/* Materials */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-blue-900 text-[11px] block mb-1.5 flex items-center justify-between">
                    <span>1. Hao phí vật liệu (trên 1 {selectedPreviewNorm.unit}):</span>
                    <span className="text-slate-500 font-mono text-[10px] font-normal">
                      Tổng VL: {formatVND(selectedPreviewNorm.defaultPriceMat)} đ
                    </span>
                  </span>
                  {selectedPreviewNorm.materials.length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">Không hao phí vật liệu</span>
                  ) : (
                    <ul className="space-y-1 text-[11px]">
                      {selectedPreviewNorm.materials.map(m => (
                        <li key={m.code} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-200/80">
                          <span className="truncate max-w-[190px]">{m.name}</span>
                          <span className="font-mono text-blue-700 font-semibold">{m.norm} {m.unit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Labor */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-amber-900 text-[11px] block mb-1.5 flex items-center justify-between">
                    <span>2. Hao phí nhân công xây dựng:</span>
                    <span className="text-slate-500 font-mono text-[10px] font-normal">
                      Tổng NC: {formatVND(selectedPreviewNorm.defaultPriceLab)} đ
                    </span>
                  </span>
                  {selectedPreviewNorm.labors.length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">Không hao phí nhân công</span>
                  ) : (
                    <ul className="space-y-1 text-[11px]">
                      {selectedPreviewNorm.labors.map(l => (
                        <li key={l.code} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-200/80">
                          <span>{l.name} ({l.rank})</span>
                          <span className="font-mono text-amber-700 font-semibold">{l.norm} công</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Machine */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-emerald-900 text-[11px] block mb-1.5 flex items-center justify-between">
                    <span>3. Hao phí máy thi công:</span>
                    <span className="text-slate-500 font-mono text-[10px] font-normal">
                      Tổng Máy: {formatVND(selectedPreviewNorm.defaultPriceMac)} đ
                    </span>
                  </span>
                  {selectedPreviewNorm.machines.length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">Không hao phí ca máy</span>
                  ) : (
                    <ul className="space-y-1 text-[11px]">
                      {selectedPreviewNorm.machines.map(mac => (
                        <li key={mac.code} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-200/80">
                          <span className="truncate max-w-[190px]">{mac.name}</span>
                          <span className="font-mono text-emerald-700 font-semibold">{mac.norm} ca</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  onSelectNorm(selectedPreviewNorm);
                  onClose();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>CHỌN CÔNG TÁC NÀY VÀO DỰ TOÁN (ENTER)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
