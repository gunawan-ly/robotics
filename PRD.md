# Product Requirements Document

# Miniature AI Provider Room

**Version:** 1.0
**Status:** Ready for Development
**Product Type:** Interactive 3D Web Visualization
**Primary Integration:** 9Router
**Primary Focus Model:** "oc/deepseek-v4-flash-free"
**Development Method:** AI-assisted / Vibe Coding

---

## 1. Product Vision

Membangun sebuah halaman web yang memvisualisasikan aktivitas AI provider melalui sebuah ruangan miniatur 3D.

Setiap provider direpresentasikan oleh sebuah robot kecil yang memiliki meja kerja dan tempat duduknya sendiri.

Dalam kondisi normal, robot berada dalam keadaan idle dan berdiri di samping tempat duduknya.

Ketika provider menerima dan memproses request:

- robot berjalan/bergerak secara minimal menuju kursinya,
- robot duduk,
- robot melakukan animasi kerja sederhana,
- kepala dan tubuh melakukan gerakan natural kecil,
- indikator atau perangkat di meja dapat berubah,
- teks kecil muncul di atas kepala robot dan berganti-ganti selama proses berlangsung.

Ketika request selesai:

- robot menghentikan animasi kerja,
- kembali ke keadaan idle,
- berdiri kembali di samping tempat duduknya.

Tujuan utama produk bukan menyediakan dashboard analitik yang kompleks.

Tujuan utamanya adalah memberikan visualisasi yang hidup dan menyenangkan terhadap aktivitas request AI secara real-time.

---

## 2. Core Concept

Konsep visual:

«A tiny AI laboratory where every AI provider has its own little worker robot.»

Ruangan terlihat seperti laboratorium/server room miniatur.

Setiap robot adalah "pekerja" yang mewakili provider/model tertentu.

Contoh:

```
┌───────────────────────────────────────────┐
│           MINIATURE AI ROOM               │
│                                           │
│  🤖 OpenCode        🤖 DeepSeek           │
│      │                   │                │
│     🪑                  🪑                 │
│     🖥️                  🖥️                 │
│                                           │
│             ┌────────────┐                │
│             │  9ROUTER   │                │
│             │    CORE    │                │
│             └────────────┘                │
│                                           │
│  🤖 MiMo           🤖 Nemotron            │
│      │                   │                │
│     🪑                  🪑                 │
│     🖥️                  🖥️                 │
│                                           │
└───────────────────────────────────────────┘
```

Tidak diperlukan pergerakan robot yang kompleks.

Robot tidak berjalan mengelilingi ruangan, tidak melakukan pathfinding, dan tidak berpindah-pindah tempat secara bebas.

Setiap robot memiliki area kerja tetap.

---

## 3. Primary User Experience

Ketika halaman dibuka:

Semua robot berada dalam keadaan idle.

Contoh:

```
OpenCode       → standing / idle
MiMo           → standing / idle
DeepSeek       → standing / idle
Nemotron       → standing / idle
OpenRouter     → standing / idle
```

Kemudian sebuah request nyata masuk melalui 9Router.

Misalnya:

```
Model:
oc/deepseek-v4-flash-free
```

Maka hanya robot DeepSeek yang bereaksi.

Urutan visual:

```
REQUEST DETECTED
       ↓
DeepSeek robot notices activity
       ↓
Robot moves naturally to chair
       ↓
Robot sits
       ↓
Working animation begins
       ↓
Floating text appears
       ↓
Request completes
       ↓
Working animation stops
       ↓
Robot stands
       ↓
Return to idle
```

Transisi harus terasa halus dan natural.

---

## 4. MVP Scope

MVP hanya membutuhkan:

**Scene**

- satu ruangan miniatur,
- kamera fixed/isometric,
- beberapa meja kerja,
- beberapa kursi,
- monitor/perangkat kerja,
- dekorasi sederhana,
- robot provider,
- satu pusat/router visual.

**Robot**

Setiap robot memiliki:

- posisi tetap,
- meja kerja,
- kursi,
- idle state,
- working state,
- transition animation,
- floating text,
- indikator aktivitas.

