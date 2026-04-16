import React, { useState } from 'react';
import { MEDICINE_UNIT_OPTIONS } from '../../constants/nurseMedicineConstants';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  name: '',
  activeIngredient: '',
  unit: 'VIEN',
  packaging: '',
  warningThreshold: 1,
  note: '',
};

const CreateMedicineModal = ({ open, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <InventoryActionModal
      open={open}
      title="Thêm thuốc mới"
      subtitle="Nhập thông tin thuốc để thêm vào danh mục kho"
      error={error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[700px]"
      submitLabel="Thêm thuốc"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name: form.name,
          activeIngredient: form.activeIngredient || null,
          unit: form.unit,
          packaging: form.packaging || null,
          warningThreshold: Number(form.warningThreshold),
          note: form.note || null,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Tên thuốc *</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
            placeholder="Ví dụ: Paracetamol 500mg"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Hoạt chất</span>
          <input
            value={form.activeIngredient}
            onChange={(event) => updateField('activeIngredient', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
            placeholder="Ví dụ: Acetaminophen"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Đơn vị *</span>
          <select
            value={form.unit}
            onChange={(event) => updateField('unit', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          >
            {MEDICINE_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Mức cảnh báo *</span>
          <input
            type="number"
            min={1}
            required
            value={form.warningThreshold}
            onChange={(event) => updateField('warningThreshold', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
            placeholder="Ví dụ: 30"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Quy cách</span>
        <input
          value={form.packaging}
          onChange={(event) => updateField('packaging', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ví dụ: Hộp 10 vỉ x 10 viên"
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

export default CreateMedicineModal;
