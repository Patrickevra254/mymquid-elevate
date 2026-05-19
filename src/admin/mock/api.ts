import type { BlogPost } from "../types";
import {
  MOCK_USERS,
  MOCK_CREDENTIALS,
  MOCK_POSTS,
  MOCK_STATS,
  MOCK_ACTIVITY,
  MOCK_CHART_DATA,
  MOCK_NOTIFICATIONS,
} from "./data";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let posts = [...MOCK_POSTS];

export const authApi = {
  login: async (email: string, password: string) => {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user || MOCK_CREDENTIALS[email] !== password) {
      throw new Error("Invalid email or password");
    }
    const token = user.role === "super_admin" ? "mock-jwt-admin" : "mock-jwt-staff";
    return { user, token };
  },
  logout: async () => {
    await delay(100);
  },
};

type BlogFilters = {
  status?: string;
  category?: string;
  search?: string;
};

export const blogApi = {
  getAll: async (filters: BlogFilters) => {
    await delay();
    let result = [...posts];
    if (filters.status) result = result.filter((p) => p.status === filters.status);
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    return result;
  },

  getById: async (id: string) => {
    await delay();
    const post = posts.find((p) => p.id === id);
    if (!post) throw new Error("Post not found");
    return post;
  },

  save: async (post: BlogPost) => {
    await delay();
    const idx = posts.findIndex((p) => p.id === post.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      posts[idx] = { ...post, updatedAt: now };
      return posts[idx];
    }
    const newPost = { ...post, createdAt: now, updatedAt: now };
    posts.push(newPost);
    return newPost;
  },

  delete: async (id: string) => {
    await delay();
    posts = posts.filter((p) => p.id !== id);
  },
};

export const dashboardApi = {
  getStats: async () => {
    await delay();
    return {
      ...MOCK_STATS,
      totalPosts: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      scheduled: posts.filter((p) => p.status === "scheduled").length,
    };
  },

  getRecentActivity: async () => {
    await delay();
    return MOCK_ACTIVITY;
  },

  getChartData: async () => {
    await delay();
    return MOCK_CHART_DATA;
  },
};

export const notificationApi = {
  getAll: async () => {
    await delay();
    return MOCK_NOTIFICATIONS;
  },
};
