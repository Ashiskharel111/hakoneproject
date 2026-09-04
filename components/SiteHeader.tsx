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
    explore: { ja: '探索', zh: '探索', fr: 'Explorer', es: 'Explorar', en: 'Explore' }[currentLang],
    services: { ja: 'サービス', zh: '服务', fr: 'Services', es: 'Servicios', en: 'Services' }[currentLang],
    airports: { ja: '空港送迎', zh: '机场接送', fr: 'Aéroports', es: 'Aeropuertos', en: 'Airports' }[currentLang],
    ski: { ja: 'スキー', zh: '滑雪专车', fr: 'Ski', es: 'Esquí', en: 'Ski' }[currentLang],
    blog: { ja: 'ブログ', zh: '专栏', fr: 'Blog', es: 'Blog', en: 'Blog' }[currentLang],
    contact: { ja: 'お問い合わせ', zh: '联系', fr: 'Contact', es: 'Contacto', en: 'Contact' }[currentLang],
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am inquiring about private chauffeur services in Japan.`
  )}`;

  const ui = {
    bookNow: { ja: '今すぐ予約', zh: '在线预订', fr: 'Réserver', es: 'Reservar', en: 'Book Now' }[currentLang],
    whatsAppConcierge: { ja: 'WhatsApp 24時間コンシェルジュ', zh: 'WhatsApp 24小时专属管家', fr: 'Conciergerie WhatsApp 24/7', es: 'Conserjería WhatsApp 24/7', en: 'WhatsApp 24/7 Concierge' }[currentLang],
    lightMode: { ja: 'ライトモード (明るい表示)', zh: '浅色明亮模式', fr: 'Mode Clair', es: 'Modo Claro', en: 'Light Mode' }[currentLang],
    darkMode: { ja: 'ダークモード (夜間表示)', zh: '深色夜间模式', fr: 'Mode Sombre', es: 'Modo Oscuro', en: 'Dark Mode' }[currentLang],
    mlitLicensed: { ja: '国土交通省許可 緑ナンバー正規運行', zh: '日本国土交通省正规绿牌认证', fr: 'Opérateur Agréé MLIT Plaque Verte', es: 'Operador Oficial Licenciado MLIT', en: 'MLIT Licensed Green-Plate Operator' }[currentLang],
  };

  const navLinks = [
    { href: '/explore', label: nav.explore, page: 'home' as const },
    { href: '/services', label: nav.services, page: undefined },
    { href: '/tours/airport-transfer', label: nav.airports, page: 'airport' as const },
    { href: '/tours/winter', label: nav.ski, page: 'winter' as const, icon: <Snowflake className="w-3.5 h-3.5" /> },
    { href: '/blog', label: nav.blog, page: undefined },
    { href: '/contact', label: nav.contact, page: undefined },
  ];

  return (
    <>
      {/* ── Clean Header (Trip.com & RydAgent style with Dark Mode support) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#080B11]/95 backdrop-blur-md border-b border-[#E5E8ED] dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/explore" className="flex items-center gap-2.5 shrink-0">
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

          {/* Desktop Nav - Clean Single-Line Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`h-9 px-3.5 rounded-xl text-[13px] font-semibold transition-colors flex items-center whitespace-nowrap ${
                  link.page && activePage === link.page
                    ? 'text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 dark:text-[#3B82F6]'
                    : 'text-[#4B5563] dark:text-slate-300 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.icon}
                  <span>{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Right actions: JA View + Desktop Theme Moon + Language + Book Now Gold Button + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Dedicated JA View Button (Yahoo Japan Portal Mode) */}
            <button
              type="button"
              onClick={() => onLanguageChange('ja')}
              className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                currentLang === 'ja'
                  ? 'bg-[#CC0000] text-white border-[#CC0000] shadow-sm shadow-[#CC0000]/20'
                  : 'bg-white dark:bg-[#0E131F] text-[#CC0000] border-[#CC0000]/40 hover:bg-[#CC0000]/10'
              }`}
              title="JA View (Yahoo! JAPAN風 日本語ポータル表示)"
            >
              <span className={`text-[10px] px-1 py-0.2 rounded-xs font-bold ${currentLang === 'ja' ? 'bg-white text-[#CC0000]' : 'bg-[#CC0000] text-white'}`}>
                JA
              </span>
              <span className="hidden sm:inline">VIEW</span>
            </button>

            {/* Desktop-Only Crescent Moon Dark Mode Toggle (h-9) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#0E131F] text-[#4B5563] dark:text-slate-200 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#4B5563]" />
              )}
            </button>

            {/* Language Selector (h-9) */}
            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* RydAgent Gold Book Now CTA (h-9) */}
            <Link
              href="/booking"
              className="hidden sm:inline-flex h-9 items-center justify-center bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
            >
              <span>{ui.bookNow}</span>
            </Link>

            {/* WhatsApp CTA (h-9) */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-9 items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 rounded-xl text-xs font-bold shadow-sm transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile WhatsApp Icon Button (h-9) */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366]"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            {/* Mobile Menu Hamburger (h-9) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#0E131F] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#4B5563] dark:text-slate-200 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0E131F] flex flex-col shadow-2xl transition-transform animate-slide-up">
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

              {/* Mobile JA Portal Mode Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('ja');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-bold transition-colors cursor-pointer mt-3 ${
                  currentLang === 'ja'
                    ? 'bg-[#CC0000] text-white border-[#CC0000]'
                    : 'bg-white dark:bg-[#0E131F] text-[#CC0000] border-[#CC0000]/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${currentLang === 'ja' ? 'bg-white text-[#CC0000]' : 'bg-[#CC0000] text-white'}`}>
                    JA
                  </span>
                  <span>Yahoo! JAPAN風 日本語ポータル表示</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* Mobile Book Now Link */}
              <Link
                href="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center p-3 rounded-xl bg-[#C5A059] text-[#0A0D14] font-extrabold text-sm uppercase tracking-wider shadow-sm mt-2"
              >
                <span>{ui.bookNow}</span>
              </Link>

              {/* Mobile Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-[#F5F7FA] dark:bg-slate-800 text-[#1A1A1A] dark:text-slate-100 font-medium text-sm transition-colors cursor-pointer mt-2"
              >
                <span className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#4B5563]" />}
                  <span>{theme === 'dark' ? ui.lightMode : ui.darkMode}</span>
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
                <span>{ui.whatsAppConcierge}</span>
              </a>
            </div>

            {/* Drawer footer */}
            <div className="p-4 border-t border-[#E5E8ED] dark:border-slate-800 text-center text-[10px] text-[#9CA3AF]">
              <span className="block font-medium">{ui.mlitLicensed}</span>
              <span>株式会社SKリモ (SK LIMO Co., Ltd.)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
