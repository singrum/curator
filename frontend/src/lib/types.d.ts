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

export interface Video {
  id: number;
  createdAt: string; // 서버에서 올 때 보통 ISOString 날짜 문자열로 옴
  videoId: string; // 유튜브 고유 ID (예: dQw4w9WgXcQ)
  title: string;
  authorName: string;
  content: string | null;
  score: number;

  // 관계형 데이터 (Join 정보)
  submitter: { nickname: string; id: number };
  topics: Topic[];
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
