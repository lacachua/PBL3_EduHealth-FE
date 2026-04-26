import React from 'react';
import { ACCOUNT_BASE_CLASS, ACCOUNT_STATUS_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';
import RoleBadge from './RoleBadge';
import UserActionsMenu from './UserActionsMenu';
import { useAuth } from '../../../app/providers/useAuth';

const UserTable = ({ rows, onView, onEdit, onToggleStatus, onResetPassword }) => {
  const { user: currentUser } = useAuth();

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin] min-h-[360px]">
      <table className="min-w-[840px] w-full text-left text-sm">
        <thead className="app-table-head text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="px-4 py-2.5">Tài khoản</th>
            <th className="px-4 py-2.5">Liên hệ</th>
            <th className="px-4 py-2.5">Vai trò</th>
            <th className="px-4 py-2.5">Trạng thái</th>
            <th className="px-4 py-2.5">Cập nhật gần nhất</th>
            <th className="px-4 py-2.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {rows.map((row) => (
            <tr key={row.id} className="group app-interactive transition hover:bg-surface-container-low">
              <td className="px-4 py-3">
                <p className={`text-[14px] font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>{row.fullName}</p>
                <p className={`mt-0.5 text-xs ${ACCOUNT_BASE_CLASS.mutedText}`}>{row.username || row.email || '--'}</p>
              </td>
              <td className="px-4 py-3">
                <p className={`text-[13px] ${ACCOUNT_BASE_CLASS.bodyText}`}>{row.email || '--'}</p>
                <p className={`mt-0.5 text-xs ${ACCOUNT_BASE_CLASS.mutedText}`}>{row.phoneNumber || 'Chưa cập nhật số điện thoại'}</p>
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={row.role} label={row.roleLabel} />
              </td>
              <td className="px-4 py-3">
                <AccountPill className={ACCOUNT_STATUS_BADGE_CLASS_MAP[row.status] || 'border-outline-variant bg-surface-container-low text-on-surface-variant'}>
                  {row.statusLabel}
                </AccountPill>
              </td>
              <td className="px-4 py-3">{row.updatedAtLabel || '--'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end">
                  <UserActionsMenu
                    row={row}
                    currentUserId={currentUser?.id}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onResetPassword={onResetPassword}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
