import React from 'react';
import AuthVisualPanel from './AuthVisualPanel';
import '../styles/auth.css';

const AuthShell = ({
  children,
  panel,
}) => {
  return (
    <section className="auth-bg-pattern relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/45 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-1.65rem)] w-full max-w-[1220px] grid-cols-1 gap-3.5 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-4.5 lg:px-8 lg:py-4">
        <AuthVisualPanel panel={panel} />

        <div className="relative flex min-h-[402px] flex-col rounded-2xl border border-auth-border/70 bg-auth-surface/95 p-3.5 auth-surface-shadow sm:p-4.5 lg:p-5">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
