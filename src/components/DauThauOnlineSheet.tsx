import React, { useState } from 'react';
import { BiddingForm, WorkItem, ProjectSettings } from '../types/estimate';
import { computeDetailedUnitPrices, formatVND } from '../utils/calculator';
import { Send, CheckCircle2, AlertCircle, FileCode, Download, Shield, ExternalLink } from 'lucide-react';

interface DauThauOnlineSheetProps {
  biddingForm: BiddingForm;
  items: WorkItem[];
  settings: ProjectSettings;
  onUpdateBiddingForm: (patch: Partial<BiddingForm>) => void;
}

export const DauThauOnlineSheet: React.FC<DauThauOnlineSheetProps> = ({
  biddingForm,
  items,
  settings,
  onUpdateBiddingForm,
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'14' | '18' | '19'>('18');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const detailed = computeDetailedUnitPrices(items, settings);

  let totalPreTax = 0;
  let totalPostTax = 0;
  detailed.forEach((d, idx) => {
    const q = items[idx]?.quantity || 0;
    totalPreTax += q * d.unitPricePreTax;
    totalPostTax += q * d.unitPricePostTax;
  });

  const discountAmount = totalPostTax * (biddingForm.discountRate / 100);
  const finalBidPrice = totalPostTax - discountAmount;

  const handleExportXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<E_HSDT xmlns="http://muasamcong.mpi.gov.vn/schema/bid/v1">
  <ThongTinGoiThau>
    <MaGoiThau>${biddingForm.packageCode}</MaGoiThau>
    <TenGoiThau>${biddingForm.packageName}</TenGoiThau>
    <NhaThau>${biddingForm.bidderName}</NhaThau>
    <ThoiGianThucHienNgay>${biddingForm.executionDurationDays}</ThoiGianThucHienNgay>
    <HieuLucHSDTNgay>${biddingForm.validityDays}</HieuLucHSDTNgay>
    <GiaDuThauChuaVAT>${totalPreTax}</GiaDuThauChuaVAT>
    <GiaDuThauSauGiamGia>${finalBidPrice}</GiaDuThauSauGiamGia>
  </ThongTinGoiThau>
  <BieuGiaDuThau>
${detailed.map((d, i) => `    <HangMuc stt="${i+1}">
      <MaHieu>${d.code}</MaHieu>
      <TenCongTac><![CDATA[${d.name}]]></TenCongTac>
      <DonVi>${d.unit}</DonVi>
      <KhoidLuong>${items[i]?.quantity || 0}</KhoidLuong>
      <DonGiaChuaVAT>${d.unitPricePreTax}</DonGiaChuaVAT>
      <DonGiaCoVAT>${d.unitPricePostTax}</DonGiaCoVAT>
      <ThanhTien>${(items[i]?.quantity || 0) * d.unitPricePostTax}</ThanhTien>
    </HangMuc>`).join('\n')}
  </BieuGiaDuThau>
</E_HSDT>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `E_GP_${biddingForm.packageCode}_BieuGiaThau.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Đã xuất file XML định dạng chuẩn Mạng Đấu thầu Quốc gia (muasamcong.mpi.gov.vn)!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportWebformJSON = () => {
    const webformData = {
      package: biddingForm,
      items: detailed.map((d, i) => ({
        stt: i + 1,
        code: d.code,
        name: d.name,
        unit: d.unit,
        quantity: items[i]?.quantity || 0,
        unitPrice: d.unitPricePostTax,
        amount: (items[i]?.quantity || 0) * d.unitPricePostTax
      }))
    };

    const blob = new Blob([JSON.stringify(webformData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `E_GP_Webform_${biddingForm.packageCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Đã xuất file Webform JSON để nộp trực tuyến qua extension E-GP!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-sm tracking-tight">
            PHÂN HỆ ĐẤU THẦU TRỰC TUYẾN E-GP (HỆ THỐNG MẠNG ĐẤU THẦU QUỐC GIA)
          </span>
          <span className="text-slate-400 text-xs">· muasamcong.mpi.gov.vn</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXML}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất XML E-HSMT</span>
          </button>
          <button
            onClick={handleExportWebformJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Xuất Webform JSON</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Package Parameters */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3">
        <div className="bg-white p-2.5 rounded border border-slate-200">
          <label className="text-[11px] text-slate-500 block mb-1">Mã thông báo mời thầu (TBMT):</label>
          <input
            type="text"
            value={biddingForm.packageCode}
            onChange={(e) => onUpdateBiddingForm({ packageCode: e.target.value })}
            className="w-full text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded px-2 py-1"
          />
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200 col-span-2">
          <label className="text-[11px] text-slate-500 block mb-1">Tên gói thầu:</label>
          <input
            type="text"
            value={biddingForm.packageName}
            onChange={(e) => onUpdateBiddingForm({ packageName: e.target.value })}
            className="w-full text-xs font-semibold text-slate-800 border border-slate-300 rounded px-2 py-1"
          />
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <label className="text-[11px] text-slate-500 block mb-1">Thời gian thực hiện hợp đồng:</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={biddingForm.executionDurationDays}
              onChange={(e) => onUpdateBiddingForm({ executionDurationDays: parseInt(e.target.value) || 0 })}
              className="w-20 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded px-2 py-1"
            />
            <span className="text-slate-500">ngày</span>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <label className="text-[11px] text-slate-500 block mb-1">Thời gian có hiệu lực của HSDT:</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={biddingForm.validityDays}
              onChange={(e) => onUpdateBiddingForm({ validityDays: parseInt(e.target.value) || 0 })}
              className="w-20 text-xs font-mono font-bold text-slate-800 border border-slate-300 rounded px-2 py-1"
            />
            <span className="text-slate-500">ngày</span>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <label className="text-[11px] text-slate-500 block mb-1">Tỷ lệ giảm giá thư giảm giá:</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={biddingForm.discountRate}
              onChange={(e) => onUpdateBiddingForm({ discountRate: parseFloat(e.target.value) || 0 })}
              className="w-20 text-xs font-mono font-bold text-amber-700 border border-slate-300 rounded px-2 py-1"
            />
            <span className="text-slate-500">%</span>
          </div>
        </div>
      </div>

      {/* Tabs for E-GP Standard Templates */}
      <div className="flex items-center gap-1 px-4 py-1.5 bg-slate-100 border-b border-slate-200">
        <button
          onClick={() => setActiveFormTab('18')}
          className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
            activeFormTab === '18' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mẫu số 18: Bảng tổng hợp giá dự thầu (Webform E-GP)
        </button>
        <button
          onClick={() => setActiveFormTab('19')}
          className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
            activeFormTab === '19' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mẫu số 19: Bảng đơn giá dự thầu chi tiết
        </button>
        <button
          onClick={() => setActiveFormTab('14')}
          className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
            activeFormTab === '14' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mẫu số 14: Đơn dự thầu điện tử
        </button>
      </div>

      {/* Form Content Display */}
      <div className="flex-1 overflow-auto p-4">
        {activeFormTab === '18' && (
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full border-collapse table-auto select-text">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="f1-header-cell w-12">STT</th>
                  <th className="f1-header-cell w-28">Mã hạng mục</th>
                  <th className="f1-header-cell text-left px-3">Mô tả công việc dự thầu</th>
                  <th className="f1-header-cell w-20">ĐVT</th>
                  <th className="f1-header-cell w-24">Khối lượng</th>
                  <th className="f1-header-cell w-32">Đơn giá dự thầu (VNĐ)</th>
                  <th className="f1-header-cell w-36">Thành tiền (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {detailed.map((d, i) => {
                  const q = items[i]?.quantity || 0;
                  const amt = q * d.unitPricePostTax;
                  return (
                    <tr key={d.workItemId} className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="f1-cell text-center font-mono text-slate-500">{i + 1}</td>
                      <td className="f1-cell text-center font-mono font-medium text-blue-700">{d.code}</td>
                      <td className="f1-cell px-3 text-slate-800 font-medium">{d.name}</td>
                      <td className="f1-cell text-center text-slate-600">{d.unit}</td>
                      <td className="f1-cell text-right tabular-nums font-mono text-slate-900">{q}</td>
                      <td className="f1-cell text-right tabular-nums font-mono text-slate-700">{formatVND(d.unitPricePostTax)}</td>
                      <td className="f1-cell text-right tabular-nums font-mono font-semibold text-slate-900">{formatVND(amt)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td colSpan={6} className="f1-cell text-right py-2 pr-4 text-slate-300">
                    TỔNG GIÁ DỰ THẦU SAU THUẾ VAT (TRƯỚC GIẢM GIÁ):
                  </td>
                  <td className="f1-cell text-right tabular-nums text-emerald-400 text-sm">
                    {formatVND(totalPostTax)}
                  </td>
                </tr>
                {biddingForm.discountRate > 0 && (
                  <tr className="bg-slate-800 text-amber-300">
                    <td colSpan={6} className="f1-cell text-right py-1.5 pr-4 text-xs">
                      GIÁ DỰ THẦU CHÍNH THỨC SAU KHI ÁP DỤNG THƯ GIẢM GIÁ ({biddingForm.discountRate}%):
                    </td>
                    <td className="f1-cell text-right tabular-nums text-amber-400 font-extrabold text-sm">
                      {formatVND(finalBidPrice)}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        )}

        {activeFormTab === '14' && (
          <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded border border-slate-300 text-xs text-slate-700 space-y-3">
            <h3 className="font-bold text-center text-sm uppercase text-slate-900">
              MẪU SỐ 14: ĐƠN DỰ THẦU (ÁP DỤNG CHO ĐẤU THẦU QUA MẠNG)
            </h3>
            <p><strong>Kính gửi:</strong> Ban Quản lý Dự án Xây dựng</p>
            <p>Sau khi nghiên cứu hồ sơ mời thầu (E-HSMT) gói thầu: <strong>{biddingForm.packageName}</strong> (Mã TBMT: <strong>{biddingForm.packageCode}</strong>), nhà thầu chúng tôi cam kết:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Thực hiện toàn bộ khối lượng công việc theo đúng yêu cầu kỹ thuật và tiến độ đề ra.</li>
              <li>Tổng giá dự thầu của chúng tôi là: <strong className="text-blue-700 font-mono text-sm">{formatVND(finalBidPrice)} VNĐ</strong>.</li>
              <li>Thời gian thực hiện gói thầu là: <strong>{biddingForm.executionDurationDays} ngày</strong>.</li>
              <li>Hồ sơ dự thầu này có hiệu lực trong vòng <strong>{biddingForm.validityDays} ngày</strong> kể từ ngày đóng thầu.</li>
            </ol>
          </div>
        )}

        {activeFormTab === '19' && (
          <div className="text-slate-600 text-center py-8">
            <p className="font-medium text-slate-800 mb-2">Biểu mẫu số 19 hiển thị chi tiết các chi phí cấu thành đơn giá</p>
            <p className="text-xs text-slate-500">Dữ liệu được xuất tự động cùng với file XML E-HSMT hoặc Webform JSON khi nộp thầu.</p>
          </div>
        )}
      </div>
    </div>
  );
};
