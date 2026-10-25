/**
 * Dự toán F1 Pro - Data Models & Types
 * Chuẩn định mức xây dựng Việt Nam (TT 12/2021/TT-BXD, TT 11/2021/TT-BXD, TT 14/2023/TT-BXD)
 */

export type WorkItemType = 'work' | 'category';

export interface MaterialBreakdown {
  code: string;
  name: string;
  unit: string;
  norm: number; // Hao phí cho 1 đơn vị công tác
  price: number; // Giá gốc
  monthlyPrice?: number; // Giá tháng/thị trường
}

export interface LaborBreakdown {
  code: string;
  name: string;
  unit: string; // công
  norm: number; // Hao phí
  price: number; // Đơn giá 1 công
  rank: string; // Bậc thợ 3.5/7, 4/7...
}

export interface MachineBreakdown {
  code: string;
  name: string;
  unit: string; // ca
  norm: number; // Hao phí ca máy
  price: number; // Đơn giá 1 ca
}

export interface SubCalculation {
  id: string;
  name: string; // Tên cấu kiện (e.g. Móng M1, Dầm D1)
  expression: string; // Biểu thức tính toán (e.g. 2 * 1.5 * 1.8 * 0.4)
  quantity: number; // Kết quả tính ra
}

export interface WorkItem {
  id: string;
  stt: number;
  type: WorkItemType;
  categoryId?: string;
  code: string; // Mã hiệu định mức (AF.12210...)
  name: string; // Tên công tác
  unit: string; // Đơn vị tính (m3, tấn, m2, 100m...)
  quantity: number; // Khối lượng tổng
  subCalculations: SubCalculation[]; // Danh sách dòng diễn giải con
  
  // Đơn giá gốc (cho 1 đơn vị)
  unitPriceMaterial: number;
  unitPriceLabor: number;
  unitPriceMachine: number;

  // Hao phí chi tiết thành phần
  materials: MaterialBreakdown[];
  labors: LaborBreakdown[];
  machines: MachineBreakdown[];

  // Ghi chú hoặc cảnh báo thẩm tra
  note?: string;
}

export interface Category {
  id: string;
  name: string; // e.g. "Hạng mục 1: Phần móng & kết cấu ngầm"
  projectType?: ProjectType; // Cho phép từng hạng mục gán loại công trình riêng
  generalCostRate?: number; // Tỷ lệ chi phí chung tùy chỉnh nếu có
  taxableProfitRate?: number; // Tỷ lệ thu nhập chịu thuế tính trước
}

export type ProjectType = 'civil' | 'industrial' | 'transport' | 'infrastructure' | 'agriculture';

export type IndirectCostMethod = 'by_scale' | 'by_project_type' | 'by_category';

export interface CategoryIndirectCost {
  categoryId: string;
  categoryName: string;
  projectType: ProjectType;
  directCost: number; // T_i của hạng mục
  generalCostRate: number; // Tỷ lệ C%
  generalCost: number; // C_i = T_i * C%
  temporaryCampRate: number; // Tỷ lệ NT%
  temporaryCampCost: number; // NT_i = T_i * NT%
  unallocatedWorkRate: number; // Tỷ lệ KTXĐ%
  unallocatedWorkCost: number; // KTXĐ_i = T_i * KTXĐ%
  indirectCostTotal: number; // GT_i = C_i + NT_i + KTXĐ_i
  taxableProfitRate: number; // TL%
  taxableProfit: number; // TL_i = (T_i + GT_i) * TL%
}

export interface IndirectCostConfig {
  enabledAuto: boolean; // Bật tự động hóa tính toán chi phí gián tiếp
  method: IndirectCostMethod; // 'by_scale' (tự động theo quy mô chi phí T) | 'by_project_type' | 'by_category' (tự động theo từng danh mục hạng mục)
  isLineProject: boolean; // Công trình theo tuyến (tỷ lệ nhà tạm 2.2% thay vì 1.2%)
  customGeneralRate?: number; // Tỷ lệ can thiệp thủ công (nếu người dùng muốn chỉnh)
  customTaxableProfitRate?: number;
  customTempCampRate?: number;
  customUnallocatedRate?: number;
  categorySettings?: Record<string, {
    projectType: ProjectType;
    generalCostRate?: number;
    taxableProfitRate?: number;
  }>;
}

export interface AdminReportConfig {
  documentTitle?: string; // Tiêu đề biểu mẫu hành chính
  documentSubTitle?: string; // Tiêu đề phụ / căn cứ pháp lý
  documentNumber?: string; // Số hiệu văn bản hành chính
  superiorAgency?: string; // Cơ quan quản lý cấp trên
  consultantUnit?: string; // Đơn vị tư vấn lập dự toán
  investorUnit?: string; // Chủ đầu tư / Ban quản lý dự án
  appraisalUnit?: string; // Đơn vị thẩm định / thẩm tra
  creatorName?: string; // Họ tên người lập biểu
  creatorTitle?: string; // Chức danh người lập biểu
  chiefEngineer?: string; // Họ tên Chủ trì / Chủ nhiệm thiết kế
  chiefEngineerTitle?: string; // Chức danh chủ trì
  approverName?: string; // Họ tên người phê duyệt
  approverTitle?: string; // Chức danh người phê duyệt
  signDatePlace?: string; // Địa danh, ngày tháng năm lập biểu
  nationalHeaderLine1?: string; // Quốc hiệu dòng 1
  nationalHeaderLine2?: string; // Tiêu ngữ dòng 2
  paperOrientation?: 'portrait' | 'landscape'; // Khổ giấy in ấn
  showSignatures?: boolean; // Hiển thị khối chữ ký
}

