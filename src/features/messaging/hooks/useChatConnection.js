import { useEffect, useRef, useState } from 'react';
import { createChatHubClient } from '../realtime/chatHubClient';

export const useChatConnection = ({ enabled = true } = {}) => {
  const clientRef = useRef(null);
  const [status, setStatus] = useState('disconnected');
  const [error, setError] = useState('');

  if (!clientRef.current) {
    clientRef.current = createChatHubClient();
  }

  useEffect(() => {
    if (!enabled) {
      setStatus('disconnected');
      return undefined;
    }

    let isActive = true;
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
        }
      } catch (err) {
        if (isActive) {
          setStatus('disconnected');
          setError('Không thể kết nối realtime.');
        }
      }
    };

    startConnection();

    return () => {
      isActive = false;
      client.stop();
    };
  }, [enabled]);

  return {
    client: clientRef.current,
    status,
    error,
  };
};
