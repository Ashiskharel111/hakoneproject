'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Plane,
  Clock,
  Check,
  MessageSquare,
  CheckCircle2,
  Lock,
  Car,
  Moon,
  Sun,
  UserCheck,
  Award,
  Shield,
  Search,
  Users,
  Luggage,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  SlidersHorizontal,
  MapPin,
  FileText,
  Plus,
  ArrowLeftRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  calculateAirportTransferPrice,
  Airport,
  VehicleType,
  TimeOfDay,
  BASE_PRICING_RATES,
} from '@/lib/airport-pricing';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import AirportRouteVisualizer from '@/components/AirportRouteVisualizer';
import { getTodayJST, getFutureDateJST, isValidEmail, isValidPhone } from '@/lib/date-utils';

export type TransferDirection = 'airport_to_hotel' | 'hotel_to_airport';

interface FlightInfo {
  flightNumber: string;
  airline: string;
  airport: Airport;
  airportName: string;
  arrivalTime: string;
  terminal: string;
  isLateNight: boolean;
  source: string;
}

interface AirportTransferModuleProps {
  initialAirport?: Airport;
  initialDate?: string;
  initialDirection?: TransferDirection;
  onBackToCatalog?: () => void;
}

export default function AirportTransferModule({
  initialAirport = 'HND',
  initialDate,
  initialDirection = 'airport_to_hotel',
  onBackToCatalog,
}: AirportTransferModuleProps) {
  const [lang] = useLanguage();

  // Direction: Airport to Hotel vs Hotel to Airport
  const [direction, setDirection] = useState<TransferDirection>(initialDirection);

  // 1. Passengers & Fleet State (Strictly max 9 people for single wagon)
  const [passengers, setPassengers] = useState<number>(2);
  const [luggageCount, setLuggageCount] = useState<number>(2);
  const [vehicleType, setVehicleType] = useState<VehicleType>('Foreign Large');
  const [isMultiVehicle, setIsMultiVehicle] = useState<boolean>(false); // 2x Foreign Large for >4 pax

  // 2. Hotel Destination & Guest Contact Details (Empty defaults)
  const [hotelAddress, setHotelAddress] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  // 3. Minimized Notes & Special Requests
  const [showNotesField, setShowNotesField] = useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // 4. Flight & Schedule State (Step 1)
  const [travelDate, setTravelDate] = useState(() => {
    if (initialDate) return initialDate;
    return getTodayJST();
  });
  const [flightNumber, setFlightNumber] = useState('');
  const [isLookingUpFlight, setIsLookingUpFlight] = useState(false);
  const [flightData, setFlightData] = useState<FlightInfo | null>(null);
  const [showManualTimeOverride, setShowManualTimeOverride] = useState(false);

  // Manual fallback controls
  const [airport, setAirport] = useState<Airport>(initialAirport);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Standard');

  // 5. Add-ons
  const [nrtGreeter, setNrtGreeter] = useState<boolean>(false);
  const [vipMeetCount, setVipMeetCount] = useState<number>(0);

  // 6. Mandatory Confirmation Tick before Payment
  const [isConfirmedAgreement, setIsConfirmedAgreement] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 7. Modals
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  // Auto-fetch flight details via AeroDataBox API
  const handleLookupFlight = async (flightToSearch?: string) => {
    const targetFlight = (flightToSearch || flightNumber).trim().toUpperCase();
    if (!targetFlight) return;

    setIsLookingUpFlight(true);
    setValidationError(null);
    try {
      const res = await fetch(
        `/api/flight-lookup?flightNumber=${encodeURIComponent(targetFlight)}&flightDate=${encodeURIComponent(travelDate)}`
      );
      const data = await res.json();
      if (data.success) {
        setFlightData(data);
        setAirport(data.airport);
        setTimeOfDay(data.isLateNight ? 'Late Night' : 'Standard');
        if (data.airport === 'HND') {
          setNrtGreeter(false);
        }
      } else {
        setValidationError(
          lang === 'ja'
            ? `便名「${targetFlight}」のリアルタイムレーダー情報を取得できませんでした。予約完了後に運行管理デスクにて確認いたします。`
            : lang === 'zh'
            ? `未能从雷达获取航班「${targetFlight}」的实时数据，预订后调度中心将人工核对。`
            : `Live radar data not found for flight ${targetFlight}. Our dispatch desk will verify arrival details upon booking.`
        );
      }
    } catch (err) {
      console.error('Flight lookup error:', err);
    } finally {
      setIsLookingUpFlight(false);
    }
  };

  // Handle passenger adjustments
  const handlePassengerChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(9, newCount));
    setPassengers(clamped);
    if (clamped > 4) {
      if (vehicleType === 'Foreign Large' && !isMultiVehicle) {
        setVehicleType('Wagon');
      }
    }
  };

  // Determine actual vehicle count
  const effectiveVehicleCount = isMultiVehicle && passengers > 4 ? 2 : 1;
  const effectiveVehicleType: VehicleType = isMultiVehicle && passengers > 4 ? 'Foreign Large' : vehicleType;

  // Real-time calculation
  const pricing = useMemo(() => {
    return calculateAirportTransferPrice({
      airport,
      vehicleType: effectiveVehicleType,
      vehicleCount: effectiveVehicleCount,
      timeOfDay,
      nrtGreeter: airport === 'NRT' ? nrtGreeter : false,
      vipMeetCount,
    });
  }, [airport, effectiveVehicleType, effectiveVehicleCount, timeOfDay, nrtGreeter, vipMeetCount]);

  const airportShort = airport === 'NRT' ? 'Narita (NRT)' : 'Haneda (HND)';
  const directionText =
    direction === 'airport_to_hotel'
      ? `${airportShort} ➔ ${hotelAddress || 'Tokyo Hotel'}`
      : `${hotelAddress || 'Tokyo Hotel'} ➔ ${airportShort}`;

  const vehicleNameDisplay =
    effectiveVehicleCount > 1
      ? '2× Foreign Large (Toyota Alphard VIP)'
      : effectiveVehicleType === 'Foreign Large'
      ? 'Foreign Large (Toyota Alphard VIP)'
      : 'Wagon (Toyota HiAce Grand Cabin)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'airport_transfer',
    destinationId: airport.toLowerCase(),
    pickupId: airport.toLowerCase(),
    destinationTitle: `${directionText} (${vehicleNameDisplay})`,
    vehicle: effectiveVehicleType === 'Foreign Large' ? 'alphard' : 'granace',
    vehicleType: effectiveVehicleType,
    vehicleCount: effectiveVehicleCount,
    timeOfDay,
    nrtGreeter,
    vipMeetCount,
    vehicleName: vehicleNameDisplay,
    passengers,
    luggageCount,
    travelDate,
    guestName: guestName.trim() || 'Valued Guest',
    guestEmail: guestEmail.trim() || 'client@example.com',
    guestPhone: guestPhone.trim() || '+81 80 1234 5678',
    flightNumber: flightData?.flightNumber || flightNumber.trim() || 'TBD',
    pickupAddress: hotelAddress.trim() || 'Tokyo Address',
    notes: specialNotes.trim() || undefined,
    amount: pricing.totalAmount,
    currency: 'jpy',
  };

  // Multilingual UI Dictionary (EN, JA, ZH, FR, ES)
  const t = {
    badge: {
      en: 'MLIT Licensed Commercial Chauffeur',
      ja: '国土交通省認可 一般乗用旅客自動車運送事業',
      zh: '日本国土交通省正规绿牌营运认证',
      fr: 'Opérateur Agréé MLIT Plaque Verte',
      es: 'Operador Oficial con Licencia MLIT',
    }[lang],
    directionAirportToHotel: {
      en: 'Airport ➔ Hotel (Arrival)',
      ja: '空港 ➔ ホテル（到着）',
      zh: '机场 ➔ 酒店（接机）',
      fr: 'Aéroport ➔ Hôtel (Arrivée)',
      es: 'Aeropuerto ➔ Hotel (Llegada)',
    }[lang],
    directionHotelToAirport: {
      en: 'Hotel ➔ Airport (Departure)',
      ja: 'ホテル ➔ 空港（出発）',
      zh: '酒店 ➔ 机场（送机）',
      fr: 'Hôtel ➔ Aéroport (Départ)',
      es: 'Hotel ➔ Aeropuerto (Salida)',
    }[lang],
    step1Title: {
      en: '1. Flight Details & Travel Date',
      ja: '1. フライト便名・ご利用日程',
      zh: '1. 航班信息与出行日期',
      fr: '1. Vol & Date de Voyage',
      es: '1. Vuelo y Fecha de Viaje',
    }[lang],
    autoDetectTime: {
      en: 'Live Flight Radar',
      ja: 'リアルタイム便名照会',
      zh: '实时航班动态同步',
      fr: 'Radar en Direct',
      es: 'Radar en Vivo',
    }[lang],
    arrivalDateLabel: {
      en: direction === 'airport_to_hotel' ? 'Flight Date' : 'Pickup Date',
      ja: direction === 'airport_to_hotel' ? 'フライト日' : 'お迎え日',
      zh: direction === 'airport_to_hotel' ? '航班日期' : '出发日期',
      fr: 'Date du vol',
      es: 'Fecha del vuelo',
    }[lang],
    flightNumberLabel: {
      en: 'Flight Number (IATA Code)',
      ja: '便名 / フライト番号（IATAコード）',
      zh: '航班号（IATA代码）',
      fr: 'Numéro de vol',
      es: 'Número de vuelo',
    }[lang],
    checkButton: {
      en: 'Check Flight',
      ja: '便名検索',
      zh: '查询航班',
      fr: 'Vérifier',
      es: 'Consultar',
    }[lang],
    checkingText: {
      en: 'Checking...',
      ja: '照会中...',
      zh: '查询中...',
      fr: 'Vérification...',
      es: 'Consultando...',
    }[lang],
    step2Title: {
      en: '2. Number of Passengers & Luggage (Max 9)',
      ja: '2. ご乗車人数・スーツケース個数（最大9名）',
      zh: '2. 出行人数与行李件数（最多9人）',
      fr: '2. Passagers & Bagages (Max 9)',
      es: '2. Pasajeros y Equipaje (Máx 9)',
    }[lang],
    passengersLabel: {
      en: 'Passengers',
      ja: 'ご乗車人数',
      zh: '出行人数',
      fr: 'Passagers',
      es: 'Pasajeros',
    }[lang],
    maxLimitNotice: {
      en: 'Single Wagon fits up to 9 guests max.',
      ja: 'グランドキャビン1台で最大9名様までご乗車可能。',
      zh: '单辆商务大车最多可乘坐9位贵宾。',
      fr: 'Un seul van accueille 9 personnes maximum.',
      es: 'Un solo vehículo puede transportar hasta 9 personas.',
    }[lang],
    luggageLabel: {
      en: 'Check-in Luggage',
      ja: 'スーツケース',
      zh: '托运行李箱',
      fr: 'Bagages en soute',
      es: 'Equipaje facturado',
    }[lang],
    step3Title: {
      en: '3. Available Vehicle Options',
      ja: '3. ご利用可能な車種',
      zh: '3. 可选车型',
      fr: '3. Véhicules Disponibles',
      es: '3. Vehículos Disponibles',
    }[lang],
    multiVehicleNotice: {
      en: `For ${passengers} guests, a single Wagon accommodates everyone comfortably (up to 9 pax), or select 2× Premium Vehicles (1 vehicle per 4 guests).`,
      ja: `${passengers}名様の場合、グランドキャビン1台（最大9名）でゆったりご乗車いただくか、高級アルファード2台運行（各4名）をお選びいただけます。`,
      zh: `${passengers}位贵宾可选择1辆丰田海狮大车（最多9人）舒适出行，或选配2辆埃尔法豪华车队（每车限4人）。`,
      fr: `Pour ${passengers} passagers, un seul van accueille jusqu'à 9 personnes, ou choisissez 2 véhicules VIP (4 personnes par voiture).`,
      es: `Para ${passengers} pasajeros, un solo van puede llevar hasta 9 personas, o elija 2 vehículos VIP (4 personas por auto).`,
    }[lang],
    step4Title: {
      en: '4. Hotel / Address & Contact Details',
      ja: '4. ホテル・住所・代表者様情報',
      zh: '4. 酒店/地址与联系信息',
      fr: '4. Hôtel & Contact',
      es: '4. Hotel y Contacto',
    }[lang],
    hotelLabel: {
      en: direction === 'airport_to_hotel' ? 'Destination Hotel Name or Tokyo Address' : 'Pickup Hotel Name or Tokyo Address',
      ja: direction === 'airport_to_hotel' ? 'お届け先ホテル名・東京都内住所' : 'お迎え先ホテル名・東京都内住所',
      zh: direction === 'airport_to_hotel' ? '目的地酒店名称或东京都内地址' : '出发地酒店名称或东京都内地址',
      fr: 'Nom de l\'hôtel ou adresse à Tokyo',
      es: 'Nombre del hotel o dirección en Tokio',
    }[lang],
    guestNameLabel: {
      en: 'Lead Guest Full Name',
      ja: '代表者様氏名（英字・漢字）',
      zh: '代表乘客姓名',
      fr: 'Nom du passager principal',
      es: 'Nombre del pasajero principal',
    }[lang],
    guestEmailLabel: {
      en: 'Email for Voucher Confirmation',
      ja: '予約確認書送信用メールアドレス',
      zh: '接收预订确认函的电子邮箱',
      fr: 'Email pour confirmation',
      es: 'Correo para confirmación',
    }[lang],
    specialNotesToggle: {
      en: '+ Add special requests or driver notes (Child seat, oversized bags)',
      ja: '+ 特別リクエスト・連絡事項の追加（チャイルドシート・ゴルフバッグ等）',
      zh: '+ 添加特殊要求与备注（儿童安全座椅、超大行李等）',
      fr: '+ Ajouter une demande spéciale (siège bébé, bagages)',
      es: '+ Añadir solicitudes especiales (silla de bebé, equipaje extra)',
    }[lang],
    scheduledArrival: {
      en: 'Scheduled Flight Time',
      ja: 'フライト予定時刻',
      zh: '航班预计时间',
      fr: 'Heure de vol',
      es: 'Hora de vuelo',
    }[lang],
    terminalLabel: {
      en: 'Terminal',
      ja: 'ターミナル',
      zh: '航站楼',
      fr: 'Terminal',
      es: 'Terminal',
    }[lang],
    nightSurchargeLabel: {
      en: 'Night Surcharge',
      ja: '深夜割増',
      zh: '夜间时段',
      fr: 'Majoration Nuit',
      es: 'Recargo Noche',
    }[lang],
    lateNightBadge: {
      en: 'Late Night (+20%)',
      ja: '深夜料金 (+20%)',
      zh: '深夜时段 (+20%)',
      fr: 'Tarif Nuit (+20%)',
      es: 'Tarifa Noche (+20%)',
    }[lang],
    standardDayBadge: {
      en: 'Standard (0%)',
      ja: '通常料金 (0%)',
      zh: '日间标准 (0%)',
      fr: 'Standard (0%)',
      es: 'Estándar (0%)',
    }[lang],
    step5Title: {
      en: '5. Airport Greeter & VIP Concierge',
      ja: '5. 専用グリーター・VIPコンシェルジュ',
      zh: '5. 专属迎宾员与VIP礼宾服务',
      fr: '5. Accueil Personnalisé & Concierge VIP',
      es: '5. Recepción Personalizada y Concierge VIP',
    }[lang],
    greeterTitle: {
      en: 'Dedicated Greeter',
      ja: '専用グリーター',
      zh: '专属迎宾员',
      fr: 'Accueil Dédié',
      es: 'Recepción Personalizada',
    }[lang],
    greeterDesc: {
      en: 'Dedicated staff waiting at the arrival lobby with a personalized nameboard',
      ja: '到着ロビーにて専任スタッフがお名前入りサインボードを持ってお出迎え',
      zh: '专属工作人员手持定制姓名牌在到达大厅举牌迎候',
      fr: 'Personnel dédié vous attendant dans le hall des arrivées avec un panneau à votre nom',
      es: 'Personal dedicado que le espera en la sala de llegadas con un cartel a su nombre',
    }[lang],
    rateSummaryTitle: {
      en: 'Rate Summary',
      ja: 'お見積り内訳',
      zh: '费用明细',
      fr: 'Détail du Tarif',
      es: 'Desglose de Tarifas',
    }[lang],
    fixedBadge: {
      en: 'All-Inclusive Fixed',
      ja: '完全定額保証',
      zh: '全包一口价',
      fr: 'Tout Inclus Garanti',
      es: 'Todo Incluido Garantizado',
    }[lang],
    tollsInclusions: {
      en: 'All expressway tolls & chauffeur fuel included',
      ja: '高速道路通行料・ガソリン代全額込み',
      zh: '包含全程高速通行费与燃油费',
      fr: 'Péages d\'autoroute et carburant inclus',
      es: 'Peajes de autopista y combustible incluidos',
    }[lang],
    delayBufferInclusions: {
      en: '100% Free flexible delay wait (we won’t charge a penny)',
      ja: 'フライト遅延完全無料待機（遅延追加料金¥0）',
      zh: '航班延误100%免费灵活守候（延误¥0加价）',
      fr: 'Attente 100% flexible & gratuite (zéro frais de retard)',
      es: 'Espera 100% flexible y gratuita (0 cargos por retraso)',
    }[lang],
    mandatoryAgreement: {
      en: 'I confirm that my flight schedule, passenger count, and destination hotel are correct, and I agree to the MLIT-licensed transfer terms.',
      ja: 'フライト情報・乗車人数・お届け先ホテル名に誤りがないことを確認し、一般乗用旅客運送約款に同意します。',
      zh: '我确认航班信息、出行人数及目的地酒店准确无误，并同意正规绿牌营运服务条款。',
      fr: 'Je confirme l\'exactitude de mon vol, du nombre de passagers et de l\'hôtel, et j\'accepte les conditions de transport.',
      es: 'Confirmo que mi vuelo, número de pasajeros y hotel son correctos, y acepto los términos del servicio con licencia.',
    }[lang],
    instantPayButton: {
      en: 'Instant Stripe Checkout',
      ja: 'Stripeで即時決済・予約確定',
      zh: 'Stripe极速安全支付预订',
      fr: 'Paiement Sécurisé Stripe',
      es: 'Pago Seguro con Stripe',
    }[lang],
    whatsappButton: {
      en: 'WhatsApp Concierge 24/7',
      ja: 'WhatsAppで相談・予約',
      zh: 'WhatsApp 24小时客服咨询',
      fr: 'Concierge WhatsApp 24/7',
      es: 'Conserjería WhatsApp 24/7',
    }[lang],
  };

  const handleInitiatePayment = () => {
    if (!hotelAddress.trim()) {
      setValidationError(
        lang === 'ja'
          ? 'ホテル名または住所を入力してください。'
          : lang === 'zh'
          ? '请输入酒店名称或详细地址。'
          : 'Please enter your hotel or address in Tokyo.'
      );
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setValidationError(
        lang === 'ja'
          ? '代表者様のお名前と予約確認書送信用メールアドレスをご入力ください。'
          : lang === 'zh'
          ? '请输入代表乘客姓名与确认单电子邮箱。'
          : 'Please enter the lead guest name and confirmation email.'
      );
      return;
    }
    if (!isValidEmail(guestEmail)) {
      setValidationError(
        lang === 'ja'
          ? '有効なメールアドレスをご入力ください（例: name@example.com）。'
          : lang === 'zh'
          ? '请输入有效的电子邮箱地址（例如: name@example.com）。'
          : 'Please enter a valid email address (e.g. name@example.com).'
      );
      return;
    }
    if (guestPhone.trim() && !isValidPhone(guestPhone)) {
      setValidationError(
        lang === 'ja'
          ? '国際電話番号（国番号付き 例: +81 90...）をご入力ください。'
          : lang === 'zh'
          ? '请输入包含国家区号的有效联系电话（例如: +81 90...）。'
          : 'Please enter a valid phone number with country code (e.g. +81 90...).'
      );
      return;
    }
    setValidationError(null);
    setIsStripeModalOpen(true);
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am booking an airport transfer: Direction: ${direction === 'airport_to_hotel' ? 'Airport to Hotel' : 'Hotel to Airport'}, Flight ${flightNumber} on ${travelDate} (${directionText}). Passengers: ${passengers}, Vehicle: ${vehicleNameDisplay}, Time: ${timeOfDay}${nrtGreeter && airport === 'NRT' ? ', with NRT Greeter' : ''}${vipMeetCount > 0 ? `, with VIP Meet (${vipMeetCount} Pax)` : ''}. Total: ¥${pricing.totalAmount.toLocaleString()} JPY.`
  )}`;

  const quickFlightSamples = ['EK312', 'NH110', 'JL5', 'SQ638', 'CX548', 'UA79', 'DL295'];

  return (
    <div className="w-full bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      
      {/* Top Tagline Badge */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-end">
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full">
          <Plane className="w-3 h-3" />
          <span>{t.badge}</span>
        </div>
      </div>

      {/* Main Wizard Form */}
      <div className="py-4 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Direction Switcher */}
        <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#0068FF]" />
            <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white">
              Transfer Route Direction:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDirection('airport_to_hotel')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'airport_to_hotel'
                  ? 'bg-[#0068FF] text-white shadow-sm'
                  : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED]'
              }`}
            >
              {t.directionAirportToHotel}
            </button>

            <button
              type="button"
              onClick={() => setDirection('hotel_to_airport')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                direction === 'hotel_to_airport'
                  ? 'bg-[#0068FF] text-white shadow-sm'
                  : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED]'
              }`}
            >
              {t.directionHotelToAirport}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Step-by-Step Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-5">

            {/* STEP 1: Flight Details & Arrival Schedule (Asked First) */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.step1Title}
                  </h2>
                </div>
                <span className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] font-medium flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  {t.autoDetectTime}
                </span>
              </div>

              {/* Date & Flight Number Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.arrivalDateLabel}
                  </label>
                  <input
                    type="date"
                    min={getTodayJST()}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.flightNumberLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. EK312, NH110, JL5"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLookupFlight();
                      }}
                      className="w-full uppercase bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-bold tracking-wider focus:outline-none focus:border-[#0068FF]"
                    />
                    <button
                      type="button"
                      onClick={() => handleLookupFlight()}
                      disabled={isLookingUpFlight}
                      className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {isLookingUpFlight ? (
                        <span className="animate-spin text-xs">⏳</span>
                      ) : (
                        <Search className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{isLookingUpFlight ? t.checkingText : t.checkButton}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">Popular Flights:</span>
                {quickFlightSamples.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setFlightNumber(sample);
                      handleLookupFlight(sample);
                    }}
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                      flightNumber.toUpperCase() === sample
                        ? 'bg-[#E8F1FF] dark:bg-[#0068FF]/20 border-[#0068FF] text-[#0068FF] dark:text-[#3B82F6]'
                        : 'bg-[#F5F7FA] dark:bg-slate-800 border-[#E5E8ED] dark:border-slate-700 text-[#6B7280] dark:text-slate-300 hover:border-[#D1D5DB]'
                    }`}
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Auto-Fetched Flight Card */}
              {flightData && (
                <div className="bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E2E8F0] dark:border-slate-700/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#0068FF]" />
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-white">
                        {flightData.flightNumber} · {flightData.airline}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] dark:text-[#3B82F6] px-2 py-0.5 rounded">
                      {flightData.airportName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400 block">{t.scheduledArrival}</span>
                      <span className="font-bold text-[#1A1A1A] dark:text-white font-mono">{flightData.arrivalTime} JST</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400 block">{t.terminalLabel}</span>
                      <span className="font-medium text-[#1A1A1A] dark:text-slate-200">{flightData.terminal}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400 block">{t.nightSurchargeLabel}</span>
                      {flightData.isLateNight ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          <Moon className="w-3 h-3" />
                          {t.lateNightBadge}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          <Sun className="w-3 h-3" />
                          {t.standardDayBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Override Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualTimeOverride(!showManualTimeOverride)}
                  className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{showManualTimeOverride ? 'Hide manual adjustments' : 'Change airport or time slot manually'}</span>
                </button>

                {showManualTimeOverride && (
                  <div className="mt-3 p-3 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">Airport</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAirport('HND')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            airport === 'HND' ? 'bg-[#0068FF] text-white border-[#0068FF]' : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-200 border-[#E5E8ED] dark:border-slate-700'
                          }`}
                        >
                          Haneda (HND)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAirport('NRT')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            airport === 'NRT' ? 'bg-[#0068FF] text-white border-[#0068FF]' : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-200 border-[#E5E8ED] dark:border-slate-700'
                          }`}
                        >
                          Narita (NRT)
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">Time Slot</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTimeOfDay('Standard')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            timeOfDay === 'Standard' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-200 border-[#E5E8ED] dark:border-slate-700'
                          }`}
                        >
                          Standard (Day)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeOfDay('Late Night')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            timeOfDay === 'Late Night' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-200 border-[#E5E8ED] dark:border-slate-700'
                          }`}
                        >
                          Late Night (+20%)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* STEP 2: Passengers & Luggage (Max 9 Pax) */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.step2Title}
                  </h2>
                </div>
                <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Max 9 Pax</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Passengers Counter */}
                <div className="p-3.5 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#0068FF]" />
                    <div>
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white block">{t.passengersLabel}</span>
                      <span className="text-[10px] text-[#6B7280] dark:text-slate-400">1 - 9 Guests</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange(Math.max(1, passengers - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center border border-[#E5E8ED] dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm text-[#1A1A1A] dark:text-white w-6 text-center font-mono">
                      {passengers}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange(Math.min(9, passengers + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center border border-[#E5E8ED] dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Luggage Counter */}
                <div className="p-3.5 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Luggage className="w-4 h-4 text-[#0068FF]" />
                    <div>
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white block">{t.luggageLabel}</span>
                      <span className="text-[10px] text-[#6B7280] dark:text-slate-400">Suitcases</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center border border-[#E5E8ED] dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm text-[#1A1A1A] dark:text-white w-6 text-center font-mono">
                      {luggageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLuggageCount(luggageCount + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center border border-[#E5E8ED] dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Route & Highway Corridor Visualizer */}
              <AirportRouteVisualizer
                selectedAirport={airport}
                direction={direction}
                hotelAddress={hotelAddress}
              />
            </div>

            {/* STEP 3: Available Vehicle Options */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.step3Title}
                  </h2>
                </div>
                <span className="text-[11px] text-[#6B7280] dark:text-slate-400">All-Inclusive Fixed</span>
              </div>

              {/* Multi-vehicle alert if >4 pax */}
              {passengers > 4 && (
                <div className="p-3 bg-[#E8F1FF] dark:bg-[#0068FF]/10 rounded-xl border border-[#0068FF]/30 text-xs text-[#0068FF] dark:text-[#3B82F6] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t.multiVehicleNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Alphard / Premium Option */}
                {passengers <= 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Foreign Large');
                      setIsMultiVehicle(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      vehicleType === 'Foreign Large' && !isMultiVehicle
                        ? 'border-[#0068FF] bg-[#E8F1FF]/50 dark:bg-[#0068FF]/15 ring-2 ring-[#0068FF]/30 shadow-sm'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white">Toyota Alphard VIP</span>
                      <span className="text-xs font-bold text-[#0068FF] dark:text-[#3B82F6] font-mono">
                        ¥{BASE_PRICING_RATES[airport]['Foreign Large'].toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-slate-400 mb-2">
                      Executive lounge leather captain seats. Perfect for couples or VIP executives.
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#4B5563] dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max 4 Pax</span>
                      <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> Max 4 Bags</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Foreign Large');
                      setIsMultiVehicle(true);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isMultiVehicle
                        ? 'border-[#0068FF] bg-[#E8F1FF]/50 dark:bg-[#0068FF]/15 ring-2 ring-[#0068FF]/30 shadow-sm'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white">2× Toyota Alphard VIP</span>
                      <span className="text-xs font-bold text-[#0068FF] dark:text-[#3B82F6] font-mono">
                        ¥{(BASE_PRICING_RATES[airport]['Foreign Large'] * 2).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-slate-400 mb-2">
                      Two luxury executive vehicles traveling in convoy for supreme comfort.
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#4B5563] dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max 8 Pax</span>
                      <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> Max 8 Bags</span>
                    </div>
                  </button>
                )}

                {/* Grand Cabin Wagon Option */}
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('Wagon');
                    setIsMultiVehicle(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    vehicleType === 'Wagon' && !isMultiVehicle
                      ? 'border-[#0068FF] bg-[#E8F1FF]/50 dark:bg-[#0068FF]/15 ring-2 ring-[#0068FF]/30 shadow-sm'
                      : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white">HiAce Grand Cabin</span>
                    <span className="text-xs font-bold text-[#0068FF] dark:text-[#3B82F6] font-mono">
                      ¥{BASE_PRICING_RATES[airport]['Wagon'].toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400 mb-2">
                    Extra-long wheelbase high-roof van. Generous headroom and massive luggage space.
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-[#4B5563] dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to 9 Pax</span>
                    <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> 9+ Bags</span>
                  </div>
                </button>
              </div>
            </div>

            {/* STEP 4: Hotel / Address & Contact Details */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.step4Title}
                  </h2>
                </div>
                <span className="text-[11px] text-red-500 font-semibold">* Required</span>
              </div>

              {/* Hotel Name Input with Google Places Autocomplete */}
              <div>
                <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0068FF]" />
                    <span>{t.hotelLabel} <span className="text-red-500">*</span></span>
                  </span>
                </label>
                <GooglePlacesAutocomplete
                  value={hotelAddress}
                  onChange={(val) => {
                    setHotelAddress(val);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Search hotel (e.g. Grand Hyatt, Aman, Ritz-Carlton) or Tokyo address..."
                />
              </div>

              {/* Lead Guest Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.guestNameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.guestEmailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                  />
                </div>
              </div>

              {/* Guest International Phone Number */}
              <div>
                <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                  Contact Phone Number (WhatsApp / Mobile with country code)
                </label>
                <input
                  type="tel"
                  placeholder="+81 80 1234 5678 or +1 212 555 0199"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                />
              </div>

              {/* Minimized Add Notes Button & Field */}
              <div className="pt-1">
                {!showNotesField ? (
                  <button
                    type="button"
                    onClick={() => setShowNotesField(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0068FF] dark:text-[#3B82F6] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.specialNotesToggle}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#0068FF]" />
                        <span>Special Requests / Notes</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNotesField(false)}
                        className="text-[10px] text-[#9CA3AF] hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer"
                      >
                        Minimize
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="e.g. 1 Infant child seat needed, 2 sets of golf clubs, English-speaking driver preferred"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-white dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-lg p-2.5 text-xs text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* STEP 5: Airport Greeter & VIP Concierge */}
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.step5Title}
                  </h2>
                </div>
                <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Optional</span>
              </div>

              {/* Dedicated Greeter Option */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  nrtGreeter
                    ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                    : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className={`w-5 h-5 shrink-0 ${nrtGreeter ? 'text-[#0068FF]' : 'text-[#9CA3AF]'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white">{t.greeterTitle}</span>
                      <span className="text-[10px] font-mono font-bold text-[#0068FF] dark:text-[#3B82F6]">+¥10,000 JPY</span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block">
                      {t.greeterDesc}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={nrtGreeter}
                  onChange={(e) => setNrtGreeter(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0068FF] border-[#D1D5DB] focus:ring-[#0068FF] cursor-pointer"
                />
              </div>

              {/* VIP Meet & Greet Service Option (Tinted Gold Background) */}
              <div className="p-4 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 dark:bg-[#C5A059]/15 dark:border-[#C5A059]/50 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-bold text-xs text-[#8C6D3F] dark:text-[#E5C378]">VIP Meet &amp; Greet Service</span>
                  </div>
                  <span className="text-[10px] text-[#8C6D3F] dark:text-[#E5C378] font-mono font-bold">
                    1st: ¥55,000 · +¥22,000/each addl
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6458] dark:text-slate-300">
                  Airside gate greeting, expedited customs escort, and priority luggage handling.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#1A1A1A] dark:text-white font-medium">VIP Guests:</span>
                  <div className="flex items-center gap-1.5 border border-[#C5A059]/30 rounded-lg p-0.5 bg-white dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => setVipMeetCount(Math.max(0, vipMeetCount - 1))}
                      className="w-7 h-7 rounded-md bg-[#F5F7FA] dark:bg-slate-800 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-semibold text-xs px-2 text-[#1A1A1A] dark:text-white min-w-[36px] text-center font-mono">
                      {vipMeetCount} Pax
                    </span>
                    <button
                      type="button"
                      onClick={() => setVipMeetCount(Math.min(passengers, vipMeetCount + 1))}
                      className="w-7 h-7 rounded-md bg-[#F5F7FA] dark:bg-slate-800 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Sticky Price Breakdown & Checkout (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0E131F] rounded-2xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-sm lg:sticky lg:top-24 transition-colors">

              {/* Breakdown Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-slate-800">
                <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                  {t.rateSummaryTitle}
                </span>
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.fixedBadge}
                </span>
              </div>

              {/* Sequential Breakdown */}
              <div className="space-y-3 text-xs">
                {/* Step 1: Base Fare */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] dark:text-white block">
                      Base Fare
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">
                      {directionText} ({vehicleNameDisplay})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">
                    ¥{pricing.baseFare.toLocaleString()} JPY
                  </span>
                </div>

                {/* Step 2: Time Surcharge */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] dark:text-white block">
                      Time Surcharge
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">
                      {timeOfDay === 'Late Night' ? 'Late Night (+20% on base)' : 'Standard Daytime (0%)'}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${pricing.lateNightSurcharge > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#9CA3AF]'}`}>
                    +¥{pricing.lateNightSurcharge.toLocaleString()} JPY
                  </span>
                </div>

                {/* Step 3: Dedicated Greeter */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] dark:text-white block">
                      Dedicated Greeter
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">
                      {nrtGreeter ? 'Arrival Lobby Nameboard Greeting' : 'None / Not Selected'}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${pricing.nrtGreeterFee > 0 ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                    +¥{pricing.nrtGreeterFee.toLocaleString()} JPY
                  </span>
                </div>

                {/* Step 4: VIP Meet Service */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] dark:text-white block">
                      VIP Meet Service
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">
                      {vipMeetCount > 0 ? `${vipMeetCount} VIP Guests (¥55k + ¥22k/ea)` : 'None'}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${pricing.vipMeetFee > 0 ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                    +¥{pricing.vipMeetFee.toLocaleString()} JPY
                  </span>
                </div>
              </div>

              {/* Trip.com Inclusions Guarantee */}
              <div className="bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl p-3 space-y-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.tollsInclusions}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.delayBufferInclusions}</span>
                </p>
              </div>

              {/* Mandatory Confirmation Tick Before Payment */}
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isConfirmedAgreement}
                    onChange={(e) => {
                      setIsConfirmedAgreement(e.target.checked);
                      if (validationError) setValidationError(null);
                    }}
                    className="w-4 h-4 mt-0.5 rounded text-[#0068FF] border-[#D1D5DB] focus:ring-[#0068FF] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#4B5563] dark:text-slate-300 leading-tight">
                    {t.mandatoryAgreement} <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>

                {validationError && (
                  <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#6B7280] dark:text-slate-400 uppercase font-bold">Total Estimated:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white font-mono">
                    ¥{pricing.totalAmount.toLocaleString()} <span className="text-xs text-[#9CA3AF] font-normal">JPY</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className={`w-full font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      isConfirmedAgreement && hotelAddress.trim()
                        ? 'bg-[#0068FF] hover:bg-[#0050CC] text-white'
                        : 'bg-[#0068FF]/60 text-white/80 cursor-pointer'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{t.instantPayButton}</span>
                  </button>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.whatsappButton}</span>
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
