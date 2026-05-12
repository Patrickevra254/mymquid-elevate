export type Sample = {
  name: string;
  type: string;
  desc: string;
  features: string[];
};

export type Detail = {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  bullets: string[];
  outcomes?: string[];
  /** Long-form overview paragraphs */
  overview?: string[];
  /** Step-by-step methodology */
  process?: { step: string; title: string; desc: string }[];
  /** Capability cards (used on detail page grid) */
  capabilities?: { title: string; desc: string }[];
  /** Industry sample systems we've built */
  samples?: Sample[];
  /** FAQs for the page */
  faqs?: { q: string; a: string }[];
  /** Hero metric chips */
  metrics?: { label: string; value: string }[];
};

export const services: Detail[] = [
  {
    slug: "managed-services",
    title: "Managed Services",
    tag: "24/7 ops",
    desc: "Free up your team. We handle day-to-day support, monitoring and automation across your stack.",
    bullets: ["Service desk & SLA-backed support", "Patching & lifecycle management", "Backup, DR & continuity", "Endpoint management"],
    outcomes: ["99.95% uptime guarantees", "<15 min P1 response", "40% lower run-cost"],
    metrics: [
      { label: "Uptime", value: "99.95%" },
      { label: "P1 response", value: "<15m" },
      { label: "Coverage", value: "24/7/365" },
    ],
    overview: [
      "Mquid Managed Services replaces fragmented vendor stacks with a single, accountable operations partner. Our NOC and service desk run on shared SLAs, ITIL-aligned runbooks and observable workflows — so every ticket, alert and change is traceable.",
      "We standardize the boring-but-critical work — patching, backups, identity hygiene, endpoint posture — and automate the rest. Your team gets back to building, while we keep the lights on around the clock.",
    ],
    process: [
      { step: "01", title: "Discover", desc: "Inventory of assets, dependencies, SLAs and risk exposure across your environment." },
      { step: "02", title: "Onboard", desc: "Tooling deployed, runbooks documented, escalation matrix agreed within 30 days." },
      { step: "03", title: "Operate", desc: "24/7 NOC monitoring, SLA reporting, monthly business reviews." },
      { step: "04", title: "Optimize", desc: "Quarterly improvement plans — automate, consolidate, reduce cost." },
    ],
    capabilities: [
      { title: "24/7 Service Desk", desc: "L1–L3 support with phone, chat and ticket channels backed by enterprise SLAs." },
      { title: "Proactive Monitoring", desc: "Infrastructure, application and synthetic checks with intelligent alerting." },
      { title: "Patch & Lifecycle", desc: "Hands-off patching for OS, firmware and third-party apps with safe rollback." },
      { title: "Backup & DR", desc: "Tested restores, immutable backups and runbook-driven disaster recovery." },
      { title: "Endpoint Management", desc: "MDM, EDR, hardening and compliance baselines across every device." },
      { title: "Vendor Coordination", desc: "We are the single throat to choke across all your cloud and SaaS vendors." },
    ],
    faqs: [
      { q: "Do you replace our existing IT team?", a: "No. We augment your team — handling Tier 1/2, after-hours and weekends so your engineers focus on strategic work." },
      { q: "What's the typical onboarding time?", a: "Most environments are fully onboarded within 30–45 days, with initial coverage in week one." },
      { q: "Are SLAs backed by penalties?", a: "Yes. Service credits apply for any breach, with transparent monthly SLA reporting." },
    ],
  },
  {
    slug: "it-consulting",
    title: "IT Consulting & Advisory",
    tag: "Strategy",
    desc: "The right technology, properly implemented and managed, leads to significant gains in growth.",
    bullets: ["Architecture review", "Vendor selection", "Digital transformation roadmaps", "Tech due-diligence"],
    outcomes: ["Clear 18-month roadmaps", "De-risked migrations", "CFO-ready TCO models"],
    metrics: [
      { label: "Avg. roadmap", value: "18 mo" },
      { label: "Cost models", value: "TCO + ROI" },
      { label: "Stakeholders", value: "Tech + CFO" },
    ],
    overview: [
      "Most IT spend fails not because of bad tools — but because of mis-sequenced decisions. Our advisory practice anchors every recommendation in business outcomes, financial reality and operational maturity.",
      "From greenfield architecture to M&A due diligence, we deliver decision-grade artifacts your board and your engineers can both act on.",
    ],
    process: [
      { step: "01", title: "Assess", desc: "Workshops with leadership, engineering and finance to baseline current state." },
      { step: "02", title: "Model", desc: "Capability maps, TCO/ROI models and risk-weighted scenarios." },
      { step: "03", title: "Roadmap", desc: "Phased 12–24 month plan with quick wins and dependency-aware milestones." },
      { step: "04", title: "Govern", desc: "Quarterly steering reviews and KPI tracking through delivery." },
    ],
    capabilities: [
      { title: "Architecture Review", desc: "Independent assessment of your stack with pragmatic, vendor-neutral recommendations." },
      { title: "Vendor Selection", desc: "RFP design, scoring rubrics and contract negotiation support." },
      { title: "Transformation Roadmaps", desc: "Phased plans tying technology investment to revenue and risk outcomes." },
      { title: "M&A Due Diligence", desc: "Tech debt, security posture and integration cost analysis for deal teams." },
    ],
    faqs: [
      { q: "Are you tied to specific vendors?", a: "No — we are independent and recommend best-fit, not best-margin." },
      { q: "Can you support after the strategy phase?", a: "Yes. Our delivery teams can execute the roadmap end-to-end if desired." },
    ],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    tag: "Zero-trust",
    desc: "Identify vulnerabilities, assess risks, and implement robust security to safeguard systems and data.",
    bullets: ["Penetration testing", "SOC monitoring", "Compliance & audits", "Identity & access management"],
    outcomes: ["ISO 27001 ready", "MTTR under 30 min", "Zero-trust by default"],
    metrics: [
      { label: "MTTR", value: "<30m" },
      { label: "Compliance", value: "ISO · SOC 2" },
      { label: "Coverage", value: "24/7 SOC" },
    ],
    overview: [
      "Security is no longer a perimeter problem — it is an identity, data and supply-chain problem. We design defense-in-depth programs that assume breach and limit blast radius.",
      "Our security engineers and SOC analysts work together to detect, respond and harden — continuously raising the cost of attack against your business.",
    ],
    process: [
      { step: "01", title: "Baseline", desc: "Threat modeling, asset discovery and CIS/NIST baseline assessment." },
      { step: "02", title: "Harden", desc: "Identity, network, endpoint and cloud configuration improvements." },
      { step: "03", title: "Detect", desc: "24/7 SOC, SIEM tuning, threat intel and tabletop exercises." },
      { step: "04", title: "Respond", desc: "IR retainer, forensics and recovery — with clear roles and runbooks." },
    ],
    capabilities: [
      { title: "Penetration Testing", desc: "Black-, grey- and white-box testing across web, mobile, cloud and network." },
      { title: "Managed SOC", desc: "24/7 detection and response across endpoints, identity and cloud workloads." },
      { title: "Identity & Access", desc: "SSO, MFA, conditional access, privileged access management." },
      { title: "Compliance Programs", desc: "ISO 27001, SOC 2, PCI DSS, HIPAA — gap analysis through audit readiness." },
      { title: "Cloud Security", desc: "CSPM, IaC scanning, runtime protection across AWS, Azure and GCP." },
      { title: "Awareness Training", desc: "Phishing simulations and role-based security training programs." },
    ],
    faqs: [
      { q: "Do you provide an incident response retainer?", a: "Yes. Retainer clients get prioritized response with strict response-time SLAs." },
      { q: "Which frameworks do you support?", a: "ISO 27001, SOC 2, NIST CSF, PCI DSS, HIPAA, GDPR, NDPR." },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    tag: "Performance",
    desc: "Establish an impactful online presence and reach your target audience effectively.",
    bullets: ["Marketing sites & e-commerce", "Headless CMS", "Conversion optimization", "Core Web Vitals"],
    outcomes: ["100/100 Lighthouse", "2x conversion lifts", "Sub-second TTFB"],
    metrics: [
      { label: "Lighthouse", value: "95–100" },
      { label: "TTFB", value: "<400ms" },
      { label: "Stack", value: "React · Next" },
    ],
    overview: [
      "Web is your highest-leverage channel — it should be measurably fast, accessible, and tuned for conversion. We design and engineer marketing sites, e-commerce and bespoke web apps that perform on every metric that matters.",
      "Every project ships with analytics, A/B testing and a CMS your marketing team can actually use.",
    ],
    capabilities: [
      { title: "Marketing Sites", desc: "Headless CMS, content modeling and editor workflows for non-technical teams." },
      { title: "E-commerce", desc: "Shopify Plus, custom Stripe checkout, subscription and B2B portals." },
      { title: "Web Applications", desc: "React, Next.js and TanStack Start for fast, type-safe product surfaces." },
      { title: "Performance", desc: "Core Web Vitals optimization, edge rendering and image pipelines." },
    ],
    faqs: [
      { q: "Can you migrate from WordPress?", a: "Yes — we handle content migration, redirects and SEO preservation." },
    ],
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    tag: "Native",
    desc: "Customized mobile apps aligned with your brand across iOS and Android.",
    bullets: ["React Native & native", "App store deployment", "Push & analytics", "Offline-first sync"],
    outcomes: ["4.8★ app ratings", "<1% crash-free sessions", "CI/CD on every push"],
    metrics: [
      { label: "Rating", value: "4.8★ avg" },
      { label: "Crash-free", value: ">99%" },
      { label: "Stack", value: "RN · Swift · Kotlin" },
    ],
    overview: [
      "We design mobile experiences as a product, not a port — with native-feeling navigation, considered offline behavior and analytics built in from day one.",
      "Whether you need a customer-facing app, internal field tooling or a B2B portal, we ship it with CI/CD, crash reporting and an OTA update pipeline.",
    ],
    capabilities: [
      { title: "Cross-platform", desc: "React Native and Expo for shared codebase across iOS and Android." },
      { title: "Native Modules", desc: "Swift and Kotlin for performance-critical or device-specific features." },
      { title: "Release Engineering", desc: "Fastlane, EAS and CI/CD pipelines with staged rollouts." },
      { title: "Analytics & Push", desc: "Segment, Amplitude, OneSignal — wired in and instrumented from launch." },
    ],
  },
  {
    slug: "cloud-services",
    title: "Cloud Services",
    tag: "Multi-cloud",
    desc: "Architect, migrate, and optimize multi-cloud workloads with cost and performance in mind.",
    bullets: ["AWS · Azure · GCP", "FinOps & cost optimization", "Kubernetes & containers", "IaC with Terraform"],
    outcomes: ["35% cloud-spend reduction", "Auto-scaling SLOs", "Multi-region resilience"],
    metrics: [
      { label: "Cost cut", value: "−35%" },
      { label: "Clouds", value: "AWS · Azure · GCP" },
      { label: "IaC", value: "Terraform" },
    ],
    overview: [
      "Cloud value comes from architecture and operating discipline — not from the logo on the bill. We help teams design, migrate and run cloud workloads that are observable, cost-controlled and resilient by default.",
      "Our FinOps practice has cut steady-state cloud spend by an average of 35% across our managed clients.",
    ],
    process: [
      { step: "01", title: "Assess", desc: "Workload discovery, dependency mapping and target-state architecture." },
      { step: "02", title: "Migrate", desc: "Wave-based migration with rehost / replatform / refactor decisions per workload." },
      { step: "03", title: "Modernize", desc: "Containers, serverless and managed services where they create real leverage." },
      { step: "04", title: "Optimize", desc: "FinOps reviews, rightsizing, RIs/SPs and architectural cost reductions." },
    ],
    capabilities: [
      { title: "Cloud Migration", desc: "Lift-and-shift through full refactor, with rollback plans for every wave." },
      { title: "Kubernetes", desc: "EKS, AKS and GKE platform engineering with GitOps delivery." },
      { title: "Infrastructure as Code", desc: "Terraform modules, policy-as-code and drift detection." },
      { title: "FinOps", desc: "Tagging, showback, anomaly detection and continuous optimization." },
    ],
  },
];

export const challenges: Detail[] = [
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    tag: "Modernize",
    desc: "Re-platform legacy systems and unify data into a modern, composable architecture.",
    bullets: ["Legacy app modernization", "API-first integration layer", "Data unification", "Change management"],
    outcomes: ["10x faster releases", "Single source of truth", "Future-ready stack"],
    metrics: [
      { label: "Releases", value: "10x faster" },
      { label: "Integrations", value: "API-first" },
      { label: "Data", value: "Unified" },
    ],
    overview: [
      "Transformation fails when it is treated as a tooling project. We treat it as an operating-model change — pairing platform engineering with change management so adoption sticks.",
      "We modernize incrementally: strangler-fig migrations, parallel runs and measurable business KPIs at every phase.",
    ],
    capabilities: [
      { title: "Legacy Modernization", desc: "Phased decomposition of monoliths into well-bounded services." },
      { title: "Integration Layer", desc: "Event-driven and REST/GraphQL APIs that decouple systems for speed." },
      { title: "Data Platform", desc: "Lakehouse, ELT and a single semantic layer for analytics and operations." },
      { title: "Change Enablement", desc: "Training, internal champions and adoption metrics built into delivery." },
    ],
  },
  {
    slug: "security",
    title: "Security",
    tag: "Defend",
    desc: "Continuous protection across identities, endpoints, networks and workloads.",
    bullets: ["Threat detection & response", "Zero-trust architecture", "Compliance frameworks", "Tabletop exercises"],
    outcomes: ["Audit-ready posture", "Reduced attack surface", "Insurable risk profile"],
    metrics: [
      { label: "Posture", value: "Audit-ready" },
      { label: "Surface", value: "Minimized" },
      { label: "Insurance", value: "Qualified" },
    ],
    overview: [
      "Modern security is a layered, identity-first program. We help organizations move from reactive controls to a measurable, continuously-tested security posture.",
    ],
    capabilities: [
      { title: "Zero-Trust Architecture", desc: "Identity-aware access, micro-segmentation and least-privilege enforcement." },
      { title: "Threat Detection", desc: "SIEM, XDR and managed SOC services with verified MTTR." },
      { title: "Compliance", desc: "ISO 27001, SOC 2, HIPAA, PCI — pragmatic paths to certification." },
      { title: "Resilience Drills", desc: "Tabletop exercises and red/blue/purple team engagements." },
    ],
  },
  {
    slug: "automation",
    title: "Automation",
    tag: "Scale",
    desc: "Eliminate repetitive operations with intelligent workflows and AI co-pilots.",
    bullets: ["Process mining", "RPA & workflow engines", "AI agents", "ITSM automation"],
    outcomes: ["60% time saved", "Fewer manual errors", "24/7 throughput"],
    metrics: [
      { label: "Time saved", value: "60%" },
      { label: "Errors", value: "−80%" },
      { label: "Throughput", value: "24/7" },
    ],
    overview: [
      "Automation succeeds when it follows process discovery, not the other way around. We map your highest-friction workflows, then automate them with the right blend of RPA, workflow engines and LLM-powered agents.",
    ],
    capabilities: [
      { title: "Process Mining", desc: "Quantify time, cost and exception rates across actual workflows." },
      { title: "Workflow Automation", desc: "Temporal, n8n, Zapier and custom orchestrators tied into your systems." },
      { title: "AI Agents", desc: "Document understanding, classification and summarization with human-in-the-loop." },
      { title: "ITSM Automation", desc: "Auto-ticket triage, runbook execution and self-healing infrastructure." },
    ],
  },
  {
    slug: "gaining-efficiency",
    title: "Gaining Efficiency",
    tag: "Optimize",
    desc: "Tune cost, performance and team velocity with disciplined operating practices.",
    bullets: ["FinOps reviews", "DevEx improvements", "Observability", "SLO/SLA design"],
    outcomes: ["Lower run-cost", "Faster cycle time", "Predictable delivery"],
    metrics: [
      { label: "Run-cost", value: "Lower" },
      { label: "Cycle time", value: "Faster" },
      { label: "Delivery", value: "Predictable" },
    ],
    overview: [
      "Efficiency is the compound interest of small, disciplined improvements. We bring proven FinOps, DevEx and SRE practices to engineering organizations that need to ship faster without burning budget.",
    ],
    capabilities: [
      { title: "FinOps", desc: "Cost visibility, anomaly detection and right-sizing across cloud and SaaS." },
      { title: "DevEx", desc: "CI pipelines, preview environments and golden paths for engineering teams." },
      { title: "Observability", desc: "Metrics, logs, traces and SLOs that drive the right operational decisions." },
      { title: "Delivery Practices", desc: "Trunk-based development, progressive delivery and incident management." },
    ],
  },
];

