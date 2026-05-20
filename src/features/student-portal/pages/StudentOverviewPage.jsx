import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import EmptyState from '../../../shared/components/core/EmptyState';
import { CHART_AXIS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from '../../../shared/components/charts/chartTokens';
import { StudentErrorState, StudentLoadingState } from '../components/common/StudentAsyncState';
import { studentPortalService } from '../services/studentPortalService';
import '../styles/student-portal.css';

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
    key: 'height',
    label: 'Chiều cao',
    unit: 'cm',
    fractionDigits: 0,
    color: 'primary',
  },
  weight: {
    key: 'weight',
    label: 'Cân nặng',
    unit: 'kg',
    fractionDigits: 1,
    color: 'info',
  },
};

const growthMetricToggleOrder = ['height', 'weight'];

const normalizeMetaText = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized === '--') return 'Chưa cập nhật';
  return normalized;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMetricValue = (value, metricOption) => {
  const numericValue = toNumber(value);
  if (numericValue === null) {
    return '--';
  }

  return `${new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: metricOption.fractionDigits,
    maximumFractionDigits: metricOption.fractionDigits,
  }).format(numericValue)} ${metricOption.unit}`;
};

const normalizeClassGrowthComparison = (payload = {}, metricOption = growthMetricOptions.height) => {
  const rawStudents = Array.isArray(payload.students) ? payload.students : [];
  const currentStudent = payload.currentStudent || null;
  const currentStudentId = String(currentStudent?.studentId || '').trim();
  const currentStudentCode = String(currentStudent?.studentCode || '').trim();
  const students = rawStudents.map((item) => {
    const matchesCurrentStudent = currentStudent
      && (
        (currentStudentId && String(item?.studentId || '').trim() === currentStudentId)
        || (currentStudentCode && String(item?.studentCode || '').trim() === currentStudentCode)
      );

    return matchesCurrentStudent ? { ...item, isCurrentStudent: true } : item;
  });
  const hasCurrentStudent = students.some((item) => item?.isCurrentStudent);
  const chartStudents = hasCurrentStudent || !currentStudent
    ? students
    : [...students, { ...currentStudent, isCurrentStudent: true }];

  const points = chartStudents
    .map((item, index) => {
      const value = toNumber(item?.value);
      if (value === null) {
        return null;
      }

      const rank = toNumber(item?.rank) ?? index + 1;

      return {
        id: String(item?.studentId || item?.studentCode || `student-${index + 1}`),
        studentId: item?.studentId || '',
        studentCode: item?.studentCode || '',
        fullName: item?.fullName || 'Học sinh',
        rank,
        xValue: rank,
        value,
        isCurrentStudent: Boolean(item?.isCurrentStudent),
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank);

  return {
    ...payload,
    unit: payload.unit || metricOption.unit,
    students: points,
    summary: payload.summary || {},
  };
};

const ClassGrowthTooltip = ({ active, payload, metricOption }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload || {};

  return (
    <div style={CHART_TOOLTIP.contentStyle}>
      <p style={CHART_TOOLTIP.labelStyle}>{point.fullName || 'Học sinh'}</p>
      <div className="space-y-1" style={CHART_TOOLTIP.itemStyle}>
        <p>Mã học sinh: {point.studentCode || '--'}</p>
        <p>{metricOption.label}: {formatMetricValue(point.value, metricOption)}</p>
        <p>Thứ hạng trong lớp: {point.rank || '--'}</p>
      </div>
    </div>
  );
};

const ClassGrowthDot = ({ cx, cy, payload }) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null;
  }

  const isCurrentStudent = Boolean(payload?.isCurrentStudent);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isCurrentStudent ? 6 : 3.5}
      fill={isCurrentStudent ? 'var(--app-danger)' : 'var(--app-primary)'}
      stroke={isCurrentStudent ? 'var(--app-surface)' : 'transparent'}
      strokeWidth={isCurrentStudent ? 3 : 0}
      opacity={isCurrentStudent ? 1 : 0.68}
    />
  );
};

