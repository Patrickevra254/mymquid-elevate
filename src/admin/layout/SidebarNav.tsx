import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "./useUIStore";
import { useAuthStore } from "../auth/useAuthStore";

export function SidebarNav() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const user = useAuthStore((s) => s.user);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/blog", icon: FileText, label: "Blog" },
    ...(user?.role === "super_admin"
      ? [{ to: "/admin/users", icon: Users, label: "Users" }]
      : []),
    { to: "/admin/notifications", icon: Bell, label: "Notifications" },
    { to: "/admin/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
