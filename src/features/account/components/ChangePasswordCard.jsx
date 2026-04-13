import React, { useMemo, useState } from 'react';
import { useChangeCurrentUserPassword } from '../hooks/useChangeCurrentUserPassword';

const variantClassMap = {
  admin: {
    card: 'rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)]',
    title: 'text-[1.06rem] font-bold text-on-surface',
    headerRow: 'mb-3 flex items-center gap-2.5',
    headerIconWrap: 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary-soft text-primary',
    headerIcon: 'material-symbols-outlined text-[16px]',
    fieldGrid: 'mt-4 grid gap-3 md:grid-cols-2',
    label: 'text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant',
    input: 'h-10 w-full rounded-lg border border-field-editable-border bg-field-editable-bg px-3 pr-10 text-sm text-on-surface outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/12',
    visibilityButton: 'absolute inset-y-0 right-1 inline-flex w-8 items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/15',
    error: 'mt-1 text-xs font-medium text-danger',
    noteError: 'rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger',
    actionsRow: 'flex flex-wrap items-center gap-2',
    actionButton: 'inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70',
    cancelButton: 'inline-flex h-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright px-4 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low',
  },
  nurse: {
    card: 'rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)]',
    title: 'text-[1.06rem] font-bold text-on-surface',
    headerRow: 'mb-3 flex items-center gap-2.5',
    headerIconWrap: 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary-container text-secondary',
    headerIcon: 'material-symbols-outlined text-[16px]',
    fieldGrid: 'mt-4 grid gap-3 md:grid-cols-2',
    label: 'text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant',
    input: 'h-10 w-full rounded-lg border border-field-editable-border bg-field-editable-bg px-3 pr-10 text-sm text-on-surface outline-none transition focus:border-secondary/45 focus:ring-2 focus:ring-secondary/12',
    visibilityButton: 'absolute inset-y-0 right-1 inline-flex w-8 items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary/15',
    error: 'mt-1 text-xs font-medium text-danger',
    noteError: 'rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger',
    actionsRow: 'flex flex-wrap items-center gap-2',
    actionButton: 'inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70',
    cancelButton: 'inline-flex h-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright px-4 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low',
  },
};

const validatePasswordForm = (values) => {
  const nextErrors = {};

  if (!values.oldPassword.trim()) {
    nextErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.';
  }

  if (!values.newPassword.trim()) {
    nextErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
  } else if (values.newPassword.length < 8) {
    nextErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
  }

  if (!values.confirmPassword.trim()) {
    nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
  }

  if (values.oldPassword && values.newPassword && values.oldPassword === values.newPassword) {
    nextErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
  }

  if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
    nextErrors.confirmPassword = 'Xác nhận mật khẩu chưa khớp.';
  }

  return nextErrors;
};

const ChangePasswordCard = ({ variant = 'admin', onFeedback }) => {
  const classes = variantClassMap[variant] || variantClassMap.admin;
  const { isSubmitting, submitError, fieldErrors, resetFeedback, changePassword } = useChangeCurrentUserPassword();

  const [formValues, setFormValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const mergedErrors = useMemo(() => ({
    ...fieldErrors,
    ...formErrors,
  }), [fieldErrors, formErrors]);

  const onFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    resetFeedback();
    setFormErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCancel = () => {
    setFormValues({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setPasswordVisibility({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    resetFeedback();
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validatePasswordForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await changePassword(formValues);

    if (result.ok) {
      setFormValues({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setFormErrors({});
      setPasswordVisibility({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
      if (onFeedback) {
        onFeedback({ type: 'success', message: result.message || 'Đổi mật khẩu thành công.' });
      }
      return;
    }

    if (onFeedback) {
      onFeedback({ type: 'error', message: result.message || 'Không thể đổi mật khẩu.' });
    }
  };

  return (
    <section className={classes.card}>
      <div className={classes.headerRow}>
        <span className={classes.headerIconWrap}>
          <span className={classes.headerIcon}>lock</span>
        </span>
        <h2 className={classes.title}>Đổi mật khẩu</h2>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className={classes.fieldGrid}>
          <div className="md:col-span-2">
            <label htmlFor="oldPassword" className={classes.label}>Mật khẩu hiện tại</label>
            <div className="relative mt-1">
              <input
                id="oldPassword"
                type={passwordVisibility.oldPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={classes.input}
                value={formValues.oldPassword}
                onChange={(event) => onFieldChange('oldPassword', event.target.value)}
              />
              <button
                type="button"
                className={classes.visibilityButton}
                onClick={() => togglePasswordVisibility('oldPassword')}
                aria-label={passwordVisibility.oldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {passwordVisibility.oldPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {mergedErrors.oldPassword ? <p className={classes.error}>{mergedErrors.oldPassword}</p> : null}
          </div>

          <div>
            <label htmlFor="newPassword" className={classes.label}>Mật khẩu mới</label>
            <div className="relative mt-1">
              <input
                id="newPassword"
                type={passwordVisibility.newPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={classes.input}
                value={formValues.newPassword}
                onChange={(event) => onFieldChange('newPassword', event.target.value)}
              />
              <button
                type="button"
                className={classes.visibilityButton}
                onClick={() => togglePasswordVisibility('newPassword')}
                aria-label={passwordVisibility.newPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {passwordVisibility.newPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {mergedErrors.newPassword ? <p className={classes.error}>{mergedErrors.newPassword}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={classes.label}>Xác nhận mật khẩu mới</label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={classes.input}
                value={formValues.confirmPassword}
                onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
              />
              <button
                type="button"
                className={classes.visibilityButton}
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label={passwordVisibility.confirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {passwordVisibility.confirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {mergedErrors.confirmPassword ? <p className={classes.error}>{mergedErrors.confirmPassword}</p> : null}
          </div>
        </div>

        {submitError ? <p className={classes.noteError}>{submitError}</p> : null}

        <div className={classes.actionsRow}>
          <button type="submit" className={classes.actionButton} disabled={isSubmitting}>
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>

          <button type="button" className={classes.cancelButton} onClick={handleCancel}>
            Hủy
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordCard;
