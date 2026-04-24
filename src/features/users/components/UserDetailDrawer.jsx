import React from 'react';
import EntityAvatar from '../../../shared/components/core/EntityAvatar';
import RightDrawer from '../../../shared/components/core/RightDrawer';
import RetryState from '../../../shared/components/form/RetryState';
import SectionAlert from '../../../shared/components/form/SectionAlert';
import { ACCOUNT_STATUS_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';
import RoleBadge from './RoleBadge';

const infoRowClass = 'grid grid-cols-[145px_1fr] gap-x-3 gap-y-1.5 py-1.5 text-sm';

const InfoRow = ({ label, children }) => (
  <div className={infoRowClass}>
    <p className="text-on-surface-variant">{label}</p>
    <div className="text-on-surface">{children}</div>
  </div>
);

const UserDetailDrawer = ({
  open,
  user,
  loading,
  error,
  syncMessage,
  onClose,
  onRetry,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  const avatarSrc = user?.avatarUrl || user?.photoUrl || user?.profileImageUrl || '';
  const statusBadgeClass = ACCOUNT_STATUS_BADGE_CLASS_MAP[user?.status]
    || 'border-outline-variant bg-surface-container-low text-on-surface-variant';

  const actionButtonClass = 'app-focus-ring rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low';

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết tài khoản"
      subtitle="Xem thông tin và thao tác quản trị tài khoản"
    >
      {loading && !user ? (
        <p className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface-variant">Đang tải chi tiết tài khoản...</p>
      ) : null}

      {!loading && error && !user ? (
        <RetryState
          title="Chưa thể tải dữ liệu mới"
          description="Không thể lấy chi tiết tài khoản từ máy chủ. Vui lòng thử lại."
          onRetry={onRetry}
        />
      ) : null}

      {user ? (
        <div className="space-y-3.5">
          {syncMessage ? <SectionAlert message={syncMessage} tone="warning" /> : null}
          {loading ? <SectionAlert message="Đang đồng bộ dữ liệu mới từ máy chủ..." tone="info" /> : null}

          <section className="rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
            <div className="flex items-start gap-3">
              <EntityAvatar name={user.fullName} imageUrl={avatarSrc} />
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">{user.fullName || '--'}</h3>
                <p className="mt-0.5 text-sm text-on-surface-variant">{user.email || user.username || '--'}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <RoleBadge role={user.role} label={user.roleLabel} />
                  <AccountPill className={statusBadgeClass}>{user.statusLabel}</AccountPill>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5">
            <InfoRow label="ID">{user.id || '--'}</InfoRow>
            <InfoRow label="Họ tên">{user.fullName || '--'}</InfoRow>
            <InfoRow label="Tên đăng nhập">{user.username || '--'}</InfoRow>
            <InfoRow label="Email đăng nhập">{user.email || '--'}</InfoRow>
            <InfoRow label="Số điện thoại">{user.phoneNumber || '--'}</InfoRow>
            <InfoRow label="Vai trò"><RoleBadge role={user.role} label={user.roleLabel} /></InfoRow>
            <InfoRow label="Trạng thái"><AccountPill className={statusBadgeClass}>{user.statusLabel}</AccountPill></InfoRow>
            <InfoRow label="Ngày tạo">{user.createdAtLabel || '--'}</InfoRow>
            <InfoRow label="Ngày cập nhật">{user.updatedAtLabel || '--'}</InfoRow>
            <InfoRow label="Lần đăng nhập gần nhất">{user.lastLoginAtLabel || '--'}</InfoRow>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-outline-variant pt-3">
            <button type="button" className="app-focus-ring rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]" onClick={() => onEdit(user)}>
              Chỉnh sửa
            </button>
            <button type="button" className={actionButtonClass} onClick={() => onToggleStatus(user)}>
              {user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
            </button>
            <button type="button" className="app-focus-ring rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning transition hover:bg-warning-soft/80" onClick={() => onResetPassword(user)}>
              Đặt lại mật khẩu
            </button>
          </div>
        </div>
      ) : null}
    </RightDrawer>
  );
};

export default UserDetailDrawer;
