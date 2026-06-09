import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import {
  mapPendingVaccinationsEnvelope,
  mapStudentVaccinationHistoryEnvelope,
  mapUpdateStudentVaccinationResponse,
} from '../adapters/vaccinationResponseMapper';
import StudentVaccinationHistoryDrawer from '../components/StudentVaccinationHistoryDrawer';
import UpdateStudentVaccinationModal from '../components/UpdateStudentVaccinationModal';
import VaccinationStudentsTable from '../components/VaccinationStudentsTable';
import VaccinationStudentsToolbar from '../components/VaccinationStudentsToolbar';
import { PENDING_FILTER_DEFAULTS } from '../constants/vaccinationConstants';
import {
  getPendingVaccinationsApi,
  getStudentVaccinationHistoryApi,
  updateStudentVaccinationApi,
} from '../services/nurseVaccinationsApi';
import { PENDING_TAB_STATUS_FILTER_OPTIONS } from '../constants/vaccinationConstants';
import { resolveVaccinationStudentUserId } from '../services/studentUserIdResolver';

const EMPTY_PAGED_LIST = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

const NursePendingVaccinationsPage = () => {
  const navigate = useNavigate();

  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const [draftFilters, setDraftFilters] = useState(PENDING_FILTER_DEFAULTS);
  const [appliedFilters, setAppliedFilters] = useState(PENDING_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [pendingData, setPendingData] = useState(EMPTY_PAGED_LIST);

  const [updateContext, setUpdateContext] = useState(null);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyStatus, setHistoryStatus] = useState('idle');
  const [historyError, setHistoryError] = useState('');
  const [historyRows, setHistoryRows] = useState([]);
  const [historyStudentLabel, setHistoryStudentLabel] = useState('');

  const resolveApiError = useCallback((apiError) => {
    const statusCode = Number(apiError?.response?.status || 0);
    if (statusCode === 401) {
      setUnauthorized(true);
    }

    if (statusCode === 403) {
      setForbidden(true);
    }

    return normalizeApiMessage(apiError);
  }, []);

  const fetchPending = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setStatus('loading');
    setError('');

    try {
      const response = await getPendingVaccinationsApi({
        page: nextPage,
        campaignId: nextFilters.campaignId,
        classId: nextFilters.classId,
      });

      const mapped = mapPendingVaccinationsEnvelope(response);
      setPendingData(mapped);
      setStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (apiError) {
      setPendingData(EMPTY_PAGED_LIST);
      setStatus('error');
      setError(resolveApiError(apiError));
    }
  }, [appliedFilters, page, resolveApiError]);

  useEffect(() => {
    fetchPending(page, appliedFilters);
  }, [appliedFilters, fetchPending, page]);

  const filteredRows = useMemo(() => {
    const keyword = String(appliedFilters.keyword || '').trim().toLowerCase();
    const selectedStatus = String(appliedFilters.status || 'all').toUpperCase();

    return pendingData.rows.filter((item) => {
      if (selectedStatus !== 'ALL' && selectedStatus !== 'all' && selectedStatus && selectedStatus !== item.status) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchable = `${item.student?.studentCode || ''} ${item.student?.fullName || ''}`.toLowerCase();
      return searchable.includes(keyword);
    });
  }, [appliedFilters.keyword, appliedFilters.status, pendingData.rows]);

  const summary = useMemo(() => {
    const counts = filteredRows.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: pendingData.totalItems || pendingData.rows.length,
      filtered: filteredRows.length,
      pending: counts.PENDING || 0,
      postponed: counts.POSTPONED || 0,
      contraindicated: counts.CONTRAINDICATED || 0,
      absent: counts.ABSENT || 0,
    };
  }, [filteredRows, pendingData.rows.length, pendingData.totalItems]);

  const openUpdateModal = (row) => {
    if (row?.status === 'DONE') {
      return;
    }

    setUpdateError('');

    setUpdateContext({
      ...row,
      vaccineName: '--',
    });
  };

  const openHistoryDrawer = async (row) => {
    const studentUserId = await resolveVaccinationStudentUserId(row.student);

    setHistoryOpen(true);
    setHistoryRows([]);
    setHistoryError('');
    setHistoryStudentLabel(row.student?.fullName || row.student?.studentCode || 'Học sinh');

    if (!studentUserId) {
      setHistoryStatus('error');
      setHistoryError('Không đủ dữ liệu định danh an toàn để mở lịch sử tiêm. Vui lòng kiểm tra lại hồ sơ học sinh trước khi tra cứu.');
      return;
    }

    setHistoryStatus('loading');

    try {
      const response = await getStudentVaccinationHistoryApi(studentUserId);
      const mapped = mapStudentVaccinationHistoryEnvelope(response);
      setHistoryRows(mapped);
      setHistoryStatus(mapped.length ? 'success' : 'empty');
    } catch (apiError) {
      const statusCode = Number(apiError?.response?.status || 0);
      if (statusCode === 404) {
        setHistoryRows([]);
        setHistoryError('');
        setHistoryStatus('empty');
        return;
      }

      setHistoryStatus('error');
      setHistoryError(resolveApiError(apiError));
    }
  };

  const handleUpdateStudentVaccination = async (values) => {
    if (!updateContext?.studentVaccinationId) {
      return;
    }

    setUpdateSubmitting(true);
    setUpdateError('');

    try {
      const response = await updateStudentVaccinationApi(updateContext.studentVaccinationId, values);
      mapUpdateStudentVaccinationResponse(response);

      setUpdateContext(null);
      setFeedback({
        type: 'success',
        message: response?.message || 'Cập nhật trạng thái tiêm thành công.',
      });

      await fetchPending(page, appliedFilters);
    } catch (apiError) {
      setUpdateError(resolveApiError(apiError));
    } finally {
      setUpdateSubmitting(false);
    }
  };

  if (unauthorized) {
    return <Navigate to="/login" replace />;
  }

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
        title="Theo dõi học sinh chưa hoàn thành tiêm"
        description="Danh sách học sinh còn chờ tiêm, tạm hoãn, chống chỉ định hoặc vắng mặt."
        actions={(
          <button
            type="button"
            onClick={() => navigate('/nurse/vaccinations')}
            className="app-btn-secondary app-focus-ring inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại đợt tiêm
          </button>
        )}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <div className="app-kpi-card">
            <p className="app-kpi-label">Tổng bản ghi</p>
            <p className="app-kpi-value text-lg">{summary.total}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Đang hiển thị</p>
            <p className="app-kpi-value text-lg">{summary.filtered}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Chờ tiêm</p>
            <p className="app-kpi-value text-lg text-warning">{summary.pending}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Tạm hoãn</p>
            <p className="app-kpi-value text-lg text-warning">{summary.postponed}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Chống chỉ định/Vắng</p>
            <p className="app-kpi-value text-lg text-danger">{summary.contraindicated + summary.absent}</p>
          </div>
        </div>
      </NurseModulePageHeader>

      {forbidden ? (
        <section className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          Bạn không có quyền truy cập trang này.
        </section>
      ) : null}

      {!forbidden ? (
      <AdminManagementListSection
        filters={(
          <VaccinationStudentsToolbar
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={() => {
              setAppliedFilters(draftFilters);
              setPage(1);
            }}
            onReset={() => {
              setDraftFilters(PENDING_FILTER_DEFAULTS);
              setAppliedFilters(PENDING_FILTER_DEFAULTS);
              setPage(1);
            }}
            statusOptions={PENDING_TAB_STATUS_FILTER_OPTIONS}
            showClassFilter
            showCampaignFilter
          />
        )}
        summary={filteredRows.length > 0 ? `Hiển thị ${filteredRows.length} bản ghi/trang • Tổng ${pendingData.totalItems} học sinh chưa hoàn thành` : null}
        status={forbidden ? 'idle' : status}
        error={error}
        onRetry={() => fetchPending(page, appliedFilters)}
        loadingLabel="Đang tải danh sách chưa hoàn thành..."
        emptyTitle="Không có học sinh chưa hoàn thành"
        emptyDescription="Danh sách sẽ hiển thị sau khi các đợt tiêm được triển khai và có kết quả cập nhật."
        sectionClassName="app-panel-shell space-y-3 p-4 md:p-5"
        table={!forbidden ? (
          <VaccinationStudentsTable
            rows={filteredRows}
            emptyMessage="Không có bản ghi chưa hoàn thành theo bộ lọc hiện tại."
            onOpenHistory={openHistoryDrawer}
            onOpenUpdate={openUpdateModal}
            onOpenCampaign={(item) => navigate(`/nurse/vaccinations/${item.campaignId}`)}
            showCampaignColumn
            showResultColumns={false}
            showScheduledDateColumn
          />
        ) : null}
        pagination={!forbidden ? {
          page: pendingData.page,
          pageSize: pendingData.pageSize,
          totalItems: pendingData.totalItems,
          onPageChange: (nextPage) => setPage(nextPage),
        } : null}
      />
      ) : null}

      {updateContext ? (
        <UpdateStudentVaccinationModal
          key={updateContext.studentVaccinationId}
          open={Boolean(updateContext)}
          context={updateContext}
          submitting={updateSubmitting}
          submitError={updateError}
          onClose={() => {
            if (updateSubmitting) {
              return;
            }
            setUpdateContext(null);
          }}
          onSubmit={handleUpdateStudentVaccination}
        />
      ) : null}

      <StudentVaccinationHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        studentLabel={historyStudentLabel}
        status={historyStatus}
        error={historyError}
        rows={historyRows}
      />
    </div>
  );
};

export default NursePendingVaccinationsPage;
