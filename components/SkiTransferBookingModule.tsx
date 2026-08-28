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
import { getTodayJST, getFutureDateJST, isValidEmail, isValidPhone } from '@/lib/date-utils';

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
  const [travelDate, setTravelDate] = useState(() => {
    if (initialDate) return initialDate;
    return getFutureDateJST(5);
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

  const t = {
    backToCatalog: {
      ja: 'すべてのツアー一覧に戻る',
      zh: '返回全部行程列表',
      fr: 'Retour au catalogue',
      es: 'Volver al catálogo',
      en: 'Back to Explore & Catalog',
    }[lang],
    badgeTop: {
      ja: '4WD 冬期スキー直行専属ハイヤー',
      zh: '4WD 雪季滑雪直达专属专车',
      fr: 'Transfert Ski 4x4 Privé & Direct',
      es: 'Traslado de Esquí Privado 4x4',
      en: '4WD Winter Ski Direct Transfer',
    }[lang],
    step1Title: {
      ja: '1. スキーリゾートを選択',
      zh: '1. 选择目的地滑雪场',
      fr: '1. Choisir la Station de Ski',
      es: '1. Seleccionar Estación de Esquí',
      en: '1. Select Ski Resort Destination',
    }[lang],
    step2Title: {
      ja: '2. ご出発地・乗車場所',
      zh: '2. 出发地与接送点',
      fr: '2. Point de Départ',
      es: '2. Punto de Salida',
      en: '2. Departure Point',
    }[lang],
    pickupHaneda: {
      ja: '羽田空港 (HND)',
      zh: '羽田国际机场 (HND)',
      fr: 'Aéroport d\'Haneda (HND)',
      es: 'Aeropuerto de Haneda (HND)',
      en: 'Haneda Airport (HND)',
    }[lang],
    pickupNarita: {
      ja: '成田空港 (NRT)',
      zh: '成田国际机场 (NRT)',
      fr: 'Aéroport de Narita (NRT)',
      es: 'Aeropuerto de Narita (NRT)',
      en: 'Narita Airport (NRT)',
    }[lang],
    pickupTokyo: {
      ja: '東京都内ホテル / ご指定住所',
      zh: '东京市内酒店 / 指定地点',
      fr: 'Hôtel à Tokyo (Centre)',
      es: 'Hotel en Tokio (Centro)',
      en: 'Tokyo Downtown Hotel',
    }[lang],
    step3Title: {
      ja: '3. 4WD 冬期専用車両クラス',
      zh: '3. 选择 4WD 雪季专属车型',
      fr: '3. Véhicule 4x4 Équipé Neige',
      es: '3. Vehículo 4x4 Equipado para Nieve',
      en: '3. 4WD Winter Fleet Class',
    }[lang],
    studlessIncluded: {
      ja: '全車スタッドレスタイヤ標準装備',
      zh: '全系标配高性能雪地防滑胎',
      fr: 'Pneus Neige Inclus Standard',
      es: 'Neumáticos de Nieve Incluidos',
      en: 'Studless Tires Included',
    }[lang],
    step4Title: {
      ja: '4. 目的地シャレー・ご乗車詳細',
      zh: '4. 木屋/酒店地址与乘客信息',
      fr: '4. Chalet de Destination & Passagers',
      es: '4. Chalet de Destino y Pasajeros',
      en: '4. Destination Chalet & Passengers',
    }[lang],
    dateLabel: {
      ja: '送迎日程',
      zh: '出行日期',
      fr: 'Date du trajet',
      es: 'Fecha del traslado',
      en: 'Transfer Date',
    }[lang],
    paxLabel: {
      ja: 'ご乗車人数',
      zh: '出行人数',
      fr: 'Passagers',
      es: 'Pasajeros',
      en: 'Guest Count',
    }[lang],
    guestsUnit: {
      ja: '名様',
      zh: '位贵宾',
      fr: 'Personnes',
      es: 'Personas',
      en: 'Guests',
    }[lang],
    chaletLabel: {
      ja: '目的地の宿・シャレー名または住所',
      zh: '目的地的木屋、酒店名称或详细地址',
      fr: 'Nom du chalet / hôtel ou adresse de destination',
      es: 'Nombre del chalet / hotel o dirección de destino',
      en: 'Destination Chalet / Hotel Name & Address',
    }[lang],
    chaletPlaceholder: {
      ja: '例: The Happo、白馬和田野シャレー、野沢温泉ホテル など',
      zh: '例如: The Happo、白马和田野度假木屋、野泽温泉酒店等',
      fr: 'Ex: The Happo, Chalet Hakuba Wadano, Hôtel Nozawa Onsen',
      es: 'Ej: The Happo, Chalet Hakuba Wadano, Hotel Nozawa Onsen',
      en: 'e.g. The Happo, Hakuba Wadano Chalet, Nozawa Onsen Hotel',
    }[lang],
    leadNameLabel: {
      ja: '代表者様氏名',
      zh: '代表乘客全名',
      fr: 'Nom du passager principal',
      es: 'Nombre del pasajero principal',
      en: 'Lead Guest Full Name',
    }[lang],
    emailLabel: {
      ja: '予約確認書送信先メールアドレス',
      zh: '接收确认单电子邮箱',
      fr: 'Email de confirmation',
      es: 'Correo de confirmación',
      en: 'Confirmation Email',
    }[lang],
    addSecondVehicleTitle: {
      ja: '+ 2台目サポート車両を追加 (荷物積載・大人数)',
      zh: '+ 追加第二辆随行保障车 (大量雪具与多人团队)',
      fr: '+ Ajouter un 2e véhicule (Bagages volumineux & Groupes)',
      es: '+ Añadir 2º vehículo (Equipaje voluminoso y Grupos)',
      en: 'Add 2nd Support Vehicle (Luggage & Large Group)',
    }[lang],
    addSecondVehicleDesc: {
      ja: 'スキー板・スノボケースの大量積載や、9名を超えるグループに最適な2台車隊運行。',
      zh: '双车编队护航，专为超量雪具包、雪板及超过9人的大型团队配置。',
      fr: 'Convoi double 4x4 pour excès de housses de ski et groupes de plus de 9 personnes.',
      es: 'Convoy doble 4x4 para exceso de material de esquí y grupos de más de 9 personas.',
      en: 'Dual 4WD convoy for excess ski bags, snowboards, or groups over 9 guests.',
    }[lang],
    memoLabel: {
      ja: '追加車両・特記事項メモ',
      zh: '特殊需求与行程备注',
      fr: 'Remarques & Besoins Particuliers',
      es: 'Peticiones Especiales y Notas',
      en: 'Additional Vehicle Memo & Special Requests',
    }[lang],
    memoPlaceholder: {
      ja: '例: スキー板の本数、チャイルドシート希望、途中SAでの休憩希望など',
      zh: '例如: 滑雪板数量、需要儿童安全座椅、希望在特定服务区休息等',
      fr: 'Ex: Nombre de housses de ski, sièges bébé, arrêts particuliers souhaités...',
      es: 'Ej: Número de bolsas de esquí, sillas de bebé, paradas deseadas en ruta...',
      en: 'e.g. Extra ski bag volume, child safety seats required, specific rest stop preferences.',
    }[lang],
    agreementText: {
      ja: 'スキー送迎日程、人数、目的地シャレー情報を確認し、正規運送事業運行規定およびキャンセルポリシーに同意します。',
      zh: '我确认滑雪接送日期、人数及木屋信息准确无误，并同意正规营运条款及取消政策。',
      fr: 'Je confirme l\'exactitude des dates, du nombre de passagers et du chalet, et j\'accepte les conditions de transport.',
      es: 'Confirmo que las fechas, pasajeros y chalet son correctos, y acepto las condiciones de transporte.',
      en: 'I confirm my ski transfer date, guest count, and destination chalet details are accurate, and I agree to the licensed commercial carrier terms.',
    }[lang],
    quoteTitle: {
      ja: 'スキー定額見積り',
      zh: '滑雪专车定额明细',
      fr: 'Devis Fixe Ski Direct',
      es: 'Presupuesto Fijo de Esquí',
      en: 'Ski Direct Quote',
    }[lang],
    allInclusive: {
      ja: '完全定額・高速代込',
      zh: '全包一口价',
      fr: 'Tout Compris Garanti',
      es: 'Todo Incluido Garantizado',
      en: 'All-Inclusive Fixed',
    }[lang],
    destinationLabel: { ja: '目的地:', zh: '目的地:', fr: 'Destination :', es: 'Destino:', en: 'Destination:' }[lang],
    departureLabel: { ja: '出発地:', zh: '出发地:', fr: 'Départ :', es: 'Salida:', en: 'Departure:' }[lang],
    vehicleLabel: { ja: '運行車両:', zh: '服务车型:', fr: 'Véhicule :', es: 'Vehículo:', en: 'Vehicle:' }[lang],
    supportVehicleLabel: { ja: 'サポート車両:', zh: '随行车辆:', fr: 'Véhicule de soutien :', es: 'Vehículo de apoyo:', en: 'Support Vehicle:' }[lang],
    supportVehicleVal: { ja: '+ 4WD サポート車両 1台', zh: '+ 2号随行保障车 1台', fr: '+ 2e véhicule 4x4', es: '+ 2º vehículo 4x4', en: '+ 2nd 4WD Convoy Vehicle' }[lang],
    incTires: {
      ja: 'ブリヂストン製スタッドレスタイヤ完備',
      zh: '普利司通高性能防滑雪地胎',
      fr: 'Pneus neige Bridgestone Blizzak inclus',
      es: 'Neumáticos de nieve Bridgestone Blizzak',
      en: 'Bridgestone Blizzak winter studless tires',
    }[lang],
    incTolls: {
      ja: '高速道路通行料・ガソリン代込',
      zh: '包含全程高速公路过路费与燃油费',
      fr: 'Péages d\'autoroute et carburant inclus',
      es: 'Peajes de autopista y combustible incluidos',
      en: 'Expressway highway tolls & fuel included',
    }[lang],
    incDoorToDoor: {
      ja: 'シャレー・ホテル玄関直行ドアtoドア',
      zh: '点对点直达木屋酒店门口',
      fr: 'Dépose directe devant le chalet',
      es: 'Llegada directa a la puerta del chalet',
      en: 'Door-to-door direct chalet drop-off',
    }[lang],
    totalFareLabel: { ja: '定額総額 (税込):', zh: '全包总价 (含税):', fr: 'Tarif Total :', es: 'Tarifa Total:', en: 'Total Fare:' }[lang],
    instantStripeBtn: {
      ja: 'Stripe 即時オンライン決済',
      zh: 'Stripe 在线安全预订支付',
      fr: 'Paiement Sécurisé Immédiat Stripe',
      es: 'Pago Seguro Inmediato con Stripe',
      en: 'Instant Stripe Checkout',
    }[lang],
    whatsAppBtn: {
      ja: 'WhatsApp で空車確認・ご相談',
      zh: '通过 WhatsApp 确认空车并预订',
      fr: 'WhatsApp Conciergerie (Devis Pré-rempli)',
      es: 'WhatsApp Conserjería (Datos Completados)',
      en: 'WhatsApp Concierge (Auto-Fill Details)',
    }[lang],
  };

  const pickupLabel =
    pickupPoint === 'nrt'
      ? t.pickupNarita
      : pickupPoint === 'hnd'
      ? t.pickupHaneda
      : t.pickupTokyo;

  const vehicleName =
    selectedVehicle === 'alphard'
      ? 'Toyota Alphard 4WD (1–4 Pax)'
      : selectedVehicle === 'granace'
      ? 'Toyota Granace VIP 4WD (1–5 Pax)'
      : 'Toyota HiAce Grand Cabin (1–9 Pax)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'winter_transfer',
    destinationId: currentResort.id,
    pickupId: pickupPoint,
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
          : lang === 'zh'
          ? `当前选择的车型最多可容纳${maxCap}人（当前已选${passengers}人）。请升级为更大车型或追加第二辆保障车。`
          : `${selectedVehicle === 'alphard' ? 'Toyota Alphard (Premium)' : 'Toyota Granace (Ultra Premium)'} capacity is max ${maxCap} guests. You have selected ${passengers} guests. Please choose a larger vehicle or add a 2nd support vehicle.`
      );
      return;
    }
    if (!chaletAddress.trim()) {
      setValidationError(
        lang === 'ja'
          ? '目的地の宿・シャレー名または住所をご入力ください。'
          : lang === 'zh'
          ? '请输入目的地木屋、酒店名称或具体地址。'
          : 'Please enter your destination chalet, hotel name, or address.'
      );
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setValidationError(
        lang === 'ja'
          ? '代表者様のお名前と予約確認書送信用メールアドレスをご入力ください。'
          : lang === 'zh'
          ? '请输入代表乘客姓名与确认单电子邮箱。'
          : 'Please enter the lead guest name and confirmation email address.'
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
    if (travelDate < getTodayJST()) {
      setValidationError(
        lang === 'ja'
          ? '送迎日程に過去の日付を選択することはできません。本日以降の日程をご指定ください。'
          : lang === 'zh'
          ? '滑雪接送日期不能为过去的时间，请选择今天或未来的日期。'
          : 'Transfer date cannot be in the past. Please select today or a future date.'
      );
      return;
    }
    if (!isConfirmedAgreement) {
      setValidationError(
        lang === 'ja'
          ? 'お支払い前に同意のチェックボックスを選択してください。'
          : lang === 'zh'
          ? '请在支付前勾选确认条款。'
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
            <span>{t.backToCatalog}</span>
          </button>
        )}
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3 py-1 rounded-full ml-auto">
          <Snowflake className="w-3 h-3" />
          <span>{t.badgeTop}</span>
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
                    {t.step1Title}
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
                    {t.step2Title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'hnd' as const, label: t.pickupHaneda },
                  { id: 'nrt' as const, label: t.pickupNarita },
                  { id: 'tokyo' as const, label: t.pickupTokyo },
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
                    {t.step3Title}
                  </h2>
                </div>
                <span className="text-[11px] text-[#00B37E] font-semibold">{t.studlessIncluded}</span>
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
                    {t.step4Title}
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {t.dateLabel} <span className="text-red-500">*</span>
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
                      {t.paxLabel}
                    </label>
                    <div className="flex items-center justify-between bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-1.5">
                      <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{passengers} {t.guestsUnit}</span>
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
                    {t.chaletLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t.chaletPlaceholder}
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
                      {t.leadNameLabel} <span className="text-red-500">*</span>
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
                      {t.emailLabel} <span className="text-red-500">*</span>
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
                          {t.addSecondVehicleTitle}
                        </span>
                        <span className="text-[10px] text-[#6B7280] dark:text-slate-400">
                          {t.addSecondVehicleDesc}
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
                    <span>{t.memoLabel}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.memoPlaceholder}
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
                      {t.agreementText}
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
                  {t.quoteTitle}
                </span>
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.allInclusive}
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
                  <span className="text-slate-500">{t.destinationLabel}</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white text-right">{currentResort.name[lang] || currentResort.name.en}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.departureLabel}</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{pickupLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.vehicleLabel}</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-white">{vehicleName}</span>
                </div>
                {addSecondVehicle && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>{t.supportVehicleLabel}</span>
                    <span>{t.supportVehicleVal}</span>
                  </div>
                )}
              </div>

              {/* Inclusions */}
              <div className="bg-[#F5F7FA] dark:bg-[#131b2c] rounded-xl p-3 space-y-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.incTires}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.incTolls}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.incDoorToDoor}</span>
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#6B7280] dark:text-slate-400 font-bold uppercase">{t.totalFareLabel}</span>
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
                    <span>{t.instantStripeBtn}</span>
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
