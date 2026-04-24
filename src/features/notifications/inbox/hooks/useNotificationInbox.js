import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import {
  parseRecipientUserIdsText,
  validateNotificationDraft,
  validateReplyDraft,
} from '../adapters/notificationAdapters';
import { notificationsRepository } from '../repositories/notificationsRepository';
import { subscribeNotificationsChanged } from '../services/notificationsEvents';

const INITIAL_DRAFT = Object.freeze({
  title: '',
  content: '',
  type: 'GENERAL',
  classId: '',
  diseaseId: '',
  vaccinationId: '',
  recipientUserIds: [],
});

export const useNotificationInbox = ({
  currentUser,
  viewerRole,
}) => {
  const capabilityState = useMemo(
    () => notificationsRepository.getCapabilityState({ viewerRole: viewerRole || currentUser?.role }),
    [currentUser?.role, viewerRole],
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [inboxSource, setInboxSource] = useState(capabilityState.inboxSource);
  const [inboxSourceNote, setInboxSourceNote] = useState('');
  const [sendSource, setSendSource] = useState(capabilityState.composeSource);
  const [threadSource, setThreadSource] = useState(capabilityState.threadSource);
  const [threadSourceNote, setThreadSourceNote] = useState('');

  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [threadItems, setThreadItems] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ ...INITIAL_DRAFT });
  const [recipientIdsText, setRecipientIdsText] = useState('');
  const [draftErrors, setDraftErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const unreadCount = useMemo(
    () => items.reduce((sum, item) => sum + (item?.isRead ? 0 : 1), 0),
    [items],
  );

  const availableTypes = useMemo(() => {
    const seen = new Set();
    return items.reduce((accumulator, item) => {
      const value = String(item?.type || '').trim();
      if (!value || seen.has(value)) {
        return accumulator;
      }

      seen.add(value);
      accumulator.push(value);
      return accumulator;
    }, []);
  }, [items]);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await notificationsRepository.getInbox({
        page: 1,
        pageSize: 30,
        isRead: activeTab === 'unread' ? false : undefined,
        type: typeFilter,
        keyword,
        currentUser,
        viewerRole,
      });

      setItems(data.items || []);
      setInboxSource(String(data.source || capabilityState.inboxSource));
      setInboxSourceNote(String(data.sourceNote || ''));
    } catch (apiError) {
      setItems([]);
      setError(normalizeApiMessage(apiError, 'Khong the tai danh sach thong bao.'));
    } finally {
      setLoading(false);
    }
  }, [activeTab, capabilityState.inboxSource, currentUser, keyword, typeFilter, viewerRole]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    return subscribeNotificationsChanged(() => {
      loadInbox();
    });
  }, [loadInbox]);

  const loadThread = useCallback(async (notificationId) => {
    setThreadLoading(true);
    setReplyError('');

    try {
      const thread = await notificationsRepository.getThread({
        notificationId,
        currentUser,
        viewerRole,
      });

      setThreadItems(thread.replies || []);
      setThreadSource(String(thread.source || capabilityState.threadSource));
      setThreadSourceNote(String(thread.sourceNote || ''));
    } catch (apiError) {
      setThreadItems([]);
      setThreadSource('pending');
      setThreadSourceNote(normalizeApiMessage(apiError, 'Khong the tai chuoi phan hoi.'));
    } finally {
      setThreadLoading(false);
    }
  }, [capabilityState.threadSource, currentUser, viewerRole]);

  const openDetail = useCallback(async (notificationId) => {
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

      await loadInbox();
      await loadThread(notificationId);
    } catch (apiError) {
      setSelectedNotification(null);
      setThreadItems([]);
      setError(normalizeApiMessage(apiError, 'Khong the tai chi tiet thong bao.'));
    } finally {
      setDetailLoading(false);
    }
  }, [currentUser, loadInbox, loadThread, viewerRole]);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedNotification(null);
    setThreadItems([]);
    setReplyDraft('');
    setReplyError('');
    setThreadSource(capabilityState.threadSource);
    setThreadSourceNote('');
  }, [capabilityState.threadSource]);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllRead({ currentUser, viewerRole });
      setFeedback('Da danh dau thong bao la da doc.');
      await loadInbox();
    } catch (apiError) {
      setError(normalizeApiMessage(apiError, 'Khong the danh dau da doc toan bo.'));
    }
  }, [currentUser, loadInbox, viewerRole]);

  const openComposer = useCallback(() => {
    if (!capabilityState.canCompose) {
      return;
    }

    setComposerOpen(true);
    setDraft({ ...INITIAL_DRAFT });
    setRecipientIdsText('');
    setDraftErrors({});
    setFeedback('');
  }, [capabilityState.canCompose]);

  const closeComposer = useCallback(() => {
    setComposerOpen(false);
    setDraftErrors({});
  }, []);

  const updateDraftField = useCallback((field, value) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));

    setDraftErrors((previous) => {
      if (!previous[field] && !previous.target && !previous.general) {
        return previous;
      }

      return {
        ...previous,
        [field]: undefined,
        target: undefined,
        general: undefined,
      };
    });
  }, []);

  const updateRecipientText = useCallback((value) => {
    setRecipientIdsText(value);
    setDraft((previous) => ({
      ...previous,
      recipientUserIds: parseRecipientUserIdsText(value),
    }));

    setDraftErrors((previous) => ({
      ...previous,
      target: undefined,
      general: undefined,
    }));
  }, []);

  const submitDraft = useCallback(async () => {
    const validation = validateNotificationDraft(draft);
    if (!validation.isValid) {
      setDraftErrors(validation.fieldErrors);
      return false;
    }

    setSubmitting(true);

    try {
      const result = await notificationsRepository.create({ draft, currentUser, viewerRole });
      setSendSource(String(result?.source || capabilityState.composeSource));
      setComposerOpen(false);
      setFeedback(`Gui thong bao thanh cong cho ${result.totalRecipients || 0} nguoi nhan.`);
      await loadInbox();
      return true;
    } catch (apiError) {
      setDraftErrors({
        general: normalizeApiMessage(apiError, 'Khong the gui thong bao.'),
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [capabilityState.composeSource, currentUser, draft, loadInbox, viewerRole]);

  const submitReply = useCallback(async () => {
    if (!selectedNotification?.notificationId) {
      return false;
    }

    const validation = validateReplyDraft(replyDraft);
    if (!validation.isValid) {
      setReplyError(validation.error);
      return false;
    }

    setReplySubmitting(true);

    try {
      const result = await notificationsRepository.reply({
        notificationId: selectedNotification.notificationId,
        content: replyDraft,
        currentUser,
        viewerRole,
      });

      setThreadSource(String(result.source || capabilityState.threadSource));
      setThreadSourceNote(String(result.sourceNote || ''));
      setReplyDraft('');
      setReplyError(result.source === 'pending' ? 'BE chua ho tro replies. FE da giu san cau truc phan hoi.' : '');
      await loadThread(selectedNotification.notificationId);
      return true;
    } catch (apiError) {
      setReplyError(normalizeApiMessage(apiError, 'Khong the gui phan hoi.'));
      return false;
    } finally {
      setReplySubmitting(false);
    }
  }, [capabilityState.threadSource, currentUser, loadThread, replyDraft, selectedNotification?.notificationId, viewerRole]);

  return {
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
    setFeedback,
    setReplyDraft,
    refreshInbox: loadInbox,
    openDetail,
    closeDetail,
    markAllRead,
    openComposer,
    closeComposer,
    updateDraftField,
    updateRecipientText,
    submitDraft,
    submitReply,
  };
};
