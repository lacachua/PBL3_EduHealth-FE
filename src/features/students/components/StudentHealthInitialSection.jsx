import React from 'react';
import InlineError from '../../../shared/components/form/InlineError';

const inputClassName = 'w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-[var(--color-field-placeholder)] focus:border-[var(--color-field-focus)] focus:ring-2 focus:ring-[var(--color-field-focus)]/20';
const labelClassName = 'mb-1 block text-xs font-semibold text-on-surface-variant';

const FIELDS = [
  {
    key: 'heightCm',
    label: 'Chiều cao (cm)',
    type: 'number',
    placeholder: 'Ví dụ: 132',
  },
  {
    key: 'weightKg',
    label: 'Cân nặng (kg)',
    type: 'number',
    placeholder: 'Ví dụ: 29.5',
  },
  {
    key: 'eyeStatus',
    label: 'Tình trạng mắt',
    type: 'text',
    placeholder: 'Ví dụ: Cận thị nhẹ',
  },
  {
    key: 'chronicNote',
    label: 'Ghi chú bệnh nền',
    type: 'textarea',
    placeholder: 'Nhập nếu có',
  },
  {
    key: 'allergies',
    label: 'Dị ứng',
    type: 'textarea',
    className: 'md:col-span-2',
    placeholder: 'Phân tách bằng dấu phẩy, ví dụ: Dị ứng sữa, Dị ứng hải sản',
  },
];

const StudentHealthInitialSection = ({ values, errors, onChange }) => {
  return (
    <>
      <div className="md:col-span-2 rounded-md border border-info/25 bg-info-soft px-3 py-2 text-xs text-info">
        Thông tin sức khỏe ban đầu là tùy chọn, có thể cập nhật sau.
      </div>

      {FIELDS.map((field) => {
        const fieldPath = `health.${field.key}`;

        if (field.type === 'textarea') {
          return (
            <div key={field.key} className={field.className || ''}>
              <label className={labelClassName}>{field.label}</label>
              <textarea
                value={values[field.key]}
                onChange={(event) => onChange(fieldPath, event.target.value)}
                className={`${inputClassName} min-h-[84px] resize-y`}
                placeholder={field.placeholder}
              />
              <InlineError message={errors[fieldPath]} />
            </div>
          );
        }

        return (
          <div key={field.key} className={field.className || ''}>
            <label className={labelClassName}>{field.label}</label>
            <input
              type={field.type}
              value={values[field.key]}
              onChange={(event) => onChange(fieldPath, event.target.value)}
              placeholder={field.placeholder}
              className={inputClassName}
            />
            <InlineError message={errors[fieldPath]} />
          </div>
        );
      })}
    </>
  );
};

export default StudentHealthInitialSection;
