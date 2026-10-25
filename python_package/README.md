# DỰ TOÁN F1 PRO - BỘ ENGINE PYTHON ĐỘC LẬP & TÍCH HỢP REST API

Phần mềm Dự toán F1 Pro phiên bản Python độc lập (Standalone Python Engine), được thiết kế để:
1. Cho phép kỹ sư xây dựng, nhà thầu và ban quản lý dự án tiếp tục phát triển và tính toán dự toán hoàn toàn ngoại tuyến (offline) khi không dùng web browser hoặc hết quota AI Studio.
2. Cung cấp **Toàn bộ 63 Tỉnh Thành** của Việt Nam với các vùng lương tối thiểu (Vùng I - IV), đơn giá nhân công theo Thông tư 13/2021/TT-BXD, giá ca máy, giá nhiên liệu và giá thông báo vật liệu xây dựng Sở Xây dựng.
3. Cung cấp **Cơ sở dữ liệu Định mức Thông tư 12/2021/TT-BXD** đầy đủ các chương (Đào đắp, Cọc, Bê tông, Cốt thép, Coppha, Xây gạch, Trát láng ốp lát, Sơn bả, Kết cấu thép, Điện nước).
4. Áp dụng chuẩn xác công thức **Thông tư 11/2021/TT-BXD**, **Thông tư 14/2023/TT-BXD**, **Nghị định 10/2021/NĐ-CP** (Tổng mức đầu tư) và **Nghị định 99/2021/NĐ-CP** (Thanh quyết toán hợp đồng Phụ lục 03a & 03b).
5. Tích hợp máy chủ **REST API Server** đồng bộ 2 chiều với Autodesk Revit, AutoCAD, Excel VBA và các hệ thống ERP quản lý thi công.

---

## Cài đặt & Yêu cầu Môi trường

Engine F1 Pro sử dụng **100% Python Standard Library** cho toàn bộ các chức năng cốt lõi (SQLite, tính toán toán học, xuất Excel SpreadsheetML, máy chủ HTTP, giao diện dòng lệnh tương tác). 
Bạn **KHÔNG CẦN CÀI ĐẶT BẤT KỲ THƯ VIỆN BÊN NGOÀI NÀO** để chạy!

### Yêu cầu:
- Python 3.8 trở lên (đã tích hợp sẵn sqlite3, json, http.server, urllib).

### Cài đặt gói nâng cao (Tùy chọn):
Nếu muốn sử dụng FastAPI và kiểm thử nâng cao:
```bash
pip install -r requirements.txt
```

---

## Hướng dẫn Sử dụng Nhanh

### 1. Chạy Giao diện Dòng lệnh Tương tác (CLI - 15 phân hệ)
```bash
python main.py
# hoặc:
python main.py --cli
```
Màn hình sẽ hiển thị menu tương tác 15 chức năng để xem Bảng Công trình, THVT, THKP, thẩm tra, thanh quyết toán, tra cứu định mức và xuất Excel.

### 2. Xem Bảng Tổng Hợp Kinh Phí (THKP) Ngay Lập Tức
```bash
python main.py --thkp
```

### 3. Xuất Hồ Sơ Dự Toán Ra File Excel 8 Sheet (.xls)
```bash
python main.py --excel
```
File `Du_Toan_F1_Export.xls` được tạo ra chứa đầy đủ 8 sheet (Công trình, PTVT, THVT, ĐGCT, Dự thầu, THKP, Quyết toán, Tiến độ) và mở trực tiếp trên mọi phiên bản Microsoft Excel.

### 4. Tra cứu Danh Mục 63 Tỉnh Thành Phố
```bash
python main.py --provinces
```

### 5. Khởi động Máy chủ REST API Server
```bash
python main.py --api
# Mặc định lắng nghe tại http://127.0.0.1:8000
```
Xem chi tiết các endpoint và mã nguồn mẫu tích hợp Revit / AutoCAD trong file `API_INTEGRATION_GUIDE.md`.

### 6. Chạy Kiểm thử Đơn vị & Công thức Toán học
```bash
python main.py --test
```

---

## Kiến trúc Thư mục Module
```
python_package/
├── main.py                          # Điểm vào thực thi chính
├── requirements.txt                 # Các gói phụ thuộc tùy chọn
├── README.md                        # Tài liệu hướng dẫn sử dụng
├── API_INTEGRATION_GUIDE.md         # Hướng dẫn tích hợp Revit, CAD, Excel, ERP
├── data/
│   ├── project_data.json            # Dữ liệu dự án mẫu Tòa nhà Nanosoft Tower
│   ├── provinces_63.json            # CSDL 63 tỉnh thành & thông báo giá
│   └── norms_tt12.json              # CSDL định mức Thông tư 12
└── du_toan_f1/
    ├── __init__.py                  # Đóng gói package
    ├── constants.py                 # Tỷ lệ định mức Thông tư 11, 12, 14, NĐ 10, NĐ 99
    ├── provinces.py                 # CSDL 63 Tỉnh Thành & Vùng lương tối thiểu
    ├── norms_database.py            # CSDL Định mức Thông tư 12 & Tìm kiếm không dấu
    ├── models.py                    # Schema dữ liệu hướng đối tượng (WorkItem, etc.)
    ├── calculator.py                # Engine tính toán số học & THKP & Quyết toán
    ├── database.py                  # Quản trị cơ sở dữ liệu quan hệ SQLite
    ├── exporters.py                 # Xuất Excel 8 sheet (.xls) & JSON & XML
    ├── api_server.py                # Máy chủ REST API Server
    └── cli.py                       # Giao diện dòng lệnh tương tác 15 chức năng
```

Bản quyền phát triển: **Dự toán F1 Pro** - Tương thích chuẩn văn bản quy phạm pháp luật Bộ Xây dựng Việt Nam.
