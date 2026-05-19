import { describe, it, expect, beforeEach } from "vitest";
import { authApi, blogApi, dashboardApi, notificationApi, resetPosts } from "../api";

beforeEach(() => {
  resetPosts();
});

describe("authApi", () => {
  it("returns user and token for valid credentials", async () => {
    const result = await authApi.login("admin@mymquid.com", "mock-admin-dev-only");
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

describe("notificationApi", () => {
  it("returns notifications array with correct shape", async () => {
    const notifications = await notificationApi.getAll();
    expect(Array.isArray(notifications)).toBe(true);
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0]).toHaveProperty("id");
    expect(notifications[0]).toHaveProperty("type");
    expect(notifications[0]).toHaveProperty("read");
    expect(notifications[0]).toHaveProperty("createdAt");
  });
});
