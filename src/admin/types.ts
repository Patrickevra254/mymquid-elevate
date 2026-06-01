export type AdminRole = "super_admin" | "staff";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
};

export type UserWithStats = AdminUser & {
  active: boolean;
  lastLogin: string;
  createdAt: string;
  stats: {
    published: number;
    drafts: number;
    scheduled: number;
    total: number;
  };
};

export type CreateUserPayload = {
  name: string;
  email: string;
  role: AdminRole;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  role: AdminRole;
};

export type BlogStatus = "draft" | "published" | "scheduled";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string };
};

export type ActivityEvent = {
  id: string;
  type: "publish" | "draft" | "login" | "delete" | "edit";
  message: string;
  time: string;
  createdAt: string;
};

export type DashboardStats = {
  totalPosts: number;
  published: number;
  drafts: number;
  scheduled: number;
};

export type ChartDataPoint = {
  date: string;
  posts: number;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
};
