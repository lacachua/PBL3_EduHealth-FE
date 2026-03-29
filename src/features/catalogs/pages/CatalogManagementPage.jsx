import React, { useState } from 'react';
import ConfirmDialog from '../../../shared/components/admin/ConfirmDialog';
import EmptyState from '../../../shared/components/admin/EmptyState';
import ErrorState from '../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../shared/components/admin/PageHeader';
import Pagination from '../../../shared/components/admin/Pagination';
import SectionCard from '../../../shared/components/admin/SectionCard';
import TableToolbar from '../../../shared/components/admin/TableToolbar';
import CatalogFilters from '../components/CatalogFilters';
import CatalogItemModal from '../components/CatalogItemModal';
import CatalogTable from '../components/CatalogTable';
import CatalogTabs from '../components/CatalogTabs';
import { useCatalogManagement } from '../hooks/useCatalogManagement';

const groupUi = {
  vaccines: {
    title: 'danh mục vắc xin',
    subtitle: 'Theo dõi danh sách vắc xin đang dùng, hạn rà soát và chuẩn hóa dữ liệu tiêm chủng.',
  },
  diseases: {
    title: 'danh mục bệnh lý',
    subtitle: 'Chuẩn hóa bệnh lý phục vụ khai báo hồ sơ sức khỏe và đối soát lượt khám.',
  },
  allergies: {
    title: 'danh mục dị ứng',
    subtitle: 'Quản lý dị ứng cần cảnh báo khi khám, kê thuốc và lập kế hoạch tiêm chủng.',
  },
};

const CatalogManagementPage = () => {
  const { group, filters, tableData, status, error, submitting, onGroupChange, onFiltersChange, onPageChange, saveItem, deleteItem, fetchList } = useCatalogManagement();

  const [selectedItem, setSelectedItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const activeGroupUi = groupUi[group] || groupUi.vaccines;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý danh mục"
        description="Chuẩn hóa danh mục dùng chung cho tiêm chủng, hồ sơ sức khỏe và vận hành nhà trường."
        actions={(
          <button
            type="button"
            onClick={() => {
              setSelectedItem(null);
              setFormOpen(true);
            }}
            className="rounded-xl bg-secondary px-3.5 py-2 text-sm font-semibold text-white"
          >
            Thêm danh mục
          </button>
        )}
      />

      <SectionCard title="Nhóm danh mục" subtitle="Chọn nhóm để thao tác CRUD theo từng miền dữ liệu nghiệp vụ">
        <CatalogTabs activeGroup={group} onChange={onGroupChange} />
      </SectionCard>

      <SectionCard title={`Danh sách ${activeGroupUi.title}`} subtitle={activeGroupUi.subtitle}>
        <TableToolbar filters={<CatalogFilters initialValue={filters} onApply={onFiltersChange} />} actions={null} />

        {status === 'loading' ? <LoadingSpinner label="Đang tải danh mục..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={fetchList} /> : null}
        {status === 'empty' ? <EmptyState title="Không có dữ liệu danh mục" description="Nhóm danh mục này chưa có bản ghi theo bộ lọc hiện tại." /> : null}

        {status === 'success' ? (
          <>
            <CatalogTable
              rows={tableData.rows}
              onEdit={(row) => { setSelectedItem(row); setFormOpen(true); }}
              onDelete={(row) => { setSelectedItem(row); setConfirmOpen(true); }}
            />
            <Pagination page={tableData.page} pageSize={tableData.pageSize} totalItems={tableData.totalItems} onPageChange={onPageChange} />
          </>
        ) : null}
      </SectionCard>

      <CatalogItemModal
        key={`${selectedItem?.id || 'new'}-${formOpen ? 'open' : 'closed'}`}
        open={formOpen}
        item={selectedItem}
        submitting={submitting}
        onClose={() => setFormOpen(false)}
        onSubmit={async (payload) => {
          await saveItem(payload);
          setFormOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa danh mục"
        message={selectedItem ? `Bạn muốn xóa danh mục ${selectedItem.name}?` : 'Bạn muốn xóa danh mục này?'}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (selectedItem?.id) await deleteItem(selectedItem.id);
          setConfirmOpen(false);
          setSelectedItem(null);
        }}
        confirmLabel="Xóa"
      />
    </div>
  );
};

export default CatalogManagementPage;
