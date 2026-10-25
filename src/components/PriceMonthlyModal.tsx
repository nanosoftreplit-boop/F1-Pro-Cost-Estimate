import React, { useState } from 'react';
import { ProjectSettings } from '../types/estimate';
import { PROVINCES_DATA, findProvince } from '../data/provincesData';
import { formatVND } from '../utils/calculator';
import { 
  Coins, Check, X, ShieldAlert, MapPin, Building2, 
  Search, CheckCircle2, FileText, Fuel, Users, ArrowRight, Layers
} from 'lucide-react';

interface MonthlyPriceCatalogItem {
  code: string;
  name: string;
  unit: string;
  basePrice: number;
  noticePrice: number;
  source: string;
}

interface PriceMonthlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onApplyMonthlyPrices: (prices: Record<string, number>) => void;
  onChangeProvince?: (provinceName: string) => void;
}

export const PriceMonthlyModal: React.FC<PriceMonthlyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onApplyMonthlyPrices,
  onChangeProvince,
}) => {
  const [activeTab, setActiveTab] = useState<'material_notice' | 'all_provinces'>('material_notice');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(settings.locationProvince);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1_2026');
  const [provinceSearch, setProvinceSearch] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'I' | 'II' | 'III' | 'IV'>('all');

  if (!isOpen) return null;

  const currentProvince = findProvince(selectedProvinceName) || PROVINCES_DATA[0];
  const matKeys = currentProvince.keyMaterials;

  // Bảng thông báo giá vật liệu xây dựng thực tế theo Sở Xây dựng địa phương
  const NOTICE_PRICES: MonthlyPriceCatalogItem[] = [
    { 
      code: 'VL_XM40', 
      name: 'Xi măng Vicem / Hoàng Thạch PCB40', 
      unit: 'kg', 
      basePrice: 1820, 
      noticePrice: matKeys?.cementPCB40 || 1950, 
      source: `Công bố giá Sở XD ${currentProvince.name}` 
    },
    { 
      code: 'VL_XM30', 
      name: 'Xi măng Bút Sơn / Tam Điệp PCB30', 
      unit: 'kg', 
      basePrice: 1650, 
      noticePrice: Math.round((matKeys?.cementPCB40 || 1950) * 0.9), 
      source: `Công bố giá Sở XD ${currentProvince.name}` 
    },
    { 
      code: 'VL_CATV', 
      name: `Cát vàng hạt trung (mỏ cát xây dựng ${currentProvince.name})`, 
      unit: 'm3', 
      basePrice: 280000, 
      noticePrice: matKeys?.sandMedium || 320000, 
      source: `Liên sở XD - TC ${currentProvince.name}` 
    },
    { 
      code: 'VL_CATM', 
      name: 'Cát mịn trát tường', 
      unit: 'm3', 
      basePrice: 270000, 
      noticePrice: Math.round((matKeys?.sandMedium || 320000) * 0.92), 
      source: 'Báo giá liên sở' 
    },
    { 
      code: 'VL_DA12', 
      name: `Đá 1x2 mỏ đá ${currentProvince.name}`, 
      unit: 'm3', 
      basePrice: 340000, 
      noticePrice: matKeys?.stone1x2 || 385000, 
      source: `Công bố giá mỏ đá ${currentProvince.name}` 
    },
    { 
      code: 'VL_DA46', 
      name: 'Đá 4x6 lót móng', 
      unit: 'm3', 
      basePrice: 240000, 
      noticePrice: matKeys?.stone4x6 || 265000, 
      source: 'Công bố giá mỏ đá' 
    },
    { 
      code: 'VL_THEP10', 
      name: 'Thép Hòa Phát / Việt Đức D<=10mm CB240T', 
      unit: 'tấn', 
      basePrice: 16800000, 
      noticePrice: (matKeys?.steelCB300 ? matKeys.steelCB300 * 1000 : 17250000), 
      source: 'Báo giá nhà máy & đại lý cấp 1' 
    },
    { 
      code: 'VL_THEP18', 
      name: 'Thép thanh vằn Hòa Phát D<=18mm CB400V', 
      unit: 'tấn', 
      basePrice: 16500000, 
      noticePrice: (matKeys?.steelCB400 ? matKeys.steelCB400 * 1000 : 17050000), 
      source: 'Báo giá nhà máy & đại lý cấp 1' 
    },
    { 
      code: 'VL_GACHONG', 
      name: 'Gạch tuynel 8x8x19 loại A', 
      unit: 'viên', 
      basePrice: 1200, 
      noticePrice: matKeys?.brickTuynel || 1380, 
      source: `Công bố giá liên sở ${currentProvince.name}` 
    },
    { 
      code: 'VL_BTTM250', 
      name: `Bê tông tươi thương phẩm Mác 250 đá 1x2 trạm trộn ${currentProvince.name}`, 
      unit: 'm3', 
      basePrice: 1280000, 
      noticePrice: matKeys?.readyMixedConcreteM250 || 1350000, 
      source: 'Hiệp hội Bê tông Việt Nam' 
    },
    { 
      code: 'VL_VKPHIM', 
      name: 'Ván ép phủ phim 18mm phủ keo phenolic', 
      unit: 'm2', 
      basePrice: 145000, 
      noticePrice: 155000, 
      source: 'Báo giá tổng kho ván ép' 
    },
    { 
      code: 'VL_GACH60', 
      name: 'Gạch granite Đồng Tâm 600x600', 
      unit: 'm2', 
      basePrice: 145000, 
      noticePrice: 165000, 
      source: 'Showroom Đồng Tâm niêm yết' 
    },
    { 
      code: 'VL_SONPHU', 
      name: 'Sơn nội thất cao cấp Maxilite / Dulux', 
      unit: 'kg', 
      basePrice: 65000, 
      noticePrice: 70000, 
      source: 'Đại lý sơn cấp 1' 
    },
    { 
      code: 'VL_DAYDIEN', 
      name: 'Dây điện đôi Cadivi 2x2.5mm2', 
      unit: 'm', 
      basePrice: 14500, 
      noticePrice: 15800, 
      source: 'Bảng giá Cadivi niêm yết' 
    },
    { 
      code: 'VL_ONGPPR', 
      name: 'Ống nước nóng PPR Tiền Phong D25', 
      unit: 'm', 
      basePrice: 32000, 
      noticePrice: 35000, 
      source: 'Nhựa Tiền Phong niêm yết' 
    },
  ];

  const handleApply = () => {
    if (onChangeProvince && selectedProvinceName !== settings.locationProvince) {
      onChangeProvince(selectedProvinceName);
    }
    const patchMap: Record<string, number> = {};
    NOTICE_PRICES.forEach(item => {
      patchMap[item.code] = item.noticePrice;
    });
    onApplyMonthlyPrices(patchMap);
    onClose();
  };

  const filteredProvinces = PROVINCES_DATA.filter(p => {
    if (regionFilter !== 'all' && p.region !== regionFilter) return false;
    if (!provinceSearch.trim()) return true;
    const q = provinceSearch.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.decisionNumber && p.decisionNumber.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[88vh] flex flex-col text-xs text-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Coins className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white uppercase">
                  BỘ ĐƠN GIÁ 63 TỈNH THÀNH & GIÁ THÔNG BÁO VẬT LIỆU XÂY DỰNG
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
                  Sở Xây dựng 63 Tỉnh/Thành
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Áp dụng quyết định công bố bộ đơn giá xây dựng, đơn giá nhân công TT 13/2021 và giá liên sở hàng tháng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher & province selector bar */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('material_notice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'material_notice'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Giá thông báo VLXD ({currentProvince.name})</span>
            </button>

            <button
              onClick={() => setActiveTab('all_provinces')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all_provinces'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Danh mục Đơn giá 63 Tỉnh/Thành ({PROVINCES_DATA.length})</span>
            </button>
          </div>

          {/* Quick province switch dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600">Chọn tỉnh/thành:</span>
            <select
              value={selectedProvinceName}
              onChange={(e) => setSelectedProvinceName(e.target.value)}
              className="px-2.5 py-1 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg bg-white shadow-2xs cursor-pointer focus:outline-hidden focus:border-blue-500"
            >
              {PROVINCES_DATA.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name} (Vùng {p.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Province Official Header Banner */}
        <div className="px-5 py-3 bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {currentProvince.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {currentProvince.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Phân vùng lương: Vùng {currentProvince.region}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Hệ số NC: {currentProvince.laborCoefficient}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Căn cứ: <strong>{currentProvince.decisionNumber}</strong> • Ban hành ngày <strong>{currentProvince.decisionDate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Lương thợ 3.5/7</span>
              <strong className="font-mono text-blue-700 text-xs">
                {currentProvince.commonLaborPrice ? formatVND(currentProvince.commonLaborPrice) : '288.324'} đ/công
              </strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Xăng RON 95</span>
              <strong className="font-mono text-slate-800 text-xs">
                {formatVND(currentProvince.gasolinePrice)} đ/lít
              </strong>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Dầu Diesel</span>
              <strong className="font-mono text-slate-800 text-xs">
                {formatVND(currentProvince.dieselPrice)} đ/lít
              </strong>
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'material_notice' ? (
            /* Tab 1: Notice Material Price Table */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">
                  Bảng giá vật tư theo công bố giá tháng/quý của Liên sở Xây dựng - Tài chính {currentProvince.name}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Kỳ áp dụng:</span>
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold"
                  >
                    <option value="Q1_2026">Quý 1/2026 (Mới nhất - Năm 2026)</option>
                    <option value="Q4_2025">Quý 4/2025</option>
                    <option value="Q3_2025">Quý 3/2025</option>
                  </select>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full border-collapse table-auto select-text">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="f1-header-cell w-20">Mã VT</th>
                      <th className="f1-header-cell text-left px-3">Tên vật liệu xây dựng</th>
                      <th className="f1-header-cell w-14">ĐVT</th>
                      <th className="f1-header-cell w-28">Giá gốc BXD</th>
                      <th className="f1-header-cell w-32 bg-amber-100 font-extrabold text-amber-900">
                        Giá thông báo {currentProvince.name}
                      </th>
                      <th className="f1-header-cell w-28">Chênh lệch</th>
                      <th className="f1-header-cell min-w-[180px] text-left px-3">Căn cứ công bố giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NOTICE_PRICES.map((item) => {
                      const diff = item.noticePrice - item.basePrice;
                      return (
                        <tr key={item.code} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                          <td className="f1-cell text-center font-mono font-bold text-slate-600">{item.code}</td>
                          <td className="f1-cell px-3 font-semibold text-slate-900">{item.name}</td>
                          <td className="f1-cell text-center text-slate-600 font-medium">{item.unit}</td>
                          <td className="f1-cell text-right tabular-nums text-slate-600 font-mono">{formatVND(item.basePrice)}</td>
                          <td className="f1-cell text-right tabular-nums font-black text-amber-900 bg-amber-50/60 font-mono">
                            {formatVND(item.noticePrice)}
                          </td>
                          <td className={`f1-cell text-right tabular-nums font-mono font-bold ${diff > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                            {diff > 0 ? `+${formatVND(diff)}` : formatVND(diff)}
                          </td>
                          <td className="f1-cell px-3 text-slate-500 text-[10px] italic">{item.source}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab 2: 63 Provinces Directory */
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="relative w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                    placeholder="Tìm theo tên tỉnh, mã hoặc số QĐ..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Lọc theo Vùng:</span>
                  {(['all', 'I', 'II', 'III', 'IV'] as const).map(reg => (
                    <button
                      key={reg}
                      onClick={() => setRegionFilter(reg)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        regionFilter === reg
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {reg === 'all' ? 'Tất cả 63 Tỉnh' : `Vùng ${reg}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProvinces.map((prov) => {
                  const isCurrent = prov.name === selectedProvinceName;
                  return (
                    <div
                      key={prov.id}
                      onClick={() => setSelectedProvinceName(prov.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{prov.name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600 font-mono">
                              {prov.id}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Lương Vùng {prov.region} • HS Nhân công: {prov.laborCoefficient}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isCurrent ? 'Đang chọn' : 'Chọn tỉnh'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                        <div className="truncate">
                          Quyết định: <strong>{prov.decisionNumber || 'Công bố đơn giá BXD'}</strong>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Ngày: {prov.decisionDate || '2026'}</span>
                          <span>Lương 3.5/7: <strong className="text-blue-700 font-mono">{prov.commonLaborPrice ? formatVND(prov.commonLaborPrice) : '288.324'} đ</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Áp dụng sẽ tự động nạp bảng giá tháng vào dự toán và cập nhật tỉnh thành sang <strong>{currentProvince.name} (Vùng {currentProvince.region})</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ÁP DỤNG BỘ ĐƠN GIÁ & GIÁ THÁNG {currentProvince.name.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
