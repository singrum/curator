import { YoutubeOEmbed } from "./types";

export function getVideoId(url: string): string | null {
  // 유튜브 URL 패턴 정규식 (watch, be, embed, shorts 모두 대응)
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);

  // 매칭되는 결과가 있으면 ID(첫 번째 캡처 그룹) 반환, 없으면 null
  return match ? match[1] : null;
}

export async function getVideoById(
  videoId: string
): Promise<YoutubeOEmbed | null> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: YoutubeOEmbed = await response.json();
    console.log(data);
    return data;
  } catch {
    return null;
  }
}

export function IdtoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

