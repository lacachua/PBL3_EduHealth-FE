import React, { useMemo, useState } from 'react';
import EmptyState from '../../../shared/components/admin/EmptyState';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
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
import '../styles/reports.css';

const createInitialFilters = () => ({
  reportType: adminReportFilterOptions.reportTypes[0],
  period: adminReportFilterOptions.periods[0],
  classId: 'all',
  fromDate: '',
  toDate: '',
  gradeScope: adminReportFilterOptions.gradeScopes[0],
  riskThreshold: adminReportFilterOptions.riskThresholds[0],
});

const ReportsPage = () => {
  const {
    filters,
    dashboard,
    status,
    error,
    exporting,
    savingDirective,
    applyFilters,
    resetFilters,
    exportReports,
    saveDirective,
    fetchClassDetail,
    fetchDashboard,
  } = useAdminReportsDashboard(createInitialFilters());
  const [selectedClassId, setSelectedClassId] = useState('class-1-1');
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [directiveNotes, setDirectiveNotes] = useState({});

  const handleApplyFilters = (nextFilters) => {
    applyFilters(nextFilters);
  };

  const handleRefreshData = () => {
    resetFilters();
    fetchDashboard(createInitialFilters());
  };

  const handleAnalyzeClass = async (classId) => {
    if (!classId) {
      return;
    }

    setSelectedClassId(classId);
    try {
      const detail = await fetchClassDetail(classId);
      setSelectedClassDetail(detail);
      setIsDrawerOpen(true);
    } catch {
      setSelectedClassDetail(null);
    }
  };

  const handleDirectiveChange = (nextValue) => {
    setDirectiveNotes((previous) => ({
      ...previous,
      [selectedClassId]: nextValue,
    }));
  };

  const handleSaveDirective = async () => {
    const note = directiveNotes[selectedClassId] || '';
    await saveDirective({ classId: selectedClassId, note });
  };

  const handleSendNotification = async () => {
    return Promise.resolve();
  };

  const currentDirective = directiveNotes[selectedClassId] || '';

  const safeHeader = useMemo(() => ({
    title: dashboard.header?.title || 'Báo cáo quản trị y tế học đường',
    description: dashboard.header?.description || 'Đánh giá tổng quát sức khỏe học sinh toàn trường và theo dõi biến động bệnh lý định kỳ.',
  }), [dashboard.header?.description, dashboard.header?.title]);

  return (
    <div className="app-page-bg relative space-y-4 rounded-xl p-4 sm:p-5">
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

      <div className="inline-flex items-center gap-1.5 rounded-lg border border-info/20 bg-info-soft px-3 py-1.5 text-xs font-medium text-info">
        <span className="material-symbols-outlined text-[15px]">info</span>
        Dữ liệu báo cáo hiện chạy ở chế độ mô phỏng, thao tác ghi đã tạm khóa.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted">
          Chế độ báo cáo quản trị
        </div>
        <ExportActions exporting={exporting} onExport={exportReports} />
      </div>

      <AdminReportFilters
        filters={filters}
        options={dashboard.filterOptions || adminReportFilterOptions}
        onApply={handleApplyFilters}
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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-9">
            <AdminReportMainChart data={dashboard.chartData} meta={dashboard.chartMeta} />
            <AdminReportDetailTable rows={dashboard.classRows} onAnalyzeClass={handleAnalyzeClass} />
          </div>

          <div className="xl:col-span-3">
            <AdminReportSidePanel
              highPriorityAlerts={dashboard.sidePanel.highPriorityAlerts}
              lowSupplies={dashboard.sidePanel.lowSupplies}
              lowVaccinationCoverage={dashboard.sidePanel.lowVaccinationCoverage}
              onOpenClassDetail={handleAnalyzeClass}
            />
          </div>
        </div>
      ) : null}

      <AdminReportDetailDrawer
        isOpen={isDrawerOpen}
        detail={selectedClassDetail}
        directiveNote={currentDirective}
        onDirectiveChange={handleDirectiveChange}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedClassDetail(null);
        }}
        onSaveDirective={handleSaveDirective}
        onSendNotification={handleSendNotification}
        saving={savingDirective}
        writeActionsDisabled
      />
    </div>
  );
};

export default ReportsPage;
