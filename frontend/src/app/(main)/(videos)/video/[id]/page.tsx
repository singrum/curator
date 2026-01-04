import { Separator } from "@/components/ui/separator";
import { getVideoDetail } from "@/lib/actions/video";
import { IdtoUrl } from "@/lib/youtube";
import CommentForm from "./_components/comment-form";
import Comments from "./_components/comments";
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
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{video.articleTitle}</h1>
      <p className="font-medium">
        <a
          href={IdtoUrl(video.videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline font-medium underline-offset-4"
        >
          {video.title}
        </a>{" "}
        by{" "}
        <a
          href={video.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline font-medium  underline-offset-4"
        >
          {video.authorName}
        </a>
      </p>
      <Separator className="my-4" />
      <MarkdownContent>{video.content || ""}</MarkdownContent>
      <div className="aspect-video w-full overflow-hidden rounded-xs my-6">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <Comments
        comments={video.comments}
        videoId={video.id}
        commentsCount={video.commentCount}
      />
      <CommentForm id={video.id} />
    </div>
  );
}
