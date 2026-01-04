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
  videoCount?: number;
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
  articleTitle: string;
  authorName: string;
  authorUrl: string;
  content: string;
  topics: Topic[];
  comments: Comment[];
  commentCount: number;
}

export interface PaginationResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export type TopicPaginationResponse = PaginationResponse<Topic>;
export type VideoPaginationResponse = PaginationResponse<Video>;
