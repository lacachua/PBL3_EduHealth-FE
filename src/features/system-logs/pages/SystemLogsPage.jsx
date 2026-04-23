import React from 'react';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/admin/Pagination';
import SectionCard from '../../../shared/components/admin/SectionCard';
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
        className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-[0_16px_30px_-22px_rgba(15,23,42,0.45)]"
        headerClassName="border-b border-outline-variant bg-surface px-4 pb-3 pt-3.5 md:px-5"
        titleClassName="app-section-title"
        subtitleClassName="app-meta-text mt-0.5"
      >
        <div className="border-b border-outline-variant bg-surface-container-low px-4 py-3.5 md:px-5">
          <SystemLogsFilters
            key={`${filters.keyword}|${filters.fromDate}|${filters.toDate}|${filters.role}|${filters.module}|${filters.action}`}
            initialValue={filters}
            onApply={onFiltersChange}
          />
          <p className="app-table-summary mt-2">
            Hiển thị {tableData.rows.length} / {tableData.totalItems} nhật ký
          </p>
        </div>

        <div className="overflow-auto bg-surface">
          {status === 'loading' && <LoadingSpinner label="Đang tải nhật ký..." />}
          {status === 'error' && <ErrorState message={error} onRetry={fetchList} />}
          {status === 'empty' && <SystemLogEmptyState onClearFilters={() => onFiltersChange(SYSTEM_LOGS_DEFAULT_FILTERS)} />}
          
          {status === 'success' && (
            <SystemLogsTable rows={tableData.rows} onSelect={(row) => openDetail(row)} />
          )}
        </div>

        {status === 'success' && (
          <div className="border-t border-outline-variant bg-surface px-4 py-2.5 md:px-5">
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
