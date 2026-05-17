import { nurseReportFilterOptions } from '../config/nurseReportFilterOptions';

const FilterSelect = ({ label, value, options, onChange, disabled }) => {
  return (
    <label className="flex min-w-[138px] grow basis-[156px] flex-col gap-1">
      <span className="app-overline">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="app-input app-focus-ring h-10 rounded-xl px-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const DateInput = ({ label, value, onChange, error, max }) => {
  return (
    <label className="flex min-w-[138px] grow basis-[156px] flex-col gap-1">
      <span className="app-overline">{label}</span>
      <input
        type="date"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        max={max}
        className={`app-input app-focus-ring h-10 rounded-xl px-3 ${error ? 'border-danger' : ''}`}
      />
      {error && (
        <span className="ml-1 text-[11px] text-danger">{error}</span>
      )}
    </label>
  );
};

const NurseReportsFilterBar = ({
  filters,
  classOptions,
  onFiltersChange,
  onReset,
  onApply,
}) => {
  const resolvedClassOptions = Array.isArray(classOptions) && classOptions.length
    ? classOptions
    : [{ value: 'all', label: 'Tất cả lớp' }];

  // Filter class options based on selected grade
  const filteredClassOptions = filters.grade === 'all'
    ? [{ value: 'all', label: 'Tất cả lớp' }]
    : resolvedClassOptions.filter((option) => {
      if (option.value === 'all') return true;
      // Extract grade from class name (e.g., "1/1" -> "1", "2/3" -> "2")
      const classGrade = option.label.split('/')[0];
      return classGrade === filters.grade;
    });

  // Get today's date in yyyy-MM-dd format for max date validation
  const today = new Date().toISOString().split('T')[0];

  const dateError = filters.fromDate && filters.toDate && filters.fromDate > filters.toDate
    ? 'Từ ngày phải <= Đến ngày'
    : '';

  const handleGradeChange = (nextGrade) => {
    // Always reset class to "all" when grade changes
    onFiltersChange({
      grade: nextGrade,
      classId: 'all',
    });
  };

  const handleApply = () => {
    if (dateError) return;
    onApply();
  };

  return (
    <section className="app-panel-shell app-filter-toolbar">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-2.5">
          <DateInput
            label="Từ ngày"
            value={filters.fromDate}
            onChange={(value) => onFiltersChange({ fromDate: value })}
            max={today}
            error={dateError}
          />
          <DateInput
            label="Đến ngày"
            value={filters.toDate}
            onChange={(value) => onFiltersChange({ toDate: value })}
            max={today}
          />

          <FilterSelect
            label="Loại báo cáo"
            value={filters.reportType}
            options={nurseReportFilterOptions.reportTypes}
            onChange={(nextValue) => onFiltersChange({ reportType: nextValue })}
          />
        </div>

        <div className="flex flex-wrap items-end gap-2.5">
          <FilterSelect
            label="Khối lớp"
            value={filters.grade}
            options={nurseReportFilterOptions.grades}
            onChange={handleGradeChange}
          />

          <FilterSelect
            label="Lớp học"
            value={filters.classId}
            options={filteredClassOptions}
            onChange={(nextValue) => onFiltersChange({ classId: nextValue })}
          />

          <div className="ml-auto flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={onReset}
              className="app-focus-ring app-btn-secondary px-3"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Đặt lại
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={Boolean(dateError)}
              className="app-focus-ring app-btn-primary px-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Lọc
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NurseReportsFilterBar;
