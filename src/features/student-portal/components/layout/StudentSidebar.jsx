import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarWidthClasses } from '../../../../layouts/constants/shellLayout';
import BrandLogo from '../../../../shared/components/common/BrandLogo';
import { studentSidebarGroups } from '../../config/studentNavigation';

const StudentSidebar = ({
  isSidebarOpen,
  isSidebarCollapsed,
  onCloseSidebar,
  onToggleSidebar,
  onLogout,
}) => {
  const sidebarWidthClass = isSidebarCollapsed ? sidebarWidthClasses.collapsed : sidebarWidthClasses.expanded;

  const handleLogout = () => {
    onCloseSidebar?.();
    onLogout?.();
  };

  return (
    <aside
      className={`student-sidebar-surface fixed inset-y-0 left-0 z-40 flex ${sidebarWidthClasses.drawer} flex-col overflow-x-hidden transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className={`student-sidebar-header flex items-center py-3.5 ${isSidebarCollapsed ? 'justify-center gap-2 px-2' : 'gap-2 px-3.5'
        }`}>
        {isSidebarCollapsed ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary-soft text-primary">
            <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              health_and_safety
            </span>
          </div>
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden">
            <BrandLogo
              asLink={false}
              textClassName="text-xl"
              suffix="Family"
              className="w-full px-0"
              colorClassName="text-primary"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="app-focus-ring app-interactive hidden shrink-0 rounded-xl border border-outline-variant bg-surface p-1.5 text-primary hover:bg-primary-soft md:inline-flex"
          aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <span className="material-symbols-outlined text-lg">
            {isSidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseSidebar}
          className="app-focus-ring app-interactive rounded-xl p-1.5 text-on-surface-variant hover:bg-surface-container-low md:hidden"
          aria-label="Đóng thanh điều hướng"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 pb-3.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {studentSidebarGroups.map((group) => (
          <div key={group.id}>
            <p className={`student-sidebar-group-title px-3.5 pb-2 ${isSidebarCollapsed ? 'hidden' : ''
              }`}>
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.to === '/student/overview'}
                  onClick={onCloseSidebar}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={({ isActive }) => `app-focus-ring app-interactive student-sidebar-nav-item group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] ${isSidebarCollapsed ? 'justify-center' : ''
                    } ${isActive
                      ? 'student-sidebar-nav-item-active font-semibold'
                      : 'font-medium'
                    }`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary" /> : null}
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className={isSidebarCollapsed ? 'hidden' : 'ml-3'}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="student-sidebar-footer px-2.5 py-3">
        <button
          type="button"
          onClick={handleLogout}
          title={isSidebarCollapsed ? 'Đăng xuất' : undefined}
          className={`student-sidebar-logout-button app-focus-ring app-interactive group relative flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold ${isSidebarCollapsed ? 'justify-center' : 'justify-start'
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className={isSidebarCollapsed ? 'hidden' : 'ml-2'}>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
