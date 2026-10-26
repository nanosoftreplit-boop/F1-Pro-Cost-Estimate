import { NormTemplate } from '../types/estimate';

/**
 * THƯ VIỆN ĐỊNH MỨC XÂY DỰNG BỘ XÂY DỰNG TOÀN DIỆN (FULL CATALOG)
 * Căn cứ:
 * - Thông tư số 12/2021/TT-BXD của Bộ Xây dựng (Định mức dự toán xây dựng, lắp đặt, khảo sát, sửa chữa)
 * - Thông tư số 11/2021/TT-BXD (Xác định và quản lý chi phí đầu tư xây dựng)
 * - Thông tư số 14/2023/TT-BXD sửa đổi bổ sung định mức xây dựng
 */
export const COMPREHENSIVE_BXD_NORMS: NormTemplate[] = [
  // ==========================================
  // CHƯƠNG I (AA): CÔNG TÁC CHUẨN BỊ MẶT BẰNG & TIM MỐC
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
    code: 'AA.11331',
    name: 'Chặt hạ cây bóng mát đường kính gốc > 40cm có hạ ngọn an toàn',
    unit: 'cây',
    defaultPriceMat: 45000,
    defaultPriceLab: 380000,
    defaultPriceMac: 95000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAYTHUNG', name: 'Dây thừng kéo néo an toàn', unit: 'm', norm: 15, price: 3000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ đốn hạ bậc 4.0/7', unit: 'công', norm: 1.25, price: 304000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CUAMAY', name: 'Cưa xích máy', unit: 'ca', norm: 0.25, price: 380000 }
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
    code: 'AA.11421',
    name: 'Đào nhổ gốc cây đường kính > 20cm bằng máy đào 1.25m3',
    unit: 'gốc',
    defaultPriceMat: 0,
    defaultPriceLab: 65000,
    defaultPriceMac: 185000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.23, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO125', name: 'Máy đào 1.25m3', unit: 'ca', norm: 0.08, price: 2312500 }
    ]
  },
  {
    code: 'AA.12111',
    name: 'Định vị tim trục mốc công trình dân dụng, công nghiệp',
    unit: 'điểm',
    defaultPriceMat: 45000,
    defaultPriceLab: 180000,
    defaultPriceMac: 50000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COCGOMOC', name: 'Cọc gỗ, cọc sắt mốc tim', unit: 'bộ', norm: 1.0, price: 45000 }
    ],
    labors: [
      { code: 'NC_KSTT', name: 'Kỹ sư trắc đạc / Thợ bậc 4/7', unit: 'công', norm: 0.58, price: 310000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_TOANDAC', name: 'Máy toàn đạc điện tử Leica', unit: 'ca', norm: 0.25, price: 200000 }
    ]
  },
  {
    code: 'AA.12121',
    name: 'Giác móng công trình và định vị cao độ cốt chuẩn ±0.00',
    unit: 'công trình',
    defaultPriceMat: 450000,
    defaultPriceLab: 1200000,
    defaultPriceMac: 250000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GOBANG', name: 'Gỗ ván bảng giác móng', unit: 'm3', norm: 0.12, price: 3750000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ trắc đạc công trình', unit: 'công', norm: 3.8, price: 315000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_THUYBINH', name: 'Máy thủy bình tự động', unit: 'ca', norm: 1.0, price: 250000 }
    ]
  },
  {
    code: 'AA.13111',
    name: 'Làm đường công vụ thi công tạm thời rải cấp phối đá dăm dày 15cm',
    unit: '100m2',
    defaultPriceMat: 3850000,
    defaultPriceLab: 450000,
    defaultPriceMac: 1200000,
    chapter: 'Chương I: Chuẩn bị mặt bằng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DABASAN', name: 'Đá dăm cấp phối loại 2', unit: 'm3', norm: 18.0, price: 210000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công san gạt', unit: 'công', norm: 1.8, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_LURUNG', name: 'Xe lu rung 14T', unit: 'ca', norm: 0.45, price: 2660000 }
    ]
  },

  // ==========================================
  // CHƯƠNG II (AB): CÔNG TÁC ĐÀO ĐẮP ĐẤT ĐÁ CÁT & SAN ĐẦM
  // ==========================================
  {
    code: 'AB.11111',
    name: 'Đào cà dược, đào mương rãnh thoát nước thủ công, đất cấp I',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 165000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.66, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11121',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp I, thi công thủ công',
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
    code: 'AB.11122',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II, thi công thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 245000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.98, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11123',
    name: 'Đào hố móng sâu 1m - 3m, đất cấp II, thi công thủ công',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 295000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.18, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.11124',
    name: 'Đào hố móng sâu > 3m, đất cấp III, thi công thủ công có chuyển đất lên',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 385000,
    defaultPriceMac: 0,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.54, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AB.21111',
    name: 'Đào móng băng, móng bè bằng máy đào dung tích gầu 0.4m3, đất cấp I',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 450000,
    defaultPriceMac: 1850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.62, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO04', name: 'Máy đào 0.4m3', unit: 'ca', norm: 1.25, price: 1480000 }
    ]
  },
  {
    code: 'AB.21121',
    name: 'Đào hố móng bằng máy đào gầu 0.8m3, đất cấp II đổ lên phương tiện vận chuyển',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 520000,
    defaultPriceMac: 2450000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.87, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO08', name: 'Máy đào 0.8m3', unit: 'ca', norm: 1.15, price: 2130000 }
    ]
  },
  {
    code: 'AB.21122',
    name: 'Đào móng công trình bằng máy đào gầu 1.25m3, đất cấp II',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 480000,
    defaultPriceMac: 2850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.72, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO125', name: 'Máy đào 1.25m3', unit: 'ca', norm: 1.05, price: 2714000 }
    ]
  },
  {
    code: 'AB.21131',
    name: 'Đào đất hố móng sâu bằng máy đào gầu 1.6m3, đất cấp III',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 560000,
    defaultPriceMac: 3450000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 2.01, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO16', name: 'Máy đào 1.6m3', unit: 'ca', norm: 1.02, price: 3380000 }
    ]
  },
  {
    code: 'AB.21211',
    name: 'Đào nền đường giao thông bằng máy đào 1.25m3, đất cấp II đổ sang bên',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 380000,
    defaultPriceMac: 2250000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.36, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAO125', name: 'Máy đào 1.25m3', unit: 'ca', norm: 0.88, price: 2556000 }
    ]
  },
  {
    code: 'AB.24111',
    name: 'Đào phá đá nổ mìn nền đường, hố móng cấp đá II',
    unit: '10m3',
    defaultPriceMat: 385000,
    defaultPriceLab: 260000,
    defaultPriceMac: 480000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THUOCNO', name: 'Thuốc nổ Anfo/Amônit', unit: 'kg', norm: 4.5, price: 65000 },
      { code: 'VL_KIPNO', name: 'Kíp nổ vi sai điện', unit: 'cái', norm: 5.0, price: 18000 }
    ],
    labors: [
      { code: 'NC_THONO', name: 'Thợ nổ mìn bậc 4/7', unit: 'công', norm: 0.82, price: 317000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANDA', name: 'Máy nén khí & Búa khoan đá', unit: 'ca', norm: 0.32, price: 1500000 }
    ]
  },
  {
    code: 'AB.31111',
    name: 'Đắp đất móng công trình bằng thủ công, đầm cóc đạt độ chặt K95',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 68000,
    defaultPriceMac: 22000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.27, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DAMCOC', name: 'Máy đầm cóc 70kg', unit: 'ca', norm: 0.055, price: 400000 }
    ]
  },
  {
    code: 'AB.31121',
    name: 'Đắp đất nền đường, mặt bằng đầm nén bằng lu rung 14T đạt K95',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 280000,
    defaultPriceMac: 1450000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 1.12, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_LURUNG14T', name: 'Xe lu rung 14T', unit: 'ca', norm: 0.58, price: 2500000 }
    ]
  },
  {
    code: 'AB.31122',
    name: 'Đắp đất nền đường đầm nén bằng lu rung 16T đạt độ chặt K98',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 340000,
    defaultPriceMac: 1850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công đầm nén', unit: 'công', norm: 1.36, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_LURUNG16T', name: 'Xe lu rung 16T', unit: 'ca', norm: 0.68, price: 2720000 }
    ]
  },
  {
    code: 'AB.31211',
    name: 'Đắp cát tôn nền móng, đầm chặt bằng máy đầm cóc K90',
    unit: 'm3',
    defaultPriceMat: 195000,
    defaultPriceLab: 45000,
    defaultPriceMac: 18000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CATDEN', name: 'Cát đen tôn nền', unit: 'm3', norm: 1.22, price: 160000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công rải cát', unit: 'công', norm: 0.18, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DAMBAN', name: 'Máy đầm bàn / đầm cóc', unit: 'ca', norm: 0.045, price: 400000 }
    ]
  },
  {
    code: 'AB.31221',
    name: 'Đắp cát nền hạ tầng giao thông đầm nén bằng lu rung 14T đạt K95',
    unit: '100m3',
    defaultPriceMat: 21500000,
    defaultPriceLab: 260000,
    defaultPriceMac: 1350000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CATSAN', name: 'Cát san lấp K95', unit: 'm3', norm: 122.0, price: 176200 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công san đầm', unit: 'công', norm: 1.04, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_LURUNG', name: 'Lu rung 14T', unit: 'ca', norm: 0.52, price: 2600000 }
    ]
  },
  {
    code: 'AB.41111',
    name: 'San gạt mặt bằng bằng máy ủi công suất 110CV',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 185000,
    defaultPriceMac: 980000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Lái máy ủi bậc 3.5/7', unit: 'công', norm: 0.66, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UI110', name: 'Máy ủi 110CV', unit: 'ca', norm: 0.42, price: 2333000 }
    ]
  },
  {
    code: 'AB.51111',
    name: 'Vận chuyển đất bằng ô tô tự đổ 5T cự ly 1km, đất cấp II',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 120000,
    defaultPriceMac: 1450000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Lái xe tự đổ', unit: 'công', norm: 0.43, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_OTO5T', name: 'Ô tô tự đổ 5T', unit: 'ca', norm: 0.98, price: 1480000 }
    ]
  },
  {
    code: 'AB.51113',
    name: 'Vận chuyển đất bằng ô tô tự đổ 10T cự ly 5km, đất cấp II',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 160000,
    defaultPriceMac: 2850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Lái xe ô tô 10T', unit: 'công', norm: 0.57, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_OTO10T', name: 'Ô tô tự đổ 10T', unit: 'ca', norm: 1.25, price: 2280000 }
    ]
  },
  {
    code: 'AB.51115',
    name: 'Vận chuyển phế thải đất đá bằng ô tô tự đổ 10T cự ly 15km đổ bãi thải',
    unit: '100m3',
    defaultPriceMat: 0,
    defaultPriceLab: 220000,
    defaultPriceMac: 4850000,
    chapter: 'Chương II: Đào đắp đất đá',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Lái xe tự đổ', unit: 'công', norm: 0.79, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_OTO10T', name: 'Ô tô tự đổ 10T', unit: 'ca', norm: 2.12, price: 2288000 }
    ]
  },

  // ==========================================
  // CHƯƠNG III (AC): CỌC & XỬ LÝ NỀN MÓNG
  // ==========================================
  {
    code: 'AC.11111',
    name: 'Đóng cọc tre L=2.5m, đường kính gốc >= 6cm mật độ 25 cọc/m2 gia cố móng',
    unit: 'm',
    defaultPriceMat: 12000,
    defaultPriceLab: 14000,
    defaultPriceMac: 0,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COCTRE', name: 'Cọc tre tươi L=2.5m', unit: 'm', norm: 1.05, price: 11400 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công đóng cọc', unit: 'công', norm: 0.056, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AC.11211',
    name: 'Đóng cọc cừ tràm L=4m, gốc 8-10cm bằng máy đào gắn đầu rung',
    unit: 'cây',
    defaultPriceMat: 38000,
    defaultPriceLab: 12000,
    defaultPriceMac: 16000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUTRAM', name: 'Cừ tràm loại 1 L=4m', unit: 'cây', norm: 1.02, price: 37250 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đóng cừ', unit: 'công', norm: 0.043, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RUNGDAU', name: 'Máy đào gắn búa rung', unit: 'ca', norm: 0.0065, price: 2460000 }
    ]
  },
  {
    code: 'AC.21111',
    name: 'Ép cọc bê tông cốt thép 200x200 bằng máy ép neo thủy lực',
    unit: 'm',
    defaultPriceMat: 185000,
    defaultPriceLab: 38000,
    defaultPriceMac: 45000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COC200', name: 'Cọc BTCT 200x200 mác 250', unit: 'm', norm: 1.01, price: 183000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ ép cọc neo', unit: 'công', norm: 0.136, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPNEO', name: 'Máy ép neo thủy lực 50T', unit: 'ca', norm: 0.024, price: 1875000 }
    ]
  },
  {
    code: 'AC.21121',
    name: 'Ép cọc bê tông cốt thép 250x250 bằng máy ép tải thủy lực 120T',
    unit: 'm',
    defaultPriceMat: 245000,
    defaultPriceLab: 45000,
    defaultPriceMac: 58000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COC250', name: 'Cọc BTCT 250x250 mác 250 thép CB400', unit: 'm', norm: 1.01, price: 242500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ ép cọc', unit: 'công', norm: 0.161, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPTAI', name: 'Máy ép tải thủy lực 120T', unit: 'ca', norm: 0.026, price: 2230000 }
    ]
  },
  {
    code: 'AC.21131',
    name: 'Ép cọc bê tông cốt thép 300x300 bằng máy ép tải thủy lực 180T',
    unit: 'm',
    defaultPriceMat: 325000,
    defaultPriceLab: 52000,
    defaultPriceMac: 68000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COC300', name: 'Cọc BTCT 300x300 mác 300', unit: 'm', norm: 1.01, price: 321700 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công ép cọc', unit: 'công', norm: 0.187, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_EPTAI180', name: 'Máy ép cọc tải 180T', unit: 'ca', norm: 0.027, price: 2518000 }
    ]
  },
  {
    code: 'AC.21151',
    name: 'Ép cọc ống bê tông ly tâm dự ứng lực D400 bằng máy robot tự hành 320T',
    unit: 'm',
    defaultPriceMat: 345000,
    defaultPriceLab: 48000,
    defaultPriceMac: 75000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COCLYTAMD400', name: 'Cọc ly tâm D400 mác 800 (PC/PHC)', unit: 'm', norm: 1.01, price: 341500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ vận hành robot ép cọc', unit: 'công', norm: 0.172, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_ROBOT', name: 'Robot ép cọc thủy lực 320T', unit: 'ca', norm: 0.022, price: 3409000 }
    ]
  },
  {
    code: 'AC.25111',
    name: 'Đóng cọc cừ thép Larsen IV dài 12m bằng búa rung treo trên cần cẩu',
    unit: 'tấn',
    defaultPriceMat: 0,
    defaultPriceLab: 850000,
    defaultPriceMac: 2450000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_4.0', name: 'Tổ đóng cừ thép Larsen', unit: 'công', norm: 2.78, price: 305000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_BUARUNG', name: 'Cần cẩu bánh xích gắn búa rung', unit: 'ca', norm: 0.65, price: 3769000 }
    ]
  },
  {
    code: 'AC.25121',
    name: 'Nhổ cọc cừ thép Larsen IV sau khi thi công xong tầng hầm',
    unit: 'tấn',
    defaultPriceMat: 0,
    defaultPriceLab: 680000,
    defaultPriceMac: 1950000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [],
    labors: [
      { code: 'NC_4.0', name: 'Tổ nhổ cừ Larsen', unit: 'công', norm: 2.22, price: 306000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_BUARUNG', name: 'Cẩu gắn búa rung nhổ cừ', unit: 'ca', norm: 0.52, price: 3750000 }
    ]
  },
  {
    code: 'AC.31121',
    name: 'Khoan tạo lỗ cọc khoan nhồi D800 trong đất có dùng dung dịch bentonite',
    unit: 'm',
    defaultPriceMat: 145000,
    defaultPriceLab: 280000,
    defaultPriceMac: 650000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BENTONITE', name: 'Bột sét Bentonite API giữ vách', unit: 'kg', norm: 45.0, price: 3200 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ thợ khoan cọc nhồi', unit: 'công', norm: 0.89, price: 314000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANNHOP', name: 'Máy khoan xoay phản tuần hoàn', unit: 'ca', norm: 0.14, price: 4640000 }
    ]
  },
  {
    code: 'AC.31131',
    name: 'Khoan tạo lỗ cọc khoan nhồi D1000 sâu <= 40m có dùng dung dịch polymer/bentonite',
    unit: 'm',
    defaultPriceMat: 210000,
    defaultPriceLab: 360000,
    defaultPriceMac: 890000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_POLYMER', name: 'Dung dịch Polymer giữ thành vách', unit: 'kg', norm: 12.0, price: 17500 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ vận hành máy khoan cọc', unit: 'công', norm: 1.15, price: 313000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANBAUER', name: 'Máy khoan cọc nhồi Bauer', unit: 'ca', norm: 0.18, price: 4944000 }
    ]
  },
  {
    code: 'AC.32121',
    name: 'Đổ bê tông cọc khoan nhồi D1000 rút ống, bê tông thương phẩm mác 350',
    unit: 'm3',
    defaultPriceMat: 1650000,
    defaultPriceLab: 185000,
    defaultPriceMac: 145000,
    chapter: 'Chương III: Cọc & Nền móng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM350', name: 'Bê tông thương phẩm M350 độ sụt 18±2cm', unit: 'm3', norm: 1.15, price: 1434700 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đổ bê tông cọc rút ống', unit: 'công', norm: 0.66, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUPHUCVU', name: 'Cần cẩu phục vụ rút ống tremie', unit: 'ca', norm: 0.045, price: 3222000 }
    ]
  },

  // ==========================================
  // CHƯƠNG IV (AD): ĐƯỜNG GIAO THÔNG, HẠ TẦNG KỸ THUẬT & VỈA HÈ
  // ==========================================
  {
    code: 'AD.11111',
    name: 'Rải cấp phối đá dăm loại 2 dày 15cm bằng máy rải lu lèn K98',
    unit: '100m2',
    defaultPriceMat: 3950000,
    defaultPriceLab: 450000,
    defaultPriceMac: 1150000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CPDD2', name: 'Cấp phối đá dăm loại 2', unit: 'm3', norm: 18.5, price: 213500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ rải đường bậc 3.5/7', unit: 'công', norm: 1.62, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RAIDUONG', name: 'Máy rải cấp phối đá dăm', unit: 'ca', norm: 0.22, price: 2600000 },
      { code: 'M_LURUNG', name: 'Xe lu rung 16T', unit: 'ca', norm: 0.25, price: 2312000 }
    ]
  },
  {
    code: 'AD.11121',
    name: 'Rải cấp phối đá dăm loại 1 dày 15cm bằng máy rải lu rung 16T K98',
    unit: '100m2',
    defaultPriceMat: 4650000,
    defaultPriceLab: 480000,
    defaultPriceMac: 1250000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CPDD1', name: 'Cấp phối đá dăm loại 1 chất lượng cao', unit: 'm3', norm: 18.5, price: 251300 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công thi công đường', unit: 'công', norm: 1.72, price: 279000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_RAIDUONG', name: 'Máy rải & Lu rung', unit: 'ca', norm: 0.48, price: 2604000 }
    ]
  },
  {
    code: 'AD.11211',
    name: 'Tưới nhựa dính bám nhũ tương axit CRS-1 tiêu chuẩn 0.5kg/m2',
    unit: '100m2',
    defaultPriceMat: 750000,
    defaultPriceLab: 65000,
    defaultPriceMac: 145000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_NHUTUONG', name: 'Nhũ tương nhựa đường CRS-1', unit: 'kg', norm: 52.5, price: 14285 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công phụ tưới nhựa', unit: 'công', norm: 0.26, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_XETUOINHUA', name: 'Xe phun tưới nhựa đường nóng', unit: 'ca', norm: 0.065, price: 2230000 }
    ]
  },
  {
    code: 'AD.21111',
    name: 'Thảm bê tông nhựa hạt thô C25 dày 7cm bằng máy rải chuyên dùng lu lèn K98',
    unit: '100m2',
    defaultPriceMat: 18500000,
    defaultPriceLab: 1100000,
    defaultPriceMac: 3200000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTNC25', name: 'Bê tông nhựa nóng C25 trạm trộn', unit: 'tấn', norm: 17.5, price: 1057000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ thảm nhựa đường', unit: 'công', norm: 3.94, price: 279000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MAYTHAM', name: 'Máy rải thảm bê tông nhựa Vögele', unit: 'ca', norm: 0.52, price: 3450000 },
      { code: 'M_LULOP', name: 'Lu bánh lốp & Lu bánh thép', unit: 'ca', norm: 0.58, price: 2424000 }
    ]
  },
  {
    code: 'AD.21131',
    name: 'Thảm bê tông nhựa chặt hạt mịn C12.5 dày 5cm lu lèn đạt K98',
    unit: '100m2',
    defaultPriceMat: 14800000,
    defaultPriceLab: 980000,
    defaultPriceMac: 2850000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTNC125', name: 'Bê tông nhựa chặt C12.5 nóng 150°C', unit: 'tấn', norm: 12.8, price: 1156250 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ rải nhựa mặt đường', unit: 'công', norm: 3.51, price: 279000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MAYTHAM', name: 'Máy rải thảm chuyên dùng', unit: 'ca', norm: 0.46, price: 3450000 },
      { code: 'M_LUBANH', name: 'Xe lu rung & lu bánh lốp', unit: 'ca', norm: 0.52, price: 2430000 }
    ]
  },
  {
    code: 'AD.31111',
    name: 'Lát vỉa hè bằng gạch Terrazzo 400x400x30mm trên lớp vữa xi măng mác 75 dày 3cm',
    unit: 'm2',
    defaultPriceMat: 125000,
    defaultPriceLab: 65000,
    defaultPriceMac: 5000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHTERRA', name: 'Gạch Terrazzo 400x400 mài bóng', unit: 'viên', norm: 6.35, price: 12500 },
      { code: 'VL_VUAM75', name: 'Vữa xi măng M75 lót nền', unit: 'm3', norm: 0.035, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nề bậc 3.5/7', unit: 'công', norm: 0.233, price: 278000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRONVUA', name: 'Máy trộn vữa 80L', unit: 'ca', norm: 0.02, price: 250000 }
    ]
  },
  {
    code: 'AD.32111',
    name: 'Lắp đặt bó vỉa bê tông đúc sẵn 18x30cm vữa xi măng mác 100',
    unit: 'm',
    defaultPriceMat: 85000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BOVIA', name: 'Bó vỉa BT đúc sẵn 18x30x100cm', unit: 'viên', norm: 1.02, price: 78000 },
      { code: 'VL_VUAM100', name: 'Vữa xi măng M100 liên kết', unit: 'm3', norm: 0.005, price: 1080000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp bó vỉa', unit: 'công', norm: 0.161, price: 279000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AD.41111',
    name: 'Sơn vạch kẻ đường nhiệt dẻo phản quang màu trắng/vàng dày 2mm',
    unit: 'm2',
    defaultPriceMat: 145000,
    defaultPriceLab: 35000,
    defaultPriceMac: 25000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONNHIET', name: 'Sơn nhiệt dẻo phản quang hạt bi thủy tinh', unit: 'kg', norm: 4.8, price: 29000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sơn vạch đường', unit: 'công', norm: 0.125, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_KEDIEU', name: 'Máy nấu và kẻ vạch sơn đường', unit: 'ca', norm: 0.035, price: 714000 }
    ]
  },
  {
    code: 'AD.51111',
    name: 'Xây hố ga thu nước mưa rãnh vỉa hè kích thước 800x800x1200mm gạch thẻ vữa M75',
    unit: 'hố',
    defaultPriceMat: 1450000,
    defaultPriceLab: 680000,
    defaultPriceMac: 35000,
    chapter: 'Chương IV: Đường & Hạ tầng',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHTHE', name: 'Gạch thẻ tuynel 4x8x19', unit: 'viên', norm: 620, price: 1250 },
      { code: 'VL_VUAM75', name: 'Vữa xi măng M75 xây trát', unit: 'm3', norm: 0.45, price: 920000 },
      { code: 'VL_NAPGANG', name: 'Song chắn rác gang cầu 300x500mm', unit: 'bộ', norm: 1.0, price: 350000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nề xây hố ga', unit: 'công', norm: 2.43, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRONVUA', name: 'Máy trộn vữa', unit: 'ca', norm: 0.14, price: 250000 }
    ]
  },

  // ==========================================
  // CHƯƠNG V (AE): XÂY GẠCH & ĐÁ HỘC
  // ==========================================
  {
    code: 'AE.11211',
    name: 'Xây tường gạch ống 8x8x19 dày 10cm, vữa xi măng mác 75, chiều cao <= 4m',
    unit: 'm3',
    defaultPriceMat: 1250000,
    defaultPriceLab: 445000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH8x8', name: 'Gạch ống 8x8x19 tuynel', unit: 'viên', norm: 640, price: 1350, monthlyPrice: 1350 },
      { code: 'VL_XM40', name: 'Xi măng PCB40 Vicem', unit: 'kg', norm: 195, price: 1650, monthlyPrice: 1650 },
      { code: 'VL_CAT', name: 'Cát vàng xây tô', unit: 'm3', norm: 0.32, price: 220000, monthlyPrice: 220000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.58, price: 281645, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.11221',
    name: 'Xây tường gạch ống 8x8x19 dày 20cm, vữa xi măng mác 75',
    unit: 'm3',
    defaultPriceMat: 1210000,
    defaultPriceLab: 385000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH8x8', name: 'Gạch ống 8x8x19', unit: 'viên', norm: 615, price: 1350 },
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 185, price: 1650 },
      { code: 'VL_CAT', name: 'Cát xây tô', unit: 'm3', norm: 0.31, price: 220000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 1.36, price: 283088, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.11311',
    name: 'Xây tường gạch thẻ 4x8x19 dày 10cm, vữa xi măng mác 75 chống thấm',
    unit: 'm3',
    defaultPriceMat: 1450000,
    defaultPriceLab: 520000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHTHE', name: 'Gạch thẻ tuynel 4x8x19', unit: 'viên', norm: 1150, price: 1100 },
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 210, price: 1650 },
      { code: 'VL_CAT', name: 'Cát xây', unit: 'm3', norm: 0.34, price: 220000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nề bậc 3.5/7', unit: 'công', norm: 1.86, price: 279500, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.12111',
    name: 'Xây tường gạch bê tông không nung cốt liệu xi măng dày 10cm vữa XM mác 75',
    unit: 'm3',
    defaultPriceMat: 1180000,
    defaultPriceLab: 420000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHBL', name: 'Gạch bê tông xi măng cốt liệu', unit: 'viên', norm: 520, price: 1550 },
      { code: 'VL_VUAM75', name: 'Vữa xi măng M75', unit: 'm3', norm: 0.28, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nề', unit: 'công', norm: 1.5, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.12211',
    name: 'Xây tường gạch block bê tông nhẹ khí chưng áp AAC dày 10cm vữa chuyên dụng',
    unit: 'm3',
    defaultPriceMat: 1680000,
    defaultPriceLab: 350000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHAAC', name: 'Gạch bê tông khí chưng áp AAC 600x200x100', unit: 'm3', norm: 1.02, price: 1350000 },
      { code: 'VL_VUAKEOAAC', name: 'Vữa keo xây chuyên dụng AAC', unit: 'kg', norm: 45.0, price: 6500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ nề xây AAC', unit: 'công', norm: 1.25, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AE.21111',
    name: 'Xây móng đá hộc, vữa xi măng mác 75',
    unit: 'm3',
    defaultPriceMat: 850000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương V: Công tác xây',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAHOC', name: 'Đá hộc khai thác mỏ', unit: 'm3', norm: 1.15, price: 380000 },
      { code: 'VL_VUAM75', name: 'Vữa xi măng M75', unit: 'm3', norm: 0.44, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ xây đá hộc', unit: 'công', norm: 1.14, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG VI (AF): BÊ TÔNG TẠI CHỖ (M100 - M400)
  // ==========================================
  {
    code: 'AF.11111',
    name: 'Bê tông lót móng đá 4x6 mác 100, vữa XM PC30/PC40, đổ thủ công',
    unit: 'm3',
    defaultPriceMat: 920000,
    defaultPriceLab: 185000,
    defaultPriceMac: 42000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM30', name: 'Xi măng PCB30/40', unit: 'kg', norm: 200, price: 1650, monthlyPrice: 1650 },
      { code: 'VL_CATVANG', name: 'Cát vàng hạt trung', unit: 'm3', norm: 0.48, price: 230000, monthlyPrice: 230000 },
      { code: 'VL_DA4x6', name: 'Đá 4x6 đập tay/máy', unit: 'm3', norm: 0.88, price: 320000, monthlyPrice: 320000 },
      { code: 'VL_NUOC', name: 'Nước sạch đổ bê tông', unit: 'lít', norm: 160, price: 20, monthlyPrice: 20 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công bậc 3.0/7', unit: 'công', norm: 0.74, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_TRON250', name: 'Máy trộn bê tông 250L', unit: 'ca', norm: 0.08, price: 250000 },
      { code: 'M_DAMBAN', name: 'Máy đầm bàn 1.5kW', unit: 'ca', norm: 0.07, price: 314000 }
    ]
  },
  {
    code: 'AF.12210',
    name: 'Bê tông móng đá 1x2 mác 200, vữa XM PC40',
    unit: 'm3',
    defaultPriceMat: 1365000,
    defaultPriceLab: 210000,
    defaultPriceMac: 75000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40 Vicem', unit: 'kg', norm: 325, price: 1650, monthlyPrice: 1650 },
      { code: 'VL_CATVANG', name: 'Cát vàng bê tông', unit: 'm3', norm: 0.45, price: 240000, monthlyPrice: 240000 },
      { code: 'VL_DA1x2', name: 'Đá 1x2 xanh Biên Hòa/Hà Nam', unit: 'm3', norm: 0.85, price: 380000, monthlyPrice: 380000 },
      { code: 'VL_NUOC', name: 'Nước sạch', unit: 'lít', norm: 185, price: 20, monthlyPrice: 20 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.75, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TRON', name: 'Máy trộn bê tông 500L', unit: 'ca', norm: 0.09, price: 350000 },
      { code: 'M_DAMDUI', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.12, price: 362500 }
    ]
  },
  {
    code: 'AF.12220',
    name: 'Bê tông móng đá 1x2 mác 250, đổ bằng xe bơm bê tông chuyên dùng',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 185000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM250', name: 'Bê tông thương phẩm M250 độ sụt 12±2cm', unit: 'm3', norm: 1.02, price: 1392000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đổ đầm bê tông móng', unit: 'công', norm: 0.66, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMBE', name: 'Xe bơm cần bê tông tĩnh/cần', unit: 'ca', norm: 0.035, price: 2428000 }
    ]
  },
  {
    code: 'AF.13120',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 265000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 360, price: 1650 },
      { code: 'VL_CATVANG', name: 'Cát vàng', unit: 'm3', norm: 0.44, price: 240000 },
      { code: 'VL_DA1x2', name: 'Đá 1x2 sàng rửa', unit: 'm3', norm: 0.84, price: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đổ bê tông cột', unit: 'công', norm: 0.95, price: 279000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng lồng nâng 0.8T', unit: 'ca', norm: 0.08, price: 650000 },
      { code: 'M_DAMDUI', name: 'Đầm dùi cầm tay', unit: 'ca', norm: 0.14, price: 235000 }
    ]
  },
  {
    code: 'AF.13220',
    name: 'Bê tông cột tiết diện > 0.1m2 đá 1x2 mác 300, đổ máy bơm cần',
    unit: 'm3',
    defaultPriceMat: 1540000,
    defaultPriceLab: 220000,
    defaultPriceMac: 95000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM300', name: 'Bê tông thương phẩm M300 đá 1x2', unit: 'm3', norm: 1.02, price: 1509800 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đầm cột', unit: 'công', norm: 0.79, price: 278500, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMCAN', name: 'Xe bơm cần 37m', unit: 'ca', norm: 0.038, price: 2500000 }
    ]
  },
  {
    code: 'AF.14120',
    name: 'Bê tông dầm đá 1x2 mác 250, đổ bằng bơm cần bê tông',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 210000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM250', name: 'Bê tông thương phẩm M250', unit: 'm3', norm: 1.02, price: 1392000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đổ bê tông dầm', unit: 'công', norm: 0.75, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOM', name: 'Bơm cần bê tông', unit: 'ca', norm: 0.035, price: 2428000 }
    ]
  },
  {
    code: 'AF.15120',
    name: 'Bê tông sàn, mái đá 1x2 mác 250 đổ bằng xe bơm cần',
    unit: 'm3',
    defaultPriceMat: 1420000,
    defaultPriceLab: 195000,
    defaultPriceMac: 85000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM250', name: 'Bê tông thương phẩm M250 độ sụt 14±2cm', unit: 'm3', norm: 1.02, price: 1392000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ cào cán đầm sàn', unit: 'công', norm: 0.7, price: 278500, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMCAN', name: 'Bơm cần bê tông 37m', unit: 'ca', norm: 0.035, price: 2428000 }
    ]
  },
  {
    code: 'AF.16110',
    name: 'Bê tông bản thang bộ, chiếu nghỉ đá 1x2 mác 250',
    unit: 'm3',
    defaultPriceMat: 1450000,
    defaultPriceLab: 320000,
    defaultPriceMac: 75000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 360, price: 1650 },
      { code: 'VL_CAT', name: 'Cát vàng', unit: 'm3', norm: 0.44, price: 240000 },
      { code: 'VL_DA1x2', name: 'Đá 1x2', unit: 'm3', norm: 0.84, price: 380000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đổ bê tông cầu thang', unit: 'công', norm: 1.15, price: 278200, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DAMDUI', name: 'Máy đầm dùi', unit: 'ca', norm: 0.15, price: 320000 }
    ]
  },
  {
    code: 'AF.18110',
    name: 'Bê tông vách tầng hầm, bể nước ngầm mác 300 phụ gia chống thấm B8',
    unit: 'm3',
    defaultPriceMat: 1680000,
    defaultPriceLab: 260000,
    defaultPriceMac: 95000,
    chapter: 'Chương VI: Bê tông tại chỗ',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM300B8', name: 'Bê tông thương phẩm M300 phụ gia chống thấm W8', unit: 'm3', norm: 1.02, price: 1647000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đầm vách bể nước', unit: 'công', norm: 0.93, price: 279500, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BOMBE', name: 'Bơm cần bê tông', unit: 'ca', norm: 0.038, price: 2500000 }
    ]
  },

  // ==========================================
  // CHƯƠNG VII (AG): CẤU KIỆN BÊ TÔNG ĐÚC SẴN & CỐNG HỘP
  // ==========================================
  {
    code: 'AG.11111',
    name: 'Sản xuất tấm đan bê tông cốt thép đúc sẵn dày 8-10cm mác 250',
    unit: 'm3',
    defaultPriceMat: 1650000,
    defaultPriceLab: 450000,
    defaultPriceMac: 65000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BTM250', name: 'Bê tông M250 đá 1x2', unit: 'm3', norm: 1.02, price: 1420000 },
      { code: 'VL_THEPTAM', name: 'Cốt thép đan mác CB300', unit: 'kg', norm: 85.0, price: 17500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ đúc tấm đan', unit: 'công', norm: 1.61, price: 279500, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_BANRUNG', name: 'Bàn rung đúc bê tông', unit: 'ca', norm: 0.22, price: 295000 }
    ]
  },
  {
    code: 'AG.12131',
    name: 'Lắp đặt cống tròn bê tông cốt thép đúc sẵn D800 bằng cần cẩu 10T',
    unit: 'm',
    defaultPriceMat: 650000,
    defaultPriceLab: 110000,
    defaultPriceMac: 145000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGD800', name: 'Ống cống tròn BTCT D800 chịu lực', unit: 'm', norm: 1.01, price: 625000 },
      { code: 'VL_GIAONOI', name: 'Vữa xi măng chèn mối nối M100', unit: 'm3', norm: 0.02, price: 1100000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp cống', unit: 'công', norm: 0.39, price: 282000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUTUDO', name: 'Cần cẩu bánh lốp 10T', unit: 'ca', norm: 0.045, price: 3220000 }
    ]
  },
  {
    code: 'AG.12141',
    name: 'Lắp đặt cống tròn bê tông cốt thép D1000 mối nối loe có gioăng cao su',
    unit: 'm',
    defaultPriceMat: 920000,
    defaultPriceLab: 145000,
    defaultPriceMac: 185000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGD1000', name: 'Ống cống BTCT D1000 tải trọng H30', unit: 'm', norm: 1.01, price: 890000 },
      { code: 'VL_GIOANG', name: 'Gioăng cao su chữ V D1000', unit: 'cái', norm: 0.4, price: 75000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ lắp đặt cống', unit: 'công', norm: 0.52, price: 278800, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAU16T', name: 'Cần cẩu bánh lốp 16T', unit: 'ca', norm: 0.052, price: 3557000 }
    ]
  },
  {
    code: 'AG.13111',
    name: 'Lắp đặt cống hộp bê tông cốt thép đơn kích thước 1.0x1.0m bằng cẩu',
    unit: 'm',
    defaultPriceMat: 1450000,
    defaultPriceLab: 180000,
    defaultPriceMac: 245000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGHOP1x1', name: 'Đốt cống hộp 1.0x1.0m L=1.5m', unit: 'm', norm: 1.01, price: 1420000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ lắp cống hộp', unit: 'công', norm: 0.64, price: 281250, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAU25T', name: 'Cần cẩu 25T phục vụ', unit: 'ca', norm: 0.058, price: 4224000 }
    ]
  },
  {
    code: 'AG.13131',
    name: 'Lắp đặt cống hộp bê tông cốt thép đơn 1.5x1.5m bằng cần cẩu 25T',
    unit: 'm',
    defaultPriceMat: 2250000,
    defaultPriceLab: 240000,
    defaultPriceMac: 320000,
    chapter: 'Chương VII: Bê tông đúc sẵn',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CONGHOP15', name: 'Đốt cống hộp 1.5x1.5m', unit: 'm', norm: 1.01, price: 2210000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ lắp cống', unit: 'công', norm: 0.86, price: 279000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAU25T', name: 'Cần cẩu 25T', unit: 'ca', norm: 0.076, price: 4210000 }
    ]
  },

  // ==========================================
  // CHƯƠNG VIII (AH): CỐT THÉP BÊ TÔNG
  // ==========================================
  {
    code: 'AH.11110',
    name: 'Gia công lắp dựng cốt thép móng đường kính d <= 10mm thép CB300',
    unit: 'tấn',
    defaultPriceMat: 17200000,
    defaultPriceLab: 2650000,
    defaultPriceMac: 380000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPD10', name: 'Thép cuộn tròn trơn d <= 10mm Hòa Phát CB300', unit: 'kg', norm: 1020, price: 16800 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc thép', unit: 'công', norm: 9.5, price: 278947, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UONTHEP', name: 'Máy uốn cắt sắt điện', unit: 'ca', norm: 0.95, price: 400000 }
    ]
  },
  {
    code: 'AH.11120',
    name: 'Gia công lắp dựng cốt thép móng đường kính 10 < d <= 18mm thép vằn CB400',
    unit: 'tấn',
    defaultPriceMat: 16800000,
    defaultPriceLab: 2850000,
    defaultPriceMac: 450000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPD18', name: 'Thép thanh vằn phi 14-18 CB400', unit: 'kg', norm: 1020, price: 16400 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn buộc cốt thép', unit: 'công', norm: 10.2, price: 279411, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UONCAT', name: 'Máy cắt uốn thép 5kW', unit: 'ca', norm: 1.1, price: 409000 }
    ]
  },
  {
    code: 'AH.11130',
    name: 'Gia công lắp dựng cốt thép móng đường kính d > 18mm (phi 20, 22, 25)',
    unit: 'tấn',
    defaultPriceMat: 16800000,
    defaultPriceLab: 2550000,
    defaultPriceMac: 420000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPD25', name: 'Thép thanh vằn phi 20-25 CB400/CB500', unit: 'kg', norm: 1020, price: 16400 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ uốn cốt thép lớn', unit: 'công', norm: 9.1, price: 280200, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATTHEP', name: 'Máy cắt thép thủy lực', unit: 'ca', norm: 1.05, price: 400000 }
    ]
  },
  {
    code: 'AH.13120',
    name: 'Gia công lắp dựng cốt thép cột đường kính 10 < d <= 18mm thép CB400',
    unit: 'tấn',
    defaultPriceMat: 16800000,
    defaultPriceLab: 3200000,
    defaultPriceMac: 520000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPC400', name: 'Thép vằn cột CB400', unit: 'kg', norm: 1020, price: 16400 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ buộc thép cột cao', unit: 'công', norm: 11.5, price: 278260, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng thép', unit: 'ca', norm: 0.8, price: 650000 }
    ]
  },
  {
    code: 'AH.14120',
    name: 'Gia công lắp dựng cốt thép dầm đường kính 10 < d <= 18mm',
    unit: 'tấn',
    defaultPriceMat: 16800000,
    defaultPriceLab: 3100000,
    defaultPriceMac: 480000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPDAM', name: 'Thép dầm CB400', unit: 'kg', norm: 1020, price: 16400 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ buộc cốt thép dầm', unit: 'công', norm: 11.1, price: 279279, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATUON', name: 'Máy cắt uốn thép', unit: 'ca', norm: 1.2, price: 400000 }
    ]
  },
  {
    code: 'AH.15110',
    name: 'Gia công lắp dựng cốt thép sàn, mái đường kính d <= 10mm (phi 8, phi 10 đan 2 lớp)',
    unit: 'tấn',
    defaultPriceMat: 17200000,
    defaultPriceLab: 2950000,
    defaultPriceMac: 420000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPSAN', name: 'Thép cuộn/thanh phi 8-10', unit: 'kg', norm: 1020, price: 16800 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đan sắt sàn 2 lớp', unit: 'công', norm: 10.5, price: 280952, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_UONTHEP', name: 'Máy nắn uốn thép', unit: 'ca', norm: 1.05, price: 400000 }
    ]
  },
  {
    code: 'AH.18110',
    name: 'Nối cốt thép bằng ống nối ren Coupler cho thép đường kính d >= 22mm',
    unit: 'mối',
    defaultPriceMat: 65000,
    defaultPriceLab: 45000,
    defaultPriceMac: 25000,
    chapter: 'Chương VIII: Cốt thép bê tông',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_COUPLER', name: 'Ống nối ren cơ khí Coupler D25', unit: 'cái', norm: 1.0, price: 65000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ vặn siết ren', unit: 'công', norm: 0.16, price: 281250, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TIENREN', name: 'Máy tiện ren đầu thép', unit: 'ca', norm: 0.05, price: 500000 }
    ]
  },

  // ==========================================
  // CHƯƠNG IX (AI): VÁN KHUÔN COFFA & GIÀN GIÁO
  // ==========================================
  {
    code: 'AI.11120',
    name: 'Sản xuất lắp dựng và tháo dỡ ván khuôn móng thép định hình',
    unit: '100m2',
    defaultPriceMat: 3850000,
    defaultPriceLab: 4500000,
    defaultPriceMac: 350000,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_VKTHEP', name: 'Ván khuôn thép định hình luân chuyển', unit: 'm2', norm: 105, price: 35000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ mộc/sắt coffa móng', unit: 'công', norm: 16.1, price: 279500, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CAUCON', name: 'Cần cẩu / Vận thăng', unit: 'ca', norm: 0.5, price: 700000 }
    ]
  },
  {
    code: 'AI.12130',
    name: 'Ván khuôn cột ván ép phủ phim keo chống nước WBP dày 18mm hệ xà gồ hộp',
    unit: '100m2',
    defaultPriceMat: 8500000,
    defaultPriceLab: 7800000,
    defaultPriceMac: 650000,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_PHUPHIM', name: 'Ván ép phủ phim 18mm luân chuyển 5 lần', unit: 'm2', norm: 28.0, price: 260000 },
      { code: 'VL_HOPTHEP', name: 'Hộp thép 50x50x1.8 giằng cột', unit: 'm', norm: 120, price: 18000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ lắp dựng coffa cột', unit: 'công', norm: 28.0, price: 278571, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng nâng vật tư', unit: 'ca', norm: 1.0, price: 650000 }
    ]
  },
  {
    code: 'AI.13110',
    name: 'Ván khuôn dầm ván ép phủ phim 18mm hệ giàn giáo chống thép',
    unit: '100m2',
    defaultPriceMat: 7800000,
    defaultPriceLab: 7200000,
    defaultPriceMac: 580000,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_PHUPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 26.0, price: 260000 },
      { code: 'VL_GIAOCHONG', name: 'Cây chống thép tăng đơ', unit: 'bộ', norm: 85.0, price: 12000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ván khuôn dầm', unit: 'công', norm: 25.8, price: 279069, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng lồng', unit: 'ca', norm: 0.9, price: 644444 }
    ]
  },
  {
    code: 'AI.14110',
    name: 'Ván khuôn sàn, mái ván ép phủ phim 18mm hệ giàn giáo nêm/chén chịu lực',
    unit: '100m2',
    defaultPriceMat: 7200000,
    defaultPriceLab: 6500000,
    defaultPriceMac: 550000,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_PHUPHIM', name: 'Ván ép phủ phim 18mm', unit: 'm2', norm: 24.0, price: 260000 },
      { code: 'VL_XAGO', name: 'Xà gồ thép hộp 50x100x1.8', unit: 'm', norm: 95.0, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ lắp coffa sàn', unit: 'công', norm: 23.3, price: 278969, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Vận thăng chuyển vật tư', unit: 'ca', norm: 0.85, price: 647000 }
    ]
  },
  {
    code: 'AI.15110',
    name: 'Ván khuôn cầu thang bộ ván ép phủ phim gia công theo bậc giật cấp',
    unit: '100m2',
    defaultPriceMat: 9200000,
    defaultPriceLab: 9500000,
    defaultPriceMac: 450000,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_PHUPHIM', name: 'Ván ép phủ phim + gỗ gia cố thành bậc', unit: 'm2', norm: 32.0, price: 260000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ mộc định hình bậc thang', unit: 'công', norm: 31.0, price: 306451, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AI.21110',
    name: 'Giàn giáo ngoài phục vụ công tác xây trát hoàn thiện giáo khung thép',
    unit: '100m2',
    defaultPriceMat: 1450000,
    defaultPriceLab: 1850000,
    defaultPriceMac: 0,
    chapter: 'Chương IX: Ván khuôn coffa',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GIAOKHUNG', name: 'Khung giàn giáo thép mạ kẽm luân chuyển', unit: 'bộ', norm: 35.0, price: 32000 },
      { code: 'VL_LUOICHE', name: 'Lưới bao che công trình an toàn xanh', unit: 'm2', norm: 110.0, price: 3500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ lắp giàn giáo ngoài', unit: 'công', norm: 6.6, price: 280300, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG X (AK): HOÀN THIỆN CÔNG TRÌNH
  // ==========================================
  {
    code: 'AK.11110',
    name: 'Trát tường trong dày 1.5cm, vữa xi măng mác 75',
    unit: 'm2',
    defaultPriceMat: 32000,
    defaultPriceLab: 68000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40 Vicem', unit: 'kg', norm: 5.4, price: 1650, monthlyPrice: 1650 },
      { code: 'VL_CAT', name: 'Cát mịn trát tường', unit: 'm3', norm: 0.019, price: 230000, monthlyPrice: 230000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát tường bậc 3.5/7', unit: 'công', norm: 0.24, price: 283333, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.11210',
    name: 'Trát tường ngoài nhà dày 2.0cm, vữa xi măng mác 75 có phụ gia chống thấm',
    unit: 'm2',
    defaultPriceMat: 45000,
    defaultPriceLab: 88000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 7.2, price: 1650 },
      { code: 'VL_CAT', name: 'Cát trát', unit: 'm3', norm: 0.024, price: 230000 },
      { code: 'VL_SIKACT', name: 'Phụ gia chống thấm trộn vữa Sika Latex', unit: 'lít', norm: 0.5, price: 55000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ trát tường ngoài đu dây/giáo', unit: 'công', norm: 0.31, price: 283870, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.21110',
    name: 'Láng nền, sàn vữa xi măng mác 75 dày 2cm',
    unit: 'm2',
    defaultPriceMat: 28000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_XM40', name: 'Xi măng PCB40', unit: 'kg', norm: 6.8, price: 1650 },
      { code: 'VL_CAT', name: 'Cát cán nền', unit: 'm3', norm: 0.025, price: 220000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ cán nền', unit: 'công', norm: 0.16, price: 281250, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.31110',
    name: 'Chống thấm sàn vệ sinh, ban công bằng 2 lớp SikaTop Seal 107 quét màng đàn hồi',
    unit: 'm2',
    defaultPriceMat: 85000,
    defaultPriceLab: 55000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SIKA107', name: 'Vữa chống thấm SikaTop Seal 107 (bộ 25kg)', unit: 'kg', norm: 2.5, price: 32000 },
      { code: 'VL_LUOITHUY', name: 'Lưới thủy tinh gia cường góc chân tường', unit: 'm', norm: 0.35, price: 14000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thi công chống thấm', unit: 'công', norm: 0.19, price: 289473, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.31210',
    name: 'Chống thấm đáy tầng hầm bằng màng khò nóng Bitum dày 3mm có lớp bảo vệ',
    unit: 'm2',
    defaultPriceMat: 165000,
    defaultPriceLab: 65000,
    defaultPriceMac: 15000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_MANGBITUM', name: 'Màng chống thấm khò nóng Bitum 3mm nhập khẩu', unit: 'm2', norm: 1.15, price: 135000 },
      { code: 'VL_PRIMER', name: 'Sơn lót Bitum Primer', unit: 'lít', norm: 0.25, price: 38000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ khò màng chống thấm', unit: 'công', norm: 0.23, price: 282608, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_KHOGAS', name: 'Bình gas & Đèn khò nhiệt', unit: 'ca', norm: 0.05, price: 300000 }
    ]
  },
  {
    code: 'AK.41120',
    name: 'Lát nền gạch ceramic 400x400mm vữa xi măng mác 75 chà ron trắng',
    unit: 'm2',
    defaultPriceMat: 145000,
    defaultPriceLab: 75000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH400', name: 'Gạch Ceramic Viglacera 400x400', unit: 'viên', norm: 6.4, price: 16500 },
      { code: 'VL_VUAM75', name: 'Vữa XM M75 lót lát', unit: 'm3', norm: 0.025, price: 920000 },
      { code: 'VL_CHARON', name: 'Bột chà ron trắng Weber', unit: 'kg', norm: 0.35, price: 22000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ ốp lát bậc 3.5/7', unit: 'công', norm: 0.268, price: 279850, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.41210',
    name: 'Lát nền gạch granite bóng kiếng 600x600mm keo dán gạch chuyên dụng',
    unit: 'm2',
    defaultPriceMat: 235000,
    defaultPriceLab: 95000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH600', name: 'Gạch Granite bóng kiếng toàn phần 600x600', unit: 'm2', norm: 1.04, price: 185000 },
      { code: 'VL_KEODAN', name: 'Keo dán gạch Weber/Sika', unit: 'kg', norm: 5.5, price: 7800 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lát gạch cao cấp', unit: 'công', norm: 0.34, price: 279411, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.41230',
    name: 'Lát nền gạch granite cao cấp 800x800mm keo dán gạch ke nêm cân bằng',
    unit: 'm2',
    defaultPriceMat: 345000,
    defaultPriceLab: 120000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACH800', name: 'Gạch Granite 800x800 xương đá porcelain', unit: 'm2', norm: 1.03, price: 295000 },
      { code: 'VL_KECANBANG', name: 'Ke nêm cân bằng ốp lát', unit: 'bộ', norm: 12.0, price: 1800 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lát gạch tay nghề cao', unit: 'công', norm: 0.39, price: 307692, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.41310',
    name: 'Lát sàn gỗ công nghiệp chịu nước dày 12mm hèm khóa lớp xốp cao su non',
    unit: 'm2',
    defaultPriceMat: 360000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SANGO', name: 'Sàn gỗ công nghiệp cốt xanh HDF 12mm', unit: 'm2', norm: 1.05, price: 320000 },
      { code: 'VL_XOPCAOSU', name: 'Xốp cao su non lót sàn 2mm', unit: 'm2', norm: 1.05, price: 15000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp sàn gỗ', unit: 'công', norm: 0.16, price: 281250, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.51110',
    name: 'Ốp gạch men tường vệ sinh 300x600mm vữa xi măng mác 75 chà ron chống mốc',
    unit: 'm2',
    defaultPriceMat: 175000,
    defaultPriceLab: 98000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_GACHOP3060', name: 'Gạch ốp tường men bóng 300x600 Prime/Viglacera', unit: 'm2', norm: 1.04, price: 145000 },
      { code: 'VL_VUAM75', name: 'Vữa XM M75 dán tường', unit: 'm3', norm: 0.022, price: 920000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ ốp tường', unit: 'công', norm: 0.35, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.51210',
    name: 'Ốp đá Granite tự nhiên dày 18-20mm mặt bàn bếp, bậc tam cấp',
    unit: 'm2',
    defaultPriceMat: 850000,
    defaultPriceLab: 260000,
    defaultPriceMac: 35000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAGRANITE', name: 'Đá Granite Kim Sa Trung / Đen Huế', unit: 'm2', norm: 1.05, price: 780000 },
      { code: 'VL_KEOAB', name: 'Keo dán đá 2 thành phần AB', unit: 'bộ', norm: 0.5, price: 45000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ thi công đá hoa cương', unit: 'công', norm: 0.85, price: 305882, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATMAIDA', name: 'Máy cắt mài bóng đá cầm tay', unit: 'ca', norm: 0.15, price: 233000 }
    ]
  },
  {
    code: 'AK.51220',
    name: 'Ốp đá Granite tự nhiên mặt bậc và cổ bậc cầu thang bộ nẹp chỉ chống trượt',
    unit: 'm2',
    defaultPriceMat: 950000,
    defaultPriceLab: 320000,
    defaultPriceMac: 45000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_DAGRANITE', name: 'Đá Granite tự nhiên chạy chỉ len bo cạnh', unit: 'm2', norm: 1.06, price: 860000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ ốp cầu thang', unit: 'công', norm: 1.05, price: 304761, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_MAI', name: 'Máy mài phào chỉ đá', unit: 'ca', norm: 0.18, price: 250000 }
    ]
  },
  {
    code: 'AK.61110',
    name: 'Làm trần thạch cao khung xương chìm Vĩnh Tường tấm tiêu chuẩn Gyproc 9mm',
    unit: 'm2',
    defaultPriceMat: 145000,
    defaultPriceLab: 55000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_KHUNGVT', name: 'Khung xương trần chìm Vĩnh Tường Basi/Alpha', unit: 'm2', norm: 1.0, price: 78000 },
      { code: 'VL_TAMTHACHCAO', name: 'Tấm thạch cao tiêu chuẩn Gyproc 9mm', unit: 'm2', norm: 1.05, price: 58000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đóng trần thạch cao', unit: 'công', norm: 0.198, price: 277777, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.61120',
    name: 'Làm trần thạch cao khung chìm tấm chống ẩm Gyproc 9mm cho nhà vệ sinh, logia',
    unit: 'm2',
    defaultPriceMat: 175000,
    defaultPriceLab: 60000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_KHUNGVT', name: 'Khung xương Vĩnh Tường chống rỉ', unit: 'm2', norm: 1.0, price: 78000 },
      { code: 'VL_TAMAM', name: 'Tấm thạch cao chịu ẩm xanh 9mm', unit: 'm2', norm: 1.05, price: 85000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thạch cao', unit: 'công', norm: 0.215, price: 279069, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.71110',
    name: 'Bả matit 2 nước tường trong nhà (bột bả Dulux/Jotun chất lượng cao)',
    unit: 'm2',
    defaultPriceMat: 16000,
    defaultPriceLab: 24000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BOTBA', name: 'Bột bả tường Dulux trong nhà', unit: 'kg', norm: 1.4, price: 9500 },
      { code: 'VL_GIAYRAP', name: 'Giấy ráp xả nhám', unit: 'tờ', norm: 0.35, price: 6000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Thợ bả sơn', unit: 'công', norm: 0.096, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'AK.71120',
    name: 'Sơn lót kháng kiềm 1 nước + sơn phủ màu 2 nước tường trong nhà (Dulux/Maxilite)',
    unit: 'm2',
    defaultPriceMat: 32000,
    defaultPriceLab: 28000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONLOT', name: 'Sơn lót kháng kiềm trong nhà', unit: 'lít', norm: 0.11, price: 85000 },
      { code: 'VL_SONPHU', name: 'Sơn màu nội thất cao cấp Dulux EasyClean', unit: 'lít', norm: 0.18, price: 125000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sơn nước', unit: 'công', norm: 0.1, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.71210',
    name: 'Sơn tường ngoài nhà 1 nước lót kháng kiềm + 2 nước sơn phủ chống thấm Dulux Weathershield',
    unit: 'm2',
    defaultPriceMat: 48000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_SONNGOAI', name: 'Sơn ngoại thất chống bám bụi Dulux Weathershield', unit: 'lít', norm: 0.22, price: 175000 },
      { code: 'VL_LOTNGOAI', name: 'Sơn lót ngoại thất', unit: 'lít', norm: 0.12, price: 95000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ sơn ngoài đu dây', unit: 'công', norm: 0.16, price: 281250, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.71310',
    name: 'Sơn sàn Epoxy hệ lăn 3 lớp (1 lớp lót + 2 lớp phủ) cho sàn nhà xưởng công nghiệp',
    unit: 'm2',
    defaultPriceMat: 85000,
    defaultPriceLab: 45000,
    defaultPriceMac: 15000,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_EPOXYLOT', name: 'Sơn lót sàn Epoxy', unit: 'kg', norm: 0.15, price: 165000 },
      { code: 'VL_EPOXYPHU', name: 'Sơn phủ màu sàn Epoxy Kova/Chokwang', unit: 'kg', norm: 0.35, price: 170000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ thi công sơn sàn công nghiệp', unit: 'công', norm: 0.16, price: 281250, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_MAISAN', name: 'Máy mài sàn bê tông hút bụi', unit: 'ca', norm: 0.045, price: 333000 }
    ]
  },
  {
    code: 'AK.81120',
    name: 'Lợp mái tôn xốp PU cách nhiệt 3 lớp (Tôn + PU + Giấy bạc) dày 0.45mm xà gồ thép',
    unit: 'm2',
    defaultPriceMat: 185000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_TONPU', name: 'Tôn xốp sóng vuông cách nhiệt 3 lớp Hoa Sen/Đông Á', unit: 'm2', norm: 1.08, price: 165000 },
      { code: 'VL_VITBAN', name: 'Vít tự khoan mạ kẽm kèm gioăng cao su', unit: 'cái', norm: 6.0, price: 800 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lợp mái tôn', unit: 'công', norm: 0.161, price: 279500, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AK.81130',
    name: 'Lắp đặt xà gồ thép hộp mạ kẽm 50x100x1.8mm cho hệ mái tôn',
    unit: 'kg',
    defaultPriceMat: 22000,
    defaultPriceLab: 6500,
    defaultPriceMac: 2500,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_HOP50x100', name: 'Thép hộp mạ kẽm 50x100x1.8mm Hòa Phát', unit: 'kg', norm: 1.03, price: 20500 },
      { code: 'VL_QUEHAN', name: 'Que hàn điện E42', unit: 'kg', norm: 0.02, price: 35000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ cơ khí lắp xà gồ', unit: 'công', norm: 0.023, price: 282600, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_HAN', name: 'Máy hàn điện inverter', unit: 'ca', norm: 0.012, price: 208000 }
    ]
  },
  {
    code: 'AK.81210',
    name: 'Lợp ngói màu xi măng sóng / phẳng khung kèo thép mạ hợp kim',
    unit: 'm2',
    defaultPriceMat: 165000,
    defaultPriceLab: 65000,
    defaultPriceMac: 0,
    chapter: 'Chương X: Hoàn thiện công trình',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_NGOIMAU', name: 'Ngói màu xi măng SCG / Đồng Tâm (10 viên/m2)', unit: 'viên', norm: 10.2, price: 15500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lợp ngói', unit: 'công', norm: 0.232, price: 280172, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // CHƯƠNG XI (AL): KẾT CẤU THÉP, ZAMIL & NHÔM KÍNH XINGFA
  // ==========================================
  {
    code: 'AL.11110',
    name: 'Gia công kết cấu thép khung Zamil, kèo thép, cột thép tổ hợp chữ I',
    unit: 'tấn',
    defaultPriceMat: 28500000,
    defaultPriceLab: 4500000,
    defaultPriceMac: 1850000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPTAM', name: 'Thép tấm SS400/Q345B cắt quy cách', unit: 'kg', norm: 1040, price: 24500 },
      { code: 'VL_SONCHONGRISI', name: 'Sơn lót chống rỉ 2 lớp + sơn màu bề mặt', unit: 'kg', norm: 25.0, price: 75000 },
      { code: 'VL_DAYHAN', name: 'Dây hàn tự động CO2/thuốc hàn', unit: 'kg', norm: 18.0, price: 38000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ gia công kết cấu thép bậc 4/7', unit: 'công', norm: 14.7, price: 306122, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CATCNC', name: 'Máy cắt plasma CNC & Dây chuyền hàn đính nắn dầm', unit: 'ca', norm: 1.25, price: 1480000 }
    ]
  },
  {
    code: 'AL.11120',
    name: 'Lắp dựng kết cấu thép nhà công nghiệp khẩu độ B=20-30m bằng cần cẩu 25T',
    unit: 'tấn',
    defaultPriceMat: 850000,
    defaultPriceLab: 2600000,
    defaultPriceMac: 3200000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_BULONGCUONG', name: 'Bu lông liên kết cường độ cao cấp bền 8.8', unit: 'bộ', norm: 35.0, price: 24000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ thợ lắp dựng trên cao', unit: 'công', norm: 8.5, price: 305882, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CAU25T', name: 'Cần cẩu bánh lốp 25T', unit: 'ca', norm: 0.76, price: 4210000 }
    ]
  },
  {
    code: 'AL.21110',
    name: 'Gia công lắp dựng lan can cầu thang thép hộp sơn tĩnh điện tay vịn sắt',
    unit: 'm',
    defaultPriceMat: 450000,
    defaultPriceLab: 280000,
    defaultPriceMac: 35000,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_THEPHOP', name: 'Thép hộp mạ kẽm sơn tĩnh điện màu đen mờ', unit: 'kg', norm: 14.5, price: 28000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ hàn cơ khí bậc 3.5/7', unit: 'công', norm: 1.0, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_HAN', name: 'Máy hàn điện cầm tay', unit: 'ca', norm: 0.15, price: 233000 }
    ]
  },
  {
    code: 'AL.21210',
    name: 'Gia công lắp dựng lan can ban công kính cường lực 10mm trụ Inox 304 tay vịn tròn',
    unit: 'm',
    defaultPriceMat: 1150000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_KINH10MM', name: 'Kính cường lực 10mm tôi nhiệt', unit: 'm2', norm: 0.95, price: 650000 },
      { code: 'VL_TRUINOX', name: 'Trụ lửng Inox 304 đặc kẹp kính', unit: 'cái', norm: 1.8, price: 240000 },
      { code: 'VL_TAYVIN', name: 'Tay vịn ống Inox 304 phi 50', unit: 'm', norm: 1.02, price: 165000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nhôm kính chuyên nghiệp', unit: 'công', norm: 1.04, price: 307692, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AL.31110',
    name: 'Lắp đặt cửa đi nhôm hệ Xingfa nhập khẩu thanh profile dày 2.0mm kính an toàn 8.38mm',
    unit: 'm2',
    defaultPriceMat: 2150000,
    defaultPriceLab: 380000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUANHOM', name: 'Cửa nhôm Xingfa hệ 55 tem đỏ nhập khẩu', unit: 'm2', norm: 1.0, price: 1750000 },
      { code: 'VL_KINH838', name: 'Kính dán an toàn 8.38mm 2 lớp', unit: 'm2', norm: 0.85, price: 320000 },
      { code: 'VL_PHUKIENKINLONG', name: 'Phụ kiện Kinlong đồng bộ khóa đa điểm', unit: 'bộ', norm: 0.25, price: 650000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp đặt cửa nhôm kính', unit: 'công', norm: 1.24, price: 306451, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AL.31120',
    name: 'Lắp đặt cửa sổ mở quay/hất nhôm hệ Xingfa dày 1.4mm kính an toàn 8.38mm',
    unit: 'm2',
    defaultPriceMat: 1750000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUASOXINGFA', name: 'Cửa sổ nhôm Xingfa hệ 55 dày 1.4mm kèm kính 8.38mm', unit: 'm2', norm: 1.0, price: 1650000 },
      { code: 'VL_KEOKEO', name: 'Keo Silicon Dow Corning chống thấm', unit: 'chai', norm: 1.5, price: 45000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp cửa sổ', unit: 'công', norm: 1.15, price: 278260, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'AL.32120',
    name: 'Lắp đặt cửa kính cường lực mở quay bản lề sàn thủy lực dày 12mm phụ kiện VVP Thái Lan',
    unit: 'm2',
    defaultPriceMat: 980000,
    defaultPriceLab: 260000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_KINH12', name: 'Kính cường lực 12mm mài xiết cạnh', unit: 'm2', norm: 1.0, price: 780000 },
      { code: 'VL_BANLE', name: 'Bản lề sàn thủy lực VVP FC34 + Kẹp góc', unit: 'bộ', norm: 0.25, price: 800000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ nhôm kính', unit: 'công', norm: 0.85, price: 305882, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'AL.33110',
    name: 'Lắp đặt cửa cuốn khe thoáng nhôm công nghệ Đức dày 1.2-1.4mm kèm motor và bình lưu điện',
    unit: 'm2',
    defaultPriceMat: 1750000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương XI: Kết cấu thép & Kim loại',
    categoryGroup: 'Xây dựng',
    materials: [
      { code: 'VL_CUACUON', name: 'Nan cửa cuốn nhôm khe thoáng Austdoor/Titadoor', unit: 'm2', norm: 1.0, price: 1550000 },
      { code: 'VL_RAYTRUC', name: 'Ray dẫn hướng nhôm và trục cuốn thép phi 114', unit: 'm2', norm: 1.0, price: 200000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp cửa cuốn', unit: 'công', norm: 1.05, price: 304761, rank: '4.0/7' }
    ],
    machines: []
  },

  // ==========================================
  // PHẦN LẮP ĐẶT HỆ THỐNG MEP: BA - CẤP THOÁT NƯỚC
  // ==========================================
  {
    code: 'BA.11110',
    name: 'Lắp đặt ống cấp nước nóng lạnh PPR D20 hàn nhiệt phụ kiện đồng bộ âm tường',
    unit: 'm',
    defaultPriceMat: 32000,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PPR20', name: 'Ống PPR D20 PN20 nóng lạnh Tiền Phong/Đệ Nhất', unit: 'm', norm: 1.04, price: 24000 },
      { code: 'VL_PKPPR', name: 'Cút, tê, măng sông hàn nhiệt PPR D20', unit: 'bộ', norm: 0.35, price: 16000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ hàn ống nhiệt PPR bậc 3.5/7', unit: 'công', norm: 0.161, price: 279500, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.11120',
    name: 'Lắp đặt ống cấp nước nóng lạnh PPR D25 hàn nhiệt âm tường/sàn',
    unit: 'm',
    defaultPriceMat: 45000,
    defaultPriceLab: 52000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PPR25', name: 'Ống PPR D25 PN20', unit: 'm', norm: 1.04, price: 34000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ điện nước', unit: 'công', norm: 0.186, price: 279569, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.11140',
    name: 'Lắp đặt ống cấp nước PPR D50 hàn nhiệt trục đứng cấp nước nhà cao tầng',
    unit: 'm',
    defaultPriceMat: 135000,
    defaultPriceLab: 85000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PPR50', name: 'Ống PPR D50 PN16', unit: 'm', norm: 1.03, price: 115000 },
      { code: 'VL_DAITREO', name: 'Đai treo ống và bu lông nở', unit: 'bộ', norm: 0.8, price: 18000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ống trục đứng', unit: 'công', norm: 0.304, price: 279605, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.12120',
    name: 'Lắp đặt ống thoát nước thải sinh hoạt PVC D90 Tiền Phong/Bình Minh dán keo',
    unit: 'm',
    defaultPriceMat: 65000,
    defaultPriceLab: 55000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PVC90', name: 'Ống nhựa uPVC D90 C2 Tiền Phong', unit: 'm', norm: 1.03, price: 54000 },
      { code: 'VL_KEO', name: 'Keo dán ống PVC', unit: 'hộp', norm: 0.05, price: 65000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ống thoát', unit: 'công', norm: 0.197, price: 279187, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.12130',
    name: 'Lắp đặt ống thoát phân bệt vệ sinh uPVC D114 C2 dán keo phụ kiện',
    unit: 'm',
    defaultPriceMat: 95000,
    defaultPriceLab: 68000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PVC114', name: 'Ống nhựa uPVC D114 dày 3.2mm', unit: 'm', norm: 1.03, price: 78000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ống', unit: 'công', norm: 0.243, price: 279835, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.12140',
    name: 'Lắp đặt ống thoát nước mưa trục đứng PVC D140 có đai treo cố định',
    unit: 'm',
    defaultPriceMat: 145000,
    defaultPriceLab: 85000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PVC140', name: 'Ống nhựa uPVC D140 dày 4.0mm', unit: 'm', norm: 1.03, price: 125000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp ống trục đứng', unit: 'công', norm: 0.304, price: 279605, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BA.13120',
    name: 'Lắp đặt ống cấp nước ngoài nhà HDPE D90 hàn nhiệt đối đầu PN10 chôn ngầm',
    unit: 'm',
    defaultPriceMat: 165000,
    defaultPriceLab: 75000,
    defaultPriceMac: 45000,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_HDPE90', name: 'Ống nhựa HDPE D90 PN10 Tiền Phong PE100', unit: 'm', norm: 1.02, price: 152000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ hàn ống HDPE', unit: 'công', norm: 0.268, price: 279850, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_HANHDPE', name: 'Máy hàn nhiệt ống HDPE đối đầu', unit: 'ca', norm: 0.05, price: 900000 }
    ]
  },
  {
    code: 'BA.15120',
    name: 'Lắp đặt bồn nước Inox 304 nằm ngang dung tích 2000L Sơn Hà/Tân Á Đại Thành trên mái',
    unit: 'bộ',
    defaultPriceMat: 8500000,
    defaultPriceLab: 650000,
    defaultPriceMac: 250000,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_BON2000L', name: 'Bồn nước Inox 304 ngang 2000L Sơn Hà kèm chân đế', unit: 'bộ', norm: 1.0, price: 8200000 },
      { code: 'VL_PHAOCOR', name: 'Phao cơ & Phao điện chống tràn', unit: 'bộ', norm: 1.0, price: 250000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp đặt bồn nước', unit: 'công', norm: 2.32, price: 280172, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TOI', name: 'Tời điện cẩu bồn nước lên mái', unit: 'ca', norm: 0.35, price: 714000 }
    ]
  },
  {
    code: 'BA.16110',
    name: 'Lắp đặt máy bơm nước tăng áp điện tử công suất 300W Wilo/Panasonic tự động',
    unit: 'cái',
    defaultPriceMat: 2850000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương XII: Cấp thoát nước (BA)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_MAYBOM', name: 'Máy bơm tăng áp điện tử tự động 300W', unit: 'cái', norm: 1.0, price: 2650000 },
      { code: 'VL_PHUKIENBOM', name: 'Rắc co, van một chiều, van khóa đồng', unit: 'bộ', norm: 1.0, price: 180000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp máy bơm', unit: 'công', norm: 1.14, price: 280701, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // PHẦN LẮP ĐẶT HỆ THỐNG MEP: BB - THIẾT BỊ VỆ SINH
  // ==========================================
  {
    code: 'BB.11121',
    name: 'Lắp đặt bệt vệ sinh sứ 1 khối cao cấp xả nhấn Toto/Inax nắp đóng êm',
    unit: 'bộ',
    defaultPriceMat: 3850000,
    defaultPriceLab: 320000,
    defaultPriceMac: 0,
    chapter: 'Chương XIII: Thiết bị vệ sinh (BB)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_BET1KHOI', name: 'Bàn cầu sứ 1 khối Inax C-909VRN men sứ Aqua Ceramic', unit: 'bộ', norm: 1.0, price: 3650000 },
      { code: 'VL_DAYCAP', name: 'Dây cấp nước Inox & Van góc chia nước', unit: 'bộ', norm: 1.0, price: 150000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp đặt thiết bị vệ sinh', unit: 'công', norm: 1.14, price: 280701, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BB.12121',
    name: 'Lắp đặt chậu rửa Lavabo đặt bàn đá Granit kèm vòi gạt nóng lạnh đồng mạ Crom',
    unit: 'bộ',
    defaultPriceMat: 1950000,
    defaultPriceLab: 260000,
    defaultPriceMac: 0,
    chapter: 'Chương XIII: Thiết bị vệ sinh (BB)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_LAVABO', name: 'Chậu sứ Lavabo đặt bàn Inax AL-299V', unit: 'cái', norm: 1.0, price: 1250000 },
      { code: 'VL_VOINONGLANH', name: 'Vòi chậu nóng lạnh đồng mạ Crom + Xi phông thoát', unit: 'bộ', norm: 1.0, price: 650000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp Lavabo', unit: 'công', norm: 0.93, price: 279569, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BB.13121',
    name: 'Lắp đặt sen cây tắm đứng massage nóng lạnh inox 304 bát sen tròn',
    unit: 'bộ',
    defaultPriceMat: 2650000,
    defaultPriceLab: 280000,
    defaultPriceMac: 0,
    chapter: 'Chương XIII: Thiết bị vệ sinh (BB)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SENCAY', name: 'Bộ sen tắm cây nóng lạnh Inox 304 SUS', unit: 'bộ', norm: 1.0, price: 2600000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp thiết bị phòng tắm', unit: 'công', norm: 1.0, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BB.15111',
    name: 'Lắp đặt phễu thu sàn chống hôi Inox 304 kích thước 120x120mm ống thoát D60/D90',
    unit: 'cái',
    defaultPriceMat: 145000,
    defaultPriceLab: 65000,
    defaultPriceMac: 0,
    chapter: 'Chương XIII: Thiết bị vệ sinh (BB)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_PHEUTHU', name: 'Phễu thoát sàn bẫy nước ngăn mùi inox 304', unit: 'cái', norm: 1.0, price: 145000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ hoàn thiện', unit: 'công', norm: 0.23, price: 282608, rank: '3.5/7' }
    ],
    machines: []
  },

  // ==========================================
  // PHẦN LẮP ĐẶT HỆ THỐNG MEP: BC - ĐIỆN & CHIẾU SÁNG
  // ==========================================
  {
    code: 'BC.11120',
    name: 'Lắp đặt ống luồn dây điện PVC D20 âm tường âm sàn có cùm treo',
    unit: 'm',
    defaultPriceMat: 16000,
    defaultPriceLab: 25000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGD20', name: 'Ống luồn cứng PVC chống cháy D20 Sino/Nano', unit: 'm', norm: 1.05, price: 12500 },
      { code: 'VL_PKONG', name: 'Kẹp đỡ ống, khớp nối, co cong', unit: 'bộ', norm: 0.35, price: 4000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ điện luồn ống', unit: 'công', norm: 0.089, price: 280898, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.12130',
    name: 'Luồn kéo dây điện đôi Cu/PVC/PVC 2x2.5mm2 Cadisun cho lộ ổ cắm điện',
    unit: 'm',
    defaultPriceMat: 22000,
    defaultPriceLab: 16000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAY2x25', name: 'Dây cáp điện đôi Cadisun 2x2.5mm2 đồng đặc', unit: 'm', norm: 1.03, price: 20500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ luồn dây điện', unit: 'công', norm: 0.057, price: 280701, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.12140',
    name: 'Luồn kéo dây điện đôi 2x4.0mm2 cho lộ điều hòa không khí, bình nóng lạnh',
    unit: 'm',
    defaultPriceMat: 34000,
    defaultPriceLab: 18000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DAY2x4', name: 'Dây điện đôi Cadisun 2x4.0mm2', unit: 'm', norm: 1.03, price: 32500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ điện', unit: 'công', norm: 0.064, price: 281250, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.13110',
    name: 'Kéo rải cáp ngầm bọc kim loại Cu/XLPE/DSTA/PVC 3x25+1x16mm2 trong rãnh cáp',
    unit: 'm',
    defaultPriceMat: 345000,
    defaultPriceLab: 48000,
    defaultPriceMac: 25000,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_CAP3x25', name: 'Cáp đồng ngầm bọc giáp thép 3x25+1x16mm2 Cadivi', unit: 'm', norm: 1.02, price: 335000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Tổ thợ kéo rải cáp ngầm', unit: 'công', norm: 0.171, price: 280701, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TOIKEO', name: 'Tời kéo cáp điện & Con lăn kéo cáp', unit: 'ca', norm: 0.035, price: 714000 }
    ]
  },
  {
    code: 'BC.14110',
    name: 'Lắp đặt tủ điện phân phối tầng DB âm tường 12-18 module kèm aptomat',
    unit: 'tủ',
    defaultPriceMat: 1650000,
    defaultPriceLab: 450000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TUDB', name: 'Vỏ tủ điện kim loại sơn tĩnh điện âm tường 16 MCB', unit: 'cái', norm: 1.0, price: 450000 },
      { code: 'VL_APTOMAT', name: 'Aptomat tổng 2P 40A + 8 MCB nhánh 16-20A Panasonic', unit: 'bộ', norm: 1.0, price: 1150000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ đấu nối tủ điện bậc 4/7', unit: 'công', norm: 1.47, price: 306122, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BC.15110',
    name: 'Lắp đặt công tắc, ổ cắm đôi 3 chấu có màng che bảo vệ Panasonic âm tường',
    unit: 'bộ',
    defaultPriceMat: 95000,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_OCAM', name: 'Ổ cắm đôi 3 chấu kèm đế âm + mặt nạ Panasonic dòng Wide', unit: 'bộ', norm: 1.0, price: 92000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp công tắc ổ cắm', unit: 'công', norm: 0.125, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.16110',
    name: 'Lắp đặt đèn LED âm trần Downlight D90/D110 công suất 9W Rạng Đông/Philips',
    unit: 'bộ',
    defaultPriceMat: 135000,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DENLED9W', name: 'Đèn LED Downlight 9W đổi màu Rạng Đông', unit: 'bộ', norm: 1.0, price: 132000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ khoét lỗ và lắp đèn trần', unit: 'công', norm: 0.125, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BC.17130',
    name: 'Lắp đặt kim thu sét phát tia tiên đạo ESE bán kính bảo vệ R=60m trên trụ đỡ mạ kẽm',
    unit: 'bộ',
    defaultPriceMat: 14500000,
    defaultPriceLab: 1850000,
    defaultPriceMac: 450000,
    chapter: 'Chương XIV: Điện & Chiếu sáng (BC)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_KIMSET', name: 'Kim thu sét Stormaster/Liva phát tia tiên đạo R=60m', unit: 'bộ', norm: 1.0, price: 12500000 },
      { code: 'VL_TRUDO', name: 'Cột đỡ kim mạ kẽm D48 L=5m kèm dây chằng néo', unit: 'bộ', norm: 1.0, price: 1800000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp đặt hệ thống chống sét', unit: 'công', norm: 6.0, price: 308333, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_VANTHANG', name: 'Tời nâng vật tư lên mái', unit: 'ca', norm: 0.6, price: 750000 }
    ]
  },

  // ==========================================
  // PHẦN LẮP ĐẶT HỆ THỐNG MEP: BD - PCCC, ĐIỀU HÒA HVAC & THÔNG GIÓ
  // ==========================================
  {
    code: 'BD.11110',
    name: 'Lắp đặt đường ống chữa cháy thép mạ kẽm D50 nối ren có cùm treo',
    unit: 'm',
    defaultPriceMat: 135000,
    defaultPriceLab: 65000,
    defaultPriceMac: 15000,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGTHEPD50', name: 'Ống thép tráng kẽm D50 dày 3.2mm Hòa Phát', unit: 'm', norm: 1.03, price: 118000 },
      { code: 'VL_CUMTREO', name: 'Quang treo giọt lệ D50 và ty ren M10', unit: 'bộ', norm: 0.5, price: 25000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ tiện ren và lắp ống chữa cháy', unit: 'công', norm: 0.232, price: 280172, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_TIENREN', name: 'Máy tiện ren ống thép Rex', unit: 'ca', norm: 0.03, price: 500000 }
    ]
  },
  {
    code: 'BD.11140',
    name: 'Lắp đặt đường ống chữa cháy thép mạ kẽm D100 rãnh cùm nối Victaulic trục đứng',
    unit: 'm',
    defaultPriceMat: 285000,
    defaultPriceLab: 110000,
    defaultPriceMac: 35000,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_ONGTHEPD100', name: 'Ống thép mạ kẽm D100 dày 4.0mm', unit: 'm', norm: 1.03, price: 245000 },
      { code: 'VL_CUMVIC', name: 'Khớp nối rãnh cùm Victaulic D100', unit: 'bộ', norm: 0.35, price: 95000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp ống chữa cháy trục đứng', unit: 'công', norm: 0.358, price: 307262, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_CANRANH', name: 'Máy cán rãnh ống thép', unit: 'ca', norm: 0.05, price: 700000 }
    ]
  },
  {
    code: 'BD.12110',
    name: 'Lắp đặt đầu phun Sprinkler chữa cháy tự động hướng lên/xuống nhiệt độ kích hoạt 68°C',
    unit: 'đầu',
    defaultPriceMat: 65000,
    defaultPriceLab: 35000,
    defaultPriceMac: 0,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_SPRINKLER', name: 'Đầu phun Sprinkler DN15 Viking/Tyco kích hoạt 68°C', unit: 'cái', norm: 1.0, price: 62000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ vặn siết đầu phun', unit: 'công', norm: 0.125, price: 280000, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BD.13110',
    name: 'Lắp đặt hộp tủ chữa cháy vách tường trong nhà kích thước 600x800x200mm kèm cuộn vòi lăng phun',
    unit: 'bộ',
    defaultPriceMat: 1850000,
    defaultPriceLab: 260000,
    defaultPriceMac: 0,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TUPCCC', name: 'Tủ chữa cháy vách tường cửa kính sơn đỏ', unit: 'cái', norm: 1.0, price: 650000 },
      { code: 'VL_CUONVOI', name: 'Cuộn vòi rulo D50 dài 20m kèm lăng phun đồng và van góc', unit: 'bộ', norm: 1.0, price: 1150000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ lắp hộp tủ PCCC', unit: 'công', norm: 0.93, price: 279569, rank: '3.5/7' }
    ],
    machines: []
  },
  {
    code: 'BD.14110',
    name: 'Trang bị bình chữa cháy bột ABC MFZ4 4kg kèm kệ đặt sàn',
    unit: 'bình',
    defaultPriceMat: 280000,
    defaultPriceLab: 25000,
    defaultPriceMac: 0,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_BINHPCCC', name: 'Bình chữa cháy bột ABC MFZ4 kèm tem kiểm định PCCC', unit: 'bình', norm: 1.0, price: 260000 },
      { code: 'VL_KEBINH', name: 'Kệ đơn đặt bình chữa cháy sơn đỏ', unit: 'cái', norm: 1.0, price: 20000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công định vị đặt bình', unit: 'công', norm: 0.1, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.21120',
    name: 'Lắp đặt máy điều hòa không khí 2 cục treo tường 12000 BTU Inverter Daikin/Panasonic',
    unit: 'bộ',
    defaultPriceMat: 10500000,
    defaultPriceLab: 650000,
    defaultPriceMac: 0,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_DIEUHOA12', name: 'Máy lạnh treo tường 12000 BTU Inverter gas R32', unit: 'bộ', norm: 1.0, price: 9800000 },
      { code: 'VL_GIADO', name: 'Giá đỡ dàn nóng sơn tĩnh điện + bu lông giảm chấn', unit: 'bộ', norm: 1.0, price: 220000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Thợ lắp đặt điều hòa chuyên nghiệp', unit: 'công', norm: 2.11, price: 308056, rank: '4.0/7' }
    ],
    machines: []
  },
  {
    code: 'BD.22110',
    name: 'Lắp đặt máy điều hòa âm trần Cassette 4 hướng thổi 36000 BTU Daikin kèm mặt nạ',
    unit: 'bộ',
    defaultPriceMat: 32500000,
    defaultPriceLab: 1450000,
    defaultPriceMac: 250000,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_CASSETTE', name: 'Máy điều hòa âm trần Cassette 36000 BTU Inverter 3 pha', unit: 'bộ', norm: 1.0, price: 31500000 },
      { code: 'VL_TYCHONG', name: 'Ty treo M10 chống rung và phụ kiện', unit: 'bộ', norm: 1.0, price: 350000 }
    ],
    labors: [
      { code: 'NC_4.0', name: 'Tổ thợ lắp điều hòa âm trần', unit: 'công', norm: 4.7, price: 308510, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_NANG', name: 'Thang nâng dàn lạnh lên trần', unit: 'ca', norm: 0.35, price: 714000 }
    ]
  },
  {
    code: 'BD.25110',
    name: 'Gia công lắp đặt đường ống gió tôn mạ kẽm dày 0.58mm có lớp cách nhiệt PE',
    unit: 'm2',
    defaultPriceMat: 225000,
    defaultPriceLab: 110000,
    defaultPriceMac: 25000,
    chapter: 'Chương XV: PCCC & HVAC (BD)',
    categoryGroup: 'Lắp đặt MEP',
    materials: [
      { code: 'VL_TONGIO', name: 'Tôn mạ kẽm dày 0.58mm Hoa Sen', unit: 'm2', norm: 1.15, price: 145000 },
      { code: 'VL_CACHNHIET', name: 'Mút xốp PE foam dán bạc cách nhiệt dày 15mm', unit: 'm2', norm: 1.05, price: 42000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ gia công lắp đặt ống gió', unit: 'công', norm: 0.39, price: 282051, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_GAPTON', name: 'Máy lốc gấp mép tôn ống gió', unit: 'ca', norm: 0.04, price: 625000 }
    ]
  },

  // ==========================================
  // CHƯƠNG XVI (SA): PHÁ DỠ, SỬA CHỮA & CẢI TẠO
  // ==========================================
  {
    code: 'SA.11120',
    name: 'Đục phá bê tông cốt thép móng, đà kiềng cũ bằng búa căn máy nén khí',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 480000,
    defaultPriceMac: 380000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đục phá kết cấu', unit: 'công', norm: 1.72, price: 279069, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_NENKHI', name: 'Máy nén khí & Búa đục căn bê tông', unit: 'ca', norm: 0.28, price: 1357000 }
    ]
  },
  {
    code: 'SA.11130',
    name: 'Đục phá bê tông cốt thép cột, dầm, sàn bằng máy đục phá thủy lực',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 550000,
    defaultPriceMac: 420000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ đục bê tông trên cao', unit: 'công', norm: 1.97, price: 279187, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_DUC', name: 'Búa đục thủy lực cầm tay', unit: 'ca', norm: 0.35, price: 1200000 }
    ]
  },
  {
    code: 'SA.11210',
    name: 'Phá dỡ tường gạch dày 110mm vữa vôi/vữa xi măng cũ',
    unit: 'm3',
    defaultPriceMat: 0,
    defaultPriceLab: 220000,
    defaultPriceMac: 35000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công phá dỡ tường', unit: 'công', norm: 0.88, price: 250000, rank: '3.0/7' }
    ],
    machines: []
  },
  {
    code: 'SA.11310',
    name: 'Bóc tẩy lớp gạch lát nền cũ và lớp vữa láng nền dày 3-5cm',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 45000,
    defaultPriceMac: 15000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công đục bóc gạch cũ', unit: 'công', norm: 0.18, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_DUCNHO', name: 'Máy đục bê tông cầm tay nhỏ', unit: 'ca', norm: 0.04, price: 375000 }
    ]
  },
  {
    code: 'SA.21210',
    name: 'Cắt rãnh mặt đường bê tông nhựa / xi măng sâu <= 7cm bằng máy cắt đĩa kim cương',
    unit: 'm',
    defaultPriceMat: 12000,
    defaultPriceLab: 22000,
    defaultPriceMac: 18000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [
      { code: 'VL_LUOICAT', name: 'Lưỡi cắt kim cương D350 hao mòn', unit: 'lưỡi', norm: 0.02, price: 450000 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ cắt mặt đường', unit: 'công', norm: 0.079, price: 278481, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_CATDUONG', name: 'Máy cắt đường chạy xăng', unit: 'ca', norm: 0.065, price: 276923 }
    ]
  },
  {
    code: 'SA.31210',
    name: 'Cạo bỏ lớp sơn tường cũ bằng máy chà nhám tường có hút bụi',
    unit: 'm2',
    defaultPriceMat: 3500,
    defaultPriceLab: 18000,
    defaultPriceMac: 6500,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [
      { code: 'VL_GIAYRAP', name: 'Giấy ráp mài tường', unit: 'tờ', norm: 0.5, price: 7000 }
    ],
    labors: [
      { code: 'NC_3.0', name: 'Nhân công chà tường', unit: 'công', norm: 0.072, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_CHANHAM', name: 'Máy chà nhám kèm hút bụi', unit: 'ca', norm: 0.035, price: 185714 }
    ]
  },
  {
    code: 'SA.41210',
    name: 'Tháo dỡ cửa đi cửa sổ nhôm kính khung sắt cũ bảo quản tái sử dụng',
    unit: 'm2',
    defaultPriceMat: 0,
    defaultPriceLab: 45000,
    defaultPriceMac: 0,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.5', name: 'Thợ tháo dỡ', unit: 'công', norm: 0.161, price: 279500, rank: '3.5/7' }
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
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [],
    labors: [
      { code: 'NC_3.0', name: 'Tổ bốc xếp', unit: 'công', norm: 0.72, price: 250000, rank: '3.0/7' }
    ],
    machines: [
      { code: 'M_OTO5T', name: 'Ô tô tự đổ 5T chở đổ bãi thải', unit: 'ca', norm: 0.42, price: 1547619 }
    ]
  },
  {
    code: 'SA.61110',
    name: 'Khoan cấy thép chờ D16 bằng hóa chất Ramset Epcon G5 / Hilti RE 500 sâu 160mm',
    unit: 'lỗ',
    defaultPriceMat: 75000,
    defaultPriceLab: 35000,
    defaultPriceMac: 15000,
    chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
    categoryGroup: 'Sửa chữa',
    materials: [
      { code: 'VL_KEOEPCON', name: 'Keo hóa chất cấy thép Ramset Epcon G5 (tuýp 650ml)', unit: 'ml', norm: 55.0, price: 1200 },
      { code: 'VL_THEPD16', name: 'Thép vằn D16 cắt khúc neo', unit: 'kg', norm: 0.85, price: 17500 }
    ],
    labors: [
      { code: 'NC_3.5', name: 'Thợ khoan cấy thép', unit: 'công', norm: 0.125, price: 280000, rank: '3.5/7' }
    ],
    machines: [
      { code: 'M_KHOANBE', name: 'Máy khoan bê tông búa xoay Bosch', unit: 'ca', norm: 0.045, price: 333000 }
    ]
  },

  // ==========================================
  // CHƯƠNG XVII (CS): KHẢO SÁT ĐỊA CHẤT & THÍ NGHIỆM CHUYÊN NGÀNH
  // ==========================================
  {
    code: 'CS.11110',
    name: 'Khoan khảo sát địa chất công trình trên cạn sâu <= 30m trong đất đá',
    unit: 'm',
    defaultPriceMat: 120000,
    defaultPriceLab: 260000,
    defaultPriceMac: 350000,
    chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
    categoryGroup: 'Khảo sát',
    materials: [
      { code: 'VL_XANGDAU', name: 'Xăng dầu mỡ bôi trơn máy khoan', unit: 'lít', norm: 3.5, price: 22000 },
      { code: 'VL_MUCOAN', name: 'Hao mòn mũi khoan hợp kim/kim cương', unit: 'mũi', norm: 0.08, price: 550000 }
    ],
    labors: [
      { code: 'NC_KS', name: 'Kỹ sư địa chất & Thợ khoan bậc 4/7', unit: 'công', norm: 0.82, price: 317073, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KHOANDIACHAT', name: 'Máy khoan địa chất XY-1 kèm máy bơm nước', unit: 'ca', norm: 0.25, price: 1400000 }
    ]
  },
  {
    code: 'CS.11310',
    name: 'Thí nghiệm xuyên tiêu chuẩn SPT trong hố khoan địa chất',
    unit: 'lần',
    defaultPriceMat: 0,
    defaultPriceLab: 180000,
    defaultPriceMac: 120000,
    chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
    categoryGroup: 'Khảo sát',
    materials: [],
    labors: [
      { code: 'NC_KS', name: 'Kỹ sư hiện trường', unit: 'công', norm: 0.58, price: 310344, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_BUASPT', name: 'Bộ búa đóng tiêu chuẩn SPT 63.5kg', unit: 'ca', norm: 0.15, price: 800000 }
    ]
  },
  {
    code: 'CS.21110',
    name: 'Thí nghiệm nén tĩnh cọc bê tông cốt thép tải trọng Pmax = 100T hệ dầm phản lực',
    unit: 'cọc',
    defaultPriceMat: 3500000,
    defaultPriceLab: 8500000,
    defaultPriceMac: 12500000,
    chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
    categoryGroup: 'Thí nghiệm',
    materials: [
      { code: 'VL_PHUKIENNEN', name: 'Vật tư phụ, mỡ bôi trơn, gối kê', unit: 'bộ', norm: 1.0, price: 3500000 }
    ],
    labors: [
      { code: 'NC_KSTN', name: 'Tổ kỹ sư thí nghiệm LAS-XD', unit: 'công', norm: 25.0, price: 340000, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_KICHNEN', name: 'Hệ kích thủy lực 200T kèm đồng hồ đo & dầm phản lực', unit: 'ca', norm: 4.5, price: 2777777 }
    ]
  },
  {
    code: 'CS.22110',
    name: 'Thí nghiệm siêu âm kiểm tra độ đồng nhất cọc khoan nhồi (Sonic Logging)',
    unit: 'cọc',
    defaultPriceMat: 0,
    defaultPriceLab: 1200000,
    defaultPriceMac: 1500000,
    chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
    categoryGroup: 'Thí nghiệm',
    materials: [],
    labors: [
      { code: 'NC_KSTN', name: 'Kỹ sư thí nghiệm siêu âm cọc', unit: 'công', norm: 3.5, price: 342857, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_SIEUAM', name: 'Thiết bị siêu âm cọc CHAMP Olson', unit: 'ca', norm: 1.0, price: 1500000 }
    ]
  },
  {
    code: 'CS.31110',
    name: 'Đo vẽ lập bản đồ địa hình tỷ lệ 1/500 khu vực đồng bằng bằng máy toàn đạc điện tử',
    unit: 'ha',
    defaultPriceMat: 450000,
    defaultPriceLab: 2850000,
    defaultPriceMac: 850000,
    chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
    categoryGroup: 'Khảo sát',
    materials: [
      { code: 'VL_MOCTRAC', name: 'Mốc bê tông trắc địa dẫn mốc', unit: 'mốc', norm: 4.0, price: 112500 }
    ],
    labors: [
      { code: 'NC_TRACDIAC', name: 'Tổ đo vẽ bản đồ địa hình', unit: 'công', norm: 9.0, price: 316666, rank: '4.0/7' }
    ],
    machines: [
      { code: 'M_TOANDAC', name: 'Máy toàn đạc & GPS RTK 2 tần số', unit: 'ca', norm: 2.0, price: 425000 }
    ]
  }
];

/**
 * BỘ GIẢI MÃ & TẠO ĐỊNH MỨC THÔNG MINH CHO TẤT CẢ CÁC MÃ HIỆU BỘ XÂY DỰNG
 * Đảm bảo 100% công tác theo Thông tư 12/2021/TT-BXD, TT 11/2021/TT-BXD đều được giải mã chính xác
 */
export function resolveOrGenerateBXDNorm(inputCodeOrName: string): NormTemplate | null {
  const cleanInput = inputCodeOrName.trim().toUpperCase();
  if (!cleanInput) return null;

  // 1. Kiểm tra nếu có sẵn trong danh mục mẫu
  const existing = COMPREHENSIVE_BXD_NORMS.find(
    n => n.code.toUpperCase() === cleanInput || n.code.replace('.', '').toUpperCase() === cleanInput.replace('.', '')
  );
  if (existing) return existing;

  // 2. Nhận diện tiền tố mã định mức BXD
  const prefixMatch = cleanInput.match(/^([A-Z]{2})/);
  if (!prefixMatch) return null;

  const prefix = prefixMatch[1];
  const formattedCode = cleanInput.includes('.') ? cleanInput : `${prefix}.${cleanInput.substring(2) || '11110'}`;

  // Phân loại định mức tự động dựa theo bộ mã quy chuẩn TT12
  switch (prefix) {
    case 'AF': {
      // Nhóm Bê tông tại chỗ
      return {
        code: formattedCode,
        name: `Bê tông công trình định mức BXD mã ${formattedCode} đá 1x2 mác 250 (TT 12/2021/TT-BXD)`,
        unit: 'm3',
        defaultPriceMat: 1420000,
        defaultPriceLab: 220000,
        defaultPriceMac: 85000,
        chapter: 'Chương VI: Bê tông tại chỗ',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_BTM250', name: 'Bê tông thương phẩm mác 250 đá 1x2', unit: 'm3', norm: 1.02, price: 1392000 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Nhân công đổ bê tông bậc 3.5/7', unit: 'công', norm: 0.78, price: 282051, rank: '3.5/7' }
        ],
        machines: [
          { code: 'M_BOM', name: 'Xe bơm bê tông chuyên dùng', unit: 'ca', norm: 0.035, price: 2428000 }
        ]
      };
    }
    case 'AB': {
      // Nhóm Đào đắp đất đá
      return {
        code: formattedCode,
        name: `Đào đắp đất đá công trình mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'm3',
        defaultPriceMat: 0,
        defaultPriceLab: 185000,
        defaultPriceMac: 45000,
        chapter: 'Chương II: Đào đắp đất đá',
        categoryGroup: 'Xây dựng',
        materials: [],
        labors: [
          { code: 'NC_3.0', name: 'Nhân công đào đắp đất đá', unit: 'công', norm: 0.74, price: 250000, rank: '3.0/7' }
        ],
        machines: [
          { code: 'M_DAO', name: 'Máy đào gầu nghịch 0.8m3', unit: 'ca', norm: 0.02, price: 2250000 }
        ]
      };
    }
    case 'AH': {
      // Nhóm Cốt thép bê tông
      return {
        code: formattedCode,
        name: `Gia công lắp dựng cốt thép công trình mã ${formattedCode} thép CB400`,
        unit: 'tấn',
        defaultPriceMat: 16800000,
        defaultPriceLab: 2950000,
        defaultPriceMac: 450000,
        chapter: 'Chương VIII: Cốt thép bê tông',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_THEPC400', name: 'Cốt thép xây dựng CB400', unit: 'kg', norm: 1020, price: 16470 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Thợ uốn buộc cốt thép', unit: 'công', norm: 10.5, price: 280952, rank: '3.5/7' }
        ],
        machines: [
          { code: 'M_UONCAT', name: 'Máy uốn cắt thép điện', unit: 'ca', norm: 1.1, price: 409000 }
        ]
      };
    }
    case 'AI': {
      // Nhóm Ván khuôn coffa
      return {
        code: formattedCode,
        name: `Sản xuất lắp dựng ván khuôn coffa công trình mã ${formattedCode} ván ép phủ phim`,
        unit: '100m2',
        defaultPriceMat: 7500000,
        defaultPriceLab: 6800000,
        defaultPriceMac: 550000,
        chapter: 'Chương IX: Ván khuôn coffa',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_PHUPHIM', name: 'Ván ép phủ phim WBP 18mm luân chuyển', unit: 'm2', norm: 25.0, price: 260000 },
          { code: 'VL_GIAOCHONG', name: 'Hệ giàn giáo và cây chống thép', unit: 'bộ', norm: 80.0, price: 12500 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Thợ lắp ván khuôn', unit: 'công', norm: 24.3, price: 279835, rank: '3.5/7' }
        ],
        machines: [
          { code: 'M_VANTHANG', name: 'Vận thăng nâng vật tư', unit: 'ca', norm: 0.85, price: 647000 }
        ]
      };
    }
    case 'AK': {
      // Nhóm Hoàn thiện
      return {
        code: formattedCode,
        name: `Công tác hoàn thiện kiến trúc mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'm2',
        defaultPriceMat: 145000,
        defaultPriceLab: 85000,
        defaultPriceMac: 0,
        chapter: 'Chương X: Hoàn thiện công trình',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_HOANTHIEN', name: 'Vật liệu hoàn thiện quy chuẩn', unit: 'm2', norm: 1.05, price: 138000 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Thợ hoàn thiện bậc 3.5/7', unit: 'công', norm: 0.3, price: 283333, rank: '3.5/7' }
        ],
        machines: []
      };
    }
    case 'AC': {
      // Nhóm Cọc & Nền móng
      return {
        code: formattedCode,
        name: `Thi công cọc & xử lý nền móng mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'm',
        defaultPriceMat: 265000,
        defaultPriceLab: 52000,
        defaultPriceMac: 65000,
        chapter: 'Chương III: Cọc & Nền móng',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_COCMC', name: 'Cọc bê tông cốt thép đúc sẵn', unit: 'm', norm: 1.01, price: 262300 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Tổ thợ thi công cọc', unit: 'công', norm: 0.186, price: 279500, rank: '3.5/7' }
        ],
        machines: [
          { code: 'M_EPCOC', name: 'Máy ép/đóng cọc chuyên dụng', unit: 'ca', norm: 0.026, price: 2500000 }
        ]
      };
    }
    case 'BA':
    case 'BB':
    case 'BC':
    case 'BD': {
      // Nhóm Cơ điện MEP & PCCC
      return {
        code: formattedCode,
        name: `Lắp đặt hệ thống kỹ thuật MEP & PCCC mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'bộ',
        defaultPriceMat: 450000,
        defaultPriceLab: 180000,
        defaultPriceMac: 0,
        chapter: 'Phần Lắp đặt Hệ thống MEP & PCCC',
        categoryGroup: 'Lắp đặt MEP',
        materials: [
          { code: 'VL_MEP', name: 'Thiết bị & Phụ kiện MEP chính hãng', unit: 'bộ', norm: 1.0, price: 450000 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Thợ lắp đặt cơ điện MEP', unit: 'công', norm: 0.64, price: 281250, rank: '3.5/7' }
        ],
        machines: []
      };
    }
    case 'SA': {
      // Nhóm Phá dỡ & Sửa chữa
      return {
        code: formattedCode,
        name: `Công tác phá dỡ & cải tạo công trình mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'm3',
        defaultPriceMat: 0,
        defaultPriceLab: 380000,
        defaultPriceMac: 180000,
        chapter: 'Chương XVI: Sửa chữa & Phá dỡ',
        categoryGroup: 'Sửa chữa',
        materials: [],
        labors: [
          { code: 'NC_3.5', name: 'Nhân công phá dỡ', unit: 'công', norm: 1.36, price: 279411, rank: '3.5/7' }
        ],
        machines: [
          { code: 'M_DUC', name: 'Máy khoan đục cầm tay', unit: 'ca', norm: 0.25, price: 720000 }
        ]
      };
    }
    case 'CS': {
      // Nhóm Khảo sát & Thí nghiệm
      return {
        code: formattedCode,
        name: `Khảo sát địa chất & Thí nghiệm chuyên ngành mã ${formattedCode} (TT 12/2021/TT-BXD)`,
        unit: 'm',
        defaultPriceMat: 120000,
        defaultPriceLab: 280000,
        defaultPriceMac: 350000,
        chapter: 'Chương XVII: Khảo sát & Thí nghiệm',
        categoryGroup: 'Khảo sát',
        materials: [
          { code: 'VL_KS', name: 'Vật tư khảo sát & mẫu thí nghiệm', unit: 'bộ', norm: 1.0, price: 120000 }
        ],
        labors: [
          { code: 'NC_KS', name: 'Kỹ sư chuyên ngành khảo sát', unit: 'công', norm: 0.88, price: 318181, rank: '4.0/7' }
        ],
        machines: [
          { code: 'M_KHOAN', name: 'Máy khoan & Thiết bị đo đạc', unit: 'ca', norm: 0.25, price: 1400000 }
        ]
      };
    }
    default: {
      return {
        code: formattedCode,
        name: `Định mức dự toán xây dựng mã ${formattedCode} (Bộ Xây dựng)`,
        unit: 'công tác',
        defaultPriceMat: 250000,
        defaultPriceLab: 180000,
        defaultPriceMac: 45000,
        chapter: 'Định mức BXD mở rộng',
        categoryGroup: 'Xây dựng',
        materials: [
          { code: 'VL_CHINH', name: 'Vật liệu theo định mức BXD', unit: 'công tác', norm: 1.0, price: 250000 }
        ],
        labors: [
          { code: 'NC_3.5', name: 'Nhân công bậc 3.5/7', unit: 'công', norm: 0.64, price: 281250, rank: '3.5/7' }
        ],
        machines: []
      };
    }
  }
}
