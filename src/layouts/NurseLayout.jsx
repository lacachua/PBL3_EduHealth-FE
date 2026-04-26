import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NotificationsBellController from '../features/notifications/inbox/components/NotificationsBellController';
import NurseSidebar from '../features/nurse-shell/components/NurseSidebar';
import RoleTopHeader from '../shared/components/shell/RoleTopHeader';
import { useRoleShell } from './hooks/useRoleShell';

const NurseLayout = () => {
  // pathname thay đổi khi navigate sang trang khác → Outlet reset đúng
  // location.key thay đổi cả khi query params thay đổi → reset thừa
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
  } = useRoleShell({ accountPath: '/nurse/profile' });

  return (
    <div className="nurse-shell app-page-bg min-h-screen text-on-surface">
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-on-surface/25 transition-opacity duration-200 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <NurseSidebar
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onCloseSidebar={closeSidebar}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />

      <main className={`min-h-screen transition-[margin] duration-200 ${mainOffsetClass}`}>
        <RoleTopHeader
          role="NURSE"
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
          viewerRole="NURSE"
          fullPagePath="/nurse/notifications"
          open={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onUnreadChange={setUnreadNotificationsCount}
        />

        <div className="px-4 pb-5 pt-4 sm:px-5 sm:pt-5">
          <Outlet key={pathname} />
        </div>
      </main>
    </div>
  );
};

export default NurseLayout;
