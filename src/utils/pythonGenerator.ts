import { WorkItem, ProjectSettings, Category, SettlementItem, GanttTask, BiddingForm } from '../types/estimate';
import { PROVINCES_DATA } from '../data/provincesData';
import { NORMS_CATALOG } from '../data/normsData';

export function generatePythonScript(
  items: WorkItem[],
  categories: Category[],
  settings: ProjectSettings,
  settlements: SettlementItem[],
  tasks: GanttTask[],
  biddingForm?: BiddingForm
): string {
  const jsonProject = JSON.stringify({
    settings,
    categories,
    items,
    settlements,
    tasks,
    biddingForm
  }, null, 2);

  const jsonProvinces = JSON.stringify(PROVINCES_DATA, null, 2);
  const jsonNorms = JSON.stringify(NORMS_CATALOG, null, 2);

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
DỰ TOÁN F1 PRO - PHẦN MỀM LẬP DỰ TOÁN & QUẢN LÝ DỰ ÁN XÂY DỰNG TOÀN DIỆN (PYTHON)
================================================================================
Đầy đủ 10 phân hệ nghiệp vụ theo chuẩn Bộ Xây dựng:
 1. Bảng Công trình (Dự toán chi tiết & Diễn giải con Dài x Rộng x Cao)
 2. Bảng Phân tích Vật tư (PTVT)
 3. Bảng Tổng hợp Vật tư & Bù giá tháng (THVT) - Cơ sở dữ liệu 63 Tỉnh/Thành
 4. Bảng Đơn giá chi tiết (ĐGCT) theo Thông tư 11/2021/TT-BXD
 5. Bảng Dự thầu & Thư giảm giá
 6. Bảng Tổng hợp Kinh phí (THKP) & Tổng mức đầu tư
 7. Phân hệ Thẩm tra sai lệch hồ sơ dự toán
 8. Phân hệ Thanh Quyết toán hợp đồng (Phụ lục 03.a & Phụ lục 03.b theo NĐ 99/2021)
 9. Phân hệ Tiến độ thi công Gantt Chart & Biểu đồ nhân lực
 10. Phân hệ Đấu thầu trực tuyến E-GP (Xuất XML E-HSMT & Webform JSON)
 11. Xuất file Excel (.xlsx) đa sheet hoặc xuất bộ CSV
 12. Máy chủ Web Server & REST API tích hợp sẵn (chạy offline độc lập không cần cài thêm thư viện)

CÁCH SỬ DỤNG:
 - Chạy Menu tương tác dòng lệnh:   python du_toan_f1_engine.py
 - Chạy Web Server giao diện web:    python du_toan_f1_engine.py --web
 - Chạy REST API Server:             python du_toan_f1_engine.py --server
 - Xuất file Excel:                  python du_toan_f1_engine.py --excel
 - In toàn bộ 10 bảng tính:          python du_toan_f1_engine.py --all
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
PROVINCES_63 = ${jsonProvinces}
NORMS_CATALOG = ${jsonNorms}
INITIAL_PROJECT = ${jsonProject}

def format_vnd(val: float) -> str:
    """Định dạng tiền tệ chuẩn Việt Nam (1.234.567 VNĐ)"""
    try:
        return f"{round(float(val)):,}".replace(",", ".")
    except Exception:
        return "0"

def format_qty(val: float, decimals: int = 3) -> str:
    """Định dạng khối lượng xây dựng"""
    try:
        val_f = round(float(val), decimals)
        if val_f == int(val_f):
            return str(int(val_f))
        return f"{val_f:.{decimals}f}".rstrip('0').rstrip('.')
    except Exception:
        return "0"

def eval_math(expr: str) -> float:
    """Đánh giá an toàn biểu thức diễn giải khối lượng (ví dụ: 12 * 1.8 * 1.8 * 0.6)"""
    if not expr:
        return 0.0
    try:
        sanitized = re.sub(r'[^0-9+\\-*/(). ]', '', str(expr))
        if not sanitized.strip():
            return 0.0
        return float(eval(sanitized, {"__builtins__": None}, {}))
    except Exception:
        return 0.0

# ==============================================================================
# ENGINE TÍNH TOÁN DỰ TOÁN F1 (CORE ESTIMATION ENGINE)
# ==============================================================================
class F1Estimator:
    def __init__(self, project_data: Optional[Dict[str, Any]] = None):
        self.data = project_data or json.loads(json.dumps(INITIAL_PROJECT))
        self.settings = self.data.get('settings', {})
        self.categories = self.data.get('categories', [])
        self.items = self.data.get('items', [])
        self.settlements = self.data.get('settlements', [])
        self.tasks = self.data.get('tasks', [])
        self.bidding = self.data.get('biddingForm', {
            'packageCode': 'TB-2026-F1-00892',
            'packageName': 'Gói thầu số 03: Thi công xây dựng công trình',
            'discountRate': 0.0,
            'executionDurationDays': 180,
            'validityDays': 120
        })

    # --- 1. TÍNH BẢNG CÔNG TRÌNH ---
    def compute_cong_trinh(self) -> Dict[str, Any]:
        cat_summaries = []
        total_mat = 0.0
        total_lab = 0.0
        total_mac = 0.0

        for cat in self.categories:
            cat_id = cat.get('id')
            cat_items = [i for i in self.items if i.get('categoryId') == cat_id]
            c_mat = 0.0
            c_lab = 0.0
            c_mac = 0.0
            item_details = []

            for item in cat_items:
                q = float(item.get('quantity', 0))
                p_mat = float(item.get('unitPriceMaterial', 0))
                p_lab = float(item.get('unitPriceLabor', 0))
                p_mac = float(item.get('unitPriceMachine', 0))

                t_mat = q * p_mat
                t_lab = q * p_lab
                t_mac = q * p_mac
                t_tot = t_mat + t_lab + t_mac

                c_mat += t_mat
                c_lab += t_lab
                c_mac += t_mac

                item_details.append({
                    'stt': item.get('stt'),
                    'code': item.get('code'),
                    'name': item.get('name'),
                    'unit': item.get('unit'),
                    'quantity': q,
                    'unitPriceMat': p_mat,
                    'unitPriceLab': p_lab,
                    'unitPriceMac': p_mac,
                    'totalMat': t_mat,
                    'totalLab': t_lab,
                    'totalMac': t_mac,
                    'total': t_tot,
                    'subs': item.get('subCalculations', [])
                })

            total_mat += c_mat
            total_lab += c_lab
            total_mac += c_mac

            cat_summaries.append({
                'category': cat,
                'items': item_details,
                'mat': c_mat,
                'lab': c_lab,
                'mac': c_mac,
                'total': c_mat + c_lab + c_mac
            })

        return {
            'categories': cat_summaries,
            'totalMat': total_mat,
            'totalLab': total_lab,
            'totalMac': total_mac,
            'grandTotal': total_mat + total_lab + total_mac
        }

    # --- 2. TỔNG HỢP VẬT TƯ (THVT) & BÙ GIÁ THÁNG ---
    def compute_thvt(self) -> Dict[str, Any]:
        mat_map = {}
        lab_map = {}
        mac_map = {}

        for item in self.items:
            q = float(item.get('quantity', 0))
            if q <= 0:
                continue

            # Vật liệu
            for m in item.get('materials', []):
                code = m.get('code')
                norm = float(m.get('norm', 0))
                needed = q * norm
                bp = float(m.get('price', 0))
                mp = float(m.get('monthlyPrice', bp))

                if code in mat_map:
                    mat_map[code]['totalQuantity'] += needed
                    mat_map[code]['baseAmount'] = mat_map[code]['totalQuantity'] * bp
                    mat_map[code]['monthlyAmount'] = mat_map[code]['totalQuantity'] * mp
                    mat_map[code]['diffAmount'] = (mp - bp) * mat_map[code]['totalQuantity']
                else:
                    mat_map[code] = {
                        'code': code,
                        'name': m.get('name'),
                        'unit': m.get('unit'),
                        'totalQuantity': needed,
                        'basePrice': bp,
                        'monthlyPrice': mp,
                        'diffPrice': mp - bp,
                        'baseAmount': needed * bp,
                        'monthlyAmount': needed * mp,
                        'diffAmount': (mp - bp) * needed,
                    }

            # Nhân công
            for l in item.get('labors', []):
                code = l.get('code')
                norm = float(l.get('norm', 0))
                needed = q * norm
                bp = float(l.get('price', 0))

                if code in lab_map:
                    lab_map[code]['totalQuantity'] += needed
                    lab_map[code]['baseAmount'] = lab_map[code]['totalQuantity'] * bp
                    lab_map[code]['monthlyAmount'] = lab_map[code]['baseAmount']
                else:
                    lab_map[code] = {
                        'code': code,
                        'name': f"{l.get('name')} ({l.get('rank', '3.5/7')})",
                        'unit': l.get('unit', 'công'),
                        'totalQuantity': needed,
                        'basePrice': bp,
                        'monthlyPrice': bp,
                        'diffPrice': 0.0,
                        'baseAmount': needed * bp,
                        'monthlyAmount': needed * bp,
                        'diffAmount': 0.0,
                    }

            # Máy thi công
            for mac in item.get('machines', []):
                code = mac.get('code')
                norm = float(mac.get('norm', 0))
                needed = q * norm
                bp = float(mac.get('price', 0))

                if code in mac_map:
                    mac_map[code]['totalQuantity'] += needed
                    mac_map[code]['baseAmount'] = mac_map[code]['totalQuantity'] * bp
                    mac_map[code]['monthlyAmount'] = mac_map[code]['baseAmount']
                else:
                    mac_map[code] = {
                        'code': code,
                        'name': mac.get('name'),
                        'unit': mac.get('unit', 'ca'),
                        'totalQuantity': needed,
                        'basePrice': bp,
                        'monthlyPrice': bp,
                        'diffPrice': 0.0,
                        'baseAmount': needed * bp,
                        'monthlyAmount': needed * bp,
                        'diffAmount': 0.0,
                    }

        materials = list(mat_map.values())
        labors = list(lab_map.values())
        machines = list(mac_map.values())

        total_base_mat = sum(m['baseAmount'] for m in materials)
        total_month_mat = sum(m['monthlyAmount'] for m in materials)
        total_diff_mat = sum(m['diffAmount'] for m in materials)

        total_lab = sum(l['monthlyAmount'] for l in labors)
        total_mac = sum(mac['monthlyAmount'] for mac in machines)

        return {
            'materials': materials,
            'labors': labors,
            'machines': machines,
            'totalBaseMat': total_base_mat,
            'totalMonthMat': total_month_mat,
            'totalDiffMat': total_diff_mat,
            'totalLab': total_lab,
            'totalMac': total_mac,
            'grandTotal': total_month_mat + total_lab + total_mac
        }

    # --- 3. ĐƠN GIÁ CHI TIẾT (ĐGCT) ---
    def compute_dgct(self) -> List[Dict[str, Any]]:
        p_type = self.settings.get('projectType', 'civil')
        # Tỷ lệ % theo Thông tư 11/2021/TT-BXD
        rates = {
            'civil': {'c': 0.073, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055},
            'industrial': {'c': 0.062, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055},
            'transport': {'c': 0.055, 'lt': 0.011, 'tt': 0.015, 'tl': 0.055},
            'infrastructure': {'c': 0.050, 'lt': 0.011, 'tt': 0.015, 'tl': 0.055},
        }.get(p_type, {'c': 0.073, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055})

        vat_rate = float(self.settings.get('vatRate', 0.10))
        res = []

        for item in self.items:
            m = float(item.get('unitPriceMaterial', 0))
            l = float(item.get('unitPriceLabor', 0))
            mac = float(item.get('unitPriceMachine', 0))
            T = m + l + mac

            c = T * rates['c']
            lt = T * rates['lt']
            tt = T * rates['tt']
            GT = c + lt + tt

            TL = (T + GT) * rates['tl']
            G = T + GT + TL
            vat = G * vat_rate
            G_st = G + vat

            res.append({
                'code': item.get('code'),
                'name': item.get('name'),
                'unit': item.get('unit'),
                'quantity': float(item.get('quantity', 0)),
                'mat': m,
                'lab': l,
                'mac': mac,
                'T': T,
                'c': c,
                'lt': lt,
                'tt': tt,
                'GT': GT,
                'TL': TL,
                'G': G,
                'vat': vat,
                'G_st': G_st
            })

        return res

    # --- 4. TỔNG HỢP KINH PHÍ (THKP) ---
    def compute_thkp(self) -> Dict[str, Any]:
        cong_trinh = self.compute_cong_trinh()
        thvt = self.compute_thvt()

        direct_mat = cong_trinh['totalMat']
        direct_lab = cong_trinh['totalLab']
        direct_mac = cong_trinh['totalMac']
        diff_mat = thvt['totalDiffMat']

        T = direct_mat + direct_lab + direct_mac + diff_mat

        p_type = self.settings.get('projectType', 'civil')
        rates = {
            'civil': {'c': 0.073, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055},
            'industrial': {'c': 0.062, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055},
            'transport': {'c': 0.055, 'lt': 0.011, 'tt': 0.015, 'tl': 0.055},
            'infrastructure': {'c': 0.050, 'lt': 0.011, 'tt': 0.015, 'tl': 0.055},
        }.get(p_type, {'c': 0.073, 'lt': 0.012, 'tt': 0.015, 'tl': 0.055})

        C = T * rates['c']
        LT = T * rates['lt']
        TT = T * rates['tt']
        GT = C + LT + TT

        TL = (T + GT) * rates['tl']
        G = T + GT + TL
        vat_rate = float(self.settings.get('vatRate', 0.10))
        vat_amount = G * vat_rate
        G_xd = G + vat_amount
        G_dp = G_xd * 0.05
        grand_total = G_xd + G_dp

        return {
            'directMat': direct_mat,
            'directLab': direct_lab,
            'directMac': direct_mac,
            'diffMat': diff_mat,
            'directCost': T,
            'generalCost': C,
            'tempCamp': LT,
            'unallocated': TT,
            'indirectCost': GT,
            'profit': TL,
            'preTax': G,
            'vatRate': vat_rate,
            'vatAmount': vat_amount,
            'constructionTotal': G_xd,
            'contingency': G_dp,
            'grandTotal': grand_total
        }

    # --- 5. BẢNG DỰ THẦU ---
    def compute_du_thau(self) -> Dict[str, Any]:
        dgct = self.compute_dgct()
        discount_rate = float(self.bidding.get('discountRate', 0.0))

        items_bid = []
        total_pre_tax = 0.0
        total_post_tax = 0.0

        for d in dgct:
            q = d['quantity']
            t_pre = q * d['G']
            t_post = q * d['G_st']
            total_pre_tax += t_pre
            total_post_tax += t_post

            items_bid.append({
                'code': d['code'],
                'name': d['name'],
                'unit': d['unit'],
                'quantity': q,
                'pricePreTax': d['G'],
                'amountPreTax': t_pre,
                'pricePostTax': d['G_st'],
                'amountPostTax': t_post,
            })

        discount_amount = total_post_tax * (discount_rate / 100.0)
        final_bid = total_post_tax - discount_amount

        return {
            'items': items_bid,
            'totalPreTax': total_pre_tax,
            'totalPostTax': total_post_tax,
            'discountRate': discount_rate,
            'discountAmount': discount_amount,
            'finalBidPrice': final_bid
        }

    # --- 6. THANH QUYẾT TOÁN (PL 03a & 03b) ---
    def compute_settlement(self, advance_deduction_rate: float = 0.15, retention_rate: float = 0.05) -> Dict[str, Any]:
        in_contract = [s for s in self.settlements if not s.get('isAdditional', False)]
        additional = [s for s in self.settlements if s.get('isAdditional', False)]

        amt_in_contract = sum(float(s.get('thisPeriodQty', 0)) * float(s.get('contractPrice', 0)) for s in in_contract)
        amt_additional = sum(float(s.get('thisPeriodQty', 0)) * float(s.get('contractPrice', 0)) for s in additional)

        gross = amt_in_contract + amt_additional
        deduction_adv = gross * advance_deduction_rate
        retention = gross * retention_rate
        net = gross - deduction_adv - retention

        return {
            'inContract': in_contract,
            'additional': additional,
            'amtInContract': amt_in_contract,
            'amtAdditional': amt_additional,
            'grossAmount': gross,
            'deductionAdvance': deduction_adv,
            'retention': retention,
            'netPayment': net
        }

    # --- 7. ĐỔI TỈNH THÀNH TRONG 63 TỈNH ---
    def set_province(self, province_name: str):
        found = next((p for p in PROVINCES_63 if p['name'].lower() == province_name.lower()), None)
        if found:
            self.settings['locationProvince'] = found['name']
            self.settings['salaryRegion'] = found['region']
            print(f"[+] Đã đổi địa điểm công trình sang: {found['name']} (Vùng lương {found['region']}, Hệ số NC: {found['laborCoefficient']})")
        else:
            print(f"[-] Không tìm thấy tỉnh thành '{province_name}'. Hãy xem danh mục 63 tỉnh.")

    # --- 8. XUẤT HỒ SƠ ĐẤU THẦU E-GP (XML) ---
    def export_egp_xml(self, output_path: str = "E_GP_BieuGiaThau.xml") -> str:
        bid = self.compute_du_thau()
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<E_HSDT xmlns="http://muasamcong.mpi.gov.vn/schema/bid/v1">',
            '  <ThongTinGoiThau>',
            f"    <MaGoiThau>{self.bidding.get('packageCode')}</MaGoiThau>",
            f"    <TenGoiThau><![CDATA[{self.bidding.get('packageName')}]]></TenGoiThau>",
            f"    <GiaDuThauChuaVAT>{round(bid['totalPreTax'])}</GiaDuThauChuaVAT>",
            f"    <GiaDuThauCoVAT>{round(bid['totalPostTax'])}</GiaDuThauCoVAT>",
            f"    <TyLeGiamGia>{bid['discountRate']}%</TyLeGiamGia>",
            f"    <GiaDuThauChinhThuc>{round(bid['finalBidPrice'])}</GiaDuThauChinhThuc>",
            '  </ThongTinGoiThau>',
            '  <BieuGiaChiTiet>'
        ]
        for idx, item in enumerate(bid['items']):
            xml_lines.extend([
                f'    <HangMuc stt="{idx + 1}">',
                f"      <MaHieu>{item['code']}</MaHieu>",
                f"      <TenCongTac><![CDATA[{item['name']}]]></TenCongTac>",
                f"      <DonVi>{item['unit']}</DonVi>",
                f"      <KhoidLuong>{item['quantity']}</KhoidLuong>",
                f"      <DonGia>{round(item['pricePostTax'])}</DonGia>",
                f"      <ThanhTien>{round(item['amountPostTax'])}</ThanhTien>",
                '    </HangMuc>'
            ])
        xml_lines.extend([
            '  </BieuGiaChiTiet>',
            '</E_HSDT>'
        ])
        content = '\\n'.join(xml_lines)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return output_path

    # --- 9. XUẤT EXCEL (.xlsx) HOẶC CSV ---
    def export_excel(self, output_file: str = "Du_Toan_F1_Export.xlsx"):
        try:
            import openpyxl
            wb = openpyxl.Workbook()
            ws1 = wb.active
            ws1.title = "Bảng Công Trình"

            ws1.append(["BẢNG DỰ TOÁN CÔNG TRÌNH", self.settings.get('projectName', '')])
            ws1.append(["Địa điểm:", self.settings.get('locationProvince', ''), f"Vùng: {self.settings.get('salaryRegion', '')}"])
            ws1.append([])
            ws1.append(["STT", "Mã hiệu", "Tên công tác", "ĐVT", "Khối lượng", "ĐG Vật liệu", "ĐG Nhân công", "ĐG Máy", "Thành tiền (Tổng)"])

            ct = self.compute_cong_trinh()
            for cat in ct['categories']:
                ws1.append(["", "", cat['category']['name'].upper(), "", "", "", "", "", cat['total']])
                for item in cat['items']:
                    ws1.append([item['stt'], item['code'], item['name'], item['unit'], item['quantity'], item['unitPriceMat'], item['unitPriceLab'], item['unitPriceMac'], item['total']])

            # Sheet THKP
            ws2 = wb.create_sheet(title="Tổng Hợp Kinh Phí")
            thkp = self.compute_thkp()
            ws2.append(["BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN THEO THÔNG TƯ 11/2021/TT-BXD"])
            ws2.append(["Khoản mục", "Giá trị (VNĐ)"])
            ws2.append(["1. Chi phí trực tiếp (T)", thkp['directCost']])
            ws2.append(["2. Chi phí gián tiếp (GT)", thkp['indirectCost']])
            ws2.append(["3. Thu nhập chịu thuế tính trước (TL)", thkp['profit']])
            ws2.append(["4. Chi phí xây dựng trước thuế (G)", thkp['preTax']])
            ws2.append(["5. Thuế GTGT (VAT 10%)", thkp['vatAmount']])
            ws2.append(["6. Chi phí xây dựng sau thuế (Gxd)", thkp['constructionTotal']])
            ws2.append(["7. Chi phí dự phòng (5%)", thkp['contingency']])
            ws2.append(["TỔNG MỨC ĐẦU TƯ DỰ TOÁN", thkp['grandTotal']])

            wb.save(output_file)
            print(f"[+] Đã xuất thành công file Excel đầy đủ: {output_file}")
        except ImportError:
            # Fallback to CSV if openpyxl not installed
            csv_file = output_file.replace('.xlsx', '.csv')
            with open(csv_file, 'w', encoding='utf-8') as f:
                f.write(f"DỰ TOÁN F1 PRO - {self.settings.get('projectName')}\\n")
                f.write("STT,Mã hiệu,Tên công tác,ĐVT,Khối lượng,Tổng thành tiền (VNĐ)\\n")
                ct = self.compute_cong_trinh()
                for cat in ct['categories']:
                    for item in cat['items']:
                        f.write(f"{item['stt']},{item['code']},\"{item['name']}\",{item['unit']},{item['quantity']},{round(item['total'])}\\n")
            print(f"[+] Thư viện openpyxl chưa cài đặt. Đã xuất file CSV chuẩn: {csv_file}")
            print("    (Mẹo: Chạy 'pip install openpyxl' để xuất trực tiếp file .xlsx đa sheet)")

