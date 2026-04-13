import React from 'react';
import { Navigate } from 'react-router-dom';
import ErrorState from '../../../shared/components/admin/ErrorState';
import ForbiddenState from '../../../shared/components/admin/ForbiddenState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/admin/Pagination';
import SectionCard from '../../../shared/components/admin/SectionCard';
import TableToolbar from '../../../shared/components/admin/TableToolbar';
import CatalogDetailDrawer from '../components/CatalogDetailDrawer';
import CatalogGroupTabs from '../components/CatalogGroupTabs';
import CatalogLookupEmptyState from '../components/CatalogLookupEmptyState';
import CatalogLookupFilters from '../components/CatalogLookupFilters';
import CatalogLookupTable from '../components/CatalogLookupTable';
import { useCatalogDetail } from '../hooks/useCatalogDetail';
import { useCatalogList } from '../hooks/useCatalogList';

const groupUi = {
  vaccines: {
    title: 'nhóm vắc xin',
    subtitle: 'Tra cứu dữ liệu chuẩn phục vụ hồ sơ tiêm chủng và theo dõi sức khỏe học sinh.',
  },
  diseases: {
    title: 'nhóm bệnh lý',
    subtitle: 'Đối chiếu mã bệnh lý dùng chung cho khai báo hồ sơ sức khỏe và khám bệnh học đường.',
  },
  allergies: {
    title: 'nhóm dị ứng',
    subtitle: 'Theo dõi danh mục dị ứng chuẩn để hỗ trợ cảnh báo trong khám bệnh và vận hành y tế.',
  },
};

const CatalogLookupPage = () => {
  const {
    group,
    filters,
    tableData,
    status,
    error,
    accessState,
    fetchList,
    onGroupChange,
    onFiltersChange,
    onResetFilters,
    onPageChange,
  } = useCatalogList();

  const {
    selectedItem,
    detailOpen,
    detailLoading,
    detailError,
    accessState: detailAccessState,
    openDetail,
    closeDetail,
  } = useCatalogDetail();

  if (accessState === 'unauthorized' || detailAccessState === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  const activeGroupUi = groupUi[group] || groupUi.vaccines;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tra cứu danh mục dùng chung"
        description="Không gian tra cứu dữ liệu chuẩn phục vụ hồ sơ sức khỏe, tiêm chủng, khám bệnh và vận hành hệ thống EduHealth."
        actions={(
          <button
            type="button"
            onClick={() => fetchList()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface px-3.5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        )}
      />

      <SectionCard title="Nhóm danh mục" subtitle="Chuyển nhanh nhóm dữ liệu để tra cứu danh mục tương ứng.">
        <CatalogGroupTabs activeGroup={group} onChange={onGroupChange} />
      </SectionCard>

      <SectionCard title={`Danh sách ${activeGroupUi.title}`} subtitle={activeGroupUi.subtitle}>
        <TableToolbar
          filters={<CatalogLookupFilters initialValue={filters} onApply={onFiltersChange} onReset={onResetFilters} />}
          actions={null}
        />

        {accessState === 'forbidden' ? <ForbiddenState message={error} /> : null}
        {status === 'loading' ? <LoadingSpinner label="Đang tải danh mục..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={fetchList} /> : null}
        {status === 'empty' ? <CatalogLookupEmptyState /> : null}

        {status === 'success' ? (
          <>
            <CatalogLookupTable
              rows={tableData.rows}
              onViewDetail={(row) => openDetail(row, { group })}
            />
            {tableData.totalPages > 1 ? (
              <Pagination page={tableData.page} pageSize={tableData.pageSize} totalItems={tableData.totalItems} onPageChange={onPageChange} />
            ) : null}
          </>
        ) : null}
      </SectionCard>

      <CatalogDetailDrawer
        open={detailOpen}
        item={selectedItem}
        loading={detailLoading}
        error={detailError}
        onClose={closeDetail}
      />
    </div>
  );
};

export default CatalogLookupPage;
