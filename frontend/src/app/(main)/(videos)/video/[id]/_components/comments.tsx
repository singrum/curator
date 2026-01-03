"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteComment } from "@/lib/actions/video";
import { Comment } from "@/lib/types";
import { useUserStore } from "@/providers/user-store-provider";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

export default function Comments({
  comments,
  videoId,
  commentsCount,
}: {
  comments: Comment[];
  videoId: number;
  commentsCount: number;
}) {
  // 💡 단일 ID 대신 Set을 사용하여 여러 ID를 저장
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const user = useUserStore((e) => e.user);

  const handleDelete = async (commentId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    // 💡 삭제 시작: 기존 Set에 새로운 ID 추가
    setDeletingIds((prev) => new Set(prev).add(commentId));

    try {
      const result = await deleteComment(commentId, videoId);
      if (result?.error) {
        alert(result.error);
        // 에러 발생 시 로딩 상태 해제 (성공 시에는 revalidatePath로 인해 컴포넌트가 갱신되므로 자동 해결되거나 finally에서 처리)
      }
    } finally {
      // 💡 삭제 종료: Set에서 해당 ID 제거
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-4 mt-16">
      <h3 className="text-lg font-semibold tracking-tight">
        댓글 {commentsCount}개
      </h3>

      <div className="space-y-4">
        {comments.map((comment: Comment, index: number) => {
          const isMine = user && user.id === comment.author.id;
          // 💡 현재 ID가 삭제 중인 목록에 포함되어 있는지 확인
          const isDeleting = deletingIds.has(comment.id);

          return (
            <div key={comment.id} className="group">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author.nickname}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>

                    {isMine && (
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting} // 💡 해당 댓글만 비활성화
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap pr-10">
                    {comment.content}
                  </div>
                </div>
              </div>

              {index !== comments.length - 1 && (
                <Separator className="mt-4 opacity-50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
