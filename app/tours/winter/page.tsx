'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  MapPin,
  Car,
  Users,
  Luggage,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  Compass,
  Check,
  ChevronRight,
  ArrowRight,
  Mountain,
  ThermometerSnowflake,
  ShieldAlert,
  Wind
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';

const SkiTransferBookingModule = dynamic(() => import('@/components/SkiTransferBookingModule'), {
  loading: () => (
    <div className="p-8 text-center text-xs text-slate-400">Loading Ski Transfer Wizard...</div>
  ),
});

export default function WinterSkiToursPage() {
  const [lang] = useLanguage();
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedResortForWizard, setSelectedResortForWizard] = useState('hakuba');

  const whatsAppSkiUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring about private 4WD winter ski transfers from Tokyo / Haneda / Narita to Hakuba, Nozawa, and Shiga Kogen.'
  )}`;

  const skiResorts = [
    {
      id: 'hakuba',
      name: 'Hakuba Valley (Nagano)',
      region: 'Japan Northern Alps',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Host of the 1998 Winter Olympics. 10 interconnected world-class ski resorts, legendary alpine bowls, and vibrant international village dining.',
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      price: '¥110,000〜',
      tag: 'Olympic Alpine Standard',
    },
    {
      id: 'nozawa',
      name: 'Nozawa Onsen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Historic ski village combining deep powder tree runs with 13 traditional open-air public onsen hot springs throughout the cobblestone streets.',
      image: '/images/ski-nozawa-hero-4032x3024.jpg',
      price: '¥115,000〜',
      tag: 'Powder & Historic Onsen',
    },
    {
      id: 'shigakogen',
      name: 'Shiga Kogen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Japan’s highest ski resort and largest connected ski area (18 resorts on 1 lift pass), renowned for ultra-dry microclimate powder snow.',
      image: '/images/ski-shiga-hero-4032x3024.jpg',
      price: '¥118,000〜',
      tag: 'Highest Elevation in Japan',
    },
    {
      id: 'yuzawa',
      name: 'Yuzawa & Naeba (Niigata)',
      region: 'Niigata Prefecture',
      hours: '2.5–3.0 Hours from Tokyo',
      desc: 'Legendary Snow Country with the fastest access from Tokyo. Huge resort facilities, heated ski-in/ski-out hotels, and natural hot spring spas.',
      image: '/images/ski-yuzawa-hero-4032x3024.jpg',
      price: '¥85,000〜',
      tag: 'Closest Powder to Tokyo',
    },
    {
      id: 'myoko',
      name: 'Myoko Kogen (Niigata)',
      region: 'Niigata Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Receiving over 13+ meters of annual snowfall from the Sea of Japan, world-famous for steep tree runs, backcountry, and authentic Japanese culture.',
      image: '/images/ski-myoko-hero-4032x3024.jpg',
      price: '¥125,000〜',
      tag: '13m+ Annual Snowfall',
    },
    {
      id: 'karuizawa',
      name: 'Karuizawa Prince (Nagano)',
      region: 'Nagano Prefecture',
      hours: '2.0–2.5 Hours from Tokyo',
      desc: 'An effortless luxury mountain escape only 2 hours from Tokyo, pairing pristine groomed ski slopes with Japan’s premier luxury shopping outlet.',
      image: '/images/ski-karuizawa-hero-4032x3024.jpg',
      price: '¥75,000〜',
      tag: 'Ski & Luxury Shopping',
    },
  ];

  const t = {
    badge: {
      ja: '4WD 駆動山岳仕様フリート · ブリヂストン製スタッドレスタイヤ完備',
      zh: '全系全时四驱山地特装 · 普利司通 Blizzak 顶级雪地胎保障',
      fr: 'FLOTTE 4X4 MONTAGNE · PNEUS NEIGE BRIDGESTONE BLIZZAK',
      es: 'FLOTA 4X4 DE MONTAÑA · NEUMÁTICOS DE NIEVE BRIDGESTONE BLIZZAK',
      en: '4WD Mountain Fleet · Bridgestone Blizzak Studless Tires',
    }[lang],
    heroTitle1: { ja: 'シャレー直行 · ', zh: '直达木屋木门 · ', fr: 'Porte-à-Porte Chalet · ', es: 'Puerta a Puerta · ', en: 'Door-to-Chalet ' }[lang],
    heroTitle2: {
      ja: '4WD 冬期専用スキー送迎',
      zh: '4WD 豪华滑雪专车直达',
      fr: 'Transferts Ski 4x4 d\'Excellence',
      es: 'Traslados Privados de Esquí 4x4',
      en: 'Private 4WD Ski Transfers',
    }[lang],
    heroDesc: {
      ja: '羽田・成田空港や都内ホテルから、白馬・野沢温泉・志賀高原・湯沢のシャレー玄関まで直行。新幹線乗り換えや重いスキー板・荷物の運搬ストレスはゼロ。',
      zh: '从东京市区或成田/羽田机场出发，专车直达白马、野泽温泉、志贺高原与越后汤泽木屋大堂。告别新干线倒车与拖拽笨重雪具的烦恼。',
      fr: 'Rejoignez directement les pistes de Hakuba, Nozawa Onsen et Shiga Kogen depuis Tokyo ou les aéroports. Fini les correspondances de train et le transport de matériel lourd.',
      es: 'Viaje directo desde Tokio o los aeropuertos hasta las pistas de Hakuba, Nozawa Onsen y Shiga Kogen sin transbordos ni cargar equipaje pesado de nieve.',
      en: 'Travel seamlessly from Tokyo, Haneda, or Narita directly to the ski lifts of Hakuba, Nozawa Onsen, Shiga Kogen, and Niigata. No train connections or dragging heavy ski bags.',
    }[lang],
    feat1Title: { ja: '電子制御 4WD / AWD', zh: '全时电子四驱 / AWD', fr: 'Transmission 4x4 / AWD', es: 'Tracción Total 4WD / AWD', en: 'Full-Time 4WD / AWD' }[lang],
    feat1Sub: { ja: '雪道・凍結路の安定走行', zh: '全地形雪地牵引力控制', fr: 'Contrôle électronique d\'adhérence', es: 'Control electrónico de tracción', en: 'Electronic traction control' }[lang],
    feat2Title: { ja: 'Blizzak スタッドレス', zh: '普利司通雪地胎', fr: 'Pneus Neige Blizzak', es: 'Neumáticos Blizzak', en: 'Blizzak Studless' }[lang],
    feat2Sub: { ja: '日本品質スタッドレス', zh: '日本原装专业级防滑胎', fr: 'Pneus hiver homologués Japon', es: 'Neumáticos de nieve japoneses', en: 'Japanese snow tires' }[lang],
    feat3Title: { ja: '大容量スキーバッグ積載', zh: '大容量雪具仓', fr: 'Capacité Sacs de Ski', es: 'Capacidad Equipo de Esquí', en: 'Ski Bag Capacity' }[lang],
    feat3Sub: { ja: 'ボード・ウェアも余裕', zh: '超大雪板与行李装载空间', fr: 'Espace généreux pour matériel', es: 'Amplio espacio para tablas', en: 'Generous gear storage' }[lang],
    feat4Title: { ja: '完全定額 保証', zh: '全包一口价保障', fr: 'Tarif Fixe Garanti', es: 'Tarifa Fija Garantizada', en: 'Flat Rate Guarantee' }[lang],
    feat4Sub: { ja: '高速代・ガソリン代込', zh: '包含高速费与全部油费', fr: 'Péages & carburant inclus', es: 'Peajes y combustible incluidos', en: 'All highway tolls & fuel' }[lang],
    configBtn: (open: boolean) => ({
      ja: open ? '予約モジュールを閉じる' : 'スキー送迎の日程・料金を設定する',
      zh: open ? '关闭预订模块' : '配置滑雪专车并估价',
      fr: open ? 'Fermer le Module' : 'Configurer le Transfert & Tarif',
      es: open ? 'Cerrar Módulo' : 'Configurar Traslado y Precio',
      en: open ? 'Close Booking Module' : 'Configure Ski Transfer & Price',
    }[lang]),
    whatsAppBtn: { ja: 'WhatsApp スキー専任デスク 24/7', zh: 'WhatsApp 滑雪专员 24/7', fr: 'Conciergerie Ski WhatsApp 24/7', es: 'Conserjería de Esquí WhatsApp 24/7', en: 'WhatsApp Ski Concierge 24/7' }[lang],
    howTag: { ja: 'ノンストレス山岳ロジスティクス', zh: '全流程极简出行', fr: 'Logistique Alpine Sans Stress', es: 'Logística Alpina Sin Complicaciones', en: 'Effortless Alpine Logistics' }[lang],
    howHead: { ja: 'スキー送迎の流れ', zh: '滑雪专车直达流程', fr: 'Comment Fonctionne Votre Transfert Ski', es: 'Cómo Funciona su Traslado de Esquí', en: 'How Your Ski Transfer Works' }[lang],
    howSub: { ja: '空港・都内ホテルのお迎えから、宿泊先の暖炉の前まで。', zh: '从机场/酒店大堂上车，一路安稳送达雪场木屋暖炉前。', fr: 'De votre prise en charge jusqu\'au coin du feu de votre chalet.', es: 'Desde la recogida en el hotel hasta la chimenea de su cabaña.', en: 'From touchdown at Haneda/Narita or your Tokyo hotel lobby straight to the lodge fire.' }[lang],
    s1Title: { ja: 'ホテル玄関での積載・お出迎え', zh: '专车上门接送与雪具装载', fr: 'Prise en Charge & Chargement', es: 'Recogida Privada y Carga', en: 'Private Curbside Pickup & Loading' }[lang],
    s1Desc: { ja: '空港や都内ホテルへ専任ドライバーが配車。スキーバッグ、スノーボード、ブーツ、スーツケースを丁寧に積載します。', zh: '专属司机在酒店或机场大厅迎接，为您妥善装载所有加长雪板包、雪靴及行李。', fr: 'Votre chauffeur vous accueille et charge l\'ensemble de vos skis, snowboards et bagages.', es: 'Su chófer le recoge y carga con cuidado todos los esquís, tablas y maletas en el maletero.', en: 'Your professional chauffeur meets you at Haneda, Narita, or your Tokyo hotel. All oversized ski bags, snowboards, boots, and luggage are securely loaded into the vehicle for you.' }[lang],
    s2Title: { ja: '快適な高速クルーズ＆SA休憩', zh: '舒适高速公路巡航与SA休息', fr: 'Trajet Autoroutier Confortable', es: 'Tránsito Cómodo por Autopista', en: 'Comfortable Highway Transit' }[lang],
    s2Desc: { ja: '暖房の効いた本革シートでリラックス。日本の最新サービスエリアで温かいラーメンやコーヒーをお楽しみいただけます。', zh: '在配备暖气的头等舱真皮座椅中休憩，途中停靠日本高规格服务区享用热拉面与咖啡。', fr: 'Détendez-vous dans des fauteuils chauffants avec arrêts recommandés dans les aires d\'autoroute japonaises.', es: 'Relájese en asientos calefactados con paradas en áreas de servicio para saborear ramen caliente y café.', en: 'Relax in climate-controlled leather captain chairs. Travel via scenic expressway passes with scheduled stops at premier Japanese Service Areas for hot ramen, artisan coffee, and snacks.' }[lang],
    s3Title: { ja: 'シャレー玄関前への直行お届け', zh: '木屋酒店门口直达交付', fr: 'Arrivée Directe au Chalet', es: 'Llegada Directa a la Puerta del Chalet', en: 'Direct Front-Door Chalet Delivery' }[lang],
    s3Desc: { ja: '4WD車両が積雪路をものともせず、シャレーや旅館の玄関先まで直行。シャトルバスを待つ必要は一切ありません。', zh: '四驱车辆轻松应对积雪盘山公路，直达私人木屋或温泉旅馆大门，无需再倒班车。', fr: 'Le véhicule 4x4 vous dépose au pied de votre chalet sans avoir à emprunter de navette sous la neige.', es: 'El 4x4 le deja en la misma puerta de su chalet sin necesidad de esperar autobuses lanzadera.', en: 'Your 4WD vehicle drives right up to the entrance of your private chalet, hotel, or ryokan on snowy mountain roads. Step out directly onto the snow without ever catching a shuttle bus.' }[lang],
    resortsTag: { ja: '厳選パウダースノーリゾート', zh: '精选粉雪滑雪胜地', fr: 'Destinations Poudreuse d\'Exception', es: 'Destinos de Nieve Polvo', en: 'Premier Powder Destinations' }[lang],
    resortsHead: { ja: '日本の主要スキーリゾート', zh: '日本精选滑雪度假村', fr: 'Stations de Ski Incontournables', es: 'Estaciones de Esquí en Japón', en: 'Curated Japan Ski Resorts' }[lang],
    resortsSub: { ja: '目的地を選択して定額料金と所要時間をご確認ください。', zh: '选择您的目的地以查看专车一口价与车程耗时。', fr: 'Sélectionnez votre destination pour consulter les tarifs et temps de trajet.', es: 'Seleccione su destino para consultar tarifas fijas y tiempos de viaje.', en: 'Select your destination to preview direct transfer rates and travel times.' }[lang],
    reserveBtn: { ja: '予約する', zh: '立即预订', fr: 'Réserver', es: 'Reservar', en: 'Reserve' }[lang],
    ctaHead: { ja: '極上の日本パウダースノーへ出かけませんか？', zh: '准备好开启您的日本极致粉雪之旅了吗？', fr: 'Prêt pour la Meilleure Poudreuse du Japon ?', es: '¿Listo para Disfrutar de la Mejor Nieve de Japón?', en: 'Ready for the Ultimate Japan Winter Powder?' }[lang],
    ctaSub: { ja: '定額料金でのオンライン予約、または複数スキー場周遊のカスタム相談も承ります。', zh: '在线锁定一口价专车，或联系我们的山地调度专家定制多雪场跨区行程。', fr: 'Réservez en ligne à tarif fixe ou échangez avec nos experts pour un circuit multi-stations.', es: 'Reserve online a tarifa fija o consulte con nuestros especialistas de montaña para circuitos a medida.', en: 'Book online with fixed flat rates or chat with our mountain logistics team for custom multi-resort transfers.' }[lang],
    ctaBtn: { ja: 'チャーター総合ポータルを開く', zh: '浏览包车大厅', fr: 'Explorer le Portail des Charters', es: 'Explorar Portal de Charters', en: 'Explore Main Charters Portal' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="winter" />

      {/* ══════════════════════════════════════════════════
          1. IMMERSIVE CINEMATIC HERO WITH SKITRAILS BACKDROP
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
        
        {/* Background Image: skitrails.jpg with luxury gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/skitrails.jpg"
            alt="Alpine Ski Trails Japan"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-black/60 to-black/75" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-fade-in">
            <Snowflake className="w-4 h-4 text-[#38BDF8] animate-pulse" />
            <span>{t.badge}</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              {t.heroTitle1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
              {t.heroDesc}
            </p>
          </div>

          {/* Luxury Feature Pillars (Frosted Glass) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2 text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <Car className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">{t.feat1Title}</h3>
              <p className="text-[11px] text-slate-300">{t.feat1Sub}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <ThermometerSnowflake className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">{t.feat2Title}</h3>
              <p className="text-[11px] text-slate-300">{t.feat2Sub}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <Luggage className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">{t.feat3Title}</h3>
              <p className="text-[11px] text-slate-300">{t.feat3Sub}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">{t.feat4Title}</h3>
              <p className="text-[11px] text-slate-300">{t.feat4Sub}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowBookingWizard(!showBookingWizard);
                if (!showBookingWizard) {
                  setTimeout(() => {
                    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-[#0068FF]/30 transition-all cursor-pointer hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              <span>{t.configBtn(showBookingWizard)}</span>
            </button>

            <a
              href={whatsAppSkiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 px-7 py-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>{t.whatsAppBtn}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TOGGLEABLE INTERACTIVE BOOKING WIZARD
          ══════════════════════════════════════════════════ */}
      {showBookingWizard && (
        <section id="booking-wizard" className="py-10 bg-[#0E131F] border-y border-slate-800 transition-colors animate-fade-in">
          <SkiTransferBookingModule
            initialResort={selectedResortForWizard}
            onBackToCatalog={() => setShowBookingWizard(false)}
          />
        </section>
      )}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8] flex items-center justify-center gap-1.5">
            <Mountain className="w-4 h-4" />
            {t.howTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.howHead}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.howSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              01
            </div>
            <h3 className="font-bold text-lg text-white">
              {t.s1Title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.s1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              02
            </div>
            <h3 className="font-bold text-lg text-white">
              {t.s2Title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.s2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              03
            </div>
            <h3 className="font-bold text-lg text-white">
              {t.s3Title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.s3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. CURATED SKI RESORTS DIRECTORY
          ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0A0E17] border-y border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8]">
              {t.resortsTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.resortsHead}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.resortsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skiResorts.map((resort) => (
              <div
                key={resort.id}
                className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={resort.image}
                      alt={resort.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-black/40" />
                    <div className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {resort.tag}
                    </div>
                    <div className="absolute bottom-3.5 left-3.5 bg-white/15 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2.5 py-0.5 rounded border border-white/20">
                      {resort.hours}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase text-[#38BDF8] tracking-wider block">
                      {resort.region}
                    </span>
                    <h3 className="font-bold text-lg text-white group-hover:text-[#38BDF8] transition-colors">
                      {resort.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {resort.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Flat Rate From</span>
                    <span className="text-lg font-extrabold text-white font-mono">{resort.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResortForWizard(resort.id);
                      setShowBookingWizard(true);
                      setTimeout(() => {
                        document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>{t.reserveBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. 4WD FLEET SPECIFICATIONS & CAPACITY
          ══════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8]">
            Commercial MLIT Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            4WD Winter Fleet &amp; Gear Capacities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered for mountain snow safety and passenger comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Alphard */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                alt="Toyota Alphard 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                VIP 1–4 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">Toyota Alphard 4WD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heated leather Ottoman captain chairs with personal climate controls and ultra-quiet mountain driving dynamics.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–4 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 4 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">3–4 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Granace */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-granace-exterior-4032x3024.jpg"
                alt="Toyota Granace 4WD VIP"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                VIP 1–5 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">Toyota Granace 4WD VIP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-size luxury MPV with 4 independent leather captain seats across 2nd &amp; 3rd rows and high ground clearance.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–5 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 5 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">4–5 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

          {/* HiAce */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-hiace-exterior-1477x1108.jpg"
                alt="HiAce Grand Cabin 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                Groups 1–9 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">HiAce Grand Cabin 4WD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-roof wide cabin with massive luggage capacity designed for large families, corporate ski retreats, and ski groups.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–9 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 9 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">9–10 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. BOTTOM CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0E131F] border-t border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#0068FF]/20 text-[#38BDF8] flex items-center justify-center mx-auto border border-[#0068FF]/30">
            <Snowflake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.ctaHead}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {t.ctaSub}
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/tours"
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-7 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{t.ctaBtn}</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
