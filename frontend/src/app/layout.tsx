import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "사이트 A",
  description: "REST API 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header>
          <nav className="flex gap-4">
            <Link href="/">메인</Link>
            <Link href="/posts">글 목록</Link>
          </nav>
        </header>
        <main className="flex-1 flex flex-col justify-center items-center">
          {children}
        </main>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
