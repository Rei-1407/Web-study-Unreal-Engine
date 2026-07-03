/* Dữ liệu học tập có cấu trúc — trích & sắp xếp từ mục 36–38 của tài liệu chuẩn.
   Phần này viết tay (không auto-sinh) vì cần UI tương tác: checklist bài tập,
   thẻ quiz, lộ trình, track theo vai trò. */
window.UE_LEARNING = {
  // ─────────────────────────── LỘ TRÌNH HỌC (mục 37) ───────────────────────────
  roadmap: [
    {
      phase: 1,
      title: "Làm chủ nền tảng",
      weeks: "Tuần 1–4",
      color: "#4ade80",
      goals: [
        "Cài UE 5.6 + Visual Studio 2022 (workload Game development with C++, toolchain MSVC v143) + plugin VS Tools for Unreal Engine.",
        "Tạo project Third Person template (C++) để có sẵn cấu trúc chuẩn.",
        "Học Editor, Gameplay Framework, Enhanced Input, Collision/Trace.",
        "Áp dụng naming convention và tổ chức thư mục theo feature ngay từ đầu.",
      ],
      lessons: [1, 2, 3, 8, 9],
      exerciseModules: ["A"],
    },
    {
      phase: 2,
      title: "Kết hợp Blueprint + C++",
      weeks: "Tuần 5–10",
      color: "#38bdf8",
      goals: [
        "Dựng base class bằng C++, kế thừa bằng Blueprint.",
        "Tập 4 cách giao tiếp Blueprint, ưu tiên Interface + Event Dispatcher.",
        "Tách dữ liệu ra DataTable/DataAsset.",
        "Học một hệ thống chuyên sâu phù hợp dự án: GAS, Animation BP + Control Rig, Niagara, hoặc Landscape/PCG.",
      ],
      lessons: [4, 5, 6, 7, 10, 11, 13],
      exerciseModules: ["B", "C", "D"],
    },
    {
      phase: 3,
      title: "Production và pipeline",
      weeks: "Tuần 11+",
      color: "#f472b6",
      goals: [
        "Thiết lập Perforce + .p4ignore + typemap TRƯỚC khi team bắt đầu commit.",
        "Dựng pipeline import Blender/Substance với preset export cố định; làm chủ Sequencer + MRQ.",
        "Học profiling với Unreal Insights (GPU Profiler 2.0) sớm; đặt ngân sách hiệu năng (vd Nanite < 4ms).",
      ],
      lessons: [28, 29, 30, 31, 27],
      exerciseModules: ["E", "F", "G", "H"],
    },
  ],

  // ─────────────────── TRACK THEO VAI TRÒ (mục 36) ───────────────────
  tracks: [
    {
      role: "Programmer",
      icon: "💻",
      required: "A · B · C · H (29–31) · I",
      reference: "D (13) · G (25) · F (23–24)",
    },
    {
      role: "Artist (environment/lighting)",
      icon: "🎨",
      required: "A · E · F (20, 22–23) · H (28, 30)",
      reference: "G (27) · F (21) · I",
    },
    {
      role: "Tech Artist / VFX",
      icon: "✨",
      required: "A · B (5–7) · E · F (21–22) · H",
      reference: "C (9) · D",
    },
    {
      role: "Designer / Level Designer",
      icon: "🧩",
      required: "A · B (3, 5–7) · C (8–9, 11) · F (20–22) · G (25)",
      reference: "C (12) · I",
    },
    {
      role: "Cinematic / Virtual Production",
      icon: "🎬",
      required: "A · D · E (16–18) · G (27) · H (28, 30)",
      reference: "F (23)",
    },
  ],

  // ─────────────────── BÀI TẬP THỰC HÀNH (mục 38) ───────────────────
  // Mỗi module map 1:1 tới nhóm bài học cùng chữ cái. Mỗi task là 1 mục checklist.
  exercises: [
    {
      module: "A",
      groupLetter: "A",
      title: "Thiết lập môi trường",
      difficulty: "Cơ bản",
      time: "2–4 giờ",
      lessons: [1, 2],
      intro:
        "Mục tiêu: có được môi trường làm việc đúng chuẩn và làm quen thao tác editor cơ bản.",
      tasks: [
        "Cài UE 5.6 + Visual Studio 2022 đúng workload (Game development with C++).",
        "Tạo project Third Person (chọn C++).",
        "Đổi tốc độ chạy của nhân vật (Max Walk Speed).",
        "Dựng một sân nhỏ gồm 10 object dùng grid snap và pivot.",
        "Tổ chức thư mục + đặt tên asset theo bảng Phụ lục.",
      ],
      submit: "Screenshot Content Browser + video 30 giây chạy quanh sân.",
    },
    {
      module: "B",
      groupLetter: "B",
      title: "Kiến trúc & dữ liệu",
      difficulty: "Trung cấp",
      time: "1–2 ngày",
      lessons: [3, 4, 5, 6, 7],
      intro:
        "Mục tiêu: nắm mô hình 'C++ làm nền, Blueprint dựng lên trên' và tách dữ liệu khỏi logic.",
      tasks: [
        "Viết C++ class AInteractableBase (UPROPERTY tên hiển thị, UFUNCTION OnInteract dạng BlueprintNativeEvent).",
        "Tạo 2 Blueprint con kế thừa: cửa mở và đèn bật/tắt.",
        "Tạo Blueprint Interface BPI_Interactable.",
        "Dùng Event Dispatcher báo cho HUD khi tương tác.",
        "Tạo DataTable DT_Items 5 hàng với struct tự định nghĩa.",
      ],
      submit: "Project + sơ đồ 1 trang 'ai gọi ai, qua cơ chế nào'.",
    },
    {
      module: "C",
      groupLetter: "C",
      title: "Gameplay cốt lõi",
      difficulty: "Trung cấp",
      time: "2–4 ngày",
      lessons: [8, 9, 10, 11, 12],
      intro:
        "Mục tiêu: input hiện đại, trace tương tác và AI cơ bản. Hai task nâng cao cho programmer.",
      tasks: [
        "Tạo Enhanced Input action Interact (phím E, trigger Hold 0.5 giây).",
        "Line trace từ camera dùng trace channel riêng để chọn interactable.",
        "AI tuần tra 3 điểm và đuổi player khi nhìn thấy (AI Perception + Behavior Tree).",
      ],
      advanced: [
        "(Programmer) GAS ability 'Dash' tiêu Stamina qua GameplayEffect.",
        "(Nâng cao) Bật 2 player trong PIE, làm cửa mở đồng bộ qua server (Server RPC + biến Replicated).",
      ],
      submit: "Project chạy được + clip minh hoạ input, trace và AI.",
    },
    {
      module: "D",
      groupLetter: "D",
      title: "Animation & Nhân vật",
      difficulty: "Trung cấp",
      time: "2–3 ngày",
      lessons: [13, 14],
      intro: "Mục tiêu: dựng locomotion cơ bản và làm chủ montage + retarget.",
      tasks: [
        "Tạo Blend Space 1D idle/walk/run gắn vào AnimBP.",
        "Tạo Montage 'chém' với Anim Notify spawn hiệu ứng.",
        "Retarget một animation từ GASP sang skeleton khác bằng IK Retargeter.",
      ],
      submit: "Clip nhân vật di chuyển + tấn công có hiệu ứng.",
    },
    {
      module: "E",
      groupLetter: "E",
      title: "Đồ họa & Ánh sáng",
      difficulty: "Trung cấp",
      time: "2–4 ngày",
      lessons: [15, 16, 17, 18, 19],
      intro:
        "Mục tiêu: hiểu material PBR, ánh sáng và so sánh Lumen với ground truth Path Tracer.",
      tasks: [
        "Tạo master material (base color, roughness, normal, tham số tint) + 3 Material Instance.",
        "Dựng cảnh trong nhà ban đêm ~30 đèn; đo FPS khi bật/tắt MegaLights (ghi rõ Experimental@5.6).",
        "Render 1 frame bằng Path Tracer làm ground truth, so với Lumen và ghi nhận khác biệt.",
      ],
      submit: "Ảnh so sánh Lumen vs Path Tracer + ghi chú FPS.",
    },
    {
      module: "F",
      groupLetter: "F",
      title: "Xây dựng thế giới",
      difficulty: "Trung cấp",
      time: "2–4 ngày",
      lessons: [20, 21, 22, 23, 24],
      intro: "Mục tiêu: dựng địa hình, rải procedural và hiểu streaming world lớn.",
      tasks: [
        "Tạo landscape 1×1 km với material 3 layer + Landscape Grass Type.",
        "Tạo PCG graph rải đá theo độ dốc.",
        "Bật World Partition và quan sát streaming qua Window → World Partition.",
      ],
      submit: "Clip bay quanh landscape + ảnh cửa sổ World Partition khi streaming.",
    },
    {
      module: "G",
      groupLetter: "G",
      title: "UI · Audio · Cinematic",
      difficulty: "Trung cấp",
      time: "2–3 ngày",
      lessons: [25, 26, 27],
      intro: "Mục tiêu: HUD, menu, âm thanh động và xuất cinematic chất lượng.",
      tasks: [
        "Tạo HUD máu/stamina bind biến.",
        "Tạo menu pause (Set Input Mode UI Only + Show Mouse Cursor).",
        "Tạo MetaSound tiếng bước chân random pitch từ 3 sample.",
        "Dựng cinematic 15 giây với 2 camera cut, export bằng Movie Render Queue.",
      ],
      submit: "File video cinematic + clip demo HUD và menu pause.",
    },
    {
      module: "H",
      groupLetter: "H",
      title: "Pipeline & Production",
      difficulty: "Trung cấp",
      time: "2–3 ngày",
      lessons: [28, 29, 30, 31, 32],
      intro: "Mục tiêu: pipeline asset, version control và đóng gói build.",
      tasks: [
        "Đưa model đơn giản từ Blender vào UE đúng scale 1:1 kèm UCX collision.",
        "Thực hiện đúng quy trình Perforce: checkout → sửa → submit kèm mô tả.",
        "Package Development build Windows, ghi lại dung lượng và thời gian.",
        "Mở Unreal Insights, tìm và ghi lại 1 hàm/Blueprint tốn nhất trong frame.",
      ],
      submit: "Build chạy được + ghi chú dung lượng/thời gian + screenshot Insights.",
    },
  ],

  capstone: {
    title: "Capstone — Mini-game 'một căn phòng'",
    time: "1–2 tuần",
    intro:
      "Tổng hợp mọi module thành một sản phẩm nộp được. Hoàn thành capstone = đủ điều kiện vào dự án thật.",
    tasks: [
      "Nhân vật third person.",
      "3 interactable (dùng kiến trúc Module B).",
      "1 AI.",
      "HUD.",
      "Âm thanh.",
      "Cinematic mở màn 10 giây.",
      "Package Shipping.",
    ],
    rubric: [
      "Chạy ổn 60 FPS trên máy chuẩn của studio.",
      "Đúng naming convention.",
      "Package không có error/warning đỏ.",
      "Có README mô tả cấu trúc.",
    ],
  },

  // ─────────────────── CÂU HỎI ÔN TẬP (mục 38) ───────────────────
  quiz: [
    {
      q: "Trong multiplayer, GameMode tồn tại ở đâu?",
      a: "Chỉ trên server.",
      lesson: 12,
    },
    {
      q: "Vì sao con trỏ tới UObject trong C++ bắt buộc phải có UPROPERTY()?",
      a: "Để Garbage Collection 'thấy' tham chiếu — nếu không, object có thể bị thu hồi bất ngờ gây crash.",
      lesson: 4,
    },
    {
      q: "Input Action và Input Mapping Context khác nhau thế nào?",
      a: "IA mô tả hành động trừu tượng (Jump/Move); IMC map phím vật lý → IA, có thể thêm/bớt và đặt priority lúc runtime.",
      lesson: 8,
    },
    {
      q: "Muốn vùng trigger phát OnComponentBeginOverlap cần thỏa những điều kiện gì?",
      a: "Cả hai object bật Generate Overlap Events và response của cặp channel là Overlap.",
      lesson: 9,
    },
    {
      q: "Experimental / Beta / Production-Ready khác nhau ra sao khi quyết định dùng cho dự án?",
      a: "Experimental: chỉ học/prototype, API có thể đổi; Beta: dùng được nhưng thận trọng khi ship; Production-Ready: dùng được cho sản phẩm.",
      lesson: 34,
    },
    {
      q: "Vì sao file .uasset cần cơ chế lock (checkout) thay vì merge như code?",
      a: "Vì là file binary không merge text được — hai người cùng sửa sẽ mất công của một người.",
      lesson: 30,
    },
    {
      q: "Nanite phù hợp và không phù hợp với loại mesh nào?",
      a: "Hợp mesh đặc chi tiết cao (đá, kiến trúc); yếu với foliage masked và translucent.",
      lesson: 17,
    },
    {
      q: "'Shadow Cache Invalidation Behavior = Static' dùng khi nào và được lợi gì?",
      a: "Cho object tĩnh không biến dạng — VSM giữ được cache trang bóng giữa các frame, tăng hiệu năng rõ rệt.",
      lesson: 17,
    },
    {
      q: "Khi nào nên convert Blueprint sang C++?",
      a: "Sau khi profiling bằng Unreal Insights chỉ ra Blueprint là bottleneck thực sự — không convert theo cảm tính.",
      lesson: 5,
    },
    {
      q: "1 Unreal Unit bằng bao nhiêu, và lỗi import phổ biến nhất từ Blender là gì?",
      a: "1 UU = 1 cm; lỗi scale 100× do đơn vị Blender (Apply Scalings / Unit Scale 0.01).",
      lesson: 28,
    },
    {
      q: "Bảng 200 item đồng nhất do designer chỉnh bằng spreadsheet — chọn DataTable hay DataAsset?",
      a: "DataTable — nhiều hàng đồng nhất, import/export CSV.",
      lesson: 7,
    },
    {
      q: "Server RPC là gì và ai được phép gọi?",
      a: "UFUNCTION(Server): client đang sở hữu actor yêu cầu server thực thi logic; chỉ owning client gọi hợp lệ, client khác gọi sẽ bị drop.",
      lesson: 12,
    },
  ],
};
