'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Luggage,
  CheckCircle2,
  Lock,
  Snowflake,
  MapPin,
  Globe,
  MessageSquare,
  ChevronDown,
  Mountain,
  Calendar,
  ArrowRight,
  SlidersHorizontal,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plane,
  Wifi,
  Sparkles,
  Flame,
  Clock,
  Car,
  Check,
  Menu,
  X,
  AlertCircle,
  Award,
} from 'lucide-react';

import {
  PICKUP_LOCATIONS,
  DESTINATION_LOCATIONS,
  PricingConfig,
  QuoteInputs,
  QuoteCalculationResult,
  calculateQuote,
  subscribeToPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from '@/lib/pricing-store';
import { TRANSLATIONS, Language } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';

/* ──────────────────────────────────────────────
   Scroll-triggered section visibility hook
   ────────────────────────────────────────────── */
function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: reveal after 1.5s if IO never triggers (e.g. headless browsers)
    const fallback = setTimeout(() => el.classList.add('is-visible'), 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px 100px 0px' }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);
  return ref;
}

/* ──────────────────────────────────────────────
   Header scroll state hook
   ────────────────────────────────────────────── */
function useHeaderScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

/* ──────────────────────────────────────────────
   REVIEWS DATA (5-Language Multilingual)
   ────────────────────────────────────────────── */
const REVIEWS = [
  {
    text: {
      ja: 'SK Limoの送迎は本当に快適でストレスフリーでした。成田空港の到着口でドライバーさんが待っていてくださり、8個のスキーバッグを白馬のコテージまで直行で届けてくれました。細やかな心遣いに感動しました。',
      zh: '选择 SK Limo 体验无比丝滑安心。专属司机在成田机场到达口举牌等候，帮我们把8套雪具和行李直接送达白马木屋。无微不至的专业服务让全家旅程格外难忘。',
      fr: 'Voyager avec SK Limo a été d\'une simplicité et d\'un confort absolus. Notre chauffeur nous a accueillis à la sortie de Narita et a transporté nos 8 housses de ski directement à notre chalet d\'Hakuba.',
      es: 'Viajar con SK Limo fue una experiencia perfecta y sin estrés. El chófer nos recibió en la salida de llegadas de Narita y llevó nuestras 8 bolsas de esquí directo a nuestro chalet en Hakuba.',
      en: 'Working with SK Limo was effortless and stress-free. Their driver met us directly inside Narita arrival gate and took our 8 ski bags straight to our Hakuba chalet. Meticulous attention to the smallest details made our experience memorable.',
    },
    author: 'Alisha M.',
    location: 'Chicago, USA',
  },
  {
    text: {
      ja: '家族で野沢温泉への貸切送迎をお願いしました。グランエースの本革キャプテンシートは極上の座り心地で、雪道の運転も100%安心でした。10日間で3つのスキー場を満喫できた最高の冬休みでした！',
      zh: '非常感谢 SK Limo 安排我们全家的野泽温泉包车。丰田 Granace 头等舱座椅极其舒适，雪地驾驶安全平稳。10天畅滑3大雪场，是一次充满灵感的奢华冬季冒险！',
      fr: 'Un immense merci à SK Limo pour notre transfert familial à Nozawa Onsen. Les sièges capitaines du Granace étaient grandioses et la conduite sur neige d\'une sécurité totale.',
      es: 'Agradecemos enormemente a SK Limo por organizar nuestro viaje familiar a Nozawa Onsen. Los asientos del Granace son pura comodidad y la conducción en nieve fue 100% segura.',
      en: 'We cannot thank SK Limo enough for organizing our family charter to Nozawa Onsen. The Granace captain seats were so luxurious, and the snow driving felt 100% safe. Three resorts in 10 days — it was an inspirational holiday adventure!',
    },
    author: 'Jane & Paul C.',
    location: 'New York, USA',
  },
  {
    text: {
      ja: '羽田着のフライトが遅延した際も、WhatsAppでの迅速なやり取りとフライト追跡で安心でした。わかりやすいスケジュール案内で旅のストレスはゼロ。日本のスノートラベルにはSK Limoを強くお勧めします。',
      zh: '羽田航班发生延误时，客服通过 WhatsApp 实时追踪动态并迅速确认，完全没有等待焦虑。流程清晰明了，强力推荐给所有计划来日本滑雪的朋友！',
      fr: 'Confirmation instantanée sur WhatsApp et suivi en direct de notre vol retardé à Haneda. Une organisation irréprochable qui rend le voyage serein.',
      es: 'Confirmación instantánea por WhatsApp y seguimiento de vuelo en vivo cuando nuestro vuelo a Haneda se retrasó. Recomiendo SK Limo al 100% para viajar en invierno a Japón.',
      en: 'Instant WhatsApp confirmation and real-time flight tracking when our Haneda flight was delayed. The itinerary was easy to follow and made our trip stress-free. I give SK Limo my highest recommendation for Japan winter travel.',
    },
    author: 'Simon L.',
    location: 'Los Angeles, USA',
  },
  {
    text: {
      ja: '2週間かけて白馬、野沢、志賀高原を巡りました！極上のパウダースノー、美味しい郷土料理、そして全行程での5つ星ハイヤーサービス。すべてが完璧にオーガナイズされていました。次回も必ずお願いします！',
      zh: '两周内畅游白马、野泽和志贺高原！令人惊叹的粉雪、绝顶美味以及全程五星级专车服务，组织得井井有条。我们迫不及待下次再订 SK Limo！',
      fr: 'Deux semaines inoubliables entre Hakuba, Nozawa et Shiga Kogen ! Une poudreuse de rêve et un service VIP cinq étoiles de bout en bout.',
      es: '¡Dos semanas increíbles entre Hakuba, Nozawa y Shiga Kogen! Nieve polvo inigualable y un servicio de 5 estrellas de principio a fin.',
      en: 'Hakuba, Nozawa, and Shiga Kogen over two weeks! Remarkable powder, amazing food, and five-star service the whole way. Everything was so well organized. We can\'t wait for SK Limo to plan our next winter trip!',
    },
    author: 'Becky H.',
    location: 'Dallas, USA',
  },
];

import { useLanguage } from '@/context/LanguageContext';
import SiteFooter from '@/components/SiteFooter';

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function WinterTourPage() {
  const [lang, setLang] = useLanguage();
  const t = TRANSLATIONS[lang];

  // Pricing configuration from Firestore / fallback
  const [config, setConfig] = useState<PricingConfig | null>(null);

  useEffect(() => {
    const unsub = subscribeToPricingConfig((updatedConfig) => {
      setConfig(updatedConfig);
    });
    return () => unsub();
  }, []);

  // Form & Calculator State (Defaulted strictly to Winter Ski Charters)
  const [pickupId, setPickupId] = useState<string>('hnd');
  const [destinationId, setDestinationId] = useState<string>('hakuba');
  const [transferType, setTransferType] = useState<'one_way' | 'round_trip'>('one_way');
  const [passengers, setPassengers] = useState<number>(3);
  const [luggageCount, setLuggageCount] = useState<number>(3);
  const [skiBagCount, setSkiBagCount] = useState<number>(3);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [addSecondVehicle, setAddSecondVehicle] = useState<boolean>(false);
  const [travelDate, setTravelDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [isLookupExpanded, setIsLookupExpanded] = useState(false);
  
  // Reviews carousel
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewTimer = useRef<NodeJS.Timeout | null>(null);

  // Fleet tab states
  const [alphardTab, setAlphardTab] = useState<'ext' | 'int' | 'trunk'>('ext');
  const [granaceTab, setGranaceTab] = useState<'ext' | 'int' | 'trunk'>('ext');
  const [hiaceTab, setHiaceTab] = useState<'ext' | 'int' | 'trunk'>('ext');

  // Booking Modal & President Message Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPresidentModalOpen, setIsPresidentModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');

  // Sticky bottom bar scroll
  const headerScrolled = useHeaderScroll();

  const startReviewTimer = useCallback(() => {
    if (reviewTimer.current) clearInterval(reviewTimer.current);
    reviewTimer.current = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startReviewTimer();
    return () => { if (reviewTimer.current) clearInterval(reviewTimer.current); };
  }, [startReviewTimer]);

  const goReview = (dir: 'prev' | 'next') => {
    setReviewIndex((prev) =>
      dir === 'next' ? (prev + 1) % REVIEWS.length : (prev - 1 + REVIEWS.length) % REVIEWS.length
    );
    startReviewTimer();
  };

  // Fade-in hooks
  const chooserRef = useScrollFadeIn();
  const aboutRef = useScrollFadeIn();
  const servicesRef = useScrollFadeIn();
  const fleetRef = useScrollFadeIn();
  const reviewsRef = useScrollFadeIn();
  const routesRef = useScrollFadeIn();

  const quoteInputs: QuoteInputs = {
    pickupId,
    destinationId,
    transferType,
    passengers,
    luggageCount,
    skiBagCount,
    vehiclePreference: selectedVehicleType,
    addSecondVehicle,
  };

  const quoteResult: QuoteCalculationResult = calculateQuote(config || DEFAULT_PRICING_CONFIG, quoteInputs);
  const selectedPickup = PICKUP_LOCATIONS.find((p) => p.id === pickupId);
  const selectedDest = DESTINATION_LOCATIONS.find((d) => d.id === destinationId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(2);
  };

  const handleLookupClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLookupExpanded(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-[#C5A059]/30 selection:text-[#E5C378] relative overflow-x-hidden w-full">

      {/* Shared Unified Header Navigation */}
      <SiteHeader currentLang={lang} onLanguageChange={setLang} activePage="winter" />

      {/* ═══════════════════════════════════════
          HERO SECTION — COMPONENT 2
          Full-viewport cinematic hero
          ═══════════════════════════════════════ */}
<section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6">

        {/* Background: Bare skitrails.jpg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/winter-ski-trails-powder-5947x3965.jpg"
            alt="Hakuba Snow Mountain Luxury Charter"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle bottom gradient for text readability — preserves bare sky */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/90 via-[#0A0D14]/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-16 sm:pt-0">
          <p
            className="text-[11px] sm:text-[13px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C5A059] font-medium"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {lang === 'ja' ? '銀世界の彼方へ、極上の旅を' : lang === 'zh' ? '开启极致尊荣的雪国之旅' : 'Private Luxury Chauffeur Transfers'}
          </p>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.15] sm:leading-[1.1] tracking-tight font-bold"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {lang === 'ja'
              ? <>日本のスキーリゾートへ、<br />プライベートチャーター</>
              : lang === 'zh'
              ? <>长野・新潟顶级滑雪胜地<br />专属豪华专车直达</>
              : <>Private Ski Charters,<br />Japan</>
            }
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed px-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {lang === 'ja'
              ? '東京・空港から白馬・野沢温泉・志賀高原へ、ドアtoドアのエグゼクティブ送迎。'
              : lang === 'zh'
              ? '从羽田・成田机场及东京市区，直达白马、野泽温泉、志贺高原的顶级VIP门到门接送。'
              : 'Door-to-door executive transfers from Tokyo and airports to Hakuba, Nozawa Onsen, and Shiga Kogen.'}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:pt-5 w-full max-w-xs mx-auto">
            <a
              href="#plan"
              className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-8 py-3.5 rounded-xl text-[13px] tracking-[0.12em] uppercase transition-all duration-300 shadow-lg hover:shadow-[#C5A059]/25 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {lang === 'ja' ? '料金を確認する' : lang === 'zh' ? '开始计算滑雪接送' : 'Plan Your Ski Transfer'}
            </a>
            <a
              href="#destinations"
              className="text-white/80 hover:text-white text-[13px] tracking-[0.12em] uppercase font-medium transition-colors duration-300 border-b border-white/30 hover:border-white pb-0.5 text-center cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {lang === 'ja' ? '主要スキーリゾート一覧' : lang === 'zh' ? '查看热门滑雪场' : 'Explore Top Ski Resorts'}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DESTINATION CHOOSER — COMPONENT 4
          (Winter Ski Charters ONLY)
          ═══════════════════════════════════════ */}
      <section id="plan" className="relative z-10 -mt-1 bg-[#0A0D14]">
        <div ref={chooserRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

          <div className="text-center mb-10 space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? '冬季スキー送迎プランナー' : lang === 'zh' ? '滑雪专车智能计算器' : 'Winter Ski Transfer Planner'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? '目的地を選んで、即時見積り' : lang === 'zh' ? '选择滑雪目的地与实时报价' : 'Plan Your Winter Ski Transfer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              {lang === 'ja'
                ? '羽田空港・成田空港・都内ホテルから、長野・新潟の各スキーリゾート（白馬・野沢温泉・志賀高原等）への直行ドアtoドア定額ハイヤー送迎。'
                : lang === 'zh'
                ? '羽田・成田机场及东京市区酒店 ⇄ 白马、野泽、志贺高原等各大滑雪胜地，全车系标配4WD及雪地胎。'
                : 'Direct executive private chauffeur transfers from Haneda (HND), Narita (NRT), and Tokyo Hotels to Nagano & Niigata Ski Resorts.'}
            </p>
          </div>

          <div className="bg-[#0E131F] border border-slate-800/60 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-6">

            {/* Winter Ski Highlight Banner */}
            <div className="bg-gradient-to-r from-[#0A0D14] via-[#121929] to-[#0A0D14] border border-cyan-400/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs sm:text-sm">
                    {lang === 'ja' ? '🎿 白馬・野沢温泉・志賀高原 直行スキーチャーター' : lang === 'zh' ? '🎿 白马・野泽温泉・志贺高原 滑雪专车包车直达' : '🎿 Direct Alpine Ski Transfers: Hakuba, Nozawa & Shiga Kogen'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ja'
                      ? '全車4WD駆動・ブリヂストン製スタッドレスタイヤ標準装備。スキー板・大型スノーバッグも余裕で積載。'
                      : lang === 'zh'
                      ? '全系车型标配 4WD 全时四驱及普利司通防滑雪胎，充足空间容纳超大多套滑雪板。'
                      : 'All vehicles equipped with 4WD & Bridgestone studless snow tires. Dedicated oversized ski gear capacity.'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-cyan-950/60 text-cyan-200 border border-cyan-400/50 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                {lang === 'ja' ? '4WD雪道仕様' : '4WD Alpine Spec'}
              </span>
            </div>

            {/* Transfer type toggle & Popular Quick Tags (Trip.com Inspired) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
              <div className="flex items-center gap-1 bg-[#0A0D14] p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferType('one_way')}
                  className={`px-5 py-2 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    transferType === 'one_way'
                      ? 'bg-[#C5A059] text-[#0A0D14] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.oneWay}
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('round_trip')}
                  className={`px-5 py-2 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    transferType === 'round_trip'
                      ? 'bg-[#C5A059] text-[#0A0D14] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.roundTrip}
                </button>
              </div>

              {/* Quick Destination Chips (Ski Resorts ONLY) */}
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium text-[11px] uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'ja' ? '主要スキー場:' : lang === 'zh' ? '热门雪场:' : 'Ski Resorts:'}
                </span>
                {[
                  { id: 'hakuba', label: lang === 'ja' ? '🔥 白馬バレー' : lang === 'zh' ? '🔥 白马山谷' : '🔥 Hakuba Valley' },
                  { id: 'nozawa', label: lang === 'ja' ? '♨️ 野沢温泉' : lang === 'zh' ? '♨️ 野泽温泉' : '♨️ Nozawa Onsen' },
                  { id: 'shiga_kogen', label: lang === 'ja' ? '🏔️ 志賀高原' : lang === 'zh' ? '🏔️ 志贺高原' : '🏔️ Shiga Kogen' },
                  { id: 'myoko', label: lang === 'ja' ? '❄️ 妙高高原' : lang === 'zh' ? '❄️ 妙高高原' : '❄️ Myoko Kogen' },
                  { id: 'madarao', label: lang === 'ja' ? '🌲 斑尾高原' : lang === 'zh' ? '🌲 斑尾高原' : '🌲 Madarao' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      setDestinationId(chip.id);
                      setIsLookupExpanded(true);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border cursor-pointer ${
                      destinationId === chip.id
                        ? 'bg-[#C5A059]/20 text-[#E5C378] border-[#C5A059]'
                        : 'bg-[#0A0D14] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLookupClick} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* FROM */}
              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800/80 hover:border-[#C5A059]/50 transition-colors">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1.5 text-[10px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  {lang === 'ja' ? '乗車地 (From)' : 'Pickup Location (From)'}
                </label>
                <select
                  value={pickupId}
                  onChange={(e) => { setPickupId(e.target.value); setIsLookupExpanded(true); }}
                  className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                >
                  {PICKUP_LOCATIONS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0E131F] text-white">
                      {lang === 'ja' ? p.nameJa : p.name} [{p.code}]
                    </option>
                  ))}
                </select>
              </div>

              {/* TO (Ski Resorts ONLY) */}
              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800/80 hover:border-[#C5A059]/50 transition-colors">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1.5 text-[10px] flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#C5A059]" />
                  {lang === 'ja' ? '目的地 (スキー場)' : lang === 'zh' ? '滑雪度假区' : 'Ski Resort Destination'}
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => { setDestinationId(e.target.value); setIsLookupExpanded(true); }}
                  className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                >
                  {DESTINATION_LOCATIONS.filter((d) => d.id !== 'tokyo_hotel' && d.id !== 'fuji').map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#0E131F] text-white">
                      {lang === 'ja' ? d.nameJa : d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800/80 hover:border-[#C5A059]/50 transition-colors">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1.5 text-[10px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  {lang === 'ja' ? 'ご乗車予定日' : 'Travel Date'}
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => { setTravelDate(e.target.value); setIsLookupExpanded(true); }}
                  className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              {/* CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-3.5 px-4 rounded-xl text-[13px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#C5A059]/25 cursor-pointer"
                >
                  <span>{isLookupExpanded ? (lang === 'ja' ? '料金を再計算' : 'Recalculate Fare') : (lang === 'ja' ? '料金を検索' : 'Check Live Fares')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Step 2: Progressive details */}
            {isLookupExpanded && (
              <div className="border-t border-slate-800/60 pt-6 space-y-6" style={{ animation: 'slide-in 0.4s ease-out' }}>

                {/* Vehicle Selector (Alphard, Granace, HiAce) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C5A059]">
                      {lang === 'ja' ? '運行車両を選択' : 'Select Vehicle Class'}
                    </p>
                    <span className="text-[10px] text-slate-400">All-Inclusive Luxury Fleet</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'alphard' as const, name: 'Toyota Alphard', nameJa: 'トヨタ アルファード', cap: 4, tag: 'VIP Ottoman (Max 4 Pax)', img: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg' },
                      { id: 'granace' as const, name: 'Toyota Granace', nameJa: 'トヨタ グランエース', cap: 5, tag: 'VIP Lounge (Max 5 Pax)', img: '/images/fleet-toyota-granace-exterior-4032x3024.jpg' },
                      { id: 'hiace' as const, name: 'Toyota HiAce', nameJa: 'トヨタ ハイエース', cap: 9, tag: 'Grand Cabin (Max 9 Pax)', img: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg' },
                    ].map((v) => {
                      const isSelected = selectedVehicleType === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVehicleType(v.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#C5A059]/15 border-[#C5A059] ring-1 ring-[#C5A059]'
                              : 'bg-[#0A0D14] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="relative h-20 w-28 sm:h-14 sm:w-20 rounded-lg overflow-hidden shrink-0 bg-[#05070B]">
                            <Image src={v.img} alt={v.name} fill className="object-cover object-[center_35%]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {lang === 'ja' ? v.nameJa : v.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{v.tag}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Passengers */}
                  <div className="bg-[#0A0D14] border border-slate-800/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-[#C5A059]" /> {t.paxLabel}
                      </span>
                      <span className="text-[10px] text-[#E5C378] font-bold bg-[#C5A059]/15 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                        Max {quoteResult.maxPassengers} Pax
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">−</button>
                      <span className="font-mono text-lg font-bold text-white">{passengers}</span>
                      <button type="button" onClick={() => setPassengers(passengers + 1)} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Suitcases */}
                  <div className="bg-[#0A0D14] border border-slate-800/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium flex items-center gap-2 text-sm">
                        <Luggage className="w-4 h-4 text-[#C5A059]" /> {t.suitcasesLabel}
                      </span>
                      <span className="text-[10px] text-slate-500">Max {quoteResult.maxSuitcases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">−</button>
                      <span className="font-mono text-lg font-bold text-white">{luggageCount}</span>
                      <button type="button" onClick={() => setLuggageCount(luggageCount + 1)} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Ski Bags */}
                  <div className="bg-[#0A0D14] border border-[#C5A059]/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium flex items-center gap-2 text-sm text-[#C5A059]">
                        <Snowflake className="w-4 h-4" /> {t.skiBagsLabel}
                      </span>
                      <span className="text-[10px] text-[#C5A059]/60">Max {quoteResult.maxSkiBags}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setSkiBagCount(Math.max(0, skiBagCount - 1))} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">−</button>
                      <span className="font-mono text-lg font-bold text-[#C5A059]">{skiBagCount}</span>
                      <button type="button" onClick={() => setSkiBagCount(skiBagCount + 1)} className="w-8 h-8 rounded-lg bg-slate-800 font-bold text-white hover:bg-slate-700 transition-colors">+</button>
                    </div>
                  </div>
                </div>

                {/* Seating Capacity Warning & Surcharge Upsell */}
                {quoteResult.isExceeded && (
                  <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        {passengers} guests exceed {quoteResult.recommendedVehicleName}&apos;s seating capacity ({quoteResult.maxPassengers} pax).
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Do you wish to book another vehicle? (+¥{quoteResult.secondVehicleSurcharge.toLocaleString()} multi-vehicle convoy)
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={addSecondVehicle}
                        onChange={(e) => setAddSecondVehicle(e.target.checked)}
                        className="rounded border-slate-700 text-[#C5A059] focus:ring-[#C5A059]"
                      />
                      <span className="text-white font-medium">Yes, add 2nd Support Vehicle (+¥{quoteResult.secondVehicleSurcharge.toLocaleString()})</span>
                    </label>
                  </div>
                )}

                {/* Quote Result */}
                <div className="bg-[#0A0D14] border border-[#C5A059]/40 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{t.recommendedVehicle}</span>
                    <p className="text-base font-bold text-[#C5A059]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {lang === 'ja' ? quoteResult.recommendedVehicleNameJa : quoteResult.recommendedVehicleName}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {lang === 'ja' ? selectedPickup?.nameJa : selectedPickup?.name} → {lang === 'ja' ? selectedDest?.nameJa : selectedDest?.name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{t.totalEstimatedQuote}</span>
                      <span className="text-2xl font-black font-mono text-white">
                        {quoteResult.formattedTotalPrice} <span className="text-sm text-[#C5A059]">JPY</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href={quoteResult.whatsAppMessage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold px-4 py-3 rounded-lg text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsBookingModalOpen(true)}
                        className="flex-1 sm:flex-none bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-5 py-3 rounded-lg text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        {t.directBookCTA}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trip.com-Inspired Trust & Safety Feature Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
            {[
              {
                icon: ShieldCheck,
                title: { ja: '国交省認可・緑ナンバー', zh: '日本国交省认证绿牌资质', fr: '100% Certifié Commercial MLIT', es: '100% Oficial con Placa Verde', en: '100% Licensed Commercial' }[lang],
                desc: { ja: '関自旅第1234号・最高補償任意保険', zh: '关自旅第1234号・全额商业乘客险', fr: 'Assurance responsabilité illimitée', es: 'Seguro de responsabilidad ilimitada', en: 'MLIT Certified & Fully Insured' }[lang],
              },
              {
                icon: Plane,
                title: { ja: 'フライト遅延自動追跡', zh: '航班延误实时动态监测', fr: 'Suivi des Vols en Direct', es: 'Monitoreo de Vuelos en Vivo', en: 'Flight Delay Guarantee' }[lang],
                desc: { ja: '遅延時の待機料金無料・到着口送迎', zh: '延误免加收待机费・到达口举牌', fr: 'Attente gratuite en cas de retard', es: 'Espera gratuita por retrasos de vuelo', en: 'Live Flight Monitor & Free Waiting' }[lang],
              },
              {
                icon: Snowflake,
                title: { ja: '全車4WD・スタッドレス', zh: '全系全时四驱雪地装备', fr: 'Flotte 4x4 Équipée Neige', es: 'Flota 4WD Equipada para Nieve', en: 'Alpine Winter 4WD' }[lang],
                desc: { ja: 'ブリヂストン製高級スノータイヤ', zh: '普利司通高性能防滑雪地胎', fr: 'Pneus neige Bridgestone certifiés', es: 'Neumáticos de nieve Bridgestone', en: 'Bridgestone Studless Snow Tires' }[lang],
              },
              {
                icon: MessageSquare,
                title: { ja: '24時間コンシェルジュ', zh: '24小时专属管家服务', fr: 'Conciergerie Dédiée 24/7', es: 'Atención 24/7 WhatsApp', en: '24/7 Concierge WhatsApp' }[lang],
                desc: { ja: 'バイリンガル対応・荷物積載補助', zh: '中日英多语服务・行李搬运协助', fr: 'Assistance bagages & multilingue', es: 'Asistencia con equipaje y multilingüe', en: 'Bilingual Support & Luggage Help' }[lang],
              },
            ].map((perk, i) => (
              <div
                key={i}
                className="bg-[#0E131F]/70 border border-slate-800/60 rounded-xl p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 hover:border-[#C5A059]/40 transition-colors duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                  <perk.icon className="w-5 h-5" />
                </div>
                <h4 className="text-white text-[13px] font-bold tracking-tight">{perk.title}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          POPULAR SKI DESTINATIONS — TRIP.COM STYLE
          (Moved directly below Plan Your Trip)
          ═══════════════════════════════════════ */}
      <section id="destinations" className="bg-[#0E131F] border-t border-slate-800/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-28 md:py-36">

          <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? '主要スキーリゾート' : lang === 'zh' ? '日本顶级滑雪胜地' : lang === 'fr' ? 'Destinations Alpines' : lang === 'es' ? 'Destinos Alpinos' : 'Curated Alpine Destinations'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? '人気のスノーエリア' : lang === 'zh' ? '日本热门滑雪度假区' : lang === 'fr' ? 'Meilleures Stations de Ski du Japon' : lang === 'es' ? 'Mejores Estaciones de Esquí de Japón' : 'Top Japan Ski Resorts'}
            </h2>
            <p className="text-[15px] text-slate-400 leading-relaxed">
              {lang === 'ja'
                ? '東京・空港から直行可能な日本の最高峰スキーリゾート。お荷物を載せたままドアtoドアで送迎。'
                : lang === 'zh'
                ? '从东京市区及成田、羽田机场直达日本最高水准的各大滑雪度假村。专车私密门到门，随行行李一站直达。'
                : lang === 'fr'
                ? 'Liaisons privées directes de porte à porte depuis Tokyo et ses aéroports vers les stations alpines les plus réputées du Japon.'
                : lang === 'es'
                ? 'Conexiones privadas directas puerta a puerta desde Tokio y sus aeropuertos hacia las estaciones de esquí más prestigiosas de Japón.'
                : 'Direct, private chauffeur door-to-door connections from Tokyo airports directly to Japan’s most celebrated ski resorts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'hakuba',
                name: { ja: '白馬バレー', zh: '白马山谷', fr: 'Hakuba Valley', es: 'Valle de Hakuba', en: 'Hakuba Valley' }[lang],
                region: 'Nagano',
                tag: { ja: '🔥 人気No.1 パウダー', zh: '🔥 人气No.1 顶级粉雪', fr: '🔥 Choix N°1 Poudreuse', es: '🔥 N°1 Nieve Polvo', en: '🔥 Top Choice Powder' }[lang],
                desc: {
                  ja: '10のスキー場が集まる日本屈指のパウダースノーの聖地。',
                  zh: '汇聚10大雪场的日本粉雪殿堂，北阿尔卑斯绝美香槟雪质。',
                  fr: '10 stations de classe mondiale et la légendaire poudreuse champagne des Alpes du Nord.',
                  es: '10 estaciones de clase mundial y la legendaria nieve polvo de los Alpes del Norte.',
                  en: '10 world-class resorts with legendary Northern Alps champagne powder.',
                }[lang],
                image: '/images/winter-ski-nagano-resort-1500x1001.jpg',
                time: '3.5h from Tokyo',
                price: lang === 'ja' ? '¥95,000〜' : lang === 'zh' ? '¥95,000起' : lang === 'fr' ? 'Dès 95 000 ¥' : lang === 'es' ? 'Desde ¥95,000' : 'From ¥95,000',
              },
              {
                id: 'nozawa',
                name: { ja: '野沢温泉', zh: '野泽温泉', fr: 'Nozawa Onsen', es: 'Nozawa Onsen', en: 'Nozawa Onsen' }[lang],
                region: 'Nagano',
                tag: { ja: '♨️ 名湯＆パウダースノー', zh: '♨️ 古汤温泉与粉雪胜地', fr: '♨️ Onsen Historique & Poudreuse', es: '♨️ Onsen Histórico y Nieve Polvo', en: '♨️ Historic Onsen & Powder' }[lang],
                desc: {
                  ja: '13の無料外湯めぐりと上質なパウダースノー。昔ながらの温泉街情緒が広がる人気リゾート。',
                  zh: '拥有13座传统天然外汤温泉与顶级天然粉雪，充满日本传统风情的温泉滑雪胜地。',
                  fr: '13 bains thermaux traditionnels gratuits et domaine skiable d\'exception à l\'ambiance authentique.',
                  es: '13 baños termales tradicionales gratuitos y un dominio esquiable excepcional de ambiente auténtico.',
                  en: '13 historic public hot spring baths coupled with expansive ski terrain and authentic village charm.',
                }[lang],
                image: '/images/winter-ski-snow-mountain-1500x1000.jpg',
                time: '4.0h from Tokyo',
                price: lang === 'ja' ? '¥98,000〜' : lang === 'zh' ? '¥98,000起' : lang === 'fr' ? 'Dès 98 000 ¥' : lang === 'es' ? 'Desde ¥98,000' : 'From ¥98,000',
              },
              {
                id: 'shiga',
                name: { ja: '志賀高原', zh: '志贺高原', fr: 'Shiga Kogen', es: 'Shiga Kogen', en: 'Shiga Kogen' }[lang],
                region: 'Nagano',
                tag: { ja: '🏔️ 標高2,307m 国内最大エリア', zh: '🏔️ 海拔2,307米 日本最大规模雪场', fr: '🏔️ Altitude 2 307m Le Plus Grand', es: '🏔️ Altitud 2.307m El Más Grande', en: '🏔️ 2,307m High Altitude Apex' }[lang],
                desc: {
                  ja: '18のスキー場が連結する日本最大級の広大なゲレンデ。標高2,000m超の極上シルキースノー。',
                  zh: '18座相连的滑雪场构成日本最大雪域，超2000米海拔带来干爽极致的丝质粉雪。',
                  fr: '18 stations interconnectées formant le plus vaste domaine skiable du Japon avec neige soyeuse.',
                  es: '18 estaciones interconectadas que forman el dominio de esquí más grande de Japón.',
                  en: 'Japan\'s largest interconnected ski expanse across 18 resorts with dry, silky powder snow.',
                }[lang],
                image: '/images/winter-ski-trails-powder-5947x3965.jpg',
                time: '4.0h from Tokyo',
                price: lang === 'ja' ? '¥98,000〜' : lang === 'zh' ? '¥98,000起' : lang === 'fr' ? 'Dès 98 000 ¥' : lang === 'es' ? 'Desde ¥98,000' : 'From ¥98,000',
              },
              {
                id: 'more-destinations',
                name: { ja: '+ その他の観光地', zh: '+ 更多东京周边景点', fr: '+ Autres Destinations', es: '+ Más Destinos', en: '+ More Destinations' }[lang],
                region: 'Tokyo & Beyond',
                tag: { ja: '🌸 富士山・箱根・鎌倉・日光', zh: '🌸 富士山・箱根・镰仓・日光', fr: '🌸 Mont Fuji, Hakone, Nikko', es: '🌸 Monte Fuji, Hakone, Nikko', en: '🌸 Mt. Fuji, Hakone, Nikko' }[lang],
                desc: {
                  ja: '富士山・河口湖、箱根温泉、古都鎌倉、世界遺産日光など東京近郊の観光名所をご案内。',
                  zh: '游览富士山河口湖、箱根温泉、古都镰仓、世界遗产日光等东京周边顶级名胜。',
                  fr: 'Explorez le Mont Fuji, Hakone Onsen, Kamakura et Nikko avec nos circuits privés d\'une journée.',
                  es: 'Explore el Monte Fuji, Hakone, Kamakura y Nikko con nuestras excursiones privadas desde Tokio.',
                  en: 'Explore iconic day trips from Tokyo: Mount Fuji, Hakone Onsen, Kamakura & UNESCO Nikko.',
                }[lang],
                image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
                time: 'Day Charters',
                price: lang === 'ja' ? '¥65,000〜' : lang === 'zh' ? '¥65,000起' : lang === 'fr' ? 'Dès 65 000 ¥' : lang === 'es' ? 'Desde ¥65,000' : 'From ¥65,000',
                isMorePage: true,
              },
            ].map((resort) => (
              <div
                key={resort.id}
                className="group rounded-2xl overflow-hidden bg-[#0E131F] border border-slate-800/60 shadow-xl hover:border-[#C5A059]/50 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={resort.image}
                      alt={resort.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-[#0A0D14]/85 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {resort.tag}
                    </span>
                    <span className="absolute bottom-2 right-3 text-[11px] text-slate-300 flex items-center gap-1 font-medium bg-[#0A0D14]/60 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-[#C5A059]" /> {resort.time}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{resort.name}</h3>
                      <span className="text-[11px] text-slate-500">{resort.region}</span>
                    </div>
                    <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2">{resort.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-3 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {resort.isMorePage ? (lang === 'ja' ? '貸切プラン' : lang === 'zh' ? '专属包车' : lang === 'fr' ? 'Excursion' : lang === 'es' ? 'Tour Privado' : 'Day Charters') : (lang === 'ja' ? '完全定額' : lang === 'zh' ? '全包一口价' : lang === 'fr' ? 'Tout Compris' : lang === 'es' ? 'Todo Incluido' : 'All-Inclusive')}
                    </span>
                    <span className="text-sm font-bold font-mono text-[#C5A059]">{resort.price}</span>
                  </div>
                  {resort.isMorePage ? (
                    <Link
                      href="/destinations"
                      className="bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 shadow hover:shadow-[#C5A059]/25 flex items-center gap-1"
                    >
                      <span>{lang === 'ja' ? '一覧を見る' : lang === 'zh' ? '查看全部' : lang === 'fr' ? 'Découvrir' : lang === 'es' ? 'Explorar' : 'Explore'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setDestinationId(resort.id);
                        setIsLookupExpanded(true);
                        document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#E5C378] hover:text-[#0A0D14] border border-[#C5A059]/50 font-bold px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      {lang === 'ja' ? '選択' : lang === 'zh' ? '选择' : lang === 'fr' ? 'Choisir' : lang === 'es' ? 'Elegir' : 'Select'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FLEET SHOWCASE — COMPONENT 7
          (Alphard, Granace, HiAce)
          ═══════════════════════════════════════ */}
      <section id="fleet" className="bg-[#0A0D14] border-t border-slate-800/40">
        <div ref={fleetRef} className="fade-in-section max-w-6xl mx-auto px-6 lg:px-10 py-28 md:py-36">

          <div className="text-center mb-16 space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? '車両ラインナップ' : lang === 'zh' ? '车队阵容' : 'Our Collection'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {t.fleetSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* 1. Alphard */}
            <div className="stagger-child bg-[#0E131F] border border-slate-800/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                {/* Tab bar */}
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white line-clamp-1" style={{ fontFamily: 'var(--font-serif)' }}>{t.alphardTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg shrink-0">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAlphardTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-300 ${
                          alphardTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? (lang === 'ja' ? '外観' : 'Ext')
                          : tab === 'int' ? (lang === 'ja' ? '内装' : 'Int')
                          : (lang === 'ja' ? 'トランク' : 'Trunk')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-64 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={alphardTab === 'ext' ? '/images/fleet-toyota-alphard-exterior-1477x1108.jpg' : alphardTab === 'int' ? '/images/fleet-toyota-alphard-interior-1477x1108.jpg' : '/images/fleet-toyota-alphard-trunk-1477x1108.jpg'}
                    alt="Toyota Alphard Executive"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-[13px] text-slate-400 leading-[1.6]">{t.alphardDesc}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { icon: Sparkles, text: lang === 'ja' ? 'オットマン本革シート' : 'VIP Recliners' },
                      { icon: Wifi, text: lang === 'ja' ? '車内高速Wi-Fi' : 'Free 5G Wi-Fi' },
                      { icon: Snowflake, text: lang === 'ja' ? '4WDスノー仕様' : '4WD Alpine Spec' },
                      { icon: Users, text: lang === 'ja' ? '最大4名乗車' : 'Max 4 Guests' },
                    ].map((amenity, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        <amenity.icon className="w-3 h-3 text-[#C5A059]" />
                        {amenity.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 4 Pax</span>
                  <span>4 Bags</span>
                  <span>3 Skis</span>
                </div>
              </div>
            </div>

            {/* 2. Granace */}
            <div className="stagger-child bg-[#0E131F] border border-slate-800/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                {/* Tab bar */}
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white line-clamp-1" style={{ fontFamily: 'var(--font-serif)' }}>{t.granaceTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg shrink-0">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setGranaceTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-300 ${
                          granaceTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? (lang === 'ja' ? '外観' : 'Ext')
                          : tab === 'int' ? (lang === 'ja' ? '内装' : 'Int')
                          : (lang === 'ja' ? 'トランク' : 'Trunk')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-64 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={granaceTab === 'ext' ? '/images/fleet-toyota-granace-exterior-4032x3024.jpg' : granaceTab === 'int' ? '/images/fleet-toyota-granace-interior-1477x1108.jpg' : '/images/fleet-toyota-granace-trunk-1477x1108.jpg'}
                    alt="Toyota Granace Premium Lounge"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-[13px] text-slate-400 leading-[1.6]">{t.granaceDesc}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { icon: Sparkles, text: lang === 'ja' ? '本革キャプテンシート' : 'VIP Leather Seats' },
                      { icon: Wifi, text: lang === 'ja' ? '車内高速Wi-Fi' : 'Free 5G Wi-Fi' },
                      { icon: Snowflake, text: lang === 'ja' ? '4WDスノー仕様' : '4WD Alpine Spec' },
                      { icon: Users, text: lang === 'ja' ? '最大5名乗車' : 'Max 5 Guests' },
                    ].map((amenity, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        <amenity.icon className="w-3 h-3 text-[#C5A059]" />
                        {amenity.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 5 Pax</span>
                  <span>4 Bags</span>
                  <span>4 Skis</span>
                </div>
              </div>
            </div>

            {/* 3. HiAce */}
            <div className="stagger-child bg-[#0E131F] border border-slate-800/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white line-clamp-1" style={{ fontFamily: 'var(--font-serif)' }}>{t.hiaceTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg shrink-0">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHiaceTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-300 ${
                          hiaceTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? (lang === 'ja' ? '外観' : 'Ext')
                          : tab === 'int' ? (lang === 'ja' ? '内装' : 'Int')
                          : (lang === 'ja' ? 'トランク' : 'Trunk')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-64 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={hiaceTab === 'ext' ? '/images/fleet-toyota-hiace-exterior-1477x1108.jpg' : hiaceTab === 'int' ? '/images/fleet-toyota-hiace-interior-1477x1108.jpg' : '/images/fleet-toyota-hiace-trunk-1477x1108.jpg'}
                    alt="Toyota HiAce"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-[13px] text-slate-400 leading-[1.6]">{t.hiaceDesc}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { icon: Users, text: lang === 'ja' ? '大人数9名乗車' : 'Large Groups (9 Pax)' },
                      { icon: Luggage, text: lang === 'ja' ? 'スキー8本＋荷物' : '8+ Ski Bags Space' },
                      { icon: Wifi, text: lang === 'ja' ? '車内高速Wi-Fi' : 'Free 5G Wi-Fi' },
                      { icon: Snowflake, text: lang === 'ja' ? '4WDスノー仕様' : '4WD Alpine Spec' },
                    ].map((amenity, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        <amenity.icon className="w-3 h-3 text-[#C5A059]" />
                        {amenity.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 9 Pax</span>
                  <span>9 Bags</span>
                  <span>8 Skis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          THE LUXURY EXPERIENCE — COMPONENT 6
          ═══════════════════════════════════════ */}
      <section id="services" className="bg-[#0E131F] border-t border-slate-800/40">
        <div ref={servicesRef} className="fade-in-section max-w-6xl mx-auto px-6 lg:px-10 py-28 md:py-36">

          <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? 'ラグジュアリー・コンシェルジュ' : lang === 'zh' ? '尊贵私人定制管家' : lang === 'fr' ? 'Conciergerie de Prestige' : lang === 'es' ? 'Conserjería de Lujo' : 'Bespoke Luxury Travel Concierge'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? 'ラグジュアリー体験' : lang === 'zh' ? '顶级奢华专车出行体验' : lang === 'fr' ? 'L\'Expérience du Luxe Absolu' : lang === 'es' ? 'La Experiencia de Ultra Lujo' : 'The Luxury Experience'}
            </h2>
            <p className="text-[15px] text-slate-400 leading-relaxed">
              {lang === 'ja'
                ? 'プライベートでストレスフリーな高級トラベル送迎を、お客様一人ひとりに合わせてご提案。'
                : lang === 'zh'
                ? '为您量身定制毫无压力的顶级专车接送方案，提供令人安心的无微不至专属服务。'
                : lang === 'fr'
                ? 'Nous personnalisons et coordonnons des transferts privés sans stress, vous offrant une tranquillité d\'esprit totale.'
                : lang === 'es'
                ? 'Personalizamos y coordinamos traslados privados de lujo sin estrés, brindándole total tranquilidad y confort.'
                : 'We tailor-make and coordinate private, stress-free luxury travel transfers, providing peace of mind and personalized service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
                title: { ja: 'プロフェッショナル専属乗務員', zh: '严选专业礼宾司机', fr: 'Chauffeurs Privés d\'Élite', es: 'Chóferes Privados de Élite', en: 'Certified Executive Chauffeurs' }[lang],
                desc: {
                  ja: '国土交通省の認可を受けた経験豊富な専属ドライバーが、安全第一で快適な雪道走行をご提供。',
                  zh: '经过严格背景审查与山路考核的正规绿牌职业司机，确保雪道驾驶安全平稳。',
                  fr: 'Chauffeurs hautement qualifiés et formés à la conduite sur neige pour une sécurité maximale.',
                  es: 'Chóferes altamente cualificados y formados en conducción en nieve para la máxima seguridad.',
                  en: 'Vetted, licensed commercial drivers trained in mountain snow navigation and executive VIP etiquette.',
                }[lang],
              },
              {
                image: '/images/dest-yokohama-bay-4662x5828.jpg',
                title: { ja: '完全ドアtoドア・ホテル直行', zh: '全境门到门专属直达', fr: 'Prise en Charge Portes-à-Portes', es: 'Servicio Puerta a Puerta Directo', en: 'Seamless Door-to-Door Service' }[lang],
                desc: {
                  ja: '空港や都内主要ホテルから、白馬・野沢・志賀高原のスキーリゾートへ乗り換えなしで直行。',
                  zh: '无需忍受换乘列车与拖拽雪具，从成田/羽田机场或东京酒店直接送达滑雪度假村。',
                  fr: 'Directement depuis les aéroports ou hôtels de Tokyo jusqu\'au pied de votre chalet de ski.',
                  es: 'Directamente desde aeropuertos u hoteles de Tokio hasta la puerta de su resort de esquí.',
                  en: 'Direct transfers from Haneda/Narita or Tokyo hotels to your mountain chalet with zero train transfers.',
                }[lang],
              },
              {
                image: '/images/winter-ski-snow-mountain-1500x1000.jpg',
                title: { ja: '冬季安全装備完備', zh: '顶级冬季四驱雪地装备', fr: 'Protection Hivernale 4x4', es: 'Seguridad Invernal 4WD', en: 'Winter Snow Protection' }[lang],
                desc: {
                  ja: '4WD駆動にブリヂストン・スタッドレスタイヤ装着。白馬・長野の山岳道路も安全に走行。',
                  zh: '全时四驱系统配合普利司通最新顶级防滑雪地胎，安全从容通行白马及长野高难度山地雪道。',
                  fr: 'Transmission intégrale 4x4 et pneus neige Bridgestone garantissant une adhérence parfaite sur les cols enneigés.',
                  es: 'Tracción integral 4x4 y neumáticos de nieve Bridgestone para una conducción segura por puertos de montaña nevados.',
                  en: 'Full 4WD drivetrain fitted with Bridgestone studless snow tires for safe navigation over mountain passes.',
                }[lang],
              },
            ].map((service, i) => (
              <div key={i} className="stagger-child group rounded-2xl overflow-hidden bg-[#0A0D14] border border-slate-800/40 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-70" />
                </div>
                <div className="p-7 space-y-3">
                  <h3 className="text-xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{service.title}</h3>
                  <p className="text-[14px] text-slate-400 leading-[1.7]">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          A WORLD OF LUXURY AWAITS WITH SK LIMO (ABOUT)
          (Where "Discover the SK difference" shows a message from the president)
          ═══════════════════════════════════════ */}
      <section id="about" className="bg-[#0A0D14] border-t border-slate-800/40">
        <div ref={aboutRef} className="fade-in-section max-w-6xl mx-auto px-6 lg:px-10 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image Column */}
            <div className="stagger-child relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/dest-yokohama-bay-4662x5828.jpg"
                  alt="Tokyo Departure Direct to Ski Resorts"
                  fill
                className="object-cover"
              />
            </div>

            {/* Text Column */}
            <div className="stagger-child space-y-6">
              <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
                {lang === 'ja' ? 'SK Limo トラベルコンシェルジュ' : lang === 'zh' ? 'SK Limo 日本私人定制专车' : lang === 'fr' ? 'Conciergerie SK Limo' : lang === 'es' ? 'Conserjería SK Limo' : 'SK Limo Travel Concierge'}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] text-white leading-[1.15] font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                {lang === 'ja' ? (
                  <>SK Limoで叶える、<br />極上のプライベートトラベル</>
                ) : lang === 'zh' ? (
                  <>选择 SK Limo，<br />开启日本尊荣奢华之旅</>
                ) : lang === 'fr' ? (
                  <>Un Monde de Grand Luxe<br />avec SK Limo</>
                ) : lang === 'es' ? (
                  <>Un Mundo de Distinción<br />con SK Limo</>
                ) : (
                  <>A World of Luxury Awaits<br />with SK Limo</>
                )}
              </h2>
              <p className="text-[15px] text-slate-400 leading-[1.8]">
                {lang === 'ja'
                  ? '日本の最も美しいアルペンスキーリゾートへ、ストレスフリーなプライベート送迎を。白馬・野沢温泉・志賀高原へのドアtoドアチャーターで、旅の始まりから最高の体験をお約束します。'
                  : lang === 'zh'
                  ? '为您前往日本最令人心驰神往的粉雪滑雪胜地提供全天候门到门私人专车接送。从东京及各大机场直达白马、野泽温泉与志贺高原。'
                  : lang === 'fr'
                  ? 'Voyagez en toute sérénité vers les plus beaux sommets alpins et trésors culturels du Japon avec un service de chauffeur privé exclusif.'
                  : lang === 'es'
                  ? 'Viaje con total tranquilidad hacia los mejores destinos de nieve y centros culturales de Japón con nuestro servicio de chófer privado VIP.'
                  : 'Journey to Japan\'s wildest alpine snow peaks and most wondrous cultural destinations, effortlessly. Unlock private, immersive, and ultra-exclusive chauffeur transfers, inspired by your curiosity.'}
              </p>
              <p className="text-[14px] text-slate-500 leading-[1.8]">
                {lang === 'ja'
                  ? '国土交通省認可の正規事業者として、すべての送迎に最高水準の安全性と快適性を提供いたします。'
                  : lang === 'zh'
                  ? '作为日本国土交通省官方认证的商业绿牌运营企业，我们为每一次出行提供最高等级的安全与舒适保障。'
                  : lang === 'fr'
                  ? 'En tant qu\'opérateur officiel certifié MLIT, nous veillons à chaque détail pour faire de votre séjour hivernal un moment d\'exception.'
                  : lang === 'es'
                  ? 'Como operador con licencia oficial del MLIT de Japón, garantizamos los más altos estándares de seguridad y confort.'
                  : 'As a MLIT-licensed operator, we handle all the details — big and small — so you can focus on enjoying your unique winter escape.'}
              </p>

              {/* MLIT Badge */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative h-10 w-28 shrink-0">
                  <Image src="/images/brand-sklimo-official-logo-250x250.png" alt="SK Limo" fill className="object-contain" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">{t.greenPlateTitle}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{t.mlitLicense}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsPresidentModalOpen(true)}
                  className="bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-7 py-3.5 rounded-xl text-[13px] uppercase tracking-[0.12em] transition-all duration-300 shadow-xl hover:shadow-[#C5A059]/25 flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{lang === 'ja' ? '代表メッセージを読む (The SK Difference) →' : lang === 'zh' ? '阅读董事长致辞 (The SK Difference) →' : lang === 'fr' ? 'Message du Président (The SK Difference) →' : lang === 'es' ? 'Mensaje del Presidente (The SK Difference) →' : 'Discover the SK Difference (President Message) →'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REVIEWS — COMPONENT 8
          ═══════════════════════════════════════ */}
      <section id="reviews" className="bg-[#0E131F] border-t border-slate-800/40">
        <div ref={reviewsRef} className="fade-in-section max-w-4xl mx-auto px-6 lg:px-10 py-28 md:py-36">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? 'お客様の声' : lang === 'zh' ? '尊贵客户评价' : lang === 'fr' ? 'Témoignages Clients' : lang === 'es' ? 'Testimonios de Clientes' : 'Guest Testimonials'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? 'ご利用いただいたお客様からの評価' : lang === 'zh' ? '卓越品质，赞誉见证' : lang === 'fr' ? 'Des Souvenirs Gravés avec Soin' : lang === 'es' ? 'Experiencias Inolvidables' : 'Memories Crafted with Care'}
            </h2>
          </div>

          <div className="relative bg-[#0A0D14] rounded-3xl p-8 sm:p-12 border border-slate-800/60 shadow-2xl">
            <div className="flex items-center gap-1 text-[#C5A059] mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#C5A059]" />
              ))}
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed italic mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
              &ldquo;{REVIEWS[reviewIndex].text[lang]}&rdquo;
            </p>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-6">
              <div>
                <span className="font-bold text-white text-sm block">{REVIEWS[reviewIndex].author}</span>
                <span className="text-xs text-slate-400">{REVIEWS[reviewIndex].location}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goReview('prev')}
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-[#C5A059] hover:text-[#0A0D14] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goReview('next')}
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-[#C5A059] hover:text-[#0A0D14] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRIP.COM "HOW IT WORKS" 3-STEP PROCESS
          ═══════════════════════════════════════ */}
      <section className="bg-[#0A0D14] border-t border-slate-800/40">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-24 md:py-32">

          <div className="text-center mb-16 space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? 'ご利用の流れ' : lang === 'zh' ? '预订流程' : lang === 'fr' ? 'Comment Ça Marche' : lang === 'es' ? 'Cómo Funciona' : 'How It Works'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? '3ステップで完了する簡単送迎' : lang === 'zh' ? '三步轻松开启专属包车' : lang === 'fr' ? 'Un Trajet Serein en 3 Étapes' : lang === 'es' ? 'Su Viaje en 3 Sencillos Pasos' : 'Seamless 3-Step Experience'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: { ja: 'Web・WhatsAppで見積り', zh: '在线或WhatsApp获取一口价', fr: 'Devis Fixe Immédiat', es: 'Cotización Fija Inmediata', en: 'Instant Fixed Quote' }[lang],
                desc: {
                  ja: '乗車地・目的地・日時・お荷物数を入力。高速料金・燃料代込みの明朗定額をご案内。',
                  zh: '选择出发地、目的地、日期及人数行李，实时获取包含高速费与税费的透明一口价。',
                  fr: 'Sélectionnez votre itinéraire, date et équipement pour un tarif fixe garanti tout compris.',
                  es: 'Indique su ruta, fecha y equipaje para obtener una tarifa fija transparente y con todo incluido.',
                  en: 'Select your route, date, and gear count for transparent, all-inclusive fixed pricing.',
                }[lang],
              },
              {
                step: '02',
                title: { ja: '空港到着口でお出迎え', zh: '机场到达口专属举牌迎接', fr: 'Accueil à la Porte des Arrivées', es: 'Bienvenida en Sala de Llegadas', en: 'Arrival Gate Meet & Greet' }[lang],
                desc: {
                  ja: 'フライトをリアルタイム追跡。到着ゲート前で専属ドライバーがネームボードを持ってお待ちします。',
                  zh: '系统自动追踪航班动态，司机身着制服在到达口举牌迎接，并协助搬运所有大件行李。',
                  fr: 'Suivi radar de votre vol en direct, chauffeur vous attendant avec panneau nominatif et prise en charge des bagages.',
                  es: 'Seguimiento de su vuelo en vivo, chófer con cartel a su nombre en la salida y asistencia con equipaje.',
                  en: 'Chauffeur tracks your flight live, greets you with a personalized nameboard & handles luggage.',
                }[lang],
              },
              {
                step: '03',
                title: { ja: 'リゾートまで直行快適移動', zh: '直达度假木屋平稳舒适', fr: 'Trajet Direct Porte-à-Porte', es: 'Traslado Directo a su Destino', en: 'Direct Door-to-Door' }[lang],
                desc: {
                  ja: '全車4WD・スノータイヤ完備の最高級車両で、雪道の運転も安心。宿泊先まで直行いたします。',
                  zh: '乘坐标配4WD及雪地胎的顶级豪华专车，无需拖带行李换乘火车，平稳直达雪场酒店。',
                  fr: 'Détendez-vous dans un véhicule 4x4 ultra-confortable directement jusqu\'à votre chalet sans aucune correspondance.',
                  es: 'Relájese en un vehículo 4WD de máximo confort directo a su alojamiento sin transbordos molestos.',
                  en: 'Relax in whisper-quiet 4WD luxury straight to your chalet without train transfers or bus delays.',
                }[lang],
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#0A0D14] border border-slate-800/60 rounded-2xl p-7 space-y-4 relative hover:border-[#C5A059]/40 transition-colors">
                <span className="text-3xl font-black font-mono text-[#C5A059]/40 block">{item.step}</span>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{item.title}</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ROUTES / PRICING TABLE — COMPONENT 9
          ═══════════════════════════════════════ */}
      <section id="routes" className="bg-[#0A0D14] border-t border-slate-800/40">
        <div ref={routesRef} className="fade-in-section max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-20 md:py-32">

          <div className="text-center mb-10 sm:mb-14 space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? '固定料金一覧' : lang === 'zh' ? '一口价价目表' : lang === 'fr' ? 'Tarifs Fixes Garantis' : lang === 'es' ? 'Tarifas Fijas Garantizadas' : 'Fixed Rate Routes'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {t.routesSectionTitle}
            </h2>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2 pt-1">
              <Check className="w-4 h-4 text-emerald-400" />
              {lang === 'ja'
                ? '高速道路通行料・燃料代・乗務員手当・手荷物積載料 すべて込みの安心定額'
                : lang === 'zh'
                ? '包含高速公路通行费、燃油费、司机服务费及行李搬运的全包一口价'
                : lang === 'fr'
                ? 'Tarifs forfaitaires garantis incluant péages d\'autoroute, carburant et chauffeur privé'
                : lang === 'es'
                ? 'Tarifas fijas garantizadas con peajes de autopista, gasolina y chófer incluidos'
                : 'All-inclusive fixed pricing: Highway tolls, fuel, chauffeur & luggage assistance included'}
            </p>
          </div>

          <div className="overflow-x-auto w-full rounded-2xl border border-slate-800/60 shadow-xl bg-[#0A0D14]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 bg-[#0E131F]/70">
                  <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-medium">{t.routeOrigin}</th>
                  <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-medium">{t.routeDest}</th>
                  <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-medium">{t.routeGranace}</th>
                  <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-slate-400 font-medium">{t.routeHiace}</th>
                  <th className="px-5 py-4 text-right text-[11px] uppercase tracking-wider text-slate-400 font-medium">&nbsp;</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {[
                  { from: { ja: '羽田空港 [HND]', zh: '羽田机场 [HND]', fr: 'Aéroport Haneda [HND]', es: 'Aeropuerto Haneda [HND]', en: 'Haneda Airport [HND]' }[lang], to: { ja: '白馬エリア', zh: '白马滑雪区', fr: 'Hakuba Valley', es: 'Valle de Hakuba', en: 'Hakuba Valley' }[lang], time: '3.5 - 4h', tag: { ja: '人気No.1', zh: '人气之选', fr: 'Populaire', es: 'Popular', en: 'Most Popular' }[lang], g: '¥130,000', h: '¥120,000', pId: 'hnd', dId: 'hakuba' },
                  { from: { ja: '成田空港 [NRT]', zh: '成田机场 [NRT]', fr: 'Aéroport Narita [NRT]', es: 'Aeropuerto Narita [NRT]', en: 'Narita Airport [NRT]' }[lang], to: { ja: '白馬エリア', zh: '白马滑雪区', fr: 'Hakuba Valley', es: 'Valle de Hakuba', en: 'Hakuba Valley' }[lang], time: '4.5 - 5h', tag: { ja: '直行便対応', zh: '国际直达', fr: 'Direct', es: 'Directo', en: 'Direct Pickup' }[lang], g: '¥145,000', h: '¥135,000', pId: 'nrt', dId: 'hakuba' },
                  { from: { ja: '東京都内ホテル', zh: '东京市区酒店', fr: 'Hôtels de Tokyo', es: 'Hoteles de Tokio', en: 'Central Tokyo' }[lang], to: { ja: '野沢 / 志賀高原', zh: '野泽温泉 / 志贺高原', fr: 'Nozawa / Shiga Kogen', es: 'Nozawa / Shiga Kogen', en: 'Nozawa / Shiga Kogen' }[lang], time: '3.5 - 4h', tag: { ja: '温泉スキー', zh: '温泉滑雪', fr: 'Onsen Ski', es: 'Onsen Esquí', en: 'Onsen Ski' }[lang], g: '¥120,000', h: '¥110,000', pId: 'tokyo_hotel', dId: 'nozawa' },
                ].map((route, i) => (
                  <tr key={i} className="hover:bg-[#0E131F] transition-colors duration-200">
                    <td className="px-5 py-4 text-white font-medium">
                      <div className="flex flex-col">
                        <span>{route.from}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-normal">
                          <Clock className="w-3 h-3 text-slate-500" /> {route.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#C5A059] font-medium">{route.to}</span>
                        {route.tag && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/40 rounded-full font-bold">
                            {route.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#C5A059] font-bold">{route.g}</td>
                    <td className="px-5 py-4 font-mono text-slate-300 font-bold">{route.h}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setPickupId(route.pId);
                          setDestinationId(route.dId);
                          setIsLookupExpanded(true);
                          document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 shadow hover:shadow-[#C5A059]/20 cursor-pointer"
                      >
                        {lang === 'ja' ? '選択' : lang === 'zh' ? '选择' : lang === 'fr' ? 'Choisir' : lang === 'es' ? 'Elegir' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRIP.COM STYLE FAQ ACCORDION
          ═══════════════════════════════════════ */}
      <section className="bg-[#0E131F] border-t border-slate-800/40">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-24 md:py-32">

          <div className="text-center mb-14 space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? 'よくあるご質問' : lang === 'zh' ? '常见问题' : lang === 'fr' ? 'Foire Aux Questions' : lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? 'ご予約・運行に関するFAQ' : lang === 'zh' ? '行程预订与专车保障答疑' : lang === 'fr' ? 'Tout Ce Que Vous Devez Savoir' : lang === 'es' ? 'Todo lo que Necesita Saber' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: {
                  ja: 'フライトが遅延した場合はどうなりますか？',
                  zh: '如果航班发生延误，接机如何处理？',
                  fr: 'Que se passe-t-il si notre vol a du retard ?',
                  es: '¿Qué ocurre si nuestro vuelo se retrasa?',
                  en: 'What happens if our flight is delayed?',
                }[lang],
                a: {
                  ja: '便名を事前にいただき、専属配車チームがリアルタイムで着陸状況を追跡いたします。遅延による追加待機料金は原則無料ですので、安心して入国審査・手荷物受取へお進みください。',
                  zh: '请在预订时提供航班号，我们的调度团队将使用雷达实时监控航班起降。因航班延误产生的等待时间完全免费，请从容办理入境与行李提取。',
                  fr: 'Nous suivons votre vol en direct par radar. Les horaires du chauffeur sont automatiquement ajustés sans aucun frais d\'attente supplémentaire.',
                  es: 'Supervisamos su vuelo en tiempo real mediante radar. El chófer ajusta su llegada automáticamente sin cargos extra por espera.',
                  en: 'We monitor your flight in real-time using live radar. Chauffeur arrival times are adjusted automatically with no extra waiting fee for delayed flights.',
                }[lang],
              },
              {
                q: {
                  ja: 'スキー板やスノーボードは何本まで積載可能ですか？',
                  zh: '每辆专车最多可以装载多少套雪具与行李？',
                  fr: 'Combien de housses de ski et valises peuvent être chargées ?',
                  es: '¿Cuánto equipaje y esquís caben en el vehículo?',
                  en: 'How much ski and snowboard luggage fits?',
                }[lang],
                a: {
                  ja: 'トヨタ グランエース（VIP仕様）はスーツケース4個＋スキーバッグ4本、ハイエース グランドキャビンはスーツケース9個＋スキーバッグ8本以上を積載可能です。',
                  zh: '丰田 Granace 豪华商务车可装载4个托运行李箱与4套滑雪板（最多5位乘客）；丰田 HiAce 大容量客车可装载9个大号行李箱与8套以上滑雪板（最多9位乘客）。',
                  fr: 'Le Toyota Granace accueille 4 valises et 4 housses de ski (jusqu\'à 5 passagers). Le Toyota HiAce Grand Cabin peut transporter 9 valises et 8+ housses de ski (jusqu\'à 9 passagers).',
                  es: 'El Toyota Granace admite 4 maletas grandes y 4 bolsas de esquí (hasta 5 pasajeros). El Toyota HiAce Grand Cabin admite 9 maletas y 8+ bolsas de esquí (hasta 9 pasajeros).',
                  en: 'Toyota Granace accommodates 4 large suitcases + 4 ski bags (up to 5 guests). Toyota HiAce Grand Cabin accommodates 9 suitcases + 8+ ski bags (up to 9 guests).',
                }[lang],
              },
              {
                q: {
                  ja: '料金には高速道路代や燃料代が含まれていますか？',
                  zh: '报价中是否已经包含高速公路通行费与燃油费？',
                  fr: 'Les péages, le carburant et les taxes sont-ils inclus ?',
                  es: '¿Están incluidos los peajes de autopista y la gasolina?',
                  en: 'Are highway tolls, fuel, and taxes included in the quote?',
                }[lang],
                a: {
                  ja: 'はい、SK Limoのお見積り・固定料金はすべて高速料金、ガソリン代、乗務員費用、消費税を含んだ完全明朗会計です。当日追加請求はございません。',
                  zh: '是的，SK Limo 的所有报价均为100%全包一口价，包含全程高速公路过路费、燃油费、司机服务费以及日本消费税，绝无隐形加价。',
                  fr: 'Oui. Tous nos devis sont 100% tout compris (péages d\'autoroute, carburant, frais de chauffeur et taxes inclus). Aucun surcoût imprévu.',
                  es: 'Sí. Todas las tarifas son 100% todo incluido (peajes de autopista, combustible, honorarios del chófer e impuestos). Sin sorpresas.',
                  en: 'Yes. All quotes are 100% all-inclusive (highway tolls, fuel, chauffeur fee, and consumption tax included). No surprise surcharges.',
                }[lang],
              },
              {
                q: {
                  ja: '途中でコンビニやスキーレンタルショップに立ち寄ることはできますか？',
                  zh: '途中是否可以临时停靠便利店或雪具租赁店？',
                  fr: 'Pouvons-nous faire des arrêts en route pour des courses ou louer du matériel ?',
                  es: '¿Podemos hacer paradas en ruta para compras o alquiler de esquís?',
                  en: 'Can we make brief stops along the route for groceries or ski gear rentals?',
                }[lang],
                a: {
                  ja: 'はい、ルート上のコンビニエンスストア、サービスエリア、またはスキーレンタルショップへの無料立ち寄り（20〜30分程度）が可能です。ご予約時または乗務員へお気軽にお申し付けください。',
                  zh: '可以！在前往雪场的沿途，我们支持免费停靠高速公路休息区、便利店或雪具租赁店（约20-30分钟），只需提前告知或在车上与司机沟通即可。',
                  fr: 'Absolument ! Des arrêts de courtoisie de 20 à 30 minutes sur les aires d\'autoroute ou dans des boutiques de location de ski sont inclus sur demande.',
                  es: '¡Por supuesto! Se incluyen paradas de cortesía de 20 a 30 minutos en áreas de servicio o tiendas de alquiler de esquí bajo petición.',
                  en: 'Yes! Complimentary 20-30 minute stops at highway rest stops, convenience stores, or ski rental shops along the way are included upon request.',
                }[lang],
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-[#0E131F] border border-slate-800/60 rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden transition-colors hover:border-slate-700"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-semibold text-white group-open:text-[#C5A059] transition-colors">{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform duration-300">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <p className="mt-3 text-[13px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/40">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
      {/* ═══════════════════════════════════════
          OFFICIAL SK LIMO LEGAL FOOTER
          ═══════════════════════════════════════ */}
      <SiteFooter />

      {/* ═══════════════════════════════════════
          MESSAGE FROM THE PRESIDENT MODAL
          ═══════════════════════════════════════ */}
      {isPresidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) setIsPresidentModalOpen(false); }}>
          <div className="bg-[#0E131F] border-2 border-[#C5A059]/50 rounded-3xl p-6 sm:p-10 max-w-2xl w-full space-y-6 relative shadow-2xl animate-slide-in">
            <button
              type="button"
              onClick={() => setIsPresidentModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
              <div className="relative h-10 w-28 shrink-0">
                <Image src="/images/sklimo-official-logo.png" alt="SK Limo" fill className="object-contain" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-widest block">
                  {lang === 'ja' ? '代表取締役メッセージ' : lang === 'zh' ? '董事长致辞' : lang === 'fr' ? 'Message du Président' : lang === 'es' ? 'Mensaje del Presidente' : 'Message from the President & CEO'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {lang === 'ja' ? '最高峰の安全とおもてなしを' : lang === 'zh' ? '融合至诚款待与极致安全保障' : lang === 'fr' ? 'L\'Excellence et la Sécurité Japonaise' : lang === 'es' ? 'Excelencia y Seguridad Japonesa' : 'The SK Limo Standard of Excellence'}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>
                {lang === 'ja'
                  ? '平素は株式会社SKリモをご愛顧賜り、心より御礼申し上げます。'
                  : lang === 'zh'
                  ? '衷心感谢您选择 SK Limo 日本豪华专车服务。'
                  : lang === 'fr'
                  ? 'Nous vous remercions chaleureusement de votre confiance envers SK Limo.'
                  : lang === 'es'
                  ? 'Les damos nuestra más sincera bienvenida y agradecemos su confianza en SK Limo.'
                  : 'A heartfelt welcome to Japan and thank you for choosing SK Limo.'}
              </p>
              <p>
                {lang === 'ja'
                  ? '弊社は、日本の伝統的な「おもてなし」の心と、世界水準の安全性・快適性を融合させたハイヤーサービスをお届けすることを使命としております。国土交通省認可（関自旅第1234号）の正規緑ナンバー事業者として、全車無制限の旅客賠償責任保険を完備し、プロフェッショナルな専属ドライバーのみが運行を担当いたします。'
                  : lang === 'zh'
                  ? '我们致力于将日本传统的“盛情款待”（Omotenashi）与世界顶级的安全及舒适出行完美融合。作为日本国土交通省正式认证的绿牌商业运营企业（关自旅第1234号），我们为每辆车配备全额旅客商业责任险，所有专车均由经验丰富、通过严格审查的职业司机驾驶。'
                  : lang === 'fr'
                  ? 'Notre mission est d\'offrir un service de transport privé d\'exception alliant l\'hospitalité japonaise traditionnelle (Omotenashi) aux plus hauts standards de sécurité internationaux. En tant qu\'opérateur officiel certifié plaque verte (Licence MLIT N° 1234), chaque véhicule bénéficie d\'une assurance passager illimitée et est conduit par des chauffeurs d\'élite.'
                  : lang === 'es'
                  ? 'Nuestra misión es brindar una experiencia de transporte privado insuperable, uniendo la tradicional hospitalidad japonesa (Omotenashi) con los más rigurosos estándares de seguridad mundial. Con licencia oficial del MLIT (Placa Verde N° 1234), cada vehículo cuenta con seguro ilimitado para pasajeros y chóferes profesionales.'
                  : 'Our mission is to redefine private ground transportation across Japan by uniting timeless Japanese Omotenashi (uncompromising hospitality) with international executive safety standards. As an official MLIT-licensed green-plate commercial operator (Kanto License No. 1234), every vehicle carries unlimited passenger liability insurance and is piloted by certified, vetted chauffeurs.'}
              </p>
              <p>
                {lang === 'ja'
                  ? '特に冬季の長野・白馬・野沢温泉等のアルペンリゾート送迎におきましては、全車4WD駆動およびブリヂストン製最新スタッドレスタイヤを標準装備し、過酷な雪道でも安心・安全かつ静粛な乗り心地をお約束いたします。'
                  : lang === 'zh'
                  ? '针对长野白马、野泽温泉、志贺高原等冬季滑雪度假包车，我们全系车型标配全时四驱系统及普利司通顶级防滑雪地胎，确保在严苛的雪道环境下依然平稳、安全、静谧。'
                  : lang === 'fr'
                  ? 'Pour les transferts hivernaux vers Hakuba, Nozawa Onsen et Shiga Kogen, notre flotte est intégralement équipée de transmission 4x4 et de pneus neige Bridgestone haut de gamme, garantissant une sérénité totale sur les routes enneigées.'
                  : lang === 'es'
                  ? 'Para nuestros traslados de invierno hacia Hakuba, Nozawa Onsen y Shiga Kogen, toda la flota dispone de tracción 4x4 y neumáticos de nieve Bridgestone, asegurando un viaje seguro y confortable.'
                  : 'For winter alpine charters to Hakuba, Nozawa Onsen, and Shiga Kogen, our entire fleet is equipped with genuine 4WD drivetrains and Bridgestone studless snow tires, guaranteeing complete tranquility over snowy mountain passes.'}
              </p>
              <p>
                {lang === 'ja'
                  ? 'お客様一人ひとりの旅路が、生涯忘れられない素晴らしい想い出となりますよう、全社員一丸となって誠心誠意サポートさせていただきます。'
                  : lang === 'zh'
                  ? '我们全体团队将竭诚为您提供尽善尽美的服务，让您的每一次日本之行都成为难忘的尊贵回忆。'
                  : lang === 'fr'
                  ? 'Que vous voyagiez pour affaires, en famille ou pour skier la plus belle poudreuse, toute notre équipe se tient à votre entière disposition.'
                  : lang === 'es'
                  ? 'Ya sea que viaje por negocios, vacaciones familiares o para esquiar en la mejor nieve, es un honor ser su socio de confianza en Japón.'
                  : 'Whether you are visiting for international business, a family vacation, or a powder ski getaway, we are deeply honored to be your trusted chauffeur partner in Japan.'}
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-white font-bold text-sm block">Kenji Sato (佐藤 健司)</span>
                <span className="text-[11px] text-slate-400">President &amp; Representative Director, SK Limo Co., Ltd.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPresidentModalOpen(false);
                  setIsBookingModalOpen(true);
                }}
                className="bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                {lang === 'ja' ? '予約・相談へ進む' : lang === 'zh' ? '开始预订专车' : lang === 'fr' ? 'Réserver Votre Chauffeur' : lang === 'es' ? 'Reservar su Chófer' : 'Book Your Chauffeur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          BOOKING MODAL
          ═══════════════════════════════════════ */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsBookingModalOpen(false); }}>
          <div className="bg-[#0E131F] border border-slate-800/60 rounded-2xl p-8 max-w-md w-full space-y-5 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ja' ? 'ご予約リクエスト' : lang === 'zh' ? '预订申请' : lang === 'fr' ? 'Demande de Réservation' : lang === 'es' ? 'Solicitud de Reserva' : 'Reservation Request'}
            </h3>

            {bookingStep === 1 ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="bg-[#0A0D14] p-4 rounded-xl border border-slate-800/40 space-y-1.5">
                  <p className="text-[12px] text-slate-500">{lang === 'ja' ? 'ルート＆日程' : lang === 'zh' ? '路线与日期' : lang === 'fr' ? 'Itinéraire & Date' : lang === 'es' ? 'Ruta y Fecha' : 'Route & Date'}</p>
                  <p className="text-sm text-white font-medium">
                    {lang === 'ja' ? selectedPickup?.nameJa : selectedPickup?.name} → {lang === 'ja' ? selectedDest?.nameJa : selectedDest?.name}
                  </p>
                  <p className="text-[12px] text-slate-500">{lang === 'ja' ? '利用日' : lang === 'zh' ? '日期' : 'Date'}: {travelDate}</p>
                  <p className="text-lg text-[#C5A059] font-mono font-bold">{quoteResult.formattedTotalPrice} JPY</p>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 text-sm font-medium">
                    {lang === 'ja' ? 'お名前' : lang === 'zh' ? '姓名 / Full Name' : lang === 'fr' ? 'Nom et Prénom' : lang === 'es' ? 'Nombre Completo' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-4 py-3 text-white text-sm focus:border-[#C5A059] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 text-sm font-medium">
                    {lang === 'ja' ? 'メールアドレス' : lang === 'zh' ? '电子邮箱 / Email' : lang === 'fr' ? 'Adresse E-mail' : lang === 'es' ? 'Correo Electrónico' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-4 py-3 text-white text-sm focus:border-[#C5A059] focus:outline-none transition-colors"
                  />
                </div>

                {/* Payment Option Selector */}
                <div className="border-t border-slate-800/60 pt-3 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    {lang === 'ja' ? 'お支払い方法' : lang === 'zh' ? '支付方式' : lang === 'fr' ? 'Mode de Paiement' : lang === 'es' ? 'Método de Pago' : 'Preferred Payment'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 bg-[#0A0D14] border border-[#C5A059]/40 p-2.5 rounded-lg cursor-pointer text-slate-200">
                      <input type="radio" name="winterPaymentMethod" defaultChecked className="accent-[#C5A059]" />
                      <span>💳 {lang === 'ja' ? 'クレジットカード' : lang === 'zh' ? '信用卡支付' : lang === 'fr' ? 'Carte Bancaire' : lang === 'es' ? 'Tarjeta de Crédito' : 'Credit Card'}</span>
                    </label>
                    <label className="flex items-center gap-2 bg-[#0A0D14] border border-slate-800 p-2.5 rounded-lg cursor-pointer text-slate-200">
                      <input type="radio" name="winterPaymentMethod" className="accent-[#C5A059]" />
                      <span>🅿️ PayPal</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#C5A059]" /> {lang === 'ja' ? '256ビット暗号化・安心安全な決済' : lang === 'zh' ? '256位加密安全传输，确认后发送支付链接' : lang === 'fr' ? 'Cryptage SSL 256 bits sécurisé' : lang === 'es' ? 'Encriptación de 256 bits segura' : '256-bit Encrypted. Secure card invoice dispatched upon review.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-3 rounded-lg transition-all duration-300 text-[13px] uppercase tracking-wider cursor-pointer"
                >
                  {lang === 'ja' ? '予約・決済へ進む' : lang === 'zh' ? '提交预订并进入支付' : lang === 'fr' ? 'Procéder au Paiement Sécurisé' : lang === 'es' ? 'Proceder al Pago Seguro' : 'Proceed to Card / PayPal Booking'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-white font-bold text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                  {lang === 'ja' ? '受付完了' : lang === 'zh' ? '预订申请已受理' : lang === 'fr' ? 'Demande Reçue avec Succès' : lang === 'es' ? 'Solicitud Recibida con Éxito' : 'Reservation Request Received'}
                </p>
                <p className="text-sm text-slate-400">
                  {lang === 'ja'
                    ? `${passengerName}様、ご予約ありがとうございます。配車デスクが内容を確認の上、2時間以内に${passengerEmail}へ決済のご案内をお送りいたします。`
                    : lang === 'zh'
                    ? `感谢您，${passengerName}。我们的调度团队正在审核您的行程，将在2小时内将安全支付凭证发送至 ${passengerEmail}。`
                    : lang === 'fr'
                    ? `Merci ${passengerName}. Notre équipe vérifie vos détails et vous enverra la facture sécurisée à ${passengerEmail} sous 2 heures.`
                    : lang === 'es'
                    ? `Gracias ${passengerName}. Nuestro equipo está revisando los detalles y le enviará la factura segura a ${passengerEmail} en menos de 2 horas.`
                    : `Thank you ${passengerName}. Dispatch is reviewing your transfer details and will send your secure Credit Card / PayPal invoice to ${passengerEmail} within 2 hours.`}
                </p>
                <button
                  onClick={() => { setIsBookingModalOpen(false); setBookingStep(1); }}
                  className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors hover:bg-slate-700 cursor-pointer"
                >
                  {lang === 'ja' ? '閉じる' : lang === 'zh' ? '关闭' : lang === 'fr' ? 'Fermer' : lang === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trip.com-Inspired Sticky Bottom Booking Assistant Bar (Visible on scroll) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 transform ${
          headerScrolled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#0A0D14]/95 backdrop-blur-xl border-t border-slate-800/80 shadow-2xl px-4 sm:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Route & Live Price Summary */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">
                  {lang === 'ja' ? selectedPickup?.nameJa : selectedPickup?.name} → <span className="text-[#C5A059] font-bold">{lang === 'ja' ? selectedDest?.nameJa : selectedDest?.name}</span>
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden xs:inline">{t.totalEstimatedQuote}:</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white">
                  {quoteResult.formattedTotalPrice} <span className="text-xs text-[#C5A059]">JPY</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium hidden md:inline ml-1">
                  ({lang === 'ja' ? '高速・燃料・税込' : 'All-Inclusive'})
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5">
              <a
                href={quoteResult.whatsAppMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold px-3.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-[#0A0D14]" />
                <span className="hidden xs:inline">WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-4 sm:px-5 py-2 rounded-lg text-[11px] sm:text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ja' ? '予約リクエスト' : 'Book Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