export const industries: Detail[] = [
  {
    slug: "industry-manufacturing",
    title: "Industry & Manufacturing",
    tag: "OT/IT",
    desc: "Smart factories, OT/IT convergence, and predictive maintenance.",
    bullets: ["MES & SCADA integration", "Predictive maintenance models", "Edge compute on the floor", "Cyber-physical security"],
    overview: [
      "Manufacturing is where data, machinery and people meet — and where downtime is measured in real money. We modernize OT/IT convergence with secure, observable and resilient platforms.",
      "From pilot lines to multi-site rollouts, we deliver edge-to-cloud architectures that keep production moving.",
    ],
    capabilities: [
      { title: "MES & SCADA", desc: "Integration of legacy SCADA with modern MES and ERP systems." },
      { title: "Predictive Maintenance", desc: "Vibration, temperature and acoustic models that flag failures early." },
      { title: "Edge Compute", desc: "Containerized edge nodes with offline buffering and secure sync." },
      { title: "OT Security", desc: "Network segmentation, anomaly detection and patching for industrial assets." },
    ],
    samples: [
      {
        name: "FactoryOps Suite",
        type: "Smart-factory platform",
        desc: "Real-time OEE dashboards, downtime root-cause analysis and shift-handover workflows for multi-line plants.",
        features: ["OEE & KPI dashboards", "Downtime tagging", "Predictive maintenance alerts", "Mobile shop-floor app"],
      },
      {
        name: "AssetSentry",
        type: "Predictive maintenance",
        desc: "Sensor-fusion platform combining vibration and thermal data into ML-based failure forecasts.",
        features: ["IoT sensor ingest", "ML failure scoring", "Work-order integration", "Spare-parts forecasting"],
      },
    ],
  },
  {
    slug: "transportation-logistics",
    title: "Transportation & Logistics",
    tag: "Realtime",
    desc: "Fleet visibility, real-time routing, and supply-chain resilience.",
    bullets: ["Telematics platforms", "Route optimization", "Warehouse automation", "Track & trace"],
    overview: [
      "Logistics runs on visibility and seconds. We build platforms that give dispatchers, drivers and customers the same real-time picture across every leg of the journey.",
    ],
    capabilities: [
      { title: "Telematics", desc: "GPS, fuel, driver behavior and vehicle health unified in one console." },
      { title: "Route Optimization", desc: "Dynamic routing that adapts to traffic, weather and SLA windows." },
      { title: "Warehouse Systems", desc: "WMS integration, pick-pack-ship workflows and barcode/RFID flows." },
      { title: "Track & Trace", desc: "Customer-facing shipment tracking with proactive ETA notifications." },
    ],
    samples: [
      {
        name: "FleetPilot TMS",
        type: "Transport management system",
        desc: "End-to-end TMS with dispatcher console, driver mobile app and customer tracking portal.",
        features: ["Live GPS tracking", "Auto-dispatch", "Proof of delivery", "Customer ETA portal"],
      },
      {
        name: "WarehouseFlow",
        type: "WMS",
        desc: "Warehouse management platform optimizing pick paths and inventory accuracy.",
        features: ["Wave picking", "Barcode/RFID", "Cycle counts", "ERP sync"],
      },
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    tag: "HIPAA",
    desc: "HIPAA-grade security, EHR integrations, and patient data platforms.",
    bullets: ["EHR/EMR interop", "HIPAA-compliant cloud", "Patient portals", "Clinical analytics"],
    overview: [
      "Healthcare technology must be secure, interoperable and clinician-friendly — all at once. We build platforms that respect clinical workflow while unlocking the data trapped inside legacy systems.",
      "Every system we deliver is HIPAA-aligned with audit logging, role-based access and full encryption in transit and at rest.",
    ],
    capabilities: [
      { title: "EHR/EMR Interop", desc: "HL7 v2, FHIR and DICOM integrations across major EHR vendors." },
      { title: "Patient Engagement", desc: "Patient portals, telehealth and secure messaging." },
      { title: "Clinical Analytics", desc: "Population health, quality measures and operational dashboards." },
      { title: "Compliance", desc: "HIPAA, HITRUST and regional health data regulations." },
    ],
    samples: [
      {
        name: "MediCare HMS",
        type: "Hospital management system",
        desc: "Modular HMS covering OPD, IPD, lab, pharmacy, billing and electronic medical records for mid-sized hospitals.",
        features: ["Appointments & queue", "EMR & e-prescriptions", "Lab & radiology orders", "Insurance claims & billing"],
      },
      {
        name: "ClinicConnect",
        type: "Telehealth & patient portal",
        desc: "Patient-facing portal with secure video consults, prescriptions, lab results and payments.",
        features: ["HIPAA video calls", "Online booking", "Lab results", "Pay-by-link"],
      },
      {
        name: "PharmaTrack",
        type: "Pharmacy & inventory",
        desc: "Inventory and dispensing platform for hospital pharmacies and chain retail.",
        features: ["Batch & expiry tracking", "Auto-reorder", "Insurance dispensing", "Multi-branch sync"],
      },
    ],
  },
  {
    slug: "banks-insurance",
    title: "Banks & Insurance",
    tag: "Regulated",
    desc: "Core systems, fraud detection, and regulatory automation.",
    bullets: ["Core banking integration", "Fraud & AML detection", "Open banking APIs", "Regulatory reporting"],
    overview: [
      "Financial services demand uptime, auditability and rigor. We design solutions for retail banks, microfinance institutions and insurers that integrate cleanly with core systems and satisfy regulators.",
    ],
    capabilities: [
      { title: "Core Integration", desc: "ISO 20022, T24, Finacle and Flexcube integration patterns." },
      { title: "Fraud & AML", desc: "Real-time scoring, sanctions screening and case management." },
      { title: "Open Banking", desc: "PSD2-style APIs, consent management and developer portals." },
      { title: "RegTech", desc: "Automated regulatory reporting with audit trails." },
    ],
    samples: [
      {
        name: "FinCore Suite",
        type: "Digital banking platform",
        desc: "Customer onboarding, accounts, payments and loan origination on a modern API stack.",
        features: ["KYC/AML", "Card issuance", "Loan origination", "Open-banking APIs"],
      },
      {
        name: "ClaimFlow",
        type: "Insurance claims platform",
        desc: "Straight-through claims processing with document AI, fraud scoring and adjuster console.",
        features: ["FNOL intake", "Fraud scoring", "Adjuster console", "Reinsurance reporting"],
      },
    ],
  },
  {
    slug: "consulting-providers",
    title: "Consulting Providers",
    tag: "Knowledge",
    desc: "Knowledge platforms and white-glove client engagement tooling.",
    bullets: ["Client portals", "Knowledge bases", "Time & billing", "Secure collaboration"],
    overview: [
      "Consulting firms compete on knowledge density and client experience. We build the digital backbone that lets partners and associates deliver consistently — at scale.",
    ],
    capabilities: [
      { title: "Client Portals", desc: "White-labeled portals for deliverables, status and secure file exchange." },
      { title: "Knowledge Management", desc: "Searchable, governed knowledge bases with permissions." },
      { title: "Time & Billing", desc: "PSA integration with utilization, realization and WIP reporting." },
      { title: "Collaboration", desc: "Secure rooms, signing workflows and matter-level audit trails." },
    ],
    samples: [
      {
        name: "AdvisoryHub",
        type: "Client engagement portal",
        desc: "Multi-tenant portal where partners share deliverables, schedule meetings and bill clients.",
        features: ["Engagement rooms", "E-signature", "Time tracking", "Invoicing"],
      },
    ],
  },
  {
    slug: "non-profit",
    title: "Non-Profit",
    tag: "Impact",
    desc: "Donor systems, secure outreach and impact reporting at low cost.",
    bullets: ["Donor CRM", "Email & outreach", "Impact dashboards", "Grants management"],
    overview: [
      "Non-profits need enterprise capabilities at non-profit budgets. We deliver donor, programs and reporting platforms that scale impact without burning operating margin.",
    ],
    capabilities: [
      { title: "Donor CRM", desc: "Pipeline, recurring giving, gift acknowledgments and segmentation." },
      { title: "Outreach", desc: "Email, SMS and WhatsApp campaigns with engagement analytics." },
      { title: "Impact Reporting", desc: "Programmatic dashboards and donor-facing impact reports." },
      { title: "Grants", desc: "Application intake, review workflows and milestone tracking." },
    ],
    samples: [
      {
        name: "CauseConnect",
        type: "Donor & programs platform",
        desc: "Unified donor CRM, recurring giving and beneficiary tracking for international NGOs.",
        features: ["Recurring donations", "Beneficiary registry", "Field data collection", "Impact dashboards"],
      },
    ],
  },
  {
    slug: "education",
    title: "Education",
    tag: "EdTech",
    desc: "Learning platforms, student information systems, and secure campus IT.",
    bullets: ["Student information systems", "Learning management", "Campus identity & access", "Online assessment"],
    overview: [
      "Education is digitizing across schools, universities and corporate training. We build platforms for student lifecycle, learning delivery and assessment that work for thousands of concurrent users without breaking a sweat.",
      "Every system is mobile-first, low-bandwidth tolerant and integrates cleanly with existing finance and HR platforms.",
    ],
    capabilities: [
      { title: "Student Information Systems", desc: "Admissions, enrollment, grading, attendance and transcripts." },
      { title: "Learning Management", desc: "Courses, assignments, discussions, video and SCORM/xAPI content." },
      { title: "Online Assessment", desc: "Proctored exams, item banks, auto-grading and analytics." },
      { title: "Campus IT", desc: "Identity, single sign-on, Wi-Fi management and device programs." },
    ],
    samples: [
      {
        name: "EduCampus SIS",
        type: "Student information system",
        desc: "End-to-end SIS spanning admissions, enrollment, attendance, grading and parent portal.",
        features: ["Admissions workflow", "Class scheduling", "Gradebook", "Parent portal & fees"],
      },
      {
        name: "LearnHub LMS",
        type: "Learning management system",
        desc: "Course delivery platform with interactive assignments, discussions and live classes.",
        features: ["Course authoring", "Live classes", "Assignments & quizzes", "Certificates"],
      },
      {
        name: "ExamSecure",
        type: "Online proctoring",
        desc: "Secure online assessment with AI proctoring, item banks and detailed analytics.",
        features: ["AI proctoring", "Item bank", "Auto-grading", "Result analytics"],
      },
    ],
  },
];

export const allBySlug = Object.fromEntries(
  [...services, ...challenges, ...industries].map((d) => [d.slug, d]),
);

export function categoryOf(slug: string): "service" | "challenge" | "industry" | "unknown" {
  if (services.some((s) => s.slug === slug)) return "service";
  if (challenges.some((s) => s.slug === slug)) return "challenge";
  if (industries.some((s) => s.slug === slug)) return "industry";
  return "unknown";
}
