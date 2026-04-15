import React from 'react';
import { Link } from 'react-router-dom';
import { formatDashboardNumber } from '../adapters/nurseDashboardAdapter';

const toneClassMap = {
  success: 'border-success/25 bg-success-soft text-success',
  info: 'border-info/25 bg-info-soft text-info',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  critical: 'border-danger/25 bg-danger-soft text-danger',
};

const NurseDashboardKpiGrid = ({ kpis = [] }) => {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {kpis.map((kpi) => {
        const toneClassName = toneClassMap[kpi.tone] || toneClassMap.info;
        const valueLabel = Number.isFinite(Number(kpi.value)) ? formatDashboardNumber(kpi.value) : '--';

        return (
          <Link
            key={kpi.id}
            to={kpi.to}
            className="nurse-focus-ring nurse-interactive min-h-[94px] rounded-xl border border-outline-variant bg-surface px-3.5 py-3.5 hover:border-outline"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="min-w-0 pr-1">
                <p className="line-clamp-2 text-[10px] font-semibold uppercase leading-4 tracking-[0.06em] text-on-surface-variant">{kpi.label}</p>
                <p className="mt-1 text-[1.5rem] font-extrabold leading-tight text-on-surface">{valueLabel}</p>
              </div>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${toneClassName}`}>
                <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

export default NurseDashboardKpiGrid;
