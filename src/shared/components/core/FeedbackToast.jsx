import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * @param {object}   feedback        - { type, message } | null
 * @param {function} onClose         - callback khi toast đóng (manual hoặc auto)
 * @param {number}   duration        - ms trước khi tự đóng; 0 = không tự đóng
 * @param {string}   closeAriaLabel
 * @param {string}   closeLabel
 * @param {object}   classMap        - { success, error, warning, info }
 * @param {string}   fallbackClassName
 */
const FeedbackToast = ({
  feedback,
  onClose,
  duration = 4000,
  closeAriaLabel = 'Đóng thông báo',
  closeLabel = 'Đóng',
  classMap,
  fallbackClassName,
}) => {
  // Auto-dismiss: reset timer mỗi khi feedback thay đổi
  useEffect(() => {
    if (!feedback || !duration) return undefined;

    const timerId = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timerId);
  }, [feedback, duration, onClose]);

  if (!feedback) return null;

  const toneClass = classMap?.[feedback.type] || fallbackClassName || classMap?.success || '';

  const toastNode = (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-3 sm:inset-x-auto sm:right-4 sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-[420px] rounded-lg border px-4 py-2 text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-[opacity,transform] translate-y-0 opacity-100 duration-[180ms] ${toneClass}`}
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

  if (typeof document === 'undefined') return toastNode;

  return createPortal(toastNode, document.body);
};

export default FeedbackToast;
