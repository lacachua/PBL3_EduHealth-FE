import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

const filterOptions = [
  { id: 'all', label: 'Tất cả' },
  { id: 'completed', label: 'Đã tiêm' },
  { id: 'upcoming', label: 'Sắp tới' },
  { id: 'pending', label: 'Chờ cập nhật' },
];

const statusClassMap = {
  completed: {
    chip: 'border-success/35 bg-success-soft text-success',
    card: 'app-tone-success app-tone-surface',
    icon: 'task_alt',
  },
  upcoming: {
    chip: 'border-warning/35 bg-warning-soft text-warning',
    card: 'app-tone-warning app-tone-surface',
    icon: 'event_upcoming',
  },
  pending: {
    chip: 'border-info/35 bg-info-soft text-info',
    card: 'app-tone-info app-tone-surface',
    icon: 'update',
  },
};

const summaryVisuals = [
  {
    icon: 'format_list_bulleted',
    cardClassName: 'app-tone-primary app-tone-surface',
    textClassName: 'text-primary',
    label: 'Tổng số mũi',
  },
  {
    icon: 'task_alt',
    cardClassName: 'app-tone-success app-tone-surface',
    textClassName: 'text-success',
    label: 'Đã tiêm',
  },
  {
    icon: 'event_upcoming',
    cardClassName: 'app-tone-warning app-tone-surface',
    textClassName: 'text-warning',
    label: 'Sắp tới',
  },
  {
    icon: 'update',
    cardClassName: 'app-tone-info app-tone-surface',
    textClassName: 'text-info',
    label: 'Chờ cập nhật',
  },
];

const DRAWER_ANIMATION_MS = 220;

const toReadableText = (value, fallback) => {
  const normalized = String(value || '').trim();
  return normalized || fallback;
};

const statusUpdateCopy = {
  completed: 'Bản ghi đã được xác nhận hoàn tất mũi tiêm.',
  upcoming: 'Lịch tiêm đã được lên kế hoạch và đang chờ đến ngày thực hiện.',
  pending: 'Phòng y tế đang chờ bổ sung hoặc xác nhận kết quả tiêm.',
};

const getShortReminder = (record) => {
  if (!record) {
    return '';
  }

  if (record.status === 'upcoming') {
    return toReadableText(record.note, 'Theo dõi thông báo nhắc lịch trước ngày tiêm.');
  }

  if (record.status === 'pending') {
    return toReadableText(record.note, 'Nhà trường sẽ cập nhật ngay khi có thông tin mới.');
  }

  return '';
};

