import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/useAuthStore";
import { dashboardApi } from "../mock/api";
import type { DashboardStats, ActivityEvent, ChartDataPoint } from "../types";
import { OverviewCards } from "./components/OverviewCards";
import { RecentActivity } from "./components/RecentActivity";
import { QuickActions } from "./components/QuickActions";
import { PostsChart } from "./components/PostsChart";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getRecentActivity(),
      dashboardApi.getChartData(),
    ]).then(([s, a, c]) => {
      setStats(s);
      setActivity(a);
      setChartData(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <SkeletonLoader rows={8} />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {user?.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your content today.
        </p>
      </div>

      {stats && <OverviewCards stats={stats} />}

      <PostsChart data={chartData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity events={activity} />
        <QuickActions />
      </div>
    </div>
  );
}
