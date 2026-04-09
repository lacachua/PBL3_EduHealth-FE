import React, { useMemo, useState } from 'react';
import EntityAvatar from '../../../shared/components/admin/EntityAvatar';
import RightDrawer from '../../../shared/components/admin/RightDrawer';
import EditableField from '../../../shared/components/form/EditableField';
import ReadonlyField from '../../../shared/components/form/ReadonlyField';
import { validateUserForm } from '../schemas/userManagementSchema';
import { ACCOUNT_STATUS_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';
import RoleBadge from './RoleBadge';

const createInitial = (user) => ({
  fullName: user?.fullName || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
});

const UserEditDrawerContent = ({
  user,
  submitting,
  apiErrors = {},
  onClose,
  onSubmit,
  onToggleStatus,
  onResetPassword,
}) => {
  const [form, setForm] = useState(() => createInitial(user));
  const [errors, setErrors] = useState({});

  const mergedErrors = useMemo(() => ({ ...apiErrors, ...errors }), [apiErrors, errors]);

  const readonlyValues = useMemo(() => ({
    id: user?.id || '--',
    username: user?.username || '--',
    role: user?.roleLabel || user?.role || '--',
    status: user?.statusLabel || user?.status || '--',
    createdAt: user?.createdAt || '--',
    updatedAt: user?.updatedAt || '--',
    lastLoginAt: user?.lastLoginAt || '--',
  }), [user]);

  const hasChanges = useMemo(() => {
    if (!user) {
      return false;
    }
    return form.fullName !== (user.fullName || '')
      || form.email !== (user.email || '')
      || form.phoneNumber !== (user.phoneNumber || '');
  }, [form, user]);

  const readonlyGrid = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Tên đăng nhập' },
    { key: 'role', label: 'Vai trò' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'createdAt', label: 'Ngày tạo' },
    { key: 'updatedAt', label: 'Ngày cập nhật' },
    { key: 'lastLoginAt', label: 'Lần đăng nhập gần nhất' },
  ];

  const avatarSrc = user?.avatarUrl || user?.photoUrl || user?.profileImageUrl || '';
  const statusBadgeClass = ACCOUNT_STATUS_BADGE_CLASS_MAP[user?.status]
    || 'border-outline-variant bg-surface-container-low text-on-surface-variant';

  const footer = (
    <div className="flex justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
      >
        Hủy
      </button>
      <button
        type="button"
        disabled={submitting || !hasChanges}
        onClick={async () => {
          const nextErrors = validateUserForm({ values: form, isEdit: true });
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            return;
          }
          await onSubmit(form);
          onClose();
        }}
        className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
      </button>
    </div>
  );

  return (
    <RightDrawer
      open
      onClose={onClose}
      title="Chỉnh sửa tài khoản"
      subtitle="Chỉ cập nhật các trường API cho phép"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-xs text-on-surface-variant">Các ô nền dịu là thông tin chỉ đọc. Các ô nền nổi bật là thông tin có thể chỉnh sửa.</p>

        <section className="rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-start gap-3">
            <EntityAvatar name={user?.fullName} imageUrl={avatarSrc} sizeClass="h-11 w-11" />
            <div>
              <h3 className="font-headline text-lg font-semibold text-on-surface">{user?.fullName || '--'}</h3>
              <p className="mt-0.5 text-sm text-on-surface-variant">{user?.email || user?.username || '--'}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={user?.role} label={user?.roleLabel} />
                <AccountPill className={statusBadgeClass}>{user?.statusLabel || user?.status || '--'}</AccountPill>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {readonlyGrid.map((item) => (
            <ReadonlyField
              key={item.key}
              label={item.label}
              value={readonlyValues[item.key]}
              showReadonlyBadge={false}
            />
          ))}

          <EditableField
            label="Họ tên"
            value={form.fullName}
            onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
            placeholder="Ví dụ: Nguyễn Thị Lan"
            error={mergedErrors.fullName}
          />
          <EditableField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            placeholder="Ví dụ: lan@yte.edu.vn"
            error={mergedErrors.email}
          />
          <EditableField
            label="Số điện thoại"
            value={form.phoneNumber}
            onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value }))}
            placeholder="Ví dụ: 0905123456"
            error={mergedErrors.phoneNumber}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
          <button
            type="button"
            onClick={() => onResetPassword(user)}
            className="rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning transition hover:bg-warning-soft/80"
          >
            Reset mật khẩu
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className="rounded-md border border-outline-variant bg-white px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            {user?.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          </button>
        </div>
      </div>
    </RightDrawer>
  );
};

const UserEditDrawer = ({ open, user, ...props }) => {
  if (!open || !user) {
    return null;
  }

  return <UserEditDrawerContent key={user.id || user.username || user.email} user={user} {...props} />;
};

export default UserEditDrawer;
