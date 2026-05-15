import { createFileRoute } from "@tanstack/react-router";
import { PartnersPage } from "@/pages/PartnersPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners & Certifications — Mquid" },
      { name: "description", content: "Tier-1 platform partnerships with AWS, Microsoft, Google Cloud, Salesforce. ISO 27001, SOC 2 and PCI-DSS certified." },
      { property: "og:title", content: "Partners & Certifications — Mquid" },
      { property: "og:description", content: "Direct escalation paths and audit-grade compliance." },
    ],
  }),
  component: PartnersPage,
});
