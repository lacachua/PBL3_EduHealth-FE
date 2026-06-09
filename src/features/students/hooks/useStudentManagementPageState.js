import { useState } from 'react';

export const useStudentManagementPageState = ({
  locationState,
  selectedStudent,
  setSelectedStudent,
  setSelectedHealthProfile,
  fetchStudentDetail,
  fetchList,
  tablePage,
  updateStudent,
  clearUpdateErrors,
}) => {
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(Boolean(locationState?.openCreateStudent));
  const [localFeedback, setLocalFeedback] = useState(null);
  const [statusConfirmUser, setStatusConfirmUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fromAdminUsers = locationState?.source === 'admin-users';
  const selectedTarget = selectedStudent || selected;
  const selectedTargetId = selectedTarget?.apiId || selectedTarget?.id;

  const openWithSelection = async (row, openPanel) => {
    setSelected(row);
    setSelectedStudent(row);
    setSelectedHealthProfile(null);
    openPanel(true);
    await fetchStudentDetail(row.apiId || row.id, row);
  };

  const openStudentDetail = (row) => openWithSelection(row, setDetailOpen);

  const mergeDetailWithListRow = (row, detail) => {
    if (!detail) return row;

    const merged = { ...row, ...detail };
    Object.entries(detail.fields || {}).forEach(([field, isPresent]) => {
      if (!isPresent && row[field] !== undefined) {
        merged[field] = row[field];
      }
    });

    ['id', 'userId', 'apiId', 'accountUserId'].forEach((field) => {
      merged[field] = detail[field] ?? row[field] ?? null;
    });

    return merged;
  };

  const openEditStudent = async (row) => {
    clearUpdateErrors?.();
    setDetailOpen(false);
    setEditStudent(row);
    setEditOpen(true);
    const detail = await fetchStudentDetail(row.apiId || row.id, row);
    if (detail) {
      setEditStudent(mergeDetailWithListRow(row, detail));
    }
  };

  const closeEditStudent = () => {
    setEditOpen(false);
    setEditStudent(null);
    clearUpdateErrors?.();
  };

  const handleSubmitEdit = async (values) => {
    const targetId = editStudent?.apiId || editStudent?.id;
    if (!targetId) return;

    await updateStudent(targetId, values);
    const refreshedDetail = await fetchStudentDetail(targetId, editStudent);
    setEditStudent(mergeDetailWithListRow(editStudent, refreshedDetail));
    await fetchList({ page: tablePage });
    setLocalFeedback({
      type: 'success',
      message: 'Cập nhật tài khoản học sinh thành công.',
    });
    closeEditStudent();
  };

  const closeFeedback = () => {
    setLocalFeedback(null);
  };

  const handleCreateSuccess = async (result) => {
    await fetchList({ page: tablePage });
    setLocalFeedback({
      type: 'success',
      message: result?.message || 'Tạo học sinh thành công.',
    });
  };

  const retryStudentDetail = () => {
    if (!selectedTargetId) {
      return Promise.resolve(null);
    }

    return fetchStudentDetail(selectedTargetId, selectedTarget);
  };

  const askToggleStatus = (row) => setStatusConfirmUser(row);
  const askResetPassword = (row) => setResetPasswordUser(row);
  const closeStatusConfirmModal = () => setStatusConfirmUser(null);
  const closeResetPasswordModal = () => setResetPasswordUser(null);

  const refetchAfterAccountAction = async (target) => {
    await fetchList({ page: tablePage });
    const targetId = target?.apiId || target?.id;
    if (detailOpen && selectedTargetId && selectedTargetId === targetId) {
      await fetchStudentDetail(selectedTargetId);
    }
  };

  const handleConfirmStatus = async (toggleStatus, reason) => {
    if (!statusConfirmUser) return;
    try {
      await toggleStatus(statusConfirmUser, reason);
      setStatusConfirmUser(null);
      setLocalFeedback({ type: 'success', message: 'Cập nhật trạng thái tài khoản thành công.' });
      await refetchAfterAccountAction(statusConfirmUser);
    } catch (err) {
      setLocalFeedback({ type: 'error', message: err.message || 'Không thể cập nhật trạng thái tài khoản.' });
    }
  };

  const handleResetPasswordConfirm = async (resetPassword, payload) => {
    if (!resetPasswordUser) return Promise.resolve(null);
    try {
      await resetPassword(resetPasswordUser, payload);
      setResetPasswordUser(null);
      setLocalFeedback({ type: 'success', message: 'Đặt lại mật khẩu thành công.' });
      await refetchAfterAccountAction(resetPasswordUser);
    } catch (err) {
      setLocalFeedback({ type: 'error', message: err.message || 'Không thể đặt lại mật khẩu.' });
      throw err;
    }
  };

  return {
    selectedTarget,
    selectedTargetId,
    detailOpen,
    createOpen,
    localFeedback,
    fromAdminUsers,
    openStudentDetail,
    setDetailOpen,
    setCreateOpen,
    closeFeedback,
    handleCreateSuccess,
    retryStudentDetail,
    statusConfirmUser,
    resetPasswordUser,
    askToggleStatus,
    askResetPassword,
    closeStatusConfirmModal,
    closeResetPasswordModal,
    handleConfirmStatus,
    handleResetPasswordConfirm,
    editStudent,
    editOpen,
    openEditStudent,
    closeEditStudent,
    handleSubmitEdit,
  };
};
