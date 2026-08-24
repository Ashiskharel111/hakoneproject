'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
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
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import { useLanguage } from '@/context/LanguageContext';

interface SkiResort {
  id: string;
  name: { ja: string; zh: string; fr: string; es: string; en: string };
  region: string;
  distanceHours: string;
  tag: { ja: string; zh: string; fr: string; es: string; en: string };
  desc: { ja: string; zh: string; fr: string; es: string; en: string };
  image: string;
  basePriceAlphard: number;
  basePriceGranace: number;
  basePriceHiace: number;
}

const SKI_RESORTS: SkiResort[] = [
  {
    id: 'hakuba',
    name: { ja: '白馬バレー (長野)', zh: '白马山谷 (长野)', fr: 'Hakuba Valley (Nagano)', es: 'Valle de Hakuba (Nagano)', en: 'Hakuba Valley (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '3.5–4.0 Hours',
    tag: { ja: '人気No.1 パウダースノー', zh: '人气No.1 顶级粉雪', fr: 'N°1 Poudreuse', es: 'N°1 Nieve Polvo', en: 'Top Choice Powder' },
    desc: {
      ja: '10のスキー場が集まる日本屈指のパウダースノーの聖地。北アルプスの壮大なパノラマと快適な木屋リゾート。',
      zh: '汇聚10大顶级雪场的日本粉雪殿堂，北阿尔卑斯绝美香槟雪质与高山木屋。',
      fr: '10 stations de classe mondiale et la légendaire poudreuse champagne des Alpes du Nord.',
      es: '10 estaciones de clase mundial y la legendaria nieve polvo de los Alpes del Norte.',
      en: '10 world-class ski resorts boasting legendary Northern Alps champagne powder and alpine chalets.',
    },
    image: '/images/winter-ski-nagano-resort-1500x1001.jpg',
    basePriceAlphard: 115000,
    basePriceGranace: 120000,
    basePriceHiace: 118000,
  },
  {
    id: 'nozawa',
    name: { ja: '野沢温泉 (長野)', zh: '野泽温泉 (长野)', fr: 'Nozawa Onsen (Nagano)', es: 'Nozawa Onsen (Nagano)', en: 'Nozawa Onsen (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '3.5–4.0 Hours',
    tag: { ja: '名湯と深雪の村', zh: '古汤与深雪', fr: 'Onsen & Neige', es: 'Onsen y Nieve', en: 'Historic Onsen & Snow' },
    desc: {
      ja: '13の外湯めぐりと本格的なビッグゲレンデが共存する伝統的な温泉スキーリゾート。',
      zh: '兼具13大传统古温泉与广阔高山滑雪场的梦幻雪乡，风情独具。',
      fr: 'Combinaison magique de 13 bains onsen traditionnels et d\'un immense domaine skiable.',
      es: 'Combinación mágica de 13 baños onsen tradicionales y un inmenso dominio esquiable.',
      en: 'Historic village combining 13 free public onsen hot springs with vast alpine powder terrain.',
    },
    image: '/images/ski-nozawa-hero-4032x3024.jpg',
    basePriceAlphard: 120000,
    basePriceGranace: 125000,
    basePriceHiace: 123000,
  },
  {
    id: 'shigakogen',
    name: { ja: '志賀高原 (長野)', zh: '志贺高原 (长野)', fr: 'Shiga Kogen (Nagano)', es: 'Shiga Kogen (Nagano)', en: 'Shiga Kogen (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '4.0–4.5 Hours',
    tag: { ja: '本州最大級メガリゾート', zh: '本州最大超级雪场', fr: 'Plus Grand Domaine', es: 'Mayor Dominio', en: 'Largest Ski Area in Honshu' },
    desc: {
      ja: '標高2,000m超の極上雪質。18のスキー場がリフトで連結された本州最大のスケール。',
      zh: '海拔2000米以上的极致超干粉雪，18座雪场一票通滑，全日本规模之最。',
      fr: 'La plus haute altitude et la meilleure neige sèche d\'Honshu avec 18 stations interconnectées.',
      es: 'La mayor altitud y la mejor nieve polvo seca de Honshu con 18 estaciones interconectadas.',
      en: 'Honshu\'s highest elevation and driest snow with 18 interconnected ski resorts on one pass.',
    },
    image: '/images/ski-shiga-kogen-hero-4032x3024.jpg',
    basePriceAlphard: 125000,
    basePriceGranace: 130000,
    basePriceHiace: 128000,
  },
  {
    id: 'myoko',
    name: { ja: '妙高高原 (新潟)', zh: '妙高高原 (新潟)', fr: 'Myoko Kogen (Niigata)', es: 'Myoko Kogen (Niigata)', en: 'Myoko Kogen (Niigata)' },
    region: 'Niigata Prefecture',
    distanceHours: '3.5–4.0 Hours',
    tag: { ja: '豪雪パウダー天国', zh: '豪雪深粉天堂', fr: 'Paradis Gros Cumuls', es: 'Paraíso de Nieve Profunda', en: 'Heavy Snowfall Paradise' },
    desc: {
      ja: '年間13mを超える圧倒的降雪量を誇る日本屈指のディープパウダーエリア。',
      zh: '年均降雪超过13米的日本顶级深雪区，树林野雪滑行者的天堂。',
      fr: 'Plus de 13 mètres de neige par saison. Le paradis des amateurs de freeride et de forêt.',
      es: 'Más de 13 metros de nieve por temporada. El paraíso del freeride entre bosques vírgenes.',
      en: 'Averaging over 13 meters of annual snowfall, famous for legendary tree runs and deep powder.',
    },
    image: '/images/ski-myoko-hero-4032x3024.jpg',
    basePriceAlphard: 125000,
    basePriceGranace: 130000,
    basePriceHiace: 128000,
  },
  {
    id: 'karuizawa',
    name: { ja: '軽井沢プリンス (長野)', zh: '轻井泽王子 (长野)', fr: 'Karuizawa Prince (Nagano)', es: 'Karuizawa Prince (Nagano)', en: 'Karuizawa Prince (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '2.0–2.5 Hours',
    tag: { ja: '東京から最短アクセス', zh: '东京最近高档度假', fr: 'Accès le Plus Rapide', es: 'Acceso Más Rápido', en: 'Closest to Tokyo' },
    desc: {
      ja: '都内から約2時間。晴天率が高く、ショッピングプラザ併設でファミリーにも大人気。',
      zh: '距东京仅2小时，晴天率高，紧邻超大奥特莱斯购物广场，合家欢首选。',
      fr: 'À seulement 2 heures de Tokyo avec un gigantesque centre commercial au pied des pistes.',
      es: 'A solo 2 horas de Tokio con un gran centro comercial al pie de las pistas.',
      en: 'Only 2 hours from Tokyo with great weather and massive shopping outlet plaza attached.',
    },
    image: '/images/ski-karuizawa-hero-4032x3024.jpg',
    basePriceAlphard: 75000,
    basePriceGranace: 80000,
    basePriceHiace: 78000,
  },
];

export default function WinterSkiToursPage() {
  const [lang] = useLanguage();

  // Calculator State
  const [selectedResortId, setSelectedResortId] = useState<string>('hakuba');
  const [pickupPoint, setPickupPoint] = useState<'hnd' | 'nrt' | 'tokyo'>('hnd');
  const [selectedVehicle, setSelectedVehicle] = useState<'alphard' | 'granace' | 'hiace'>('granace');
  const [passengers, setPassengers] = useState<number>(4);
  const [skiGearCount, setSkiGearCount] = useState<number>(4);
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [guestName, setGuestName] = useState<string>('Valued Guest');
  const [guestEmail, setGuestEmail] = useState<string>('client@example.com');
  const [hotelAddress, setHotelAddress] = useState<string>('Hakuba Chalet / Hotel');

  // Checkout Modals
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  const currentResort = SKI_RESORTS.find((r) => r.id === selectedResortId) || SKI_RESORTS[0];

  // Price Calculation
  const quote = useMemo(() => {
    const basePrice =
      selectedVehicle === 'alphard'
        ? currentResort.basePriceAlphard
        : selectedVehicle === 'granace'
        ? currentResort.basePriceGranace
        : currentResort.basePriceHiace;

    const airportSurcharge = pickupPoint === 'nrt' ? 12000 : pickupPoint === 'hnd' ? 5000 : 0;
    const finalTotalPrice = basePrice + airportSurcharge;

    return {
      basePrice,
      airportSurcharge,
      finalTotalPrice,
    };
  }, [currentResort, selectedVehicle, pickupPoint]);

  const pickupLabel =
    pickupPoint === 'nrt'
      ? 'Narita Airport (NRT)'
      : pickupPoint === 'hnd'
      ? 'Haneda Airport (HND)'
      : 'Tokyo Downtown Hotel';

  const vehicleName =
    selectedVehicle === 'alphard'
      ? 'Toyota Alphard Executive (1-4 Pax)'
      : selectedVehicle === 'granace'
      ? 'Toyota Granace 4WD VIP (1-5 Pax)'
      : 'Toyota HiAce Grand Cabin (1-9 Pax)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'winter_transfer',
    destinationId: currentResort.id,
    destinationTitle: `${pickupLabel} ⇄ ${currentResort.name.en} (4WD Ski Direct)`,
    vehicle: selectedVehicle,
    vehicleName,
    passengers,
    luggageCount: Math.max(passengers, 4),
    skiBagCount: skiGearCount,
    travelDate,
    guestName: guestName.trim() || 'Valued Guest',
    guestEmail: guestEmail.trim() || 'client@example.com',
    guestPhone: '+81 80 1234 5678',
    pickupAddress: hotelAddress || 'Tokyo Pick-up Address',
    amount: quote.finalTotalPrice,
    currency: 'jpy',
  };

  const whatsAppSkiUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am booking a 4WD Winter Ski Transfer: ${pickupLabel} ⇄ ${currentResort.name.en} for ${passengers} guests with ${skiGearCount} ski bags. Vehicle: ${vehicleName}. Quoted: ¥${quote.finalTotalPrice.toLocaleString()} JPY on ${travelDate}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="winter" />

      {/* Hero Header */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full">
            <Snowflake className="w-3.5 h-3.5" />
            <span>4WD Certified Ski Direct Transfers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight">
            Winter Ski Transfers
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-2xl mx-auto">
            Direct door-to-door 4WD luxury charters from Tokyo &amp; Airports to Hakuba, Nozawa Onsen, Shiga Kogen &amp; Myoko. All expressway tolls and ski luggage included.
          </p>
        </div>
      </section>

      {/* Main Fare Calculator & Catalog */}
      <section className="py-8 sm:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Select Resort */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 space-y-3 shadow-sm transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-300 flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-[#0068FF]" />
                <span>1. Select Ski Resort</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SKI_RESORTS.map((resort) => (
                  <button
                    key={resort.id}
                    type="button"
                    onClick={() => setSelectedResortId(resort.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedResortId === resort.id
                        ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <span className={`font-bold text-xs block ${selectedResortId === resort.id ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                      {resort.name[lang] || resort.name.en}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-slate-400 block mt-0.5">{resort.distanceHours} · {resort.tag[lang] || resort.tag.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pickup Location */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 space-y-3 shadow-sm transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0068FF]" />
                <span>2. Departure / Pickup Point</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hnd' as const, label: 'Haneda (HND)' },
                  { id: 'nrt' as const, label: 'Narita (NRT)' },
                  { id: 'tokyo' as const, label: 'Tokyo Downtown' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPickupPoint(item.id)}
                    className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                      pickupPoint === item.id
                        ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6]'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] text-[#4B5563] dark:text-slate-300 hover:border-[#D1D5DB]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Vehicle Class */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 space-y-3 shadow-sm transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#0068FF]" />
                <span>3. 4WD Vehicle Class</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'alphard' as const, name: 'Toyota Alphard', cap: '1-4 Pax', tag: 'Luxury MPV' },
                  { id: 'granace' as const, name: 'Granace 4WD VIP', cap: '1-5 Pax', tag: 'Flagship 4WD' },
                  { id: 'hiace' as const, name: 'HiAce Grand Cabin', cap: '1-9 Pax', tag: 'High Capacity' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedVehicle === v.id
                        ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <span className={`font-bold text-xs block ${selectedVehicle === v.id ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                      {v.name}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-slate-400 block">{v.cap} · {v.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Passengers & Ski Bags */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 space-y-3 shadow-sm transition-colors">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">Passengers:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="font-mono font-bold text-xs px-2 text-[#1A1A1A] dark:text-white">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">Ski Gear Bags:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSkiGearCount(Math.max(0, skiGearCount - 1))}
                      className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="font-mono font-bold text-xs px-2 text-[#1A1A1A] dark:text-white">{skiGearCount}</span>
                    <button
                      type="button"
                      onClick={() => setSkiGearCount(Math.min(9, skiGearCount + 1))}
                      className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-sm lg:sticky lg:top-24 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-slate-800">
                <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                  Ski Direct Quote
                </span>
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All-Inclusive Fixed
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{currentResort.name[lang] || currentResort.name.en}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departure:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{pickupLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{vehicleName}</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl p-3 space-y-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Bridgestone Blizzak winter studless tires</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Expressway highway tolls &amp; fuel included</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Door-to-door direct chalet drop-off</span>
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#6B7280] dark:text-slate-400 font-bold uppercase">Total Fare:</span>
                  <span className="text-2xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">
                    ¥{quote.finalTotalPrice.toLocaleString()} <span className="text-xs font-normal text-[#9CA3AF]">JPY</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsStripeModalOpen(true)}
                    className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Instant Stripe Checkout</span>
                  </button>

                  <a
                    href={whatsAppSkiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <SiteFooter />

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        bookingDetails={bookingDetails}
        onSuccess={(ref, piId) => {
          setIsStripeModalOpen(false);
          setConfirmedBookingRef(ref);
          setConfirmedPaymentIntentId(piId);
          setIsSuccessModalOpen(true);
        }}
      />

      {/* Confirmation Voucher Modal */}
      <BookingConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        bookingRef={confirmedBookingRef}
        paymentIntentId={confirmedPaymentIntentId}
        bookingDetails={bookingDetails}
      />
    </div>
  );
}
