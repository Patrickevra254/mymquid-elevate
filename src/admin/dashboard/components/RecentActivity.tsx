import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Edit, LogIn, Trash, FileText } from "lucide-react";
import type { ActivityEvent } from "../../types";

const iconMap = {
  publish: CheckCircle,
  draft: Edit,
  login: LogIn,
  delete: Trash,
  edit: FileText,
};

const colorMap = {
  publish: "text-green-500",
  draft: "text-yellow-500",
  login: "text-blue-500",
  delete: "text-red-500",
  edit: "text-purple-500",
};

type Props = { events: ActivityEvent[] };

export function RecentActivity({ events }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {events.map((event) => {
          const Icon = iconMap[event.type];
          const color = colorMap[event.type];
          return (
            <li key={event.id} className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
