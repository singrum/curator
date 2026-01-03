import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href="/">홈</Link>
    </Button>
  );
}
