import React from 'react';

const ReadonlyField = ({
  label,
  value,
  helper,
  showReadonlyBadge = true,
  showLockIcon = false,
}) => {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
        <div className="flex items-center gap-1.5 text-on-surface-muted">
          {showLockIcon ? <span className="material-symbols-outlined text-[14px]">lock</span> : null}
          {showReadonlyBadge ? (
            <span className="rounded-md border border-[var(--color-field-readonly-border)] bg-[var(--color-field-readonly-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.02em] text-on-surface-muted">
              Chỉ xem
            </span>
          ) : null}
        </div>
      </div>
      <div className="rounded-lg border border-[var(--color-field-readonly-border)] bg-[var(--color-field-readonly-bg)] px-3 py-2 text-sm text-on-surface">
        {value || '--'}
      </div>
      {helper ? <p className="mt-1 text-xs text-on-surface-muted">{helper}</p> : null}
    </div>
  );
};

export default ReadonlyField;
