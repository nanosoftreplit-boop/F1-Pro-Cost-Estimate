import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileCheck2, 
  Info,
  FolderPlus,
  RefreshCw,
  Layers
} from 'lucide-react';
import { WorkItem } from '../types/estimate';
import { parseExcelFile, exportSampleExcelTemplate } from '../utils/excelExport';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportItems: (items: Partial<WorkItem>[], mode: 'append' | 'replace' | 'new_project', fileName?: string) => void;
  onDownloadSampleTemplate?: () => void;
  currentProjectName: string;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportItems,
  onDownloadSampleTemplate = exportSampleExcelTemplate,
  currentProjectName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<Partial<WorkItem>[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace' | 'new_project'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setErrorMsg(null);
    try {
      const res = await parseExcelFile(file);
      if (res.items && res.items.length > 0) {
        setParsedItems(res.items);
      } else {
        setErrorMsg('Không tìm thấy dòng công tác hợp lệ trong file. Vui lòng tải file mẫu bên dưới để kiểm tra cấu trúc cột.');
        setParsedItems([]);
      }
    } catch (err: any) {
      setErrorMsg(`Lỗi khi đọc file Excel: ${err?.message || 'Không thể giải mã dữ liệu'}. Hãy đảm bảo file đúng định dạng .xlsx hoặc .xls.`);
      setParsedItems([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedItems.length === 0) return;
    onImportItems(parsedItems, importMode, selectedFile?.name.replace(/\.[^/.]+$/, ''));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/40">
              <Upload className="w-5 h-5 text-sky-400" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-white uppercase flex items-center gap-2">
                <span>NHẬP DỮ LIỆU CÔNG TRÌNH TỪ FILE EXCEL (.XLSX)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
                  Import Chuẩn Hóa
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Nạp tự động danh mục công tác, khối lượng và đơn giá từ bảng tính Excel vào dự toán F1 Pro
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Template Standard & Download */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-tight">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>FILE EXCEL MẪU CHUẨN ĐẦU VÀO BỘ XÂY DỰNG</span>
                </div>
                <p className="text-[11.5px] text-emerald-900 leading-relaxed">
                  Để dữ liệu nạp vào chính xác 100%, bạn có thể tải file Excel mẫu đã định dạng sẵn 8 cột chuẩn (Mã hiệu, Tên công tác, Đơn vị, Khối lượng...).
                </p>
              </div>

              <button
                type="button"
                onClick={onDownloadSampleTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 active:scale-95"
                title="Tải ngay file Excel mẫu chuẩn (.xlsx) về máy tính"
              >
                <Download className="w-4 h-4 text-emerald-100" />
                <span>Tải mẫu Excel (.xlsx)</span>
              </button>
            </div>

            {/* Column Structure Mini Preview */}
            <div className="bg-white rounded-lg border border-emerald-200 overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-100/60 text-emerald-900 border-b border-emerald-200 font-bold">
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-10 text-center">STT</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-24">Mã hiệu (*)</th>
                    <th className="py-1.5 px-3 border-r border-emerald-200">Tên công tác &amp; quy cách (*)</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-16">Đơn vị (*)</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-20 text-right">Khối lượng (*)</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-24 text-right">Đơn giá VL</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-24 text-right">Đơn giá NC</th>
                    <th className="py-1.5 px-2 border-r border-emerald-200 w-24 text-right">Đơn giá Máy</th>
                    <th className="py-1.5 px-2 w-24">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[10.5px]">
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2 text-center text-slate-400">1</td>
                    <td className="py-1 px-2 font-bold text-blue-700">AB.21121</td>
                    <td className="py-1 px-3 font-sans">Đào hố móng cột độc lập, sâu &lt;= 1m, đất cấp II</td>
                    <td className="py-1 px-2">m3</td>
                    <td className="py-1 px-2 text-right font-bold text-emerald-700">68.4</td>
                    <td className="py-1 px-2 text-right text-slate-500">0</td>
                    <td className="py-1 px-2 text-right text-slate-500">245.000</td>
                    <td className="py-1 px-2 text-right text-slate-500">45.000</td>
                    <td className="py-1 px-2 font-sans text-slate-400">Móng M1</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-2 text-center text-slate-400">2</td>
                    <td className="py-1 px-2 font-bold text-blue-700">AF.12210</td>
                    <td className="py-1 px-3 font-sans">Bê tông móng đá 1x2 mác 200, vữa XM PC40</td>
                    <td className="py-1 px-2">m3</td>
                    <td className="py-1 px-2 text-right font-bold text-emerald-700">38.5</td>
                    <td className="py-1 px-2 text-right text-slate-500">1.365.000</td>
                    <td className="py-1 px-2 text-right text-slate-500">210.000</td>
                    <td className="py-1 px-2 text-right text-slate-500">75.000</td>
                    <td className="py-1 px-2 font-sans text-slate-400">Thân BTCT</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>(*) Các cột bắt buộc tối thiểu: <strong>Mã hiệu, Tên công tác, Đơn vị, Khối lượng</strong>. Các cột đơn giá nếu để trống sẽ tự động tra cứu từ định mức TT12.</span>
            </div>
          </div>

          {/* Section 2: Upload Zone */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>CHỌN HOẶC KÉO THẢ FILE EXCEL CẦN NHẬP:</span>
            </h4>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-blue-50/40 space-y-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <span className="font-bold text-sm text-slate-800">
                  {selectedFile ? selectedFile.name : 'Bấm vào đây để chọn file Excel (.xlsx, .xls)'}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">hoặc kéo thả file từ máy tính vào khung này</p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-xs font-mono text-slate-700">
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span>{isParsing ? 'Đang đọc...' : `${parsedItems.length} công tác`}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Section 3: Preview & Options (if file loaded) */}
          {parsedItems.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900">
                    KẾT QUẢ ĐỌC FILE: <strong className="text-emerald-700">{parsedItems.length}</strong> công tác hợp lệ
                  </span>
                </div>

                <span className="text-[11px] text-slate-500">
                  Hiển thị xem trước 5 dòng đầu tiên
                </span>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto text-[11px] max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b">
                    <tr>
                      <th className="py-1.5 px-2 text-center w-10">STT</th>
                      <th className="py-1.5 px-2 w-24">Mã hiệu</th>
                      <th className="py-1.5 px-3">Tên công tác</th>
                      <th className="py-1.5 px-2 w-16">ĐVT</th>
                      <th className="py-1.5 px-2 w-20 text-right">Khối lượng</th>
                      <th className="py-1.5 px-2 w-24 text-right">Giá VL</th>
                      <th className="py-1.5 px-2 w-24 text-right">Giá NC</th>
                      <th className="py-1.5 px-2 w-24 text-right">Giá Máy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 text-[10.5px]">
                    {parsedItems.slice(0, 5).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1 px-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-1 px-2 font-mono font-bold text-blue-600">{item.code}</td>
                        <td className="py-1 px-3 truncate max-w-[280px]">{item.name}</td>
                        <td className="py-1 px-2 font-mono">{item.unit}</td>
                        <td className="py-1 px-2 text-right font-mono font-bold text-emerald-700">{item.quantity}</td>
                        <td className="py-1 px-2 text-right font-mono text-slate-600">{(item.unitPriceMaterial || 0).toLocaleString('vi-VN')}</td>
                        <td className="py-1 px-2 text-right font-mono text-slate-600">{(item.unitPriceLabor || 0).toLocaleString('vi-VN')}</td>
                        <td className="py-1 px-2 text-right font-mono text-slate-600">{(item.unitPriceMachine || 0).toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Destination Options */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs text-slate-900 block">
                  LỰA CHỌN PHƯƠNG THỨC NẠP DỮ LIỆU:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <label className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                    importMode === 'replace'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs">Thay thế công tác hiện tại</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Xóa các công việc cũ của "{currentProjectName}" và nạp danh sách mới này</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                    importMode === 'append'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="font-bold text-xs">Nối tiếp vào sau</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Giữ nguyên công tác cũ, chèn thêm các công tác này vào cuối bảng</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                    importMode === 'new_project'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="new_project"
                      checked={importMode === 'new_project'}
                      onChange={() => setImportMode('new_project')}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1 text-emerald-800">
                        <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tạo thành Dự án mới</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Mở thêm một tab dự án riêng biệt trong Không gian Đa Dự Án</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <button
            type="button"
            onClick={onDownloadSampleTemplate}
            className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file Excel mẫu (.xlsx)</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              disabled={parsedItems.length === 0 || isParsing}
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Nạp {parsedItems.length} công tác vào dự toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
