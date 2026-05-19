# Admin Dashboard — Phase 1 Design Spec

**Date:** 2026-05-19
**Project:** MyMquid Elevate
**Phase:** 1 of 2
**Author:** Patrick Evra (C.Izuchukwu@mymquid.com)

---

## Overview

Build a modern full-featured Admin Dashboard for the MyMquid Elevate website. The dashboard lives inside the existing Vite + React app under the `/admin` route prefix — code-split so zero admin code ships to public visitors.

**Phase 1 delivers:** Authentication, Layout, Dashboard Home, Blog Management, Notifications, Profile, and the Mock Data Layer.

**Phase 2 (separate spec):** Content Management, Media Library, User Management, Activity Logs, Settings.

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Dashboard location | Same app, `/admin` prefix | Reuses existing stack, one repo for junior devs, easy NestJS swap later |
| Folder structure | Feature-first | Each module self-contained, intern can work on `blog/` without touching anything else |
| State management | Zustand + TanStack Query | Zustand for UI/auth state, TanStack Query for server data when NestJS is ready |
| Rich text editor | Tiptap | Notion-like UX, React 19 compatible, extensible |
| Auth approach | Mock JWT + localStorage | Identical structure to real JWT — swap one file when NestJS is ready |
| Phasing | Two phases | Ship and test Phase 1 before building Phase 2 |

---

## Tech Stack Additions

| Package | Purpose |
|---|---|
| `zustand` | Auth store, UI store, blog store |
| `@tiptap/react` + extensions | Rich text editor |
| `recharts` | Dashboard charts (already installed) |
| `date-fns` | Date formatting (already installed) |

All other dependencies reuse what is already installed in the project.

---

## Section 1 — Architecture Overview

The dashboard is mounted at `/admin/*` in the existing `App.tsx` router. All admin routes are lazy-loaded via `React.lazy()` and wrapped in an `AdminRouter` component. This keeps the public site bundle completely clean.

```
src/
├── admin/                  ← all dashboard code lives here
│   ├── auth/
│   ├── blog/
│   ├── dashboard/
│   ├── layout/
│   ├── notifications/
│   ├── profile/
│   ├── shared/
│   ├── mock/
│   └── AdminRouter.tsx
├── pages/                  ← existing public site (untouched)
└── components/             ← existing public components (untouched)
```

---

## Section 2 — Routing Structure

### Public routes (no auth required)
```
/admin/login
/admin/forgot-password
/admin/reset-password
```

### Protected routes (auth required)
```
/admin/                       → redirect to /admin/dashboard
/admin/dashboard              → Super Admin + Staff
/admin/blog                   → Super Admin + Staff
/admin/blog/create            → Super Admin + Staff
/admin/blog/edit/:id          → Super Admin + Staff
/admin/notifications          → Super Admin + Staff
/admin/profile                → Super Admin + Staff
```

### Full folder structure

```
src/admin/
├── auth/
│   ├── LoginPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── authGuard.tsx          ← wraps all protected routes
│   ├── roleGuard.tsx          ← checks Super Admin vs Staff
│   └── useAuthStore.ts        ← Zustand: current user, token, login/logout
│
├── blog/
│   ├── BlogListPage.tsx
│   ├── BlogEditorPage.tsx     ← create + edit (same page, detects :id)
│   ├── BlogPreviewPage.tsx
│   ├── useBlogStore.ts        ← Zustand: posts list, current draft
│   ├── components/
│   │   ├── BlogTable.tsx
│   │   ├── TiptapEditor.tsx
│   │   ├── SEOFields.tsx
│   │   ├── BlogStatusBadge.tsx
│   │   └── CategoryTagInput.tsx
│   └── blogMock.ts
│
├── dashboard/
│   ├── DashboardPage.tsx
│   └── components/
│       ├── OverviewCards.tsx
│       ├── RecentActivity.tsx
│       ├── QuickActions.tsx
│       └── PostsChart.tsx
│
├── layout/
│   ├── AdminLayout.tsx        ← wraps all protected pages
│   ├── Sidebar.tsx
│   ├── SidebarNav.tsx         ← nav links with role-based visibility
│   ├── TopNav.tsx
│   ├── Breadcrumbs.tsx
│   └── useUIStore.ts
│
├── notifications/
│   ├── NotificationsPage.tsx
│   └── useNotificationStore.ts
│
├── profile/
│   └── ProfilePage.tsx
│
├── shared/
│   ├── components/
│   │   ├── DataTable.tsx      ← reusable table with pagination + sorting
│   │   ├── ConfirmModal.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── PageHeader.tsx
│   │   └── StatCard.tsx
│   └── hooks/
│       ├── useDebounce.ts
│       └── usePagination.ts
│
├── mock/
│   ├── data.ts                ← all fake data (users, posts, stats, activity)
│   └── api.ts                 ← fake API functions (returns mock data with simulated delay)
│
└── AdminRouter.tsx            ← all /admin routes defined here
```

