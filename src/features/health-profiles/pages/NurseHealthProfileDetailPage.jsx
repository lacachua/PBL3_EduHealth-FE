import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import SectionCard from '../../../shared/components/admin/SectionCard';
import NurseModulePageHeader from '../../../shared/components/nurse/NurseModulePageHeader';
import { resolveNurseStudentRouteId } from '../../students/adapters/nurseStudentIdentifierAdapter';
import NurseHealthProfileHeader from '../components/NurseHealthProfileHeader';
import NurseHealthProfileEditDrawer from '../components/NurseHealthProfileEditDrawer';
import NurseHealthMetricCards from '../components/NurseHealthMetricCards';
import NurseHealthOverviewPanels from '../components/NurseHealthOverviewPanels';
import NurseHealthProfileTabs from '../components/NurseHealthProfileTabs';
import { useNurseHealthProfileDetail } from '../hooks/useNurseHealthProfileDetail';

const historyCardClass = 'rounded-lg border border-outline-variant bg-surface-container-low p-3';
const sectionCardClass = 'app-card-shell rounded-xl p-4';
const sectionHeaderClass = 'app-section-header -mx-4 -mt-4 mb-3 flex flex-col gap-1.5 rounded-t-xl px-4 py-2.5 md:flex-row md:items-start md:justify-between';
const sectionTitleClass = 'font-headline text-[0.97rem] font-bold text-on-surface';
const sectionSubtitleClass = 'mt-0.5 text-[11px] text-on-surface-variant';

const vaccinationStatusMeta = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'DONE') {
    return {
      label: 'Đã tiêm',
      className: 'bg-success-soft text-success',
    };
  }

  if (normalized === 'POSTPONED') {
    return {
      label: 'Hoãn tiêm',
      className: 'bg-warning-soft text-warning',
    };
  }

  if (normalized === 'CONTRAINDICATED') {
    return {
      label: 'Chống chỉ định',
      className: 'bg-danger-soft text-danger',
    };
  }

  if (normalized === 'ABSENT') {
    return {
      label: 'Vắng mặt',
      className: 'bg-surface-container-low text-on-surface-variant',
    };
  }

  return {
    label: 'Chờ tiêm',
    className: 'bg-info-soft text-info',
  };
};

