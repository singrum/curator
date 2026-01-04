import { getUser } from "@/lib/actions/auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserStoreProvider } from "@/providers/user-store-provider";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Toaster } from "sonner";
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

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${NotoSansKr.className} antialiased`}
    >
      <link rel="icon" href="/icon.svg" sizes="any" />
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserStoreProvider
            user={user}
            key={user === null ? "null" : user.id + "," + user.nickname}
          >
            <Header />
            <main className="p-4 sm:p-6 max-w-3xl w-full">{children}</main>
            <Toaster />
          </UserStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
