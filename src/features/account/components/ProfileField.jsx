import React from 'react';

const variantClassMap = {
  admin: {
    label: 'text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant',
    input: 'w-full rounded-lg border border-field-editable-border bg-field-editable-bg px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-[var(--color-field-focus)] focus:ring-2 focus:ring-primary/18',
    disabledInput: 'w-full rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 text-sm text-on-surface-muted cursor-not-allowed',
    readonly: 'flex min-h-10 items-center rounded-lg border border-field-readonly-border bg-field-readonly-bg px-3 text-sm font-medium text-on-surface',
    error: 'mt-1 text-xs font-medium text-danger',
  },
  nurse: {
    label: 'text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant',
    input: 'app-focus-ring app-input w-full rounded-lg px-3 py-2 text-sm',
    disabledInput: 'w-full rounded-lg border border-field-readonly-border bg-field-readonly-bg px-3 py-2 text-sm text-on-surface-variant cursor-not-allowed',
    readonly: 'flex min-h-10 items-center rounded-lg border border-field-readonly-border bg-field-readonly-bg px-3 text-sm font-medium text-on-surface',
    error: 'mt-1 text-xs font-medium text-danger',
  },
};

const ProfileField = ({
  variant = 'admin',
  label,
  name,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  disabled = false,
  placeholder,
  error,
}) => {
  const classes = variantClassMap[variant] || variantClassMap.admin;

  return (
    <div>
      <label htmlFor={name} className={classes.label}>{label}</label>
      {readOnly ? (
        <div className={`${classes.readonly} mt-1`}>{value || '--'}</div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`${disabled ? classes.disabledInput : classes.input} mt-1`}
        />
      )}
      {error ? <p className={classes.error}>{error}</p> : null}
    </div>
  );
};

export default ProfileField;
