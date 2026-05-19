import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  blog: "Blog",
  create: "Create Post",
  edit: "Edit Post",
  preview: "Preview",
  notifications: "Notifications",
  profile: "Profile",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {parts.map((part, i) => {
        const to = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        const label = labelMap[part] ?? part;

        return (
          <span key={to} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={to} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
