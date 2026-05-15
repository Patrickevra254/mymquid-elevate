import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Target, Eye, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";

function Page() {
  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">About</span>
          <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
            <span className="text-gradient">A decade of building</span><br/>
            <span className="font-display italic text-primary">resilient enterprises.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Mquid was founded on a simple thesis: businesses shouldn't have to choose between
            growth and operational excellence. We give modern teams the infrastructure leverage
            of a hyperscaler — without the overhead.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {[
            { icon: Target, title: "Our mission",
              text: "Empower business growth through intelligent automation and accountable partnership." },
            { icon: Eye, title: "Our vision",
              text: "An Africa where every enterprise runs on infrastructure as reliable as a utility." },
            { icon: Sparkles, title: "Our values",
              text: "Client-first, transparent, results-driven. We measure our success by yours." },
          ].map((v) => (
            <div key={v.title} className="card-elevated rounded-3xl p-7">
              <v.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 text-lg font-medium">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 card-elevated rounded-3xl p-10 grid md:grid-cols-4 gap-8">
          {[
            ["10+", "Years operating"],
            ["200+", "Enterprises served"],
            ["98%", "Customer satisfaction"],
            ["3 min", "Average response"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-5xl text-primary">{v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 card-elevated rounded-3xl p-10">
          <div>
            <h3 className="text-2xl font-medium">Want to work with us?</h3>
            <p className="text-muted-foreground mt-2">We're always open to ambitious partnerships.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mquid" },
      { name: "description", content: "A decade of building resilient enterprises through intelligent automation." },
      { property: "og:title", content: "About — Mquid" },
      { property: "og:description", content: "Mission, vision and the team behind Mquid." },
    ],
  }),
  component: Page,
});
