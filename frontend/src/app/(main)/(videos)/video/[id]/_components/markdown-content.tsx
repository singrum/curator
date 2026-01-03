// src/components/video/markdown-content.tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <div
      className={cn(
        "prose max-w-none dark:prose-invert text-foreground",

        "prose-ul:list-disc prose-ol:leading-6 prose-ul:leading-6 prose-li:leading-6",
        "[--tw-prose-bullets:var(--foreground)]",
        "[&_ul_ul]:my-0",
        "[&_ol_ol]:my-0",
        "[&_ul_ol]:my-0",
        "[&_ol_ul]:my-0",

        "prose-headings:font-bold prose-headings:tracking-tight"
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