**Request**

Website harus menerima real request activity dari 9Router.

Tidak menggunakan fake/random request sebagai sumber utama.

Simulator hanya boleh digunakan sebagai development/debugging fallback jika diperlukan.

**Real-time reaction**

Ketika request yang sesuai terdeteksi:

```
Provider X → Robot X reacts
```

Tidak semua robot bergerak.

**Primary model**

Prioritas implementasi pertama:

```
oc/deepseek-v4-flash-free
```

Model ini direpresentasikan sebagai robot DeepSeek Judge.

Robot ini harus menjadi robot yang paling matang animasinya pada MVP.

---

## 5. Provider List

MVP awal menggunakan provider/model yang terlihat pada sistem pengguna.

Minimal:

```
OpenCode Free
MiMo Code Free
DeepSeek
NVIDIA Nemotron
OpenRouter
```

Namun sistem provider harus dibuat data-driven.

Jangan membuat setiap robot sebagai implementasi hardcoded yang berbeda.

Contoh konsep:

```ts
{
  id: "deepseek",
  name: "DeepSeek",
  modelIds: [
    "oc/deepseek-v4-flash-free"
  ],
  position: [...],
  deskPosition: [...],
  chairPosition: [...],
  role: "judge"
}
```

Dengan pendekatan ini, provider baru dapat ditambahkan melalui konfigurasi.

---

## 6. DeepSeek Judge

Robot DeepSeek menjadi fokus utama MVP.

Model:

```
oc/deepseek-v4-flash-free
```

Role:

```
Judge
```

Robot DeepSeek harus mempunyai visual identity yang mudah dikenali tetapi tetap mengikuti style keseluruhan ruangan.

Saat request masuk:

```
DeepSeek
     ↓
detect request
     ↓
sit
     ↓
work
     ↓
judge
     ↓
complete
     ↓
stand
```

Floating text dapat menggunakan kata/frasa pendek yang berubah selama proses.

Contoh:

```
Thinking...
Analyzing...
Checking...
Evaluating...
Judging...
Processing...
Reviewing...
```

Teks tidak perlu berasal dari isi respons AI.

Floating text merupakan visual animation state, bukan output model.

---

## 7. Robot State Machine

Setiap robot minimal memiliki state berikut:

```
IDLE
  ↓
NOTICE
  ↓
SITTING
  ↓
WORKING
  ↓
SUCCESS
  ↓
STANDING
  ↓
IDLE
```

### IDLE

Robot berdiri di samping kursinya.

Animasi sangat minimal:

- sedikit gerakan kepala,
- sedikit gerakan tubuh,
- sesekali melihat monitor,
- breathing/idle motion,
- optional blinking.

Robot tidak boleh terlihat seperti patung.

Namun gerakan harus sangat halus.

### NOTICE

Ketika request terdeteksi:

- robot memberikan reaksi kecil,
- kepala menoleh,
- perhatian berpindah ke workstation.

Durasi pendek.

Tujuannya memberikan kesan:

«"Oh, ada pekerjaan."»

### SITTING

Robot berpindah ke posisi duduk dengan animasi sederhana.

Tidak diperlukan simulasi fisika.

Gunakan predetermined animation/transition.

### WORKING

Robot duduk di depan meja.

Animasi:

- kepala sedikit bergerak,
- melihat monitor,
- tangan bergerak kecil,
- tubuh sedikit bergerak,
- monitor aktif,
- indikator workstation aktif.

Tidak diperlukan animasi mengetik yang sangat detail.

Natural movement lebih penting daripada banyak movement.

### FLOATING TEXT

Selama working state, tampilkan teks kecil di atas kepala robot.

Teks berganti secara berkala.

Contoh:

```
Thinking...
Analyzing...
Processing...
Checking...
Judging...
```

Text transition:

```
fade out
    ↓
change text
    ↓
fade in
```

Jangan membuat teks terlalu besar.

Teks harus terasa seperti bagian dari dunia miniatur.

### SUCCESS

Ketika request selesai:

