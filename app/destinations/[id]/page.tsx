'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Car,
  AlertCircle,
  CheckCircle2,
  Compass,
  X,
  Lock,
} from 'lucide-react';
import { DETAILED_DESTINATIONS, DetailedDestination, MULTILINGUAL_DESTINATIONS } from '@/lib/destinations-data';
import { TRANSLATIONS } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';
import StripePaymentModal from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import { saveUserRequest } from '@/lib/firebase';

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const slug = decodeURIComponent(resolvedParams?.id || '');
  const destination: DetailedDestination | undefined =
    DETAILED_DESTINATIONS[slug] ||
    DETAILED_DESTINATIONS[slug.toLowerCase()] ||
    Object.values(DETAILED_DESTINATIONS).find((d) => d.slug === slug || d.id === slug);

  if (!destination) {
    notFound();
  }

  const [lang] = useLanguage();

  // Vehicle selection: Alphard (4 pax), Granace (5 pax), HiAce (9 pax)
  const [vehicle, setVehicle] = useState<'alphard' | 'granace' | 'hiace'>('granace');
  const [passengers, setPassengers] = useState<number>(4);
  const [luggage, setLuggage] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Consultation & Stripe Modal State
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);

  // Multilingual dynamic fallback
  const mlData = (lang === 'zh' || lang === 'fr' || lang === 'es')
    ? MULTILINGUAL_DESTINATIONS[destination.id]?.[lang]
    : undefined;

  const destName = mlData?.name || (lang === 'ja' ? destination.nameJa : destination.name);
  const destCategory = mlData?.category || (lang === 'ja' ? destination.categoryJa : destination.category);
  const destTag = mlData?.tag || (lang === 'ja' ? destination.tagJa : destination.tag);
  const destOverview = mlData?.overview || (lang === 'ja' ? destination.overviewJa : destination.overview);
  const destHighlights = mlData?.whyChooseThis || (lang === 'ja' ? destination.whyChooseThisJa : destination.whyChooseThis);
  const destInclusions = mlData?.inclusions || (lang === 'ja' ? destination.inclusionsJa : destination.inclusions);
  const destExclusions = mlData?.exclusions || (lang === 'ja' ? destination.exclusionsJa : destination.exclusions);

  // Dynamic Pricing Model: Base Vehicle Fee + Per-Person Fee (+15% overall increase applied)
  // Alphard and Granace provide superior VIP luxury tiers; Minimum guaranteed ¥40,000+
  const baseTourRate = Math.round((destination.granacePrice || 85000) * 1.15 / 1000) * 1000;

  const calculateDynamicPrice = (vKey: 'alphard' | 'granace' | 'hiace', riderCount: number) => {
    let baseFee = 75000;
    let perPersonFee = 6000;

    if (vKey === 'alphard') {
      baseFee = Math.round(Math.max(58000, baseTourRate - 20000) / 1000) * 1000;
      perPersonFee = 6000;
    } else if (vKey === 'granace') {
      baseFee = Math.round(Math.max(63000, baseTourRate - 15000) / 1000) * 1000;
      perPersonFee = 6000;
    } else if (vKey === 'hiace') {
      baseFee = Math.round(Math.max(52000, baseTourRate - 25000) / 1000) * 1000;
      perPersonFee = 3500;
    }

    const calculated = baseFee + perPersonFee * Math.max(1, riderCount);
    return Math.max(40000, calculated);
  };

  // Selected Vehicle Config with Real-Time Dynamic Pricing (+15%)
  const vehicleConfig = {
    alphard: {
      name: 'Toyota Alphard Executive',
      nameJa: 'トヨタ アルファード',
      maxPax: 4,
      maxLuggage: 4,
      baseFee: Math.round(Math.max(58000, baseTourRate - 20000) / 1000) * 1000,
      perPersonFee: 6000,
      price: calculateDynamicPrice('alphard', passengers),
      priceFormatted: `¥${calculateDynamicPrice('alphard', passengers).toLocaleString()}`,
      desc: lang === 'ja' ? 'VIPオットマンシート、静粛性と最高級の乗り心地' : 'VIP Ottoman recliners, unparalleled luxury & whisper quietness',
      img: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
    },
    granace: {
      name: 'Toyota Granace Premium Lounge',
      nameJa: 'トヨタ グランエース',
      maxPax: 5,
      maxLuggage: 4,
      baseFee: Math.round(Math.max(63000, baseTourRate - 15000) / 1000) * 1000,
      perPersonFee: 6000,
      price: calculateDynamicPrice('granace', passengers),
      priceFormatted: `¥${calculateDynamicPrice('granace', passengers).toLocaleString()}`,
      desc: lang === 'ja' ? '本革キャプテンシート、広々とした室内空間' : 'VIP Leather Captain Chairs with spacious interior lounge',
      img: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
    },
    hiace: {
      name: 'Toyota HiAce Grand Cabin',
      nameJa: 'トヨタ ハイエース グランドキャビン',
      maxPax: 9,
      maxLuggage: 9,
      baseFee: Math.round(Math.max(52000, baseTourRate - 25000) / 1000) * 1000,
      perPersonFee: 3500,
      price: calculateDynamicPrice('hiace', passengers),
      priceFormatted: `¥${calculateDynamicPrice('hiace', passengers).toLocaleString()}`,
      desc: lang === 'ja' ? '最大9名様ご乗車、大量のスーツケースやお荷物に対応' : 'Spacious Grand Cabin for up to 9 guests and massive luggage space',
      img: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
    },
  };

  const currentVeh = vehicleConfig[vehicle];

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultSubmitting(true);

    try {
      await saveUserRequest({
        serviceType: 'day_tour',
        destination: destName,
        destinationId: destination.id,
        pickup: consultNotes || 'Central Tokyo Hotel',
        vehicleType: vehicle.toUpperCase(),
        passengers: passengers,
        luggageCount: luggage,
        travelDate: travelDate,
        totalPrice: currentVeh.price,
        currency: 'JPY',
        clientName: consultName,
        clientEmail: consultEmail,
        clientPhone: consultPhone,
        notes: consultNotes,
        channel: 'web_inquiry',
        status: 'new',
      });
    } catch (err) {
      console.warn('Error saving inquiry:', err);
    }

    setIsConsultSubmitting(false);
    setConsultSuccess(true);
    setTimeout(() => {
      setIsConsultModalOpen(false);
      setConsultSuccess(false);
    }, 2500);
  };

  const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleProceedToStripe = () => {
    if (!consultName.trim() || !consultEmail.trim()) {
      setValidationError(
        lang === 'ja' ? 'お名前とメールアドレスをご入力ください。' : 'Please enter your name and email address to proceed.'
      );
      return;
    }
    if (!isConfirmedAgreement) {
      setValidationError(
        lang === 'ja'
          ? 'お支払い前に同意のチェックボックスを選択してください。'
          : 'Please check the mandatory confirmation box below before proceeding.'
      );
      return;
    }
    setValidationError(null);
    setIsConsultModalOpen(false);
    setIsStripeModalOpen(true);
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am inquiring about the private day tour to ${destination.name} (${destination.charterHours}) for ${passengers} guests (Total: ${currentVeh.priceFormatted}) on ${travelDate} with ${currentVeh.name}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-[#C5A059] selection:text-[#0A0D14]">
      
      {/* Universal Shared Header */}
      <SiteHeader activePage="sightseeing" />

      {/* Hero Section with Breadcrumb */}
      <div className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 bg-[#0A0D14] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/tours" className="hover:text-[#C5A059] transition-colors">
              {lang === 'ja' ? 'ホーム' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/destinations" className="hover:text-[#C5A059] transition-colors">
              {lang === 'ja' ? '観光ツアー' : 'Destinations'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{destName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C378] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{destCategory}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                {destName}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {destTag}
              </p>

              {/* Badges / Stats */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-[#0E131F] border border-slate-800 px-3 py-1.5 rounded-xl">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>{destination.charterHours}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0E131F] border border-slate-800 px-3 py-1.5 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>{destination.durationText}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0E131F] border border-slate-800 px-3 py-1.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>{lang === 'ja' ? '緑ナンバー専属ハイヤー' : 'MLIT Licensed Green-Plate'}</span>
                </div>
              </div>
            </div>

            {/* Price Preview Card on Desktop Hero */}
            <div className="lg:col-span-5 bg-[#0E131F] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'ja' ? '貸切チャーター参考料金' : 'Private Day Charter From'}
                </span>
                <span className="bg-[#C5A059]/20 text-[#E5C378] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  All-Inclusive
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">
                  {destination.granacePriceFormatted}
                </span>
                <span className="text-xs text-slate-400">/ {destination.charterHours}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ja'
                  ? '専属プロドライバー・高速道路代・ガソリン代・保険込みの完全定額料金です。'
                  : 'Includes private chauffeur, tolls, fuel, vehicle insurance, and hotel door-to-door pickup.'}
              </p>
              <div className="pt-2 flex gap-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                  <span>WhatsApp Inquiry</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="flex-1 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <span>{lang === 'ja' ? '無料見積・予約' : 'Request Quote'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (Details, Gallery, Itinerary, Highlights) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Gallery Section */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl bg-[#0E131F] border border-slate-800">
                <Image
                  src={destination.galleryImages[activeGalleryIndex] || destination.heroImage}
                  alt={destName}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover transition-all duration-500"
                  priority
                />
              </div>
              {destination.galleryImages.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {destination.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeGalleryIndex === idx ? 'border-[#C5A059] scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${destName} preview ${idx + 1}`} fill sizes="200px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview & Highlights */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5" style={{ fontFamily: 'var(--font-serif)' }}>
                <Compass className="w-5 h-5 text-[#C5A059]" />
                <span>{lang === 'ja' ? 'ツアー概要' : 'Tour Overview'}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {destOverview}
              </p>

              {/* Highlights */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <h3 className="text-sm uppercase font-bold text-[#E5C378] tracking-wider">
                  {lang === 'ja' ? '見どころ・ハイライト' : 'Key Highlights'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destHighlights.map((hl: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 bg-[#0A0D14] border border-slate-800/80 p-3.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Itinerary with Disclaimer */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5" style={{ fontFamily: 'var(--font-serif)' }}>
                  <Calendar className="w-5 h-5 text-[#C5A059]" />
                  <span>{lang === 'ja' ? 'モデルコース・行程表' : 'Suggested Itinerary'}</span>
                </h2>
                <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-3 py-1 rounded-full font-medium">
                  {destination.charterHours}
                </span>
              </div>

              {/* Itinerary Schedule */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#C5A059] before:via-slate-700 before:to-slate-900">
                {destination.itinerary.map((stop, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#C5A059] border-2 border-[#0A0D14] ring-2 ring-[#C5A059]/40" />
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#E5C378]">{stop.time}</span>
                      <span className="text-sm font-bold text-white">{lang === 'ja' ? stop.titleJa : stop.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{lang === 'ja' ? stop.descriptionJa : stop.description}</p>
                  </div>
                ))}
              </div>

              {/* Required Schedule Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ja'
                    ? '※ 上記はモデルコースです。お客様のご希望、当日の交通状況や天候に応じて柔軟に立ち寄り先や滞在時間を変更可能です。'
                    : '* Note: This is an ideal schedule but it may differ according to customer’s wish/weather and traffic condition.'}
                </span>
              </div>
            </div>

            {/* Inclusions & Policies */}
            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5" style={{ fontFamily: 'var(--font-serif)' }}>
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <span>{lang === 'ja' ? '料金に含まれるもの・サービス' : 'Inclusions & Guarantees'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#25D366] block">
                    {lang === 'ja' ? '料金に含まれるもの' : 'Included in Price'}
                  </span>
                  {destInclusions.map((inc: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {lang === 'ja' ? 'お客様実費ご負担' : 'Not Included (Paid On-Site)'}
                  </span>
                  {destExclusions.map((exc: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 ml-1 mr-1" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Price Calculator & Vehicle Selector */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#C5A059] block">
                    {lang === 'ja' ? 'お見積り・プラン選択' : 'Instant Quote & Booking'}
                  </span>
                  <span className="text-base font-bold text-white">{destName}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{destination.charterHours}</span>
              </div>

              {/* 1. Travel Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>{lang === 'ja' ? 'ご利用希望日' : 'Travel Date'}</span>
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-bold focus:border-[#C5A059] focus:outline-none cursor-pointer"
                />
              </div>

              {/* 2. Vehicle Selection (Alphard, Granace, HiAce) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5C378] flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#C5A059]" />
                    <span>{lang === 'ja' ? '配車クラスを選択' : 'Select Vehicle Class'}</span>
                  </label>
                  <span className="text-[10px] text-[#C5A059] font-medium">
                    {lang === 'ja'
                      ? '※ 複数台での運行・コンボイ手配も承ります'
                      : lang === 'zh'
                      ? '※ 亦支持多车车队组合出行'
                      : 'We also offer multiple vehicles'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(['alphard', 'granace', 'hiace'] as const).map((vKey) => {
                    const cfg = vehicleConfig[vKey];
                    const isSelected = vehicle === vKey;
                    return (
                      <button
                        key={vKey}
                        type="button"
                        onClick={() => {
                          setVehicle(vKey);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#C5A059]/15 border-[#C5A059] ring-1 ring-[#C5A059]'
                            : 'bg-[#0A0D14] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0 bg-[#05070B]">
                            <Image src={cfg.img} alt={cfg.name} fill className="object-cover object-[center_35%]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {lang === 'ja' ? cfg.nameJa : cfg.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Max {cfg.maxPax} Pax • {cfg.maxLuggage} Bags
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#C5A059] block">
                            {cfg.priceFormatted}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] text-[#25D366] font-bold">Selected</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Capacity warning when riders exceed Alphard/Granace limits */}
                {passengers > currentVeh.maxPax && (
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-xl p-2.5 text-[11px] text-[#E5C378] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>
                      {lang === 'ja'
                        ? `※ ${currentVeh.name}の定員は最大${currentVeh.maxPax}名様です。${passengers}名様でのご利用は複数台運行またはハイエースのご利用が最適です。（We also offer multiple vehicles）`
                        : `* ${currentVeh.name} max capacity is ${currentVeh.maxPax} guests. We also offer multiple vehicles for larger groups.`}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Passengers & Luggage */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#0A0D14] border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block mb-1">
                    {lang === 'ja' ? 'ご乗車人数' : 'Guests'}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{passengers} Pax</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.min(currentVeh.maxPax, passengers + 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A0D14] border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block mb-1">
                    {lang === 'ja' ? 'お荷物個数' : 'Suitcases'}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{luggage} Bags</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setLuggage(Math.max(0, luggage - 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setLuggage(Math.min(currentVeh.maxLuggage, luggage + 1))}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#0A0D14] border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{lang === 'ja' ? 'チャーター料金総額' : 'Estimated Total'}</span>
                  <span>{destination.charterHours}</span>
                </div>
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#C5A059] font-mono block">
                      {currentVeh.priceFormatted}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'ja'
                        ? `基本料金 ¥${currentVeh.baseFee.toLocaleString()} + ¥${currentVeh.perPersonFee.toLocaleString()} × ${passengers}名`
                        : `Base ¥${currentVeh.baseFee.toLocaleString()} + ¥${currentVeh.perPersonFee.toLocaleString()} × ${passengers} Pax`}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#25D366] font-bold self-start mt-1">税・高速代・燃料費込</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="w-full bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/10 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'ja' ? 'カード事前決済で予約確定 (Stripe)' : 'Instant Card Reserve & Pay (Stripe)'}</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                  <span>WhatsApp 24/7 Concierge</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Official Legal Footer */}
      <SiteFooter />

      {/* Booking & Consultation Modal */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0E131F] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#C5A059] block">
                {lang === 'ja' ? 'ツアー予約・決済' : 'Private Tour Reservation'}
              </span>
              <h3 className="text-xl font-bold text-white">{destName}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentVeh.name} • {passengers} Pax • {travelDate} • <span className="text-[#C5A059] font-bold font-mono">{currentVeh.priceFormatted}</span>
              </p>
            </div>

            {consultSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">
                  {lang === 'ja' ? 'お問い合わせを受け付けました' : 'Inquiry Submitted Successfully'}
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {lang === 'ja'
                    ? '担当コンシェルジュより24時間以内にメールまたはWhatsAppにてご連絡いたします。'
                    : 'Our executive concierge will contact you within 24 hours via email or WhatsApp with your detailed itinerary.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-medium">
                    {lang === 'ja' ? 'お名前 (ローマ字 / 漢字)' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Taro Kitamura / John Smith"
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-medium">
                      {lang === 'ja' ? 'メールアドレス' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-medium">
                      {lang === 'ja' ? 'お電話番号 / WhatsApp' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="+81 80 1234 5678"
                      className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-medium">
                    {lang === 'ja' ? 'ご要望・ホテル送迎先など' : 'Special Requests / Hotel Pickup Address'}
                  </label>
                  <textarea
                    rows={3}
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder={lang === 'ja' ? 'お迎え先ホテル名、立ち寄りたい場所などご記入ください' : 'Hotel name for pickup, custom stops, baby seat requests...'}
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#C5A059] focus:outline-none resize-none"
                  />
                </div>

                {/* Mandatory Confirmation Checkbox */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0A0D14] border border-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isConfirmedAgreement}
                      onChange={(e) => {
                        setIsConfirmedAgreement(e.target.checked);
                        if (validationError) setValidationError(null);
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-[#C5A059] focus:ring-[#C5A059] cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] text-slate-300 leading-tight">
                      {lang === 'ja'
                        ? '旅程内容、ご乗車人数、ホテル住所を確認し、利用規約およびキャンセルポリシーに同意します。'
                        : 'I confirm my tour details, passenger count, and hotel pickup address are correct, and I accept the MLIT licensed charter terms & cancellation policy.'}
                    </span>
                  </label>

                  {validationError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
                      <span className="shrink-0 text-sm">⚠️</span>
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleProceedToStripe}
                    className="w-full bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'ja' ? '即時カード決済へ' : 'Proceed to Stripe Pay'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isConsultSubmitting}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isConsultSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <span>{lang === 'ja' ? '見積り依頼のみ送信' : 'Submit Free Inquiry'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        bookingDetails={{
          bookingType: 'destination',
          destinationId: destination.id,
          destinationTitle: destName,
          vehicle: vehicle,
          vehicleName: currentVeh.name,
          passengers: passengers,
          luggageCount: luggage,
          travelDate: travelDate,
          guestName: consultName || 'Valued Guest',
          guestEmail: consultEmail || 'client@example.com',
          guestPhone: consultPhone || '',
          pickupAddress: consultNotes || 'Central Tokyo Hotel',
          notes: consultNotes,
          amount: currentVeh.price,
          currency: 'jpy',
        }}
        onSuccess={(ref, piId) => {
          setIsStripeModalOpen(false);
          setConfirmedBookingRef(ref);
          setConfirmedPaymentIntentId(piId);
          setIsSuccessModalOpen(true);
        }}
      />

      {/* Booking Confirmation Receipt */}
      <BookingConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        bookingRef={confirmedBookingRef}
        paymentIntentId={confirmedPaymentIntentId}
        bookingDetails={{
          bookingType: 'destination',
          destinationId: destination.id,
          destinationTitle: destName,
          vehicle: vehicle,
          vehicleName: currentVeh.name,
          passengers: passengers,
          luggageCount: luggage,
          travelDate: travelDate,
          guestName: consultName || 'Valued Guest',
          guestEmail: consultEmail || 'client@example.com',
          guestPhone: consultPhone || '',
          pickupAddress: consultNotes || 'Central Tokyo Hotel',
          notes: consultNotes,
          amount: currentVeh.price,
          currency: 'jpy',
        }}
      />

    </div>
  );
}
