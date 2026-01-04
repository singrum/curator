"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  total: number;
  page: number;
  lastPage: number;
}

export function TopicPagination({ page, lastPage }: Props) {
  if (lastPage <= 1) return null;

  return (
    <div className="mt-10 flex items-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        asChild
        disabled={page <= 1}
        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={`?page=${Math.max(1, page - 1)}`} scroll={false}>
          이전
        </Link>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        asChild
        disabled={page >= lastPage}
        className={page >= lastPage ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={`?page=${Math.min(lastPage, page + 1)}`} scroll={false}>
          다음
        </Link>
      </Button>
    </div>
  );
}
