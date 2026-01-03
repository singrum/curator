import { Separator } from "@/components/ui/separator";
import { getVideoDetail } from "@/lib/actions/video";
import Link from "next/link";
import MarkdownContent from "./_components/markdown-content";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoDetail(id);
  if (!video) {
    return <div>비디오를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="prose dark:prose-invert max-w-full">
      <p className="text-muted-foreground">
        Curated by{" "}
        <Link
          href={`/curator/${video.submitter.id}`}
          className="text-muted-foreground"
        >
          {video.submitter.nickname}
        </Link>
      </p>
      <h1>{video.title}</h1>

      <Separator className="my-6" />
      <MarkdownContent>{video.content || ""}</MarkdownContent>
      <Separator className="my-12" />
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
