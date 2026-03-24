import React from 'react';

const footerLinks = ['Chính sách bảo mật', 'Điều khoản sử dụng', 'Tuân thủ HIPAA', 'Hỗ trợ'];

export const AuthBrand = ({ icon, iconClassName = '', textClassName = '' }) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`material-symbols-outlined text-primary ${iconClassName}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span className={`font-headline tracking-tighter text-primary ${textClassName}`}>EduHealth</span>
    </div>
  );
};

export const AuthTopNav = ({ variant = 'simple' }) => {
  if (variant === 'none') return null;

  if (variant === 'full') {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center w-full">
          <div className="text-2xl font-bold tracking-tighter text-green-700 font-headline">EduHealth</div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="font-headline text-sm font-medium tracking-tight text-slate-600 hover:text-green-600 transition-colors duration-200" href="#">Giải pháp</a>
            <a className="font-headline text-sm font-medium tracking-tight text-slate-600 hover:text-green-600 transition-colors duration-200" href="#">Tài nguyên</a>
            <a className="font-headline text-sm font-medium tracking-tight text-slate-600 hover:text-green-600 transition-colors duration-200" href="#">Về chúng tôi</a>
            <a className="font-headline text-sm font-medium tracking-tight text-slate-600 hover:text-green-600 transition-colors duration-200" href="#">Liên hệ</a>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-600 transition-all font-medium text-sm px-4 py-2">Đăng nhập</span>
            <button className="signature-gradient text-white px-6 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">Đăng ký</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
        <div className="text-2xl font-bold tracking-tighter text-green-700">EduHealth</div>
        <div className="hidden md:flex gap-8 items-center">
          <span className="font-headline text-sm font-medium tracking-tight text-slate-600">Hệ thống Y tế Học đường</span>
        </div>
      </div>
    </nav>
  );
};

export const AuthFooter = ({ variant = 'full', brandText = 'EduHealth' }) => {
  if (variant === 'none') return null;

  if (variant === 'compact') {
    return (
      <footer className="w-full py-8 text-center bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-label text-xs text-outline">© 2024 EduHealth. Bản quyền thuộc về EduHealth.</p>
          <div className="mt-2 flex justify-center gap-6">
            <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
            <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Tuân thủ HIPAA</a>
            <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Hỗ trợ</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full py-12 border-t border-slate-100 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-lg font-bold text-green-800 font-headline mb-2">{brandText}</div>
          <p className="font-body text-xs text-slate-500">© 2024 EduHealth. Bản quyền thuộc về EduHealth.</p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end">
          {footerLinks.map((label) => (
            <a key={label} className="font-body text-xs text-slate-500 hover:text-green-600 transition-all" href="#">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export const AuthSecurityBadges = () => {
  return (
    <div className="mt-8 flex justify-center gap-6 text-outline">
      <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined text-sm">shield_with_heart</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">Bảo mật chuẩn HIPAA</span>
      </div>
      <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined text-sm">encrypted</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">Mã hóa 256 bit</span>
      </div>
    </div>
  );
};
