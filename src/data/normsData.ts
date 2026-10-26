import { NormTemplate } from '../types/estimate';
import { COMPREHENSIVE_BXD_NORMS, resolveOrGenerateBXDNorm } from './bxdComprehensiveNorms';

export { resolveOrGenerateBXDNorm };
export { PROVINCES_DATA, ALL_PROVINCE_NAMES, findProvince } from './provincesData';

/**
 * Thư viện Định mức Dự toán Xây dựng cơ bản đầy đủ nhất
 * Căn cứ:
 * - Thông tư số 12/2021/TT-BXD của Bộ Xây dựng (Định mức dự toán xây dựng công trình, lắp đặt, khảo sát, sửa chữa)
 * - Thông tư số 11/2021/TT-BXD (Xác định và quản lý chi phí đầu tư xây dựng)
 * - Thông tư số 14/2023/TT-BXD sửa đổi bổ sung định mức xây dựng
 */
const BASE_NORMS_CATALOG: NormTemplate[] = [
  // ==========================================
  // CHƯƠNG I (AA): CÔNG TÁC CHUẨN BỊ MẶT BẰNG
  // ==========================================
  {
    code: 'AA.11111',
    name: 'Phát hoang dọn dẹp mặt bằng bằng thủ công',
    unit: '100m2',
    defaultPriceMat: 0,
    defaultPriceLab: 185000,
    defaultPriceMac: 0,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.74, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AA.11211',
    name: 'Phát quang cây bụi rậm bằng máy ủi công suất 110CV',
    unit: '1000m2',
    defaultPriceMat: 0,
    defaultPriceLab: 145000,
    defaultPriceMac: 890000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.52, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UI110', name: 'Máy ủi 110CV', unit: 'ca', norm: 0.35, price: 2540000 }
    ]
  },
  {
    code: 'AA.11311',
    name: 'Chặt cây bóng mát đường kính gốc <= 20cm bằng thủ công',
    unit: 'cây',
    defaultPriceMat: 0,
    defaultPriceLab: 85000,
    defaultPriceMac: 0,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.34, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AA.11321',
    name: 'Chặt cây bóng mát đường kính gốc 20-40cm bằng cưa máy cầm tay',
    unit: 'cây',
    defaultPriceMat: 25000,
    defaultPriceLab: 195000,
    defaultPriceMac: 45000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XANG', name: 'Xăng pha nhớt cưa máy', unit: 'lít', norm: 1.0, price: 25000, monthlyPrice: 25000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.68, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CUAMAY', name: 'Cưa xích chạy xăng', unit: 'ca', norm: 0.12, price: 375000 }
    ]
  },
  {
    code: 'AA.11411',
    name: 'Đào gốc cây đường kính <= 20cm bằng thủ công',
    unit: 'gốc',
    defaultPriceMat: 0,
    defaultPriceLab: 110000,
    defaultPriceMac: 0,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.44, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AA.12111',
    name: 'Định vị tim trục mốc công trình dân dụng, công nghiệp',
    unit: 'điểm',
    defaultPriceMat: 45000,
    defaultPriceLab: 160000,
    defaultPriceMac: 65000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COCGO', name: 'Cọc gỗ định vị + sơn đỏ', unit: 'cái', norm: 1.0, price: 25000, monthlyPrice: 25000 },
      { code: 'VL_XM30', name: 'Xi măng đổ mốc cố định', unit: 'kg', norm: 8.0, price: 1850, monthlyPrice: 1950 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Kỹ sư trắc địa bậc 4.0/7', unit: 'công', norm: 0.52, price: 308000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_TOANDAC', name: 'Máy toàn đạc điện tử Leica', unit: 'ca', norm: 0.15, price: 430000 }
    ]
  },
  {
    code: 'AA.12211',
    name: 'Làm hàng rào tạm tôn sóng vuông bảo vệ công trình cao 2m',
    unit: '100m',
    defaultPriceMat: 14500000,
    defaultPriceLab: 3800000,
    defaultPriceMac: 0,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TONMA', name: 'Tôn mạ kẽm sóng vuông 0.35mm', unit: 'm2', norm: 205, price: 62000, monthlyPrice: 65000 },
      { code: 'VL_THEPHOP', name: 'Thép hộp cột giằng hàng rào', unit: 'kg', norm: 85, price: 18500, monthlyPrice: 19500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng 3.5/7', unit: 'công', norm: 13.2, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG II (AB): CÔNG TÁC ĐÀO ĐẮP ĐẤT ĐÁ
  // ==========================================
  {
    code: 'AB.11111',
    name: 'Đào móng băng rộng <= 3m, sâu <= 1m, đất cấp III bằng thủ công',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 28400000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 98.5, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11121',
    name: 'Đào móng băng rộng <= 3m, sâu <= 2m, đất cấp III bằng thủ công',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 33800000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 117.2, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11211',
    name: 'Đào rãnh thoát nước, rãnh cáp rộng <= 1m, sâu <= 1m, đất cấp II',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 22500000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 90.0, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.21111',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp I bằng thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 185000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.74, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.21121',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II bằng thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 245000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.85, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AB.21131',
    name: 'Đào hố móng cột độc lập, sâu <= 2m, đất cấp III bằng thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 298000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.03, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AB.24111',
    name: 'Đào đất hố móng bằng máy đào gầu 0.4m3 đất cấp II',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 3200000,
    defaultPriceMac: 3100000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 11.1, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MD04', name: 'Máy đào gầu 0.4m3', unit: 'ca', norm: 1.35, price: 2296000 }
    ]
  },
  {
    code: 'AB.25111',
    name: 'Đào móng bằng máy đào gầu 0.8m3 kết hợp sửa thủ công',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 2880000,
    defaultPriceMac: 3650000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 10.0, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MD08', name: 'Máy đào gầu 0.8m3', unit: 'ca', norm: 1.15, price: 3174000 }
    ]
  },
  {
    code: 'AB.25121',
    name: 'Đào đất hố móng bằng máy đào bánh xích gầu 1.25m3 đất cấp III',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 2150000,
    defaultPriceMac: 4200000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 7.5, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MD125', name: 'Máy đào gầu 1.25m3', unit: 'ca', norm: 0.95, price: 4420000 }
    ]
  },
  {
    code: 'AB.13111',
    name: 'Vận chuyển đất thừa bằng ô tô tự đổ 10 tấn cự ly <= 5km',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 450000,
    defaultPriceMac: 4850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công phụ xe 3.0/7', unit: 'công', norm: 1.8, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_OTO10', name: 'Ô tô tự đổ 10T', unit: 'ca', norm: 1.62, price: 2990000 }
    ]
  },
  {
    code: 'AB.13121',
    name: 'Vận chuyển đất thừa bằng ô tô tự đổ 15 tấn cự ly <= 10km',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 380000,
    defaultPriceMac: 6850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.5, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_OTO15', name: 'Ô tô tự đổ 15T', unit: 'ca', norm: 1.88, price: 3643000 }
    ]
  },
  {
    code: 'AB.61111',
    name: 'Đắp đất nền móng công trình độ chặt K=0.95 lu lèn máy',
    unit: 'm3',
    defaultPriceMat: 98000,
    defaultPriceLab: 32000,
    defaultPriceMac: 45000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAT', name: 'Đất cấp phối đắp nền K95', unit: 'm3', norm: 1.18, price: 83000, monthlyPrice: 98000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.12, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_LURUNG', name: 'Máy lu rung 14T', unit: 'ca', norm: 0.012, price: 2850000 },
      { code: 'M_DCOC', name: 'Máy đầm cóc 70kg mép móng', unit: 'ca', norm: 0.035, price: 312500 }
    ]
  },
  {
    code: 'AB.62111',
    name: 'Đắp cát tôn nền móng công trình độ chặt K=0.90 bằng thủ công',
    unit: 'm3',
    defaultPriceMat: 215000,
    defaultPriceLab: 65000,
    defaultPriceMac: 18000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CATDEN', name: 'Cát đen tôn nền', unit: 'm3', norm: 1.15, price: 165000, monthlyPrice: 185000 },
      { code: 'VL_NUOC', name: 'Nước tưới đầm', unit: 'lít', norm: 120, price: 25, monthlyPrice: 25 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.26, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DCOC', name: 'Máy đầm cóc 70kg', unit: 'ca', norm: 0.058, price: 312500 }
    ]
  },

  // ==========================================
  // CHƯƠNG III (AC): ĐÓNG CỌC & ÉP CỌC
  // ==========================================
  {
    code: 'AC.11111',
    name: 'Đóng cọc bê tông cốt thép 200x200 bằng máy búa Diesel',
    unit: '100m',
    defaultPriceMat: 0,
    defaultPriceLab: 3950000,
    defaultPriceMac: 6800000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 13.7, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BUADOC', name: 'Máy đóng cọc búa Diesel 1.8T', unit: 'ca', norm: 1.82, price: 3736000 }
    ]
  },
  {
    code: 'AC.11121',
    name: 'Đóng cọc bê tông cốt thép 250x250 bằng máy đóng cọc bánh xích',
    unit: '100m',
    defaultPriceMat: 0,
    defaultPriceLab: 4850000,
    defaultPriceMac: 8900000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 16.8, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BUADOC', name: 'Máy đóng cọc búa Diesel 2.5T', unit: 'ca', norm: 2.15, price: 4140000 }
    ]
  },
  {
    code: 'AC.21111',
    name: 'Ép cọc bê tông cốt thép 250x250 bằng máy ép thủy lực tĩnh 80T',
    unit: '100m',
    defaultPriceMat: 0,
    defaultPriceLab: 3600000,
    defaultPriceMac: 6200000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 12.5, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPTHUY', name: 'Máy ép cọc thủy lực tĩnh 80T', unit: 'ca', norm: 1.65, price: 3757000 }
    ]
  },
  {
    code: 'AC.21121',
    name: 'Ép cọc bê tông cốt thép 300x300 bằng máy ép thủy lực tĩnh 120T',
    unit: '100m',
    defaultPriceMat: 0,
    defaultPriceLab: 4200000,
    defaultPriceMac: 7500000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 14.5, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPTHUY', name: 'Máy ép cọc thủy lực tĩnh 120T', unit: 'ca', norm: 1.85, price: 4054000 }
    ]
  },
  {
    code: 'AC.21131',
    name: 'Ép cọc bê tông cốt thép 350x350 bằng máy ép thủy lực tĩnh 150T',
    unit: '100m',
    defaultPriceMat: 0,
    defaultPriceLab: 4800000,
    defaultPriceMac: 8900000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 16.6, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPTHUY', name: 'Máy ép cọc thủy lực tĩnh 150T', unit: 'ca', norm: 2.1, price: 4238000 }
    ]
  },
  {
    code: 'AC.31111',
    name: 'Khoan tạo lỗ cọc khoan nhồi D800 trong đất dùng bentonite',
    unit: 'm',
    defaultPriceMat: 85000,
    defaultPriceLab: 320000,
    defaultPriceMac: 980000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BENTONITE', name: 'Bột sét Bentonite API', unit: 'kg', norm: 18.5, price: 4500, monthlyPrice: 4800 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ khoan bậc 4.0/7', unit: 'công', norm: 1.05, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANR', name: 'Máy khoan xoay phản tuần hoàn', unit: 'ca', norm: 0.16, price: 6125000 }
    ]
  },
  {
    code: 'AC.31121',
    name: 'Khoan tạo lỗ cọc khoan nhồi D1000 trong đất có bentonite',
    unit: 'm',
    defaultPriceMat: 115000,
    defaultPriceLab: 410000,
    defaultPriceMac: 1250000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BENTONITE', name: 'Bột sét Bentonite API', unit: 'kg', norm: 24.0, price: 4500, monthlyPrice: 4800 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ khoan bậc 4.0/7', unit: 'công', norm: 1.34, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANR', name: 'Máy khoan cọc nhồi D1000', unit: 'ca', norm: 0.2, price: 6250000 }
    ]
  },
  {
    code: 'AC.12111',
    name: 'Đóng cọc cừ tràm L=4m gia cố nền đất yếu bằng máy kết hợp thủ công',
    unit: '100 cây',
    defaultPriceMat: 2800000,
    defaultPriceLab: 850000,
    defaultPriceMac: 350000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUTRAM', name: 'Cọc cừ tràm gốc 8-10cm L=4m', unit: 'cây', norm: 102, price: 27000, monthlyPrice: 28000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 3.4, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_MAYCU', name: 'Máy đóng cừ gầu đào', unit: 'ca', norm: 0.12, price: 2916000 }
    ]
  },

  // ==========================================
  // CHƯƠNG IV (AD): NỀN MÓNG & MẶT ĐƯỜNG
  // ==========================================
  {
    code: 'AD.11111',
    name: 'Làm móng cấp phối đá dăm loại 1 dày 15cm lu lèn K=0.98',
    unit: '100m2',
    defaultPriceMat: 7850000,
    defaultPriceLab: 680000,
    defaultPriceMac: 1850000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CPDD1', name: 'Cấp phối đá dăm loại 1', unit: 'm3', norm: 19.5, price: 380000, monthlyPrice: 405000 },
      { code: 'VL_NUOC', name: 'Nước tưới đầm', unit: 'm3', norm: 2.5, price: 25000, monthlyPrice: 25000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 2.7, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_SAN110', name: 'Máy san 110CV', unit: 'ca', norm: 0.18, price: 3200000 },
      { code: 'M_LURUNG', name: 'Máy lu rung 14T', unit: 'ca', norm: 0.42, price: 2850000 }
    ]
  },
  {
    code: 'AD.11121',
    name: 'Làm móng cấp phối đá dăm loại 1 dày 18cm lu lèn K=0.98',
    unit: '100m2',
    defaultPriceMat: 9400000,
    defaultPriceLab: 780000,
    defaultPriceMac: 2150000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CPDD1', name: 'Cấp phối đá dăm loại 1', unit: 'm3', norm: 23.4, price: 380000, monthlyPrice: 405000 },
      { code: 'VL_NUOC', name: 'Nước tưới đầm', unit: 'm3', norm: 3.0, price: 25000, monthlyPrice: 25000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 3.12, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_SAN110', name: 'Máy san 110CV', unit: 'ca', norm: 0.21, price: 3200000 },
      { code: 'M_LURUNG', name: 'Máy lu rung 14T', unit: 'ca', norm: 0.49, price: 2850000 }
    ]
  },
  {
    code: 'AD.21111',
    name: 'Tưới nhựa dính bám tiêu chuẩn 0.5 kg/m2 (nhũ tương CRS-1)',
    unit: '100m2',
    defaultPriceMat: 980000,
    defaultPriceLab: 110000,
    defaultPriceMac: 240000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_NHUADB', name: 'Nhũ tương nhựa đường CRS-1', unit: 'kg', norm: 52, price: 18500, monthlyPrice: 19500 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công 3.0/7', unit: 'công', norm: 0.44, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_TUOINHUA', name: 'Xe tưới nhựa đường chuyên dụng', unit: 'ca', norm: 0.08, price: 3000000 }
    ]
  },
  {
    code: 'AD.22111',
    name: 'Rải thảm mặt đường bê tông nhựa hạt mịn C9.5 dày 5cm bằng máy rải',
    unit: '100m2',
    defaultPriceMat: 16800000,
    defaultPriceLab: 1150000,
    defaultPriceMac: 2450000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTN_MIN', name: 'Bê tông nhựa nóng C9.5', unit: 'tấn', norm: 12.5, price: 1320000, monthlyPrice: 1350000 },
      { code: 'VL_NHUA_DB', name: 'Nhũ tương dính bám CRS-1', unit: 'kg', norm: 50, price: 18500, monthlyPrice: 19500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 4.0, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RAIBTN', name: 'Máy rải bê tông nhựa', unit: 'ca', norm: 0.22, price: 5800000 },
      { code: 'M_LULOP', name: 'Máy lu bánh lốp 16T', unit: 'ca', norm: 0.45, price: 2600000 }
    ]
  },
  {
    code: 'AD.22121',
    name: 'Rải thảm mặt đường bê tông nhựa hạt trung C19 dày 7cm bằng máy rải',
    unit: '100m2',
    defaultPriceMat: 22800000,
    defaultPriceLab: 1450000,
    defaultPriceMac: 3100000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTN_TRUNG', name: 'Bê tông nhựa nóng C19', unit: 'tấn', norm: 17.5, price: 1280000, monthlyPrice: 1300000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 5.0, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RAIBTN', name: 'Máy rải bê tông nhựa', unit: 'ca', norm: 0.28, price: 5800000 },
      { code: 'M_LUBANH', name: 'Máy lu thép bánh cứng 10-12T', unit: 'ca', norm: 0.52, price: 2450000 }
    ]
  },
  {
    code: 'AD.41111',
    name: 'Lát vỉa hè gạch Terrazzo 400x400 trên lớp vữa xi măng M75 dày 3cm',
    unit: 'm2',
    defaultPriceMat: 135000,
    defaultPriceLab: 68000,
    defaultPriceMac: 0,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TERRAZZO', name: 'Gạch Terrazzo 400x400x30 hoa văn', unit: 'm2', norm: 1.03, price: 85000, monthlyPrice: 95000 },
      { code: 'VL_XM30', name: 'Xi măng PC30 lót nền', unit: 'kg', norm: 8.5, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát vàng lót nền', unit: 'm3', norm: 0.038, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lát bậc 3.5/7', unit: 'công', norm: 0.235, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG V (AE): CÔNG TÁC XÂY GẠCH ĐÁ
  // ==========================================
  {
    code: 'AE.11110',
    name: 'Xây móng đá hộc vữa xi măng mác 75',
    unit: 'm3',
    defaultPriceMat: 590000,
    defaultPriceLab: 385000,
    defaultPriceMac: 25000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAHOC', name: 'Đá hộc xây móng', unit: 'm3', norm: 1.15, price: 260000, monthlyPrice: 285000 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 110, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát vàng xây trát', unit: 'm3', norm: 0.42, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.34, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.08, price: 315000 }
    ]
  },
  {
    code: 'AE.21110',
    name: 'Xây tường thẳng gạch ống 8x8x19 dày <= 110mm vữa XM mác 75',
    unit: 'm3',
    defaultPriceMat: 985000,
    defaultPriceLab: 590000,
    defaultPriceMac: 28000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHONG', name: 'Gạch tuynel 8x8x19', unit: 'viên', norm: 620, price: 1200, monthlyPrice: 1350 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 78, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.32, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.05, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.09, price: 315000 }
    ]
  },
  {
    code: 'AE.21120',
    name: 'Xây tường thẳng gạch ống 8x8x19 dày <= 110mm vữa XM mác 100',
    unit: 'm3',
    defaultPriceMat: 1045000,
    defaultPriceLab: 590000,
    defaultPriceMac: 28000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHONG', name: 'Gạch tuynel 8x8x19', unit: 'viên', norm: 620, price: 1200, monthlyPrice: 1350 },
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 98, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.31, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.05, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.09, price: 315000 }
    ]
  },
  {
    code: 'AE.21210',
    name: 'Xây tường thẳng gạch ống 8x8x19 dày > 110mm vữa XM mác 75 (tường 220)',
    unit: 'm3',
    defaultPriceMat: 940000,
    defaultPriceLab: 495000,
    defaultPriceMac: 25000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHONG', name: 'Gạch tuynel 8x8x19', unit: 'viên', norm: 585, price: 1200, monthlyPrice: 1350 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 74, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.30, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.72, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.08, price: 315000 }
    ]
  },
  {
    code: 'AE.22110',
    name: 'Xây tường gạch đặc (thẻ) 4x8x19 dày 110mm vữa XM mác 75',
    unit: 'm3',
    defaultPriceMat: 1250000,
    defaultPriceLab: 640000,
    defaultPriceMac: 30000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHTHE', name: 'Gạch đặc tuynel 4x8x19', unit: 'viên', norm: 755, price: 1350, monthlyPrice: 1480 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 88, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.33, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.22, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.095, price: 315000 }
    ]
  },
  {
    code: 'AE.22210',
    name: 'Xây tường gạch đặc (thẻ) 4x8x19 dày 220mm vữa XM mác 75',
    unit: 'm3',
    defaultPriceMat: 1190000,
    defaultPriceLab: 535000,
    defaultPriceMac: 28000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHTHE', name: 'Gạch đặc tuynel 4x8x19', unit: 'viên', norm: 720, price: 1350, monthlyPrice: 1480 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 82, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.32, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.85, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.088, price: 315000 }
    ]
  },
  {
    code: 'AE.31110',
    name: 'Xây tường block bê tông nhẹ khí chưng áp AAC 600x200x100 dùng keo',
    unit: 'm3',
    defaultPriceMat: 1450000,
    defaultPriceLab: 410000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHAAC', name: 'Gạch bê tông khí chưng áp AAC', unit: 'm3', norm: 1.03, price: 1250000, monthlyPrice: 1300000 },
      { code: 'VL_KEOAAC', name: 'Keo xây chuyên dụng AAC', unit: 'kg', norm: 25, price: 6500, monthlyPrice: 7000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.42, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG VI (AF): BÊ TÔNG ĐỔ TẠI CHỖ
  // ==========================================
  {
    code: 'AF.11111',
    name: 'Bê tông lót móng đá 4x6 mác 100, vữa XM PC30',
    unit: 'm3',
    defaultPriceMat: 785000,
    defaultPriceLab: 260000,
    defaultPriceMac: 38000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 198, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.52, price: 280000, monthlyPrice: 310000 },
      { code: 'VL_DA46', name: 'Đá 4x6', unit: 'm3', norm: 0.92, price: 240000, monthlyPrice: 260000 },
      { code: 'VL_NUOC', name: 'Nước sinh hoạt', unit: 'lít', norm: 185, price: 25, monthlyPrice: 25 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.9, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn bê tông 250 lít', unit: 'ca', norm: 0.12, price: 315000 }
    ]
  },
  {
    code: 'AF.11121',
    name: 'Bê tông lót móng đá 4x6 mác 150, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 865000,
    defaultPriceLab: 260000,
    defaultPriceMac: 38000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 235, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.50, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA46', name: 'Đá 4x6', unit: 'm3', norm: 0.90, price: 240000, monthlyPrice: 260000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.9, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.12, price: 315000 }
    ]
  },
  {
    code: 'AF.12210',
    name: 'Bê tông móng đá 1x2 mác 200, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 995000,
    defaultPriceLab: 320000,
    defaultPriceMac: 48000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 285, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.47, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.88, price: 340000, monthlyPrice: 380000 },
      { code: 'VL_NUOC', name: 'Nước sinh hoạt', unit: 'lít', norm: 175, price: 25, monthlyPrice: 25 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.11, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn bê tông 250 lít', unit: 'ca', norm: 0.15, price: 315000 }
    ]
  },
  {
    code: 'AF.12220',
    name: 'Bê tông móng đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1080000,
    defaultPriceLab: 325000,
    defaultPriceMac: 52000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 328, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.45, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 340000, monthlyPrice: 380000 },
      { code: 'VL_NUOC', name: 'Nước', unit: 'lít', norm: 175, price: 25, monthlyPrice: 25 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.13, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.16, price: 315000 }
    ]
  },
  {
    code: 'AF.12230',
    name: 'Bê tông móng đá 1x2 mác 300, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1160000,
    defaultPriceLab: 330000,
    defaultPriceMac: 55000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 375, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.44, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.15, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.17, price: 315000 }
    ]
  },
  {
    code: 'AF.13110',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1120000,
    defaultPriceLab: 480000,
    defaultPriceMac: 65000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 345, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 },
      { code: 'VL_NUOC', name: 'Nước sinh hoạt', unit: 'lít', norm: 180, price: 25, monthlyPrice: 25 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.66, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn bê tông 250L', unit: 'ca', norm: 0.14, price: 315000 },
      { code: 'M_DAMDUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.18, price: 120000 }
    ]
  },
  {
    code: 'AF.13120',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 300, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1195000,
    defaultPriceLab: 485000,
    defaultPriceMac: 65000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 390, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.44, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.85, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.68, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.14, price: 315000 },
      { code: 'M_DAMDUI', name: 'Đầm dùi 1.5kW', unit: 'ca', norm: 0.18, price: 120000 }
    ]
  },
  {
    code: 'AF.13210',
    name: 'Bê tông cột tiết diện > 0.1m2 đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1095000,
    defaultPriceLab: 425000,
    defaultPriceMac: 58000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 335, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.47, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.13, price: 315000 },
      { code: 'M_DAMDUI', name: 'Đầm dùi 1.5kW', unit: 'ca', norm: 0.16, price: 120000 }
    ]
  },
  {
    code: 'AF.14110',
    name: 'Bê tông dầm giằng đá 1x2 mác 250 vữa XM PC40 cao <= 6m',
    unit: 'm3',
    defaultPriceMat: 1090000,
    defaultPriceLab: 420000,
    defaultPriceMac: 58000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 335, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.45, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.14, price: 315000 },
      { code: 'M_DAMDUI', name: 'Đầm dùi 1.5kW', unit: 'ca', norm: 0.15, price: 120000 }
    ]
  },
  {
    code: 'AF.15110',
    name: 'Bê tông sàn mái đá 1x2 mác 250 vữa XM PC40 dày <= 15cm',
    unit: 'm3',
    defaultPriceMat: 1085000,
    defaultPriceLab: 395000,
    defaultPriceMac: 55000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 330, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.37, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.13, price: 315000 },
      { code: 'M_DAMBAN', name: 'Đầm bàn 1.1kW', unit: 'ca', norm: 0.14, price: 110000 }
    ]
  },
  {
    code: 'AF.16110',
    name: 'Bê tông lanh tô, ô văng, sê nô đá 1x2 mác 200 vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1020000,
    defaultPriceLab: 520000,
    defaultPriceMac: 48000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 295, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.47, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.8, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.15, price: 315000 }
    ]
  },
  {
    code: 'AF.17110',
    name: 'Bê tông cầu thang bộ đá 1x2 mác 250 vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1120000,
    defaultPriceLab: 560000,
    defaultPriceMac: 52000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 340, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.94, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.16, price: 315000 }
    ]
  },
  {
    code: 'AF.21110',
    name: 'Bê tông thương phẩm móng Mác 250 độ sụt 12±2 dùng bơm cần',
    unit: 'm3',
    defaultPriceMat: 1350000,
    defaultPriceLab: 125000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTTM250', name: 'Bê tông tươi thương phẩm M250', unit: 'm3', norm: 1.025, price: 1280000, monthlyPrice: 1350000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công cào đầm 3.5/7', unit: 'công', norm: 0.43, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMCAN', name: 'Bơm cần bê tông 37m', unit: 'ca', norm: 0.015, price: 5500000 },
      { code: 'M_DAMDUI', name: 'Đầm dùi bê tông', unit: 'ca', norm: 0.12, price: 120000 }
    ]
  },
  {
    code: 'AF.22110',
    name: 'Bê tông thương phẩm cột, vách Mác 300 độ sụt 12±2 dùng bơm tĩnh',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 165000,
    defaultPriceMac: 110000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTTM300', name: 'Bê tông tươi thương phẩm M300', unit: 'm3', norm: 1.03, price: 1350000, monthlyPrice: 1420000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công cào đầm 3.5/7', unit: 'công', norm: 0.57, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMTINH', name: 'Máy bơm tĩnh bê tông', unit: 'ca', norm: 0.02, price: 5200000 }
    ]
  },
  {
    code: 'AF.23110',
    name: 'Bê tông thương phẩm dầm, sàn Mác 300 độ sụt 12±2 dùng bơm cần',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 135000,
    defaultPriceMac: 90000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTTM300', name: 'Bê tông tươi thương phẩm M300', unit: 'm3', norm: 1.025, price: 1350000, monthlyPrice: 1420000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công cào đầm 3.5/7', unit: 'công', norm: 0.47, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMCAN', name: 'Bơm cần bê tông 37m', unit: 'ca', norm: 0.016, price: 5500000 }
    ]
  },

  // ==========================================
  // CHƯƠNG VII (AG): CẤU KIỆN ĐÚC SẴN
  // ==========================================
  {
    code: 'AG.11110',
    name: 'Sản xuất dầm sàn bê tông đúc sẵn mác 250 tại bãi đúc',
    unit: 'm3',
    defaultPriceMat: 1250000,
    defaultPriceLab: 520000,
    defaultPriceMac: 85000,
    chapter: 'Chương VII: Cấu kiện đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 340, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đúc bê tông 3.5/7', unit: 'công', norm: 1.8, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.15, price: 315000 }
    ]
  },
  {
    code: 'AG.21110',
    name: 'Lắp dựng tấm đan, panen bê tông đúc sẵn bằng cần cẩu 10 tấn',
    unit: 'cấu kiện',
    defaultPriceMat: 0,
    defaultPriceLab: 185000,
    defaultPriceMac: 310000,
    chapter: 'Chương VII: Cấu kiện đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ghép bậc 3.5/7', unit: 'công', norm: 0.64, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAU10', name: 'Cần cẩu bánh lốp 10T', unit: 'ca', norm: 0.08, price: 3875000 }
    ]
  },
  {
    code: 'AG.31210',
    name: 'Lắp đặt cống tròn bê tông đúc sẵn D600 bằng cẩu tự hành',
    unit: 'm',
    defaultPriceMat: 480000,
    defaultPriceLab: 125000,
    defaultPriceMac: 95000,
    chapter: 'Chương VII: Cấu kiện đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGD600', name: 'Ống cống tròn BTCT D600 L=2m', unit: 'm', norm: 1.0, price: 450000, monthlyPrice: 480000 },
      { code: 'VL_GIOANG', name: 'Gioăng cao su mối nối D600', unit: 'cái', norm: 0.5, price: 42000, monthlyPrice: 45000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp cống bậc 3.5/7', unit: 'công', norm: 0.43, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUTUHANG', name: 'Cần cẩu tự hành 5T', unit: 'ca', norm: 0.035, price: 2714000 }
    ]
  },
  {
    code: 'AG.31410',
    name: 'Lắp đặt cống tròn bê tông đúc sẵn D1000 bằng cẩu tự hành',
    unit: 'm',
    defaultPriceMat: 850000,
    defaultPriceLab: 165000,
    defaultPriceMac: 145000,
    chapter: 'Chương VII: Cấu kiện đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGD1000', name: 'Ống cống tròn BTCT D1000', unit: 'm', norm: 1.0, price: 810000, monthlyPrice: 850000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp cống bậc 3.5/7', unit: 'công', norm: 0.57, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUTUHANG', name: 'Cẩu tự hành 5T', unit: 'ca', norm: 0.053, price: 2714000 }
    ]
  },

  // ==========================================
  // CHƯƠNG VIII (AH): CỐT THÉP BÊ TÔNG
  // ==========================================
  {
    code: 'AH.11110',
    name: 'Gia công, lắp dựng cốt thép móng đường kính D <= 10mm',
    unit: 'tấn',
    defaultPriceMat: 17850000,
    defaultPriceLab: 2850000,
    defaultPriceMac: 350000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP10', name: 'Thép cuộn Hòa Phát D<=10mm CB240T', unit: 'tấn', norm: 1.02, price: 16800000, monthlyPrice: 17200000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc 1mm', unit: 'kg', norm: 15, price: 22000, monthlyPrice: 24000 },
      { code: 'VL_QUEHAN', name: 'Que hàn điện', unit: 'kg', norm: 6.5, price: 32000, monthlyPrice: 35000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc thép bậc 3.5/7', unit: 'công', norm: 9.88, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép 5kW', unit: 'ca', norm: 0.85, price: 412000 }
    ]
  },
  {
    code: 'AH.11210',
    name: 'Gia công, lắp dựng cốt thép móng đường kính D <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17450000,
    defaultPriceLab: 2450000,
    defaultPriceMac: 380000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP18', name: 'Thép thanh vằn D<=18mm CB300V/CB400V', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 16950000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc 1mm', unit: 'kg', norm: 12, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc thép bậc 3.5/7', unit: 'công', norm: 8.5, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép 5kW', unit: 'ca', norm: 0.92, price: 412000 }
    ]
  },
  {
    code: 'AH.11310',
    name: 'Gia công, lắp dựng cốt thép móng đường kính D > 18mm',
    unit: 'tấn',
    defaultPriceMat: 17350000,
    defaultPriceLab: 2250000,
    defaultPriceMac: 410000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP20', name: 'Thép thanh vằn D>18mm CB400V/CB500V', unit: 'tấn', norm: 1.03, price: 16400000, monthlyPrice: 16850000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc 1mm', unit: 'kg', norm: 11, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thép bậc 3.5/7', unit: 'công', norm: 7.8, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép', unit: 'ca', norm: 1.0, price: 412000 }
    ]
  },
  {
    code: 'AH.12110',
    name: 'Gia công, lắp dựng cốt thép cột, vách đường kính D <= 10mm',
    unit: 'tấn',
    defaultPriceMat: 17900000,
    defaultPriceLab: 3650000,
    defaultPriceMac: 360000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP10', name: 'Thép đai D<=10mm CB240T', unit: 'tấn', norm: 1.02, price: 16800000, monthlyPrice: 17200000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 16, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thép bậc 3.5/7', unit: 'công', norm: 12.66, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép', unit: 'ca', norm: 0.87, price: 412000 }
    ]
  },
  {
    code: 'AH.12210',
    name: 'Gia công, lắp dựng cốt thép cột, vách đường kính D <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17520000,
    defaultPriceLab: 3250000,
    defaultPriceMac: 420000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP18', name: 'Thép thanh vằn CB400V D<=18mm', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 16950000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 14, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thép bậc 3.5/7', unit: 'công', norm: 11.27, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép', unit: 'ca', norm: 1.02, price: 412000 }
    ]
  },
  {
    code: 'AH.13210',
    name: 'Gia công, lắp dựng cốt thép dầm, giằng đường kính D <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17480000,
    defaultPriceLab: 2950000,
    defaultPriceMac: 390000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP18', name: 'Thép vằn D<=18mm', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 16950000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 14, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thép bậc 3.5/7', unit: 'công', norm: 10.23, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn', unit: 'ca', norm: 0.95, price: 412000 }
    ]
  },
  {
    code: 'AH.14110',
    name: 'Gia công, lắp dựng cốt thép sàn, mái đường kính D <= 10mm',
    unit: 'tấn',
    defaultPriceMat: 17900000,
    defaultPriceLab: 3100000,
    defaultPriceMac: 360000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP10', name: 'Thép cuộn D<=10mm', unit: 'tấn', norm: 1.02, price: 16800000, monthlyPrice: 17200000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 18, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thép bậc 3.5/7', unit: 'công', norm: 10.75, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn', unit: 'ca', norm: 0.88, price: 412000 }
    ]
  },

  // ==========================================
  // CHƯƠNG IX (AI): VÁN KHUÔN CÔNG TRÌNH
  // ==========================================
  {
    code: 'AI.11110',
    name: 'Ván khuôn móng dài, móng cột, móng băng - ván khuôn gỗ',
    unit: '100m2',
    defaultPriceMat: 3200000,
    defaultPriceLab: 4500000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GOVAN', name: 'Gỗ ván nhóm IV xẻ', unit: 'm3', norm: 0.65, price: 4200000, monthlyPrice: 4500000 },
      { code: 'VL_DINTHEP', name: 'Đinh đỉa', unit: 'kg', norm: 28, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ mộc bậc 3.5/7', unit: 'công', norm: 15.6, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.11210',
    name: 'Ván khuôn móng ván ép phủ phim 18mm khung thép hộp',
    unit: '100m2',
    defaultPriceMat: 3850000,
    defaultPriceLab: 3950000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 22, price: 145000, monthlyPrice: 155000 },
      { code: 'VL_THEPHOP', name: 'Thép hộp giằng chống 50x50', unit: 'kg', norm: 45, price: 18500, monthlyPrice: 19500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng bậc 3.5/7', unit: 'công', norm: 13.7, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.12110',
    name: 'Ván khuôn cột vuông, chữ nhật - ván khuôn gỗ',
    unit: '100m2',
    defaultPriceMat: 4600000,
    defaultPriceLab: 7200000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GOVAN', name: 'Gỗ ván nhóm IV', unit: 'm3', norm: 0.95, price: 4200000, monthlyPrice: 4500000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ mộc bậc 3.5/7', unit: 'công', norm: 25.0, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.12210',
    name: 'Ván khuôn cột ván ép phủ phim 18mm kèm gông cột thép',
    unit: '100m2',
    defaultPriceMat: 5200000,
    defaultPriceLab: 6850000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 28, price: 145000, monthlyPrice: 155000 },
      { code: 'VL_GONGCOT', name: 'Gông cột thép định hình', unit: 'bộ', norm: 18, price: 65000, monthlyPrice: 70000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ bậc 3.5/7', unit: 'công', norm: 23.75, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.13110',
    name: 'Ván khuôn dầm, giằng - ván khuôn ván ép phủ phim 18mm',
    unit: '100m2',
    defaultPriceMat: 4950000,
    defaultPriceLab: 6400000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 26, price: 145000, monthlyPrice: 155000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng 3.5/7', unit: 'công', norm: 22.2, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.14110',
    name: 'Ván khuôn sàn, mái ván ép phủ phim 18mm kèm giàn giáo nêm',
    unit: '100m2',
    defaultPriceMat: 6500000,
    defaultPriceLab: 6200000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 32, price: 145000, monthlyPrice: 155000 },
      { code: 'VL_GIAONEM', name: 'Khấu hao giàn giáo nêm chống sàn', unit: 'bộ', norm: 35, price: 52000, monthlyPrice: 55000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng 3.5/7', unit: 'công', norm: 21.5, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AI.15110',
    name: 'Ván khuôn cầu thang bộ ván ép phủ phim kết hợp giàn giáo',
    unit: '100m2',
    defaultPriceMat: 7200000,
    defaultPriceLab: 7800000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim', unit: 'm2', norm: 36, price: 145000, monthlyPrice: 155000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ mộc bậc 3.5/7', unit: 'công', norm: 27.05, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG X (AK): HOÀN THIỆN CÔNG TRÌNH
  // ==========================================
  {
    code: 'AK.11110',
    name: 'Trát tường trong nhà bằng vữa XM mác 75 dày 1.5cm',
    unit: 'm2',
    defaultPriceMat: 38000,
    defaultPriceLab: 55000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 5.6, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATM', name: 'Cát mịn trát tường', unit: 'm3', norm: 0.022, price: 270000, monthlyPrice: 300000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát bậc 3.5/7', unit: 'công', norm: 0.19, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.008, price: 315000 }
    ]
  },
  {
    code: 'AK.11120',
    name: 'Trát tường trong nhà bằng vữa XM mác 100 dày 1.5cm',
    unit: 'm2',
    defaultPriceMat: 44000,
    defaultPriceLab: 55000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 7.2, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATM', name: 'Cát mịn', unit: 'm3', norm: 0.022, price: 270000, monthlyPrice: 300000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát 3.5/7', unit: 'công', norm: 0.19, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.008, price: 315000 }
    ]
  },
  {
    code: 'AK.11210',
    name: 'Trát tường ngoài nhà bằng vữa XM mác 75 chống thấm dày 2.0cm',
    unit: 'm2',
    defaultPriceMat: 52000,
    defaultPriceLab: 78000,
    defaultPriceMac: 3500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 7.8, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATM', name: 'Cát trát', unit: 'm3', norm: 0.028, price: 270000, monthlyPrice: 300000 },
      { code: 'VL_PHUGIA_CT', name: 'Phụ gia chống thấm Sika Latex', unit: 'lít', norm: 0.35, price: 48000, monthlyPrice: 52000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát bậc 3.5/7', unit: 'công', norm: 0.27, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.011, price: 315000 }
    ]
  },
  {
    code: 'AK.12110',
    name: 'Trát dầm, trần nhà bằng vữa XM mác 75 dày 1.5cm',
    unit: 'm2',
    defaultPriceMat: 41000,
    defaultPriceLab: 68000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 5.8, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATM', name: 'Cát mịn trát trần', unit: 'm3', norm: 0.022, price: 270000, monthlyPrice: 300000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát bậc 3.5/7', unit: 'công', norm: 0.235, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.008, price: 315000 }
    ]
  },
  {
    code: 'AK.21110',
    name: 'Láng nền sàn vữa xi măng mác 75 dày 2.0cm',
    unit: 'm2',
    defaultPriceMat: 42000,
    defaultPriceLab: 45000,
    defaultPriceMac: 2000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 6.8, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát vàng láng nền', unit: 'm3', norm: 0.026, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ láng bậc 3.5/7', unit: 'công', norm: 0.155, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.006, price: 315000 }
    ]
  },
  {
    code: 'AK.51110',
    name: 'Lát nền gạch ceramic/granite 600x600 keo dán gạch',
    unit: 'm2',
    defaultPriceMat: 185000,
    defaultPriceLab: 75000,
    defaultPriceMac: 3500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH60', name: 'Gạch granite/ceramic 600x600', unit: 'm2', norm: 1.05, price: 145000, monthlyPrice: 165000 },
      { code: 'VL_KEO', name: 'Keo dán gạch chà ron', unit: 'kg', norm: 1.5, price: 12000, monthlyPrice: 13500 },
      { code: 'VL_XM30', name: 'Xi măng PC30 lót nền', unit: 'kg', norm: 6.2, price: 1650, monthlyPrice: 1750 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Nhân công bậc 4.0/7', unit: 'công', norm: 0.245, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch bàn', unit: 'ca', norm: 0.015, price: 220000 }
    ]
  },
  {
    code: 'AK.51120',
    name: 'Lát nền gạch ceramic 300x300 chống trơn nhà vệ sinh vữa XM M75',
    unit: 'm2',
    defaultPriceMat: 145000,
    defaultPriceLab: 72000,
    defaultPriceMac: 3000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH30', name: 'Gạch chống trơn 300x300', unit: 'm2', norm: 1.05, price: 115000, monthlyPrice: 125000 },
      { code: 'VL_XM30', name: 'Xi măng PC30 lót nền', unit: 'kg', norm: 6.0, price: 1650, monthlyPrice: 1750 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ ốp lát 4.0/7', unit: 'công', norm: 0.235, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch', unit: 'ca', norm: 0.014, price: 220000 }
    ]
  },
  {
    code: 'AK.51140',
    name: 'Lát nền gạch granite bóng kiếng 800x800 keo dán gạch',
    unit: 'm2',
    defaultPriceMat: 265000,
    defaultPriceLab: 92000,
    defaultPriceMac: 4000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH80', name: 'Gạch granite bóng kiếng 800x800', unit: 'm2', norm: 1.05, price: 220000, monthlyPrice: 240000 },
      { code: 'VL_KEO', name: 'Keo dán gạch cao cấp', unit: 'kg', norm: 2.0, price: 14000, monthlyPrice: 15500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ bậc 4.0/7', unit: 'công', norm: 0.3, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch', unit: 'ca', norm: 0.018, price: 220000 }
    ]
  },
  {
    code: 'AK.52110',
    name: 'Ốp tường gạch men men bóng 300x600 vữa xi măng mác 75',
    unit: 'm2',
    defaultPriceMat: 172000,
    defaultPriceLab: 82000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHOP', name: 'Gạch ốp tường 300x600 Đồng Tâm', unit: 'm2', norm: 1.05, price: 140000, monthlyPrice: 155000 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 5.8, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_KEOMAO', name: 'Keo miết mạch chống mốc', unit: 'kg', norm: 0.45, price: 16000, monthlyPrice: 18000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ ốp lát bậc 4.0/7', unit: 'công', norm: 0.27, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch', unit: 'ca', norm: 0.012, price: 220000 }
    ]
  },
  {
    code: 'AK.53110',
    name: 'Ốp đá granite tự nhiên mặt bậc cầu thang dày 20mm bo cạnh',
    unit: 'm2',
    defaultPriceMat: 650000,
    defaultPriceLab: 185000,
    defaultPriceMac: 20000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAGRANITE', name: 'Đá hoa cương granite đen Huế / Kim Sa', unit: 'm2', norm: 1.05, price: 580000, monthlyPrice: 620000 },
      { code: 'VL_KEOOPDA', name: 'Keo dán đá Teeniax', unit: 'kg', norm: 2.5, price: 18000, monthlyPrice: 20000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ đá bậc 4.0/7', unit: 'công', norm: 0.6, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_MAIDA', name: 'Máy mài cạnh đá bo R', unit: 'ca', norm: 0.09, price: 220000 }
    ]
  },
  {
    code: 'AK.61110',
    name: 'Trần thạch cao khung xương chìm Vĩnh Tường tấm chống ẩm 9mm',
    unit: 'm2',
    defaultPriceMat: 135000,
    defaultPriceLab: 65000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XUONGVT', name: 'Khung xương Vĩnh Tường Basi', unit: 'm2', norm: 1.0, price: 68000, monthlyPrice: 72000 },
      { code: 'VL_TAMTHACHCAO', name: 'Tấm thạch cao chống ẩm 9mm', unit: 'm2', norm: 1.05, price: 54000, monthlyPrice: 58000 },
      { code: 'VL_TYREN', name: 'Ty ren + bướm treo', unit: 'bộ', norm: 1.2, price: 6500, monthlyPrice: 7000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thạch cao bậc 3.5/7', unit: 'công', norm: 0.22, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.61120',
    name: 'Trần thạch cao khung xương nổi (trần thả) tấm phủ PVC 600x600',
    unit: 'm2',
    defaultPriceMat: 115000,
    defaultPriceLab: 52000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XUONGNOI', name: 'Khung xương nổi Topline', unit: 'm2', norm: 1.0, price: 52000, monthlyPrice: 56000 },
      { code: 'VL_TAMTHA', name: 'Tấm thả thạch cao phủ PVC 600x600', unit: 'm2', norm: 1.02, price: 48000, monthlyPrice: 52000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ bậc 3.5/7', unit: 'công', norm: 0.18, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.71110',
    name: 'Lợp mái tôn xốp cách nhiệt PU 3 lớp sóng vuông dày 0.45mm',
    unit: 'm2',
    defaultPriceMat: 185000,
    defaultPriceLab: 48000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TONXOP', name: 'Tôn mát cách nhiệt PU Hoa Sen 0.45mm', unit: 'm2', norm: 1.05, price: 165000, monthlyPrice: 175000 },
      { code: 'VL_VITBẮN', name: 'Vít tự khoan đệm cao su', unit: 'con', norm: 6, price: 1200, monthlyPrice: 1300 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lợp tôn 3.5/7', unit: 'công', norm: 0.165, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.81110',
    name: 'Lắp đặt cửa đi nhôm Xingfa hệ 55 kính dán an toàn 8.38mm',
    unit: 'm2',
    defaultPriceMat: 1750000,
    defaultPriceLab: 240000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUANHOM', name: 'Cửa nhôm Xingfa kính an toàn 8.38mm', unit: 'm2', norm: 1.0, price: 1650000, monthlyPrice: 1750000 },
      { code: 'VL_KEOBONG', name: 'Keo Silicon Apollo A500', unit: 'tuýp', norm: 0.8, price: 45000, monthlyPrice: 48000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp cửa bậc 4.0/7', unit: 'công', norm: 0.78, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.81120',
    name: 'Lắp đặt cửa sổ nhôm Xingfa mở quay/lùa hệ 55 kính dán an toàn',
    unit: 'm2',
    defaultPriceMat: 1550000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUASO', name: 'Cửa sổ nhôm Xingfa hệ 55 kính 6.38mm', unit: 'm2', norm: 1.0, price: 1450000, monthlyPrice: 1550000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp cửa bậc 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.91110',
    name: 'Sơn tường trong nhà 1 nước lót 2 nước phủ Maxilite/Dulux',
    unit: 'm2',
    defaultPriceMat: 38000,
    defaultPriceLab: 32000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BOTBA', name: 'Bột bả tường trong nhà', unit: 'kg', norm: 0.95, price: 9000, monthlyPrice: 10500 },
      { code: 'VL_SONLOT', name: 'Sơn lót kháng kiềm', unit: 'kg', norm: 0.12, price: 58000, monthlyPrice: 62000 },
      { code: 'VL_SONPHU', name: 'Sơn phủ nội thất Maxilite', unit: 'kg', norm: 0.22, price: 65000, monthlyPrice: 70000 },
      { code: 'VL_GIAYNHAM', name: 'Giấy ráp mịn', unit: 'tờ', norm: 0.5, price: 3500, monthlyPrice: 4000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.11, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.91210',
    name: 'Sơn tường ngoài nhà 1 nước lót kháng kiềm 2 nước phủ Weathershield',
    unit: 'm2',
    defaultPriceMat: 58000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONNGOAI', name: 'Sơn phủ ngoại thất Dulux Weathershield', unit: 'kg', norm: 0.25, price: 125000, monthlyPrice: 135000 },
      { code: 'VL_SONLOT_NG', name: 'Sơn lót ngoại thất kháng kiềm muối', unit: 'kg', norm: 0.14, price: 78000, monthlyPrice: 85000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sơn bậc 3.5/7', unit: 'công', norm: 0.155, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.95110',
    name: 'Quét chống thấm màng gốc xi măng polyme SikaTop Seal 107 2 lớp',
    unit: 'm2',
    defaultPriceMat: 65000,
    defaultPriceLab: 38000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SIKA107', name: 'Vữa chống thấm SikaTop Seal 107', unit: 'kg', norm: 2.2, price: 26000, monthlyPrice: 28000 },
      { code: 'VL_LUOITHUY', name: 'Lưới thủy tinh gia cường góc chân tường', unit: 'm2', norm: 0.2, price: 12000, monthlyPrice: 13000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ chống thấm 3.5/7', unit: 'công', norm: 0.13, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG XI (BA, BB, BC, BD): CƠ ĐIỆN MEP & PCCC
  // ==========================================
  {
    code: 'BA.11110',
    name: 'Lắp đặt ống cấp nước nóng lạnh PPR D20 hàn nhiệt chìm tường',
    unit: 'm',
    defaultPriceMat: 36000,
    defaultPriceLab: 32000,
    defaultPriceMac: 2500,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPPR20', name: 'Ống hàn nhiệt PPR D20 Tiền Phong', unit: 'm', norm: 1.05, price: 25000, monthlyPrice: 27000 },
      { code: 'VL_PHUKIEN20', name: 'Phụ kiện tê, co cút D20', unit: 'cái', norm: 1.2, price: 6500, monthlyPrice: 7500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện nước bậc 4.0/7', unit: 'công', norm: 0.105, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_HANNHIET', name: 'Máy hàn nhiệt PPR', unit: 'ca', norm: 0.01, price: 250000 }
    ]
  },
  {
    code: 'BA.11120',
    name: 'Lắp đặt ống cấp nước nóng lạnh PPR D25 đi chìm tường',
    unit: 'm',
    defaultPriceMat: 45000,
    defaultPriceLab: 38000,
    defaultPriceMac: 2500,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPPR', name: 'Ống hàn nhiệt PPR D25 Tiền Phong', unit: 'm', norm: 1.05, price: 32000, monthlyPrice: 35000 },
      { code: 'VL_PHUKIEN', name: 'Phụ kiện tê, co cút D25', unit: 'cái', norm: 1.2, price: 8500, monthlyPrice: 9500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện nước bậc 4.0/7', unit: 'công', norm: 0.124, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_HANNHIET', name: 'Máy hàn nhiệt PPR', unit: 'ca', norm: 0.01, price: 250000 }
    ]
  },
  {
    code: 'BA.11130',
    name: 'Lắp đặt ống cấp nước nóng lạnh PPR D32 hàn nhiệt',
    unit: 'm',
    defaultPriceMat: 62000,
    defaultPriceLab: 45000,
    defaultPriceMac: 3000,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPPR32', name: 'Ống PPR D32 Tiền Phong', unit: 'm', norm: 1.05, price: 48000, monthlyPrice: 52000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện nước bậc 4.0/7', unit: 'công', norm: 0.147, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_HANNHIET', name: 'Máy hàn nhiệt', unit: 'ca', norm: 0.012, price: 250000 }
    ]
  },
  {
    code: 'BA.21110',
    name: 'Lắp đặt ống thoát nước uPVC D90 Class 2 dán keo',
    unit: 'm',
    defaultPriceMat: 62000,
    defaultPriceLab: 38000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPVC90', name: 'Ống uPVC D90 C2 Tiền Phong', unit: 'm', norm: 1.04, price: 52000, monthlyPrice: 56000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nước bậc 4.0/7', unit: 'công', norm: 0.124, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BA.21120',
    name: 'Lắp đặt ống thoát nước thải uPVC D110 Class 2 dán keo',
    unit: 'm',
    defaultPriceMat: 88000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPVC110', name: 'Ống uPVC D110 C2 Tiền Phong', unit: 'm', norm: 1.04, price: 72000, monthlyPrice: 78000 },
      { code: 'VL_KEO_PVC', name: 'Keo dán ống PVC', unit: 'hộp', norm: 0.08, price: 35000, monthlyPrice: 38000 },
      { code: 'VL_DAIOM', name: 'Đai ôm ống và đinh vít', unit: 'bộ', norm: 1.0, price: 9000, monthlyPrice: 9500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nước bậc 4.0/7', unit: 'công', norm: 0.147, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BB.11110',
    name: 'Lắp đặt bồn cầu Inax 2 khối xả nhấn kèm phụ kiện vòi xịt',
    unit: 'bộ',
    defaultPriceMat: 2850000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_BONCAU', name: 'Bồn cầu Inax C-117VA', unit: 'bộ', norm: 1.0, price: 2650000, monthlyPrice: 2800000 },
      { code: 'VL_VOIXIT', name: 'Vòi xịt vệ sinh inox + van T', unit: 'bộ', norm: 1.0, price: 160000, monthlyPrice: 175000 },
      { code: 'VL_SILICON', name: 'Keo silicon trắng chống nấm', unit: 'tuýp', norm: 0.5, price: 45000, monthlyPrice: 48000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ bậc 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BB.11210',
    name: 'Lắp đặt chậu rửa mặt Lavabo treo tường chân lửng kèm vòi nóng lạnh',
    unit: 'bộ',
    defaultPriceMat: 1450000,
    defaultPriceLab: 180000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_LAVABO', name: 'Chậu rửa Lavabo Inax + vòi gật gù nóng lạnh', unit: 'bộ', norm: 1.0, price: 1350000, monthlyPrice: 1450000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nước 4.0/7', unit: 'công', norm: 0.59, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BB.12110',
    name: 'Lắp đặt bộ sen tắm nóng lạnh tăng áp',
    unit: 'bộ',
    defaultPriceMat: 1650000,
    defaultPriceLab: 150000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SENTAM', name: 'Bộ cây sen tắm nóng lạnh Inox 304', unit: 'bộ', norm: 1.0, price: 1550000, monthlyPrice: 1650000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nước 4.0/7', unit: 'công', norm: 0.49, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.11110',
    name: 'Kéo rải dây điện đơn Cu/PVC 1x1.5mm2 luồn ống gen',
    unit: '100m',
    defaultPriceMat: 750000,
    defaultPriceLab: 480000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAY15', name: 'Dây điện Cadivi 1x1.5mm2', unit: 'm', norm: 105, price: 5800, monthlyPrice: 6200 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện bậc 4.0/7', unit: 'công', norm: 1.57, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.11120',
    name: 'Kéo rải dây điện đôi Cu/PVC 2x2.5mm2 luồn ống gen chống cháy',
    unit: '100m',
    defaultPriceMat: 1850000,
    defaultPriceLab: 780000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAYDIEN', name: 'Dây điện Cadivi 2x2.5mm2', unit: 'm', norm: 105, price: 14500, monthlyPrice: 15500 },
      { code: 'VL_ONGGEN', name: 'Ống gen luồn dây chống cháy D20', unit: 'm', norm: 102, price: 3200, monthlyPrice: 3500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện bậc 4.0/7', unit: 'công', norm: 2.55, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.11130',
    name: 'Kéo rải dây điện đôi Cu/PVC 2x4.0mm2 cấp nguồn điều hòa, bếp từ',
    unit: '100m',
    defaultPriceMat: 2650000,
    defaultPriceLab: 880000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAY40', name: 'Dây điện Cadivi 2x4.0mm2', unit: 'm', norm: 105, price: 21500, monthlyPrice: 23000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện bậc 4.0/7', unit: 'công', norm: 2.88, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.21110',
    name: 'Lắp đặt tủ điện tổng âm tường 12 module kèm MCB 2P 40A',
    unit: 'bộ',
    defaultPriceMat: 650000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TUDIEN', name: 'Vỏ tủ điện âm tường 12 module Sino', unit: 'cái', norm: 1.0, price: 280000, monthlyPrice: 310000 },
      { code: 'VL_MCB', name: 'Aptomat MCB 2P 40A Panasonic', unit: 'cái', norm: 1.0, price: 310000, monthlyPrice: 340000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.31110',
    name: 'Lắp đặt đèn LED Downlight âm trần 9W Rạng Đông/Philips',
    unit: 'bộ',
    defaultPriceMat: 98000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DENLED9W', name: 'Đèn LED âm trần 9W D90 Rạng Đông', unit: 'bộ', norm: 1.0, price: 88000, monthlyPrice: 95000 },
      { code: 'VL_BANGKEODIEN', name: 'Băng dính cách điện 3M', unit: 'cuộn', norm: 0.1, price: 12000, monthlyPrice: 13000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện bậc 4.0/7', unit: 'công', norm: 0.147, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.31210',
    name: 'Lắp đặt đèn LED Panel âm trần 600x600 công suất 48W văn phòng',
    unit: 'bộ',
    defaultPriceMat: 385000,
    defaultPriceLab: 75000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PANEL60', name: 'Đèn LED Panel 600x600 48W Rạng Đông', unit: 'bộ', norm: 1.0, price: 360000, monthlyPrice: 385000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện 4.0/7', unit: 'công', norm: 0.245, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.11110',
    name: 'Lắp đặt đầu phun Sprinkler Tyco 68°C kèm phụ kiện nối ren D15',
    unit: 'cái',
    defaultPriceMat: 65000,
    defaultPriceLab: 48000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SPRINKLER', name: 'Đầu phun Sprinkler hướng xuống Tyco', unit: 'cái', norm: 1.0, price: 58000, monthlyPrice: 62000 },
      { code: 'VL_BANGTAN', name: 'Băng tan teflon chống rò', unit: 'cuộn', norm: 0.2, price: 5000, monthlyPrice: 5500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ PCCC bậc 4.0/7', unit: 'công', norm: 0.157, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.12110',
    name: 'Lắp đặt họng cứu hỏa vách tường D65 van góc kèm lăng cuộn vòi DN65',
    unit: 'bộ',
    defaultPriceMat: 1450000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_HONGPCCC', name: 'Tủ cứu hỏa vách tường kèm cuộn vòi D65 và van góc', unit: 'bộ', norm: 1.0, price: 1350000, monthlyPrice: 1450000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ PCCC 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG XII (SA): SỬA CHỮA, CẢI TẠO & PHÁ DỠ
  // ==========================================
  {
    code: 'SA.11110',
    name: 'Phá dỡ bê tông cốt thép bằng búa căn kết hợp thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 680000,
    defaultPriceMac: 285000,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 2.35, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BUACAN', name: 'Máy nén khí + búa căn phá đá bê tông', unit: 'ca', norm: 0.32, price: 890000 }
    ]
  },
  {
    code: 'SA.11120',
    name: 'Phá dỡ bê tông không cốt thép bằng máy khoan phá',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 380000,
    defaultPriceMac: 150000,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công 3.0/7', unit: 'công', norm: 1.52, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_KHOANPHA', name: 'Máy đục bê tông cầm tay', unit: 'ca', norm: 0.45, price: 333000 }
    ]
  },
  {
    code: 'SA.12110',
    name: 'Đục phá dỡ tường gạch chiều dày <= 220mm bằng thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 265000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.06, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'SA.12120',
    name: 'Đục phá tường gạch chiều dày <= 110mm làm cửa đi mới',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 310000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.24, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'SA.13110',
    name: 'Dóc lớp vữa trát tường cũ bị rộp ố mốc chuẩn bị trát lại',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 28000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.112, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'SA.14110',
    name: 'Dóc gạch ốp, lát nền cũ và vữa lót chuẩn bị ốp lát lại',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.14, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'SA.15110',
    name: 'Tháo dỡ mái tôn, xà gồ thép cũ tận dụng hoặc thanh lý',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 26000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công 3.0/7', unit: 'công', norm: 0.104, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },

  // ==========================================
  // MÃ HIỆU TRUYỀN THỐNG & TƯƠNG THÍCH (LEGACY)
  // ==========================================
  {
    code: 'AF.61120',
    name: 'Sản xuất, lắp dựng cốt thép móng đường kính <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17450000,
    defaultPriceLab: 2450000,
    defaultPriceMac: 380000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEP18', name: 'Thép thanh vằn D<=18mm CB300V/CB400V', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 16950000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc 1mm', unit: 'kg', norm: 12, price: 22000, monthlyPrice: 24000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc thép bậc 3.5/7', unit: 'công', norm: 8.5, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép 5kW', unit: 'ca', norm: 0.92, price: 412000 }
    ]
  },
  {
    code: 'AF.12320',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1120000,
    defaultPriceLab: 480000,
    defaultPriceMac: 65000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 345, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.66, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.14, price: 315000 },
      { code: 'M_DAMDUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.18, price: 120000 }
    ]
  },
  {
    code: 'AF.12420',
    name: 'Bê tông dầm, sàn đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1085000,
    defaultPriceLab: 395000,
    defaultPriceMac: 55000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 330, price: 1820, monthlyPrice: 1950 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 280000, monthlyPrice: 320000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 340000, monthlyPrice: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.37, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn 250L', unit: 'ca', norm: 0.13, price: 315000 },
      { code: 'M_DAMBAN', name: 'Đầm bàn 1.1kW', unit: 'ca', norm: 0.14, price: 110000 }
    ]
  },
  {
    code: 'AF.81210',
    name: 'Ván khuôn cột, dầm sàn gỗ phủ phim, giáo chống thép',
    unit: '100m2',
    defaultPriceMat: 6500000,
    defaultPriceLab: 6200000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 32, price: 145000, monthlyPrice: 155000 },
      { code: 'VL_GIAONEM', name: 'Khấu hao giàn giáo nêm chống sàn', unit: 'bộ', norm: 35, price: 52000, monthlyPrice: 55000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng 3.5/7', unit: 'công', norm: 21.5, price: 288324, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BB.11111',
    name: 'Xây tường gạch ống 8x8x19 dày 10cm, vữa XM mác 75',
    unit: 'm3',
    defaultPriceMat: 985000,
    defaultPriceLab: 590000,
    defaultPriceMac: 28000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHONG', name: 'Gạch tuynel 8x8x19', unit: 'viên', norm: 620, price: 1200, monthlyPrice: 1350 },
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 78, price: 1650, monthlyPrice: 1750 },
      { code: 'VL_CATV', name: 'Cát hạt vừa', unit: 'm3', norm: 0.32, price: 280000, monthlyPrice: 320000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.05, price: 288324, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.09, price: 315000 }
    ]
  },
  {
    code: 'AK.51210',
    name: 'Lát nền gạch ceramic 600x600 vữa xi măng mác 75',
    unit: 'm2',
    defaultPriceMat: 185000,
    defaultPriceLab: 75000,
    defaultPriceMac: 3500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH60', name: 'Gạch granite/ceramic 600x600', unit: 'm2', norm: 1.05, price: 145000, monthlyPrice: 165000 },
      { code: 'VL_KEO', name: 'Keo dán gạch chà ron', unit: 'kg', norm: 1.5, price: 12000, monthlyPrice: 13500 },
      { code: 'VL_XM30', name: 'Xi măng PC30 lót nền', unit: 'kg', norm: 6.2, price: 1650, monthlyPrice: 1750 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Nhân công bậc 4.0/7', unit: 'công', norm: 0.245, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch bàn', unit: 'ca', norm: 0.015, price: 220000 }
    ]
  },
  {
    code: 'AL.21110',
    name: 'Kéo rải dây điện đôi Cu/PVC 2x2.5mm2 luồn ống gen',
    unit: '100m',
    defaultPriceMat: 1850000,
    defaultPriceLab: 780000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Lắp đặt MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAYDIEN', name: 'Dây điện Cadivi 2x2.5mm2', unit: 'm', norm: 105, price: 14500, monthlyPrice: 15500 },
      { code: 'VL_ONGGEN', name: 'Ống gen luồn dây chống cháy D20', unit: 'm', norm: 102, price: 3200, monthlyPrice: 3500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ điện bậc 4.0/7', unit: 'công', norm: 2.55, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },

  // ==========================================
  // BỔ SUNG ĐẦY ĐỦ CÁC MÃ ĐỊNH MỨC BXD TIÊU CHUẨN
  // TT 12/2021/TT-BXD & TT 14/2023/TT-BXD
  // ==========================================

  // --- AA: CHUẨN BỊ MẶT BẰNG BỔ SUNG ---
  {
    code: 'AA.11410',
    name: 'Định vị tim mốc công trình bằng máy toàn đạc điện tử Leica',
    unit: '100m',
    defaultPriceMat: 35000,
    defaultPriceLab: 185000,
    defaultPriceMac: 95000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COCGOTH', name: 'Cọc gỗ, sơn đỏ đánh dấu mốc', unit: 'cọc', norm: 10, price: 3500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Kỹ sư trắc địa bậc 4.0/7', unit: 'công', norm: 0.65, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_TOANDAC', name: 'Máy toàn đạc điện tử kèm gương', unit: 'ca', norm: 0.25, price: 380000 }
    ]
  },
  {
    code: 'AA.12110',
    name: 'Chặt hạ cây bóng mát đường kính > 30cm bằng cưa xăng cầm tay',
    unit: 'cây',
    defaultPriceMat: 15000,
    defaultPriceLab: 145000,
    defaultPriceMac: 65000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XANGNHO', name: 'Xăng nhớt chạy máy cưa', unit: 'lít', norm: 0.6, price: 25000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.52, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CUAXANG', name: 'Máy cưa xích xăng', unit: 'ca', norm: 0.18, price: 360000 }
    ]
  },
  {
    code: 'AA.13210',
    name: 'San gạt mặt bằng thi công bằng máy ủi công suất 110CV',
    unit: '1000m2',
    defaultPriceMat: 0,
    defaultPriceLab: 110000,
    defaultPriceMac: 850000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lái máy bậc 3.5/7', unit: 'công', norm: 0.40, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UI110', name: 'Máy ủi 110CV', unit: 'ca', norm: 0.33, price: 2570000 }
    ]
  },

  // --- AB: ĐÀO ĐẮP ĐẤT ĐÁ BỔ SUNG ---
  {
    code: 'AB.11120',
    name: 'Đào móng băng đất cấp 2 bằng thủ công sâu <= 1.25m',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 195000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.78, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11210',
    name: 'Đào rãnh thoát nước, hố ga thủ công đất cấp 2 sâu <= 1m',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 175000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.70, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.21110',
    name: 'Vận chuyển đất thừa cự ly 1km bằng ô tô tự đổ 7T',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 6500,
    defaultPriceMac: 38000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công phụ xe bậc 3.0/7', unit: 'công', norm: 0.026, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_OTO7T', name: 'Ô tô tự đổ 7T', unit: 'ca', norm: 0.024, price: 1580000 }
    ]
  },
  {
    code: 'AB.25120',
    name: 'Đắp đất móng công trình đầm chặt K95 bằng máy đầm cóc',
    unit: 'm3',
    defaultPriceMat: 85000,
    defaultPriceLab: 62000,
    defaultPriceMac: 28000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DATCAP', name: 'Đất cấp phối chọn lọc', unit: 'm3', norm: 1.15, price: 74000, monthlyPrice: 85000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.25, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DAMCOC', name: 'Máy đầm cóc Mikasa', unit: 'ca', norm: 0.08, price: 350000 }
    ]
  },
  {
    code: 'AB.31210',
    name: 'Đào đất hố móng bằng máy đào bánh xích gầu 0.4m3 đất cấp 2',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 320000,
    defaultPriceMac: 1450000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ máy bậc 3.5/7', unit: 'công', norm: 1.15, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_XUC04', name: 'Máy đào gầu 0.4m3', unit: 'ca', norm: 0.65, price: 2230000 }
    ]
  },
  {
    code: 'AB.65110',
    name: 'Bơm hút nước hố móng bằng máy bơm nước D100 công suất 7.5kW',
    unit: 'ca',
    defaultPriceMat: 65000,
    defaultPriceLab: 125000,
    defaultPriceMac: 240000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DIEN', name: 'Điện năng vận hành bơm', unit: 'kWh', norm: 42, price: 1550 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công vận hành bậc 3.0/7', unit: 'công', norm: 0.50, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_BOM100', name: 'Máy bơm chìm D100', unit: 'ca', norm: 1.0, price: 240000 }
    ]
  },

  // --- AC: CỌC & MÓNG SÂU BỔ SUNG ---
  {
    code: 'AC.11210',
    name: 'Ép cọc bê tông cốt thép 250x250 máy ép thuỷ lực 120T',
    unit: '100m',
    defaultPriceMat: 1850000,
    defaultPriceLab: 2200000,
    defaultPriceMac: 4800000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_QUEHAN', name: 'Que hàn nối cọc', unit: 'kg', norm: 12, price: 32000 },
      { code: 'VL_THEPTAM', name: 'Thép tấm nối cọc dày 6mm', unit: 'kg', norm: 45, price: 18500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ ép cọc bậc 3.5/7', unit: 'công', norm: 7.9, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EP120T', name: 'Máy ép cọc thuỷ lực 120T', unit: 'ca', norm: 1.15, price: 4170000 }
    ]
  },
  {
    code: 'AC.12210',
    name: 'Nối cọc bê tông cốt thép bằng bản mã thép hàn điện',
    unit: 'mối nối',
    defaultPriceMat: 125000,
    defaultPriceLab: 85000,
    defaultPriceMac: 45000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPMA', name: 'Bản mã thép 4 góc', unit: 'kg', norm: 5.5, price: 18500 },
      { code: 'VL_QUEHAN', name: 'Que hàn chịu lực E42', unit: 'kg', norm: 0.8, price: 32000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ hàn bậc 4.0/7', unit: 'công', norm: 0.28, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_MAYHAN', name: 'Máy hàn điện 23kW', unit: 'ca', norm: 0.12, price: 375000 }
    ]
  },
  {
    code: 'AC.21210',
    name: 'Đóng cọc ván thép Larsen IV bằng búa rung điện 60kW',
    unit: '100m',
    defaultPriceMat: 450000,
    defaultPriceLab: 1850000,
    defaultPriceMac: 4200000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DIEN', name: 'Điện năng chạy búa', unit: 'kWh', norm: 180, price: 1550 },
      { code: 'VL_HAOMON', name: 'Hao hụt cọc ván thép thuê', unit: '%', norm: 1, price: 170000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ bậc 3.5/7', unit: 'công', norm: 6.65, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BUARUNG', name: 'Búa rung 60kW kèm cẩu 25T', unit: 'ca', norm: 0.85, price: 4940000 }
    ]
  },
  {
    code: 'AC.23110',
    name: 'Nhổ cọc ván thép Larsen IV bằng búa rung 60kW',
    unit: '100m',
    defaultPriceMat: 320000,
    defaultPriceLab: 1450000,
    defaultPriceMac: 3600000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DIEN', name: 'Điện năng chạy búa', unit: 'kWh', norm: 140, price: 1550 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 5.2, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BUARUNG', name: 'Búa rung kèm cẩu 25T', unit: 'ca', norm: 0.72, price: 5000000 }
    ]
  },
  {
    code: 'AC.33110',
    name: 'Khoan cọc nhồi đường kính D1200mm trong đất có dung dịch bentonite',
    unit: 'm',
    defaultPriceMat: 420000,
    defaultPriceLab: 680000,
    defaultPriceMac: 1850000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BENTONITE', name: 'Bentonite tạo vách', unit: 'kg', norm: 35, price: 4800 },
      { code: 'VL_POLYMERS', name: 'Phụ gia Polymer giữ thành', unit: 'kg', norm: 1.2, price: 85000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ thợ khoan bậc 4.0/7', unit: 'công', norm: 2.22, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANNHOP', name: 'Máy khoan cọc nhồi Bauer/Sany', unit: 'ca', norm: 0.18, price: 10270000 }
    ]
  },
  {
    code: 'AC.35110',
    name: 'Thử tĩnh cọc bê tông cốt thép tải trọng nén tĩnh 150T',
    unit: 'cọc',
    defaultPriceMat: 850000,
    defaultPriceLab: 4500000,
    defaultPriceMac: 6500000,
    chapter: 'Chương III: Cọc & Nền móng sâu',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGBIENTHI', name: 'Biểu mẫu và sensor đo độ lún', unit: 'bộ', norm: 1, price: 850000 }
    ],
    labors: [
      { code: 'NC_4.5', name: 'Kỹ sư trắc địa thí nghiệm', unit: 'công', norm: 13.5, price: 333000, rank: '4.5/7' }
    ],
    machines: [
      { code: 'M_KICH200T', name: 'Hệ giàn kích thuỷ lực và dầm thép thử tĩnh', unit: 'ca', norm: 3.5, price: 1850000 }
    ]
  },

  // --- AD: ĐƯỜNG & HẠ TẦNG BỔ SUNG ---
  {
    code: 'AD.13110',
    name: 'Làm móng cấp phối đá dăm loại 1 lu lèn đạt K98 dày 15cm',
    unit: '100m2',
    defaultPriceMat: 5800000,
    defaultPriceLab: 650000,
    defaultPriceMac: 1950000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CPDD1', name: 'Cấp phối đá dăm loại 1', unit: 'm3', norm: 19.5, price: 290000, monthlyPrice: 320000 },
      { code: 'VL_NUOC', name: 'Nước tưới lu ẩm', unit: 'm3', norm: 4.5, price: 18000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 2.33, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_LURUNG', name: 'Xe lu rung 14T', unit: 'ca', norm: 0.45, price: 2450000 },
      { code: 'M_XETUOI', name: 'Xe tưới nước 5m3', unit: 'ca', norm: 0.25, price: 1650000 }
    ]
  },
  {
    code: 'AD.22110',
    name: 'Tưới nhựa dính bám thấm nhập tiêu chuẩn 1.0 kg/m2',
    unit: '100m2',
    defaultPriceMat: 1850000,
    defaultPriceLab: 220000,
    defaultPriceMac: 450000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_NHUALONG', name: 'Nhũ tương nhựa đường axit CRS-1', unit: 'kg', norm: 105, price: 17500, monthlyPrice: 18500 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.88, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_TUOINHUA', name: 'Xe phun tưới nhựa chuyên dụng', unit: 'ca', norm: 0.15, price: 3000000 }
    ]
  },
  {
    code: 'AD.24110',
    name: 'Thảm bê tông nhựa chặt C12.5 dày 5cm lu lèn K98',
    unit: '100m2',
    defaultPriceMat: 16500000,
    defaultPriceLab: 1250000,
    defaultPriceMac: 3800000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTNC125', name: 'Bê tông nhựa nóng C12.5', unit: 'tấn', norm: 12.2, price: 1350000, monthlyPrice: 1420000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ thảm đường bậc 3.5/7', unit: 'công', norm: 4.5, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RAITHAM', name: 'Máy rải thảm bê tông nhựa Vogele', unit: 'ca', norm: 0.35, price: 4500000 },
      { code: 'M_LULOP', name: 'Lu bánh lốp 16T kèm lu sắt 10T', unit: 'ca', norm: 0.65, price: 3400000 }
    ]
  },
  {
    code: 'AD.32110',
    name: 'Đúc và lắp đặt bó vỉa bê tông xi măng M200 đúc sẵn 15x30x100cm',
    unit: '100m',
    defaultPriceMat: 6200000,
    defaultPriceLab: 1850000,
    defaultPriceMac: 450000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BOVIA', name: 'Bó vỉa bê tông đúc sẵn 15x30x100', unit: 'viên', norm: 102, price: 58000, monthlyPrice: 62000 },
      { code: 'VL_VUAM75', name: 'Vữa xi măng chèn khe M75', unit: 'm3', norm: 0.85, price: 820000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây lắp bậc 3.5/7', unit: 'công', norm: 6.65, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUCONG', name: 'Cần cẩu tự hành 3.5T', unit: 'ca', norm: 0.18, price: 2500000 }
    ]
  },
  {
    code: 'AD.42110',
    name: 'Sơn kẻ đường giao thông bằng sơn nhiệt dẻo phản quang màu trắng',
    unit: 'm2',
    defaultPriceMat: 165000,
    defaultPriceLab: 45000,
    defaultPriceMac: 25000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONNHIET', name: 'Sơn dẻo nhiệt màu trắng', unit: 'kg', norm: 4.8, price: 28000 },
      { code: 'VL_HATPHAN', name: 'Hạt bi thuỷ tinh phản quang', unit: 'kg', norm: 0.45, price: 35000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.16, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_KEDUONG', name: 'Máy nấu và kẻ sơn nhiệt dẻo', unit: 'ca', norm: 0.05, price: 500000 }
    ]
  },

  // --- AE: XÂY GẠCH ĐÁ BỔ SUNG ---
  {
    code: 'AE.11120',
    name: 'Xây móng gạch đặc vữa xi măng mác 75 chiều dày > 330mm',
    unit: 'm3',
    defaultPriceMat: 890000,
    defaultPriceLab: 450000,
    defaultPriceMac: 15000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHDAC', name: 'Gạch đặc đất sét nung A1', unit: 'viên', norm: 550, price: 1250, monthlyPrice: 1350 },
      { code: 'VL_VUAM75', name: 'Vữa XM mác 75', unit: 'm3', norm: 0.28, price: 820000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.62, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRONVUA', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.05, price: 315000 }
    ]
  },
  {
    code: 'AE.12120',
    name: 'Xây tường bao dày 220mm gạch ống 4 lỗ 8x8x19 vữa XM M75',
    unit: 'm3',
    defaultPriceMat: 820000,
    defaultPriceLab: 580000,
    defaultPriceMac: 18000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH4LO', name: 'Gạch ống 4 lỗ 8x8x19', unit: 'viên', norm: 620, price: 1050, monthlyPrice: 1150 },
      { code: 'VL_VUAM75', name: 'Vữa XM mác 75', unit: 'm3', norm: 0.29, price: 820000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.08, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng vật liệu 0.8T', unit: 'ca', norm: 0.03, price: 600000 }
    ]
  },
  {
    code: 'AE.12130',
    name: 'Xây tường ngăn dày 100mm gạch bê tông nhẹ bọt khí AAC vữa chuyên dụng',
    unit: 'm3',
    defaultPriceMat: 1250000,
    defaultPriceLab: 420000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHAAC', name: 'Gạch nhẹ AAC 600x200x100', unit: 'm3', norm: 1.02, price: 1050000, monthlyPrice: 1100000 },
      { code: 'VL_KEOAAC', name: 'Keo xây chuyên dụng AAC', unit: 'kg', norm: 18, price: 8500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 1.51, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.14110',
    name: 'Xây bó nền, bậc tam cấp gạch đặc vữa xi măng mác 75',
    unit: 'm3',
    defaultPriceMat: 920000,
    defaultPriceLab: 680000,
    defaultPriceMac: 12000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHDAC', name: 'Gạch đặc đất sét nung', unit: 'viên', norm: 580, price: 1250 },
      { code: 'VL_VUAM75', name: 'Vữa XM mác 75', unit: 'm3', norm: 0.31, price: 820000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây bậc 3.5/7', unit: 'công', norm: 2.45, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRONVUA', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.04, price: 315000 }
    ]
  },
  {
    code: 'AE.51110',
    name: 'Xây kè bờ kè móng bằng đá hộc vữa xi măng mác 100',
    unit: 'm3',
    defaultPriceMat: 650000,
    defaultPriceLab: 480000,
    defaultPriceMac: 15000,
    chapter: 'Chương V: Xây gạch đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAHOC', name: 'Đá hộc khai thác chọn lọc', unit: 'm3', norm: 1.18, price: 340000, monthlyPrice: 380000 },
      { code: 'VL_VUAM100', name: 'Vữa XM mác 100', unit: 'm3', norm: 0.35, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây đá bậc 3.5/7', unit: 'công', norm: 1.72, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRONVUA', name: 'Máy trộn vữa 250L', unit: 'ca', norm: 0.05, price: 315000 }
    ]
  },

  // --- AF: BÊ TÔNG TẠI CHỖ BỔ SUNG ---
  {
    code: 'AF.11120',
    name: 'Bê tông lót móng đá 1x2 mác 100 vữa trộn máy đổ thủ công',
    unit: 'm3',
    defaultPriceMat: 780000,
    defaultPriceLab: 220000,
    defaultPriceMac: 35000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 215, price: 1650 },
      { code: 'VL_CATV', name: 'Cát vàng đổ bê tông', unit: 'm3', norm: 0.52, price: 280000 },
      { code: 'VL_DA12', name: 'Đá 1x2 xanh', unit: 'm3', norm: 0.88, price: 320000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.88, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_TRON250', name: 'Máy trộn bê tông 250L', unit: 'ca', norm: 0.11, price: 315000 }
    ]
  },
  {
    code: 'AF.13220',
    name: 'Bê tông cột vách dày > 20cm mác 300 đá 1x2 vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1150000,
    defaultPriceLab: 480000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 385, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng sàng sạch', unit: 'm3', norm: 0.46, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2 chọn lọc', unit: 'm3', norm: 0.86, price: 330000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ đổ bê tông bậc 3.5/7', unit: 'công', norm: 1.72, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.15, price: 220000 },
      { code: 'M_VANTHANG', name: 'Vận thăng 0.8T', unit: 'ca', norm: 0.08, price: 650000 }
    ]
  },
  {
    code: 'AF.14210',
    name: 'Bê tông dầm giằng nhà cao tầng mác 300 đá 1x2',
    unit: 'm3',
    defaultPriceMat: 1120000,
    defaultPriceLab: 420000,
    defaultPriceMac: 75000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 375, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.47, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 330000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.51, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUI', name: 'Máy đầm dùi', unit: 'ca', norm: 0.14, price: 220000 }
    ]
  },
  {
    code: 'AF.15210',
    name: 'Bê tông sàn mái, ban công mác 250 đá 1x2 phụ gia chống thấm',
    unit: 'm3',
    defaultPriceMat: 1080000,
    defaultPriceLab: 360000,
    defaultPriceMac: 65000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 345, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.48, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 330000 },
      { code: 'VL_SIKACT', name: 'Phụ gia chống thấm Sika Plastocrete N', unit: 'lít', norm: 1.5, price: 55000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.29, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAMBAN', name: 'Máy đầm bàn 1.1kW', unit: 'ca', norm: 0.12, price: 210000 },
      { code: 'M_DUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.14, price: 220000 }
    ]
  },
  {
    code: 'AF.16120',
    name: 'Bê tông lanh tô, sê nô, ô văng mác 200 đá 1x2',
    unit: 'm3',
    defaultPriceMat: 980000,
    defaultPriceLab: 490000,
    defaultPriceMac: 35000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 310, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.49, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.88, price: 330000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.76, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUI', name: 'Máy đầm dùi', unit: 'ca', norm: 0.12, price: 220000 }
    ]
  },
  {
    code: 'AF.17120',
    name: 'Bê tông cầu thang bộ mác 250 đá 1x2 vữa trộn máy đổ thủ công',
    unit: 'm3',
    defaultPriceMat: 1050000,
    defaultPriceLab: 650000,
    defaultPriceMac: 45000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 345, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.48, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.87, price: 330000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ bậc 3.5/7', unit: 'công', norm: 2.33, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUI', name: 'Máy đầm dùi', unit: 'ca', norm: 0.16, price: 220000 }
    ]
  },
  {
    code: 'AF.18110',
    name: 'Bê tông bể nước ngầm, tầng hầm chống thấm B6 mác 300 đá 1x2',
    unit: 'm3',
    defaultPriceMat: 1220000,
    defaultPriceLab: 450000,
    defaultPriceMac: 75000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 385, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.46, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.86, price: 330000 },
      { code: 'VL_BANGCAOSU', name: 'Băng cản nước Waterstop V20', unit: 'm', norm: 0.8, price: 125000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.62, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.18, price: 220000 }
    ]
  },

  // --- AG: BÊ TÔNG ĐÚC SẴN BỔ SUNG ---
  {
    code: 'AG.11120',
    name: 'Đúc tấm đan rãnh bê tông cốt thép đúc sẵn mác 200 dày 8cm',
    unit: 'm3',
    defaultPriceMat: 1450000,
    defaultPriceLab: 680000,
    defaultPriceMac: 120000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 320, price: 1850 },
      { code: 'VL_CATV', name: 'Cát vàng', unit: 'm3', norm: 0.49, price: 290000 },
      { code: 'VL_DA12', name: 'Đá 1x2', unit: 'm3', norm: 0.88, price: 330000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công đúc cấu kiện bậc 3.5/7', unit: 'công', norm: 2.45, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BANRUNG', name: 'Bàn rung đúc bê tông 3kW', unit: 'ca', norm: 0.35, price: 340000 }
    ]
  },
  {
    code: 'AG.22110',
    name: 'Lắp đặt cống hộp đôi BTCT đúc sẵn 2x(2.0x2.0m) bằng cần cẩu 25T',
    unit: 'đốt cống',
    defaultPriceMat: 350000,
    defaultPriceLab: 480000,
    defaultPriceMac: 1250000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GIOANG', name: 'Gioăng cao su kín khít và vữa chèn', unit: 'bộ', norm: 1, price: 350000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ thợ lắp cống bậc 4.0/7', unit: 'công', norm: 1.57, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CAU25T', name: 'Cần cẩu bánh xích 25T', unit: 'ca', norm: 0.22, price: 5680000 }
    ]
  },
  {
    code: 'AG.32110',
    name: 'Lắp đặt cấu kiện bê tông đúc sẵn tấm sàn Panel dày 12cm',
    unit: '100m2',
    defaultPriceMat: 850000,
    defaultPriceLab: 2450000,
    defaultPriceMac: 3200000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VUACHEN', name: 'Vữa XM mác 100 chèn khe', unit: 'm3', norm: 0.9, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ghép bậc 3.5/7', unit: 'công', norm: 8.8, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAU16T', name: 'Cần cẩu bánh lốp 16T', unit: 'ca', norm: 0.75, price: 4260000 }
    ]
  },

  // --- AH: CỐT THÉP BỔ SUNG ---
  {
    code: 'AH.11120',
    name: 'Cốt thép móng công trình đường kính d <= 18mm thép CB300-V',
    unit: 'tấn',
    defaultPriceMat: 17200000,
    defaultPriceLab: 2650000,
    defaultPriceMac: 280000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPCB300', name: 'Thép vằn CB300-V phi 12-18', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 17200000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc 1 ly', unit: 'kg', norm: 15, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc cốt thép bậc 3.5/7', unit: 'công', norm: 9.53, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn sắt thép 5kW', unit: 'ca', norm: 0.65, price: 430000 }
    ]
  },
  {
    code: 'AH.11130',
    name: 'Cốt thép móng công trình đường kính d > 18mm thép CB400-V',
    unit: 'tấn',
    defaultPriceMat: 17400000,
    defaultPriceLab: 2450000,
    defaultPriceMac: 310000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPCB400', name: 'Thép vằn CB400-V phi 20-32', unit: 'tấn', norm: 1.02, price: 16700000, monthlyPrice: 17400000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 12, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sắt bậc 3.5/7', unit: 'công', norm: 8.81, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt sắt công nghiệp', unit: 'ca', norm: 0.72, price: 430000 }
    ]
  },
  {
    code: 'AH.12120',
    name: 'Cốt thép cột, vách công trình đường kính d <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17250000,
    defaultPriceLab: 3150000,
    defaultPriceMac: 350000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPCOT', name: 'Thép cây vằn CB300/400', unit: 'tấn', norm: 1.025, price: 16500000, monthlyPrice: 17250000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc', unit: 'kg', norm: 16, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp dựng thép cột bậc 3.5/7', unit: 'công', norm: 11.33, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng vật liệu 0.8T', unit: 'ca', norm: 0.42, price: 650000 }
    ]
  },
  {
    code: 'AH.13120',
    name: 'Cốt thép dầm giằng công trình đường kính d <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 17200000,
    defaultPriceLab: 2850000,
    defaultPriceMac: 310000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPDAM', name: 'Thép vằn dầm giằng', unit: 'tấn', norm: 1.025, price: 16500000 },
      { code: 'VL_DAYBUOC', name: 'Dây thép buộc', unit: 'kg', norm: 15, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn thép dầm bậc 3.5/7', unit: 'công', norm: 10.25, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt uốn thép', unit: 'ca', norm: 0.68, price: 430000 }
    ]
  },
  {
    code: 'AH.14120',
    name: 'Cốt thép bản sàn, sàn mái đường kính d <= 10mm thép cuộn CB240-T',
    unit: 'tấn',
    defaultPriceMat: 16900000,
    defaultPriceLab: 2950000,
    defaultPriceMac: 250000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPCUON', name: 'Thép cuộn tròn trơn CB240-T', unit: 'tấn', norm: 1.02, price: 16200000, monthlyPrice: 16900000 },
      { code: 'VL_DAYBUOC', name: 'Dây buộc', unit: 'kg', norm: 18, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trải thép sàn bậc 3.5/7', unit: 'công', norm: 10.6, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng thép', unit: 'ca', norm: 0.38, price: 650000 }
    ]
  },
  {
    code: 'AH.23110',
    name: 'Gia công lắp dựng bu lông neo chân cột thép M24x800 cấp bền 8.8',
    unit: 'kg',
    defaultPriceMat: 42000,
    defaultPriceLab: 18000,
    defaultPriceMac: 5000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BULONGNEO', name: 'Bu lông móng M24x800 kèm đai ốc, long đen', unit: 'kg', norm: 1.02, price: 39500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ cơ khí định vị bu lông bậc 4.0/7', unit: 'công', norm: 0.059, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_MAYHAN', name: 'Máy hàn giữ cữ bu lông', unit: 'ca', norm: 0.012, price: 375000 }
    ]
  },

  // --- AI: VÁN KHUÔN COFFA BỔ SUNG ---
  {
    code: 'AI.11120',
    name: 'Ván khuôn móng công trình bằng ván ép phủ phim cốt thép hình',
    unit: '100m2',
    defaultPriceMat: 4200000,
    defaultPriceLab: 3600000,
    defaultPriceMac: 250000,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VANPHIM', name: 'Ván ép phủ phim 15mm (luân chuyển 5 lần)', unit: 'm2', norm: 23, price: 165000 },
      { code: 'VL_XAGO', name: 'Hộp thép 50x50 chống đỡ luân chuyển', unit: 'kg', norm: 45, price: 18500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ mộc coffa bậc 3.5/7', unit: 'công', norm: 12.95, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATGO', name: 'Máy cưa đĩa cầm tay', unit: 'ca', norm: 0.65, price: 250000 }
    ]
  },
  {
    code: 'AI.12120',
    name: 'Ván khuôn cột tròn bằng ống thép định hình D400-D600',
    unit: '100m2',
    defaultPriceMat: 5800000,
    defaultPriceLab: 4800000,
    defaultPriceMac: 650000,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COFFATRON', name: 'Ván khuôn thép định hình uốn cong tròn', unit: 'bộ', norm: 1, price: 5800000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp coffa thép bậc 3.5/7', unit: 'công', norm: 17.2, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUTUHANH', name: 'Cần cẩu lắp dựng ván khuôn', unit: 'ca', norm: 0.25, price: 2600000 }
    ]
  },
  {
    code: 'AI.12220',
    name: 'Ván khuôn dầm ván ép phủ phim chống giàn giáo nêm mạ kẽm',
    unit: '100m2',
    defaultPriceMat: 4600000,
    defaultPriceLab: 4400000,
    defaultPriceMac: 350000,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VANPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 25, price: 175000 },
      { code: 'VL_GIAONEM', name: 'Giàn giáo nêm mạ kẽm thuê luân chuyển', unit: 'bộ', norm: 45, price: 8500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ coffa bậc 3.5/7', unit: 'công', norm: 15.8, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng giàn giáo', unit: 'ca', norm: 0.54, price: 650000 }
    ]
  },
  {
    code: 'AI.12310',
    name: 'Ván khuôn sàn phẳng ván ép phủ phim dày 18mm hệ Ringlock',
    unit: '100m2',
    defaultPriceMat: 4800000,
    defaultPriceLab: 4100000,
    defaultPriceMac: 320000,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VANPHIM18', name: 'Ván ép phủ phim chịu nước 18mm', unit: 'm2', norm: 26, price: 175000 },
      { code: 'VL_RINGLOCK', name: 'Hệ giàn giáo đĩa Ringlock chịu lực', unit: 'kg', norm: 65, price: 12500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ bậc 3.5/7', unit: 'công', norm: 14.7, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng', unit: 'ca', norm: 0.49, price: 650000 }
    ]
  },
  {
    code: 'AI.15120',
    name: 'Ván khuôn cầu thang bộ ván ép phủ phim giàn giáo thép',
    unit: '100m2',
    defaultPriceMat: 5400000,
    defaultPriceLab: 5800000,
    defaultPriceMac: 350000,
    chapter: 'Chương IX: Ván khuôn công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VANPHIM', name: 'Ván phủ phim tạo bậc tam cấp', unit: 'm2', norm: 32, price: 165000 },
      { code: 'VL_GIAOTHEP', name: 'Giàn giáo chống xiên thang bộ', unit: 'khung', norm: 35, price: 18000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ mộc bậc 4.0/7', unit: 'công', norm: 19.0, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGO', name: 'Máy cưa đĩa bàn', unit: 'ca', norm: 0.85, price: 250000 }
    ]
  },

  // --- AK: HOÀN THIỆN CÔNG TRÌNH BỔ SUNG ---
  {
    code: 'AK.11220',
    name: 'Trát tường ngoài nhà vữa xi măng mác 75 dày 2.0cm giàn giáo ngoài',
    unit: 'm2',
    defaultPriceMat: 38000,
    defaultPriceLab: 78000,
    defaultPriceMac: 4500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 8.5, price: 1650 },
      { code: 'VL_CATM', name: 'Cát mịn trát tường', unit: 'm3', norm: 0.024, price: 260000 },
      { code: 'VL_GIAO', name: 'Hao phí giàn giáo ngoài bao che', unit: 'm2', norm: 1.05, price: 12000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát tường ngoài bậc 3.5/7', unit: 'công', norm: 0.28, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.015, price: 315000 }
    ]
  },
  {
    code: 'AK.12210',
    name: 'Trát trần dầm bê tông vữa xi măng mác 75 dày 1.5cm',
    unit: 'm2',
    defaultPriceMat: 32000,
    defaultPriceLab: 82000,
    defaultPriceMac: 3500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 6.8, price: 1650 },
      { code: 'VL_CATM', name: 'Cát mịn sàng', unit: 'm3', norm: 0.018, price: 260000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát trần ngược bậc 3.5/7', unit: 'công', norm: 0.295, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.011, price: 315000 }
    ]
  },
  {
    code: 'AK.22110',
    name: 'Láng nền sàn vữa XM M100 dày 3cm đánh màu xi măng nguyên chất',
    unit: 'm2',
    defaultPriceMat: 45000,
    defaultPriceLab: 55000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PC30', unit: 'kg', norm: 12.5, price: 1650 },
      { code: 'VL_CATM', name: 'Cát vàng sàng', unit: 'm3', norm: 0.033, price: 280000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ láng nền bậc 3.5/7', unit: 'công', norm: 0.198, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn vữa', unit: 'ca', norm: 0.008, price: 315000 }
    ]
  },
  {
    code: 'AK.23110',
    name: 'Mài bóng tăng cứng mặt sàn bê tông bằng máy mài bột Hardener Sika',
    unit: 'm2',
    defaultPriceMat: 42000,
    defaultPriceLab: 38000,
    defaultPriceMac: 18000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_HARDENER', name: 'Bột tăng cứng Sikafloor Chapdur Green/Grey', unit: 'kg', norm: 4.5, price: 8200 },
      { code: 'VL_BAODUONG', name: 'Chất bảo dưỡng Antisol E', unit: 'lít', norm: 0.2, price: 42000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xoa mài bậc 3.5/7', unit: 'công', norm: 0.136, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_XOANEN', name: 'Máy xoa nền đôi 4 cánh', unit: 'ca', norm: 0.025, price: 720000 }
    ]
  },
  {
    code: 'AK.32110',
    name: 'Lát gạch ceramic 400x400 chống trơn khu vệ sinh ban công',
    unit: 'm2',
    defaultPriceMat: 145000,
    defaultPriceLab: 68000,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH40', name: 'Gạch ceramic Prime 400x400 nhám chống trơn', unit: 'm2', norm: 1.05, price: 110000, monthlyPrice: 125000 },
      { code: 'VL_KEOCHAM', name: 'Keo chà ron chống rêu mốc', unit: 'kg', norm: 1.2, price: 15000 },
      { code: 'VL_VUAM75', name: 'Vữa XM lót mác 75', unit: 'm3', norm: 0.02, price: 820000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ ốp lát bậc 4.0/7', unit: 'công', norm: 0.22, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATGACH', name: 'Máy cắt gạch', unit: 'ca', norm: 0.01, price: 220000 }
    ]
  },
  {
    code: 'AK.34110',
    name: 'Lát sàn gỗ công nghiệp dày 12mm cốt xanh HDF chống ẩm',
    unit: 'm2',
    defaultPriceMat: 345000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SANGO', name: 'Sàn gỗ công nghiệp Malaysia HDF cốt xanh 12mm', unit: 'm2', norm: 1.04, price: 295000, monthlyPrice: 320000 },
      { code: 'VL_FOAMLOT', name: 'Xốp tráng bạc lót sàn dày 2mm', unit: 'm2', norm: 1.05, price: 6500 },
      { code: 'VL_PHAO', name: 'Phào chân tường + nẹp nhôm chữ T', unit: 'm', norm: 0.8, price: 35000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lát sàn gỗ bậc 4.0/7', unit: 'công', norm: 0.148, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.42110',
    name: 'Ốp đá granite tự nhiên dày 20mm mặt bậc cầu thang kèm chỉ đồng',
    unit: 'm2',
    defaultPriceMat: 680000,
    defaultPriceLab: 185000,
    defaultPriceMac: 8500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAGRANITE', name: 'Đá Granite Kim sa trung / Đen Huế', unit: 'm2', norm: 1.06, price: 580000, monthlyPrice: 620000 },
      { code: 'VL_KEOOPDA', name: 'Keo dán đá chuyên dụng Sika Cerarm', unit: 'kg', norm: 5.5, price: 14500 }
    ],
    labors: [
      { code: 'NC_4.5', name: 'Thợ ốp đá bậc 4.5/7', unit: 'công', norm: 0.55, price: 333000, rank: '4.5/7' }
    ],
    machines: [
      { code: 'M_MAIDA', name: 'Máy mài cạnh bo vát đá', unit: 'ca', norm: 0.035, price: 240000 }
    ]
  },
  {
    code: 'AK.43110',
    name: 'Ốp đá marble cẩm thạch mặt tiền thang máy tòa nhà',
    unit: 'm2',
    defaultPriceMat: 1250000,
    defaultPriceLab: 260000,
    defaultPriceMac: 15000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAMARBLE', name: 'Đá Marble tự nhiên Ý dày 18mm', unit: 'm2', norm: 1.05, price: 1050000, monthlyPrice: 1150000 },
      { code: 'VL_PAKE', name: 'Bát móc inox 304 treo đá khô', unit: 'bộ', norm: 4.5, price: 28000 }
    ],
    labors: [
      { code: 'NC_4.5', name: 'Nghệ nhân ốp đá bậc 4.5/7', unit: 'công', norm: 0.78, price: 333000, rank: '4.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.92110',
    name: 'Sơn dầu bóng 2 nước bảo vệ kết cấu kim loại xà gồ lan can',
    unit: 'm2',
    defaultPriceMat: 38000,
    defaultPriceLab: 32000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONCHONGRY', name: 'Sơn lót chống rỉ gốc alkyd', unit: 'kg', norm: 0.14, price: 48000 },
      { code: 'VL_SONPHUDAU', name: 'Sơn phủ màu Đại Bàng/Expo', unit: 'kg', norm: 0.22, price: 68000 },
      { code: 'VL_XANGPHA', name: 'Xăng thơm pha sơn', unit: 'lít', norm: 0.06, price: 28000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Thợ sơn bậc 3.0/7', unit: 'công', norm: 0.128, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.54110',
    name: 'Sơn sàn Epoxy 3 lớp hệ lăn chịu tải trọng kháng khuẩn',
    unit: 'm2',
    defaultPriceMat: 95000,
    defaultPriceLab: 45000,
    defaultPriceMac: 12000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_EPOXYLOT', name: 'Sơn lót Epoxy gốc dung môi KCC/Chokwang', unit: 'kg', norm: 0.18, price: 145000 },
      { code: 'VL_EPOXYPHU', name: 'Sơn phủ Epoxy 2 thành phần', unit: 'kg', norm: 0.35, price: 185000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sơn công nghiệp bậc 3.5/7', unit: 'công', norm: 0.162, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MAIBA', name: 'Máy mài sàn tạo nhám kèm hút bụi', unit: 'ca', norm: 0.02, price: 600000 }
    ]
  },
  {
    code: 'AK.62110',
    name: 'Lắp đặt trần nhôm Clip-in 600x600 khung xương chìm cao cấp',
    unit: 'm2',
    defaultPriceMat: 380000,
    defaultPriceLab: 85000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TRANNHOM', name: 'Tấm trần nhôm Austrong Clip-in 600x600 dày 0.6mm', unit: 'm2', norm: 1.03, price: 295000 },
      { code: 'VL_KHUNGNHOM', name: 'Khung xương tam giác và ty treo mạ kẽm', unit: 'bộ', norm: 1, price: 65000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ trần bậc 4.0/7', unit: 'công', norm: 0.28, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.72110',
    name: 'Lắp đặt cửa gỗ công nghiệp Composite chịu nước kèm phụ kiện khóa',
    unit: 'm2',
    defaultPriceMat: 1850000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUAGOWOOD', name: 'Bộ cửa nhựa gỗ Composite cánh + khuôn nẹp', unit: 'm2', norm: 1.0, price: 1650000 },
      { code: 'VL_KHOA', name: 'Khóa tay gạt inox Huy Hoàng + bản lề cối', unit: 'bộ', norm: 0.5, price: 420000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ mộc bậc 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.73110',
    name: 'Lắp vách kính cường lực 12mm khung nhôm định hình Xingfa hệ 55',
    unit: 'm2',
    defaultPriceMat: 1150000,
    defaultPriceLab: 180000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_KINH12', name: 'Kính cường lực an toàn temper 12mm', unit: 'm2', norm: 1.03, price: 780000 },
      { code: 'VL_NHUMXINGFA', name: 'Thanh nhôm Xingfa nhập khẩu Quảng Đông', unit: 'kg', norm: 3.5, price: 95000 },
      { code: 'VL_KEOKEO', name: 'Keo silicone Dow Corning kết cấu', unit: 'tuýp', norm: 0.8, price: 65000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nhôm kính bậc 4.0/7', unit: 'công', norm: 0.59, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.84110',
    name: 'Chống thấm sàn mái vệ sinh bằng màng khò nóng Bitum dày 3mm',
    unit: 'm2',
    defaultPriceMat: 165000,
    defaultPriceLab: 65000,
    defaultPriceMac: 8500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_MANGBITUM', name: 'Màng chống thấm khò nóng Danosa 3mm mặt cát', unit: 'm2', norm: 1.15, price: 115000 },
      { code: 'VL_PRIMER', name: 'Sơn lót Bitum Primer quét bám dính', unit: 'kg', norm: 0.35, price: 42000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ chống thấm bậc 3.5/7', unit: 'công', norm: 0.234, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_KHO', name: 'Đèn khò gas công nghiệp', unit: 'ca', norm: 0.035, price: 240000 }
    ]
  },

  // --- AL: KẾT CẤU THÉP & KIM LOẠI BỔ SUNG ---
  {
    code: 'AL.11110',
    name: 'Gia công lắp dựng kết cấu thép cột dầm nhà xưởng tiền chế',
    unit: 'tấn',
    defaultPriceMat: 28500000,
    defaultPriceLab: 4200000,
    defaultPriceMac: 2800000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPTAMH', name: 'Thép hình tổ hợp chữ H SS400/Q345B', unit: 'tấn', norm: 1.035, price: 23500000, monthlyPrice: 24500000 },
      { code: 'VL_SONCHONGRY', name: 'Sơn lót chống rỉ epoxy 2 thành phần', unit: 'kg', norm: 25, price: 85000 },
      { code: 'VL_BULONGCB', name: 'Bu lông liên kết cường độ cao cấp 8.8', unit: 'bộ', norm: 45, price: 32000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp kết cấu thép bậc 4.0/7', unit: 'công', norm: 13.77, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CAU25T', name: 'Cần cẩu bánh lốp 25T lắp dựng', unit: 'ca', norm: 0.50, price: 5600000 }
    ]
  },
  {
    code: 'AL.12110',
    name: 'Gia công lắp dựng xà gồ thép mạ kẽm C180-C200',
    unit: 'tấn',
    defaultPriceMat: 24500000,
    defaultPriceLab: 2800000,
    defaultPriceMac: 1200000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XAGO_C', name: 'Thép mạ kẽm C200x65x20 dày 2.0mm', unit: 'tấn', norm: 1.025, price: 22800000 },
      { code: 'VL_VIT', name: 'Vít tự khoan mạ kẽm kèm đệm cao su', unit: 'cái', norm: 220, price: 1200 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sắt bậc 3.5/7', unit: 'công', norm: 10.07, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUTOI', name: 'Tời điện nâng hạ xà gồ 1T', unit: 'ca', norm: 0.45, price: 450000 }
    ]
  },
  {
    code: 'AL.13110',
    name: 'Lợp mái tôn sóng vuông mạ màu dày 0.45mm có dán cách nhiệt PE/PU',
    unit: 'm2',
    defaultPriceMat: 155000,
    defaultPriceLab: 28000,
    defaultPriceMac: 3500,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TONXANH', name: 'Tôn sóng vuông Hoa Sen/Đông Á 0.45mm dán PE 16mm', unit: 'm2', norm: 1.08, price: 135000, monthlyPrice: 145000 },
      { code: 'VL_VIBAN', name: 'Vít bắn tôn chống dột mạ kẽm', unit: 'con', norm: 6, price: 1500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lợp mái tôn bậc 3.5/7', unit: 'công', norm: 0.10, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AL.14110',
    name: 'Gia công lắp dựng máng xối inox 304 dày 1.2mm khổ rộng 600mm',
    unit: 'm',
    defaultPriceMat: 380000,
    defaultPriceLab: 75000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_INOX304', name: 'Tấm inox 304 chấn gập dày 1.2mm', unit: 'kg', norm: 5.8, price: 62000 },
      { code: 'VL_KEO', name: 'Keo kết dính chống dột trám mối nối', unit: 'tuýp', norm: 0.25, price: 65000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ cơ khí inox bậc 4.0/7', unit: 'công', norm: 0.245, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AL.15110',
    name: 'Gia công lắp dựng lan can cầu thang bằng thép sơn chống rỉ tay vịn inox 304',
    unit: 'm',
    defaultPriceMat: 450000,
    defaultPriceLab: 185000,
    defaultPriceMac: 25000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TAYVIN_INOX', name: 'Ống inox 304 tròn D50 dày 1.5mm tay vịn', unit: 'm', norm: 1.05, price: 165000 },
      { code: 'VL_SATHOP', name: 'Thép hộp hộp 20x40 và 40x40 nan can', unit: 'kg', norm: 8.5, price: 24000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ hàn cơ khí bậc 4.0/7', unit: 'công', norm: 0.606, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_HAN', name: 'Máy hàn Tig/Que', unit: 'ca', norm: 0.08, price: 310000 }
    ]
  },

  // --- BA, BB, BC, BD: CƠ ĐIỆN MEP & PCCC BỔ SUNG ---
  {
    code: 'BA.11210',
    name: 'Lắp đặt ống cấp nước PPR D32 chịu nhiệt hàn nhiệt âm tường',
    unit: 'm',
    defaultPriceMat: 45000,
    defaultPriceLab: 32000,
    defaultPriceMac: 3500,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGPPR32', name: 'Ống cấp nước nóng lạnh PPR D32 PN20 Tiền Phong', unit: 'm', norm: 1.03, price: 38000 },
      { code: 'VL_PHUKIENPPR', name: 'Cút, tê, măng sông hàn nhiệt', unit: 'cái', norm: 1.5, price: 5500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ điện nước bậc 3.5/7', unit: 'công', norm: 0.115, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_HANNHIET', name: 'Máy hàn nhiệt ống PPR 800W', unit: 'ca', norm: 0.015, price: 230000 }
    ]
  },
  {
    code: 'BA.11310',
    name: 'Lắp đặt ống cấp nước HDPE D63 nối hàn nhiệt cấp nước ngoài nhà',
    unit: 'm',
    defaultPriceMat: 85000,
    defaultPriceLab: 48000,
    defaultPriceMac: 12000,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGHDPE63', name: 'Ống HDPE PE100 D63 PN12.5', unit: 'm', norm: 1.02, price: 78000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ hàn ống HDPE bậc 4.0/7', unit: 'công', norm: 0.157, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_HANHDPE', name: 'Máy hàn đối đầu thuỷ lực HDPE', unit: 'ca', norm: 0.025, price: 480000 }
    ]
  },
  {
    code: 'BA.22110',
    name: 'Lắp đặt máy bơm cấp nước sinh hoạt công suất 2.0HP kèm rơ le tự ngắt',
    unit: 'bộ',
    defaultPriceMat: 3850000,
    defaultPriceLab: 280000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_MAYBOM2HP', name: 'Máy bơm ly tâm tăng áp Ebara/Panasonic 2.0HP', unit: 'cái', norm: 1, price: 3500000 },
      { code: 'VL_VANMOTCHIEU', name: 'Van 1 chiều đồng và rắc co D34', unit: 'bộ', norm: 1, price: 350000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ cơ điện bậc 4.0/7', unit: 'công', norm: 0.918, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BB.13110',
    name: 'Lắp đặt bộ sen vòi tắm nóng lạnh gật gù mạ Crom cao cấp Inax',
    unit: 'bộ',
    defaultPriceMat: 1850000,
    defaultPriceLab: 125000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SENTAM', name: 'Bộ sen tắm nóng lạnh Inax BFV-1113S', unit: 'bộ', norm: 1, price: 1800000 },
      { code: 'VL_BANGTAN', name: 'Băng tan teflon chống rò', unit: 'cuộn', norm: 2, price: 5000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nước bậc 3.5/7', unit: 'công', norm: 0.45, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BB.14110',
    name: 'Lắp đặt bồn tiểu nam treo tường van xả cảm ứng tự động',
    unit: 'bộ',
    defaultPriceMat: 3200000,
    defaultPriceLab: 220000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TIEUNAM', name: 'Tiểu nam Inax AFU-600V kèm van cảm ứng', unit: 'bộ', norm: 1, price: 3100000 },
      { code: 'VL_VITNEO', name: 'Vít nở inox và ống thải chữ P', unit: 'bộ', norm: 1, price: 100000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp thiết bị vệ sinh bậc 4.0/7', unit: 'công', norm: 0.72, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.11210',
    name: 'Kéo rải dây cáp điện 3 pha Cu/XLPE/PVC 4x16mm2 trong thang máng cáp',
    unit: 'm',
    defaultPriceMat: 185000,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_CAP16', name: 'Cáp điện ngầm Cadivi Cu/XLPE/PVC 4x16mm2', unit: 'm', norm: 1.03, price: 178000 },
      { code: 'VL_DAUTI', name: 'Đầu cos bấm bọc co nhiệt', unit: 'cái', norm: 0.2, price: 15000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ kéo cáp bậc 4.0/7', unit: 'công', norm: 0.115, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.12110',
    name: 'Lắp đặt tủ điện tổng phân phối DB 8-12 module vỏ kim loại sơn tĩnh điện',
    unit: 'bộ',
    defaultPriceMat: 850000,
    defaultPriceLab: 260000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TUDIENDB', name: 'Vỏ tủ điện kim loại âm tường Sino/Schneider 12 modules', unit: 'cái', norm: 1, price: 680000 },
      { code: 'VL_CAUTUDIEN', name: 'Thanh lược và cầu chì trung tính', unit: 'bộ', norm: 1, price: 170000 }
    ],
    labors: [
      { code: 'NC_4.5', name: 'Thợ điện đấu nối bậc 4.5/7', unit: 'công', norm: 0.78, price: 333000, rank: '4.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.13110',
    name: 'Lắp đặt máng cáp trunking tôn mạ kẽm 100x50 dày 1.2mm có nắp đậy',
    unit: 'm',
    defaultPriceMat: 125000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TRUNKING', name: 'Máng cáp tôn mạ kẽm nhúng nóng 100x50x1.2mm', unit: 'm', norm: 1.02, price: 105000 },
      { code: 'VL_TYTREO', name: 'Treo ty ren suốt M8 kèm tắc kê đạn', unit: 'bộ', norm: 0.8, price: 18000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ cơ điện bậc 3.5/7', unit: 'công', norm: 0.162, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.14110',
    name: 'Lắp đặt bộ công tắc ổ cắm đôi 3 chấu âm tường Panasonic dòng Wide',
    unit: 'bộ',
    defaultPriceMat: 85000,
    defaultPriceLab: 25000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_OCAM_PANA', name: 'Ổ cắm đôi có màng che Panasonic Wide Series', unit: 'bộ', norm: 1, price: 78000 },
      { code: 'VL_DEAM', name: 'Đế âm nhựa chống cháy', unit: 'cái', norm: 1, price: 7000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ điện bậc 3.5/7', unit: 'công', norm: 0.09, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BD.11210',
    name: 'Lắp đặt họng tiếp nước chữa cháy 2 cửa D65 ngoài nhà van một chiều',
    unit: 'bộ',
    defaultPriceMat: 2450000,
    defaultPriceLab: 380000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_HONGTIEN', name: 'Trụ tiếp nước PCCC 2 cửa D65 mặt bích D100', unit: 'bộ', norm: 1, price: 2200000 },
      { code: 'VL_GIOANGMATBICH', name: 'Gioăng cao su chì + bu lông M16', unit: 'bộ', norm: 1, price: 250000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ hàn ống PCCC bậc 4.0/7', unit: 'công', norm: 1.25, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.11310',
    name: 'Lắp đặt tủ trung tâm báo cháy tự động 8 kênh báo động Hochiki',
    unit: 'bộ',
    defaultPriceMat: 6800000,
    defaultPriceLab: 650000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TUTRUNGTAM', name: 'Tủ báo cháy Hochiki HCP-1008E 8 zone kèm ắc quy dự phòng', unit: 'bộ', norm: 1, price: 6500000 },
      { code: 'VL_DAYTINHIEN', name: 'Dây tín hiệu chống nhiễu Belden 2x1.0mm2', unit: 'm', norm: 15, price: 18000 }
    ],
    labors: [
      { code: 'NC_4.5', name: 'Kỹ sư chuyên gia PCCC bậc 4.5/7', unit: 'công', norm: 1.95, price: 333000, rank: '4.5/7' }
    ],
    machines: []
  },
  {
    code: 'BD.13110',
    name: 'Lắp đặt đầu phun nước chữa cháy tự động Sprinkler Tyco 68 độ C hướng xuống',
    unit: 'cái',
    defaultPriceMat: 85000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SPRINKLER', name: 'Đầu phun Tyco TY-B 68 độ C K5.6 ren D15', unit: 'cái', norm: 1, price: 72000 },
      { code: 'VL_NAPCHUP', name: 'Nắp chụp che thẩm mỹ mạ crom', unit: 'cái', norm: 1, price: 13000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ đường ống PCCC bậc 4.0/7', unit: 'công', norm: 0.147, price: 305000, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.14110',
    name: 'Lắp đặt bình chữa cháy xách tay khí CO2 MT3 kèm giá treo',
    unit: 'bình',
    defaultPriceMat: 450000,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cơ điện MEP & PCCC',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_BINHCO2', name: 'Bình chữa cháy khí CO2 MT3 (3kg) có kiểm định PCCC', unit: 'bình', norm: 1, price: 420000 },
      { code: 'VL_GIATREO', name: 'Giá treo tường kim loại kèm nở', unit: 'bộ', norm: 1, price: 30000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.14, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },

  // --- SA: SỬA CHỮA, PHÁ DỠ BỔ SUNG ---
  {
    code: 'SA.11210',
    name: 'Đục phá lớp bê tông nền sàn dày <= 10cm bằng máy đục bê tông cầm tay',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 85000,
    defaultPriceMac: 35000,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.34, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DUCBE', name: 'Máy đục bê tông Bosch 1500W', unit: 'ca', norm: 0.14, price: 250000 }
    ]
  },
  {
    code: 'SA.21210',
    name: 'Cắt rãnh mặt đường bê tông nhựa / bê tông xi măng sâu <= 7cm bằng máy cắt',
    unit: 'm',
    defaultPriceMat: 12000,
    defaultPriceLab: 22000,
    defaultPriceMac: 18000,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [
      { code: 'VL_LUOICAT', name: 'Lưỡi cắt kim cương D350 hao mòn', unit: 'lưỡi', norm: 0.02, price: 450000 },
      { code: 'VL_NUOCMAT', name: 'Nước làm mát lưỡi cắt', unit: 'm3', norm: 0.05, price: 18000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ cắt mặt đường bậc 3.5/7', unit: 'công', norm: 0.079, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATDUONG', name: 'Máy cắt đường bê tông chạy xăng', unit: 'ca', norm: 0.065, price: 280000 }
    ]
  },
  {
    code: 'SA.31210',
    name: 'Cạo bỏ lớp sơn tường cũ bằng máy chà nhám tường có hút bụi',
    unit: 'm2',
    defaultPriceMat: 3500,
    defaultPriceLab: 18000,
    defaultPriceMac: 6500,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [
      { code: 'VL_GIAYRAP', name: 'Giấy ráp mài tường', unit: 'tờ', norm: 0.5, price: 7000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.072, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_CHANHAM', name: 'Máy chà nhám kèm hút bụi', unit: 'ca', norm: 0.035, price: 185000 }
    ]
  },
  {
    code: 'SA.41210',
    name: 'Tháo dỡ cửa đi cửa sổ nhôm kính khung sắt cũ bảo quản tái sử dụng',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ tháo dỡ bậc 3.5/7', unit: 'công', norm: 0.162, price: 278000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'SA.51210',
    name: 'Bốc xếp và vận chuyển phế thải xây dựng bằng xe tự đổ 5T cự ly 10km',
    unit: 'chuyến',
    defaultPriceMat: 0,
    defaultPriceLab: 180000,
    defaultPriceMac: 650000,
    chapter: 'Chương XII: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Tổ bốc xếp bậc 3.0/7', unit: 'công', norm: 0.72, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_OTO5T', name: 'Ô tô tự đổ 5T chở đổ bãi thải', unit: 'ca', norm: 0.42, price: 1550000 }
    ]
  }
];

// Tích hợp toàn diện tất cả các công tác định mức Bộ Xây dựng (TT 12/2021/TT-BXD, TT 11/2021/TT-BXD, TT 14/2023/TT-BXD)
const existingCodes = new Set<string>();
const mergedCatalog: NormTemplate[] = [];
for (const norm of [...BASE_NORMS_CATALOG, ...COMPREHENSIVE_BXD_NORMS]) {
  if (!existingCodes.has(norm.code)) {
    mergedCatalog.push(norm);
    existingCodes.add(norm.code);
  }
}

export const NORMS_CATALOG: NormTemplate[] = mergedCatalog;

// Helper để tìm kiếm nhanh mã hiệu hoặc tên có dấu / không dấu
export function searchNorms(query: string, chapterFilter?: string): NormTemplate[] {
  let list = NORMS_CATALOG;
  if (chapterFilter && chapterFilter !== 'all') {
    if (chapterFilter.startsWith('prefix:')) {
      const pfx = chapterFilter.replace('prefix:', '').toUpperCase();
      if (pfx === 'BA-BD') {
        list = list.filter(n => 
          n.code.startsWith('BA') || 
          n.code.startsWith('BB') || 
          n.code.startsWith('BC') || 
          n.code.startsWith('BD')
        );
      } else {
        list = list.filter(n => n.code.toUpperCase().startsWith(pfx));
      }
    } else {
      list = list.filter(n => 
        n.chapter?.toLowerCase().includes(chapterFilter.toLowerCase()) || 
        n.categoryGroup?.toLowerCase().includes(chapterFilter.toLowerCase())
      );
    }
  }

  if (!query || query.trim() === '') return list;

  const rawQuery = query.toLowerCase().trim();
  const qClean = removeVietnameseTones(rawQuery);
  const qAlphanumeric = rawQuery.replace(/[^a-z0-9]/g, '');

  let filtered = list.filter(norm => {
    const codeLower = norm.code.toLowerCase();
    const codeAlphanumeric = codeLower.replace(/[^a-z0-9]/g, '');

    // Tìm kiếm theo mã hiệu chuẩn (AF.12311, AF12311, af 12...)
    const codeMatch = 
      codeLower.includes(rawQuery) || 
      (qAlphanumeric.length >= 2 && codeAlphanumeric.includes(qAlphanumeric));

    // Tìm kiếm theo tên có dấu hoặc không dấu
    const nameClean = removeVietnameseTones(norm.name.toLowerCase());
    const nameMatch = 
      nameClean.includes(qClean) || 
      norm.name.toLowerCase().includes(rawQuery);

    return codeMatch || nameMatch;
  });

  // Tự động phân giải thông minh bất kỳ mã hiệu định mức BXD nào người dùng gõ
  if (/^[a-zA-Z]{2}/.test(rawQuery)) {
    const resolved = resolveOrGenerateBXDNorm(rawQuery);
    if (resolved && !filtered.some(n => n.code.toUpperCase() === resolved.code.toUpperCase())) {
      filtered = [resolved, ...filtered];
    }
  }

  return filtered;
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
