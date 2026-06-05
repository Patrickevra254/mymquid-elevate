import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../mymquid-new-features-api.pdf");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MyMquid — New Features API Specification</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    line-height: 1.6;
  }

  /* ── Cover ── */
  .cover {
    page-break-after: always;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    padding: 60px;
  }
  .cover-logo { font-size: 52px; font-weight: 800; letter-spacing: -2px; background: linear-gradient(135deg, #818cf8, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
  .cover-tag { display: inline-block; background: rgba(129,140,248,0.15); border: 1px solid rgba(129,140,248,0.3); border-radius: 99px; padding: 4px 16px; font-size: 12px; color: #a5b4fc; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
  .cover-sub { font-size: 24px; font-weight: 300; color: #94a3b8; margin-bottom: 8px; }
  .cover-divider { width: 60px; height: 3px; background: linear-gradient(90deg,#818cf8,#38bdf8); border-radius: 2px; margin: 20px auto; }
  .cover-desc { font-size: 14px; color: #64748b; max-width: 520px; margin: 0 auto; line-height: 1.9; }
  .cover-chips { margin-top: 50px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .cover-chip { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); border-radius: 20px; padding: 5px 16px; font-size: 11px; color: #a5b4fc; }
  .cover-alert { margin-top: 40px; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 10px; padding: 14px 24px; font-size: 12px; color: #fbbf24; max-width: 480px; }

  /* ── TOC ── */
  .toc-page { page-break-after: always; padding: 50px 60px; }
  .toc-title { font-size: 30px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .toc-subtitle { font-size: 13px; color: #64748b; margin-bottom: 36px; padding-bottom: 16px; border-bottom: 3px solid #818cf8; display: inline-block; }
  .toc-section { margin-bottom: 32px; }
  .toc-section-title { font-size: 11px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .toc-item { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px dotted #e2e8f0; color: #334155; font-size: 13px; }
  .toc-item:last-child { border-bottom: none; }
  .toc-method { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-family: monospace; }
  .m-get { background: #dbeafe; color: #1d4ed8; }
  .m-post { background: #dcfce7; color: #166534; }
  .m-put { background: #fef9c3; color: #854d0e; }
  .m-patch { background: #ffedd5; color: #9a3412; }
  .m-delete { background: #fee2e2; color: #991b1b; }

  /* ── Pages ── */
  .page { padding: 50px 60px; page-break-before: always; }
  .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 3px solid #818cf8; }
  .section-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #818cf8, #38bdf8); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .section-title { font-size: 26px; font-weight: 700; color: #0f172a; }
  .section-subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }
  .new-badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 8px; vertical-align: middle; }

  /* ── Cards ── */
  .endpoint-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; overflow: hidden; }
  .endpoint-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
  .endpoint-title { font-size: 14px; font-weight: 600; color: #1e293b; }
  .endpoint-desc { font-size: 12px; color: #64748b; margin-left: auto; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .endpoint-body { padding: 20px; }
  .subsection { margin-bottom: 18px; }
  .subsection:last-child { margin-bottom: 0; }
  .subsection-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #818cf8; margin-bottom: 8px; }

  /* ── Code ── */
  pre, code { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; }
  pre { background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
  .json-key { color: #7dd3fc; }
  .json-str { color: #86efac; }
  .json-num { color: #fbbf24; }
  .json-bool { color: #f87171; }
  .json-null { color: #94a3b8; }
  .json-comment { color: #64748b; font-style: italic; }

  /* ── Badges ── */
  .badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
  .badge-required { background: #fee2e2; color: #991b1b; }
  .badge-optional { background: #f0fdf4; color: #166534; }
  .badge-auth { background: #fef3c7; color: #92400e; }
  .badge-super { background: #fce7f3; color: #9d174d; }
  .badge-new { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f1f5f9; color: #475569; font-weight: 600; padding: 8px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  td code { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; color: #7c3aed; }

  /* ── Callouts ── */
  .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #1e40af; }
  .warn-box { background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #92400e; }
  .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #166534; }
  .error-box { background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #991b1b; }

  /* ── Layout helpers ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .flow-step { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; }
  .flow-num { width: 28px; height: 28px; background: #818cf8; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .flow-content { padding-top: 4px; }
  .flow-label { font-weight: 600; color: #1e293b; font-size: 13px; }
  .flow-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .flow-arrow { margin-left: 13px; margin-bottom: 4px; color: #cbd5e1; font-size: 16px; line-height: 1; }
  .mt-0 { margin-top: 0 !important; }
  .mb-0 { margin-bottom: 0 !important; }
  .mt-14 { margin-top: 14px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════
     COVER
════════════════════════════════════════════════════ -->
<div class="cover">
  <div class="cover-logo">MyMquid</div>
  <div class="cover-tag">New Features — API Specification</div>
  <div class="cover-sub">User Management &amp; File Upload</div>
  <div class="cover-divider"></div>
  <div class="cover-desc">
    API specification for the two newly built frontend features that require
    new backend endpoints: the <strong>User Management</strong> system (staff accounts,
    roles, performance monitoring) and the <strong>File Upload</strong> service
    (blog featured images, avatars, OG images).
  </div>
  <div class="cover-chips">
    <span class="cover-chip">Version 1.0</span>
    <span class="cover-chip">June 2026</span>
    <span class="cover-chip">NestJS</span>
    <span class="cover-chip">JWT Auth</span>
    <span class="cover-chip">REST</span>
  </div>
  <div class="cover-alert">
    ⚠️ These endpoints do not yet exist on the backend. This document defines
    the exact contract the frontend expects — implement accordingly.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     TABLE OF CONTENTS
════════════════════════════════════════════════════ -->
<div class="toc-page">
  <div class="toc-title">Contents</div>
  <div class="toc-subtitle">Two feature groups · 11 new endpoints · 1 invite flow</div>

  <div class="toc-section">
    <div class="toc-section-title">01 — Overview &amp; Data Models</div>
    <div class="toc-item"><span>Base URL &amp; Authentication</span><span>3</span></div>
    <div class="toc-item"><span>UserWithStats model</span><span>3</span></div>
    <div class="toc-item"><span>CreateUserPayload / UpdateUserPayload</span><span>3</span></div>
    <div class="toc-item"><span>Role-Based Access Control</span><span>4</span></div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">02 — User Management API <span class="new-badge">NEW</span></div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/users — List all users with stats</span><span>5</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/users/:id — Get user with stats</span><span>5</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/users — Create user + send invite</span><span>6</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-put">PUT</span>/users/:id — Update user</span><span>6</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-patch">PATCH</span>/users/:id/status — Activate / Deactivate</span><span>7</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-delete">DELETE</span>/users/:id — Delete user</span><span>7</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/users/:id/reset-password — Trigger reset email</span><span>7</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/users/:id/posts — User's blog posts</span><span>8</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">03 — Invite / Set Password Flow <span class="new-badge">NEW</span></div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/auth/set-password — First-time password setup</span><span>8</span>
    </div>
    <div class="toc-item"><span>End-to-end invite flow diagram</span><span>9</span></div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">04 — File Upload API <span class="new-badge">NEW</span></div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/upload — Upload image file</span><span>10</span>
    </div>
    <div class="toc-item"><span>Upload types &amp; storage notes</span><span>10</span></div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">05 — Quick Reference</div>
    <div class="toc-item"><span>All new endpoints at a glance</span><span>11</span></div>
    <div class="toc-item"><span>Frontend integration points</span><span>11</span></div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 1 — OVERVIEW & DATA MODELS
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📐</div>
    <div>
      <div class="section-title">01 — Overview &amp; Data Models</div>
      <div class="section-subtitle">Base URL, authentication requirements, and TypeScript contracts</div>
    </div>
  </div>

  <!-- Base URL & Auth -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Base URL &amp; Authentication</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Base URL</div>
          <pre>https://mquid.onrender.com/api/v1</pre>
          <div class="subsection-title" style="margin-top:14px">All requests include</div>
          <pre>Content-Type: application/json
Authorization: Bearer &lt;jwt_token&gt;</pre>
        </div>
        <div>
          <div class="subsection-title">Token Source</div>
          <p style="font-size:12px;color:#334155;line-height:1.8">
            The frontend reads the JWT from <code>localStorage</code> key
            <code>mymquid-admin-auth</code> (Zustand persist state).
            It is injected into every request automatically via the Axios interceptor
            in <code>src/lib/axios.ts</code>.
          </p>
          <div class="warn-box" style="margin-top:12px;margin-bottom:0">
            All <code>/users</code> endpoints require <code>role: "super_admin"</code> in the JWT payload.
            Return <code>403 Forbidden</code> for any other role.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- UserWithStats model -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">UserWithStats</div>
      <div class="endpoint-desc">Response shape for all <code>/users</code> endpoints</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">TypeScript Definition</div>
          <pre>type UserWithStats = {
  id:        string;         <span class="json-comment">// UUID</span>
  name:      string;
  email:     string;
  role:      "super_admin" | "staff";
  avatar?:   string;         <span class="json-comment">// URL or null</span>
  active:    boolean;        <span class="json-comment">// account status</span>
  lastLogin: string;         <span class="json-comment">// ISO 8601</span>
  createdAt: string;         <span class="json-comment">// ISO 8601</span>
  stats: {
    published: number;
    drafts:    number;
    scheduled: number;
    total:     number;
  };
};</pre>
        </div>
        <div>
          <div class="subsection-title">Example JSON</div>
          <pre>{
  <span class="json-key">"id"</span>:        <span class="json-str">"a1b2c3"</span>,
  <span class="json-key">"name"</span>:      <span class="json-str">"Jane Staff"</span>,
  <span class="json-key">"email"</span>:     <span class="json-str">"jane@mymquid.com"</span>,
  <span class="json-key">"role"</span>:      <span class="json-str">"staff"</span>,
  <span class="json-key">"avatar"</span>:    <span class="json-null">null</span>,
  <span class="json-key">"active"</span>:    <span class="json-bool">true</span>,
  <span class="json-key">"lastLogin"</span>: <span class="json-str">"2026-05-18T14:00:00Z"</span>,
  <span class="json-key">"createdAt"</span>: <span class="json-str">"2026-02-15T00:00:00Z"</span>,
  <span class="json-key">"stats"</span>: {
    <span class="json-key">"published"</span>: <span class="json-num">3</span>,
    <span class="json-key">"drafts"</span>:    <span class="json-num">2</span>,
    <span class="json-key">"scheduled"</span>: <span class="json-num">0</span>,
    <span class="json-key">"total"</span>:     <span class="json-num">5</span>
  }
}</pre>
        </div>
      </div>
      <div class="info-box mt-14 mb-0">
        <strong>stats</strong> must be pre-computed by the backend from the <code>blog_posts</code> table.
        Count posts <code>WHERE author_id = :id</code> grouped by <code>status</code>.
        <code>total</code> = sum of all statuses. Do NOT make the frontend compute these from a list of posts.
      </div>
    </div>
  </div>

  <!-- Payload types -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">CreateUserPayload &amp; UpdateUserPayload</div>
      <div class="endpoint-desc">Request bodies for POST and PUT /users</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">CreateUserPayload (POST /users)</div>
          <pre>{
  <span class="json-key">"name"</span>:  <span class="json-str">"Jane Staff"</span>,    <span class="json-comment">// required, min 2</span>
  <span class="json-key">"email"</span>: <span class="json-str">"jane@mymquid.com"</span>, <span class="json-comment">// required, unique</span>
  <span class="json-key">"role"</span>:  <span class="json-str">"staff"</span>            <span class="json-comment">// required</span>
}</pre>
          <div class="info-box" style="margin-top:10px;margin-bottom:0">
            No <code>password</code> field — account is created with no password. Backend sends
            a "Set your password" invite email. See Section 03 for the full flow.
          </div>
        </div>
        <div>
          <div class="subsection-title">UpdateUserPayload (PUT /users/:id)</div>
          <pre>{
  <span class="json-key">"name"</span>:  <span class="json-str">"Jane Updated"</span>,  <span class="json-comment">// required</span>
  <span class="json-key">"email"</span>: <span class="json-str">"jane@mymquid.com"</span>,<span class="json-comment">// required</span>
  <span class="json-key">"role"</span>:  <span class="json-str">"super_admin"</span>    <span class="json-comment">// required</span>
}</pre>
          <div class="warn-box" style="margin-top:10px;margin-bottom:0">
            The frontend disables the email field in edit mode, but the email is still
            included in the payload. If the backend allows email changes, validate uniqueness.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- RBAC table -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Role-Based Access Control for User Management</div>
    </div>
    <div class="endpoint-body">
      <table>
        <thead>
          <tr><th>Endpoint group</th><th>super_admin</th><th>staff</th><th>unauthenticated</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /users</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>GET /users/:id</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>POST /users</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>PUT /users/:id</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>PATCH /users/:id/status</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>DELETE /users/:id</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>POST /users/:id/reset-password</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>GET /users/:id/posts</code></td><td>✅ Allowed</td><td>🚫 403</td><td>🚫 401</td></tr>
          <tr><td><code>POST /auth/set-password</code></td><td>✅</td><td>✅</td><td>✅ (invite token)</td></tr>
          <tr><td><code>POST /upload</code></td><td>✅ Allowed</td><td>✅ Allowed</td><td>🚫 401</td></tr>
        </tbody>
      </table>
      <div class="error-box mt-14 mb-0">
        The frontend enforces this via <code>RoleGuard</code> in the UI, but the backend MUST also
        enforce role checks independently. Never rely solely on frontend guards for security.
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 2 — USER MANAGEMENT API
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">👥</div>
    <div>
      <div class="section-title">02 — User Management API <span class="new-badge">NEW</span></div>
      <div class="section-subtitle">Full lifecycle management for staff and admin accounts — super_admin only</div>
    </div>
  </div>

  <!-- GET /users -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/users</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> List all users with stats</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Query Parameters</div>
          <table>
            <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>page</code></td><td>number</td><td>Page number, default 1</td></tr>
              <tr><td><code>limit</code></td><td>number</td><td>Items per page, default 20</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>[
  <span class="json-comment">/* UserWithStats[] — see model in §01 */</span>
]</pre>
          <p style="font-size:12px;color:#64748b;margin-top:8px">Returns all users (no status filter). Sorted by <code>createdAt DESC</code>. The frontend displays all users regardless of <code>active</code> status.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- GET /users/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/users/:id</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Single user with pre-computed stats</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Path Parameter</div>
          <table><tr><td><code>:id</code></td><td>User UUID</td></tr></table>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Full <code>UserWithStats</code> object</td></tr>
            <tr><td><code>404</code></td><td>User not found</td></tr>
          </table>
        </div>
      </div>
      <div class="info-box mt-14 mb-0">
        This endpoint is called when the super admin clicks a user row to open the detail page
        (<code>/admin/users/:id</code>). The <code>stats</code> object must be populated —
        it drives the 4 stat cards (Published, Drafts, Scheduled, Last Login) at the top of the page.
      </div>
    </div>
  </div>

  <!-- POST /users -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/users</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Create account + send invite email</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"name"</span>:  <span class="json-str">"Jane Staff"</span>,
  <span class="json-key">"email"</span>: <span class="json-str">"jane@mymquid.com"</span>,
  <span class="json-key">"role"</span>:  <span class="json-str">"staff"</span>
}</pre>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>201</code></td><td>Created <code>UserWithStats</code> object</td></tr>
            <tr><td><code>409</code></td><td><code>{ "message": "Email already in use" }</code></td></tr>
            <tr><td><code>400</code></td><td>Validation error</td></tr>
          </table>
        </div>
      </div>
      <div class="subsection-title" style="margin-top:16px">Server Responsibilities</div>
      <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2.2">
        <li>Generate UUID for <code>id</code>, set <code>createdAt</code> to <code>now()</code></li>
        <li>Set <code>active: true</code>, <code>lastLogin: null</code> (or current time), <code>stats</code> all zeros</li>
        <li>Create account with no password — do NOT require a password in this request</li>
        <li>Generate a time-limited invite token (e.g. JWT or UUID, expires in 24–48h)</li>
        <li>Send email to <code>email</code> with a link: <code>https://[domain]/admin/set-password?token=[invite_token]</code></li>
        <li>Return the created <code>UserWithStats</code> object — frontend shows success toast immediately</li>
      </ul>
      <div class="success-box mt-14 mb-0">
        Frontend toast on success: <em>"User created. An invite email has been sent to jane@mymquid.com."</em>
      </div>
    </div>
  </div>

  <!-- PUT /users/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-put">PUT</span>
      <div class="endpoint-title">/users/:id</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Update name, email, or role</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"name"</span>:  <span class="json-str">"Jane Updated"</span>,
  <span class="json-key">"email"</span>: <span class="json-str">"jane@mymquid.com"</span>,
  <span class="json-key">"role"</span>:  <span class="json-str">"super_admin"</span>
}</pre>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Updated <code>UserWithStats</code> object</td></tr>
            <tr><td><code>404</code></td><td>User not found</td></tr>
            <tr><td><code>409</code></td><td>Email taken by another user</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 3 — REMAINING USER ENDPOINTS
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">👥</div>
    <div>
      <div class="section-title">02 — User Management API (continued)</div>
      <div class="section-subtitle">Status toggle, delete, password reset, and user posts</div>
    </div>
  </div>

  <!-- PATCH /users/:id/status -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-patch">PATCH</span>
      <div class="endpoint-title">/users/:id/status</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Activate or deactivate a user account</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"active"</span>: <span class="json-bool">false</span>  <span class="json-comment">// true to activate, false to deactivate</span>
}</pre>
          <div class="subsection-title" style="margin-top:14px">Deactivation Behaviour</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Set <code>active = false</code> on the user record</li>
            <li>Invalidate any active JWT sessions for that user</li>
            <li>The deactivated user can no longer log in (<code>401</code> on next login attempt)</li>
            <li>Their existing posts are NOT deleted</li>
          </ul>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Updated <code>UserWithStats</code> object with new <code>active</code> value</td></tr>
            <tr><td><code>404</code></td><td>User not found</td></tr>
          </table>
          <div class="warn-box" style="margin-top:14px;margin-bottom:0">
            <strong>Self-deactivation guard:</strong> Prevent a super_admin from deactivating their own account —
            return <code>400 { "message": "Cannot deactivate your own account" }</code>.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- DELETE /users/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-delete">DELETE</span>
      <div class="endpoint-title">/users/:id</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Permanently delete a user</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Path Parameter</div>
          <table><tr><td><code>:id</code></td><td>User UUID</td></tr></table>
          <div class="subsection-title" style="margin-top:14px">Server Responsibilities</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Delete user record from <code>users</code> table</li>
            <li>Decide on cascade: reassign posts to a system user, or delete them</li>
            <li>Invalidate all active sessions for the user</li>
          </ul>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>204</code></td><td>Deleted — no body</td></tr>
            <tr><td><code>404</code></td><td>User not found</td></tr>
            <tr><td><code>400</code></td><td>Cannot delete own account</td></tr>
          </table>
          <div class="error-box" style="margin-top:14px;margin-bottom:0">
            <strong>On success:</strong> The frontend redirects the super admin to <code>/admin/users</code>
            and removes the user from the local list optimistically.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- POST /users/:id/reset-password -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/users/:id/reset-password</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> Trigger password reset email for any user</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request</div>
          <p style="font-size:12px;color:#64748b">No body required. <code>:id</code> identifies the target user.</p>
          <div class="subsection-title" style="margin-top:14px">Server Responsibilities</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Generate a time-limited reset token (24h expiry)</li>
            <li>Send email to the user's registered address</li>
            <li>Link points to: <code>[domain]/admin/reset-password?token=[token]</code></li>
          </ul>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td><code>{ "message": "Reset email sent" }</code></td></tr>
            <tr><td><code>404</code></td><td>User not found</td></tr>
          </table>
          <div class="info-box" style="margin-top:14px;margin-bottom:0">
            Frontend toast on success: <em>"Password reset email sent."</em>
            This is different from <code>POST /auth/forgot-password</code> — here the
            super admin triggers it on behalf of another user (not self-service).
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- GET /users/:id/posts -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/users/:id/posts</div>
      <div class="endpoint-desc"><span class="badge badge-super">super_admin only</span> All blog posts authored by this user</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Query Parameters</div>
          <table>
            <tr><td><code>page</code></td><td>default 1</td></tr>
            <tr><td><code>limit</code></td><td>default 20</td></tr>
          </table>
          <div class="subsection-title" style="margin-top:14px">Response 200 OK</div>
          <p style="font-size:12px;color:#64748b">Array of <code>BlogPost</code> objects (same shape as <code>GET /blog</code> items).</p>
        </div>
        <div>
          <div class="subsection-title">Usage on the Frontend</div>
          <p style="font-size:12px;color:#334155;line-height:1.8">
            Called when the User Detail page loads. Results populate two UI areas:<br/><br/>
            <strong>Overview tab</strong> — "Recent Activity" card shows the last 5 posts
            (sorted by <code>updatedAt DESC</code>).<br/><br/>
            <strong>Blog Posts tab</strong> — Full table of all posts with Edit and View links.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 4 — INVITE / SET PASSWORD FLOW
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">✉️</div>
    <div>
      <div class="section-title">03 — Invite / Set Password Flow <span class="new-badge">NEW</span></div>
      <div class="section-subtitle">How a newly created user sets their password for the first time</div>
    </div>
  </div>

  <!-- POST /auth/set-password -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/auth/set-password</div>
      <div class="endpoint-desc">No auth — uses one-time invite token</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"token"</span>:           <span class="json-str">"invite_token_from_email"</span>,
  <span class="json-key">"password"</span>:        <span class="json-str">"new_secure_password"</span>,
  <span class="json-key">"confirmPassword"</span>: <span class="json-str">"new_secure_password"</span>
}</pre>
          <div class="subsection-title" style="margin-top:14px">Validation Rules</div>
          <table>
            <tr><td><code>token</code></td><td>Valid, non-expired invite token</td></tr>
            <tr><td><code>password</code></td><td>Min 8 chars, must include number or symbol</td></tr>
            <tr><td><code>confirmPassword</code></td><td>Must match <code>password</code></td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Password set — return <code>{ user, token }</code> (auto-login)</td></tr>
            <tr><td><code>400</code></td><td>Passwords don't match or too weak</td></tr>
            <tr><td><code>400</code></td><td>Token expired or already used</td></tr>
            <tr><td><code>404</code></td><td>Token not found</td></tr>
          </table>
          <div class="success-box" style="margin-top:14px;margin-bottom:0">
            <strong>Recommended:</strong> On success, return <code>{ user, token }</code> so the
            frontend can auto-login the user and redirect them to <code>/admin/dashboard</code>
            without requiring a separate login step.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Full flow diagram -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">End-to-End Invite Flow</div>
    </div>
    <div class="endpoint-body">
      <div class="flow-step">
        <div class="flow-num">1</div>
        <div class="flow-content">
          <div class="flow-label">Super admin opens "Add User" modal</div>
          <div class="flow-sub">Frontend: <code>/admin/users</code> → clicks "Add User" → fills name, email, role → submits</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">2</div>
        <div class="flow-content">
          <div class="flow-label">Frontend calls POST /users</div>
          <div class="flow-sub">Body: <code>{ name, email, role }</code> — no password</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">3</div>
        <div class="flow-content">
          <div class="flow-label">Backend creates user record + generates invite token</div>
          <div class="flow-sub">Stores token with <code>user_id</code>, <code>expires_at = now() + 48h</code>, <code>used = false</code></div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">4</div>
        <div class="flow-content">
          <div class="flow-label">Backend sends invite email to the new user</div>
          <div class="flow-sub">Link: <code>https://[domain]/admin/set-password?token=[token]</code></div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">5</div>
        <div class="flow-content">
          <div class="flow-label">Backend returns 201 with the created UserWithStats</div>
          <div class="flow-sub">Frontend: modal closes, user appears in the list, toast "Invite email sent to jane@mymquid.com"</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">6</div>
        <div class="flow-content">
          <div class="flow-label">New user clicks the link in their email</div>
          <div class="flow-sub">Browser opens: <code>/admin/set-password?token=[token]</code> — frontend shows a "Set Password" form</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">7</div>
        <div class="flow-content">
          <div class="flow-label">New user submits password form</div>
          <div class="flow-sub">Frontend calls: <code>POST /auth/set-password</code> with <code>{ token, password, confirmPassword }</code></div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">8</div>
        <div class="flow-content">
          <div class="flow-label">Backend validates token, sets password, marks token as used</div>
          <div class="flow-sub">Hash password with bcrypt, update user record, invalidate invite token</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">9</div>
        <div class="flow-content">
          <div class="flow-label">Backend returns 200 with { user, token } — user is auto-logged in</div>
          <div class="flow-sub">Frontend stores auth in Zustand and redirects to <code>/admin/dashboard</code></div>
        </div>
      </div>

      <div class="warn-box" style="margin-top:20px;margin-bottom:0">
        <strong>Token security:</strong> Use a cryptographically random token (UUID v4 or similar), not a predictable value.
        Mark it as used after first successful <code>POST /auth/set-password</code> call. Expire after 48 hours.
        Return a generic error for invalid/expired tokens — do not reveal whether the token exists.
      </div>
    </div>
  </div>

  <!-- Frontend pages needed -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Frontend Page Required: Set Password</div>
    </div>
    <div class="endpoint-body">
      <div class="info-box mb-0">
        A <code>/admin/set-password</code> page needs to be added to the frontend to handle the invite link.
        It reads the <code>?token=</code> query param, shows a two-field form (password + confirm password),
        and calls <code>POST /auth/set-password</code>. This page is NOT yet implemented on the frontend —
        it should be built alongside the backend endpoint.
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 5 — FILE UPLOAD API
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📁</div>
    <div>
      <div class="section-title">04 — File Upload API <span class="new-badge">NEW</span></div>
      <div class="section-subtitle">Image uploads for blog featured images, OG images and user avatars</div>
    </div>
  </div>

  <!-- POST /upload -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/upload</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> Upload an image file, return public URL</div>
    </div>
    <div class="endpoint-body">
      <div class="subsection">
        <div class="subsection-title">Request — multipart/form-data</div>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr>
              <td><code>file</code></td>
              <td>File (binary)</td>
              <td><span class="badge badge-required">Required</span></td>
              <td>Image file. Accepted: JPEG, PNG, WebP, GIF. Max size: 5 MB.</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td>string enum</td>
              <td><span class="badge badge-required">Required</span></td>
              <td>One of: <code>"blog-image"</code>, <code>"avatar"</code>, <code>"og-image"</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="subsection">
        <div class="subsection-title">Example Request (Axios)</div>
        <pre>const form = new FormData();
form.append(<span class="json-str">"file"</span>, file);           <span class="json-comment">// File object from input[type=file]</span>
form.append(<span class="json-str">"type"</span>, <span class="json-str">"blog-image"</span>);

await axios.post(<span class="json-str">"/upload"</span>, form, {
  headers: { <span class="json-str">"Content-Type"</span>: <span class="json-str">"multipart/form-data"</span> },
});</pre>
      </div>

      <div class="two-col">
        <div>
          <div class="subsection-title">Response 201 Created</div>
          <pre>{
  <span class="json-key">"url"</span>: <span class="json-str">"https://cdn.mymquid.com/blog/abc123.jpg"</span>
}</pre>
          <p style="font-size:12px;color:#64748b;margin-top:8px">
            The frontend stores this URL in the form's <code>featuredImage</code> field and displays a thumbnail.
            The URL is sent as a string in the blog post payload.
          </p>
        </div>
        <div>
          <div class="subsection-title">Error Responses</div>
          <table>
            <tr><td><code>400</code></td><td>File missing, invalid type, or unsupported format</td></tr>
            <tr><td><code>413</code></td><td>File too large (over 5 MB)</td></tr>
            <tr><td><code>401</code></td><td>Not authenticated</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Upload types -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Upload Types &amp; Usage</div>
    </div>
    <div class="endpoint-body">
      <table>
        <thead>
          <tr><th>type value</th><th>Used by</th><th>Where URL is stored</th><th>Recommended size</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>"blog-image"</code></td>
            <td>Blog Editor sidebar "Featured Image" card</td>
            <td><code>BlogPost.featuredImage</code> field (string URL)</td>
            <td>1200×630 px (16:9)</td>
          </tr>
          <tr>
            <td><code>"og-image"</code></td>
            <td>Blog Editor SEO section OG Image field</td>
            <td><code>BlogPost.seo.ogImage</code> field</td>
            <td>1200×630 px</td>
          </tr>
          <tr>
            <td><code>"avatar"</code></td>
            <td>Profile page avatar upload (future)</td>
            <td><code>AdminUser.avatar</code> field</td>
            <td>400×400 px (1:1)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Storage notes -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Storage Implementation Notes</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Recommended: Cloud Storage</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li><strong>AWS S3</strong> — <code>@aws-sdk/client-s3</code> + presigned URLs or public bucket</li>
            <li><strong>Cloudflare R2</strong> — S3-compatible, free egress</li>
            <li><strong>Supabase Storage</strong> — simple if already using Supabase</li>
            <li><strong>Cloudinary</strong> — built-in transforms + CDN</li>
          </ul>
        </div>
        <div>
          <div class="subsection-title">Minimum Requirements</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Upload to storage, return a permanent public HTTPS URL</li>
            <li>Accept: <code>image/jpeg</code>, <code>image/png</code>, <code>image/webp</code></li>
            <li>Reject non-image MIME types with 400</li>
            <li>Enforce 5 MB max size</li>
            <li>Generate a unique filename (UUID + original extension)</li>
          </ul>
        </div>
      </div>
      <div class="warn-box mt-14 mb-0">
        <strong>Do NOT store images locally</strong> on the NestJS server filesystem — they will be lost on
        Render.com redeploys. Use a cloud storage provider. The returned URL must be publicly accessible
        (no auth required to view) since it is rendered on the public blog pages.
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PAGE 6 — QUICK REFERENCE
════════════════════════════════════════════════════ -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📋</div>
    <div>
      <div class="section-title">05 — Quick Reference</div>
      <div class="section-subtitle">All new endpoints at a glance + frontend integration points</div>
    </div>
  </div>

  <!-- All endpoints table -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">All New Endpoints</div>
    </div>
    <div class="endpoint-body">
      <table>
        <thead>
          <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Role</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="toc-method m-get">GET</span></td>
            <td><code>/users</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>List all users with stats</td>
          </tr>
          <tr>
            <td><span class="toc-method m-get">GET</span></td>
            <td><code>/users/:id</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Single user with pre-computed stats</td>
          </tr>
          <tr>
            <td><span class="toc-method m-post">POST</span></td>
            <td><code>/users</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Create user + trigger invite email</td>
          </tr>
          <tr>
            <td><span class="toc-method m-put">PUT</span></td>
            <td><code>/users/:id</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Update name / email / role</td>
          </tr>
          <tr>
            <td><span class="toc-method m-patch">PATCH</span></td>
            <td><code>/users/:id/status</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Activate or deactivate account</td>
          </tr>
          <tr>
            <td><span class="toc-method m-delete">DELETE</span></td>
            <td><code>/users/:id</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Permanently delete user</td>
          </tr>
          <tr>
            <td><span class="toc-method m-post">POST</span></td>
            <td><code>/users/:id/reset-password</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Trigger password reset email for user</td>
          </tr>
          <tr>
            <td><span class="toc-method m-get">GET</span></td>
            <td><code>/users/:id/posts</code></td>
            <td>✓ JWT</td>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Blog posts authored by this user</td>
          </tr>
          <tr style="background:#f0fdf4">
            <td><span class="toc-method m-post">POST</span></td>
            <td><code>/auth/set-password</code></td>
            <td>None</td>
            <td>Invite token</td>
            <td>First-time password setup from invite email</td>
          </tr>
          <tr style="background:#eff6ff">
            <td><span class="toc-method m-post">POST</span></td>
            <td><code>/upload</code></td>
            <td>✓ JWT</td>
            <td>Any role</td>
            <td>Upload image, receive public URL</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Frontend integration points -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Frontend Integration Points</div>
      <div class="endpoint-desc">Where each endpoint is called in the codebase</div>
    </div>
    <div class="endpoint-body">
      <table>
        <thead>
          <tr><th>Endpoint</th><th>Called from (frontend file)</th><th>Triggered by</th></tr>
        </thead>
        <tbody>
          <tr><td><code>GET /users</code></td><td><code>src/admin/users/useUserStore.ts → fetchUsers()</code></td><td>Manage Users page mount</td></tr>
          <tr><td><code>GET /users/:id</code></td><td><code>useUserStore.ts → fetchUser(id)</code></td><td>User detail page mount</td></tr>
          <tr><td><code>POST /users</code></td><td><code>useUserStore.ts → createUser(payload)</code></td><td>"Add User" modal submit</td></tr>
          <tr><td><code>PUT /users/:id</code></td><td><code>useUserStore.ts → updateUser(id, payload)</code></td><td>"Edit" modal submit</td></tr>
          <tr><td><code>PATCH /users/:id/status</code></td><td><code>useUserStore.ts → toggleUserStatus(id, active)</code></td><td>Activate/Deactivate confirm</td></tr>
          <tr><td><code>DELETE /users/:id</code></td><td><code>useUserStore.ts → deleteUser(id)</code></td><td>Delete confirm modal</td></tr>
          <tr><td><code>POST /users/:id/reset-password</code></td><td><code>useUserStore.ts → resetUserPassword(id)</code></td><td>"Reset Password" confirm</td></tr>
          <tr><td><code>GET /users/:id/posts</code></td><td><code>useUserStore.ts → fetchUserPosts(id)</code></td><td>User detail page mount</td></tr>
          <tr><td><code>POST /auth/set-password</code></td><td>New page: <code>src/admin/auth/SetPasswordPage.tsx</code> (to be built)</td><td>Invite email link</td></tr>
          <tr><td><code>POST /upload</code></td><td><code>src/admin/mock/api.ts → uploadApi.upload(file, type)</code></td><td>Featured image file picker in blog editor</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- API implementation checklist -->
  <div class="endpoint-card" style="background: linear-gradient(135deg,#f8faff,#f0f4ff); border-color: #c7d2fe;">
    <div class="endpoint-header" style="background: transparent;">
      <div class="endpoint-title" style="color:#3730a3;">Implementation Checklist</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Users Module</div>
          <table>
            <tr><td>☐</td><td>Create <code>users</code> table / entity</td></tr>
            <tr><td>☐</td><td>Seed initial super_admin account</td></tr>
            <tr><td>☐</td><td><code>GET /users</code> with stats aggregation</td></tr>
            <tr><td>☐</td><td><code>GET /users/:id</code> with stats</td></tr>
            <tr><td>☐</td><td><code>POST /users</code> + invite email</td></tr>
            <tr><td>☐</td><td><code>PUT /users/:id</code></td></tr>
            <tr><td>☐</td><td><code>PATCH /users/:id/status</code></td></tr>
            <tr><td>☐</td><td><code>DELETE /users/:id</code></td></tr>
            <tr><td>☐</td><td><code>POST /users/:id/reset-password</code></td></tr>
            <tr><td>☐</td><td><code>GET /users/:id/posts</code></td></tr>
            <tr><td>☐</td><td>Role guard: super_admin only for all <code>/users</code></td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Auth + Upload Module</div>
          <table>
            <tr><td>☐</td><td><code>POST /auth/set-password</code></td></tr>
            <tr><td>☐</td><td>Invite token table / expiry logic</td></tr>
            <tr><td>☐</td><td>Email service (invite + reset)</td></tr>
            <tr><td>☐</td><td>Frontend: <code>SetPasswordPage.tsx</code> (new page)</td></tr>
            <tr><td>☐</td><td><code>POST /upload</code> endpoint</td></tr>
            <tr><td>☐</td><td>Cloud storage integration (S3/R2/Cloudinary)</td></tr>
            <tr><td>☐</td><td>File validation (MIME type + size)</td></tr>
            <tr><td>☐</td><td>Return permanent public URL</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle0" });

await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  margin: { top: "24px", bottom: "24px", left: "0", right: "0" },
  displayHeaderFooter: true,
  headerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:4px 40px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>MyMquid — New Features API Specification</span>
    <span style="color:#f59e0b;font-weight:600">⚠ These endpoints are not yet implemented on the backend</span>
  </div>`,
  footerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:4px 40px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>© 2026 MyMquid. Confidential — Backend Developer Reference.</span>
    <span class="pageNumber"></span>
  </div>`,
});

await browser.close();
console.log("✅ PDF generated:", OUT);
