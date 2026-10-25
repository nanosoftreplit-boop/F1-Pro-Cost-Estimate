"""
Dự toán F1 Pro - Data Models & Schema Definitions
Tương thích hoàn toàn với cấu trúc dữ liệu JSON và cơ sở dữ liệu SQLite
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field, asdict

@dataclass
class SubCalculation:
    """Diễn giải khối lượng chi tiết từng cấu kiện (dài x rộng x cao x số lượng)"""
    id: str
    description: str
    expression: str
    quantity: float
    work_item_id: Optional[str] = None

@dataclass
class MaterialBreakdown:
    code: str
    name: str
    unit: str
    quota: float          # Hao phí định mức cho 1 đơn vị công tác
    original_price: float # Giá gốc dự toán
    current_price: float  # Giá hiện trường / Giá thông báo tháng
    id: Optional[str] = None
    work_item_id: Optional[str] = None

@dataclass
class LaborBreakdown:
    grade: str            # Bậc thợ (ví dụ 3.5/7, 4.0/7)
    days: float           # Số công thợ định mức
    wage_per_day: float   # Đơn giá ngày công
    id: Optional[str] = None
    work_item_id: Optional[str] = None

@dataclass
class MachineBreakdown:
    machine_type: str
    shifts: float         # Số ca máy định mức
    shift_price: float    # Giá 1 ca máy
    id: Optional[str] = None
    work_item_id: Optional[str] = None

@dataclass
class WorkItem:
    """Công tác xây dựng dự toán (Đơn giá xây dựng công trình)"""
    id: str
    category_id: str
    code: str
    name: str
    unit: str
    quantity: float
    material_cost: float = 0.0
    labor_cost: float = 0.0
    machine_cost: float = 0.0
    total_unit_price: float = 0.0
    total_amount: float = 0.0
    project_id: Optional[str] = None
    sort_order: Optional[int] = 0
    sub_calculations: List[SubCalculation] = field(default_factory=list)
    materials: List[MaterialBreakdown] = field(default_factory=list)
    labor: Optional[LaborBreakdown] = None
    machinery: List[MachineBreakdown] = field(default_factory=list)

@dataclass
class Category:
    """Hạng mục công trình (Phần móng, Phần thân, Hoàn thiện...)"""
    id: str
    code: str
    name: str
    order: int = 0
    sort_order: int = 0
    project_id: Optional[str] = None

@dataclass
class ProjectSettings:
    """Thông số cấu hình dự án & căn cứ pháp lý"""
    project_name: str
    investor: str
    contractor: str
    location: str
    province_id: str
    project_type: str = 'civil' # 'civil' | 'industrial' | 'traffic' | 'agriculture' | 'infrastructure'
    vat_rate: float = 0.10
    labor_coefficient: float = 1.0
    machine_coefficient: float = 1.0
    gasoline_price: float = 22800
    diesel_price: float = 20500
    electricity_price: float = 2006
    standard_norm: str = "Thông tư 12/2021/TT-BXD"
    standard_cost: str = "Thông tư 11/2021/TT-BXD & TT 14/2023/TT-BXD"

@dataclass
class AuditDiffItem:
    """Hồ sơ thẩm tra công trình - Kiểm tra sai lệch định mức, đơn giá, khối lượng"""
    id: str
    code: str
    name: str
    unit: str
    submitted_quantity: float
    audited_quantity: float
    submitted_price: float
    audited_price: float
    diff_quantity: float
    diff_price: float
    diff_amount: float
    status: str            # 'matched' | 'warning' | 'rejected'
    reason: str
    project_id: Optional[str] = None

@dataclass
class SettlementItem:
    """Thanh quyết toán hợp đồng - Phụ lục 03.a & Phụ lục 03.b theo Nghị định 99/2021/NĐ-CP"""
    id: str
    code: str
    name: str
    unit: str
    contract_quantity: float
    contract_price: float
    accum_prev_quantity: float
    current_period_quantity: float
    accum_total_quantity: float
    current_period_amount: float
    accum_total_amount: float
    annex_type: str = '03a' # '03a' (trong hợp đồng) | '03b' (phát sinh ngoài hợp đồng)
    project_id: Optional[str] = None

@dataclass
class GanttTask:
    """Tiến độ thi công công trình"""
    id: str
    name: str
    start_day: int
    duration_days: int
    progress_percent: int
    predecessor: Optional[str] = None
    crew_size: int = 10
    project_id: Optional[str] = None

@dataclass
class BiddingForm:
    """Đấu thầu online qua mạng E-GP Quốc gia"""
    package_name: str
    bidder_name: str
    solicitation_number: str
    submission_deadline: str
    guarantee_amount: float
    discount_rate: float
    submission_status: str
