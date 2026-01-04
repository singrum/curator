import { getVideosByTopic } from "@/lib/actions/video";
import { Metadata } from "next";
import VideoItem from "../../(videos)/_components/video-item";
import { TopicDetailPagination } from "./_components/topic-detail-pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string }>;
}): Promise<Metadata> {
  const { topicId } = await params;

  // fetch post information

  return {
    title: `${decodeURIComponent(topicId)} | 큐레이터`,
    description: "",
  };
}

export default async function TopicDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. 파라미터 추출 (Promise 래핑 대응)
  const topicName = (await params).topicId;
  const currentPage = Number((await searchParams).page) || 1;

  // 2. 서버 액션 호출 (토픽 이름과 페이지 전달)
  const { items, meta } = await getVideosByTopic(topicName, currentPage);
  return (
    <div className="space-y-6">
      {/* 토픽 제목 표시부 (선택 사항) */}
      <div className="pb-4 border-b">
        <h1 className="text-2xl font-bold">{decodeURIComponent(topicName)}</h1>
      </div>

      {/* 비디오 리스트 */}
      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item) => (
            <VideoItem key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground border rounded-lg">
          해당 토픽에 등록된 비디오가 없습니다.
        </div>
      )}

      {/* 페이지네이션 (토픽 이름을 기반으로 이동하도록 설계되어야 함) */}
      {meta.lastPage > 1 && (
        <TopicDetailPagination
          total={meta.total}
          page={meta.page}
          lastPage={meta.lastPage}
        />
      )}
    </div>
  );
}
