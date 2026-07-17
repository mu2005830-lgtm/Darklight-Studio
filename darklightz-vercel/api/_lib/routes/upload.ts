import { Router, type IRouter } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { requireAdminKey } from "../lib/auth.js";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/admin/upload", requireAdminKey, upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: "No file provided" }); return; }
  const supabase = createClient(
    "https://clhmisxqjinlcgmxhhsd.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const ext = req.file.originalname.split(".").pop() ?? "jpg";
  const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("darklightz-media")
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });
  if (error) { res.status(500).json({ error: error.message }); return; }
  const { data } = supabase.storage.from("darklightz-media").getPublicUrl(filename);
  res.json({ url: data.publicUrl });
});

export default router;
