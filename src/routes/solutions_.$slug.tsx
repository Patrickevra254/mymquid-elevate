import { createFileRoute, Link } from "@tanstack/react-router";
import { SolutionDetailPage } from "@/pages/SolutionDetailPage";
import { Layout } from "@/components/site/Layout";
import { allBySlug } from "@/lib/solutions-data";

export const Route = createFileRoute("/solutions_/$slug")({
  head: ({ params }) => {
    const item = allBySlug[params.slug];
    const title = item ? `${item.title} — Mquid` : "Solution — Mquid";
    const desc = item?.desc ?? "Mquid solution detail.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: function SolutionDetailRoute() {
    const { slug } = Route.useParams();
    return <SolutionDetailPage slug={slug} />;
  },
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-medium">Solution not found</h1>
        <Link to="/solutions" className="mt-6 inline-block text-primary">Browse all solutions →</Link>
      </div>
    </Layout>
  ),
});
