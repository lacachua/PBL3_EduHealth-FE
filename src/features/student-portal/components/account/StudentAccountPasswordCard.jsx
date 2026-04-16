import React from 'react';

const labelClassName = 'text-xs font-bold uppercase tracking-[0.12em] text-on-surface-muted';

const inputClassName =
  'app-focus-ring app-input h-10 w-full rounded-lg px-3 pr-10 text-sm';

const StudentAccountPasswordCard = ({
  formValues,
  formErrors,
  submitError,
  visibility,
  isSubmitting,
  onFieldChange,
  onToggleVisibility,
  onSubmit,
  onReset,
}) => {
  return (
    <section className="app-panel-shell h-full rounded-3xl p-4 md:p-5">
      <header className="app-tone-info app-tone-surface mb-4 rounded-2xl border px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-info/14 text-info">
            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
          </span>
          <h3 className="text-base font-bold text-on-surface">Đổi mật khẩu</h3>
        </div>
      </header>

      <form className="space-y-4" onSubmit={onSubmit}>
        {[
          { key: 'oldPassword', label: 'Mật khẩu hiện tại', autoComplete: 'current-password' },
          { key: 'newPassword', label: 'Mật khẩu mới', autoComplete: 'new-password' },
          { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới', autoComplete: 'new-password' },
        ].map((field) => (
          <div key={field.key} className="rounded-xl border border-outline-variant bg-surface px-3 py-2.5">
            <label htmlFor={field.key} className={labelClassName}>{field.label}</label>
            <div className="relative mt-1">
              <input
                id={field.key}
                type={visibility[field.key] ? 'text' : 'password'}
                autoComplete={field.autoComplete}
                className={inputClassName}
                value={formValues[field.key]}
                onChange={(event) => onFieldChange(field.key, event.target.value)}
              />
              <button
                type="button"
                onClick={() => onToggleVisibility(field.key)}
                className="app-focus-ring app-interactive absolute inset-y-1 right-1 inline-flex w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low"
                aria-label={visibility[field.key] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {visibility[field.key] ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {formErrors[field.key] ? <p className="mt-1 text-xs font-medium text-danger">{formErrors[field.key]}</p> : null}
          </div>
        ))}

        {submitError ? (
          <p className="rounded-lg border border-danger/35 bg-danger-soft px-3 py-2 text-sm text-danger">{submitError}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="app-btn-primary app-focus-ring w-full rounded-xl py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="app-btn-secondary app-focus-ring w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Hủy
          </button>
        </div>
      </form>
    </section>
  );
};

export default StudentAccountPasswordCard;
