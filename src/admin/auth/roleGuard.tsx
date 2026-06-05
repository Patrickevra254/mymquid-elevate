import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import type { AdminRole } from "../types";

type Props = { allowedRoles: AdminRole[] };

export function RoleGuard({ allowedRoles }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
}
