import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { getExaminationDetail } from '../services/getExaminationDetail';
import { adaptExaminationDetailResponse } from '../adapters/examinationAdapter';

const detailCardClass = 'rounded-lg border border-outline-variant bg-surface-container-lowest p-3';

const ExaminationDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examinationId } = useParams();
  const hasValidExaminationId = Boolean(examinationId);

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState(() => location.state?.feedback || null);

  useEffect(() => {
    if (location.state?.feedback) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!hasValidExaminationId) {
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

        const adapted = adaptExaminationDetailResponse(response);
        setData(adapted);
        setStatus(adapted ? 'success' : 'empty');
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
  }, [examinationId, hasValidExaminationId]);

  const effectiveStatus = hasValidExaminationId ? status : 'error';
  const effectiveError = hasValidExaminationId ? error : 'Mã phiếu khám không hợp lệ.';

  return (
    <div className="space-y-3.5 text-on-surface">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-success/25 bg-success-soft text-success"
        classMap={{
          error: 'border-danger/25 bg-danger-soft text-danger',
          success: 'border-success/25 bg-success-soft text-success',
        }}
      />

      {data ? (
        <section className="app-banner-soft rounded-2xl px-4 py-3.5 sm:px-5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-on-surface sm:text-[1.62rem]">
                  Phiếu khám <span className="text-on-surface-variant">{data.id}</span>
                </h1>
                {data.statusLabel && (
                  <span className="inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
                    {data.statusLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {data.student?.fullName || '--'} • Lớp {data.student?.className || '--'} • {data.visitDateLabel || '--'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/nurse/examinations')}
              className="app-btn-secondary app-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              Quay lại danh sách
            </button>
          </div>
        </section>
      ) : (
        <section className="app-banner-soft rounded-2xl px-4 py-3.5 sm:px-5 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-on-surface sm:text-[1.62rem]">
                Chi tiết phiếu khám
              </h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                Đang tải thông tin...
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/nurse/examinations')}
              className="app-btn-secondary app-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              Quay lại danh sách
            </button>
          </div>
        </section>
      )}

      <AdminAsyncState
        status={effectiveStatus}
        error={effectiveError}
        onRetry={() => navigate(0)}
        loadingLabel="Đang tải chi tiết phiếu khám..."
        emptyTitle="Không có dữ liệu"
        emptyDescription="Không tìm thấy phiếu khám tương ứng."
        containerClassName="px-0 py-0"
      >
        {data ? (
          <div className="space-y-3.5">
            <section className="app-card-shell rounded-xl p-4">
              <div className="app-section-header -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-headline text-[0.97rem] font-bold text-on-surface">Thông tin chung</h2>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant">Thông tin tổng quan về phiếu khám</p>
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Mã phiếu khám</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.id || '--'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Ngày khám</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.visitDateTimeLabel}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Học sinh</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.student?.fullName || '--'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Lớp</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.student?.className || '--'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Mã hồ sơ</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.student?.studentId || '--'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Y tá phụ trách</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.nurse?.fullName || '--'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Loại bệnh</dt>
                  <dd className="mt-1 text-sm font-medium text-on-surface">{data.diseaseType?.name || '--'}</dd>
                </div>
              </dl>
            </section>

            <section className="app-card-shell rounded-xl p-4">
              <div className="app-section-header -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-headline text-[0.97rem] font-bold text-on-surface">Nội dung khám</h2>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant">Chẩn đoán và hướng xử lý</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className={`${detailCardClass} sm:col-span-2`}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Triệu chứng</p>
                  <p className="mt-1 text-sm text-on-surface">{data.symptoms || '--'}</p>
                </div>
                <div className={detailCardClass}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Chẩn đoán</p>
                  <p className="mt-1 text-sm text-on-surface">{data.diagnosis || '--'}</p>
                </div>
                <div className={detailCardClass}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Hướng xử lý</p>
                  <p className="mt-1 text-sm text-on-surface">{data.treatment || '--'}</p>
                </div>
                <div className={`${detailCardClass} sm:col-span-2`}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Ghi chú</p>
                  <p className="mt-1 text-sm text-on-surface">{data.note || '--'}</p>
                </div>
              </div>
            </section>

            <section className="app-card-shell rounded-xl p-4">
              <div className="app-section-header -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-headline text-[0.97rem] font-bold text-on-surface">Đơn thuốc</h2>
                  <p className="mt-0.5 text-[11px] text-on-surface-variant">Danh sách thuốc được cấp phát</p>
                </div>
              </div>
              {data.hasPrescription ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.prescriptions.map((item) => (
                    <article key={item.prescriptionId} className={detailCardClass}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-on-surface">{item.medicineName}</p>
                        <span className="inline-flex items-center rounded-full bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
                          SL: {item.quantity}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Liều dùng</p>
                      <p className="text-sm text-on-surface">{item.dosage}</p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">Hướng dẫn sử dụng</p>
                      <p className="text-sm text-on-surface">{item.usageInstruction}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">Chưa có đơn thuốc được cấp phát.</p>
              )}
            </section>
          </div>
        ) : null}
      </AdminAsyncState>
    </div>
  );
};

export default ExaminationDetailPage;
