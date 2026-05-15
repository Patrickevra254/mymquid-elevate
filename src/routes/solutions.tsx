import { createFileRoute } from "@tanstack/react-router";
import { SolutionsPage } from "@/pages/SolutionsPage";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Mquid" },
      { name: "description", content: "Managed services, cybersecurity, cloud, consulting, web and mobile — all under one roof." },
      { property: "og:title", content: "Solutions — Mquid" },
      { property: "og:description", content: "A complete operating layer for modern teams." },
    ],
  }),
  component: SolutionsPage,
});
