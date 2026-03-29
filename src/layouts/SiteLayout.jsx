import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingTopNav from '../features/landing/components/LandingTopNav';
import LandingFooter from '../features/landing/components/LandingFooter';

const SiteLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <LandingTopNav />

      <main className="flex-1">
        <Outlet />
      </main>

      <LandingFooter />
    </div>
  );
};

export default SiteLayout;