/**
 * Media Center — Admin-only routes for managing Supabase Storage files.
 *
 * Features:
 *  - List files per folder, __all__ (aggregate), __trash__
 *  - Upload, Replace (in-place upsert), Move/Rename, Duplicate
 *  - Soft-delete (→ _trash/), Restore, Permanent delete
 *  - Image usage check across all DB tables
 */
import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { requireAdminKey } from "../lib/auth.js";
import { pool } from "../db/index.js";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const BUCKET = "darklightz-media";

/** All recognised folder paths — used when listing __all__ */
const KNOWN_FOLDERS = [
  "Hero Images", "Studio Story", "Portfolio", "Case Studies",
  "Journal", "Services", "Team", "Testimonials", "Client Logos",
  "SEO Images", "Invoices", "Documents", "Brand Assets", "uploads",
];

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL ?? "https://clhmisxqjinlcgmxhhsd.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

type StorageFile = {
  name: string; path: string; isFolder: boolean;
  size: number; mimetype: string; createdAt: string; updatedAt: string;
  publicUrl: string; folder: string;
};

async function listFolderFiles(
  supabase: ReturnType<typeof getSupabase>,
  folderPath: string,
): Promise<StorageFile[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folderPath || undefined, {
      limit: 500,
      sortBy: { column: "created_at", order: "desc" },
    });
  if (error) return [];
  return (data ?? []).map((item) => {
    const path = folderPath ? `${folderPath}/${item.name}` : item.name;
    const isFolder = item.id === null;
    let publicUrl = "";
    if (!isFolder) {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      publicUrl = urlData.publicUrl;
    }
    return {
      name: item.name,
      path,
      isFolder,
      size: item.metadata?.size ?? 0,
      mimetype: item.metadata?.mimetype ?? "",
      createdAt: item.created_at ?? "",
      updatedAt: item.updated_at ?? "",
      publicUrl,
      folder: folderPath || "root",
    };
  });
}

// ── List files ───────────────────────────────────────────────────────────────
// folder="" → root level items (including folder placeholders)
// folder="__all__" → all files across all known folders (no folders, no trash)
// folder="__trash__" → files in _trash/ prefix
// folder="<name>" → files in that specific folder

router.get("/admin/media", requireAdminKey, async (req, res): Promise<void> => {
  const folder = typeof req.query.folder === "string" ? req.query.folder : "__all__";

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(503).json({
      error: "SUPABASE_SERVICE_ROLE_KEY is not set in Vercel environment variables. Go to Vercel → Project → Settings → Environment Variables and add it, then redeploy.",
      configured: false,
    });
    return;
  }

  const supabase = getSupabase();

  try {
    if (folder === "__all__") {
      const results = await Promise.all([
        listFolderFiles(supabase, ""),
        ...KNOWN_FOLDERS.map((f) => listFolderFiles(supabase, f)),
      ]);
      const allFiles = results
        .flat()
        .filter((f) => !f.isFolder && !f.path.startsWith("_trash/"));
      res.json({ folder, files: allFiles });
    } else if (folder === "__trash__") {
      const files = (await listFolderFiles(supabase, "_trash")).filter((f) => !f.isFolder);
      res.json({ folder, files });
    } else {
      const files = await listFolderFiles(supabase, folder);
      res.json({ folder, files });
    }
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

// ── Upload ───────────────────────────────────────────────────────────────────

router.post("/admin/media/upload", requireAdminKey, upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: "No file provided" }); return; }

  const folder = typeof req.body.folder === "string" && req.body.folder.trim()
    ? req.body.folder.trim()
    : "uploads";

  const supabase = getSupabase();
  const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  res.json({ url: data.publicUrl, path: filename, name: safeName });
});

// ── Replace in-place (same path, preserves all DB references) ────────────────

router.post("/admin/media/replace", requireAdminKey, upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: "No file provided" }); return; }
  const { path: filePath } = req.body as { path?: string };
  if (!filePath) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  // Append cache-buster so browsers immediately show the new image
  res.json({ ok: true, url: `${data.publicUrl}?v=${Date.now()}`, path: filePath });
});

// ── Soft-delete → _trash/ ────────────────────────────────────────────────────

