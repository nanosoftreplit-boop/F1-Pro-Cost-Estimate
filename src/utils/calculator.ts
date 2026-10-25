import { 
  WorkItem, 
  ProjectSettings, 
  ProjectType, 
  Category, 
  CategoryIndirectCost, 
  IndirectCostMethod 
} from '../types/estimate';

/**
 * An toàn tính toán biểu thức chuỗi diễn giải khối lượng
 * Ví dụ: "12 * 1.8 * 1.8 * 1.2", "4 * (2.5 + 3.2) * 0.22", "5 * 128 * 0.1"
 */
export function evaluateMathExpression(expr: string): number {
  if (!expr || expr.trim() === '') return 0;
  try {
    // Chỉ cho phép các ký tự an toàn: số, dấu +, -, *, /, (, ), dấu chấm thập phân
    const sanitized = expr.replace(/[^0-9+\-*/(). ]/g, '');
    if (!sanitized) return 0;
    
    // Đánh giá biểu thức toán học
    const fn = new Function(`return (${sanitized});`);
    const val = fn();
    return typeof val === 'number' && !isNaN(val) && isFinite(val) ? Math.round(val * 10000) / 10000 : 0;
  } catch {
    return 0;
  }
}

export interface AggregatedMaterial {
  code: string;
  name: string;
  unit: string;
  totalQuantity: number;
  basePrice: number;
  monthlyPrice: number;
  diffPrice: number;
  baseAmount: number;
  monthlyAmount: number;
  diffAmount: number;
  type: 'material' | 'labor' | 'machine';
}

/**
 * Tổng hợp toàn bộ lượng vật tư, nhân công, máy từ danh sách công tác
 */
export function aggregateMaterials(items: WorkItem[]): {
  materials: AggregatedMaterial[];
  labors: AggregatedMaterial[];
  machines: AggregatedMaterial[];
} {
  const matMap = new Map<string, AggregatedMaterial>();
  const labMap = new Map<string, AggregatedMaterial>();
  const macMap = new Map<string, AggregatedMaterial>();

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) continue;

    // Vật liệu
    for (const m of item.materials || []) {
      const needed = qty * (Number(m.norm) || 0);
      const existing = matMap.get(m.code);
      if (existing) {
        existing.totalQuantity += needed;
        existing.baseAmount = existing.totalQuantity * existing.basePrice;
        existing.monthlyAmount = existing.totalQuantity * existing.monthlyPrice;
        existing.diffAmount = existing.monthlyAmount - existing.baseAmount;
      } else {
        const bPrice = Number(m.price) || 0;
        const mPrice = Number(m.monthlyPrice) || bPrice;
        matMap.set(m.code, {
          code: m.code,
          name: m.name,
          unit: m.unit,
          totalQuantity: needed,
          basePrice: bPrice,
          monthlyPrice: mPrice,
          diffPrice: mPrice - bPrice,
          baseAmount: needed * bPrice,
          monthlyAmount: needed * mPrice,
          diffAmount: (mPrice - bPrice) * needed,
          type: 'material'
        });
      }
    }

    // Nhân công
    for (const l of item.labors || []) {
      const needed = qty * (Number(l.norm) || 0);
      const existing = labMap.get(l.code);
      if (existing) {
        existing.totalQuantity += needed;
        existing.baseAmount = existing.totalQuantity * existing.basePrice;
        existing.monthlyAmount = existing.totalQuantity * existing.monthlyPrice;
        existing.diffAmount = existing.monthlyAmount - existing.baseAmount;
      } else {
        const bPrice = Number(l.price) || 0;
        labMap.set(l.code, {
          code: l.code,
          name: `${l.name} (${l.rank})`,
          unit: l.unit,
          totalQuantity: needed,
          basePrice: bPrice,
          monthlyPrice: bPrice,
          diffPrice: 0,
          baseAmount: needed * bPrice,
          monthlyAmount: needed * bPrice,
          diffAmount: 0,
          type: 'labor'
        });
      }
    }

    // Máy thi công
    for (const mac of item.machines || []) {
      const needed = qty * (Number(mac.norm) || 0);
      const existing = macMap.get(mac.code);
      if (existing) {
        existing.totalQuantity += needed;
        existing.baseAmount = existing.totalQuantity * existing.basePrice;
        existing.monthlyAmount = existing.totalQuantity * existing.monthlyPrice;
        existing.diffAmount = existing.monthlyAmount - existing.baseAmount;
      } else {
        const bPrice = Number(mac.price) || 0;
        macMap.set(mac.code, {
          code: mac.code,
          name: mac.name,
          unit: mac.unit,
          totalQuantity: needed,
          basePrice: bPrice,
          monthlyPrice: bPrice,
          diffPrice: 0,
          baseAmount: needed * bPrice,
          monthlyAmount: needed * bPrice,
          diffAmount: 0,
          type: 'machine'
        });
      }
    }
  }

  return {
    materials: Array.from(matMap.values()),
    labors: Array.from(labMap.values()),
    machines: Array.from(macMap.values())
  };
}

