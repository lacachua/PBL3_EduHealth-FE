import React from 'react';

const PasswordChecklist = ({ rules }) => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {rules.map((rule) => {
        const stateClass = rule.met
          ? 'text-auth-success'
          : rule.showError
            ? 'text-auth-error'
            : 'text-auth-text-muted';

        const icon = rule.met ? 'check_circle' : rule.showError ? 'error' : 'radio_button_unchecked';

        return (
          <div key={rule.key} className={`flex items-center gap-1.5 text-[13px] ${stateClass}`}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <span>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordChecklist;
