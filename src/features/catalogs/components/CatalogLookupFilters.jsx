import React, { useEffect, useState } from 'react';
import FilterBar from '../../../shared/components/admin/FilterBar';
import SearchInput from '../../../shared/components/admin/SearchInput';
import { CATALOG_STATUS_OPTIONS } from '../schemas/catalogManagementSchema';

const CatalogLookupFilters = ({ initialValue, onApply, onReset }) => {
  const [draft, setDraft] = useState(initialValue);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

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
          placeholder="Tìm theo mã hoặc tên danh mục..."
          className="max-w-sm"
        />

        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
        >
          {CATALOG_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
        >
          Áp dụng
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-outline-variant/70 bg-transparent px-3.5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
        >
          Đặt lại
        </button>
      </FilterBar>
    </form>
  );
};

export default CatalogLookupFilters;
