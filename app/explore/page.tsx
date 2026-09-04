'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plane,
  Compass,
  Snowflake,
  Car,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  Briefcase,
  Check
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import YahooJapanHomeView from '@/components/YahooJapanHomeView';
import { useLanguage } from '@/context/LanguageContext';

const RouteDistanceVisualizer = dynamic(() => import('@/components/RouteDistanceVisualizer'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0A0D14] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-8 min-h-[420px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Loading Route Visualizer...</span>
      </div>
    </div>
  ),
});

export default function ExplorePage() {
  const [lang, setLang] = useLanguage();
  const [isModernViewForced, setIsModernViewForced] = useState(false);
  const router = useRouter();

  // Floating Quick Quote State (RydAgent inspired)
  const [fromLocation, setFromLocation] = useState('hnd');
  const [toLocation, setToLocation] = useState('Tokyo Hotels');
  const [serviceCategory, setServiceCategory] = useState<'airport' | 'sightseeing' | 'ski'>('airport');
  const [quoteDate, setQuoteDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [quoteTime, setQuoteTime] = useState('10:00');
  const [quotePax, setQuotePax] = useState('2');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Fleet View Switcher
  const [selectedFleet, setSelectedFleet] = useState<'hiace' | 'alphard' | 'granace'>('alphard');
  const [fleetPhotoView, setFleetPhotoView] = useState<'exterior' | 'interior' | 'trunk'>('exterior');

  const handleFloatingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/booking?category=${serviceCategory}&from=${fromLocation}&date=${quoteDate}&pax=${quotePax}`);
  };

  const fleetData = {
    hiace: {
      name: 'HiAce Grand Cabin',
      tier: 'Standard',
      goldBadge: 'STANDARD',
      badge: 'High-Capacity Group Van',
      capacity: '1–9 Guests',
      luggage: '9–10 Large Bags',
      exteriorImage: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
      desc: {
        ja: '最大9名様のご乗車と大量のスーツケース・スキー板を楽々積載できるハイルーフワイドキャビン。ファミリーや団体グループに最適。',
        zh: '可容纳多达9位贵宾及大量大号行李箱、滑雪板包。超大车顶空间与通畅过道，适合大家庭及团队出行。',
        fr: 'Idéal pour grands groupes jusqu\'à 9 personnes avec espace volumineux pour valises et sacs de ski volumineux.',
        es: 'Ideal para familias grandes y grupos de hasta 9 personas con espacio masivo para equipaje y material de esquí.',
        en: 'Spacious high-roof wide-body van accommodating up to 9 guests with huge luggage bay for suitcases and ski gear.',
      }[lang],
    },
    alphard: {
      name: 'Toyota Alphard Executive Lounge',
      tier: 'Premium',
      goldBadge: 'PREMIUM',
      badge: 'VIP First-Class Captain Seats',
      capacity: '1–4 Guests',
      luggage: '3–4 Large Suitcases',
      exteriorImage: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      interiorImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
      desc: {
        ja: '電動オットマン付きキャプテンシート、シートベンチレーション/ヒーター、極上の静粛性を誇るエグゼクティブMPV。1〜4名様に最適。',
        zh: '尊享头等舱级电动航空座椅，配备通风加热与静谧空间。1-4位贵宾商务出行与私享观光的典范座驾。',
        fr: 'Sièges capitaine Ottoman tout électriques, ventilation/chauffage et insonorisation de première classe. Idéal pour 1 à 4 personnes.',
        es: 'Asientos ejecutivos eléctricos con reposapiés, cuero premium y máximo confort acústico. Ideal para 1 a 4 personas.',
        en: 'Power-reclining Ottoman captain seats with heated/ventilated premium leather and ultra-quiet cabin. Perfect for 1 to 4 VIPs.',
      }[lang],
    },
    granace: {
      name: 'Toyota Granace 4WD VIP Lounge',
      tier: 'Ultra Premium Vehicle',
      goldBadge: 'ULTRA PREMIUM',
      badge: 'Executive 6-Seater Flagship',
      capacity: '1–5 Guests',
      luggage: '4–5 Large Suitcases',
      exteriorImage: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      interiorImage: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
      trunkImage: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
      desc: {
        ja: '堂々たるボディサイズに4WDを搭載。2列目・3列目ともに独立キャプテンシートを備え、雪道や長距離観光でも圧倒的な快適性を誇ります。',
        zh: '全时四驱旗舰大空间，第二排与第三排均配备独立真皮头等舱航空座椅。长途旅行与雪季出行首选。',
        fr: 'Grand monospace 4x4 avec 4 sièges capitaine indépendants. Confort souverain pour les longs trajets et la montagne enneigée.',
        es: 'Monovolumen ejecutivo 4x4 con 4 asientos VIP independientes. Máximo confort en largos recorridos y puertos de montaña.',
        en: 'Commanding full-size 4WD luxury transporter with 4 independent captain chairs across 2nd & 3rd rows. Unrivaled stability.',
      }[lang],
    },
  };

  const currentFleetItem = fleetData[selectedFleet];
  const activeFleetPhoto =
    fleetPhotoView === 'interior'
      ? currentFleetItem.interiorImage
      : fleetPhotoView === 'trunk'
      ? currentFleetItem.trunkImage
      : currentFleetItem.exteriorImage;

  const faqs = [
    {
      q: {
        en: 'How does airport pickup work?',
        ja: '空港でのお迎えはどのように行われますか？',
        zh: '机场接机是如何操作的？',
        fr: 'Comment se déroule l\'accueil à l\'aéroport ?',
        es: '¿Cómo funciona la recogida en el aeropuerto?',
      },
      a: {
        en: 'Your assigned chauffeur monitors your inbound aircraft live. They will be waiting at the arrival exit hall holding a personalized luxury welcome nameboard. 100% flexible complimentary waiting time is included with zero delay charges — we won’t charge a penny for flight delays.',
        ja: '担当ドライバーがフライトの実際の着陸時刻をリアルタイムで監視し、税関出口にてお名前を掲示してお待ちします。遅延時も追加料金は一切不要（¥0）で、完全無料・柔軟にお待ちいたします。',
        zh: '专属司机会实时跟踪您的航班进港动态，并在国际到达出口手持尊享姓名牌迎接您。无论航班延误多久，均享100%免费灵活守候，不加收一分钱延误费。',
        fr: 'Votre chauffeur dédié suit votre vol en direct. Il vous attendra dans le hall des arrivées avec un panneau d\'accueil personnalisé. Temps d\'attente 100% flexible et gratuit inclus, sans le moindre centime facturé pour les retards.',
        es: 'Su chófer asignado monitorea su vuelo en tiempo real. Le esperará en la sala de llegadas con un cartel de bienvenida personalizado. Tiempo de espera 100% flexible y gratuito incluido, sin cobrarle un solo céntimo por retrasos.',
      },
    },
    {
      q: {
        en: 'Are the prices fixed or metered?',
        ja: '料金は定額ですか、それともメーター制ですか？',
        zh: '车费是固定包干还是按打表计算？',
        fr: 'Les tarifs sont-ils fixes ou au compteur ?',
        es: '¿Los precios son fijos o con taxímetro?',
      },
      a: {
        en: 'All fares on SK LIMO are 100% fixed, all-inclusive, and guaranteed upon booking. Expressway highway tolls, fuel, vehicle insurance, and parking are fully covered with zero surge pricing or unexpected meter surprises.',
        ja: 'SK LIMOのすべての料金は完全定額制です。高速道路料金、燃料代、車両保険、駐車場代がすべて含まれており、渋滞や混雑による追加請求は一切ございません。',
        zh: 'SK LIMO所有价格均为100%固定全包价。高速过路费、燃油费、商业保险均已包含在内，绝无高峰溢价或额外加价。',
        fr: 'Tous les tarifs sur SK LIMO sont 100 % fixes et tout compris. Les péages d\'autoroute, le carburant, l\'assurance commerciale et les parkings sont entièrement inclus sans majoration imprévue.',
        es: 'Todas las tarifas en SK LIMO son 100% fijas y con todo incluido. Peajes de autopista, combustible, seguro comercial y aparcamientos están cubiertos sin cargos sorpresa ni suplementos.',
      },
    },
    {
      q: {
        en: 'What happens if my flight is delayed or rescheduled?',
        ja: 'フライトが遅延または変更になった場合はどうなりますか？',
        zh: '如果我的航班延误或改期怎么办？',
        fr: 'Que se passe-t-il si mon vol est retardé ou reporté ?',
        es: '¿Qué ocurre si mi vuelo se retrasa o reprograma?',
      },
      a: {
        en: 'Because we track your live flight number, delayed arrivals automatically adjust your chauffeur dispatch time at no extra charge. If your flight is cancelled or rescheduled by the airline, send us the airline notice for a free rebooking or full refund.',
        ja: '便名をリアルタイム追跡しているため、フライトの遅延に合わせてドライバーのお迎え時刻も自動調整されます。航空会社都合の欠航・日程変更時は無料で日程変更または全額返金いたします。',
        zh: '我们实时监控您的航班信息，延误到达将自动顺延司机接送时间，无需额外费用。如遇航空公司改期或取消，提供凭证即可免费改期或全额退款。',
        fr: 'Grâce au suivi en direct de votre vol, les retards ajustent automatiquement l\'horaire du chauffeur sans aucun frais supplémentaire. En cas d\'annulation par la compagnie, contactez-nous pour un report gratuit ou remboursement complet.',
        es: 'Gracias al rastreo en vivo de su vuelo, los retrasos ajustan automáticamente la llegada del chófer sin coste extra. Si la aerolínea cancela su vuelo, avísenos para reprogramación gratuita o reembolso íntegro.',
      },
    },
    {
      q: {
        en: 'What payment methods do you accept?',
        ja: '利用可能な決済方法は何ですか？',
        zh: '支持哪些支付方式？',
        fr: 'Quels modes de paiement acceptez-vous ?',
        es: '¿Qué métodos de pago aceptan?',
      },
      a: {
        en: 'We accept Apple Pay (1-click express checkout), Google Pay, Credit Cards (Visa, Mastercard, American Express, JCB, UnionPay), WeChat Pay (微信支付), Alipay (支付宝), and PayPay via encrypted Level-1 PCI-DSS Stripe processing.',
        ja: 'Apple Pay（ワンクリック即時決済）、Google Pay、各種クレジットカード（VISA、Mastercard、AMEX、JCB、銀聯）、WeChat Pay（微信支付）、Alipay（支付宝）、PayPayに対応しております。',
        zh: '支持Apple Pay一键极速支付、Google Pay、国际主流信用卡（Visa、Mastercard、Amex、JCB、银联）、微信支付、支付宝及PayPay。',
        fr: 'Nous acceptons Apple Pay (1-clic express), Google Pay, cartes bancaires (Visa, Mastercard, Amex, JCB, UnionPay), WeChat Pay, Alipay et PayPay via paiement sécurisé Stripe Niveau-1 PCI-DSS.',
        es: 'Aceptamos Apple Pay (1-clic express), Google Pay, tarjetas de crédito (Visa, Mastercard, Amex, JCB, UnionPay), WeChat Pay, Alipay y PayPay mediante pasarela segura cifrada Stripe PCI-DSS Nivel-1.',
      },
    },
    {
      q: {
        en: 'Are your vehicles legally licensed in Japan?',
        ja: '車両は日本の法令に基づき正規に認可されていますか？',
        zh: '车辆是否具有日本正规营运资质？',
        fr: 'Vos véhicules disposent-ils d\'une licence légale au Japon ?',
        es: '¿Sus vehículos cuentan con licencia oficial en Japón?',
      },
      a: {
        en: 'Yes. 100% of our fleet operates on Japanese commercial "Green Plates" (緑ナンバー) authorized by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) with comprehensive commercial passenger liability insurance.',
        ja: 'はい。当社のすべての車両は、国土交通省関東運輸局の正規認可を受けた「緑ナンバー（営業用登録）」車両であり、万全の搭乗者傷害保険が完備されています。',
        zh: '是的。我们的所有车队均具有日本国土交通省正规营运资质（绿牌合规营运），并全额配备高额商业乘客意外与人身保险。',
        fr: 'Oui. 100 % de notre flotte roule sous immatriculation commerciale officielle "Plaque Verte" (緑ナンバー) agréée par le Ministère des Transports (MLIT) avec assurance responsabilité passagers complète.',
        es: 'Sí. El 100% de nuestra flota opera con "Placas Verdes" comerciales oficiales (緑ナンバー) autorizadas por el Ministerio de Transporte de Japón (MLIT) con seguro completo de responsabilidad civil.',
      },
    },
  ];

  const t = {
    heroRibbon: {
      ja: '国土交通省許可 正規緑ナンバー・保険完備',
      zh: '官方绿牌认证・商业保险完备',
      fr: 'LICENCIÉ ET ASSURÉ',
      es: 'LICENCIADO Y ASEGURADO',
      en: 'LICENSED & INSURED',
    }[lang],
    heroSubhead: {
      ja: '日本最高峰のプライベートハイヤー体験 —',
      zh: '日本头等舱级专属专车出行 —',
      fr: 'Voyage Première Classe au Japon —',
      es: 'Viajes de Primera Clase en Japón —',
      en: 'First-Class Travel in Japan —',
    }[lang],
    heroMainhead: {
      ja: '完全定額・安心の送迎クオリティをお約束。',
      zh: '全包定额、全程无忧的尊享服务。',
      fr: 'Chaque trajet, parfaitement pris en charge.',
      es: 'Cada viaje, perfectamente cubierto.',
      en: 'Every ride, perfectly covered.',
    }[lang],
    check1: {
      ja: '完全定額料金制 — 高速料金・駐車場・消費税込、チップ不要。',
      zh: '全包一口价 — 包含高速费、停车费及税费，无任何小费或隐形收费。',
      fr: 'Tarifs fixes tout compris — Péages, parking et taxes inclus, aucun pourboire requis.',
      es: 'Precios fijos todo incluido — Peajes de autopista, parking e impuestos incluidos, sin propinas obligatorias.',
      en: 'All-inclusive fixed prices — Expressway tolls, parking & taxes in, zero tipping expected.',
    }[lang],
    check2: {
      ja: 'フライトリアルタイム追跡 — 到着遅延時も追加料金ゼロ(¥0)・完全無料待機。',
      zh: '航班动态实时跟踪 — 延误零加价，100%免费灵活守候。',
      fr: 'Suivi de vol en direct — Retard ? Attente 100% flexible gratuite & zéro frais de retard.',
      es: 'Rastreo de vuelos en vivo — ¿Retraso? Espera 100% flexible gratis y 0 cargos por retraso.',
      en: 'Flight tracked live — Delayed? 100% free flexible wait with zero delay charges.',
    }[lang],
    check3: {
      ja: '到着ロビーお出迎え — 税関出口でネームボードを掲示して専任ドライバーがお待ちします。',
      zh: '到达厅举牌接机 — 专属司机手持定制欢迎名牌在国际出口等候。',
      fr: 'Accueil personnalisé — Chauffeur en costume avec panneau nominatif dès la sortie.',
      es: 'Recepción en llegadas — Chófer uniformado con cartel personalizado en la terminal.',
      en: 'Curbside meet & greet — Chauffeur meets you at arrivals with personalized nameboard.',
    }[lang],
    check4: {
      ja: '24時間バイリンガル配車デスク — 英語・日本語・中国語でのWhatsApp即時対応。',
      zh: '24/7中英日三语调度中心 — WhatsApp即时客服，全天候保驾护航。',
      fr: 'Support bilingue 24/7 — Coordination et dispatch immédiats sur WhatsApp.',
      es: 'Atención 24/7 multilingüe — Coordinación inmediata vía WhatsApp.',
      en: '24/7 Operations Desk — Instant WhatsApp coordination and dispatch in English & Japanese.',
    }[lang],
    startBookingBtn: { ja: '今すぐ予約する', zh: '立即开始预订', fr: 'Commencer la Réservation', es: 'Comenzar Reserva', en: 'Start Booking Now' }[lang],
    guaranteesBtn: { ja: '運行保証・サービス規約', zh: '服务保障与规范', fr: 'Nos Engagements', es: 'Nuestras Garantías', en: 'Our Guarantees' }[lang],
    serviceLabel: { ja: 'サービス種別', zh: '服务类型', fr: 'Service', es: 'Servicio', en: 'Service' }[lang],
    optAirport: { ja: '空港送迎 (羽田・成田)', zh: '机场专属接送 (羽田/成田)', fr: 'Transfert Aéroport', es: 'Traslado de Aeropuerto', en: 'Airport Transfer' }[lang],
    optSightseeing: { ja: '観光チャーター (富士山・都内)', zh: '观光包车一日游 (富士山/都内)', fr: 'Excursion d\'une Journée', es: 'Tour Turístico de un Día', en: 'Day Charter Tour' }[lang],
    optSki: { ja: '4WD スキー直行ハイヤー', zh: '4WD 雪季滑雪专车直达', fr: 'Transfert Ski 4x4', es: 'Traslado de Esquí 4x4', en: '4WD Ski Transfer' }[lang],
    fromLabel: { ja: 'ご出発地・乗車地', zh: '出发地上车点', fr: 'Point de Départ', es: 'Punto de Salida', en: 'Pickup (From)' }[lang],
    optHnd: { ja: '羽田空港 (HND)', zh: '羽田国际机场 (HND)', fr: 'Aéroport d\'Haneda (HND)', es: 'Aeropuerto de Haneda (HND)', en: 'Haneda Airport (HND)' }[lang],
    optNrt: { ja: '成田空港 (NRT)', zh: '成田国际机场 (NRT)', fr: 'Aéroport de Narita (NRT)', es: 'Aeropuerto de Narita (NRT)', en: 'Narita Airport (NRT)' }[lang],
    optTokyoHotels: { ja: '東京都内ホテル・ご自宅', zh: '东京市区酒店 / 住宅', fr: 'Hôtels à Tokyo (Centre)', es: 'Hoteles en Tokio (Centro)', en: 'Tokyo Hotels (Central)' }[lang],
    dateLabel: { ja: '日程', zh: '出行日期', fr: 'Date', es: 'Fecha', en: 'Date' }[lang],
    timeLabel: { ja: '出発時間', zh: '出发时间', fr: 'Heure', es: 'Hora', en: 'Time' }[lang],
    paxLabel: { ja: 'ご乗車人数', zh: '乘车人数', fr: 'Passagers (Pax)', es: 'Pasajeros (Pax)', en: 'Guests (Pax)' }[lang],
    checkPriceBtn: { ja: '料金を確認', zh: '查询定额车费', fr: 'Calculer le Prix', es: 'Consultar Precio', en: 'Check Price' }[lang],
    trust1Title: { ja: '国土交通省 緑ナンバー', zh: '100% 正规商业绿牌', fr: 'Plaque Verte MLIT', es: 'Placa Verde MLIT', en: 'MLIT Green Plate' }[lang],
    trust1Desc: { ja: '日本の法令に準拠した安心の営業用認可車両', zh: '合规营运资质，全额配备商业乘客险', fr: 'Transport commercial japonais légal et assuré', es: 'Transporte comercial japonés 100% legal y asegurado', en: 'Fully insured commercial legal Japanese transport' }[lang],
    trust2Title: { ja: '遅延料金¥0・完全無料待機', zh: '延误0加价・免费灵活守候', fr: 'Attente 100% Flexible & Gratuite', es: 'Espera 100% Flexible y Gratis', en: '100% Free Flexible Wait' }[lang],
    trust2Desc: { ja: '遅延時も追加料金なし。税関・荷物受取も安心。', zh: '无论延误多久不加收一分钱，通关取行李从容无忧。', fr: 'Zéro centime pour les retards. Douane & bagages sans stress.', es: 'Ni un céntimo por retrasos. Aduanas y equipaje sin estrés.', en: 'We won’t charge a penny for flight delays. Clearance with zero stress.' }[lang],
    trust3Title: { ja: '追加料金ゼロ (¥0)', zh: '¥0 任何高峰溢价', fr: '0 ¥ Frais Cachés', es: '0 ¥ Cargos Ocultos', en: '¥0 Surge Pricing' }[lang],
    trust3Desc: { ja: '高速代・深夜料金も予約時に全額確定', zh: '高速路桥费及油费于下单时全部锁定', fr: 'Tous les péages & carburant fixés à la réservation', es: 'Peajes y combustible cerrados en la reserva', en: 'All highway tolls & fuel locked at reservation' }[lang],
    trust4Title: { ja: '24時間 多言語サポート', zh: '24/7 多语种专属客服', fr: 'Support Bilingue 24/7', es: 'Atención 24/7 Multilingüe', en: '24/7 Bilingual Support' }[lang],
    trust4Desc: { ja: 'WhatsApp & お電話で迅速に対応', zh: '微信 / WhatsApp 与电话即时跟踪调度', fr: 'Desk de suivi WhatsApp & assistance vol', es: 'Seguimiento de vuelos por WhatsApp y teléfono', en: 'WhatsApp & phone flight tracking dispatch desk' }[lang],
    corridorsTag: { ja: '人気送迎ルート', zh: '高频定额热门路线', fr: 'Trajets Populaires', es: 'Rutas Populares', en: 'Fixed-Rate Routes' }[lang],
    corridorsHead: { ja: '日本国内 主要ハイヤールート', zh: '日本热门专属包车走廊', fr: 'Principaux Trajets Privés au Japon', es: 'Principales Rutas Privadas en Japón', en: 'Popular Japan Private Chauffeur Corridors' }[lang],
    openPortalLink: { ja: 'オンライン予約ポータルを開く', zh: '打开在线互动预订通道', fr: 'Ouvrir le portail de réservation', es: 'Abrir portal de reservas interactivo', en: 'Open Interactive Booking Portal' }[lang],
    fromUnit: { ja: '片道', zh: '起', fr: 'Dès', es: 'Desde', en: 'From' }[lang],
    hndCardTitle: { ja: '羽田空港 ⇄ 東京都内ホテル', zh: '羽田国际机场 ⇄ 东京市区酒店', fr: 'Aéroport d\'Haneda ⇄ Hôtels de Tokyo', es: 'Aeropuerto de Haneda ⇄ Hoteles de Tokio', en: 'Haneda Airport ⇄ Tokyo Hotels' }[lang],
    hndCardDesc: { ja: 'ストレスフリーな空港到着。第2・第3ターミナル出口でお出迎えし、ホテル玄関まで直行。', zh: '无缝入境体验。第2/第3航站楼出口举牌接机，直达东京酒店大堂。', fr: 'Arrivée exécutive fluide. Accueil nominatif T2/T3 et dépose directe à votre hôtel.', es: 'Llegada ejecutiva sin estrés. Recepción con cartel en T2/T3 y traslado directo al hotel.', en: 'Seamless executive arrival. Meet & greet with nameboard at Terminal 2/3 and direct drop-off at your Tokyo hotel lobby.' }[lang],
    bookHndBtn: { ja: '羽田送迎を予約する', zh: '预订羽田机场接送', fr: 'Réserver Transfert Haneda', es: 'Reservar Traslado Haneda', en: 'Book Haneda Transfer' }[lang],
    fujiCardTitle: { ja: '富士山・河口湖 1日観光チャーター', zh: '富士山与河口湖 专属包车一日游', fr: 'Mont Fuji & Lac Kawaguchiko', es: 'Monte Fuji y Lago Kawaguchiko', en: 'Mount Fuji & Lake Kawaguchiko' }[lang],
    fujiCardDesc: { ja: '富士山五合目、忍野八海の清流、新倉山浅間公園の五重塔を自由なペースで満喫。', zh: '富士山五合目全景、忍野八海清泉、新仓山浅间公园绝景尽情游览。', fr: 'Vues panoramiques de la 5e Station, sources d\'Oshino Hakkai et pagode Arakurayama à votre rythme.', es: 'Vistas panorámicas de la 5ª Estación, aguas de Oshino Hakkai y pagoda Arakurayama a su ritmo.', en: '5th Station panoramic vistas, crystal waters of Oshino Hakkai, and Arakurayama Sengen Pagoda at your own pace.' }[lang],
    bookFujiBtn: { ja: '富士山チャーターを予約する', zh: '预订富士山一日游', fr: 'Réserver Excursion Fuji', es: 'Reservar Tour Fuji', en: 'Book Fuji Charter' }[lang],
    skiCardTitle: { ja: '4WD 白馬スキー場 直行ハイヤー', zh: '4WD 白马山谷滑雪场 直达专车', fr: 'Transfert Ski 4x4 Vallée d\'Hakuba', es: 'Traslado de Esquí 4x4 a Hakuba', en: '4WD Hakuba Valley Alpine Ski Direct' }[lang],
    skiCardDesc: { ja: '羽田・成田・都内から白馬のシャレー前まで完全ドアtoドア。スタッドレスタイヤ・スキー板積載込。', zh: '羽田/成田/东京直达白马度假木屋门口。标配高性能雪胎，支持大量雪具携带。', fr: 'Porte-à-porte depuis Haneda, Narita ou Tokyo directement à votre chalet à Hakuba. Pneus neige & housses inclus.', es: 'Puerta a puerta desde Haneda, Narita o Tokio a su chalet en Hakuba. Neumáticos de nieve y equipaje incluidos.', en: 'Door-to-door from Haneda, Narita, or Tokyo directly to your Hakuba chalet. Studless snow tires and ski bags included.' }[lang],
    bookSkiBtn: { ja: '白馬スキー送迎を予約する', zh: '预订白马滑雪直达专车', fr: 'Réserver Transfert Ski', es: 'Reservar Traslado de Esquí', en: 'Book Ski Transfer' }[lang],
    fleetTag: { ja: '運行車両基準', zh: '专属车队规格', fr: 'Standards de la Flotte', es: 'Estándares de la Flota', en: 'Executive Fleet Standards' }[lang],
    fleetHead: { ja: '最高水準の正規営業車両ラインナップ', zh: '日本顶规正规商业车队', fr: 'Véhicules Commerciaux Japonais d\'Excellence', es: 'Vehículos Comerciales Japoneses de Primer Nivel', en: 'Pristine Japanese Commercial Vehicles' }[lang],
    fleetSubhead: { ja: '全車禁煙・毎日徹底除菌。国土交通省の安全管理基準に基づき運行しております。', zh: '每日全车深度消毒杀菌、严格全车禁烟，遵照日本运输局最高安全规范运营。', fr: 'Désinfectés quotidiennement, non-fumeurs et entretenus selon les protocoles stricts du MLIT.', es: 'Desinfectados diariamente, no fumadores y mantenidos bajo estrictos protocolos del MLIT.', en: 'Daily sanitized, non-smoking, and maintained under rigorous Ministry of Transport safety protocols.' }[lang],
    exteriorTab: { ja: '外観', zh: '车辆外观', fr: 'Extérieur', es: 'Exterior', en: 'Exterior' }[lang],
    interiorTab: { ja: 'キャビン内装', zh: '尊享内饰', fr: 'Salon Intérieur', es: 'Interior Lounge', en: 'Interior Lounge' }[lang],
    trunkTab: { ja: 'ラゲッジスペース', zh: '行李后备箱', fr: 'Coffre à Bagages', es: 'Espacio de Equipaje', en: 'Luggage Bay' }[lang],
    bookVehicleBtn: { ja: 'この車両で予約する', zh: '选择此车型预订', fr: 'Réserver ce Véhicule', es: 'Reservar este Vehículo', en: 'Book This Vehicle' }[lang],
    faqTag: { ja: 'よくあるご質問', zh: '常见问题解答', fr: 'Réponses Transparentes', es: 'Respuestas Claras', en: 'Transparent Answers' }[lang],
    faqHead: { ja: 'ご予約・運行に関するFAQ', zh: '常见问题解答 (FAQ)', fr: 'Foire Aux Questions', es: 'Preguntas Frecuentes', en: 'Frequently Asked Questions' }[lang],
    b2bTag: { ja: '旅行会社様・海外DMC様向け専用デスク', zh: '面向海外旅行社、定制游机构及全球DMC', fr: 'POUR AGENCES DE VOYAGES, TOUR-OPÉRATEURS & DMC', es: 'PARA AGENCIAS DE VIAJES, OPERADORES Y DMC', en: 'FOR TRAVEL AGENTS, TOUR OPERATORS & OVERSEAS DMCs' }[lang],
    b2bHead: { ja: '日本国内の地上手配はSK LIMOにお任せください', zh: '将日本地接交给我们 — 我们全权统筹全程地面接待', fr: 'Confiez-nous l\'Étape Japon — Nous Gérons Tout le Programme Terrestre', es: 'Déjenos el Tramo en Japón — Gestionamos Todo el Programa Terrestre', en: 'Hand Us the Japan Leg — We Arrange the Entire Ground Programme' }[lang],
    b2bDesc: { ja: '専任車両、新幹線手配、入場チケット、通訳ガイドまで正規旅行サービス手配業として一括手配いたします。', zh: '提供车队净价合约、新干线车票、景点快速预约门票及持证双语向导。具备日本合法旅行服务手配业牌照。', fr: 'Tarifs nets garantis sur les véhicules, billets Shinkansen, entrées coupe-file et guides agréés. Enregistré au Japon en tant qu\'agence réceptive officielle.', es: 'Tarifas netas garantizadas en vehículos, billetes Shinkansen, entradas y guías autorizados. Registrado en Japón como operador receptivo oficial.', en: 'Guaranteed itemized net rates on vehicles, Shinkansen rail seats, timed-entry tickets, and licensed guides. Registered in Japan as a Travel Service Arrangement Business.' }[lang],
    b2bBtn: { ja: 'B2B専用窓口にお問い合わせ', zh: '联系B2B地接合作专员', fr: 'Contacter le Desk B2B', es: 'Contactar con el Área B2B', en: 'Connect with B2B Desk' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080B11] text-[#1D1A16] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader
        activePage="home"
        currentLang={lang}
        onLanguageChange={(newLang) => {
          if (newLang === 'ja') {
            setIsModernViewForced(false);
          }
          setLang(newLang);
        }}
      />

      {/* If Japanese language is active and in modern view, provide top switch banner back to Yahoo Japan view */}
      {lang === 'ja' && isModernViewForced && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#CC0000] text-white py-1.5 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2">
          <span>🇯🇵 現在【グローバルモダン表示】で表示中</span>
          <button
            type="button"
            onClick={() => setIsModernViewForced(false)}
            className="bg-white text-[#CC0000] px-2.5 py-0.5 rounded text-[11px] font-black hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Yahoo! JAPAN風 日本語ポータル表示に切り替える ＞
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          1. CINEMATIC HERO SECTION
      ═════════════════════════════════════════════════════════════════ */}
      <section className={`relative flex min-h-[90svh] items-center justify-center overflow-hidden pb-20 ${lang === 'ja' && isModernViewForced ? 'pt-24' : 'pt-16'}`}>
        
        {/* Background Photorealistic Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing.jpg"
            alt="SK Limo Executive Chauffeur and Black Toyota Alphard in Japan"
            fill
            priority
            className="object-cover object-center brightness-[0.82] dark:brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 dark:from-[#080B11]/95 dark:via-[#080B11]/80 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4] via-transparent to-black/40 dark:from-[#080B11] dark:via-transparent dark:to-transparent" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          <div className="lg:col-span-8 space-y-5 text-white">
            
            {/* Gold Ribbon Badge */}
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E5C378]">
                {t.heroRibbon}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15]">
              <span className="block font-serif italic text-slate-200">{t.heroSubhead}</span>
              <span className="block font-extrabold bg-gradient-to-r from-[#F3E7C4] via-[#C5A059] to-[#E5C378] bg-clip-text text-transparent pt-1">
                {t.heroMainhead}
              </span>
            </h1>

            {/* Value Checklist */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200/95 max-w-xl font-medium pt-2">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check1}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check2}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check3}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#E5C378] font-bold text-xs shrink-0">
                  ✓
                </span>
                <span>{t.check4}</span>
              </li>
            </ul>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/booking"
                className="bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all cursor-pointer"
              >
                <span>{t.startBookingBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                <span>{t.guaranteesBtn}</span>
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ═════════════════════════════════════════════════════════════════
          2. FLOATING QUICK QUOTE & BOOKING WIDGET
      ═════════════════════════════════════════════════════════════════ */}
      <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16">
        <form
          onSubmit={handleFloatingSearch}
          className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
        >
          {/* Service Category */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              {t.serviceLabel}
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as any)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="airport">{t.optAirport}</option>
              <option value="sightseeing">{t.optSightseeing}</option>
              <option value="ski">{t.optSki}</option>
            </select>
          </div>

          {/* From */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              {t.fromLabel}
            </label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="hnd">{t.optHnd}</option>
              <option value="nrt">{t.optNrt}</option>
              <option value="tokyo">{t.optTokyoHotels}</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              {t.dateLabel}
            </label>
            <input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              {t.timeLabel}
            </label>
            <select
              value={quoteTime}
              onChange={(e) => setQuoteTime(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '20:00', '22:00'].map((tVal) => (
                <option key={tVal} value={tVal}>{tVal}</option>
              ))}
            </select>
          </div>

          {/* Vehicle / Pax */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] mb-1.5">
              {t.paxLabel}
            </label>
            <select
              value={quotePax}
              onChange={(e) => setQuotePax(e.target.value)}
              className="w-full h-11 bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="2">1–4 Pax (Alphard Premium)</option>
              <option value="5">1–5 Pax (Granace VIP)</option>
              <option value="8">1–9 Pax (HiAce Standard)</option>
            </select>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full h-11 bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer"
          >
            <span>{t.checkPriceBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          3. KEY TRUST METRICS
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">100%</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust1Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust1Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">90 Min</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust2Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust2Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">¥0</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust3Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust3Desc}</p>
          </div>

          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl p-6 space-y-2 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C5A059] font-mono">24/7</div>
            <p className="text-xs font-semibold text-[#1D1A16] dark:text-white">{t.trust4Title}</p>
            <p className="text-[11px] text-[#6B6458] dark:text-slate-400">{t.trust4Desc}</p>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          4. POPULAR CORRIDORS & CURATED ROUTES
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
              {t.corridorsTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
              {t.corridorsHead}
            </h2>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D3F] dark:text-[#C5A059] hover:underline"
          >
            <span>{t.openPortalLink}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Haneda Airport */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/dest-haneda-hero-1920x1080.jpg"
                  alt="Haneda Airport Transfer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  25–35 Min · 22 km
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  {t.fromUnit} ¥16,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">{t.hndCardTitle}</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  {t.hndCardDesc}
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=airport&from=hnd"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>{t.bookHndBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Mount Fuji & Kawaguchiko */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/dest-fuji-hero-1920x1080.jpg"
                  alt="Mount Fuji Private Day Charter"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  10 Hours · 118 km
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  {t.fromUnit} ¥75,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">{t.fujiCardTitle}</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  {t.fujiCardDesc}
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=sightseeing&from=tokyo"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>{t.bookFujiBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: 4WD Hakuba Ski Direct */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image
                  src="/images/ski-hakuba-hero-4032x3024.jpg"
                  alt="4WD Ski Transfer Hakuba"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  3.5–4.0 Hours · 4WD Direct
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[#E5C378] font-mono font-bold text-xs border border-[#C5A059]/40">
                  {t.fromUnit} ¥110,000
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-[#1D1A16] dark:text-white">{t.skiCardTitle}</h3>
                <p className="text-xs text-[#6B6458] dark:text-slate-300">
                  {t.skiCardDesc}
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Link
                href="/booking?category=ski&from=hnd"
                className="w-full bg-[#FAF8F4] dark:bg-slate-800 hover:bg-[#C5A059] hover:text-black dark:hover:bg-[#C5A059] dark:hover:text-black text-[#1D1A16] dark:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-[#E8E2D8] dark:border-slate-700"
              >
                <span>{t.bookSkiBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          5. FLEET SHOWCASE
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
              {t.fleetTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
              {t.fleetHead}
            </h2>
            <p className="text-xs text-[#6B6458] dark:text-slate-400">
              {t.fleetSubhead}
            </p>
          </div>

          {/* Fleet Tabs with Gold Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(['hiace', 'alphard', 'granace'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedFleet(key);
                  setFleetPhotoView('exterior');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedFleet === key
                    ? 'bg-[#1D1A16] text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-[#F5F7FA] dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED]'
                }`}
              >
                <span>
                  {key === 'hiace'
                    ? 'HiAce Grand Cabin (1-9 Pax)'
                    : key === 'alphard'
                    ? 'Toyota Alphard (1-4 Pax)'
                    : 'Toyota Granace (1-5 Pax)'}
                </span>
                <span className="bg-[#C5A059]/20 text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded border border-[#C5A059]/40">
                  {key === 'hiace' ? 'STANDARD' : key === 'alphard' ? 'PREMIUM' : 'ULTRA PREMIUM'}
                </span>
              </button>
            ))}
          </div>

          {/* Vehicle Showcase Card */}
          <div className="bg-[#FAF8F4] dark:bg-[#111622] border border-[#E8E2D8] dark:border-slate-700/80 rounded-2xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md border border-[#E8E2D8] dark:border-slate-700">
                <Image
                  src={activeFleetPhoto}
                  alt={currentFleetItem.name}
                  fill
                  className="object-cover transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('exterior')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'exterior'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  {t.exteriorTab}
                </button>
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('interior')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'interior'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  {t.interiorTab}
                </button>
                <button
                  type="button"
                  onClick={() => setFleetPhotoView('trunk')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    fleetPhotoView === 'trunk'
                      ? 'bg-[#1D1A16] text-white border-[#1D1A16] dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-slate-800 border-[#E8E2D8] dark:border-slate-700 text-[#4B5563] dark:text-slate-300'
                  }`}
                >
                  {t.trunkTab}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6D3F] dark:text-[#E5C378] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                <span>{currentFleetItem.goldBadge}</span>
                <span>•</span>
                <span>{currentFleetItem.badge}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#1D1A16] dark:text-white">
                {currentFleetItem.name}
              </h3>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E8E2D8] dark:border-slate-700 px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059]" />
                  {currentFleetItem.capacity}
                </span>
                <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E8E2D8] dark:border-slate-700 px-3 py-1.5 rounded-lg">
                  <Briefcase className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059]" />
                  {currentFleetItem.luggage}
                </span>
              </div>

              <p className="text-xs text-[#6B6458] dark:text-slate-300 leading-relaxed">
                {currentFleetItem.desc}
              </p>

              <div className="pt-2">
                <Link
                  href="/booking"
                  className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <span>{t.bookVehicleBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          6. INTERACTIVE ROUTE & DISTANCE VISUALIZER
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteDistanceVisualizer />
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          7. FREQUENTLY ASKED QUESTIONS
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C6D3F] dark:text-[#C5A059]">
            {t.faqTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A16] dark:text-white">
            {t.faqHead}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const qText = (faq.q as any)[lang] || faq.q.en;
            const aText = (faq.a as any)[lang] || faq.a.en;
            return (
              <div
                key={`${idx}-${lang}`}
                className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1D1A16] dark:text-white cursor-pointer"
                >
                  <span className="transition-opacity duration-300">{qText}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-[#6B6458] dark:text-slate-300 leading-relaxed border-t border-[#F0F2F5] dark:border-slate-800/80 mt-1">
                    <p className="pt-3 transition-opacity duration-300">{aText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          8. B2B TRAVEL AGENT / DMC BANNER
      ═════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#080B11] border border-slate-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#E5C378]">
              {t.b2bTag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.b2bHead}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.b2bDesc}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/contact"
              className="bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 transition-all"
            >
              <span>{t.b2bBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
