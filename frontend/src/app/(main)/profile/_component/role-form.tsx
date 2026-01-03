"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoleLabel } from "@/constants/role";
import { useUserStore } from "@/providers/user-store-provider";

export default function RoleForm() {
  const user = useUserStore((e) => e.user);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="space-y-1 flex-col items-start">
          <div>역할</div>
        </Label>
        <div className="flex gap-2">
          <Input
            className="max-w-md w-full flex-1"
            value={UserRoleLabel[user!.role]}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
}
