import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/useAuth';
import BrandLogo from '../shared/components/common/BrandLogo';
import { adminSidebarActions, adminSidebarGroups } from './constants/adminShellConfig';

const getUserName = (user) => {
  const rawName = user?.fullName || user?.name || 'Quản trị viên';
  const trimmedName = rawName.replace(/\s*\([^)]*\)\s*$/, '').trim();

  return trimmedName || rawName;
};

const getUserRoleLabel = (user) => {
  const role = String(user?.role || '').toUpperCase();
  if (role === 'ADMIN') return 'Quản trị viên';
  if (role === 'NURSE') return 'Nhân viên y tế';
  if (role === 'STUDENT' || role === 'PARENT') return 'Học sinh';
  return 'Quản trị viên';
};

const AdminLayout = () => {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userName = useMemo(() => getUserName(user), [user]);
  const userRoleLabel = useMemo(() => getUserRoleLabel(user), [user]);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarWidthClass = isSidebarCollapsed ? 'md:w-[76px]' : 'md:w-[264px]';
  const mainOffsetClass = isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[264px]';

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-30 bg-on-surface/30 transition md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-outline-variant bg-surface-container-lowest shadow-[2px_0_10px_rgba(15,23,42,0.06)] transition-[transform,width] duration-200 md:translate-x-0 ${sidebarWidthClass} ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-outline-variant/80 px-3.5 py-3.5">
          {isSidebarCollapsed ? (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-secondary-container text-secondary">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                health_and_safety
              </span>
            </div>
          ) : (
            <div className="min-w-0 flex-1 overflow-hidden">
              <BrandLogo asLink={false} textClassName="text-xl" suffix="Admin" className="w-full px-0" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden shrink-0 rounded-xl border border-outline-variant p-1.5 text-on-surface-variant transition hover:bg-surface-container-low md:inline-flex"
            aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <span className="material-symbols-outlined text-lg">
              {isSidebarCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
            </span>
          </button>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-xl p-1.5 text-on-surface-variant hover:bg-surface-container-low md:hidden"
            aria-label="Đóng thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 pb-3.5 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adminSidebarGroups.map((group) => (
            <div key={group.id}>
              {!isSidebarCollapsed ? (
                <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant/80">
                  {group.label}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => {
                  return (
                    <NavLink
                      key={item.id}
                      to={item.to}
                      end={item.to === '/admin/dashboard'}
                      onClick={closeSidebar}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) => `group relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition ${
                        isActive
                          ? 'bg-secondary-container text-secondary'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-secondary" /> : null}
                          <span className={`material-symbols-outlined text-[20px] ${isSidebarCollapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
                          {!isSidebarCollapsed ? <span className="ml-3">{item.label}</span> : null}

                          {isSidebarCollapsed ? (
                            <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs font-semibold text-on-surface-variant opacity-0 shadow-sm transition group-hover:opacity-100">
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

        <div className="border-t border-outline-variant/80 px-2.5 py-3">
          <button
            type="button"
            onClick={handleLogout}
            title={isSidebarCollapsed ? adminSidebarActions.secondary.label : undefined}
            className={`inline-flex w-full items-center rounded-xl border border-transparent text-sm font-semibold text-on-surface-variant transition hover:border-outline-variant hover:bg-surface-container-low ${
              isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3.5 py-2.5'
            }`}
          >
            <span className="material-symbols-outlined text-base">{adminSidebarActions.secondary.icon}</span>
            {!isSidebarCollapsed ? adminSidebarActions.secondary.label : null}
          </button>
        </div>
      </aside>

      <main className={`min-h-screen bg-surface-container md:border-l md:border-outline-variant/70 ${mainOffsetClass}`}>
        <header className="sticky top-0 z-30 border-b border-outline-variant/80 bg-surface-container-lowest shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
          <div className="flex h-12 items-center justify-between gap-3 px-4 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-xl border border-outline-variant/70 p-2 text-on-surface-variant md:hidden"
                aria-label="Mở thanh điều hướng"
              >
                <span className="material-symbols-outlined text-lg">menu</span>
              </button>

              <label className="relative hidden w-full max-w-md items-center md:inline-flex">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 text-base text-on-surface-variant">
                  search
                </span>
                <input
                  type="search"
                  placeholder="Tìm học sinh, tài khoản, danh mục, báo cáo..."
                  className="w-full rounded-xl border border-outline-variant bg-surface py-2 pl-9 pr-4 text-sm text-on-surface outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-xl p-2 text-on-surface-variant transition hover:bg-surface-container-low"
                aria-label="Thông báo"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
              </button>

              <div className="hidden h-6 w-px bg-outline-variant/50 sm:block" />

              <div className="flex items-center gap-2">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-on-surface">{userName}</p>
                  <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">{userRoleLabel}</p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-secondary/20 bg-secondary-container text-sm font-bold text-secondary">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 pb-4 pt-3 sm:px-5">
          <Outlet key={locationKey} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
