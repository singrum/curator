"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export default function LogoutButton() {
  return (
    <Button onClick={logout} variant="secondary" size="sm" className="text-xs">
      로그아웃
    </Button>
  );
}
