import { Category, ProjectSettings, WorkItem, AuditDiffItem, SettlementItem, GanttTask, BiddingForm } from '../types/estimate';
import { NORMS_CATALOG } from './normsData';

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  projectName: 'Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)',
  contractor: 'Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam',
  investor: 'Ban Quản lý Dự án Đầu tư Xây dựng Hà Nội',
  locationProvince: 'Hà Nội',
  salaryRegion: 'I',
  projectType: 'civil',
  vatRate: 0.10,
  standardCircular: 'Thông tư 12/2021/TT-BXD & TT 11/2021/TT-BXD',
  indirectCostConfig: {
    enabledAuto: true,
    method: 'by_scale',
    isLineProject: false,
    categorySettings: {
      'cat-1': { projectType: 'civil' },
      'cat-2': { projectType: 'civil' },
      'cat-3': { projectType: 'civil' }
    }
  },
  adminReportConfig: {
    documentTitle: 'BẢNG DỰ TOÁN XÂY DỰNG CÔNG TRÌNH',
    documentSubTitle: 'Căn cứ Nghị định số 10/2021/NĐ-CP & Thông tư số 11/2021/TT-BXD, TT 12/2021/TT-BXD',
    documentNumber: 'Số: 148/TTr-BQLDA',
    superiorAgency: 'UBND THÀNH PHỐ HÀ NỘI - SỞ XÂY DỰNG',
    consultantUnit: 'Công ty Cổ phần Xây dựng & Công nghệ F1 Việt Nam',
    investorUnit: 'Ban Quản lý Dự án Đầu tư Xây dựng Hà Nội',
    appraisalUnit: 'Sở Xây dựng TP. Hà Nội - Chi cục Giám định',
    creatorName: 'KS. Nguyễn Văn An',
    creatorTitle: 'Kỹ sư Định giá Xây dựng',
    chiefEngineer: 'ThS. Trần Quốc Bảo',
    chiefEngineerTitle: 'Chủ trì Lập dự toán',
    approverName: 'TS. Lê Hoàng Nam',
    approverTitle: 'GIÁM ĐỐC BAN QUẢN LÝ DỰ ÁN',
    signDatePlace: 'Hà Nội, ngày 21 tháng 10 năm 2026',
    nationalHeaderLine1: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    nationalHeaderLine2: 'Độc lập - Tự do - Hạnh phúc',
    paperOrientation: 'landscape',
    showSignatures: true
  },
  autoSaveConfig: {
    enabled: true,
    intervalMinutes: 5,
    lastSavedAt: 'Vừa khởi tạo'
  }
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Hạng mục 1: Phần móng và kết cấu tầng ngầm', projectType: 'civil' },
  { id: 'cat-2', name: 'Hạng mục 2: Phần kết cấu thân bê tông cốt thép', projectType: 'civil' },
  { id: 'cat-3', name: 'Hạng mục 3: Phần xây thô, hoàn thiện & M&E', projectType: 'civil' },
];

const NORM_CODE_ALIASES: Record<string, string> = {
  'AF.61120': 'AH.11210', // Cốt thép móng D<=18mm
  'AF.12320': 'AF.13110', // Bê tông cột
  'AF.12420': 'AF.14110', // Bê tông dầm sàn
  'AF.81210': 'AI.14110', // Ván khuôn dầm sàn
  'BB.11111': 'AE.21110', // Xây tường gạch ống
  'AK.51110': 'AK.11110', // Trát tường trong
  'AK.81110': 'AK.51110', // Lát nền gạch 600x600
  'AL.21110': 'BC.11120', // Kéo rải dây điện đôi 2x2.5mm2
};

function findNorm(code: string) {
  const resolved = NORM_CODE_ALIASES[code] || code;
  const norm = NORMS_CATALOG.find(n => n.code === resolved || n.code === code);
  if (norm) return norm;
  return NORMS_CATALOG[0];
}

