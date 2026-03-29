import React from 'react';
import InlineError from './InlineError';

const baseInputClass = 'w-full rounded-lg border border-[var(--color-field-editable-border)] bg-[var(--color-field-editable-bg)] px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-[var(--color-field-placeholder)] hover:border-outline focus:border-[var(--color-field-focus)] focus:ring-2 focus:ring-[var(--color-field-focus)]/20';

const EditableField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  options = [],
  error,
  helper,
}) => {
  const normalizedValue = value || '';
  const commonProps = {
    value: normalizedValue,
    onChange: (event) => onChange(event.target.value),
    placeholder,
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-on-surface-variant">{label}</label>
      {type === 'select' ? (
        <select {...commonProps} className={baseInputClass}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : null}

      {type === 'textarea' ? (
        <textarea
          {...commonProps}
          className={`${baseInputClass} min-h-[84px] resize-y`}
        />
      ) : null}

      {type !== 'select' && type !== 'textarea' ? (
        <input
          {...commonProps}
          type={type}
          className={baseInputClass}
        />
      ) : null}
      {helper ? <p className="mt-1 text-xs text-on-surface-muted">{helper}</p> : null}
      <InlineError message={error} />
    </div>
  );
};

export default EditableField;
