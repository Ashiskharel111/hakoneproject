'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plane,
  Compass,
  Snowflake,
  Car,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  Briefcase,
  Check
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RouteDistanceVisualizer from '@/components/RouteDistanceVisualizer';
import { useLanguage } from '@/context/LanguageContext';

export default function ExplorePage() {
  const [lang] = useLanguage();
  const router = useRouter();

  // Floating Quick Quote State (RydAgent inspired)
  const [fromLocation, setFromLocation] = useState('hnd');
  const [toLocation, setToLocation] = useState('Tokyo Hotels');
  const [serviceCategory, setServiceCategory] = useState<'airport' | 'sightseeing' | 'ski'>('airport');
  const [quoteDate, setQuoteDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [quoteTime, setQuoteTime] = useState('10:00');
  const [quotePax, setQuotePax] = useState('2');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Fleet View Switcher
  const [selectedFleet, setSelectedFleet] = useState<'hiace' | 'alphard' | 'granace'>('alphard');
  const [fleetPhotoView, setFleetPhotoView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');

  const handleFloatingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/booking?category=${serviceCategory}&from=${fromLocation}&date=${quoteDate}&pax=${quotePax}`);
  };

  const fleetData = {
    hiace: {
      name: 'HiAce Grand Cabin',
      tier: 'Standard',
      goldBadge: 'STANDARD',
      badge: 'High-Capacity Group Van',
      capacity: '1–9 Guests',
      luggage: '9–10 Large Bags',
      exteriorImage: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
      desc: {
        ja: '最大9名様のご乗車と大量のスーツケース・スキー板を楽々積載できるハイルーフワイドキャビン。ファミリーや団体グループに最適。',
        zh: '可容纳多达9位贵宾及大量大号行李箱、滑雪板包。超大车顶空间与通畅过道，适合大家庭及团队出行。',
        fr: 'Idéal pour grands groupes jusqu\'à 9 personnes avec espace volumineux pour valises et sacs de ski volumineux.',
        es: 'Ideal para familias grandes y grupos de hasta 9 personas con espacio masivo para equipaje y material de esquí.',
        en: 'Spacious high-roof wide-body van accommodating up to 9 guests with huge luggage bay for suitcases and ski gear.',
      }[lang],
    },
    alphard: {
      name: 'Toyota Alphard Executive Lounge',
      tier: 'Premium',
      goldBadge: 'PREMIUM',
      badge: 'VIP First-Class Captain Seats',
      capacity: '1–4 Guests',
      luggage: '3–4 Large Suitcases',
      exteriorImage: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      desc: {
        ja: '電動オットマン付きキャプテンシート、シートベンチレーション/ヒーター、極上の静粛性を誇るエグゼクティブMPV。1〜4名様に最適。',
        zh: '尊享头等舱级电动航空座椅，配备通风加热与静谧空间。1-4位贵宾商务出行与私享观光的典范座驾。',
        fr: 'Sièges capitaine Ottoman tout électriques, ventilation/chauffage et insonorisation de première classe. Idéal pour 1 à 4 personnes.',
        es: 'Asientos ejecutivos eléctricos con reposapiés, cuero premium y máximo confort acústico. Ideal para 1 a 4 personas.',
        en: 'Power-reclining Ottoman captain seats with heated/ventilated premium leather and ultra-quiet cabin. Perfect for 1 to 4 VIPs.',
      }[lang],
    },
    granace: {
      name: 'Toyota Granace 4WD VIP Lounge',
      tier: 'Ultra Premium Vehicle',
      goldBadge: 'ULTRA PREMIUM',
      badge: 'Executive 6-Seater Flagship',
      capacity: '1–5 Guests',
      luggage: '4–5 Large Suitcases',
      exteriorImage: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      interiorImage: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
      desc: {
        ja: '堂々たるボディサイズに4WDを搭載。2列目・3列目ともに独立キャプテンシートを備え、雪道や長距離観光でも圧倒的な快適性を誇ります。',
        zh: '全时四驱旗舰大空间，第二排与第三排均配备独立真皮头等舱航空座椅。长途旅行与雪季出行首选。',
        fr: 'Grand monospace 4x4 avec 4 sièges capitaine indépendants. Confort souverain pour les longs trajets et la montagne enneigée.',
        es: 'Monovolumen ejecutivo 4x4 con 4 asientos VIP independientes. Máximo confort en largos recorridos y puertos de montaña.',
        en: 'Commanding full-size 4WD luxury transporter with 4 independent captain chairs across 2nd & 3rd rows. Unrivaled stability.',
      }[lang],
    },
  };

  const currentFleetItem = fleetData[selectedFleet];
  const activeFleetPhoto =
    fleetPhotoView === 'interior'
      ? currentFleetItem.interiorImage
      : fleetPhotoView === 'trunk'
      ? currentFleetItem.trunkImage
      : currentFleetItem.exteriorImage;

  const faqs = [
    {
      q: {
        en: 'How does airport pickup work?',
        ja: '空港でのお迎えはどのように行われますか？',
        zh: '机场接机是如何操作的？',
      },
      a: {
        en: 'Your assigned chauffeur monitors your flight live via AeroDataBox. They will be waiting at the arrival exit hall holding a personalized luxury welcome nameboard. Complimentary 90-minute waiting time is included from the moment your flight actually touches down.',
        ja: '担当ドライバーがAeroDataBoxを通じてフライトの実際の着陸時刻をリアルタイムで監視し、税関出口にてお名前を掲示してお待ちします。実際の着陸時刻から90分間の無料待機が含まれています。',
        zh: '专属司机会通过AeroDataBox实时跟踪您的航班动态，并在国际到达出口手持尊享姓名牌迎接您。飞机实际落地后享有免费90分钟守候时间。',
      },
    },
    {
      q: {
        en: 'Are the prices fixed or metered?',
        ja: '料金は定額ですか、それともメーター制ですか？',
        zh: '车费是固定包干还是按打表计算？',
      },
      a: {
        en: 'All fares on SK LIMO are 100% fixed, all-inclusive, and guaranteed upon booking. Expressway highway tolls, fuel, vehicle insurance, and parking are fully covered with zero surge pricing or unexpected meter surprises.',
        ja: 'SK LIMOのすべての料金は完全定額制です。高速道路料金、燃料代、車両保険、駐車場代がすべて含まれており、渋滞や混雑による追加請求は一切ございません。',
        zh: 'SK LIMO所有价格均为100%固定全包价。高速过路费、燃油费、商业保险均已包含在内，绝无高峰溢价或额外加价。',
      },
    },
    {
      q: {
        en: 'What happens if my flight is delayed or rescheduled?',
        ja: 'フライトが遅延または変更になった場合はどうなりますか？',
        zh: '如果我的航班延误或改期怎么办？',
      },
      a: {
        en: 'Because we track your live flight number, delayed arrivals automatically adjust your chauffeur dispatch time at no extra charge. If your flight is cancelled or rescheduled by the airline, send us the airline notice for a free rebooking or full refund.',
        ja: '便名をリアルタイム追跡しているため、フライトの遅延に合わせてドライバーのお迎え時刻も自動調整されます。航空会社都合の欠航・日程変更時は無料で日程変更または全額返金いたします。',
        zh: '我们实时监控您的航班信息，延误到达将自动顺延司机接送时间，无需额外费用。如遇航空公司改期或取消，提供凭证即可免费改期或全额退款。',
      },
    },
    {
      q: {
        en: 'What payment methods do you accept?',
        ja: '利用可能な決済方法は何ですか？',
        zh: '支持哪些支付方式？',
      },
      a: {
        en: 'We accept Apple Pay (1-click express checkout), Google Pay, Credit Cards (Visa, Mastercard, American Express, JCB, UnionPay), WeChat Pay (微信支付), Alipay (支付宝), and PayPay via encrypted Level-1 PCI-DSS Stripe processing.',
        ja: 'Apple Pay（ワンクリック即時決済）、Google Pay、各種クレジットカード（VISA、Mastercard、AMEX、JCB、銀聯）、WeChat Pay（微信支付）、Alipay（支付宝）、PayPayに対応しております。',
        zh: '支持Apple Pay一键极速支付、Google Pay、国际主流信用卡（Visa、Mastercard、Amex、JCB、银联）、微信支付、支付宝及PayPay。',
      },
    },
    {
      q: {
        en: 'Are your vehicles legally licensed in Japan?',
        ja: '車両は日本の法令に基づき正規に認可されていますか？',
        zh: '车辆是否具有日本正规营运资质？',
      },
      a: {
        en: 'Yes. 100% of our fleet operates on Japanese commercial "Green Plates" (緑ナンバー) authorized by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) with comprehensive commercial passenger liability insurance.',
        ja: 'はい。当社のすべての車両は、国土交通省関東運輸局の正規認可を受けた「緑ナンバー（営業用登録）」車両であり、万全の搭乗者傷害保険が完備されています。',
        zh: '是的。我们的所有车队均具有日本国土交通省正规营运资质（绿牌合规营运），并全额配备高额商业乘客意外与人身保险。',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080B11] text-[#1D1A16] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="home" />

      {/* ═════════════════════════════════════════════════════════════════
          1. CINEMATIC HERO SECTION (Direct RydAgent Inspiration)
      ═════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[90svh] items-center justify-center overflow-hidden pt-16 pb-20">
        
        {/* Background Photorealistic Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dest-haneda-hero-1920x1080.jpg"
            alt="SK Limo Executive Chauffeur and Black Toyota Alphard in Japan"
            fill
            priority
            className="object-cover object-center brightness-[0.82] dark:brightness-[0.45]"
          />
          {/* Subtle Dark Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 dark:from-[#080B11]/95 dark:via-[#080B11]/80 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4] via-transparent to-black/40 dark:from-[#080B11] dark:via-transparent dark:to-transparent" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          <div className="lg:col-span-8 space-y-5 text-white">
            
            {/* Gold Ribbon Badge */}
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E5C378]">
                JAPAN-ONLY · LICENSED &amp; INSURED GREEN-PLATE OPERATOR
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15]">
              <span className="block font-serif italic text-slate-200">First-Class Travel in Japan —</span>
              <span className="block font-extrabold bg-gradient-to-r from-[#F3E7C4] via-[#C5A059] to-[#E5C378] bg-clip-text text-transparent pt-1">
                Every ride, perfectly covered.
              </span>
            </h1>

            {/* RydAgent Value Checklist */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200/95 max-w-xl font-medium pt-2">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>All-inclusive fixed prices</strong> — Expressway tolls, parking &amp; taxes in, zero tipping expected.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Flight tracked live</strong> — Delayed? Complimentary 90-minute wait &amp; auto-adjusted dispatch.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>Curbside meet &amp; greet</strong> — Chauffeur meets you at arrivals with personalized nameboard.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span><strong>24/7 Operations Desk</strong> — Instant WhatsApp coordination and dispatch in English &amp; Japanese.</span>
              </li>
            </ul>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/booking"
                className="bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all cursor-pointer"
              >
                <span>Start Booking Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                <span>Our Guarantees</span>
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ═════════════════════════════════════════════════════════════════
          2. FLOATING QUICK QUOTE & BOOKING WIDGET (RydAgent Signature)
      ═════════════════════════════════════════════════════════════════ */}
      <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16">
        <form
          onSubmit={handleFloatingSearch}
          className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
        >
          {/* Service Category */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              Service
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as any)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="airport">Airport Transfer</option>
              <option value="sightseeing">Day Charter Tour</option>
              <option value="ski">4WD Ski Transfer</option>
            </select>
          </div>

          {/* From */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              Pickup (From)
            </label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="hnd">Haneda Airport (HND)</option>
              <option value="nrt">Narita Airport (NRT)</option>
              <option value="tokyo">Tokyo Hotels (Central)</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              Time
            </label>
            <select
              value={quoteTime}
              onChange={(e) => setQuoteTime(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '20:00', '22:00'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Vehicle / Pax */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              Guests (Pax)
            </label>
            <select
              value={quotePax}
              onChange={(e) => setQuotePax(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="2">1–4 Pax (Alphard Premium)</option>
              <option value="5">1–5 Pax (Granace VIP)</option>
              <option value="8">1–9 Pax (HiAce Standard)</option>
            </select>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full h-11 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer"
          >
            <span>Check Price</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          3. KEY TRUST METRICS & WHAT WE OPERATE
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">100%</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">MLIT Green Plate</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">Fully insured commercial legal Japanese transport</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">90 Min</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">Free Arrival Wait</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">Relaxed customs &amp; luggage clearance guarantee</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">¥0</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">Surge Pricing</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">All highway tolls &amp; fuel locked at reservation</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">24/7</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">Bilingual Support</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">WhatsApp &amp; phone flight tracking dispatch desk</p>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          4. POPULAR CORRIDORS & CURATED ROUTES
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
              Fixed-Rate Routes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
              Popular Japan Private Chauffeur Corridors
            </h2>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D3F] dark:text-[#C5A059] hover:underline"
          >
            <span>Open Interactive Booking Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Haneda Airport */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/dest-haneda-hero-1920x1080.jpg"
                  alt="Haneda Airport Transfer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  25–35 Min · 22 km
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  From ¥16,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">Haneda Airport ⇄ Tokyo Hotels</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  Seamless executive arrival. Meet &amp; greet with nameboard at Terminal 2/3 and direct drop-off at your Tokyo hotel lobby.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=airport&from=hnd"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>Book Haneda Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Mount Fuji & Kawaguchiko */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/dest-fuji-hero-1920x1080.jpg"
                  alt="Mount Fuji Private Day Charter"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  10 Hours · 118 km
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  From ¥75,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">Mount Fuji &amp; Lake Kawaguchiko</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  5th Station panoramic vistas, crystal waters of Oshino Hakkai, and Arakurayama Sengen Pagoda at your own pace.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=sightseeing&from=tokyo"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>Book Fuji Charter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: 4WD Hakuba Ski Direct */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/ski-hakuba-hero-4032x3024.jpg"
                  alt="4WD Ski Transfer Hakuba"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  3.5–4.0 Hours · 4WD Direct
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  From ¥110,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">4WD Hakuba Valley Alpine Ski Direct</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  Door-to-door from Haneda, Narita, or Tokyo directly to your Hakuba chalet. Studless snow tires and ski bags included.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=ski&from=hnd"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>Book Ski Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          5. FLEET SHOWCASE WITH RIGHT-SIDE GOLD BADGES
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
              Executive Fleet Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
              Pristine Japanese Commercial Vehicles
            </h2>
            <p className="text-xs text-[#6B6458] dark:text-slate-400">
              Daily sanitized, non-smoking, and maintained under rigorous Ministry of Transport safety protocols.
            </p>
          </div>

          {/* Fleet Tabs with Gold Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(['hiace', 'alphard', 'granace'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedFleet(key);
                  setFleetPhotoView('exterior');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedFleet === key
                    ? 'bg-[#1D1A16] text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED]'
                }`}
              >
                <span>
                  {key === 'hiace'
                    ? 'HiAce Grand Cabin (1-9 Pax)'
                    : key === 'alphard'
                    ? 'Toyota Alphard (1-4 Pax)'
                    : 'Toyota Granace (1-5 Pax)'}
                </span>
                <span className="bg-[#C5A059]/20 text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded border border-[#C5A059]/40">
                  {key === 'hiace' ? 'STANDARD' : key === 'alphard' ? 'PREMIUM' : 'ULTRA PREMIUM'}
                </span>
              </button>
            ))}
          </div>

          {/* Vehicle Showcase Card */}
          <div className="bg-[#FAF8F4] dark:bg-[#111622] border border-[#E8E2D8] dark:border-slate-700/80 rounded-2xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md border border-[#E8E2D8] dark:border-slate-700">
                <Image
                  src={activeFleetPhoto}
                  alt={currentFleetItem.name}
                  fill
                  className="object-cover transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('exterior')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'exterior'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  Exterior
                </button>
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('interior')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'interior'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  Interior Lounge
                </button>
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('trunk')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'trunk'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  Luggage Bay
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6D3F] dark:text-[#E5C378] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                <span>{currentFleetItem.goldBadge}</span>
                <span>•</span>
                <span>{currentFleetItem.badge}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#1D1A16] dark:text-white">
                {currentFleetItem.name}
              </h3>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E8E2D8] dark:border-slate-700 px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059]" />
                  {currentFleetItem.capacity}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E8E2D8] dark:border-slate-700 px-3 py-1.5 rounded-lg">
                  <Briefcase className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059]" />
                  {currentFleetItem.luggage}
                </span>
              </div>

              <p className="text-xs text-[#6B6458] dark:text-slate-300 leading-relaxed">
                {currentFleetItem.desc}
              </p>

              <div className="pt-2">
                <Link
                  href="/booking"
                  className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Book This Vehicle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          6. INTERACTIVE ROUTE & DISTANCE VISUALIZER
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteDistanceVisualizer />
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          7. FREQUENTLY ASKED QUESTIONS (Accordion FAQ)
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
            Transparent Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1D1A16] dark:text-white cursor-pointer"
                >
                  <span>{(faq.q as any)[lang] || faq.q.en}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-[#6B6458] dark:text-slate-300 leading-relaxed border-t border-[#F0F2F5] dark:border-slate-800/80 mt-1">
                    <p className="pt-3">{(faq.a as any)[lang] || faq.a.en}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          8. B2B TRAVEL AGENT / DMC BANNER
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#080B11] border border-slate-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#E5C378]">
              FOR TRAVEL AGENTS, TOUR OPERATORS &amp; OVERSEAS DMCs
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hand Us the Japan Leg — We Arrange the Entire Ground Programme
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Guaranteed itemized net rates on vehicles, Shinkansen rail seats, timed-entry tickets, and licensed guides. Registered in Japan as a Travel Service Arrangement Business.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/contact"
              className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all"
            >
              <span>Connect with B2B Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
