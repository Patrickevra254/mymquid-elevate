# Staff Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a super-admin-only "Manage Users" section to the admin dashboard where users can be created, viewed, monitored, activated/deactivated, and deleted.

**Architecture:** New `src/admin/users/` feature folder mirroring the existing `blog` pattern — a Zustand store (`useUserStore`) backed by `userApi` in `mock/api.ts`, two pages (`UsersListPage`, `UserDetailPage`), three focused components (`UserTable`, `AddUserModal`, `UserStatCards`), protected by `RoleGuard(["super_admin"])` in the router, and surfaced via a conditional nav item in `SidebarNav`.

**Tech Stack:** React 19, React Router DOM 7, Zustand, React Hook Form, Zod, date-fns, shadcn/ui (Dialog, Badge, Tabs, DropdownMenu), lucide-react, Vitest + React Testing Library

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/admin/types.ts` | **Modify** | Add `UserWithStats`, `CreateUserPayload`, `UpdateUserPayload` |
| `src/admin/mock/data.ts` | **Modify** | Update `MOCK_USERS` to `UserWithStats[]` with stats + lastLogin |
| `src/admin/mock/api.ts` | **Modify** | Add `userApi` |
| `src/admin/mock/__tests__/api.test.ts` | **Modify** | Add `userApi` tests |
| `src/admin/users/useUserStore.ts` | **Create** | Zustand store for user state + actions |
| `src/admin/users/__tests__/useUserStore.test.ts` | **Create** | Store tests |
| `src/admin/users/components/AddUserModal.tsx` | **Create** | Add / Edit user modal form (React Hook Form + Zod) |
| `src/admin/users/components/UserTable.tsx` | **Create** | Table with columns + `•••` dropdown action menu |
| `src/admin/users/components/UserStatCards.tsx` | **Create** | 4-card stats row on detail page |
| `src/admin/users/UsersListPage.tsx` | **Create** | List page — table + modals + action handlers |
| `src/admin/users/__tests__/UsersListPage.test.tsx` | **Create** | List page tests |
| `src/admin/users/UserDetailPage.tsx` | **Create** | Detail page — header + stats + tabs |
| `src/admin/AdminRouter.tsx` | **Modify** | Add `/admin/users` and `/admin/users/:id` with `RoleGuard` |
| `src/admin/layout/SidebarNav.tsx` | **Modify** | Add Users nav item visible only to `super_admin` |

---

## Task 1: Update types and mock data

**Files:**
- Modify: `src/admin/types.ts`
- Modify: `src/admin/mock/data.ts`

- [ ] **Step 1: Add new types to types.ts**

Open `src/admin/types.ts`. After the existing `AdminUser` type, add:

```ts
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
```

- [ ] **Step 2: Update MOCK_USERS in data.ts**

Open `src/admin/mock/data.ts`. Change the import at the top to include `UserWithStats`:

```ts
import type {
  UserWithStats,
  BlogPost,
  ActivityEvent,
  DashboardStats,
  ChartDataPoint,
  Notification,
} from "../types";
```

Replace the existing `MOCK_USERS` array with:

```ts
export const MOCK_USERS: UserWithStats[] = [
  {
    id: "1",
    name: "Patrick Evra",
    email: "admin@mymquid.com",
    role: "super_admin",
    active: true,
    lastLogin: "2026-05-19T08:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
    stats: { published: 5, drafts: 1, scheduled: 2, total: 8 },
  },
  {
    id: "2",
    name: "Jane Staff",
    email: "staff@mymquid.com",
    role: "staff",
    active: true,
    lastLogin: "2026-05-18T14:00:00Z",
    createdAt: "2026-02-15T00:00:00Z",
    stats: { published: 3, drafts: 3, scheduled: 0, total: 6 },
  },
];
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/admin/types.ts src/admin/mock/data.ts
git commit -m "feat(users): add UserWithStats type and update mock data"
```

---

## Task 2: Add userApi to mock/api.ts and write tests

**Files:**
- Modify: `src/admin/mock/api.ts`
- Modify: `src/admin/mock/__tests__/api.test.ts`

- [ ] **Step 1: Write the failing tests**

Open `src/admin/mock/__tests__/api.test.ts`. Add this import at the top of the file (after existing imports):

```ts
import { userApi } from "../api";
import { MOCK_USERS } from "../data";
```

Add this test suite at the bottom of the file:

```ts
describe("userApi", () => {
  it("calls GET /users and returns array", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_USERS });
    const users = await userApi.getAll();
    expect(mockAxios.get).toHaveBeenCalledWith("/users");
    expect(Array.isArray(users)).toBe(true);
  });

  it("calls GET /users/:id", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: MOCK_USERS[0] });
    const user = await userApi.getById("1");
    expect(mockAxios.get).toHaveBeenCalledWith("/users/1");
    expect(user.id).toBe(MOCK_USERS[0].id);
  });

  it("calls POST /users to create a user", async () => {
    const payload = { name: "New User", email: "new@mymquid.com", role: "staff" as const };
    mockAxios.post.mockResolvedValueOnce({ data: { ...payload, id: "3", active: true, lastLogin: "", createdAt: "", stats: { published: 0, drafts: 0, scheduled: 0, total: 0 } } });
    await userApi.create(payload);
    expect(mockAxios.post).toHaveBeenCalledWith("/users", payload);
  });

  it("calls PUT /users/:id to update a user", async () => {
    const payload = { name: "Updated", email: "admin@mymquid.com", role: "super_admin" as const };
    mockAxios.put.mockResolvedValueOnce({ data: MOCK_USERS[0] });
    await userApi.update("1", payload);
    expect(mockAxios.put).toHaveBeenCalledWith("/users/1", payload);
  });

  it("calls PATCH /users/:id/status", async () => {
    mockAxios.patch.mockResolvedValueOnce({ data: null });
    await userApi.updateStatus("1", false);
    expect(mockAxios.patch).toHaveBeenCalledWith("/users/1/status", { active: false });
  });

  it("calls DELETE /users/:id", async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: null });
    await userApi.delete("1");
    expect(mockAxios.delete).toHaveBeenCalledWith("/users/1");
  });

  it("calls POST /users/:id/reset-password", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: null });
    await userApi.resetPassword("1");
    expect(mockAxios.post).toHaveBeenCalledWith("/users/1/reset-password");
  });

  it("calls GET /users/:id/posts", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: [] });
    const posts = await userApi.getPosts("1");
    expect(mockAxios.get).toHaveBeenCalledWith("/users/1/posts");
    expect(Array.isArray(posts)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/admin/mock/__tests__/api.test.ts
```

Expected: FAIL — `userApi` not exported from `api.ts`

- [ ] **Step 3: Add userApi to mock/api.ts**

Open `src/admin/mock/api.ts`. Add these imports at the top:

```ts
import type { UserWithStats, CreateUserPayload, UpdateUserPayload, BlogPost } from "../types";
```

Add the following at the end of the file:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/admin/mock/__tests__/api.test.ts
```

Expected: all tests pass (existing + 8 new)

- [ ] **Step 5: Commit**

```bash
git add src/admin/mock/api.ts src/admin/mock/__tests__/api.test.ts
git commit -m "feat(users): add userApi with full CRUD + tests"
```

---

## Task 3: Create useUserStore and tests

**Files:**
- Create: `src/admin/users/useUserStore.ts`
- Create: `src/admin/users/__tests__/useUserStore.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/admin/users/__tests__/useUserStore.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserStore } from "../useUserStore";
import { MOCK_USERS } from "../../mock/data";

vi.mock("../../mock/api", () => ({
  userApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getPosts: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

import { userApi } from "../../mock/api";
const mockUserApi = userApi as unknown as {
  getAll: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  getPosts: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  updateStatus: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  useUserStore.setState({
    users: [],
    selectedUser: null,
    userPosts: [],
    isLoading: false,
    isActionLoading: false,
  });
});

describe("useUserStore", () => {
  it("fetchUsers loads users from API", async () => {
    mockUserApi.getAll.mockResolvedValueOnce(MOCK_USERS);
    await useUserStore.getState().fetchUsers();
    expect(useUserStore.getState().users.length).toBe(MOCK_USERS.length);
  });

  it("fetchUser sets selectedUser", async () => {
    mockUserApi.getById.mockResolvedValueOnce(MOCK_USERS[0]);
    await useUserStore.getState().fetchUser("1");
    expect(useUserStore.getState().selectedUser?.id).toBe("1");
  });

  it("fetchUserPosts sets userPosts", async () => {
    mockUserApi.getPosts.mockResolvedValueOnce([]);
    await useUserStore.getState().fetchUserPosts("1");
    expect(Array.isArray(useUserStore.getState().userPosts)).toBe(true);
  });

  it("createUser calls userApi.create and refetches", async () => {
    const payload = { name: "New", email: "new@test.com", role: "staff" as const };
    mockUserApi.create.mockResolvedValueOnce({ ...MOCK_USERS[0], id: "3" });
    mockUserApi.getAll.mockResolvedValueOnce(MOCK_USERS);
    await useUserStore.getState().createUser(payload);
    expect(mockUserApi.create).toHaveBeenCalledWith(payload);
  });

  it("updateUser patches user in list", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    const updated = { ...MOCK_USERS[0], name: "Updated Name" };
    mockUserApi.update.mockResolvedValueOnce(updated);
    await useUserStore.getState().updateUser("1", { name: "Updated Name", email: MOCK_USERS[0].email, role: MOCK_USERS[0].role });
    expect(useUserStore.getState().users[0].name).toBe("Updated Name");
  });

  it("toggleUserStatus updates active field", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    mockUserApi.updateStatus.mockResolvedValueOnce(undefined);
    await useUserStore.getState().toggleUserStatus("1", false);
    expect(useUserStore.getState().users[0].active).toBe(false);
  });

  it("deleteUser removes user from list", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    mockUserApi.delete.mockResolvedValueOnce(undefined);
    await useUserStore.getState().deleteUser("1");
    expect(useUserStore.getState().users.find((u) => u.id === "1")).toBeUndefined();
  });

  it("resetUserPassword calls userApi.resetPassword", async () => {
    mockUserApi.resetPassword.mockResolvedValueOnce(undefined);
    await useUserStore.getState().resetUserPassword("1");
    expect(mockUserApi.resetPassword).toHaveBeenCalledWith("1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/admin/users/__tests__/useUserStore.test.ts
```

Expected: FAIL — `useUserStore` does not exist

- [ ] **Step 3: Create useUserStore.ts**

Create `src/admin/users/useUserStore.ts`:

```ts
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
    set({ isLoading: true });
    try {
      const selectedUser = await userApi.getById(id);
      set({ selectedUser, isLoading: false });
    } catch {
      set({ isLoading: false });
      toast.error("Failed to load user.");
    }
  },

  fetchUserPosts: async (id) => {
    set({ isLoading: true });
    try {
      const userPosts = await userApi.getPosts(id);
      set({ userPosts, isLoading: false });
    } catch {
      set({ isLoading: false });
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/admin/users/__tests__/useUserStore.test.ts
```

Expected: 8/8 PASS

- [ ] **Step 5: Commit**

```bash
git add src/admin/users/useUserStore.ts src/admin/users/__tests__/useUserStore.test.ts
git commit -m "feat(users): add useUserStore with full CRUD actions"
```

---

## Task 4: Create AddUserModal component

**Files:**
- Create: `src/admin/users/components/AddUserModal.tsx`

- [ ] **Step 1: Create AddUserModal.tsx**

Create `src/admin/users/components/AddUserModal.tsx`:

```tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserWithStats, CreateUserPayload, UpdateUserPayload, AdminRole } from "../../types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["super_admin", "staff"]),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  user?: UserWithStats | null;
  isLoading?: boolean;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  onClose: () => void;
};

export function AddUserModal({ open, user, isLoading, onSubmit, onClose }: Props) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "staff" },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
    } else {
      reset({ name: "", email: "", role: "staff" });
    }
  }, [user, setValue, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="user-name">Full Name</Label>
            <Input id="user-name" {...register("name")} placeholder="Enter full name" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              {...register("email")}
              placeholder="Enter email address"
              disabled={isEdit}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              defaultValue={user?.role ?? "staff"}
              onValueChange={(v) => setValue("role", v as AdminRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Saving…" : "Creating…"}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/admin/users/components/AddUserModal.tsx
git commit -m "feat(users): add AddUserModal form component"
```

---

## Task 5: Create UserTable component

**Files:**
- Create: `src/admin/users/components/UserTable.tsx`

- [ ] **Step 1: Create UserTable.tsx**

Create `src/admin/users/components/UserTable.tsx`:

```tsx
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonLoader } from "../../shared/components/SkeletonLoader";
import type { UserWithStats } from "../../types";

type Props = {
  users: UserWithStats[];
  isLoading: boolean;
  onEdit: (user: UserWithStats) => void;
  onResetPassword: (user: UserWithStats) => void;
  onToggleStatus: (user: UserWithStats) => void;
  onDelete: (user: UserWithStats) => void;
};

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className={
        role === "super_admin"
          ? "border-purple-500 text-purple-600"
          : "border-blue-500 text-blue-600"
      }
    >
      {role === "super_admin" ? "Super Admin" : "Staff"}
    </Badge>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        active ? "border-green-500 text-green-600" : "border-gray-400 text-gray-500"
      }
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) return <SkeletonLoader rows={5} />;

  if (users.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center text-muted-foreground">
        <p className="text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Published</th>
            <th className="px-4 py-3 text-right font-medium">Drafts</th>
            <th className="px-4 py-3 text-right font-medium">Scheduled</th>
            <th className="px-4 py-3 text-left font-medium">Last Login</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-muted/20 cursor-pointer transition-colors"
              onClick={() => navigate(`/admin/users/${user.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={user.active} />
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.published}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.drafts}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.scheduled}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(user.lastLogin), "MMM d, yyyy")}
              </td>
              <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResetPassword(user)}>
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                      {user.active ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/admin/users/components/UserTable.tsx
git commit -m "feat(users): add UserTable component with action menu"
```

---

## Task 6: Create UsersListPage and tests

**Files:**
- Create: `src/admin/users/UsersListPage.tsx`
- Create: `src/admin/users/__tests__/UsersListPage.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/admin/users/__tests__/UsersListPage.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UsersListPage from "../UsersListPage";
import { MOCK_USERS } from "../../mock/data";

vi.mock("../useUserStore", () => ({
  useUserStore: vi.fn(),
}));

import { useUserStore } from "../useUserStore";
const mockUseUserStore = useUserStore as unknown as ReturnType<typeof vi.fn>;

const defaultStore = {
  users: MOCK_USERS,
  isLoading: false,
  isActionLoading: false,
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  toggleUserStatus: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseUserStore.mockReturnValue(defaultStore);
});

