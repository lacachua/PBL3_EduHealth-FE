import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import DataTable from '../../../shared/components/admin/DataTable';
import Pagination from '../../../shared/components/admin/Pagination';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import StudentPickerModal from '../components/StudentPickerModal';
import { EXAMINATION_PAGE_SIZE } from '../schemas/examinationsSchema';
import { getExaminations } from '../services/getExaminations';
import '../styles/examinationUi.css';

const defaultFilters = {
  studentId: '',
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
      studentId: item.student?.studentId || '--',
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
      const response = await getExaminations({
        page: nextPage,
        pageSize: EXAMINATION_PAGE_SIZE,
        studentId: nextFilters.studentId,
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
        const initialId = Number(state.studentId);
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
          <p className="text-[11px] text-[#5F746B]">{row.studentId} • Lớp {row.className}</p>
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
    },
    {
      key: 'hasPrescription',
      header: 'Đơn thuốc',
      headerClassName: 'w-[110px] text-center',
      cellClassName: 'whitespace-nowrap text-center',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.hasPrescription ? 'bg-[#E8F6EE] text-[#0B6F3C]' : 'bg-[#F8FAF9] text-[#5F746B]'}`}>
          {row.hasPrescription ? 'Có' : 'Không'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'w-[112px] text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              navigate(`/nurse/examinations/${row.id}`);
            }}
            className="exam-btn-secondary nurse-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg"
            aria-label={`Xem phiếu ${row.id}`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </button>
        </div>
      ),
    },
  ]), [navigate]);

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
            <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-[#163126] sm:text-[1.62rem]">Khám bệnh học đường</h1>
            <p className="exam-muted mt-1 text-sm">Theo dõi các lần khám gần đây, tra cứu nhanh và tạo phiếu khám mới theo từng học sinh.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPickerInitialStudentId(null);
              setPickerInitialStudentName('');
              setPickerOpen(true);
            }}
            className="exam-btn-primary nurse-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo phiếu khám mới
          </button>
        </div>
      </section>

      <section className="exam-card rounded-xl p-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedFilters(filters);
            setPage(1);
          }}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-6"
        >
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#5F746B]">Mã học sinh</span>
            <input
              type="text"
              value={filters.studentId}
              onChange={(event) => setFilters((prev) => ({ ...prev, studentId: event.target.value }))}
              placeholder="Ví dụ: STD001"
              className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#5F746B]">Mã lớp</span>
            <input
              type="text"
              value={filters.classId}
              onChange={(event) => setFilters((prev) => ({ ...prev, classId: event.target.value }))}
              placeholder="Ví dụ: CLS001"
              className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#5F746B]">Mã nhóm bệnh</span>
            <input
              type="text"
              value={filters.diseaseTypeId}
              onChange={(event) => setFilters((prev) => ({ ...prev, diseaseTypeId: event.target.value }))}
              placeholder="Ví dụ: DIS001"
              className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#5F746B]">Từ ngày</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
              className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#5F746B]">Đến ngày</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
              className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="exam-btn-primary nurse-focus-ring h-10 rounded-lg px-3.5 text-sm font-semibold"
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
              className="exam-btn-secondary nurse-focus-ring h-10 rounded-lg px-3.5 text-sm font-semibold"
            >
              Đặt lại
            </button>
          </div>
        </form>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="exam-pill-selected rounded-full px-2.5 py-1 font-semibold">
            {listData.totalItems} phiếu khám
          </span>
          <span className="rounded-full border border-[#D9E2DE] bg-white px-2.5 py-1 font-medium text-[#5F746B]">
            {appliedFilterCount ? `${appliedFilterCount} bộ lọc đang áp dụng` : 'Chưa áp dụng bộ lọc'}
          </span>
        </div>
      </section>

      <section className="exam-card rounded-xl p-4">
        <AdminAsyncState
          status={status}
          error={error}
          onRetry={() => fetchList(page, appliedFilters)}
          loadingLabel="Đang tải danh sách phiếu khám..."
          emptyTitle="Chưa có phiếu khám"
          emptyDescription="Không có dữ liệu phù hợp với bộ lọc hiện tại."
          containerClassName="px-0 py-2"
        >
          <div className="space-y-3">
            <DataTable
              columns={columns}
              rows={listData.rows}
              getRowKey={(row) => row.id}
              containerClassName="overflow-x-auto rounded-xl border border-[#D9E2DE]"
              tableClassName="min-w-full divide-y divide-[#D9E2DE] text-sm"
              headClassName="exam-table-head text-left"
              bodyClassName="divide-y divide-[#D9E2DE] bg-white"
              rowClassName="exam-row-hover"
            />

            {listData.totalPages > 1 ? (
              <Pagination
                page={listData.page}
                pageSize={listData.pageSize}
                totalItems={listData.totalItems}
                onPageChange={(nextPage) => setPage(nextPage)}
              />
            ) : null}
          </div>
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
