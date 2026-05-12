import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";
import { Layout } from "@/components/site/Layout";

const roles = [
  { title: "Senior Cloud Engineer", team: "Cloud", location: "Lagos · Hybrid", type: "Full-time" },
  { title: "SOC Analyst (Tier 2)", team: "Security", location: "Remote · Africa", type: "Full-time" },
  { title: "Site Reliability Engineer", team: "Managed Services", location: "Lagos · On-site", type: "Full-time" },
  { title: "Senior React Engineer", team: "Product", location: "Remote · Global", type: "Full-time" },
  { title: "Account Executive — Enterprise", team: "Go-to-market", location: "Lagos · Hybrid", type: "Full-time" },
  { title: "Engineering Internship", team: "Rotation", location: "Lagos · On-site", type: "12 months" },
];

const perks = [
  ["Senior comp", "Top 10% of market with equity for principals."],
  ["Real ownership", "Pods of 4–6, you ship to production weekly."],
  ["Learning budget", "$3,000/yr for courses, conferences, certs."],
  ["Wellness", "Private health, mental health & 30 days PTO."],
];

function Page() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Careers</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">Build the infrastructure</span><br/>
            <span className="font-display italic text-primary">a continent runs on.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Join a senior team shipping mission-critical systems for the enterprises shaping Africa's next decade.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map(([t, d]) => (
            <div key={t} className="card-elevated rounded-2xl p-6">
              <h3 className="text-base font-medium text-primary">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-medium">Open roles</h2>
        <div className="mt-6 card-elevated rounded-3xl divide-y divide-border overflow-hidden">
          {roles.map((r) => (
            <a key={r.title} href="#" className="group flex items-center justify-between gap-4 p-6 hover:bg-foreground/5 transition">
              <div>
                <h3 className="text-lg font-medium group-hover:text-primary transition">{r.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {r.team}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {r.location}</span>
                  <span>{r.type}</span>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition" />
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Don't see your role?</h3>
            <p className="text-muted-foreground mt-2">We're always meeting exceptional people.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Send a note <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Mquid" },
      { name: "description", content: "Join the senior team building mission-critical infrastructure for Africa's enterprises." },
      { property: "og:title", content: "Careers — Mquid" },
      { property: "og:description", content: "Open roles in cloud, security, SRE, product and go-to-market." },
    ],
  }),
  component: Page,
});
