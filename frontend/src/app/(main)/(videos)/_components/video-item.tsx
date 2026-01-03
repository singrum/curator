import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
} from "@/components/ui/item";
import Image from "next/image";
import Link from "next/link";

import { Video } from "@/lib/types";

export default function VideoItem({ data }: { data: Video }) {
  return (
    <Item key={data.id} className="p-0 flex-nowrap items-stretch">
      <a
        href={`https://www.youtube.com/watch?v=${data.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemMedia variant="image" className="h-20 w-auto aspect-video">
          <Image
            src={`https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`}
            alt={"main image"}
            width={160}
            height={200}
            className="mx-auto rounded-lg "
          />
        </ItemMedia>
      </a>

      <ItemContent className="flex flex-col justify-between">
        <div className="flex">
          <Link href={`/video/${data.id}`} className="space-y-1">
            <ItemHeader className="break-all max-w-full overflow-hidden text-ellipsis font-semibold text-link ">
              {data.title}
            </ItemHeader>
            <ItemDescription className="break-all text-foreground">
              {data.content}
            </ItemDescription>

            <ItemDescription className="text-sm text-muted-foreground">
              {new Date(data.createdAt).toLocaleTimeString()} | 댓글{" "}
              {data.commentCount}개
            </ItemDescription>
          </Link>
        </div>
      </ItemContent>
    </Item>
  );
}
