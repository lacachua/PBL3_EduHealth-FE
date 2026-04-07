import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const AdminFeedbackToast = ({
  feedback,
  onClose,
  closeAriaLabel = 'Đóng thông báo',
  closeLabel = 'Đóng',
  classMap,
  fallbackClassName,
}) => {
  const [renderedFeedback, setRenderedFeedback] = useState(feedback);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (feedback) {
      setRenderedFeedback(feedback);
      setIsClosing(false);
      return undefined;
    }

    if (!renderedFeedback) {
      return undefined;
    }

    setIsClosing(true);
    const timer = window.setTimeout(() => {
      setRenderedFeedback(null);
      setIsClosing(false);
    }, 140);

    return () => window.clearTimeout(timer);
  }, [feedback, renderedFeedback]);

  if (!renderedFeedback) {
    return null;
  }

  const toneClass = classMap?.[renderedFeedback.type] || fallbackClassName || classMap?.success || '';
  const toastNode = (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-3 sm:inset-x-auto sm:right-4 sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-full max-w-[420px] rounded-lg border px-4 py-2 text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-[opacity,transform] ${isClosing ? 'translate-y-1 opacity-0 duration-[140ms]' : 'translate-y-0 opacity-100 duration-[180ms]'} ${toneClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <span>{renderedFeedback.message}</span>
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