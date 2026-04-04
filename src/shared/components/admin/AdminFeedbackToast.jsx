import React from 'react';
import { createPortal } from 'react-dom';

const AdminFeedbackToast = ({
  feedback,
  onClose,
  closeAriaLabel = 'Đóng thông báo',
  closeLabel = 'Đóng',
  classMap,
  fallbackClassName,
}) => {
  if (!feedback) {
    return null;
  }

  const toneClass = classMap?.[feedback.type] || fallbackClassName || classMap?.success || '';
  const toastNode = (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-3 sm:inset-x-auto sm:right-4 sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-[420px] rounded-lg border px-4 py-2 text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.18)] animate-[nurseFadeSlideIn_180ms_ease-out] ${toneClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-current/30 px-1.5 py-0.5 text-xs transition hover:bg-white/30"
            aria-label={closeAriaLabel}
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return toastNode;
  }

  return createPortal(toastNode, document.body);
};

export default AdminFeedbackToast;