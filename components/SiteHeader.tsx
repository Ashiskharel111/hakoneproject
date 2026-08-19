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
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Language } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

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

  // Lock background page scroll when mobile full-screen menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  const t = {
    grandPackages: {
      ja: 'グランドパッケージ',
      zh: '尊享套餐',
      fr: 'Forfaits',
      es: 'Paquetes',
      en: 'Grand Packages',
    }[currentLang],
    grandPackagesSub: {
      ja: '全サービス・貸切周遊パッケージ',
      zh: '全包专属定制专车服务',
      fr: 'Circuits VIP & Forfaits Sur-Mesure',
      es: 'Paquetes VIP y Tours a Medida',
      en: 'All-Inclusive Tailored Charters',
    }[currentLang],
    airportTransfer: {
      ja: '空港送迎',
      zh: '机场接送',
      fr: 'Transferts Aéroport',
      es: 'Traslados Aeropuerto',
      en: 'Airport Transfers',
    }[currentLang],
    airportSub: {
      ja: '成田・羽田 ⇄ 都内ホテル 完全定額',
      zh: '成田/羽田机场 ⇄ 酒店 一口价专车',
      fr: 'Haneda & Narita ⇄ Hôtels de Tokyo',
      es: 'Haneda y Narita ⇄ Hoteles de Tokio',
      en: 'Narita & Haneda ⇄ Tokyo Hotels',
    }[currentLang],
    sightseeing: {
      ja: '観光ツアー',
      zh: '景点包车',
      fr: 'Excursions',
      es: 'Excursiones',
      en: 'Sightseeing',
    }[currentLang],
    sightseeingSub: {
      ja: '富士山・箱根・鎌倉・日光 貸切周遊',
      zh: '富士山/箱根/镰仓/日光 专属定制游',
      fr: 'Mont Fuji, Hakone, Kamakura & Nikko',
      es: 'Monte Fuji, Hakone, Kamakura y Nikko',
      en: 'Mt. Fuji, Hakone, Kamakura & Nikko',
    }[currentLang],
    winterButton: {
      ja: 'スキー送迎',
      zh: '滑雪接送',
      fr: 'Ski Charters',
      es: 'Transfers Esquí',
      en: 'Winter Ski',
    }[currentLang],
    winterSub: {
      ja: '白馬・野沢温泉・志賀高原 4WD専用車',
      zh: '白马/野泽/志贺高原 4WD豪华包车',
      fr: 'Hakuba, Nozawa & Shiga Kogen 4WD',
      es: 'Hakuba, Nozawa y Shiga Kogen 4WD',
      en: 'Hakuba, Nozawa & Shiga Kogen 4WD',
    }[currentLang],
    fleetLabel: {
      ja: 'アルファード・グランエース・ハイエース',
      zh: '埃尔法・格兰亚・海狮车队',
      fr: 'Flotte Alphard, Granace & HiAce',
      es: 'Flota Alphard, Granace y HiAce',
      en: 'Alphard, Granace & HiAce Fleet',
    }[currentLang],
    fleetSub: {
      ja: '最高峰VIPミニバン・大容量ハイヤー',
      zh: '日本顶级VIP商务座驾与大容量客车',
      fr: 'Véhicules VIP & Grand Confort',
      es: 'Vehículos VIP de Gran Confort',
      en: 'Luxury VIP MPVs & High-Capacity Vans',
    }[currentLang],
    whatsAppLabel: {
      ja: 'WhatsApp 旅程・見積相談 (24時間)',
      zh: 'WhatsApp 即时咨询定制 (24小时)',
      fr: 'WhatsApp Conciergerie (24/7)',
      es: 'WhatsApp Concierge (24/7)',
      en: 'WhatsApp 24/7 Concierge',
    }[currentLang],
    licenseBadge: {
      ja: '国土交通省認可 一般乗用旅客自動車運送事業（緑ナンバー）',
      zh: '日本国土交通省正规绿牌营运资质（安心保障）',
      fr: 'Opérateur Agréé Licence MLIT Plaques Vertes',
      es: 'Operador Oficial Licencia MLIT Placa Verde',
      en: '100% Licensed Commercial Green-Plate Operator',
    }[currentLang],
  };

  const whatsAppGeneralUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am inquiring from your website about private luxury chauffeur charters in Japan.`
  )}`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0D14]/95 backdrop-blur-xl border-b border-white/10 shadow-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Official Brand Logo */}
          <Link href="/tours" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative h-8 w-24 sm:h-10 sm:w-32">
              <Image
                src="/images/brand-sklimo-official-logo-250x250.png"
                alt="SK Limo Official Logo"
                fill
                className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Clean Desktop Navigation Links (xl+) */}
          <nav className="hidden xl:flex items-center gap-6 text-[12px] uppercase tracking-[0.14em] font-medium text-white/80">
            <Link
              href="/tours#packages"
              className="hover:text-[#C5A059] transition-colors duration-200 py-1"
            >
              {t.grandPackages}
            </Link>

            <Link
              href="/tours/airport-transfer"
              className={`hover:text-[#C5A059] transition-colors duration-200 py-1 ${
                activePage === 'airport' ? 'text-[#C5A059] font-bold border-b border-[#C5A059]' : ''
              }`}
            >
              {t.airportTransfer}
            </Link>

            <Link
              href="/destinations"
              className={`hover:text-[#C5A059] transition-colors duration-200 py-1 ${
                activePage === 'sightseeing' ? 'text-[#C5A059] font-bold border-b border-[#C5A059]' : ''
              }`}
            >
              {t.sightseeing}
            </Link>

            {/* Winter Ski Clean Pill Button */}
            <Link
              href="/tours/winter"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                activePage === 'winter'
                  ? 'bg-[#C5A059] text-[#0A0D14] font-bold'
                  : 'bg-[#0E131F] border border-slate-700/80 text-slate-200 hover:border-[#C5A059] hover:text-[#E5C378]'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.winterButton}</span>
            </Link>

            {/* Alphard, Granace & HiAce Fleet */}
            <Link
              href="/tours#fleet"
              className="hover:text-[#C5A059] transition-colors duration-200 py-1 text-slate-400 hover:text-white"
            >
              {t.fleetLabel}
            </Link>
          </nav>

          {/* Medium Screen Nav (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-4 text-[12px] uppercase tracking-wider font-medium text-white/80">
            <Link href="/tours/airport-transfer" className="hover:text-[#C5A059] transition-colors">
              {t.airportTransfer}
            </Link>
            <Link href="/destinations" className="hover:text-[#C5A059] transition-colors">
              {t.sightseeing}
            </Link>
            <Link
              href="/tours/winter"
              className="inline-flex items-center gap-1 bg-[#0E131F] border border-slate-700 text-slate-200 px-2.5 py-1 rounded-full text-[11px] font-medium"
            >
              <Snowflake className="w-3 h-3 text-cyan-400" />
              <span>{t.winterButton}</span>
            </Link>
            <Link href="/tours#fleet" className="hover:text-[#C5A059] transition-colors text-[11px] text-slate-400">
              {t.fleetLabel}
            </Link>
          </nav>

          {/* Action Controls: Language & WhatsApp & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Global Language Selector (Globe + EN without flag) */}
            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* Desktop WhatsApp Action */}
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] uppercase tracking-wider transition-all duration-300 shadow hover:shadow-[#25D366]/20"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-[#0A0D14]" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile WhatsApp Quick Button */}
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] transition-colors"
              aria-label="WhatsApp Concierge"
            >
              <MessageSquare className="w-4 h-4 fill-[#25D366]" />
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#0E131F] border border-slate-800 text-white hover:text-[#C5A059] transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════
          100% FULL-SCREEN MOBILE MENU OVERLAY
          ═══════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-full h-[100dvh] bg-[#06080E] z-[100] lg:hidden flex flex-col justify-between overflow-y-auto animate-fade-in">
          
          {/* Top Bar inside Fullscreen Menu: Logo on left, prominent X on top-right */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#06080E]/95 backdrop-blur-xl z-20">
            <Link
              href="/tours"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="relative h-8 w-24">
                <Image
                  src="/images/brand-sklimo-official-logo-250x250.png"
                  alt="SK Limo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* X Button on Top Right */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-[#0E131F] border border-slate-700/80 text-slate-200 hover:text-white hover:border-[#C5A059] transition-all cursor-pointer shadow-lg"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6 text-[#C5A059]" />
            </button>
          </div>

          {/* Fullscreen Menu Navigation Cards (Language setting excluded as requested) */}
          <div className="p-4 sm:p-6 space-y-3 flex-1">
            
            {/* 1. Airport Transfers */}
            <Link
              href="/tours/airport-transfer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                activePage === 'airport'
                  ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#E5C378]'
                  : 'bg-[#0E131F] border-slate-800/80 text-white hover:border-[#C5A059]/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{t.airportTransfer}</span>
                  <span className="text-[11px] text-slate-400 block">{t.airportSub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C5A059] shrink-0" />
            </Link>

            {/* 2. Sightseeing Tours */}
            <Link
              href="/destinations"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                activePage === 'sightseeing'
                  ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#E5C378]'
                  : 'bg-[#0E131F] border-slate-800/80 text-white hover:border-[#C5A059]/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{t.sightseeing}</span>
                  <span className="text-[11px] text-slate-400 block">{t.sightseeingSub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C5A059] shrink-0" />
            </Link>

            {/* 3. Winter Ski Charters */}
            <Link
              href="/tours/winter"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                activePage === 'winter'
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-lg'
                  : 'bg-[#0E131F] border-cyan-900/50 text-white hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                  <Snowflake className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    {t.winterButton}
                    <span className="bg-cyan-400/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">4WD</span>
                  </span>
                  <span className="text-[11px] text-slate-400 block">{t.winterSub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0" />
            </Link>

            {/* 4. Grand Packages */}
            <Link
              href="/tours#packages"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#0E131F] border border-slate-800/80 text-white hover:border-[#C5A059]/60 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{t.grandPackages}</span>
                  <span className="text-[11px] text-slate-400 block">{t.grandPackagesSub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C5A059] shrink-0" />
            </Link>

            {/* 5. Executive Fleet */}
            <Link
              href="/tours#fleet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#0E131F] border border-slate-800/80 text-white hover:border-[#C5A059]/60 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-slate-800 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{t.fleetLabel}</span>
                  <span className="text-[11px] text-slate-400 block">{t.fleetSub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C5A059] shrink-0" />
            </Link>

            {/* WhatsApp Concierge Action Button */}
            <div className="pt-3">
              <a
                href={whatsAppGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                <span>{t.whatsAppLabel}</span>
              </a>
            </div>

          </div>

          {/* Fullscreen Menu Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-[#0A0D14] space-y-1.5 text-[11px] text-slate-400 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E5C378] font-medium text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.licenseBadge}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              株式会社SKリモ (SK LIMO Co., Ltd.) • 柏レイソル公式スポンサー
            </p>
          </div>

        </div>
      )}
    </>
  );
}
