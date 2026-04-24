import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import PageHeader from '../../../shared/components/admin/PageHeader';
import { ACCOUNT_BASE_CLASS, ACCOUNT_TOAST_CLASS_MAP } from '../constants/accountUiTokens';
import { USER_MANAGEMENT_COPY } from '../constants/userManagementCopy';
import UserFilters from '../components/UserFilters';
import UserDetailDrawer from '../components/UserDetailDrawer';
import UserEditDrawer from '../components/UserEditDrawer';
import UserStatusConfirmModal from '../components/UserStatusConfirmModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import UserTable from '../components/UserTable';
import AccountTypeSelectorModal from '../components/AccountTypeSelectorModal';
import CreateNurseAccountModal from '../components/CreateNurseAccountModal';
import { useUsersManagement } from '../hooks/useUserManagement';
import { useUserManagementPageState } from '../hooks/useUserManagementPageState';

const UserManagementPage = () => {
  const navigate = useNavigate();

  const {
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
    createFieldErrors,
    updateFieldErrors,
    fetchList,
    fetchUserDetail,
    onFiltersChange,
    onResetFilters,
    onPageChange,
    clearFeedback,
    setCreateFieldErrors,
    setSelectedUser,
    createUser,
    updateUser,
    toggleStatus,
    resetPassword,
  } = useUsersManagement();

  const {
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
  } = useUserManagementPageState({
    navigate,
    setSelectedUser,
    setCreateFieldErrors,
    fetchUserDetail,
    createUser,
    updateUser,
    toggleStatus,
    resetPassword,
  });

  return (
    <div className={`space-y-3.5 ${ACCOUNT_BASE_CLASS.app}`}>
      <AdminFeedbackToast
        feedback={feedback}
        onClose={clearFeedback}
        closeAriaLabel={USER_MANAGEMENT_COPY.closeToastAriaLabel}
        closeLabel={USER_MANAGEMENT_COPY.closeToastLabel}
        classMap={ACCOUNT_TOAST_CLASS_MAP}
      />

      <PageHeader
        title={USER_MANAGEMENT_COPY.title}
        description={USER_MANAGEMENT_COPY.description}
        actions={(
          <button
            type="button"
            onClick={handleCreate}
            className={`inline-flex items-center gap-1.5 px-3.5 ${ACCOUNT_BASE_CLASS.primaryButton}`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            {USER_MANAGEMENT_COPY.createButtonLabel}
          </button>
        )}
      />

      <AdminManagementListSection
        filters={<UserFilters initialValue={filters} onApply={onFiltersChange} onReset={onResetFilters} />}
        summary={tableData.totalItems > 0 ? `Đang hiển thị ${tableData.rows.length} tài khoản trên trang này • Tổng ${tableData.totalItems} tài khoản` : null}
        status={status}
        error={error}
        onRetry={fetchList}
        loadingLabel={USER_MANAGEMENT_COPY.loadingLabel}
        emptyTitle={USER_MANAGEMENT_COPY.emptyTitle}
        emptyDescription={USER_MANAGEMENT_COPY.emptyDescription}
        table={<UserTable rows={tableData.rows} onView={handleViewDetail} onEdit={handleEdit} onToggleStatus={askToggleStatus} onResetPassword={askResetPassword} />}
        pagination={{
          page: tableData.page,
          pageSize: tableData.pageSize,
          totalItems: tableData.totalItems,
          onPageChange,
        }}
      />

      <AccountTypeSelectorModal
        open={accountTypeModalOpen}
        onClose={closeAccountTypeModal}
        onSelectNurse={handleSelectNurseAccount}
        onSelectStudent={handleSelectStudentAccount}
      />

      <CreateNurseAccountModal
        open={createNurseOpen}
        submitting={submitting}
        apiErrors={createFieldErrors}
        onClose={closeCreateNurseModal}
        onSubmit={handleSubmitCreate}
      />

      <UserDetailDrawer
        open={detailOpen}
        user={selectedUser}
        loading={detailLoading}
        error={detailError}
        syncMessage={detailSyncMessage}
        onRetry={() => (selectedUser?.id ? fetchUserDetail(selectedUser.id, selectedUser) : Promise.resolve(null))}
        onClose={closeDetail}
        onEdit={handleEdit}
        onToggleStatus={askToggleStatus}
        onResetPassword={askResetPassword}
      />

      <UserEditDrawer
        open={editOpen}
        user={activeUser}
        submitting={submitting}
        apiErrors={updateFieldErrors}
        onClose={closeEdit}
        onSubmit={handleSubmitEdit}
        onToggleStatus={askToggleStatus}
        onResetPassword={askResetPassword}
      />

      <UserStatusConfirmModal
        open={Boolean(statusConfirmUser)}
        user={statusConfirmUser}
        submitting={submitting}
        onCancel={closeStatusConfirmModal}
        onConfirm={handleConfirmStatus}
      />

      <ResetPasswordModal
        open={Boolean(resetPasswordUser)}
        user={resetPasswordUser}
        submitting={submitting}
        onCancel={closeResetPasswordModal}
        onConfirm={handleResetPasswordConfirm}
      />
    </div>
  );
};

export default UserManagementPage;