---

## Section 3 — Authentication System

### Flow
1. User visits `/admin/dashboard` → `authGuard` checks localStorage for token → no token → redirect to `/admin/login`
2. User submits login → mock API validates credentials → stores token + user in localStorage + Zustand
3. Every protected page reads from Zustand → `roleGuard` checks role before rendering
4. Logout clears localStorage + Zustand → redirect to `/admin/login`

### Mock credentials
| Email | Password | Role |
|---|---|---|
| `admin@mymquid.com` | `admin123` | Super Admin |
| `staff@mymquid.com` | `staff123` | Staff |

### Auth store shape
```ts
// src/admin/auth/useAuthStore.ts
{
  user: {
    id: string
    name: string
    email: string
    role: "super_admin" | "staff"
    avatar?: string
  } | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
```

### Role permissions matrix
| Feature | Super Admin | Staff |
|---|---|---|
| View dashboard | ✅ | ✅ |
| Create/edit blog | ✅ | ✅ |
| Publish/unpublish blog | ✅ | ✅ |
| Delete blog post | ✅ | ❌ |
| View notifications | ✅ | ✅ |
| Edit profile | ✅ | ✅ |
| User management (Phase 2) | ✅ | ❌ |
| Site settings (Phase 2) | ✅ | ❌ |

### Auth pages
- **Login** — email + password, "Remember me", forgot password link, Zod validation, error toast on bad credentials
- **Forgot Password** — email input, mock success message ("If this email exists, a reset link was sent")
- **Reset Password** — new password + confirm, Zod validation, redirect to login on success

---

## Section 4 — Layout System

### Shell structure
```
┌─────────────────────────────────────────────────┐
│  TopNav: Logo | Breadcrumbs | Search | Bell | Avatar │
├──────────────┬──────────────────────────────────┤
│   Sidebar    │        Page Content              │
│              │                                  │
│  - Dashboard │   <CurrentPage />                │
│  - Blog      │                                  │
│  - Notif     │                                  │
│  - Profile   │                                  │
│  [Collapse]  │                                  │
└──────────────┴──────────────────────────────────┘
```

### Sidebar behaviour
- **Desktop:** always visible, collapsible to icon-only mode (preference saved in `useUIStore`)
- **Mobile:** hidden by default, slides in as drawer on hamburger click
- Active route highlighted
- Nav links filtered by role

### Top nav contents
- Left: hamburger (mobile) + current page breadcrumb
- Right: global search, notification bell with unread badge, avatar dropdown (Profile, Logout)

### UI store shape
```ts
// src/admin/layout/useUIStore.ts
{
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: "light" | "dark"
  toggleSidebar: () => void
  toggleCollapsed: () => void
  setTheme: (theme: "light" | "dark") => void
}
```

### Dark/light mode
Toggles a `dark` class on `<html>`. Works with Tailwind's `dark:` variants. Persisted in localStorage.

### Sidebar nav links (Phase 1)
| Icon | Label | Route | Roles |
|---|---|---|---|
| LayoutDashboard | Dashboard | `/admin/dashboard` | All |
| FileText | Blog | `/admin/blog` | All |
| Bell | Notifications | `/admin/notifications` | All |
| User | Profile | `/admin/profile` | All |

---

## Section 5 — Dashboard Home

### Page layout
- Greeting with user name
- 4 overview stat cards: Total Posts, Published, Drafts, Scheduled
- Bar chart: Posts published over last 30 days (Recharts)
- Recent activity list (timestamped events)
- Quick actions: "+ New Blog Post" and "View Public Site"

### StatCard component
Reusable across Phase 1 and Phase 2. Props: icon, label, value, trend (e.g. "+3 this week").

### Chart
`BarChart` from Recharts. Mock data of posts-per-day for 30 days. Comment marks where to swap API call.

### Recent activity
Flat list from mock data. Each item: icon, description, relative time via `date-fns`. Events: post published, draft saved, login.

### Quick actions
- **+ New Blog Post** → navigates to `/admin/blog/create`
- **View Public Site** → opens `/` in new tab

---

## Section 6 — Blog Management System

### Blog List Page (`/admin/blog`)
- `DataTable` with columns: Title, Status badge, Category, Date, Actions
- Search input (debounced), filter by Status, filter by Category
- Pagination (10 per page)
- Delete button triggers `ConfirmModal`, hidden for Staff role
- Skeleton loaders on first load
- Empty state when no posts match filters

### Blog Editor Page (`/admin/blog/create` and `/admin/blog/edit/:id`)
Single component, detects `:id` to switch between create and edit mode.

