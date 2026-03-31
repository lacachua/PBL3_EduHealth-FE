import React, { useEffect, useState } from 'react';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';
import RoleBadge from './RoleBadge';
import ConfirmDialog from '../../../shared/components/admin/ConfirmDialog';

const MODE_OPTIONS = [
  { value: 'TEMPORARY', label: 'Tạo mật khẩu tạm' },
  { value: 'CUSTOM', label: 'Đặt mật khẩu thủ công' },
];

const infoRowClass = 'grid grid-cols-[120px_1fr] gap-y-1 text-sm';

const InfoRow = ({ label, children }) => (
  <>
    <p className={ACCOUNT_BASE_CLASS.mutedText}>{label}</p>
    {children}
  </>
);

const ResetPasswordModal = ({ open, user, submitting, onCancel, onConfirm }) => {
  const [mode, setMode] = useState('TEMPORARY');
  const [newPassword, setNewPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
  }, [open, onCancel, user?.id]);

  if (!open || !user) {
    return null;
  }

  const userInfoRows = [
    {
      label: 'Họ tên',
      render: () => <p className={`font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>{user.fullName}</p>,
    },
    {
      label: 'Email',
      render: () => <p className={ACCOUNT_BASE_CLASS.bodyText}>{user.email}</p>,
    },
    {
      label: 'Vai trò',
      render: () => <RoleBadge role={user.role} label={user.roleLabel} />,
    },
  ];

  const handleAskConfirm = () => {
    if (mode === 'CUSTOM' && newPassword.trim().length < 6) {
      setFieldError('Mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }

    setFieldError('');
    setConfirmOpen(true);
  };

  const handleConfirmReset = async () => {
    const pendingPayload = mode === 'CUSTOM'
      ? { mode: 'CUSTOM', newPassword: newPassword.trim() }
      : { mode: 'TEMPORARY' };

    const response = await onConfirm(pendingPayload);
    const temporaryPassword = response?.data?.temporaryPassword;

    if (temporaryPassword) {
      setResult(temporaryPassword);
    }
    setConfirmOpen(false);
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <button type="button" aria-label="Đóng" className="absolute inset-0 bg-[#0F172A]/38" onClick={onCancel} />
      <div className={`relative w-full max-w-lg rounded-xl border bg-[#FBFCFB] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.16)] ${ACCOUNT_BASE_CLASS.border}`}>
        <div className={`border-b pb-3 ${ACCOUNT_BASE_CLASS.border}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${ACCOUNT_BASE_CLASS.headingText}`}>Reset mật khẩu</h3>
              <p className={`mt-1 text-sm leading-relaxed ${ACCOUNT_BASE_CLASS.mutedText}`}>
                Hệ thống sẽ tạo mật khẩu tạm mới cho tài khoản này.
              </p>
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
          <div className={infoRowClass}>
            {userInfoRows.map((item) => (
              <InfoRow key={item.label} label={item.label}>{item.render()}</InfoRow>
            ))}
          </div>
        </div>

        {!result ? (
          <div className="mt-3 space-y-2.5">
            <p className={`text-xs font-semibold ${ACCOUNT_BASE_CLASS.bodyText}`}>Chế độ reset</p>
            <div className="flex items-center gap-4 text-sm">
              {MODE_OPTIONS.map((item) => (
                <label key={item.value} className={`inline-flex cursor-pointer items-center gap-2 ${ACCOUNT_BASE_CLASS.bodyText}`}>
                  <input
                    type="radio"
                    name="reset-mode"
                    value={item.value}
                    checked={mode === item.value}
                    onChange={() => {
                      setMode(item.value);
                      setFieldError('');
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            {mode === 'CUSTOM' ? (
              <div>
                <label className={`mb-1 block text-xs font-semibold ${ACCOUNT_BASE_CLASS.bodyText}`}>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  placeholder="Tối thiểu 6 ký tự"
                  className={`w-full rounded-lg border bg-[#FBFCFB] px-3 py-2 text-sm outline-none transition ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.headingText} ${ACCOUNT_BASE_CLASS.focusRing}`}
                />
                {fieldError ? <p className="mt-1 text-xs font-medium text-[#B85C57]">{fieldError}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {result ? (
          <div className="mt-3 rounded-lg border border-[#D6E7DF] bg-[#EAF6EF] p-3">
            <p className="text-xs font-semibold text-[#2E7D57]">Mật khẩu tạm</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <code className="rounded bg-white px-2 py-1 text-sm font-semibold text-[#1F2A27]">{result}</code>
              <button
                type="button"
                onClick={handleCopy}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${ACCOUNT_BASE_CLASS.secondaryButton}`}
              >
                {copied ? 'Đã copy' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#2E7D57]">
              Vui lòng gửi an toàn cho người dùng và yêu cầu đổi mật khẩu sau khi đăng nhập.
            </p>
          </div>
        ) : null}

        <div className={`mt-4 flex justify-end gap-2 border-t pt-3 ${ACCOUNT_BASE_CLASS.border}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition ${ACCOUNT_BASE_CLASS.secondaryButton}`}
          >
            {result ? 'Đóng' : 'Hủy'}
          </button>
          {!result ? (
            <button
              type="button"
              disabled={submitting}
              onClick={handleAskConfirm}
              className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${ACCOUNT_BASE_CLASS.primaryButton}`}
            >
              {submitting ? 'Đang xử lý...' : 'Xác nhận reset'}
            </button>
          ) : null}
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title="Xác nhận reset mật khẩu"
          message={mode === 'CUSTOM'
            ? 'Mật khẩu mới bạn đã nhập sẽ ghi đè mật khẩu hiện tại của tài khoản này.'
            : 'Hệ thống sẽ tạo mật khẩu tạm mới và vô hiệu hóa mật khẩu hiện tại của tài khoản này.'}
          confirmLabel="Thực hiện reset"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmReset}
        />
      </div>
    </div>
  );
};

export default ResetPasswordModal;