const ClassGrowthComparisonChart = ({ data, metricOption, loading, error }) => {
  const points = Array.isArray(data?.students) ? data.students : [];
  const lineColor = CHART_COLORS[metricOption.color] || CHART_COLORS.primary;

  if (loading) {
    return (
      <div className="student-chart-loading" aria-label="Đang tải dữ liệu so sánh trong lớp">
        <div className="student-chart-loading-line student-chart-loading-line-wide" />
        <div className="student-chart-loading-line" />
        <div className="student-chart-loading-line student-chart-loading-line-short" />
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Không thể tải dữ liệu lớp" description={error} />;
  }

  if (!points.length) {
    return <EmptyState title="Chưa có dữ liệu lớp." description="Biểu đồ sẽ hiển thị khi lớp có dữ liệu chiều cao/cân nặng." />;
  }

  return (
    <ResponsiveContainer width="100%" height={242}>
      <LineChart data={points} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray={CHART_GRID.strokeDasharray} stroke={CHART_GRID.stroke} vertical={false} />
        <XAxis
          dataKey="xValue"
          tick={{ fill: CHART_AXIS.tick, fontSize: CHART_AXIS.fontSize, fontWeight: 600 }}
          axisLine={{ stroke: CHART_AXIS.stroke }}
          tickLine={false}
          tickFormatter={(value) => `#${value}`}
        />
        <YAxis
          tick={{ fill: CHART_AXIS.tick, fontSize: CHART_AXIS.fontSize, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatMetricValue(value, metricOption).replace(` ${metricOption.unit}`, '')}
          width={34}
        />
        <Tooltip
          content={<ClassGrowthTooltip metricOption={metricOption} />}
          cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={<ClassGrowthDot />}
          activeDot={<ClassGrowthDot />}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const resolveActivityTagClass = (tone) =>
  activityTagToneClassMap[tone] || activityTagToneClassMap.mint;

const resolveActivityIconClass = (tone) =>
  activityIconToneClassMap[tone] || activityIconToneClassMap.mint;

const StudentOverviewPage = () => {
  const navigate = useNavigate();
  const [overviewData, setOverviewData] = useState(null);
  const [growthMetric, setGrowthMetric] = useState('height');
  const [classGrowthComparison, setClassGrowthComparison] = useState(null);
  const [classGrowthLoading, setClassGrowthLoading] = useState(false);
  const [classGrowthError, setClassGrowthError] = useState('');
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

  useEffect(() => {
    let isActive = true;

    const loadClassGrowthComparison = async () => {
      const metricOption = growthMetricOptions[growthMetric] || growthMetricOptions.height;
      setClassGrowthLoading(true);
      setClassGrowthError('');

      try {
        const response = await studentPortalService.getClassGrowthComparison(growthMetric);
        if (isActive) {
          setClassGrowthComparison(normalizeClassGrowthComparison(response?.data, metricOption));
        }
      } catch (apiError) {
        if (isActive) {
          setClassGrowthComparison(null);
          setClassGrowthError(apiError?.message || 'Không thể tải dữ liệu so sánh trong lớp lúc này.');
        }
      } finally {
        if (isActive) {
          setClassGrowthLoading(false);
        }
      }
    };

    loadClassGrowthComparison();

    return () => {
      isActive = false;
    };
  }, [growthMetric]);

  const hero = overviewData?.hero || null;
  const activeGrowthMetric = growthMetricOptions[growthMetric] || growthMetricOptions.height;
  const classGrowthSummary = classGrowthComparison?.summary || {};

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
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${hero?.isActive
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

      <section className="grid grid-cols-1 gap-3 lg:gap-3.5">
        <article className="app-panel-shell student-growth-card rounded-3xl p-4 md:p-5">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="app-section-title">So sánh trong lớp</h2>
              <p className="app-body-text mt-1">
                Dữ liệu thể hiện vị trí của học sinh hiện tại so với các bạn cùng lớp.
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
            <ClassGrowthComparisonChart
              data={classGrowthComparison}
              metricOption={activeGrowthMetric}
              loading={classGrowthLoading}
              error={classGrowthError}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <div className="student-health-pill">
              <p className="student-health-pill-label">Trung bình lớp</p>
              <p className="mt-1 student-health-pill-value">{formatMetricValue(classGrowthSummary.average, activeGrowthMetric)}</p>
            </div>
            <div className="student-health-pill">
              <p className="student-health-pill-label">Thấp nhất</p>
              <p className="mt-1 student-health-pill-value">{formatMetricValue(classGrowthSummary.min, activeGrowthMetric)}</p>
            </div>
            <div className="student-health-pill">
              <p className="student-health-pill-label">Cao nhất</p>
              <p className="mt-1 student-health-pill-value">{formatMetricValue(classGrowthSummary.max, activeGrowthMetric)}</p>
            </div>
            <div className="student-health-pill">
              <p className="student-health-pill-label">Tổng học sinh</p>
              <p className="mt-1 student-health-pill-value">{classGrowthSummary.totalStudents ?? classGrowthComparison?.students?.length ?? '--'}</p>
            </div>
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
