# TÀI LIỆU HƯỚNG DẪN TÍCH HỢP HỆ THỐNG & API DỰ TOÁN F1 PRO

## 1. Giới thiệu tổng quan
Phần mềm **Dự toán F1 Pro** cung cấp hệ thống module tính toán độc lập bằng Python (Python Engine) và giao diện RESTful API chuẩn mở, cho phép đồng bộ hóa dữ liệu 2 chiều với các hệ thống phần mềm chuyên dụng:
- **Autodesk Revit / BIM** (Trích xuất khối lượng hình học tự động từ mô hình 3D sang diễn giải F1).
- **AutoCAD / Civil 3D** (Đồng bộ số liệu đo bóc bản vẽ cad qua AutoLISP / .NET).
- **Microsoft Excel** (Tích hợp Add-in và VBA Macro gọi trực tiếp API tính toán của F1).
- **Hệ thống ERP / Quản lý thi công doanh nghiệp** (SAP, Odoo, Bravo, FAST).

---

## 2. Khởi động Máy chủ API (API Server)
Trong thư mục `python_package`, chạy lệnh sau để khởi chạy máy chủ API:
```bash
python main.py --api
# Hoặc chỉ định cổng tùy chỉnh:
python main.py --api 8080
```
Khi máy chủ chạy, bạn có thể kiểm tra trạng thái tại:
`http://127.0.0.1:8000/api/v1/health`

---

## 3. Danh mục API Endpoints & Cú pháp gọi

### 3.1. Lấy danh sách 63 Tỉnh Thành
- **Endpoint**: `GET /api/v1/provinces`
- **Mô tả**: Trả về toàn bộ 63 tỉnh thành Việt Nam cùng vùng lương tối thiểu (Vùng I - IV), đơn giá nhân công bình quân thợ bậc 3.5/7, hệ số máy thi công, giá nhiên liệu (Xăng, Dầu, Điện) và thông báo giá vật liệu xây dựng định kỳ.
- **Ví dụ gọi bằng cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/provinces"
```

### 3.2. Tra cứu Định mức Xây dựng Thông tư 12/2021/TT-BXD
- **Endpoint**: `GET /api/v1/norms?q={từ_khóa}&chapter={chương}`
- **Mô tả**: Tìm kiếm nhanh mã hiệu hoặc tên công tác, hỗ trợ tìm kiếm không dấu (VD: `be tong mong`, `cot thep`, `AF.12`).
- **Ví dụ gọi bằng cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/norms?q=be+tong+mong"
```

### 3.3. Lấy thông tin Toàn bộ Dự án & Bảng Công Trình
- **Endpoint**: `GET /api/v1/project`
- **Mô tả**: Trả về cấu trúc JSON đầy đủ của dự án, bao gồm cấu hình, hạng mục, công tác, phân tích vật tư, thanh quyết toán và tiến độ.
- **Ví dụ gọi bằng cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/project"
```

### 3.4. Tính toán Tổng Hợp Kinh Phí (THKP) & Tổng Mức Đầu Tư
- **Endpoint**: `GET /api/v1/calculate/thkp`
- **Mô tả**: Tính toán tức thời bảng THKP theo Thông tư 11/2021/TT-BXD và Tổng mức đầu tư theo Nghị định 10/2021/NĐ-CP.
- **Ví dụ gọi bằng cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/calculate/thkp"
```

### 3.5. Xuất Dự toán ra File Excel 8 Sheet
- **Endpoint**: `GET /api/v1/export/excel`
- **Mô tả**: Tự động tải về file Excel hoàn chỉnh chứa 8 sheet (Công trình, PTVT, THVT, ĐGCT, Dự thầu, THKP, Quyết toán, Tiến độ).
- **Ví dụ gọi bằng cURL**:
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/export/excel" -o "Du_Toan_F1.xls"
```

### 3.6. Đồng bộ Khối lượng Mô hình BIM từ Autodesk Revit
- **Endpoint**: `POST /api/v1/sync/bim`
- **Body**:
```json
{
  "source": "Autodesk Revit 2024",
  "project_id": "nanosoft_tower_01",
  "elements_count": 48,
  "elements": [
    {
      "category": "Structural Foundations",
      "type_name": "Móng đơn M1 2000x2000x900",
      "count": 12,
      "length": 2.0,
      "width": 2.0,
      "height": 0.9,
      "volume": 43.2,
      "matched_norm_code": "AF.12210"
    }
  ]
}
```

---

## 4. Mã nguồn Mẫu Tích hợp vào Các Phần mềm Chuyên dụng

### 4.1. Tích hợp Python / Jupyter Notebook
```python
import requests

