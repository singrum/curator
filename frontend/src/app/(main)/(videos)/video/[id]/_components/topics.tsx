import { Button } from "@/components/ui/button";
import { Topic } from "@/lib/types";
import Link from "next/link";

export default function Topics({ topics }: { topics: Topic[] }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="font-medium text-sm">토픽: </div>
      {topics.map((topic) => (
        <Button key={topic.id} asChild variant="link" className="px-0">
          <Link href={`/topic/${topic.name}`}>{topic.name}</Link>
        </Button>
      ))}
    </div>
  );
}
