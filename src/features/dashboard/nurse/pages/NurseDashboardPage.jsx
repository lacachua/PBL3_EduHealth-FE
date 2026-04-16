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
    <div className="space-y-3">
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
              className="app-focus-ring app-btn-secondary inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
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
              className="app-focus-ring app-btn-primary inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Lập phiếu khám
            </button>
          </>
        )}
      />

      {dashboardData.generatedAtLabel ? (
        <p className="px-1 text-xs font-medium text-on-surface-muted">
          Dữ liệu cập nhật lúc: {dashboardData.generatedAtLabel}
        </p>
      ) : null}

      {error ? (
        <ErrorState
          message={`Không thể làm mới toàn bộ dữ liệu dashboard: ${error}`}
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
        <div className="lg:col-span-7 h-full">
          <NurseDashboardRecentExaminationsTable
            recentExaminations={dashboardData.recentExaminations}
            loading={loading && !dashboardData.hasLoaded}
            onRetry={fetchDashboard}
          />
        </div>

        <div className="lg:col-span-5 h-full">
          <NurseDashboardSidePanels
            panels={dashboardData.panels}
            loading={loading && !dashboardData.hasLoaded}
            onRetry={fetchDashboard}
            panelKeys={['pendingVaccinations']}
            maxItemsByPanel={{
              pendingVaccinations: 3,
            }}
            className="h-full space-y-0"
          />
        </div>
      </section>
    </div>
  );
};

export default NurseDashboardPage;
