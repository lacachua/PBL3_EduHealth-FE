import React from 'react';
import { ACCOUNT_BASE_CLASS, ACCOUNT_STATUS_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';
import RoleBadge from './RoleBadge';
import UserActionsMenu from './UserActionsMenu';

const UserTable = ({ rows, onView, onEdit, onToggleStatus, onResetPassword }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className={`border-b bg-surface-container-low text-left text-xs font-semibold uppercase tracking-[0.01em] ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.mutedText}`}>
          <tr>
            <th className="px-4 py-3">Tài khoản</th>
            <th className="px-4 py-3">Liên hệ</th>
            <th className="px-4 py-3">Vai trò</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Đăng nhập gần nhất</th>
            <th className="px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-surface-container-low">
              <td className="px-4 py-3">
                <p className={`font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>{row.fullName}</p>
                <p className={`mt-0.5 text-xs ${ACCOUNT_BASE_CLASS.mutedText}`}>{row.username || row.email || '--'}</p>
              </td>
              <td className="px-4 py-3">
                <p className={`text-sm ${ACCOUNT_BASE_CLASS.bodyText}`}>{row.email || '--'}</p>
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
              <td className={`px-4 py-3 text-sm ${ACCOUNT_BASE_CLASS.bodyText}`}>{row.lastLoginAt || '--'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end">
                  <UserActionsMenu
                    row={row}
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
