# 📖 Digital Chronicles & Portfolio

Project website portofolio interaktif premium dan terintegrasi dengan database MongoDB serta panel admin kustom untuk manajemen konten yang dinamis. 

Aplikasi ini dibangun menggunakan **React 19**, **Vite**, **TailwindCSS v4**, **Framer Motion**, dan dideploy menggunakan serverless backend di **Netlify Functions**.

---

## ✨ Fitur Utama

1. **Chapter-Based Storytelling Layout**: Desain portfolio artistik bergaya bab novel kronik klasik dengan transisi halaman yang elegan dan halus (`framer-motion`).
2. **Interactive Terminal Simulator (Contact Page)**:
   - Pengunjung dapat mengirim pesan langsung ke database Anda dengan mengetikkan command `message` pada simulator terminal retro.
   - Mendukung navigasi cepat untuk link sosial media (`github`, `linkedin`, dll.) langsung melalui antarmuka terminal.
3. **Control Panel Admin Dinamis & Responsif (Dynamic Archivist Panel)**:
   - Manajemen konten penuh langsung dari website (Nama, Headline, Biodata, Keahlian, Proyek, Pengalaman kerja, dan Lagu latar).
   - Antarmuka responsif ramah seluler (*mobile-friendly sidebar drawer*) dengan akses tombol Save cepat.
   - Multi-upload gambar profil dan preview gambar proyek langsung yang terintegrasi dengan **Cloudinary**.
   - Integrasi Audio Uploader untuk mengatur playlist instrumen lagu latar belakang.
   - **Messages Tab Viewer**: Halaman khusus untuk membaca, me-refresh, dan menghapus pesan masuk dari simulator terminal.
4. **Adaptive Aesthetic & Ambient Theme**:
   - Dukungan Light/Dark mode dengan adaptasi warna CSS variables yang mulus.
   - Efek film grain kertas antik (`noise-overlay`) dan latar belakang canvas interaktif dengan partikel mengambang dinamis.
5. **SEO & Open Graph Ready**: Konfigurasi meta tags optimal untuk indeks mesin pencari dan review link di sosial media.
6. **Optimasi Performa Lighthouse (Skor Maksimal)**:
   - Menggunakan pemisahan kode (*Code Splitting*) untuk memotong ukuran file JavaScript utama hingga **48%**.
   - Penggunaan *font preloading* & *CDN preconnection* untuk rendering super cepat.
   - Menggunakan pola caching *Stale-While-Revalidate (SVR)* via `localStorage` sehingga situs termuat instan (0ms loading screen) pada kunjungan berikutnya.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS v4, Framer Motion, Lucide React, React Hot Toast, Axios
- **Serverless Backend (Netlify Functions)**: Node.js, Mongoose (MongoDB)
- **Asset Cloud Storage**: Cloudinary (Image & Audio upload)

---

## ⚙️ Konfigurasi Environment Variables (`.env`)

Buat file bernama `.env` di root direktori project Anda dan sesuaikan isinya:

```env
# Koneksi MongoDB Anda (Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# Kunci rahasia untuk masuk ke halaman Admin
ADMIN_SECRET=rahasia_admin_anda

# Konfigurasi Cloudinary untuk upload media gambar dan audio di Admin Panel
VITE_CLOUDINARY_CLOUD_NAME=cloud_name_cloudinary_anda
VITE_CLOUDINARY_PRESET=upload_preset_cloudinary_anda

# Kustomisasi path url admin (untuk menyembunyikan halaman login admin, default: /admin)
VITE_ADMIN_PATH=/adomin
```

---

## 🚀 Panduan Memulai & Penggunaan Lokal

### Prasyarat
- **Node.js** (versi 18+)
- **Netlify CLI** (sangat direkomendasikan untuk testing Netlify Functions secara lokal)
  ```bash
  npm install -g netlify-cli
  ```

### Langkah Instalasi

1. **Clone repository ini dan masuk ke folder project:**
   ```bash
   cd my-portfolio
   ```

2. **Instal seluruh dependensi project:**
   ```bash
   npm install
   ```

