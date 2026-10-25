import React, { useState } from 'react';
import { 
  ADMIN_PAYMENT_INFO, 
  SERVICE_PACKAGES, 
  PackageId, 
  UserLicenseState 
} from '../types/license';
import { 
  Lock, ShieldCheck, CheckCircle2, Copy, Check, QrCode, 
  Key, Building2, CreditCard, ArrowRight, UserCheck, Sparkles,
  Phone, Mail, MessageSquare, ExternalLink
} from 'lucide-react';

interface FeatureGatePaywallProps {
  featureName: string;
  requiredPackageId: PackageId;
  onOpenPaymentModal: () => void;
  onActivateWithKey: (key: string) => boolean;
  onAdminLogin: (password: string) => boolean;
}

export const FeatureGatePaywall: React.FC<FeatureGatePaywallProps> = ({
  featureName,
  requiredPackageId,
  onOpenPaymentModal,
  onActivateWithKey,
  onAdminLogin,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [copiedStk, setCopiedStk] = useState(false);

  const pkg = SERVICE_PACKAGES.find(p => p.id === requiredPackageId) || SERVICE_PACKAGES[1];
  const transferSyntax = `F1PRO KHACHHANG ${pkg.id.toUpperCase()}`;
  const qrUrl = `https://img.vietqr.io/image/MB-0030132291981-compact2.png?amount=${pkg.priceVnd}&addInfo=${encodeURIComponent(transferSyntax)}&accountName=HOANG%20HAI%20AN`;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      setKeyError('Vui lòng nhập mã bản quyền đã được cấp!');
      return;
    }
    const success = onActivateWithKey(licenseKeyInput.trim());
    if (!success) {
      setKeyError('Mã bản quyền không hợp lệ hoặc chưa được Admin HOÀNG HẢI AN phê duyệt!');
    } else {
      setKeyError(null);
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(adminPassword);
    if (!success) {
      setAdminAuthError('Mật khẩu Admin không chính xác!');
    } else {
      setAdminAuthError(null);
      setShowAdminAuth(false);
    }
  };

  const handleCopyStk = () => {
    navigator.clipboard.writeText(ADMIN_PAYMENT_INFO.accountNumber);
    setCopiedStk(true);
    setTimeout(() => setCopiedStk(false), 2000);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 select-none animate-in fade-in duration-200">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center mx-auto shadow-xl text-white">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
            Yêu cầu bản quyền & Phê duyệt bởi Admin
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {featureName} đang bị khóa
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Tính năng này thuộc <strong>{pkg.name}</strong>. Vui lòng thanh toán và nhận sự phê duyệt từ Admin <strong>HOÀNG HẢI AN</strong> để kích hoạt sử dụng.
          </p>
        </div>

        {/* 3-Step Activation Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs relative z-10">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-black">1</span>
              <span>Chuyển khoản MB Bank</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quét mã VietQR hoặc chuyển khoản tới STK <strong>0030132291981</strong> - MB Bank.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-400">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-black">2</span>
              <span>Admin cấp Key qua SĐT/Email</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Admin gửi mã License Key qua Zalo <strong>0964058714</strong> hoặc Email <strong>anhh.compt@gmail.com</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-black">3</span>
              <span>Khách nhập Key mở khóa</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Nhập mã License Key vào ô bên dưới và bấm "Kích hoạt ngay" để mở khóa tính năng.
            </p>
          </div>
        </div>

        {/* MB Bank Official Payment Box */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4 relative z-10 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Tài khoản thụ hưởng chính thức của Admin HOÀNG HẢI AN
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-mono font-bold">
              Giá gói: {pkg.priceVnd.toLocaleString('vi-VN')} đ ({pkg.durationLabel})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Info lines (7 cols) */}
            <div className="sm:col-span-7 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Chủ tài khoản:</span>
                <span className="text-sm font-extrabold text-white">{ADMIN_PAYMENT_INFO.accountHolder}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Số tài khoản MB Bank:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-black text-amber-300 font-mono tracking-wider">
                    {ADMIN_PAYMENT_INFO.accountNumber}
                  </span>
                  <button
                    onClick={handleCopyStk}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-semibold border border-slate-700 transition-colors"
                  >
                    {copiedStk ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedStk ? 'Đã chép' : 'Sao chép STK'}</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ngân hàng:</span>
                <span className="font-semibold text-slate-300">{ADMIN_PAYMENT_INFO.bankName}</span>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenPaymentModal}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Mở bảng giá & Gửi Admin HOÀNG HẢI AN phê duyệt</span>
                </button>
              </div>
            </div>

            {/* QR Scan (5 cols) */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1.5">
              <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                <QrCode className="w-3 h-3 text-emerald-400" />
                <span>Quét mã VietQR chuyển khoản</span>
              </span>
              <img
                src={qrUrl}
                alt={`VietQR MB Bank ${ADMIN_PAYMENT_INFO.accountHolder}`}
                className="w-32 h-32 object-contain rounded-lg bg-white p-1 shadow-md"
              />
              <span className="text-[9px] text-slate-400">
                Tự động điền STK <strong>0030132291981</strong>
              </span>
            </div>

          </div>
        </div>

        {/* Contact Admin Direct Links */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs relative z-10">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">Admin HOÀNG HẢI AN cấp key trực tiếp:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://zalo.me/0964058714"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-[11px] transition-colors shadow-xs"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Zalo: 0964058714</span>
            </a>
            <a
              href="tel:0964058714"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg font-semibold text-[11px] transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>0964058714</span>
            </a>
            <a
              href="mailto:anhh.compt@gmail.com"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-semibold text-[11px] transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>anhh.compt@gmail.com</span>
            </a>
          </div>
        </div>

        {/* License Key Activation Bar */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Đã có mã kích hoạt từ Admin? Nhập để mở khóa ngay:</span>
            </span>
          </div>

          <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nhập mã License Key (ví dụ: F1VIP-AN98-XXXX-XXXX)..."
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kích hoạt ngay</span>
            </button>
          </form>

          {keyError && (
            <p className="text-xs text-rose-400 font-medium">{keyError}</p>
          )}
        </div>

        {/* Footer Admin Switcher */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <div>
            <span>Admin HOÀNG HẢI AN có quyền dùng <strong>miễn phí 100%</strong> tất cả các gói.</span>
          </div>

          <div>
            {!showAdminAuth ? (
              <button
                onClick={() => setShowAdminAuth(true)}
                className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tôi là Admin HOÀNG HẢI AN</span>
              </button>
            ) : (
              <form onSubmit={handleAdminAuthSubmit} className="flex items-center gap-1.5">
                <input
                  type="password"
                  placeholder="Mật khẩu Admin..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="px-2 py-1 bg-slate-900 border border-amber-500/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminAuth(false)}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  Hủy
                </button>
              </form>
            )}
          </div>
        </div>

        {adminAuthError && (
          <p className="text-xs text-rose-400 text-right font-medium">{adminAuthError}</p>
        )}

      </div>
    </div>
  );
};
