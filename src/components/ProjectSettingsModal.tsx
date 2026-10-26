import React, { useState, useEffect } from 'react';
import { ProjectSettings, ProjectType, AdminReportConfig } from '../types/estimate';
import { PROVINCES_DATA } from '../data/normsData';
import { ProjectInstance } from '../data/multiProjectPresets';
import { 
  Settings, 
  Check, 
  X, 
  FileText, 
  Sliders, 
  Building2, 
  ShieldCheck, 
  Printer, 
  FolderGit2,
  Copy,
  Layers,
  PlayCircle,
  Eye,
  CheckCheck,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onSaveSettings: (newSettings: ProjectSettings) => void;
  initialTab?: 'technical' | 'admin_print' | 'all_projects';
  projects?: ProjectInstance[];
  activeProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  onSaveProjectSettings?: (projectId: string, newSettings: ProjectSettings) => void;
  onApplySettingsToAllProjects?: (newSettings: ProjectSettings) => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  initialTab = 'technical',
  projects = [],
  activeProjectId,
  onSelectProject,
  onSaveProjectSettings,
  onApplySettingsToAllProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'admin_print' | 'all_projects'>(initialTab);
  
  // ID của dự án đang được chọn để cấu hình trong modal này
  const [selectedProjId, setSelectedProjId] = useState<string>(() => {
    return activeProjectId || (projects && projects[0]?.id) || 'current';
  });

  // Helper lấy cấu hình hoàn chỉnh của một dự án
  const getInitialConfig = (projId: string): ProjectSettings => {
    const found = projects.find(p => p.id === projId);
    const base = found ? found.settings : settings;
    const existingAdmin = base.adminReportConfig || {};
    return {
      ...base,
      adminReportConfig: {
        documentTitle: existingAdmin.documentTitle || 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH',
        documentSubTitle: existingAdmin.documentSubTitle || 'Căn cứ Nghị định số 10/2021/NĐ-CP & Thông tư số 11/2021/TT-BXD, TT 12/2021/TT-BXD',
        documentNumber: existingAdmin.documentNumber || 'Số: .../TTr-DA',
        superiorAgency: existingAdmin.superiorAgency || 'UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG',
        consultantUnit: existingAdmin.consultantUnit || base.contractor || 'Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam',
        investorUnit: existingAdmin.investorUnit || base.investor || 'Ban Quản lý Dự án Đầu tư Xây dựng',
        appraisalUnit: existingAdmin.appraisalUnit || 'Sở Xây dựng / Chi cục Giám định Xây dựng',
        creatorName: existingAdmin.creatorName || 'KS. Nguyễn Văn An',
        creatorTitle: existingAdmin.creatorTitle || 'Kỹ sư Định giá Xây dựng',
        chiefEngineer: existingAdmin.chiefEngineer || 'ThS. Trần Quốc Bảo',
        chiefEngineerTitle: existingAdmin.chiefEngineerTitle || 'Chủ trì Lập dự toán',
        approverName: existingAdmin.approverName || 'TS. Lê Hoàng Nam',
        approverTitle: existingAdmin.approverTitle || 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN',
        signDatePlace: existingAdmin.signDatePlace || `${base.locationProvince || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
        nationalHeaderLine1: existingAdmin.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        nationalHeaderLine2: existingAdmin.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc',
        paperOrientation: existingAdmin.paperOrientation || 'landscape',
        showSignatures: existingAdmin.showSignatures !== false
      }
    };
  };

  const [formData, setFormData] = useState<ProjectSettings>(() => getInitialConfig(selectedProjId));
  const [copySourceId, setCopySourceId] = useState<string>('');

  // Cập nhật khi mở modal hoặc thay đổi project chọn
  useEffect(() => {
    if (isOpen) {
      const initialId = activeProjectId || (projects && projects[0]?.id) || 'current';
      setSelectedProjId(initialId);
      setFormData(getInitialConfig(initialId));
    }
  }, [isOpen, activeProjectId]);

  const handleSelectProjectToEdit = (projId: string) => {
    setSelectedProjId(projId);
    setFormData(getInitialConfig(projId));
  };

  if (!isOpen) return null;

  const currentSelectedProject = projects.find(p => p.id === selectedProjId);
  const isEditingActiveProject = selectedProjId === activeProjectId;

  const handleProvinceChange = (provinceName: string) => {
    const prov = PROVINCES_DATA.find(p => p.name === provinceName);
    if (prov) {
      setFormData(prev => ({
        ...prev,
        locationProvince: prov.name,
        salaryRegion: prov.region
      }));
    } else {
      setFormData(prev => ({ ...prev, locationProvince: provinceName }));
    }
  };

  const updateAdminConfig = (patch: Partial<AdminReportConfig>) => {
    setFormData(prev => ({
      ...prev,
      adminReportConfig: {
        ...(prev.adminReportConfig || {}),
        ...patch
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProjectSettings && selectedProjId) {
      onSaveProjectSettings(selectedProjId, formData);
    } else {
      onSaveSettings(formData);
    }
    onClose();
  };

  const handleApplyToAll = () => {
    if (onApplySettingsToAllProjects) {
      onApplySettingsToAllProjects(formData);
      onClose();
    }
  };

  const handleCopySettingsFromOther = (sourceId: string) => {
    const src = projects.find(p => p.id === sourceId);
    if (!src) return;
    setFormData(prev => ({
      ...prev,
      locationProvince: src.settings.locationProvince,
      salaryRegion: src.settings.salaryRegion,
      vatRate: src.settings.vatRate,
      projectType: src.settings.projectType,
      indirectCostConfig: JSON.parse(JSON.stringify(src.settings.indirectCostConfig || {})),
      adminReportConfig: JSON.parse(JSON.stringify(src.settings.adminReportConfig || {})),
      contractor: src.settings.contractor,
      investor: src.settings.investor,
    }));
    setCopySourceId('');
  };

  const getProjectTypeLabel = (type?: ProjectType) => {
    switch (type) {
      case 'civil': return 'Công trình Dân dụng';
      case 'transport': return 'Công trình Giao thông';
      case 'industrial': return 'Công trình Công nghiệp';
      case 'infrastructure': return 'Hạ tầng Kỹ thuật';
      case 'agriculture': return 'Nông nghiệp & PTNT';
      default: return 'Công trình Dân dụng';
    }
  };

  const admin = formData.adminReportConfig || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col text-xs text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/40">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <span>CẤU HÌNH DỰ ÁN & MẪU IN ẤN HÀNH CHÍNH NHÀ NƯỚC</span>
                {projects.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
                    {projects.length} Dự án đang mở
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Tùy biến tham số kỹ thuật, hệ số định mức TT12/TT11 và tiêu đề, đơn vị theo Nghị định 30/2020/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Multi-Project Selector Bar: Displays ALL existing projects */}
        {projects.length > 0 && (
          <div className="bg-slate-850 px-4 py-2 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Dự án đang cấu hình:</span>
              </span>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {projects.map((proj, idx) => {
                  const isSelected = proj.id === selectedProjId;
                  const isActive = proj.id === activeProjectId;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => handleSelectProjectToEdit(proj.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                      title={`Nhấp để cấu hình dự án: ${proj.name} (${proj.settings.locationProvince})`}
                    >
                      <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span className="max-w-[140px] truncate text-left">{proj.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {proj.settings.locationProvince}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40" title="Dự án đang làm việc chính" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Activate Action */}
            {onSelectProject && !isEditingActiveProject && currentSelectedProject && (
              <button
                type="button"
                onClick={() => {
                  onSelectProject(selectedProjId);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                title="Chuyển không gian làm việc chính sang dự án này"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kích hoạt làm việc ngay</span>
              </button>
            )}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-t border-l border-r transition-all cursor-pointer ${
              activeTab === 'technical'
                ? 'bg-white border-slate-200 text-blue-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Cấu hình Kỹ thuật & Định mức BXD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin_print')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-t border-l border-r transition-all cursor-pointer ${
              activeTab === 'admin_print'
                ? 'bg-white border-slate-200 text-emerald-700 shadow-xs -mb-[1px]'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Tùy chỉnh Tiêu đề & Đơn vị In Hành chính (NĐ 30/2020)</span>
          </button>

          {projects.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('all_projects')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-t border-l border-r transition-all cursor-pointer ${
                activeTab === 'all_projects'
                  ? 'bg-white border-slate-200 text-purple-700 shadow-xs -mb-[1px]'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>3. Danh sách tất cả dự án & Áp dụng đồng loạt ({projects.length})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-mono font-bold">
                Mới
              </span>
            </button>
          )}
        </div>

        {/* Current Target Project Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-950 uppercase tracking-wider text-[11px]">Đang chỉnh sửa:</span>
            <span className="font-extrabold text-blue-700 text-xs">{formData.projectName}</span>
            <span className="text-slate-500 text-[11px]">({formData.locationProvince} • Vùng {formData.salaryRegion} • {getProjectTypeLabel(formData.projectType)})</span>
          </div>
          {isEditingActiveProject ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dự án đang làm việc chính
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 italic">
              Dự án phụ trong phiên làm việc đa dự án
            </span>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: CẤU HÌNH KỸ THUẬT */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tên công trình / Dự án đầu tư:</label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chủ đầu tư / Ban quản lý dự án:</label>
                  <input
                    type="text"
                    value={formData.investor}
                    onChange={(e) => setFormData({ ...formData, investor: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Đơn vị tư vấn / Lập dự toán:</label>
                  <input
                    type="text"
                    value={formData.contractor}
                    onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Địa điểm (Tỉnh / Thành phố áp dụng đơn giá):</label>
                  <select
                    value={formData.locationProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    {PROVINCES_DATA.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} (Vùng {p.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Vùng lương nhân công theo Nghị định:</label>
                  <select
                    value={formData.salaryRegion}
                    onChange={(e) => setFormData({ ...formData, salaryRegion: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="I">Vùng I (Hà Nội, TP.HCM, Hải Phòng...)</option>
                    <option value="II">Vùng II (Đà Nẵng, Cần Thơ, Quảng Ninh...)</option>
                    <option value="III">Vùng III (Nghệ An, Lâm Đồng, Tây Nguyên...)</option>
                    <option value="IV">Vùng IV (Các huyện nông thôn miền núi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Loại công trình xây dựng (Thông tư 11):</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="civil">🏢 Công trình Dân dụng (Chi phí chung: 7.30% - 4.40%)</option>
                    <option value="industrial">🏭 Công trình Công nghiệp (Chi phí chung: 6.20% - 4.10%)</option>
                    <option value="transport">🛣️ Công trình Giao thông (Chi phí chung: 5.50% - 3.80%)</option>
                    <option value="infrastructure">🏗️ Hạ tầng kỹ thuật (Chi phí chung: 5.00% - 3.40%)</option>
                    <option value="agriculture">🌾 Nông nghiệp & PTNT (Chi phí chung: 5.80% - 4.00%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thuế suất thuế GTGT (VAT):</label>
                  <select
                    value={formData.vatRate}
                    onChange={(e) => setFormData({ ...formData, vatRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-bold text-amber-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={0.10}>Thuế suất 10% (Chuẩn luật thuế GTGT)</option>
                    <option value={0.08}>Thuế suất 8% (Chính sách ưu đãi giảm thuế VAT)</option>
                  </select>
                </div>
              </div>

              {/* Tự động hóa chi phí gián tiếp */}
              <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200 space-y-2.5">
                <div className="font-bold text-blue-950 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Cơ chế Tự động hóa Chi phí gián tiếp (Thông tư 11/2021/TT-BXD):</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-mono font-semibold px-2 py-0.5 bg-blue-100 rounded border border-blue-300">
                    Bảng 3.1 &amp; 3.2
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <label className="block text-[11px] text-slate-700 font-medium mb-1">Phương pháp tra cứu & nội suy:</label>
                    <select
                      value={formData.indirectCostConfig?.method || 'by_scale'}
                      onChange={(e) => setFormData({
                        ...formData,
                        indirectCostConfig: {
                          ...(formData.indirectCostConfig || { enabledAuto: true, isLineProject: false, method: 'by_scale' }),
                          method: e.target.value as any
                        }
                      })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                    >
                      <option value="by_scale">Theo quy mô Chi phí trực tiếp T (Tự động nội suy tỷ lệ %)</option>
                      <option value="by_project_type">Cố định theo Loại công trình chung</option>
                      <option value="by_category">Tùy biến chi tiết theo từng Hạng mục riêng biệt</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isLineProject"
                      checked={formData.indirectCostConfig?.isLineProject || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        indirectCostConfig: {
                          ...(formData.indirectCostConfig || { enabledAuto: true, isLineProject: false, method: 'by_scale' }),
                          isLineProject: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <label htmlFor="isLineProject" className="text-slate-800 font-semibold cursor-pointer">
                      Công trình xây dựng theo tuyến (Đường dây, đường bộ, kênh mương... Tỷ lệ nhà tạm 2.2%)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tự động lưu */}
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoSaveEnabled"
                      checked={formData.autoSaveConfig?.enabled !== false}
                      onChange={(e) => setFormData({
                        ...formData,
                        autoSaveConfig: {
                          ...(formData.autoSaveConfig || { enabled: true, intervalMinutes: 5 }),
                          enabled: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <label htmlFor="autoSaveEnabled" className="font-bold text-slate-800 cursor-pointer">
                      Tự động lưu dự án vào bộ nhớ LocalStorage trình duyệt
                    </label>
                  </div>
                </div>

                {formData.autoSaveConfig?.enabled !== false && (
                  <div className="flex items-center gap-3 pl-6">
                    <span className="text-[11px] text-slate-600">Chu kỳ tự động lưu:</span>
                    <select
                      value={formData.autoSaveConfig?.intervalMinutes || 5}
                      onChange={(e) => setFormData({
                        ...formData,
                        autoSaveConfig: {
                          ...(formData.autoSaveConfig || { enabled: true, intervalMinutes: 5 }),
                          intervalMinutes: parseInt(e.target.value)
                        }
                      })}
                      className="px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                    >
                      <option value={1}>Mỗi 1 phút</option>
                      <option value={2}>Mỗi 2 phút</option>
                      <option value={5}>Mỗi 5 phút (Khuyên dùng)</option>
                      <option value={10}>Mỗi 10 phút</option>
                      <option value={15}>Mỗi 15 phút</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hệ thống Thông tư, Nghị định pháp lý áp dụng:</label>
                <input
                  type="text"
                  value={formData.standardCircular}
                  onChange={(e) => setFormData({ ...formData, standardCircular: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50 text-xs text-slate-700 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CẤU HÌNH MẪU IN HÀNH CHÍNH NHÀ NƯỚC */}
          {activeTab === 'admin_print' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <span>Chuẩn Thể thức Văn bản Hành chính Nhà nước (Nghị định số 30/2020/NĐ-CP)</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Các trường thông tin dưới đây sẽ được tự động điền vào Quốc hiệu, Tiêu ngữ, Tiêu đề hồ sơ, Số hiệu công văn và Khối chữ ký thẩm định/phê duyệt khi xuất bản hoặc in ấn PDF toàn bộ bảng tính.
                </p>
              </div>

              {/* Nhóm 1: Tiêu đề hồ sơ & Văn bản */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Tiêu đề Hồ sơ &amp; Số hiệu Văn bản</span>
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tiêu đề chính văn bản (In hoa, căn giữa):
                  </label>
                  <input
                    type="text"
                    value={admin.documentTitle || ''}
                    onChange={(e) => updateAdminConfig({ documentTitle: e.target.value })}
                    placeholder="VD: BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-bold text-slate-900 uppercase focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tiêu đề phụ / Căn cứ pháp lý:
                    </label>
                    <input
                      type="text"
                      value={admin.documentSubTitle || ''}
                      onChange={(e) => updateAdminConfig({ documentSubTitle: e.target.value })}
                      placeholder="VD: Căn cứ Nghị định 10/2021/NĐ-CP và TT 11/2021/TT-BXD"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số hiệu công văn / tờ trình:
                    </label>
                    <input
                      type="text"
                      value={admin.documentNumber || ''}
                      onChange={(e) => updateAdminConfig({ documentNumber: e.target.value })}
                      placeholder="VD: Số: 128/TTr-BQLDA"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Địa danh, Ngày tháng năm lập biểu:
                    </label>
                    <input
                      type="text"
                      value={admin.signDatePlace || ''}
                      onChange={(e) => updateAdminConfig({ signDatePlace: e.target.value })}
                      placeholder="VD: Hà Nội, ngày 21 tháng 10 năm 2026"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs italic focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Khổ giấy in ấn mặc định:
                    </label>
                    <select
                      value={admin.paperOrientation || 'landscape'}
                      onChange={(e) => updateAdminConfig({ paperOrientation: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold"
                    >
                      <option value="landscape">Khổ ngang (Landscape - Khuyên dùng cho bảng tính nhiều cột)</option>
                      <option value="portrait">Khổ dọc (Portrait - Thích hợp bảng tổng hợp ngắn)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Các Đơn vị tham gia */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Thông tin Các Đơn vị &amp; Cơ quan Trình duyệt</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cơ quan quản lý cấp trên (Dòng trên cùng):
                    </label>
                    <input
                      type="text"
                      value={admin.superiorAgency || ''}
                      onChange={(e) => updateAdminConfig({ superiorAgency: e.target.value })}
                      placeholder="VD: UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Chủ đầu tư / Ban quản lý dự án:
                    </label>
                    <input
                      type="text"
                      value={admin.investorUnit || ''}
                      onChange={(e) => updateAdminConfig({ investorUnit: e.target.value })}
                      placeholder="VD: BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG KHU ĐÔ THỊ"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Đơn vị Tư vấn Lập dự toán:
                    </label>
                    <input
                      type="text"
                      value={admin.consultantUnit || ''}
                      onChange={(e) => updateAdminConfig({ consultantUnit: e.target.value })}
                      placeholder="VD: CÔNG TY CỔ PHẦN TƯ VẤN THIẾT KẾ & ĐỊNH GIÁ XÂY DỰNG F1"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Đơn vị Thẩm tra / Thẩm định dự toán:
                    </label>
                    <input
                      type="text"
                      value={admin.appraisalUnit || ''}
                      onChange={(e) => updateAdminConfig({ appraisalUnit: e.target.value })}
                      placeholder="VD: PHÒNG KINH TẾ XÂY DỰNG - SỞ XÂY DỰNG HÀ NỘI"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Nhóm 3: Khối Chữ ký */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>3. Khối Chữ ký &amp; Trách nhiệm Pháp lý (3 Chức danh)</span>
                  </h4>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={admin.showSignatures !== false}
                      onChange={(e) => updateAdminConfig({ showSignatures: e.target.checked })}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span>Hiển thị khối chữ ký cuối văn bản</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Cột 1: Người lập biểu */}
                  <div className="p-2.5 bg-white rounded border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block border-b pb-1">
                      1. NGƯỜI LẬP BIỂU
                    </span>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Họ và tên:</label>
                      <input
                        type="text"
                        value={admin.creatorName || ''}
                        onChange={(e) => updateAdminConfig({ creatorName: e.target.value })}
                        placeholder="VD: KS. Nguyễn Văn An"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Chức danh / Vị trí:</label>
                      <input
                        type="text"
                        value={admin.creatorTitle || ''}
                        onChange={(e) => updateAdminConfig({ creatorTitle: e.target.value })}
                        placeholder="VD: Kỹ sư Định giá Xây dựng"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Cột 2: Chủ trì thẩm tra */}
                  <div className="p-2.5 bg-white rounded border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block border-b pb-1">
                      2. CHỦ TRÌ THIẾT KẾ / LẬP
                    </span>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Họ và tên:</label>
                      <input
                        type="text"
                        value={admin.chiefEngineer || ''}
                        onChange={(e) => updateAdminConfig({ chiefEngineer: e.target.value })}
                        placeholder="VD: ThS. Trần Quốc Bảo"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Chức danh / Vị trí:</label>
                      <input
                        type="text"
                        value={admin.chiefEngineerTitle || ''}
                        onChange={(e) => updateAdminConfig({ chiefEngineerTitle: e.target.value })}
                        placeholder="VD: Chủ trì Dự toán & Kinh tế Xây dựng"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Cột 3: Người phê duyệt */}
                  <div className="p-2.5 bg-white rounded border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] block border-b pb-1">
                      3. NGƯỜI PHÊ DUYỆT (CHỦ ĐẦU TƯ)
                    </span>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Họ và tên người duyệt:</label>
                      <input
                        type="text"
                        value={admin.approverName || ''}
                        onChange={(e) => updateAdminConfig({ approverName: e.target.value })}
                        placeholder="VD: TS. Lê Hoàng Nam"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Chức vụ / Đơn vị:</label>
                      <input
                        type="text"
                        value={admin.approverTitle || ''}
                        onChange={(e) => updateAdminConfig({ approverTitle: e.target.value })}
                        placeholder="VD: GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DANH SÁCH TẤT CẢ CÁC DỰ ÁN & ÁP DỤNG ĐỒNG LOẠT */}
          {activeTab === 'all_projects' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl text-purple-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>QUẢN LÝ & CẤU HÌNH TẤT CẢ DỰ ÁN ĐANG MỞ ({projects.length} DỰ ÁN)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
                    Multi-Project Matrix
                  </span>
                </div>
                <p className="text-[11px] text-purple-900 mt-1 leading-relaxed">
                  Tại đây bạn có thể theo dõi nhanh tham số kỹ thuật của từng dự án, chọn dự án bất kỳ để chuyển sang cấu hình riêng, hoặc sao chép và áp dụng đồng loạt cấu hình cho tất cả các dự án.
                </p>
              </div>

              {/* Bảng so sánh thông số tất cả dự án */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                      <th className="py-2.5 px-3 w-10 text-center">STT</th>
                      <th className="py-2.5 px-3">Tên dự án</th>
                      <th className="py-2.5 px-2.5">Loại công trình</th>
                      <th className="py-2.5 px-2.5">Địa bàn &amp; Vùng lương</th>
                      <th className="py-2.5 px-2 text-center">VAT</th>
                      <th className="py-2.5 px-2.5 text-center">Khối lượng</th>
                      <th className="py-2.5 px-2.5 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((proj, idx) => {
                      const isSelected = proj.id === selectedProjId;
                      const isActive = proj.id === activeProjectId;
                      return (
                        <tr
                          key={proj.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-blue-50/70 font-medium' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{proj.name}</span>
                              {isSelected && (
                                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-normal">
                                  Đang cấu hình
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-slate-500 truncate max-w-xs">
                              CĐT: {proj.settings.investor || 'Chưa đặt'} • Tư vấn: {proj.settings.contractor || 'Chưa đặt'}
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                              {getProjectTypeLabel(proj.settings.projectType)}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <div className="font-semibold text-slate-800">{proj.settings.locationProvince}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Vùng {proj.settings.salaryRegion}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-700">
                            {(proj.settings.vatRate * 100).toFixed(0)}%
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-[11px] text-slate-600">
                            <span className="font-mono font-bold text-blue-700">{proj.items.length}</span> công tác
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Đang mở
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Dự án phụ</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectProjectToEdit(proj.id);
                                  setActiveTab('technical');
                                }}
                                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Chuyển sang cấu hình tham số cho dự án này"
                              >
                                Sửa cấu hình
                              </button>

                              {onSelectProject && !isActive && (
                                <button
                                  type="button"
                                  onClick={() => onSelectProject(proj.id)}
                                  className="px-2 py-1 rounded text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-pointer transition-colors"
                                  title="Chuyển không gian làm việc chính sang dự án này"
                                >
                                  Kích hoạt
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tiện ích sao chép và áp dụng hàng loạt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {/* Sao chép cấu hình từ dự án khác */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sao chép cấu hình từ dự án khác vào dự án đang chọn</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kế thừa nhanh địa bàn tỉnh, vùng lương, tỷ lệ VAT và thông tin in ấn từ một dự án có sẵn.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={copySourceId}
                      onChange={(e) => setCopySourceId(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
                    >
                      <option value="">-- Chọn dự án mẫu để sao chép --</option>
                      {projects.filter(p => p.id !== selectedProjId).map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.settings.locationProvince})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!copySourceId}
                      onClick={() => handleCopySettingsFromOther(copySourceId)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      Sao chép
                    </button>
                  </div>
                </div>

                {/* Áp dụng cấu hình đồng loạt */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <CheckCheck className="w-4 h-4 text-amber-700" />
                    <span>Áp dụng cấu hình này cho TẤT CẢ các dự án</span>
                  </div>
                  <p className="text-[11px] text-amber-900">
                    Đồng bộ hóa Tỉnh thành, Vùng lương, VAT, Chi phí gián tiếp và Mẫu in hành chính hiện tại sang toàn bộ {projects.length} dự án đang mở.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleApplyToAll}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>ÁP DỤNG ĐỒNG LOẠT CHO TẤT CẢ {projects.length} DỰ ÁN</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] text-slate-500 italic flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>* Cấu hình dự án <strong>{formData.projectName}</strong> sẽ tự động đồng bộ khi tính toán THKP và xuất PDF / Excel.</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              {onApplySettingsToAllProjects && projects.length > 1 && (
                <button
                  type="button"
                  onClick={handleApplyToAll}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
                  title="Áp dụng các thông số kỹ thuật và mẫu in này cho toàn bộ dự án đang mở"
                >
                  <CheckCheck className="w-4 h-4 text-amber-400" />
                  <span>Áp dụng cho tất cả ({projects.length})</span>
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>LƯU CẤU HÌNH DỰ ÁN NÀY</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
