import { getVideoDetail } from "@/lib/actions/video";
import Link from "next/link";

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
    <div className="flex justify-center">
      <div className="prose dark:prose-invert">
        <h1>{video.title}</h1>
        <p>
          Curated by{" "}
          <Link href={`/curator/${video.submitter.id}`}>
            {video.submitter.nickname}
          </Link>
        </p>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
