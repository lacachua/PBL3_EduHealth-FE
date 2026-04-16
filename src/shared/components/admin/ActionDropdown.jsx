import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const EDGE_OFFSET = 8;

const ActionDropdown = ({ items, menuWidth = 176 }) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = useCallback((menuHeight) => {
    if (!triggerRef.current || typeof window === 'undefined') {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const effectiveMenuHeight = Math.max(menuHeight || 0, 124, items.length * 34 + 12);

    const left = Math.min(
      Math.max(EDGE_OFFSET, rect.right - menuWidth),
      window.innerWidth - menuWidth - EDGE_OFFSET
    );

    const shouldOpenUpward =
      rect.bottom + effectiveMenuHeight + EDGE_OFFSET > window.innerHeight
      && rect.top - effectiveMenuHeight - 4 > EDGE_OFFSET;

    const top = shouldOpenUpward
      ? rect.top - effectiveMenuHeight - 4
      : rect.bottom + 4;

    setMenuPosition({ top, left });
  }, [items.length, menuWidth]);

  useEffect(() => {
    const handleOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);
      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    updateMenuPosition();
    const animationFrame = window.requestAnimationFrame(() => {
      const measuredHeight = menuRef.current?.offsetHeight || 0;
      if (measuredHeight) {
        updateMenuPosition(measuredHeight);
      }
    });

    const handleWindowChange = () => updateMenuPosition();

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [open, updateMenuPosition]);

  return (
    <div ref={triggerRef} className="inline-flex">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="app-focus-ring app-btn-secondary gap-1 px-2.5 text-[12px]"
        aria-label="Mở menu hành động"
        aria-expanded={open}
      >
        <span className="material-symbols-outlined text-sm">more_horiz</span>
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              zIndex: 80,
              width: menuWidth,
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="origin-top-right rounded-lg border border-outline-variant bg-surface-container-lowest p-1 shadow-[0_8px_20px_rgba(15,23,42,0.14)] animate-[appFadeSlideIn_180ms_ease-out]"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className="app-focus-ring flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-on-surface-variant transition-[background-color,color] duration-150 ease-out hover:bg-surface-container-low focus-visible:bg-surface-container-low"
              >
                {item.icon ? <span className="material-symbols-outlined text-sm">{item.icon}</span> : null}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )
        : null}
    </div>
  );
};

export default ActionDropdown;
