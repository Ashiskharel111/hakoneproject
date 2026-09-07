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
  Briefcase,
  Luggage,
  Building2,
  HeartHandshake,
  Check,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface YahooJapanHomeViewProps {
  onSwitchToModernView?: () => void;
}

export default function YahooJapanHomeView({ onSwitchToModernView }: YahooJapanHomeViewProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'airport' | 'sightseeing' | 'ski' | 'status'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFleet, setSelectedFleet] = useState<'alphard' | 'granace' | 'hiace' | 'crown'>('alphard');
  const [fleetView, setFleetView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `SK LIMO 日本語配車センターにお問い合わせいたします。`
  )}`;

  const quickKeywords = [
    { label: '羽田空港定額送迎', href: '/tours/airport-transfer' },
    { label: '成田空港送迎', href: '/tours/airport-transfer' },
    { label: '箱根温泉チャーター', href: '/destinations/hakone-lake-ashi' },
    { label: '富士山・河口湖', href: '/destinations/fuji-kawaguchiko' },
    { label: '白馬スキー送迎', href: '/tours/winter' },
    { label: 'ニセコ貸切ハイヤー', href: '/tours/winter' },
    { label: 'アルファード確約', href: '/services' },
    { label: 'ハイエース15台保有', href: '/services' },
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

  const useCases = [
    {
      id: 'uc-1',
      title: 'ご自宅・ホテル等〜空港',
      desc: '重いスーツケースをお持ちでも、ご自宅やご宿泊先ホテルのエントランスから空港出発ロビー前までドア・ツー・ドアで快適に直行。',
      image: '/images/airport-transfer-vip-alphard-1376x768.jpg',
      badge: '羽田・成田定額',
      href: '/tours/airport-transfer',
    },
    {
      id: 'uc-2',
      title: '空港〜ご自宅・ホテル（ミートサービス）',
      desc: 'フライト到着時、担当ドライバーまたは専任グリーターが税関出口でお名前ボードを掲げてお出迎え。遅延待機も無料（¥0）で安心。',
      image: '/images/airport-transfer.jpg',
      badge: 'お出迎え無料',
      href: '/tours/airport-transfer',
    },
    {
      id: 'uc-3',
      title: 'ビジネスミーティング・役員送迎',
      desc: '重要な取引先のご送迎、複数拠点の視察や移動、社内役員の定期通勤・会食送迎を上質なプライバシー空間でサポート。',
      image: '/images/fleet-toyota-crown-exterior-1477x1108.jpg',
      badge: '法人・請求書払い',
      href: '/contact',
    },
    {
      id: 'uc-4',
      title: '観光案内・プライベートツアー',
      desc: '箱根・芦ノ湖、富士山五合目・河口湖、日光東照宮、鎌倉・横浜など、専任ドライバーがお客様専用のスケジュールでご案内。',
      image: '/images/dest-hakone-lake-ashi-1376x768.jpg',
      badge: '完全貸切自由',
      href: '/tours',
    },
    {
      id: 'uc-5',
      title: '冬季スキートランスファー',
      desc: '白馬バレー、ニセコ、志賀高原、野沢温泉へ直行。4WD雪道仕様グランエース＆ハイエースでスキー板・スノーボードを楽々積載。',
      image: '/images/winter-ski-trails-powder-5947x3965.jpg',
      badge: '雪道4WD完備',
      href: '/tours/winter',
    },
    {
      id: 'uc-6',
      title: '冠婚葬祭・式場送迎',
      desc: '結婚式、ご法要、各種記念式典など、大切なご家族やご親族様を目的地まで礼儀正しい専任ドライバーが安全・丁寧にお送りいたします。',
      image: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      badge: '礼儀・マナー徹底',
      href: '/contact',
    },
    {
      id: 'uc-7',
      title: '区間送迎（個人様・一般企業様向け）',
      desc: '都内各所、ゴルフ場、病院通院、レストラン送迎など、短距離から長距離まで用途に合わせてフレキシブルに配車可能。',
      image: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      badge: 'ドア・ツー・ドア',
      href: '/booking',
    },
    {
      id: 'uc-8',
      title: 'イベント・MICE送迎（旅行会社様向け）',
      desc: '国際会議、展示会、修学旅行、インバウンド団体ツアーに。保有する15台のハイエースで大人数のスムーズな輸送を実現。',
      image: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      badge: 'ハイエース15台',
      href: '/services',
    },
  ];

  const fleetDetails = {
    alphard: {
      name: 'トヨタ アルファード エグゼクティブラウンジ',
      badge: 'PREMIUM VIP',
      capacity: '1〜4名様',
      luggage: 'スーツケース 3〜4個',
      desc: '電動オットマン付きキャプテンシート、シートベンチレーション/ヒーター、極上の静粛性を誇るエグゼクティブMPV。ビジネス役員送迎や少人数観光に最適。',
      exterior: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      interior: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      specs: ['全席本革VIPシート', '電動オットマン・リクライニング', '読書灯・USB/AC電源', 'Wi-Fi・ミネラルウォーター無料'],
    },
    granace: {
      name: 'トヨタ グランエース 4WD VIPラウンジ',
      badge: 'ULTRA PREMIUM 4WD',
      capacity: '1〜5名様',
      luggage: 'スーツケース 4〜5個',
      desc: '堂々たるボディサイズに4WDを搭載。2列目・3列目ともに独立キャプテンシートを備え、雪道や長距離観光でも圧倒的な快適性と安定性を誇ります。',
      exterior: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      interior: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
      specs: ['4WD四輪駆動（雪道走破性）', '独立4座席VIPキャプテンシート', '広大なレッグスペース', '大容量トランク'],
    },
    hiace: {
      name: 'ハイエース グランドキャビン（15台保有）',
      badge: 'HIGH CAPACITY GROUP',
      capacity: '1〜9名様',
      luggage: 'スーツケース 9〜10個',
      desc: '最大9名様のご乗車と大量の大型スーツケース、スキー板・ゴルフバッグを楽々積載できるハイルーフワイドキャビン。ファミリーや団体グループに最適。',
      exterior: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      interior: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
      specs: ['最大9名乗車可能', 'スーツケース10個積載', 'ハイルーフ開放キャビン', '15台の自社保有体制'],
    },
    crown: {
      name: 'トヨタ クラウン セダン',
      badge: 'EXECUTIVE SEDAN',
      capacity: '1〜3名様',
      luggage: 'スーツケース 2個',
      desc: '日本の高級車を代表する伝統のクラウン。優れた静粛性と滑らかな乗り心地で、エグゼクティブの都市部移動に選ばれています。',
      exterior: '/images/fleet-toyota-crown-exterior-1477x1108.jpg',
      interior: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-crown-trunk-1477x1108.jpg',
      specs: ['最高峰の静粛性', '都市部機動性', '役員送迎標準仕様', 'プライバシー保護'],
    },
  };

  const faqs = [
    {
      q: '空港でのお迎え（ミートサービス）はどのように行われますか？',
      a: '担当ドライバーが便名をリアルタイム追跡し、税関出口でお名前ボードを掲げてお出迎えいたします。到着口から専用車両までお荷物をお運びし、スムーズにご案内いたします。フライトが遅延した場合でも待機料金は無料（¥0）です。',
    },
    {
      q: '料金は完全定額制ですか？高速料金やガソリン代は含まれますか？',
      a: 'はい、SK LIMOのすべての料金は完全定額制（All-Inclusive）です。高速道路通行料、ガソリン代、車両保険料、消費税が含まれており、渋滞や深夜早朝によるメーター加算などの追加請求は一切ございません。',
    },
    {
      q: '利用可能な支払い方法には何がありますか？法人請求書払いはできますか？',
      a: 'クレジットカード（Visa、Mastercard、American Express、JCB、Diners、銀聯）、Apple Pay（ワンクリック即時決済）、Google Pay、WeChat Pay、Alipay、PayPayに対応しております。法人企業様向けの後日請求書払い・売掛契約も承っております。',
    },
    {
      q: '予約のキャンセルや日時変更は可能ですか？',
      a: '運行開始の24時間前までであれば、キャンセル料無料でキャンセル・日程変更が可能です。航空会社の都合による欠航・遅延の場合も柔軟に無料変更または全額返金対応をいたします。',
    },
    {
      q: '保有車両は日本の法律に基づく正規の緑ナンバー（営業車）ですか？',
      a: 'はい。当社の全車両は、国土交通省関東運輸局の認可を受けた「緑ナンバー（営業用登録車）」であり、無許可の白タク等は一切ございません。万全の搭乗者傷害保険を完備しております。',
    },
  ];

  const currentFleet = fleetDetails[selectedFleet];
  const activeFleetPhoto =
    fleetView === 'interior'
      ? currentFleet.interior
      : fleetView === 'trunk'
      ? currentFleet.trunk
      : currentFleet.exterior;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased text-[13px] leading-relaxed pb-16">
      
      {/* ── Top Corporate Announcement Strip ── */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] text-slate-300 text-[11px] py-1.5 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#C5A059] bg-[#1E293B] px-1.5 py-0.2 rounded text-[10px]">
              SK LIMO JAPAN
            </span>
            <span className="hidden sm:inline text-slate-300">
              国土交通省関東運輸局許可 緑ナンバー正規運行・ハイエース15台自社保有
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
              空港定額運賃表
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
                  🌐 Global View
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Corporate Portal Header with Official SK Logo ── */}
      <header className="bg-white border-b border-[#E2E8F0] py-3 px-4 shadow-2xs sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Official SK Limo Brand Logo */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-10 w-28 sm:h-11 sm:w-32">
                  <Image
                    src="/images/brand-sklimo-official-logo-250x250.png"
                    alt="株式会社SKリモ 公式ロゴ"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="border-l border-[#CBD5E1] pl-2.5">
                  <span className="block text-sm font-black text-[#0F172A] tracking-tight">
                    株式会社SKリモ
                  </span>
                  <span className="block text-[10px] text-[#64748B]">
                    国土交通省許可 緑ナンバーハイヤー・送迎ポータル
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
                    placeholder="空港、目的地、温泉、スキー場を検索（例: 羽田、成田、箱根、富士山、白馬）"
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
                <span className="font-bold text-[#0F172A]">人気キーワード:</span>
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

      {/* ── Main Body Container ── */}
      <main className="max-w-[1200px] mx-auto px-3 sm:px-4 mt-3 space-y-6">
        
        {/* ══════════════════════════════════════════════════════════════════════════
            🚨 DUAL CTA BAR:
            • MAIN LEFT: Prominent Flashing Red 'BOOK NOW' Light (links to sk.limo/tours)
            • COMPACT RIGHT: Smaller 'HIRE MITSUMORI' Banner with Gentle Yellow Signal (links to http://hiremitsumori.com)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">
          
          {/* ── 1. MAIN LEFT BOX: Flashing Ruby-Red 'BOOK NOW' Car Taillight Box (8 Cols) ── */}
          <Link
            href="/tours"
            className="md:col-span-8 flashing-booknow-ruby block rounded-lg p-4 sm:p-5 text-white text-center border-3 transition-transform cursor-pointer group shadow-xl relative overflow-hidden active:scale-[0.99]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-black tracking-widest text-[#FFEE00] uppercase">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>公式オンライン即時予約・空車確認</span>
                <Flame className="w-4 h-4 animate-bounce" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-md">
                BOOK NOW
              </h2>

              <div className="bg-black/30 backdrop-blur-xs rounded-md py-1.5 px-3 border border-white/30 max-w-lg mx-auto">
                <span className="block text-xs sm:text-sm font-extrabold text-white">
                  【羽田・成田空港送迎／箱根・富士山観光／白馬スキー送迎】
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#FFEE00] font-bold mt-0.5">
                  全車種アルファード・グランエース・ハイエース完全定額
                </span>
              </div>

              {/* Flashing Ruby Action Button */}
              <div className="flashing-booknow-btn max-w-md mx-auto pt-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-white py-2 rounded-md border border-white/40 group-hover:bg-white/30 transition-colors">
                <span>sk.limo/tours 予約画面へ進む</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </Link>

          {/* ── 2. COMPACT RIGHT BOX: Smaller HIRE MITSUMORI Banner (4 Cols) ── */}
          <a
            href="http://hiremitsumori.com"
            target="_blank"
            rel="noopener noreferrer"
            className="md:col-span-4 flashing-cherry-car-light rounded-lg p-3.5 sm:p-4 text-white flex flex-col justify-between border-2 transition-transform cursor-pointer group shadow-md relative overflow-hidden active:scale-[0.99]"
          >
            <div className="space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wider text-[#FFEE00] uppercase">
                <span className="gentle-yellow-blip w-2.5 h-2.5 rounded-xs border border-amber-300 inline-block shadow-xs" />
                <span>新サイト 料金シミュレーター</span>
                <span className="gentle-yellow-blip w-2.5 h-2.5 rounded-xs border border-amber-300 inline-block shadow-xs" />
              </div>

              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  HIRE MITSUMORI
                </h3>
                <div className="gentle-yellow-blip px-1.5 py-0.2 rounded border border-amber-300 text-black font-black text-[9px]">
                  <span>TURN ➔</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-100 font-medium">
                全国ハイヤー・送迎料金 自動お見積り
              </p>
            </div>

            <div className="mt-2 pt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-black/40 py-1.5 rounded border border-white/20 group-hover:bg-black/60 transition-colors">
              <span>http://hiremitsumori.com を開く</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

        </div>

        {/* ── 3-Column Corporate Portal Feed & Navigation ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

          {/* ═══════════════════════════════════════════════════════
              CENTER COLUMN (5 Cols Desktop, 1st Mobile): News & Topics Feed
          ═══════════════════════════════════════════════════════ */}
          <section className="lg:col-span-5 lg:order-2 space-y-3.5">
            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-2xs overflow-hidden">
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
                  <span className="text-[#64748B]">最終更新: 2026年9月7日 13:30 JST</span>
                  <Link
                    href="/tours"
                    className="text-[#2563EB] font-bold hover:text-[#1D4ED8] hover:underline flex items-center gap-0.5"
                  >
                    <span>全ツアー・送迎一覧 ＞</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN (4 Cols Desktop, 2nd Mobile): Service Directory
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 lg:order-1 space-y-3.5">
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
                      <span>空港送迎（羽田・成田・関空）</span>
                    </span>
                    <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] px-1.5 py-0.2 rounded font-bold">
                      定額制
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
                    href="/services"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[#0F172A] group-hover:text-[#2563EB]">
                      <Car className="w-3.5 h-3.5 text-[#475569]" />
                      <span>保有車両一覧（ハイエース15台）</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN (3 Cols Desktop, 3rd Mobile): Weather & WhatsApp
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 lg:order-3 space-y-3.5">
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
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-center">
                  <span className="text-[#64748B] block text-[10px]">箱根 / 芦ノ湖</span>
                  <span className="font-bold text-xs sm:text-sm text-[#0284C7] block">曇り 22℃</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3.5 text-white space-y-2 text-center shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-extrabold block">
                SK LIMO 24H CONCIERGE
              </span>
              <p className="text-[11px] text-slate-300">
                お見積もり・配車のご相談はお気軽にどうぞ
              </p>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-black py-2 px-3 rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                <span>WhatsApp で今すぐ相談</span>
              </a>
            </div>
          </aside>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            ✨ SK.LIMO COMPREHENSIVE SERVICE CATALOG (すべてのサービス・ご利用シーン)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                SK LIMO SERVICES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
                ハイヤーサービスとは・ご利用シーン一覧
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                全てのお客様にご満足いただけるハイヤーサービス。空港送迎、観光、ビジネス、冠婚葬祭までお客様のご要望に合わせて運行。
              </p>
            </div>
            <Link
              href="/booking"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>今すぐ配車予約</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc) => (
              <div
                key={uc.id}
                className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#FAFAFA] hover:border-[#2563EB] hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={uc.image}
                      alt={uc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#0F172A]/90 text-[#C5A059] text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                      {uc.badge}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {uc.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 pt-0">
                  <Link
                    href={uc.href}
                    className="w-full text-center bg-white hover:bg-[#0F172A] hover:text-white text-[#0F172A] font-bold text-xs py-2 px-3 rounded border border-[#CBD5E1] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>詳細を見る</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            🚗 SK.LIMO VEHICLE FLEET & SPECIFICATIONS (保有車両・ハイエース15台)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                緑ナンバー正規車・全車完全整備
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
                保有車両情報・スペック（ハイエース15台保有）
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                最高峰の快適性を追求したアルファードから、団体・荷物積載に優れたハイエースまで自社保有。
              </p>
            </div>
            {/* Fleet Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['alphard', 'granace', 'hiace', 'crown'] as const).map((carKey) => (
                <button
                  key={carKey}
                  type="button"
                  onClick={() => setSelectedFleet(carKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedFleet === carKey
                      ? 'bg-[#0F172A] text-[#C5A059] shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {carKey === 'alphard'
                    ? 'アルファード'
                    : carKey === 'granace'
                    ? 'グランエース 4WD'
                    : carKey === 'hiace'
                    ? 'ハイエース (15台)'
                    : 'クラウン'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Fleet Photo & Angles */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-[#CBD5E1] shadow-xs">
                <Image
                  src={activeFleetPhoto}
                  alt={currentFleet.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#0F172A]/90 text-[#C5A059] text-xs font-black px-2.5 py-1 rounded shadow-md">
                  {currentFleet.badge}
                </span>
              </div>
              {/* Photo Angle Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFleetView('exterior')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    fleetView === 'exterior'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  外観 (Exterior)
                </button>
                <button
                  type="button"
                  onClick={() => setFleetView('interior')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    fleetView === 'interior'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  車内VIPシート (Interior)
                </button>
                <button
                  type="button"
                  onClick={() => setFleetView('trunk')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    fleetView === 'trunk'
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  荷物積載スペース (Trunk)
                </button>
              </div>
            </div>

            {/* Fleet Specifications Card */}
            <div className="lg:col-span-5 space-y-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">{currentFleet.name}</h3>
                <p className="text-xs text-[#64748B] mt-1.5">{currentFleet.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <span className="text-[10px] text-[#64748B] block">乗車定員</span>
                    <span className="text-xs font-bold text-[#0F172A]">{currentFleet.capacity}</span>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0] flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <span className="text-[10px] text-[#64748B] block">荷物容量</span>
                    <span className="text-xs font-bold text-[#0F172A]">{currentFleet.luggage}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#0F172A] block">主な装備・サービス:</span>
                <ul className="space-y-1 text-xs text-[#475569]">
                  {currentFleet.specs.map((sp) => (
                    <li key={sp} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href="/booking"
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs transition-colors shadow-xs"
                >
                  <span>この車両を指定して予約する</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            ⚽ KASHIWA REYSOL OFFICIAL SUPPORTER BANNER (柏レイソル応援バナー)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-linear-to-r from-[#FFD100] via-[#FFE240] to-[#FFD100] border border-[#E5BC00] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-[#0A0D14]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0A0D14] flex items-center justify-center text-[#FFD100] font-black text-xs border-2 border-white shadow-xs shrink-0">
              REYSOL
            </div>
            <div>
              <span className="text-[11px] font-extrabold bg-[#0A0D14] text-[#FFD100] px-2 py-0.5 rounded">
                OFFICIAL SUPPORTER
              </span>
              <h3 className="text-base sm:text-lg font-black mt-1">
                株式会社SKリモは 柏レイソル（Kashiwa Reysol）を応援しています
              </h3>
              <p className="text-xs font-semibold text-[#333333]">
                プロスポーツチームの公式遠征・選手および関係者の送迎にも信頼される安心の運行品質。
              </p>
            </div>
          </div>
          <a
            href="https://www.reysol.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0A0D14] hover:bg-[#222222] text-[#FFD100] font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <span>柏レイソル公式サイト</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            💳 PRICING & PAYMENT METHODS (料金体系・支払い方法)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
              ALL-INCLUSIVE FIXED RATES
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
              完全定額制料金体系・お支払い方法
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              高速料金・ガソリン代・保険料・消費税込。渋滞による加算金やチップは一切不要です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="font-extrabold text-[#0F172A] block text-sm">完全定額料金の保証</span>
              <p className="text-[#64748B]">
                ご予約時に確定した金額がそのまま最終お支払い金額となります。渋滞やルート迂回による追加メーター課金は一切ございません。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="font-extrabold text-[#0F172A] block text-sm">フライト遅延無料待機</span>
              <p className="text-[#64748B]">
                飛行機の到着遅延をリアルタイム監視。到着時刻がどれだけ遅れても、追加料金なし（¥0）で確実にお出迎えいたします。
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="font-extrabold text-[#0F172A] block text-sm">24時間前までキャンセル無料</span>
              <p className="text-[#64748B]">
                ご乗車の24時間前までであればキャンセル料無料。航空会社の欠航時も柔軟に日程変更・全額返金対応をいたします。
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs font-black text-[#0F172A] block mb-3">
              ご利用可能なお支払い方法:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                'Apple Pay (即時決済)',
                'Google Pay',
                'VISA',
                'Mastercard',
                'American Express',
                'JCB',
                'Diners Club',
                '銀聯 (UnionPay)',
                'WeChat Pay (微信支付)',
                'Alipay (支付宝)',
                'PayPay',
                '法人請求書払い（売掛）',
              ].map((m) => (
                <span
                  key={m}
                  className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B] font-bold px-3 py-1.5 rounded-md"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            ❓ FAQS & COMPANY OVERVIEW (よくあるご質問・会社概要)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* FAQs (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">よくあるご質問 (FAQ)</h2>
              <p className="text-xs text-[#64748B]">ご予約や運行に関してよくいただくご質問です。</p>
            </div>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.q}
                  className="border border-[#E2E8F0] rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] font-bold text-xs sm:text-sm text-[#0F172A] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>Q. {faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-3.5 bg-white text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Company Overview (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#E2E8F0] pb-3 flex items-center gap-3">
              <div className="relative h-8 w-24">
                <Image
                  src="/images/brand-sklimo-official-logo-250x250.png"
                  alt="SK LIMO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#0F172A]">会社概要</h2>
                <span className="text-[10px] text-[#059669] font-bold">国土交通省許可事業者</span>
              </div>
            </div>

            <dl className="text-xs space-y-2.5 divide-y divide-[#F1F5F9]">
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">会社名</dt>
                <dd className="font-extrabold text-[#0F172A]">株式会社SKリモ (SK LIMO Co., Ltd.)</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">事業内容</dt>
                <dd className="font-medium text-[#0F172A]">一般乗用旅客自動車運送事業（ハイヤー）</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">許認可</dt>
                <dd className="font-extrabold text-[#059669]">国土交通省関東運輸局許可 緑ナンバー正規運行</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">保有車両</dt>
                <dd className="font-medium text-[#0F172A]">アルファード、グランエース、ハイエース15台、クラウン</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">運行管理</dt>
                <dd className="font-medium text-[#0F172A]">24時間365日 専任配車デスク</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">公式スポンサー</dt>
                <dd className="font-bold text-[#D97706]">Jリーグ 柏レイソル 公式サポーター</dd>
              </div>
            </dl>

            <div className="pt-3">
              <Link
                href="/contact"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs transition-colors shadow-xs"
              >
                <span>お問い合わせ・法人契約相談</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </Link>
            </div>
          </div>

        </section>

      </main>

      {/* ── Corporate Footer with Official SK Logo ── */}
      <footer className="max-w-[1200px] mx-auto px-4 mt-12 pt-8 border-t border-[#CBD5E1] text-[11px] text-[#64748B] space-y-4 text-center">
        <div className="flex justify-center">
          <div className="relative h-10 w-28">
            <Image
              src="/images/brand-sklimo-official-logo-250x250.png"
              alt="SK LIMO Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[#2563EB] font-medium">
          <Link href="/services" className="hover:underline">会社概要</Link>
          <span>|</span>
          <Link href="/tours/airport-transfer" className="hover:underline">空港送迎運賃表</Link>
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
