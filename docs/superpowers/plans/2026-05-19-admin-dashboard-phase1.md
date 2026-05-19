# Admin Dashboard Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected admin dashboard for MyMquid Elevate with authentication, dashboard home, and full blog management, all wired to a mock API layer ready for NestJS integration.

**Architecture:** The admin dashboard lives under `src/admin/` as a feature-first module, mounted at `/admin/*` via React Router lazy loading in the existing `App.tsx`. All data flows through `src/admin/mock/api.ts` — replacing that one file swaps mock for real HTTP calls. Zustand manages client state (auth, UI, blog).

**Tech Stack:** React 19, TypeScript, Vite 7, React Router DOM 7, Tailwind CSS v4, shadcn/ui, Zustand, Tiptap, Recharts, React Hook Form + Zod, Sonner, date-fns, Vitest + React Testing Library

---

## File Map

### New files
```
src/admin/
├── types.ts
├── AdminRouter.tsx
├── auth/
│   ├── LoginPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── authGuard.tsx
│   ├── roleGuard.tsx
│   ├── useAuthStore.ts
│   └── __tests__/useAuthStore.test.ts
├── blog/
│   ├── BlogListPage.tsx
│   ├── BlogEditorPage.tsx
│   ├── BlogPreviewPage.tsx
│   ├── useBlogStore.ts
│   ├── __tests__/useBlogStore.test.ts
│   └── components/
│       ├── BlogTable.tsx
│       ├── TiptapEditor.tsx
│       ├── SEOFields.tsx
│       ├── BlogStatusBadge.tsx
│       └── CategoryTagInput.tsx
├── dashboard/
│   ├── DashboardPage.tsx
│   └── components/
│       ├── OverviewCards.tsx
│       ├── RecentActivity.tsx
│       ├── QuickActions.tsx
│       └── PostsChart.tsx
├── layout/
│   ├── AdminLayout.tsx
│   ├── Sidebar.tsx
│   ├── SidebarNav.tsx
│   ├── TopNav.tsx
│   ├── Breadcrumbs.tsx
│   └── useUIStore.ts
├── notifications/
│   ├── NotificationsPage.tsx
│   └── useNotificationStore.ts
├── profile/
│   └── ProfilePage.tsx
├── shared/
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── PageHeader.tsx
│   │   └── StatCard.tsx
│   └── hooks/
│       ├── useDebounce.ts
│       └── usePagination.ts
└── mock/
    ├── data.ts
    └── api.ts
```

### Modified files
```
src/App.tsx          — add lazy /admin/* route
package.json         — add zustand, tiptap, vitest deps + test scripts
```

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test-setup.ts`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install zustand @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Install test dependencies**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui
```

- [ ] **Step 3: Add test scripts to `package.json`**

Open `package.json` and add these three lines inside `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run",
"test:ui": "vitest --ui"
```

Final scripts block:
```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write .",
  "test": "vitest",
  "test:run": "vitest run",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 5: Create `src/test-setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 6: Verify Vitest runs**

```bash
npm run test:run
```

Expected: `No test files found` (zero failures). If you see an error, check the vitest.config.ts path.

- [ ] **Step 7: Commit**

```bash
git add package.json vitest.config.ts src/test-setup.ts
git commit -m "chore: add zustand, tiptap, and vitest"
```

---

## Task 2: Define shared TypeScript types

**Files:**
- Create: `src/admin/types.ts`

- [ ] **Step 1: Create `src/admin/types.ts`**

```ts
export type AdminRole = "super_admin" | "staff";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
};

export type BlogStatus = "draft" | "published" | "scheduled";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string };
};

export type ActivityEvent = {
  id: string;
  type: "publish" | "draft" | "login" | "delete" | "edit";
  message: string;
  time: string;
  createdAt: string;
};

export type DashboardStats = {
  totalPosts: number;
  published: number;
  drafts: number;
  scheduled: number;
};

export type ChartDataPoint = {
  date: string;
  posts: number;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/types.ts
git commit -m "feat(admin): add shared TypeScript types"
```

---

## Task 3: Create mock data

**Files:**
- Create: `src/admin/mock/data.ts`

- [ ] **Step 1: Create `src/admin/mock/data.ts`**

