import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, ShieldCheck, Users, Clock, TrendingUp, Award } from "lucide-react";
import { Layout } from "@/components/site/Layout";

const reasons = [
  { icon: Zap, title: "Speed of execution", desc: "From kickoff to production in weeks, not quarters. Our pods ship outcomes, not slideware." },
  { icon: ShieldCheck, title: "Security-first by default", desc: "Zero-trust architecture, continuous monitoring, and audit-ready compliance baked into every engagement." },
  { icon: Users, title: "Senior-only delivery", desc: "No junior bench. Every project is led by engineers with 8+ years operating mission-critical systems." },
  { icon: Clock, title: "24/7 accountability", desc: "Always-on support with 3-minute average response. We stay on the line until it's solved." },
  { icon: TrendingUp, title: "Outcomes over outputs", desc: "We measure success in your business metrics — uptime, revenue lift, time saved — not hours billed." },
  { icon: Award, title: "Tier-1 partnerships", desc: "Certified partners with AWS, Microsoft, Google Cloud and Salesforce. Direct escalation paths included." },
];

export default function WhyUs() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Why Mquid</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">Senior teams.</span><br/>
            <span className="font-display italic text-primary">Real outcomes.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Six reasons modern enterprises pick Mquid over the legacy SI / agency stack.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((r) => (
            <div key={r.title} className="card-elevated rounded-3xl p-7">
              <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center">
                <r.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-medium">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">See if we're a fit.</h3>
            <p className="text-muted-foreground mt-2">30-minute discovery call. No deck, no pitch.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Book a call <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
