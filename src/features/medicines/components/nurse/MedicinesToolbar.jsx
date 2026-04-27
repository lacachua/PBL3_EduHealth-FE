import SearchInput from '../../../../shared/components/core/SearchInput';
import { MEDICINE_STATUS_OPTIONS } from '../../constants/nurseMedicineConstants';

const MedicinesToolbar = ({ value, onChange, onApply, onReset }) => {
  const updateField = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <section className="app-panel-shell px-4 py-3 sm:px-5">
      <form
        className="flex flex-col gap-2.5 xl:flex-row xl:flex-nowrap xl:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <SearchInput
          value={value.keyword}
          onChange={(keyword) => updateField('keyword', keyword)}
          placeholder="Tìm theo tên thuốc hoặc hoạt chất"
          className="min-w-0 flex-1 xl:max-w-[340px]"
          inputClassName="h-10 rounded-lg"
        />

        <select
          value={value.status}
          onChange={(event) => updateField('status', event.target.value)}
          className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm xl:w-[178px] xl:shrink-0"
          aria-label="Lọc theo trạng thái"
        >
          {MEDICINE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <label className="inline-flex h-10 w-full shrink-0 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface-variant xl:w-[132px]">
          <input
            type="checkbox"
            checked={Boolean(value.lowStock)}
            onChange={(event) => updateField('lowStock', event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Sắp hết hàng
        </label>

        <label className="inline-flex h-10 w-full shrink-0 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface-variant xl:w-[132px]">
          <input
            type="checkbox"
            checked={Boolean(value.expiring)}
            onChange={(event) => updateField('expiring', event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Sắp hết hạn
        </label>

        <div className="flex shrink-0 flex-wrap items-center gap-2 xl:ml-auto xl:flex-nowrap">
          <button
            type="button"
            onClick={onReset}
            className="app-focus-ring app-btn-secondary inline-flex h-9 min-w-[84px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="app-btn-primary app-focus-ring inline-flex h-9 min-w-[72px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
          >
            Lọc
          </button>
        </div>
      </form>
    </section>
  );
};

export default MedicinesToolbar;
