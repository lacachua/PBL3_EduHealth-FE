import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../../shared/components/core/EmptyState';
import ErrorState from '../../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../../shared/components/core/LoadingSpinner';
import PageHeader from '../../../../shared/components/admin/PageHeader';
import SectionCard from '../../../../shared/components/core/SectionCard';
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
    card: 'border-outline-variant bg-surface',
    value: 'text-on-surface',
  },
  success: {
    icon: 'border-success/30 bg-success-soft text-success',
    card: 'border-success/18 bg-success-soft/35',
    value: 'text-on-surface',
  },
  info: {
    icon: 'border-info/30 bg-info-soft text-info',
    card: 'border-info/18 bg-info-soft/32',
    value: 'text-on-surface',
  },
  warning: {
    icon: 'border-warning/30 bg-warning-soft text-warning',
    card: 'border-warning/18 bg-warning-soft/28',
    value: 'text-on-surface',
  },
  critical: {
    icon: 'border-danger/30 bg-danger-soft text-danger',
    card: 'border-danger/18 bg-danger-soft/30',
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
const sectionCardClassName = 'app-card-shell rounded-xl p-4';
const sectionCardTitleClassName = 'app-section-title';
const sectionCardSubtitleClassName = 'app-meta-text mt-0.5';
const sectionActionLinkClassName = 'app-focus-ring app-btn-secondary px-2.5';

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

  const shortcuts = dashboardData.shortcuts.filter((item) => adminRouteSet.has(item.to));
  const visibleActivities = dashboardData.recentActivities.slice(0, 4);

  return (
    <div className="space-y-4.5">
      <PageHeader
        title={dashboardData.title}
        description={dashboardData.description}
        actions={
          <>
            <button
              type="button"
              onClick={fetchDashboard}
              className="app-focus-ring app-btn-secondary px-3"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Làm mới
            </button>
            <Link
              to="/admin/reports"
              className="app-focus-ring app-btn-primary px-3.5"
            >
              Xem báo cáo
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </>
        }
      />

      {error ? <ErrorState message={`Không tải được dữ liệu mới: ${error}`} onRetry={fetchDashboard} /> : null}

      <section className="app-panel-shell rounded-2xl p-3.5 sm:p-4">
        <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2 px-0.5">
          <div>
            <p className="app-overline">Tổng quan điều phối</p>
            <p className="app-meta-text mt-0.5">Theo dõi nhanh khối lượng vận hành và điểm cần xử lý.</p>
          </div>
          {dashboardData.generatedAtLabel ? (
            <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-[11px] font-semibold text-on-surface-muted">
              Cập nhật: {dashboardData.generatedAtLabel}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {overviewCardsConfig.map((card) => {
            const cardTone = cardToneClassMap[card.tone] || cardToneClassMap.neutral;
            const cardValue = dashboardData.overview[card.key];

            return (
              <Link
                key={card.id}
                to={normalizeRoute(card.to)}
                className={`group app-focus-ring app-kpi-card rounded-xl px-3.5 py-3 transition-transform duration-150 hover:-translate-y-[1px] ${cardTone.card}`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="app-kpi-label">{card.label}</p>
                    <p className={`app-kpi-value mt-1 ${cardTone.value}`}>{formatNumber(cardValue)}</p>
                  </div>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${cardTone.icon}`}>
                    <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SectionCard
        className={sectionCardClassName}
        title="Điều hướng nhanh"
        subtitle="Lối tắt tác vụ quản trị thường dùng."
        titleClassName={sectionCardTitleClassName}
        subtitleClassName={sectionCardSubtitleClassName}
      >
        <div className="rounded-xl border border-outline-variant bg-[var(--table-header-bg)] p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {shortcuts.map((action) => (
              <Link
                key={action.id}
                to={normalizeRoute(action.to)}
                className="group app-focus-ring app-interactive rounded-lg border border-outline-variant bg-surface px-3 py-2.5 transition hover:border-primary/25 hover:bg-primary-soft/28"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-surface-container-high text-on-surface-variant transition group-hover:border-primary/30 group-hover:bg-primary-soft/45 group-hover:text-primary">
                    <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-muted transition group-hover:text-primary">arrow_forward</span>
                </div>
                <p className="app-card-title mt-1.5 leading-[1.05rem]">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        className={sectionCardClassName}
        title="Hoạt động gần đây"
        subtitle="4 cập nhật quản trị mới nhất."
        titleClassName={sectionCardTitleClassName}
        subtitleClassName={sectionCardSubtitleClassName}
        actions={
          <Link
            to="/admin/system-logs"
            className={sectionActionLinkClassName}
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
                  className="app-focus-ring flex items-center gap-2 border-b border-outline-variant px-3 py-2.5 last:border-b-0 hover:bg-surface-container-lowest"
                >
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${itemTone}`}>
                    <span className="material-symbols-outlined text-[10px]">{activity.icon}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold leading-4 text-on-surface">{activity.title}</p>
                      <span className="shrink-0 whitespace-nowrap text-right text-[11px] font-semibold tabular-nums text-on-surface-muted">{activity.timeLabel}</span>
                    </div>
                    <p className="truncate text-[12px] leading-4 text-on-surface-variant">{activity.metadata}</p>
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
