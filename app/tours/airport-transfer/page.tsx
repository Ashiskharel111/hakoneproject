'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  Clock,
  MapPin,
  Calendar,
  Users,
  Luggage,
  ShieldCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Globe,
  Sparkles,
  Car,
  Wifi,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Building,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';

interface AirportRoute {
  id: string;
  name: string;
  nameJa: string;
  nameZh: string;
  nameFr: string;
  nameEs: string;
  airport: string;
  airportCode: string;
  duration: string;
  alphardPrice: number;
  granacePrice: number;
  hiacePrice: number;
  alphardPriceFormatted: string;
  granacePriceFormatted: string;
  hiacePriceFormatted: string;
  description: string;
  descriptionJa: string;
  descriptionZh: string;
  descriptionFr: string;
  descriptionEs: string;
}

const AIRPORT_ROUTES: AirportRoute[] = [
  {
    id: 'hnd_tokyo',
    name: 'Haneda Airport (HND) ⇄ Central Tokyo Hotels',
    nameJa: '羽田空港 (HND) ⇄ 東京都内ホテル・ご自宅',
    nameZh: '羽田机场 (HND) ⇄ 东京都内各酒店/住宅',
    nameFr: 'Aéroport Haneda (HND) ⇄ Hôtels de Tokyo',
    nameEs: 'Aeropuerto Haneda (HND) ⇄ Hoteles de Tokio',
    airport: 'Haneda Airport',
    airportCode: 'HND',
    duration: '35 - 50 mins',
    alphardPrice: 30000,
    granacePrice: 35000,
    hiacePrice: 38000,
    alphardPriceFormatted: '¥30,000',
    granacePriceFormatted: '¥35,000',
    hiacePriceFormatted: '¥38,000',
    description: 'Fast and seamless door-to-door luxury transfer between Haneda Airport (Terminals 1, 2, 3) and any hotel in Tokyo (Minato, Chiyoda, Shinjuku, Shibuya, Ginza).',
    descriptionJa: '羽田空港（第1・第2・第3ターミナル）と東京都内各ホテル（港区・千代田区・新宿・渋谷・銀座等）間のドアtoドア最上級ハイヤー送迎。',
    descriptionZh: '羽田机场（第1/2/3航站楼）与东京都内各星级酒店（港区、千代田区、新宿、涩谷、银座等）之间的专属VIP门到门接送。',
    descriptionFr: 'Transfert de luxe direct entre l\'aéroport de Haneda (terminaux 1, 2, 3) et tout hôtel de Tokyo (Ginza, Shinjuku, Shibuya, Minato).',
    descriptionEs: 'Traslado privado VIP directo entre el aeropuerto de Haneda (terminales 1, 2, 3) y su hotel en Tokio (Ginza, Shinjuku, Shibuya, Minato).',
  },
  {
    id: 'nrt_tokyo',
    name: 'Narita Airport (NRT) ⇄ Central Tokyo Hotels',
    nameJa: '成田空港 (NRT) ⇄ 東京都内ホテル・ご自宅',
    nameZh: '成田机场 (NRT) ⇄ 东京都内各酒店/住宅',
    nameFr: 'Aéroport Narita (NRT) ⇄ Hôtels de Tokyo',
    nameEs: 'Aeropuerto Narita (NRT) ⇄ Hoteles de Tokio',
    airport: 'Narita Airport',
    airportCode: 'NRT',
    duration: '60 - 80 mins',
    alphardPrice: 42000,
    granacePrice: 48000,
    hiacePrice: 52000,
    alphardPriceFormatted: '¥42,000',
    granacePriceFormatted: '¥48,000',
    hiacePriceFormatted: '¥52,000',
    description: 'Relax after your long-haul flight in our executive cabin with highway tolls, 60 minutes complimentary flight delay buffer, and lobby luggage service included.',
    descriptionJa: '長距離フライトの疲れを癒やす快適な車内空間。高速道路料金、60分無料待機時間、お荷物アシスタント込みの完全定額送迎。',
    descriptionZh: '长途飞行后尽享舒适座舱。包含高速公路费、60分钟免费航班延误等待及大堂行李搬运协助，尊享无忧出行。',
    descriptionFr: 'Détendez-vous après votre long vol dans notre cabine VIP. Péages d\'autoroute, 60 minutes d\'attente gratuite et assistance bagages inclus.',
    descriptionEs: 'Relájese tras su vuelo internacional en nuestra cabina ejecutiva. Peajes, 60 minutos de espera de cortesía y asistencia con equipaje incluidos.',
  },
];

