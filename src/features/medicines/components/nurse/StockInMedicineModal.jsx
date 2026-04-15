import React, { useMemo, useState } from 'react';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  quantity: '',
  expiryDate: '',
  batchNumber: '',
  note: '',
};

const StockInMedicineModal = ({ open, medicine, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);

  const modalTitle = useMemo(() => {
    if (!medicine?.name) return 'Nhập kho';
    return `Nhập kho: ${medicine.name}`;
  }, [medicine?.name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <InventoryActionModal
      open={open}
      title={modalTitle}
      subtitle="Cập nhật số lượng thuốc nhập thêm vào kho"
      error={error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[620px]"
      submitLabel="Xác nhận nhập kho"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          quantity: Number(form.quantity),
          expiryDate: form.expiryDate,
          batchNumber: form.batchNumber || null,
          note: form.note || null,
        });
      }}
    >
      {medicine?.id ? (
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Mã thuốc</span>
          <input
            readOnly
            value={medicine.id}
            className="nurse-input w-full rounded-lg px-3 py-2 text-slate-900"
          />
        </label>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Số lượng nhập *</span>
          <input
            type="number"
            min={1}
            required
            value={form.quantity}
            onChange={(event) => updateField('quantity', event.target.value)}
            className="nurse-input w-full rounded-lg px-3 py-2 text-slate-900"
            placeholder="Nhập số lượng"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Hạn sử dụng *</span>
          <input
            type="date"
            required
            value={form.expiryDate}
            onChange={(event) => updateField('expiryDate', event.target.value)}
            className="nurse-input w-full rounded-lg px-3 py-2 text-slate-900"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Số lô</span>
        <input
          value={form.batchNumber}
          onChange={(event) => updateField('batchNumber', event.target.value)}
          className="nurse-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ví dụ: LOT-2026-001"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Ghi chú</span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="nurse-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ghi chú thêm nếu cần"
        />
      </label>
    </InventoryActionModal>
  );
};

export default StockInMedicineModal;
