import React from 'react';
import { createPortal } from 'react-dom';

const toneClassMap = {
  success: 'border-success/35 bg-success-soft text-success',
  error: 'border-danger/35 bg-danger-soft text-danger',
  info: 'border-info/35 bg-info-soft text-info',
};

const StudentFeedbackToast = ({ feedback, onClose }) => {
  if (!feedback) {
    return null;
  }

  const toneClassName = toneClassMap[feedback.type] || toneClassMap.info;

  const toastNode = (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-3 sm:inset-x-auto sm:right-4 sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-[420px] rounded-lg border px-4 py-2 text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-all duration-200 ease-out ${toneClassName}`}
      >
        <div className="flex items-center justify-between gap-3">
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={onClose}
            className="student-focus-ring student-interactive rounded border border-current/30 px-1.5 py-0.5 text-xs hover:bg-white/30"
            aria-label="Đóng thông báo"
          >
            Đóng
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

export default StudentFeedbackToast;
