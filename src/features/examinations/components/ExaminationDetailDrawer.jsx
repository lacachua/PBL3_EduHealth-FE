import React from 'react';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import '../styles/examinationUi.css';

const dateTimeLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString('vi-VN', { hour12: false });
};

const shortText = (value, limit = 110) => {
  const text = String(value || '').trim();
  if (!text) {
    return '--';
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim()}...`;
};

const ExaminationDetailDrawer = ({
  open,
  detail,
  loading,
  error,
  onClose,
  onRetry,
  onOpenDetailPage,
}) => {
  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      widthClass="max-w-[680px]"
      panelAnimationClass="animate-[nurseSlideInRight_220ms_ease-out]"
      title="Phiếu khám"
      subtitle={detail?.id ? `Phiếu ${detail.id}` : 'Thông tin tóm tắt'}
      headerActions={detail?.id ? (
        <button
          type="button"
          onClick={onOpenDetailPage}
          className="exam-btn-text nurse-focus-ring inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
        >
          Mở trang chi tiết
        </button>
      ) : null}
    >
      {loading ? <p className="text-sm text-[#64748B]">Đang tải chi tiết phiếu khám...</p> : null}

      {error ? (
        <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md border border-[#FCA5A5] px-2.5 py-1 text-xs font-semibold text-[#B91C1C] transition hover:bg-[#FEE2E2]"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!loading && !error && detail ? (
        <div className="space-y-3.5 exam-drawer-open">
          <section className="exam-section-subtle rounded-lg p-3">
            <h3 className="text-sm font-bold text-[#0F172A]">Thông tin chung</h3>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155] sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#64748B]">Mã phiếu khám</dt>
                <dd className="font-medium text-[#0F172A]">{detail.id || '--'}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Ngày khám</dt>
                <dd className="font-medium text-[#0F172A]">{dateTimeLabel(detail.visitDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Học sinh</dt>
                <dd className="font-medium text-[#0F172A]">{detail.student?.fullName || '--'}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Mã học sinh</dt>
                <dd className="font-medium text-[#0F172A]">{detail.student?.studentId || '--'}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Lớp</dt>
                <dd className="font-medium text-[#0F172A]">{detail.student?.className || '--'}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Y tá phụ trách</dt>
                <dd className="font-medium text-[#0F172A]">{detail.nurse?.fullName || '--'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-[#64748B]">Loại bệnh</dt>
                <dd className="font-medium text-[#0F172A]">{detail.diseaseType?.name || '--'}</dd>
              </div>
            </dl>
          </section>

          <section className="exam-card rounded-lg p-3">
            <h3 className="text-sm font-bold text-[#0F172A]">Tóm tắt lần khám</h3>
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <p className="text-xs text-[#64748B]">Triệu chứng</p>
                <p className="font-medium text-[#0F172A]">{shortText(detail.symptoms)}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Chẩn đoán</p>
                <p className="font-medium text-[#0F172A]">{shortText(detail.diagnosis)}</p>
              </div>
            </div>
          </section>

          <section className="exam-card rounded-lg p-3">
            <h3 className="text-sm font-bold text-[#0F172A]">Đơn thuốc</h3>
            {Array.isArray(detail.prescriptions) && detail.prescriptions.length ? (
              <ul className="mt-2 space-y-2">
                {detail.prescriptions.slice(0, 2).map((item) => (
                  <li key={item.prescriptionId} className="exam-section-subtle rounded-md px-3 py-2 text-sm">
                    <p className="font-semibold text-[#0F172A]">{item.medicineName || '--'}</p>
                    <p className="text-xs text-[#64748B]">Số lượng: {item.quantity ?? '--'}</p>
                    <p className="text-xs text-[#64748B]">Liều dùng: {item.dosage || '--'}</p>
                  </li>
                ))}
                {detail.prescriptions.length > 2 ? (
                  <li className="text-xs text-[#64748B]">+ {detail.prescriptions.length - 2} thuốc khác. Mở trang chi tiết để xem đầy đủ.</li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[#64748B]">Không có đơn thuốc trong phiếu khám này.</p>
            )}
          </section>
        </div>
      ) : null}
    </RightDrawer>
  );
};

export default ExaminationDetailDrawer;