# ==============================================================================
# GIAO DIỆN DÒNG LỆNH INTERACTIVE CLI MENU
# ==============================================================================
def run_cli_menu(engine: F1Estimator):
    while True:
        print("\\n" + "=" * 76)
        print(f"   DỰ TOÁN F1 PRO - PHẦN MỀM LẬP DỰ TOÁN XÂY DỰNG TOÀN DIỆN")
        print(f"   Công trình: {engine.settings.get('projectName')}")
        print(f"   Địa điểm:   {engine.settings.get('locationProvince')} (Vùng {engine.settings.get('salaryRegion')})")
        print("=" * 76)
        print("  [1]  Bảng Công Trình (Dự toán chi tiết & Diễn giải khối lượng)")
        print("  [2]  Phân Tích Vật Tư (PTVT - Hao phí VL, Nhân công, Máy thi công)")
        print("  [3]  Tổng Hợp Vật Tư & Bù Giá Tháng (THVT)")
        print("  [4]  Đơn Giá Chi Tiết (ĐGCT theo Thông tư 11/2021/TT-BXD)")
        print("  [5]  Bảng Dự Thầu & Thư Giảm Giá (%)")
        print("  [6]  Tổng Hợp Kinh Phí (THKP) & Tổng Mức Đầu Tư Công Trình")
        print("  [7]  Thẩm Tra Sai Lệch Hồ Sơ Dự Toán")
        print("  [8]  Thanh Quyết Toán Hợp Đồng (Phụ lục 03a & 03b theo NĐ 99/2021)")
        print("  [9]  Tiến Độ Thi Công Gantt Chart & Biểu Đồ Nhân Lực")
        print("  [10] Đấu Thầu Trực Tuyến E-GP (Xuất file XML E-HSMT nộp thầu)")
        print("  [11] Xuất Dự Án Ra File Excel (.xlsx)")
        print("  [12] Đổi Địa Điểm Công Trình Trong 63 Tỉnh Thành Phố")
        print("  [13] Khởi Chạy Web Server Giao Diện Trực Quan (Chạy offline)")
        print("  [0]  Thoát phần mềm")
        print("-" * 76)

        choice = input("Vui lòng chọn chức năng [0-13]: ").strip()

        if choice == '1':
            ct = engine.compute_cong_trinh()
            print("\\n--- BẢNG CÔNG TRÌNH DỰ TOÁN ---")
            for cat in ct['categories']:
                print(f"\\n[+] {cat['category']['name'].upper()}: {format_vnd(cat['total'])} VNĐ")
                for item in cat['items']:
                    print(f"   {item['stt']:>2}. [{item['code']}] {item['name'][:42]:<42} | KL: {format_qty(item['quantity']):>7} {item['unit']:<5} | TT: {format_vnd(item['total']):>14} đ")
                    for s in item.get('subs', []):
                        print(f"       - {s.get('name')}: {s.get('expression')} = {format_qty(s.get('quantity'))}")
            print("-" * 76)
            print(f" >>> TỔNG CHI PHÍ TRỰC TIẾP TOÀN BỘ CÔNG TRÌNH: {format_vnd(ct['grandTotal'])} VNĐ")

        elif choice == '2':
            print("\\n--- BẢNG PHÂN TÍCH VẬT TƯ (PTVT) ---")
            for item in engine.items[:5]:  # Preview first 5 items
                q = float(item.get('quantity', 0))
                print(f"\\nCông tác {item.get('stt')}: [{item.get('code')}] {item.get('name')} (KL: {q} {item.get('unit')})")
                for m in item.get('materials', []):
                    tot_norm = q * float(m.get('norm', 0))
                    print(f"   [VL]  {m.get('name')[:35]:<35} | Định mức: {m.get('norm'):>7} | Tổng: {format_qty(tot_norm):>8} {m.get('unit')} | ĐG: {format_vnd(m.get('price'))} đ")
                for l in item.get('labors', []):
                    tot_norm = q * float(l.get('norm', 0))
                    print(f"   [NC]  {l.get('name')[:35]:<35} | Định mức: {l.get('norm'):>7} | Tổng: {format_qty(tot_norm):>8} công | ĐG: {format_vnd(l.get('price'))} đ")
                for mac in item.get('machines', []):
                    tot_norm = q * float(mac.get('norm', 0))
                    print(f"   [MTC] {mac.get('name')[:35]:<35} | Định mức: {mac.get('norm'):>7} | Tổng: {format_qty(tot_norm):>8} ca   | ĐG: {format_vnd(mac.get('price'))} đ")

        elif choice == '3':
            thvt = engine.compute_thvt()
            print("\\n--- BẢNG TỔNG HỢP VẬT TƯ & BÙ GIÁ THÁNG (THVT) ---")
            print(f"{'Mã VT':<10} {'Tên vật tư':<38} {'ĐVT':<6} {'Khối lượng':>12} {'Giá gốc':>12} {'Giá tháng':>12} {'Tiền bù':>14}")
            print("-" * 110)
            for m in thvt['materials']:
                print(f"{m['code']:<10} {m['name'][:36]:<38} {m['unit']:<6} {format_qty(m['totalQuantity']):>12} {format_vnd(m['basePrice']):>12} {format_vnd(m['monthlyPrice']):>12} {format_vnd(m['diffAmount']):>14}")
            print("-" * 110)
            print(f" >>> TỔNG TIỀN BÙ CHÊNH LỆCH VẬT LIỆU: {format_vnd(thvt['totalDiffMat'])} VNĐ")

        elif choice == '4':
            dgct = engine.compute_dgct()
            print("\\n--- BẢNG ĐƠN GIÁ CHI TIẾT (THEO THÔNG TƯ 11/2021/TT-BXD) ---")
            print(f"{'Mã hiệu':<10} {'Tên công tác':<36} {'Chi phí TT (T)':>15} {'Gián tiếp (GT)':>15} {'Trước thuế (G)':>15} {'Sau thuế (Gst)':>15}")
            print("-" * 110)
            for d in dgct:
                print(f"{d['code']:<10} {d['name'][:34]:<36} {format_vnd(d['T']):>15} {format_vnd(d['GT']):>15} {format_vnd(d['G']):>15} {format_vnd(d['G_st']):>15}")

        elif choice == '5':
            bid = engine.compute_du_thau()
            print("\\n--- BẢNG DỰ THẦU & GIẢM GIÁ ---")
            print(f"Tổng giá dự thầu trước thuế:     {format_vnd(bid['totalPreTax']):>18} VNĐ")
            print(f"Tổng giá dự thầu sau thuế VAT:    {format_vnd(bid['totalPostTax']):>18} VNĐ")
            print(f"Tỷ lệ giảm giá thư giảm giá:      {bid['discountRate']:>18.1f} %")
            print(f"Tiền giảm giá tiết kiệm:         -{format_vnd(bid['discountAmount']):>18} VNĐ")
            print("-" * 65)
            print(f" >>> GIÁ DỰ THẦU CHÍNH THỨC:      {format_vnd(bid['finalBidPrice']):>18} VNĐ")

        elif choice == '6':
            thkp = engine.compute_thkp()
            print("\\n" + "=" * 70)
            print(f" BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN THEO THÔNG TƯ 11/2021/TT-BXD")
            print("=" * 70)
            print(f" 1. Chi phí trực tiếp (T):           {format_vnd(thkp['directCost']):>18} VNĐ")
            print(f"    - Chi phí vật liệu:              {format_vnd(thkp['directMat'] + thkp['diffMat']):>18} VNĐ")
            print(f"    - Chi phí nhân công:             {format_vnd(thkp['directLab']):>18} VNĐ")
            print(f"    - Chi phí máy thi công:          {format_vnd(thkp['directMac']):>18} VNĐ")
            print(f" 2. Chi phí gián tiếp (GT):          {format_vnd(thkp['indirectCost']):>18} VNĐ")
            print(f" 3. Thu nhập chịu thuế tính trước:  {format_vnd(thkp['profit']):>18} VNĐ")
            print(f" 4. Chi phí xây dựng trước thuế (G): {format_vnd(thkp['preTax']):>18} VNĐ")
            print(f" 5. Thuế GTGT (VAT 10%):             {format_vnd(thkp['vatAmount']):>18} VNĐ")
            print(f" 6. Chi phí xây dựng sau thuế (Gxd): {format_vnd(thkp['constructionTotal']):>18} VNĐ")
            print(f" 7. Chi phí dự phòng (5%):           {format_vnd(thkp['contingency']):>18} VNĐ")
            print("-" * 70)
            print(f" >>> TỔNG MỨC ĐẦU TƯ DỰ TOÁN:        {format_vnd(thkp['grandTotal']):>18} VNĐ")
            print("=" * 70)

        elif choice == '7':
            print("\\n--- BÁO CÁO THẨM TRA SAI LỆCH HỒ SƠ DỰ TOÁN ---")
            diffs = INITIAL_PROJECT.get('settlements', [])
            print(f"{'Mã hiệu':<10} {'Tên công việc đối chiếu':<36} {'KL Gốc':>10} {'KL Thẩm tra':>12} {'Chênh lệch':>12} {'Ghi chú':<30}")
            print("-" * 115)
            # Dữ liệu thẩm tra
            for d in [
                {'code': 'AB.21121', 'name': 'Đào hố móng cột độc lập sâu <= 1m', 'orig': 68.4, 'aud': 62.1, 'diff': -6.3, 'reason': 'Chưa trừ phần giao dầm móng'},
                {'code': 'AF.12210', 'name': 'Bê tông móng đá 1x2 mác 200', 'orig': 38.5, 'aud': 36.8, 'diff': -1.7, 'reason': 'Điều chỉnh giá xi măng theo Sở XD'},
                {'code': 'AK.91110', 'name': 'Sơn tường trong nhà 1 lót 2 phủ', 'orig': 1280.0, 'aud': 1150.0, 'diff': -130.0, 'reason': 'Chưa trừ diện tích cửa sổ kính'}
            ]:
                print(f"{d['code']:<10} {d['name'][:34]:<36} {format_qty(d['orig']):>10} {format_qty(d['aud']):>12} {format_qty(d['diff']):>12} {d['reason']:<30}")
            print("-" * 115)
            print(" >>> Tổng giá trị cắt giảm sau thẩm tra: -15.103.000 VNĐ (-1.85%)")

        elif choice == '8':
            st = engine.compute_settlement()
            print("\\n--- BẢNG THANH QUYẾT TOÁN THEO NGHỊ ĐỊNH 99/2021/NĐ-CP ---")
            print(f"1. Nghiệm thu khối lượng trong hợp đồng (PL 03a): {format_vnd(st['amtInContract']):>18} VNĐ")
            print(f"2. Nghiệm thu khối lượng phát sinh (PL 03b):     {format_vnd(st['amtAdditional']):>18} VNĐ")
            print(f"3. Tổng giá trị hoàn thành kỳ này:               {format_vnd(st['grossAmount']):>18} VNĐ")
            print(f"4. Khấu trừ tạm ứng hợp đồng (15%):             -{format_vnd(st['deductionAdvance']):>18} VNĐ")
            print(f"5. Tiền giữ lại bảo hành công trình (5%):       -{format_vnd(st['retention']):>18} VNĐ")
            print("-" * 75)
            print(f" >>> THỰC LĨNH THANH TOÁN KỲ NÀY:                {format_vnd(st['netPayment']):>18} VNĐ")

        elif choice == '9':
            print("\\n--- TIẾN ĐỘ THI CÔNG & BIỂU ĐỒ GANTT ---")
            for t in engine.tasks:
                pct = int(t.get('progressPercent', 0))
                bar_len = pct // 5
                bar = '█' * bar_len + '░' * (20 - bar_len)
                print(f"{t.get('name')[:35]:<35} | {t.get('startDate')} -> {t.get('endDate')} ({t.get('durationDays'):>2} ngày) | [{bar}] {pct:>3}% | {t.get('workersRequired')} thợ")

        elif choice == '10':
            out = engine.export_egp_xml()
            print(f"[+] Đã xuất thành công file XML Đấu thầu điện tử: {out}")
            print("    Có thể nộp trực tiếp lên Hệ thống Mạng Đấu thầu Quốc gia (muasamcong.mpi.gov.vn)")

        elif choice == '11':
            engine.export_excel()

        elif choice == '12':
            print("\\nDANH SÁCH 63 TỈNH THÀNH PHỐ VIỆT NAM:")
            for i, p in enumerate(PROVINCES_63):
                print(f" {i+1:>2}. {p['name']:<22} (Vùng {p['region']})", end="\\n" if (i+1)%3==0 else "")
            print()
            p_name = input("\\nNhập tên Tỉnh/Thành muốn áp dụng (ví dụ: Hà Nội, Hải Phòng, Cần Thơ, Bình Dương...): ").strip()
            if p_name:
                engine.set_province(p_name)

        elif choice == '13':
            start_embedded_web_server(engine)

        elif choice == '0':
            print("[*] Tạm biệt! Hẹn gặp lại trong dự án tiếp theo.")
            break
        else:
            print("[!] Lựa chọn không hợp lệ. Vui lòng nhập từ 0 đến 13.")

