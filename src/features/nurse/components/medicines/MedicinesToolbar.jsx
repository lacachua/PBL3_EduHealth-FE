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
    <section className="rounded-2xl border border-[#D7ECDD] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:p-5">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-[1_1_420px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              type="text"
              value={value.keyword}
              onChange={(event) => updateField('keyword', event.target.value)}
              className="nurse-input w-full rounded-xl px-10 py-2.5 text-sm"
              placeholder="Tìm theo tên thuốc hoặc hoạt chất"
              aria-label="Tìm theo tên thuốc hoặc hoạt chất"
            />
          </div>

          <select
            value={value.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="nurse-input min-w-[220px] rounded-xl px-3 py-2.5 text-sm"
            aria-label="Lọc theo trạng thái"
          >
            {MEDICINE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onCreate}
            className="nurse-btn-primary nurse-focus-ring inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm thuốc mới
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#334155]">
              <input
                type="checkbox"
                checked={Boolean(value.lowStock)}
                onChange={(event) => updateField('lowStock', event.target.checked)}
                className="h-4 w-4 accent-[#15803D]"
              />
              Sắp hết hàng
            </label>

            <label className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#334155]">
              <input
                type="checkbox"
                checked={Boolean(value.expiring)}
                onChange={(event) => updateField('expiring', event.target.checked)}
                className="h-4 w-4 accent-[#15803D]"
              />
              Sắp hết hạn
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="nurse-focus-ring rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
            >
              Xóa bộ lọc
            </button>
            <button
              type="submit"
              className="nurse-btn-primary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
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
