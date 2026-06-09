import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const LandingTopNav = () => {
  const sectionIds = useMemo(
    () => ['nghiep-vu', 'giai-phap', 'ban-tin-y-te', 'lien-he'],
    []
  );
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const headerOffset = 76;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) {
      return undefined;
    }

    const ratioMap = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        let hasUpdate = false;
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) {
            return;
          }
          ratioMap.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          hasUpdate = true;
        });

        if (!hasUpdate) {
          return;
        }

        let bestId = activeSectionRef.current;
        let bestRatio = 0;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestRatio > 0 && bestId !== activeSectionRef.current) {
          activeSectionRef.current = bestId;
          setActiveSection(bestId);
        }
      },
      {
        root: null,
        rootMargin: `-${headerOffset}px 0px -55% 0px`,
        threshold: [0.15, 0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => {
      ratioMap.set(section.id, 0);
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    if (activeSectionRef.current !== id) {
      activeSectionRef.current = id;
      setActiveSection(id);
    }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navItemClassName =
    'inline-flex items-center rounded-full px-3 py-1.5 text-[15px] font-semibold text-on-surface-variant transition-[color,background-color,box-shadow] duration-200';

  const navItems = [
    { id: 'nghiep-vu', label: 'Nghiệp vụ' },
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
              <button
                key={item.id}
                type="button"
                className={`${navItemClassName} ${isActive ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(43,125,96,0.24)]' : 'hover:bg-surface-container-lowest hover:text-on-surface'}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
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
