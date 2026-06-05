import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "../Blog";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

beforeEach(() => vi.clearAllMocks());

describe("Blog", () => {
  it("shows at most 4 posts (1 featured + 3 grid)", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS);
    render(<MemoryRouter><Blog /></MemoryRouter>);
    // Featured post title appears
    await screen.findByText(MOCK_POSTS[0].title);
    // Only posts 1-3 appear in the grid (post 0 is featured, posts 4+ are hidden)
    expect(screen.queryByText(MOCK_POSTS[4].title)).not.toBeInTheDocument();
  });

  it("shows 'View all' link when more than 4 posts exist", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS); // 10 posts
    render(<MemoryRouter><Blog /></MemoryRouter>);
    await screen.findByText(MOCK_POSTS[0].title);
    expect(screen.getByRole("link", { name: /view all/i })).toBeInTheDocument();
  });

  it("hides 'View all' link when 4 or fewer posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce(MOCK_POSTS.slice(0, 4));
    render(<MemoryRouter><Blog /></MemoryRouter>);
    await screen.findByText(MOCK_POSTS[0].title);
    expect(screen.queryByRole("link", { name: /view all/i })).not.toBeInTheDocument();
  });
});
