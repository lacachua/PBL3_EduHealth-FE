import React, { useState } from 'react';

const AuthVisualPanel = ({ panel }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!panel) {
    return null;
  }

  const fallbackTitle = panel.headline || 'EduHealth';

  return (
    <aside className="relative flex min-h-[260px] overflow-hidden rounded-2xl border border-auth-border/80 bg-auth-surface-soft shadow-[var(--sys-shadow-soft)] lg:h-full lg:min-h-0">
      {!imageFailed ? (
        <img
          src={panel.imageSrc}
          alt={panel.imageAlt}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="auth-visual-fallback flex h-full w-full flex-col justify-between p-7 text-white">
          <span className="material-symbols-outlined text-[34px] text-white/90" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_hospital
          </span>
          <p className="max-w-[24ch] text-[1.34rem] font-semibold leading-[1.28] text-white/95">{fallbackTitle}</p>
        </div>
      )}

      <div className="auth-visual-overlay pointer-events-none absolute inset-0" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="rounded-2xl border border-white/35 bg-white/10 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.28)] backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/82">{panel.tag}</p>
          <h2 className="mt-1.5 max-w-[23ch] text-[1.42rem] font-semibold leading-[1.24] text-white">{panel.headline}</h2>
          {panel.caption ? <p className="mt-1.5 text-[12px] text-white/88">{panel.caption}</p> : null}
        </div>
      </div>
    </aside>
  );
};

export default AuthVisualPanel;
