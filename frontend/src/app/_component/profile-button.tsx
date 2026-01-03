"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfileButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href="/profile">내 정보</Link>
    </Button>
  );
}
