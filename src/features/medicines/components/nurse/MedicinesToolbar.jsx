import React from 'react';
import SearchInput from '../../../../shared/components/admin/SearchInput';
import { MEDICINE_STATUS_OPTIONS } from '../../constants/nurseMedicineConstants';

const MedicinesToolbar = ({ value, onChange, onApply, onReset, onCreate }) => {
  const updateField = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <section className="app-panel-shell p-4 md:p-5">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={value.keyword}
            onChange={(keyword) => updateField('keyword', keyword)}
            placeholder="Tìm theo tên thuốc hoặc hoạt chất"
            className="min-w-[280px] flex-[1_1_420px]"
            inputClassName="h-11 rounded-xl"
          />

          <select
            value={value.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="app-focus-ring app-input min-w-[220px] rounded-xl px-3 text-sm"
            aria-label="Lọc theo trạng thái"
          >
            {MEDICINE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onCreate}
            className="app-btn-primary app-focus-ring inline-flex items-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm thuốc mới
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={Boolean(value.lowStock)}
                onChange={(event) => updateField('lowStock', event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Sắp hết hàng
            </label>

            <label className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={Boolean(value.expiring)}
                onChange={(event) => updateField('expiring', event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Sắp hết hạn
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="app-focus-ring app-btn-secondary rounded-xl px-3.5 py-2 text-sm font-semibold"
            >
              Xóa bộ lọc
            </button>
            <button
              type="submit"
              className="app-btn-primary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MedicinesToolbar;
