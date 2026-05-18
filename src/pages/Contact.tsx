import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, Mail, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export default function Contact() {
  useDocumentMeta({
    title: "Contact — Mquid",
    description: "Schedule a free consultation. We respond in under 3 minutes.",
  });

  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs uppercase tracking-widest text-primary">Contact</span>
            <h1 className="mt-3 text-5xl sm:text-6xl font-medium tracking-tighter">
              <span className="text-gradient">Let's build</span><br/>
              <span className="font-display italic text-primary">what's next.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-md">
              We answer in under 3 minutes. Tell us about your stack — we'll prepare a tailored proposal within 48 hours.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Phone, label: "Call us", value: "+234 810 943 9770", href: "tel:+23408109439770" },
                { icon: Mail, label: "Email", value: "hello@mymquid.com", href: "mailto:hello@mymquid.com" },
                { icon: MapPin, label: "Headquarters", value: "Lagos, Nigeria" },
              ].map((c) => (
                <a key={c.label} href={c.href} className="flex items-center gap-4 group">
                  <div className="h-11 w-11 rounded-xl glass grid place-items-center">
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="font-medium group-hover:text-primary transition">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 card-elevated rounded-2xl p-6">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground">What happens next</h3>
              <ol className="mt-4 space-y-3">
                {["We schedule a call at your convenience","Discovery & consulting meeting","Tailored proposal within 48 hours"].map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/15 text-primary text-xs grid place-items-center font-mono flex-none mt-0.5">{i+1}</span>
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="card-elevated rounded-3xl p-8 sm:p-10 sticky top-28">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-5 text-2xl font-medium">Thanks — we got it.</h3>
                  <p className="mt-2 text-muted-foreground text-sm">A member of our team will reach out within one business day.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-medium">Schedule a free consultation</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="First name" />
                    <Field label="Last name" />
                  </div>
                  <Field label="Company / Organization" />
                  <Field label="Company email" type="email" />
                  <Field label="Phone" type="tel" />
                  <div>
                    <label className="text-xs text-muted-foreground">How can we help?</label>
                    <select className="mt-1.5 w-full bg-surface border-hairline rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Managed Services","IT Consulting & Advisory","Cyber Security","Web Development","Mobile Development","Cloud Services","Other"].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Message</label>
                    <textarea rows={4} className="mt-1.5 w-full bg-surface border-hairline rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                  </div>
                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition glow">
                    Send request <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-muted-foreground text-center">By submitting you agree to our terms & privacy policy.</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} className="mt-1.5 w-full bg-surface border-hairline rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
