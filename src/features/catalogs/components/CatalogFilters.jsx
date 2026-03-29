import React, { useState } from 'react';
import FilterBar from '../../../shared/components/admin/FilterBar';
import SearchInput from '../../../shared/components/admin/SearchInput';

const CatalogFilters = ({ initialValue, onApply }) => {
  const [draft, setDraft] = useState(initialValue);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draft);
      }}
    >
      <FilterBar>
        <SearchInput
          value={draft.keyword}
          onChange={(keyword) => setDraft((prev) => ({ ...prev, keyword }))}
          placeholder="Tìm theo mã danh mục, tên..."
          className="max-w-sm"
        />

        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang dùng</option>
          <option value="review">Cần rà soát</option>
        </select>

        <button type="submit" className="rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low">Áp dụng</button>
      </FilterBar>
    </form>
  );
};

export default CatalogFilters;
