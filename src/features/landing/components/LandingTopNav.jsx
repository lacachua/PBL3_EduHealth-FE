import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingTopNav = () => {
  const [activeSection, setActiveSection] = useState('tinh-nang');

  useEffect(() => {
    const syncActiveFromHash = () => {
      const nextHash = window.location.hash.replace('#', '');
      if (nextHash) {
        setActiveSection(nextHash);
      }
    };

    syncActiveFromHash();
    window.addEventListener('hashchange', syncActiveFromHash);

    return () => window.removeEventListener('hashchange', syncActiveFromHash);
  }, []);

  const navItemClassName =
    'inline-flex items-center border-b-2 border-transparent pb-0.5 text-[16px] font-semibold text-on-surface-variant transition-colors duration-200 hover:text-primary';

  const navItems = [
    { id: 'tinh-nang', label: 'Nghiệp vụ' },
    { id: 'giai-phap', label: 'Giải pháp' },
    { id: 'ban-tin-y-te', label: 'Bản tin y tế' },
    { id: 'lien-he', label: 'Liên hệ' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/50 bg-white/85 shadow-md shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="hidden items-center gap-7 font-headline tracking-tight md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                className={`${navItemClassName} ${isActive ? 'border-primary text-primary font-bold' : ''}`}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
        <div className="flex items-center">
          <Link to="/login" className="signature-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">Đăng nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingTopNav;
