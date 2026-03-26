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
    <div className={`mb-7 md:mb-9 ${className}`}>
      <div
        className={`flex flex-col gap-4 ${
          isCentered
            ? "items-center text-center"
            : "md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className={`max-w-3xl ${isCentered ? "text-center" : "text-left"}`}>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">{eyebrow}</p>
          ) : null}
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-on-surface-variant md:text-base">{description}</p>
          ) : null}
        </div>

        {action ? <div className={isCentered ? "mt-1" : "md:shrink-0"}>{action}</div> : null}
      </div>
    </div>
  );
};

export default SectionHeader;
