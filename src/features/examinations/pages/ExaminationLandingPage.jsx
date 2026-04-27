import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import DataTable from '../../../shared/components/core/DataTable';
import EmptyState from '../../../shared/components/core/EmptyState';
import Pagination from '../../../shared/components/core/Pagination';
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
      key: 'id',
      header: 'Mã phiếu',
      headerClassName: 'w-[12%] min-w-[110px]',
      cellClassName: 'whitespace-nowrap text-[12px] font-semibold text-primary',
    },
    {
      key: 'visitDate',
      header: 'Ngày khám',
      headerClassName: 'w-[12%] min-w-[110px]',
      cellClassName: 'whitespace-nowrap text-[12px] text-on-surface-variant',
      render: (row) => row.visitDateLabel,
    },
    {
      key: 'studentName',
      header: 'Học sinh',
      headerClassName: 'w-[28%] min-w-[180px]',
      render: (row) => (
        <div>
          <p className="text-[13px] font-semibold text-on-surface">{row.studentName}</p>
          <p className="text-[11px] text-on-surface-variant">
            {row.studentCode}
            {' • '}
            Mã hồ sơ {row.studentRecordId}
            {' • '}
            Lớp {row.className}
          </p>
        </div>
      ),
    },
    {
      key: 'diagnosisMerged',
      header: 'Loại bệnh / Chẩn đoán',
      headerClassName: 'w-[36%] min-w-[200px]',
      cellClassName: 'min-w-[200px] text-[12px] text-on-surface',
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface line-clamp-1">{row.diseaseTypeName || 'Chưa xác định'}</p>
          <p className="text-on-surface-variant line-clamp-1 mt-0.5" title={row.diagnosis}>{row.diagnosis || '--'}</p>
        </div>
      ),
    },
    {
      key: 'hasPrescription',
      header: 'Đơn thuốc',
      headerClassName: 'w-[12%] min-w-[100px] text-right',
      cellClassName: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-end">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.hasPrescription ? 'bg-success-soft text-success' : 'bg-surface-container-low text-on-surface-variant'}`}>
            {row.hasPrescription ? 'Có' : 'Không'}
          </span>
        </div>
      ),
    },
  ]), []);

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
              placeholder="Tìm theo mã phiếu, học sinh, lớp, chẩn đoán"
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

      <section className="app-panel-shell space-y-3 p-4 md:p-5">
        <h2 className="text-lg font-bold text-on-surface">Danh sách phiếu khám</h2>
        <div className="app-table-summary rounded-xl px-3 py-2 text-[11px]">
          Đang hiển thị <span className="font-semibold text-on-surface">{displayedRows.length}</span> phiếu trên trang này • Tổng <span className="font-semibold text-on-surface">{listData.totalItems}</span> phiếu khám
        </div>

        <AdminAsyncState
          status={effectiveStatus}
          error={error}
          onRetry={() => fetchList(page, appliedFilters)}
          loadingLabel="Đang tải danh sách phiếu khám..."
          emptyTitle="Không có phiếu khám phù hợp"
          emptyDescription="Hãy thử thay đổi từ khóa hoặc các bộ lọc để xem kết quả khác."
          containerClassName="px-0 py-2"
        >
          {displayedRows.length ? (
            <>
              <DataTable
                dense
                columns={columns}
                rows={displayedRows}
                getRowKey={(row) => row.id}
                onRowClick={(row) => navigate(`/nurse/examinations/${row.id}`)}
                tableClassName="min-w-[760px] w-full text-left text-sm"
              />

              {listData.totalPages > 1 ? (
                <div className="pt-2">
                  <Pagination
                    page={listData.page}
                    pageSize={listData.pageSize}
                    totalItems={listData.totalItems}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-4 py-5 sm:px-5">
              <EmptyState
                title="Không có phiếu khám phù hợp"
                description="Thử điều chỉnh từ khóa tìm kiếm hoặc khoảng thời gian."
              />
            </div>
          )}
        </AdminAsyncState>
      </section>

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
