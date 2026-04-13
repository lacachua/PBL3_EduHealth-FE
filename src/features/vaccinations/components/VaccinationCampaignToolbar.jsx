import React from 'react';
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
    <section className="rounded-2xl border border-[#D7ECDD] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:p-5">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="relative min-w-[260px] flex-[1_1_360px]">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
          <input
            type="text"
            value={value.keyword}
            onChange={(event) => updateField('keyword', event.target.value)}
            className="nurse-input h-10 w-full rounded-xl px-10 text-sm"
            placeholder="Tìm theo tên đợt hoặc vaccine"
            aria-label="Tìm theo tên đợt hoặc vaccine"
          />
        </div>

        <select
          value={value.status}
          onChange={(event) => updateField('status', event.target.value)}
          className="nurse-input h-10 min-w-[190px] rounded-xl px-3 text-sm"
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
          className={`nurse-focus-ring inline-flex h-9 items-center gap-1 rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.04em] transition ${
            value.incompleteOnly
              ? 'border-[#86EFAC] bg-[#DCFCE7] text-[#166534]'
              : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">pending_actions</span>
          Chưa hoàn thành
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="nurse-focus-ring inline-flex h-9 items-center rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC]"
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="nurse-focus-ring inline-flex h-9 items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#475569] transition hover:bg-white"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="nurse-btn-primary nurse-focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold"
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
