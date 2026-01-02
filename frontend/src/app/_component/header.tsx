"use client";

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";
import LoginButton from "./login-button";
import ProfileButton from "./profile-button";
import SubmitButton from "./submit-button";

export default function Header() {
  const user = useUserStore((e) => e.user);
  return (
    <div className="flex bg-sidebar">
      <header className="px-2 sm:px-4 items-center flex justify-between container h-12 mx-auto ">
        <Button className="px-2" variant={"ghost"} asChild>
          <Link href="/">
            <Logo />
          </Link>
        </Button>
        <div className="flex items-center gap-2 h-4">
          <SubmitButton />
          {/* <Separator className="h-full" orientation="vertical" />
          <ModeToggle /> */}
          <Separator className="h-full" orientation="vertical" />
          {user ? <ProfileButton /> : <LoginButton />}
        </div>
      </header>
    </div>
  );
}
