import React from 'react';

const severityToneMap = {
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
};

const supplyToneMap = {
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
};

const coverageToneMap = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const InsightCard = ({ title, icon, children }) => {
  return (
    <section className="rounded-2xl border border-outline-variant/80 bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <h4 className="text-[11px] font-black uppercase tracking-wider text-on-surface">{title}</h4>
        </div>
      </div>
      {children}
    </section>
  );
};

const HighPriorityAlerts = ({ alerts, onOpenClass }) => {
  const visibleAlerts = alerts.slice(0, 2);

  return (
    <InsightCard title="Top lớp có rủi ro cao" icon="emergency">
      <div className="space-y-2.5">
        {visibleAlerts.map((alert) => (
          <button
            type="button"
            key={alert.id}
            onClick={() => onOpenClass(alert.classId)}
            className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2 text-left transition hover:bg-surface"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-on-surface">{alert.className}</p>
              <p className={`text-xs font-bold ${severityToneMap[alert.severityTone] || severityToneMap.warning}`}>{alert.severity}</p>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>{alert.metric}</span>
              <span>{alert.updatedAtShort || alert.updatedAt}</span>
            </div>
          </button>
        ))}
      </div>
    </InsightCard>
  );
};

const LowSuppliesPanel = ({ supplies }) => {
  const visibleSupplies = supplies.slice(0, 3);

  return (
    <InsightCard title="Cảnh báo vật tư" icon="inventory_2">
      <div className="space-y-2.5">
        {visibleSupplies.map((item) => {
          const tone = supplyToneMap[item.tone] || supplyToneMap.warning;

          return (
            <div key={item.id} className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                <p className={`text-xs font-bold ${tone}`}>{item.remaining}</p>
              </div>
              <p className="mt-0.5 text-[11px] text-on-surface-variant">{item.thresholdLabel || 'Dưới ngưỡng an toàn'}</p>
            </div>
          );
        })}
      </div>
    </InsightCard>
  );
};

const LowVaccinationPanel = ({ items }) => {
  const visibleItems = items.slice(0, 2);

  return (
    <InsightCard title="Tiêm chủng cần chú ý" icon="vaccines">
      <div className="space-y-2.5">
        {visibleItems.map((item) => {
          const tone = coverageToneMap[item.tone] || coverageToneMap.success;

          return (
            <div key={item.id} className="rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                <p className={`text-xs font-black ${tone}`}>{item.coverage}%</p>
              </div>
              <p className="mt-0.5 text-[11px] text-on-surface-variant">{item.note || 'Theo dõi để đạt ngưỡng 90%'}</p>
            </div>
          );
        })}
      </div>
    </InsightCard>
  );
};

const AdminReportSidePanel = ({
  highPriorityAlerts,
  lowSupplies,
  lowVaccinationCoverage,
  onOpenClassDetail,
}) => {
  return (
    <div className="space-y-4">
      <HighPriorityAlerts alerts={highPriorityAlerts} onOpenClass={onOpenClassDetail} />
      <LowSuppliesPanel supplies={lowSupplies} />
      <LowVaccinationPanel items={lowVaccinationCoverage} />
    </div>
  );
};

export default AdminReportSidePanel;
