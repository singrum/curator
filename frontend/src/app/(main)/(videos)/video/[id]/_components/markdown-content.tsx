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
  const processedContent = children.replace(
    /(\*\*)([^*]*[\(\)][^*]*)(\*\*)(?!\s|$)/g,
    (match, p1, p2, p3) => {
      // p1: **, p2: 볼드 내부 텍스트, p3: **
      // 내부 텍스트(p2)에 괄호가 있고, 뒤에 공백이 없는 경우에만 공백 추가
      return `${p1}${p2}${p3} `;
    }
  );
  return (
    <div
      className={cn(
        "prose max-w-none text-foreground dark:prose-invert prose-sm sm:prose-base",

        "prose-ul:list-disc",
        "[&_ul_ul]:list-[circle]",
        "[&_ul_ul_ul]:list-[square]",

        "[--tw-prose-bullets:var(--foreground)]",
        "prose-h1:text-base prose-h2:text-base prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium",
        "prose-a:text-link prose-a:underline prose-a:font-medium prose-a:underline-offset-4",
        "prose-li:my-1 prose-ul:my-1 prose-ol:my-1",
        "prose-p:my-1"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
