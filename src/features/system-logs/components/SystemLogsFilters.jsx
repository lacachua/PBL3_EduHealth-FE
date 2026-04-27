import { useMemo, useState } from 'react';
import SearchInput from '../../../shared/components/core/SearchInput';
import { SYSTEM_LOGS_DEFAULT_FILTERS } from '../hooks/useSystemLogs';

const roleOptions = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'nurse', label: 'Nhân viên y tế' },
  { value: 'student', label: 'Học sinh' },
  { value: 'system', label: 'Hệ thống' },
];

const controlClass = 'app-input app-focus-ring w-full text-[13px]';

const SystemLogsFilters = ({ initialValue, onApply, onReset }) => {
  const [draft, setDraft] = useState(() => ({ ...SYSTEM_LOGS_DEFAULT_FILTERS, ...initialValue }));

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      draft.keyword
      || draft.fromDate
      || draft.toDate
      || (draft.role && draft.role !== 'all')
    );
  }, [draft.keyword, draft.fromDate, draft.toDate, draft.role]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const defaultVals = SYSTEM_LOGS_DEFAULT_FILTERS;
    setDraft(defaultVals);
    onReset?.();
  };

  const removeFilter = (key) => {
    const updated = { ...draft, [key]: key === 'role' ? 'all' : '' };
    setDraft(updated);
    onApply(updated);
  };

  return (
    <div className="app-filter-toolbar space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2.5 xl:flex-nowrap">
        <SearchInput
          value={draft.keyword || ''}
          onChange={(keyword) => setDraft((p) => ({ ...p, keyword }))}
          placeholder="Nội dung, người thao tác, đối tượng..."
          className="w-full flex-1 min-w-[220px]"
          inputClassName={controlClass}
        />

        <input
          type="date"
          className={`shrink-0 w-full sm:w-[148px] ${controlClass}`}
          value={draft.fromDate || ''}
          onChange={(e) => setDraft((p) => ({ ...p, fromDate: e.target.value }))}
          aria-label="Từ ngày"
        />

        <input
          type="date"
          className={`shrink-0 w-full sm:w-[148px] ${controlClass}`}
          value={draft.toDate || ''}
          onChange={(e) => setDraft((p) => ({ ...p, toDate: e.target.value }))}
          aria-label="Đến ngày"
        />

        <select
          className={`shrink-0 w-full sm:w-[160px] ${controlClass}`}
          value={draft.role || 'all'}
          onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="submit"
            className="app-btn-primary app-focus-ring inline-flex px-3.5"
          >
            Lọc
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="app-btn-secondary app-focus-ring inline-flex px-3.5"
          >
            Đặt lại
          </button>
        </div>
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-on-surface-muted">Đang lọc:</span>
          {draft.keyword && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              "{draft.keyword}"
              <button type="button" onClick={() => removeFilter('keyword')} className="text-on-surface-muted hover:text-on-surface">×</button>
            </span>
          )}
          {draft.fromDate && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Từ: {draft.fromDate}
              <button type="button" onClick={() => removeFilter('fromDate')} className="text-on-surface-muted hover:text-on-surface">×</button>
            </span>
          )}
          {draft.toDate && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Đến: {draft.toDate}
              <button type="button" onClick={() => removeFilter('toDate')} className="text-on-surface-muted hover:text-on-surface">×</button>
            </span>
          )}
          {draft.role && draft.role !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container-low px-2 py-1 text-[11px] font-medium text-on-surface-variant">
              Vai trò: {roleOptions.find((r) => r.value === draft.role)?.label}
              <button type="button" onClick={() => removeFilter('role')} className="text-on-surface-muted hover:text-on-surface">×</button>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="ml-1 text-[11px] font-medium text-danger underline underline-offset-2 hover:text-danger/80"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemLogsFilters;
