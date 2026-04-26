import React, { useMemo, useState } from 'react';
import { DISPOSE_REASON_OPTIONS } from '../../constants/nurseMedicineConstants';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  quantity: '',
  reason: 'EXPIRED',
  expiryDate: '',
  batchNumber: '',
  note: '',
};

const DisposeMedicineModal = ({ open, medicine, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);

  const modalTitle = useMemo(() => {
    if (!medicine?.name) return 'Hủy thuốc';
    return `Hủy thuốc: ${medicine.name}`;
  }, [medicine?.name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <InventoryActionModal
      open={open}
      title={modalTitle}
      subtitle="Ghi nhận số lượng thuốc cần hủy khỏi kho"
      error={error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[620px]"
      submitLabel="Xác nhận hủy"
      submitButtonClassName="app-btn-danger app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          quantity: Number(form.quantity),
          reason: form.reason,
          expiryDate: form.expiryDate || null,
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
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          />
        </label>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Số lượng hủy *</span>
          <input
            type="number"
            min={1}
            required
            value={form.quantity}
            onChange={(event) => updateField('quantity', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
            placeholder="Nhập số lượng cần hủy"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Ngày hết hạn</span>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(event) => updateField('expiryDate', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Lý do *</span>
        <select
          value={form.reason}
          onChange={(event) => updateField('reason', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
        >
          {DISPOSE_REASON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Số lô</span>
        <input
          value={form.batchNumber}
          onChange={(event) => updateField('batchNumber', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ví dụ: LOT-2026-001"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Ghi chú</span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ghi chú thêm nếu cần"
        />
      </label>
    </InventoryActionModal>
  );
};

export default DisposeMedicineModal;
