'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Plane,
  Clock,
  Check,
  MessageSquare,
  Lock,
  Moon,
  Sun,
  ShieldCheck,
  Search,
  Users,
  Luggage,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
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
import { getTodayJST, isValidEmail, isValidPhone } from '@/lib/date-utils';

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
  initialPassengers?: number;
  initialLuggage?: number;
  initialHotelAddress?: string;
  onBackToCatalog?: () => void;
}

export default function AirportTransferModule({
  initialAirport = 'HND',
  initialDate,
  initialDirection = 'airport_to_hotel',
  initialPassengers = 2,
  initialLuggage = 2,
  initialHotelAddress = '',
}: AirportTransferModuleProps) {
  const [lang] = useLanguage();

  // Booking Flow Stage: 'vehicle' -> 'details'
  const [bookingStage, setBookingStage] = useState<'vehicle' | 'details'>('vehicle');

  // Direction & Route parameters
  const [direction] = useState<TransferDirection>(initialDirection);
  const [airport, setAirport] = useState<Airport>(initialAirport);
  const [travelDate, setTravelDate] = useState(() => initialDate || getTodayJST());
  const [passengers, setPassengers] = useState<number>(initialPassengers);
  const [luggageCount, setLuggageCount] = useState<number>(initialLuggage);
  const [hotelAddress, setHotelAddress] = useState<string>(initialHotelAddress);

  // Vehicle Selection State
  const [vehicleType, setVehicleType] = useState<VehicleType>(() => {
    if (initialPassengers > 4) return 'Wagon';
    return 'Foreign Large';
  });
  const [isMultiVehicle, setIsMultiVehicle] = useState<boolean>(() => initialPassengers > 4);

  // Flight Radar State
  const [flightNumber, setFlightNumber] = useState('');
  const [isLookingUpFlight, setIsLookingUpFlight] = useState(false);
  const [flightData, setFlightData] = useState<FlightInfo | null>(null);
  const [showManualTimeOverride, setShowManualTimeOverride] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Standard');

  // Guest Contact Details
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  // Special Requests & Add-ons
  const [showNotesField, setShowNotesField] = useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [nrtGreeter, setNrtGreeter] = useState<boolean>(false);
  const [vipMeetCount] = useState<number>(0);

  // Confirmation & Error State
  const [isConfirmedAgreement, setIsConfirmedAgreement] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modals
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
            ? `便名「${targetFlight}」のリアルタイム情報を照会中または運行管理デスクで確認いたします。そのままご予約いただけます。`
            : lang === 'zh'
            ? `实时雷达未能即时同步航班「${targetFlight}」，预订后调度中心将人工核对起降时间。`
            : `Live radar data not found for flight ${targetFlight}. Our dispatch desk will verify arrival details upon booking.`
        );
      }
    } catch (err) {
      console.error('Flight lookup error:', err);
    } finally {
      setIsLookingUpFlight(false);
    }
  };

  // Determine actual vehicle count & type
  const effectiveVehicleCount = isMultiVehicle && passengers > 4 ? 2 : 1;
  const effectiveVehicleType: VehicleType = isMultiVehicle && passengers > 4 ? 'Foreign Large' : vehicleType;

  // Real-time calculation for current selection
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

  // Pre-calculated pricing for vehicle cards
  const alphardPrice = useMemo(() => {
    const count = passengers > 4 ? 2 : 1;
    return calculateAirportTransferPrice({
      airport,
      vehicleType: 'Foreign Large',
      vehicleCount: count,
      timeOfDay,
      nrtGreeter: false,
      vipMeetCount: 0,
    }).totalAmount;
  }, [airport, passengers, timeOfDay]);

  const hiacePrice = useMemo(() => {
    return calculateAirportTransferPrice({
      airport,
      vehicleType: 'Wagon',
      vehicleCount: 1,
      timeOfDay,
      nrtGreeter: false,
      vipMeetCount: 0,
    }).totalAmount;
  }, [airport, timeOfDay]);

  const airportShort = airport === 'NRT' ? 'Narita (NRT)' : 'Haneda (HND)';
  const directionText =
    direction === 'airport_to_hotel'
      ? `${airportShort} ➔ ${hotelAddress || 'Tokyo Destination'}`
      : `${hotelAddress || 'Tokyo Hotel'} ➔ ${airportShort}`;

  const vehicleNameDisplay =
    effectiveVehicleCount > 1
      ? '2× Toyota Alphard VIP (Executive Convoy)'
      : effectiveVehicleType === 'Foreign Large'
      ? 'Toyota Alphard VIP Executive Lounge'
      : 'Toyota HiAce Grand Cabin VIP';

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

  // Multilingual UI Dictionary
  const t = {
    step1Title: {
      en: 'Select Chauffeur Vehicle',
      ja: '車両クラスの選択',
      zh: '选择专属车型',
      fr: 'Choisir Votre Véhicule',
      es: 'Seleccione Su Vehículo',
    }[lang],
    step1Subtitle: {
      en: 'All-inclusive fixed fares. Expressway tolls, driver fees, and flight delay buffer included.',
      ja: '高速道路料金・ガソリン代・フライト遅延無料待機を含む完全定額料金です。',
      zh: '全包一口价，已含高速费、燃油费及航班延误免费守候。',
      fr: 'Tarifs fixes tout compris. Péages, chauffeur et attente de vol inclus.',
      es: 'Tarifas fijas todo incluido. Peajes, chófer y espera de vuelo incluidos.',
    }[lang],
    step2Title: {
      en: 'Flight & Passenger Details',
      ja: 'フライト情報・お客様情報',
      zh: '航班与乘车信息',
      fr: 'Détails du Vol & Passagers',
      es: 'Detalles del Vuelo y Pasajeros',
    }[lang],
    changeVehicle: {
      en: 'Change Vehicle',
      ja: '車両を変更する',
      zh: '更换车型',
      fr: 'Changer de véhicule',
      es: 'Cambiar de vehículo',
    }[lang],
    editSearch: {
      en: 'Edit Route / Date',
      ja: '日程・区間を変更',
      zh: '修改行程/日期',
      fr: 'Modifier trajet/date',
      es: 'Modificar ruta/fecha',
    }[lang],
    alphardTitle: {
      en: passengers > 4 ? '2× Toyota Alphard VIP Convoy' : 'Toyota Alphard VIP Executive Lounge',
      ja: passengers > 4 ? 'アルファード VIP 2台運行（車列手配）' : 'トヨタ アルファード VIP エグゼクティブラウンジ',
      zh: passengers > 4 ? '丰田埃尔法 VIP 双车豪华车队' : '丰田埃尔法 VIP 尊贵行政座舱',
      fr: passengers > 4 ? 'Convoi 2× Toyota Alphard VIP' : 'Toyota Alphard Salon VIP Exécutif',
      es: passengers > 4 ? 'Convoy 2× Toyota Alphard VIP' : 'Toyota Alphard VIP Executive Lounge',
    }[lang],
    alphardDesc: {
      en: passengers > 4
        ? 'Two executive vehicles traveling in private convoy. Individual leather ottoman captain chairs for supreme relaxation.'
        : 'The definitive executive flagship in Japan. First-class reclining ottoman captain chairs, ambient quiet cabin, and private glass.',
      ja: passengers > 4
        ? 'オットマン付き本革キャプテンシートを搭載した高級アルファード2台でゆったりと移動いただけます。'
        : 'オットマン付き本革エグゼクティブラウンジシート搭載。静粛性と最高峰の乗り心地を誇るVIP専用フラッグシップです。',
      zh: passengers > 4
        ? '两辆高端埃尔法尊崇车队同行，每车专属真皮航空座椅，尽享顶奢舒适。'
        : '配备头等舱级电动腿托真皮航空座椅、双侧电动隐私侧门与独立静音座舱，政商要客及轻奢出行首选。',
      fr: 'Sièges capitaine inclinables en cuir, insonorisation d\'exception et vitres teintées VIP.',
      es: 'Asientos reclinables de cuero tipo capitán con otomana, cabina silenciosa y máxima privacidad.',
    }[lang],
    hiaceTitle: {
      en: 'Toyota HiAce Grand Cabin VIP',
      ja: 'トヨタ ハイエース グランドキャビン VIP',
      zh: '丰田海狮 Grand Cabin VIP 商务尊享版',
      fr: 'Toyota HiAce Grand Cabin VIP',
      es: 'Toyota HiAce Grand Cabin VIP',
    }[lang],
    hiaceDesc: {
      en: 'Extra-long wheelbase high-roof van. Expansive headroom, comfortable forward-facing seats, and cavernous luggage capacity for large families and groups.',
      ja: 'ハイルーフ＆スーパーロングボディ。圧倒的な室内高と広大なラゲッジスペースを誇り、大人数のグループやゴルフバッグ・大型スーツケースも余裕で積載。',
      zh: '高顶加长轴商务座驾，车内空间极为宽绰，可同时容纳多位贵宾及巨量行李箱与高尔夫球包。',
      fr: 'Van surélevé à empattement long, vaste hauteur sous plafond et compartiment bagages exceptionnel.',
      es: 'Furgoneta de techo alto y batalla larga, excelente espacio interior y enorme capacidad de equipaje.',
    }[lang],
    selectAlphard: {
      en: 'Select Alphard VIP →',
      ja: 'アルファードを予約する →',
      zh: '选择埃尔法座驾 →',
      fr: 'Sélectionner Alphard →',
      es: 'Seleccionar Alphard →',
    }[lang],
    selectHiace: {
      en: 'Select Grand Cabin →',
      ja: 'グランドキャビンを予約する →',
      zh: '选择海狮大车 →',
      fr: 'Sélectionner Grand Cabin →',
      es: 'Seleccionar Grand Cabin →',
    }[lang],
    leadPassengerSection: {
      en: 'Lead Passenger & Dispatch Contact',
      ja: '代表者様・緊急連絡先（配車デスク連絡用）',
      zh: '代表乘客与紧急联系人（调度中心沟通）',
      fr: 'Passager Principal & Contact Chauffeur',
      es: 'Pasajero Principal y Contacto del Conductor',
    }[lang],
    hideManualAdj: {
      en: 'Hide manual adjustments',
      ja: '手動設定を閉じる',
      zh: '收起手动设置',
      fr: 'Masquer les ajustements',
      es: 'Ocultar ajustes manuales',
    }[lang],
    showManualAdj: {
      en: 'Change airport or time slot manually',
      ja: '空港・時間帯を手動で変更する',
      zh: '手动调整抵离机场或服务时段',
      fr: 'Modifier l\'aéroport ou le créneau manuellement',
      es: 'Modificar aeropuerto o franja horaria manualmente',
    }[lang],
    flightNumberLabel: {
      en: 'Flight Number (IATA Code)',
      ja: '便名 / フライト番号（IATAコード）',
      zh: '航班号（IATA代码）',
      fr: 'Numéro de vol',
      es: 'Número de vuelo',
    }[lang],
    checkButton: {
      en: 'Track Flight',
      ja: '便名照会',
      zh: '查询动态',
      fr: 'Vérifier',
      es: 'Consultar',
    }[lang],
    checkingText: {
      en: 'Verifying...',
      ja: '照会中...',
      zh: '查询中...',
      fr: 'Vérification...',
      es: 'Consultando...',
    }[lang],
    flightDelayTitle: {
      en: 'Live Flight Tracking & Free Delay Wait Guarantee',
      ja: 'フライト常時監視＆遅延料金¥0完全無料保証',
      zh: '实时航班雷达跟踪与延误¥0免费守候',
      fr: 'Suivi des vols en direct & attente gratuite garantie',
      es: 'Seguimiento de vuelos en vivo y espera gratuita garantizada',
    }[lang],
    flightDelayDesc: {
      en: 'We continuously monitor inbound flights in real time. Chauffeur dispatch automatically synchronizes with actual touchdown. Flight delays incur zero surcharge.',
      ja: '運行管理デスクがリアルタイムで着陸状況を監視。遅延が発生した場合も追加料金は一切発生いたしません（¥0完全無料）。',
      zh: '调度中心全天候动态监控抵日航班，根据实际着陆时间自动调整车辆就位时间，航班延误零加价。',
      fr: 'Nous suivons votre vol en direct et adaptons l\'arrivée de votre chauffeur sans frais supplémentaires.',
      es: 'Monitoreamos su vuelo en vivo y ajustamos la llegada del chófer sin ningún cargo adicional.',
    }[lang],
    hotelLabel: {
      en: direction === 'airport_to_hotel' ? 'Destination Hotel Name or Tokyo Address' : 'Pickup Hotel Name or Tokyo Address',
      ja: direction === 'airport_to_hotel' ? 'お届け先ホテル名・東京都内住所' : 'お迎え先ホテル名・東京都内住所',
      zh: direction === 'airport_to_hotel' ? '目的地酒店名称或东京都内详细地址' : '出发地酒店名称或东京都内详细地址',
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
      en: 'Email for Booking Voucher & Receipt',
      ja: '予約確認書・領収書送信用メールアドレス',
      zh: '接收预订确认函与凭证的电子邮箱',
      fr: 'Email pour confirmation et reçu',
      es: 'Correo para confirmación y recibo',
    }[lang],
    guestPhoneLabel: {
      en: 'Mobile Phone / WhatsApp (with country code)',
      ja: '緊急連絡先・WhatsApp（国番号付き 例: +81 90...）',
      zh: '联系电话 / WhatsApp（含国家区号 如: +81 90...）',
      fr: 'Téléphone portable / WhatsApp (avec indicatif pays)',
      es: 'Teléfono móvil / WhatsApp (con código de país)',
    }[lang],
    specialNotesToggle: {
      en: '+ Add Special Requests (Child safety seat, extra luggage, or driver notes)',
      ja: '+ 特別リクエスト・連絡事項の追加（チャイルドシート・ゴルフバッグ等）',
      zh: '+ 添加个性化备注（儿童安全座椅、超大行李、特殊需求等）',
      fr: '+ Ajouter une demande spéciale (siège enfant, bagages supplémentaires)',
      es: '+ Añadir solicitudes especiales (silla de bebé, equipaje extra)',
    }[lang],
    greeterOptionTitle: {
      en: 'Dedicated Narita Arrival Lobby Greeter',
      ja: '成田空港 専用サインボード・グリーター手配',
      zh: '成田机场专属举牌迎宾员服务',
      fr: 'Accueil personnalisé au hall des arrivées de Narita',
      es: 'Recepción personalizada en la sala de llegadas de Narita',
    }[lang],
    greeterOptionDesc: {
      en: 'Dedicated staff waiting at the arrival lobby exit with a personalized nameboard to escort guests directly to the chauffeur vehicle (+¥10,000 JPY).',
      ja: '到着ロビー出口にて専任スタッフがお名前入りサインボードを持ってお出迎えし、待機車両までエスコートいたします（+¥10,000）。',
      zh: '专属地勤人员手持定制姓名牌在到达大厅出口迎候，引导贵宾直达专车上车点（+¥10,000）。',
      fr: 'Un agent vous attend avec un panneau à votre nom pour vous guider jusqu\'au véhicule (+¥10 000).',
      es: 'Personal dedicado le espera con un cartel con su nombre para acompañarle al vehículo (+¥10,000).',
    }[lang],
    summaryTitle: {
      en: 'Fare Ledger & Summary',
      ja: '運賃内訳・お見積り',
      zh: '费用明细与明细账单',
      fr: 'Détail de la Facturation',
      es: 'Desglose del Precio',
    }[lang],
    baseFareLabel: {
      en: 'Base Chauffeur Transfer',
      ja: '基本運賃（認可定額）',
      zh: '标准专车接送基准运费',
      fr: 'Tarif de base transfert',
      es: 'Tarifa base de traslado',
    }[lang],
    nightSurchargeLabel: {
      en: 'Late Night Surcharge (22:00–05:00, +20%)',
      ja: '深夜早朝割増料金 (22:00〜05:00, +20%)',
      zh: '夜间服务费 (22:00–05:00, +20%)',
      fr: 'Majoration de nuit (+20%)',
      es: 'Recargo nocturno (+20%)',
    }[lang],
    tollsInclusive: {
      en: 'Expressway tolls & chauffeur fuel included',
      ja: '高速道路通行料・燃料代 全額込み',
      zh: '包含全程高速通行费与燃油费',
      fr: 'Péages d\'autoroute et carburant inclus',
      es: 'Peajes de autopista y combustible incluidos',
    }[lang],
    delayBufferInclusive: {
      en: 'Up to 90 min flexible delay wait included (¥0)',
      ja: 'フライト遅延90分無料待機（追加費用¥0）',
      zh: '航班延误免费等待90分钟（¥0加价）',
      fr: 'Attente gratuite jusqu\'à 90 min en cas de retard',
      es: 'Hasta 90 min de espera gratuita por retrasos',
    }[lang],
    mandatoryAgreement: {
      en: 'I confirm that the passenger count, luggage volume, and travel schedule are correct, and I accept the MLIT-licensed passenger transport terms.',
      ja: '乗車人数・荷物個数・運行日程に相違がないことを確認し、国土交通省認可 一般乗用旅客自動車運送約款に同意します。',
      zh: '我确认乘车人数、行李件数及出行信息准确无误，并同意正规绿牌商业客运服务条款。',
      fr: 'Je confirme l\'exactitude des passagers, bagages et horaires, et j\'accepte les conditions de transport officiel.',
      es: 'Confirmo que los pasajeros, equipaje y fechas son correctos, y acepto las condiciones oficiales de transporte.',
    }[lang],
    instantPayButton: {
      en: 'Complete Secure Stripe Checkout',
      ja: 'Stripeで安全に決済・予約確定',
      zh: 'Stripe 极速安全支付预订',
      fr: 'Paiement Sécurisé Stripe',
      es: 'Pago Seguro con Stripe',
    }[lang],
    whatsappButton: {
      en: 'WhatsApp 24/7 Concierge Support',
      ja: 'WhatsApp 24時間コンシェルジュ相談',
      zh: 'WhatsApp 24小时专属人工客服',
      fr: 'Concierge WhatsApp 24/7',
      es: 'Atención WhatsApp 24/7',
    }[lang],
  };

  const handleInitiatePayment = () => {
    if (!hotelAddress.trim()) {
      setValidationError(
        lang === 'ja'
          ? 'お届け先ホテル名または東京都内住所をご入力ください。'
          : lang === 'zh'
          ? '请输入送达目的地酒店名称或东京都内详细地址。'
          : 'Please enter your destination hotel or Tokyo address.'
      );
      return;
    }
    if (!guestName.trim()) {
      setValidationError(
        lang === 'ja'
          ? '代表者様のお名前をご入力ください。'
          : lang === 'zh'
          ? '请输入代表乘客姓名。'
          : 'Please enter the lead guest full name.'
      );
      return;
    }
    if (!guestEmail.trim() || !isValidEmail(guestEmail)) {
      setValidationError(
        lang === 'ja'
          ? '有効な予約確認書送信用メールアドレスをご入力ください。'
          : lang === 'zh'
          ? '请输入接收预订确认凭证的有效电子邮箱。'
          : 'Please enter a valid email address for confirmation.'
      );
      return;
    }
    if (guestPhone.trim() && !isValidPhone(guestPhone)) {
      setValidationError(
        lang === 'ja'
          ? '国際電話番号（国番号付き 例: +81 90...）をご入力ください。'
          : lang === 'zh'
          ? '请输入包含国家区号的有效联系电话（例如: +81 90...）。'
          : 'Please enter a valid phone number with country code.'
      );
      return;
    }
    if (!isConfirmedAgreement) {
      setValidationError(
        lang === 'ja'
          ? 'お支払い手続きの前に、利用規約への同意にチェックを入れてください。'
          : lang === 'zh'
          ? '请在支付前勾选确认条款。'
          : 'Please accept the transport agreement before proceeding to checkout.'
      );
      return;
    }
    setValidationError(null);
    setIsStripeModalOpen(true);
  };

  const whatsAppUrl = `https://wa.me/818038582729?text=${encodeURIComponent(
    `Hello SK Limo! I am booking an airport transfer:\n` +
    `• Route: ${directionText}\n` +
    `• Date: ${travelDate}\n` +
    `• Vehicle: ${vehicleNameDisplay}\n` +
    `• Guests: ${passengers} Pax, ${luggageCount} Bags\n` +
    `• Flight: ${flightData?.flightNumber || flightNumber || 'TBD'}\n` +
    `• Quoted Rate: ¥${pricing.totalAmount.toLocaleString()} JPY (All-Inclusive)\n` +
    `Please assist with my reservation.`
  )}`;

  const quickFlightSamples = ['EK312', 'NH110', 'JL5', 'SQ638', 'CX548', 'UA79', 'DL295'];

  return (
    <div className="w-full text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      
      {/* ── STAGE 1: VEHICLE SELECTION (WHEELY / BLACKLANE STYLE) ── */}
      {bookingStage === 'vehicle' && (
        <div className="space-y-6">
          
          {/* Header & Route Summary Bar */}
          <div className="bg-stone-900 dark:bg-[#0A0D14] border border-stone-800 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 text-stone-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A059] font-bold">
                    STEP 2 OF 3 / VEHICLE SELECTION
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="text-xs text-stone-400">
                    {t.step1Subtitle}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t.step1Title}
                </h2>
              </div>

              {/* Compact Route Summary Pill */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 bg-stone-800/80 border border-stone-700/80 px-3.5 py-1.5 rounded-xl text-xs text-stone-300">
                  <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="font-semibold text-white">{directionText}</span>
                  <span className="text-stone-500">•</span>
                  <span>{travelDate}</span>
                  <span className="text-stone-500">•</span>
                  <span>{passengers} Pax, {luggageCount} Bags</span>
                </div>

                <a
                  href="#trip-search-tab"
                  className="text-[11px] font-semibold text-[#C5A059] hover:text-[#d6b46e] px-2.5 py-1.5 rounded-lg border border-[#C5A059]/30 hover:border-[#C5A059] transition-colors"
                >
                  {t.editSearch}
                </a>
              </div>
            </div>
          </div>

          {/* Group Capacity Notice if > 4 Pax */}
          {passengers > 4 && (
            <div className="p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl text-xs text-stone-800 dark:text-stone-200 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900 dark:text-white">
                  {lang === 'ja' ? '5名様以上の団体・ご家族のご乗車' : 'Group Travel: 5 or More Guests'}
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                  {lang === 'ja'
                    ? '1台でゆったり移動できる「ハイエース グランドキャビン（最大9名）」、または最高峰の快適性を両立する「アルファード VIP 2台運行（車列手配）」からお選びいただけます。'
                    : 'Choose the spacious HiAce Grand Cabin (up to 9 guests in a single executive van) or 2× Toyota Alphard VIP vehicles traveling in private convoy.'}
                </p>
              </div>
            </div>
          )}

          {/* The 2 Rich Vehicle Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CARD 1: Toyota Alphard VIP Executive Lounge */}
            <div className={`relative bg-white dark:bg-[#0E131F] rounded-3xl border transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md ${
              vehicleType === 'Foreign Large'
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30'
                : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}>
              {/* Vehicle Image Banner */}
              <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden">
                <Image
                  src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                  alt="Toyota Alphard VIP Executive"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Class Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40">
                    <Sparkles className="w-3 h-3" />
                    VIP EXECUTIVE CHAUFFEUR
                  </span>
                </div>

                {/* Capacity Badges Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      {passengers > 4 ? 'Max 8 Pax (2× Cars)' : 'Max 4 Pax'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium">
                      <Luggage className="w-3.5 h-3.5 text-[#C5A059]" />
                      {passengers > 4 ? 'Max 8 Bags' : 'Max 4 Bags'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-300 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                    MLIT Certified
                  </span>
                </div>
              </div>

              {/* Card Details & Inclusions */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      {t.alphardTitle}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {t.alphardDesc}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Ottoman Reclining Captains</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>High-Speed In-Cabin Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Chilled Natural Spring Water</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Zero Delay Fee Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">
                      All-Inclusive Fixed Fare
                    </span>
                    <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-mono">
                      ¥{alphardPrice.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-stone-500">JPY</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Foreign Large');
                      if (passengers > 4) {
                        setIsMultiVehicle(true);
                      } else {
                        setIsMultiVehicle(false);
                      }
                      setBookingStage('details');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="cursor-pointer px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 dark:bg-[#C5A059] dark:hover:bg-[#d4b068] text-white dark:text-stone-950 shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>{t.selectAlphard}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Toyota HiAce Grand Cabin VIP */}
            <div className={`relative bg-white dark:bg-[#0E131F] rounded-3xl border transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md ${
              vehicleType === 'Wagon' && !isMultiVehicle
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30'
                : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}>
              {/* Vehicle Image Banner */}
              <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden">
                <Image
                  src="/images/fleet-toyota-hiace-exterior-1477x1108.jpg"
                  alt="Toyota HiAce Grand Cabin"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Class Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40">
                    <Sparkles className="w-3 h-3" />
                    EXECUTIVE GROUP VAN
                  </span>
                </div>

                {/* Capacity Badges Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      Up to 9 Pax
                    </span>
                    <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium">
                      <Luggage className="w-3.5 h-3.5 text-[#C5A059]" />
                      Up to 9+ Bags
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-300 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                    High-Roof Long Body
                  </span>
                </div>
              </div>

              {/* Card Details & Inclusions */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                      {t.hiaceTitle}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {t.hiaceDesc}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Cavernous Luggage Bay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>High-Roof Commuter Cabin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Chilled Natural Spring Water</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Zero Delay Fee Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">
                      All-Inclusive Fixed Fare
                    </span>
                    <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-mono">
                      ¥{hiacePrice.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-stone-500">JPY</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType('Wagon');
                      setIsMultiVehicle(false);
                      setBookingStage('details');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="cursor-pointer px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 dark:bg-[#C5A059] dark:hover:bg-[#d4b068] text-white dark:text-stone-950 shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>{t.selectHiace}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ── STAGE 2: PASSENGER & FLIGHT DETAILS + 1-CLICK STRIPE CHECKOUT ── */}
      {bookingStage === 'details' && (
        <div className="space-y-6">

          {/* Top Bar: Selected Vehicle Summary & Return Button */}
          <div className="bg-stone-900 dark:bg-[#0A0D14] border border-stone-800 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 text-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBookingStage('vehicle')}
                className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.changeVehicle}</span>
              </button>
              <span className="text-stone-600">•</span>
              <div>
                <span className="text-xs text-stone-400 block font-mono">SELECTED VEHICLE:</span>
                <span className="text-sm font-bold text-white">
                  {vehicleNameDisplay} · ¥{pricing.totalAmount.toLocaleString()} JPY
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-400 flex items-center gap-2">
              <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{directionText}</span>
              <span className="text-stone-600">•</span>
              <span>{travelDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Flight Tracking & Guest Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Section 1: Flight Tracking & Arrival Radar */}
              <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                      {t.step2Title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#C5A059] font-medium">
                    AeroDataBox Live Sync
                  </span>
                </div>

                {/* Flight Number Search Input */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                    {t.flightNumberLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. EK312, NH110, JL5, SQ638"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLookupFlight();
                      }}
                      className="w-full uppercase bg-stone-50 dark:bg-[#161B26] border border-stone-200 dark:border-stone-700/80 rounded-xl px-4 py-3 text-xs text-stone-900 dark:text-white font-bold tracking-wider focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => handleLookupFlight()}
                      disabled={isLookingUpFlight}
                      className="cursor-pointer bg-stone-900 hover:bg-stone-800 dark:bg-[#C5A059] dark:hover:bg-[#d4b068] text-white dark:text-stone-950 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
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

                {/* Popular Flight Sample Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-stone-400">Popular:</span>
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
                          ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059]'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                {/* Live Flight Radar Status Preview */}
                {flightData && (
                  <div className="bg-stone-50 dark:bg-[#131b2c] border border-stone-200 dark:border-stone-700/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#C5A059]" />
                        <span className="font-bold text-xs text-stone-900 dark:text-white">
                          {flightData.flightNumber} · {flightData.airline}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-0.5 rounded-full font-mono">
                        {flightData.airportName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Scheduled Landing</span>
                        <span className="font-bold text-stone-900 dark:text-white font-mono">{flightData.arrivalTime} JST</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Terminal</span>
                        <span className="font-medium text-stone-800 dark:text-stone-200">{flightData.terminal}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-stone-400 block">Time Slot</span>
                        {flightData.isLateNight ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500">
                            <Moon className="w-3 h-3" />
                            Late Night (+20%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                            <Sun className="w-3 h-3" />
                            Standard Daytime
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Flight Delay Protection Note */}
                <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 rounded-2xl p-4 flex items-start gap-3 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-stone-900 dark:text-white">
                      {t.flightDelayTitle}
                    </span>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      {t.flightDelayDesc}
                    </p>
                  </div>
                </div>

                {/* Manual Override Option */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualTimeOverride(!showManualTimeOverride)}
                    className="text-[11px] text-[#C5A059] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{showManualTimeOverride ? t.hideManualAdj : t.showManualAdj}</span>
                  </button>

                  {showManualTimeOverride && (
                    <div className="mt-3 p-3.5 bg-stone-50 dark:bg-[#161B26] rounded-xl border border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">Airport</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAirport('HND')}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                              airport === 'HND' ? 'bg-[#C5A059] text-stone-950 border-[#C5A059]' : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            Haneda (HND)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAirport('NRT')}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                              airport === 'NRT' ? 'bg-[#C5A059] text-stone-950 border-[#C5A059]' : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            Narita (NRT)
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">Time Slot</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTimeOfDay('Standard')}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                              timeOfDay === 'Standard' ? 'bg-[#C5A059] text-stone-950 border-[#C5A059]' : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            Standard (Day)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimeOfDay('Late Night')}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                              timeOfDay === 'Late Night' ? 'bg-[#C5A059] text-stone-950 border-[#C5A059]' : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
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

              {/* Section 2: Hotel & Tokyo Destination Address */}
              <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                    {t.hotelLabel} <span className="text-red-500">*</span>
                  </h3>
                </div>

                <GooglePlacesAutocomplete
                  value={hotelAddress}
                  onChange={(val) => {
                    setHotelAddress(val);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Search hotel (e.g. Aman Tokyo, Grand Hyatt, Ritz-Carlton) or Tokyo address..."
                />
              </div>

              {/* Section 3: Lead Passenger Contact Details */}
              <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                    {t.leadPassengerSection}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.guestNameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Hamilton"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#161B26] border border-stone-200 dark:border-stone-700/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                      {t.guestEmailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. client@luxury.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#161B26] border border-stone-200 dark:border-stone-700/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    {t.guestPhoneLabel}
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +81 80 1234 5678 or +1 415 555 0199"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#161B26] border border-stone-200 dark:border-stone-700/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Narita Greeter Toggle if NRT */}
                {airport === 'NRT' && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <label className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-[#161B26] rounded-xl border border-stone-200 dark:border-stone-700/80 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={nrtGreeter}
                        onChange={(e) => setNrtGreeter(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#C5A059] border-stone-300 focus:ring-[#C5A059] cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-stone-900 dark:text-white block">
                          {t.greeterOptionTitle}
                        </span>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                          {t.greeterOptionDesc}
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Collapsible Special Requests */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNotesField(!showNotesField)}
                    className="text-xs text-[#C5A059] hover:underline font-semibold cursor-pointer"
                  >
                    {t.specialNotesToggle}
                  </button>

                  {showNotesField && (
                    <div className="mt-2.5">
                      <textarea
                        rows={2}
                        placeholder="Child booster seat requested, 2 sets of golf clubs, extra luggage assistance..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-[#161B26] border border-stone-200 dark:border-stone-700/80 rounded-xl p-3 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right Column: Sticky Institutional Order Summary & Stripe Checkout (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white dark:bg-[#0E131F] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-sm">
                
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    {t.summaryTitle}
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest text-[#C5A059] font-bold uppercase">
                    ALL-INCLUSIVE FIXED
                  </span>
                </div>

                {/* Trip Route Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Route</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{directionText}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Date & Flight</span>
                    <span className="font-mono text-stone-900 dark:text-white">
                      {travelDate} • {flightData?.flightNumber || flightNumber || 'Flight Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Vehicle Class</span>
                    <span className="font-semibold text-[#C5A059]">{vehicleNameDisplay}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Passengers / Bags</span>
                    <span className="font-medium text-stone-900 dark:text-white">
                      {passengers} Pax / {luggageCount} Luggage
                    </span>
                  </div>
                </div>

                {/* Line Items Breakdown */}
                <div className="py-3 border-y border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 dark:text-stone-400">{t.baseFareLabel}</span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-white">
                      ¥{pricing.baseFare.toLocaleString()} JPY
                    </span>
                  </div>

                  {pricing.lateNightSurcharge > 0 && (
                    <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                      <span>{t.nightSurchargeLabel}</span>
                      <span className="font-mono font-semibold">
                        +¥{pricing.lateNightSurcharge.toLocaleString()} JPY
                      </span>
                    </div>
                  )}

                  {pricing.nrtGreeterFee > 0 && (
                    <div className="flex justify-between items-center text-[#C5A059]">
                      <span>Narita Dedicated Greeter</span>
                      <span className="font-mono font-semibold">
                        +¥{pricing.nrtGreeterFee.toLocaleString()} JPY
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {t.tollsInclusive}
                    </span>
                    <span className="font-mono font-semibold">¥0</span>
                  </div>

                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {t.delayBufferInclusive}
                    </span>
                    <span className="font-mono font-semibold">¥0</span>
                  </div>
                </div>

                {/* Mandatory Agreement Checkbox */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isConfirmedAgreement}
                      onChange={(e) => {
                        setIsConfirmedAgreement(e.target.checked);
                        if (validationError) setValidationError(null);
                      }}
                      className="w-4 h-4 mt-0.5 rounded text-[#C5A059] border-stone-300 focus:ring-[#C5A059] cursor-pointer"
                    />
                    <span className="text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                      {t.mandatoryAgreement} <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>

                  {validationError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>

                {/* Total & 1-Click Stripe Payment Button */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">Total Rate:</span>
                    <span className="text-3xl font-extrabold text-stone-900 dark:text-white font-mono">
                      ¥{pricing.totalAmount.toLocaleString()} <span className="text-xs text-stone-400 font-normal">JPY</span>
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      className="w-full cursor-pointer py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 dark:bg-[#C5A059] dark:hover:bg-[#d4b068] text-white dark:text-stone-950 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{t.instantPayButton}</span>
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-stone-200 dark:border-stone-700/80 hover:border-stone-400 text-stone-700 dark:text-stone-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>{t.whatsappButton}</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

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