export const INITIAL_WORK_ITEMS: WorkItem[] = [
  // HẠNG MỤC 1
  {
    id: 'w-1',
    stt: 1,
    type: 'work',
    categoryId: 'cat-1',
    code: 'AA.11111',
    name: 'Phát hoang dọn dẹp mặt bằng bằng thủ công',
    unit: '100m2',
    quantity: 4.5,
    subCalculations: [
      { id: 'sub-1', name: 'Khu đất xây dựng', expression: '15.0 * 30.0 / 100', quantity: 4.5 }
    ],
    unitPriceMaterial: findNorm('AA.11111').defaultPriceMat,
    unitPriceLabor: findNorm('AA.11111').defaultPriceLab,
    unitPriceMachine: findNorm('AA.11111').defaultPriceMac,
    materials: findNorm('AA.11111').materials,
    labors: findNorm('AA.11111').labors,
    machines: findNorm('AA.11111').machines
  },
  {
    id: 'w-2',
    stt: 2,
    type: 'work',
    categoryId: 'cat-1',
    code: 'AB.21121',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II',
    unit: 'm3',
    quantity: 68.4,
    subCalculations: [
      { id: 'sub-2-1', name: 'Móng M1 (12 hố)', expression: '12 * 1.8 * 1.8 * 1.2', quantity: 46.656 },
      { id: 'sub-2-2', name: 'Móng M2 (6 hố)', expression: '6 * 1.5 * 1.5 * 1.1', quantity: 14.85 },
      { id: 'sub-2-3', name: 'Hố ga, hầm tự hoại', expression: '1 * 2.5 * 2.3 * 1.2', quantity: 6.9 }
    ],
    unitPriceMaterial: findNorm('AB.21121').defaultPriceMat,
    unitPriceLabor: findNorm('AB.21121').defaultPriceLab,
    unitPriceMachine: findNorm('AB.21121').defaultPriceMac,
    materials: findNorm('AB.21121').materials,
    labors: findNorm('AB.21121').labors,
    machines: findNorm('AB.21121').machines
  },
  {
    id: 'w-3',
    stt: 3,
    type: 'work',
    categoryId: 'cat-1',
    code: 'AF.11111',
    name: 'Bê tông lót móng đá 4x6 mac 100, vua xi mang PC30',
    unit: 'm3',
    quantity: 6.8,
    subCalculations: [
      { id: 'sub-3-1', name: 'Lót móng M1', expression: '12 * 2.0 * 2.0 * 0.1', quantity: 4.8 },
      { id: 'sub-3-2', name: 'Lót móng M2', expression: '6 * 1.7 * 1.7 * 0.1', quantity: 1.734 },
      { id: 'sub-3-3', name: 'Lót hố ga', expression: '1 * 2.7 * 2.5 * 0.1', quantity: 0.675 }
    ],
    unitPriceMaterial: findNorm('AF.11111').defaultPriceMat,
    unitPriceLabor: findNorm('AF.11111').defaultPriceLab,
    unitPriceMachine: findNorm('AF.11111').defaultPriceMac,
    materials: findNorm('AF.11111').materials,
    labors: findNorm('AF.11111').labors,
    machines: findNorm('AF.11111').machines
  },
  {
    id: 'w-4',
    stt: 4,
    type: 'work',
    categoryId: 'cat-1',
    code: 'AF.12210',
    name: 'Bê tông móng đá 1x2 mác 200, vữa XM PC40',
    unit: 'm3',
    quantity: 38.5,
    subCalculations: [
      { id: 'sub-4-1', name: 'Thân móng M1 (be tong cốt thép)', expression: '12 * 1.8 * 1.8 * 0.6', quantity: 23.328 },
      { id: 'sub-4-2', name: 'Cổ móng M1', expression: '12 * 0.4 * 0.4 * 0.8', quantity: 1.536 },
      { id: 'sub-4-3', name: 'Móng M2 và giằng móng', expression: '6 * 1.5 * 1.5 * 0.5 + 45 * 0.25 * 0.4', quantity: 11.25 }
    ],
    unitPriceMaterial: findNorm('AF.12210').defaultPriceMat,
    unitPriceLabor: findNorm('AF.12210').defaultPriceLab,
    unitPriceMachine: findNorm('AF.12210').defaultPriceMac,
    materials: findNorm('AF.12210').materials,
    labors: findNorm('AF.12210').labors,
    machines: findNorm('AF.12210').machines
  },
  {
    id: 'w-5',
    stt: 5,
    type: 'work',
    categoryId: 'cat-1',
    code: 'AF.61120',
    name: 'Sản xuất, lắp dựng cốt thép móng đường kính <= 18mm',
    unit: 'tấn',
    quantity: 3.45,
    subCalculations: [
      { id: 'sub-5-1', name: 'Thép móng phi 14-16', expression: '38.5 * 85 / 1000', quantity: 3.2725 },
      { id: 'sub-5-2', name: 'Thép chờ cổ cột', expression: '18 * 4 * 2.2 * 1.58 / 1000', quantity: 0.25 }
    ],
    unitPriceMaterial: findNorm('AF.61120').defaultPriceMat,
    unitPriceLabor: findNorm('AF.61120').defaultPriceLab,
    unitPriceMachine: findNorm('AF.61120').defaultPriceMac,
    materials: findNorm('AF.61120').materials,
    labors: findNorm('AF.61120').labors,
    machines: findNorm('AF.61120').machines
  },

  // HẠNG MỤC 2: PHẦN THÂN
  {
    id: 'w-6',
    stt: 6,
    type: 'work',
    categoryId: 'cat-2',
    code: 'AF.12320',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    quantity: 28.8,
    subCalculations: [
      { id: 'sub-6-1', name: 'Cột tầng 1 (18 cột)', expression: '18 * 0.3 * 0.3 * 3.6', quantity: 5.832 },
      { id: 'sub-6-2', name: 'Cột tầng 2-5 (4 tầng * 18 cột)', expression: '72 * 0.3 * 0.3 * 3.3', quantity: 21.384 }
    ],
    unitPriceMaterial: findNorm('AF.12320').defaultPriceMat,
    unitPriceLabor: findNorm('AF.12320').defaultPriceLab,
    unitPriceMachine: findNorm('AF.12320').defaultPriceMac,
    materials: findNorm('AF.12320').materials,
    labors: findNorm('AF.12320').labors,
    machines: findNorm('AF.12320').machines
  },
  {
    id: 'w-7',
    stt: 7,
    type: 'work',
    categoryId: 'cat-2',
    code: 'AF.12420',
    name: 'Bê tông dầm, sàn đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    quantity: 112.5,
    subCalculations: [
      { id: 'sub-7-1', name: 'Sàn 5 tầng (dày 12cm)', expression: '5 * 12 * 25 * 0.12', quantity: 90.0 },
      { id: 'sub-7-2', name: 'Hệ dầm chính D1, D2', expression: '5 * 8 * 0.22 * 0.45 * 12', quantity: 22.5 }
    ],
    unitPriceMaterial: findNorm('AF.12420').defaultPriceMat,
    unitPriceLabor: findNorm('AF.12420').defaultPriceLab,
    unitPriceMachine: findNorm('AF.12420').defaultPriceMac,
    materials: findNorm('AF.12420').materials,
    labors: findNorm('AF.12420').labors,
    machines: findNorm('AF.12420').machines
  },
  {
    id: 'w-8',
    stt: 8,
    type: 'work',
    categoryId: 'cat-2',
    code: 'AF.81210',
    name: 'Ván khuôn cột, dầm sàn gỗ phủ phim, giáo chống thép',
    unit: '100m2',
    quantity: 14.2,
    subCalculations: [
      { id: 'sub-8-1', name: 'Cốp pha sàn 5 tầng', expression: '5 * 240 / 100', quantity: 12.0 },
      { id: 'sub-8-2', name: 'Cốp pha cột và thành dầm', expression: '220 / 100', quantity: 2.2 }
    ],
    unitPriceMaterial: findNorm('AF.81210').defaultPriceMat,
    unitPriceLabor: findNorm('AF.81210').defaultPriceLab,
    unitPriceMachine: findNorm('AF.81210').defaultPriceMac,
    materials: findNorm('AF.81210').materials,
    labors: findNorm('AF.81210').labors,
    machines: findNorm('AF.81210').machines
  },

  // HẠNG MỤC 3: HOÀN THIỆN & M&E
  {
    id: 'w-9',
    stt: 9,
    type: 'work',
    categoryId: 'cat-3',
    code: 'BB.11111',
    name: 'Xây tường gạch ống 8x8x19 dày 10cm, vữa XM mác 75',
    unit: 'm3',
    quantity: 64.0,
    subCalculations: [
      { id: 'sub-9-1', name: 'Tường ngăn phòng 5 tầng', expression: '5 * 128 * 0.1', quantity: 64.0 }
    ],
    unitPriceMaterial: findNorm('BB.11111').defaultPriceMat,
    unitPriceLabor: findNorm('BB.11111').defaultPriceLab,
    unitPriceMachine: findNorm('BB.11111').defaultPriceMac,
    materials: findNorm('BB.11111').materials,
    labors: findNorm('BB.11111').labors,
    machines: findNorm('BB.11111').machines
  },
  {
    id: 'w-10',
    stt: 10,
    type: 'work',
    categoryId: 'cat-3',
    code: 'AK.51110',
    name: 'Trát tường trong nhà dày 1.5cm vữa XM mác 75',
    unit: 'm2',
    quantity: 1280.0,
    subCalculations: [
      { id: 'sub-10-1', name: 'Trát 2 mặt tường ngăn', expression: '64.0 / 0.1 * 2', quantity: 1280.0 }
    ],
    unitPriceMaterial: findNorm('AK.51110').defaultPriceMat,
    unitPriceLabor: findNorm('AK.51110').defaultPriceLab,
    unitPriceMachine: findNorm('AK.51110').defaultPriceMac,
    materials: findNorm('AK.51110').materials,
    labors: findNorm('AK.51110').labors,
    machines: findNorm('AK.51110').machines
  },
  {
    id: 'w-11',
    stt: 11,
    type: 'work',
    categoryId: 'cat-3',
    code: 'AK.81110',
    name: 'Lát nền gạch ceramic 600x600 vữa xi măng mác 75',
    unit: 'm2',
    quantity: 750.0,
    subCalculations: [
      { id: 'sub-11-1', name: 'Nền sảnh và văn phòng 5 tầng', expression: '5 * 150', quantity: 750.0 }
    ],
    unitPriceMaterial: findNorm('AK.81110').defaultPriceMat,
    unitPriceLabor: findNorm('AK.81110').defaultPriceLab,
    unitPriceMachine: findNorm('AK.81110').defaultPriceMac,
    materials: findNorm('AK.81110').materials,
    labors: findNorm('AK.81110').labors,
    machines: findNorm('AK.81110').machines
  },
  {
    id: 'w-12',
    stt: 12,
    type: 'work',
    categoryId: 'cat-3',
    code: 'AK.91110',
    name: 'Sơn tường trong nhà 1 nước lót 2 nước phủ Maxilite',
    unit: 'm2',
    quantity: 1280.0,
    subCalculations: [
      { id: 'sub-12-1', name: 'Diện tích sơn bằng diện tích trát', expression: '1280.0', quantity: 1280.0 }
    ],
    unitPriceMaterial: findNorm('AK.91110').defaultPriceMat,
    unitPriceLabor: findNorm('AK.91110').defaultPriceLab,
    unitPriceMachine: findNorm('AK.91110').defaultPriceMac,
    materials: findNorm('AK.91110').materials,
    labors: findNorm('AK.91110').labors,
    machines: findNorm('AK.91110').machines
  },
  {
    id: 'w-13',
    stt: 13,
    type: 'work',
    categoryId: 'cat-3',
    code: 'AL.21110',
    name: 'Kéo rải dây điện đôi Cu/PVC 2x2.5mm2 luồn ống gen',
    unit: '100m',
    quantity: 24.5,
    subCalculations: [
      { id: 'sub-13-1', name: 'Trục cấp nguồn các tầng', expression: '2450 / 100', quantity: 24.5 }
    ],
    unitPriceMaterial: findNorm('AL.21110').defaultPriceMat,
    unitPriceLabor: findNorm('AL.21110').defaultPriceLab,
    unitPriceMachine: findNorm('AL.21110').defaultPriceMac,
    materials: findNorm('AL.21110').materials,
    labors: findNorm('AL.21110').labors,
    machines: findNorm('AL.21110').machines
  }
];

