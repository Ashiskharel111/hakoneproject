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
  Navigation,
  Info,
  DollarSign,
  Coffee,
  Wifi,
  Baby,
  Smile,
  Shield,
  Map,
  Train,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface YahooJapanHomeViewProps {
  onSwitchToModernView?: () => void;
}

export default function YahooJapanHomeView({ onSwitchToModernView }: YahooJapanHomeViewProps) {
  const [, setLang] = useLanguage();

  React.useEffect(() => {
    setLang('ja');
  }, [setLang]);

  const [activeTab, setActiveTab] = useState<'main' | 'airport' | 'sightseeing' | 'ski' | 'status'>('main');
  const [selectedFleet, setSelectedFleet] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [fleetView, setFleetView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `SK LIMO 日本語配車センターにお問い合わせいたします。`
  )}`;

  const newsData = {
    main: [
      {
        id: 1,
        title: '【公式】2024-2025年 羽田・成田空港〜都内ホテル直行定額ハイヤー予約受付中',
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
        title: '自社グループ27台体制（ハイエース15台・アルファード9台・グランエース3台）で即応',
        tag: '車両',
        date: '9/7(月) 12:15',
        href: '/tours#fleet',
        isHot: true,
      },
      {
        id: 4,
        title: '秋の箱根・芦ノ湖・富士山五合目 1日満喫プライベートチャーター特集',
        tag: '特集',
        date: '9/6(日) 18:00',
        href: '/tours',
      },
      {
        id: 5,
        title: '国土交通省関東運輸局許可 緑ナンバー正規運行・24時間運行管理体制を完備',
        tag: '安心',
        date: '9/6(日) 10:20',
        href: '/tours',
      },
      {
        id: 6,
        title: '関西エリア送迎提携（株式会社トモクルーズ 大阪市港区）ネットワーク強化',
        tag: '提携',
        date: '9/5(土) 09:00',
        href: 'https://tomocruise.jp/',
        isExternal: true,
      },
    ],
    airport: [
      {
        id: 11,
        title: '羽田空港（HND）ミニバン定額 ¥20,000〜（高速通行料込・フライト追跡無料）',
        tag: '羽田',
        date: '9/7(月) 13:00',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 12,
        title: '成田空港（NRT）ミニバン定額 ¥39,000〜（高速通行料込・遅延待機¥0保障）',
        tag: '成田',
        date: '9/7(月) 11:30',
        href: '/tours/airport-transfer',
        isHot: true,
      },
      {
        id: 13,
        title: '到着ゲート専用グリーター手配（羽田¥7,000・成田¥10,000 税関出口お出迎え）',
        tag: 'VIP',
        date: '9/6(日) 15:40',
        href: '/tours/airport-transfer',
      },
      {
        id: 14,
        title: 'ハイエース グランドキャビン（最大9名・スーツケース9個＋ゴルフバッグ9個）団体送迎',
        tag: '大人数',
        date: '9/5(土) 14:10',
        href: '/tours/airport-transfer',
      },
    ],
    sightseeing: [
      {
        id: 21,
        title: '富士山五合目・新倉山浅間公園・忍野八海 貸切チャーター（ミニバン ¥100,000〜 通行料込）',
        tag: '富士山',
        date: '9/7(月) 10:00',
        href: '/destinations/fuji-kawaguchiko',
        isHot: true,
      },
      {
        id: 22,
        title: '箱根温泉・芦ノ湖・大涌谷 1日観光貸切プライベートプラン',
        tag: '箱根',
        date: '9/6(日) 17:20',
        href: '/destinations/hakone-lake-ashi',
      },
      {
        id: 23,
        title: 'ゴルフパック往復送迎（ご自宅〜ゴルフ場〜ご自宅 ミニバン ¥72,000〜）',
        tag: 'ゴルフ',
        date: '9/6(日) 09:50',
        href: '/booking',
      },
      {
        id: 24,
        title: '都内時間制貸切チャーター（ミニバン 2時間 ¥16,930〜）ビジネス・観光に最適',
        tag: '都内',
        date: '9/5(土) 11:30',
        href: '/booking',
      },
    ],
    ski: [
      {
        id: 31,
        title: '白馬バレー（八方尾根・五竜・栂池）空港・都内直行片道ハイヤー ¥90,000〜',
        tag: '白馬',
        date: '9/7(月) 08:30',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 32,
        title: 'グランエース 4WD 雪道仕様（キャプテンシート4座＋スタッドレス完備）',
        tag: '4WD',
        date: '9/6(日) 19:15',
        href: '/tours/winter',
        isHot: true,
      },
      {
        id: 33,
        title: '志賀高原・野沢温泉・妙高・ニセコ スキーバッグ積載完全対応',
        tag: '信州/北海道',
        date: '9/5(土) 16:00',
        href: '/tours/winter',
      },
    ],
    status: [
      {
        id: 41,
        title: '【本日運行状況】首都圏・関越道・中央道・東名 全車正常ダイヤ運行中',
        tag: '運行',
        date: '9/7(月) 15:00',
        href: '/tours',
        isHot: true,
      },
      {
        id: 42,
        title: '羽田・成田フライト発着追跡連動・ドライバー配備状況 良好',
        tag: '空港',
        date: '9/7(月) 14:00',
        href: '/tours/airport-transfer',
      },
      {
        id: 43,
        title: '24時間緊急配車デスク・LINE/WhatsAppコンシェルジュ即時応答受付中',
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
      image: '/images/services/service_hotel_departure.jpg',
      badge: '羽田・成田定額',
      href: '/tours/airport-transfer',
    },
    {
      id: 'uc-2',
      title: '空港〜ご自宅・ホテル（ミートサービス）',
      desc: 'フライト到着時、担当ドライバーが税関出口でお名前ボードを掲げてお出迎え。遅延待機も無料（¥0）で安心。',
      image: '/images/services/service_airport_meet.jpg',
      badge: 'お出迎え無料',
      href: '/tours/airport-transfer',
    },
    {
      id: 'uc-3',
      title: 'ビジネスミーティング・役員送迎',
      desc: '重要な取引先のご送迎、複数拠点の視察や移動、社内役員の定期通勤・会食送迎を上質なプライバシー空間でサポート。',
      image: '/images/services/service_business_meeting.jpg',
      badge: '法人・請求書払い',
      href: '/contact',
    },
    {
      id: 'uc-4',
      title: '観光案内・プライベートツアー',
      desc: '箱根・芦ノ湖、富士山五合目・河口湖、日光東照宮、鎌倉・横浜など、専任ドライバーがお客様専用のスケジュールでご案内。',
      image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
      badge: '完全貸切自由',
      href: '/tours',
    },
    {
      id: 'uc-5',
      title: '冬季スキートランスファー',
      desc: '白馬バレー、ニセコ、志賀高原、野沢温泉へ直行。グランエース4WD雪道仕様＆ハイエースでスキー板・スノーボードを楽々積載。',
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      badge: '4WD雪道完備',
      href: '/tours/winter',
    },
    {
      id: 'uc-6',
      title: '冠婚葬祭・式場送迎',
      desc: '結婚式、ご法要、各種記念式典など、大切なご家族やご親族様を目的地まで礼儀正しい専任ドライバーが安全・丁寧にお送りいたします。',
      image: '/images/services/service_ceremonial.jpg',
      badge: '礼儀・マナー徹底',
      href: '/contact',
    },
    {
      id: 'uc-7',
      title: '区間送迎（個人様・一般企業様向け）',
      desc: '都内各所、ゴルフ場、病院通院、レストラン送迎など、短距離から長距離まで用途に合わせてフレキシブルに配車可能。',
      image: '/images/services/service_point_to_point.jpg',
      badge: 'ドア・ツー・ドア',
      href: '/booking',
    },
    {
      id: 'uc-8',
      title: 'イベント・MICE送迎（旅行会社様向け）',
      desc: '国際会議、展示会、修学旅行、インバウンド団体ツアーに。保有する15台のハイエースで大人数のスムーズな輸送を実現。',
      image: '/images/services/service_mice_event.jpg',
      badge: 'ハイエース15台',
      href: '/contact',
    },
  ];

  const everydayUseCases = [
    '子供の送り迎えがどうしても出来ない日があって困っている',
    '友人とレンタカーを借りたいけど運転に自信がない',
    '日帰りの旅行先でもお酒を楽しみたいし、帰りはゆっくり眠りたい',
    'ペットと旅行に行きたいけど、自分で運転はしたくない',
    'タクシー1台では乗り切れない人数や荷物がある（ハイエースなら最大9名・荷物9個対応）',
    '記念日のサプライズ演出の為に上質な車を使いたい',
    '年末年始の挨拶まわりや、日頃の営業活動で1日に数十件の取引先を訪問したい',
    '忘年会、納涼会（屋形船）の際に大人数の移動がある',
    '早朝空港に行かなくてはならないが、タクシーの予約を断られた',
    '大型バスで移動したいが予約が取れない・小回りが利かない',
  ];

  const fleetDetails = {
    alphard: {
      name: 'トヨタ アルファード エグゼクティブラウンジ',
      count: '9台自社保有',
      badge: 'PREMIUM VIP MPV (9台)',
      capacity: '定員6名様（推奨: 5名様）',
      luggage: 'スーツケース 4個',
      golf: 'ゴルフバッグ 4個',
      desc: '電動オットマン付き独立VIPキャプテンシート、シートベンチレーション/ヒーター、極上の静粛性を誇る高級ミニバン。ビジネス役員送迎やご家族観光に最適。',
      exterior: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      interior: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      specs: [
        '保有台数: 9台体制',
        '全席本革VIPキャプテンシート',
        '電動オットマン・リクライニング機能',
        '読書灯・USB/AC急速充電ポート',
        'Wi-Fi・ミネラルウォーター無料提供',
      ],
    },
    granace: {
      name: 'トヨタ グランエース 4WD VIPラウンジ',
      count: '3台自社保有',
      badge: 'ULTRA LUXURY 4WD (3台)',
      capacity: '定員5名様（推奨: 4名様）',
      luggage: 'スーツケース 5個',
      golf: 'ゴルフバッグ 5個',
      desc: '堂々たるフルサイズボディに本格4WDを搭載。2列目・3列目ともに独立キャプテンシートを備え、冬季雪道（白馬・ニセコ）や長距離観光でも圧倒的な快適性と走破性を誇ります。',
      exterior: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      interior: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
      specs: [
        '保有台数: 3台体制',
        '4WD四輪駆動（雪道・悪路走破性抜群）',
        '独立4座席プレミアムVIPシート',
        '広大なレッグスペース＆荷物室',
        '冬用スタッドレスタイヤ完全装備',
      ],
    },
    hiace: {
      name: 'ハイエース グランドキャビン（自社15台保有）',
      count: '15台自社保有',
      badge: 'MAX CAPACITY (15台)',
      capacity: '定員9名様（推奨: 8名様）',
      luggage: 'スーツケース 9個',
      golf: 'ゴルフバッグ 9個',
      desc: '最大9名様のご乗車と、9個の大型スーツケースまたはゴルフバッグ・スキー板を楽々飲み込むハイルーフワイドボディ。大人数グループやMICEイベントに15台体制で即応。',
      exterior: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      interior: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
      trunk: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
      specs: [
        '保有台数: 15台の圧倒的保有体制',
        '最大9名乗車（推奨8名）',
        '大型スーツケース9個・ゴルフバッグ9個積載',
        'ハイルーフによる広々とした開放キャビン',
        '複数台口・大規模イベント同時配車対応',
      ],
    },
  };

  const officialTariff = [
    {
      category: '羽田空港定額送迎',
      route: '羽田空港（HND）〜 東京都内23区',
      price: 'ミニバン 20,000円〜',
      notes: '高速道路通行料込。※到着ゲートでの出迎えを専門業者に依頼した場合、別途7,000円(税込)',
      badge: '羽田定額',
    },
    {
      category: '成田空港定額送迎',
      route: '成田空港（NRT）〜 東京都内23区',
      price: 'ミニバン 39,000円〜',
      notes: '高速道路通行料込。※到着ゲートでの出迎えを専門業者に依頼した場合、別途10,000円(税込)',
      badge: '成田定額',
    },
    {
      category: '都内時間制貸切',
      route: '東京都内23区・近郊（ビジネス・視察・観光）',
      price: 'ミニバン 2時間 16,930円〜',
      notes: '※通行料、駐車場代等の実費は別料金となります',
      badge: '時間制',
    },
    {
      category: 'ゴルフパック送迎',
      route: 'ご自宅 〜 ゴルフ場 〜 ご自宅（往復送迎・待機含）',
      price: 'ミニバン 72,000円〜',
      notes: '※通行料の実費は別料金となります',
      badge: 'ゴルフ',
    },
    {
      category: '観光貸切（富士山・箱根）',
      route: '都内発 〜 富士山・河口湖 または 箱根・芦ノ湖 1日周遊',
      price: 'ミニバン 100,000円〜',
      notes: '高速道路通行料込。※駐車場代、その他実費は別料金となります',
      badge: '1日観光',
    },
    {
      category: '片道区間送迎（箱根）',
      route: '都内 〜 箱根温泉エリア（片道直行）',
      price: '40,000円〜',
      notes: '片道だけの移動手段を確保したいお客様向け',
      badge: '片道',
    },
    {
      category: '片道区間送迎（河口湖）',
      route: '都内 〜 富士山・河口湖エリア（片道直行）',
      price: '50,000円〜',
      notes: '片道だけの移動手段を確保したいお客様向け',
      badge: '片道',
    },
    {
      category: '片道区間送迎（白馬）',
      route: '都内・空港 〜 長野県白馬バレー（片道直行）',
      price: '90,000円〜',
      notes: 'スキーバッグ・スノーボード積載対応',
      badge: 'スキー片道',
    },
  ];

  const faqs = [
    {
      q: '空港でのお迎え（ミートサービス）はどのように行われますか？',
      a: '担当ドライバーが便名をリアルタイム追跡し、税関出口でお名前ボードを掲げてお出迎えいたします。到着口から専用車両までお荷物をお運びし、スムーズにご案内いたします。フライトが遅延した場合でも待機料金は無料（¥0）です。専門業者による到着ゲート内アテンドをご希望の場合は羽田別途7,000円、成田別途10,000円にて承ります。',
    },
    {
      q: '料金は完全定額制ですか？高速料金やガソリン代は含まれますか？',
      a: 'はい、空港定額送迎や観光貸切プランには高速道路通行料、ガソリン代、車両保険料、消費税が含まれております。渋滞や深夜早朝によるメーター加算などの不透明な追加請求は一切ございません（都内時間制貸切やゴルフパックの高速代・駐車場代実費を除く）。',
    },
    {
      q: '利用可能な支払い方法には何がありますか？法人請求書払いはできますか？',
      a: 'クレジットカード（Visa、Mastercard、American Express、JCB、Diners、銀聯）、Apple Pay（ワンクリック即時決済）、Google Pay、WeChat Pay（微信支付）、Alipay（支付宝）、PayPayに対応しております。法人企業様向けの後日請求書払い・売掛契約も承っております。',
    },
    {
      q: '予約のキャンセル料やポリシーはどうなっていますか？',
      a: '3日前まではキャンセル料なし（無料）、2日前は30%、前日17時までは50%、前日17時以降は100%を申し受けます。航空会社の都合による欠航・遅延の場合は柔軟に無料変更対応をいたします。',
    },
    {
      q: '保有車両は日本の法律に基づく正規の緑ナンバー（営業車）ですか？',
      a: 'はい。当社の全車両（アルファード9台・グランエース3台・ハイエース15台）は、国土交通省関東運輸局の認可を受けた「緑ナンバー（営業用登録車）」であり、無許可の白タク等は一切ございません。万全の搭乗者傷害保険を完備しております。',
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
              国土交通省関東運輸局許可 緑ナンバー正規運行・自社グループ27台（ハイエース15台・アルファード9台・グランエース3台）
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
            <a
              href="https://sklimo-recruit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-white hover:underline hidden md:inline"
            >
              採用情報
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/tours"
              className="bg-[#2563EB] text-white px-2.5 py-0.5 rounded text-[11px] font-black hover:bg-[#1D4ED8] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              title="Global English & Multilingual Tours"
            >
              <span>🌐 Global View (sk.limo/tours)</span>
            </Link>
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

            {/* Clean Corporate Navigation Badges (Replaces removed search form) */}
            <nav className="flex items-center flex-wrap justify-center gap-2 text-xs font-bold">
              <Link
                href="/tours/airport-transfer"
                className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors flex items-center gap-1.5"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>空港定額送迎</span>
              </Link>
              <Link
                href="/tours"
                className="px-3 py-1.5 rounded-lg bg-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A] transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>観光チャーター</span>
              </Link>
              <Link
                href="/tours/winter"
                className="px-3 py-1.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD] transition-colors flex items-center gap-1.5"
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>冬季スキー</span>
              </Link>
              <Link
                href="/tours#fleet"
                className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors flex items-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5" />
                <span>保有車両27台</span>
              </Link>
              <a
                href="http://hiremitsumori.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#1C2365] text-[#DCBF5C] hover:bg-[#252E7A] transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>ハイヤー見積もり.com</span>
                <ExternalLink className="w-3 h-3 text-[#22A7F0]" />
              </a>
            </nav>

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

      {/* ── Main Body Container (Compact, cohesive spacing) ── */}
      <main className="max-w-[1200px] mx-auto px-3 sm:px-4 mt-3 space-y-4">
        
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

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">最終更新: 2026年9月9日 14:00 JST</span>
                  <Link
                    href="/tours"
                    className="text-[#2563EB] font-bold hover:text-[#1D4ED8] hover:underline flex items-center gap-0.5"
                  >
                    <span>全ツアー・送迎一覧 ＞</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Fare Matrix & Fleet Dispatch Status Card (Fills Middle Column Height) */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-2xs p-3.5 space-y-2.5">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>主要ルート定額運賃早見表 &amp; 運行状況</span>
                </div>
                <span className="text-[10px] text-[#059669] font-bold bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                  全路線 正常運行
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex justify-between items-center">
                  <span className="text-[#475569] font-bold">富士山・河口湖 (10h)</span>
                  <span className="text-[#D97706] font-mono font-black">¥100,000〜</span>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex justify-between items-center">
                  <span className="text-[#475569] font-bold">箱根温泉・芦ノ湖 (9h)</span>
                  <span className="text-[#D97706] font-mono font-black">¥90,000〜</span>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex justify-between items-center">
                  <span className="text-[#475569] font-bold">鎌倉・江の島 (8h)</span>
                  <span className="text-[#D97706] font-mono font-black">¥80,000〜</span>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex justify-between items-center">
                  <span className="text-[#475569] font-bold">日光東照宮 (10h)</span>
                  <span className="text-[#D97706] font-mono font-black">¥100,000〜</span>
                </div>
              </div>
              <p className="text-[10px] text-[#64748B] flex items-center justify-between pt-0.5">
                <span>※高速代・燃料代込。3時間送迎は距離ベース（他県への送迎はWhatsAppより受付）</span>
                <Link href="/tours" className="text-[#2563EB] font-bold hover:underline">
                  詳細を見る ＞
                </Link>
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN (4 Cols Desktop, 2nd Mobile): Service Directory & Fleet Overview
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
                      <span>空港送迎（羽田 ¥20,000〜 / 成田 ¥39,000〜）</span>
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
                      <span>箱根・芦ノ湖 貸切観光 / 片道 ¥40,000〜</span>
                    </span>
                    <span className="text-[10px] text-[#D97706] font-bold">人気</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/fuji-kawaguchiko"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                      <span>富士山・河口湖周遊 / 片道 ¥50,000〜</span>
                    </span>
                    <span className="text-[10px] text-[#059669] font-bold">No.1</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/winter"
                    className="p-2.5 flex items-center justify-between hover:bg-[#F8FAFC] group transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                      <Snowflake className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>白馬・ニセコ スキー送迎 (4WD仕様)</span>
                    </span>
                    <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] px-1.5 py-0.2 rounded font-bold">
                      片道 ¥90,000〜
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Fleet Status & Corporate B2B Quick Card (Fills Left Column Height) */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-2xs p-3.5 space-y-2">
              <div className="border-b border-[#E2E8F0] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Car className="w-3.5 h-3.5 text-[#059669]" />
                  <span>自社保有フリート体制（27台）</span>
                </div>
                <span className="text-[10px] text-[#059669] font-bold">緑ナンバー</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-[#475569]">
                <div className="flex justify-between items-center bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0]">
                  <span className="font-bold text-[#0F172A]">ハイエース グランドキャビン</span>
                  <span className="font-mono font-bold text-[#2563EB]">15台 (1-9名)</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0]">
                  <span className="font-bold text-[#0F172A]">アルファード Executive Lounge</span>
                  <span className="font-mono font-bold text-[#2563EB]">9台 (1-4名)</span>
                </div>
                <div className="flex justify-between items-center bg-[#F8FAFC] px-2 py-1 rounded border border-[#E2E8F0]">
                  <span className="font-bold text-[#0F172A]">グランエース VIP 4WD Lounge</span>
                  <span className="font-mono font-bold text-[#2563EB]">3台 (1-5名)</span>
                </div>
              </div>
              <div className="pt-1 border-t border-[#E2E8F0] flex items-center justify-between text-[10.5px]">
                <span className="text-[#64748B]">全車禁煙・除菌・搭乗者傷害保険完備</span>
                <Link href="/tours#fleet" className="text-[#2563EB] font-bold hover:underline">
                  車両詳細 ＞
                </Link>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN (3 Cols Desktop, 3rd Mobile):
              1. Flashing Ruby BOOK NOW CTA (sk.limo/tours)
              2. Hire Mitsumori (hiremitsumori.com brand blue #1C2365)
              3. Weather Monitor
              4. WhatsApp / LINE Concierge
          ═══════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 lg:order-3 space-y-3.5">
            
            {/* 1. FLASHING RUBY BOOK NOW CTA (Above Hire Mitsumori) */}
            <Link
              href="/tours"
              className="w-full flashing-booknow-ruby block rounded-lg p-3 sm:p-3.5 text-white text-center border-2 transition-transform cursor-pointer group shadow-md relative overflow-hidden active:scale-[0.99]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1 text-[10px] font-black tracking-widest text-[#FFEE00] uppercase">
                  <Flame className="w-3.5 h-3.5 animate-bounce" />
                  <span>公式オンライン即時予約</span>
                  <Flame className="w-3.5 h-3.5 animate-bounce" />
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md leading-none">
                    BOOK NOW
                  </h3>
                  <span className="text-[10px] font-extrabold text-[#FFEE00] uppercase bg-black/40 px-1.5 py-0.5 rounded border border-white/30">
                    即時配車
                  </span>
                </div>

                <p className="text-[11px] text-white/95 font-bold leading-tight">
                  羽田・成田／富士山・箱根／白馬スキー送迎
                </p>

                {/* Action Button Badge */}
                <div className="flashing-booknow-btn w-full mx-auto mt-1 flex items-center justify-center gap-1.5 text-xs font-black text-white py-1.5 rounded-md border border-white/40 group-hover:bg-white/30 transition-colors shadow-xs">
                  <span>sk.limo/tours 予約画面へ進む</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </Link>

            {/* 2. HIRE MITSUMORI CARD (Above Weather, matching size & hiremitsumori.com #1C2365 blue) */}
            <div className="bg-[#1C2365] border border-[#2B358F] rounded-lg p-3 sm:p-3.5 text-white space-y-2 text-center shadow-md relative overflow-hidden group">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-wider text-[#DCBF5C] uppercase">
                <span className="w-2 h-2 rounded-xs bg-[#22A7F0] inline-block shadow-xs animate-pulse" />
                <span>自動料金シミュレーター</span>
                <span className="w-2 h-2 rounded-xs bg-[#22A7F0] inline-block shadow-xs animate-pulse" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center justify-center gap-1.5">
                  <span>HIRE MITSUMORI</span>
                  <span className="bg-[#22A7F0] text-[#0A1033] text-[9px] font-black px-1.5 py-0.2 rounded-xs">
                    WEB
                  </span>
                </h3>
                <p className="text-[11px] text-slate-200 mt-0.5 leading-snug font-medium">
                  全国ハイヤー・送迎料金 自動お見積もり
                </p>
              </div>

              <a
                href="http://hiremitsumori.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#22A7F0] hover:bg-[#1E96D9] text-[#0A1033] font-black py-2 px-3 rounded-md text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <span>hiremitsumori.com を開く</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0A1033] stroke-[2.5]" />
              </a>
            </div>

            {/* 2. Weather Monitor Card */}
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

            {/* 3. WhatsApp / LINE Concierge Card */}
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
            📌 DETAILED SERVICE REQUEST CAPABILITIES (こんな事を御依頼頂けます)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                TAILORED CONCIERGE OPTIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
                こんな事を御依頼頂けます（無料アメニティ＆特別リクエスト対応）
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                お客様の用途やゲスト様のご都合に合わせ、細やかな配慮と柔軟な運行体制をご提供いたします。
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs self-start sm:self-auto"
            >
              <span>無料相談・お見積もり</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </Link>
          </div>

          {/* ✈️ Highlighted Flight Monitoring & Delay Protection Guarantee Banner */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-[#C5A059]/50 rounded-xl p-4 sm:p-5 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center shrink-0">
                  <Plane className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#2563EB] text-white px-2 py-0.5 rounded">
                      FLIGHT DELAY PROTECTION
                    </span>
                    <span className="text-xs font-black text-[#86EFAC] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      遅延追加料金 ¥0 完全無料保証
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    フライト常時モニタリング＆遅延料金¥0完全無料保証
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    航空機の到着時刻をリアルタイム追跡し、実際の着陸時間に合わせて配車を調整するため、<strong className="text-white underline decoration-[#C5A059] decoration-2">空港での無駄な待機が発生しない限り、フライト遅延による追加料金は一切いただきません（¥0完全無料）</strong>。
                  </p>
                </div>
              </div>
              <Link
                href="/tours/airport-transfer"
                className="bg-[#C5A059] hover:bg-[#b08d48] text-[#0A0D14] font-black text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-sm self-start sm:self-auto"
              >
                <span>空港送迎プラン詳細</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Amenities Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs">
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded border border-[#E2E8F0]">
              <Coffee className="w-4 h-4 text-[#059669]" />
              <span className="font-bold text-[#0F172A]">水とおしぼり</span>
              <span className="text-[10px] text-[#059669] font-bold">全車無料常備</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded border border-[#E2E8F0]">
              <Wifi className="w-4 h-4 text-[#2563EB]" />
              <span className="font-bold text-[#0F172A]">車内Wi-Fi</span>
              <span className="text-[10px] text-[#2563EB] font-bold">無料利用可能</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded border border-[#E2E8F0]">
              <Baby className="w-4 h-4 text-[#D97706]" />
              <span className="font-bold text-[#0F172A]">チャイルドシート</span>
              <span className="text-[10px] text-[#D97706] font-bold">無料手配</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-white rounded border border-[#E2E8F0]">
              <Smile className="w-4 h-4 text-[#7C3AED]" />
              <span className="font-bold text-[#0F172A]">乗車用踏み台ステップ</span>
              <span className="text-[10px] text-[#7C3AED] font-bold">無料サポート</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center gap-1 p-2 bg-[#F0FDF4] rounded border border-[#86EFAC]">
              <Clock className="w-4 h-4 text-[#16A34A]" />
              <span className="font-bold text-[#0F172A]">フライト常時監視</span>
              <span className="text-[10px] text-[#16A34A] font-bold">遅延待機¥0無料</span>
            </div>
          </div>

          {/* 5 Full Concierge Category Cards with Direct Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. 空港送迎 */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                    羽田・成田・地方空港
                  </span>
                  <Plane className="w-4 h-4 text-[#2563EB]" />
                </div>
                <h3 className="font-black text-sm text-[#0F172A]">
                  空港ハイヤー定額送迎（フライト常時監視）
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  便名をリアルタイム監視し、着陸に合わせて配車。空港待機がない限り遅延料金は一切いただきません。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">フライト遅延追加料金¥0完全無料保証</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">税関出口でネームボードお出迎え（ミートサービス）</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">前日までにドライバー名・携帯・車両番号を事前通知</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/tours/airport-transfer"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>空港送迎プランを見る</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>

            {/* 2. ビジネス役員送迎 */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
                    役員送迎・VIPアテンド
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                </div>
                <h3 className="font-black text-sm text-[#0F172A]">
                  ビジネスミーティング・役員専属送迎
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  守秘義務を徹底したプロドライバーによる静粛な移動環境。複数拠点視察から会食待機まで対応。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">行程表事前下調べ・最短かつ最善ルート選定</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">連日利用での同一車両・同一ドライバー帯同手配</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">法人様向け月締め一括請求書払い・売掛対応</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/contact?service=business"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>ビジネス送迎を相談する</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>

            {/* 3. 観光案内・プライベートツアー */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded">
                    観光貸切・ゴルフ送迎
                  </span>
                  <MapPin className="w-4 h-4 text-[#D97706]" />
                </div>
                <h3 className="font-black text-sm text-[#0F172A]">
                  観光案内・プライベートツアー・ゴルフ
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  富士山、箱根、日光、鎌倉など完全自由設計。早朝ゴルフパックや全国1週間帯同周遊も承ります。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">お好みのスポットを自由に巡るオーダーメイド行程</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">早朝お迎え〜ゴルフ場〜プレー中待機〜お帰りパック</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">全国周遊帯同（東京〜富士山〜金沢〜京都〜大阪）</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/tours"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>観光プラン一覧を見る</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>

            {/* 4. 冠婚葬祭・式場送迎 */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded">
                    式場送迎・礼節運行
                  </span>
                  <Smile className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <h3 className="font-black text-sm text-[#0F172A]">
                  冠婚葬祭・式場送迎・ご親族様アテンド
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  結婚式、ご法要、式典でのご親族様・参列者様の送迎。ドアサービスと滑らかな運転でおもてなし。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">ご自宅〜式場〜お帰りの安心ドアツードア送迎</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">ゲストに支払いをさせない完全事前精算・請求書対応</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">ご高齢の方やお子様に配慮した丁寧な運転と乗降ステップ</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/contact?service=ceremony"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>冠婚葬祭プランを相談する</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>

            {/* 5. 区間定額・MICEイベント送迎 */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#F0F9FF] px-2 py-0.5 rounded">
                    区間定額・大量配車統括
                  </span>
                  <Car className="w-4 h-4 text-[#0284C7]" />
                </div>
                <h3 className="font-black text-sm text-[#0F172A]">
                  区間定額送迎・MICEイベント配車統括
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  箱根・河口湖・白馬などの片道定額直行から、国際会議や音楽フェスの数十台一括配車統括まで。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-[#334155]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">箱根 ¥40,000〜 / 河口湖 ¥50,000〜 / 白馬 ¥90,000〜</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">国際会議・MICE・ブランドイベントの配車一括管理</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-[11px]">駅と物流拠点・オフィスを結ぶ定期シャトル運行</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/booking"
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>定額送迎・オンライン予約</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>

            {/* 6. 24時間コンシェルジュ相談窓口 */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between space-y-3 text-white">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                    24H CONCIERGE DESK
                  </span>
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                </div>
                <h3 className="font-black text-sm text-white">
                  オーダーメイド・旅程作成・特別相談
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  複数日周遊、要人警護帯同、特殊荷物積載など、Web上にないご要望も専任コンシェルジュが即座にご提案します。
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC] shrink-0 mt-0.5" />
                    <span className="text-[11px]">日本語・英語の専任スタッフが迅速にお返事</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC] shrink-0 mt-0.5" />
                    <span className="text-[11px]">ご予算や行程に合わせたお見積もりを即日作成</span>
                  </li>
                </ul>
              </div>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-black text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-[#0A0D14]" />
                <span>WhatsApp で今すぐ相談</span>
              </a>
            </div>
          </div>
        </section>

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
                運転手付きの貸し切り乗用車で、要人やエグゼクティブ向けの上質な交通手段。国内役員送迎から海外インバウンド観光まで幅広く対応。
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

          {/* Everyday scenarios banner */}
          <div className="mt-4 p-4 rounded-xl bg-linear-to-br from-[#F8FAFC] to-[#EFF6FF] border border-[#CBD5E1]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-black text-[#0F172A]">
                ハイヤーはエグゼクティブだけのものではありません！
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155]">
              {everydayUseCases.map((useText, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span>{useText}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            🚗 SK.LIMO VEHICLE FLEET & SPECIFICATIONS (保有車両・27台自社保有体制)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                緑ナンバー正規車・全27台完全整備
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
                保有車両情報・スペック（ハイエース15台・アルファード9台・グランエース3台）
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                最高峰の快適性を誇るアルファードから、4WDグランエース、団体・荷物積載に優れたハイエースまで自社27台体制。
              </p>
            </div>
            {/* Fleet Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['alphard', 'granace', 'hiace'] as const).map((carKey) => (
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
                    ? 'アルファード (9台)'
                    : carKey === 'granace'
                    ? 'グランエース 4WD (3台)'
                    : 'ハイエース (15台)'}
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
                  荷物・ゴルフ積載 (Trunk)
                </button>
              </div>
            </div>

            {/* Fleet Specifications Card */}
            <div className="lg:col-span-5 space-y-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#0F172A]">{currentFleet.name}</h3>
                </div>
                <p className="text-xs text-[#64748B] mt-1.5">{currentFleet.desc}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  <Users className="w-3.5 h-3.5 text-[#2563EB] mx-auto mb-1" />
                  <span className="text-[10px] text-[#64748B] block">定員</span>
                  <span className="text-xs font-bold text-[#0F172A]">{currentFleet.capacity}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  <Luggage className="w-3.5 h-3.5 text-[#D97706] mx-auto mb-1" />
                  <span className="text-[10px] text-[#64748B] block">スーツケース</span>
                  <span className="text-xs font-bold text-[#0F172A]">{currentFleet.luggage}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  <Award className="w-3.5 h-3.5 text-[#059669] mx-auto mb-1" />
                  <span className="text-[10px] text-[#64748B] block">ゴルフバッグ</span>
                  <span className="text-xs font-bold text-[#0F172A]">{currentFleet.golf}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#0F172A] block">主な装備・特徴:</span>
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

          {/* Hiace 15 cars special reason */}
          <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <h4 className="font-extrabold text-xs text-[#0F172A]">【当社のハイエースが選ばれる理由】</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#475569]">
              <div>
                <span className="font-bold text-[#0F172A]">・豊富な車両数（15台保有）:</span> 急なご依頼や複数台同時の配車にも迅速かつ確実に対応。
              </div>
              <div>
                <span className="font-bold text-[#0F172A]">・多様なニーズに対応:</span> 研修・MICEイベント・修学旅行・インバウンド団体まで柔軟に運行。
              </div>
              <div>
                <span className="font-bold text-[#0F172A]">・快適な車内空間:</span> 長距離移動でも疲れにくいゆとりのある座席と充実した設備。
              </div>
              <div>
                <span className="font-bold text-[#0F172A]">・経験豊富なプロドライバー:</span> 安全運転と細やかな気配りを徹底。
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            💳 OFFICIAL TARIFF & PRICING TABLE (料金体系・定額運賃表)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
                OFFICIAL ALL-INCLUSIVE RATES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1.5">
                料金体系・公式定額運賃表
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                空港送迎や観光貸切は高速料金・ガソリン代・保険料・消費税を含んだ完全定額制。渋滞による加算金やチップは一切不要です。
              </p>
            </div>
            <a
              href="http://hiremitsumori.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>料金シミュレーターを開く</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Rate table grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {officialTariff.map((rate, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#FAFAFA] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] bg-[#0F172A] text-[#C5A059] px-2 py-0.5 rounded font-extrabold">
                      {rate.badge}
                    </span>
                    <span className="text-base font-black text-[#2563EB]">{rate.price}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">{rate.category}</h3>
                  <p className="text-xs font-medium text-[#475569] mt-0.5">{rate.route}</p>
                  <p className="text-[11px] text-[#64748B] mt-1.5">{rate.notes}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex justify-end">
                  <Link
                    href="/booking"
                    className="text-xs font-bold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-1"
                  >
                    <span>予約・見積もり ＞</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Cancellation Policy Banner */}
          <div className="p-4 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
              <h4 className="font-bold text-xs text-[#991B1B]">公式キャンセルポリシー</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#7F1D1D] pt-1">
              <div className="bg-white/80 p-2 rounded border border-[#FECACA]">
                <span className="block font-bold">3日前まで</span>
                <span className="font-black text-sm text-[#059669]">無料（¥0）</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-[#FECACA]">
                <span className="block font-bold">2日前</span>
                <span className="font-black text-sm text-[#D97706]">30%</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-[#FECACA]">
                <span className="block font-bold">前日17時まで</span>
                <span className="font-black text-sm text-[#DC2626]">50%</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-[#FECACA]">
                <span className="block font-bold">前日17時以降</span>
                <span className="font-black text-sm text-[#DC2626]">100%</span>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs font-black text-[#0F172A] block mb-2.5">
              ご利用可能なお支払い方法（個人即時決済・法人売掛）:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                'Apple Pay (ワンクリック即時決済)',
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
                '法人請求書払い（月締め売掛契約）',
              ].map((m) => (
                <span
                  key={m}
                  className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B] font-bold px-3 py-1.5 rounded-md text-[11.5px]"
                >
                  {m}
                </span>
              ))}
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
            🏢 CORPORATE PARTNER HUBS & DISPATCH NETWORK (東京本社・関西エリア送迎)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-extrabold text-sm text-[#0F172A]">東京本社・配車センター（株式会社AIRME）</h3>
            </div>
            <p className="text-xs text-[#475569]">
              首都圏・成田空港・羽田空港・箱根・富士山エリアのハイヤー運行および配車統括を行っております。
            </p>
            <div className="text-xs text-[#64748B] space-y-0.5 pt-1">
              <p>所在地：〒135-0051 東京都江東区枝川1-15-9-226</p>
              <p>電話番号：050-8882-0642</p>
              <p>
                WEB：
                <a href="https://airme.jp/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-bold">
                  https://airme.jp/
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#059669]" />
              <h3 className="font-extrabold text-sm text-[#0F172A]">関西エリア送迎提携（株式会社トモクルーズ）</h3>
            </div>
            <p className="text-xs text-[#475569]">
              関西国際空港（KIX）・伊丹空港・大阪市内・京都・神戸エリアのハイヤー送迎ネットワークを完備。
            </p>
            <div className="text-xs text-[#64748B] space-y-0.5 pt-1">
              <p>所在地：〒552-0001 大阪府大阪市港区波除4-2-27 小野ビル3F</p>
              <p>電話番号：06-6626-9564</p>
              <p>
                WEB：
                <a href="https://tomocruise.jp/" target="_blank" rel="noopener noreferrer" className="text-[#059669] hover:underline font-bold">
                  https://tomocruise.jp/
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            🧭 YAHOO-STYLE UTILITY & STATION/AIRPORT GUIDE (お役立ち・空港駅構内リンク集)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-[#CBD5E1] rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                お役立ち情報・空港＆主要駅フロアガイド
              </h2>
            </div>
            <span className="text-xs text-[#64748B]">リアルタイム交通リンク</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Airport flight info */}
            <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A] border-b border-[#CBD5E1] pb-1">
                <Plane className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>空港フライト・到着便情報</span>
              </div>
              <ul className="space-y-1.5 text-[#475569]">
                <li>
                  <a href="https://tokyo-haneda.com/flight/flightInfo_dms.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>羽田空港 国内線（第1・第2）到着便</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://tokyo-haneda.com/flight/flightInfo_int.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>羽田空港 国際線（第3）到着便</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.narita-airport.jp/ja/flight/arr-search/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>成田空港 国内・国際線 本日到着便</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Airport floor maps */}
            <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A] border-b border-[#CBD5E1] pb-1">
                <Map className="w-3.5 h-3.5 text-[#059669]" />
                <span>空港到着ロビー フロアマップ</span>
              </div>
              <ul className="space-y-1.5 text-[#475569]">
                <li>
                  <a href="https://tokyo-haneda.com/floor/terminal1/1st_floor.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>羽田第1ターミナル 到着ロビー(1F)</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://tokyo-haneda.com/floor/terminal2/1st_floor.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>羽田第2ターミナル 到着ロビー(1F/2F)</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://tokyo-haneda.com/floor/terminal3/2nd_floor.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>羽田第3ターミナル 到着ロビー(2F)</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.narita-airport.jp/jp/map?terminal=1&map=2" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>成田第1 / 第2ターミナル フロアマップ</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Stations & Routes */}
            <div className="space-y-2 bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A] border-b border-[#CBD5E1] pb-1">
                <Train className="w-3.5 h-3.5 text-[#D97706]" />
                <span>東京駅・品川駅・所要時間検索</span>
              </div>
              <ul className="space-y-1.5 text-[#475569]">
                <li>
                  <a href="https://www.navitime.co.jp/drive/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>NAVITIME 自動車ルート・所要時間検索</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.jreast.co.jp/estation/stations/1039.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>東京駅 構内図（新幹線乗り場・八重洲口）</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.jreast.co.jp/estation/stations/788.html" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>品川駅 構内図（タクシー乗り場・新幹線）</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://tenki.jp/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline flex items-center gap-1">
                    <span>日本気象協会 tenki.jp / 天気・台風情報</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              </ul>
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
                <dd className="font-medium text-[#0F172A]">自社27台（ハイエース15台・アルファード9台・グランエース3台）</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">運行管理</dt>
                <dd className="font-medium text-[#0F172A]">24時間365日 専任配車デスク</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-[#64748B] font-bold">採用情報</dt>
                <dd>
                  <a href="https://sklimo-recruit.com/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-bold">
                    sklimo-recruit.com ＞
                  </a>
                </dd>
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
          <Link href="/contact" className="hover:underline">会社概要・お問い合わせ</Link>
          <span>|</span>
          <Link href="/tours/airport-transfer" className="hover:underline">空港送迎運賃表</Link>
          <span>|</span>
          <Link href="/destinations" className="hover:underline">観光チャーター約款</Link>
          <span>|</span>
          <Link href="/tours" className="hover:underline">特定商取引法に基づく表記</Link>
          <span>|</span>
          <Link href="/contact" className="hover:underline">プライバシーポリシー</Link>
          <span>|</span>
          <a href="https://sklimo-recruit.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">求人情報</a>
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