```ts
import type {
  AdminUser,
  BlogPost,
  ActivityEvent,
  DashboardStats,
  ChartDataPoint,
  Notification,
} from "../types";

export const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Patrick Evra", email: "admin@mymquid.com", role: "super_admin" },
  { id: "2", name: "Jane Staff", email: "staff@mymquid.com", role: "staff" },
];

export const MOCK_CREDENTIALS: Record<string, string> = {
  "admin@mymquid.com": "admin123",
  "staff@mymquid.com": "staff123",
};

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to MyMquid",
    slug: "welcome-to-mymquid",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Welcome to MyMquid!" }] }] }),
    status: "published",
    category: "Company News",
    tags: ["welcome", "company"],
    seo: { metaTitle: "Welcome to MyMquid", metaDescription: "Learn about MyMquid." },
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "2",
    title: "Our Technology Solutions",
    slug: "our-technology-solutions",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Explore our solutions." }] }] }),
    status: "published",
    category: "Solutions",
    tags: ["tech", "solutions"],
    seo: { metaTitle: "Our Technology Solutions", metaDescription: "Explore MyMquid solutions." },
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "3",
    title: "2026 Industry Trends",
    slug: "2026-industry-trends",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Key trends for 2026." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["trends", "2026"],
    seo: { metaTitle: "2026 Industry Trends", metaDescription: "Key trends shaping industries in 2026." },
    createdAt: "2026-04-20T08:00:00Z",
    updatedAt: "2026-05-01T14:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "4",
    title: "MyMquid Partners Programme",
    slug: "mymquid-partners-programme",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Join our partner network." }] }] }),
    status: "published",
    category: "Company News",
    tags: ["partners", "programme"],
    seo: { metaTitle: "Partners Programme", metaDescription: "Join the MyMquid partner network." },
    createdAt: "2026-04-25T11:00:00Z",
    updatedAt: "2026-04-25T11:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "5",
    title: "Case Study: Digital Transformation",
    slug: "case-study-digital-transformation",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "How we helped a client transform." }] }] }),
    status: "published",
    category: "Case Studies",
    tags: ["case-study", "digital"],
    seo: { metaTitle: "Digital Transformation Case Study", metaDescription: "A MyMquid success story." },
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-01T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "6",
    title: "AI in Modern Business",
    slug: "ai-in-modern-business",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The role of AI today." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["ai", "business"],
    seo: { metaTitle: "AI in Modern Business", metaDescription: "How AI shapes modern enterprises." },
    createdAt: "2026-05-05T09:00:00Z",
    updatedAt: "2026-05-10T16:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "7",
    title: "Careers at MyMquid 2026",
    slug: "careers-at-mymquid-2026",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "We are hiring!" }] }] }),
    status: "scheduled",
    category: "Company News",
    tags: ["careers", "hiring"],
    seo: { metaTitle: "Careers at MyMquid", metaDescription: "Join the MyMquid team." },
    scheduledAt: "2026-06-01T09:00:00Z",
    createdAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "8",
    title: "Cloud Security Best Practices",
    slug: "cloud-security-best-practices",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Securing your cloud environment." }] }] }),
    status: "published",
    category: "Solutions",
    tags: ["cloud", "security"],
    seo: { metaTitle: "Cloud Security Best Practices", metaDescription: "Protect your cloud workloads." },
    createdAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-08T11:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "9",
    title: "What is IoT and Why It Matters",
    slug: "what-is-iot-and-why-it-matters",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Understanding the Internet of Things." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["iot", "technology"],
    seo: { metaTitle: "What is IoT", metaDescription: "A beginner's guide to IoT." },
    createdAt: "2026-05-14T08:00:00Z",
    updatedAt: "2026-05-14T08:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "10",
    title: "MyMquid Product Roadmap",
    slug: "mymquid-product-roadmap",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "What's coming next." }] }] }),
    status: "scheduled",
    category: "Company News",
    tags: ["roadmap", "product"],
    seo: { metaTitle: "MyMquid Roadmap", metaDescription: "Our plans for the next 12 months." },
    scheduledAt: "2026-06-15T09:00:00Z",
    createdAt: "2026-05-17T10:00:00Z",
    updatedAt: "2026-05-17T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
];

export const MOCK_STATS: DashboardStats = {
  totalPosts: 10,
  published: 5,
  drafts: 3,
  scheduled: 2,
};

export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: "1", type: "publish", message: "Post published: Welcome to MyMquid", time: "2h ago", createdAt: "2026-05-19T08:00:00Z" },
  { id: "2", type: "draft", message: "Draft saved: AI in Modern Business", time: "4h ago", createdAt: "2026-05-19T06:00:00Z" },
  { id: "3", type: "login", message: "Admin logged in", time: "5h ago", createdAt: "2026-05-19T05:00:00Z" },
  { id: "4", type: "edit", message: "Post edited: Our Technology Solutions", time: "1d ago", createdAt: "2026-05-18T10:00:00Z" },
  { id: "5", type: "publish", message: "Post published: Cloud Security Best Practices", time: "2d ago", createdAt: "2026-05-17T10:00:00Z" },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-04-20");
  date.setDate(date.getDate() + i);
  return {
    date: date.toISOString().split("T")[0],
    posts: Math.floor(Math.random() * 3),
  };
});

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Post Published", message: "Welcome to MyMquid is now live.", type: "success", read: false, createdAt: "2026-05-19T08:00:00Z" },
  { id: "2", title: "Draft Reminder", message: "AI in Modern Business has unsaved changes.", type: "warning", read: false, createdAt: "2026-05-19T06:00:00Z" },
  { id: "3", title: "Scheduled Post", message: "Careers at MyMquid 2026 is scheduled for June 1.", type: "info", read: true, createdAt: "2026-05-18T10:00:00Z" },
];

export const MOCK_CATEGORIES = [
  "Company News",
  "Solutions",
  "Insights",
  "Case Studies",
];
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/mock/data.ts
git commit -m "feat(admin): add mock data"
```

---

## Task 4: Create mock API layer

**Files:**
- Create: `src/admin/mock/api.ts`
- Create: `src/admin/mock/__tests__/api.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/admin/mock/__tests__/api.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { authApi, blogApi, dashboardApi } from "../api";

describe("authApi", () => {
  it("returns user and token for valid credentials", async () => {
    const result = await authApi.login("admin@mymquid.com", "admin123");
    expect(result.user.role).toBe("super_admin");
    expect(result.token).toBe("mock-jwt-admin");
  });

  it("throws for invalid credentials", async () => {
    await expect(authApi.login("wrong@email.com", "bad")).rejects.toThrow(
      "Invalid email or password"
    );
  });
});

describe("blogApi", () => {
  it("returns all posts when no filters", async () => {
    const posts = await blogApi.getAll({});
    expect(posts.length).toBe(10);
  });

  it("filters posts by status", async () => {
    const posts = await blogApi.getAll({ status: "published" });
    expect(posts.every((p) => p.status === "published")).toBe(true);
  });

  it("returns a single post by id", async () => {
    const post = await blogApi.getById("1");
    expect(post.title).toBe("Welcome to MyMquid");
  });

  it("throws when post id not found", async () => {
    await expect(blogApi.getById("999")).rejects.toThrow("Post not found");
  });
});

describe("dashboardApi", () => {
  it("returns stats with expected shape", async () => {
    const stats = await dashboardApi.getStats();
    expect(stats).toHaveProperty("totalPosts");
    expect(stats).toHaveProperty("published");
    expect(stats).toHaveProperty("drafts");
    expect(stats).toHaveProperty("scheduled");
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../api'`

