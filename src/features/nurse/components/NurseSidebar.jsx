import React from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';
import { nurseSidebarGroups } from '../config/nurseNavigation';

const NurseSidebar = ({ isSidebarOpen, isSidebarCollapsed, onCloseSidebar, onToggleSidebar, onLogout }) => {
  const sidebarWidthClass = isSidebarCollapsed ? 'md:w-[78px]' : 'md:w-[272px]';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-emerald-100 bg-white shadow-[2px_0_16px_rgba(16,185,129,0.08)] transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-emerald-100 px-3.5 py-3.5">
        {isSidebarCollapsed ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
          </div>
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden">
            <BrandLogo
              asLink={false}
              textClassName="text-xl"
              suffix="Nurse"
              className="w-full px-0"
              colorClassName="text-emerald-700"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden shrink-0 rounded-xl border border-emerald-100 p-1.5 text-emerald-700 transition hover:bg-emerald-50 md:inline-flex"
          aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <span className="material-symbols-outlined text-lg">
            {isSidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseSidebar}
          className="rounded-xl p-1.5 text-slate-500 hover:bg-emerald-50 md:hidden"
          aria-label="Đóng thanh điều hướng"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 pb-3.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {nurseSidebarGroups.map((group) => (
          <div key={group.id}>
            {!isSidebarCollapsed ? (
              <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
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
                      className={`group relative inline-flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-[15px] font-medium transition ${
                        isSidebarCollapsed ? 'justify-center' : 'gap-3'
                      } text-red-600 hover:bg-red-50`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      {!isSidebarCollapsed ? <span>{item.label}</span> : null}

                      {isSidebarCollapsed ? (
                        <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100">
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
                    end
                    onClick={onCloseSidebar}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) => `group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] transition ${
                      isActive
                        ? 'bg-emerald-100/70 font-semibold text-emerald-800'
                        : 'font-medium text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-emerald-500" /> : null}
                        <span className={`material-symbols-outlined text-[20px] ${isSidebarCollapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
                        {!isSidebarCollapsed ? <span className="ml-3">{item.label}</span> : null}

                        {isSidebarCollapsed ? (
                          <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100">
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
