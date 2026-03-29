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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">{eyebrow}</p>
          ) : null}
          <h2 className="font-headline text-3xl font-semibold tracking-tight text-primary-container md:text-[2rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-6 text-on-surface-variant md:text-base">{description}</p>
          ) : null}
        </div>

        {action ? <div className={isCentered ? "mt-1" : "md:shrink-0"}>{action}</div> : null}
      </div>
    </div>
  );
};

export default SectionHeader;
