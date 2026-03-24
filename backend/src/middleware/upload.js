const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadRoot = path.join(__dirname, "..", "..", "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(uploadRoot);

function makeUploader(subdir, options = {}) {
  const maxSizeMb = options.maxSizeMb ?? 5;
  const maxCount = options.maxCount ?? 5;
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dir = path.join(uploadRoot, subdir);
      ensureDir(dir);
      cb(null, dir);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname || "") || "";
      const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, base + ext);
    },
  });
  return multer({
    storage,
    limits: { fileSize: maxSizeMb * 1024 * 1024, files: maxCount },
  });
}

module.exports = { uploadRoot, makeUploader };
