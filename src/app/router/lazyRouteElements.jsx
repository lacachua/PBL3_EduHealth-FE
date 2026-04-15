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
export const AdminSettingsPage = React.lazy(() => import('../../features/dashboard/admin/pages/AdminSettingsPage'));
export const NurseDashboardPage = React.lazy(() => import('../../features/dashboard/nurse/pages/NurseDashboardPage'));
export const ModulePlaceholderPage = React.lazy(() => import("../../features/nurse/components/ModulePlaceholderPage"));
export const NurseProfilePage = React.lazy(() => import('../../features/nurse/pages/NurseProfilePage'));
export const NurseStudentsPage = React.lazy(() => import("../../features/nurse/pages/NurseStudentsPage"));
export const NurseHealthProfilesPage = React.lazy(() => import("../../features/nurse/pages/NurseHealthProfilesPage"));
export const NurseHealthProfileDetailPage = React.lazy(() => import("../../features/nurse/pages/NurseHealthProfileDetailPage"));
export const NurseMedicinesPage = React.lazy(() => import("../../features/nurse/pages/NurseMedicinesPage"));
export const NurseVaccinationCampaignsPage = React.lazy(() => import("../../features/vaccinations/pages/NurseVaccinationCampaignsPage"));
export const NurseVaccinationCampaignDetailPage = React.lazy(() => import("../../features/vaccinations/pages/NurseVaccinationCampaignDetailPage"));
export const NursePendingVaccinationsPage = React.lazy(() => import("../../features/vaccinations/pages/NursePendingVaccinationsPage"));
export const ExaminationLandingPage = React.lazy(() => import("../../features/examinations/pages/ExaminationLandingPage"));
export const CreateExaminationPage = React.lazy(() => import("../../features/examinations/pages/CreateExaminationPage"));
export const ExaminationDetailPage = React.lazy(() => import("../../features/examinations/pages/ExaminationDetailPage"));
export const StudentOverviewPage = React.lazy(() => import('../../features/student/pages/StudentOverviewPage'));
export const StudentCareHistoryPage = React.lazy(() => import('../../features/student/pages/StudentCareHistoryPage'));
export const StudentVaccinationsPage = React.lazy(() => import('../../features/student/pages/StudentVaccinationsPage'));
export const StudentAccountPage = React.lazy(() => import('../../features/student/pages/StudentAccountPage'));
export const StudentManagementPage = React.lazy(() => import("../../features/students/pages/StudentManagementPage"));
export const UserManagementPage = React.lazy(() => import("../../features/users/pages/UserManagementPage"));
export const CatalogManagementPage = React.lazy(() => import("../../features/catalogs/pages/CatalogManagementPage"));
export const MedicinesPage = React.lazy(() => import("../../features/medicines/pages/MedicinesPage"));
export const ReportsPage = React.lazy(() => import("../../features/reports/pages/ReportsPage"));
export const SystemLogsPage = React.lazy(() => import("../../features/system-logs/pages/SystemLogsPage"));