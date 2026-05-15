import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Shield,
  Cloud,
  Cpu,
  Code2,
  Smartphone,
  Workflow,
  Sparkles,
  Activity,
  Zap,
  CheckCircle2,
  Quote,
  Building2,
  Truck,
  HeartPulse,
  Landmark,
  Briefcase,
  HandHeart,
  TrendingUp,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export function HomePage() {
  return (
    <Layout>
      <Hero />
      <LogoMarquee />
      <Stats />
      <Solutions />
      <Platform />
      <Industries />
      <Testimonials />
      <FAQ />
      <CTA />
    </Layout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-28 sm:pt-24 sm:pb-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground">Now serving 200+ enterprises across Africa</span>
          <Sparkles className="h-3 w-3 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-8 text-5xl sm:text-7xl lg:text-[88px] font-medium leading-[0.95] tracking-tighter"
        >
          <span className="text-gradient">Infrastructure</span>
          <br />
          <span className="font-display italic text-primary">that runs itself.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          Mquid is the operating layer for modern enterprises — combining managed IT,
          cybersecurity, and cloud automation into a single intelligent platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow"
          >
            Schedule a free consultation
            <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition" />
          </Link>
          <Link
            to="/solutions"
            className="inline-flex items-center justify-center gap-2 glass rounded-full px-6 py-3.5 font-medium hover:bg-foreground/10 transition"
          >
            Explore platform <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 mx-auto max-w-4xl"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary/30 via-transparent to-transparent blur-xl" />
      <div className="relative card-elevated rounded-3xl p-3 sm:p-4">
        <div className="rounded-2xl overflow-hidden border-hairline bg-background/60">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
            </div>
            <div className="text-xs font-mono text-muted-foreground">mquid.cloud / overview</div>
            <div className="text-xs text-primary flex items-center gap-1.5">
              <Activity className="h-3 w-3" /> Live
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 p-4">
            {[
              { label: "Uptime", value: "99.99%", trend: "+0.02", icon: Zap },
              { label: "Threats blocked", value: "12,481", trend: "+18%", icon: Shield },
              { label: "Tickets resolved", value: "3m 12s", trend: "−42%", icon: Workflow },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border-hairline bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs text-primary flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {s.trend}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="rounded-xl border-hairline bg-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">System telemetry</span>
                <span className="text-xs text-muted-foreground font-mono">last 24h</span>
              </div>
              <Sparkline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline() {
  const points = [12, 18, 14, 22, 19, 28, 24, 32, 28, 38, 34, 42, 40, 48, 44, 52, 50, 58, 54, 62];
  const max = Math.max(...points);
  const w = 600;
  const h = 80;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.16 165)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.86 0.16 165)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke="oklch(0.86 0.16 165)" strokeWidth="2" />
    </svg>
  );
}

function LogoMarquee() {
  const logos = ["GROOMING", "GHMO", "CREDITSTAR", "GMFB", "ECOSENSE", "SUNLAY", "STAYSAFE", "GC FITNESS"];
  return (
    <section className="py-12 border-y border-border bg-surface/30">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
        Trusted by category-defining teams
      </p>
      <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((l, i) => (
            <span
              key={i}
              className="text-xl font-semibold tracking-widest text-muted-foreground/70 hover:text-foreground transition"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "10+", l: "Years operating" },
    { v: "98%", l: "Customer satisfaction" },
    { v: "3 min", l: "Average response" },
    { v: "200+", l: "Active enterprises" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden card-elevated">
        {stats.map((s) => (
          <motion.div
            {...fadeUp}
            key={s.l}
            className="bg-card p-8 sm:p-10 text-center"
          >
            <div className="font-display text-5xl sm:text-6xl text-primary">{s.v}</div>
            <div className="mt-3 text-sm text-muted-foreground">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const SOLUTIONS = [
  { icon: Workflow, title: "Managed Services", desc: "Offload day-to-day IT operations and automation to a 24/7 team." },
  { icon: Cpu, title: "IT Consulting", desc: "Strategic advisory to align technology with measurable business outcomes." },
  { icon: Shield, title: "Cyber Security", desc: "Proactive threat detection, hardening, and continuous compliance." },
  { icon: Cloud, title: "Cloud Services", desc: "Architect, migrate and optimize multi-cloud workloads at scale." },
  { icon: Code2, title: "Web Development", desc: "Performant web platforms engineered for conversion and growth." },
  { icon: Smartphone, title: "Mobile Development", desc: "Native-grade apps shipped fast across iOS and Android." },
];

function Solutions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...fadeUp} className="max-w-2xl">
        <span className="text-xs uppercase tracking-widest text-primary">Solutions</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight text-gradient">
          Every layer of your stack — engineered, secured, automated.
        </h2>
      </motion.div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOLUTIONS.map((s, i) => (
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            key={s.title}
            className="group relative card-elevated rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 ring-glow"
          >
            <div className="h-11 w-11 rounded-xl glass grid place-items-center mb-5">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            <Link
              to="/solutions"
              className="mt-5 inline-flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition"
            >
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Platform() {
  const features = [
    "AI-assisted incident triage",
    "Continuous compliance monitoring",
    "Zero-touch onboarding",
    "Real-time cost optimization",
    "Multi-region failover",
    "Unified observability",
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div {...fadeUp}>
          <span className="text-xs uppercase tracking-widest text-primary">The Platform</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight">
            One control plane.
            <br />
            <span className="font-display italic text-primary">Infinite leverage.</span>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
            Replace fragmented tools with a single intelligent surface. Mquid OS unifies
            monitoring, security, and automation — designed for teams that move fast
            without breaking compliance.
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary flex-none" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative card-elevated rounded-3xl p-6 animate-float">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Automation flow</span>
              <span className="text-xs font-mono text-primary">running</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Detect anomaly", t: "00:00" },
                { label: "Classify · severity P1", t: "00:02" },
                { label: "Auto-remediate", t: "00:08" },
                { label: "Notify on-call", t: "00:09" },
                { label: "Postmortem drafted", t: "00:14" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 rounded-xl bg-surface border-hairline p-3">
                  <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center text-xs font-mono text-primary">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-sm">{step.label}</span>
                  <span className="text-xs font-mono text-muted-foreground">{step.t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const INDUSTRIES = [
  { name: "Industry & Manufacturing", icon: Building2 },
  { name: "Transportation & Logistics", icon: Truck },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Banks & Insurance", icon: Landmark },
  { name: "Consulting Providers", icon: Briefcase },
  { name: "Non-Profit", icon: HandHeart },
];

function Industries() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-primary">Industries</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight text-gradient">
          Built for regulated, mission-critical operations.
        </h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3">
        {INDUSTRIES.map((ind, i) => (
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            key={ind.name}
            className="group card-elevated rounded-2xl p-6 hover:border-primary/30 transition"
          >
            <ind.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-6 text-lg font-medium">{ind.name}</h3>
            <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition">
              View case study <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STORIES = [
  {
    quote: "Mquid is an example of the way managed services should be done. They do their very best to make sure you succeed. We will continue to be a customer for years to come.",
    name: "Mercy Eyan",
    role: "GC-Fitness",
  },
  {
    quote: "Mquid implemented such a powerful platform that we had no break in service when our clients were locked down during COVID-19. The transition was seamless.",
    name: "Kunle Ade",
    role: "Grooming Centre",
  },
  {
    quote: "Their proactive collaborative approach has been critical in helping us build an IT infrastructure that supports our long-term positioning strategy.",
    name: "Peter Chucks",
    role: "Stay-Safe Facilities",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div {...fadeUp} className="max-w-2xl">
        <span className="text-xs uppercase tracking-widest text-primary">Customer stories</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight">
          Loved by operators who can't afford downtime.
        </h2>
      </motion.div>

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        {STORIES.map((s, i) => (
          <motion.figure
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            key={s.name}
            className="card-elevated rounded-2xl p-6 flex flex-col"
          >
            <Quote className="h-6 w-6 text-primary opacity-60" />
            <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90 flex-1">
              "{s.quote}"
            </blockquote>
            <figcaption className="mt-6 pt-6 border-t border-border">
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.role}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "How fast can you onboard our existing infrastructure?",
    a: "Most clients are fully onboarded within 7 business days. Our discovery, audit and migration framework is built to run in parallel with your live operations — zero downtime.",
  },
  {
    q: "What industries do you specialize in?",
    a: "We focus on regulated, mission-critical sectors: banking & insurance, healthcare, manufacturing, logistics, consulting and non-profits.",
  },
  {
    q: "Do you offer 24/7 support?",
    a: "Yes. Our managed-services tier includes round-the-clock monitoring, incident response, and an average 3-minute response time.",
  },
  {
    q: "How do you price engagements?",
    a: "We price by outcome and footprint, not seats. Schedule a consultation and we'll prepare a tailored proposal within 48 hours.",
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <motion.div {...fadeUp} className="text-center">
        <span className="text-xs uppercase tracking-widest text-primary">FAQ</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight text-gradient">
          Questions, answered.
        </h2>
      </motion.div>
      <div className="mt-12 divide-y divide-border card-elevated rounded-2xl px-2">
        {FAQS.map((f, i) => (
          <details key={i} className="group p-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-medium text-foreground">{f.q}</span>
              <span className="h-7 w-7 rounded-full glass grid place-items-center group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl card-elevated p-10 sm:p-16 text-center">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative">
          <h2 className="text-4xl sm:text-6xl font-medium tracking-tight">
            Run your business <span className="font-display italic text-primary">on autopilot.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Talk to our team. Get a tailored architecture proposal within 48 hours.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-7 py-3.5 rounded-full hover:opacity-90 transition glow"
          >
            Schedule a free consultation <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
