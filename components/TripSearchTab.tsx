'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Compass,
  Snowflake,
  Calendar,
  Users,
  Luggage,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Airport } from '@/lib/airport-pricing';
import { TransferDirection } from '@/components/AirportTransferModule';
import { getTodayJST, getFutureDateJST } from '@/lib/date-utils';

export interface AirportSearchParams {
  airport: Airport;
  direction: TransferDirection;
  hotelAddress: string;
  travelDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
}

export interface SightseeingSearchParams {
  destination: string;
  pickupHotel: string;
  travelDate: string;
  pickupTime: string;
  passengers: number;
}

export interface SkiSearchParams {
  resort: string;
  pickupPoint: 'tokyo' | 'hnd' | 'nrt';
  travelDate: string;
  pickupTime: string;
  passengers: number;
  skiGearCount: number;
}

interface TripSearchTabProps {
  activeService: 'airport' | 'sightseeing' | 'ski';
  onServiceChange: (service: 'airport' | 'sightseeing' | 'ski') => void;
  onSearchAirport: (params: AirportSearchParams) => void;
  onSearchSightseeing: (params: SightseeingSearchParams) => void;
  onSearchSki: (params: SkiSearchParams) => void;
}

const TOKYO_POPULAR_DISTRICTS = [
  'Shinjuku',
  'Ginza',
  'Shibuya',
  'Roppongi',
  'Minato-ku',
  'Asakusa',
  'Tokyo Station / Chiyoda',
];

