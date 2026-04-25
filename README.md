# 🏢 HRM System: Absensi Karyawan & Payroll

[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Inertia](https://img.shields.io/badge/Inertia-JS-purple.svg)](https://inertiajs.com)
[![Expo](https://img.shields.io/badge/Expo-Mobile-black.svg)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Absensi Karyawan** adalah solusi manajemen sumber daya manusia (HRM) lengkap yang dirancang untuk mengelola absensi karyawan secara real-time dengan verifikasi lokasi (Geofencing) dan perhitungan gaji otomatis.

*This is a full-stack HRM solution designed for real-time employee attendance tracking with Geofencing verification and automated payroll calculation.*

---

## ✨ Fitur Utama / Key Features

### 🖥️ Admin Dashboard (Web)
- **Real-time Statistics**: Pantau kehadiran, keterlambatan, dan izin harian secara visual.
- **Geofencing Management**: Atur lokasi kantor dengan radius presisi menggunakan Google Maps/Leaflet integration.
- **Automated Payroll**: Perhitungan gaji otomatis berdasarkan kehadiran (21-20 periode), potongan keterlambatan, dan tunjangan.
- **Reporting**: Export laporan kehadiran dan lembur ke format **Excel** & **PDF**.
- **Leave Management**: Persetujuan izin/cuti dengan notifikasi otomatis ke aplikasi mobile.

### 📱 Mobile App (Android & iOS)
- **Location-Based Check-in**: Absen hanya bisa dilakukan di dalam radius kantor yang ditentukan.
- **Face/Photo Verification**: Keharusan mengunggah foto saat check-in/out untuk validasi.
- **Device Binding**: Satu akun hanya bisa digunakan pada satu perangkat terdaftar (Keamanan Ekstra).
- **History & Profile**: Pantau riwayat absensi dan status gaji secara mandiri.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React.js with Inertia.js (Single Page Application experience)
- **Styling**: Tailwind CSS & Lucide Icons
- **Mobile**: React Native / Expo
- **Database**: MySQL / SQLite (Development)
- **Documentation**: Swagger/OpenAPI for API endpoints

---

## 🚀 Instalasi / Installation

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/absensi-karyawan.git
   cd absensi-karyawan
   ```

2. **Backend Setup**
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

4. **Mobile Setup**
   ```bash
   cd mobile-react
   npm install
   npx expo start
   ```

---

## 🔒 Keamanan / Security
Proyek ini dikembangkan dengan memperhatikan aspek keamanan data:
- **Environment Variables**: Semua kredensial disimpan di `.env` (tidak diupload ke repositori).
- **Role-Based Access Control (RBAC)**: Pemisahan akses antara Admin dan Karyawan.
- **Device ID Matching**: Mencegah kecurangan absensi dari perangkat berbeda.

---

## 📄 Lisensi / License
Distribusi di bawah **MIT License**. Lihat `LICENSE` untuk informasi lebih lanjut.

---

## 👨‍💻 Author
**[Iqbal Maulana]**
- GitHub: [@yourusername](https://github.com/yourusername)
- Instagram: [Iqbal Maulana](https://www.instagram.com/tawwabin_im/)
