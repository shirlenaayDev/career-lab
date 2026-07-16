# Career Lab — Requirement Specification

**Sprint:** 1 — System Analysis & Database Design
**Status:** Final
**Author:** Shirlena Anaya Kailani
**Last Updated:** July 2026
**Referensi:** `project-overview.md`, `conceptual-erd.png`, `logical-erd.png`, `Career_Lab_Data_Dictionary.xlsx`

---

## 1. Problem Statement

Selama perkuliahan banyak aktivitas yang telah dilakukan (project, organisasi, skill baru, sertifikat, GitHub, prototype, mentoring), namun informasinya tersebar di berbagai platform sehingga sulit dijadikan dasar pengambilan keputusan karier. Akibatnya: arah karier tidak jelas, LinkedIn terasa kosong, CV kurang kuat, sulit menjelaskan pengalaman saat interview, dan portfolio tidak berkembang secara konsisten.

---

## 2. User Persona

**Nama:** Shirlena Anaya Kailani
**Role:** Mahasiswa Information Systems, calon Business Analyst
**Kebutuhan:** Sistem tunggal untuk mencatat seluruh proses karier (bukan cuma hasil akhir) supaya keputusan karier, isi LinkedIn/CV, dan cerita interview bisa didasarkan pada bukti nyata.
**Cakupan implementasi saat ini:** Single user (MVP), potensi dikembangkan untuk pengguna lain di masa depan.

---

## 3. Functional Requirements

### Module A — Career Discovery
- **FR-A1**: Sistem dapat mencatat career path (nama, deskripsi, alasan/`why`, prioritas, target timeline, status: Exploring/Focus/Achieved)
- **FR-A2**: Sistem dapat mencatat career experiment yang terhubung ke satu career path (dan opsional ke satu project), berisi judul eksperimen, deskripsi, periode, enjoyment score, difficulty score, keputusan lanjut/berhenti/pivot, dan kesimpulan
- **FR-A3**: Sistem dapat mencatat refleksi mingguan yang terhubung ke career experiment tertentu (minggu ke-, isi refleksi, tantangan, area perbaikan, rencana aksi berikutnya, mood, skor mingguan)

### Module B — Professional Experience
- **FR-B1**: Sistem dapat mencatat project (nama, deskripsi, tipe project, role, semester, status, tanggal mulai/selesai, catatan)
- **FR-B2**: Sistem dapat mencatat link pendukung project (platform, URL — misal GitHub/Figma/demo)
- **FR-B3**: Sistem dapat mencatat pengalaman/organisasi (nama, kategori — Internship/Organization/Volunteer/dll, nama organisasi, role, periode, deskripsi, pencapaian)
- **FR-B4**: Sistem dapat mencatat skill (nama, kategori, level penguasaan, tanggal terakhir dipraktikkan)
- **FR-B5**: Sistem dapat menghubungkan skill ke project tertentu beserta level penggunaannya
- **FR-B6**: Sistem dapat menghubungkan skill ke pengalaman/organisasi tertentu beserta level penggunaannya

### Module C — Learning Ecosystem
- **FR-C1**: Sistem dapat mencatat item pembelajaran (judul, tipe — Course/Book/Video/Article, platform, status, persentase progress, estimasi jam, tanggal mulai/selesai)
- **FR-C2**: Sistem dapat mencatat sertifikat (nama, penerbit, tanggal terbit/kadaluarsa, link/ID kredensial, status verifikasi)
- **FR-C3**: Sistem dapat menghubungkan item pembelajaran ke skill yang dikembangkan
- **FR-C4**: Sistem dapat menghubungkan sertifikat ke skill yang divalidasi

### Module D — Career Preparation
- **FR-D1**: Sistem dapat mencatat lamaran pekerjaan/internship (career path terkait, nama perusahaan, posisi, status lamaran, tanggal apply, tanggal interview, catatan)
- **FR-D2**: Sistem dapat mencatat cerita interview dalam format STAR (situation, task, action, result, lesson learned) yang terhubung ke satu lamaran
- **FR-D3**: Sistem dapat menghubungkan cerita interview ke project pendukung
- **FR-D4**: Sistem dapat menghubungkan cerita interview ke pengalaman/organisasi pendukung

### Module E — Supporting Entity
- **FR-E1**: Sistem dapat menyimpan bukti/evidence (nama file, tipe bukti, URL, deskripsi, tipe file) yang dapat dilampirkan ke project, pengalaman, maupun cerita interview

---

## 4. Non-Functional Requirements

- **NFR1 — Usability**: Sistem harus mudah diisi secara rutin oleh satu pengguna (self-input), tanpa proses entri data yang rumit.
- **NFR2 — Data Integrity**: Struktur data mengikuti Third Normal Form (3NF); seluruh Primary Key menggunakan UUID; relasi many-to-many dipisahkan ke junction table untuk mencegah duplikasi.
- **NFR3 — Extensibility**: Struktur database harus bisa dikembangkan menjadi web application (Laravel + dashboard) pada Sprint 7 tanpa perombakan besar.
- **NFR4 — Data Security**: Data pribadi (career path, refleksi, cerita interview) hanya bisa diakses oleh pemilik akun; tidak ada akses publik ke data mentah.
- **NFR5 — Traceability**: Setiap entity mencatat `created_at` dan `updated_at` untuk melacak riwayat perubahan data.
- **NFR6 — Portability**: Desain database harus kompatibel dengan PostgreSQL sebagai target implementasi di Sprint 3.

---

## 5. Constraints & Assumptions

- Implementasi awal berfokus pada single user (MVP), bukan multi-tenant.
- Tahap pencatatan data awal menggunakan Notion (Sprint 4) sebelum migrasi ke PostgreSQL (Sprint 3) dan web app (Sprint 7).
- Referential action (CASCADE/RESTRICT/SET NULL) belum didefinisikan di Sprint 1 — akan ditentukan saat Database Implementation (Sprint 2/3).

---

## 6. Out of Scope (Sprint 1)

- Implementasi database nyata (PostgreSQL) — Sprint 3
- UI/UX wireframe & prototype — Sprint 2
- Dashboard Notion — Sprint 4
- Web application (Laravel) — Sprint 7

---

**Lokasi file ini di repo:** `docs/requirement-specification.md`
