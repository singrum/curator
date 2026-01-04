// src/lib/actions/topic.ts
"use server";

import { TopicPaginationResponse } from "../types";
import { api } from "./axios";

export async function getTopics(
  page: number = 1
): Promise<TopicPaginationResponse> {
  try {
    const { data } = await api.get(`/topics?page=${page}`);
    return data;
  } catch {
    return { items: [], meta: { total: 0, lastPage: 1, page } };
  }
}
