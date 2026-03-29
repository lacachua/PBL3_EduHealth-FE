import React from 'react';

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

  return (
    <div className={`rounded-lg border px-4 py-2 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${toneClass}`}>
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
  );
};

export default AdminFeedbackToast;