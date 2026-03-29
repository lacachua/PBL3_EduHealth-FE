import React, { useEffect, useMemo, useState } from 'react';
import { USER_ROLES, validateUserForm } from '../schemas/userManagementSchema';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';

const initialForm = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  role: USER_ROLES.NURSE,
};

const CreateNurseAccountModal = ({
  open,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

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

  const isFormValid = useMemo(() => {
    const nextErrors = validateUserForm({ values: form, isEdit: false });
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-on-surface/32" onClick={onClose} aria-label="Đóng" />
      <div className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
        <div className="shrink-0 border-b border-outline-variant bg-surface-container-low px-4 py-3.5 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-headline text-lg font-semibold text-on-surface md:text-[1.2rem]">Tạo tài khoản nhân viên y tế</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Vai trò được cố định là Nhân viên y tế theo nghiệp vụ hệ thống.</p>
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

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 md:px-5 md:py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <EditableField
              label="Tên đăng nhập"
              value={form.username}
              onChange={(value) => setForm((prev) => ({ ...prev, username: value }))}
              placeholder="Ví dụ: nurse01"
              error={errors.username}
            />
            <EditableField
              label="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
              placeholder="Tối thiểu 6 ký tự"
              error={errors.password}
            />
            <EditableField
              label="Họ tên"
              value={form.fullName}
              onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
              placeholder="Ví dụ: Nguyễn Thị Lan"
              error={errors.fullName}
            />
            <EditableField
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
              placeholder="Ví dụ: lan@yte.edu.vn"
              error={errors.email}
            />
            <EditableField
              label="Số điện thoại"
              value={form.phoneNumber}
              onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value }))}
              placeholder="Ví dụ: 0905123456"
              error={errors.phoneNumber}
            />
            <ReadonlyField label="Vai trò" value="Nhân viên y tế" showReadonlyBadge={false} />
          </div>
        </div>

        <div className="shrink-0 border-t border-outline-variant bg-surface-container-lowest px-4 py-3 md:px-5">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={submitting || !isFormValid}
              onClick={async () => {
                const nextErrors = validateUserForm({ values: form, isEdit: false });
                setErrors(nextErrors);
                if (Object.keys(nextErrors).length) {
                  return;
                }
                await onSubmit(form);
                onClose();
              }}
              className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNurseAccountModal;
