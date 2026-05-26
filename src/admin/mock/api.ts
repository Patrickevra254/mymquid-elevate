import api from "@/lib/axios";
import type { BlogPost, BlogStatus } from "../types";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    // Real API returns { access_token, user } — normalise to { token, user }
    return { user: data.user, token: data.access_token };
  },

  logout: async () => {
    // No server logout endpoint — client-side clear only
  },
};

// ─── Blog ─────────────────────────────────────────────────────────────────────

type BlogFilters = {
  status?: BlogStatus | "";
  category?: string;
  search?: string;
};

export const blogApi = {
  getAll: async (filters: BlogFilters): Promise<BlogPost[]> => {
    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    const { data } = await api.get("/blog", { params });
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  getById: async (id: string): Promise<BlogPost> => {
    const { data } = await api.get(`/blog/${id}`);
    return data;
  },

  save: async (post: BlogPost): Promise<BlogPost> => {
    if (post.id) {
      const { data } = await api.put(`/blog/${post.id}`, post);
      return data;
    }
    const { data } = await api.post("/blog", post);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/blog/${id}`);
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },

  getRecentActivity: async () => {
    const { data } = await api.get("/dashboard/activity");
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  getChartData: async () => {
    const { data } = await api.get("/dashboard/chart");
    return Array.isArray(data) ? data : (data.data ?? []);
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationApi = {
  getAll: async () => {
    const { data } = await api.get("/notifications");
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch("/notifications/read-all");
  },
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get: async () => {
    const { data } = await api.get("/profile");
    return data;
  },

  update: async (payload: { name: string; email: string }) => {
    const { data } = await api.put("/profile", payload);
    return data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    await api.put("/profile/password", payload);
  },
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadApi = {
  upload: async (file: File, type: "avatar" | "blog-image" | "og-image"): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    const { data } = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url as string;
  },
};
