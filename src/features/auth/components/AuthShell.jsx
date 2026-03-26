import React from 'react';

const AuthShell = ({ children, contentClassName = '' }) => {
  return (
    <section className="relative px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-[-8%] h-64 w-64 rounded-full bg-primary/8 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-[-4rem] right-[-8%] h-72 w-72 rounded-full bg-secondary-container/20 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className={`mx-auto w-full ${contentClassName}`}>{children}</div>
      </div>
    </section>
  );
};

export default AuthShell;
