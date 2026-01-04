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
        "prose max-w-none text-foreground dark:prose-invert prose-sm sm:prose-base",

        "prose-ul:list-disc",
        "[&_ul_ul]:list-[circle]",
        "[&_ul_ul_ul]:list-[square]",

        "[--tw-prose-bullets:var(--foreground)]",

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
        {children}
      </ReactMarkdown>
    </div>
  );
}
