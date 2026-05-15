# Implementation Plan: React Router Migration

**Spec:** `docs/superpowers/specs/2026-05-15-react-router-migration-design.md`
**Date:** 2026-05-15

Each step is self-contained. Complete them in order.

---

## Step 1 — Update dependencies

Uninstall TanStack packages, install React Router.

```bash
npm uninstall @tanstack/react-router @tanstack/react-start @tanstack/router-plugin @tanstack/react-query @lovable.dev/vite-tanstack-config
npm install react-router-dom
```

---

## Step 2 — Replace `vite.config.ts`

Delete the current contents and replace with a standard Vite config.

**`vite.config.ts`**
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
```

---

## Step 3 — Create `index.html`

Create this file in the project root (same level as `package.json`).

**`index.html`**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mquid</title>
    <script>
      (function(){try{var t=localStorage.getItem('mquid-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Step 4 — Create `src/main.tsx`

Create a new file at `src/main.tsx`. This is the app entry point.

**`src/main.tsx`**
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./styles.css";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Industries from "@/pages/Industries";
import Partners from "@/pages/Partners";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import Team from "@/pages/Team";
import WhyUs from "@/pages/WhyUs";
import NotFound from "@/pages/NotFound";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
```

---

## Step 5 — Create `src/pages/` and migrate each page

Create a `src/pages/` folder. For each file below:
- Copy the component function from `src/routes/`
- Remove the `createFileRoute` / `Route` export at the bottom
- Change `import { ..., Link } from "@tanstack/react-router"` → `import { Link } from "react-router-dom"`
- Make the component the `default export`

### 5a — `src/pages/Home.tsx`
The `Home` component already lives in `src/components/site/Home.tsx` and has no TanStack imports. Just re-export it:

```tsx
export { Home as default } from "@/components/site/Home";
```

### 5b — `src/pages/About.tsx`
```tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Target, Eye, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";

export default function About() {
  // paste the full Page() function body here, unchanged
}
```

### 5c — `src/pages/Blog.tsx`
Same pattern — copy `Page()`, rename to `Blog`, make it default export, fix the Link import.

### 5d — `src/pages/Careers.tsx`
Same pattern.

### 5e — `src/pages/Contact.tsx`
Same pattern.

### 5f — `src/pages/Industries.tsx`
Same pattern.

### 5g — `src/pages/Partners.tsx`
Same pattern.

### 5h — `src/pages/Solutions.tsx`
Same pattern — also fix Link import and `<Link to="/solutions/$slug" params={{ slug: s.slug }}>` → `<Link to={`/solutions/${s.slug}`}>`.

### 5i — `src/pages/SolutionDetail.tsx` (was `solutions_.$slug.tsx`)
This page reads the URL param. Two changes:
1. Fix import: `import { useParams, Link, useNavigate } from "react-router-dom"`
2. Replace `const { slug } = Route.useParams()` → `const { slug } = useParams<{ slug: string }>()`
3. Replace `throw notFound()` → use `useNavigate` to redirect to `/` or render a not-found message

```tsx
import { useParams, Link } from "react-router-dom";
import { allBySlug, categoryOf } from "@/lib/solutions-data";
// ... other imports

export default function SolutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = allBySlug[slug ?? ""];

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Solution not found.</p>
      </div>
    );
  }

  // rest of the component unchanged
}
```

### 5j — `src/pages/Team.tsx`
Same pattern.

### 5k — `src/pages/WhyUs.tsx`
Same pattern.

### 5l — `src/pages/NotFound.tsx`
Extract the `NotFoundComponent` from `src/routes/__root.tsx` and make it the default export. Update `Link` import to react-router-dom:

```tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 6 — Update `src/components/site/Header.tsx`

Two changes only:

**Change 1 — imports**
```tsx
// Remove:
import { Link, useRouterState } from "@tanstack/react-router";

// Add:
import { Link, useLocation } from "react-router-dom";
```

**Change 2 — active route detection**
```tsx
// Remove:
const path = useRouterState({ select: (s) => s.location.pathname });

// Add:
const { pathname: path } = useLocation();
```

**Change 3 — dynamic slug links**
In the mega menu, find all instances of:
```tsx
<Link to="/solutions/$slug" params={{ slug: s.slug }}>
```
Replace with:
```tsx
<Link to={`/solutions/${s.slug}`}>
```
Do the same for challenges and industries links in the mega menu and mobile menu.

---

## Step 7 — Delete obsolete files

Delete these files — they are no longer needed:

```
src/routes/__root.tsx
src/routes/index.tsx
src/routes/about.tsx
src/routes/blog.tsx
src/routes/careers.tsx
src/routes/contact.tsx
src/routes/industries.tsx
src/routes/partners.tsx
src/routes/solutions.tsx
src/routes/solutions_.$slug.tsx
src/routes/team.tsx
src/routes/why-us.tsx
src/routeTree.gen.ts
src/router.tsx
src/server.ts
src/start.ts
wrangler.jsonc
```

You can delete the entire `src/routes/` folder once all pages have been moved to `src/pages/`.

---

## Step 8 — Run the app and verify

```bash
npm run dev
```

Check each route in the browser:
- `/` — Home
- `/about`
- `/solutions`
- `/solutions/managed-services`
- `/solutions/cyber-security`
- `/blog`
- `/contact`
- Any unknown path → 404 page
- Dark/light theme toggle still works
- Nav links highlight correctly on active page

---

## Step 9 — Commit

```bash
git add -A
git commit -m "Migrate from TanStack Router to React Router v6 SPA"
```
