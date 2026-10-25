import React, { useState } from 'react';
import { 
  HelpCircle, BookOpen, Search, X, CheckCircle2, 
  Keyboard, FileText, Download, Sparkles, ExternalLink,
  ChevronRight, Layers, Sliders, Printer, Code, QrCode,
  TrendingUp, ShieldCheck, Check, Info, ArrowRight,
  Copy, HelpCircle as QuestionIcon, Zap, FileSpreadsheet,
  Coins, FileCheck2, BarChart3, Calculator, RefreshCw,
  Bookmark, LifeBuoy, FileDown, MessageSquare
} from 'lucide-react';
import { ActiveTab } from './HeaderRibbon';

interface HelpManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpdateModal?: () => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
  onDirectExportPdf?: () => void;
  onOpenNormLookup?: () => void;
  onOpenMonthlyPrice?: () => void;
  onOpenSettings?: () => void;
}

interface HelpTopic {
  id: string;
  category: string;
  title: string;
  summary: string;
  shortcut?: string;
  icon: string;
  targetTab?: ActiveTab;
  steps: string[];
  tips: string[];
  regulations?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedTopicId?: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'workflow',
    category: 'Quy trình cơ bản',
    title: 'Quy trình lập dự toán 6 bước chuẩn Bộ Xây dựng',
    summary: 'Hướng dẫn tuần tự từ khâu tra cứu mã định mức, bóc tách khối lượng, áp giá tháng, đơn giá chi tiết đến tổng hợp kinh phí và xuất bản.',
    icon: '📋',
    targetTab: 'cong-trinh',
    regulations: 'Nghị định 10/2021/NĐ-CP & Thông tư 11/2021/TT-BXD',
    steps: [
      'Bước 1 - Lập bảng khối lượng (Tab Công trình): Nhấn F2 để tra cứu mã hiệu định mức theo Thông tư 12/2021/TT-BXD. Nhập diễn giải khối lượng chi tiết (dài × rộng × cao) hoặc dùng biểu thức toán học.',
      'Bước 2 - Phân tích vật tư (Tab PTVT): Hệ thống tự động bóc tách hao phí định mức Vật liệu, Nhân công, Máy thi công cho từng đơn vị công tác.',
      'Bước 3 - Áp giá tháng & Bù giá (Tab THVT): Sử dụng nút "Lắp giá tháng Sở XD" (F3) để nạp giá công bố mới nhất của 63 Tỉnh/Thành phố hoặc nhập giá thị trường thực tế.',
      'Bước 4 - Xác định đơn giá chi tiết & Dự thầu (Tab DGCT & Dự thầu): Tính toán đơn giá xây dựng chi tiết không đầy đủ và đầy đủ phục vụ đấu thầu theo Luật Đấu thầu số 22/2023/QH15.',
      'Bước 5 - Tổng hợp kinh phí dự toán (Tab THKP): Hệ thống tự động tính chi phí gián tiếp, thu nhập chịu thuế tính trước, thuế VAT và tổng mức đầu tư theo Thông tư 11/2021/TT-BXD.',
      'Bước 6 - Xuất bản & Lưu trữ: Xuất trực tiếp ra PDF chuẩn thể thức hành chính Nhà nước (Nghị định 30/2020/NĐ-CP) hoặc xuất trọn bộ 8 sheet Excel (.xlsx).'
    ],
    tips: [
      'Nhấn phím F2 bất kỳ lúc nào để mở hộp thoại tra cứu mã hiệu định mức nhanh.',
      'Sử dụng nút "Mẫu chuẩn" trên thanh tiêu đề nếu muốn khôi phục dữ liệu dự án mẫu tiêu chuẩn của F1 Pro.',
      'Dự án tự động được lưu vào LocalStorage theo chu kỳ cài đặt trong Cấu hình dự án.'
    ]
  },
  {
    id: 'cong-trinh',
    category: 'Bảng Công trình',
    title: 'Quản lý khối lượng, diễn giải con & Kiểm tra chính tả TCVN',
    summary: 'Cách nhập số liệu, công thức toán học kích thước và sử dụng trợ lý chính tả chuyên ngành xây dựng.',
    shortcut: 'F2',
    icon: '🏗️',
    targetTab: 'cong-trinh',
    regulations: 'Thông tư 12/2021/TT-BXD & Tiêu chuẩn Quốc gia TCVN',
    steps: [
      'Tra cứu mã hiệu: Nhấn "Tra định mức (F2)" hoặc bấm đúp vào ô Mã hiệu để tìm kiếm theo mã (AA, AB, AF, AK...) hoặc từ khóa tên công việc.',
      'Chèn diễn giải kích thước: Nhấn "Chèn diễn giải KL" để thêm các dòng cấu kiện chi tiết (ví dụ: "Móng M1", "Dầm D1"). Nhập biểu thức dạng "12 * 1.8 * 1.8 * 0.6", phần mềm sẽ tự động tính ra kết quả.',
      'Kiểm tra chính tả chuyên ngành: Tính năng kiểm tra chính tả xây dựng tự động phát hiện các từ gõ sai, thiếu dấu tiếng Việt hoặc sai thuật ngữ (ví dụ: "mac 200" -> "mác 200", "vua" -> "vữa", "be tong" -> "bê tông").',
      'Sửa lỗi 1 chạm: Nhấn trực tiếp vào chip "Gợi ý" dưới tên công tác để sửa ngay, hoặc bấm "Sửa tất cả" trong ngăn kéo để chuẩn hóa toàn bộ dự toán.'
    ],
    tips: [
      'Có thể nhập công thức phức tạp trong FormulaBar với các dấu ngoặc đơn () và toán tử +, -, *, /.',
      'Các hạng mục công việc có thể thu gọn/mở rộng bằng cách nhấn vào mũi tên đầu dòng hạng mục.'
    ]
  },
  {
    id: 'duplicate-note',
    category: 'Thao tác dữ liệu',
    title: 'Nhân bản công tác (Duplicate) & Ghi chú nhanh (F8)',
    summary: 'Tạo bản sao công tác giữ nguyên toàn bộ diễn giải khối lượng và gắn ghi chú, thẻ trạng thái tiến độ cho công việc.',
    shortcut: 'F8',
    icon: '📑',
    targetTab: 'cong-trinh',
    regulations: 'Tính năng tối ưu hóa tốc độ bóc tách khối lượng F1 Pro',
    steps: [
      'Nhân bản công tác (Duplicate): Trên mỗi dòng công tác ở bảng Công trình, nhấn vào biểu tượng 2 trang giấy (Copy/Duplicate). Hệ thống sẽ tạo ngay một bản sao phía dưới với toàn bộ diễn giải khối lượng (dài, rộng, cao, số lượng cấu kiện) được sao chép nguyên vẹn.',
      'Mở nhanh Ghi chú (Phím tắt F8): Chọn một công tác trên bảng và nhấn phím F8 trên bàn phím (hoặc bấm biểu tượng ghi chú tại cột Ghi chú).',
      'Chọn thẻ nhãn nhanh: Hộp thoại ghi chú tích hợp sẵn các nhãn nhanh như "Chờ thẩm tra", "Cần chốt khối lượng", "Vật tư đặc thù", "Phát sinh ngoài HĐ", "Ưu tiên thi công". Bấm để chèn nhanh vào nội dung.',
      'Hiển thị trực quan: Nội dung ghi chú sẽ xuất hiện nổi bật tại cột "Ghi chú (F8)" với badge trạng thái màu xanh/cam giúp kiểm soát hồ sơ dễ dàng.'
    ],
    tips: [
      'Khi nhân bản, các ID của dòng công tác con đều được làm mới tự động để tránh xung đột dữ liệu.',
      'Bạn có thể dùng Ctrl+Z để hoàn tác ngay lập tức nếu nhân bản nhầm.'
    ]
  },
  {
    id: 'filter-sort',
    category: 'Tìm kiếm & Sắp xếp',
    title: 'Tìm kiếm lọc tức thì (Ctrl+F) & Sắp xếp theo cột',
    summary: 'Lọc nhanh danh sách công việc theo tên hoặc mã hiệu và sắp xếp tăng/giảm theo cột để rà soát số liệu.',
    shortcut: 'Ctrl + F',
    icon: '🔍',
    targetTab: 'cong-trinh',
    regulations: 'Tiện ích quản trị dữ liệu dự toán quy mô lớn',
    steps: [
      'Tìm kiếm nhanh (Ctrl+F): Nhấn phím tắt Ctrl+F hoặc click vào thanh tìm kiếm ở đầu bảng Công trình. Nhập mã hiệu (VD: AF.11, AB.2) hoặc tên công việc (VD: bê tông, ván khuôn, đào đất) để lọc tức thì.',
      'Sắp xếp theo cột: Bấm vào tiêu đề bất kỳ cột nào có biểu tượng mũi tên (Mã hiệu, Tên công tác, Đơn vị, Khối lượng). Bấm lần 1 để xếp tăng dần, lần 2 xếp giảm dần.',
      'Xóa bộ lọc / Bỏ sắp xếp: Khi đang sắp xếp, một thanh thông báo hiển thị ở đầu bảng cho phép bạn bấm "Bỏ sắp xếp" để quay lại thứ tự ban đầu.'
    ],
    tips: [
      'Tìm kiếm hoạt động không phân biệt chữ hoa, chữ thường và hỗ trợ cả tiếng Việt có dấu hoặc không dấu.',
      'Khi tìm kiếm, số lượng công tác thỏa mãn điều kiện sẽ hiển thị ngay bên cạnh ô tìm kiếm.'
    ]
  },
  {
    id: 'thvt',
    category: 'Vật tư & Giá tháng',
    title: 'Lắp giá thông báo Sở Xây dựng 63 Tỉnh/Thành & Bù chênh lệch',
    summary: 'Tự động áp giá vật liệu, đơn giá nhân công theo vùng lương và giá ca máy thi công.',
    shortcut: 'F3',
    icon: '🪙',
    targetTab: 'thvt',
    regulations: 'Thông tư 11/2021/TT-BXD & TT 13/2021/TT-BXD',
    steps: [
      'Chọn Tỉnh/Thành phố: Chọn nhanh tỉnh cần lập dự toán tại góc trên bên trái thanh Ribbon (hỗ trợ đầy đủ 63 tỉnh thành).',
      'Lắp giá tháng tự động: Nhấn nút "Lắp giá tháng Sở XD" (F3), chọn tháng/quý công bố của địa phương và bấm "Áp dụng giá tháng cho toàn bộ dự án".',
      'Tự động tính chênh lệch: Cột "Chênh lệch" và "Thành tiền chênh lệch" trong sheet THVT sẽ tự động tính: Giá tháng - Giá gốc.',
      'Bù giá vào THKP: Toàn bộ chênh lệch vật tư được tự động cập nhật trực tiếp vào dòng Chi phí vật liệu trong sheet Tổng hợp kinh phí.'
    ],
    tips: [
      'Có thể sửa trực tiếp đơn giá tháng của từng vật liệu trong bảng Tổng hợp vật tư.',
      'Hệ số nhân công và máy thi công được tự động điều chỉnh theo vùng lương (Vùng I, II, III, IV) của địa phương đã chọn.'
    ]
  },
  {
    id: 'dgct-du-thau',
    category: 'Đơn giá & Dự thầu',
    title: 'Đơn giá chi tiết (DGCT) & Bảng giá Dự thầu',
    summary: 'Xác định đơn giá xây dựng chi tiết không đầy đủ và đầy đủ (gồm chi phí gián tiếp, thuế) phục vụ đấu thầu xây lắp.',
    icon: '📊',
    targetTab: 'dgct',
    regulations: 'Thông tư 11/2021/TT-BXD Phụ lục II & Luật Đấu thầu 22/2023/QH15',
    steps: [
      'Sheet Đơn giá chi tiết: Tổng hợp định mức hao phí Vật liệu, Nhân công, Máy cho 1 đơn vị công tác. Tính toán chi phí trực tiếp (T = VL + NC + M).',
      'Cộng Chi phí gián tiếp vào từng công tác: Tùy chọn phân bổ Chi phí chung, Nhà tạm, Không xác định từ thiết kế vào đơn giá để hình thành Đơn giá đầy đủ.',
      'Sheet Dự thầu: Nhân khối lượng mời thầu với đơn giá dự thầu hoàn chỉnh, kết xuất bảng giá dự thầu phục vụ nộp thầu điện tử.'
    ],
    tips: [
      'Đơn giá đầy đủ giúp nhà thầu kiểm soát chính xác điểm hòa vốn của từng công việc trước khi giảm giá dự thầu.'
    ]
  },
  {
    id: 'thkp-auto',
    category: 'Tổng hợp kinh phí',
    title: 'Tự động hóa tính toán Chi phí gián tiếp & Xuất mã QR Code',
    summary: 'Nội suy tuyến tính tỷ lệ chi phí chung (C), chi phí nhà tạm (NT) và xuất mã QR Code xem trên điện thoại.',
    shortcut: 'F7',
    icon: '🧮',
    targetTab: 'thkp',
    regulations: 'Thông tư 11/2021/TT-BXD Bảng 3.1 & 3.2',
    steps: [
      'Chọn loại công trình chủ đạo: Dân dụng (7.3% - 4.4%), Công nghiệp (6.2% - 4.1%), Giao thông (5.5% - 3.8%), Nông nghiệp (5.8% - 4.0%), Hạ tầng kỹ thuật (5.0% - 3.4%).',
      'Phương pháp tính: Chọn "Nội suy tự động theo quy mô T" (hệ thống tự động tra bảng 3.1) hoặc "Phân bổ theo từng hạng mục công trình" nếu dự án có nhiều loại công trình kết hợp.',
      'Công trình theo tuyến: Bật tùy chọn "Công trình theo tuyến" để chi phí nhà tạm tự động nâng lên 2.2% (thay vì 1.2% cho công trình tại chỗ).',
      'Xem nhanh THKP (F7): Nhấn F7 từ bất kỳ đâu để bật cửa sổ THKP nhanh mà không cần rời tab hiện tại.',
      'Xuất QR Code di động: Nhấn "Xuất QR Code Di Động" để tạo mã QR chứa toàn bộ thông số kinh phí tóm tắt.'
    ],
    tips: [
      'Nhấn vào nút "Bảng tra định mức TT11" để xem chi tiết bảng mốc tỷ lệ chi phí chung từ dưới 15 tỷ đến trên 1.000 tỷ.'
    ]
  },
  {
    id: 'pdf-export',
    category: 'In ấn & Xuất bản',
    title: 'Xuất PDF trực tiếp (jsPDF) & Mẫu in Hành chính NĐ 30/2020',
    summary: 'Xuất file PDF trực tiếp 1 chạm theo thể thức Quốc hiệu, Tiêu ngữ, bảng kẻ lưới và 4 chữ ký thẩm định.',
    shortcut: 'Ctrl + P',
    icon: '🏛️',
    regulations: 'Nghị định 30/2020/NĐ-CP về Thể thức văn bản hành chính nhà nước',
    steps: [
      'Xuất trực tiếp bằng jsPDF: Nhấn nút "PDF Export (Xuất PDF)" màu đỏ hồng trên thanh Ribbon. File PDF chuẩn khổ A4 Ngang (Landscape) chất lượng cao sẽ tải về máy ngay tức thì.',
      'Xem trước & In ấn Hành chính: Nhấn "Xem in Hành chính" để mở bảng duyệt văn bản có sẵn Quốc hiệu, Tiêu ngữ, Bảng số liệu và 4 vị trí chữ ký duyệt (Người lập, Chủ trì, Đơn vị tư vấn, Chủ đầu tư).',
      'Tùy chỉnh thông tin hành chính: Vào "Cấu hình dự án" -> "Mẫu in ấn hành chính" để đổi tên Cơ quan chủ quản, Dự án, Địa danh ngày tháng.'
    ],
    tips: [
      'File PDF xuất ra bằng font chuẩn Unicode, không bao giờ bị lỗi dấu tiếng Việt.',
      'Các trường thông tin hành chính được lưu lại tự động cho các lần xuất bản tiếp theo.'
    ]
  },
  {
    id: 'autosave-restore',
    category: 'An toàn dữ liệu',
    title: 'Tự động sao lưu dự án (Auto-Save) & Phục hồi LocalStorage',
    summary: 'Bảo vệ an toàn dữ liệu công trình trước sự cố mất điện hay tắt trình duyệt đột ngột.',
    shortcut: 'F4',
    icon: '💾',
    regulations: 'Cơ chế lưu trữ cục bộ HTML5 LocalStorage mã hóa an toàn',
    steps: [
      'Lưu thủ công (Phím tắt F4): Nhấn F4 hoặc bấm nút "Lưu (F4)" trên Ribbon bất kỳ lúc nào để lưu toàn bộ dự án.',
      'Bật / Tắt Tự động sao lưu (Auto-Save): Vào "Cấu hình dự án" -> Tab "Tùy chọn & Tự động lưu". Bật công tắc "Tự động lưu dự án định kỳ".',
      'Điều chỉnh chu kỳ lưu: Chọn thời gian định kỳ (1 phút, 2 phút, 5 phút, 10 phút, 15 phút, 30 phút). Hệ thống sẽ chạy nền và báo toast êm ái khi hoàn thành.',
      'Phục hồi tự động: Khi mở lại trang web, phần mềm tự động nạp phiên bản dự án lưu gần nhất.'
    ],
    tips: [
      'Bạn cũng có thể xuất file Excel (.xlsx) để gửi cho đồng nghiệp hoặc lưu trữ dự phòng trên Google Drive.'
    ]
  },
  {
    id: 'tham-tra',
    category: 'Thẩm tra dự toán',
    title: 'So sánh 2 phiên bản dự toán & Xuất biên bản 01/TTr',
    summary: 'Kiểm tra chênh lệch khối lượng và đơn giá giữa hồ sơ trình duyệt và hồ sơ sau thẩm tra.',
    icon: '🔍',
    targetTab: 'tham-tra',
    regulations: 'Nghị định 10/2021/NĐ-CP về Quản lý chi phí đầu tư xây dựng',
    steps: [
      'Chế độ xem so sánh: Chuyển đổi giữa "Chế độ Thẩm tra khối lượng" và "So sánh 2 Phiên bản (Dự toán vs Quyết toán)".',
      'Phát hiện sai lệch vượt định mức: Các công tác có khối lượng thẩm tra giảm hoặc tăng được đánh dấu màu sắc cảnh báo trực quan.',
      'Áp dụng kết quả thẩm tra: Nhấn "Áp dụng toàn bộ số liệu thẩm tra vào Dự toán" để đồng bộ số liệu chuẩn vào bảng Công trình.',
      'Xuất Báo cáo thẩm tra PDF: Nhấn "In Biên bản Thẩm tra (Mẫu 01/TTr)" để xuất văn bản kết quả thẩm tra chính thức.'
    ],
    tips: [
      'Hệ thống tự động lọc nhanh các mục có sai lệch để thẩm tra viên đối chiếu nhanh chóng.'
    ]
  },
  {
    id: 'quyet-toan-03',
    category: 'Thanh quyết toán',
    title: 'Thanh quyết toán hợp đồng Mẫu 03a/03b (Nghị định 99/2021)',
    summary: 'Lập bảng xác định giá trị khối lượng công việc hoàn thành theo hợp đồng và ngoài hợp đồng phát sinh.',
    icon: '📑',
    targetTab: 'quyet-toan',
    regulations: 'Nghị định số 99/2021/NĐ-CP của Chính phủ về quản lý thanh toán vốn đầu tư công',
    steps: [
      'Phụ lục 03a: Bảng thanh toán khối lượng công việc hoàn thành theo hợp đồng ban đầu.',
      'Phụ lục 03b: Bảng thanh toán khối lượng phát sinh ngoài hợp đồng kèm đơn giá bổ sung.',
      'Lũy kế giải ngân: Theo dõi khối lượng thực hiện kỳ này, lũy kế đến hết kỳ trước và lũy kế đến hết kỳ này.'
    ],
    tips: [
      'Dễ dàng thêm công việc phát sinh mới bằng nút "Thêm công tác phát sinh (03b)".'
    ]
  },
  {
    id: 'tien-do-gantt',
    category: 'Tiến độ thi công',
    title: 'Lập biểu đồ Gantt & Dự báo đường găng tiến độ (CPM)',
    summary: 'Phân tích tiến độ thi công công trình, biểu đồ phân bổ nhân lực và kiểm soát các mốc hoàn thành.',
    icon: '📅',
    targetTab: 'tien-do',
    regulations: 'Quản lý dự án thi công xây dựng công trình',
    steps: [
      'Thêm công việc: Bấm "Thêm công việc" để tạo mốc thi công mới.',
      'Điều chỉnh ngày bắt đầu / kết thúc: Kéo thanh trượt hoặc chỉnh trực tiếp ngày để cập nhật biểu đồ Gantt.',
      'Biểu đồ nhân lực: Theo dõi số công nhân yêu cầu theo ngày để bố trí lán trại và nguồn lực hợp lý.'
    ],
    tips: [
      'Đường găng CPM hiển thị các công việc không có độ trễ thời gian nhằm tránh chậm trễ toàn dự án.'
    ]
  },
  {
    id: 'dau-thau-egp',
    category: 'Đấu thầu E-GP',
    title: 'Tích hợp biểu mẫu Đấu thầu qua mạng Hệ thống E-GP',
    summary: 'Lập hồ sơ dự thầu điện tử theo chuẩn Hệ thống Mạng Đấu thầu Quốc gia (muasamcong.mpi.gov.vn).',
    icon: '🌐',
    targetTab: 'dau-thau',
    regulations: 'Luật Đấu thầu 22/2023/QH15 & Thông tư 06/2024/TT-BKHĐT',
    steps: [
      'Điền thông tin gói thầu: Nhập Số thông báo mời thầu, Tên gói thầu, Chủ đầu tư và Nhà thầu dự thầu.',
      'Kiểm tra bảng giá dự thầu: Đối chiếu đơn giá dự thầu với giá gói thầu đã duyệt.',
      'Xuất bản hồ sơ E-GP: Xuất file dữ liệu số định dạng XML/Excel tương thích với cổng Đấu thầu quốc gia.'
    ],
    tips: [
      'Nên đối chiếu kỹ phần cam kết nhân sự và thiết bị thi công theo E-HSMT trước khi nộp.'
    ]
  },
  {
    id: 'risk-d3',
    category: 'Phân tích rủi ro',
    title: 'Mô phỏng Monte Carlo & Biểu đồ D3 S-Curve biến động chi phí',
    summary: 'Dự báo khả năng vượt ngân sách dự toán và phân tích dòng tiền giải ngân lũy kế theo thời gian.',
    icon: '📈',
    targetTab: 'phan-tich-rui-ro',
    regulations: 'Phương pháp phân tích rủi ro tài chính dự án đầu tư xây dựng',
    steps: [
      'Chọn kịch bản mô phỏng: Kịch bản Cơ sở (Baseline), Lạc quan (-5% đến -8%), Thận trọng (+8% đến +15%) hoặc Xấu nhất (+20% đến +25%).',
      'Điều chỉnh tham số rủi ro: Trượt giá vật liệu thép & xi măng, biến động giá nhiên liệu, rủi ro địa chất ngầm.',
      'Phân tích biểu đồ phân phối xác suất D3: Biểu đồ đường cong mật độ chuẩn hiển thị xác suất dự toán nằm trong các khoảng ngân sách (P50, P80, P90).'
    ],
    tips: [
      'Mức ngân sách P80 là mức an toàn được các tổ chức tài chính quốc tế khuyến nghị sử dụng.'
    ]
  },
  {
    id: 'python-api',
    category: 'Mã nguồn & API',
    title: 'Xuất mã nguồn Python & Kết nối REST API Server',
    summary: 'Hướng dẫn sử dụng engine Python độc lập, database SQLite và tích hợp mô hình BIM Revit.',
    icon: '🐍',
    targetTab: 'python-api',
    regulations: 'Kiến trúc phần mềm mở & Tích hợp Revit / AutoCAD / BIM',
    steps: [
      'Mở trung tâm Python: Nhấn nút "Xuất mã Python & API" trên thanh Ribbon.',
      'Nhập mật khẩu ủy quyền: Chức năng được bảo vệ bản quyền. Nhập chính xác mật khẩu ủy quyền để mở khóa tải xuống.',
      'Tải gói mã nguồn: Sau khi mở khóa, người dùng có thể tải gói Python độc lập (gồm engine tính toán, SQLite database TT12, CLI 15 menu) hoặc gói Full Source Code (.zip).',
      'Chạy REST API Server: Khởi chạy `python app.py` để mở máy chủ cổng 8000 kết nối với ERP.'
    ],
    tips: [
      'Mật khẩu ủy quyền hợp lệ được cấp cho quản trị viên hệ thống.'
    ]
  },
  {
    id: 'license-payment',
    category: 'Bản quyền & Thanh toán',
    title: 'Bản quyền Admin Hoàng Hải An & Các gói dịch vụ MB Bank',
    summary: 'Quy định đặc quyền Admin dùng miễn phí toàn bộ, thành viên thanh toán MB Bank và quy trình phê duyệt kích hoạt.',
    icon: '👑',
    regulations: 'Luật Sở hữu trí tuệ & Điều khoản cấp phép phần mềm Dự toán F1 Pro',
    steps: [
      'Đặc quyền Admin HOÀNG HẢI AN: Được sử dụng MIỄN PHÍ 100% tất cả các gói dịch vụ (Standard, Enterprise, VIP All-Access & Python API trọn đời).',
      'Người dùng & Khách hàng: Cần đăng ký gói dịch vụ và thanh toán chuyển khoản tới tài khoản MB Bank của Admin HOÀNG HẢI AN.',
      'Thông tin thanh toán: Số tài khoản 0030132291981 - MB Bank (Ngân hàng Quân đội) - Chủ tài khoản: HOÀNG HẢI AN.',
      'Quy trình phê duyệt: Sau khi chuyển khoản, người dùng gửi thông tin xác nhận. Admin HOÀNG HẢI AN vào Cổng Phê Duyệt kiểm tra và kích hoạt bản quyền trong 3-10 phút.'
    ],
    tips: [
      'Hotline & Zalo Admin Hoàng Hải An cấp key: 0964058714 | Email: anhh.compt@gmail.com'
    ]
  }
];

