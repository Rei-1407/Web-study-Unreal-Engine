// Build script: chuyển tài liệu Markdown chuẩn thành dữ liệu bài học có cấu trúc.
// Chạy: npm run build
// Đầu ra: assets/data/content.js  (gán vào window.UE_CONTENT)
//
// Nguồn sự thật (single source of truth) là file .md ở gốc repo. Mỗi lần cập
// nhật tài liệu, chạy lại `npm run build` để sinh lại nội dung web.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE = path.join(ROOT, "Unreal_Engine_5_6_Tai_lieu_tham_chieu_Game_3D_v2.md");
const OUT = path.join(ROOT, "assets", "data", "content.js");

marked.setOptions({ mangle: false, headerIds: false, gfm: true, breaks: false });

// Chuẩn hoá heading về dạng slug kiểu GitHub để đối chiếu anchor nội bộ.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const raw = fs.readFileSync(SOURCE, "utf8");
const lines = raw.split(/\r?\n/);

let docTitle = "Unreal Engine 5.6";
const introLines = [];
let tldrLines = [];
const groups = []; // { letter, name, lessons: [] }
const appendix = []; // { title, slug, md, html }
let referencesMd = "";
let changelogMd = "";

// Trạng thái máy phân tích
let mode = "intro"; // intro | toc | tldr | group | appendix | references | changelog
let curGroup = null;
let curLesson = null;
let curAppendix = null;

function pushLessonLine(line) {
  if (curLesson) curLesson._md.push(line);
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Tiêu đề tài liệu
  const h1 = line.match(/^#\s+(.+)$/);
  if (h1) {
    docTitle = h1[1].trim();
    continue;
  }

  const h2 = line.match(/^##\s+(.+)$/);
  if (h2) {
    const title = h2[1].trim();
    curLesson = null;
    curAppendix = null;
    if (/^Mục lục/i.test(title)) {
      mode = "toc";
    } else if (/Tóm tắt nhanh/i.test(title)) {
      mode = "tldr";
      tldrLines = [];
    } else if (/^NHÓM\s+([A-Z])/i.test(title)) {
      mode = "group";
      const m = title.match(/^NHÓM\s+([A-Z])\s*[—-]\s*(.+)$/);
      curGroup = {
        letter: m ? m[1] : title,
        name: m ? m[2].trim() : title,
        lessons: [],
      };
      groups.push(curGroup);
    } else if (/^Phụ lục/i.test(title)) {
      mode = "appendix";
    } else if (/^Nguồn tham khảo/i.test(title)) {
      mode = "references";
    } else {
      mode = "other";
    }
    continue;
  }

  const h3 = line.match(/^###\s+(.+)$/);
  if (h3) {
    const title = h3[1].trim();
    if (mode === "group" && curGroup) {
      const m = title.match(/^(\d+)\.\s*(.+)$/);
      curLesson = {
        num: m ? parseInt(m[1], 10) : null,
        title: m ? m[2].trim() : title,
        rawTitle: title,
        slug: slugify(title),
        groupLetter: curGroup.letter,
        groupName: curGroup.name,
        _md: [],
      };
      curGroup.lessons.push(curLesson);
      continue;
    }
    if (mode === "appendix") {
      curAppendix = { title, slug: slugify(title), _md: [] };
      appendix.push(curAppendix);
      continue;
    }
  }

  // Bỏ qua đường kẻ ngang phân tách
  const isHr = /^---\s*$/.test(line);

  switch (mode) {
    case "intro":
      if (!isHr) introLines.push(line);
      break;
    case "tldr":
      tldrLines.push(line);
      break;
    case "group":
      if (!isHr) pushLessonLine(line);
      break;
    case "appendix":
      if (curAppendix && !isHr) curAppendix._md.push(line);
      break;
    case "references":
      if (!isHr) referencesMd += line + "\n";
      break;
    default:
      // Changelog nằm cuối, ngoài mọi ## heading — bắt bằng marker in đậm
      if (/^\*\*Changelog\*\*/.test(line)) {
        mode = "changelog";
        changelogMd += line + "\n";
      } else if (mode === "changelog") {
        changelogMd += line + "\n";
      }
      break;
  }
}

function render(mdArrOrStr) {
  const md = Array.isArray(mdArrOrStr) ? mdArrOrStr.join("\n") : mdArrOrStr;
  return marked.parse(md.trim());
}

// Làm sạch text trong ô bảng (bỏ định dạng markdown) để làm nội dung thẻ ôn tập.
function cleanCell(s) {
  return s
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Trích bảng markdown ĐẦU TIÊN trong một mảng dòng → { headers, rows }.
function parseTable(mdLines) {
  for (let i = 0; i < mdLines.length - 1; i++) {
    const head = mdLines[i].trim();
    const sep = (mdLines[i + 1] || "").trim();
    const isRow = head.startsWith("|");
    const isSep = /^\|?[\s:|-]*-[\s:|-]*\|?$/.test(sep) && sep.includes("-");
    if (isRow && isSep) {
      const cells = (line) =>
        line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => cleanCell(c));
      const headers = cells(head);
      const rows = [];
      for (let j = i + 2; j < mdLines.length; j++) {
        const ln = mdLines[j].trim();
        if (!ln.startsWith("|")) break;
        const r = cells(ln);
        if (r.some((c) => c.length)) rows.push(r);
      }
      return { headers, rows };
    }
  }
  return null;
}

// Dựng đối tượng đầu ra
const outGroups = groups.map((g) => ({
  letter: g.letter,
  name: g.name,
  lessons: g.lessons.map((l) => ({
    num: l.num,
    title: l.title,
    slug: l.slug,
    groupLetter: l.groupLetter,
    groupName: l.groupName,
    html: render(l._md),
    // text thuần để phục vụ tìm kiếm
    text: l._md.join(" ").replace(/[#>*`|_-]/g, " ").replace(/\s+/g, " ").trim(),
  })),
}));

const outAppendix = appendix.map((a) => ({
  title: a.title,
  slug: a.slug,
  html: render(a._md),
  table: parseTable(a._md), // {headers, rows} hoặc null — dùng cho thẻ ôn tập
}));

const lessonCount = outGroups.reduce((n, g) => n + g.lessons.length, 0);

const payload = {
  title: docTitle,
  intro: render(introLines),
  tldr: render(tldrLines),
  groups: outGroups,
  appendix: outAppendix,
  references: render(referencesMd),
  changelog: render(changelogMd),
  meta: {
    lessonCount,
    groupCount: outGroups.length,
    generatedAt: new Date().toISOString(),
    sourceFile: path.basename(SOURCE),
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const banner =
  "/* TỰ ĐỘNG SINH RA từ tài liệu Markdown bởi scripts/build-content.mjs — ĐỪNG sửa tay. */\n";
fs.writeFileSync(OUT, banner + "window.UE_CONTENT = " + JSON.stringify(payload) + ";\n", "utf8");

console.log(
  `✔ Đã sinh ${path.relative(ROOT, OUT)} — ${outGroups.length} nhóm, ${lessonCount} bài học, ${outAppendix.length} mục phụ lục.`
);
