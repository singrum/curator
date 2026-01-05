// src/lib/auth.ts
"use server";

import { redirect } from "next/dist/client/components/navigation";

import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { User } from "../types";
import { api } from "./axios";

export async function getUser(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/me");

    return data.loggedIn ? data.user : null;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  await api.post(`/auth/logout`);

  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("refresh_token");
  revalidatePath("/");
  redirect("/"); // 로그아웃 후 로그인 페이지로
}

export async function updateNickname(
  nickname: string
): Promise<{ success: boolean; message?: string }> {
  if (!nickname || nickname.trim() === "") {
    return { success: false, message: "닉네임은 비어 있을 수 없습니다." };
  }
  if (nickname.length > 20) {
    return { success: false, message: "닉네임은 20자 이내여야 합니다." };
  }
  try {
    await api.patch(`/auth/nickname`, {
      nickname,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage;

      return {
        success: false,
        message: errorMessage || "닉네임 변경 중 오류가 발생했습니다.",
      };
    }

    // 2. 일반 에러 처리
    return {
      success: false,
      message: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
