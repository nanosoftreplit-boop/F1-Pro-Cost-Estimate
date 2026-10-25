"""
Dự toán F1 Pro - Engine tính toán số học, hao phí định mức & Tổng hợp kinh phí
Tuân thủ tuyệt đối:
- Thông tư 12/2021/TT-BXD (Định mức)
- Thông tư 11/2021/TT-BXD & Thông tư 14/2023/TT-BXD (Quản lý chi phí)
- Nghị định 10/2021/NĐ-CP (Tổng mức đầu tư)
- Nghị định 99/2021/NĐ-CP (Thanh quyết toán hợp đồng)
"""

import ast
import operator
import math
from typing import List, Dict, Any, Tuple, Optional
from .constants import (
    INDIRECT_COST_RATES,
    GENERAL_COST_SCALE_TT11,
    VAT_RATE_DEFAULT,
    CONTINGENCY_VOLUME_RATE,
    CONTINGENCY_SLIPPAGE_RATE,
    PROJECT_MANAGEMENT_RATE,
    CONSULTANCY_COST_RATE,
    OTHER_COST_RATE
)
from .models import WorkItem, ProjectSettings, SettlementItem, AuditDiffItem

# An toàn tính biểu thức toán học diễn giải khối lượng
SAFE_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def evaluate_math_expression(expr: str) -> float:
    """
    Tính toán an toàn chuỗi biểu thức diễn giải kích thước hình học
    Ví dụ: '12 * 1.8 * 1.8 * 1.2', '4 * (2.5 + 3.2) * 0.22', '2.5 * 10.5 / 2'
    """
    if not expr or not expr.strip():
        return 0.0

    cleaned = expr.replace(',', '.').replace('x', '*').replace('X', '*').strip()
    try:
        def _eval(node):
            if isinstance(node, ast.Constant):
                return float(node.value)
            elif isinstance(node, ast.BinOp):
                op_type = type(node.op)
                if op_type in SAFE_OPERATORS:
                    left = _eval(node.left)
                    right = _eval(node.right)
                    return SAFE_OPERATORS[op_type](left, right)
                raise ValueError(f"Toán tử không hỗ trợ: {op_type}")
            elif isinstance(node, ast.UnaryOp):
                op_type = type(node.op)
                if op_type in SAFE_OPERATORS:
                    return SAFE_OPERATORS[op_type](_eval(node.operand))
                raise ValueError("Toán tử một ngôi không hỗ trợ")
            elif isinstance(node, ast.Expression):
                return _eval(node.body)
            raise ValueError("Cấu trúc biểu thức không hợp lệ")

        tree = ast.parse(cleaned, mode='eval')
        res = _eval(tree)
        return round(float(res), 4)
    except Exception:
        return 0.0

def recalculate_work_item(item: WorkItem, settings: ProjectSettings) -> WorkItem:
    """
    Tự động tính toán lại đơn giá và thành tiền của công tác xây dựng
    Áp dụng hệ số điều chỉnh nhân công, máy thi công theo địa bàn tỉnh thành
    """
    # 1. Tính tổng khối lượng từ diễn giải chi tiết nếu có
    if item.sub_calculations and len(item.sub_calculations) > 0:
        total_qty = 0.0
        for sub in item.sub_calculations:
            sub.quantity = evaluate_math_expression(sub.expression)
            total_qty += sub.quantity
        item.quantity = round(total_qty, 4)

    # 2. Chi phí vật liệu
    mat_cost = 0.0
    for m in item.materials:
        p = m.current_price if m.current_price > 0 else m.original_price
        mat_cost += m.quota * p
    item.material_cost = round(mat_cost, 0)

    # 3. Chi phí nhân công (có áp dụng hệ số vùng)
    labor_cost = 0.0
    if item.labor:
        labor_cost = item.labor.days * item.labor.wage_per_day * settings.labor_coefficient
    item.labor_cost = round(labor_cost, 0)

    # 4. Chi phí máy thi công (có áp dụng hệ số máy)
    mac_cost = 0.0
    for mac in item.machinery:
        mac_cost += mac.shifts * mac.shift_price * settings.machine_coefficient
    item.machine_cost = round(mac_cost, 0)

    # 5. Đơn giá xây dựng công trình
    item.total_unit_price = item.material_cost + item.labor_cost + item.machine_cost
    item.total_amount = round(item.quantity * item.total_unit_price, 0)

    return item

