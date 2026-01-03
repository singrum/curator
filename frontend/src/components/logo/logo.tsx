import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});

export default function Logo() {
  return <div className={`text-2xl ${jetbrainsMono.className}`}>curator</div>;
}
