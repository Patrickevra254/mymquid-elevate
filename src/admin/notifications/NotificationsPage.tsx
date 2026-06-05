import { useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../shared/components/PageHeader";
import { EmptyState } from "../shared/components/EmptyState";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { useNotificationStore } from "./useNotificationStore";
import { cn } from "@/lib/utils";

const typeStyles: Record<"success" | "warning" | "error" | "info", string> = {
  success: "border-l-green-500",
  warning: "border-l-yellow-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
};

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) return <SkeletonLoader rows={5} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        description="Stay updated on your content activity"
        action={
          notifications.some((n) => !n.read) ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border-l-4 bg-card p-4 cursor-pointer transition-opacity",
                typeStyles[n.type],
                n.read && "opacity-60"
              )}
            >
              <div className="flex-1">
                <p className={cn("text-sm font-medium", !n.read && "font-semibold")}>
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : "unknown time"}
                </p>
              </div>
              {!n.read && (
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
