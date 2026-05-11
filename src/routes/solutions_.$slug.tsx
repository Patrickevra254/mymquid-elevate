import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { allBySlug } from "@/lib/solutions-data";

function Page() {
  const { slug } = Route.useParams();
  const item = allBySlug[slug];
  if (!item) throw notFound();

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link to="/solutions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" /> Back to Solutions
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="mt-8">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary glass rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3" /> {item.tag}
          </span>
          <h1 className="mt-5 text-5xl sm:text-6xl font-medium tracking-tighter text-gradient">
            {item.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">{item.desc}</p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card-elevated rounded-3xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground">What's included</h3>
            <ul className="mt-6 space-y-3">
              {item.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated rounded-3xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Outcomes</h3>
            <ul className="mt-6 space-y-4">
              {(item.outcomes ?? ["Faster delivery", "Lower risk", "Predictable cost"]).map((o) => (
                <li key={o} className="text-base">
                  <span className="text-primary font-mono text-xs mr-2">→</span>{o}
                </li>
              ))}
            </ul>
            <Link to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-1.5 w-full bg-primary text-primary-foreground text-sm font-medium px-4 py-3 rounded-full hover:opacity-90 transition">
              Talk to an expert <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/solutions_/$slug")({
  head: ({ params }) => {
    const item = allBySlug[params.slug];
    const title = item ? `${item.title} — Mquid` : "Solution — Mquid";
    const desc = item?.desc ?? "Mquid solution detail.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: Page,
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-medium">Solution not found</h1>
        <Link to="/solutions" className="mt-6 inline-block text-primary">Browse all solutions →</Link>
      </div>
    </Layout>
  ),
});
