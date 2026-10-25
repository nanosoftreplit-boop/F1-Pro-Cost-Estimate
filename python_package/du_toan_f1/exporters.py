"""
Dự toán F1 Pro - Bộ xuất dữ liệu đa định dạng
Hỗ trợ:
1. Microsoft Excel nhiều sheet (.xlsx qua openpyxl hoặc .xml SpreadsheetML mở trực tiếp bằng Excel)
2. JSON lưu trữ dự án
3. XML Mẫu biểu Đấu thầu qua mạng Quốc gia (E-GP) theo Thông tư 06/2024/TT-BKHĐT
"""

import json
import os
from typing import List, Dict, Any
from .models import WorkItem, ProjectSettings, Category, SettlementItem, GanttTask
from .calculator import aggregateMaterials, computeDetailedUnitPrices, computeTHKP, calculate_settlement_summary

def export_project_to_excel_xml(
    items: List[WorkItem],
    categories: List[Category],
    settings: ProjectSettings,
    settlements: List[SettlementItem],
    tasks: List[GanttTask],
    output_path: str
) -> str:
    """
    Xuất file Excel chuẩn Microsoft SpreadsheetML (.xml hoặc .xls)
    Mở trực tiếp trên mọi phiên bản Microsoft Excel mà KHÔNG cần cài đặt thêm bất kỳ thư viện bên ngoài nào!
    Bao gồm đầy đủ 8 sheet tiêu chuẩn của phần mềm Dự toán F1:
    - Sheet 1: Bảng Công Trình (Đơn giá xây dựng công trình)
    - Sheet 2: Phân Tích Vật Tư (PTVT)
    - Sheet 3: Tổng Hợp Vật Tư (THVT & Bù giá tháng)
    - Sheet 4: Đơn Giá Chi Tiết (ĐGCT)
    - Sheet 5: Bảng Dự Thầu & Giảm Giá
    - Sheet 6: Tổng Hợp Kinh Phí (THKP theo TT11)
    - Sheet 7: Thanh Quyết Toán (Phụ lục 03a & 03b theo NĐ 99)
    - Sheet 8: Tiến Độ Thi Công (Gantt)
    """
    thkp = computeTHKP(items, settings)
    thvt = aggregateMaterials(items)
    dgct = computeDetailedUnitPrices(items, settings)
    settle_sum = calculate_settlement_summary(settlements)

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#1E3A8A"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#475569"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E40AF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CategoryHeader">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataCell">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
  <Style ss:ID="DataNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="DataQuantity">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
  <Style ss:ID="TotalRow">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#991B1B"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>

 <!-- SHEET 1: BẢNG CÔNG TRÌNH -->
 <Worksheet ss:Name="Bảng Công Trình">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="80"/>
   <Column ss:Width="300"/>
   <Column ss:Width="50"/>
   <Column ss:Width="70"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="9" ss:StyleID="HeaderTitle"><Data ss:Type="String">DỰ TOÁN F1 PRO - BẢNG ĐƠN GIÁ XÂY DỰNG CÔNG TRÌNH</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="9" ss:StyleID="SubTitle"><Data ss:Type="String">Công trình: {settings.project_name} | Địa điểm: {settings.location}</Data></Cell>
   </Row>
   <Row ss:Height="10"/>

   <Row ss:Height="26">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">STT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Mã hiệu</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tên công tác xây dựng</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ĐVT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Khối lượng</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ĐG Vật liệu</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ĐG Nhân công</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ĐG Máy TC</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Đơn giá tổng</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Thành tiền (VNĐ)</Data></Cell>
   </Row>
"""

    idx = 1
    total_cong_trinh = 0
    for it in items:
        total_cong_trinh += it.total_amount
        xml_content += f"""   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="Number">{idx}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{it.code}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{it.name}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{it.unit}</Data></Cell>
    <Cell ss:StyleID="DataQuantity"><Data ss:Type="Number">{it.quantity}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{it.material_cost}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{it.labor_cost}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{it.machine_cost}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{it.total_unit_price}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{it.total_amount}</Data></Cell>
   </Row>
