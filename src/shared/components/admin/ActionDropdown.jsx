import React, { useEffect, useRef, useState } from 'react';

const ActionDropdown = ({ items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-surface px-2 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
        aria-label="Mở menu hành động"
      >
        <span className="material-symbols-outlined text-sm">more_horiz</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-outline-variant bg-surface-container-lowest p-1 shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-on-surface-variant hover:bg-surface-container-low"
            >
              {item.icon ? <span className="material-symbols-outlined text-sm">{item.icon}</span> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ActionDropdown;