- robot berhenti bekerja,
- monitor kembali ke keadaan normal,
- floating text menghilang,
- optional small success indicator.

Tidak perlu animasi kemenangan yang berlebihan.

### STANDING

Robot berdiri kembali.

Kemudian kembali ke posisi idle di samping kursi.

---

## 8. Natural Animation Philosophy

Prinsip utama animasi:

«Small movement > excessive movement»

Robot tidak perlu:

- berlari,
- berjalan keliling,
- melompat,
- melakukan gesture besar,
- melakukan animasi dramatis.

Robot harus terasa seperti seseorang yang sedang bekerja di meja.

Gerakan yang diutamakan:

- head movement,
- eye direction,
- slight body movement,
- hand movement,
- breathing,
- monitor interaction,
- subtle idle motion.

Jika sebuah animasi terlihat mencolok tetapi tidak memberikan informasi tambahan, jangan digunakan.

---

## 9. Camera

Kamera fixed/isometric.

Tidak menggunakan:

- free camera,
- FPS camera,
- orbit camera sebagai primary interaction,
- user-controlled camera movement.

User harus langsung melihat keseluruhan ruangan.

Optional:

- very subtle camera movement,
- gentle zoom,
- cinematic micro-motion.

Namun fitur tersebut bukan requirement MVP.

---

## 10. Visual Style

Style:

«Cute miniature AI laboratory»

Karakteristik:

- miniature,
- clean,
- soft,
- stylized,
- slightly futuristic,
- friendly,
- technical,
- cozy,
- polished.

Hindari:

- cyberpunk berlebihan,
- dark hacker aesthetic,
- realistic military/server room,
- terlalu banyak neon,
- terlalu banyak UI overlay,
- visual yang terasa seperti game FPS.

Ruangan harus terasa seperti diorama digital yang hidup.

---

## 11. 3D Assets

Developer tidak diwajibkan membuat aset 3D dari nol.

Gunakan existing 3D assets yang memiliki lisensi yang sesuai.

**Prioritas asset**

**Robot**

Satu base robot model sudah cukup.

Robot dapat dibedakan melalui:

- warna,
- logo,
- monitor,
- accessory,
- badge,
- nameplate.

Tidak diperlukan model robot unik untuk setiap provider.

**Environment**

Gunakan asset siap pakai untuk:

- meja,
- kursi,
- monitor,
- komputer,
- server rack,
- lampu,
- tanaman/dekorasi,
- kabel,
- rak,
- ruangan.

**Format**

Prioritaskan:

```
.glb
.gltf
```

Asset harus:

- web-friendly,
- low-poly atau optimized,
- memiliki ukuran file wajar,
- memiliki lisensi yang memungkinkan penggunaan pada proyek.

Jangan memasukkan asset berlisensi tidak jelas hanya karena terlihat bagus.

---

## 12. 3D Performance

Karena scene ditampilkan pada perangkat mobile juga, performa menjadi prioritas.

Target:

- smooth rendering,
- tidak terlalu banyak polygon,
- texture resolution tidak berlebihan,
- jumlah dynamic lights terbatas,
- gunakan baked/static lighting jika diperlukan,
- hindari efek post-processing berat.

Jangan mengorbankan performance hanya untuk visual.

Target utama:

«Smooth > photorealistic»

---

## 13. Recommended Tech Stack

**Frontend**

```
Next.js
React
TypeScript
Three.js
React Three Fiber
@react-three/drei
```

React Three Fiber digunakan sebagai abstraction layer untuk scene Three.js karena memungkinkan scene 3D dibangun menggunakan reusable React components.

**Animation**

Prioritas:

```
Three.js Animation System
React Three Fiber
GLTF/GLB animations
```

Tambahkan library animation tambahan hanya jika benar-benar diperlukan.

Jangan menambahkan dependency hanya untuk animasi sederhana.

**Backend**

```
Node.js / Next.js server
```

Backend bertugas menangani komunikasi dengan 9Router.

---

## 14. 9Router Integration

Website harus menggunakan 9Router sebagai sumber request nyata.

9Router menyediakan OpenAI-compatible API, sehingga model dapat diidentifikasi berdasarkan request model yang diterima.

