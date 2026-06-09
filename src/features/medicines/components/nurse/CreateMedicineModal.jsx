import { useState } from 'react';
import { MEDICINE_UNIT_OPTIONS } from '../../constants/nurseMedicineConstants';
import {
  getTomorrowDateInputValue,
  hasInitialBatchData,
  isFutureDateOnly,
} from '../../utils/medicineFormValidation';
import InventoryActionModal from './InventoryActionModal';

const INITIAL_FORM = {
  name: '',
  activeIngredient: '',
  unit: 'VIEN',
  packaging: '',
  warningThreshold: 1,
  note: '',
  initialQuantity: '',
  expiryDate: '',
  batchNumber: '',
};

const CreateMedicineModal = ({ open, onClose, onSubmit, submitting, error }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError('');

    const warningThreshold = Number(form.warningThreshold);
    if (!Number.isFinite(warningThreshold) || warningThreshold <= 0) {
      setValidationError('Mức cảnh báo phải lớn hơn 0.');
      return;
    }

    const includeInitialBatch = hasInitialBatchData(form);
    const initialQuantity = Number(form.initialQuantity);
    if (includeInitialBatch && (!Number.isFinite(initialQuantity) || initialQuantity <= 0)) {
      setValidationError('Số lượng lô đầu tiên phải lớn hơn 0.');
      return;
    }
    if (includeInitialBatch && !isFutureDateOnly(form.expiryDate)) {
      setValidationError('Hạn sử dụng lô đầu tiên phải lớn hơn ngày hiện tại.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      activeIngredient: form.activeIngredient.trim() || null,
      unit: form.unit,
      packaging: form.packaging.trim() || null,
      warningThreshold,
      note: form.note.trim() || null,
    };

    if (includeInitialBatch) {
      payload.initialQuantity = initialQuantity;
      payload.expiryDate = form.expiryDate;
      payload.batchNumber = form.batchNumber.trim() || null;
    }

    onSubmit(payload);
  };

  return (
    <InventoryActionModal
      open={open}
      title="Thêm thuốc mới"
      subtitle="Tạo thông tin thuốc và có thể nhập lô đầu tiên"
      error={validationError || error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[700px]"
      submitLabel="Thêm thuốc"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Tên thuốc *</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
            placeholder="Ví dụ: Paracetamol 500mg"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Hoạt chất</span>
          <input
            value={form.activeIngredient}
            onChange={(event) => updateField('activeIngredient', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
            placeholder="Ví dụ: Acetaminophen"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Đơn vị *</span>
          <select
            required
            value={form.unit}
            onChange={(event) => updateField('unit', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          >
            {MEDICINE_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-on-surface-variant">Mức cảnh báo *</span>
          <input
            type="number"
            min={1}
            required
            value={form.warningThreshold}
            onChange={(event) => updateField('warningThreshold', event.target.value)}
            className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Quy cách</span>
        <input
          value={form.packaging}
          onChange={(event) => updateField('packaging', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
          placeholder="Ví dụ: Hộp 10 vỉ x 10 viên"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-on-surface-variant">Ghi chú thuốc</span>
        <textarea
          rows={2}
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
        />
      </label>

      <section className="space-y-3 rounded-xl border border-outline-variant bg-surface-container-low p-3">
        <div>
          <h4 className="text-sm font-bold text-on-surface">Lô nhập đầu tiên (tùy chọn)</h4>
          <p className="mt-0.5 text-xs text-on-surface-variant">Để trống cả nhóm nếu chỉ muốn tạo thông tin thuốc.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-on-surface-variant">Số lượng nhập</span>
            <input
              type="number"
              min={1}
              value={form.initialQuantity}
              onChange={(event) => updateField('initialQuantity', event.target.value)}
              className="app-input w-full rounded-lg px-3 py-2 text-on-surface"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-on-surface-variant">Hạn sử dụng</span>
            <input
              type="date"
              min={getTomorrowDateInputValue()}
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
            placeholder="Ví dụ: VITC-0627"
          />
        </label>
      </section>
    </InventoryActionModal>
  );
};

export default CreateMedicineModal;
