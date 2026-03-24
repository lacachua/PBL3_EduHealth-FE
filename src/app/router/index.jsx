import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Layouts
import AuthLayout from "../../layouts/AuthLayout";
import AdminLayout from "../../layouts/AdminLayout";

// Guards
import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";

// Pages
import LandingPage from "../../pages/LandingPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import VerifyOtpPage from "../../features/auth/pages/VerifyOtpPage";
import ChangePasswordPage from "../../features/auth/pages/ChangePasswordPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ForbiddenPage from "../../pages/ForbiddenPage";
import ServerErrorPage from "../../pages/ServerErrorPage";

// Dashboards
import AdminDashboard from "../../features/dashboard/admin/AdminDashboard";
import NurseDashboard from "../../features/dashboard/nurse/NurseDashboard";
import ParentDashboard from "../../features/dashboard/parent/ParentDashboard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Nurse Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["nurse"]} />}>
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
        </Route>
      </Route>

      {/* Protected Parent Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["parent"]} />}>
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);