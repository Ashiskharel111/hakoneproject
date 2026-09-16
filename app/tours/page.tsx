'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Compass,
  Snowflake,
  MapPin,
  Calendar,
  Users,
  Luggage,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Car,
  Star,
  Clock,
  CheckCircle2,
  Lock,
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import type { BookingPaymentDetails } from '@/components/StripePaymentModal';
import type { TransferDirection } from '@/components/AirportTransferModule';
import { useLanguage } from '@/context/LanguageContext';
import { Airport } from '@/lib/airport-pricing';

const StripePaymentModal = dynamic(() => import('@/components/StripePaymentModal'), { ssr: false });
const BookingConfirmationModal = dynamic(() => import('@/components/BookingConfirmationModal'), { ssr: false });
const RouteDistanceVisualizer = dynamic(() => import('@/components/RouteDistanceVisualizer'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0A0D14] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-8 min-h-[420px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Loading Route Visualizer...</span>
      </div>
    </div>
  ),
});
const AirportTransferModule = dynamic(() => import('@/components/AirportTransferModule'), {
  loading: () => <div className="p-8 text-center text-xs text-slate-400">Loading Airport Transfer...</div>,
});
const DayTourBookingModule = dynamic(() => import('@/components/DayTourBookingModule'), {
  loading: () => <div className="p-8 text-center text-xs text-slate-400">Loading Charter Booking...</div>,
});
const SkiTransferBookingModule = dynamic(() => import('@/components/SkiTransferBookingModule'), {
  loading: () => <div className="p-8 text-center text-xs text-slate-400">Loading Ski Transfer...</div>,
});

type ServiceCategory = 'all' | 'airport' | 'sightseeing' | 'ski';

