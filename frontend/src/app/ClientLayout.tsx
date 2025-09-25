"use client";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <nav className="flex gap-4">
          <Link href="/">메인</Link>
          <Link href="/posts">글 목록</Link>
          <Link href="/members/login">로그인</Link>
          <button
            onClick={() => {
              console.log("로그아웃");
            }}
          >
            로그아웃
          </button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
      <footer>푸터</footer>
    </>
  );
}
