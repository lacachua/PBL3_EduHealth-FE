import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-shell min-h-screen bg-auth-bg-main text-auth-text-strong">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
