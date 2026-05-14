import React from 'react';
import { getNotificationTypeMeta } from '../constants/notificationTypes';
import NotificationPreviewSummary from './NotificationPreviewRecipients';
import NotificationRelatedFields from './NotificationRelatedFields';
import NotificationTargetSelector from './NotificationTargetSelector';
import NotificationImageUploadField from './NotificationImageUploadField';

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
  onFieldChange,
  onToggleRecipient,
  onSubmit,
  onImageSelect,
  onImageClear,
  imageFileName,
  imagePreviewUrl,
  imageUploading,
  imageUploadError,
  recipientOptions,
  classOptions,
  diseaseOptions,
  vaccinationOptions,
  preview,
  previewLoading,
  previewError,
  showRecipients,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/45 px-0 py-0 backdrop-blur-[1px] sm:items-center sm:px-4 sm:py-6">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-outline-variant bg-surface shadow-[0_14px_40px_rgba(15,23,42,0.18)] sm:rounded-3xl">
        <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="app-overline">{role === 'STUDENT' ? 'Yêu cầu hỗ trợ' : 'Soạn thông báo'}</p>
              <h2 className="app-section-title mt-0.5">{config.modalTitle}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Chọn đúng phạm vi hiển thị và người nhận để thông báo được gửi đúng đối tượng.
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

          <div className="mt-3" />
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-4">
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

            <div className="space-y-2">
              <span className="app-overline">Phạm vi hiển thị</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { value: 'INTERNAL', label: 'Nội bộ', desc: 'Gửi vào hộp thư người nhận.' },
                  { value: 'PUBLIC', label: 'Public bản tin', desc: 'Hiển thị ngoài trang bản tin y tế.' },
                  { value: 'BOTH', label: 'Nội bộ + Public', desc: 'Vừa gửi hộp thư, vừa hiện ngoài bản tin.' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      draft.visibility === option.value
                        ? 'border-primary bg-primary-soft/10'
                        : 'border-outline-variant bg-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={draft.visibility === option.value}
                      onChange={(e) => onFieldChange('visibility', e.target.value)}
                      className="mt-0.5 h-4 w-4 text-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{option.label}</p>
                      <p className="text-xs text-on-surface-variant">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <ErrorText text={errors.visibility} />
            </div>

            <NotificationImageUploadField
              onImageSelect={onImageSelect}
              onImageClear={onImageClear}
              imageFileName={imageFileName}
              imagePreviewUrl={imagePreviewUrl}
              imageUploading={imageUploading}
              imageUploadError={imageUploadError}
            />
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
            showRecipients={showRecipients}
          />

          <NotificationRelatedFields
            role={role}
            draft={draft}
            diseaseOptions={diseaseOptions}
            vaccinationOptions={vaccinationOptions}
            onFieldChange={onFieldChange}
          />

          <ErrorText text={errors.general} />
            </div>

            <aside className="hidden md:block">
              <div className="sticky top-0">
                <NotificationPreviewSummary
                  draft={draft}
                  preview={preview}
                  loading={previewLoading}
                  error={previewError}
                  imagePreviewUrl={imagePreviewUrl}
                />
              </div>
            </aside>
          </div>
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
