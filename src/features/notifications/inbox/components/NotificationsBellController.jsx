import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
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

const NotificationsBellController = ({
  currentUser,
  viewerRole,
  fullPagePath,
  open,
  onClose,
  onUnreadChange,
}) => {
  const navigate = useNavigate();
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
    viewerRole,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [threadItems, setThreadItems] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadSource, setThreadSource] = useState(capabilityState.threadSource);
  const [threadSourceNote, setThreadSourceNote] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  React.useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [onUnreadChange, unreadCount]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailLoading(false);
    setSelectedNotification(null);
    setThreadItems([]);
    setThreadLoading(false);
    setReplyDraft('');
    setReplyError('');
    setThreadSource(capabilityState.threadSource);
    setThreadSourceNote('');
  }, [capabilityState.threadSource]);

  const loadThread = useCallback(async (notificationId) => {
    setThreadLoading(true);
    try {
      const result = await notificationsRepository.getThread({
        notificationId,
        currentUser,
        viewerRole,
      });
      setThreadItems(result.replies || []);
      setThreadSource(String(result.source || capabilityState.threadSource));
      setThreadSourceNote(String(result.sourceNote || ''));
    } catch (apiError) {
      setThreadItems([]);
      setThreadSource('pending');
      setThreadSourceNote(normalizeApiMessage(apiError, 'Khong the tai chuoi phan hoi.'));
    } finally {
      setThreadLoading(false);
    }
  }, [capabilityState.threadSource, currentUser, viewerRole]);

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
    setReplyDraft('');
    setReplyError('');

    try {
      const detail = await notificationsRepository.getDetail({
        notificationId,
        currentUser,
        viewerRole,
      });

      setSelectedNotification(detail.item || null);

      if (detail.item && !detail.item.isRead) {
        await notificationsRepository.markRead({
          notificationId: detail.item.notificationId,
          currentUser,
          viewerRole,
        });
        setSelectedNotification((previous) => previous ? {
          ...previous,
          isRead: true,
          readAt: previous.readAt || new Date().toISOString(),
        } : previous);
      }

      await Promise.all([loadThread(notificationId), refresh()]);
    } catch (apiError) {
      setSelectedNotification({
        title: 'Khong the mo chi tiet',
        content: normalizeApiMessage(apiError, 'Khong the tai chi tiet thong bao.'),
        sender: { fullName: 'EduHealth', role: '' },
        isRead: true,
      });
      setThreadItems([]);
      setThreadSource('pending');
      setThreadSourceNote(normalizeApiMessage(apiError, 'Khong the tai chuoi phan hoi.'));
    } finally {
      setDetailLoading(false);
    }
  }, [currentUser, fullPagePath, loadThread, navigate, onClose, refresh, viewerRole]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllRead({
        currentUser,
        viewerRole,
      });
      await refresh();
    } catch {
      // Keep panel compact; pending state is already communicated by capability/source.
    }
  }, [currentUser, refresh, viewerRole]);

  const handleReplySubmit = useCallback(async () => {
    if (!selectedNotification?.notificationId) {
      return;
    }

    setReplySubmitting(true);
    try {
      const result = await notificationsRepository.reply({
        notificationId: selectedNotification.notificationId,
        content: replyDraft,
        currentUser,
        viewerRole,
      });
      setReplyError(result.source === 'pending' ? 'Reply dang cho backend thread/replies.' : '');
      setReplyDraft('');
      await Promise.all([loadThread(selectedNotification.notificationId), refresh()]);
    } catch (apiError) {
      setReplyError(normalizeApiMessage(apiError, 'Khong the gui phan hoi.'));
    } finally {
      setReplySubmitting(false);
    }
  }, [currentUser, loadThread, refresh, replyDraft, selectedNotification?.notificationId, viewerRole]);

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
        onClose={closeDetail}
        threadItems={threadItems}
        threadLoading={threadLoading}
        threadSource={threadSource}
        threadSourceNote={threadSourceNote}
        replyDraft={replyDraft}
        replyError={replyError}
        replySubmitting={replySubmitting}
        onReplyDraftChange={setReplyDraft}
        onReplySubmit={handleReplySubmit}
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
