"use client";

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import ProfileButton from "./profile-button";
import SearchButton from "./search-button";
import SubmitButton from "./submit-button";

export default function Header() {
  const user = useUserStore((e) => e.user);
  return (
    <header className="space-y-1">
      <div className="px-2 sm:px-4 items-center flex justify-between h-12 w-full">
        <Button className="px-2" variant={"ghost"} asChild>
          <Link href="/">
            <Logo />
          </Link>
        </Button>
        <div className="flex items-center h-3">
          {user ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
      <div className="bg-blue-200 rounded-sm flex items-center mx-4 sm:mx-6 px-2 h-10">
        <div className="flex items-center h-4">
          {[
            <SearchButton key={0} />,
            <SubmitButton key={1} />,
            <ProfileButton key={2} />,
          ].map((e, i) => (
            <Fragment key={i}>
              {e}
              {i < 2 && (
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
