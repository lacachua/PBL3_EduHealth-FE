import { useCallback, useRef, useState } from 'react';
import { isNetworkError, mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import {
    createUser,
    resetUserPassword,
    toggleUserStatus,
    updateUser,
} from '../services/userManagementApi';
import {
    buildCreateUserPayload,
    buildStatusPayload,
    buildUpdateUserPayload,
    USER_STATUSES,
    validateUserForm,
} from '../schemas/userManagementSchema';

const autoDismissDelay = 2600;

export const useUserMutations = () => {
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [createFieldErrors, setCreateFieldErrors] = useState({});
    const [updateFieldErrors, setUpdateFieldErrors] = useState({});
    const feedbackTimerRef = useRef(null);

    const showFeedback = useCallback((message, type = 'success') => {
        setFeedback({ message, type });

        window.clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = window.setTimeout(() => {
            setFeedback(null);
        }, autoDismissDelay);
    }, [feedbackTimerRef]);

    const clearFeedback = useCallback(() => {
        setFeedback(null);
        window.clearTimeout(feedbackTimerRef.current);
    }, [feedbackTimerRef]);

    const submitCreateUser = useCallback(async (payload) => {
        const errors = validateUserForm({ values: payload, isEdit: false });
        setCreateFieldErrors(errors);
        if (Object.keys(errors).length) {
            const message = Object.values(errors)[0];
            showFeedback(message, 'error');
            throw new Error(message);
        }

        setSubmitting(true);
        setCreateFieldErrors({});

        try {
            const submitPayload = buildCreateUserPayload(payload);
            await createUser(submitPayload);
            showFeedback('Tạo tài khoản thành công');
            return true;
        } catch (err) {
            const nextFieldErrors = mapApiFieldErrors(err);
            if (Object.keys(nextFieldErrors).length) {
                setCreateFieldErrors(nextFieldErrors);
            }
            showFeedback(normalizeApiMessage(err), 'error');
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showFeedback]);

    const submitUpdateUser = useCallback(async (userId, payload) => {
        const errors = validateUserForm({ values: payload, isEdit: true });
        setUpdateFieldErrors(errors);
        if (Object.keys(errors).length) {
            const message = Object.values(errors)[0];
            showFeedback(message, 'error');
            throw new Error(message);
        }

        setSubmitting(true);
        setUpdateFieldErrors({});

        try {
            const submitPayload = buildUpdateUserPayload(payload);
            await updateUser(userId, submitPayload);
            showFeedback('Cập nhật tài khoản thành công');
            return submitPayload;
        } catch (err) {
            const nextFieldErrors = mapApiFieldErrors(err);
            if (Object.keys(nextFieldErrors).length) {
                setUpdateFieldErrors(nextFieldErrors);
            }
            if (isNetworkError(err)) {
                showFeedback('Không thể lưu thay đổi. Vui lòng kiểm tra kết nối hoặc thử lại.', 'error');
            } else {
                showFeedback(normalizeApiMessage(err), 'error');
            }
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showFeedback]);

    const submitToggleUserStatus = useCallback(async (user, reason = '') => {
        setSubmitting(true);
        try {
            const nextStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
            const payload = buildStatusPayload({ status: nextStatus, reason });
            const result = await toggleUserStatus(user.id, payload);
            showFeedback(result.message || 'Cập nhật trạng thái thành công');

            return {
                status: nextStatus,
                statusLabel: nextStatus === USER_STATUSES.ACTIVE ? 'Hoạt động' : 'Đã khóa',
                statusTone: nextStatus === USER_STATUSES.ACTIVE ? 'success' : 'danger',
            };
        } catch (err) {
            showFeedback(normalizeApiMessage(err), 'error');
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showFeedback]);

    const submitResetPassword = useCallback(async (userId, payload) => {
        setSubmitting(true);

        try {
            const result = await resetUserPassword(userId, payload);
            showFeedback(result.message || 'Mật khẩu đã được đặt lại thành công');
            return result;
        } catch (err) {
            showFeedback(normalizeApiMessage(err), 'error');
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showFeedback]);

    const cleanup = useCallback(() => {
        window.clearTimeout(feedbackTimerRef.current);
    }, [feedbackTimerRef]);

    return {

        submitting,
        feedback,
        createFieldErrors,
        updateFieldErrors,

        createUser: submitCreateUser,
        updateUser: submitUpdateUser,
        toggleStatus: submitToggleUserStatus,
        resetPassword: submitResetPassword,
        clearFeedback,
        setCreateFieldErrors,
        setUpdateFieldErrors,
        cleanup,
    };
};