import React, { useState } from 'react';
import { WorkItem, ProjectSettings, Category, SettlementItem, GanttTask, BiddingForm } from '../types/estimate';
import { generatePythonScript } from '../utils/pythonGenerator';
import { computeTHKP } from '../utils/calculator';
import { 
  Code, Download, Copy, Check, Terminal, Server, Play, FolderArchive, X, 
  FileCode, Database, CheckCircle2, Cpu, ArrowDownToLine, Layers, Sparkles,
  Lock, Unlock, Key, Eye, EyeOff, ShieldAlert, ShieldCheck
} from 'lucide-react';

interface PythonExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
  settlements: SettlementItem[];
  tasks: GanttTask[];
  biddingForm?: BiddingForm;
  isAdmin?: boolean;
}

// Mật khẩu ủy quyền bảo vệ chức năng xuất mã nguồn Python
export const PYTHON_EXPORT_PASSWORD = 'An$12131415';

export const PythonExportModal: React.FC<PythonExportModalProps> = ({
  isOpen,
  onClose,
  items,
  categories,
  settings,
  settlements,
  tasks,
  biddingForm,
  isAdmin = false,
}) => {
  const [activeTab, setActiveTab] = useState<'zip-package' | 'rest-api' | 'python-code' | 'full-source'>('zip-package');
  const [copied, setCopied] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Trạng thái khóa & mật khẩu bảo vệ (Admin HOÀNG HẢI AN luôn tự động mở khóa miễn phí)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (isAdmin) return true;
    try {
      return sessionStorage.getItem('f1_python_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const pythonCode = generatePythonScript(items, categories, settings, settlements, tasks, biddingForm);

  // Xác thực mật khẩu
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim() === PYTHON_EXPORT_PASSWORD) {
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('f1_python_unlocked', 'true');
      } catch {
        // ignore storage error
      }
      setPasswordError(null);
      setUnlockSuccessMsg('Xác thực thành công! Quyền tải mã nguồn Python đã được mở khóa.');
      setTimeout(() => setUnlockSuccessMsg(null), 3500);
    } else {
      setPasswordError('Mật khẩu không chính xác! Chỉ người dùng được ủy quyền với mật khẩu hợp lệ mới có thể tải xuống mã nguồn Python.');
      setUnlockSuccessMsg(null);
    }
  };

  // Khóa lại
  const handleLockAgain = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem('f1_python_unlocked');
    } catch {
      // ignore
    }
    setPasswordInput('');
    setPasswordError(null);
    setUnlockSuccessMsg(null);
  };

  // Kiểm tra an toàn trước khi tải
  const verifyAccessBeforeDownload = (): boolean => {
    if (!isUnlocked) {
      setPasswordError('Vui lòng nhập mật khẩu xác thực để tải xuống mã nguồn!');
      return false;
    }
    return true;
  };

  const handleDownloadZipPackage = () => {
    if (!verifyAccessBeforeDownload()) return;
    const link = document.createElement('a');
    link.href = '/du_toan_f1_python_full.zip';
    link.setAttribute('download', 'du_toan_f1_python_full.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFullSourceZip = () => {
    if (!verifyAccessBeforeDownload()) return;
    const link = document.createElement('a');
    link.href = '/du_toan_f1_source_all.zip';
    link.setAttribute('download', 'du_toan_f1_source_all.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPythonSingleFile = () => {
    if (!verifyAccessBeforeDownload()) return;
    const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'du_toan_f1_engine.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPython = () => {
    if (!verifyAccessBeforeDownload()) return;
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadFullProjectJson = () => {
    if (!verifyAccessBeforeDownload()) return;
    const fullProjectBundle = {
      name: "DuToan_F1_Pro_Full_Project",
      version: "2.5.0",
      standard: "Thông tư 12/2021/TT-BXD, TT 11/2021/TT-BXD & NĐ 99/2021/NĐ-CP",
      timestamp: new Date().toISOString(),
      settings,
      categories,
      items,
      settlements,
      tasks,
      biddingForm
    };
    const blob = new Blob([JSON.stringify(fullProjectBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Du_Toan_F1_Full_Data_${settings.projectName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTestApi = (endpoint: string) => {
    setApiLoading(true);
    setTimeout(() => {
      setApiLoading(false);
      if (endpoint === '/api/calculate/thkp') {
        const thkp = computeTHKP(items, settings);
        setApiResponse(JSON.stringify(thkp, null, 2));
      } else if (endpoint === '/api/project') {
        setApiResponse(JSON.stringify({ settings, categories, workItemsCount: items.length }, null, 2));
      } else if (endpoint === '/api/sync-bim') {
        setApiResponse(JSON.stringify({
          status: 'success',
          syncedElements: 48,
          timestamp: new Date().toISOString(),
          message: 'Đã nhận và đồng bộ thành công 48 cấu kiện hình học từ Autodesk Revit / IFC vào Bảng Diễn giải khối lượng F1.'
        }, null, 2));
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded border ${isUnlocked ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500/40' : 'bg-red-600/30 text-red-400 border-red-500/40'}`}>
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>XUẤT TRỌN BỘ MÃ NGUỒN PYTHON (.ZIP) & REST API</span>
                {isUnlocked ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Đã Mở Khóa Quyền Tải Xuống
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-mono font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Yêu Cầu Mật Khẩu Bảo Mật
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Gói phần mềm Python độc lập đầy đủ module, database SQLite, CLI 15 menu, xuất Excel 8 sheet và API server đồng bộ Revit/CAD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked && (
              <button
                onClick={handleLockAgain}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                title="Khóa lại chức năng xuất mã nguồn"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Khóa lại</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE / LOCK SCREEN: If not unlocked */}
        {!isUnlocked ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/80">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/40 text-red-400 shadow-inner">
                <Lock className="w-8 h-8" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow">
                  KEY
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white tracking-tight">
                  Xác Thực Quyền Tải Mã Nguồn Python
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Chức năng xuất toàn bộ mã nguồn Python, cơ sở dữ liệu SQLite định mức TT12 và máy chủ REST API được bảo mật bản quyền. Vui lòng nhập mật khẩu được cấp để mở khóa tải xuống.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4 pt-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Nhập mật khẩu xác thực..."
                    autoFocus
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-lg text-sm text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-red-500 focus:ring-red-500/40 ring-1 ring-red-500'
                        : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-950/70 border border-red-800 rounded-lg text-red-300 text-xs text-left flex items-start gap-2 animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{passwordError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Xác thực & Mở khóa</span>
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Bảo mật hệ thống Dự toán F1 Pro (63 Tỉnh Thành & TT 12)</span>
              </div>
            </div>
          </div>
        ) : (
          /* UNLOCKED FULL CONTENT */
          <>
            {/* Success notification banner */}
            {unlockSuccessMsg && (
              <div className="px-5 py-2 bg-emerald-950 border-b border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {unlockSuccessMsg}
                </span>
                <span className="font-mono text-[10px] text-emerald-400">Authorized: An$12131415</span>
              </div>
            )}

            {/* Tab switch */}
            <div className="flex items-center justify-between px-5 py-2 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('zip-package')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'zip-package' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FolderArchive className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="font-bold">1. Tải Gói Python (.zip) Đầy Đủ</span>
                </button>
                <button
                  onClick={() => setActiveTab('rest-api')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'rest-api' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>2. Hướng Dẫn Tích Hợp API (Revit / CAD)</span>
                </button>
                <button
                  onClick={() => setActiveTab('python-code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'python-code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>3. Mã Nguồn Script (.py)</span>
                </button>
                <button
                  onClick={() => setActiveTab('full-source')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'full-source' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>4. Mã Nguồn Toàn Dự Án (.zip)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadZipPackage}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors text-xs font-bold shadow-xs cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Tải file .zip Python</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-5 text-xs">
              {activeTab === 'zip-package' && (
                <div className="space-y-4">
                  {/* Highlight Banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 rounded-lg border border-emerald-700/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Gói Nén Mã Nguồn Python Độc Lập - Đầy Đủ 10 Phân Hệ</span>
                      </h4>
                      <p className="text-slate-300 text-xs mt-1">
                        Chứa toàn bộ các module Python (.py), cơ sở dữ liệu SQLite, 63 tỉnh thành, định mức Thông tư 12, CLI 15 menu và tài liệu tích hợp API.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadZipPackage}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>TẢI FILE NÉN (.ZIP) NGAY</span>
                    </button>
                  </div>

                  {/* Module Breakdown Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-800/90 rounded border border-slate-700">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
                        <Database className="w-4 h-4" />
                        <span>1. CSDL 63 Tỉnh Thành & Định Mức</span>
                      </div>
                      <ul className="text-slate-300 text-[11px] space-y-1">
                        <li>• <code className="text-white font-mono">du_toan_f1/provinces.py</code>: Đầy đủ 63 tỉnh thành (Vùng I-IV), lương công nhân TT13, giá nhiên liệu & giá thông báo Sở Xây dựng.</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/norms_database.py</code>: Đầy đủ định mức TT12 (AB, AC, AF, AE, AK, AI, BA, BB).</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/du_toan_f1.db</code>: File SQLite bền vững đã nạp sẵn dữ liệu.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-800/90 rounded border border-slate-700">
                      <div className="flex items-center gap-2 text-blue-400 font-bold mb-1.5">
                        <Cpu className="w-4 h-4" />
                        <span>2. Engine Tính Toán & Excel</span>
                      </div>
                      <ul className="text-slate-300 text-[11px] space-y-1">
                        <li>• <code className="text-white font-mono">du_toan_f1/calculator.py</code>: Diễn giải hình học, chi phí trực tiếp T, gián tiếp GT, TL, Gxd, THKP, TMĐT theo TT11 & TT14.</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/exporters.py</code>: Xuất file Excel 8 sheet mở trên mọi phiên bản không cần thư viện phụ thuộc.</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/constants.py</code>: Toàn bộ tỷ lệ % quy phạm pháp luật.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-800/90 rounded border border-slate-700">
                      <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1.5">
                        <Server className="w-4 h-4" />
                        <span>3. Giao Diện CLI & REST API</span>
                      </div>
                      <ul className="text-slate-300 text-[11px] space-y-1">
                        <li>• <code className="text-white font-mono">main.py</code>: Điểm vào chính hỗ trợ chạy CLI, Server, Excel và Unit Test.</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/cli.py</code>: Menu terminal tương tác 15 chức năng nghiệp vụ.</li>
                        <li>• <code className="text-white font-mono">du_toan_f1/api_server.py</code>: REST API đồng bộ với Revit BIM / AutoCAD / Excel VBA.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 bg-slate-950 rounded border border-slate-800 text-slate-300 space-y-2">
                    <span className="font-bold text-white block">Hướng dẫn giải nén và sử dụng gói Python:</span>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 text-[11px] font-mono">
                      <li>Giải nén file <code className="text-emerald-400">du_toan_f1_python_full.zip</code> vào một thư mục trên máy tính.</li>
                      <li>Mở Terminal hoặc Command Prompt tại thư mục vừa giải nén.</li>
                      <li>Chạy giao diện tương tác: <code className="text-yellow-400 font-bold">python main.py</code> (hoặc <code className="text-yellow-400">python main.py --cli</code>)</li>
                      <li>Xem bảng THKP & Tổng mức đầu tư: <code className="text-white">python main.py --thkp</code></li>
                      <li>Xuất ra file Excel 8 sheet: <code className="text-white">python main.py --excel</code></li>
                      <li>Xem danh mục 63 tỉnh thành: <code className="text-white">python main.py --provinces</code></li>
                      <li>Khởi động máy chủ API: <code className="text-blue-400">python main.py --api</code> (lắng nghe tại cổng 8000)</li>
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === 'rest-api' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/60 rounded border border-slate-700">
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <span>Bộ RESTful API phục vụ tích hợp 2 chiều (Revit BIM / AutoCAD / Excel)</span>
                    </h4>
                    <p className="text-slate-300 text-xs mb-3">
                      API này cho phép các phần mềm chuyên dụng như <strong>Autodesk Revit</strong>, <strong>AutoCAD</strong>, add-in Excel hoặc hệ thống ERP công ty truy vấn định mức và đồng bộ tự động dữ liệu dự toán.
                    </p>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-blue-300 font-bold rounded">GET</span>
                          <span className="text-slate-200">/api/v1/provinces</span>
                          <span className="text-slate-500 text-[10px]">— Lấy danh mục 63 tỉnh thành, lương vùng & giá thông báo</span>
                        </div>
                        <span className="text-emerald-400 font-sans text-[11px]">63 Tỉnh</span>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-blue-300 font-bold rounded">GET</span>
                          <span className="text-slate-200">/api/v1/norms?q=...</span>
                          <span className="text-slate-500 text-[10px]">— Tra cứu định mức TT12 (hỗ trợ tìm tiếng Việt không dấu)</span>
                        </div>
                        <span className="text-emerald-400 font-sans text-[11px]">TT12/2021</span>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-blue-300 font-bold rounded">GET</span>
                          <span className="text-slate-200">/api/v1/calculate/thkp</span>
                          <span className="text-slate-500 text-[10px]">— Lấy bảng tổng hợp kinh phí & TMĐT tức thời</span>
                        </div>
                        <button
                          onClick={() => handleTestApi('/api/calculate/thkp')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-sans font-medium cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Thử nghiệm</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-900 text-emerald-300 font-bold rounded">POST</span>
                          <span className="text-slate-200">/api/v1/sync/bim</span>
                          <span className="text-slate-500 text-[10px]">— Nhận dữ liệu hình học trực tiếp từ mô hình Revit BIM</span>
                        </div>
                        <button
                          onClick={() => handleTestApi('/api/sync-bim')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-sans font-medium cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Thử nghiệm</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {apiLoading ? (
                    <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-400">
                      Đang xử lý kết nối API...
                    </div>
                  ) : apiResponse ? (
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] block mb-1">Dữ liệu phản hồi JSON (Response):</span>
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-48">
                        {apiResponse}
                      </pre>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'python-code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded border border-slate-700 text-slate-300">
                    <span className="font-bold text-white text-xs">Mã nguồn file đơn du_toan_f1_engine.py (Dự án hiện tại)</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyPython}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors text-xs font-medium cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
                      </button>
                      <button
                        onClick={handleDownloadPythonSingleFile}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-xs font-medium cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file .py</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[50vh] leading-relaxed">
                      {pythonCode}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'full-source' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/80 rounded border border-slate-700 text-slate-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">Gói mã nguồn đầy đủ của toàn bộ dự án (Web Frontend + Python Backend)</h4>
                      <button
                        onClick={handleDownloadFullSourceZip}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-xs font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file du_toan_f1_source_all.zip</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Bao gồm toàn bộ giao diện Web React 19 + TypeScript + Tailwind CSS, 10 phân hệ nghiệp vụ, cùng toàn bộ gói Python Engine và CSDL SQLite.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-blue-400">/src/App.tsx</strong>: Điều phối trạng thái thời gian thực
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-blue-400">/src/utils/calculator.ts</strong>: Engine tính toán số học & THKP
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-blue-400">/src/data/provincesData.ts</strong>: Cơ sở dữ liệu 63 Tỉnh/Thành
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-blue-400">/src/data/normsData.ts</strong>: Định mức Bộ Xây dựng TT12
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-blue-400">/src/utils/excelExport.ts</strong>: Xuất/Nhập Excel 8 sheet
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800">
                        <strong className="text-emerald-400">/python_package/</strong>: Trọn bộ Engine Python độc lập
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleDownloadFullProjectJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Xuất dữ liệu dự án (.json)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