- [ ] **Step 3: Create `src/admin/mock/api.ts`**

```ts
import type { BlogPost } from "../types";
import {
  MOCK_USERS,
  MOCK_CREDENTIALS,
  MOCK_POSTS,
  MOCK_STATS,
  MOCK_ACTIVITY,
  MOCK_CHART_DATA,
  MOCK_NOTIFICATIONS,
} from "./data";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let posts = [...MOCK_POSTS];

export const authApi = {
  login: async (email: string, password: string) => {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user || MOCK_CREDENTIALS[email] !== password) {
      throw new Error("Invalid email or password");
    }
    const token = user.role === "super_admin" ? "mock-jwt-admin" : "mock-jwt-staff";
    return { user, token };
  },
  logout: async () => {
    await delay(100);
  },
};

type BlogFilters = {
  status?: string;
  category?: string;
  search?: string;
};

export const blogApi = {
  getAll: async (filters: BlogFilters) => {
    await delay();
    let result = [...posts];
    if (filters.status) result = result.filter((p) => p.status === filters.status);
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    return result;
  },

  getById: async (id: string) => {
    await delay();
    const post = posts.find((p) => p.id === id);
    if (!post) throw new Error("Post not found");
    return post;
  },

  save: async (post: BlogPost) => {
    await delay();
    const idx = posts.findIndex((p) => p.id === post.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      posts[idx] = { ...post, updatedAt: now };
      return posts[idx];
    }
    const newPost = { ...post, createdAt: now, updatedAt: now };
    posts.push(newPost);
    return newPost;
  },

  delete: async (id: string) => {
    await delay();
    posts = posts.filter((p) => p.id !== id);
  },
};

export const dashboardApi = {
  getStats: async () => {
    await delay();
    return {
      ...MOCK_STATS,
      totalPosts: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      scheduled: posts.filter((p) => p.status === "scheduled").length,
    };
  },

  getRecentActivity: async () => {
    await delay();
    return MOCK_ACTIVITY;
  },

  getChartData: async () => {
    await delay();
    return MOCK_CHART_DATA;
  },
};

export const notificationApi = {
  getAll: async () => {
    await delay();
    return MOCK_NOTIFICATIONS;
  },
};
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/admin/mock/
git commit -m "feat(admin): add mock API layer with tests"
```

---

## Task 5: Auth store

**Files:**
- Create: `src/admin/auth/useAuthStore.ts`
- Create: `src/admin/auth/__tests__/useAuthStore.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/admin/auth/__tests__/useAuthStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../useAuthStore";

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
});

describe("useAuthStore", () => {
  it("starts unauthenticated", () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it("logs in with valid super admin credentials", async () => {
    await useAuthStore.getState().login("admin@mymquid.com", "admin123");
    const { isAuthenticated, user, token, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe("super_admin");
    expect(token).toBe("mock-jwt-admin");
    expect(error).toBeNull();
  });

  it("logs in with valid staff credentials", async () => {
    await useAuthStore.getState().login("staff@mymquid.com", "staff123");
    const { user } = useAuthStore.getState();
    expect(user?.role).toBe("staff");
  });

  it("sets error for invalid credentials", async () => {
    await useAuthStore.getState().login("wrong@email.com", "bad");
    const { isAuthenticated, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(error).toBe("Invalid email or password");
  });

  it("logout clears user and token", async () => {
    await useAuthStore.getState().login("admin@mymquid.com", "admin123");
    useAuthStore.getState().logout();
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it("clearError resets error to null", async () => {
    await useAuthStore.getState().login("wrong@email.com", "bad");
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../useAuthStore'`

- [ ] **Step 3: Create `src/admin/auth/useAuthStore.ts`**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "../types";
import { authApi } from "../mock/api";

