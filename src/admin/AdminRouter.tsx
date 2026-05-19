import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./auth/authGuard";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./auth/ResetPasswordPage"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));
const BlogListPage = lazy(() => import("./blog/BlogListPage"));
const BlogEditorPage = lazy(() => import("./blog/BlogEditorPage"));
const BlogPreviewPage = lazy(() => import("./blog/BlogPreviewPage"));
const NotificationsPage = lazy(() => import("./notifications/NotificationsPage"));
const ProfilePage = lazy(() => import("./profile/ProfilePage"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function AdminRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/create" element={<BlogEditorPage />} />
            <Route path="blog/edit/:id" element={<BlogEditorPage />} />
            <Route path="blog/preview/:id" element={<BlogPreviewPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
