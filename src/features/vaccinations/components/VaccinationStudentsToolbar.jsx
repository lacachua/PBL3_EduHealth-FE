import React from 'react';
import SearchInput from '../../../shared/components/admin/SearchInput';

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
    <section className="app-panel-shell p-4 md:p-5">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <div className="flex flex-wrap items-start gap-3">
          <SearchInput
            value={value.keyword}
            onChange={(keyword) => updateField('keyword', keyword)}
            placeholder={keywordPlaceholder}
            className="min-w-[260px] flex-[1_1_360px]"
            inputClassName="rounded-xl"
          />

          {showCampaignFilter ? (
            <input
              type="text"
              value={value.campaignId}
              onChange={(event) => updateField('campaignId', event.target.value)}
              className="app-focus-ring app-input min-w-[170px] rounded-xl px-3 py-2.5 text-sm"
              placeholder="Mã đợt tiêm"
              aria-label="Lọc theo mã đợt tiêm"
            />
          ) : null}

          {showClassFilter ? (
            <input
              type="text"
              value={value.classId}
              onChange={(event) => updateField('classId', event.target.value)}
              className="app-focus-ring app-input min-w-[150px] rounded-xl px-3 py-2.5 text-sm"
              placeholder="Mã lớp"
              aria-label="Lọc theo mã lớp"
            />
          ) : null}

          <select
            value={value.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="app-focus-ring app-input min-w-[180px] rounded-xl px-3 py-2.5 text-sm"
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
              className="app-btn-secondary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
            >
              Đặt lại
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

export default VaccinationStudentsToolbar;
