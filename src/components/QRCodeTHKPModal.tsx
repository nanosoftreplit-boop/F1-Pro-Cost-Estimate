import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { WorkItem, ProjectSettings, Category } from '../types/estimate';
import { computeTHKP, formatVND } from '../utils/calculator';
import { 
  QrCode, Download, Copy, Check, Smartphone, X, 
  Printer, Share2, ExternalLink, ShieldCheck, FileText,
  Building, MapPin, CheckCircle2, ChevronRight, Layers,
  Calendar, RefreshCw
} from 'lucide-react';

interface QRCodeTHKPModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
}

export type QRContentType = 'web_link' | 'plain_text';

export const QRCodeTHKPModal: React.FC<QRCodeTHKPModalProps> = ({
  isOpen,
  onClose,
  items,
  categories,
  settings,
}) => {
  const [contentType, setContentType] = useState<QRContentType>('web_link');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [qrColor, setQrColor] = useState<string>('#0f172a'); // Slate 900
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const thkp = useMemo(() => computeTHKP(items, settings, categories), [items, settings, categories]);

  // Tạo URL tóm tắt di động
  const mobileWebUrl = useMemo(() => {
    const summaryPayload = {
      project: settings.projectName,
      investor: settings.investor,
      province: settings.locationProvince,
      region: settings.salaryRegion,
      type: settings.projectType,
      grandTotal: thkp.grandTotal,
      directCost: thkp.directCostTotal,
      indirectCost: thkp.indirectCostTotal,
      taxableProfit: thkp.taxableProfit,
      preTaxTotal: thkp.preTaxTotal,
      vatAmount: thkp.vatAmount,
      contingency: thkp.contingencyCost,
      date: new Date().toLocaleDateString('vi-VN'),
    };
    try {
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(summaryPayload))));
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dutoanf1.vn';
      return `${origin}/?mobile_thkp=1&d=${b64}`;
    } catch {
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/?mobile_thkp=1`;
    }
  }, [settings, thkp]);

  // Tạo chuỗi văn bản tóm tắt Offline
  const plainTextSummary = useMemo(() => {
    return (
      `DỰ TOÁN F1 PRO - TỔNG HỢP KINH PHÍ CÔNG TRÌNH\n` +
      `Công trình: ${settings.projectName}\n` +
      `Chủ đầu tư: ${settings.investor}\n` +
      `Địa điểm: ${settings.locationProvince} (Vùng ${settings.salaryRegion})\n` +
      `Tiêu chuẩn: Thông tư 12/2021/TT-BXD & TT 11/2021/TT-BXD\n` +
      `-----------------------------------------\n` +
      `1. Chi phí trực tiếp (T):        ${formatVND(thkp.directCostTotal)} VNĐ\n` +
      `2. Chi phí gián tiếp (GT):       ${formatVND(thkp.indirectCostTotal)} VNĐ\n` +
      `3. Thu nhập tính trước (TL):     ${formatVND(thkp.taxableProfit)} VNĐ\n` +
      `4. Chi phí XD trước thuế (G):    ${formatVND(thkp.preTaxTotal)} VNĐ\n` +
      `5. Thuế GTGT (VAT 10%):          ${formatVND(thkp.vatAmount)} VNĐ\n` +
      `6. Chi phí XD sau thuế (Gxd):    ${formatVND(thkp.constructionTotal)} VNĐ\n` +
      `7. Chi phí dự phòng (5%):        ${formatVND(thkp.contingencyCost)} VNĐ\n` +
      `=========================================\n` +
      `>>> TỔNG MỨC ĐẦU TƯ: ${formatVND(thkp.grandTotal)} VNĐ\n` +
      `Thời điểm lập: ${new Date().toLocaleDateString('vi-VN')}`
    );
  }, [settings, thkp]);

  // Dữ liệu mã hóa vào QR
  const currentQRContent = contentType === 'web_link' ? mobileWebUrl : plainTextSummary;

  // Tạo hình ảnh QR Code bằng thư viện `qrcode`
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(currentQRContent, {
      width: 480,
      margin: 2,
      color: {
        dark: qrColor,
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR Code:', err));
  }, [currentQRContent, qrColor, isOpen]);

  if (!isOpen) return null;

  // Tải ảnh QR Code về máy
  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_THKP_${settings.projectName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sao chép liên kết tóm tắt
  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileWebUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Sao chép văn bản tóm tắt
  const handleCopyText = () => {
    navigator.clipboard.writeText(plainTextSummary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // In thẻ QR Code công trường (Badge A5/A6)
  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>XUẤT MÃ QR CODE TỔNG HỢP KINH PHÍ DỰ ÁN</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Quét Bằng Smartphone / Zalo
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Cho phép Ban Quản lý dự án, Chủ đầu tư và Chỉ huy trưởng quét mã xem nhanh tóm tắt chi phí mọi lúc mọi nơi
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

        {/* Format Selector Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Định dạng mã QR:</span>
            <div className="flex items-center p-0.5 bg-slate-200 rounded-lg">
              <button
                onClick={() => setContentType('web_link')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  contentType === 'web_link'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mở Trang Tóm Tắt Mobile Web</span>
              </button>
              <button
                onClick={() => setContentType('plain_text')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  contentType === 'plain_text'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Văn Bản Tóm Tắt Offline</span>
              </button>
            </div>
          </div>

          {/* Quick Color Themes */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Màu mã QR:</span>
            {[
              { label: 'Đen Slate', val: '#0f172a' },
              { label: 'Xanh Lá', val: '#047857' },
              { label: 'Xanh Dương', val: '#1d4ed8' },
              { label: 'Đỏ Đô', val: '#b91c1c' },
            ].map(c => (
              <button
                key={c.val}
                onClick={() => setQrColor(c.val)}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                  qrColor === c.val ? 'scale-110 border-slate-400 ring-2 ring-blue-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.val }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Body: 2 Columns - QR Code & Actions (Left) vs Smartphone Mockup Simulator (Right) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: QR Code Display & Quick Tools */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                MÃ QR CHÍNH THỨC DỰ ÁN
              </span>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                {settings.projectName}
              </h4>
              <p className="text-xs text-slate-500">
                {contentType === 'web_link'
                  ? 'Quét để tự động mở bảng điều khiển chi phí trên điện thoại'
                  : 'Quét để đọc trực tiếp bảng kê số liệu không cần kết nối Internet'}
              </p>
            </div>

            {/* QR Code Canvas Frame */}
            <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200 relative group flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Tổng hợp kinh phí"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 font-medium text-xs">
                  Đang khởi tạo mã QR...
                </div>
              )}
              {/* Center Logo Watermark Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-10 h-10 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white tracking-wider">
                  F1
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu số hóa xác thực theo Thông tư 11/2021/TT-BXD</span>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={handleDownloadQrPng}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Ảnh QR (.PNG)</span>
              </button>

              {contentType === 'web_link' ? (
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link web'}</span>
                </button>
              ) : (
                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Đã sao chép văn bản' : 'Sao chép tóm tắt'}</span>
                </button>
              )}

              <button
                onClick={handlePrintBadge}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>In Thẻ QR Dán Hồ Sơ / Công Trường (Khổ A5/A6)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Smartphone Simulator Mockup */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Giao diện hiển thị trên điện thoại khi quét mã:</span>
            </div>

            {/* Smartphone Device Frame */}
            <div className="w-[310px] bg-slate-900 p-3 rounded-[38px] shadow-2xl border-4 border-slate-700 relative">
              {/* Speaker & Camera notch */}
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-800 inline-block" />
                <span className="w-8 h-1 rounded-full bg-slate-800 inline-block" />
              </div>

              {/* Mobile Screen Container */}
              <div className="bg-slate-50 rounded-[28px] overflow-hidden text-slate-800 text-[11px] h-[480px] flex flex-col shadow-inner select-text">
                {/* Mobile App Header */}
                <div className="bg-slate-900 text-white px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-red-600 rounded text-white font-black text-[9px] flex items-center justify-center">
                      F1
                    </span>
                    <span className="font-bold text-[10px] tracking-tight">DỰ TOÁN F1 MOBILE</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    TT11/TT12
                  </span>
                </div>

                {/* Mobile Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Project Info Card */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      {settings.projectName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">CĐT: {settings.investor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{settings.locationProvince} (Vùng {settings.salaryRegion})</span>
                      </div>
                    </div>
                  </div>

                  {/* Grand Total Hero Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-3 rounded-xl shadow-xs">
                    <div className="text-[9px] text-blue-100 font-medium uppercase tracking-wider">
                      TỔNG MỨC ĐẦU TƯ CÔNG TRÌNH
                    </div>
                    <div className="text-base font-black font-mono mt-0.5 tracking-tight">
                      {formatVND(thkp.grandTotal)} VNĐ
                    </div>
                    <div className="text-[9px] text-blue-200 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      <span>Đã bao gồm VAT 10% & Dự phòng 5%</span>
                    </div>
                  </div>

                  {/* Key Cost Breakdown Rows */}
                  <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                    <div className="text-[10px] font-bold text-slate-700 border-b border-slate-100 pb-1">
                      CƠ CẤU CHI PHÍ DỰ TOÁN
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">1. Chi phí trực tiếp (T):</span>
                      <span className="font-mono font-bold text-slate-900">{formatVND(thkp.directCostTotal)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">2. Chi phí gián tiếp (GT):</span>
                      <span className="font-mono font-bold text-slate-900">{formatVND(thkp.indirectCostTotal)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">3. Thu nhập tính trước (TL):</span>
                      <span className="font-mono font-bold text-slate-900">{formatVND(thkp.taxableProfit)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
                      <span className="font-semibold text-slate-800">4. CP Xây dựng trước thuế (G):</span>
                      <span className="font-mono font-bold text-blue-700">{formatVND(thkp.preTaxTotal)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">5. Thuế GTGT (VAT 10%):</span>
                      <span className="font-mono text-slate-800">{formatVND(thkp.vatAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-600">6. Chi phí dự phòng (5%):</span>
                      <span className="font-mono text-slate-800">{formatVND(thkp.contingencyCost)}</span>
                    </div>
                  </div>

                  {/* Visual Cost Ratio Bar */}
                  <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-1.5">
                    <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                      <span>Tỷ trọng chi phí</span>
                      <span>Trực tiếp {((thkp.directCostTotal / thkp.grandTotal) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${(thkp.directCostTotal / thkp.grandTotal) * 100}%` }}
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(thkp.indirectCostTotal / thkp.grandTotal) * 100}%` }}
                      />
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(thkp.taxableProfit / thkp.grandTotal) * 100}%` }}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${((thkp.vatAmount + thkp.contingencyCost) / thkp.grandTotal) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400">
                      <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Trực tiếp</span>
                      <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Gián tiếp</span>
                      <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> VAT & DP</span>
                    </div>
                  </div>

                  {/* Footer Timestamp */}
                  <div className="text-center text-[9px] text-slate-400 py-1">
                    Cập nhật: {new Date().toLocaleDateString('vi-VN')} · BXD Thông tư 12 & 11
                  </div>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