3. **Menjalankan Server Pengembangan Lokal:**
   Gunakan **Netlify CLI** agar Netlify Functions (backend database) dan React Vite (frontend) berjalan secara bersamaan dengan proxy port otomatis:
   ```bash
   netlify dev
   ```
   Aplikasi lokal Anda akan terbuka di: `http://localhost:8888` (Vite dev server akan di-proxy lewat port Netlify Dev).

4. **Menjalankan Linter Check:**
   Untuk memverifikasi kualitas kode dan memastikan tidak ada error syntax/hooks:
   ```bash
   npm run lint
   ```

5. **Membangun Bundle Produksi Lokal:**
   ```bash
   npm run build
   ```

---

## 🔑 Cara Penggunaan & Alur Admin

### 1. Mengakses Halaman Admin & Menulis Konten
- Navigasikan browser Anda ke path custom admin yang Anda tentukan di `.env` (misal: `http://localhost:8888/adomin` atau langsung diarahkan ke login).
- Masukkan kunci rahasia dari `ADMIN_SECRET` Anda.
- Setelah masuk, Anda dapat memperbarui seluruh data portofolio pada tab menu yang tersedia.
- **Penting**: Klik tombol **[ Save ]** di pojok kanan atas untuk menyimpan perubahan Anda ke database MongoDB.

### 2. Mengakses Pesan Masuk
- Klik tab **Messages** pada panel admin.
- Anda akan melihat daftar pesan yang dikirim oleh pengunjung melalui terminal halaman kontak.
- Anda dapat mengklik email pengirim untuk membalas secara langsung via client email, atau menekan tombol **[ DELETE ]** untuk menghapus pesan dari arsip database.

---

## 🌐 Panduan Deployment di Netlify

Ada 3 metode utama untuk melakukan deployment atau memperbarui aplikasi Anda di Netlify:

### Metode 1: Integrasi Git/GitHub (Otomatis & Sangat Direkomendasikan)
Metode ini adalah yang paling praktis karena Netlify akan melakukan build otomatis setiap kali Anda melakukan push ke branch utama repositori Git Anda.

1. Hubungkan repositori GitHub/GitLab Anda ke Netlify melalui dasbor Netlify.
2. Gunakan konfigurasi build berikut di dasbor Netlify:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
   *(Atau biarkan Netlify membaca berkas [netlify.toml](netlify.toml) secara otomatis)*.
3. Masuk ke **Site configuration** > **Environment variables** di Netlify, kemudian daftarkan seluruh variabel lingkungan berikut:
   - `MONGODB_URI`
   - `ADMIN_SECRET`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_PRESET`
   - `VITE_ADMIN_PATH`
4. Lakukan perubahan kode lokal Anda, lalu push ke repositori GitHub:
   ```bash
   git add .
   git commit -m "Deskripsi perubahan Anda"
   git push origin main
   ```
   *Netlify secara otomatis akan mendeteksi push baru dan memperbarui situs Anda dalam beberapa detik.*

---

### Metode 2: Menggunakan Netlify CLI (Manual Lewat Terminal)
Gunakan metode ini jika Anda tidak ingin menghubungkan situs Anda ke akun GitHub dan ingin langsung meluncurkan perubahan melalui baris perintah komputer lokal.

1. Pastikan Anda sudah terinstal Netlify CLI secara global dan login ke akun Netlify:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```
2. Hubungkan folder proyek lokal dengan situs Netlify Anda:
   ```bash
   netlify link
   ```
3. Lakukan build proyek secara lokal:
   ```bash
   npm run build
   ```
4. Kirim folder `dist` dan serverless functions hasil kompilasi ke server produksi Netlify:
   ```bash
   netlify deploy --prod
   ```

---

### Metode 3: Unggah Manual (Netlify Drop)
Metode manual tanpa terminal untuk pembaruan cepat.

1. Jalankan proses kompilasi kode secara lokal:
   ```bash
   npm run build
   ```
2. Temukan folder bernama **`dist`** yang baru saja dihasilkan di direktori utama proyek Anda.
3. Buka peramban, masuk ke akun Netlify, dan akses bagian **Deploys** dari situs web Anda.
4. Seret (*drag*) dan lepaskan (*drop*) folder **`dist`** tersebut ke dalam area unggah (Netlify Drop) yang disediakan di bagian bawah halaman deploys.
