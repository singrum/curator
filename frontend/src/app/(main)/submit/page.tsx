"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YoutubeOEmbed } from "@/lib/types";
import { getVideoById, getVideoId } from "@/lib/youtube";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<YoutubeOEmbed | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [currLoadingId, setCurrLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const id = getVideoId(url);
    if (id) {
      (async () => {
        setStatus(1);
        setCurrLoadingId(id);
        const videoData = await getVideoById(id);
        if (videoData && currLoadingId === id) {
          setVideo(videoData);
          setStatus(2);
        } else {
          setVideo(null);
          setStatus(0);
        }
      })();
    }
  }, [url, currLoadingId]);
  return (
    <div className="space-y-6">
      <Label className="flex flex-col items-start">
        유튜브 영상 URL
        <Input
          placeholder="https://www.youtube.com/watch?v=-xxxxxxxxxxx"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setStatus(0);
          }}
        />
      </Label>
      <div>
        {status === 0 && url.length > 0 && (
          <p className="text-destructive text-sm font-semibold">
            유효하지 않은 URL입니다.
          </p>
        )}
        {status === 1 && <p>로딩중...</p>}
        {status === 2 && video && currLoadingId === getVideoId(url) && (
          <div>
            <p>제목: {video.title}</p>
            <p>채널: {video.author_name}</p>
            <Image
              src={video.thumbnail_url}
              alt="thumbnail"
              width={480}
              height={360}
              unoptimized
            />
          </div>
        )}
      </div>
      <Button>제출</Button>
    </div>
  );
}