const NurseHealthProfileDetailPage = () => {
  const navigate = useNavigate();
  const { studentId: routeStudentIdParam } = useParams();
  const location = useLocation();
  const routeStudentId = resolveNurseStudentRouteId(routeStudentIdParam);
  const stateStudentId = resolveNurseStudentRouteId(location.state?.studentId);
  const requestedStudentId = routeStudentId || stateStudentId || null;
  const requestedInitialTab = location.state?.initialTab || 'overview';
  const requestedOpenHealthEdit = Boolean(location.state?.openHealthEdit);

  useEffect(() => {
    if (routeStudentIdParam && !routeStudentId) {
      navigate('/nurse/health-profiles', { replace: true });
    }
  }, [navigate, routeStudentId, routeStudentIdParam]);

  const {
    status,
    error,
    syncMessage,
    model,
    tabs,
    activeTab,
    setActiveTab,
    healthEditOpen,
    setHealthEditOpen,
    healthSaving,
    healthFieldErrors,
    allergyTypeOptions,
    feedback,
    clearFeedback,
    refreshProfile,
    updateHealthProfile,
  } = useNurseHealthProfileDetail({
    initialStudentId: requestedStudentId,
    initialTab: requestedInitialTab,
    initialHealthEditOpen: requestedOpenHealthEdit,
  });

  const mappedStudentForEdit = model
    ? {
      fullName: model.header.fullName,
      studentCode: model.header.studentCode,
      className: model.header.className,
      statusLabel: model.header.statusLabel,
      statusTone: model.header.statusTone,
      avatarUrl: model.header.avatarUrl,
    }
    : null;

  const renderAlertsTab = () => (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <SectionCard
        title="Dị ứng"
        subtitle="Danh sách dị ứng cần lưu ý khi khám và cấp phát thuốc"
        className={sectionCardClass}
        headerClassName={sectionHeaderClass}
        titleClassName={sectionTitleClass}
        subtitleClassName={sectionSubtitleClass}
      >
        {model.allergyItems.length ? (
          <div className="space-y-2">
            {model.allergyItems.map((allergy) => (
              <article key={allergy.id} className={historyCardClass}>
                <p className="text-sm font-semibold text-on-surface">{allergy.label}</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">{allergy.note || 'Chưa có ghi chú bổ sung.'}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">Không có dữ liệu dị ứng đang hoạt động.</p>
        )}
      </SectionCard>

      <SectionCard
        title="Bệnh nền & Ghi chú y tế"
        subtitle="Thông tin cần theo dõi trong quá trình chăm sóc sức khỏe học đường"
        className={sectionCardClass}
        headerClassName={sectionHeaderClass}
        titleClassName={sectionTitleClass}
        subtitleClassName={sectionSubtitleClass}
      >
        <div className="space-y-2">
          <article className={historyCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Bệnh nền</p>
            <p className="mt-1 text-sm text-on-surface">{model.profile?.chronicNote || 'Chưa ghi nhận bệnh nền.'}</p>
          </article>

          <article className={historyCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Tình trạng mắt</p>
            <p className="mt-1 text-sm text-on-surface">{model.profile?.eyeStatus || 'Chưa cập nhật.'}</p>
          </article>

          <article className={historyCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Ghi chú sức khỏe chung</p>
            <p className="mt-1 text-sm text-on-surface">{model.profile?.generalHealthNote || model.profile?.medicalHistoryNotes || 'Không có ghi chú bổ sung.'}</p>
          </article>
        </div>
      </SectionCard>
    </section>
  );

  const renderHealthHistoryTab = () => (
    <SectionCard
      title="Lịch sử khám"
      subtitle="Bản ghi khám sức khỏe, chẩn đoán và hướng xử trí"
      className={sectionCardClass}
      headerClassName={sectionHeaderClass}
      titleClassName={sectionTitleClass}
      subtitleClassName={sectionSubtitleClass}
    >
      {model.healthHistory.items.length ? (
        <div className="space-y-2">
          {model.healthHistory.items.map((item) => (
            <article key={item.id} className={historyCardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-on-surface">{item.diagnosis}</p>
                <span className="text-[11px] text-on-surface-variant">{item.visitDateLabel}</span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">Triệu chứng: {item.symptoms}</p>
              <p className="mt-1 text-xs text-on-surface-variant">Điều trị: {item.treatment}</p>
              <p className="mt-1 text-[11px] text-on-surface-variant">Phụ trách: {item.nurseName}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">Chưa có dữ liệu lịch sử khám cho học sinh này.</p>
      )}
    </SectionCard>
  );

  const renderMedicationTab = () => (
    <SectionCard
      title="Lịch sử dùng thuốc"
      subtitle="Tổng hợp đơn thuốc đã cấp phát trong các lần khám"
      className={sectionCardClass}
      headerClassName={sectionHeaderClass}
      titleClassName={sectionTitleClass}
      subtitleClassName={sectionSubtitleClass}
    >
      {model.medicationHistory.length ? (
        <div className="space-y-2">
          {model.medicationHistory.map((record) => (
            <article key={record.id} className={historyCardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-on-surface">{record.medicineName}</p>
                <span className="text-[11px] text-on-surface-variant">{record.visitDateLabel}</span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">Số lượng: {record.quantity}</p>
              <p className="mt-1 text-xs text-on-surface-variant">Hướng dẫn: {record.usageInstruction}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">Chưa ghi nhận lịch sử dùng thuốc.</p>
      )}
    </SectionCard>
  );

  const renderVaccinationTab = () => (
    <SectionCard
      title="Tiêm chủng"
      subtitle="Thông tin các mũi tiêm và tình trạng hoàn thành"
      className={sectionCardClass}
      headerClassName={sectionHeaderClass}
      titleClassName={sectionTitleClass}
      subtitleClassName={sectionSubtitleClass}
    >
      {model.vaccinations.length ? (
        <div className="space-y-2">
          {model.vaccinations.map((record) => (
            <article key={record.id} className={historyCardClass}>
              {(() => {
                const statusMeta = vaccinationStatusMeta(record.status);
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface">{record.vaccineName}</p>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-on-surface-variant">Ngày tiêm: {record.administeredAt}</p>
                  </>
                );
              })()}
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">Chưa có dữ liệu tiêm chủng.</p>
      )}
    </SectionCard>
  );

  return (
    <div className="space-y-3.5 text-on-surface">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={clearFeedback}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-success/25 bg-success-soft text-success"
        classMap={{
          error: 'border-danger/25 bg-danger-soft text-danger',
          success: 'border-success/25 bg-success-soft text-success',
        }}
      />

      <NurseModulePageHeader
        title="Hồ sơ học sinh"
        description="Theo dõi thông tin sức khỏe, lịch sử khám và chỉ số phát triển của học sinh."
        actions={(
          <button
            type="button"
            onClick={() => navigate('/nurse/health-profiles')}
            className="app-focus-ring app-btn-secondary inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            Quay lại danh sách
          </button>
        )}
      />

      <AdminAsyncState
        status={status}
        error={error}
        onRetry={refreshProfile}
        loadingLabel="Đang tải hồ sơ sức khỏe học sinh..."
        emptyTitle="Chưa có dữ liệu hồ sơ"
        emptyDescription="Vui lòng thử đồng bộ lại từ hệ thống EduHealth."
      >
        {model ? (
          <div className="space-y-3.5">
            <NurseHealthProfileHeader
              header={model.header}
              syncMessage={syncMessage}
              onEditHealthProfile={() => setHealthEditOpen(true)}
            />

            <NurseHealthMetricCards metrics={model.metrics} />

            <NurseHealthProfileTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === 'overview' ? (
              <NurseHealthOverviewPanels
                alerts={model.alerts}
                vaccinations={model.vaccinations}
                emergencyContacts={model.emergencyContacts}
                healthHistory={model.healthHistory}
                examinationHistory={model.examinationHistory}
              />
            ) : null}

            {activeTab === 'alerts' ? renderAlertsTab() : null}
            {activeTab === 'health-history' ? renderHealthHistoryTab() : null}
            {activeTab === 'medication-history' ? renderMedicationTab() : null}
            {activeTab === 'vaccinations' ? renderVaccinationTab() : null}
          </div>
        ) : null}
      </AdminAsyncState>

      <NurseHealthProfileEditDrawer
        key={`nurse-health-edit-${healthEditOpen ? 'open' : 'closed'}-${model?.header?.studentId || 'none'}`}
        open={healthEditOpen}
        student={mappedStudentForEdit}
        profile={model?.profile || null}
        allergyItems={model?.allergyItems || []}
        allergyTypeOptions={allergyTypeOptions}
        submitting={healthSaving}
        apiErrors={healthFieldErrors}
        onClose={() => setHealthEditOpen(false)}
        onSubmit={async (values) => {
          const success = await updateHealthProfile(values);
          if (success) {
            setHealthEditOpen(false);
          }
          return success;
        }}
      />
    </div>
  );
};

export default NurseHealthProfileDetailPage;
