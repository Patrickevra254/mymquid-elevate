import { CheckCircle, FileText, Clock, LogIn } from "lucide-react";
import { format } from "date-fns";
import { StatCard } from "../../shared/components/StatCard";
import type { UserWithStats } from "../../types";

type Props = { user: UserWithStats };

export function UserStatCards({ user }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Published"
        value={user.stats.published}
        icon={CheckCircle}
      />
      <StatCard
        label="Drafts"
        value={user.stats.drafts}
        icon={FileText}
      />
      <StatCard
        label="Scheduled"
        value={user.stats.scheduled}
        icon={Clock}
      />
      <StatCard
        label="Last Login"
        value={format(new Date(user.lastLogin), "MMM d, yyyy")}
        icon={LogIn}
      />
    </div>
  );
}
