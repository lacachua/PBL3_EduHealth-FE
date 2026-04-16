import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

const statusToneClassMap = {
  success: 'border-success/35 bg-success-soft text-success',
  info: 'border-info/35 bg-info-soft text-info',
  muted: 'border-outline-variant bg-surface text-on-surface-variant',
};

const summaryVisuals = [
  {
    icon: 'format_list_bulleted',
    cardClassName: 'app-tone-primary app-tone-surface',
    textClassName: 'text-primary',
  },
  {
    icon: 'event_available',
    cardClassName: 'app-tone-info app-tone-surface',
    textClassName: 'text-info',
  },
  {
    icon: 'description',
    cardClassName: 'app-tone-warning app-tone-surface',
    textClassName: 'text-warning',
  },
];

const resolveTypeIcon = (typeLabel) => {
  const normalized = String(typeLabel || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalized.includes('theo doi')) {
    return 'monitor_heart';
  }

  if (normalized.includes('cham soc')) {
    return 'health_and_safety';
  }

  return 'medical_services';
};

const hasMeaningfulText = (value) => {
  const normalized = String(value || '').trim();
  return normalized && normalized !== 'Chưa cập nhật';
};

const DRAWER_ANIMATION_MS = 220;

const toReadableText = (value, fallback) => {
  const normalized = String(value || '').trim();
  if (!normalized || normalized === 'Chưa cập nhật') {
    return fallback;
  }

  return normalized;
};

