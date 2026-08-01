# Real-Time Markdown Editor

Aplikasi penyunting Markdown waktu nyata (Real-Time Markdown Editor) berkinerja tinggi yang dibangun menggunakan ekosistem **Laravel 13** dan **Vue 3** melalui **Inertia.js v3**. Aplikasi ini dirancang untuk memberikan pengalaman menulis yang mulus, aman, dan kaya fitur dengan dukungan penuh untuk diagram, penulisan kode, penataan tingkat lanjut, serta otentikasi pengguna yang aman.

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Tech Stack](#tech-stack)
3. [Prasyarat](#prasyarat)
4. [Mulai Cepat (Getting Started)](#mulai-cepat-getting-started)
   - [Setup Lokal Tanpa Container](#setup-lokal-tanpa-container)
   - [Setup Menggunakan Docker / Podman](#setup-menggunakan-docker--podman)
5. [Arsitektur Sistem](#arsitektur-sistem)
   - [Struktur Direktori](#struktur-direktori)
   - [Alur Kerja Data (Data Flow)](#alur-kerja-data-data-flow)
   - [Skema Database](#skema-database)
6. [Variabel Lingkungan (Environment Variables)](#variabel-lingkungan-environment-variables)
7. [Perintah yang Tersedia (Available Scripts)](#perintah-yang-tersedia-available-scripts)
8. [Pengujian (Testing)](#pengujian-testing)
9. [Penyebaran (Deployment)](#penyebaran-deployment)
10. [Pemecahan Masalah (Troubleshooting)](#pemecahan-masalah-troubleshooting)

---

## Fitur Utama

- **Penyunting Waktu Nyata (Real-Time Editing)**: Editor berbasis **CodeMirror 6** dengan penyorotan sintaksis khusus Markdown untuk performa penulisan yang cepat dan akurat.
- **Scroll Sinkron (Synchronized Scrolling)**: Sinkronisasi scroll otomatis dua arah (editor-ke-preview dan preview-ke-editor) dengan sistem pencegahan *looping scroll*.
- **Rendering Diagram Mermaid**: Dukungan diagram alur, grafik, dan sequence diagram secara langsung menggunakan **Mermaid.js** yang terintegrasi dengan tema aplikasi.
- **Keamanan Tinggi (XSS Prevention)**: Sanitasi output HTML dinamis menggunakan **DOMPurify** untuk mencegah injeksi skrip berbahaya.
- **Otentikasi Lengkap & 2FA**: Sistem otentikasi lengkap didukung oleh **Laravel Fortify** termasuk Login, Registrasi, Lupa Sandi, Verifikasi Email, serta Autentikasi Dua Faktor (2FA) berbasis TOTP.
- **Manajemen Profil & Tampilan**: Halaman pengaturan profil terintegrasi, penggantian sandi, penghapusan akun, serta pilihan tema tampilan (terang/gelap) yang disesuaikan secara instan.
- **Penyimpanan Draft Lokal**: Draft tulisan disimpan secara berkala pada `localStorage` sehingga data tidak hilang saat halaman dimuat ulang.
- **Metrik Statistik Tulisan**: Bar status dinamis yang mengkalkulasi jumlah kata, jumlah karakter, dan estimasi waktu membaca secara langsung.

---

## Tech Stack

### Backend
- **Framework**: Laravel 13+
- **Bahasa Pemrograman**: PHP 8.3+
- **Otentikasi**: Laravel Fortify v1 (TOTP 2FA, session-based auth)
- **Koneksi Frontend**: Inertia.js v3 (Inertia Laravel)
- **Database**: SQLite (default untuk lokal), PostgreSQL (siap untuk produksi)
- **Linter & Formatter**: Laravel Pint v1, Larastan v3 (PHPStan)
- **Pengujian**: Pest v4, PHPUnit v12

### Frontend
- **Framework UI**: Vue 3 (Composition API)
- **Bahasa Pemrograman**: TypeScript (TSX/TSC)
- **Bundler & Dev Server**: Vite v8 + TypeScript Compiler (`vue-tsc`)
- **Editor Core**: CodeMirror v6
- **Markdown Parser & Sanitizer**: Markdown-it v14, DOMPurify v3, markdown-it-task-lists
- **Primitif UI**: Reka UI (sebelumnya Radix Vue), Lucide Vue Icons
- **Penataan Gaya (Styling)**: Tailwind CSS v4.1, github-markdown-css v5.9
- **Notifikasi**: Vue Sonner v2
- **Pengujian Frontend**: Vitest v4, JSdom

---

## Prasyarat

Sebelum memulai proses instalasi, pastikan sistem Anda telah memiliki perangkat lunak berikut:

- **PHP 8.3** atau lebih tinggi (disertai ekstensi `sqlite3`, `pdo_sqlite`, `mbstring`, `xml`)
- **Node.js 20.x** atau lebih tinggi
- **Composer** (untuk dependensi PHP)
- **npm** (untuk dependensi JavaScript)
- **Docker** / **Podman** (opsional, jika ingin menjalankan aplikasi dalam container)

---

## Mulai Cepat (Getting Started)

### Setup Lokal Tanpa Container

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi langsung di mesin lokal Anda:

#### 1. Kloning Repositori
```bash
git clone https://github.com/Raka-coder/laravue-md-editor.git
cd laravue-md-editor
```

#### 2. Instal Dependensi Backend (Composer)
```bash
composer install
```

#### 3. Instal Dependensi Frontend (npm)
```bash
npm install
```

#### 4. Konfigurasi Lingkungan (Environment Setup)
Salin contoh berkas konfigurasi `.env`:
```bash
cp .env.example .env
```
Secara bawaan, konfigurasi menggunakan database SQLite di folder `database/database.sqlite`.

Buat kunci aplikasi (Application Key):
```bash
php artisan key:generate
```

#### 5. Jalankan Migrasi Database
Buat database SQLite kosong (jika belum ada) dan jalankan migrasi:
```bash
touch database/database.sqlite
php artisan migrate
```

#### 6. Jalankan Server Pengembangan
Gunakan perintah pengembangan gabungan untuk menjalankan server Laravel dan Vite secara bersamaan:
```bash
composer dev
```
Atau jalankan secara terpisah di terminal yang berbeda:

*Terminal 1 (Laravel Server):*
```bash
php artisan serve
```

*Terminal 2 (Vite Dev Server):*
```bash
npm run dev
```

Buka browser Anda dan akses aplikasi di **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

---

### Setup Menggunakan Docker / Podman

Aplikasi ini dilengkapi dengan konfigurasi **Podman Compose** / **Docker Compose** yang mempermudah deployment lingkungan lokal secara containerized dengan sinkronisasi kode secara langsung (bind-mount).

#### 1. Build Image Pengembangan
```bash
podman-compose build
# Atau jika menggunakan docker-compose:
docker-compose build
```

#### 2. Jalankan Container
Jalankan container PHP-FPM + Nginx di latar belakang:
```bash
podman-compose up -d
# Atau:
docker-compose up -d
```
Layanan web server akan berjalan pada port `8000` di localhost.

#### 3. Jalankan Vite Dev Server pada Host
Agar fitur hot-reload berjalan optimal dan cepat, jalankan Vite dev server di mesin host:
```bash
npm run dev
```
Akses aplikasi melalui **[http://localhost:8000](http://localhost:8000)**.

#### 4. Menghentikan Container
```bash
podman-compose down
# Atau:
docker-compose down
```

---

## Arsitektur Sistem

### Struktur Direktori

Berikut adalah peta struktur folder utama pada proyek ini:

```
├── app/
│   ├── Actions/                  # Logika Fortify untuk pendaftaran dan reset sandi
│   │   └── Fortify/
│   ├── Http/
│   │   ├── Controllers/          # Controller untuk Profile, Security, dan Authentication
│   │   │   └── Settings/
│   │   └── Requests/             # Form Requests untuk validasi input
│   │       └── Settings/
│   ├── Models/                   # Model Eloquent (User.php)
│   └── Providers/                # Service Providers (AppServiceProvider, FortifyServiceProvider)
├── config/                       # Konfigurasi aplikasi Laravel
├── database/
│   ├── migrations/               # Skema migrasi database
│   └── database.sqlite           # Database lokal default
├── docker/                       # Berkas konfigurasi Docker (nginx.conf, php.ini, supervisord.conf)
├── resources/
│   ├── css/
│   │   └── app.css               # Gaya Tailwind CSS v4
│   ├── js/
│   │   ├── actions/              # File routing dan controller bawaan Wayfinder
│   │   ├── components/           # Komponen Vue (EditorPanel, PreviewPanel, UI Kit)
│   │   ├── composables/          # Logika Vue reusable (useMarkdownParser, useScrollSync)
│   │   ├── layouts/              # Tata letak aplikasi (AppLayout, SettingsLayout)
│   │   ├── pages/                # Halaman utama Inertia Vue (Welcome, Dashboard, Settings, Auth)
│   │   ├── app.ts                # Titik masuk utama JavaScript / Vue
│   │   └── tsconfig.json         # Konfigurasi TypeScript frontend
│   └── views/
│       └── app.blade.php         # Kerangka dasar HTML / Single Page Application
├── routes/
│   ├── web.php                   # Definisi route aplikasi utama
│   └── settings.php              # Route pengaturan profil & keamanan pengguna
├── tests/
│   ├── Feature/                  # Pengujian fitur backend (Pest PHP)
│   └── Unit/                     # Pengujian unit backend (Pest PHP)
├── Dockerfile                    # Dockerfile multi-stage untuk rilis produksi
├── Dockerfile.dev                # Dockerfile untuk pengembangan lokal
├── docker-compose.yml            # Konfigurasi orkestrasi container lokal
├── vite.config.ts                # Konfigurasi bundling Vite
└── vitest.config.ts              # Konfigurasi pengujian Vitest
```

### Alur Kerja Data (Data Flow)

```
[Penulisan Markdown di EditorPanel]
                │
                ▼ (Pemicu Event Input)
[CodeMirror View & State Update]
                │
                ▼ (Reaktif melalui v-model)
[Welcome.vue State (markdown.value)]
                │
                ▼ (Dikirim ke useMarkdownParser)
[Preprocessor HTML -> MarkdownIt Render -> DOMPurify Sanitize]
                │
                ▼ (Output HTML Bersih & Statistik Teks)
[PreviewPanel v-html Rendering] ──> [Dynamic Mermaid.js rendering]
```

### Skema Database

#### `users` (Tabel Utama Pengguna)
| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | bigint (PK) | Auto-increment primary key |
| `name` | string | Nama lengkap pengguna |
| `email` | string (Unique) | Alamat email unik untuk login |
| `email_verified_at` | timestamp (Nullable) | Penanda verifikasi email |
| `password` | string | Hash sandi terenkripsi |
| `two_factor_secret` | text (Nullable) | Kunci rahasia TOTP untuk 2FA |
| `two_factor_recovery_codes` | text (Nullable) | Kode pemulihan 2FA cadangan |
| `two_factor_confirmed_at` | timestamp (Nullable) | Penanda konfirmasi aktif 2FA |
| `remember_token` | string (Nullable) | Token sesi login berulang |
| `created_at` | timestamp | Waktu pembuatan data |
| `updated_at` | timestamp | Waktu perubahan data |

---

## Variabel Lingkungan (Environment Variables)

Aplikasi ini menggunakan konfigurasi standar Laravel. Berikut adalah beberapa variabel kunci yang perlu diperhatikan di `.env`:

### Variabel Inti

| Variabel | Deskripsi | Standar Lokal | Contoh Produksi |
| :--- | :--- | :--- | :--- |
| `APP_NAME` | Nama Aplikasi | `Laravel` | `Markdown Editor` |
| `APP_ENV` | Lingkungan aplikasi | `local` | `production` |
| `APP_KEY` | Kunci enkripsi aplikasi | - (diisi via key:generate) | `base64:xxx...` |
| `APP_DEBUG` | Mode debug | `true` | `false` |
| `APP_URL` | URL dasar aplikasi | `http://localhost:8000` | `https://md.domain.com` |

### Variabel Database & Antrian

| Variabel | Deskripsi | Standar Lokal | Contoh Produksi |
| :--- | :--- | :--- | :--- |
| `DB_CONNECTION` | Driver database | `sqlite` | `pgsql` |
| `DB_HOST` | Host database PostgreSQL | - | `127.0.0.1` |
| `DB_PORT` | Port database PostgreSQL | - | `5432` |
| `DB_DATABASE` | Nama database | - | `md_editor_prod` |
| `DB_USERNAME` | Nama pengguna database | - | `postgres` |
| `DB_PASSWORD` | Kata sandi database | - | `secret_password` |
| `QUEUE_CONNECTION` | Driver antrian | `database` | `redis` / `database` |

---

## Perintah yang Tersedia (Available Scripts)

### Perintah Backend (Composer & Artisan)

| Perintah | Deskripsi |
| :--- | :--- |
| `composer setup` | Melakukan instalasi awal proyek, generate key, migrasi, dan build aset |
| `composer dev` | Menjalankan Vite dev server dan proses pengembangan secara bersamaan |
| `composer lint` | Menjalankan Laravel Pint untuk memformat kode PHP secara otomatis |
| `composer lint:check` | Memeriksa kepatuhan format gaya kode PHP tanpa mengubah file |
| `composer types:check` | Menjalankan PHPStan (`larastan`) untuk analisis tipe statis backend |
| `composer test` | Membersihkan cache konfigurasi dan menjalankan semua tes Pest backend |
| `php artisan migrate` | Menjalankan seluruh file migrasi database yang tertunda |
| `php artisan db:seed` | Mengisi data awal database menggunakan seeder |
| `php artisan wayfinder:generate` | Menghasilkan berkas TypeScript routing berdasarkan route Laravel |

### Perintah Frontend (npm)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite dev server lokal dengan hot-reload instan |
| `npm run build` | Melakukan kompilasi aset produksi frontend |
| `npm run format` | Menjalankan Prettier untuk memformat semua file di folder `resources/` |
| `npm run format:check` | Memeriksa format gaya kode frontend dengan Prettier |
| `npm run lint` | Menjalankan ESLint untuk mendeteksi dan memperbaiki error gaya kode |
| `npm run types:check` | Memeriksa kesalahan penulisan tipe statis TypeScript (`vue-tsc`) |
| `npx vitest` | Menjalankan rangkaian tes unit frontend |

---

## Pengujian (Testing)

### Tes Backend (PHP / Pest)

Pengujian backend ditulis menggunakan **Pest PHP**. Seluruh uji unit dan fitur dapat dijalankan dengan perintah berikut:

```bash
composer test
```

Untuk menjalankan tes pada file tertentu atau memfilter tes berdasarkan nama:
```bash
# Uji file tertentu
php artisan test --filter=ProfileTest

# Uji ringkas (compact output)
php artisan test --compact
```

### Tes Frontend (TypeScript / Vitest)

Pengujian frontend ditulis menggunakan **Vitest** dan disimulasikan menggunakan lingkungan **JSdom**.

Jalankan seluruh tes frontend:
```bash
npx vitest run
```

Jalankan tes dalam mode interaktif (watch mode):
```bash
npx vitest
```

---

## Penyebaran (Deployment)

### Menggunakan Docker di Produksi (Direkomendasikan)

Aplikasi ini menyertakan `Dockerfile` multi-stage berkinerja tinggi untuk deployment produksi. Proses build stage pertama mengkompilasi dependensi Laravel dan aset Vite, kemudian memindahkannya ke stage runtime PHP-FPM alpine yang bersih dengan Nginx dan Supervisor.

#### 1. Bangun Image Produksi
```bash
docker build -t laravue-md-editor:latest .
```

#### 2. Jalankan Container Produksi
Jalankan container dengan meneruskan variabel lingkungan yang diperlukan:
```bash
docker run -d \
  -p 80:80 \
  -e APP_NAME="Markdown Editor" \
  -e APP_ENV=production \
  -e APP_KEY="base64:isikunciaplikasianda..." \
  -e APP_DEBUG=false \
  -e APP_URL=https://md.domain.com \
  -e DB_CONNECTION=pgsql \
  -e DB_HOST=db.domain.com \
  -e DB_DATABASE=md_editor_prod \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=dbsecretpassword \
  --name md-editor-prod \
  laravue-md-editor:latest
```

---

## Pemecahan Masalah (Troubleshooting)

### Masalah Manifestasi Aset Vite

**Error:** `Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest`

**Solusi:**
Hal ini terjadi karena berkas manifest build frontend belum dibuat. Jalankan perintah kompilasi aset berikut di terminal Anda:
```bash
npm run build
```
Atau pastikan Vite dev server sedang berjalan jika Anda berada dalam lingkungan lokal (`npm run dev`).

### Kesalahan Enkripsi Sesi (TOTP / 2FA)

**Masalah:** Gagal mencocokkan kode OTP dari aplikasi authenticator pengguna saat mengaktifkan 2FA.

**Solusi:**
1. Pastikan waktu server dan waktu perangkat pengguna tersinkronisasi dengan benar (menggunakan NTP). Selisih waktu lebih dari 30 detik dapat menyebabkan validasi TOTP gagal.
2. Pastikan `APP_KEY` di file `.env` tidak berubah setelah 2FA diaktifkan, karena data rahasia TOTP dienkripsi menggunakan kunci tersebut.

### Cache Rute atau Konfigurasi Mengganggu Pengembangan

**Masalah:** Perubahan file route atau file `.env` tidak terdeteksi oleh aplikasi.

**Solusi:**
Dalam mode pengembangan, hapus seluruh cache konfigurasi dan rute Laravel:
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### Kesalahan Kompilasi TypeScript / Vite

**Error:** Gagal compile atau build karena masalah tipe TypeScript.

**Solusi:**
Jalankan perintah berikut untuk memeriksa kesalahan tipe secara detail:
```bash
npm run types:check
```
Dan pastikan library dependensi eksternal telah terinstal dengan benar (`npm install`).
