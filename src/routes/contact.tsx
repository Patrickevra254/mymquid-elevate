import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mquid" },
      { name: "description", content: "Schedule a free consultation. We respond in under 3 minutes." },
      { property: "og:title", content: "Contact — Mquid" },
      { property: "og:description", content: "Get a tailored infrastructure proposal within 48 hours." },
    ],
  }),
  component: ContactPage,
});
