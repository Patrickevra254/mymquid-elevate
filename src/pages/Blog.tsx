import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { blogApi } from "@/admin/mock/api";
import type { BlogPost } from "@/admin/types";

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
  };
}

export default function Blog() {
  useDocumentMeta({
    title: "Blog — Mquid",
    description: "Field notes, post-mortems and reference architectures from Mquid's engineering and security teams.",
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    blogApi.getPublic().then(setPosts).catch(console.error);
  }, []);

  const [featurePost, ...allRest] = posts;
  const restPosts = allRest.slice(0, 3);
  const feature = featurePost ? toCard(featurePost) : null;

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Blog</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">Field notes from</span><br/>
            <span className="font-display italic text-primary">the operating layer.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Deep dives, post-mortems and reference architectures from our engineering, security and ops teams.
          </p>
        </motion.div>

        {feature && (
          <Link to={`/blog/${feature.slug}`} className="group mt-14 block card-elevated rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto bg-gradient-to-br from-primary/30 via-accent/20 to-transparent">
                <div className="absolute inset-0 grid-pattern opacity-40" />
                <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Featured
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-widest text-primary">{feature.tag}</span>
                <h2 className="mt-3 text-3xl font-medium tracking-tight group-hover:text-primary transition">{feature.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{feature.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{feature.date}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {restPosts.length > 0 && (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restPosts.map((p) => {
              const card = toCard(p);
              return (
                <Link key={p.id} to={`/blog/${card.slug}`} className="group card-elevated rounded-3xl p-7 flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-primary">{card.tag}</span>
                  <h3 className="mt-4 text-lg font-medium group-hover:text-primary transition">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{card.date}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {posts.length > 4 && (
          <div className="mt-10 text-center">
            <Link
              to="/blog/all"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow"
            >
              View all posts <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Subscribe to the changelog.</h3>
            <p className="text-muted-foreground mt-2">One email a month. Engineering essays, no fluff.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Subscribe <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