// Dữ liệu mẫu cho phân hệ Thẩm tra công trình
export const SAMPLE_AUDIT_DIFFS: AuditDiffItem[] = [
  {
    code: 'AA.11111',
    name: 'Phát hoang dọn dẹp mặt bằng bằng thủ công',
    unit: '100m2',
    originalQty: 4.5,
    auditQty: 4.5,
    diffQty: 0,
    originalMatPrice: 0,
    auditMatPrice: 0,
    originalTotal: 832500,
    auditTotal: 832500,
    diffTotal: 0,
    status: 'matched',
    reason: 'Khối lượng và đơn giá khớp hoàn toàn với thiết kế'
  },
  {
    code: 'AB.21121',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II',
    unit: 'm3',
    originalQty: 68.4,
    auditQty: 62.1,
    diffQty: -6.3,
    originalMatPrice: 0,
    auditMatPrice: 0,
    originalTotal: 16758000,
    auditTotal: 15214500,
    diffTotal: -1543500,
    status: 'error',
    reason: 'Đo bóc thừa khối lượng đào hố móng M1 (chưa trừ phần giao dầm)'
  },
  {
    code: 'AF.12210',
    name: 'Bê tông móng đá 1x2 mác 200, vữa XM PC40',
    unit: 'm3',
    originalQty: 38.5,
    auditQty: 36.8,
    diffQty: -1.7,
    originalMatPrice: 980000,
    auditMatPrice: 950000,
    originalTotal: 52552500,
    auditTotal: 49128000,
    diffTotal: -3424500,
    status: 'error',
    reason: 'Điều chỉnh đơn giá xi măng theo thông báo giá tháng mới nhất của Liên sở'
  },
  {
    code: 'AF.61120',
    name: 'Sản xuất, lắp dựng cốt thép móng đường kính <= 18mm',
    unit: 'tấn',
    originalQty: 3.45,
    auditQty: 3.45,
    diffQty: 0,
    originalMatPrice: 17400000,
    auditMatPrice: 17100000,
    originalTotal: 71553000,
    auditTotal: 70518000,
    diffTotal: -1035000,
    status: 'warning',
    reason: 'Giá thép Hòa Phát áp theo công bố giá quý gần nhất (-300đ/kg)'
  },
  {
    code: 'AF.81210',
    name: 'Ván khuôn cột, dầm sàn gỗ phủ phim, giáo chống thép',
    unit: '100m2',
    originalQty: 14.2,
    auditQty: 14.2,
    diffQty: 0,
    originalMatPrice: 12500000,
    auditMatPrice: 12500000,
    originalTotal: 321630000,
    auditTotal: 321630000,
    diffTotal: 0,
    status: 'matched',
    reason: 'Định mức hao phí luân chuyển ván khuôn đúng quy định Thông tư 12'
  },
  {
    code: 'AK.91110',
    name: 'Sơn tường trong nhà 1 nước lót 2 nước phủ Maxilite',
    unit: 'm2',
    originalQty: 1280.0,
    auditQty: 1150.0,
    diffQty: -130.0,
    originalMatPrice: 38000,
    auditMatPrice: 38000,
    originalTotal: 89600000,
    auditTotal: 80500000,
    diffTotal: -9100000,
    status: 'error',
    reason: 'Chưa trừ diện tích cửa sổ nhôm kính và ô thông gió theo bản vẽ KT'
  }
];

