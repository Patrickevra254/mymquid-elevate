import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { blogApi } from "@/admin/mock/api";
import type { BlogPost } from "@/admin/types";

const PAGE_SIZE = 9;

function toCard(post: BlogPost) {
  const excerpt =
    post.seo?.metaDescription ||
    (post as unknown as Record<string, string>).metaDescription ||
    "Read more…";
  return {
    tag: post.category || post.tags?.[0] || "Blog",
    title: post.title,
    excerpt,
    date: format(new Date(post.createdAt), "MMM d, yyyy"),
    slug: post.slug,
    id: post.id,
  };
}

export default function BlogAll() {
  useDocumentMeta({
    title: "All Posts — Mquid Blog",
    description: "Browse all published posts from Mquid.",
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi
      .getPublic()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const paginated = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Blog
          </Link>
          <h1 className="text-4xl font-medium tracking-tighter">All Posts</h1>
          <p className="text-muted-foreground mt-1 text-sm">({posts.length} posts)</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="card-elevated rounded-3xl p-7 animate-pulse space-y-3">
                <div className="h-3 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded w-4/5 mt-4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/5" />
                <div className="h-3 bg-muted rounded w-20 mt-3" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <p className="text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((p) => {
              const card = toCard(p);
              return (
                <Link key={card.id} to={`/blog/${card.slug}`} className="group card-elevated rounded-3xl p-7 flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-primary">{card.tag}</span>
                  <h3 className="mt-4 text-lg font-medium group-hover:text-primary transition">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.excerpt}</p>
                  <div className="mt-5 text-xs text-muted-foreground">
                    <span>{card.date}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full hover:bg-accent disabled:opacity-40 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-full hover:bg-accent disabled:opacity-40 transition"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
