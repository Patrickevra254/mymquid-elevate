import { createFileRoute } from "@tanstack/react-router";
import { WhyUsPage } from "@/pages/WhyUsPage";

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why Mquid — Senior teams, real outcomes" },
      { name: "description", content: "Six reasons enterprises pick Mquid over legacy SIs and agencies." },
      { property: "og:title", content: "Why Mquid" },
      { property: "og:description", content: "Senior-only delivery, security-first, outcomes over outputs." },
    ],
  }),
  component: WhyUsPage,
});
