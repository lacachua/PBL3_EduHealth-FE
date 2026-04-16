import React from 'react';
import { Link } from 'react-router-dom';

const AuthBackLink = ({ to = '/login', children }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-auth-text-strong transition-colors hover:text-auth-primary"
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
      {children}
    </Link>
  );
};

export default AuthBackLink;