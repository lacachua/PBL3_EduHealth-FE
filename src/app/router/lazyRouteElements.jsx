import React, { Suspense } from "react";

const PageFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <span style={{ fontSize: "1rem", color: "#888" }}>Dang tai...</span>
  </div>
);

export const Lazy = ({ children }) => <Suspense fallback={<PageFallback />}>{children}</Suspense>;

export const LandingPage = React.lazy(() => import("../../pages/LandingPage"));
export const LoginPage = React.lazy(() => import("../../features/auth/pages/LoginPage"));
export const ForgotPasswordPage = React.lazy(() => import("../../features/auth/pages/ForgotPasswordPage"));
export const VerifyOtpPage = React.lazy(() => import("../../features/auth/pages/VerifyOtpPage"));
export const ChangePasswordPage = React.lazy(() => import("../../features/auth/pages/ChangePasswordPage"));
export const NotFoundPage = React.lazy(() => import("../../pages/NotFoundPage"));
export const ForbiddenPage = React.lazy(() => import("../../pages/ForbiddenPage"));
export const ServerErrorPage = React.lazy(() => import("../../pages/ServerErrorPage"));

export const AdminDashboardPage = React.lazy(() => import("../../features/dashboard/admin/pages/AdminDashboardPage"));
export const AdminModulePlaceholder = React.lazy(() => import("../../features/dashboard/admin/components/AdminModulePlaceholder"));
export const ModulePlaceholderPage = React.lazy(() => import("../../features/nurse/components/ModulePlaceholderPage"));
export const ParentDashboard = React.lazy(() => import("../../features/dashboard/parent/ParentDashboard"));
export const StudentManagementPage = React.lazy(() => import("../../features/students/pages/StudentManagementPage"));
export const UserManagementPage = React.lazy(() => import("../../features/users/pages/UserManagementPage"));
export const CatalogManagementPage = React.lazy(() => import("../../features/catalogs/pages/CatalogManagementPage"));
export const MedicinesPage = React.lazy(() => import("../../features/medicines/pages/MedicinesPage"));
export const ReportsPage = React.lazy(() => import("../../features/reports/pages/ReportsPage"));
export const SystemLogsPage = React.lazy(() => import("../../features/system-logs/pages/SystemLogsPage"));