// Dữ liệu mẫu cho phân hệ Thanh quyết toán PL 03a & 03b
export const SAMPLE_SETTLEMENT_ITEMS: SettlementItem[] = [
  {
    id: 's-1',
    code: 'AA.11111',
    name: 'Phát hoang dọn dẹp mặt bằng bằng thủ công',
    unit: '100m2',
    contractQty: 4.5,
    contractPrice: 185000,
    prevAccumulatedQty: 4.5,
    thisPeriodQty: 0,
    totalAccumulatedQty: 4.5,
    isAdditional: false
  },
  {
    id: 's-2',
    code: 'AB.21121',
    name: 'Đào hố móng cột độc lập, sâu <= 1m, đất cấp II',
    unit: 'm3',
    contractQty: 68.4,
    contractPrice: 245000,
    prevAccumulatedQty: 68.4,
    thisPeriodQty: 0,
    totalAccumulatedQty: 68.4,
    isAdditional: false
  },
  {
    id: 's-3',
    code: 'AF.12210',
    name: 'Bê tông móng đá 1x2 mác 200, vữa XM PC40',
    unit: 'm3',
    contractQty: 38.5,
    contractPrice: 1365000,
    prevAccumulatedQty: 38.5,
    thisPeriodQty: 0,
    totalAccumulatedQty: 38.5,
    isAdditional: false
  },
  {
    id: 's-4',
    code: 'AF.12320',
    name: 'Bê tông cột tiết diện <= 0.1m2 đá 1x2 mác 250',
    unit: 'm3',
    contractQty: 28.8,
    contractPrice: 1685000,
    prevAccumulatedQty: 18.0,
    thisPeriodQty: 10.8,
    totalAccumulatedQty: 28.8,
    isAdditional: false
  },
  {
    id: 's-5',
    code: 'AF.12420',
    name: 'Bê tông dầm, sàn đá 1x2 mác 250, vữa XM PC40',
    unit: 'm3',
    contractQty: 112.5,
    contractPrice: 1580000,
    prevAccumulatedQty: 45.0,
    thisPeriodQty: 67.5,
    totalAccumulatedQty: 112.5,
    isAdditional: false
  },
  {
    id: 's-6',
    code: 'BB.11111',
    name: 'Xây tường gạch ống 8x8x19 dày 10cm, vữa XM mác 75',
    unit: 'm3',
    contractQty: 64.0,
    contractPrice: 1695000,
    prevAccumulatedQty: 0,
    thisPeriodQty: 42.0,
    totalAccumulatedQty: 42.0,
    isAdditional: false
  },
  // PHÁT SINH NGOÀI HỢP ĐỒNG (PHỤ LỤC 03.b)
  {
    id: 's-add-1',
    code: 'AC.11111',
    name: '[Phát sinh] Đắp cát tôn nền móng chống ngập do nâng cốt đường',
    unit: 'm3',
    contractQty: 0,
    contractPrice: 235000,
    prevAccumulatedQty: 0,
    thisPeriodQty: 35.0,
    totalAccumulatedQty: 35.0,
    isAdditional: true
  },
  {
    id: 's-add-2',
    code: 'AF.61110',
    name: '[Phát sinh] Gia cường thép bản đáy bể nước ngầm theo biên bản hiện trường',
    unit: 'tấn',
    contractQty: 0,
    contractPrice: 21270000,
    prevAccumulatedQty: 0,
    thisPeriodQty: 0.85,
    totalAccumulatedQty: 0.85,
    isAdditional: true
  }
];

