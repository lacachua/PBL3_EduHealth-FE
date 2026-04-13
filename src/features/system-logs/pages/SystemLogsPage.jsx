import React, { useState } from 'react';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/admin/Pagination';
import SectionCard from '../../../shared/components/admin/SectionCard';
import SystemLogsFilters from '../components/SystemLogsFilters';
import SystemLogsTable from '../components/SystemLogsTable';
import SystemLogDetailDrawer from '../components/SystemLogDetailDrawer';
import SystemLogEmptyState from '../components/SystemLogEmptyState';
import { SYSTEM_LOGS_DEFAULT_FILTERS, useSystemLogs } from '../hooks/useSystemLogs';

const SystemLogsPage = () => {
  const { filters, tableData, status, error, onFiltersChange, onPageChange, fetchList } = useSystemLogs();
  const [selectedLog, setSelectedLog] = useState(null);

  const handleSelectLog = (row) => setSelectedLog(row);

  return (
    <div className="space-y-4 admin-page-bg">
      <PageHeader
        title="Nhật ký hoạt động"
        description="Theo dõi thời gian, người thao tác, module, hành động và đối tượng dữ liệu bị tác động."
        actions={(
          <button
            type="button"
            onClick={() => fetchList()}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        )}
      />

      <SectionCard
        title="Danh sách nhật ký"
        subtitle="Lọc theo thời gian, vai trò và hành động để truy vết thao tác hệ thống."
        className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
      >
        <div className="border-b border-outline-variant bg-surface-container-low px-4 py-3 md:px-5">
          <SystemLogsFilters
            key={`${filters.keyword}|${filters.fromDate}|${filters.toDate}|${filters.role}|${filters.module}|${filters.action}`}
            initialValue={filters}
            onApply={onFiltersChange}
          />
        </div>

        <div className="flex-1 overflow-auto px-0">
          {status === 'loading' && <LoadingSpinner label="Đang tải nhật ký..." />}
          {status === 'error' && <ErrorState message={error} onRetry={fetchList} />}
          {status === 'empty' && <SystemLogEmptyState onClearFilters={() => onFiltersChange(SYSTEM_LOGS_DEFAULT_FILTERS)} />}
          
          {status === 'success' && (
            <SystemLogsTable rows={tableData.rows} onSelect={handleSelectLog} />
          )}
        </div>

        {status === 'success' && (
          <div className="border-t border-outline-variant bg-surface p-3">
            <Pagination
              page={tableData.page}
              pageSize={tableData.pageSize}
              totalItems={tableData.totalItems}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </SectionCard>

      <SystemLogDetailDrawer log={selectedLog} open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default SystemLogsPage;
