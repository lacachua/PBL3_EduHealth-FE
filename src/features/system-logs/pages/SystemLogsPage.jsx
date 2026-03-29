import React from 'react';
import EmptyState from '../../../shared/components/admin/EmptyState';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/admin/Pagination';
import SectionCard from '../../../shared/components/admin/SectionCard';
import TableToolbar from '../../../shared/components/admin/TableToolbar';
import SystemLogsFilters from '../components/SystemLogsFilters';
import SystemLogsTable from '../components/SystemLogsTable';
import { useSystemLogs } from '../hooks/useSystemLogs';

const STATUS_SECTIONS = {
  loading: <LoadingSpinner label="Đang tải nhật ký..." />,
  empty: (
    <EmptyState
      title="Không có nhật ký"
      description="Không tìm thấy bản ghi theo bộ lọc hiện tại."
    />
  ),
};

const SystemLogsPage = () => {
  const { filters, tableData, status, error, onFiltersChange, onPageChange, fetchList } = useSystemLogs();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nhật ký hệ thống"
        description="Theo dõi thời gian, người thao tác, module, hành động và đối tượng dữ liệu bị tác động."
      />

      <SectionCard title="Danh sách nhật ký" subtitle="Dùng cho đối soát vận hành và làm nguồn dữ liệu cho hoạt động gần đây trên tổng quan">
        <TableToolbar filters={<SystemLogsFilters initialValue={filters} onApply={onFiltersChange} />} actions={null} />

        {status === 'error' ? <ErrorState message={error} onRetry={fetchList} /> : STATUS_SECTIONS[status] || null}

        {status === 'success' ? (
          <>
            <SystemLogsTable rows={tableData.rows} />
            <Pagination page={tableData.page} pageSize={tableData.pageSize} totalItems={tableData.totalItems} onPageChange={onPageChange} />
          </>
        ) : null}
      </SectionCard>
    </div>
  );
};

export default SystemLogsPage;
