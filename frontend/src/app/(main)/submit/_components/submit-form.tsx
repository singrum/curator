"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVideo } from "@/lib/actions/video";
import { prompts } from "@/lib/prompts";
import { YoutubeOEmbed } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getVideoById, getVideoId } from "@/lib/youtube";
import { ExternalLink } from "lucide-react"; // 아이콘 추가
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SubmitForm() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<YoutubeOEmbed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [articleTitle, setArticleTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const videoId = getVideoId(url);
  const isInvalidUrl = url.length > 0 && !videoId;

  // 프롬프트 생성 로직

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("프롬프트가 복사되었습니다.");
  };

  const handleSubmit = async () => {
    if (!videoId) return;
    if (!articleTitle.trim()) {
      toast.error("아티클 제목을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    const topicsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    const result = await createVideo(
      videoId,
      content,
      articleTitle,
      topicsArray
    );

    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    setUrl("");
    setVideo(null);
    setArticleTitle("");
    setContent("");
    setTagsInput("");
    setIsSubmitting(false);
    toast.success("비디오가 성공적으로 등록되었습니다.");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (!getVideoId(newUrl)) setVideo(null);
  };

  useEffect(() => {
    if (!videoId) return;
    let isIgnore = false;
    async function fetchVideo() {
      setIsLoading(true);
      try {
        const data = await getVideoById(videoId!);
        if (!isIgnore) setVideo(data);
      } catch {
        if (!isIgnore) setVideo(null);
      } finally {
        if (!isIgnore) setIsLoading(false);
      }
    }
    fetchVideo();
    return () => {
      isIgnore = true;
    };
  }, [videoId]);

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <Label htmlFor="youtube-url">유튜브 영상 URL</Label>
        <div className="flex gap-2">
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={handleUrlChange}
            className={cn({ "border-destructive": isInvalidUrl })}
          />
        </div>
        {isInvalidUrl && (
          <p className="text-destructive text-sm font-medium">
            유효한 주소를 입력해주세요.
          </p>
        )}
      </div>

      {video && (
        <div className="w-full rounded-xs border bg-muted/50 p-4 flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-black">
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
            <p className="text-xs text-muted-foreground">{video.author_name}</p>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open("https://gemini.google.com/app?hl=ko", "_blank")
          }
        >
          Gemini 열기 <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open(
              "https://aistudio.google.com/prompts/new_chat",
              "_blank"
            )
          }
        >
          AI Studio 열기 <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-8 w-full">
        {/* 본문 입력 + 프롬프트 복사 */}
        <div className="space-y-2">
          <Label htmlFor="content">본문</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-60 resize-none font-mono text-sm"
            placeholder="AI Studio에서 복사한 마크다운 내용을 붙여넣으세요."
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!videoId}
            onClick={() => videoId && handleCopy(prompts.article(videoId))}
            className="font-normal"
          >
            프롬프트 복사
          </Button>
        </div>

        {/* 제목 입력 + 프롬프트 복사 */}
        <div className="space-y-2">
          <Label htmlFor="article-title">제목</Label>
          <Input
            id="article-title"
            placeholder="AI가 생성한 제목을 입력하세요."
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!video}
            onClick={() => video && handleCopy(prompts.title(video.title))}
            className="font-normal"
          >
            프롬프트 복사
          </Button>
        </div>

        {/* 태그 입력 + 프롬프트 복사 */}
        <div className="space-y-2">
          <Label htmlFor="topics">토픽 (쉼표로 구분)</Label>
          <Input
            id="topics"
            placeholder="심리학,뇌과학,자기계발"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!videoId}
            onClick={() => handleCopy(prompts.tag)}
            className="font-normal"
          >
            프롬프트 복사
          </Button>
        </div>
      </div>

      <Button
        className="w-full"
        variant="secondary"
        disabled={!video || isLoading || isSubmitting || !articleTitle}
        onClick={handleSubmit}
      >
        {isSubmitting ? "등록 중..." : "제출하기"}
      </Button>
    </div>
  );
}
