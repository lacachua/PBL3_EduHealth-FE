import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import {
  mapCampaignListEnvelope,
  mapCreateCampaignResponse,
} from '../adapters/vaccinationResponseMapper';
import VaccinationCampaignTable from '../components/VaccinationCampaignTable';
import VaccinationCampaignToolbar from '../components/VaccinationCampaignToolbar';
import VaccinationSummaryCards from '../components/VaccinationSummaryCards';
import CreateVaccinationCampaignModal from '../components/CreateVaccinationCampaignModal';
import {
  CAMPAIGN_FILTER_DEFAULTS,
} from '../constants/vaccinationConstants';
import {
  createVaccinationCampaignApi,
  getVaccinationCampaignsApi,
} from '../services/nurseVaccinationsApi';

const EMPTY_LIST = {
  rows: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

const NurseVaccinationCampaignsPage = () => {
  const navigate = useNavigate();

  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [draftFilters, setDraftFilters] = useState(CAMPAIGN_FILTER_DEFAULTS);
  const [appliedFilters, setAppliedFilters] = useState(CAMPAIGN_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);

  const [listStatus, setListStatus] = useState('loading');
  const [listError, setListError] = useState('');
  const [campaignData, setCampaignData] = useState(EMPTY_LIST);

  const [feedback, setFeedback] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

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

  const fetchCampaigns = useCallback(async (nextPage = page, nextFilters = appliedFilters) => {
    setListStatus('loading');
    setListError('');

    try {
      const response = await getVaccinationCampaignsApi({
        ...nextFilters,
        page: nextPage,
      });

      const mapped = mapCampaignListEnvelope(response);
      setCampaignData(mapped);
      setListStatus(mapped.rows.length ? 'success' : 'empty');
    } catch (error) {
      setCampaignData(EMPTY_LIST);
      setListStatus('error');
      setListError(resolveApiError(error));
    }
  }, [appliedFilters, page, resolveApiError]);

  useEffect(() => {
    fetchCampaigns(page, appliedFilters);
  }, [appliedFilters, fetchCampaigns, page]);

  const summary = useMemo(() => {
    const totalCampaigns = campaignData.totalItems || campaignData.rows.length;

    const aggregate = campaignData.rows.reduce((acc, item) => {
      acc.totalStudents += item.statistics.totalStudents || 0;
      acc.doneStudents += item.statistics.doneCount || 0;
      acc.pendingStudents += item.statistics.pendingCount || 0;
      return acc;
    }, {
      totalStudents: 0,
      doneStudents: 0,
      pendingStudents: 0,
    });

    return {
      totalCampaigns,
      pendingStudents: aggregate.pendingStudents,
      completionRate: aggregate.totalStudents
        ? Math.round((aggregate.doneStudents / aggregate.totalStudents) * 100)
        : 0,
    };
  }, [campaignData.rows, campaignData.totalItems]);

  const visibleRows = useMemo(() => {
    if (!appliedFilters.incompleteOnly) {
      return campaignData.rows;
    }

    return campaignData.rows.filter((item) => Number(item?.statistics?.pendingCount || 0) > 0);
  }, [appliedFilters.incompleteOnly, campaignData.rows]);

  const handleCreateCampaign = async (values) => {
    setCreateSubmitting(true);
    setCreateError('');

    try {
      const response = await createVaccinationCampaignApi(values);
      const created = mapCreateCampaignResponse(response);

      setCreateOpen(false);
      setFeedback({
        type: 'success',
        message: response?.message || 'Tạo đợt tiêm thành công.',
      });

      if (created?.id) {
        navigate(`/nurse/vaccinations/${created.id}`);
        return;
      }

      await fetchCampaigns(1, appliedFilters);
      setPage(1);
    } catch (error) {
      setCreateError(resolveApiError(error));
    } finally {
      setCreateSubmitting(false);
    }
  };

  if (unauthorized) {
    return <Navigate to="/login" replace />;
  }

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
        title="Quản lý tiêm chủng"
        description="Theo dõi các đợt tiêm và cập nhật kết quả tiêm cho học sinh."
        actions={(
          <button
            type="button"
            onClick={() => {
              setCreateError('');
              setCreateOpen(true);
            }}
            className="app-btn-primary app-focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo đợt tiêm
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <div className="space-y-4">
            <VaccinationCampaignToolbar
              value={draftFilters}
              onChange={setDraftFilters}
              onApply={() => {
                setAppliedFilters(draftFilters);
                setPage(1);
              }}
              onReset={() => {
                setDraftFilters(CAMPAIGN_FILTER_DEFAULTS);
                setAppliedFilters(CAMPAIGN_FILTER_DEFAULTS);
                setPage(1);
              }}
            />

            <VaccinationSummaryCards summary={summary} loading={listStatus === 'loading'} />

            {forbidden ? (
              <section className="mt-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
                Bạn không có quyền truy cập trang này.
              </section>
            ) : null}
          </div>
        )}
        summary={visibleRows.length > 0 ? `Hiển thị ${visibleRows.length} bản ghi/trang • Tổng ${campaignData.totalItems} đợt tiêm` : null}
        status={forbidden ? 'idle' : listStatus}
        error={listError}
        onRetry={() => fetchCampaigns(page, appliedFilters)}
        loadingLabel="Đang tải danh sách đợt tiêm..."
        emptyTitle="Không có đợt tiêm"
        emptyDescription="Danh sách đợt tiêm sẽ hiển thị sau khi hệ thống khởi tạo chiến dịch."
        sectionClassName="space-y-3"
        table={!forbidden ? (
          <VaccinationCampaignTable
            rows={visibleRows}
            onViewDetail={(item) => navigate(`/nurse/vaccinations/${item.id}`)}
          />
        ) : null}
        pagination={!forbidden ? {
          page: campaignData.page,
          pageSize: campaignData.pageSize,
          totalItems: campaignData.totalItems,
          onPageChange: (nextPage) => setPage(nextPage),
        } : null}
      />

      {createOpen ? (
        <CreateVaccinationCampaignModal
          key="create-vaccination-campaign"
          open={createOpen}
          onClose={() => {
            if (createSubmitting) {
              return;
            }
            setCreateOpen(false);
          }}
          onSubmit={handleCreateCampaign}
          submitting={createSubmitting}
          submitError={createError}
        />
      ) : null}
    </div>
  );
};

export default NurseVaccinationCampaignsPage;
