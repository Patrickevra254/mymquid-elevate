# Staff Management — Design Spec

**Date:** 2026-06-01
**Status:** Approved

---

## Goal

Give the super admin a full user management section inside the admin dashboard. The super admin can create staff accounts, monitor blog performance per user, and manage account lifecycle (activate, deactivate, reset password, delete). Staff users see no trace of this section.

---

## Roles

| Role | Access |
|---|---|
| `super_admin` | Full dashboard including Manage Users |
| `staff` | Dashboard, Blog, Notifications, Profile only |

Both roles share the same routes. Access is enforced by `RoleGuard` — staff hitting `/admin/users/*` are redirected to `/admin/dashboard`.

---

## Routing

| Route | Component | Guard |
|---|---|---|
| `/admin/users` | `UsersListPage.tsx` | AuthGuard + RoleGuard(`super_admin`) |
| `/admin/users/:id` | `UserDetailPage.tsx` | AuthGuard + RoleGuard(`super_admin`) |

Added to `AdminRouter.tsx` using the existing pattern.

---

## Navigation

**`SidebarNav.tsx`** — new nav item added after Blog:

```
Users  [UsersIcon]  /admin/users  — visible only when user.role === "super_admin"
```

Staff sidebar remains: Dashboard · Blog · Notifications · Profile.
Super admin sidebar: Dashboard · Blog · **Users** · Notifications · Profile.

---

## Feature 1 — Users List Page (`/admin/users`)

**Header:**
- Title: "Manage Users" · Subtitle: "All staff and admin accounts"
- Top-right: "Add User" button → opens Add User modal

**Table columns:**

| Column | Content |
|---|---|
| User | Avatar + name + email |
| Role | Badge — `Super Admin` (purple) \| `Staff` (blue) |
| Status | Badge — `Active` (green) \| `Inactive` (grey) |
| Posts Published | Count |
| Drafts | Count |
| Scheduled | Count |
| Last Login | Formatted date |
| Actions | `•••` dropdown menu |

**`•••` Actions menu items:**
- View → navigates to `/admin/users/:id`
- Edit → opens Edit User modal (pre-filled)
- Reset Password → confirm dialog → calls API → success toast
- Activate / Deactivate → confirm modal → toggles status
- Delete → confirm modal (typed confirmation) → removes user

**Row click:** Navigates to `/admin/users/:id`

**Empty state:** "No users found." with Add User button

**Loading state:** Skeleton rows while fetching

---

## Feature 2 — User Detail Page (`/admin/users/:id`)

**Header:**
- Avatar, full name, email, role badge, status badge
- Action buttons: Edit · Reset Password · Activate/Deactivate · Delete

**Stats row — 4 cards:**

| Card | Value | Source |
|---|---|---|
| Published | Total published posts by this user | `GET /users/:id` (pre-computed by backend) |
| Drafts | Total draft posts | `GET /users/:id` (pre-computed by backend) |
| Scheduled | Total scheduled posts | `GET /users/:id` (pre-computed by backend) |
| Last Login | Formatted date/time | `GET /users/:id` |

**Tabs:**

### Overview tab
- Account info: name, email, role, status, member since (`createdAt`)
- Recent activity: last 5 posts by this user sorted by `updatedAt` descending — sourced from `GET /users/:id/posts`, no separate activity endpoint needed

### Blog Posts tab
- Table: Title · Status badge · Category · Date · Actions
- "Edit" → `/admin/blog/edit/:id`
- "View" → `/blog/:slug` (opens in new tab)
- Empty state: "This user has no posts yet."

**Loading state:** Skeleton cards and skeleton table while fetching

---

## Feature 3 — Add User Modal

**Trigger:** "Add User" button on list page

**Form fields:**

| Field | Type | Validation |
|---|---|---|
| Full Name | Text | Required |
| Email | Email | Required, valid format |
| Role | Dropdown (`Staff` / `Super Admin`) | Required, defaults to `Staff` |

**On submit:**
- Calls `POST /users`
- API creates account and sends welcome email with set-password link
- Success: modal closes, list refreshes, toast — "User created. An invite email has been sent to [email]."
- Error: inline error below form (e.g. "Email already in use")
- Loading: submit button shows spinner + "Creating…"

---

## Feature 4 — Edit User Modal

Same layout as Add User, pre-filled with existing values.

**On submit:**
- Calls `PUT /users/:id`
- Success toast: "User updated successfully."
- Error: inline error message

---

## Zustand Store — `useUserStore.ts`

```ts
type UserStore = {
  users: AdminUser[];
  selectedUser: AdminUser | null;
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
```

---

## API Layer — `userApi` (added to `src/admin/mock/api.ts`)

| Method | Call | Description |
|---|---|---|
| `getAll()` | `GET /users` | All users with stats |
| `getById(id)` | `GET /users/:id` | Single user |
| `create(data)` | `POST /users` | Create + trigger invite email |
| `update(id, data)` | `PUT /users/:id` | Edit name/email/role |
| `updateStatus(id, active)` | `PATCH /users/:id/status` | Activate or deactivate |
| `delete(id)` | `DELETE /users/:id` | Remove user |
| `resetPassword(id)` | `POST /users/:id/reset-password` | Trigger reset email |
| `getPosts(id)` | `GET /users/:id/posts` | User's blog posts |

---

## Files Changed

| File | Change |
|---|---|
| `src/admin/users/UsersListPage.tsx` | **New** — list page with table + modals |
| `src/admin/users/UserDetailPage.tsx` | **New** — detail page with stats + tabs |
| `src/admin/users/useUserStore.ts` | **New** — Zustand store |
| `src/admin/users/components/UserTable.tsx` | **New** — table with action menu |
| `src/admin/users/components/AddUserModal.tsx` | **New** — add/edit modal form |
| `src/admin/users/components/UserStatCards.tsx` | **New** — 4-card stats row |
| `src/admin/users/__tests__/useUserStore.test.ts` | **New** — store tests |
| `src/admin/users/__tests__/UsersListPage.test.tsx` | **New** — list page tests |
| `src/admin/mock/api.ts` | Add `userApi` |
| `src/admin/AdminRouter.tsx` | Add `/admin/users` and `/admin/users/:id` routes |
| `src/admin/layout/SidebarNav.tsx` | Add Users nav item (super_admin only) |
| `src/admin/types.ts` | Add user stats fields if needed |

---

## Required Backend API Endpoints

All endpoints require `Authorization: Bearer <token>` with `role: super_admin`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users (id, name, email, role, status, stats, lastLogin) |
| GET | `/users/:id` | Single user details |
| POST | `/users` | Create user + send invite email |
| PUT | `/users/:id` | Edit name/email/role |
| PATCH | `/users/:id/status` | `{ active: boolean }` |
| DELETE | `/users/:id` | Remove user |
| POST | `/users/:id/reset-password` | Trigger password reset email |
| GET | `/users/:id/posts` | Blog posts by this user |

**Invite flow:** `POST /users` creates account → backend sends welcome email with a set-password link → user visits link, sets password, logs in normally.

---

## Out of Scope

- Staff-to-staff messaging
- Granular permissions beyond role (e.g. "can only post to category X")
- Activity log page (covered by recent activity summary on Overview tab)
