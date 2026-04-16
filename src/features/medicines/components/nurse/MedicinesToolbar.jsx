import React from 'react';
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
          <div className="relative min-w-[280px] flex-[1_1_420px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-muted">search</span>
            <input
              type="text"
              value={value.keyword}
              onChange={(event) => updateField('keyword', event.target.value)}
              className="app-focus-ring app-input w-full rounded-xl px-10 py-2.5 text-sm"
              placeholder="Tìm theo tên thuốc hoặc hoạt chất"
              aria-label="Tìm theo tên thuốc hoặc hoạt chất"
            />
          </div>

          <select
            value={value.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="app-focus-ring app-input min-w-[220px] rounded-xl px-3 py-2.5 text-sm"
            aria-label="Lọc theo trạng thái"
          >
            {MEDICINE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onCreate}
            className="app-btn-primary app-focus-ring inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
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
