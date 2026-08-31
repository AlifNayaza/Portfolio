# ⚡ Modern Developer Portfolio & Serverless CMS

Website portofolio interaktif berperforma tinggi yang dibangun dengan arsitektur modern **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, dan **Netlify Serverless Functions** yang terhubung langsung ke **MongoDB Atlas** serta panel admin dinamis.

---

## ✨ Fitur Unggulan & Inovasi Utama

### 1. ⚡ 60-Second Recruiter Fast-Pitch
* **Rangkuman Eksekutif Cepat**: Akses instan melalui tombol `⚡ 60s Fast Pitch` di hero, navbar, dan mobile drawer.
* **1-Click Actions**: Salin alamat email instan dengan notifikasi *toast* dan tombol langsung kirim pesan.
* **Poin Penjualan Utama & Toolkit**: Menyajikan 3 pilar keahlian teknis (*Full-Stack, Performance & UX, Clean Architecture*) serta tautan langsung ke studi kasus proyek pilihan.

### 2. 💻 Interactive Dev Command Palette (`Ctrl + K` / `Cmd + K`)
* **Spotlight Search Cepat**: Akses bilah perintah bergaya terminal/Raycast dengan menekan `Ctrl+K` (atau klik badge `⌘K` di navbar).
* **Pencarian Proyek Real-Time**: Ketik nama teknologi atau judul proyek untuk langsung melompat ke halaman detail.
* **Aksi Pintas Cepat**: Ganti tema *Dark/Light*, salin email, navigasi halaman, dan navigasi keyboard penuh (`↑`, `↓`, `Enter`, `ESC`).

### 3. 🎯 Useful Micro-Interactions
* **Scroll-to-Top dengan Circular SVG Progress Ring**: Indikator persentase gulir melingkar real-time (`0% → 100%`) dengan aksi meluncur mulus kembali ke atas dan getaran haptik responsif.
* **Quick Topic Auto-Fill di Form Kontak**: Chip topik instan (`[ 💼 Freelance Project ]`, `[ 🏢 Full-Time Role ]`, dll.) yang otomatis mengisi kolom subjek saat disentuh.
* **Live Character Counter**: Indikator jumlah karakter real-time pada textarea pesan kontak.
* **Native Web Share API**: Berbagi link studi kasus proyek langsung ke aplikasi sosial media (WhatsApp, Telegram, LinkedIn) di perangkat mobile, atau salin link otomatis di desktop.
* **Haptic Feedback**: Respon getar sentuh halus (`navigator.vibrate`) pada aksi klik/salin di layar sentuh.

### 4. 🖼️ Auto-Slide & Touch-Swipe Photo Carousel
* **Rotasi Foto Otomatis**: Foto profil di Beranda dan About berganti otomatis setiap 4.5 detik (dengan *smart-pause* saat disentuh/di-hover).
* **Gesture Sentuh & Geser**: Mendukung *swipe* horizontal di layar sentuh, drag mouse, tombol panah samping, dan strip thumbnail navigasi.

### 5. 🚀 Deep Performance & Zero-Lag Architecture
* **100% Native OS Cursor**: Performa kursor instan tanpa beban komputasi (0% CPU overhead).
* **RAF Throttled Scroll**: Scroll listener pada navbar menggunakan `useRef` + `requestAnimationFrame` tanpa memicu re-render React yang tidak perlu.
* **Wide-Canvas Layout**: Tata letak responsif penuh hingga resolusi monitor ultra-lebar (`max-w-[1920px]`) yang proporsional di desktop dan 2-kolom rapi di mobile.
* **Instant Page Transitions**: Transisi halaman ringan (0.2s fade) tanpa blocking layout.