type AuthState = {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(email, password);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "mymquid-admin-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/admin/auth/
git commit -m "feat(admin): add auth store with tests"
```

---

## Task 6: Login page

**Files:**
- Create: `src/admin/auth/LoginPage.tsx`

- [ ] **Step 1: Create `src/admin/auth/LoginPage.tsx`**

```tsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "./useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = (data: FormValues) => {
    login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">MyMquid Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@mymquid.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/admin/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Demo: admin@mymquid.com / admin123
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/auth/LoginPage.tsx
git commit -m "feat(admin): add login page"
```

---

## Task 7: ForgotPassword and ResetPassword pages

**Files:**
- Create: `src/admin/auth/ForgotPasswordPage.tsx`
- Create: `src/admin/auth/ResetPasswordPage.tsx`

- [ ] **Step 1: Create `src/admin/auth/ForgotPasswordPage.tsx`**

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = () => setSubmitted(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          to="/admin/login"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-md bg-muted p-4 text-sm text-center">
            If this email exists, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@mymquid.com" {...register("email")} />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/admin/auth/ResetPasswordPage.tsx`**

```tsx
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    toast.success("Password reset. Please log in.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          to="/admin/login"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your new password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" placeholder="••••••••" {...register("confirm")} />
            {errors.confirm && (
              <p className="text-destructive text-xs">{errors.confirm.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">Reset password</Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/admin/auth/ForgotPasswordPage.tsx src/admin/auth/ResetPasswordPage.tsx
git commit -m "feat(admin): add forgot/reset password pages"
```

---

## Task 8: Auth guards

**Files:**
- Create: `src/admin/auth/authGuard.tsx`
- Create: `src/admin/auth/roleGuard.tsx`

- [ ] **Step 1: Create `src/admin/auth/authGuard.tsx`**

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
```

- [ ] **Step 2: Create `src/admin/auth/roleGuard.tsx`**

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import type { AdminRole } from "../types";

type Props = { allowedRoles: AdminRole[] };

export function RoleGuard({ allowedRoles }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/admin/auth/authGuard.tsx src/admin/auth/roleGuard.tsx
git commit -m "feat(admin): add auth and role guards"
```

---

## Task 9: AdminRouter and wire into App.tsx

**Files:**
- Create: `src/admin/AdminRouter.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/admin/AdminRouter.tsx`**

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./auth/authGuard";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./auth/ResetPasswordPage"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));
const BlogListPage = lazy(() => import("./blog/BlogListPage"));
const BlogEditorPage = lazy(() => import("./blog/BlogEditorPage"));
const BlogPreviewPage = lazy(() => import("./blog/BlogPreviewPage"));
const NotificationsPage = lazy(() => import("./notifications/NotificationsPage"));
const ProfilePage = lazy(() => import("./profile/ProfilePage"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function AdminRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/create" element={<BlogEditorPage />} />
            <Route path="blog/edit/:id" element={<BlogEditorPage />} />
            <Route path="blog/preview/:id" element={<BlogPreviewPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
```

- [ ] **Step 2: Modify `src/App.tsx`**

Replace the entire file contents with:

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

- [ ] **Step 3: Verify dev server starts with no errors**

```bash
npm run dev
```

Open `http://localhost:8080/admin/login` — you should see the Login page.
Open `http://localhost:8080/admin/dashboard` — should redirect to Login (not authenticated).
Log in with `admin@mymquid.com / admin123` — should redirect to Dashboard (page will be blank until Task 15).

- [ ] **Step 4: Commit**

```bash
git add src/admin/AdminRouter.tsx src/App.tsx
git commit -m "feat(admin): add AdminRouter and wire into App"
```

---

## Task 10: UI store

**Files:**
- Create: `src/admin/layout/useUIStore.ts`

- [ ] **Step 1: Create `src/admin/layout/useUIStore.ts`**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  setTheme: (theme: "light" | "dark") => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: "light",

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleCollapsed: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
    }),
    {
      name: "mymquid-admin-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/layout/useUIStore.ts
git commit -m "feat(admin): add UI store"
```

---

## Task 11: Shared hooks

**Files:**
- Create: `src/admin/shared/hooks/useDebounce.ts`
- Create: `src/admin/shared/hooks/usePagination.ts`
- Create: `src/admin/shared/hooks/__tests__/useDebounce.test.ts`
- Create: `src/admin/shared/hooks/__tests__/usePagination.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/admin/shared/hooks/__tests__/useDebounce.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("debounces value updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );
    rerender({ value: "world" });
    expect(result.current).toBe("hello");
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("world");
  });
});
```

Create `src/admin/shared/hooks/__tests__/usePagination.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("starts on page 1", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(5);
  });

  it("nextPage increments page", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
  });

  it("prevPage does not go below 1", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);
  });

  it("goToPage clamps to valid range", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.goToPage(99));
    expect(result.current.page).toBe(5);
    act(() => result.current.goToPage(0));
    expect(result.current.page).toBe(1);
  });

  it("returns correct slice offsets", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.goToPage(3));
    expect(result.current.from).toBe(20);
    expect(result.current.to).toBe(30);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create `src/admin/shared/hooks/useDebounce.ts`**

```ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

- [ ] **Step 4: Create `src/admin/shared/hooks/usePagination.ts`**

```ts
import { useState } from "react";

export function usePagination(totalItems: number, pageSize: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goToPage = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize, totalItems);

  return { page, totalPages, from, to, goToPage, nextPage, prevPage };
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/admin/shared/hooks/
git commit -m "feat(admin): add useDebounce and usePagination hooks with tests"
```

---

## Task 12: Shared UI components

**Files:**
- Create: `src/admin/shared/components/StatCard.tsx`
- Create: `src/admin/shared/components/SkeletonLoader.tsx`
- Create: `src/admin/shared/components/EmptyState.tsx`
- Create: `src/admin/shared/components/PageHeader.tsx`
- Create: `src/admin/shared/components/ConfirmModal.tsx`

- [ ] **Step 1: Create `src/admin/shared/components/StatCard.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, trend, className }: Props) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-md bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/admin/shared/components/SkeletonLoader.tsx`**

```tsx
import { cn } from "@/lib/utils";

type Props = { rows?: number; className?: string };

