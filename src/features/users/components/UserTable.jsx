import React, { useMemo } from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import { useAuth } from '../../../app/providers/useAuth';
import { STATUS_TONE_MAP } from '../constants/userManagementConstants';
import RoleBadge from './RoleBadge';
import UserActionsMenu from './UserActionsMenu';

const UserTable = ({ rows, onView, onEdit, onToggleStatus, onResetPassword }) => {
  const { user: currentUser } = useAuth();

  const columns = useMemo(() => [
    {
      key: 'account',
      header: 'Tài khoản',
      render: (row) => (
        <>
          <p className="text-[14px] font-semibold text-on-surface">{row.fullName}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{row.username || row.email || '--'}</p>
        </>
      ),
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      render: (row) => (
        <>
          <p className="text-[13px] text-on-surface-variant">{row.email || '--'}</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{row.phoneNumber || 'Chưa cập nhật số điện thoại'}</p>
        </>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (row) => <RoleBadge role={row.role} label={row.roleLabel} />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => (
        <StatusBadge tone={STATUS_TONE_MAP[row.status] || 'neutral'}>
          {row.statusLabel}
        </StatusBadge>
      ),
    },
    {
      key: 'updatedAtLabel',
      header: 'Cập nhật gần nhất',
      render: (row) => row.updatedAtLabel || '--',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <UserActionsMenu
          row={row}
          currentUserId={currentUser?.id}
          onView={onView}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onResetPassword={onResetPassword}
        />
      ),
    },
  ], [currentUser?.id, onView, onEdit, onToggleStatus, onResetPassword]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      containerClassName="overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin] min-h-[360px]"
      tableClassName="min-w-[840px] w-full text-left text-sm"
    />
  );
};

export default UserTable;