const StudentVaccinationsPage = () => {
  const [vaccinationData, setVaccinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeRecordId, setActiveRecordId] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const loadVaccinations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentPortalService.getVaccinationsViewModel();
      const nextData = response.data;
      setVaccinationData(nextData);

      setActiveRecordId((prev) => {
        if (!prev) {
          return '';
        }

        return nextData.records?.some((item) => item.id === prev) ? prev : '';
      });
    } catch (apiError) {
      setError(apiError?.message || 'Không thể tải dữ liệu tiêm chủng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVaccinations();
  }, [loadVaccinations]);

  const allRecords = useMemo(() => vaccinationData?.records || [], [vaccinationData?.records]);

  const filteredRecords = useMemo(() => {
    if (activeFilter === 'all') {
      return allRecords;
    }

    return allRecords.filter((item) => item.status === activeFilter);
  }, [activeFilter, allRecords]);

  const activeRecord = useMemo(() => {
    if (!activeRecordId) {
      return null;
    }

    return allRecords.find((item) => item.id === activeRecordId) || null;
  }, [activeRecordId, allRecords]);

  const openDrawer = (recordId) => {
    setActiveRecordId(recordId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const handleEscClose = (event) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleEscClose);
    return () => {
      window.removeEventListener('keydown', handleEscClose);
    };
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (drawerRef.current?.contains(event.target)) {
        return;
      }

      closeDrawer();
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDrawerOpen, closeDrawer]);

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

  if (loading && !vaccinationData) {
    return <StudentLoadingState label="Đang tải lịch sử tiêm chủng..." />;
  }

  if (error && !vaccinationData) {
    return <StudentErrorState message={error} onRetry={loadVaccinations} />;
  }

  if (!vaccinationData) {
    return null;
  }

  const reminderText = getShortReminder(activeRecord);

  return (
    <div className="space-y-4 text-on-surface">
      <section className="app-panel-shell rounded-3xl px-4 py-4 sm:px-5">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-on-surface">Tiêm chủng</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Theo dõi các mũi đã tiêm, lịch sắp tới và những bản ghi đang chờ cập nhật.
            </p>
          </div>

          <p className="text-xs font-medium text-on-surface-variant">
            {vaccinationData.student.fullName} • {vaccinationData.student.className}
          </p>
        </header>

        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[0].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">{summaryVisuals[0].label}</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/14 text-primary">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[0].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[0].textClassName}`}>{vaccinationData.summary.total}</p>
          </article>

          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[1].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">{summaryVisuals[1].label}</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-success/14 text-success">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[1].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[1].textClassName}`}>{vaccinationData.summary.completed}</p>
          </article>

          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[2].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warning">{summaryVisuals[2].label}</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-warning/16 text-warning">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[2].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[2].textClassName}`}>{vaccinationData.summary.upcoming}</p>
          </article>

          <article className={`rounded-2xl border px-3.5 py-3 ${summaryVisuals[3].cardClassName}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-info">{summaryVisuals[3].label}</p>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-info/14 text-info">
                <span className="material-symbols-outlined text-[16px]">{summaryVisuals[3].icon}</span>
              </span>
            </div>
            <p className={`mt-2 text-lg font-bold ${summaryVisuals[3].textClassName}`}>{vaccinationData.summary.pending}</p>
          </article>
        </div>
      </section>

      <section className="app-panel-shell rounded-3xl p-4 md:p-5">
        <div className="mb-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Danh sách mũi tiêm</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Nhấn vào từng bản ghi để xem thông tin chi tiết.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl border border-outline-variant bg-surface p-1.5">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveFilter(option.id)}
                className={`app-focus-ring app-interactive rounded-lg px-2.5 py-1.5 text-xs font-semibold ${option.id === activeFilter
                  ? 'bg-primary-soft text-primary shadow-sm'
                  : 'text-on-surface-variant'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-4 text-sm text-on-surface-variant">
            Hiện chưa có bản ghi phù hợp với bộ lọc đã chọn.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const isActive = isDrawerOpen && activeRecordId === record.id;

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => openDrawer(record.id)}
                  className={`app-focus-ring app-interactive relative w-full rounded-2xl border px-3.5 py-3 text-left ${isActive
                    ? 'student-list-item-active'
                    : `${statusClassMap[record.status]?.card || statusClassMap.pending.card}`
                    }`}
                >
                  {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary" /> : null}

                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-on-surface">{record.vaccineName}</p>
                      <p className="text-xs text-on-surface-variant">
                        {record.doseLabel} • {toReadableText(record.campaignName, 'Chiến dịch tiêm chủng')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/72 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">
                          {statusClassMap[record.status]?.icon || statusClassMap.pending.icon}
                        </span>
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClassMap[record.status]?.chip || statusClassMap.pending.chip}`}>
                        {record.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <p className="rounded-lg border border-outline-variant bg-white/72 px-2.5 py-1.5 text-on-surface-variant">
                      Ngày dự kiến: <span className="font-medium text-on-surface">{record.scheduledDate}</span>
                    </p>
                    <p className="rounded-lg border border-outline-variant bg-white/72 px-2.5 py-1.5 text-on-surface-variant">
                      Ngày hoàn tất: <span className="font-medium text-on-surface">{record.vaccinatedAt}</span>
                    </p>
                  </div>

                  {isActive ? (
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">Đang xem chi tiết</p>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {activeRecord ? (
        <div className="pointer-events-none fixed inset-0 z-40">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-on-surface/25 transition-opacity duration-200 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'
              }`}
          />

          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chi tiết mũi tiêm"
            className={`student-drawer-surface pointer-events-auto absolute inset-y-3 right-3 w-[calc(100vw-1.5rem)] max-h-[calc(100vh-1.5rem)] max-w-[560px] rounded-3xl border border-outline-variant transition-transform duration-200 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-[105%]'
              }`}
          >
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl">
              <header className="student-drawer-header relative shrink-0 border-b border-outline-variant px-4 py-3.5">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="app-focus-ring app-interactive absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface"
                  aria-label="Đóng"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="pr-10">
                  <p className="text-base font-semibold text-on-surface">{activeRecord.vaccineName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClassMap[activeRecord.status]?.chip || statusClassMap.pending.chip}`}>
                      {activeRecord.statusLabel}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {activeRecord.doseLabel} • {toReadableText(activeRecord.campaignName, 'Chiến dịch tiêm chủng')}
                    </span>
                  </div>
                </div>
              </header>

              <div className="app-scrollbar-thin min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
                <section className="space-y-2 rounded-xl border border-outline-variant/90 bg-surface-container-low/85 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-on-surface-muted">Thông tin lịch tiêm</p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-outline-variant/85 bg-white/80 px-2.5 py-2">
                      <p className="text-[11px] font-semibold text-on-surface-muted">Mũi tiêm</p>
                      <p className="mt-0.5 text-sm text-on-surface">{activeRecord.doseLabel}</p>
                    </div>
                    <div className="rounded-lg border border-outline-variant/85 bg-white/80 px-2.5 py-2">
                      <p className="text-[11px] font-semibold text-on-surface-muted">Chiến dịch</p>
                      <p className="mt-0.5 text-sm text-on-surface">{toReadableText(activeRecord.campaignName, 'Chưa cập nhật chiến dịch')}</p>
                    </div>
                    <div className="rounded-lg border border-outline-variant/85 bg-white/80 px-2.5 py-2">
                      <p className="text-[11px] font-semibold text-on-surface-muted">Ngày dự kiến</p>
                      <p className="mt-0.5 text-sm text-on-surface">{activeRecord.scheduledDate}</p>
                    </div>
                    <div className="rounded-lg border border-outline-variant/85 bg-white/80 px-2.5 py-2">
                      <p className="text-[11px] font-semibold text-on-surface-muted">Ngày hoàn tất</p>
                      <p className="mt-0.5 text-sm text-on-surface">{activeRecord.vaccinatedAt}</p>
                    </div>
                    {activeRecord.lotNumber ? (
                      <div className="rounded-lg border border-outline-variant/85 bg-white/80 px-2.5 py-2 sm:col-span-2">
                        <p className="text-[11px] font-semibold text-on-surface-muted">Số lô</p>
                        <p className="mt-0.5 text-sm text-on-surface">{activeRecord.lotNumber}</p>
                      </div>
                    ) : null}
                  </div>
                </section>

                <section className="space-y-1.5 rounded-xl border border-outline-variant/90 bg-surface-container-low/85 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-on-surface-muted">Ghi chú từ nhà trường / phòng y tế</p>
                  <p className="text-sm leading-relaxed text-on-surface">{toReadableText(activeRecord.note, 'Chưa có ghi chú thêm cho bản ghi này.')}</p>
                </section>

                <section className="space-y-1.5 rounded-xl border border-outline-variant/90 bg-surface-container-low/85 px-3.5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-on-surface-muted">Tình trạng cập nhật</p>
                  <p className="text-sm font-medium text-on-surface">{activeRecord.statusLabel}</p>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{statusUpdateCopy[activeRecord.status] || statusUpdateCopy.pending}</p>
                </section>

                {reminderText ? (
                  <section className="space-y-1.5 rounded-xl border border-warning/30 bg-warning-soft px-3.5 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-warning">Nhắc nhở ngắn</p>
                    <p className="text-sm leading-relaxed text-warning">{reminderText}</p>
                  </section>
                ) : null}
              </div>

              <footer className="shrink-0 border-t border-outline-variant bg-white/90 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-on-surface-variant">Bạn có thể đóng để quay lại danh sách mũi tiêm.</p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="app-focus-ring app-interactive rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface"
                  >
                    Đóng
                  </button>
                </div>
              </footer>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};

export default StudentVaccinationsPage;
