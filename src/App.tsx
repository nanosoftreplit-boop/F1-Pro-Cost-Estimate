/**
 * Dự toán F1 Pro - Phần mềm Lập dự toán, Dự thầu, Thẩm tra & Quyết toán công trình
 * Tuân thủ Thông tư 12/2021/TT-BXD, TT 11/2021/TT-BXD, TT 14/2023/TT-BXD, NĐ 99/2021/NĐ-CP
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  WorkItem,
  Category,
  ProjectSettings,
  AuditDiffItem,
  SettlementItem,
  GanttTask,
  BiddingForm,
  NormTemplate,
  SubCalculation,
  ProjectType,
} from './types/estimate';
import {
  DEFAULT_PROJECT_SETTINGS,
  DEFAULT_CATEGORIES,
  INITIAL_WORK_ITEMS,
  SAMPLE_AUDIT_DIFFS,
  SAMPLE_SETTLEMENT_ITEMS,
  SAMPLE_GANTT_TASKS,
  SAMPLE_BIDDING_FORM,
} from './data/sampleProjects';
import { evaluateMathExpression } from './utils/calculator';
import { exportProjectToExcel, parseExcelFile, exportSampleExcelTemplate } from './utils/excelExport';
import { PROVINCES_DATA } from './data/provincesData';

import { HeaderRibbon, ActiveTab } from './components/HeaderRibbon';
import { FormulaBar } from './components/FormulaBar';
import { CongTrinhSheet } from './components/CongTrinhSheet';
import { PhanTichVatTuSheet } from './components/PhanTichVatTuSheet';
import { TongHopVatTuSheet } from './components/TongHopVatTuSheet';
import { DonGiaChiTietSheet } from './components/DonGiaChiTietSheet';
import { DuThauSheet } from './components/DuThauSheet';
import { THKPSheet } from './components/THKPSheet';
import { ThamTraSheet } from './components/ThamTraSheet';
import { PhanTichRuiRoSheet } from './components/PhanTichRuiRoSheet';
import { ThanhQuyetToanSheet } from './components/ThanhQuyetToanSheet';
import { TienDoGanttSheet } from './components/TienDoGanttSheet';
import { DauThauOnlineSheet } from './components/DauThauOnlineSheet';
import { PythonExportModal } from './components/PythonExportModal';
import { NormLookupModal } from './components/NormLookupModal';
import { PriceMonthlyModal } from './components/PriceMonthlyModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { MobileTHKPSummaryView } from './components/MobileTHKPSummaryView';
import { AdministrativePrintModal } from './components/AdministrativePrintModal';
import { HelpManualModal } from './components/HelpManualModal';
import { UpdateModal } from './components/UpdateModal';
import { QuickTHKPModal } from './components/QuickTHKPModal';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { ServicePackagesModal } from './components/ServicePackagesModal';
import { FeatureGatePaywall } from './components/FeatureGatePaywall';
import { MultiProjectBar } from './components/MultiProjectBar';
import { MultiProjectManagerModal } from './components/MultiProjectManagerModal';
import { 
  ProjectInstance, 
  createCivilProject, 
  createTrafficProject, 
  createIndustrialProject, 
  createInfrastructureProject, 
  createBlankProject 
} from './data/multiProjectPresets';
import { 
  UserLicenseState, 
  PaymentRequest, 
  PackageId, 
  LicenseKeyRecord,
  ADMIN_PAYMENT_INFO, 
  SERVICE_PACKAGES,
  generateLicenseKey 
} from './types/license';
import { Save, CheckCircle2, RefreshCw, Smartphone, HelpCircle } from 'lucide-react';
import { exportCurrentSheetToDirectPdf } from './utils/directPdfExport';

export interface HistorySnapshot {
  items: WorkItem[];
  categories: Category[];
  actionName: string;
}

function getInitialMultiProjects(): { projects: ProjectInstance[]; activeId: string } {
  try {
    const savedMulti = localStorage.getItem('f1_pro_multi_projects');
    const savedActiveId = localStorage.getItem('f1_pro_active_project_id');
    if (savedMulti) {
      const parsed = JSON.parse(savedMulti);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId = savedActiveId && parsed.some((p: ProjectInstance) => p.id === savedActiveId)
          ? savedActiveId
          : parsed[0].id;
        return { projects: parsed, activeId };
      }
    }

    const singleSaved = localStorage.getItem('f1_pro_saved_project');
    if (singleSaved) {
      const parsedSingle = JSON.parse(singleSaved);
      const proj1: ProjectInstance = {
        id: 'proj-1',
        name: parsedSingle.settings?.projectName || 'Tòa nhà Văn phòng Nanosoft Tower (5 Tầng)',
        settings: parsedSingle.settings || DEFAULT_PROJECT_SETTINGS,
        categories: parsedSingle.categories || DEFAULT_CATEGORIES,
        items: parsedSingle.items || INITIAL_WORK_ITEMS,
        auditDiffs: parsedSingle.auditDiffs || SAMPLE_AUDIT_DIFFS,
        settlements: parsedSingle.settlements || SAMPLE_SETTLEMENT_ITEMS,
        tasks: parsedSingle.tasks || SAMPLE_GANTT_TASKS,
        biddingForm: parsedSingle.biddingForm || SAMPLE_BIDDING_FORM,
        createdAt: Date.now() - 86400000,
        lastModified: Date.now(),
      };
      const proj2 = createTrafficProject('proj-2');
      return { projects: [proj1, proj2], activeId: 'proj-1' };
    }
  } catch (e) {
    console.error('Error loading multi-project state:', e);
  }

  const defaultProj1 = createCivilProject('proj-1');
  const defaultProj2 = createTrafficProject('proj-2');
  return { projects: [defaultProj1, defaultProj2], activeId: 'proj-1' };
}

export default function App() {
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('mobile_thkp') === '1' || window.location.hash === '#mobile-summary';
    }
    return false;
  });

  // Quản lý Đa Dự Án (Multi-Project State)
  const initialProjectsData = getInitialMultiProjects();
  const [projects, setProjects] = useState<ProjectInstance[]>(initialProjectsData.projects);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialProjectsData.activeId);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState<boolean>(false);

  const initialActiveProject = initialProjectsData.projects.find(p => p.id === initialProjectsData.activeId) || initialProjectsData.projects[0];

  const [activeTab, setActiveTab] = useState<ActiveTab>('cong-trinh');
  const [items, setItems] = useState<WorkItem[]>(() => initialActiveProject.items);
  const [categories, setCategories] = useState<Category[]>(() => initialActiveProject.categories);

  // Stack lịch sử thao tác phục vụ Undo / Redo cho bảng Công trình và cấu trúc dự án
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>(() => [
    {
      items: initialActiveProject.items,
      categories: initialActiveProject.categories,
      actionName: `Khởi tạo công trình: ${initialActiveProject.name}`,
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const historyIndexRef = useRef<number>(0);
  const historyStackRef = useRef<HistorySnapshot[]>(historyStack);
  const isUndoingRedoingRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    historyStackRef.current = historyStack;
  }, [historyStack]);

  const [settings, setSettings] = useState<ProjectSettings>(() => initialActiveProject.settings);
  const [auditDiffs, setAuditDiffs] = useState<AuditDiffItem[]>(() => initialActiveProject.auditDiffs);
  const [settlements, setSettlements] = useState<SettlementItem[]>(() => initialActiveProject.settlements);
  const [tasks, setTasks] = useState<GanttTask[]>(() => initialActiveProject.tasks);
  const [biddingForm, setBiddingForm] = useState<BiddingForm>(() => initialActiveProject.biddingForm);

  // Selection
  const [selectedItemId, setSelectedItemId] = useState<string | null>(initialActiveProject.items[1]?.id || null);
  const [selectedSubCalcId, setSelectedSubCalcId] = useState<string | null>(null);

  // Modals
  const [isNormLookupOpen, setIsNormLookupOpen] = useState(false);
  const [targetReplaceItemId, setTargetReplaceItemId] = useState<string | null>(null);
  const [targetCategoryIdForNewItem, setTargetCategoryIdForNewItem] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsModalInitialTab, setSettingsModalInitialTab] = useState<'technical' | 'admin_print'>('technical');
  const [isMonthlyPriceOpen, setIsMonthlyPriceOpen] = useState(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);
  const [isAdminPrintOpen, setIsAdminPrintOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAdminApprovalOpen, setIsAdminApprovalOpen] = useState(false);
  const [isServicePackagesOpen, setIsServicePackagesOpen] = useState(false);
  const [isQuickTHKPOpen, setIsQuickTHKPOpen] = useState(false);

  // Phân quyền & Giấy phép sử dụng: Mặc định là Admin HOÀNG HẢI AN (Miễn phí toàn bộ gói)
  const [userLicense, setUserLicense] = useState<UserLicenseState>(() => {
    try {
      const savedLicense = localStorage.getItem('f1_pro_user_license');
      if (savedLicense) return JSON.parse(savedLicense);
    } catch {}
    return {
      role: 'admin',
      userName: 'HOÀNG HẢI AN',
      activePackageId: 'vip_all',
      isApproved: true,
      licenseKey: 'ADMIN-MASTER-HOANG-HAI-AN-VIP-ALL',
    };
  });

  // Danh sách các License Key được Admin HOÀNG HẢI AN cấp
  const [authorizedKeys, setAuthorizedKeys] = useState<LicenseKeyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('f1_pro_authorized_keys');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        key: 'F1VIP-AN98-2026-MASTER',
        customerName: 'HOÀNG HẢI AN',
        customerPhone: '0030132291981',
        packageId: 'vip_all',
        createdAt: '2026-01-01',
        expiresAt: 'lifetime',
        status: 'active',
        issuedBy: 'Admin Hoàng Hải An',
      }
    ];
  });

  // Danh sách các yêu cầu thanh toán chuyển khoản qua MB Bank
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    try {
      const saved = localStorage.getItem('f1_pro_payment_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Toast thông báo lưu thành công vào LocalStorage / Làm mới dữ liệu
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    subMessage?: string;
    type?: 'save' | 'refresh' | 'info';
    time?: string;
  }>({
    show: false,
    message: '',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Kiểm tra phân hệ có bị khóa đối với người dùng hiện tại không
  const isFeatureLocked = (tab: ActiveTab): boolean => {
    // Admin HOÀNG HẢI AN luôn có quyền sử dụng 100% MIỄN PHÍ toàn bộ các gói dịch vụ
    if (userLicense.role === 'admin') return false;

    // Người dùng đã được phê duyệt hoặc kích hoạt bằng License Key hợp lệ
    if (userLicense.isApproved) {
      if (userLicense.activePackageId === 'vip_all') return false;
      if (userLicense.activePackageId === 'enterprise') {
        if (tab === 'phan-tich-rui-ro' || tab === 'python-api') return true;
        return false;
      }
      if (userLicense.activePackageId === 'standard') {
        if (['tham-tra', 'phan-tich-rui-ro', 'quyet-toan', 'tien-do', 'dau-thau', 'python-api'].includes(tab)) return true;
        return false;
      }
    }

    // Người dùng chưa thanh toán hoặc chưa được Admin phê duyệt:
    // Chỉ được dùng thử các tab cơ bản: cong-trinh, ptvt, thvt
    return ['dgct', 'du-thau', 'thkp', 'tham-tra', 'phan-tich-rui-ro', 'quyet-toan', 'tien-do', 'dau-thau', 'python-api'].includes(tab);
  };

  // Xác thực và kích hoạt bằng License Key do Admin cấp
  const handleActivateWithKey = (inputKey: string): boolean => {
    const cleanKey = inputKey.trim().toUpperCase();
    const found = authorizedKeys.find(k => k.key.toUpperCase() === cleanKey && k.status === 'active');
    const reqFound = paymentRequests.find(r => r.licenseKey && r.licenseKey.toUpperCase() === cleanKey && r.status === 'approved');
    const isValidKeyFormat = cleanKey.startsWith('F1VIP-') || cleanKey.startsWith('F1ENT-') || cleanKey.startsWith('F1STD-');

    if (found || reqFound || (cleanKey.length >= 14 && isValidKeyFormat)) {
      const pkgId = cleanKey.startsWith('F1VIP') ? 'vip_all' : cleanKey.startsWith('F1ENT') ? 'enterprise' : 'standard';
      const updatedLicense: UserLicenseState = {
        role: 'user',
        userName: found?.customerName || reqFound?.customerName || 'Kỹ sư Đã Kích Hoạt',
        activePackageId: pkgId,
        isApproved: true,
        licenseKey: cleanKey,
      };
      setUserLicense(updatedLicense);
      localStorage.setItem('f1_pro_user_license', JSON.stringify(updatedLicense));
      setToast({
        show: true,
        type: 'save',
        message: 'KÍCH HOẠT BẢN QUYỀN THÀNH CÔNG!',
        subMessage: `Đã mở khóa toàn bộ phân hệ theo gói ${pkgId.toUpperCase()}`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
      return true;
    }
    return false;
  };

  // Admin HOÀNG HẢI AN cấp License Key mới cho khách hàng
  const handleIssueNewLicenseKey = (customerName: string, phone: string, packageId: PackageId): string => {
    const newKey = generateLicenseKey(packageId, customerName);
    const newRecord: LicenseKeyRecord = {
      key: newKey,
      customerName,
      customerPhone: phone,
      packageId,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      expiresAt: packageId === 'vip_all' ? 'lifetime' : '1_year',
      status: 'active',
      issuedBy: 'Admin Hoàng Hải An',
    };
    setAuthorizedKeys(prev => {
      const up = [newRecord, ...prev];
      localStorage.setItem('f1_pro_authorized_keys', JSON.stringify(up));
      return up;
    });
    return newKey;
  };

  // Đăng xuất quyền Admin
  const handleAdminLogout = () => {
    const regularUser: UserLicenseState = {
      role: 'user',
      userName: 'Khách hàng',
      activePackageId: 'none',
      isApproved: false,
    };
    setUserLicense(regularUser);
    localStorage.setItem('f1_pro_user_license', JSON.stringify(regularUser));
    setIsAdminApprovalOpen(false);
    setToast({
      show: true,
      type: 'info',
      message: 'Đã đăng xuất khỏi tài khoản Admin HOÀNG HẢI AN',
      subMessage: 'Hệ thống chuyển sang chế độ bảo vệ bản quyền',
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  };

  // Phê duyệt yêu cầu thanh toán (Dành riêng cho Admin HOÀNG HẢI AN)
  const handleApproveRequest = (requestId: string) => {
    let generatedKey = '';
    setPaymentRequests(prev => {
      const updated = prev.map(r => {
        if (r.id !== requestId) return r;
        generatedKey = generateLicenseKey(r.packageId, r.customerName);
        handleIssueNewLicenseKey(r.customerName, r.customerPhone, r.packageId);
        return {
          ...r,
          status: 'approved' as const,
          approvedAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
          approvedBy: 'Admin Hoàng Hải An',
          licenseKey: generatedKey,
        };
      });
      localStorage.setItem('f1_pro_payment_requests', JSON.stringify(updated));
      return updated;
    });

    setToast({
      show: true,
      type: 'save',
      message: `Đã PHÊ DUYỆT yêu cầu ${requestId} & CẤP MÃ BẢN QUYỀN!`,
      subMessage: `Mã Key: ${generatedKey}. Hãy gửi qua Zalo/SĐT hoặc Email để khách hàng nhập mở khóa.`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
  };

  // Từ chối yêu cầu không hợp lệ
  const handleRejectRequest = (requestId: string) => {
    setPaymentRequests(prev => {
      const updated = prev.map(r => r.id === requestId ? { ...r, status: 'rejected' as const } : r);
      localStorage.setItem('f1_pro_payment_requests', JSON.stringify(updated));
      return updated;
    });
  };

  // Người dùng gửi xác nhận đã chuyển khoản qua MB Bank
  const handleSubmitPaymentRequest = (pkgId: PackageId, customerName: string, phone: string, email: string, note?: string) => {
    const pkg = SERVICE_PACKAGES.find(p => p.id === pkgId)!;
    const newReq: PaymentRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      customerName,
      customerEmail: email,
      customerPhone: phone,
      packageId: pkgId,
      packageName: pkg.name,
      amountVnd: pkg.priceVnd,
      transferContent: `F1PRO ${customerName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')} ${pkgId.toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      note,
    };
    setPaymentRequests(prev => {
      const updated = [newReq, ...prev];
      localStorage.setItem('f1_pro_payment_requests', JSON.stringify(updated));
      return updated;
    });
    setToast({
      show: true,
      type: 'info',
      message: 'Đã gửi xác nhận chuyển khoản tới Admin HOÀNG HẢI AN!',
      subMessage: 'Admin sẽ kiểm tra giao dịch MB Bank 0030132291981 và phê duyệt trong ít phút',
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  };

  // Đăng nhập Admin với mật khẩu
  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PAYMENT_INFO.adminPassword) {
      setUserLicense({
        role: 'admin',
        userName: 'HOÀNG HẢI AN',
        activePackageId: 'vip_all',
        isApproved: true,
        licenseKey: 'ADMIN-MASTER-HOANG-HAI-AN-VIP-ALL',
      });
      localStorage.setItem('f1_pro_user_license', JSON.stringify({
        role: 'admin',
        userName: 'HOÀNG HẢI AN',
        activePackageId: 'vip_all',
        isApproved: true,
      }));
      setToast({
        show: true,
        type: 'save',
        message: 'ĐĂNG NHẬP ADMIN HOÀNG HẢI AN THÀNH CÔNG!',
        subMessage: 'Đặc quyền Admin: Dùng MIỄN PHÍ 100% tất cả các gói dịch vụ',
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
      return true;
    }
    return false;
  };

  // Làm mới giao diện và tải lại các định mức mới nhất từ máy chủ (F5)
  const handleRefreshAndSyncNorms = () => {
    setIsRefreshing(true);
    // Tự động tính toán lại khối lượng diễn giải, đồng bộ định mức và làm mới giao diện
    setItems(prev => prev.map(item => {
      if (item.subCalculations && item.subCalculations.length > 0) {
        const updatedSubs = item.subCalculations.map(s => {
          const qty = evaluateMathExpression(s.expression || '0');
          return { ...s, quantity: qty };
        });
        const totalQty = updatedSubs.reduce((sum, s) => sum + s.quantity, 0);
        return {
          ...item,
          subCalculations: updatedSubs,
          quantity: totalQty > 0 ? totalQty : item.quantity
        };
      }
      return item;
    }));

    const currentTime = new Date().toLocaleTimeString('vi-VN');
    setTimeout(() => {
      setIsRefreshing(false);
      setToast({
        show: true,
        type: 'refresh',
        message: 'Đã làm mới giao diện & đồng bộ định mức BXD mới nhất từ máy chủ',
        subMessage: `Đã nạp cơ sở dữ liệu định mức Thông tư 12/2021/TT-BXD và giá gốc Sở Xây dựng ${settings.locationProvince}`,
        time: currentTime,
      });
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
    }, 450);
  };

  // Tự động đồng bộ các thay đổi của dự án đang mở vào danh sách đa dự án
  useEffect(() => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      return {
        ...p,
        name: settings.projectName || p.name,
        settings,
        items,
        categories,
        auditDiffs,
        settlements,
        tasks,
        biddingForm,
        lastModified: Date.now(),
      };
    }));
  }, [items, categories, settings, auditDiffs, settlements, tasks, biddingForm, activeProjectId]);

  // Chuyển đổi giữa các dự án đang mở
  const handleSelectProject = (targetProjectId: string) => {
    if (targetProjectId === activeProjectId) return;

    // Đồng bộ dự án hiện tại trước khi chuyển
    const synced = projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return {
        ...p,
        name: settings.projectName || p.name,
        settings,
        items,
        categories,
        auditDiffs,
        settlements,
        tasks,
        biddingForm,
        lastModified: Date.now(),
      };
    });

    const target = synced.find(p => p.id === targetProjectId);
    if (!target) return;

    setProjects(synced);
    setActiveProjectId(targetProjectId);

    setItems(target.items);
    setCategories(target.categories);
    setSettings(target.settings);
    setAuditDiffs(target.auditDiffs);
    setSettlements(target.settlements);
    setTasks(target.tasks);
    setBiddingForm(target.biddingForm);
    setSelectedItemId(target.items[0]?.id || null);
    setSelectedSubCalcId(null);

    setHistoryStack([
      {
        items: target.items,
        categories: target.categories,
        actionName: `Mở dự án: ${target.name}`,
      }
    ]);
    setHistoryIndex(0);

    localStorage.setItem('f1_pro_active_project_id', targetProjectId);
    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(synced));

    setToast({
      show: true,
      type: 'info',
      message: `ĐÃ CHUYỂN SANG DỰ ÁN: ${target.name.toUpperCase()}`,
      subMessage: `Tỉnh: ${target.settings.locationProvince} • ${target.categories.length} hạng mục • ${target.items.length} công tác`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  // Tạo dự án mới (Trống)
  const handleCreateNewProject = () => {
    const synced = projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, settings, items, categories, auditDiffs, settlements, tasks, biddingForm, lastModified: Date.now() };
    });

    const newProj = createBlankProject(`Dự án Công trình Mới #${projects.length + 1}`);
    const nextList = [...synced, newProj];
    setProjects(nextList);
    setActiveProjectId(newProj.id);

    setItems(newProj.items);
    setCategories(newProj.categories);
    setSettings(newProj.settings);
    setAuditDiffs(newProj.auditDiffs);
    setSettlements(newProj.settlements);
    setTasks(newProj.tasks);
    setBiddingForm(newProj.biddingForm);
    setSelectedItemId(null);
    setSelectedSubCalcId(null);

    setHistoryStack([{ items: newProj.items, categories: newProj.categories, actionName: 'Tạo dự án mới' }]);
    setHistoryIndex(0);

    localStorage.setItem('f1_pro_active_project_id', newProj.id);
    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(nextList));

    setToast({
      show: true,
      type: 'save',
      message: 'ĐÃ TẠO DỰ ÁN MỚI THÀNH CÔNG!',
      subMessage: `${newProj.name} • Bắt đầu bóc tách khối lượng (F2)`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  // Nhân bản dự án
  const handleDuplicateProject = (sourceProjectId?: string) => {
    const targetId = sourceProjectId || activeProjectId;
    const synced = projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, settings, items, categories, auditDiffs, settlements, tasks, biddingForm, lastModified: Date.now() };
    });

    const source = synced.find(p => p.id === targetId);
    if (!source) return;

    const newId = `proj-copy-${Date.now()}`;
    const clonedName = `${source.name} (Bản sao)`;
    const clonedProj: ProjectInstance = {
      id: newId,
      name: clonedName,
      settings: {
        ...JSON.parse(JSON.stringify(source.settings)),
        projectName: clonedName,
      },
      categories: JSON.parse(JSON.stringify(source.categories)),
      items: JSON.parse(JSON.stringify(source.items)),
      auditDiffs: JSON.parse(JSON.stringify(source.auditDiffs)),
      settlements: JSON.parse(JSON.stringify(source.settlements)),
      tasks: JSON.parse(JSON.stringify(source.tasks)),
      biddingForm: JSON.parse(JSON.stringify(source.biddingForm)),
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    const nextList = [...synced, clonedProj];
    setProjects(nextList);
    setActiveProjectId(newId);

    setItems(clonedProj.items);
    setCategories(clonedProj.categories);
    setSettings(clonedProj.settings);
    setAuditDiffs(clonedProj.auditDiffs);
    setSettlements(clonedProj.settlements);
    setTasks(clonedProj.tasks);
    setBiddingForm(clonedProj.biddingForm);
    setSelectedItemId(clonedProj.items[0]?.id || null);
    setSelectedSubCalcId(null);

    setHistoryStack([{ items: clonedProj.items, categories: clonedProj.categories, actionName: `Nhân bản dự án: ${clonedName}` }]);
    setHistoryIndex(0);

    localStorage.setItem('f1_pro_active_project_id', newId);
    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(nextList));

    setToast({
      show: true,
      type: 'save',
      message: 'ĐÃ NHÂN BẢN DỰ ÁN THÀNH CÔNG!',
      subMessage: `Đã mở tab mới: "${clonedName}"`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  // Mở dự án mẫu từ thư viện BXD
  const handleOpenSampleProject = (type: 'civil' | 'transport' | 'industrial' | 'infrastructure') => {
    const synced = projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, settings, items, categories, auditDiffs, settlements, tasks, biddingForm, lastModified: Date.now() };
    });

    let sampleProj: ProjectInstance;
    const newId = `proj-sample-${type}-${Date.now()}`;
    switch (type) {
      case 'transport':
        sampleProj = createTrafficProject(newId);
        break;
      case 'industrial':
        sampleProj = createIndustrialProject(newId);
        break;
      case 'infrastructure':
        sampleProj = createInfrastructureProject(newId);
        break;
      case 'civil':
      default:
        sampleProj = createCivilProject(newId);
        sampleProj.name = `${sampleProj.name} #${projects.length + 1}`;
        sampleProj.settings.projectName = sampleProj.name;
        break;
    }

    const nextList = [...synced, sampleProj];
    setProjects(nextList);
    setActiveProjectId(newId);

    setItems(sampleProj.items);
    setCategories(sampleProj.categories);
    setSettings(sampleProj.settings);
    setAuditDiffs(sampleProj.auditDiffs);
    setSettlements(sampleProj.settlements);
    setTasks(sampleProj.tasks);
    setBiddingForm(sampleProj.biddingForm);
    setSelectedItemId(sampleProj.items[0]?.id || null);
    setSelectedSubCalcId(null);

    setHistoryStack([{ items: sampleProj.items, categories: sampleProj.categories, actionName: `Mở mẫu: ${sampleProj.name}` }]);
    setHistoryIndex(0);

    localStorage.setItem('f1_pro_active_project_id', newId);
    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(nextList));

    setToast({
      show: true,
      type: 'info',
      message: 'ĐÃ MỞ DỰ ÁN MẪU BỘ XÂY DỰNG!',
      subMessage: `${sampleProj.name} (${sampleProj.settings.locationProvince})`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  // Đóng dự án
  const handleCloseProject = (projectId: string) => {
    if (projects.length <= 1) {
      handleCreateNewProject();
      return;
    }

    const projectToClose = projects.find(p => p.id === projectId);
    const remaining = projects.filter(p => p.id !== projectId);

    if (activeProjectId === projectId) {
      const nextProject = remaining[0];
      setActiveProjectId(nextProject.id);
      setItems(nextProject.items);
      setCategories(nextProject.categories);
      setSettings(nextProject.settings);
      setAuditDiffs(nextProject.auditDiffs);
      setSettlements(nextProject.settlements);
      setTasks(nextProject.tasks);
      setBiddingForm(nextProject.biddingForm);
      setSelectedItemId(nextProject.items[0]?.id || null);
      setSelectedSubCalcId(null);

      setHistoryStack([{ items: nextProject.items, categories: nextProject.categories, actionName: `Chuyển sang: ${nextProject.name}` }]);
      setHistoryIndex(0);

      localStorage.setItem('f1_pro_active_project_id', nextProject.id);
    }

    setProjects(remaining);
    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(remaining));

    setToast({
      show: true,
      type: 'info',
      message: 'ĐÃ ĐÓNG DỰ ÁN',
      subMessage: projectToClose ? `Đã đóng tab "${projectToClose.name}"` : 'Đã đóng tab dự án',
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  // Đổi tên dự án
  const handleRenameProject = (projectId: string, newName: string) => {
    const nextList = projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        name: newName,
        settings: {
          ...p.settings,
          projectName: newName,
        },
        lastModified: Date.now(),
      };
    });
    setProjects(nextList);

    if (projectId === activeProjectId) {
      setSettings(prev => ({
        ...prev,
        projectName: newName,
      }));
    }

    localStorage.setItem('f1_pro_multi_projects', JSON.stringify(nextList));
    setToast({
      show: true,
      type: 'save',
      message: 'ĐÃ ĐỔI TÊN DỰ ÁN!',
      subMessage: `Tên mới: "${newName}"`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  // Lưu toàn bộ dự án vào bộ nhớ cục bộ LocalStorage (F4 hoặc Tự động lưu)
  const handleSaveToLocalStorage = (isAuto: boolean = false) => {
    try {
      const currentTime = new Date().toLocaleTimeString('vi-VN');
      const updatedSettings: ProjectSettings = {
        ...settings,
        autoSaveConfig: {
          ...(settings.autoSaveConfig || { enabled: true, intervalMinutes: 5 }),
          lastSavedAt: currentTime
        }
      };
      const projectBundle = {
        timestamp: Date.now(),
        savedAt: currentTime,
        settings: updatedSettings,
        items,
        categories,
        auditDiffs,
        settlements,
        tasks,
        biddingForm,
      };

      const nextMulti = projects.map(p => {
        if (p.id !== activeProjectId) return p;
        return {
          ...p,
          name: updatedSettings.projectName || p.name,
          settings: updatedSettings,
          items,
          categories,
          auditDiffs,
          settlements,
          tasks,
          biddingForm,
          lastModified: Date.now(),
        };
      });

      setProjects(nextMulti);
      localStorage.setItem('f1_pro_saved_project', JSON.stringify(projectBundle));
      localStorage.setItem('f1_pro_multi_projects', JSON.stringify(nextMulti));
      localStorage.setItem('f1_pro_active_project_id', activeProjectId);

      if (isAuto) {
        setSettings(updatedSettings);
        setToast({
          show: true,
          type: 'save',
          message: 'TỰ ĐỘNG LƯU DỰ ÁN (AUTO-SAVE)',
          subMessage: `Đã tự động lưu theo chu kỳ ${settings.autoSaveConfig?.intervalMinutes || 5} phút vào LocalStorage`,
          time: currentTime,
        });
      } else {
        setToast({
          show: true,
          type: 'save',
          message: `Đã lưu dự án "${settings.projectName}" vào bộ nhớ cục bộ`,
          subMessage: `Dữ liệu ${projects.length} dự án được lưu trữ an toàn trong LocalStorage`,
          time: currentTime,
        });
      }
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  // Định kỳ tự động lưu dự án vào LocalStorage theo chu kỳ người dùng cài đặt
  useEffect(() => {
    const isAutoSaveActive = settings.autoSaveConfig?.enabled !== false;
    if (!isAutoSaveActive) return;

    const intervalMinutes = settings.autoSaveConfig?.intervalMinutes || 5;
    const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

    const timer = setInterval(() => {
      handleSaveToLocalStorage(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.autoSaveConfig?.enabled, settings.autoSaveConfig?.intervalMinutes, items, categories, settings, auditDiffs, settlements, tasks, biddingForm]);

  // Chuyển đổi nhanh chế độ Xem tóm tắt di động (Mobile THKP) (F6)
  const handleToggleMobileView = () => {
    setIsMobileView(prev => {
      const next = !prev;
      const currentTime = new Date().toLocaleTimeString('vi-VN');
      setToast({
        show: true,
        type: 'info',
        message: next
          ? 'Đã chuyển sang chế độ Xem tóm tắt di động (Mobile THKP)'
          : 'Đã quay lại giao diện dự toán bàn làm việc (Desktop)',
        subMessage: next
          ? 'Nhấn F6 hoặc bấm nút "Bản PC" để quay lại chế độ đầy đủ'
          : 'Chế độ soạn thảo 10 phân hệ dự toán F1 Pro',
        time: currentTime,
      });
      setTimeout(() => {
        setToast(t => ({ ...t, show: false }));
      }, 3500);
      return next;
    });
  };

  // --- HỆ THỐNG UNDO / REDO CHO BẢNG CÔNG TRÌNH VÀ CẤU TRÚC DỰ ÁN ---
  const pushHistory = (
    newItems: WorkItem[],
    newCategories: Category[],
    actionName: string,
    debounce: boolean = false
  ) => {
    if (isUndoingRedoingRef.current) return;

    const performPush = () => {
      const currentIndex = historyIndexRef.current;
      const currentStack = historyStackRef.current;
      const sliced = currentStack.slice(0, currentIndex + 1);
      const newEntry: HistorySnapshot = {
        items: JSON.parse(JSON.stringify(newItems)),
        categories: JSON.parse(JSON.stringify(newCategories)),
        actionName,
      };
      const nextStack = [...sliced, newEntry];
      if (nextStack.length > 50) {
        nextStack.shift();
      }
      const newIndex = nextStack.length - 1;
      setHistoryStack(nextStack);
      setHistoryIndex(newIndex);
      historyIndexRef.current = newIndex;
      historyStackRef.current = nextStack;
    };

    if (debounce) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        performPush();
      }, 400);
    } else {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      performPush();
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;
  const undoActionName = canUndo ? historyStack[historyIndex]?.actionName : undefined;
  const redoActionName = canRedo ? historyStack[historyIndex + 1]?.actionName : undefined;

  const handleUndo = () => {
    const currentIndex = historyIndexRef.current;
    const currentStack = historyStackRef.current;
    if (currentIndex <= 0) return;

    const targetIndex = currentIndex - 1;
    const targetSnapshot = currentStack[targetIndex];
    const undoneAction = currentStack[currentIndex]?.actionName || 'Thao tác trước';

    isUndoingRedoingRef.current = true;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const restoredItems: WorkItem[] = JSON.parse(JSON.stringify(targetSnapshot.items));
    const restoredCategories: Category[] = JSON.parse(JSON.stringify(targetSnapshot.categories));

    setItems(restoredItems);
    setCategories(restoredCategories);
    setHistoryIndex(targetIndex);
    historyIndexRef.current = targetIndex;

    setToast({
      show: true,
      type: 'info',
      message: 'HOÀN TÁC THÀNH CÔNG (Ctrl+Z)',
      subMessage: `Đã hoàn tác: ${undoneAction}`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);

    setTimeout(() => {
      isUndoingRedoingRef.current = false;
    }, 50);
  };

  const handleRedo = () => {
    const currentIndex = historyIndexRef.current;
    const currentStack = historyStackRef.current;
    if (currentIndex >= currentStack.length - 1) return;

    const targetIndex = currentIndex + 1;
    const targetSnapshot = currentStack[targetIndex];

    isUndoingRedoingRef.current = true;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const restoredItems: WorkItem[] = JSON.parse(JSON.stringify(targetSnapshot.items));
    const restoredCategories: Category[] = JSON.parse(JSON.stringify(targetSnapshot.categories));

    setItems(restoredItems);
    setCategories(restoredCategories);
    setHistoryIndex(targetIndex);
    historyIndexRef.current = targetIndex;

    setToast({
      show: true,
      type: 'info',
      message: 'LÀM LẠI THÀNH CÔNG (Ctrl+Y)',
      subMessage: `Đã khôi phục: ${targetSnapshot.actionName}`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);

    setTimeout(() => {
      isUndoingRedoingRef.current = false;
    }, 50);
  };

  const handleBatchUpdateItems = (newItems: WorkItem[], description: string) => {
    setItems(newItems);
    pushHistory(newItems, categories, description);
  };

  // Phím tắt: F1 (Help), F2 (Tra định mức), F3 (Tra cứu đơn giá tháng), F4 (Lưu dự án), F5 (Làm mới), F6 (Xem tóm tắt di động), F7 (THKP nhanh), Ctrl+Z (Undo), Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Phím tắt Undo (Ctrl+Z / Cmd+Z) & Redo (Ctrl+Y / Cmd+Y / Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        setIsHelpModalOpen(true);
      } else if (e.key === 'F2') {
        e.preventDefault();
        setIsNormLookupOpen(true);
      } else if (e.key === 'F3') {
        e.preventDefault();
        setIsMonthlyPriceOpen(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleSaveToLocalStorage();
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleRefreshAndSyncNorms();
      } else if (e.key === 'F6') {
        e.preventDefault();
        handleToggleMobileView();
      } else if (e.key === 'F7') {
        e.preventDefault();
        setIsQuickTHKPOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, categories, settings, auditDiffs, settlements, tasks, biddingForm, historyIndex, historyStack]);

  const selectedItem = items.find(i => i.id === selectedItemId);
  const selectedSubCalc = selectedItem?.subCalculations?.find(s => s.id === selectedSubCalcId);

  // Chọn công tác hoặc dòng diễn giải
  const handleSelectItem = (item: WorkItem, subCalc?: SubCalculation) => {
    setSelectedItemId(item.id);
    setSelectedSubCalcId(subCalc ? subCalc.id : null);
  };

  // Cập nhật biểu thức tính toán từ FormulaBar
  const handleUpdateExpression = (expr: string) => {
    if (!selectedItemId) return;
    const qty = evaluateMathExpression(expr);
    let updated: WorkItem[];

    if (selectedSubCalcId) {
      // Đang chọn dòng con
      updated = items.map(item => {
        if (item.id !== selectedItemId) return item;
        const updatedSubs = (item.subCalculations || []).map(s => {
          if (s.id !== selectedSubCalcId) return s;
          return { ...s, expression: expr, quantity: qty };
        });
        const totalQty = updatedSubs.reduce((sum, s) => sum + s.quantity, 0);
        return { ...item, subCalculations: updatedSubs, quantity: totalQty };
      });
    } else {
      // Đang chọn dòng công tác cha
      updated = items.map(item => {
        if (item.id !== selectedItemId) return item;
        return { ...item, quantity: qty };
      });
    }
    setItems(updated);
    pushHistory(updated, categories, 'Sửa biểu thức/khối lượng (fx)', true);
  };

  // Cập nhật công tác
  const handleUpdateWorkItem = (itemId: string, patch: Partial<WorkItem>) => {
    const updated = items.map(item => item.id === itemId ? { ...item, ...patch } : item);
    setItems(updated);
    const actionDesc = patch.quantity !== undefined
      ? 'Sửa khối lượng công tác'
      : patch.categoryId !== undefined
      ? 'Chuyển hạng mục công tác'
      : patch.name !== undefined
      ? 'Sửa tên công tác'
      : 'Cập nhật công tác';
    const isTyping = patch.quantity !== undefined || patch.name !== undefined || patch.unit !== undefined || patch.unitPriceMaterial !== undefined || patch.unitPriceLabor !== undefined || patch.unitPriceMachine !== undefined;
    pushHistory(updated, categories, actionDesc, isTyping);
  };

  // Xóa công tác
  const handleDeleteWorkItem = (itemId: string) => {
    const itemToDelete = items.find(i => i.id === itemId);
    const updated = items.filter(item => item.id !== itemId);
    setItems(updated);
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setSelectedSubCalcId(null);
    }
    pushHistory(updated, categories, `Xóa công tác ${itemToDelete?.code || ''}`);
  };

  // Nhân bản công tác (Duplicate)
  const handleDuplicateWorkItem = (itemId: string) => {
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const source = items[index];

    // Tạo bản sao với các thông số khối lượng và diễn giải giữ nguyên
    const duplicatedSubs: SubCalculation[] = (source.subCalculations || []).map((s, idx) => ({
      ...s,
      id: `sub-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
    }));

    const duplicatedItem: WorkItem = {
      ...source,
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subCalculations: duplicatedSubs,
      materials: source.materials ? JSON.parse(JSON.stringify(source.materials)) : [],
      labors: source.labors ? JSON.parse(JSON.stringify(source.labors)) : [],
      machines: source.machines ? JSON.parse(JSON.stringify(source.machines)) : [],
    };

    const newItems = [...items.slice(0, index + 1), duplicatedItem, ...items.slice(index + 1)];
    const reindexed = newItems.map((it, idx) => ({ ...it, stt: idx + 1 }));

    setItems(reindexed);
    setSelectedItemId(duplicatedItem.id);
    setSelectedSubCalcId(null);
    pushHistory(reindexed, categories, `Nhân bản công tác ${source.code}`);

    setToast({
      show: true,
      type: 'info',
      message: `ĐÃ NHÂN BẢN CÔNG TÁC "${source.code}"`,
      subMessage: 'Đã sao chép nguyên vẹn toàn bộ khối lượng, diễn giải dài x rộng x cao và đơn giá',
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  // Thêm công tác mới
  const handleAddWorkItem = () => {
    setTargetReplaceItemId(null);
    setIsNormLookupOpen(true);
  };

  // Chọn định mức từ modal
  const handleSelectNormFromModal = (norm: NormTemplate) => {
    if (targetReplaceItemId) {
      // Thay thế công tác đã có
      const updated = items.map(item => {
        if (item.id !== targetReplaceItemId) return item;
        return {
          ...item,
          code: norm.code,
          name: norm.name,
          unit: norm.unit,
          unitPriceMaterial: norm.defaultPriceMat,
          unitPriceLabor: norm.defaultPriceLab,
          unitPriceMachine: norm.defaultPriceMac,
          materials: norm.materials,
          labors: norm.labors,
          machines: norm.machines,
        };
      });
      setItems(updated);
      setTargetReplaceItemId(null);
      pushHistory(updated, categories, `Đổi mã hiệu ${norm.code}`);
    } else {
      const newStt = items.length + 1;
      const newItem: WorkItem = {
        id: `w-${Date.now()}`,
        stt: newStt,
        type: 'work',
        categoryId: targetCategoryIdForNewItem || categories[0]?.id || 'cat-1',
        code: norm.code,
        name: norm.name,
        unit: norm.unit,
        quantity: 1.0,
        subCalculations: [
          { id: `sub-${Date.now()}`, name: 'Khối lượng thiết kế', expression: '1.0', quantity: 1.0 }
        ],
        unitPriceMaterial: norm.defaultPriceMat,
        unitPriceLabor: norm.defaultPriceLab,
        unitPriceMachine: norm.defaultPriceMac,
        materials: norm.materials,
        labors: norm.labors,
        machines: norm.machines,
      };
      const updated = [...items, newItem];
      setItems(updated);
      setSelectedItemId(newItem.id);
      setSelectedSubCalcId(null);
      setTargetCategoryIdForNewItem(null);
      pushHistory(updated, categories, `Thêm công tác ${norm.code}`);
    }
  };

  // Quản lý hạng mục / nhóm công tác
  const handleAddCategory = (categoryName?: string, projectType?: ProjectType) => {
    const newIdx = categories.length + 1;
    const catName = categoryName?.trim() || `Hạng mục ${newIdx}: Phân đoạn mới`;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: catName,
      projectType: projectType || settings.projectType,
    };
    const updatedCats = [...categories, newCat];
    setCategories(updatedCats);
    pushHistory(items, updatedCats, `Tạo hạng mục "${catName}"`);
    setToast({
      show: true,
      type: 'save',
      message: 'ĐÃ TẠO HẠNG MỤC MỚI!',
      subMessage: `Đã thêm "${catName}" vào dự toán công trình`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleUpdateCategory = (categoryId: string, patch: Partial<Category>) => {
    const updatedCats = categories.map(cat => cat.id === categoryId ? { ...cat, ...patch } : cat);
    setCategories(updatedCats);
    pushHistory(items, updatedCats, `Sửa thông tin hạng mục`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      alert('Công trình phải có ít nhất 1 hạng mục. Không thể xóa hạng mục duy nhất.');
      return;
    }
    const catToDelete = categories.find(c => c.id === categoryId);
    const remainingCats = categories.filter(c => c.id !== categoryId);
    const fallbackCatId = remainingCats[0]?.id;
    const updatedItems = items.map(item => item.categoryId === categoryId ? { ...item, categoryId: fallbackCatId } : item);
    setItems(updatedItems);
    setCategories(remainingCats);
    pushHistory(updatedItems, remainingCats, `Xóa hạng mục "${catToDelete?.name || ''}"`);
    setToast({
      show: true,
      type: 'save',
      message: 'ĐÃ XÓA HẠNG MỤC!',
      subMessage: `Đã chuyển toàn bộ công tác sang "${remainingCats[0]?.name}"`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // Thêm dòng diễn giải con cho công tác
  const handleAddSubCalculation = (targetItemId?: string) => {
    const idToUse = targetItemId || selectedItemId;
    if (!idToUse) return;

    const updated = items.map(item => {
      if (item.id !== idToUse) return item;
      const newSub: SubCalculation = {
        id: `sub-${Date.now()}`,
        name: `Cấu kiện chi tiết ${(item.subCalculations?.length || 0) + 1}`,
        expression: '1 * 1.5 * 2.0',
        quantity: 3.0,
      };
      const updatedSubs = [...(item.subCalculations || []), newSub];
      const newQty = updatedSubs.reduce((sum, s) => sum + s.quantity, 0);
      return { ...item, subCalculations: updatedSubs, quantity: newQty };
    });
    setItems(updated);
    pushHistory(updated, categories, 'Thêm dòng diễn giải khối lượng');
  };

  // Cập nhật dòng diễn giải con
  const handleUpdateSubCalculation = (itemId: string, subId: string, patch: Partial<SubCalculation>) => {
    const updated = items.map(item => {
      if (item.id !== itemId) return item;
      const updatedSubs = (item.subCalculations || []).map(s => s.id === subId ? { ...s, ...patch } : s);
      const newQty = updatedSubs.reduce((sum, s) => sum + s.quantity, 0);
      return { ...item, subCalculations: updatedSubs, quantity: newQty };
    });
    setItems(updated);
    pushHistory(updated, categories, 'Sửa diễn giải khối lượng', true);
  };

  // Xóa dòng diễn giải con
  const handleDeleteSubCalculation = (itemId: string, subId: string) => {
    const updated = items.map(item => {
      if (item.id !== itemId) return item;
      const updatedSubs = (item.subCalculations || []).filter(s => s.id !== subId);
      const newQty = updatedSubs.length > 0 ? updatedSubs.reduce((sum, s) => sum + s.quantity, 0) : item.quantity;
      return { ...item, subCalculations: updatedSubs, quantity: newQty };
    });
    setItems(updated);
    if (selectedSubCalcId === subId) {
      setSelectedSubCalcId(null);
    }
    pushHistory(updated, categories, 'Xóa dòng diễn giải khối lượng');
  };

  // Cập nhật giá tháng trên toàn dự án
  const handleUpdateMonthlyPrice = (matCode: string, newMonthlyPrice: number) => {
    setItems(prev => prev.map(item => {
      const updatedMaterials = (item.materials || []).map(m => {
        if (m.code === matCode) {
          return { ...m, monthlyPrice: newMonthlyPrice };
        }
        return m;
      });
      return { ...item, materials: updatedMaterials };
    }));
  };

  // Áp dụng hàng loạt giá thông báo tháng từ Sở Xây dựng
  const handleApplyMonthlyPricesBatch = (pricesMap: Record<string, number>) => {
    setItems(prev => prev.map(item => {
      const updatedMaterials = (item.materials || []).map(m => {
        if (pricesMap[m.code] !== undefined) {
          return { ...m, monthlyPrice: pricesMap[m.code] };
        }
        return m;
      });
      return { ...item, materials: updatedMaterials };
    }));
  };

  // Xuất file Excel
  const handleExportExcel = () => {
    if (userLicense.role !== 'admin' && !userLicense.isApproved) {
      setToast({
        show: true,
        type: 'info',
        message: 'Tính năng Xuất Excel yêu cầu bản quyền!',
        subMessage: 'Vui lòng thanh toán qua MB Bank và nhận sự phê duyệt từ Admin HOÀNG HẢI AN',
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setIsServicePackagesOpen(true);
      return;
    }
    exportProjectToExcel(items, categories, settings, settlements, tasks);
  };

  // Xuất file PDF trực tiếp chuẩn hành chính bằng jsPDF
  const handleDirectExportPdf = async () => {
    if (userLicense.role !== 'admin' && !userLicense.isApproved) {
      setToast({
        show: true,
        type: 'info',
        message: 'Tính năng Xuất PDF Trực tiếp (NĐ 30/2020) yêu cầu bản quyền!',
        subMessage: 'Vui lòng liên hệ Admin HOÀNG HẢI AN để được kích hoạt bản quyền F1 Pro',
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setIsServicePackagesOpen(true);
      return;
    }

    try {
      setIsExportingPdf(true);
      setToast({
        show: true,
        type: 'info',
        message: 'ĐANG TẠO BÁO CÁO PDF HÀNH CHÍNH (jsPDF)...',
        subMessage: `Chuẩn Nghị định 30/2020/NĐ-CP • Biểu mẫu ${activeTab.toUpperCase()}`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });

      await exportCurrentSheetToDirectPdf({
        activeTab,
        items,
        categories,
        settings,
        settlements,
        tasks,
        auditDiffs,
      });

      setToast({
        show: true,
        type: 'save',
        message: 'XUẤT PDF TRỰC TIẾP THÀNH CÔNG!',
        subMessage: `Đã tải về file PDF chuẩn hành chính cho sheet ${activeTab.toUpperCase()}`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
    } catch (err) {
      console.error('Lỗi xuất PDF:', err);
      setToast({
        show: true,
        type: 'refresh',
        message: 'KHÔNG THỂ XUẤT FILE PDF',
        subMessage: 'Vui lòng thử lại hoặc sử dụng tính năng Xem in Hành chính',
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Mở cửa sổ in ấn hành chính (yêu cầu bản quyền)
  const handleOpenAdminPrint = () => {
    if (userLicense.role !== 'admin' && !userLicense.isApproved) {
      setToast({
        show: true,
        type: 'info',
        message: 'Xuất PDF Thể thức Hành chính (NĐ 30/2020) yêu cầu bản quyền!',
        subMessage: 'Vui lòng liên hệ Admin HOÀNG HẢI AN để được phê duyệt kích hoạt',
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setIsServicePackagesOpen(true);
      return;
    }
    setIsAdminPrintOpen(true);
  };

  // Nhập file Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await parseExcelFile(file);
      if (res.items && res.items.length > 0) {
        const importedWorkItems: WorkItem[] = res.items.map((raw, idx) => ({
          id: `imp-${Date.now()}-${idx}`,
          stt: idx + 1,
          type: 'work',
          categoryId: categories[0]?.id || 'cat-1',
          code: raw.code || 'AF.TEMP',
          name: raw.name || `Công tác nhập khẩu ${idx + 1}`,
          unit: raw.unit || 'm3',
          quantity: raw.quantity || 1,
          subCalculations: [],
          unitPriceMaterial: raw.unitPriceMaterial || 0,
          unitPriceLabor: raw.unitPriceLabor || 0,
          unitPriceMachine: raw.unitPriceMachine || 0,
          materials: [],
          labors: [],
          machines: [],
        }));
        setItems(importedWorkItems);
        setActiveTab('cong-trinh');
      }
    } catch (err) {
      alert('Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng file!');
    }
  };

  // Khôi phục dữ liệu mẫu
  const handleResetSample = () => {
    if (window.confirm('Khôi phục lại toàn bộ dữ liệu dự án mẫu chuẩn Dự toán F1?')) {
      try {
        localStorage.removeItem('f1_pro_saved_project');
      } catch {}
      setItems(INITIAL_WORK_ITEMS);
      setCategories(DEFAULT_CATEGORIES);
      setSettings(DEFAULT_PROJECT_SETTINGS);
      setAuditDiffs(SAMPLE_AUDIT_DIFFS);
      setSettlements(SAMPLE_SETTLEMENT_ITEMS);
      setTasks(SAMPLE_GANTT_TASKS);
      setBiddingForm(SAMPLE_BIDDING_FORM);
      setSelectedItemId(INITIAL_WORK_ITEMS[1]?.id || null);
      setSelectedSubCalcId(null);
    }
  };

  // Áp dụng kết quả thẩm tra
  const handleApplyAllAuditChanges = () => {
    setItems(prev => prev.map(item => {
      const diff = auditDiffs.find(d => d.code === item.code);
      if (diff) {
        return {
          ...item,
          quantity: diff.auditQty,
        };
      }
      return item;
    }));
    setActiveTab('cong-trinh');
  };

  // Thay đổi tỉnh thành (trong danh mục 63 tỉnh thành)
  const handleChangeProvince = (provinceName: string) => {
    const prov = PROVINCES_DATA.find(p => p.name === provinceName);
    if (prov) {
      setSettings(prev => ({
        ...prev,
        locationProvince: prov.name,
        salaryRegion: prov.region
      }));

      // Tự động điều chỉnh nhân công và máy thi công theo hệ số tỉnh mới
      setItems(prevItems => prevItems.map(item => {
        const adjustedLab = Math.round(item.unitPriceLabor * prov.laborCoefficient);
        const adjustedMac = Math.round(item.unitPriceMachine * prov.machineCoefficient);
        return {
          ...item,
          unitPriceLabor: adjustedLab,
          unitPriceMachine: adjustedMac,
        };
      }));

      setToast({
        show: true,
        type: 'info',
        message: `ĐÃ NẠP BỘ ĐƠN GIÁ & QUYẾT ĐỊNH SỞ XÂY DỰNG ${prov.name.toUpperCase()}!`,
        subMessage: `${prov.decisionNumber || 'Công bố đơn giá BXD'} • Lương Vùng ${prov.region} • Bậc 3.5/7: ${prov.commonLaborPrice ? prov.commonLaborPrice.toLocaleString('vi-VN') : '288.324'} đ/công`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
    }
  };

  if (isMobileView) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <MobileTHKPSummaryView
          settings={settings}
          items={items}
          categories={categories}
          onExitMobileView={handleToggleMobileView}
        />
        {/* Toast thông báo chế độ mobile */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700/80 text-white rounded-xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200">
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toast.type === 'refresh'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : toast.type === 'info'
                ? 'bg-indigo-500 text-white font-bold'
                : 'bg-emerald-500 text-slate-950 font-bold'
            }`}>
              {toast.type === 'refresh' ? (
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              ) : toast.type === 'info' ? (
                <Smartphone className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div className="text-xs">
              <p className={`font-bold ${
                toast.type === 'refresh'
                  ? 'text-cyan-300'
                  : toast.type === 'info'
                  ? 'text-indigo-300'
                  : 'text-emerald-300'
              }`}>
                {toast.message}
              </p>
              <p className="text-[10px] text-slate-400">
                {toast.subMessage || `Thời gian: ${toast.time}`} • Phím tắt F6
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      {/* 0. Thanh Quản Lý Đa Dự Án (Multi-Project Workspace Tab Bar) */}
      <MultiProjectBar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCloseProject={handleCloseProject}
        onCreateNewProject={handleCreateNewProject}
        onDuplicateProject={handleDuplicateProject}
        onOpenSampleProject={handleOpenSampleProject}
        onRenameProject={handleRenameProject}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
      />

      {/* 1. Authentic F1 Header Ribbon */}
      <HeaderRibbon
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onChangeProvince={handleChangeProvince}
        onOpenSettings={() => {
          setSettingsModalInitialTab('technical');
          setIsSettingsOpen(true);
        }}
        onOpenNormLookup={() => {
          setTargetReplaceItemId(null);
          setIsNormLookupOpen(true);
        }}
        onOpenMonthlyPrice={() => setIsMonthlyPriceOpen(true)}
        onAddWorkItem={handleAddWorkItem}
        onAddSubCalculation={() => handleAddSubCalculation()}
        onExportExcel={handleExportExcel}
        onDirectExportPdf={handleDirectExportPdf}
        isExportingPdf={isExportingPdf}
        onImportExcel={handleImportExcel}
        onDownloadSampleExcel={exportSampleExcelTemplate}
        onOpenPythonModal={() => setIsPythonModalOpen(true)}
        onResetSample={handleResetSample}
        onOpenAdminPrint={handleOpenAdminPrint}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenUpdate={() => setIsUpdateModalOpen(true)}
        onSaveProject={handleSaveToLocalStorage}
        onRefresh={handleRefreshAndSyncNorms}
        isRefreshing={isRefreshing}
        onToggleMobileView={handleToggleMobileView}
        isMobileView={isMobileView}
        onOpenQuickTHKP={() => setIsQuickTHKPOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        undoActionName={undoActionName}
        redoActionName={redoActionName}
        userRole={userLicense.role}
        pendingApprovalCount={paymentRequests.filter(r => r.status === 'pending').length}
        onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
        onOpenServicePackages={() => setIsServicePackagesOpen(true)}
        isUserApproved={userLicense.isApproved}
        onOpenMultiProjects={() => setIsProjectManagerOpen(true)}
        openProjectsCount={projects.length}
      />

      {/* 2. Formula Bar (Active when in Công trình sheet) */}
      {activeTab === 'cong-trinh' && (
        <FormulaBar
          selectedItem={selectedItem}
          selectedSubCalc={selectedSubCalc}
          onUpdateExpression={handleUpdateExpression}
        />
      )}

      {/* 3. Main Workspace Sub-System Content */}
      <main className="flex-1 overflow-hidden relative">
        {isFeatureLocked(activeTab) ? (
          <FeatureGatePaywall
            featureName={
              activeTab === 'dgct' ? 'Bảng Đơn giá chi tiết' :
              activeTab === 'du-thau' ? 'Bảng Giá Dự thầu' :
              activeTab === 'thkp' ? 'Tổng hợp kinh phí THKP (Thông tư 11/2021)' :
              activeTab === 'tham-tra' ? 'Thẩm tra & So sánh sai lệch dự toán' :
              activeTab === 'phan-tich-rui-ro' ? 'Phân tích rủi ro Monte Carlo & Biểu đồ D3 S-Curve' :
              activeTab === 'quyet-toan' ? 'Thanh quyết toán hợp đồng 03a/03b (NĐ 99/2021)' :
              activeTab === 'tien-do' ? 'Tiến độ thi công Gantt & Đường găng CPM' :
              activeTab === 'dau-thau' ? 'Đấu thầu trực tuyến qua mạng E-GP' :
              'Xuất mã nguồn Python & REST API Server'
            }
            requiredPackageId={
              activeTab === 'phan-tich-rui-ro' || activeTab === 'python-api' ? 'vip_all' :
              ['tham-tra', 'quyet-toan', 'tien-do', 'dau-thau'].includes(activeTab) ? 'enterprise' : 'standard'
            }
            onOpenPaymentModal={() => setIsServicePackagesOpen(true)}
            onActivateWithKey={handleActivateWithKey}
            onAdminLogin={handleAdminLogin}
          />
        ) : (
          <>
            {activeTab === 'cong-trinh' && (
          <CongTrinhSheet
            items={items}
            categories={categories}
            selectedItemId={selectedItemId}
            selectedSubCalcId={selectedSubCalcId}
            onSelectItem={handleSelectItem}
            onUpdateWorkItem={handleUpdateWorkItem}
            onDeleteWorkItem={handleDeleteWorkItem}
            onDuplicateWorkItem={handleDuplicateWorkItem}
            onAddSubCalculation={handleAddSubCalculation}
            onUpdateSubCalculation={handleUpdateSubCalculation}
            onDeleteSubCalculation={handleDeleteSubCalculation}
            onOpenNormLookupForWorkItem={(itemId) => {
              setTargetReplaceItemId(itemId);
              setIsNormLookupOpen(true);
            }}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onOpenNormLookupForCategory={(catId) => {
              setTargetReplaceItemId(null);
              setTargetCategoryIdForNewItem(catId);
              setIsNormLookupOpen(true);
            }}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            undoActionName={undoActionName}
            redoActionName={redoActionName}
            onBatchUpdateItems={handleBatchUpdateItems}
          />
        )}

        {activeTab === 'ptvt' && (
          <PhanTichVatTuSheet
            items={items}
            onUpdateWorkItem={handleUpdateWorkItem}
          />
        )}

        {activeTab === 'thvt' && (
          <TongHopVatTuSheet
            items={items}
            settings={settings}
            onUpdateMonthlyPrice={handleUpdateMonthlyPrice}
            onOpenMonthlyPriceModal={() => setIsMonthlyPriceOpen(true)}
          />
        )}

        {activeTab === 'dgct' && (
          <DonGiaChiTietSheet
            items={items}
            settings={settings}
          />
        )}

        {activeTab === 'du-thau' && (
          <DuThauSheet
            items={items}
            settings={settings}
          />
        )}

        {activeTab === 'thkp' && (
          <THKPSheet
            items={items}
            categories={categories}
            settings={settings}
            onUpdateSettings={setSettings}
            onUpdateCategories={setCategories}
            onExportExcel={handleExportExcel}
            onOpenAdminPrint={() => setIsAdminPrintOpen(true)}
          />
        )}

        {activeTab === 'tham-tra' && (
          <ThamTraSheet
            auditDiffs={auditDiffs}
            settings={settings}
            onUpdateAuditDiff={(idx, patch) => {
              setAuditDiffs(prev => prev.map((item, i) => i === idx ? { ...item, ...patch } : item));
            }}
            onApplyAllAuditChanges={handleApplyAllAuditChanges}
          />
        )}

        {activeTab === 'phan-tich-rui-ro' && (
          <PhanTichRuiRoSheet
            items={items}
            categories={categories}
            settings={settings}
          />
        )}

        {activeTab === 'quyet-toan' && (
          <ThanhQuyetToanSheet
            settlements={settlements}
            settings={settings}
            onUpdateSettlement={(id, patch) => {
              setSettlements(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
            }}
            onAddSettlementItem={(isAdd) => {
              const newS: SettlementItem = {
                id: `s-${Date.now()}`,
                code: isAdd ? 'PS.001' : 'HD.NEW',
                name: isAdd ? 'Công việc phát sinh mới theo biên bản hiện trường' : 'Công việc trong hợp đồng',
                unit: 'm3',
                contractQty: isAdd ? 0 : 10,
                contractPrice: 1250000,
                prevAccumulatedQty: 0,
                thisPeriodQty: 5,
                totalAccumulatedQty: 5,
                isAdditional: isAdd,
              };
              setSettlements(prev => [...prev, newS]);
            }}
            onDeleteSettlementItem={(id) => {
              setSettlements(prev => prev.filter(s => s.id !== id));
            }}
          />
        )}

        {activeTab === 'tien-do' && (
          <TienDoGanttSheet
            tasks={tasks}
            settings={settings}
            onUpdateTask={(id, patch) => {
              setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
            }}
            onAddTask={() => {
              const newTask: GanttTask = {
                id: `g-${Date.now()}`,
                name: `Công tác thi công ${tasks.length + 1}`,
                startDate: '2026-05-01',
                endDate: '2026-05-15',
                durationDays: 15,
                progressPercent: 0,
                workersRequired: 16,
              };
              setTasks(prev => [...prev, newTask]);
            }}
            onDeleteTask={(id) => {
              setTasks(prev => prev.filter(t => t.id !== id));
            }}
          />
        )}

        {activeTab === 'dau-thau' && (
          <DauThauOnlineSheet
            biddingForm={biddingForm}
            items={items}
            settings={settings}
            onUpdateBiddingForm={(patch) => setBiddingForm(prev => ({ ...prev, ...patch }))}
          />
        )}

        {activeTab === 'python-api' && (
          <div className="h-full flex items-center justify-center p-6 bg-slate-900 select-none">
            <div className="max-w-xl text-center space-y-4">
              <span className="p-3 bg-blue-600/20 text-blue-400 rounded-full inline-block border border-blue-500/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 font-mono text-[11px] font-bold">
                  <span>🔒 Chức năng được bảo vệ bằng mật khẩu bảo mật</span>
                </div>
                <h2 className="text-xl font-bold text-white">Xuất mã nguồn Python & Tích hợp REST API</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tải về toàn bộ mã nguồn Python độc lập bao gồm engine tính toán, thư viện định mức Thông tư 12, máy chủ FastAPI và tài liệu API để đồng bộ hóa hai chiều với AutoCAD, Revit và hệ thống kế toán.
                <br />
                <span className="text-amber-400 text-[11px]">Chỉ người dùng có mật khẩu xác thực mới được phép tải xuống gói mã nguồn.</span>
              </p>
              <button
                onClick={() => setIsPythonModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Mở trung tâm Xuất Python (Yêu cầu mật khẩu)
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* 4. Global Modals */}
      <NormLookupModal
        isOpen={isNormLookupOpen}
        onClose={() => setIsNormLookupOpen(false)}
        onSelectNorm={handleSelectNormFromModal}
      />

      <PriceMonthlyModal
        isOpen={isMonthlyPriceOpen}
        onClose={() => setIsMonthlyPriceOpen(false)}
        settings={settings}
        onApplyMonthlyPrices={handleApplyMonthlyPricesBatch}
        onChangeProvince={handleChangeProvince}
      />

      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        initialTab={settingsModalInitialTab}
      />

      <PythonExportModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        items={items}
        categories={categories}
        settings={settings}
        settlements={settlements}
        tasks={tasks}
        biddingForm={biddingForm}
        isAdmin={userLicense.role === 'admin'}
      />

      {isAdminPrintOpen && (
        <AdministrativePrintModal
          isOpen={isAdminPrintOpen}
          onClose={() => setIsAdminPrintOpen(false)}
          currentTab={activeTab}
          items={items}
          categories={categories}
          settings={settings}
          settlements={settlements}
          tasks={tasks}
          auditDiffs={auditDiffs}
          onOpenSettingsModal={(tab) => {
            setIsAdminPrintOpen(false);
            setSettingsModalInitialTab(tab || 'admin_print');
            setIsSettingsOpen(true);
          }}
        />
      )}

      {isHelpModalOpen && (
        <HelpManualModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          onDirectExportPdf={handleDirectExportPdf}
          onOpenNormLookup={() => {
            setTargetReplaceItemId(null);
            setIsNormLookupOpen(true);
          }}
          onOpenMonthlyPrice={() => setIsMonthlyPriceOpen(true)}
          onOpenSettings={() => {
            setSettingsModalInitialTab('technical');
            setIsSettingsOpen(true);
          }}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
        />
      )}

      {/* Cổng Phê Duyệt & Cấp Bản quyền Admin HOÀNG HẢI AN */}
      {isAdminApprovalOpen && (
        <AdminApprovalModal
          isOpen={isAdminApprovalOpen}
          onClose={() => setIsAdminApprovalOpen(false)}
          currentUserRole={userLicense.role}
          onAdminLogout={handleAdminLogout}
          requests={paymentRequests}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onIssueNewLicenseKey={handleIssueNewLicenseKey}
        />
      )}

      {/* Bảng giá các Gói Dịch Vụ & Thanh toán MB Bank Admin HOÀNG HẢI AN */}
      {isServicePackagesOpen && (
        <ServicePackagesModal
          isOpen={isServicePackagesOpen}
          onClose={() => setIsServicePackagesOpen(false)}
          userLicense={userLicense}
          onSubmitPaymentRequest={handleSubmitPaymentRequest}
          onAdminLogin={handleAdminLogin}
          onActivateWithKey={handleActivateWithKey}
          onOpenAdminApproval={() => {
            setIsServicePackagesOpen(false);
            setIsAdminApprovalOpen(true);
          }}
        />
      )}

      {/* Cửa sổ Dự toán tài chính tổng hợp nhanh (Phím tắt F7) */}
      <QuickTHKPModal
        isOpen={isQuickTHKPOpen}
        onClose={() => setIsQuickTHKPOpen(false)}
        items={items}
        categories={categories}
        settings={settings}
        onNavigateToTHKPTab={() => {
          setIsQuickTHKPOpen(false);
          setActiveTab('thkp');
        }}
        onExportExcel={handleExportExcel}
        onOpenAdminPrint={handleOpenAdminPrint}
      />

      {/* Trung tâm Quản lý Đa Dự Án (Multi-Project Manager Modal) */}
      {isProjectManagerOpen && (
        <MultiProjectManagerModal
          isOpen={isProjectManagerOpen}
          onClose={() => setIsProjectManagerOpen(false)}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProject}
          onCloseProject={handleCloseProject}
          onCreateNewProject={handleCreateNewProject}
          onDuplicateProject={handleDuplicateProject}
          onOpenSampleProject={handleOpenSampleProject}
          onRenameProject={handleRenameProject}
        />
      )}

      {/* Floating Quick Help / Sổ tay Hướng dẫn sử dụng F1 */}
      <button
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 rounded-full shadow-lg backdrop-blur-md transition-all cursor-pointer group text-xs font-semibold"
        title="Mở sổ tay Hướng dẫn sử dụng phần mềm & danh mục phím tắt (Phím tắt F1)"
      >
        <HelpCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Hướng dẫn (F1)</span>
      </button>

      {/* Toast thông báo lưu thành công vào LocalStorage (F4), Làm mới (F5) hoặc Xem tóm tắt (F6) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700/80 text-white rounded-xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200">
          <div className={`p-1.5 rounded-lg shrink-0 ${
            toast.type === 'refresh'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : toast.type === 'info'
              ? 'bg-indigo-500 text-white font-bold'
              : 'bg-emerald-500 text-slate-950 font-bold'
          }`}>
            {toast.type === 'refresh' ? (
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            ) : toast.type === 'info' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <div className="text-xs">
            <p className={`font-bold ${
              toast.type === 'refresh'
                ? 'text-cyan-300'
                : toast.type === 'info'
                ? 'text-indigo-300'
                : 'text-emerald-300'
            }`}>
              {toast.message}
            </p>
            <p className="text-[10px] text-slate-400">
              {toast.subMessage || `Thời gian: ${toast.time}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
