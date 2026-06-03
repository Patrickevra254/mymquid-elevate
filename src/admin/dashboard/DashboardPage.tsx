import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "../auth/useAuthStore";
import { dashboardApi, blogApi } from "../mock/api";
import type { DashboardStats, ActivityEvent, ChartDataPoint, BlogPost } from "../types";
import { OverviewCards } from "./components/OverviewCards";
import { RecentActivity } from "./components/RecentActivity";
import { QuickActions } from "./components/QuickActions";
import { PostsChart } from "./components/PostsChart";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";

function activityFromPosts(posts: BlogPost[]): ActivityEvent[] {
  return [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      type: post.status === "published" ? "publish" : post.status === "scheduled" ? "edit" : "draft",
      message:
        post.status === "published"
          ? `Post published: "${post.title}"`
          : post.status === "scheduled"
          ? `Post scheduled: "${post.title}"`
          : `Draft saved: "${post.title}"`,
      time: formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true }),
      createdAt: post.updatedAt,
    }));
}

function chartFromPosts(posts: BlogPost[]): ChartDataPoint[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return {
      date: dateStr,
      posts: posts.filter((p) => p.createdAt.slice(0, 10) === dateStr).length,
    };
  });
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, activityRes, chartRes, postsRes] = await Promise.allSettled([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(),
        dashboardApi.getChartData(),
        blogApi.getAll({}),
      ]);

      const posts = postsRes.status === "fulfilled" ? postsRes.value : [];

      if (statsRes.status === "fulfilled") {
        const s = statsRes.value as Record<string, number>;
        setStats({
          totalPosts: s.totalPosts ?? s.total ?? posts.length,
          published:  s.published  ?? posts.filter(p => p.status === "published").length,
          drafts:     s.drafts     ?? posts.filter(p => p.status === "draft").length,
          scheduled:  s.scheduled  ?? posts.filter(p => p.status === "scheduled").length,
        });
      }

      const apiActivity = activityRes.status === "fulfilled" ? activityRes.value : [];
      const resolvedActivity = (apiActivity.length > 0 ? apiActivity : activityFromPosts(posts)).slice(0, 5);
      setActivity(resolvedActivity);

      const apiChart = chartRes.status === "fulfilled" ? chartRes.value : [];
      setChartData(apiChart.length > 0 ? apiChart : chartFromPosts(posts));

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <SkeletonLoader rows={8} />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {user?.name.split(" ")[0] || "there"}</h1>
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
