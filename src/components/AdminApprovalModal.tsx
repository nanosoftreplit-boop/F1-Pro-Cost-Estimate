import React, { useState, useEffect } from 'react';
import { 
  ADMIN_PAYMENT_INFO, 
  PaymentRequest, 
  SERVICE_PACKAGES, 
  UserRole,
  PackageId,
  LicenseKeyRecord,
  generateLicenseKey
} from '../types/license';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, AlertCircle, 
  Copy, Check, Search, CreditCard, Building2, User, 
  Sparkles, Key, Plus, RefreshCw, X, ArrowRight, ShieldAlert,
  ChevronRight, Lock, LogOut, Trash2, Phone, Mail, MessageSquare, Send, ExternalLink
} from 'lucide-react';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onAdminLogout: () => void;
  requests: PaymentRequest[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onIssueNewLicenseKey: (customerName: string, phone: string, packageId: PackageId) => string;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onAdminLogout,
  requests,
  onApproveRequest,
  onRejectRequest,
  onIssueNewLicenseKey,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'generator' | 'approved' | 'account'>('pending');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Form cấp License Key trực tiếp
  const [genName, setGenName] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genPackage, setGenPackage] = useState<PackageId>('vip_all');
  const [recentlyGeneratedKey, setRecentlyGeneratedKey] = useState<string | null>(null);
  const [lastCustomerInfo, setLastCustomerInfo] = useState<{ name: string; phone: string; packageName: string } | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  const getDeliveryTemplate = (customerName: string, packageName: string, licenseKey: string) => {
    return `[DỰ TOÁN F1 PRO - BÀN GIAO MÃ BẢN QUYỀN]\nKính gửi anh/chị: ${customerName}\nAdmin HOÀNG HẢI AN đã xác nhận thanh toán gói dịch vụ: ${packageName}.\n\n🔑 MÃ BẢN QUYỀN (LICENSE KEY) CỦA BẠN:\n${licenseKey}\n\n👉 HƯỚNG DẪN MỞ KHÓA:\n1. Mở phần mềm Dự toán F1 Pro trên máy tính.\n2. Bấm vào nút "Gói dịch vụ" trên thanh công cụ (hoặc tại phân hệ đang bị khóa).\n3. Dán mã "${licenseKey}" vào ô "Nhập mã License Key" và bấm "Kích hoạt ngay".\n\nHotline / Zalo hỗ trợ Admin Hoàng Hải An: 0964058714\nEmail: anhh.compt@gmail.com`;
  };

  const handleGenerateAndIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim() || !genPhone.trim()) {
      alert('Vui lòng nhập đầy đủ Tên khách hàng và Số điện thoại!');
      return;
    }
    const chosenPkg = SERVICE_PACKAGES.find(p => p.id === genPackage);
    const newKey = onIssueNewLicenseKey(genName.trim(), genPhone.trim(), genPackage);
    setRecentlyGeneratedKey(newKey);
    setLastCustomerInfo({
      name: genName.trim(),
      phone: genPhone.trim(),
      packageName: chosenPkg?.name || 'Gói dịch vụ F1 Pro'
    });
    setActionMsg(`Đã tạo thành công mã License Key: ${newKey} cho khách hàng ${genName}. Hãy gửi mã qua Zalo/Email cho khách.`);
    setGenName('');
    setGenPhone('');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const totalRevenue = approvedRequests.reduce((sum, r) => sum + r.amountVnd, 0);

  const filteredRequests = (activeTab === 'pending' ? pendingRequests : approvedRequests).filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.customerEmail.toLowerCase().includes(q) ||
      r.transferContent.toLowerCase().includes(q) ||
      (r.transactionRef && r.transactionRef.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-slate-950 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  CỔNG PHÊ DUYỆT & CẤP BẢN QUYỀN
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Chủ tài khoản thụ hưởng MB Bank: <strong>{ADMIN_PAYMENT_INFO.accountHolder}</strong> • STK: <strong>{ADMIN_PAYMENT_INFO.accountNumber}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 transition-colors"
              title="Đăng xuất khỏi quyền Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất Admin</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Privilege Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Đặc quyền Admin HOÀNG HẢI AN:</strong> Sử dụng <strong>MIỄN PHÍ 100%</strong> toàn bộ các gói dịch vụ (Standard, Enterprise, VIP All-Access & Python API Engine trọn đời).
            </span>
          </div>
          <div className="shrink-0 font-mono text-[11px] text-amber-400 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
            {pendingRequests.length} yêu cầu chờ phê duyệt
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/50 border-b border-slate-800 shrink-0 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Chờ phê duyệt</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-black text-amber-400">{pendingRequests.length}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-400">cần bạn duyệt</span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Đã kích hoạt</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-black text-emerald-400">{approvedRequests.length}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400">khách hàng đang dùng</span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Doanh thu thu về</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-black text-white font-mono">
                {totalRevenue.toLocaleString('vi-VN')} đ
              </span>
              <CreditCard className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] text-slate-400">qua MB Bank</span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex flex-col justify-between">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tài khoản MB Bank Admin</span>
            <div className="text-[11px] font-mono text-amber-300 truncate font-semibold">
              {ADMIN_PAYMENT_INFO.accountNumber}
            </div>
            <span className="text-[10px] text-emerald-400">HOÀNG HẢI AN</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900 shrink-0 gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Chờ phê duyệt</span>
              {pendingRequests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Cấp License Key Trực Tiếp</span>
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã phê duyệt ({approvedRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'account'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Thông tin MB Bank</span>
            </button>
          </div>

          {(activeTab === 'pending' || activeTab === 'approved') && (
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm khách, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 w-36 sm:w-44"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {actionMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {actionMsg}
              </span>
              <button onClick={() => setActionMsg(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'generator' ? (
            /* Tab: License Key Generator */
            <div className="space-y-4">
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-blue-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span>BỘ SINH MÃ BẢN QUYỀN (LICENSE KEY GENERATOR)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Admin HOÀNG HẢI AN có thể tạo mã bản quyền trực tiếp để gửi cho khách hàng qua Zalo hoặc Email.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGenerateAndIssue} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Họ và tên khách hàng <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Lê Minh Trí"
                        value={genName}
                        onChange={(e) => setGenName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Số điện thoại khách hàng <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: 0987.654.321"
                        value={genPhone}
                        onChange={(e) => setGenPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Gói dịch vụ kích hoạt
                      </label>
                      <select
                        value={genPackage}
                        onChange={(e) => setGenPackage(e.target.value as PackageId)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                      >
                        {SERVICE_PACKAGES.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.priceVnd.toLocaleString('vi-VN')} đ)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Mã được lưu vào bộ nhớ bản quyền được phép kích hoạt của hệ thống.
                    </span>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>TẠO & CẤP MÃ BẢN QUYỀN NGAY</span>
                    </button>
                  </div>
                </form>

                {recentlyGeneratedKey && (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-500/60 space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Mã License Key vừa tạo thành công:</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Khách hàng: <strong className="text-white">{lastCustomerInfo?.name}</strong> • SĐT: <strong className="text-amber-300">{lastCustomerInfo?.phone}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                        {recentlyGeneratedKey}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(recentlyGeneratedKey, 'recent-key')}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {copiedField === 'recent-key' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Sao chép Key</span>
                      </button>
                    </div>

                    {lastCustomerInfo && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
                        <a
                          href={`https://zalo.me/${getCleanPhone(lastCustomerInfo.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Gửi qua Zalo ({lastCustomerInfo.phone})</span>
                          <ExternalLink className="w-3 h-3 opacity-75" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopy(
                            getDeliveryTemplate(lastCustomerInfo.name, lastCustomerInfo.packageName, recentlyGeneratedKey),
                            'recent-msg'
                          )}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedField === 'recent-msg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'recent-msg' ? 'Đã sao chép tin nhắn!' : 'Sao chép tin nhắn bàn giao'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'account' ? (
            /* Tab: Account Details */
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-amber-500/40 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Building2 className="w-5 h-5" />
                    <span className="font-bold text-sm">TÀI KHOẢN MB BANK NHẬN THANH TOÁN CỦA ADMIN HOÀNG HẢI AN</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Đang hoạt động 24/7
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Chủ tài khoản:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-base font-extrabold text-white">{ADMIN_PAYMENT_INFO.accountHolder}</span>
                        <button
                          onClick={() => handleCopy(ADMIN_PAYMENT_INFO.accountHolder, 'accHolder')}
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          {copiedField === 'accHolder' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Sao chép</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Số tài khoản MB Bank:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-lg font-black text-amber-300 font-mono tracking-wider">{ADMIN_PAYMENT_INFO.accountNumber}</span>
                        <button
                          onClick={() => handleCopy(ADMIN_PAYMENT_INFO.accountNumber, 'accNumber')}
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          {copiedField === 'accNumber' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Sao chép</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Ngân hàng:</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{ADMIN_PAYMENT_INFO.bankName}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Mật khẩu xác thực quyền Admin:</span>
                      <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{ADMIN_PAYMENT_INFO.adminPassword}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-xl border border-slate-700 text-center space-y-2">
                    <span className="text-xs font-bold text-slate-300">Mã VietQR thanh toán nhanh</span>
                    <img
                      src={`https://img.vietqr.io/image/MB-0030132291981-compact2.png?amount=1890000&addInfo=F1PRO%20THANHTOAN&accountName=HOANG%20HAI%20AN`}
                      alt="VietQR MB Bank Hoàng Hải An"
                      className="w-40 h-40 object-contain rounded-lg border border-slate-700 bg-white p-1"
                    />
                    <p className="text-[10px] text-slate-400 max-w-xs">
                      Tự động điền đúng STK <strong>0030132291981</strong> và tên <strong>HOÀNG HẢI AN</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Clock className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-medium">
                {activeTab === 'pending'
                  ? 'Hiện không có đơn đăng ký nào đang chờ phê duyệt. Khi khách hàng chuyển khoản qua MB Bank và gửi thông tin xác nhận, yêu cầu sẽ hiển thị tại đây để bạn phê duyệt.'
                  : 'Chưa có yêu cầu nào trong danh sách đã phê duyệt.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(req => {
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{req.customerName}</span>
                          <span className="text-xs text-slate-400 font-mono">({req.id})</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {req.status === 'pending' ? 'Chờ phê duyệt' : 'Đã duyệt'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span>SĐT: <strong className="text-white">{req.customerPhone}</strong></span>
                          <span>Email: <strong className="text-white">{req.customerEmail}</strong></span>
                          <span>Gửi lúc: <span className="text-slate-400">{req.createdAt}</span></span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold text-amber-400 font-mono">
                          {req.amountVnd.toLocaleString('vi-VN')} đ
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{req.packageName}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Nội dung chuyển khoản MB:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-300 font-semibold">{req.transferContent}</span>
                          <button
                            onClick={() => handleCopy(req.transferContent, `syntax-${req.id}`)}
                            className="text-slate-400 hover:text-white"
                          >
                            {copiedField === `syntax-${req.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {req.transactionRef && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Mã GD:</span>
                          <p className="font-mono text-slate-200">{req.transactionRef}</p>
                        </div>
                      )}

                      {req.licenseKey && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">License Key:</span>
                          <p className="font-mono text-emerald-400 font-bold">{req.licenseKey}</p>
                        </div>
                      )}
                    </div>

                    {req.note && (
                      <p className="text-xs text-slate-400 italic bg-slate-900/40 px-2 py-1 rounded">
                        Ghi chú: "{req.note}"
                      </p>
                    )}

                    {/* Action buttons */}
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/60">
                        <button
                          onClick={() => {
                            onRejectRequest(req.id);
                            setActionMsg(`Đã từ chối đơn ${req.id} của ${req.customerName}`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Từ chối</span>
                        </button>

                        <button
                          onClick={() => {
                            onApproveRequest(req.id);
                            setActionMsg(`Đã PHÊ DUYỆT yêu cầu ${req.id} & CẤP KEY thành công cho ${req.customerName}!`);
                          }}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PHÊ DUYỆT & CẤP KEY BẢN QUYỀN</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-slate-700/60">
                        <div className="flex items-center justify-between text-[11px] text-emerald-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã phê duyệt lúc {req.approvedAt} bởi {req.approvedBy || 'Admin Hoàng Hải An'}
                          </span>
                          <span className="text-amber-300 font-mono text-[10px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                            Khách cần nhập key để mở khóa
                          </span>
                        </div>

                        {req.licenseKey && (
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">Key:</span>
                              <span className="font-mono text-xs font-bold text-emerald-300">{req.licenseKey}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopy(req.licenseKey!, `key-${req.id}`)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] border border-slate-700 cursor-pointer"
                              >
                                {copiedField === `key-${req.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Sao chép Key</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopy(
                                  getDeliveryTemplate(req.customerName, req.packageName, req.licenseKey!),
                                  `msg-${req.id}`
                                )}
                                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] border border-amber-500/30 cursor-pointer"
                                title="Sao chép tin nhắn đầy đủ gồm Key và hướng dẫn kích hoạt"
                              >
                                {copiedField === `msg-${req.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Sao chép tin nhắn</span>
                              </button>

                              <a
                                href={`https://zalo.me/${getCleanPhone(req.customerPhone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold"
                                title={`Gửi qua Zalo số ${req.customerPhone}`}
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Zalo</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-75" />
                              </a>

                              {req.customerEmail && (
                                <a
                                  href={`mailto:${req.customerEmail}?subject=${encodeURIComponent('Mã bản quyền Dự toán F1 Pro - Admin Hoàng Hải An')}&body=${encodeURIComponent(getDeliveryTemplate(req.customerName, req.packageName, req.licenseKey))}`}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold"
                                  title={`Gửi Email tới ${req.customerEmail}`}
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server Phê duyệt MB Bank trực tuyến: <strong>mb.dutoanf1.vn</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
