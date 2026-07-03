/* ============================================================
   UE Học Tập — app.js  (vanilla, không framework)
   Router hash-based + tiến độ lưu localStorage + gamification.
   ============================================================ */
(function () {
  "use strict";

  const C = window.UE_CONTENT;
  const L = window.UE_LEARNING;
  if (!C) { document.getElementById("view").innerHTML = "<p style='padding:40px'>Không tải được nội dung. Hãy chạy <code>npm run build</code>.</p>"; return; }

  // Danh sách phẳng mọi bài học để điều hướng prev/next & tra cứu nhanh
  const LESSONS = [];
  C.groups.forEach((g) => g.lessons.forEach((l) => LESSONS.push(l)));
  const lessonByNum = {};
  LESSONS.forEach((l) => (lessonByNum[l.num] = l));

  // ─────────────────────── KHO THẺ ÔN TẬP (SRS) ───────────────────────
  // Dựng từ các bảng trong Phụ lục + bộ câu hỏi ôn tập. Không tạo nội dung mới.
  function buildDecks() {
    const decks = [];
    (C.appendix || []).forEach((a) => {
      if (!a.table || !a.table.rows.length) return;
      let cfg = null;
      if (/thuật ngữ|glossary/i.test(a.title))
        cfg = { id: "gloss", name: "Thuật ngữ (Glossary)", icon: "📖", frontCol: 0, backCol: 1, prompt: "Thuật ngữ này nghĩa là gì?", mc: true, mcReverse: true, backMono: false, mcOptionMono: false };
      else if (/đặt tên|naming/i.test(a.title))
        cfg = { id: "naming", name: "Quy ước đặt tên", icon: "🏷️", frontCol: 1, backCol: 0, prompt: "Tiền tố đặt tên đúng là gì?", mc: true, mcReverse: false, backMono: true, mcOptionMono: true };
      else if (/console|command/i.test(a.title))
        cfg = { id: "cmd", name: "Console / stat commands", icon: "⌨️", frontCol: 1, backCol: 0, prompt: "Dùng lệnh nào để làm việc này?", mc: true, mcReverse: false, backMono: true, mcOptionMono: true };
      else if (/phím tắt/i.test(a.title))
        cfg = { id: "keys", name: "Phím tắt Editor", icon: "🎹", frontCol: 1, backCol: 0, prompt: "Phím tắt nào?", mc: true, mcReverse: false, backMono: true, mcOptionMono: true };
      if (!cfg) return;
      cfg.cards = a.table.rows
        .filter((r) => (r[cfg.frontCol] || "").trim() && (r[cfg.backCol] || "").trim())
        .map((r, i) => ({ id: cfg.id + ":" + i, deck: cfg.id, front: r[cfg.frontCol], back: r[cfg.backCol], prompt: cfg.prompt, backMono: cfg.backMono }));
      decks.push(cfg);
    });
    // Bộ câu hỏi ôn tập (chỉ lật thẻ, không trắc nghiệm vì đáp án dài)
    decks.push({
      id: "quiz", name: "Câu hỏi ôn tập", icon: "🧠", mc: false,
      cards: L.quiz.map((q, i) => ({ id: "quiz:" + i, deck: "quiz", front: q.q, back: q.a, prompt: "Trả lời câu hỏi:", lesson: q.lesson })),
    });
    return decks;
  }
  const DECKS = buildDecks();
  const deckById = {};
  const ALL_CARDS = [];
  const cardById = {};
  DECKS.forEach((d) => { deckById[d.id] = d; d.cards.forEach((c) => { ALL_CARDS.push(c); cardById[c.id] = c; }); });

  const SRS_INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60]; // ngày theo box; box>=5 coi như "đã thuộc"
  const NEW_PER_DAY = 15;
  const MASTER_BOX = 5;

  function addDays(dateStr, n) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }
  function resetNewCounter() {
    const t = todayStr();
    if (S.srs.newTodayDate !== t) { S.srs.newTodayDate = t; S.srs.newToday = 0; }
  }
  function srsStats(deckFilter) {
    resetNewCounter();
    const t = todayStr();
    const pool = ALL_CARDS.filter((c) => !deckFilter || deckFilter.indexOf(c.deck) >= 0);
    let seen = 0, dueSeen = 0, mastered = 0, newUnseen = 0;
    pool.forEach((c) => {
      const s = S.srs.cards[c.id];
      if (s) { seen++; if (s.due <= t) dueSeen++; if (s.box >= MASTER_BOX) mastered++; }
      else newUnseen++;
    });
    const newAvail = deckFilter
      ? Math.min(newUnseen, Math.max(0, NEW_PER_DAY - S.srs.newToday))
      : Math.min(newUnseen, Math.max(0, NEW_PER_DAY - S.srs.newToday));
    return { total: pool.length, seen, dueSeen, mastered, newUnseen, newAvail, due: dueSeen + newAvail };
  }
  function buildSessionCards(deckFilter, limit) {
    resetNewCounter();
    const t = todayStr();
    const pool = ALL_CARDS.filter((c) => !deckFilter || deckFilter.indexOf(c.deck) >= 0);
    const due = shuffle(pool.filter((c) => { const s = S.srs.cards[c.id]; return s && s.due <= t; }));
    const remainingNew = Math.max(0, NEW_PER_DAY - S.srs.newToday);
    const news = shuffle(pool.filter((c) => !S.srs.cards[c.id])).slice(0, remainingNew);
    let list = due.concat(news);
    if (limit && list.length > limit) list = list.slice(0, limit);
    return shuffle(list);
  }
  function markPracticeDay() {
    const t = todayStr();
    if (S.srs.lastPracticeDay === t) return;
    if (S.srs.lastPracticeDay) {
      const d = daysBetween(S.srs.lastPracticeDay, t);
      S.srs.dailyStreak = d === 1 ? S.srs.dailyStreak + 1 : 1;
    } else S.srs.dailyStreak = 1;
    S.srs.lastPracticeDay = t;
  }
  // grade: 'again' | 'good' | 'easy' → trả về XP thưởng
  function gradeCard(id, grade) {
    resetNewCounter();
    const t = todayStr();
    let s = S.srs.cards[id];
    if (!s) { s = { box: 0, due: t, reps: 0, lapses: 0 }; S.srs.cards[id] = s; S.srs.newToday++; }
    if (grade === "again") { s.box = 1; s.lapses++; s.due = t; }
    else if (grade === "good") { s.box = Math.min(Math.max(s.box + 1, 1), SRS_INTERVALS.length - 1); s.due = addDays(t, SRS_INTERVALS[s.box]); }
    else if (grade === "easy") { s.box = Math.min(Math.max(s.box + 2, 2), SRS_INTERVALS.length - 1); s.due = addDays(t, SRS_INTERVALS[s.box]); }
    s.reps++;
    S.srs.history[t] = (S.srs.history[t] || 0) + 1;
    markPracticeDay();
    const gained = grade === "easy" ? 8 : grade === "good" ? 6 : 2;
    addXp(gained);
    return gained;
  }
  function masteredCount() { return ALL_CARDS.filter((c) => { const s = S.srs.cards[c.id]; return s && s.box >= MASTER_BOX; }).length; }
  // Sinh dữ liệu trắc nghiệm cho một thẻ
  function makeMC(card) {
    const deck = deckById[card.deck];
    const reverse = !!deck.mcReverse;
    const stem = reverse ? card.back : card.front;
    const correct = reverse ? card.front : card.back;
    const poolVals = deck.cards.map((c) => (reverse ? c.front : c.back)).filter((v) => v && v !== correct);
    const uniq = shuffle([...new Set(poolVals)]).slice(0, 3);
    return { stem, correct, options: shuffle([correct, ...uniq]), mono: !!deck.mcOptionMono };
  }

  // ─────────────────────────── STATE ───────────────────────────
  const PKEY = "ue_study_progress_v1";
  const defaultState = {
    completed: {},      // {lessonNum: true}
    bookmarks: {},      // {lessonNum: true}
    exTasks: {},        // {"A:0": true}
    exAdv: {},          // {"C:0": true}
    capTasks: {},       // {"0": true}
    quiz: {},           // {qIndex: "known"|"review"}
    xp: 0,
    streak: 0,
    lastActive: null,   // "YYYY-MM-DD"
    lastLesson: null,
    achievements: {},   // {id: true}
    theme: "dark",
    collapsedGroups: {},
    srs: {              // spaced repetition (luyện tập hàng ngày)
      cards: {},        // cardId -> {box, due:"YYYY-MM-DD", reps, lapses}
      dailyStreak: 0,
      lastPracticeDay: null,
      newToday: 0,
      newTodayDate: null,
      history: {},      // "YYYY-MM-DD" -> số thẻ đã ôn
    },
  };
  let S = load();

  function load() {
    const base = JSON.parse(JSON.stringify(defaultState));
    try {
      const raw = localStorage.getItem(PKEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(base, parsed);
        base.srs = Object.assign(JSON.parse(JSON.stringify(defaultState.srs)), parsed.srs || {});
      }
    } catch (e) {}
    return base;
  }
  function save() {
    try { localStorage.setItem(PKEY, JSON.stringify(S)); } catch (e) {}
  }

  // ─────────────────────────── XP / LEVEL ───────────────────────────
  const XP = { lesson: 50, task: 20, quizKnown: 12, achievement: 100 };
  // Ngưỡng level: level n cần tổng XP tăng dần
  function levelFromXp(xp) {
    let lvl = 1, need = 300, acc = 0;
    while (xp >= acc + need) { acc += need; lvl++; need = Math.round(need * 1.35); }
    return { level: lvl, into: xp - acc, need, floor: acc };
  }
  function addXp(n) { S.xp = Math.max(0, S.xp + n); }

  // ─────────────────────────── STREAK ───────────────────────────
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysBetween(a, b) {
    const da = new Date(a + "T00:00:00"), db = new Date(b + "T00:00:00");
    return Math.round((db - da) / 86400000);
  }
  function touchStreak() {
    const t = todayStr();
    if (S.lastActive === t) return;
    if (S.lastActive) {
      const diff = daysBetween(S.lastActive, t);
      if (diff === 1) S.streak += 1;
      else if (diff > 1) S.streak = 1;
    } else {
      S.streak = 1;
    }
    S.lastActive = t;
    save();
  }

  // ─────────────────────────── ACHIEVEMENTS ───────────────────────────
  const ACHIEVEMENTS = [
    { id: "first", ico: "🚀", name: "Khởi động", test: () => countDone() >= 1 },
    { id: "phase1", ico: "🧱", name: "Nền tảng vững", test: () => L.roadmap[0].lessons.every((n) => S.completed[n]) },
    { id: "half", ico: "⚡", name: "Nửa chặng đường", test: () => countDone() >= Math.ceil(LESSONS.length / 2) },
    { id: "allLessons", ico: "📚", name: "Đọc trọn tài liệu", test: () => countDone() >= LESSONS.length },
    { id: "streak3", ico: "🔥", name: "Chuyên cần 3 ngày", test: () => S.streak >= 3 },
    { id: "streak7", ico: "🏅", name: "Bền bỉ 7 ngày", test: () => S.streak >= 7 },
    { id: "firstEx", ico: "🛠️", name: "Thợ thực hành", test: () => L.exercises.some((e) => exDone(e) === exTotal(e) && exTotal(e) > 0) },
    { id: "allEx", ico: "⚙️", name: "Cày hết bài tập", test: () => L.exercises.every((e) => exDone(e) === exTotal(e)) },
    { id: "quizAll", ico: "🧠", name: "Ôn tập kỹ", test: () => L.quiz.every((_, i) => S.quiz[i] === "known") },
    { id: "capstone", ico: "🏆", name: "Về đích Capstone", test: () => L.capstone.tasks.every((_, i) => S.capTasks[i]) },
    { id: "srsStart", ico: "📅", name: "Luyện tập lần đầu", test: () => Object.keys(S.srs.cards).length >= 1 },
    { id: "srs7", ico: "📆", name: "Ôn 7 ngày liền", test: () => S.srs.dailyStreak >= 7 },
    { id: "master30", ico: "💎", name: "Thuộc 30 thẻ", test: () => masteredCount() >= 30 },
    { id: "masterAll", ico: "👑", name: "Thuộc trọn tài liệu", test: () => ALL_CARDS.length > 0 && masteredCount() >= ALL_CARDS.length },
  ];
  function checkAchievements() {
    const newly = [];
    ACHIEVEMENTS.forEach((a) => {
      if (!S.achievements[a.id] && a.test()) {
        S.achievements[a.id] = true;
        addXp(XP.achievement);
        newly.push(a);
      }
    });
    if (newly.length) { save(); newly.forEach((a) => toast(`Mở khóa huy hiệu: ${a.name}`, a.ico)); }
  }

  // ─────────────────────────── HELPERS ───────────────────────────
  function countDone() { return Object.keys(S.completed).filter((k) => S.completed[k]).length; }
  function exTotal(e) { return e.tasks.length + (e.advanced ? e.advanced.length : 0); }
  function exDone(e) {
    let n = 0;
    e.tasks.forEach((_, i) => { if (S.exTasks[e.module + ":" + i]) n++; });
    if (e.advanced) e.advanced.forEach((_, i) => { if (S.exAdv[e.module + ":" + i]) n++; });
    return n;
  }
  function overallPct() { return Math.round((countDone() / LESSONS.length) * 100); }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ─────────────────────────── TOAST ───────────────────────────
  let toastTimer;
  function toast(msg, ico = "✅") {
    const el = document.getElementById("toast");
    el.innerHTML = `<span class="toast-ico">${ico}</span><span>${esc(msg)}</span>`;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // ─────────────────────────── ACTIONS ───────────────────────────
  function toggleLesson(num) {
    if (S.completed[num]) { delete S.completed[num]; addXp(-XP.lesson); }
    else { S.completed[num] = true; addXp(XP.lesson); touchStreak(); toast("Hoàn thành bài học! +" + XP.lesson + " XP", "🎉"); }
    save(); checkAchievements(); afterProgressChange();
  }
  function toggleBookmark(num) {
    if (S.bookmarks[num]) delete S.bookmarks[num]; else S.bookmarks[num] = true;
    save();
  }
  function toggleTask(mod, i, adv) {
    const store = adv ? S.exAdv : S.exTasks;
    const key = mod + ":" + i;
    if (store[key]) { delete store[key]; addXp(-XP.task); }
    else { store[key] = true; addXp(XP.task); touchStreak(); }
    save(); checkAchievements(); afterProgressChange();
  }
  function toggleCap(i) {
    if (S.capTasks[i]) { delete S.capTasks[i]; addXp(-XP.task); }
    else { S.capTasks[i] = true; addXp(XP.task); touchStreak(); }
    save(); checkAchievements(); afterProgressChange();
  }
  function setQuiz(i, val) {
    const prev = S.quiz[i];
    S.quiz[i] = val;
    if (val === "known" && prev !== "known") { addXp(XP.quizKnown); touchStreak(); }
    if (val !== "known" && prev === "known") addXp(-XP.quizKnown);
    save(); checkAchievements();
  }

  function afterProgressChange() {
    renderSidebar();
    updateTopbar();
    // Re-render trang hiện tại để cập nhật tiến độ hiển thị
    route(true);
  }

  // ─────────────────────────── TOPBAR ───────────────────────────
  function updateTopbar() {
    const lv = levelFromXp(S.xp);
    document.getElementById("xpLevel").textContent = "Lv." + lv.level;
    document.getElementById("xpNum").textContent = S.xp + " XP";
    document.getElementById("streakCount").textContent = S.streak;
    const pct = overallPct();
    document.getElementById("sideProgressFill").style.width = pct + "%";
    document.getElementById("sideProgressText").textContent = pct + "%";
  }

  // ─────────────────────────── SIDEBAR ───────────────────────────
  const PRIMARY = [
    { hash: "#/", ico: "🏠", label: "Bảng điều khiển" },
    { hash: "#/practice", ico: "📅", label: "Luyện tập hàng ngày" },
    { hash: "#/roadmap", ico: "🗺️", label: "Lộ trình học" },
    { hash: "#/exercises", ico: "🎯", label: "Bài tập thực hành" },
    { hash: "#/quiz", ico: "🧠", label: "Ôn tập (Quiz)" },
    { hash: "#/status", ico: "⚠️", label: "Trạng thái tính năng" },
    { hash: "#/cheatsheet", ico: "📌", label: "Tra cứu nhanh" },
  ];

  function renderSidebar() {
    const cur = location.hash || "#/";
    // primary
    document.getElementById("navPrimary").innerHTML = PRIMARY.map((p) => {
      const active = (p.hash === "#/" && (cur === "#/" || cur === "")) || (p.hash !== "#/" && cur.startsWith(p.hash));
      return `<a href="${p.hash}" class="${active ? "active" : ""}"><span class="nav-ico">${p.ico}</span>${p.label}</a>`;
    }).join("");

    // modules
    const curLessonNum = cur.startsWith("#/lesson/") ? parseInt(cur.split("/")[2], 10) : null;
    document.getElementById("navModules").innerHTML = C.groups.map((g) => {
      const done = g.lessons.filter((l) => S.completed[l.num]).length;
      const collapsed = S.collapsedGroups[g.letter] ? "collapsed" : "";
      const lessons = g.lessons.map((l) => {
        const isDone = !!S.completed[l.num];
        const active = l.num === curLessonNum ? "active" : "";
        return `<a href="#/lesson/${l.num}" class="lesson-link ${isDone ? "done" : ""} ${active}">
          <span class="lesson-num">${l.num}</span>
          <span class="lesson-title-s">${esc(l.title)}</span>
          <span class="lesson-check">✓</span>
        </a>`;
      }).join("");
      return `<div class="mod-group ${collapsed}" data-g="${g.letter}">
        <div class="mod-head" data-toggle="${g.letter}">
          <span class="mod-letter">${g.letter}</span>
          <span class="mod-title">${esc(g.name)}</span>
          <span class="mod-count">${done}/${g.lessons.length}</span>
          <span class="mod-caret">▼</span>
        </div>
        <div class="mod-lessons">${lessons}</div>
      </div>`;
    }).join("");

    // gắn sự kiện thu gọn nhóm
    document.querySelectorAll(".mod-head").forEach((h) => {
      h.addEventListener("click", (e) => {
        if (e.target.closest(".lesson-link")) return;
        const g = h.getAttribute("data-toggle");
        S.collapsedGroups[g] = !S.collapsedGroups[g];
        save();
        h.parentElement.classList.toggle("collapsed");
      });
    });
  }

  // ══════════════════════════ VIEWS ══════════════════════════
  const view = document.getElementById("view");

  // ---------- DASHBOARD ----------
  function renderDashboard() {
    const pct = overallPct();
    const done = countDone();
    const lv = levelFromXp(S.xp);
    const exDoneCount = L.exercises.reduce((n, e) => n + exDone(e), 0);
    const exTotalCount = L.exercises.reduce((n, e) => n + exTotal(e), 0);
    const quizKnown = L.quiz.filter((_, i) => S.quiz[i] === "known").length;
    const resume = S.lastLesson && lessonByNum[S.lastLesson] ? lessonByNum[S.lastLesson] : LESSONS[0];
    const nextUndone = LESSONS.find((l) => !S.completed[l.num]);
    const cta = nextUndone || resume;

    const sps = srsStats(null);
    const practiceBanner = `<a href="#/practice" class="practice-banner ${sps.due > 0 ? "active" : "calm"}">
      <span class="pb-ico">${sps.due > 0 ? "📅" : "✅"}</span>
      <div class="pb-text">
        <strong>${sps.due > 0 ? "Có " + sps.due + " thẻ cần ôn hôm nay" : "Hôm nay đã ôn xong!"}</strong>
        <small>Luyện tập hàng ngày · 🔥 chuỗi ${S.srs.dailyStreak} ngày · ${sps.mastered}/${sps.total} thẻ đã thuộc</small>
      </div>
      <span class="pb-cta">${sps.due > 0 ? "Ôn ngay →" : "Ôn thêm →"}</span>
    </a>`;

    const circ = 2 * Math.PI * 58;
    const dash = circ * (pct / 100);

    const phaseMini = L.roadmap.map((ph) => {
      const total = ph.lessons.length;
      const d = ph.lessons.filter((n) => S.completed[n]).length;
      const p = total ? Math.round((d / total) * 100) : 0;
      return `<div class="phase-row" data-nav="#/roadmap">
        <div class="phase-badge" style="background:${ph.color}">${ph.phase}</div>
        <div class="phase-info"><strong>${esc(ph.title)}</strong><small>${ph.weeks} · ${d}/${total} bài</small></div>
        <div class="phase-bar"><span style="width:${p}%;background:${ph.color}"></span></div>
        <div class="phase-pct">${p}%</div>
      </div>`;
    }).join("");

    const achHtml = ACHIEVEMENTS.map((a) => {
      const un = S.achievements[a.id];
      return `<div class="ach ${un ? "unlocked" : "locked"}" title="${esc(a.name)}">
        <div class="ach-ico">${a.ico}</div><div class="ach-name">${esc(a.name)}</div></div>`;
    }).join("");

    view.innerHTML = `<div class="page">
      <div class="hero">
        <div class="hero-text">
          <h1>Chào mừng trở lại 👋</h1>
          <p>Học và luyện tập Unreal Engine 5.6 theo lộ trình có hệ thống. Mỗi bài hoàn thành, mỗi bài tập nộp được là một bước tiến tới thành thạo.</p>
          <div class="hero-actions">
            <a href="#/lesson/${cta.num}" class="btn btn-primary btn-lg">${done === 0 ? "▶ Bắt đầu học" : "▶ Tiếp tục: Bài " + cta.num}</a>
            <a href="#/roadmap" class="btn btn-lg">🗺️ Xem lộ trình</a>
          </div>
        </div>
        <div class="ring-wrap">
          <div class="ring">
            <svg width="132" height="132">
              <circle cx="66" cy="66" r="58" fill="none" stroke="var(--panel-2)" stroke-width="11"/>
              <circle cx="66" cy="66" r="58" fill="none" stroke="url(#grad)" stroke-width="11" stroke-linecap="round"
                stroke-dasharray="${dash} ${circ}" />
              <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--success)"/>
              </linearGradient></defs>
            </svg>
            <div class="ring-txt"><div><div class="ring-pct">${pct}%</div><div class="ring-lbl">hoàn thành</div></div></div>
          </div>
        </div>
      </div>

      ${practiceBanner}

      <div class="stat-grid">
        <div class="stat"><div class="stat-ico">📖</div><div class="stat-val">${done}<span style="font-size:15px;color:var(--text-faint)">/${LESSONS.length}</span></div><div class="stat-lbl">Bài học hoàn thành</div></div>
        <div class="stat"><div class="stat-ico">🎯</div><div class="stat-val">${exDoneCount}<span style="font-size:15px;color:var(--text-faint)">/${exTotalCount}</span></div><div class="stat-lbl">Đầu việc bài tập</div></div>
        <div class="stat"><div class="stat-ico">🧠</div><div class="stat-val">${quizKnown}<span style="font-size:15px;color:var(--text-faint)">/${L.quiz.length}</span></div><div class="stat-lbl">Câu quiz đã thuộc</div></div>
        <div class="stat"><div class="stat-ico">🏆</div><div class="stat-val">Lv.${lv.level}</div><div class="stat-lbl">${S.xp} XP · còn ${lv.need - lv.into} XP lên cấp</div></div>
      </div>

      <div class="dash-cols">
        <div>
          <h2 class="section-title">🗺️ Lộ trình theo giai đoạn <a href="#/roadmap" class="see-all">Chi tiết →</a></h2>
          <div class="phase-mini">${phaseMini}</div>

          <h2 class="section-title" style="margin-top:26px">⚡ Tóm tắt nhanh (TL;DR)</h2>
          <div class="tldr-box reading">${C.tldr}</div>
        </div>
        <div>
          <h2 class="section-title">🏅 Huy hiệu <span style="margin-left:auto;font-size:12px;color:var(--text-dim);font-weight:600">${Object.keys(S.achievements).length}/${ACHIEVEMENTS.length}</span></h2>
          <div class="ach-grid">${achHtml}</div>

          <h2 class="section-title" style="margin-top:26px">📍 Bắt đầu từ đâu?</h2>
          <div class="card" style="display:flex;flex-direction:column;gap:10px">
            <a href="#/lesson/1" class="btn btn-ghost" style="justify-content:flex-start">1 · Cài đặt & thiết lập môi trường</a>
            <a href="#/status" class="btn btn-ghost" style="justify-content:flex-start">⚠️ Đọc bắt buộc: Trạng thái tính năng</a>
            <a href="#/cheatsheet" class="btn btn-ghost" style="justify-content:flex-start">📌 Bảng tra nhanh (phím tắt, naming…)</a>
          </div>
        </div>
      </div>
    </div>`;

    view.querySelectorAll("[data-nav]").forEach((el) =>
      el.addEventListener("click", () => (location.hash = el.getAttribute("data-nav"))));
  }

  // ---------- LESSON ----------
  function renderLesson(num) {
    const l = lessonByNum[num];
    if (!l) { view.innerHTML = `<div class="page"><p>Không tìm thấy bài học ${esc(num)}.</p></div>`; return; }
    S.lastLesson = num; save();

    const idx = LESSONS.indexOf(l);
    const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    const isDone = !!S.completed[num];
    const isMarked = !!S.bookmarks[num];

    // thời gian đọc ước lượng
    const words = (l.text || "").split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 170));

    // nhóm hiện tại + các bài trong nhóm
    const group = C.groups.find((g) => g.letter === l.groupLetter);
    const gDone = group.lessons.filter((x) => S.completed[x.num]).length;
    const gPct = Math.round((gDone / group.lessons.length) * 100);
    const siblings = group.lessons.map((x) => `<a href="#/lesson/${x.num}" class="rail-lesson ${x.num === num ? "current" : ""} ${S.completed[x.num] ? "done" : ""}">
        <span class="rl-check">${S.completed[x.num] ? "✓" : x.num}</span>
        <span class="rl-title">${esc(x.title)}</span></a>`).join("");

    // bài tập liên quan (theo nhóm)
    const relEx = L.exercises.find((e) => e.groupLetter === l.groupLetter);
    const relHtml = relEx ? `<div class="rail-card rail-ex">
        <div class="rail-ex-head"><span>🎯</span> Bài tập cho nhóm này</div>
        <div class="rail-ex-name">${esc(relEx.title)}</div>
        <div class="rail-ex-meta">${esc(relEx.difficulty)} · ${esc(relEx.time)}</div>
        <a href="#/exercises#ex-${relEx.module}" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:10px">Làm bài tập →</a>
      </div>` : "";

    view.innerHTML = `<div class="page reading-page">
      <div class="lesson-wrap">
        <div class="lesson-main">
          <div class="crumb"><a href="#/">Trang chủ</a> <span>›</span> <span>NHÓM ${l.groupLetter} · ${esc(l.groupName)}</span></div>
          <h1 class="lesson-title-main">${l.num}. ${esc(l.title)}</h1>
          <div class="lesson-subline">Bài ${idx + 1}/${LESSONS.length} · ⏱ ~${mins} phút đọc${isDone ? ' · <span style="color:var(--success)">✓ Đã hoàn thành</span>' : ""}</div>

          <article class="reading">${l.html}</article>

          <nav class="lesson-nav">
            ${prev ? `<a href="#/lesson/${prev.num}" class="prev"><span class="ln-dir">← Bài trước</span><span class="ln-title">${prev.num}. ${esc(prev.title)}</span></a>` : `<a class="prev disabled"><span class="ln-dir">← Bài trước</span><span class="ln-title">—</span></a>`}
            ${next ? `<a href="#/lesson/${next.num}" class="next"><span class="ln-dir">Bài tiếp →</span><span class="ln-title">${next.num}. ${esc(next.title)}</span></a>` : `<a class="next disabled"><span class="ln-dir">Bài tiếp →</span><span class="ln-title">—</span></a>`}
          </nav>
        </div>

        <aside class="lesson-rail">
          <div class="rail-card">
            <button class="btn ${isDone ? "btn-success" : "btn-primary"}" id="markBtn" style="width:100%;justify-content:center">${isDone ? "✓ Đã hoàn thành" : "Đánh dấu hoàn thành"}</button>
            <button class="btn btn-ghost" id="bmBtn" style="width:100%;justify-content:center;margin-top:8px">${isMarked ? "★ Đã lưu" : "☆ Lưu bài"}</button>
          </div>
          ${relHtml}
          <div class="rail-card">
            <div class="rail-head">
              <span>NHÓM ${l.groupLetter}</span>
              <span class="rail-head-pct">${gDone}/${group.lessons.length}</span>
            </div>
            <div class="rail-groupbar"><span style="width:${gPct}%"></span></div>
            <div class="rail-lessons">${siblings}</div>
          </div>
        </aside>
      </div>
    </div>`;

    document.getElementById("markBtn").addEventListener("click", () => toggleLesson(num));
    document.getElementById("bmBtn").addEventListener("click", (e) => {
      toggleBookmark(num);
      e.target.textContent = S.bookmarks[num] ? "★ Đã lưu" : "☆ Lưu bài";
    });
    view.scrollTop = 0;
  }

  // ---------- ROADMAP ----------
  function renderRoadmap() {
    const phases = L.roadmap.map((ph) => {
      const goals = ph.goals.map((g) => `<li>${esc(g)}</li>`).join("");
      const chips = ph.lessons.map((n) => {
        const l = lessonByNum[n]; if (!l) return "";
        const d = S.completed[n] ? "done" : "";
        return `<a href="#/lesson/${n}" class="chip ${d}">${S.completed[n] ? '<span class="chip-check">✓</span>' : ""} ${n}. ${esc(l.title)}</a>`;
      }).join("");
      const total = ph.lessons.length, dn = ph.lessons.filter((n) => S.completed[n]).length;
      const p = total ? Math.round((dn / total) * 100) : 0;
      return `<div class="phase-card" style="--pc:${ph.color}">
        <div class="phase-card-head">
          <div class="phase-num" style="background:${ph.color}">${ph.phase}</div>
          <div style="flex:1"><h2>${esc(ph.title)}</h2><span class="weeks">${ph.weeks} · ${dn}/${total} bài (${p}%)</span></div>
          <div class="phase-bar" style="width:120px"><span style="width:${p}%;background:${ph.color}"></span></div>
        </div>
        <ul class="phase-goals">${goals}</ul>
        <div style="font-size:12px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;font-weight:700">Bài học trong giai đoạn</div>
        <div class="chip-row">${chips}</div>
      </div>`;
    }).join("");

    const tracks = L.tracks.map((t) => `<tr>
      <td class="role"><span class="role-ico">${t.icon}</span>${esc(t.role)}</td>
      <td>${esc(t.required)}</td>
      <td style="color:var(--text-dim)">${esc(t.reference)}</td>
    </tr>`).join("");

    view.innerHTML = `<div class="page">
      <div class="page-head">
        <div class="eyebrow">Học có hệ thống</div>
        <h1>Lộ trình học theo giai đoạn</h1>
        <p class="lead">Ba giai đoạn từ nền tảng tới production. Mỗi giai đoạn gắn với bài học và bài tập cụ thể — hoàn thành lần lượt để lên trình vững chắc.</p>
      </div>
      ${phases}
      <div style="height:${css_style_gap()}px"></div>
      <div class="card" style="margin-top:10px;padding:0 26px 10px">
        <h2 class="section-title" style="padding-top:22px">👥 Phân module theo vai trò</h2>
        <p style="color:var(--text-dim);margin-top:-6px">Không phải ai cũng cần học đủ 40 mục. Chọn track theo vai trò của bạn:</p>
        <table class="tracks-table">
          <thead><tr><th>Vai trò</th><th>Module bắt buộc</th><th>Module tham khảo</th></tr></thead>
          <tbody>${tracks}</tbody>
        </table>
      </div>
    </div>`;
  }
  function css_style_gap() { return 6; }

  // ---------- EXERCISES ----------
  function renderExercises() {
    const cards = L.exercises.map((e) => {
      const total = exTotal(e), dn = exDone(e);
      const p = total ? Math.round((dn / total) * 100) : 0;
      const complete = dn === total && total > 0;
      const tasks = e.tasks.map((t, i) => {
        const on = S.exTasks[e.module + ":" + i] ? "done" : "";
        return `<div class="task ${on}" data-mod="${e.module}" data-i="${i}" data-adv="0"><span class="task-box">✓</span><span class="task-text">${esc(t)}</span></div>`;
      }).join("");
      const adv = e.advanced ? `<div class="task-adv"><div class="adv-label">Nâng cao (tùy chọn)</div>` +
        e.advanced.map((t, i) => {
          const on = S.exAdv[e.module + ":" + i] ? "done" : "";
          return `<div class="task ${on}" data-mod="${e.module}" data-i="${i}" data-adv="1"><span class="task-box">✓</span><span class="task-text">${esc(t)}</span></div>`;
        }).join("") + `</div>` : "";
      const lessonChips = e.lessons.map((n) => lessonByNum[n] ? `<a href="#/lesson/${n}" class="chip">${n}. ${esc(lessonByNum[n].title)}</a>` : "").join("");
      return `<div class="ex-card ${complete ? "complete" : ""}" id="ex-${e.module}">
        <div class="ex-head" data-open="${e.module}">
          <div class="ex-letter">${e.module}</div>
          <div class="ex-head-info">
            <h3>Module ${e.module} — ${esc(e.title)}</h3>
            <div class="ex-meta"><span>📊 ${esc(e.difficulty)}</span><span>⏱ ${esc(e.time)}</span><span>${complete ? "✅ Hoàn thành" : dn + "/" + total + " đầu việc"}</span></div>
          </div>
          <div class="ex-progress-mini"><div class="bar"><span style="width:${p}%"></span></div><span class="cnt">${p}%</span></div>
          <span class="ex-caret">▶</span>
        </div>
        <div class="ex-body">
          <p class="ex-desc">${esc(e.intro)}</p>
          <div style="margin-bottom:14px;font-size:12px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.05em;font-weight:700">Bài học liên quan</div>
          <div class="chip-row" style="margin-bottom:16px">${lessonChips}</div>
          ${tasks}${adv}
          <div class="submit-box">📤 <b>Nộp:</b> ${esc(e.submit)}</div>
        </div>
      </div>`;
    }).join("");

    const cap = L.capstone;
    const capTasks = cap.tasks.map((t, i) => {
      const on = S.capTasks[i] ? "done" : "";
      return `<div class="task ${on}" data-cap="${i}"><span class="task-box">✓</span><span class="task-text">${esc(t)}</span></div>`;
    }).join("");
    const rubric = cap.rubric.map((r) => `<li>${esc(r)}</li>`).join("");
    const capDone = cap.tasks.filter((_, i) => S.capTasks[i]).length;

    view.innerHTML = `<div class="page">
      <div class="page-head">
        <div class="eyebrow">Học đi đôi với hành</div>
        <h1>Bài tập thực hành</h1>
        <p class="lead">Mỗi module một sản phẩm nhỏ nộp được. Tất cả làm trên cùng một project "Sandbox" (Third Person, C++), commit lên version control từ Module B trở đi.</p>
      </div>
      <div class="ex-intro-card">
        <span style="font-size:24px">💡</span>
        <div><strong>Nguyên tắc:</strong> tick từng đầu việc khi làm xong để theo dõi tiến độ. Hoàn thành đủ đầu việc + chuẩn bị "phần nộp" là coi như xong module. Hoàn thành <b>Capstone</b> = đủ điều kiện vào dự án thật.</div>
      </div>
      ${cards}

      <div class="capstone-card" id="capstone">
        <div class="tag tag-accent" style="background:rgba(167,139,250,.16);color:var(--purple)">CAPSTONE</div>
        <h2 style="margin-top:12px">${esc(cap.title)}</h2>
        <p style="color:var(--text-dim);margin:4px 0 0">⏱ ${esc(cap.time)} · ${esc(cap.intro)}</p>
        <div class="cap-grid">
          <div>
            <h4>Yêu cầu sản phẩm (${capDone}/${cap.tasks.length})</h4>
            ${capTasks}
          </div>
          <div>
            <h4>Rubric nghiệm thu</h4>
            <ul class="rubric-list">${rubric}</ul>
          </div>
        </div>
      </div>
    </div>`;

    // sự kiện
    view.querySelectorAll(".ex-head").forEach((h) =>
      h.addEventListener("click", () => h.parentElement.classList.toggle("open")));
    view.querySelectorAll(".task[data-mod]").forEach((t) =>
      t.addEventListener("click", () => toggleTask(t.getAttribute("data-mod"), +t.getAttribute("data-i"), t.getAttribute("data-adv") === "1")));
    view.querySelectorAll(".task[data-cap]").forEach((t) =>
      t.addEventListener("click", () => toggleCap(+t.getAttribute("data-cap"))));

    // mở card nếu có hash con #ex-X, cuộn tới
    const sub = location.hash.split("#")[2];
    if (sub) {
      const target = document.getElementById(sub);
      if (target) { target.classList.add("open"); setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }
    }
  }

  // ---------- QUIZ ----------
  let qIndex = 0, qFlipped = false;
  function renderQuiz() {
    const known = L.quiz.filter((_, i) => S.quiz[i] === "known").length;
    const review = L.quiz.filter((_, i) => S.quiz[i] === "review").length;
    view.innerHTML = `<div class="page">
      <div class="page-head">
        <div class="eyebrow">Kiểm tra kiến thức</div>
        <h1>Ôn tập nhanh (Flashcards)</h1>
        <p class="lead">Đọc câu hỏi, tự trả lời trong đầu, rồi lật thẻ để đối chiếu. Đánh dấu "Đã thuộc" hoặc "Cần ôn lại" để theo dõi.</p>
      </div>
      <div class="quiz-head-stats">
        <div class="qstat"><div class="v" style="color:var(--success)">${known}</div><div class="l">Đã thuộc</div></div>
        <div class="qstat"><div class="v" style="color:var(--warn)">${review}</div><div class="l">Cần ôn lại</div></div>
        <div class="qstat"><div class="v">${L.quiz.length}</div><div class="l">Tổng câu</div></div>
      </div>
      <div class="flashcard-stage" id="fcStage"></div>
    </div>`;
    qFlipped = false;
    renderCard();
  }
  function renderCard() {
    const stage = document.getElementById("fcStage");
    if (!stage) return;
    const item = L.quiz[qIndex];
    const state = S.quiz[qIndex];
    const dots = L.quiz.map((_, i) =>
      `<span class="fc-dot ${S.quiz[i] || ""} ${i === qIndex ? "current" : ""}" data-dot="${i}"></span>`).join("");
    stage.innerHTML = `
      <div class="flashcard" id="theCard">
        <span class="fc-side">${qFlipped ? "Đáp án" : "Câu hỏi"}</span>
        <span class="fc-num">${qIndex + 1}/${L.quiz.length}</span>
        ${qFlipped
          ? `<div class="fc-a"><div style="font-size:15px;color:var(--text-dim);margin-bottom:12px">${esc(item.q)}</div><div class="fc-answer-wrap">${esc(item.a)}</div>${item.lesson ? `<div style="margin-top:16px"><a href="#/lesson/${item.lesson}" class="chip">📖 Xem lại bài ${item.lesson}. ${esc(lessonByNum[item.lesson] ? lessonByNum[item.lesson].title : "")}</a></div>` : ""}</div>`
          : `<div class="fc-q">${esc(item.q)}</div>`}
        <span class="fc-hint">${qFlipped ? "" : "Bấm để lật thẻ →"}</span>
      </div>
      <div class="fc-controls">
        <button class="btn ${state === "review" ? "" : "btn-ghost"}" id="btnReview" style="${state === "review" ? "border-color:var(--warn);color:var(--warn)" : ""}">🔁 Cần ôn lại</button>
        <button class="btn ${state === "known" ? "btn-success" : "btn-ghost"}" id="btnKnown">✓ Đã thuộc</button>
      </div>
      <div class="fc-nav">
        <button class="btn btn-ghost" id="btnPrev">← Trước</button>
        <div class="fc-dots">${dots}</div>
        <button class="btn btn-ghost" id="btnNext">Sau →</button>
      </div>`;

    document.getElementById("theCard").addEventListener("click", () => { qFlipped = !qFlipped; renderCard(); });
    document.getElementById("btnKnown").addEventListener("click", () => { setQuiz(qIndex, S.quiz[qIndex] === "known" ? null : "known"); goCard(+1, true); });
    document.getElementById("btnReview").addEventListener("click", () => { setQuiz(qIndex, S.quiz[qIndex] === "review" ? null : "review"); renderCard(); refreshQuizStats(); });
    document.getElementById("btnPrev").addEventListener("click", () => goCard(-1));
    document.getElementById("btnNext").addEventListener("click", () => goCard(+1));
    stage.querySelectorAll("[data-dot]").forEach((d) =>
      d.addEventListener("click", () => { qIndex = +d.getAttribute("data-dot"); qFlipped = false; renderCard(); }));
  }
  function goCard(dir, auto) {
    const nx = qIndex + dir;
    if (nx >= 0 && nx < L.quiz.length) { qIndex = nx; qFlipped = false; renderCard(); }
    else if (auto) { qFlipped = false; renderCard(); }
    refreshQuizStats();
  }
  function refreshQuizStats() {
    const known = L.quiz.filter((_, i) => S.quiz[i] === "known").length;
    const review = L.quiz.filter((_, i) => S.quiz[i] === "review").length;
    const stats = view.querySelectorAll(".qstat .v");
    if (stats.length >= 2) { stats[0].textContent = known; stats[1].textContent = review; }
  }

  // ---------- STATUS (mục 34) ----------
  function renderStatus() {
    const lesson = lessonByNum[34];
    view.innerHTML = `<div class="page narrow-page">
      <div class="page-head">
        <div class="eyebrow" style="color:var(--danger)">⚠️ Đọc bắt buộc trước khi đưa tính năng vào dự án</div>
        <h1>Trạng thái tính năng: Experimental / Beta / Production</h1>
        <p class="lead">Đừng giả định một tính năng đã ổn định chỉ vì nó tồn tại trong engine. Đây là bảng quan trọng nhất cho quyết định production.</p>
      </div>
      <div class="status-legend">
        <div class="legend-item"><span class="legend-dot" style="background:var(--danger)"></span> <b>Experimental</b> — chỉ học/prototype, API có thể đổi</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--warn)"></span> <b>Beta</b> — dùng được, thận trọng khi ship</div>
        <div class="legend-item"><span class="legend-dot" style="background:var(--success)"></span> <b>Production-Ready</b> — dùng cho sản phẩm</div>
      </div>
      <article class="reading card">${lesson ? lesson.html : ""}</article>
      <div style="margin-top:20px"><a href="#/lesson/35" class="btn">Xem tiếp: Lộ trình 5.7 / 5.8 / UE6 →</a></div>
    </div>`;
  }

  // ---------- CHEATSHEET ----------
  function renderCheatsheet() {
    const tabs = C.appendix.map((a, i) =>
      `<button class="cheat-tab ${i === 0 ? "active" : ""}" data-tab="${i}">${esc(a.title.replace(/🆕/g, "").trim())}</button>`).join("");
    const panels = C.appendix.map((a, i) =>
      `<div class="cheat-panel ${i === 0 ? "active" : ""}" data-panel="${i}"><article class="reading">${a.html}</article></div>`).join("");
    view.innerHTML = `<div class="page">
      <div class="page-head">
        <div class="eyebrow">Phụ lục ghim cố định</div>
        <h1>Tra cứu nhanh</h1>
        <p class="lead">Phím tắt, quy ước đặt tên, console commands, checklist project mới và glossary Anh–Việt. Dùng ô tìm kiếm phía trên để lọc nhanh.</p>
      </div>
      <div class="cheat-tabs">${tabs}</div>
      ${panels}
    </div>`;
    view.querySelectorAll(".cheat-tab").forEach((t) =>
      t.addEventListener("click", () => {
        const i = t.getAttribute("data-tab");
        view.querySelectorAll(".cheat-tab").forEach((x) => x.classList.remove("active"));
        view.querySelectorAll(".cheat-panel").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        view.querySelector(`.cheat-panel[data-panel="${i}"]`).classList.add("active");
      }));
  }

  // ---------- REFERENCES ----------
  function renderReferences() {
    view.innerHTML = `<div class="page narrow-page">
      <div class="page-head"><div class="eyebrow">Tài liệu gốc</div><h1>Nguồn tham khảo & Changelog</h1></div>
      <article class="reading card">${C.references}</article>
      <h2 class="section-title" style="margin-top:24px">Changelog tài liệu</h2>
      <article class="reading card">${C.changelog}</article>
    </div>`;
  }

  // ---------- LUYỆN TẬP HÀNG NGÀY (SRS) ----------
  let session = null; // {queue:[card], current, format, flipped, answered, picked, mc, stats:{reviewed,correct,xp}}

  function renderPractice() {
    if (session) { renderSession(); return; }
    const st = srsStats(null);
    const pct = st.total ? Math.round((st.mastered / st.total) * 100) : 0;

    const deckRows = DECKS.map((d) => {
      const ds = srsStats([d.id]);
      const dp = ds.total ? Math.round((ds.mastered / ds.total) * 100) : 0;
      return `<div class="deck-row" data-deck="${d.id}">
        <div class="deck-ico">${d.icon || "🃏"}</div>
        <div class="deck-info">
          <strong>${esc(d.name)}</strong>
          <small>${ds.total} thẻ · ${ds.mastered} đã thuộc · <span style="color:var(--warn)">${ds.due} đến hạn</span></small>
          <div class="deck-bar"><span style="width:${dp}%"></span></div>
        </div>
        <button class="btn btn-ghost deck-start" data-deck="${d.id}" ${ds.due === 0 ? "disabled" : ""}>Ôn bộ này</button>
      </div>`;
    }).join("");

    // dải lịch 14 ngày gần nhất
    let heat = "";
    for (let i = 13; i >= 0; i--) {
      const day = addDays(todayStr(), -i);
      const n = S.srs.history[day] || 0;
      const lvl = n === 0 ? 0 : n < 10 ? 1 : n < 25 ? 2 : n < 50 ? 3 : 4;
      heat += `<span class="heat heat-${lvl}" title="${day}: ${n} thẻ"></span>`;
    }

    view.innerHTML = `<div class="page">
      <div class="page-head">
        <div class="eyebrow">Lặp lại ngắt quãng · nhớ lâu</div>
        <h1>Luyện tập hàng ngày</h1>
        <p class="lead">Mỗi ngày ôn lại những thẻ "đến hạn". Thẻ nào bạn nhớ sẽ được giãn ra xa hơn, thẻ nào quên sẽ quay lại sớm — cứ đều đặn là thuộc dần cả tài liệu.</p>
      </div>

      <div class="practice-hero">
        <div class="ph-left">
          <div class="ph-due">${st.due}</div>
          <div class="ph-due-lbl">thẻ cần ôn hôm nay</div>
          <button class="btn btn-primary btn-lg" id="startAll" ${st.due === 0 ? "disabled" : ""} style="margin-top:16px">
            ${st.due === 0 ? "✅ Hôm nay đã xong!" : "▶ Bắt đầu ôn (" + st.due + " thẻ)"}
          </button>
          ${st.due === 0 ? `<div class="ph-note">Quay lại ngày mai, hoặc mở một bộ thẻ bên dưới để ôn thêm.</div>` : ""}
        </div>
        <div class="ph-right">
          <div class="ph-stat"><div class="v">🔥 ${S.srs.dailyStreak}</div><div class="l">Chuỗi luyện tập</div></div>
          <div class="ph-stat"><div class="v">${st.mastered}<span class="s">/${st.total}</span></div><div class="l">Thẻ đã thuộc</div></div>
          <div class="ph-stat"><div class="v">${pct}%</div><div class="l">Thuộc tài liệu</div></div>
        </div>
      </div>

      <div class="heat-wrap">
        <span class="heat-lbl">14 ngày gần đây</span>
        <div class="heat-row">${heat}</div>
        <span class="heat-lgd">ít <span class="heat heat-0"></span><span class="heat heat-1"></span><span class="heat heat-2"></span><span class="heat heat-3"></span><span class="heat heat-4"></span> nhiều</span>
      </div>

      <h2 class="section-title" style="margin-top:28px">🃏 Các bộ thẻ (${ALL_CARDS.length} thẻ, xào từ tài liệu)</h2>
      <div class="deck-list">${deckRows}</div>

      <div class="srs-explain">
        <span style="font-size:20px">💡</span>
        <div><b>Cách hoạt động:</b> với thẻ lật, tự nhớ đáp án rồi bấm <b>Quên / Nhớ / Dễ</b> để hệ thống xếp lịch ôn lại. Có cả câu <b>trắc nghiệm</b> trộn vào cho đỡ nhàm. Mục tiêu: đưa mọi thẻ vào trạng thái "đã thuộc" 👑.</div>
      </div>
    </div>`;

    const start = (filter) => { startSession(filter); };
    const btnAll = document.getElementById("startAll");
    if (btnAll) btnAll.addEventListener("click", () => start(null));
    view.querySelectorAll(".deck-start").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); if (!b.disabled) start([b.getAttribute("data-deck")]); }));
  }

  function startSession(filter) {
    const cards = buildSessionCards(filter, 40);
    if (!cards.length) { toast("Không còn thẻ đến hạn cho bộ này 🎉", "📅"); return; }
    session = { queue: cards, current: null, format: "recall", flipped: false, answered: false, picked: null, mc: null, filter: filter, stats: { reviewed: 0, correct: 0, xp: 0 }, finished: false };
    advanceSession();
    renderSession();
  }
  function advanceSession() {
    if (!session.queue.length) { session.finished = true; return; }
    const card = session.queue.shift();
    session.current = card;
    session.flipped = false;
    session.answered = false;
    session.picked = null;
    const deck = deckById[card.deck];
    const useMc = deck.mc && card.deck !== "quiz" && Math.random() < 0.5;
    session.format = useMc ? "mc" : "recall";
    session.mc = useMc ? makeMC(card) : null;
  }
  function endSessionCleanup() { session = null; renderSidebar(); updateTopbar(); }

  function renderSession() {
    if (session.finished) { renderSessionResult(); return; }
    const card = session.current;
    const deck = deckById[card.deck];
    const totalPlanned = session.stats.reviewed + session.queue.length + 1;
    const prog = Math.round((session.stats.reviewed / Math.max(1, totalPlanned)) * 100);

    let body;
    if (session.format === "mc") {
      const mc = session.mc;
      const opts = mc.options.map((o, i) => {
        let cls = "mc-opt";
        if (session.answered) {
          if (o === mc.correct) cls += " correct";
          else if (o === session.picked) cls += " wrong";
          else cls += " dim";
        }
        return `<button class="${cls}" data-opt="${i}" ${session.answered ? "disabled" : ""}>
          <span class="mc-key">${i + 1}</span><span class="${mc.mono ? "mono" : ""}">${esc(o)}</span></button>`;
      }).join("");
      body = `<div class="sess-prompt">${esc(card.prompt || "Chọn đáp án đúng")}</div>
        <div class="sess-stem ${deck.mcReverse ? "" : ""}">${esc(mc.stem)}</div>
        <div class="mc-grid">${opts}</div>
        ${session.answered ? `<div class="sess-feedback ${session.picked === mc.correct ? "ok" : "no"}">${session.picked === mc.correct ? "✓ Chính xác!" : "✗ Đáp án đúng: <b>" + esc(mc.correct) + "</b>"}</div>
          <div class="sess-actions"><button class="btn btn-primary" id="mcNext">Tiếp tục →</button></div>` : ""}`;
    } else {
      body = `<div class="sess-prompt">${esc(card.prompt || "")}</div>
        <div class="sess-stem">${esc(card.front)}</div>
        ${session.flipped
          ? `<div class="sess-answer ${card.backMono ? "mono" : ""}">${esc(card.back)}</div>
             ${card.lesson ? `<div style="margin-top:12px"><a href="#/lesson/${card.lesson}" class="chip">📖 Xem lại bài ${card.lesson}</a></div>` : ""}
             <div class="grade-row">
               <button class="btn grade" data-g="again" style="border-color:var(--danger);color:var(--danger)">Quên <small>(1)</small></button>
               <button class="btn grade" data-g="good" style="border-color:var(--accent);color:var(--accent)">Nhớ <small>(2)</small></button>
               <button class="btn grade" data-g="easy" style="border-color:var(--success);color:var(--success)">Dễ <small>(3)</small></button>
             </div>`
          : `<div class="sess-actions"><button class="btn btn-primary btn-lg" id="revealBtn">Hiện đáp án <small>(Space)</small></button></div>`}`;
    }

    view.innerHTML = `<div class="page">
      <div class="sess-top">
        <button class="btn btn-ghost" id="exitSess">✕ Thoát</button>
        <div class="sess-progress"><span style="width:${prog}%"></span></div>
        <div class="sess-count">${session.stats.reviewed} đã ôn · còn ${session.queue.length + (session.finished ? 0 : 1)}</div>
      </div>
      <div class="sess-deckname">${deck.icon || "🃏"} ${esc(deck.name)}</div>
      <div class="sess-card">${body}</div>
    </div>`;

    document.getElementById("exitSess").addEventListener("click", () => { location.hash = "#/practice"; endSessionCleanup(); renderPractice(); });
    const rb = document.getElementById("revealBtn");
    if (rb) rb.addEventListener("click", () => { session.flipped = true; renderSession(); });
    view.querySelectorAll(".grade").forEach((b) =>
      b.addEventListener("click", () => doGrade(b.getAttribute("data-g"))));
    view.querySelectorAll(".mc-opt").forEach((b) =>
      b.addEventListener("click", () => pickMc(+b.getAttribute("data-opt"))));
    const mn = document.getElementById("mcNext");
    if (mn) mn.addEventListener("click", () => { advanceSession(); renderSession(); });
  }

  function pickMc(i) {
    if (session.answered) return;
    const mc = session.mc;
    session.picked = mc.options[i];
    session.answered = true;
    const correct = session.picked === mc.correct;
    const g = correct ? "good" : "again";
    const xp = gradeCard(session.current.id, g);
    session.stats.reviewed++;
    session.stats.xp += xp;
    if (correct) session.stats.correct++;
    else session.queue.splice(Math.min(session.queue.length, 4), 0, session.current); // học lại sớm
    save(); checkAchievements(); updateTopbar();
    renderSession();
  }
  function doGrade(g) {
    const xp = gradeCard(session.current.id, g);
    session.stats.reviewed++;
    session.stats.xp += xp;
    if (g !== "again") session.stats.correct++;
    else session.queue.splice(Math.min(session.queue.length, 4), 0, session.current);
    save(); checkAchievements(); updateTopbar();
    advanceSession();
    renderSession();
  }

  function renderSessionResult() {
    const s = session.stats;
    const acc = s.reviewed ? Math.round((s.correct / s.reviewed) * 100) : 0;
    const st = srsStats(null);
    const filter = session.filter;
    session = null;
    renderSidebar(); updateTopbar();
    view.innerHTML = `<div class="page">
      <div class="result-card">
        <div class="result-emoji">${acc >= 80 ? "🎉" : acc >= 50 ? "👍" : "💪"}</div>
        <h1>Xong phiên ôn tập!</h1>
        <p class="lead" style="margin:0 auto">Đều đặn mỗi ngày là chìa khóa để nhớ lâu.</p>
        <div class="result-stats">
          <div class="rs"><div class="v">${s.reviewed}</div><div class="l">Thẻ đã ôn</div></div>
          <div class="rs"><div class="v" style="color:var(--success)">${acc}%</div><div class="l">Đúng ngay</div></div>
          <div class="rs"><div class="v" style="color:var(--accent)">+${s.xp}</div><div class="l">XP nhận</div></div>
          <div class="rs"><div class="v">🔥 ${S.srs.dailyStreak}</div><div class="l">Chuỗi ngày</div></div>
        </div>
        <div class="result-actions">
          ${st.due > 0 ? `<button class="btn btn-primary btn-lg" id="againBtn">Ôn tiếp (${st.due} thẻ) →</button>` : `<div class="ph-note" style="margin-bottom:8px">✅ Bạn đã ôn hết thẻ đến hạn hôm nay. Tuyệt vời!</div>`}
          <a href="#/practice" class="btn btn-lg">Về trang luyện tập</a>
          <a href="#/" class="btn btn-lg btn-ghost">Bảng điều khiển</a>
        </div>
      </div>
    </div>`;
    const ab = document.getElementById("againBtn");
    if (ab) ab.addEventListener("click", () => startSession(filter));
  }

  // ══════════════════════════ ROUTER ══════════════════════════
  function route(silent) {
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\//, "").split("#")[0].split("/");
    const head = parts[0];
    if (head !== "practice" && session && !session.finished) session = null; // rời phiên khi đổi route
    if (head === "lesson") renderLesson(parseInt(parts[1], 10));
    else if (head === "practice") renderPractice();
    else if (head === "roadmap") renderRoadmap();
    else if (head === "exercises") renderExercises();
    else if (head === "quiz") renderQuiz();
    else if (head === "status") renderStatus();
    else if (head === "cheatsheet") renderCheatsheet();
    else if (head === "references") renderReferences();
    else renderDashboard();

    if (!silent) {
      renderSidebar();
      document.body.classList.remove("sidebar-open");
      if (!hash.includes("#", 2)) view.scrollTop = 0;
    } else {
      renderSidebar();
    }
    updateTopbar();
  }

  // ══════════════════════════ SEARCH ══════════════════════════
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  let searchSel = -1, searchItems = [];

  function buildSearchIndex() {
    const idx = [];
    LESSONS.forEach((l) => idx.push({ kind: "Bài học", title: l.num + ". " + l.title, text: l.text, hash: "#/lesson/" + l.num }));
    // phụ lục
    C.appendix.forEach((a) => idx.push({ kind: "Tra cứu", title: a.title, text: a.html.replace(/<[^>]+>/g, " "), hash: "#/cheatsheet" }));
    L.exercises.forEach((e) => idx.push({ kind: "Bài tập", title: "Module " + e.module + " — " + e.title, text: e.tasks.join(" ") + " " + e.intro, hash: "#/exercises#ex-" + e.module }));
    return idx;
  }
  const SEARCH_IDX = buildSearchIndex();

  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { searchResults.classList.remove("show"); return; }
    const terms = q.split(/\s+/);
    const scored = [];
    SEARCH_IDX.forEach((it) => {
      const hayTitle = it.title.toLowerCase();
      const hayText = (it.text || "").toLowerCase();
      let score = 0;
      terms.forEach((t) => {
        if (hayTitle.includes(t)) score += 10;
        if (hayText.includes(t)) score += 2;
      });
      if (score > 0) scored.push({ it, score });
    });
    scored.sort((a, b) => b.score - a.score);
    searchItems = scored.slice(0, 12).map((s) => s.it);
    searchSel = -1;
    if (!searchItems.length) {
      searchResults.innerHTML = `<div class="sr-empty">Không tìm thấy kết quả cho "${esc(q)}"</div>`;
    } else {
      searchResults.innerHTML = searchItems.map((it, i) => {
        let snip = it.text ? it.text.slice(0, 120) : "";
        return `<div class="sr-item" data-i="${i}">
          <div class="sr-kind">${it.kind}</div>
          <div class="sr-title">${highlight(it.title, terms)}</div>
          ${snip ? `<div class="sr-snippet">${highlight(snip, terms)}…</div>` : ""}
        </div>`;
      }).join("");
      searchResults.querySelectorAll(".sr-item").forEach((el) =>
        el.addEventListener("click", () => gotoSearch(+el.getAttribute("data-i"))));
    }
    searchResults.classList.add("show");
  }
  function highlight(text, terms) {
    let out = esc(text);
    terms.forEach((t) => {
      if (!t) return;
      const re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }
  function gotoSearch(i) {
    const it = searchItems[i]; if (!it) return;
    searchResults.classList.remove("show");
    searchInput.value = "";
    location.hash = it.hash;
  }
  searchInput.addEventListener("input", (e) => doSearch(e.target.value));
  searchInput.addEventListener("keydown", (e) => {
    if (!searchResults.classList.contains("show")) return;
    const items = searchResults.querySelectorAll(".sr-item");
    if (e.key === "ArrowDown") { e.preventDefault(); searchSel = Math.min(searchSel + 1, items.length - 1); updateSel(items); }
    else if (e.key === "ArrowUp") { e.preventDefault(); searchSel = Math.max(searchSel - 1, 0); updateSel(items); }
    else if (e.key === "Enter") { e.preventDefault(); gotoSearch(searchSel >= 0 ? searchSel : 0); }
    else if (e.key === "Escape") { searchResults.classList.remove("show"); searchInput.blur(); }
  });
  function updateSel(items) {
    items.forEach((el, i) => el.classList.toggle("sel", i === searchSel));
    if (items[searchSel]) items[searchSel].scrollIntoView({ block: "nearest" });
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) searchResults.classList.remove("show");
  });

  // ══════════════════════════ GLOBAL EVENTS ══════════════════════════
  // Chặn link anchor nội bộ trong tài liệu (vd href="#34-...") → nhảy tới bài học
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#") && !href.startsWith("#/")) {
      e.preventDefault();
      const m = href.match(/^#(\d+)/);
      if (m) { location.hash = "#/lesson/" + parseInt(m[1], 10); return; }
      if (/tóm-tắt|tldr/i.test(href)) { location.hash = "#/"; return; }
      if (/phụ-lục/i.test(href)) { location.hash = "#/cheatsheet"; return; }
      if (/nguồn-tham-khảo/i.test(href)) { location.hash = "#/references"; return; }
      location.hash = "#/";
    }
  });

  // Theme
  function applyTheme() {
    document.body.setAttribute("data-theme", S.theme);
    document.getElementById("themeToggle").textContent = S.theme === "dark" ? "◐" : "◑";
  }
  document.getElementById("themeToggle").addEventListener("click", () => {
    S.theme = S.theme === "dark" ? "light" : "dark"; save(); applyTheme();
  });

  // Menu toggle (màn nhỏ)
  document.getElementById("menuToggle").addEventListener("click", () =>
    document.body.classList.toggle("sidebar-open"));

  // Collapse all groups
  document.getElementById("collapseAll").addEventListener("click", () => {
    const anyOpen = C.groups.some((g) => !S.collapsedGroups[g.letter]);
    C.groups.forEach((g) => (S.collapsedGroups[g.letter] = anyOpen));
    save(); renderSidebar();
  });

  // Ctrl+K focus search
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchInput.focus(); searchInput.select(); }
  });

  // Phím tắt khi đang trong phiên luyện tập
  document.addEventListener("keydown", (e) => {
    if (!session || session.finished) return;
    if (document.activeElement === searchInput) return;
    if (session.format === "recall") {
      if (!session.flipped && (e.code === "Space" || e.key === "Enter")) { e.preventDefault(); session.flipped = true; renderSession(); }
      else if (session.flipped) {
        if (e.key === "1") doGrade("again");
        else if (e.key === "2") doGrade("good");
        else if (e.key === "3") doGrade("easy");
      }
    } else if (session.format === "mc") {
      if (!session.answered && ["1", "2", "3", "4"].includes(e.key)) pickMc(+e.key - 1);
      else if (session.answered && (e.code === "Space" || e.key === "Enter")) { e.preventDefault(); advanceSession(); renderSession(); }
    }
  });

  // ══════════════════════════ INIT ══════════════════════════
  window.addEventListener("hashchange", () => route(false));
  applyTheme();
  touchStreak();
  checkAchievements();
  renderSidebar();
  updateTopbar();
  route(false);
})();
