# Career Lab — Requirement Specification

**Sprint:** 1 — System Analysis & Database Design
**Status:** Draft v1.0
**Author:** Shirlena Anaya Kailani
**Last Updated:** July 2026
**Rujukan:** `00_project-overview.md`, `Career_Lab_Data_Dictionary_v3.xlsx`

---

## 1. Background

Lihat `00_project-overview.md` bagian Background & Problem Statement. Secara singkat: pengalaman mahasiswa Information Systems selama kuliah tersebar di berbagai platform sehingga sulit dijadikan dasar pengambilan keputusan karier.

---

## 2. Objectives

Career Lab bertujuan membangun sistem yang mampu:

- Mengintegrasikan seluruh data perkembangan karier
- Memetakan skill berdasarkan pengalaman nyata
- Membantu mengevaluasi berbagai career experiment
- Menghasilkan portfolio profesional
- Mempersiapkan proses internship maupun pekerjaan pertama

---

## 3. Target User / User Persona

| Field | Value |
|---|---|
| Nama | Shirlena Anaya Kailani |
| Peran | Mahasiswa Information Systems |
| Goal | Menjadi Business Analyst dengan portofolio karier yang terstruktur |
| Pain Point | LinkedIn kosong, CV kurang kuat, bingung arah karier, pengalaman project tersebar |
| Kebutuhan | Career dashboard, portfolio, learning tracker, career experiment tracker |
| Motivasi | Berubah-ubah — butuh sistem yang membantu konsisten, bukan bergantung mood |

---

## 4. Scope

### In Scope (Sprint 1)
- Conceptual ERD & Logical ERD
- Data Dictionary (21 entity, 5 modul)
- Requirement Specification (dokumen ini)

### Out of Scope (Sprint 1)
- Implementasi database nyata (PostgreSQL) → Sprint 3
- UI/UX (wireframe, prototype) → Sprint 2
- Autentikasi, deployment, web app → Sprint 7

---

## 5. Functional Requirements

Diturunkan langsung dari 21 entity di Data Dictionary, dikelompokkan per modul.

### Module A — Career Discovery
| ID | Requirement |
|---|---|
| FR-01 | User dapat membuat dan mengelola Career Path (nama, deskripsi, alasan, prioritas, status) |
| FR-02 | User dapat membuat Career Experiment untuk menguji suatu career path |
| FR-03 | User dapat mencatat Weekly Reflection untuk setiap career experiment yang berjalan |

### Module B — Professional Experience
| ID | Requirement |
|---|---|
| FR-04 | User dapat mencatat Experience (organisasi, magang, kegiatan, dsb) |
| FR-05 | User dapat mencatat Project beserta detailnya (jenis, peran, status, semester) |
| FR-06 | User dapat mengelola daftar Skill master (nama, kategori, level proficiency) |
| FR-07 | User dapat menghubungkan Skill ke Project beserta level penggunaannya |
| FR-08 | User dapat menghubungkan Skill ke Experience beserta level penggunaannya |
| FR-09 | User dapat menambahkan Link pendukung (GitHub, demo, dsb) ke suatu Project |

### Module C — Learning Ecosystem
| ID | Requirement |
|---|---|
| FR-10 | User dapat mencatat item Learning (course, buku, video) beserta progress |
| FR-11 | User dapat menghubungkan Learning ke Skill yang dikembangkan |
| FR-12 | User dapat mencatat Certificate yang diperoleh |
| FR-13 | User dapat menghubungkan Certificate ke Skill terkait |

### Module D — Career Preparation
| ID | Requirement |
|---|---|
| FR-14 | User dapat mencatat Application (lamaran kerja) beserta status prosesnya |
| FR-15 | User dapat menyusun Interview Story dengan format STAR (Situation, Task, Action, Result) |
| FR-16 | User dapat menghubungkan Interview Story ke Project pendukung |
| FR-17 | User dapat menghubungkan Interview Story ke Experience pendukung |

### Module E — Supporting Entity
| ID | Requirement |
|---|---|
| FR-18 | User dapat menyimpan Evidence (file, url, screenshot, deskripsi) |
| FR-19 | User dapat menghubungkan Evidence ke Project |
| FR-20 | User dapat menghubungkan Evidence ke Experience |
| FR-21 | User dapat menghubungkan Evidence ke Interview Story |

---

## 6. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performance | Response time < 2 detik untuk operasi baca/tulis data (target saat web app aktif) |
| Security | Akses dibatasi single-user pada tahap MVP; rencana Google OAuth saat web app dibangun |
| Availability | Data dapat diakses kapan saja melalui cloud (GitHub repo, Notion, atau database cloud) |
| Usability | Struktur data dan dashboard mudah dipahami, mengikuti pembagian 5 modul yang konsisten |
| Maintainability | Skema database mengikuti 3NF, penamaan tabel/kolom konsisten (snake_case) |
| Portability | Data Dictionary kompatibel untuk implementasi langsung ke PostgreSQL |

---

## 7. Success Metrics

- Sprint 1 dianggap selesai ketika seluruh deliverable (ERD, Data Dictionary, Requirement Spec) sudah ter-upload ke repository GitHub dan Milestone "Sprint 1" mencapai 100% closed.
- Setiap Functional Requirement (FR-01 s.d. FR-21) dapat ditelusuri balik ke entity di Data Dictionary (traceability).

---

## 8. Constraints & Assumptions

- Constraint: pengerjaan dilakukan individu (bukan tim), sehingga scope dijaga tetap realistis per sprint.
- Assumption: kebutuhan sistem tidak berubah drastis sampai Sprint 3 (Database Implementation); jika berubah, ERD & Data Dictionary perlu direvisi terlebih dahulu sebelum lanjut.

---

**Sprint 1 — tinggal deliverable ini yang perlu di-upload ke repo untuk resmi ditutup.**
