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
      unreadCount: notifications.filter((n: Notification) => !n.read).length,
      isLoading: false,
    });
  },

  markAsRead: async (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
    await notificationApi.markAsRead(id).catch(console.error);
  },

  markAllAsRead: async () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications, unreadCount: 0 });
    await notificationApi.markAllAsRead().catch(console.error);
  },
}));
