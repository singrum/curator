import { getUser } from "@/lib/actions/auth";

import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import LogoutButton from "./_component/logout-button";
import NicknameForm from "./_component/nickname-form";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>

      <NicknameForm />
      <Separator className="my-6" />
      <LogoutButton />
    </div>
  );
}
