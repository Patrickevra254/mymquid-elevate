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
  { name: "Nkechi Onwuagha", role: "Senior Analyst – Software Architecture and Integration", bio: "Nkechi Onwuagha is a seasoned software architect with a passion for designing and implementing innovative solutions.", gender: "female" },
  { name: "Victoria Enema", role: "Project Manager", bio: "Coordinates delivery across engineering, support and client teams to keep projects on time and on budget.", gender: "female" },
];

const developers: Member[] = [
  { name: "Henry Onuorah", role: "Senior Software Developer", gender: "male", bio: "10 years building scalable enterprise software. Leads architecture decisions across the engineering team, specialising in full-stack development and systems integration for mid-market clients." },
  { name: "Uchendu Samuel", role: "Software Developer", gender: "male", bio: "8 years of experience across frontend and backend development. Delivers robust, maintainable solutions with a strong focus on performance and code quality." },
  { name: "Oluwatobi Adesina", role: "Software Developer", gender: "male", bio: "7 years in software development with deep expertise in building and maintaining client-facing web applications and internal tooling for enterprise environments." },
  { name: "Bassey Eno", role: "Software Developer", gender: "male", bio: "6 years developing modern web and mobile applications. Brings a practical, delivery-focused approach to every project, with experience across agile and managed service environments." },
  { name: "Nnam Precious", role: "Software Developer", gender: "female", bio: "5 years in full-stack development with a keen eye for UI/UX. Builds clean, user-focused interfaces backed by well-structured APIs and reliable data layers." },
  { name: "Adesanya Oluwagbenga", role: "Software Developer", gender: "male", bio: "5 years crafting scalable web solutions. Experienced in JavaScript ecosystems and cloud-integrated applications, with a strong interest in developer tooling and automation." },
  { name: "Patrick Chukwudi", role: "Software Developer", gender: "male", bio: "2 years in professional software development with a fast-growing track record in React and Node.js. Brings fresh perspective and strong fundamentals to the engineering team." },
];

const itSupport: Member[] = [
  { name: "Evelyn Agholor", role: "Financial Accountant", gender: "female", bio: "6 years managing financial operations and reporting in fast-paced technology environments. Ensures financial accuracy, compliance, and operational transparency across the business." },
  { name: "Happy Asiriuwa", role: "IT Support", gender: "male", bio: "5 years providing end-user IT support and infrastructure maintenance. Reliable first-line responder with broad experience resolving hardware, software, and connectivity issues across client environments." },
  { name: "Michael Obiosio", role: "Application Support", gender: "male", bio: "6 years in application support, troubleshooting enterprise software and ensuring system uptime for clients. Experienced in incident management, escalation handling, and user training." },
  { name: "Segun Kadri", role: "Application Support / Hardware Engineer", gender: "male", bio: "5 years bridging application support and hardware engineering. Handles everything from software troubleshooting to physical infrastructure maintenance, keeping client environments running at full capacity." },
  { name: "Okoi Eno", role: "Application Support", gender: "male", bio: "5 years delivering hands-on application support in managed service environments. Skilled in diagnosing issues quickly and communicating clearly with both technical teams and end users." },
];

function MemberCard({ p }: { p: Member }) {
  return (
    <div className="group h-72 [perspective:1000px] cursor-pointer">
      <div className="relative h-full w-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] card-elevated rounded-3xl p-7 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center font-display text-5xl text-primary-foreground">
            {getInitials(p.name)}
          </div>
          <h3 className="mt-5 text-lg font-medium">{p.name}</h3>
          <p className="text-sm text-primary">{p.role}</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card-elevated rounded-3xl p-7 flex flex-col justify-center gap-3">
          <div>
            <h3 className="text-lg font-medium">{p.name}</h3>
            <p className="text-sm text-primary">{p.role}</p>
          </div>
          {p.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">{p.bio}</p>
          )}
          {!p.bio && (
            <p className="text-sm text-muted-foreground">Part of the Mquid team.</p>
          )}
          <a
            href="#"
            onClick={(e) => e.stopPropagation()}
            className="mt-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
          >
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </a>
        </div>

      </div>
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
