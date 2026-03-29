import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isNetworkError, mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptUserDetailResponse, adaptUserListResponse } from '../adapters/userManagementAdapter';
import {
  createUser,
  getUserById,
  getUsers,
  resetUserPassword,
  toggleUserStatus,
  updateUser,
} from '../services/userManagementApi';
import {
  buildCreateUserPayload,
  buildStatusPayload,
  buildUpdateUserPayload,
  USER_FILTER_DEFAULTS,
  USER_PAGE_SIZE,
  USER_STATUSES,
  validateUserForm,
} from '../schemas/userManagementSchema';

const defaultTableData = {
  rows: [],
  page: 1,
  pageSize: USER_PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
};

const autoDismissDelay = 2600;

export const useUsersManagement = () => {
  const [filters, setFilters] = useState(USER_FILTER_DEFAULTS);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(defaultTableData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailSyncMessage, setDetailSyncMessage] = useState('');
  const [updateFieldErrors, setUpdateFieldErrors] = useState({});
  const feedbackTimerRef = useRef(null);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type });

    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, autoDismissDelay);
  }, [feedbackTimerRef]);

  const clearFeedback = () => {
    setFeedback(null);
    window.clearTimeout(feedbackTimerRef.current);
  };

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
  }, [feedbackTimerRef]);

  const fetchList = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError('');

    try {
      const query = {
        page: overrides.page ?? page,
        pageSize: USER_PAGE_SIZE,
        keyword: overrides.keyword ?? filters.keyword,
        role: overrides.role ?? filters.role,
        status: overrides.status ?? filters.status,
      };

      const envelope = await getUsers(query);
      setTableData(adaptUserListResponse(envelope));
    } catch (apiError) {
      setError(normalizeApiMessage(apiError));
      setTableData(defaultTableData);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchList({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    fetchList({ ...nextFilters, page: 1 });
  };

  const onResetFilters = () => {
    setFilters(USER_FILTER_DEFAULTS);
    setPage(1);
    fetchList({ ...USER_FILTER_DEFAULTS, page: 1 });
  };

  const onPageChange = (nextPage) => {
    setPage(nextPage);
    fetchList({ page: nextPage });
  };

  const submitCreateUser = async (payload) => {
    const errors = validateUserForm({ values: payload, isEdit: false });
    if (Object.keys(errors).length) {
      const message = Object.values(errors)[0];
      showFeedback(message, 'error');
      throw new Error(message);
    }

    setSubmitting(true);

    try {
      const submitPayload = buildCreateUserPayload(payload);
      await createUser(submitPayload);
      showFeedback('Tạo tài khoản thành công');
      await fetchList({ page: 1 });
      setPage(1);
    } catch (err) {
      showFeedback(normalizeApiMessage(err), 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const submitUpdateUser = async (userId, payload) => {
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
      setSelectedUser((prev) => (prev && prev.id === userId ? { ...prev, ...submitPayload } : prev));
      showFeedback('Cập nhật tài khoản thành công');
      await fetchList({ page });
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
  };

  const submitToggleUserStatus = async (user, reason = '') => {
    setSubmitting(true);
    try {
      const nextStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      const payload = buildStatusPayload({ status: nextStatus, reason });
      const result = await toggleUserStatus(user.id, payload);
      showFeedback(result.message || 'Cập nhật trạng thái thành công');
      await fetchList({ page });
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => (prev ? {
          ...prev,
          status: nextStatus,
          statusLabel: nextStatus === USER_STATUSES.ACTIVE ? 'Hoạt động' : 'Đã khóa',
          statusTone: nextStatus === USER_STATUSES.ACTIVE ? 'success' : 'danger',
        } : prev));
      }
    } catch (err) {
      showFeedback(normalizeApiMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitResetPassword = async (userId, payload) => {
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
  };

  const fetchUserDetail = async (userId, fallbackUser = null) => {
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
        showFeedback(message, 'error');
        return fallbackUser || selectedUser;
      }

      setDetailError(message);
      setSelectedUser(null);
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  const status = useMemo(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!tableData.rows.length) return 'empty';
    return 'success';
  }, [error, loading, tableData.rows.length]);

  return {
    filters,
    tableData,
    status,
    error,
    submitting,
    feedback,
    selectedUser,
    detailLoading,
    detailError,
    detailSyncMessage,
    updateFieldErrors,
    fetchList,
    fetchUserDetail,
    onFiltersChange,
    onResetFilters,
    onPageChange,
    clearFeedback,
    setUpdateFieldErrors,
    setSelectedUser,
    createUser: submitCreateUser,
    updateUser: submitUpdateUser,
    toggleStatus: submitToggleUserStatus,
    resetPassword: submitResetPassword,
  };
};

export const useUserManagement = useUsersManagement;
