
import SearchInput from '../../../shared/components/core/SearchInput';
import { VACCINATION_CAMPAIGN_STATUS_OPTIONS } from '../constants/vaccinationConstants';

const VaccinationCampaignToolbar = ({
  value,
  onChange,
  onApply,
  onReset,
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
          placeholder="Tìm theo tên đợt hoặc vaccine"
          className="min-w-0 flex-1 xl:max-w-[340px]"
          inputClassName="h-10 rounded-lg"
        />

        <select
          value={value.status}
          onChange={(event) => updateField('status', event.target.value)}
          className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm xl:w-[184px] xl:shrink-0"
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
          className={`app-focus-ring inline-flex h-10 w-full shrink-0 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-semibold transition xl:w-[156px] ${value.incompleteOnly
            ? 'border-success/30 bg-success-soft text-success'
            : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface'
            }`}
        >
          <span className="material-symbols-outlined text-[15px]">pending_actions</span>
          Chưa hoàn thành
        </button>

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
            className="app-focus-ring app-btn-primary inline-flex h-9 min-w-[72px] items-center justify-center rounded-lg px-3 text-sm font-semibold"
          >
            Lọc
          </button>
        </div>
      </form>
    </section>
  );
};

export default VaccinationCampaignToolbar;