BASE_URL = "http://127.0.0.1:8000"

# 1. Tra cứu định mức
response = requests.get(f"{BASE_URL}/api/v1/norms", params={"q": "bê tông móng"})
norms = response.json().get("norms", [])
print(f"Tìm thấy {len(norms)} mã định mức:")
for n in norms[:3]:
    print(f"- {n['code']}: {n['name']} (Đơn giá: {n['total_unit_price']:,} đ)")

# 2. Lấy bảng THKP
thkp = requests.get(f"{BASE_URL}/api/v1/calculate/thkp").json()
print(f"\nChi phí trực tiếp (T): {thkp['direct_cost']['total_T']:,} VNĐ")
print(f"Tổng mức đầu tư (TMĐT): {thkp['total_investment_TMDT']:,} VNĐ")
```

### 4.2. Tích hợp Autodesk Revit (C# .NET Revit API Add-in)
```csharp
using System;
using System.Net.Http;
using System.Text;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

namespace F1RevitSync
{
    [Autodesk.Revit.Attributes.Transaction(Autodesk.Revit.Attributes.TransactionMode.Manual)]
    public class SyncToF1Command : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            Document doc = commandData.Application.ActiveUIDocument.Document;
            
            // Thu thập thông số móng từ mô hình Revit
            string jsonPayload = "{\"source\": \"Revit\", \"elements_count\": 24}";
            
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://127.0.0.1:8000/");
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                var response = client.PostAsync("api/v1/sync/bim", content).Result;
                
                if (response.IsSuccessStatusCode)
                {
                    TaskDialog.Show("Dự toán F1 Pro", "Đã đồng bộ thành công khối lượng hình học sang F1!");
                    return Result.Succeeded;
                }
            }
            return Result.Failed;
        }
    }
}
```

### 4.3. Tích hợp Microsoft Excel (VBA Macro)
Mở cửa sổ VBA trong Excel (Alt + F11), chèn Module mới và dán đoạn mã sau:
```vba
Sub DongBoDuToanF1()
    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP")
    
    Dim url As String
    url = "http://127.0.0.1:8000/api/v1/calculate/thkp"
    
    http.Open "GET", url, False
    http.setRequestHeader "Content-Type", "application/json"
    http.send
    
    If http.Status = 200 Then
        MsgBox "Đã kết nối thành công với Máy chủ Dự toán F1 Pro!" & vbCrLf & _
               "Phản hồi từ F1: " & Left(http.responseText, 200) & "...", vbInformation, "Dự toán F1 Pro"
    Else
        MsgBox "Không thể kết nối đến máy chủ F1 (Port 8000)", vbCritical, "Lỗi kết nối"
    End If
End Sub
```

### 4.4. Tích hợp AutoCAD (AutoLISP)
```lisp
(defun c:F1SYNC ()
  (vl-load-com)
  (setq http (vlax-create-object "MSXML2.XMLHTTP"))
  (vlax-invoke-method http 'open "GET" "http://127.0.0.1:8000/api/v1/health" :vlax-false)
  (vlax-invoke-method http 'send)
  (setq status (vlax-get-property http 'status))
  (if (= status 200)
    (princ "\n[F1 Pro] Da ket noi thanh cong voi Engine Du Toan F1 tren cong 8000!")
    (princ "\n[F1 Pro] Khong tim thay may chu F1 dang chay tren cong 8000.")
  )
  (vlax-release-object http)
  (princ)
)
```

---

## 5. Cấu trúc Thư mục Module Python F1 Pro
```
python_package/
├── main.py                          # Điểm vào thực thi chính (CLI, Server, Excel)
├── requirements.txt                 # Các gói phụ thuộc tùy chọn (FastAPI, OpenPyXL...)
├── README.md                        # Hướng dẫn chi tiết sử dụng
├── API_INTEGRATION_GUIDE.md         # Tài liệu tích hợp API này
├── data/
│   ├── project_data.json            # Dữ liệu dự án mẫu chuẩn
│   ├── provinces_63.json            # Danh mục 63 tỉnh thành & thông báo giá
│   └── norms_tt12.json              # Danh mục định mức Thông tư 12
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
