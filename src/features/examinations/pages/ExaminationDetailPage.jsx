import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { getExaminationDetail } from '../services/getExaminationDetail';
import '../styles/examinationUi.css';

const dateTimeLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString('vi-VN', { hour12: false });
};

const ExaminationDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examinationId } = useParams();

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (location.state?.feedback) {
      setFeedback(location.state.feedback);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!examinationId) {
      setStatus('error');
      setError('Mã phiếu khám không hợp lệ.');
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      setStatus('loading');
      setError('');

      try {
        const response = await getExaminationDetail(examinationId);

        if (!isMounted) {
          return;
        }

        setData(response?.data || null);
        setStatus(response?.data ? 'success' : 'empty');
      } catch (apiError) {
        if (!isMounted) {
          return;
        }

        setData(null);
        setStatus('error');
        setError(normalizeApiMessage(apiError));
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [examinationId]);

  return (
    <div className="exam-module exam-page-bg space-y-3.5 rounded-2xl p-1.5 md:p-2">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]"
        classMap={{
          error: 'border-[#DC2626]/25 bg-[#FEE2E2] text-[#B91C1C]',
          success: 'border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]',
        }}
      />

      <section className="exam-banner rounded-2xl px-4 py-3.5 sm:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-[#163126] sm:text-[1.62rem]">Chi tiết phiếu khám</h1>
            <p className="mt-1 text-sm text-[#5F746B]">Theo dõi toàn bộ thông tin lần khám và toa thuốc đã ghi nhận.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/nurse/examinations')}
            className="exam-btn-secondary nurse-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            Quay lại danh sách
          </button>
        </div>
      </section>

      <AdminAsyncState
        status={status}
        error={error}
        onRetry={() => navigate(0)}
        loadingLabel="Đang tải chi tiết phiếu khám..."
        emptyTitle="Không có dữ liệu"
        emptyDescription="Không tìm thấy phiếu khám tương ứng."
        containerClassName="px-0 py-0"
      >
        {data ? (
          <div className="space-y-3.5">
            <section className="exam-card rounded-xl p-4">
              <h2 className="text-sm font-bold text-[#163126]">Thông tin chung</h2>
              <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155] sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#64748B]">Mã phiếu khám</dt>
                  <dd className="font-medium text-[#0F172A]">{data.id || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#64748B]">Ngày khám</dt>
                  <dd className="font-medium text-[#0F172A]">{dateTimeLabel(data.visitDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#64748B]">Học sinh</dt>
                  <dd className="font-medium text-[#0F172A]">{data.student?.fullName || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#64748B]">Mã học sinh</dt>
                  <dd className="font-medium text-[#0F172A]">{data.student?.studentId || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#64748B]">Lớp</dt>
                  <dd className="font-medium text-[#0F172A]">{data.student?.className || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#64748B]">Y tá phụ trách</dt>
                  <dd className="font-medium text-[#0F172A]">{data.nurse?.fullName || '--'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#64748B]">Loại bệnh</dt>
                  <dd className="font-medium text-[#0F172A]">{data.diseaseType?.name || '--'}</dd>
                </div>
              </dl>
            </section>

            <section className="exam-card rounded-xl p-4">
              <h2 className="text-sm font-bold text-[#163126]">Nội dung khám</h2>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155]">
                <div>
                  <p className="text-xs text-[#64748B]">Triệu chứng</p>
                  <p className="font-medium text-[#0F172A]">{data.symptoms || '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Chẩn đoán</p>
                  <p className="font-medium text-[#0F172A]">{data.diagnosis || '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Hướng xử lý</p>
                  <p className="font-medium text-[#0F172A]">{data.treatment || '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Ghi chú</p>
                  <p className="font-medium text-[#0F172A]">{data.note || '--'}</p>
                </div>
              </div>
            </section>

            <section className="exam-card rounded-xl p-4">
              <h2 className="text-sm font-bold text-[#163126]">Đơn thuốc</h2>
              {Array.isArray(data.prescriptions) && data.prescriptions.length ? (
                <div className="mt-2 space-y-2">
                  {data.prescriptions.map((item) => (
                    <article key={item.prescriptionId} className="exam-section-subtle rounded-md px-3 py-2">
                      <p className="text-sm font-semibold text-[#163126]">{item.medicineName || '--'}</p>
                      <p className="text-xs text-[#5F746B]">Số lượng: {item.quantity ?? '--'}</p>
                      <p className="text-xs text-[#5F746B]">Liều dùng: {item.dosage || '--'}</p>
                      <p className="text-xs text-[#5F746B]">Hướng dẫn sử dụng: {item.usageInstruction || '--'}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#64748B]">Phiếu khám không có đơn thuốc.</p>
              )}
            </section>
          </div>
        ) : null}
      </AdminAsyncState>
    </div>
  );
};

export default ExaminationDetailPage;
