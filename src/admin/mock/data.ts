import type {
  AdminUser,
  BlogPost,
  ActivityEvent,
  DashboardStats,
  ChartDataPoint,
  Notification,
} from "../types";

export const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Patrick Evra", email: "admin@mymquid.com", role: "super_admin" },
  { id: "2", name: "Jane Staff", email: "staff@mymquid.com", role: "staff" },
];

export const MOCK_CREDENTIALS: Record<string, string> = {
  "admin@mymquid.com": "admin123",
  "staff@mymquid.com": "staff123",
};

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to MyMquid",
    slug: "welcome-to-mymquid",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Welcome to MyMquid!" }] }] }),
    status: "published",
    category: "Company News",
    tags: ["welcome", "company"],
    seo: { metaTitle: "Welcome to MyMquid", metaDescription: "Learn about MyMquid." },
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "2",
    title: "Our Technology Solutions",
    slug: "our-technology-solutions",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Explore our solutions." }] }] }),
    status: "published",
    category: "Solutions",
    tags: ["tech", "solutions"],
    seo: { metaTitle: "Our Technology Solutions", metaDescription: "Explore MyMquid solutions." },
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "3",
    title: "2026 Industry Trends",
    slug: "2026-industry-trends",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Key trends for 2026." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["trends", "2026"],
    seo: { metaTitle: "2026 Industry Trends", metaDescription: "Key trends shaping industries in 2026." },
    createdAt: "2026-04-20T08:00:00Z",
    updatedAt: "2026-05-01T14:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "4",
    title: "MyMquid Partners Programme",
    slug: "mymquid-partners-programme",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Join our partner network." }] }] }),
    status: "published",
    category: "Company News",
    tags: ["partners", "programme"],
    seo: { metaTitle: "Partners Programme", metaDescription: "Join the MyMquid partner network." },
    createdAt: "2026-04-25T11:00:00Z",
    updatedAt: "2026-04-25T11:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "5",
    title: "Case Study: Digital Transformation",
    slug: "case-study-digital-transformation",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "How we helped a client transform." }] }] }),
    status: "published",
    category: "Case Studies",
    tags: ["case-study", "digital"],
    seo: { metaTitle: "Digital Transformation Case Study", metaDescription: "A MyMquid success story." },
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-01T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "6",
    title: "AI in Modern Business",
    slug: "ai-in-modern-business",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The role of AI today." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["ai", "business"],
    seo: { metaTitle: "AI in Modern Business", metaDescription: "How AI shapes modern enterprises." },
    createdAt: "2026-05-05T09:00:00Z",
    updatedAt: "2026-05-10T16:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "7",
    title: "Careers at MyMquid 2026",
    slug: "careers-at-mymquid-2026",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "We are hiring!" }] }] }),
    status: "scheduled",
    category: "Company News",
    tags: ["careers", "hiring"],
    seo: { metaTitle: "Careers at MyMquid", metaDescription: "Join the MyMquid team." },
    scheduledAt: "2026-06-01T09:00:00Z",
    createdAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
  {
    id: "8",
    title: "Cloud Security Best Practices",
    slug: "cloud-security-best-practices",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Securing your cloud environment." }] }] }),
    status: "published",
    category: "Solutions",
    tags: ["cloud", "security"],
    seo: { metaTitle: "Cloud Security Best Practices", metaDescription: "Protect your cloud workloads." },
    createdAt: "2026-05-08T11:00:00Z",
    updatedAt: "2026-05-08T11:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "9",
    title: "What is IoT and Why It Matters",
    slug: "what-is-iot-and-why-it-matters",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Understanding the Internet of Things." }] }] }),
    status: "draft",
    category: "Insights",
    tags: ["iot", "technology"],
    seo: { metaTitle: "What is IoT", metaDescription: "A beginner's guide to IoT." },
    createdAt: "2026-05-14T08:00:00Z",
    updatedAt: "2026-05-14T08:00:00Z",
    author: { id: "2", name: "Jane Staff" },
  },
  {
    id: "10",
    title: "MyMquid Product Roadmap",
    slug: "mymquid-product-roadmap",
    content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "What's coming next." }] }] }),
    status: "scheduled",
    category: "Company News",
    tags: ["roadmap", "product"],
    seo: { metaTitle: "MyMquid Roadmap", metaDescription: "Our plans for the next 12 months." },
    scheduledAt: "2026-06-15T09:00:00Z",
    createdAt: "2026-05-17T10:00:00Z",
    updatedAt: "2026-05-17T10:00:00Z",
    author: { id: "1", name: "Patrick Evra" },
  },
];

export const MOCK_STATS: DashboardStats = {
  totalPosts: 10,
  published: 5,
  drafts: 3,
  scheduled: 2,
};

export const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: "1", type: "publish", message: "Post published: Welcome to MyMquid", time: "2h ago", createdAt: "2026-05-19T08:00:00Z" },
  { id: "2", type: "draft", message: "Draft saved: AI in Modern Business", time: "4h ago", createdAt: "2026-05-19T06:00:00Z" },
  { id: "3", type: "login", message: "Admin logged in", time: "5h ago", createdAt: "2026-05-19T05:00:00Z" },
  { id: "4", type: "edit", message: "Post edited: Our Technology Solutions", time: "1d ago", createdAt: "2026-05-18T10:00:00Z" },
  { id: "5", type: "publish", message: "Post published: Cloud Security Best Practices", time: "2d ago", createdAt: "2026-05-17T10:00:00Z" },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-04-20");
  date.setDate(date.getDate() + i);
  return {
    date: date.toISOString().split("T")[0],
    posts: Math.floor(Math.random() * 3),
  };
});

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Post Published", message: "Welcome to MyMquid is now live.", type: "success", read: false, createdAt: "2026-05-19T08:00:00Z" },
  { id: "2", title: "Draft Reminder", message: "AI in Modern Business has unsaved changes.", type: "warning", read: false, createdAt: "2026-05-19T06:00:00Z" },
  { id: "3", title: "Scheduled Post", message: "Careers at MyMquid 2026 is scheduled for June 1.", type: "info", read: true, createdAt: "2026-05-18T10:00:00Z" },
];

export const MOCK_CATEGORIES = [
  "Company News",
  "Solutions",
  "Insights",
  "Case Studies",
];
