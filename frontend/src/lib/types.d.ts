export type User = {
  id: number;
  email: string;
  nickname: string;
  avatarUrl: string;
};

export interface YoutubeOEmbed {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  // 필요한 필드만 정의
}
