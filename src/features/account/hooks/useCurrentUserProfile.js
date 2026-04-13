import { useCallback, useEffect, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { currentUserRepository } from '../repositories/currentUserRepository';

export const useCurrentUserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await currentUserRepository.getCurrentUser();
      setCurrentUser(data);
      return data;
    } catch (apiError) {
      setCurrentUser(null);
      setError(normalizeApiMessage(apiError, 'Không thể tải thông tin tài khoản hiện tại.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    currentUser,
    loading,
    error,
    fetchCurrentUser,
  };
};
