import React from 'react';

const AuthInput = ({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  icon,
  error,
  hint,
}) => {
  const hasError = Boolean(error);
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2.5">
      <label
        htmlFor={id}
        className={`block text-[15px] font-semibold ${hasError ? 'text-auth-error' : 'text-auth-text-body'}`}
      >
        {label}
      </label>

      <div className="relative">
        {icon ? (
          <span
            className={`material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[22px] ${hasError ? 'text-auth-error' : 'text-auth-text-muted'}`}
          >
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={error || hint ? helperId : undefined}
          className={`h-14 w-full rounded-[14px] border bg-auth-surface text-[16px] text-auth-text-strong outline-none transition-all placeholder:text-auth-text-muted ${
            icon ? 'pl-12 pr-4' : 'px-4'
          } ${
            hasError
              ? 'border-auth-error bg-auth-error-soft/35 focus:border-auth-error focus:ring-2 focus:ring-auth-error/25 focus:shadow-[0_0_0_3px_rgba(185,58,58,0.08)]'
              : 'border-auth-border focus:border-auth-primary focus:ring-2 focus:ring-auth-primary/28 focus:shadow-[0_0_0_3px_rgba(22,92,72,0.1)]'
          } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        />
      </div>

      {(error || hint) && (
        <p id={helperId} className={`flex items-center gap-1.5 text-[13px] ${hasError ? 'text-auth-error' : 'text-auth-text-muted'}`}>
          {hasError ? (
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              error
            </span>
          ) : null}
          <span>{error || hint}</span>
        </p>
      )}
    </div>
  );
};

export default AuthInput;
