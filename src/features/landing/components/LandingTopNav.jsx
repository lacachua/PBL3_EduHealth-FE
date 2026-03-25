import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingTopNav = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center w-full">
        <BrandLogo />
        <div className="hidden md:flex space-x-8 items-center font-headline text-sm font-medium tracking-tight">
          <a className="text-primary font-bold border-b-2 border-primary" href="#">Giải pháp</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Tài nguyên</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Về chúng tôi</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Liên hệ</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-5 py-2 text-sm font-semibold text-primary hover:opacity-80 transition-all">Đăng nhập</Link>
          <button className="px-6 py-2.5 text-sm font-bold text-white signature-gradient rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all" type="button">Đăng ký</button>
        </div>
      </div>
    </nav>
  );
};

export default LandingTopNav;
