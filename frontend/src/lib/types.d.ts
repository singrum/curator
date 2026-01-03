export type User = {
  id: number;
  email: string;
  nickname: string;
  avatarUrl: string;
  role: number;
};

export interface YoutubeOEmbed {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  // 필요한 필드만 정의
}

export interface Topic {
  id: number;
  name: string; // 토픽 이름
}
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}
export interface Video {
  id: number;
  createdAt: string;
  videoId: string;
  title: string;
  authorName: string;
  content: string | null;
  score: number;

  submitter: { nickname: string; id: number };
  topics: Topic[];
  comments: Comment[];
  commentCount: number;
}

// 페이지네이션 응답 구조 (findAll API 결과용)
export interface VideoPaginationResponse {
  items: Video[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
