import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';
import StudentSidebar from '../features/student-portal/components/layout/StudentSidebar';
import StudentTopbar from '../features/student-portal/components/layout/StudentTopbar';
import StudentMobileBottomNav from '../features/student-portal/components/layout/StudentMobileBottomNav';
import { studentPortalService } from '../features/student-portal/services/studentPortalService';
import './styles/student-shell.css';

const resolveFallbackIdentity = (user) => {
  const rawName = user?.fullName || user?.name || 'Học sinh';

  return {
    fullName: rawName,
    className: 'Chưa cập nhật',
    studentCode: 'Chưa cập nhật',
    avatar: user?.avatar || user?.avatarUrl || '',
  };
};

const StudentLayout = () => {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fallbackIdentity = useMemo(() => resolveFallbackIdentity(user), [user]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [identityOverrides, setIdentityOverrides] = useState(null);

  const identity = useMemo(() => {
    return {
      ...fallbackIdentity,
      ...(identityOverrides || {}),
    };
  }, [fallbackIdentity, identityOverrides]);

  useEffect(() => {
    let isActive = true;

    const loadIdentity = async () => {
      try {
        const response = await studentPortalService.getIdentity();
        if (!isActive || !response?.data) {
          return;
        }

        setIdentityOverrides(response.data);
      } catch {
        // Keep fallback identity when student profile source is unavailable.
      }
    };

    loadIdentity();

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateAccount = () => {
    navigate('/student/account');
  };

  const mainOffsetClass = isSidebarCollapsed ? 'md:ml-[78px]' : 'md:ml-[272px]';

  return (
    <div className="student-shell app-page-bg min-h-screen text-on-surface">
      <div
        aria-hidden="true"
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity duration-200 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />

      <main className={`student-layout-main min-h-screen ${mainOffsetClass}`}>
        <StudentTopbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          identity={identity}
          onNavigateAccount={handleNavigateAccount}
          onLogout={handleLogout}
        />

        <div className="student-layout-content px-4 pb-20 pt-3 sm:px-5 sm:pt-4 md:pb-5">
          <Outlet key={locationKey} context={{ identity }} />
        </div>
      </main>

      <StudentMobileBottomNav />
    </div>
  );
};

export default StudentLayout;
