# Public Blog Enhancements — Design Spec

**Date:** 2026-05-29  
**Status:** Approved

---

## Goal

Extend the public-facing blog with a detail page, an all-posts page, and an updated landing page layout. Add featured image upload to the admin editor. Defer post-publish notifications to the backend.

---

## Routing

| Route | Component | Description |
|---|---|---|
| `/blog` | `Blog.tsx` (updated) | Featured post + 3 recent + "View all" button |
| `/blog/all` | `BlogAll.tsx` (new) | Paginated grid of all published posts |
| `/blog/:slug` | `BlogPost.tsx` (new) | Full detail page for a single post |

All three routes added to `src/App.tsx` using lazy imports consistent with existing pattern.

---

## Feature 1 — Blog Detail Page (`/blog/:slug`)

**File:** `src/pages/BlogPost.tsx`

**Data fetching:**
- On mount, calls `blogApi.getPublic()` and finds the post where `post.slug === slug` from `useParams()`
- If no match found, redirects to `/blog`
- Loading state: full-page skeleton (reuse `SkeletonLoader` from admin or a simple spinner)

**Layout — two column (`lg:grid-cols-3`):**

Left column (`lg:col-span-2`):
- Category tag (small uppercase label, primary colour)
- `h1` title (large, tracking-tight)
- Author name + formatted date line (`format(createdAt, "MMM d, yyyy")`)
- Full post body rendered with `generateHTML` from `@tiptap/core` using `StarterKit` and `TiptapLink` extensions (same as `BlogPreviewPage`)

Right column (`lg:col-span-1`):
- Sticky card containing:
  - Author name
  - Published date
  - Category chip
  - Tags as small chips
  - `← Back to Blog` link to `/blog`

Featured image:
- If `post.featuredImage` is present: full-width image banner above both columns
- If absent: full-width gradient placeholder (`bg-gradient-to-br from-primary/30 via-accent/20 to-transparent`) with grid-pattern overlay — same style as the existing featured card on `/blog`

**Blog card links (Blog.tsx and BlogAll.tsx):** All `<a href="#">` replaced with `<Link to={/blog/${post.slug}}>`.

---

## Feature 2 — Featured Image Upload in Editor

**File:** `src/admin/blog/BlogEditorPage.tsx`

**Form field:** `featuredImage` already exists as `featuredImage?: string` in `BlogPost` type. No Zod schema change needed (stays optional).

**UI — new card in right settings sidebar, below Category/Tags:**

```
[ Featured Image ]
[ Upload Image button (file input, accept="image/*") ]
```

- Clicking the button opens the OS file picker
- On file select:
  1. Set local `imageUploading` state to `true`
  2. Call `uploadApi.upload(file, 'blog-image')`
  3. On success: call `setValue('featuredImage', url)`; set `imageUploading` to `false`
  4. On error: `toast.error('Image upload failed.')` ; set `imageUploading` to `false`
- While uploading: show `<Loader2 className="animate-spin" />` + "Uploading…" text in place of button
- After upload: show thumbnail (`<img src={featuredImage} />`) + "×" remove button that calls `setValue('featuredImage', undefined)`
- Edit mode pre-load: if `post.featuredImage` exists when loading the post, call `setValue('featuredImage', post.featuredImage)` alongside the other fields already set

**State:** One new local state variable `const [imageUploading, setImageUploading] = useState(false)`.

---

## Feature 3 — Main Blog Page Update (`/blog`)

**File:** `src/pages/Blog.tsx`

- Fetch all posts from `blogApi.getPublic()`
- Slice: `const [feature, ...rest] = posts` — use only `rest.slice(0, 3)` for the grid
- Each card `<a href="#">` → `<Link to={/blog/${post.slug}}>`
- Featured hero card `<a href="#">` → `<Link to={/blog/${feature.slug}}>`
- Show "View all posts →" `<Link to="/blog/all">` button below the grid **only if** `posts.length > 4`

---

## Feature 4 — All Posts Page (`/blog/all`)

**File:** `src/pages/BlogAll.tsx`

**Data:** Fetches `blogApi.getPublic()` on mount.

**Layout:**
- Back link: `← Blog` linking to `/blog`
- Heading: "All Posts" with post count `({posts.length} posts)`
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Each card: same design as the grid cards in `Blog.tsx`, linked to `/blog/:slug`
- Client-side pagination: 9 posts per page
  - Previous / Next buttons
  - Page indicator: "Page 1 of N"
  - Hide pagination if total posts ≤ 9

---

## Feature 5 — Post-Publish Notifications

**Decision:** Deferred to backend. The NestJS API has no `POST /notifications` endpoint. The backend developer should emit a notification server-side when a post's status is set to `"published"`. No frontend changes needed for this feature.

---

## Files Changed

| File | Change |
|---|---|
| `src/App.tsx` | Add `/blog/:slug` and `/blog/all` lazy routes |
| `src/pages/Blog.tsx` | Limit to 4 posts, add "View all" link, fix card links to use `<Link>` |
| `src/pages/BlogPost.tsx` | **New** — public detail page |
| `src/pages/BlogAll.tsx` | **New** — all posts paginated grid |
| `src/admin/blog/BlogEditorPage.tsx` | Add featured image upload card to sidebar |

---

## Out of Scope

- Backend notification endpoint (flagged to backend developer)
- Search/filter on `/blog/all` (can be added later)
- Comments or social sharing on the detail page
