import { getVideos } from "@/lib/actions/video";
import VideoItem from "./_components/video-item";
import { VideoPagination } from "./_components/video-pagination";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const currentPage = Number((await searchParams).page) || 1;
  const { items, meta } = await getVideos(currentPage);

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <VideoItem key={item.id} data={item} />
      ))}
      <VideoPagination
        total={meta.total}
        page={meta.page}
        lastPage={meta.lastPage}
      />
    </div>
  );
}
