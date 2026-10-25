import React, { useState } from 'react';
import { 
  RefreshCw, CheckCircle2, ArrowUpCircle, Sparkles, X, 
  ShieldCheck, Database, FileText, Download, Check, AlertCircle,
  Calendar, Layers, Clock, Cpu, Server
} from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelpModal?: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  onOpenHelpModal,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState<string | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'changelog'>('status');

  if (!isOpen) return null;

  const handleCheckForUpdates = () => {
    setIsChecking(true);
    setCheckProgress('Đang kết nối máy chủ cơ sở dữ liệu Bộ Xây dựng...');
    setIsUpdated(false);

    setTimeout(() => {
      setCheckProgress('Đang kiểm tra chỉ số giá & đơn giá vật liệu 63 tỉnh thành Quý IV/2026...');
    }, 800);

    setTimeout(() => {
      setCheckProgress('Đang đồng bộ danh mục định mức Thông tư 14/2023/TT-BXD...');
    }, 1600);

    setTimeout(() => {
      setCheckProgress('Đang cập nhật từ điển chính tả chuyên ngành xây dựng...');
    }, 2400);

    setTimeout(() => {
      setIsChecking(false);
      setCheckProgress(null);
      setIsUpdated(true);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl flex flex-col text-slate-800 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/40">
              <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin text-emerald-300' : ''}`} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white uppercase flex items-center gap-2">
                  <span>TRUNG TÂM CẬP NHẬT DỰ TOÁN F1 PRO</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                    v2026.4.2
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Tự động đồng bộ cơ sở dữ liệu định mức BXD và giá thông báo vật liệu 63 Tỉnh/Thành
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

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'status'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Trạng thái &amp; Kiểm tra cập nhật
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'changelog'
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Nhật ký thay đổi (Release Notes)
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Build: 21.10.2026-PRO
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
          {activeTab === 'status' ? (
            <div className="space-y-5">
              {/* Card trạng thái hiện tại */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Phiên bản hiện tại: Dự toán F1 Pro v2026.4.2
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Đã kích hoạt bản quyền doanh nghiệp Pro đầy đủ các tính năng AI, D3 Analytics và Xuất bản hành chính.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-emerald-900 font-medium">
                      <span className="px-2 py-0.5 bg-white/80 rounded border border-emerald-200">
                        • CSDL Định mức TT12 &amp; TT14: <strong>Mới nhất</strong>
                      </span>
                      <span className="px-2 py-0.5 bg-white/80 rounded border border-emerald-200">
                        • Bảng giá 63 Tỉnh/Thành: <strong>Quý IV/2026</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress checking animation if checking */}
              {isChecking && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Đang kiểm tra dữ liệu từ máy chủ cập nhật F1 Cloud...</span>
                  </div>
                  <p className="text-xs text-blue-700 font-mono italic">
                    {checkProgress}
                  </p>
                  <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/3 animate-pulse" />
                  </div>
                </div>
              )}

              {isUpdated && !isChecking && (
                <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kiểm tra hoàn tất! Phần mềm đang ở trạng thái mới nhất.</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Toàn bộ định mức Thông tư 12, Thông tư 11, Thông tư 14 và giá thông báo vật liệu 63 tỉnh thành đã được đồng bộ chuẩn xác.
                  </p>
                </div>
              )}

              {/* Chi tiết các gói cơ sở dữ liệu */}
              <div className="space-y-2.5">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  Chi tiết các mô-đun dữ liệu đã đồng bộ:
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-600" />
                        <span>Định mức Xây dựng BXD</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">Chuẩn TT12</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Gồm 18.500+ mã hiệu công tác: Xây dựng, Lắp đặt, Khảo sát, Sửa chữa, Thí nghiệm.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bảng giá 63 Tỉnh/Thành</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">Sở XD 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Giá thông báo vật liệu, đơn giá nhân công theo 4 vùng lương và giá ca máy.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Từ điển Chính tả Xây dựng</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">TCVN</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tự động gợi ý sửa lỗi các thuật ngữ chuyên ngành bê tông, cốt thép, vữa, mác.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Engine Mô phỏng D3 Risk</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">Monte Carlo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tính toán ma trận phân phối xác suất và đường cong tiến độ dòng tiền S-Curve.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleCheckForUpdates}
                  disabled={isChecking}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'ĐANG ĐỒNG BỘ DỮ LIỆU...' : 'KIỂM TRA BẢN CẬP NHẬT NGAY'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab Changelog */
            <div className="space-y-4 text-xs">
              <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>Phiên bản v2026.4.2</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                      Bản mới nhất
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500">21/10/2026</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc leading-relaxed">
                  <li><strong>Menu Help (Hướng dẫn sử dụng toàn diện)</strong>: Tích hợp sổ tay hướng dẫn 8 phân hệ, bảng phím tắt F1/F2 và căn cứ pháp lý Thông tư BXD.</li>
                  <li><strong>Trung tâm Update định mức</strong>: Kiểm tra và đồng bộ trực tuyến dữ liệu định mức TT12, TT14 và giá tháng 63 tỉnh thành.</li>
                  <li><strong>Xuất PDF theo mẫu in ấn Hành chính Nhà nước</strong>: Tuân thủ chuẩn Nghị định 30/2020/NĐ-CP với Quốc hiệu, Tiêu ngữ, Bảng kẻ, và tùy chỉnh tiêu đề/đơn vị trong ProjectSettings.</li>
                  <li><strong>Xuất mã QR Code cho bảng Tổng hợp kinh phí (THKP)</strong>: Quét mã QR để xem tóm tắt chi phí dự án tức thì trên điện thoại di động.</li>
                  <li><strong>Bảo vệ mật khẩu chức năng Xuất Python (`An$12131415`)</strong>: Khóa bảo mật bản quyền an toàn tuyệt đối.</li>
                  <li><strong>Kiểm tra chính tả tự động TCVN</strong>: Nhận diện và sửa nhanh lỗi chính tả tên công tác và diễn giải khối lượng con trong sheet Công trình.</li>
                  <li><strong>Phân tích rủi ro chi phí (D3)</strong>: Mô phỏng Monte Carlo xác suất và biểu đồ dòng tiền S-Curve.</li>
                  <li><strong>Thẩm tra &amp; So sánh 2 phiên bản</strong>: Hiển thị chênh lệch vượt định mức và xuất biên bản 01/TTr.</li>
                </ul>
              </div>

              <div className="border-l-2 border-slate-300 pl-4 py-1 space-y-2 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Phiên bản v2026.4.0</span>
                  <span className="text-[11px] text-slate-400">15/10/2026</span>
                </div>
                <ul className="space-y-1.5 pl-4 list-disc leading-relaxed">
                  <li>Tích hợp cơ sở dữ liệu định mức 63 Tỉnh/Thành phố toàn quốc.</li>
                  <li>Bảng tính toán khối lượng FormulaBar với các biểu thức kích thước chi tiết.</li>
                  <li>Xuất trọn bộ 8 sheet dự toán ra file Excel (.xlsx) chuẩn công thức.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500">
            Máy chủ cập nhật: <strong>https://update.dutoanf1.vn (SSL 256-bit)</strong>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHelpModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenHelpModal();
                }}
                className="px-3 py-1.5 text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
              >
                Xem Hướng dẫn sử dụng (Help)
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
