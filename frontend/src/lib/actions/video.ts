// src/lib/actions/video.ts
"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Video, VideoPaginationResponse } from "../types";
import { getUser } from "./auth";
import { api } from "./axios";

/**
 * 비디오 등록 함수
 * @param videoId 유튜브 고유 ID
 * @param content 아티클 본문 (마크다운)
 * @param articleTitle AI가 생성한 아티클 제목
 * @param tags AI가 추출한 태그 배열
 */
export async function createVideo(
  videoId: string,
  content: string,
  articleTitle: string,
  topics: string[]
) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  // 1. 기본 검증 (서버 전송 전)
  if (!videoId || videoId.length !== 11) {
    return { error: "유효한 유튜브 비디오 ID를 입력해주세요." };
  }
  if (!articleTitle) {
    return { error: "아티클 제목은 필수입니다." };
  }

  try {
    // 2. 백엔드 API 호출 (업데이트된 DTO 구조에 맞춤)
    await api.post("/videos", {
      videoId,
      content,
      articleTitle,
      topics,
    });

    // 💡 목록 페이지 및 태그 관련 캐시 갱신
    revalidatePath("/");
  } catch (error) {
    if (isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage;

      return {
        error: errorMessage || "비디오 등록에 실패했습니다.",
      };
    }
    return { error: "알 수 없는 오류가 발생했습니다." };
  }

  // 3. 성공 시 리다이렉트 (try-catch 외부에서 실행)
  // content가 없거나 AI 생성을 거치지 않은 경우와 구분하여 이동
  if (content.trim().length === 0) {
    redirect("/submit/success");
  } else {
    redirect("/");
  }
}
export async function getVideos(
  page: number = 1
): Promise<VideoPaginationResponse> {
  try {
    const { data } = await api.get(`/videos?page=${page}`);
    return data;
  } catch (error) {
    console.error("Fetch Videos Error:", error);
    return { items: [], meta: { total: 0, lastPage: 1, page } };
  }
}

export async function getVideoDetail(videoId: string): Promise<Video | null> {
  try {
    const { data } = await api.get(`/videos/${videoId}`);
    return data;
  } catch (error) {
    console.error("Fetch Video Detail Error:", error);
    return null;
  }
}

export async function createComment(videoId: number, content: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  if (!content || content.trim().length === 0) {
    return { error: "댓글 내용을 입력해주세요." };
  }

  try {
    // 백엔드 엔드포인트: POST /comments/:videoId
    await api.post(`/comments/${videoId}`, { content });

    // 💡 댓글 작성 후 해당 영상 상세 페이지의 캐시를 새로고침하여 즉시 반영
    revalidatePath(`/video/${videoId}`);

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage;

      return {
        error: errorMessage || "댓글 등록에 실패했습니다.",
      };
    }

    return { error: "알 수 없는 오류가 발생했습니다." };
  }
}

/**
 * 댓글 삭제 함수 (추가 권장)
 */
export async function deleteComment(commentId: number, videoId: number) {
  try {
    await api.delete(`/comments/${commentId}`);
    revalidatePath(`/video/${videoId}`);
    return { success: true };
  } catch (error) {
    return { error: "댓글 삭제 중 오류가 발생했습니다." };
  }
}
