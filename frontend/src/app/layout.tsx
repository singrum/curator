import { getUser } from "@/lib/api/auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserStoreProvider } from "@/providers/user-store-provider";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "./_component/header";
import "./globals.css";

const NotoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "큐레이터",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  console.log(user);
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${NotoSansKr.className} antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserStoreProvider user={user} key={user === null ? "null" : user.id}>
            <Header />
            {children}
          </UserStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
