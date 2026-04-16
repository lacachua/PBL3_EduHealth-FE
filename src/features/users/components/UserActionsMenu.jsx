import React from 'react';
import AccountActionMenu from './AccountActionMenu';

const UserActionsMenu = ({ row, onView, onEdit, onToggleStatus, onResetPassword }) => {
  const isLocked = row.status === 'LOCKED';

  return (
    <AccountActionMenu
      items={[
        { id: 'view', label: 'Xem chi tiết', icon: 'visibility', onClick: () => onView(row) },
        { id: 'edit', label: 'Chỉnh sửa', icon: 'edit', onClick: () => onEdit(row) },
        {
          id: 'toggle-status',
          label: isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
          icon: isLocked ? 'lock_open' : 'lock',
          tone: isLocked ? 'success' : 'danger',
          onClick: () => onToggleStatus(row),
        },
        {
          id: 'reset-password',
          label: 'Đặt lại mật khẩu',
          icon: 'password',
          tone: 'warning',
          onClick: () => onResetPassword(row),
        },
      ]}
    />
  );
};

export default UserActionsMenu;
