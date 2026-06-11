import { useNavigate } from "react-router-dom";
import { Edit, Trash, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../shared/components/DataTable";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { ModerationBadge } from "./ModerationBadge";
import type { BlogPost } from "../../types";
import { useAuthStore } from "../../auth/useAuthStore";

type Props = {
  posts: BlogPost[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

export function BlogTable({ posts, isLoading, onDelete }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === "super_admin";

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (post: BlogPost) => (
        <div>
          <span className="font-medium line-clamp-1">{post.title}</span>
          {post.moderationStatus === "rejected" && post.rejectionReason && (
            <p className="text-xs text-destructive mt-0.5 line-clamp-1">{post.rejectionReason}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (post: BlogPost) => (
        <div className="flex flex-col gap-1">
          <BlogStatusBadge status={post.status} />
          {post.moderationStatus && <ModerationBadge status={post.moderationStatus} />}
        </div>
      ),
      className: "w-40",
    },
    {
      key: "category",
      header: "Category",
      render: (post: BlogPost) => (
        <span className="text-muted-foreground">{post.category}</span>
      ),
      className: "hidden md:table-cell w-40",
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (post: BlogPost) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(post.updatedAt), "MMM d, yyyy")}
        </span>
      ),
      className: "hidden lg:table-cell w-36",
    },
    {
      key: "actions",
      header: "",
      render: (post: BlogPost) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Preview"
            aria-label={`Preview "${post.title}"`}
            onClick={() => navigate(`/admin/blog/preview/${post.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Edit"
            aria-label={`Edit "${post.title}"`}
            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              aria-label={`Delete "${post.title}"`}
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(post.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={posts}
      rowKey="id"
      isLoading={isLoading}
      emptyMessage="No posts found. Try adjusting your filters."
    />
  );
}
