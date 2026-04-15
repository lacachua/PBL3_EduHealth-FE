import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/useAuth";

const RequireRole = ({ allowedRoles }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase?.();
  const normalizedAllowedRoles = (allowedRoles || []).map((role) => role?.toUpperCase?.());

  if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RequireRole;