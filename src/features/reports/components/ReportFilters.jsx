import React, { useState } from 'react';
import FilterBar from '../../../shared/components/admin/FilterBar';

const ReportFilters = ({ initialValue, onApply }) => {
  const [draft, setDraft] = useState(initialValue);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draft);
      }}
    >
      <FilterBar>
        <select value={draft.range} onChange={(event) => setDraft((prev) => ({ ...prev, range: event.target.value }))} className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant">
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="school-year">Năm học này</option>
        </select>

        <select value={draft.reportType} onChange={(event) => setDraft((prev) => ({ ...prev, reportType: event.target.value }))} className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant">
          <option value="all">Tất cả loại báo cáo</option>
          <option value="students">Học sinh</option>
          <option value="visits">Lượt khám</option>
          <option value="medicine-usage">Sử dụng thuốc</option>
          <option value="vaccinations">Tiêm chủng</option>
        </select>

        <select value={draft.scope} onChange={(event) => setDraft((prev) => ({ ...prev, scope: event.target.value }))} className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant">
          <option value="all">Toàn trường</option>
          <option value="khoi 1">Khối 1</option>
          <option value="khoi 2">Khối 2</option>
          <option value="khoi 3">Khối 3</option>
        </select>

        <button type="submit" className="rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-semibold text-on-surface-variant">Áp dụng</button>
      </FilterBar>
    </form>
  );
};

export default ReportFilters;
