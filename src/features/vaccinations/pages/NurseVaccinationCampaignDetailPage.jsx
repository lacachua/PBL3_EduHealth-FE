import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import {
  mapCampaignDetailEnvelope,
  mapCampaignStudentsEnvelope,
  mapPendingVaccinationsEnvelope,
  mapStudentVaccinationHistoryEnvelope,
  mapUpdateStudentVaccinationResponse,
} from '../adapters/vaccinationResponseMapper';
import StudentVaccinationHistoryDrawer from '../components/StudentVaccinationHistoryDrawer';
import UpdateStudentVaccinationModal from '../components/UpdateStudentVaccinationModal';
import VaccinationCampaignSummaryStrip from '../components/VaccinationCampaignSummaryStrip';
import VaccinationStudentsTable from '../components/VaccinationStudentsTable';
import VaccinationStudentsToolbar from '../components/VaccinationStudentsToolbar';
import {
  CAMPAIGN_STUDENT_FILTER_DEFAULTS,
} from '../constants/vaccinationConstants';
import {
  getPendingVaccinationsApi,
  getStudentVaccinationHistoryApi,
  getVaccinationCampaignDetailApi,
  getVaccinationCampaignStudentsApi,
  updateStudentVaccinationApi,
} from '../services/nurseVaccinationsApi';
import {
  PENDING_TAB_STATUS_FILTER_OPTIONS,
  VACCINATION_STATUS_FILTER_OPTIONS,
} from '../constants/vaccinationConstants';
import { resolveVaccinationStudentUserId } from '../services/studentUserIdResolver';

const EMPTY_PAGED_LIST = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

const tabs = [
  { key: 'students', label: 'Danh sách học sinh' },
  { key: 'pending', label: 'Chưa hoàn thành' },
];

