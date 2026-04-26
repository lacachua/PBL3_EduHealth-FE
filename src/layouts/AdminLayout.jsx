import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NotificationsBellController from '../features/notifications/inbox/components/NotificationsBellController';
import RoleTopHeader from '../shared/components/shell/RoleTopHeader';
import AdminSidebar from './components/AdminSidebar';
import { useRoleShell } from './hooks/useRoleShell';

const AdminLayout = () => {
  const { pathname } = useLocation();

  const {
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    closeSidebar,
    isNotificationsOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
    handleLogout,
    handleNavigateAccount,
    mainOffsetClass,
  } = useRoleShell({ accountPath: '/admin/settings' });

  return (
    <div className="admin-shell min-h-screen bg-background text-on-surface">
      {/* Overlay mobile — nhất quán với NurseLayout / StudentLayout */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-on-surface/30 transition-opacity duration-200 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onClose={closeSidebar}
        onLogout={handleLogout}
      />

      <main className={`min-h-screen bg-background transition-[margin,padding-left] duration-200 md:border-l md:border-outline-variant/70 ${mainOffsetClass}`}>
        <RoleTopHeader
          role="ADMIN"
          user={user}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigateAccount={handleNavigateAccount}
          onLogout={handleLogout}
          showNotifications
          hasUnreadNotifications={unreadNotificationsCount > 0}
          onNotificationClick={() => setIsNotificationsOpen((prev) => !prev)}
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
          <Outlet key={pathname} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
