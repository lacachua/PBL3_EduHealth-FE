import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import NurseModulePageHeader from '../../../../shared/components/nurse/NurseModulePageHeader';
import NurseDashboardKpiGrid from '../components/NurseDashboardKpiGrid';
import NurseDashboardQuickActions from '../components/NurseDashboardQuickActions';
import NurseDashboardRecentExaminationsTable from '../components/NurseDashboardRecentExaminationsTable';
import NurseDashboardSidePanels from '../components/NurseDashboardSidePanels';
import NurseDashboardTrendChart from '../components/NurseDashboardTrendChart';
import { useNurseDashboard } from '../hooks/useNurseDashboard';

const NurseDashboardPage = () => {
  const navigate = useNavigate();
  const {
    dashboardData,
    error,
    status,
    fetchDashboard,
  } = useNurseDashboard();

  const loading = status === 'loading';

  return (
    <div className="space-y-3.5">
      <NurseModulePageHeader
        title={dashboardData.title}
        description={dashboardData.description}
        actions={(
          <>
            <button
              type="button"
              onClick={() => {
                fetchDashboard();
              }}
              className="app-focus-ring app-btn-secondary px-3.5"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
              Làm mới
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/nurse/examinations', {
                  state: {
                    openCreateExamination: true,
                  },
                });
              }}
              className="app-focus-ring app-btn-primary px-4"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Lập phiếu khám
            </button>
          </>
        )}
      />

      <section className="app-panel-shell app-filter-toolbar flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="app-overline">Điều phối ca trực</p>
          <p className="app-meta-text mt-0.5">Ưu tiên thao tác trực tiếp trên khám bệnh, kho thuốc và tiêm chủng.</p>
        </div>
        {dashboardData.generatedAtLabel ? (
          <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-[11px] font-semibold text-on-surface-muted">
            Cập nhật: {dashboardData.generatedAtLabel}
          </span>
        ) : null}
      </section>

      {error ? (
        <ErrorState
          message={`Không thể làm mới toàn bộ dữ liệu bảng điều phối: ${error}`}
          onRetry={fetchDashboard}
        />
      ) : null}

      <NurseDashboardQuickActions actions={dashboardData.quickActions} />

      <NurseDashboardKpiGrid kpis={dashboardData.kpis} />

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7 h-full">
          <NurseDashboardTrendChart
            trend={dashboardData.trend}
            loading={loading && !dashboardData.hasLoaded}
            onRetry={fetchDashboard}
          />
        </div>

        <div className="lg:col-span-5 h-full">
          <NurseDashboardSidePanels
            panels={dashboardData.panels}
            loading={loading && !dashboardData.hasLoaded}
            onRetry={fetchDashboard}
            panelKeys={['medicineAlerts']}
            maxItemsByPanel={{ medicineAlerts: 3 }}
            className="h-full space-y-0"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-12 h-full">
          <NurseDashboardRecentExaminationsTable
            recentExaminations={dashboardData.recentExaminations}
            loading={loading && !dashboardData.hasLoaded}
            onRetry={fetchDashboard}
          />
        </div>
      </section>
    </div>
  );
};

export default NurseDashboardPage;
