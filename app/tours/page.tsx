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
  ArrowLeftRight,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import AirportTransferModule, { TransferDirection } from '@/components/AirportTransferModule';
import { useLanguage } from '@/context/LanguageContext';
import { Airport } from '@/lib/airport-pricing';

type ServiceCategory = 'all' | 'airport' | 'sightseeing' | 'ski';

export default function GrandToursHomePage() {
  const router = useRouter();
  const [lang] = useLanguage();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search & Filter State
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [searchTab, setSearchTab] = useState<'airport' | 'sightseeing' | 'ski'>('airport');
  
  // Airport Transfer Direction: Airport to Hotel vs Hotel to Airport
  const [transferDirection, setTransferDirection] = useState<TransferDirection>('airport_to_hotel');
  const [pickupAirport, setPickupAirport] = useState<Airport>('HND');
  const [hotelDestination, setHotelDestination] = useState<string>('Grand Hyatt Tokyo (Roppongi)');
  
  // Day charter & Ski state
  const [destinationLocation, setDestinationLocation] = useState<string>('fuji-kawaguchiko');
  const [pickupLocation, setPickupLocation] = useState<string>('hnd');

  const [passengers, setPassengers] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // State to replace catalog below with Airport Transfer Wizard
  const [showInlineTransferModule, setShowInlineTransferModule] = useState<boolean>(false);

  // Stripe Checkout Modal State
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');
  const [selectedTourForCheckout, setSelectedTourForCheckout] = useState<BookingPaymentDetails | null>(null);

  // Fleet Tab
  const [selectedFleet, setSelectedFleet] = useState<'alphard' | 'granace' | 'hiace' | 'crown'>('alphard');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === 'airport') {
      // Inline replacement of curated transfers with full airport transfer wizard
      setShowInlineTransferModule(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (searchTab === 'sightseeing') {
      setShowInlineTransferModule(false);
      router.push(`/destinations/${destinationLocation}`);
    } else if (searchTab === 'ski') {
      setShowInlineTransferModule(false);
      router.push(`/tours/winter?dest=${destinationLocation}&pickup=${pickupLocation}&date=${travelDate}`);
    }
  };

  // Multilingual Catalog Data
  const toursCatalog = [
    {
      id: 'airport-transfer',
      category: 'airport' as const,
      categoryType: 'airport_transfer' as const,
      categoryBadge: 'AIRPORT TRANSFER',
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
      duration: '45–75 mins',
      highlights: [
        { ja: '60分無料フライト遅延待機', zh: '60分钟免费航班延误等待', fr: '60 min d\'attente gratuite', es: '60 min espera cortesía', en: '60-Min Flight Delay Buffer' }[lang],
        { ja: '高速代・空港受入手数料込', zh: '包含高速费与机场接机费', fr: 'Péages & Accueil inclus', es: 'Peajes y bienvenida incl.', en: 'Highway Tolls & Meet & Greet Included' }[lang],
        { ja: 'ロビー名札出迎え', zh: '大堂举牌协助行李', fr: 'Accueil nominatif hall', es: 'Recepción con cartel', en: 'Lobby Name-Board Greeting' }[lang],
      ],
      priceFormatted: '¥24,000〜',
      priceNum: 24000,
      link: '/tours/airport-transfer',
      vehicleType: 'alphard' as const,
      vehicleName: 'Toyota Alphard Executive',
    },
    {
      id: 'fuji-kawaguchiko',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: 'DAY CHARTER',
      title: {
        ja: '富士山・河口湖・忍野八海・新倉山浅間公園 10時間貸切',
        zh: '富士山・河口湖・忍野八海・新仓山浅间公园 10小时一日游',
        fr: 'Mont Fuji, Lac Kawaguchiko & Pagode Chureito (10h)',
        es: 'Monte Fuji, Lago Kawaguchiko y Pagoda Chureito (10h)',
        en: 'Mount Fuji, Lake Kawaguchiko & Chureito Pagoda Day Charter',
      }[lang],
      image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
      badge: { ja: '👑 絶景・世界遺産', zh: '👑 经典必游', fr: '👑 Incontournable', es: '👑 Lo Más Reservado', en: '👑 Must-Visit' }[lang],
      rating: '4.98',
      reviewCount: 420,
      duration: '10 Hours',
      highlights: [
        { ja: '新倉山浅間公園（五重塔と富士山）', zh: '新仓山浅间公园经典五重塔同框', fr: 'Vue emblématique Pagode & Fuji', es: 'Pagoda Chureito y vistas al Fuji', en: 'Chureito Pagoda Iconic Fuji View' }[lang],
        { ja: '忍野八海 湧水池散策', zh: '忍野八海清澈涌泉古民家', fr: 'Sources pures Oshino Hakkai', es: 'Manantiales sagrados Oshino Hakkai', en: 'Oshino Hakkai Sacred Springs' }[lang],
        { ja: '大石公園 湖畔ラベンダー・コキア', zh: '大石公园湖畔花海四季美景', fr: 'Parc Oishi au bord du lac', es: 'Parque Oishi junto al lago', en: 'Lake Oishi Seasonal Flowers' }[lang],
      ],
      priceFormatted: '¥85,000〜',
      priceNum: 85000,
      link: '/destinations/fuji-kawaguchiko',
      vehicleType: 'granace' as const,
      vehicleName: 'Toyota Granace VIP 4WD',
    },
    {
      id: 'hakone-lake-ashi',
      category: 'sightseeing' as const,
      categoryType: 'destination' as const,
      categoryBadge: 'DAY CHARTER',
      title: {
        ja: '箱根 芦ノ湖・大涌谷・箱根神社・日帰り温泉 貸切ツアー',
        zh: '箱根 芦之湖・大涌谷・箱根神社水上鸟居・日归温泉 专属包车',
        fr: 'Hakone Onsen, Lac Ashi, Torii Flottant & Owakudani (10h)',
        es: 'Hakone Onsen, Lago Ashi, Torii Flotante y Owakudani (10h)',
        en: 'Hakone Onsen, Lake Ashi Pirate Cruise & Owakudani Volcano',
      }[lang],
      image: '/images/dest-hakone-lake-ashi-1376x768.jpg',
      badge: { ja: '♨️ 温泉と湖畔', zh: '♨️ 温泉体验', fr: '♨️ Onsen & Nature', es: '♨️ Onsen y Naturaleza', en: '♨️ Onsen & Scenery' }[lang],
      rating: '4.97',
      reviewCount: 360,
      duration: '10 Hours',
      highlights: [
        { ja: '大涌谷 火山ガスと黒たまご', zh: '大涌谷地热奇观与延寿黑玉子', fr: 'Volcan Owakudani & œufs noirs', es: 'Volcán Owakudani y huevos negros', en: 'Owakudani Active Volcanic Valley' }[lang],
        { ja: '箱根神社 平和の鳥居参拝', zh: '箱根神社湖中平和之鸟居打卡', fr: 'Torii rouge flottant sur le lac', es: 'Torii flotante del santuario', en: 'Hakone Shrine Floating Water Torii' }[lang],
        { ja: '名湯 箱根日帰り貸切温泉立ち寄り', zh: '可自由安排顶级日归温泉体验', fr: 'Arrêt source thermale privée', es: 'Parada en onsen tradicional', en: 'Optional Private Luxury Onsen Stop' }[lang],
      ],
      priceFormatted: '¥85,000〜',
      priceNum: 85000,
      link: '/destinations/hakone-lake-ashi',
      vehicleType: 'alphard' as const,
      vehicleName: 'Toyota Alphard Executive',
    },
    {
      id: 'winter-hakuba',
      category: 'ski' as const,
      categoryType: 'winter_transfer' as const,
      categoryBadge: 'SKI CHARTER',
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
      duration: 'Direct Door-to-Door',
      highlights: [
        { ja: '全車4WD・最新スタッドレスタイヤ', zh: '全系全时四驱及专业雪地轮胎', fr: 'Véhicules 4x4 pneus neige', es: 'Vehículos 4x4 neumáticos nieve', en: '4WD Vehicles & Bridgestone Snow Tires' }[lang],
        { ja: 'スキー板・大型荷物無料積載', zh: '滑雪板及大件行李全免费装载', fr: 'Transport housses ski gratuit', es: 'Transporte de esquís gratuito', en: 'Ski Bags & Oversized Luggage Free' }[lang],
        { ja: 'ホテル・シャレー玄関前直行', zh: '酒店木屋前门直达无换乘', fr: 'Porte-à-porte jusqu\'au chalet', es: 'Puerta a puerta hasta el chalet', en: 'Direct Door-to-Chalet / Hotel Service' }[lang],
      ],
      priceFormatted: '¥120,000〜',
      priceNum: 120000,
      link: '/tours/winter',
      vehicleType: 'granace' as const,
      vehicleName: 'Toyota Granace 4WD VIP',
    },
  ];

  const filteredTours = activeCategory === 'all'
    ? toursCatalog
    : toursCatalog.filter((t) => t.category === activeCategory);

  const fleetData = {
    alphard: {
      name: 'Toyota Alphard Executive Lounge',
      badge: 'First-Class VIP MPV',
      capacity: '1–4 Guests',
      luggage: '3–4 Large Suitcases',
      exteriorImage: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      desc: {
        ja: 'オットマン付き電動リクライニングシート、温熱・ベンチレーション、最高峰の静粛性を誇るプライベート空間。1〜4名様に最適。',
        zh: '配备电动航空头等舱座椅、腿托调节、座椅通风加热及顶级静音舱室，尊享极速舒适。适合1-4位贵宾。',
        fr: 'Sièges capitaine Ottoman tout électriques, ventilation/chauffage et insonorisation de première classe. Idéal pour 1 à 4 personnes.',
        es: 'Asientos ejecutivos eléctricos con reposapiés, cuero premium y máximo confort acústico. Ideal para 1 a 4 personas.',
        en: 'Power-reclining Ottoman captain seats with heated/ventilated premium leather and ultra-quiet cabin. Perfect for 1 to 4 VIPs.',
      }[lang],
    },
    granace: {
      name: 'Toyota Granace 4WD VIP Lounge',
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
    hiace: {
      name: 'Toyota HiAce Grand Cabin VIP',
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
    crown: {
      name: 'Toyota Crown Majesta VIP Sedan',
      badge: 'Flagship Executive Sedan',
      capacity: '1–3 Guests',
      luggage: '2–3 Medium Suitcases',
      exteriorImage: '/images/fleet-toyota-crown-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-crown-trunk-1477x1108.jpg',
      desc: {
        ja: '伝統と品格を誇るトヨタ最高峰VIPセダン。ビジネス送迎、政府要人、少人数での極上プライベートツアーに最適。',
        zh: '丰田顶级旗舰行政轿车，静谧平稳，至臻尊贵。专为高端商务接待及1-3位贵宾专属定制。',
        fr: 'Berline de prestige japonaise par excellence. Silence absolu et confort d\'exception pour 1 à 3 personnes.',
        es: 'Sedán ejecutivo de máxima categoría. Confort supremo y discreción para traslados VIP y reuniones de negocios.',
        en: 'Toyota\'s flagship executive sedan offering whisper-quiet luxury ride. Ideal for VIP executives and couples.',
      }[lang],
    },
  };

  const [fleetPhotoView, setFleetPhotoView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');
  const currentFleetItem = fleetData[selectedFleet];
  const activeFleetPhoto =
    fleetPhotoView === 'interior'
      ? currentFleetItem.interiorImage
      : fleetPhotoView === 'trunk'
      ? currentFleetItem.trunkImage
      : currentFleetItem.exteriorImage;

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* Global Header */}
      <SiteHeader activePage="home" />

      {/* ══════════════════════════════════════════════════
          HERO & TRIP.COM STYLE QUICK BOOKING FILTER
          ══════════════════════════════════════════════════ */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Title Area */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MLIT Licensed Green-Plate Luxury Chauffeur</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight">
              Japan Private Chauffeur &amp; Airport Transfers
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-2xl mx-auto">
              All-inclusive fixed prices. Door-to-door luxury transfers for Tokyo Airports, Mount Fuji, Hakone, and Ski Resorts.
            </p>
          </div>

          {/* Trip.com 3-Tab Booking Widget */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
            
            {/* 3 Tabs (Horizontal Slidable Carousel on Mobile) */}
            <div className="w-full overflow-x-auto no-scrollbar border-b border-[#F0F2F5] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  type="button"
                  onClick={() => setSearchTab('airport')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    searchTab === 'airport'
                      ? 'bg-[#0068FF] text-white shadow-sm'
                      : 'text-[#4B5563] dark:text-slate-300 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                  }`}
                >
                  <Plane className="w-4 h-4 shrink-0" />
                  <span>Airport Transfers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab('sightseeing')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    searchTab === 'sightseeing'
                      ? 'bg-[#0068FF] text-white shadow-sm'
                      : 'text-[#4B5563] dark:text-slate-300 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Day Charters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchTab('ski')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    searchTab === 'ski'
                      ? 'bg-[#0068FF] text-white shadow-sm'
                      : 'text-[#4B5563] dark:text-slate-300 hover:bg-[#F5F7FA] dark:hover:bg-slate-800'
                  }`}
                >
                  <Snowflake className="w-4 h-4 shrink-0" />
                  <span>Ski Transfers</span>
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleQuickSearch} className="space-y-3">
              
              {/* Airport Transfer Options */}
              {searchTab === 'airport' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Route Direction Selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">
                      Route Direction
                    </label>
                    <select
                      value={transferDirection}
                      onChange={(e) => setTransferDirection(e.target.value as TransferDirection)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="airport_to_hotel">Airport ➔ Hotel (Arrival)</option>
                      <option value="hotel_to_airport">Hotel ➔ Airport (Departure)</option>
                    </select>
                  </div>

                  {/* Airport Selection */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">
                      Airport
                    </label>
                    <select
                      value={pickupAirport}
                      onChange={(e) => setPickupAirport(e.target.value as Airport)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="HND">Haneda Airport (HND)</option>
                      <option value="NRT">Narita Airport (NRT)</option>
                    </select>
                  </div>

                  {/* Travel Date */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">
                      {transferDirection === 'airport_to_hotel' ? 'Arrival Date' : 'Pickup Date'}
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>

                  {/* Check Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Check Availability</span>
                    </button>
                  </div>

                </div>
              )}

              {/* Day Charter Options */}
              {searchTab === 'sightseeing' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Destination</label>
                    <select
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="fuji-kawaguchiko">Mt. Fuji &amp; Lake Kawaguchiko (10h)</option>
                      <option value="hakone-lake-ashi">Hakone Onsen &amp; Lake Ashi (10h)</option>
                      <option value="nikko-unesco">Nikko UNESCO World Heritage (10h)</option>
                      <option value="kamakura-enoshima">Kamakura Great Buddha &amp; Enoshima (10h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Pickup Area</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="tokyo_hotel">Tokyo Hotel Door-to-Door</option>
                      <option value="hnd">Haneda Airport</option>
                      <option value="nrt">Narita Airport</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Check Availability</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Ski Options */}
              {searchTab === 'ski' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Ski Resort</label>
                    <select
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="hakuba">Hakuba Valley (Nagano)</option>
                      <option value="nozawa">Nozawa Onsen (Nagano)</option>
                      <option value="shigakogen">Shiga Kogen (Nagano)</option>
                      <option value="myoko">Myoko Kogen (Niigata)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Origin</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    >
                      <option value="hnd">Haneda Airport (HND)</option>
                      <option value="nrt">Narita Airport (NRT)</option>
                      <option value="tokyo">Tokyo Downtown</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400 block mb-1">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Check Availability</span>
                    </button>
                  </div>
                </div>
              )}

            </form>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DYNAMIC RESULTS CONTAINER (Ref for smooth scrolling)
          ══════════════════════════════════════════════════ */}
      <div ref={resultsRef}>

        {/* CASE 1: When user presses "Check Availability" on Airport Transfers */}
        {showInlineTransferModule ? (
          <section className="py-6 border-b border-[#E5E8ED] dark:border-slate-800">
            <AirportTransferModule
              initialAirport={pickupAirport}
              initialDate={travelDate}
              initialDirection={transferDirection}
              onBackToCatalog={() => setShowInlineTransferModule(false)}
            />
          </section>
        ) : (
          /* CASE 2: Default Curated Private Charters & Fleet Showcase */
          <>
            {/* Curated Charters Catalog */}
            <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category Pills */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">
                    Curated Private Charters
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400">
                    MLIT-certified commercial green-plate vehicles with certified professional drivers
                  </p>
                </div>

                {/* Category Pills (Slidable on Mobile) */}
                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 p-1 rounded-xl min-w-max">
                    {(['all', 'airport', 'sightseeing', 'ski'] as ServiceCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeCategory === cat
                            ? 'bg-[#0068FF] text-white shadow-sm'
                            : 'text-[#6B7280] dark:text-slate-400 hover:text-[#1A1A1A] dark:hover:text-white'
                        }`}
                      >
                        {cat === 'all'
                          ? 'All Services'
                          : cat === 'airport'
                          ? 'Airport Transfers'
                          : cat === 'sightseeing'
                          ? 'Day Charters'
                          : 'Ski Transfers'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Tour Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-md text-[#1A1A1A] dark:text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {tour.badge}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#0068FF] text-[10px] uppercase">
                            {tour.categoryBadge}
                          </span>
                          <span className="text-[#6B7280] dark:text-slate-400 text-[11px] flex items-center gap-1 font-semibold">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {tour.rating} ({tour.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white leading-snug line-clamp-2">
                          {tour.title}
                        </h3>

                        <ul className="space-y-1 text-[11px] text-[#6B7280] dark:text-slate-400">
                          {tour.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-1.5 line-clamp-1">
                              <Check className="w-3 h-3 text-[#00B37E] shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="p-4 pt-0 border-t border-[#F0F2F5] dark:border-slate-800/80 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#9CA3AF] block">From</span>
                        <span className="font-extrabold text-base text-[#1A1A1A] dark:text-white font-mono">
                          {tour.priceFormatted}
                        </span>
                      </div>

                      <Link
                        href={tour.link}
                        className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap"
                      >
                        <span>Book</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* Fleet Showcase */}
            <section id="fleet" className="py-12 bg-white dark:bg-[#0E131F] border-t border-[#E5E8ED] dark:border-slate-800 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
                    Certified Commercial Fleet
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
                    Luxury Executive Vehicles
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400">
                    Flagship comfort, whisper-quiet cabins, and full commercial passenger insurance coverage.
                  </p>
                </div>

                {/* Vehicle Tabs (Horizontal Slidable Slider on Mobile, Centered on Desktop) */}
                <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-2 px-2 sm:mx-0 sm:px-0">
                  <div className="flex items-center gap-2 sm:justify-center min-w-max px-1">
                    {(['alphard', 'granace', 'hiace', 'crown'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedFleet(key);
                          setFleetPhotoView('exterior');
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedFleet === key
                            ? 'bg-[#0068FF] text-white shadow-sm'
                            : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED] dark:hover:bg-slate-700'
                        }`}
                      >
                        {key === 'alphard'
                          ? 'Toyota Alphard (1-4 Pax)'
                          : key === 'granace'
                          ? 'Toyota Granace 4WD (1-5 Pax)'
                          : key === 'hiace'
                          ? 'HiAce Grand Cabin (1-9 Pax)'
                          : 'Crown Majesta Sedan (1-3 Pax)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Details Card */}
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 rounded-2xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Vehicle Image & Gallery Switcher */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md border border-[#E5E8ED] dark:border-slate-700">
                      <Image
                        src={activeFleetPhoto}
                        alt={currentFleetItem.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-300"
                        priority
                      />
                    </div>

                    {/* View Switcher Chips (Exterior, Interior, Trunk) */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFleetPhotoView('exterior')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                          fleetPhotoView === 'exterior'
                            ? 'bg-[#0068FF] text-white border-[#0068FF]'
                            : 'bg-white dark:bg-slate-800 border-[#E5E8ED] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:border-[#CBD5E1]'
                        }`}
                      >
                        Exterior (外観)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFleetPhotoView('interior')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                          fleetPhotoView === 'interior'
                            ? 'bg-[#0068FF] text-white border-[#0068FF]'
                            : 'bg-white dark:bg-slate-800 border-[#E5E8ED] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:border-[#CBD5E1]'
                        }`}
                      >
                        Interior (内装)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFleetPhotoView('trunk')}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                          fleetPhotoView === 'trunk'
                            ? 'bg-[#0068FF] text-white border-[#0068FF]'
                            : 'bg-white dark:bg-slate-800 border-[#E5E8ED] dark:border-slate-700 text-[#4B5563] dark:text-slate-300 hover:border-[#CBD5E1]'
                        }`}
                      >
                        Luggage (トランク)
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="inline-block bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] dark:text-[#3B82F6] text-[10px] font-bold px-2.5 py-0.5 rounded">
                      {currentFleetItem.badge}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">
                      {currentFleetItem.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                      <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-2.5 py-1 rounded-lg">
                        <Users className="w-4 h-4 text-[#0068FF]" />
                        {currentFleetItem.capacity}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-2.5 py-1 rounded-lg">
                        <Luggage className="w-4 h-4 text-[#0068FF]" />
                        {currentFleetItem.luggage}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
                      {currentFleetItem.desc}
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTab('airport');
                          setShowInlineTransferModule(true);
                          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0050CC] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        <span>Book This Vehicle</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
