import React from 'react';

const NotificationFeedbackForm = ({
  value,
  error,
  submitting,
  canReply,
  onChange,
  onSubmit,
}) => {
  return (
    <section className="rounded-2xl border border-outline-variant bg-surface px-3 py-3">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          Nội dung phản hồi
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={canReply ? 'Nhập phản hồi của bạn...' : 'Bạn không có quyền phản hồi thông báo này.'}
          disabled={!canReply || submitting}
          maxLength={1000}
          className="app-focus-ring app-input min-h-[96px] w-full rounded-2xl px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-65"
        />
      </label>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-on-surface-variant">{String(value || '').length}/1000 ký tự</span>
        {error ? <span className="text-xs font-semibold text-danger">{error}</span> : null}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canReply || submitting}
          className="app-focus-ring app-btn-primary px-3.5 disabled:cursor-not-allowed disabled:opacity-65"
        >
          <span className={`material-symbols-outlined text-[18px] ${submitting ? 'animate-spin' : ''}`}>
            {submitting ? 'progress_activity' : 'reply'}
          </span>
          Gửi phản hồi
        </button>
      </div>
    </section>
  );
};

export default NotificationFeedbackForm;