def aggregate_materials(items: List[WorkItem]) -> Dict[str, Any]:
    """
    Tổng hợp vật tư (Vật liệu, Nhân công, Máy thi công) toàn bộ công trình
    Tính toán chênh lệch giá (bù giá vật tư) giữa giá gốc và giá thông báo tháng
    """
    materials_map: Dict[str, Dict[str, Any]] = {}
    labor_map: Dict[str, Dict[str, Any]] = {}
    machine_map: Dict[str, Dict[str, Any]] = {}

    for item in items:
        qty = item.quantity
        if qty <= 0:
            continue

        # Tổng hợp Vật liệu
        for m in item.materials:
            code = m.code
            if code not in materials_map:
                materials_map[code] = {
                    "code": code,
                    "name": m.name,
                    "unit": m.unit,
                    "total_quota": 0.0,
                    "original_price": m.original_price,
                    "current_price": m.current_price,
                    "original_total": 0.0,
                    "current_total": 0.0,
                    "diff_total": 0.0
                }
            mat_item = materials_map[code]
            mat_item["total_quota"] += m.quota * qty
            mat_item["original_total"] += m.quota * qty * m.original_price
            mat_item["current_total"] += m.quota * qty * (m.current_price if m.current_price > 0 else m.original_price)
            mat_item["diff_total"] = mat_item["current_total"] - mat_item["original_total"]

        # Tổng hợp Nhân công
        if item.labor:
            l = item.labor
            grade = l.grade
            if grade not in labor_map:
                labor_map[grade] = {
                    "grade": grade,
                    "name": f"Thợ bậc {grade}",
                    "unit": "công",
                    "total_days": 0.0,
                    "wage_per_day": l.wage_per_day,
                    "total_amount": 0.0
                }
            labor_item = labor_map[grade]
            labor_item["total_days"] += l.days * qty
            labor_item["total_amount"] += l.days * qty * l.wage_per_day

        # Tổng hợp Máy thi công
        for mac in item.machinery:
            name = mac.machine_type
            if name not in machine_map:
                machine_map[name] = {
                    "name": name,
                    "unit": "ca",
                    "total_shifts": 0.0,
                    "shift_price": mac.shift_price,
                    "total_amount": 0.0
                }
            mac_item = machine_map[name]
            mac_item["total_shifts"] += mac.shifts * qty
            mac_item["total_amount"] += mac.shifts * qty * mac.shift_price

    mat_list = list(materials_map.values())
    lab_list = list(labor_map.values())
    mac_list = list(machine_map.values())

    total_mat_original = sum(m["original_total"] for m in mat_list)
    total_mat_current = sum(m["current_total"] for m in mat_list)
    total_mat_diff = total_mat_current - total_mat_original

    total_labor = sum(l["total_amount"] for l in lab_list)
    total_machine = sum(m["total_amount"] for m in mac_list)

    return {
        "materials": mat_list,
        "labor": lab_list,
        "machinery": mac_list,
        "total_mat_original": total_mat_original,
        "total_mat_current": total_mat_current,
        "total_mat_diff": total_mat_diff,
        "total_labor": total_labor,
        "total_machine": total_machine,
        "total_cost": total_mat_current + total_labor + total_machine
    }

def compute_detailed_unit_prices(items: List[WorkItem], settings: ProjectSettings) -> List[Dict[str, Any]]:
    """
    Lập đơn giá chi tiết theo Thông tư 11/2021/TT-BXD
    Phân bổ Chi phí gián tiếp và Thu nhập chịu thuế tính trước vào từng đơn giá công tác
    """
    pt = settings.project_type
    rates = INDIRECT_COST_RATES.get(pt, INDIRECT_COST_RATES["civil"])
    k_gt = rates["general"] + rates["temp_house"] + rates["unspecified_work"]
    k_tl = rates["taxable_income"]

    detailed_prices = []
    for item in items:
        # Chi phí trực tiếp đơn vị
        t_unit = item.material_cost + item.labor_cost + item.machine_cost
        # Chi phí gián tiếp đơn vị
        gt_unit = t_unit * k_gt
        # Thu nhập chịu thuế tính trước đơn vị
        tl_unit = (t_unit + gt_unit) * k_tl
        # Đơn giá dự thầu đầy đủ trước thuế
        dg_bid = t_unit + gt_unit + tl_unit

        detailed_prices.append({
            "item_id": item.id,
            "code": item.code,
            "name": item.name,
            "unit": item.unit,
            "quantity": item.quantity,
            "material_cost": item.material_cost,
            "labor_cost": item.labor_cost,
            "machine_cost": item.machine_cost,
            "direct_cost": t_unit,
            "indirect_cost": round(gt_unit, 0),
            "taxable_income": round(tl_unit, 0),
            "unit_bid_price": round(dg_bid, 0),
            "total_bid_amount": round(dg_bid * item.quantity, 0)
        })

    return detailed_prices

