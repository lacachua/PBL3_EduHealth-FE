import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/useAuth';
import NotificationComposerModal from './NotificationComposerModal';
import NotificationDetailModal from './NotificationDetailModal';
import { useNotificationInbox } from '../hooks/useNotificationInbox';

const SOURCE_BADGE_CLASS_MAP = {
  live: 'border-success/25 bg-success-soft text-success',
  mock: 'border-warning/30 bg-warning-soft text-warning',
  pending: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
};

const FILTER_ITEMS = [
  { id: 'all', label: 'Tat ca' },
  { id: 'unread', label: 'Chua doc' },
];

const TYPE_BADGE_CLASS_MAP = {
  GENERAL: 'border-info/25 bg-info-soft text-info',
  HEALTH_ALERT: 'border-danger/25 bg-danger-soft text-danger',
  VACCINATION_REMINDER: 'border-warning/25 bg-warning-soft text-warning',
  MEDICINE_NOTICE: 'border-success/25 bg-success-soft text-success',
};

const formatRelativeTime = (value) => {
  const timestamp = new Date(value || '').getTime();
  if (!Number.isFinite(timestamp)) {
    return '--';
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMinutes < 1) {
    return 'vua xong';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phut truoc`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} gio truoc`;
  }

  return `${Math.floor(diffHours / 24)} ngay truoc`;
};

const buildContextChips = (item) => {
  const context = item?.context || {};

  return [
    context?.className || context?.classId ? `Lop ${context.className || context.classId}` : '',
    context?.diseaseName || context?.diseaseId ? `Benh ${context.diseaseName || context.diseaseId}` : '',
    context?.vaccinationName || context?.vaccinationId ? `Tiem ${context.vaccinationName || context.vaccinationId}` : '',
  ].filter(Boolean);
};

const resolveComposeScopeLabel = (viewerRole, source) => {
  const role = String(viewerRole || '').toUpperCase();
  if (source === 'live' && role === 'NURSE') {
    return 'Gui theo lop hoc sinh hoac danh sach nguoi nhan cu the theo backend hien tai.';
  }

  if (source === 'mock' && role === 'ADMIN') {
    return 'Mock-ready cho luong gui den dieu duong hoc sinh khi backend chua mo role day du.';
  }

  if (source === 'mock' && role === 'STUDENT') {
    return 'Mock-ready cho luong gui yeu cau/phan hoi ve sau.';
  }

  return 'Scope hien tai dang phu thuoc source mock/pending cua backend notifications.';
};

