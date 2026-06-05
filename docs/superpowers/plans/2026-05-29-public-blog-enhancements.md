# Public Blog Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public blog detail page (`/blog/:slug`), an all-posts page (`/blog/all`), limit the main blog page to 4 posts with a "View all" link, and add optional featured image upload to the admin editor.

**Architecture:** Three new/updated public pages consume `blogApi.getPublic()` from `src/admin/mock/api.ts`. The admin editor gains an image upload card that calls `uploadApi.upload()`. All routes are added to `src/App.tsx`. No backend changes required.

**Tech Stack:** React 19, React Router DOM 7, Tiptap (`@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`), date-fns, Vitest + React Testing Library, Tailwind CSS v4, shadcn/ui

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/pages/BlogPost.tsx` | **Create** | Public detail page for a single post (slug-based) |
| `src/pages/BlogAll.tsx` | **Create** | All published posts, paginated grid |
| `src/pages/__tests__/BlogPost.test.tsx` | **Create** | Component tests for BlogPost |
| `src/pages/__tests__/BlogAll.test.tsx` | **Create** | Component tests for BlogAll |
| `src/pages/Blog.tsx` | **Modify** | Limit to 4 posts, fix links, add "View all" button |
| `src/App.tsx` | **Modify** | Register `/blog/:slug` and `/blog/all` routes |
| `src/admin/blog/BlogEditorPage.tsx` | **Modify** | Add featured image upload card to sidebar |

---

## Task 1: Update Blog.tsx — limit posts, fix links, add "View all"

**Files:**
- Modify: `src/pages/Blog.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/__tests__/Blog.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "../Blog";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

beforeEach(() => vi.clearAllMocks());

