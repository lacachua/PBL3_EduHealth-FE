import { useCallback, useState } from 'react';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { currentUserRepository } from '../repositories/currentUserRepository';

export const useChangeCurrentUserPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const resetFeedback = useCallback(() => {
    setSubmitError('');
    setSubmitSuccess('');
    setFieldErrors({});
  }, []);

  const changePassword = useCallback(async (payload) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    setFieldErrors({});

    try {
      const response = await currentUserRepository.changeCurrentUserPassword(payload);
      const successMessage = response?.message || 'Đổi mật khẩu thành công.';
      setSubmitSuccess(successMessage);
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
    submitSuccess,
    fieldErrors,
    resetFeedback,
    changePassword,
  };
};
