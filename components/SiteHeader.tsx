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
  activeService?: 'airport' | 'sightseeing' | 'ski';
  onSelectService?: (service: 'airport' | 'sightseeing' | 'ski') => void;
}

export default function SiteHeader({
  currentLang: propCurrentLang,
  onLanguageChange: propOnLanguageChange,
  activeService = 'airport',
  onSelectService,
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
    airport: { ja: '空港送迎', zh: '机场接送', fr: 'Aéroports', es: 'Aeropuertos', en: 'Airport Transfers' }[currentLang],
    sightseeing: { ja: '観光チャーター', zh: '观光包车', fr: 'Excursions', es: 'Tours', en: 'Sightseeing' }[currentLang],
    ski: { ja: 'スキー送迎', zh: '滑雪专车', fr: 'Ski VIP', es: 'Esquí VIP', en: 'Ski Transfers' }[currentLang],
  };

  const whatsAppUrl = `https://wa.me/818038582729?text=${encodeURIComponent(
    `Hello SK Limo! I am inquiring about booking a private chauffeur in Japan.`
  )}`;

  const ui = {
    bookNow: { ja: '今すぐ予約', zh: '在线预订', fr: 'Réserver', es: 'Reservar', en: 'Book Now' }[currentLang],
    liveDesk: { ja: '予約デスク 稼働中', zh: '在线预订实时受理', fr: 'Réservation Ouverte', es: 'Reservas Activas', en: 'Live Booking Desk' }[currentLang],
    whatsAppConcierge: { ja: 'WhatsApp 24時間コンシェルジュ', zh: 'WhatsApp 24小时专属管家', fr: 'Conciergerie WhatsApp 24/7', es: 'Conserjería WhatsApp 24/7', en: 'WhatsApp 24/7 Concierge' }[currentLang],
    lightMode: { ja: 'ライトモード', zh: '浅色模式', fr: 'Mode Clair', es: 'Modo Claro', en: 'Light Mode' }[currentLang],
    darkMode: { ja: 'ダークモード', zh: '深色模式', fr: 'Mode Sombre', es: 'Modo Oscuro', en: 'Dark Mode' }[currentLang],
    mlitLicensed: { ja: '国土交通省許可 緑ナンバー正規運行', zh: '日本国土交通省正规绿牌认证', fr: 'Opérateur Agréé MLIT Plaque Verte', es: 'Operador Oficial Licenciado MLIT', en: 'MLIT Licensed Green-Plate Operator' }[currentLang],
  };

  const handleServiceClick = (service: 'airport' | 'sightseeing' | 'ski') => {
    if (onSelectService) {
      onSelectService(service);
    }
    const el = document.getElementById('booking-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── Modern Booking Portal Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#080B11]/95 backdrop-blur-md border-b border-[#E5E8ED] dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" title="booking.sk.limo">
            <div className="relative h-8 w-20 sm:h-9 sm:w-24">
              <Image
                src="/images/brand-sklimo-official-logo-250x250.png"
                alt="SK Limo"
                fill
                className="object-contain dark:brightness-110"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-extrabold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
                  SK LIMO
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-[#C5A059]/15 text-[#8C6D3F] dark:text-[#E5C378] border border-[#C5A059]/30">
                  BOOKING
                </span>
              </div>
              <span className="text-[9px] text-[#9CA3AF] block leading-tight">
                booking.sk.limo
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Active Service Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5F7FA] dark:bg-slate-900/80 p-1 rounded-2xl border border-[#E5E8ED] dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleServiceClick('airport')}
              className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeService === 'airport'
                  ? 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{nav.airport}</span>
            </button>

            <button
              type="button"
              onClick={() => handleServiceClick('sightseeing')}
              className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeService === 'sightseeing'
                  ? 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{nav.sightseeing}</span>
            </button>

            <button
              type="button"
              onClick={() => handleServiceClick('ski')}
              className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeService === 'ski'
                  ? 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{nav.ski}</span>
            </button>
          </nav>

          {/* Right actions: Theme + Language + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

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
            <a
              href="#booking-engine"
              className="hidden sm:inline-flex h-9 items-center justify-center bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <span>{ui.bookNow}</span>
            </a>

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
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
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
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                type="button"
                onClick={() => handleServiceClick('airport')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                  activeService === 'airport'
                    ? 'bg-[#0F172A] text-[#C5A059] font-bold shadow-sm'
                    : 'text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.airport}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => handleServiceClick('sightseeing')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                  activeService === 'sightseeing'
                    ? 'bg-[#0F172A] text-[#C5A059] font-bold shadow-sm'
                    : 'text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.sightseeing}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => handleServiceClick('ski')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                  activeService === 'ski'
                    ? 'bg-[#0F172A] text-[#C5A059] font-bold shadow-sm'
                    : 'text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Snowflake className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.ski}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

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
