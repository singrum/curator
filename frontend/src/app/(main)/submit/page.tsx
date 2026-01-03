"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createVideo } from "@/lib/actions/video";
import { YoutubeOEmbed } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getVideoById, getVideoId } from "@/lib/youtube";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyVideo } from "./_components/empty-video";
import GuideDialog from "./_components/guide-dialog";
export default function Page() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<YoutubeOEmbed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"auto" | "manual">("auto");
  const handleSubmit = async () => {
    if (!videoId) return;

    setIsSubmitting(true);

    const result = await createVideo(
      videoId,
      contentType === "auto" ? "" : content
    );

    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    setUrl("");
    setVideo(null);
    setIsSubmitting(false);
  };
  // 1. 파생 상태: 렌더링 도중 계산 (setState 필요 없음)
  const videoId = getVideoId(url);
  const isInvalidUrl = url.length > 0 && !videoId;

  // 2. 입력값이 바뀔 때 비디오 정보 즉시 초기화 (Effect 밖에서 처리)
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // 새 URL이 유효하지 않거나 비어있으면 즉시 비디오 상태 초기화
    if (!getVideoId(newUrl)) {
      setVideo(null);
    }
  };

  useEffect(() => {
    // ID가 없으면 아무것도 하지 않음 (이미 위에서 초기화됨)
    if (!videoId) return;

    let isIgnore = false;

    async function fetchVideo() {
      // 3. 비동기 작업 시작 직전에만 로딩 상태 설정
      setIsLoading(true);
      try {
        const data = await getVideoById(videoId!);
        if (!isIgnore) {
          setVideo(data);
        }
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
  }, [videoId]); // videoId가 변할 때만 API 호출

  return (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <Label htmlFor="youtube-url">유튜브 영상 URL</Label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={handleUrlChange}
          className={cn("max-w-md ", {
            "border-destructive focus-visible:ring-destructive": isInvalidUrl,
          })}
        />
        {isInvalidUrl && (
          <p className="text-destructive text-sm font-medium">
            유효한 유튜브 영상 주소를 입력해주세요.
          </p>
        )}
      </div>
      {video ? (
        <div
          className={cn(
            "max-w-md w-full rounded-lg bg-muted p-4 flex flex-col items-center justify-center"
          )}
        >
          <div className="w-full space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md shadow-sm">
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold leading-tight">{video.title}</h3>
              <p className="text-sm text-muted-foreground">
                {video.author_name}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyVideo />
      )}
      <div className="space-y-2">
        <div className="text-sm font-medium">설명</div>
        <Tabs
          defaultValue={contentType}
          onValueChange={(value) => setContentType(value as "auto" | "manual")}
        >
          <TabsList className="max-w-md w-full">
            <TabsTrigger value="auto">자동 생성</TabsTrigger>
            <TabsTrigger value="manual">직접 입력</TabsTrigger>
          </TabsList>
          <TabsContent value="auto">
            <Card className="max-w-md w-full">
              <CardContent className="grid gap-6">
                <p className="text-sm font-medium text-center">
                  업로드 후 AI가 설명을 작성합니다
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  영상의 핵심 내용을 분석하여
                  <br />
                  가장 적절한 소개글을 자동으로 생성할게요.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manual">
            <Textarea
              maxLength={10000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="max-w-md w-full h-50"
              placeholder="영상에 대한 설명을 입력하세요."
            />
            <GuideDialog />
          </TabsContent>
        </Tabs>
      </div>

      <Button
        disabled={!video || isLoading || isSubmitting} // 제출 중에도 버튼 비활성화
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Spinner />
            {"제출 중"}
          </>
        ) : (
          "제출"
        )}
      </Button>
    </div>
  );
}
