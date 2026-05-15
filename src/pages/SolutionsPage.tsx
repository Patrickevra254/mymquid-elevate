import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Workflow, Cpu, Shield, Cloud, Code2, Smartphone,
  ArrowUpRight, CheckCircle2, Target, Zap,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { services, challenges, industries } from "@/lib/solutions-data";

const icons: Record<string, typeof Workflow> = {
  "managed-services": Workflow,
  "it-consulting": Cpu,
  "cyber-security": Shield,
  "cloud-services": Cloud,
  "web-development": Code2,
  "mobile-development": Smartphone,
};

export function SolutionsPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Solutions</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter text-gradient">
            A complete operating layer for modern teams.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Six interlocking practices, four business outcomes, and industry-specific blueprints — all under one accountable partner.
          </p>
        </motion.div>

        {/* Services */}
        <div className="mt-16 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg glass grid place-items-center"><Zap className="h-4 w-4 text-primary" /></div>
          <h2 className="text-2xl font-medium tracking-tight">Services</h2>
        </div>
        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          {services.map((s, i) => {
            const Icon = icons[s.slug] ?? Workflow;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card-elevated rounded-3xl p-8 hover:border-primary/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl glass grid place-items-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs glass rounded-full px-3 py-1 text-muted-foreground">{s.tag}</span>
                </div>
                <h3 className="mt-6 text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                <ul className="mt-5 space-y-2">
                  {s.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {b}
                    </li>
                  ))}
                </ul>
                <Link to="/solutions/$slug" params={{ slug: s.slug }}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all">
                  Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Business challenges */}
        <div className="mt-20 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg glass grid place-items-center"><Target className="h-4 w-4 text-primary" /></div>
          <h2 className="text-2xl font-medium tracking-tight">Business Challenges</h2>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenges.map((c, i) => (
            <motion.div key={c.slug}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link to="/solutions/$slug" params={{ slug: c.slug }}
                className="block card-elevated rounded-2xl p-6 h-full hover:border-primary/40 transition group">
                <span className="text-xs text-muted-foreground">{c.tag}</span>
                <h3 className="mt-3 text-lg font-medium tracking-tight group-hover:text-primary transition">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary">Explore <ArrowUpRight className="h-3 w-3" /></span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <div className="mt-20 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg glass grid place-items-center"><Target className="h-4 w-4 text-primary" /></div>
          <h2 className="text-2xl font-medium tracking-tight">Industry Focus</h2>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind, i) => (
            <motion.div key={ind.slug}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link to="/solutions/$slug" params={{ slug: ind.slug }}
                className="block card-elevated rounded-2xl p-6 h-full hover:border-primary/40 transition group">
                <h3 className="text-lg font-medium tracking-tight group-hover:text-primary transition">{ind.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ind.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
