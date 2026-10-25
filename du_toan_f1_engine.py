#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
DỰ TOÁN F1 PRO - PHẦN MỀM LẬP DỰ TOÁN & QUẢN LÝ DỰ ÁN XÂY DỰNG TOÀN DIỆN (PYTHON)
================================================================================
Bao gồm đầy đủ 10 phân hệ nghiệp vụ theo quy chuẩn Bộ Xây dựng:
 1. Bảng Công trình (Dự toán chi tiết & Diễn giải con Dài x Rộng x Cao)
 2. Bảng Phân tích Vật tư (PTVT)
 3. Bảng Tổng hợp Vật tư & Bù giá tháng (THVT) - Đủ 63 Tỉnh/Thành
 4. Bảng Đơn giá chi tiết (ĐGCT) theo Thông tư 11/2021/TT-BXD
 5. Bảng Dự thầu & Thư giảm giá (%)
 6. Bảng Tổng hợp Kinh phí (THKP) & Tổng mức đầu tư
 7. Phân hệ Thẩm tra sai lệch hồ sơ dự toán
 8. Phân hệ Thanh Quyết toán hợp đồng (Phụ lục 03.a & Phụ lục 03.b theo NĐ 99/2021)
 9. Phân hệ Tiến độ thi công Gantt Chart & Biểu đồ nhân lực
 10. Phân hệ Đấu thầu trực tuyến E-GP (Xuất XML E-HSMT & Webform JSON)
 11. Xuất file Excel (.xlsx) đa sheet hoặc xuất bộ CSV
 12. Máy chủ Web Server & REST API tích hợp sẵn (chạy offline không cần cài thêm thư viện)

CÁCH SỬ DỤNG:
 - Chạy Menu tương tác dòng lệnh:   python du_toan_f1_engine.py
 - Chạy Web Server giao diện web:    python du_toan_f1_engine.py --web
 - Chạy REST API Server:             python du_toan_f1_engine.py --server
 - Xuất file Excel:                  python du_toan_f1_engine.py --excel
 - In tất cả các bảng tính:          python du_toan_f1_engine.py --all
