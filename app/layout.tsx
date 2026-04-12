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
  title: "OtakEncer",
  description: "Ubah Dokumenmu Menjadi Materi Siap Jadi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-montserrat`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
