import { getUser } from "@/lib/actions/auth";

import { redirect } from "next/navigation";
import NicknameForm from "./_component/nickname-form";
import RoleForm from "./_component/role-form";

export const metadata = {
  title: "내 정보",
};

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <div className="pb-4 border-b mb-6">
        <h1 className="text-2xl font-bold">내 정보</h1>
      </div>
      <div className="space-y-6">
        <NicknameForm />
        <RoleForm />
      </div>
    </div>
  );
}
