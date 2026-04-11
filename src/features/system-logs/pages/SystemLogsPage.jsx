import React, { useState } from 'react';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import MockScopeNotice from '../../../shared/components/admin/MockScopeNotice';
import Pagination from '../../../shared/components/admin/Pagination';
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
    <div className="space-y-4">
      <MockScopeNotice moduleLabel="System Logs" className="py-2.5 text-xs" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nhật ký hoạt động</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Theo dõi thời gian, người thao tác, module, hành động và đối tượng dữ liệu bị tác động.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchList()}
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Làm mới
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <SystemLogsFilters
            key={`${filters.keyword}|${filters.fromDate}|${filters.toDate}|${filters.role}|${filters.module}|${filters.action}`}
            initialValue={filters}
            onApply={onFiltersChange}
          />
        </div>

        <div className="flex-1 overflow-auto">
          {status === 'loading' && <LoadingSpinner label="Đang tải nhật ký..." />}
          {status === 'error' && <ErrorState message={error} onRetry={fetchList} />}
          {status === 'empty' && <SystemLogEmptyState onClearFilters={() => onFiltersChange(SYSTEM_LOGS_DEFAULT_FILTERS)} />}
          
          {status === 'success' && (
            <SystemLogsTable rows={tableData.rows} onSelect={handleSelectLog} />
          )}
        </div>

        {status === 'success' && (
          <div className="border-t border-border-soft p-3 bg-white">
            <Pagination
              page={tableData.page}
              pageSize={tableData.pageSize}
              totalItems={tableData.totalItems}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      <SystemLogDetailDrawer log={selectedLog} open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default SystemLogsPage;
