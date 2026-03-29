import React, { useMemo, useState } from 'react';
import AuthInput from './AuthInput';

const PasswordField = ({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete = 'current-password',
  required = false,
  disabled = false,
  error,
  hint,
}) => {
  const [visible, setVisible] = useState(false);
  const toggleLabel = useMemo(() => (visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'), [visible]);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <AuthInput
          id={id}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          icon="lock"
          error={error}
          hint={hint}
        />

        <button
          type="button"
          aria-label={toggleLabel}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3.5 top-[2.7rem] inline-flex h-8 w-8 items-center justify-center rounded text-auth-text-muted transition-colors hover:text-auth-primary"
          disabled={disabled}
        >
          <span className="material-symbols-outlined text-[22px]">{visible ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
