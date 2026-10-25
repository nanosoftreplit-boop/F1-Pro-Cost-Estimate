"""
Dự toán F1 Pro - Các hằng số, quy định, thông tư & tỷ lệ định mức
Áp dụng theo:
- Thông tư 12/2021/TT-BXD: Định mức xây dựng công trình
- Thông tư 11/2021/TT-BXD & Thông tư 14/2023/TT-BXD: Quản lý chi phí đầu tư xây dựng
- Nghị định 10/2021/NĐ-CP: Quản lý chi phí đầu tư xây dựng
- Nghị định 99/2021/NĐ-CP: Quản lý, thanh toán, quyết toán dự án sử dụng vốn đầu tư công
- Thông tư 13/2021/TT-BXD: Hướng dẫn xác định giá ca máy và đơn giá nhân công xây dựng
"""

from typing import Dict, Any

VERSION = "2.5.0"
AUTHOR = "Dự toán F1 Pro Team"
LEGAL_BASIS = "TT 12/2021/TT-BXD, TT 11/2021/TT-BXD, TT 14/2023/TT-BXD, NĐ 10/2021/NĐ-CP, NĐ 99/2021/NĐ-CP"

# Định mức tỷ lệ chi phí gián tiếp theo Thông tư 11/2021/TT-BXD (Bảng 3.1)
# Tính theo % trên Chi phí trực tiếp (T)
INDIRECT_COST_RATES: Dict[str, Dict[str, float]] = {
    "civil": {
        "name": "Công trình dân dụng",
        "general": 0.073,          # Chi phí chung: 7.3% của T
        "temp_house": 0.012,       # Chi phí nhà tạm để ở và điều hành thi công: 1.2%
        "unspecified_work": 0.015, # Chi phí một số công tác không xác định từ thiết kế: 1.5%
        "taxable_income": 0.055,   # Thu nhập chịu thuế tính trước: 5.5% của (T + GT)
    },
    "industrial": {
        "name": "Công trình công nghiệp",
        "general": 0.062,
        "temp_house": 0.012,
        "unspecified_work": 0.015,
        "taxable_income": 0.055,
    },
    "traffic": {
        "name": "Công trình giao thông",
        "general": 0.056,
        "temp_house": 0.011,
        "unspecified_work": 0.015,
        "taxable_income": 0.055,
    },
    "agriculture": {
        "name": "Công trình nông nghiệp & PTNT",
        "general": 0.058,
        "temp_house": 0.012,
        "unspecified_work": 0.015,
        "taxable_income": 0.055,
    },
    "infrastructure": {
        "name": "Công trình hạ tầng kỹ thuật",
        "general": 0.050,
        "temp_house": 0.011,
        "unspecified_work": 0.015,
        "taxable_income": 0.055,
    }
}

# Bảng 3.1 Thông tư 11/2021/TT-BXD: Tỷ lệ chi phí chung (%) tính theo quy mô chi phí trực tiếp T (VNĐ)
GENERAL_COST_SCALE_TT11 = {
    "civil": [
        (15e9, 0.073),
        (50e9, 0.069),
        (100e9, 0.064),
        (500e9, 0.056),
        (1000e9, 0.050),
        (float('inf'), 0.044),
    ],
    "industrial": [
        (15e9, 0.062),
        (50e9, 0.058),
        (100e9, 0.055),
        (500e9, 0.050),
        (1000e9, 0.045),
        (float('inf'), 0.041),
    ],
    "traffic": [
        (15e9, 0.055),
        (50e9, 0.052),
        (100e9, 0.049),
        (500e9, 0.045),
        (1000e9, 0.041),
        (float('inf'), 0.038),
    ],
    "agriculture": [
        (15e9, 0.058),
        (50e9, 0.055),
        (100e9, 0.052),
        (500e9, 0.047),
        (1000e9, 0.043),
        (float('inf'), 0.040),
    ],
    "infrastructure": [
        (15e9, 0.050),
        (50e9, 0.047),
        (100e9, 0.044),
        (500e9, 0.040),
        (1000e9, 0.037),
        (float('inf'), 0.034),
    ]
}

# Thuế suất GTGT
VAT_RATE_DEFAULT = 0.10  # 10%
VAT_RATE_REDUCED = 0.08  # 8% (khi áp dụng chính sách giảm thuế)

# Chi phí dự phòng theo Thông tư 11/2021/TT-BXD
CONTINGENCY_VOLUME_RATE = 0.05  # Dự phòng yếu tố khối lượng công việc phát sinh (Gdp1): 5%
CONTINGENCY_SLIPPAGE_RATE = 0.03 # Dự phòng yếu tố trượt giá (Gdp2): 3%

# Tỷ lệ chi phí Quản lý dự án theo Thông tư 12/2021/TT-BXD (tùy theo quy mô chi phí xây dựng & thiết bị)
# Giá trị trung bình cho công trình nhóm B/C
PROJECT_MANAGEMENT_RATE = 0.025 # 2.5%

# Tỷ lệ chi phí Tư vấn đầu tư xây dựng (Khảo sát, thiết kế, thẩm tra, giám sát thi công...)
CONSULTANCY_COST_RATE = 0.065   # 6.5%

# Tỷ lệ chi phí khác (Bảo hiểm công trình, thẩm duyệt PCCC, kiểm toán...)
OTHER_COST_RATE = 0.020         # 2.0%

# Bảng phân nhóm thợ xây dựng theo Thông tư 13/2021/TT-BXD
LABOR_GROUPS = {
    1: "Nhóm I: Thợ xây, trát, ốp, lát, đào đất, đổ bê tông thủ công",
    2: "Nhóm II: Thợ cốt thép, mộc coppha, lắp ghép cấu kiện, vận hành máy xây dựng nhỏ",
    3: "Nhóm III: Thợ hàn, lắp dựng kết cấu thép, thợ lặn, công trình cầu lớn, hầm",
    4: "Nhóm IV: Thợ cơ khí chính xác, điện tử viễn thông, kiểm định chất lượng"
}
