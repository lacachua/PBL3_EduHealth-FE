import React from 'react';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingFooter = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-100 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <BrandLogo textClassName="text-lg" iconClassName="text-[1.2rem]" className="mb-2 -ml-2" />
          <p className="font-body text-xs text-on-surface-variant mb-2">© 2024 EduHealth. Bản quyền thuộc về EduHealth.</p>
          <p className="font-body text-xs text-on-surface-variant">Giải pháp quản lý sức khỏe học đường toàn diện tại Việt Nam.</p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end">
          <a className="font-body text-xs text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Chính sách bảo mật</a>
          <a className="font-body text-xs text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Điều khoản sử dụng</a>
          <a className="font-body text-xs text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Tuân thủ HIPAA</a>
          <a className="font-body text-xs text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
