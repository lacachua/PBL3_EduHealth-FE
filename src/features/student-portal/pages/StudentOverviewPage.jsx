import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

const reminderToneClassMap = {
  amber: 'student-reminder-card app-tone-warning app-tone-surface',
  mint: 'student-reminder-card app-tone-primary app-tone-surface',
  sky: 'student-reminder-card app-tone-info app-tone-surface',
};

const summaryVisuals = [
  {
    icon: 'monitor_heart',
    cardClassName: 'app-tone-primary app-tone-surface',
    iconClassName: 'bg-primary/14 text-primary',
  },
  {
    icon: 'health_metrics',
    cardClassName: 'app-tone-info app-tone-surface',
    iconClassName: 'bg-info/14 text-info',
  },
  {
    icon: 'vaccines',
    cardClassName: 'app-tone-warning app-tone-surface',
    iconClassName: 'bg-warning/16 text-warning',
  },
  {
    icon: 'check_circle',
    cardClassName: 'app-tone-success app-tone-surface',
    iconClassName: 'bg-success/16 text-success',
  },
];

const activityTagToneClassMap = {
  mint: 'student-activity-tag app-tone-primary app-tone-chip',
  amber: 'student-activity-tag app-tone-warning app-tone-chip',
  sky: 'student-activity-tag app-tone-info app-tone-chip',
};

const activityIconToneClassMap = {
  mint: 'bg-primary-soft text-primary',
  amber: 'bg-warning-soft text-warning',
  sky: 'bg-info-soft text-info',
};

const growthMetricOptions = {
  height: {
    key: 'heightCm',
    label: 'Chiều cao',
    unit: 'cm',
    fractionDigits: 0,
    lineClass: 'student-chart-line student-chart-series-height',
    areaClass: 'student-chart-area student-chart-series-height',
    dotClass: 'student-chart-dot student-chart-series-height',
  },
  weight: {
    key: 'weightKg',
    label: 'Cân nặng',
    unit: 'kg',
    fractionDigits: 1,
    lineClass: 'student-chart-line student-chart-series-weight',
    areaClass: 'student-chart-area student-chart-series-weight',
    dotClass: 'student-chart-dot student-chart-series-weight',
  },
};

const growthMetricToggleOrder = ['height', 'weight'];

const CHART_FRAME = {
  width: 680,
  height: 260,
  padding: {
    top: 16,
    right: 20,
    bottom: 32,
    left: 42,
  },
};

