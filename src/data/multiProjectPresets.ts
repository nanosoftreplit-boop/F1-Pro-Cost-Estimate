import { Category, ProjectSettings, WorkItem, AuditDiffItem, SettlementItem, GanttTask, BiddingForm, ProjectType } from '../types/estimate';
import { DEFAULT_PROJECT_SETTINGS, DEFAULT_CATEGORIES, INITIAL_WORK_ITEMS, SAMPLE_AUDIT_DIFFS, SAMPLE_SETTLEMENT_ITEMS, SAMPLE_GANTT_TASKS, SAMPLE_BIDDING_FORM } from './sampleProjects';

export interface ProjectInstance {
  id: string;
  name: string;
  settings: ProjectSettings;
  categories: Category[];
  items: WorkItem[];
  auditDiffs: AuditDiffItem[];
  settlements: SettlementItem[];
  tasks: GanttTask[];
  biddingForm: BiddingForm;
  createdAt: number;
  lastModified: number;
}

// 1. DỰ ÁN 1: DÂN DỤNG (NANOSOFT TOWER)
export const createCivilProject = (id: string = 'proj-civil-1'): ProjectInstance => {
  return {
    id,
    name: 'Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)',
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      projectName: 'Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)',
      locationProvince: 'Hà Nội',
      projectType: 'civil',
    },
    categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    items: JSON.parse(JSON.stringify(INITIAL_WORK_ITEMS)),
    auditDiffs: JSON.parse(JSON.stringify(SAMPLE_AUDIT_DIFFS)),
    settlements: JSON.parse(JSON.stringify(SAMPLE_SETTLEMENT_ITEMS)),
    tasks: JSON.parse(JSON.stringify(SAMPLE_GANTT_TASKS)),
    biddingForm: JSON.parse(JSON.stringify(SAMPLE_BIDDING_FORM)),
    createdAt: Date.now() - 86400000 * 3,
    lastModified: Date.now(),
  };
};

