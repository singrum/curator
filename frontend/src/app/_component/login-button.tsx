import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button variant={"secondary"} asChild size="sm" className="text-xs">
      <Link href="/auth/login">로그인</Link>
    </Button>
  );
}
