import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/useAuth';
import NotificationComposerModal from './NotificationComposerModal';
import NotificationDetailModal from './NotificationDetailModal';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';
import NotificationSourceBadge from './NotificationSourceBadge';
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
    inboxSource,
    inboxSourceNote,
    sendSource,
    feedbackSource,
    feedbackSourceNote,
    lookupSourceNote,
    capabilityState,
    statusFilter,
    typeFilter,
    keyword,
    availableTypes,
    detailOpen,
    detailLoading,
    selectedNotification,
    feedbackItems,
    feedbackLoading,
    feedbackDraft,
    feedbackError,
    feedbackSubmitting,
    composerOpen,
    draft,
    draftErrors,
    submitting,
    preview,
    previewLoading,
    previewError,
    recipientOptions,
    classOptions,
    diseaseOptions,
    vaccinationOptions,
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
    setFeedbackDraft,
    submitDraft,
    submitFeedback,
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
        inboxSource={inboxSource}
        sendSource={sendSource}
        onRefresh={refreshInbox}
        onMarkAllRead={markAllRead}
        onCompose={openComposer}
        canCompose={capabilityState.canCompose}
        canMarkAllRead={summary.unread > 0}
        composeLabel={config.composeButtonLabel}
      />

      <NotificationSummaryCards summary={summary} showSent={config.canCompose} />

      {(inboxSourceNote || lookupSourceNote || feedback) ? (
        <section className="flex flex-wrap items-center gap-2">
          {inboxSourceNote ? (
            <span className="inline-flex rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs text-on-surface-variant">
              {inboxSourceNote}
            </span>
          ) : null}
          {lookupSourceNote ? (
            <span className="inline-flex rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs text-on-surface-variant">
              {lookupSourceNote}
            </span>
          ) : null}
          {feedback ? (
            <span className="inline-flex rounded-full border border-success/25 bg-success-soft px-3 py-1.5 text-xs text-success">
              {feedback}
            </span>
          ) : null}
        </section>
      ) : null}

      <article className="app-card-shell rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Danh sách thông báo</h2>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              Trạng thái đọc được lấy từ NotificationRecipient của người dùng hiện tại.
            </p>
          </div>
          <NotificationSourceBadge source={inboxSource} />
        </div>

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
      </article>

      <NotificationComposerModal
        open={composerOpen}
        role={role}
        config={config}
        onClose={closeComposer}
        draft={draft}
        errors={draftErrors}
        submitting={submitting}
        source={sendSource}
        onFieldChange={updateDraftField}
        onToggleRecipient={toggleRecipient}
        onSubmit={submitDraft}
        recipientOptions={recipientOptions}
        classOptions={classOptions}
        diseaseOptions={diseaseOptions}
        vaccinationOptions={vaccinationOptions}
        preview={preview}
        previewLoading={previewLoading}
        previewError={previewError}
      />

      <NotificationDetailModal
        open={detailOpen}
        loading={detailLoading}
        item={selectedNotification}
        role={role}
        currentUser={user}
        onClose={closeDetail}
        feedbackItems={feedbackItems}
        feedbackLoading={feedbackLoading}
        feedbackSource={feedbackSource}
        feedbackSourceNote={feedbackSourceNote}
        feedbackDraft={feedbackDraft}
        feedbackError={feedbackError}
        feedbackSubmitting={feedbackSubmitting}
        onFeedbackDraftChange={setFeedbackDraft}
        onFeedbackSubmit={submitFeedback}
      />
    </div>
  );
};

export default NotificationInboxWorkspace;
