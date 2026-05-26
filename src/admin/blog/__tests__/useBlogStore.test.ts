import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBlogStore } from "../useBlogStore";
import { MOCK_POSTS } from "../../mock/data";
import type { BlogPost } from "../../types";

vi.mock("../../mock/api", () => ({
  blogApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  },
}));

import { blogApi } from "../../mock/api";
const mockBlogApi = blogApi as {
  getAll: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  useBlogStore.setState({
    posts: [],
    currentPost: null,
    isLoading: false,
    filters: { status: "", category: "", search: "" },
  });
});

describe("useBlogStore", () => {
  it("loads posts from API", async () => {
    mockBlogApi.getAll.mockResolvedValueOnce(MOCK_POSTS);
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(MOCK_POSTS.length);
  });

  it("filters posts by status after fetch", async () => {
    const published = MOCK_POSTS.filter((p) => p.status === "published");
    mockBlogApi.getAll.mockResolvedValueOnce(published);
    useBlogStore.setState({ filters: { status: "published", category: "", search: "" } });
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.every((p) => p.status === "published")).toBe(true);
  });

  it("setCurrentPost updates currentPost", () => {
    const post = MOCK_POSTS[0];
    useBlogStore.getState().setCurrentPost(post);
    expect(useBlogStore.getState().currentPost?.id).toBe(post.id);
  });

  it("savePost calls blogApi.save and refetches", async () => {
    const newPost: BlogPost = { ...MOCK_POSTS[0], id: "new-1", title: "New Post", slug: "new-post" };
    mockBlogApi.save.mockResolvedValueOnce(newPost);
    mockBlogApi.getAll.mockResolvedValueOnce([...MOCK_POSTS, newPost]);
    await useBlogStore.getState().savePost(newPost);
    expect(mockBlogApi.save).toHaveBeenCalledWith(newPost);
  });

  it("deletePost calls blogApi.delete and refetches", async () => {
    mockBlogApi.delete.mockResolvedValueOnce(undefined);
    mockBlogApi.getAll.mockResolvedValueOnce(MOCK_POSTS.slice(1));
    await useBlogStore.getState().deletePost("1");
    expect(mockBlogApi.delete).toHaveBeenCalledWith("1");
  });
});
