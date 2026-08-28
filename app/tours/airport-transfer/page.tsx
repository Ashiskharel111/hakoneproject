'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  ShieldCheck,
  Clock,
  MapPin,
  Luggage,
  Users,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Check,
  Compass
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';

const AirportTransferModule = dynamic(() => import('@/components/AirportTransferModule'), {
  loading: () => (
    <div className="p-8 text-center text-xs text-slate-400">Loading Airport Transfer Wizard...</div>
  ),
});

export default function AirportTransferDedicatedPage() {
  const [lang] = useLanguage();
  const [showBookingWizard, setShowBookingWizard] = useState(false);

  const whatsAppGeneralUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring about executive airport transfers for Tokyo Haneda (HND) / Narita (NRT).'
  )}`;

  const t = {
    badge: { ja: '国土交通省 認可事業体', zh: '日本国土交通省 正规商业绿牌', fr: 'Homologué MLIT Japon', es: 'Certificado MLIT Japón', en: 'MLIT-Certified' }[lang],
    title: {
      ja: '成田・羽田空港 ハイヤー定額送迎',
      zh: '东京成田/羽田机场 专车接送与VIP迎宾',
      fr: 'Transfert Aéroport VIP Tokyo (Haneda & Narita)',
      es: 'Traslado VIP Aeropuerto Tokio (Haneda y Narita)',
      en: 'Tokyo Airport Executive Chauffeur',
    }[lang],
    subtitle: {
      ja: '羽田（HND）・成田（NRT）と都内ホテルを直行で結ぶ完全定額送迎。フライト追跡、遅延完全無料待機（遅延追加料金¥0）、手荷物アシスト付き。',
      zh: '成田/羽田机场与东京都内酒店直达专车。全包一口价、实时航班监控、航班延误100%免费灵活守候及到达大厅举牌迎宾。',
      fr: 'Transferts privés d\'excellence entre Haneda, Narita et Tokyo. Tarifs fixes tout compris, suivi de vol et attente 100% flexible et gratuite (zéro frais de retard).',
      es: 'Traslados privados de primera clase entre Haneda, Narita y Tokio. Tarifa fija todo incluido, rastreo de vuelos y espera 100% flexible y gratuita (0 cargos por retraso).',
      en: 'Seamless private transfers between Haneda (HND), Narita (NRT), and Central Tokyo hotels. All-inclusive fixed pricing, flight tracking, and 100% free flexible delay wait time (we won’t charge a penny for delays).',
    }[lang],
    inc1Title: { ja: '遅延¥0 完全無料待機', zh: '延误0加价 免费守候', fr: 'Attente Flexible Gratuite', es: 'Espera Flexible Gratis', en: '100% Free Flexible Wait' }[lang],
    inc1Sub: { ja: '遅延追加料金なし・税関も安心', zh: '不加收任何延误费・通关从容', fr: '0 frais retard & passage douane zen', es: '0 cargos retraso y aduanas sin prisas', en: 'Zero delay fees guaranteed' }[lang],
    inc2Title: { ja: '完全 定額料金', zh: '全包一口价', fr: 'Tarif Fixe Garanti', es: 'Tarifa Fija Garantizada', en: 'Fixed Flat Rate' }[lang],
    inc2Sub: { ja: '高速代・深夜料金込', zh: '含高速费与燃油', fr: 'Péages & carburant inclus', es: 'Peajes y combustible incluidos', en: 'Tolls & fuel included' }[lang],
    inc3Title: { ja: 'リアルタイム便名追跡', zh: '实时航班动态同步', fr: 'Suivi de Vol en Direct', es: 'Sincronización en Directo', en: 'Live Radar Sync' }[lang],
    inc3Sub: { ja: '早着・遅延に自動対応', zh: '延误提前自动调整', fr: 'Ajustement auto du chauffeur', es: 'Ajuste auto del chófer', en: 'Auto delay tracking' }[lang],
    bookOnlineBtn: {
      ja: '空港送迎をオンライン予約',
      zh: '在线预订机场专车',
      fr: 'Réserver en Ligne',
      es: 'Reservar Traslado en Línea',
      en: 'Book Airport Transfer Online',
    }[lang],
    whatsAppBtn: { ja: 'WhatsApp 24時間コンシェルジュ', zh: 'WhatsApp 24小时客服', fr: 'Conciergerie WhatsApp 24/7', es: 'Conserjería WhatsApp 24/7', en: 'WhatsApp Concierge 24/7' }[lang],
    flagshipBadge: { ja: 'VIP 最高峰フリート', zh: 'VIP 旗舰豪华车队', fr: 'Flotte VIP Haut de Gamme', es: 'Flota VIP de Alta Gama', en: 'VIP Flagship Fleet' }[lang],
    flagshipDesc: { ja: '静粛性の高いキャビン、本革キャプテンシート、充実の手荷物積載スペース。', zh: '静谧舒适座舱、独立真皮航空座椅、充足的行李装载空间。', fr: 'Insonorisation parfaite, fauteuils grand confort et vaste volume de bagages.', es: 'Excelente insonorización, asientos de lujo y amplio espacio para equipaje.', en: 'Quiet cabin acoustics, leather captain seats, and generous luggage capacity.' }[lang],
    howTag: { ja: 'スムーズなご乗車手順', zh: '从容出行指引', fr: 'Expérience Voyageur Fluide', es: 'Experiencia Fluida', en: 'Seamless Passenger Experience' }[lang],
    howHead: { ja: '空港送迎の流れ', zh: '机场接送服务全流程', fr: 'Comment Fonctionne Votre Transfert', es: 'Cómo Funciona su Traslado', en: 'How Your Airport Transfer Works' }[lang],
    howSub: { ja: '飛行機が到着してからホテルにチェックインするまで。', zh: '从航班落地东京到抵达酒店大堂的每一步。', fr: 'Du toucher des roues à Tokyo jusqu\'à l\'arrivée à votre hôtel.', es: 'Desde el aterrizaje en Tokio hasta el registro en su hotel.', en: 'From the moment your flight touches down in Tokyo to your hotel check-in.' }[lang],
    step1Title: { ja: 'フライトのリアルタイム監視', zh: '实时跟踪航班动态', fr: 'Suivi de Vol en Temps Réel', es: 'Seguimiento en Tiempo Real', en: 'Real-Time Flight Tracking' }[lang],
    step1Desc: { ja: '便名に基づきフライト状況を常時監視。早着や遅延が発生しても配車時間を自動調整します（追加料金なし）。', zh: '司机根据航班号实时监控进港动态。无论提前到达还是延误，接机时间自动同步调整，绝不加收延误费用。', fr: 'Votre chauffeur suit l\'avion en direct. En cas d\'avance ou de retard, la prise en charge s\'adapte automatiquement sans le moindre supplément.', es: 'Su chófer rastrea el vuelo en vivo. En caso de adelanto o retraso, la hora se ajusta automáticamente sin coste adicional.', en: 'Your chauffeur monitors your inbound aircraft live. If your flight arrives early or is delayed, pickup timing adjusts automatically with zero stress and zero delay fees.' }[lang],
    step2Title: { ja: '完全無料・柔軟な待機ポリシー', zh: '100%免费灵活守候', fr: 'Attente 100% Flexible & Gratuite', es: 'Espera 100% Flexible y Gratuita', en: '100% Free Flexible Wait' }[lang],
    step2Desc: { ja: '入国審査・荷物受取・税関検査を急ぐ必要はありません。フライト遅延や混雑時も追加料金は一切いただかず、柔軟にお待ちいたします。', zh: '无需匆忙通关与提取行李。无论航班延误还是入境排队，我们提供100%免费灵活等候，不收一分钱延误费。', fr: 'Prenez tout votre temps pour l\'immigration, les bagages et la douane. Nous offrons une attente flexible 100% gratuite sans aucun frais de retard.', es: 'Tómese su tiempo en inmigración, equipaje y aduanas. Ofrecemos espera flexible 100% gratuita sin cobrarle un céntimo por retrasos.', en: 'Take your time through immigration, baggage claim, and customs. We provide 100% free flexible wait time — we won’t charge a penny for flight delays.' }[lang],
    step3Title: { ja: '到着ロビーでのお出迎え', zh: '到达大厅专属举牌迎宾', fr: 'Accueil aux Arrivées', es: 'Bienvenida en Llegadas', en: 'Arrivals Hall Greeting' }[lang],
    step3Desc: { ja: '税関出口を出ると、お名前入りサインボードを持った専任ドライバーがお待ちしています。手荷物もお運びします。', zh: '走出海关大门，专车司机将手持您姓名的专属标识牌迎候，并即刻协助搬运行李。', fr: 'À la sortie de la douane, votre chauffeur vous attend avec une pancarte à votre nom et prend en charge vos bagages.', es: 'Al salir de la aduana, su chófer le recibirá con un cartel con su nombre y le ayudará con el equipaje.', en: 'As you step out into the arrival lobby, your professional chauffeur awaits with an official nameboard. Immediate baggage assistance is provided.' }[lang],
    step4Title: { ja: 'ホテル玄関まで直行', zh: '直达酒店大堂', fr: 'Arrivée Directe à l\'Hôtel', es: 'Llegada Directa al Hotel', en: 'Direct Hotel Drop-Off' }[lang],
    step4Desc: { ja: 'ミネラルウォーターと充電設備を備えた快適な専用車で、ホテルの車寄せまでスムーズにお届けします。', zh: '尊享配备矿泉水与充电设施的高端专车，平稳舒适地直达目的地酒店大堂。', fr: 'Détendez-vous à bord d\'un véhicule grand confort avec eau minérale et chargeurs jusqu\'à votre hôtel.', es: 'Relájese en un vehículo de lujo con agua mineral y cargadores hasta la entrada de su hotel.', en: 'Relax in a climate-controlled luxury vehicle with complimentary bottled water and device charging as you are smoothly chauffeured directly to your hotel lobby.' }[lang],
    termTag: { ja: 'ターミナル情報', zh: '航站楼指引', fr: 'Informations Terminaux', es: 'Información de Terminales', en: 'Terminal Information' }[lang],
    termHead: { ja: '東京各空港の待ち合わせ場所', zh: '东京各机场接机汇合点', fr: 'Points de Rendez-Vous aux Aéroports', es: 'Puntos de Encuentro en los Aeropuertos', en: 'Meeting Points at Tokyo Airports' }[lang],
    fleetTag: { ja: '運行基準・車両仕様', zh: '合规车队标准', fr: 'Standards de Flotte', es: 'Estándares de Flota', en: 'Commercial Fleet Standards' }[lang],
    fleetHead: { ja: '定員および荷物積載容量', zh: '乘客定员与行李容纳规格', fr: 'Capacité Passagers & Bagages', es: 'Capacidad de Pasajeros y Equipaje', en: 'Luggage & Seating Capacity' }[lang],
    fleetSub: { ja: 'ご乗車人数とお荷物の量に合わせて最適な車両をお選びいただけます。', zh: '根据您的出行人数与行李件数选择最合适的专属座驾。', fr: 'Sélectionnez le véhicule parfait selon la taille de votre groupe et vos valises.', es: 'Elija el vehículo ideal adaptado al tamaño de su grupo y equipaje.', en: 'Choose the ideal executive vehicle tailored to your group size and baggage requirements.' }[lang],
    ctaHead: { ja: '東京空港送迎のご予約はお決まりですか？', zh: '准备好预订您的东京机场专车了吗？', fr: 'Prêt à Réserver Votre Transfert d\'Aéroport ?', es: '¿Listo para Reservar su Traslado de Aeropuerto?', en: 'Ready to Reserve Your Tokyo Airport Transfer? stroke' }[lang],
    ctaSub: { ja: 'リアルタイム追跡付きオンライン予約、またはWhatsAppコンシェルジュにて承ります。', zh: '支持航班实时追踪的在线快速预订，或通过 WhatsApp 咨询专属客服。', fr: 'Réservez en ligne avec suivi de vol ou contactez notre conciergerie sur WhatsApp.', es: 'Reserve online con seguimiento de vuelos o escriba a nuestro equipo por WhatsApp.', en: 'Book online with real-time flight tracking or connect with our concierge team on WhatsApp.' }[lang],
    ctaPortalBtn: { ja: '総合予約ポータルを開く', zh: '进入预订大厅', fr: 'Ouvrir le Portail de Réservation', es: 'Abrir Portal de Reservas', en: 'Open Main Booking Portal' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="airport" />

      {/* ══════════════════════════════════════════════════
          1. EDITORIAL HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Text & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-xs font-bold px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t.badge}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
                  {t.title}
                </h1>
                <p className="text-sm sm:text-base text-[#4B5563] dark:text-slate-300 max-w-xl leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* Inclusions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">{t.inc1Title}</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">{t.inc1Sub}</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">{t.inc2Title}</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">{t.inc2Sub}</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl col-span-2 sm:col-span-1">
                  <Plane className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">{t.inc3Title}</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">{t.inc3Sub}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingWizard(true);
                    setTimeout(() => {
                      const el = document.getElementById('booking-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 30);
                  }}
                  className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer group"
                >
                  <span>{t.bookOnlineBtn}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href={whatsAppGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#131b2c] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#1A1A1A] dark:text-white border border-[#E5E8ED] dark:border-slate-700 px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>{t.whatsAppBtn}</span>
                </a>
              </div>
            </div>

            {/* Visual Fleet Card */}
            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-[#E5E8ED] dark:border-slate-800">
                <Image
                  src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                  alt="Toyota Alphard Executive Airport Transfer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                  <span className="text-xs font-bold text-[#0068FF] bg-white px-2 py-0.5 rounded w-fit uppercase">
                    {t.flagshipBadge}
                  </span>
                  <h2 className="font-extrabold text-base">Toyota Alphard &amp; Granace VIP</h2>
                  <p className="text-xs text-slate-300">
                    {t.flagshipDesc}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. INTERACTIVE BOOKING SECTION
          ══════════════════════════════════════════════════ */}
      <section id="booking-section" className="py-8 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors scroll-mt-20">
        <AirportTransferModule />
      </section>

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS: STEP-BY-STEP ARRIVAL PROTOCOL
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            {t.howTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            {t.howHead}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
            {t.howSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              {t.step1Title}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              {t.step2Title}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              {t.step3Title}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              {t.step4Title}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              {t.step4Desc}
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. AIRPORT TERMINAL GUIDE: HANEDA & NARITA
          ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-white dark:bg-[#0E131F] border-y border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
              {t.termTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              {t.termHead}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Haneda Airport Card */}
            <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E8ED] dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-[#0068FF]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Haneda Airport (HND)</h3>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Tokyo International Airport (Ota-ku)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/20 px-2.5 py-1 rounded-full">
                  ~30 Min to City
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 3 (International Flagship)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Just outside Customs Exit Lobby, in front of the Information Counter.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 2 (ANA International &amp; Domestic)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Level 2 International Arrival Lobby main exit barrier.
                  </p>
                </div>
              </div>
            </div>

            {/* Narita Airport Card */}
            <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E8ED] dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-[#0068FF]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Narita Airport (NRT)</h3>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400">New Tokyo International Airport (Chiba)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/20 px-2.5 py-1 rounded-full">
                  ~60–75 Min to City
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 1 (North &amp; South Wings)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Central Arrivals Lobby outside South/North customs exit barriers.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 2 (Main International Hub)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Level 1 International Arrival Lobby near central meeting points.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. FLEET SPECIFICATIONS & LUGGAGE CAPACITY
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            {t.fleetTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            {t.fleetHead}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
            {t.fleetSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Alphard */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                alt="Toyota Alphard"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                VIP 1–4 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Alphard Executive</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Ottoman power-reclining captain chairs with personal climate controls and premium ride comfort.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–4 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 3–4 Large Bags
                </span>
              </div>
            </div>
          </div>

          {/* Granace */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-granace-exterior-4032x3024.jpg"
                alt="Toyota Granace 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                VIP 1–5 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Granace 4WD VIP</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Full-size executive transporter with 4 independent leather captain chairs across 2nd &amp; 3rd rows.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–5 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 4–5 Large Bags
                </span>
              </div>
            </div>
          </div>

          {/* HiAce */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-hiace-exterior-1477x1108.jpg"
                alt="HiAce Grand Cabin"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Groups 1–9 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">HiAce Grand Cabin VIP</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                High-roof wide cabin with massive luggage capacity for families, corporate teams, and golf groups.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–9 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 9–10 Large Bags
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. BOTTOM CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="py-12 bg-white dark:bg-[#0E131F] border-t border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] dark:text-white">
            {t.ctaHead}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-xl mx-auto">
            {t.ctaSub}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/tours"
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>{t.ctaPortalBtn}</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
