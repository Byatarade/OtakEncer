# 🧠 OtakEncer - E-Learning Masa Depan dengan Neura AI

<div align="center">
  <h3>Belajar Lebih Pintar, Bukan Lebih Keras!</h3>
  <p>Platform edukasi adaptif yang mengintegrasikan kecerdasan buatan untuk menciptakan ekosistem pembelajaran yang mulus, cerdas, dan menyenangkan.</p>
</div>

***

## 🌐 Tentang OtakEncer

**OtakEncer** adalah platform *e-learning* inovatif yang dirancang untuk merevolusi cara siswa belajar. Dengan fokus pada pengurangan beban kognitif dan pembelajaran adaptif, OtakEncer hadir untuk menjembatani kesenjangan antara kebutuhan siswa saat ini dan standar industri teknologi di masa depan. Platform ini didukung oleh **Neura AI**, asisten pembelajaran cerdas yang membantu pengguna memahami materi kompleks dengan cepat dan efisien.

---

## ✨ Fitur Unggulan

OtakEncer menghadirkan berbagai fitur revolusioner yang dirancang khusus untuk memaksimalkan potensi belajar setiap individu:

1. **📚 Generate Materi Otomatis (Smart Material Generator)**
   Ubah berbagai sumber pembelajaran menjadi materi ringkas dan mudah dipahami! Mendukung konversi dari teks, dokumen (PDF/Word), hingga transkrip video YouTube secara otomatis menggunakan AI.

2. **🤖 Chatbot Neura AI**
   Asisten virtual pribadi yang siap menjawab pertanyaan, memberikan penjelasan mendalam, atau membantu menganalisis konsep sulit selama proses belajar—tesedia 24/7.

3. **📝 Quiz & Flashcard Cerdas**
   Tingkatkan daya ingat dan pemahaman dengan fitur evaluasi interaktif. Kuiz dan *flashcard* dihasilkan secara instan dan otomatis berdasarkan materi yang sedang dipelajari.

4. **✨ Neura AI Highlighting**
   Sistem penyorotan cerdas yang secara otomatis mengidentifikasi konsep kunci, definisi, dan informasi penting dalam sebuah teks, membantu pengguna tetap fokus pada hal-hal esensial.

5. **📊 Dashboard Interaktif**
   Sistem penelusuran *progress* pembelajaran yang personal, memungkinkan pengguna untuk memantau waktu belajar, materi yang dikuasai, dan arsip pembelajaran secara terpusat.

6. **🔐 Login & Register Aman**
   Proses autentikasi yang cepat dan tanpa hambatan dengan integrasi *Single Sign-On* (seperti Google OAuth) untuk login yang lebih mudah.

---

## 🛠️ Stack Teknologi

Proyek ini dibangun menggunakan web stack modern untuk menjamin performa tinggi, UI/UX premium, dan skalabilitas:

- **Framework Core:** [Next.js](https://nextjs.org) (App Router, ekosistem React)
- **Styling & Animasi:** [Tailwind CSS v4](https://tailwindcss.com/) bersama *Framer Motion* untuk memberikan desain *glassmorphism* dan interaksi mikro yang memukau.
- **Backend & Autentikasi:** [Supabase](https://supabase.com/)
- **Kecerdasan Buatan (AI):** Terintegrasi menggunakan multi-AI provider (Google Generative AI, Groq) untuk memproses *natural language* dan instruksi cerdas secara *real-time*.

---

## 📂 Struktur Projek

Berikut adalah gambaran umum dari arsitektur direktori proyek ini:

```bash
OtakEncer/
├── app/                  # Routing Next.js (App Router)
│   ├── dashboard/        # Halaman dashboard (Library materi, Profile)
│   ├── layout.tsx        # Root layout untuk struktur halaman Global
│   ├── page.tsx          # Landing page utama OtakEncer
│   └── ...               
├── components/           # Kumpulan komponen UI re-usable (Navbar, Footer, Modal, Cards)
├── lib/                  # Utilitas fungsional, konfigurasi eksternal, dan integrasi API
├── public/               # Asset statis, gambar, logo, dan file publik
├── package.json          # Konfigurasi project dan library dependencies
└── README.md             # Dokumentasi proyek (Anda sedang membacanya)
```

---

## 🚀 Cara Menjalankan Projek Secara Lokal

Ikuti langkah-langkah berikut untuk mencoba OtakEncer di komputer Anda:

1. **Clone repository ini**
   ```bash
   git clone <https://github.com/Byatarade/OtakEncer.git>
   cd OtakEncer
   ```

2. **Install Dependensi**
   Anda bisa menggunakan `npm`, `yarn`, atau alat serupa.
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env.local` di *root* direktori dan atur konfigurasi API Key (Contoh: `NEXT_PUBLIC_SUPABASE_URL`, kunci API Google Gemini/Groq, dll).

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**
   Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000). Anda siap bereksplorasi!

---

<div align="center">
  <p><i>"Masa Depan Edukasi Kini Ada di Genggaman Anda."</i></p>
  <strong>© Pasti Sukses Team</strong>
</div>
