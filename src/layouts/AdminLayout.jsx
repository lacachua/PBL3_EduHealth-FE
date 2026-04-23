import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';
import NotificationsBellController from '../features/notifications/inbox/components/NotificationsBellController';
import BrandLogo from '../shared/components/common/BrandLogo';
import RoleTopHeader from '../shared/components/shell/RoleTopHeader';
import { adminSidebarActions, adminSidebarGroups } from './constants/adminShellConfig';

const AdminLayout = () => {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateAccount = () => {
    navigate('/admin/settings');
  };

  const sidebarWidthClass = isSidebarCollapsed ? 'md:w-[76px]' : 'md:w-[264px]';
  const mainOffsetClass = isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[264px]';

  return (
    <div className="admin-shell min-h-screen bg-background text-on-surface">
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-on-surface/30 transition md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-outline-variant bg-surface shadow-[2px_0_10px_rgba(15,23,42,0.04)] transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-outline-variant/80 px-3.5 py-3.5">
          {isSidebarCollapsed ? (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary-soft text-primary-hover">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                health_and_safety
              </span>
            </div>
          ) : (
            <div className="min-w-0 flex-1 overflow-hidden">
              <BrandLogo asLink={false} textClassName="text-xl" suffix="Admin" className="w-full px-0" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden shrink-0 rounded-xl border border-outline-variant p-1.5 text-on-surface-variant transition hover:bg-surface-container-low md:inline-flex"
            aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <span className="material-symbols-outlined text-lg">
              {isSidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
          </button>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-xl p-1.5 text-on-surface-variant hover:bg-surface-container-low md:hidden"
            aria-label="Đóng thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 pb-3.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adminSidebarGroups.map((group) => (
            <div key={group.id}>
              {!isSidebarCollapsed ? (
                <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant/80">
                  {group.label}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => {
                  return (
                    <NavLink
                      key={item.id}
                      to={item.to}
                      end={item.to === '/admin/dashboard'}
                      onClick={closeSidebar}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) => `group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition ${
                        isActive
                          ? 'bg-primary-soft text-primary-hover ring-1 ring-primary/20'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary-hover" /> : null}
                          <span className={`material-symbols-outlined text-[20px] ${isSidebarCollapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
                          {!isSidebarCollapsed ? <span className="ml-3">{item.label}</span> : null}

                          {isSidebarCollapsed ? (
                            <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs font-semibold text-on-surface-variant opacity-0 shadow-sm transition group-hover:opacity-100">
                              {item.label}
                            </span>
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-outline-variant/80 px-2.5 py-3">
          <button
            type="button"
            onClick={handleLogout}
            title={isSidebarCollapsed ? adminSidebarActions.secondary.label : undefined}
            className={`inline-flex w-full items-center rounded-xl border border-transparent text-sm font-semibold text-on-surface-variant transition hover:border-outline-variant hover:bg-surface-container-low ${
              isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3.5 py-2.5'
            }`}
          >
            <span className="material-symbols-outlined text-base">{adminSidebarActions.secondary.icon}</span>
            {!isSidebarCollapsed ? adminSidebarActions.secondary.label : null}
          </button>
        </div>
      </aside>

      <main className={`min-h-screen bg-background md:border-l md:border-outline-variant/70 ${mainOffsetClass}`}>
        <RoleTopHeader
          role="ADMIN"
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigateAccount={handleNavigateAccount}
          onLogout={handleLogout}
          showNotifications
          hasUnreadNotifications={unreadNotificationsCount > 0}
          onNotificationClick={() => setIsNotificationsOpen((previous) => !previous)}
        />

        <NotificationsBellController
          currentUser={user}
          viewerRole="ADMIN"
          fullPagePath="/admin/notifications"
          open={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onUnreadChange={setUnreadNotificationsCount}
        />

        <div className="px-4 pb-4 pt-3 sm:px-5">
          <Outlet key={locationKey} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
