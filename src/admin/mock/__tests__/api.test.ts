import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi, blogApi, dashboardApi, notificationApi, userApi } from "../api";
import { MOCK_POSTS, MOCK_ACTIVITY, MOCK_CHART_DATA, MOCK_NOTIFICATIONS, MOCK_USERS } from "../data";

vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import axiosInstance from "@/lib/axios";
const mockAxios = axiosInstance as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authApi", () => {
  it("returns user and token for valid login", async () => {
    const mockUser = { id: "1", name: "Patrick", email: "admin@mymquid.com", role: "super_admin" };
    mockAxios.post.mockResolvedValueOnce({ data: { access_token: "jwt-token", user: mockUser } });

    const result = await authApi.login("admin@mymquid.com", "password");
    expect(result.token).toBe("jwt-token");
    expect(result.user.role).toBe("super_admin");
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/login", {
      email: "admin@mymquid.com",
      password: "password",
    });
  });

  it("propagates errors on failed login", async () => {
    mockAxios.post.mockRejectedValueOnce(new Error("Invalid email or password"));
    await expect(authApi.login("bad@email.com", "wrong")).rejects.toThrow("Invalid email or password");
  });
});

describe("blogApi", () => {
  it("calls GET /blog with filters and returns data array", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_POSTS });
    const posts = await blogApi.getAll({ status: "published" });
    expect(mockAxios.get).toHaveBeenCalledWith("/blog", { params: { status: "published" } });
    expect(Array.isArray(posts)).toBe(true);
  });

  it("handles paginated response shape", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { data: MOCK_POSTS, total: 10 } });
    const posts = await blogApi.getAll({});
    expect(posts.length).toBe(MOCK_POSTS.length);
  });

  it("calls GET /blog/:id for single post", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_POSTS[0] });
    const post = await blogApi.getById("1");
    expect(mockAxios.get).toHaveBeenCalledWith("/blog/1");
    expect(post.id).toBe(MOCK_POSTS[0].id);
  });

  it("calls POST /blog when post has no id, with flattened payload", async () => {
    const newPost = { ...MOCK_POSTS[0], id: "" };
    mockAxios.post.mockResolvedValueOnce({ data: { ...newPost, id: "new-id" } });
    await blogApi.save(newPost);
    const sentPayload = mockAxios.post.mock.calls[0][1] as Record<string, unknown>;
    // id, author, createdAt, updatedAt stripped; seo fields flattened
    expect(sentPayload.id).toBeUndefined();
    expect(sentPayload.author).toBeUndefined();
    expect(sentPayload.createdAt).toBeUndefined();
    expect(sentPayload.updatedAt).toBeUndefined();
    expect(sentPayload.seo).toBeUndefined();
    expect(sentPayload.metaTitle).toBe(newPost.seo.metaTitle);
    expect(sentPayload.metaDescription).toBe(newPost.seo.metaDescription);
    expect(mockAxios.post).toHaveBeenCalledWith("/blog", sentPayload);
  });

  it("calls PUT /blog/:id when post has id, with flattened payload", async () => {
    mockAxios.put.mockResolvedValueOnce({ data: MOCK_POSTS[0] });
    await blogApi.save(MOCK_POSTS[0]);
    const sentPayload = mockAxios.put.mock.calls[0][1] as Record<string, unknown>;
    expect(sentPayload.id).toBeUndefined();
    expect(sentPayload.author).toBeUndefined();
    expect(sentPayload.seo).toBeUndefined();
    expect(sentPayload.metaTitle).toBe(MOCK_POSTS[0].seo.metaTitle);
    expect(mockAxios.put).toHaveBeenCalledWith(`/blog/${MOCK_POSTS[0].id}`, sentPayload);
  });

  it("calls DELETE /blog/:id", async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: null });
    await blogApi.delete("1");
    expect(mockAxios.delete).toHaveBeenCalledWith("/blog/1");
  });
});

describe("dashboardApi", () => {
  it("returns stats from GET /dashboard/stats", async () => {
    const stats = { totalPosts: 10, published: 5, drafts: 3, scheduled: 2 };
    mockAxios.get.mockResolvedValueOnce({ data: stats });
    const result = await dashboardApi.getStats();
    expect(result).toEqual(stats);
    expect(mockAxios.get).toHaveBeenCalledWith("/dashboard/stats");
  });

  it("returns activity array from GET /dashboard/activity", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_ACTIVITY });
    const result = await dashboardApi.getRecentActivity();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns chart data from GET /dashboard/chart", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_CHART_DATA });
    const result = await dashboardApi.getChartData();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("notificationApi", () => {
  it("returns notifications from GET /notifications", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_NOTIFICATIONS });
    const result = await notificationApi.getAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("read");
  });
});

describe("userApi", () => {
  it("calls GET /users and returns array", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_USERS });
    const users = await userApi.getAll();
    expect(mockAxios.get).toHaveBeenCalledWith("/users");
    expect(Array.isArray(users)).toBe(true);
  });

  it("calls GET /users/:id", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_USERS[0] });
    const user = await userApi.getById("1");
    expect(mockAxios.get).toHaveBeenCalledWith("/users/1");
    expect(user.id).toBe(MOCK_USERS[0].id);
  });

  it("calls POST /users to create a user", async () => {
    const payload = { name: "New User", email: "new@mymquid.com", role: "staff" as const };
    mockAxios.post.mockResolvedValueOnce({ data: { ...payload, id: "3", active: true, lastLogin: "", createdAt: "", stats: { published: 0, drafts: 0, scheduled: 0, total: 0 } } });
    await userApi.create(payload);
    expect(mockAxios.post).toHaveBeenCalledWith("/users", payload);
  });

  it("calls PUT /users/:id to update a user", async () => {
    const payload = { name: "Updated", email: "admin@mymquid.com", role: "super_admin" as const };
    mockAxios.put.mockResolvedValueOnce({ data: MOCK_USERS[0] });
    await userApi.update("1", payload);
    expect(mockAxios.put).toHaveBeenCalledWith("/users/1", payload);
  });

  it("calls PATCH /users/:id/status", async () => {
    mockAxios.patch.mockResolvedValueOnce({ data: null });
    await userApi.updateStatus("1", false);
    expect(mockAxios.patch).toHaveBeenCalledWith("/users/1/status", { active: false });
  });

  it("calls DELETE /users/:id", async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: null });
    await userApi.delete("1");
    expect(mockAxios.delete).toHaveBeenCalledWith("/users/1");
  });

  it("calls POST /users/:id/reset-password", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: null });
    await userApi.resetPassword("1");
    expect(mockAxios.post).toHaveBeenCalledWith("/users/1/reset-password");
  });

  it("calls GET /users/:id/posts", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: [] });
    const posts = await userApi.getPosts("1");
    expect(mockAxios.get).toHaveBeenCalledWith("/users/1/posts");
    expect(Array.isArray(posts)).toBe(true);
  });
});
