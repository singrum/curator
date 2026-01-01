// src/lib/auth.ts
import { cookies } from "next/headers";
import { User } from "../types";

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookieString, // 'jwt=...; refresh_token=...' 형태로 전달됨
      },
      cache: "no-store",
    });
    console.log(res);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      console.error("Auth Fail:", res.status, errorBody);
      return null;
    }

    const data = await res.json();
    return data.loggedIn ? data.user : null;
  } catch (error) {
    console.error("getUser Error:", error);
    return null;
  }
}
