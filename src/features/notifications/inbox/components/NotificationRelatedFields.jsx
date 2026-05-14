import React, { useMemo, useState } from 'react';
import { filterOptions } from '../adapters/notificationAdapters';

const healthTypes = new Set(['HEALTH_ALERT', 'HEALTH_SUPPORT']);
const vaccinationTypes = new Set(['VACCINATION_REMINDER', 'VACCINATION_QUESTION']);

const SearchableSelect = ({
  label,
  value,
  options,
  idKey,
  labelKey,
  placeholder,
  searchPlaceholder,
  onChange,
}) => {
  const [keyword, setKeyword] = useState('');
  const filteredOptions = useMemo(() => filterOptions(options, keyword), [keyword, options]);

  return (
    <label className="space-y-1">
      <span className="app-overline">{label}</span>
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={searchPlaceholder}
        className="app-focus-ring app-input h-10 w-full rounded-xl text-sm"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="app-focus-ring app-input h-10 w-full rounded-xl text-sm"
      >
        <option value="">{placeholder}</option>
        {filteredOptions.map((option) => (
          <option key={option[idKey]} value={option[idKey]}>
            {option[labelKey] || option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const NotificationRelatedFields = ({
  role,
  draft,
  diseaseOptions = [],
  vaccinationOptions = [],
  onFieldChange,
}) => {
  const showDisease = healthTypes.has(draft.type) && diseaseOptions.length > 0;
  const showVaccination = vaccinationTypes.has(draft.type) && vaccinationOptions.length > 0;

  if (!showDisease && !showVaccination) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-2xl border border-outline-variant bg-surface-container-low px-3 py-3">
      <div>
        <h3 className="text-sm font-semibold text-on-surface">Thông tin liên quan</h3>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          {role === 'STUDENT' ? 'Thông tin bổ sung, không bắt buộc.' : 'Chọn thông tin liên quan nếu thông báo cần gắn với hồ sơ y tế.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {showDisease ? (
          <SearchableSelect
            label="Bệnh liên quan"
            value={draft.diseaseId}
            options={diseaseOptions}
            idKey="diseaseId"
            labelKey="diseaseName"
            placeholder="Không chọn bệnh"
            searchPlaceholder="Tìm bệnh/nhóm sức khỏe"
            onChange={(value) => onFieldChange('diseaseId', value)}
          />
        ) : null}

        {showVaccination ? (
          <SearchableSelect
            label="Đợt tiêm liên quan"
            value={draft.vaccinationId}
            options={vaccinationOptions}
            idKey="vaccinationId"
            labelKey="vaccinationName"
            placeholder="Không chọn đợt tiêm"
            searchPlaceholder="Tìm đợt tiêm"
            onChange={(value) => onFieldChange('vaccinationId', value)}
          />
        ) : null}
      </div>
    </section>
  );
};

export default NotificationRelatedFields;
