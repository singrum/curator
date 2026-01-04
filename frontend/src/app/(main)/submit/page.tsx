import { UserRole } from "@/constants/role";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import GeneralRoleAlert from "./_components/general-role-alert";
import SubmitForm from "./_components/submit-form";
export const metadata = {
  title: "제출",
};

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role == UserRole.GENERAL) {
    <GeneralRoleAlert />;
  }
  return (
    <div>
      <div className="pb-4 border-b mb-6">
        <h1 className="text-2xl font-bold">제출</h1>
      </div>
      <SubmitForm />
    </div>
  );
}
