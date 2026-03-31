import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import AdminManagementListSection from '../../../shared/components/admin/AdminManagementListSection';
import ConfirmDialog from '../../../shared/components/admin/ConfirmDialog';
import PageHeader from '../../../shared/components/admin/PageHeader';
import StudentDetailDrawer from '../components/StudentDetailDrawer';
import StudentEditDrawer from '../components/StudentEditDrawer';
import StudentFilters from '../components/StudentFilters';
import StudentHealthEditDrawer from '../components/StudentHealthEditDrawer';
import StudentTable from '../components/StudentTable';
import StudentCreateModal from '../components/StudentCreateModal';
import { STUDENT_BASE_CLASS } from '../constants/studentUiTokens';
import { STUDENT_MANAGEMENT_COPY } from '../constants/studentManagementCopy';
import { useStudentManagement } from '../hooks/useStudentManagement';
import { useStudentManagementPageState } from '../hooks/useStudentManagementPageState';

const StudentManagementPage = () => {
  const location = useLocation();

  const {
    filters,
    tableData,
    status,
    error,
    feedback,
    selectedStudent,
    selectedHealthProfile,
    detailStudentId,
    basicDetailLoading,
    healthDetailLoading,
    basicDetailError,
    healthDetailError,
    basicSyncMessage,
    healthSyncMessage,
    basicFieldErrors,
    healthFieldErrors,
    basicSaving,
    healthSaving,
    clearFeedback,
    setSelectedStudent,
    setSelectedHealthProfile,
    onFiltersChange,
    onPageChange,
    fetchList,
    fetchStudentDetail,
    updateStudentBasic,
    updateStudentHealth,
  } = useStudentManagement();

  const {
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
  } = useStudentManagementPageState({
    locationState: location.state,
    selectedStudent,
    detailStudentId,
    setSelectedStudent,
    setSelectedHealthProfile,
    fetchStudentDetail,
    clearFeedback,
    fetchList,
    tablePage: tableData.page,
    updateStudentBasic,
    updateStudentHealth,
  });

  return (
    <div className={`space-y-4 ${STUDENT_BASE_CLASS.app}`}>
      <AdminFeedbackToast
        feedback={feedback || localFeedback}
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
        sectionClassName={`overflow-hidden rounded-xl shadow-[0_1px_4px_rgba(15,23,42,0.04)] ${STUDENT_BASE_CLASS.section}`}
        panelClassName={`border-b px-4 py-3 md:px-5 ${STUDENT_BASE_CLASS.subtlePanel} ${STUDENT_BASE_CLASS.mutedText}`}
        borderClassName={`border-t px-4 py-3 md:px-5 ${STUDENT_BASE_CLASS.border}`}
        filters={<StudentFilters initialValue={filters} onApply={onFiltersChange} />}
        summary={STUDENT_MANAGEMENT_COPY.resultCount(tableData.rows.length, tableData.totalItems)}
        status={status}
        error={error}
        onRetry={fetchList}
        loadingLabel={STUDENT_MANAGEMENT_COPY.loadingLabel}
        emptyTitle={STUDENT_MANAGEMENT_COPY.emptyTitle}
        emptyDescription={STUDENT_MANAGEMENT_COPY.emptyDescription}
        table={<StudentTable rows={tableData.rows} onViewDetail={openStudentDetail} onEditBasic={openBasicEdit} onEditHealth={openHealthEdit} />}
        pagination={{
          page: tableData.page,
          pageSize: tableData.pageSize,
          totalItems: tableData.totalItems,
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
        onEditBasic={() => {
          setDetailOpen(false);
          setEditOpen(true);
        }}
        onEditHealth={() => {
          setDetailOpen(false);
          setHealthEditOpen(true);
        }}
        onViewHistory={() => setActionDialog({ type: 'history' })}
        onResetPassword={() => setActionDialog({ type: 'reset-password' })}
        onToggleStatus={() => setActionDialog({ type: 'toggle-status' })}
      />

      <StudentEditDrawer
        key={`basic-edit-${selectedTargetId || 'no-student'}-${editOpen ? 'open' : 'closed'}`}
        open={editOpen}
        student={selectedTarget}
        submitting={basicSaving}
        apiErrors={basicFieldErrors}
        onClose={() => setEditOpen(false)}
        onSubmit={submitStudentBasic}
        onResetPassword={() => setActionDialog({ type: 'reset-password' })}
        onToggleStatus={() => setActionDialog({ type: 'toggle-status' })}
      />

      <StudentHealthEditDrawer
        key={`health-edit-${selectedTargetId || 'no-student'}-${healthEditOpen ? 'open' : 'closed'}`}
        open={healthEditOpen}
        student={selectedTarget}
        profile={selectedHealthProfile}
        submitting={healthSaving}
        apiErrors={healthFieldErrors}
        onClose={() => setHealthEditOpen(false)}
        onSubmit={submitStudentHealth}
      />

      <StudentCreateModal
        key={`create-student-${createOpen ? 'open' : 'closed'}`}
        open={createOpen}
        fromAdminUsers={fromAdminUsers}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ConfirmDialog
        open={Boolean(actionDialogConfig)}
        title={actionDialogConfig?.title || ''}
        message={actionDialogConfig?.message || ''}
        confirmLabel={actionDialogConfig?.confirmLabel || 'Đóng'}
        onCancel={closeActionDialog}
        onConfirm={handleActionDialogConfirm}
      />
    </div>
  );
};

export default StudentManagementPage;
