import React, { useState } from 'react';
import { 
  ADMIN_PAYMENT_INFO, 
  SERVICE_PACKAGES, 
  ServicePackage, 
  PackageId, 
  UserLicenseState, 
  UserRole 
} from '../types/license';
import { 
  ShieldCheck, Check, Copy, Sparkles, Building2, CreditCard, 
  CheckCircle2, Clock, X, ArrowRight, UserCheck, AlertCircle, 
  QrCode, ExternalLink, Key, Lock, Unlock, Phone, Mail, MessageSquare
} from 'lucide-react';

interface ServicePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLicense: UserLicenseState;
  onSubmitPaymentRequest: (pkgId: PackageId, customerName: string, phone: string, email: string, note?: string) => void;
  onAdminLogin: (password: string) => boolean;
  onOpenAdminApproval?: () => void;
  onActivateWithKey?: (key: string) => boolean;
}

export const ServicePackagesModal: React.FC<ServicePackagesModalProps> = ({
  isOpen,
  onClose,
  userLicense,
  onSubmitPaymentRequest,
  onAdminLogin,
  onOpenAdminApproval,
  onActivateWithKey,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>('enterprise');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [txRef, setTxRef] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [keyActivationSuccess, setKeyActivationSuccess] = useState<string | null>(null);
  const [keyActivationError, setKeyActivationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPackage = SERVICE_PACKAGES.find(p => p.id === selectedPackageId) || SERVICE_PACKAGES[1];

  // Cú pháp chuyển khoản tự động
  const sanitizedName = customerName ? customerName.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '') : 'KHACHHANG';
  const transferSyntax = `F1PRO ${sanitizedName} ${selectedPackage.id.toUpperCase()}`;

  // Mã VietQR chuẩn Napas247 từ MB Bank của Admin HOÀNG HẢI AN
  const qrUrl = `https://img.vietqr.io/image/MB-0030132291981-compact2.png?amount=${selectedPackage.priceVnd}&addInfo=${encodeURIComponent(transferSyntax)}&accountName=HOANG%20HAI%20AN`;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại liên hệ để Admin phê duyệt!');
      return;
    }
    onSubmitPaymentRequest(
      selectedPackageId,
      customerName,
      customerPhone,
      customerEmail || `${customerPhone}@dutoanf1.vn`,
      txRef ? `Mã giao dịch MB: ${txRef}` : undefined
    );
    setSubmittedSuccess(true);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(adminPasswordInput);
    if (success) {
      setAdminLoginError(false);
      setShowAdminLogin(false);
    } else {
      setAdminLoginError(true);
    }
  };

  const handleKeyActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      setKeyActivationError('Vui lòng nhập mã bản quyền!');
      return;
    }
    if (onActivateWithKey) {
      const ok = onActivateWithKey(licenseKeyInput.trim());
      if (ok) {
        setKeyActivationSuccess('Kích hoạt mã bản quyền thành công! Đã mở khóa gói dịch vụ.');
        setKeyActivationError(null);
        setTimeout(() => onClose(), 1500);
      } else {
        setKeyActivationError('Mã bản quyền không hợp lệ hoặc chưa được Admin HOÀNG HẢI AN phê duyệt!');
        setKeyActivationSuccess(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white font-black text-lg">
              F1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  BẢNG GIÁ DỊCH VỤ DỰ TOÁN F1 PRO & ĐĂNG KÝ BẢN QUYỀN
                </h2>
                {userLicense.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    Admin VIP: Miễn phí Toàn bộ
                  </span>
                ) : userLicense.isApproved ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                    Đã được phê duyệt kích hoạt
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    Cần phê duyệt từ Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Thanh toán chính thức qua MB Bank chủ tài khoản <strong>{ADMIN_PAYMENT_INFO.accountHolder}</strong> • Admin phê duyệt kích hoạt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userLicense.role === 'admin' ? (
              <button
                onClick={onOpenAdminApproval}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Mở Cổng Phê Duyệt Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(!showAdminLogin)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-amber-500/30 transition-colors"
                title="Đăng nhập tài khoản quản trị Admin Hoàng Hải An"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Tôi là Admin</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Admin Auth Box (collapsible) */}
        {showAdminLogin && userLicense.role !== 'admin' && (
          <div className="bg-amber-950/70 border-b border-amber-500/40 p-3 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-amber-200">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Xác thực Admin <strong>HOÀNG HẢI AN</strong> để mở khóa miễn phí toàn bộ dịch vụ:</span>
            </div>
            <form onSubmit={handleAdminAuth} className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Nhập mật khẩu Admin..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-amber-500/50 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors"
              >
                Đăng nhập Admin
              </button>
              {adminLoginError && (
                <span className="text-rose-400 font-semibold text-[11px]">Sai mật khẩu!</span>
              )}
            </form>
          </div>
        )}

        {/* Admin Free License Status Callout */}
        {userLicense.role === 'admin' && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Xin chào Admin HOÀNG HẢI AN!</strong> Bạn được kích hoạt đặc quyền <strong>VIP ALL-ACCESS TRỌN ĐỜI MIỄN PHÍ</strong>. Mọi tính năng cao cấp không bao giờ bị khóa.
              </span>
            </div>
            <span className="font-bold text-[10px] uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              100% Free Lifetime
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          
          {/* 3 Packages Cards Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>1. Chọn gói dịch vụ phần mềm Dự toán F1 Pro</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_PACKAGES.map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`rounded-2xl p-4 transition-all cursor-pointer relative flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-xl ring-2 ring-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                        Phổ biến nhất
                      </span>
                    )}

                    {pkg.isVip && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
                        VIP Trọn đời
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{pkg.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{pkg.tagline}</p>
                      </div>

                      <div className="border-t border-b border-slate-700/60 py-2.5 space-y-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-amber-400 font-mono">
                            {pkg.priceVnd.toLocaleString('vi-VN')}
                          </span>
                          <span className="text-xs font-bold text-slate-400">VNĐ</span>
                          {pkg.originalPriceVnd && (
                            <span className="text-xs text-slate-500 line-through font-mono ml-auto">
                              {pkg.originalPriceVnd.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-400 block font-medium">
                          Thời hạn: {pkg.durationLabel}
                        </span>
                      </div>

                      {/* Features list */}
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60">
                      <button
                        type="button"
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : null}
                        <span>{isSelected ? 'Đang chọn gói này' : 'Chọn gói này'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Transfer Box */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>2. Thông tin chuyển khoản thanh toán tới Admin HOÀNG HẢI AN</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              
              {/* Bank Transfer Details (7 cols) */}
              <div className="lg:col-span-7 space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-700/80">
                
                {/* Chủ tài khoản */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Chủ tài khoản thụ hưởng:</span>
                    <span className="text-base font-extrabold text-white tracking-wide">
                      {ADMIN_PAYMENT_INFO.accountHolder}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(ADMIN_PAYMENT_INFO.accountHolder, 'accHolder')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    {copiedField === 'accHolder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Sao chép</span>
                  </button>
                </div>

                {/* Số tài khoản */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Số tài khoản MB Bank:</span>
                    <span className="text-xl font-black text-amber-400 font-mono tracking-wider">
                      {ADMIN_PAYMENT_INFO.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(ADMIN_PAYMENT_INFO.accountNumber, 'accNumber')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    {copiedField === 'accNumber' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Sao chép STK</span>
                  </button>
                </div>

                {/* Ngân hàng */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ngân hàng thụ hưởng:</span>
                    <span className="text-xs font-bold text-slate-200">
                      {ADMIN_PAYMENT_INFO.bankName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono font-bold border border-blue-800">
                    Mã BIN: {ADMIN_PAYMENT_INFO.bankBin}
                  </span>
                </div>

                {/* Số tiền */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Số tiền thanh toán:</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {selectedPackage.priceVnd.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">({selectedPackage.name})</span>
                </div>

                {/* Cú pháp chuyển khoản */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Nội dung chuyển khoản (Bắt buộc):</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {transferSyntax}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(transferSyntax, 'syntax')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    {copiedField === 'syntax' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Sao chép cú pháp</span>
                  </button>
                </div>

              </div>

              {/* VietQR Quick Scan (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-900/90 rounded-xl border border-slate-700 text-center space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Quét mã VietQR bằng App Ngân hàng</span>
                </span>
                
                <div className="p-2 bg-white rounded-xl shadow-lg border border-slate-600">
                  <img
                    src={qrUrl}
                    alt={`VietQR MB Bank ${ADMIN_PAYMENT_INFO.accountHolder}`}
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <p className="text-[10px] text-slate-400 max-w-xs">
                  Mở ứng dụng ngân hàng bất kỳ (MB, Vietcombank, Techcombank, BIDV...) quét mã để tự động điền STK <strong>0030132291981</strong> và số tiền chuẩn xác.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Key Activation Section */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-amber-500/50 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>3. KÍCH HOẠT BẢN QUYỀN: Nhập mã License Key được Admin HOÀNG HẢI AN cấp để mở khóa</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Khách nhập key để mở khóa</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Sau khi bạn chuyển khoản MB Bank, Admin HOÀNG HẢI AN sẽ gửi mã License Key qua SĐT/Zalo <strong>0964058714</strong> hoặc Email <strong>anhh.compt@gmail.com</strong>. Hãy dán mã vào đây để mở khóa ngay lập tức:
            </p>

            <form onSubmit={handleKeyActivationSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nhập mã License Key (ví dụ: F1VIP-AN98-XXXX-XXXX)..."
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>KÍCH HOẠT MỞ KHÓA NGAY</span>
              </button>
            </form>

            {keyActivationSuccess && (
              <p className="text-xs text-emerald-400 font-semibold">{keyActivationSuccess}</p>
            )}
            {keyActivationError && (
              <p className="text-xs text-rose-400 font-medium">{keyActivationError}</p>
            )}
          </div>

          {/* Customer Confirmation Form */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>4. Chưa có Key? Xác nhận đã chuyển khoản để Admin HOÀNG HẢI AN gửi Key</span>
            </h3>

            {submittedSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-300">
                  Đã gửi yêu cầu cấp Key thành công!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thông tin thanh toán gói <strong>{selectedPackage.name}</strong> đã được chuyển tới Admin <strong>HOÀNG HẢI AN</strong>. Admin sẽ xác thực giao dịch MB Bank <strong>0030132291981</strong> và gửi mã License Key qua SĐT/Zalo <strong>{customerPhone}</strong> hoặc Email của bạn.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Gửi yêu cầu khác
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    Xác nhận & Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Họ và tên của bạn <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Số điện thoại Zalo liên hệ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 0912.345.678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Mã tham chiếu GD ngân hàng (nếu có)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: FT26102209..."
                      value={txRef}
                      onChange={(e) => setTxRef(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thời gian phê duyệt thông thường: <strong>3 - 10 phút</strong> kể từ khi nhận được chuyển khoản.</span>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>TÔI ĐÃ CHUYỂN KHOẢN - GỬI ADMIN PHÊ DUYỆT</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://zalo.me/0964058714"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Zalo Admin: 0964058714</span>
            </a>
            <span>•</span>
            <a
              href="tel:0964058714"
              className="flex items-center gap-1 text-amber-300 hover:text-white font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: 0964058714</span>
            </a>
            <span>•</span>
            <a
              href="mailto:anhh.compt@gmail.com"
              className="flex items-center gap-1 text-slate-300 hover:text-white"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email: anhh.compt@gmail.com</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
