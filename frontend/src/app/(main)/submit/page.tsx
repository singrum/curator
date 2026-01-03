import { UserRole } from "@/constants/role";
import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import GeneralRoleAlert from "./_components/general-role-alert";
import SubmitForm from "./_components/submit-form";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role == UserRole.GENERAL) {
    <GeneralRoleAlert />;
  }
  return <SubmitForm />;
}
