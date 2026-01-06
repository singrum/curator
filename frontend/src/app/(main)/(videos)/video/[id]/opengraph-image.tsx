import { getVideoDetail } from "@/lib/actions/video";
import { getVideoById } from "@/lib/youtube";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoDetail(id);

  // 1. 비디오가 없거나 404일 때: public 폴더의 정적 이미지 리다이렉트 또는 직접 그리기
  if (!video) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111",
            color: "white",
            fontSize: 60,
            fontWeight: "bold",
          }}
        >
          {/* 직접 그리거나 혹은 이미지 태그로 public 이미지를 넣을 수 있습니다 */}
          <img src="/app/opengraph-image.png" alt="Not Found" width={300} />
        </div>
      ),
      { ...size }
    );
  }

  const youtubeOEmbed = await getVideoById(video.videoId);
  const thumbnailUrl = youtubeOEmbed?.thumbnail_url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="background"
            width={640}
            style={{ width: "100%" }}
          />
        )}

        {/* 텍스트 컨텐츠 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 70,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {video.articleTitle}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#ddd",
              marginTop: 20,
            }}
          >
            {video.authorName}
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
