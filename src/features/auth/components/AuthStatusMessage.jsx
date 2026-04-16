import React from 'react';

const STATUS_STYLES = {
  error: {
    wrap: 'border-auth-error/30 bg-auth-error-soft text-auth-error',
    icon: 'error',
  },
  success: {
    wrap: 'border-auth-success/25 bg-auth-primary-soft text-auth-success',
    icon: 'check_circle',
  },
  info: {
    wrap: 'border-info/28 bg-info-soft text-auth-text-strong',
    icon: 'info',
  },
};

const AuthStatusMessage = ({ message, type = 'error' }) => {
  if (!message) {
    return null;
  }

  const style = STATUS_STYLES[type] || STATUS_STYLES.error;

  return (
    <div className={`rounded-xl border px-3 py-2.5 text-sm ${style.wrap}`} role="alert">
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined mt-[1px] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          {style.icon}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AuthStatusMessage;
