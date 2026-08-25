'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Info,
  Car,
  Compass,
  Star,
  Check
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';

export interface DayTourBookingModuleProps {
  initialDestination?: string;
  initialDate?: string;
  onBackToCatalog?: () => void;
}

interface TourDestination {
  id: string;
  name: { en: string; ja: string; zh: string; fr: string; es: string };
  region: string;
  charterHours: string;
  baseTourRate: number;
  image: string;
  highlights: { en: string[]; ja: string[]; zh: string[]; fr: string[]; es: string[] };
}

const TOUR_DESTINATIONS: TourDestination[] = [
  {
    id: 'fuji-kawaguchiko',
    name: {
      en: 'Mount Fuji & Lake Kawaguchiko',
      ja: '富士山・河口湖・忍野八海 貸切チャーター',
      zh: '富士山・河口湖・忍野八海 经典尊享一日游',
      fr: 'Mont Fuji & Lac Kawaguchiko',
      es: 'Monte Fuji y Lago Kawaguchiko',
    },
    region: 'Yamanashi Prefecture',
    charterHours: '10 Hours',
    baseTourRate: 75000,
    image: '/images/dest-fuji-hero-1920x1080.jpg',
    highlights: {
      en: ['5th Station panoramic views', 'Oshino Hakkai crystal ponds', 'Arakurayama Sengen Pagoda', 'Lake Kawaguchi lakeside'],
      ja: ['富士山五合目パノラマ', '忍野八海の湧水群', '新倉山浅間公園 忠霊塔', '河口湖北岸の絶景'],
      zh: ['富士山五合目全景', '忍野八海清泉', '新仓山浅间公园五重塔', '河口湖畔远眺'],
      fr: ['5e station vue panoramique', 'Sources pures d\'Oshino Hakkai', 'Pagode Arakurayama', 'Rives du lac Kawaguchi'],
      es: ['Vistas panorámicas 5ª Estación', 'Manantiales sagrados Oshino Hakkai', 'Pagoda Arakurayama', 'Paseo por el lago Kawaguchi'],
    },
  },
  {
    id: 'hakone-luxury',
    name: {
      en: 'Hakone Onsen & Lake Ashi',
      ja: '箱根 芦ノ湖・大涌谷・温泉郷 プレミアム周遊',
      zh: '箱根 芦之湖・大涌谷・顶级温泉 尊享包车',
      fr: 'Hakone, Mont Fuji & Lac Ashi',
      es: 'Hakone, Aguas Termales y Lago Ashi',
    },
    region: 'Kanagawa Prefecture',
    charterHours: '10 Hours',
    baseTourRate: 78000,
    image: '/images/dest-hakone-hero-1920x1080.jpg',
    highlights: {
      en: ['Lake Ashi Torii Gate', 'Owakudani geothermal valley', 'Hakone Open-Air Museum', 'Private onsen bath stops'],
      ja: ['箱根神社 平和の鳥居', '大涌谷の火山景観・黒たまご', '彫刻の森美術館', '日帰り温泉立寄り対応'],
      zh: ['芦之湖水中鸟居', '大涌谷地热与黑玉子', '雕刻之森美术馆', '顶级日归温泉体验'],
      fr: ['Torii flottant du lac Ashi', 'Vallée volcanique d\'Owakudani', 'Musée en plein air', 'Bains onsen privés'],
      es: ['Puerta Torii del Lago Ashi', 'Valle volcánico de Owakudani', 'Museo al aire libre', 'Baños termales onsen'],
    },
  },
  {
    id: 'kamakura-enoshima',
    name: {
      en: 'Kamakura Great Buddha & Enoshima',
      ja: '古都鎌倉 大仏・江の島 海岸プライベートツアー',
      zh: '古都镰仓 大佛・江之岛・湘南海岸 经典巡礼',
      fr: 'Kamakura & Île d\'Enoshima',
      es: 'Kamakura, Gran Buda y Enoshima',
    },
    region: 'Kanagawa Prefecture',
    charterHours: '9 Hours',
    baseTourRate: 68000,
    image: '/images/dest-kamakura-hero-1920x1080.jpg',
    highlights: {
      en: ['Kotoku-in Great Bronze Buddha', 'Tsurugaoka Hachimangu Shrine', 'Shonan coastal road', 'Enoshima Sea Candle'],
      ja: ['高徳院 鎌倉大仏', '鶴岡八幡宮・小町通り', '湘南海岸ドライブ', '江の島シーキャンドル'],
      zh: ['高德院镰仓大佛', '鹤冈八幡宫・小町通', '湘南海岸灌篮高手巡礼', '江之岛灯塔风光'],
      fr: ['Grand Bouddha de Kotoku-in', 'Sanctuaire Tsurugaoka', 'Route côtière de Shonan', 'Phare d\'Enoshima'],
      es: ['Gran Buda de Kotoku-in', 'Santuario Tsurugaoka', 'Carretera costera de Shonan', 'Isla y faro de Enoshima'],
    },
  },
  {
    id: 'nikko-unesco',
    name: {
      en: 'Nikko Toshogu UNESCO World Heritage',
      ja: '世界遺産 日光東照宮・中禅寺湖・華厳の滝 歴訪',
      zh: '世界遗产 日光东照宫・中禅寺湖・华严瀑布 尊享行',
      fr: 'Nikko Sanctuaire Toshogu & Chuzenji',
      es: 'Nikko Patrimonio UNESCO y Cascadas Kegon',
    },
    region: 'Tochigi Prefecture',
    charterHours: '11 Hours',
    baseTourRate: 88000,
    image: '/images/dest-nikko-hero-1920x1080.jpg',
    highlights: {
      en: ['Toshogu Shrine ornate gates', 'Kegon Waterfall gorge', 'Lake Chuzenji alpine lake', 'Irohazaka winding mountain pass'],
      ja: ['日光東照宮 陽明門・三猿', '日本三大名瀑 華厳の滝', '中禅寺湖畔の眺望', 'いろは坂パノラマドライブ'],
      zh: ['日光东照宫 阳明门', '日本三大名瀑 华严瀑布', '中禅寺湖高山湖泊', '伊吕波坂蜿蜒山道'],
      fr: ['Sanctuaire Toshogu', 'Cascade de Kegon', 'Lac d\'altitude Chuzenji', 'Col de montagne d\'Irohazaka'],
      es: ['Santuario Toshogu', 'Cascada de Kegon', 'Lago de montaña Chuzenji', 'Paso de montaña Irohazaka'],
    },
  },
];

export default function DayTourBookingModule({
  initialDestination = 'fuji-kawaguchiko',
  initialDate,
  onBackToCatalog,
}: DayTourBookingModuleProps) {
  const [lang] = useLanguage();

  const [selectedDestId, setSelectedDestId] = useState<string>(initialDestination);
  const [selectedVehicle, setSelectedVehicle] = useState<'alphard' | 'granace' | 'hiace' | 'crown'>('alphard');
  const [passengers, setPassengers] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(() => {
    if (initialDate) return initialDate;
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [pickupHotel, setPickupHotel] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [isConfirmedAgreement, setIsConfirmedAgreement] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Stripe Modals
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  const currentDest = TOUR_DESTINATIONS.find((d) => d.id === selectedDestId) || TOUR_DESTINATIONS[0];

  // Dynamic Pricing Calculation
  const vehiclePrice = useMemo(() => {
    const base = currentDest.baseTourRate;
    let fee = base;
    if (selectedVehicle === 'granace') fee = base + 5000;
    if (selectedVehicle === 'hiace') fee = base + 3000;
    if (selectedVehicle === 'crown') fee = base - 5000;
    return fee;
  }, [currentDest, selectedVehicle]);

  const vehicleName =
    selectedVehicle === 'alphard'
      ? 'Toyota Alphard Executive Lounge (1-4 Pax)'
      : selectedVehicle === 'granace'
      ? 'Toyota Granace 4WD VIP (1-5 Pax)'
      : selectedVehicle === 'hiace'
      ? 'Toyota HiAce Grand Cabin (1-9 Pax)'
      : 'Toyota Crown Majesta Sedan (1-3 Pax)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'destination',
    destinationId: currentDest.id,
    destinationTitle: `${currentDest.name.en} (${currentDest.charterHours} Private Charter)`,
    vehicle: selectedVehicle === 'crown' ? 'alphard' : selectedVehicle,
    vehicleName,
    passengers,
    luggageCount: Math.max(passengers, 2),
    travelDate,
    guestName: guestName.trim() || 'Valued Guest',
    guestEmail: guestEmail.trim() || 'guest@example.com',
    guestPhone: guestPhone.trim() || '+81 80 1234 5678',
    pickupAddress: pickupHotel.trim() || 'Tokyo Hotel',
    notes: specialRequests,
    amount: vehiclePrice,
    currency: 'jpy',
  };

  const handleInitiateCheckout = () => {
    if (!pickupHotel.trim()) {
      setValidationError(
        lang === 'ja'
          ? 'お迎え先ホテル名または東京都内住所をご入力ください。'
          : 'Please enter your pickup hotel name or Tokyo address.'
      );
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setValidationError(
        lang === 'ja'
          ? '代表者様のお名前と予約確認書送信用メールアドレスをご入力ください。'
          : 'Please enter the lead guest name and confirmation email.'
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

  const whatsAppCharterUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am booking a Private Day Tour: ${currentDest.name.en} (${currentDest.charterHours}) on ${travelDate} for ${passengers} guests. Vehicle: ${vehicleName}. Hotel: ${pickupHotel || 'Tokyo Hotel'}. Quoted: ¥${vehiclePrice.toLocaleString()} JPY.`
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
            <span>{lang === 'ja' ? 'すべてのツアー一覧に戻る' : lang === 'zh' ? '返回全部行程列表' : 'Back to All Charters & Tours'}</span>
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full ml-auto">
          <Compass className="w-3 h-3" />
          <span>Curated Private Day Charter</span>
        </div>
      </div>

      <div className="py-4 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">

            {/* 1. Select Tour Destination */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? '観光コース・目的地を選択' : 'Select Destination & Itinerary'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Door-to-Door</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOUR_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestId === dest.id;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setSelectedDestId(dest.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-bold text-xs block ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                          {dest.name[lang] || dest.name.en}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-slate-400 pt-1 border-t border-[#F0F2F5] dark:border-slate-800/80">
                        <span>{dest.charterHours} Charter</span>
                        <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">¥{dest.baseTourRate.toLocaleString()}〜</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Select Executive Fleet */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? '車両クラスを選択' : 'Select Executive Vehicle Class'}
                  </h2>
                </div>
                <span className="text-[11px] text-[#00B37E] font-semibold">Green-Plate Insured</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'alphard' as const, name: 'Toyota Alphard Executive', cap: '1-4 Pax', tag: 'VIP Ottoman Captains', img: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg' },
                  { id: 'granace' as const, name: 'Toyota Granace 4WD VIP', cap: '1-5 Pax', tag: 'Flagship 4WD Lounge', img: '/images/fleet-toyota-granace-exterior-4032x3024.jpg' },
                  { id: 'hiace' as const, name: 'HiAce Grand Cabin', cap: '1-9 Pax', tag: 'High-Capacity Van', img: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg' },
                  { id: 'crown' as const, name: 'Crown Majesta Sedan', cap: '1-3 Pax', tag: 'Executive VIP Sedan', img: '/images/fleet-toyota-crown-exterior-1477x1108.jpg' },
                ].map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                        <Image src={v.img} alt={v.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className={`font-bold text-xs block truncate ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                          {v.name}
                        </span>
                        <span className="text-[10px] text-[#6B7280] dark:text-slate-400 block">{v.cap} · {v.tag}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Passengers & Pickup Hotel */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {lang === 'ja' ? '乗車人数・お迎えホテル情報' : 'Passengers & Pickup Details'}
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {lang === 'ja' ? 'ご乗車日程' : 'Tour Date'} <span className="text-red-500">*</span>
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
                          onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => setPassengers(Math.min(9, passengers + 1))}
                          className="w-7 h-7 bg-white dark:bg-slate-700 border border-[#E5E8ED] dark:border-slate-600 rounded-lg text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {lang === 'ja' ? 'お迎え先ホテル名・住所' : 'Pickup Hotel Name or Tokyo Address'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aman Tokyo, Grand Hyatt Tokyo (Roppongi), or Tokyo Address"
                    value={pickupHotel}
                    onChange={(e) => {
                      setPickupHotel(e.target.value);
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

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {lang === 'ja' ? 'ご要望・立ち寄り希望地（任意）' : 'Custom Requests / Stops (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Child seat requested, stop by Gotemba Outlets, or scenic restaurant reservation"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
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
                        ? '旅程内容、ご乗車人数、お迎え先ホテル情報を確認し、運行規定およびキャンセル規定に同意します。'
                        : 'I confirm my tour destination, guest count, and pickup hotel address are correct, and I agree to the MLIT licensed carrier terms & cancellation policy.'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-sm lg:sticky lg:top-24 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-slate-800">
                <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                  Charter Quote Summary
                </span>
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All-Inclusive Fixed
                </span>
              </div>

              {/* Destination Photo Preview */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm">
                <Image
                  src={currentDest.image}
                  alt={currentDest.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {currentDest.charterHours} Duration
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white text-right">{currentDest.name[lang] || currentDest.name.en}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Guests:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{travelDate} · {passengers} Pax</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl p-3 space-y-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>All expressway highway tolls &amp; fuel included</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Licensed bilingual professional chauffeur</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Flexible customized stops &amp; photography points</span>
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#6B7280] dark:text-slate-400 font-bold uppercase">Total Fare:</span>
                  <span className="text-2xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">
                    ¥{vehiclePrice.toLocaleString()} <span className="text-xs font-normal text-[#9CA3AF]">JPY</span>
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
                    onClick={handleInitiateCheckout}
                    className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Instant Stripe Checkout</span>
                  </button>

                  <a
                    href={whatsAppCharterUrl}
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
