import React, { useMemo, useState } from 'react';
import SearchInput from '../../../shared/components/admin/SearchInput';
import { SYSTEM_LOGS_DEFAULT_FILTERS } from '../hooks/useSystemLogs';

const inputClass =
  'h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface outline-none transition-colors hover:border-outline focus:border-primary/45 focus:ring-2 focus:ring-primary/15';
const labelClass = 'mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-on-surface-variant uppercase';

const roleOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'nurse', label: 'Nhân viên y tế' },
  { value: 'student', label: 'Học sinh' },
  { value: 'system', label: 'Hệ thống' },
];

const SystemLogsFilters = ({ initialValue, onApply }) => {
  const [draft, setDraft] = useState(() => ({ ...SYSTEM_LOGS_DEFAULT_FILTERS, ...initialValue }));

  const hasActiveFilters = useMemo(() => {
    return draft.keyword
      || draft.fromDate
      || draft.toDate
      || (draft.role && draft.role !== 'all')
      || (draft.module && draft.module !== 'all')
      || (draft.action && draft.action !== 'all');
  }, [draft]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const defaultVals = SYSTEM_LOGS_DEFAULT_FILTERS;
    setDraft(defaultVals);
    onApply(defaultVals);
  };

  const removeFilter = (key) => {
    const resetToAllKeys = ['role', 'module', 'action'];
    const updated = { ...draft, [key]: resetToAllKeys.includes(key) ? 'all' : '' };
    setDraft(updated);
    onApply(updated);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="min-w-[220px] flex-1">
          <label className={labelClass}>Tìm kiếm</label>
          <SearchInput
            value={draft.keyword || ''}
            onChange={(keyword) => setDraft((p) => ({ ...p, keyword }))}
            placeholder="Nội dung, người thao tác, đối tượng..."
            inputClassName={inputClass}
          />
        </div>
        <div className="w-full md:w-[140px]">
          <label className={labelClass}>Từ ngày</label>
          <input
            type="date"
            className={inputClass}
            value={draft.fromDate || ''}
            onChange={(e) => setDraft((p) => ({ ...p, fromDate: e.target.value }))}
          />
        </div>
        <div className="w-full md:w-[140px]">
          <label className={labelClass}>Đến ngày</label>
          <input
            type="date"
            className={inputClass}
            value={draft.toDate || ''}
            onChange={(e) => setDraft((p) => ({ ...p, toDate: e.target.value }))}
          />
        </div>
        <div className="w-full md:w-[150px]">
          <label className={labelClass}>Vai trò</label>
          <select
            className={inputClass}
            value={draft.role || 'all'}
            onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 min-w-[86px] items-center justify-center whitespace-nowrap rounded-xl border border-outline-variant bg-surface px-4 text-[13px] font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="inline-flex h-11 min-w-[118px] items-center justify-center whitespace-nowrap rounded-xl bg-primary px-4 text-[13px] font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Áp dụng
          </button>
        </div>
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="mr-1 text-xs text-on-surface-muted">Đang lọc:</span>
          {draft.keyword && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-high px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              "{draft.keyword}"
              <button type="button" onClick={() => removeFilter('keyword')} className="text-on-surface-muted hover:text-on-surface-variant">×</button>
            </span>
          )}
          {draft.fromDate && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-high px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Từ: {draft.fromDate}
              <button type="button" onClick={() => removeFilter('fromDate')} className="text-on-surface-muted hover:text-on-surface-variant">×</button>
            </span>
          )}
          {draft.toDate && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-high px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Đến: {draft.toDate}
              <button type="button" onClick={() => removeFilter('toDate')} className="text-on-surface-muted hover:text-on-surface-variant">×</button>
            </span>
          )}
          {draft.role && draft.role !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-high px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Vai trò: {roleOptions.find((r) => r.value === draft.role)?.label}
              <button type="button" onClick={() => removeFilter('role')} className="text-on-surface-muted hover:text-on-surface-variant">×</button>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="ml-2 text-[11px] font-medium text-danger underline underline-offset-2 transition-colors hover:text-danger/80"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemLogsFilters;
