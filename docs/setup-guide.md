# Career Lab — Panduan Setup & Workflow (Step-by-Step)

> Panduan ini dibuat supaya kamu selalu tahu: lagi di sprint mana, ngerjain apa, dan tools apa yang dipakai. Ikutin urutannya, jangan loncat-loncat.

---

## 0. Konsep Dasar (baca sekali, lalu lanjut ke Step 1)

- **GitHub (repo)** = gudang file. Semua dokumen final disimpan di sini dengan riwayat perubahan.
- **GitHub Projects** = papan kerja (kanban). Tab di dalam repo yang sama, bukan situs terpisah.
- **Draw.io / Figma / Google Drive** = tempat kamu *membuat* konten. Hasil akhirnya di-export/upload ke repo.
- **WBS project ini cukup 2 level**: Sprint → Deliverable. Task detail tinggal jadi checklist di dalam 1 Issue, tidak perlu didokumentasikan terpisah.

---

## 1. Selesaikan Sprint 0 dulu (kalau belum ada filenya)

Sprint 0 dianggap selesai kalau ada **1 file konkret**, bukan cuma hasil ngobrol.

**Tools:** Notion atau Word (bebas, isinya pendek)

**Isi minimal (boleh 1 halaman aja):**
- Vision (1-2 kalimat)
- Background / Problem Statement
- Goals (6 bulan & 2 tahun)
- Target User

> Kabar baik: sebagian besar ini **sudah ada** di README kamu (section "Project Overview"). Tinggal copy-paste jadi file `project-overview.md` atau `.docx` sendiri kalau mau dipisah.

**Output:** `project-overview.md` (atau `.docx`)

---

## 2. Setup Repository GitHub (kalau belum)

1. Buka github.com → klik **New repository**
2. Nama: `career-lab`
3. Centang **Add a README file**
4. Set ke **Public** (kalau mau dipamerin ke recruiter) atau **Private** (kalau masih draft)
5. Klik **Create repository**

### Buat struktur folder minimal (jangan bikin folder kosong yang belum ada isinya!)

```text
career-lab/
├── README.md
├── docs/
│   ├── project-overview.md
│   ├── requirement-specification.md
│   ├── setup-guide.md
│   └── roadmap/
│       └── product-roadmap.md
├── database/
│   └── CareerLab_Data_Dictionary.xlsx
└── analysis/
    ├── conceptual-erd.png
    └── logical-erd.png
```

> Folder `ui/`, `portfolio/`, `src/` **belum perlu dibuat sekarang** — bikin nanti pas beneran mulai ngerjain bagian itu (Sprint 2 dst). Folder kosong cuma bikin bingung.

**Cara upload file:** buka repo → klik **Add file → Upload files** → drag file dari komputer (bisa langsung dari hasil export Draw.io / Excel kamu). Tidak perlu command line dulu.

---

## 3. Setup GitHub Projects (papan kerja)

1. Di repo kamu, klik tab **Projects** (sejajar dengan Code, Issues)
2. Klik **New project** → pilih template **Board** (kanban)
3. Bikin 3 kolom: `To Do`, `In Progress`, `Done`

### Bikin Milestone untuk tiap Sprint

1. Klik tab **Issues** → **Milestones** → **New milestone**
2. Bikin 9 milestone: `Sprint 0` sampai `Sprint 8`
3. Isi deskripsi tiap milestone pakai tabel WBS di `docs/roadmap/product-roadmap.md`

### Bikin Issue untuk tiap Deliverable

1. Klik tab **Issues** → **New issue**
2. Judul: nama deliverable (misal "Requirement Specification")
3. Assign ke Milestone yang sesuai (misal "Sprint 1")
4. Di deskripsi, tulis checklist sub-task, contoh:
   ```
   - [ ] Problem Statement
   - [ ] Functional Requirements
   - [ ] Non-Functional Requirements
   - [ ] User Persona
   ```
5. Drag issue ini ke kolom "In Progress" di board

Setiap kamu selesai satu bagian, centang checklist-nya. Progress bar milestone otomatis update. Ini pengganti Google Task kamu.

---

## 4. WBS Lengkap — Sprint 0 sampai 8

> Tabel WBS lengkap (Sprint, Fokus, Deliverable, Tools, Status) sudah dipindah ke **`docs/roadmap/product-roadmap.md`** supaya cuma ada 1 sumber data yang perlu diupdate. Cek file itu untuk rincian tiap sprint.

Setiap baris "Deliverable" di file tersebut = 1 Milestone di GitHub. Setiap kata yang dipisah koma = 1 Issue di dalam milestone itu.

---

## 5. Alur kerja harian (biar nggak bingung lagi)

1. Buka tab **Projects** di repo → lihat kolom "In Progress" → itu yang lagi kamu kerjain
2. Kerjain di tools yang sesuai (Notion/Draw.io/Figma/Excel)
3. Export/save hasilnya
4. Upload ke folder yang sesuai di repo (`Add file → Upload files`)
5. Centang checklist di Issue terkait
6. Kalau semua checklist di 1 Issue selesai → close issue, drag ke "Done"
7. Kalau semua Issue di 1 Milestone selesai → Sprint itu resmi kelar, lanjut ke Milestone berikutnya

---

## 6. Status kamu sekarang (per tanggal panduan ini direvisi — Juli 2026)

- **Sprint 0** ✅ Selesai — `project-overview.md` sudah ada
- **Sprint 1** ✅ Selesai — Conceptual ERD, Logical ERD, Data Dictionary (21 entities, 5 modules A–E), dan Requirement Specification sudah final dan saling selaras
- **Sprint 2** ⏭️ Belum mulai — fokus berikutnya: UI/UX Design (Wireframe, Prototype) pakai Figma

**Fokus sekarang: mulai Sprint 2 — Wireframe & Prototype di Figma.**