router.post("/admin/media/trash", requireAdminKey, async (req, res): Promise<void> => {
  const { path: filePath } = req.body as { path?: string };
  if (!filePath) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const trashPath = `_trash/${filePath}`;
  const { error } = await supabase.storage.from(BUCKET).move(filePath, trashPath);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ ok: true, trashPath });
});

// ── Restore from trash ───────────────────────────────────────────────────────

router.post("/admin/media/restore", requireAdminKey, async (req, res): Promise<void> => {
  const { path: trashPath } = req.body as { path?: string };
  if (!trashPath) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const originalPath = trashPath.replace(/^_trash\//, "");
  const { error } = await supabase.storage.from(BUCKET).move(trashPath, originalPath);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ ok: true, originalPath });
});

// ── Permanent delete ─────────────────────────────────────────────────────────

router.delete("/admin/media", requireAdminKey, async (req, res): Promise<void> => {
  const { path } = req.body as { path?: string };
  if (!path) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ ok: true });
});

// ── Move / Rename ─────────────────────────────────────────────────────────────

router.post("/admin/media/move", requireAdminKey, async (req, res): Promise<void> => {
  const { from, to } = req.body as { from?: string; to?: string };
  if (!from || !to) { res.status(400).json({ error: "from and to are required" }); return; }

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).move(from, to);
  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(to);
  res.json({ ok: true, publicUrl: data.publicUrl });
});

// ── Duplicate ─────────────────────────────────────────────────────────────────

router.post("/admin/media/duplicate", requireAdminKey, async (req, res): Promise<void> => {
  const { path: srcPath } = req.body as { path?: string };
  if (!srcPath) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const { data: fileData, error: dlErr } = await supabase.storage.from(BUCKET).download(srcPath);
  if (dlErr || !fileData) { res.status(500).json({ error: dlErr?.message ?? "Download failed" }); return; }

  const parts = srcPath.split("/");
  const filename = parts[parts.length - 1];
  const folder = parts.slice(0, -1).join("/");
  const newPath = folder
    ? `${folder}/copy-${Date.now()}-${filename}`
    : `copy-${Date.now()}-${filename}`;

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, buffer, {
    contentType: fileData.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) { res.status(500).json({ error: upErr.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
  res.json({ ok: true, path: newPath, url: data.publicUrl, name: `copy-${filename}` });
});

// ── Image usage across all DB tables ─────────────────────────────────────────
// Returns which content records reference this image URL so the admin can see
// before deleting, and so they know what will break.

router.get("/admin/media/usage", requireAdminKey, async (req, res): Promise<void> => {
  const url = typeof req.query.url === "string" ? req.query.url : "";
  if (!url) { res.status(400).json({ error: "url is required" }); return; }

  // Strip cache-buster query params for comparison
  const cleanUrl = url.split("?")[0];

  type Usage = { table: string; id: number; label: string; section: string };
  const usages: Usage[] = [];

  async function check(table: string, urlCol: string, labelCol: string, section: string) {
    try {
      // Match both the raw URL and URL with cache-buster prefix
      const r = await pool.query(
        `SELECT id, ${labelCol} AS label FROM ${table}
         WHERE split_part(${urlCol}, '?', 1) = $1 LIMIT 20`,
        [cleanUrl],
      );
      for (const row of r.rows) {
        usages.push({ table, id: Number(row.id), label: String(row.label ?? "—"), section });
      }
    } catch { /* table may not exist yet — skip */ }
  }

  await Promise.all([
    check("portfolio_projects", "image_url",      "title",     "Portfolio"),
    check("case_studies",       "image_url",      "title",     "Case Studies"),
    check("blog_posts",         "cover_image_url","title",     "Journal"),
    check("testimonials",       "avatar_url",     "name",      "Testimonials"),
    check("team_members",       "avatar_url",     "name",      "Team"),
    check("clients",            "logo_url",       "name",      "Clients"),
    check("site_settings",      "logo_url",       "id::text",  "Site Settings — Logo"),
    check("site_settings",      "og_image_url",   "id::text",  "Site Settings — OG Image"),
    check("site_settings",      "favicon_url",    "id::text",  "Site Settings — Favicon"),
  ]);

  res.json({ url: cleanUrl, usages });
});

export default router;
