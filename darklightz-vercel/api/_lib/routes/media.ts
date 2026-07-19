/**
 * Media Center — Admin-only routes for managing Supabase Storage files.
 */
import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { requireAdminKey } from "../lib/auth.js";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const BUCKET = "darklightz-media";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL ?? "https://clhmisxqjinlcgmxhhsd.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── List files in a folder ────────────────────────────────────────────────

router.get("/admin/media", requireAdminKey, async (req, res): Promise<void> => {
  const folder = typeof req.query.folder === "string" ? req.query.folder : "";
  const supabase = getSupabase();

  const { data, error } = await supabase.storage.from(BUCKET).list(folder || undefined, {
    limit: 500,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) { res.status(500).json({ error: error.message }); return; }

  // Separate folders (items with no metadata = folder placeholders) from files
  const files = (data ?? []).map((item) => {
    const path = folder ? `${folder}/${item.name}` : item.name;
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
    };
  });

  res.json({ folder, files });
});

// ── Upload a file to a folder ─────────────────────────────────────────────

router.post("/admin/media/upload", requireAdminKey, upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: "No file provided" }); return; }

  const folder = typeof req.body.folder === "string" && req.body.folder.trim()
    ? req.body.folder.trim()
    : "uploads";

  const supabase = getSupabase();
  const ext = req.file.originalname.split(".").pop() ?? "bin";
  const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  res.json({ url: data.publicUrl, path: filename, name: safeName });
});

// ── Delete a file ─────────────────────────────────────────────────────────

router.delete("/admin/media", requireAdminKey, async (req, res): Promise<void> => {
  const { path } = req.body as { path?: string };
  if (!path) { res.status(400).json({ error: "path is required" }); return; }

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ ok: true });
});

// ── Move / rename a file ──────────────────────────────────────────────────

router.post("/admin/media/move", requireAdminKey, async (req, res): Promise<void> => {
  const { from, to } = req.body as { from?: string; to?: string };
  if (!from || !to) { res.status(400).json({ error: "from and to are required" }); return; }

  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).move(from, to);
  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(to);
  res.json({ ok: true, publicUrl: data.publicUrl });
});

export default router;