export function SkeletonLoader({ rows = 4, className }: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-md bg-muted animate-pulse"
          style={{ width: `${85 + (i % 3) * 5}%` }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/admin/shared/components/EmptyState.tsx`**

```tsx
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </span>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/admin/shared/components/PageHeader.tsx`**

```tsx
type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/admin/shared/components/ConfirmModal.tsx`**

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/admin/shared/components/
git commit -m "feat(admin): add shared UI components"
```

---

## Task 13: DataTable component

**Files:**
- Create: `src/admin/shared/components/DataTable.tsx`
- Create: `src/admin/shared/components/__tests__/DataTable.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/admin/shared/components/__tests__/DataTable.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "../DataTable";

type Row = { id: string; name: string; age: number };

const columns = [
  { key: "name" as const, header: "Name", render: (row: Row) => row.name },
  { key: "age" as const, header: "Age", render: (row: Row) => String(row.age) },
];

const rows: Row[] = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<DataTable columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows empty state when no rows", () => {
    render(
      <DataTable columns={columns} rows={[]} rowKey="id" emptyMessage="No data found" />
    );
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../DataTable'`

- [ ] **Step 3: Create `src/admin/shared/components/DataTable.tsx`**

```tsx
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No results found.",
  isLoading = false,
  className,
}: Props<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</div>
    );
  }

  return (
    <div className={cn("w-full overflow-auto rounded-lg border", className)}>
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={String(row[rowKey])}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/admin/shared/components/DataTable.tsx src/admin/shared/components/__tests__/DataTable.test.tsx
git commit -m "feat(admin): add DataTable component with tests"
```

---

## Task 14: Admin layout (Sidebar, TopNav, Breadcrumbs, AdminLayout)

**Files:**
- Create: `src/admin/layout/SidebarNav.tsx`
- Create: `src/admin/layout/Sidebar.tsx`
- Create: `src/admin/layout/Breadcrumbs.tsx`
- Create: `src/admin/layout/TopNav.tsx`
- Create: `src/admin/layout/AdminLayout.tsx`

- [ ] **Step 1: Create `src/admin/layout/SidebarNav.tsx`**

```tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "./useUIStore";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/blog", icon: FileText, label: "Blog" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/admin/profile", icon: User, label: "Profile" },
];

export function SidebarNav() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/admin/layout/Sidebar.tsx`**

```tsx
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "./useUIStore";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const { sidebarCollapsed, sidebarOpen, toggleCollapsed, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full flex-col border-r bg-card transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          "hidden lg:flex",
          sidebarOpen && "flex"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <Link to="/admin/dashboard" className="font-bold text-lg">
              MyMquid
            </Link>
          )}
          <button
            onClick={toggleCollapsed}
            className="ml-auto rounded-md p-1.5 hover:bg-accent"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <SidebarNav />

        {/* Footer label */}
        {!sidebarCollapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">Admin Panel v1.0</p>
          </div>
        )}
      </aside>
    </>
  );
}
```

- [ ] **Step 3: Create `src/admin/layout/Breadcrumbs.tsx`**

```tsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  blog: "Blog",
  create: "Create Post",
  edit: "Edit Post",
  preview: "Preview",
  notifications: "Notifications",
  profile: "Profile",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {parts.map((part, i) => {
        const to = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        const label = labelMap[part] ?? part;

        return (
          <span key={to} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={to} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4: Create `src/admin/layout/TopNav.tsx`**

```tsx
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { useAuthStore } from "../auth/useAuthStore";
import { useUIStore } from "./useUIStore";
import { useNotificationStore } from "../notifications/useNotificationStore";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, toggleSidebar } = useUIStore();
  const unread = useNotificationStore((s) => s.unreadCount);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "A";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate("/admin/notifications")}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-bold">
              {unread}
            </span>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role.replace("_", " ")}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Create `src/admin/layout/AdminLayout.tsx`**

```tsx
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useUIStore } from "./useUIStore";

export default function AdminLayout() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify layout renders**

```bash
npm run dev
```

Log in at `http://localhost:8080/admin/login` with `admin@mymquid.com / admin123`. You should now see the sidebar, top nav, and breadcrumbs. The main content area will be blank until Task 15.

- [ ] **Step 7: Commit**

```bash
git add src/admin/layout/
git commit -m "feat(admin): add admin layout, sidebar, topnav, breadcrumbs"
```

---

## Task 15: Dashboard page

**Files:**
- Create: `src/admin/dashboard/components/OverviewCards.tsx`
- Create: `src/admin/dashboard/components/RecentActivity.tsx`
- Create: `src/admin/dashboard/components/QuickActions.tsx`
- Create: `src/admin/dashboard/components/PostsChart.tsx`
- Create: `src/admin/dashboard/DashboardPage.tsx`

- [ ] **Step 1: Create `src/admin/dashboard/components/OverviewCards.tsx`**

```tsx
import { FileText, CheckCircle, Edit, Clock } from "lucide-react";
import { StatCard } from "../../shared/components/StatCard";
import type { DashboardStats } from "../../types";

type Props = { stats: DashboardStats };

export function OverviewCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Posts" value={stats.totalPosts} icon={FileText} trend="All time" />
      <StatCard label="Published" value={stats.published} icon={CheckCircle} trend="Live now" />
      <StatCard label="Drafts" value={stats.drafts} icon={Edit} trend="In progress" />
      <StatCard label="Scheduled" value={stats.scheduled} icon={Clock} trend="Upcoming" />
    </div>
  );
}
```

- [ ] **Step 2: Create `src/admin/dashboard/components/RecentActivity.tsx`**

```tsx
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Edit, LogIn, Trash, FileText } from "lucide-react";
import type { ActivityEvent } from "../../types";

const iconMap = {
  publish: CheckCircle,
  draft: Edit,
  login: LogIn,
  delete: Trash,
  edit: FileText,
};

const colorMap = {
  publish: "text-green-500",
  draft: "text-yellow-500",
  login: "text-blue-500",
  delete: "text-red-500",
  edit: "text-purple-500",
};

type Props = { events: ActivityEvent[] };

export function RecentActivity({ events }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {events.map((event) => {
          const Icon = iconMap[event.type];
          const color = colorMap[event.type];
          return (
            <li key={event.id} className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/admin/dashboard/components/QuickActions.tsx`**

```tsx
import { useNavigate } from "react-router-dom";
import { PlusCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          className="w-full justify-start"
          onClick={() => navigate("/admin/blog/create")}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Blog Post
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("/", "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> View Public Site
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/admin/dashboard/components/PostsChart.tsx`**

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../../types";

type Props = { data: ChartDataPoint[] };

export function PostsChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    date: d.date.slice(5), // show MM-DD only
  }));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Posts Published — Last 30 Days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/admin/dashboard/DashboardPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/useAuthStore";
