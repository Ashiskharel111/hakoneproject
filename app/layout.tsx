import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SK Limo Booking | Luxury Chauffeur & Private Transfers Japan (Official)",
  description: "Official booking portal for SK Limo Japan (booking.sk.limo). Haneda & Narita Airport transfers, Tokyo sightseeing private charters, and Hakuba/Nagano 4WD ski transfers. MLIT Licensed Green-Plate Operator.",
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