def interpolate_general_cost_rate(project_type: str, direct_cost_T: float) -> float:
    """Nội suy tuyến tính tỷ lệ chi phí chung theo Bảng 3.1 Thông tư 11/2021/TT-BXD"""
    scales = GENERAL_COST_SCALE_TT11.get(project_type, GENERAL_COST_SCALE_TT11["civil"])
    if direct_cost_T <= scales[0][0]:
        return scales[0][1]
    for i in range(len(scales) - 1):
        lower = scales[i]
        upper = scales[i + 1]
        if direct_cost_T <= upper[0]:
            rate = lower[1] - ((lower[1] - upper[1]) * (direct_cost_T - lower[0])) / (upper[0] - lower[0])
            return round(rate, 4)
    return scales[-1][1]

def compute_thkp(items: List[WorkItem], settings: ProjectSettings, categories: Optional[List[Any]] = None) -> Dict[str, Any]:
    """
    Bảng Tổng Hợp Kinh Phí (THKP) & Tổng Mức Đầu Tư Công Trình
    Tuân thủ Bảng 3.1 & 3.2 Thông tư 11/2021/TT-BXD và Nghị định 10/2021/NĐ-CP
    Tự động hóa tính Chi phí gián tiếp (chung, nhà tạm, KTXĐ, TL) theo quy mô và danh mục công việc
    """
    # 1. Chi phí trực tiếp (T)
    total_vl = sum(item.quantity * item.material_cost for item in items)
    total_nc = sum(item.quantity * item.labor_cost for item in items)
    total_mtc = sum(item.quantity * item.machine_cost for item in items)
    T = total_vl + total_nc + total_mtc

    # Lấy hệ số theo loại công trình & nội suy theo quy mô T
    pt = settings.project_type
    rates = INDIRECT_COST_RATES.get(pt, INDIRECT_COST_RATES["civil"])
    interpolated_general_rate = interpolate_general_cost_rate(pt, T)

    # 2. Chi phí gián tiếp (GT)
    chi_phi_chung = T * interpolated_general_rate
    nha_tam = T * rates["temp_house"]
    khong_xac_dinh = T * rates["unspecified_work"]
    GT = chi_phi_chung + nha_tam + khong_xac_dinh

    # 3. Thu nhập chịu thuế tính trước (TL)
    TL = (T + GT) * rates["taxable_income"]

    # 4. Chi phí xây dựng trước thuế (G)
    G = T + GT + TL

    # 5. Thuế GTGT (VAT)
    vat_rate = settings.vat_rate if settings.vat_rate > 0 else VAT_RATE_DEFAULT
    VAT = G * vat_rate

    # 6. Chi phí xây dựng sau thuế (Gxd)
    Gxd = G + VAT

    # 7. Chi phí thiết bị (Gtb)
    Gtb = 0.0

    # 8. Chi phí quản lý dự án (Gqlda)
    Gqlda = (Gxd + Gtb) * PROJECT_MANAGEMENT_RATE

    # 9. Chi phí tư vấn đầu tư xây dựng (Gtv)
    Gtv = (Gxd + Gtb) * CONSULTANCY_COST_RATE

    # 10. Chi phí khác (Gk)
    Gk = (Gxd + Gtb) * OTHER_COST_RATE

    # 11. Chi phí dự phòng (Gdp)
    base_dp = Gxd + Gtb + Gqlda + Gtv + Gk
    Gdp1 = base_dp * CONTINGENCY_VOLUME_RATE   # Khối lượng phát sinh 5%
    Gdp2 = base_dp * CONTINGENCY_SLIPPAGE_RATE # Trượt giá 3%
    Gdp = Gdp1 + Gdp2

    # 12. Tổng mức đầu tư (TMĐT)
    TMDT = Gxd + Gtb + Gqlda + Gtv + Gk + Gdp

    return {
        "project_name": settings.project_name,
        "location": settings.location,
        "project_type": pt,
        "project_type_name": rates["name"],
        "direct_cost": {
            "materials": round(total_vl, 0),
            "labor": round(total_nc, 0),
            "machinery": round(total_mtc, 0),
            "total_T": round(T, 0)
        },
        "indirect_cost": {
            "general": round(chi_phi_chung, 0),
            "temp_house": round(nha_tam, 0),
            "unspecified": round(khong_xac_dinh, 0),
            "total_GT": round(GT, 0)
        },
        "taxable_income": round(TL, 0),
        "construction_before_tax": round(G, 0),
        "vat_rate": vat_rate,
        "vat_amount": round(VAT, 0),
        "construction_after_tax_Gxd": round(Gxd, 0),
        "equipment_cost_Gtb": round(Gtb, 0),
        "project_management_Gqlda": round(Gqlda, 0),
        "consultancy_cost_Gtv": round(Gtv, 0),
        "other_cost_Gk": round(Gk, 0),
        "contingency_Gdp": {
            "volume_Gdp1": round(Gdp1, 0),
            "slippage_Gdp2": round(Gdp2, 0),
            "total_Gdp": round(Gdp, 0)
        },
        "total_investment_TMDT": round(TMDT, 0)
    }

