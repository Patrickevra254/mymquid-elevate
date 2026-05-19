import { create } from "zustand";

type NotificationState = {
  unreadCount: number;
};

export const useNotificationStore = create<NotificationState>()(() => ({
  unreadCount: 0,
}));
