import { useMemo, useState } from 'react';
import NurseDrawerShell from '../../../../shared/components/nurse/NurseDrawerShell';
import MedicineMovementTable from './MedicineMovementTable';

const DetailField = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-outline-variant py-2.5 text-sm last:border-b-0 md:grid-cols-[160px_1fr]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{label}</p>
    <p className="text-on-surface">{value || 'Chưa có dữ liệu'}</p>
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
            Hủy / loại bỏ thuốc
          </button>
          <button type="button" className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onEdit(medicine)}>
            Chỉnh sửa thông tin
          </button>
          <button type="button" className="app-btn-primary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onStockIn(medicine)}>
            Nhập thêm
          </button>
          <button type="button" className="app-focus-ring app-row-action px-3 text-sm" onClick={() => onToggleStatus(medicine)}>
            {medicine?.status === 'ACTIVE' ? 'Ngưng sử dụng' : 'Kích hoạt lại'}
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
        <div className="space-y-4">
          <section className="space-y-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
            <h3 className="mb-2 text-sm font-bold text-primary">Thông tin thuốc</h3>
            <DetailField label="Tên thuốc" value={medicine.name} />
            <DetailField label="Hoạt chất" value={medicine.activeIngredient} />
            <DetailField label="Đơn vị" value={medicine.unitLabel} />
            <DetailField label="Quy cách" value={medicine.packaging} />
          </section>

          <section className="space-y-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
            <h3 className="mb-2 text-sm font-bold text-primary">Thông tin kho</h3>
            <DetailField label="Tồn kho" value={medicine.currentStock != null ? `${medicine.currentStock} ${medicine.unitLabel || ''}`.trim() : null} />
            <DetailField label="Mức cảnh báo" value={medicine.warningThreshold != null ? `${medicine.warningThreshold} ${medicine.unitLabel || ''}`.trim() : null} />
            <DetailField label="Hạn gần nhất" value={medicine.nearestExpiryDateLabel} />
          </section>

          <section className="space-y-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
            <h3 className="mb-2 text-sm font-bold text-primary">Trạng thái sử dụng</h3>
            <DetailField label="Trạng thái" value={medicine.statusLabel} />
            <DetailField label="Cảnh báo" value={medicine.alertLabel} />
            <DetailField label="Ghi chú" value={medicine.note} />
          </section>

          <section className="space-y-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
            <h3 className="mb-2 text-sm font-bold text-primary">Thông tin hệ thống</h3>
            <DetailField label="Tạo lúc" value={medicine.createdAtLabel} />
            <DetailField label="Cập nhật lúc" value={medicine.updatedAtLabel} />
          </section>
        </div>
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
