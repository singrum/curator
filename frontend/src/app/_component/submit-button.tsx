"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";

export default function SubmitButton() {
  const user = useUserStore((e) => e.user);
  return (
    <Button variant={"link"} asChild>
      <Link href={user ? "/submit" : "/login"}>제출</Link>
    </Button>
  );
}
