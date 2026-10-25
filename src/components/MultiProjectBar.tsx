import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  X, 
  FolderKanban, 
  Building2, 
  Layers, 
  MapPin, 
  Copy, 
  ChevronDown, 
  Edit3, 
  Check, 
  ExternalLink,
  Sparkles,
  HardHat,
  Truck,
  Factory,
  Droplets,
  Library
} from 'lucide-react';
import { ProjectInstance } from '../data/multiProjectPresets';
import { ProjectType } from '../types/estimate';

interface MultiProjectBarProps {
  projects: ProjectInstance[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCloseProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onOpenSampleProject: (type: 'civil' | 'transport' | 'industrial' | 'infrastructure') => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onOpenProjectManager: () => void;
}

export const MultiProjectBar: React.FC<MultiProjectBarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCloseProject,
  onCreateNewProject,
  onDuplicateProject,
  onOpenSampleProject,
  onRenameProject,
  onOpenProjectManager,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProjectIcon = (type?: ProjectType) => {
    switch (type) {
      case 'transport':
        return <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'industrial':
        return <Factory className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'infrastructure':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'civil':
      default:
        return <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const handleStartRename = (project: ProjectInstance, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditingName(project.name);
  };

  const handleSaveRename = (projectId: string) => {
    if (editingName.trim()) {
      onRenameProject(projectId, editingName.trim());
    }
    setEditingProjectId(null);
  };

  return (
    <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs flex items-center justify-between px-2 pt-1 select-none shrink-0 relative z-30">
      {/* Project Tabs list */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[80vw]">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:flex">
          <FolderKanban className="w-3.5 h-3.5 text-red-500" />
          <span>Dự án mở ({projects.length}):</span>
        </div>

        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const isEditing = editingProjectId === project.id;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg transition-all cursor-pointer border-t-2 max-w-[280px] shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white border-red-500 font-semibold shadow-inner'
                  : 'bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 border-transparent'
              }`}
              title={`${project.name} • Tỉnh: ${project.settings.locationProvince} • ${project.items.length} công tác (Bấm để kích hoạt, bấm đúp để đổi tên)`}
              onDoubleClick={(e) => handleStartRename(project, e)}
            >
              {getProjectIcon(project.settings.projectType)}

              {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(project.id);
                      if (e.key === 'Escape') setEditingProjectId(null);
                    }}
                    onBlur={() => handleSaveRename(project.id)}
                    className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-xs border border-blue-500 focus:outline-hidden w-36"
                  />
                  <button
                    onClick={() => handleSaveRename(project.id)}
                    className="p-0.5 hover:text-emerald-400"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate max-w-[130px] sm:max-w-[170px] text-[11.5px]">
                    {project.name}
                  </span>
                  <span className={`text-[9.5px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-slate-800 text-amber-400' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {project.settings.locationProvince}
                  </span>
                </div>
              )}

              {/* Action buttons inside tab */}
              {!isEditing && (
                <div className="flex items-center gap-0.5 ml-1">
                  <button
                    onClick={(e) => handleStartRename(project, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white rounded hover:bg-slate-800 transition-opacity"
                    title="Đổi tên dự án"
                  >
                    <Edit3 className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseProject(project.id);
                      }}
                      className="p-0.5 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Đóng dự án này"
                    >
                      <X className="w-3 h-3 text-slate-400 hover:text-rose-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Quick Add Project Dropdown */}
        <div className="relative shrink-0" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-t-lg transition-colors cursor-pointer text-xs font-semibold"
            title="Mở thêm hoặc tạo dự án mới"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Mở thêm dự án</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isAddMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                THÊM DỰ ÁN VÀO KHÔNG GIAN LÀM VIỆC
              </div>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onCreateNewProject();
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="font-semibold text-emerald-300">Tạo dự án mới (Trống)</div>
                  <div className="text-[10px] text-slate-400">Khởi tạo dự án trắng để bóc tách khối lượng từ đầu</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onDuplicateProject(activeProjectId);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer border-b border-slate-800"
              >
                <span className="p-1.5 bg-blue-950 text-blue-400 rounded-lg border border-blue-800">
                  <Copy className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="font-semibold text-blue-300">Nhân bản dự án hiện tại</div>
                  <div className="text-[10px] text-slate-400">Tạo bản sao độc lập giữ nguyên toàn bộ số liệu</div>
                </div>
              </button>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                MỞ TỪ THƯ VIỆN MẪU BỘ XÂY DỰNG
              </div>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onOpenSampleProject('civil');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">1. Dân dụng: Tòa nhà Nanosoft Tower (Hà Nội)</span>
              </button>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onOpenSampleProject('transport');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">2. Giao thông: Tuyến đường đô thị 2.5km (TP.HCM)</span>
              </button>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onOpenSampleProject('industrial');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Factory className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">3. Công nghiệp: Nhà xưởng &amp; Kho 6.000m2 (Bình Dương)</span>
              </button>

              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onOpenSampleProject('infrastructure');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer border-b border-slate-800 pb-2"
              >
                <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">4. Hạ tầng: Cấp thoát nước đô thị (Đà Nẵng)</span>
              </button>

              <div className="p-1">
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenProjectManager();
                  }}
                  className="w-full text-center py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Library className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quản lý danh sách dự án (Chi tiết)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Project Manager Button */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={onOpenProjectManager}
          className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors text-[11px] font-medium cursor-pointer shadow-xs whitespace-nowrap"
          title="Xem danh sách quản lý tất cả các dự án, tổng kinh phí và xuất báo cáo"
        >
          <Library className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Quản lý Đa Dự Án</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-amber-300 rounded font-mono font-bold">
            {projects.length}
          </span>
        </button>
      </div>
    </div>
  );
};
