'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  Menu,
  X,
  Plane,
  Compass,
  ChevronRight,
  Moon,
  Sun,
  Car,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Language } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

type SectionId = 'services' | 'fleet' | 'destinations' | 'compliance' | 'faq' | 'inquire';

interface SiteHeaderProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  activeService?: 'airport' | 'sightseeing' | 'ski';
  onSelectService?: (service: 'airport' | 'sightseeing' | 'ski') => void;
}

export default function SiteHeader({
  currentLang: propCurrentLang,
  onLanguageChange: propOnLanguageChange,
  onSelectService,
}: SiteHeaderProps) {
  const [contextLang, setContextLang] = useLanguage();
  const currentLang = propCurrentLang || contextLang;
  const onLanguageChange = propOnLanguageChange || setContextLang;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('services');
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

  // Interactive scroll-spy to highlight the active horizontal button
  useEffect(() => {
    const sectionIds: SectionId[] = ['services', 'fleet', 'destinations', 'compliance', 'inquire', 'faq'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nav = {
    services: { ja: 'サービス', zh: '核心服务', fr: 'Services', es: 'Servicios', en: 'Services' }[currentLang],
    fleet: { ja: '車両一覧', zh: '豪华车队', fr: 'La Flotte', es: 'Flota VIP', en: 'Luxury Fleet' }[currentLang],
    destinations: { ja: '料金・ルート', zh: '热门路线与参考价', fr: 'Destinations & Tarifs', es: 'Rutas y Tarifas', en: 'Routes & Rates' }[currentLang],
    compliance: { ja: '緑ナンバー安全基準', zh: '绿牌合规保障', fr: 'Licence MLIT', es: 'Licencia MLIT', en: 'Why SK Limo' }[currentLang],
    faq: { ja: 'よくある質問', zh: '常见问题', fr: 'FAQ', es: 'Preguntas', en: 'FAQ' }[currentLang],
  };

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'services', label: nav.services },
    { id: 'fleet', label: nav.fleet },
    { id: 'destinations', label: nav.destinations },
    { id: 'compliance', label: nav.compliance },
    { id: 'faq', label: nav.faq },
  ];

  const whatsAppUrl = `https://wa.me/818038582729?text=${encodeURIComponent(
    `Hello SK Limo (sk.limo)! I would like to inquire about booking a private chauffeur in Japan.`
  )}`;

  const ui = {
    inquireNow: { ja: 'お問い合わせ・見積', zh: '立即咨询 / 预约', fr: 'Demander un Devis', es: 'Solicitar Reserva', en: 'Inquire / Book' }[currentLang],
    whatsAppConcierge: { ja: 'WhatsApp 24時間コンシェルジュ', zh: 'WhatsApp 24小时专属管家', fr: 'Conciergerie WhatsApp 24/7', es: 'Conserjería WhatsApp 24/7', en: 'WhatsApp 24/7 Concierge' }[currentLang],
    lightMode: { ja: 'ライトモード', zh: '浅色模式', fr: 'Mode Clair', es: 'Modo Claro', en: 'Light Mode' }[currentLang],
    darkMode: { ja: 'ダークモード', zh: '深色模式', fr: 'Mode Sombre', es: 'Modo Oscuro', en: 'Dark Mode' }[currentLang],
    mlitLicensed: { ja: '国土交通省許可 緑ナンバー正規運行', zh: '日本国土交通省正规绿牌认证', fr: 'Opérateur Agréé MLIT Plaque Verte', es: 'Operador Oficial Licenciado MLIT', en: 'MLIT Licensed Green-Plate Operator' }[currentLang],
  };

  const scrollToSection = (sectionId: SectionId, service?: 'airport' | 'sightseeing' | 'ski') => {
    setActiveSection(sectionId);
    if (service && onSelectService) {
      onSelectService(service);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── Official sk.limo Executive Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#080B11]/95 backdrop-blur-md border-b border-[#E5E8ED] dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Left Side: Brand (Logo + SK Limo) + Horizontal Interactive Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              title="SK Limo — Official Website"
            >
              <div className="relative h-8 w-20 sm:h-9 sm:w-24">
                <Image
                  src="/images/brand-sklimo-official-logo-250x250.png"
                  alt="SK Limo Japan"
                  fill
                  className="object-contain dark:brightness-110"
                  preload
                />
              </div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#111827] dark:text-white whitespace-nowrap group-hover:text-[#C5A059] transition-colors">
                SK Limo
              </span>
            </Link>

            {/* Horizontal Interactive Navigation Buttons on the Left */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center flex-nowrap gap-1 bg-[#F5F7FA] dark:bg-slate-900/90 p-1 rounded-xl border border-[#E5E8ED] dark:border-slate-800 overflow-x-auto no-scrollbar"
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-[#111827] text-white dark:bg-[#C5A059] dark:text-[#0A0D14] shadow-xs'
                        : 'text-[#475569] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right actions: Theme + Language + Inquire + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#0E131F] text-[#4B5563] dark:text-slate-200 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#4B5563]" />
              )}
            </button>

            {/* Language Selector */}
            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* Gold Inquire / Book CTA */}
            <button
              type="button"
              onClick={() => scrollToSection('inquire')}
              className="hidden sm:inline-flex h-9 items-center justify-center bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <span>{ui.inquireNow}</span>
            </button>

            {/* WhatsApp CTA */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-9 items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 rounded-xl text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile WhatsApp Icon Button */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366]"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#0E131F] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#4B5563] dark:text-slate-200 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0E131F] flex flex-col shadow-2xl transition-transform animate-slide-up">
            <div className="p-4 border-b border-[#E5E8ED] dark:border-slate-800 flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="relative h-7 w-20">
                  <Image src="/images/brand-sklimo-official-logo-250x250.png" alt="SK Limo" fill className="object-contain dark:brightness-110" />
                </div>
                <span className="text-sm font-extrabold text-[#111827] dark:text-white">SK Limo</span>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.services}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('fleet')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.fleet}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('destinations')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.destinations}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('compliance')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#00B37E]" />
                  <span className="font-semibold text-sm">{nav.compliance}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('faq')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-[#1A1A1A] dark:text-slate-100 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-sm">{nav.faq}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>

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

              <button
                type="button"
                onClick={() => scrollToSection('inquire')}
                className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-[#0A0D14] font-extrabold py-3 rounded-xl text-sm mt-3 shadow-xs cursor-pointer"
              >
                <span>{ui.inquireNow}</span>
              </button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl text-sm mt-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{ui.whatsAppConcierge}</span>
              </a>
            </div>

            <div className="p-4 border-t border-[#E5E8ED] dark:border-slate-800 text-center text-[10px] text-[#9CA3AF]">
              <span className="block font-medium">{ui.mlitLicensed}</span>
              <span>SK LIMO Co., Ltd. (sk.limo)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
