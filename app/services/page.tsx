'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  MapPin
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RouteDistanceVisualizer from '@/components/RouteDistanceVisualizer';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const [lang] = useLanguage();

  const services = [
    {
      id: 'airport-transfers',
      title: {
        en: 'Airport Chauffeur & VIP Terminal Meet',
        ja: '成田・羽田空港 定額送迎＆VIPミートサービス',
        zh: '成田/羽田机场 专车接送与VIP航站楼举牌迎宾',
        fr: 'Transferts Aéroports Haneda & Narita',
        es: 'Traslados Aeropuertos Haneda y Narita',
      },
      tag: 'Haneda (HND) & Narita (NRT)',
      desc: {
        en: 'Point-to-point all-inclusive luxury transfers. Real-time AeroDataBox flight tracking, 90 minutes complimentary wait time, curbside assist, and direct Tokyo hotel drop-off.',
        ja: '航空便リアルタイム追跡、90分無料待機、手荷物積載サポート、都内ホテルへの直行送迎。高速料金・深夜料金すべて明朗会計。',
        zh: '实时航班动态监控、免费90分钟航班延误守候、专属举牌迎宾、直达东京都内酒店。全程无忧。',
        fr: 'Suivi de vol en temps réel, 90 minutes d\'attente gratuite, prise en charge personnalisée aux arrivées.',
        es: 'Seguimiento de vuelos en directo, 90 minutos de espera sin cargo, bienvenida con cartel personalizado.',
      },
      features: ['AeroDataBox Live Tracking', '90-min free wait time', 'Terminal 1/2/3 curbside assist', 'Fixed all-inclusive fare'],
      image: '/images/dest-haneda-hero-1920x1080.jpg',
      href: '/tours/airport-transfer',
      startingPrice: '¥16,000',
    },
    {
      id: 'day-charters',
      title: {
        en: 'Curated Private Day Charters',
        ja: '富士山・箱根・鎌倉・日光 観光チャーター',
        zh: '富士山・箱根・镰仓・日光 私享包车一日游',
        fr: 'Excursions d\'une Journée & Mont Fuji',
        es: 'Tours Privados de un Día & Monte Fuji',
      },
      tag: 'Customizable 9–11 Hour Itineraries',
      desc: {
        en: 'Exclusive chauffeured sightseeing across Mt. Fuji, Hakone Onsen, Kamakura Coast, and Nikko UNESCO temples with flexible photo stops and dining guidance.',
        ja: '富士山五合目、河口湖、箱根神社、鎌倉大仏、日光東照宮など、ご希望のペースで巡る完全プライベートチャーター。',
        zh: '按您的节奏专属定制富士山、箱根温泉、镰仓海岸与日光世界遗产行程，自由打卡与随行指导。',
        fr: 'Découvrez le Mont Fuji, Hakone et Kamakura à votre propre rythme avec un chauffeur bilingue dédié.',
        es: 'Recorra el Monte Fuji, Hakone y Kamakura a su propio ritmo con chófer bilingüe privado.',
      },
      features: ['Flexible photo stops', 'Tolls & fuel included', 'Door-to-door hotel pickup', 'English/Japanese chauffeur'],
      image: '/images/dest-fuji-hero-1920x1080.jpg',
      href: '/destinations',
      startingPrice: '¥68,000',
    },
    {
      id: 'ski-transfers',
      title: {
        en: '4WD Winter Ski Direct Transfers',
        ja: '長野白馬・野沢温泉 4WD冬期直行スキー送迎',
        zh: '长野白马・野泽温泉 4WD雪季直达专车',
        fr: 'Transferts Ski 4x4 Vallée de Hakuba',
        es: 'Traslados de Esquí 4x4 Hakuba & Nozawa',
      },
      tag: 'Door-to-Chalet Alpine Direct',
      desc: {
        en: 'Dedicated 4WD mountain fleet equipped with Bridgestone Blizzak studless snow tires. Direct express from Tokyo/Airports to Hakuba, Nozawa Onsen, Shiga Kogen, and Yuzawa.',
        ja: '全車4WD駆動＆ブリヂストン製スタッドレスタイヤ完備。羽田・成田や都内から白馬・野沢温泉・志賀高原のシャレー玄関まで直行。',
        zh: '全系全时四驱车辆＋普利司通雪地胎保障。东京都内及机场直达长野白马、野泽温泉等顶级雪场木屋。',
        fr: 'Monospaces 4x4 équipés de pneus neige pour rejoindre vos chalets à Hakuba et Nozawa Onsen sans correspondance.',
        es: 'Vehículos 4x4 equipados con neumáticos de nieve para llegar directo a su chalet en Hakuba y Nozawa.',
      },
      features: ['Bridgestone Blizzak Studless Tires', 'Electronic 4WD / AWD', 'Oversized ski/snowboard bay', 'Zero luggage hauling'],
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      href: '/tours/winter',
      startingPrice: '¥75,000',
    },
    {
      id: 'corporate-vip',
      title: {
        en: 'Corporate Roadshows & Executive VIP Logistics',
        ja: 'ビジネス視察・要人VIP送迎・多言語対応',
        zh: '商务考察・高端接待・大型活动车队保障',
        fr: 'Services Corporate & VIP Diplomatique',
        es: 'Servicios Corporativos & Logística VIP',
      },
      tag: 'Discreet Executive Service',
      desc: {
        en: 'Impeccably coordinated multi-vehicle convoys for embassies, corporate executives, overseas travel agencies, and VIP delegations across Tokyo and Greater Kanto.',
        ja: '大使館要人、海外エグゼクティブ、国際会議、多台数車隊の運行統括。徹底した機密保持と専任ディスパッチャー配置。',
        zh: '专为使领馆要人、跨国企业高管与高端考察团提供多车编队统筹、机密保障与全天候调度。',
        fr: 'Flotte coordonnée pour ambassades, délégations d\'affaires et événements d\'entreprise à Tokyo.',
        es: 'Flota coordinada para embajadas, delegaciones empresariales y eventos corporativos en Tokio.',
      },
      features: ['Multi-vehicle convoy coordination', 'NDA & strict confidentiality', 'Dedicated operations desk', 'Priority invoice / B2B terms'],
      image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      href: '/contact',
      startingPrice: 'Custom Quote',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>MLIT Certified Commercial Chauffeur Ground Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            {lang === 'ja'
              ? '洗練されたプライベートハイヤーサービス'
              : 'Premier Private Chauffeur & Ground Logistics in Japan'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ja'
              ? '成田・羽田空港送迎、富士山観光チャーター、冬期4WDスキー送迎からVIPビジネス輸送まで。国土交通省認可の最高品質をお届けします。'
              : 'From seamless airport transfers and bespoke Mount Fuji day charters to 4WD winter ski transfers and corporate roadshows. Transparent fixed fares, flight tracking, and pristine executive fleet.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">

        {/* 1. Services Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
              Comprehensive Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              Tailored Ground Travel Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 sm:h-64 w-full bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={svc.image}
                      alt={svc.title.en}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {svc.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-[#C5A059]/40 text-[#C5A059] font-mono font-bold text-xs">
                      From {svc.startingPrice}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-white">
                      {svc.title[lang] || svc.title.en}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed">
                      {svc.desc[lang] || svc.desc.en}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#F0F2F5] dark:border-slate-800">
                      {svc.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00B37E] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={svc.href}
                    className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Explore &amp; Book Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Interactive Route & Distance Visualizer Section */}
        <section className="space-y-6">
          <RouteDistanceVisualizer />
        </section>

        {/* 3. Operational Guarantees */}
        <section className="bg-[#080B11] text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#C5A059]">
              The SK Limo Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Discerning Travelers &amp; Travel Agents Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-[#00B37E]" />
              <h4 className="font-bold text-sm text-white">100% Green-Plate Licensed</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authorized by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) with comprehensive passenger insurance.
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <Clock className="w-6 h-6 text-[#0068FF]" />
              <h4 className="font-bold text-sm text-white">24/7 Operations Desk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Round-the-clock flight tracking and instant dispatch support via WhatsApp and hotline.
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <Car className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-bold text-sm text-white">Pristine Japanese Fleet</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cleaned and sanitized daily: HiAce (Standard), Toyota Alphard (Premium), and Toyota Granace (Ultra Premium).
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-sm text-white">All-Inclusive Fixed Fares</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Highway tolls, fuel, vehicle insurance, and parking are locked in upon booking. No surprise meter fees.
              </p>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