def audit_project(submitted_items: List[WorkItem], audited_items: List[WorkItem]) -> List[AuditDiffItem]:
    """
    Thẩm tra công trình: Đối chiếu sai lệch định mức, đơn giá, khối lượng giữa hồ sơ trình duyệt và hồ sơ thẩm tra
    """
    diff_list: List[AuditDiffItem] = []
    audited_map = {item.code: item for item in audited_items}

    for sub in submitted_items:
        aud = audited_map.get(sub.code)
        if not aud:
            diff_list.append(AuditDiffItem(
                id=f"audit_{sub.id}",
                code=sub.code,
                name=sub.name,
                unit=sub.unit,
                submitted_quantity=sub.quantity,
                audited_quantity=0,
                submitted_price=sub.total_unit_price,
                audited_price=0,
                diff_quantity=-sub.quantity,
                diff_price=-sub.total_unit_price,
                diff_amount=-sub.total_amount,
                status="rejected",
                reason="Công tác không có trong hồ sơ thiết kế được duyệt"
            ))
            continue

        diff_q = aud.quantity - sub.quantity
        diff_p = aud.total_unit_price - sub.total_unit_price
        diff_amt = (aud.quantity * aud.total_unit_price) - (sub.quantity * sub.total_unit_price)

        status = "matched"
        reason = "Khớp định mức và khối lượng"
        if abs(diff_q) > 0.001 or abs(diff_p) > 10:
            status = "warning"
            reasons = []
            if abs(diff_q) > 0.001:
                reasons.append(f"Sai lệch KL: {diff_q:+.2f} {sub.unit}")
            if abs(diff_p) > 10:
                reasons.append(f"Sai lệch đơn giá: {diff_p:+,.0f} đ")
            reason = " | ".join(reasons)

        diff_list.append(AuditDiffItem(
            id=f"audit_{sub.id}",
            code=sub.code,
            name=sub.name,
            unit=sub.unit,
            submitted_quantity=sub.quantity,
            audited_quantity=aud.quantity,
            submitted_price=sub.total_unit_price,
            audited_price=aud.total_unit_price,
            diff_quantity=diff_q,
            diff_price=diff_p,
            diff_amount=diff_amt,
            status=status,
            reason=reason
        ))

    return diff_list

def calculate_settlement_summary(items: List[SettlementItem], advance_amount: float = 0.0) -> Dict[str, Any]:
    """
    Tính toán tổng hợp giá trị thanh quyết toán Phụ lục 03.a & 03.b theo Nghị định 99/2021/NĐ-CP
    """
    annex_03a = [it for it in items if it.annex_type == '03a']
    annex_03b = [it for it in items if it.annex_type == '03b']

    contract_value = sum(it.contract_quantity * it.contract_price for it in annex_03a)
    
    current_03a = sum(it.current_period_amount for it in annex_03a)
    current_03b = sum(it.current_period_amount for it in annex_03b)
    total_current = current_03a + current_03b

    accum_03a = sum(it.accum_total_amount for it in annex_03a)
    accum_03b = sum(it.accum_total_amount for it in annex_03b)
    total_accum = accum_03a + accum_03b

    # Thu hồi tạm ứng kỳ này (khoảng 15% giá trị nghiệm thu kỳ này)
    deduct_advance = round(total_current * 0.15, 0)
    # Giữ lại bảo hành công trình (5%)
    retention_warranty = round(total_current * 0.05, 0)
    # Số tiền thực chuyển kỳ này
    net_payable = total_current - deduct_advance - retention_warranty

    return {
        "contract_value": contract_value,
        "current_period_03a": current_03a,
        "current_period_03b": current_03b,
        "total_current_period": total_current,
        "accum_03a": accum_03a,
        "accum_03b": accum_03b,
        "total_accum": total_accum,
        "deduct_advance": deduct_advance,
        "retention_warranty": retention_warranty,
        "net_payable": net_payable
    }

# Các bí danh tương thích
aggregateMaterials = aggregate_materials
computeDetailedUnitPrices = compute_detailed_unit_prices
computeTHKP = compute_thkp
calculateSettlementSummary = calculate_settlement_summary
recalculateWorkItem = recalculate_work_item
evaluateMathExpression = evaluate_math_expression
auditProject = audit_project

