import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';
import NurseSidebar from '../features/nurse-shell/components/NurseSidebar';
import RoleTopHeader from '../shared/components/shell/RoleTopHeader';

const NurseLayout = () => {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const mainOffsetClass = isSidebarCollapsed ? 'md:ml-[78px]' : 'md:ml-[272px]';

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateAccount = () => {
    navigate('/nurse/profile');
  };

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
          hasUnreadNotifications
        />

        <div className="px-4 pb-5 pt-4 sm:px-5 sm:pt-5">
          <Outlet key={locationKey} />
        </div>
      </main>
    </div>
  );
};

export default NurseLayout;
