import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
} from "@/components/ui/item";
import Link from "next/link";

import { Video } from "@/lib/types";

export default function VideoItem({ data }: { data: Video }) {
  return (
    <Item key={data.id} className="p-0 flex-nowrap items-stretch">
      <ItemContent className="flex flex-col justify-between">
        <div className="flex">
          <Link href={`/video/${data.id}`} className="space-y-1">
            <ItemHeader className="break-all max-w-full overflow-hidden text-ellipsis font-semibold text-link text-base">
              {data.articleTitle}
            </ItemHeader>
            <ItemDescription className="break-all text-foreground">
              {data.content}
            </ItemDescription>

            <ItemDescription className="text-xs text-muted-foreground">
              {new Date(data.createdAt).toLocaleString("ko-KR", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
              })}{" "}
              | 댓글: {data.commentCount}
            </ItemDescription>
          </Link>
        </div>
      </ItemContent>
    </Item>
  );
}