Namun developer tidak boleh mengasumsikan endpoint monitoring/log tertentu tanpa memeriksa API 9Router yang benar-benar digunakan oleh user.

Developer harus terlebih dahulu:

1. memeriksa API yang tersedia,
2. menentukan cara paling reliable untuk mengetahui request masuk,
3. menentukan bagaimana provider/model yang menangani request dapat diketahui,
4. menentukan bagaimana request completion dapat diketahui.

Prioritas:

```
9Router
   ↓
Request/Event Detection
   ↓
Backend
   ↓
WebSocket / SSE / suitable realtime mechanism
   ↓
Frontend
   ↓
Robot State
```

---

## 15. API Key Security

API key 9Router tidak boleh ditanam langsung di client-side JavaScript.

Jangan:

```
Browser
   ↓
9Router API Key
```

Gunakan:

```
Browser
   ↓
Application Backend
   ↓
9Router
```

API key disimpan sebagai environment variable/server-side secret.

Contoh:

```
ROUTER_API_URL=
ROUTER_API_KEY=
```

Jangan commit ".env" ke repository.

---

## 16. Event Architecture

Frontend tidak perlu mengetahui detail internal 9Router.

Backend mengubah aktivitas menjadi event sederhana.

Contoh:

```json
{
  "type": "provider_request_started",
  "provider": "deepseek",
  "model": "oc/deepseek-v4-flash-free",
  "timestamp": 123456789
}
```

Saat selesai:

```json
{
  "type": "provider_request_completed",
  "provider": "deepseek",
  "model": "oc/deepseek-v4-flash-free",
  "timestamp": 123456799
}
```

Frontend hanya perlu memahami:

```
START
STOP
```

dan mengubah state robot.

---

## 17. Provider → Robot Mapping

Buat satu mapping layer.

Contoh:

```
Request model
      ↓
Provider Resolver
      ↓
Robot ID
      ↓
Robot State
```

Contoh:

```
oc/deepseek-v4-flash-free
        ↓
deepseek
        ↓
DeepSeek Robot
        ↓
WORKING
```

Dengan cara ini, perubahan model tidak memerlukan perubahan besar pada scene.

---

## 18. Request Lifecycle

Example:

```
User sends request
        ↓
9Router receives request
        ↓
9Router selects provider/model
        ↓
Website detects provider activity
        ↓
DeepSeek Robot → NOTICE
        ↓
DeepSeek Robot → SITTING
        ↓
DeepSeek Robot → WORKING
        ↓
Floating text starts
        ↓
Request completes
        ↓
DeepSeek Robot → SUCCESS
        ↓
DeepSeek Robot → STANDING
        ↓
DeepSeek Robot → IDLE
```

Transition harus memiliki easing yang natural.

Tidak boleh ada perubahan state yang terlihat patah.

---

## 19. Multiple Concurrent Requests

MVP harus memiliki behavior yang masuk akal ketika lebih dari satu provider aktif bersamaan.

Contoh:

```
DeepSeek      → WORKING
OpenRouter    → WORKING
MiMo          → IDLE
Nemotron      → IDLE
OpenCode      → WORKING
```

Setiap robot harus memiliki state sendiri.

Request pada satu robot tidak boleh mengubah state robot lain.

Tidak diperlukan sistem queue visual yang kompleks.

---

## 20. UI

UI harus minimal.

Halaman utama terutama berisi scene.

Optional small overlay:

```
● LIVE
```

atau:

```
LIVE • 9Router Connected
```

Jangan membuat dashboard tabel besar sebagai primary interface.

Jika ingin menampilkan informasi tambahan, gunakan overlay kecil seperti:

```
DeepSeek
Judge
Working
```

Namun informasi tersebut tidak boleh mengganggu scene.

---

## 21. Loading State

Ketika scene sedang dimuat:

```
Loading AI Room...
```

Setelah seluruh asset penting siap:

```
AI Room Ready
```

Hindari blank white screen.

---

## 22. Error State

Jika 9Router tidak dapat dihubungi:

```
9Router Offline
```

