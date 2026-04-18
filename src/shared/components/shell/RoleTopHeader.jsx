import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  formatCurrentDateVi,
  getGreetingByTime,
  normalizeRoleCode,
  resolveAvatarUrl,
  resolveDisplayName,
  resolveFallbackInitialsByRole,
  resolveInitials,
  resolveRoleLabel,
} from './roleTopHeaderHelpers';

const MENU_WIDTH = 196;
const MENU_EDGE_OFFSET = 8;

const RoleTopHeader = ({
  role,
  user,
  onOpenSidebar,
  onNavigateAccount,
  onLogout,
  showNotifications = false,
  hasUnreadNotifications = true,
  onNotificationClick,
  containerClassName = '',
}) => {
  const [now, setNow] = useState(() => new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [failedAvatarUrl, setFailedAvatarUrl] = useState('');

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const resolvedRole = useMemo(() => normalizeRoleCode(role || user?.role, role), [role, user?.role]);
  const displayName = useMemo(() => resolveDisplayName(user, resolvedRole), [resolvedRole, user]);
  const roleLabel = useMemo(
    () => resolveRoleLabel({ roleCode: user?.role, roleLabel: user?.roleLabel, fallbackRoleCode: resolvedRole }),
    [resolvedRole, user?.role, user?.roleLabel],
  );
  const avatarUrl = useMemo(() => resolveAvatarUrl(user), [user]);
  const initials = useMemo(
    () => resolveInitials(displayName, resolveFallbackInitialsByRole(resolvedRole)),
    [displayName, resolvedRole],
  );
  const greetingText = useMemo(() => getGreetingByTime(now), [now]);
  const dateLabel = useMemo(() => formatCurrentDateVi(now), [now]);
  const normalizedAvatarUrl = String(avatarUrl || '').trim();
  const canRenderAvatarImage = Boolean(normalizedAvatarUrl) && normalizedAvatarUrl !== failedAvatarUrl;

  const updateMenuPosition = useCallback((menuHeight = 0) => {
    if (!triggerRef.current || typeof window === 'undefined') {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const effectiveMenuHeight = Math.max(menuHeight || 0, 104);

    const left = Math.min(
      Math.max(MENU_EDGE_OFFSET, triggerRect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - MENU_EDGE_OFFSET,
    );

    const shouldOpenUpward = (
      triggerRect.bottom + effectiveMenuHeight + MENU_EDGE_OFFSET > window.innerHeight
      && triggerRect.top - effectiveMenuHeight - 6 > MENU_EDGE_OFFSET
    );

    const top = shouldOpenUpward
      ? triggerRect.top - effectiveMenuHeight - 6
      : triggerRect.bottom + 8;

    setMenuPosition({ top, left });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || typeof window === 'undefined') {
      return undefined;
    }

    updateMenuPosition();

    const animationFrameId = window.requestAnimationFrame(() => {
      const measuredHeight = menuRef.current?.offsetHeight || 0;
      if (measuredHeight) {
        updateMenuPosition(measuredHeight);
      }
    });

    const handleWindowChange = () => {
      updateMenuPosition(menuRef.current?.offsetHeight || 0);
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isMenuOpen, updateMenuPosition]);

  const handleNavigateAccount = () => {
    setIsMenuOpen(false);
    onNavigateAccount?.();
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout?.();
  };

  const handleNotificationClick = () => onNotificationClick?.();

  const wrapperClasses = [
    'flex min-h-[68px] items-center justify-between gap-3 px-4 py-2.5 sm:min-h-[70px] sm:px-5',
    containerClassName,
  ].filter(Boolean).join(' ');

  const accountTriggerClassName = [
    'app-focus-ring group inline-flex items-center gap-1.5 rounded-lg border px-1 py-0.5 transition',
    isMenuOpen
      ? 'border-outline-variant bg-surface-container-low/70'
      : 'border-transparent hover:border-outline-variant/80 hover:bg-surface-container-low/70',
  ].join(' ');

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant/75 bg-surface/95 shadow-[0_1px_1px_rgba(15,23,42,0.03)] backdrop-blur-sm">
      <div className={wrapperClasses}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="app-focus-ring app-interactive rounded-xl border border-outline-variant bg-surface p-2 text-primary md:hidden"
            aria-label="Mở thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          <div className="min-w-0">
            <p className="truncate text-[1.03rem] font-semibold leading-6 text-on-surface sm:text-[1.11rem]">
              {greetingText}, <span className="font-bold text-primary-hover">{displayName}</span>
            </p>
            <p className="mt-0.5 truncate text-[12px] text-on-surface-variant">{dateLabel}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {showNotifications ? (
            <button
              type="button"
              onClick={handleNotificationClick}
              className="app-focus-ring app-interactive relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface-variant transition hover:-translate-y-px hover:border-primary/30 hover:bg-primary-soft/40 hover:text-primary-hover active:translate-y-0 active:scale-[0.98]"
              aria-label="Thông báo"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {hasUnreadNotifications ? <span className="absolute right-[8px] top-[8px] h-1.5 w-1.5 rounded-full bg-danger" /> : null}
            </button>
          ) : null}

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={accountTriggerClassName}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Mở menu tài khoản"
          >
            <span className="hidden min-w-0 text-right sm:block">
              <span className="block max-w-[136px] truncate text-[13px] font-semibold leading-4 text-on-surface">{displayName}</span>
              <span className="mt-[2px] block max-w-[136px] truncate text-[10px] font-normal leading-3.5 text-on-surface-variant/80">{roleLabel}</span>
            </span>

            <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary-soft text-[10px] font-semibold text-primary-hover shadow-[0_2px_6px_rgba(15,118,110,0.12)] transition group-hover:scale-[1.01] group-hover:shadow-[0_4px_9px_rgba(15,118,110,0.15)] group-active:scale-[0.99]" aria-hidden="true">
              {canRenderAvatarImage ? (
                <img
                  src={avatarUrl}
                  alt={`Avatar của ${displayName}`}
                  className="h-full w-full object-cover"
                  onError={() => setFailedAvatarUrl(normalizedAvatarUrl)}
                />
              ) : (
                <span className="text-[10px] font-semibold tracking-[0.01em]">{initials}</span>
              )}
            </span>

            <span className={`material-symbols-outlined hidden text-[17px] text-on-surface-variant/80 transition sm:block ${isMenuOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && typeof document !== 'undefined'
        ? createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              width: MENU_WIDTH,
              zIndex: 90,
            }}
            className="origin-top-right rounded-lg border border-outline-variant bg-surface p-1 shadow-[0_8px_18px_rgba(15,23,42,0.15)] animate-[appFadeSlideIn_130ms_ease-out]"
            role="menu"
          >
            <button
              type="button"
              onClick={handleNavigateAccount}
              className="app-focus-ring inline-flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-[17px]">manage_accounts</span>
              Tài khoản cá nhân
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="app-focus-ring inline-flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-danger transition hover:bg-danger-soft"
              role="menuitem"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
              Đăng xuất
            </button>
          </div>,
          document.body,
        )
        : null}
    </header>
  );
};

export default RoleTopHeader;
