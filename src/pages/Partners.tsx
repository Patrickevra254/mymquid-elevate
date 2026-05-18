import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const partners = [
  { name: "Amazon Web Services", tier: "Advanced Tier Services Partner", color: "from-orange-400/20 to-amber-300/10" },
  { name: "Microsoft", tier: "Solutions Partner — Infrastructure & Security", color: "from-sky-400/20 to-blue-300/10" },
  { name: "Google Cloud", tier: "Premier Partner — Data & Infrastructure", color: "from-emerald-400/20 to-cyan-300/10" },
  { name: "Salesforce", tier: "Consulting Partner — Service Cloud", color: "from-blue-400/20 to-indigo-300/10" },
  { name: "Cisco", tier: "Premier Integrator — Networking & Security", color: "from-cyan-400/20 to-teal-300/10" },
  { name: "Fortinet", tier: "Advanced Partner — SecOps", color: "from-rose-400/20 to-orange-300/10" },
];

const certs = [
  "ISO/IEC 27001:2022", "SOC 2 Type II", "PCI-DSS v4.0",
  "AWS Certified Solutions Architect — Professional",
  "CISSP · CISM · CEH", "ITIL 4 Managing Professional",
  "Microsoft Certified: Cybersecurity Architect Expert", "CKA · CKAD · CKS (Kubernetes)",
];

export default function Partners() {
  useDocumentMeta({
    title: "Partners & Certifications — Mquid",
    description: "Tier-1 platform partnerships with AWS, Microsoft, Google Cloud, Salesforce. ISO 27001, SOC 2 and PCI-DSS certified.",
  });

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Partners & Certifications</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">Tier-1 partnerships.</span><br/>
            <span className="font-display italic text-primary">Audit-grade credentials.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Direct escalation paths to the platforms your business depends on, backed by certifications across security, cloud and operations.
          </p>
        </motion.div>

        <h2 className="mt-16 text-2xl font-medium">Platform partnerships</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <div key={p.name} className={`card-elevated rounded-3xl p-7 bg-gradient-to-br ${p.color}`}>
              <BadgeCheck className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-medium">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tier}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-medium">Certifications & compliance</h2>
        <div className="mt-6 card-elevated rounded-3xl p-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {certs.map((c) => (
            <div key={c} className="flex items-center gap-3 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Need a co-sell or partner intro?</h3>
            <p className="text-muted-foreground mt-2">We collaborate directly with your platform reps.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Talk to partnerships <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
