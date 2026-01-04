// src/app/topics/page.tsx

import { Button } from "@/components/ui/button";
import { getTopics } from "@/lib/actions/topic";
import Link from "next/link";
import { TopicPagination } from "./_components/topic-pagination";

export const metadata = {
  title: "토픽",
};

export default async function TopicPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Number((await searchParams).page) || 1;

  const { items, meta } = await getTopics(page);

  return (
    <div className="">
      <div className="pb-4 border-b mb-4">
        <h1 className="text-2xl font-bold">토픽</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-2">
        {items.map((topic) => (
          <Button
            variant="link"
            asChild
            key={topic.id}
            className="justify-start truncate px-0"
          >
            <Link href={`/topic/${topic.name}`}>
              {topic.name}
              {/* <span className="text-muted-foreground">
                ({topic.videoCount})
              </span> */}
            </Link>
          </Button>
        ))}
      </div>

      {/* 단순 페이지네이션 UI */}
      <TopicPagination
        total={meta.total}
        page={meta.page}
        lastPage={meta.lastPage}
      />
    </div>
  );
}