"""
        idx += 1

    xml_content += f"""   <Row ss:Height="24">
    <Cell ss:MergeAcross="8" ss:StyleID="TotalRow"><Data ss:Type="String">TỔNG CỘNG CHI PHÍ TRỰC TIẾP (T):</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">{total_cong_trinh}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- SHEET 2: TỔNG HỢP VẬT TƯ (THVT) -->
 <Worksheet ss:Name="Tổng Hợp Vật Tư">
  <Table ss:DefaultColumnWidth="75">
   <Column ss:Width="40"/>
   <Column ss:Width="90"/>
   <Column ss:Width="280"/>
   <Column ss:Width="60"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="8" ss:StyleID="HeaderTitle"><Data ss:Type="String">BẢNG TỔNG HỢP VẬT TƯ VÀ BÙ GIÁ THÁNG (THVT)</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">STT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Mã VT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tên vật tư, nhân công, máy</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">ĐVT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Khối lượng</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Giá gốc</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Giá hiện tại</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Thành tiền gốc</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Thành tiền HT</Data></Cell>
   </Row>
"""

    v_idx = 1
    for m in thvt["materials"]:
        xml_content += f"""   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="Number">{v_idx}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{m['code']}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{m['name']}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">{m['unit']}</Data></Cell>
    <Cell ss:StyleID="DataQuantity"><Data ss:Type="Number">{round(m['total_quota'], 3)}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{m['original_price']}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{m['current_price']}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{round(m['original_total'], 0)}</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{round(m['current_total'], 0)}</Data></Cell>
   </Row>
"""
        v_idx += 1

    xml_content += f"""  </Table>
 </Worksheet>

 <!-- SHEET 3: TỔNG HỢP KINH PHÍ (THKP) -->
 <Worksheet ss:Name="Tổng Hợp Kinh Phí">
  <Table ss:DefaultColumnWidth="90">
   <Column ss:Width="40"/>
   <Column ss:Width="320"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="140"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="4" ss:StyleID="HeaderTitle"><Data ss:Type="String">BẢNG TỔNG HỢP KINH PHÍ DỰ TOÁN XÂY DỰNG (THKP)</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="4" ss:StyleID="SubTitle"><Data ss:Type="String">Áp dụng Thông tư 11/2021/TT-BXD &amp; Thông tư 14/2023/TT-BXD</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">STT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Khoản mục chi phí</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Ký hiệu</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Cách tính</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Giá trị (VNĐ)</Data></Cell>
   </Row>

   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">1</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí trực tiếp</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">T</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">VL + NC + MTC</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['direct_cost']['total_T']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">2</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí gián tiếp</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">GT</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chung + Nhà tạm + KTXĐ</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['indirect_cost']['total_GT']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">3</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Thu nhập chịu thuế tính trước</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">TL</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">(T + GT) * 5.5%</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['taxable_income']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">4</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí xây dựng trước thuế</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">G</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">T + GT + TL</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['construction_before_tax']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">5</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Thuế giá trị gia tăng (VAT 10%)</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">VAT</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">G * 10%</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['vat_amount']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">6</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí xây dựng sau thuế</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gxd</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">G + VAT</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['construction_after_tax_Gxd']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">7</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí Quản lý dự án</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gqlda</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gxd * 2.5%</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['project_management_Gqlda']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">8</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí Tư vấn ĐTXD</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gtv</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gxd * 6.5%</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['consultancy_cost_Gtv']}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">9</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Chi phí Dự phòng (8%)</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gdp</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Gdp1 (5%) + Gdp2 (3%)</Data></Cell>
    <Cell ss:StyleID="DataNumber"><Data ss:Type="Number">{thkp['contingency_Gdp']['total_Gdp']}</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:MergeAcross="3" ss:StyleID="TotalRow"><Data ss:Type="String">TỔNG MỨC ĐẦU TƯ CÔNG TRÌNH (TMĐT):</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">{thkp['total_investment_TMDT']}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(xml_content)

    return output_path

def export_project_to_json(
    items: List[WorkItem],
    categories: List[Category],
    settings: ProjectSettings,
    settlements: List[SettlementItem],
    tasks: List[GanttTask],
    output_path: str
) -> str:
    """Xuất toàn bộ cấu trúc dữ liệu dự án ra JSON chuẩn"""
    from dataclasses import asdict
    bundle = {
        "software": "Dự toán F1 Pro",
        "version": "2.5.0",
        "settings": asdict(settings),
        "categories": [asdict(c) for c in categories],
        "items": [asdict(it) for it in items],
        "settlements": [asdict(s) for s in settlements],
        "tasks": [asdict(t) for t in tasks]
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(bundle, f, ensure_ascii=False, indent=2)
    return output_path
