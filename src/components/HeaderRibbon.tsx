import React from 'react';
import {
  FileSpreadsheet,
  Layers,
  BarChart3,
  Search,
  Plus,
  Download,
  Upload,
  Settings,
  Code,
  CheckCircle2,
  Calendar,
  Send,
  FileCheck2,
  RefreshCw,
  Coins,
  MapPin,
  TrendingUp,
  Printer,
  HelpCircle,
  Sparkles,
  Save,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Calculator,
  Undo2,
  Redo2,
  FileDown
} from 'lucide-react';
import { ProjectSettings } from '../types/estimate';
import { PROVINCES_DATA } from '../data/provincesData';
import { UserRole } from '../types/license';

export type ActiveTab =
  | 'cong-trinh'
  | 'ptvt'
  | 'thvt'
  | 'dgct'
  | 'du-thau'
  | 'thkp'
  | 'tham-tra'
  | 'phan-tich-rui-ro'
  | 'quyet-toan'
  | 'tien-do'
  | 'dau-thau'
  | 'python-api';

interface HeaderRibbonProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: ProjectSettings;
  onChangeProvince: (provinceName: string) => void;
  onOpenSettings: () => void;
  onOpenNormLookup: () => void;
  onOpenMonthlyPrice: () => void;
  onAddWorkItem: () => void;
  onAddSubCalculation: () => void;
  onExportExcel: () => void;
  onDirectExportPdf?: () => void;
  isExportingPdf?: boolean;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPythonModal: () => void;
  onResetSample: () => void;
  onOpenAdminPrint?: () => void;
  onOpenHelp?: () => void;
  onOpenUpdate?: () => void;
  onSaveProject?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleMobileView?: () => void;
  isMobileView?: boolean;
  onOpenQuickTHKP?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoActionName?: string;
  redoActionName?: string;
  userRole?: UserRole;
  pendingApprovalCount?: number;
  onOpenAdminApproval?: () => void;
  onOpenServicePackages?: () => void;
  isUserApproved?: boolean;
  onOpenMultiProjects?: () => void;
  openProjectsCount?: number;
  onDownloadSampleExcel?: () => void;
  onOpenImportModal?: () => void;
}

