import React from 'react';
import InlineError from '../../../shared/components/form/InlineError';
import { STUDENT_CREATE_CLASS_OPTIONS, STUDENT_CREATE_GENDER_OPTIONS } from '../constants/studentCreateOptions';

const inputClassName = 'w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15';
const labelClassName = 'mb-1 block text-xs font-semibold text-on-surface-variant';

const PROFILE_FIELDS = [
  {
    key: 'studentCode',
    label: 'Mã học sinh',
    placeholder: 'Ví dụ: HS001',
    type: 'text',
  },
  {
    key: 'fullName',
    label: 'Họ tên',
    placeholder: 'Ví dụ: Trần Văn An',
    type: 'text',
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
    type: 'date',
  },
  {
    key: 'gender',
    label: 'Giới tính',
    type: 'select',
    options: STUDENT_CREATE_GENDER_OPTIONS,
  },
  {
    key: 'classId',
    label: 'Lớp',
    type: 'select',
    className: 'md:col-span-2',
    options: [{ value: '', label: 'Chọn lớp' }, ...STUDENT_CREATE_CLASS_OPTIONS],
    getOptionLabel: (option) => (option.value ? `${option.value} - ${option.label}` : option.label),
  },
];

const StudentProfileSection = ({ values, errors, onChange }) => {
  return (
    <>
      {PROFILE_FIELDS.map((field) => {
        const fieldPath = `profile.${field.key}`;

        return (
          <div key={field.key} className={field.className || ''}>
            <label className={labelClassName}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={values[field.key]}
                onChange={(event) => onChange(fieldPath, event.target.value)}
                className={inputClassName}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {field.getOptionLabel ? field.getOptionLabel(option) : option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={values[field.key]}
                onChange={(event) => onChange(fieldPath, event.target.value)}
                placeholder={field.placeholder}
                className={inputClassName}
              />
            )}
            <InlineError message={errors[fieldPath]} />
          </div>
        );
      })}
    </>
  );
};

export default StudentProfileSection;
