import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import Pagination from '../../../shared/components/admin/Pagination';
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
import { PENDING_FILTER_DEFAULTS } from '../schemas/vaccinationSchema';
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
      setHistoryError('Không thể đối chiếu mã học sinh nội bộ để tải lịch sử tiêm. Vui lòng mở hồ sơ học sinh để kiểm tra dữ liệu đồng bộ.');
      return;
    }

    setHistoryStatus('loading');

    try {
      const response = await getStudentVaccinationHistoryApi(studentUserId);
      const mapped = mapStudentVaccinationHistoryEnvelope(response);
      setHistoryRows(mapped);
      setHistoryStatus(mapped.length ? 'success' : 'empty');
    } catch (apiError) {
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
    <div className="space-y-3">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-[#86EFAC] bg-[#DCFCE7] text-[#166534]"
        classMap={{
          error: 'border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]',
          success: 'border-[#86EFAC] bg-[#DCFCE7] text-[#166534]',
        }}
      />

      <NurseModulePageHeader
        title="Theo dõi học sinh chưa hoàn thành tiêm"
        description="Danh sách học sinh còn chờ tiêm, tạm hoãn, chống chỉ định hoặc vắng mặt."
        actions={(
          <button
            type="button"
            onClick={() => navigate('/nurse/vaccinations')}
            className="nurse-btn-secondary nurse-focus-ring inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại đợt tiêm
          </button>
        )}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Tổng bản ghi</p>
            <p className="text-lg font-bold text-[#0F172A]">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Đang hiển thị</p>
            <p className="text-lg font-bold text-[#0F172A]">{summary.filtered}</p>
          </div>
          <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B45309]">Chờ tiêm</p>
            <p className="text-lg font-bold text-[#B45309]">{summary.pending}</p>
          </div>
          <div className="rounded-xl border border-[#FFEDD5] bg-[#FFF7ED] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C2410C]">Tạm hoãn</p>
            <p className="text-lg font-bold text-[#C2410C]">{summary.postponed}</p>
          </div>
          <div className="rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B91C1C]">Chống chỉ định/Vắng</p>
            <p className="text-lg font-bold text-[#B91C1C]">{summary.contraindicated + summary.absent}</p>
          </div>
        </div>
      </NurseModulePageHeader>

      {forbidden ? (
        <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          Bạn không có quyền truy cập trang này.
        </section>
      ) : null}

      {!forbidden ? (
        <section className="space-y-3 rounded-2xl border border-[#D7ECDD] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:p-5">
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

          <VaccinationStudentsTable
            rows={filteredRows}
            loading={status === 'loading'}
            error={status === 'error' ? error : ''}
            emptyMessage="Không có bản ghi chưa hoàn thành theo bộ lọc hiện tại."
            onRetry={() => fetchPending(page, appliedFilters)}
            onOpenHistory={openHistoryDrawer}
            onOpenUpdate={openUpdateModal}
            onOpenCampaign={(item) => navigate(`/nurse/vaccinations/${item.campaignId}`)}
            showCampaignColumn
            showResultColumns={false}
            showScheduledDateColumn
          />

          {(status === 'success' || status === 'empty') && pendingData.totalPages > 1 ? (
            <Pagination
              page={pendingData.page}
              pageSize={pendingData.pageSize}
              totalItems={pendingData.totalItems}
              onPageChange={(nextPage) => setPage(nextPage)}
            />
          ) : null}
        </section>
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
