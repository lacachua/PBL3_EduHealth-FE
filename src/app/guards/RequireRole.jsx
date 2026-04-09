import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/useAuth";

const ROLE_ALIASES = {
  PARENT: 'STUDENT',
};

const RequireRole = ({ allowedRoles }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase?.();
  const effectiveUserRole = ROLE_ALIASES[userRole] || userRole;
  const normalizedAllowedRoles = (allowedRoles || []).map((role) => role?.toUpperCase?.());

  if (!effectiveUserRole || !normalizedAllowedRoles.includes(effectiveUserRole)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RequireRole;