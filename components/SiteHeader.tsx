'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  Snowflake,
  Menu,
  X,
  Plane,
  Compass,
  Car,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { Language } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

interface SiteHeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  activePage?: 'home' | 'winter' | 'airport' | 'sightseeing';
}

export default function SiteHeader({
  currentLang: propCurrentLang,
  onLanguageChange: propOnLanguageChange,
  activePage = 'home',
}: SiteHeaderProps) {
  const [contextLang, setContextLang] = useLanguage();
  const currentLang = propCurrentLang || contextLang;
  const onLanguageChange = propOnLanguageChange || setContextLang;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const nav = {
    explore: { ja: '探索', zh: '探索行程', fr: 'Explorer', es: 'Explorar', en: 'Explore' }[currentLang],
    booking: { ja: '予約する', zh: '在线预订', fr: 'Réserver', es: 'Reservar', en: 'Start Booking' }[currentLang],
    services: { ja: 'サービス', zh: '服务项目', fr: 'Services', es: 'Servicios', en: 'Services' }[currentLang],
    airport: { ja: '空港送迎', zh: '机场接送', fr: 'Aéroports', es: 'Aeropuertos', en: 'Airport Transfers' }[currentLang],
    sightseeing: { ja: '観光チャーター', zh: '包车游览', fr: 'Excursions', es: 'Excursiones', en: 'Day Charters' }[currentLang],
    ski: { ja: 'スキー送迎', zh: '滑雪专车', fr: 'Ski', es: 'Esquí', en: 'Ski Transfers' }[currentLang],
    blog: { ja: 'ブログ', zh: '专栏指南', fr: 'Blog', es: 'Blog', en: 'Blog' }[currentLang],
    contact: { ja: 'お問い合わせ', zh: '联系我们', fr: 'Contact', es: 'Contacto', en: 'Contact' }[currentLang],
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am inquiring about private chauffeur services in Japan.`
  )}`;

  const navLinks = [
    { href: '/explore', label: nav.explore, page: 'home' as const },
    { href: '/booking', label: nav.booking, page: undefined },
    { href: '/services', label: nav.services, page: undefined },
    { href: '/tours/airport-transfer', label: nav.airport, page: 'airport' as const },
    { href: '/tours/winter', label: nav.ski, page: 'winter' as const, icon: <Snowflake className="w-3.5 h-3.5" /> },
    { href: '/blog', label: nav.blog, page: undefined },
    { href: '/contact', label: nav.contact, page: undefined },
  ];

  return (
    <>
      {/* ── Clean Header (Trip.com & RydAgent style with Dark Mode support) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#080B11]/95 backdrop-blur-md border-b border-[#E5E8ED] dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/explore" className="flex items-center gap-2 shrink-0">
            <div className="relative h-8 w-20 sm:h-9 sm:w-24">
              <Image
                src="/images/brand-sklimo-official-logo-250x250.png"
                alt="SK Limo"
                fill
                className="object-contain dark:brightness-110"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-[#1A1A1A] dark:text-white tracking-tight block leading-tight">
                SK LIMO
              </span>
              <span className="text-[9px] text-[#9CA3AF] block leading-tight">
                Private Chauffeur Japan
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  link.page && activePage === link.page
                    ? 'text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 dark:text-[#3B82F6]'
                    : 'text-[#4B5563] dark:text-slate-300 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-1">
                  {link.icon}
                  <span>{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Right actions: Desktop Theme Moon + Language + Book Now Gold Button + WhatsApp */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Desktop-Only Crescent Moon Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center p-2 rounded-lg border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#0E131F] text-[#4B5563] dark:text-slate-200 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#4B5563]" />
              )}
            </button>

            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* RydAgent Gold Book Now CTA in Header */}
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 py-2 rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Book Now</span>
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 rounded-lg text-[#25D366]"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#4B5563] dark:text-slate-200 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0E131F] flex flex-col shadow-2xl transition-colors">
            {/* Drawer header */}
            <div className="p-4 border-b border-[#E5E8ED] dark:border-slate-800 flex items-center justify-between">
              <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="relative h-7 w-20">
                  <Image src="/images/brand-sklimo-official-logo-250x250.png" alt="SK Limo" fill className="object-contain dark:brightness-110" />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#6B7280] dark:text-slate-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    link.page && activePage === link.page
                      ? 'bg-[#E8F1FF] text-[#0068FF] dark:bg-[#0068FF]/15 dark:text-[#3B82F6]'
                      : 'text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {link.icon || <Compass className="w-4 h-4 text-[#9CA3AF]" />}
                    <span className="font-medium text-sm">{link.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
                </Link>
              ))}

              {/* Mobile Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-[#F5F7FA] dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-100 font-medium text-sm transition-colors cursor-pointer mt-2"
              >
                <span className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#4B5563]" />}
                  <span>{theme === 'dark' ? 'Light Mode (明るい表示)' : 'Dark Mode (ダークモード)'}</span>
                </span>
                <span className="text-xs text-[#9CA3AF] capitalize">{theme}</span>
              </button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl text-sm mt-4 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp 24/7 Concierge</span>
              </a>
            </div>

            {/* Drawer footer */}
            <div className="p-4 border-t border-[#E5E8ED] dark:border-slate-800 text-center text-[10px] text-[#9CA3AF]">
              <span className="block font-medium">MLIT Licensed Green-Plate Operator</span>
              <span>株式会社SKリモ (SK LIMO Co., Ltd.)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
