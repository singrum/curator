import { getUser } from "@/lib/actions/auth";

import { redirect } from "next/navigation";
import NicknameForm from "./_component/nickname-form";
import RoleForm from "./_component/role-form";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
      <div className="space-y-6">
        <NicknameForm />
        <RoleForm />
      </div>
    </div>
  );
}
