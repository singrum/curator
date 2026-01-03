"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="link" onClick={toggleTheme}>
      {resolvedTheme === "dark" ? "라이트 모드" : "다크 모드"}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
