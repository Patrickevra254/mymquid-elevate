import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../mymquid-api-documentation.pdf");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MyMquid API Documentation</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    line-height: 1.6;
    padding: 0;
  }
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
  .cover-logo {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #818cf8, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }
  .cover-sub {
    font-size: 22px;
    font-weight: 300;
    color: #94a3b8;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }
  .cover-desc {
    font-size: 14px;
    color: #64748b;
    max-width: 480px;
    margin: 24px auto 0;
    line-height: 1.8;
  }
  .cover-meta {
    margin-top: 60px;
    font-size: 12px;
    color: #475569;
  }
  .cover-meta span {
    display: inline-block;
    background: rgba(129,140,248,0.12);
    border: 1px solid rgba(129,140,248,0.2);
    border-radius: 20px;
    padding: 4px 14px;
    margin: 4px;
    color: #a5b4fc;
  }

  .toc-page {
    page-break-after: always;
    padding: 50px 60px;
  }
  .toc-title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 32px;
    padding-bottom: 12px;
    border-bottom: 3px solid #818cf8;
    display: inline-block;
  }
  .toc-section {
    margin-bottom: 28px;
  }
  .toc-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #818cf8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .toc-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px dotted #e2e8f0;
    color: #334155;
  }
  .toc-item:last-child { border-bottom: none; }
  .toc-method {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    margin-right: 8px;
    font-family: monospace;
  }
  .m-get { background: #dbeafe; color: #1d4ed8; }
  .m-post { background: #dcfce7; color: #166534; }
  .m-put { background: #fef9c3; color: #854d0e; }
  .m-patch { background: #ffedd5; color: #9a3412; }
  .m-delete { background: #fee2e2; color: #991b1b; }

  .page {
    padding: 50px 60px;
    page-break-before: always;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 3px solid #818cf8;
  }
  .section-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #818cf8, #38bdf8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .section-title {
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
  }
  .section-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 2px;
  }

  .endpoint-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 28px;
    overflow: hidden;
  }
  .endpoint-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .endpoint-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
  .endpoint-desc {
    font-size: 12px;
    color: #64748b;
    margin-left: auto;
  }
  .endpoint-body {
    padding: 20px;
  }
  .subsection {
    margin-bottom: 18px;
  }
  .subsection:last-child { margin-bottom: 0; }
  .subsection-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #818cf8;
    margin-bottom: 8px;
  }
  pre, code {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 12px;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 14px 16px;
    border-radius: 8px;
    overflow-x: auto;
    line-height: 1.5;
  }
  .json-key { color: #7dd3fc; }
  .json-str { color: #86efac; }
  .json-num { color: #fbbf24; }
  .json-bool { color: #f87171; }
  .json-null { color: #94a3b8; }

  .badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 99px;
    margin-right: 4px;
  }
  .badge-required { background: #fee2e2; color: #991b1b; }
  .badge-optional { background: #f0fdf4; color: #166534; }
  .badge-auth { background: #fef3c7; color: #92400e; }
  .badge-admin { background: #ede9fe; color: #5b21b6; }
  .badge-super { background: #fce7f3; color: #9d174d; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    padding: 8px 12px;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: top;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
  td code {
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 4px;
    color: #7c3aed;
  }
  td .required-star { color: #ef4444; margin-left: 2px; }

  .info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #3b82f6;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #1e40af;
  }
  .warn-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-left: 4px solid #f59e0b;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #92400e;
  }
  .success-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 4px solid #22c55e;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #166534;
  }
  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-left: 4px solid #ef4444;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #991b1b;
  }

  .role-table-wrap { margin-top: 16px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .two-col-thirds { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

  .flow-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 14px;
  }
  .flow-num {
    width: 28px;
    height: 28px;
    background: #818cf8;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .flow-content { padding-top: 4px; }
  .flow-label { font-weight: 600; color: #1e293b; font-size: 13px; }
  .flow-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .flow-arrow {
    margin-left: 13px;
    margin-bottom: 4px;
    color: #cbd5e1;
    font-size: 16px;
    line-height: 1;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- ===== COVER PAGE ===== -->
<div class="cover">
  <div class="cover-logo">MyMquid</div>
  <div class="cover-sub">Backend API Specification</div>
  <div style="width:60px;height:3px;background:linear-gradient(90deg,#818cf8,#38bdf8);border-radius:2px;margin:20px auto;"></div>
  <div class="cover-desc">
    Complete API reference for the MyMquid Elevate platform backend.
    Designed for NestJS implementation. Covers authentication, blog management,
    dashboard analytics, notifications and user profile.
  </div>
  <div class="cover-meta">
    <span>Version 1.0</span>
    <span>May 2026</span>
    <span>NestJS + PostgreSQL</span>
    <span>JWT Auth</span>
    <span>REST</span>
  </div>
</div>

<!-- ===== TABLE OF CONTENTS ===== -->
<div class="toc-page">
  <div class="toc-title">Table of Contents</div>

  <div class="toc-section">
    <div class="toc-section-title">01 — Overview</div>
    <div class="toc-item"><span>Architecture & Tech Stack</span><span>3</span></div>
    <div class="toc-item"><span>Base URL & Versioning</span><span>3</span></div>
    <div class="toc-item"><span>Authentication Mechanism</span><span>3</span></div>
    <div class="toc-item"><span>Role-Based Access Control</span><span>4</span></div>
    <div class="toc-item"><span>Error Response Format</span><span>4</span></div>
    <div class="toc-item"><span>Pagination</span><span>4</span></div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">02 — Data Models</div>
    <div class="toc-item"><span>AdminUser</span><span>5</span></div>
    <div class="toc-item"><span>BlogPost</span><span>5</span></div>
    <div class="toc-item"><span>DashboardStats</span><span>6</span></div>
    <div class="toc-item"><span>ActivityEvent</span><span>6</span></div>
    <div class="toc-item"><span>ChartDataPoint</span><span>6</span></div>
    <div class="toc-item"><span>Notification</span><span>6</span></div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">03 — Authentication API</div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/auth/login</span><span>7</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/auth/logout</span><span>7</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/auth/forgot-password</span><span>8</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/auth/reset-password</span><span>8</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/auth/me</span><span>8</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">04 — Blog API</div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/blog</span><span>9</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-post">POST</span>/blog</span><span>10</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/blog/:id</span><span>11</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-put">PUT</span>/blog/:id</span><span>11</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-delete">DELETE</span>/blog/:id</span><span>12</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/blog/public (public)</span><span>12</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">05 — Dashboard API</div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/dashboard/stats</span><span>13</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/dashboard/activity</span><span>13</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/dashboard/chart</span><span>14</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">06 — Notifications API</div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/notifications</span><span>14</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-patch">PATCH</span>/notifications/:id/read</span><span>15</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-patch">PATCH</span>/notifications/read-all</span><span>15</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">07 — Profile API</div>
    <div class="toc-item">
      <span><span class="toc-method m-get">GET</span>/profile</span><span>15</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-put">PUT</span>/profile</span><span>16</span>
    </div>
    <div class="toc-item">
      <span><span class="toc-method m-put">PUT</span>/profile/password</span><span>16</span>
    </div>
  </div>

  <div class="toc-section">
    <div class="toc-section-title">08 — Frontend Integration Notes</div>
    <div class="toc-item"><span>Mock-to-Real Swap Point</span><span>17</span></div>
    <div class="toc-item"><span>Axios Instance Setup</span><span>17</span></div>
    <div class="toc-item"><span>Categories</span><span>17</span></div>
    <div class="toc-item"><span>Public Blog vs Admin Blog</span><span>17</span></div>
  </div>
</div>

<!-- ===== PAGE 1: OVERVIEW ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">⚙️</div>
    <div>
      <div class="section-title">01 — Overview</div>
      <div class="section-subtitle">Architecture, authentication, conventions and error handling</div>
    </div>
  </div>

  <!-- Architecture -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Architecture & Tech Stack</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Backend</div>
          <table>
            <tr><td><strong>Framework</strong></td><td>NestJS (Node.js)</td></tr>
            <tr><td><strong>Language</strong></td><td>TypeScript</td></tr>
            <tr><td><strong>Database</strong></td><td>PostgreSQL (recommended)</td></tr>
            <tr><td><strong>ORM</strong></td><td>TypeORM or Prisma</td></tr>
            <tr><td><strong>Auth</strong></td><td>JWT (access + refresh tokens)</td></tr>
            <tr><td><strong>Validation</strong></td><td>class-validator + class-transformer</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Frontend (existing)</div>
          <table>
            <tr><td><strong>Framework</strong></td><td>React 19 + Vite 7</td></tr>
            <tr><td><strong>Language</strong></td><td>TypeScript 5.8</td></tr>
            <tr><td><strong>State</strong></td><td>Zustand (persist to localStorage)</td></tr>
            <tr><td><strong>HTTP Client</strong></td><td>Axios (to be set up)</td></tr>
            <tr><td><strong>Rich Text</strong></td><td>Tiptap (JSON format)</td></tr>
            <tr><td><strong>Auth Storage</strong></td><td>localStorage via Zustand persist</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Base URL -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Base URL & Versioning</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">URL Structure</div>
          <pre>Development:  http://localhost:3000/api/v1
Production:   https://api.mymquid.com/api/v1</pre>
        </div>
        <div>
          <div class="subsection-title">Request Headers</div>
          <pre>Content-Type: application/json
Accept: application/json
Authorization: Bearer &lt;access_token&gt;</pre>
        </div>
      </div>
      <div class="info-box" style="margin-top:14px;margin-bottom:0">
        All endpoints are prefixed with <code>/api/v1</code>. The frontend's mock API layer is in
        <code>src/admin/mock/api.ts</code> — that file is the single swap point where mock calls will be
        replaced with real Axios requests once the backend is live.
      </div>
    </div>
  </div>

  <!-- Auth Mechanism -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Authentication Mechanism</div>
    </div>
    <div class="endpoint-body">
      <div class="info-box">
        The frontend stores <code>token</code> and <code>user</code> in localStorage via Zustand persist
        (key: <code>mymquid-admin-auth</code>). On login, the token is stored and attached to all
        subsequent requests via an Axios interceptor.
      </div>
      <div class="subsection">
        <div class="subsection-title">Authentication Flow</div>
        <div class="flow-step">
          <div class="flow-num">1</div>
          <div class="flow-content">
            <div class="flow-label">Client POSTs credentials</div>
            <div class="flow-sub">POST /auth/login with <code>{ email, password }</code></div>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">2</div>
          <div class="flow-content">
            <div class="flow-label">Server validates and returns tokens</div>
            <div class="flow-sub">Response: <code>{ user: AdminUser, token: string, refreshToken?: string }</code></div>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">3</div>
          <div class="flow-content">
            <div class="flow-label">Frontend stores token in Zustand/localStorage</div>
            <div class="flow-sub">Key <code>mymquid-admin-auth</code> persists across page reloads</div>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">4</div>
          <div class="flow-content">
            <div class="flow-label">All subsequent requests include Authorization header</div>
            <div class="flow-sub"><code>Authorization: Bearer &lt;token&gt;</code></div>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">5</div>
          <div class="flow-content">
            <div class="flow-label">On logout, DELETE /auth/logout and clear localStorage</div>
            <div class="flow-sub">Zustand resets: <code>{ user: null, token: null, isAuthenticated: false }</code></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- RBAC -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Role-Based Access Control (RBAC)</div>
    </div>
    <div class="endpoint-body">
      <div class="info-box">
        The frontend already enforces RBAC in the UI — the backend must enforce it at the API layer.
        All admin routes require a valid JWT. Delete operations require <code>super_admin</code>.
      </div>
      <table>
        <thead>
          <tr><th>Role</th><th>Description</th><th>Permissions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-super">super_admin</span></td>
            <td>Full access</td>
            <td>Create, read, update, delete posts; manage all settings; view all dashboard data</td>
          </tr>
          <tr>
            <td><span class="badge badge-admin">staff</span></td>
            <td>Content author</td>
            <td>Create, read, update own posts; cannot delete posts; view dashboard</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Error Format -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Error Response Format</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Standard Error Shape</div>
          <pre>{
  <span class="json-key">"statusCode"</span>: <span class="json-num">400</span>,
  <span class="json-key">"message"</span>: <span class="json-str">"Validation failed"</span>,
  <span class="json-key">"errors"</span>: [
    {
      <span class="json-key">"field"</span>: <span class="json-str">"email"</span>,
      <span class="json-key">"message"</span>: <span class="json-str">"must be a valid email"</span>
    }
  ]
}</pre>
        </div>
        <div>
          <div class="subsection-title">HTTP Status Codes Used</div>
          <table>
            <tr><td><code>200</code></td><td>Success (GET, PUT, PATCH)</td></tr>
            <tr><td><code>201</code></td><td>Created (POST)</td></tr>
            <tr><td><code>204</code></td><td>No Content (DELETE)</td></tr>
            <tr><td><code>400</code></td><td>Validation error</td></tr>
            <tr><td><code>401</code></td><td>Unauthenticated</td></tr>
            <tr><td><code>403</code></td><td>Forbidden (wrong role)</td></tr>
            <tr><td><code>404</code></td><td>Resource not found</td></tr>
            <tr><td><code>409</code></td><td>Conflict (duplicate slug)</td></tr>
            <tr><td><code>500</code></td><td>Internal server error</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Pagination</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Query Parameters (all list endpoints)</div>
          <table>
            <tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr>
            <tr><td><code>page</code></td><td>number</td><td>1</td><td>Page number (1-indexed)</td></tr>
            <tr><td><code>limit</code></td><td>number</td><td>10</td><td>Items per page (max 100)</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Paginated Response Shape</div>
          <pre>{
  <span class="json-key">"data"</span>: [...],
  <span class="json-key">"total"</span>: <span class="json-num">42</span>,
  <span class="json-key">"page"</span>: <span class="json-num">1</span>,
  <span class="json-key">"limit"</span>: <span class="json-num">10</span>,
  <span class="json-key">"totalPages"</span>: <span class="json-num">5</span>
}</pre>
        </div>
      </div>
      <div class="info-box" style="margin-top:14px;margin-bottom:0">
        The frontend blog list uses client-side pagination over the full list today.
        When swapped to the real API, pass <code>page</code> and <code>limit</code> from the UI's
        pagination state. The frontend currently fetches 10 posts per page by default.
      </div>
    </div>
  </div>
</div>

<!-- ===== PAGE 2: DATA MODELS ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📐</div>
    <div>
      <div class="section-title">02 — Data Models</div>
      <div class="section-subtitle">TypeScript types used by the frontend — mirror these exactly in your NestJS entities and DTOs</div>
    </div>
  </div>

  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">AdminUser</div>
      <div class="endpoint-desc">Returned on login and from /auth/me</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">TypeScript Definition</div>
          <pre>type AdminRole = "super_admin" | "staff";

type AdminUser = {
  id:     string;
  name:   string;
  email:  string;
  role:   AdminRole;
  avatar?: string;  // URL to avatar image
};</pre>
        </div>
        <div>
          <div class="subsection-title">Example JSON</div>
          <pre>{
  <span class="json-key">"id"</span>:     <span class="json-str">"1"</span>,
  <span class="json-key">"name"</span>:   <span class="json-str">"Patrick Evra"</span>,
  <span class="json-key">"email"</span>:  <span class="json-str">"admin@mymquid.com"</span>,
  <span class="json-key">"role"</span>:   <span class="json-str">"super_admin"</span>,
  <span class="json-key">"avatar"</span>: <span class="json-str">null</span>
}</pre>
        </div>
      </div>
    </div>
  </div>

  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">BlogPost</div>
      <div class="endpoint-desc">Core entity — used throughout Blog API</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">TypeScript Definition</div>
          <pre>type BlogStatus =
  "draft" | "published" | "scheduled";

type BlogPost = {
  id:          string;
  title:       string;
  slug:        string;       // URL-safe, unique
  content:     string;       // Tiptap JSON (stringified)
  status:      BlogStatus;
  category:    string;
  tags:        string[];
  featuredImage?: string;    // URL
  seo: {
    metaTitle:       string;
    metaDescription: string;
    ogImage?:        string; // URL
  };
  scheduledAt?: string;      // ISO 8601 (if scheduled)
  createdAt:   string;       // ISO 8601
  updatedAt:   string;       // ISO 8601
  author: {
    id:   string;
    name: string;
  };
};</pre>
        </div>
        <div>
          <div class="subsection-title">Example JSON (truncated)</div>
          <pre>{
  <span class="json-key">"id"</span>: <span class="json-str">"1"</span>,
  <span class="json-key">"title"</span>: <span class="json-str">"Cloud Security"</span>,
  <span class="json-key">"slug"</span>: <span class="json-str">"cloud-security"</span>,
  <span class="json-key">"content"</span>: <span class="json-str">"{\"type\":\"doc\",...}"</span>,
  <span class="json-key">"status"</span>: <span class="json-str">"published"</span>,
  <span class="json-key">"category"</span>: <span class="json-str">"Solutions"</span>,
  <span class="json-key">"tags"</span>: [<span class="json-str">"cloud"</span>,<span class="json-str">"security"</span>],
  <span class="json-key">"featuredImage"</span>: <span class="json-null">null</span>,
  <span class="json-key">"seo"</span>: {
    <span class="json-key">"metaTitle"</span>: <span class="json-str">"Cloud Security"</span>,
    <span class="json-key">"metaDescription"</span>: <span class="json-str">"..."</span>
  },
  <span class="json-key">"scheduledAt"</span>: <span class="json-null">null</span>,
  <span class="json-key">"createdAt"</span>: <span class="json-str">"2026-05-08T11:00:00Z"</span>,
  <span class="json-key">"updatedAt"</span>: <span class="json-str">"2026-05-08T11:00:00Z"</span>,
  <span class="json-key">"author"</span>: {
    <span class="json-key">"id"</span>: <span class="json-str">"1"</span>,
    <span class="json-key">"name"</span>: <span class="json-str">"Patrick Evra"</span>
  }
}</pre>
          <div class="warn-box" style="margin-top:12px;margin-bottom:0">
            <strong>Important:</strong> <code>content</code> is a <strong>JSON string</strong> (Tiptap editor output serialised with <code>JSON.stringify</code>). Store as <code>TEXT</code> in the database. Do not parse it on the server.
          </div>
        </div>
      </div>
      <div class="subsection" style="margin-top:18px">
        <div class="subsection-title">Field Constraints</div>
        <table>
          <thead>
            <tr><th>Field</th><th>Required</th><th>Constraints</th></tr>
          </thead>
          <tbody>
            <tr><td><code>title</code></td><td><span class="badge badge-required">Required</span></td><td>max 200 chars, non-empty</td></tr>
            <tr><td><code>slug</code></td><td><span class="badge badge-required">Required</span></td><td>unique, lowercase, hyphens only (<code>/^[a-z0-9]+(?:-[a-z0-9]+)*$/</code>)</td></tr>
            <tr><td><code>content</code></td><td><span class="badge badge-required">Required</span></td><td>valid Tiptap JSON string, non-empty</td></tr>
            <tr><td><code>status</code></td><td><span class="badge badge-required">Required</span></td><td>one of: <code>draft</code>, <code>published</code>, <code>scheduled</code></td></tr>
            <tr><td><code>category</code></td><td><span class="badge badge-required">Required</span></td><td>must match a valid category (see §08)</td></tr>
            <tr><td><code>tags</code></td><td><span class="badge badge-optional">Optional</span></td><td>array of strings, max 10 tags</td></tr>
            <tr><td><code>seo.metaTitle</code></td><td><span class="badge badge-required">Required</span></td><td>max 60 chars</td></tr>
            <tr><td><code>seo.metaDescription</code></td><td><span class="badge badge-required">Required</span></td><td>max 160 chars</td></tr>
            <tr><td><code>scheduledAt</code></td><td><span class="badge badge-optional">Optional</span></td><td>required when <code>status === "scheduled"</code>, must be future date</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="two-col">
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">DashboardStats</div>
      </div>
      <div class="endpoint-body">
        <pre>type DashboardStats = {
  totalPosts: number;
  published:  number;
  drafts:     number;
  scheduled:  number;
};</pre>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">ChartDataPoint</div>
      </div>
      <div class="endpoint-body">
        <pre>type ChartDataPoint = {
  date:  string;  // "YYYY-MM-DD"
  posts: number;  // posts created that day
};</pre>
      </div>
    </div>
  </div>

  <div class="two-col">
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">ActivityEvent</div>
      </div>
      <div class="endpoint-body">
        <pre>type ActivityEvent = {
  id:        string;
  type:      "publish" | "draft" |
             "login" | "delete" | "edit";
  message:   string;  // human-readable
  time:      string;  // relative ("2h ago")
  createdAt: string;  // ISO 8601
};</pre>
        <div class="info-box" style="margin-top:12px;margin-bottom:0">
          <strong>Note:</strong> The <code>time</code> field is a pre-formatted relative string.
          The frontend displays it as-is. You may return the raw <code>createdAt</code> and let
          the frontend compute relative time — update the UI's <code>RecentActivity</code>
          component accordingly if you prefer.
        </div>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">Notification</div>
      </div>
      <div class="endpoint-body">
        <pre>type Notification = {
  id:        string;
  title:     string;
  message:   string;
  type:      "info" | "success" |
             "warning" | "error";
  read:      boolean;
  createdAt: string;  // ISO 8601
};</pre>
      </div>
    </div>
  </div>
</div>

<!-- ===== PAGE 3: AUTH API ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">🔐</div>
    <div>
      <div class="section-title">03 — Authentication API</div>
      <div class="section-subtitle">Login, logout, password reset, and token refresh</div>
    </div>
  </div>

  <!-- POST /auth/login -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/auth/login</div>
      <div class="endpoint-desc">No auth required</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"email"</span>:    <span class="json-str">"admin@mymquid.com"</span>,  <span style="color:#64748b">// required</span>
  <span class="json-key">"password"</span>: <span class="json-str">"your_password"</span>         <span style="color:#64748b">// required</span>
}</pre>
          <div class="subsection-title" style="margin-top:14px">Validation Rules</div>
          <table>
            <tr><td><code>email</code></td><td>valid email format, non-empty</td></tr>
            <tr><td><code>password</code></td><td>min 8 chars, non-empty</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>{
  <span class="json-key">"user"</span>: {
    <span class="json-key">"id"</span>:    <span class="json-str">"1"</span>,
    <span class="json-key">"name"</span>:  <span class="json-str">"Patrick Evra"</span>,
    <span class="json-key">"email"</span>: <span class="json-str">"admin@mymquid.com"</span>,
    <span class="json-key">"role"</span>:  <span class="json-str">"super_admin"</span>
  },
  <span class="json-key">"token"</span>: <span class="json-str">"eyJhbGciOiJIUzI1..."</span>
}</pre>
          <div class="subsection-title" style="margin-top:14px">Error Responses</div>
          <table>
            <tr><td><code>400</code></td><td>Validation error (missing fields)</td></tr>
            <tr><td><code>401</code></td><td>Invalid email or password</td></tr>
          </table>
        </div>
      </div>
      <div class="info-box" style="margin-top:14px;margin-bottom:0">
        The frontend's Zustand auth store (<code>src/admin/auth/useAuthStore.ts</code>) stores the returned
        <code>user</code> and <code>token</code> in localStorage. The <code>token</code> field name must
        remain exactly <code>"token"</code> to avoid breaking the frontend.
      </div>
    </div>
  </div>

  <!-- POST /auth/logout -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/auth/logout</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request</div>
          <p style="font-size:12px;color:#64748b">No request body. Include <code>Authorization: Bearer &lt;token&gt;</code> header.</p>
        </div>
        <div>
          <div class="subsection-title">Response 204 No Content</div>
          <p style="font-size:12px;color:#64748b">Empty body. Invalidate the JWT on the server side (blacklist or short-lived token).</p>
        </div>
      </div>
    </div>
  </div>

  <!-- POST /auth/forgot-password -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/auth/forgot-password</div>
      <div class="endpoint-desc">No auth required</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"email"</span>: <span class="json-str">"admin@mymquid.com"</span>
}</pre>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>{
  <span class="json-key">"message"</span>: <span class="json-str">"Reset email sent if account exists"</span>
}</pre>
          <div class="info-box" style="margin-top:10px;margin-bottom:0">
            Always return 200 even if the email doesn't exist (prevents user enumeration).
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- POST /auth/reset-password -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/auth/reset-password</div>
      <div class="endpoint-desc">No auth required</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body</div>
          <pre>{
  <span class="json-key">"token"</span>:           <span class="json-str">"reset_token_from_email"</span>,
  <span class="json-key">"newPassword"</span>:     <span class="json-str">"new_secure_password"</span>,
  <span class="json-key">"confirmPassword"</span>: <span class="json-str">"new_secure_password"</span>
}</pre>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Password reset successfully</td></tr>
            <tr><td><code>400</code></td><td>Passwords don't match</td></tr>
            <tr><td><code>400</code></td><td>Token invalid or expired</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- GET /auth/me -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/auth/me</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request</div>
          <p style="font-size:12px;color:#64748b">No body. JWT in Authorization header.</p>
          <div class="info-box" style="margin-top:12px;margin-bottom:0">
            Used on app load to verify the stored token is still valid and refresh the user object.
          </div>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>{
  <span class="json-key">"id"</span>:    <span class="json-str">"1"</span>,
  <span class="json-key">"name"</span>:  <span class="json-str">"Patrick Evra"</span>,
  <span class="json-key">"email"</span>: <span class="json-str">"admin@mymquid.com"</span>,
  <span class="json-key">"role"</span>:  <span class="json-str">"super_admin"</span>
}</pre>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===== PAGE 4: BLOG API ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📝</div>
    <div>
      <div class="section-title">04 — Blog API</div>
      <div class="section-subtitle">Full CRUD for blog posts — the primary feature of the admin dashboard</div>
    </div>
  </div>

  <div class="warn-box">
    All Blog API endpoints require a valid JWT except <strong>GET /blog/public</strong> which is used by the public-facing website and is unauthenticated.
  </div>

  <!-- GET /blog -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/blog</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> Admin list with filters</div>
    </div>
    <div class="endpoint-body">
      <div class="subsection">
        <div class="subsection-title">Query Parameters</div>
        <table>
          <thead>
            <tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>status</code></td>
              <td>string</td>
              <td><span class="badge badge-optional">Optional</span></td>
              <td>Filter by status: <code>draft</code> | <code>published</code> | <code>scheduled</code>. Omit for all.</td>
            </tr>
            <tr>
              <td><code>category</code></td>
              <td>string</td>
              <td><span class="badge badge-optional">Optional</span></td>
              <td>Filter by category name (exact match, URL-encoded)</td>
            </tr>
            <tr>
              <td><code>search</code></td>
              <td>string</td>
              <td><span class="badge badge-optional">Optional</span></td>
              <td>Case-insensitive title search (ILIKE <code>%search%</code>)</td>
            </tr>
            <tr>
              <td><code>page</code></td>
              <td>number</td>
              <td><span class="badge badge-optional">Optional</span></td>
              <td>Page number, default 1</td>
            </tr>
            <tr>
              <td><code>limit</code></td>
              <td>number</td>
              <td><span class="badge badge-optional">Optional</span></td>
              <td>Items per page, default 10, max 100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="subsection">
        <div class="subsection-title">Response 200 OK</div>
        <pre>{
  <span class="json-key">"data"</span>: [<span style="color:#64748b">/* BlogPost[] — full objects */</span>],
  <span class="json-key">"total"</span>:      <span class="json-num">10</span>,
  <span class="json-key">"page"</span>:       <span class="json-num">1</span>,
  <span class="json-key">"limit"</span>:      <span class="json-num">10</span>,
  <span class="json-key">"totalPages"</span>: <span class="json-num">1</span>
}</pre>
      </div>
      <div class="info-box" style="margin-bottom:0">
        <strong>Frontend behaviour:</strong> The admin Blog List page calls this with
        <code>status</code>, <code>category</code>, and <code>search</code> from the filter bar state.
        Empty string values should be treated the same as omitted (no filter applied).
      </div>
    </div>
  </div>

  <!-- POST /blog -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-post">POST</span>
      <div class="endpoint-title">/blog</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> <span class="badge badge-admin">All Roles</span> Create new post</div>
    </div>
    <div class="endpoint-body">
      <div class="subsection">
        <div class="subsection-title">Request Body (CreateBlogPostDto)</div>
        <pre>{
  <span class="json-key">"title"</span>:        <span class="json-str">"Cloud Security Best Practices"</span>,
  <span class="json-key">"slug"</span>:         <span class="json-str">"cloud-security-best-practices"</span>,
  <span class="json-key">"content"</span>:      <span class="json-str">"{\"type\":\"doc\",\"content\":[...]}"</span>,
  <span class="json-key">"status"</span>:       <span class="json-str">"draft"</span>,
  <span class="json-key">"category"</span>:     <span class="json-str">"Solutions"</span>,
  <span class="json-key">"tags"</span>:         [<span class="json-str">"cloud"</span>, <span class="json-str">"security"</span>],
  <span class="json-key">"featuredImage"</span>: <span class="json-null">null</span>,
  <span class="json-key">"seo"</span>: {
    <span class="json-key">"metaTitle"</span>:       <span class="json-str">"Cloud Security Best Practices"</span>,
    <span class="json-key">"metaDescription"</span>: <span class="json-str">"Protect your cloud workloads."</span>,
    <span class="json-key">"ogImage"</span>:         <span class="json-null">null</span>
  },
  <span class="json-key">"scheduledAt"</span>: <span class="json-null">null</span>  <span style="color:#64748b">// required if status === "scheduled"</span>
}</pre>
      </div>
      <div class="two-col">
        <div>
          <div class="subsection-title">Server Responsibilities</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Generate UUID for <code>id</code></li>
            <li>Set <code>createdAt</code> and <code>updatedAt</code> to <code>now()</code></li>
            <li>Set <code>author</code> from the JWT payload (authenticated user)</li>
            <li>Validate <code>slug</code> uniqueness — return <code>409</code> if conflict</li>
            <li>Validate <code>scheduledAt</code> is future if <code>status === "scheduled"</code></li>
          </ul>
        </div>
        <div>
          <div class="subsection-title">Response 201 Created</div>
          <p style="font-size:12px;color:#64748b">Returns the full <code>BlogPost</code> object including server-generated <code>id</code>, <code>createdAt</code>, <code>updatedAt</code>, and <code>author</code>.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- GET /blog/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/blog/:id</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> Get single post by ID</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Path Parameter</div>
          <table>
            <tr><td><code>:id</code></td><td>Post UUID</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Full <code>BlogPost</code> object</td></tr>
            <tr><td><code>404</code></td><td>Post not found</td></tr>
          </table>
        </div>
      </div>
      <div class="info-box" style="margin-top:14px;margin-bottom:0">
        Used by the admin editor when navigating to <code>/admin/blog/edit/:id</code> to pre-populate the form.
      </div>
    </div>
  </div>

  <!-- PUT /blog/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-put">PUT</span>
      <div class="endpoint-title">/blog/:id</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> <span class="badge badge-admin">All Roles</span> Full update</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body (UpdateBlogPostDto)</div>
          <p style="font-size:12px;color:#64748b;margin-bottom:8px">Same shape as <code>CreateBlogPostDto</code>. All fields sent — frontend sends the complete object.</p>
          <div class="warn-box" style="margin-bottom:0">
            <strong>createdAt must not change.</strong> The frontend sends the original
            <code>createdAt</code> in the body; the server should ignore it and use the
            stored value — or simply not accept <code>createdAt</code> in the DTO. Only
            <code>updatedAt</code> is updated (to <code>now()</code>).
          </div>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td>Updated <code>BlogPost</code> object</td></tr>
            <tr><td><code>403</code></td><td>Staff trying to edit another author's post</td></tr>
            <tr><td><code>404</code></td><td>Post not found</td></tr>
            <tr><td><code>409</code></td><td>Slug conflict with another post</td></tr>
          </table>
          <div class="info-box" style="margin-top:12px;margin-bottom:0">
            <strong>Staff restriction:</strong> <code>staff</code> role can only update posts
            where <code>author.id</code> matches their own user ID.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- DELETE /blog/:id -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-delete">DELETE</span>
      <div class="endpoint-title">/blog/:id</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> <span class="badge badge-super">super_admin only</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Path Parameter</div>
          <table>
            <tr><td><code>:id</code></td><td>Post UUID</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>204</code></td><td>Deleted — no body</td></tr>
            <tr><td><code>403</code></td><td>Caller is not <code>super_admin</code></td></tr>
            <tr><td><code>404</code></td><td>Post not found</td></tr>
          </table>
        </div>
      </div>
      <div class="error-box" style="margin-top:14px;margin-bottom:0">
        <strong>Role enforcement required:</strong> The frontend hides the delete button from
        <code>staff</code> users but the backend MUST also enforce this at the API level. Return
        <code>403 Forbidden</code> if a <code>staff</code> JWT is used.
      </div>
    </div>
  </div>

  <!-- GET /blog/public -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/blog/public</div>
      <div class="endpoint-desc">No auth — public website facing</div>
    </div>
    <div class="endpoint-body">
      <div class="subsection">
        <div class="subsection-title">Query Parameters</div>
        <table>
          <thead>
            <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>page</code></td><td>number</td><td>1</td><td>Page number</td></tr>
            <tr><td><code>limit</code></td><td>number</td><td>20</td><td>Items per page</td></tr>
          </tbody>
        </table>
      </div>
      <div class="subsection">
        <div class="subsection-title">Behaviour</div>
        <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
          <li>Returns only <code>status === "published"</code> posts</li>
          <li>Sorted by <code>createdAt DESC</code> (newest first)</li>
          <li>No authentication required — CORS must allow the frontend origin</li>
          <li>Response shape is identical to <code>GET /blog</code> (paginated)</li>
        </ul>
      </div>
      <div class="info-box" style="margin-bottom:0">
        <strong>Frontend integration point:</strong> <code>src/pages/Blog.tsx</code> currently calls
        <code>blogApi.getAll({ status: "published" })</code> from the mock. When swapping, replace
        this with an unauthenticated <code>GET /api/v1/blog/public</code> call.
      </div>
    </div>
  </div>
</div>

<!-- ===== PAGE 5: DASHBOARD + NOTIFICATIONS ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📊</div>
    <div>
      <div class="section-title">05 — Dashboard API</div>
      <div class="section-subtitle">Stats, activity feed and chart data — all require authentication</div>
    </div>
  </div>

  <!-- GET /dashboard/stats -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/dashboard/stats</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request</div>
          <p style="font-size:12px;color:#64748b">No parameters.</p>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>{
  <span class="json-key">"totalPosts"</span>: <span class="json-num">10</span>,
  <span class="json-key">"published"</span>:  <span class="json-num">5</span>,
  <span class="json-key">"drafts"</span>:     <span class="json-num">3</span>,
  <span class="json-key">"scheduled"</span>: <span class="json-num">2</span>
}</pre>
        </div>
      </div>
      <div class="info-box" style="margin-top:14px;margin-bottom:0">
        These counts are shown as stat cards at the top of the admin dashboard. Compute them with
        <code>COUNT(*) WHERE status = ?</code> queries. The frontend calls this on every dashboard
        page load, so it should be fast — consider caching for 30–60 seconds.
      </div>
    </div>
  </div>

  <!-- GET /dashboard/activity -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/dashboard/activity</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>[
  {
    <span class="json-key">"id"</span>:        <span class="json-str">"1"</span>,
    <span class="json-key">"type"</span>:      <span class="json-str">"publish"</span>,
    <span class="json-key">"message"</span>:   <span class="json-str">"Post published: Cloud Security"</span>,
    <span class="json-key">"time"</span>:      <span class="json-str">"2h ago"</span>,
    <span class="json-key">"createdAt"</span>: <span class="json-str">"2026-05-19T08:00:00Z"</span>
  },
  ...
]</pre>
        </div>
        <div>
          <div class="subsection-title">Activity Event Types</div>
          <table>
            <tr><th>type</th><th>Triggered by</th></tr>
            <tr><td><code>publish</code></td><td>Post status set to "published"</td></tr>
            <tr><td><code>draft</code></td><td>Post saved as draft</td></tr>
            <tr><td><code>edit</code></td><td>Existing post updated</td></tr>
            <tr><td><code>delete</code></td><td>Post deleted</td></tr>
            <tr><td><code>login</code></td><td>Admin user logged in</td></tr>
          </table>
          <div class="info-box" style="margin-top:12px;margin-bottom:0">
            Returns the 20 most recent events, sorted by <code>createdAt DESC</code>. Consider
            an <code>activity_log</code> table populated by NestJS service layer events.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- GET /dashboard/chart -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/dashboard/chart</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Query Parameters</div>
          <table>
            <tr><th>Param</th><th>Default</th><th>Description</th></tr>
            <tr><td><code>days</code></td><td>30</td><td>Number of days to return (max 90)</td></tr>
          </table>
          <div class="subsection-title" style="margin-top:14px">Response 200 OK</div>
          <pre>[
  { <span class="json-key">"date"</span>: <span class="json-str">"2026-04-20"</span>, <span class="json-key">"posts"</span>: <span class="json-num">2</span> },
  { <span class="json-key">"date"</span>: <span class="json-str">"2026-04-21"</span>, <span class="json-key">"posts"</span>: <span class="json-num">0</span> },
  ...
]</pre>
        </div>
        <div>
          <div class="subsection-title">Notes</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Always return exactly <code>days</code> entries</li>
            <li>Fill gaps (days with 0 posts) with <code>{ date, posts: 0 }</code></li>
            <li>Use <code>DATE(created_at)</code> grouping in SQL</li>
            <li>Sorted ascending by date</li>
            <li>Used to render a line/bar chart on the dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- NOTIFICATIONS -->
  <div class="section-header" style="margin-top:32px">
    <div class="section-icon">🔔</div>
    <div>
      <div class="section-title">06 — Notifications API</div>
      <div class="section-subtitle">In-app notification feed — all endpoints require authentication</div>
    </div>
  </div>

  <!-- GET /notifications -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/notifications</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>[
  {
    <span class="json-key">"id"</span>:        <span class="json-str">"1"</span>,
    <span class="json-key">"title"</span>:     <span class="json-str">"Post Published"</span>,
    <span class="json-key">"message"</span>:   <span class="json-str">"Welcome to MyMquid is now live."</span>,
    <span class="json-key">"type"</span>:      <span class="json-str">"success"</span>,
    <span class="json-key">"read"</span>:      <span class="json-bool">false</span>,
    <span class="json-key">"createdAt"</span>: <span class="json-str">"2026-05-19T08:00:00Z"</span>
  }
]</pre>
        </div>
        <div>
          <div class="subsection-title">Notes</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2">
            <li>Returns notifications for the authenticated user</li>
            <li>Sorted by <code>createdAt DESC</code></li>
            <li>Unread count is derived by the frontend: <code>filter(n => !n.read).length</code></li>
            <li>The TopNav badge displays this unread count</li>
            <li>Limit to 50 most recent</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="two-col">
    <!-- PATCH /notifications/:id/read -->
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="toc-method m-patch">PATCH</span>
        <div class="endpoint-title">/notifications/:id/read</div>
        <div class="endpoint-desc"><span class="badge badge-auth">Auth</span></div>
      </div>
      <div class="endpoint-body">
        <div class="subsection-title">Path Parameter</div>
        <table>
          <tr><td><code>:id</code></td><td>Notification UUID</td></tr>
        </table>
        <div class="subsection-title" style="margin-top:12px">Response 200 OK</div>
        <pre>{
  <span class="json-key">"id"</span>:   <span class="json-str">"1"</span>,
  <span class="json-key">"read"</span>: <span class="json-bool">true</span>
}</pre>
      </div>
    </div>

    <!-- PATCH /notifications/read-all -->
    <div class="endpoint-card">
      <div class="endpoint-header">
        <span class="toc-method m-patch">PATCH</span>
        <div class="endpoint-title">/notifications/read-all</div>
        <div class="endpoint-desc"><span class="badge badge-auth">Auth</span></div>
      </div>
      <div class="endpoint-body">
        <div class="subsection-title">Request / Response</div>
        <p style="font-size:12px;color:#64748b">No body. Marks all notifications for the authenticated user as read.</p>
        <div class="subsection-title" style="margin-top:12px">Response 200 OK</div>
        <pre>{
  <span class="json-key">"updated"</span>: <span class="json-num">3</span>
}</pre>
        <div class="info-box" style="margin-top:10px;margin-bottom:0">
          <strong>Route order matters:</strong> Register <code>/read-all</code> before <code>/:id/read</code> in NestJS to avoid the literal string "read-all" being treated as an <code>:id</code> param.
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ===== PAGE 6: PROFILE + INTEGRATION ===== -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">👤</div>
    <div>
      <div class="section-title">07 — Profile API</div>
      <div class="section-subtitle">Authenticated user's own profile — name, email, avatar, password</div>
    </div>
  </div>

  <!-- GET /profile -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-get">GET</span>
      <div class="endpoint-title">/profile</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span></div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <p style="font-size:12px;color:#64748b">Returns the authenticated user's own profile. Identical shape to <code>AdminUser</code>.</p>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <pre>{
  <span class="json-key">"id"</span>:     <span class="json-str">"1"</span>,
  <span class="json-key">"name"</span>:   <span class="json-str">"Patrick Evra"</span>,
  <span class="json-key">"email"</span>:  <span class="json-str">"admin@mymquid.com"</span>,
  <span class="json-key">"role"</span>:   <span class="json-str">"super_admin"</span>,
  <span class="json-key">"avatar"</span>: <span class="json-null">null</span>
}</pre>
        </div>
      </div>
    </div>
  </div>

  <!-- PUT /profile -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-put">PUT</span>
      <div class="endpoint-title">/profile</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> Update name and email</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body (UpdateProfileDto)</div>
          <pre>{
  <span class="json-key">"name"</span>:  <span class="json-str">"Patrick Evra"</span>,  <span style="color:#64748b">// required</span>
  <span class="json-key">"email"</span>: <span class="json-str">"admin@mymquid.com"</span>  <span style="color:#64748b">// required</span>
}</pre>
          <div class="subsection-title" style="margin-top:14px">Validation</div>
          <table>
            <tr><td><code>name</code></td><td>min 2 chars, max 100</td></tr>
            <tr><td><code>email</code></td><td>valid email, unique (409 if taken by another user)</td></tr>
          </table>
        </div>
        <div>
          <div class="subsection-title">Response 200 OK</div>
          <p style="font-size:12px;color:#64748b">Returns the updated <code>AdminUser</code> object.</p>
          <div class="subsection-title" style="margin-top:14px">Error Responses</div>
          <table>
            <tr><td><code>400</code></td><td>Validation error</td></tr>
            <tr><td><code>409</code></td><td>Email already in use by another account</td></tr>
          </table>
          <div class="info-box" style="margin-top:12px;margin-bottom:0">
            The frontend's Profile page uses React Hook Form + Zod validation and disables
            the Save button when there are no changes (<code>isDirty === false</code>).
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PUT /profile/password -->
  <div class="endpoint-card">
    <div class="endpoint-header">
      <span class="toc-method m-put">PUT</span>
      <div class="endpoint-title">/profile/password</div>
      <div class="endpoint-desc"><span class="badge badge-auth">Auth Required</span> Change password</div>
    </div>
    <div class="endpoint-body">
      <div class="two-col">
        <div>
          <div class="subsection-title">Request Body (ChangePasswordDto)</div>
          <pre>{
  <span class="json-key">"currentPassword"</span>: <span class="json-str">"old_password"</span>,
  <span class="json-key">"newPassword"</span>:     <span class="json-str">"new_secure_password"</span>,
  <span class="json-key">"confirmPassword"</span>: <span class="json-str">"new_secure_password"</span>
}</pre>
        </div>
        <div>
          <div class="subsection-title">Responses</div>
          <table>
            <tr><td><code>200</code></td><td><code>{ "message": "Password updated" }</code></td></tr>
            <tr><td><code>400</code></td><td><code>newPassword</code> and <code>confirmPassword</code> don't match</td></tr>
            <tr><td><code>401</code></td><td><code>currentPassword</code> is incorrect</td></tr>
          </table>
          <div class="warn-box" style="margin-top:12px;margin-bottom:0">
            Always verify <code>currentPassword</code> against the stored hash (bcrypt) before updating. Never allow password change without confirming the current password.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Integration Notes -->
  <div class="section-header" style="margin-top:32px">
    <div class="section-icon">🔗</div>
    <div>
      <div class="section-title">08 — Frontend Integration Notes</div>
      <div class="section-subtitle">How the frontend will connect to the real backend — the single swap point</div>
    </div>
  </div>

  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Mock-to-Real API Swap Point</div>
    </div>
    <div class="endpoint-body">
      <div class="info-box">
        The entire mock API lives in a single file: <code>src/admin/mock/api.ts</code>.
        When the backend is ready, replace the function bodies in that file with Axios calls.
        No other files need to change — all frontend components import from this file.
      </div>
      <div class="subsection-title">Suggested Axios Instance (create: src/lib/axios.ts)</div>
      <pre>import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(
    localStorage.getItem("mymquid-admin-auth") || "{}"
  );
  const token = auth?.state?.token;
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("mymquid-admin-auth");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;</pre>
    </div>
  </div>

  <div class="two-col">
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">Blog Categories</div>
      </div>
      <div class="endpoint-body">
        <p style="font-size:12px;color:#64748b;margin-bottom:10px">
          The frontend currently hardcodes categories in
          <code>src/admin/mock/data.ts</code>.
          Add a categories endpoint or seed these to the database:
        </p>
        <pre>[
  <span class="json-str">"Company News"</span>,
  <span class="json-str">"Solutions"</span>,
  <span class="json-str">"Insights"</span>,
  <span class="json-str">"Case Studies"</span>
]</pre>
        <p style="font-size:12px;color:#64748b;margin-top:10px">
          Optionally add <code>GET /blog/categories</code> returning this list
          and wire it to the frontend's category filter dropdown.
        </p>
      </div>
    </div>
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div class="endpoint-title">Public Blog vs Admin Blog</div>
      </div>
      <div class="endpoint-body">
        <table>
          <thead>
            <tr><th>Aspect</th><th>Public</th><th>Admin</th></tr>
          </thead>
          <tbody>
            <tr><td>Endpoint</td><td><code>/blog/public</code></td><td><code>/blog</code></td></tr>
            <tr><td>Auth</td><td>None</td><td>JWT required</td></tr>
            <tr><td>Status filter</td><td>published only</td><td>all statuses</td></tr>
            <tr><td>Used by</td><td><code>src/pages/Blog.tsx</code></td><td><code>src/admin/blog/</code></td></tr>
          </tbody>
        </table>
        <div class="info-box" style="margin-top:12px;margin-bottom:0">
          The public blog page (<code>/blog</code>) calls the same mock API as the admin.
          When connecting, it should use an unauthenticated endpoint.
        </div>
      </div>
    </div>
  </div>

  <div class="endpoint-card">
    <div class="endpoint-header">
      <div class="endpoint-title">Environment Variables (Frontend)</div>
    </div>
    <div class="endpoint-body">
      <div class="subsection-title">Add to .env.local</div>
      <pre>VITE_API_URL=http://localhost:3000/api/v1</pre>
      <div class="subsection-title" style="margin-top:14px">NestJS CORS Configuration</div>
      <pre>app.enableCors({
  origin: [
    "http://localhost:5173",   // Vite dev server
    "https://mymquid.com",     // production
  ],
  credentials: true,
});</pre>
    </div>
  </div>

  <div class="endpoint-card" style="background:linear-gradient(135deg,#f8faff,#f0f4ff);border-color:#c7d2fe">
    <div class="endpoint-header" style="background:transparent">
      <div class="endpoint-title" style="color:#3730a3">Quick Reference: All Endpoints</div>
    </div>
    <div class="endpoint-body">
      <table>
        <thead>
          <tr><th>Method</th><th>Path</th><th>Auth</th><th>Role</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="toc-method m-post">POST</span></td><td><code>/auth/login</code></td><td>—</td><td>—</td><td>Login, get JWT</td></tr>
          <tr><td><span class="toc-method m-post">POST</span></td><td><code>/auth/logout</code></td><td>✓</td><td>any</td><td>Logout, invalidate token</td></tr>
          <tr><td><span class="toc-method m-post">POST</span></td><td><code>/auth/forgot-password</code></td><td>—</td><td>—</td><td>Send reset email</td></tr>
          <tr><td><span class="toc-method m-post">POST</span></td><td><code>/auth/reset-password</code></td><td>—</td><td>—</td><td>Reset password via token</td></tr>
          <tr><td><span class="toc-method m-get">GET</span></td><td><code>/auth/me</code></td><td>✓</td><td>any</td><td>Get own user from JWT</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-get">GET</span></td><td><code>/blog</code></td><td>✓</td><td>any</td><td>List posts (filterable, paginated)</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-post">POST</span></td><td><code>/blog</code></td><td>✓</td><td>any</td><td>Create new post</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-get">GET</span></td><td><code>/blog/public</code></td><td>—</td><td>—</td><td>Public list (published only)</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-get">GET</span></td><td><code>/blog/:id</code></td><td>✓</td><td>any</td><td>Get single post by ID</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-put">PUT</span></td><td><code>/blog/:id</code></td><td>✓</td><td>any*</td><td>Update post (* staff: own posts only)</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-delete">DELETE</span></td><td><code>/blog/:id</code></td><td>✓</td><td>super_admin</td><td>Delete post</td></tr>
          <tr><td><span class="toc-method m-get">GET</span></td><td><code>/dashboard/stats</code></td><td>✓</td><td>any</td><td>Post count stats</td></tr>
          <tr><td><span class="toc-method m-get">GET</span></td><td><code>/dashboard/activity</code></td><td>✓</td><td>any</td><td>Recent activity feed</td></tr>
          <tr><td><span class="toc-method m-get">GET</span></td><td><code>/dashboard/chart</code></td><td>✓</td><td>any</td><td>Posts-per-day chart data</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-get">GET</span></td><td><code>/notifications</code></td><td>✓</td><td>any</td><td>User's notifications</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-patch">PATCH</span></td><td><code>/notifications/read-all</code></td><td>✓</td><td>any</td><td>Mark all as read</td></tr>
          <tr style="background:#f8fafc"><td><span class="toc-method m-patch">PATCH</span></td><td><code>/notifications/:id/read</code></td><td>✓</td><td>any</td><td>Mark one as read</td></tr>
          <tr><td><span class="toc-method m-get">GET</span></td><td><code>/profile</code></td><td>✓</td><td>any</td><td>Get own profile</td></tr>
          <tr><td><span class="toc-method m-put">PUT</span></td><td><code>/profile</code></td><td>✓</td><td>any</td><td>Update name and email</td></tr>
          <tr><td><span class="toc-method m-put">PUT</span></td><td><code>/profile/password</code></td><td>✓</td><td>any</td><td>Change password</td></tr>
        </tbody>
      </table>
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
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
  displayHeaderFooter: true,
  headerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:6px 24px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>MyMquid API Documentation — v1.0</span>
    <span>Confidential</span>
  </div>`,
  footerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:6px 24px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>© 2026 MyMquid. For internal use only.</span>
    <span class="pageNumber"></span>
  </div>`,
});

await browser.close();
console.log("PDF generated:", OUT);
