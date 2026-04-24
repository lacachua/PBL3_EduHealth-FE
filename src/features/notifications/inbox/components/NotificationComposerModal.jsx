import React from 'react';
import { getNotificationTypeMeta } from '../constants/notificationTypes';
import NotificationPreviewRecipients from './NotificationPreviewRecipients';
import NotificationRelatedFields from './NotificationRelatedFields';
import NotificationSourceBadge from './NotificationSourceBadge';
import NotificationTargetSelector from './NotificationTargetSelector';

const ErrorText = ({ text }) => {
  if (!text) {
    return null;
  }

  return <p className="mt-1 text-xs font-semibold text-danger">{text}</p>;
};

const NotificationComposerModal = ({
  open,
  role,
  config,
  onClose,
  draft,
  errors = {},
  submitting,
  source = 'MOCK',
  onFieldChange,
  onToggleRecipient,
  onSubmit,
  recipientOptions,
  classOptions,
  diseaseOptions,
  vaccinationOptions,
  preview,
  previewLoading,
  previewError,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/45 px-0 py-0 backdrop-blur-[1px] sm:items-center sm:px-4 sm:py-6">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-outline-variant bg-surface shadow-[0_14px_40px_rgba(15,23,42,0.18)] sm:rounded-3xl">
        <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="app-overline">{role === 'STUDENT' ? 'Yêu cầu hỗ trợ' : 'Soạn thông báo'}</p>
              <h2 className="app-section-title mt-0.5">{config.modalTitle}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Dữ liệu người nhận và thông tin liên quan được chọn từ danh sách, không nhập raw ID.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="app-focus-ring app-btn-secondary h-9 w-9 rounded-full p-0"
              aria-label="Đóng modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <NotificationSourceBadge source={source} label={source === 'LIVE' ? 'Gửi thật' : 'Gửi mẫu'} />
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          <section className="space-y-3 rounded-2xl border border-outline-variant bg-surface-container-low px-3 py-3">
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Nội dung</h3>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                Chọn đúng loại để hệ thống chỉ hiển thị các trường liên quan.
              </p>
            </div>

            <label className="space-y-1">
              <span className="app-overline">{role === 'STUDENT' ? 'Loại yêu cầu' : 'Loại thông báo'}</span>
              <select
                className="app-focus-ring app-input h-11 w-full rounded-xl px-3"
                value={draft.type}
                onChange={(event) => onFieldChange('type', event.target.value)}
              >
                {config.allowedTypes.map((type) => (
                  <option key={type} value={type}>
                    {getNotificationTypeMeta(type, role).label}
                  </option>
                ))}
              </select>
              <ErrorText text={errors.type} />
            </label>

            <label className="space-y-1">
              <span className="app-overline">Tiêu đề</span>
              <input
                type="text"
                className="app-focus-ring app-input h-11 w-full rounded-xl px-3"
                value={draft.title}
                onChange={(event) => onFieldChange('title', event.target.value)}
                placeholder={role === 'STUDENT' ? 'Nhập tiêu đề yêu cầu' : 'Nhập tiêu đề thông báo'}
              />
              <ErrorText text={errors.title} />
            </label>

            <label className="space-y-1">
              <span className="app-overline">Nội dung</span>
              <textarea
                className="app-focus-ring app-input min-h-[120px] w-full rounded-xl px-3 py-2.5"
                value={draft.content}
                onChange={(event) => onFieldChange('content', event.target.value)}
                placeholder={config.contentPlaceholder}
              />
              <ErrorText text={errors.content} />
            </label>
          </section>

          <NotificationTargetSelector
            config={config}
            role={role}
            draft={draft}
            errors={errors}
            classOptions={classOptions}
            recipientOptions={recipientOptions}
            onFieldChange={onFieldChange}
            onToggleRecipient={onToggleRecipient}
          />

          <NotificationRelatedFields
            role={role}
            draft={draft}
            diseaseOptions={diseaseOptions}
            vaccinationOptions={vaccinationOptions}
            onFieldChange={onFieldChange}
          />

          <NotificationPreviewRecipients
            preview={preview}
            loading={previewLoading}
            error={previewError}
          />

          <ErrorText text={errors.general} />
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-outline-variant px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="app-focus-ring app-btn-secondary px-3"
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="app-focus-ring app-btn-primary px-3.5"
            disabled={submitting}
          >
            <span className={`material-symbols-outlined text-[18px] ${submitting ? 'animate-spin' : ''}`}>
              {submitting ? 'progress_activity' : 'send'}
            </span>
            {config.submitLabel}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationComposerModal;
