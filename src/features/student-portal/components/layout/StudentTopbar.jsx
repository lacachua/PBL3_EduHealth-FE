import React, { useEffect, useMemo, useRef, useState } from 'react';

const StudentTopbar = ({ onOpenSidebar, identity, onNavigateAccount, onLogout }) => {
  const rawDisplayName = String(identity?.fullName || '').trim() || 'Nguyen Tuyen';
  const displayName = rawDisplayName.replace(/\s*\((học sinh|hoc sinh|student)\)\s*$/i, '').trim() || 'Nguyen Tuyen';
  const avatarUrl = identity?.avatar || '';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef(null);

  const initials = useMemo(() => {
    return displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'HS';
  }, [displayName]);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!menuContainerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isMenuOpen]);

  const handleOpenMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigateAccount = () => {
    setIsMenuOpen(false);
    onNavigateAccount?.();
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="student-topbar-surface sticky top-0 z-30 border-b border-outline-variant/85">
      <div className="student-layout-content flex min-h-[68px] items-center justify-between gap-4 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="app-focus-ring app-interactive rounded-xl border border-outline-variant bg-surface p-2 text-primary hover:bg-primary-soft md:hidden"
            aria-label="Mở thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          <div className="min-w-0">
            <p className="student-topbar-title truncate">Xin chào, {displayName} (Học sinh)</p>
            <p className="truncate text-xs text-on-surface-variant">{todayLabel}</p>
          </div>
        </div>

        <div className="relative" ref={menuContainerRef}>
          <button
            type="button"
            onClick={handleOpenMenu}
            className="student-avatar-trigger app-focus-ring app-interactive inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-bold"
            aria-label="Mở menu tài khoản"
            aria-expanded={isMenuOpen}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={`Avatar của ${displayName}`} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </button>

          {isMenuOpen ? (
            <div className="student-avatar-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[210px] rounded-xl p-1.5">
              <button
                type="button"
                onClick={handleNavigateAccount}
                className="student-avatar-menu-item app-focus-ring app-interactive block w-full rounded-lg px-3 py-2 text-left text-sm font-medium"
              >
                Tài khoản cá nhân
              </button>

              <div className="student-avatar-divider" />

              <button
                type="button"
                onClick={handleLogout}
                className="student-avatar-menu-item student-avatar-menu-item-danger app-focus-ring app-interactive block w-full rounded-lg px-3 py-2 text-left text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default StudentTopbar;