"use client";

import { fetchApi } from "@/lib/client";
import { MemberWithUsernameDto } from "@/type/member";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [members, setMembers] = useState<MemberWithUsernameDto[] | null>(null);

  useEffect(() => {
    fetchApi(`/api/v1/adm/members`)
      .then(setMembers)
      .catch((rsData) => {
        alert(rsData.msg);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col gap-9">
        <h1>회원 목록</h1>
        {members === null && <div>Loading...</div>}
        {members !== null && members.length === 0 && (
          <div>회원원이 없습니다.</div>
        )}
        {members !== null && members.length > 0 && (
          <ul>
            {members.map((member) => (
              <li key={member.id}>
                <Link href={`/posts/${member.id}`}>
                  {member.id} : {member.username} : {member.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
