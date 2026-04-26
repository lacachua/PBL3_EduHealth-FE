import ActionDropdown from '../../../shared/components/admin/ActionDropdown';

const StudentActionsMenu = ({
  row,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  const isLocked = row.status === 'LOCKED' || row.status === 'INACTIVE';
  const hasAccountEndpointId = Boolean(row.userId);

  const items = [
    {
      id: 'view',
      label: 'Xem chi tiết',
      icon: 'visibility',
      onClick: () => onView?.(row),
    },
  ];

  if (onEdit) {
    items.push({
      id: 'edit',
      label: 'Chỉnh sửa',
      icon: 'edit',
      onClick: () => onEdit(row),
    });
  }

  if (hasAccountEndpointId && row.status && onToggleStatus) {
    items.push({
      id: 'toggle-status',
      label: isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
      icon: isLocked ? 'lock_open' : 'lock',
      tone: isLocked ? 'success' : 'danger',
      onClick: () => onToggleStatus(row),
    });
  }

  if (hasAccountEndpointId && onResetPassword) {
    items.push({
      id: 'reset-password',
      label: 'Đặt lại mật khẩu',
      icon: 'password',
      tone: 'warning',
      onClick: () => onResetPassword(row),
    });
  }

  return <ActionDropdown items={items} />;
};

export default StudentActionsMenu;
