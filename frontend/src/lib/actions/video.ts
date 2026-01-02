"use server";

import { redirect } from "next/navigation";
import { getUser } from "./auth";
import { api } from "./axios";

export async function createVideo(videoId: string) {
  const user = await getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  let success = false; // 성공 여부 플래그

  try {
    await api.post("/videos", { videoId });
    success = true; // 통신이 성공했을 때만 true
  } catch (error: any) {
    console.error("Video Create Error:", error.response?.data || error.message);
    return {
      error: error.response?.data?.message || "비디오 등록에 실패했습니다.",
    };
  }

  // 핵심: try-catch가 완전히 종료된 후 redirect를 호출합니다.
  if (success) {
    redirect("/submit/success");
  }
}
