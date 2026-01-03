"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";

export default function ProfileButton() {
  const user = useUserStore((e) => e.user);

  return (
    <Button variant={"link"} asChild>
      <Link href="/profile">{user!.nickname}</Link>
    </Button>
  );
}
