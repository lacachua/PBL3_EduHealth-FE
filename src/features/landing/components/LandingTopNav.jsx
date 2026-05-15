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
    'inline-flex items-center rounded-full px-3 py-1.5 text-[15px] font-semibold text-on-surface-variant transition-[color,background-color,box-shadow] duration-200';

  const navItems = [
    { id: 'tinh-nang', label: 'Nghiệp vụ' },
    { id: 'giai-phap', label: 'Giải pháp' },
    { id: 'ban-tin-y-te', label: 'Bản tin y tế' },
    { id: 'lien-he', label: 'Liên hệ' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/75 bg-white/88 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="hidden items-center gap-2 font-headline tracking-tight md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                className={`${navItemClassName} ${isActive ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(43,125,96,0.24)]' : 'hover:bg-surface-container-lowest hover:text-on-surface'}`}
                href={`/#${item.id}`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
        <div className="flex items-center">
          <Link to="/login" className="app-focus-ring signature-gradient rounded-xl px-4.5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/22 transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30">Đăng nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingTopNav;
