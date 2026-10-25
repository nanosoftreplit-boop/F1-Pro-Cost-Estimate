import React, { useState } from 'react';
import { ProjectSettings, ProjectType, AdminReportConfig } from '../types/estimate';
import { PROVINCES_DATA } from '../data/normsData';
import { Settings, Check, X, FileText, Sliders, Building2, UserCheck, ShieldCheck, Printer, Save, Clock } from 'lucide-react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onSaveSettings: (newSettings: ProjectSettings) => void;
  initialTab?: 'technical' | 'admin_print';
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  initialTab = 'technical'
}) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'admin_print'>(initialTab);
  const [formData, setFormData] = useState<ProjectSettings>(() => {
    const existingAdmin = settings.adminReportConfig || {};
    return {
      ...settings,
      adminReportConfig: {
        documentTitle: existingAdmin.documentTitle || 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH',
        documentSubTitle: existingAdmin.documentSubTitle || 'Căn cứ Nghị định số 10/2021/NĐ-CP & Thông tư số 11/2021/TT-BXD, TT 12/2021/TT-BXD',
        documentNumber: existingAdmin.documentNumber || 'Số: .../TTr-DA',
        superiorAgency: existingAdmin.superiorAgency || 'UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG',
        consultantUnit: existingAdmin.consultantUnit || settings.contractor || 'Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam',
        investorUnit: existingAdmin.investorUnit || settings.investor || 'Ban Quản lý Dự án Đầu tư Xây dựng',
        appraisalUnit: existingAdmin.appraisalUnit || 'Sở Xây dựng / Chi cục Giám định Xây dựng',
        creatorName: existingAdmin.creatorName || 'KS. Nguyễn Văn An',
        creatorTitle: existingAdmin.creatorTitle || 'Kỹ sư Định giá Xây dựng',
        chiefEngineer: existingAdmin.chiefEngineer || 'ThS. Trần Quốc Bảo',
        chiefEngineerTitle: existingAdmin.chiefEngineerTitle || 'Chủ trì Lập dự toán',
        approverName: existingAdmin.approverName || 'TS. Lê Hoàng Nam',
        approverTitle: existingAdmin.approverTitle || 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN',
        signDatePlace: existingAdmin.signDatePlace || `${settings.locationProvince || 'Hà Nội'}, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
        nationalHeaderLine1: existingAdmin.nationalHeaderLine1 || 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        nationalHeaderLine2: existingAdmin.nationalHeaderLine2 || 'Độc lập - Tự do - Hạnh phúc',
        paperOrientation: existingAdmin.paperOrientation || 'landscape',
        showSignatures: existingAdmin.showSignatures !== false
      }
    };
  });

  if (!isOpen) return null;

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
    onSaveSettings(formData);
    onClose();
  };

  const admin = formData.adminReportConfig || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[92vh] flex flex-col text-xs text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/40">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <span>CẤU HÌNH DỰ ÁN & MẪU IN ẤN HÀNH CHÍNH NHÀ NƯỚC</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Tùy biến tham số kỹ thuật, hệ số định mức TT12/TT11 và tiêu đề, đơn vị theo Nghị định 30/2020/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              PDF Mới
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'technical' ? (
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
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium"
                    >
                      <option value="by_scale">Nội suy tự động theo tổng quy mô trực tiếp (T)</option>
                      <option value="by_category">Phân bổ tự động theo từng hạng mục công trình</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800 text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.indirectCostConfig?.isLineProject)}
                        onChange={(e) => setFormData({
                          ...formData,
                          indirectCostConfig: {
                            ...(formData.indirectCostConfig || { enabledAuto: true, method: 'by_scale', isLineProject: false }),
                            isLineProject: e.target.checked
                          }
                        })}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>Công trình theo tuyến (Nhà tạm 2.2% thay vì 1.2%)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tự động lưu trữ dự án (Auto-Save LocalStorage) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-blue-100 text-blue-700 rounded">
                      <Save className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <span>Tự động lưu dự án vào bộ nhớ LocalStorage (Auto-Save)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-blue-100 text-blue-800">
                          {formData.autoSaveConfig?.enabled !== false ? 'Đang bật' : 'Đang tắt'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Định kỳ tự động lưu trạng thái công trình vào LocalStorage trình duyệt để chống mất dữ liệu khi mất điện hoặc vô tình đóng tab.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.autoSaveConfig?.enabled !== false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          autoSaveConfig: {
                            ...(prev.autoSaveConfig || { intervalMinutes: 5 }),
                            enabled: isChecked
                          }
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.autoSaveConfig?.enabled !== false && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2 animate-in fade-in duration-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <label className="text-[11px] font-semibold text-slate-700">
                        Chu kỳ tự động lưu:
                      </label>
                      <select
                        value={formData.autoSaveConfig?.intervalMinutes || 5}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 5;
                          setFormData(prev => ({
                            ...prev,
                            autoSaveConfig: {
                              ...(prev.autoSaveConfig || { enabled: true }),
                              intervalMinutes: val
                            }
                          }));
                        }}
                        className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={1}>Mỗi 1 phút (Liên tục)</option>
                        <option value={2}>Mỗi 2 phút</option>
                        <option value={5}>Mỗi 5 phút (Khuyến nghị)</option>
                        <option value={10}>Mỗi 10 phút</option>
                        <option value={15}>Mỗi 15 phút</option>
                      </select>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Phím tắt lưu thủ công: <strong className="text-slate-700 bg-slate-200 px-1 py-0.5 rounded">F4</strong>
                    </div>
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
          ) : (
            /* TAB 2: CẤU HÌNH MẪU IN HÀNH CHÍNH NHÀ NƯỚC (NĐ 30/2020/NĐ-CP) */
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
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="landscape">A4 Ngang (Khuyến nghị cho bảng tính nhiều cột số liệu)</option>
                      <option value="portrait">A4 Dọc (Chuẩn văn bản báo cáo hành chính thông thường)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Cơ quan chủ quản & Đơn vị thực hiện */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Thông tin Các Đơn vị Tham gia Dự án</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cơ quan chủ quản cấp trên (Góc trên bên trái):
                    </label>
                    <input
                      type="text"
                      value={admin.superiorAgency || ''}
                      onChange={(e) => updateAdminConfig({ superiorAgency: e.target.value })}
                      placeholder="VD: UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-medium uppercase focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Đơn vị Chủ đầu tư / Ban quản lý dự án:
                    </label>
                    <input
                      type="text"
                      value={admin.investorUnit || ''}
                      onChange={(e) => updateAdminConfig({ investorUnit: e.target.value })}
                      placeholder="VD: Ban Quản lý Dự án Đầu tư Xây dựng Hà Nội"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Đơn vị Tư vấn Lập dự toán (Đơn vị thực hiện):
                    </label>
                    <input
                      type="text"
                      value={admin.consultantUnit || ''}
                      onChange={(e) => updateAdminConfig({ consultantUnit: e.target.value })}
                      placeholder="VD: Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Cơ quan / Đơn vị Thẩm định / Thẩm tra (nếu có):
                    </label>
                    <input
                      type="text"
                      value={admin.appraisalUnit || ''}
                      onChange={(e) => updateAdminConfig({ appraisalUnit: e.target.value })}
                      placeholder="VD: Chi cục Giám định Xây dựng / Phòng Kinh tế Xây dựng"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Nhóm 3: Khối chữ ký hành chính */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>3. Thông tin Nhân sự Ký duyệt Hồ sơ (Hành chính Nhà nước)</span>
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={admin.showSignatures !== false}
                      onChange={(e) => updateAdminConfig({ showSignatures: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                    />
                    <span className="font-semibold">Hiển thị khối chữ ký cuối văn bản</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Người lập */}
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-800 uppercase text-center border-b pb-1">
                      NGƯỜI LẬP BIỂU
                    </div>
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
                      <label className="block text-[10px] text-slate-500 mb-0.5">Chức danh:</label>
                      <input
                        type="text"
                        value={admin.creatorTitle || ''}
                        onChange={(e) => updateAdminConfig({ creatorTitle: e.target.value })}
                        placeholder="VD: Kỹ sư Định giá Xây dựng"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Chủ trì thiết kế */}
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-800 uppercase text-center border-b pb-1">
                      CHỦ TRÌ / CHỦ NHIỆM
                    </div>
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
                      <label className="block text-[10px] text-slate-500 mb-0.5">Chức danh:</label>
                      <input
                        type="text"
                        value={admin.chiefEngineerTitle || ''}
                        onChange={(e) => updateAdminConfig({ chiefEngineerTitle: e.target.value })}
                        placeholder="VD: Chủ nhiệm Lập dự toán"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Đại diện duyệt */}
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-800 uppercase text-center border-b pb-1">
                      ĐẠI DIỆN PHÊ DUYỆT
                    </div>
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 italic">
              * Dữ liệu cấu hình sẽ được lưu vào phiên làm việc và đồng bộ tự động khi xuất PDF / Excel.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>LƯU CẤU HÌNH DỰ ÁN</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
