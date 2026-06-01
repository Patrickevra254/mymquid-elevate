import { create } from "zustand";
import { blogApi } from "../mock/api";
import type { BlogPost, BlogStatus } from "../types";
import { toast } from "sonner";
import { useNotificationStore } from "../notifications/useNotificationStore";

type BlogFilters = {
  status: string;
  category: string;
  search: string;
};

type BlogState = {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  filters: BlogFilters;
  fetchPosts: () => Promise<void>;
  setCurrentPost: (post: BlogPost | null) => void;
  savePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setFilters: (filters: Partial<BlogFilters>) => void;
};

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  filters: { status: "", category: "", search: "" },

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const { status, category, search } = get().filters;
      const posts = await blogApi.getAll({
        status: status as BlogStatus | undefined,
        category,
        search,
      });
      set({ posts, isLoading: false });
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load posts.");
    }
  },

  setCurrentPost: (post) => set({ currentPost: post }),

  savePost: async (post) => {
    await blogApi.save(post);
    toast.success(post.status === "published" ? "Post published!" : "Post saved.");
    useNotificationStore.getState().fetchNotifications().catch(() => {});
  },

  deletePost: async (id) => {
    try {
      await blogApi.delete(id);
      toast.success("Post deleted.");
      useNotificationStore.getState().fetchNotifications().catch(() => {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
}));
