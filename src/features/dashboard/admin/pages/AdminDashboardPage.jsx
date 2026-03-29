import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../../shared/components/admin/LoadingSpinner';
import PageHeader from '../../../../shared/components/admin/PageHeader';
import SectionCard from '../../../../shared/components/admin/SectionCard';
import StatusBadge from '../../../../shared/components/admin/StatusBadge';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const toneClassMap = {
  neutral: 'text-on-surface',
  info: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
};

const AdminDashboardPage = () => {
  const { dashboardData, status, error, fetchDashboard } = useAdminDashboard();

  return (
    <div className="space-y-4">
      <PageHeader
        title={dashboardData.title}
        description={dashboardData.subtitle}
        actions={
          <>
            <Link to="/admin/students" className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low">
              Quản lý học sinh
            </Link>
            <Link to="/admin/users" className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-white hover:bg-secondary/90">
              Thêm tài khoản
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

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardData.kpis.map((card) => (
          <article key={card.id} className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-on-surface-variant">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${toneClassMap[card.tone] || toneClassMap.neutral}`}>
                  {card.value.toLocaleString('vi-VN')}
                </p>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-surface text-on-surface-variant">
                <span className="material-symbols-outlined text-base">{card.icon}</span>
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionCard title="Danh sách cần rà soát" subtitle="Dữ liệu dẫn xuất từ Students, Guardians, Medicines và StudentVaccinations">
          {status === 'loading' ? <LoadingSpinner label="Đang tổng hợp mục cần rà soát..." /> : null}
          {status === 'error' ? <ErrorState message={error} onRetry={fetchDashboard} /> : null}
          {status === 'success' && !dashboardData.reviewItems.length ? (
            <EmptyState title="Không có mục cần rà soát" description="Mọi tiêu chí giám sát đang ở trạng thái ổn định." />
          ) : null}

          {status === 'success' && dashboardData.reviewItems.length ? (
            <div className="space-y-2.5">
              {dashboardData.reviewItems.map((item) => (
                <div key={item.id} className="rounded-md border border-outline-variant bg-surface px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                    <StatusBadge tone={item.tone}>{item.count}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">{item.description}</p>
                  <Link to={item.to} className="mt-2 inline-block text-xs font-semibold text-secondary hover:opacity-80">
                    Mở trang xử lý
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Hoạt động gần đây" subtitle="Nguồn dữ liệu từ SystemLogs">
          {status === 'loading' ? <LoadingSpinner label="Đang tải hoạt động gần đây..." /> : null}
          {status === 'error' ? <ErrorState message={error} onRetry={fetchDashboard} /> : null}
          {status === 'success' && !dashboardData.activities.length ? (
            <EmptyState title="Chưa có hoạt động" description="Nhật ký sẽ hiển thị khi phát sinh thao tác quản trị." />
          ) : null}

          {status === 'success' && dashboardData.activities.length ? (
            <div className="space-y-2.5">
              {dashboardData.activities.map((activity) => (
                <div key={activity.id} className="rounded-md border border-outline-variant bg-surface px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-on-surface">{activity.description}</p>
                    <span className="text-xs text-on-surface-variant">{activity.occurredAt}</span>
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {activity.actorName} • {activity.module} • {activity.action} • {activity.targetType}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </SectionCard>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
