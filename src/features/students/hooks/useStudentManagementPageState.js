import { useMemo, useState } from 'react';

export const useStudentManagementPageState = ({
  locationState,
  selectedStudent,
  detailStudentId,
  setSelectedStudent,
  setSelectedHealthProfile,
  fetchStudentDetail,
  clearFeedback,
  fetchList,
  tablePage,
  updateStudentBasic,
  updateStudentHealth,
}) => {
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [healthEditOpen, setHealthEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(Boolean(locationState?.openCreateStudent));
  const [actionDialog, setActionDialog] = useState(null);
  const [localFeedback, setLocalFeedback] = useState(null);

  const fromAdminUsers = locationState?.source === 'admin-users';
  const selectedTarget = selectedStudent || selected;
  const selectedTargetId = selectedTarget?.apiId || selectedTarget?.studentId || selectedTarget?.id;

  const openWithSelection = async (row, openPanel) => {
    setSelected(row);
    setSelectedStudent(row);
    setSelectedHealthProfile(null);
    openPanel(true);
    await fetchStudentDetail(row.apiId || row.studentId || row.id, row);
  };

  const openStudentDetail = (row) => openWithSelection(row, setDetailOpen);
  const openBasicEdit = (row) => openWithSelection(row, setEditOpen);
  const openHealthEdit = (row) => openWithSelection(row, setHealthEditOpen);

  const actionDialogConfig = useMemo(() => {
    if (!actionDialog) {
      return null;
    }

    if (actionDialog.type === 'reset-password') {
      return {
        title: 'Reset mật khẩu học sinh',
        message: 'Chức năng reset mật khẩu học sinh đang chờ endpoint backend. Bạn có thể dùng tính năng này ngay khi API sẵn sàng.',
        confirmLabel: 'Đã hiểu',
      };
    }

    if (actionDialog.type === 'toggle-status') {
      return {
        title: 'Ẩn hồ sơ hoặc ngưng hoạt động',
        message: 'Chức năng ẩn hồ sơ/ngưng hoạt động đang chờ endpoint backend. UI đã sẵn sàng để kết nối API.',
        confirmLabel: 'Đã hiểu',
      };
    }

    return {
      title: 'Lịch sử sức khỏe',
      message: 'Màn hình lịch sử sức khỏe đang chờ endpoint dữ liệu lịch sử. Bạn vẫn có thể cập nhật hồ sơ sức khỏe hiện tại trong drawer.',
      confirmLabel: 'Đã hiểu',
    };
  }, [actionDialog]);

  const closeFeedback = () => {
    clearFeedback();
    setLocalFeedback(null);
  };

  const handleCreateSuccess = async (result) => {
    await fetchList({ page: tablePage });
    setLocalFeedback({
      type: 'success',
      message: result?.message || 'Tạo học sinh thành công.',
    });
  };

  const closeActionDialog = () => setActionDialog(null);

  const handleActionDialogConfirm = () => {
    setActionDialog(null);
    setLocalFeedback({
      type: 'error',
      message: 'Không thể thực hiện thao tác này do API chưa sẵn sàng.',
    });
  };

  const submitStudentBasic = (payload) => {
    if (!selectedTargetId) {
      return Promise.resolve(false);
    }

    return updateStudentBasic(selectedTargetId, payload);
  };

  const submitStudentHealth = (payload) => {
    const targetId = detailStudentId || selectedTargetId;
    if (!targetId) {
      return Promise.resolve(false);
    }

    return updateStudentHealth(targetId, payload);
  };

  const retryStudentDetail = () => {
    if (!selectedTargetId) {
      return Promise.resolve(null);
    }

    return fetchStudentDetail(selectedTargetId, selectedTarget);
  };

  return {
    selectedTarget,
    selectedTargetId,
    detailOpen,
    editOpen,
    healthEditOpen,
    createOpen,
    localFeedback,
    fromAdminUsers,
    actionDialogConfig,
    openStudentDetail,
    openBasicEdit,
    openHealthEdit,
    setDetailOpen,
    setEditOpen,
    setHealthEditOpen,
    setCreateOpen,
    closeFeedback,
    setActionDialog,
    closeActionDialog,
    handleActionDialogConfirm,
    handleCreateSuccess,
    submitStudentBasic,
    submitStudentHealth,
    retryStudentDetail,
  };
};