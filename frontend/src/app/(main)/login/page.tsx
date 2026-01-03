import { Button } from "@/components/ui/button";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import Link from "next/link";
export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">로그인이 필요합니다.</h1>
      <Button asChild>
        <Link href="/auth/login">
          <SiGoogle />
          구글로 로그인하기
        </Link>
      </Button>
    </div>
  );
}
