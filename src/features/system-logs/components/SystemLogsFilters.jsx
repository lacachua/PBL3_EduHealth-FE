import React, { useMemo, useState } from 'react';

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600';
const labelClass = 'mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase';

const roleOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'nurse', label: 'Nhân viên y tế' },
  { value: 'student', label: 'Học sinh' },
  { value: 'system', label: 'Hệ thống' },
];

const SystemLogsFilters = ({ initialValue, onApply }) => {
  const [draft, setDraft] = useState(initialValue);

  const hasActiveFilters = useMemo(() => {
    return draft.keyword || draft.fromDate || draft.toDate || (draft.role && draft.role !== 'all');
  }, [draft]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const defaultVals = { keyword: '', fromDate: '', toDate: '', role: 'all' };
    setDraft(defaultVals);
    onApply(defaultVals);
  };

  const removeFilter = (key) => {
    const updated = { ...draft, [key]: key === 'role' ? 'all' : '' };
    setDraft(updated);
    onApply(updated);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>Tìm kiếm</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Nội dung, người dùng..."
            value={draft.keyword || ''}
            onChange={(e) => setDraft((p) => ({ ...p, keyword: e.target.value }))}
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
        <div className="flex-shrink-0">
           <button
             type="submit"
             className="inline-flex h-[34px] w-full items-center justify-center rounded-md bg-emerald-800 px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900"
           >
             Áp dụng
           </button>
        </div>
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 mr-1">Đang lọc:</span>
          {draft.keyword && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
              "{draft.keyword}"
              <button type="button" onClick={() => removeFilter('keyword')} className="text-slate-400 hover:text-slate-600">×</button>
            </span>
          )}
          {draft.fromDate && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
              Từ: {draft.fromDate}
              <button type="button" onClick={() => removeFilter('fromDate')} className="text-slate-400 hover:text-slate-600">×</button>
            </span>
          )}
          {draft.toDate && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
              Đến: {draft.toDate}
              <button type="button" onClick={() => removeFilter('toDate')} className="text-slate-400 hover:text-slate-600">×</button>
            </span>
          )}
          {draft.role && draft.role !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
              Vai trò: {roleOptions.find((r) => r.value === draft.role)?.label}
              <button type="button" onClick={() => removeFilter('role')} className="text-slate-400 hover:text-slate-600">×</button>
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="ml-2 text-[11px] font-medium text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemLogsFilters;
