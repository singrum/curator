import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href="/submit">제출</Link>
    </Button>
  );
}
