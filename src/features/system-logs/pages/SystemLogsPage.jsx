import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import PageHeader from '../../../shared/components/admin/PageHeader';
import SystemLogsFilters from '../components/SystemLogsFilters';
import SystemLogsTable from '../components/SystemLogsTable';
import SystemLogDetailDrawer from '../components/SystemLogDetailDrawer';
import { SYSTEM_LOGS_DEFAULT_FILTERS, useSystemLogs, useSystemLogDetail } from '../hooks/useSystemLogs';

const SystemLogsPage = () => {
  const { filters, tableData, status, error, onFiltersChange, onPageChange, fetchList } = useSystemLogs();
  const {
    selectedLog,
    detailOpen,
    detailLoading,
    detailError,
    openDetail,
    closeDetail,
  } = useSystemLogDetail();

  return (
    <div className="space-y-3.5">
      <PageHeader
        title="Nhật ký hệ thống"
        description="Theo dõi các thao tác quan trọng trong hệ thống."
        actions={(
          <button
            type="button"
            onClick={() => fetchList()}
            className="app-btn-secondary app-focus-ring inline-flex flex-shrink-0 items-center gap-1.5 px-3.5"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <SystemLogsFilters
            key={`${filters.keyword}|${filters.fromDate}|${filters.toDate}|${filters.role}|${filters.module}|${filters.action}`}
            initialValue={filters}
            onApply={onFiltersChange}
            onReset={() => onFiltersChange(SYSTEM_LOGS_DEFAULT_FILTERS)}
          />
        )}
        summary={tableData.totalItems > 0
          ? `Đang hiển thị ${tableData.rows.length} nhật ký trên trang này • Tổng ${tableData.totalItems} nhật ký`
          : null}
        status={status}
        error={error}
        onRetry={fetchList}
        loadingLabel="Đang tải nhật ký..."
        emptyTitle="Không tìm thấy dữ liệu phù hợp"
        emptyDescription="Thử thay đổi bộ lọc hoặc thời gian để xem các nhật ký khác."
        table={<SystemLogsTable rows={tableData.rows} onSelect={openDetail} />}
        pagination={tableData.totalPages > 1 ? {
          page: tableData.page,
          pageSize: tableData.pageSize,
          totalItems: tableData.totalItems,
          onPageChange,
        } : null}
      />

      <SystemLogDetailDrawer
        log={selectedLog}
        open={detailOpen}
        loading={detailLoading}
        error={detailError}
        onClose={closeDetail}
      />
    </div>
  );
};

export default SystemLogsPage;
