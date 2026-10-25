import React, { useState } from 'react';
import { 
  FolderKanban, 
  X, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  Edit3, 
  Building2, 
  Truck, 
  Factory, 
  Droplets, 
  Search, 
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Coins,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { ProjectInstance } from '../data/multiProjectPresets';
import { ProjectType } from '../types/estimate';

interface MultiProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectInstance[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCloseProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onOpenSampleProject: (type: 'civil' | 'transport' | 'industrial' | 'infrastructure') => void;
  onRenameProject: (projectId: string, newName: string) => void;
}

export const MultiProjectManagerModal: React.FC<MultiProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCloseProject,
  onCreateNewProject,
  onDuplicateProject,
  onOpenSampleProject,
  onRenameProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.settings.locationProvince.toLowerCase().includes(q) ||
      p.settings.projectType?.toLowerCase().includes(q)
    );
  });

  const getTypeName = (type?: ProjectType) => {
    switch (type) {
      case 'transport': return 'Công trình Giao thông';
      case 'industrial': return 'Công trình Công nghiệp';
      case 'infrastructure': return 'Hạ tầng kỹ thuật';
      case 'civil':
      default:
        return 'Công trình Dân dụng';
    }
  };

  const getTypeIcon = (type?: ProjectType) => {
    switch (type) {
      case 'transport': return <Truck className="w-4 h-4 text-amber-500" />;
      case 'industrial': return <Factory className="w-4 h-4 text-blue-500" />;
      case 'infrastructure': return <Droplets className="w-4 h-4 text-cyan-500" />;
      case 'civil':
      default:
        return <Building2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const calculateProjectCost = (project: ProjectInstance) => {
    return project.items.reduce((sum, item) => {
      const unitTotal = (item.unitPriceMaterial || 0) + (item.unitPriceLabor || 0) + (item.unitPriceMachine || 0);
      return sum + (item.quantity * unitTotal);
    }, 0);
  };

  const handleStartRename = (project: ProjectInstance) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleSaveRename = (projectId: string) => {
    if (editName.trim()) {
      onRenameProject(projectId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl h-[85vh] flex flex-col text-slate-800 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <FolderKanban className="w-5 h-5 text-red-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-tight text-white uppercase">
                  TRUNG TÂM QUẢN LÝ ĐA DỰ ÁN (MULTI-PROJECT WORKSPACE)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono font-bold border border-slate-700">
                  {projects.length} dự án đang mở
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Làm việc đồng thời trên nhiều công trình, chuyển đổi tức thì không gián đoạn, sao lưu độc lập
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

        {/* Toolbar: Search & Action presets */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên công trình, tỉnh thành..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCreateNewProject();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo dự án mới (Trống)</span>
            </button>

            <button
              onClick={() => onDuplicateProject(activeProjectId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Tạo bản sao dự án đang mở"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Nhân bản dự án này</span>
            </button>
          </div>
        </div>

        {/* Sample Projects Quick Launcher Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Thêm mẫu BXD:
          </span>
          <button
            onClick={() => onOpenSampleProject('civil')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-md transition-colors shrink-0"
          >
            <Building2 className="w-3 h-3 text-emerald-600" />
            <span>Dân dụng (Hà Nội)</span>
          </button>
          <button
            onClick={() => onOpenSampleProject('transport')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-300 rounded-md transition-colors shrink-0"
          >
            <Truck className="w-3 h-3 text-amber-600" />
            <span>Giao thông (TP.HCM)</span>
          </button>
          <button
            onClick={() => onOpenSampleProject('industrial')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-md transition-colors shrink-0"
          >
            <Factory className="w-3 h-3 text-blue-600" />
            <span>Công nghiệp (Bình Dương)</span>
          </button>
          <button
            onClick={() => onOpenSampleProject('infrastructure')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 rounded-md transition-colors shrink-0"
          >
            <Droplets className="w-3 h-3 text-cyan-600" />
            <span>Hạ tầng (Đà Nẵng)</span>
          </button>
        </div>

        {/* Project Table List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredProjects.map((project) => {
            const isActive = project.id === activeProjectId;
            const cost = calculateProjectCost(project);
            const isEditing = editingId === project.id;
            const isConfirming = confirmDeleteId === project.id;

            return (
              <div
                key={project.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Project Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg">
                      {getTypeIcon(project.settings.projectType)}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          autoFocus
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(project.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="bg-white border border-blue-500 rounded px-2 py-1 text-xs font-bold text-slate-900 w-full max-w-md focus:outline-hidden"
                        />
                        <button
                          onClick={() => handleSaveRename(project.id)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-500 cursor-pointer"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate" title={project.name}>
                          {project.name}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                            Đang mở
                          </span>
                        )}
                        <button
                          onClick={() => handleStartRename(project)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Đổi tên công trình"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{project.settings.locationProvince} (Vùng {project.settings.salaryRegion})</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>{project.categories.length} hạng mục • {project.items.length} công tác</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium text-slate-900">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Chi phí trực tiếp: <strong className="font-mono text-emerald-600">{cost.toLocaleString('vi-VN')} đ</strong></span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {getTypeName(project.settings.projectType)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isActive && (
                    <button
                      onClick={() => {
                        onSelectProject(project.id);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Kích hoạt dự án này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onDuplicateProject(project.id)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                    title="Nhân bản dự án này"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {projects.length > 1 && (
                    <>
                      {isConfirming ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 rounded-lg p-1">
                          <span className="text-[10px] text-rose-700 font-medium px-1">Đóng dự án?</span>
                          <button
                            onClick={() => {
                              onCloseProject(project.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-500"
                          >
                            Đóng
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(project.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                          title="Đóng dự án"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span>Mỗi dự án lưu trữ trạng thái độc lập và được tự động đồng bộ vào bộ nhớ LocalStorage.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
