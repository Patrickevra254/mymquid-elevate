import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../mymquid-notifications-api.pdf");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MyMquid — Blog Event Notifications API</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; color: #1a1a2e; line-height: 1.6; }

  .cover {
    page-break-after: always;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%);
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center; color: #fff; padding: 60px;
  }
  .cover-logo { font-size: 52px; font-weight: 800; letter-spacing: -2px; background: linear-gradient(135deg, #818cf8, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
  .cover-tag { display: inline-block; background: rgba(129,140,248,0.15); border: 1px solid rgba(129,140,248,0.3); border-radius: 99px; padding: 4px 18px; font-size: 11px; color: #a5b4fc; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
  .cover-sub { font-size: 26px; font-weight: 300; color: #94a3b8; }
  .cover-divider { width: 60px; height: 3px; background: linear-gradient(90deg,#818cf8,#38bdf8); border-radius: 2px; margin: 22px auto; }
  .cover-desc { font-size: 14px; color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.9; }
  .cover-chips { margin-top: 48px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .cover-chip { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); border-radius: 20px; padding: 5px 16px; font-size: 11px; color: #a5b4fc; }
  .cover-alert { margin-top: 36px; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 10px; padding: 14px 24px; font-size: 12px; color: #fbbf24; max-width: 480px; }

  .page { padding: 50px 60px; page-break-before: always; }
  .page-first { padding: 50px 60px; }

  .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 3px solid #818cf8; }
  .section-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #818cf8, #38bdf8); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .section-title { font-size: 24px; font-weight: 700; color: #0f172a; }
  .section-subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; overflow: hidden; }
  .card-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
  .card-title { font-size: 14px; font-weight: 600; color: #1e293b; }
  .card-desc { font-size: 12px; color: #64748b; margin-left: auto; }
  .card-body { padding: 20px; }

  .sub-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #818cf8; margin-bottom: 8px; margin-top: 16px; }
  .sub-title:first-child { margin-top: 0; }

  pre, code { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; }
  pre { background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
  .k { color: #7dd3fc; } .s { color: #86efac; } .n { color: #fbbf24; } .b { color: #f87171; } .c { color: #64748b; font-style: italic; }

  .badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
  .badge-new { background: #dcfce7; color: #166534; }
  .badge-backend { background: #fce7f3; color: #9d174d; }
  .badge-done { background: #dbeafe; color: #1d4ed8; }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f1f5f9; color: #475569; font-weight: 600; padding: 9px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  td code { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; color: #7c3aed; font-size: 11px; }

  .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #1e40af; }
  .warn-box { background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #92400e; }
  .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #166534; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .flow-step { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; }
  .flow-num { width: 28px; height: 28px; background: #818cf8; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
  .flow-label { font-weight: 600; color: #1e293b; font-size: 13px; }
  .flow-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .flow-arrow { margin-left: 13px; color: #cbd5e1; font-size: 16px; line-height: 1; margin-bottom: 4px; }

  .event-row { display: flex; align-items: stretch; gap: 0; margin-bottom: 12px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
  .event-left { background: #818cf8; color: #fff; padding: 12px 16px; font-size: 12px; font-weight: 700; min-width: 120px; display: flex; align-items: center; justify-content: center; text-align: center; }
  .event-right { padding: 12px 16px; flex: 1; font-size: 12px; color: #334155; }
  .event-right strong { color: #1e293b; }

  .m-post { background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
  .m-put  { background: #fef9c3; color: #854d0e; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
  .m-del  { background: #fee2e2; color: #991b1b; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: monospace; }

  .type-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 99px; padding: 2px 10px; font-size: 11px; font-weight: 600; }
  .type-info    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 99px; padding: 2px 10px; font-size: 11px; font-weight: 600; }
  .type-warning { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; border-radius: 99px; padding: 2px 10px; font-size: 11px; font-weight: 600; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-logo">MyMquid</div>
  <div class="cover-tag">Backend Spec — Notifications</div>
  <div class="cover-sub">Blog Event Notification System</div>
  <div class="cover-divider"></div>
  <div class="cover-desc">
    Specification for the backend notification system that automatically creates
    in-app notifications for all active users whenever a blog post is
    <strong>created</strong>, <strong>updated</strong>, <strong>published</strong>,
    or <strong>deleted</strong>.
  </div>
  <div class="cover-chips">
    <span class="cover-chip">Version 1.0</span>
    <span class="cover-chip">June 2026</span>
    <span class="cover-chip">NestJS</span>
    <span class="cover-chip">Backend Only</span>
  </div>
  <div class="cover-alert">
    ⚠️ This is a backend-only implementation. The frontend notification UI,
    badge count, and API calls are already built and working — only the
    server-side event handling needs to be added.
  </div>
</div>

<!-- PAGE 1: OVERVIEW -->
<div class="page-first">
  <div class="section-header">
    <div class="section-icon">🔔</div>
    <div>
      <div class="section-title">Overview</div>
      <div class="section-subtitle">What's already built, what the backend needs to add</div>
    </div>
  </div>

  <!-- What's already done -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">What Is Already Working (Frontend) <span class="badge badge-done">DONE</span></div>
    </div>
    <div class="card-body">
      <div class="three-col">
        <div>
          <div class="sub-title">Notification Bell (TopNav)</div>
          <p style="font-size:12px;color:#334155;line-height:1.8">
            Shows a red badge with the unread count. Reads from
            <code>useNotificationStore.unreadCount</code>. Updates immediately
            after every blog save or delete — no page reload needed.
          </p>
        </div>
        <div>
          <div class="sub-title">Notifications Page</div>
          <p style="font-size:12px;color:#334155;line-height:1.8">
            Lists all notifications from <code>GET /notifications</code>.
            Users can mark individual items or all as read. Badge count
            decrements accordingly.
          </p>
        </div>
        <div>
          <div class="sub-title">Auto-Refresh Trigger</div>
          <p style="font-size:12px;color:#334155;line-height:1.8">
            After every <code>savePost()</code> and <code>deletePost()</code>
            the store calls <code>GET /notifications</code> silently in the
            background. If the backend has new records, the badge updates instantly.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- What backend needs to do -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">What the Backend Needs to Add <span class="badge badge-backend">BACKEND WORK</span></div>
    </div>
    <div class="card-body">
      <div class="info-box">
        The frontend already fetches and displays notifications — it just needs the backend to
        <strong>write notification records to the database</strong> when blog events happen.
        No new API endpoints are required. This is purely internal server-side logic.
      </div>
      <div class="sub-title">Summary of Work Required</div>
      <table>
        <thead>
          <tr><th>What to do</th><th>Where</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Create <code>notifications</code> table</td>
            <td>Database migration</td>
            <td>If not already created from the existing <code>GET /notifications</code> endpoint</td>
          </tr>
          <tr>
            <td>Write a <code>NotificationsService</code></td>
            <td>NestJS service</td>
            <td>Method: <code>createForAllUsers(event)</code> — inserts one row per active user</td>
          </tr>
          <tr>
            <td>Hook into <code>BlogService</code></td>
            <td>NestJS service</td>
            <td>Call <code>NotificationsService.createForAllUsers()</code> after create, update, delete</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- How the frontend refreshes -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">How the Frontend Refresh Works</div>
    </div>
    <div class="card-body">
      <div class="flow-step">
        <div class="flow-num">1</div>
        <div class="flow-content">
          <div class="flow-label">Admin saves or deletes a blog post</div>
          <div class="flow-sub">Frontend calls <code>POST /blog</code>, <code>PUT /blog/:id</code>, or <code>DELETE /blog/:id</code></div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">2</div>
        <div class="flow-content">
          <div class="flow-label">Backend processes the blog request AND writes notification records</div>
          <div class="flow-sub">Inserts one <code>notifications</code> row per active user — this is the new backend work</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">3</div>
        <div class="flow-content">
          <div class="flow-label">Frontend blog store receives success response</div>
          <div class="flow-sub">Shows toast ("Post published!" / "Post deleted.")</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">4</div>
        <div class="flow-content">
          <div class="flow-label">Frontend silently calls GET /notifications in the background</div>
          <div class="flow-sub">File: <code>src/admin/blog/useBlogStore.ts</code> — triggered automatically after every save/delete</div>
        </div>
      </div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step">
        <div class="flow-num">5</div>
        <div class="flow-content">
          <div class="flow-label">Notification store updates — badge count refreshes instantly</div>
          <div class="flow-sub">The red number on the bell icon in the top navigation updates to reflect new unread notifications</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 2: EVENTS & NOTIFICATION SHAPES -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">📋</div>
    <div>
      <div class="section-title">Blog Events &amp; Notification Content</div>
      <div class="section-subtitle">Exactly what to create in the database for each blog action</div>
    </div>
  </div>

  <!-- Event table -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Events That Trigger Notifications</div>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>Blog Action</th>
            <th>API Call</th>
            <th>Condition</th>
            <th>Notification Title</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Post Created (Draft)</strong></td>
            <td><span class="m-post">POST</span> <code>/blog</code></td>
            <td><code>status === "draft"</code></td>
            <td>"New Draft Created"</td>
            <td><span class="type-info">info</span></td>
          </tr>
          <tr>
            <td><strong>Post Published</strong></td>
            <td><span class="m-post">POST</span> or <span class="m-put">PUT</span> <code>/blog</code></td>
            <td><code>status === "published"</code></td>
            <td>"Post Published"</td>
            <td><span class="type-success">success</span></td>
          </tr>
          <tr>
            <td><strong>Post Scheduled</strong></td>
            <td><span class="m-post">POST</span> or <span class="m-put">PUT</span> <code>/blog</code></td>
            <td><code>status === "scheduled"</code></td>
            <td>"Post Scheduled"</td>
            <td><span class="type-info">info</span></td>
          </tr>
          <tr>
            <td><strong>Post Updated</strong></td>
            <td><span class="m-put">PUT</span> <code>/blog/:id</code></td>
            <td>Any update (status unchanged)</td>
            <td>"Post Updated"</td>
            <td><span class="type-info">info</span></td>
          </tr>
          <tr>
            <td><strong>Post Deleted</strong></td>
            <td><span class="m-del">DELETE</span> <code>/blog/:id</code></td>
            <td>Always</td>
            <td>"Post Deleted"</td>
            <td><span class="type-warning">warning</span></td>
          </tr>
        </tbody>
      </table>
      <div class="info-box" style="margin-top:16px;margin-bottom:0">
        <strong>Tip:</strong> For PUT requests, check the incoming <code>status</code> field to decide
        which event applies. If the status changed from <code>draft</code> to <code>published</code>,
        emit "Post Published" — not "Post Updated".
      </div>
    </div>
  </div>

  <!-- Notification message examples -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Notification Message Examples</div>
      <div class="card-desc">Include the post title in the message for context</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">Post Published</div>
          <pre>{
  <span class="k">"title"</span>:   <span class="s">"Post Published"</span>,
  <span class="k">"message"</span>: <span class="s">"\"Cloud Security Best Practices\" is now live."</span>,
  <span class="k">"type"</span>:    <span class="s">"success"</span>
}</pre>
          <div class="sub-title" style="margin-top:14px">Post Deleted</div>
          <pre>{
  <span class="k">"title"</span>:   <span class="s">"Post Deleted"</span>,
  <span class="k">"message"</span>: <span class="s">"\"2026 Industry Trends\" was permanently deleted."</span>,
  <span class="k">"type"</span>:    <span class="s">"warning"</span>
}</pre>
        </div>
        <div>
          <div class="sub-title">New Draft Created</div>
          <pre>{
  <span class="k">"title"</span>:   <span class="s">"New Draft Created"</span>,
  <span class="k">"message"</span>: <span class="s">"\"AI in Modern Business\" was saved as a draft."</span>,
  <span class="k">"type"</span>:    <span class="s">"info"</span>
}</pre>
          <div class="sub-title" style="margin-top:14px">Post Updated</div>
          <pre>{
  <span class="k">"title"</span>:   <span class="s">"Post Updated"</span>,
  <span class="k">"message"</span>: <span class="s">"\"Our Technology Solutions\" was updated by Patrick Evra."</span>,
  <span class="k">"type"</span>:    <span class="s">"info"</span>
}</pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Full notification DB record -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Full Notification Record to Insert</div>
      <div class="card-desc">One row per active user per event</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">Database Row Shape</div>
          <pre>{
  id:         uuid (auto-generated),
  user_id:    string,   <span class="c">-- FK → users.id</span>
  title:      string,
  message:    string,
  type:       "info" | "success" | "warning" | "error",
  read:       false,    <span class="c">-- always false on creation</span>
  created_at: now()
}</pre>
        </div>
        <div>
          <div class="sub-title">What GET /notifications Returns (per row)</div>
          <pre>{
  <span class="k">"id"</span>:        <span class="s">"uuid"</span>,
  <span class="k">"title"</span>:     <span class="s">"Post Published"</span>,
  <span class="k">"message"</span>:   <span class="s">"\"Cloud Security...\" is now live."</span>,
  <span class="k">"type"</span>:      <span class="s">"success"</span>,
  <span class="k">"read"</span>:      <span class="b">false</span>,
  <span class="k">"createdAt"</span>: <span class="s">"2026-06-01T12:00:00Z"</span>
}</pre>
          <div class="warn-box" style="margin-top:12px;margin-bottom:0">
            <code>GET /notifications</code> must filter by <code>user_id</code> of the
            authenticated user — each user only sees their own notifications.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 3: IMPLEMENTATION GUIDE -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">⚙️</div>
    <div>
      <div class="section-title">Implementation Guide</div>
      <div class="section-subtitle">NestJS code structure and implementation steps</div>
    </div>
  </div>

  <!-- NotificationsService -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Step 1 — Create NotificationsService Method</div>
    </div>
    <div class="card-body">
      <div class="sub-title">notifications.service.ts</div>
      <pre><span class="c">// Add this method to your existing NotificationsService</span>

async createForAllUsers(payload: {
  title:   string;
  message: string;
  type:    'info' | 'success' | 'warning' | 'error';
}): Promise&lt;void&gt; {
  <span class="c">// Fetch all active user IDs</span>
  const users = await this.usersRepository.find({
    where: { active: true },
    select: ['id'],
  });

  <span class="c">// Insert one notification row per user</span>
  const notifications = users.map((user) =>
    this.notificationsRepository.create({
      userId:  user.id,
      title:   payload.title,
      message: payload.message,
      type:    payload.type,
      read:    false,
    })
  );

  await this.notificationsRepository.save(notifications);
}</pre>
    </div>
  </div>

  <!-- BlogService hooks -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Step 2 — Hook into BlogService</div>
    </div>
    <div class="card-body">
      <div class="sub-title">blog.service.ts — inject NotificationsService</div>
      <pre><span class="c">// Inject NotificationsService into BlogService constructor</span>
constructor(
  @InjectRepository(BlogPost)
  private readonly blogRepository: Repository&lt;BlogPost&gt;,
  private readonly notificationsService: NotificationsService,  <span class="c">// ← add this</span>
) {}</pre>

      <div class="sub-title" style="margin-top:16px">After create (POST /blog)</div>
      <pre>async create(dto: CreateBlogPostDto, author: AdminUser): Promise&lt;BlogPost&gt; {
  const post = await this.blogRepository.save({ ...dto, author });

  <span class="c">// Notify all users based on status</span>
  const isPublished = post.status === 'published';
  const isScheduled = post.status === 'scheduled';

  await this.notificationsService.createForAllUsers({
    title:   isPublished ? 'Post Published' : isScheduled ? 'Post Scheduled' : 'New Draft Created',
    message: isPublished
      ? <span class="s">\`"\${post.title}" is now live.\`</span>
      : isScheduled
      ? <span class="s">\`"\${post.title}" is scheduled for publication.\`</span>
      : <span class="s">\`"\${post.title}" was saved as a draft.\`</span>,
    type: isPublished ? 'success' : 'info',
  });

  return post;
}</pre>

      <div class="sub-title" style="margin-top:16px">After update (PUT /blog/:id)</div>
      <pre>async update(id: string, dto: UpdateBlogPostDto, author: AdminUser): Promise&lt;BlogPost&gt; {
  const existing = await this.findOneOrFail(id);
  const updated = await this.blogRepository.save({ ...existing, ...dto });

  <span class="c">// Detect if status changed to published</span>
  const justPublished = existing.status !== 'published' &amp;&amp; updated.status === 'published';

  await this.notificationsService.createForAllUsers({
    title:   justPublished ? 'Post Published' : 'Post Updated',
    message: justPublished
      ? <span class="s">\`"\${updated.title}" is now live.\`</span>
      : <span class="s">\`"\${updated.title}" was updated by \${author.name}.\`</span>,
    type: justPublished ? 'success' : 'info',
  });

  return updated;
}</pre>

      <div class="sub-title" style="margin-top:16px">After delete (DELETE /blog/:id)</div>
      <pre>async delete(id: string): Promise&lt;void&gt; {
  const post = await this.findOneOrFail(id);
  await this.blogRepository.delete(id);

  await this.notificationsService.createForAllUsers({
    title:   'Post Deleted',
    message: <span class="s">\`"\${post.title}" was permanently deleted.\`</span>,
    type:    'warning',
  });
}</pre>
    </div>
  </div>
</div>

<!-- PAGE 4: DATABASE & CHECKLIST -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">🗄️</div>
    <div>
      <div class="section-title">Database Schema &amp; Implementation Checklist</div>
      <div class="section-subtitle">Table structure and step-by-step checklist</div>
    </div>
  </div>

  <!-- DB Schema -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Notifications Table Schema</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">SQL (PostgreSQL)</div>
          <pre>CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  type       VARCHAR(20) NOT NULL
               CHECK (type IN ('info','success','warning','error')),
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

<span class="c">-- Index for fast per-user queries</span>
CREATE INDEX idx_notifications_user_id
  ON notifications(user_id, created_at DESC);</pre>
        </div>
        <div>
          <div class="sub-title">TypeORM Entity</div>
          <pre>@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  type: 'info' | 'success' | 'warning' | 'error';

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}</pre>
        </div>
      </div>
      <div class="sub-title" style="margin-top:14px">GET /notifications Query (filter by logged-in user)</div>
      <pre>SELECT id, title, message, type, read, created_at
FROM   notifications
WHERE  user_id = :currentUserId
ORDER  BY created_at DESC
LIMIT  50;</pre>
    </div>
  </div>

  <!-- Important notes -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Important Notes</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">Performance</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2.2">
            <li>Use <code>INSERT ... SELECT</code> to batch-insert all user rows in a single query instead of a loop</li>
            <li>Add index on <code>(user_id, created_at DESC)</code> for fast reads</li>
            <li>Cap <code>GET /notifications</code> at 50 most recent — the frontend does not paginate notifications</li>
          </ul>
        </div>
        <div>
          <div class="sub-title">Edge Cases</div>
          <ul style="font-size:12px;color:#334155;padding-left:16px;line-height:2.2">
            <li>Wrap notification creation in a <code>try/catch</code> — notification failure should NOT cause the blog API to return an error</li>
            <li>Notifications are per-user — deactivated users (<code>active: false</code>) should NOT receive notifications</li>
            <li>The author who made the change can receive the notification too (optional, your call)</li>
          </ul>
        </div>
      </div>
      <div class="warn-box" style="margin-top:14px;margin-bottom:0">
        <strong>Critical:</strong> Do not let notification creation errors break the blog API response.
        Always wrap the <code>createForAllUsers()</code> call in a try/catch with silent failure —
        the blog operation (create/update/delete) must succeed even if notifications fail.
      </div>
    </div>
  </div>

  <!-- Checklist -->
  <div class="card" style="background:linear-gradient(135deg,#f8faff,#f0f4ff);border-color:#c7d2fe">
    <div class="card-header" style="background:transparent">
      <div class="card-title" style="color:#3730a3">Implementation Checklist</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">Database</div>
          <table>
            <tr><td>☐</td><td>Create <code>notifications</code> table (migration)</td></tr>
            <tr><td>☐</td><td>Add <code>user_id</code> foreign key → <code>users.id</code></td></tr>
            <tr><td>☐</td><td>Add index on <code>(user_id, created_at DESC)</code></td></tr>
          </table>
          <div class="sub-title" style="margin-top:14px">NotificationsService</div>
          <table>
            <tr><td>☐</td><td>Add <code>createForAllUsers(payload)</code> method</td></tr>
            <tr><td>☐</td><td>Filter only <code>active = true</code> users</td></tr>
            <tr><td>☐</td><td>Batch insert (not loop) for performance</td></tr>
          </table>
        </div>
        <div>
          <div class="sub-title">BlogService Hooks</div>
          <table>
            <tr><td>☐</td><td>Inject <code>NotificationsService</code> into <code>BlogService</code></td></tr>
            <tr><td>☐</td><td>After <code>create()</code> — notify based on status</td></tr>
            <tr><td>☐</td><td>After <code>update()</code> — detect status change to "published"</td></tr>
            <tr><td>☐</td><td>After <code>delete()</code> — notify all users</td></tr>
            <tr><td>☐</td><td>Wrap each call in try/catch (silent failure)</td></tr>
          </table>
          <div class="sub-title" style="margin-top:14px">Existing Endpoints (verify)</div>
          <table>
            <tr><td>☐</td><td><code>GET /notifications</code> filters by <code>user_id</code></td></tr>
            <tr><td>☐</td><td><code>PATCH /notifications/:id/read</code> works</td></tr>
            <tr><td>☐</td><td><code>PATCH /notifications/read-all</code> works</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick summary -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Frontend ↔ Backend Contract Summary</div>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr><th>Layer</th><th>Status</th><th>What It Does</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend — Notification Bell</td>
            <td><span class="badge badge-done">✅ Done</span></td>
            <td>Shows unread count badge, reads from <code>useNotificationStore.unreadCount</code></td>
          </tr>
          <tr>
            <td>Frontend — Notifications Page</td>
            <td><span class="badge badge-done">✅ Done</span></td>
            <td>Lists all notifications, mark-as-read, mark-all-as-read</td>
          </tr>
          <tr>
            <td>Frontend — Auto-refresh after blog actions</td>
            <td><span class="badge badge-done">✅ Done</span></td>
            <td>Calls <code>GET /notifications</code> after every save/delete silently</td>
          </tr>
          <tr>
            <td>Backend — <code>GET /notifications</code></td>
            <td><span class="badge badge-done">✅ Exists</span></td>
            <td>Returns notifications for the authenticated user — verify it filters by <code>user_id</code></td>
          </tr>
          <tr>
            <td>Backend — <code>PATCH /notifications/:id/read</code></td>
            <td><span class="badge badge-done">✅ Exists</span></td>
            <td>Marks one notification as read</td>
          </tr>
          <tr>
            <td>Backend — <code>PATCH /notifications/read-all</code></td>
            <td><span class="badge badge-done">✅ Exists</span></td>
            <td>Marks all user notifications as read</td>
          </tr>
          <tr>
            <td>Backend — Blog event → notification creation</td>
            <td><span class="badge badge-backend">⚠️ Needed</span></td>
            <td>Insert notification rows in <code>BlogService</code> after create/update/delete</td>
          </tr>
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
  margin: { top: "24px", bottom: "24px", left: "0", right: "0" },
  displayHeaderFooter: true,
  headerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:4px 40px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>MyMquid — Blog Event Notifications API</span>
    <span style="color:#f59e0b;font-weight:600">⚠ Backend implementation required</span>
  </div>`,
  footerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:4px 40px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>© 2026 MyMquid. Confidential — Backend Developer Reference.</span>
    <span class="pageNumber"></span>
  </div>`,
});

await browser.close();
console.log("✅ PDF generated:", OUT);
