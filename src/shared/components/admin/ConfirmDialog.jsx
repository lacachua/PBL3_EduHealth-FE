import React, { useEffect } from 'react';

const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, confirmLabel = 'Xác nhận' }) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-on-surface/30" aria-label="Đóng" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-headline text-lg font-semibold text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">{message}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold text-on-surface-variant">
            Hủy
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg border border-danger/20 bg-danger-soft px-3 py-1.5 text-sm font-semibold text-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
