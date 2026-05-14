import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/useAuth';
import NotificationComposerModal from './NotificationComposerModal';
import NotificationDetailModal from './NotificationDetailModal';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';
import SentNotificationList from './SentNotificationList';
import NotificationSummaryCards from './NotificationSummaryCards';
import NotificationToolbar from './NotificationToolbar';
import { useNotificationInbox } from '../hooks/useNotificationInbox';

const NotificationInboxWorkspace = ({
  viewerRole,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    role,
    config,
    items,
    loading,
    error,
    feedback,
    summary,
    capabilityState,
    currentTab,
    sentItems,
    sentLoading,
    sentError,
    statusFilter,
    typeFilter,
    keyword,
    availableTypes,
    detailOpen,
    detailLoading,
    selectedNotification,
    composerOpen,
    draft,
    draftErrors,
    submitting,
    preview,
    previewLoading,
    previewError,
    imageUploading,
    imageUploadError,
    imageFileName,
    imagePreviewUrl,
    recipientOptions,
    classOptions,
    diseaseOptions,
    vaccinationOptions,
    showRecipients,
    setCurrentTab,
    setStatusFilter,
    setTypeFilter,
    setKeyword,
    refreshInbox,
    openDetail,
    closeDetail,
    markAllRead,
    openComposer,
    closeComposer,
    updateDraftField,
    toggleRecipient,
    handleImageSelect,
    clearImageUpload,
    submitDraft,
  } = useNotificationInbox({
    currentUser: user,
    viewerRole,
  });

  useEffect(() => {
    const notificationId = location.state?.openNotificationId;
    if (!notificationId) {
      return;
    }

    openDetail(notificationId);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state?.openNotificationId, navigate, openDetail]);

  return (
    <div className="space-y-4 text-on-surface">
      <NotificationHeader
        title={config.pageTitle}
        subtitle={config.subtitle}
        onRefresh={refreshInbox}
        onMarkAllRead={markAllRead}
        onCompose={openComposer}
        canCompose={capabilityState.canCompose}
        canMarkAllRead={summary.unread > 0}
        composeLabel={config.composeButtonLabel}
      />

      <NotificationSummaryCards summary={summary} showSent={role !== 'STUDENT'} />

      {feedback ? (
        <section className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-success/25 bg-success-soft px-3 py-1.5 text-xs text-success">
            {feedback}
          </span>
        </section>
      ) : null}

      {role !== 'STUDENT' ? (
        <div className="flex gap-6 border-b border-outline-variant px-2 sm:px-4">
          <button
            type="button"
            className={`pb-3 text-sm font-semibold border-b-2 transition ${currentTab === 'inbox' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'}`}
            onClick={() => setCurrentTab('inbox')}
          >
            Hộp thư đến
          </button>
          <button
            type="button"
            className={`pb-3 text-sm font-semibold border-b-2 transition ${currentTab === 'sent' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'}`}
            onClick={() => setCurrentTab('sent')}
          >
            Đã gửi
          </button>
        </div>
      ) : null}

      <article className="app-card-shell rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-on-surface">
              {currentTab === 'inbox' ? 'Danh sách thông báo' : 'Thông báo đã gửi'}
            </h2>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              {currentTab === 'inbox' ? 'Danh sách các thông báo được gửi đến bạn.' : 'Các thông báo và bản tin bạn đã tạo và gửi đi.'}
            </p>
          </div>
        </div>

        {currentTab === 'inbox' ? (
          <>
            <NotificationToolbar
              role={role}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              keyword={keyword}
              availableTypes={availableTypes}
              onStatusFilterChange={setStatusFilter}
              onTypeFilterChange={setTypeFilter}
              onKeywordChange={setKeyword}
            />

            <NotificationList
              role={role}
              items={items}
              loading={loading}
              error={error}
              emptyTitle={config.emptyTitle}
              emptyDescription={config.emptyDescription}
              onOpen={openDetail}
              onRetry={refreshInbox}
            />
          </>
        ) : (
          <SentNotificationList
            role={role}
            items={sentItems}
            loading={sentLoading}
            error={sentError}
            onOpen={openDetail}
            onRetry={refreshInbox}
          />
        )}
      </article>

      <NotificationComposerModal
        open={composerOpen}
        role={role}
        config={config}
        onClose={closeComposer}
        draft={draft}
        errors={draftErrors}
        submitting={submitting}
        onFieldChange={updateDraftField}
        onToggleRecipient={toggleRecipient}
        onSubmit={submitDraft}
        onImageSelect={handleImageSelect}
        onImageClear={clearImageUpload}
        imageFileName={imageFileName}
        imagePreviewUrl={imagePreviewUrl}
        imageUploading={imageUploading}
        imageUploadError={imageUploadError}
        recipientOptions={recipientOptions}
        classOptions={classOptions}
        diseaseOptions={diseaseOptions}
        vaccinationOptions={vaccinationOptions}
        preview={preview}
        previewLoading={previewLoading}
        previewError={previewError}
        showRecipients={showRecipients}
      />

      <NotificationDetailModal
        open={detailOpen}
        loading={detailLoading}
        item={selectedNotification}
        role={role}
        currentUser={user}
        onClose={closeDetail}
      />
    </div>
  );
};

export default NotificationInboxWorkspace;
