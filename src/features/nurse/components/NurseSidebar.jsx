import React from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';
import { nurseSidebarGroups } from '../config/nurseNavigation';

const NurseSidebar = ({ isSidebarOpen, isSidebarCollapsed, onCloseSidebar, onToggleSidebar, onLogout }) => {
  const sidebarWidthClass = isSidebarCollapsed ? 'md:w-[78px]' : 'md:w-[272px]';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-[#E2E8F0] bg-white shadow-[2px_0_16px_rgba(15,23,42,0.08)] transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-3.5 py-3.5">
        {isSidebarCollapsed ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] text-[#15803D]">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
          </div>
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden">
            <BrandLogo
              asLink={false}
              textClassName="text-xl"
              suffix="Nurse"
              className="w-full px-0"
              colorClassName="text-[#15803D]"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="nurse-focus-ring nurse-interactive hidden shrink-0 rounded-xl border border-[#E2E8F0] p-1.5 text-[#15803D] hover:bg-[#F0FDF4] md:inline-flex"
          aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <span className="material-symbols-outlined text-lg">
            {isSidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseSidebar}
          className="nurse-focus-ring nurse-interactive rounded-xl p-1.5 text-slate-500 hover:bg-[#F0FDF4] md:hidden"
          aria-label="Đóng thanh điều hướng"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 pb-3.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {nurseSidebarGroups.map((group) => (
          <div key={group.id}>
            {!isSidebarCollapsed ? (
              <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                {group.label}
              </p>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => {
                if (item.action === 'logout') {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={onLogout}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`nurse-focus-ring nurse-interactive group relative inline-flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-[15px] font-medium ${
                        isSidebarCollapsed ? 'justify-center' : 'gap-3'
                      } text-red-600 hover:bg-red-50`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      {!isSidebarCollapsed ? <span>{item.label}</span> : null}

                      {isSidebarCollapsed ? (
                        <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#64748B] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                          {item.label}
                        </span>
                      ) : null}
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    end={!item.to.startsWith('/nurse/health-profiles')}
                    onClick={onCloseSidebar}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) => `nurse-focus-ring nurse-interactive group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] ${
                      isActive
                        ? 'bg-[#DCFCE7] font-semibold text-[#166534]'
                        : 'font-medium text-[#64748B] hover:bg-[#F0FDF4] hover:text-[#15803D]'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-[#15803D]" /> : null}
                        <span className={`material-symbols-outlined text-[20px] ${isSidebarCollapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
                        {!isSidebarCollapsed ? <span className="ml-3">{item.label}</span> : null}

                        {isSidebarCollapsed ? (
                          <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold text-[#64748B] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
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
    </aside>
  );
};

export default NurseSidebar;