const NurseVaccinationCampaignDetailPage = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const [campaignStatus, setCampaignStatus] = useState('loading');
  const [campaignError, setCampaignError] = useState('');
  const [campaign, setCampaign] = useState(null);

  const [activeTab, setActiveTab] = useState('students');

  const [draftFilters, setDraftFilters] = useState(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
  const [appliedFilters, setAppliedFilters] = useState(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);

  const [studentsStatus, setStudentsStatus] = useState('loading');
  const [studentsError, setStudentsError] = useState('');
  const [studentsData, setStudentsData] = useState(EMPTY_PAGED_LIST);

  const [pendingStatus, setPendingStatus] = useState('loading');
  const [pendingError, setPendingError] = useState('');
  const [pendingData, setPendingData] = useState(EMPTY_PAGED_LIST);

  const [updateContext, setUpdateContext] = useState(null);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyStatus, setHistoryStatus] = useState('idle');
  const [historyError, setHistoryError] = useState('');
  const [historyRows, setHistoryRows] = useState([]);
  const [historyStudentLabel, setHistoryStudentLabel] = useState('');

  const resolveApiError = useCallback((error) => {
    const statusCode = Number(error?.response?.status || 0);
    if (statusCode === 401) {
      setUnauthorized(true);
    }

    if (statusCode === 403) {
      setForbidden(true);
    }

    return normalizeApiMessage(error);
  }, []);

  const fetchCampaignDetail = useCallback(async () => {
    setCampaignStatus('loading');
    setCampaignError('');

    try {
      const response = await getVaccinationCampaignDetailApi(campaignId);
      const mapped = mapCampaignDetailEnvelope(response);

      if (!mapped) {
        setCampaignStatus('error');
        setCampaignError('Không tìm thấy dữ liệu đợt tiêm.');
        setCampaign(null);
        return;
      }

      setCampaign(mapped);
      setCampaignStatus('success');
    } catch (error) {
      setCampaignStatus('error');
      setCampaignError(resolveApiError(error));
      setCampaign(null);
    }
  }, [campaignId, resolveApiError]);

  const fetchCampaignStudents = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setStudentsStatus('loading');
    setStudentsError('');

    try {
      const response = await getVaccinationCampaignStudentsApi(campaignId, {
        page: nextPage,
        keyword: nextFilters.keyword,
        status: nextFilters.status,
      });

      const mapped = mapCampaignStudentsEnvelope(response);
      setStudentsData(mapped);
      setStudentsStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (error) {
      setStudentsData(EMPTY_PAGED_LIST);
      setStudentsStatus('error');
      setStudentsError(resolveApiError(error));
    }
  }, [appliedFilters, campaignId, page, resolveApiError]);

  const fetchPending = useCallback(async (nextPage = page) => {
    setPendingStatus('loading');
    setPendingError('');

    try {
      const response = await getPendingVaccinationsApi({
        page: nextPage,
        campaignId,
      });

      const mapped = mapPendingVaccinationsEnvelope(response);
      setPendingData(mapped);
      setPendingStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (error) {
      setPendingData(EMPTY_PAGED_LIST);
      setPendingStatus('error');
      setPendingError(resolveApiError(error));
    }
  }, [campaignId, page, resolveApiError]);

  useEffect(() => {
    fetchCampaignDetail();
  }, [fetchCampaignDetail]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchCampaignStudents(page, appliedFilters);
      return;
    }

    fetchPending(page);
  }, [activeTab, appliedFilters, fetchCampaignStudents, fetchPending, page]);

  const effectiveRows = useMemo(() => {
    if (activeTab === 'students') {
      return studentsData.rows;
    }

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
    }).map((item) => ({
      ...item,
      campaignName: campaign?.name || item.campaignName,
      vaccineName: campaign?.vaccineName || '--',
      scheduledDateLabel: campaign?.scheduledDateLabel || item.scheduledDateLabel,
    }));
  }, [activeTab, appliedFilters.keyword, appliedFilters.status, campaign?.name, campaign?.scheduledDateLabel, campaign?.vaccineName, pendingData.rows, studentsData.rows]);

  const effectiveStatus = activeTab === 'students' ? studentsStatus : pendingStatus;
  const effectiveError = activeTab === 'students' ? studentsError : pendingError;
  const effectivePaging = activeTab === 'students' ? studentsData : pendingData;

  const openUpdateModal = (row) => {
    if (row?.status === 'DONE') {
      return;
    }

    setUpdateError('');

    setUpdateContext({
      ...row,
      campaignName: campaign?.name || row.campaignName || '--',
      vaccineName: campaign?.vaccineName || row.vaccineName || '--',
      scheduledDateLabel: campaign?.scheduledDateLabel || row.scheduledDateLabel || '--',
      student: row.student,
    });
  };

  const openHistoryDrawer = async (row) => {
    const studentUserId = await resolveVaccinationStudentUserId(row.student);

    setHistoryOpen(true);
    setHistoryRows([]);
    setHistoryError('');
    const name = row.student?.fullName || 'Học sinh';
    const code = row.student?.studentCode ? ` - ${row.student.studentCode}` : '';
    const className = row.student?.className ? ` - Lớp ${row.student.className}` : '';
    setHistoryStudentLabel(`${name}${code}${className}`);

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
    } catch (error) {
      const statusCode = Number(error?.response?.status || 0);
      if (statusCode === 404) {
        setHistoryRows([]);
        setHistoryError('');
        setHistoryStatus('empty');
        return;
      }

      setHistoryStatus('error');
      setHistoryError(resolveApiError(error));
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

      await Promise.all([
        fetchCampaignDetail(),
        fetchCampaignStudents(page, appliedFilters),
        fetchPending(page),
      ]);
    } catch (error) {
      setUpdateError(resolveApiError(error));
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
        title={campaign?.name && campaign.name !== '--' ? `Chi tiết đợt tiêm: ${campaign.name}` : 'Chi tiết đợt tiêm'}
        description="Theo dõi học sinh theo từng đợt tiêm và cập nhật kết quả ngay tại danh sách."
        actions={(
          <button
            type="button"
            onClick={() => navigate('/nurse/vaccinations')}
            className="app-focus-ring app-btn-secondary inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Quay lại danh sách đợt tiêm
          </button>
        )}
      />

      {forbidden ? (
        <section className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          Bạn không có quyền truy cập trang này.
        </section>
      ) : null}

      {!forbidden ? (
        <>
          {campaignStatus === 'loading' ? <LoadingSpinner label="Đang tải chi tiết đợt tiêm..." /> : null}
          {campaignStatus === 'error' ? <ErrorState message={campaignError} onRetry={fetchCampaignDetail} /> : null}

          {campaignStatus === 'success' && campaign ? (
            <>
              <VaccinationCampaignSummaryStrip campaign={campaign} />

              <AdminManagementListSection
                filters={(
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {tabs.map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(tab.key);
                              setPage(1);
                              setDraftFilters(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
                              setAppliedFilters(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
                            }}
                            className={`app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold ${activeTab === tab.key
                              ? 'bg-primary-soft text-primary'
                              : 'text-on-surface-variant hover:bg-surface-container-low'
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/nurse/vaccinations/pending')}
                        className="app-focus-ring app-btn-secondary inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                        Theo dõi chưa hoàn thành
                      </button>
                    </div>

                    <VaccinationStudentsToolbar
                      value={draftFilters}
                      onChange={setDraftFilters}
                      onApply={() => {
                        setAppliedFilters(draftFilters);
                        setPage(1);
                      }}
                      onReset={() => {
                        setDraftFilters(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
                        setAppliedFilters(CAMPAIGN_STUDENT_FILTER_DEFAULTS);
                        setPage(1);
                      }}
                      statusOptions={activeTab === 'students' ? VACCINATION_STATUS_FILTER_OPTIONS : PENDING_TAB_STATUS_FILTER_OPTIONS}
                    />
                  </>
                )}
                summary={effectiveRows.length > 0 ? `Hiển thị ${effectiveRows.length} bản ghi/trang • Tổng ${effectivePaging.totalItems} học sinh` : null}
                status={effectiveStatus}
                error={effectiveError}
                onRetry={() => {
                  if (activeTab === 'students') {
                    fetchCampaignStudents(page, appliedFilters);
                    return;
                  }
                  fetchPending(page);
                }}
                loadingLabel="Đang tải danh sách học sinh..."
                emptyTitle={activeTab === 'students' ? 'Không có học sinh trong đợt tiêm' : 'Không có học sinh chưa hoàn thành'}
                emptyDescription="Dữ liệu sẽ hiển thị sau khi hệ thống đồng bộ danh sách đối tượng tiêm."
                sectionClassName="space-y-3"
                table={(
                  <VaccinationStudentsTable
                    rows={effectiveRows}
                    emptyMessage={
                      activeTab === 'students'
                        ? 'Không có học sinh phù hợp trong đợt tiêm này.'
                        : 'Không có học sinh chưa hoàn thành phù hợp với bộ lọc hiện tại.'
                    }
                    onOpenHistory={openHistoryDrawer}
                    onOpenUpdate={openUpdateModal}
                    showResultColumns={activeTab === 'students'}
                    showScheduledDateColumn={activeTab === 'pending'}
                  />
                )}
                pagination={{
                  page: effectivePaging.page,
                  pageSize: effectivePaging.pageSize,
                  totalItems: effectivePaging.totalItems,
                  onPageChange: (nextPage) => setPage(nextPage),
                }}
              />
            </>
          ) : null}
        </>
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

export default NurseVaccinationCampaignDetailPage;
