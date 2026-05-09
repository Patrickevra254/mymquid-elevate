import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Workflow, Cpu, Shield, Cloud, Code2, Smartphone,
  ArrowUpRight, CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

const items = [
  { icon: Workflow, title: "Managed Services", tag: "24/7 ops",
    desc: "Free up your team. We handle day-to-day support, monitoring and automation across your stack.",
    bullets: ["Service desk & SLA-backed support", "Patching & lifecycle management", "Backup, DR & continuity"] },
  { icon: Cpu, title: "IT Consulting & Advisory", tag: "Strategy",
    desc: "The right technology, properly implemented and managed, leads to significant gains in growth.",
    bullets: ["Architecture review", "Vendor selection", "Digital transformation roadmaps"] },
  { icon: Shield, title: "Cyber Security", tag: "Zero-trust",
    desc: "Identify vulnerabilities, assess risks, and implement robust security to safeguard systems and data.",
    bullets: ["Penetration testing", "SOC monitoring", "Compliance & audits"] },
  { icon: Cloud, title: "Cloud Services", tag: "Multi-cloud",
    desc: "Architect, migrate, and optimize multi-cloud workloads with cost and performance in mind.",
    bullets: ["AWS · Azure · GCP", "FinOps & cost optimization", "Kubernetes & containers"] },
  { icon: Code2, title: "Web Development", tag: "Performance",
    desc: "Establish an impactful online presence and reach your target audience effectively.",
    bullets: ["Marketing sites & e-commerce", "Headless CMS", "Conversion optimization"] },
  { icon: Smartphone, title: "Mobile Development", tag: "Native",
    desc: "Customized mobile apps aligned with your brand across iOS and Android.",
    bullets: ["React Native & native", "App store deployment", "Push & analytics"] },
];

function Page() {
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
            Six interlocking practices, one accountable partner. Pick a module — or run the entire stack on Mquid.
          </p>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-4">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-elevated rounded-3xl p-8 hover:border-primary/30 transition"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl glass grid place-items-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs glass rounded-full px-3 py-1 text-muted-foreground">{s.tag}</span>
              </div>
              <h3 className="mt-6 text-2xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {b}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all">
                Talk to an expert <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Mquid" },
      { name: "description", content: "Managed services, cybersecurity, cloud, consulting, web and mobile — all under one roof." },
      { property: "og:title", content: "Solutions — Mquid" },
      { property: "og:description", content: "A complete operating layer for modern teams." },
    ],
  }),
  component: Page,
});