const KEYBOARD_SHORTCUTS = [
  { key: 'F1', desc: 'Mở cửa sổ Hướng dẫn sử dụng phần mềm (Help)', group: 'Hệ thống' },
  { key: 'F2', desc: 'Mở cửa sổ Tra cứu mã hiệu định mức Bộ Xây dựng', group: 'Thao tác' },
  { key: 'F3', desc: 'Mở nhanh cửa sổ Lắp giá thông báo tháng từ Sở Xây dựng 63 Tỉnh/Thành', group: 'Thao tác' },
  { key: 'F4', desc: 'Lưu toàn bộ dự án hiện tại vào bộ nhớ cục bộ (LocalStorage)', group: 'Hệ thống' },
  { key: 'F5', desc: 'Làm mới giao diện & đồng bộ tải lại định mức mới nhất từ máy chủ', group: 'Hệ thống' },
  { key: 'F6', desc: 'Chuyển đổi nhanh sang chế độ Xem tóm tắt di động (Mobile THKP)', group: 'Điều hướng' },
  { key: 'F7', desc: 'Mở nhanh cửa sổ Dự toán tài chính tổng hợp (THKP) từ bất kỳ tab nào', group: 'Tài chính' },
  { key: 'F8', desc: 'Mở nhanh hộp thoại Ghi chú cho công tác đang chọn và lưu vào trường note', group: 'Thao tác' },
  { key: 'Ctrl + F', desc: 'Đưa con trỏ vào ô tìm kiếm & lọc nhanh công tác trong bảng Công trình', group: 'Thao tác' },
  { key: 'Ctrl + Z', desc: 'Hoàn tác thao tác vừa thực hiện (Undo) trong bảng dự toán', group: 'Thao tác' },
  { key: 'Ctrl + Y', desc: 'Làm lại thao tác vừa hoàn tác (Redo) trong bảng dự toán', group: 'Thao tác' },
  { key: 'Ctrl + P', desc: 'Xuất toàn bộ bảng tính hiện tại ra PDF mẫu hành chính nhà nước', group: 'Xuất bản' },
  { key: 'Ctrl + E', desc: 'Xuất trọn bộ 8 sheet dự toán ra file Excel (.xlsx)', group: 'Xuất bản' },
  { key: 'Ctrl + S', desc: 'Mở cấu hình dự án và lưu tham số hệ số', group: 'Hệ thống' },
  { key: 'Alt + 1..9', desc: 'Chuyển nhanh giữa các tab phân hệ dự toán (1: Công trình, 6: THKP...)', group: 'Điều hướng' },
  { key: 'Esc', desc: 'Đóng hộp thoại popup, menu hoặc hủy bỏ chế độ nhập', group: 'Hệ thống' },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Khối lượng & Nhập liệu',
    question: 'Làm thế nào để nhập diễn giải kích thước dài × rộng × cao cho một công tác?',
    answer: 'Tại bảng Công trình, bấm nút "Chèn diễn giải KL" trên thanh Ribbon (hoặc icon dấu cộng nhỏ ở dòng công tác). Sau đó nhập tên cấu kiện (VD: Móng M1) và nhập biểu thức kích thước như "10*2.5*1.2*0.5" vào ô biểu thức. Phần mềm sẽ tự động tính ra khối lượng và cộng dồn lên dòng công việc cha.',
    relatedTopicId: 'cong-trinh'
  },
  {
    id: 'faq-2',
    category: 'Khối lượng & Nhập liệu',
    question: 'Làm cách nào để nhân bản một công tác có sẵn diễn giải khối lượng?',
    answer: 'Trên dòng công tác cần sao chép, bạn click vào nút biểu tượng "Nhân bản" (icon 2 trang giấy Copy). Một bản sao giống hệt với mã hiệu, tên, đơn vị và toàn bộ các dòng diễn giải con sẽ được tạo ngay bên dưới.',
    relatedTopicId: 'duplicate-note'
  },
  {
    id: 'faq-3',
    category: 'Vật tư & Giá',
    question: 'Làm sao để đổi tỉnh lập dự toán và cập nhật lại hệ số nhân công, máy thi công?',
    answer: 'Bạn chỉ cần chọn tỉnh từ danh sách "Bộ Đơn giá (63 Tỉnh/Thành)" ở góc trên thanh Header. Toàn bộ hệ số nhân công theo vùng lương (I, II, III, IV) và ca máy thi công sẽ tự động điều chỉnh tương ứng.',
    relatedTopicId: 'thvt'
  },
  {
    id: 'faq-4',
    category: 'Xuất bản & Báo cáo',
    question: 'Phần mềm xuất PDF như thế nào? Có cần cài thêm máy in ảo không?',
    answer: 'Không cần cài đặt thêm bất kỳ phần mềm nào. Bạn chỉ cần nhấn nút "PDF Export (Xuất PDF)" màu đỏ trên Ribbon, hệ thống sẽ tự động dùng thư viện jsPDF để xuất trực tiếp bảng tính ra file PDF chuẩn A4 Ngang (Landscape) với font chữ sắc nét và bảng kẻ theo chuẩn Nghị định 30/2020.',
    relatedTopicId: 'pdf-export'
  },
  {
    id: 'faq-5',
    category: 'An toàn dữ liệu',
    question: 'Nếu tôi vô tình bấm nhầm xóa hoặc sửa sai thì làm sao lấy lại?',
    answer: 'Phần mềm tích hợp đầy đủ hệ thống Hoàn tác (Undo - Ctrl+Z) và Làm lại (Redo - Ctrl+Y). Bạn chỉ cần bấm phím tắt Ctrl+Z hoặc click nút "Hoàn tác" trên Ribbon. Ngoài ra hệ thống tự động sao lưu định kỳ vào LocalStorage nên bạn không bao giờ lo mất dữ liệu.',
    relatedTopicId: 'autosave-restore'
  },
  {
    id: 'faq-6',
    category: 'Bản quyền & Kích hoạt',
    question: 'Làm sao để nâng cấp bản quyền hoặc kích hoạt License Key?',
    answer: 'Nhấn vào nút "Gói Dịch Vụ" trên Ribbon. Bạn có thể chọn gói dịch vụ (Standard, Enterprise, VIP All-Access), quét mã QR thanh toán tới tài khoản MB Bank của Admin HOÀNG HẢI AN, hoặc nhập trực tiếp License Key được cấp để mở khóa ngay.',
    relatedTopicId: 'license-payment'
  }
];

