import { FileText, CheckCircle, Edit, Clock } from "lucide-react";
import { StatCard } from "../../shared/components/StatCard";
import type { DashboardStats } from "../../types";

type Props = { stats: DashboardStats };

export function OverviewCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Posts" value={stats.totalPosts} icon={FileText} trend="All time" />
      <StatCard label="Published" value={stats.published} icon={CheckCircle} trend="Live now" />
      <StatCard label="Drafts" value={stats.drafts} icon={Edit} trend="In progress" />
      <StatCard label="Scheduled" value={stats.scheduled} icon={Clock} trend="Upcoming" />
    </div>
  );
}