export interface AutoSaveConfig {
  enabled: boolean; // Bật hoặc tắt tự động lưu dự án vào LocalStorage
  intervalMinutes: number; // Chu kỳ lưu tự động: 1, 2, 5, 10, 15 phút
  lastSavedAt?: string;
}

export interface ProjectSettings {
  projectName: string;
  contractor: string;
  investor: string;
  locationProvince: string; // Hà Nội, TP.HCM...
  salaryRegion: 'I' | 'II' | 'III' | 'IV';
  projectType: ProjectType;
  vatRate: number; // 0.10 hoặc 0.08
  standardCircular: string; // TT 12/2021/TT-BXD & TT 11/2021/TT-BXD
  indirectCostConfig?: IndirectCostConfig; // Tùy chọn tự động hóa chi phí gián tiếp
  adminReportConfig?: AdminReportConfig; // Cấu hình mẫu in ấn hành chính nhà nước (Nghị định 30/2020/NĐ-CP)
  autoSaveConfig?: AutoSaveConfig; // Cấu hình tự động lưu dự án định kỳ vào LocalStorage
}

export interface NormTemplate {
  code: string;
  name: string;
  unit: string;
  defaultPriceMat: number;
  defaultPriceLab: number;
  defaultPriceMac: number;
  chapter?: string; // Chương I, Chương II, Chương VI...
  categoryGroup?: 'Xây dựng' | 'Lắp đặt MEP' | 'Khảo sát' | 'Sửa chữa' | 'Thí nghiệm';
  materials: MaterialBreakdown[];
  labors: LaborBreakdown[];
  machines: MachineBreakdown[];
}

export interface ProvinceMaterialNotice {
  cementPCB40: number; // Xi măng Vicem / PCB40 (đ/kg)
  sandMedium: number; // Cát vàng hạt trung (đ/m3)
  stone1x2: number; // Đá 1x2 (đ/m3)
  stone4x6: number; // Đá 4x6 (đ/m3)
  steelCB300: number; // Thép cuộn D<=10 (đ/kg)
  steelCB400: number; // Thép vằn D<=18 (đ/kg)
  brickTuynel: number; // Gạch tuynel 8x8x19 (đ/viên)
  readyMixedConcreteM250: number; // Bê tông thương phẩm mác 250 (đ/m3)
}

export interface ProvinceData {
  id: string;
  name: string;
  region: 'I' | 'II' | 'III' | 'IV';
  laborCoefficient: number;
  machineCoefficient: number;
  gasolinePrice: number;
  dieselPrice: number;
  electricityPrice: number;
  decisionNumber?: string; // Số quyết định công bố bộ đơn giá tỉnh
  decisionDate?: string; // Ngày ban hành quyết định
  commonLaborPrice?: number; // Đơn giá nhân công bình quân bậc 3.5/7 (đ/công)
  keyMaterials?: ProvinceMaterialNotice; // Giá thông báo VLXD Sở Xây dựng
}

// Bảng thẩm tra sai lệch
export interface AuditDiffItem {
  code: string;
  name: string;
  unit: string;
  originalQty: number;
  auditQty: number;
  diffQty: number;
  originalMatPrice: number;
  auditMatPrice: number;
  originalTotal: number;
  auditTotal: number;
  diffTotal: number;
  status: 'matched' | 'warning' | 'error';
  reason: string;
}

// Thanh quyết toán 03a & 03b
export interface SettlementItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  contractQty: number; // Khối lượng theo hợp đồng
  contractPrice: number; // Đơn giá theo HĐ
  prevAccumulatedQty: number; // Lũy kế đến hết kỳ trước
  thisPeriodQty: number; // Thực hiện kỳ này
  totalAccumulatedQty: number; // Lũy kế đến hết kỳ này
  isAdditional: boolean; // Khối lượng phát sinh ngoài hợp đồng (PL 03b)
}

// Tiến độ thi công
export interface GanttTask {
  id: string;
  workItemId?: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  durationDays: number;
  progressPercent: number;
  predecessorId?: string; // Phụ thuộc công tác trước
  workersRequired: number;
}

// Đấu thầu E-GP
export interface BiddingForm {
  packageCode: string;
  packageName: string;
  bidderName: string;
  bidPriceWithoutVAT: number;
  vatAmount: number;
  totalBidPrice: number;
  executionDurationDays: number;
  validityDays: number;
  discountRate: number; // % giảm giá nếu có
}