describe("Blog", () => {
  it("shows at most 4 posts (1 featured + 3 grid)", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS);
    render(<MemoryRouter><Blog /></MemoryRouter>);
    // Featured post title appears
    await screen.findByText(MOCK_POSTS[0].title);
    // Only posts 1-3 appear in the grid (post 0 is featured, posts 4+ are hidden)
    expect(screen.queryByText(MOCK_POSTS[4].title)).not.toBeInTheDocument();
  });

  it("shows 'View all' link when more than 4 posts exist", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS); // 10 posts
    render(<MemoryRouter><Blog /></MemoryRouter>);
    await screen.findByText(MOCK_POSTS[0].title);
    expect(screen.getByRole("link", { name: /view all/i })).toBeInTheDocument();
  });

  it("hides 'View all' link when 4 or fewer posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS.slice(0, 4));
    render(<MemoryRouter><Blog /></MemoryRouter>);
    await screen.findByText(MOCK_POSTS[0].title);
    expect(screen.queryByRole("link", { name: /view all/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/__tests__/Blog.test.tsx
```

Expected: FAIL (Blog still shows all posts and has `<a href="#">`)

- [ ] **Step 3: Update Blog.tsx**

Replace the full content of `src/pages/Blog.tsx` with:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/pages/__tests__/Blog.test.tsx
```

Expected: 3/3 PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Blog.tsx src/pages/__tests__/Blog.test.tsx
git commit -m "feat(blog): limit homepage to 4 posts, add view-all link and slug navigation"
```

---

## Task 2: Create BlogAll.tsx — all posts paginated grid

**Files:**
- Create: `src/pages/BlogAll.tsx`
- Create: `src/pages/__tests__/BlogAll.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/__tests__/BlogAll.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BlogAll from "../BlogAll";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

beforeEach(() => vi.clearAllMocks());

const published = MOCK_POSTS.filter((p) => p.status === "published");

describe("BlogAll", () => {
  it("renders all post titles and shows count", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(published[0].title);
    expect(screen.getByText(`${published.length} posts`)).toBeInTheDocument();
  });

  it("shows empty state when no posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce([]);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(/no posts published yet/i);
  });

  it("hides pagination when 9 or fewer posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published); // 5 published posts
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(published[0].title);
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
  });

  it("shows pagination and navigates when more than 9 posts", async () => {
    // Generate 10 published posts
    const tenPosts = Array.from({ length: 10 }, (_, i) => ({
      ...MOCK_POSTS[0],
      id: String(i),
      slug: `post-${i}`,
      title: `Post ${i}`,
    }));
    mockApi.getPublic.mockResolvedValueOnce(tenPosts);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText("Post 0");
    expect(screen.queryByText("Post 9")).not.toBeInTheDocument(); // page 2
    const nextBtn = screen.getByLabelText("Next page");
    await userEvent.click(nextBtn);
    expect(screen.getByText("Post 9")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/__tests__/BlogAll.test.tsx
```

Expected: FAIL (`BlogAll` does not exist yet)

- [ ] **Step 3: Create BlogAll.tsx**

Create `src/pages/BlogAll.tsx`:

```tsx
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

  useEffect(() => {
    blogApi.getPublic().then(setPosts).catch(console.error);
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
            <ArrowLeft className="h-4 w-4" /> Blog
          </Link>
          <h1 className="text-4xl font-medium tracking-tighter">All Posts</h1>
          <p className="text-muted-foreground mt-1 text-sm">{posts.length} posts</p>
        </div>

        {paginated.length === 0 ? (
          <p className="text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/pages/__tests__/BlogAll.test.tsx
```

Expected: 4/4 PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogAll.tsx src/pages/__tests__/BlogAll.test.tsx
git commit -m "feat(blog): add all-posts page with pagination"
```

---

## Task 3: Create BlogPost.tsx — public detail page

**Files:**
- Create: `src/pages/BlogPost.tsx`
- Create: `src/pages/__tests__/BlogPost.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/__tests__/BlogPost.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPost from "../BlogPost";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

const published = MOCK_POSTS.filter((p) => p.status === "published");

const renderWithSlug = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog" element={<div>Blog list</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => vi.clearAllMocks());

describe("BlogPost", () => {
  it("renders the post title when slug matches", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug(published[0].slug);
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(published[0].title)
    );
  });

  it("renders category and author", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug(published[0].slug);
    await screen.findByText(published[0].category);
    await screen.findByText(published[0].author.name);
  });

  it("redirects to /blog when slug not found", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug("slug-that-does-not-exist");
    await waitFor(() =>
      expect(screen.getByText("Blog list")).toBeInTheDocument()
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/__tests__/BlogPost.test.tsx
```

Expected: FAIL (`BlogPost` does not exist yet)

- [ ] **Step 3: Create BlogPost.tsx**

Create `src/pages/BlogPost.tsx`:

```tsx
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
        <div className="mx-auto max-w-6xl px-6 py-16 animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-10 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
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
                <ArrowLeft className="h-4 w-4" /> Back to Blog
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/pages/__tests__/BlogPost.test.tsx
```

Expected: 3/3 PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/BlogPost.tsx src/pages/__tests__/BlogPost.test.tsx
git commit -m "feat(blog): add public blog detail page at /blog/:slug"
```

---

## Task 4: Register new routes in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx**

Replace the blog import and routes block in `src/App.tsx`:

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import WhyUs from "@/pages/WhyUs";
import Team from "@/pages/Team";
import Careers from "@/pages/Careers";
import Partners from "@/pages/Partners";
import Blog from "@/pages/Blog";
import BlogAll from "@/pages/BlogAll";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import Industries from "@/pages/Industries";
import NotFound from "@/pages/NotFound";

const AdminRouter = lazy(() => import("@/admin/AdminRouter"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/why-us" element={<WhyUs />} />
      <Route path="/team" element={<Team />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/all" element={<BlogAll />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />
      <Route path="/industries" element={<Industries />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRouter />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

> **Important:** `/blog/all` must be registered **before** `/blog/:slug`, otherwise React Router will match "all" as a slug parameter.

- [ ] **Step 2: Run all tests to verify nothing broke**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(blog): register /blog/all and /blog/:slug routes"
```

---

## Task 5: Add featured image upload to BlogEditorPage

**Files:**
- Modify: `src/admin/blog/BlogEditorPage.tsx`

- [ ] **Step 1: Add `featuredImage` to the Zod schema**

In `src/admin/blog/BlogEditorPage.tsx`, update the schema object (around line 26) to add `featuredImage`:

```ts
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published", "scheduled"]),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  scheduledAt: z.string().optional(),
  featuredImage: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().max(60, "Meta title must be 60 characters or fewer"),
    metaDescription: z.string().max(160, "Meta description must be 160 characters or fewer"),
    ogImage: z.string().optional(),
  }),
});
```

- [ ] **Step 2: Add `featuredImage` to defaultValues**

In the `useForm` call (around line 71), add `featuredImage` to defaultValues:

```ts
defaultValues: {
  title: "",
  slug: "",
  content: "",
  status: "draft",
  category: "",
  tags: [],
  scheduledAt: "",
  featuredImage: "",
  seo: { metaTitle: "", metaDescription: "" },
},
```

- [ ] **Step 3: Update `buildPost` to pass `featuredImage` through**

Replace the `buildPost` function (around line 114):

```ts
const buildPost = (data: FormValues): BlogPost => ({
  id: id ?? "",
  ...data,
  status: data.status as BlogStatus,
  featuredImage: data.featuredImage || undefined,
  createdAt: originalCreatedAt.current ?? new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: user?.id ?? "1", name: user?.name ?? "Admin" },
});
```

- [ ] **Step 4: Load `featuredImage` in edit mode**

In the `useEffect` that loads the post for editing (around line 96), add `setValue("featuredImage", ...)` alongside the existing setValues:

```ts
useEffect(() => {
  if (!isEdit || !id) return;
  blogApi.getById(id).then((post) => {
    if (!post) { navigate("/admin/blog"); return; }
    setValue("title", post.title);
    setValue("slug", post.slug);
    setValue("content", post.content);
    setValue("status", post.status);
    setValue("category", post.category);
    setValue("tags", post.tags);
    setValue("scheduledAt", post.scheduledAt ?? "");
    setValue("featuredImage", post.featuredImage ?? "");
    setValue("seo", post.seo);
    originalCreatedAt.current = post.createdAt;
    setLoading(false);
  }).catch(() => {
    navigate("/admin/blog");
  });
}, [id, isEdit, navigate, setValue]);
```

- [ ] **Step 5: Add imports, state and upload handler**

At the top of the file, update the lucide-react import to include `X` and `ImageIcon`:

```ts
import { ArrowLeft, Loader2, Save, Eye, X, ImageIcon } from "lucide-react";
```

Update the mock/api import to include `uploadApi`:

```ts
import { blogApi, uploadApi } from "../mock/api";
```

Add the `imageUploading` state alongside the existing state declarations (after `const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);`):

```ts
const [imageUploading, setImageUploading] = useState(false);
```

Add the upload handler function after the `buildPost` function:

```ts
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImageUploading(true);
  try {
    const url = await uploadApi.upload(file, "blog-image");
    setValue("featuredImage", url);
  } catch {
    toast.error("Image upload failed.");
  } finally {
    setImageUploading(false);
  }
};
```

- [ ] **Step 6: Add the featured image card to the sidebar**

In the JSX, after the closing `</div>` of the Category/Tags card (the second card in the right sidebar, around line 316), add:

```tsx
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-medium">Featured Image</p>
            {watch("featuredImage") ? (
              <div className="relative">
                <img
                  src={watch("featuredImage")}
                  alt="Featured"
                  className="w-full rounded-md object-cover aspect-video"
                />
                <button
                  type="button"
                  onClick={() => setValue("featuredImage", "")}
                  className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background transition"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : imageUploading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-accent transition">
                <ImageIcon className="h-4 w-4" />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
```

- [ ] **Step 7: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 8: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 9: Commit**

```bash
git add src/admin/blog/BlogEditorPage.tsx
git commit -m "feat(admin): add optional featured image upload to blog editor"
```

---

## Task 6: Final check and push

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Push branch**

```bash
git push origin feature/admin-dashboard-phase1
```
