"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { updateNickname } from "@/lib/actions/auth";
import { useUserStore } from "@/providers/user-store-provider";
import React, { useState } from "react";
import { toast } from "sonner";

export default function NicknameForm() {
  const user = useUserStore((e) => e.user);
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = React.useState(user!.nickname);

  const handleSave = async () => {
    if (!nickname || nickname === user?.nickname) return;

    setIsLoading(true);
    const result = await updateNickname(nickname.trim());

    if (result.success) {
      toast.success("닉네임이 변경됨.");
    } else {
      toast.error(result.message || "변경 실패함.");
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="space-y-1 flex-col items-start">
          <div>닉네임</div>
        </Label>
        <div className="flex gap-2">
          <Input
            className="max-w-md w-full flex-1"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="새 닉네임을 입력하세요"
            disabled={isLoading}
            maxLength={20}
          />
          <Button
            variant="secondary"
            className="h-9"
            onClick={handleSave}
            disabled={
              isLoading || nickname === user?.nickname || nickname.length === 0
            }
          >
            {isLoading ? (
              <>
                <Spinner />
                저장 중
              </>
            ) : (
              "닉네임 저장"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
