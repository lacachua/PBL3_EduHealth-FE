import Pagination from '../../../shared/components/core/Pagination';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import MedicineMovementsTable from './MedicineMovementsTable';
import MedicineBatchCard from './MedicineBatchCard';

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-outline-variant py-2.5 last:border-b-0">
    <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">{label}</p>
    <p className="text-sm text-on-surface">{value || '--'}</p>
  </div>
);

const MedicineDetailDrawer = ({
  open,
  medicine,
  loading,
  error,
  movementsData,
  movementsLoading,
  movementsError,
  onClose,
  onMovementPageChange,
}) => (
  <RightDrawer
    open={open}
    onClose={onClose}
    title="Chi tiết thuốc"
    subtitle={medicine ? `ID: ${medicine.id}` : 'Đang tải dữ liệu'}
    widthClass="max-w-[760px]"
    footer={(
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg border border-outline-variant px-3.5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface">Đóng</button>
      </div>
    )}
  >
    {loading ? <p className="text-sm text-on-surface-variant">Đang tải chi tiết thuốc...</p> : null}
    {error ? <p className="rounded-lg border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p> : null}

    {!loading && medicine ? (
      <div className="space-y-4">
        <div className="space-y-1">
          <DetailRow label="Tên thuốc" value={medicine.name} />
          <DetailRow label="Hoạt chất" value={medicine.activeIngredient} />
          <DetailRow label="Đơn vị" value={medicine.unit} />
          <DetailRow label="Quy cách" value={medicine.packaging} />
          <DetailRow label="Mức cảnh báo" value={medicine.warningThreshold} />
          <DetailRow label="Tồn kho" value={medicine.currentStock} />
          <DetailRow label="Hạn gần nhất" value={medicine.nearestExpiryDate} />
          <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-outline-variant py-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">Trạng thái</p>
            <div><StatusBadge tone={medicine.statusTone}>{medicine.statusLabel}</StatusBadge></div>
          </div>
          <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-outline-variant py-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">Cảnh báo hiện tại</p>
            <div><StatusBadge tone={medicine.alertTone}>{medicine.alertLabel}</StatusBadge></div>
          </div>
          <DetailRow label="Ghi chú" value={medicine.note} />
          <DetailRow label="Ngày tạo" value={medicine.createdAt} />
          <DetailRow label="Cập nhật" value={medicine.updatedAt} />
        </div>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-on-surface">Lô nhập</h3>
          <div className="space-y-3">
            {medicine.batches?.length ? medicine.batches.map((batch) => (
              <MedicineBatchCard key={batch.id} batch={batch} medicineUnit={medicine.unit} />
            )) : (
              <p className="rounded-xl border border-dashed border-outline-variant px-4 py-5 text-center text-sm text-on-surface-variant">
                Thuốc chưa có lô nhập.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-on-surface">Lịch sử biến động kho</h3>
          {movementsLoading ? <p className="text-sm text-on-surface-variant">Đang tải biến động kho...</p> : null}
          {movementsError ? <p className="rounded-lg border border-warning/25 bg-warning-soft px-3 py-2 text-sm text-warning">{movementsError}</p> : null}
          {!movementsLoading ? <MedicineMovementsTable rows={movementsData.rows} /> : null}
          {movementsData.totalPages > 1 ? (
            <Pagination
              page={movementsData.page}
              pageSize={movementsData.pageSize}
              totalItems={movementsData.totalItems}
              totalPages={movementsData.totalPages}
              onPageChange={onMovementPageChange}
            />
          ) : null}
        </section>
      </div>
    ) : null}
  </RightDrawer>
);

export default MedicineDetailDrawer;
