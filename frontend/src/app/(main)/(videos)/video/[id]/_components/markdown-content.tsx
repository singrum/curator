// src/components/video/markdown-content.tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import "highlight.js/styles/github-dark.css"; // 하이라이트 스타일
import "katex/dist/katex.min.css";

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <div
      className={cn(
        "prose max-w-none text-foreground dark:prose-invert",

        // "[--tw-prose-pre-bg:var(--secondary)]", // 코드 블록 배경을 secondary 컬러로
        // "[--tw-prose-pre-code:var(--foreground)]", // 코드 내부 텍스트 컬러
        // "prose-pre:rounded-xl prose-pre:border prose-pre:border-border", // 둥근 모서리와 테두리
        "[--tw-prose-bullets:var(--foreground)]",
        // 2. 인라인 코드 스타일 (문장 중간에 있는 `code`)
        "prose-code:before:content-none prose-code:after:content-none", // 따옴표 제거
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium",

        "prose-ul:list-inside",
        "prose-li:my-1 prose-ul:my-1 prose-ol:my-1",
        "prose-p:my-1"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
