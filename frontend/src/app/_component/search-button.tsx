"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href={"/search"}>검색</Link>
    </Button>
  );
}