/**
 * Bảng 3.1 Thông tư 11/2021/TT-BXD: Tỷ lệ chi phí chung (%) tính trên chi phí trực tiếp (T) theo quy mô chi phí trực tiếp
 * Các mốc quy mô: <= 15 tỷ, 50 tỷ, 100 tỷ, 500 tỷ, 1000 tỷ, > 1000 tỷ đồng
 */
export const CIRCULAR_11_GENERAL_COST_SCALE: Record<ProjectType, { threshold: number; rate: number }[]> = {
  civil: [
    { threshold: 15e9, rate: 0.073 },
    { threshold: 50e9, rate: 0.069 },
    { threshold: 100e9, rate: 0.064 },
    { threshold: 500e9, rate: 0.056 },
    { threshold: 1000e9, rate: 0.050 },
    { threshold: Infinity, rate: 0.044 },
  ],
  industrial: [
    { threshold: 15e9, rate: 0.062 },
    { threshold: 50e9, rate: 0.058 },
    { threshold: 100e9, rate: 0.055 },
    { threshold: 500e9, rate: 0.050 },
    { threshold: 1000e9, rate: 0.045 },
    { threshold: Infinity, rate: 0.041 },
  ],
  transport: [
    { threshold: 15e9, rate: 0.055 },
    { threshold: 50e9, rate: 0.052 },
    { threshold: 100e9, rate: 0.049 },
    { threshold: 500e9, rate: 0.045 },
    { threshold: 1000e9, rate: 0.041 },
    { threshold: Infinity, rate: 0.038 },
  ],
  agriculture: [
    { threshold: 15e9, rate: 0.058 },
    { threshold: 50e9, rate: 0.055 },
    { threshold: 100e9, rate: 0.052 },
    { threshold: 500e9, rate: 0.047 },
    { threshold: 1000e9, rate: 0.043 },
    { threshold: Infinity, rate: 0.040 },
  ],
  infrastructure: [
    { threshold: 15e9, rate: 0.050 },
    { threshold: 50e9, rate: 0.047 },
    { threshold: 100e9, rate: 0.044 },
    { threshold: 500e9, rate: 0.040 },
    { threshold: 1000e9, rate: 0.037 },
    { threshold: Infinity, rate: 0.034 },
  ]
};

/**
 * Tự động nội suy tuyến tính định mức tỷ lệ Chi phí chung theo Bảng 3.1 Thông tư 11/2021/TT-BXD
 * Công thức Bộ Xây dựng: Ki = Ka - [(Ka - Kb) * (Ti - Ta)] / (Tb - Ta)
 */
export function interpolateGeneralCostRate(projectType: ProjectType, directCostT: number): number {
  const scales = CIRCULAR_11_GENERAL_COST_SCALE[projectType] || CIRCULAR_11_GENERAL_COST_SCALE.civil;
  if (directCostT <= scales[0].threshold) {
    return scales[0].rate;
  }
  for (let i = 0; i < scales.length - 1; i++) {
    const lower = scales[i];
    const upper = scales[i + 1];
    if (directCostT <= upper.threshold) {
      const rate = lower.rate - ((lower.rate - upper.rate) * (directCostT - lower.threshold)) / (upper.threshold - lower.threshold);
      return Math.round(rate * 10000) / 10000;
    }
  }
  return scales[scales.length - 1].rate;
}

/**
 * Lấy mô tả khoảng quy mô chi phí trực tiếp T
 */
export function getScaleDescription(directCostT: number): string {
  if (directCostT <= 15e9) return 'T ≤ 15 tỷ VNĐ (Định mức trần TT 11)';
  if (directCostT <= 50e9) return '15 tỷ < T ≤ 50 tỷ VNĐ (Nội suy tuyến tính)';
  if (directCostT <= 100e9) return '50 tỷ < T ≤ 100 tỷ VNĐ (Nội suy tuyến tính)';
  if (directCostT <= 500e9) return '100 tỷ < T ≤ 500 tỷ VNĐ (Nội suy tuyến tính)';
  if (directCostT <= 1000e9) return '500 tỷ < T ≤ 1.000 tỷ VNĐ (Nội suy tuyến tính)';
  return 'T > 1.000 tỷ VNĐ (Khung quy mô lớn TT 11)';
}

