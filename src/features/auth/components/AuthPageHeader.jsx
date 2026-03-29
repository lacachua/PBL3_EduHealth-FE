import React from 'react';
import BrandLogo from '../../../shared/components/common/BrandLogo';

const AuthPageHeader = ({
  title,
  subtitle,
  centered = false,
}) => {
  if (centered) {
    return (
      <div className="auth-header-block mx-auto mb-3.5 max-w-[440px] text-center">
        <div className="mb-2 flex justify-center">
          <BrandLogo
            asLink
            className="px-0 py-0"
            textClassName="text-[1.67rem]"
            iconClassName="text-[1.43rem]"
            colorClassName="text-auth-primary"
          />
        </div>

        <h1 className="auth-title-fade-up font-headline text-[1.62rem] font-bold tracking-tight text-auth-text-strong sm:text-[1.74rem]">
          {title}
        </h1>

        <span className="auth-accent-line mx-auto mt-1.5 block h-[3px] w-14 rounded-full bg-auth-primary/85" />

        {subtitle ? <p className="mt-1.5 text-[13px] font-medium text-auth-text-body/90">{subtitle}</p> : null}
      </div>
    );
  }

  return (
    <div className="mb-4.5">
      <h1 className="font-headline text-[1.56rem] font-bold tracking-tight text-auth-text-strong sm:text-[1.66rem]">
        {title}
      </h1>
    </div>
  );
};

export default AuthPageHeader;