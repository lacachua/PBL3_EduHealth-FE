import StatusBadge from '../../../shared/components/core/StatusBadge';
import {
  MEDICINE_BATCH_STATUS_LABELS,
  MEDICINE_BATCH_STATUS_TONES,
} from '../constants/nurseMedicineConstants';

const BatchField = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">{label}</p>
    <p className="mt-0.5 break-words text-sm font-medium text-on-surface">{value ?? '--'}</p>
  </div>
);

const MedicineBatchCard = ({ batch, medicineUnit, onDispose }) => {
  const canDispose = batch.remainingQuantity > 0 && !['DEPLETED', 'DISPOSED'].includes(batch.status);
  const statusLabel = batch.statusLabel || MEDICINE_BATCH_STATUS_LABELS[batch.status] || batch.status || '--';
  const statusTone = batch.statusTone || MEDICINE_BATCH_STATUS_TONES[batch.status] || 'neutral';

  return (
    <article className="rounded-xl border border-outline-variant bg-surface p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Mã lô</p>
          <p className="text-sm font-bold text-on-surface">{batch.id || '--'}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
          {batch.isFefoPriority ? <StatusBadge tone="info">Ưu tiên xuất trước</StatusBadge> : null}
          {batch.isExpiringSoon ? <StatusBadge tone="warning">Sắp hết hạn</StatusBadge> : null}
          {batch.isExpired ? <StatusBadge tone="danger">Đã hết hạn</StatusBadge> : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3">
        <BatchField label="Số lô" value={batch.batchNumber || '--'} />
        <BatchField label="Ngày nhập" value={batch.receivedAtLabel || batch.receivedAt || '--'} />
        <BatchField label="Hạn sử dụng" value={batch.expiryDateLabel || batch.expiryDate || '--'} />
        <BatchField label="Số lượng nhập" value={`${batch.initialQuantity ?? 0} ${medicineUnit || ''}`.trim()} />
        <BatchField label="Còn lại" value={`${batch.remainingQuantity ?? 0} ${medicineUnit || ''}`.trim()} />
        <BatchField label="Ghi chú" value={batch.note || '--'} />
      </div>

      {onDispose && canDispose ? (
        <div className="mt-3 flex justify-end border-t border-outline-variant pt-3">
          <button
            type="button"
            onClick={() => onDispose(batch)}
            className="app-btn-secondary app-focus-ring rounded-lg px-3 py-1.5 text-xs font-semibold text-danger"
          >
            Hủy lô / Hủy số lượng
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default MedicineBatchCard;