/**
 * Định mức chi phí gián tiếp theo Thông tư 11/2021/TT-BXD & TT 14/2023/TT-BXD
 */
export function getCostRatios(
  projectType: ProjectType,
  directCostT?: number,
  isLineProject: boolean = false
) {
  let generalCostRate: number;
  if (directCostT !== undefined && directCostT > 0) {
    generalCostRate = interpolateGeneralCostRate(projectType, directCostT);
  } else {
    switch (projectType) {
      case 'civil': generalCostRate = 0.073; break;
      case 'industrial': generalCostRate = 0.062; break;
      case 'transport': generalCostRate = 0.055; break;
      case 'infrastructure': generalCostRate = 0.050; break;
      case 'agriculture': generalCostRate = 0.058; break;
      default: generalCostRate = 0.073; break;
    }
  }

  // Nhà tạm theo tuyến (giao thông, thủy lợi, đường ống) là 2.2%, công trình khác là 1.2% (hoặc 1.1% cho hạ tầng)
  let temporaryCampRate = 0.012;
  if (isLineProject) {
    temporaryCampRate = 0.022;
  } else if (projectType === 'transport' || projectType === 'infrastructure') {
    temporaryCampRate = 0.011;
  }

  const unallocatedWorkRate = 0.015; // 1.5% công tác không xác định từ thiết kế
  const taxableProfitRate = 0.055; // 5.5% thu nhập chịu thuế tính trước

  return { generalCostRate, temporaryCampRate, unallocatedWorkRate, taxableProfitRate };
}

export interface DetailedUnitPrice {
  workItemId: string;
  code: string;
  name: string;
  unit: string;
  directCost: number; // T = VL + NC + M
  materialCost: number;
  laborCost: number;
  machineCost: number;
  generalCost: number; // Chi phí chung
  temporaryCampCost: number; // Nhà tạm
  unallocatedCost: number; // Không xác định
  indirectCostTotal: number; // GT
  taxableProfit: number; // TL
  unitPricePreTax: number; // Đơn giá trước thuế (G)
  vatAmount: number; // VAT
  unitPricePostTax: number; // Đơn giá sau thuế
}

export function computeDetailedUnitPrices(items: WorkItem[], settings: ProjectSettings): DetailedUnitPrice[] {
  const ratios = getCostRatios(settings.projectType);
  return items.map(item => {
    const mat = Number(item.unitPriceMaterial) || 0;
    const lab = Number(item.unitPriceLabor) || 0;
    const mac = Number(item.unitPriceMachine) || 0;
    const T = mat + lab + mac;

    const generalCost = T * ratios.generalCostRate;
    const tempCamp = T * ratios.temporaryCampRate;
    const unallocated = T * ratios.unallocatedWorkRate;
    const GT = generalCost + tempCamp + unallocated;

    const TL = (T + GT) * ratios.taxableProfitRate;
    const G = T + GT + TL;
    const vat = G * settings.vatRate;
    const totalPost = G + vat;

    return {
      workItemId: item.id,
      code: item.code,
      name: item.name,
      unit: item.unit,
      directCost: T,
      materialCost: mat,
      laborCost: lab,
      machineCost: mac,
      generalCost,
      temporaryCampCost: tempCamp,
      unallocatedCost: unallocated,
      indirectCostTotal: GT,
      taxableProfit: TL,
      unitPricePreTax: G,
      vatAmount: vat,
      unitPricePostTax: totalPost
    };
  });
}

export interface THKPResult {
  directMaterial: number;
  directLabor: number;
  directMachine: number;
  directCostTotal: number; // T
  diffMaterial: number; // Bù giá VL tháng
  diffLabor: number; // Bù giá NC
  diffMachine: number; // Bù giá Máy
  generalCostRate: number; // Tỷ lệ Chi phí chung thực tế
  generalCost: number; // Chi phí chung
  temporaryCampRate: number; // Tỷ lệ Nhà tạm
  temporaryCampCost: number; // Nhà tạm
  unallocatedWorkRate: number; // Tỷ lệ KTXĐ
  unallocatedCost: number; // Không xác định
  indirectCostTotal: number; // GT
  taxableProfitRate: number; // Tỷ lệ thu nhập chịu thuế tính trước
  taxableProfit: number; // TL
  preTaxTotal: number; // G
  vatRate: number;
  vatAmount: number;
  constructionTotal: number; // G_xd
  contingencyRate: number;
  contingencyCost: number; // Chi phí dự phòng 5%
  grandTotal: number; // Tổng mức đầu tư dự toán
  isLineProject: boolean;
  calculationMethod: IndirectCostMethod;
  isInterpolated: boolean;
  scaleDescription: string;
  categoryBreakdown: CategoryIndirectCost[];
}

