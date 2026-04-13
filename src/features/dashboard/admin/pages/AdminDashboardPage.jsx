import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../../shared/components/admin/PageHeader';
import SectionCard from '../../../../shared/components/admin/SectionCard';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const adminRouteSet = new Set([
  '/admin/dashboard',
  '/admin/students',
  '/admin/users',
  '/admin/catalogs',
  '/admin/medicines',
  '/admin/reports',
  '/admin/system-logs',
  '/admin/settings',
]);

const overviewCardsConfig = [
  {
    id: 'total-students',
    label: 'Tổng học sinh',
    key: 'totalStudents',
    icon: 'groups',
    to: '/admin/students',
    tone: 'success',
  },
  {
    id: 'total-classes',
    label: 'Tổng lớp',
    key: 'totalClasses',
    icon: 'meeting_room',
    to: '/admin/students',
    tone: 'info',
  },
  {
    id: 'total-users',
    label: 'Tổng tài khoản',
    key: 'totalUsers',
    icon: 'manage_accounts',
    to: '/admin/users',
    tone: 'neutral',
  },
  {
    id: 'low-stock-medicines',
    label: 'Thuốc dưới ngưỡng',
    key: 'lowStockMedicines',
    icon: 'inventory_2',
    to: '/admin/medicines',
    tone: 'critical',
  },
  {
    id: 'visits-today',
    label: 'Lượt khám hôm nay',
    key: 'totalVisitsToday',
    icon: 'medical_services',
    to: '/admin/reports',
    tone: 'warning',
  },
  {
    id: 'visits-month',
    label: 'Lượt khám trong tháng',
    key: 'totalVisitsThisMonth',
    icon: 'calendar_month',
    to: '/admin/reports',
    tone: 'success',
  },
];

const cardToneClassMap = {
  neutral: {
    icon: 'border-outline-variant bg-surface-container-high text-on-surface-variant',
    card: 'border-outline-variant',
    value: 'text-on-surface',
  },
  success: {
    icon: 'border-success/25 bg-success-soft text-success',
    card: 'border-outline-variant',
    value: 'text-on-surface',
  },
  info: {
    icon: 'border-info/25 bg-info-soft text-info',
    card: 'border-outline-variant',
    value: 'text-on-surface',
  },
  warning: {
    icon: 'border-warning/25 bg-warning-soft text-warning',
    card: 'border-outline-variant',
    value: 'text-on-surface',
  },
  critical: {
    icon: 'border-danger/25 bg-danger-soft text-danger',
    card: 'border-outline-variant',
    value: 'text-danger',
  },
};

const activityToneClassMap = {
  neutral: 'border-outline-variant bg-surface-container-high text-on-surface-variant',
  info: 'border-secondary/25 bg-secondary-container text-secondary',
  success: 'border-success/25 bg-success-soft text-success',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  critical: 'border-danger/25 bg-danger-soft text-danger',
};

const alertSeverityMarkerClassMap = {
  info: 'bg-secondary',
  warning: 'bg-warning',
  critical: 'bg-danger',
};

const numberFormatter = new Intl.NumberFormat('vi-VN');
const chartGridGuideLines = [0, 1];
const sectionCardClassName = 'rounded-xl border border-outline-variant bg-surface p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)]';

const formatNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return '0';
  }

  return numberFormatter.format(parsed);
};

const normalizeRoute = (to, fallback = '/admin/dashboard') => {
  if (typeof to !== 'string') {
    return fallback;
  }

  return adminRouteSet.has(to) ? to : fallback;
};

