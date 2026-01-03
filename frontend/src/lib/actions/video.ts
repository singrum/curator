// src/lib/actions/video.ts
"use server";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Video, VideoPaginationResponse } from "../types";
import { getUser } from "./auth";
import { api } from "./axios";

export async function createVideo(videoId: string, content: string) {
  const user = await getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  let success = false;

  try {
    await api.post("/videos", { videoId, content });
    success = true;
  } catch (error) {
    // 1. Axios 에러인지 확인 (any 제거)
    if (isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;

      // NestJS의 ValidationPipe 에러(배열)와 일반 에러(문자열) 모두 대응
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage;

      console.error(error.response?.data || error.message);

      return {
        error: errorMessage || "비디오 등록에 실패했습니다.",
      };
    }

    // 2. Axios 에러가 아닌 일반 에러 처리
    console.error("Unknown Error:", error);
    return {
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }

  // 성공 시 리다이렉트 (try-catch 외부에서 실행)
  if (success) {
    if (content.length === 0) {
      redirect("/submit/success");
    } else {
      redirect("/");
    }
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
