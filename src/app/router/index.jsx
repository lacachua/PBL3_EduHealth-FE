import React from "react";
import { Navigate, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Layouts
import SiteLayout from "../../layouts/SiteLayout";
import AdminLayout from "../../layouts/AdminLayout";
import AuthLayout from "../../layouts/AuthLayout";

// Guards
import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";
import {
  AdminDashboardPage,
  AdminModulePlaceholder,
  CatalogManagementPage,
  ChangePasswordPage,
  ForbiddenPage,
  ForgotPasswordPage,
  LandingPage,
  Lazy,
  LoginPage,
  MedicinesPage,
  NotFoundPage,
  NurseDashboard,
  ParentDashboard,
  ReportsPage,
  ServerErrorPage,
  StudentManagementPage,
  SystemLogsPage,
  UserManagementPage,
  VerifyOtpPage,
} from "./lazyRouteElements";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public + Auth Routes */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Lazy><LandingPage /></Lazy>} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Lazy><LoginPage /></Lazy>} />
        <Route path="/forgot-password" element={<Lazy><ForgotPasswordPage /></Lazy>} />
        <Route path="/verify-otp" element={<Lazy><VerifyOtpPage /></Lazy>} />
        <Route path="/change-password" element={<Lazy><ChangePasswordPage /></Lazy>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Lazy><AdminDashboardPage /></Lazy>} />
            <Route path="students" element={<Lazy><StudentManagementPage /></Lazy>} />
            <Route path="students/create" element={<Navigate to="/admin/students" replace />} />
            <Route path="users" element={<Lazy><UserManagementPage /></Lazy>} />
            <Route path="catalogs" element={<Lazy><CatalogManagementPage /></Lazy>} />
            <Route path="medicines" element={<Lazy><MedicinesPage /></Lazy>} />
            <Route path="reports" element={<Lazy><ReportsPage /></Lazy>} />
            <Route path="system-logs" element={<Lazy><SystemLogsPage /></Lazy>} />
            <Route
              path="settings"
              element={<Lazy><AdminModulePlaceholder moduleKey="settings" /></Lazy>}
            />
          </Route>
        </Route>
      </Route>

      {/* Protected Nurse Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["nurse"]} />}>
          <Route path="/nurse/dashboard" element={<Lazy><NurseDashboard /></Lazy>} />
        </Route>
      </Route>

      {/* Protected Parent Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["parent"]} />}>
          <Route path="/parent/dashboard" element={<Lazy><ParentDashboard /></Lazy>} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Lazy><ForbiddenPage /></Lazy>} />
      <Route path="/500" element={<Lazy><ServerErrorPage /></Lazy>} />
      <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
    </Route>
  )
);