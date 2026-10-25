"""
Dự toán F1 Pro - Quản trị Cơ sở dữ liệu Quan hệ SQLite
Hỗ trợ lưu trữ bền vững, đa dự án, truy vấn tốc độ cao và tự động khởi tạo dữ liệu mẫu
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from .models import (
    WorkItem, Category, ProjectSettings, SubCalculation,
    MaterialBreakdown, LaborBreakdown, MachineBreakdown,
    SettlementItem, GanttTask, AuditDiffItem
)
from .provinces import PROVINCES_63
from .norms_database import NORMS_CATALOG

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "du_toan_f1.db")

class F1Database:
    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        self.db_path = db_path
        self.init_database()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    def init_database(self):
        """Khởi tạo toàn bộ lược đồ quan hệ chuẩn cho phần mềm Dự toán F1"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Bảng Dự án
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                project_name TEXT NOT NULL,
                investor TEXT,
                contractor TEXT,
                location TEXT,
                province_id TEXT,
                project_type TEXT DEFAULT 'civil',
                vat_rate REAL DEFAULT 0.10,
                labor_coefficient REAL DEFAULT 1.0,
                machine_coefficient REAL DEFAULT 1.0,
                gasoline_price REAL DEFAULT 22800,
                diesel_price REAL DEFAULT 20500,
                electricity_price REAL DEFAULT 2006,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 2. Bảng Hạng mục công trình
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """)

            # 3. Bảng Công tác dự toán (Bảng Công trình)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS work_items (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                category_id TEXT NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                unit TEXT NOT NULL,
                quantity REAL DEFAULT 0.0,
                material_cost REAL DEFAULT 0.0,
                labor_cost REAL DEFAULT 0.0,
                machine_cost REAL DEFAULT 0.0,
                total_unit_price REAL DEFAULT 0.0,
                total_amount REAL DEFAULT 0.0,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
            """)

            # 4. Bảng Diễn giải kích thước hình học
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS sub_calculations (
                id TEXT PRIMARY KEY,
                work_item_id TEXT NOT NULL,
                description TEXT,
                expression TEXT,
                quantity REAL DEFAULT 0.0,
                FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE CASCADE
            )
            """)

            # 5. Bảng Phân tích Vật tư: Vật liệu
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS material_breakdowns (
                id TEXT PRIMARY KEY,
                work_item_id TEXT NOT NULL,
                code TEXT,
                name TEXT NOT NULL,
                unit TEXT NOT NULL,
                quota REAL DEFAULT 0.0,
                original_price REAL DEFAULT 0.0,
                current_price REAL DEFAULT 0.0,
                FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE CASCADE
            )
            """)

            # 6. Bảng Phân tích Vật tư: Nhân công
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS labor_breakdowns (
                id TEXT PRIMARY KEY,
                work_item_id TEXT NOT NULL,
                grade TEXT NOT NULL,
                days REAL DEFAULT 0.0,
                wage_per_day REAL DEFAULT 0.0,
                FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE CASCADE
            )
            """)

            # 7. Bảng Phân tích Vật tư: Máy thi công
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS machine_breakdowns (
                id TEXT PRIMARY KEY,
                work_item_id TEXT NOT NULL,
                machine_type TEXT NOT NULL,
                shifts REAL DEFAULT 0.0,
                shift_price REAL DEFAULT 0.0,
                FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE CASCADE
            )
            """)

            # 8. Bảng Thanh quyết toán (Phụ lục 03a & 03b)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS settlement_items (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                code TEXT,
                name TEXT NOT NULL,
                unit TEXT,
                contract_quantity REAL DEFAULT 0.0,
                contract_price REAL DEFAULT 0.0,
                accum_prev_quantity REAL DEFAULT 0.0,
                current_period_quantity REAL DEFAULT 0.0,
                accum_total_quantity REAL DEFAULT 0.0,
                current_period_amount REAL DEFAULT 0.0,
                accum_total_amount REAL DEFAULT 0.0,
                annex_type TEXT DEFAULT '03a',
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """)

            # 9. Bảng Tiến độ thi công
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS gantt_tasks (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                name TEXT NOT NULL,
                start_day INTEGER DEFAULT 1,
                duration_days INTEGER DEFAULT 1,
                progress_percent INTEGER DEFAULT 0,
                predecessor TEXT,
                crew_size INTEGER DEFAULT 10,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """)

            # 10. Bảng Thẩm tra công trình
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_diffs (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                code TEXT,
                name TEXT,
                unit TEXT,
                submitted_quantity REAL,
                audited_quantity REAL,
                submitted_price REAL,
                audited_price REAL,
                diff_quantity REAL,
                diff_price REAL,
                diff_amount REAL,
                status TEXT,
                reason TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """)

            # 11. Bảng CSDL Định mức TT12
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS norms_catalog (
                code TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                unit TEXT NOT NULL,
                chapter TEXT,
                material_price REAL,
                labor_price REAL,
                machine_price REAL,
                total_unit_price REAL,
                materials_json TEXT,
                labor_json TEXT,
                machinery_json TEXT
            )
            """)

            # 12. Bảng CSDL 63 Tỉnh thành
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS provinces_catalog (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                region TEXT,
                labor_wage REAL,
                labor_coefficient REAL,
                machine_coefficient REAL,
                gasoline_price REAL,
                diesel_price REAL,
                electricity_price REAL,
                notice_prices_json TEXT
            )
            """)

            conn.commit()

        # Nạp dữ liệu nền cho định mức và 63 tỉnh nếu chưa có
        self.seed_provinces_and_norms()
        # Nạp dự án mẫu mặc định
        self.seed_default_sample_project()

    def seed_provinces_and_norms(self):
        """Nạp toàn bộ 63 tỉnh thành và danh mục định mức vào SQLite"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT count(*) as count FROM provinces_catalog")
            count_prov = cursor.fetchone()["count"]
            if count_prov == 0:
                for p in PROVINCES_63:
                    cursor.execute("""
                    INSERT INTO provinces_catalog (id, name, region, labor_wage, labor_coefficient, machine_coefficient, gasoline_price, diesel_price, electricity_price, notice_prices_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        p["id"], p["name"], p["region"], p["labor_wage"],
                        p["labor_coefficient"], p["machine_coefficient"],
                        p["gasoline_price"], p["diesel_price"], p["electricity_price"],
                        json.dumps(p.get("notice_prices", {}), ensure_ascii=False)
                    ))

            cursor.execute("SELECT count(*) as count FROM norms_catalog")
            count_norms = cursor.fetchone()["count"]
            if count_norms == 0:
                for n in NORMS_CATALOG:
                    cursor.execute("""
                    INSERT INTO norms_catalog (code, name, unit, chapter, material_price, labor_price, machine_price, total_unit_price, materials_json, labor_json, machinery_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        n["code"], n["name"], n["unit"], n.get("chapter", ""),
                        n.get("material_price", 0), n.get("labor_price", 0), n.get("machine_price", 0),
                        n.get("total_unit_price", 0),
                        json.dumps(n.get("materials", []), ensure_ascii=False),
                        json.dumps(n.get("labor", {}), ensure_ascii=False),
                        json.dumps(n.get("machinery", []), ensure_ascii=False)
                    ))
            conn.commit()

    def seed_default_sample_project(self):
        """Nạp dự án mẫu 'Tòa nhà văn phòng Nanosoft Tower 5 tầng' nếu database trống"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT count(*) as count FROM projects")
            if cursor.fetchone()["count"] > 0:
                return

            # Thêm Dự án mẫu
            proj_id = "nanosoft_tower_01"
            cursor.execute("""
            INSERT INTO projects (id, project_name, investor, contractor, location, province_id, project_type, vat_rate, labor_coefficient, machine_coefficient)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                proj_id,
                "Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)",
                "Tập đoàn Công nghệ Nanosoft Việt Nam",
                "Công ty Cổ phần Xây dựng F1 Hà Nội",
                "Khu Công nghệ cao Hòa Lạc, Hà Nội",
                "HN",
                "civil",
                0.10,
                1.0,
                1.0
            ))

            # Thêm Hạng mục
            categories = [
                ("cat_1", proj_id, "HM01", "I. KẾT CẤU PHẦN MÓNG & HẦM", 1),
                ("cat_2", proj_id, "HM02", "II. KẾT CẤU PHẦN THÂN CÔNG TRÌNH", 2),
                ("cat_3", proj_id, "HM03", "III. CÔNG TÁC HOÀN THIỆN & ĐIỆN NƯỚC", 3)
            ]
            cursor.executemany("INSERT INTO categories VALUES (?, ?, ?, ?, ?)", categories)

            # Thêm Công tác mẫu
            work_items_data = [
                # Móng
                ("w1", proj_id, "cat_1", "AB.11122", "Đào móng công trình bằng máy đào gầu 0.8m3, đất cấp II", "100m3", 4.85, 0, 988000, 647500, 1635500, 7932175, 1),
                ("w2", proj_id, "cat_1", "AF.11111", "Bê tông lót móng đá 4x6, vữa xi măng PCB40 mác 100", "m3", 38.5, 807025, 327750, 22400, 1157175, 44551238, 2),
                ("w3", proj_id, "cat_1", "AF.12210", "Bê tông móng thương phẩm đá 1x2, mác 250, đổ bằng máy bơm", "m3", 168.0, 1203600, 222300, 125300, 1551200, 260601600, 3),
                ("w4", proj_id, "cat_1", "AF.61111", "Sản xuất, lắp dựng cốt thép móng, đường kính thanh <= 10mm", "tấn", 8.45, 16590000, 2422500, 157500, 19170000, 161986500, 4),
                ("w5", proj_id, "cat_1", "AF.81111", "Sản xuất, lắp dựng ván khuôn móng bằng ván ép phủ phim", "100m2", 5.2, 13440000, 6982500, 0, 20422500, 106197000, 5),
                
                # Thân
                ("w6", proj_id, "cat_2", "AF.12310", "Bê tông cột thương phẩm đá 1x2, mác 300, đổ máy bơm", "m3", 125.0, 1291500, 319200, 161100, 1771800, 221475000, 6),
                ("w7", proj_id, "cat_2", "AF.12410", "Bê tông dầm, sàn thương phẩm đá 1x2 mác 300", "m3", 240.0, 1285200, 242250, 124350, 1651800, 396432000, 7),
                ("w8", proj_id, "cat_2", "AF.61211", "Sản xuất, lắp dựng cốt thép dầm, cột, sàn d<=18mm CB300", "tấn", 24.5, 16616500, 2223000, 200000, 19039500, 466467750, 8),
                ("w9", proj_id, "cat_2", "AF.82111", "Sản xuất, lắp dựng ván khuôn cột dầm sàn ván phủ phim giàn nêm", "100m2", 18.5, 20455000, 9120000, 382500, 29957500, 554213750, 9),

                # Hoàn thiện
                ("w10", proj_id, "cat_3", "AE.11110", "Xây tường thẳng gạch tuynel 2 lỗ dày <= 11cm, vữa XM M75", "m3", 185.0, 1105525, 527250, 9000, 1641775, 303728375, 10),
                ("w11", proj_id, "cat_3", "AK.11111", "Trát tường trong nhà chiều dày 1.5cm, vữa XM M75", "m2", 1450.0, 15417, 62700, 0, 78117, 113269650, 11),
                ("w12", proj_id, "cat_3", "AK.51111", "Lát nền sàn nhà bằng gạch ceramic 600x600mm", "m2", 820.0, 240100, 99750, 0, 339850, 278677000, 12),
                ("w13", proj_id, "cat_3", "AK.81111", "Sơn nước tường trong nhà 1 lót 2 phủ Dulux", "m2", 1450.0, 29885, 51300, 0, 81185, 117718250, 13)
            ]
            cursor.executemany("INSERT INTO work_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", work_items_data)

            # Thêm diễn giải kích thước cho w1 (đào móng) và w3 (bê tông móng)
            sub_calcs = [
                ("sub_1", "w1", "Móng M1 (12 móng)", "12 * 2.2 * 2.2 * 1.5 / 100", 0.8712),
                ("sub_2", "w1", "Móng M2 (8 móng)", "8 * 2.8 * 2.8 * 1.6 / 100", 1.0035),
                ("sub_3", "w1", "Hầm tự hoại & bể nước ngầm", "1 * 8.5 * 6.2 * 2.5 / 100", 1.3175),
                ("sub_4", "w3", "Bê tông móng M1", "12 * 2.0 * 2.0 * 0.9", 43.2),
                ("sub_5", "w3", "Bê tông móng M2", "8 * 2.5 * 2.5 * 1.0", 50.0),
                ("sub_6", "w3", "Bê tông đài giằng móng", "32 * 0.4 * 0.7 * 8.4", 75.264)
            ]
            cursor.executemany("INSERT INTO sub_calculations VALUES (?, ?, ?, ?, ?)", sub_calcs)

            # Thêm Thanh quyết toán mẫu Phụ lục 03a & 03b
            settlements = [
                ("st_1", proj_id, "AB.11122", "Đào móng bằng máy đào 0.8m3", "100m3", 4.85, 1635500, 0, 4.85, 4.85, 7932175, 7932175, "03a"),
                ("st_2", proj_id, "AF.11111", "Bê tông lót móng đá 4x6 mác 100", "m3", 38.5, 1157175, 0, 38.5, 38.5, 44551238, 44551238, "03a"),
                ("st_3", proj_id, "AF.12210", "Bê tông móng thương phẩm M250", "m3", 168.0, 1551200, 0, 168.0, 168.0, 260601600, 260601600, "03a"),
                ("st_4", proj_id, "AF.61111", "Cốt thép móng thanh d<=10mm", "tấn", 8.45, 19170000, 0, 8.45, 8.45, 161986500, 161986500, "03a"),
                ("st_5", proj_id, "PS.01", "Gia cố cọc cừ tràm xử lý túi bùn phát sinh", "cây", 1200, 42000, 0, 1200, 1200, 50400000, 50400000, "03b")
            ]
            cursor.executemany("INSERT INTO settlement_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", settlements)

            # Thêm Tiến độ mẫu
            tasks = [
                ("t_1", proj_id, "1. Công tác chuẩn bị mặt bằng & đào đất móng", 1, 15, 100, None, 18),
                ("t_2", proj_id, "2. Thi công bê tông lót, cốt thép & ván khuôn móng", 16, 20, 100, "t_1", 25),
                ("t_3", proj_id, "3. Đổ bê tông móng và bảo dưỡng", 36, 10, 100, "t_2", 15),
                ("t_4", proj_id, "4. Thi công kết cấu cột, dầm, sàn tầng 1 - tầng 5", 46, 65, 40, "t_3", 35),
                ("t_5", proj_id, "5. Xây tường bao che và ngăn phòng", 75, 45, 20, "t_4", 22),
                ("t_6", proj_id, "6. Hoàn thiện trát, láng, lát, sơn và cơ điện M&E", 110, 50, 0, "t_5", 30)
            ]
            cursor.executemany("INSERT INTO gantt_tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?)", tasks)

            conn.commit()

    def get_full_project(self, project_id: str) -> Dict[str, Any]:
        """Tải toàn bộ dữ liệu dự án từ SQLite"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
            proj_row = cursor.fetchone()
            if not proj_row:
                return {}

            settings = dict(proj_row)

            # Lấy hạng mục
            cursor.execute("SELECT * FROM categories WHERE project_id = ? ORDER BY sort_order", (project_id,))
            categories = [dict(r) for r in cursor.fetchall()]

            # Lấy công tác
            cursor.execute("SELECT * FROM work_items WHERE project_id = ? ORDER BY sort_order", (project_id,))
            items = []
            for w in cursor.fetchall():
                w_dict = dict(w)
                w_id = w_dict["id"]
                
                # Diễn giải
                cursor.execute("SELECT * FROM sub_calculations WHERE work_item_id = ?", (w_id,))
                w_dict["sub_calculations"] = [dict(s) for s in cursor.fetchall()]

                # Vật liệu
                cursor.execute("SELECT * FROM material_breakdowns WHERE work_item_id = ?", (w_id,))
                w_dict["materials"] = [dict(m) for m in cursor.fetchall()]

                # Nhân công
                cursor.execute("SELECT * FROM labor_breakdowns WHERE work_item_id = ?", (w_id,))
                lab = cursor.fetchone()
                w_dict["labor"] = dict(lab) if lab else None

                # Máy
                cursor.execute("SELECT * FROM machine_breakdowns WHERE work_item_id = ?", (w_id,))
                w_dict["machinery"] = [dict(mac) for mac in cursor.fetchall()]

                items.append(w_dict)

            # Lấy thanh quyết toán
            cursor.execute("SELECT * FROM settlement_items WHERE project_id = ?", (project_id,))
            settlements = [dict(s) for s in cursor.fetchall()]

            # Lấy tiến độ
            cursor.execute("SELECT * FROM gantt_tasks WHERE project_id = ? ORDER BY start_day", (project_id,))
            tasks = [dict(t) for t in cursor.fetchall()]

            return {
                "settings": settings,
                "categories": categories,
                "items": items,
                "settlements": settlements,
                "tasks": tasks
            }
