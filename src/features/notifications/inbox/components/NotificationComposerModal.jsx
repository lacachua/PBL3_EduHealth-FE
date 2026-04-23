import React from 'react';

const TYPE_OPTIONS = [
  { value: 'GENERAL', label: 'Thong bao chung' },
  { value: 'HEALTH_ALERT', label: 'Canh bao suc khoe' },
  { value: 'VACCINATION_REMINDER', label: 'Nhac tiem chung' },
  { value: 'MEDICINE_NOTICE', label: 'Thong bao thuoc' },
];

const SOURCE_BADGE_CLASS_MAP = {
  live: 'border-success/25 bg-success-soft text-success',
  mock: 'border-warning/30 bg-warning-soft text-warning',
  pending: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
};

const ErrorText = ({ text }) => {
  if (!text) {
    return null;
  }

  return <p className="mt-1 text-xs font-semibold text-danger">{text}</p>;
};

const NotificationComposerModal = ({
  open,
  onClose,
  draft,
  recipientIdsText,
  errors,
  submitting,
  source = 'pending',
  scopeLabel = '',
  onFieldChange,
  onRecipientTextChange,
  onSubmit,
}) => {
  if (!open) {
    return null;
  }

  const sourceBadgeClassName = SOURCE_BADGE_CLASS_MAP[source] || SOURCE_BADGE_CLASS_MAP.pending;
  const subtitle = source === 'live'
    ? `Nguon gui hien tai: LIVE. ${scopeLabel}`
    : source === 'mock'
      ? `Nguon gui hien tai: MOCK-READY. ${scopeLabel}`
      : `Nguon gui hien tai: PENDING. ${scopeLabel}`;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/45 px-0 py-0 backdrop-blur-[1px] sm:items-center sm:px-4 sm:py-6">
      <div className="w-full max-w-2xl rounded-t-3xl border border-outline-variant bg-surface shadow-[0_14px_40px_rgba(15,23,42,0.18)] sm:rounded-3xl">
        <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="app-overline">Soan thong bao</p>
              <h2 className="app-section-title mt-0.5">Soan thong bao</h2>
              <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="app-focus-ring app-btn-secondary h-9 w-9 rounded-full p-0"
              aria-label="Dong modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${sourceBadgeClassName}`}>
              Compose source: {String(source || 'pending').toUpperCase()}
            </span>
          </div>
        </header>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="app-overline">Loai thong bao</span>
              <select
                className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
                value={draft.type}
                onChange={(event) => onFieldChange('type', event.target.value)}
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ErrorText text={errors.type} />
            </label>

            <label className="space-y-1">
              <span className="app-overline">Gui theo lop</span>
              <input
                type="number"
                min="1"
                className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
                value={draft.classId}
                onChange={(event) => onFieldChange('classId', event.target.value)}
                placeholder="Nhap ma lop neu gui theo lop"
              />
            </label>
          </div>

          <label className="space-y-1">
            <span className="app-overline">Tieu de</span>
            <input
              type="text"
              className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
              value={draft.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
              placeholder="Nhap tieu de thong bao"
            />
            <ErrorText text={errors.title} />
          </label>

          <label className="space-y-1">
            <span className="app-overline">Noi dung</span>
            <textarea
              className="app-focus-ring app-input min-h-[120px] w-full rounded-2xl px-3 py-2.5"
              value={draft.content}
              onChange={(event) => onFieldChange('content', event.target.value)}
              placeholder="Nhap noi dung thong bao"
            />
            <ErrorText text={errors.content} />
          </label>

          <label className="space-y-1">
            <span className="app-overline">Nguoi nhan cu the</span>
            <input
              type="text"
              className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
              value={recipientIdsText}
              onChange={(event) => onRecipientTextChange(event.target.value)}
              placeholder="Tam thoi nhap userId, cach nhau bang dau phay. Recipient lookup theo ten dang cho backend."
            />
            <p className="text-xs text-on-surface-variant">
              Hien tai FE chua co live recipient lookup theo ten. Ban co the gui theo lop hoac danh sach nguoi nhan cu the tam thoi.
            </p>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="app-overline">Benh lien quan</span>
              <input
                type="number"
                min="1"
                className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
                value={draft.diseaseId}
                onChange={(event) => onFieldChange('diseaseId', event.target.value)}
                placeholder="Nhap ma benh neu co"
              />
            </label>

            <label className="space-y-1">
              <span className="app-overline">Dot tiem lien quan</span>
              <input
                type="number"
                min="1"
                className="app-focus-ring app-input h-11 w-full rounded-2xl px-3"
                value={draft.vaccinationId}
                onChange={(event) => onFieldChange('vaccinationId', event.target.value)}
                placeholder="Nhap ma dot tiem neu co"
              />
            </label>
          </div>

          <ErrorText text={errors.target} />
          <ErrorText text={errors.general} />
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-outline-variant px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="app-focus-ring app-btn-secondary px-3"
            disabled={submitting}
          >
            Huy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="app-focus-ring app-btn-primary px-3.5"
            disabled={submitting || source === 'pending'}
          >
            <span className={`material-symbols-outlined text-[18px] ${submitting ? 'animate-spin' : ''}`}>
              {submitting ? 'progress_activity' : 'send'}
            </span>
            Gui thong bao
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationComposerModal;
