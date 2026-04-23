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
          placeholder={keywordPlaceholder}
          className="min-w-0 flex-1 xl:max-w-[340px]"
          inputClassName="h-10 rounded-lg"
        />

        {showCampaignFilter ? (
          <input
            type="text"
            value={value.campaignId}
            onChange={(event) => updateField('campaignId', event.target.value)}
            className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm xl:w-[142px] xl:shrink-0"
            placeholder="Mã đợt tiêm"
            aria-label="Lọc theo mã đợt tiêm"
          />
        ) : null}

        {showClassFilter ? (
          <input
            type="text"
            value={value.classId}
            onChange={(event) => updateField('classId', event.target.value)}
            className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm xl:w-[118px] xl:shrink-0"
            placeholder="Mã lớp"
            aria-label="Lọc theo mã lớp"
          />
        ) : null}

        <select
          value={value.status}
          onChange={(event) => updateField('status', event.target.value)}
          className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm xl:w-[188px] xl:shrink-0"
          aria-label="Lọc theo trạng thái"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <div className="flex shrink-0 flex-wrap items-center gap-2 xl:ml-auto xl:flex-nowrap">
          <button
            type="button"
            onClick={onReset}
            className="app-btn-secondary app-focus-ring inline-flex h-9 min-w-[84px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
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

export default VaccinationStudentsToolbar;
