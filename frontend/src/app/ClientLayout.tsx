"use client";
import { fetchApi } from "@/lib/client";
import { FetchCallbacks } from "@/type/client";
import { MemberDto } from "@/type/member";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
function useAuth() {
  const [loginMember, setLoginMember] = useState<MemberDto | null>(null);
  const getLoginMember = (callbacks: FetchCallbacks) => {
    fetchApi("/api/v1/members/me")
      .then((data) => {
        setLoginMember(data.data.memberDto);
        callbacks.onSuccess?.(data);
      })
      .catch((err) => {
        callbacks.onError?.(err);
      });
  };
  const logout = (callbacks: FetchCallbacks) => {
    confirm("로그아웃 하시겠습니까?") &&
      fetchApi("/api/v1/members/logout", {
        method: "DELETE",
      })
        .then((data) => {
          setLoginMember(null);
          callbacks.onSuccess?.(data);
        })
        .catch((rsData) => {
          callbacks.onError?.(rsData.msg);
        });
  };

  return { loginMember, getLoginMember, logout };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loginMember, getLoginMember, logout: _logout } = useAuth();
  const isLogin = loginMember !== null;
  const router = useRouter();

  useEffect(() => {
    getLoginMember({
      onSuccess: (data) => {
        console.log("data", data);
      },
      onError: (err) => {
        console.log("err", err);
      },
    });
  }, []);

  const logout = () => {
    _logout({
      onSuccess: (data) => {
        alert(data.msg);
        router.replace("/");
      },
      onError: (rsData) => {
        alert(rsData.msg);
      },
    });
  };

  return (
    <>
      <header>
        <nav className="flex gap-4">
          <Link href="/">메인</Link>
          <Link href="/posts">글 목록</Link>
          {!isLogin && <Link href="/members/login">로그인</Link>}
          {isLogin && <button onClick={logout}>로그아웃</button>}
          {isLogin && <Link href="#">{loginMember?.name}</Link>}
        </nav>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
      <footer>푸터</footer>
    </>
  );
}