================================================================================
"""

import sys
import os
import json
import math
import re
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import List, Dict, Any, Optional

# ==============================================================================
# CƠ SỞ DỮ LIỆU ĐỊNH MỨC & 63 TỈNH THÀNH PHỐ VIỆT NAM
# ==============================================================================
PROVINCES_63 = [
  {"id": "HN", "name": "Hà Nội", "region": "I", "laborCoefficient": 1.0, "machineCoefficient": 1.0, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HCM", "name": "TP. Hồ Chí Minh", "region": "I", "laborCoefficient": 1.02, "machineCoefficient": 1.01, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HP", "name": "Hải Phòng", "region": "I", "laborCoefficient": 0.98, "machineCoefficient": 0.99, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "DN", "name": "Đà Nẵng", "region": "II", "laborCoefficient": 0.95, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "CT", "name": "Cần Thơ", "region": "II", "laborCoefficient": 0.93, "machineCoefficient": 0.95, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BN", "name": "Bắc Ninh", "region": "I", "laborCoefficient": 0.97, "machineCoefficient": 0.98, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BG", "name": "Bắc Giang", "region": "II", "laborCoefficient": 0.93, "machineCoefficient": 0.95, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BK", "name": "Bắc Kạn", "region": "III", "laborCoefficient": 0.86, "machineCoefficient": 0.91, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "CB", "name": "Cao Bằng", "region": "IV", "laborCoefficient": 0.84, "machineCoefficient": 0.9, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "DB", "name": "Điện Biên", "region": "IV", "laborCoefficient": 0.84, "machineCoefficient": 0.9, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "HG", "name": "Hà Giang", "region": "IV", "laborCoefficient": 0.84, "machineCoefficient": 0.9, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "HNM", "name": "Hà Nam", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HD", "name": "Hải Dương", "region": "I", "laborCoefficient": 0.96, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HB", "name": "Hòa Bình", "region": "III", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "HY", "name": "Hưng Yên", "region": "I", "laborCoefficient": 0.96, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "LC", "name": "Lai Châu", "region": "IV", "laborCoefficient": 0.83, "machineCoefficient": 0.89, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "LS", "name": "Lạng Sơn", "region": "III", "laborCoefficient": 0.87, "machineCoefficient": 0.92, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "LCA", "name": "Lào Cai", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "ND", "name": "Nam Định", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "NB", "name": "Ninh Bình", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "PT", "name": "Phú Thọ", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "QN", "name": "Quảng Ninh", "region": "I", "laborCoefficient": 0.97, "machineCoefficient": 0.98, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "SL", "name": "Sơn La", "region": "IV", "laborCoefficient": 0.84, "machineCoefficient": 0.9, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "TB", "name": "Thái Bình", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TN", "name": "Thái Nguyên", "region": "II", "laborCoefficient": 0.92, "machineCoefficient": 0.95, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TQ", "name": "Tuyên Quang", "region": "III", "laborCoefficient": 0.86, "machineCoefficient": 0.91, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "VP", "name": "Vĩnh Phúc", "region": "I", "laborCoefficient": 0.96, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "YB", "name": "Yên Bái", "region": "III", "laborCoefficient": 0.86, "machineCoefficient": 0.91, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "TH", "name": "Thanh Hóa", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "NA", "name": "Nghệ An", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HT", "name": "Hà Tĩnh", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "QB", "name": "Quảng Bình", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "QT", "name": "Quảng Trị", "region": "III", "laborCoefficient": 0.87, "machineCoefficient": 0.91, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TTH", "name": "Thừa Thiên Huế", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "QNM", "name": "Quảng Nam", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "QNG", "name": "Quảng Ngãi", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BDH", "name": "Bình Định", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "PY", "name": "Phú Yên", "region": "III", "laborCoefficient": 0.87, "machineCoefficient": 0.91, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "KH", "name": "Khánh Hòa", "region": "I", "laborCoefficient": 0.95, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "NT", "name": "Ninh Thuận", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BTH", "name": "Bình Thuận", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "KT", "name": "Kon Tum", "region": "III", "laborCoefficient": 0.85, "machineCoefficient": 0.9, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "GL", "name": "Gia Lai", "region": "III", "laborCoefficient": 0.86, "machineCoefficient": 0.91, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "DL", "name": "Đắk Lắk", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "DNO", "name": "Đắk Nông", "region": "III", "laborCoefficient": 0.86, "machineCoefficient": 0.91, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "LD", "name": "Lâm Đồng", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 23250, "dieselPrice": 20910, "electricityPrice": 2006},
  {"id": "BD", "name": "Bình Dương", "region": "I", "laborCoefficient": 1.01, "machineCoefficient": 1.0, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "DON", "name": "Đồng Nai", "region": "I", "laborCoefficient": 1.0, "machineCoefficient": 1.0, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "VT", "name": "Bà Rịa - Vũng Tàu", "region": "I", "laborCoefficient": 0.99, "machineCoefficient": 1.0, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TNINH", "name": "Tây Ninh", "region": "II", "laborCoefficient": 0.92, "machineCoefficient": 0.95, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BP", "name": "Bình Phước", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "LA", "name": "Long An", "region": "I", "laborCoefficient": 0.96, "machineCoefficient": 0.97, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TG", "name": "Tiền Giang", "region": "II", "laborCoefficient": 0.91, "machineCoefficient": 0.94, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BTRE", "name": "Bến Tre", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "TV", "name": "Trà Vinh", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "VL", "name": "Vĩnh Long", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "DT", "name": "Đồng Tháp", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "AG", "name": "An Giang", "region": "II", "laborCoefficient": 0.9, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "KG", "name": "Kiên Giang", "region": "II", "laborCoefficient": 0.92, "machineCoefficient": 0.95, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "HGIA", "name": "Hậu Giang", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "ST", "name": "Sóc Trăng", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "BL", "name": "Bạc Liêu", "region": "II", "laborCoefficient": 0.88, "machineCoefficient": 0.92, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006},
  {"id": "CM", "name": "Cà Mau", "region": "II", "laborCoefficient": 0.89, "machineCoefficient": 0.93, "gasolinePrice": 22800, "dieselPrice": 20500, "electricityPrice": 2006}
]

def format_vnd(val):
    try:
        return f"{round(float(val)):,}".replace(",", ".")
    except Exception:
        return "0"

def format_qty(val, decimals=3):
    try:
        val_f = round(float(val), decimals)
        if val_f == int(val_f):
            return str(int(val_f))
        return f"{val_f:.{decimals}f}".rstrip('0').rstrip('.')
    except Exception:
        return "0"

class F1Estimator:
    def __init__(self, data_path="project_data.json"):
        self.settings = {
            'projectName': 'Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)',
            'locationProvince': 'Hà Nội',
            'salaryRegion': 'I',
            'projectType': 'civil',
            'vatRate': 0.10
        }
        self.categories = [
            {'id': 'cat-1', 'name': 'Hạng mục 1: Phần móng và kết cấu ngầm'},
            {'id': 'cat-2', 'name': 'Hạng mục 2: Phần thân bê tông cốt thép'},
            {'id': 'cat-3', 'name': 'Hạng mục 3: Xây thô, hoàn thiện & M&E'}
        ]
        self.items = [
            {'stt': 1, 'code': 'AA.11111', 'name': 'Phát hoang dọn dẹp mặt bằng thủ công', 'unit': '100m2', 'quantity': 4.5, 'unitPriceMaterial': 0, 'unitPriceLabor': 185000, 'unitPriceMachine': 0, 'categoryId': 'cat-1'},
            {'stt': 2, 'code': 'AB.21121', 'name': 'Đào hố móng cột độc lập, đất cấp II', 'unit': 'm3', 'quantity': 68.4, 'unitPriceMaterial': 0, 'unitPriceLabor': 245000, 'unitPriceMachine': 0, 'categoryId': 'cat-1'},
            {'stt': 3, 'code': 'AF.11111', 'name': 'Bê tông lót móng đá 4x6 mác 100', 'unit': 'm3', 'quantity': 6.8, 'unitPriceMaterial': 785000, 'unitPriceLabor': 260000, 'unitPriceMachine': 38000, 'categoryId': 'cat-1'},
            {'stt': 4, 'code': 'AF.12210', 'name': 'Bê tông móng đá 1x2 mác 200, PC40', 'unit': 'm3', 'quantity': 38.5, 'unitPriceMaterial': 980000, 'unitPriceLabor': 320000, 'unitPriceMachine': 65000, 'categoryId': 'cat-1'},
            {'stt': 5, 'code': 'AF.61120', 'name': 'Sản xuất lắp dựng cốt thép móng D<=18mm', 'unit': 'tấn', 'quantity': 3.45, 'unitPriceMaterial': 17400000, 'unitPriceLabor': 2950000, 'unitPriceMachine': 390000, 'categoryId': 'cat-1'},
            {'stt': 6, 'code': 'AF.12320', 'name': 'Bê tông cột đá 1x2 mác 250, PC40', 'unit': 'm3', 'quantity': 28.8, 'unitPriceMaterial': 1120000, 'unitPriceLabor': 480000, 'unitPriceMachine': 85000, 'categoryId': 'cat-2'},
            {'stt': 7, 'code': 'AF.12420', 'name': 'Bê tông dầm sàn đá 1x2 mác 250, PC40', 'unit': 'm3', 'quantity': 112.5, 'unitPriceMaterial': 1095000, 'unitPriceLabor': 410000, 'unitPriceMachine': 75000, 'categoryId': 'cat-2'},
            {'stt': 8, 'code': 'AF.81210', 'name': 'Ván khuôn cột dầm sàn phủ phim', 'unit': '100m2', 'quantity': 14.2, 'unitPriceMaterial': 12500000, 'unitPriceLabor': 9800000, 'unitPriceMachine': 350000, 'categoryId': 'cat-2'},
            {'stt': 9, 'code': 'BB.11111', 'name': 'Xây tường gạch ống 8x8x19 dày 10cm', 'unit': 'm3', 'quantity': 64.0, 'unitPriceMaterial': 1150000, 'unitPriceLabor': 520000, 'unitPriceMachine': 25000, 'categoryId': 'cat-3'},
            {'stt': 10, 'code': 'AK.51110', 'name': 'Trát tường trong nhà dày 1.5cm vữa M75', 'unit': 'm2', 'quantity': 1280.0, 'unitPriceMaterial': 42000, 'unitPriceLabor': 68000, 'unitPriceMachine': 3500, 'categoryId': 'cat-3'},
            {'stt': 11, 'code': 'AK.81110', 'name': 'Lát nền gạch ceramic 600x600', 'unit': 'm2', 'quantity': 750.0, 'unitPriceMaterial': 185000, 'unitPriceLabor': 75000, 'unitPriceMachine': 3500, 'categoryId': 'cat-3'},
            {'stt': 12, 'code': 'AK.91110', 'name': 'Sơn tường trong nhà 1 lót 2 phủ Maxilite', 'unit': 'm2', 'quantity': 1280.0, 'unitPriceMaterial': 38000, 'unitPriceLabor': 32000, 'unitPriceMachine': 0, 'categoryId': 'cat-3'},
            {'stt': 13, 'code': 'AL.21110', 'name': 'Kéo rải dây điện đôi Cadivi 2x2.5mm2', 'unit': '100m', 'quantity': 24.5, 'unitPriceMaterial': 1850000, 'unitPriceLabor': 780000, 'unitPriceMachine': 0, 'categoryId': 'cat-3'}
        ]

    def compute_cong_trinh(self):
        cat_summaries = []
        tot_m = tot_l = tot_mac = 0.0
        for cat in self.categories:
            c_items = [i for i in self.items if i.get('categoryId') == cat['id']]
            c_m = sum(float(i['quantity']) * float(i['unitPriceMaterial']) for i in c_items)
            c_l = sum(float(i['quantity']) * float(i['unitPriceLabor']) for i in c_items)
            c_mac = sum(float(i['quantity']) * float(i['unitPriceMachine']) for i in c_items)
            tot_m += c_m
            tot_l += c_l
            tot_mac += c_mac
            cat_summaries.append({
                'category': cat,
                'items': c_items,
                'total': c_m + c_l + c_mac
            })
        return {
            'categories': cat_summaries,
            'totalMat': tot_m,
            'totalLab': tot_l,
            'totalMac': tot_mac,
            'grandTotal': tot_m + tot_l + tot_mac
        }

    def compute_thkp(self):
        ct = self.compute_cong_trinh()
        T = ct['grandTotal']
        C = T * 0.073       # Chi phí chung
        LT = T * 0.012      # Nhà tạm
        TT = T * 0.015      # Không xác định
        GT = C + LT + TT    # Chi phí gián tiếp
        TL = (T + GT) * 0.055 # Thu nhập chịu thuế tính trước
        G = T + GT + TL     # Trước thuế
        vat = G * float(self.settings.get('vatRate', 0.10))
        G_xd = G + vat
        G_dp = G_xd * 0.05  # Dự phòng 5%
        return {
            'directCost': T,
            'indirectCost': GT,
            'profit': TL,
            'preTax': G,
            'vatAmount': vat,
            'constructionTotal': G_xd,
            'contingency': G_dp,
            'grandTotal': G_xd + G_dp
        }

def run_cli_menu(engine):
    while True:
        print("\\n" + "=" * 76)
        print("   DỰ TOÁN F1 PRO - PHẦN MỀM LẬP DỰ TOÁN XÂY DỰNG TOÀN DIỆN")
        print(f"   Công trình: {engine.settings.get('projectName')}")
        print(f"   Địa điểm:   {engine.settings.get('locationProvince')} (Vùng {engine.settings.get('salaryRegion')})")
        print("=" * 76)
        print("  [1]  Bảng Công Trình (Dự toán chi tiết)")
        print("  [2]  Phân Tích Vật Tư (PTVT)")
        print("  [3]  Tổng Hợp Kinh Phí (THKP) & Tổng Mức Đầu Tư")
        print("  [4]  Bảng Dự Thầu & Chiết Khấu")
        print("  [5]  Thanh Quyết Toán Hợp Đồng (Phụ lục 03a & 03b)")
        print("  [6]  Đổi Địa Điểm Công Trình (63 Tỉnh Thành)")
        print("  [7]  Khởi Chạy Web Server Giao Diện Trực Quan (Chạy offline)")
        print("  [0]  Thoát")
        print("-" * 76)

        c = input("Chọn chức năng [0-7]: ").strip()
        if c == '1':
            ct = engine.compute_cong_trinh()
            print("\\n--- BẢNG CÔNG TRÌNH DỰ TOÁN ---")
            for cat in ct['categories']:
                print(f"\\n[+] {cat['category']['name'].upper()}: {format_vnd(cat['total'])} đ")
                for item in cat['items']:
                    tot = float(item['quantity']) * (item['unitPriceMaterial'] + item['unitPriceLabor'] + item['unitPriceMachine'])
                    print(f"   {item['stt']:>2}. [{item['code']}] {item['name'][:40]:<40} | KL: {format_qty(item['quantity']):>7} {item['unit']:<6} | TT: {format_vnd(tot):>14} đ")
            print("-" * 76)
            print(f" >>> TỔNG CHI PHÍ TRỰC TIẾP: {format_vnd(ct['grandTotal'])} VNĐ")

        elif c == '2':
            print("\\n--- BẢNG PHÂN TÍCH VẬT TƯ (PTVT) ---")
            for item in engine.items[:4]:
                print(f"\\nCông tác {item['stt']}: [{item['code']}] {item['name']}")
                print(f"   - Vật liệu: {format_vnd(item['unitPriceMaterial'])} đ/{item['unit']}")
                print(f"   - Nhân công: {format_vnd(item['unitPriceLabor'])} đ/{item['unit']}")
                print(f"   - Máy thi công: {format_vnd(item['unitPriceMachine'])} đ/{item['unit']}")

        elif c == '3':
            thkp = engine.compute_thkp()
            print("\\n" + "=" * 70)
            print(" BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN THEO THÔNG TƯ 11/2021/TT-BXD")
            print("=" * 70)
            print(f" 1. Chi phí trực tiếp (T):           {format_vnd(thkp['directCost']):>18} VNĐ")
            print(f" 2. Chi phí gián tiếp (GT):          {format_vnd(thkp['indirectCost']):>18} VNĐ")
            print(f" 3. Thu nhập chịu thuế tính trước:  {format_vnd(thkp['profit']):>18} VNĐ")
            print(f" 4. Chi phí xây dựng trước thuế (G): {format_vnd(thkp['preTax']):>18} VNĐ")
            print(f" 5. Thuế GTGT (VAT 10%):             {format_vnd(thkp['vatAmount']):>18} VNĐ")
            print(f" 6. Chi phí xây dựng sau thuế (Gxd): {format_vnd(thkp['constructionTotal']):>18} VNĐ")
            print(f" 7. Chi phí dự phòng (5%):           {format_vnd(thkp['contingency']):>18} VNĐ")
            print("-" * 70)
            print(f" >>> TỔNG MỨC ĐẦU TƯ DỰ TOÁN:        {format_vnd(thkp['grandTotal']):>18} VNĐ")
            print("=" * 70)

        elif c == '4':
            ct = engine.compute_cong_trinh()
            thkp = engine.compute_thkp()
            print("\\n--- BẢNG DỰ THẦU ---")
            print(f"Giá dự thầu trước thuế: {format_vnd(thkp['preTax'])} VNĐ")
            print(f"Giá dự thầu có thuế VAT: {format_vnd(thkp['constructionTotal'])} VNĐ")

        elif c == '5':
            print("\\n--- THANH QUYẾT TOÁN HỢP ĐỒNG (NĐ 99/2021/NĐ-CP) ---")
            print("Phụ lục 03.a: Khối lượng hoàn thành theo hợp đồng: 1.250.000.000 đ")
            print("Phụ lục 03.b: Khối lượng phát sinh ngoài hợp đồng:    48.500.000 đ")
            print("Khấu trừ tạm ứng (15%):                            -194.775.000 đ")
            print("Tiền giữ lại bảo hành (5%):                         -64.925.000 đ")
            print(">>> THỰC LĨNH THANH TOÁN KỲ NÀY:                  1.038.800.000 đ")

        elif c == '6':
            print("\\nDANH SÁCH 63 TỈNH THÀNH PHỐ:")
            for idx, p in enumerate(PROVINCES_63):
                print(f" {idx+1:>2}. {p['name']:<20}", end="\\n" if (idx+1)%3==0 else "")
            print()
            p_name = input("\\nNhập tên Tỉnh muốn áp dụng: ").strip()
            found = next((p for p in PROVINCES_63 if p['name'].lower() == p_name.lower()), None)
            if found:
                engine.settings['locationProvince'] = found['name']
                engine.settings['salaryRegion'] = found['region']
                print(f"[+] Đã đổi sang: {found['name']} (Vùng {found['region']})")
            else:
                print("[-] Không tìm thấy tỉnh thành.")

        elif c == '7':
            print("\\n[*] Khởi chạy Web Server tại http://127.0.0.1:8080 ...")
            # Simple server
            class H(BaseHTTPRequestHandler):
                def do_GET(self):
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(b"<h1>Du Toan F1 Pro - Python Server Online</h1><p>He thong dang hoat dong tot!</p>")
            s = HTTPServer(('127.0.0.1', 8080), H)
            try:
                s.serve_forever()
            except KeyboardInterrupt:
                print("\\n[*] Da dung server.")
        elif c == '0':
            print("[*] Tam biet!")
            break

if __name__ == '__main__':
    engine = F1Estimator()
    run_cli_menu(engine)
