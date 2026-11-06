import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "SK Limo Japan | Luxury Private Chauffeur & Limousine Service (sk.limo)",
  description: "Official preview website for SK Limo Japan (sk.limo). MLIT-licensed Green-Plate luxury chauffeur service in Tokyo, Haneda & Narita airports, Mt. Fuji, Hakone, and Hakuba ski resorts.",
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
    <html lang="en" className="h-full antialiased">
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

