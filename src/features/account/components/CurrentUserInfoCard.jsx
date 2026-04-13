import React, { useEffect, useMemo, useState } from 'react';
import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { currentUserRepository } from '../repositories/currentUserRepository';
import ProfileField from './ProfileField';

const variantClassMap = {
  admin: {
    card: 'h-full rounded-xl border border-outline-variant bg-surface p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col',
    title: 'text-[1.06rem] font-bold text-on-surface',
    headerRow: 'mb-2.5 flex items-center gap-2.5',
    headerIconWrap: 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary-soft text-primary',
    headerIcon: 'material-symbols-outlined text-[16px]',
    formGrid: 'mt-3 grid gap-3 sm:grid-cols-2',
    actionsRow: 'mt-auto flex flex-wrap items-center gap-2 pt-1',
    saveButton: 'inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-65',
    cancelButton: 'inline-flex h-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright px-3.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-low',
    errorText: 'text-xs font-medium text-danger',
  },
  nurse: {
    card: 'h-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)] flex flex-col',
    title: 'text-[1.06rem] font-bold text-on-surface',
    headerRow: 'mb-3 flex items-center gap-2.5',
    headerIconWrap: 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary-container text-secondary',
    headerIcon: 'material-symbols-outlined text-[16px]',
    formGrid: 'mt-4 grid gap-3 sm:grid-cols-2',
    actionsRow: 'mt-auto flex flex-wrap items-center gap-2 pt-1',
    saveButton: 'inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-65',
    cancelButton: 'inline-flex h-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright px-3.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-low',
    errorText: 'text-xs font-medium text-danger',
  },
};

const PHONE_PATTERN = /^[0-9+\-\s]{9,15}$/;

const createFormState = (currentUser) => ({
  fullName: currentUser?.fullName || '',
  email: currentUser?.email || '',
  phone: currentUser?.phone || '',
  role: currentUser?.roleLabel || currentUser?.role || '',
});

const validateForm = (values) => {
  const nextErrors = {};

  if (!String(values.fullName || '').trim()) {
    nextErrors.fullName = 'Vui lòng nhập họ và tên.';
  }

  const phone = String(values.phone || '').trim();
  if (phone && !PHONE_PATTERN.test(phone)) {
    nextErrors.phone = 'Số điện thoại không hợp lệ.';
  }

  return nextErrors;
};

const CurrentUserInfoCard = ({
  variant = 'admin',
  currentUser,
  onFeedback,
  onProfileSaved,
}) => {
  const classes = variantClassMap[variant] || variantClassMap.admin;
  const isMockMode = resolveModuleDataSource(DATA_MODULES.CURRENT_USER_ACCOUNT) === 'mock';

  const [formValues, setFormValues] = useState(() => createFormState(currentUser));
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormValues(createFormState(currentUser));
    setFormErrors({});
    setSubmitError('');
  }, [currentUser]);

  const hasChanges = useMemo(() => {
    const initial = createFormState(currentUser);
    return initial.fullName !== formValues.fullName || initial.phone !== formValues.phone;
  }, [currentUser, formValues.fullName, formValues.phone]);

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');

    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleCancel = () => {
    setFormValues(createFormState(currentUser));
    setFormErrors({});
    setSubmitError('');
  };

  const handleSave = async () => {
    const nextErrors = validateForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!isMockMode) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await currentUserRepository.updateCurrentUserProfile({
        fullName: formValues.fullName,
        phone: formValues.phone,
      });

      if (typeof onProfileSaved === 'function') {
        await onProfileSaved();
      }

      if (onFeedback) {
        onFeedback({ type: 'success', message: response?.message || 'Cập nhật thông tin thành công.' });
      }
    } catch (error) {
      setFormErrors(mapApiFieldErrors(error));
      setSubmitError(normalizeApiMessage(error, 'Không thể cập nhật thông tin.'));

      if (onFeedback) {
        onFeedback({ type: 'error', message: normalizeApiMessage(error, 'Không thể cập nhật thông tin.') });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled = !isMockMode || !hasChanges || isSubmitting;

  return (
    <section className={classes.card}>
      <div className={classes.headerRow}>
        <span className={classes.headerIconWrap}>
          <span className={classes.headerIcon}>person</span>
        </span>
        <h2 className={classes.title}>Thông tin cá nhân</h2>
      </div>

      <div className="flex flex-1 flex-col space-y-3.5">
        <div className={classes.formGrid}>
          <ProfileField
            variant={variant}
            label="Họ và tên"
            name="fullName"
            value={formValues.fullName}
            onChange={(value) => handleFieldChange('fullName', value)}
            error={formErrors.fullName}
          />

          <ProfileField
            variant={variant}
            label="Email"
            name="email"
            value={formValues.email}
            readOnly
          />

          <ProfileField
            variant={variant}
            label="Số điện thoại"
            name="phone"
            value={formValues.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            error={formErrors.phone}
          />

          <ProfileField
            variant={variant}
            label="Vai trò"
            name="role"
            value={formValues.role}
            readOnly
          />
        </div>

        <div className={classes.actionsRow}>
          <button
            type="button"
            className={classes.saveButton}
            disabled={isSaveDisabled}
            onClick={handleSave}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>

          <button type="button" className={classes.cancelButton} onClick={handleCancel}>
            Hủy
          </button>
        </div>

        {submitError ? <p className={classes.errorText}>{submitError}</p> : null}
      </div>
    </section>
  );
};

export default CurrentUserInfoCard;
