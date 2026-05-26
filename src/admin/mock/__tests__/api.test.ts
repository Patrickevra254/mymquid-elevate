import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi, blogApi, dashboardApi, notificationApi } from "../api";
import { MOCK_POSTS, MOCK_ACTIVITY, MOCK_CHART_DATA, MOCK_NOTIFICATIONS } from "../data";

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

  it("calls POST /blog when post has no id", async () => {
    const newPost = { ...MOCK_POSTS[0], id: "" };
    mockAxios.post.mockResolvedValueOnce({ data: { ...newPost, id: "new-id" } });
    await blogApi.save(newPost);
    expect(mockAxios.post).toHaveBeenCalledWith("/blog", newPost);
  });

  it("calls PUT /blog/:id when post has id", async () => {
    mockAxios.put.mockResolvedValueOnce({ data: MOCK_POSTS[0] });
    await blogApi.save(MOCK_POSTS[0]);
    expect(mockAxios.put).toHaveBeenCalledWith(`/blog/${MOCK_POSTS[0].id}`, MOCK_POSTS[0]);
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