export default function GrandToursHomePage() {
  const [lang, setLang] = useLanguage();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search Filter State (Floating Quick Quote)
  const [searchTab, setSearchTab] = useState<'airport' | 'sightseeing' | 'ski'>('airport');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  
  // Airport state
  const [transferDirection, setTransferDirection] = useState<TransferDirection>('airport_to_hotel');
  const [pickupAirport, setPickupAirport] = useState<Airport>('HND');
  
  // Day charter & Ski state
  const [destinationLocation, setDestinationLocation] = useState<string>('fuji-kawaguchiko');
  const [pickupLocation, setPickupLocation] = useState<string>('hnd');

  const [quotePax, setQuotePax] = useState<string>('2');
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [quoteTime, setQuoteTime] = useState('10:00');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // State to replace catalog below with interactive Booking Module ('none' | 'airport' | 'sightseeing' | 'ski')
  const [activeBookingModule, setActiveBookingModule] = useState<'none' | 'airport' | 'sightseeing' | 'ski'>('none');
  const [selectedCharterDest, setSelectedCharterDest] = useState<string>('fuji-kawaguchiko');
  const [selectedSkiResort, setSelectedSkiResort] = useState<string>('hakuba');

  // Stripe Checkout Modal State
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');
  const [selectedTourForCheckout, setSelectedTourForCheckout] = useState<BookingPaymentDetails | null>(null);

  // Fleet Tab
  const [selectedFleet, setSelectedFleet] = useState<'hiace' | 'alphard' | 'granace'>('alphard');
  const [fleetPhotoView, setFleetPhotoView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === 'airport') {
      setActiveBookingModule('airport');
    } else if (searchTab === 'sightseeing') {
      setSelectedCharterDest(destinationLocation);
      setActiveBookingModule('sightseeing');
    } else if (searchTab === 'ski') {
      setSelectedSkiResort(destinationLocation);
      setActiveBookingModule('ski');
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Multilingual Catalog Data
  const toursCatalog = [
    {
      id: 'airport-transfer',
      category: 'airport' as const,
      categoryType: 'airport_transfer' as const,
      categoryBadge: {
        ja: '空港・都市間送迎 ハイヤー',
        zh: '机场/城际专属 定额接送',
        fr: 'TRANSFERT AÉROPORT & VILLE',
        es: 'TRASLADO AEROPUERTO Y CIUDAD',
        en: 'AIRPORT & CITY TRANSFER',
      }[lang],
      title: {
        ja: '羽田・成田空港 ⇄ 東京都内 完全定額ハイヤー送迎',
        zh: '羽田・成田机场 ⇄ 东京市内酒店 专属定额接送',
        fr: 'Transferts Aéroports Haneda & Narita ⇄ Hôtels Tokyo',
        es: 'Traslados Aeropuerto Haneda y Narita ⇄ Hoteles de Tokio',
        en: 'Tokyo Airport Transfers (Haneda & Narita ⇄ City)',
      }[lang],
      image: '/images/airport-transfer-vip-alphard-1376x768.jpg',
      badge: { ja: '⭐ 人気No.1 定番', zh: '⭐ 人气必选', fr: '⭐ Top Vente', es: '⭐ Más Popular', en: '⭐ Best Seller' }[lang],
      rating: '4.99',
      reviewCount: 580,
      duration: { ja: '所要時間: 45〜75分 / 3時間〜', zh: '耗时: 45–75分钟 / 3小时起', fr: '45–75 mins / 3h', es: '45–75 mins / 3h', en: '45–75 mins / 3h' }[lang],
      highlights: [
        { ja: 'フライト遅延¥0・完全無料待機', zh: '航班延误¥0加价・免费灵活守候', fr: 'Attente flexible gratuite — 0 frais retard', es: 'Espera flexible gratis — 0 cargos retraso', en: '100% Free Flexible Wait — No Delay Fees' }[lang],
        { ja: '3時間送迎は走行距離ベースで算出', zh: '3小时接送服务按实际行驶距离计算', fr: 'Transferts de 3h basés sur la distance parcourue', es: 'Traslados de 3h calculados según la distancia', en: '3-Hour transfers are based on distance travelled' }[lang],
        { ja: '（他県への送迎はWhatsAppよりお問い合わせください）', zh: '（跨县接送请通过 WhatsApp 咨询）', fr: '(En cas de transfert vers une autre préfecture, renseignez-vous via WhatsApp)', es: '(En caso de traslado a otra prefectura consulte por WhatsApp)', en: '(in case of transfer to a different prefecture inquire through WhatsApp)' }[lang],
      ],
      priceFormatted: '¥24,000〜',
      priceNum: 24000,
      link: '/tours/airport-transfer',
      vehicleType: 'alphard' as const,
      vehicleName: { ja: 'トヨタ アルファード エグゼクティブ', zh: '丰田埃尔法 Executive', fr: 'Toyota Alphard Executive', es: 'Toyota Alphard Executive', en: 'Toyota Alphard Executive' }[lang],
    },
    {
      id: 'fuji-kawaguchiko',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: {
        ja: '観光貸切チャーター',
        zh: '观光包车 一日游',
        fr: 'EXCURSION PRIVÉE',
        es: 'TOUR PRIVADO',
        en: 'DAY CHARTER',
      }[lang],
      title: {
        ja: '富士山・河口湖・忍野八海・新倉山浅間公園 10時間貸切',
        zh: '富士山・河口湖・忍野八海・新仓山浅间公园 10小时一日游',
        fr: 'Mont Fuji, Lac Kawaguchiko & Pagode Chureito (10h)',
        es: 'Monte Fuji, Lago Kawaguchiko y Pagoda Chureito (10h)',
        en: 'Mount Fuji, Lake Kawaguchiko & Chureito Pagoda Day Charter',
      }[lang],
      image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
      badge: { ja: '👑 王道・富士山', zh: '👑 经典富士', fr: '👑 Emblématique', es: '👑 Clásico Fuji', en: '👑 Iconic Fuji' }[lang],
      rating: '4.99',
      reviewCount: 420,
      duration: { ja: '所要時間: 10時間', zh: '行程: 10小时', fr: '10 Heures', es: '10 Horas', en: '10 Hours' }[lang],
      highlights: [
        { ja: '新倉山浅間公園（五重塔と富士山）', zh: '新仓山浅间公园经典五重塔同框', fr: 'Vue emblématique Pagode & Fuji', es: 'Pagoda Chureito con vistas', en: 'Arakurayama Sengen Pagoda View' }[lang],
        { ja: '忍野八海 湧水池散策', zh: '忍野八海清澈涌泉古民家', fr: 'Sources pures Oshino Hakkai', es: 'Manantiales sagrados Oshino Hakkai', en: 'Oshino Hakkai Sacred Springs' }[lang],
        { ja: '大石公園 湖畔ラベンダー・コキア', zh: '大石公园湖畔花海四季美景', fr: 'Parc Oishi au bord du lac', es: 'Parque Oishi junto al lago', en: 'Lake Oishi Seasonal Flowers' }[lang],
      ],
      priceFormatted: '¥100,000〜',
      priceNum: 100000,
      link: '/destinations/fuji-kawaguchiko',
      vehicleType: 'alphard' as const,
      vehicleName: { ja: 'トヨタ アルファード / グランエース VIP', zh: '丰田埃尔法 / 格兰斯 VIP', fr: 'Toyota Alphard / Granace VIP', es: 'Toyota Alphard / Granace VIP', en: 'Toyota Alphard / Granace VIP' }[lang],
    },
    {
      id: 'hakone-lake-ashi',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: {
        ja: '観光貸切チャーター',
        zh: '观光包车 一日游',
        fr: 'EXCURSION PRIVÉE',
        es: 'TOUR PRIVADO',
        en: 'DAY CHARTER',
      }[lang],
      title: {
        ja: '箱根 芦ノ湖・大涌谷・箱根神社・日帰り温泉 9時間貸切ツアー',
        zh: '箱根 芦之湖・大涌谷・箱根神社水上鸟居・日归温泉 9小时专属包车',
        fr: 'Hakone Onsen, Lac Ashi, Torii Flottant & Owakudani (9h)',
        es: 'Hakone Onsen, Lago Ashi, Torii Flotante y Owakudani (9h)',
        en: 'Hakone Onsen, Lake Ashi Pirate Cruise & Owakudani Volcano (9h)',
      }[lang],
      image: '/images/dest-hakone-lake-ashi-1376x768.jpg',
      badge: { ja: '♨️ 温泉と湖畔', zh: '♨️ 温泉体验', fr: '♨️ Onsen & Nature', es: '♨️ Onsen y Naturaleza', en: '♨️ Onsen & Scenery' }[lang],
      rating: '4.97',
      reviewCount: 360,
      duration: { ja: '所要時間: 9時間', zh: '行程: 9小时', fr: '9 Heures', es: '9 Horas', en: '9 Hours' }[lang],
      highlights: [
        { ja: '大涌谷 火山ガスと黒たまご', zh: '大涌谷地热奇观与延寿黑玉子', fr: 'Volcan Owakudani & œufs noirs', es: 'Volcán Owakudani y huevos negros', en: 'Owakudani Active Volcanic Valley' }[lang],
        { ja: '箱根神社 平和の鳥居参拝', zh: '箱根神社湖中平和之鸟居打卡', fr: 'Torii rouge flottant sur le lac', es: 'Torii flotante del santuario', en: 'Hakone Shrine Floating Water Torii' }[lang],
        { ja: '名湯 箱根日帰り貸切温泉立ち寄り', zh: '可自由安排顶级日归温泉体验', fr: 'Arrêt source thermale privée', es: 'Parada en onsen tradicional', en: 'Optional Private Luxury Onsen Stop' }[lang],
      ],
      priceFormatted: '¥90,000〜',
      priceNum: 90000,
      link: '/destinations/hakone-lake-ashi',
      vehicleType: 'alphard' as const,
      vehicleName: { ja: 'トヨタ アルファード エグゼクティブ', zh: '丰田埃尔法 Executive', fr: 'Toyota Alphard Executive', es: 'Toyota Alphard Executive', en: 'Toyota Alphard Executive' }[lang],
    },
    {
      id: 'kamakura-enoshima',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: {
        ja: '観光貸切チャーター',
        zh: '观光包车 一日游',
        fr: 'EXCURSION PRIVÉE',
        es: 'TOUR PRIVADO',
        en: 'DAY CHARTER',
      }[lang],
      title: {
        ja: '古都鎌倉 大仏・報国寺竹林・江の島・湘南海岸 8時間貸切ツアー',
        zh: '古都镰仓 大佛・报国寺竹林・江之岛・湘南海岸 8小时经典包车',
        fr: 'Kamakura, Grand Bouddha, Forêt de Bambous & Enoshima (8h)',
        es: 'Kamakura, Gran Buda, Bambudal y Costa de Enoshima (8h)',
        en: 'Kamakura Great Buddha, Bamboo Grove & Enoshima Coastal Tour (8h)',
      }[lang],
      image: '/images/dest-kamakura-enoshima-1376x768.jpg',
      badge: { ja: '🏯 古都と海岸', zh: '🏯 古都海风', fr: '🏯 Histoire & Côte', es: '🏯 Historia y Costa', en: '🏯 Samurai & Coast' }[lang],
      rating: '4.96',
      reviewCount: 290,
      duration: { ja: '所要時間: 8時間', zh: '行程: 8小时', fr: '8 Heures', es: '8 Horas', en: '8 Hours' }[lang],
      highlights: [
        { ja: '高徳院 国宝鎌倉大仏拝観', zh: '高德院日本国宝镰仓大佛', fr: 'Grand Bouddha de Kotoku-in', es: 'Gran Buda de Kotoku-in', en: 'Kotoku-in Great Bronze Buddha' }[lang],
        { ja: '報国寺 幽玄な竹林と抹茶席', zh: '报国寺清幽竹林与现刷抹茶', fr: 'Bambouseraie de Hokoku-ji & matcha', es: 'Bambudal de Hokoku-ji y té matcha', en: 'Hokoku-ji Bamboo Grove & Matcha' }[lang],
        { ja: '湘南海岸ドライブ・江ノ島遠望', zh: '湘南海岸灌篮高手经典巡礼', fr: 'Route côtière de Shonan', es: 'Carretera costera de Shonan', en: 'Shonan Coastline & Enoshima Views' }[lang],
      ],
      priceFormatted: '¥80,000〜',
      priceNum: 80000,
      link: '/destinations/kamakura-enoshima',
      vehicleType: 'alphard' as const,
      vehicleName: { ja: 'トヨタ アルファード エグゼクティブ', zh: '丰田埃尔法 Executive', fr: 'Toyota Alphard Executive', es: 'Toyota Alphard Executive', en: 'Toyota Alphard Executive' }[lang],
    },
    {
      id: 'nikko-unesco',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: {
        ja: '観光貸切チャーター',
        zh: '观光包车 一日游',
        fr: 'EXCURSION PRIVÉE',
        es: 'TOUR PRIVADO',
        en: 'DAY CHARTER',
      }[lang],
      title: {
        ja: '世界遺産 日光東照宮・華厳の滝・中禅寺湖・いろは坂 10時間貸切ツアー',
        zh: '世界遗产 日光东照宫・华严瀑布・中禅寺湖 10小时专属包车',
        fr: 'Nikko Toshogu UNESCO, Cascade de Kegon & Lac Chuzenji (10h)',
        es: 'Nikko Toshogu UNESCO, Cascada Kegon y Lago Chuzenji (10h)',
        en: 'Nikko UNESCO Toshogu Shrine, Kegon Falls & Lake Chuzenji Tour (10h)',
      }[lang],
      image: '/images/dest-nikko-unesco-1376x768.jpg',
      badge: { ja: '⛩️ 世界遺産ゴールド', zh: '⛩️ 世界遗产', fr: '⛩️ Patrimoine UNESCO', es: '⛩️ Patrimonio UNESCO', en: '⛩️ UNESCO Gold' }[lang],
      rating: '4.98',
      reviewCount: 310,
      duration: { ja: '所要時間: 10時間', zh: '行程: 10小时', fr: '10 Heures', es: '10 Horas', en: '10 Hours' }[lang],
      highlights: [
        { ja: '国宝 陽明門・三猿・眠り猫', zh: '国宝金箔阳明门与三猿木雕', fr: 'Porte Yomeimon dorée & 3 singes', es: 'Puerta dorada Yomeimon y 3 monos', en: 'UNESCO Toshogu Gold Shrines' }[lang],
        { ja: '落差97m 日本三大名瀑 華厳の滝', zh: '落差97米华严瀑布轰鸣名景', fr: 'Cascade de Kegon de 97 mètres', es: 'Cascada de Kegon de 97 metros', en: 'Kegon Waterfall 100m Gorge' }[lang],
        { ja: 'いろは坂パノラマ・中禅寺湖畔', zh: '伊吕波坂48弯道与高山湖景', fr: 'Col d\'Irohazaka & Lac Chuzenji', es: 'Paso Irohazaka y Lago Chuzenji', en: 'Irohazaka Winding Pass & Lake' }[lang],
      ],
      priceFormatted: '¥100,000〜',
      priceNum: 100000,
      link: '/destinations/nikko-unesco',
      vehicleType: 'alphard' as const,
      vehicleName: { ja: 'トヨタ アルファード / グランエース VIP', zh: '丰田埃尔法 / 格兰斯 VIP', fr: 'Toyota Alphard / Granace VIP', es: 'Toyota Alphard / Granace VIP', en: 'Toyota Alphard / Granace VIP' }[lang],
    },
    {
      id: 'winter-hakuba',
      category: 'ski' as const,
      categoryType: 'winter_transfer' as const,
      categoryBadge: {
        ja: '4WD スキー直行ハイヤー',
        zh: '4WD 雪季滑雪专车',
        fr: 'TRANSFERT SKI 4X4',
        es: 'TRASLADO ESQUÍ 4X4',
        en: 'SKI CHARTER',
      }[lang],
      title: {
        ja: '東京・羽田・成田発 白馬バレー 4WDスタッドレス直行送迎',
        zh: '东京/羽田/成田 ⇄ 长野白马 4WD雪胎直达滑雪专车',
        fr: 'Transfert Ski VIP Tokyo / Aéroports ⇄ Hakuba Valley 4WD',
        es: 'Transfer de Esquí VIP Tokio / Aeropuertos ⇄ Hakuba 4WD',
        en: 'Tokyo / Airports ⇄ Hakuba Valley 4WD Snow Direct Transfer',
      }[lang],
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      badge: { ja: '❄️ パウダースノー', zh: '❄️ 顶级粉雪', fr: '❄️ Poudreuse VIP', es: '❄️ Nieve Polvo', en: '❄️ Powder Ski' }[lang],
      rating: '4.99',
      reviewCount: 490,
      duration: { ja: '玄関直行・乗換不要', zh: '门到门直达包车', fr: 'Porte-à-porte direct', es: 'Puerta a puerta directo', en: 'Direct Door-to-Door' }[lang],
      highlights: [
        { ja: '全車4WD・最新スタッドレスタイヤ', zh: '全系全时四驱及专业雪地轮胎', fr: 'Véhicules 4x4 pneus neige', es: 'Vehículos 4x4 neumáticos nieve', en: '4WD Vehicles & Bridgestone Snow Tires' }[lang],
        { ja: 'スキー板・大型荷物無料積載', zh: '滑雪板及大件行李全免费装载', fr: 'Transport housses ski gratuit', es: 'Transporte de esquís gratuito', en: 'Ski Bags & Oversized Luggage Free' }[lang],
        { ja: 'ホテル・シャレー玄関前直行', zh: '酒店木屋前门直达无换乘', fr: 'Porte-à-porte jusqu\'au chalet', es: 'Puerta a puerta hasta el chalet', en: 'Direct Door-to-Chalet / Hotel Service' }[lang],
      ],
      priceFormatted: '¥120,000〜',
      priceNum: 120000,
      link: '/tours/winter',
      vehicleType: 'granace' as const,
      vehicleName: { ja: 'トヨタ グランエース 4WD VIP', zh: '丰田格兰斯 4WD VIP', fr: 'Toyota Granace 4WD VIP', es: 'Toyota Granace 4WD VIP', en: 'Toyota Granace 4WD VIP' }[lang],
    },
  ];

  const filteredTours = activeCategory === 'all'
    ? toursCatalog
    : toursCatalog.filter((t) => t.category === activeCategory);

  // Fleet Specs Data (Standard, Premium, Ultra Premium)
  const fleetData = {
    hiace: {
      name: { ja: 'トヨタ ハイエース グランドキャビン', zh: '丰田海狮 Grand Cabin', fr: 'Toyota HiAce Grand Cabin', es: 'Toyota HiAce Grand Cabin', en: 'Toyota HiAce Grand Cabin' }[lang],
      tier: 'Standard',
      goldBadge: { ja: 'スタンダード', zh: '标准座驾', fr: 'STANDARD', es: 'ESTÁNDAR', en: 'STANDARD' }[lang],
      badge: { ja: '大人数・荷物特化 最大9名乗り', zh: '超大容量 团体出行 首选', fr: 'Grand Van 9 Passagers', es: 'Gran Monovolumen 9 Pasajeros', en: 'High-Capacity Group Van' }[lang],
      capacity: { ja: 'ご乗車 1〜9名', zh: '可乘 1–9 位贵宾', fr: '1–9 Passagers', es: '1–9 Pasajeros', en: '1–9 Guests' }[lang],
      luggage: { ja: '大型スーツケース 9〜10個', zh: '9–10 件大号行李箱', fr: '9–10 Grandes Valises', es: '9–10 Maletas Grandes', en: '9–10 Large Bags' }[lang],
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
      name: { ja: 'トヨタ アルファード エグゼクティブラウンジ', zh: '丰田埃尔法 Executive Lounge', fr: 'Toyota Alphard Executive Lounge', es: 'Toyota Alphard Executive Lounge', en: 'Toyota Alphard Executive Lounge' }[lang],
      tier: 'Premium',
      goldBadge: { ja: 'プレミアム', zh: '豪华商务', fr: 'PREMIUM', es: 'PREMIUM', en: 'PREMIUM' }[lang],
      badge: { ja: 'VIPキャプテンシート搭載 4名乗り', zh: '头等舱航空座椅 4座旗舰', fr: 'Sièges Capitaine VIP', es: 'Asientos Capitán VIP', en: 'VIP First-Class Captain Seats' }[lang],
      capacity: { ja: 'ご乗車 1〜4名', zh: '可乘 1–4 位贵宾', fr: '1–4 Passagers', es: '1–4 Pasajeros', en: '1–4 Guests' }[lang],
      luggage: { ja: '大型スーツケース 3〜4個', zh: '3–4 件大号行李箱', fr: '3–4 Grandes Valises', es: '3–4 Maletas Grandes', en: '3–4 Large Suitcases' }[lang],
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
      name: { ja: 'トヨタ グランエース 4WD VIPラウンジ', zh: '丰田格兰斯 4WD VIP Lounge', fr: 'Toyota Granace 4WD VIP Lounge', es: 'Toyota Granace 4WD VIP Lounge', en: 'Toyota Granace 4WD VIP Lounge' }[lang],
      tier: 'Ultra Premium Vehicle',
      goldBadge: { ja: 'ウルトラプレミアム', zh: '顶级旗舰', fr: 'ULTRA PREMIUM', es: 'ULTRA PREMIUM', en: 'ULTRA PREMIUM' }[lang],
      badge: { ja: '最高峰4WD 独立4座 5名乗り', zh: '全时四驱 独立四座 5座旗舰', fr: 'Flagship 4x4 Exécutif', es: 'Monovolumen 4x4 VIP', en: 'Executive 6-Seater Flagship' }[lang],
      capacity: { ja: 'ご乗車 1〜5名', zh: '可乘 1–5 位贵宾', fr: '1–5 Passagers', es: '1–5 Pasajeros', en: '1–5 Guests' }[lang],
      luggage: { ja: '大型スーツケース 4〜5個', zh: '4–5 件大号行李箱', fr: '4–5 Grandes Valises', es: '4–5 Maletas Grandes', en: '4–5 Large Suitcases' }[lang],
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
        fr: 'Comment se déroule l\'accueil à l\'aéroport ?',
        es: '¿Cómo funciona la recogida en el aeropuerto?',
      },
      a: {
        en: 'Your assigned chauffeur monitors your inbound aircraft live and synchronizes dispatch to your actual landing. As long as our chauffeur is not already waiting at the airport, you will never be charged for flight delays (100% free delay protection / ¥0 fees). They will greet you at the arrival exit hall holding a personalized welcome nameboard.',
        ja: '担当ドライバーがフライトの到着時刻をリアルタイムで追跡し、実際の着陸に合わせて配車を調整します。空港での無駄な待機が発生しない限り、フライト遅延による追加料金は一切いただきません（¥0完全無料）。税関出口にてお名前を掲示してお待ちします。',
        zh: '专属司机会实时跟踪您的航班进港动态，并根据实际落地时间精准调度。只要司机未在机场产生空等，航班延误绝不收取任何延误费（100%免费¥0守候）。司机将在国际到达出口手持尊享姓名牌迎接您。',
        fr: 'Votre chauffeur dédié suit votre vol en direct et synchronise son arrivée avec votre atterrissage réel. Tant que le chauffeur n\'attend pas inutilement à l\'aéroport, aucun frais de retard n\'est facturé (protection retard 100% gratuite / 0 ¥). Il vous accueillera dans le hall avec une pancarte personnalisée.',
        es: 'Su chófer asignado monitorea su vuelo en tiempo real y sincroniza su llegada con el aterrizaje real. Mientras el chófer no esté esperando innecesariamente en el aeropuerto, nunca se le cobrarán recargos por retraso (espera 100% gratis / 0 ¥). Le esperará en llegadas con un cartel con su nombre.',
      },
    },
    {
      q: {
        en: 'Are the prices fixed or metered?',
        ja: '料金は定額ですか、それともメーター制ですか？',
        zh: '车费是固定包干还是按打表计算？',
        fr: 'Les tarifs sont-ils fixes ou au compteur ?',
        es: '¿Los precios son fijos o con taxímetro?',
      },
      a: {
        en: 'All fares on SK LIMO are 100% fixed, all-inclusive, and guaranteed upon booking. Expressway highway tolls, fuel, vehicle insurance, and parking are fully covered with zero surge pricing or unexpected meter surprises.',
        ja: 'SK LIMOのすべての料金は完全定額制です。高速道路料金、燃料代、車両保険、駐車場代がすべて含まれており、渋滞や混雑による追加請求は一切ございません。',
        zh: 'SK LIMO所有价格均为100%固定全包价。高速过路费、燃油费、商业保险均已包含在内，绝无高峰溢价或额外加价。',
        fr: 'Tous les tarifs sur SK LIMO sont 100 % fixes et tout compris. Les péages d\'autoroute, le carburant, l\'assurance commerciale et les parkings sont entièrement inclus sans majoration imprévue.',
        es: 'Todas las tarifas en SK LIMO son 100% fijas y con todo incluido. Peajes de autopista, combustible, seguro comercial y aparcamientos están cubiertos sin cargos sorpresa ni suplementos.',
      },
    },
    {
      q: {
        en: 'What happens if my flight is delayed or rescheduled?',
        ja: 'フライトが遅延または変更になった場合はどうなりますか？',
        zh: '如果我的航班延误或改期怎么办？',
        fr: 'Que se passe-t-il si mon vol est retardé ou reporté ?',
        es: '¿Qué ocurre si mi vuelo se retrasa o reprograma?',
      },
      a: {
        en: 'We monitor your flight status in real time. Because dispatch is timed to your actual touchdown, flight delays incur zero extra fees (as long as our chauffeur is not already waiting at the airport, we will not charge). If your flight is cancelled or rescheduled by the airline, provide notice for a free rebooking or full refund.',
        ja: '便名をリアルタイム監視し、実際の着陸時刻に合わせてドライバーを配車するため、空港での待機が発生しない限りフライト遅延による追加料金は一切いただきません（¥0完全無料）。航空会社都合の欠航・日程変更時はご連絡いただければ無料で日程変更または全額返金いたします。',
        zh: '我们实时监控您的航班信息，接机时间按实际着陆自动调整。只要司机未在机场产生无效等候，航班延误绝不加收任何费用（延误费¥0）。如遇航班取消或改期，凭航司通知即可免费改期或全额退款。',
        fr: 'Nous suivons votre vol en temps réel. Le départ du chauffeur étant calé sur votre atterrissage effectif, les retards de vol n\'engendrent aucun surcoût (tant que le chauffeur n\'attend pas à l\'aéroport, aucun frais). En cas d\'annulation, contactez-nous pour report ou remboursement.',
        es: 'Monitoreamos su vuelo en tiempo real. La salida del chófer se sincroniza con su aterrizaje real, por lo que los retrasos no generan costes adicionales (mientras no estemos esperando en el aeropuerto, no cobramos). En caso de cancelación, reprogramación gratuita o reembolso.',
      },
    },
    {
      q: {
        en: 'What payment methods do you accept?',
        ja: '利用可能な決済方法は何ですか？',
        zh: '支持哪些支付方式？',
        fr: 'Quels modes de paiement acceptez-vous ?',
        es: '¿Qué métodos de pago aceptan?',
      },
      a: {
        en: 'We accept Apple Pay (1-click express checkout), Google Pay, Credit Cards (Visa, Mastercard, American Express, JCB, UnionPay), WeChat Pay (微信支付), Alipay (支付宝), and PayPay via encrypted Level-1 PCI-DSS Stripe processing.',
        ja: 'Apple Pay（ワンクリック即時決済）、Google Pay、各種クレジットカード（VISA、Mastercard、AMEX、JCB、銀聯）、WeChat Pay（微信支付）、Alipay（支付宝）、PayPayに対応しております。',
        zh: '支持Apple Pay一键极速支付、Google Pay、国际主流信用卡（Visa、Mastercard、Amex、JCB、银联）、微信支付、支付宝及PayPay。',
        fr: 'Nous acceptons Apple Pay (1-clic express), Google Pay, cartes bancaires (Visa, Mastercard, Amex, JCB, UnionPay), WeChat Pay, Alipay et PayPay via paiement sécurisé Stripe Niveau-1 PCI-DSS.',
        es: 'Aceptamos Apple Pay (1-clic express), Google Pay, tarjetas de crédito (Visa, Mastercard, Amex, JCB, UnionPay), WeChat Pay, Alipay y PayPay mediante pasarela segura cifrada Stripe PCI-DSS Nivel-1.',
      },
    },
    {
      q: {
        en: 'Are your vehicles legally licensed in Japan?',
        ja: '車両は日本の法令に基づき正規に認可されていますか？',
        zh: '车辆是否具有日本正规营运资质？',
        fr: 'Vos véhicules disposent-ils d\'une licence légale au Japon ?',
        es: '¿Sus vehículos cuentan con licencia oficial en Japón?',
      },
      a: {
        en: 'Yes. 100% of our fleet operates on Japanese commercial "Green Plates" (緑ナンバー) authorized by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) with comprehensive commercial passenger liability insurance.',
        ja: 'はい。当社のすべての車両は、国土交通省関東運輸局の正規認可を受けた「緑ナンバー（営業用登録）」車両であり、万全の搭乗者傷害保険が完備されています。',
        zh: '是的。我们的所有车队均具有日本国土交通省正规营运资质（绿牌合规营运），并全额配备高额商业乘客意外与人身保险。',
        fr: 'Oui. 100 % de notre flotte roule sous immatriculation commerciale officielle "Plaque Verte" (緑ナンバー) agréée par le Ministère des Transports (MLIT) avec assurance responsabilité passagers complète.',
        es: 'Sí. El 100% de nuestra flota opera con "Placas Verdes" comerciales oficiales (緑ナンバー) autorizadas por el Ministerio de Transporte de Japón (MLIT) con seguro completo de responsabilidad civil.',
      },
    },
  ];

  const t = {
    heroRibbon: {
      ja: '国土交通省許可 正規緑ナンバー・保険完備',
      zh: '官方绿牌认证・商业保险完备',
      fr: 'LICENCIÉ ET ASSURÉ',
      es: 'LICENCIADO Y ASEGURADO',
      en: 'LICENSED & INSURED',
    }[lang],
    heroSubhead: {
      ja: '日本最高峰のプライベートハイヤー体験 —',
      zh: '日本头等舱级专属专车出行 —',
      fr: 'Voyage Première Classe au Japon —',
      es: 'Viajes de Primera Clase en Japón —',
      en: 'First-Class Travel in Japan —',
    }[lang],
    heroMainhead: {
      ja: '完全定額・安心の送迎クオリティをお約束。',
      zh: '全包定额、全程无忧的尊享服务。',
      fr: 'Chaque trajet, parfaitement pris en charge.',
      es: 'Cada viaje, perfectamente cubierto.',
      en: 'Every ride, perfectly covered.',
    }[lang],
    check1: {
      ja: '完全定額料金制 — 高速料金・駐車場・消費税込、チップ不要。',
      zh: '全包一口价 — 包含高速费、停车费及税费，无任何小费或隐形收费。',
      fr: 'Tarifs fixes tout compris — Péages, parking et taxes inclus, aucun pourboire requis.',
      es: 'Precios fijos todo incluido — Peajes de autopista, parking e impuestos incluidos, sin propinas obligatorias.',
      en: 'All-inclusive fixed prices — Expressway tolls, parking & taxes in, zero tipping expected.',
    }[lang],
    check2: {
      ja: 'フライトリアルタイム追跡 — 到着遅延時も追加料金ゼロ(¥0)・完全無料待機。',
      zh: '航班动态实时跟踪 — 延误零加价，100%免费灵活守候。',
      fr: 'Suivi de vol en direct — Retard ? Attente 100% flexible gratuite & zéro frais de retard.',
      es: 'Rastreo de vuelos en vivo — ¿Retraso? Espera 100% flexible gratis y 0 cargos por retraso.',
      en: 'Flight tracked live — Delayed? 100% free flexible wait with zero delay charges.',
    }[lang],
    check3: {
      ja: '到着ロビーお出迎え — 税関出口でネームボードを掲示して専任ドライバーがお待ちします。',
      zh: '到达厅举牌接机 — 专属司机手持定制欢迎名牌在国际出口等候。',
      fr: 'Accueil personnalisé — Chauffeur en costume avec panneau nominatif dès la sortie.',
      es: 'Recepción en llegadas — Chófer uniformado con cartel personalizado en la terminal.',
      en: 'Curbside meet & greet — Chauffeur meets you at arrivals with personalized nameboard.',
    }[lang],
    check4: {
      ja: '24時間バイリンガル配車デスク — 英語・日本語・中国語でのWhatsApp即時対応。',
      zh: '24/7中英日三语调度中心 — WhatsApp即时客服，全天候保驾护航。',
      fr: 'Support bilingue 24/7 — Coordination et dispatch immédiats sur WhatsApp.',
      es: 'Atención 24/7 multilingüe — Coordinación inmediata vía WhatsApp.',
      en: '24/7 Operations Desk — Instant WhatsApp coordination and dispatch in English & Japanese.',
    }[lang],
    startBookingBtn: { ja: '今すぐ予約する', zh: '立即开始预订', fr: 'Commencer la Réservation', es: 'Comenzar Reserva', en: 'Start Booking Now' }[lang],
    guaranteesBtn: { ja: '運行保証・サービス規約', zh: '服务保障与规范', fr: 'Nos Engagements', es: 'Nuestras Garantías', en: 'Our Guarantees' }[lang],
    serviceLabel: { ja: 'サービス種別', zh: '服务类型', fr: 'Service', es: 'Servicio', en: 'Service' }[lang],
    optAirport: { ja: '空港送迎 (羽田・成田)', zh: '机场专属接送 (羽田/成田)', fr: 'Transferts Aéroports', es: 'Traslados Aeropuerto', en: 'Airport Transfers' }[lang],
    optSightseeing: { ja: '観光チャーター (富士山・都内)', zh: '观光包车一日游 (富士山/都内)', fr: 'Excursions d\'une Journée', es: 'Tours de un Día', en: 'Day Charters' }[lang],
    optSki: { ja: '4WD スキー直行ハイヤー', zh: '4WD 雪季滑雪专车直达', fr: 'Transferts Ski 4x4', es: 'Traslados de Esquí 4x4', en: 'Ski Transfers' }[lang],
    routeDirection: { ja: '運行方向', zh: '接送方向', fr: 'Sens du Trajet', es: 'Dirección del Trayecto', en: 'Route Direction' }[lang],
    airportToHotel: { ja: '空港 ➔ ホテル（到着便・お迎え）', zh: '机场 ➔ 酒店（到达迎宾）', fr: 'Aéroport ➔ Hôtel (Arrivée)', es: 'Aeropuerto ➔ Hotel (Llegada)', en: 'Airport ➔ Hotel (Arrival)' }[lang],
    hotelToAirport: { ja: 'ホテル ➔ 空港（出発便・お送り）', zh: '酒店 ➔ 机场（出发送机）', fr: 'Hôtel ➔ Aéroport (Départ)', es: 'Hotel ➔ Airport (Salida)', en: 'Hotel ➔ Airport (Departure)' }[lang],
    airportLabel: { ja: '対象空港', zh: '接送机场', fr: 'Aéroport', es: 'Aeropuerto', en: 'Airport' }[lang],
    arrivalDate: { ja: '到着日', zh: '到达日期', fr: 'Date d\'arrivée', es: 'Fecha de llegada', en: 'Arrival Date' }[lang],
    pickupDate: { ja: 'お迎え日', zh: '接送日期', fr: 'Date de prise en charge', es: 'Fecha de recogida', en: 'Pickup Date' }[lang],
    checkAvailability: { ja: '空車確認・料金計算', zh: '查询空车与即时报价', fr: 'Vérifier la Disponibilité', es: 'Consultar Disponibilidad', en: 'Check Availability' }[lang],
    destinationLabel: { ja: '観光目的地', zh: '目的地选择', fr: 'Destination', es: 'Destino', en: 'Destination' }[lang],
    pickupAreaLabel: { ja: '出発地', zh: '出发地点', fr: 'Lieu de Départ', es: 'Lugar de Salida', en: 'Pickup Area' }[lang],
    tokyoHotel: { ja: '都内ホテル・ご自宅玄関', zh: '东京都内酒店・上门接送', fr: 'Hôtel à Tokyo Porte-à-Porte', es: 'Hotel en Tokio Puerta a Puerta', en: 'Tokyo Hotel Door-to-Door' }[lang],
    skiResortLabel: { ja: 'スキー場', zh: '滑雪胜地', fr: 'Station de Ski', es: 'Estación de Esquí', en: 'Ski Resort' }[lang],
    departurePointLabel: { ja: '出発地点', zh: '出发地点', fr: 'Point de Départ', es: 'Punto de Salida', en: 'Departure Point' }[lang],
    travelDateLabel: { ja: 'ご利用日', zh: '出行日期', fr: 'Date du Voyage', es: 'Fecha del Viaje', en: 'Travel Date' }[lang],
    paxLabel: { ja: 'ご乗車人数', zh: '乘车人数', fr: 'Passagers (Pax)', es: 'Pasajeros (Pax)', en: 'Guests (Pax)' }[lang],
    checkPriceBtn: { ja: '料金を確認・空車照会', zh: '查询定额车费与空车', fr: 'Calculer le Prix', es: 'Consultar Precio', en: 'Check Price & Availability' }[lang],
    
    trust1Title: { ja: '国土交通省 緑ナンバー', zh: '100% 正规商业绿牌', fr: 'Plaque Verte MLIT', es: 'Placa Verde MLIT', en: 'MLIT Green Plate' }[lang],
    trust1Desc: { ja: '日本の法令に準拠した安心の営業用認可車両', zh: '合规营运资质，全额配备商业乘客险', fr: 'Transport commercial japonais légal et assuré', es: 'Transporte comercial japonés 100% legal y asegurado', en: 'Fully insured commercial legal Japanese transport' }[lang],
    trust2Title: { ja: '遅延料金¥0・完全無料待機', zh: '延误0加价・免费灵活守候', fr: 'Attente 100% Flexible & Gratuite', es: 'Espera 100% Flexible y Gratis', en: '100% Free Flexible Wait' }[lang],
    trust2Desc: { ja: '遅延時も追加料金なし。税関・荷物受取も安心。', zh: '无论延误多久不加收一分钱，通关取行李从容无忧。', fr: 'Zéro centime pour les retards. Douane & bagages sans stress.', es: 'Ni un céntimo por retrasos. Aduanas y equipaje sin estrés.', en: 'We won’t charge a penny for flight delays. Clearance with zero stress.' }[lang],
    trust3Title: { ja: '追加料金ゼロ (¥0)', zh: '¥0 任何高峰溢价', fr: '0 ¥ Frais Cachés', es: '0 ¥ Cargos Ocultos', en: '¥0 Surge Pricing' }[lang],
    trust3Desc: { ja: '高速代・深夜料金も予約時に全額確定', zh: '高速路桥费及油费于下单时全部锁定', fr: 'Tous les péages & carburant fixés à la réservation', es: 'Peajes y combustible cerrados en la reserva', en: 'All highway tolls & fuel locked at reservation' }[lang],
    trust4Title: { ja: '24時間 多言語サポート', zh: '24/7 多语种专属客服', fr: 'Support Bilingue 24/7', es: 'Atención 24/7 Multilingüe', en: '24/7 Bilingual Support' }[lang],
    trust4Desc: { ja: 'WhatsApp & お電話で迅速に対応', zh: '微信 / WhatsApp 与电话即时跟踪调度', fr: 'Desk de suivi WhatsApp & assistance vol', es: 'Seguimiento de vuelos por WhatsApp y teléfono', en: 'WhatsApp & phone flight tracking dispatch desk' }[lang],

    catalogTitle: { ja: 'おすすめ貸切チャーター＆空港送迎', zh: '精选私享专车与包车行程', fr: 'Circuits Privés & Transferts d\'Excellence', es: 'Excursiones Privadas y Traslados Selectos', en: 'Curated Private Charters & Airport Transfers' }[lang],
    catalogSubtitle: { ja: '国土交通省認可の営業用緑ナンバー車と専任プロドライバーによる安心運行', zh: '全系日本国土交通省官方绿牌商务车，配备资深合规专职司机', fr: 'Véhicules officiels agréés plaque verte MLIT avec chauffeurs professionnels', es: 'Vehículos oficiales placa verde MLIT con chóferes profesionales', en: 'MLIT-certified commercial green-plate vehicles with certified professional drivers' }[lang],
    allServices: { ja: 'すべてのプラン', zh: '全部服务', fr: 'Tous les Services', es: 'Todos los Servicios', en: 'All Services' }[lang],
    fromLabel: { ja: '料金', zh: '起', fr: 'Dès', es: 'Desde', en: 'From' }[lang],
    bookBtn: { ja: '予約する', zh: '立即预订', fr: 'Réserver', es: 'Reservar', en: 'Book' }[lang],

    fleetSectionTag: { ja: '運行車両基準', zh: '专属车队规格', fr: 'Standards de la Flotte', es: 'Estándares de la Flota', en: 'Executive Fleet Standards' }[lang],
    fleetSectionTitle: { ja: '最高峰の快適性を誇る保有フリート', zh: '高端豪华行政商务车队', fr: 'Véhicules Exécutifs de Grand Confort', es: 'Vehículos Ejecutivos de Gran Confort', en: 'Luxury Executive Vehicles' }[lang],
    fleetSectionDesc: { ja: '全車禁煙・毎日徹底除菌。極上の静粛性と広々とした車内空間。万全の搭乗者傷害保険を完備。', zh: '每日全车深度消毒杀菌、严格全车禁烟。头等舱静谧座舱体验，全额配备高额乘客商业意外险。', fr: 'Désinfectés quotidiennement, non-fumeurs. Confort de première classe, insonorisation parfaite et couverture d\'assurance passager intégrale.', es: 'Desinfectados diariamente, no fumadores. Confort de primera clase, máxima insonorización y cobertura de seguro de pasajeros integral.', en: 'Daily sanitized, non-smoking, flagship comfort, whisper-quiet cabins, and full commercial passenger insurance coverage.' }[lang],
    exteriorLabel: { ja: '外観', zh: '外观', fr: 'Extérieur', es: 'Exterior', en: 'Exterior' }[lang],
    interiorLabel: { ja: 'VIPシート内装', zh: 'VIP真皮内饰', fr: 'Intérieur VIP', es: 'Interior VIP', en: 'Interior Lounge' }[lang],
    trunkLabel: { ja: '荷物・トランク', zh: '行李后备箱', fr: 'Bagages', es: 'Equipaje', en: 'Luggage Bay' }[lang],
    bookThisVehicle: { ja: 'この車両で予約する', zh: '指定此车型预订', fr: 'Réserver ce Véhicule', es: 'Reservar este Vehículo', en: 'Book This Vehicle' }[lang],

    faqTag: { ja: 'よくあるご質問', zh: '常见问题解答', fr: 'Réponses Transparentes', es: 'Respuestas Claras', en: 'Transparent Answers' }[lang],
    faqHead: { ja: 'ご予約・運行に関するFAQ', zh: '常见问题解答 (FAQ)', fr: 'Foire Aux Questions', es: 'Preguntas Frecuentes', en: 'Frequently Asked Questions' }[lang],

    b2bTag: { ja: '旅行会社様・海外DMC様向け専用デスク', zh: '面向海外旅行社、定制游机构及全球DMC', fr: 'POUR AGENCES DE VOYAGES, TOUR-OPÉRATEURS & DMC', es: 'PARA AGENCIAS DE VIAJES, OPERADORES Y DMC', en: 'FOR TRAVEL AGENTS, TOUR OPERATORS & OVERSEAS DMCs' }[lang],
    b2bHead: { ja: '日本国内の地上手配はSK LIMOにお任せください', zh: '将日本地接交给我们 — 我们全权统筹全程地面接待', fr: 'Confiez-nous l\'Étape Japon — Nous Gérons Tout le Programme Terrestre', es: 'Déjenos el Tramo en Japón — Gestionamos Todo el Programa Terrestre', en: 'Hand Us the Japan Leg — We Arrange the Entire Ground Programme' }[lang],
    b2bDesc: { ja: '専任車両、新幹線手配、入場チケット、通訳ガイドまで正規旅行サービス手配業として一括手配いたします。', zh: '提供车队净价合约、新干线车票、景点快速预约门票及持证双语向导。具备日本合法旅行服务手配业牌照。', fr: 'Tarifs nets garantis sur les véhicules, billets Shinkansen, entrées coupe-file et guides agréés. Enregistré au Japon en tant qu\'agence réceptive officielle.', es: 'Tarifas netas garantizadas en vehículos, billetes Shinkansen, entradas y guías autorizados. Registrado en Japón como operador receptivo oficial.', en: 'Guaranteed itemized net rates on vehicles, Shinkansen rail seats, timed-entry tickets, and licensed guides. Registered in Japan as a Travel Service Arrangement Business.' }[lang],
    b2bBtn: { ja: 'B2B専用窓口にお問い合わせ', zh: '联系B2B地接合作专员', fr: 'Contacter le Desk B2B', es: 'Contactar con el Área B2B', en: 'Connect with B2B Desk' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080B11] text-[#1D1A16] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* Global Header */}
      <SiteHeader activePage="home" currentLang={lang} onLanguageChange={setLang} />

      {/* ═════════════════════════════════════════════════════════════════
          1. CINEMATIC HERO SECTION (Vercel App Warm Luxury Aesthetic)
          ═════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-20">
        
        {/* Background Photorealistic Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing.jpg"
            alt="SK Limo Executive Chauffeur and Black Toyota Alphard in Japan"
            fill
            priority
            className="object-cover object-center brightness-[0.82] dark:brightness-[0.45]"
          />
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
                {t.heroRibbon}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15]">
              <span className="block font-serif italic text-slate-200">{t.heroSubhead}</span>
              <span className="block font-extrabold bg-gradient-to-r from-[#F3E7C4] via-[#C5A059] to-[#E5C378] bg-clip-text text-transparent pt-1">
                {t.heroMainhead}
              </span>
            </h1>

            {/* Value Checklist */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200/95 max-w-xl font-medium pt-2">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check1}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check2}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check3}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check4}</span>
              </li>
            </ul>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setActiveBookingModule('airport');
                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all cursor-pointer"
              >
                <span>{t.startBookingBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                <span>{t.guaranteesBtn}</span>
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ═════════════════════════════════════════════════════════════════
          2. FLOATING QUICK QUOTE & BOOKING WIDGET (Luxury Gold Coordination)
          ═════════════════════════════════════════════════════════════════ */}
      <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-12">
        <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
          
          {/* 3 Categories Pills */}
          <div className="w-full overflow-x-auto no-scrollbar border-b border-[#F0EBE1] dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 min-w-max">
              <button
                type="button"
                onClick={() => setSearchTab('airport')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  searchTab === 'airport'
                    ? 'bg-[#1D1A16] text-[#E5C378] dark:bg-[#C5A059] dark:text-[#0A0D14] shadow-sm'
                    : 'text-[#6B6458] dark:text-slate-300 hover:bg-[#FAF8F4] dark:hover:bg-slate-800'
                }`}
              >
                <Plane className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>{t.optAirport}</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchTab('sightseeing')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  searchTab === 'sightseeing'
                    ? 'bg-[#1D1A16] text-[#E5C378] dark:bg-[#C5A059] dark:text-[#0A0D14] shadow-sm'
                    : 'text-[#6B6458] dark:text-slate-300 hover:bg-[#FAF8F4] dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>{t.optSightseeing}</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchTab('ski')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  searchTab === 'ski'
                    ? 'bg-[#1D1A16] text-[#E5C378] dark:bg-[#C5A059] dark:text-[#0A0D14] shadow-sm'
                    : 'text-[#6B6458] dark:text-slate-300 hover:bg-[#FAF8F4] dark:hover:bg-slate-800'
                }`}
              >
                <Snowflake className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>{t.optSki}</span>
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <form onSubmit={handleQuickSearch} className="space-y-3">
            
            {/* Airport Transfer Form */}
            {searchTab === 'airport' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.routeDirection}
                  </label>
                  <select
                    value={transferDirection}
                    onChange={(e) => setTransferDirection(e.target.value as TransferDirection)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="airport_to_hotel">{t.airportToHotel}</option>
                    <option value="hotel_to_airport">{t.hotelToAirport}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.airportLabel}
                  </label>
                  <select
                    value={pickupAirport}
                    onChange={(e) => setPickupAirport(e.target.value as Airport)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="HND">{lang === 'ja' ? '羽田空港 (HND)' : lang === 'zh' ? '羽田机场 (HND)' : 'Haneda Airport (HND)'}</option>
                    <option value="NRT">{lang === 'ja' ? '成田国際空港 (NRT)' : lang === 'zh' ? '成田国际机场 (NRT)' : 'Narita Airport (NRT)'}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {transferDirection === 'airport_to_hotel' ? t.arrivalDate : t.pickupDate}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer shrink-0"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.checkPriceBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Day Charter Form */}
            {searchTab === 'sightseeing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.destinationLabel}
                  </label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="fuji-kawaguchiko">{lang === 'ja' ? '富士山・河口湖・忍野八海 (10時間)' : lang === 'zh' ? '富士山・河口湖・忍野八海 (10小时)' : 'Mt. Fuji & Lake Kawaguchiko (10h)'}</option>
                    <option value="hakone-luxury">{lang === 'ja' ? '箱根 芦ノ湖・大涌谷・温泉 (9時間)' : lang === 'zh' ? '箱根 芦之湖・大涌谷・温泉 (9小时)' : 'Hakone Onsen & Lake Ashi (9h)'}</option>
                    <option value="kamakura-enoshima">{lang === 'ja' ? '鎌倉大仏・報国寺竹林・江の島 (8時間)' : lang === 'zh' ? '镰仓大佛・报国寺竹林・江之岛 (8小时)' : 'Kamakura Great Buddha & Enoshima (8h)'}</option>
                    <option value="nikko-unesco">{lang === 'ja' ? '日光東照宮・華厳の滝・中禅寺湖 (10時間)' : lang === 'zh' ? '日光东照宫・华严瀑布 (10小时)' : 'Nikko UNESCO World Heritage (10h)'}</option>
                    <option value="yokohama-bay">{lang === 'ja' ? '横浜みなとみらい・中華街 (8時間)' : lang === 'zh' ? '横滨未来港・中华街 (8小时)' : 'Yokohama Minato Mirai & Chinatown (8h)'}</option>
                    <option value="karuizawa-retreat">{lang === 'ja' ? '軽井沢 高原リゾート・旧軽井沢 (10時間)' : lang === 'zh' ? '轻井泽 避暑胜地高原奥莱 (10小时)' : 'Karuizawa Alpine Summer Resort (10h)'}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.pickupAreaLabel}
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="tokyo_hotel">{t.tokyoHotel}</option>
                    <option value="hnd">{lang === 'ja' ? '羽田空港 (HND)' : lang === 'zh' ? '羽田机场 (HND)' : 'Haneda Airport (HND)'}</option>
                    <option value="nrt">{lang === 'ja' ? '成田国際空港 (NRT)' : lang === 'zh' ? '成田国际机场 (NRT)' : 'Narita Airport (NRT)'}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.travelDateLabel}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer shrink-0"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.checkPriceBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Ski Transfer Form */}
            {searchTab === 'ski' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.skiResortLabel}
                  </label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="hakuba">{lang === 'ja' ? '白馬バレー（長野県）' : lang === 'zh' ? '长野白马滑雪区 (Hakuba)' : 'Hakuba Valley (Nagano)'}</option>
                    <option value="nozawa">{lang === 'ja' ? '野沢温泉スキー場（長野県）' : lang === 'zh' ? '长野野泽温泉 (Nozawa)' : 'Nozawa Onsen (Nagano)'}</option>
                    <option value="shigakogen">{lang === 'ja' ? '志賀高原スキー場（長野県）' : lang === 'zh' ? '长野志贺高原 (Shiga Kogen)' : 'Shiga Kogen (Nagano)'}</option>
                    <option value="yuzawa">{lang === 'ja' ? '越後湯沢・苗場スキー場（新潟県）' : lang === 'zh' ? '新潟越后汤泽・苗场 (Yuzawa)' : 'Yuzawa & Naeba (Niigata)'}</option>
                    <option value="myoko">{lang === 'ja' ? '妙高高原スキー場（新潟県）' : lang === 'zh' ? '新潟妙高高原 (Myoko Kogen)' : 'Myoko Kogen (Niigata)'}</option>
                    <option value="karuizawa">{lang === 'ja' ? '軽井沢プリンスホテルスキー場（長野県）' : lang === 'zh' ? '长野轻井泽王子滑雪场' : 'Karuizawa Prince (Nagano)'}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.departurePointLabel}
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="hnd">{lang === 'ja' ? '羽田空港 (HND)' : lang === 'zh' ? '羽田机场 (HND)' : 'Haneda Airport (HND)'}</option>
                    <option value="nrt">{lang === 'ja' ? '成田国際空港 (NRT)' : lang === 'zh' ? '成田国际机场 (NRT)' : 'Narita Airport (NRT)'}</option>
                    <option value="tokyo">{lang === 'ja' ? '東京都内ホテル・ご自宅玄関' : lang === 'zh' ? '东京都内酒店・上门接送' : 'Tokyo Downtown Hotel / Address'}</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5 truncate">
                    {t.travelDateLabel}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full h-11 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1D1A16] dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer shrink-0"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.checkPriceBtn}</span>
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          3. KEY TRUST METRICS
          ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">100%</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust1Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust1Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">90 Min</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust2Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust2Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">¥0</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust3Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust3Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">24/7</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust4Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust4Desc}</p>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          DYNAMIC RESULTS CONTAINER (Ref for smooth scrolling)
          ═════════════════════════════════════════════════════════════════ */}
      <div ref={resultsRef}>

        {/* CASE 1: When user selects Airport Transfers */}
        {activeBookingModule === 'airport' ? (
          <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] dark:border-slate-800">
            <AirportTransferModule
              initialAirport={pickupAirport}
              initialDate={travelDate}
              initialDirection={transferDirection}
              onBackToCatalog={() => setActiveBookingModule('none')}
            />
          </section>
        ) : activeBookingModule === 'sightseeing' ? (
          /* CASE 2: When user selects Day Tours & Sightseeing Charters */
          <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] dark:border-slate-800">
            <DayTourBookingModule
              initialDestination={selectedCharterDest}
              initialDate={travelDate}
              onBackToCatalog={() => setActiveBookingModule('none')}
            />
          </section>
        ) : activeBookingModule === 'ski' ? (
          /* CASE 3: When user selects 4WD Ski Direct Transfers */
          <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8] dark:border-slate-800">
            <SkiTransferBookingModule
              initialResort={selectedSkiResort}
              initialPickup={pickupLocation}
              initialDate={travelDate}
              onBackToCatalog={() => setActiveBookingModule('none')}
            />
          </section>
        ) : (
          /* CASE 4: Default Curated Private Charters & Fleet Showcase */
          <>
            {/* Curated Charters Catalog */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category Pills & Titles */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
                    {t.heroRibbon}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
                    {t.catalogTitle}
                  </h2>
                  <p className="text-xs text-[#6B6458] dark:text-slate-400">
                    {t.catalogSubtitle}
                  </p>
                </div>

                {/* Category Pills */}
                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 p-1.5 rounded-xl min-w-max">
                    {(['all', 'airport', 'sightseeing', 'ski'] as ServiceCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeCategory === cat
                            ? 'bg-[#1D1A16] text-[#E5C378] dark:bg-[#C5A059] dark:text-[#0A0D14] shadow-sm font-bold'
                            : 'text-[#6B6458] dark:text-slate-400 hover:text-[#1D1A16] dark:hover:text-white'
                        }`}
                      >
                        {cat === 'all'
                          ? t.allServices
                          : cat === 'airport'
                          ? t.optAirport
                          : cat === 'sightseeing'
                          ? t.optSightseeing
                          : t.optSki}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Tour Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#E5C378] text-[10px] font-bold px-2.5 py-1 rounded border border-[#C5A059]/40">
                          {tour.badge}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                          {t.fromLabel} {tour.priceFormatted}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#8C6D3F] dark:text-[#C5A059] text-[10px] uppercase tracking-wider">
                            {tour.categoryBadge}
                          </span>
                          <span className="text-[#6B6458] dark:text-slate-400 text-[11px] flex items-center gap-1 font-semibold">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {tour.rating} ({tour.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-[#1D1A16] dark:text-white leading-snug">
                          {tour.title}
                        </h3>

                        <ul className="space-y-1.5 text-xs text-[#6B6458] dark:text-slate-300">
                          {tour.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#8C6D3F] dark:text-[#E5C378] font-bold text-[10px] shrink-0">
                                ✓
                              </span>
                              <span className="line-clamp-1">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="p-5 pt-0 border-t border-[#F0EBE1] dark:border-slate-800/80 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8C6D3F] dark:text-[#C5A059] block font-bold uppercase">{t.fromLabel}</span>
                        <span className="font-extrabold text-lg text-[#1D1A16] dark:text-white font-mono">
                          {tour.priceFormatted}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (tour.category === 'airport') {
                            setActiveBookingModule('airport');
                          } else if (tour.category === 'ski') {
                            setSelectedSkiResort('hakuba');
                            setActiveBookingModule('ski');
                          } else {
                            const destMap: Record<string, string> = {
                              'fuji-tour': 'fuji-kawaguchiko',
                              'fuji-kawaguchiko': 'fuji-kawaguchiko',
                              'hakone-tour': 'hakone-luxury',
                              'hakone-lake-ashi': 'hakone-luxury',
                              'kamakura-tour': 'kamakura-enoshima',
                              'kamakura-enoshima': 'kamakura-enoshima',
                              'nikko-unesco': 'nikko-unesco',
                              'yokohama-bay': 'yokohama-bay',
                              'karuizawa-retreat': 'karuizawa-retreat',
                            };
                            setSelectedCharterDest(destMap[tour.id] || tour.id || 'fuji-kawaguchiko');
                            setActiveBookingModule('sightseeing');
                          }
                          setTimeout(() => {
                            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shrink-0 uppercase tracking-wider"
                      >
                        <span>{t.bookBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* ═════════════════════════════════════════════════════════════════
                4. FLEET SHOWCASE
                ═════════════════════════════════════════════════════════════════ */}
            <section id="fleet" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
                
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
                    {t.fleetSectionTag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
                    {t.fleetSectionTitle}
                  </h2>
                  <p className="text-xs text-[#6B6458] dark:text-slate-400">
                    {t.fleetSectionDesc}
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
                          : 'bg-[#FAF8F4] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E8E2D8]'
                      }`}
                    >
                      <span>
                        {key === 'hiace'
                          ? (lang === 'ja' ? 'ハイエース グランドキャビン (1-9名)' : lang === 'zh' ? '丰田海狮 Grand Cabin (1-9人)' : 'HiAce Grand Cabin (1-9 Pax)')
                          : key === 'alphard'
                          ? (lang === 'ja' ? 'トヨタ アルファード (1-4名)' : lang === 'zh' ? '丰田埃尔法 Alphard (1-4人)' : 'Toyota Alphard (1-4 Pax)')
                          : (lang === 'ja' ? 'トヨタ グランエース 4WD (1-5名)' : lang === 'zh' ? '丰田格兰斯 Granace 4WD (1-5人)' : 'Toyota Granace (1-5 Pax)')}
                      </span>
                      <span className="bg-[#C5A059]/20 text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded border border-[#C5A059]/40">
                        {fleetData[key].goldBadge}
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
                        priority
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
                        {t.exteriorLabel}
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
                        {t.interiorLabel}
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
                        {t.trunkLabel}
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
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTab('airport');
                          setActiveBookingModule('airport');
                          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <span>{t.bookThisVehicle}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════
                5. ROUTE DISTANCE VISUALIZER
                ═════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <RouteDistanceVisualizer />
            </section>

            {/* ═════════════════════════════════════════════════════════════════
                6. FREQUENTLY ASKED QUESTIONS (FAQ)
                ═════════════════════════════════════════════════════════════════ */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
                  {t.faqTag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
                  {t.faqHead}
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const qText = (faq.q as any)[lang] || faq.q.en;
                  const aText = (faq.a as any)[lang] || faq.a.en;
                  return (
                    <div
                      key={`${idx}-${lang}`}
                      className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1D1A16] dark:text-white cursor-pointer"
                      >
                        <span className="transition-opacity duration-300">{qText}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0 text-xs text-[#6B6458] dark:text-slate-300 leading-relaxed border-t border-[#F0EBE1] dark:border-slate-800/80 mt-1">
                          <p className="pt-3 transition-opacity duration-300">{aText}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════
                7. B2B TRAVEL AGENT / DMC BANNER
                ═════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="bg-[#080B11] border border-slate-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="space-y-3 max-w-2xl relative z-10">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#E5C378]">
                    {t.b2bTag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {t.b2bHead}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.b2bDesc}
                  </p>
                </div>

                <div className="relative z-10 shrink-0">
                  <Link
                    href="/contact"
                    className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all"
                  >
                    <span>{t.b2bBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}

      </div>

      <SiteFooter />

      {/* Stripe Payment Modal */}
      {selectedTourForCheckout && (
        <StripePaymentModal
          isOpen={isStripeModalOpen}
          onClose={() => setIsStripeModalOpen(false)}
          bookingDetails={selectedTourForCheckout}
          onSuccess={(ref, piId) => {
            setIsStripeModalOpen(false);
            setConfirmedBookingRef(ref);
            setConfirmedPaymentIntentId(piId);
            setIsSuccessModalOpen(true);
          }}
        />
      )}

      {/* Confirmation Voucher Modal */}
      {selectedTourForCheckout && (
        <BookingConfirmationModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingRef={confirmedBookingRef}
          paymentIntentId={confirmedPaymentIntentId}
          bookingDetails={selectedTourForCheckout}
        />
      )}
    </div>
  );
}
