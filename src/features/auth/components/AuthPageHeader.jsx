import React from 'react';

const AuthPageHeader = ({ icon, title, description }) => {
  return (
    <div className="mb-5 text-center sm:mb-6">
      {icon && (
        <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-3">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      )}
      <h1 className="font-headline text-[1.5rem] font-extrabold tracking-tight text-on-surface sm:text-[1.65rem]">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-1.5 max-w-[29rem] text-sm text-on-surface-variant">
          {description}
        </p>
      )}
    </div>
  );
};

export default AuthPageHeader;