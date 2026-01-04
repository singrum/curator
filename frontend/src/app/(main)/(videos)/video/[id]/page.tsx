import { getVideoDetail } from "@/lib/actions/video";
import { IdtoUrl } from "@/lib/youtube";
import { Metadata } from "next";
import CommentForm from "./_components/comment-form";
import Comments from "./_components/comments";
import MarkdownContent from "./_components/markdown-content";
import Topics from "./_components/topics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const video = await getVideoDetail(id);
  if (!video) {
    return {
      title: "404 Not Found",
      description: "",
    };
  }
  return {
    title: video.articleTitle,
    description: video.content.slice(0, 160),
  };
}

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
    <div className="space-y-2 wrap-break-word">
      <h1 className="text-2xl font-bold">{video.articleTitle}</h1>
      <p className="font-medium text-xs mb-8">
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
      <Topics topics={video.topics} />
      <Comments
        comments={video.comments}
        videoId={video.id}
        commentsCount={video.commentCount}
      />
      <CommentForm id={video.id} />
    </div>
  );
}
