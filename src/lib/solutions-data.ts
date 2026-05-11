export type Detail = {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  bullets: string[];
  outcomes?: string[];
};

export const services: Detail[] = [
  { slug: "managed-services", title: "Managed Services", tag: "24/7 ops",
    desc: "Free up your team. We handle day-to-day support, monitoring and automation across your stack.",
    bullets: ["Service desk & SLA-backed support", "Patching & lifecycle management", "Backup, DR & continuity", "Endpoint management"],
    outcomes: ["99.95% uptime guarantees", "<15 min P1 response", "40% lower run-cost"] },
  { slug: "it-consulting", title: "IT Consulting & Advisory", tag: "Strategy",
    desc: "The right technology, properly implemented and managed, leads to significant gains in growth.",
    bullets: ["Architecture review", "Vendor selection", "Digital transformation roadmaps", "Tech due-diligence"],
    outcomes: ["Clear 18-month roadmaps", "De-risked migrations", "CFO-ready TCO models"] },
  { slug: "cyber-security", title: "Cyber Security", tag: "Zero-trust",
    desc: "Identify vulnerabilities, assess risks, and implement robust security to safeguard systems and data.",
    bullets: ["Penetration testing", "SOC monitoring", "Compliance & audits", "Identity & access management"],
    outcomes: ["ISO 27001 ready", "MTTR under 30 min", "Zero-trust by default"] },
  { slug: "web-development", title: "Web Development", tag: "Performance",
    desc: "Establish an impactful online presence and reach your target audience effectively.",
    bullets: ["Marketing sites & e-commerce", "Headless CMS", "Conversion optimization", "Core Web Vitals"],
    outcomes: ["100/100 Lighthouse", "2x conversion lifts", "Sub-second TTFB"] },
  { slug: "mobile-development", title: "Mobile Development", tag: "Native",
    desc: "Customized mobile apps aligned with your brand across iOS and Android.",
    bullets: ["React Native & native", "App store deployment", "Push & analytics", "Offline-first sync"],
    outcomes: ["4.8★ app ratings", "<1% crash-free sessions", "CI/CD on every push"] },
  { slug: "cloud-services", title: "Cloud Services", tag: "Multi-cloud",
    desc: "Architect, migrate, and optimize multi-cloud workloads with cost and performance in mind.",
    bullets: ["AWS · Azure · GCP", "FinOps & cost optimization", "Kubernetes & containers", "IaC with Terraform"],
    outcomes: ["35% cloud-spend reduction", "Auto-scaling SLOs", "Multi-region resilience"] },
];

export const challenges: Detail[] = [
  { slug: "digital-transformation", title: "Digital Transformation", tag: "Modernize",
    desc: "Re-platform legacy systems and unify data into a modern, composable architecture.",
    bullets: ["Legacy app modernization", "API-first integration layer", "Data unification", "Change management"],
    outcomes: ["10x faster releases", "Single source of truth", "Future-ready stack"] },
  { slug: "security", title: "Security",  tag: "Defend",
    desc: "Continuous protection across identities, endpoints, networks and workloads.",
    bullets: ["Threat detection & response", "Zero-trust architecture", "Compliance frameworks", "Tabletop exercises"],
    outcomes: ["Audit-ready posture", "Reduced attack surface", "Insurable risk profile"] },
  { slug: "automation", title: "Automation", tag: "Scale",
    desc: "Eliminate repetitive operations with intelligent workflows and AI co-pilots.",
    bullets: ["Process mining", "RPA & workflow engines", "AI agents", "ITSM automation"],
    outcomes: ["60% time saved", "Fewer manual errors", "24/7 throughput"] },
  { slug: "gaining-efficiency", title: "Gaining Efficiency", tag: "Optimize",
    desc: "Tune cost, performance and team velocity with disciplined operating practices.",
    bullets: ["FinOps reviews", "DevEx improvements", "Observability", "SLO/SLA design"],
    outcomes: ["Lower run-cost", "Faster cycle time", "Predictable delivery"] },
];

export const industries: Detail[] = [
  { slug: "industry-manufacturing", title: "Industry & Manufacturing", tag: "OT/IT",
    desc: "Smart factories, OT/IT convergence, and predictive maintenance.",
    bullets: ["MES & SCADA integration", "Predictive maintenance models", "Edge compute on the floor", "Cyber-physical security"] },
  { slug: "transportation-logistics", title: "Transportation & Logistics", tag: "Realtime",
    desc: "Fleet visibility, real-time routing, and supply-chain resilience.",
    bullets: ["Telematics platforms", "Route optimization", "Warehouse automation", "Track & trace"] },
  { slug: "healthcare", title: "Healthcare", tag: "HIPAA",
    desc: "HIPAA-grade security, EHR integrations, and patient data platforms.",
    bullets: ["EHR/EMR interop", "HIPAA-compliant cloud", "Patient portals", "Clinical analytics"] },
  { slug: "banks-insurance", title: "Banks & Insurance", tag: "Regulated",
    desc: "Core systems, fraud detection, and regulatory automation.",
    bullets: ["Core banking integration", "Fraud & AML detection", "Open banking APIs", "Regulatory reporting"] },
  { slug: "consulting-providers", title: "Consulting Providers", tag: "Knowledge",
    desc: "Knowledge platforms and white-glove client engagement tooling.",
    bullets: ["Client portals", "Knowledge bases", "Time & billing", "Secure collaboration"] },
  { slug: "non-profit", title: "Non-Profit", tag: "Impact",
    desc: "Donor systems, secure outreach and impact reporting at low cost.",
    bullets: ["Donor CRM", "Email & outreach", "Impact dashboards", "Grants management"] },
];

export const allBySlug = Object.fromEntries(
  [...services, ...challenges, ...industries].map((d) => [d.slug, d]),
);
