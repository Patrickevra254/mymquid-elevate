import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Zap, Target,
  Layers, MessagesSquare, Cpu, Building2, ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { allBySlug, categoryOf, services, challenges, industries } from "@/lib/solutions-data";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import NotFound from "@/pages/NotFound";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function CategoryBadge({ kind }: { kind: ReturnType<typeof categoryOf> }) {
  const cfg = {
    service: { label: "Service", Icon: Zap },
    challenge: { label: "Business Challenge", Icon: Target },
    industry: { label: "Industry", Icon: Building2 },
    unknown: { label: "Solution", Icon: Sparkles },
  } as const;
  const { label, Icon } = cfg[kind];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-primary glass rounded-full px-3 py-1">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export default function SolutionDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const item = allBySlug[slug];

  useDocumentMeta({
    title: item ? `${item.title} — Mquid` : "Solution — Mquid",
    description: item?.desc ?? "Mquid solution detail.",
  });

  if (!item) return <NotFound />;

  const kind = categoryOf(slug);
  const related =
    kind === "service" ? services.filter((s) => s.slug !== slug).slice(0, 3)
    : kind === "challenge" ? challenges.filter((s) => s.slug !== slug).slice(0, 3)
    : industries.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-14">
          <Link to="/solutions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition">
            <ArrowLeft className="h-4 w-4" /> Back to Solutions
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="mt-8 max-w-4xl">
            <div className="flex items-center gap-2">
              <CategoryBadge kind={kind} />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground glass rounded-full px-3 py-1">
                {item.tag}
              </span>
            </div>
            <h1 className="mt-5 text-5xl sm:text-6xl font-medium tracking-tighter text-gradient">
              {item.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">{item.desc}</p>

            {item.metrics && (
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                {item.metrics.map((m) => (
                  <div key={m.label} className="card-elevated rounded-2xl px-4 py-3">
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                    <div className="mt-1 text-lg font-medium tracking-tight">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid lg:grid-cols-3 gap-4">
          <motion.div {...fadeUp} className="lg:col-span-2 card-elevated rounded-3xl p-8">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Overview</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed">
              {(item.overview ?? [item.desc]).map((p, i) => (
                <p key={i} className="text-foreground/85">{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">What's included</h3>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="card-elevated rounded-3xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Outcomes</h3>
            <ul className="mt-5 space-y-4">
              {(item.outcomes ?? ["Faster delivery", "Lower risk", "Predictable cost"]).map((o) => (
                <li key={o} className="text-base flex items-start gap-2">
                  <span className="text-primary font-mono text-xs mt-1.5">→</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-1.5 w-full bg-primary text-primary-foreground text-sm font-medium px-4 py-3 rounded-full hover:opacity-90 transition">
              Talk to an expert <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Free 30-min consultation · no commitment
            </p>
          </motion.div>
        </div>
      </section>

      {item.capabilities && item.capabilities.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <motion.div {...fadeUp} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg glass grid place-items-center">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight">Capabilities</h2>
          </motion.div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="card-elevated rounded-2xl p-6 hover:border-primary/40 transition group"
              >
                <div className="h-10 w-10 rounded-xl glass grid place-items-center group-hover:text-primary transition">
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-5 text-base font-medium tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {item.process && item.process.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <motion.div {...fadeUp} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg glass grid place-items-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight">How we deliver</h2>
          </motion.div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {item.process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative card-elevated rounded-2xl p-6"
              >
                <div className="font-mono text-xs text-primary">{p.step}</div>
                <h3 className="mt-3 text-base font-medium tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {item.samples && item.samples.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <motion.div {...fadeUp} className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg glass grid place-items-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-2xl font-medium tracking-tight">Sample systems we've built</h2>
              </div>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Reference platforms and accelerators for {item.title.toLowerCase()} — adaptable to your specific workflows and integrations.
              </p>
            </div>
          </motion.div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.samples.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="card-elevated rounded-3xl p-6 hover:border-primary/40 transition group relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-primary">{s.type}</span>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact"
                    className="mt-5 inline-flex items-center gap-1 text-xs text-primary hover:gap-2 transition-all">
                    Request a demo <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {item.faqs && item.faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-14">
          <motion.div {...fadeUp} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg glass grid place-items-center">
              <MessagesSquare className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight">Frequently asked</h2>
          </motion.div>
          <div className="mt-6 space-y-3">
            {item.faqs.map((f, i) => (
              <motion.details
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="card-elevated rounded-2xl p-5 group"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-3 list-none">
                  <span className="font-medium">{f.q}</span>
                  <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </motion.details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            {kind === "industry" ? "Other industries" : kind === "service" ? "Related services" : "Related challenges"}
          </h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} to={`/solutions/${r.slug}`}
                className="card-elevated rounded-2xl p-5 hover:border-primary/40 transition group">
                <div className="text-[11px] uppercase tracking-widest text-primary">{r.tag}</div>
                <div className="mt-2 font-medium group-hover:text-primary transition">{r.title}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <motion.div {...fadeUp}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 card-elevated text-center">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tighter">
              Ready to put <span className="text-gradient-primary">{item.title}</span> to work?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A 30-minute call with one of our solution architects will tell you whether this is a fit — and what the first 90 days could look like.
            </p>
            <Link to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-3 rounded-full hover:opacity-90 transition">
              Book a consultation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
