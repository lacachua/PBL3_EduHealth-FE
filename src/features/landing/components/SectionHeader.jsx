import React from "react";

const SectionHeader = ({
  title,
  description,
  action = null,
  align = "center",
  eyebrow = "",
  className = "",
}) => {
  const isCentered = align === "center";

  return (
    <div className={`mb-6 md:mb-7 ${className}`}>
      <div
        className={`flex flex-col gap-3 ${
          isCentered
            ? "items-center text-center"
            : "md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className={`max-w-3xl ${isCentered ? "text-center" : "text-left"}`}>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/85">{eyebrow}</p>
          ) : null}
          <h2 className="font-headline text-[clamp(1.8rem,1.55rem+0.9vw,2.2rem)] font-semibold tracking-tight text-on-surface">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-[14px] leading-6 text-on-surface-variant md:text-[15px]">{description}</p>
          ) : null}
        </div>

        {action ? <div className={isCentered ? "mt-1" : "md:shrink-0"}>{action}</div> : null}
      </div>
    </div>
  );
};

export default SectionHeader;
