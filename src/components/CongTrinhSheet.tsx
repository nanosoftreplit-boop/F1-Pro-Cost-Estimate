import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WorkItem, Category, SubCalculation, ProjectType } from '../types/estimate';
import { evaluateMathExpression, formatQuantity, formatVND } from '../utils/calculator';
import { 
  checkTextSpelling, autoCorrectText, applySpellCorrection, 
  SpellCheckIssue, CONSTRUCTION_STANDARD_LEXICON 
} from '../utils/constructionSpellChecker';
import { 
  Plus, Trash2, ChevronDown, ChevronRight, Edit3, Search, 
  Sparkles, CheckCircle2, AlertCircle, Wand2, X, RefreshCw, BookOpen, Check,
  FolderPlus, Folder, Undo2, Redo2, Copy, FileText, StickyNote, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

interface CongTrinhSheetProps {
  items: WorkItem[];
  categories: Category[];
  selectedItemId: string | null;
  selectedSubCalcId: string | null;
  onSelectItem: (item: WorkItem, subCalc?: SubCalculation) => void;
  onUpdateWorkItem: (itemId: string, patch: Partial<WorkItem>) => void;
  onDeleteWorkItem: (itemId: string) => void;
  onDuplicateWorkItem?: (itemId: string) => void;
  onAddSubCalculation: (itemId: string) => void;
  onUpdateSubCalculation: (itemId: string, subId: string, patch: Partial<SubCalculation>) => void;
  onDeleteSubCalculation: (itemId: string, subId: string) => void;
  onOpenNormLookupForWorkItem: (itemId: string) => void;
  onAddCategory?: (categoryName?: string, projectType?: ProjectType) => void;
  onUpdateCategory?: (categoryId: string, patch: Partial<Category>) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onOpenNormLookupForCategory?: (categoryId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoActionName?: string;
  redoActionName?: string;
  onBatchUpdateItems?: (newItems: WorkItem[], description: string) => void;
}

const SUGGESTED_CATEGORY_NAMES = [
  'Phần móng & kết cấu ngầm',
  'Khung bê tông cốt thép thân',
  'Xây thô & tường bao che',
  'Hoàn thiện kiến trúc & sơn bả',
  'Hệ thống cơ điện MEP',
  'Hệ thống PCCC & cứu nạn',
  'Sân đường & hạ tầng ngoài nhà',
  'Phá dỡ & cải tạo công trình cũ'
];

export const QUICK_FILTER_CHIPS = [
  { label: 'Tất cả', query: '' },
  { label: 'Bê tông', query: 'bê tông' },
  { label: 'Đào móng', query: 'đào' },
  { label: 'Cốt thép', query: 'thép' },
  { label: 'Ván khuôn', query: 'ván khuôn' },
  { label: 'Xây tường', query: 'xây' },
  { label: 'Trát tường', query: 'trát' },
  { label: 'Sơn bả', query: 'sơn' },
  { label: 'Mã AF', query: 'AF' },
  { label: 'Mã AB', query: 'AB' },
  { label: 'Mã AK', query: 'AK' },
];

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm không dấu siêu tốc
const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

// Hàm tô đậm từ khóa tìm kiếm
const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const qClean = removeVietnameseTones(query.trim());
  const tClean = removeVietnameseTones(text);
  const index = tClean.indexOf(qClean);
  if (index === -1) return text;

  const matchLen = query.trim().length;
  const before = text.substring(0, index);
  const match = text.substring(index, index + matchLen);
  const after = text.substring(index + matchLen);

  return (
    <>
      {before}
      <mark className="bg-amber-300 text-slate-900 rounded-xs px-0.5 font-bold shadow-2xs">
        {match}
      </mark>
      {after}
    </>
  );
};

export type SortField =
  | 'stt'
  | 'code'
  | 'name'
  | 'unit'
  | 'quantity'
  | 'unitPriceMaterial'
  | 'unitPriceLabor'
  | 'unitPriceMachine'
  | 'tMat'
  | 'tLab'
  | 'tMac'
  | 'total';

export type SortDirection = 'asc' | 'desc';

export const CongTrinhSheet: React.FC<CongTrinhSheetProps> = ({
  items,
  categories,
  selectedItemId,
  selectedSubCalcId,
  onSelectItem,
  onUpdateWorkItem,
  onDeleteWorkItem,
  onDuplicateWorkItem,
  onAddSubCalculation,
  onUpdateSubCalculation,
  onDeleteSubCalculation,
  onOpenNormLookupForWorkItem,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onOpenNormLookupForCategory,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  undoActionName,
  redoActionName,
  onBatchUpdateItems,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState<boolean>(true);
  const [showSpellCheckDrawer, setShowSpellCheckDrawer] = useState<boolean>(false);
  const [activeSuggestionPopover, setActiveSuggestionPopover] = useState<string | null>(null);

  // Quản lý Sắp xếp cột (Column Sorting)
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  // Quản lý Modal Ghi chú (F8)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Quản lý tạo nhanh Hạng mục
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryProjectType, setNewCategoryProjectType] = useState<ProjectType>('civil');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Thanh tìm kiếm và lọc nhanh công tác
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lắng nghe Ctrl+F để tìm kiếm, F8 để mở ghi chú công tác, Esc để hủy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        if (!isAddCategoryModalOpen && !showSpellCheckDrawer && !isNoteModalOpen) {
          e.preventDefault();
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }
      } else if (e.key === 'Escape' && searchQuery && !isNoteModalOpen) {
        setSearchQuery('');
      } else if (e.key === 'F8') {
        e.preventDefault();
        const targetId = selectedItemId || items[0]?.id;
        if (targetId) {
          openNoteModal(targetId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, isAddCategoryModalOpen, showSpellCheckDrawer, isNoteModalOpen, selectedItemId, items]);

  // Mở modal ghi chú cho công tác
  const openNoteModal = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    setActiveNoteItemId(itemId);
    setNoteDraft(item.note || '');
    setIsNoteModalOpen(true);
  };

  // Lưu ghi chú
  const handleSaveNote = () => {
    if (activeNoteItemId) {
      onUpdateWorkItem(activeNoteItemId, { note: noteDraft.trim() || undefined });
      setIsNoteModalOpen(false);
      setActiveNoteItemId(null);
    }
  };

  // Nhân bản công tác (Duplicate)
  const handleDuplicateItem = (itemId: string) => {
    if (onDuplicateWorkItem) {
      onDuplicateWorkItem(itemId);
      return;
    }
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const source = items[index];
    const duplicatedSubs: SubCalculation[] = (source.subCalculations || []).map((s, idx) => ({
      ...s,
      id: `sub-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
    }));
    const duplicatedItem: WorkItem = {
      ...source,
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subCalculations: duplicatedSubs,
      materials: source.materials ? JSON.parse(JSON.stringify(source.materials)) : [],
      labors: source.labors ? JSON.parse(JSON.stringify(source.labors)) : [],
      machines: source.machines ? JSON.parse(JSON.stringify(source.machines)) : [],
    };
    const newItems = [...items.slice(0, index + 1), duplicatedItem, ...items.slice(index + 1)];
    const reindexed = newItems.map((it, idx) => ({ ...it, stt: idx + 1 }));
    if (onBatchUpdateItems) {
      onBatchUpdateItems(reindexed, `Nhân bản công tác ${source.code}`);
    }
    onSelectItem(duplicatedItem);
  };

  // Chuyển đổi trạng thái sắp xếp cột
  const handleToggleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortField(null);
      setSortDirection(null);
    }
  };

  const handleClearSort = () => {
    setSortField(null);
    setSortDirection(null);
  };

  // Hàm sắp xếp danh sách công tác
  const sortItems = (itemList: WorkItem[]): WorkItem[] => {
    if (!sortField || !sortDirection) return itemList;
    return [...itemList].sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;
      switch (sortField) {
        case 'stt':
          valA = a.stt;
          valB = b.stt;
          break;
        case 'code':
          valA = (a.code || '').toLowerCase();
          valB = (b.code || '').toLowerCase();
          break;
        case 'name':
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          break;
        case 'unit':
          valA = (a.unit || '').toLowerCase();
          valB = (b.unit || '').toLowerCase();
          break;
        case 'quantity':
          valA = a.quantity || 0;
          valB = b.quantity || 0;
          break;
        case 'unitPriceMaterial':
          valA = a.unitPriceMaterial || 0;
          valB = b.unitPriceMaterial || 0;
          break;
        case 'unitPriceLabor':
          valA = a.unitPriceLabor || 0;
          valB = b.unitPriceLabor || 0;
          break;
        case 'unitPriceMachine':
          valA = a.unitPriceMachine || 0;
          valB = b.unitPriceMachine || 0;
          break;
        case 'tMat':
          valA = (a.quantity || 0) * (a.unitPriceMaterial || 0);
          valB = (b.quantity || 0) * (b.unitPriceMaterial || 0);
          break;
        case 'tLab':
          valA = (a.quantity || 0) * (a.unitPriceLabor || 0);
          valB = (b.quantity || 0) * (b.unitPriceLabor || 0);
          break;
        case 'tMac':
          valA = (a.quantity || 0) * (a.unitPriceMachine || 0);
          valB = (b.quantity || 0) * (b.unitPriceMachine || 0);
          break;
        case 'total':
          valA = (a.quantity || 0) * ((a.unitPriceMaterial || 0) + (a.unitPriceLabor || 0) + (a.unitPriceMachine || 0));
          valB = (b.quantity || 0) * ((b.unitPriceMaterial || 0) + (b.unitPriceLabor || 0) + (b.unitPriceMachine || 0));
          break;
        default:
          return 0;
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortFieldLabel = (field: SortField): string => {
    switch (field) {
      case 'stt': return 'STT';
      case 'code': return 'Mã hiệu';
      case 'name': return 'Tên công tác';
      case 'unit': return 'Đơn vị';
      case 'quantity': return 'Khối lượng';
      case 'unitPriceMaterial': return 'Đơn giá Vật liệu';
      case 'unitPriceLabor': return 'Đơn giá Nhân công';
      case 'unitPriceMachine': return 'Đơn giá Máy';
      case 'tMat': return 'Thành tiền Vật liệu';
      case 'tLab': return 'Thành tiền Nhân công';
      case 'tMac': return 'Thành tiền Máy';
      case 'total': return 'Tổng cộng';
      default: return '';
    }
  };

  // Helper render sortable table header
  const renderSortableHeader = (
    field: SortField,
    label: string,
    extraClassName?: string,
    rowSpan?: number,
    colSpan?: number
  ) => {
    const isActive = sortField === field;
    return (
      <th
        rowSpan={rowSpan}
        colSpan={colSpan}
        onClick={() => handleToggleSort(field)}
        className={`f1-header-cell cursor-pointer select-none transition-colors hover:bg-slate-200 group ${
          isActive ? 'bg-blue-100 text-blue-900 font-bold' : ''
        } ${extraClassName || ''}`}
        title={`Bấm để sắp xếp theo "${label}" (${
          !isActive ? 'Tăng dần' : sortDirection === 'asc' ? 'Giảm dần' : 'Bỏ sắp xếp'
        })`}
      >
        <div className="flex items-center justify-center gap-1">
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-blue-600 shrink-0" />
            ) : (
              <ArrowDown className="w-3 h-3 text-blue-600 shrink-0" />
            )
          ) : (
            <ArrowUpDown className="w-2.5 h-2.5 text-slate-400 opacity-40 group-hover:opacity-100 shrink-0" />
          )}
        </div>
      </th>
    );
  };

  // Lọc danh sách công tác theo tên công tác hoặc mã hiệu (hỗ trợ tiếng Việt có dấu và không dấu)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const qClean = removeVietnameseTones(searchQuery.trim());
    return items.filter(item => {
      const codeClean = removeVietnameseTones(item.code || '');
      const nameClean = removeVietnameseTones(item.name || '');
      if (codeClean.includes(qClean) || nameClean.includes(qClean)) return true;
      if (item.subCalculations && item.subCalculations.some(s => removeVietnameseTones(s.name || '').includes(qClean))) {
        return true;
      }
      return false;
    });
  }, [items, searchQuery]);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleCreateCategory = (nameToUse?: string) => {
    const finalName = (nameToUse || newCategoryName).trim() || `Hạng mục ${categories.length + 1}: Phân đoạn mới`;
    onAddCategory?.(finalName, newCategoryProjectType);
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  const handleSaveCategoryName = (catId: string) => {
    if (editingCategoryName.trim()) {
      onUpdateCategory?.(catId, { name: editingCategoryName.trim() });
    }
    setEditingCategoryId(null);
  };

  // Quét toàn bộ lỗi chính tả chuyên ngành trong danh sách công tác & diễn giải
  const allSpellIssues = useMemo(() => {
    if (!isSpellCheckEnabled) return [];
    const issues: SpellCheckIssue[] = [];

    for (const item of items) {
      // 1. Quét tên công tác
      const nameIssues = checkTextSpelling(item.name, item.id, 'name');
      issues.push(...nameIssues);

      // 2. Quét tên dòng diễn giải con
      for (const sub of item.subCalculations || []) {
        const subIssues = checkTextSpelling(sub.name, item.id, 'subCalcName', sub.id);
        issues.push(...subIssues);
      }
    }

    return issues;
  }, [items, isSpellCheckEnabled]);

  // Sửa 1 lỗi chính tả cụ thể
  const handleFixSingleIssue = (issue: SpellCheckIssue, suggestion: string) => {
    const item = items.find(i => i.id === issue.itemId);
    if (!item) return;

    if (issue.field === 'name') {
      const fixed = applySpellCorrection(item.name, issue.startIndex, issue.endIndex, suggestion);
      onUpdateWorkItem(item.id, { name: fixed });
    } else if (issue.field === 'subCalcName' && issue.subCalcId) {
      const sub = item.subCalculations?.find(s => s.id === issue.subCalcId);
      if (sub) {
        const fixed = applySpellCorrection(sub.name, issue.startIndex, issue.endIndex, suggestion);
        onUpdateSubCalculation(item.id, sub.id, { name: fixed });
      }
    }
  };

  // Tự động sửa TẤT CẢ các lỗi chính tả toàn bộ bảng công trình
  const handleFixAllIssues = () => {
    const updatedItems = items.map(item => {
      const fixedName = autoCorrectText(item.name);
      let updatedSubs: SubCalculation[] | undefined = undefined;

      if (item.subCalculations && item.subCalculations.length > 0) {
        updatedSubs = item.subCalculations.map(s => ({
          ...s,
          name: autoCorrectText(s.name)
        }));
      }

      return {
        ...item,
        name: fixedName,
        ...(updatedSubs ? { subCalculations: updatedSubs } : {})
      };
    });

    if (onBatchUpdateItems) {
      onBatchUpdateItems(updatedItems, `Sửa tất cả ${allSpellIssues.length} lỗi chính tả TCVN`);
    } else {
      for (const item of updatedItems) {
        onUpdateWorkItem(item.id, item);
      }
    }
  };

  // Tính tổng công trình (tính trên tập dữ liệu đang lọc hoặc toàn bộ nếu không lọc)
  const itemsToTotal = searchQuery.trim() ? filteredItems : items;
  let totalMaterial = 0;
  let totalLabor = 0;
  let totalMachine = 0;

  itemsToTotal.forEach(item => {
    const q = item.quantity || 0;
    totalMaterial += q * (item.unitPriceMaterial || 0);
    totalLabor += q * (item.unitPriceLabor || 0);
    totalMachine += q * (item.unitPriceMachine || 0);
  });
  const grandTotal = totalMaterial + totalLabor + totalMachine;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs relative select-none">
      {/* 1. THANH TÌM KIẾM ĐỘNG CÔNG TÁC TRỰC TIẾP TRÊN CÙNG BẢNG CÔNG TRÌNH */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-300 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Ô nhập liệu tìm kiếm theo tên hoặc mã hiệu công tác */}
          <div className="relative flex-1 min-w-[280px] max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-blue-600 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm công tác theo tên hoặc mã hiệu định mức (bê tông, đào móng, trát tường, AF, AB...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs font-medium transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {searchQuery ? (
                  <>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                      {filteredItems.length}/{items.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                      title="Xóa bộ lọc (Esc)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 select-none">
                    Ctrl + F
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Filter Chips (Gợi ý bộ lọc nhanh chuyên ngành) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[11px]">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0 hidden xl:inline">
              Lọc nhanh:
            </span>
            {QUICK_FILTER_CHIPS.map((chip, idx) => {
              const isActive = (chip.query === '' && !searchQuery) || (chip.query !== '' && searchQuery.toLowerCase() === chip.query.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (isActive && chip.query !== '') {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(chip.query);
                    }
                    searchInputRef.current?.focus();
                  }}
                  className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-700'
                      : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Sub-Header Toolbar: Undo/Redo, Spellcheck & Category Management */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-300 gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Nút Hoàn tác (Undo) & Làm lại (Redo) */}
          <div className="flex items-center bg-white rounded border border-slate-300 shadow-2xs overflow-hidden shrink-0">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                canUndo
                  ? 'text-slate-700 hover:text-blue-700 hover:bg-blue-50 cursor-pointer active:scale-95'
                  : 'text-slate-300 cursor-not-allowed bg-slate-50'
              }`}
              title={canUndo ? `Hoàn tác: ${undoActionName || 'Thao tác trước'} (Ctrl+Z)` : 'Không có thao tác nào để hoàn tác (Ctrl+Z)'}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hoàn tác</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-200" />
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                canRedo
                  ? 'text-slate-700 hover:text-blue-700 hover:bg-blue-50 cursor-pointer active:scale-95'
                  : 'text-slate-300 cursor-not-allowed bg-slate-50'
              }`}
              title={canRedo ? `Làm lại: ${redoActionName || 'Thao tác sau'} (Ctrl+Y)` : 'Không có thao tác nào để làm lại (Ctrl+Y)'}
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Làm lại</span>
            </button>
          </div>

          {/* Spellcheck Toggle */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs shrink-0">
            <Sparkles className={`w-3.5 h-3.5 ${isSpellCheckEnabled ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-[11px] font-semibold text-slate-700 hidden md:inline">Chính tả TCVN:</span>
            <button
              onClick={() => setIsSpellCheckEnabled(!isSpellCheckEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                isSpellCheckEnabled
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isSpellCheckEnabled ? 'BẬT' : 'TẮT'}
            </button>
          </div>

          {/* Spellcheck Status & Action */}
          {isSpellCheckEnabled && (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {allSpellIssues.length > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    {allSpellIssues.length} từ chưa chuẩn
                  </span>
                  <button
                    onClick={() => setShowSpellCheckDrawer(true)}
                    className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={handleFixAllIssues}
                    className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" />
                    Sửa tất cả
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Chuẩn TCVN
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Tạo nhanh hạng mục / nhóm công tác mới để quản lý phân đoạn dự án"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-200" />
            <span>+ Thêm Hạng mục</span>
          </button>
          <div className="text-[11px] text-slate-500 hidden xl:inline">
            Tra định mức: <strong>F2</strong> | Tìm: <strong>Ctrl+F</strong>
          </div>
        </div>
      </div>

      {/* 3. Banner thông báo trạng thái lọc & sắp xếp khi có tìm kiếm hoặc sắp xếp cột */}
      {(searchQuery.trim() || sortField) && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-blue-50 border-b border-blue-200 text-xs text-blue-900 animate-in fade-in duration-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery.trim() && (
              <>
                <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Đang lọc công tác theo từ khóa: <strong className="text-blue-950 font-bold bg-amber-200 px-1.5 py-0.5 rounded font-mono">"{searchQuery}"</strong>
                </span>
                <span className="text-blue-700">
                  • Tìm thấy <strong>{filteredItems.length}</strong> / {items.length} công tác
                </span>
                <span className="text-blue-700">
                  • Tổng giá trị bộ lọc: <strong className="font-mono">{formatVND(grandTotal)}</strong> đ
                </span>
              </>
            )}

            {sortField && (
              <div className="flex items-center gap-1.5 bg-white border border-blue-300 text-blue-950 px-2 py-0.5 rounded-full shadow-2xs font-medium">
                {sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-600" /> : <ArrowDown className="w-3 h-3 text-blue-600" />}
                <span>
                  Sắp xếp: <strong>{getSortFieldLabel(sortField)}</strong> ({sortDirection === 'asc' ? 'Tăng dần ↑' : 'Giảm dần ↓'})
                </span>
                <button
                  type="button"
                  onClick={handleClearSort}
                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100 cursor-pointer"
                  title="Hủy sắp xếp, quay lại thứ tự gốc"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {sortField && (
              <button
                type="button"
                onClick={handleClearSort}
                className="text-[11px] text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
              >
                Bỏ sắp xếp
              </button>
            )}
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-950 hover:underline font-semibold cursor-pointer shrink-0 ml-2"
              >
                <X className="w-3 h-3" />
                <span>Xóa lọc (Esc)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Work Items Spreadsheet Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse border border-slate-300 table-auto select-text">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="border-b border-slate-300">
              {renderSortableHeader('stt', 'STT', 'w-10', 2)}
              {renderSortableHeader('code', 'Mã hiệu', 'w-24', 2)}
              {renderSortableHeader('name', 'Tên công tác & quy cách', 'min-w-[260px] text-left px-3', 2)}
              {renderSortableHeader('unit', 'Đơn vị', 'w-16', 2)}
              {renderSortableHeader('quantity', 'Khối lượng', 'w-24', 2)}
              <th colSpan={3} className="f1-header-cell">Đơn giá gốc (VNĐ)</th>
              <th colSpan={4} className="f1-header-cell">Thành tiền (VNĐ)</th>
              <th rowSpan={2} className="f1-header-cell w-36 text-center">Ghi chú (F8)</th>
              <th rowSpan={2} className="f1-header-cell w-24 text-center">Thao tác</th>
            </tr>
            <tr className="border-b border-slate-300 bg-slate-50">
              {renderSortableHeader('unitPriceMaterial', 'Vật liệu', 'w-24')}
              {renderSortableHeader('unitPriceLabor', 'Nhân công', 'w-24')}
              {renderSortableHeader('unitPriceMachine', 'Máy', 'w-24')}
              {renderSortableHeader('tMat', 'Vật liệu', 'w-28')}
              {renderSortableHeader('tLab', 'Nhân công', 'w-28')}
              {renderSortableHeader('tMac', 'Máy', 'w-28')}
              {renderSortableHeader('total', 'Tổng cộng', 'w-32 bg-slate-200 font-bold')}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 && searchQuery.trim() ? (
              <tr>
                <td colSpan={14} className="py-12 text-center text-slate-500 bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Không tìm thấy công tác nào khớp với từ khóa "{searchQuery}"
                    </p>
                    <p className="text-slate-500 text-[11px] max-w-sm">
                      Hãy thử tìm với mã hiệu định mức (ví dụ: AA, AB, AF, AK...) hoặc từ khóa tiếng Việt không dấu/có dấu ("bê tông", "đào móng", "sơn", "vữa"...).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="mt-1 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-xs font-semibold text-blue-600 shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Xóa bộ lọc tìm kiếm</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat, catIdx) => {
                const rawCatItems = filteredItems.filter(item => (item.categoryId || categories[0]?.id) === cat.id);
                const catItems = sortItems(rawCatItems);
                // Nếu đang tìm kiếm mà hạng mục không có công tác phù hợp thì ẩn hạng mục
                if (searchQuery.trim() && catItems.length === 0) {
                  return null;
                }
                const isCollapsed = collapsedCategories[cat.id];

                let catMat = 0;
                let catLab = 0;
                let catMac = 0;
                catItems.forEach(i => {
                  const q = i.quantity || 0;
                catMat += q * i.unitPriceMaterial;
                catLab += q * i.unitPriceLabor;
                catMac += q * i.unitPriceMachine;
              });
              const catTotal = catMat + catLab + catMac;

              return (
                <React.Fragment key={cat.id}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-200/95 font-bold text-slate-800 border-y border-slate-300 group hover:bg-slate-300/60 transition-colors">
                    <td className="f1-cell text-center font-mono">{catIdx + 1}</td>
                    <td className="f1-cell text-center text-slate-600 font-mono text-[11px]">HM.{catIdx + 1}</td>
                    <td colSpan={6} className="f1-cell px-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleCategory(cat.id)}
                            className="p-1 hover:bg-slate-300/80 rounded transition-colors text-slate-600 shrink-0 cursor-pointer"
                            title={isCollapsed ? 'Mở rộng hạng mục' : 'Thu gọn hạng mục'}
                          >
                            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                          
                          <Folder className="w-4 h-4 text-amber-600 shrink-0" />

                          {editingCategoryId === cat.id ? (
                            <div className="flex items-center gap-1.5 flex-1 max-w-md" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                autoFocus
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveCategoryName(cat.id);
                                  if (e.key === 'Escape') setEditingCategoryId(null);
                                }}
                                className="px-2 py-0.5 text-xs bg-white border-2 border-blue-600 rounded font-bold text-slate-900 w-full shadow-inner focus:outline-hidden"
                              />
                              <button
                                onClick={() => handleSaveCategoryName(cat.id)}
                                className="p-1 bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer shrink-0"
                                title="Lưu tên hạng mục"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingCategoryId(null)}
                                className="p-1 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded cursor-pointer shrink-0"
                                title="Hủy"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                onDoubleClick={() => startEditCategory(cat)}
                                className="font-bold text-slate-900 hover:text-blue-700 truncate cursor-pointer text-xs"
                                title="Kích đúp chuột để đổi tên hạng mục"
                              >
                                {cat.name.toUpperCase()}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-300/90 text-slate-700 font-mono font-medium shrink-0">
                                {catItems.length} công tác
                              </span>
                              <button
                                onClick={() => startEditCategory(cat)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-blue-700 hover:bg-white rounded transition-all cursor-pointer"
                                title="Đổi tên hạng mục này"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick action buttons on category header */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenNormLookupForCategory?.(cat.id)}
                            className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Thêm công tác định mức vào hạng mục này"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Thêm công tác</span>
                          </button>
                          {categories.length > 1 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc chắn muốn xóa "${cat.name}"? Toàn bộ công tác trong hạng mục này sẽ được tự động chuyển sang hạng mục khác.`)) {
                                  onDeleteCategory?.(cat.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                              title="Xóa hạng mục này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="f1-cell text-right tabular-nums">{formatVND(catMat)}</td>
                    <td className="f1-cell text-right tabular-nums">{formatVND(catLab)}</td>
                    <td className="f1-cell text-right tabular-nums">{formatVND(catMac)}</td>
                    <td className="f1-cell text-right tabular-nums font-bold text-slate-900 bg-slate-300/50">
                      {formatVND(catTotal)}
                    </td>
                    <td className="f1-cell text-center"></td>
                    <td className="f1-cell text-center"></td>
                  </tr>

                  {/* Empty Category Guidance Row */}
                  {!isCollapsed && catItems.length === 0 && (
                    <tr>
                      <td colSpan={14} className="py-6 text-center text-slate-400 bg-slate-50/70 border-b border-slate-200">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Folder className="w-7 h-7 text-slate-300" />
                          <span className="text-xs font-semibold text-slate-600">Hạng mục này hiện chưa có công tác nào</span>
                          <button
                            onClick={() => onOpenNormLookupForCategory?.(cat.id)}
                            className="mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm công tác vào {cat.name}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Work Items in this Category */}
                  {!isCollapsed &&
                    catItems.map((item) => {
                      const isSelected = selectedItemId === item.id && !selectedSubCalcId;
                      const q = item.quantity || 0;
                      const tMat = q * item.unitPriceMaterial;
                      const tLab = q * item.unitPriceLabor;
                      const tMac = q * item.unitPriceMachine;
                      const tTotal = tMat + tLab + tMac;

                      // Lấy các lỗi chính tả của riêng công tác này
                      const itemIssues = isSpellCheckEnabled
                        ? allSpellIssues.filter(i => i.itemId === item.id && i.field === 'name')
                        : [];

                      return (
                        <React.Fragment key={item.id}>
                          <tr
                            onClick={() => onSelectItem(item)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/80 ring-1 ring-blue-400' : 'hover:bg-slate-50/90'
                            }`}
                          >
                            <td className="f1-cell text-center text-slate-500 font-mono">{item.stt}</td>
                            <td className="f1-cell text-center font-mono font-medium text-blue-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenNormLookupForWorkItem(item.id);
                                }}
                                className="hover:underline flex items-center justify-center gap-1 mx-auto"
                                title="Nhấn để tra cứu và thay đổi định mức"
                              >
                                <span>{highlightMatch(item.code, searchQuery)}</span>
                                <Search className="w-2.5 h-2.5 text-slate-400" />
                              </button>
                            </td>

                            {/* Tên công tác với gợi ý sửa chính tả và tìm kiếm */}
                            <td className="f1-cell px-3 relative">
                              <div className="flex flex-col">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => onUpdateWorkItem(item.id, { name: e.target.value })}
                                  className={`w-full bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded text-slate-900 font-medium ${
                                    itemIssues.length > 0 ? 'border-b-2 border-dashed border-amber-500' : ''
                                  }`}
                                />
                                {searchQuery.trim() && removeVietnameseTones(item.name).includes(removeVietnameseTones(searchQuery.trim())) && (
                                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate pointer-events-none select-none">
                                    Khớp từ khóa: {highlightMatch(item.name, searchQuery)}
                                  </div>
                                )}
                                {/* Quick Fix Chips if typo detected */}
                                {itemIssues.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                    {itemIssues.map((issue, issueIdx) => (
                                      <button
                                        key={`${issue.id}-${issueIdx}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleFixSingleIssue(issue, issue.suggestions[0]);
                                        }}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-semibold border border-amber-300 transition-colors"
                                        title={`Nhấn để sửa thành "${issue.suggestions[0]}"`}
                                      >
                                        <Wand2 className="w-2.5 h-2.5 text-amber-600" />
                                        <span>Gợi ý: <strong>{issue.suggestions[0]}</strong></span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="f1-cell text-center text-slate-600">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) => onUpdateWorkItem(item.id, { unit: e.target.value })}
                                className="w-full text-center bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded text-slate-700 font-mono text-[11px]"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums font-semibold text-slate-900 bg-amber-50/30">
                              <input
                                type="number"
                                step="any"
                                value={item.quantity}
                                onChange={(e) => onUpdateWorkItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                                className="w-full text-right bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-700">
                              <input
                                type="number"
                                value={item.unitPriceMaterial}
                                onChange={(e) => onUpdateWorkItem(item.id, { unitPriceMaterial: parseFloat(e.target.value) || 0 })}
                                className="w-full text-right bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-700">
                              <input
                                type="number"
                                value={item.unitPriceLabor}
                                onChange={(e) => onUpdateWorkItem(item.id, { unitPriceLabor: parseFloat(e.target.value) || 0 })}
                                className="w-full text-right bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-700">
                              <input
                                type="number"
                                value={item.unitPriceMachine}
                                onChange={(e) => onUpdateWorkItem(item.id, { unitPriceMachine: parseFloat(e.target.value) || 0 })}
                                className="w-full text-right bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-mono"
                              />
                            </td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(tMat)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(tLab)}</td>
                            <td className="f1-cell text-right tabular-nums text-slate-800">{formatVND(tMac)}</td>
                            <td className="f1-cell text-right tabular-nums font-bold text-slate-900 bg-slate-100">
                              {formatVND(tTotal)}
                            </td>

                            {/* Cột Ghi chú (F8) */}
                            <td className="f1-cell text-center px-1">
                              {item.note ? (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openNoteModal(item.id);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-500 cursor-pointer max-w-[135px] truncate shadow-2xs group-hover:border-amber-400"
                                  title={`Ghi chú: "${item.note}" (Bấm hoặc nhấn F8 để sửa)`}
                                >
                                  <FileText className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span className="truncate">{item.note}</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openNoteModal(item.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded transition-all text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                  title="Thêm ghi chú kỹ thuật / thẩm tra cho công tác này (Phím tắt F8)"
                                >
                                  <StickyNote className="w-2.5 h-2.5" />
                                  <span>+ Ghi chú</span>
                                </button>
                              )}
                            </td>

                            {/* Cột Thao tác */}
                            <td className="f1-cell text-center">
                              <div className="flex items-center justify-center gap-0.5">
                                {categories.length > 1 && (
                                  <select
                                    value={item.categoryId || categories[0]?.id}
                                    onChange={(e) => onUpdateWorkItem(item.id, { categoryId: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Chuyển sang hạng mục khác"
                                    className="text-[10px] bg-slate-100 hover:bg-white border border-slate-300 rounded px-1 py-0.5 max-w-[65px] truncate text-slate-700 hover:border-blue-400 cursor-pointer"
                                  >
                                    {categories.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateItem(item.id);
                                  }}
                                  title="Nhân bản công tác này (Duplicate) - Giữ nguyên khối lượng và diễn giải"
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddSubCalculation(item.id);
                                  }}
                                  title="Chèn dòng diễn giải kích thước dài x rộng x cao"
                                  className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteWorkItem(item.id);
                                  }}
                                  title="Xóa công tác"
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Sub-calculations / Diễn giải con */}
                          {item.subCalculations && item.subCalculations.map((sub, sIdx) => {
                            const isSubSelected = selectedSubCalcId === sub.id;
                            const subIssues = isSpellCheckEnabled
                              ? allSpellIssues.filter(i => i.subCalcId === sub.id)
                              : [];

                            return (
                              <tr
                                key={sub.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectItem(item, sub);
                                }}
                                className={`text-[11px] cursor-pointer ${
                                  isSubSelected ? 'bg-amber-100/70 ring-1 ring-amber-400' : 'bg-slate-50/50 hover:bg-amber-50/40'
                                }`}
                              >
                                <td className="f1-cell text-center text-slate-300 font-mono">{`${item.stt}.${sIdx + 1}`}</td>
                                <td className="f1-cell text-center text-slate-400 font-mono text-[10px]">DG</td>
                                <td className="f1-cell pl-8 pr-3 text-slate-700">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-400 select-none">-</span>
                                      <input
                                        type="text"
                                        value={sub.name}
                                        onChange={(e) => onUpdateSubCalculation(item.id, sub.id, { name: e.target.value })}
                                        className={`flex-1 bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded text-slate-700 italic ${
                                          subIssues.length > 0 ? 'border-b border-dashed border-amber-500' : ''
                                        }`}
                                      />
                                      <span className="text-slate-400">:</span>
                                      <input
                                        type="text"
                                        value={sub.expression}
                                        onChange={(e) => {
                                          const expr = e.target.value;
                                          const qty = evaluateMathExpression(expr);
                                          onUpdateSubCalculation(item.id, sub.id, { expression: expr, quantity: qty });
                                        }}
                                        className="w-48 font-mono bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded text-blue-800"
                                      />
                                    </div>
                                    {subIssues.length > 0 && (
                                      <div className="flex items-center gap-1 mt-0.5 pl-4">
                                        {subIssues.map((issue, issueIdx) => (
                                          <button
                                            key={`${issue.id}-${issueIdx}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleFixSingleIssue(issue, issue.suggestions[0]);
                                            }}
                                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-semibold border border-amber-300 transition-colors"
                                          >
                                            <Wand2 className="w-2.5 h-2.5 text-amber-600" />
                                            <span>Sửa: <strong>{issue.suggestions[0]}</strong></span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="f1-cell text-center text-slate-400">{item.unit}</td>
                                <td className="f1-cell text-right tabular-nums text-slate-700 font-mono font-medium">
                                  {formatQuantity(sub.quantity)}
                                </td>
                                <td colSpan={8} className="f1-cell text-slate-300 bg-slate-50/20"></td>
                                <td className="f1-cell text-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteSubCalculation(item.id, sub.id);
                                    }}
                                    title="Xóa dòng diễn giải"
                                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            }))}

            {/* Dòng tạo nhanh Hạng mục cuối bảng */}
            <tr>
              <td colSpan={14} className="p-3 bg-slate-50/80 hover:bg-blue-50/40 border-t border-dashed border-slate-300 text-center transition-colors">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-300 rounded-md shadow-2xs transition-all cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-blue-500 hover:text-white" />
                  <span>+ Tạo nhanh Hạng mục / Phân đoạn mới cho công trình</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot className="sticky bottom-0 z-10 bg-slate-900 text-white font-bold text-xs shadow-md">
            <tr className="border-t-2 border-slate-700">
              <td colSpan={4} className="f1-cell text-center py-2 text-slate-300">
                {searchQuery.trim()
                  ? `TỔNG CỘNG BỘ LỌC TÌM KIẾM (${filteredItems.length}/${items.length} CÔNG TÁC)`
                  : 'TỔNG CỘNG TOÀN BỘ CÔNG TRÌNH (TRƯỚC THUẾ)'}
              </td>
              <td className="f1-cell text-center text-slate-400 font-mono">
                {searchQuery.trim() ? `${filteredItems.length}/${items.length} CT` : `${items.length} công tác`}
              </td>
              <td colSpan={3} className="f1-cell text-slate-500"></td>
              <td className="f1-cell text-right tabular-nums text-slate-200">{formatVND(totalMaterial)}</td>
              <td className="f1-cell text-right tabular-nums text-slate-200">{formatVND(totalLabor)}</td>
              <td className="f1-cell text-right tabular-nums text-slate-200">{formatVND(totalMachine)}</td>
              <td className="f1-cell text-right tabular-nums text-emerald-400 font-bold bg-slate-800 text-sm">
                {formatVND(grandTotal)}
              </td>
              <td className="f1-cell text-center"></td>
              <td className="f1-cell text-center"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 3. Sheet Bottom Summary Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 border-t border-slate-300 text-[11px] text-slate-600">
        <div className="flex items-center gap-3">
          <span>Nhấn <strong>Tra định mức (F2)</strong> để chọn từ thư viện TT 12</span>
          <span>·</span>
          <span>Ghi chú công tác: <strong>F8</strong></span>
          <span>·</span>
          <span>Tìm nhanh: <strong>Ctrl + F</strong></span>
          <span>·</span>
          <span>Từ điển chuẩn hóa xây dựng: <strong>{CONSTRUCTION_STANDARD_LEXICON.size} thuật ngữ TCVN</strong></span>
        </div>
        <div className="font-mono text-slate-700">
          {searchQuery.trim() ? (
            <span>Tổng chi phí lọc: <strong className="text-blue-700">{formatVND(grandTotal)} VNĐ</strong> (trên {filteredItems.length} công tác)</span>
          ) : (
            <span>Tổng chi phí xây dựng trực tiếp: <strong className="text-slate-900">{formatVND(grandTotal)} VNĐ</strong></span>
          )}
        </div>
      </div>

      {/* 4. Modal Tạo nhanh Hạng mục / Phân đoạn */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Tạo Hạng Mục / Phân Đoạn Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chọn mẫu hạng mục thông dụng:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_CATEGORY_NAMES.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewCategoryName(sug)}
                      className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                        newCategoryName === sug
                          ? 'bg-blue-100 text-blue-800 border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên hạng mục / Phân đoạn: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hạng mục 01: Phần móng & tầng hầm..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                  autoFocus
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Loại công trình theo Thông tư 11/2021/TT-BXD:
                </label>
                <select
                  value={newCategoryProjectType}
                  onChange={(e) => setNewCategoryProjectType(e.target.value as ProjectType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs bg-white"
                >
                  <option value="civil">Công trình Dân dụng (Chi phí chung: 7.3%, Thu nhập chịu thuế: 5.5%)</option>
                  <option value="industrial">Công trình Công nghiệp (Chi phí chung: 6.2%, Thu nhập chịu thuế: 5.5%)</option>
                  <option value="infrastructure">Công trình Hạ tầng kỹ thuật (Chi phí chung: 5.5%, Thu nhập chịu thuế: 5.5%)</option>
                  <option value="traffic">Công trình Giao thông (Chi phí chung: 5.8%, Thu nhập chịu thuế: 5.5%)</option>
                  <option value="agriculture">Nông nghiệp & Phát triển nông thôn (Chi phí chung: 6.0%, Thu nhập chịu thuế: 5.5%)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Định mức chi phí chung và thu nhập chịu thuế tính trước sẽ tự động áp dụng theo loại công trình này khi tổng hợp kinh phí (THKP).
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-slate-600 hover:bg-slate-200 border border-slate-300"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleCreateCategory()}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Tạo Hạng Mục</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Spellcheck Drawer / Modal */}
      {showSpellCheckDrawer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-300 z-50 flex flex-col animate-in slide-in-from-right duration-200 text-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">Từ Điển & Gợi Ý Sửa Chính Tả</span>
            </div>
            <button
              onClick={() => setShowSpellCheckDrawer(false)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 leading-snug flex items-center justify-between">
            <div>
              Phát hiện <strong>{allSpellIssues.length} vị trí</strong> cần chuẩn hóa chính tả chuyên ngành xây dựng.
            </div>
            {allSpellIssues.length > 0 && (
              <button
                onClick={handleFixAllIssues}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] shrink-0 ml-2"
              >
                Sửa tất cả
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {allSpellIssues.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-semibold text-slate-600">Không có lỗi chính tả nào!</p>
                <p className="text-[11px]">Tất cả tên công tác và diễn giải đều chuẩn theo từ điển TCVN.</p>
              </div>
            ) : (
              allSpellIssues.map((issue, idx) => (
                <div key={`${issue.id}-${idx}`} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500">#{idx + 1} ({issue.field === 'name' ? 'Tên công tác' : 'Diễn giải'})</span>
                    <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      "{issue.misspelledWord}"
                    </span>
                  </div>

                  <div className="text-slate-600 text-[11px] italic bg-white p-2 rounded border border-slate-200">
                    "...{issue.originalText.substring(Math.max(0, issue.startIndex - 15), Math.min(issue.originalText.length, issue.endIndex + 15))}..."
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">Gợi ý chuẩn TCVN:</span>
                    <div className="flex items-center gap-1">
                      {issue.suggestions.map((sug, sIdx) => (
                        <button
                          key={`${issue.id}-sug-${sIdx}-${sug}`}
                          onClick={() => handleFixSingleIssue(issue, sug)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. Modal Ghi chú Công tác (Phím tắt F8) */}
      {isNoteModalOpen && activeNoteItemId && (() => {
        const activeNoteItem = items.find(i => i.id === activeNoteItemId);
        if (!activeNoteItem) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150 select-none">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                    <StickyNote className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <span>Ghi chú công tác • Mã {activeNoteItem.code}</span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black font-mono">
                        F8
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-1 max-w-sm font-normal">
                      {activeNoteItem.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3.5 text-xs">
                {/* Preset chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Gợi ý mẫu ghi chú nhanh (Bấm để chèn):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Cần thẩm tra lại khối lượng thiết kế',
                      'Chờ bảng chào giá nhà cung cấp',
                      'Đã kiểm tra khối lượng thiết kế',
                      'Tạm tính theo giá thông báo liên sở',
                      'Theo hồ sơ bản vẽ thi công BVTC-03',
                      'Hao hụt thi công phát sinh theo thực tế',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNoteDraft(prev => prev.trim() ? `${prev.trim()}; ${preset}` : preset);
                        }}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 hover:border-amber-400 rounded text-[11px] font-medium transition-colors cursor-pointer text-left"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nội dung ghi chú kỹ thuật / thẩm tra:
                  </label>
                  <textarea
                    autoFocus
                    rows={4}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSaveNote();
                      } else if (e.key === 'Escape') {
                        setIsNoteModalOpen(false);
                      }
                    }}
                    placeholder="Nhập ghi chú kỹ thuật, lưu ý thẩm tra, nguồn gốc khối lượng hoặc giá vật tư..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-sans"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>Nhấn <strong>Ctrl+Enter</strong> để lưu nhanh • <strong>Esc</strong> để hủy</span>
                    <span className="font-mono">{noteDraft.length} ký tự</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200">
                <div>
                  {activeNoteItem.note && (
                    <button
                      type="button"
                      onClick={() => {
                        setNoteDraft('');
                        onUpdateWorkItem(activeNoteItem.id, { note: undefined });
                        setIsNoteModalOpen(false);
                        setActiveNoteItemId(null);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-semibold cursor-pointer"
                    >
                      Xóa ghi chú này
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Hủy bỏ (Esc)
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lưu ghi chú (F8)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