import { useLanguage } from '@/context/LanguageContext';
import SiteFooter from '@/components/SiteFooter';

export default function AirportTransferPage() {
  const [lang, setLang] = useLanguage();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('hnd_tokyo');
  const [vehicle, setVehicle] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [passengers, setPassengers] = useState<number>(3);
  const [luggage, setLuggage] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [hotelAddress, setHotelAddress] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  
  // Checkout Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [addSecondVehicle, setAddSecondVehicle] = useState(false);

  const t = TRANSLATIONS[lang];
  const selectedRoute = AIRPORT_ROUTES.find((r) => r.id === selectedRouteId) || AIRPORT_ROUTES[0];

  const vehicleConfig = {
    alphard: {
      name: { ja: 'トヨタ アルファード', zh: '丰田埃尔法 Alphard', fr: 'Toyota Alphard Executive', es: 'Toyota Alphard Executive', en: 'Toyota Alphard Executive' }[lang],
      tagline: { ja: 'エグゼクティブラウンジ (最大4名)', zh: '头等舱独立航空座椅 (最多4位)', fr: 'VIP Ottoman Recliners (Max 4 Pers)', es: 'Asientos VIP Reclinables (Máx 4 Pax)', en: 'VIP Ottoman Recliners (Max 4 Pax)' }[lang],
      maxCap: 4,
      maxLuggage: 4,
      image: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      price: selectedRoute.alphardPrice,
      priceFormatted: selectedRoute.alphardPriceFormatted,
    },
    granace: {
      name: { ja: 'トヨタ グランエース', zh: '丰田 Granace 豪华商务旗舰', fr: 'Toyota Granace Premium', es: 'Toyota Granace Premium', en: 'Toyota Granace Premium' }[lang],
      tagline: { ja: 'プレミアムラウンジ (最大5名)', zh: '奢华6座大空间 (最多5位)', fr: 'Lounge 6 Places Ultra-Luxe (Max 5 Pers)', es: 'Lounge Ultra Lujo (Máx 5 Pax)', en: 'Ultra-Luxury 6-Seater Lounge (Max 5 Pax)' }[lang],
      maxCap: 5,
      maxLuggage: 4,
      image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      price: selectedRoute.granacePrice,
      priceFormatted: selectedRoute.granacePriceFormatted,
    },
    hiace: {
      name: { ja: 'トヨタ ハイエース', zh: '丰田 HiAce Grand Cabin', fr: 'Toyota HiAce Grand Cabin', es: 'Toyota HiAce Grand Cabin', en: 'Toyota HiAce Grand Cabin' }[lang],
      tagline: { ja: 'グランドキャビン (最大9名)', zh: '多人团队与大量行李 (最多9位)', fr: 'Idéal Grands Groupes (Max 9 Pers)', es: 'Ideal Grupos y Familias (Máx 9 Pax)', en: 'Spacious Group Transfer (Max 9 Pax)' }[lang],
      maxCap: 9,
      maxLuggage: 9,
      image: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      price: selectedRoute.hiacePrice,
      priceFormatted: selectedRoute.hiacePriceFormatted,
    },
  };

  const currentVehicle = vehicleConfig[vehicle];
  const isExceeded = passengers > currentVehicle.maxCap;
  const minPerPerson = Math.round(currentVehicle.price / currentVehicle.maxCap);
  const secondVehicleSurcharge = minPerPerson + 30000;
  const totalPrice = currentVehicle.price + (isExceeded && addSecondVehicle ? secondVehicleSurcharge : 0);
  const totalPriceFormatted = `¥${totalPrice.toLocaleString()}`;

  const getRouteTitle = (r: AirportRoute) => {
    if (lang === 'ja') return r.nameJa;
    if (lang === 'zh') return r.nameZh;
    if (lang === 'fr') return r.nameFr;
    if (lang === 'es') return r.nameEs;
    return r.name;
  };

  const getRouteDesc = (r: AirportRoute) => {
    if (lang === 'ja') return r.descriptionJa;
    if (lang === 'zh') return r.descriptionZh;
    if (lang === 'fr') return r.descriptionFr;
    if (lang === 'es') return r.descriptionEs;
    return r.description;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setBookingRef(`SK-AIR-${Math.floor(10000 + Math.random() * 90000)}`);
      setIsProcessing(false);
      setBookingConfirmed(true);
    }, 1000);
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I would like to book an Airport Transfer:\n\n` +
    `📍 Route: ${getRouteTitle(selectedRoute)}\n` +
    `🚘 Vehicle: ${currentVehicle.name}\n` +
    `📅 Date: ${travelDate}\n` +
    `✈️ Flight: ${flightNumber || 'To be provided'}\n` +
    `🏨 Hotel: ${hotelAddress || 'Tokyo Central Hotel'}\n` +
    `👥 Passengers: ${passengers} (${luggage} Bags)\n` +
    `💰 Price: ${totalPriceFormatted} JPY\n\n` +
    `Please confirm driver and availability.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-[#C5A059]/30 selection:text-[#E5C378]">

      {/* Shared Unified Header Navigation */}
      <SiteHeader currentLang={lang} onLanguageChange={setLang} activePage="airport" />

      {/* ═══════════════════════════════════════
          HERO BANNER
          ═══════════════════════════════════════ */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-[#0E131F] via-[#0A0D14] to-[#0A0D14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5" />
            {lang === 'ja' ? '成田・羽田空港 ⇄ 都内ホテル 完全定額送迎' : lang === 'zh' ? '成田/羽田机场 ⇄ 东京各酒店 一口价专车接送' : 'Tokyo Airport Executive Chauffeur'}
          </span>
          <h1
            className="text-3xl sm:text-5xl text-white font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {lang === 'ja' ? '成田・羽田 空港ドアtoドア専用車送迎' : lang === 'zh' ? '成田・羽田 机场尊贵门到门专车接送' : 'Tokyo Airport Luxury Transfers'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ja'
              ? '到着ゲートでのお名前ボード出迎え、フライト遅延自動追跡、高速料金込みの完全定額プライベートハイヤー。グランドハイアット、アマン東京、パレスホテル等へ快適に直行します。'
              : lang === 'zh'
              ? '到达口举牌迎接，60分钟免费等待时间，实时航班追踪，包含所有高速费的一口价专属包车。直达东京安缦、君悦、半岛等各大豪华酒店。'
              : 'Direct VIP door-to-door chauffeur service between Narita (NRT), Haneda (HND), and your hotel in Tokyo. Includes flight tracking, 60-minute wait time, highway tolls, and professional driver.'}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AIRPORT BOOKING & QUOTE INTERFACE
          ═══════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Select Route */}
            <div className="bg-[#0E131F] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A0D14] text-xs font-bold flex items-center justify-center">1</span>
                <span>{lang === 'ja' ? '空港ルートを選択' : lang === 'zh' ? '选择接送路线' : 'Select Airport Route'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AIRPORT_ROUTES.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRouteId === route.id
                        ? 'bg-[#C5A059]/10 border-[#C5A059] shadow-lg'
                        : 'bg-[#0A0D14] border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#E5C378] bg-[#0A0D14] px-2 py-0.5 rounded border border-[#C5A059]/40">
                        {route.airportCode}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        {route.duration}
                      </span>
                    </div>
                    <span className="font-bold text-white text-sm block mb-1">
                      {getRouteTitle(route)}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C5A059]">
                      From {route.alphardPriceFormatted}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Vehicle Class (Default Alphard) */}
            <div className="bg-[#0E131F] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A0D14] text-xs font-bold flex items-center justify-center">2</span>
                <span>{lang === 'ja' ? '運行車両を選択 (アルファード標準)' : lang === 'zh' ? '选择专车车型 (埃尔法标准)' : 'Select Vehicle Class (Alphard Default)'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['alphard', 'granace', 'hiace'] as const).map((vKey) => {
                  const cfg = vehicleConfig[vKey];
                  const isSelected = vehicle === vKey;
                  return (
                    <button
                      key={vKey}
                      onClick={() => setVehicle(vKey)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#C5A059]/15 border-[#C5A059] ring-1 ring-[#C5A059]'
                          : 'bg-[#0A0D14] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="relative h-44 sm:h-32 md:h-28 w-full rounded-lg overflow-hidden mb-2.5 bg-[#05070B]">
                          <Image src={cfg.image} alt={cfg.name} fill className="object-cover object-[center_15%]" />
                        </div>
                        <span className="font-bold text-white text-xs block line-clamp-1">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block mb-2">
                          Max {cfg.maxCap} Pax • {cfg.maxLuggage} Bags
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-[#C5A059]">
                          {cfg.priceFormatted}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-[#C5A059] text-[#0A0D14] font-bold px-1.5 py-0.5 rounded uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Passenger & Luggage Stepper with Vehicle Capacity Enforcement */}
            <div className="bg-[#0E131F] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A0D14] text-xs font-bold flex items-center justify-center">3</span>
                <span>{lang === 'ja' ? 'ご乗車人数・お荷物' : lang === 'zh' ? '出行人数与行李数' : 'Passengers & Luggage'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Passengers */}
                <div className="bg-[#0A0D14] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#C5A059]" />
                      {t.paxLabel}
                    </span>
                    <span className="text-[10px] text-[#E5C378] font-bold bg-[#C5A059]/15 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                      Max {currentVehicle.maxCap} Pax ({currentVehicle.name})
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-mono text-lg font-bold text-white">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(passengers + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Luggage */}
                <div className="bg-[#0A0D14] p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Luggage className="w-4 h-4 text-[#C5A059]" />
                      {t.suitcasesLabel}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Max {currentVehicle.maxLuggage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setLuggage(Math.max(0, luggage - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-mono text-lg font-bold text-white">{luggage}</span>
                    <button
                      type="button"
                      onClick={() => setLuggage(luggage + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Seating Capacity Warning & Second Vehicle Upsell */}
              {isExceeded && (
                <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {passengers} guests exceed {currentVehicle.name}&apos;s seating capacity ({currentVehicle.maxCap} pax).
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Do you wish to book another vehicle? (+¥{secondVehicleSurcharge.toLocaleString()} multi-vehicle convoy)
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={addSecondVehicle}
                      onChange={(e) => setAddSecondVehicle(e.target.checked)}
                      className="rounded border-slate-700 text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span className="text-white font-medium">Yes, add 2nd Support Vehicle (+¥{secondVehicleSurcharge.toLocaleString()})</span>
                  </label>
                </div>
              )}
            </div>

            {/* Step 4: Transfer Details */}
            <div className="bg-[#0E131F] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0A0D14] text-xs font-bold flex items-center justify-center">4</span>
                <span>{lang === 'ja' ? 'フライト・ホテル情報' : lang === 'zh' ? '航班及酒店信息' : 'Flight & Hotel Details'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    {t.selectDate}
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl p-3 text-white text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                    {lang === 'ja' ? '便名 (フライトナンバー)' : lang === 'zh' ? '航班号 (用于实时跟踪延误)' : 'Flight Number (e.g. NH105 / JL001)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NH105"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                    {lang === 'ja' ? '送迎先ホテル名・住所' : lang === 'zh' ? '目的地酒店名称或地址' : 'Tokyo Destination Hotel Name / Address'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Hyatt Tokyo (Roppongi) / Aman Tokyo"
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Sidebar (5 Cols - Sticky Viator Style) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-[#0E131F] border-2 border-[#C5A059]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                  {lang === 'ja' ? '定額お見積り・ご予約サマリー' : lang === 'zh' ? '一口价全包确认与预订' : 'Guaranteed Fixed Fare'}
                </span>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {getRouteTitle(selectedRoute)}
                </h3>
              </div>

              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#0A0D14]">
                <Image
                  src={currentVehicle.image}
                  alt={currentVehicle.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-[#0A0D14]/90 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-xs font-bold px-3 py-1 rounded-lg">
                  {currentVehicle.name}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{currentVehicle.name} ({getRouteTitle(selectedRoute)})</span>
                  <span className="font-mono font-bold text-white">{currentVehicle.priceFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{lang === 'ja' ? '首都高速利用料・諸税' : lang === 'zh' ? '高速过路费及税金' : 'Highway Tolls & Taxes'}</span>
                  <span className="text-emerald-400 font-bold">{lang === 'ja' ? 'コミコミ (無料)' : lang === 'zh' ? '全包 (免费)' : 'Included'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{lang === 'ja' ? '60分フライト待機料' : lang === 'zh' ? '60分钟航班免费延误等待' : 'Flight Delay Guarantee (60 min)'}</span>
                  <span className="text-emerald-400 font-bold">{lang === 'ja' ? '無料' : lang === 'zh' ? '免费' : 'Free'}</span>
                </div>
                {isExceeded && addSecondVehicle && (
                  <div className="flex justify-between text-amber-300">
                    <span>2nd Support Vehicle Surcharge</span>
                    <span className="font-mono font-bold">+¥{secondVehicleSurcharge.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Total Box */}
              <div className="bg-[#0A0D14] border border-[#C5A059]/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block tracking-wider">{t.totalEstimatedQuote}</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {totalPriceFormatted}
                  </span>
                </div>
                <span className="text-xs text-[#C5A059] font-bold bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                  JPY (All-Inc)
                </span>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t.bookNow}</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                  <span>{t.whatsAppCTA}</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {t.freeCancellation}
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {t.instantConfirmation}
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Commercial Green-Plate
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Meet &amp; Greet Included
                </span>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ═══════════════════════════════════════
          CHECKOUT MODAL
          ═══════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0E131F] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            
            <button
              onClick={() => {
                setIsModalOpen(false);
                setBookingConfirmed(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                    Secure Chauffeur Reservation
                  </span>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    Complete Your Airport Booking
                  </h3>
                  <p className="text-xs text-slate-400 pt-1">
                    Total: <strong className="text-[#C5A059] font-mono text-sm">{totalPriceFormatted} JPY</strong> for {getRouteTitle(selectedRoute)} ({currentVehicle.name})
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Lead Guest Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe / 田中 太郎"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Confirmation Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Mobile / WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+81 90 1234 5678"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A0D14] border border-slate-800 rounded-xl p-3 text-slate-400 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Credit Card &amp; PayPal Protected (Stripe 256-Bit SSL)</span>
                  </div>
                  <p>A dispatch confirmation and chauffeur contact will be sent to your email.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Processing Payment Intent...</span>
                  ) : (
                    <span>Authorize &amp; Confirm Booking ({totalPriceFormatted})</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your executive chauffeur has been scheduled. Your reference code is <strong className="text-[#C5A059] font-mono">{bookingRef}</strong>.
                </p>
                <div className="bg-[#0A0D14] border border-slate-800 rounded-xl p-4 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-bold text-white">{getRouteTitle(selectedRoute)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="font-bold text-white">{currentVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guest:</span>
                    <span className="font-bold text-white">{guestName}</span>
                  </div>
                </div>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-[#0A0D14] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                  <span>Open WhatsApp Concierge</span>
                </a>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Official SK Limo Legal Footer */}
      <div className="mt-20">
        <SiteFooter />
      </div>

    </div>
  );
}
