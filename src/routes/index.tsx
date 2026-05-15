import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mquid — Infrastructure that runs itself" },
      {
        name: "description",
        content:
          "Mquid is the operating layer for modern enterprises — managed IT, cybersecurity, and cloud automation in one intelligent platform.",
      },
      { property: "og:title", content: "Mquid — Infrastructure that runs itself" },
      {
        property: "og:description",
        content:
          "Managed IT, cybersecurity and cloud automation engineered for mission-critical operations.",
      },
    ],
  }),
  component: HomePage,
});
