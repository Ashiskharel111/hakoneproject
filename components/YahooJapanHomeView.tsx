'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Plane,
  Compass,
  Snowflake,
  Car,
  Clock,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  CloudSun,
  Radio,
  FileText,
  HelpCircle,
  Award,
  Flame,
  Tag,
  Eye,
  Zap,
} from 'lucide-react';

interface YahooJapanHomeViewProps {
  onSwitchToModernView?: () => void;
}

export default function YahooJapanHomeView({ onSwitchToModernView }: YahooJapanHomeViewProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'airport' | 'sightseeing' | 'ski' | 'status'>('main');
  const [searchQuery, setSearchQuery] = useState('');

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `SK LIMO 日本語配車センターにお問い合わせいたします。`
  )}`;

  const quickKeywords = [
    { label: '羽田空港定額', href: '/tours/airport-transfer' },
    { label: '成田空港送迎', href: '/tours/airport-transfer' },
    { label: '箱根温泉チャーター', href: '/destinations/hakone-lake-ashi' },
    { label: '富士山・河口湖', href: '/destinations/fuji-kawaguchiko' },
    { label: '白馬スキー送迎', href: '/tours/winter' },
    { label: 'ニセコ貸切ハイヤー', href: '/tours/winter' },
    { label: 'アルファード指定', href: '/services' },
    { label: 'ハイヤー見積もり.com', href: 'http://hiremitsumori.com' },
  ];

  const newsData = {
    main: [
      {
        id: 1,
        title: '【公式】2024-2025年 羽田・成田空港〜都内ホテル直行定額ハイヤー予約受付開始',
        tag: '重要',
        date: '9/7(月) 14:30',
        href: '/tours',
        isHot: true,
      },
      {
        id: 2,
        title: '【新登場】ハイヤー見積もり.com（http://hiremitsumori.com）自動料金シミュレーター公開',
        tag: '新機能',
        date: '9/7(月) 14:00',
        href: 'http://hiremitsumori.com',
        isHot: true,
        isExternal: true,
      },
      {
        id: 3,
        title: '秋の箱根・芦ノ湖・大涌谷 1日満喫プライベートチャーター特集（アルファード確約）',
        tag: '特集',
        date: '9/7(月) 12:15',
        href: '/tours',
        isHot: true,
      },
      {
        id: 4,
        title: '冬季スキートランスファー（白馬・志賀高原・野沢温泉）グランエース4WD雪道装備完了',
        tag: '速報',
        date: '9/6(日) 18:00',
        href: '/tours/winter',
      },
      {
        id: 5,
        title: '国土交通省許可 緑ナンバー運行・専任ドライバーによる24時間運行管理体制を強化',
        tag: '安心',
        date: '9/6(日) 10:20',
        href: '/services',
      },
      {
        id: 6,
        title: 'クレジットカード・Apple Pay・Google Pay・PayPay・WeChat Pay・Alipay 各種決済対応',
        tag: '決済',
        date: '9/5(土) 09:00',
        href: '/tours',
      },
    ],
    airport: [
      {
        id: 11,
        title: '羽田空港（HND）第2・第3ターミナル ミート＆グリート送迎サービス料金表',
        tag: '羽田',
        date: '9/7(月) 13:00',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 12,
        title: '成田空港（NRT）〜東京都内 24時間深夜早朝定額運行・遅延待機無料（¥0）保障',
        tag: '成田',
        date: '9/7(月) 11:30',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 13,
        title: '成田空港専用グリーター手配（税関出口でお出迎え＆専用車へスムーズ誘導）',
        tag: 'VIP',
        date: '9/6(日) 15:40',
        href: '/tours/airport-transfer',
      },
      {
        id: 14,
        title: 'ハイエース グランドキャビン（最大9名・スーツケース10個積載）団体送迎プラン',
        tag: '大人数',
        date: '9/5(土) 14:10',
        href: '/tours/airport-transfer',
      },
    ],
    sightseeing: [
      {
        id: 21,
        title: '富士山五合目・新倉山浅間公園・忍野八海 絶景1日周遊チャーターコース',
        tag: '富士山',
        date: '9/7(月) 10:00',
        href: '/destinations/fuji-kawaguchiko',
        isHot: true,
      },
      {
        id: 22,
        title: '日光東照宮・中禅寺湖・華厳の滝 世界遺産プライベートツアー予約受付中',
        tag: '日光',
        date: '9/6(日) 17:20',
        href: '/destinations/nikko-unesco',
      },
      {
        id: 23,
        title: '鎌倉・江ノ島・横浜ベイエリア 海沿いプレミアムドライブプラン',
        tag: '鎌倉',
        date: '9/6(日) 09:50',
        href: '/destinations/kamakura-enoshima',
      },
      {
        id: 24,
        title: '軽井沢リゾートショッピング＆白糸の滝 避暑地貸切チャーター',
        tag: '軽井沢',
        date: '9/5(土) 11:30',
        href: '/destinations/karuizawa-resort',
      },
    ],
    ski: [
      {
        id: 31,
        title: '2024-2025 白馬バレー（八方尾根・五竜・栂池）空港・都内直行スノーハイヤー',
        tag: '白馬',
        date: '9/7(月) 08:30',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 32,
        title: '北海道ニセコ・ルスツ・キロロ 新千歳空港発着ラグジュアリー送迎',
        tag: '北海道',
        date: '9/6(日) 19:15',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 33,
        title: '志賀高原・野沢温泉・妙高高原 スキーバッグ・スノーボード積載完全対応',
        tag: '信州',
        date: '9/5(土) 16:00',
        href: '/tours/winter',
      },
    ],
    status: [
      {
        id: 41,
        title: '【本日運行状況】首都圏・関越道・中央道 全車正常ダイヤ運行中（遅延なし）',
        tag: '運行',
        date: '9/7(月) 15:00',
        href: '/tours',
        isHot: true,
      },
      {
        id: 42,
        title: '羽田空港・成田空港フライト発着モニター連動・ドライバー配備状況良好',
        tag: '空港',
        date: '9/7(月) 14:00',
        href: '/tours/airport-transfer',
      },
      {
        id: 43,
        title: '24時間緊急配車デスク・LINE/WhatsAppコンシェルジュ即時応答中',
        tag: '窓口',
        date: '9/7(月) 12:00',
        href: '/contact',
      },
    ],
  };

  const featuredTours = [
    {
      id: 'tour-1',
      title: '【定額直行】羽田空港・成田空港 ⇄ 都内23区ホテル 高級アルファード貸切送迎',
      provider: '株式会社SKリモ（国交省緑ナンバー正規認可・専任プロドライバー）',
      rating: '★★★★★ 5.0 (優良運行)',
      price: '¥28,000〜',
      capacity: '最大4名・スーツケース4個',
      statusText: '即時空車あり',
      image: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      badge: '人気No.1',
      href: '/tours/airport-transfer',
    },
    {
      id: 'tour-2',
      title: '【1日貸切】箱根・芦ノ湖・大涌谷・箱根神社 富士山絶景日帰り周遊プレミアムツアー',
      provider: '株式会社SKリモ（アルファード・グランエース確約）',
      rating: '★★★★★ 5.0 (優良運行)',
      price: '¥75,000',
      capacity: '1日8〜10時間貸切',
      statusText: '本日予約可能',
      image: '/images/dest-hakone-lake-ashi-1792x1024.jpg',
      badge: '定番人気',
      href: '/destinations/hakone-lake-ashi',
    },
    {
      id: 'tour-3',
      title: '【富士山特選】富士山五合目・河口湖・忍野八海・新倉山浅間公園 VIPチャーター',
      provider: '株式会社SKリモ（高速代・ガソリン代込プラン）',
      rating: '★★★★★ 5.0 (優良運行)',
      price: '¥70,000',
      capacity: '完全貸切プライベート',
      statusText: '空車残りわずか',
      image: '/images/dest-fuji-kawaguchiko-1792x1024.jpg',
      badge: '絶景コース',
      href: '/destinations/fuji-kawaguchiko',
    },
    {
      id: 'tour-4',
      title: '【冬季雪道4WD】白馬バレー・ニセコ スキーリゾート直行 グランエース4WD確約',
      provider: '株式会社SKリモ（スタッドレスタイヤ・スノーキャリア完備）',
      rating: '★★★★★ 5.0 (優良運行)',
      price: '¥95,000〜',
      capacity: '1〜5名・スキー板積載',
      statusText: '冬期受付中',
      image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      badge: '冬季限定',
      href: '/tours/winter',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased text-[13px] leading-relaxed pb-12">
      
      {/* ── Top Corporate Announcement Strip ── */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] text-slate-300 text-[11px] py-1.5 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#C5A059] bg-[#1E293B] px-1.5 py-0.2 rounded text-[10px]">
              SK LIMO JAPAN
            </span>
            <span className="hidden sm:inline text-slate-300">
              国土交通省関東運輸局許可 緑ナンバー正規運行・24時間運行管理
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium text-xs">
            <Link href="/tours" className="text-slate-200 hover:text-white hover:underline">
              ツアー・送迎一覧
            </Link>
            <span className="text-slate-600">|</span>
            <a
              href="http://hiremitsumori.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FBBF24] font-bold hover:underline"
            >
              ハイヤー見積もり.com
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/tours/airport-transfer" className="text-slate-200 hover:text-white hover:underline hidden sm:inline">
              空港定額運賃
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link href="/contact" className="text-slate-200 hover:text-white hover:underline hidden md:inline">
              法人・請求書払い
            </Link>
            {onSwitchToModernView && (
              <>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={onSwitchToModernView}
                  className="bg-[#2563EB] text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  🌐 Global Showcase
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Corporate Portal Header ── */}
      <header className="bg-white border-b border-[#E2E8F0] py-3.5 px-4 shadow-2xs sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Brand Logo & Description */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#C5A059] font-black text-sm tracking-wider shadow-xs border border-[#334155]">
                  SK
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                      SK LIMO JAPAN
                    </span>
                    <span className="text-[10px] bg-[#EEF2F6] text-[#475569] font-bold px-1.5 py-0.2 rounded border border-[#CBD5E1]">
                      公式ポータル
                    </span>
                  </div>
                  <span className="block text-[10px] text-[#64748B]">
                    総合ハイヤー配車・空港送迎・観光チャーター運行情報
                  </span>
                </div>
              </Link>

              {/* Mobile WhatsApp Quick Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden bg-[#25D366] text-[#0A0D14] p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
                title="LINE / WhatsApp 配車"
              >
                <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                <span className="text-[10px] font-black">24H配車</span>
              </a>
            </div>

            {/* Portal Search Box */}
            <div className="flex-1 max-w-xl w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/tours?q=${encodeURIComponent(searchQuery)}`;
                  } else {
                    window.location.href = '/tours';
                  }
                }}
                className="flex items-center shadow-2xs rounded-lg overflow-hidden border border-[#CBD5E1] focus-within:border-[#2563EB] transition-colors"
              >
                <div className="relative flex-1 bg-white">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="目的地・空港・エリアを検索（例: 羽田、成田、箱根、富士山、白馬）"
                    className="w-full h-10 px-3.5 bg-white text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 sm:px-5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4 text-[#C5A059]" />
                  <span>検索</span>
                </button>
              </form>

              {/* Quick Keywords */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5 text-[11px] text-[#64748B]">
                <span className="font-bold text-[#0F172A]">注目の目的地:</span>
                {quickKeywords.map((kw, idx) => (
                  <React.Fragment key={kw.label}>
                    {kw.href.startsWith('http') ? (
                      <a
                        href={kw.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D97706] font-bold hover:underline"
                      >
                        {kw.label}
                      </a>
                    ) : (
                      <Link href={kw.href} className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline">
                        {kw.label}
                      </Link>
                    )}
                    {idx < quickKeywords.length - 1 && <span className="text-[#CBD5E1]">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Desktop Dispatch Desk Info */}
            <div className="hidden lg:flex flex-col items-end text-right shrink-0">
              <span className="text-[10px] text-[#64748B] font-bold">24時間 専任配車コンシェルジュ</span>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:underline"
              >
                <MessageSquare className="w-4 h-4 fill-[#059669]" />
                <span>LINE / WhatsApp 即時配車</span>
              </a>
              <span className="text-[10px] text-[#94A3B8]">専任ドライバー直通・全国対応</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-[1200px] mx-auto px-3 sm:px-4 mt-3 space-y-3.5">
        
        {/* ══════════════════════════════════════════════════════════════════════════
            🚨 DUAL CAR-LIGHT CONSOLE:
            • LEFT: Flashing Ruby/Scarlet Red 'BOOK NOW' Light (links to sk.limo/tours)
            • RIGHT: Flashing Deep Cherry Red Car-Body Box with Gentle Yellow Turn Signal (links to http://hiremitsumori.com)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          
          {/* ── 1. LEFT BOX: Flashing Ruby-Red 'BOOK NOW' Car Taillight Box ── */}
          <Link
            href="/tours"
            className="flashing-booknow-ruby block rounded-lg p-4 sm:p-5 text-white text-center border-3 transition-transform cursor-pointer group shadow-xl relative overflow-hidden active:scale-[0.99]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-black tracking-widest text-[#FFEE00] uppercase">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>公式オンライン予約（即時空車確認）</span>
                <Flame className="w-4 h-4 animate-bounce" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-md">
                BOOK NOW
              </h2>

              <div className="bg-black/30 backdrop-blur-xs rounded-md py-1.5 px-2.5 border border-white/30">
                <span className="block text-xs sm:text-sm font-extrabold text-white">
                  【今すぐオンライン予約・空車確認】
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#FFEE00] font-bold mt-0.5">
                  羽田・成田空港送迎／箱根・富士山観光／白馬スキー送迎
                </span>
              </div>

              {/* Flashing Ruby Tone Action Button */}
              <div className="flashing-booknow-btn pt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-white py-2 rounded-md border border-white/40 group-hover:bg-white/30 transition-colors">
                <span>sk.limo/tours 予約画面へ進む</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </Link>

          {/* ── 2. RIGHT BOX: Deep Cherry Red Car Body with Gentle Yellow Turn Indicator Light ── */}
          <a
            href="http://hiremitsumori.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flashing-cherry-car-light block rounded-lg p-4 sm:p-5 text-white text-center border-3 transition-transform cursor-pointer group shadow-xl relative overflow-hidden active:scale-[0.99]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[11px] font-black tracking-widest text-[#FFEE00] uppercase">
                {/* 🚗 Small Gentle Yellow Breathing Turn Signal Indicator */}
                <span className="gentle-yellow-blip w-3.5 h-3.5 rounded-xs border-2 border-amber-300 inline-block shadow-xs" />
                <span>ハイヤー見積もり.com 新登場</span>
                <span className="gentle-yellow-blip w-3.5 h-3.5 rounded-xs border-2 border-amber-300 inline-block shadow-xs" />
              </div>

              <div className="flex items-center justify-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-md">
                  HIRE MITSUMORI
                </h2>
                {/* Small Gentle Yellow Box embedded in title */}
                <div className="gentle-yellow-blip px-2 py-0.5 rounded border border-amber-300 text-black font-black text-[10px] tracking-tighter flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-black" />
                  <span>TURN ➔</span>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-xs rounded-md py-1.5 px-2.5 border border-white/30">
                <span className="block text-xs sm:text-sm font-extrabold text-white">
                  【ハイヤー見積もり.com 公式ポータル】
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#FFEE00] font-bold mt-0.5">
                  全国ハイヤー・送迎料金 自動シミュレーター＆無料お見積り
                </span>
              </div>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-white bg-black/40 py-2 rounded-md border border-white/30 group-hover:bg-black/60 transition-colors">
                <span>http://hiremitsumori.com を開く</span>
                <ExternalLink className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </a>

        </div>

        {/* ── 3-Column Corporate Portal Layout (Responsive for Mobile) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

          {/* ═══════════════════════════════════════════════════════
              CENTER COLUMN (col-span-5 in Desktop, FIRST in Mobile):
              Corporate News & Dispatch Bulletin Feed + Featured Tours
          ═══════════════════════════════════════════════════════ */}
          <section className="lg:col-span-5 lg:order-2 space-y-3.5">
            
            {/* News & Topics Feed Box */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-2xs overflow-hidden">
              
              {/* Responsive Feed Tab Navigation */}
              <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] flex items-center text-xs font-bold overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('main')}
                  className={`px-3.5 py-2.5 border-r border-[#CBD5E1] transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'main'
                      ? 'bg-white text-[#0F172A] border-b-2 border-b-[#2563EB]'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  主要トピックス
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('airport')}
                  className={`px-3.5 py-2.5 border-r border-[#CBD5E1] transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'airport'
                      ? 'bg-white text-[#0F172A] border-b-2 border-b-[#2563EB]'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  空港定額送迎
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sightseeing')}
                  className={`px-3.5 py-2.5 border-r border-[#CBD5E1] transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'sightseeing'
                      ? 'bg-white text-[#0F172A] border-b-2 border-b-[#2563EB]'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  観光貸切
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ski')}
                  className={`px-3.5 py-2.5 border-r border-[#CBD5E1] transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'ski'
                      ? 'bg-white text-[#0F172A] border-b-2 border-b-[#2563EB]'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  冬季スキー
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className={`px-3.5 py-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'status'
                      ? 'bg-white text-[#0F172A] border-b-2 border-b-[#2563EB]'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  運行速報
                </button>
              </div>

              {/* Feed Articles List */}
              <div className="p-3 sm:p-3.5 space-y-2.5">
                <ul className="space-y-2 text-[12.5px] sm:text-[13px]">
                  {newsData[activeTab].map((item, idx) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-2 p-1.5 rounded-md hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-[#2563EB] font-black select-none text-xs sm:text-sm">
                          {idx + 1}.
                        </span>
                        {item.href.startsWith('http') ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D97706] group-hover:underline font-bold truncate flex items-center gap-1"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-[#0F172A] group-hover:text-[#2563EB] group-hover:underline font-medium line-clamp-2 sm:truncate"
                          >
                            {item.title}
                          </Link>
                        )}
                        {item.isHot && (
                          <span className="text-[9px] bg-[#2563EB] text-white px-1.5 py-0.2 font-bold rounded-xs shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#94A3B8] shrink-0 font-mono mt-0.5">
                        {item.date}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">最終更新: 2026年9月7日 13:20 JST</span>
                  <Link
                    href="/tours"
                    className="text-[#2563EB] font-bold hover:text-[#1D4ED8] hover:underline flex items-center gap-0.5"
                  >
                    <span>全ツアー・送迎一覧 ＞</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                FEATURED CHARTERS & AIRPORT TRANSFERS (おすすめ特選プラン)
            ══════════════════════════════════════════════════════════════ */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-3 sm:p-3.5 space-y-3 shadow-2xs">
              <div className="border-b border-[#E2E8F0] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#0F172A] flex items-center justify-center text-[#C5A059] font-bold text-[11px]">
                    ★
                  </div>
                  <span className="font-extrabold text-sm text-[#0F172A]">
                    おすすめハイヤー・観光チャーター特選プラン
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] hidden sm:inline">即時空車確認・直行手配</span>
              </div>

              <div className="space-y-3">
                {featuredTours.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#E2E8F0] rounded-lg p-2.5 hover:border-[#2563EB] transition-colors bg-[#FAFAFA] group"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-28 h-28 sm:h-20 shrink-0 rounded-md overflow-hidden border border-[#E2E8F0]">
                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-1 left-1 bg-[#0F172A] text-[#C5A059] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <Link
                          href={item.href}
                          className="font-bold text-xs text-[#0F172A] group-hover:text-[#2563EB] group-hover:underline line-clamp-2 block leading-snug"
                        >
                          {item.title}
                        </Link>
                        <div className="text-[10px] text-[#64748B] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span>{item.provider}</span>
                          <span className="text-[#D97706] font-bold">{item.rating}</span>
                        </div>
                        <div className="pt-1.5 flex items-center justify-between border-t border-[#E2E8F0]">
                          <div>
                            <span className="text-[10px] text-[#64748B]">定額運賃: </span>
                            <span className="text-sm font-black text-[#0F172A] font-mono">
                              {item.price}
                            </span>
                          </div>
                          <Link
                            href={item.href}
                            className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <span>詳細・予約</span>
                            <ChevronRight className="w-3 h-3 text-[#C5A059]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN (col-span-4 in Desktop, SECOND in Mobile):
              Service Directory + Fleet Specs
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 lg:order-1 space-y-3.5">

            {/* Category Directory Box */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-2xs overflow-hidden">
              <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] px-3.5 py-2.5 flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0F172A]">配車・送迎サービス一覧</span>
                <Link href="/tours" className="text-[10px] text-[#2563EB] font-bold hover:underline">
                  全一覧 ＞
                </Link>
              </div>
              <ul className="divide-y divide-[#F1F5F9] text-[12px]">
                <li>
                  <a
                    href="http://hiremitsumori.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 flex items-center justify-between hover:bg-[#FFFBEB] group transition-colors bg-[#FEFCE8]"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#D97706] group-hover:underline">
                      <span className="gentle-yellow-blip w-2.5 h-2.5 rounded-xs border border-amber-500 inline-block shrink-0" />
                      <span>ハイヤー見積もり.com (新サイト)</span>
                    </span>
                    <span className="text-[9px] bg-[#D97706] text-white px-1.5 py-0.2 rounded font-bold">
                      NEW
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/tours/airport-transfer"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <Plane className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>空港送迎ハイヤー</span>
                    </span>
                    <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] px-1.5 py-0.2 rounded font-bold">
                      羽田/成田 定額
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/hakone-lake-ashi"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>箱根・芦ノ湖 貸切観光</span>
                    </span>
                    <span className="text-[10px] text-[#D97706] font-bold">日帰りコース</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/fuji-kawaguchiko"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                      <span>富士山・河口湖周遊</span>
                    </span>
                    <span className="text-[10px] text-[#059669] font-bold">人気No.1</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/winter"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <Snowflake className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>冬季スキートランスファー</span>
                    </span>
                    <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] px-1.5 py-0.2 rounded font-bold">
                      白馬/ニセコ
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/nikko-unesco"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#0F172A] group-hover:text-[#2563EB]">
                      <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>日光東照宮・世界遺産</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/kamakura-enoshima"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#0F172A] group-hover:text-[#2563EB]">
                      <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>鎌倉・江ノ島・横浜</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#0F172A] group-hover:text-[#2563EB]">
                      <Car className="w-3.5 h-3.5 text-[#475569]" />
                      <span>保有車両一覧（アルファード他）</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#0F172A] group-hover:text-[#2563EB]">
                      <FileText className="w-3.5 h-3.5 text-[#475569]" />
                      <span>法人契約・請求書払い相談</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vehicle Fleet Spec Box */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-3 sm:p-3.5 space-y-2.5 shadow-2xs">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0F172A]">運行車両ラインナップ</span>
                <span className="text-[10px] text-[#059669] font-bold bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                  緑ナンバー正規車
                </span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <div className="flex justify-between font-bold text-[#0F172A]">
                    <span>トヨタ アルファード</span>
                    <span className="text-[#C5A059] font-mono">1〜4名</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    電動オットマン・VIP本革キャプテンシート・静粛性抜群
                  </p>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <div className="flex justify-between font-bold text-[#0F172A]">
                    <span>トヨタ グランエース 4WD</span>
                    <span className="text-[#C5A059] font-mono">1〜5名</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    四駆雪道安定性・独立4座席プレミアムキャビン
                  </p>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
                  <div className="flex justify-between font-bold text-[#0F172A]">
                    <span>ハイエース グランドキャビン</span>
                    <span className="text-[#C5A059] font-mono">1〜9名</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    スーツケース10個・スキー板・団体旅行完全対応
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN (col-span-3 in Desktop, THIRD in Mobile):
              Weather, Traffic, FX, WhatsApp Concierge
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 lg:order-3 space-y-3.5">
            
            {/* Live Weather Box */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-3 space-y-2 shadow-2xs">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <CloudSun className="w-4 h-4 text-[#D97706]" />
                  <span>主要エリアの天気</span>
                </div>
                <span className="text-[10px] text-[#94A3B8]">本日</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[10px]">東京 / 羽田</span>
                  <span className="font-bold text-xs sm:text-sm text-[#D97706] block">晴れ 28℃</span>
                  <span className="text-[9px] text-[#94A3B8]">降水 0%</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[10px]">箱根 / 芦ノ湖</span>
                  <span className="font-bold text-xs sm:text-sm text-[#0284C7] block">曇り 22℃</span>
                  <span className="text-[9px] text-[#94A3B8]">降水 20%</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[10px]">富士山 / 河口湖</span>
                  <span className="font-bold text-xs sm:text-sm text-[#D97706] block">晴れ 21℃</span>
                  <span className="text-[9px] text-[#94A3B8]">降水 10%</span>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[10px]">長野 / 白馬</span>
                  <span className="font-bold text-xs sm:text-sm text-[#059669] block">快晴 19℃</span>
                  <span className="text-[9px] text-[#94A3B8]">雪道注意なし</span>
                </div>
              </div>
            </div>

            {/* Highway Traffic Status Box */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-3 space-y-2 shadow-2xs">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Radio className="w-4 h-4 text-[#059669]" />
                  <span>高速道路 運行状況</span>
                </div>
                <span className="text-[9px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.2 font-bold rounded border border-[#A7F3D0]">
                  順調
                </span>
              </div>
              <ul className="text-[11px] space-y-1.5 divide-y divide-[#F1F5F9]">
                <li className="pt-1 flex justify-between">
                  <span className="text-[#475569]">首都高速道路</span>
                  <span className="text-[#059669] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span className="text-[#475569]">東名高速（箱根方面）</span>
                  <span className="text-[#059669] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span className="text-[#475569]">中央道（富士山方面）</span>
                  <span className="text-[#059669] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span className="text-[#475569]">東関東道（成田方面）</span>
                  <span className="text-[#059669] font-bold">● 正常運行</span>
                </li>
              </ul>
            </div>

            {/* Currency FX Rate Strip */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-3 space-y-1.5 shadow-2xs text-[11px]">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A]">為替レート（参考）</span>
                <span className="text-[10px] text-[#94A3B8]">USD/JPY</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-[#0F172A]">
                <span>1 USD = ¥152.40</span>
                <span>1 EUR = ¥165.20</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#64748B]">
                <span>1 CNY = ¥21.30</span>
                <span>1 HKD = ¥19.50</span>
              </div>
            </div>

            {/* 24H WhatsApp / Line Concierge Box */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 text-white space-y-2.5 text-center shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-extrabold block">
                SK LIMO 24H CONCIERGE
              </span>
              <span className="text-sm font-bold block">お電話・チャットでのご相談</span>
              <p className="text-[10px] text-slate-300 leading-normal">
                お見積もり・複数台手配・全国長距離運行もお気軽にお問い合わせください。
              </p>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-black py-2.5 px-3 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                <span>WhatsApp で今すぐ配車相談</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Corporate Footer ── */}
      <footer className="max-w-[1200px] mx-auto px-4 mt-8 pt-6 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[#2563EB]">
          <Link href="/services" className="hover:underline">会社概要</Link>
          <span>|</span>
          <Link href="/tours/airport-transfer" className="hover:underline">空港送迎規約</Link>
          <span>|</span>
          <Link href="/destinations" className="hover:underline">観光チャーター約款</Link>
          <span>|</span>
          <Link href="/tours" className="hover:underline">特定商取引法に基づく表記</Link>
          <span>|</span>
          <Link href="/contact" className="hover:underline">プライバシーポリシー</Link>
          <span>|</span>
          <Link href="/contact" className="hover:underline">お問い合わせ窓口</Link>
        </div>
        <p className="text-[10px] text-[#64748B]">
          国土交通省許可事業者 関東運輸局 緑ナンバー正規運行 | 株式会社SKリモ (SK LIMO Co., Ltd.)
        </p>
        <p className="text-[10px] text-[#94A3B8]">
          Copyright © 2026 SK LIMO JAPAN Co., Ltd. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
