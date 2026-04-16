import React from 'react';
import { nurseReportFilterOptions } from '../config/nurseReportFilterOptions';

const FilterSelect = ({ label, value, options, onChange }) => {
  return (
    <label className="flex min-w-[138px] grow basis-[156px] flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="app-input app-focus-ring h-9 rounded-lg px-2.5 text-sm"
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

const NurseReportsFilterBar = ({
  filters,
  classOptions,
  onFiltersChange,
  onReset,
  onRefresh,
  refreshing,
}) => {
  const resolvedClassOptions = Array.isArray(classOptions) && classOptions.length
    ? classOptions
    : [{ value: 'all', label: 'Tất cả lớp' }];

  return (
    <section className="app-panel-shell px-3.5 py-3">
      <div className="flex flex-wrap items-end gap-2.5">
        <FilterSelect
          label="Mốc thời gian"
          value={filters.timeRange}
          options={nurseReportFilterOptions.timeRanges}
          onChange={(nextValue) => onFiltersChange({ timeRange: nextValue })}
        />

        <FilterSelect
          label="Loại báo cáo"
          value={filters.reportType}
          options={nurseReportFilterOptions.reportTypes}
          onChange={(nextValue) => onFiltersChange({ reportType: nextValue })}
        />

        <FilterSelect
          label="Khối lớp"
          value={filters.grade}
          options={nurseReportFilterOptions.grades}
          onChange={(nextValue) => {
            const shouldResetClass = nextValue !== filters.grade;
            onFiltersChange({
              grade: nextValue,
              classId: shouldResetClass ? 'all' : filters.classId,
            });
          }}
        />

        <FilterSelect
          label="Lớp học"
          value={filters.classId}
          options={resolvedClassOptions}
          onChange={(nextValue) => onFiltersChange({ classId: nextValue })}
        />

        <div className="ml-auto flex items-center gap-2 self-center">
          <button
            type="button"
            onClick={onReset}
            className="app-focus-ring app-btn-secondary inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Đặt lại
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="app-focus-ring app-btn-secondary inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold"
          >
            <span className={`material-symbols-outlined text-[18px] ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </section>
  );
};

export default NurseReportsFilterBar;
