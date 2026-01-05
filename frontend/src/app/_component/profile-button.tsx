"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";

export default function ProfileButton() {
  const user = useUserStore((e) => e.user);
  return user ? (
    <Button variant={"link"} asChild>
      <Link href="/profile">내 정보</Link>
    </Button>
  ) : (
    <Button
      onClick={() => {
        alert("로그인이 필요합니다.");
      }}
      variant={"link"}
    >
      내 정보
    </Button>
  );
}
