import { useEffect, useMemo, useRef, useState } from 'react';
import AdminAsyncState from '../../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../../shared/components/core/FeedbackToast';
import NurseModulePageHeader from '../../../../shared/components/nurse/NurseModulePageHeader';
import { downloadNurseReportsBlob } from '../adapters/nurseReportsAdapter';
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
    error,
    status,
    applyFilters,
    resetFilters,
    fetchDashboard,
  } = useNurseReportsDashboard();

  const [page, setPage] = useState(1);
  const [exportingFormat, setExportingFormat] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackTimerRef = useRef(null);
  const reportSectionRef = useRef(null);

  const exporting = Boolean(exportingFormat);

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

  const handleExportRows = async (format = 'xlsx') => {
    const normalizedFormat = String(format || 'xlsx').trim().toLowerCase();
    setExportingFormat(normalizedFormat);

    try {
      const exportResult = await nurseReportsRepository.export({
        filters,
        format: normalizedFormat,
      });
      const exported = downloadNurseReportsBlob(exportResult);

      if (!exported) {
        showFeedback('Không nhận được file từ máy chủ.', 'error');
        return;
      }

      showFeedback(`Xuất báo cáo ${normalizedFormat.toUpperCase()} từ hệ thống thành công.`, 'success');
    } catch (exportError) {
      if (exportError?.response?.status === 403) {
        showFeedback('Endpoint xuất báo cáo từ chối quyền NURSE hoặc FE đang gọi sai endpoint.', 'error');
        return;
      }

      showFeedback('Xuất báo cáo thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setExportingFormat('');
    }
  };

  return (
    <div className="space-y-4 text-on-surface">
      <NurseModulePageHeader
        title={viewModel.header.title}
        description={viewModel.header.description}
        actions={(
          <button
            type="button"
            onClick={() => handleExportRows('xlsx')}
            disabled={exporting}
            className="app-focus-ring app-btn-primary px-3.5"
          >
            <span className={`material-symbols-outlined text-[18px] ${exportingFormat === 'xlsx' ? 'animate-spin' : ''}`}>
              {exportingFormat === 'xlsx' ? 'progress_activity' : 'table_view'}
            </span>
            Xuất Excel
          </button>
        )}
      />

      <section className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-0.5">
        <p className="app-meta-text">
          {viewModel.reportPeriodLabel}
          {viewModel.generatedAtLabel && viewModel.generatedAtLabel !== '--'
            ? ` · Cập nhật: ${viewModel.generatedAtLabel}`
            : null}
        </p>
      </section>

      <NurseReportsFilterBar
        filters={filters}
        classOptions={classOptions}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        onApply={() => fetchDashboard(filters)}
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

          <section className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-12">
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
              page={page}
              pageSize={nurseReportFilterOptions.pageSize}
              onPageChange={setPage}
              onExport={handleExportRows}
              exporting={exporting}
              exportingFormat={exportingFormat}
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
