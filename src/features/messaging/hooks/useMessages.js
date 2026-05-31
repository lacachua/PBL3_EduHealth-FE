import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { buildOptimisticMessage, normalizeMessage } from '../adapters/messagingAdapter';
import { CHAT_HUB_EVENTS } from '../constants/messagingEvents';
import { messagingRepository } from '../repositories/messagingRepository';

const MESSAGE_PAGE_SIZE = 30;

const updateMessageStatus = (messages, clientMessageId, status, serverMessage) => {
  return messages.map((item) => {
    if (item.clientMessageId && item.clientMessageId === clientMessageId) {
      return {
        ...item,
        ...serverMessage,
        status,
      };
    }

    return item;
  });
};

export const useMessages = ({
  conversationId,
  currentUser,
  chatClient,
  realtimeEnabled = false,
  onMessageAdded,
  onConversationRead,
}) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setItems([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const result = await messagingRepository.getMessages(
        conversationId,
        { page: 1, pageSize: MESSAGE_PAGE_SIZE },
        { currentUser }
      );

      setItems(result.items || []);
      setStatus(result.items?.length ? 'success' : 'empty');
    } catch (apiError) {
      setItems([]);
      setStatus('error');
      setError(normalizeApiMessage(apiError, 'Không thể tải tin nhắn.'));
    }
  }, [conversationId, currentUser]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!chatClient || !conversationId) {
      return undefined;
    }

    let isActive = true;
    const handleMessageCreated = (payload) => {
      const payloadConversationId = payload?.conversationId ?? payload?.ConversationId;
      if (!isActive || Number(payloadConversationId) !== Number(conversationId)) {
        return;
      }

      const message = normalizeMessage(payload, { currentUser });
      setItems((prev) => {
        if (prev.some((item) => item.messageId && item.messageId === message.messageId)) {
          return prev;
        }

        if (message.clientMessageId) {
          const existingIndex = prev.findIndex((item) => item.clientMessageId === message.clientMessageId);
          if (existingIndex >= 0) {
            const next = [...prev];
            next[existingIndex] = {
              ...next[existingIndex],
              ...message,
              status: 'sent',
            };
            return next;
          }
        }

        return [...prev, message];
      });
      setStatus('success');
      onMessageAdded?.(message);
    };

    const handleTypingChanged = (payload) => {
      if (!isActive || Number(payload?.conversationId) !== Number(conversationId)) {
        return;
      }

      setIsTyping(Boolean(payload?.isTyping));
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      if (payload?.isTyping) {
        typingTimeoutRef.current = window.setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    };

    const handleConversationRead = (payload) => {
      const payloadConversationId = payload?.conversationId ?? payload?.ConversationId;
      if (!isActive || Number(payloadConversationId) !== Number(conversationId)) {
        return;
      }

      onConversationRead?.(payload);
    };

    const handleConversationUpdated = (payload) => {
      const lastMessage = payload?.lastMessage ?? payload?.LastMessage;
      const payloadConversationId = payload?.conversationId ?? payload?.ConversationId ?? lastMessage?.conversationId ?? lastMessage?.ConversationId;
      if (!isActive || Number(payloadConversationId) !== Number(conversationId) || !lastMessage) {
        return;
      }

      const message = normalizeMessage(lastMessage, { currentUser });
      setItems((prev) => {
        if (prev.some((item) => item.messageId && item.messageId === message.messageId)) {
          return prev;
        }

        return [...prev, message];
      });
      setStatus('success');
      onMessageAdded?.(message);
    };

    const handleMessagingError = (payload) => {
      const payloadConversationId = payload?.conversationId ?? payload?.ConversationId;
      if (!isActive || Number(payloadConversationId) !== Number(conversationId)) {
        return;
      }

      if (payload?.clientMessageId) {
        setItems((prev) => updateMessageStatus(prev, payload.clientMessageId, 'failed'));
      }

      if (payload?.message) {
        setError(payload.message);
      }
    };

    chatClient.on(CHAT_HUB_EVENTS.MESSAGE_CREATED, handleMessageCreated);
    chatClient.on(CHAT_HUB_EVENTS.TYPING_CHANGED, handleTypingChanged);
    chatClient.on(CHAT_HUB_EVENTS.CONVERSATION_READ, handleConversationRead);
    chatClient.on(CHAT_HUB_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    chatClient.on(CHAT_HUB_EVENTS.MESSAGING_ERROR, handleMessagingError);

    chatClient.joinConversation({ conversationId });

    return () => {
      isActive = false;
      chatClient.off(CHAT_HUB_EVENTS.MESSAGE_CREATED, handleMessageCreated);
      chatClient.off(CHAT_HUB_EVENTS.TYPING_CHANGED, handleTypingChanged);
      chatClient.off(CHAT_HUB_EVENTS.CONVERSATION_READ, handleConversationRead);
      chatClient.off(CHAT_HUB_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      chatClient.off(CHAT_HUB_EVENTS.MESSAGING_ERROR, handleMessagingError);
      chatClient.leaveConversation({ conversationId });
    };
  }, [chatClient, conversationId, currentUser, onConversationRead, onMessageAdded]);

  const markConversationRead = useCallback(async (lastReadMessageId) => {
    if (!conversationId) {
      return;
    }

    try {
      await messagingRepository.markConversationRead(conversationId, { lastReadMessageId });
    } catch {
      // Ignore read failures to avoid breaking the UI
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !items.length) {
      return;
    }

    const lastMessageId = items[items.length - 1]?.messageId;
    if (lastMessageId) {
      markConversationRead(lastMessageId);
    }
  }, [conversationId, items, markConversationRead]);

  const sendMessage = useCallback(async (content, files = []) => {
    if (!conversationId) {
      return false;
    }

    const safeFiles = Array.isArray(files) ? files : [];
    const messageContent = String(content || '').trim();
    if (!messageContent && !safeFiles.length) {
      return false;
    }

    const optimistic = buildOptimisticMessage({
      conversationId,
      content: messageContent,
      currentUser,
      files: safeFiles,
    });
    const hasFiles = safeFiles.length > 0;

    setItems((prev) => [...prev, optimistic]);
    setStatus('success');
    onMessageAdded?.(optimistic);

    if (hasFiles || !realtimeEnabled || !chatClient) {
      try {
        const payload = hasFiles
          ? (() => {
              const formData = new FormData();
              formData.append('content', messageContent);
              formData.append('messageType', 'TEXT');
              formData.append('clientMessageId', optimistic.clientMessageId);
              safeFiles.forEach((file) => formData.append('files', file));
              return formData;
            })()
          : {
              content: messageContent,
              messageType: 'TEXT',
              clientMessageId: optimistic.clientMessageId,
            };

        const serverMessage = await messagingRepository.sendMessage(
          conversationId,
          payload,
          { currentUser }
        );

        setItems((prev) => updateMessageStatus(prev, optimistic.clientMessageId, 'sent', serverMessage));
        if (serverMessage) {
          onMessageAdded?.(serverMessage);
        }
        return true;
      } catch (apiError) {
        setItems((prev) => updateMessageStatus(prev, optimistic.clientMessageId, 'failed'));
        setError(normalizeApiMessage(apiError, 'Không thể gửi tin nhắn.'));
        return false;
      }
    }

    try {
      await chatClient.sendMessage({
        conversationId,
        content: messageContent,
        messageType: 'TEXT',
        clientMessageId: optimistic.clientMessageId,
      });

      setItems((prev) => updateMessageStatus(prev, optimistic.clientMessageId, 'sent'));
      return true;
    } catch (apiError) {
      setItems((prev) => updateMessageStatus(prev, optimistic.clientMessageId, 'failed'));
      setError(normalizeApiMessage(apiError, 'Không thể gửi tin nhắn.'));
      return false;
    }
  }, [chatClient, conversationId, currentUser, onMessageAdded, realtimeEnabled]);

  const typingIndicator = useMemo(() => isTyping, [isTyping]);

  const sendTyping = useCallback((isTypingValue) => {
    if (!realtimeEnabled || !chatClient || !conversationId) {
      return;
    }

    chatClient.sendTyping({
      conversationId,
      isTyping: Boolean(isTypingValue),
    });
  }, [chatClient, conversationId, realtimeEnabled]);

  return {
    items,
    status,
    error,
    typingIndicator,
    loadMessages,
    sendMessage,
    sendTyping,
    markConversationRead,
  };
};
