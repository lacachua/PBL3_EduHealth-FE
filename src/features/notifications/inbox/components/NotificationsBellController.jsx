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

  React.useEffect(() => {
    onUnreadChange?.(unreadCount);
  }, [onUnreadChange, unreadCount]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailLoading(false);
    setSelectedNotification(null);
  }, []);

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

    try {
      const isLive = capabilityState.recentSource === 'LIVE';
      let nextItem = null;

      if (isLive) {
        nextItem = notification || null;
      } else {
        const detail = await notificationsRepository.getNotificationDetail(notificationId, {
          currentUser,
          viewerRole: role,
        });
        nextItem = detail.item || null;
      }

      if (nextItem && !nextItem.currentRecipient?.isRead) {
        await notificationsRepository.markRead(nextItem.notificationId, {
          currentUser,
          viewerRole: role,
        });
        nextItem = buildReadNotification(nextItem);
      }

      setSelectedNotification(nextItem);
      await refresh();
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

        source: 'PENDING',
      });
    } finally {
      setDetailLoading(false);
    }
  }, [capabilityState.recentSource, currentUser, fullPagePath, navigate, onClose, refresh, role]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllRead({
        currentUser,
        viewerRole: role,
      });
      await refresh();
    } catch {
      // Keep silent for bell panel.
    }
  }, [currentUser, refresh, role]);

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
        onViewFullPage={() => {
          if (!selectedNotification?.notificationId) {
            return;
          }

          const notification = selectedNotification;
          closeDetail();
          onClose?.();
          navigate(fullPagePath, {
            state: {
              openNotificationId: notification.notificationId,
              openNotificationItem: notification,
            },
          });
        }}
      />
    </>
  );
};

export default NotificationsBellController;
