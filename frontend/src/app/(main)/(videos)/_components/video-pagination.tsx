"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  total: number;
  page: number;
  lastPage: number;
}

export function VideoPagination({ total, page, lastPage }: Props) {
  // 간단하게 현재 페이지 앞뒤로 1개씩 + 첫/끝 페이지 보여주는 로직
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (lastPage <= 1) return null;

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(1, page - 1)}`}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPages().map((p, idx) => (
          <PaginationItem key={idx}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={`?page=${p}`} isActive={page === p}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(lastPage, page + 1)}`}
            className={page >= lastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
