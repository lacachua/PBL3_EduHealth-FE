import { useCallback, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptUserDetailResponse } from '../adapters/userManagementAdapter';
import { getUserById } from '../services/userManagementApi';

export const useUserDetail = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState('');
    const [detailSyncMessage, setDetailSyncMessage] = useState('');

    const fetchUserDetail = useCallback(async (userId, fallbackUser = null) => {
        setDetailLoading(true);
        setDetailError('');
        setDetailSyncMessage('');

        try {
            const result = await getUserById(userId);
            const adapted = adaptUserDetailResponse(result);
            setSelectedUser(adapted);
            return adapted;
        } catch (err) {
            const message = normalizeApiMessage(err);
            const hasFallback = Boolean((selectedUser && selectedUser.id === userId) || fallbackUser);

            if (hasFallback) {
                setSelectedUser((prev) => {
                    if (prev && prev.id === userId) {
                        return prev;
                    }
                    return fallbackUser || prev;
                });
                setDetailSyncMessage('Không thể đồng bộ dữ liệu mới từ máy chủ. Đang hiển thị dữ liệu gần nhất.');
                return fallbackUser || selectedUser;
            }

            setDetailError(message);
            setSelectedUser(null);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, [selectedUser]);

    const clearSelectedUser = useCallback(() => {
        setSelectedUser(null);
        setDetailError('');
        setDetailSyncMessage('');
    }, []);

    const updateSelectedUser = useCallback((updates) => {
        setSelectedUser((prev) => prev ? { ...prev, ...updates } : prev);
    }, []);

    return {
        selectedUser,
        detailLoading,
        detailError,
        detailSyncMessage,

        fetchUserDetail,
        setSelectedUser,
        clearSelectedUser,
        updateSelectedUser,
    };
};