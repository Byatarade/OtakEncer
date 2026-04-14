import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | OtakEncer",
    default: "OtakEncer - Ubah Dokumenmu Menjadi Materi Siap Pelajari",
  },
  description: "Platform AI pintar yang mengubah dokumen PDF, dokumen teks, hingga link YouTube atau Audio menjadi materi interaktif yang siap dipelajari. Tingkatkan efisiensi dan produktivitas belajar Anda secara cepat.",
  applicationName: "OtakEncer",
  authors: [{ name: "OtakEncer Team" }],
  generator: "Next.js",
  keywords: ["AI untuk Pendidikan", "Ringkasan Dokumen Otomatis", "Materi Interaktif", "Chat AI Dokumen", "Belajar Cerdas", "Ubah PDF ke Materi", "OtakEncer"],
  referrer: "OtakEncer",
  themeColor: "#672cb9",
  colorScheme: "light",
  creator: "OtakEncer",
  publisher: "OtakEncer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://otakencer.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "OtakEncer - Ubah Dokumen Kompleks Menjadi Materi Super Mudah",
    description: "Platform AI inovatif yang memecahkan rintangan pembelajaran. Kami mengubah PDF, dokumen, YouTube, dan Audio Anda menjadi materi interaktif dalam sekejap.",
    url: "https://otakencer.me",
    siteName: "OtakEncer.me",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.jpg", // Anda dapat menggantinya nanti di folder public/assets
        width: 1200,
        height: 630,
        alt: "OtakEncer - Platform AI Tercepat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OtakEncer - Pembelajaran AI Pintar",
    description: "Tingkatkan produktivitas 10x lipat lebih cepat! AI cerdas yang membantu merangkum PDF dan video langsung menjadi materi pelajaran.",
    images: ["/assets/og-image.jpg"], // Gambar yang akan tampil di WhatsApp, Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "isi-dengan-google-site-verification-anda", // Ganti ini saat mendaftar GSC
  },
};

export const viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} ${inter.variable} antialiased bg-white text-black min-h-[100dvh]`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <body className={`min-h-[100dvh] flex flex-col font-montserrat bg-white text-black`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
