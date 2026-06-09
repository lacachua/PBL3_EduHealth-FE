import { useMemo, useState } from 'react';
import { DISPOSE_REASON_OPTIONS } from '../../constants/nurseMedicineConstants';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  quantity: '',
  reason: 'DAMAGED',
  note: '',
  confirmed: false,
};

const DisposeMedicineModal = ({ open, medicine, batch, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

  const modalTitle = useMemo(() => (
    medicine?.name ? `Hủy lô: ${medicine.name}` : 'Hủy lô / Hủy số lượng'
  ), [medicine?.name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError('');

    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setValidationError('Số lượng hủy phải lớn hơn 0.');
      return;
    }
    if (quantity > Number(batch?.remainingQuantity || 0)) {
      setValidationError('Số lượng hủy không được vượt quá số lượng còn lại của lô.');
      return;
    }
    if (!form.reason) {
      setValidationError('Vui lòng chọn lý do hủy.');
      return;
    }
    if (!form.confirmed) {
      setValidationError('Vui lòng xác nhận trước khi thực hiện hủy lô.');
      return;
    }

    onSubmit({
      batchId: batch.id,
      quantity,
      reason: form.reason,
      note: form.note.trim() || null,
    });
  };

  return (
    <InventoryActionModal
      open={open}
      title={modalTitle}
      subtitle="Thao tác sẽ được ghi nhận vào lịch sử kho"
      error={validationError || error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[620px]"
      submitLabel="Xác nhận hủy"
      submitButtonClassName="app-btn-danger app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-2 rounded-xl border border-danger/20 bg-danger-soft p-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Thuốc</p>
          <p className="font-bold text-on-surface">{medicine?.name || '--'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Mã lô</p>
          <p className="font-bold text-on-surface">{batch?.id || '--'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Số lô</p>
          <p className="font-medium text-on-surface">{batch?.batchNumber || '--'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Số lượng còn lại</p>
          <p className="font-bold text-on-surface">{batch?.remainingQuantity ?? 0} {medicine?.unitLabel || ''}</p>
        </div>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Số lượng hủy *</span>
        <input
          type="number"
          min={1}
          max={batch?.remainingQuantity || undefined}
          required
          value={form.quantity}
          onChange={(event) => updateField('quantity', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Lý do *</span>
        <select
          required
          value={form.reason}
          onChange={(event) => updateField('reason', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
        >
          {DISPOSE_REASON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Ghi chú</span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          placeholder="Ví dụ: Bao bì bị hỏng"
        />
      </label>

      <label className="flex items-start gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={form.confirmed}
          onChange={(event) => updateField('confirmed', event.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        <span className="text-on-surface">Tôi xác nhận hủy số lượng đã nhập khỏi lô này.</span>
      </label>
    </InventoryActionModal>
  );
};

export default DisposeMedicineModal;