Scene tetap dapat ditampilkan.

Robot tetap berada pada idle state.

Jangan membuat seluruh halaman gagal hanya karena API tidak tersedia.

---

## 23. Development Mode

Walaupun production menggunakan real request, developer diperbolehkan membuat internal development trigger.

Contoh:

```
/debug/deepseek/start
/debug/deepseek/stop
```

atau tombol development-only.

Tujuannya hanya untuk menguji animasi tanpa harus melakukan request AI setiap kali.

Development simulator:

```
DeepSeek → Start
DeepSeek → Working
DeepSeek → Stop
DeepSeek → Idle
```

Simulator harus:

- mudah dihapus,
- tidak aktif di production,
- tidak mengubah arsitektur real event.

---

## 24. Responsive Design

Primary target:

```
Desktop
Mobile
Tablet
```

Pada mobile, scene harus tetap dapat terlihat dengan jelas.

Kamera tidak boleh membuat robot utama keluar dari layar.

Gunakan responsive renderer/camera adjustment.

---

## 25. Accessibility

Minimal:

- jangan mengandalkan warna saja untuk status,
- gunakan text/status tambahan jika diperlukan,
- respect "prefers-reduced-motion".

Jika user mengaktifkan reduced motion:

- kurangi idle animation,
- kurangi camera movement,
- tetap tampilkan state perubahan secara visual sederhana.

---

## 26. Out of Scope

Developer JANGAN menambahkan fitur berikut pada MVP tanpa permintaan baru:

- authentication,
- user account,
- database analytics,
- token analytics dashboard,
- request history dashboard,
- provider management UI,
- API key management UI,
- chat interface,
- prompt editor,
- model selector,
- free camera,
- multiplayer,
- robot pathfinding,
- physics simulation,
- complex AI behavior,
- voice,
- sound system kompleks,
- inventory,
- game mechanics,
- achievements,
- gamification,
- 3D world exploration.

Fokus:

«Request masuk → robot bereaksi secara natural.»

---

## 27. Suggested Project Structure

Contoh struktur:

```
src/
├── app/
│   ├── page.tsx
│   └── api/
│
├── components/
│   ├── room/
│   │   ├── AIRoom.tsx
│   │   ├── RoomEnvironment.tsx
│   │   ├── RouterCore.tsx
│   │   └── Workstation.tsx
│   │
│   ├── robots/
│   │   ├── ProviderRobot.tsx
│   │   ├── RobotModel.tsx
│   │   ├── RobotAnimation.tsx
│   │   └── FloatingThought.tsx
│   │
│   └── ui/
│
├── config/
│   └── providers.ts
│
├── events/
│   ├── eventTypes.ts
│   └── providerResolver.ts
│
├── hooks/
│   └── useRouterEvents.ts
│
└── lib/
    └── router/
```

Struktur ini merupakan rekomendasi awal dan boleh diubah oleh Engineer jika ada alasan teknis yang lebih baik.

---

## 28. Acceptance Criteria

MVP dianggap berhasil apabila:

### Scene

- [ ] Ruangan miniatur dapat ditampilkan.
- [ ] Kamera fixed/isometric.
- [ ] Semua robot terlihat pada initial viewport.
- [ ] Setiap robot memiliki workstation sendiri.
- [ ] Robot memiliki idle animation sederhana.

### Robot

- [ ] Robot idle berdiri di samping kursi.
- [ ] Robot dapat duduk ketika menerima request.
- [ ] Robot memiliki working animation.
- [ ] Robot memiliki natural head/body movement.
- [ ] Floating text muncul ketika working.
- [ ] Floating text dapat berganti secara smooth.
- [ ] Robot dapat berdiri kembali setelah request selesai.
- [ ] Robot kembali ke idle state.

### DeepSeek

- [ ] "oc/deepseek-v4-flash-free" dikenali.
- [ ] Request model tersebut memicu robot DeepSeek.
- [ ] Robot DeepSeek menjadi demonstrasi utama animasi.
- [ ] Start request dan completion request dapat dibedakan.

### Realtime

