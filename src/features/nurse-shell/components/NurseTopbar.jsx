import React, { useState } from 'react';

const NurseTopbar = ({ onOpenSidebar, userName, userRoleLabel }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/95 backdrop-blur-sm">
      <div className="flex h-[64px] items-center justify-between gap-4 pl-4 pr-5 sm:h-[66px] sm:gap-5 sm:pl-5 sm:pr-7 lg:pr-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="app-focus-ring app-interactive rounded-xl border border-outline-variant p-2 text-primary hover:bg-primary-soft md:hidden"
            aria-label="Mở thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          <label className="relative w-full min-w-0 sm:max-w-[440px] lg:max-w-[520px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-muted/70">search</span>
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm học sinh, hồ sơ, thuốc..."
              className="app-focus-ring app-input w-full rounded-full py-2 pl-9 pr-4 text-sm text-on-surface-variant"
            />
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="app-focus-ring app-interactive relative rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-low"
            aria-label="Thông báo"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          </button>

          <div className="hidden h-7 w-px bg-outline-variant sm:block" />

          <div className="flex items-center gap-2.5 pr-0.5 sm:pr-1">
            <div className="hidden max-w-[150px] text-right sm:block">
              <p className="truncate text-sm font-semibold leading-5 text-on-surface">{userName}</p>
              <p className="mt-0.5 truncate text-[10px] font-medium uppercase leading-4 tracking-[0.06em] text-on-surface-variant">{userRoleLabel}</p>
            </div>
            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary-soft text-sm font-bold text-primary">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NurseTopbar;
