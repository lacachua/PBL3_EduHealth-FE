import React from 'react';

const PasswordRules = ({ rules = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl bg-surface-container-low p-3 sm:grid-cols-2">
      {rules.map((rule) => {
        const label = typeof rule === 'string' ? rule : rule.label;
        const isMet = typeof rule === 'string' ? false : Boolean(rule.met);

        return (
          <div
            key={label}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.75rem] ${isMet ? 'bg-primary/10 text-on-surface' : 'bg-surface text-on-surface-variant'}`}
          >
            <span className={`material-symbols-outlined text-sm ${isMet ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {isMet ? 'check' : 'radio_button_unchecked'}
            </span>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRules;