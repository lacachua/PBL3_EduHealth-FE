import React from 'react';
import SearchInput from '../../../shared/components/admin/SearchInput';
import { VACCINATION_CAMPAIGN_STATUS_OPTIONS } from '../constants/vaccinationConstants';

const VaccinationCampaignToolbar = ({
  value,
  onChange,
  onApply,
  onReset,
  onOpenCreate,
}) => {
  const updateField = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <section className="app-panel-shell p-4 md:p-5">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <SearchInput
          value={value.keyword}
          onChange={(keyword) => updateField('keyword', keyword)}
          placeholder="Tìm theo tên đợt hoặc vaccine"
          className="min-w-[260px] flex-[1_1_360px]"
          inputClassName="h-10 rounded-xl"
        />

        <select
          value={value.status}
          onChange={(event) => updateField('status', event.target.value)}
          className="app-focus-ring app-input h-10 min-w-[190px] rounded-xl px-3 text-sm"
          aria-label="Lọc theo trạng thái đợt tiêm"
        >
          {VACCINATION_CAMPAIGN_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => updateField('incompleteOnly', !value.incompleteOnly)}
          aria-pressed={Boolean(value.incompleteOnly)}
          className={`app-focus-ring inline-flex h-9 items-center gap-1 rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.04em] transition ${
            value.incompleteOnly
              ? 'border-success/30 bg-success-soft text-success'
              : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">pending_actions</span>
          Chưa hoàn thành
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="app-focus-ring app-btn-secondary inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold"
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="app-focus-ring app-btn-primary inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="app-btn-primary app-focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo đợt tiêm
          </button>
        </div>
      </form>
    </section>
  );
};

export default VaccinationCampaignToolbar;