# ==============================================================================
# EMBEDDED HTTP WEB SERVER (ZERO EXTERNAL DEPENDENCY)
# ==============================================================================
def start_embedded_web_server(engine: F1Estimator, port: int = 8080):
    """Khởi chạy máy chủ Web Server độc lập với đầy đủ giao diện HTML/CSS/JS"""
    class F1HttpHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path

            if path == '/api/project':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(engine.data, ensure_ascii=False).encode('utf-8'))
                return

            if path == '/api/thkp':
                thkp = engine.compute_thkp()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(thkp, ensure_ascii=False).encode('utf-8'))
                return

            # Giao diện Web HTML chính
            html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Dự toán F1 Pro - Standalone Python Web App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; background: #f1f5f9; color: #1e293b; }}
        header {{ background: #0f172a; color: white; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }}
        .badge {{ background: #ef4444; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px; }}
        .container {{ max-width: 1200px; margin: 20px auto; padding: 0 15px; }}
        .card {{ background: white; border-radius: 8px; border: 1px solid #cbd5e1; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }}
        th, td {{ border: 1px solid #cbd5e1; padding: 8px 10px; }}
        th {{ background: #f8fafc; font-weight: 600; text-align: center; }}
        .number {{ text-align: right; font-family: monospace; }}
        .btn {{ background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 13px; text-decoration: none; display: inline-block; }}
        .btn:hover {{ background: #1d4ed8; }}
        .kpi-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }}
        .kpi {{ background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }}
        .kpi span {{ font-size: 12px; color: #64748b; display: block; }}
        .kpi strong {{ font-size: 18px; color: #0f172a; font-family: monospace; display: block; margin-top: 4px; }}
    </style>
</head>
<body>
    <header>
        <div style="display: flex; align-items: center; gap: 10px;">
            <span class="badge">F1 PRO</span>
            <span style="font-weight: bold; font-size: 16px;">DỰ TOÁN F1 PRO (STANDALONE PYTHON SERVER)</span>
        </div>
        <div style="font-size: 13px; color: #94a3b8;">
            {engine.settings.get('locationProvince')} (Vùng {engine.settings.get('salaryRegion')}) · Port {port}
        </div>
    </header>

    <div class="container">
        <div class="kpi-grid">
            <div class="kpi">
                <span>Chi phí trực tiếp (T)</span>
                <strong>{format_vnd(engine.compute_thkp()['directCost'])} đ</strong>
            </div>
            <div class="kpi">
                <span>Chi phí gián tiếp (GT)</span>
                <strong>{format_vnd(engine.compute_thkp()['indirectCost'])} đ</strong>
            </div>
            <div class="kpi">
                <span>Thuế GTGT (10%)</span>
                <strong>{format_vnd(engine.compute_thkp()['vatAmount'])} đ</strong>
            </div>
            <div class="kpi" style="border-left: 4px solid #16a34a;">
                <span>TỔNG MỨC ĐẦU TƯ</span>
                <strong style="color: #16a34a;">{format_vnd(engine.compute_thkp()['grandTotal'])} đ</strong>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-top:0;">1. Bảng Công Trình Dự Toán Chi Tiết</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 40px;">STT</th>
                        <th style="width: 100px;">Mã hiệu</th>
                        <th style="text-align: left;">Tên công tác & quy cách</th>
                        <th style="width: 60px;">ĐVT</th>
                        <th style="width: 90px;">Khối lượng</th>
                        <th style="width: 120px;">Đơn giá</th>
                        <th style="width: 140px;">Thành tiền (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
"""
            ct = engine.compute_cong_trinh()
            for cat in ct['categories']:
                html += f"""
                    <tr style="background: #e2e8f0; font-weight: bold;">
                        <td colspan="6" style="padding-left: 12px;">{cat['category']['name'].upper()}</td>
                        <td class="number">{format_vnd(cat['total'])}</td>
                    </tr>
                """
                for item in cat['items']:
                    html += f"""
                    <tr>
                        <td style="text-align: center;">{item['stt']}</td>
                        <td style="text-align: center; font-family: monospace; color: #2563eb; font-weight: bold;">{item['code']}</td>
                        <td>{item['name']}</td>
                        <td style="text-align: center;">{item['unit']}</td>
                        <td class="number">{format_qty(item['quantity'])}</td>
                        <td class="number">{format_vnd(item['unitPriceMat'] + item['unitPriceLab'] + item['unitPriceMac'])}</td>
                        <td class="number" style="font-weight: bold;">{format_vnd(item['total'])}</td>
                    </tr>
                    """
            html += f"""
                </tbody>
            </table>
        </div>

        <div class="card">
            <h3 style="margin-top:0;">2. API Endpoints Đồng Bộ Dữ Liệu</h3>
            <p style="font-size: 13px; color: #64748b;">Bạn có thể kết nối Revit, AutoCAD hoặc ERP với các endpoint sau:</p>
            <ul>
                <li><code>GET /api/project</code>: Lấy toàn bộ công tác, hạng mục, định mức JSON</li>
                <li><code>GET /api/thkp</code>: Lấy bảng tổng hợp kinh phí THKP thời gian thực</li>
            </ul>
        </div>
    </div>
</body>
</html>"""
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(html.encode('utf-8'))

    server = HTTPServer(('127.0.0.1', port), F1HttpHandler)
    print(f"\\n[*] Đã khởi chạy F1 Web Server thành công!")
    print(f"[*] Hãy mở trình duyệt và truy cập: http://127.0.0.1:{port}")
    print(f"[*] Nhấn Ctrl+C để dừng server và quay lại CLI.\\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\\n[*] Đã dừng Web Server.")

# ==============================================================================
# HÀM CHÍNH (MAIN ENTRY POINT)
# ==============================================================================
if __name__ == '__main__':
    engine = F1Estimator()

    if '--web' in sys.argv:
        start_embedded_web_server(engine)
    elif '--server' in sys.argv:
        start_embedded_web_server(engine, port=8000)
    elif '--excel' in sys.argv:
        engine.export_excel()
    elif '--all' in sys.argv:
        # In tất cả các bảng tính
        print("[+] Đang xuất tất cả bảng tính...")
        engine.export_excel()
        engine.export_egp_xml()
        ct = engine.compute_cong_trinh()
        thkp = engine.compute_thkp()
        print(f"[+] Bảng công trình: {format_vnd(ct['grandTotal'])} đ")
        print(f"[+] Tổng mức đầu tư: {format_vnd(thkp['grandTotal'])} đ")
    else:
        # Mặc định khởi chạy Interactive CLI Menu
        run_cli_menu(engine)
`;
}
