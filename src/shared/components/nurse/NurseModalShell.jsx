import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const NurseModalShell = ({
  open,
  title,
  subtitle,
  children,
  error,
  onClose,
  onSubmit,
  submitLabel,
  submitting,
  maxWidthClass = 'max-w-[768px]',
  submitButtonClassName = 'app-btn-primary app-focus-ring rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70',
  cancelLabel = 'Hủy',
}) => {
  const submitButtonLabel = submitting ? 'Đang xử lý...' : (submitLabel || 'Xác nhận');
  const resolvedSubmitButtonClassName = `${submitButtonClassName} inline-flex min-w-[136px] items-center justify-center text-white disabled:bg-outline-variant disabled:text-white`;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !submitting) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [onClose, open, submitting]);

  if (!open) {
    return null;
  }

  const modalNode = (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-on-surface/35"
        onClick={onClose}
        aria-label="Đóng cửa sổ"
        disabled={submitting}
      />

      <section className={`relative z-10 flex w-full ${maxWidthClass} max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-success/30 bg-white shadow-[0_24px_48px_rgba(15,23,42,0.18)] md:max-h-[calc(100dvh-2rem)]`}>
        <header className="sticky top-0 z-10 shrink-0 border-b border-success/30 bg-success-soft px-4 py-3 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-success md:text-xl">{title}</h2>
              {subtitle ? <p className="mt-0.5 text-sm text-on-surface-variant">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="app-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success/30 bg-white text-on-surface-variant hover:bg-surface-container-low"
              aria-label="Đóng"
              disabled={submitting}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        <form onSubmit={onSubmit} className="min-h-0 flex flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3 md:px-5 md:py-4">
            {error ? (
              <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
            ) : null}

            {children}
          </div>

          <footer className="sticky bottom-0 z-10 flex shrink-0 justify-end gap-2 border-t border-outline-variant bg-white px-4 py-3 md:px-5">
            <button
              type="button"
              onClick={onClose}
              className="app-btn-secondary app-focus-ring rounded-xl px-4 py-2 text-sm font-semibold"
              disabled={submitting}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className={resolvedSubmitButtonClassName}
              disabled={submitting}
            >
              {submitButtonLabel}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );

  if (typeof document === 'undefined') {
    return modalNode;
  }

  return createPortal(modalNode, document.body);
};

export default NurseModalShell;