// Dữ liệu mẫu cho phân hệ Tiến độ thi công (Gantt)
export const SAMPLE_GANTT_TASKS: GanttTask[] = [
  { id: 'g-1', name: 'Chuẩn bị mặt bằng & đào đất móng', startDate: '2026-03-01', endDate: '2026-03-12', durationDays: 12, progressPercent: 100, workersRequired: 14 },
  { id: 'g-2', name: 'Bê tông lót & kết cấu móng BTCT', startDate: '2026-03-13', endDate: '2026-03-28', durationDays: 16, progressPercent: 100, predecessorId: 'g-1', workersRequired: 22 },
  { id: 'g-3', name: 'Đổ bê tông cột dầm sàn tầng 1 & 2', startDate: '2026-03-29', endDate: '2026-04-18', durationDays: 21, progressPercent: 85, predecessorId: 'g-2', workersRequired: 28 },
  { id: 'g-4', name: 'Đổ bê tông cột dầm sàn tầng 3, 4 & 5', startDate: '2026-04-19', endDate: '2026-05-15', durationDays: 27, progressPercent: 40, predecessorId: 'g-3', workersRequired: 30 },
  { id: 'g-5', name: 'Xây thô tường ngăn các tầng', startDate: '2026-04-25', endDate: '2026-05-25', durationDays: 31, progressPercent: 30, predecessorId: 'g-3', workersRequired: 18 },
  { id: 'g-6', name: 'Trát tường, ốp lát gạch nền', startDate: '2026-05-20', endDate: '2026-06-20', durationDays: 32, progressPercent: 0, predecessorId: 'g-5', workersRequired: 20 },
  { id: 'g-7', name: 'Lắp đặt hệ thống điện nước M&E', startDate: '2026-05-15', endDate: '2026-06-25', durationDays: 42, progressPercent: 15, predecessorId: 'g-5', workersRequired: 12 },
  { id: 'g-8', name: 'Sơn bả hoàn thiện & vệ sinh bàn giao', startDate: '2026-06-21', endDate: '2026-07-05', durationDays: 15, progressPercent: 0, predecessorId: 'g-6', workersRequired: 16 },
];

// Dữ liệu mẫu cho Đấu thầu trực tuyến E-GP
export const SAMPLE_BIDDING_FORM: BiddingForm = {
  packageCode: 'TB-2026-F1-00892',
  packageName: 'Gói thầu số 03: Thi công xây dựng công trình Nhà làm việc và hạ tầng kỹ thuật',
  bidderName: 'Liên danh Nhà thầu Xây dựng F1 Tech - Nanosoft Cons',
  bidPriceWithoutVAT: 1425600000,
  vatAmount: 142560000,
  totalBidPrice: 1568160000,
  executionDurationDays: 180,
  validityDays: 120,
  discountRate: 2.5
};
