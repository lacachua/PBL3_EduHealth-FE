import React, { useEffect, useRef, useState } from 'react';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';

const toneClassMap = {
  default: ACCOUNT_BASE_CLASS.bodyText,
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
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border bg-surface-container-lowest transition hover:bg-surface-container-low ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.mutedText} hover:text-on-surface-variant`}
        aria-label="Mở menu thao tác"
      >
        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
      </button>

      {open ? (
        <div className={`absolute right-0 top-9 z-30 min-w-[170px] rounded-md border bg-surface-container-lowest p-1 shadow-[0_8px_18px_rgba(15,23,42,0.1)] ${ACCOUNT_BASE_CLASS.border}`}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs font-medium transition ${toneClassMap[item.tone || 'default'] || toneClassMap.default} ${!item.tone ? 'hover:bg-surface-container-low' : ''}`}
            >
              {item.icon ? <span className="material-symbols-outlined text-[16px]">{item.icon}</span> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AccountActionMenu;
