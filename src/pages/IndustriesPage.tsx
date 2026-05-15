import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Building2, Truck, HeartPulse, Landmark, Briefcase, HandHeart, GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { industries } from "@/lib/solutions-data";

const iconBySlug: Record<string, typeof Building2> = {
  "industry-manufacturing": Building2,
  "transportation-logistics": Truck,
  "healthcare": HeartPulse,
  "banks-insurance": Landmark,
  "consulting-providers": Briefcase,
  "non-profit": HandHeart,
  "education": GraduationCap,
};

export function IndustriesPage() {
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
          {industries.map((ind, i) => {
            const Icon = iconBySlug[ind.slug] ?? Building2;
            return (
              <motion.div key={ind.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link to="/solutions/$slug" params={{ slug: ind.slug }}
                  className="group relative card-elevated rounded-3xl p-8 overflow-hidden hover:border-primary/30 transition block h-full">
                  <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition" />
                  <div className="relative">
                    <Icon className="h-7 w-7 text-primary" />
                    <h3 className="mt-6 text-xl font-medium tracking-tight">{ind.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                      Explore <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