const AdminDashboardPage = () => {
  const { dashboardData, status, error, fetchDashboard } = useAdminDashboard();

  const maxTrendValue = useMemo(() => Math.max(1, ...dashboardData.trends.map((item) => item.value || 0)), [dashboardData.trends]);
  const trendTotal = useMemo(
    () => dashboardData.trends.reduce((sum, item) => sum + (item.value || 0), 0),
    [dashboardData.trends]
  );
  const trendLabelIndexes = useMemo(() => {
    const total = dashboardData.trends.length;
    if (total <= 5) {
      return new Set(Array.from({ length: total }, (_, index) => index));
    }

    return new Set([
      0,
      Math.floor((total - 1) * 0.25),
      Math.floor((total - 1) * 0.5),
      Math.floor((total - 1) * 0.75),
      total - 1,
    ]);
  }, [dashboardData.trends]);
  const trendStats = useMemo(() => {
    if (!dashboardData.trends.length) {
      return { latest: 0, peak: 0, average: 0 };
    }

    const values = dashboardData.trends.map((item) => item.value || 0);
    const total = values.reduce((sum, item) => sum + item, 0);

    return {
      latest: values[values.length - 1] || 0,
      peak: Math.max(...values),
      average: Math.round(total / values.length),
    };
  }, [dashboardData.trends]);
  const trendBars = useMemo(() => {
    if (!dashboardData.trends.length) {
      return [];
    }

    const values = dashboardData.trends.map((item) => Number(item.value) || 0);
    const minTrendValue = Math.min(...values);
    const valueRange = Math.max(1, maxTrendValue - minTrendValue);

    return dashboardData.trends.map((point, index) => {
      const value = Number(point.value) || 0;
      const normalized = (value - minTrendValue) / valueRange;

      return {
        ...point,
        index,
        heightPercent: Math.round(42 + normalized * 58),
      };
    });
  }, [dashboardData.trends, maxTrendValue]);

  const shortcuts = dashboardData.shortcuts.filter((item) => adminRouteSet.has(item.to));
  const hasTrendData = dashboardData.trends.length > 0;
  const hasAlerts = dashboardData.managementAlerts.length > 0;
  const visibleActivities = dashboardData.recentActivities.slice(0, 4);
  const latestTrendId = dashboardData.trends[dashboardData.trends.length - 1]?.id;
  const peakTrendId = dashboardData.trends.find((item) => item.value === trendStats.peak)?.id;

  return (
    <div className="space-y-4">
      <PageHeader
        title={dashboardData.title}
        description={dashboardData.description}
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                fetchDashboard();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Làm mới
            </button>
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-on-primary transition hover:bg-[var(--color-primary-hover)]"
            >
              Xem báo cáo
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </>
        }
      />

      {dashboardData.generatedAtLabel ? (
        <p className="px-1 text-xs font-medium text-on-surface-muted">Dữ liệu cập nhật lúc: {dashboardData.generatedAtLabel}</p>
      ) : null}

      {error ? <ErrorState message={`Không tải được dữ liệu mới: ${error}`} onRetry={fetchDashboard} /> : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {overviewCardsConfig.map((card) => {
          const cardTone = cardToneClassMap[card.tone] || cardToneClassMap.neutral;
          const cardValue = dashboardData.overview[card.key];

          return (
            <Link
              key={card.id}
              to={normalizeRoute(card.to)}
              className={`group rounded-xl border bg-surface px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition hover:border-outline hover:shadow-[0_6px_14px_rgba(15,23,42,0.06)] ${cardTone.card}`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-muted">{card.label}</p>
                  <p className={`mt-1 text-[1.6rem] font-extrabold leading-tight ${cardTone.value}`}>{formatNumber(cardValue)}</p>
                </div>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${cardTone.icon}`}>
                  <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <SectionCard
        className={sectionCardClassName}
        title="Điều hướng nhanh"
        subtitle="Lối tắt tác vụ quản trị thường dùng."
        titleClassName="font-headline text-[1.05rem] font-bold text-on-surface"
        subtitleClassName="mt-0.5 text-xs font-medium text-on-surface-muted"
      >
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {shortcuts.map((action) => (
              <Link
                key={action.id}
                to={normalizeRoute(action.to)}
                className="group rounded-lg border border-outline-variant bg-surface px-3 py-2.5 transition hover:border-primary/25 hover:bg-primary-soft/25"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-surface-container-high text-on-surface-variant transition group-hover:border-primary/25 group-hover:text-primary">
                    <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-muted transition group-hover:text-primary">arrow_forward</span>
                </div>
                <p className="mt-1.5 text-[13px] font-semibold leading-[1.05rem] text-on-surface">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </SectionCard>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SectionCard
          className={`${sectionCardClassName} lg:col-span-8`}
          title="Xu hướng khám trong tháng"
          subtitle="Theo dõi lượt khám theo các mốc gần nhất."
            titleClassName="font-headline text-[1.05rem] font-bold text-on-surface"
            subtitleClassName="mt-0.5 text-xs font-medium text-on-surface-muted"
        >
          {status === 'loading' && !hasTrendData ? <LoadingSpinner label="Đang tải dữ liệu xu hướng..." /> : null}

          {!hasTrendData && status !== 'loading' ? (
            <div className="rounded-md border border-outline-variant bg-surface px-4 py-8 text-center">
              <span className="material-symbols-outlined text-2xl text-on-surface-muted">monitoring</span>
              <p className="mt-2 text-sm font-semibold text-on-surface">Chưa có dữ liệu xu hướng</p>
              <p className="mt-1 text-xs text-on-surface-variant">Hệ thống sẽ hiển thị biểu đồ ngay khi có chuỗi thống kê lượt khám.</p>
            </div>
          ) : null}

          {hasTrendData ? (
            <div className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-low p-3">
              <div className="flex items-center justify-between gap-2 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">30 ngày gần nhất</p>
                <p className="text-[11px] font-semibold text-on-surface-variant">
                  Đỉnh {formatNumber(trendStats.peak)} • TB {formatNumber(trendStats.average)} • Tổng {formatNumber(trendTotal)}
                </p>
              </div>

              <div className="rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 pb-2 pt-2">
                <div className="relative h-36" data-dashboard-trend-chart="true">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {chartGridGuideLines.map((line) => (
                      <span key={`line-${line}`} className="block border-t border-outline-variant/60" />
                    ))}
                    <span className="block border-t border-outline" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex h-36 items-end gap-1 md:gap-1.5">
                    {trendBars.map((point) => {
                      const isPeak = point.id === peakTrendId;
                      const isLatest = point.id === latestTrendId;

                      return (
                        <div key={point.id} className="flex h-full min-w-0 flex-1 items-end justify-center">
                          <div
                            data-chart-bar="true"
                            data-point={point.id}
                            className={`w-full max-w-[30px] min-h-[12px] rounded-t-[6px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)] ${isPeak ? 'bg-primary' : isLatest ? 'bg-primary/90' : 'bg-primary/65'}`}
                            style={{ height: `${point.heightPercent}%` }}
                            aria-label={`${point.label}: ${point.value}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-1.5 grid grid-cols-5 gap-1 text-[10px] font-semibold uppercase tracking-wide text-on-surface-muted md:grid-cols-10">
                  {trendBars.map((point, index) => (
                    <span
                      key={`${point.id}-label`}
                      className={`text-center ${trendLabelIndexes.has(index) ? 'block' : 'hidden md:block'} ${point.id === latestTrendId ? 'text-on-surface' : ''}`}
                    >
                      {point.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          className={`${sectionCardClassName} lg:col-span-4`}
          title="Cảnh báo quản trị"
          subtitle="Các điểm cần ưu tiên xử lý."
          titleClassName="font-headline text-[1.05rem] font-bold text-on-surface"
          subtitleClassName="mt-0.5 text-xs font-medium text-on-surface-muted"
          actions={
            <Link
              to="/admin/medicines"
              className="rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            >
              Xem cảnh báo
            </Link>
          }
        >
          {status === 'loading' && !hasAlerts ? <LoadingSpinner label="Đang tải cảnh báo..." /> : null}

          {!hasAlerts && status !== 'loading' ? (
            <EmptyState title="Chưa có cảnh báo" description="Cảnh báo quản trị sẽ hiển thị khi phát sinh điều kiện bất thường." />
          ) : null}

          {hasAlerts ? (
            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
              {dashboardData.managementAlerts.map((alert) => {
                const targetRoute = normalizeRoute(alert.to, '/admin/reports');
                const markerClassName = alertSeverityMarkerClassMap[alert.severity] || alertSeverityMarkerClassMap.warning;

                return (
                  <Link
                    key={alert.id}
                    to={targetRoute}
                    className="flex items-start gap-2.5 border-b border-outline-variant px-3 py-2.5 last:border-b-0 hover:bg-surface-container-lowest"
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${markerClassName}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold leading-4.5 text-on-surface">{alert.title}</p>
                        {alert.metric ? (
                          <span className="shrink-0 rounded-full border border-outline-variant bg-surface-container-lowest px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                            {alert.metric}
                          </span>
                        ) : null}
                      </div>
                      {alert.description ? <p className="mt-0.5 text-[10px] leading-[0.9rem] text-on-surface-muted">{alert.description}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </SectionCard>
      </section>

      <SectionCard
        className={sectionCardClassName}
        title="Hoạt động gần đây"
        subtitle="4 cập nhật quản trị mới nhất."
        titleClassName="font-headline text-[1.05rem] font-bold text-on-surface"
        subtitleClassName="mt-0.5 text-xs font-medium text-on-surface-muted"
        actions={
          <Link
            to="/admin/system-logs"
            className="rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
          >
            Xem tất cả
          </Link>
        }
      >
        {status === 'loading' ? <LoadingSpinner label="Đang tải hoạt động gần đây..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={fetchDashboard} /> : null}
        {status === 'success' && !visibleActivities.length ? (
          <EmptyState title="Chưa có hoạt động" description="Nhật ký sẽ hiển thị khi phát sinh thao tác quản trị." />
        ) : null}

        {status === 'success' && visibleActivities.length ? (
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
            {visibleActivities.map((activity) => {
              const itemTone = activityToneClassMap[activity.tone] || activityToneClassMap.neutral;
              const targetRoute = normalizeRoute(activity.to, '/admin/system-logs');

              return (
                <Link
                  key={activity.id}
                  to={targetRoute}
                  className="flex items-center gap-2 border-b border-outline-variant px-3 py-2.5 last:border-b-0 hover:bg-surface-container-lowest"
                >
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${itemTone}`}>
                    <span className="material-symbols-outlined text-[9px]">{activity.icon}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] font-semibold leading-4 text-on-surface">{activity.title}</p>
                      <span className="shrink-0 whitespace-nowrap text-right text-[10px] font-semibold tabular-nums text-on-surface-muted">{activity.timeLabel}</span>
                    </div>
                    <p className="truncate text-[11px] leading-4 text-on-surface-variant">{activity.metadata}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
