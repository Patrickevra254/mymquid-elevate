import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "./useUIStore";
import { SidebarNav } from "./SidebarNav";
import logo from "@/assets/mquid-logo.png";

export function Sidebar() {
  const { sidebarCollapsed, sidebarOpen, toggleCollapsed, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full flex-col border-r bg-card transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "flex" : "hidden lg:flex"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <Link to="/admin/dashboard">
              <img src={logo} alt="Mquid" className="h-7 w-auto" />
            </Link>
          )}
          <button
            onClick={toggleCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto rounded-md p-1.5 hover:bg-accent"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <SidebarNav />

        {/* Footer label */}
        {!sidebarCollapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">Admin Panel v1.0</p>
          </div>
        )}
      </aside>
    </>
  );
}