import { dashboardApi } from "../mock/api";
import type { DashboardStats, ActivityEvent, ChartDataPoint } from "../types";
import { OverviewCards } from "./components/OverviewCards";
import { RecentActivity } from "./components/RecentActivity";
import { QuickActions } from "./components/QuickActions";
import { PostsChart } from "./components/PostsChart";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getRecentActivity(),
      dashboardApi.getChartData(),
    ]).then(([s, a, c]) => {
      setStats(s);
      setActivity(a);
      setChartData(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <SkeletonLoader rows={8} />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {user?.name.split(" ")[0]}</h1>
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
```

- [ ] **Step 6: Verify dashboard renders**

```bash
npm run dev
```

Log in and navigate to `http://localhost:8080/admin/dashboard`. You should see the greeting, 4 stat cards, the bar chart, activity list, and quick actions.

- [ ] **Step 7: Commit**

```bash
git add src/admin/dashboard/
git commit -m "feat(admin): add dashboard page with stats, chart, and activity"
```

---

## Task 16: Blog store

**Files:**
- Create: `src/admin/blog/useBlogStore.ts`
- Create: `src/admin/blog/__tests__/useBlogStore.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/admin/blog/__tests__/useBlogStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useBlogStore } from "../useBlogStore";
import { MOCK_POSTS } from "../../mock/data";
import type { BlogPost } from "../../types";

beforeEach(() => {
  useBlogStore.setState({
    posts: [],
    currentPost: null,
    isLoading: false,
    filters: { status: "", category: "", search: "" },
  });
});

describe("useBlogStore", () => {
  it("loads posts from API", async () => {
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(10);
  });

  it("filters posts by status after fetch", async () => {
    useBlogStore.setState({ filters: { status: "published", category: "", search: "" } });
    await useBlogStore.getState().fetchPosts();
    const posts = useBlogStore.getState().posts;
    expect(posts.every((p) => p.status === "published")).toBe(true);
  });

  it("setCurrentPost updates currentPost", () => {
    const post = MOCK_POSTS[0];
    useBlogStore.getState().setCurrentPost(post);
    expect(useBlogStore.getState().currentPost?.id).toBe(post.id);
  });

  it("savePost adds a new post", async () => {
    await useBlogStore.getState().fetchPosts();
    const initialCount = useBlogStore.getState().posts.length;
    const newPost: BlogPost = {
      ...MOCK_POSTS[0],
      id: "new-1",
      title: "New Post",
      slug: "new-post",
    };
    await useBlogStore.getState().savePost(newPost);
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(initialCount + 1);
  });

  it("deletePost removes a post", async () => {
    await useBlogStore.getState().fetchPosts();
    const initialCount = useBlogStore.getState().posts.length;
    await useBlogStore.getState().deletePost("1");
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(initialCount - 1);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../useBlogStore'`

- [ ] **Step 3: Create `src/admin/blog/useBlogStore.ts`**

```ts
import { create } from "zustand";
import { blogApi } from "../mock/api";
import type { BlogPost } from "../types";
import { toast } from "sonner";

type BlogFilters = {
  status: string;
  category: string;
  search: string;
};

type BlogState = {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  filters: BlogFilters;
  fetchPosts: () => Promise<void>;
  setCurrentPost: (post: BlogPost | null) => void;
  savePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setFilters: (filters: Partial<BlogFilters>) => void;
};

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  filters: { status: "", category: "", search: "" },

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const posts = await blogApi.getAll(get().filters);
      set({ posts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setCurrentPost: (post) => set({ currentPost: post }),

  savePost: async (post) => {
    try {
      await blogApi.save(post);
      toast.success(post.status === "published" ? "Post published!" : "Post saved.");
    } catch (err) {
      toast.error("Failed to save post.");
      throw err;
    }
  },

  deletePost: async (id) => {
    try {
      await blogApi.delete(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
}));
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/admin/blog/useBlogStore.ts src/admin/blog/__tests__/
git commit -m "feat(admin): add blog store with tests"
```

---

## Task 17: Blog support components

**Files:**
- Create: `src/admin/blog/components/BlogStatusBadge.tsx`
- Create: `src/admin/blog/components/CategoryTagInput.tsx`
- Create: `src/admin/blog/components/SEOFields.tsx`

- [ ] **Step 1: Create `src/admin/blog/components/BlogStatusBadge.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { BlogStatus } from "../../types";

const config: Record<BlogStatus, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

type Props = { status: BlogStatus };

export function BlogStatusBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create `src/admin/blog/components/CategoryTagInput.tsx`**

```tsx
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_CATEGORIES } from "../../mock/data";

type Props = {
  category: string;
  tags: string[];
  onCategoryChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
};

export function CategoryTagInput({ category, tags, onCategoryChange, onTagsChange }: Props) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => onTagsChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Tags</Label>
        <Input
          placeholder="Add tag, press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/admin/blog/components/SEOFields.tsx`**

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SEO = {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
};

type Props = {
  value: SEO;
  onChange: (seo: SEO) => void;
};

export function SEOFields({ value, onChange }: Props) {
  const update = (key: keyof SEO, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">SEO</h4>

      <div className="space-y-1">
        <Label className="text-xs">Meta Title</Label>
        <Input
          placeholder="Page title for search engines"
          value={value.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{value.metaTitle.length}/60</p>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Meta Description</Label>
        <Textarea
          placeholder="Short description for search results"
          value={value.metaDescription}
          onChange={(e) => update("metaDescription", e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">{value.metaDescription.length}/160</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/admin/blog/components/BlogStatusBadge.tsx src/admin/blog/components/CategoryTagInput.tsx src/admin/blog/components/SEOFields.tsx
git commit -m "feat(admin): add blog support components"
```

---

## Task 18: Tiptap editor

**Files:**
- Create: `src/admin/blog/components/TiptapEditor.tsx`

- [ ] **Step 1: Create `src/admin/blog/components/TiptapEditor.tsx`**

```tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Link as LinkIcon, Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={cn("h-8 w-8", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

export function TiptapEditor({ value, onChange, className }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your post..." }),
    ],
    content: (() => {
      try { return JSON.parse(value); } catch { return value || ""; }
    })(),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div className={cn("rounded-lg border bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Add link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/blog/components/TiptapEditor.tsx
git commit -m "feat(admin): add Tiptap rich text editor"
```

---

## Task 19: Blog list page

**Files:**
- Create: `src/admin/blog/components/BlogTable.tsx`
- Create: `src/admin/blog/BlogListPage.tsx`

- [ ] **Step 1: Create `src/admin/blog/components/BlogTable.tsx`**

```tsx
import { useNavigate } from "react-router-dom";
import { Edit, Trash, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../shared/components/DataTable";
import { BlogStatusBadge } from "./BlogStatusBadge";
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
        <span className="font-medium line-clamp-1">{post.title}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (post: BlogPost) => <BlogStatusBadge status={post.status} />,
      className: "w-32",
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
            onClick={() => navigate(`/admin/blog/preview/${post.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Edit"
            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
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
```

- [ ] **Step 2: Create `src/admin/blog/BlogListPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "../shared/components/PageHeader";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { BlogTable } from "./components/BlogTable";
import { useBlogStore } from "./useBlogStore";
import { useDebounce } from "../shared/hooks/useDebounce";
import { usePagination } from "../shared/hooks/usePagination";
import { MOCK_CATEGORIES } from "../mock/data";

export default function BlogListPage() {
  const navigate = useNavigate();
  const { posts, isLoading, filters, fetchPosts, setFilters, deletePost } = useBlogStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    fetchPosts();
  }, [filters, fetchPosts]);

  const { page, totalPages, from, to, nextPage, prevPage } = usePagination(
    posts.length,
    10
  );

  const paginatedPosts = posts.slice(from, to);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePost(deleteId);
    await fetchPosts();
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content"
        action={
          <Button onClick={() => navigate("/admin/blog/create")}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => setFilters({ status: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => setFilters({ category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MOCK_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <BlogTable posts={paginatedPosts} isLoading={isLoading} onDelete={setDeleteId} />

      {/* Pagination */}
      {posts.length > 10 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {from + 1}–{to} of {posts.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete post?"
        description="This action cannot be undone. The post will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify blog list renders**

```bash
npm run dev
```

Navigate to `http://localhost:8080/admin/blog`. You should see the table with 10 posts, search, filters, and pagination.

- [ ] **Step 4: Commit**

```bash
git add src/admin/blog/components/BlogTable.tsx src/admin/blog/BlogListPage.tsx
git commit -m "feat(admin): add blog list page"
```

---

## Task 20: Blog editor page

**Files:**
- Create: `src/admin/blog/BlogEditorPage.tsx`

- [ ] **Step 1: Create `src/admin/blog/BlogEditorPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "./components/TiptapEditor";
import { SEOFields } from "./components/SEOFields";
import { CategoryTagInput } from "./components/CategoryTagInput";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { useBlogStore } from "./useBlogStore";
import { blogApi } from "../mock/api";
import { useAuthStore } from "../auth/useAuthStore";
import type { BlogPost, BlogStatus } from "../types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published", "scheduled"]),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  scheduledAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof schema>;

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const user = useAuthStore((s) => s.user);
  const { savePost } = useBlogStore();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      category: "",
      tags: [],
      scheduledAt: "",
      seo: { metaTitle: "", metaDescription: "" },
    },
  });

  const title = watch("title");
  const status = watch("status");

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setValue("slug", slugify(title), { shouldDirty: false });
    }
  }, [title, slugManuallyEdited, setValue]);

  // Load existing post for edit mode
  useEffect(() => {
    if (!isEdit || !id) return;
    blogApi.getById(id).then((post) => {
      setValue("title", post.title);
      setValue("slug", post.slug);
      setValue("content", post.content);
      setValue("status", post.status);
      setValue("category", post.category);
      setValue("tags", post.tags);
      setValue("scheduledAt", post.scheduledAt ?? "");
      setValue("seo", post.seo);
      setLoading(false);
    }).catch(() => {
      navigate("/admin/blog");
    });
  }, [id, isEdit, navigate, setValue]);

  const buildPost = (data: FormValues): BlogPost => ({
    id: id ?? String(Date.now()),
    ...data,
    status: data.status as BlogStatus,
    featuredImage: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: user?.id ?? "1", name: user?.name ?? "Admin" },
  });

  const handleSave = async (data: FormValues, overrideStatus?: BlogStatus) => {
    setSaving(true);
    try {
      const post = buildPost({ ...data, status: overrideStatus ?? data.status });
      await savePost(post);
      navigate("/admin/blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonLoader rows={8} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blog"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => id && navigate(`/admin/blog/preview/${id}`)}
          >
            <Eye className="mr-1.5 h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={handleSubmit((data) => handleSave(data, "draft"))}
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={saving}
            onClick={handleSubmit((data) => handleSave(data, "published"))}
          >
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>

      <h1 className="text-xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Left: main content */}
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input placeholder="Post title..." {...register("title")} />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Slug</Label>
            <Input
              placeholder="post-url-slug"
              {...register("slug")}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setValue("slug", e.target.value);
              }}
            />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">
              URL: /blog/<strong>{watch("slug") || "your-post-slug"}</strong>
            </p>
          </div>

          <div className="space-y-1">
            <Label>Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
          </div>

          <Controller
            name="seo"
            control={control}
            render={({ field }) => (
              <SEOFields value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Right: settings sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {status === "scheduled" && (
              <div className="space-y-1">
                <Label>Schedule Date & Time</Label>
                <Input type="datetime-local" {...register("scheduledAt")} />
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <Controller
              name="category"
              control={control}
              render={({ field: catField }) => (
                <Controller
                  name="tags"
                  control={control}
                  render={({ field: tagsField }) => (
                    <CategoryTagInput
                      category={catField.value}
                      tags={tagsField.value}
                      onCategoryChange={catField.onChange}
                      onTagsChange={tagsField.onChange}
                    />
                  )}
                />
              )}
            />
            {errors.category && (
              <p className="text-destructive text-xs mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>
      </form>

      {/* Unsaved changes warning */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-foreground text-background px-4 py-2 text-sm shadow-lg">
          You have unsaved changes
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify editor works**

```bash
npm run dev
```

Navigate to `http://localhost:8080/admin/blog/create`.
- Type a title — slug should auto-generate.
- Write content in the editor.
- Click "Save Draft" — should show success toast and redirect to blog list.
- Click a post's Edit button — editor should pre-fill with existing content.

- [ ] **Step 3: Commit**

```bash
git add src/admin/blog/BlogEditorPage.tsx
git commit -m "feat(admin): add blog editor page with Tiptap and auto-slug"
```

---

## Task 21: Blog preview page

**Files:**
- Create: `src/admin/blog/BlogPreviewPage.tsx`

- [ ] **Step 1: Create `src/admin/blog/BlogPreviewPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link as TiptapLink from "@tiptap/extension-link";
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
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/blog/BlogPreviewPage.tsx
git commit -m "feat(admin): add blog preview page"
```

---

## Task 22: Notifications store and page

**Files:**
- Create: `src/admin/notifications/useNotificationStore.ts`
- Create: `src/admin/notifications/NotificationsPage.tsx`

- [ ] **Step 1: Create `src/admin/notifications/useNotificationStore.ts`**

```ts
import { create } from "zustand";
import type { Notification } from "../types";
import { notificationApi } from "../mock/api";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const notifications = await notificationApi.getAll();
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      isLoading: false,
    });
  },

  markAsRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
  },

  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications, unreadCount: 0 });
  },
}));
```

- [ ] **Step 2: Create `src/admin/notifications/NotificationsPage.tsx`**

```tsx
import { useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../shared/components/PageHeader";
import { EmptyState } from "../shared/components/EmptyState";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { useNotificationStore } from "./useNotificationStore";
import { cn } from "@/lib/utils";

const typeStyles = {
  success: "border-l-green-500",
  warning: "border-l-yellow-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
};

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) return <SkeletonLoader rows={5} />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        description="Stay updated on your content activity"
        action={
          notifications.some((n) => !n.read) ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border-l-4 bg-card p-4 cursor-pointer transition-opacity",
                typeStyles[n.type],
                n.read && "opacity-60"
              )}
            >
              <div className="flex-1">
                <p className={cn("text-sm font-medium", !n.read && "font-semibold")}>
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.read && (
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Initialize notifications on app start**

Open `src/admin/layout/AdminLayout.tsx` and add this effect to load notifications when the layout mounts:

```tsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";          // add
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useUIStore } from "./useUIStore";
import { useNotificationStore } from "../notifications/useNotificationStore";   // add

export default function AdminLayout() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);  // add

  useEffect(() => {                         // add
    fetchNotifications();                   // add
  }, [fetchNotifications]);                 // add

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/admin/notifications/ src/admin/layout/AdminLayout.tsx
git commit -m "feat(admin): add notifications store and page"
```

---

## Task 23: Profile page

**Files:**
- Create: `src/admin/profile/ProfilePage.tsx`

- [ ] **Step 1: Create `src/admin/profile/ProfilePage.tsx`**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "../shared/components/PageHeader";
import { useAuthStore } from "../auth/useAuthStore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuthStore();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "A";

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  const onSubmit = () => {
    toast.success("Profile updated. (Mock — no backend yet)");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="Profile" description="Manage your account details" />

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role.replace("_", " ")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label>Full Name</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={!isDirty}>Save Changes</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/admin/profile/ProfilePage.tsx
git commit -m "feat(admin): add profile page"
```

---

## Task 24: Final verification

- [ ] **Step 1: Run all tests**

```bash
npm run test:run
```

Expected: all tests PASS with 0 failures.

- [ ] **Step 2: Start dev server and verify all routes**

```bash
npm run dev
```

Check each route manually:

| URL | Expected |
|---|---|
| `/admin/login` | Login form |
| `/admin/forgot-password` | Forgot password form |
| `/admin/reset-password` | Reset password form |
| `/admin/dashboard` (not logged in) | Redirects to `/admin/login` |
| Log in as `admin@mymquid.com / admin123` | Redirects to dashboard |
| `/admin/dashboard` | Stats, chart, activity, quick actions |
| `/admin/blog` | Table of 10 posts with search/filter/pagination |
| `/admin/blog/create` | Blank editor with all fields |
| Edit a post | Editor pre-filled with post data |
| Preview a post | Rendered HTML content |
| `/admin/notifications` | 3 notifications, mark-as-read works |
| `/admin/profile` | User info form |
| Logout from avatar dropdown | Returns to login |
| Log in as `staff@mymquid.com / staff123` | No delete buttons visible |
| Toggle sidebar collapse button | Sidebar collapses to icons |
| Toggle dark mode | Theme switches, persists on refresh |
| `/` (public site) | Existing site unaffected |

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(admin): Phase 1 complete — auth, dashboard, blog management"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Auth system (Login, ForgotPassword, ResetPassword, guards, roles)
- ✅ Dashboard home (stats, chart, activity, quick actions)
- ✅ Blog management (list, create, edit, preview, draft/publish/schedule, SEO, tags, categories)
- ✅ Mock data layer (api.ts swap-ready for NestJS)
- ✅ Notifications (list, mark read, unread badge in TopNav)
- ✅ Profile page
- ✅ Layout (sidebar, topnav, breadcrumbs, collapse, dark/light mode, mobile drawer)
- ✅ Shared components (DataTable, StatCard, SkeletonLoader, EmptyState, PageHeader, ConfirmModal)
- ✅ Shared hooks (useDebounce, usePagination)
- ✅ Role-based access (delete hidden for Staff, role stored in auth store)
- ✅ Zustand stores (auth, UI, blog, notifications)
- ✅ Tests (mock API, auth store, blog store, DataTable, hooks)
