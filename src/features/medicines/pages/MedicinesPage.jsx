import React from 'react';
import { Navigate } from 'react-router-dom';
import ErrorState from '../../../shared/components/core/ErrorState';
import ForbiddenState from '../../../shared/components/admin/ForbiddenState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/core/Pagination';
import SectionCard from '../../../shared/components/core/SectionCard';
import TableToolbar from '../../../shared/components/admin/TableToolbar';
import MedicineDetailDrawer from '../components/MedicineDetailDrawer';
import MedicinesAlertsOverview from '../components/MedicinesAlertsOverview';
import MedicinesEmptyState from '../components/MedicinesEmptyState';
import MedicinesFilters from '../components/MedicinesFilters';
import MedicinesTable from '../components/MedicinesTable';
import { useMedicineAlerts } from '../hooks/useMedicineAlerts';
import { useMedicineDetail } from '../hooks/useMedicineDetail';
import { useMedicines } from '../hooks/useMedicines';

const MedicinesPage = () => {
  const {
    filters,
    tableData,
    status,
    error,
    accessState,
    fetchList,
    onFiltersChange,
    onResetFilters,
    onPageChange,
  } = useMedicines();

  const {
    alertsData,
    loading: alertsLoading,
    error: alertsError,
    fetchAlerts,
  } = useMedicineAlerts();

  const {
    open,
    medicine,
    loading: detailLoading,
    error: detailError,
    movementsLoading,
    movementsError,
    movementsData,
    accessState: detailAccessState,
    openDetail,
    closeDetail,
    refetchMovements,
  } = useMedicineDetail();

  if (accessState === 'unauthorized' || detailAccessState === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Giám sát thuốc"
        description="Theo dõi danh mục thuốc, tồn kho hiện tại, cảnh báo sắp hết và sắp hết hạn."
        actions={null}
      />

      <MedicinesAlertsOverview
        loading={alertsLoading}
        error={alertsError}
        summary={alertsData.summary}
        onRefresh={fetchAlerts}
      />

      <SectionCard title="Danh sách thuốc" subtitle="Màn hình giám sát dữ liệu thuốc và tồn kho ở chế độ chỉ xem.">
        <TableToolbar
          filters={(
            <MedicinesFilters
              initialValue={filters}
              onApply={onFiltersChange}
              onReset={onResetFilters}
              onRefresh={() => {
                fetchList();
                fetchAlerts();
              }}
            />
          )}
          actions={null}
        />

        {accessState === 'forbidden' ? <ForbiddenState message={error} /> : null}
        {status === 'loading' ? <LoadingSpinner label="Đang tải dữ liệu thuốc..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={fetchList} /> : null}
        {status === 'empty' ? <MedicinesEmptyState /> : null}

        {status === 'success' ? (
          <>
            <MedicinesTable rows={tableData.rows} onViewDetail={openDetail} />
            {tableData.totalPages > 1 ? (
              <Pagination
                page={tableData.page}
                pageSize={tableData.pageSize}
                totalItems={tableData.totalItems}
                onPageChange={onPageChange}
              />
            ) : null}
          </>
        ) : null}
      </SectionCard>

      <MedicineDetailDrawer
        open={open}
        medicine={medicine}
        loading={detailLoading}
        error={detailError}
        movementsData={movementsData}
        movementsLoading={movementsLoading}
        movementsError={movementsError}
        onClose={closeDetail}
        onMovementPageChange={(nextPage) => refetchMovements(nextPage, movementsData.pageSize)}
      />
    </div>
  );
};

export default MedicinesPage;
