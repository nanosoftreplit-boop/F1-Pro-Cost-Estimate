/**
 * Hệ thống Bản quyền, Phân quyền & Thanh toán thực tế
 * Admin Tối cao: HOÀNG HẢI AN
 * Tài khoản thụ hưởng MB Bank: 0030132291981
 */

export type UserRole = 'admin' | 'user';

export type PackageId = 'standard' | 'enterprise' | 'vip_all';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ServicePackage {
  id: PackageId;
  name: string;
  tagline: string;
  priceVnd: number;
  originalPriceVnd?: number;
  durationLabel: string;
  isPopular?: boolean;
  isVip?: boolean;
  features: string[];
  restrictedTabs?: string[];
}

export interface PaymentRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId: PackageId;
  packageName: string;
  amountVnd: number;
  transferContent: string;
  transactionRef?: string;
  status: RequestStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  note?: string;
  licenseKey?: string;
}

export interface LicenseKeyRecord {
  key: string;
  customerName: string;
  customerPhone: string;
  packageId: PackageId;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'revoked';
  issuedBy: string;
}

export interface UserLicenseState {
  role: UserRole;
  userName: string;
  activePackageId: PackageId | 'none';
  isApproved: boolean;
  expiryDate?: string;
  licenseKey?: string;
}

// Thông tin tài khoản ngân hàng thụ hưởng CHÍNH THỨC của Admin HOÀNG HẢI AN
export const ADMIN_PAYMENT_INFO = {
  accountHolder: 'HOÀNG HẢI AN',
  accountNumber: '0030132291981',
  bankName: 'MB Bank (Ngân hàng Quân đội)',
  bankCode: 'MB',
  bankBin: '970422',
  adminPassword: 'An$12131415',
  supportHotline: '0964058714',
  supportPhone: '0964058714',
  supportEmail: 'anhh.compt@gmail.com',
};

// Danh mục các gói dịch vụ phần mềm Dự toán F1 Pro
export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'standard',
    name: 'Gói Tiêu Chuẩn (F1 Standard)',
    tagline: 'Phù hợp kỹ sư dự toán cá nhân, nhà thầu xây dựng vừa và nhỏ',
    priceVnd: 890000,
    originalPriceVnd: 1200000,
    durationLabel: '1 năm sử dụng',
    features: [
      'Bảng Công trình & Diễn giải khối lượng dài x rộng x cao',
      'Tra cứu định mức TT12/2021/TT-BXD hơn 35.000 công tác',
      'Phân tích vật tư & Giá tháng Sở Xây dựng 63 Tỉnh/Thành',
      'Bảng Đơn giá chi tiết đầy đủ VL - NC - MTC',
      'Tổng hợp kinh phí THKP tự động theo Thông tư 11/2021/TT-BXD',
      'Xuất file Excel trọn bộ dự toán'
    ]
  },
  {
    id: 'enterprise',
    name: 'Gói Doanh Nghiệp (F1 Pro Enterprise)',
    tagline: 'Dành cho Ban QLDA, Đơn vị Tư vấn Giám sát, Chủ đầu tư & Tổng thầu',
    priceVnd: 1890000,
    originalPriceVnd: 2500000,
    durationLabel: '1 năm sử dụng',
    isPopular: true,
    features: [
      'Bao gồm toàn bộ tính năng của Gói Tiêu Chuẩn',
      'Thẩm tra & So sánh dự toán (phát hiện lệch khối lượng, đơn giá)',
      'Xuất Biên bản Báo cáo Thẩm tra chính thức (Mẫu 01/TTr)',
      'Thanh quyết toán hợp đồng mẫu 03a & 03b Nghị định 99/2021/NĐ-CP',
      'Lập tiến độ thi công biểu đồ Gantt & đường găng CPM',
      'Hồ sơ Dự thầu & Xuất gói dữ liệu E-GP Hệ thống Đấu thầu Quốc gia',
      'Xuất file PDF chuẩn Thể thức Hành chính Nghị định 30/2020/NĐ-CP'
    ]
  },
  {
    id: 'vip_all',
    name: 'Gói Tối Cao VIP (F1 VIP All-Access & Python API)',
    tagline: 'Trọn bộ đặc quyền cao cấp nhất, kết nối API và bản quyền vĩnh viễn',
    priceVnd: 3500000,
    originalPriceVnd: 5000000,
    durationLabel: 'Bản quyền vĩnh viễn',
    isVip: true,
    features: [
      'Toàn quyền truy cập KHÔNG GIỚI HẠN toàn bộ 10 phân hệ phần mềm',
      'Mô phỏng rủi ro Monte Carlo & Biểu đồ D3 S-Curve tiến độ giải ngân',
      'Xuất trọn bộ mã nguồn Python độc lập kèm SQLite TT12 Database',
      'Máy chủ REST API Server cổng 8000 kết nối Revit / AutoCAD / BIM / ERP',
      'Xuất mã QR Code di động xem tóm tắt THKP mọi lúc mọi nơi',
      'Cập nhật định mức và giá thông báo 63 tỉnh/thành tự động trọn đời',
      'Hỗ trợ kỹ thuật 1-1 ưu tiên trực tiếp từ Admin Hoàng Hải An'
    ]
  }
];

// Hàm sinh mã bản quyền chuẩn
export function generateLicenseKey(pkgId: PackageId, customerName: string): string {
  const prefix = pkgId === 'vip_all' ? 'F1VIP' : pkgId === 'enterprise' ? 'F1ENT' : 'F1STD';
  const nameHash = customerName.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'AN98';
  const randomPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${nameHash}-${randomPart1}-${randomPart2}`;
}
