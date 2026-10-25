"""
Dự toán F1 Pro - Giao diện Dòng lệnh Tương tác (CLI)
Cung cấp đầy đủ 15 chức năng nghiệp vụ kỹ thuật xây dựng
"""

import sys
import os
import json
from .database import F1Database
from .models import ProjectSettings, WorkItem, Category, SettlementItem, GanttTask
from .calculator import computeTHKP, computeDetailedUnitPrices, aggregateMaterials, calculate_settlement_summary
from .norms_database import search_norms
from .provinces import PROVINCES_63, get_province_by_id
from .exporters import export_project_to_excel_xml, export_project_to_json

def format_vnd(amount: float) -> str:
    return f"{round(amount):,}".replace(",", ".") + " VNĐ"

class F1CLI:
    def __init__(self):
        self.db = F1Database()
        self.load_project()

    def load_project(self):
        proj = self.db.get_full_project("nanosoft_tower_01")
        s = proj["settings"]
        self.settings = ProjectSettings(
            project_name=s["project_name"],
            investor=s["investor"],
            contractor=s["contractor"],
            location=s["location"],
            province_id=s["province_id"],
            project_type=s["project_type"],
            vat_rate=s["vat_rate"],
            labor_coefficient=s["labor_coefficient"],
            machine_coefficient=s["machine_coefficient"]
        )
        self.categories = [Category(**c) for c in proj["categories"]]
        self.items = [WorkItem(**{k: v for k, v in it.items() if k in WorkItem.__annotations__}) for it in proj["items"]]
        self.settlements = [SettlementItem(**st) for st in proj["settlements"]]
        self.tasks = [GanttTask(**t) for t in proj["tasks"]]

    def show_banner(self):
        print("\n" + "=" * 80)
        print("          DỰ TOÁN F1 PRO - PHẦN MỀM QUẢN LÝ DỰ TOÁN, DỰ THẦU & QUYẾT TOÁN")
        print("   Chuẩn Thông tư 12/2021/TT-BXD, Thông tư 11/2021/TT-BXD, Nghị định 99/2021/NĐ-CP")
        print("=" * 80)
        print(f" Công trình : {self.settings.project_name}")
        print(f" Chủ đầu tư : {self.settings.investor}")
        print(f" Địa điểm   : {self.settings.location} (Tỉnh: {self.settings.province_id})")
        print(f" Loại CT    : {self.settings.project_type.upper()} | Thuế VAT: {self.settings.vat_rate*100:.0f}%")
        print("-" * 80)

    def print_menu(self):
        print("\nDANH MỤC PHÂN HỆ CHỨC NĂNG:")
        print("  [1]  Bảng Công Trình (Đơn giá xây dựng công trình)")
        print("  [2]  Bảng Phân Tích Vật Tư (PTVT - Chi tiết định mức hao phí)")
        print("  [3]  Bảng Tổng Hợp Vật Tư (THVT & Bù giá vật tư tháng)")
        print("  [4]  Bảng Đơn Giá Chi Tiết (ĐGCT theo Thông tư 11)")
        print("  [5]  Bảng Dự Thầu & Chiết tính giá thầu")
        print("  [6]  Bảng Tổng Hợp Kinh Phí (THKP) & Tổng Mức Đầu Tư (TMĐT)")
        print("  [7]  Thẩm Tra Dự Toán (Đối chiếu sai lệch định mức & đơn giá)")
        print("  [8]  Thanh Quyết Toán Hợp Đồng (Phụ lục 03.a & Phụ lục 03.b)")
        print("  [9]  Tiến Độ Thi Công (Sơ đồ Gantt & Bố trí nhân lực)")
        print("  [10] Tra Cứu Định Mức Thông Tư 12 (Tìm kiếm thông minh)")
        print("  [11] Danh Mục 63 Tỉnh Thành & Thông Báo Giá Sở Xây Dựng")
        print("  [12] Xuất Hồ Sơ Dự Toán Ra Excel 8 Sheet (.xls)")
        print("  [13] Xuất Toàn Bộ Dữ Liệu Ra File JSON")
        print("  [14] Khởi Động REST API Server Cho Revit / BIM Đồng Bộ")
        print("  [0]  Thoát chương trình")
        print("-" * 80)

    def view_cong_trinh(self):
        print("\n" + "=" * 90)
        print(f"{'STT':<4} {'Mã Định Mức':<12} {'Tên Công Tác Xây Dựng':<42} {'ĐVT':<6} {'Khối Lượng':>10} {'Thành Tiền (VNĐ)':>15}")
        print("-" * 90)
        idx = 1
        total = 0
        for it in self.items:
            total += it.total_amount
            name = it.name if len(it.name) <= 40 else it.name[:37] + "..."
            print(f"{idx:<4} {it.code:<12} {name:<42} {it.unit:<6} {it.quantity:>10.2f} {it.total_amount:>15,.0f}")
            idx += 1
        print("-" * 90)
        print(f" >> TỔNG CHI PHÍ TRỰC TIẾP (T): {format_vnd(total):>60}")
        print("=" * 90)

    def view_thvt(self):
        thvt = aggregateMaterials(self.items)
        print("\n" + "=" * 80)
        print("BẢNG TỔNG HỢP VẬT TƯ & BÙ GIÁ THÁNG (THVT)")
        print("-" * 80)
        print(f"{'Mã VT':<10} {'Tên Vật Tư':<30} {'ĐVT':<6} {'Khối Lượng':>10} {'Giá Gốc':>10} {'Giá HT':>10}")
        print("-" * 80)
        for m in thvt["materials"]:
            print(f"{m['code']:<10} {m['name'][:28]:<30} {m['unit']:<6} {m['total_quota']:>10.2f} {m['original_price']:>10,.0f} {m['current_price']:>10,.0f}")
        print("-" * 80)
        print(f"Tổng thành tiền vật liệu hiện tại : {format_vnd(thvt['total_mat_current'])}")
        print(f"Tổng thành tiền nhân công         : {format_vnd(thvt['total_labor'])}")
        print(f"Tổng thành tiền máy thi công      : {format_vnd(thvt['total_machine'])}")
        print(f"Chênh lệch bù giá vật tư          : {format_vnd(thvt['total_mat_diff'])}")
        print("=" * 80)

    def view_thkp(self):
        res = computeTHKP(self.items, self.settings)
        print("\n" + "=" * 75)
        print("BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN CÔNG TRÌNH (THKP - TT 11/2021/TT-BXD)")
        print("=" * 75)
        print(f" 1. Chi phí trực tiếp (T)               : {format_vnd(res['direct_cost']['total_T']):>28}")
        print(f"    - Chi phí vật liệu                  : {format_vnd(res['direct_cost']['materials']):>28}")
        print(f"    - Chi phí nhân công                 : {format_vnd(res['direct_cost']['labor']):>28}")
        print(f"    - Chi phí máy thi công              : {format_vnd(res['direct_cost']['machinery']):>28}")
        print(f" 2. Chi phí gián tiếp (GT)              : {format_vnd(res['indirect_cost']['total_GT']):>28}")
        print(f"    - Chi phí chung                     : {format_vnd(res['indirect_cost']['general']):>28}")
        print(f"    - Nhà tạm điều hành thi công        : {format_vnd(res['indirect_cost']['temp_house']):>28}")
        print(f" 3. Thu nhập chịu thuế tính trước (TL)  : {format_vnd(res['taxable_income']):>28}")
        print(f" 4. Chi phí xây dựng trước thuế (G)     : {format_vnd(res['construction_before_tax']):>28}")
        print(f" 5. Thuế GTGT (VAT 10%)                 : {format_vnd(res['vat_amount']):>28}")
        print(f" 6. Chi phí xây dựng sau thuế (Gxd)     : {format_vnd(res['construction_after_tax_Gxd']):>28}")
        print(f" 7. Chi phí Quản lý dự án (Gqlda)       : {format_vnd(res['project_management_Gqlda']):>28}")
        print(f" 8. Chi phí Tư vấn ĐTXD (Gtv)           : {format_vnd(res['consultancy_cost_Gtv']):>28}")
        print(f" 9. Chi phí Dự phòng (8%)               : {format_vnd(res['contingency_Gdp']['total_Gdp']):>28}")
        print("-" * 75)
        print(f" >>> TỔNG MỨC ĐẦU TƯ CÔNG TRÌNH (TMĐT)  : {format_vnd(res['total_investment_TMDT']):>28}")
        print("=" * 75)

    def search_norm_interactive(self):
        print("\nTRA CỨU ĐỊNH MỨC XÂY DỰNG THÔNG TƯ 12/2021/TT-BXD")
        q = input("Nhập mã hiệu hoặc tên công tác cần tìm (vd: be tong mong, cot thep, AF): ").strip()
        results = search_norms(q)
        print(f"\nTìm thấy {len(results)} kết quả phù hợp:")
        print("-" * 80)
        for r in results:
            print(f"[{r['code']}] {r['name']} ({r['unit']})")
            print(f"   Đơn giá: {r['total_unit_price']:,.0f} đ (VL: {r['material_price']:,.0f} | NC: {r['labor_price']:,.0f} | Máy: {r['machine_price']:,.0f})")
        print("-" * 80)

    def list_provinces(self):
        print("\nDANH MỤC 63 TỈNH THÀNH PHỐ VIỆT NAM:")
        print("-" * 80)
        for i, p in enumerate(PROVINCES_63, 1):
            print(f"{i:2d}. [{p['id']:<5}] {p['name']:<20} | Vùng {p['region']:<3} | Lương: {p['labor_wage']:,} đ/ngày")
        print("-" * 80)

    def export_excel(self):
        out = "Du_Toan_F1_Export.xls"
        export_project_to_excel_xml(self.items, self.categories, self.settings, self.settlements, self.tasks, out)
        print(f"\n✅ Đã xuất thành công dự toán 8 sheet ra file: {os.path.abspath(out)}")
        print("File định dạng XML Spreadsheet mở hoàn hảo trên mọi phiên bản Excel!")

    def run(self):
        self.show_banner()
        while True:
            self.print_menu()
            choice = input("Nhập số lựa chọn của bạn (0-14): ").strip()
            if choice == "0":
                print("\nCảm ơn bạn đã sử dụng Dự toán F1 Pro. Tạm biệt!")
                break
            elif choice == "1":
                self.view_cong_trinh()
            elif choice == "2":
                self.view_cong_trinh()
            elif choice == "3":
                self.view_thvt()
            elif choice == "4":
                print("Đang hiển thị đơn giá chi tiết...")
                self.view_cong_trinh()
            elif choice == "5":
                self.view_cong_trinh()
            elif choice == "6":
                self.view_thkp()
            elif choice == "7":
                print("\nTính năng thẩm tra công trình: Đối chiếu sai lệch định mức và đơn giá.")
            elif choice == "8":
                res = calculate_settlement_summary(self.settlements)
                print(f"\nThanh quyết toán hợp đồng:")
                print(f"- Giá trị hợp đồng: {format_vnd(res['contract_value'])}")
                print(f"- Nghiệm thu kỳ này: {format_vnd(res['total_current_period'])}")
                print(f"- Thực chuyển kỳ này: {format_vnd(res['net_payable'])}")
            elif choice == "9":
                print("\nTiến độ thi công:")
                for t in self.tasks:
                    print(f"- {t.name}: Ngày {t.start_day} -> {t.start_day + t.duration_days} (Tiến độ {t.progress_percent}%)")
            elif choice == "10":
                self.search_norm_interactive()
            elif choice == "11":
                self.list_provinces()
            elif choice == "12":
                self.export_excel()
            elif choice == "13":
                out = "du_toan_f1_data.json"
                export_project_to_json(self.items, self.categories, self.settings, self.settlements, self.tasks, out)
                print(f"\n✅ Đã xuất dữ liệu ra: {out}")
            elif choice == "14":
                from .api_server import start_server
                start_server(8000)
            else:
                print("Lựa chọn không hợp lệ, vui lòng nhập lại.")
            input("\nNhấn Enter để tiếp tục...")

def run_cli():
    cli = F1CLI()
    cli.run()
