import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages/BlogPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Mquid" },
      { name: "description", content: "Field notes, post-mortems and reference architectures from Mquid's engineering and security teams." },
      { property: "og:title", content: "Blog — Mquid" },
      { property: "og:description", content: "Deep dives on cloud, security, AI and operations." },
    ],
  }),
  component: BlogPage,
});