const StudentCareHistoryPage = () => {
  const [careData, setCareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeRecordId, setActiveRecordId] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const loadCareHistory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentPortalService.getCareHistoryViewModel();
      const nextData = response.data;

      setCareData(nextData);
      setActiveRecordId((prev) => {
        if (!prev) {
          return '';
        }

        return nextData.timelineItems?.some((item) => item.id === prev) ? prev : '';
      });
    } catch (apiError) {
      setError(apiError?.message || 'Không thể tải lịch sử chăm sóc lúc này.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCareHistory();
  }, [loadCareHistory]);

  const activeRecord = useMemo(() => {
    if (!careData?.timelineItems?.length) {
      return null;
    }

    if (!activeRecordId) {
      return null;
    }

    return careData.timelineItems.find((item) => item.id === activeRecordId) || null;
  }, [careData?.timelineItems, activeRecordId]);

  const openDrawer = (recordId) => {
    setActiveRecordId(recordId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (!activeRecord || !isDrawerOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    const onMouseDown = (event) => {
      if (drawerRef.current?.contains(event.target)) {
        return;
      }

      closeDrawer();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [activeRecord, isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (!activeRecordId || isDrawerOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveRecordId('');
    }, DRAWER_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeRecordId, isDrawerOpen]);

  if (loading && !careData) {
    return <StudentLoadingState label="Đang tải lịch sử chăm sóc..." />;
  }

  if (error && !careData) {
    return <StudentErrorState message={error} onRetry={loadCareHistory} />;
  }

  if (!careData) {
    return null;
  }

  return (
    <div className="space-y-4 text-on-surface">
      <section className="app-panel-shell rounded-3xl px-4 py-4 sm:px-5">
        <header className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-on-surface">Lịch sử chăm sóc</h1>
            <p className="text-sm text-on-surface-variant">Theo dõi nhanh các lần chăm sóc gần đây tại trường.</p>
          </div>

          <p className="text-xs font-medium text-on-surface-variant">
            {careData.student.fullName} • {careData.student.className}
          </p>
        </header>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[0].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Tổng số lần chăm sóc</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/14 text-primary">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[0].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[0].textClassName}`}>{careData.summary.totalRecords}</p>
          </article>

          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[1].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Lần gần nhất</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-info/14 text-info">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[1].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[1].textClassName}`}>{careData.summary.latestDate}</p>
          </article>

          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[2].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Nội dung gần nhất</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-warning/16 text-warning">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[2].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-base font-semibold ${summaryVisuals[2].textClassName}`}>{careData.summary.latestTitle}</p>
          </article>
        </div>
      </section>

      <section className="app-panel-shell rounded-3xl p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-on-surface">Danh sách lần chăm sóc</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary-soft/75 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <span className="material-symbols-outlined text-[14px]">timeline</span>
            <span>Nhấn để xem chi tiết</span>
          </span>
        </div>

        <div className="space-y-3">
          {careData.timelineItems.map((item) => {
            const toneClass = statusToneClassMap[item.statusTone] || statusToneClassMap.muted;
            const isActive = activeRecordId === item.id && isDrawerOpen;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openDrawer(item.id)}
                className={`app-focus-ring app-interactive relative w-full rounded-2xl border p-3.5 text-left ${
                  isActive
                    ? 'student-list-item-active'
                    : 'border-outline-variant bg-surface hover:bg-surface-container-low'
                }`}
              >
                {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary" /> : null}

                <div className="flex flex-wrap items-center justify-between gap-2 pl-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <span className="material-symbols-outlined text-[16px]">{resolveTypeIcon(item.typeLabel)}</span>
                    </span>
                    <p className="truncate text-sm font-semibold text-on-surface">{item.title}</p>
                  </div>

                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneClass}`}>
                    {item.statusLabel}
                  </span>
                </div>

                <p className="mt-1.5 pl-1 text-sm text-on-surface-variant">{item.summary}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 pl-1 text-xs text-on-surface-variant">
                  <span className="rounded-full border border-outline-variant bg-surface/75 px-2 py-0.5">{item.dateLabel}</span>
                  <span>•</span>
                  <span>{item.typeLabel}</span>
                  <span>•</span>
                  <span>{item.staffName}</span>
                  {hasMeaningfulText(item.visitId) ? (
                    <>
                      <span>•</span>
                      <span>{item.visitId}</span>
                    </>
                  ) : null}
                </div>

                {isActive ? (
                  <p className="mt-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">Đang xem chi tiết</p>
                ) : null}
              </button>
            );
          })}

          {!careData.timelineItems.length ? (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-4 py-8 text-center text-sm text-on-surface-variant">
              Chưa có bản ghi chăm sóc.
            </div>
          ) : null}
        </div>
      </section>

      {activeRecord ? (
        <div className="pointer-events-none fixed inset-0 z-40">
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-scrim/42 backdrop-blur-[1px] transition-opacity duration-200 ${
              isDrawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chi tiết lần chăm sóc"
            className={`student-drawer-surface pointer-events-auto absolute inset-y-3 right-3 w-[calc(100vw-1.5rem)] max-w-[560px] rounded-3xl border border-outline-variant transition-transform duration-200 ease-out ${
              isDrawerOpen ? 'translate-x-0' : 'translate-x-[105%]'
            }`}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-3xl">
              <header className="student-drawer-header relative border-b border-outline-variant px-4 py-3.5">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="app-focus-ring app-interactive absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface"
                  aria-label="Đóng"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="pr-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Phiếu chăm sóc</p>
                  <h3 className="mt-1 text-base font-semibold text-on-surface">{activeRecord.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-outline-variant bg-surface/80 px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
                      {activeRecord.detailType || activeRecord.typeLabel}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        statusToneClassMap[activeRecord.statusTone] || statusToneClassMap.muted
                      }`}
                    >
                      {activeRecord.statusLabel}
                    </span>
                  </div>
                </div>
              </header>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3.5">
                <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Thời gian</p>
                    <p className="mt-1 text-sm text-on-surface">{activeRecord.dateLabel}</p>
                  </div>

                  <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Nhân viên phụ trách</p>
                    <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.staffName, 'Chưa cập nhật nhân sự phụ trách.')}</p>
                  </div>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Loại theo dõi/chăm sóc</p>
                  <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.detailType || activeRecord.typeLabel, 'Theo dõi tại trường.')}</p>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Triệu chứng ghi nhận</p>
                  <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.symptoms, 'Không ghi nhận triệu chứng đặc biệt.')}</p>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Đánh giá ban đầu</p>
                  <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.diagnosis, 'Tình trạng ổn định, tiếp tục theo dõi.')}</p>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Hướng xử lý</p>
                  <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.treatment, 'Theo dõi thêm theo hướng dẫn của phòng y tế.')}</p>
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Hỗ trợ thuốc</p>
                  {Array.isArray(activeRecord.prescriptions) && activeRecord.prescriptions.length ? (
                    <ul className="mt-1.5 space-y-1.5">
                      {activeRecord.prescriptions.map((prescription) => (
                        <li key={prescription.id} className="rounded-lg border border-outline-variant bg-surface px-2.5 py-2 text-sm text-on-surface">
                          <p className="font-semibold">{prescription.medicineName}</p>
                          <p className="mt-0.5 text-xs text-on-surface-variant">
                            {toReadableText(
                              [prescription.dosage, prescription.instruction].filter(Boolean).join(' • '),
                              'Dùng theo hướng dẫn của nhân viên y tế.',
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-on-surface">
                      {toReadableText(activeRecord.prescriptionsSummary, 'Không phát sinh hỗ trợ thuốc trong lần theo dõi này.')}
                    </p>
                  )}
                </section>

                <section className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Ghi chú</p>
                  <p className="mt-1 text-sm text-on-surface">{toReadableText(activeRecord.note, 'Không có ghi chú thêm.')}</p>
                </section>

                <section className="rounded-xl border border-success/30 bg-success-soft px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Dặn dò ngắn</p>
                  <p className="mt-1 text-sm text-success">{toReadableText(activeRecord.advice, 'Tiếp tục sinh hoạt bình thường và theo dõi thêm tại nhà.')}</p>
                </section>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};

export default StudentCareHistoryPage;