import React from 'react';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/core/Pagination';
import SectionCard from '../../../shared/components/core/SectionCard';
import SystemLogsFilters from '../components/SystemLogsFilters';
import SystemLogsTable from '../components/SystemLogsTable';
import SystemLogDetailDrawer from '../components/SystemLogDetailDrawer';
import SystemLogEmptyState from '../components/SystemLogEmptyState';
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
    <div className="space-y-3.5 app-page-bg">
      <PageHeader
        title="Nhật ký hoạt động"
        description="Theo dõi thời gian, người thao tác, module, hành động và đối tượng dữ liệu bị tác động."
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

      <SectionCard
        title="Danh sách nhật ký"
        subtitle="Lọc theo thời gian, vai trò và hành động để truy vết thao tác hệ thống."
      >
        <div className="p-4 md:p-5">
          <SystemLogsFilters
            key={`${filters.keyword}|${filters.fromDate}|${filters.toDate}|${filters.role}|${filters.module}|${filters.action}`}
            initialValue={filters}
            onApply={onFiltersChange}
          />
          <div className="app-table-summary rounded-xl px-3 py-2 text-[11px] mt-3">
            Hiển thị {tableData.rows.length} / {tableData.totalItems} nhật ký
          </div>
        </div>

        <div className="px-4 md:px-5 pb-4 md:pb-5">
          {status === 'loading' && <LoadingSpinner label="Đang tải nhật ký..." />}
          {status === 'error' && <ErrorState message={error} onRetry={fetchList} />}
          {status === 'empty' && <SystemLogEmptyState onClearFilters={() => onFiltersChange(SYSTEM_LOGS_DEFAULT_FILTERS)} />}

          {status === 'success' && (
            <SystemLogsTable rows={tableData.rows} onSelect={(row) => openDetail(row)} />
          )}
        </div>

        {status === 'success' && tableData.totalPages > 1 && (
          <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
            <Pagination
              page={tableData.page}
              pageSize={tableData.pageSize}
              totalItems={tableData.totalItems}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </SectionCard>

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
