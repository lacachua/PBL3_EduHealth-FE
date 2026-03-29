import React, { useEffect, useState } from 'react';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';
import RoleBadge from './RoleBadge';
import AccountPill from './AccountPill';

const statusClassMap = {
  ACTIVE: 'border-[#EECFCC] bg-[#FBEDEC] text-[#B85C57]',
  LOCKED: 'border-[#CDE4D8] bg-[#EAF6EF] text-[#2E7D57]',
};

const UserStatusConfirmModal = ({ open, user, submitting, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!open || !user) {
    return null;
  }

  const isLockAction = user.status === 'ACTIVE';
  const title = isLockAction ? 'Khóa tài khoản' : 'Mở khóa tài khoản';
  const description = isLockAction
    ? 'Tài khoản này sẽ không thể đăng nhập và truy cập hệ thống cho đến khi được mở khóa.'
    : 'Tài khoản sẽ được kích hoạt lại và có thể đăng nhập vào hệ thống.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <button type="button" aria-label="Đóng" className="absolute inset-0 bg-[#0F172A]/38" onClick={onCancel} />
      <div className={`relative w-full max-w-lg rounded-xl border bg-[#FBFCFB] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.16)] ${ACCOUNT_BASE_CLASS.border}`}>
        <div className={`border-b pb-3 ${ACCOUNT_BASE_CLASS.border}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className={`material-symbols-outlined mt-0.5 text-[18px] ${isLockAction ? 'text-[#B85C57]' : 'text-[#2E7D57]'}`}>
                {isLockAction ? 'warning' : 'lock_open_right'}
              </span>
              <div>
                <h3 className={`text-lg font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>{title}</h3>
                <p className={`mt-1 text-sm leading-relaxed ${ACCOUNT_BASE_CLASS.mutedText}`}>{description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border bg-[#FBFCFB] transition hover:bg-[#F3F8F6] ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.mutedText}`}
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className={`mt-3 rounded-lg border bg-[#F7FAF8] p-3 ${ACCOUNT_BASE_CLASS.border}`}>
          <div className="grid grid-cols-[120px_1fr] gap-y-1 text-sm">
            <p className={ACCOUNT_BASE_CLASS.mutedText}>Họ tên</p>
            <p className={`font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>{user.fullName}</p>
            <p className={ACCOUNT_BASE_CLASS.mutedText}>Email</p>
            <p className={ACCOUNT_BASE_CLASS.bodyText}>{user.email}</p>
            <p className={ACCOUNT_BASE_CLASS.mutedText}>Vai trò</p>
            <RoleBadge role={user.role} label={user.roleLabel} />
            <p className={ACCOUNT_BASE_CLASS.mutedText}>Trạng thái hiện tại</p>
            <AccountPill className={statusClassMap[user.status] || 'border-[#D8E3DE] bg-[#F7FAF8] text-[#42534D]'}>
              {user.statusLabel}
            </AccountPill>
          </div>
        </div>

        {isLockAction ? (
          <div className="mt-3">
            <label className={`mb-1 block text-xs font-semibold ${ACCOUNT_BASE_CLASS.bodyText}`}>Lý do khóa (tùy chọn)</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Ghi chú nội bộ về lý do khóa tài khoản"
              className={`w-full resize-none rounded-lg border bg-[#FBFCFB] px-3 py-2 text-sm outline-none transition ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.headingText} ${ACCOUNT_BASE_CLASS.focusRing}`}
            />
          </div>
        ) : null}

        <div className={`mt-4 flex justify-end gap-2 border-t pt-3 ${ACCOUNT_BASE_CLASS.border}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition ${ACCOUNT_BASE_CLASS.secondaryButton}`}
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onConfirm(reason)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-semibold text-white transition disabled:opacity-60 ${isLockAction ? 'bg-[#B85C57] hover:bg-[#A34D49]' : ACCOUNT_BASE_CLASS.primaryButton}`}
          >
            {isLockAction ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusConfirmModal;
