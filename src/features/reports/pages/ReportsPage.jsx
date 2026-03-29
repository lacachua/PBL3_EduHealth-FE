import React from 'react';
import EmptyState from '../../../shared/components/admin/EmptyState';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import SectionCard from '../../../shared/components/admin/SectionCard';
import TableToolbar from '../../../shared/components/admin/TableToolbar';
import ExportActions from '../components/ExportActions';
import ReportFilters from '../components/ReportFilters';
import ReportPreviewList from '../components/ReportPreviewList';
import { useReportsManagement } from '../hooks/useReportsManagement';

const STATUS_SECTIONS = {
  loading: <LoadingSpinner label="Đang tải dữ liệu báo cáo..." />,
  empty: (
    <EmptyState
      title="Không có dữ liệu báo cáo"
      description="Không có báo cáo phù hợp với bộ lọc đã chọn."
    />
  ),
};

const ReportsPage = () => {
  const { filters, rows, status, error, exporting, onFiltersChange, exportReports, fetchList } = useReportsManagement();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Báo cáo"
        description="Lọc theo kỳ dữ liệu, loại báo cáo và phạm vi để xem trước trước khi xuất file."
      />

      <SectionCard title="Xem trước báo cáo" subtitle="Tổng hợp số liệu theo đúng loại báo cáo nghiệp vụ, sẵn sàng kết nối API xuất file thực tế">
        <TableToolbar
          filters={<ReportFilters initialValue={filters} onApply={onFiltersChange} />}
          actions={<ExportActions exporting={exporting} onExport={exportReports} />}
        />

        {status === 'error' ? <ErrorState message={error} onRetry={fetchList} /> : STATUS_SECTIONS[status] || null}

        {status === 'success' ? <ReportPreviewList rows={rows} /> : null}
      </SectionCard>
    </div>
  );
};

export default ReportsPage;
