import React, { useEffect, useRef, useState } from 'react';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';

const toneClassMap = {
  default: 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
  danger: 'text-danger hover:bg-danger-soft',
  warning: 'text-warning hover:bg-warning-soft',
  success: 'text-success hover:bg-success-soft',
};

const AccountActionMenu = ({ items }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`app-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-surface transition-[background-color,border-color,color,box-shadow] hover:bg-surface-container-low hover:text-on-surface ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.mutedText}`}
        aria-label="Mở menu thao tác"
      >
        <span className="material-symbols-outlined text-[18px]">more_vert</span>
      </button>

      {open ? (
        <div className={`absolute right-0 top-9 z-30 min-w-[182px] rounded-lg border bg-surface p-1.5 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.55)] ${ACCOUNT_BASE_CLASS.border}`}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={`app-focus-ring flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] font-semibold transition ${toneClassMap[item.tone || 'default'] || toneClassMap.default}`}
            >
              {item.icon ? (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-surface-container-low text-[15px]">
                  <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                </span>
              ) : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AccountActionMenu;
