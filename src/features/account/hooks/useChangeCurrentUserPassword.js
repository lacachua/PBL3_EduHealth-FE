import { useCallback, useState } from 'react';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { currentUserRepository } from '../repositories/currentUserRepository';

export const useChangeCurrentUserPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const resetFeedback = useCallback(() => {
    setSubmitError('');
    setFieldErrors({});
  }, []);

  const changePassword = useCallback(async (payload) => {
    setIsSubmitting(true);
    setSubmitError('');
    setFieldErrors({});

    try {
      const response = await currentUserRepository.changeCurrentUserPassword(payload);
      const successMessage = response?.message || 'Đổi mật khẩu thành công.';
      return { ok: true, response, message: successMessage };
    } catch (apiError) {
      const errorMessage = normalizeApiMessage(apiError, 'Không thể đổi mật khẩu. Vui lòng thử lại.');
      setFieldErrors(mapApiFieldErrors(apiError));
      setSubmitError(errorMessage);
      return { ok: false, error: apiError, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    submitError,
    fieldErrors,
    resetFeedback,
    changePassword,
  };
};
