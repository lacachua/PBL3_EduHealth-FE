import React from "react";
import { Navigate, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Layouts
import SiteLayout from "../../layouts/SiteLayout";
import AdminLayout from "../../layouts/AdminLayout";
import AuthLayout from "../../layouts/AuthLayout";
import NurseLayout from "../../layouts/NurseLayout";
import StudentLayout from "../../layouts/StudentLayout";
import { nurseModuleMeta } from "../../features/nurse/config/nurseModuleMeta";

// Guards
import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";
import {
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
  ModulePlaceholderPage,
  NurseHealthProfilesPage,
  ReportsPage,
  NurseHealthProfileDetailPage,
  NurseMedicinesPage,
  NursePendingVaccinationsPage,
  NurseProfilePage,
  NurseStudentsPage,
  NurseVaccinationCampaignDetailPage,
  NurseVaccinationCampaignsPage,
  ServerErrorPage,
  StudentAccountPage,
  StudentCareHistoryPage,
  StudentManagementPage,
  StudentOverviewPage,
  StudentVaccinationsPage,
  SystemLogsPage,
  UserManagementPage,
  VerifyOtpPage,
} from "./lazyRouteElements";

const renderNurseModule = ({ title, description, moduleName }) => (
  <Lazy>
    <ModulePlaceholderPage title={title} description={description} moduleName={moduleName} />
  </Lazy>
);

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
              element={<Lazy><AdminSettingsPage /></Lazy>}
            />
          </Route>
        </Route>
      </Route>

      {/* Protected Nurse Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["nurse"]} />}>
          <Route path="/nurse" element={<NurseLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={renderNurseModule(nurseModuleMeta.dashboard)} />
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
            <Route path="reports" element={renderNurseModule(nurseModuleMeta.reports)} />
            <Route path="profile" element={<Lazy><NurseProfilePage /></Lazy>} />
          </Route>
        </Route>
      </Route>

      {/* Protected Student Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Lazy><StudentOverviewPage /></Lazy>} />
            <Route path="care-history" element={<Lazy><StudentCareHistoryPage /></Lazy>} />
            <Route path="vaccinations" element={<Lazy><StudentVaccinationsPage /></Lazy>} />
            <Route path="account" element={<Lazy><StudentAccountPage /></Lazy>} />

            {/* Compatibility alias */}
            <Route path="dashboard" element={<Navigate to="/student/overview" replace />} />
          </Route>
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<Lazy><ForbiddenPage /></Lazy>} />
      <Route path="/500" element={<Lazy><ServerErrorPage /></Lazy>} />
      <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
    </Route>
  )
);