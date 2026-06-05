import api from "@/lib/axios";
import type { BlogPost, BlogStatus, UserWithStats, CreateUserPayload, UpdateUserPayload } from "../types";

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

  getPublic: async (): Promise<BlogPost[]> => {
    const { data } = await api.get("/blog/public");
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  getById: async (id: string): Promise<BlogPost> => {
    const { data } = await api.get(`/blog/${id}`);
    return data;
  },

  save: async (post: BlogPost): Promise<BlogPost> => {
    // Backend expects flat fields — no nested seo object,
    // and createdAt/updatedAt/author are server-managed
    const {
      id,
      seo,
      featuredImage,
      scheduledAt,
      createdAt: _c,
      updatedAt: _u,
      author: _a,
      ...rest
    } = post;

    const payload: Record<string, unknown> = {
      ...rest,
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      ...(seo.ogImage ? { ogImage: seo.ogImage } : {}),
      ...(featuredImage ? { featuredImage } : {}),
      ...(scheduledAt ? { scheduledAt } : {}),
    };

    try {
      if (id) {
        const { data } = await api.put(`/blog/${id}`, payload);
        return data;
      }
      const { data } = await api.post("/blog", payload);
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown; status?: number } };
      const apiErrors = axiosErr?.response?.data as
        | { errors?: { field: string; message: string }[]; message?: string }
        | undefined;
      if (apiErrors?.errors?.length) {
        throw new Error(apiErrors.errors.map((e) => e.message).join(" · "));
      }
      throw new Error(apiErrors?.message ?? "Failed to save post.");
    }
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

// ─── Users ────────────────────────────────────────────────────────────────────

export const userApi = {
  getAll: async (): Promise<UserWithStats[]> => {
    const { data } = await api.get("/users");
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  getById: async (id: string): Promise<UserWithStats> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserPayload): Promise<UserWithStats> => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<UserWithStats> => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  updateStatus: async (id: string, active: boolean): Promise<void> => {
    await api.patch(`/users/${id}/status`, { active });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  resetPassword: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/reset-password`);
  },

  getPosts: async (id: string): Promise<BlogPost[]> => {
    const { data } = await api.get(`/users/${id}/posts`);
    return Array.isArray(data) ? data : (data.data ?? []);
  },
};
