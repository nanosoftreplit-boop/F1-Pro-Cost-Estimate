import React, { useState } from 'react';
import { GanttTask, ProjectSettings } from '../types/estimate';
import { Plus, Trash2, Calendar, Users, CheckCircle2, Clock } from 'lucide-react';

interface TienDoGanttSheetProps {
  tasks: GanttTask[];
  settings: ProjectSettings;
  onUpdateTask: (id: string, patch: Partial<GanttTask>) => void;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
}

export const TienDoGanttSheet: React.FC<TienDoGanttSheetProps> = ({
  tasks,
  settings,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}) => {
  // Tìm khoảng thời gian tổng thể (min date, max date)
  let minDate = new Date('2026-03-01').getTime();
  let maxDate = new Date('2026-07-15').getTime();

  tasks.forEach(t => {
    const s = new Date(t.startDate).getTime();
    const e = new Date(t.endDate).getTime();
    if (!isNaN(s) && s < minDate) minDate = s;
    if (!isNaN(e) && e > maxDate) maxDate = e;
  });

  const totalTimeSpan = maxDate - minDate;

  // Tính tổng tiến độ hoàn thành chung
  const totalTasks = tasks.length || 1;
  const overallProgress = tasks.reduce((sum, t) => sum + (t.progressPercent || 0), 0) / totalTasks;
  const maxWorkers = Math.max(...tasks.map(t => t.workersRequired || 0), 30);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Top Gantt Summary & Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm công tác tiến độ</span>
          </button>
          <span className="text-[11px] text-slate-500">
            Sơ đồ Gantt & Biểu đồ điều phối nhân lực phục vụ thi công
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Tiến độ tổng thể:</span>
            <div className="w-28 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <strong className="text-blue-700">{overallProgress.toFixed(1)}%</strong>
          </div>
          <div className="pl-3 border-l border-slate-300 text-slate-600">
            Tổng thời gian thi công: <strong>127 ngày</strong>
          </div>
        </div>
      </div>

      {/* Main Split: Task Grid (Left) + Gantt Timeline (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Table: Task Details */}
        <div className="w-1/2 border-r border-slate-300 flex flex-col overflow-auto">
          <table className="w-full border-collapse border border-slate-300 table-auto select-text">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="border-b border-slate-300">
                <th className="f1-header-cell w-10">STT</th>
                <th className="f1-header-cell min-w-[200px] text-left px-3">Tên công tác thi công</th>
                <th className="f1-header-cell w-24">Bắt đầu</th>
                <th className="f1-header-cell w-24">Kết thúc</th>
                <th className="f1-header-cell w-16">Ngày</th>
                <th className="f1-header-cell w-24">Tiến độ %</th>
                <th className="f1-header-cell w-16">Nhân lực</th>
                <th className="f1-header-cell w-12">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="f1-cell text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="f1-cell px-3">
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => onUpdateTask(task.id, { name: e.target.value })}
                      className="w-full bg-transparent focus:bg-white focus:outline-hidden px-1 py-0.5 rounded font-medium text-slate-800"
                    />
                  </td>
                  <td className="f1-cell text-center font-mono">
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(e) => onUpdateTask(task.id, { startDate: e.target.value })}
                      className="bg-transparent focus:bg-white focus:outline-hidden text-[11px] text-slate-700"
                    />
                  </td>
                  <td className="f1-cell text-center font-mono">
                    <input
                      type="date"
                      value={task.endDate}
                      onChange={(e) => onUpdateTask(task.id, { endDate: e.target.value })}
                      className="bg-transparent focus:bg-white focus:outline-hidden text-[11px] text-slate-700"
                    />
                  </td>
                  <td className="f1-cell text-center font-mono text-slate-700">
                    <input
                      type="number"
                      value={task.durationDays}
                      onChange={(e) => onUpdateTask(task.id, { durationDays: parseInt(e.target.value) || 1 })}
                      className="w-12 text-center bg-transparent focus:bg-white focus:outline-hidden font-mono"
                    />
                  </td>
                  <td className="f1-cell text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progressPercent}
                        onChange={(e) => onUpdateTask(task.id, { progressPercent: parseInt(e.target.value) || 0 })}
                        className="w-14 accent-blue-600"
                      />
                      <span className="font-mono text-[11px] font-semibold text-blue-700 w-8 text-right">
                        {task.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="f1-cell text-center font-mono font-medium text-slate-700">
                    <input
                      type="number"
                      value={task.workersRequired}
                      onChange={(e) => onUpdateTask(task.id, { workersRequired: parseInt(e.target.value) || 0 })}
                      className="w-10 text-center bg-transparent focus:bg-white focus:outline-hidden font-mono"
                    />
                  </td>
                  <td className="f1-cell text-center">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panel: Interactive Gantt Chart Visualization */}
        <div className="w-1/2 flex flex-col overflow-auto bg-slate-50/50">
          <div className="p-3 bg-white border-b border-slate-200 font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Sơ đồ tiến độ ngang (Gantt Chart)</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Hoàn thành
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> Đang thi công
              </span>
            </div>
          </div>

          <div className="p-4 flex-1 space-y-3 overflow-y-auto">
            {tasks.map((task) => {
              const start = new Date(task.startDate).getTime();
              const end = new Date(task.endDate).getTime();
              const leftPercent = Math.max(0, Math.min(100, ((start - minDate) / totalTimeSpan) * 100));
              const widthPercent = Math.max(5, Math.min(100 - leftPercent, ((end - start) / totalTimeSpan) * 100));
              const isCompleted = task.progressPercent === 100;

              return (
                <div key={task.id} className="group">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span className="font-medium truncate max-w-[280px] text-slate-800">{task.name}</span>
                    <span className="font-mono text-slate-500 text-[10px]">
                      {task.startDate} → {task.endDate} ({task.durationDays} ngày)
                    </span>
                  </div>

                  {/* Gantt Bar track */}
                  <div className="h-6 bg-slate-200/80 rounded relative overflow-hidden border border-slate-300">
                    <div
                      className={`absolute top-0 bottom-0 rounded transition-all shadow-xs flex items-center px-2 text-[10px] text-white font-bold ${
                        isCompleted ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      {/* Inner progress fill */}
                      <div
                        className="absolute inset-0 bg-white/20"
                        style={{ width: `${task.progressPercent}%` }}
                      />
                      <span className="relative z-10 truncate font-mono">
                        {task.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Biểu đồ huy động nhân lực dưới chân */}
            <div className="mt-8 pt-4 border-t border-slate-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Biểu đồ huy động nhân lực (Công nhân/ngày)</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Cao điểm: {maxWorkers} thợ</span>
              </div>
              <div className="h-20 bg-white border border-slate-300 rounded p-2 flex items-end gap-1.5">
                {tasks.map((task, i) => {
                  const barHeight = (task.workersRequired / maxWorkers) * 100;
                  return (
                    <div key={task.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full bg-amber-500 hover:bg-amber-600 rounded-t transition-all"
                        style={{ height: `${Math.max(10, barHeight)}%` }}
                        title={`${task.name}: ${task.workersRequired} công nhân`}
                      />
                      <span className="text-[9px] text-slate-400 font-mono">T{i+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
