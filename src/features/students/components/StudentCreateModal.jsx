import React, { useEffect } from 'react';
import StudentAccountSection from './StudentAccountSection';
import StudentHealthInitialSection from './StudentHealthInitialSection';
import StudentProfileSection from './StudentProfileSection';
import { useCreateStudentForm } from '../hooks/useCreateStudentForm';

const AvatarPlaceholder = () => (
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-soft bg-primary-soft text-xs font-bold text-primary">
    HS
  </span>
);

const StudentCreateModal = ({
  open,
  fromAdminUsers = false,
  onClose,
  onSuccess,
  classes = [],
  classesLoading = false,
  classesError = '',
}) => {
  const {
    formValues,
    fieldErrors,
    submitError,
    submitting,
    updateField,
    resetForm,
    submit,
  } = useCreateStudentForm();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-on-surface/32" onClick={onClose} aria-label="Đóng" />

      <div className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
        <div className="shrink-0 border-b border-outline-variant bg-surface-container-low px-4 py-3.5 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AvatarPlaceholder />
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface md:text-[1.2rem]">Tạo hồ sơ học sinh</h3>
                <p className="mt-1 text-sm text-on-surface-variant">Nhập thông tin cơ bản để tạo hồ sơ học sinh.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container-low"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <form
          id="student-create-modal-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await submit();
            if (!result.success) {
              return;
            }

            await onSuccess?.(result);
            resetForm();
            onClose?.();
          }}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-3 md:px-5 md:py-4"
        >
          <div className="space-y-3">
            {fromAdminUsers ? (
              <div className="flex items-start gap-2 rounded-md border border-secondary/20 bg-secondary/8 px-3 py-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base text-secondary">info</span>
                <p>Bạn đang tạo hồ sơ học sinh từ luồng quản lý người dùng.</p>
              </div>
            ) : null}

            {submitError ? (
              <div className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
                {submitError}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <StudentProfileSection
                values={formValues.profile}
                errors={fieldErrors}
                onChange={updateField}
                classes={classes}
                classesLoading={classesLoading}
                classesError={classesError}
              />
              <StudentAccountSection values={formValues.account} errors={fieldErrors} onChange={updateField} />
              <StudentHealthInitialSection values={formValues.health} errors={fieldErrors} onChange={updateField} />
            </div>
          </div>
        </form>

        <div className="shrink-0 border-t border-outline-variant bg-surface-container-lowest px-4 py-3 md:px-5">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-55"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="student-create-modal-form"
              disabled={submitting || classesLoading}
              className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? 'Đang xử lý...' : 'Tạo học sinh'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCreateModal;
