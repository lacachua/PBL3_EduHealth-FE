import React, { useState } from 'react';

const createInitial = (item) => ({
  id: item?.id || '',
  name: item?.name || '',
  status: item?.status || 'active',
});

const CatalogItemModal = ({ open, item, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(createInitial(item));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-4">
      <div className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
        <h3 className="font-headline text-lg font-semibold text-on-surface">{item ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h3>

        <form
          className="mt-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
        >
          <input value={form.id} onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))} placeholder="Mã danh mục" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm" required />
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Tên danh mục" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm" required />
          <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm">
            <option value="active">Đang dùng</option>
            <option value="review">Cần rà soát</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold text-on-surface-variant">Hủy</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Đang xử lý...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogItemModal;
