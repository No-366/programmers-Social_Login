"use client";

import { useAuthContext } from "@/global/auth/hooks/useAuth";

export default function Home() {
  const { loginMember } = useAuthContext();

  if (loginMember === null) {
    return <div>로그인 후 이용해주세요.</div>;
  }

  return (
    <>
      <h1>회원 정보</h1>
      <div>
        <div>회원번호 : {loginMember.id}</div>
        <div>이름 : {loginMember.name}</div>
        <div>가입일 : {loginMember.createDate}</div>
        <div>수정일 : {loginMember.modifyDate}</div>
      </div>
    </>
  );
}