export function computeTHKP(
  items: WorkItem[], 
  settings: ProjectSettings, 
  categories?: Category[]
): THKPResult {
  let directMat = 0;
  let directLab = 0;
  let directMac = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    directMat += qty * (Number(item.unitPriceMaterial) || 0);
    directLab += qty * (Number(item.unitPriceLabor) || 0);
    directMac += qty * (Number(item.unitPriceMachine) || 0);
  }

  // Lấy chênh lệch giá tháng từ phân tích vật tư
  const aggregated = aggregateMaterials(items);
  const diffMat = aggregated.materials.reduce((sum, m) => sum + m.diffAmount, 0);
  const diffLab = aggregated.labors.reduce((sum, l) => sum + l.diffAmount, 0);
  const diffMac = aggregated.machines.reduce((sum, m) => sum + m.diffAmount, 0);

  const T = directMat + directLab + directMac + diffMat + diffLab + diffMac;

  const config = settings.indirectCostConfig;
  const method: IndirectCostMethod = config?.method || 'by_scale';
  const isLineProject = Boolean(config?.isLineProject);

  // Tính tỷ lệ nội suy theo quy mô T
  const interpolatedRate = interpolateGeneralCostRate(settings.projectType, T);
  const scaleDescription = getScaleDescription(T);

  // Chuẩn bị danh mục hạng mục
  const catList: Category[] = categories && categories.length > 0 
    ? categories 
    : [
        { id: 'cat-1', name: 'Hạng mục 1: Phần móng & ngầm' },
        { id: 'cat-2', name: 'Hạng mục 2: Phần thân BTCT' },
        { id: 'cat-3', name: 'Hạng mục 3: Hoàn thiện & M&E' }
      ];

  const categoryBreakdown: CategoryIndirectCost[] = [];

  let generalCost = 0;
  let tempCamp = 0;
  let unallocated = 0;
  let GT = 0;
  let TL = 0;
  let effectiveGeneralRate = interpolatedRate;
  let effectiveTempCampRate = isLineProject ? 0.022 : (settings.projectType === 'transport' || settings.projectType === 'infrastructure' ? 0.011 : 0.012);
  let effectiveUnallocatedRate = 0.015;
  let effectiveTaxableRate = 0.055;

  if (method === 'by_category') {
    // 1. CHẾ ĐỘ TÍNH THEO DANH MỤC CÔNG VIỆC / HẠNG MỤC ĐƯỢC CHỌN
    for (const cat of catList) {
      const catItems = items.filter(it => it.categoryId === cat.id);
      let catDirect = 0;
      for (const it of catItems) {
        const qty = Number(it.quantity) || 0;
        catDirect += qty * (
          (Number(it.unitPriceMaterial) || 0) + 
          (Number(it.unitPriceLabor) || 0) + 
          (Number(it.unitPriceMachine) || 0)
        );
      }

      // Loại công trình riêng của hạng mục
      const catType = config?.categorySettings?.[cat.id]?.projectType || cat.projectType || settings.projectType;
      
      // Tỷ lệ chi phí chung của hạng mục
      const catGeneralRate = config?.categorySettings?.[cat.id]?.generalCostRate ?? 
        (cat.generalCostRate ?? interpolateGeneralCostRate(catType, catDirect > 0 ? catDirect : T));
      
      const catTempCampRate = isLineProject ? 0.022 : (catType === 'transport' || catType === 'infrastructure' ? 0.011 : 0.012);
      const catUnallocatedRate = 0.015;
      const catTaxableRate = config?.categorySettings?.[cat.id]?.taxableProfitRate ?? (cat.taxableProfitRate ?? 0.055);

      const catC = catDirect * catGeneralRate;
      const catNT = catDirect * catTempCampRate;
      const catKTXD = catDirect * catUnallocatedRate;
      const catGT = catC + catNT + catKTXD;
      const catTL = (catDirect + catGT) * catTaxableRate;

      generalCost += catC;
      tempCamp += catNT;
      unallocated += catKTXD;
      GT += catGT;
      TL += catTL;

      categoryBreakdown.push({
        categoryId: cat.id,
        categoryName: cat.name,
        projectType: catType,
        directCost: catDirect,
        generalCostRate: catGeneralRate,
        generalCost: catC,
        temporaryCampRate: catTempCampRate,
        temporaryCampCost: catNT,
        unallocatedWorkRate: catUnallocatedRate,
        unallocatedWorkCost: catKTXD,
        indirectCostTotal: catGT,
        taxableProfitRate: catTaxableRate,
        taxableProfit: catTL,
      });
    }

    if (T > 0) {
      effectiveGeneralRate = generalCost / T;
      effectiveTempCampRate = tempCamp / T;
      effectiveUnallocatedRate = unallocated / T;
      effectiveTaxableRate = (T + GT) > 0 ? TL / (T + GT) : 0.055;
    }
  } else {
    // 2. CHẾ ĐỘ NỘI SUY TỰ ĐỘNG THEO QUY MÔ HOẶC THEO LOẠI CÔNG TRÌNH
    effectiveGeneralRate = config?.customGeneralRate !== undefined ? config.customGeneralRate : interpolatedRate;
    effectiveTempCampRate = config?.customTempCampRate !== undefined 
      ? config.customTempCampRate 
      : (isLineProject ? 0.022 : (settings.projectType === 'transport' || settings.projectType === 'infrastructure' ? 0.011 : 0.012));
    effectiveUnallocatedRate = config?.customUnallocatedRate !== undefined ? config.customUnallocatedRate : 0.015;
    effectiveTaxableRate = config?.customTaxableProfitRate !== undefined ? config.customTaxableProfitRate : 0.055;

    generalCost = T * effectiveGeneralRate;
    tempCamp = T * effectiveTempCampRate;
    unallocated = T * effectiveUnallocatedRate;
    GT = generalCost + tempCamp + unallocated;
    TL = (T + GT) * effectiveTaxableRate;

    // Phân bổ tỷ lệ cho từng hạng mục để người dùng tiện theo dõi
    for (const cat of catList) {
      const catItems = items.filter(it => it.categoryId === cat.id);
      let catDirect = 0;
      for (const it of catItems) {
        const qty = Number(it.quantity) || 0;
        catDirect += qty * (
          (Number(it.unitPriceMaterial) || 0) + 
          (Number(it.unitPriceLabor) || 0) + 
          (Number(it.unitPriceMachine) || 0)
        );
      }

      const catC = catDirect * effectiveGeneralRate;
      const catNT = catDirect * effectiveTempCampRate;
      const catKTXD = catDirect * effectiveUnallocatedRate;
      const catGT = catC + catNT + catKTXD;
      const catTL = (catDirect + catGT) * effectiveTaxableRate;

      categoryBreakdown.push({
        categoryId: cat.id,
        categoryName: cat.name,
        projectType: settings.projectType,
        directCost: catDirect,
        generalCostRate: effectiveGeneralRate,
        generalCost: catC,
        temporaryCampRate: effectiveTempCampRate,
        temporaryCampCost: catNT,
        unallocatedWorkRate: effectiveUnallocatedRate,
        unallocatedWorkCost: catKTXD,
        indirectCostTotal: catGT,
        taxableProfitRate: effectiveTaxableRate,
        taxableProfit: catTL,
      });
    }
  }

  const G = T + GT + TL;
  const vat = G * settings.vatRate;
  const G_xd = G + vat;
  const contingencyRate = 0.05; // 5% dự phòng trượt giá & phát sinh theo luật XD
  const contingencyCost = G_xd * contingencyRate;
  const grandTotal = G_xd + contingencyCost;

  return {
    directMaterial: directMat,
    directLabor: directLab,
    directMachine: directMac,
    directCostTotal: T,
    diffMaterial: diffMat,
    diffLabor: diffLab,
    diffMachine: diffMac,
    generalCostRate: effectiveGeneralRate,
    generalCost,
    temporaryCampRate: effectiveTempCampRate,
    temporaryCampCost: tempCamp,
    unallocatedWorkRate: effectiveUnallocatedRate,
    unallocatedCost: unallocated,
    indirectCostTotal: GT,
    taxableProfitRate: effectiveTaxableRate,
    taxableProfit: TL,
    preTaxTotal: G,
    vatRate: settings.vatRate,
    vatAmount: vat,
    constructionTotal: G_xd,
    contingencyRate,
    contingencyCost,
    grandTotal,
    isLineProject,
    calculationMethod: method,
    isInterpolated: method === 'by_scale',
    scaleDescription,
    categoryBreakdown
  };
}

/**
 * Định dạng số theo chuẩn hiển thị tiền tệ Việt Nam (1.234.567)
 */
export function formatVND(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return Math.round(val).toLocaleString('vi-VN');
}

/**
 * Định dạng số thập phân khối lượng (ví dụ: 12.345)
 */
export function formatQuantity(val: number, decimals: number = 3): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  return rounded.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}
