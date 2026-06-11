# Mquid Admin — Backend Requirements

**Prepared for:** Backend Developer  
**Project:** Mquid Admin Platform  
**Date:** 2026-06-11  

---

## Overview

This document outlines two sets of backend requirements:

1. **Role-Based Data Scoping** — Staff users must only see their own data across the blog list and dashboard.
2. **Previously Agreed Features** — Blog post moderation and setup key authentication (already documented separately and partially implemented on the frontend).

---

## Part 1 — Role-Based Data Scoping

### Background

The admin panel has two roles:

| Role | Description |
|---|---|
| `super_admin` | Full visibility — sees all posts, all users, platform-wide stats |
| `staff` | Scoped visibility — sees only their own posts and their own stats |

The frontend does **not** send any extra query parameters for this. The backend must read the authenticated user's role from the JWT token and automatically scope the response.

---

### Affected Endpoints

#### 1. `GET /api/v1/blog`

**Current behaviour:** Returns all blog posts regardless of who is asking.

**Required behaviour:**
- If `role === "super_admin"` → return all posts (no change)
- If `role === "staff"` → return only posts where `authorId === authenticatedUser.id`

Existing query filters (`status`, `category`, `search`) must still apply on top of the author filter.

**Response shape:** No change. Same paginated format.

---

#### 2. `GET /api/v1/dashboard/stats`

**Current behaviour:** Returns platform-wide post counts.

**Required behaviour:**
- If `role === "super_admin"` → return platform-wide counts (no change)
- If `role === "staff"` → return counts scoped to the authenticated user's posts only

**Expected response shape (unchanged):**
```json
{
  "totalPosts": 4,
  "published": 2,
  "drafts": 1,
  "scheduled": 1
}
```

---

#### 3. `GET /api/v1/dashboard/chart`

**Current behaviour:** Returns post activity chart data for all users.

**Required behaviour:**
- If `role === "super_admin"` → return platform-wide chart data (no change)
- If `role === "staff"` → return chart data scoped to the authenticated user's posts only

**Expected response shape (unchanged):**
```json
[
  { "date": "2026-06-01", "posts": 2 },
  { "date": "2026-06-02", "posts": 1 }
]
```

---

#### 4. `GET /api/v1/dashboard/activity`

**Current behaviour:** Returns recent activity across all users.

**Required behaviour:**
- If `role === "super_admin"` → return all activity (no change)
- If `role === "staff"` → return only activity events related to the authenticated user (their own logins, their own post edits/publishes/deletes)

**Expected response shape (unchanged).**

---

### Summary Table

| Endpoint | super_admin | staff |
|---|---|---|
| `GET /api/v1/blog` | All posts | Own posts only |
| `GET /api/v1/dashboard/stats` | Platform-wide counts | Own post counts only |
| `GET /api/v1/dashboard/chart` | Platform-wide chart | Own post chart only |
| `GET /api/v1/dashboard/activity` | All activity | Own activity only |

> **Note:** No frontend changes are required for this feature. The frontend sends the same requests. Scoping is done entirely server-side using the JWT token.

---

## Part 2 — Blog Post Moderation

### New Fields on Blog Post Object

Every post returned from `GET /api/v1/blog` and related endpoints must include these additional fields:

```json
{
  "id": "...",
  "title": "...",
  "status": "published",
  "moderationStatus": "pending",
  "reviewedAt": null,
  "rejectionReason": null,
  "reviewedById": null,
  "reviewer": null
}
```

| Field | Type | Description |
|---|---|---|
| `moderationStatus` | `"pending" \| "approved" \| "rejected"` | Always set to `"pending"` on creation — never read from frontend |
| `reviewedAt` | `string \| null` | ISO timestamp of when it was reviewed |
| `rejectionReason` | `string \| null` | Optional reason provided when rejecting |
| `reviewedById` | `string \| null` | ID of the reviewer |
| `reviewer` | `{ id: string; name: string } \| null` | Reviewer name/id object |

---

### Moderation Endpoints

#### `GET /api/v1/admin/posts`

Fetch posts for the moderation queue. Requires `super_admin` role.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | `"pending" \| "approved" \| "rejected"` | Filter by moderation status. Omit for all. |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Response:** Same paginated blog post format, including the new moderation fields.

---

#### `POST /api/v1/admin/posts/:id/approve`

Approve a post. Requires `super_admin` role.

**Request body:** `{}` (empty)

**Success response:** Updated post object with `moderationStatus: "approved"`.

---

#### `POST /api/v1/admin/posts/:id/reject`

Reject a post. Requires `super_admin` role.

**Request body:**
```json
{
  "reason": "Content doesn't meet guidelines"
}
```
`reason` is optional.

**Success response:** Updated post object with `moderationStatus: "rejected"`.

---

## Part 3 — Setup Key Authentication

### Login Response — New Case

`POST /api/v1/auth/login` must support two response shapes:

**Case A — Normal login (existing user with password set):**
```json
{
  "access_token": "eyJ...",
  "user": { "id": "...", "email": "...", "role": "staff" }
}
```

**Case B — First-time login with setup key:**
```json
{
  "requires_password_setup": true,
  "setup_token": "eyJ..."
}
```

The frontend detects `requires_password_setup: true` and redirects to `/admin/setup-password`. The `setup_token` is short-lived (15 min) and stored in `sessionStorage` only — never as an auth token.

---

### New Endpoint: Set Password via Setup Token

#### `POST /api/v1/auth/setup-password`

**Request body:**
```json
{
  "setupToken": "<the setup_token from login>",
  "password": "NewPass1!",
  "confirmPassword": "NewPass1!"
}
```

**Success response:**
```json
{
  "access_token": "eyJ...",
  "user": { "id": "...", "email": "...", "role": "staff" }
}
```

**Error responses:**

| HTTP | Condition | Message |
|---|---|---|
| `400` | Passwords do not match | `"Passwords do not match"` |
| `401` | Token expired or invalid | `"Invalid or expired setup token"` |
| `400` | Password already set | `"Password has already been set"` |

---

### User Creation — Setup Key in Response

`POST /api/v1/users` response must include a `setupKey` field **only at creation time**:

```json
{
  "id": "...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "staff",
  "passwordSet": false,
  "setupKey": "a3f9c2d1-84fc-4e06-9a7c-db1c941e"
}
```

The `setupKey` is shown once in a modal on the frontend and then never shown again. It must not be included in subsequent `GET /users` or `GET /users/:id` responses.

---

### New Field on User Object

All user responses (`GET /users`, `GET /users/:id`) must include:

```json
{
  "passwordSet": false
}
```

`passwordSet: false` means the user has never set a password — the frontend uses this to show the **Regenerate Setup Key** button on the user detail page.

---

### Regenerate Setup Key Endpoint

#### `POST /api/v1/users/:id/regenerate-setup-key`

Requires `super_admin` role.

**Request body:** `{}` (empty)

**Success response (user has not set password):**
```json
{
  "setupKey": "b7e2a1f4-..."
}
```

**Error response (user already has a password):**
```json
{
  "statusCode": 400,
  "message": "Cannot regenerate setup key — user has already set their password"
}
```

---

## Existing Endpoint — No Changes Required

- `POST /api/v1/auth/set-password` — invite link flow (unchanged)
- Axios Authorization Bearer interceptor — no changes needed
- All other endpoints not listed above — no changes needed
