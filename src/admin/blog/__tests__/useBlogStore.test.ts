import { describe, it, expect, beforeEach } from "vitest";
import { useBlogStore } from "../useBlogStore";
import { MOCK_POSTS } from "../../mock/data";
import { resetPosts } from "../../mock/api";
import type { BlogPost } from "../../types";

beforeEach(() => {
  resetPosts();
  useBlogStore.setState({
    posts: [],
    currentPost: null,
    isLoading: false,
    filters: { status: "", category: "", search: "" },
  });
});

describe("useBlogStore", () => {
  it("loads posts from API", async () => {
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(10);
  });

  it("filters posts by status after fetch", async () => {
    useBlogStore.setState({ filters: { status: "published", category: "", search: "" } });
    await useBlogStore.getState().fetchPosts();
    const posts = useBlogStore.getState().posts;
    expect(posts.every((p) => p.status === "published")).toBe(true);
  });

  it("setCurrentPost updates currentPost", () => {
    const post = MOCK_POSTS[0];
    useBlogStore.getState().setCurrentPost(post);
    expect(useBlogStore.getState().currentPost?.id).toBe(post.id);
  });

  it("savePost adds a new post", async () => {
    await useBlogStore.getState().fetchPosts();
    const initialCount = useBlogStore.getState().posts.length;
    const newPost: BlogPost = {
      ...MOCK_POSTS[0],
      id: "new-1",
      title: "New Post",
      slug: "new-post",
    };
    await useBlogStore.getState().savePost(newPost);
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(initialCount + 1);
  });

  it("deletePost removes a post", async () => {
    await useBlogStore.getState().fetchPosts();
    const initialCount = useBlogStore.getState().posts.length;
    await useBlogStore.getState().deletePost("1");
    await useBlogStore.getState().fetchPosts();
    expect(useBlogStore.getState().posts.length).toBe(initialCount - 1);
  });
});
