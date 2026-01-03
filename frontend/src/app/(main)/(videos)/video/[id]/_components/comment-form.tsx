"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions/video";
import { useState } from "react";

export default function CommentForm({ id }: { id: number }) {
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false); // 로딩 상태 관리

  const handleSubmit = async () => {
    if (!value.trim()) return;

    setIsPending(true); // 로딩 시작
    try {
      const result = await createComment(id, value);

      if (result?.error) {
        alert(result.error);
      } else {
        setValue(""); // 성공 시 입력창 초기화
      }
    } finally {
      setIsPending(false); // 로딩 종료
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <Textarea
        id="comment"
        placeholder="댓글을 입력해 주세요."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending} // 로딩 중 입력 방지
        className="resize-none"
        maxLength={500}
      />
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isPending || !value.trim()} // 로딩 중이거나 내용이 없으면 버튼 비활성화
        >
          댓글 작성
        </Button>
      </div>
    </div>
  );
}
