import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import PageHeader from '../../../shared/components/admin/PageHeader';
import StudentDetailDrawer from '../components/StudentDetailDrawer';
import StudentFilters from '../components/StudentFilters';
import StudentTable from '../components/StudentTable';
import StudentCreateModal from '../components/StudentCreateModal';
import StudentEditDrawer from '../components/StudentEditDrawer';
import { STUDENT_BASE_CLASS } from '../constants/studentUiTokens';
import { STUDENT_MANAGEMENT_COPY } from '../constants/studentManagementCopy';
import UserStatusConfirmModal from '../../users/components/UserStatusConfirmModal';
import ResetPasswordModal from '../../users/components/ResetPasswordModal';
import { useStudentManagement } from '../hooks/useStudentManagement';
import { useStudentManagementPageState } from '../hooks/useStudentManagementPageState';
import { useClassOptions } from '../hooks/useClassOptions';

const StudentManagementPage = () => {
  const location = useLocation();
  const {
    classes,
    loading: classesLoading,
    error: classesError,
  } = useClassOptions();

  const {
    filters,
    tableData,
    status,
    error,
    selectedStudent,
    selectedHealthProfile,
    basicDetailLoading,
    healthDetailLoading,
    basicDetailError,
    healthDetailError,
    basicSyncMessage,
    healthSyncMessage,
    setSelectedStudent,
    setSelectedHealthProfile,
    onFiltersChange,
    onPageChange,
    fetchList,
    fetchStudentDetail,
    toggleStatus,
    resetPassword,
    updateStudent,
    updateSubmitting,
    updateFieldErrors,
    clearUpdateErrors,
  } = useStudentManagement();

  const {
    selectedTarget,
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
  } = useStudentManagementPageState({
    locationState: location.state,
    selectedStudent,
    setSelectedStudent,
    setSelectedHealthProfile,
    fetchStudentDetail,
    fetchList,
    tablePage: tableData.page,
    updateStudent,
    clearUpdateErrors,
  });

  return (
    <div className={`space-y-4 ${STUDENT_BASE_CLASS.app}`}>
      <AdminFeedbackToast
        feedback={localFeedback}
        onClose={closeFeedback}
        closeAriaLabel={STUDENT_MANAGEMENT_COPY.closeToastAriaLabel}
        closeLabel={STUDENT_MANAGEMENT_COPY.closeToastLabel}
        fallbackClassName="border-success/30 bg-success-soft text-success"
        classMap={{
          error: 'border-danger/30 bg-danger-soft text-danger',
          success: 'border-success/30 bg-success-soft text-success',
        }}
      />

      <PageHeader
        title={STUDENT_MANAGEMENT_COPY.title}
        description={STUDENT_MANAGEMENT_COPY.description}
        actions={(
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold transition ${STUDENT_BASE_CLASS.primaryButton}`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            {STUDENT_MANAGEMENT_COPY.createButtonLabel}
          </button>
        )}
      />

      <AdminManagementListSection
        filters={(
          <StudentFilters
            initialValue={filters}
            onApply={onFiltersChange}
            classes={classes}
            classesLoading={classesLoading}
            classesError={classesError}
          />
        )}
        summary={tableData.totalItems > 0 ? STUDENT_MANAGEMENT_COPY.resultCount(tableData.rows.length, tableData.totalItems) : null}
        status={status}
        error={error}
        onRetry={fetchList}
        loadingLabel={STUDENT_MANAGEMENT_COPY.loadingLabel}
        emptyTitle={STUDENT_MANAGEMENT_COPY.emptyTitle}
        emptyDescription={STUDENT_MANAGEMENT_COPY.emptyDescription}
        table={(
          <StudentTable
            rows={tableData.rows}
            onViewDetail={openStudentDetail}
            onEdit={openEditStudent}
            onToggleStatus={askToggleStatus}
            onResetPassword={askResetPassword}
          />
        )}
        pagination={{
          page: tableData.page,
          pageSize: tableData.pageSize,
          totalItems: tableData.totalItems,
          totalPages: tableData.totalPages,
          onPageChange,
        }}
      />

      <StudentDetailDrawer
        open={detailOpen}
        student={selectedTarget}
        healthProfile={selectedHealthProfile}
        loading={basicDetailLoading || healthDetailLoading}
        error={basicDetailError || healthDetailError}
        syncMessage={basicSyncMessage || healthSyncMessage}
        onClose={() => setDetailOpen(false)}
        onRetry={retryStudentDetail}
        onEdit={openEditStudent}
        onToggleStatus={askToggleStatus}
        onResetPassword={askResetPassword}
      />

      <StudentCreateModal
        open={createOpen}
        fromAdminUsers={fromAdminUsers}
        classes={classes}
        classesLoading={classesLoading}
        classesError={classesError}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <StudentEditDrawer
        open={editOpen}
        student={editStudent}
        classes={classes}
        classesLoading={classesLoading}
        classesError={classesError}
        submitting={updateSubmitting}
        apiErrors={updateFieldErrors}
        onClose={closeEditStudent}
        onSubmit={handleSubmitEdit}
      />

      <UserStatusConfirmModal
        open={Boolean(statusConfirmUser)}
        user={statusConfirmUser}
        submitting={false}
        onCancel={closeStatusConfirmModal}
        onConfirm={(reason) => handleConfirmStatus(toggleStatus, reason)}
      />

      <ResetPasswordModal
        open={Boolean(resetPasswordUser)}
        user={resetPasswordUser}
        submitting={false}
        onCancel={closeResetPasswordModal}
        onConfirm={(payload) => handleResetPasswordConfirm(resetPassword, payload)}
      />
    </div>
  );
};

export default StudentManagementPage;
