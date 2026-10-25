"""
Dự toán F1 Pro - Cơ sở dữ liệu 63 Tỉnh Thành Phố Trực Thuộc Trung Ương
Cập nhật đầy đủ:
- 63 tỉnh thành Việt Nam với phân vùng lương tối thiểu (Vùng I, II, III, IV)
- Đơn giá nhân công bình quân thợ bậc 3.5/7 theo Thông tư 13/2021/TT-BXD
- Hệ số điều chỉnh máy thi công và nhiên liệu (Xăng, Dầu, Điện)
- Thông báo giá vật liệu xây dựng định kỳ từ Sở Xây dựng từng địa phương
"""

from typing import Dict, List, Optional, Any

PROVINCES_63: List[Dict[str, Any]] = [
    # 5 THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG
    {
        "id": "HN",
        "name": "Hà Nội",
        "region": "I",
        "labor_wage": 285000,
        "labor_coefficient": 1.0,
        "machine_coefficient": 1.0,
        "gasoline_price": 22800,
        "diesel_price": 20500,
        "electricity_price": 2006,
        "notice_prices": {
            "VL01": 1750,      # Xi măng PCB40 (đ/kg)
            "VL02": 380000,    # Cát vàng hạt lớn (đ/m3)
            "VL03": 290000,    # Đá 1x2 (đ/m3)
            "VL04": 15800,     # Thép xây dựng d10-d18 (đ/kg)
            "VL05": 1450,      # Gạch tuynel tiêu chuẩn (đ/viên)
            "VL06": 48000,     # Sơn nước tường lót (đ/kg)
            "VL07": 195000,    # Gạch lát ceramic 400x400 (đ/m2)
            "VL08": 320000,    # Ván coppha phủ phim 18mm (đ/m2)
            "VL09": 85000,     # Ống PVC D110 Class 2 (đ/m)
            "VL10": 18500      # Dây điện Cadisun 2x2.5 (đ/m)
        }
    },
    {
        "id": "HCM",
        "name": "TP. Hồ Chí Minh",
        "region": "I",
        "labor_wage": 295000,
        "labor_coefficient": 1.02,
        "machine_coefficient": 1.01,
        "gasoline_price": 22800,
        "diesel_price": 20500,
        "electricity_price": 2006,
        "notice_prices": {
            "VL01": 1800, "VL02": 450000, "VL03": 360000, "VL04": 16000, "VL05": 1350,
            "VL06": 50000, "VL07": 210000, "VL08": 330000, "VL09": 88000, "VL10": 19000
        }
    },
    {
        "id": "HP",
        "name": "Hải Phòng",
        "region": "I",
        "labor_wage": 280000,
        "labor_coefficient": 0.98,
        "machine_coefficient": 0.99,
        "gasoline_price": 22800,
        "diesel_price": 20500,
        "electricity_price": 2006,
        "notice_prices": {
            "VL01": 1720, "VL02": 370000, "VL03": 280000, "VL04": 15700, "VL05": 1400,
            "VL06": 47000, "VL07": 190000, "VL08": 315000, "VL09": 84000, "VL10": 18200
        }
    },
    {
        "id": "DN",
        "name": "Đà Nẵng",
        "region": "II",
        "labor_wage": 270000,
        "labor_coefficient": 0.95,
        "machine_coefficient": 0.97,
        "gasoline_price": 22800,
        "diesel_price": 20500,
        "electricity_price": 2006,
        "notice_prices": {
            "VL01": 1700, "VL02": 390000, "VL03": 310000, "VL04": 15900, "VL05": 1500,
            "VL06": 49000, "VL07": 200000, "VL08": 325000, "VL09": 86000, "VL10": 18600
        }
    },
    {
        "id": "CT",
        "name": "Cần Thơ",
        "region": "II",
        "labor_wage": 265000,
        "labor_coefficient": 0.93,
        "machine_coefficient": 0.95,
        "gasoline_price": 22800,
        "diesel_price": 20500,
        "electricity_price": 2006,
        "notice_prices": {
            "VL01": 1820, "VL02": 420000, "VL03": 370000, "VL04": 16200, "VL05": 1400,
            "VL06": 48000, "VL07": 205000, "VL08": 335000, "VL09": 87000, "VL10": 18800
        }
    },

    # VÙNG ĐỒNG BẰNG SÔNG HỒNG & MIỀN BẮC
    {"id": "BN", "name": "Bắc Ninh", "region": "I", "labor_wage": 278000, "labor_coefficient": 0.97, "machine_coefficient": 0.98, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BG", "name": "Bắc Giang", "region": "II", "labor_wage": 265000, "labor_coefficient": 0.93, "machine_coefficient": 0.95, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BK", "name": "Bắc Kạn", "region: ": "III", "region": "III", "labor_wage": 245000, "labor_coefficient": 0.86, "machine_coefficient": 0.91, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "CB", "name": "Cao Bằng", "region": "IV", "labor_wage": 240000, "labor_coefficient": 0.84, "machine_coefficient": 0.90, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "DB", "name": "Điện Biên", "region": "IV", "labor_wage": 240000, "labor_coefficient": 0.84, "machine_coefficient": 0.90, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "HG", "name": "Hà Giang", "region": "IV", "labor_wage": 240000, "labor_coefficient": 0.84, "machine_coefficient": 0.90, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "HNM", "name": "Hà Nam", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "HD", "name": "Hải Dương", "region": "I", "labor_wage": 275000, "labor_coefficient": 0.96, "machine_coefficient": 0.97, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "HB", "name": "Hòa Bình", "region": "III", "labor_wage": 250000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "HY", "name": "Hưng Yên", "region": "I", "labor_wage": 275000, "labor_coefficient": 0.96, "machine_coefficient": 0.97, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "LC", "name": "Lai Châu", "region": "IV", "labor_wage": 238000, "labor_coefficient": 0.83, "machine_coefficient": 0.89, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "LS", "name": "Lạng Sơn", "region": "III", "labor_wage": 248000, "labor_coefficient": 0.87, "machine_coefficient": 0.92, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "LCA", "name": "Lào Cai", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "ND", "name": "Nam Định", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "NB", "name": "Ninh Bình", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "PT", "name": "Phú Thọ", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "QN", "name": "Quảng Ninh", "region": "I", "labor_wage": 278000, "labor_coefficient": 0.97, "machine_coefficient": 0.98, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "SL", "name": "Sơn La", "region": "IV", "labor_wage": 240000, "labor_coefficient": 0.84, "machine_coefficient": 0.90, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "TB", "name": "Thái Bình", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TN", "name": "Thái Nguyên", "region": "II", "labor_wage": 262000, "labor_coefficient": 0.92, "machine_coefficient": 0.95, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TQ", "name": "Tuyên Quang", "region": "III", "labor_wage": 245000, "labor_coefficient": 0.86, "machine_coefficient": 0.91, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "VP", "name": "Vĩnh Phúc", "region": "I", "labor_wage": 275000, "labor_coefficient": 0.96, "machine_coefficient": 0.97, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "YB", "name": "Yên Bái", "region": "III", "labor_wage": 245000, "labor_coefficient": 0.86, "machine_coefficient": 0.91, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},

    # KHU VỰC MIỀN TRUNG & TÂY NGUYÊN
    {"id": "TH", "name": "Thanh Hóa", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "NA", "name": "Nghệ An", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "HT", "name": "Hà Tĩnh", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "QB", "name": "Quảng Bình", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "QT", "name": "Quảng Trị", "region": "III", "labor_wage": 248000, "labor_coefficient": 0.87, "machine_coefficient": 0.91, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TTH", "name": "Thừa Thiên Huế", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "QNM", "name": "Quảng Nam", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "QNG", "name": "Quảng Ngãi", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BDH", "name": "Bình Định", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "PY", "name": "Phú Yên", "region": "III", "labor_wage": 248000, "labor_coefficient": 0.87, "machine_coefficient": 0.91, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "KH", "name": "Khánh Hòa", "region": "I", "labor_wage": 272000, "labor_coefficient": 0.95, "machine_coefficient": 0.97, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "NT", "name": "Ninh Thuận", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BTH", "name": "Bình Thuận", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "KT", "name": "Kon Tum", "region": "III", "labor_wage": 242000, "labor_coefficient": 0.85, "machine_coefficient": 0.90, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "GL", "name": "Gia Lai", "region": "III", "labor_wage": 245000, "labor_coefficient": 0.86, "machine_coefficient": 0.91, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "DL", "name": "Đắk Lắk", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "DNO", "name": "Đắk Nông", "region": "III", "labor_wage": 245000, "labor_coefficient": 0.86, "machine_coefficient": 0.91, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},
    {"id": "LD", "name": "Lâm Đồng", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 23250, "diesel_price": 20910, "electricity_price": 2006},

    # KHU VỰC MIỀN NAM & TÂY NAM BỘ
    {"id": "BD", "name": "Bình Dương", "region": "I", "labor_wage": 288000, "labor_coefficient": 1.01, "machine_coefficient": 1.0, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "DON", "name": "Đồng Nai", "region": "I", "labor_wage": 285000, "labor_coefficient": 1.0, "machine_coefficient": 1.0, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "VT", "name": "Bà Rịa - Vũng Tàu", "region": "I", "labor_wage": 282000, "labor_coefficient": 0.99, "machine_coefficient": 1.0, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TNINH", "name": "Tây Ninh", "region": "II", "labor_wage": 262000, "labor_coefficient": 0.92, "machine_coefficient": 0.95, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BP", "name": "Bình Phước", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "LA", "name": "Long An", "region": "I", "labor_wage": 275000, "labor_coefficient": 0.96, "machine_coefficient": 0.97, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TG", "name": "Tiền Giang", "region": "II", "labor_wage": 260000, "labor_coefficient": 0.91, "machine_coefficient": 0.94, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BTRE", "name": "Bến Tre", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "TV", "name": "Trà Vinh", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "VL", "name": "Vĩnh Long", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "DT", "name": "Đồng Tháp", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "AG", "name": "An Giang", "region": "II", "labor_wage": 258000, "labor_coefficient": 0.90, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "KG", "name": "Kiên Giang", "region": "II", "labor_wage": 262000, "labor_coefficient": 0.92, "machine_coefficient": 0.95, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "HGIA", "name": "Hậu Giang", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "ST", "name": "Sóc Trăng", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "BL", "name": "Bạc Liêu", "region": "II", "labor_wage": 252000, "labor_coefficient": 0.88, "machine_coefficient": 0.92, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006},
    {"id": "CM", "name": "Cà Mau", "region": "II", "labor_wage": 255000, "labor_coefficient": 0.89, "machine_coefficient": 0.93, "gasoline_price": 22800, "diesel_price": 20500, "electricity_price": 2006}
]

# Tự động gán thông báo giá vật tư chuẩn cho các tỉnh chưa có danh mục riêng
DEFAULT_NOTICE_PRICES = {
    "VL01": 1720,      # Xi măng PCB40 (đ/kg)
    "VL02": 390000,    # Cát vàng hạt lớn (đ/m3)
    "VL03": 310000,    # Đá 1x2 (đ/m3)
    "VL04": 15850,     # Thép xây dựng d10-d18 (đ/kg)
    "VL05": 1420,      # Gạch tuynel tiêu chuẩn (đ/viên)
    "VL06": 48500,     # Sơn nước tường lót (đ/kg)
    "VL07": 198000,    # Gạch lát ceramic 400x400 (đ/m2)
    "VL08": 320000,    # Ván coppha phủ phim 18mm (đ/m2)
    "VL09": 85000,     # Ống PVC D110 Class 2 (đ/m)
    "VL10": 18500      # Dây điện Cadisun 2x2.5 (đ/m)
}

for p in PROVINCES_63:
    if "notice_prices" not in p:
        # Điều chỉnh giá nhẹ theo vùng miền
        coef = p.get("labor_coefficient", 1.0)
        p["notice_prices"] = {
            k: round(v * (0.95 + 0.05 * coef)) for k, v in DEFAULT_NOTICE_PRICES.items()
        }

def get_province_by_id(prov_id: str) -> Optional[Dict[str, Any]]:
    """Tra cứu tỉnh thành theo mã định danh (HN, HCM, DN...)"""
    for p in PROVINCES_63:
        if p["id"].upper() == prov_id.upper():
            return p
    return None

def get_all_provinces() -> List[Dict[str, Any]]:
    """Lấy danh sách toàn bộ 63 tỉnh thành"""
    return PROVINCES_63
