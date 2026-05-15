import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/pages/TeamPage";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Mquid" },
      { name: "description", content: "Meet the operators, engineers and security leaders behind Mquid." },
      { property: "og:title", content: "Team — Mquid" },
      { property: "og:description", content: "The people behind the platform." },
    ],
  }),
  component: TeamPage,
});