export default function TripSearchTab({
  activeService,
  onServiceChange,
  onSearchAirport,
  onSearchSightseeing,
  onSearchSki,
}: TripSearchTabProps) {
  const [lang] = useLanguage();

  // 1. Airport Transfer Search State
  const [airport, setAirport] = useState<Airport>('HND');
  const [direction, setDirection] = useState<TransferDirection>('airport_to_hotel');
  const [hotelAddress, setHotelAddress] = useState<string>('');
  const [airportDate, setAirportDate] = useState<string>(() => getTodayJST());
  const [airportTime, setAirportTime] = useState<string>('10:00');
  const [airportPax, setAirportPax] = useState<number>(2);
  const [airportLuggage, setAirportLuggage] = useState<number>(2);
  const [isPaxDropdownOpen, setIsPaxDropdownOpen] = useState(false);

  // 2. Sightseeing Search State
  const [tourDest, setTourDest] = useState<string>('fuji-kawaguchiko');
  const [tourPickup, setTourPickup] = useState<string>('tokyo');
  const [tourDate, setTourDate] = useState<string>(() => getFutureDateJST(2));
  const [tourTime, setTourTime] = useState<string>('09:00');
  const [tourPax, setTourPax] = useState<number>(3);

  // 3. Ski Search State
  const [skiResort, setSkiResort] = useState<string>('hakuba');
  const [skiPickup, setSkiPickup] = useState<'tokyo' | 'hnd' | 'nrt'>('hnd');
  const [skiDate, setSkiDate] = useState<string>(() => getFutureDateJST(5));
  const [skiTime, setSkiTime] = useState<string>('08:00');
  const [skiPax, setSkiPax] = useState<number>(4);
  const [skiGearCount, setSkiGearCount] = useState<number>(4);

  const paxDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (paxDropdownRef.current && !paxDropdownRef.current.contains(event.target as Node)) {
        setIsPaxDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = {
    airportTab: { ja: '空港定額送迎', zh: '机场接送', fr: 'Transferts Aéroports', es: 'Traslados Aeropuerto', en: 'Airport Transfers' }[lang],
    sightseeingTab: { ja: '観光貸切チャーター', zh: '观光包车一日游', fr: 'Excursions Privées', es: 'Tours Privados', en: 'Sightseeing Charters' }[lang],
    skiTab: { ja: 'スキー場直行送迎', zh: '4WD雪季滑雪专车', fr: 'Transferts Ski 4WD', es: 'Traslados Esquí 4WD', en: 'Ski Charters (4WD)' }[lang],
    
    fromAirport: { ja: '空港発 → 都内・目的地 (お迎え)', zh: '机场接机 (飞抵日本)', fr: 'Arrivée (Aéroport ➔ Hôtel)', es: 'Llegada (Aeropuerto ➔ Hotel)', en: 'Arrival (From Airport)' }[lang],
    toAirport: { ja: '都内発 → 空港行き (お送り)', zh: '送机至机场', fr: 'Départ (Hôtel ➔ Aéroport)', es: 'Salida (Hotel ➔ Aeropuerto)', en: 'Departure (To Airport)' }[lang],
    
    pickupAirport: { ja: '利用空港', zh: '抵离机场', fr: 'Aéroport', es: 'Aeropuerto', en: 'Airport' }[lang],
    dropoffLocation: { ja: '目的地・宿泊先ホテル', zh: '送达目的地 / 酒店', fr: 'Destination / Hôtel', es: 'Destino / Hotel', en: 'Drop-off / Hotel' }[lang],
    pickupLocation: { ja: 'ご出発地・お迎え場所', zh: '出发地上门接送', fr: 'Lieu de prise en charge', es: 'Lugar de recogida', en: 'Pick-up Location' }[lang],
    dateTime: { ja: '日時 (日本時間)', zh: '乘车日期与时间', fr: 'Date & Heure', es: 'Fecha y Hora', en: 'Date & Time' }[lang],
    guestsBags: { ja: '乗車人数・荷物個数', zh: '人数与行李数', fr: 'Passagers & Bagages', es: 'Pasajeros y Maletas', en: 'Guests & Luggage' }[lang],
    
    searchBtn: { ja: '料金確認・予約へ進む', zh: '搜索专车并即时预订', fr: 'Vérifier & Réserver', es: 'Consultar y Reservar', en: 'Search Rates & Book' }[lang],
    startingFromHND: { ja: '羽田 定額 ¥24,000〜', zh: '羽田 定额 ¥24,000起', fr: 'Haneda dès ¥24 000', es: 'Haneda desde ¥24,000', en: 'Haneda From ¥24,000' }[lang],
    startingFromNRT: { ja: '成田 定額 ¥45,000〜', zh: '成田 定额 ¥45,000起', fr: 'Narita dès ¥45 000', es: 'Narita desde ¥45,000', en: 'Narita From ¥45,000' }[lang],
    startingFromTour: { ja: '貸切10時間 ¥75,000〜', zh: '10小时包车 ¥75,000起', fr: '10h dès ¥75 000', es: '10h desde ¥75,000', en: '10h Day Tour From ¥75,000' }[lang],
    startingFromSki: { ja: '白馬直行 ¥110,000〜', zh: '白马直达 ¥110,000起', fr: 'Hakuba dès ¥110 000', es: 'Hakuba desde ¥110,000', en: 'Hakuba Direct From ¥110,000' }[lang],
    
    paxUnit: { ja: '名', zh: '位', fr: 'pax', es: 'pers.', en: 'Guests' }[lang],
    bagsUnit: { ja: '個', zh: '件', fr: 'valises', es: 'maletas', en: 'Bags' }[lang],
  };

  const handleAirportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchAirport({
      airport,
      direction,
      hotelAddress,
      travelDate: airportDate,
      pickupTime: airportTime,
      passengers: airportPax,
      luggage: airportLuggage,
    });
    scrollToBookingEngine();
  };

  const handleSightseeingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSightseeing({
      destination: tourDest,
      pickupHotel: tourPickup,
      travelDate: tourDate,
      pickupTime: tourTime,
      passengers: tourPax,
    });
    scrollToBookingEngine();
  };

  const handleSkiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSki({
      resort: skiResort,
      pickupPoint: skiPickup,
      travelDate: skiDate,
      pickupTime: skiTime,
      passengers: skiPax,
      skiGearCount,
    });
    scrollToBookingEngine();
  };

  const scrollToBookingEngine = () => {
    setTimeout(() => {
      const el = document.getElementById('booking-engine');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
      
      {/* ── Outer Card (Sleek Monolithic Console) ── */}
      <div className="bg-white dark:bg-[#0A0D14] border border-stone-200 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-xl shadow-black/[0.03] dark:shadow-black/60 overflow-hidden">
        
        {/* Top Service Selector Strip */}
        <div className="flex items-center gap-1.5 border-b border-stone-200/80 dark:border-white/[0.08] bg-stone-50/80 dark:bg-[#080B10] px-3 sm:px-6 pt-3 pb-3 overflow-x-auto no-scrollbar">
          
          <button
            type="button"
            onClick={() => onServiceChange('airport')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border ${
              activeService === 'airport'
                ? 'bg-white dark:bg-[#121722] text-stone-900 dark:text-white border-stone-200 dark:border-white/[0.12] shadow-xs'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Plane className={`w-4 h-4 ${activeService === 'airport' ? 'text-[#C5A059]' : ''}`} />
            <span>{t.airportTab}</span>
            <span className="text-[10px] hidden md:inline-block px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-mono">
              {t.startingFromHND}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onServiceChange('sightseeing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border ${
              activeService === 'sightseeing'
                ? 'bg-white dark:bg-[#121722] text-stone-900 dark:text-white border-stone-200 dark:border-white/[0.12] shadow-xs'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeService === 'sightseeing' ? 'text-[#C5A059]' : ''}`} />
            <span>{t.sightseeingTab}</span>
            <span className="text-[10px] hidden md:inline-block px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-mono">
              {t.startingFromTour}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onServiceChange('ski')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border ${
              activeService === 'ski'
                ? 'bg-white dark:bg-[#121722] text-stone-900 dark:text-white border-stone-200 dark:border-white/[0.12] shadow-xs'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Snowflake className={`w-4 h-4 ${activeService === 'ski' ? 'text-[#C5A059]' : ''}`} />
            <span>{t.skiTab}</span>
            <span className="text-[10px] hidden md:inline-block px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-mono">
              {t.startingFromSki}
            </span>
          </button>

        </div>

        {/* ── Search Form Row ── */}
        <div className="p-4 sm:p-6 bg-white dark:bg-[#0A0D14]">
          
          {/* ============================================================== */}
          {/* 1. AIRPORT TRANSFER SEARCH TAB                                */}
          {/* ============================================================== */}
          {activeService === 'airport' && (
            <form onSubmit={handleAirportSubmit} className="space-y-4">
              
              {/* Direction Toggle */}
              <div className="flex items-center gap-2 pb-1">
                <div className="inline-flex p-1 bg-stone-100 dark:bg-white/[0.06] rounded-xl border border-stone-200/80 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setDirection('airport_to_hotel')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      direction === 'airport_to_hotel'
                        ? 'bg-white dark:bg-[#141926] text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t.fromAirport}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection('hotel_to_airport')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      direction === 'hotel_to_airport'
                        ? 'bg-white dark:bg-[#141926] text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t.toAirport}</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#C5A059] font-semibold ml-auto">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>90-Min Flight Wait Included • Fixed Rates</span>
                </div>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                
                {/* Field 1: Airport Select (Haneda / Narita) */}
                <div className="md:col-span-3 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    {t.pickupAirport}
                  </span>
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-stone-400 shrink-0" />
                    <select
                      value={airport}
                      onChange={(e) => setAirport(e.target.value as Airport)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="HND" className="dark:bg-slate-900">
                        {lang === 'ja' ? '羽田空港 (HND) - 都内約45分' : lang === 'zh' ? '东京羽田机场 (HND) - 约45分' : 'Tokyo Haneda (HND) - ~45m'}
                      </option>
                      <option value="NRT" className="dark:bg-slate-900">
                        {lang === 'ja' ? '成田国際空港 (NRT) - 都内約75分' : lang === 'zh' ? '成田国际机场 (NRT) - 约75分' : 'Narita Airport (NRT) - ~75m'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Field 2: Drop-off Hotel / Destination with Quick District Chips */}
                <div className="md:col-span-4 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    {direction === 'airport_to_hotel' ? t.dropoffLocation : t.pickupLocation}
                  </span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={hotelAddress}
                      onChange={(e) => setHotelAddress(e.target.value)}
                      placeholder={lang === 'ja' ? 'ホテル名・新宿・銀座・港区…' : lang === 'zh' ? '输入酒店名称或东京区域 (如新宿/银座)' : 'Hotel name or district (e.g. Shinjuku)'}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 3: Date & Time */}
                <div className="md:col-span-3 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    {t.dateTime}
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="date"
                      value={airportDate}
                      onChange={(e) => setAirportDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    />
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
                    <input
                      type="time"
                      value={airportTime}
                      onChange={(e) => setAirportTime(e.target.value)}
                      className="w-20 bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Field 4: Passengers & Luggage Dropdown */}
                <div className="md:col-span-2 relative" ref={paxDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsPaxDropdownOpen(!isPaxDropdownOpen)}
                    className="w-full h-full min-h-[58px] p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl flex flex-col justify-center text-left cursor-pointer hover:border-[#C5A059]/40 transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      {t.guestsBags}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-white">
                        {airportPax} {t.paxUnit}, {airportLuggage} {t.bagsUnit}
                      </span>
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    </div>
                  </button>

                  {/* Pax Popover */}
                  {isPaxDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0E1422] border border-[#E2E8F0] dark:border-slate-700 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">Passengers</span>
                          <span className="text-[10px] text-slate-400">Max 9 per vehicle</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAirportPax(Math.max(1, airportPax - 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono">{airportPax}</span>
                          <button
                            type="button"
                            onClick={() => setAirportPax(Math.min(9, airportPax + 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">Suitcases</span>
                          <span className="text-[10px] text-slate-400">Large 28" luggage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAirportLuggage(Math.max(0, airportLuggage - 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono">{airportLuggage}</span>
                          <button
                            type="button"
                            onClick={() => setAirportLuggage(Math.min(10, airportLuggage + 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 text-[10px] text-[#8C6D3F] dark:text-[#E5C378] font-medium">
                        {airportPax <= 4 && airportLuggage <= 4 ? (
                          <span>🚗 Recommended: <strong>Toyota Alphard VIP</strong></span>
                        ) : (
                          <span>🚐 Recommended: <strong>Toyota HiAce Grand Cabin</strong></span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPaxDropdownOpen(false)}
                        className="w-full py-1.5 rounded-lg bg-[#C5A059] text-black font-extrabold text-xs text-center cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Quick Chips + Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                
                {/* Popular Tokyo Areas Chips */}
                <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">Popular:</span>
                  {TOKYO_POPULAR_DISTRICTS.map((dst) => (
                    <button
                      key={dst}
                      type="button"
                      onClick={() => setHotelAddress(dst)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-stone-100 dark:bg-white/[0.05] border border-stone-200/70 dark:border-white/[0.06] text-stone-600 dark:text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-colors cursor-pointer"
                    >
                      {dst}
                    </button>
                  ))}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </form>
          )}

          {/* ============================================================== */}
          {/* 2. SIGHTSEEING CHARTERS SEARCH TAB                            */}
          {/* ============================================================== */}
          {activeService === 'sightseeing' && (
            <form onSubmit={handleSightseeingSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                
                {/* Field 1: Destination Tour Select */}
                <div className="md:col-span-5 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    Sightseeing Destination
                  </span>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-stone-400 shrink-0" />
                    <select
                      value={tourDest}
                      onChange={(e) => setTourDest(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="fuji-kawaguchiko" className="dark:bg-slate-900">🗻 Mt. Fuji & Lake Kawaguchiko (10 Hours)</option>
                      <option value="hakone-luxury" className="dark:bg-slate-900">♨️ Hakone Hot Springs & Lake Ashi (9 Hours)</option>
                      <option value="kamakura-enoshima" className="dark:bg-slate-900">⛩️ Kamakura Buddha & Enoshima Coast (8 Hours)</option>
                      <option value="nikko-unesco" className="dark:bg-slate-900">🏯 Nikko UNESCO World Heritage & Shrine (10 Hours)</option>
                      <option value="yokohama-bay" className="dark:bg-slate-900">🎡 Yokohama Minato Mirai & Chinatown (8 Hours)</option>
                      <option value="karuizawa-retreat" className="dark:bg-slate-900">🌲 Karuizawa Alpine Resort & Outlets (10 Hours)</option>
                    </select>
                  </div>
                </div>

                {/* Field 2: Pickup Area */}
                <div className="md:col-span-3 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    {t.pickupLocation}
                  </span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <select
                      value={tourPickup}
                      onChange={(e) => setTourPickup(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="tokyo" className="dark:bg-slate-900">Tokyo Downtown Hotels (23 Wards)</option>
                      <option value="hnd" className="dark:bg-slate-900">Tokyo Haneda Airport (HND)</option>
                      <option value="nrt" className="dark:bg-slate-900">Narita International Airport (NRT)</option>
                    </select>
                  </div>
                </div>

                {/* Field 3: Date & Time */}
                <div className="md:col-span-2 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    Date & Start Time
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="date"
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Field 4: Guests Counter */}
                <div className="md:col-span-2 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    Passengers
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400">Guests</span>
                    <select
                      value={tourPax}
                      onChange={(e) => setTourPax(Number(e.target.value))}
                      className="bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={n} className="dark:bg-slate-900">
                          {n} Guests {n <= 4 ? '(Alphard)' : '(HiAce)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline-block">
                  Customized Route • English Chauffeur • Bottled Water & Tolls Included
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer ml-auto"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Charters & Book</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* ============================================================== */}
          {/* 3. SKI CHARTERS SEARCH TAB                                    */}
          {/* ============================================================== */}
          {activeService === 'ski' && (
            <form onSubmit={handleSkiSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                
                {/* Field 1: Ski Resort Select */}
                <div className="md:col-span-4 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    Alpine Ski Destination
                  </span>
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-stone-400 shrink-0" />
                    <select
                      value={skiResort}
                      onChange={(e) => setSkiResort(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="hakuba" className="dark:bg-slate-900">❄️ Hakuba Valley (Nagano) - 3.5h</option>
                      <option value="nozawa" className="dark:bg-slate-900">❄️ Nozawa Onsen (Nagano) - 3.5h</option>
                      <option value="shiga" className="dark:bg-slate-900">❄️ Shiga Kogen (Nagano) - 4.0h</option>
                      <option value="myoko" className="dark:bg-slate-900">❄️ Myoko Kogen (Niigata) - 3.5h</option>
                      <option value="madarao" className="dark:bg-slate-900">❄️ Madarao Mountain (Nagano) - 3.5h</option>
                      <option value="karuizawa" className="dark:bg-slate-900">❄️ Karuizawa Prince Snow Resort - 2.0h</option>
                    </select>
                  </div>
                </div>

                {/* Field 2: Pickup Area */}
                <div className="md:col-span-3 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    {t.pickupLocation}
                  </span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <select
                      value={skiPickup}
                      onChange={(e) => setSkiPickup(e.target.value as any)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="hnd" className="dark:bg-slate-900">Tokyo Haneda Airport (HND)</option>
                      <option value="nrt" className="dark:bg-slate-900">Narita International Airport (NRT)</option>
                      <option value="tokyo" className="dark:bg-slate-900">Tokyo Downtown Hotels / Chalet</option>
                    </select>
                  </div>
                </div>

                {/* Field 3: Date */}
                <div className="md:col-span-2 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    Travel Date
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      type="date"
                      value={skiDate}
                      onChange={(e) => setSkiDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Field 4: Guests & Ski Bags */}
                <div className="md:col-span-3 p-3 bg-stone-50/80 dark:bg-[#101420] border border-stone-200/80 dark:border-white/[0.07] rounded-xl hover:border-[#C5A059]/40 focus-within:border-[#C5A059] transition-all flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      Guests & Ski Bags
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                      {skiPax} Guests, {skiGearCount} Ski Bags
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(1, skiPax - 1);
                        setSkiPax(next);
                        setSkiGearCount(next);
                      }}
                      className="w-7 h-7 rounded-lg bg-stone-200/80 dark:bg-slate-800 text-stone-800 dark:text-white font-bold text-xs"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.min(9, skiPax + 1);
                        setSkiPax(next);
                        setSkiGearCount(next);
                      }}
                      className="w-7 h-7 rounded-lg bg-stone-200/80 dark:bg-slate-800 text-stone-800 dark:text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline-block">
                  4WD High-Grade Van • Studded Snow Tires • Ski Rack Equipment Included
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer ml-auto"
                >
                  <Search className="w-4 h-4" />
                  <span>Find 4WD Ski Chauffeur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
