import React, { useState } from 'react';

const NurseTopbar = ({ onOpenSidebar, userName, userRoleLabel }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-30 border-b border-[#D8E9E2] bg-white/95 backdrop-blur-sm">
      <div className="flex h-[64px] items-center justify-between gap-4 pl-4 pr-5 sm:h-[66px] sm:gap-5 sm:pl-5 sm:pr-7 lg:pr-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-xl border border-[#D8E9E2] p-2 text-[#0F8A6C] md:hidden"
            aria-label="Mở thanh điều hướng"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          <label className="relative w-full min-w-0 sm:max-w-[440px] lg:max-w-[520px]">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#5F746C]/70">search</span>
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm học sinh, hồ sơ, thuốc..."
              className="w-full rounded-full border border-[#D8E9E2] bg-white py-2 pl-9 pr-4 text-sm text-[#5F746C] outline-none transition focus:border-[#0F8A6C]/40 focus:ring-2 focus:ring-[#DDF4EC]"
            />
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="relative rounded-xl p-2 text-[#5F746C] transition hover:bg-[#F5FBF8]"
            aria-label="Thông báo"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden h-7 w-px bg-[#D8E9E2] sm:block" />

          <div className="flex items-center gap-2.5 pr-0.5 sm:pr-1">
            <div className="hidden max-w-[150px] text-right sm:block">
              <p className="truncate text-sm font-semibold leading-5 text-[#16332B]">{userName}</p>
              <p className="mt-0.5 truncate text-[10px] font-medium uppercase leading-4 tracking-[0.06em] text-[#5F746C]">{userRoleLabel}</p>
            </div>
            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D8E9E2] bg-[#DDF4EC] text-sm font-bold text-[#0F8A6C]">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NurseTopbar;
