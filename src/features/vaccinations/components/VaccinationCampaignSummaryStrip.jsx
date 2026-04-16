import React from 'react';
import VaccinationStatusBadge from './VaccinationStatusBadge';

const VaccinationCampaignSummaryStrip = ({ campaign }) => {
  if (!campaign) {
    return null;
  }

  const stats = campaign.statistics || {};
  const hasTargetClasses = Array.isArray(campaign.targetClassIds) && campaign.targetClassIds.length > 0;
  const targetClassCount = hasTargetClasses ? campaign.targetClassIds.length : 0;
  const hasSchedule = Boolean(campaign.scheduledDateLabel && campaign.scheduledDateLabel !== '--');

  return (
    <section className="app-panel-shell p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2.5 lg:max-w-[56%]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{campaign.id}</span>
            <VaccinationStatusBadge label={campaign.statusLabel} className={campaign.statusBadgeClassName} />
          </div>

          <h1 className="text-2xl font-extrabold text-on-surface">{campaign.name}</h1>
          <p className="text-sm text-on-surface-variant">
            Vaccine: <span className="font-semibold text-on-surface">{campaign.vaccineName}</span>
            {' • '}
            Mũi số: <span className="font-semibold text-on-surface">{campaign.doseNumber}</span>
            {hasSchedule ? (
              <>
                {' • '}
                Ngày dự kiến: <span className="font-semibold text-on-surface">{campaign.scheduledDateLabel}</span>
              </>
            ) : null}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-on-surface">
            <span className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1">
              Đối tượng: <span className="font-semibold">{campaign.targetTypeLabel}</span>
            </span>
            {hasTargetClasses ? (
              <span className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1">
                Số lớp áp dụng: <span className="font-semibold">{targetClassCount}</span>
              </span>
            ) : null}
          </div>

          {campaign.note ? <p className="text-sm text-on-surface">Ghi chú: {campaign.note}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
          <div className="app-kpi-card">
            <p className="app-kpi-label">Tổng học sinh</p>
            <p className="app-kpi-value text-lg">{stats.totalStudents || 0}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Đã tiêm</p>
            <p className="app-kpi-value text-lg text-success">{stats.doneCount || 0}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Chờ tiêm</p>
            <p className="app-kpi-value text-lg text-warning">{stats.pendingCount || 0}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Tạm hoãn</p>
            <p className="app-kpi-value text-lg text-warning">{stats.postponedCount || 0}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Chống chỉ định</p>
            <p className="app-kpi-value text-lg text-danger">{stats.contraindicatedCount || 0}</p>
          </div>
          <div className="app-kpi-card">
            <p className="app-kpi-label">Vắng mặt</p>
            <p className="app-kpi-value text-lg text-on-surface-variant">{stats.absentCount || 0}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaccinationCampaignSummaryStrip;
