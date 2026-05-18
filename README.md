# Mquid — Developer Guide

Welcome! This guide explains how the project is organized so you can find your way around on day one.

## Tech stack (the short version)

- **React 19** — UI library
- **TanStack Start + TanStack Router** — file-based routing with SSR (think Next.js, but lighter)
- **Vite 7** — bundler / dev server
- **Tailwind CSS v4** — styling (configured in `src/styles.css`, no `tailwind.config.js`)
- **shadcn/ui** — pre-built accessible components in `src/components/ui/`
- **Framer Motion** — animations
- **Lovable Cloud** (Supabase under the hood) — backend, when needed

## Folder structure

```
src/
├── routes/              ← Every file here = a page (URL)
│   ├── __root.tsx       ← App shell (wraps every page)
│   ├── index.tsx        ← "/"        (home page)
│   ├── about.tsx        ← "/about"
│   ├── contact.tsx      ← "/contact"
│   ├── solutions.tsx    ← "/solutions"
│   └── solutions_.$slug.tsx  ← "/solutions/anything"  ($slug = URL param)
│
├── components/
│   ├── site/            ← App-specific components (Header, Footer, Home, PageLoader)
│   ├── ui/              ← shadcn primitives (Button, Card, Dialog…) — don't edit
│   └── theme-provider.tsx
│
├── lib/                 ← Data + helpers (solutions-data.ts, utils.ts)
├── hooks/               ← Reusable React hooks
├── styles.css           ← Global styles + Tailwind theme tokens (colors, fonts)
└── routeTree.gen.ts     ← AUTO-GENERATED. Never edit by hand.
```

### The golden rule of routing

**To add a new page, create a file in `src/routes/`.** That's it.

| File name                       | URL                          |
|---------------------------------|------------------------------|
| `src/routes/pricing.tsx`        | `/pricing`                   |
| `src/routes/blog.tsx`           | `/blog`                      |
| `src/routes/blog.$postId.tsx`   | `/blog/:postId` (dynamic)    |
| `src/routes/settings.profile.tsx` | `/settings/profile` (nested) |

Each route file looks like this:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Mquid" },
      { name: "description", content: "Our pricing plans." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <Layout>
      <h1>Pricing</h1>
    </Layout>
  );
}
```

### Linking between pages

Always use `<Link>` from TanStack Router — **not** `<a href>` — so navigation stays fast and client-side:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
<Link to="/solutions/$slug" params={{ slug: "cybersecurity" }}>Cybersecurity</Link>
```

> ⚠️ Do **not** write `` <Link to={`/solutions/${slug}`}> `` — always pass `params`.

## Common tasks

### Add a new page
1. Create `src/routes/your-page.tsx` (follow the template above).
2. Add a `<Link to="/your-page">` somewhere (e.g. in `src/components/site/Header.tsx`).
3. Save — TanStack auto-generates `routeTree.gen.ts`. Done.

### Add a new section to an existing page
Edit the page file directly. Sections are just JSX inside the page's component.

### Add a UI component
- If shadcn has it → run `bunx shadcn@latest add <name>` (lands in `src/components/ui/`).
- If it's app-specific → create it in `src/components/site/`.

### Change colors, fonts, theme
Edit `src/styles.css`. All design tokens live there as CSS variables (`--background`, `--primary`, etc.). Use them in components as Tailwind classes: `bg-background`, `text-primary`.

> ⚠️ Never hard-code colors like `bg-white` or `text-[#3b82f6]` in components. Use the semantic tokens so light/dark themes work automatically.

### Add data
Static data → `src/lib/`. See `solutions-data.ts` as the pattern.
Dynamic data (database) → ask the lead to enable Lovable Cloud first.

## Running the project

```bash
bun install      # install dependencies
bun run dev      # start dev server (Lovable does this automatically)
```

## Things NOT to do

- ❌ Don't edit `src/routeTree.gen.ts` — it's auto-generated.
- ❌ Don't add `BrowserRouter` or `react-router-dom` — we use TanStack Router.
- ❌ Don't put pages in `src/pages/` — they go in `src/routes/`.
- ❌ Don't hard-code colors — use design tokens from `src/styles.css`.
- ❌ Don't use `<a href="/about">` for internal links — use `<Link to="/about">`.

## Where to ask for help

- **TanStack Router docs:** https://tanstack.com/router
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind v4:** https://tailwindcss.com/docs
- **Lovable docs:** https://docs.lovable.dev
