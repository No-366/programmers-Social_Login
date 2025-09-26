import { fetchApi } from "@/lib/client";
import { FetchCallbacks } from "@/type/client";
import { MemberDto } from "@/type/member";
import { createContext, useState } from "react";

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuth();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
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
