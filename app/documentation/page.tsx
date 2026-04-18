"use client";

import Link from "next/link";
import { ArrowLeft, Search, Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const sections = [
  { id: "apa-itu", title: "Apa itu OtakEncer?", keywords: "otakencer aplikasi adalah" },
  { id: "siapa", title: "Aplikasi Ini Buat Siapa?", keywords: "siapa pengguna belajar mahasiswa" },
  { id: "merangkum", title: "Cara Mudah Merangkum Materi", keywords: "merangkum meringkas poin pdf unggah" },
  { id: "flashcard", title: "Melatih Ingatan Memakai Flashcard", keywords: "flashcard kartu ingatan memori" },
  { id: "ujian", title: "Mencoba Fitur Ujian Mandiri", keywords: "ujian latihan soal simulasi" },
  { id: "sistem-ai", title: "Kerja Mesin AI Belakang Layar", keywords: "ai mesin sistem kecerdasan server" },
  { id: "batas-penggunaan", title: "Batas Pemakaian Sehari-hari", keywords: "batas limit kuota harian maksimal" },
  { id: "keamanan", title: "Keamanan Mengunggah & Tips", keywords: "keamanan aman privasi" },
  { id: "masalah", title: "Mencari Solusi Eror Layanan", keywords: "solusi masalah eror error gagal loading" }
];

export default function DocumentationPage() {
  const [activeId, setActiveId] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sec.keywords.includes(searchQuery.toLowerCase())
  );

  // Simple scrollspy to highlight right sidebar TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } 
    );

    const headings = document.querySelectorAll("h2, h3");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // offset for navbar
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false); // Close mobile menu when a link is clicked
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif] selection:bg-[#672cb9]/20 text-slate-800 flex flex-col">
      {/* Top Navbar (Sticky) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md flex-none border-b border-slate-900/10 bg-white/80 supports-backdrop-blur:bg-white/60">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-16 lg:px-8 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-slate-500 hover:text-slate-900"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="hidden lg:flex items-center gap-2 group">
                <ArrowLeft size={18} className="text-slate-400 group-hover:text-slate-700 transition" />
                <span className="sr-only">Back</span>
              </Link>
              <Link href="/documentation" className="flex items-center gap-2">
                <Image src="/assets/logo.avif" alt="OtakEncer" width={24} height={24} className="object-contain brightness-0" />
                <span className="font-bold text-[18px] text-black">OtakEncer Documentation</span>
              </Link>
            </div>
            
            <div className="relative hidden sm:block w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Cari dokumentasi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#672cb9] focus:border-transparent transition-all"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <kbd className="hidden sm:inline-block border border-slate-200 rounded bg-white px-1.5 text-[10px] font-sans font-medium text-slate-400">Ctrl K</kbd>
              </span>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50 p-2 custom-scrollbar">
                  {filteredSections.length > 0 ? (
                    filteredSections.map(sec => (
                      <button
                        key={sec.id}
                        onMouseDown={() => {
                          const element = document.getElementById(sec.id);
                          if (element) {
                            window.scrollTo({
                              top: element.offsetTop - 100,
                              behavior: 'smooth'
                            });
                          }
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#672cb9] rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Search size={14} className="text-slate-400" />
                        {sec.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-center text-slate-500">
                      Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto w-full flex items-start px-4 sm:px-6 lg:px-8 gap-8">
        
        {/* OVERLAY FOR MOBILE */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LEFT SIDEBAR (Navigation) */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-[280px] bg-[#f8fafc] border-r border-slate-200/60 shadow-xl
          px-6 pb-10 pt-6 mt-16 custom-scrollbar overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-16 lg:mt-0 lg:z-0 lg:shrink-0 lg:bg-transparent lg:shadow-none lg:border-none lg:translate-x-0 lg:h-[calc(100vh-4rem)] lg:pt-8 lg:px-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <nav className="text-base lg:text-[14px]">
            <ul className="space-y-8">
              <li>
                <h5 className="font-bold text-slate-900 mb-3 text-sm">Pengenalan</h5>
                <ul className="space-y-2 border-l border-slate-200">
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'apa-itu')} href="#apa-itu" className={`block pl-4 -ml-px border-l ${activeId === 'apa-itu' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Apa itu OtakEncer?</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'siapa')} href="#siapa" className={`block pl-4 -ml-px border-l ${activeId === 'siapa' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Untuk Siapa Aplikasi Ini?</a>
                  </li>
                </ul>
              </li>
              <li>
                <h5 className="font-bold text-slate-900 mb-3 text-sm">Cara Menggunakan</h5>
                <ul className="space-y-2 border-l border-slate-200">
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'merangkum')} href="#merangkum" className={`block pl-4 -ml-px border-l ${activeId === 'merangkum' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Merangkum Materi</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'flashcard')} href="#flashcard" className={`block pl-4 -ml-px border-l ${activeId === 'flashcard' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Memakai Flashcard</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'ujian')} href="#ujian" className={`block pl-4 -ml-px border-l ${activeId === 'ujian' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Latihan Ujian</a>
                  </li>
                </ul>
              </li>
              <li>
                <h5 className="font-bold text-slate-900 mb-3 text-sm">Informasi Teknis</h5>
                <ul className="space-y-2 border-l border-slate-200">
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'sistem-ai')} href="#sistem-ai" className={`block pl-4 -ml-px border-l ${activeId === 'sistem-ai' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Cara Kerja AI</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'batas-penggunaan')} href="#batas-penggunaan" className={`block pl-4 -ml-px border-l ${activeId === 'batas-penggunaan' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Batas Pemakaian</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'keamanan')} href="#keamanan" className={`block pl-4 -ml-px border-l ${activeId === 'keamanan' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Tips & Keamanan</a>
                  </li>
                  <li>
                    <a onClick={(e) => smoothScroll(e, 'masalah')} href="#masalah" className={`block pl-4 -ml-px border-l ${activeId === 'masalah' ? 'border-[#672cb9] text-[#672cb9] font-semibold' : 'border-transparent hover:border-slate-400 text-slate-600 hover:text-slate-900'}`}>Solusi Eror</a>
                  </li>
                </ul>
              </li>
            </ul>
            
            <div className="mt-12 lg:hidden border-t border-slate-200 pt-6">
              <Link href="/" className="flex items-center gap-2 group text-sm font-semibold text-slate-600 hover:text-slate-900">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="">Kembali ke Beranda</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT CENTER */}
        <main className="flex-1 min-w-0 pt-8 lg:pt-10 pb-24 w-full flex justify-center xl:justify-start">
           <article className="w-full max-w-3xl bg-white rounded-[2rem] p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/60 prose prose-slate prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-img:rounded-xl prose-a:text-[#672cb9] hover:prose-a:text-[#522199] max-w-none">
             
              <div className="mb-12 border-b border-slate-200 pb-10">
               <p className="text-[#672cb9] font-bold text-[13px] mb-3 uppercase tracking-[0.2em]">Dokumentasi OtakEncer</p>
               <h1 id="apa-itu" className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
                 Panduan Lengkap Menggunakan OtakEncer
               </h1>
               <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                 Selamat datang di dokumentasi OtakEncer. Di sini, Anda bisa mempelajari dengan mudah cara membaca materi yang sangat panjang tanpa harus menghabiskan banyak waktu luang. Kami menyederhanakan bahasa teknis supaya mudah dicerna siapapun.
               </p>
             </div>

             <h2 id="apa-itu" className="text-slate-900 scroll-mt-24 mt-0 text-2xl font-bold">
               Apa itu OtakEncer?
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               OtakEncer adalah aplikasi yang membantu penggunanya belajar lebih efisien. Seringkali, kita kesulitan menyerap materi yang panjang dan rumit, seperti dari buku panduan sekolah tebal atau merekam presentasi materi kuliah berjam-jam yang membuat lelah.
             </p>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Kami membangun layanan ini guna mempersingkat proses itu. Semua materi dari PDF maupun video ditata dan dirangkum untuk menyaring hal paling penting saja, dalam bahasa yang lebih manusiawi dan tidak berbelit-belit. Akhirnya, Anda bisa meluangkan banyak waktu luang untuk hal lain dan lebih mudah masuk ke isi bahasan.
             </p>

             <h2 id="siapa" className="text-slate-900 mt-12 scroll-mt-24 text-2xl font-bold">
               Aplikasi Ini Buat Siapa?
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Siapapun yang ingin membenahi cara belajarnya dan menyerap informasi atau catatan tebal dengan efisien. OtakEncer dipakai para pelajar untuk latihan ujian, mahasiswa tingkat akhir agar dapat me-review seluruh jurnal teori dengan cepat, maupun profesional kerja yang harus mencerna laporan pekerjaan tanpa kewalahan.
             </p>

             <hr className="my-10 border-slate-200/60" />

             <h2 id="merangkum" className="text-slate-900 scroll-mt-24 text-2xl font-bold">
               Cara Mudah Merangkum Materi
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Fitur dasar dari platform kami adalah memperpendek materi. Langkah mengerjakannya sangat sederhana:
             </p>
             <ol className="list-decimal pl-5 my-6 text-slate-700 space-y-3 marker:text-slate-400">
               <li>
                 Siapkan dokumen PDF atau cari tautan video YouTube yang isi teks ucapannya bisa terbaca oleh mesin otomatis (terdapat subtitle / caption otomatis).
               </li>
               <li>
                 Unggah file atau tautan tersebut lewat halaman utama materi. Pastikan untuk ukuran dokumen Anda tidak lebih dari 10 MB per berkas agar kuota tidak terpotong karena kegagalan pemrosesan dari perangkat Anda.
               </li>
               <li>
                 Mesin kami akan perlahan membaca seluruh halaman, kemudian membaginya menjadi beberapa poin mudah dibaca dan ringkas.
               </li>
             </ol>

             <h2 id="flashcard" className="text-slate-900 scroll-mt-24 mt-10 text-2xl font-bold">
               Melatih Ingatan Memakai Flashcard
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Setelah materi sukses dirangkum, sangat direkomendasikan Anda membaca Flashcard yang ikutan terbuat secara bersamaan. Flashcard adalah sistem kartu bolak-balik yang sangat populer untuk melatih otak menajamkan memori pada suatu konsep tertentu.
             </p>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Silakan perhatikan kartu tanyanya. Coba pikirkan apa poin penting yang ingin ditanyakan. Kalau tak ingat, cukup ketuk kartu untuk membalik isi jawabannya. Ulangi latihan membongkar kartu ini secara teratur agar materi masuk dalam ingatan jangka panjang.
             </p>

             <h2 id="ujian" className="text-slate-900 scroll-mt-24 mt-10 text-2xl font-bold">
               Mencoba Fitur Ujian Mandiri
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Merasa yakin sudah menangkap keseluruhan materinya? Mari uji diri lewat latihan ujian. Layaknya ulangan harian, sistem akan membangun kumpulan soal berbentuk isian, essay, hingga pilihan ganda secara cepat dari konten yang diunggah.
             </p>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Pada mula ujian, sebuah pewaktu berjalan akan menghitung mundur guna melatih keterampilan fokus Anda di bawah tekanan waktu yang sempit. Nilai akhir lantas disajikan saat proses penyelesaian, dibawakan beserta koreksi silang pada setiap balasan jawaban Anda.
             </p>

             <hr className="my-10 border-slate-200/60" />

             <h2 id="sistem-ai" className="text-slate-900 scroll-mt-24 text-2xl font-bold">
               Mengenal Kerja Mesin AI Belakang Layar
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Sistem untuk berpikir ini tak bertumpu pada satu alat pintar saja. Membaca huruf di dokumen maupun menyimpulkannya memerlukan banyak barisan komputer cerdas yang siap mengantre melayani jawaban.
             </p>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Secara mendasar, pengolahan paling utama diurus oleh kecerdasan dari Google terbaru. Namun semisal sewaktu-waktu servernya sedang penat memproses puluhan juta percakapan di seluruh dunia, maka tanpa dikomando lagi, aplikasi kita mencabangkan tanggungjawabnya ke barisan mesin pemikir cadangan lain. Hasilnya kerjaan materi Anda relatif jarang terselip akibat jaringan terbebani.
             </p>

             <h2 id="batas-penggunaan" className="text-slate-900 scroll-mt-24 mt-10 text-2xl font-bold">
               Batas Pemakaian Sehari-hari
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Karena server layanan pintar mahal berjalan spesifik per permintaan, setiap akun dibekali dengan patokan batas wajar demi menghindari penyalahgunaan terus-menerus:
             </p>
             <ul className="list-disc pl-5 my-6 text-slate-700 space-y-2">
               <li>Setiap pengguna yang masuk, diizinkan <b>membuat 3 teks ringkasan</b> berkas, dan <b>meracik 2 simulasi ujian</b> baru selama waktu 24 jam. Jatah tersebut dipulihkan penuh tiap berdentangnya tengah malam.</li>
               <li>Agar otak komputer tidak amnesia dalam mengingat konteksnya yang terlalu berlembar-lembar, kami membatasinya di angka maksimum 35.000 aksara sebelum ia mulai lupa diri membalas isi tulisannya. Harap menyeleksi buku ke bentukan keping per bab halaman.</li>
             </ul>

             <h2 id="keamanan" className="text-slate-900 scroll-mt-24 mt-10 text-2xl font-bold">
               Keamanan Mengunggah & Tips Tambahan
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Anda pasti memedulikan akurasi dokumen yang sedang ditafsir. Perhatikan panduan bersih sederhana agar hasil bacanya tetap lancar:
             </p>
             <ul className="list-disc pl-5 text-slate-700 my-6 space-y-2">
               <li>Usahakan memasukkan file PDF murni ketikan tangan aslinya (Misal: Simpan sebagai PDF di Word). Komputer lebih berat kesulitan bilamana file itu didapat asli tangkapan dari foto mesin scanner yang menumpuk tak karuan alias jelek tanpa bentuk huruf murni.</li>
               <li>Tiap rangkuman yang dicetak ditautkan secara sangat ketat pada bilik ruang penyimpanan pribadi Anda saja. Laci yang berisi catatan materi tak satupun dapat diusik orang lewat bahkan untuk mata sang perawat administrator server ini.</li>
             </ul>

             <h2 id="masalah" className="text-slate-900 scroll-mt-24 mt-10 text-2xl font-bold">
               Mencari Solusi Eror Layanan
             </h2>
             <p className="mt-4 text-slate-700 leading-relaxed">
               Sistem tak senantiasa berjalan konstan, maka ikuti panduan ampuh guna mencairkan keadaan aneh dari pengoperasiannya:
             </p>

             <div className="space-y-4 my-6">
                <details className="border border-slate-200/80 bg-slate-50/50 rounded-xl p-4 cursor-pointer group">
                  <summary className="font-semibold text-slate-800 outline-none select-none text-[15px]">Teks gagal diperiksa atau kalimat &quot;Gagal mengurai dokumen&quot;</summary>
                  <p className="mt-3 text-[14px] text-slate-600 leading-relaxed pl-5 border-l-2 border-[#672cb9]/30">Kemungkinan terbesar pemilik sah buku PDF tersebut menanamkan perlindungan keamanan (*Password / Protected File*) supaya isinya terhalang penyalinan komputer sembarang. Hal ini berakibat rintangan bagi AI kita meniru tulisan dalam dokumen. Sila menjebol pelindungnya dulu dengan fasilitas pembuka PDF luar di Internet.</p>
                </details>
                <details className="border border-slate-200/80 bg-slate-50/50 rounded-xl p-4 cursor-pointer group">
                  <summary className="font-semibold text-slate-800 outline-none select-none text-[15px]">Layar ringkasan tidak timbul dan blank tanpa konten</summary>
                  <p className="mt-3 text-[14px] text-slate-600 leading-relaxed pl-5 border-l-2 border-[#672cb9]/30">Itu adalah tanda dimana proses telah keburu dihentikan karena lama saat mengambil urutan layanan antrian, hingga melebihi waktu maksimum server sekitar 120 hitungan detik lamanya. Tolong jalani rutinitas tekan tombol muat ulang laman tersebut dan cobalah diwaktu selanjutnya. Jangan gelisah mengenai tiket harian akan lenyap, tidak ada kuota yang dikurangi ketika tugas dibatalkan di tengah jalan oleh mesin.</p>
                </details>
                <details className="border border-slate-200/80 bg-slate-50/50 rounded-xl p-4 cursor-pointer group">
                  <summary className="font-semibold text-slate-800 outline-none select-none text-[15px]">Angka laju persen berhenti atau bahkan mengedip berkali-kali berkelanjutan</summary>
                  <p className="mt-3 text-[14px] text-slate-600 leading-relaxed pl-5 border-l-2 border-[#672cb9]/30">Keberlanjutan kiriman informasi antar menara pemancar ke hape atau laman browser sering macet buntut masalah sambungan WiFi yang rontok. Pertahankan Anda bernaung di jaringan kencang tiada sendat sekalian demi meyakinkan pantulan data presentasi proses di belakang panggung tidak mogok terhalang macet transmisi internet.</p>
                </details>
             </div>

             <hr className="my-12 border-slate-200/60" />

             <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center py-6 gap-6 sm:gap-0">
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selanjutnya</p>
                  <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors group">
                    Kembali Bikin Materi <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </Link>
               </div>
               <div className="sm:text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pengelola Dokumen</p>
                  <div className="text-sm font-medium text-slate-900">Pasti Sukses Team &copy; 2026</div>
               </div>
             </div>

           </article>
        </main>

        {/* RIGHT SIDEBAR (On this page / Pertanyaan) */}
        <aside className="hidden xl:block w-[240px] shrink-0 sticky top-16 pt-8 pb-10 pl-4">
          <div className="flex flex-col justify-between min-h-full">
            <div>
              <h5 className="text-slate-900 font-bold mb-4 text-sm">Di Halaman Ini</h5>
              <ul className="space-y-3.5 text-slate-500 text-[13px]">
                <li><a onClick={(e) => smoothScroll(e, 'apa-itu')} href="#apa-itu" className={`hover:text-slate-900 transition-colors ${activeId === 'apa-itu' ? 'text-[#672cb9] font-semibold' : ''}`}>Apa itu OtakEncer?</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'siapa')} href="#siapa" className={`hover:text-slate-900 transition-colors ${activeId === 'siapa' ? 'text-[#672cb9] font-semibold' : ''}`}>Untuk Siapa Aplikasi Ini?</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'merangkum')} href="#merangkum" className={`ml-3 hover:text-slate-900 transition-colors ${activeId === 'merangkum' ? 'text-[#672cb9] font-semibold' : ''}`}>Cara Merangkum Materi</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'flashcard')} href="#flashcard" className={`ml-3 hover:text-slate-900 transition-colors ${activeId === 'flashcard' ? 'text-[#672cb9] font-semibold' : ''}`}>Memakai Flashcard</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'ujian')} href="#ujian" className={`ml-3 hover:text-slate-900 transition-colors ${activeId === 'ujian' ? 'text-[#672cb9] font-semibold' : ''}`}>Latihan Ujian</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'sistem-ai')} href="#sistem-ai" className={`hover:text-slate-900 transition-colors ${activeId === 'sistem-ai' ? 'text-[#672cb9] font-semibold' : ''}`}>Cara Kerja AI</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'batas-penggunaan')} href="#batas-penggunaan" className={`hover:text-slate-900 transition-colors ${activeId === 'batas-penggunaan' ? 'text-[#672cb9] font-semibold' : ''}`}>Batas Pemakaian</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'keamanan')} href="#keamanan" className={`hover:text-slate-900 transition-colors ${activeId === 'keamanan' ? 'text-[#672cb9] font-semibold' : ''}`}>Tips & Keamanan</a></li>
                <li><a onClick={(e) => smoothScroll(e, 'masalah')} href="#masalah" className={`ml-3 hover:text-slate-900 transition-colors ${activeId === 'masalah' ? 'text-[#672cb9] font-semibold' : ''}`}>Solusi Eror</a></li>
              </ul>
            </div>
            
            <div className="border-t border-slate-200/60 pt-6 mt-10">
              <h5 className="text-slate-900 font-semibold mb-3">Ada Pertanyaan?</h5>
              <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">Punya kritik, saran, atau menemukan kesalahan di layanan ini? Beri tahu tim perbaikan kami dengan mengirim pesan teks.</p>
              <a href="mailto:cs@otakencer.me" className="inline-flex justify-center w-full items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-colors">
                Hubungi Bantuan
              </a>
            </div>
          </div>
        </aside>

      </div>

      {/* Embedded CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
        }
      `}} />
    </div>
  );
}
