import React, { useMemo, useState } from 'react';
import NurseDrawerShell from '../../../../shared/components/nurse/NurseDrawerShell';
import MedicineMovementTable from './MedicineMovementTable';

const DetailField = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-outline-variant py-2.5 text-sm last:border-b-0 md:grid-cols-[160px_1fr]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{label}</p>
    <p className="text-on-surface">{value || '--'}</p>
  </div>
);

const MedicineDetailDrawer = ({
  open,
  medicine,
  loading,
  error,
  onClose,
  movementData,
  movementLoading,
  movementError,
  movementFilters,
  onMovementFiltersChange,
  onMovementPageChange,
  onEdit,
  onStockIn,
  onDispose,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const drawerTitle = useMemo(() => {
    if (!medicine?.name) return 'Chi tiết thuốc';
    return medicine.name;
  }, [medicine?.name]);

  return (
    <NurseDrawerShell
      open={open}
      onClose={onClose}
      title={drawerTitle}
      subtitle={medicine?.id ? `Mã thuốc: ${medicine.id}` : 'Chi tiết thuốc'}
      widthClass="max-w-[620px]"
      footer={(
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onDispose(medicine)}>
            Hủy thuốc
          </button>
          <button type="button" className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onEdit(medicine)}>
            Chỉnh sửa
          </button>
          <button type="button" className="app-btn-primary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onStockIn(medicine)}>
            Nhập kho
          </button>
          <button type="button" className="app-focus-ring app-row-action px-3 text-sm" onClick={() => onToggleStatus(medicine)}>
            Đổi trạng thái
          </button>
        </div>
      )}
    >
      <nav className="sticky top-0 z-10 mb-4 flex border-b border-outline-variant bg-surface/95 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`app-focus-ring px-3 py-2 text-sm font-semibold ${activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}
        >
          Thông tin thuốc
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          className={`app-focus-ring px-3 py-2 text-sm font-semibold ${activeTab === 'movements' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}
        >
          Lịch sử biến động
        </button>
      </nav>

      {loading ? <p className="text-sm text-on-surface-variant">Đang tải chi tiết thuốc...</p> : null}
      {error ? <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p> : null}

      {!loading && !error && activeTab === 'info' && medicine ? (
        <section className="space-y-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
          <DetailField label="Tên thuốc" value={medicine.name} />
          <DetailField label="Hoạt chất" value={medicine.activeIngredient || '--'} />
          <DetailField label="Đơn vị" value={medicine.unitLabel} />
          <DetailField label="Quy cách" value={medicine.packaging || '--'} />
          <DetailField label="Tồn kho" value={medicine.currentStock} />
          <DetailField label="Mức cảnh báo" value={medicine.warningThreshold} />
          <DetailField label="Hạn gần nhất" value={medicine.nearestExpiryDateLabel} />
          <DetailField label="Trạng thái" value={medicine.statusLabel} />
          <DetailField label="Cảnh báo" value={medicine.alertLabel} />
          <DetailField label="Ghi chú" value={medicine.note || '--'} />
          <DetailField label="Tạo lúc" value={medicine.createdAtLabel} />
          <DetailField label="Cập nhật lúc" value={medicine.updatedAtLabel} />
        </section>
      ) : null}

      {!loading && activeTab === 'movements' ? (
        <MedicineMovementTable
          rows={movementData.rows}
          loading={movementLoading}
          error={movementError}
          page={movementData.page}
          pageSize={movementData.pageSize}
          totalItems={movementData.totalItems}
          onPageChange={onMovementPageChange}
          filters={movementFilters}
          onFiltersChange={onMovementFiltersChange}
        />
      ) : null}
    </NurseDrawerShell>
  );
};

export default MedicineDetailDrawer;
