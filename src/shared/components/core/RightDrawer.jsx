import React, { useEffect } from 'react';

const RightDrawer = ({
  open,
  title,
  subtitle,
  widthClass = 'max-w-[560px]',
  panelAnimationClass = 'animate-[appSlideInRight_190ms_ease-out]',
  onClose,
  children,
  footer,
  headerActions,
  panelClassName = '',
  headerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  closeButtonClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Đóng panel"
        className="absolute inset-0 bg-on-surface/32 animate-[appFadeIn_180ms_ease-out]"
        onClick={onClose}
      />

      <aside className={`absolute inset-y-0 right-0 flex w-full ${widthClass} ${panelAnimationClass} flex-col border-l border-outline-variant bg-surface-container-lowest shadow-[-14px_0_30px_rgba(15,23,42,0.17)] ${panelClassName}`}>
        <header className={`shrink-0 border-b border-outline-variant bg-surface-container-low px-4 py-3 md:px-5 ${headerClassName}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`font-headline text-lg font-semibold text-on-surface md:text-[1.18rem] ${titleClassName}`}>{title}</h2>
              {subtitle ? <p className={`mt-1 text-sm text-on-surface-variant ${subtitleClassName}`}>{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              <button
                type="button"
                onClick={onClose}
                className={`app-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:bg-surface-container-low ${closeButtonClassName}`}
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </header>

        <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-3 md:px-5 md:py-4 ${bodyClassName}`}>{children}</div>

        {footer ? (
          <footer className={`shrink-0 border-t border-outline-variant bg-surface-container-lowest px-4 py-3 md:px-5 ${footerClassName}`}>
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>
  );
};

export default RightDrawer;
