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
      className="w-full"
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
          className="w-full md:min-w-[300px] md:flex-1 lg:max-w-[420px]"
        />

        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface-variant outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/15 md:w-[200px]"
        >
          {CATALOG_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary px-3.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover md:w-auto"
        >
          Áp dụng
        </button>

        <button
          type="button"
          onClick={() => {
            setDraft({ keyword: '', status: 'all' });
            onReset();
          }}
          className="h-11 w-full rounded-xl border border-outline-variant bg-surface px-3.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low md:w-auto"
        >
          Đặt lại
        </button>
      </FilterBar>
    </form>
  );
};

export default CatalogLookupFilters;
