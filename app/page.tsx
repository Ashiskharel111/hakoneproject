'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Lock,
  MessageSquare,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import TripSearchTab, {
  AirportSearchParams,
  SightseeingSearchParams,
  SkiSearchParams,
} from '@/components/TripSearchTab';
import { useLanguage } from '@/context/LanguageContext';
import { getTodayJST, getFutureDateJST } from '@/lib/date-utils';

const AirportTransferModule = dynamic(() => import('@/components/AirportTransferModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Airport Booking...</span>
      </div>
    </div>
  ),
});

const DayTourBookingModule = dynamic(() => import('@/components/DayTourBookingModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Charter Booking...</span>
      </div>
    </div>
  ),
});

const SkiTransferBookingModule = dynamic(() => import('@/components/SkiTransferBookingModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Ski Booking...</span>
      </div>
    </div>
  ),
});

type ServiceType = 'airport' | 'sightseeing' | 'ski';

export default function BookingPortalHomePage() {
  const [lang] = useLanguage();
  const [activeService, setActiveService] = useState<ServiceType>('airport');

  // Search parameters state passed to active booking modules
  const [airportParams, setAirportParams] = useState<AirportSearchParams>({
    airport: 'HND',
    direction: 'airport_to_hotel',
    hotelAddress: '',
    travelDate: getTodayJST(),
    pickupTime: '10:00',
    passengers: 2,
    luggage: 2,
  });

  const [sightseeingParams, setSightseeingParams] = useState<SightseeingSearchParams>({
    destination: 'fuji-kawaguchiko',
    pickupHotel: 'tokyo',
    travelDate: getFutureDateJST(2),
    pickupTime: '09:00',
    passengers: 3,
  });

  const [skiParams, setSkiParams] = useState<SkiSearchParams>({
    resort: 'hakuba',
    pickupPoint: 'hnd',
    travelDate: getFutureDateJST(5),
    pickupTime: '08:00',
    passengers: 4,
    skiGearCount: 4,
  });

  const t = {
    badge: {
      ja: '公式オンライン予約ポータル • 国土交通省認可',
      zh: '官方在线预订系统 • 日本国土交通省正规绿牌',
      fr: 'PORTAIL DE RÉSERVATION OFFICIEL • AGRÉÉ MLIT',
      es: 'PORTAL OFICIAL DE RESERVAS • LICENCIA MLIT',
      en: 'OFFICIAL ONLINE BOOKING • MLIT LICENSED OPERATOR',
    }[lang],
    heroTitle: {
      ja: 'ハイヤー・貸切チャーターを今すぐ予約',
      zh: '日本专车与专属包车 极速即时预订',
      fr: 'Réservez Votre Chauffeur Privé au Japon',
      es: 'Reserve Su Chófer Privado en Japón',
      en: 'Reserve Your Private Chauffeur in Japan',
    }[lang],
    heroSubtitle: {
      ja: '羽田・成田空港定額送迎、富士山・箱根観光貸切、長野スキー送迎。フライト遅延無料待機・完全定額。',
      zh: '羽田/成田机场定额专车接送、富士山/箱根定制包车游览、长野滑雪专车。航班延误免费守候，全程定额透明。',
      fr: 'Transferts aéroports Haneda/Narita, excursions Fuji/Hakone, transferts ski Nagano. Tarifs fixes, attente gratuite.',
      es: 'Traslados aeropuerto Haneda/Narita, tours Fuji/Hakone, esquí en Nagano. Tarifas fijas y espera flexible gratis.',
      en: 'Haneda & Narita airport transfers, Mt. Fuji & Hakone private day charters, Nagano ski direct. Fixed rates with free flight delay wait.',
    }[lang],
    trust1: { ja: '国土交通省 緑ナンバー認可', zh: '100% 正规商业绿牌 (関自旅第1234号)', fr: 'Agrément Officiel Plaque Verte MLIT', es: 'Operador Oficial Placa Verde MLIT', en: '100% MLIT Green-Plate Licensed' }[lang],
    trust1Sub: { ja: '事業用自動車総合保険加入・正規運行管理体制', zh: '全员商业旅客保险・合法合规安全出行', fr: 'Assurance passagers intégrale & flotte agréée', es: 'Seguro comercial completo de pasajeros', en: 'Full commercial passenger liability coverage' }[lang],
    trust2: { ja: '空港到着後 90分無料待機', zh: '航班延误¥0加价・免费灵活守候90分钟', fr: '90 Min d’Attente Gratuite à l’Aéroport', es: '90 Minutos de Espera Gratis en Aeropuerto', en: '90-Min Free Flight Delay Wait' }[lang],
    trust2Sub: { ja: 'フライトリアルタイム追跡・遅延時も追加料金なし', zh: '实时追踪航班起降・延误无忧自动调整', fr: 'Suivi des vols en direct • Aucun supplément de retard', es: 'Seguimiento de vuelos en vivo sin cargos extras', en: 'Live flight tracking with zero delay surcharges' }[lang],
    trust3: { ja: 'Stripe 256-bit 暗号化決済', zh: 'Stripe 全球银行级加密支付通道', fr: 'Paiement Sécurisé Stripe 256-bit', es: 'Pago Seguro Encriptado Stripe 256-bit', en: 'Stripe 256-Bit Encrypted Checkout' }[lang],
    trust3Sub: { ja: '高速通行料・空港駐車料金・消費税すべて込み', zh: '高速费・停车费・消费税全包一口价', fr: 'Péages autoroutiers, parking et taxes inclus', es: 'Peajes, estacionamiento e impuestos incluidos', en: 'Highway tolls, parking & taxes all included' }[lang],
    trust4: { ja: 'WhatsApp 24時間配車デスク', zh: 'WhatsApp 24/7 中英日专属在线调度台', fr: 'Assistance & Chauffeurs WhatsApp 24/7', es: 'Concierge y Despacho WhatsApp 24/7', en: '24/7 WhatsApp Chauffeur Concierge' }[lang],
    trust4Sub: { ja: '日英中バイリンガル対応・直前のご要望も即時手配', zh: '中英日三语调度・即时响应接机突发需求', fr: 'Assistance trilingue directe pour toute modification', es: 'Atención trilingüe directa y despacho inmediato', en: 'Trilingual dispatch for real-time adjustments' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#07090E] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* ── Sleek Portal Header ── */}
      <SiteHeader
        activeService={activeService}
        onSelectService={(srv) => setActiveService(srv)}
      />

      {/* ── Main Booking Portal Content ── */}
      <main className="pt-20 sm:pt-24 pb-16">
        
        {/* 1. Refined Editorial Heading */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
          {/* Official License Credential */}
          <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#C5A059]/5 px-4 py-1.5 rounded-full mb-3.5 backdrop-blur-sm">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              {t.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-tight mb-2.5">
            {t.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </section>

        {/* ── Trip.com Style Search Tab (Unified Quick Configuration) ── */}
        <TripSearchTab
          activeService={activeService}
          onServiceChange={(service) => setActiveService(service)}
          onSearchAirport={(params) => setAirportParams(params)}
          onSearchSightseeing={(params) => setSightseeingParams(params)}
          onSearchSki={(params) => setSkiParams(params)}
        />

        {/* 2. Seamless Active Booking Engine Container */}
        <section id="booking-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-20">
          <div className="transition-opacity duration-200">
            {activeService === 'airport' && (
              <AirportTransferModule
                key={`airport-${airportParams.airport}-${airportParams.direction}-${airportParams.travelDate}-${airportParams.passengers}-${airportParams.luggage}-${airportParams.hotelAddress}`}
                initialAirport={airportParams.airport}
                initialDirection={airportParams.direction}
                initialDate={airportParams.travelDate}
                initialPassengers={airportParams.passengers}
                initialLuggage={airportParams.luggage}
                initialHotelAddress={airportParams.hotelAddress}
              />
            )}

            {activeService === 'sightseeing' && (
              <DayTourBookingModule
                key={`sightseeing-${sightseeingParams.destination}-${sightseeingParams.travelDate}-${sightseeingParams.passengers}-${sightseeingParams.pickupHotel}`}
                initialDestination={sightseeingParams.destination}
                initialDate={sightseeingParams.travelDate}
                initialPassengers={sightseeingParams.passengers}
                initialPickupHotel={sightseeingParams.pickupHotel}
              />
            )}

            {activeService === 'ski' && (
              <SkiTransferBookingModule
                key={`ski-${skiParams.resort}-${skiParams.pickupPoint}-${skiParams.travelDate}-${skiParams.passengers}-${skiParams.skiGearCount}`}
                initialResort={skiParams.resort}
                initialPickup={skiParams.pickupPoint}
                initialDate={skiParams.travelDate}
                initialPassengers={skiParams.passengers}
                initialSkiGearCount={skiParams.skiGearCount}
              />
            )}
          </div>
        </section>

        {/* 3. Institutional Assurance Ledger */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border-y border-stone-200/80 dark:border-white/[0.08] py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="space-y-1.5 border-l-2 border-[#C5A059]/80 pl-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold block">
                01 / MLIT LICENSE
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t.trust1}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.trust1Sub}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-[#C5A059]/80 pl-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold block">
                02 / FLIGHT WAIT
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t.trust2}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.trust2Sub}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-[#C5A059]/80 pl-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold block">
                03 / ALL-INCLUSIVE
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t.trust3}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.trust3Sub}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-[#C5A059]/80 pl-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold block">
                04 / CONCIERGE
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {t.trust4}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.trust4Sub}
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* ── Minimalist Clean Footer ── */}
      <SiteFooter />
    </div>
  );
}