**Left panel (main content):**
- Title input
- Auto-generated slug (editable, sanitised)
- Tiptap rich text editor (bold, italic, headings H1–H3, lists, links, images, code blocks, blockquotes)
- SEO section: meta title, meta description, OG image

**Right panel (sidebar):**
- Status selector: Draft / Published / Scheduled
- Category selector
- Tag input (add/remove tags)
- Featured image upload (mock base64, marked for S3/NestJS swap)
- Schedule date/time picker (shown when Scheduled is selected)
- Save Draft button
- Preview button
- Publish dropdown (Publish Now / Schedule)

**Key behaviours:**
- Slug auto-generates from title (`My Post Title` → `my-post-title`), user can override
- Zod + React Hook Form validation on all fields
- "Save Draft" saves without changing status, success toast
- Unsaved changes prompt if navigating away with dirty form
- Featured image mock-uploads locally (base64), clearly commented for real upload later

### Blog store shape
```ts
// src/admin/blog/useBlogStore.ts
{
  posts: BlogPost[]
  currentPost: BlogPost | null
  isLoading: boolean
  filters: { status: string; category: string; search: string }
  setCurrentPost: (post: BlogPost | null) => void
  savePost: (post: BlogPost) => Promise<void>
  deletePost: (id: string) => Promise<void>
  setFilters: (filters: Partial<filters>) => void
}
```

### BlogPost type
```ts
type BlogPost = {
  id: string
  title: string
  slug: string
  content: string           // Tiptap JSON string
  status: "draft" | "published" | "scheduled"
  category: string
  tags: string[]
  featuredImage?: string
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage?: string
  }
  scheduledAt?: Date
  createdAt: Date
  updatedAt: Date
  author: { id: string; name: string }
}
```

---

## Section 7 — Mock Data Layer & API Structure

### Golden rule
Every component calls `mock/api.ts`. When NestJS is ready, replace `mock/api.ts` with real axios calls — zero changes needed elsewhere.

### api.ts structure
```ts
// src/admin/mock/api.ts
const delay = (ms = 400) => new Promise(res => setTimeout(res, ms))

export const authApi = {
  login:  (email, password) => delay().then(() => mockLogin(email, password)),
  logout: ()                => delay().then(() => mockLogout()),
}

export const blogApi = {
  getAll:  (filters) => delay().then(() => filterMockPosts(filters)),
  getById: (id)      => delay().then(() => findMockPost(id)),
  save:    (post)    => delay().then(() => saveMockPost(post)),
  delete:  (id)      => delay().then(() => deleteMockPost(id)),
}

export const dashboardApi = {
  getStats:          () => delay().then(() => mockStats),
  getRecentActivity: () => delay().then(() => mockActivity),
  getChartData:      () => delay().then(() => mockChartData),
}
```

### data.ts contents
- `mockUsers` — 2 users (Super Admin + Staff) with credentials
- `mockPosts` — 10 blog posts across all statuses for realistic pagination
- `mockStats` — `{ totalPosts, published, drafts, scheduled }`
- `mockActivity` — 10 timestamped activity events
- `mockChartData` — 30 days of posts-per-day numbers

### Swapping to NestJS
```ts
// BEFORE (mock)
export const blogApi = {
  getAll: (filters) => delay().then(() => filterMockPosts(filters)),
}

// AFTER (real NestJS — one line change per endpoint)
export const blogApi = {
  getAll: (filters) => axios.get("/api/blog", { params: filters }),
}
```

---

## UI/UX Requirements

- Minimal, premium SaaS look (Stripe / Vercel / Notion style)
- Glassmorphism on cards and modals where appropriate
- Soft shadows, smooth hover effects
- Skeleton loaders on all data-fetching components
- Empty states on all list/table views
- Confirmation modals for destructive actions
- Success/error toasts via Sonner (already installed)
- Fully responsive — sidebar collapses to drawer on mobile
- Smooth sidebar collapse animation

---

## What Phase 2 Will Cover

- Content Management (Homepage sections, Services, Industries, FAQs, Hero, CTA, Footer, Navigation)
- Media Library (drag-and-drop upload, image preview, search, delete)
- User Management (create/edit staff accounts, assign roles, disable accounts)
- Activity Logs (login, content edits, publish events, user actions)
- Settings (site metadata, SEO defaults, social links, contact info, branding)

---

## NestJS Backend Note

The mock layer is intentionally designed to mirror REST API conventions. When the NestJS backend is built, it should expose:

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/blog
GET    /api/blog/:id
POST   /api/blog
PUT    /api/blog/:id
DELETE /api/blog/:id
GET    /api/dashboard/stats
GET    /api/dashboard/activity
GET    /api/dashboard/chart
```

The frontend swap will be a single file change in `mock/api.ts`.
