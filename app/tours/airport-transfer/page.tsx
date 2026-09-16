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
      ja: '羽田（HND）・成田（NRT）と都内ホテルを直行で結ぶ完全定額送迎。フライト常時追跡・着陸連動配車（空港での無駄な待機がない限り遅延料金¥0完全無料）、手荷物アシスト付き。',
      zh: '成田/羽田机场与东京都内酒店直达专车。全包一口价、实时航班跟踪与着陆联动（机场无空等则延误费¥0完全免费）、到达大厅举牌迎宾。',
      fr: 'Transferts privés d\'excellence entre Haneda, Narita et Tokyo. Tarifs fixes tout compris, suivi de vol synchronisé (0 frais tant qu\'il n\'y a pas d\'attente aéroport), accueil nominatif.',
      es: 'Traslados privados de primera clase entre Haneda, Narita y Tokio. Tarifa fija todo incluido, rastreo en vivo sincronizado (0 cargos mientras no haya espera en aeropuerto) y bienvenida.',
      en: 'Seamless private transfers between Haneda (HND), Narita (NRT), and Central Tokyo hotels. All-inclusive fixed pricing, real-time flight tracking & synchronized dispatch (as long as we\'re not waiting at the airport, we won\'t charge delay fees).',
    }[lang],
    inc1Title: { ja: '遅延¥0 完全無料待機', zh: '延误0加价 免费守候', fr: 'Attente Flexible Gratuite', es: 'Espera Flexible Gratis', en: '100% Free Flexible Wait' }[lang],
    inc1Sub: { ja: '空港待機なしで遅延料金¥0', zh: '无机场空等则延误费¥0', fr: '0 frais retard sans attente', es: '0 cargos por retraso', en: 'Zero delay fees guaranteed' }[lang],
    inc2Title: { ja: '完全 定額料金', zh: '全包一口价', fr: 'Tarif Fixe Garanti', es: 'Tarifa Fija Garantizada', en: 'Fixed Flat Rate' }[lang],
    inc2Sub: { ja: '高速代・深夜料金込', zh: '含高速费与燃油', fr: 'Péages & carburant inclus', es: 'Peajes y combustible incluidos', en: 'Tolls & fuel included' }[lang],
    inc3Title: { ja: 'リアルタイム便名追跡', zh: '实时航班动态同步', fr: 'Suivi de Vol en Direct', es: 'Sincronización en Directo', en: 'Live Radar Sync' }[lang],
    inc3Sub: { ja: '着陸連動配車・早着遅延対応', zh: '着陆联动接送・自动调整', fr: 'Ajustement auto à l\'atterrissage', es: 'Ajuste auto al aterrizaje', en: 'Auto touchdown sync' }[lang],
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
    step1Title: { ja: 'フライト常時監視＆着陸連動配車', zh: '实时跟踪航班动态与着陆联动', fr: 'Suivi de Vol en Temps Réel', es: 'Seguimiento en Tiempo Real', en: 'Live Flight Tracking & Synchronized Dispatch' }[lang],
    step1Desc: { ja: '便名に基づきフライト状況を常時監視。実際の着陸時間に合わせて配車を行うため、空港での無駄な待機が発生しない限り、フライト遅延による追加料金は一切いただきません（¥0完全無料）。', zh: '根据航班号实时监控进港动态并根据实际落地精准发车。只要司机未在机场产生空等，航班延误绝不收取任何延误费（¥0完全免费）。', fr: 'Votre chauffeur suit le vol en direct et synchronise son départ sur votre atterrissage réel. Tant que le chauffeur n\'attend pas inutilement à l\'aéroport, aucun frais de retard n\'est facturé.', es: 'Su chófer rastrea el vuelo en vivo y sincroniza su salida con el aterrizaje. Mientras no haya espera innecesaria en el aeropuerto, los retrasos no generan recargos (0 ¥ gratis).', en: 'Your chauffeur monitors your inbound aircraft live. Because dispatch is synchronized to your actual landing time, as long as we are not waiting at the airport, you will never be charged for flight delays (¥0 delay protection).' }[lang],
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
    hndPointsTag: { ja: '羽田空港公式案内', zh: '羽田机场官方乘车指南', fr: 'Guide Officiel Aéroport de Haneda', es: 'Guía Oficial Aeropuerto de Haneda', en: 'Tokyo Haneda Official Access Guide' }[lang],
    hndPointsHead: { ja: '羽田空港 各ターミナル乗降場（ピックアップ・ドロップオフ）', zh: '羽田机场 各航站楼乘车点与落客点指引', fr: 'Points de Prise en Charge & Dépose à Haneda (T1, T2, T3)', es: 'Puntos de Recogida y Llegada en Haneda (T1, T2, T3)', en: 'Haneda Airport (HND) Terminal Pick-Up & Drop-Off Points' }[lang],
    hndPointsSub: {
      ja: '羽田空港旅客ターミナル公式規定（tokyo-haneda.com）に基づく、第1・第2・第3ターミナルのハイヤー・タクシー乗り場および出発階降車レーンのご案内。',
      zh: '依据东京羽田空港旅客航站楼官方指引（tokyo-haneda.com），为您详列第1、第2、第3航站楼的专车/出租车乘车点与出发层落客区。',
      fr: 'Emplacements officiels d\'embarquement et de dépose des terminaux 1, 2 et 3 selon les directives de l\'Aéroport de Haneda (tokyo-haneda.com).',
      es: 'Ubicaciones oficiales de recogida y bajada de las terminales 1, 2 y 3 según la normativa del Aeropuerto de Haneda (tokyo-haneda.com).',
      en: 'Official boarding stands, app/reserved zones, and curbside departure drop-offs across Terminal 1, 2, and 3 based on Tokyo International Airport regulations (tokyo-haneda.com).',
    }[lang],
    pickupLabel: { ja: '乗車場所（ピックアップ）', zh: '乘车点（Pick-Up）', fr: 'Point de Prise en Charge', es: 'Punto de Recogida', en: 'Pick-Up Location' }[lang],
    dropoffLabel: { ja: '降車場所（ドロップオフ）', zh: '落客点（Drop-Off）', fr: 'Point de Dépose', es: 'Punto de Bajada', en: 'Drop-Off Location' }[lang],
    officialSourceNote: { ja: '羽田空港公式タクシー案内ページへ', zh: '查看羽田空港官方出租车与乘车指南', fr: 'Voir la page officielle des taxis de l\'aéroport de Haneda', es: 'Ver página oficial de taxis de Haneda', en: 'View Official Haneda Airport Taxi Access Guide' }[lang],
    ctaHead: { ja: '東京空港送迎のご予約はお決まりですか？', zh: '准备好预订您的东京机场专车了吗？', fr: 'Prêt à Réserver Votre Transfert d\'Aéroport ?', es: '¿Listo para Reservar su Traslado de Aeropuerto?', en: 'Ready to Reserve Your Tokyo Airport Transfer?' }[lang],
    ctaSub: { ja: 'リアルタイム追跡付きオンライン予約、またはWhatsAppコンシェルジュにて承ります。', zh: '支持航班实时追踪的在线快速预订，或通过 WhatsApp 咨询专属客服。', fr: 'Réservez en ligne avec suivi de vol ou contactez notre conciergerie sur WhatsApp.', es: 'Reserve online con seguimiento de vuelos o escriba a nuestro equipo por WhatsApp.', en: 'Book online with real-time flight tracking or connect with our concierge team on WhatsApp.' }[lang],
    ctaPortalBtn: { ja: '総合予約ポータルを開く', zh: '进入预订大厅', fr: 'Ouvrir le Portail de Réservation', es: 'Abrir Portal de Reservas', en: 'Open Main Booking Portal' }[lang],
  };

  const [selectedHndTerminal, setSelectedHndTerminal] = useState<'t1' | 't2' | 't3'>('t3');

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

              {/* 3-Hour Transfer Distance Policy & Inter-Prefecture WhatsApp Notice */}
              <div className="p-3.5 bg-gradient-to-r from-[#EBF3FF] to-[#FAF8F4] dark:from-[#131b2c] dark:to-[#1a2333] border border-[#0068FF]/30 dark:border-slate-700 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0068FF] dark:text-[#3B82F6]">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#C5A059]" />
                  <span>
                    {lang === 'ja'
                      ? '3時間送迎は走行距離ベースで算出いたします'
                      : lang === 'zh'
                      ? '3小时包车接送服务按实际行驶里程计算'
                      : lang === 'fr'
                      ? 'Les transferts de 3h sont calculés selon la distance parcourue'
                      : lang === 'es'
                      ? 'Los traslados de 3h se basan en la distancia recorrida'
                      : '3-Hour transfers are based on distance travelled'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium pl-6">
                  {lang === 'ja'
                    ? '（他県への送迎・長距離移動をご希望の場合はWhatsAppよりお問い合わせください）'
                    : lang === 'zh'
                    ? '（跨县/跨都道府县接送请通过 WhatsApp 咨询）'
                    : lang === 'fr'
                    ? '(en cas de transfert vers une autre préfecture, veuillez vous renseigner via WhatsApp)'
                    : lang === 'es'
                    ? '(en caso de traslado a otra prefectura consulte por WhatsApp)'
                    : '(in case of transfer to a different prefecture inquire through WhatsApp)'}
                </p>
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
          6. HANEDA AIRPORT TERMINAL PICK-UP & DROP-OFF GUIDE
             (Extracted from official tokyo-haneda.com/en/access/taxi/index.html)
          ══════════════════════════════════════════════════ */}
      <section id="haneda-access-guide" className="py-14 sm:py-20 bg-white dark:bg-[#0E131F] border-t border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-xs font-bold px-3.5 py-1.5 rounded-full mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.hndPointsTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              {t.hndPointsHead}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
              {t.hndPointsSub}
            </p>
          </div>

          {/* Terminal Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-[#E5E8ED] dark:border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setSelectedHndTerminal('t3')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedHndTerminal === 't3'
                  ? 'bg-[#0068FF] text-white shadow-md'
                  : 'bg-[#F5F7FA] dark:bg-[#131b2c] text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED] dark:hover:bg-slate-800'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-black">T3</span>
              <span>{lang === 'ja' ? '第3ターミナル (国際線)' : lang === 'zh' ? '第3航站楼 (国际线)' : lang === 'fr' ? 'Terminal 3 (International)' : lang === 'es' ? 'Terminal 3 (Internacional)' : 'Terminal 3 (International)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedHndTerminal('t2')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedHndTerminal === 't2'
                  ? 'bg-[#0068FF] text-white shadow-md'
                  : 'bg-[#F5F7FA] dark:bg-[#131b2c] text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED] dark:hover:bg-slate-800'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-black">T2</span>
              <span>{lang === 'ja' ? '第2ターミナル (ANA / 国内・国際)' : lang === 'zh' ? '第2航站楼 (ANA 国内/国际)' : lang === 'fr' ? 'Terminal 2 (ANA)' : lang === 'es' ? 'Terminal 2 (ANA)' : 'Terminal 2 (ANA Dom/Int)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedHndTerminal('t1')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedHndTerminal === 't1'
                  ? 'bg-[#0068FF] text-white shadow-md'
                  : 'bg-[#F5F7FA] dark:bg-[#131b2c] text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED] dark:hover:bg-slate-800'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-black">T1</span>
              <span>{lang === 'ja' ? '第1ターミナル (JAL / 国内線)' : lang === 'zh' ? '第1航站楼 (JAL 国内线)' : lang === 'fr' ? 'Terminal 1 (JAL)' : lang === 'es' ? 'Terminal 1 (JAL)' : 'Terminal 1 (JAL Domestic)'}</span>
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Terminal 3 View */}
            {selectedHndTerminal === 't3' && (
              <>
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                          ARR
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.pickupLabel} &bull; Terminal 3
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '1階 タクシー・ハイヤー乗降レーン & 2階 到着ロビー' : lang === 'zh' ? '1楼 出租车/专车乘车道 & 2楼 到达大厅' : lang === 'fr' ? '1F Voie Taxis & Chauffeurs / 2F Hall des Arrivées' : lang === 'es' ? '1F Carril Taxis y Chóferes / 2F Sala de Llegadas' : '1F Taxi/Chauffeur Lane & 2F Arrival Lobby'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {lang === 'ja' ? '到着・お迎え' : lang === 'zh' ? '接机迎宾' : lang === 'fr' ? 'Arrivée' : lang === 'es' ? 'Llegada' : 'Arrival Pick-up'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0068FF] dark:text-[#3B82F6]">
                          <Sparkles className="w-4 h-4 text-[#C5A059]" />
                          <span>{lang === 'ja' ? 'SK Limo VIP 専用お出迎え（2階 到着ロビー）' : lang === 'zh' ? 'SK Limo VIP 专车举牌迎宾点（2楼到达大厅）' : lang === 'fr' ? 'Accueil VIP SK Limo (Hall 2F Arrivées)' : lang === 'es' ? 'Bienvenida VIP SK Limo (Llegadas 2F)' : 'SK Limo VIP Name-Board Meeting (2F Arrival Lobby)'}</span>
                        </div>
                        <p className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-relaxed pl-6">
                          {lang === 'ja'
                            ? '税関出口を出てすぐ正面のインフォメーションカウンター付近にて、専任ドライバーがお名前入りサインボードを掲げてお待ちし、2階アクセスホール・エレベーター経由で1階専用車レーンへご案内します。'
                            : lang === 'zh'
                            ? '走出海关出口，专车司机将在正前方问讯台旁手持您的专属姓名牌迎候，并协助行李通过2楼中庭电梯直达1楼专属车道。'
                            : lang === 'fr'
                            ? 'Dès la sortie de la douane, votre chauffeur vous attend avec une pancarte nominative devant le comptoir d\'information, puis vous escorte vers la voie 1F.'
                            : lang === 'es'
                            ? 'Al salir de la aduana, su chófer le esperará con un cartel personalizado frente al mostrador de información y le acompañará al carril 1F.'
                            : 'Directly outside the customs exit, in front of the Information Counter, your chauffeur awaits with a personalized name-board before escorting you via 2F Access Hall elevators to the 1F private vehicle lane.'}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '1階 タクシー乗り場 (第2レーン)' : lang === 'zh' ? '1楼 官方出租车乘车道 (第2车道)' : lang === 'fr' ? '1F Station de Taxis (Voie 2)' : lang === 'es' ? '1F Parada de Taxis (Carril 2)' : '1F Taxi Stand (Lane 2)'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? '・21番乗り場：一般タクシー & 優良・ホスピタリティタクシー乗り場'
                            : lang === 'zh'
                            ? '・21号乘车站：标准出租车及优质接待出租车（外国人友好）'
                            : lang === 'fr'
                            ? '・Arrêt 21 : Taxis réguliers et Taxis de Service d\'Excellence'
                            : lang === 'es'
                            ? '・Parada 21: Taxis regulares y Taxis de Servicio de Excelencia'
                            : '・Stop 21: Standard Taxis & Excellent Service / Hospitality Taxis'}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? 'アプリ配車・予約タクシー乗り場（P5駐車場 8階）' : lang === 'zh' ? 'App 网约车与预约乘车站（P5 停车场 8楼）' : lang === 'fr' ? 'Taxis sur Application & Réservés (Parking P5 - 8ème étage)' : lang === 'es' ? 'Taxis por App y Reservados (Parking P5 - Planta 8)' : 'App-Hailing & Reserved Taxi Stand (P5 Parking - 8th Floor)'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? '配車アプリ（GO・Uber等）で手配された車両はP5駐車場の8階乗降エリアをご利用いただきます。'
                            : lang === 'zh'
                            ? '通过打车软件（GO、Uber 等）呼叫的网约车请前往 P5 停车场 8 楼指定乘车区。'
                            : lang === 'fr'
                            ? 'Les véhicules commandés via application (Uber, GO) sont situés au 8e étage du parking P5.'
                            : lang === 'es'
                            ? 'Los vehículos solicitados por app (Uber, GO) se ubican en la 8ª planta del parking P5.'
                            : 'Vehicles dispatched via ride-hailing apps operate from the dedicated 8th floor zone of the P5 Parking structure.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'ja' ? '手荷物カートのまま乗車レーンまでスムーズに移動可能です' : lang === 'zh' ? '可直接推行李手推车至乘车道' : lang === 'fr' ? 'Accès direct avec chariots à bagages' : lang === 'es' ? 'Acceso directo con carritos de equipaje' : 'Luggage carts can be pushed directly to the boarding lane'}</span>
                  </div>
                </div>

                {/* Drop-off T3 */}
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0068FF] dark:text-blue-400 flex items-center justify-center font-black text-xs">
                          DEP
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.dropoffLabel} &bull; Terminal 3
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '3階 国際線出発ロビー専用 車寄せレーン' : lang === 'zh' ? '3楼 国际线出发大厅专属落客道' : lang === 'fr' ? '3F Voie Dépose-Minute Départs Internationaux' : lang === 'es' ? '3F Carril de Salidas Internacionales' : '3F International Departure Curbside Drop-Off Lane'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#0068FF] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {lang === 'ja' ? '出発・お送り' : lang === 'zh' ? '送机落客' : lang === 'fr' ? 'Départ' : lang === 'es' ? 'Salida' : 'Departure Drop-off'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '3階 出発チェックインカウンター直結' : lang === 'zh' ? '直达3楼国际航班值机大厅' : lang === 'fr' ? 'Accès direct aux banques d\'enregistrement 3F' : lang === 'es' ? 'Acceso directo a mostradores de facturación 3F' : 'Direct Access to 3F International Check-in Desks'}
                        </span>
                        <p className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-relaxed">
                          {lang === 'ja'
                            ? 'ホテルまたはご指定地から出発階（3階）の車寄せレーンに直接横付けいたします。車両を降りて自動ドアをくぐれば、各社航空会社チェックインカウンターおよび保安検査場が目の前に広がります。'
                            : lang === 'zh'
                            ? '专车将直接送达3楼国际出发层落客车道。下车步入大厅即是各大国际航空公司值机岛及安检通道，免去搬运笨重行李走长坡或电梯之苦。'
                            : lang === 'fr'
                            ? 'Votre chauffeur vous dépose directement sur la voie minute du 3e étage devant les comptoirs d\'enregistrement et la sécurité.'
                            : lang === 'es'
                            ? 'Su chófer le dejará directamente en la acera de salidas del 3er piso frente a los mostradores de facturación y control de seguridad.'
                            : 'Your chauffeur pulls up directly to the 3F curbside departure lane. Stepping through the glass doors places you right at the airline check-in counters and security gates with zero stairs or lifts required.'}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '手荷物アシスト＆ドアマン対応' : lang === 'zh' ? '全程行李搬运与尊贵礼遇' : lang === 'fr' ? 'Assistance bagages & Service Chauffeur' : lang === 'es' ? 'Asistencia con equipaje y servicio de cortesía' : 'Luggage Offloading Assistance'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? 'トランクからのスーツケース積み下ろしは全てドライバーが行います。カートへの積載もお手伝いいたします。'
                            : lang === 'zh'
                            ? '司机将负责将所有大件行李由后备箱搬卸并协助装载至机场手推车上。'
                            : lang === 'fr'
                            ? 'Votre chauffeur décharge l\'ensemble de vos valises et vous assiste avec les chariots.'
                            : lang === 'es'
                            ? 'El chófer descargará todo el equipaje y le ayudará a colocarlo en carritos.'
                            : 'Your chauffeur unloads all suitcases from the vehicle trunk and assists in placing them onto airport baggage trolleys.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                    <span>{lang === 'ja' ? '国際線チェックイン開始時刻（出発2.5〜3時間前到着推奨）' : lang === 'zh' ? '建议于航班起飞前 2.5 至 3 小时抵达航站楼' : lang === 'fr' ? 'Arrivée recommandée 2h30 à 3h avant le décollage' : lang === 'es' ? 'Llegada recomendada 2.5 a 3 horas antes del vuelo' : 'Recommended arrival: 2.5 to 3 hours prior to international departures'}</span>
                  </div>
                </div>
              </>
            )}

            {/* Terminal 2 View */}
            {selectedHndTerminal === 't2' && (
              <>
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                          ARR
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.pickupLabel} &bull; Terminal 2
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '1階 到着ロビー & 2階 予約タクシー乗り場' : lang === 'zh' ? '1楼 到达大厅 & 2楼 预约出租车站' : lang === 'fr' ? '1F Arrivées & 2F Taxis Réservés' : lang === 'es' ? '1F Llegadas y 2F Taxis Reservados' : '1F Arrival Lobby & 2F Reserved Taxi Stands'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {lang === 'ja' ? 'ANA 国内・国際線' : lang === 'zh' ? 'ANA 国内/国际' : lang === 'fr' ? 'ANA Dom & Int' : lang === 'es' ? 'ANA Nac e Int' : 'ANA Domestic & Int'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '1階 ハイヤー・タクシー乗り場' : lang === 'zh' ? '1楼 专车/包车/出租车站台' : lang === 'fr' ? '1F Taxis Privés & Chauffeurs' : lang === 'es' ? '1F Taxis Privados y Chóferes' : '1F Private Taxi & Chauffeur Stands'}
                        </span>
                        <ul className="text-[11px] text-[#4B5563] dark:text-slate-300 space-y-1 list-disc list-inside">
                          <li><strong>{lang === 'ja' ? '1番乗り場：' : lang === 'zh' ? '1号站台：' : lang === 'fr' ? 'Arrêt 1 : ' : lang === 'es' ? 'Parada 1: ' : 'Stop 1: '}</strong>{lang === 'ja' ? 'ハイヤー専用（専任配車）' : lang === 'zh' ? '高级商务车/专车专用（ハイヤー）' : lang === 'fr' ? 'Chauffeurs Privés & VTC' : lang === 'es' ? 'Chóferes Privados' : 'Private Reserved Chauffeur / Hire Cars'}</li>
                          <li><strong>{lang === 'ja' ? '2番・20番乗り場：' : lang === 'zh' ? '2号/20号站台：' : lang === 'fr' ? 'Arrêts 2 & 20 : ' : lang === 'es' ? 'Paradas 2 & 20: ' : 'Stops 2 & 20: '}</strong>{lang === 'ja' ? '神奈川方面（川崎・横浜・横須賀・三浦）' : lang === 'zh' ? '神奈川方向（川崎、横滨、横须贺、三浦）' : lang === 'fr' ? 'Direction Kanagawa / Yokohama' : lang === 'es' ? 'Dirección Kanagawa / Yokohama' : 'For Kanagawa, Yokohama, Yokosuka & Miura'}</li>
                          <li><strong>{lang === 'ja' ? '3番・19番乗り場：' : lang === 'zh' ? '3号/19号站台：' : lang === 'fr' ? 'Arrêts 3 & 19 : ' : lang === 'es' ? 'Paradas 3 & 19: ' : 'Stops 3 & 19: '}</strong>{lang === 'ja' ? '東京都内（23区）およびその他方面' : lang === 'zh' ? '东京都内（23区）及其他各区域' : lang === 'fr' ? 'Direction Tokyo 23 arrondissements' : lang === 'es' ? 'Dirección Tokio 23 distritos' : 'For Tokyo 23 Wards & All Other Areas'}</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '2階 出発階 アプリ配車・予約タクシー乗り場（2番出口付近）' : lang === 'zh' ? '2楼 出发层 App 网约车与预约站台（2号出口附近）' : lang === 'fr' ? '2F Taxis App & Réservés (Près de la Sortie 2)' : lang === 'es' ? '2F Taxis App y Reservados (Cerca de Salida 2)' : '2F Departure Level App/Reserved Taxi Stand (Near Exit 2)'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? '羽田空港公式新設のアプリ配車・予約タクシー専用乗り場（2階2番出口周辺）からスムーズにご乗車いただけます。'
                            : lang === 'zh'
                            ? '羽田机场2楼出发层2号出口旁新设专用网约车与预约专车站台。'
                            : lang === 'fr'
                            ? 'Nouvelle station réservée aux taxis d\'application située au niveau départs 2F près de la sortie 2.'
                            : lang === 'es'
                            ? 'Nueva parada para taxis por app y reservados en el nivel de salidas 2F junto a la salida 2.'
                            : 'Dedicated boarding zone for app-dispatched and reserved vehicles installed near Exit 2 on the 2nd floor departure concourse.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'ja' ? 'ANA便（国内線・国際線）のお客様に最適です' : lang === 'zh' ? '完美适配 ANA 全日空国内与国际航班旅客' : lang === 'fr' ? 'Idéal pour tous les vols ANA (Nationaux et Internationaux)' : lang === 'es' ? 'Ideal para vuelos ANA (Nacionales e Internacionales)' : 'Optimized for ANA Domestic & International travelers'}</span>
                  </div>
                </div>

                {/* Drop-off T2 */}
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0068FF] dark:text-blue-400 flex items-center justify-center font-black text-xs">
                          DEP
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.dropoffLabel} &bull; Terminal 2
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '2階 国内線出発レーン & 3階 国際線出発レーン' : lang === 'zh' ? '2楼 国内线出发道 & 3楼 国际线出发道' : lang === 'fr' ? '2F Départs Nationaux / 3F Départs Internationaux' : lang === 'es' ? '2F Salidas Nacionales / 3F Salidas Internacionales' : '2F Domestic & 3F International Departure Curbsides'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#0068FF] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {lang === 'ja' ? '出発・お送り' : lang === 'zh' ? '送机落客' : lang === 'fr' ? 'Départ' : lang === 'es' ? 'Salida' : 'Departure Drop-off'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '国内線・国際線それぞれの専用出発レーンへ直行' : lang === 'zh' ? '分流直达国内线2楼或国际线3楼落客区' : lang === 'fr' ? 'Dépose dédiée selon vol national (2F) ou international (3F)' : lang === 'es' ? 'Llegada dedicada según vuelo nacional (2F) o internacional (3F)' : 'Direct Drop-Off to Domestic (2F) or International (3F) Levels'}
                        </span>
                        <p className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-relaxed">
                          {lang === 'ja'
                            ? 'ANA国内線、AIRDO、ソラシドエアをご利用のお客様は2階出発コンコースへ、ANA国際線をご利用のお客様は3階出発コンコースへ直接車寄せいたします。'
                            : lang === 'zh'
                            ? '搭乘 ANA 国内线、AIRDO、Solaseed Air 的旅客将送达 2 楼出发大厅；搭乘 ANA 国际线的旅客将直接送达 3 楼国际出发大厅。'
                            : lang === 'fr'
                            ? 'Dépose directe au 2F pour les vols nationaux ANA/AirDo/Solaseed, et au 3F pour les vols internationaux ANA.'
                            : lang === 'es'
                            ? 'Bajada directa en 2F para vuelos nacionales ANA/AirDo/Solaseed, y en 3F para vuelos internacionales ANA.'
                            : 'Passengers for ANA domestic, AIRDO, and Solaseed Air are dropped off directly at 2F concourse; ANA international departures are dropped off at 3F concourse.'}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? 'ターミナル直結ドア横付け' : lang === 'zh' ? '紧邻出发大门与行李托运柜台' : lang === 'fr' ? 'Accès direct aux portes d\'enregistrement' : lang === 'es' ? 'Acceso directo a las puertas de facturación' : 'Direct Curbside Entrance'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? 'お荷物を持った移動距離を最小限に抑え、チェックインカウンターへ直行いただけます。'
                            : lang === 'zh'
                            ? '最小化步行与搬运距离，直达值机与托运柜台。'
                            : lang === 'fr'
                            ? 'Minimise la distance de marche pour un confort maximal.'
                            : lang === 'es'
                            ? 'Minimiza la distancia a pie para una máxima comodidad.'
                            : 'Minimizes walking distances with luggage directly to check-in queues.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                    <span>{lang === 'ja' ? '国内線は出発1時間前、国際線は2.5時間前の到着が目安です' : lang === 'zh' ? '国内线建议起飞前1小时、国际线前2.5小时到达' : lang === 'fr' ? 'Arrivée conseillée : 1h avant (domestique) / 2h30 (international)' : lang === 'es' ? 'Llegada aconsejada: 1h antes (nacional) / 2h30 (internacional)' : 'Recommended: 1h prior for domestic, 2.5h for international'}</span>
                  </div>
                </div>
              </>
            )}

            {/* Terminal 1 View */}
            {selectedHndTerminal === 't1' && (
              <>
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                          ARR
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.pickupLabel} &bull; Terminal 1
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '1階 到着ロビー & 2階 予約タクシー乗り場' : lang === 'zh' ? '1楼 到达大厅 & 2楼 预约出租车站' : lang === 'fr' ? '1F Arrivées & 2F Taxis Réservés' : lang === 'es' ? '1F Llegadas y 2F Taxis Reservados' : '1F Arrival Lobby & 2F Reserved Taxi Stands'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {lang === 'ja' ? 'JAL・スカイマーク・SFJ' : lang === 'zh' ? 'JAL / 天空航空 / 星悦航空' : lang === 'fr' ? 'JAL / Skymark / StarFlyer' : lang === 'es' ? 'JAL / Skymark / StarFlyer' : 'JAL / Skymark / StarFlyer'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '1階 ハイヤー・タクシー乗り場' : lang === 'zh' ? '1楼 专车/包车/出租车站台' : lang === 'fr' ? '1F Taxis Privés & Chauffeurs' : lang === 'es' ? '1F Taxis Privados y Chóferes' : '1F Private Taxi & Chauffeur Stands'}
                        </span>
                        <ul className="text-[11px] text-[#4B5563] dark:text-slate-300 space-y-1 list-disc list-inside">
                          <li><strong>{lang === 'ja' ? '0番・19番乗り場：' : lang === 'zh' ? '0号/19号站台：' : lang === 'fr' ? 'Arrêts 0 & 19 : ' : lang === 'es' ? 'Paradas 0 & 19: ' : 'Stops 0 & 19: '}</strong>{lang === 'ja' ? 'ハイヤー専用乗り場（専任配車）' : lang === 'zh' ? '高级商务车/专车专用（ハイヤー）' : lang === 'fr' ? 'Chauffeurs Privés Réservés' : lang === 'es' ? 'Chóferes Privados Reservados' : 'Reserved Chauffeur Hire Cars'}</li>
                          <li><strong>{lang === 'ja' ? '1番・17番乗り場：' : lang === 'zh' ? '1号/17号站台：' : lang === 'fr' ? 'Arrêts 1 & 17 : ' : lang === 'es' ? 'Paradas 1 & 17: ' : 'Stops 1 & 17: '}</strong>{lang === 'ja' ? '神奈川方面（川崎・横浜・横須賀・三浦）' : lang === 'zh' ? '神奈川方向（川崎、横滨、横须贺、三浦）' : lang === 'fr' ? 'Direction Kanagawa / Yokohama' : lang === 'es' ? 'Dirección Kanagawa / Yokohama' : 'For Kanagawa, Yokohama, Yokosuka & Miura'}</li>
                          <li><strong>{lang === 'ja' ? '2番・18番乗り場：' : lang === 'zh' ? '2号/18号站台：' : lang === 'fr' ? 'Arrêts 2 & 18 : ' : lang === 'es' ? 'Paradas 2 & 18: ' : 'Stops 2 & 18: '}</strong>{lang === 'ja' ? '東京都内（23区）およびその他方面' : lang === 'zh' ? '东京都内（23区）及其他各区域' : lang === 'fr' ? 'Direction Tokyo 23 arrondissements' : lang === 'es' ? 'Dirección Tokio 23 distritos' : 'For Tokyo 23 Wards & All Other Areas'}</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '2階 出発階 アプリ配車・予約タクシー乗り場（7番出口付近）' : lang === 'zh' ? '2楼 出发层 App 网约车与预约站台（7号出口附近）' : lang === 'fr' ? '2F Taxis App & Réservés (Près de la Sortie 7)' : lang === 'es' ? '2F Taxis App y Reservados (Cerca de Salida 7)' : '2F Departure Level App/Reserved Taxi Stand (Near Exit 7)'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? '羽田空港公式新設のアプリ配車・予約タクシー専用乗り場（2階7番出口周辺）からスムーズにご乗車いただけます。'
                            : lang === 'zh'
                            ? '羽田机场2楼出发层7号出口旁新设专用网约车与预约专车站台。'
                            : lang === 'fr'
                            ? 'Nouvelle station réservée aux taxis d\'application située au niveau départs 2F près de la sortie 7.'
                            : lang === 'es'
                            ? 'Nueva parada para taxis por app y reservados en el nivel de salidas 2F junto a la salida 7.'
                            : 'Dedicated boarding zone for app-dispatched and reserved vehicles installed near Exit 7 on the 2nd floor departure concourse.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'ja' ? 'JAL（日本航空）国内線ご利用のお客様に最適です' : lang === 'zh' ? 'JAL 日本航空国内线抵达旅客首选' : lang === 'fr' ? 'Parfait pour les arrivées nationales JAL' : lang === 'es' ? 'Perfecto para llegadas nacionales JAL' : 'Optimized for JAL Japan Airlines domestic arrivals'}</span>
                  </div>
                </div>

                {/* Drop-off T1 */}
                <div className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0068FF] dark:text-blue-400 flex items-center justify-center font-black text-xs">
                          DEP
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">
                            {t.dropoffLabel} &bull; Terminal 1
                          </h3>
                          <span className="text-[11px] text-[#6B7280] dark:text-slate-400">
                            {lang === 'ja' ? '2階 出発ロビー（北ウイング・南ウイング）車寄せレーン' : lang === 'zh' ? '2楼 出发大厅（北翼/南翼）车道落客区' : lang === 'fr' ? '2F Dépose Départs (Ailes Nord & Sud)' : lang === 'es' ? '2F Salidas (Alas Norte y Sur)' : '2F Departure Lobby Curbside (North & South Wings)'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#0068FF] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {lang === 'ja' ? '出発・お送り' : lang === 'zh' ? '送机落客' : lang === 'fr' ? 'Départ' : lang === 'es' ? 'Salida' : 'Departure Drop-off'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? '行き先ウイング（北／南）に合わせた正確な車寄せ' : lang === 'zh' ? '根据航班目的地（北翼/南翼）精准靠门停泊' : lang === 'fr' ? 'Positionnement exact selon aile Nord ou Sud' : lang === 'es' ? 'Posicionamiento exacto según ala Norte o Sur' : 'Exact Curbside Alignment for North or South Wings'}
                        </span>
                        <p className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-relaxed">
                          {lang === 'ja'
                            ? '北海道・東北・北陸方面（北ウイング）または関西・中国・四国・九州・沖縄方面（南ウイング）のご搭乗便に合わせて、最適な2階出発口の真横に横付けいたします。'
                            : lang === 'zh'
                            ? '司机将根据您的航班航向（北海道/东北/北陆方向停北翼，关西/四国/九州/冲绳方向停南翼），精准停靠在最便捷的2楼出发大门前。'
                            : lang === 'fr'
                            ? 'Votre chauffeur s\'arrête pile devant l\'aile Nord (Hokkaido/Tohoku) ou Sud (Kansai/Kyushu/Okinawa) correspondant à votre vol.'
                            : lang === 'es'
                            ? 'Su chófer se detendrá exactamente frente al ala Norte (Hokkaido/Tohoku) o Sur (Kansai/Kyushu/Okinawa) de su vuelo.'
                            : 'Your chauffeur navigates directly to the optimal curbside door matching your destination wing (North Wing for Hokkaido/Tohoku; South Wing for Kansai/Kyushu/Okinawa).'}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">
                          {lang === 'ja' ? 'JALスマイルサポート・プレミアムチェックイン至近' : lang === 'zh' ? '紧邻 JAL 贵宾值机及常规值机通道' : lang === 'fr' ? 'Accès direct enregistrement VIP JAL' : lang === 'es' ? 'Acceso directo facturación VIP JAL' : 'Close to JAL Priority & General Check-in'}
                        </span>
                        <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                          {lang === 'ja'
                            ? 'トランクからの荷物降ろしをドライバーがサポートし、スムーズな保安検査通過をアシストします。'
                            : lang === 'zh'
                            ? '专属司机协助装卸所有行李，助您轻松通过安检登机。'
                            : lang === 'fr'
                            ? 'Déchargement complet de vos bagages pour un enregistrement fluide.'
                            : lang === 'es'
                            ? 'Descarga completa de su equipaje para una facturación fluida.'
                            : 'Driver handles all luggage offloading for a seamless transition into security.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#0068FF] shrink-0" />
                    <span>{lang === 'ja' ? '国内線は出発1時間前の到着を推奨いたします' : lang === 'zh' ? '国内航班建议于起飞前1小时抵达' : lang === 'fr' ? 'Arrivée conseillée 1h avant le départ' : lang === 'es' ? 'Llegada aconsejada 1h antes de la salida' : 'Recommended arrival: 1 hour prior to domestic flight departure'}</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Official Tokyo Haneda Source Link Callout */}
          <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0068FF]/10 text-[#0068FF] flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white">
                  {lang === 'ja' ? '羽田空港旅客ターミナル 公式アクセス情報連携' : lang === 'zh' ? '羽田空港官方航站楼交通指引同步' : lang === 'fr' ? 'Informations Officielles de l\'Aéroport de Haneda' : lang === 'es' ? 'Información Oficial del Aeropuerto de Haneda' : 'Tokyo Haneda International Airport Official Access Reference'}
                </h4>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  {lang === 'ja'
                    ? '国土交通省認可定額運賃 & 首都高速道路直結の快適なドア・ツー・ドア送迎をご提供しています。'
                    : lang === 'zh'
                    ? '遵循国土交通省核准一口价标准，经首都高速公路直达东京各大酒店，尊享点对点私密接送。'
                    : lang === 'fr'
                    ? 'Tarifs fixes certifiés MLIT via le réseau express Shuto pour un transfert direct porte-à-porte.'
                    : lang === 'es'
                    ? 'Tarifas fijas certificadas por el MLIT vía Shuto Expressway para un traslado puerta a puerta.'
                    : 'All transfers operate with MLIT-approved rates and direct Shuto Expressway access for true door-to-door comfort.'}
                </p>
              </div>
            </div>

            <a
              href="https://tokyo-haneda.com/en/access/taxi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#0E131F] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0068FF] dark:text-[#3B82F6] border border-[#0068FF]/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              <span>{t.officialSourceNote}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. BOTTOM CALL TO ACTION
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
