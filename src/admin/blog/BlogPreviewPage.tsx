import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { BlogStatusBadge } from "./components/BlogStatusBadge";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { blogApi } from "../mock/api";
import type { BlogPost } from "../types";

export default function BlogPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { navigate("/admin/blog"); return; }
    blogApi.getById(id).then((p) => {
      if (!p) { navigate("/admin/blog"); return; }
      setPost(p);
      setLoading(false);
    }).catch(() => navigate("/admin/blog"));
  }, [id, navigate]);

  if (loading) return <SkeletonLoader rows={8} />;
  if (!post) return null;

  let htmlContent = "";
  try {
    const json = JSON.parse(post.content);
    htmlContent = generateHTML(json, [StarterKit, Image, TiptapLink]);
  } catch {
    htmlContent = `<p>${post.content}</p>`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blog"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <Button size="sm" onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
          <Edit className="mr-1.5 h-4 w-4" /> Edit Post
        </Button>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <BlogStatusBadge status={post.status} />
          <span className="text-sm text-muted-foreground">
            {format(new Date(post.updatedAt), "MMMM d, yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">by {post.author.name}</span>
        </div>

        <h1 className="text-3xl font-bold">{post.title}</h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
