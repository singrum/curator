import axios from "axios";
import { cookies } from "next/headers"; // Next.js 서버의 쿠키를 가져오기 위해 필요

export const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    try {
      const cookieStore = await cookies();

      const allCookies = cookieStore.getAll();
      if (allCookies.length > 0) {
        const cookieHeader = allCookies
          .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
          .join("; ");

        config.headers.Cookie = cookieHeader;

        // 💡 디버깅용 로그 (프론트엔드 Vercel 로그에서 확인 가능)
        console.log(
          "[Server-Side Request] Cookie Header attached:",
          cookieHeader
        );
      }
    } catch (error) {
      console.warn("No cookie context found");
    }
  }
  return config;
});
