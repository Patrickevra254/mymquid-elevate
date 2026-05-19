import { describe, it, expect, beforeEach } from "vitest";
import { authApi, blogApi, dashboardApi } from "../api";

describe("authApi", () => {
  it("returns user and token for valid credentials", async () => {
    const result = await authApi.login("admin@mymquid.com", "admin123");
    expect(result.user.role).toBe("super_admin");
    expect(result.token).toBe("mock-jwt-admin");
  });

  it("throws for invalid credentials", async () => {
    await expect(authApi.login("wrong@email.com", "bad")).rejects.toThrow(
      "Invalid email or password"
    );
  });
});

describe("blogApi", () => {
  it("returns all posts when no filters", async () => {
    const posts = await blogApi.getAll({});
    expect(posts.length).toBe(10);
  });

  it("filters posts by status", async () => {
    const posts = await blogApi.getAll({ status: "published" });
    expect(posts.every((p) => p.status === "published")).toBe(true);
  });

  it("returns a single post by id", async () => {
    const post = await blogApi.getById("1");
    expect(post.title).toBe("Welcome to MyMquid");
  });

  it("throws when post id not found", async () => {
    await expect(blogApi.getById("999")).rejects.toThrow("Post not found");
  });
});

describe("dashboardApi", () => {
  it("returns stats with expected shape", async () => {
    const stats = await dashboardApi.getStats();
    expect(stats).toHaveProperty("totalPosts");
    expect(stats).toHaveProperty("published");
    expect(stats).toHaveProperty("drafts");
    expect(stats).toHaveProperty("scheduled");
  });
});
