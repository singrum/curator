import { cookies } from "next/headers";

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}
