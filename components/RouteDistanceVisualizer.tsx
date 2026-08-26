'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Clock,
  Car,
  Fuel,
  ShieldCheck,
  ChevronRight,
  Compass,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import GoogleRouteMap from '@/components/GoogleRouteMap';

export interface RouteItem {
  id: string;
  name: { en: string; ja: string; zh: string; fr: string; es: string };
  category: 'airport' | 'sightseeing' | 'winter';
  origin: string;
  destination: string;
  distanceKm: number;
  durationMins: string;
  expressway: string;
  scenicStops: string[];
  startingPrice: number;
  embedMapQuery: string;
  image: string;
}

const CORRIDOR_ROUTES: RouteItem[] = [
  {
    id: 'tokyo-hnd',
    name: {
      en: 'Tokyo Center ⇄ Haneda Airport (HND)',
      ja: '都内各所 ⇄ 羽田空港 (HND)',
      zh: '东京都内 ⇄ 羽田机场 (HND)',
      fr: 'Centre de Tokyo ⇄ Aéroport Haneda',
      es: 'Centro de Tokio ⇄ Aeropuerto Haneda',
    },
    category: 'airport',
    origin: 'Tokyo Station, Japan',
    destination: 'Haneda Airport Terminal 3, Tokyo, Japan',
    distanceKm: 22,
    durationMins: '25–35 Mins',
    expressway: 'Shuto Expressway (Wangan Line & Route 1)',
    scenicStops: ['Rainbow Bridge View', 'Tokyo Bay Waterfront', 'Oi Junction'],
    startingPrice: 16000,
    embedMapQuery: 'Haneda+Airport+Tokyo+Japan',
    image: '/images/dest-haneda-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-nrt',
    name: {
      en: 'Tokyo Center ⇄ Narita Airport (NRT)',
      ja: '都内各所 ⇄ 成田国際空港 (NRT)',
      zh: '东京都内 ⇄ 成田国际机场 (NRT)',
      fr: 'Centre de Tokyo ⇄ Aéroport Narita',
      es: 'Centro de Tokio ⇄ Aeropuerto Narita',
    },
    category: 'airport',
    origin: 'Tokyo Metropolitan 23 Wards',
    destination: 'Narita Airport Terminal 1/2',
    distanceKm: 74,
    durationMins: '60–75 Mins',
    expressway: 'Higashi-Kanto & Shin-Kuko Expressway',
    scenicStops: ['Makuhari Coastal Area', 'Shisui Service Area', 'Narita Approach'],
    startingPrice: 28000,
    embedMapQuery: 'Narita+Airport+Chiba+Japan',
    image: '/images/dest-narita-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-fuji',
    name: {
      en: 'Tokyo ⇄ Mount Fuji & Lake Kawaguchiko',
      ja: '東京 ⇄ 富士山・河口湖・忍野八海',
      zh: '东京 ⇄ 富士山・河口湖・忍野八海',
      fr: 'Tokyo ⇄ Mont Fuji & Lac Kawaguchi',
      es: 'Tokio ⇄ Monte Fuji y Kawaguchiko',
    },
    category: 'sightseeing',
    origin: 'Tokyo Hotels',
    destination: 'Mt. Fuji 5th Station & Kawaguchiko',
    distanceKm: 118,
    durationMins: '1 hr 45 min',
    expressway: 'Chuo Expressway & Kawaguchiko Route',
    scenicStops: ['Dangozaka Service Area', 'Arakurayama Sengen Park', 'Oshino Hakkai Ponds'],
    startingPrice: 75000,
    embedMapQuery: 'Mount+Fuji+Japan',
    image: '/images/dest-fuji-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-hakone',
    name: {
      en: 'Tokyo ⇄ Hakone Onsen & Lake Ashi',
      ja: '東京 ⇄ 箱根温泉郷・芦ノ湖・大涌谷',
      zh: '东京 ⇄ 箱根温泉・芦之湖・大涌谷',
      fr: 'Tokyo ⇄ Hakone & Lac Ashi',
      es: 'Tokio ⇄ Hakone y Lago Ashi',
    },
    category: 'sightseeing',
    origin: 'Tokyo Hotels',
    destination: 'Lake Ashi & Hakone Yumoto',
    distanceKm: 94,
    durationMins: '1 hr 30 min',
    expressway: 'Tomei Expressway & Odawara-Atsugi Tollway',
    scenicStops: ['Ebina Service Area', 'Hakone Skyline Toll Road', 'Owakudani Volcanic Valley'],
    startingPrice: 78000,
    embedMapQuery: 'Hakone+Kanagawa+Japan',
    image: '/images/dest-hakone-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-kamakura',
    name: {
      en: 'Tokyo ⇄ Kamakura & Enoshima Coast',
      ja: '東京 ⇄ 古都鎌倉・江の島・湘南海岸',
      zh: '东京 ⇄ 古都镰仓・江之岛・湘南海岸',
      fr: 'Tokyo ⇄ Kamakura & Enoshima',
      es: 'Tokio ⇄ Kamakura y Enoshima',
    },
    category: 'sightseeing',
    origin: 'Tokyo Hotels',
    destination: 'Kotoku-in Great Buddha & Enoshima',
    distanceKm: 58,
    durationMins: '1 hr 00 min',
    expressway: 'Yokohama-Yokosuka Road & Shuto K3',
    scenicStops: ['Yokohama Bay Bridge', 'Shonan Coastal Highway Route 134', 'Enoshima Sea Candle'],
    startingPrice: 68000,
    embedMapQuery: 'Kamakura+Kanagawa+Japan',
    image: '/images/dest-kamakura-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-nikko',
    name: {
      en: 'Tokyo ⇄ Nikko Toshogu UNESCO Heritage',
      ja: '東京 ⇄ 世界遺産 日光東照宮・華厳の滝',
      zh: '东京 ⇄ 世界遗产 日光东照宫・华严瀑布',
      fr: 'Tokyo ⇄ Nikko Sanctuaire Toshogu',
      es: 'Tokio ⇄ Nikko Patrimonio UNESCO',
    },
    category: 'sightseeing',
    origin: 'Tokyo Hotels',
    destination: 'Nikko Toshogu & Lake Chuzenji',
    distanceKm: 152,
    durationMins: '2 hr 15 min',
    expressway: 'Tohoku & Nikko Utsunomiya Expressway',
    scenicStops: ['Hasuda Service Area', 'Irohazaka Mountain Pass', 'Kegon Waterfall Observation'],
    startingPrice: 88000,
    embedMapQuery: 'Nikko+Toshogu+Tochigi+Japan',
    image: '/images/dest-nikko-hero-1920x1080.jpg',
  },
  {
    id: 'tokyo-hakuba',
    name: {
      en: 'Tokyo / Airports ⇄ Hakuba Valley Ski Direct',
      ja: '東京/空港 ⇄ 白馬バレー 4WD直行送迎',
      zh: '东京/机场 ⇄ 白马山谷 4WD雪季专车',
      fr: 'Tokyo ⇄ Vallée de Hakuba Ski 4x4',
      es: 'Tokio ⇄ Hakuba Valley Esquí 4x4',
    },
    category: 'winter',
    origin: 'Tokyo / HND / NRT',
    destination: 'Hakuba Happo-One & Wadano Chalets',
    distanceKm: 268,
    durationMins: '3 hr 45 min',
    expressway: 'Kan-etsu & Joshin-etsu & Nagano Expressway',
    scenicStops: ['Kamisato Service Area', 'Chikuma River Rest Point', 'North Alps Mountain View'],
    startingPrice: 115000,
    embedMapQuery: 'Hakuba+Nagano+Japan',
    image: '/images/ski-hakuba-hero-4032x3024.jpg',
  },
];

