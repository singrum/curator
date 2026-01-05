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
      const cookieString = cookieStore.toString();

      if (cookieString) {
        config.headers.Cookie = cookieString;
      }
    } catch (error) {
      console.warn("No cookie context found");
    }
  }
  return config;
});
