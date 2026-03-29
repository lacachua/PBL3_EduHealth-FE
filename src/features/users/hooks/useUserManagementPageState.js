import { useState } from 'react';

export const useUserManagementPageState = ({
  navigate,
  setSelectedUser,
  fetchUserDetail,
  createUser,
  updateUser,
  toggleStatus,
  resetPassword,
}) => {
  const [activeUser, setActiveUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const [createNurseOpen, setCreateNurseOpen] = useState(false);
  const [statusConfirmUser, setStatusConfirmUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);

  const handleCreate = () => {
    setAccountTypeModalOpen(true);
  };

  const handleSelectNurseAccount = () => {
    setAccountTypeModalOpen(false);
    setCreateNurseOpen(true);
  };

  const handleSelectStudentAccount = () => {
    setAccountTypeModalOpen(false);
    navigate('/admin/students', {
      state: {
        openCreateStudent: true,
        source: 'admin-users',
      },
    });
  };

  const handleEdit = (user) => {
    setActiveUser(user);
    setDetailOpen(false);
    setEditOpen(true);
  };

  const handleViewDetail = async (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
    await fetchUserDetail(user.id, user);
  };

  const handleSubmitEdit = async (payload) => {
    if (!activeUser?.id) {
      return;
    }

    await updateUser(activeUser.id, payload);
  };

  const handleSubmitCreate = async (payload) => {
    await createUser(payload);
  };

  const askToggleStatus = (user) => {
    setStatusConfirmUser(user);
  };

  const askResetPassword = (user) => {
    setResetPasswordUser(user);
  };

  const handleConfirmStatus = async (reason) => {
    if (!statusConfirmUser) {
      return;
    }

    await toggleStatus(statusConfirmUser, reason);
    setStatusConfirmUser(null);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedUser(null);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setActiveUser(null);
  };

  const closeAccountTypeModal = () => setAccountTypeModalOpen(false);
  const closeCreateNurseModal = () => setCreateNurseOpen(false);
  const closeStatusConfirmModal = () => setStatusConfirmUser(null);
  const closeResetPasswordModal = () => setResetPasswordUser(null);

  const handleResetPasswordConfirm = (payload) => {
    if (!resetPasswordUser) {
      return Promise.resolve(null);
    }

    return resetPassword(resetPasswordUser.id, payload);
  };

  return {
    activeUser,
    detailOpen,
    editOpen,
    accountTypeModalOpen,
    createNurseOpen,
    statusConfirmUser,
    resetPasswordUser,
    handleCreate,
    handleSelectNurseAccount,
    handleSelectStudentAccount,
    handleEdit,
    handleViewDetail,
    handleSubmitEdit,
    handleSubmitCreate,
    askToggleStatus,
    askResetPassword,
    handleConfirmStatus,
    closeDetail,
    closeEdit,
    closeAccountTypeModal,
    closeCreateNurseModal,
    closeStatusConfirmModal,
    closeResetPasswordModal,
    handleResetPasswordConfirm,
  };
};