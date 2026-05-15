import { createFileRoute } from "@tanstack/react-router";
import { IndustriesPage } from "@/pages/IndustriesPage";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Mquid" },
      { name: "description", content: "Industry-specific IT blueprints for healthcare, finance, manufacturing, logistics, and more." },
      { property: "og:title", content: "Industries — Mquid" },
      { property: "og:description", content: "Specialized infrastructure for regulated, mission-critical sectors." },
    ],
  }),
  component: IndustriesPage,
});
