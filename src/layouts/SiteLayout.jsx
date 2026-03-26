import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LandingTopNav from '../features/landing/components/LandingTopNav';
import LandingFooter from '../features/landing/components/LandingFooter';

const AUTH_PATHS = new Set(['/login', '/forgot-password', '/verify-otp', '/change-password']);

const SiteLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.has(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <LandingTopNav />

      <main className={`flex-1 ${isAuthPage ? 'pt-[5.5rem]' : ''}`}>
        <Outlet />
      </main>

      <LandingFooter />
    </div>
  );
};

export default SiteLayout;