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
    { label: 'グランエース4WD', href: '/services' },
  ];

  const newsData = {
    main: [
      {
        id: 1,
        title: '【公式】2024-2025年 羽田・成田空港〜都内ホテル直行定額ハイヤー予約受付開始',
        tag: '重要',
        date: '9/4(水) 14:30',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 2,
        title: '秋の箱根・芦ノ湖・大涌谷 1日満喫プライベートチャーター特集（アルファード確約）',
        tag: '特集',
        date: '9/4(水) 12:15',
        href: '/destinations/hakone-lake-ashi',
        isHot: true,
      },
      {
        id: 3,
        title: '冬季スキートランスファー（白馬・志賀高原・野沢温泉）グランエース4WD雪道装備完了',
        tag: '速報',
        date: '9/3(火) 18:00',
        href: '/tours/winter',
      },
      {
        id: 4,
        title: '国土交通省許可 緑ナンバー運行・専任ドライバーによる24時間運行管理体制を強化',
        tag: '安心',
        date: '9/3(火) 10:20',
        href: '/services',
      },
      {
        id: 5,
        title: '訪日外国人VIP・企業役員向けバイリンガルハイヤーサービスのご案内',
        tag: '企業',
        date: '9/2(月) 16:45',
        href: '/contact',
      },
      {
        id: 6,
        title: 'クレジットカード・Apple Pay・Google Pay・PayPay・WeChat Pay・Alipay 決済対応',
        tag: '決済',
        date: '9/1(日) 09:00',
        href: '/booking',
      },
    ],
    airport: [
      {
        id: 11,
        title: '羽田空港（HND）第2・第3ターミナル ミート＆グリート送迎サービス料金表',
        tag: '羽田',
        date: '9/4(水) 13:00',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 12,
        title: '成田空港（NRT）〜東京都内 24時間深夜早朝定額運行・遅延待機無料（¥0）保障',
        tag: '成田',
        date: '9/4(水) 11:30',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 13,
        title: '成田空港専用グリーター手配（税関出口でお出迎え＆専用車へスムーズ誘導）',
        tag: 'VIP',
        date: '9/3(火) 15:40',
        href: '/tours/airport-transfer',
      },
      {
        id: 14,
        title: 'ハイエース グランドキャビン（最大9名・スーツケース10個積載）団体送迎プラン',
        tag: '大人数',
        date: '9/2(月) 14:10',
        href: '/tours/airport-transfer',
      },
    ],
    sightseeing: [
      {
        id: 21,
        title: '富士山五合目・新倉山浅間公園・忍野八海 絶景1日周遊チャーターコース',
        tag: '富士山',
        date: '9/4(水) 10:00',
        href: '/destinations/fuji-kawaguchiko',
        isHot: true,
      },
      {
        id: 22,
        title: '日光東照宮・中禅寺湖・華厳の滝 世界遺産プライベートツアー予約受付中',
        tag: '日光',
        date: '9/3(火) 17:20',
        href: '/destinations/nikko-unesco',
      },
      {
        id: 23,
        title: '鎌倉・江ノ島・横浜ベイエリア 海沿いプレミアムドライブプラン',
        tag: '鎌倉',
        date: '9/3(火) 09:50',
        href: '/destinations/kamakura-enoshima',
      },
      {
        id: 24,
        title: '軽井沢リゾートショッピング＆白糸の滝 避暑地貸切チャーター',
        tag: '軽井沢',
        date: '9/2(月) 11:30',
        href: '/destinations/karuizawa-resort',
      },
    ],
    ski: [
      {
        id: 31,
        title: '2024-2025 白馬バレー（八方尾根・五竜・栂池）空港・都内直行スノーハイヤー',
        tag: '白馬',
        date: '9/4(水) 08:30',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 32,
        title: '北海道ニセコ・ルスツ・キロロ 新千歳空港発着ラグジュアリー送迎',
        tag: '北海道',
        date: '9/3(火) 19:15',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 33,
        title: '志賀高原・野沢温泉・妙高高原 スキーバッグ・スノーボード積載完全対応',
        tag: '信州',
        date: '9/2(月) 16:00',
        href: '/tours/winter',
      },
    ],
    status: [
      {
        id: 41,
        title: '【本日運行状況】首都圏・関越道・中央道 全車正常ダイヤ運行中（遅延なし）',
        tag: '運行',
        date: '9/4(水) 15:00',
        href: '/services',
        isHot: true,
      },
      {
        id: 42,
        title: '羽田空港・成田空港フライト発着モニター連動・ドライバー配備状況良好',
        tag: '空港',
        date: '9/4(水) 14:00',
        href: '/tours/airport-transfer',
      },
      {
        id: 43,
        title: '24時間緊急配車デスク・LINE/WhatsAppコンシェルジュ即時応答中',
        tag: '窓口',
        date: '9/4(水) 12:00',
        href: '/contact',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans antialiased text-[13px] leading-relaxed pb-12">
      {/* ── Classic Top Announcement / Yahoo Utility Strip ── */}
      <div className="bg-[#EEEEEE] border-b border-[#CCCCCC] text-[#555555] text-[11px] py-1 px-4">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#CC0000]">【SK LIMO JAPAN ポータル】</span>
            <span>国土交通省関東運輸局許可 緑ナンバー正規運行・24時間運行管理</span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <Link href="/services" className="text-[#0033CC] hover:underline">サービス一覧</Link>
            <span>|</span>
            <Link href="/tours/airport-transfer" className="text-[#0033CC] hover:underline">空港定額運賃表</Link>
            <span>|</span>
            <Link href="/contact" className="text-[#0033CC] hover:underline">企業様・請求書払い</Link>
            <span>|</span>
            {onSwitchToModernView && (
              <button
                type="button"
                onClick={onSwitchToModernView}
                className="bg-[#0033CC] text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-[#002299] transition-colors cursor-pointer"
              >
                🌐 Global Modern View (グローバル表示に戻る)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Classic Yahoo Header Logo & Search Bar ── */}
      <header className="bg-white border-b-2 border-[#CC0000] py-3.5 px-4 shadow-xs">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/explore" className="flex items-center gap-2">
                <span className="text-3xl font-black tracking-tighter text-[#CC0000] font-serif">
                  SK! JAPAN
                </span>
                <div className="border-l border-[#DDDDDD] pl-2.5">
                  <span className="block text-[15px] font-bold text-[#222222] tracking-tight">
                    SKリモ 送迎・観光ポータル
                  </span>
                  <span className="block text-[10px] text-[#777777]">
                    Japan Official Chauffeur Service Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Portal Search Box */}
            <div className="flex-1 max-w-xl w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/booking?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="flex items-center"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="目的地、空港名、ホテル名を入力（例: 羽田空港、箱根、富士山、白馬）"
                    className="w-full h-10 px-3 border-2 border-[#CC0000] rounded-l-sm bg-white text-sm text-[#333333] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#CC0000] hover:bg-[#AA0000] text-white font-bold text-sm rounded-r-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>空車検索</span>
                </button>
              </form>

              {/* Quick Keywords */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5 text-[11px] text-[#666666]">
                <span className="font-bold text-[#333333]">注目のキーワード:</span>
                {quickKeywords.map((kw, idx) => (
                  <React.Fragment key={kw.label}>
                    <Link href={kw.href} className="text-[#0033CC] hover:underline">
                      {kw.label}
                    </Link>
                    {idx < quickKeywords.length - 1 && <span className="text-[#CCCCCC]">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Emergency / Reservation Contact */}
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[10px] text-[#888888] font-bold">24時間 配車コンシェルジュ</span>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold text-[#008800] hover:underline"
              >
                <MessageSquare className="w-4 h-4 fill-[#008800]" />
                <span>WhatsApp / LINE 即時回答</span>
              </a>
              <span className="text-[10px] text-[#555555]">年中無休・全国配車対応</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-[1180px] mx-auto px-4 mt-3 space-y-3.5">
        
        {/* ══════════════════════════════════════════════════════════════════
            🚨 GIANT RETRO YAHOO 'BOOK NOW' PROMINENT BANNER (USER REQUEST)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-[#FFECEC] via-[#FFF8E7] to-[#FFECEC] border-3 border-[#CC0000] rounded-sm p-4 sm:p-5 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-[#CC0000] text-white text-[11px] font-black px-2 py-0.5 rounded-xs animate-pulse">
                  🚨 即時予約受付中
                </span>
                <span className="text-xs font-bold text-[#AA0000]">
                  羽田・成田空港送迎／箱根・富士山観光／冬季スキートランスファー
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-[#222222] tracking-tight">
                【SK LIMO 公式】リアルタイム空車照会・オンライン事前決済
              </h2>
              <p className="text-xs text-[#555555]">
                専任ドライバー確約・明朗定額運賃・フライト遅延無料待機（¥0）・Apple Pay / Google Pay / PayPay / 微信 / 支付宝 対応
              </p>
            </div>

            <Link
              href="/booking"
              className="shrink-0 w-full md:w-auto bg-[#CC0000] hover:bg-[#AA0000] text-white font-black text-base sm:text-lg px-8 py-4 rounded-sm shadow-lg border-2 border-white flex items-center justify-center gap-2 tracking-wide transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <span>今すぐオンライン予約へ進む（Book Now）</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Link>
          </div>
        </div>

        {/* ── 3-Column Classic Yahoo! JAPAN Portal Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN (col-span-3): Directory / サービス一覧
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-3.5">
            {/* Category Directory Box */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs shadow-2xs">
              <div className="bg-[#F6F6F6] border-b border-[#DCDCDC] px-3 py-2 flex items-center justify-between">
                <span className="font-bold text-xs text-[#333333]">サービス・運賃ディレクトリ</span>
                <span className="text-[10px] text-[#888888]">全一覧</span>
              </div>
              <ul className="divide-y divide-[#EEEEEE] text-[12px]">
                <li>
                  <Link href="/tours/airport-transfer" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 font-bold text-[#0033CC] group-hover:text-[#CC0000]">
                      <Plane className="w-3.5 h-3.5 text-[#0033CC]" />
                      <span>空港送迎ハイヤー</span>
                    </span>
                    <span className="text-[10px] bg-[#E8F1FF] text-[#0033CC] px-1.5 py-0.2 rounded font-bold">羽田/成田</span>
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/hakone-lake-ashi" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 font-bold text-[#0033CC] group-hover:text-[#CC0000]">
                      <Compass className="w-3.5 h-3.5 text-[#E65100]" />
                      <span>箱根・芦ノ湖 貸切観光</span>
                    </span>
                    <span className="text-[10px] text-[#E65100] font-bold">日帰り</span>
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/fuji-kawaguchiko" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 font-bold text-[#0033CC] group-hover:text-[#CC0000]">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>富士山・河口湖周遊</span>
                    </span>
                    <span className="text-[10px] text-[#2E7D32] font-bold">人気No.1</span>
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/nikko-unesco" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 text-[#0033CC] group-hover:text-[#CC0000]">
                      <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>日光東照宮・世界遺産</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/kamakura-enoshima" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 text-[#0033CC] group-hover:text-[#CC0000]">
                      <Compass className="w-3.5 h-3.5 text-[#0288D1]" />
                      <span>鎌倉・江ノ島・横浜</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/tours/winter" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 font-bold text-[#0033CC] group-hover:text-[#CC0000]">
                      <Snowflake className="w-3.5 h-3.5 text-[#00ACC1]" />
                      <span>冬季スキートランスファー</span>
                    </span>
                    <span className="text-[10px] bg-[#E0F7FA] text-[#00838F] px-1.5 py-0.2 rounded font-bold">白馬/ニセコ</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 text-[#0033CC] group-hover:text-[#CC0000]">
                      <Car className="w-3.5 h-3.5 text-[#424242]" />
                      <span>保有車両図鑑（アルファード他）</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] hover:text-[#CC0000] group transition-colors">
                    <span className="flex items-center gap-2 text-[#0033CC] group-hover:text-[#CC0000]">
                      <FileText className="w-3.5 h-3.5 text-[#555555]" />
                      <span>法人契約・請求書払い</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vehicle Fleet Spec Box */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3 space-y-2.5 shadow-2xs">
              <div className="border-b border-[#DCDCDC] pb-1.5 flex items-center justify-between">
                <span className="font-bold text-xs text-[#222222]">運行車両スペック</span>
                <span className="text-[10px] text-[#CC0000] font-bold">緑ナンバー正規車</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="bg-[#F9F9F9] p-2 rounded-xs border border-[#EEEEEE]">
                  <div className="flex justify-between font-bold text-[#222222]">
                    <span>トヨタ アルファード</span>
                    <span className="text-[#C5A059]">1〜4名</span>
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5">電動オットマン・VIP本革キャプテンシート</p>
                </div>
                <div className="bg-[#F9F9F9] p-2 rounded-xs border border-[#EEEEEE]">
                  <div className="flex justify-between font-bold text-[#222222]">
                    <span>トヨタ グランエース 4WD</span>
                    <span className="text-[#C5A059]">1〜5名</span>
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5">四駆雪道安定性・独立4座席プレミアム</p>
                </div>
                <div className="bg-[#F9F9F9] p-2 rounded-xs border border-[#EEEEEE]">
                  <div className="flex justify-between font-bold text-[#222222]">
                    <span>ハイエース グランドキャビン</span>
                    <span className="text-[#C5A059]">1〜9名</span>
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5">スーツケース10個・スキー板積載対応</p>
                </div>
              </div>
            </div>

            {/* Chauffeur Trust Badge */}
            <div className="bg-[#F7F9FC] border border-[#D5E1F0] rounded-xs p-3 text-[11px] text-[#444444] space-y-2">
              <div className="flex items-center gap-2 text-[#0033CC] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#0033CC]" />
                <span>国土交通省 認可事業所</span>
              </div>
              <p className="text-[10px] leading-relaxed text-[#666666]">
                関自旅一第1142号準拠。すべての運行車両に対人・対物無制限保険、全席シートベルト、ドライブレコーダー、アルコール検知器を完備。
              </p>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════
              CENTER COLUMN (col-span-6): Yahoo Topics & News Feed
          ═══════════════════════════════════════════════════════ */}
          <section className="lg:col-span-6 space-y-3.5">
            {/* Yahoo Topics Box */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs shadow-2xs">
              {/* Tab Navigation */}
              <div className="bg-[#F3F3F3] border-b border-[#DCDCDC] flex items-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('main')}
                  className={`px-3.5 py-2.5 border-r border-[#DCDCDC] transition-colors cursor-pointer ${
                    activeTab === 'main'
                      ? 'bg-white text-[#CC0000] border-t-2 border-t-[#CC0000]'
                      : 'text-[#555555] hover:bg-[#EAEAEA]'
                  }`}
                >
                  主要ニュース
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('airport')}
                  className={`px-3.5 py-2.5 border-r border-[#DCDCDC] transition-colors cursor-pointer ${
                    activeTab === 'airport'
                      ? 'bg-white text-[#CC0000] border-t-2 border-t-[#CC0000]'
                      : 'text-[#555555] hover:bg-[#EAEAEA]'
                  }`}
                >
                  空港送迎
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sightseeing')}
                  className={`px-3.5 py-2.5 border-r border-[#DCDCDC] transition-colors cursor-pointer ${
                    activeTab === 'sightseeing'
                      ? 'bg-white text-[#CC0000] border-t-2 border-t-[#CC0000]'
                      : 'text-[#555555] hover:bg-[#EAEAEA]'
                  }`}
                >
                  観光貸切
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ski')}
                  className={`px-3.5 py-2.5 border-r border-[#DCDCDC] transition-colors cursor-pointer ${
                    activeTab === 'ski'
                      ? 'bg-white text-[#CC0000] border-t-2 border-t-[#CC0000]'
                      : 'text-[#555555] hover:bg-[#EAEAEA]'
                  }`}
                >
                  冬季スキー
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className={`px-3.5 py-2.5 transition-colors cursor-pointer ${
                    activeTab === 'status'
                      ? 'bg-white text-[#CC0000] border-t-2 border-t-[#CC0000]'
                      : 'text-[#555555] hover:bg-[#EAEAEA]'
                  }`}
                >
                  運行速報
                </button>
              </div>

              {/* Topics Articles Feed */}
              <div className="p-3.5 space-y-2.5">
                <ul className="space-y-2 text-[13px]">
                  {newsData[activeTab].map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-2 group">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-[#CC0000] font-bold select-none">•</span>
                        <Link
                          href={item.href}
                          className="text-[#0033CC] group-hover:text-[#CC0000] group-hover:underline font-medium truncate"
                        >
                          {item.title}
                        </Link>
                        {item.isHot && (
                          <span className="text-[10px] bg-[#CC0000] text-white px-1 font-bold rounded-xs shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#888888] shrink-0 font-mono">
                        {item.date}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-[#EEEEEE] flex items-center justify-between text-[11px]">
                  <span className="text-[#666666]">最終更新: 2026年9月4日 15:00 JST</span>
                  <Link href="/booking" className="text-[#0033CC] font-bold hover:underline flex items-center gap-1">
                    <span>オンライン空車一覧を見る ＞</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Featured Sightseeing Tour Spotlight */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3.5 space-y-3 shadow-2xs">
              <div className="border-b border-[#DCDCDC] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#CC0000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                    注目ツアー
                  </span>
                  <h3 className="font-bold text-sm text-[#222222]">
                    箱根温泉・芦ノ湖 富士山絶景プライベート日帰りコース
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#CC0000]">定額 ¥75,000〜</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-1 relative h-28 rounded-xs overflow-hidden border border-[#E0E0E0]">
                  <Image
                    src="/images/dest-hakone-lake-ashi-1792x1024.jpg"
                    alt="箱根 芦ノ湖"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1 text-[12px] text-[#444444]">
                  <p className="font-bold text-[#222222]">
                    【行程例】都内ホテルお迎え ➔ 大涌谷 ➔ 芦ノ湖・箱根神社 ➔ 箱根湯本温泉 ➔ 都内送込
                  </p>
                  <p className="text-[11px] text-[#666666] leading-relaxed">
                    専任ドライバーが1日完全貸切でサポート。高速料金・ガソリン代・保険すべてコミコミの明朗会計です。アルファードまたはグランエースで快適な旅をお届けします。
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <Link
                      href="/destinations/hakone-lake-ashi"
                      className="bg-[#0033CC] hover:bg-[#002299] text-white text-xs font-bold px-3 py-1 rounded-xs inline-flex items-center gap-1"
                    >
                      <span>コース詳細・予約</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/destinations"
                      className="text-[#0033CC] hover:underline text-xs"
                    >
                      その他観光地一覧 ＞
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials / Yahoo Chiebukuro style Q&A */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3.5 space-y-2.5 shadow-2xs">
              <div className="border-b border-[#DCDCDC] pb-1.5 flex items-center justify-between">
                <span className="font-bold text-xs text-[#222222]">よくある質問・ご利用者の声</span>
                <Link href="/blog" className="text-[10px] text-[#0033CC] hover:underline">もっと見る</Link>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="bg-[#FFFDF6] p-2.5 rounded-xs border border-[#F2E8C9]">
                  <span className="font-bold text-[#C5A059] block">Q. フライトが大幅に遅延した場合はどうなりますか？</span>
                  <p className="text-[11px] text-[#555555] mt-1">
                    A. 担当ドライバーがリアルタイムで航空便の着陸を追跡しておりますので、遅延した場合でも無料（¥0）で柔軟にお待ちいたします。追加料金は一切発生しません。
                  </p>
                </div>
                <div className="bg-[#FFFDF6] p-2.5 rounded-xs border border-[#F2E8C9]">
                  <span className="font-bold text-[#C5A059] block">Q. 領収書や適格請求書（インボイス）の発行は可能ですか？</span>
                  <p className="text-[11px] text-[#555555] mt-1">
                    A. はい、決済完了後にPDF領収証を即時発行いたします。インボイス制度対応の事業者番号も記載されております。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN (col-span-3): Weather, Traffic, Monitor
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-3.5">
            {/* Live Weather Box */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3 space-y-2 shadow-2xs">
              <div className="border-b border-[#DCDCDC] pb-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#222222]">
                  <CloudSun className="w-4 h-4 text-[#E65100]" />
                  <span>主要エリアの天気</span>
                </div>
                <span className="text-[10px] text-[#888888]">9/4 15時</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#F8F9FA] p-2 rounded-xs border border-[#EEEEEE] text-center">
                  <span className="text-[#666666] block text-[10px]">東京 / 羽田</span>
                  <span className="font-bold text-sm text-[#E65100] block">晴れ 28℃</span>
                  <span className="text-[9px] text-[#888888]">降水 0%</span>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-xs border border-[#EEEEEE] text-center">
                  <span className="text-[#666666] block text-[10px]">箱根 / 芦ノ湖</span>
                  <span className="font-bold text-sm text-[#0288D1] block">曇り 22℃</span>
                  <span className="text-[9px] text-[#888888]">降水 20%</span>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-xs border border-[#EEEEEE] text-center">
                  <span className="text-[#666666] block text-[10px]">富士山 / 河口湖</span>
                  <span className="font-bold text-sm text-[#E65100] block">晴れ 21℃</span>
                  <span className="text-[9px] text-[#888888]">降水 10%</span>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-xs border border-[#EEEEEE] text-center">
                  <span className="text-[#666666] block text-[10px]">長野 / 白馬</span>
                  <span className="font-bold text-sm text-[#00897B] block">快晴 19℃</span>
                  <span className="text-[9px] text-[#888888]">雪道注意なし</span>
                </div>
              </div>
            </div>

            {/* Highway Traffic Status Box */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3 space-y-2 shadow-2xs">
              <div className="border-b border-[#DCDCDC] pb-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#222222]">
                  <Radio className="w-4 h-4 text-[#2E7D32]" />
                  <span>高速道路 運行状況</span>
                </div>
                <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 font-bold rounded">順調</span>
              </div>
              <ul className="text-[11px] space-y-1.5 divide-y divide-[#F0F0F0]">
                <li className="pt-1 flex justify-between">
                  <span>首都高速道路</span>
                  <span className="text-[#2E7D32] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span>東名高速（箱根方面）</span>
                  <span className="text-[#2E7D32] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span>中央道（富士山方面）</span>
                  <span className="text-[#2E7D32] font-bold">● 正常運行</span>
                </li>
                <li className="pt-1 flex justify-between">
                  <span>東関東道（成田方面）</span>
                  <span className="text-[#2E7D32] font-bold">● 正常運行</span>
                </li>
              </ul>
            </div>

            {/* Currency FX Rate Strip */}
            <div className="bg-white border border-[#DCDCDC] rounded-xs p-3 space-y-1.5 shadow-2xs text-[11px]">
              <div className="border-b border-[#DCDCDC] pb-1 flex items-center justify-between">
                <span className="font-bold text-xs text-[#222222]">本日の為替レート（参考）</span>
                <span className="text-[10px] text-[#888888]">USD/JPY</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-[#222222]">
                <span>1 USD = ¥152.40</span>
                <span>1 EUR = ¥165.20</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#666666]">
                <span>1 CNY = ¥21.30</span>
                <span>1 HKD = ¥19.50</span>
              </div>
            </div>

            {/* Instant Contact CTA Widget */}
            <div className="bg-[#0A0D14] border border-[#333333] rounded-xs p-3.5 text-white space-y-2 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">
                SK LIMO 24H CONCIERGE
              </span>
              <span className="text-sm font-bold block">お電話・チャットでのご相談</span>
              <p className="text-[10px] text-slate-300">
                お見積もり・複数台手配・長距離運行もお気軽にお問い合わせください。
              </p>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-2 px-3 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                <span>WhatsApp で今すぐ相談</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Classic Yahoo Style Footer ── */}
      <footer className="max-w-[1180px] mx-auto px-4 mt-8 pt-6 border-t-2 border-[#DCDCDC] text-[11px] text-[#666666] space-y-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[#0033CC]">
          <Link href="/services" className="hover:underline">会社概要</Link>
          <span>|</span>
          <Link href="/tours/airport-transfer" className="hover:underline">空港送迎規約</Link>
          <span>|</span>
          <Link href="/destinations" className="hover:underline">観光チャーター約款</Link>
          <span>|</span>
          <Link href="/booking" className="hover:underline">特定商取引法に基づく表記</Link>
          <span>|</span>
          <Link href="/contact" className="hover:underline">プライバシーポリシー</Link>
          <span>|</span>
          <Link href="/contact" className="hover:underline">お問い合わせ窓口</Link>
        </div>
        <p className="text-[10px] text-[#888888]">
          国土交通省許可事業者 関東運輸局 緑ナンバー正規運行 | 株式会社SKリモ (SK LIMO Co., Ltd.)
        </p>
        <p className="text-[10px] text-[#AAAAAA] font-serif">
          Copyright (C) 2026 SK LIMO JAPAN Co., Ltd. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
