import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/useAuth";

const AuthRoleGuard = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user?.role?.toUpperCase?.() ?? '';
  const normalizedAllowedRoles = allowedRoles.map((r) => r?.toUpperCase?.() ?? '');

  if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AuthRoleGuard;
