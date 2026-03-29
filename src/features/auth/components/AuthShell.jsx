import React from 'react';
import AuthVisualPanel from './AuthVisualPanel';

const AuthShell = ({
  children,
  panel,
}) => {
  return (
    <section className="auth-bg-pattern relative min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1220px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-5 lg:px-8 lg:py-4">
        <AuthVisualPanel panel={panel} />

        <div className="relative flex min-h-[420px] flex-col rounded-2xl border border-auth-border/70 bg-auth-surface/95 p-4 auth-surface-shadow sm:p-4.5 lg:p-5">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
