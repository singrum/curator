// src/lib/auth.ts
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
