import React from 'react';
import { getRoleLabel } from '../constants/notificationTypes';

const NotificationPreviewSummary = ({
  draft,
  preview,
  loading,
  error,
  imagePreviewUrl,
}) => {
  const recipients = preview?.recipients || [];
  const title = draft?.title || 'Tiêu đề thông báo...';
  const content = draft?.content || 'Nội dung thông báo sẽ hiển thị ở đây...';
  const visibilityMap = {
    INTERNAL: 'Nội bộ',
    PUBLIC: 'Bản tin y tế',
    BOTH: 'Nội bộ + Bản tin',
  };
  const visibilityLabel = visibilityMap[draft?.visibility] || 'Nội bộ';

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-on-surface">Xem trước & Gửi</h3>
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface">
        {imagePreviewUrl ? (
          <div className="aspect-[16/9] w-full overflow-hidden border-b border-outline-variant bg-surface-container-low">
            <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[21/9] w-full items-center justify-center border-b border-outline-variant bg-surface-container-low">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/50">image</span>
          </div>
        )}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {visibilityLabel}
            </span>
            {draft?.visibility !== 'PUBLIC' && draft?.targetMode !== 'ROLES' && (
              <span className="text-[11px] text-on-surface-variant">
                {loading ? 'Đang tải người nhận...' : `${Number(preview?.totalRecipients || 0)} người nhận`}
              </span>
            )}
            {draft?.visibility !== 'PUBLIC' && draft?.targetMode === 'ROLES' && (
              <span className="text-[11px] text-on-surface-variant">
                Theo nhóm vai trò
              </span>
            )}
          </div>
          <h4 className="line-clamp-2 font-semibold text-on-surface">{title}</h4>
          <p className="line-clamp-3 text-sm leading-6 text-on-surface-variant">{content}</p>
        </div>
      </div>

      {draft?.visibility !== 'PUBLIC' && (
        <section className="rounded-2xl border border-outline-variant bg-surface-container-low px-3 py-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Người nhận dự kiến</h4>
          {error ? <p className="mt-2 text-xs font-semibold text-danger">{error}</p> : null}
          
          {draft.targetMode === 'ROLES' ? (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-on-surface">Sẽ gửi đến tất cả người dùng thuộc nhóm:</p>
              <div className="flex flex-wrap gap-1.5">
                {(draft.targetRoles || []).map((targetRole) => (
                  <span key={targetRole} className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {targetRole === 'ADMIN' ? 'Quản trị viên' : targetRole === 'NURSE' ? 'Nhân viên y tế' : 'Học sinh'}
                  </span>
                ))}
                {!(draft.targetRoles || []).length && <p className="text-xs text-on-surface-variant italic">Chưa chọn vai trò nào.</p>}
              </div>
            </div>
          ) : recipients.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recipients.slice(0, 5).map((recipient) => (
                <span key={recipient.userId} className="inline-flex items-center rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-xs text-on-surface-variant">
                  {recipient.fullName} · {getRoleLabel(recipient.role)}
                </span>
              ))}
              {recipients.length > 5 ? (
                <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-xs text-on-surface-variant">
                  +{recipients.length - 5} người khác
                </span>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-sm text-on-surface-variant">Chưa có người nhận.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default NotificationPreviewSummary;
