import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <Button variant={"secondary"} asChild size="sm" className="text-xs">
      <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`}>로그인</a>
    </Button>
  );
}
