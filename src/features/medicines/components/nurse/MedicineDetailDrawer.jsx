import React, { useMemo, useState } from 'react';
import RightDrawer from '../../../../shared/components/admin/RightDrawer';
import MedicineMovementTable from './MedicineMovementTable';

const DetailField = ({ label, value }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-[#E2E8F0] py-2.5 text-sm last:border-b-0 md:grid-cols-[160px_1fr]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">{label}</p>
    <p className="text-[#0F172A]">{value || '--'}</p>
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
    <RightDrawer
      open={open}
      onClose={onClose}
      title={drawerTitle}
      subtitle={medicine?.id ? `Mã thuốc: ${medicine.id}` : 'Chi tiết thuốc'}
      widthClass="max-w-[620px]"
      footer={(
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="nurse-btn-secondary nurse-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onDispose(medicine)}>
            Hủy thuốc
          </button>
          <button type="button" className="nurse-btn-secondary nurse-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onEdit(medicine)}>
            Chỉnh sửa
          </button>
          <button type="button" className="nurse-btn-primary nurse-focus-ring rounded-xl px-3 py-2 text-sm font-semibold" onClick={() => onStockIn(medicine)}>
            Nhập kho
          </button>
          <button type="button" className="nurse-focus-ring rounded-xl border border-[#D7ECDD] bg-[#ECFDF3] px-3 py-2 text-sm font-semibold text-[#166534]" onClick={() => onToggleStatus(medicine)}>
            Đổi trạng thái
          </button>
        </div>
      )}
    >
      <nav className="sticky top-0 z-10 mb-4 flex border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'info' ? 'border-b-2 border-[#15803D] text-[#166534]' : 'text-[#64748B]'}`}
        >
          Thông tin thuốc
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'movements' ? 'border-b-2 border-[#15803D] text-[#166534]' : 'text-[#64748B]'}`}
        >
          Lịch sử biến động
        </button>
      </nav>

      {loading ? <p className="text-sm text-[#64748B]">Đang tải chi tiết thuốc...</p> : null}
      {error ? <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{error}</p> : null}

      {!loading && !error && activeTab === 'info' && medicine ? (
        <section className="space-y-1 rounded-xl border border-[#E2E8F0] bg-[#FCFDFD] px-4 py-3">
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
    </RightDrawer>
  );
};

export default MedicineDetailDrawer;
