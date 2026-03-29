import React from 'react';
import LandingHeroSection from '../features/landing/components/LandingHeroSection';
import LandingFeatureSection from '../features/landing/components/LandingFeatureSection';
import LandingRoleSection from '../features/landing/components/LandingRoleSection';
import LandingNewsSection from '../features/landing/components/LandingNewsSection';
import LandingCtaSection from '../features/landing/components/LandingCtaSection';

const LandingPage = () => {
  const scrollToNewsSection = () => {
    const section = document.getElementById('ban-tin-y-te');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <LandingHeroSection onNewsClick={scrollToNewsSection} />
      <LandingFeatureSection />
      <LandingRoleSection />
      <LandingNewsSection />
      <LandingCtaSection onNewsClick={scrollToNewsSection} />
    </>
  );
};

export default LandingPage;
