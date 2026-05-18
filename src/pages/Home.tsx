import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Home as HomeContent } from "@/components/site/Home";

export default function Home() {
  useDocumentMeta({
    title: "Mquid — Infrastructure that runs itself",
    description:
      "Mquid is the operating layer for modern enterprises — managed IT, cybersecurity, and cloud automation in one intelligent platform.",
  });
  return <HomeContent />;
}
