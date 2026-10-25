"""
Dự toán F1 Pro - Gói phần mềm tính toán dự toán, dự thầu, thẩm tra và thanh quyết toán công trình
Tuân thủ tiêu chuẩn định mức Bộ Xây dựng Việt Nam
"""

from .constants import VERSION, AUTHOR, LEGAL_BASIS, INDIRECT_COST_RATES
from .provinces import PROVINCES_63, get_province_by_id, get_all_provinces
from .norms_database import NORMS_CATALOG, search_norms, get_norm_by_code
from .models import (
    WorkItem, Category, SubCalculation, MaterialBreakdown,
    LaborBreakdown, MachineBreakdown, ProjectSettings,
    AuditDiffItem, SettlementItem, GanttTask, BiddingForm
)
from .calculator import (
    evaluate_math_expression, recalculate_work_item,
    aggregate_materials, compute_detailed_unit_prices,
    compute_thkp, audit_project, calculate_settlement_summary
)
from .database import F1Database
from .exporters import export_project_to_excel_xml, export_project_to_json

__version__ = VERSION
__author__ = AUTHOR
