import { useState } from 'react';

export const useStudentManagementPageState = ({
  locationState,
  selectedStudent,
  setSelectedStudent,
  setSelectedHealthProfile,
  fetchStudentDetail,
  fetchList,
  tablePage,
}) => {
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(Boolean(locationState?.openCreateStudent));
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
  };
};