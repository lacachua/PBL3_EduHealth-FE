import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarWidthClasses } from '../../../layouts/constants/shellLayout';
import BrandLogo from '../../../shared/components/common/BrandLogo';
import { nurseSidebarGroups } from '../config/nurseNavigation';

const NurseSidebar = ({ isSidebarOpen, isSidebarCollapsed, onCloseSidebar, onToggleSidebar, onLogout }) => {
  const sidebarWidthClass = isSidebarCollapsed ? sidebarWidthClasses.collapsed : sidebarWidthClasses.expanded;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex ${sidebarWidthClasses.drawer} flex-col overflow-x-hidden border-r border-outline-variant bg-surface shadow-sm transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className={`flex items-center border-b border-outline-variant py-3.5 ${isSidebarCollapsed ? 'justify-center gap-2 px-2' : 'gap-2 px-3.5'
        }`}>
        {isSidebarCollapsed ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft text-primary">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
          </div>
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden">
            <BrandLogo
              asLink={false}
              textClassName="text-xl"
              suffix="Nurse"
              className="w-full px-0"
              colorClassName="text-primary"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="app-focus-ring app-btn-secondary hidden shrink-0 rounded-xl p-1.5 text-primary md:inline-flex"
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
        {nurseSidebarGroups.map((group) => (
          <div key={group.id}>
            <p className={`px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted ${isSidebarCollapsed ? 'hidden' : ''
              }`}>
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                if (item.action === 'logout') {
                  return null;
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    end={!(item.to.startsWith('/nurse/health-profiles') || item.to.startsWith('/nurse/vaccinations'))}
                    onClick={onCloseSidebar}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) => `app-focus-ring app-interactive group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] ${isSidebarCollapsed ? 'justify-center' : ''
                      } ${isActive
                        ? 'bg-primary-soft font-semibold text-primary'
                        : 'font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
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
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-outline-variant px-2.5 py-3">
        <button
          type="button"
          onClick={onLogout}
          title={isSidebarCollapsed ? 'Đăng xuất' : undefined}
          className={`app-focus-ring app-interactive inline-flex w-full items-center rounded-xl border border-transparent text-sm font-semibold text-danger transition hover:border-outline-variant hover:bg-danger-soft ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3.5 py-2.5'
            }`}
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span className={isSidebarCollapsed ? 'hidden' : ''}>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default NurseSidebar;
