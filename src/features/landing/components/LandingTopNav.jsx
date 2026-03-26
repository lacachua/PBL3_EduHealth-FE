import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingTopNav = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/50 bg-white/80 shadow-md shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[5.5rem] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="hidden items-center space-x-8 font-headline text-[0.95rem] font-semibold tracking-tight md:flex">
          <a className="border-b-2 border-primary pb-1 text-primary" href="#giai-phap">Giải pháp</a>
          <a className="text-on-surface-variant transition-colors duration-200 hover:text-primary" href="#tinh-nang">Tính năng</a>
          <a className="text-on-surface-variant transition-colors duration-200 hover:text-primary" href="#ban-tin-y-te">Bản tin y tế</a>
          <a className="text-on-surface-variant transition-colors duration-200 hover:text-primary" href="#lien-he">Liên hệ</a>
        </div>
        <div className="flex items-center space-x-3">
          <a href="#ban-tin-y-te" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/5 hover:text-primary">Bản tin</a>
          <Link to="/login" className="signature-gradient rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">Đăng nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingTopNav;
