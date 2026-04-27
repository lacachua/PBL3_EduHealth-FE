import { Link } from 'react-router-dom';

const BrandInner = ({ textClassName, iconClassName, suffix }) => {
  return (
    <>
      <span
        className={`material-symbols-outlined leading-none ${iconClassName}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        health_and_safety
      </span>
      <span className={`font-headline font-bold tracking-tighter ${textClassName}`}>
        EduHealth
        {suffix ? <span className="ml-1 text-current/80">{suffix}</span> : null}
      </span>
    </>
  );
};

const BrandLogo = ({
  to = '/',
  asLink = true,
  className = '',
  textClassName = 'text-2xl',
  iconClassName = 'text-[1.55rem]',
  colorClassName = 'text-primary',
  suffix = '',
  ariaLabel = 'Về trang chủ EduHealth',
}) => {
  const baseClassName = `inline-flex items-center gap-2 rounded-lg px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${colorClassName} ${className}`;

  if (asLink) {
    return (
      <Link to={to} aria-label={ariaLabel} className={`${baseClassName} hover:opacity-80`}>
        <BrandInner textClassName={textClassName} iconClassName={iconClassName} suffix={suffix} />
      </Link>
    );
  }

  return (
    <div className={baseClassName}>
      <BrandInner textClassName={textClassName} iconClassName={iconClassName} suffix={suffix} />
    </div>
  );
};

export default BrandLogo;
