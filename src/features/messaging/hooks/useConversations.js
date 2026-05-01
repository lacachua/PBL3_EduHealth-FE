import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { messagingRepository } from '../repositories/messagingRepository';

const normalizeKeyword = (value) => String(value || '').trim();

export const useConversations = ({ viewerRole, currentUser }) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const loadConversations = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      const result = await messagingRepository.getConversations(
        {
          page,
          pageSize,
          keyword: normalizeKeyword(keyword),
          viewerRole,
        },
        { currentUser }
      );

      setItems(result.items || []);
      setStatus(result.items?.length ? 'success' : 'empty');
    } catch (apiError) {
      setItems([]);
      setStatus('error');
      setError(normalizeApiMessage(apiError, 'Không thể tải hội thoại.'));
    }
  }, [currentUser, keyword, page, pageSize, viewerRole]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadConversations();
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [loadConversations]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    if (selectedConversationId) {
      const exists = items.some((item) => item.conversationId === selectedConversationId);
      if (!exists) {
        setSelectedConversationId(null);
      }
    }
  }, [items, selectedConversationId]);

  const selectedConversation = useMemo(
    () => items.find((item) => item.conversationId === selectedConversationId) || null,
    [items, selectedConversationId]
  );

  const selectConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);
  }, []);

  const updateConversation = useCallback((conversationId, updater) => {
    setItems((prev) => prev.map((item) => {
      if (item.conversationId !== conversationId) {
        return item;
      }

      const next = typeof updater === 'function' ? updater(item) : updater;
      return { ...item, ...next };
    }));
  }, []);

  const upsertConversation = useCallback((conversation) => {
    if (!conversation) {
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.conversationId === conversation.conversationId);
      if (existingIndex === -1) {
        return [conversation, ...prev];
      }

      const next = [...prev];
      next[existingIndex] = { ...next[existingIndex], ...conversation };
      return next;
    });
  }, []);

  const markConversationReadLocal = useCallback((conversationId) => {
    updateConversation(conversationId, (item) => ({
      ...item,
      unreadCount: 0,
    }));
  }, [updateConversation]);

  return {
    items,
    status,
    error,
    keyword,
    page,
    pageSize,
    selectedConversationId,
    selectedConversation,
    setPage,
    setKeyword,
    reload: loadConversations,
    selectConversation,
    updateConversation,
    upsertConversation,
    markConversationReadLocal,
  };
};
