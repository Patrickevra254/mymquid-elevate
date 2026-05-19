import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
