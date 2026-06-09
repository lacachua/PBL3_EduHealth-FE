import { useMemo, useState } from 'react';
import { getTomorrowDateInputValue, isFutureDateOnly } from '../../utils/medicineFormValidation';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  quantity: '',
  expiryDate: '',
  batchNumber: '',
  note: '',
};

const StockInMedicineModal = ({ open, medicine, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

  const modalTitle = useMemo(() => (
    medicine?.name ? `Nhập thêm lô: ${medicine.name}` : 'Nhập thêm lô'
  ), [medicine?.name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError('');

    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setValidationError('Số lượng nhập phải lớn hơn 0.');
      return;
    }
    if (!isFutureDateOnly(form.expiryDate)) {
      setValidationError('Hạn sử dụng phải lớn hơn ngày hiện tại.');
      return;
    }

    onSubmit({
      quantity,
      expiryDate: form.expiryDate,
      batchNumber: form.batchNumber.trim() || null,
      note: form.note.trim() || null,
    });
  };

  return (
    <InventoryActionModal
      open={open}
      title={modalTitle}
      subtitle="Tạo một lô nhập mới cho thuốc"
      error={validationError || error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[620px]"
      submitLabel="Xác nhận nhập lô"
      onSubmit={handleSubmit}
    >
      {medicine?.id ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm">
          <p className="font-semibold text-on-surface">{medicine.name}</p>
          <p className="text-xs text-on-surface-variant">Mã thuốc: {medicine.id}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Số lượng nhập *</span>
          <input
            type="number"
            min={1}
            required
            value={form.quantity}
            onChange={(event) => updateField('quantity', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Hạn sử dụng *</span>
          <input
            type="date"
            min={getTomorrowDateInputValue()}
            required
            value={form.expiryDate}
            onChange={(event) => updateField('expiryDate', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Số lô</span>
        <input
          value={form.batchNumber}
          onChange={(event) => updateField('batchNumber', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          placeholder="Ví dụ: VITC-0827"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Ghi chú</span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
        />
      </label>
    </InventoryActionModal>
  );
};

export default StockInMedicineModal;
