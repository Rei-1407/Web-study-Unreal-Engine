// Gom các file tĩnh vào thư mục dist/ để Cloudflare Pages (hoặc host tĩnh bất kỳ)
// publish. Chạy sau build-content.mjs. Xem npm script "build:pages".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// index.html + toàn bộ thư mục assets
fs.copyFileSync(path.join(ROOT, "index.html"), path.join(DIST, "index.html"));
fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });

// kèm tài liệu Markdown gốc (tiện tra cứu, không bắt buộc cho web chạy)
for (const f of fs.readdirSync(ROOT)) {
  if (f.toLowerCase().endsWith(".md") && f.toLowerCase() !== "readme.md") {
    fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
  }
}

console.log("✔ Đã gom site tĩnh vào dist/ (sẵn sàng cho Cloudflare Pages).");
