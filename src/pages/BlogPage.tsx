import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { Layout } from "@/components/site/Layout";

const posts = [
  {
    tag: "Cloud",
    title: "Kubernetes cost in 2026: the FinOps playbook for African enterprises",
    excerpt: "How we cut a Tier-1 bank's compute spend by 42% in 90 days without touching workload performance.",
    read: "8 min", date: "Apr 28, 2026",
  },
  {
    tag: "Security",
    title: "Zero-trust isn't a product — it's an operating model",
    excerpt: "Why most zero-trust rollouts fail at the identity layer, and the four controls that actually move the needle.",
    read: "6 min", date: "Apr 14, 2026",
  },
  {
    tag: "AI",
    title: "Building an internal AI gateway for regulated industries",
    excerpt: "Rate limits, audit trails and PII redaction — the reference architecture we ship to financial-services clients.",
    read: "11 min", date: "Mar 30, 2026",
  },
  {
    tag: "Operations",
    title: "Inside our 3-minute incident response SLA",
    excerpt: "The runbooks, paging stack and on-call culture that let us promise (and deliver) sub-3-minute first response.",
    read: "5 min", date: "Mar 18, 2026",
  },
  {
    tag: "Industry",
    title: "Logistics 2026: the operating layer for cross-border trade",
    excerpt: "From customs APIs to driver telematics — what we learned shipping infrastructure for two pan-African 3PLs.",
    read: "9 min", date: "Mar 02, 2026",
  },
  {
    tag: "Engineering",
    title: "Pragmatic platform engineering for 50-engineer orgs",
    excerpt: "When to invest in an internal developer platform, and the IDP starter kit we use as our baseline.",
    read: "7 min", date: "Feb 18, 2026",
  },
];

export function BlogPage() {
  const [feature, ...rest] = posts;
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Blog</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">Field notes from</span><br/>
            <span className="font-display italic text-primary">the operating layer.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Deep dives, post-mortems and reference architectures from our engineering, security and ops teams.
          </p>
        </motion.div>

        <a href="#" className="group mt-14 block card-elevated rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto bg-gradient-to-br from-primary/30 via-accent/20 to-transparent">
              <div className="absolute inset-0 grid-pattern opacity-40" />
              <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Featured
              </div>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-primary">{feature.tag}</span>
              <h2 className="mt-3 text-3xl font-medium tracking-tight group-hover:text-primary transition">{feature.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{feature.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{feature.date}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{feature.read}</span>
              </div>
            </div>
          </div>
        </a>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((p) => (
            <a key={p.title} href="#" className="group card-elevated rounded-3xl p-7 flex flex-col">
              <span className="text-xs uppercase tracking-widest text-primary">{p.tag}</span>
              <h3 className="mt-4 text-lg font-medium group-hover:text-primary transition">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{p.read}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Subscribe to the changelog.</h3>
            <p className="text-muted-foreground mt-2">One email a month. Engineering essays, no fluff.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Subscribe <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