### 6. 🛡️ Dynamic Admin CMS Panel (Protected Route)
* **Kustomisasi Konten Real-Time**: Edit headline, bio, keahlian, pengalaman, dan daftar proyek tanpa perlu menyentuh source code.
* **Media & Audio Uploader**: Terintegrasi langsung dengan **Cloudinary** untuk upload multi-gambar dan track musik background.
* **Messages Viewer**: Membaca dan mengelola pesan masuk dari form kontak.
* **URL Obscurity Security**: Path login dan dashboard admin dapat disembunyikan menggunakan variabel lingkungan `VITE_ADMIN_PATH`.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend Framework** | React 19, Vite |
| **Styling & Design System** | Tailwind CSS, CSS Custom Properties (Light/Dark Theme) |
| **Motion & Gestures** | Framer Motion (GPU Spring Animations & Touch Drag) |
| **Icons & Notifications** | Lucide React, React Hot Toast |
| **Backend & API** | Netlify Serverless Functions (Node.js) |
| **Database** | MongoDB Atlas via Mongoose |
| **Media Cloud Storage** | Cloudinary (Image & Audio Uploads) |

---

## ⚙️ Konfigurasi Environment Variables (`.env`)

Buat berkas `.env` pada direktori root proyek:

```env
# Koneksi MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# Kunci rahasia otentikasi login Admin
ADMIN_SECRET=kunci_rahasia_admin_anda

# Konfigurasi Cloudinary Media Storage
VITE_CLOUDINARY_CLOUD_NAME=cloud_name_cloudinary_anda
VITE_CLOUDINARY_PRESET=upload_preset_cloudinary_anda

# Path rahasia halaman admin (default: /adomin)
VITE_ADMIN_PATH=/adomin
```

---

## 🚀 Panduan Memulai & Penggunaan Lokal

### Prasyarat
- **Node.js** (versi 18+)
- **Netlify CLI** (direkomendasikan untuk menjalankan Serverless Functions secara lokal):
  ```bash
  npm install -g netlify-cli
  ```

### Langkah Menjalankan Aplikasi

1. **Clone repositori dan masuk ke folder proyek:**
   ```bash
   cd my-portfolio
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan lokal (Netlify Dev):**
   ```bash
   netlify dev
   ```
   Aplikasi lokal akan aktif di: `http://localhost:8888` (frontend Vite & backend serverless otomatis terhubung).

4. **Menjalankan Pengecekan Linting (ESLint):**
   ```bash
   npx eslint src
   ```

5. **Membangun Bundle Produksi:**
   ```bash
   npm run build
   ```

---

## 🔑 Alur & Akses Panel Admin

1. **Login ke Admin Panel**:
   - Buka URL kustom yang ditentukan di `.env` (misalnya: `http://localhost:8888/adomin`).
   - Masukkan token/kunci rahasia dari variabel `ADMIN_SECRET`.
2. **Memperbarui Konten**:
   - Pilih tab menu yang ingin diubah (Headline, Profile Images, Projects, Skills, Soundtrack, dll.).
   - Klik tombol **[ Save Changes ]** di pojok kanan atas untuk menyimpan langsung ke MongoDB.
3. **Melihat Pesan Masuk**:
   - Buka tab **Messages** untuk membaca dan mengelola pesan dari formulir kontak.

---

## 🌐 Panduan Deployment di Netlify

### Metode 1: Git Push Otomatis (Sangat Direkomendasikan)
1. Hubungkan repositori GitHub Anda ke akun Netlify.
2. Daftarkan seluruh Environment Variables di menu **Site Configuration > Environment Variables**:
   * `MONGODB_URI`
   * `ADMIN_SECRET`
   * `VITE_CLOUDINARY_CLOUD_NAME`
   * `VITE_CLOUDINARY_PRESET`
   * `VITE_ADMIN_PATH`
3. Setiap kali Anda melakukan `git push origin main`, Netlify akan secara otomatis mengompilasi dan mempublikasikan situs dalam beberapa detik.

### Metode 2: Netlify CLI Deployment
```bash
npm run build
netlify deploy --prod
```

---

## 📄 Lisensi
Dilisensikan di bawah [MIT License](LICENSE). Dibuat dengan dedikasi dan kode yang bersih oleh **Alif Haikal Nayaza**.
