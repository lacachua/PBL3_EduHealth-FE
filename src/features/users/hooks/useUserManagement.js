import { useMemo } from 'react';
import { useUserDetail } from './useUserDetail';
import { useUsersList } from './useUsersList';
import { useUserMutations } from './useUserMutations';

export const useUsersManagement = () => {
  const list = useUsersList();
  const detail = useUserDetail();
  const mutations = useUserMutations();

  const status = useMemo(() => {
    if (list.loading) return 'loading';
    if (list.error) return 'error';
    if (!list.tableData.rows.length) return 'empty';
    return 'success';
  }, [list.loading, list.error, list.tableData.rows.length]);

  return {
    filters: list.filters,
    tableData: list.tableData,
    status,
    error: list.error,
    fetchList: list.fetchList,
    onFiltersChange: list.onFiltersChange,
    onResetFilters: list.onResetFilters,
    onPageChange: list.onPageChange,

    selectedUser: detail.selectedUser,
    detailLoading: detail.detailLoading,
    detailError: detail.detailError,
    detailSyncMessage: detail.detailSyncMessage,
    fetchUserDetail: detail.fetchUserDetail,
    setSelectedUser: detail.setSelectedUser,

    submitting: mutations.submitting,
    feedback: mutations.feedback,
    createFieldErrors: mutations.createFieldErrors,
    updateFieldErrors: mutations.updateFieldErrors,
    clearFeedback: mutations.clearFeedback,
    setCreateFieldErrors: mutations.setCreateFieldErrors,
    createUser: mutations.createUser,
    updateUser: mutations.updateUser,
    toggleStatus: mutations.toggleStatus,
    resetPassword: mutations.resetPassword,
  };
};

export const useUserManagement = useUsersManagement;
