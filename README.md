# Co-Worker API

![Co-Worker API banner](https://i.pinimg.com/736x/be/49/5a/be495a9ae2bb6de49ac21e5f83f269b6.jpg)

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
5. [Penutup](#5-penutup)

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
| Basis data | MongoDB |
| Driver basis data | MongoDB Node.js Driver |
| Port server | `3000` |

### 2.2 Struktur Direktori

```text
.
├── index.ts                         # Entry point dan konfigurasi server
├── package.json                     # Dependensi proyek
├── tsconfig.json                    # Konfigurasi TypeScript
└── src/
		├── clients/clients.ts           # Koneksi MongoDB
		├── core/main/task/
		│   ├── task.controller.ts       # Pengendali request dan response
		│   ├── task.models.ts           # Operasi basis data
		│   ├── task.routes.ts            # Definisi endpoint task
		│   ├── task.service.ts          # Logika bisnis
		│   ├── task.types.ts            # Tipe data Task
		│   └── task.validation.ts       # Validasi request
		└── utils/
				├── error/error-handler.ts   # Penanganan error aplikasi
				└── middleware/api-key.ts    # Middleware autentikasi
```

### 2.3 Model Data

Setiap dokumen pada koleksi `tasks` memiliki struktur berikut:

| Atribut | Tipe | Keterangan |
| --- | --- | --- |
| `_id` | `ObjectId` | ID unik yang dibuat MongoDB |
| `title` | `string` | Judul pekerjaan |
| `description` | `string` | Deskripsi pekerjaan |
| `completed` | `boolean` | Status penyelesaian pekerjaan |

## 3. Implementasi dan Instalasi

### 3.1 Prasyarat

Pastikan perangkat telah memiliki:

1. Bun versi terbaru.
2. MongoDB yang berjalan pada `mongodb://localhost:27017`.
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

Basis data akan terhubung ke MongoDB lokal dengan konfigurasi berikut:

```text
mongodb://localhost:27017/co-worker
```

### 3.4 Menjalankan Server

```bash
bun run index.ts
```

Server dapat diakses melalui `http://localhost:3000`.

## 4. Spesifikasi API

### 4.1 Autentikasi

Seluruh request harus menyertakan header berikut:

```http
x-api-key: kunci-rahasia-anda
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

ID harus berupa MongoDB `ObjectId` yang valid.

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

## 5. Penutup

Co-Worker API menyediakan fondasi CRUD task yang ringan dengan pemisahan tanggung jawab antara route, controller, service, model, dan middleware. Struktur ini dapat dikembangkan lebih lanjut dengan fitur pengguna, pagination, pengujian otomatis, serta konfigurasi database melalui environment variable.