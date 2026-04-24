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
          {selectedOptions.map((option) => (
            <button
              key={option.userId}
              type="button"
              onClick={() => onToggle(option.userId)}
              className="app-focus-ring inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {option.fullName}
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="max-h-[220px] overflow-y-auto rounded-2xl border border-outline-variant bg-surface px-2 py-2">
        {filteredOptions.length ? filteredOptions.map((option) => {
          const checked = selectedSet.has(Number(option.userId));

          return (
            <button
              key={option.userId}
              type="button"
              onClick={() => onToggle(option.userId)}
              className={`app-focus-ring flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition ${
                checked ? 'bg-primary-soft text-primary' : 'hover:bg-surface-container-low'
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{option.fullName}</span>
                <span className="mt-0.5 block text-xs text-on-surface-variant">
                  {getRoleLabel(option.role)}{option.className ? ` · ${option.className}` : ''}
                </span>
              </span>
              <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                checked ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface'
              }`}>
                {checked ? <span className="material-symbols-outlined text-[15px]">check</span> : null}
              </span>
            </button>
          );
        }) : (
          <p className="px-2 py-3 text-sm text-on-surface-variant">Không tìm thấy người nhận phù hợp.</p>
        )}
      </div>

      {error ? <p className="text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
};

export default NotificationRecipientPicker;