const normalizeMetaText = (value) => {
  const normalized = String(value ?? '').trim();

  if (!normalized || normalized === '--') {
    return 'Chưa cập nhật';
  }

  return normalized;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMetricNumber = (value, fractionDigits) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

const formatMetricValue = (value, unit, fractionDigits) => {
  return `${formatMetricNumber(value, fractionDigits)} ${unit}`;
};

const formatMetricDelta = (value, unit, fractionDigits) => {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMetricValue(Math.abs(value), unit, fractionDigits)}`;
};

const buildGrowthChartModel = (rawPoints, metricKey) => {
  const points = (Array.isArray(rawPoints) ? rawPoints : [])
    .map((item) => ({
      id: item?.id,
      label: item?.label,
      metricValue: toNumber(item?.[metricKey]),
    }))
    .filter((item) => item.metricValue !== null);

  if (!points.length) {
    return null;
  }

  const values = points.map((item) => item.metricValue);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minSpan = metricKey === 'heightCm' ? 2 : 1;
  const span = Math.max(maxValue - minValue, minSpan);
  const domainPadding = span * 0.28;
  const domainMin = Math.max(0, minValue - domainPadding);
  const domainMax = maxValue + domainPadding;
  const domainSpan = domainMax - domainMin || 1;

  const plotWidth = CHART_FRAME.width - CHART_FRAME.padding.left - CHART_FRAME.padding.right;
  const plotHeight = CHART_FRAME.height - CHART_FRAME.padding.top - CHART_FRAME.padding.bottom;

  const toX = (index) => {
    if (points.length === 1) {
      return CHART_FRAME.padding.left + plotWidth / 2;
    }

    return CHART_FRAME.padding.left + (index / (points.length - 1)) * plotWidth;
  };

  const toY = (value) => {
    return CHART_FRAME.padding.top + ((domainMax - value) / domainSpan) * plotHeight;
  };

  const plottedPoints = points.map((point, index) => ({
    ...point,
    x: toX(index),
    y: toY(point.metricValue),
  }));

  const linePath = plottedPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  const baselineY = CHART_FRAME.height - CHART_FRAME.padding.bottom;
  const firstPoint = plottedPoints[0];
  const lastPoint = plottedPoints[plottedPoints.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = domainMax - ratio * domainSpan;

    return {
      id: `tick-${index}`,
      value,
      y: toY(value),
    };
  });

  return {
    linePath,
    areaPath,
    baselineY,
    points: plottedPoints,
    yTicks,
    latestValue: values[values.length - 1],
    delta: values[values.length - 1] - values[0],
  };
};

const resolveActivityTagClass = (tone) => {
  return activityTagToneClassMap[tone] || activityTagToneClassMap.mint;
};

const resolveActivityIconClass = (tone) => {
  return activityIconToneClassMap[tone] || activityIconToneClassMap.mint;
};

const StudentOverviewPage = () => {
  const navigate = useNavigate();
  const [overviewData, setOverviewData] = useState(null);
  const [growthMetric, setGrowthMetric] = useState('height');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentPortalService.getOverviewViewModel();
      setOverviewData(response.data);
    } catch (apiError) {
      setError(apiError?.message || 'Không thể tải thông tin tổng quan lúc này.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const hero = overviewData?.hero || null;

  const activeGrowthMetric = growthMetricOptions[growthMetric] || growthMetricOptions.height;

  const growthPoints = overviewData?.growthChart?.points;

  const growthChartModel = useMemo(() => {
    return buildGrowthChartModel(Array.isArray(growthPoints) ? growthPoints : [], activeGrowthMetric.key);
  }, [growthPoints, activeGrowthMetric.key]);

  if (loading && !overviewData) {
    return <StudentLoadingState label="Đang tải thông tin tổng quan..." />;
  }

  if (error && !overviewData) {
    return <StudentErrorState message={error} onRetry={loadOverview} />;
  }

  if (!overviewData) {
    return null;
  }

  const displayName = normalizeMetaText(hero?.fullName || 'Học sinh');
  const displayRoleLabel = normalizeMetaText(hero?.roleLabel || 'Học sinh');
  const displayStatusLabel = normalizeMetaText(hero?.statusLabel || 'Đang hoạt động');
  const displayClassName = normalizeMetaText(hero?.className);
  const displayStudentCode = normalizeMetaText(hero?.studentCode);
  const normalizedEmail = normalizeMetaText(hero?.email);
  const displayEmail = normalizedEmail !== 'Chưa cập nhật' ? normalizedEmail : '';

  return (
    <div className="space-y-4.5 text-on-surface lg:space-y-5">
      <section className="student-overview-hero student-hero-gradient relative overflow-hidden rounded-3xl px-4 py-3 sm:px-5 sm:py-4">
        <span aria-hidden="true" className="pointer-events-none absolute -top-14 right-8 h-36 w-36 rounded-full bg-white/36 blur-2xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/18 blur-2xl" />

        <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/75 text-2xl font-bold text-primary shadow-[0_10px_20px_rgba(22,50,58,0.16)] sm:h-24 sm:w-24">
              {hero?.avatar ? (
                <img src={hero.avatar} alt={`Avatar của ${hero.fullName}`} className="h-full w-full object-cover" />
              ) : (
                hero?.fullName?.charAt(0)?.toUpperCase() || 'S'
              )}
            </div>

            <div className="min-w-0">
              <p className="app-overline tracking-[0.1em]">Hồ sơ tổng quan</p>
              <h2 className="mt-1 text-[1.34rem] font-bold leading-tight text-on-surface sm:text-[1.46rem]">{displayName}</h2>
              <p className="mt-1 max-w-xl text-sm text-on-surface-muted">
                Theo dõi nhanh tình trạng sức khỏe, tiến độ tiêm chủng và các mốc cần chú ý trong tuần.
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/32 bg-white/84 px-2.5 py-1 text-xs font-semibold text-primary">
                  {displayRoleLabel}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  hero?.isActive
                    ? 'border-success/42 bg-success-soft text-success'
                    : 'border-danger/42 bg-danger-soft text-danger'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${hero?.isActive ? 'bg-success' : 'bg-danger'}`} />
                  <span>{displayStatusLabel}</span>
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="student-overview-meta-chip">
                  <span className="material-symbols-outlined text-[14px]">school</span>
                  <span>Lớp: <strong>{displayClassName}</strong></span>
                </span>

                <span className="student-overview-meta-chip">
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                  <span>Mã HS: <strong>{displayStudentCode}</strong></span>
                </span>

                {displayEmail ? (
                  <span className="student-overview-meta-chip">
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    <span>{displayEmail}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/72 bg-white/72 p-2.5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => navigate('/student/account')}
                className="app-btn-primary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
              >
                Xem tài khoản
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/vaccinations')}
                className="app-btn-secondary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
              >
                Xem lịch tiêm
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
        {overviewData.summaryCards.map((item, index) => {
          const visual = summaryVisuals[index % summaryVisuals.length];

          return (
            <article key={item.id} className={`student-summary-card student-card-hover ${visual.cardClassName}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="student-summary-label">{item.label}</p>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${visual.iconClassName}`}>
                  <span className="material-symbols-outlined text-[16px]">{visual.icon}</span>
                </span>
              </div>
              <p className="mt-3 student-summary-value">{item.value}</p>
              {item.hint ? <p className="mt-1 student-summary-note">{item.hint}</p> : null}
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-3.5">
        <article className="app-panel-shell student-growth-card rounded-3xl p-4 md:p-5">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="app-section-title">Biểu đồ tăng trưởng</h2>
              <p className="app-body-text mt-1">
                {overviewData.growthChart?.subtitle || 'Theo dõi chiều cao và cân nặng theo từng tháng.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface/85 p-1">
              {growthMetricToggleOrder.map((metric) => (
                <button
                  key={metric}
                  type="button"
                  onClick={() => setGrowthMetric(metric)}
                  className={`student-growth-toggle app-focus-ring app-interactive ${growthMetric === metric ? 'student-growth-toggle-active' : ''}`}
                >
                  {growthMetricOptions[metric].label}
                </button>
              ))}
            </div>
          </header>

          <div className="student-chart-shell mt-3 p-3 sm:p-4">
            {growthChartModel ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="student-growth-meta-pill">6 tháng gần nhất</span>
                  <span className="student-growth-meta-pill">
                    Mốc gần nhất: {formatMetricValue(growthChartModel.latestValue, activeGrowthMetric.unit, activeGrowthMetric.fractionDigits)}
                  </span>
                  <span className="student-growth-meta-pill">
                    Thay đổi: {formatMetricDelta(growthChartModel.delta, activeGrowthMetric.unit, activeGrowthMetric.fractionDigits)}
                  </span>
                </div>

                <svg viewBox={`0 0 ${CHART_FRAME.width} ${CHART_FRAME.height}`} className="h-[242px] w-full" role="img" aria-label={`Biểu đồ ${activeGrowthMetric.label.toLowerCase()} 6 tháng gần nhất`}>
                  {growthChartModel.yTicks.map((tick) => (
                    <g key={tick.id}>
                      <line
                        x1={CHART_FRAME.padding.left}
                        y1={tick.y}
                        x2={CHART_FRAME.width - CHART_FRAME.padding.right}
                        y2={tick.y}
                        className="student-chart-gridline"
                      />
                      <text x={CHART_FRAME.padding.left - 8} y={tick.y + 4} textAnchor="end" className="student-chart-axis-label">
                        {formatMetricNumber(tick.value, activeGrowthMetric.fractionDigits)}
                      </text>
                    </g>
                  ))}

                  <line
                    x1={CHART_FRAME.padding.left}
                    y1={growthChartModel.baselineY}
                    x2={CHART_FRAME.width - CHART_FRAME.padding.right}
                    y2={growthChartModel.baselineY}
                    className="student-chart-axis-line"
                  />

                  <path d={growthChartModel.areaPath} className={activeGrowthMetric.areaClass} />
                  <path d={growthChartModel.linePath} className={activeGrowthMetric.lineClass} />

                  {growthChartModel.points.map((point) => (
                    <g key={point.id || point.label}>
                      <circle cx={point.x} cy={point.y} r="4" className={activeGrowthMetric.dotClass} />
                      <text x={point.x} y={CHART_FRAME.height - 8} textAnchor="middle" className="student-chart-axis-label">
                        {point.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </>
            ) : (
              <div className="flex h-[242px] items-center justify-center text-sm font-medium text-on-surface-variant">
                Chưa có dữ liệu tăng trưởng.
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {overviewData.healthHighlights.slice(0, 3).map((item) => (
              <div key={item.id} className="student-health-pill">
                <p className="student-health-pill-label">{item.label}</p>
                <p className="mt-1 student-health-pill-value">{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="app-panel-shell rounded-3xl p-4 md:p-5">
          <header className="mb-3.5 flex items-start justify-between gap-3">
            <div>
              <h2 className="app-section-title">Nhắc nhở và lưu ý</h2>
              <p className="app-body-text mt-1">Những việc cần ưu tiên để theo dõi chăm sóc liên tục.</p>
            </div>

            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            </span>
          </header>

          <div className="space-y-3">
            {overviewData.reminders.slice(0, 3).map((item, index) => {
              const reminderClassName = `${reminderToneClassMap[item.tone] || reminderToneClassMap.mint} ${
                index === 0 ? 'student-reminder-card-main' : ''
              }`.trim();

              return (
                <article key={item.id} className={reminderClassName}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[14px] font-semibold text-on-surface">{item.title}</p>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-primary">
                    <span className="material-symbols-outlined text-[15px]">{item.icon || 'event_upcoming'}</span>
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{item.dateLabel}</p>
                <p className="mt-1.5 text-sm text-on-surface-variant">{item.note}</p>
                </article>
              );
            })}
          </div>
        </article>
      </section>

      <section className="app-panel-shell overflow-hidden rounded-3xl">
        <header className="flex items-center justify-between border-b border-outline-variant bg-surface/75 px-4 py-3.5">
          <h2 className="app-section-title">Hoạt động gần đây</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-info/25 bg-info-soft/72 px-2.5 py-1 text-[11px] font-semibold text-info">
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span>Cập nhật mới</span>
          </span>
        </header>

        <div className="divide-y divide-outline-variant">
          {overviewData.recentActivities.map((item) => (
            <article key={item.id} className="student-activity-item app-interactive flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${resolveActivityIconClass(item.tone)}`}>
                    <span className="material-symbols-outlined text-[15px]">{item.icon || 'task_alt'}</span>
                  </span>
                  <p className="text-[14px] font-semibold text-on-surface">{item.title}</p>
                </div>

                <p className="mt-1.5 text-sm text-on-surface-variant">{item.description}</p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-on-surface-variant">{item.timeLabel}</p>
                <span className={`mt-1 inline-flex ${resolveActivityTagClass(item.tone)}`}>
                  {item.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentOverviewPage;