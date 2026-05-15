# React Router Migration Design

**Date:** 2026-05-15
**Project:** Mquid Elevate (mymquid-elevate)
**Status:** Approved

## Goal

Migrate from TanStack Router + TanStack Start + Lovable platform config to a standard React Router v6 SPA. This removes platform lock-in, fixes widespread TypeScript red underlines caused by `@lovable.dev/vite-tanstack-config`, and produces a codebase any junior developer can understand and contribute to immediately.

## Root Cause of Red Underlines

`@lovable.dev/vite-tanstack-config` is a Lovable.dev platform-specific package that does not resolve correctly in a local VSCode environment. Because `vite.config.ts` imports from it, TypeScript cannot resolve the module, cascading errors across the entire project.

## Approach

React Router v6 SPA with a standard Vite config. No SSR. No file-based routing magic. Routes defined explicitly in `src/main.tsx`.

## Packages

### Remove
- `@tanstack/react-router`
- `@tanstack/react-start`
- `@tanstack/router-plugin`
- `@tanstack/react-query`
- `@lovable.dev/vite-tanstack-config`

### Add
- `react-router-dom` v6

### Keep (unchanged)
- `framer-motion`
- `tailwindcss` + `@tailwindcss/vite`
- `lucide-react`
- All `@radix-ui/*` packages
- `@vitejs/plugin-react`
- `vite-tsconfig-paths`
- All other UI/utility packages

## Folder Structure

```
src/
├── assets/
├── components/
│   ├── site/            # Header, Footer, Layout, PageLoader
│   └── ui/              # shadcn components — untouched
├── pages/               # one file per page
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── Careers.tsx
│   ├── Contact.tsx
│   ├── Industries.tsx
│   ├── Partners.tsx
│   ├── Solutions.tsx
│   ├── SolutionDetail.tsx
│   ├── Team.tsx
│   ├── WhyUs.tsx
│   └── NotFound.tsx
├── lib/
│   ├── solutions-data.ts
│   └── utils.ts
├── main.tsx
└── index.css
```

## Files Added

### `index.html` (new — root of project)
TanStack Start generates the HTML shell at runtime via `RootShell`. A standard Vite SPA needs a real `index.html` in the project root. It must include the theme init script (prevents flash of wrong theme on load):

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

### `src/main.tsx`
App entry point. Mounts React, wraps with `<BrowserRouter>`, and declares all routes. Also wraps with `ThemeProvider` (moved here from `__root.tsx`):

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./styles.css";
import Home from "@/pages/Home";
import About from "@/pages/About";
// ... all pages
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

### `vite.config.ts`
Standard config — replaces the Lovable platform wrapper:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
```

### `index.html`
Update `<script>` src from TanStack Start entry to `src/main.tsx`.

## Files Removed

| File | Reason |
|------|--------|
| `src/routeTree.gen.ts` | Auto-generated TanStack file |
| `src/router.tsx` | TanStack router factory |
| `src/routes/__root.tsx` | TanStack root shell — replaced by `index.html` + `main.tsx` |
| `src/server.ts` | SSR entry — no longer needed |
| `src/start.ts` | TanStack Start entry — no longer needed |
| `wrangler.jsonc` | Cloudflare Workers SSR config — going SPA |

## Files Modified

### `src/routes/*` → `src/pages/*`
Each route file is renamed and simplified. The `createFileRoute` export is removed; the page component becomes the default export.

```tsx
// Before (TanStack)
export const Route = createFileRoute("/about")({ component: Page });
function Page() { ... }

// After (React Router)
export default function About() { ... }
```

### `src/components/site/Header.tsx`
Two changes only:
1. Swap imports: `Link`, `useRouterState` from `@tanstack/react-router` → `Link`, `useLocation` from `react-router-dom`
2. Replace TanStack param syntax: `<Link to="/solutions/$slug" params={{ slug }}>` → `<Link to={`/solutions/${slug}`}>`

### `src/pages/SolutionDetail.tsx` (was `solutions_.$slug.tsx`)
One change: `Route.useParams()` → `useParams()` from `react-router-dom`.

```tsx
import { useParams } from "react-router-dom";
const { slug } = useParams<{ slug: string }>();
```

## Deployment

Going SPA means the build output is a static `dist/` folder. Deploy to:
- **Cloudflare Pages** (recommended — free, fast, same CDN)
- Netlify, Vercel, or any static host

For Cloudflare Pages, add a `_redirects` file or configure the Pages project to serve `index.html` for all routes (handles client-side navigation on hard refresh).

## What Stays the Same

- All page UI and component logic
- All shadcn/ui components
- All Tailwind CSS styles and design tokens
- Framer Motion animations
- `src/lib/solutions-data.ts`
- Theme provider (light/dark)
- All `@radix-ui` components
