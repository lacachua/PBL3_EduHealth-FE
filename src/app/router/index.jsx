import React from "react";
import { Navigate, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Layouts
import SiteLayout from "../../layouts/SiteLayout";
import AdminLayout from "../../layouts/AdminLayout";
import AuthLayout from "../../layouts/AuthLayout";
import NurseLayout from "../../layouts/NurseLayout";
import StudentLayout from "../../layouts/StudentLayout";

// Guards
import AuthRoleGuard from "../guards/AuthRoleGuard";

import {
  AdminNotificationsInboxPage,
  AdminDashboardPage,
  AdminSettingsPage,
  CatalogManagementPage,
  ChangePasswordPage,
  CreateExaminationPage,
  ExaminationDetailPage,
  ExaminationLandingPage,
  ForbiddenPage,
  ForgotPasswordPage,
  LandingPage,
  Lazy,
  LoginPage,
  MedicinesPage,
  NotFoundPage,
  NurseHealthProfilesPage,
  ReportsPage,
  NurseDashboardPage,
  NurseHealthProfileDetailPage,
  NurseMedicinesPage,
  NurseNotificationsInboxPage,
  NursePendingVaccinationsPage,
  NurseProfilePage,
  NurseReportsPage,
  NurseMessagingPage,
  NurseStudentsPage,
  NurseVaccinationCampaignDetailPage,
  NurseVaccinationCampaignsPage,
  PublicNewsListPage,
  ServerErrorPage,
  StudentAccountPage,
  StudentCareHistoryPage,
  StudentManagementPage,
  StudentNotificationsInboxPage,
  StudentOverviewPage,
  StudentMessagingPage,
  StudentVaccinationsPage,
  SystemLogsPage,
  UserManagementPage,
  VerifyOtpPage,
} from "./lazyRouteElements";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Lazy><LandingPage /></Lazy>} />
        <Route path="/news" element={<Lazy><PublicNewsListPage /></Lazy>} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Lazy><LoginPage /></Lazy>} />
        <Route path="/forgot-password" element={<Lazy><ForgotPasswordPage /></Lazy>} />
        <Route path="/verify-otp" element={<Lazy><VerifyOtpPage /></Lazy>} />
        <Route path="/change-password" element={<Lazy><ChangePasswordPage /></Lazy>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AuthRoleGuard allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Lazy><AdminDashboardPage /></Lazy>} />
          <Route path="students" element={<Lazy><StudentManagementPage /></Lazy>} />
          <Route path="students/create" element={<Navigate to="/admin/students" replace />} />
          <Route path="users" element={<Lazy><UserManagementPage /></Lazy>} />
          <Route path="catalogs" element={<Lazy><CatalogManagementPage /></Lazy>} />
          <Route path="medicines" element={<Lazy><MedicinesPage /></Lazy>} />
          <Route path="reports" element={<Lazy><ReportsPage /></Lazy>} />
          <Route path="notifications" element={<Lazy><AdminNotificationsInboxPage /></Lazy>} />
          <Route path="system-logs" element={<Lazy><SystemLogsPage /></Lazy>} />
          <Route path="settings" element={<Lazy><AdminSettingsPage /></Lazy>} />
        </Route>
      </Route>

      {/* Protected Nurse Routes */}
      <Route element={<AuthRoleGuard allowedRoles={["nurse"]} />}>
        <Route path="/nurse" element={<NurseLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Lazy><NurseDashboardPage /></Lazy>} />
          <Route path="students" element={<Lazy><NurseStudentsPage /></Lazy>} />
          <Route path="health-profiles" element={<Lazy><NurseHealthProfilesPage /></Lazy>} />
          <Route path="health-profiles/:studentId" element={<Lazy><NurseHealthProfileDetailPage /></Lazy>} />
          <Route path="medicines" element={<Lazy><NurseMedicinesPage /></Lazy>} />
          <Route path="examinations" element={<Lazy><ExaminationLandingPage /></Lazy>} />
          <Route path="examinations/:examinationId" element={<Lazy><ExaminationDetailPage /></Lazy>} />
          <Route path="students/:studentUserId/examinations/create" element={<Lazy><CreateExaminationPage /></Lazy>} />
          <Route path="vaccinations" element={<Lazy><NurseVaccinationCampaignsPage /></Lazy>} />
          <Route path="vaccinations/pending" element={<Lazy><NursePendingVaccinationsPage /></Lazy>} />
          <Route path="vaccinations/:campaignId" element={<Lazy><NurseVaccinationCampaignDetailPage /></Lazy>} />
          <Route path="notifications" element={<Lazy><NurseNotificationsInboxPage /></Lazy>} />
          <Route path="reports" element={<Lazy><NurseReportsPage /></Lazy>} />
          <Route path="messages" element={<Lazy><NurseMessagingPage /></Lazy>} />
          <Route path="profile" element={<Lazy><NurseProfilePage /></Lazy>} />
        </Route>
      </Route>

      {/* Protected Student Routes */}
      <Route element={<AuthRoleGuard allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Lazy><StudentOverviewPage /></Lazy>} />
          <Route path="care-history" element={<Lazy><StudentCareHistoryPage /></Lazy>} />
          <Route path="vaccinations" element={<Lazy><StudentVaccinationsPage /></Lazy>} />
          <Route path="notifications" element={<Lazy><StudentNotificationsInboxPage /></Lazy>} />
          <Route path="messages" element={<Lazy><StudentMessagingPage /></Lazy>} />
          <Route path="account" element={<Lazy><StudentAccountPage /></Lazy>} />
          <Route path="dashboard" element={<Navigate to="/student/overview" replace />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Lazy><ForbiddenPage /></Lazy>} />
      <Route path="/500" element={<Lazy><ServerErrorPage /></Lazy>} />
      <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
    </Route>
  )
);
