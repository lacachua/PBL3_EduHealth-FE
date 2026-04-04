import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';
import NurseSidebar from '../features/nurse/components/NurseSidebar';
import NurseTopbar from '../features/nurse/components/NurseTopbar';

const getUserName = (user) => {
  const rawName = user?.fullName || user?.name || 'Nhân viên y tế';
  const trimmedName = rawName.replace(/\s*\([^)]*\)\s*$/, '').trim();

  return trimmedName || rawName;
};

const getUserRoleLabel = (user) => {
  const role = String(user?.role || '').toUpperCase();
  if (role === 'ADMIN') return 'Quản trị viên';
  if (role === 'NURSE') return 'Nhân viên y tế';
  if (role === 'PARENT') return 'Phụ huynh';
  return 'Nhân viên y tế';
};

const NurseLayout = () => {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userName = useMemo(() => getUserName(user), [user]);
  const userRoleLabel = useMemo(() => getUserRoleLabel(user), [user]);

  const mainOffsetClass = isSidebarCollapsed ? 'md:ml-[78px]' : 'md:ml-[272px]';

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5FBF8] text-[#16332B]">
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-slate-900/25 transition md:hidden ${
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
        <NurseTopbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          userName={userName}
          userRoleLabel={userRoleLabel}
        />

        <div className="px-4 pb-5 pt-4 sm:px-5 sm:pt-5">
          <Outlet key={locationKey} />
        </div>
      </main>
    </div>
  );
};

export default NurseLayout;
