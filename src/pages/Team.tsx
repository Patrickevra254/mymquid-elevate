import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";

type Member = { name: string; role: string; bio?: string; gender?: "male" | "female" };

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map(n => n[0].toUpperCase()).join("");

const leadership: Member[] = [
  { name: "Chijoke Okafor", role: "CEO", bio: "MD/CEO overseeing business operations and premier services including Cyber Security, Network Operations, Global Service Desks, Professional Services and Field Engineering. 20+ years in mid-market service delivery for MSPs and VARs.", gender: "male" },
  { name: "Dalton Chukwumam", role: "CTO", bio: "Accomplished IT leader with three decades of experience building industry-leading technology companies. Drives MQUID's strategic vision as the partner of choice for mid-market strategic buyers of IT.", gender: "male" },
  { name: "Precious Nnam", role: "Marketing Director", bio: "Customer-focused, insights-driven leader covering branding, communications, demand generation, customer engagement and partner marketing.", gender: "female" },
  { name: "Victoria Enema", role: "Project Manager", bio: "Coordinates delivery across engineering, support and client teams to keep projects on time and on budget.", gender: "female" },
];

const developers: Member[] = [
  { name: "Henry Onuorah", role: "Senior Software Developer", gender: "male" },
  { name: "Uchendu Samuel", role: "Software Developer", gender: "male" },
  { name: "Happy Asiriuwa", role: "Software Developer", gender: "male" },
  { name: "Oluwatobi Adesina", role: "Software Developer", gender: "male" },
  { name: "Bassey Eno", role: "Software Developer", gender: "male" },
  { name: "Adesanya Oluwagbenga", role: "Software Developer", gender: "male" },
  { name: "Patrick Chukwudi", role: "Software Developer", gender: "male" },
  { name: "Nnam Precious", role: "Software Developer", gender: "female" },
];

const itSupport: Member[] = [
  { name: "Michael Obiosio", role: "Application Support", gender: "male" },
  { name: "Segun Kadri", role: "Application Support / Hardware Engineer", gender: "male" },
  { name: "Evelyn Agholor", role: "Financial Accountant", gender: "female" },
];

function MemberCard({ p }: { p: Member }) {
  return (
    <div className="card-elevated rounded-3xl p-7">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center font-display text-2xl text-primary-foreground">
        {getInitials(p.name)}
      </div>
      <h3 className="mt-5 text-lg font-medium">{p.name}</h3>
      <p className="text-sm text-primary">{p.role}</p>
      {p.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.bio}</p>}
      <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition">
        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
      </a>
    </div>
  );
}

function Section({ title, members }: { title: string; members: Member[] }) {
  return (
    <div className="mt-14">
      <h2 className="text-2xl font-medium tracking-tight mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((p) => <MemberCard key={p.name} p={p} />)}
      </div>
    </div>
  );
}

export default function Team() {
  useDocumentMeta({
    title: "Team — Mquid",
    description: "Meet the leadership, developers and support team behind Mquid.",
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
            Operators, engineers and support leaders delivering Cyber Security, Network Operations and Professional Services for our clients.
          </p>
        </motion.div>

        <Section title="Leadership" members={leadership} />
        <Section title="Developers" members={developers} />
        <Section title="IT Support & Operations" members={itSupport} />

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
