import React, { useMemo, useState } from 'react';
import InventoryActionModal from './InventoryActionModal';

const UpdateMedicineStatusModal = ({ open, medicine, onClose, onSubmit, submitting, error }) => {
  const [status, setStatus] = useState(medicine?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
  const [reason, setReason] = useState('');

  const modalTitle = useMemo(() => {
    if (!medicine?.name) return 'Cập nhật trạng thái thuốc';
    return `Cập nhật trạng thái: ${medicine.name}`;
  }, [medicine?.name]);

  return (
    <InventoryActionModal
      open={open}
      title={modalTitle}
      subtitle="Thay đổi trạng thái sử dụng của thuốc"
      error={error}
      onClose={onClose}
      submitting={submitting}
      maxWidthClass="max-w-[580px]"
      submitLabel="Cập nhật trạng thái"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          status,
          reason: reason || null,
        });
      }}
    >
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Trạng thái mới *</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
        >
          <option value="ACTIVE">Đang sử dụng</option>
          <option value="INACTIVE">Ngưng sử dụng</option>
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">Lý do</span>
        <textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="app-input w-full rounded-lg px-3 py-2 text-slate-900"
          placeholder="Ví dụ: Tạm ngưng do không còn nhu cầu"
        />
      </label>
    </InventoryActionModal>
  );
};

export default UpdateMedicineStatusModal;
