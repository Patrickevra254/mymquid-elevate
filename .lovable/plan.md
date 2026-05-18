## Migration Plan: TanStack Start → Vite + React Router DOM

Convert this project to the universally-understood `src/pages/` + `react-router-dom` structure so any junior dev or intern can navigate it on day one.

### Target folder structure

```text
src/
├── main.tsx              ← entry point (ReactDOM.createRoot)
├── App.tsx               ← <BrowserRouter> + <Routes> live here
├── pages/                ← one file per URL
│   ├── Home.tsx          → /
│   ├── About.tsx         → /about
│   ├── Contact.tsx       → /contact
│   ├── Solutions.tsx     → /solutions
│   ├── SolutionDetail.tsx→ /solutions/:slug
│   ├── Industries.tsx    → /industries
│   ├── Partners.tsx      → /partners
│   ├── Careers.tsx       → /careers
│   ├── Team.tsx          → /team
│   ├── WhyUs.tsx         → /why-us
│   ├── Blog.tsx          → /blog
│   └── NotFound.tsx      → 404
├── components/
│   ├── site/             ← Header, Footer, Layout, Home, PageLoader (unchanged)
│   ├── ui/               ← shadcn (unchanged)
│   └── theme-provider.tsx
├── hooks/
├── lib/
├── assets/
└── styles.css            ← unchanged
```

### What changes

1. **Install** `react-router-dom`, remove TanStack Start / Router / Cloudflare worker deps.
2. **Replace** `src/routes/*` with `src/pages/*` — strip `createFileRoute(...)` wrappers, keep page bodies intact.
3. **Rewrite** `src/router.tsx`, `__root.tsx`, `start.ts`, `server.ts` → single `src/App.tsx` with `<BrowserRouter>` + `<Routes>`.
4. **Create** new `src/main.tsx` (standard Vite React entry).
5. **Update imports** project-wide: `@tanstack/react-router` → `react-router-dom` (`Link`, `useNavigate`, `useParams`, `useLocation`, `Outlet`).
6. **Convert `<Link to="/solutions/$slug" params={{slug}}>`** → `<Link to={`/solutions/${slug}`}>`.
7. **Move `head()` SEO meta** into per-page `<Helmet>` via `react-helmet-async` (or a tiny `useDocumentTitle` hook).
8. **Delete** `routeTree.gen.ts`, `wrangler.jsonc`, custom Vite TanStack plugins; simplify `vite.config.ts` to the standard `@vitejs/plugin-react` setup.
9. **Update** `index.html` to point at `/src/main.tsx`.
10. **Rewrite README** to match the new structure.

### Honest trade-offs you're accepting

- ❌ **No SSR** — pages render client-side only. SEO crawlers see an empty shell until JS loads (acceptable for most apps; bad for content-heavy marketing).
- ❌ **No type-safe routes** — typos in `<Link to="/abuot">` won't fail the build.
- ❌ **Lovable template drift** — future Lovable features assuming TanStack Start may need manual wiring.
- ✅ **Familiar to every React dev** — bootcamp-standard layout.
- ✅ **Simpler mental model** — one `App.tsx` shows every route at a glance.
- ✅ **Smaller dep footprint.**

### Risk

Expect 1–2 round-trips of fixing broken imports/visual regressions after the first build. I'll verify the build and walk through each page.

### Confirm to proceed

Reply **"go"** and I'll execute the migration end-to-end in one pass. Reply **"wait"** if you'd rather keep TanStack Start and just polish the README.