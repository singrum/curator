import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GeneralRoleAlert() {
  return (
    <div className="space-y-4">
      <div className="font-medium">
        편집자 이상의 권한이 있어야 제출할 수 있습니다.
      </div>
      <Button variant="link" className="text-base px-0" asChild>
        <Link href="/profile">권한 신청</Link>
      </Button>
    </div>
  );
}
