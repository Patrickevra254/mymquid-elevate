import { createFileRoute } from "@tanstack/react-router";
import { CareersPage } from "@/pages/CareersPage";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Mquid" },
      { name: "description", content: "Join the senior team building mission-critical infrastructure for Africa's enterprises." },
      { property: "og:title", content: "Careers — Mquid" },
      { property: "og:description", content: "Open roles in cloud, security, SRE, product and go-to-market." },
    ],
  }),
  component: CareersPage,
});
