import React from 'react';

const AuthSupportText = ({ prompt, action, href }) => {
  return (
    <p className="text-center text-xs text-on-surface-variant">
      {prompt}{' '}
      {href ? (
        <a className="font-semibold text-primary transition-colors hover:text-primary-container hover:underline" href={href}>
          {action}
        </a>
      ) : (
        <span className="font-semibold text-on-surface">{action}</span>
      )}
    </p>
  );
};

export default AuthSupportText;