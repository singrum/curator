"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  CopyCheck,
  ExternalLink,
  LucideIcon,
  MousePointer2,
  Pen,
} from "lucide-react";
import { ReactNode } from "react";

interface GuideItemProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  children?: ReactNode;
}

function GuideItem({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-zinc-100 dark:bg-zinc-800",
  iconTextColor = "text-zinc-700 dark:text-zinc-400",
  children,
}: GuideItemProps) {
  return (
    <li className="flex gap-3">
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          iconBgColor,
          iconTextColor
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-medium">{title}</p>
        <div className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
          {description}
        </div>
        {children}
      </div>
    </li>
  );
}

export default function GuideDialog() {
  const PROMPT_URL =
    "https://aistudio.google.com/prompts/1GvYw4oDISLv-Tyg0g06PVJHdoonv1GrT";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 ">
          <span className="text-sm ">AI 자동 작성 가이드</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-[95vw] sm:w-full overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            AI 자동 작성 가이드
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>
              AI Studio를 활용하여 영상 내용을 생성하는 절차이다.
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <div className="relative mt-2 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pb-2">
          <ul className="space-y-6 text-sm">
            <GuideItem
              icon={ExternalLink}
              title="AI Studio 접속"
              description="아래 버튼을 눌러 프롬프트 페이지로 이동한다."
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconTextColor="text-blue-700 dark:text-blue-400"
            >
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-full justify-between overflow-hidden px-2"
                onClick={() => window.open(PROMPT_URL, "_blank")}
              >
                <span className="truncate text-[10px] sm:text-[11px] opacity-70 flex-1 text-left font-mono">
                  {PROMPT_URL}
                </span>
                <ExternalLink className="ml-2 h-3 w-3 shrink-0" />
              </Button>
            </GuideItem>

            <GuideItem
              icon={Pen}
              title="유튜브 링크 추가"
              description="입력창 최하단에 영상의 링크를 입력한다."
            />

            <GuideItem
              icon={MousePointer2}
              title="Run 실행 및 복사"
              description={
                <div>
                  Run 실행 후 반드시{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Copy as markdown
                  </span>
                  을 선택하여 복사한다.
                  <div className="font-medium">
                    (직접 복사나 Copy as text 선택 시 서식이 깨질 수 있음)
                  </div>
                </div>
              }
            />

            <GuideItem
              icon={CopyCheck}
              title="본문 붙여넣기"
              description="복사된 내용을 서비스의 '설명'란에 붙여넣는다."
              iconBgColor="bg-green-100 dark:bg-green-900/30"
              iconTextColor="text-green-700 dark:text-green-400"
            />
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
