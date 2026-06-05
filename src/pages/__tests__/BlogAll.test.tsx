import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BlogAll from "../BlogAll";
import { MOCK_POSTS } from "@/admin/mock/data";

vi.mock("@/admin/mock/api", () => ({
  blogApi: { getPublic: vi.fn() },
}));

import { blogApi } from "@/admin/mock/api";
const mockApi = blogApi as unknown as { getPublic: ReturnType<typeof vi.fn> };

beforeEach(() => vi.clearAllMocks());

const published = MOCK_POSTS.filter((p) => p.status === "published");

describe("BlogAll", () => {
  it("renders all post titles and shows count", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(published[0].title);
    expect(screen.getByText(`(${published.length} posts)`)).toBeInTheDocument();
  });

  it("shows empty state when no posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce([]);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(/no posts published yet/i);
  });

  it("hides pagination when 9 or fewer posts", async () => {
    mockApi.getPublic.mockResolvedValueOnce(published); // 5 published posts
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText(published[0].title);
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
  });

  it("shows pagination and navigates when more than 9 posts", async () => {
    // Generate 10 published posts
    const tenPosts = Array.from({ length: 10 }, (_, i) => ({
      ...MOCK_POSTS[0],
      id: String(i),
      slug: `post-${i}`,
      title: `Post ${i}`,
    }));
    mockApi.getPublic.mockResolvedValueOnce(tenPosts);
    render(<MemoryRouter><BlogAll /></MemoryRouter>);
    await screen.findByText("Post 0");
    expect(screen.queryByText("Post 9")).not.toBeInTheDocument(); // page 2
    const nextBtn = screen.getByLabelText("Next page");
    await userEvent.click(nextBtn);
    expect(screen.getByText("Post 9")).toBeInTheDocument();
  });
});
