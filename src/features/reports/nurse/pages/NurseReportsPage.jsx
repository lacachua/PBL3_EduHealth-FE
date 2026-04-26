import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminAsyncState from '../../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../../shared/components/core/FeedbackToast';
import NurseModulePageHeader from '../../../../shared/components/nurse/NurseModulePageHeader';
import {
  downloadNurseReportsBlob,
} from '../adapters/nurseReportsAdapter';
import NurseReportsClassTable from '../components/NurseReportsClassTable';
import NurseReportsDiseasePanel from '../components/NurseReportsDiseasePanel';
import NurseReportsFilterBar from '../components/NurseReportsFilterBar';
import NurseReportsInsightsPanel from '../components/NurseReportsInsightsPanel';
import NurseReportsSummaryCards from '../components/NurseReportsSummaryCards';
import NurseReportsTrendPanel from '../components/NurseReportsTrendPanel';
import { nurseReportFilterOptions } from '../config/nurseReportFilterOptions';
import { useNurseReportsDashboard } from '../hooks/useNurseReportsDashboard';
import { nurseReportsRepository } from '../repositories/nurseReportsRepository';

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
        label: 'Nguồn dữ liệu: Mô phỏng (chờ dữ liệu thật)',
        note: viewModel.sourceNote || 'Nguồn dữ liệu thật cho báo cáo điều dưỡng chưa sẵn sàng',
      };
    }

    return {
      badgeClassName: 'border-success/20 bg-success-soft text-success',
      label: 'Nguồn dữ liệu: Đồng bộ hệ thống',
      note: 'Dữ liệu đang được đồng bộ từ hệ thống',
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

  const handleExportRows = async () => {
    setExporting(true);
    try {
      const exportResult = await nurseReportsRepository.export(filters);
      const exported = downloadNurseReportsBlob(exportResult);
      if (!exported) {
        showFeedback('Không nhận được file Excel từ máy chủ.', 'error');
        return;
      }

      showFeedback('Xuất báo cáo Excel thành công.', 'success');
    } catch (exportError) {
      if (exportError?.response?.status === 403) {
        showFeedback('Endpoint xuất báo cáo từ chối quyền NURSE hoặc FE đang gọi sai endpoint.', 'error');
        return;
      }

      showFeedback('Xuất báo cáo thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 text-on-surface">
      <NurseModulePageHeader
        title={viewModel.header.title}
        description={viewModel.header.description}
        actions={(
          <>
            <button
              type="button"
              onClick={handleViewReport}
              className="app-focus-ring app-btn-secondary px-3"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Xem báo cáo
            </button>

            <button
              type="button"
              onClick={() => handleExportRows(viewModel.classRows)}
              disabled={exporting || !viewModel.classRows.length}
              className="app-focus-ring app-btn-primary px-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${exporting ? 'animate-spin' : ''}`}>
                {exporting ? 'progress_activity' : 'table_view'}
              </span>
              Xuất Excel
            </button>
          </>
        )}
      />

      <section className="app-panel-shell app-filter-toolbar flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="app-overline">Phiên dữ liệu báo cáo</p>
          <p className="app-meta-text mt-0.5">Cập nhật lúc: {viewModel.generatedAtLabel}</p>
        </div>
        <span
          title={sourceTag.note}
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${sourceTag.badgeClassName}`}
        >
          {sourceTag.label}
        </span>
      </section>

      {String(viewModel.source || '').toLowerCase() === 'mock' ? (
        <section className="rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
          Báo cáo điều dưỡng hiện đang dùng dữ liệu mô phỏng. Dữ liệu thật sẽ tự động thay thế khi tích hợp hoàn tất.
        </section>
      ) : null}

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
