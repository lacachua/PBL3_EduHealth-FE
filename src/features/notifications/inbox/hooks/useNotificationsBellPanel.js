import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { notificationsRepository } from '../repositories/notificationsRepository';
import { connectNotificationSse } from '../services/notificationSseClient';
import { subscribeNotificationsChanged } from '../services/notificationsEvents';

export const useNotificationsBellPanel = ({
  currentUser,
  viewerRole,
}) => {
  const capabilityState = useMemo(
    () => notificationsRepository.getCapabilityState({ viewerRole: viewerRole || currentUser?.role }),
    [currentUser?.role, viewerRole],
  );

  const [recentItems, setRecentItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBellData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const recent = await notificationsRepository.getRecentNotifications({
        currentUser,
        viewerRole,
        limit: 6,
      });

      setRecentItems(recent.items || []);
      setUnreadCount(Number(recent.unreadCount || 0));
    } catch (apiError) {
      setRecentItems([]);
      setUnreadCount(0);
      setError(normalizeApiMessage(apiError, 'Không thể tải thông báo gần đây.'));
    } finally {
      setLoading(false);
    }
  }, [currentUser, viewerRole]);

  useEffect(() => {
    loadBellData();
  }, [loadBellData]);

  useEffect(() => {
    return subscribeNotificationsChanged(() => {
      loadBellData();
    });
  }, [loadBellData]);

  useEffect(() => {
    if (!capabilityState.sseSupported) {
      return undefined;
    }

    return connectNotificationSse();
  }, [capabilityState.sseSupported]);

  return {
    recentItems,
    unreadCount,
    loading,
    error,
    capabilityState,
    refresh: loadBellData,
  };
};
