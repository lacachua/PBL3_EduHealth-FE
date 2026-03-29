import React from 'react';
import InlineError from '../../../shared/components/form/InlineError';

const inputClassName = 'w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15';
const labelClassName = 'mb-1 block text-xs font-semibold text-on-surface-variant';

const ACCOUNT_FIELDS = [
  {
    key: 'username',
    label: 'Tên đăng nhập',
    placeholder: 'Ví dụ: HS001',
  },
  {
    key: 'password',
    label: 'Mật khẩu khởi tạo',
    placeholder: 'Tối thiểu 6 ký tự',
    type: 'password',
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Ví dụ: hs001@school.local',
  },
  {
    key: 'phoneNumber',
    label: 'Số điện thoại',
    placeholder: 'Ví dụ: 0867347321',
  },
];

const StudentAccountSection = ({ values, errors, onChange }) => {
  return (
    <>
      {ACCOUNT_FIELDS.map((field) => {
        const fieldPath = `account.${field.key}`;

        return (
          <div key={field.key}>
            <label className={labelClassName}>{field.label}</label>
            <input
              type={field.type || 'text'}
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

export default StudentAccountSection;
