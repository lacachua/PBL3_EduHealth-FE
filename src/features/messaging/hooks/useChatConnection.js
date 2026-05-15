import { useEffect, useRef, useState } from 'react';
import { createChatHubClient } from '../realtime/chatHubClient.js';

export const useChatConnection = ({ enabled = true } = {}) => {
  const clientRef = useRef(null);
  const effectTokenRef = useRef(0);
  const [status, setStatus] = useState('disconnected');
  const [error, setError] = useState('');

  if (!clientRef.current) {
    clientRef.current = createChatHubClient();
  }

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.__chatClient = clientRef.current;
  }

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      return undefined;
    }

    let isActive = true;
    const effectToken = ++effectTokenRef.current;
    const client = clientRef.current;

    const handleReconnecting = () => {
      if (isActive) {
        setStatus('reconnecting');
      }
    };

    const handleReconnected = () => {
      if (isActive) {
        setStatus('connected');
      }
    };

    const handleClose = () => {
      if (isActive) {
        setStatus('disconnected');
      }
    };

    client.onReconnecting(handleReconnecting);
    client.onReconnected(handleReconnected);
    client.onClose(handleClose);

    const startConnection = async () => {
      setStatus('connecting');
      setError('');

      try {
        await client.start();
        if (isActive) {
          setStatus('connected');
          if (import.meta.env.DEV) {
            console.log('[Chat] connected');
          }
        }
      } catch (err) {
        if (isActive) {
          setStatus('disconnected');
          setError('Không thể kết nối realtime.');
        }
      }
    };

    const startPromise = startConnection();

    return () => {
      isActive = false;
      const stopIfLatest = () => {
        if (effectTokenRef.current === effectToken) {
          client.stop();
        }
      };

      Promise.resolve(startPromise).finally(stopIfLatest);
    };
  }, [enabled]);

  return {
    client: clientRef.current,
    status,
    error,
  };
};
