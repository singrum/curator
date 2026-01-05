import { UserRole } from "@/constants/role";
import { getUser } from "@/lib/actions/auth";
import GeneralRoleAlert from "./_components/general-role-alert";
import SubmitForm from "./_components/submit-form";
export const metadata = {
  title: "제출",
};

export default async function Page() {
  const user = await getUser();

  if (user && user.role == UserRole.GENERAL) {
    return <GeneralRoleAlert />;
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
