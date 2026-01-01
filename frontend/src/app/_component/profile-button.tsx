"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/providers/user-store-provider";

export default function ProfileButton() {
  const user = useUserStore((e) => e.user);

  return <Button variant={"ghost"}>{user?.nickname}</Button>;
}
