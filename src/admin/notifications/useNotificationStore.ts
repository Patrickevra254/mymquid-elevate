import { create } from "zustand";
import type { Notification } from "../types";
import { notificationApi } from "../mock/api";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const notifications = await notificationApi.getAll();
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      isLoading: false,
    });
  },

  markAsRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
  },

  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications, unreadCount: 0 });
  },
}));
