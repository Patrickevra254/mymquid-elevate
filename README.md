# Mquid — Developer Guide

Welcome! This project uses a **standard Vite + React + React Router** setup that any React developer will recognize on day one.

## Tech stack

- **React 19** — UI library
- **Vite 7** — bundler / dev server
- **React Router DOM 7** — client-side routing
- **TanStack Query** — data fetching (when needed)
- **Tailwind CSS v4** — styling (configured in `src/styles.css`)
- **shadcn/ui** — accessible component library in `src/components/ui/`
- **Framer Motion** — animations
- **Lovable Cloud** — backend, when needed

## Folder structure

```
src/
├── main.tsx              ← App entry point (mounts React + Router)
├── App.tsx               ← All routes are declared here
│
├── pages/                ← One file per URL
│   ├── Home.tsx          → /
│   ├── About.tsx         → /about
│   ├── WhyUs.tsx         → /why-us
│   ├── Team.tsx          → /team
│   ├── Careers.tsx       → /careers
│   ├── Partners.tsx      → /partners
│   ├── Blog.tsx          → /blog
│   ├── Contact.tsx       → /contact
│   ├── Solutions.tsx     → /solutions
│   ├── SolutionDetail.tsx→ /solutions/:slug
│   ├── Industries.tsx    → /industries
│   └── NotFound.tsx      → 404
│
├── components/
│   ├── site/             ← App-specific (Header, Footer, Layout, Home, PageLoader)
│   ├── ui/               ← shadcn primitives (don't edit)
│   └── theme-provider.tsx
│
├── hooks/                ← Custom React hooks
├── lib/                  ← Data + helpers
├── assets/               ← Images, logos
└── styles.css            ← Global styles + Tailwind theme tokens
```

## How routing works

All routes live in **`src/App.tsx`**. Look there to see every URL in the app.

To add a new page:

1. Create a new file in `src/pages/`, e.g. `Pricing.tsx`:

   ```tsx
   import { Layout } from "@/components/site/Layout";
   import { useDocumentMeta } from "@/hooks/use-document-meta";

   export default function Pricing() {
     useDocumentMeta({ title: "Pricing — Mquid", description: "Our plans." });
     return (
       <Layout>
         <h1>Pricing</h1>
       </Layout>
     );
   }
   ```

2. Register the route in `src/App.tsx`:

   ```tsx
   import Pricing from "@/pages/Pricing";
   // ...
   <Route path="/pricing" element={<Pricing />} />
   ```

3. Link to it from anywhere with React Router's `<Link>`:

   ```tsx
   import { Link } from "react-router-dom";
   <Link to="/pricing">Pricing</Link>
   ```

   For dynamic routes (`/solutions/:slug`):

   ```tsx
   <Link to={`/solutions/${slug}`}>...</Link>
   ```

## Common tasks

### Add a UI component
- shadcn primitive → `bunx shadcn@latest add <name>` (goes into `src/components/ui/`)
- App-specific → create in `src/components/site/`

### Change colors, fonts, theme
Edit `src/styles.css`. All design tokens are CSS variables (`--background`, `--primary`, etc.). Use them as Tailwind classes: `bg-background`, `text-primary`.

> ⚠️ Never hard-code colors like `bg-white` or `text-[#3b82f6]`. Use the semantic tokens so light/dark themes work automatically.

### Add data
- Static → `src/lib/` (see `solutions-data.ts` for the pattern)
- Dynamic → enable Lovable Cloud

## Running the project

```bash
bun install   # install deps
bun run dev   # start dev server (Lovable does this automatically)
bun run build # production build
```

## Things NOT to do

- ❌ Don't hard-code colors — use the design tokens in `src/styles.css`
- ❌ Don't use `<a href="/about">` for internal links — use `<Link to="/about">`
- ❌ Don't put pages outside `src/pages/`
- ❌ Don't forget to register new pages in `src/App.tsx`

## Help & docs

- React Router: https://reactrouter.com
- shadcn/ui: https://ui.shadcn.com
- Tailwind v4: https://tailwindcss.com/docs
- Lovable: https://docs.lovable.dev
