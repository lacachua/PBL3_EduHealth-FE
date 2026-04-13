import React, { useEffect, useState } from 'react';
import SearchInput from '../../../shared/components/admin/SearchInput';
import { MEDICINE_STATUS_OPTIONS } from '../schemas/medicinesSchema';

const MedicinesFilters = ({ initialValue, onApply, onReset, onRefresh }) => {
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
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={draft.keyword}
          onChange={(keyword) => setDraft((prev) => ({ ...prev, keyword }))}
          placeholder="Tìm theo tên thuốc hoặc hoạt chất..."
          className="min-w-[260px] flex-1"
        />

        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="h-11 min-w-[168px] rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface-variant outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
        >
          {MEDICINE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <label className="inline-flex h-11 whitespace-nowrap items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={draft.lowStock}
            onChange={(event) => setDraft((prev) => ({ ...prev, lowStock: event.target.checked }))}
          />
          Sắp hết
        </label>

        <label className="inline-flex h-11 whitespace-nowrap items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={draft.expiring}
            onChange={(event) => setDraft((prev) => ({ ...prev, expiring: event.target.checked }))}
          />
          Sắp hết hạn
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-on-surface-variant">Lọc dữ liệu theo trạng thái và cảnh báo tồn kho.</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-11 whitespace-nowrap items-center gap-1.5 rounded-xl border border-outline-variant bg-surface px-3.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Làm mới
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-11 whitespace-nowrap rounded-xl border border-outline-variant bg-surface px-3.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            Đặt lại
          </button>

          <button
            type="submit"
            className="h-11 whitespace-nowrap rounded-xl bg-primary px-3.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </form>
  );
};

export default MedicinesFilters;
