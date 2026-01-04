"use client";

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import HomeButton from "./home-button";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import ProfileButton from "./profile-button";
import SubmitButton from "./submit-button";
import TagButton from "./topic-button";

export default function Header() {
  const user = useUserStore((e) => e.user);
  const menus = [
    <HomeButton key={0} />,
    <TagButton key={1} />,
    <SubmitButton key={2} />,
    <ProfileButton key={3} />,
  ];
  return (
    <header className="space-y-0">
      <div className="pl-2 pr-4 sm:pl-4 sm:px-6 items-center flex justify-between h-13 w-full">
        <Button className="px-2" variant={"ghost"} asChild>
          <Link href="/">
            <Logo />
          </Link>
        </Button>
        <div className="flex items-center h-3">
          {user ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
      <div className="bg-blue-200 rounded-xs flex items-center mx-3 sm:mx-5 px-2 h-10">
        <div className="flex items-center h-3">
          {menus.map((e, i) => (
            <Fragment key={i}>
              {e}
              {i < menus.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="bg-muted-foreground mx-1"
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}
