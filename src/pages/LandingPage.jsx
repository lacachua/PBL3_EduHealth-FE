import React, { useCallback } from 'react';
import LandingTopNav from '../features/landing/components/LandingTopNav';
import LandingFooter from '../features/landing/components/LandingFooter';
import LandingHeroSection from '../features/landing/components/LandingHeroSection';
import LandingFeatureSection from '../features/landing/components/LandingFeatureSection';
import LandingRoleSection from '../features/landing/components/LandingRoleSection';
import LandingNewsSection from '../features/landing/components/LandingNewsSection';
import LandingCtaSection from '../features/landing/components/LandingCtaSection';

const LandingPage = () => {
  const scrollToNewsSection = useCallback(() => {
    const section = document.getElementById('ban-tin-y-te');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="bg-surface font-body text-on-surface">
      <LandingTopNav />

      <main>
        <LandingHeroSection onNewsClick={scrollToNewsSection} />
        <LandingFeatureSection />
        <LandingRoleSection />
        <LandingNewsSection />
        <LandingCtaSection onNewsClick={scrollToNewsSection} />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
