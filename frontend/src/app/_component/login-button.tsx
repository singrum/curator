"use client";

import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <Button
      variant={"ghost"}
      onClick={() => {
        window.location.href = "/auth/login";
      }}
    >
      로그인
    </Button>
  );
}
