import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Building2, Truck, HeartPulse, Landmark, Briefcase, HandHeart,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

const inds = [
  { icon: Building2, name: "Industry & Manufacturing", desc: "Smart factories, OT/IT convergence, and predictive maintenance." },
  { icon: Truck, name: "Transportation & Logistics", desc: "Fleet visibility, real-time routing, and supply-chain resilience." },
  { icon: HeartPulse, name: "Healthcare", desc: "HIPAA-grade security, EHR integrations, and patient data platforms." },
  { icon: Landmark, name: "Banks & Insurance", desc: "Core systems, fraud detection, and regulatory automation." },
  { icon: Briefcase, name: "Consulting Providers", desc: "Knowledge platforms and white-glove client engagement tooling." },
  { icon: HandHeart, name: "Non-Profit", desc: "Donor systems, secure outreach and impact reporting at low cost." },
];

function Page() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Industries</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter text-gradient">
            Solving IT challenges in every industry, every day.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Specialized blueprints for regulated, mission-critical sectors — refined over a decade of deployments.
          </p>
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inds.map((ind, i) => (
            <motion.div key={ind.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative card-elevated rounded-3xl p-8 overflow-hidden hover:border-primary/30 transition">
              <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <ind.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-6 text-xl font-medium tracking-tight">{ind.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Mquid" },
      { name: "description", content: "Industry-specific IT blueprints for healthcare, finance, manufacturing, logistics, and more." },
      { property: "og:title", content: "Industries — Mquid" },
      { property: "og:description", content: "Specialized infrastructure for regulated, mission-critical sectors." },
    ],
  }),
  component: Page,
});
