import React, { useEffect, useState } from 'react';

const FIELD_CLASS_NAME = 'w-full rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10';

const AdminReportFilters = ({ filters, options, onApply, onReset }) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const updateDraft = (field, value) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  return (
    <form onSubmit={applyFilters} className="min-w-0 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="space-y-1.5 xl:col-span-3">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Lớp học</label>
          <select className={FIELD_CLASS_NAME} value={draft.classId} onChange={(event) => updateDraft('classId', event.target.value)}>
            {(options.classOptions || []).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>

        <div className="space-y-1.5 xl:col-span-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Từ ngày</label>
          <input className={FIELD_CLASS_NAME} type="date" value={draft.fromDate || ''} onChange={(event) => updateDraft('fromDate', event.target.value)} />
        </div>

        <div className="space-y-1.5 xl:col-span-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Đến ngày</label>
          <input className={FIELD_CLASS_NAME} type="date" value={draft.toDate || ''} onChange={(event) => updateDraft('toDate', event.target.value)} />
        </div>

        <div className="space-y-1.5 xl:col-span-3">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Ngưỡng rủi ro</label>
          <select className={FIELD_CLASS_NAME} value={draft.riskThreshold} onChange={(event) => updateDraft('riskThreshold', event.target.value)}>
            {(options.riskThresholds || []).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="space-y-1.5 xl:col-span-2">
          <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Loại báo cáo</label>
          <select className={FIELD_CLASS_NAME} value={draft.reportType} onChange={(event) => updateDraft('reportType', event.target.value)}>
            {(options.reportTypes || []).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {options.supportsGradeScope ? (
          <div className="space-y-1.5 xl:col-span-3">
            <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-muted">Khối</label>
            <select className={FIELD_CLASS_NAME} value={draft.gradeScope} onChange={(event) => updateDraft('gradeScope', event.target.value)}>
              {(options.gradeScopes || []).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        ) : null}

        <div className="flex items-end justify-end gap-2 md:col-span-2 xl:col-span-12">
          <button type="button" onClick={onReset} className="rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high">
            Đặt lại
          </button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover">
            Áp dụng
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminReportFilters;
