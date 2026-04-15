import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminAsyncState from '../../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../../shared/components/admin/AdminFeedbackToast';
import NurseModulePageHeader from '../../../../shared/components/nurse/NurseModulePageHeader';
import {
  exportNurseReportsRowsToExcel,
} from '../adapters/nurseReportsAdapter';
import NurseReportsClassTable from '../components/NurseReportsClassTable';
import NurseReportsDiseasePanel from '../components/NurseReportsDiseasePanel';
import NurseReportsFilterBar from '../components/NurseReportsFilterBar';
import NurseReportsInsightsPanel from '../components/NurseReportsInsightsPanel';
import NurseReportsSummaryCards from '../components/NurseReportsSummaryCards';
import NurseReportsTrendPanel from '../components/NurseReportsTrendPanel';
import { nurseReportFilterOptions } from '../config/nurseReportFilterOptions';
import { useNurseReportsDashboard } from '../hooks/useNurseReportsDashboard';

const TOAST_CLASS_MAP = {
  success: 'border-success/25 bg-success-soft text-success',
  error: 'border-danger/25 bg-danger-soft text-danger',
  info: 'border-info/25 bg-info-soft text-info',
};

const FEEDBACK_TIMEOUT_MS = 2600;

const NurseReportsPage = () => {
  const {
    filters,
    viewModel,
    loading,
    hasLoaded,
    error,
    status,
    applyFilters,
    resetFilters,
    fetchDashboard,
  } = useNurseReportsDashboard();

  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const feedbackTimerRef = useRef(null);
  const reportSectionRef = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const showFeedback = (message, type = 'info') => {
    setFeedback({ message, type });
    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, FEEDBACK_TIMEOUT_MS);
  };

  const sourceTag = useMemo(() => {
    const source = String(viewModel.source || '').toLowerCase();
    if (source === 'mock') {
      return {
        badgeClassName: 'border-info/20 bg-info-soft text-info',
        label: 'Nguồn dữ liệu: Mô phỏng',
        note: viewModel.sourceNote || 'Chế độ mock-first',
      };
    }

    return {
      badgeClassName: 'border-success/20 bg-success-soft text-success',
      label: 'Nguồn dữ liệu: Đồng bộ',
      note: 'Đang dùng dữ liệu hệ thống',
    };
  }, [viewModel.source, viewModel.sourceNote]);

  const classOptions = useMemo(() => {
    return viewModel.filterOptions?.classOptions || [{ value: 'all', label: 'Tất cả lớp' }];
  }, [viewModel.filterOptions?.classOptions]);

  const handleFiltersChange = (partialFilters) => {
    applyFilters(partialFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setPage(1);
  };

  const handleRefresh = () => {
    fetchDashboard(filters);
  };

  const handleViewReport = () => {
    reportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleExportRows = async (rows) => {
    setExporting(true);
    try {
      const exported = exportNurseReportsRowsToExcel(rows);
      if (!exported) {
        showFeedback('Không có dữ liệu phù hợp để xuất báo cáo.', 'error');
        return;
      }

      showFeedback('Xuất báo cáo Excel thành công.', 'success');
    } catch {
      showFeedback('Xuất báo cáo thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="nurse-page-bg space-y-2.5 rounded-xl p-3.5 sm:p-4">
      <NurseModulePageHeader
        title={viewModel.header.title}
        description={viewModel.header.description}
        className="!rounded-xl !border-outline-variant !bg-surface !px-4 !py-3 shadow-none"
        actions={(
          <>
            <button
              type="button"
              onClick={handleViewReport}
              className="nurse-focus-ring nurse-btn-secondary inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Xem báo cáo
            </button>

            <button
              type="button"
              onClick={() => handleExportRows(viewModel.classRows)}
              disabled={exporting || !viewModel.classRows.length}
              className="nurse-focus-ring nurse-btn-primary inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${exporting ? 'animate-spin' : ''}`}>
                {exporting ? 'progress_activity' : 'table_view'}
              </span>
              Xuất Excel
            </button>
          </>
        )}
      />

      <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-on-surface-muted">
        <span className="font-medium">Cập nhật lúc: {viewModel.generatedAtLabel}</span>
        <span
          title={sourceTag.note}
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sourceTag.badgeClassName}`}
        >
          {sourceTag.label}
        </span>
      </div>

      <NurseReportsFilterBar
        filters={filters}
        classOptions={classOptions}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        onRefresh={handleRefresh}
        refreshing={loading && hasLoaded}
      />

      <AdminAsyncState
        status={status}
        error={error}
        onRetry={() => fetchDashboard(filters)}
        loadingLabel="Đang tải báo cáo y tế tổng hợp..."
        emptyTitle="Không có dữ liệu báo cáo"
        emptyDescription="Bộ lọc hiện tại chưa có bản ghi phù hợp."
        containerClassName="px-0 py-0"
      >
        <div className="space-y-3">
          <NurseReportsSummaryCards cards={viewModel.summaryCards} />

          <section className="grid grid-cols-1 gap-3 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <NurseReportsTrendPanel trend={viewModel.trend} />
            </div>
            <div className="xl:col-span-5">
              <NurseReportsDiseasePanel disease={viewModel.disease} />
            </div>
          </section>

          <NurseReportsInsightsPanel insights={viewModel.insights} />

          <div ref={reportSectionRef}>
            <NurseReportsClassTable
              rows={viewModel.classRows}
              searchValue={searchValue}
              onSearchValueChange={(nextValue) => {
                setSearchValue(nextValue);
                setPage(1);
              }}
              statusFilter={statusFilter}
              statusOptions={nurseReportFilterOptions.tableStatus}
              onStatusFilterChange={(nextValue) => {
                setStatusFilter(nextValue);
                setPage(1);
              }}
              page={page}
              pageSize={nurseReportFilterOptions.pageSize}
              onPageChange={setPage}
              onExport={handleExportRows}
              exporting={exporting}
            />
          </div>
        </div>
      </AdminAsyncState>

      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        classMap={TOAST_CLASS_MAP}
      />
    </div>
  );
};

export default NurseReportsPage;