// 2. DỰ ÁN 2: GIAO THÔNG (TUYẾN ĐƯỜNG ĐÔ THỊ KẾT NỐI KCN)
export const createTrafficProject = (id: string = `proj-transport-${Date.now()}`): ProjectInstance => {
  const trafficCategories: Category[] = [
    { id: 'cat-tr-1', name: 'Hạng mục 1: Nền đường & Xử lý đất yếu', projectType: 'transport' },
    { id: 'cat-tr-2', name: 'Hạng mục 2: Mặt đường bê tông nhựa & Cấp phối đá dăm', projectType: 'transport' },
    { id: 'cat-tr-3', name: 'Hạng mục 3: Hệ thống An toàn giao thông & Thoát nước dọc', projectType: 'transport' },
  ];

  const trafficItems: WorkItem[] = [
    {
      id: 'w-tr-1',
      stt: 1,
      type: 'work',
      categoryId: 'cat-tr-1',
      code: 'AB.21121',
      name: 'Đào đất nền đường bằng máy đào 1.25m3, đất cấp II',
      unit: 'm3',
      quantity: 12500,
      subCalculations: [
        { id: 'sub-tr-1-1', name: 'Đoạn Km0+000 - Km1+200', expression: '1200 * 14 * 0.45', quantity: 7560 },
        { id: 'sub-tr-1-2', name: 'Đoạn Km1+200 - Km2+500', expression: '1300 * 14 * 0.27', quantity: 4940 },
      ],
      unitPriceMaterial: 0,
      unitPriceLabor: 18500,
      unitPriceMachine: 38200,
      materials: [],
      labors: [{ code: 'NC.01', name: 'Nhân công xây dựng bậc 3.5/7', unit: 'công', norm: 0.065, price: 285000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.01', name: 'Máy đào bánh xích 1.25m3', unit: 'ca', norm: 0.008, price: 4775000 }],
    },
    {
      id: 'w-tr-2',
      stt: 2,
      type: 'work',
      categoryId: 'cat-tr-1',
      code: 'AC.11111',
      name: 'Đắp đất nền đường đầm nén độ chặt K=0.98',
      unit: 'm3',
      quantity: 9800,
      subCalculations: [
        { id: 'sub-tr-2-1', name: 'Đắp K98 lớp trên cùng dày 30cm', expression: '2500 * 13 * 0.3', quantity: 9750 },
      ],
      unitPriceMaterial: 95000,
      unitPriceLabor: 22000,
      unitPriceMachine: 45000,
      materials: [{ code: 'VL.DAT', name: 'Đất đắp chọn lọc đồi lu lèn', unit: 'm3', norm: 1.15, price: 82600 }],
      labors: [{ code: 'NC.01', name: 'Nhân công xây dựng bậc 3.5/7', unit: 'công', norm: 0.077, price: 285000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.02', name: 'Lu rung 14 tấn', unit: 'ca', norm: 0.012, price: 3750000 }],
    },
    {
      id: 'w-tr-3',
      stt: 3,
      type: 'work',
      categoryId: 'cat-tr-2',
      code: 'AD.11210',
      name: 'Rải thảm cấp phối đá dăm loại 1 dày 15cm',
      unit: 'm3',
      quantity: 4875,
      subCalculations: [
        { id: 'sub-tr-3-1', name: 'Mặt đường rộng 13m dài 2.5km', expression: '2500 * 13 * 0.15', quantity: 4875 },
      ],
      unitPriceMaterial: 320000,
      unitPriceLabor: 28000,
      unitPriceMachine: 52000,
      materials: [{ code: 'VL.CPDD', name: 'Cấp phối đá dăm loại 1 Dmax 25', unit: 'm3', norm: 1.35, price: 237000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công xây dựng bậc 3.5/7', unit: 'công', norm: 0.098, price: 285000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.03', name: 'Máy rải cấp phối đá dăm', unit: 'ca', norm: 0.009, price: 5770000 }],
    },
    {
      id: 'w-tr-4',
      stt: 4,
      type: 'work',
      categoryId: 'cat-tr-2',
      code: 'AD.23120',
      name: 'Tưới nhựa dính bám tiêu chuẩn 0.5kg/m2',
      unit: 'm2',
      quantity: 32500,
      subCalculations: [
        { id: 'sub-tr-4-1', name: 'Toàn bộ diện tích mặt đường', expression: '2500 * 13', quantity: 32500 },
      ],
      unitPriceMaterial: 18500,
      unitPriceLabor: 4200,
      unitPriceMachine: 6800,
      materials: [{ code: 'VL.NHUA', name: 'Nhũ tương nhựa đường thấm bám', unit: 'kg', norm: 0.55, price: 33600 }],
      labors: [{ code: 'NC.01', name: 'Nhân công xây dựng bậc 3.5/7', unit: 'công', norm: 0.015, price: 285000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.04', name: 'Xe phun tưới nhựa đường', unit: 'ca', norm: 0.0015, price: 4530000 }],
    },
    {
      id: 'w-tr-5',
      stt: 5,
      type: 'work',
      categoryId: 'cat-tr-2',
      code: 'AD.24110',
      name: 'Thảm bê tông nhựa chặt C19 dày 7cm mặt đường',
      unit: 'tấn',
      quantity: 5350,
      subCalculations: [
        { id: 'sub-tr-5-1', name: 'Khối lượng thảm BTN C19', expression: '32500 * 0.07 * 2.35', quantity: 5346.25 },
      ],
      unitPriceMaterial: 1450000,
      unitPriceLabor: 75000,
      unitPriceMachine: 120000,
      materials: [{ code: 'VL.BTNC19', name: 'Bê tông nhựa nóng C19 tiêu chuẩn', unit: 'tấn', norm: 1.02, price: 1420000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công xây dựng bậc 3.5/7', unit: 'công', norm: 0.26, price: 285000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.05', name: 'Máy rải thảm bê tông nhựa chuyên dụng', unit: 'ca', norm: 0.02, price: 6000000 }],
    },
    {
      id: 'w-tr-6',
      stt: 6,
      type: 'work',
      categoryId: 'cat-tr-3',
      code: 'AL.11110',
      name: 'Sơn vạch kẻ đường phản quang dẻo nhiệt dày 2mm',
      unit: 'm2',
      quantity: 1850,
      subCalculations: [],
      unitPriceMaterial: 215000,
      unitPriceLabor: 45000,
      unitPriceMachine: 15000,
      materials: [{ code: 'VL.SON', name: 'Sơn dẻo nhiệt phản quang màu trắng', unit: 'kg', norm: 4.8, price: 44700 }],
      labors: [{ code: 'NC.01', name: 'Nhân công kỹ thuật vạch sơn', unit: 'công', norm: 0.15, price: 300000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.06', name: 'Máy sơn kẻ vạch chuyên dùng', unit: 'ca', norm: 0.005, price: 3000000 }],
    }
  ];

  return {
    id,
    name: 'Tuyến đường Đô thị kết nối KCN Tân Bình (2.5 km)',
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      projectName: 'Tuyến đường Đô thị kết nối KCN Tân Bình (2.5 km)',
      locationProvince: 'TP. Hồ Chí Minh',
      salaryRegion: 'I',
      projectType: 'transport',
      indirectCostConfig: {
        enabledAuto: true,
        method: 'by_scale',
        isLineProject: true, // Tuyến đường: Nhà tạm 2.2%
        categorySettings: {
          'cat-tr-1': { projectType: 'transport' },
          'cat-tr-2': { projectType: 'transport' },
          'cat-tr-3': { projectType: 'transport' },
        }
      },
      adminReportConfig: {
        ...DEFAULT_PROJECT_SETTINGS.adminReportConfig,
        documentTitle: 'BẢNG DỰ TOÁN CÔNG TRÌNH GIAO THÔNG ĐÔ THỊ',
        superiorAgency: 'UBND TP. HỒ CHÍ MINH - SỞ GIAO THÔNG VẬN TẢI',
        investorUnit: 'Ban Quản lý Dự án Đầu tư Xây dựng Công trình Giao thông TP.HCM',
        signDatePlace: 'TP. Hồ Chí Minh, ngày 24 tháng 10 năm 2026',
      }
    },
    categories: trafficCategories,
    items: trafficItems,
    auditDiffs: [],
    settlements: [],
    tasks: [
      { id: 'gt-1', name: 'Đào đắp nền đường & xử lý nền K98', startDate: '2026-06-01', endDate: '2026-07-15', durationDays: 45, progressPercent: 60, workersRequired: 24 },
      { id: 'gt-2', name: 'Thi công cống thoát nước ngang đường', startDate: '2026-06-20', endDate: '2026-07-30', durationDays: 40, progressPercent: 40, predecessorId: 'gt-1', workersRequired: 16 },
      { id: 'gt-3', name: 'Rải cấp phối đá dăm loại 1 & loại 2', startDate: '2026-08-01', endDate: '2026-08-30', durationDays: 30, progressPercent: 10, predecessorId: 'gt-1', workersRequired: 18 },
      { id: 'gt-4', name: 'Tưới nhựa & Thảm bê tông nhựa nóng C19, C12.5', startDate: '2026-09-01', endDate: '2026-09-25', durationDays: 25, progressPercent: 0, predecessorId: 'gt-3', workersRequired: 22 },
      { id: 'gt-5', name: 'Sơn vạch kẻ đường, biển báo, bàn giao', startDate: '2026-09-26', endDate: '2026-10-10', durationDays: 15, progressPercent: 0, predecessorId: 'gt-4', workersRequired: 10 },
    ],
    biddingForm: {
      packageCode: 'TB-GT-2026-088',
      packageName: 'Gói thầu XL-01: Thi công xây dựng công trình giao thông kết nối KCN',
      bidderName: 'Công ty Cổ phần Công trình Giao thông Sài Gòn',
      bidPriceWithoutVAT: 28500000000,
      vatAmount: 2850000000,
      totalBidPrice: 31350000000,
      executionDurationDays: 180,
      validityDays: 120,
      discountRate: 3.2,
    },
    createdAt: Date.now() - 86400000 * 2,
    lastModified: Date.now() - 3600000,
  };
};

// 3. DỰ ÁN 3: CÔNG NGHIỆP (NHÀ XƯỞNG CÔNG NGHIỆP & KHO LOGISTICS)
export const createIndustrialProject = (id: string = `proj-ind-${Date.now()}`): ProjectInstance => {
  const indCategories: Category[] = [
    { id: 'cat-in-1', name: 'Hạng mục 1: Móng cọc & Nền sàn bê tông nhà xưởng', projectType: 'industrial' },
    { id: 'cat-in-2', name: 'Hạng mục 2: Khung kết cấu thép tiền chế & Tôn lợp PU', projectType: 'industrial' },
    { id: 'cat-in-3', name: 'Hạng mục 3: Hệ thống PCCC & Cơ điện nhà xưởng', projectType: 'industrial' },
  ];

  const indItems: WorkItem[] = [
    {
      id: 'w-in-1',
      stt: 1,
      type: 'work',
      categoryId: 'cat-in-1',
      code: 'AC.12110',
      name: 'Ép cọc bê tông cốt thép dự ứng lực D400 bằng máy ép robot',
      unit: 'm',
      quantity: 4200,
      subCalculations: [
        { id: 'sub-in-1', name: '140 tim cọc dài 30m', expression: '140 * 30', quantity: 4200 },
      ],
      unitPriceMaterial: 310000,
      unitPriceLabor: 48000,
      unitPriceMachine: 62000,
      materials: [{ code: 'VL.COC', name: 'Cọc bê tông ly tâm D400 mác 600', unit: 'm', norm: 1.02, price: 303000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công ép cọc', unit: 'công', norm: 0.16, price: 300000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.07', name: 'Máy ép cọc robot thủy lực 300T', unit: 'ca', norm: 0.0075, price: 8260000 }],
    },
    {
      id: 'w-in-2',
      stt: 2,
      type: 'work',
      categoryId: 'cat-in-1',
      code: 'AF.12210',
      name: 'Bê tông đài móng, dầm giằng đá 1x2 mác 300',
      unit: 'm3',
      quantity: 480,
      subCalculations: [],
      unitPriceMaterial: 1420000,
      unitPriceLabor: 210000,
      unitPriceMachine: 75000,
      materials: [{ code: 'VL.BT300', name: 'Bê tông thương phẩm mác 300 độ sụt 12+-2', unit: 'm3', norm: 1.02, price: 1390000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công đổ bê tông', unit: 'công', norm: 0.72, price: 290000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.08', name: 'Máy bơm bê tông tự hành 50m3/h', unit: 'ca', norm: 0.016, price: 4680000 }],
    },
    {
      id: 'w-in-3',
      stt: 3,
      type: 'work',
      categoryId: 'cat-in-1',
      code: 'AF.12420',
      name: 'Đổ bê tông sàn nhà xưởng dày 20cm mác 300, xoa sika tăng cứng',
      unit: 'm2',
      quantity: 6000,
      subCalculations: [
        { id: 'sub-in-3', name: 'Mặt bằng nhà xưởng 60m x 100m', expression: '60 * 100', quantity: 6000 },
      ],
      unitPriceMaterial: 380000,
      unitPriceLabor: 65000,
      unitPriceMachine: 35000,
      materials: [{ code: 'VL.SIKA', name: 'Chất làm cứng bề mặt sàn Sikafloor Chapdur', unit: 'kg', norm: 4.5, price: 18500 }],
      labors: [{ code: 'NC.01', name: 'Nhân công xoa nền hoàn thiện', unit: 'công', norm: 0.22, price: 295000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.09', name: 'Máy xoa nền đôi đường kính 1m', unit: 'ca', norm: 0.015, price: 2330000 }],
    },
    {
      id: 'w-in-4',
      stt: 4,
      type: 'work',
      categoryId: 'cat-in-2',
      code: 'AI.11110',
      name: 'Gia công và lắp dựng kết cấu khung nhà thép tiền chế Zamil',
      unit: 'tấn',
      quantity: 185,
      subCalculations: [],
      unitPriceMaterial: 28500000,
      unitPriceLabor: 3200000,
      unitPriceMachine: 1800000,
      materials: [{ code: 'VL.THEPHINH', name: 'Thép tấm kết cấu Q345B cường độ cao', unit: 'tấn', norm: 1.05, price: 27100000 }],
      labors: [{ code: 'NC.02', name: 'Thợ lắp dựng kết cấu thép', unit: 'công', norm: 9.5, price: 336000, rank: '4/7' }],
      machines: [{ code: 'MTC.10', name: 'Cần trục bánh lốp 50T', unit: 'ca', norm: 0.22, price: 8180000 }],
    },
    {
      id: 'w-in-5',
      stt: 5,
      type: 'work',
      categoryId: 'cat-in-2',
      code: 'AK.11210',
      name: 'Lợp mái tôn sóng vuông cách nhiệt 3 lớp PU dày 50mm',
      unit: 'm2',
      quantity: 6500,
      subCalculations: [],
      unitPriceMaterial: 220000,
      unitPriceLabor: 38000,
      unitPriceMachine: 12000,
      materials: [{ code: 'VL.TONPU', name: 'Tôn mát 3 lớp tôn-PU-màng bạc dày 50mm', unit: 'm2', norm: 1.05, price: 209000 }],
      labors: [{ code: 'NC.01', name: 'Thợ lợp mái tôn', unit: 'công', norm: 0.12, price: 316000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.11', name: 'Tời nâng vật liệu mái', unit: 'ca', norm: 0.006, price: 2000000 }],
    }
  ];

  return {
    id,
    name: 'Nhà xưởng Sản xuất & Kho vận Logistics (6.000 m2)',
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      projectName: 'Nhà xưởng Sản xuất & Kho vận Logistics (6.000 m2)',
      locationProvince: 'Bình Dương',
      salaryRegion: 'I',
      projectType: 'industrial',
      indirectCostConfig: {
        enabledAuto: true,
        method: 'by_scale',
        isLineProject: false,
        categorySettings: {
          'cat-in-1': { projectType: 'industrial' },
          'cat-in-2': { projectType: 'industrial' },
          'cat-in-3': { projectType: 'industrial' },
        }
      },
      adminReportConfig: {
        ...DEFAULT_PROJECT_SETTINGS.adminReportConfig,
        documentTitle: 'BẢNG DỰ TOÁN CÔNG TRÌNH CÔNG NGHIỆP',
        superiorAgency: 'BAN QUẢN LÝ CÁC KHU CÔNG NGHIỆP TỈNH BÌNH DƯƠNG',
        investorUnit: 'Công ty TNHH Tiếp vận Thông minh F1 Logistics',
        signDatePlace: 'Bình Dương, ngày 22 tháng 10 năm 2026',
      }
    },
    categories: indCategories,
    items: indItems,
    auditDiffs: [],
    settlements: [],
    tasks: [],
    biddingForm: {
      ...SAMPLE_BIDDING_FORM,
      packageName: 'Gói thầu số 02: Thi công xây dựng Nhà xưởng và hạ tầng kỹ thuật phụ trợ',
      bidderName: 'Công ty Cổ phần Kết cấu Thép Tiền chế F1 Steel',
    },
    createdAt: Date.now() - 86400000,
    lastModified: Date.now(),
  };
};

// 4. DỰ ÁN 4: HẠ TẦNG KỸ THUẬT (CẤP THOÁT NƯỚC ĐÔ THỊ)
export const createInfrastructureProject = (id: string = `proj-inf-${Date.now()}`): ProjectInstance => {
  const infCategories: Category[] = [
    { id: 'cat-if-1', name: 'Hạng mục 1: Đào rãnh tuyến & Hào kỹ thuật ngầm', projectType: 'infrastructure' },
    { id: 'cat-if-2', name: 'Hạng mục 2: Lắp đặt đường ống cống thoát nước BTCT D800-D1000', projectType: 'infrastructure' },
    { id: 'cat-if-3', name: 'Hạng mục 3: Hố ga thu nước & Trạm bơm tăng áp', projectType: 'infrastructure' },
  ];

  const infItems: WorkItem[] = [
    {
      id: 'w-if-1',
      stt: 1,
      type: 'work',
      categoryId: 'cat-if-1',
      code: 'AB.21121',
      name: 'Đào đất rãnh đặt cống bằng máy đào 0.8m3, đất cấp II',
      unit: 'm3',
      quantity: 3600,
      subCalculations: [],
      unitPriceMaterial: 0,
      unitPriceLabor: 22000,
      unitPriceMachine: 38000,
      materials: [],
      labors: [{ code: 'NC.01', name: 'Nhân công đào rãnh đất', unit: 'công', norm: 0.075, price: 293000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.12', name: 'Máy đào bánh xích 0.8m3', unit: 'ca', norm: 0.009, price: 4220000 }],
    },
    {
      id: 'w-if-2',
      stt: 2,
      type: 'work',
      categoryId: 'cat-if-2',
      code: 'AF.11111',
      name: 'Bê tông lót móng cống đá 4x6 mác 100',
      unit: 'm3',
      quantity: 180,
      subCalculations: [],
      unitPriceMaterial: 920000,
      unitPriceLabor: 185000,
      unitPriceMachine: 42000,
      materials: [{ code: 'VL.BTLOT', name: 'Bê tông lót mác 100', unit: 'm3', norm: 1.02, price: 900000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công lót đáy', unit: 'công', norm: 0.63, price: 293000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.13', name: 'Máy trộn bê tông 250L', unit: 'ca', norm: 0.035, price: 1200000 }],
    },
    {
      id: 'w-if-3',
      stt: 3,
      type: 'work',
      categoryId: 'cat-if-2',
      code: 'BB.11111',
      name: 'Lắp đặt cống tròn bê tông cốt thép ly tâm D1000 mối nối loe',
      unit: 'm',
      quantity: 1200,
      subCalculations: [],
      unitPriceMaterial: 1150000,
      unitPriceLabor: 145000,
      unitPriceMachine: 85000,
      materials: [{ code: 'VL.CONG1000', name: 'Ống cống BTCT ly tâm D1000 tải trọng H30', unit: 'm', norm: 1.02, price: 1120000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công đặt cống', unit: 'công', norm: 0.49, price: 295000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.14', name: 'Cần trục tự hành 16T hạ cống', unit: 'ca', norm: 0.016, price: 5310000 }],
    },
    {
      id: 'w-if-4',
      stt: 4,
      type: 'work',
      categoryId: 'cat-if-3',
      code: 'AF.12210',
      name: 'Đổ bê tông thành và nắp hố ga thu nước đá 1x2 mác 250',
      unit: 'm3',
      quantity: 95,
      subCalculations: [],
      unitPriceMaterial: 1350000,
      unitPriceLabor: 280000,
      unitPriceMachine: 65000,
      materials: [{ code: 'VL.BT250', name: 'Bê tông thương phẩm mác 250', unit: 'm3', norm: 1.02, price: 1320000 }],
      labors: [{ code: 'NC.01', name: 'Nhân công đúc hố ga', unit: 'công', norm: 0.95, price: 295000, rank: '3.5/7' }],
      machines: [{ code: 'MTC.15', name: 'Máy đầm dùi 1.5kW', unit: 'ca', norm: 0.08, price: 812000 }],
    }
  ];

  return {
    id,
    name: 'Dự án Cấp thoát nước & Hạ tầng Kỹ thuật Đô thị (Hòa Vang)',
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      projectName: 'Dự án Cấp thoát nước & Hạ tầng Kỹ thuật Đô thị (Hòa Vang)',
      locationProvince: 'Đà Nẵng',
      salaryRegion: 'II',
      projectType: 'infrastructure',
      indirectCostConfig: {
        enabledAuto: true,
        method: 'by_scale',
        isLineProject: true,
        categorySettings: {
          'cat-if-1': { projectType: 'infrastructure' },
          'cat-if-2': { projectType: 'infrastructure' },
          'cat-if-3': { projectType: 'infrastructure' },
        }
      },
      adminReportConfig: {
        ...DEFAULT_PROJECT_SETTINGS.adminReportConfig,
        documentTitle: 'BẢNG DỰ TOÁN CÔNG TRÌNH HẠ TẦNG KỸ THUẬT',
        superiorAgency: 'UBND THÀNH PHỐ ĐÀ NẴNG - SỞ XÂY DỰNG',
        investorUnit: 'Ban Quản lý Các dự án Phát triển Hạ tầng Đô thị Đà Nẵng',
        signDatePlace: 'Đà Nẵng, ngày 23 tháng 10 năm 2026',
      }
    },
    categories: infCategories,
    items: infItems,
    auditDiffs: [],
    settlements: [],
    tasks: [],
    biddingForm: SAMPLE_BIDDING_FORM,
    createdAt: Date.now() - 86400000 * 4,
    lastModified: Date.now(),
  };
};

// 5. DỰ ÁN TRỐNG (BLANK PROJECT MỚI HOÀN TOÀN)
export const createBlankProject = (customName?: string): ProjectInstance => {
  const newId = `proj-blank-${Date.now()}`;
  const pName = customName || `Dự án Mới ${new Date().toLocaleDateString('vi-VN')}`;
  const blankCat: Category = {
    id: `cat-1`,
    name: 'Hạng mục 1: Khối lượng xây dựng chính',
    projectType: 'civil',
  };

  return {
    id: newId,
    name: pName,
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      projectName: pName,
      locationProvince: 'Hà Nội',
      projectType: 'civil',
      indirectCostConfig: {
        enabledAuto: true,
        method: 'by_scale',
        isLineProject: false,
        categorySettings: {
          'cat-1': { projectType: 'civil' }
        }
      }
    },
    categories: [blankCat],
    items: [],
    auditDiffs: [],
    settlements: [],
    tasks: [],
    biddingForm: {
      packageCode: `TB-${Date.now().toString().slice(-6)}`,
      packageName: `Gói thầu thi công xây dựng: ${pName}`,
      bidderName: 'Công ty Cổ phần Xây dựng F1',
      bidPriceWithoutVAT: 0,
      vatAmount: 0,
      totalBidPrice: 0,
      executionDurationDays: 120,
      validityDays: 90,
      discountRate: 0,
    },
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
};
