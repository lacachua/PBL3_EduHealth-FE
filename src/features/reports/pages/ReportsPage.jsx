import React, { useMemo, useState } from 'react';
import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import AdminReportDetailDrawer from '../components/AdminReportDetailDrawer';
import AdminReportFilters from '../components/AdminReportFilters';
import AdminReportMainChart from '../components/AdminReportMainChart';
import AdminReportSidePanel from '../components/AdminReportSidePanel';
import AdminReportSummaryCards from '../components/AdminReportSummaryCards';
import AdminReportDetailTable from '../components/AdminReportDetailTable';
import ExportActions from '../components/ExportActions';
import { useAdminReportsDashboard } from '../hooks/useAdminReportsDashboard';
import { adminReportFilterOptions } from '../constants/adminReportFilterOptions';
import { ADMIN_REPORT_CAPABILITIES } from '../schemas/adminReportsSchema';
import '../styles/reports.css';

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createInitialFilters = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    classId: 'all',
    fromDate: formatLocalDate(firstDayOfMonth),
    toDate: formatLocalDate(today),
    gradeScope: adminReportFilterOptions.gradeScopes[0],
    riskThreshold: adminReportFilterOptions.riskThresholds[0],
  };
};

const ReportsPage = () => {
  const disableServerExport = !ADMIN_REPORT_CAPABILITIES.supportsServerExport;

  const {
    filters,
    dashboard,
    status,
    error,
    exporting,
    applyFilters,
    resetFilters,
    exportReports,
    fetchClassDetail,
    fetchDashboard,
  } = useAdminReportsDashboard(createInitialFilters());

  const [selectedClassDetail, setSelectedClassDetail] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRefreshData = () => {
    fetchDashboard(filters);
  };

  const handleAnalyzeClass = async (classId) => {
    if (!classId) return;

    try {
      const detail = await fetchClassDetail(classId);
      setSelectedClassDetail(detail);
      setIsDrawerOpen(Boolean(detail));
    } catch {
      setSelectedClassDetail(null);
    }
  };

  const safeHeader = useMemo(() => ({
    title: dashboard.header?.title || 'Báo cáo quản trị y tế học đường',
    description: dashboard.header?.description || 'Đánh giá tổng quát sức khỏe học sinh toàn trường và theo dõi biến động bệnh lý định kỳ.',
  }), [dashboard.header?.description, dashboard.header?.title]);

  return (
    <div className="app-page-bg relative max-w-full min-w-0 space-y-4 overflow-x-hidden rounded-xl p-4 sm:p-5">
      <PageHeader
        title={safeHeader.title}
        description={safeHeader.description}
        actions={(
          <button
            type="button"
            onClick={handleRefreshData}
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới dữ liệu
          </button>
        )}
      />

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted">
          Chế độ báo cáo quản trị
        </div>
        <ExportActions
          exporting={exporting}
          disabled={disableServerExport}
          disabledMessage="Chức năng xuất báo cáo đang được hoàn thiện"
          onExport={exportReports}
        />
      </div>

      <AdminReportFilters
        filters={filters}
        options={dashboard.filterOptions || adminReportFilterOptions}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {status === 'loading' ? <LoadingSpinner label="Đang tải dữ liệu báo cáo quản trị..." /> : null}
      {status === 'error' ? <ErrorState message={error} onRetry={() => fetchDashboard(filters)} /> : null}

      {status !== 'loading' && status !== 'error' ? <AdminReportSummaryCards cards={dashboard.summaryCards} /> : null}

      {status === 'empty' ? (
        <EmptyState
          title="Không có dữ liệu phù hợp"
          description="Không có bản ghi phù hợp với bộ lọc hiện tại, vui lòng đổi bộ lọc và thử lại."
        />
      ) : null}

      {status === 'success' ? (
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="min-w-0 space-y-6 xl:col-span-9">
            <AdminReportMainChart data={dashboard.chartData} meta={dashboard.chartMeta} />
          </div>

          <div className="min-w-0 xl:col-span-3">
            <AdminReportSidePanel
              highPriorityAlerts={dashboard.sidePanel.highPriorityAlerts}
              lowSupplies={dashboard.sidePanel.lowSupplies}
              lowVaccinationCoverage={dashboard.sidePanel.lowVaccinationCoverage}
              onOpenClassDetail={handleAnalyzeClass}
            />
          </div>

          <div className="col-span-full w-full max-w-none min-w-0">
            <AdminReportDetailTable rows={dashboard.classRows} onAnalyzeClass={handleAnalyzeClass} />
          </div>
        </div>
      ) : null}

      <AdminReportDetailDrawer
        isOpen={isDrawerOpen}
        detail={selectedClassDetail}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedClassDetail(null);
        }}
      />
    </div>
  );
};

export default ReportsPage;
