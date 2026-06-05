import { create } from "zustand";
import { userApi } from "../mock/api";
import type { UserWithStats, CreateUserPayload, UpdateUserPayload, BlogPost } from "../types";
import { toast } from "sonner";

type UserState = {
  users: UserWithStats[];
  selectedUser: UserWithStats | null;
  userPosts: BlogPost[];
  isLoading: boolean;
  isActionLoading: boolean;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  fetchUserPosts: (id: string) => Promise<void>;
  createUser: (data: CreateUserPayload) => Promise<void>;
  updateUser: (id: string, data: UpdateUserPayload) => Promise<void>;
  toggleUserStatus: (id: string, active: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  userPosts: [],
  isLoading: false,
  isActionLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await userApi.getAll();
      set({ users, isLoading: false });
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load users.");
    }
  },

  fetchUser: async (id) => {
    set({ isLoading: true, selectedUser: null });
    try {
      const selectedUser = await userApi.getById(id);
      set({ selectedUser, isLoading: false });
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load user.");
    }
  },

  fetchUserPosts: async (id) => {
    try {
      const userPosts = await userApi.getPosts(id);
      set({ userPosts });
    } catch {
      toast.error("Failed to load user posts.");
    }
  },

  createUser: async (data) => {
    set({ isActionLoading: true });
    try {
      await userApi.create(data);
      const users = await userApi.getAll();
      set({ users, isActionLoading: false });
      toast.success(`User created. An invite email has been sent to ${data.email}.`);
    } catch (err: unknown) {
      set({ isActionLoading: false });
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create user.";
      toast.error(msg);
      throw err;
    }
  },

  updateUser: async (id, data) => {
    set({ isActionLoading: true });
    try {
      const updated = await userApi.update(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...updated } : u)),
        selectedUser:
          state.selectedUser?.id === id
            ? { ...state.selectedUser, ...updated }
            : state.selectedUser,
        isActionLoading: false,
      }));
      toast.success("User updated successfully.");
    } catch {
      set({ isActionLoading: false });
      toast.error("Failed to update user.");
      throw new Error("Failed to update user.");
    }
  },

  toggleUserStatus: async (id, active) => {
    set({ isActionLoading: true });
    try {
      await userApi.updateStatus(id, active);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, active } : u)),
        selectedUser:
          state.selectedUser?.id === id
            ? { ...state.selectedUser, active }
            : state.selectedUser,
        isActionLoading: false,
      }));
      toast.success(active ? "User activated." : "User deactivated.");
    } catch {
      set({ isActionLoading: false });
      toast.error("Failed to update user status.");
    }
  },

  deleteUser: async (id) => {
    set({ isActionLoading: true });
    try {
      await userApi.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isActionLoading: false,
      }));
      toast.success("User deleted.");
    } catch {
      set({ isActionLoading: false });
      toast.error("Failed to delete user.");
    }
  },

  resetUserPassword: async (id) => {
    set({ isActionLoading: true });
    try {
      await userApi.resetPassword(id);
      set({ isActionLoading: false });
      toast.success("Password reset email sent.");
    } catch {
      set({ isActionLoading: false });
      toast.error("Failed to send password reset email.");
    }
  },
}));
