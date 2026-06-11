import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Eye, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ModerationBadge } from "./ModerationBadge";
import { moderationApi } from "../../mock/api";
import type { BlogPost, ModerationStatus } from "../../types";

const FILTERS: { label: string; value: string }[] = [
  { label: "All",      value: "all" },
  { label: "Pending",  value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export function ModerationTab() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState<BlogPost | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const load = async (status: string) => {
    setIsLoading(true);
    try {
      const data = await moderationApi.getPosts(status);
      setPosts(data);
    } catch {
      toast.error("Failed to load moderation queue.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const handleApprove = async (post: BlogPost) => {
    setActionLoading(post.id);
    try {
      await moderationApi.approve(post.id);
      toast.success(`"${post.title}" approved.`);
      await load(filter);
    } catch {
      toast.error("Failed to approve post.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await moderationApi.reject(rejectTarget.id, rejectReason || undefined);
      toast.success(`"${rejectTarget.title}" rejected.`);
      setRejectTarget(null);
      setRejectReason("");
      await load(filter);
    } catch {
      toast.error("Failed to reject post.");
    } finally {
      setRejectLoading(false);
    }
  };

  const moderationStatus = (post: BlogPost) =>
    (post.moderationStatus ?? "pending") as ModerationStatus;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
          No posts in this queue.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{post.title}</span>
                  <ModerationBadge status={moderationStatus(post)} />
                </div>
                <p className="text-xs text-muted-foreground">
                  by {post.author?.name ?? "Unknown"} ·{" "}
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
                {moderationStatus(post) === "rejected" && post.rejectionReason && (
                  <p className="text-xs text-destructive">{post.rejectionReason}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/blog/preview/${post.id}`)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                  disabled={actionLoading === post.id}
                  onClick={() => handleApprove(post)}
                >
                  {actionLoading === post.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <><Check className="h-3.5 w-3.5 mr-1.5" /> Approve</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  disabled={actionLoading === post.id}
                  onClick={() => { setRejectTarget(post); setRejectReason(""); }}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject post</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Rejecting <span className="font-medium text-foreground">"{rejectTarget?.title}"</span>.
              You can optionally provide a reason.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="reject-reason">Reason (optional)</Label>
              <Textarea
                id="reject-reason"
                placeholder="Content doesn't meet guidelines…"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" disabled={rejectLoading} onClick={handleRejectSubmit}>
              {rejectLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
