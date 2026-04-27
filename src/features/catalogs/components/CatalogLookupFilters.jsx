import { useEffect, useState } from 'react';
import FilterBar from '../../../shared/components/admin/FilterBar';
import SearchInput from '../../../shared/components/core/SearchInput';
import { CATALOG_STATUS_OPTIONS } from '../constants/catalogConstants';

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
          className="app-input app-focus-ring h-10 w-full rounded-xl px-3 md:w-[200px]"
        >
          {CATALOG_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="app-focus-ring app-btn-primary w-full px-3.5 md:w-auto"
        >
          Lọc
        </button>

        <button
          type="button"
          onClick={() => {
            setDraft({ keyword: '', status: 'all' });
            onReset();
          }}
          className="app-focus-ring app-btn-secondary w-full px-3.5 md:w-auto"
        >
          Đặt lại
        </button>
      </FilterBar>
    </form>
  );
};

export default CatalogLookupFilters;
