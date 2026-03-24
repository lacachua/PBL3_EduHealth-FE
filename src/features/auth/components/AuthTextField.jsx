import React, { useMemo, useState } from 'react';

const AuthTextField = ({
  id,
  label,
  icon,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  enablePasswordToggle = false,
  labelClassName = '',
  inputClassName = '',
  wrapperClassName = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === 'password';
  const canTogglePassword = isPasswordField && enablePasswordToggle;
  const inputType = canTogglePassword && isPasswordVisible ? 'text' : type;
  const rightPaddingClass = canTogglePassword ? 'pr-12' : 'pr-4';

  const toggleLabel = useMemo(
    () => (isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'),
    [isPasswordVisible]
  );

  return (
    <div className={wrapperClassName || 'space-y-2'}>
      <label className={`block text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1 ${labelClassName}`} htmlFor={id}>
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">{icon}</span>
        </div>
        <input
          id={id}
          className={`w-full pl-11 ${rightPaddingClass} py-4 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline transition-all ${inputClassName}`}
          name={name}
          value={value}
          onChange={onChange}
          type={inputType}
          placeholder={placeholder}
          required={required}
        />
        {canTogglePassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
            aria-label={toggleLabel}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isPasswordVisible ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTextField;
