import React, { useState } from 'react';
import FilterBar from '../../../shared/components/admin/FilterBar';
import SearchInput from '../../../shared/components/admin/SearchInput';

const selectClassName = 'rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-sm text-on-surface-variant outline-none';

const selectFields = [
  {
    key: 'module',
    options: [
      { value: 'all', label: 'Tất cả module' },
      { value: 'students', label: 'Học sinh' },
      { value: 'users', label: 'Người dùng' },
      { value: 'catalogs', label: 'Danh mục' },
      { value: 'reports', label: 'Báo cáo' },
      { value: 'vaccinations', label: 'Tiêm chủng' },
      { value: 'integration', label: 'Tích hợp' },
    ],
  },
  {
    key: 'action',
    options: [
      { value: 'all', label: 'Tất cả hành động' },
      { value: 'create', label: 'Tạo mới' },
      { value: 'update', label: 'Cập nhật' },
      { value: 'delete', label: 'Xóa' },
      { value: 'export', label: 'Xuất báo cáo' },
      { value: 'sync', label: 'Đồng bộ' },
    ],
  },
  {
    key: 'timeRange',
    options: [
      { value: 'all', label: 'Toàn thời gian' },
      { value: 'today', label: 'Hôm nay' },
      { value: '7d', label: '7 ngày gần đây' },
      { value: '30d', label: '30 ngày gần đây' },
    ],
  },
];

const SystemLogsFilters = ({ initialValue, onApply }) => {
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
          placeholder="Tìm theo nội dung log..."
          className="max-w-sm"
        />

        <SearchInput
          value={draft.actor}
          onChange={(actor) => setDraft((prev) => ({ ...prev, actor }))}
          placeholder="Người thao tác"
          className="max-w-xs"
        />

        {selectFields.map((field) => (
          <select
            key={field.key}
            value={draft[field.key]}
            onChange={(event) => setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))}
            className={selectClassName}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ))}

        <button type="submit" className="rounded-xl border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-semibold text-on-surface-variant">Áp dụng</button>
      </FilterBar>
    </form>
  );
};

export default SystemLogsFilters;
