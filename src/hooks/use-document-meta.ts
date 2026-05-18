import { useEffect } from "react";

type Meta = { title: string; description?: string };

/**
 * Tiny helper to set the document title and meta description per page.
 * Keep it simple — for richer SEO needs reach for react-helmet-async.
 */
export function useDocumentMeta({ title, description }: Meta) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
