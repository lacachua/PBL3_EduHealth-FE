import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import DataTable from '../../../shared/components/admin/DataTable';
import EmptyState from '../../../shared/components/admin/EmptyState';
import Pagination from '../../../shared/components/admin/Pagination';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import StudentPickerModal from '../components/StudentPickerModal';
import { EXAMINATION_PAGE_SIZE } from '../schemas/examinationsSchema';
import { getExaminations } from '../services/getExaminations';

const defaultFilters = {
  keyword: '',
  classId: '',
  diseaseTypeId: '',
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

const dateLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const parseExaminationListEnvelope = (envelope) => {
  const rows = Array.isArray(envelope?.data)
    ? envelope.data
    : Array.isArray(envelope?.data?.items)
      ? envelope.data.items
      : [];

  return {
    rows: rows.map((item) => ({
      id: item.id,
      visitDate: item.visitDate,
      studentName: item.student?.fullName || '--',
      studentCode: item.student?.studentCode || '--',
      studentRecordId: item.student?.studentId || '--',
      className: item.student?.className || '--',
      diseaseTypeName: item.diseaseType?.name || '--',
      diagnosis: item.diagnosis || '--',
      hasPrescription: Boolean(item.hasPrescription),
    })),
    page: Number(envelope?.meta?.page || 1),
    pageSize: Number(envelope?.meta?.pageSize || EXAMINATION_PAGE_SIZE),
    totalItems: Number(envelope?.meta?.totalItems || rows.length),
    totalPages: Number(envelope?.meta?.totalPages || 0),
  };
};

const toApiStudentIdFromKeyword = (keyword) => {
  const normalized = String(keyword || '').trim().toUpperCase();
  return /^STD\d+$/i.test(normalized) ? normalized : '';
};

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

  const appliedFilterCount = useMemo(() => (
    Object.values(appliedFilters).filter((value) => String(value || '').trim()).length
  ), [appliedFilters]);

  const fetchList = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setStatus('loading');
    setError('');

    try {
      const apiStudentId = toApiStudentIdFromKeyword(nextFilters.keyword);

      const response = await getExaminations({
        page: nextPage,
        pageSize: EXAMINATION_PAGE_SIZE,
        studentId: apiStudentId || undefined,
        classId: nextFilters.classId,
        diseaseTypeId: nextFilters.diseaseTypeId,
        fromDate: nextFilters.fromDate,
        toDate: nextFilters.toDate,
      });

      const mapped = parseExaminationListEnvelope(response);
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
    const keyword = String(appliedFilters.keyword || '').trim().toLowerCase();
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
  }, [appliedFilters.keyword, listData.rows]);

  const effectiveStatus = status === 'success' && !displayedRows.length ? 'empty' : status;

  const stats = useMemo(() => {
    const withPrescription = displayedRows.filter((row) => row.hasPrescription).length;
    const withDiseaseGroup = displayedRows.filter((row) => row.diseaseTypeName !== '--').length;
    const withoutPrescription = Math.max(displayedRows.length - withPrescription, 0);

    return {
      total: listData.totalItems,
      withPrescription,
      withoutPrescription,
      withDiseaseGroup,
    };
  }, [displayedRows, listData.totalItems]);

  const columns = useMemo(() => ([
    {
      key: 'id',
      header: 'Mã phiếu',
      headerClassName: 'w-[128px]',
      cellClassName: 'whitespace-nowrap text-[12px] font-semibold text-[#0B6F3C]',
    },
    {
      key: 'visitDate',
      header: 'Ngày khám',
      headerClassName: 'w-[120px]',
      cellClassName: 'whitespace-nowrap text-[12px] text-[#5F746B]',
      render: (row) => dateLabel(row.visitDate),
    },
    {
      key: 'studentName',
      header: 'Học sinh',
      headerClassName: 'w-[240px]',
      render: (row) => (
        <div>
          <p className="text-[13px] font-semibold text-[#163126]">{row.studentName}</p>
          <p className="text-[11px] text-[#5F746B]">
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
      key: 'diseaseTypeName',
      header: 'Loại bệnh',
      headerClassName: 'w-[180px]',
      cellClassName: 'text-[12px] text-[#5F746B]',
    },
    {
      key: 'diagnosis',
      header: 'Chẩn đoán',
      cellClassName: 'min-w-[220px] text-[12px] text-[#163126]',
      render: (row) => <p className="line-clamp-2">{row.diagnosis}</p>,
    },
    {
      key: 'hasPrescription',
      header: 'Đơn thuốc',
      headerClassName: 'w-[156px] text-right',
      cellClassName: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.hasPrescription ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
            {row.hasPrescription ? 'Có' : 'Không'}
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#94A3B8]" aria-hidden="true">chevron_right</span>
        </div>
      ),
    },
  ]), []);

  return (
    <div className="space-y-3.5 text-[#0F172A]">
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
            className="nurse-btn-primary nurse-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo phiếu khám mới
          </button>
        )}
      />

      <section className="nurse-card-soft rounded-2xl px-4 py-3 sm:px-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedFilters(filters);
            setPage(1);
          }}
          className="space-y-2.5"
        >
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12 lg:items-end">
            <label className="relative lg:col-span-4">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#64748B]/80">search</span>
              <input
                type="search"
                value={filters.keyword}
                onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="Tìm học sinh hoặc mã phiếu"
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg pl-9 pr-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Lớp</span>
              <input
                type="text"
                value={filters.classId}
                onChange={(event) => setFilters((prev) => ({ ...prev, classId: event.target.value }))}
                placeholder="Nhập lớp"
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg px-2.5 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Nhóm bệnh</span>
              <input
                type="text"
                value={filters.diseaseTypeId}
                onChange={(event) => setFilters((prev) => ({ ...prev, diseaseTypeId: event.target.value }))}
                placeholder="Nhập nhóm bệnh"
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg px-2.5 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Từ ngày</span>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg px-2.5 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Đến ngày</span>
              <input
                type="date"
                value={filters.toDate}
                onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
                className="nurse-focus-ring nurse-input h-10 w-full rounded-lg px-2.5 text-sm"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="submit"
              className="nurse-focus-ring nurse-btn-primary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold"
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
              className="nurse-focus-ring nurse-btn-secondary inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold"
            >
              Đặt lại
            </button>
          </div>
        </form>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-1 font-semibold text-[#166534]">
            Tổng {listData.totalItems} phiếu khám
          </span>
          <span className="rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 font-medium text-[#64748B]">
            {appliedFilterCount ? `${appliedFilterCount} bộ lọc đang áp dụng` : 'Chưa áp dụng bộ lọc'}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Tổng phiếu khám</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#0F172A]">{stats.total}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Có đơn thuốc</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#166534]">{stats.withPrescription}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Không có đơn thuốc</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#B45309]">{stats.withoutPrescription}</p>
        </article>
        <article className="nurse-card-soft rounded-xl px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Có nhóm bệnh</p>
          <p className="mt-0.5 text-[1.35rem] font-extrabold text-[#B45309]">{stats.withDiseaseGroup}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
        <div className="nurse-table-summary-strong px-3 py-2 text-[11px] sm:px-4">
          Đang hiển thị <span className="font-semibold text-[#0F172A]">{displayedRows.length}</span> phiếu trên trang này • Tổng <span className="font-semibold text-[#0F172A]">{listData.totalItems}</span> phiếu khám
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
            <div className="space-y-3">
              <DataTable
                dense
                columns={columns}
                rows={displayedRows}
                getRowKey={(row) => row.id}
                onRowClick={(row) => navigate(`/nurse/examinations/${row.id}`)}
                containerClassName="overflow-x-auto"
                tableClassName="min-w-[940px] w-full divide-y divide-[#E2E8F0] text-[13px]"
                headClassName="nurse-table-head-strong text-left"
                bodyClassName="divide-y divide-[#E2E8F0] bg-white"
                rowClassName="nurse-interactive transition-[background-color] duration-150 hover:bg-[#F0FDF4] focus-within:bg-[#F0FDF4]"
              />

              {listData.totalPages > 1 ? (
                <div className="border-t border-[#E2E8F0] px-3 py-2 sm:px-4">
                  <Pagination
                    compact
                    page={listData.page}
                    pageSize={listData.pageSize}
                    totalItems={listData.totalItems}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="px-4 py-5 sm:px-5">
              <EmptyState
                title="Không có phiếu khám phù hợp"
                description="Thử điều chỉnh từ khóa, ngày khám hoặc bộ lọc lớp để xem dữ liệu khác."
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
