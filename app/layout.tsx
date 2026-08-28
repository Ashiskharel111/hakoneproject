import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "【公式】株式会社SKリモ | SK Limo Executive Private Charters Japan",
  description: "羽田空港・成田空港・東京都内発 長野エリア（白馬・野沢温泉・志賀高原・妙高）スキー送迎プライベートハイヤー。国土交通省認可 一般乗用旅客自動車運送事業 関自旅第1234号。",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`h-full antialiased ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#0A0D14] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200 font-sans">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

