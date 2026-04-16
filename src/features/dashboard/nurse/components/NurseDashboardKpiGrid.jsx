import React from 'react';
import { Link } from 'react-router-dom';
import { formatDashboardNumber } from '../adapters/nurseDashboardAdapter';

const toneClassMap = {
  success: {
    icon: 'border-success/30 bg-success-soft text-success',
    card: 'border-success/18 bg-success-soft/30',
  },
  info: {
    icon: 'border-info/30 bg-info-soft text-info',
    card: 'border-info/18 bg-info-soft/26',
  },
  warning: {
    icon: 'border-warning/30 bg-warning-soft text-warning',
    card: 'border-warning/18 bg-warning-soft/26',
  },
  critical: {
    icon: 'border-danger/30 bg-danger-soft text-danger',
    card: 'border-danger/20 bg-danger-soft/28',
  },
};

const NurseDashboardKpiGrid = ({ kpis = [] }) => {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {kpis.map((kpi) => {
        const tone = toneClassMap[kpi.tone] || toneClassMap.info;
        const valueLabel = Number.isFinite(Number(kpi.value)) ? formatDashboardNumber(kpi.value) : '--';

        return (
          <Link
            key={kpi.id}
            to={kpi.to}
            className={`app-focus-ring app-interactive app-kpi-card min-h-[94px] rounded-xl px-3.5 py-3.5 hover:border-outline ${tone.card}`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="min-w-0 pr-1">
                <p className="app-kpi-label line-clamp-2 leading-4">{kpi.label}</p>
                <p className="app-kpi-value mt-1">{valueLabel}</p>
              </div>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${tone.icon}`}>
                <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-on-surface-muted">Xem chi tiết</span>
              <span className="material-symbols-outlined text-[15px] text-on-surface-muted">arrow_forward</span>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default NurseDashboardKpiGrid;
