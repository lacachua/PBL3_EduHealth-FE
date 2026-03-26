import React from 'react';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingFooter = () => {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <BrandLogo textClassName="text-2xl" iconClassName="text-[1.55rem]" className="-ml-2 mb-4" />
            <p className="max-w-[20rem] text-sm leading-7 text-on-surface-variant">
              Nền tảng hỗ trợ phòng y tế nhà trường kết nối thông tin sức khỏe với phụ huynh học sinh.
            </p>

            <div className="mt-5 flex items-center gap-3 text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest">
                <span className="material-symbols-outlined text-lg">health_and_safety</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest">
                <span className="material-symbols-outlined text-lg">vaccines</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest">
                <span className="material-symbols-outlined text-lg">notifications</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-headline text-base font-bold text-on-surface">Hệ thống</h4>
            <div className="space-y-2.5 text-sm leading-relaxed text-on-surface-variant">
              <a href="#tinh-nang" className="block transition-colors hover:text-primary">Tính năng cốt lõi</a>
              <a href="#ban-tin-y-te" className="block transition-colors hover:text-primary">Bản tin y tế học đường</a>
              <a href="#tinh-nang" className="block transition-colors hover:text-primary">Quản lý hồ sơ học sinh</a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-headline text-base font-bold text-on-surface">Kết nối</h4>
            <div className="space-y-2.5 text-sm leading-relaxed text-on-surface-variant">
              <a href="#giai-phap" className="block transition-colors hover:text-primary">Thông tin phụ huynh</a>
              <a href="#lien-he" className="block transition-colors hover:text-primary">Liên hệ bộ phận y tế trường</a>
              <a href="#ban-tin-y-te" className="block transition-colors hover:text-primary">Cổng thông báo</a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-headline text-base font-bold text-on-surface">Liên hệ hỗ trợ</h4>
            <div className="space-y-3 text-sm leading-relaxed text-on-surface-variant">
              <p className="text-on-surface">Phòng Y tế Trường Tiểu học Trần Cao Vân</p>
              <p>Email: yte.trancaovan@edu.vn</p>
              <p>Điện thoại: (028) 3822 1234</p>
              <p>Khu vực Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 py-3 text-sm leading-relaxed text-on-surface-variant">
          <p className="text-center">© 2026 Hệ thống quản lý sức khỏe học đường - Trường Tiểu học Trần Cao Vân.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
