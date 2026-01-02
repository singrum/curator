import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GalleryThumbnails } from "lucide-react";

export function EmptyVideo() {
  return (
    <Empty className="border border-dashed max-w-md w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GalleryThumbnails />
        </EmptyMedia>
        <EmptyTitle>입력한 영상 없음.</EmptyTitle>
        <EmptyDescription>
          URL을 입력하면 미리보기가 표시됩니다.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
