import { useCallback, useEffect, useMemo, useState } from 'react';
import { DATA_MODULES, shouldUseMockData } from '../../../app/config/dataMode';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { getStoredUser } from '../../../shared/services/tokenClient';
import { messagingRepository } from '../repositories/messagingRepository';
import { useChatConnection } from './useChatConnection';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';

const resolveRole = (role) => String(role || '').trim().toUpperCase();

export const useMessagingPageState = ({ role }) => {
  const viewerRole = resolveRole(role) || 'STUDENT';
  const currentUser = useMemo(() => getStoredUser() || {}, []);
  const realtimeEnabled = !shouldUseMockData(DATA_MODULES.MESSAGING);

  const chat = useChatConnection({ enabled: realtimeEnabled });
  const conversations = useConversations({ viewerRole, currentUser });

  const [contactsOpen, setContactsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsStatus, setContactsStatus] = useState('idle');
  const [contactsError, setContactsError] = useState('');
  const [contactsKeyword, setContactsKeyword] = useState('');

  const messageState = useMessages({
    conversationId: conversations.selectedConversationId,
    currentUser,
    chatClient: chat.client,
    realtimeEnabled: chat.status === 'connected',
    onMessageAdded: (message) => {
      conversations.updateConversation(message.conversationId, (item) => ({
        ...item,
        lastMessage: {
          messageId: message.messageId || item.lastMessage?.messageId,
          content: message.content,
          messageType: message.messageType,
          senderId: message.senderId,
          senderName: message.senderName,
          senderRole: message.senderRole,
          sentAt: message.sentAt,
        },
        updatedAt: message.sentAt,
      }));
    },
    onConversationRead: () => {
      conversations.markConversationReadLocal(conversations.selectedConversationId);
    },
  });

  const loadContacts = useCallback(async () => {
    setContactsStatus('loading');
    setContactsError('');

    try {
      const result = viewerRole === 'NURSE'
        ? await messagingRepository.getStudentContacts({
          page: 1,
          pageSize: 20,
          keyword: contactsKeyword,
        }, { currentUser })
        : await messagingRepository.getNurseContacts({
          page: 1,
          pageSize: 20,
          keyword: contactsKeyword,
        }, { currentUser });

      setContacts(result.items || []);
      setContactsStatus(result.items?.length ? 'success' : 'empty');
    } catch (apiError) {
      setContacts([]);
      setContactsStatus('error');
      setContactsError(normalizeApiMessage(apiError, 'Không thể tải danh sách liên hệ.'));
    }
  }, [contactsKeyword, currentUser, viewerRole]);

  useEffect(() => {
    if (!contactsOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadContacts();
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [contactsOpen, loadContacts]);

  const handleOpenContacts = useCallback(() => {
    setContactsOpen(true);
  }, []);

  const handleCloseContacts = useCallback(() => {
    setContactsOpen(false);
    setContactsKeyword('');
  }, []);

  const handleSelectConversation = useCallback((conversationId) => {
    conversations.selectConversation(conversationId);
    conversations.markConversationReadLocal(conversationId);
  }, [conversations]);

  const handleSelectContact = useCallback(async (contact) => {
    const participantUserId = contact?.userId;
    if (!participantUserId) {
      return;
    }

    const payload = {
      participantUserId,
      studentId: contact?.studentId || currentUser?.studentId || null,
    };

    const result = await messagingRepository.createConversation(payload, {
      currentUser,
      viewerRole,
    });

    const conversation = result.conversation;
    if (conversation) {
      conversations.upsertConversation(conversation);
      conversations.selectConversation(conversation.conversationId);
    }

    handleCloseContacts();
  }, [conversations, currentUser, handleCloseContacts, viewerRole]);

  return {
    currentUser,
    viewerRole,
    conversations,
    messageState,
    contacts,
    contactsStatus,
    contactsError,
    contactsKeyword,
    setContactsKeyword,
    contactsOpen,
    handleOpenContacts,
    handleCloseContacts,
    handleSelectConversation,
    handleSelectContact,
  };
};
