import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const team = [
  { name: "Adaeze Okafor", role: "Chief Executive Officer", bio: "15 years scaling fintech and logistics infrastructure across West Africa." },
  { name: "Tunde Bakare", role: "Chief Technology Officer", bio: "Ex-AWS principal engineer. Architected payment rails for Tier-1 banks." },
  { name: "Sofia Mensah", role: "Head of Cyber Security", bio: "Former CISO. Leads our zero-trust and SOC practice." },
  { name: "Ifeanyi Chukwu", role: "Head of Cloud Engineering", bio: "Multi-cloud architect specialising in cost-optimised Kubernetes platforms." },
  { name: "Maya Adebola", role: "Head of Managed Services", bio: "Built our 24/7 NOC from the ground up. ITIL v4 expert." },
  { name: "Kwame Osei", role: "Head of Product Engineering", bio: "Ships React, Node and React Native at scale for enterprise clients." },
];

export default function Team() {
  useDocumentMeta({
    title: "Team — Mquid",
    description: "Meet the operators, engineers and security leaders behind Mquid.",
  });

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Team</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">The people</span><br/>
            <span className="font-display italic text-primary">behind the platform.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Operators, engineers and security leaders with deep tenure at the companies our clients aspire to be.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((p) => (
            <div key={p.name} className="card-elevated rounded-3xl p-7">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center font-display text-2xl text-primary-foreground">
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h3 className="mt-5 text-lg font-medium">{p.name}</h3>
              <p className="text-sm text-primary">{p.role}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition">
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Want to join us?</h3>
            <p className="text-muted-foreground mt-2">We're hiring across engineering, security and ops.</p>
          </div>
          <Link to="/careers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            See open roles <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
