import React from 'react';
import InlineError from '../../../shared/components/form/InlineError';
import { STUDENT_CREATE_GENDER_OPTIONS } from '../constants/studentCreateOptions';

const inputClassName = 'w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15';
const labelClassName = 'mb-1 block text-xs font-semibold text-on-surface-variant';

const PROFILE_FIELDS = [
  {
    key: 'fullName',
    label: 'Họ tên *',
    placeholder: 'Ví dụ: Trần Văn An',
    type: 'text',
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh *',
    type: 'date',
  },
  {
    key: 'gender',
    label: 'Giới tính *',
    type: 'select',
    options: STUDENT_CREATE_GENDER_OPTIONS,
  },
  {
    key: 'classId',
    label: 'Lớp *',
    type: 'class-select',
    className: 'md:col-span-2',
  },
];

const StudentProfileSection = ({ values, errors, onChange, classes = [], classesLoading, classesError }) => {
  const renderClassSelect = (fieldPath) => {
    if (classesError) {
      return (
        <select disabled className={inputClassName}>
          <option>{classesError}</option>
        </select>
      );
    }

    if (classesLoading) {
      return (
        <select disabled className={inputClassName}>
          <option>Đang tải danh sách lớp...</option>
        </select>
      );
    }

    if (classes.length === 0) {
      return (
        <select disabled className={inputClassName}>
          <option>Chưa có lớp để chọn.</option>
        </select>
      );
    }

    return (
      <select
        value={values.classId || ''}
        onChange={(event) => onChange(fieldPath, event.target.value)}
        className={inputClassName}
      >
        <option value="">Chọn lớp</option>
        {classes.map((cls) => (
          <option key={cls.classId || cls.id} value={cls.classId || cls.id}>
            {cls.className || cls.name}
          </option>
        ))}
      </select>
    );
  };
  return (
    <>
      {PROFILE_FIELDS.map((field) => {
        const fieldPath = `profile.${field.key}`;

        return (
          <div key={field.key} className={field.className || ''}>
            <label className={labelClassName}>{field.label}</label>
            {field.type === 'class-select' ? (
              renderClassSelect(fieldPath)
            ) : field.type === 'select' ? (
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
