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
    <section className="rounded-2xl border border-[#D7ECDD] bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)] md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2.5 lg:max-w-[56%]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-semibold text-[#166534]">{campaign.id}</span>
            <VaccinationStatusBadge label={campaign.statusLabel} className={campaign.statusBadgeClassName} />
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A]">{campaign.name}</h1>
          <p className="text-sm text-[#64748B]">
            Vaccine: <span className="font-semibold text-[#0F172A]">{campaign.vaccineName}</span>
            {' • '}
            Mũi số: <span className="font-semibold text-[#0F172A]">{campaign.doseNumber}</span>
            {hasSchedule ? (
              <>
                {' • '}
                Ngày dự kiến: <span className="font-semibold text-[#0F172A]">{campaign.scheduledDateLabel}</span>
              </>
            ) : null}
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-[#334155]">
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1">
              Đối tượng: <span className="font-semibold">{campaign.targetTypeLabel}</span>
            </span>
            {hasTargetClasses ? (
              <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1">
                Số lớp áp dụng: <span className="font-semibold">{targetClassCount}</span>
              </span>
            ) : null}
          </div>

          {campaign.note ? <p className="text-sm text-[#334155]">Ghi chú: {campaign.note}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Tổng học sinh</p>
            <p className="text-lg font-bold text-[#0F172A]">{stats.totalStudents || 0}</p>
          </div>
          <div className="rounded-xl border border-[#DCFCE7] bg-[#F8FCF9] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#166534]">Đã tiêm</p>
            <p className="text-lg font-bold text-[#166534]">{stats.doneCount || 0}</p>
          </div>
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFCF2] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B45309]">Chờ tiêm</p>
            <p className="text-lg font-bold text-[#B45309]">{stats.pendingCount || 0}</p>
          </div>
          <div className="rounded-xl border border-[#FED7AA] bg-[#FFF8F1] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C2410C]">Tạm hoãn</p>
            <p className="text-lg font-bold text-[#C2410C]">{stats.postponedCount || 0}</p>
          </div>
          <div className="rounded-xl border border-[#FECACA] bg-[#FFF6F6] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B91C1C]">Chống chỉ định</p>
            <p className="text-lg font-bold text-[#B91C1C]">{stats.contraindicatedCount || 0}</p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#334155]">Vắng mặt</p>
            <p className="text-lg font-bold text-[#334155]">{stats.absentCount || 0}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaccinationCampaignSummaryStrip;
