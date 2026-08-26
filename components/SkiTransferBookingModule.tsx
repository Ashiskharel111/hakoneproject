'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Car,
  Check,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';

export interface SkiTransferBookingModuleProps {
  initialResort?: string;
  initialPickup?: string;
  initialDate?: string;
  onBackToCatalog?: () => void;
}

interface SkiResort {
  id: string;
  name: { en: string; ja: string; zh: string; fr: string; es: string };
  region: string;
  distanceHours: string;
  basePriceAlphard: number;
  basePriceGranace: number;
  basePriceHiace: number;
  image: string;
}

const SKI_RESORTS: SkiResort[] = [
  {
    id: 'hakuba',
    name: { ja: '白馬バレー (長野)', zh: '白马山谷 (长野)', fr: 'Hakuba Valley (Nagano)', es: 'Hakuba Valley (Nagano)', en: 'Hakuba Valley (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '3.5–4.0 Hours',
    image: '/images/ski-hakuba-hero-4032x3024.jpg',
    basePriceAlphard: 110000,
    basePriceGranace: 115000,
    basePriceHiace: 112000,
  },
  {
    id: 'nozawa',
    name: { ja: '野沢温泉 (長野)', zh: '野泽温泉 (长野)', fr: 'Nozawa Onsen (Nagano)', es: 'Nozawa Onsen (Nagano)', en: 'Nozawa Onsen (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '3.5–4.0 Hours',
    image: '/images/ski-nozawa-hero-4032x3024.jpg',
    basePriceAlphard: 115000,
    basePriceGranace: 120000,
    basePriceHiace: 118000,
  },
  {
    id: 'shigakogen',
    name: { ja: '志賀高原 (長野)', zh: '志贺高原 (长野)', fr: 'Shiga Kogen (Nagano)', es: 'Shiga Kogen (Nagano)', en: 'Shiga Kogen (Nagano)' },
    region: 'Nagano Prefecture',
    distanceHours: '3.5–4.0 Hours',
    image: '/images/ski-shiga-hero-4032x3024.jpg',
    basePriceAlphard: 118000,
    basePriceGranace: 125000,
    basePriceHiace: 122000,
  },
  {
    id: 'yuzawa',
    name: { ja: '越後湯沢・苗場 (新潟)', zh: '越后汤泽・苗场 (新潟)', fr: 'Yuzawa & Naeba (Niigata)', es: 'Yuzawa y Naeba (Niigata)', en: 'Yuzawa & Naeba (Niigata)' },
    region: 'Niigata Prefecture',
    distanceHours: '2.5–3.0 Hours',
    image: '/images/ski-yuzawa-hero-4032x3024.jpg',
    basePriceAlphard: 85000,
    basePriceGranace: 90000,
    basePriceHiace: 88000,
  },
  {
    id: 'myoko',
    name: { ja: '妙高高原 (新潟)', zh: '妙高高原 (新潟)', fr: 'Myoko Kogen (Niigata)', es: 'Myoko Kogen (Niigata)', en: 'Myoko Kogen (Niigata)' },
    region: 'Niigata Prefecture',
    distanceHours: '3.5–4.0 Hours',
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
    image: '/images/ski-karuizawa-hero-4032x3024.jpg',
    basePriceAlphard: 75000,
    basePriceGranace: 80000,
    basePriceHiace: 78000,
  },
];

const VEHICLE_MAX_CAP: Record<string, number> = {
  alphard: 4,
  granace: 5,
  hiace: 9,
};

export default function SkiTransferBookingModule({
  initialResort = 'hakuba',
  initialPickup = 'hnd',
  initialDate,
  onBackToCatalog,
}: SkiTransferBookingModuleProps) {
  const [lang] = useLanguage();

  const [selectedResortId, setSelectedResortId] = useState<string>(initialResort);
  const [pickupPoint, setPickupPoint] = useState<'hnd' | 'nrt' | 'tokyo'>((initialPickup as any) || 'hnd');
  const [selectedVehicle, setSelectedVehicle] = useState<'alphard' | 'granace' | 'hiace'>('granace');
  const [passengers, setPassengers] = useState<number>(4);
  const [skiGearCount, setSkiGearCount] = useState<number>(4);
  const [addSecondVehicle, setAddSecondVehicle] = useState<boolean>(false);
  const [travelDate, setTravelDate] = useState<string>(() => {
    if (initialDate) return initialDate;
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [chaletAddress, setChaletAddress] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [vehicleMemo, setVehicleMemo] = useState<string>('');

  const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Stripe Modals
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  const currentResort = SKI_RESORTS.find((r) => r.id === selectedResortId) || SKI_RESORTS[0];
  const maxCap = VEHICLE_MAX_CAP[selectedVehicle] || 5;
  const isOverCapacity = passengers > maxCap;

  // Price Calculation
  const quote = useMemo(() => {
    const basePrice =
      selectedVehicle === 'alphard'
        ? currentResort.basePriceAlphard
        : selectedVehicle === 'granace'
        ? currentResort.basePriceGranace
        : currentResort.basePriceHiace;

    const airportSurcharge = pickupPoint === 'nrt' ? 12000 : pickupPoint === 'hnd' ? 5000 : 0;
    const secondVehiclePrice = addSecondVehicle ? basePrice * 0.9 : 0;
    const finalTotalPrice = basePrice + airportSurcharge + secondVehiclePrice;

    return {
      basePrice,
      airportSurcharge,
      secondVehiclePrice,
      finalTotalPrice,
    };
  }, [currentResort, selectedVehicle, pickupPoint, addSecondVehicle]);

  const pickupLabel =
    pickupPoint === 'nrt'
      ? 'Narita Airport (NRT)'
      : pickupPoint === 'hnd'
      ? 'Haneda Airport (HND)'
      : 'Tokyo Downtown Hotel';

  const vehicleName =
    selectedVehicle === 'alphard'
      ? 'Toyota Alphard (Premium - 1-4 Pax)'
      : selectedVehicle === 'granace'
      ? 'Toyota Granace (Ultra Premium - 1-5 Pax)'
      : 'HiAce Grand Cabin (Standard - 1-9 Pax)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'winter_transfer',
    destinationId: currentResort.id,
    destinationTitle: `${pickupLabel} ⇄ ${currentResort.name.en} (4WD Ski Direct)`,
    vehicle: selectedVehicle,
    vehicleName,
    passengers,
    luggageCount: Math.max(passengers, 4),
    skiBagCount: skiGearCount,
    addSecondVehicle,
    travelDate,
    guestName: guestName.trim() || 'Valued Guest',
    guestEmail: guestEmail.trim() || 'client@example.com',
    guestPhone: guestPhone.trim() || '+81 80 1234 5678',
    pickupAddress: chaletAddress || 'Destination Chalet',
    notes: [
      vehicleMemo ? `Vehicle Memo: ${vehicleMemo}` : null,
      addSecondVehicle ? 'Added 2nd Support Vehicle' : null,
    ].filter(Boolean).join(' | '),
    amount: quote.finalTotalPrice,
    currency: 'jpy',
  };

  const handleInitiatePayment = () => {
    if (isOverCapacity && !addSecondVehicle) {
      setValidationError(
        lang === 'ja'
          ? `選択中の車両定員は最大${maxCap}名です（現在${passengers}名）。車両クラスを「Ultra Premium (5名)」または「Standard (9名)」に変更するか、2台目サポート車両を追加してください。`
          : `${selectedVehicle === 'alphard' ? 'Toyota Alphard (Premium)' : 'Toyota Granace (Ultra Premium)'} capacity is max ${maxCap} guests. You have selected ${passengers} guests. Please choose a larger vehicle or add a 2nd support vehicle.`
      );
      return;
    }
    if (!chaletAddress.trim()) {
      setValidationError(
        lang === 'ja'
          ? '目的地の宿・シャレー名または住所をご入力ください。'
          : 'Please enter your destination chalet, hotel name, or address.'
      );
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setValidationError(
        lang === 'ja'
          ? '代表者様のお名前と予約確認書送信用メールアドレスをご入力ください。'
          : 'Please enter the lead guest name and confirmation email address.'
      );
      return;
    }
    if (!isConfirmedAgreement) {
      setValidationError(
        lang === 'ja'
          ? 'お支払い前に同意のチェックボックスを選択してください。'
          : 'Please check the mandatory confirmation box before proceeding.'
      );
      return;
    }
    setValidationError(null);
    setIsStripeModalOpen(true);
  };

  const whatsAppSkiUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `✨ *SK LIMO 4WD SKI CHARTER RESERVATION*\n\n` +
    `• Resort: ${currentResort.name.en}\n` +
    `• Departure: ${pickupLabel}\n` +
    `• Vehicle: ${vehicleName}${addSecondVehicle ? ' (+ 2nd Support Vehicle)' : ''}\n` +
    `• Date: ${travelDate}\n` +
    `• Guests: ${passengers} Pax | Ski Bags: ${skiGearCount}\n` +
    `• Lead Guest: ${guestName || 'Valued Guest'}\n` +
    `• Destination: ${chaletAddress || 'Chalet/Hotel'}\n` +
    (vehicleMemo ? `• Memo: ${vehicleMemo}\n` : '') +
    `• Quoted Fare: ¥${quote.finalTotalPrice.toLocaleString()} JPY\n\n` +
    `Please confirm 4WD vehicle dispatch and chauffeur assignment.`
  )}`;

  return (
    <div className="w-full bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      
      {/* Top Bar / Back to Catalog */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
        {onBackToCatalog && (
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0068FF] dark:text-[#3B82F6] hover:underline cursor-pointer bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm"
          >
            <span>←</span>
            <span>{lang === 'ja' ? 'すべてのツアー一覧に戻る' : lang === 'zh' ? '返回全部行程列表' : 'Back to Explore & Catalog'}</span>
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full ml-auto">
          <Snowflake className="w-3 h-3" />
          <span>4WD Winter Ski Direct Transfer</span>
        </div>
      </div>

      <div className="py-4 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Select Resort */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? 'スキーリゾートを選択' : 'Select Ski Resort Destination'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKI_RESORTS.map((resort) => {
                  const isSelected = selectedResortId === resort.id;
                  return (
                    <button
                      key={resort.id}
                      type="button"
                      onClick={() => setSelectedResortId(resort.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <span className={`font-bold text-xs block ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                        {resort.name[lang] || resort.name.en}
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-slate-400 pt-1 border-t border-[#F0F2F5] dark:border-slate-800/80">
                        <span>{resort.distanceHours}</span>
                        <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">¥{resort.basePriceAlphard.toLocaleString()}〜</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pickup Location */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? 'ご出発地・乗車場所' : 'Departure Point'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'hnd' as const, label: 'Haneda Airport (HND)' },
                  { id: 'nrt' as const, label: 'Narita Airport (NRT)' },
                  { id: 'tokyo' as const, label: 'Tokyo Downtown Hotel' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPickupPoint(item.id)}
                    className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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

            {/* 3. Vehicle Class (Standard, Premium, Ultra Premium with Gold Badges) */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? '4WD 冬期専用車両クラス' : '4WD Winter Fleet Class'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#00B37E] font-semibold">Studless Tires Included</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'hiace' as const,
                    name: 'HiAce Grand Cabin',
                    tier: 'Standard',
                    goldBadge: 'STANDARD',
                    cap: '1-9 Pax',
                    maxPax: 9,
                    img: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg'
                  },
                  {
                    id: 'alphard' as const,
                    name: 'Toyota Alphard 4WD',
                    tier: 'Premium',
                    goldBadge: 'PREMIUM',
                    cap: '1-4 Pax',
                    maxPax: 4,
                    img: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg'
                  },
                  {
                    id: 'granace' as const,
                    name: 'Toyota Granace 4WD',
                    tier: 'Ultra Premium Vehicle',
                    goldBadge: 'ULTRA PREMIUM',
                    cap: '1-5 Pax',
                    maxPax: 5,
                    img: '/images/fleet-toyota-granace-exterior-4032x3024.jpg'
                  },
                ].map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  const isExceededForThis = passengers > v.maxPax;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVehicle(v.id);
                        if (validationError) setValidationError(null);
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative ${
                        isSelected
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 ring-1 ring-[#0068FF]'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="relative w-full h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <Image src={v.img} alt={v.name} fill className="object-cover" />
                        {/* Gold Badge on Top-Right of Vehicle Box */}
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#C5A059]/40 shadow">
                          <span className="text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase">
                            {v.goldBadge}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-bold text-xs block truncate ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                            {v.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7280] dark:text-slate-400 block">
                          {v.tier} · Max {v.cap}
                        </span>
                        {isExceededForThis && (
                          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            Over {v.maxPax} Pax cap
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Over-Capacity Warning Banner */}
              {isOverCapacity && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {selectedVehicle === 'alphard'
                        ? 'Toyota Alphard (Premium) capacity is max 4 passengers.'
                        : 'Toyota Granace (Ultra Premium) capacity is max 5 passengers.'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    You have selected <strong>{passengers} guests</strong>. Please switch vehicle to <strong>HiAce Grand Cabin (Standard - up to 9 pax)</strong>, or select the option below to add a 2nd support vehicle.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Destination Chalet / Hotel & Guest Details */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? '目的地シャレー・ご乗車詳細' : 'Destination Chalet & Passengers'}
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {lang === 'ja' ? '送迎日程' : 'Transfer Date'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {lang === 'ja' ? 'ご乗車人数' : 'Guest Count'}
                    </label>
                    <div className="flex items-center justify-between bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-1.5">
                      <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{passengers} Guests</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setPassengers(Math.max(1, passengers - 1));
                            if (validationError) setValidationError(null);
                          }}
                          className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPassengers(Math.min(18, passengers + 1));
                            if (validationError) setValidationError(null);
                          }}
                          className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {lang === 'ja' ? '目的地の宿・シャレー名または住所' : 'Destination Chalet / Hotel Name & Address'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Happo, Hakuba Wadano Chalet, Nozawa Onsen Hotel"
                    value={chaletAddress}
                    onChange={(e) => {
                      setChaletAddress(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {lang === 'ja' ? '代表者様氏名' : 'Lead Guest Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Smith"
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {lang === 'ja' ? '予約確認書送信先メールアドレス' : 'Confirmation Email'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>
                </div>

                {/* 2nd Support Vehicle Option Toggle */}
                <div className="pt-1">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-[#0068FF]" />
                      <div>
                        <span className="text-xs font-bold text-[#1A1A1A] dark:text-white block">
                          Add 2nd Support Vehicle (Luggage &amp; Large Group)
                        </span>
                        <span className="text-[10px] text-[#6B7280] dark:text-slate-400">
                          Dual 4WD convoy for excess ski bags, snowboards, or groups over 9 guests.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={addSecondVehicle}
                      onChange={(e) => {
                        setAddSecondVehicle(e.target.checked);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-4 h-4 rounded border-[#D1D5DB] text-[#0068FF] focus:ring-[#0068FF] cursor-pointer"
                    />
                  </label>
                </div>

                {/* Additional Memo Section */}
                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0068FF]" />
                    <span>{lang === 'ja' ? '追加車両・特記事項メモ' : 'Additional Vehicle Memo & Special Requests'}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra ski bag volume, child safety seats required, request 2nd vehicle for gear, or specific rest stop preferences."
                    value={vehicleMemo}
                    onChange={(e) => setVehicleMemo(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF] resize-none"
                  />
                </div>

                {/* Mandatory Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isConfirmedAgreement}
                      onChange={(e) => {
                        setIsConfirmedAgreement(e.target.checked);
                        if (validationError) setValidationError(null);
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-[#0068FF] focus:ring-[#0068FF] cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-tight">
                      {lang === 'ja'
                        ? 'スキー送迎日程、人数、目的地シャレー情報を確認し、運行規定およびキャンセル規定に同意します。'
                        : 'I confirm my ski transfer date, guest count, and destination chalet details are accurate, and I agree to the licensed commercial carrier terms.'}
                    </span>
                  </label>
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

              {/* Resort Photo Preview */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm">
                <Image
                  src={currentResort.image}
                  alt={currentResort.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {currentResort.distanceHours}
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white text-right">{currentResort.name[lang] || currentResort.name.en}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Departure:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{pickupLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{vehicleName}</span>
                </div>
                {addSecondVehicle && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Support Vehicle:</span>
                    <span>+ 2nd 4WD Convoy Vehicle</span>
                  </div>
                )}
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

                {validationError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-semibold flex items-center gap-2">
                    <span className="shrink-0 text-sm">⚠️</span>
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
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
                    <span>WhatsApp Concierge (Auto-Fill Details)</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

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

      {/* Confirmation Modal */}
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
