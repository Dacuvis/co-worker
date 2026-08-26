# Co-Worker API

<p align="center">
	<img src="https://i.pinimg.com/736x/be/49/5a/be495a9ae2bb6de49ac21e5f83f269b6.jpg" alt="Co-Worker API banner" width="100%" />
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Elysia-E91E63?style=for-the-badge&logo=elysia&logoColor=white" alt="Elysia" />
	<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
	<img src="https://img.shields.io/badge/REST_API-0A7EA4?style=for-the-badge&logo=postman&logoColor=white" alt="REST API" />
</p>

<p align="center"><em>REST API untuk mengelola task secara terstruktur dan aman.</em></p>

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
	 1. [Latar Belakang](#11-latar-belakang)
	 2. [Tujuan](#12-tujuan)
2. [Perancangan Sistem](#2-perancangan-sistem)
	 1. [Teknologi yang Digunakan](#21-teknologi-yang-digunakan)
	 2. [Struktur Direktori](#22-struktur-direktori)
	 3. [Model Data](#23-model-data)
3. [Implementasi dan Instalasi](#3-implementasi-dan-instalasi)
	 1. [Prasyarat](#31-prasyarat)
	 2. [Instalasi Dependensi](#32-instalasi-dependensi)
	 3. [Konfigurasi](#33-konfigurasi)
	 4. [Menjalankan Server](#34-menjalankan-server)
4. [Spesifikasi API](#4-spesifikasi-api)
	 1. [Autentikasi](#41-autentikasi)
	 2. [Membuat Task](#42-membuat-task)
	 3. [Mengambil Seluruh Task](#43-mengambil-seluruh-task)
	 4. [Mengambil Task Berdasarkan ID](#44-mengambil-task-berdasarkan-id)
	 5. [Memperbarui Task](#45-memperbarui-task)
	 6. [Menghapus Task](#46-menghapus-task)
	 7. [Chat Rekomendasi AI](#47-chat-rekomendasi-ai)
	 8. [Riwayat Rekomendasi](#48-riwayat-rekomendasi)
	9. [Pencarian Task dan Rekomendasi](#49-pencarian-task-dan-rekomendasi)
5. [Frontend](#5-frontend)
	 1. [Fitur Frontend](#51-fitur-frontend)
	 2. [Menjalankan Frontend](#52-menjalankan-frontend)
6. [Catatan Pengembangan](#6-catatan-pengembangan)
7. [Changelog](#7-changelog)
8. [Penutup](#8-penutup)

## 1. Pendahuluan

### 1.1 Latar Belakang

Co-Worker API adalah layanan backend untuk mengelola daftar pekerjaan (*task*) secara terpusat. Layanan ini menyediakan operasi dasar *create*, *read*, *update*, dan *delete* (CRUD) melalui antarmuka REST API.

### 1.2 Tujuan

Proyek ini bertujuan menyediakan API yang sederhana dan terstruktur untuk:

- Menambahkan pekerjaan baru.
- Menampilkan seluruh pekerjaan atau satu pekerjaan berdasarkan ID.
- Memperbarui informasi pekerjaan.
- Menghapus pekerjaan.
- Melindungi akses API menggunakan API key.

## 2. Perancangan Sistem

### 2.1 Teknologi yang Digunakan

| Komponen | Teknologi |
| --- | --- |
| Runtime | [Bun](https://bun.sh/) |
| Bahasa | TypeScript |
| Framework API | [Elysia](https://elysiajs.com/) |
| Basis data | Firebase Firestore |
| Autentikasi | Firebase Authentication |
| AI provider | Groq SDK |
| Frontend | React, Tailwind CSS, shadcn/ui |
| Animasi | Motion |
| Markdown | react-markdown |
| Port server | `3000` |

### 2.2 Struktur Direktori

```text
.
├── index.ts                              # Entry point dan konfigurasi server
├── package.json                          # Dependensi proyek
├── tsconfig.json                         # Konfigurasi TypeScript
└── src/
    ├── clients/
    │   ├── firebase.ts                   # Koneksi Firebase Admin & Firestore
    │   └── clients.ts                    # Re-export klien
    ├── core/main/
    │   ├── task/
    │   │   ├── task.controller.ts        # Pengendali request dan response
    │   │   ├── task.models.ts            # Operasi Firestore
    │   │   ├── task.routes.ts            # Definisi endpoint task
    │   │   ├── task.service.ts           # Logika bisnis
    │   │   ├── task.types.ts             # Tipe data Task
    │   │   └── task.validation.ts        # Validasi request
    │   ├── recomendation/                # Chat AI dan riwayat rekomendasi
    │   ├── search/                       # Pencarian task dan rekomendasi
    │   ├── login/                        # Endpoint POST /login
    │   ├── register/                     # Endpoint POST /register
    │   └── user/                         # Endpoint GET /users/me
    └── utils/
        ├── error/error-handler.ts        # Penanganan error aplikasi
        └── middleware/api-key.ts         # Middleware autentikasi
```

### 2.3 Model Data

Setiap dokumen pada koleksi `tasks` memiliki struktur berikut:

| Atribut | Tipe | Keterangan |
| --- | --- | --- |
| `id` | `string` | ID unik dokumen Firestore |
| `title` | `string` | Judul pekerjaan |
| `description` | `string` | Deskripsi pekerjaan |
| `completed` | `boolean` | Status penyelesaian pekerjaan |
| `archived` | `boolean` | Status arsip pekerjaan |
| `userId` | `string` | ID pemilik dari Firebase Authentication |
| `createdAt` | `timestamp` | Waktu pembuatan dokumen |

## 3. Implementasi dan Instalasi

### 3.1 Prasyarat

Pastikan perangkat telah memiliki:

1. Bun versi terbaru.
2. Akun Firebase dengan project yang sudah dikonfigurasi.
3. Git, apabila proyek diambil dari repository.

### 3.2 Instalasi Dependensi

Jalankan perintah berikut dari direktori proyek:

```bash
bun install
```

### 3.3 Konfigurasi

API menggunakan environment variable `API_KEY` untuk autentikasi. Pada PowerShell Windows, jalankan:

```powershell
$env:API_KEY = "kunci-rahasia-anda"
```

Fitur rekomendasi menggunakan Groq. Tambahkan API key Groq dan, bila diperlukan, nama model:

```powershell
$env:GROQ_API_KEY = "api-key-groq-anda"
$env:GROQ_MODEL = "openai/gpt-oss-20b"
```

Firebase Admin membutuhkan service account dari Firebase Console. Jangan commit nilai berikut; simpan sebagai environment variable:

Salin template konfigurasi, lalu isi nilainya:

```powershell
Copy-Item .env.example .env
```

```powershell
$env:FIREBASE_PROJECT_ID = "co-worker-d8642"
$env:FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-...@co-worker-d8642.iam.gserviceaccount.com"
$env:FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
$env:FIREBASE_WEB_API_KEY = "AIza..."
```

Aktifkan Email/Password pada Firebase Authentication. `FIREBASE_WEB_API_KEY` adalah Web API key dari Firebase Project settings, sedangkan tiga variable lainnya berasal dari JSON service account. Jangan menambahkan file `.env` ke Git.

### 3.4 Menjalankan Server

```bash
bun run index.ts
```

Server dapat diakses melalui `http://localhost:3000`.

## 4. Spesifikasi API

### 4.1 Autentikasi

Endpoint task, recommendation, dan search dapat memakai salah satu autentikasi berikut. API key lama:

```http
x-api-key: kunci-rahasia-anda
```

Atau gunakan token Firebase dari `/login` atau `/register`:

```http
Authorization: Bearer <idToken>
```

Jika header tidak ada atau nilainya tidak sesuai dengan `API_KEY`, server mengembalikan status `401 Unauthorized`.

### 4.2 Membuat Task

```http
POST /tasks
```

Request body:

```json
{
	"title": "Menyusun dokumentasi API",
	"description": "Menulis dokumentasi penggunaan endpoint task",
	"completed": false
}
```

Contoh menggunakan `curl`:

```bash
curl -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-H "x-api-key: kunci-rahasia-anda" \
	-d '{"title":"Menyusun dokumentasi API","description":"Menulis dokumentasi penggunaan endpoint task","completed":false}'
```

### 4.3 Mengambil Seluruh Task

```http
GET /tasks
GET /tasks?query=kata-kunci
```

Endpoint mengembalikan daftar task dalam bentuk array. Parameter query bersifat opsional.

### 4.4 Mengambil Task Berdasarkan ID

```http
GET /tasks/:id
```

Contoh:

```bash
curl http://localhost:3000/tasks/65f1a9b2c3d4e5f678901234 \
	-H "x-api-key: kunci-rahasia-anda"
```

### 4.5 Memperbarui Task

```http
PATCH /tasks/:id
```

Seluruh atribut pada body bersifat opsional, sehingga hanya atribut yang dikirim yang akan diperbarui.

```json
{
	"completed": true
}
```

### 4.6 Menghapus Task

```http
DELETE /tasks/:id
```

Contoh:

```bash
curl -X DELETE http://localhost:3000/tasks/65f1a9b2c3d4e5f678901234 \
	-H "x-api-key: kunci-rahasia-anda"
```

### 4.7 Chat Rekomendasi AI

```http
POST /recommendations/chat
```

Endpoint ini mengirim pesan ke Groq untuk mendapatkan rekomendasi tugas yang dapat diberikan kepada pemilik tugas. Setiap percakapan otomatis disimpan ke koleksi `recommendation_history`.

Request body:

```json
{
	"message": "Apa tugas yang sebaiknya diberikan kepada Andi hari ini?",
	"owner": "Andi",
	"taskContext": "Proyek dokumentasi API sedang dalam tahap finalisasi"
}
```

Contoh response:

```json
{
	"historyId": "65f1a9b2c3d4e5f678901234",
	"recommendation": "Prioritas: Tinggi\\nTugas: ...",
	"model": "openai/gpt-oss-20b",
	"createdAt": "2026-08-25T10:00:00.000Z"
}
```

### 4.8 Riwayat Rekomendasi

Daftar riwayat terbaru:

```http
GET /recommendations/history?limit=20
```

Detail satu riwayat:

```http
GET /recommendations/history/:id
```

Parameter `limit` bersifat opsional dan menerima nilai `1` sampai `100`. Secara default, server mengembalikan 20 riwayat terbaru.

Edit riwayat rekomendasi:

```http
PATCH /recommendations/history/:id
```

Request body dapat berisi `response`, `owner`, `taskContext`, atau `archived`.

Hapus riwayat rekomendasi:

```http
DELETE /recommendations/history/:id
```

### 4.9 Pencarian Task dan Rekomendasi

Cari task dan riwayat rekomendasi berdasarkan kata kunci:

```http
GET /search?query=dokumentasi&limit=20
```

Pencarian task mencakup `title` dan `description`, sedangkan pencarian rekomendasi mencakup `message`, `response`, `owner`, dan `taskContext`. Parameter `query` wajib diisi, sementara `limit` bersifat opsional dengan nilai `1` sampai `100` untuk masing-masing kategori.

Contoh response:

```json
{
	"tasks": [],
	"recommendations": []
}
```

### 4.10 Firebase Authentication

Registrasi pengguna baru:

```http
POST /register
```

```json
{
	"email": "user@example.com",
	"password": "password123",
	"displayName": "Nama User"
}
```

Login:

```http
POST /login
```

Kedua endpoint mengembalikan `idToken` dan `refreshToken`. Gunakan `idToken` untuk mengambil user yang sedang login:

```http
GET /users/me
Authorization: Bearer <idToken>
```

Task dan riwayat rekomendasi baru otomatis disimpan dengan `userId` Firebase. Setiap akun hanya dapat melihat, mengubah, menghapus, dan mencari catatannya sendiri. Data lama yang dibuat sebelum pemisahan akun dan belum memiliki `userId` tidak ditampilkan kepada akun Firebase baru.

## 5. Frontend

Frontend tersedia di direktori `frontend/` dan dibangun menggunakan React, Tailwind CSS, komponen bergaya shadcn/ui, ikon Lucide, serta `react-markdown` untuk merender jawaban AI. URL backend dapat diatur dengan `BUN_PUBLIC_API_URL` pada `frontend/.env`.

### 5.1 Fitur Frontend

- Dashboard task dengan status penyelesaian.
- Chat AI untuk meminta rekomendasi tugas berdasarkan pesan, pemilik, dan konteks.
- Tampilan rekomendasi terbaru.
- Riwayat rekomendasi yang dapat dipilih untuk ditampilkan kembali.
- Dukungan Markdown untuk heading, teks tebal, daftar, dan potongan kode pada jawaban AI.
- Form API key dan state loading/error untuk koneksi backend.
- Empat pilihan theme: Pink, Summer, Cold, dan Spring.
- Sidebar hamburger dengan mode penuh dan mode ikon saja.
- Pengelolaan catatan melalui edit, arsip, pulihkan, dan hapus.
- Animasi buka/tutup menggunakan Motion untuk sidebar, settings, dan modal.

### 5.2 Menjalankan Frontend

Frontend tidak membutuhkan environment variable. API key backend dimasukkan melalui panel Settings dan disimpan lokal di browser. URL backend development adalah `http://localhost:3000`.

Jalankan server backend terlebih dahulu, kemudian jalankan frontend:

```powershell
bun run index.ts
cd frontend
bun install
bun run dev
```

Frontend dikonfigurasi berjalan pada `http://localhost:3001`, sedangkan backend berjalan pada `http://localhost:3000`.

Build production:

```powershell
bun run build
```

## 6. Catatan Pengembangan

Seluruh kode dalam proyek ini ditulis oleh AI (Kiro). Ide, arah fitur, dan keputusan desain sepenuhnya berasal dari pemilik proyek. AI berperan sebagai eksekutor — menerjemahkan ide menjadi implementasi yang berjalan.

## 7. Changelog

### [2026-08-26]

#### Firebase & Firestore
- Migrasi basis data dari MongoDB ke **Firebase Firestore**.
- Menambahkan Firebase Admin SDK untuk autentikasi dan akses Firestore di sisi server.
- Membuat composite index Firestore yang diperlukan:
  - Koleksi `tasks`: field `userId` (ASC) + `createdAt` (DESC).
  - Koleksi `recommendation_history`: field `userId` (ASC) + `createdAt` (DESC).

#### Autentikasi
- Menambahkan endpoint `/register` dan `/login` menggunakan Firebase Authentication.
- Menambahkan endpoint `GET /users/me` untuk mengambil data pengguna aktif dari token.
- Mendukung login dengan Google melalui Firebase SDK di sisi frontend.
- Setiap task dan riwayat rekomendasi kini disimpan dengan `userId` sehingga data tiap akun terisolasi.

#### Frontend
- Menambahkan halaman login dan register dengan toggle mode.
- Menambahkan tombol login dengan Google.
- Menambahkan indikator pengguna aktif dan tombol logout di header.
- Memperbaiki bug pada `deleteTask` yang sebelumnya memanggil `updateTask({ archived: false })` secara tidak perlu sebelum menghapus.
- Meningkatkan limit pengambilan riwayat rekomendasi dari 6 menjadi 100 agar item yang diarsipkan tetap muncul di tampilan Arsipkan.

## 8. Penutup

Co-Worker menyediakan fondasi pengelolaan task dengan bantuan rekomendasi AI, riwayat percakapan, dan frontend yang terhubung ke API. Struktur ini dapat dikembangkan lebih lanjut dengan fitur pengguna, pagination, pengujian otomatis, serta konfigurasi database melalui environment variable.