- [ ] Real request dari 9Router dapat memicu perubahan state.
- [ ] Request ke provider lain tidak mengaktifkan robot DeepSeek.
- [ ] Beberapa robot dapat bekerja bersamaan.
- [ ] State satu robot tidak mengganggu robot lainnya.

### Performance

- [ ] Scene tetap smooth pada perangkat yang menjadi target.
- [ ] Asset tidak terlalu berat.
- [ ] Tidak terjadi memory leak yang terlihat selama penggunaan normal.
- [ ] Tidak ada dependency berat yang tidak diperlukan.

### Security

- [ ] API key tidak dikirim ke browser.
- [ ] API key tidak masuk repository.
- [ ] ".env" berada di ".gitignore".
- [ ] Komunikasi dengan 9Router dilakukan melalui mekanisme server-side yang aman.

---

## 29. Development Phases

### Phase 1 — Static Room

Buat:

```
Room
Desk
Chair
Monitor
Robot
Router Core
Camera
Lighting
```

Belum perlu integrasi 9Router.

Goal:

«Ruangan terlihat bagus.»

### Phase 2 — Robot Animation

Implementasikan:

```
IDLE
NOTICE
SITTING
WORKING
SUCCESS
STANDING
```

Fokus utama pada DeepSeek robot.

Goal:

«Robot terlihat hidup walaupun belum menerima request nyata.»

### Phase 3 — Event System

Buat internal event simulator.

Contoh:

```
START DEEPSEEK
STOP DEEPSEEK
```

Goal:

«Animasi dapat dikontrol oleh event, bukan hardcoded timeline.»

### Phase 4 — 9Router Integration

Hubungkan real request.

Goal:

```
Real 9Router request
        ↓
DeepSeek robot reacts
```

Ini adalah milestone utama.

### Phase 5 — Other Providers

Tambahkan:

```
OpenCode
MiMo
Nemotron
OpenRouter
```

Gunakan sistem konfigurasi provider yang sama.

Goal:

«Semua provider dapat divisualisasikan tanpa membuat ulang animation system.»

### Phase 6 — Polish

Perbaiki:

- easing,
- timing,
- lighting,
- camera framing,
- asset optimization,
- loading,
- responsive layout,
- subtle idle movement.

Jangan menambahkan fitur baru.

---

## 30. Definition of Done

Proyek dianggap selesai apabila user dapat:

1. Membuka website.
2. Melihat seluruh AI miniature room.
3. Melihat robot dalam keadaan idle.
4. Mengirim request melalui 9Router.
5. Melihat robot provider yang sesuai menyadari request.
6. Melihat robot duduk.
7. Melihat robot melakukan aktivitas kerja sederhana.
8. Melihat floating text berganti.
9. Melihat robot berhenti ketika request selesai.
10. Melihat robot kembali berdiri dan idle.

Pengalaman tersebut harus terasa:

«simple, smooth, natural, alive.»

Bukan kompleks.

Bukan seperti game.

Bukan dashboard tradisional.

Melainkan seperti melihat sebuah miniatur AI laboratory yang benar-benar sedang bekerja.

---

## 31. Engineering Principle

Engineer harus selalu memprioritaskan:

```
Smoothness
    >
Natural movement
    >
Visual clarity
    >
Feature quantity
```

Jika harus memilih antara:

```
10 animasi biasa
```

atau:

```
3 animasi yang sangat halus
```

pilih:

```
3 animasi yang sangat halus
```

Jika sebuah fitur tidak membantu user memahami:

«"Robot ini sedang bekerja"»

maka fitur tersebut kemungkinan tidak diperlukan untuk MVP.

---

## 32. Final Product Character

Produk harus memberikan kesan:

«"Aku sedang melihat sekumpulan AI kecil yang bekerja di sebuah ruangan."»

Bukan:

«"Aku sedang melihat dashboard API."»

Dan bukan:

«"Aku sedang memainkan game 3D."»

Visualisasi harus berada tepat di tengah:

```
Miniature + Technical + Alive + Calm + Cute
```

Dengan fokus utama pada satu hal:

```
Watch the AI work.
```
