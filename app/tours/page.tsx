'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Mountain,
  Compass,
  MapPin,
  Calendar,
  Users,
  Luggage,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Globe,
  Sparkles,
  Car,
  Wifi,
  Snowflake,
  Star,
  Clock,
  Phone,
  Flame,
  Award,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';

function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Guaranteed safety fallback so content is never invisible
    const fallback = setTimeout(() => el.classList.add('is-visible'), 400);

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

type GrandPackageType = 'airport' | 'sightseeing' | 'ski';

export default function GrandToursHomePage() {
  const router = useRouter();
  const [lang, setLang] = useLanguage();

  // Plan Your Tour State (Airport Transfer default, Alphard default)
  const [selectedPackage, setSelectedPackage] = useState<GrandPackageType>('airport');
  const [selectedVehicle, setSelectedVehicle] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [pickupLocation, setPickupLocation] = useState<string>('hnd');
  const [destinationLocation, setDestinationLocation] = useState<string>('tokyo_hotel');
  const [passengers, setPassengers] = useState<number>(3);
  const [luggage, setLuggage] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  // Fleet Tabs
  const [alphardTab, setAlphardTab] = useState<'ext' | 'int' | 'trunk'>('ext');
  const [granaceTab, setGranaceTab] = useState<'ext' | 'int' | 'trunk'>('ext');
  const [hiaceTab, setHiaceTab] = useState<'ext' | 'int' | 'trunk'>('ext');

  // Section Refs
  const packagesRef = useScrollFadeIn();
  const plannerRef = useScrollFadeIn();
  const fleetRef = useScrollFadeIn();
  const trustRef = useScrollFadeIn();

  const t = TRANSLATIONS[lang];

  // Multilingual UI Content Dictionary
  const ui = {
    heroBadge: {
      ja: '国土交通省許可 緑ナンバー正規運行',
      zh: '日本国土交通省认证 商业绿牌正规营运',
      fr: 'Opérateur Agréé Officiel Plaque Verte MLIT',
      es: 'Operador Certificado Oficial Placa Verde MLIT',
      en: 'MLIT Licensed Luxury Chauffeur Service',
    }[lang],
    heroH1Line1: {
      ja: '極上の移動体験を、',
      zh: '尊享日本奢华专车，',
      fr: 'L\'Excellence du Voyage Privé,',
      es: 'La Excelencia en Viajes Privados,',
      en: 'Japan Luxury Chauffeur',
    }[lang],
    heroH1Line2: {
      ja: '日本全国の旅路へ',
      zh: '畅游东洋至美景致',
      fr: 'À Travers Tout le Japon',
      es: 'Por Todo Japón',
      en: '& Private Tours',
    }[lang],
    heroSub: {
      ja: '成田・羽田空港のVIPドアtoドア送迎から、富士山・箱根の1日プライベート観光、白馬・野沢のスキー送迎まで。最高峰のアルファード・グランエースでお届けします。',
      zh: '从成田、羽田机场VIP门到门接送，到富士山、箱根全日私人定制包车，再到白马、野泽温泉的滑雪专车。丰田埃尔法与格兰亚为您带来无与伦比的旅途舒适。',
      fr: 'Des transferts aéroport VIP Tokyo aux circuits privés sur mesure au Mont Fuji et séjours de ski alpins. Voyagez au Japon dans un confort d\'exception.',
      es: 'Desde traslados VIP desde aeropuertos de Tokio hasta tours privados a medida al Monte Fuji y transfers de esquí alpino. Viaje por Japón con el máximo confort.',
      en: 'From VIP Tokyo Airport transfers to bespoke Mount Fuji sightseeing and alpine ski charters. Travel Japan in uncompromising comfort with our executive fleet.',
    }[lang],
    planCta: {
      ja: 'ツアー・送迎を計画する',
      zh: '开始定制行程与估价',
      fr: 'Planifier Votre Trajet',
      es: 'Planificar Su Viaje',
      en: 'Plan Your Tour',
    }[lang],
    explorePackagesCta: {
      ja: 'グランドパッケージを見る',
      zh: '查看三大核心套餐',
      fr: 'Explorer les Forfaits',
      es: 'Explorar Paquetes',
      en: 'Explore Grand Packages',
    }[lang],
    plannerCategory: {
      ja: 'ツアープランナー',
      zh: '行程智能选择器',
      fr: 'Sélecteur de Voyage',
      es: 'Selector de Viaje',
      en: 'Interactive Tour Selector',
    }[lang],
    plannerHeading: {
      ja: 'ご希望の旅を選んで詳細へ',
      zh: '选择您的定制专属旅程',
      fr: 'Personnalisez Votre Itinéraire',
      es: 'Personalice Su Viaje Exclusivo',
      en: 'Plan Your Luxury Journey',
    }[lang],
    plannerSubtitle: {
      ja: '目的のパッケージと車両をお選びください。詳細ページにて確約料金とツアースケジュールをご確認いただけます。',
      zh: '选择您期望的套餐与车型，点击下方按钮进入详情页查看透明一口价与完整行程规划。',
      fr: 'Sélectionnez votre forfait et véhicule. Consultez les tarifs garantis et itinéraires complets sur la page dédiée.',
      es: 'Seleccione su paquete y vehículo. Consulte tarifas fijas e itinerarios detallados en la página correspondiente.',
      en: 'Select your preferred Grand Package and vehicle. Proceed to view guaranteed rates, detailed itineraries, and secure booking.',
    }[lang],
    step1Label: {
      ja: '1. グランドパッケージを選択',
      zh: '1. 选择尊享套餐类别',
      fr: '1. Choisir Votre Forfait',
      es: '1. Seleccionar Paquete',
      en: '1. Select Grand Package',
    }[lang],
    step2Label: {
      ja: '2. 運行車両を選択 (アルファード標準)',
      zh: '2. 选择专车车型 (埃尔法标准配置)',
      fr: '2. Choisir le Véhicule (Alphard par Défaut)',
      es: '2. Elegir Vehículo (Alphard por Defecto)',
      en: '2. Select Vehicle (Toyota Alphard Default)',
    }[lang],
    viewRatesCta: {
      ja: '料金・プラン詳細を見る →',
      zh: '查看一口价与详细行程 →',
      fr: 'Voir les Tarifs et Détails →',
      es: 'Ver Tarifas y Detalles →',
      en: 'View Route Rates & Details →',
    }[lang],
    fixedPriceBannerTitle: {
      ja: '完全定額保証・高速料金＆諸経費込み',
      zh: '全包一口价保证 • 包含高速费与税费',
      fr: 'Tarif Fixe Tout Compris • Péages Inclus',
      es: 'Tarifa Fija Todo Incluido • Peajes Incluidos',
      en: 'All-Inclusive Fixed Fares Guaranteed',
    }[lang],
    fixedPriceBannerSub: {
      ja: '詳細ページで即時料金確認・フライト便名入力・クレジットカード/PayPal決済が可能です。',
      zh: '进入详情页可直接查看一口价、输入航班号及使用信用卡或PayPal完成预订。',
      fr: 'Consultez les prix exacts, renseignez vos vols et réservez par carte ou PayPal.',
      es: 'Consulte precios exactos, ingrese número de vuelo y reserve por tarjeta o PayPal.',
      en: 'Click below to view fixed route rates, vehicle capacity details, and instant booking.',
    }[lang],
    grandPackagesSectionTitle: {
      ja: 'SK Limo グランドパッケージ',
      zh: 'SK Limo 三大尊享核心套餐',
      fr: 'Nos 3 Forfaits d\'Exception',
      es: 'Nuestros 3 Paquetes Exclusivos',
      en: 'Our 3 Grand Packages',
    }[lang],
    grandPackagesSectionSub: {
      ja: '日本滞在を最高のものにする3つの特化型プライベートチャーター。安心の完全定額と熟練ドライバーでおもてなしいたします。',
      zh: '专为高品位国际旅客打造的三大专车服务体系，提供安心透明的固定一口价与资深专业司机。',
      fr: 'Trois piliers de transport VIP sur mesure conçus pour les voyageurs exigeants à travers le Japon.',
      es: 'Tres pilares de transporte VIP diseñados para viajeros exigentes por todo Japón.',
      en: 'Three bespoke private chauffeur pillars tailored for discerning international travelers across Tokyo and Japan.',
    }[lang],
  };

  // Vehicles Data with Multilingual Names & Descriptions
  const vehicleData = {
    alphard: {
      name: {
        ja: 'トヨタ アルファード エグゼクティブラウンジ',
        zh: '丰田埃尔法 Alphard 行政酒廊版',
        fr: 'Toyota Alphard Executive Lounge',
        es: 'Toyota Alphard Executive Lounge',
        en: 'Toyota Alphard Executive Lounge',
      }[lang],
      tagline: {
        ja: 'VIPオットマン本革シート (最大4名)',
        zh: '头等舱独立航空座椅 (最多4位乘客)',
        fr: 'Fauteuils Capitaine VIP (Max 4 Pers)',
        es: 'Asientos VIP Reclinables (Máx 4 Pax)',
        en: 'VIP Ottoman Recliners (Max 4 Pax)',
      }[lang],
      maxPax: 4,
      maxLuggage: 4,
      image: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      intImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      desc: {
        ja: '最高峰の静粛性と極上の座り心地を誇るVIPキャビン。少人数での空港送迎や東京観光に最適なラグジュアリーミニバン。',
        zh: '日本殿堂级豪华MPV，具备极致静音车厢与头等舱座椅，非常适合机场接送及东京私人定制一日游。',
        fr: 'Le summum du luxe automobile japonais. Sièges capitaine première classe et insonorisation parfaite.',
        es: 'El máximo lujo automotriz japonés. Asientos de primera clase y marcha ultra silenciosa.',
        en: 'The pinnacle of Japanese executive luxury. First-class Ottoman captain seats with whisper-quiet ride for airport and private day trips.',
      }[lang],
    },
    granace: {
      name: {
        ja: 'トヨタ グランエース プレミアムラウンジ',
        zh: '丰田 Granace 豪华商务旗舰',
        fr: 'Toyota Granace Premium Lounge',
        es: 'Toyota Granace Premium Lounge',
        en: 'Toyota Granace Premium Lounge',
      }[lang],
      tagline: {
        ja: '超高級6人乗りラウンジ (最大5名)',
        zh: '宽适奢华6座大空间 (最多5位乘客)',
        fr: 'Lounge 6 Places Ultra-Luxe (Max 5 Pers)',
        es: 'Lounge Ultra Lujo (Máx 5 Pax)',
        en: 'Ultra-Luxury 6-Seater Cabin (Max 5 Pax)',
      }[lang],
      maxPax: 5,
      maxLuggage: 4,
      image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      intImage: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
      desc: {
        ja: '圧倒的な室内空間と極上の本革パワーシート。長距離のスキーリゾート送迎や富士山観光で最上級の快適性をご提供。',
        zh: '宽大奢华的座舱配备4张真皮独立电动座椅，具备全时四驱系统，长途滑雪包车与富士山全日游的奢适之选。',
        fr: 'Espace grandiose avec 4 sièges capitaines VIP et transmission intégrale 4x4 pour les longs trajets.',
        es: 'Espacio imponente con 4 asientos VIP y tracción integral 4WD para viajes largos con total confort.',
        en: 'Supreme spaciousness with 4 VIP captain chairs and full 4WD capability for long-distance luxury touring.',
      }[lang],
    },
    hiace: {
      name: {
        ja: 'トヨタ ハイエース グランドキャビン',
        zh: '丰田 HiAce Grand Cabin 大容量客车',
        fr: 'Toyota HiAce Grand Cabin',
        es: 'Toyota HiAce Grand Cabin',
        en: 'Toyota HiAce Grand Cabin',
      }[lang],
      tagline: {
        ja: '大人数・大容量ラゲージ (最大9名)',
        zh: '多人团队与多套雪具 (最多9位乘客)',
        fr: 'Idéal Grands Groupes (Max 9 Pers)',
        es: 'Ideal para Grupos Grandes (Máx 9 Pax)',
        en: 'Large Group & High Capacity (Max 9 Pax)',
      }[lang],
      maxPax: 9,
      maxLuggage: 9,
      image: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      intImage: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
      desc: {
        ja: '最大9名様とスキー板8本・大型スーツケースを余裕で積載。ファミリーやグループ旅行に最適な広大なラゲージスペース。',
        zh: '高顶加长车身，可容纳多达9位乘客及9个大号行李箱和多套滑雪板，是家庭及滑雪团体的终极出行方案。',
        fr: 'Espace généreux pour 9 passagers avec 9 grandes valises et équipement de ski. Le choix idéal des groupes.',
        es: 'Espacio generoso para 9 pasajeros con 9 maletas y equipo de esquí. La opción ideal para grupos.',
        en: 'Generous room for up to 9 guests plus 9 large suitcases and ski gear. The ultimate vehicle for groups and families.',
      }[lang],
    },
  };

  const currentVehicleInfo = vehicleData[selectedVehicle];

  const handlePackageChange = (pkg: GrandPackageType) => {
    setSelectedPackage(pkg);
    if (pkg === 'airport') {
      setPickupLocation('hnd');
      setDestinationLocation('tokyo_hotel');
    } else if (pkg === 'sightseeing') {
      setPickupLocation('tokyo_hotel');
      setDestinationLocation('fuji-kawaguchiko');
    } else if (pkg === 'ski') {
      setPickupLocation('hnd');
      setDestinationLocation('hakuba');
    }
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackage === 'airport') {
      router.push('/tours/airport-transfer');
    } else if (selectedPackage === 'sightseeing') {
      router.push(`/destinations/${destinationLocation}`);
    } else if (selectedPackage === 'ski') {
      router.push('/tours/winter#plan');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-[#C5A059]/30 selection:text-[#E5C378] relative overflow-x-hidden">

      {/* Shared Unified Header Navigation */}
      <SiteHeader currentLang={lang} onLanguageChange={setLang} activePage="home" />

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dest-fuji-kawaguchiko-1376x768.jpg"
            alt="Japan Luxury Chauffeur"
            fill
            priority
            className="object-cover object-center brightness-[0.38] scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/60 to-[#0A0D14]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0D14]/50 to-[#0A0D14]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-[#0A0D14]/80 backdrop-blur-md border border-[#C5A059]/40 text-[#E5C378] text-xs sm:text-[13px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            {ui.heroBadge}
          </span>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight leading-[1.15]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {ui.heroH1Line1}<br /><span className="text-[#E5C378]">{ui.heroH1Line2}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {ui.heroSub}
          </p>

          <div className="flex flex-col items-center justify-center gap-3.5 pt-4 w-full max-w-xs mx-auto">
            <a
              href="#plan"
              className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-4 rounded-xl text-[13px] tracking-[0.12em] uppercase transition-all duration-300 shadow-xl hover:shadow-[#C5A059]/25 text-center cursor-pointer"
            >
              {ui.planCta}
            </a>
            <a
              href="#packages"
              className="text-white/80 hover:text-[#E5C378] text-[13px] tracking-[0.12em] uppercase font-medium transition-colors duration-300 border-b border-white/30 hover:border-[#E5C378] pb-0.5 text-center cursor-pointer"
            >
              {ui.explorePackagesCta}
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PLAN YOUR TOUR (Interactive Selector - Multi-Language Supported)
          ═══════════════════════════════════════ */}
      <section id="plan" className="py-20 md:py-28 bg-[#0A0D14] relative z-10 border-t border-slate-800/60">
        <div ref={plannerRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {ui.plannerCategory}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {ui.plannerHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {ui.plannerSubtitle}
            </p>
          </div>

          {/* Main Interactive Card */}
          <form onSubmit={handlePlanSubmit} className="bg-[#0E131F] border-2 border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
            
            {/* 1. Grand Package Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-[#E5C378] tracking-wider block">
                {ui.step1Label}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'airport' as const,
                    title: { ja: '✈️ 空港送迎 (成田・羽田)', zh: '✈️ 机场接送 (成田/羽田)', fr: '✈️ Transferts Aéroport', es: '✈️ Traslados Aeropuerto', en: '✈️ Airport Transfers' }[lang],
                  },
                  {
                    id: 'sightseeing' as const,
                    title: { ja: '🌸 日帰り観光ツアー', zh: '🌸 东京周边一日游', fr: '🌸 Excursions Privées', es: '🌸 Excursiones Privadas', en: '🌸 Sightseeing Tours' }[lang],
                  },
                  {
                    id: 'ski' as const,
                    title: { ja: '🎿 冬季スキー送迎', zh: '🎿 滑雪度假专车', fr: '🎿 Transferts Ski Alpin', es: '🎿 Transfers de Esquí', en: '🎿 Ski & Snowboard Charters' }[lang],
                  },
                ].map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageChange(pkg.id)}
                      className={`py-3.5 px-4 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#C5A059]/15 border-[#C5A059] ring-2 ring-[#C5A059]/50 shadow-xl text-[#E5C378]'
                          : 'bg-[#0A0D14] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold block">{pkg.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Route Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              
              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1 text-[10px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  {t.pickupLabel}
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                >
                  <option value="hnd" className="bg-[#0E131F]">Haneda Airport (HND) [羽田空港]</option>
                  <option value="nrt" className="bg-[#0E131F]">Narita Airport (NRT) [成田空港]</option>
                  <option value="tokyo_hotel" className="bg-[#0E131F]">Tokyo Hotel / Central Tokyo [都内ホテル]</option>
                </select>
              </div>

              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1 text-[10px] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                  {t.destLabel}
                </label>
                <select
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                >
                  {selectedPackage === 'airport' && (
                    <>
                      <option value="tokyo_hotel" className="bg-[#0E131F]">Tokyo Hotels (Grand Hyatt, Aman, etc.)</option>
                      <option value="hnd" className="bg-[#0E131F]">Haneda Airport (HND)</option>
                      <option value="nrt" className="bg-[#0E131F]">Narita Airport (NRT)</option>
                    </>
                  )}
                  {selectedPackage === 'sightseeing' && (
                    <>
                      <option value="fuji-kawaguchiko" className="bg-[#0E131F]">Mt. Fuji &amp; Lake Kawaguchiko</option>
                      <option value="hakone-lake-ashi" className="bg-[#0E131F]">Hakone Onsen &amp; Lake Ashi</option>
                      <option value="kamakura-enoshima" className="bg-[#0E131F]">Kamakura &amp; Enoshima Coast</option>
                      <option value="nikko-unesco" className="bg-[#0E131F]">Nikko UNESCO World Heritage</option>
                      <option value="yokohama-bay" className="bg-[#0E131F]">Yokohama Futuristic Port &amp; Bay</option>
                      <option value="karuizawa-retreat" className="bg-[#0E131F]">Karuizawa Luxury Mountain Retreat</option>
                    </>
                  )}
                  {selectedPackage === 'ski' && (
                    <>
                      <option value="hakuba" className="bg-[#0E131F]">Hakuba Valley (Nagano)</option>
                      <option value="nozawa" className="bg-[#0E131F]">Nozawa Onsen (Nagano)</option>
                      <option value="shiga" className="bg-[#0E131F]">Shiga Kogen (Nagano)</option>
                      <option value="myoko" className="bg-[#0E131F]">Myoko Kogen (Niigata)</option>
                      <option value="madarao" className="bg-[#0E131F]">Madarao Mountain (Nagano)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800">
                <label className="block text-slate-400 font-medium uppercase tracking-wider mb-1 text-[10px] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  {t.selectDate}
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none"
                />
              </div>

              {/* Guests & Luggage with Vehicle Capacity Locking */}
              <div className="bg-[#0A0D14] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="block text-slate-400 uppercase text-[10px] font-medium">{t.paxLabel}</span>
                  <span className="text-[10px] text-[#E5C378] font-bold bg-[#C5A059]/15 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                    Max {currentVehicleInfo.maxPax} Pax
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-white text-xs sm:text-sm font-bold">{passengers} Guests, {luggage} Bags</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(currentVehicleInfo.maxPax, passengers + 1))}
                      disabled={passengers >= currentVehicleInfo.maxPax}
                      className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                        passengers >= currentVehicleInfo.maxPax
                          ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Vehicle Selector with Toyota Alphard as DEFAULT */}
            <div className="space-y-3 border-t border-slate-800/80 pt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-[#E5C378] tracking-wider block">
                  {ui.step2Label}
                </label>
                <span className="text-[11px] text-slate-400">{t.mlitBadge}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['alphard', 'granace', 'hiace'] as const).map((vKey) => {
                  const v = vehicleData[vKey];
                  const isSelected = selectedVehicle === vKey;
                  return (
                    <button
                      key={vKey}
                      type="button"
                      onClick={() => {
                        setSelectedVehicle(vKey);
                        if (passengers > v.maxPax) {
                          setPassengers(v.maxPax);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#C5A059]/15 border-[#C5A059] ring-2 ring-[#C5A059]/40 shadow-xl'
                          : 'bg-[#0A0D14] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="relative h-48 sm:h-36 md:h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-[#05070B]">
                          <Image src={v.image} alt={v.name} fill className="object-cover object-[center_15%]" />
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 bg-[#C5A059] text-[#0A0D14] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                              Selected
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-white text-xs sm:text-sm block">
                          {v.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Max {v.maxPax} Guests • {v.maxLuggage} Suitcases
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Action Banner & Price Redirect (No price shown directly on homepage) */}
            <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {ui.fixedPriceBannerTitle}
                </span>
                <p className="text-xs text-slate-400">
                  {ui.fixedPriceBannerSub}
                </p>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-8 py-4 rounded-xl text-xs sm:text-[13px] uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{ui.viewRatesCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          GRAND PACKAGES (Replaces "The Luxury Experience")
          ═══════════════════════════════════════ */}
      <section id="packages" className="py-24 md:py-32 bg-[#0E131F]">
        <div ref={packagesRef} className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
          
          <div className="text-center space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? 'サービスラインナップ' : lang === 'zh' ? '专享服务阵容' : lang === 'fr' ? 'Services Signatures' : lang === 'es' ? 'Servicios Exclusivos' : 'Signature Services'}
            </p>
            <h2 className="text-3xl sm:text-5xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {ui.grandPackagesSectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {ui.grandPackagesSectionSub}
            </p>
          </div>

          {/* 3 Grand Package Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Airport Transfer */}
            <div className="bg-[#0A0D14] border border-slate-800/80 hover:border-[#C5A059] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src="/images/airport-transfer-vip-alphard-1376x768.jpg"
                    alt="Tokyo Airport Transfers"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 bg-[#0A0D14]/80 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-xs font-bold px-3 py-1 rounded-full">
                    ✈️ Most Popular
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <span className="text-[11px] text-[#C5A059] uppercase font-bold tracking-widest block">
                    {lang === 'ja' ? '空港専用車送迎' : lang === 'zh' ? '机场专属接送' : lang === 'fr' ? 'Transferts Aéroport VIP' : lang === 'es' ? 'Traslados Aeropuerto VIP' : 'Executive Airport Transfers'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {lang === 'ja' ? '成田・羽田 ⇄ 都内ホテル' : lang === 'zh' ? '成田/羽田机场 ⇄ 东京酒店' : lang === 'fr' ? 'Aéroports Haneda/Narita ⇄ Tokyo' : lang === 'es' ? 'Aeropuertos Haneda/Narita ⇄ Tokio' : 'Narita & Haneda Airport Transfers'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {lang === 'ja'
                      ? '到着ゲートでのお名前ボード出迎え、60分無料待機、フライト追跡、高速料金込みの完全定額送迎。長距離フライト後もスムーズに都内ホテルへ直行。'
                      : lang === 'zh'
                      ? '到达口举牌专属迎接，享60分钟免费延误等待，实时航班追踪，包含所有高速公路及税费的一口价门到门接送。'
                      : lang === 'fr'
                      ? 'Accueil nominatif à l\'aéroport, suivi des vols en direct, 60 min d\'attente gratuite et péages inclus directement vers vos hôtels de Tokyo.'
                      : lang === 'es'
                      ? 'Bienvenida con cartel nominativo, seguimiento de vuelos en tiempo real, 60 min de espera gratuita y peajes incluidos directamente a su hotel en Tokio.'
                      : 'Door-to-door VIP airport transfers with name-board meet & greet, flight tracking, and luggage assistance directly to any Tokyo hotel.'}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '60分間のフライト遅延無料待機' : lang === 'zh' ? '包含60分钟免费航班延误等待' : lang === 'fr' ? '60 minutes d\'attente gratuite en cas de retard' : lang === 'es' ? '60 minutos de espera gratuita por retrasos' : 'Complimentary 60-min flight delay buffer'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '都内各高級ホテルへ直行送迎' : lang === 'zh' ? '直达东京安缦、君悦、半岛等星级酒店' : lang === 'fr' ? 'Direct vers Grand Hyatt, Aman, Palace Hotel, etc.' : lang === 'es' ? 'Directo a Grand Hyatt, Aman, Palace Hotel, etc.' : 'Direct to Grand Hyatt, Aman, Palace Hotel, etc.'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '高速代・消費税込みの完全定額' : lang === 'zh' ? '全包一口价，含高速通行费与税费' : lang === 'fr' ? 'Péages d\'autoroute et taxes entièrement inclus' : lang === 'es' ? 'Peajes e impuestos totalmente incluidos' : 'Highway tolls & taxes fully included'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href="/tours/airport-transfer"
                  className="w-full bg-[#0E131F] group-hover:bg-[#C5A059] text-white group-hover:text-[#0A0D14] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-slate-700 group-hover:border-[#C5A059] flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ja' ? '空港送迎プランを見る' : lang === 'zh' ? '查看机场接送明细' : lang === 'fr' ? 'Voir les Transferts Aéroport' : lang === 'es' ? 'Ver Traslados Aeropuerto' : 'Explore Airport Transfers'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Sightseeing Tours */}
            <div className="bg-[#0A0D14] border border-slate-800/80 hover:border-[#C5A059] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src="/images/dest-fuji-kawaguchiko-1376x768.jpg"
                    alt="Mount Fuji Sightseeing"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 bg-[#0A0D14]/80 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-xs font-bold px-3 py-1 rounded-full">
                    🌸 {lang === 'ja' ? '10時間 完全貸切' : lang === 'zh' ? '10小时包车定制' : lang === 'fr' ? 'Circuits Privés 10h' : lang === 'es' ? 'Tours Privados 10h' : '10-Hour Private Charters'}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <span className="text-[11px] text-[#C5A059] uppercase font-bold tracking-widest block">
                    {lang === 'ja' ? '東京近郊観光ツアー' : lang === 'zh' ? '东京周边一日游' : lang === 'fr' ? 'Excursions Privées' : lang === 'es' ? 'Excursiones Privadas' : 'Tokyo & Beyond Sightseeing'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {lang === 'ja' ? '富士山・箱根・鎌倉・日光' : lang === 'zh' ? '富士山・箱根・镰仓・日光' : lang === 'fr' ? 'Mont Fuji, Hakone, Kamakura & Nikko' : lang === 'es' ? 'Monte Fuji, Hakone, Kamakura y Nikko' : 'Mt. Fuji, Hakone, Kamakura & Nikko'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {lang === 'ja'
                      ? '都内ホテルから直行する10時間完全プライベートツアー。富士山河口湖、箱根温泉、鎌倉古都、日光東照宮など自由な行程で巡ります。'
                      : lang === 'zh'
                      ? '从东京酒店直达的10小时专属包车一日游。富士山河口湖、箱根温泉、古都镰仓、日光东照宫等行程灵活自由。'
                      : lang === 'fr'
                      ? 'Excursions d\'une journée sur mesure de 10 heures avec chauffeur privé. Explorez le Mont Fuji, Hakone, Kamakura et Nikko à votre rythme.'
                      : lang === 'es'
                      ? 'Excursiones a medida de 10 horas con chófer privado. Explore el Monte Fuji, Hakone, la histórica Kamakura y Nikko a su propio ritmo.'
                      : 'Bespoke 10-hour day trips with private chauffeur. Explore Mount Fuji, Hakone Onsen, ancient Kamakura, and UNESCO Nikko at your own pace.'}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '自由な旅程設計＆絶景フォトスポット' : lang === 'zh' ? '自由定制行程与绝美拍照点停留' : lang === 'fr' ? 'Itinéraire flexible et arrêts photos panoramiques' : lang === 'es' ? 'Itinerario flexible y paradas fotográficas' : 'Custom flexible itinerary & scenic photo stops'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? 'Viator基準の安心行程＆即時予約' : lang === 'zh' ? 'Viator高标准行程保障与即时确认' : lang === 'fr' ? 'Standards internationaux et réservation immédiate' : lang === 'es' ? 'Estándares internacionales y reserva inmediata' : 'Viator-standard itinerary & instant booking'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '東京発・厳選6大観光コース' : lang === 'zh' ? '精选6大东京周边经典旅游线路' : lang === 'fr' ? '6 destinations emblématiques disponibles' : lang === 'es' ? '6 destinos emblemáticos disponibles' : '6 iconic tourist destinations available'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href="/destinations"
                  className="w-full bg-[#0E131F] group-hover:bg-[#C5A059] text-white group-hover:text-[#0A0D14] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-slate-700 group-hover:border-[#C5A059] flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ja' ? '観光ツアー一覧を見る' : lang === 'zh' ? '查看景点包车列表' : lang === 'fr' ? 'Explorer les Excursions' : lang === 'es' ? 'Ver Excursiones Privadas' : 'Explore Sightseeing Tours'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Ski Charters */}
            <div className="bg-[#0A0D14] border border-slate-800/80 hover:border-[#C5A059] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src="/images/winter-ski-nagano-resort-1500x1001.jpg"
                    alt="Hakuba Alpine Ski Charters"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 bg-[#0A0D14]/80 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-xs font-bold px-3 py-1 rounded-full">
                    🎿 4WD Alpine Spec
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <span className="text-[11px] text-[#C5A059] uppercase font-bold tracking-widest block">
                    {lang === 'ja' ? '冬季スキーリゾート送迎' : lang === 'zh' ? '滑雪度假胜地包车' : lang === 'fr' ? 'Ski & Snowboard' : lang === 'es' ? 'Esquí y Nieve' : 'Alpine Ski & Snowboard Charters'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {lang === 'ja' ? '白馬・野沢温泉・志賀高原・妙高' : lang === 'zh' ? '白马・野泽温泉・志贺高原・妙高' : 'Hakuba, Nozawa & Shiga Kogen'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {lang === 'ja'
                      ? '東京・空港から長野・新潟のスキーリゾートへ直行。4WDスタッドレスタイヤ完備、スキーバッグ専用スペースでゲレンデまで快適直行。'
                      : lang === 'zh'
                      ? '从东京及各机场直达长野、新潟滑雪度假村。全系标配4WD及防滑雪胎，充足雪板行李空间，直达雪场木屋。'
                      : lang === 'fr'
                      ? 'Transferts privés directs vers les plus grands chalets de ski du Japon. Transmission 4x4 intégrale et espace pour jusqu\'à 9 housses de ski.'
                      : lang === 'es'
                      ? 'Traslados privados directos a los mejores chalets y resorts de esquí de Japón. Tracción 4x4 total y espacio para hasta 9 bolsas de esquí.'
                      : 'Door-to-door private transfers to Japan’s premier ski chalets. Full 4WD snow capability with space for up to 9 ski bags.'}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? 'スキーバッグ＆大型手荷物専用スペース' : lang === 'zh' ? '配备雪板架与超大行李装载空间' : lang === 'fr' ? 'Espace bagages surdimensionné & housses de ski' : lang === 'es' ? 'Espacio para equipaje extragrande y esquís' : 'Dedicated ski rack & oversized luggage capacity'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '雪道経験豊富なプロドライバー' : lang === 'zh' ? '资深雪道山地驾驶经验专业司机' : lang === 'fr' ? 'Chauffeurs expérimentés sur routes enneigées' : lang === 'es' ? 'Chóferes expertos en conducción sobre nieve' : 'Experienced alpine snow chauffeurs'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ja' ? '片道運行・往復割引対応' : lang === 'zh' ? '支持单程及往返特惠预订' : lang === 'fr' ? 'Trajets simples et allers-retours avec réduction' : lang === 'es' ? 'Traslados de ida y vuelta con descuento' : 'One-way & round-trip charters'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href="/tours/winter"
                  className="w-full bg-[#0E131F] group-hover:bg-[#C5A059] text-white group-hover:text-[#0A0D14] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-slate-700 group-hover:border-[#C5A059] flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ja' ? 'スキー送迎を見る' : lang === 'zh' ? '查看滑雪接送详情' : lang === 'fr' ? 'Voir les Transferts Ski' : lang === 'es' ? 'Ver Transfers de Esquí' : 'Explore Ski Charters'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          FLEET SHOWCASE (Alphard, Granace, HiAce)
          ═══════════════════════════════════════ */}
      <section id="fleet" className="py-24 md:py-32 bg-[#0A0D14]">
        <div ref={fleetRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
              {lang === 'ja' ? '運行車両のご案内' : lang === 'zh' ? '豪华车队阵容' : lang === 'fr' ? 'Notre Flotte' : lang === 'es' ? 'Nuestra Flota' : 'Executive Fleet'}
            </p>
            <h2 className="text-3xl sm:text-4xl text-white font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
              {t.fleetSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Alphard */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{t.alphardTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAlphardTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          alphardTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? 'Ext' : tab === 'int' ? 'Int' : 'Trunk'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-60 md:h-56 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={alphardTab === 'ext' ? '/images/fleet-toyota-alphard-exterior-1477x1108.jpg' : alphardTab === 'int' ? '/images/fleet-toyota-alphard-interior-1477x1108.jpg' : '/images/fleet-toyota-alphard-trunk-1477x1108.jpg'}
                    alt="Toyota Alphard"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">{vehicleData.alphard.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['VIP Ottoman Recliners', 'Free 5G Wi-Fi', '4WD Snow Spec', 'Max 4 Pax'].map((txt, i) => (
                      <span key={i} className="bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        {txt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 4 Pax</span>
                  <span>4 Suitcases</span>
                  <span>3 Skis</span>
                </div>
              </div>
            </div>

            {/* 2. Granace */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{t.granaceTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setGranaceTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          granaceTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? 'Ext' : tab === 'int' ? 'Int' : 'Trunk'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-60 md:h-56 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={granaceTab === 'ext' ? '/images/fleet-toyota-granace-exterior-4032x3024.jpg' : granaceTab === 'int' ? '/images/fleet-toyota-granace-interior-1477x1108.jpg' : '/images/fleet-toyota-granace-trunk-1477x1108.jpg'}
                    alt="Toyota Granace"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">{vehicleData.granace.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['VIP Leather Captain Chairs', 'Free 5G Wi-Fi', '4WD Snow Spec', 'Max 5 Pax'].map((txt, i) => (
                      <span key={i} className="bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        {txt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 5 Pax</span>
                  <span>4 Suitcases</span>
                  <span>4 Skis</span>
                </div>
              </div>
            </div>

            {/* 3. HiAce */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div>
                <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{t.hiaceTitle}</span>
                  <div className="flex items-center gap-0.5 bg-[#0A0D14] p-0.5 rounded-lg">
                    {(['ext', 'int', 'trunk'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHiaceTab(tab)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          hiaceTab === tab ? 'bg-[#C5A059] text-[#0A0D14] font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab === 'ext' ? 'Ext' : tab === 'int' ? 'Int' : 'Trunk'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 sm:h-60 md:h-56 w-full bg-[#05070B] overflow-hidden">
                  <Image
                    src={hiaceTab === 'ext' ? '/images/fleet-toyota-hiace-exterior-1477x1108.jpg' : hiaceTab === 'int' ? '/images/fleet-toyota-hiace-interior-1477x1108.jpg' : '/images/fleet-toyota-hiace-trunk-1477x1108.jpg'}
                    alt="Toyota HiAce"
                    fill
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">{vehicleData.hiace.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Large Groups (9 Pax)', '8+ Ski Bags Space', 'Free 5G Wi-Fi', '4WD Snow Spec'].map((txt, i) => (
                      <span key={i} className="bg-[#0A0D14] border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        {txt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 text-slate-400">
                  <span className="text-[#C5A059] font-bold">Max 9 Pax</span>
                  <span>9 Suitcases</span>
                  <span>8 Skis</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST & MLIT COMPLIANCE
          ═══════════════════════════════════════ */}
      <section className="py-16 bg-[#0E131F] border-t border-slate-800/60">
        <div ref={trustRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A0D14] border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#E5C378] flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">{t.greenPlateTitle}</h4>
              <p className="text-xs text-slate-400">{t.greenPlateDesc}</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#E5C378] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">{t.meetGreetTitle}</h4>
              <p className="text-xs text-slate-400">{t.meetGreetDesc}</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 text-[#E5C378] flex items-center justify-center mx-auto">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">{t.conciergeTitle}</h4>
              <p className="text-xs text-slate-400">{t.conciergeDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OFFICIAL SK LIMO LEGAL FOOTER
          ═══════════════════════════════════════ */}
      <SiteFooter />

    </div>
  );
}
