import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../../shared/components/admin/PageHeader';
import SectionCard from '../../../../shared/components/admin/SectionCard';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const toneClassMap = {
  neutral: 'text-on-surface',
  info: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
};

const statCardLinkMap = {
  'total-students': '/admin/students',
  'active-users': '/admin/users',
  'active-catalogs': '/admin/catalogs',
};

const quickActions = [
  { id: 'create-user', label: 'Thêm tài khoản', to: '/admin/users', icon: 'person_add' },
  { id: 'manage-students', label: 'Quản lý học sinh', to: '/admin/students', icon: 'school' },
  { id: 'reports', label: 'Báo cáo', to: '/admin/reports', icon: 'assessment' },
  { id: 'catalogs', label: 'Danh mục', to: '/admin/catalogs', icon: 'inventory_2' },
];

const AdminDashboardPage = () => {
  const { dashboardData, status, error, fetchDashboard } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title={dashboardData.title}
        description={dashboardData.subtitle}
        actions={
          <>
            <Link to="/admin/system-logs" className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low">
              Nhật ký hệ thống
            </Link>
          </>
        }
      />

      {dashboardData.generatedAt ? (
        <p className="-mt-2 px-1 text-xs text-on-surface-variant">Cập nhật lúc: {new Date(dashboardData.generatedAt).toLocaleString('vi-VN')}</p>
      ) : null}

      {error ? (
        <ErrorState message={`Không tải được dữ liệu mới: ${error}`} onRetry={fetchDashboard} />
      ) : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardData.kpis.map((card) => (
          <Link
            key={card.id}
            to={statCardLinkMap[card.id] || '/admin/dashboard'}
            className="group rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{card.label}</p>
                <p className={`mt-1 text-xl font-bold ${toneClassMap[card.tone] || toneClassMap.neutral}`}>
                  {card.value.toLocaleString('vi-VN')}
                </p>
              </div>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-outline-variant bg-surface text-on-surface-variant transition group-hover:border-secondary/40 group-hover:text-secondary">
                <span className="material-symbols-outlined text-base">{card.icon}</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <SectionCard title="Tác vụ nhanh" subtitle="Đi đến các khu vực quản trị chính chỉ với một lần nhấp">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              to={action.to}
              className="group flex items-center justify-between rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm font-semibold text-on-surface transition hover:border-secondary/40 hover:bg-surface-container-low"
            >
              <span>{action.label}</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant transition group-hover:text-secondary">{action.icon}</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Hoạt động gần đây"
        subtitle="3 thao tác hệ thống mới nhất"
        actions={
          <Link to="/admin/system-logs" className="rounded-md border border-outline-variant px-2.5 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low">
            Xem tất cả
          </Link>
        }
      >
        {status === 'loading' ? <LoadingSpinner label="Đang tải hoạt động gần đây..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={fetchDashboard} /> : null}
        {status === 'success' && !dashboardData.activities.length ? (
          <EmptyState title="Chưa có hoạt động" description="Nhật ký sẽ hiển thị khi phát sinh thao tác quản trị." />
        ) : null}

        {status === 'success' && dashboardData.activities.length ? (
          <div className="space-y-2">
            {dashboardData.activities.map((activity) => (
              <div key={activity.id} className="rounded-md border border-outline-variant bg-surface px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-on-surface">{activity.description}</p>
                  <span className="text-xs text-on-surface-variant">{activity.occurredAt}</span>
                </div>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {activity.actorName} • {activity.module}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {activity.action} • {activity.targetType}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