export const HeaderRibbon: React.FC<HeaderRibbonProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onChangeProvince,
  onOpenSettings,
  onOpenNormLookup,
  onOpenMonthlyPrice,
  onAddWorkItem,
  onAddSubCalculation,
  onExportExcel,
  onDirectExportPdf,
  isExportingPdf = false,
  onImportExcel,
  onOpenPythonModal,
  onResetSample,
  onOpenAdminPrint,
  onOpenHelp,
  onOpenUpdate,
  onSaveProject,
  onRefresh,
  isRefreshing = false,
  onToggleMobileView,
  isMobileView = false,
  onOpenQuickTHKP,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  undoActionName,
  redoActionName,
  userRole = 'admin',
  pendingApprovalCount = 0,
  onOpenAdminApproval,
  onOpenServicePackages,
  isUserApproved = true,
  onOpenMultiProjects,
  openProjectsCount = 1,
  onDownloadSampleExcel,
  onOpenImportModal,
}) => {
  const currentProvince = PROVINCES_DATA.find(p => p.name === settings.locationProvince) || PROVINCES_DATA[0];

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'cong-trinh', label: '1. Bảng Công trình', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'ptvt', label: '2. Phân tích vật tư', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'thvt', label: '3. Giá tháng & THVT', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'dgct', label: '4. Đơn giá chi tiết', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'du-thau', label: '5. Bảng Dự thầu', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'thkp', label: '6. Tổng hợp THKP', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'tham-tra', label: '7. Thẩm tra & So sánh', icon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'phan-tich-rui-ro', label: '8. Phân tích rủi ro D3', icon: <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'quyet-toan', label: '9. Thanh Quyết toán (03a/03b)', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'tien-do', label: '10. Tiến độ thi công', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'dau-thau', label: '11. Đấu thầu E-GP', icon: <Send className="w-3.5 h-3.5" /> },
    { id: 'python-api', label: '12. Xuất Python & API', icon: <Code className="w-3.5 h-3.5 text-blue-500" /> },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm select-none">
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 bg-red-600 rounded text-white font-black text-xs tracking-wider shadow-sm">
              F1
            </span>
            <span className="font-bold text-sm tracking-tight text-white whitespace-nowrap">
              DỰ TOÁN F1 PRO
            </span>
          </div>
          <span className="text-slate-600">|</span>

          {/* Quick 63 Province Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded px-2 py-1">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Bộ Đơn giá (63 Tỉnh/Thành):</span>
            <select
              value={settings.locationProvince}
              onChange={(e) => onChangeProvince(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs focus:outline-hidden cursor-pointer"
            >
              {PROVINCES_DATA.map(p => (
                <option key={p.id} value={p.name} className="bg-slate-900 text-slate-100">
                  {p.name} (Vùng {p.region})
                </option>
              ))}
            </select>
          </div>

          <span className="hidden lg:inline text-slate-600">·</span>
          {onOpenMultiProjects ? (
            <button
              onClick={onOpenMultiProjects}
              className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group"
              title={`Đang mở ${openProjectsCount} dự án đồng thời • Bấm để mở Quản lý Đa Dự Án`}
            >
              <span className="truncate max-w-[200px] text-slate-200 group-hover:text-amber-300 font-medium">
                {settings.projectName}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 font-mono rounded font-bold transition-colors">
                {openProjectsCount} DA
              </span>
            </button>
          ) : (
            <span className="hidden lg:inline text-xs text-slate-400 truncate max-w-[200px]" title={settings.projectName}>
              {settings.projectName}
            </span>
          )}
          <span className="hidden xl:inline text-emerald-400 font-mono text-[11px]">{settings.standardCircular.split('&')[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
            title="Cấu hình công trình, thông tư áp dụng, loại công trình, thuế VAT"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cấu hình dự án</span>
          </button>

          {onSaveProject && (
            <button
              onClick={onSaveProject}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-blue-200 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/60 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer font-semibold"
              title="Lưu toàn bộ dự án vào bộ nhớ cục bộ (Phím tắt F4)"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>Lưu (F4)</span>
            </button>
          )}

          <button
            onClick={onOpenPythonModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/50 rounded transition-colors whitespace-nowrap"
            title="Tải mã nguồn Python và kết nối REST API"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>Xuất mã Python & API</span>
          </button>

          <button
            onClick={onResetSample}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 rounded transition-colors"
            title="Tải lại dữ liệu công trình mẫu"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Mẫu chuẩn</span>
          </button>

          {/* Admin Master Badge / Service Package Button */}
          {userRole === 'admin' ? (
            <button
              onClick={onOpenAdminApproval}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-200 hover:text-white bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/70 rounded transition-all whitespace-nowrap shadow-xs cursor-pointer group"
              title="Cổng phê duyệt bản quyền Admin HOÀNG HẢI AN • Miễn phí 100% tất cả các gói dịch vụ"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Admin: Hoàng Hải An</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black">
                Miễn phí VIP
              </span>
              {pendingApprovalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                  {pendingApprovalCount} chờ duyệt
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenServicePackages}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-sky-200 hover:text-white bg-blue-950/80 hover:bg-blue-900 border border-blue-600/70 rounded transition-all whitespace-nowrap shadow-xs cursor-pointer"
              title="Đăng ký gói dịch vụ & Thông tin chuyển khoản MB Bank Admin HOÀNG HẢI AN"
            >
              <CreditCard className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold">Gói Dịch Vụ</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-900 text-blue-200 font-mono">
                MB Bank
              </span>
            </button>
          )}

          {onOpenUpdate && (
            <button
              onClick={onOpenUpdate}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/70 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Trung tâm cập nhật định mức & phần mềm Dự toán F1 Pro"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold">Update</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-900 text-emerald-200 font-mono font-bold hidden sm:inline">
                v2026.4
              </span>
            </button>
          )}

          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-300 hover:text-white bg-amber-950/70 hover:bg-amber-900 border border-amber-600/70 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer group"
              title="Hướng dẫn sử dụng phần mềm & danh mục phím tắt (Phím tắt F1)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Help / Hướng dẫn (F1)</span>
            </button>
          )}
        </div>
      </div>

      {/* Ribbon Action Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 text-xs overflow-x-auto gap-2 border-b border-slate-700/60">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenNormLookup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-sm transition-colors whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tra định mức (F2)</span>
          </button>

          <button
            onClick={onAddWorkItem}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Thêm công tác</span>
          </button>

          <button
            onClick={onAddSubCalculation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded transition-colors whitespace-nowrap"
            title="Chèn dòng diễn giải dài x rộng x cao dưới công tác hiện tại"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Chèn diễn giải KL</span>
          </button>

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          <button
            onClick={onOpenMonthlyPrice}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded transition-colors whitespace-nowrap shadow-xs"
            title={`Mở bảng Bộ Đơn giá 63 Tỉnh/Thành & Lắp giá thông báo Sở Xây dựng ${settings.locationProvince} (Phím tắt F3)`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">Bộ Đơn giá 63 Tỉnh & Giá tháng (F3)</span>
          </button>

          {onUndo && (
            <div className="flex items-center bg-slate-900/70 rounded border border-slate-700/80 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${
                  canUndo
                    ? 'text-slate-100 hover:text-white hover:bg-slate-700 cursor-pointer active:scale-95'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
                title={canUndo ? `Hoàn tác: ${undoActionName || 'Thao tác trước'} (Ctrl+Z)` : 'Không có thao tác nào để hoàn tác (Ctrl+Z)'}
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Hoàn tác (Ctrl+Z)</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-700" />
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${
                  canRedo
                    ? 'text-slate-100 hover:text-white hover:bg-slate-700 cursor-pointer active:scale-95'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
                title={canRedo ? `Làm lại: ${redoActionName || 'Thao tác sau'} (Ctrl+Y)` : 'Không có thao tác nào để làm lại (Ctrl+Y)'}
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Làm lại (Ctrl+Y)</span>
              </button>
            </div>
          )}

          {onSaveProject && (
            <button
              onClick={onSaveProject}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Lưu toàn bộ dữ liệu dự án vào bộ nhớ cục bộ LocalStorage (Phím tắt F4)"
            >
              <Save className="w-3.5 h-3.5 text-blue-200" />
              <span>Lưu dự án (F4)</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer disabled:opacity-50"
              title="Làm mới giao diện và tải lại các định mức mới nhất từ máy chủ (Phím tắt F5)"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Làm mới (F5)</span>
            </button>
          )}

          {onToggleMobileView && (
            <button
              onClick={onToggleMobileView}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer ${
                isMobileView
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
              }`}
              title="Nhanh chóng chuyển đổi sang chế độ Xem tóm tắt di động Mobile THKP (Phím tắt F6)"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Xem tóm tắt (F6)</span>
            </button>
          )}

          {onOpenQuickTHKP && (
            <button
              onClick={onOpenQuickTHKP}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Mở nhanh cửa sổ Dự toán tài chính tổng hợp (THKP) theo TT 11/2021/TT-BXD từ bất kỳ tab nào (Phím tắt F7)"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-950" />
              <span>THKP nhanh (F7)</span>
            </button>
          )}

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            title="Xuất trọn bộ 8 sheet dự toán ra file Excel .xlsx"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          {onDirectExportPdf && (
            <button
              onClick={onDirectExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title="Xuất trực tiếp bảng tính hiện tại ra file PDF chuẩn hành chính Nhà nước (Nghị định 30/2020/NĐ-CP) bằng jsPDF"
            >
              {isExportingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-200" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-rose-200" />
              )}
              <span>{isExportingPdf ? 'Đang xuất PDF...' : 'PDF Export (Xuất PDF)'}</span>
            </button>
          )}

          {onOpenAdminPrint && (
            <button
              onClick={onOpenAdminPrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Xem trước & in ấn toàn bộ bảng tính theo mẫu in ấn hành chính nhà nước (Nghị định 30/2020/NĐ-CP)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Xem in Hành chính</span>
            </button>
          )}

          {onOpenImportModal ? (
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-900/80 hover:bg-sky-800 text-sky-200 hover:text-white rounded cursor-pointer transition-colors whitespace-nowrap shadow-xs border border-sky-600/70 font-medium"
              title="Nhập dữ liệu công trình từ file Excel (.xlsx) với hướng dẫn chuẩn hóa cột và xem trước dữ liệu"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Nhập Excel</span>
            </button>
          ) : (
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded cursor-pointer transition-colors whitespace-nowrap">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Nhập Excel</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={onImportExcel}
                className="hidden"
              />
            </label>
          )}

          {onDownloadSampleExcel && (
            <button
              type="button"
              onClick={onDownloadSampleExcel}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-emerald-600/80 font-bold"
              title="Tải file mẫu Excel (.xlsx) có sẵn cấu trúc các cột (Mã hiệu, Tên công tác, Đơn vị, Khối lượng) để chuẩn hóa dữ liệu đầu vào khi import"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tải mẫu Excel (.xlsx)</span>
            </button>
          )}

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 hover:text-white rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-amber-600/70 font-semibold"
              title="Xem sổ tay Hướng dẫn sử dụng phần mềm & phím tắt (F1)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Hướng dẫn (F1)</span>
            </button>
          )}

          {onOpenUpdate && (
            <button
              onClick={onOpenUpdate}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer border border-emerald-700/60"
              title="Kiểm tra bản cập nhật mới nhất cho phần mềm Dự toán F1 Pro"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cập nhật</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
          <span>Tỉnh: <strong className="text-white">{currentProvince.name}</strong></span>
          <span>Vùng: <strong className="text-amber-400 font-mono">{currentProvince.region}</strong></span>
          <span>Hệ số NC: <strong className="text-emerald-400 font-mono">{currentProvince.laborCoefficient}</strong></span>
          <span>Máy TC: <strong className="text-emerald-400 font-mono">{currentProvince.machineCoefficient}</strong></span>
          <span>VAT: <strong className="text-amber-400 font-mono">{(settings.vatRate * 100).toFixed(0)}%</strong></span>
        </div>
      </div>

      {/* Main Module Tabs (F1 authentic bottom sheet style) */}
      <div className="flex items-center gap-0.5 px-2 bg-slate-950 overflow-x-auto text-xs border-t border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-white border-red-500 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
