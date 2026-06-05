import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../mymquid-dashboard-stats-fix.pdf");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>MyMquid — Dashboard Stats Fix</title>
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
  .cover-tag { display: inline-block; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 99px; padding: 4px 18px; font-size: 11px; color: #fca5a5; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
  .cover-sub { font-size: 26px; font-weight: 300; color: #94a3b8; }
  .cover-divider { width: 60px; height: 3px; background: linear-gradient(90deg,#818cf8,#38bdf8); border-radius: 2px; margin: 22px auto; }
  .cover-desc { font-size: 14px; color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.9; }
  .cover-chips { margin-top: 48px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .cover-chip { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); border-radius: 20px; padding: 5px 16px; font-size: 11px; color: #a5b4fc; }

  .page { padding: 50px 60px; }
  .page-break { page-break-before: always; padding: 50px 60px; }

  .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 3px solid #818cf8; }
  .section-icon { width: 46px; height: 46px; background: linear-gradient(135deg, #818cf8, #38bdf8); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .section-title { font-size: 24px; font-weight: 700; color: #0f172a; }
  .section-subtitle { font-size: 13px; color: #64748b; margin-top: 3px; }

  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; overflow: hidden; }
  .card-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; }
  .card-title { font-size: 14px; font-weight: 600; color: #1e293b; }
  .card-body { padding: 20px; }

  .sub-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #818cf8; margin-bottom: 8px; margin-top: 16px; }
  .sub-title:first-child { margin-top: 0; }

  pre { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
  code { font-family: 'Consolas', 'Courier New', monospace; font-size: 11px; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; color: #7c3aed; }
  .k { color: #7dd3fc; } .s { color: #86efac; } .n { color: #fbbf24; } .c { color: #64748b; font-style: italic; }

  .badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
  .badge-bug { background: #fee2e2; color: #991b1b; }
  .badge-fix { background: #dcfce7; color: #166534; }
  .badge-backend { background: #fce7f3; color: #9d174d; }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f1f5f9; color: #475569; font-weight: 600; padding: 9px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  td code { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; color: #7c3aed; font-size: 11px; }

  .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #1e40af; }
  .warn-box { background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #92400e; }
  .error-box { background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #991b1b; }
  .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #166534; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .mb-0 { margin-bottom: 0 !important; }
  .mt-14 { margin-top: 14px; }

  .stat-preview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
  .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
  .stat-card.broken { border-color: #fecaca; background: #fef2f2; }
  .stat-card.fixed { border-color: #bbf7d0; background: #f0fdf4; }
  .stat-label { font-size: 11px; color: #64748b; }
  .stat-value { font-size: 28px; font-weight: 700; color: #0f172a; margin: 4px 0; }
  .stat-value.empty { color: #e2e8f0; }
  .stat-trend { font-size: 11px; color: #94a3b8; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-logo">MyMquid</div>
  <div class="cover-tag">Bug Report + Fix</div>
  <div class="cover-sub">Dashboard Stats — Missing Fields</div>
  <div class="cover-divider"></div>
  <div class="cover-desc">
    The admin dashboard's four stat cards (Total Posts, Published, Drafts, Scheduled)
    show blank values for Published, Drafts and Scheduled because
    <code style="color:#fbbf24;background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px">GET /dashboard/stats</code>
    only returns <code style="color:#fbbf24;background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px">totalPosts</code>
    and omits the other three fields.
  </div>
  <div class="cover-chips">
    <span class="cover-chip">Frontend — Fixed</span>
    <span class="cover-chip">Backend — Action Required</span>
    <span class="cover-chip">June 2026</span>
  </div>
</div>

<!-- PAGE 1 -->
<div class="page">
  <div class="section-header">
    <div class="section-icon">🐛</div>
    <div>
      <div class="section-title">The Problem</div>
      <div class="section-subtitle">What the frontend sees vs. what it expects</div>
    </div>
  </div>

  <!-- Visual before/after -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Before Fix — Three cards show blank values <span class="badge badge-bug">BUG</span></div>
    </div>
    <div class="card-body">
      <div class="stat-preview">
        <div class="stat-card">
          <div class="stat-label">Total Posts</div>
          <div class="stat-value">10</div>
          <div class="stat-trend">All time</div>
        </div>
        <div class="stat-card broken">
          <div class="stat-label">Published</div>
          <div class="stat-value empty">—</div>
          <div class="stat-trend">Live now</div>
        </div>
        <div class="stat-card broken">
          <div class="stat-label">Drafts</div>
          <div class="stat-value empty">—</div>
          <div class="stat-trend">In progress</div>
        </div>
        <div class="stat-card broken">
          <div class="stat-label">Scheduled</div>
          <div class="stat-value empty">—</div>
          <div class="stat-trend">Upcoming</div>
        </div>
      </div>
      <div class="error-box mb-0">
        <strong>Root cause:</strong> When <code>stats.published</code>, <code>stats.drafts</code>, or
        <code>stats.scheduled</code> are <code>undefined</code>, React renders nothing — not even
        <code>0</code>. This happens because the backend omits those fields from the response.
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">After Fix — All four cards display correctly <span class="badge badge-fix">FIXED</span></div>
    </div>
    <div class="card-body">
      <div class="stat-preview">
        <div class="stat-card fixed">
          <div class="stat-label">Total Posts</div>
          <div class="stat-value">10</div>
          <div class="stat-trend">All time</div>
        </div>
        <div class="stat-card fixed">
          <div class="stat-label">Published</div>
          <div class="stat-value">5</div>
          <div class="stat-trend">Live now</div>
        </div>
        <div class="stat-card fixed">
          <div class="stat-label">Drafts</div>
          <div class="stat-value">3</div>
          <div class="stat-trend">In progress</div>
        </div>
        <div class="stat-card fixed">
          <div class="stat-label">Scheduled</div>
          <div class="stat-value">2</div>
          <div class="stat-trend">Upcoming</div>
        </div>
      </div>
    </div>
  </div>

  <!-- What the backend returns -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">What the Backend Currently Returns</div>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div>
          <div class="sub-title">Actual API Response (broken)</div>
          <pre>{
  <span class="k">"totalPosts"</span>: <span class="n">10</span>
  <span class="c">// "published" is MISSING</span>
  <span class="c">// "drafts" is MISSING</span>
  <span class="c">// "scheduled" is MISSING</span>
}</pre>
        </div>
        <div>
          <div class="sub-title">Expected API Response (correct)</div>
          <pre>{
  <span class="k">"totalPosts"</span>: <span class="n">10</span>,
  <span class="k">"published"</span>:  <span class="n">5</span>,
  <span class="k">"drafts"</span>:     <span class="n">3</span>,
  <span class="k">"scheduled"</span>: <span class="n">2</span>
}</pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Frontend fix -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Frontend Fix Applied (Temporary Fallback) <span class="badge badge-fix">DONE</span></div>
    </div>
    <div class="card-body">
      <div class="info-box">
        The frontend now derives missing stat counts from the blog posts list as a fallback.
        When the backend starts returning the correct fields, the API values take priority automatically
        — no further frontend changes needed.
      </div>
      <div class="sub-title">src/admin/dashboard/DashboardPage.tsx</div>
      <pre><span class="c">// Before (broken — undefined values render as blank)</span>
if (statsRes.status === "fulfilled") setStats(statsRes.value);

<span class="c">// After (fixed — derives missing fields from blog posts)</span>
if (statsRes.status === "fulfilled") {
  const s = statsRes.value;
  setStats({
    totalPosts: s.totalPosts ?? s.total ?? posts.length,
    published:  s.published  ?? posts.filter(p => p.status === <span class="s">"published"</span>).length,
    drafts:     s.drafts     ?? posts.filter(p => p.status === <span class="s">"draft"</span>).length,
    scheduled:  s.scheduled  ?? posts.filter(p => p.status === <span class="s">"scheduled"</span>).length,
  });
}</pre>
      <div class="warn-box mt-14 mb-0">
        <strong>This fallback is a stopgap only.</strong> The frontend fetches all blog posts
        to derive counts, which is inefficient at scale. The backend fix below removes this
        dependency entirely.
      </div>
    </div>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page-break">
  <div class="section-header">
    <div class="section-icon">🔧</div>
    <div>
      <div class="section-title">Backend Fix Required <span class="badge badge-backend" style="font-size:12px;padding:3px 10px;vertical-align:middle;margin-left:8px">ACTION NEEDED</span></div>
      <div class="section-subtitle">Add the three missing fields to GET /dashboard/stats</div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">What to Change</div>
    </div>
    <div class="card-body">
      <div class="sub-title">Endpoint</div>
      <pre>GET /api/v1/dashboard/stats
Authorization: Bearer &lt;token&gt;</pre>

      <div class="sub-title" style="margin-top:16px">Required Response Shape</div>
      <pre>{
  <span class="k">"totalPosts"</span>: <span class="n">10</span>,   <span class="c">// COUNT(*) from blog_posts</span>
  <span class="k">"published"</span>:  <span class="n">5</span>,    <span class="c">// COUNT(*) WHERE status = 'published'</span>
  <span class="k">"drafts"</span>:     <span class="n">3</span>,    <span class="c">// COUNT(*) WHERE status = 'draft'</span>
  <span class="k">"scheduled"</span>: <span class="n">2</span>     <span class="c">// COUNT(*) WHERE status = 'scheduled'</span>
}</pre>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">SQL Query</div>
    </div>
    <div class="card-body">
      <div class="sub-title">Single query approach (most efficient)</div>
      <pre>SELECT
  COUNT(*)                                          AS "totalPosts",
  COUNT(*) FILTER (WHERE status = 'published')      AS "published",
  COUNT(*) FILTER (WHERE status = 'draft')          AS "drafts",
  COUNT(*) FILTER (WHERE status = 'scheduled')      AS "scheduled"
FROM blog_posts;</pre>

      <div class="sub-title" style="margin-top:16px">NestJS Service Implementation</div>
      <pre>async getStats(): Promise&lt;DashboardStats&gt; {
  const result = await this.blogPostsRepository
    .createQueryBuilder('post')
    .select('COUNT(*)', 'totalPosts')
    .addSelect(<span class="s">"COUNT(*) FILTER (WHERE status = 'published')"</span>, 'published')
    .addSelect(<span class="s">"COUNT(*) FILTER (WHERE status = 'draft')"</span>, 'drafts')
    .addSelect(<span class="s">"COUNT(*) FILTER (WHERE status = 'scheduled')"</span>, 'scheduled')
    .getRawOne();

  return {
    totalPosts: parseInt(result.totalPosts, 10),
    published:  parseInt(result.published,  10),
    drafts:     parseInt(result.drafts,     10),
    scheduled:  parseInt(result.scheduled,  10),
  };
}</pre>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">TypeORM Alternative (if FILTER is not supported)</div>
    </div>
    <div class="card-body">
      <pre>async getStats(): Promise&lt;DashboardStats&gt; {
  const [totalPosts, published, drafts, scheduled] = await Promise.all([
    this.blogPostsRepository.count(),
    this.blogPostsRepository.count({ where: { status: 'published' } }),
    this.blogPostsRepository.count({ where: { status: 'draft' } }),
    this.blogPostsRepository.count({ where: { status: 'scheduled' } }),
  ]);

  return { totalPosts, published, drafts, scheduled };
}</pre>
      <div class="info-box mt-14 mb-0">
        The <code>Promise.all</code> approach runs all 4 queries in parallel — negligible performance
        difference vs. the single query for typical post counts.
      </div>
    </div>
  </div>

  <!-- Summary table -->
  <div class="card" style="background:linear-gradient(135deg,#f8faff,#f0f4ff);border-color:#c7d2fe">
    <div class="card-header" style="background:transparent">
      <div class="card-title" style="color:#3730a3">Summary</div>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr><th>Layer</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend — DashboardPage.tsx</td>
            <td><span class="badge badge-fix">✅ Fixed</span></td>
            <td>Derives missing counts from blog posts as fallback. No further changes needed.</td>
          </tr>
          <tr>
            <td>Backend — GET /dashboard/stats</td>
            <td><span class="badge badge-backend">⚠️ Required</span></td>
            <td>Add <code>published</code>, <code>drafts</code>, <code>scheduled</code> fields to the response using COUNT queries grouped by status.</td>
          </tr>
        </tbody>
      </table>
      <div class="success-box" style="margin-top:16px;margin-bottom:0">
        Once the backend returns all four fields, the frontend fallback becomes inactive automatically —
        the API values take precedence via the <code>??</code> null-coalescing operator.
        No deployment of frontend changes will be needed.
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
    <span>MyMquid — Dashboard Stats Fix</span>
    <span style="color:#f59e0b;font-weight:600">Backend action required</span>
  </div>`,
  footerTemplate: `<div style="width:100%;font-size:9px;font-family:sans-serif;padding:4px 40px;color:#94a3b8;display:flex;justify-content:space-between;box-sizing:border-box">
    <span>© 2026 MyMquid. Confidential — Backend Developer Reference.</span>
    <span class="pageNumber"></span>
  </div>`,
});

await browser.close();
console.log("✅ PDF generated:", OUT);