describe("UsersListPage", () => {
  it("renders the page header and Add User button", () => {
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add user/i })).toBeInTheDocument();
  });

  it("renders user rows from the store", () => {
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.getByText(MOCK_USERS[0].name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_USERS[1].name)).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    mockUseUserStore.mockReturnValue({ ...defaultStore, users: [], isLoading: true });
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.queryByText(MOCK_USERS[0].name)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/admin/users/__tests__/UsersListPage.test.tsx
```

Expected: FAIL — `UsersListPage` does not exist

- [ ] **Step 3: Create UsersListPage.tsx**

Create `src/admin/users/UsersListPage.tsx`:

```tsx
import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../shared/components/PageHeader";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { UserTable } from "./components/UserTable";
import { AddUserModal } from "./components/AddUserModal";
import { useUserStore } from "./useUserStore";
import type { UserWithStats, CreateUserPayload, UpdateUserPayload } from "../types";

type ConfirmAction = {
  type: "delete" | "toggle" | "reset";
  user: UserWithStats;
};

export default function UsersListPage() {
  const {
    users,
    isLoading,
    isActionLoading,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    resetUserPassword,
  } = useUserStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<UserWithStats | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    await createUser(data as CreateUserPayload);
    setShowAddModal(false);
  };

  const handleEditSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (!editUser) return;
    await updateUser(editUser.id, data as UpdateUserPayload);
    setEditUser(null);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    if (type === "delete") await deleteUser(user.id);
    if (type === "toggle") await toggleUserStatus(user.id, !user.active);
    if (type === "reset") await resetUserPassword(user.id);
    setConfirmAction(null);
  };

  const confirmTitle = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete") return "Delete user?";
    if (confirmAction.type === "toggle")
      return confirmAction.user.active ? "Deactivate user?" : "Activate user?";
    return "Reset password?";
  };

  const confirmDescription = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete")
      return `This will permanently delete ${confirmAction.user.name}. This action cannot be undone.`;
    if (confirmAction.type === "toggle")
      return confirmAction.user.active
        ? `${confirmAction.user.name} will lose access to the admin panel.`
        : `${confirmAction.user.name} will regain access to the admin panel.`;
    return `A password reset email will be sent to ${confirmAction.user.email}.`;
  };

  const confirmLabel = () => {
    if (!confirmAction) return "Confirm";
    if (confirmAction.type === "delete") return "Delete";
    if (confirmAction.type === "toggle")
      return confirmAction.user.active ? "Deactivate" : "Activate";
    return "Send Reset Email";
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manage Users"
        description="All staff and admin accounts"
        action={
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        }
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={(user) => setEditUser(user)}
        onResetPassword={(user) => setConfirmAction({ type: "reset", user })}
        onToggleStatus={(user) => setConfirmAction({ type: "toggle", user })}
        onDelete={(user) => setConfirmAction({ type: "delete", user })}
      />

      <AddUserModal
        open={showAddModal}
        isLoading={isActionLoading}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
      />

      <AddUserModal
        open={!!editUser}
        user={editUser}
        isLoading={isActionLoading}
        onSubmit={handleEditSubmit}
        onClose={() => setEditUser(null)}
      />

      <ConfirmModal
        open={!!confirmAction}
        title={confirmTitle()}
        description={confirmDescription()}
        confirmLabel={confirmLabel()}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/admin/users/__tests__/UsersListPage.test.tsx
```

Expected: 3/3 PASS

- [ ] **Step 5: Commit**

```bash
git add src/admin/users/UsersListPage.tsx src/admin/users/__tests__/UsersListPage.test.tsx
git commit -m "feat(users): add UsersListPage with table and action modals"
```

---

## Task 7: Create UserStatCards component

**Files:**
- Create: `src/admin/users/components/UserStatCards.tsx`

- [ ] **Step 1: Create UserStatCards.tsx**

Create `src/admin/users/components/UserStatCards.tsx`:

```tsx
import { CheckCircle, FileText, Clock, LogIn } from "lucide-react";
import { format } from "date-fns";
import { StatCard } from "../../shared/components/StatCard";
import type { UserWithStats } from "../../types";

type Props = { user: UserWithStats };

export function UserStatCards({ user }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Published"
        value={user.stats.published}
        icon={CheckCircle}
      />
      <StatCard
        label="Drafts"
        value={user.stats.drafts}
        icon={FileText}
      />
      <StatCard
        label="Scheduled"
        value={user.stats.scheduled}
        icon={Clock}
      />
      <StatCard
        label="Last Login"
        value={format(new Date(user.lastLogin), "MMM d, yyyy")}
        icon={LogIn}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/admin/users/components/UserStatCards.tsx
git commit -m "feat(users): add UserStatCards component"
```

---

## Task 8: Create UserDetailPage

**Files:**
- Create: `src/admin/users/UserDetailPage.tsx`

- [ ] **Step 1: Create UserDetailPage.tsx**

Create `src/admin/users/UserDetailPage.tsx`:

```tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Mail, ShieldOff, Shield, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { BlogStatusBadge } from "../blog/components/BlogStatusBadge";
import { UserStatCards } from "./components/UserStatCards";
import { AddUserModal } from "./components/AddUserModal";
import { useUserStore } from "./useUserStore";
import type { CreateUserPayload, UpdateUserPayload } from "../types";

type ConfirmAction = "delete" | "toggle" | "reset";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedUser,
    userPosts,
    isLoading,
    isActionLoading,
    fetchUser,
    fetchUserPosts,
    updateUser,
    toggleUserStatus,
    deleteUser,
    resetUserPassword,
  } = useUserStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    if (!id) { navigate("/admin/users"); return; }
    fetchUser(id);
    fetchUserPosts(id);
  }, [id, fetchUser, fetchUserPosts, navigate]);

  if (isLoading || !selectedUser) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="rounded-lg border p-6 h-24 bg-muted animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <SkeletonLoader rows={5} />
      </div>
    );
  }

  const user = selectedUser;

  const handleEditSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    await updateUser(user.id, data as UpdateUserPayload);
    setShowEditModal(false);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction === "delete") {
      await deleteUser(user.id);
      navigate("/admin/users");
    } else if (confirmAction === "toggle") {
      await toggleUserStatus(user.id, !user.active);
    } else if (confirmAction === "reset") {
      await resetUserPassword(user.id);
    }
    setConfirmAction(null);
  };

  const confirmTitle = () => {
    if (confirmAction === "delete") return "Delete user?";
    if (confirmAction === "toggle")
      return user.active ? "Deactivate user?" : "Activate user?";
    return "Reset password?";
  };

  const confirmDescription = () => {
    if (confirmAction === "delete")
      return `This will permanently delete ${user.name}. This action cannot be undone.`;
    if (confirmAction === "toggle")
      return user.active
        ? `${user.name} will lose access to the admin panel.`
        : `${user.name} will regain access to the admin panel.`;
    return `A password reset email will be sent to ${user.email}.`;
  };

  const confirmLabel = () => {
    if (confirmAction === "delete") return "Delete";
    if (confirmAction === "toggle") return user.active ? "Deactivate" : "Activate";
    return "Send Reset Email";
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Users
      </Link>

      {/* Header */}
      <div className="rounded-lg border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary shrink-0">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold">{user.name}</h1>
              <Badge
                variant="outline"
                className={
                  user.role === "super_admin"
                    ? "border-purple-500 text-purple-600"
                    : "border-blue-500 text-blue-600"
                }
              >
                {user.role === "super_admin" ? "Super Admin" : "Staff"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.active
                    ? "border-green-500 text-green-600"
                    : "border-gray-400 text-gray-500"
                }
              >
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("reset")}
          >
            <Mail className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("toggle")}
          >
            {user.active ? (
              <><ShieldOff className="mr-2 h-4 w-4" /> Deactivate</>
            ) : (
              <><Shield className="mr-2 h-4 w-4" /> Activate</>
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmAction("delete")}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStatCards user={user} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="rounded-lg border p-6 grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Role</p>
              <p className="font-medium">
                {user.role === "super_admin" ? "Super Admin" : "Staff"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Status</p>
              <p className="font-medium">{user.active ? "Active" : "Inactive"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {format(new Date(user.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Last Login</p>
              <p className="font-medium">
                {format(new Date(user.lastLogin), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-sm font-medium mb-4">Recent Activity</h3>
            {userPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {userPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium truncate max-w-xs">{post.title}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <BlogStatusBadge status={post.status} />
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(post.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="pt-4">
          {userPosts.length === 0 ? (
            <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
              This user has no posts yet.
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {userPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{post.title}</td>
                      <td className="px-4 py-3">
                        <BlogStatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {post.category}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(post.updatedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/blog/edit/${post.id}`}>Edit</Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddUserModal
        open={showEditModal}
        user={user}
        isLoading={isActionLoading}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
      />

      <ConfirmModal
        open={!!confirmAction}
        title={confirmTitle()}
        description={confirmDescription()}
        confirmLabel={confirmLabel()}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add src/admin/users/UserDetailPage.tsx
git commit -m "feat(users): add UserDetailPage with stats and blog posts tabs"
```

---

## Task 9: Wire routes and navigation

**Files:**
- Modify: `src/admin/AdminRouter.tsx`
- Modify: `src/admin/layout/SidebarNav.tsx`

- [ ] **Step 1: Update AdminRouter.tsx**

Replace the full content of `src/admin/AdminRouter.tsx` with:

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./auth/authGuard";
import { RoleGuard } from "./auth/roleGuard";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./auth/ResetPasswordPage"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));
const BlogListPage = lazy(() => import("./blog/BlogListPage"));
const BlogEditorPage = lazy(() => import("./blog/BlogEditorPage"));
const BlogPreviewPage = lazy(() => import("./blog/BlogPreviewPage"));
const NotificationsPage = lazy(() => import("./notifications/NotificationsPage"));
const ProfilePage = lazy(() => import("./profile/ProfilePage"));
const UsersListPage = lazy(() => import("./users/UsersListPage"));
const UserDetailPage = lazy(() => import("./users/UserDetailPage"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function AdminRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/create" element={<BlogEditorPage />} />
            <Route path="blog/edit/:id" element={<BlogEditorPage />} />
            <Route path="blog/preview/:id" element={<BlogPreviewPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route element={<RoleGuard allowedRoles={["super_admin"]} />}>
              <Route path="users" element={<UsersListPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Suspense>
  );
}
```

- [ ] **Step 2: Update SidebarNav.tsx**

Replace the full content of `src/admin/layout/SidebarNav.tsx` with:

```tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "./useUIStore";
import { useAuthStore } from "../auth/useAuthStore";

export function SidebarNav() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const user = useAuthStore((s) => s.user);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/blog", icon: FileText, label: "Blog" },
    ...(user?.role === "super_admin"
      ? [{ to: "/admin/users", icon: Users, label: "Users" }]
      : []),
    { to: "/admin/notifications", icon: Bell, label: "Notifications" },
    { to: "/admin/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/admin/AdminRouter.tsx src/admin/layout/SidebarNav.tsx
git commit -m "feat(users): wire /admin/users routes and add Users nav item for super_admin"
```

---

## Task 10: Final check

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Push branch**

```bash
git push origin feature/admin-dashboard-phase1
```
