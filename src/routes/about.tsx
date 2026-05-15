import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/AboutPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mquid" },
      { name: "description", content: "A decade of building resilient enterprises through intelligent automation." },
      { property: "og:title", content: "About — Mquid" },
      { property: "og:description", content: "Mission, vision and the team behind Mquid." },
    ],
  }),
  component: AboutPage,
});
