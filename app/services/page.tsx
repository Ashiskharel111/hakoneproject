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
        en: 'Point-to-point all-inclusive luxury transfers. Real-time AeroDataBox flight tracking, 100% free flexible wait time (zero delay fees), curbside assist, and direct Tokyo hotel drop-off.',
        ja: '航空便リアルタイム追跡、遅延完全無料待機（遅延追加料金¥0）、手荷物積載サポート、都内ホテルへの直行送迎。高速料金・深夜料金すべて明朗会計。',
        zh: '实时航班动态监控、100%免费灵活航班延误守候（无延误附加费）、专属举牌迎宾、直达东京都内酒店。全程无忧。',
        fr: 'Suivi de vol en temps réel, attente 100% flexible et gratuite (zéro frais de retard), prise en charge personnalisée aux arrivées.',
        es: 'Seguimiento de vuelos en directo, espera 100% flexible y gratuita (cero recargos por retraso), bienvenida con cartel personalizado.',
      },
      features: ['AeroDataBox Live Tracking', 'Free flexible delay wait (¥0)', 'Terminal 1/2/3 curbside assist', 'Fixed all-inclusive fare'],
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

  const t = {
    heroBadge: {
      ja: '国土交通省 認可営業用緑ナンバーハイヤー事業体',
      zh: '日本国土交通省 官方绿牌营运合规车队',
      fr: 'SERVICES DE CHAUFFEUR PRIVÉ HOMOLOGUÉS MLIT JAPON',
      es: 'SERVICIOS DE CHÓFER PRIVADO CERTIFICADOS MLIT JAPÓN',
      en: 'MLIT Certified Commercial Chauffeur Ground Services',
    }[lang],
    heroTitle: {
      ja: '洗練されたプライベートハイヤーサービス',
      zh: '日本全境 顶规专属专车与贵宾地接方案',
      fr: 'Chauffeur Privé & Logistique Terrestre d\'Excellence au Japon',
      es: 'Chófer Privado de Primera Clase y Logística en Japón',
      en: 'Premier Private Chauffeur & Ground Logistics in Japan',
    }[lang],
    heroDesc: {
      ja: '成田・羽田空港送迎、富士山観光チャーター、冬期4WDスキー送迎からVIPビジネス輸送まで。国土交通省認可の最高品質をお届けします。',
      zh: '涵盖成田/羽田机场接送、富士山深度包车一日游、长野4WD雪季滑雪专线及商务外事接待。完全一口价，实时航班追踪，尊享豪华车队。',
      fr: 'Des transferts aéroportuaires fluides aux excursions sur mesure au Mont Fuji, en passant par les transferts ski 4x4 et les roadshows d\'affaires.',
      es: 'Desde traslados directos de aeropuerto y tours privados al Monte Fuji hasta traslados de esquí 4x4 y transporte corporativo VIP.',
      en: 'From seamless airport transfers and bespoke Mount Fuji day charters to 4WD winter ski transfers and corporate roadshows. Transparent fixed fares, flight tracking, and pristine executive fleet.',
    }[lang],
    servicesTag: { ja: 'サービス一覧', zh: '服务矩阵', fr: 'Prestations Complètes', es: 'Servicios Completos', en: 'Comprehensive Offerings' }[lang],
    servicesHead: { ja: 'お客様の旅を彩る専任輸送ソリューション', zh: '尊享日本地面出行解决方案', fr: 'Solutions de Déplacement Sur Mesure', es: 'Soluciones de Viaje a Medida', en: 'Tailored Ground Travel Solutions' }[lang],
    fromLabel: { ja: '片道', zh: '起', fr: 'Dès', es: 'Desde', en: 'From' }[lang],
    exploreBtn: { ja: '詳細・ご予約はこちら', zh: '查看详情并预约', fr: 'Explorer & Réserver', es: 'Explorar y Reservar', en: 'Explore & Book Service' }[lang],
    standardTag: { ja: 'SK LIMOのこだわり', zh: '品质标杆', fr: 'Le Standard SK LIMO', es: 'El Estándar SK LIMO', en: 'The SK Limo Standard' }[lang],
    standardHead: { ja: '世界中のお客様・旅行会社様に選ばれる理由', zh: '为什么全球高端旅客与旅行社信赖我们', fr: 'Pourquoi les Voyageurs Exigeants Nous Choisissent', es: 'Por Qué los Viajeros Exigentes nos Eligen', en: 'Why Discerning Travelers & Travel Agents Choose Us' }[lang],
    g1Title: { ja: '100% 緑ナンバー認可', zh: '100% 正规商业绿牌', fr: '100 % Agréé Plaque Verte', es: '100% Licencia Placa Verde', en: '100% Green-Plate Licensed' }[lang],
    g1Desc: { ja: '国土交通省関東運輸局認可。万全の搭乗者傷害保険を完備。', zh: '日本国土交通省正规营运资质，全额配备高额商业乘客险。', fr: 'Agréé par le Ministère des Transports avec assurance responsabilité passagers.', es: 'Autorizado por el Ministerio de Transporte de Japón con seguro integral.', en: 'Authorized by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) with comprehensive passenger insurance.' }[lang],
    g2Title: { ja: '24時間 運行管理デスク', zh: '24/7 全天候调度中心', fr: 'Desk Opérationnel 24/7', es: 'Centro Operativo 24/7', en: '24/7 Operations Desk' }[lang],
    g2Desc: { ja: 'フライト追跡とWhatsAppによる迅速な多言語オペレーション。', zh: '全天候航班追踪与中英日三语WhatsApp即时客服。', fr: 'Suivi de vol en continu et assistance immédiate sur WhatsApp.', es: 'Monitoreo continuo de vuelos y atención inmediata vía WhatsApp.', en: 'Round-the-clock flight tracking and instant dispatch support via WhatsApp and hotline.' }[lang],
    g3Title: { ja: '清潔な日本車フリート', zh: '尊享日系豪华车队', fr: 'Flotte Japonaise Impeccable', es: 'Flota Japonesa Impecable', en: 'Pristine Japanese Fleet' }[lang],
    g3Desc: { ja: '毎日除菌・全車禁煙。ハイエース、アルファード、グランエースを配備。', zh: '每日深度清洁消杀，严格全车禁烟：海狮、埃尔法、格兰斯全系在列。', fr: 'Nettoyés et désinfectés chaque jour : HiAce, Toyota Alphard et Granace.', es: 'Limpiados y desinfectados a diario: HiAce, Toyota Alphard y Granace.', en: 'Cleaned and sanitized daily: HiAce (Standard), Toyota Alphard (Premium), and Toyota Granace (Ultra Premium).' }[lang],
    g4Title: { ja: '明朗な完全定額料金', zh: '全包一口价无隐形消费', fr: 'Tarifs Fixes Tout Compris', es: 'Tarifas Fijas Todo Incluido', en: 'All-Inclusive Fixed Fares' }[lang],
    g4Desc: { ja: '高速代、燃料代、保険、駐車場代込。メーター加算や渋滞割増なし。', zh: '高速费、油费、保险与停车费下单全锁死，绝无跳表惊吓与高峰加价。', fr: 'Péages, carburant, assurances et parkings fixés à la réservation.', es: 'Peajes, combustible, seguro y aparcamientos garantizados en la reserva.', en: 'Highway tolls, fuel, vehicle insurance, and parking are locked in upon booking. No surprise meter fees.' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">

        {/* 1. Services Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
              {t.servicesTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              {t.servicesHead}
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
                      {t.fromLabel} {svc.startingPrice}
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
                    <span>{t.exploreBtn}</span>
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
              {t.standardTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.standardHead}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-[#00B37E]" />
              <h4 className="font-bold text-sm text-white">{t.g1Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.g1Desc}
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <Clock className="w-6 h-6 text-[#0068FF]" />
              <h4 className="font-bold text-sm text-white">{t.g2Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.g2Desc}
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <Car className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-bold text-sm text-white">{t.g3Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.g3Desc}
              </p>
            </div>

            <div className="space-y-2 bg-[#111622] p-5 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-sm text-white">{t.g4Title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.g4Desc}
              </p>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
