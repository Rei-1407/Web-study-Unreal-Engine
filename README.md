# UE Học Tập — Web học Unreal Engine 5.6

Hệ thống web học & luyện tập **Unreal Engine 5.6** dùng nội bộ, dựng từ tài liệu
tham chiếu chuẩn. Mục tiêu: học có lộ trình, thực hành nhiều, và **thành thạo**
cách dùng Unreal Engine.

🔗 **Truy cập online:** https://rei-1407.github.io/Web-study-Unreal-Engine/

---

## Tính năng

- **Bảng điều khiển (Dashboard)** tạo động lực: vòng tiến độ, XP/level, chuỗi ngày
  học (streak), huy hiệu (achievements), tóm tắt TL;DR.
- **40 bài học** chia theo 10 nhóm A–J, đánh dấu hoàn thành, lưu bài, điều hướng
  trước/sau, link tự động tới bài tập liên quan.
- **Lộ trình học 3 giai đoạn** + phân module theo vai trò (Programmer, Artist,
  Tech Artist, Designer, Cinematic).
- **Bài tập thực hành** dạng checklist tương tác (tick từng đầu việc), kèm phần
  "nộp bài" và **Capstone** với rubric nghiệm thu.
- **Ôn tập (Flashcards)**: 12 câu hỏi lật thẻ, đánh dấu "đã thuộc / cần ôn lại".
- **Trạng thái tính năng** (Experimental/Beta/Production) — trang đọc bắt buộc.
- **Tra cứu nhanh**: phím tắt, naming convention, console commands, checklist
  project mới, glossary Anh–Việt.
- **Tìm kiếm toàn cục** (Ctrl+K), **theme sáng/tối**, lưu tiến độ trong trình duyệt.

> Tiến độ được lưu bằng `localStorage` của trình duyệt (theo từng máy/trình duyệt).

---

## Cấu trúc dự án

```
Unreal_Engine_5_6_..._v2.md      ← Tài liệu gốc (nguồn sự thật duy nhất)
scripts/build-content.mjs        ← Sinh nội dung bài học từ Markdown
assets/
  css/style.css                  ← Giao diện
  js/app.js                      ← Toàn bộ logic (router, tiến độ, gamification)
  data/content.js                ← TỰ SINH từ tài liệu (đừng sửa tay)
  data/learning.js               ← Bài tập, quiz, lộ trình (viết tay)
index.html                       ← Trang chính
```

---

## Cập nhật nội dung

Tài liệu Markdown ở gốc repo là **nguồn sự thật duy nhất**. Sau khi sửa nó:

```bash
npm install      # chỉ cần lần đầu
npm run build    # sinh lại assets/data/content.js
```

Rồi commit & push — GitHub Pages tự cập nhật.

Sửa **bài tập / quiz / lộ trình** thì chỉnh trực tiếp `assets/data/learning.js`.

---

## Chạy thử tại máy

Vì trang nạp dữ liệu qua thẻ `<script>` nên **mở trực tiếp `index.html` cũng chạy**.
Hoặc chạy một server tĩnh cho giống môi trường thật:

```bash
npm run serve    # http://localhost:5173
```

---

## Deploy

Đã cấu hình **GitHub Pages** phục vụ từ nhánh `main` (thư mục gốc). Mỗi lần
`git push` lên `main`, trang sẽ tự build lại sau ~1 phút.
