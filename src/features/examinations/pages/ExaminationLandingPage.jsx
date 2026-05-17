import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import StudentPickerModal from '../components/StudentPickerModal';
import { EXAMINATION_PAGE_SIZE } from '../constants/examinationConstants';
import { getExaminations } from '../services/getExaminations';
import { adaptExaminationListResponse } from '../adapters/examinationAdapter';

const defaultFilters = {
  localKeyword: '',
  fromDate: '',
  toDate: '',
};

const defaultListData = {
  rows: [],
  page: 1,
  pageSize: EXAMINATION_PAGE_SIZE,
  totalItems: 0,
  totalPages: 0,
};

const normalizeFiltersForApply = (filters) => ({
  localKeyword: String(filters.localKeyword || '').trim(),
  fromDate: filters.fromDate || '',
  toDate: filters.toDate || '',
});

const ExaminationLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [listData, setListData] = useState(defaultListData);

  const [feedback, setFeedback] = useState(() => location.state?.feedback || null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialStudentId, setPickerInitialStudentId] = useState(null);
  const [pickerInitialStudentName, setPickerInitialStudentName] = useState('');

  const fetchList = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setStatus('loading');
    setError('');

    try {
      const response = await getExaminations({
        page: nextPage,
        pageSize: EXAMINATION_PAGE_SIZE,
        fromDate: nextFilters.fromDate,
        toDate: nextFilters.toDate,
      });

      const mapped = adaptExaminationListResponse(response);
      setListData(mapped);
      setStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (apiError) {
      setListData(defaultListData);
      setStatus('error');
      setError(normalizeApiMessage(apiError));
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchList(page, appliedFilters);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [appliedFilters, fetchList, page]);

  useEffect(() => {
    const state = location.state;
    if (!state) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (state.openCreateExamination) {
        setPickerOpen(true);
        const initialId = Number(state.studentUserId ?? state.studentId);
        setPickerInitialStudentId(Number.isFinite(initialId) && initialId > 0 ? initialId : null);
        setPickerInitialStudentName(state.studentName || '');
      }
    }, 0);

    if (state.feedback || state.openCreateExamination) {
      navigate(location.pathname, { replace: true, state: null });
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname, location.state, navigate]);

  const displayedRows = useMemo(() => {
    const keyword = String(appliedFilters.localKeyword || '').trim().toLowerCase();
    if (!keyword) {
      return listData.rows;
    }

    return listData.rows.filter((row) => {
      const searchable = [
        row.id,
        row.studentName,
        row.studentCode,
        row.studentRecordId,
        row.className,
        row.diseaseTypeName,
        row.diagnosis,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [appliedFilters.localKeyword, listData.rows]);

  const effectiveStatus = status === 'success' && !displayedRows.length ? 'empty' : status;

  const columns = useMemo(() => ([
    {
      key: 'visitDate',
      header: 'Ngày khám',
      headerClassName: 'w-[14%] min-w-[120px]',
      cellClassName: 'text-xs font-semibold text-on-surface',
      render: (row) => (
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
          <span className="leading-5 text-on-surface">{row.visitDateLabel || 'Chưa xác định'}</span>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Học sinh',
      headerClassName: 'w-[22%] min-w-[200px]',
      render: (row) => (
        <div className="w-full text-left">
          <p className="truncate text-sm font-bold text-on-surface transition group-hover:text-primary">
            {row.studentName || 'Chưa xác định'}
          </p>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Lớp',
      headerClassName: 'w-[12%] min-w-[90px]',
      cellClassName: 'text-xs font-semibold text-on-surface',
      render: (row) => row.className || 'Chưa xác định',
    },
    {
      key: 'diseaseType',
      header: 'Loại bệnh',
      headerClassName: 'w-[16%] min-w-[130px]',
      render: (row) => (
        <div className="w-full">
          {row.diseaseTypeName ? (
            <StatusBadge tone="info">{row.diseaseTypeName}</StatusBadge>
          ) : (
            <p className="text-xs text-on-surface-variant">Chưa phân loại</p>
          )}
        </div>
      ),
    },
    {
      key: 'diagnosis',
      header: 'Chẩn đoán / Nội dung khám',
      headerClassName: 'w-[26%] min-w-[220px]',
      render: (row) => (
        <div className="w-full">
          <p className="truncate text-xs font-bold text-on-surface">
            {row.diagnosis || 'Chưa có chẩn đoán'}
          </p>
          {row.symptoms && row.symptoms.trim() && row.symptoms.trim() !== row.diagnosis.trim() ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-on-surface-variant" title={row.symptoms}>
              {row.symptoms}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'hasPrescription',
      header: 'Đơn thuốc',
      headerClassName: 'w-[10%] min-w-[110px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <StatusBadge tone={row.hasPrescription ? 'success' : 'neutral'}>
          {row.hasPrescription ? 'Có đơn' : 'Không đơn'}
        </StatusBadge>
      ),
    },
  ]), []);

  return (
    <div className="space-y-5 text-on-surface">
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

      <NurseModulePageHeader
        title="Khám bệnh học đường"
        description="Theo dõi các lần khám gần đây, tra cứu nhanh và tạo phiếu khám mới theo từng học sinh."
        actions={(
          <button
            type="button"
            onClick={() => {
              setPickerInitialStudentId(null);
              setPickerInitialStudentName('');
              setPickerOpen(true);
            }}
            className="app-btn-primary app-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo phiếu khám mới
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <section className="app-panel-shell px-4 py-3 sm:px-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                const normalizedFilters = normalizeFiltersForApply(filters);
                setFilters(normalizedFilters);
                setAppliedFilters(normalizedFilters);
                setPage(1);
              }}
              className="flex flex-col gap-2.5 xl:flex-row xl:flex-nowrap xl:items-end"
            >
              <label className="relative min-w-0 flex-1 xl:max-w-[360px]">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-muted/80">search</span>
                <input
                  type="search"
                  value={filters.localKeyword}
                  onChange={(event) => setFilters((prev) => ({ ...prev, localKeyword: event.target.value }))}
                  placeholder="Tìm theo học sinh, lớp, chẩn đoán"
                  className="app-focus-ring app-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
                />
              </label>

              <label className="flex w-full flex-col gap-1 xl:w-[154px] xl:shrink-0">
                <span className="text-[11px] font-semibold text-on-surface-variant">Từ ngày</span>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
                  className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm"
                />
              </label>

              <label className="flex w-full flex-col gap-1 xl:w-[154px] xl:shrink-0">
                <span className="text-[11px] font-semibold text-on-surface-variant">Đến ngày</span>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
                  className="app-focus-ring app-input h-10 w-full rounded-lg px-2.5 text-sm"
                />
              </label>

              <div className="flex shrink-0 flex-wrap items-center gap-2 xl:ml-auto xl:flex-nowrap">
                <button
                  type="submit"
                  className="app-focus-ring app-btn-primary inline-flex h-9 min-w-[72px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
                >
                  Lọc
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ ...defaultFilters });
                    setAppliedFilters({ ...defaultFilters });
                    setPage(1);
                  }}
                  className="app-focus-ring app-btn-secondary inline-flex h-9 min-w-[84px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
                >
                  Đặt lại
                </button>
              </div>
            </form>
          </section>
        )}
        summary={listData.totalItems > 0 ? `Hiển thị ${listData.pageSize} bản ghi/trang • Tổng ${listData.totalItems} phiếu khám` : null}
        status={effectiveStatus}
        error={error}
        onRetry={() => fetchList(page, appliedFilters)}
        loadingLabel="Đang tải danh sách phiếu khám..."
        emptyTitle="Không có phiếu khám phù hợp"
        emptyDescription="Hãy thử thay đổi từ khóa hoặc các bộ lọc để xem kết quả khác."
        sectionClassName="space-y-3"
        table={displayedRows.length ? (
          <DataTable
            dense
            columns={columns}
            rows={displayedRows}
            getRowKey={(row) => row.id}
            onRowClick={(row) => navigate(`/nurse/examinations/${row.id}`)}
            headClassName="app-table-head bg-success-soft text-[11px] uppercase tracking-[0.08em] text-success"
            bodyClassName="divide-y divide-outline-variant"
            rowClassName="group app-interactive cursor-pointer border-l-4 border-transparent bg-surface even:bg-surface-container-lowest hover:bg-success-soft focus-visible:border-success"
            tableClassName="min-w-[760px] w-full text-left text-sm"
          />
        ) : (
          <div className="px-4 py-5 sm:px-5">
            <EmptyState
              title="Không có phiếu khám phù hợp"
              description="Thử điều chỉnh từ khóa tìm kiếm hoặc khoảng thời gian."
            />
          </div>
        )}
        pagination={{
          page: listData.page,
          pageSize: listData.pageSize,
          totalItems: listData.totalItems,
          onPageChange: (nextPage) => setPage(nextPage),
        }}
      />

      <StudentPickerModal
        open={pickerOpen}
        initialSelectedStudentId={pickerInitialStudentId}
        initialSelectedStudentName={pickerInitialStudentName}
        onClose={() => setPickerOpen(false)}
        onViewProfile={(studentUserId) => {
          if (studentUserId) {
            navigate(`/nurse/health-profiles/${studentUserId}`);
          }
        }}
        onContinue={(selectedStudent) => {
          setPickerOpen(false);
          navigate(`/nurse/students/${selectedStudent.userId}/examinations/create`, {
            state: {
              selectedStudentName: selectedStudent.fullName,
              source: 'examination-landing',
            },
          });
        }}
      />
    </div>
  );
};

export default ExaminationLandingPage;
