# Unreal Engine 5.6 — Tài liệu tham chiếu cho phát triển Game 3D

> **Phiên bản engine:** Unreal Engine 5.6 (phát hành 3/6/2025) · **Đối tượng:** người mới tiếp cận và người đã dùng nhưng chưa thành thạo · **Phạm vi:** game 3D nói chung (kèm cinematic/phim) · **Quy ước:** viết bằng tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh.
>
> Tài liệu này dùng được như một bản tham chiếu khi làm dự án: tra mục lục → nhảy tới phần cần dùng. Mỗi phần đều ghi rõ "dùng để làm gì", "tạo/cấu hình ở đâu", và các lỗi thường gặp.
>
> **✅ Trạng thái kiểm chứng (cập nhật 3/7/2026):** các mốc cốt lõi đã được đối chiếu chéo với công bố chính thức của Epic — ngày phát hành 5.6 (3/6/2025), trạng thái MegaLights (Experimental@5.6 → Beta@5.7 → Production@5.8), Substrate (Beta@5.6 → Production@5.7). **UE 5.8 đã chính thức phát hành giữa tháng 6/2026** tại State of Unreal 2026 (Unreal Fest Chicago) và được Epic xác nhận là bản UE5 lớn cuối theo lộ trình; **UE6 Early Access dự kiến cuối 2027** — chi tiết ở [mục 35](#35-deprecation-và-lộ-trình-tương-lai-57-58-ue6).
>
> **📌 Phiên bản tài liệu 2.0 (dùng cho đào tạo nội bộ):** bổ sung 9 mục mới (đánh dấu 🆕 trong mục lục) — dữ liệu & SaveGame, collision/trace, multiplayer cơ bản, ánh sáng cơ bản, Landscape/Foliage, PCG, Modeling Mode, VR/XR, và bộ module đào tạo (hướng dẫn tổ chức khóa học, bài tập thực hành, câu hỏi ôn tập, checklist, glossary).

---

## Mục lục

**⚡ [Tóm tắt nhanh (đọc trước nếu vội)](#tóm-tắt-nhanh-tldr)**

**NHÓM A — Bắt đầu với Unreal Engine**
- [1. Cài đặt và thiết lập môi trường](#1-cài-đặt-và-thiết-lập-môi-trường)
- [2. Làm quen với Editor](#2-làm-quen-với-editor)

**NHÓM B — Kiến trúc và lập trình Gameplay**
- [3. Gameplay Framework (bộ khung gameplay)](#3-gameplay-framework-bộ-khung-gameplay)
- [4. C++ và hệ thống Reflection trong UE](#4-c-và-hệ-thống-reflection-trong-ue)
- [5. Blueprint và cách kết hợp với C++](#5-blueprint-và-cách-kết-hợp-với-c)
- [6. Giao tiếp giữa các Blueprint](#6-giao-tiếp-giữa-các-blueprint)
- [7. Dữ liệu trong UE: Struct, Enum, DataTable, DataAsset và SaveGame](#7-dữ-liệu-trong-ue-struct-enum-datatable-dataasset-và-savegame) 🆕

**NHÓM C — Các hệ thống Gameplay cốt lõi**
- [8. Enhanced Input (hệ thống input hiện đại)](#8-enhanced-input-hệ-thống-input-hiện-đại)
- [9. Collision, Trace và Overlap](#9-collision-trace-và-overlap) 🆕
- [10. Gameplay Ability System (GAS)](#10-gameplay-ability-system-gas)
- [11. AI: Behavior Tree, State Tree và NavMesh](#11-ai-behavior-tree-state-tree-và-navmesh)
- [12. Multiplayer và Replication (nền tảng)](#12-multiplayer-và-replication-nền-tảng) 🆕

**NHÓM D — Animation và Nhân vật**
- [13. Hệ thống Animation](#13-hệ-thống-animation)
- [14. MetaHuman](#14-metahuman)

**NHÓM E — Đồ họa, Ánh sáng và Rendering**
- [15. Materials và Material Editor](#15-materials-và-material-editor)
- [16. Ánh sáng cơ bản: loại đèn, Mobility và môi trường](#16-ánh-sáng-cơ-bản-loại-đèn-mobility-và-môi-trường) 🆕
- [17. Lumen, Nanite và Virtual Shadow Maps](#17-lumen-nanite-và-virtual-shadow-maps)
- [18. MegaLights, Substrate và Post-processing](#18-megalights-substrate-và-post-processing)
- [19. Niagara (VFX và particle)](#19-niagara-vfx-và-particle)

**NHÓM F — Xây dựng thế giới và Vật lý**
- [20. Landscape, Foliage và Water](#20-landscape-foliage-và-water) 🆕
- [21. PCG (Procedural Content Generation)](#21-pcg-procedural-content-generation) 🆕
- [22. Modeling Mode và Geometry Script](#22-modeling-mode-và-geometry-script) 🆕
- [23. World Partition (quản lý world lớn)](#23-world-partition-quản-lý-world-lớn)
- [24. Chaos Physics](#24-chaos-physics)

**NHÓM G — UI, Audio và Cinematic**
- [25. UMG (UI và HUD)](#25-umg-ui-và-hud)
- [26. Audio: MetaSounds và Sound Cue](#26-audio-metasounds-và-sound-cue)
- [27. Sequencer và pipeline phim](#27-sequencer-và-pipeline-phim)

**NHÓM H — Pipeline và Production**
- [28. Asset pipeline: Blender, Substance và Fab](#28-asset-pipeline-blender-substance-và-fab)
- [29. Debug và Profiling](#29-debug-và-profiling)
- [30. Version Control: Perforce và Git](#30-version-control-perforce-và-git)
- [31. Packaging và Shipping](#31-packaging-và-shipping)
- [32. VR/XR trong Unreal Engine (tổng quan)](#32-vrxr-trong-unreal-engine-tổng-quan) 🆕

**NHÓM I — UE 5.6: Điểm mới và Lộ trình**
- [33. Có gì mới trong UE 5.6](#33-có-gì-mới-trong-ue-56)
- [34. Trạng thái tính năng: Experimental, Beta, Production](#34-trạng-thái-tính-năng-experimental-beta-production)
- [35. Deprecation và lộ trình tương lai (5.7, 5.8, UE6)](#35-deprecation-và-lộ-trình-tương-lai-57-58-ue6)

**NHÓM J — Đào tạo nội bộ và Khuyến nghị**
- [36. Dùng tài liệu này cho đào tạo nội bộ](#36-dùng-tài-liệu-này-cho-đào-tạo-nội-bộ) 🆕
- [37. Lộ trình học theo giai đoạn](#37-lộ-trình-học-theo-giai-đoạn)
- [38. Bài tập thực hành và câu hỏi ôn tập](#38-bài-tập-thực-hành-và-câu-hỏi-ôn-tập) 🆕
- [39. Khuyến nghị cho production](#39-khuyến-nghị-cho-production)
- [40. Lưu ý quan trọng (Caveats)](#40-lưu-ý-quan-trọng-caveats)

**🔖 [Phụ lục: Bảng tra nhanh](#phụ-lục-bảng-tra-nhanh)** — phím tắt, naming convention, stat commands, checklist project mới 🆕, glossary Anh–Việt 🆕

**📚 [Nguồn tham khảo](#nguồn-tham-khảo)**

---

## Tóm tắt nhanh (TL;DR)

- **UE 5.6 là bản "production-focused"**: trọng tâm là tối ưu để chạy ổn định **60 FPS trên phần cứng thế hệ hiện tại**, không phải nâng trần đồ họa. Theo Epic: "one of our key goals was to empower you to build super-high-fidelity, large-scale open worlds that run smoothly at 60 FPS across current-generation hardware."
- **Ba điểm nhấn lớn nhất của 5.6**: (1) bộ công cụ animation/rigging "engine-first" (Control Rig Physics, Motion Trails, Tween Tools, Curve Editor mới) giảm việc đi vòng qua phần mềm DCC ngoài; (2) **MetaHuman Creator tích hợp thẳng vào engine** và rời Early Access; (3) tối ưu rendering sâu (Lumen HWRT, Virtual Shadow Maps, Nanite, đa luồng renderer).
- **Với người mới và trung cấp**, cách làm được Epic khuyến nghị: **dùng C++ làm lớp nền (base class) + Blueprint làm lớp kế thừa để scripting**. Cần nắm vững trước: Gameplay Framework, Enhanced Input, và các hệ thống render mặc định (Lumen, Nanite, Virtual Shadow Maps).
- **Cảnh báo quan trọng về trạng thái tính năng**: nhiều tính năng "hào nhoáng" của 5.6 vẫn ở mức **Experimental/Beta** — MegaLights = Experimental, Substrate = Beta, Control Rig Physics = Experimental. Dùng tốt để học/prototype nhưng cần thận trọng khi đưa vào sản phẩm shipping. Xem chi tiết ở [mục 34](#34-trạng-thái-tính-năng-experimental-beta-production).
- **Hệ thống mới cần học** (thay thế hệ thống cũ): Enhanced Input (thay input cũ), GAS (cho game có ability/RPG), Niagara (thay Cascade), MetaSounds (thay Sound Cue), State Tree (bổ sung cho Behavior Tree).
- **Bối cảnh lộ trình (7/2026)**: UE 5.8 đã ra mắt và là bản UE5 lớn cuối; UE6 (Verse + Scene Graph) vào Early Access cuối 2027. Kết luận thực dụng: 5.6–5.8 là baseline production an toàn cho 2025–2027 — xem [mục 35](#35-deprecation-và-lộ-trình-tương-lai-57-58-ue6).

---

## NHÓM A — Bắt đầu với Unreal Engine

### 1. Cài đặt và thiết lập môi trường

**Cài UE 5.6 qua Epic Games Launcher**
- Tải và cài **Epic Games Launcher** → đăng nhập/tạo tài khoản Epic → tab **Unreal Engine** → **Library** → nút **+** để thêm engine version → chọn **5.6** → Install. Có thể chọn cài kèm Starter Content, Engine Source, Debug symbols, và các target platform.
- UE 5.6 cũng lấy được qua **GitHub** (source build) hoặc bản Linux.

**Yêu cầu hệ thống (System requirements)**
- **OS hỗ trợ cho editor 5.6**: Windows 10+ (64-bit), macOS 14.0+, RHEL/Rocky Linux 8+.
- **RHI khuyến nghị**: DirectX 12 (Shader Model 6) trên Windows — project UE5 mới mặc định dùng DX12; Vulkan cho Linux.
- **Phần cứng để làm việc thoải mái** (kinh nghiệm thực tế, không phải "minimum" tối thiểu): CPU đa nhân hiện đại (6+ cores), GPU **ít nhất 8 GB VRAM** cho Nanite/Lumen (RTX 3070 / RX 6700 XT trở lên là baseline tốt), **32 GB RAM** (Lumen/Nanite/biên dịch shader ngốn RAM), và **ổ NVMe SSD** (UE5 stream asset liên tục — HDD gây load chậm và stutter). Cinematic/virtual production: 64–128 GB RAM, GPU cao cấp hơn.
- **Giấy phép**: miễn phí cho nội dung phi tương tác với doanh thu dưới 1 triệu USD/năm. Studio lớn trả **1.850 USD/seat/năm** (kèm Twinmotion + RealityCapture). Với game, Epic lấy **5% royalty trên phần gross revenue trọn đời (lifetime) vượt mốc 1 triệu USD đầu tiên** của mỗi sản phẩm — lưu ý là doanh thu trọn đời, không phải theo năm. (Luôn kiểm tra EULA hiện hành cho dự án cụ thể.)

**Thiết lập Visual Studio cho C++**
- Cài **Visual Studio 2022** (Community miễn phí cho cá nhân; Professional cho team). UE 5.6.x nhắm tới **toolchain MSVC v143** (đi kèm VS 2022) — dùng toolchain preview mới hơn có thể làm "generate project files" thất bại.
- Trong **Visual Studio Installer** → tab **Workloads** → chọn **Game development with C++**. Đảm bảo có: **MSVC v143 build tools**, **Windows SDK**, **IDE support for Unreal Engine**. Nếu làm việc với shader, thêm **HLSL Tools**.
- Cài plugin miễn phí **Visual Studio Tools for Unreal Engine** để có: hiển thị Blueprint trong VS, Unreal logging, macro/snippet (gõ `uclass`, `ustruct`...), và Unreal Engine Test Adapter.
- Trong UE: **Editor Preferences → Source Code → Source Code Editor** chọn Visual Studio. Nếu UE không nhận VS thì thường do thiếu C++ workload.
- **Lỗi thường gặp**: VS gạch đỏ code Unreal nhưng vẫn compile được ("false errors") — phổ biến, có thể dùng Visual Assist để cải thiện. Nếu tạo project C++ báo "could not be compiled": kiểm tra toolchain v143, đóng editor → rebuild/generate project files → mở lại.

**Tạo project mới, templates, project settings**
- Khi tạo project: chọn **category** (Games, Film/Video & Live Events, Architecture...) và **template** (Blank, First Person, Third Person, Top Down, Vehicle...).
- Tùy chọn ban đầu: **Blueprint hoặc C++**, **Target Platform** (Desktop/Mobile), **Quality Preset** (Maximum/Scalable), **Starter Content** (có/không), **Raytracing** (bật/tắt).
- **Project Settings** (Edit → Project Settings): nơi cấu hình Maps & Modes (GameMode mặc định, default map), Rendering (Lumen, Nanite, VSM, Forward/Deferred), Input, Packaging...

**Cấu trúc thư mục và tổ chức project (best practices)**
- Thư mục `Content/` chứa asset (.uasset, .umap); project C++ có thêm `Source/` (code), `Config/` (file .ini), `Plugins/`.
- Quy ước đặt tên phổ biến (tiền tố theo loại asset): `BP_` (Blueprint), `SM_` (Static Mesh), `SK_` (Skeletal Mesh), `M_` (Material), `MI_` (Material Instance), `T_` (Texture), `IA_`/`IMC_` (Input Action / Mapping Context), `BT_`/`BB_` (Behavior Tree / Blackboard). Bảng đầy đủ ở [Phụ lục](#phụ-lục-bảng-tra-nhanh).
- Tổ chức theo feature/module thay vì gom tất cả vào một thư mục; tránh để asset ở thư mục gốc Content.

### 2. Làm quen với Editor

**Các panel chính của giao diện**
- **Viewport**: cửa sổ 3D chính, nơi xem và chỉnh level.
- **Content Browser / Content Drawer**: quản lý asset. Mở Content Drawer bằng **Ctrl+Space** — nó trượt lên từ dưới và tự ẩn. *Trong 5.6, Content Browser được thiết kế lại*: tổ chức/xem asset tốt hơn, thumbnail resize mượt hơn, hoạt động liền mạch ở cả hướng ngang và dọc.
- **Details panel**: chỉnh thuộc tính của Actor/Component đang chọn.
- **Outliner** (World Outliner): danh sách phân cấp mọi Actor trong level.
- **Toolbar / Viewport Toolbar**: trong 5.6 được làm lại với Section Menus và Quick Access Controls, tự co giãn động.

**Điều hướng viewport**
- Chuột phải + WASD = bay quanh cảnh (fly mode). Alt + chuột trái = orbit. Chuột giữa = pan. Lăn chuột = zoom / đổi tốc độ bay.
- **F** = focus vào object đã chọn. **G** = Game view (ẩn icon editor).

**Actors, Components, World/Level — khái niệm nền tảng**
- **Actor**: bất kỳ object nào đặt được vào level, hỗ trợ transform (translation, rotation, scale). Là lớp cơ sở spawnable.
- **Component**: khối chức năng gắn vào Actor (StaticMeshComponent, CameraComponent, AudioComponent...). **Scene Component** có transform; **Actor Component** thì không.
- **Level/World**: Level là một map; World là tập hợp các level. Mỗi level gắn với một GameMode.

**Transform tools, snapping, pivot**
- **W** = Move (translate), **E** = Rotate, **R** = Scale.
- **Snapping**: grid snap, rotation snap, scale snap (bật/tắt và chỉnh giá trị trên toolbar). Surface snapping (phím End) để dán object xuống bề mặt.
- **Pivot**: tạm thời đổi pivot bằng giữ **chuột giữa** + kéo; chuyển giữa World/Local space bằng nút trên toolbar.

---

## NHÓM B — Kiến trúc và lập trình Gameplay

### 3. Gameplay Framework (bộ khung gameplay)

Đây là "bộ khung xương" mà mọi game UE đều dựa vào. Luồng khởi tạo: GameMode được tạo → spawn Default Pawn, PlayerController, HUD... → spawn các Actor đặt sẵn trong level.

- **GameMode / GameModeBase**: "đạo diễn" của game — định nghĩa luật chơi, chỉ định class nào được dùng (Default Pawn, PlayerController, HUD, GameState, PlayerState), xử lý spawn người chơi qua PlayerStart. **Quan trọng: trong multiplayer, GameMode chỉ tồn tại trên server** (chi tiết ở [mục 12](#12-multiplayer-và-replication-nền-tảng)). Người mới nên dùng **GameModeBase** (đủ dùng, gọn hơn GameMode).
- **GameState / GameStateBase**: trạng thái game được replicate tới mọi client (điểm số, thời gian trận, danh sách PlayerState qua `PlayerArray`).
- **PlayerController**: đại diện cho người chơi, nhận input. Không hiển thị trực quan — nó **"Possess"** một Pawn. Tồn tại xuyên suốt level kể cả khi không possess Pawn nào → đặt logic mở menu, quản lý HUD/UI ở đây. Trong multiplayer chỉ tồn tại trên owning client và server.
- **Pawn**: lớp cơ sở của mọi Actor điều khiển được (bởi người hoặc AI); là biểu diễn vật lý trong world.
- **Character**: subclass đặc biệt của Pawn, có sẵn CapsuleComponent (collision), CharacterMovementComponent (di chuyển có replicate mượt qua mạng), SkeletalMeshComponent.
- **PlayerState**: trạng thái của một người chơi (tên, điểm, health...) — nơi tốt để lưu data cần persist qua các lần chết/respawn (vì Pawn bị hủy còn PlayerController/PlayerState thì không). Truy cập qua `Pawn->PlayerState` hoặc `Controller->PlayerState`.
- **HUD**: lớp vẽ giao diện (debug draw, quản lý UMG widget). Engine luôn tạo HUD mặc định.
- **AIController**: như PlayerController nhưng cho AI — là "bộ não" quyết định, possess Pawn giống cách PlayerController làm.
- **GameInstance**: tồn tại từ lúc game khởi động đến lúc thoát, sống sót qua chuyển level — lưu data toàn cục.

### 4. C++ và hệ thống Reflection trong UE

UE có một hệ thống **reflection** riêng — nền tảng cho phép code C++ "phơi" ra Blueprint, được garbage collection quản lý, và serialize được. Mọi thứ xoay quanh các macro:

- **`UCLASS()`**: đánh dấu class để hệ thống reflection nhận biết (cần kế thừa từ UObject/AActor...).
- **`UPROPERTY()`**: đánh dấu biến để reflection / garbage collection / serialization nhận; specifier như `EditAnywhere`, `BlueprintReadWrite`, `VisibleAnywhere`, `Replicated`.
- **`UFUNCTION()`**: đánh dấu hàm; specifier như `BlueprintCallable`, `BlueprintImplementableEvent`, `Server`/`Client` (RPC).
- **Garbage Collection (GC)**: UObject được GC quản lý; **chỉ con trỏ được đánh dấu `UPROPERTY` mới được GC "thấy"** và giữ sống/dọn dẹp đúng cách. Đây là lý do bắt buộc dùng `UPROPERTY` cho con trỏ tới UObject — nếu không, object có thể bị GC thu hồi bất ngờ gây crash.
- **Reflection = "cánh cổng" sang Blueprint**: chỉ những gì được reflection xử lý mới expose được sang Blueprint.

### 5. Blueprint và cách kết hợp với C++

**Blueprint visual scripting cơ bản**
- **Event** (BeginPlay, Tick, input events), **Variable** (có kiểu; có thể Instance Editable, Expose on Spawn), **Function**, **Macro**, **flow control** (Branch, Sequence, ForLoop, Gate, DoOnce), **Cast** (ép kiểu để truy cập class cụ thể).
- Blueprint hỗ trợ OOP nhưng **không đa luồng**; mỗi Blueprint là một class kế thừa UObject.

**Khi nào dùng cái nào**
- **C++ (programming)**: định nghĩa hệ thống (vehicle system, inventory core), tính toán/thuật toán phức tạp, code chạy mỗi frame với nhiều instance, tình huống cần đa luồng, lõi gameplay then chốt, code engine, viết editor/UI tùy biến.
- **Blueprint (scripting)**: prototype nhanh, hành vi của từng actor (cách cái cửa mở, điều xảy ra khi mở rương), thao tác với asset (material, texture, audio — gắn rất tự nhiên), Animation Blueprint, UMG, scripting do designer/artist làm.

**Cách kết hợp được Epic khuyến nghị**: "C++ làm nền, dựng Blueprint lên trên". Cụ thể: tạo C++ base class → tạo Blueprint kế thừa class đó → expose phần tử C++ bằng specifier (`UPROPERTY(BlueprintReadWrite)`, `UFUNCTION(BlueprintCallable)`) hoặc dùng `UBlueprintFunctionLibrary` cho static function.

**Cảnh báo về casting (rất quan trọng cho hiệu năng và tổ chức project)**: cast tới một Blueprint "nặng" (vd BP_A) từ BP_B tạo **load dependency** — load BP_B sẽ kéo theo mọi asset mà BP_A tham chiếu, kể cả khi cast fail. Vì vậy nên có **native base class** (hoặc Blueprint base tối giản) định nghĩa hàm/biến quan trọng. Tránh **cyclical Blueprint references** (C++ không gặp vấn đề này).

**Chuyển dần Blueprint sang C++**: dùng **Blueprint Header View** để sinh file `.h`, rồi tự viết phần implementation. Chỉ nên convert **sau khi** Unreal Insights chỉ ra Blueprint là bottleneck thực sự (xem [mục 29](#29-debug-và-profiling)).

### 6. Giao tiếp giữa các Blueprint

Bốn cách chính (ưu tiên hai cách cuối để giảm phụ thuộc cứng):

1. **Direct communication**: có sẵn tham chiếu trực tiếp tới object → gọi hàm / đặt biến.
2. **Casting**: ép một tham chiếu chung (vd Actor) về class cụ thể để truy cập thành viên của nó. *(Cẩn thận load dependency — xem mục 5.)*
3. **Blueprint Interface**: định nghĩa tập hàm mà nhiều class khác nhau cùng implement — giao tiếp lỏng (loose coupling), tránh hard reference.
4. **Event Dispatchers / Delegates**: phát "sự kiện" để nhiều object đăng ký lắng nghe (pattern publish–subscribe) — tốt cho giao tiếp một-tới-nhiều và giảm phụ thuộc.

### 7. Dữ liệu trong UE: Struct, Enum, DataTable, DataAsset và SaveGame

Game "nghiêm túc" nào cũng cần tách **dữ liệu** (chỉ số item, cấu hình enemy, bảng giá) khỏi **logic**. UE có sẵn cả một hệ công cụ cho việc này — dùng đúng sẽ giúp designer chỉnh số liệu không cần đụng code.

**Struct và Enum**
- C++: `USTRUCT(BlueprintType)` với member `UPROPERTY` để dùng được trong Blueprint; struct trong UE có tiền tố `F` (vd `FItemData`). Enum: `UENUM(BlueprintType)`.
- Blueprint cũng tạo được Struct/Enum thuần asset (Content Browser → Blueprints → Structure / Enumeration) — tiện cho designer, nhưng đổi cấu trúc Blueprint Struct giữa dự án dễ gây lỗi tham chiếu dây chuyền; team có programmer nên định nghĩa struct quan trọng ở C++.

**DataTable**
- Bảng dữ liệu theo hàng, mỗi hàng là một struct kế thừa `FTableRowBase`. **Import/export CSV hoặc JSON** → designer chỉnh trên spreadsheet rồi nhập lại — lý tưởng cho bảng chỉ số (item, enemy stats, drop rate, giá).
- Đọc bằng node **Get Data Table Row** (Blueprint) hoặc `FindRow<T>()` (C++).

**DataAsset và PrimaryDataAsset**
- **`UDataAsset`**: một asset = một "gói" dữ liệu có cấu trúc (định nghĩa một loại vũ khí, một cấu hình chế độ chơi). Khác DataTable ở chỗ mỗi mục là object riêng và **tham chiếu được asset khác** (mesh, sound, icon...).
- **`UPrimaryDataAsset`**: bản mở rộng làm việc với **Asset Manager** — quét theo loại, gắn ID, và **async load theo nhóm**; là nền của các hệ inventory/unlock quy mô lớn (project Lyra của Epic dùng rất nhiều).
- **Chọn nhanh**: nhiều hàng đồng nhất, chỉnh bằng bảng tính → DataTable; mỗi mục là một gói cấu hình có tham chiếu asset → DataAsset.

**Soft reference vs Hard reference (rất quan trọng cho load time)**
- Tham chiếu thường (`TObjectPtr`, object reference trong Blueprint) = **hard reference**: load object này kéo theo object kia — cùng cơ chế với cảnh báo casting ở mục 5.
- **`TSoftObjectPtr` / `TSoftClassPtr`** (Blueprint: Soft Object/Class Reference) chỉ lưu **đường dẫn**, load thủ công khi cần (node **Async Load Asset**). Dùng cho danh mục lớn (icon/mesh trong bảng item) để không kéo cả kho asset vào bộ nhớ ngay từ đầu.
- Soi dependency bằng **Reference Viewer** (chuột phải asset) và **Size Map** — hai công cụ "bắt bệnh" load time hàng đầu.

**Curve assets**
- `CurveFloat` / `CurveVector`: giá trị theo thời gian/tham số chỉnh bằng đồ thị (damage falloff, tốc độ theo level, easing) thay vì hard-code. Node **Timeline** trong Blueprint cũng dựa trên curve.

**SaveGame (lưu/đọc dữ liệu người chơi)**
- Tạo class kế thừa `USaveGame` chứa các biến cần lưu → `UGameplayStatics::CreateSaveGameObject` → gán dữ liệu → `SaveGameToSlot(SlotName, UserIndex)`; đọc lại bằng `LoadGameFromSlot`. Blueprint có node tương ứng (Create Save Game Object, Save Game to Slot, Load Game from Slot).
- Chỉ lưu **dữ liệu thuần** (số, chuỗi, struct, soft reference); **không lưu con trỏ Actor sống** — lưu ID/transform rồi respawn lại khi load.
- Lỗi thường gặp: đổi biến trong object SaveGame nhưng quên gọi Save (không tự ghi xuống đĩa); test Save/Load trong PIE rồi quên rằng slot lưu cục bộ theo máy.

---

## NHÓM C — Các hệ thống Gameplay cốt lõi

### 8. Enhanced Input (hệ thống input hiện đại)

Hệ thống input mới của UE5, **thay thế action/axis mapping cũ**. Gồm 4 khái niệm:

- **Input Action (IA)**: data asset biểu diễn một "hành động" (Jump/Move/Fire). Kiểu giá trị: Digital (bool), Axis1D (float), Axis2D (Vector2D), Axis3D (FVector).
- **Input Mapping Context (IMC)**: data asset map phím vật lý → IA; có thể thêm/xóa/đặt priority lúc runtime (vd đổi context khi vào xe, mở menu).
- **Input Modifiers**: Dead Zone, Negate, Swizzle Input Axis, Scalar...
- **Input Triggers**: Pressed, Hold, Tap, Chorded...

**Tạo**: chuột phải Content Browser → Input → Input Action / Input Mapping Context.

**Kích hoạt**: thêm IMC vào **Enhanced Input Local Player Subsystem** (thường trong BeginPlay: lấy PlayerController → cast → `GetSubsystem<UEnhancedInputLocalPlayerSubsystem>` → Add Mapping Context kèm priority).

**Ví dụ điển hình**: IA_Move kiểu Axis2D, dùng Swizzle để map W/S vào trục Y, Negate cho S và A.

**Lỗi thường gặp nhất khi migrate**: quên thêm Mapping Context → action không kích hoạt. Lưu ý: legacy `IE_Pressed`/`IE_Released` ↔ Enhanced `ETriggerEvent::Started`/`Completed` (gần giống nhưng không hệt). Gamepad cần Dead Zone modifier rõ ràng.

### 9. Collision, Trace và Overlap

Nền tảng của gần như mọi tương tác gameplay: đạn trúng đích, vùng trigger, cửa tự mở, nhặt đồ, chọn object bằng chuột.

**Ba mức phản ứng va chạm**
- Mỗi cặp object phản ứng với nhau theo một trong ba mức: **Ignore / Overlap / Block**, quyết định bởi **Collision Preset** (xem/tạo ở Project Settings → Engine → Collision). Preset gồm: **Object Type** (WorldStatic, WorldDynamic, Pawn, PhysicsBody...) + bảng response với từng channel.
- Có thể tạo **custom Object Channel / Trace Channel** cho gameplay riêng (vd channel "Interactable" chỉ để trace vật tương tác) — sạch hơn nhiều so với lạm dụng Visibility channel cho mọi thứ.

**Hit vs Overlap — hai loại sự kiện**
- **Block + bật "Simulation Generates Hit Events"** → sự kiện **OnComponentHit** (va đập vật lý thật, có impact normal/impulse).
- **Overlap + bật "Generate Overlap Events" ở CẢ HAI phía** → **OnComponentBeginOverlap / EndOverlap** (vùng trigger xuyên qua được).
- *Lỗi kinh điển*: overlap "không nổ" vì chỉ một bên bật Generate Overlap Events, hoặc response giữa hai object không phải Overlap.

**Trace (raycast) và Sweep**
- **Line Trace By Channel / For Objects** (Blueprint) hoặc `LineTraceSingleByChannel` (C++): bắn tia tìm vật thể — dùng cho ngắm bắn, chọn object dưới crosshair, kiểm tra tầm nhìn AI. Biến thể quét theo hình khối: **Sphere/Box/Capsule Trace** (sweep) — cho hitbox "dày" hơn tia mảnh.
- **Single** (kết quả gần nhất) vs **Multi** (mọi thứ trên đường tia). Khi debug, bật **Draw Debug Type** để nhìn thấy tia; console `show collision` hiển thị toàn bộ khối va chạm trong viewport.

**Simple vs Complex collision**
- **Simple** (hộp/khối lồi — UCX từ DCC hoặc auto convex trong Static Mesh Editor): dùng cho physics và di chuyển. **Complex** (per-triangle): cho trace cần độ chính xác cao.
- Cấu hình trong Static Mesh Editor → Collision Complexity. "Use Complex Collision As Simple" chỉ nên dùng cho mesh tĩnh cần trace chi tiết — **không** dùng cho vật thể mô phỏng vật lý (rất đắt và không ổn định).
- Mesh import xong "xuyên như ma"? → chưa có collision: thêm auto convex hoặc làm UCX trong DCC (xem [mục 28](#28-asset-pipeline-blender-substance-và-fab)).

### 10. Gameplay Ability System (GAS)

Framework để xây dựng **Attributes, Abilities, Effects** mà một Actor sở hữu và kích hoạt — phù hợp RPG, MOBA, action. Điểm mạnh lớn nhất: có sẵn **replication + client-side prediction** (rất khó tự viết tay).

**Các thành phần**
- **AbilitySystemComponent (ASC)**: trung tâm điều phối — phải gắn vào Actor cần modifiable attributes / gameplay tags.
- **UGameplayAbility**: lớp cơ sở cho ability.
- **AttributeSet**: chứa định nghĩa attribute (Health/Stamina/Mana), phân biệt BaseValue vs CurrentValue.
- **GameplayEffect**: instant / duration / infinite — sửa attribute, áp tag.
- **GameplayTag**: nhãn phân cấp biểu diễn trạng thái.
- **GameplayCue**: hiệu ứng cosmetic (particle / âm thanh).

**Nơi đặt ASC**: với nhân vật người chơi cần persist qua respawn → đặt trên **PlayerState**; với AI minion đơn giản → đặt trên **Character**. Phân biệt Owner (actor sở hữu component, stateful) vs Avatar (actor đại diện trong world).

**Replication modes**: Full / Mixed / Minimal — khuyến nghị mặc định **Mixed** (chỉ owning client nhận đầy đủ).

**Setup**: GAS phải được set up trong **C++** (Ability và Effect thì tạo được trong Blueprint). Bật plugin **GameplayAbilities** → thêm `"GameplayAbilities"`, `"GameplayTags"`, `"GameplayTasks"` vào `Build.cs` → implement `IAbilitySystemInterface`.

**Cảnh báo**: setup cần hàng trăm dòng boilerplate. Tài liệu cộng đồng tốt nhất là **GASDocumentation** (tác giả tranek) và project mẫu **Lyra** của Epic.

### 11. AI: Behavior Tree, State Tree và NavMesh

- **Behavior Tree (BT)**: cây quyết định, chạy trái→phải, trên→dưới; **event-driven** (chỉ chạy khi có sự kiện, không tick mỗi frame). Node: **Composite** (Selector, Sequence), **Task** (MoveTo, Wait, PlayAnimation), **Decorator** (điều kiện), **Service** (cập nhật định kỳ).
- **Blackboard (BB)**: "bộ nhớ" của AI — chứa Blackboard Keys (Object, Vector, Bool, Enum...). Tạo: Content Drawer → Add → Artificial Intelligence → Blackboard / Behavior Tree.
- **NavMesh**: thêm **NavMeshBoundsVolume** vào level để sinh vùng đi được; console `Show Navigation` để xem. **MoveTo** dùng NavMesh; **Move Directly Toward** đi thẳng không qua nav.
- **AI Perception**: component cảm nhận (sight, hearing) để phát hiện người chơi → cập nhật Blackboard.
- **State Tree**: lựa chọn mới hơn (kết hợp ưu điểm state machine + behavior tree). 5.6 thêm **scheduled ticking** (chỉ tick khi cần → giảm CPU mạnh), async task support, async RunEnvQuery.
- **Lưu ý hiệu năng**: Blueprint Task chậm hơn native (C++) Task.

### 12. Multiplayer và Replication (nền tảng)

Kể cả khi dự án hiện tại là single-player, hiểu mô hình mạng của UE giúp tránh viết code "không thể chuyển sang multiplayer" về sau — và giải thích nhiều thiết kế của Gameplay Framework (mục 3).

**Mô hình client–server**
- Server là "nguồn sự thật" (**authoritative**); client gửi input, server mô phỏng rồi **replicate** trạng thái xuống các client. Kiểm tra vai trò bằng **Has Authority** (Blueprint: node Switch Has Authority) — logic quyết định (trừ máu, cộng điểm, spawn vật phẩm) phải chạy phía server.
- **NetMode**: Standalone / Listen Server (một máy vừa chơi vừa làm server) / Dedicated Server / Client.

**Replication cơ bản**
- Actor cần bật **Replicates**; biến đánh dấu `UPROPERTY(Replicated)` hoặc `ReplicatedUsing=OnRep_X` (hàm chạy ở client khi giá trị thay đổi — nơi cập nhật UI/hiệu ứng). Replication chỉ đi **một chiều server → client**.
- Nhớ lại mục 3: **GameMode chỉ có trên server**; GameState/PlayerState được replicate cho mọi client — đó là nơi đặt dữ liệu mà mọi người cùng cần thấy.

**RPC (gọi hàm qua mạng)**
- `UFUNCTION(Server, Reliable)`: client (đang own actor) yêu cầu server làm gì đó — vd "tôi muốn bắn".
- `UFUNCTION(Client, Reliable)`: server gọi xuống owning client.
- `UFUNCTION(NetMulticast)`: server phát cho tất cả (hiệu ứng nổ, âm thanh chung).
- **Reliable** = đảm bảo tới nơi (dùng cho sự kiện quan trọng, đừng gọi mỗi frame); Unreliable cho cập nhật liên tục chấp nhận rớt gói.

**Test nhanh trong editor**: nút Play → mũi tên dropdown → **Number of Players** = 2–3, **Net Mode** = Play As Listen Server / Play As Client. Console `Net PktLag=100` / `Net PktLoss=5` mô phỏng mạng xấu.

**Lỗi thường gặp**: spawn actor ở client rồi thắc mắc sao người khác không thấy (phải spawn ở server, actor bật Replicates); gọi Server RPC từ actor mà client không sở hữu (bị drop âm thầm); đặt logic gameplay quan trọng ở client/UI rồi không đồng bộ được.

**Iris**: hệ replication thế hệ mới (phát triển dần qua các bản 5.x, đạt Production-Ready ở 5.8) — hướng tới hiệu năng cao hơn với số lượng object lớn. Với game dùng GAS, phần replication/prediction cho ability đã có sẵn (mục 10).

---

## NHÓM D — Animation và Nhân vật

### 13. Hệ thống Animation

> Animation là **mảng được nâng cấp nhiều nhất** trong UE 5.6.

**Khái niệm nền tảng**
- **Skeletal Mesh** (mesh + skeleton/bone), **Animation Blueprint (AnimBP)** — điều khiển animation runtime, có **EventGraph** + **AnimGraph**.
- **State Machine** (Idle/Walk/Run + transition), **Blend Space** (pha trộn animation theo tham số như tốc độ), **Montage** (phát animation theo section, kèm notify).
- **Control Rig** (rigging/animation procedural ngay trong engine), **IK Retargeter** (chuyển animation giữa các skeleton khác nhau), **Motion Matching** (chọn frame animation khớp nhất với trajectory dự đoán — hướng đi tương lai của Epic).

**Mới / cải tiến trong 5.6**
- **Control Rig Physics (Experimental)**: tích hợp Chaos physics thẳng vào Control Rig — thêm chuyển động procedural (secondary motion, ragdoll thực tế) không cần tool ngoài hay baking; chỉnh tham số real-time trong viewport và convert thành keyframe trong Sequencer.
- **Motion Trails làm lại**: chỉnh arc/spacing ngay trong viewport, nhiều style (Dashed, Time-based, Heat/Speed), pinning/offset.
- **Tween Tools cải tiến**: hotkey điều khiển slider, chế độ Overshoot.
- **Curve Editor làm lại**: toolbar gọn, nhanh hơn, Tween tools nhúng trực tiếp.
- **Skeletal Mesh Editor (Experimental)**: sculpt morph target / blend shape ngay trong editor, kể cả khi đang Play-in-Editor.
- Tối ưu RigLogic cho LOD thấp (nhanh hơn 30–40%).

**Tài nguyên học**: **Game Animation Sample Project (GASP)** — project miễn phí (từ 5.4) chứa animation và setup best-practice cho character locomotion.

**Hướng tương lai**: **Mover plugin (Experimental)** — kế thừa tương lai của Character Movement Component, hỗ trợ rollback networking. **Unreal Animation Framework (UAF)** — bản thay thế Animation Blueprint (lần xem đầu tiên dự kiến ở 5.8).

### 14. MetaHuman

- **MetaHuman 5.6 rời Early Access** và MetaHuman Creator chạy **trực tiếp trong editor** (Windows).
- Có **parametric body system** và **Outfit system** mới (quần áo tự resize theo nhân vật).
- **MetaHuman Animator** nay capture được diễn xuất từ camera mono — kể cả **webcam và nhiều smartphone** (bất kỳ camera nào hoạt động với Unreal LiveLink); và **tạo animation real-time chỉ từ audio**.
- **EULA mới**: MetaHuman characters và animation nay dùng được ở **engine khác** (Unity, Godot...) và phần mềm sáng tạo (Maya, Houdini, Blender).

---

## NHÓM E — Đồ họa, Ánh sáng và Rendering

### 15. Materials và Material Editor

- Render theo **PBR (Physically Based Rendering)**: Base Color, Metallic, Roughness, Normal, Specular, Emissive.
- **Material** (node-based) · **Material Instance (MI)** — override tham số mà không cần biên dịch lại shader, dùng để tạo biến thể · **Material Function** — đóng gói node tái sử dụng · **Material Parameter Collection** — tham số toàn cục.
- **Substrate** (material framework thế hệ mới) trong 5.6 ở mức **Beta** — xem [mục 18](#18-megalights-substrate-và-post-processing).

### 16. Ánh sáng cơ bản: loại đèn, Mobility và môi trường

Trước khi đụng tới Lumen/MegaLights, cần nắm "bảng chữ cái" ánh sáng của UE — thiếu phần này, mọi thảo luận về GI đều thành trừu tượng.

**5 loại đèn**
- **Directional Light**: mặt trời/mặt trăng — chiếu song song toàn cảnh; thường được gắn làm "Atmosphere Sun Light" để lái màu bầu trời.
- **Point Light**: nguồn tỏa mọi hướng (bóng đèn). **Spot Light**: nón chiếu (đèn pin, đèn sân khấu). **Rect Light**: nguồn chữ nhật (panel, cửa sổ) — bóng mềm, "điện ảnh" hơn nhưng đắt hơn.
- **Sky Light**: thu ánh sáng môi trường (bầu trời hoặc HDRI) chiếu ngược vào cảnh — thiếu nó, vùng bóng tối thường "chết đen".

**Mobility (Static / Stationary / Movable)**
- Workflow truyền thống: Static/Stationary → **bake lightmap** (Lightmass, cần lightmap UV), Movable → dynamic hoàn toàn.
- **Với Lumen (mặc định UE5), ánh sáng hoạt động như dynamic** — không cần bake, không cần lightmap UV. Workflow bake chủ yếu còn dùng cho mobile/forward hoặc dự án cần hiệu năng tối đa với ánh sáng tĩnh. Người mới nên học theo hướng Lumen trước và hiểu bake là "con đường legacy/tối ưu đặc thù".

**Bộ môi trường ngoài trời chuẩn** (tạo nhanh một cụm bằng **Window → Env. Light Mixer**): **Sky Atmosphere** (bầu trời vật lý) + Directional Light + Sky Light + **Exponential Height Fog** (bật Volumetric Fog để có sương và tia sáng) + **Volumetric Clouds**. Đặt đủ bộ này là có cảnh ngoài trời "đúng" trong một phút.

**Exposure (phơi sáng)** — thủ phạm số 1 của "cảnh lúc sáng lúc tối bất thường": UE mặc định **Auto Exposure** mô phỏng mắt người thích nghi. Muốn kiểm soát: Post Process Volume → Exposure → Metering Mode = **Manual** + chỉnh Exposure Compensation. Đèn dùng **đơn vị vật lý** (lux cho directional, candela/lumen cho đèn điểm) — tham khảo giá trị thật (nắng trưa ~50.000–100.000 lux, phòng làm việc ~500 lux) thay vì chỉnh mò.

**Đáng biết thêm**: **IES profile** (dạng chùm sáng của đèn thật, gắn vào point/spot), **Light Function** (material chiếu qua đèn — đèn nhấp nháy, caustics giả), **Light Channels** (đèn chỉ ảnh hưởng nhóm object chọn lọc).

**Lỗi thường gặp**: cảnh cháy sáng/om tối → kiểm tra Auto Exposure trước khi đổ lỗi cho đèn; bóng lem khi vật di chuyển → xem VSM invalidation ([mục 17](#17-lumen-nanite-và-virtual-shadow-maps)); cảnh trong nhà tối om dù có cửa sổ → thiếu Sky Light hoặc tường hở làm lọt sáng sai.

### 17. Lumen, Nanite và Virtual Shadow Maps

**Lumen (global illumination động)**
- GI + reflection động, real-time, **không cần bake lightmap**. Là một "họ" hệ thống (Lumen GI, Lumen Reflections...) bật/tắt độc lập.
- Hai chế độ: **Software Ray Tracing (SWRT)** và **Hardware Ray Tracing (HWRT)**. 5.6 tối ưu mạnh HWRT để đạt frame budget ngang SWRT, giải phóng CPU, hướng tới 60Hz.
- **Lưu ý 5.6**: SWRT detail traces (mesh SDF tracing) **bị deprecated** — Epic đang đẩy dần về một path HWRT duy nhất để dev tập trung vào HWRT.

**Nanite (virtualized geometry)**
- Render hình học mật độ cực cao (hàng triệu triangle) mà không cần thủ công làm LOD; dùng asset chất lượng phim trực tiếp. Phù hợp nhất với mesh đặc (rock) hơn là foliage masked.
- **Trong 5.6**: Nanite Skeletal Mesh ở mức Experimental; Nanite Tessellation/Displacement vẫn Experimental. *Hệ Nanite Foliage chuyên dụng (voxel) là tính năng của **5.7**, chưa có trong 5.6.*

**Virtual Shadow Maps (VSM)**
- Phương pháp shadow **mặc định của UE5**, thiết kế để đi cùng Nanite — resolution ảo 16k×16k chia thành page 128×128 cấp phát theo nhu cầu, cache giữa các frame trừ khi bị invalidate (object/đèn di chuyển, WPO foliage). Thay thế Cascaded Shadow Maps.
- 5.6 tối ưu mạnh: receiver masks, per-instance deforming state tracking, culling tốt hơn.
- **Tham số quan trọng**: **Shadow Cache Invalidation Behavior** — đặt **Static** cho asset tĩnh → tăng hiệu năng lớn.

### 18. MegaLights, Substrate và Post-processing

**MegaLights** ("Nanite của ánh sáng")
- Cho phép đặt hàng trăm/nghìn đèn động có shadow mà vẫn giữ hiệu năng. Epic ví: "Like Nanite did for triangles, or Lumen for global illumination, MegaLights removes limitation in a whole new category: direct lighting and shadows."
- **Trạng thái theo version**: giới thiệu **Experimental ở 5.5** → vẫn **Experimental trong 5.6** → Beta ở 5.7 → **Production-Ready ở 5.8**.
- Nhắm tới **current-gen console (PS5, Xbox Series X|S)** và PC có ray tracing — **không hỗ trợ mobile, Switch, hay console thế hệ trước (PS4/Xbox One)**. 5.6 expose `r.MegaLights.DownsampleFactor` (1x/2x).

**Substrate (material framework thế hệ mới)**
- Thay thế hệ shading model cố định bằng framework module hóa, linh hoạt hơn (car paint nhiều lớp clear coat, thin-film...).
- **Trạng thái**: **Beta trong 5.6** → **Production-Ready ở 5.7** (bật mặc định cho project mới). Trong 5.6: cook time/memory đang được tối ưu, nên dành cho R&D.

**Post-processing**
- Dùng **Post Process Volume** (exposure, bloom, color grading, vignette, depth of field, motion blur).
- **TSR (Temporal Super Resolution)** là upscaler mặc định; 5.6 cải thiện độ ổn định thin geometry (`r.TSR.ThinGeometryDetection`).
- **Deferred vs Forward rendering**: UE5 mặc định **Deferred** (hỗ trợ đầy đủ Lumen/Nanite/nhiều đèn động); **Forward** dùng cho VR/mobile (MSAA, nhẹ hơn nhưng hạn chế tính năng).
- **Path Tracer**: render offline physically-correct, dùng làm ground truth / hero frame để validate Lumen.

### 19. Niagara (VFX và particle)

- **Thay thế Cascade cũ.** Cấu trúc: **System** chứa nhiều **Emitter**; emitter chứa các **Module** xếp theo group (Emitter Spawn/Update, Particle Spawn/Update, Render).
- CPU và GPU simulation; có thể phát audio từ particle (module **Play Audio**, **Play Persistent Audio**), export data sang Blueprint/C++.
- 5.6: **Niagara Heterogeneous Volumes** đạt **production-ready** với tối ưu downsampling; VM mới cho phép cùng math chạy trên cả CPU và GPU.

---

## NHÓM F — Xây dựng thế giới và Vật lý

### 20. Landscape, Foliage và Water

**Landscape (địa hình heightmap)**
- Chọn **Landscape** trong dropdown Modes trên toolbar → tab **Sculpt** (nâng/hạ, Smooth, Erosion, Flatten) và tab **Paint** (tô layer material lên địa hình).
- **Landscape Material**: material dùng node **Landscape Layer Blend** với các layer (cỏ, đất, đá), mỗi layer cần một **Layer Info**. *Lỗi kinh điển: tô không ăn vì chưa tạo Layer Info* (nút + cạnh tên layer trong panel Paint).
- **Import heightmap** (ảnh 16-bit .png/.r16) từ Gaea/World Machine/dữ liệu GIS; chọn kích thước theo bảng "Recommended Landscape Sizes" của Epic (tổ hợp component/section hợp lệ) — số liệu tùy tiện sẽ bị engine làm tròn. Với world lớn, bật World Partition ([mục 23](#23-world-partition-quản-lý-world-lớn)) để landscape tự chia ô và stream.
- Địa hình cần hang/vòm: heightmap về bản chất không làm được — khoét **Landscape Hole** (visibility mask) rồi ghép mesh, hoặc theo dõi **Mesh Terrain** (Experimental ở 5.8, [mục 35](#35-deprecation-và-lộ-trình-tương-lai-57-58-ue6)).

**Foliage (cây cỏ, chi tiết bề mặt)**
- **Foliage Mode**: quét đặt hàng loạt instance (Hierarchical Instanced Static Mesh) — cây, đá, bụi cỏ. Chỉnh density, random scale/rotation, align to normal, filter bề mặt được phép đặt.
- **Landscape Grass Type**: cỏ mọc **tự động theo layer material** — tô layer "đất cỏ" tới đâu, cỏ tự mọc tới đó, không cần quét tay. Kết hợp cả hai: grass type cho phủ nền, Foliage Mode cho điểm nhấn.
- Hiệu năng: lá masked là điểm yếu của Nanite ([mục 17](#17-lumen-nanite-và-virtual-shadow-maps)); dùng LOD hợp lý + WPO Disable Distance. (5.7 giới thiệu Nanite Foliage chuyên dụng; 5.8 thêm Procedural Vegetation Editor — khi nâng version hãy đọc lại release notes trước khi đổi pipeline foliage.)

**Water**
- Plugin **Water** dựng ocean/lake/river bằng spline, kèm buoyancy cơ bản — đủ tốt cho prototype và cảnh không đòi hỏi. Plugin này nhiều năm chưa đạt độ hoàn thiện production; dự án cần mặt nước "hero" thường tự dựng material/hệ riêng hoặc dùng giải pháp bên thứ ba.

### 21. PCG (Procedural Content Generation)

Framework đặt asset **theo luật** thay vì đặt tay — rải rừng, đá, prop dọc đường, hay cả một biome theo tham số. Đây là công cụ world-building chủ lực Epic đang đầu tư mạnh (được cải tiến liên tục ở 5.6 → 5.8).

- **Cách hoạt động**: tạo **PCG Graph** (asset) → kéo vào level qua **PCG Volume** (chứa PCG Component) → graph chạy: **sample** bề mặt (Surface Sampler trên landscape/mesh) → **filter/transform** điểm (Density Noise, lọc theo độ dốc/độ cao, random scale-rotation) → **spawn** (Static Mesh Spawner).
- Chỉnh tham số trong graph → kết quả cập nhật ngay trong viewport (iterate rất nhanh). Hỗ trợ partition theo World Partition và **runtime generation** (sinh nội dung quanh người chơi — 5.6 tăng tốc mạnh nhánh GPU cho việc này).
- **Học từ mẫu**: project **Electric Dreams** của Epic — setup PCG Biome hoàn chỉnh, đáng mổ xẻ trước khi tự dựng.
- **Trạng thái**: framework dùng ổn cho tool nội bộ và level dressing; nhiều node/nhánh vẫn Beta — kiểm tra từng tính năng trước khi dựa dẫm. (5.8 bổ sung khả năng **chỉnh tay đè lên kết quả PCG** mà vẫn giữ logic procedural bên dưới.)
- **Lỗi thường gặp**: graph không chạy lại → nút Regenerate hoặc bật Generate On Load; rải lên landscape không trúng → kiểm tra input (Get Landscape Data) và bounds của PCG Volume có phủ đúng vùng.

### 22. Modeling Mode và Geometry Script

- **Modeling Mode** (dropdown Modes): bộ công cụ chỉnh mesh **ngay trong editor** — tạo primitive (Box, Cylinder...), **PolyEdit** (kéo mặt/cạnh/đỉnh), **Boolean** (đục lỗ, cắt ghép), Remesh/Simplify, chỉnh **UV** (có UV Editor riêng), bake normal/AO. Đủ tốt để **blockout level**, sửa nhanh asset lỗi nhỏ, tạo collision mesh — không cần mở Blender cho việc vặt.
- **Geometry Script** (plugin): API tạo/biến đổi mesh bằng Blueprint trên **Dynamic Mesh** — dựng tool procedural (tường chạy theo spline, đục lỗ runtime, generator hình khối đơn giản).
- **Nguyên tắc phân vai**: asset "hero" và mesh có rig vẫn làm ở DCC ([mục 28](#28-asset-pipeline-blender-substance-và-fab)); Modeling Mode là con dao đa năng của level designer, không phải bàn thay thế Blender.

### 23. World Partition (quản lý world lớn)

- Hệ thống **tự động chia/stream data**; world tồn tại như một persistent level duy nhất, không cần chia sublevel thủ công. Đi kèm **Data Layers** (biến thể trạng thái) và **Level Streaming**.
- 5.6: **Fast Geometry Streaming Plugin (Experimental)** — hợp tác Epic + CD PROJEKT RED (dùng trong tech demo The Witcher 4), cho geometry tĩnh, cải thiện streaming open world (async physics state creation, incremental EndPlay).

### 24. Chaos Physics

- Hệ physics của UE5 (collision, rigid body, destruction, cloth, ragdoll) — thay PhysX.
- 5.6 tối ưu Core Solver: partial sleeping islands, multithreaded collision/island generation, network physics; thêm **Physics Replication LOD (Experimental)**.

---

## NHÓM G — UI, Audio và Cinematic

### 25. UMG (UI và HUD)

- Tạo **Widget Blueprint (UMG)** — UI dựa trên Slate. Có **Designer view** (kéo-thả widget: Button, Text, Image, ProgressBar) + **Graph view** (logic).
- Thực hành: tạo widget (thường từ PlayerController) → **Add to Viewport** → bind dữ liệu (vd health bar) tới biến.
- 5.6: widget animation được refactor (bỏ player object, dùng "runner" struct nhẹ hơn).

### 26. Audio: MetaSounds và Sound Cue

- **Sound Cue** (legacy): graph tham số audio đơn giản (volume, pitch), không sample-accurate.
- **MetaSounds** (UE5, thay Sound Cue): là **DSP rendering graph** — kiểm soát sample-accurate ở mức audio-buffer. Build bằng composition (MetaSound trong MetaSound), template, preset. Ba asset type: **MetaSound Source** (tự phát audio), **MetaSound Patch** (đóng gói tái sử dụng), **MetaSound Preset** (override input). Đây là **flow graph** (không phải execution graph như Blueprint) — chú ý lỗi "connection causes loop".
- **Audio Modulation** (thay Sound Class/Sound Mix tĩnh): parameter bus động. **Quartz**: timing sample-accurate cho Blueprint.

### 27. Sequencer và pipeline phim

- **Sequencer**: trình chỉnh cinematic theo timeline (track cho Actor, camera, animation, audio). Dùng **Cine Camera Actor**, master/sub-sequence, keyframe.
- **Movie Render Queue (MRQ)**: render offline chất lượng cao (Window → Cinematics → Movie Render Queue → + Render → chọn sequence → chỉnh output: resolution, format .png/.jpg/.exr, anti-aliasing, ray tracing). **Movie Render Graph (MRG)**: giao diện graph để build logic render.
- **Mới trong 5.6 cho cinematic**: **Quick Render (Beta)** — render still/sequence từ viewport/camera đã chọn ra đĩa bằng một click (dùng setting của Movie Render Graph); **Cinematic Assembly Toolset (CAT) (Experimental)** — quản lý shot pipeline (swappable config, naming token, template), phối hợp với Take Recorder và MRQ.

---

## NHÓM H — Pipeline và Production

### 28. Asset pipeline: Blender, Substance và Fab

- **UE 5.4+ thay importer FBX legacy bằng Interchange Framework** — dialog import 5.6 khác trước (không còn "Normal Import Method", "Convert Scene Unit" như tutorial cũ).
- **Đơn vị**: UE5 dùng cm (1 Unreal Unit = 1 cm); lỗi scale 100× là phổ biến nhất từ Blender → kiểm tra Apply Unit/Apply Scalings, hoặc Unit Scale 0.01.
- **Trước khi export từ Blender**: Apply all transforms (Ctrl+A), set origin đúng pivot, dọn material slot thừa, kiểm tra face orientation, **lưu preset export FBX** (defaults gây lỗi — đặc biệt Add Leaf Bones, Apply Scalings).
- **Static mesh**: import kèm material/texture (diffuse + normal). Lightmap UV: tạo UV channel 1 hoặc để UE auto-generate; **nếu dùng Lumen thì không cần lightmap UV**.
- **Skeletal mesh**: cần **một root bone duy nhất** ("Multiple roots are found" là lỗi thường gặp); đổi tên armature khỏi "Armature" mặc định. Tick **Skeletal Mesh** trong dialog. Export animation thành file FBX riêng (mesh+armature một file, animation file khác).
- **Collision**: dùng convention UCX_/UBX_/USP_/UCP_ trong DCC.
- **GLTF/GLB**: UE hỗ trợ qua Interchange/plugin.
- **Tự động hóa**: addon **Send to Unreal** (Epic, community-maintained) đẩy asset từ Blender sang editor đang chạy bằng một click.
- **Substance Painter**: export texture set (Base Color, Normal, ORM = Occlusion-Roughness-Metallic) → import vào UE → gán vào Material.

**Nguồn asset: Fab và Quixel Megascans** 🆕
- **Fab** (fab.com) là chợ asset hợp nhất của Epic, **thay thế Unreal Marketplace** từ cuối 2024 — mesh, material, plugin, VFX (kể cả asset cho engine khác); có mục asset miễn phí theo đợt.
- **Quixel Megascans** (thư viện scan vật thể/bề mặt thực) nay nằm trong Fab; thêm thẳng vào project qua **Fab plugin trong editor** (thay Quixel Bridge cũ). Kiểm tra license theo từng asset trước khi dùng cho sản phẩm thương mại.
- Kỷ luật team: asset tải về cũng phải theo naming/cấu trúc thư mục của dự án (vd `Content/ThirdParty/<TenPack>`), tránh rải rác khắp Content.

### 29. Debug và Profiling

**Debug**
- **Blueprint Debugger**: đặt breakpoint trên node, xem giá trị biến lúc chạy; **Print String** để log nhanh; **Blackboard view** debug AI.
- **Visual Studio debugging**: F5 attach, breakpoint trong C++. 5.6 hỗ trợ debug optimized code với MSVC.
- **Logging**: `UE_LOG`; **Output Log** và **Message Log** trong editor.

**Profiling**
- **Unreal Insights**: profiler chính (CPU/GPU/memory trace). 5.6: **GPU Profiler 2.0** (hai track Graphics + Compute riêng, hiển thị async compute đúng), **Insights Asset Memory Profiling (Experimental)**.
- **stat commands**: `stat fps`, `stat unit` (5.6 hiển thị cả render resolution), `stat gpu`; `ProfileGPU`.

**Nguyên tắc tối ưu**
- **Profile trước, tối ưu bottleneck lớn nhất sau** (đừng tối ưu mù). Render thread thường là giới hạn — 5.6 đẩy mạnh renderer parallelization.
- Nanite cost mục tiêu: dưới ~4ms (RTX 3060, 1080p, 60 FPS). Cẩn thận foliage masked với Nanite. Dùng WPO Disable Distance, Shadow Cache Invalidation = Static.
- Blueprint: 5.6 tự tắt Tick nếu Tick rỗng; dùng timer/delegate thay Tick khi có thể.
- **PSO Precaching** để giảm shader stutter trên DX12.

### 30. Version Control: Perforce và Git

- **Perforce P4 (Helix Core)** là chuẩn của ngành game (phần lớn studio AAA dùng); Epic tự dùng P4 cho UE. UE tích hợp sẵn P4 trong editor.
- **Setup**: cài P4 Server (miễn phí tới 5 user hoặc P4 Cloud) + client **P4V** → tạo depot (kiểu **stream**, một depot/project) → tạo workspace (workspace root trỏ tới thư mục project) → cấu hình **typemap** (modifier `+l` để **lock** binary .uasset/.umap) → tạo file **.p4ignore** (bỏ qua DerivedDataCache, Intermediate, Saved, Binaries...) **trước khi** populate depot.
- Trong UE: icon Source Control → Change Source Control Settings → Provider: Perforce. Bật auto checkout: Editor Preferences → Loading & Saving → "Prompt for Checkout on Asset Modification".
- **Lý do file locking quan trọng**: .uasset/.umap là **binary** nên không merge text được → cần lock file để tránh xung đột.
- **Git**: dùng được (kèm **Git LFS** cho binary) nhưng kém phù hợp với binary asset lớn so với Perforce.

### 31. Packaging và Shipping

- **UE5 chuyển menu packaging sang nút Platforms** (UE4 ở File menu). Platforms → chọn platform (Windows, Android, iOS, consoles...) → **Binary Configuration**: Debug / Development / Shipping (**Shipping** = build cuối, tối ưu, bỏ debug).
- Project Settings → Packaging: bật Full Rebuild/compression, **"Use Pak File"**, chỉ cook map cần thiết (giảm dung lượng).
- Build configurations đầy đủ: **Debug, DebugGame, Development, Shipping, Test** (mỗi loại có biến thể Editor).

### 32. VR/XR trong Unreal Engine (tổng quan)

Nằm ngoài phạm vi "game 3D màn hình phẳng" nhưng đáng có trong tài liệu nội bộ, vì UE là engine XR chủ lực của ngành.

- **Bắt đầu**: template **Virtual Reality** — có sẵn VRPawn với motion controller, teleport, grab (dùng Enhanced Input); chạy trên chuẩn **OpenXR** — một API chung cho Quest, SteamVR, v.v. (một số nền tảng như PSVR2 cần plugin riêng của hãng).
- **Rendering cho VR**: ưu tiên **Forward Shading + MSAA** (Project Settings → Rendering) và bật **Instanced Stereo**; ngân sách rất khắt khe (72–120 FPS *cho hai mắt*). Lumen/Nanite dùng được trong stereo ở mức hạn chế và tốn kém — phần lớn dự án VR vẫn chọn lighting tối giản hoặc baked; kiểm tra release notes của đúng version đang dùng trước khi quyết định.
- **Quest standalone** = build **Android** (Vulkan, mobile renderer): cấu hình Android SDK/NDK trong Project Settings → Platforms, dùng OpenXR (kèm plugin Meta XR nếu cần tính năng riêng của Meta như passthrough).
- **Preview nhanh**: nút Play → **VR Preview** khi headset đã kết nối (Quest qua Link/Air Link).
- Chuyên sâu (hand tracking, passthrough/MR, tối ưu mobile VR) nằm ngoài tài liệu này — tham khảo tài liệu XR của Epic và tài liệu dev của từng hãng headset.

---

## NHÓM I — UE 5.6: Điểm mới và Lộ trình

### 33. Có gì mới trong UE 5.6

**Phát hành**: 3/6/2025, công bố tại State of Unreal / Unreal Fest. Mục tiêu cốt lõi: open world 60 FPS trên phần cứng hiện tại + workflow animation/rigging "engine-first".

**Highlights chính**
- **Hiệu năng / 60 FPS**: tối ưu Lumen HWRT (ShortRangeAO half-res + denoiser → 2× nhanh trên console; Far Field nhanh 30–50%), VSM, Nanite, **renderer parallelization** (refactor RHI để đa luồng), Optimized Device Profiles cho 60Hz, **Oodle 2.9.13** (tăng tốc encode BC7), và **giảm ~10s thời gian khởi động editor** (bỏ manifest khỏi ~2300 compiled DLL).
- **Animation/rigging** (mảng lớn nhất): Control Rig Physics (Experimental), Motion Trails làm lại, Tween Tools/Curve Editor mới, Skeletal Mesh Editor sculpt morph target (Experimental), Mover plugin cải tiến hiệu năng. *(Chi tiết ở [mục 13](#13-hệ-thống-animation).)*
- **MetaHuman 5.6**: rời Early Access, tích hợp trong engine, EULA mở. *(Chi tiết ở [mục 14](#14-metahuman).)*
- **Open world/PCG**: cải tiến PCG (GPU compute, runtime generation, GPU grass), Fast Geometry Streaming Plugin (Experimental, với CDPR).
- **Cinematic/virtual production**: Quick Render (Beta), Cinematic Assembly Toolset (Experimental), Capture Manager + Live Link Hub, Mocap Manager, Sequencer HDR export.
- **UX**: Content Browser thiết kế lại, Viewport Toolbar mới.
- **AI**: State Tree scheduled ticking + async task; tối ưu Mass, Smart Objects.
- **Iris** (networking thế hệ mới): tiếp tục phát triển (replication dynamic/nested object tốt hơn).

### 34. Trạng thái tính năng: Experimental, Beta, Production

> Đây là bảng **quan trọng nhất cho quyết định production**. Đừng giả định một tính năng đã ổn định chỉ vì nó tồn tại trong engine.

| Trạng thái trong 5.6 | Tính năng |
|---|---|
| **Experimental** (chỉ học/prototype) | MegaLights · Control Rig Physics · Skeletal Mesh Editor morph sculpting · Fast Geometry Streaming · Cinematic Assembly Toolset · Mocap/Capture Manager · Nanite Skeletal Mesh · Nanite Tessellation · Gameplay Camera System · Mover · Physics Replication LOD |
| **Beta** (dùng được, thận trọng khi ship) | Substrate materials · Quick Render · Zen Streaming · Project Launcher UI · nhiều phần PCG · Mutable |
| **Production-Ready trong 5.6** | Niagara Heterogeneous Volumes |

### 35. Deprecation và lộ trình tương lai (5.7, 5.8, UE6)

**Deprecation/removal trong 5.6**
- **Lumen SWRT detail traces** (mesh SDF tracing) deprecated — đẩy về HWRT.
- **Legacy Virtual Scouting tools** bị removed (đã báo trước ở 5.5).
- **Camera System Actor** (trong Gameplay Cameras plugin) deprecated.
- *Lưu ý*: KHÔNG có bằng chứng chính thức rằng legacy input system hay Cascade bị deprecated **riêng** trong 5.6.

**Mốc các tính năng đạt production-ready ở version sau** (hữu ích khi cân nhắc nâng version):
- **Substrate**: Production-Ready ở **5.7**.
- **Nanite Foliage**: ra mắt (Experimental) ở **5.7**.
- **MegaLights, Mutable, Movie Render Graph, Iris, Live Link Hub, Chaos Cloth, Dataflow**: Production-Ready ở **5.8** *(MegaLights, Mutable, Dataflow đã được xác nhận trong release notes 5.8 chính thức)*.

**UE 5.8 — đã phát hành (giữa tháng 6/2026, công bố tại State of Unreal 2026, Unreal Fest Chicago)**
- Epic xác nhận đây là **bản UE5 lớn cuối cùng theo lộ trình** — UE5 vẫn được hỗ trợ bug fix, và Epic để ngỏ khả năng thêm một bản chính thức nữa nếu cần.
- Nổi bật: **Mesh Terrain (Experimental)** — địa hình mesh 3D thật (hang, vòm, đảo bay — vượt giới hạn heightmap), tích hợp thẳng với PCG; **Lumen Lite** — mức GI "medium" dựa trên Irradiance Fields, nhanh ~2× so với Lumen high, nhắm 60fps trên handheld/console; **Procedural Vegetation Editor**; **MetaHuman Collections/Crowd (Experimental)** — đám đông hàng trăm–nghìn MetaHuman qua Mass + Nanite; **Toon Shader (Experimental)** trên nền Substrate; Accumulation Depth of Field cho Movie Render Queue; và tích hợp **workflow LLM/AI** trong quá trình sáng tạo nội dung.

**Lộ trình lớn — UE6 (công bố chi tiết tại State of Unreal 2026)**
- **UE6 = hợp nhất UE5 + UEFN** thành một engine duy nhất. **Verse** thành ngôn ngữ gameplay chính (C++ vẫn cho engine/low-level, render, hệ thống hiệu năng cao); **Scene Graph** — gameplay framework mới xây trên Verse (hướng entity/component) — thay thế dần Actor/Component.
- Nội dung/code hướng tới **portable qua chuẩn mở**: glTF/USD thành first-class format; Epic mở đặc tả các hệ thống của UE. Kèm nền tảng **MCP tích hợp AI** (Claude, Gemini...) cho workflow phát triển.
- **Timeline**: Early Access **cuối 2027 (Q4)**; bản full dự kiến **12–18 tháng sau** (khoảng cuối 2028 – giữa 2029). **Actor/Blueprint vẫn có trong UE6 đời đầu**, sau đó **deprecated dần** kèm công cụ chuyển đổi; Epic dự kiến có lớp visual scripting xây trên Verse (chưa ra mắt).
- **Kết luận thực dụng**: UE 5.6 → 5.8 là baseline production vững cho 2025–2027. Studio có dự án nhiều năm thường **freeze version** chứ không nhảy sang UE6 chỉ vì keynote; với team mới học, đầu tư vào UE5 hôm nay không hề phí — Epic cam kết con đường chuyển đổi, và nền tảng (rendering, asset pipeline, tư duy framework) mang sang UE6 gần như nguyên vẹn.

---

## NHÓM J — Đào tạo nội bộ và Khuyến nghị

### 36. Dùng tài liệu này cho đào tạo nội bộ

**Cấu trúc trang web đề xuất**
- Mỗi **NHÓM (A–J) = một module**; mỗi mục = một bài học. Trang chủ = TL;DR + lộ trình học (mục 37). **Phụ lục = trang tra cứu ghim cố định** (phím tắt, naming, glossary). [Mục 34](#34-trạng-thái-tính-năng-experimental-beta-production) nên là trang "đọc bắt buộc" trước khi bất kỳ ai đề xuất đưa tính năng mới vào dự án.
- **Khung một bài học chuẩn**: Mục tiêu (2–3 gạch đầu dòng "sau bài này bạn làm được...") → Nội dung (từ tài liệu này) → Demo 5–10 phút (video quay màn hình nội bộ, dùng đúng project của công ty càng tốt) → Bài tập ([mục 38](#38-bài-tập-thực-hành-và-câu-hỏi-ôn-tập)) → 3–5 câu ôn tập.
- **Đánh giá hoàn thành**: học viên nộp sản phẩm bài tập (project + video ngắn) → mentor review theo checklist; hoàn thành **capstone** (mục 38) = đủ điều kiện vào dự án thật.

**Phân module theo vai trò** (không phải ai cũng cần học đủ 40 mục):

| Track | Module bắt buộc | Module tham khảo |
|---|---|---|
| **Programmer** | A · B · C · H (29–31) · I | D (13) · G (25) · F (23–24) |
| **Artist (environment/lighting)** | A · E · F (20, 22–23) · H (28, 30) | G (27) · F (21) · I |
| **Tech Artist / VFX** | A · B (5–7) · E · F (21–22) · H | C (9) · D |
| **Designer / Level Designer** | A · B (3, 5–7) · C (8–9, 11) · F (20–22) · G (25) | C (12) · I |
| **Cinematic / Virtual Production** | A · D · E (16–18) · G (27) · H (28, 30) | F (23) |

**Bảo trì tài liệu**
- Gán **một owner** cho tài liệu. Mỗi lần đổi engine version: đọc release notes → cập nhật mục 33–35 và các mục bị ảnh hưởng → ghi vào **changelog** cuối trang.
- Quy ước bắt buộc: mọi khẳng định về trạng thái tính năng phải kèm version (vd "Experimental@5.6") — đây là cách duy nhất giữ tài liệu không "mục nát" âm thầm.
- Khuyến khích nhân viên gửi lỗi/bổ sung qua pull request hoặc form nội bộ; mỗi quý review một lượt.

### 37. Lộ trình học theo giai đoạn

> Mỗi giai đoạn có bài tập tương ứng ở [mục 38](#38-bài-tập-thực-hành-và-câu-hỏi-ôn-tập).

**Giai đoạn 1 — Làm chủ nền tảng (tuần 1–4)**
- Cài UE 5.6 + Visual Studio 2022 (workload Game development with C++, toolchain MSVC v143) + plugin VS Tools for Unreal Engine.
- Tạo project Third Person template (chọn C++) để có sẵn cấu trúc chuẩn. Học Editor ([mục 2](#2-làm-quen-với-editor)), Gameplay Framework ([mục 3](#3-gameplay-framework-bộ-khung-gameplay)), Enhanced Input ([mục 8](#8-enhanced-input-hệ-thống-input-hiện-đại)), Collision/Trace ([mục 9](#9-collision-trace-và-overlap)).
- Áp dụng naming convention và tổ chức thư mục theo feature ngay từ đầu.

**Giai đoạn 2 — Kết hợp Blueprint + C++ (tuần 5–10)**
- Dựng base class bằng C++, kế thừa bằng Blueprint. Tập 4 cách giao tiếp Blueprint ([mục 6](#6-giao-tiếp-giữa-các-blueprint)), ưu tiên Interface + Event Dispatcher. Tách dữ liệu ra DataTable/DataAsset ([mục 7](#7-dữ-liệu-trong-ue-struct-enum-datatable-dataasset-và-savegame)).
- Học một hệ thống chuyên sâu phù hợp dự án: GAS (game có ability/RPG), Animation BP + Control Rig (trọng tâm nhân vật/phim), Niagara (nặng VFX), hoặc Landscape/PCG (trọng tâm môi trường).

**Giai đoạn 3 — Production và pipeline (tuần 11+)**
- Thiết lập Perforce + .p4ignore + typemap **trước khi** team bắt đầu commit.
- Dựng pipeline import Blender/Substance với preset export cố định; làm chủ Sequencer + MRQ cho cinematic.
- Học profiling với Unreal Insights (GPU Profiler 2.0) sớm; đặt ngân sách hiệu năng (vd Nanite < 4ms).

### 38. Bài tập thực hành và câu hỏi ôn tập

> Nguyên tắc: mỗi module một sản phẩm nhỏ **nộp được**. Tất cả làm trên cùng một project "Sandbox" cá nhân (Third Person template, C++), commit lên Perforce từ Module B trở đi.

**Bài tập theo module**

- **Module A — Thiết lập**: cài UE 5.6 + VS2022 đúng workload; tạo project Third Person (C++); đổi tốc độ chạy của nhân vật; dựng một sân nhỏ 10 object dùng grid snap và pivot; tổ chức thư mục + đặt tên theo Phụ lục. *Nộp: screenshot Content Browser + video 30 giây chạy quanh sân.*
- **Module B — Kiến trúc & dữ liệu**: C++ class `AInteractableBase` (UPROPERTY tên hiển thị, UFUNCTION `OnInteract` dạng BlueprintNativeEvent) → 2 Blueprint con (cửa mở, đèn bật/tắt); Blueprint Interface `BPI_Interactable`; Event Dispatcher báo cho HUD khi tương tác; DataTable `DT_Items` 5 hàng với struct tự định nghĩa. *Nộp: project + sơ đồ 1 trang "ai gọi ai, qua cơ chế nào".*
- **Module C — Gameplay**: Enhanced Input action Interact (phím E, trigger Hold 0.5 giây) + line trace từ camera dùng **trace channel riêng** để chọn interactable; AI tuần tra 3 điểm và đuổi player khi nhìn thấy (AI Perception + Behavior Tree). *(Nâng cao — programmer)*: GAS ability "Dash" tiêu Stamina qua GameplayEffect. *(Nâng cao 2)*: bật 2 player trong PIE, làm cửa mở **đồng bộ qua server** (Server RPC + biến Replicated).
- **Module D — Animation**: Blend Space 1D idle/walk/run gắn vào AnimBP; Montage "chém" với Anim Notify spawn hiệu ứng; retarget một animation từ GASP sang skeleton khác bằng IK Retargeter.
- **Module E — Đồ họa & ánh sáng**: master material (base color, roughness, normal, tham số tint) + 3 Material Instance; dựng cảnh trong nhà ban đêm ~30 đèn, đo FPS khi bật/tắt MegaLights (ghi chú rõ trạng thái Experimental@5.6); render 1 frame bằng Path Tracer làm ground truth so với Lumen và ghi nhận khác biệt.
- **Module F — Thế giới**: landscape 1×1 km với material 3 layer + Landscape Grass Type; PCG graph rải đá theo độ dốc; bật World Partition và quan sát streaming qua cửa sổ Window → World Partition.
- **Module G — UI/Audio/Cinematic**: HUD máu/stamina bind biến; menu pause (Set Input Mode UI Only + Show Mouse Cursor); MetaSound tiếng bước chân random pitch từ 3 sample; cinematic 15 giây với 2 camera cut, export bằng Movie Render Queue.
- **Module H — Pipeline**: model đơn giản từ Blender vào UE đúng scale 1:1 kèm UCX collision; thực hiện đúng quy trình Perforce: checkout → sửa → submit kèm mô tả; package Development build Windows, ghi lại dung lượng và thời gian; mở Unreal Insights, tìm và ghi lại 1 hàm/Blueprint tốn nhất trong frame.
- **Capstone (1–2 tuần)** — mini-game "một căn phòng": nhân vật third person + 3 interactable (dùng kiến trúc Module B) + 1 AI + HUD + âm thanh + cinematic mở màn 10 giây + package Shipping. **Rubric nghiệm thu**: chạy ổn 60 FPS trên máy chuẩn của studio; đúng naming convention; package không có error/warning đỏ; có README mô tả cấu trúc.

**Câu hỏi ôn tập nhanh** *(đáp án ở cuối mục — khi đưa lên web nên để dạng thu gọn/ẩn hiện)*

1. Trong multiplayer, GameMode tồn tại ở đâu?
2. Vì sao con trỏ tới UObject trong C++ bắt buộc phải có `UPROPERTY()`?
3. Input Action và Input Mapping Context khác nhau thế nào?
4. Muốn vùng trigger phát OnComponentBeginOverlap cần thỏa những điều kiện gì?
5. Experimental / Beta / Production-Ready khác nhau ra sao khi quyết định dùng cho dự án?
6. Vì sao file .uasset cần cơ chế lock (checkout) thay vì merge như code?
7. Nanite phù hợp và không phù hợp với loại mesh nào?
8. "Shadow Cache Invalidation Behavior = Static" dùng khi nào và được lợi gì?
9. Khi nào nên convert Blueprint sang C++?
10. 1 Unreal Unit bằng bao nhiêu, và lỗi import phổ biến nhất từ Blender là gì?
11. Bảng 200 item đồng nhất do designer chỉnh bằng spreadsheet — chọn DataTable hay DataAsset?
12. Server RPC là gì và ai được phép gọi?

**Đáp án**: 1) Chỉ trên server. 2) Để Garbage Collection "thấy" tham chiếu — nếu không, object có thể bị thu hồi bất ngờ gây crash. 3) IA mô tả *hành động* trừu tượng (Jump/Move); IMC map *phím vật lý* → IA, có thể thêm/bớt và đặt priority lúc runtime. 4) Cả hai object bật Generate Overlap Events và response của cặp channel là Overlap. 5) Experimental: chỉ học/prototype, API có thể đổi; Beta: dùng được nhưng thận trọng khi ship; Production-Ready: dùng được cho sản phẩm. 6) Vì là file binary không merge text được — hai người cùng sửa sẽ mất công của một người. 7) Hợp mesh đặc chi tiết cao (đá, kiến trúc); yếu với foliage masked và translucent. 8) Cho object tĩnh không biến dạng — VSM giữ được cache trang bóng giữa các frame, tăng hiệu năng rõ rệt. 9) Sau khi profiling bằng Unreal Insights chỉ ra Blueprint là bottleneck thực sự — không convert theo cảm tính. 10) 1 UU = 1 cm; lỗi scale 100× do đơn vị Blender (Apply Scalings / Unit Scale 0.01). 11) DataTable — nhiều hàng đồng nhất, import/export CSV. 12) `UFUNCTION(Server)`: client đang sở hữu actor yêu cầu server thực thi logic; chỉ owning client gọi hợp lệ, client khác gọi sẽ bị drop.

### 39. Khuyến nghị cho production

- **Dùng Experimental/Beta cho shipping?** Chỉ khi đã test kỹ và chấp nhận rủi ro. MegaLights/Substrate trong 5.6 nên dành cho R&D; nếu cần production-ready, cân nhắc 5.7 (Substrate) hoặc 5.8 (MegaLights) — nhưng nâng version giữa dự án có rủi ro riêng.
- **Blueprint → C++**: chỉ convert sau khi Unreal Insights chỉ ra Blueprint là bottleneck thực sự.
- **Chọn version engine**: dự án mới dài hạn 2025–2027 → 5.6/5.7/5.8 là baseline an toàn; tránh nhảy sang UE6 cho tới khi stable (~2028+).
- **Tránh hard reference / cyclical reference** giữa các Blueprint nặng ngay từ kiến trúc ban đầu (dùng C++ base class + Interface + soft reference — xem mục 5 và 7).
- **Kỷ luật dữ liệu**: chỉ số gameplay nằm trong DataTable/DataAsset ngay từ đầu — đừng để hard-code rải rác rồi "dọn sau".

### 40. Lưu ý quan trọng (Caveats)

- **Trạng thái tính năng theo version rất quan trọng**: nhiều tính năng "nổi tiếng" đạt mốc production ở version khác nhau (MegaLights: Experimental@5.6 → Production@5.8; Substrate: Beta@5.6 → Production@5.7; Mutable: Production@5.8). Đừng giả định một tính năng đã ổn định chỉ vì nó có mặt.
- Nhiều con số hiệu năng (60 FPS, % tăng tốc) là **mục tiêu/điều kiện cụ thể của Epic** (thường tối ưu theo Fortnite), không đảm bảo cho mọi dự án/phần cứng.
- Một số trang tài liệu Epic đang ở URL version 5.7/5.8 nhưng nội dung khái niệm áp dụng tương đương cho 5.6; chi tiết menu/CVAR có thể khác nhỏ giữa các version. Trang release notes 5.6 chính thức tự redirect sang version mới nhất khi truy cập trực tiếp.
- Phí royalty game (5%) tính trên **gross revenue trọn đời** của từng product vượt mốc 1 triệu USD đầu tiên — hãy kiểm tra điều khoản EULA hiện hành của Epic cho dự án cụ thể.
- Tài liệu này chốt theo **UE 5.6**; các ghi chú về 5.7/5.8/UE6 chỉ để định hướng nâng cấp. Khi team chuyển version, cập nhật tài liệu theo quy trình ở mục 36.

---

## Phụ lục: Bảng tra nhanh

### Phím tắt Editor thường dùng

| Phím | Chức năng |
|------|-----------|
| Chuột phải + WASD | Bay quanh cảnh (fly mode) |
| Alt + Chuột trái | Orbit quanh điểm |
| Chuột giữa (kéo) | Pan |
| F | Focus vào object đã chọn |
| G | Game view (ẩn icon editor) |
| W / E / R | Move / Rotate / Scale |
| End | Surface snap (dán xuống bề mặt) |
| Ctrl + Space | Mở Content Drawer |
| Alt + P | Play in Editor (PIE) |
| Esc | Dừng PIE |

### Quy ước đặt tên asset (naming convention)

| Tiền tố | Loại asset |
|---------|------------|
| `BP_` | Blueprint |
| `SM_` | Static Mesh |
| `SK_` | Skeletal Mesh |
| `M_` | Material |
| `MI_` | Material Instance |
| `MF_` | Material Function |
| `T_` | Texture |
| `IA_` | Input Action |
| `IMC_` | Input Mapping Context |
| `BT_` | Behavior Tree |
| `BB_` | Blackboard |
| `ABP_` | Animation Blueprint |
| `NS_` | Niagara System |
| `WBP_` | Widget Blueprint (UMG) |
| `UCX_` | Collision mesh (convex) |
| `DT_` | Data Table |
| `DA_` | Data Asset |
| `E_` | Enum (asset) |
| `GA_` / `GE_` / `GC_` | Gameplay Ability / Effect / Cue (GAS) |
| `LS_` | Level Sequence |
| `CR_` | Control Rig |
| `PP_` | Post Process Material |

### Console / stat commands hữu ích

| Lệnh | Tác dụng |
|------|----------|
| `stat fps` | Hiển thị FPS |
| `stat unit` | Frame time tổng (Game/Draw/GPU/RHI) |
| `stat gpu` | Chi tiết thời gian GPU theo pass |
| `stat game` | Chi tiết thời gian game thread |
| `stat memory` | Tổng quan bộ nhớ |
| `ProfileGPU` | Dump chi tiết một frame GPU |
| `show collision` | Hiển thị mọi khối va chạm |
| `Show Navigation` | Hiển thị NavMesh |
| `t.MaxFPS 0` | Bỏ giới hạn FPS (đo hiệu năng thật) |
| `r.ScreenPercentage 50` | Test nhanh có bị nghẽn GPU không (số FPS tăng vọt = GPU-bound) |
| `r.MegaLights.DownsampleFactor` | Chỉnh chất lượng MegaLights (1x/2x) |
| `r.TSR.ThinGeometryDetection` | Ổn định thin geometry với TSR |

### Checklist thiết lập project mới cho team 🆕

- [ ] Chốt engine version (ghi vào README; cả team dùng đúng một bản, kể cả số hotfix .x)
- [ ] Tạo project từ template phù hợp; bật/tắt Starter Content có chủ đích
- [ ] Project Settings: Default GameMode/Maps · DX12 + SM6 · bật/tắt Lumen–Nanite–VSM theo target · Default Input Component/PlayerController dùng Enhanced Input
- [ ] Đưa naming convention + cấu trúc thư mục vào wiki dự án, link từ README
- [ ] Dựng Perforce: depot stream · typemap (`+l` cho .uasset/.umap) · `.p4ignore` **trước commit đầu tiên**
- [ ] Bật "Prompt for Checkout on Asset Modification" cho cả team
- [ ] Kế hoạch PSO Precaching cho DX12 (tránh shader stutter khi ship)
- [ ] Chốt "máy chuẩn" (min-spec) để đo hiệu năng + ngân sách frame (vd 16.6 ms cho 60 FPS)
- [ ] Lịch package/build định kỳ (BuildCookRun hoặc CI) — phát hiện lỗi cook sớm, đừng để đến gần deadline
- [ ] Danh sách tính năng Experimental/Beta **được phép dùng** trong dự án (đối chiếu mục 34, có chữ ký lead)

### Thuật ngữ Anh–Việt (Glossary) 🆕

| Thuật ngữ | Diễn giải ngắn |
|---|---|
| Actor | Object đặt được vào level, có transform |
| Component | Khối chức năng gắn vào Actor |
| Asset | Tài nguyên trong project (.uasset): mesh, texture, sound... |
| Level / Map | Một màn/bản đồ (.umap) |
| Spawn | Sinh một Actor vào world lúc runtime |
| Tick | Hàm chạy mỗi frame |
| Transform | Bộ ba vị trí – xoay – tỷ lệ |
| Mesh (Static/Skeletal) | Lưới hình học (tĩnh / có xương để animate) |
| Rigging | Gắn xương và điều khiển cho nhân vật |
| Retargeting | Chuyển animation giữa hai bộ skeleton khác nhau |
| Keyframe | Khóa giá trị tại một thời điểm trên timeline |
| Material / Shader | Định nghĩa bề mặt phản ứng với ánh sáng |
| Texture | Ảnh dùng trong material |
| Lightmap / Bake | Ánh sáng tính trước, "nướng" vào texture |
| GI (Global Illumination) | Ánh sáng gián tiếp (nảy qua bề mặt) |
| LOD (Level of Detail) | Các mức chi tiết của mesh theo khoảng cách |
| Culling | Loại bỏ những gì không nhìn thấy khỏi việc render |
| Draw call | Một lệnh vẽ gửi xuống GPU — càng ít càng tốt |
| Streaming | Nạp/giải phóng dữ liệu dần theo nhu cầu |
| Frame time | Thời gian dựng một khung hình (ms) — 16.6 ms = 60 FPS |
| Bottleneck | Điểm nghẽn quyết định hiệu năng tổng |
| Collision | Va chạm; xác định vật cản/xuyên qua |
| Trace / Raycast | Bắn tia tìm vật thể trên đường đi |
| NavMesh | Lưới vùng AI đi lại được |
| Replication | Đồng bộ trạng thái từ server xuống client |
| Authority | Quyền "nguồn sự thật" (thuộc server) |
| RPC | Gọi hàm từ máy này sang máy kia |
| Delegate / Event Dispatcher | Cơ chế phát sự kiện – đăng ký lắng nghe |
| Garbage Collection (GC) | Tự động thu hồi object không còn được tham chiếu |
| Cook | Chuyển asset sang định dạng tối ưu cho platform đích |
| Package / Build | Đóng gói game thành bản chạy độc lập |
| Plugin | Gói mở rộng tính năng cho engine/project |
| Deprecated | Bị đánh dấu sẽ loại bỏ — tránh dùng cho code mới |
| CVar (console variable) | Biến cấu hình chỉnh qua console (`r.`, `t.`, `sg.`...) |

---

## Nguồn tham khảo

**Nguồn chính thức (Epic Games)**
- Unreal Engine 5.6 release announcement — unrealengine.com/news/unreal-engine-5-6-is-now-available
- State of Unreal 2025 recap — unrealengine.com/news/all-the-big-news-and-announcements-from-the-state-of-unreal-2025
- Unreal Engine 5.6 / 5.7 / 5.8 Release Notes — dev.epicgames.com/documentation
- **Unreal Engine 5.8 release announcement — unrealengine.com/news/unreal-engine-5-8-is-now-available** *(mới)*
- **"The road to UE6" (Marcus Wassmer) — unrealengine.com/news/the-road-to-ue-6** *(mới)*
- Coding in Unreal Engine: Blueprint vs. C++ — dev.epicgames.com/documentation/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus
- Enhanced Input · Virtual Shadow Maps · Substrate Materials · FBX/Interchange Pipeline · Landscape · PCG · Collision (Epic documentation)
- MetaHuman 5.6 release — metahuman.com/news

**Nguồn cộng đồng/chuyên môn**
- Tom Looman — "Unreal Engine 5.6 Performance Highlights" và "Unreal Gameplay Framework Guide for C++" (tomlooman.com)
- GASDocumentation (tranek) — deepwiki.com/tranek/GASDocumentation
- CG Channel — tổng hợp tính năng UE 5.6, 5.7, 5.8 cho CG artist (cgchannel.com)
- 3DArt — "Control Rig Physics in Unreal Engine 5.6" (3dart.it)
- Mixing Blueprints & C++ — Unreal Engine Community Wiki (unrealcommunity.wiki)
- "Blender to UE5: the complete export pipeline" (Hyperdense, Substack/Medium)
- Biunivoca, GamesBeat, 80.lv, Guru3D, TechTimes — tin tức UE 5.8 / State of Unreal 2026 / UE6

---

**Changelog**
- **v2.0 (3/7/2026)**: Kiểm chứng lại toàn bộ mốc version sau khi UE 5.8 phát hành (MegaLights/Mutable/Dataflow Production-Ready — xác nhận theo release notes chính thức; UE6 EA Q4/2027). Bổ sung 9 mục mới: Dữ liệu & SaveGame (7), Collision/Trace (9), Multiplayer cơ bản (12), Ánh sáng cơ bản (16), Landscape/Foliage/Water (20), PCG (21), Modeling Mode (22), Fab (trong 28), VR/XR (32). Thêm bộ đào tạo nội bộ: hướng dẫn tổ chức khóa học (36), bài tập + câu hỏi ôn tập (38), checklist project mới và glossary (Phụ lục). Đánh số lại mục lục 1–40.
- **v1.0 (6/2026)**: Bản tổng hợp và đối chiếu ban đầu, 30 mục.

> *Khi áp dụng vào dự án thực tế, luôn đối chiếu lại với release notes của đúng version engine đang dùng.*
