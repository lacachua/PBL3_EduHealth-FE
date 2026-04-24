import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { validateFeedbackDraft } from '../adapters/notificationAdapters';
import { useNotificationsBellPanel } from '../hooks/useNotificationsBellPanel';
import { notificationsRepository } from '../repositories/notificationsRepository';
import NotificationDetailModal from './NotificationDetailModal';
import NotificationsBellPanel from './NotificationsBellPanel';

const isMobileViewport = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth < 640;
};

const buildReadNotification = (item) => ({
  ...item,
  currentRecipient: {
    ...(item.currentRecipient || {}),
    isRead: true,
    readAt: item.currentRecipient?.readAt || new Date().toISOString(),
  },
});

const NotificationsBellController = ({
  currentUser,
  viewerRole,
  fullPagePath,
  open,
  onClose,
  onUnreadChange,
}) => {
  const navigate = useNavigate();
  const role = String(viewerRole || currentUser?.role || 'STUDENT').toUpperCase();
  const {
    recentItems,
    recentSource,
    recentSourceNote,
    unreadCount,
    loading,
    error,
    capabilityState,
    refresh,
  } = useNotificationsBellPanel({
    currentUser,
    viewerRole: role,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSource, setFeedbackSource] = useState(capabilityState.feedbackSource);
  const [feedbackSourceNote, setFeedbackSourceNote] = useState('');
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  React.useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [onUnreadChange, unreadCount]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailLoading(false);
    setSelectedNotification(null);
    setFeedbackItems([]);
    setFeedbackLoading(false);
    setFeedbackDraft('');
    setFeedbackError('');
    setFeedbackSource(capabilityState.feedbackSource);
    setFeedbackSourceNote('');
  }, [capabilityState.feedbackSource]);

  const loadFeedbacks = useCallback(async (notificationId) => {
    setFeedbackLoading(true);
    try {
      const result = await notificationsRepository.getFeedbacks(notificationId, {
        currentUser,
        viewerRole: role,
      });
      setFeedbackItems(result.feedbacks || []);
      setFeedbackSource(String(result.source || capabilityState.feedbackSource));
      setFeedbackSourceNote(String(result.sourceNote || ''));
    } catch (apiError) {
      setFeedbackItems([]);
      setFeedbackSource('PENDING');
      setFeedbackSourceNote(normalizeApiMessage(apiError, 'Không thể tải phản hồi.'));
    } finally {
      setFeedbackLoading(false);
    }
  }, [capabilityState.feedbackSource, currentUser, role]);

  const openNotificationDetail = useCallback(async (notification) => {
    const notificationId = Number(notification?.notificationId || 0);
    if (!notificationId) {
      return;
    }

    if (isMobileViewport()) {
      onClose?.();
      navigate(fullPagePath, {
        state: {
          openNotificationId: notificationId,
        },
      });
      return;
    }

    setDetailOpen(true);
    setDetailLoading(true);
    setFeedbackDraft('');
    setFeedbackError('');

    try {
      const detail = await notificationsRepository.getNotificationDetail(notificationId, {
        currentUser,
        viewerRole: role,
      });

      let nextItem = detail.item || null;

      if (nextItem && !nextItem.currentRecipient?.isRead) {
        await notificationsRepository.markRead(nextItem.notificationId, {
          currentUser,
          viewerRole: role,
        });
        nextItem = buildReadNotification(nextItem);
      }

      setSelectedNotification(nextItem);
      await Promise.all([loadFeedbacks(notificationId), refresh()]);
    } catch (apiError) {
      setSelectedNotification({
        notificationId,
        title: 'Không thể mở chi tiết',
        content: normalizeApiMessage(apiError, 'Không thể tải chi tiết thông báo.'),
        type: 'GENERAL',
        typeLabel: 'Thông báo chung',
        createdByName: 'EduHealth',
        createdByRole: 'SYSTEM',
        createdAt: new Date().toISOString(),
        currentRecipient: { isRead: true },
        recipients: [],
        feedbackCount: 0,
        source: 'PENDING',
      });
      setFeedbackItems([]);
      setFeedbackSource('PENDING');
      setFeedbackSourceNote(normalizeApiMessage(apiError, 'Không thể tải phản hồi.'));
    } finally {
      setDetailLoading(false);
    }
  }, [currentUser, fullPagePath, loadFeedbacks, navigate, onClose, refresh, role]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllRead({
        currentUser,
        viewerRole: role,
      });
      await refresh();
    } catch {
      // Bell keeps the pending/mock status visible without interrupting navigation.
    }
  }, [currentUser, refresh, role]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!selectedNotification?.notificationId) {
      return;
    }

    const validation = validateFeedbackDraft({
      notificationId: selectedNotification.notificationId,
      content: feedbackDraft,
    });

    if (!validation.isValid) {
      setFeedbackError(validation.error);
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const result = await notificationsRepository.createFeedback(
        selectedNotification.notificationId,
        validation.payload,
        { currentUser, viewerRole: role },
      );
      setFeedbackSource(String(result.source || capabilityState.feedbackSource));
      setFeedbackSourceNote(String(result.sourceNote || ''));
      setFeedbackDraft('');
      await Promise.all([loadFeedbacks(selectedNotification.notificationId), refresh()]);
    } catch (apiError) {
      setFeedbackError(normalizeApiMessage(apiError, 'Không thể gửi phản hồi.'));
    } finally {
      setFeedbackSubmitting(false);
    }
  }, [capabilityState.feedbackSource, currentUser, feedbackDraft, loadFeedbacks, refresh, role, selectedNotification?.notificationId]);

  const canMarkAllRead = useMemo(
    () => capabilityState.markAllReadSupported,
    [capabilityState.markAllReadSupported],
  );

  return (
    <>
      <NotificationsBellPanel
        open={open}
        onClose={onClose}
        items={recentItems}
        unreadCount={unreadCount}
        loading={loading}
        error={error}
        source={recentSource}
        sourceNote={recentSourceNote}
        onViewAll={() => {
          onClose?.();
          navigate(fullPagePath);
        }}
        onSelectItem={openNotificationDetail}
        onMarkAllRead={handleMarkAllRead}
        canMarkAllRead={canMarkAllRead}
      />

      <NotificationDetailModal
        open={detailOpen}
        loading={detailLoading}
        item={selectedNotification}
        role={role}
        currentUser={currentUser}
        onClose={closeDetail}
        feedbackItems={feedbackItems}
        feedbackLoading={feedbackLoading}
        feedbackSource={feedbackSource}
        feedbackSourceNote={feedbackSourceNote}
        feedbackDraft={feedbackDraft}
        feedbackError={feedbackError}
        feedbackSubmitting={feedbackSubmitting}
        onFeedbackDraftChange={setFeedbackDraft}
        onFeedbackSubmit={handleFeedbackSubmit}
        onViewFullPage={() => {
          onClose?.();
          navigate(fullPagePath, {
            state: {
              openNotificationId: selectedNotification?.notificationId,
            },
          });
        }}
      />
    </>
  );
};

export default NotificationsBellController;
