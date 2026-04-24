import React from 'react';

const SOURCE_TONE_CLASS_MAP = {
  live: 'border-success/25 bg-success-soft text-success',
  mock: 'border-warning/30 bg-warning-soft text-warning',
  pending: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
};

const formatDateTime = (value) => {
  if (!value) {
    return '--';
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return '--';
  }

  return timestamp.toLocaleString('vi-VN');
};

const NotificationDetailModal = ({
  open,
  loading,
  item,
  onClose,
  threadItems = [],
  threadLoading = false,
  threadSource = 'pending',
  threadSourceNote = '',
  replyDraft = '',
  replyError = '',
  replySubmitting = false,
  onReplyDraftChange,
  onReplySubmit,
  onViewFullPage,
}) => {
  if (!open) {
    return null;
  }

  const sourceToneClassName = SOURCE_TONE_CLASS_MAP[threadSource] || SOURCE_TONE_CLASS_MAP.pending;
  const canReply = threadSource === 'mock' || threadSource === 'live';
  const senderName = item?.sender?.fullName || '--';
  const senderRole = item?.sender?.role || '';
  const context = item?.context || {};
  const contextChips = [
    context?.className || context?.classId ? `Lop: ${context.className || context.classId}` : '',
    context?.diseaseName || context?.diseaseId ? `Benh: ${context.diseaseName || context.diseaseId}` : '',
    context?.vaccinationName || context?.vaccinationId ? `Dot tiem: ${context.vaccinationName || context.vaccinationId}` : '',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/45 px-0 py-0 backdrop-blur-[1px] sm:items-center sm:px-4 sm:py-6">
      <div className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-outline-variant bg-surface shadow-[0_16px_44px_rgba(15,23,42,0.18)] sm:h-auto sm:max-h-[88vh] sm:rounded-3xl">
        <header className="flex items-start justify-between gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p className="app-overline">Chi tiet thong bao</p>
            <h2 className="app-section-title mt-0.5 line-clamp-2">{item?.title || 'Dang tai...'}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="inline-flex items-center rounded-full border border-info/20 bg-info-soft px-2 py-0.5 font-semibold text-info">
                {item?.type || 'GENERAL'}
              </span>
              <span>{senderName}{senderRole ? ` • ${senderRole}` : ''}</span>
              <span>{formatDateTime(item?.createdAt)}</span>
              <span>{item?.isRead ? 'Da doc' : 'Chua doc'}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {onViewFullPage ? (
              <button
                type="button"
                onClick={onViewFullPage}
                className="app-focus-ring app-btn-secondary hidden px-3 text-xs sm:inline-flex"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Xem trong trang
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="app-focus-ring app-btn-secondary h-9 w-9 rounded-full p-0" aria-label="Dong chi tiet">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {loading ? (
            <p className="text-sm text-on-surface-variant">Dang tai chi tiet thong bao...</p>
          ) : (
            <div className="space-y-5">
              {contextChips.length ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {contextChips.map((chip) => (
                    <span key={chip} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs font-medium text-on-surface-variant">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}

              <section className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5">
                <p className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
                  {item?.content || 'Khong co noi dung.'}
                </p>
                {item?.readAt ? (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    Da doc luc {formatDateTime(item.readAt)}
                  </p>
                ) : null}
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface">Phan hoi</h3>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      Chuoi phan hoi duoc dat san theo huong future-ready. Neu backend chua support, FE se hien pending/mock ro rang.
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${sourceToneClassName}`}>
                    Reply source: {String(threadSource || 'pending').toUpperCase()}
                  </span>
                </div>

                {threadSourceNote ? (
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant">
                    {threadSourceNote}
                  </div>
                ) : null}

                <div className="max-h-[220px] space-y-2 overflow-y-auto rounded-2xl border border-outline-variant bg-surface px-3 py-3">
                  {threadLoading ? (
                    <p className="text-sm text-on-surface-variant">Dang tai chuoi phan hoi...</p>
                  ) : null}

                  {!threadLoading && !threadItems.length ? (
                    <p className="text-sm text-on-surface-variant">Chua co phan hoi nao cho thong bao nay.</p>
                  ) : null}

                  {!threadLoading && threadItems.length ? threadItems.map((reply) => (
                    <article key={reply.replyId} className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-on-surface">{reply?.sender?.fullName || '--'}</span>
                        <span className="text-on-surface-variant">{formatDateTime(reply?.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-on-surface-variant">{reply?.content || ''}</p>
                    </article>
                  )) : null}
                </div>

                <div className="rounded-2xl border border-outline-variant bg-surface px-3 py-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                      Phan hoi thong bao
                    </span>
                    <textarea
                      value={replyDraft}
                      onChange={(event) => onReplyDraftChange?.(event.target.value)}
                      placeholder={canReply ? 'Nhap noi dung phan hoi...' : 'Reply se duoc bat khi backend co thread/replies hoac khi mock fallback duoc bat.'}
                      disabled={!canReply || replySubmitting}
                      className="app-focus-ring app-input min-h-[96px] w-full rounded-2xl px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-65"
                    />
                  </label>

                  {replyError ? (
                    <p className="mt-2 text-xs font-semibold text-danger">{replyError}</p>
                  ) : null}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={onReplySubmit}
                      disabled={!canReply || replySubmitting}
                      className="app-focus-ring app-btn-primary px-3.5 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${replySubmitting ? 'animate-spin' : ''}`}>
                        {replySubmitting ? 'progress_activity' : 'reply'}
                      </span>
                      Gui phan hoi
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
