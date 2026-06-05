import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { blogApi } from "@/admin/mock/api";
import type { BlogPost as BlogPostType } from "@/admin/types";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: post ? `${post.title} — Mquid` : "Blog — Mquid",
    description:
      post?.seo?.metaDescription ||
      (post as unknown as Record<string, string> | null)?.metaDescription ||
      "",
  });

  useEffect(() => {
    blogApi
      .getPublic()
      .then((posts) => {
        const found = posts.find((p) => p.slug === slug);
        if (!found) { navigate("/blog"); return; }
        setPost(found);
      })
      .catch(() => navigate("/blog"))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <Layout>
        {/* Hero skeleton */}
        <div className="w-full h-48 sm:h-64 bg-muted animate-pulse" />
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12 animate-pulse">
            {/* Article skeleton */}
            <div className="lg:col-span-2 space-y-5">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-9 bg-muted rounded w-4/5" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div className="card-elevated rounded-2xl p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-px bg-muted" />
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-14" />
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-14 mt-2" />
                  <div className="h-4 bg-muted rounded w-28" />
                  <div className="h-3 bg-muted rounded w-14 mt-2" />
                  <div className="h-6 bg-muted rounded-full w-20" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) return null;

  const metaDescription =
    post.seo?.metaDescription ||
    (post as unknown as Record<string, string>).metaDescription ||
    "";

  const authorName =
    post.author?.name ||
    (post as unknown as Record<string, string>).authorName ||
    "Mquid Team";

  const tags = post.tags || [];

  let htmlContent = "";
  try {
    const json = JSON.parse(post.content);
    htmlContent = generateHTML(json, [StarterKit, Image, TiptapLink]);
  } catch {
    htmlContent = `<p>${post.content}</p>`;
  }

  return (
    <Layout>
      {/* Hero — featured image or gradient placeholder */}
      {post.featuredImage ? (
        <div className="w-full h-64 sm:h-80 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 sm:h-64 relative bg-gradient-to-br from-primary/30 via-accent/20 to-transparent">
          <div className="absolute inset-0 grid-pattern opacity-40" />
        </div>
      )}

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: article body */}
          <article className="lg:col-span-2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-primary">
              {post.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {authorName} · {format(new Date(post.createdAt), "MMM d, yyyy")}
            </p>
            {metaDescription && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {metaDescription}
              </p>
            )}
            <div
              className="prose prose-sm sm:prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Right: sticky metadata sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 card-elevated rounded-2xl p-6 space-y-5">
              <Link
                to="/blog"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Blog
              </Link>
              <hr className="border-border" />
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Author
                  </p>
                  <p className="font-medium">{authorName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Published
                  </p>
                  <p>{format(new Date(post.createdAt), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Category
                  </p>
                  <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs">
                    {post.category}
                  </span>
                </div>
                {tags.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
