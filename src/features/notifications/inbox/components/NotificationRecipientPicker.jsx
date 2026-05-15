import React, { useMemo, useState } from 'react';
import { filterOptions } from '../adapters/notificationAdapters';
import { getRoleLabel } from '../constants/notificationTypes';

const NotificationRecipientPicker = ({
  label = 'Chọn người nhận',
  options = [],
  selectedIds = [],
  onToggle,
  error,
  helperText = 'Tìm theo tên, lớp hoặc vai trò',
}) => {
  const [keyword, setKeyword] = useState('');
  const selectedSet = useMemo(() => new Set(selectedIds.map((id) => Number(id))), [selectedIds]);
  const filteredOptions = useMemo(() => filterOptions(options, keyword).slice(0, 12), [keyword, options]);
  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(Number(option.userId))),
    [options, selectedSet],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="app-overline">{label}</span>
        <span className="text-xs font-medium text-on-surface-variant">{selectedIds.length} đã chọn</span>
      </div>

      <label className="relative block">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={helperText}
          className="app-focus-ring app-input h-10 w-full rounded-xl pl-10 text-sm"
        />
      </label>

      {selectedOptions.length ? (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => {
            const optionId = Number(option.id || option.userId);
            return (
              <button
                key={optionId}
                type="button"
                onClick={() => onToggle(optionId)}
                className="app-focus-ring inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                {option.fullName}
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="max-h-[280px] overflow-y-auto rounded-2xl border border-outline-variant bg-surface px-1.5 py-1.5">
        {filteredOptions.length ? filteredOptions.map((option) => {
          const optionId = Number(option.id || option.userId);
          const checked = selectedSet.has(optionId);

          return (
            <button
              key={optionId}
              type="button"
              onClick={() => onToggle(optionId)}
              className={`app-focus-ring flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                checked ? 'bg-primary-soft text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{option.fullName}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-medium text-on-surface">
                    {option.roleLabel || getRoleLabel(option.role)}
                  </span>
                  {option.className ? <span>· {option.className}</span> : null}
                </span>
              </span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                checked ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface'
              }`}>
                {checked ? <span className="material-symbols-outlined text-[15px] font-bold">check</span> : null}
              </span>
            </button>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined mb-2 text-on-surface-variant/30">search_off</span>
            <p className="px-4 text-sm text-on-surface-variant">Không tìm thấy người nhận phù hợp.</p>
          </div>
        )}
      </div>

      {error ? <p className="text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
};

export default NotificationRecipientPicker;
