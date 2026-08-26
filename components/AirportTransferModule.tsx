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
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import {
  calculateAirportTransferPrice,
  Airport,
  VehicleType,
  TimeOfDay,
  BASE_PRICING_RATES,
} from '@/lib/airport-pricing';

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

  // 2. Hotel Destination & Guest Contact Details
  const [hotelAddress, setHotelAddress] = useState<string>('Grand Hyatt Tokyo (Roppongi)');
  const [guestName, setGuestName] = useState<string>('Valued Guest');
  const [guestEmail, setGuestEmail] = useState<string>('client@example.com');
  const [guestPhone, setGuestPhone] = useState<string>('+81 80 1234 5678');

  // 3. Minimized Notes & Special Requests
  const [showNotesField, setShowNotesField] = useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // 4. Flight & Schedule State (Placed at bottom before addons)
  const [travelDate, setTravelDate] = useState(() => {
    if (initialDate) return initialDate;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [flightNumber, setFlightNumber] = useState('EK312');
  const [isLookingUpFlight, setIsLookingUpFlight] = useState(false);
  const [flightData, setFlightData] = useState<FlightInfo | null>({
    flightNumber: 'EK312',
    airline: 'Emirates',
    airport: initialAirport,
    airportName: initialAirport === 'NRT' ? 'Narita International Airport (NRT)' : 'Haneda International Airport (HND)',
    arrivalTime: '22:35',
    terminal: 'Terminal 3',
    isLateNight: true,
    source: 'aerodatabox_live',
  });
  const [showManualTimeOverride, setShowManualTimeOverride] = useState(false);

  // Manual fallback controls
  const [airport, setAirport] = useState<Airport>(initialAirport);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Late Night');

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
      }
    } catch (err) {
      console.error('Flight lookup error:', err);
    } finally {
      setIsLookingUpFlight(false);
    }
  };

  // Adjust vehicle options when passenger count changes
  useEffect(() => {
    if (passengers > 4) {
      if (!isMultiVehicle) {
        setVehicleType('Wagon');
      }
    } else {
      setIsMultiVehicle(false);
    }
  }, [passengers, isMultiVehicle]);

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
    destinationTitle: `${directionText} (${vehicleNameDisplay})`,
    vehicle: effectiveVehicleType === 'Foreign Large' ? 'alphard' : 'granace',
    vehicleName: vehicleNameDisplay,
    passengers,
    luggageCount,
    travelDate,
    guestName: guestName.trim() || 'Valued Guest',
    guestEmail: guestEmail.trim() || 'client@example.com',
    guestPhone: guestPhone.trim() || '+81 80 1234 5678',
    flightNumber: flightData?.flightNumber || flightNumber,
    pickupAddress: hotelAddress.trim() || 'Grand Hyatt Tokyo (Roppongi)',
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
      en: '1. Number of Passengers & Luggage (Max 9)',
      ja: '1. ご乗車人数・スーツケース個数（最大9名）',
      zh: '1. 出行人数与行李件数（最多9人）',
      fr: '1. Passagers & Bagages (Max 9)',
      es: '1. Pasajeros y Equipaje (Máx 9)',
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
    step2Title: {
      en: '2. Available Vehicle Options',
      ja: '2. ご利用可能な車種',
      zh: '2. 可选车型',
      fr: '2. Véhicules Disponibles',
      es: '2. Vehículos Disponibles',
    }[lang],
    multiVehicleNotice: {
      en: `For ${passengers} guests, a single Wagon accommodates everyone comfortably (up to 9 pax), or select 2× Premium Vehicles (1 vehicle per 4 guests).`,
      ja: `${passengers}名様の場合、グランドキャビン1台（最大9名）でゆったりご乗車いただくか、高級アルファード2台運行（各4名）をお選びいただけます。`,
      zh: `${passengers}位贵宾可选择1辆丰田海狮大车（最多9人）舒适出行，或选配2辆埃尔法豪华车队（每车限4人）。`,
      fr: `Pour ${passengers} passagers, un seul van accueille jusqu'à 9 personnes, ou choisissez 2 véhicules VIP (4 personnes par voiture).`,
      es: `Para ${passengers} pasajeros, un solo van puede llevar hasta 9 personas, o elija 2 vehículos VIP (4 personas por auto).`,
    }[lang],
    step3Title: {
      en: '3. Hotel / Address & Contact Details',
      ja: '3. ホテル・住所・代表者様情報',
      zh: '3. 酒店/地址与联系信息',
      fr: '3. Hôtel & Contact',
      es: '3. Hotel y Contacto',
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
    step4Title: {
      en: '4. Flight Details & Arrival Schedule (AeroDataBox Live)',
      ja: '4. フライト便名・到着日時（AeroDataBox連動）',
      zh: '4. 航班信息与到达时间（AeroDataBox实时查询）',
      fr: '4. Vol & Horaire d\'Arrivée (AeroDataBox Direct)',
      es: '4. Vuelo y Horario (AeroDataBox en Vivo)',
    }[lang],
    autoDetectTime: {
      en: 'Live AeroDataBox API',
      ja: 'リアルタイムAPI連動',
      zh: '实时航班API',
      fr: 'API Vol en Direct',
      es: 'API de Vuelos en Vivo',
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
      en: 'Fetching API...',
      ja: 'API照会中...',
      zh: '查询API中...',
      fr: 'Interrogation...',
      es: 'Consultando...',
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
      ja: '5. 空港ミート・VIPコンシェルジュ',
      zh: '5. 机场举牌接机与VIP通道',
      fr: '5. Accueil Aéroport & Concierge VIP',
      es: '5. Bienvenida en Aeropuerto y VIP',
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
      en: '60-Min complimentary flight delay buffer',
      ja: 'フライト遅延60分無料待機サービス',
      zh: '免费提供60分钟航班延误等待',
      fr: '60 min d\'attente gratuite en cas de retard',
      es: '60 min de espera de cortesía por retraso',
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
    if (!isConfirmedAgreement) {
      setValidationError(
        lang === 'ja'
          ? 'お支払い前に同意のチェックボックスを選択してください。'
          : lang === 'zh'
          ? '请勾选确认条款方框以继续支付。'
          : 'Please check the mandatory confirmation box below before proceeding.'
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
      
      {/* Top Banner / Back to Catalog */}
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

            {/* STEP 1: Passengers & Luggage (Max 9 Pax) */}
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
                <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Max 9 Pax</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Passengers Counter */}
                <div className="p-3.5 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#0068FF]" />
                    <div>
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white block">{t.passengersLabel}</span>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">
                        {t.maxLimitNotice}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm text-[#1A1A1A] dark:text-white min-w-[28px] text-center font-mono">
                      {passengers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center cursor-pointer text-sm"
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
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">Suitcases (24"-28")</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm text-[#1A1A1A] dark:text-white min-w-[28px] text-center font-mono">
                      {luggageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLuggageCount(Math.min(10, luggageCount + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Available Vehicles */}
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
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Capacity Verified
                </span>
              </div>

              {/* Case A: 1-4 Passengers */}
              {passengers <= 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Foreign Large');
                      setIsMultiVehicle(false);
                    }}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      vehicleType === 'Foreign Large' && !isMultiVehicle
                        ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${vehicleType === 'Foreign Large' && !isMultiVehicle ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                        Toyota Alphard
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-2 py-0.5 rounded text-[#4B5563] dark:text-slate-300 font-medium">
                          1–4 Pax
                        </span>
                        <span className="text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                          PREMIUM
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block mt-1">
                      VIP First-Class Captain Seats
                    </span>
                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#E5E8ED]/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">Base Fare:</span>
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-white font-mono">
                        ¥{BASE_PRICING_RATES[airport]['Foreign Large'].toLocaleString()} JPY
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Wagon');
                      setIsMultiVehicle(false);
                    }}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      vehicleType === 'Wagon' && !isMultiVehicle
                        ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                        : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${vehicleType === 'Wagon' && !isMultiVehicle ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                        HiAce Grand Cabin
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-white dark:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-2 py-0.5 rounded text-[#4B5563] dark:text-slate-300 font-medium">
                          1–9 Pax
                        </span>
                        <span className="text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                          STANDARD
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block mt-1">
                      High-Capacity Group Van (Up to 9 Pax)
                    </span>
                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#E5E8ED]/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">Base Fare:</span>
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-white font-mono">
                        ¥{BASE_PRICING_RATES[airport]['Wagon'].toLocaleString()} JPY
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Case B: 5 to 9 Passengers */}
              {passengers > 4 && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{t.multiVehicleNotice}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setVehicleType('Wagon');
                        setIsMultiVehicle(false);
                      }}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        !isMultiVehicle
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${!isMultiVehicle ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                          1× Grand Cabin Wagon
                        </span>
                        <span className="text-[10px] bg-[#00B37E] text-white px-2 py-0.5 rounded font-bold">
                          Standard (1-9 Pax)
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block mt-1">
                        Toyota HiAce (Fits up to 9 Guests comfortably)
                      </span>
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#E5E8ED]/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">Base Rate:</span>
                        <span className="font-bold text-xs text-[#1A1A1A] dark:text-white font-mono">
                          ¥{BASE_PRICING_RATES[airport]['Wagon'].toLocaleString()} JPY
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVehicleType('Foreign Large');
                        setIsMultiVehicle(true);
                      }}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isMultiVehicle
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${isMultiVehicle ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                          2× Premium Vehicles
                        </span>
                        <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded font-bold">
                          VIP Fleet (4 Pax/Car)
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block mt-1">
                        2× Toyota Alphard Executive
                      </span>
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#E5E8ED]/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-[#9CA3AF] dark:text-slate-400">Base Rate (2×):</span>
                        <span className="font-bold text-xs text-[#0068FF] dark:text-[#3B82F6] font-mono">
                          ¥{(BASE_PRICING_RATES[airport]['Foreign Large'] * 2).toLocaleString()} JPY
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: Hotel / Address & Contact Details */}
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
                <span className="text-[11px] text-red-500 font-semibold">* Required</span>
              </div>

              {/* Hotel Name Input */}
              <div>
                <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0068FF]" />
                  <span>{t.hotelLabel} <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grand Hyatt Tokyo (Roppongi), Aman Tokyo, or Tokyo Hotel Address"
                  value={hotelAddress}
                  onChange={(e) => {
                    setHotelAddress(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                />
              </div>

              {/* Lead Guest Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.guestNameLabel}
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
                    {t.guestEmailLabel}
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

            {/* STEP 4: Flight Details & Arrival Schedule (AeroDataBox Live API at Bottom) */}
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
                <span className="text-[11px] text-[#0068FF] dark:text-[#3B82F6] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
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
                  <span>{showManualTimeOverride ? 'Hide manual adjustments' : 'Change airport or time manually'}</span>
                </button>

                {showManualTimeOverride && (
                  <div className="mt-3 p-3 bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl border border-[#E5E8ED] dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">Airport</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAirport('HND');
                            setNrtGreeter(false);
                          }}
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

              {/* NRT Greeter Option */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  airport === 'NRT'
                    ? nrtGreeter
                      ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15'
                      : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c]'
                    : 'border-[#F0F2F5] dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#0d121c] opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className={`w-5 h-5 shrink-0 ${nrtGreeter && airport === 'NRT' ? 'text-[#0068FF]' : 'text-[#9CA3AF]'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white">NRT Dedicated Greeter</span>
                      <span className="text-[10px] font-mono font-bold text-[#0068FF] dark:text-[#3B82F6]">+¥10,000 JPY</span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block">
                      {airport === 'NRT'
                        ? 'Dedicated staff waiting at Narita arrival lobby with signboard'
                        : 'Available for Narita Airport (NRT) arrivals only'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={airport !== 'NRT'}
                  checked={nrtGreeter && airport === 'NRT'}
                  onChange={(e) => setNrtGreeter(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0068FF] border-[#D1D5DB] focus:ring-[#0068FF] cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {/* VIP Meet Service Option */}
              <div className="p-3.5 rounded-xl border border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#0068FF]" />
                    <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white">VIP Meet &amp; Greet Service</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] dark:text-slate-400 font-mono">
                    1st: ¥55,000 · +¥22,000/each addl
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  Airside gate greeting, expedited customs escort, and priority luggage handling.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#4B5563] dark:text-slate-300 font-medium">VIP Guests:</span>
                  <div className="flex items-center gap-1.5 border border-[#E5E8ED] dark:border-slate-700 rounded-lg p-0.5 bg-[#F5F7FA] dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setVipMeetCount(Math.max(0, vipMeetCount - 1))}
                      className="w-7 h-7 rounded-md bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-semibold text-xs px-2 text-[#1A1A1A] dark:text-white min-w-[36px] text-center font-mono">
                      {vipMeetCount} Pax
                    </span>
                    <button
                      type="button"
                      onClick={() => setVipMeetCount(Math.min(passengers, vipMeetCount + 1))}
                      className="w-7 h-7 rounded-md bg-white dark:bg-slate-700 hover:bg-[#E5E8ED] text-[#1A1A1A] dark:text-white font-bold flex items-center justify-center text-sm cursor-pointer"
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

                {/* Step 3: NRT Greeter */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#1A1A1A] dark:text-white block">
                      NRT Greeter
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-slate-400">
                      {airport === 'NRT' && nrtGreeter ? 'Dedicated Airport Staff' : 'None / Not Selected'}
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