export const HelpManualModal: React.FC<HelpManualModalProps> = ({
  isOpen,
  onClose,
  onOpenUpdateModal,
  onNavigateToTab,
  onDirectExportPdf,
  onOpenNormLookup,
  onOpenMonthlyPrice,
  onOpenSettings,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('workflow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'quickstart' | 'topics' | 'shortcuts' | 'faq' | 'regulations'>('topics');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  // Lọc theo từ khóa tìm kiếm
  const filteredTopics = HELP_TOPICS.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.steps.some(s => s.toLowerCase().includes(q)) ||
      (t.regulations && t.regulations.toLowerCase().includes(q))
    );
  });

  const filteredShortcuts = KEYBOARD_SHORTCUTS.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.key.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q)
    );
  });

  const filteredFaqs = FAQ_ITEMS.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  const selectedTopic = HELP_TOPICS.find(t => t.id === selectedTopicId) || filteredTopics[0] || HELP_TOPICS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTopicAction = (topic: HelpTopic) => {
    onClose();
    if (topic.targetTab && onNavigateToTab) {
      onNavigateToTab(topic.targetTab);
    } else if (topic.id === 'pdf-export' && onDirectExportPdf) {
      onDirectExportPdf();
    } else if (topic.shortcut === 'F2' && onOpenNormLookup) {
      onOpenNormLookup();
    } else if (topic.shortcut === 'F3' && onOpenMonthlyPrice) {
      onOpenMonthlyPrice();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[92vh] flex flex-col text-slate-800 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shadow-inner">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-tight text-white uppercase flex items-center gap-2">
                  <span>HƯỚNG DẪN SỬ DỤNG PHẦN MỀM DỰ TOÁN F1 PRO</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                    Trợ giúp (F1)
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sổ tay nghiệp vụ kỹ sư định giá • Định mức TT 12/2021 &amp; TT 11/2021 • Phím tắt • Thể thức NĐ 30/2020
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenUpdateModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUpdateModal();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Kiểm tra bản cập nhật mới nhất"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Bản cập nhật v2026.4</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Header / Search & Navigation Tabs */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm hướng dẫn (VD: nhân bản, F8, xuất PDF, tra định mức...)"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={() => setActiveTab('quickstart')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quickstart' ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Bắt đầu nhanh</span>
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'topics' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chủ đề chuyên sâu ({HELP_TOPICS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'shortcuts' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Phím tắt (Shortcuts)</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'faq' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QuestionIcon className="w-3.5 h-3.5" />
              <span>Hỏi đáp (FAQ)</span>
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'regulations' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Căn cứ Thông tư BXD</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB 1: BẮT ĐẦU NHANH (QUICK START ROADMAP) */}
          {activeTab === 'quickstart' && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-mono font-semibold">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Lộ trình siêu tốc cho Kỹ sư Định giá</span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">
                    Lập một bộ dự toán hoàn chỉnh trong 6 bước đơn giản
                  </h2>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Hệ thống F1 Pro tự động hóa từ khâu liên kết định mức Bộ Xây dựng, tính toán hao phí, bù giá Sở Xây dựng 63 tỉnh thành đến xuất bản PDF chuẩn Nghị định 30/2020.
                  </p>
                </div>
                <div className="hidden lg:flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                  <span className="text-2xl font-black text-amber-300">100%</span>
                  <span className="text-[11px] font-semibold text-white">Chuẩn TT 12 &amp; TT 11</span>
                  <span className="text-[10px] text-blue-200 mt-1">63 Tỉnh Thành</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    step: 1,
                    icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
                    title: 'Nhập công tác & Kích thước',
                    desc: 'Nhấn F2 để tra mã hiệu định mức, nhập diễn giải dài x rộng x cao. Dùng nút Duplicate để nhân bản công tác nhanh.',
                    tab: 'cong-trinh' as ActiveTab,
                    actionText: 'Mở Bảng Công trình (F2)',
                  },
                  {
                    step: 2,
                    icon: <Layers className="w-5 h-5 text-indigo-600" />,
                    title: 'Phân tích hao phí PTVT',
                    desc: 'Kiểm tra bảng phân tích vật tư tự động bóc tách khối lượng Vật liệu, Nhân công, Máy theo từng đơn vị hoàn thành.',
                    tab: 'ptvt' as ActiveTab,
                    actionText: 'Mở Phân tích vật tư',
                  },
                  {
                    step: 3,
                    icon: <Coins className="w-5 h-5 text-amber-600" />,
                    title: 'Lắp giá tháng 63 Tỉnh',
                    desc: 'Bấm F3 để nạp đơn giá thông báo Sở Xây dựng của địa phương hoặc nhập giá thực tế tại công trường để tính chênh lệch bù giá.',
                    tab: 'thvt' as ActiveTab,
                    actionText: 'Mở Giá tháng & THVT (F3)',
                  },
                  {
                    step: 4,
                    icon: <FileCheck2 className="w-5 h-5 text-emerald-600" />,
                    title: 'Đơn giá chi tiết & Dự thầu',
                    desc: 'Xem bảng phân tích đơn giá đầy đủ gồm chi phí trực tiếp và chi phí gián tiếp phục vụ nộp thầu điện tử E-GP.',
                    tab: 'dgct' as ActiveTab,
                    actionText: 'Mở Đơn giá chi tiết',
                  },
                  {
                    step: 5,
                    icon: <Calculator className="w-5 h-5 text-rose-600" />,
                    title: 'Tổng hợp kinh phí (THKP)',
                    desc: 'Tự động nội suy chi phí chung, chi phí nhà tạm, thuế VAT theo Thông tư 11/2021/TT-BXD. Nhấn F7 để xem nhanh từ mọi tab.',
                    tab: 'thkp' as ActiveTab,
                    actionText: 'Mở Tổng hợp THKP (F7)',
                  },
                  {
                    step: 6,
                    icon: <FileDown className="w-5 h-5 text-teal-600" />,
                    title: 'Xuất PDF & Excel báo cáo',
                    desc: 'Nhấn nút PDF Export màu đỏ trên Ribbon để tải ngay file PDF chuẩn A4 Ngang thể thức Nghị định 30/2020/NĐ-CP.',
                    tab: 'cong-trinh' as ActiveTab,
                    actionText: 'Xuất file PDF trực tiếp',
                    isDirectPdf: true,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                          {item.step}
                        </span>
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (item.isDirectPdf && onDirectExportPdf) {
                          onDirectExportPdf();
                        } else if (onNavigateToTab) {
                          onNavigateToTab(item.tab);
                        }
                      }}
                      className="w-full py-1.5 px-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DANH MỤC CHỦ ĐỀ CHUYÊN SÂU */}
          {activeTab === 'topics' && (
            <>
              {/* Left Sidebar: Topics list */}
              <div className="w-80 border-r border-slate-200 bg-slate-50/70 overflow-y-auto p-3 space-y-1.5 shrink-0">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>DANH MỤC PHÂN HỆ ({filteredTopics.length})</span>
                </div>
                {filteredTopics.map((topic) => {
                  const isSelected = topic.id === selectedTopic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-300 text-blue-900 shadow-xs font-semibold'
                          : 'border-transparent hover:bg-slate-200/60 text-slate-700'
                      }`}
                    >
                      <span className="text-base leading-none mt-0.5">{topic.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">{topic.category}</span>
                          {topic.shortcut && (
                            <span className="text-[9px] px-1 py-0.2 bg-slate-200 text-slate-700 rounded font-mono font-bold">
                              {topic.shortcut}
                            </span>
                          )}
                        </div>
                        <div className="font-semibold truncate text-[11.5px] mt-0.5">{topic.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Content: Topic Details */}
              <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-100 rounded-xl">{selectedTopic.icon}</span>
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          {selectedTopic.category}
                        </span>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {selectedTopic.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTopicAction(selectedTopic)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Trải nghiệm ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedTopic.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedTopic.shortcut && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-300 text-[11px] font-mono font-bold">
                        <Keyboard className="w-3.5 h-3.5 text-blue-600" />
                        <span>Phím tắt: {selectedTopic.shortcut}</span>
                      </div>
                    )}
                    {selectedTopic.regulations && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200 text-[11px] font-medium">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Căn cứ pháp lý: <strong>{selectedTopic.regulations}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Steps Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Các bước thực hiện chi tiết:</span>
                  </h4>
                  <div className="space-y-2.5">
                    {selectedTopic.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Pro Notes */}
                {selectedTopic.tips.length > 0 && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                    <h5 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Mẹo &amp; Lưu ý quan trọng từ Kỹ sư Định giá F1:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-blue-950 pl-5 list-disc">
                      {selectedTopic.tips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: DANH MỤC PHÍM TẮT TOÀN NĂNG */}
          {activeTab === 'shortcuts' && (
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-blue-600" />
                    <span>BẢNG DANH MỤC PHÍM TẮT HỆ THỐNG (HOTKEYS)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tăng 300% tốc độ bóc tách khối lượng và lập dự toán chuyên nghiệp với hệ thống phím tắt tiêu chuẩn F1 Pro
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Tổng cộng: <strong className="text-blue-600">{filteredShortcuts.length}</strong> phím tắt
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredShortcuts.map((sc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-bold">
                        {sc.group}
                      </span>
                      <p className="text-xs text-slate-700 font-medium">{sc.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-700 shadow-2xs whitespace-nowrap">
                        {sc.key}
                      </kbd>
                      <button
                        onClick={() => handleCopy(sc.key, `sc-${idx}`)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Sao chép phím tắt"
                      >
                        {copiedKey === `sc-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HỎI ĐÁP THƯỜNG GẶP (FAQ) */}
          {activeTab === 'faq' && (
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
              <div className="space-y-1 border-b pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <QuestionIcon className="w-4 h-4 text-blue-600" />
                  <span>CÂU HỎI THƯỜNG GẶP (FAQ) VỀ DỰ TOÁN F1 PRO</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Giải đáp chi tiết các vướng mắc phổ biến của kỹ sư khi bóc tách khối lượng và quản lý chi phí đầu tư xây dựng
                </p>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50"
                    >
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block font-mono">
                              {faq.category}
                            </span>
                            <span className="font-bold text-xs text-slate-900 mt-0.5 block">
                              {faq.question}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 text-xs text-slate-700 bg-white border-t border-slate-100 leading-relaxed space-y-2">
                          <p>{faq.answer}</p>
                          {faq.relatedTopicId && (
                            <button
                              onClick={() => {
                                setSelectedTopicId(faq.relatedTopicId!);
                                setActiveTab('topics');
                              }}
                              className="text-blue-600 hover:underline font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer mt-1"
                            >
                              <span>Xem hướng dẫn chi tiết về chủ đề này</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: HỆ THỐNG THÔNG TƯ ĐỊNH MỨC BXD */}
          {activeTab === 'regulations' && (
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
              <div className="space-y-1 border-b pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>CĂN CỨ PHÁP LÝ & HỆ THỐNG THÔNG TƯ ĐỊNH MỨC BỘ XÂY DỰNG</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Phần mềm Dự toán F1 Pro được lập trình tuân thủ nghiêm ngặt các văn bản quy phạm pháp luật hiện hành
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>1. Nghị định số 10/2021/NĐ-CP của Chính phủ</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">Hiệu lực hiện hành</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Về quản lý chi phí đầu tư xây dựng: Quy định phương pháp lập tổng mức đầu tư xây dựng, dự toán xây dựng công trình, dự toán gói thầu, định mức và giá xây dựng công trình.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>2. Thông tư số 12/2021/TT-BXD & Thông tư 14/2023/TT-BXD của Bộ Xây dựng</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">Định mức TT12 &amp; TT14</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Ban hành định mức xây dựng: Định mức dự toán xây dựng công trình (phần khảo sát, xây dựng, lắp đặt, sửa chữa, thí nghiệm vật liệu, quản lý dự án và tư vấn đầu tư).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>3. Thông tư số 11/2021/TT-BXD của Bộ Xây dựng</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold">Xác định chi phí THKP</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Hướng dẫn xác định chi phí đầu tư xây dựng: Bảng 3.1 định mức chi phí chung (nội suy từ dưới 15 tỷ đến trên 1.000 tỷ), chi phí nhà tạm 1.2% - 2.2%, chi phí không xác định được khối lượng từ thiết kế 2.5% và thu nhập chịu thuế tính trước 5.5%.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>4. Nghị định số 30/2020/NĐ-CP của Chính phủ</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold">Thể thức in ấn</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Về công tác văn thư: Quy định chuẩn thể thức và kỹ thuật trình bày văn bản hành chính nhà nước (Quốc hiệu, Tiêu ngữ, Tên cơ quan, Tiêu đề hồ sơ, Khối chữ ký phê duyệt).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>5. Luật Đấu thầu số 22/2023/QH15 & Nghị định số 24/2024/NĐ-CP</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold">Đấu thầu E-GP</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Quy định về đấu thầu lựa chọn nhà thầu qua mạng, lập hồ sơ mời thầu E-HSMT và bảng giá dự thầu điện tử.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Hỗ trợ bản quyền & Kỹ thuật 24/7: <strong>anhh.compt@gmail.com</strong> | Hotline / Zalo Admin Hoàng Hải An: <strong>0964058714</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Đóng hướng dẫn (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
