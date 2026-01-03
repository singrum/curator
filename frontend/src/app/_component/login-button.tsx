import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href="/login">로그인</Link>
    </Button>
  );
}