const NotificationInboxWorkspace = ({
  viewerRole,
  title,
  subtitle,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items,
    loading,
    error,
    feedback,
    inboxSource,
    inboxSourceNote,
    sendSource,
    threadSource,
    threadSourceNote,
    capabilityState,
    activeTab,
    typeFilter,
    keyword,
    unreadCount,
    availableTypes,
    detailOpen,
    detailLoading,
    selectedNotification,
    threadItems,
    threadLoading,
    replyDraft,
    replyError,
    replySubmitting,
    composerOpen,
    draft,
    recipientIdsText,
    draftErrors,
    submitting,
    setActiveTab,
    setTypeFilter,
    setKeyword,
    setReplyDraft,
    refreshInbox,
    openDetail,
    closeDetail,
    markAllRead,
    openComposer,
    closeComposer,
    updateDraftField,
    updateRecipientText,
    submitDraft,
    submitReply,
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

  const visibleItems = useMemo(() => {
    if (activeTab === 'unread') {
      return items.filter((item) => !item?.isRead);
    }

    return items;
  }, [activeTab, items]);

  const inboxBadgeClassName = SOURCE_BADGE_CLASS_MAP[inboxSource] || SOURCE_BADGE_CLASS_MAP.pending;
  const sendBadgeClassName = SOURCE_BADGE_CLASS_MAP[sendSource] || SOURCE_BADGE_CLASS_MAP.pending;
  const showComposeButton = capabilityState.canCompose;
  const markAllEnabled = capabilityState.markAllReadSupported && unreadCount > 0;

  return (
    <div className="space-y-4 text-on-surface">
      <section className="app-panel-shell app-filter-toolbar flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="app-overline">Thong bao</p>
          <h1 className="app-section-title mt-0.5">{title}</h1>
          <p className="app-meta-text mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${inboxBadgeClassName}`}>
            Inbox: {String(inboxSource || 'pending').toUpperCase()}
          </span>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${sendBadgeClassName}`}>
            Compose: {String(sendSource || 'pending').toUpperCase()}
          </span>
          <button
            type="button"
            onClick={refreshInbox}
            className="app-focus-ring app-btn-secondary px-3"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Lam moi
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={!markAllEnabled}
            className="app-focus-ring app-btn-secondary px-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Danh dau da doc
          </button>
          {showComposeButton ? (
            <button
              type="button"
              onClick={openComposer}
              className="app-focus-ring app-btn-primary px-3.5"
            >
              <span className="material-symbols-outlined text-[18px]">edit_square</span>
              Soan thong bao
            </button>
          ) : null}
        </div>
      </section>

      {(inboxSourceNote || feedback || error) ? (
        <section className="flex flex-wrap items-center gap-2">
          {inboxSourceNote ? (
            <span className="inline-flex rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs text-on-surface-variant">
              {inboxSourceNote}
            </span>
          ) : null}
          {feedback ? (
            <span className="inline-flex rounded-full border border-success/25 bg-success-soft px-3 py-1.5 text-xs text-success">
              {feedback}
            </span>
          ) : null}
          {error ? (
            <span className="inline-flex rounded-full border border-danger/25 bg-danger-soft px-3 py-1.5 text-xs text-danger">
              {error}
            </span>
          ) : null}
        </section>
      ) : null}

      <article className="app-card-shell rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1">
              {FILTER_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`app-focus-ring rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeTab === item.id
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                  }`}
                >
                  {item.label}{item.id === 'unread' ? ` (${unreadCount})` : ''}
                </button>
              ))}
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="app-focus-ring app-input h-9 rounded-full px-3 text-xs"
            >
              <option value="">Tat ca loai</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tim theo tieu de, noi dung, nguoi gui"
              className="app-focus-ring app-input h-9 min-w-[240px] rounded-full px-3 text-xs"
            />
          </div>

          <div className="text-xs font-medium text-on-surface-variant">
            {visibleItems.length} thong bao hien thi
          </div>
        </div>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
            Dang tai danh sach thong bao...
          </div>
        ) : null}

        {!loading && !visibleItems.length ? (
          <div className="mt-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
            {inboxSource === 'pending'
              ? 'Thong bao dang cho backend inbox hoan thien. FE dang giu san giao dien va contract.'
              : 'Khong co thong bao phu hop voi bo loc hien tai.'}
          </div>
        ) : null}

        {!loading && visibleItems.length ? (
          <div className="mt-4 space-y-3">
            {visibleItems.map((item) => {
              const typeBadgeClass = TYPE_BADGE_CLASS_MAP[item.type] || TYPE_BADGE_CLASS_MAP.GENERAL;
              const contextChips = buildContextChips(item);

              return (
                <button
                  key={item.notificationId}
                  type="button"
                  onClick={() => openDetail(item.notificationId)}
                  className={`app-focus-ring app-interactive flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:border-primary/25 hover:bg-surface-container-low ${
                    item?.isRead
                      ? 'border-outline-variant bg-surface'
                      : 'border-primary/20 bg-primary-soft/10'
                  }`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item?.isRead ? 'bg-outline-variant' : 'bg-primary'}`} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-on-surface">{item.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-variant">
                          {item?.sender?.fullName || '--'} • {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${typeBadgeClass}`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">{item.content}</p>

                    {contextChips.length ? (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {contextChips.map((chip) => (
                          <span key={chip} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface-variant">
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
      </article>

      <NotificationComposerModal
        open={composerOpen}
        onClose={closeComposer}
        draft={draft}
        recipientIdsText={recipientIdsText}
        errors={draftErrors}
        submitting={submitting}
        source={sendSource}
        scopeLabel={resolveComposeScopeLabel(viewerRole, sendSource)}
        onFieldChange={updateDraftField}
        onRecipientTextChange={updateRecipientText}
        onSubmit={submitDraft}
      />

      <NotificationDetailModal
        open={detailOpen}
        loading={detailLoading}
        item={selectedNotification}
        onClose={closeDetail}
        threadItems={threadItems}
        threadLoading={threadLoading}
        threadSource={threadSource}
        threadSourceNote={threadSourceNote}
        replyDraft={replyDraft}
        replyError={replyError}
        replySubmitting={replySubmitting}
        onReplyDraftChange={setReplyDraft}
        onReplySubmit={submitReply}
      />
    </div>
  );
};

export default NotificationInboxWorkspace;
