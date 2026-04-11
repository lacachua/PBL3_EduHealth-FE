import React from 'react';

const VaccinationStudentsToolbar = ({
  value,
  onChange,
  onApply,
  onReset,
  statusOptions,
  showClassFilter = false,
  showCampaignFilter = false,
  keywordPlaceholder = 'Tìm theo mã hoặc tên học sinh',
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
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="relative min-w-[260px] flex-[1_1_360px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              type="text"
              value={value.keyword}
              onChange={(event) => updateField('keyword', event.target.value)}
              className="nurse-input w-full rounded-xl px-10 py-2.5 text-sm"
              placeholder={keywordPlaceholder}
              aria-label={keywordPlaceholder}
            />
          </div>

          {showCampaignFilter ? (
            <input
              type="text"
              value={value.campaignId}
              onChange={(event) => updateField('campaignId', event.target.value)}
              className="nurse-input min-w-[170px] rounded-xl px-3 py-2.5 text-sm"
              placeholder="Mã đợt tiêm"
              aria-label="Lọc theo mã đợt tiêm"
            />
          ) : null}

          {showClassFilter ? (
            <input
              type="text"
              value={value.classId}
              onChange={(event) => updateField('classId', event.target.value)}
              className="nurse-input min-w-[150px] rounded-xl px-3 py-2.5 text-sm"
              placeholder="Mã lớp"
              aria-label="Lọc theo mã lớp"
            />
          ) : null}

          <select
            value={value.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="nurse-input min-w-[180px] rounded-xl px-3 py-2.5 text-sm"
            aria-label="Lọc theo trạng thái"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="nurse-btn-secondary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
            >
              Đặt lại
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

export default VaccinationStudentsToolbar;
