import fs from "fs";
import multer from "multer";
import path from "path";

const dir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); 
