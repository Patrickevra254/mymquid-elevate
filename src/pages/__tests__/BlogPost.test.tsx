import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPost from "../BlogPost";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

const published = MOCK_POSTS.filter((p) => p.status === "published");

const renderWithSlug = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog" element={<div>Blog list</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => vi.clearAllMocks());

describe("BlogPost", () => {
  it("renders the post title when slug matches", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug(published[0].slug);
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(published[0].title)
    );
  });

  it("renders category and author", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug(published[0].slug);
    const categoryElements = await screen.findAllByText(published[0].category);
    expect(categoryElements.length).toBeGreaterThanOrEqual(1);
    await screen.findByText(published[0].author.name);
  });

  it("redirects to /blog when slug not found", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    renderWithSlug("slug-that-does-not-exist");
    await waitFor(() =>
      expect(screen.getByText("Blog list")).toBeInTheDocument()
    );
  });
});
