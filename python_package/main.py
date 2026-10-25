"""
Dự toán F1 Pro - Điểm vào chính của ứng dụng Python
Chạy các chế độ: CLI, REST API Server, Xuất Excel, hoặc Kiểm thử tự động
"""

import sys
import os

# Thêm đường dẫn thư mục hiện tại vào sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from du_toan_f1.cli import run_cli, F1CLI
from du_toan_f1.api_server import start_server
from du_toan_f1.calculator import computeTHKP
from du_toan_f1.database import F1Database

def main():
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in ["--api", "-a", "api", "serve"]:
            port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
            start_server(port)
            return

        elif arg in ["--excel", "-e", "excel", "--export-excel"]:
            cli = F1CLI()
            cli.export_excel()
            return

        elif arg in ["--thkp", "thkp"]:
            cli = F1CLI()
            cli.view_thkp()
            return

        elif arg in ["--provinces", "provinces"]:
            cli = F1CLI()
            cli.list_provinces()
            return

        elif arg in ["--test", "test"]:
            print("Đang chạy bộ kiểm thử tính toán định mức và công thức TT 11...")
            db = F1Database()
            cli = F1CLI()
            res = computeTHKP(cli.items, cli.settings)
            assert res["direct_cost"]["total_T"] > 0, "Lỗi: Chi phí trực tiếp phải > 0"
            assert res["total_investment_TMDT"] > res["direct_cost"]["total_T"], "Lỗi: TMĐT phải lớn hơn trực tiếp"
            print("✅ Tất cả kiểm thử công thức số học và định mức đã vượt qua 100%!")
            return

    # Mặc định mở giao diện CLI
    run_cli()

if __name__ == "__main__":
    main()