export default function RouteDistanceVisualizer() {
  const [lang] = useLanguage();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('tokyo-fuji');
  const [activeCategory, setActiveCategory] = useState<'all' | 'airport' | 'sightseeing' | 'winter'>('all');

  const currentRoute = CORRIDOR_ROUTES.find((r) => r.id === selectedRouteId) || CORRIDOR_ROUTES[0];

  const filteredRoutes = activeCategory === 'all'
    ? CORRIDOR_ROUTES
    : CORRIDOR_ROUTES.filter((r) => r.category === activeCategory);

  return (
    <div className="w-full bg-white dark:bg-[#0A0D14] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#F0F2F5] dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0068FF]">
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Route &amp; Distance Calculator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] dark:text-white">
            {lang === 'ja' ? '主要ルート距離・所要時間ビジュアライザー' : 'Expressway Distance & Travel Time Visualizer'}
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400">
            {lang === 'ja'
              ? '羽田・成田空港、富士山・箱根、白馬スキー場への高速道路ルート、所要時間、距離を即座にシミュレーション。'
              : 'Calculate direct highway mileage, estimated travel times, scenic highway rest stops, and flat-rate fares across Japan.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all' as const, label: 'All Corridors' },
            { id: 'airport' as const, label: 'Airports' },
            { id: 'sightseeing' as const, label: 'Sightseeing' },
            { id: 'winter' as const, label: 'Winter Ski' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0068FF] text-white shadow-sm'
                  : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Route List (Left) + Interactive Visualizer Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
        
        {/* Route Selector Chips (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredRoutes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => setSelectedRouteId(route.id)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 ring-1 ring-[#0068FF]'
                    : 'border-[#E5E8ED] dark:border-slate-800 bg-[#F5F7FA]/70 dark:bg-[#111622] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="min-w-0 space-y-1">
                  <span className={`font-bold text-xs block truncate ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                    {route.name[lang] || route.name.en}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-[#6B7280] dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Navigation className="w-3 h-3 text-[#0068FF]" />
                      {route.distanceKm} km
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00B37E]" />
                      {route.durationMins}
                    </span>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-[#9CA3AF] block uppercase">From</span>
                  <span className="font-mono font-bold text-xs text-[#1A1A1A] dark:text-white">
                    ¥{route.startingPrice.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Route Map & Specs Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#F5F7FA] dark:bg-[#111622] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          
          {/* Top Route Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-white dark:bg-[#0A0D14] p-3.5 rounded-xl border border-[#E5E8ED] dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold block">Total Distance</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#0068FF] font-mono">{currentRoute.distanceKm} km</span>
            </div>
            <div className="border-x border-[#F0F2F5] dark:border-slate-800 px-2">
              <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold block">Drive Time</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#00B37E] font-mono">{currentRoute.durationMins}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#9CA3AF] uppercase font-semibold block">Fixed Rate</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">
                ¥{currentRoute.startingPrice.toLocaleString()}〜
              </span>
            </div>
          </div>

          {/* Google Maps Interactive Driving Route Polyline Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
            <GoogleRouteMap
              origin={currentRoute.origin}
              destination={currentRoute.destination}
              destinationName={currentRoute.name[lang] || currentRoute.name.en}
              fallbackQuery={currentRoute.embedMapQuery}
            />
          </div>

          {/* Route Details Breakdown */}
          <div className="space-y-3">
            <div className="text-xs space-y-2 text-[#4B5563] dark:text-slate-300">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#9CA3AF] shrink-0 font-medium">Primary Highway:</span>
                <span className="font-semibold text-right text-[#1A1A1A] dark:text-white">{currentRoute.expressway}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#9CA3AF] shrink-0 font-medium">Origin Point:</span>
                <span className="font-semibold text-right text-[#1A1A1A] dark:text-white">{currentRoute.origin}</span>
              </div>
            </div>

            {/* Scenic Highway Service Area Stops */}
            <div className="bg-white dark:bg-[#0A0D14] p-3.5 rounded-xl border border-[#E5E8ED] dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] dark:text-slate-400 block">
                Recommended Highway Rest &amp; View Stops
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRoute.scenicStops.map((stop, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#F5F7FA] dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    {stop}
                  </span>
                ))}
              </div>
            </div>

            {/* Book This Corridor CTA */}
            <div className="pt-2">
              <Link
                href="/tours"
                className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Reserve Chauffeur for this Route</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
