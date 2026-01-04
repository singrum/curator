"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TopicButton() {
  return (
    <Button variant={"link"} asChild>
      <Link href={"/topic"}>토픽</Link>
    </Button>
  );
}
