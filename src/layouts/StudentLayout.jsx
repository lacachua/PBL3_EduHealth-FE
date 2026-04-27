import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NotificationsBellController from '../features/notifications/inbox/components/NotificationsBellController';
import StudentSidebar from '../features/student-portal/components/layout/StudentSidebar';
import StudentMobileBottomNav from '../features/student-portal/components/layout/StudentMobileBottomNav';
import { useStudentIdentity } from '../features/student-portal/hooks/useStudentIdentity';
import RoleTopHeader from '../shared/components/shell/RoleTopHeader';
import { useRoleShell } from './hooks/useRoleShell';
import './styles/student-shell.css';

const StudentLayout = () => {
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
  } = useRoleShell({ accountPath: '/student/account' });

  // Business logic fetch đã tách ra hook riêng — layout chỉ dùng kết quả
  const identity = useStudentIdentity(user);

  const headerUser = useMemo(() => ({
    ...user,
    fullName: identity?.fullName || user?.fullName || user?.name || '',
    avatar: identity?.avatar || user?.avatar || user?.avatarUrl || '',
    role: 'STUDENT',
    roleLabel: String(identity?.roleLabel || user?.roleLabel || 'Học sinh'),
  }), [identity, user]);

  return (
    <div className="student-shell app-page-bg min-h-screen text-on-surface">
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-on-surface/30 transition-opacity duration-200 md:hidden ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
      />

      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onCloseSidebar={closeSidebar}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />

      <main className={`student-layout-main min-h-screen transition-[margin] duration-200 ${mainOffsetClass}`}>
        <RoleTopHeader
          role="STUDENT"
          user={headerUser}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigateAccount={handleNavigateAccount}
          onLogout={handleLogout}
          showNotifications
          hasUnreadNotifications={unreadNotificationsCount > 0}
          onNotificationClick={() => setIsNotificationsOpen((prev) => !prev)}
          containerClassName="student-layout-content"
        />

        <NotificationsBellController
          currentUser={headerUser}
          viewerRole="STUDENT"
          fullPagePath="/student/notifications"
          open={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onUnreadChange={setUnreadNotificationsCount}
        />

        <div className="student-layout-content px-4 pb-20 pt-3 sm:px-5 sm:pt-4 md:pb-5">
          <Outlet key={pathname} context={{ identity }} />
        </div>
      </main>

      <StudentMobileBottomNav />
    </div>
  );
};

export default StudentLayout;
