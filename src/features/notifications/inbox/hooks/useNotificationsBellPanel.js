import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { notificationsRepository } from '../repositories/notificationsRepository';
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
  const [recentSource, setRecentSource] = useState(capabilityState.recentSource);
  const [recentSourceNote, setRecentSourceNote] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBellData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [recent, unread] = await Promise.all([
        notificationsRepository.getRecentNotifications({
          currentUser,
          viewerRole,
          limit: 6,
        }),
        notificationsRepository.getUnreadCount({
          currentUser,
          viewerRole,
        }),
      ]);

      setRecentItems(recent.items || []);
      setRecentSource(String(recent.source || capabilityState.recentSource));
      setRecentSourceNote(String(recent.sourceNote || unread.sourceNote || ''));
      setUnreadCount(Number(unread.unreadCount || recent.unreadCount || 0));
    } catch (apiError) {
      setRecentItems([]);
      setUnreadCount(0);
      setError(normalizeApiMessage(apiError, 'Khong the tai thong bao gan day.'));
    } finally {
      setLoading(false);
    }
  }, [capabilityState.recentSource, currentUser, viewerRole]);

  useEffect(() => {
    loadBellData();
  }, [loadBellData]);

  useEffect(() => {
    return subscribeNotificationsChanged(() => {
      loadBellData();
    });
  }, [loadBellData]);

  return {
    recentItems,
    recentSource,
    recentSourceNote,
    unreadCount,
    loading,
    error,
    capabilityState,
    refresh: loadBellData,
  };
};
