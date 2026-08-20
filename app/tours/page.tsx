'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Compass,
  Snowflake,
  MapPin,
  Calendar,
  Users,
  Luggage,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Car,
  Award,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fallback = setTimeout(() => el.classList.add('is-visible'), 400);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);
  return ref;
}

type ServiceTabType = 'airport' | 'sightseeing' | 'ski';

export default function GrandToursHomePage() {
  const router = useRouter();
  const [lang, setLang] = useLanguage();

  // Hero Quick Booking Bar State
  const [serviceTab, setServiceTab] = useState<ServiceTabType>('airport');
  const [pickupLocation, setPickupLocation] = useState<string>('hnd');
  const [destinationLocation, setDestinationLocation] = useState<string>('tokyo_hotel');
  const [passengers, setPassengers] = useState<number>(3);
  const [selectedVehicleClass, setSelectedVehicleClass] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  // Fleet Showcase Tab
  const [fleetTab, setFleetTab] = useState<'alphard' | 'granace' | 'hiace'>('alphard');

  // Animation Refs
  const quickSearchRef = useScrollFadeIn();
  const productsRef = useScrollFadeIn();
  const fleetRef = useScrollFadeIn();
  const trustRef = useScrollFadeIn();

  const t = TRANSLATIONS[lang];

  // Multilingual UI Dictionary
  const ui = {
    heroBadge: {
      ja: '国土交通省許可 緑ナンバー正規運行',
      zh: '日本国土交通省认证 商业绿牌营运',
      fr: 'Opérateur Agréé Officiel Plaque Verte MLIT',
      es: 'Operador Certificado Oficial Placa Verde MLIT',
      en: 'MLIT Licensed Green-Plate Luxury Chauffeur',
    }[lang],
    heroH1Line1: {
      ja: '極上の移動体験を、',
      zh: '尊享日本奢华专车，',
      fr: 'L\'Excellence du Voyage Privé,',
      es: 'La Excelencia en Viajes Privados,',
      en: 'Japan Luxury Chauffeur',
    }[lang],
    heroH1Line2: {
      ja: '日本全国の旅路へ',
      zh: '畅游东洋至美景致',
      fr: 'À Travers Tout le Japon',
      es: 'Por Todo Japón',
      en: '& Private Charters',
    }[lang],
    heroSub: {
      ja: '成田・羽田空港送迎、富士山・箱根プライベート観光、白馬スキー送迎の完全定額チャーター',
      zh: '成田/羽田机场接送、富士山/箱根定制一日游、白马/野泽滑雪专车全包一口价服务',
      fr: 'Transferts aéroport VIP Tokyo, excursions sur mesure Mont Fuji et séjours de ski alpins.',
      es: 'Traslados aéreos VIP Tokio, tours a medida Monte Fuji y transfers de esquí alpino.',
      en: 'Door-to-door Tokyo airport transfers, bespoke Mount Fuji tours, and alpine ski resort charters.',
    }[lang],
    searchTabAirport: {
      ja: '空港送迎',
      zh: '机场接送',
      fr: 'Transferts Aéroport',
      es: 'Traslados Aeropuerto',
      en: 'Airport Transfers',
    }[lang],
    searchTabSightseeing: {
      ja: '日帰り観光ツアー',
      zh: '景点包车一日游',
      fr: 'Excursions d\'une Journée',
      es: 'Excursiones de un Día',
      en: 'Day Tours & Sightseeing',
    }[lang],
    searchTabSki: {
      ja: 'スキーリゾート送迎',
      zh: '滑雪度假专车',
      fr: 'Transferts Ski Alpin',
      es: 'Transfers Esquí',
      en: 'Winter Ski Charters',
    }[lang],
    pickupLabel: {
      ja: 'ご乗車場所 (お迎え)',
      zh: '出发地点',
      fr: 'Point de Prise en Charge',
      es: 'Punto de Salida',
      en: 'Pick-Up Location',
    }[lang],
    destLabel: {
      ja: '目的地 (お送り)',
      zh: '目的地',
      fr: 'Destination',
      es: 'Destino',
      en: 'Destination / Drop-off',
    }[lang],
    dateLabel: {
      ja: 'ご利用日',
      zh: '出行日期',
      fr: 'Date du Trajet',
      es: 'Fecha del Viaje',
      en: 'Travel Date',
    }[lang],
    vehicleLabel: {
      ja: '車両クラス / 人数',
      zh: '车辆类型 / 人数',
      fr: 'Véhicule / Passagers',
      es: 'Vehículo / Pasajeros',
      en: 'Vehicle Class / Guests',
    }[lang],
    searchBtn: {
      ja: '即時料金確認・予約',
      zh: '查询即时价格与预订',
      fr: 'Vérifier les Tarifs',
      es: 'Ver Tarifas y Reservar',
      en: 'Check Rates & Reserve',
    }[lang],
    popularToursTitle: {
      ja: '厳選おすすめプライベートチャーター',
      zh: '热门精选专属包车线路',
      fr: 'Nos Circuits et Forfaits Recommandés',
      es: 'Nuestros Tours y Forfaits Más Populares',
      en: 'Featured Private Charters & Day Tours',
    }[lang],
    popularToursSub: {
      ja: '全コース高速代・ガソリン代・保険込みの完全定額。専属プロドライバーがご案内します。',
      zh: '所有线路全包一口价，含高速通行费、燃油与保险。专业双语专车司机全程服务。',
      fr: 'Tous les tarifs incluent péages, carburant, assurances et chauffeur dédié.',
      es: 'Tarifas con peajes, combustible, seguros y chófer privado incluidos.',
      en: 'All-inclusive fixed fares including highway tolls, fuel, insurance, and dedicated chauffeur.',
    }[lang],
    fleetSectionTitle: {
      ja: 'SK Limo プレミアム運行車両',
      zh: 'SK Limo 豪华商务车队阵容',
      fr: 'Notre Flotte d\'Exception',
      es: 'Nuestra Flota Ejecutiva',
      en: 'Executive Fleet Showcase',
    }[lang],
    fleetSectionSub: {
      ja: '全車緑ナンバー（営業許可取得車）・4WD完備・広々とした本革キャプテンシート',
      zh: '全系日本正规商业绿牌、全时四驱、航空真皮独立座椅与超大行李空间',
      fr: 'Véhicules officiels agréés MLIT, transmission 4x4 et sièges première classe.',
      es: 'Vehículos oficiales con licencia MLIT, tracción 4x4 y asientos de primera clase.',
      en: '100% Commercial Green-Plate Licensed Vehicles with 4WD, First-Class Leather Seating & Massive Luggage Bays.',
    }[lang],
    whyChooseTitle: {
      ja: 'SK Limoが選ばれる4つの理由',
      zh: '选择 SK Limo 的四大品质保障',
      fr: 'Pourquoi Choisir SK Limo',
      es: 'Por Qué Elegir SK Limo',
      en: 'Why Discerning Travelers Choose SK Limo',
    }[lang],
  };

  // Switch Service Tab and update sensible defaults
  const handleTabChange = (newTab: ServiceTabType) => {
    setServiceTab(newTab);
    if (newTab === 'airport') {
      setPickupLocation('hnd');
      setDestinationLocation('tokyo_hotel');
    } else if (newTab === 'sightseeing') {
      setPickupLocation('tokyo_hotel');
      setDestinationLocation('fuji-kawaguchiko');
    } else if (newTab === 'ski') {
      setPickupLocation('hnd');
      setDestinationLocation('hakuba');
    }
  };

  // Submit Quick Search Box
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceTab === 'airport') {
      router.push(`/tours/airport-transfer?pickup=${pickupLocation}&dest=${destinationLocation}&date=${travelDate}&vehicle=${selectedVehicleClass}`);
    } else if (serviceTab === 'sightseeing') {
      router.push(`/destinations/${destinationLocation}`);
    } else if (serviceTab === 'ski') {
      router.push(`/tours/winter#plan`);
    }
  };

  // Product cards (Trip.com Product List Style with +15% rates)
  const productCards = [
    {
      id: 'airport-hnd-nrt',
      title: {
        ja: '羽田・成田空港 ⇄ 都内ホテル 完全定額送迎',
        zh: '成田/羽田机场 ⇄ 东京酒店 VIP专属接送',
        fr: 'Transferts Aéroport Haneda & Narita ⇄ Hôtels de Tokyo',
        es: 'Traslados Aeropuerto Haneda y Narita ⇄ Hoteles de Tokio',
        en: 'Tokyo Airport VIP Transfers (Haneda & Narita)',
      }[lang],
      category: { ja: '空港送迎', zh: '机场接送', fr: 'Aéroport', es: 'Aeropuerto', en: 'Airport Transfer' }[lang],
      image: '/images/airport-transfer-vip-alphard-1376x768.jpg',
      badge: { ja: '完全定額保証', zh: '一口价保证', fr: 'Tarif Fixe', es: 'Tarifa Fija', en: 'All-Inclusive Fixed' }[lang],
      rating: '4.99',
      reviewCount: '520+',
      specs: [
        { ja: '60分無料待機', zh: '60分钟免费等待', fr: '60 min d\'attente', es: '60 min espera', en: '60-Min Delay Buffer' }[lang],
        { ja: '高速代・税金込', zh: '含高速费及税费', fr: 'Péages & Taxes inclus', es: 'Peajes e impuestos incl.', en: 'Tolls & Taxes Included' }[lang],
        { ja: 'ロビー出迎え', zh: '举牌迎接服务', fr: 'Accueil nominatif', es: 'Bienvenida con cartel', en: 'Name-Board Meet & Greet' }[lang],
      ],
      price: '¥35,000〜',
      href: '/tours/airport-transfer',
      popular: true,
    },
    {
      id: 'fuji-kawaguchiko',
      title: {
        ja: '富士山・河口湖・忍野八海・新倉山浅間公園 1日貸切',
        zh: '富士山・河口湖・忍野八海・新仓山浅间公园 10小时包车',
        fr: 'Mont Fuji, Lac Kawaguchiko & Oshino Hakkai (10h)',
        es: 'Monte Fuji, Lago Kawaguchiko y Oshino Hakkai (10h)',
        en: 'Mount Fuji, Lake Kawaguchiko & Oshino Hakkai Day Tour',
      }[lang],
      category: { ja: '富士山・絶景観光', zh: '富士山·世界遗产', fr: 'Mont Fuji', es: 'Monte Fuji', en: 'Mt. Fuji & Lakes' }[lang],
      image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
      badge: { ja: '人気No.1 定番コース', zh: '人气必游No.1', fr: 'Top Vente', es: 'Más Popular', en: 'Best Seller' }[lang],
      rating: '4.98',
      reviewCount: '840+',
      specs: [
        { ja: '10時間完全プライベート', zh: '10小时自由行程', fr: '10h Privé sur-mesure', es: '10h Privado a medida', en: '10h Bespoke Charter' }[lang],
        { ja: 'ホテル玄関発着', zh: '酒店大堂门到门', fr: 'Porte-à-porte Hôtel', es: 'Puerta a puerta', en: 'Door-to-Door Pickup' }[lang],
        { ja: '新倉山五重塔撮影', zh: '新仓山五重塔明信片景', fr: 'Pagode Chureito', es: 'Pagoda Chureito', en: 'Chureito Pagoda Stop' }[lang],
      ],
      price: '¥92,000〜',
      href: '/destinations/fuji-kawaguchiko',
      popular: true,
    },
    {
      id: 'hakone-lake-ashi',
      title: {
        ja: '箱根温泉・芦ノ湖海賊船・大涌谷・箱根神社 貸切周遊',
        zh: '箱根温泉・芦之湖海盗船・大涌谷・箱根神社 专属包车游',
        fr: 'Hakone Onsen, Lac Ashi & Grande Vallée Bouillonnante',
        es: 'Hakone Onsen, Lago Ashi y Gran Valle Hirviente',
        en: 'Hakone Onsen, Lake Ashi & Owakudani Volcano Day Tour',
      }[lang],
      category: { ja: '温泉・文化体験', zh: '温泉·自然风光', fr: 'Hakone & Onsen', es: 'Hakone y Onsen', en: 'Onsen & Nature' }[lang],
      image: '/images/dest-hakone-lake-ashi-1376x768.jpg',
      badge: { ja: '富士箱根国立公園', zh: '国立公园绝景', fr: 'Parc National', es: 'Parque Nacional', en: 'National Park' }[lang],
      rating: '4.97',
      reviewCount: '410+',
      specs: [
        { ja: '名湯立ち寄り自由', zh: '可自由安排日归温泉', fr: 'Arrêt Onsen au choix', es: 'Parada Onsen libre', en: 'Onsen Bath Option' }[lang],
        { ja: '芦ノ湖水中鳥居', zh: '箱根神社水中鸟居', fr: 'Torii Flottant Shinto', es: 'Torii Flotante', en: 'Torii Gate Photo' }[lang],
        { ja: '大涌谷黒たまご', zh: '大涌谷黑玉子', fr: 'Oeufs noirs Owakudani', es: 'Huevos negros', en: 'Owakudani Stop' }[lang],
      ],
      price: '¥92,000〜',
      href: '/destinations/hakone-lake-ashi',
      popular: false,
    },
    {
      id: 'winter-ski-hakuba',
      title: {
        ja: '白馬・野沢温泉・志賀高原 4WDスキーリゾート直行送迎',
        zh: '白马/野泽温泉/志贺高原 4WD全地形滑雪度假专车',
        fr: 'Transferts Ski Alpin 4WD Hakuba & Nozawa Onsen',
        es: 'Transfers Esquí 4WD Hakuba y Nozawa Onsen',
        en: 'Hakuba, Nozawa & Shiga Kogen 4WD Alpine Ski Transfers',
      }[lang],
      category: { ja: '冬季スキー送迎', zh: '滑雪度假专车', fr: 'Ski & Neige', es: 'Esquí Alpino', en: 'Winter Ski' }[lang],
      image: '/images/winter-ski-nagano-resort-1500x1001.jpg',
      badge: { ja: '4WD・スタッドレス標準', zh: '4WD防滑雪胎标配', fr: '4x4 Pneus Neige', es: '4WD Neumáticos Nieve', en: '4WD Snow Spec' }[lang],
      rating: '4.99',
      reviewCount: '380+',
      specs: [
        { ja: 'スキーバッグ最大9本', zh: '可容纳9套雪具装备', fr: 'Jusqu\'à 9 housses ski', es: 'Hasta 9 bolsas esquí', en: 'Up to 9 Ski Bags' }[lang],
        { ja: '雪道専任ドライバー', zh: '资深雪道经验驾驶员', fr: 'Chauffeur Expert Neige', es: 'Chófer Experto Nieve', en: 'Alpine Pro Chauffeur' }[lang],
        { ja: '空港・ホテル直行', zh: '机场/酒店直达雪场木屋', fr: 'Direct vers Chalets', es: 'Directo a Chalets', en: 'Door-to-Chalet' }[lang],
      ],
      price: '¥75,000〜',
      href: '/tours/winter',
      popular: false,
    },
  ];

  // Fleet Showcase Data (+15% rates)
  const fleetData = {
    alphard: {
      name: {
        ja: 'トヨタ アルファード エグゼクティブラウンジ',
        zh: '丰田埃尔法 Alphard 行政酒廊版',
        fr: 'Toyota Alphard Executive Lounge',
        es: 'Toyota Alphard Executive Lounge',
        en: 'Toyota Alphard Executive Lounge',
      }[lang],
      tagline: {
        ja: 'ファーストクラスの静粛性とVIPオットマン本革シート',
        zh: '头等舱极静座舱，配备独立电动航空座椅',
        fr: 'Sièges capitaine première classe et insonorisation d\'exception',
        es: 'Asientos de primera clase y marcha ultra silenciosa',
        en: 'Pinnacle of executive luxury with Ottoman captain recliners',
      }[lang],
      maxPax: 4,
      maxLuggage: 4,
      image: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
      features: [
        { ja: 'VIP電動オットマンリクライニングシート', zh: '全电动可调节航空头等舱座椅', fr: 'Fauteuils inclinables électriques', es: 'Asientos reclinables eléctricos', en: 'Power Ottoman Recliners' }[lang],
        { ja: '高遮音性プライベートガラス＆静粛キャビン', zh: '高等级隔音玻璃与极致静谧座舱', fr: 'Vitres acoustiques teintées VIP', es: 'Cristales acústicos tintados', en: 'Acoustic Privacy Glass' }[lang],
        { ja: '車内高速5G Wi-Fi・USB/Type-C充電完備', zh: '车内高速5G网络与各座充电接口', fr: 'Wi-Fi 5G & Prises USB individuelles', es: 'Wi-Fi 5G y cargadores USB', en: '5G Wi-Fi & USB Power Ports' }[lang],
      ],
      rates: {
        airportHnd: '¥35,000',
        airportNrt: '¥48,000',
        dayTour: '¥92,000',
      },
    },
    granace: {
      name: {
        ja: 'トヨタ グランエース プレミアムラウンジ',
        zh: '丰田格兰亚 Granace 豪华商务旗舰',
        fr: 'Toyota Granace Premium Lounge',
        es: 'Toyota Granace Premium Lounge',
        en: 'Toyota Granace Premium Lounge',
      }[lang],
      tagline: {
        ja: '圧倒的な空間美。4脚の独立本革キャプテンシートと全時4WD',
        zh: '宽大奢华座舱配备4张真皮独立座椅与全时四驱',
        fr: 'Lounge spacieux avec 4 fauteuils VIP et 4 roues motrices',
        es: 'Espacio imponente con 4 asientos VIP y tracción 4WD',
        en: 'Supreme spaciousness with 4 VIP captain chairs and full 4WD',
      }[lang],
      maxPax: 5,
      maxLuggage: 4,
      image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
      features: [
        { ja: '4脚の独立本革パワーキャプテンシート', zh: '4张独立真皮电动队长座椅', fr: '4 Sièges capitaine indépendants en cuir', es: '4 Asientos capitán de cuero', en: '4 Executive Leather Captain Chairs' }[lang],
        { ja: '雪道や山道も安心のフルタイム4WD駆動', zh: '雪道山地游刃有余的全时四驱系统', fr: 'Transmission intégrale 4x4 permanente', es: 'Tracción integral 4WD permanente', en: 'Full-Time 4WD All-Terrain Capability' }[lang],
        { ja: 'ゆったり足を伸ばせるプレミアムフットレスト', zh: '宽敞腿部空间与舒适腿托', fr: 'Repose-pieds grand confort', es: 'Reposapiés de gran confort', en: 'Spacious Legroom with Footrests' }[lang],
      ],
      rates: {
        airportHnd: '¥40,000',
        airportNrt: '¥55,000',
        dayTour: '¥98,000',
      },
    },
    hiace: {
      name: {
        ja: 'トヨタ ハイエース グランドキャビン',
        zh: '丰田海狮 HiAce Grand Cabin 大容量专车',
        fr: 'Toyota HiAce Grand Cabin',
        es: 'Toyota HiAce Grand Cabin',
        en: 'Toyota HiAce Grand Cabin',
      }[lang],
      tagline: {
        ja: '大人数グループ＆大量のスーツケースやスキー板を余裕で積載',
        zh: '多口之家、商务团体及大量行李雪具的终极出行利器',
        fr: 'Le choix idéal pour grands groupes et gros volumes de bagages',
        es: 'La opción ideal para grupos grandes y mucho equipaje',
        en: 'High-capacity van for up to 9 guests with massive luggage bay',
      }[lang],
      maxPax: 9,
      maxLuggage: 9,
      image: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
      features: [
        { ja: '最大9名様ゆったりご乗車可能なハイルーフ仕様', zh: '高顶加长车身，舒适容纳多达9位贵宾', fr: 'Toit surélevé pour 9 passagers', es: 'Techo elevado para 9 pasajeros', en: 'High-Roof Cabin for 9 Passengers' }[lang],
        { ja: 'スーツケース9個＋スキーバッグを同時積載', zh: '超大行李舱可容纳9个大箱与雪具', fr: 'Capacité 9 valises + housses de ski', es: 'Capacidad 9 maletas + esquís', en: 'Accommodates 9 Large Bags + Skis' }[lang],
        { ja: 'ファミリー旅行・インバウンド団体に最適', zh: '家庭出游、亲友同行、高管团队首选', fr: 'Idéal familles et délégations VIP', es: 'Ideal para familias y delegaciones VIP', en: 'Perfect for Families & VIP Delegations' }[lang],
      ],
      rates: {
        airportHnd: '¥38,000',
        airportNrt: '¥52,000',
        dayTour: '¥92,000',
      },
    },
  };

  const currentFleet = fleetData[fleetTab];

  const whatsAppGeneralUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring from your website about private luxury chauffeur charters in Japan.'
  )}`;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-[#C5A059] selection:text-[#0A0D14] relative overflow-x-hidden pb-16 sm:pb-0">

      {/* Shared Executive Header */}
      <SiteHeader currentLang={lang} onLanguageChange={setLang} activePage="home" />

      {/* ══════════════════════════════════════════════════════════
          1. TRIP.COM SIGNATURE HERO & EMBEDDED SEARCH/BOOKING WIDGET
          ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 bg-[#07090E] overflow-hidden border-b border-slate-800/80">
        
        {/* Background Scenery with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dest-fuji-kawaguchiko-1376x768.jpg"
            alt="Mount Fuji Luxury Chauffeur"
            fill
            priority
            className="object-cover object-center brightness-[0.25] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-[#07090E]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07090E]/50 to-[#07090E]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Hero Heading Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#0A0D14]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#E5C378] text-[11px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{ui.heroBadge}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-[1.15]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {ui.heroH1Line1} <span className="text-[#C5A059]">{ui.heroH1Line2}</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {ui.heroSub}
            </p>
          </div>

          {/* Trip.com-Style Tabbed Quick-Booking Search Bar */}
          <div
            ref={quickSearchRef}
            className="fade-in-section bg-[#0E131F]/95 backdrop-blur-xl border-2 border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
          >
            {/* 3 Top Category Tabs */}
            <div className="grid grid-cols-3 bg-[#0A0D14]/90 border-b border-slate-800/80">
              <button
                type="button"
                onClick={() => handleTabChange('airport')}
                className={`py-3.5 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceTab === 'airport'
                    ? 'bg-[#0E131F] text-[#C5A059] border-b-2 border-[#C5A059] shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Plane className="w-4 h-4 shrink-0" />
                <span className="truncate">{ui.searchTabAirport}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('sightseeing')}
                className={`py-3.5 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceTab === 'sightseeing'
                    ? 'bg-[#0E131F] text-[#C5A059] border-b-2 border-[#C5A059] shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span className="truncate">{ui.searchTabSightseeing}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('ski')}
                className={`py-3.5 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  serviceTab === 'ski'
                    ? 'bg-[#0E131F] text-cyan-400 border-b-2 border-cyan-400 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Snowflake className="w-4 h-4 shrink-0" />
                <span className="truncate">{ui.searchTabSki}</span>
              </button>
            </div>

            {/* Interactive Inputs Form */}
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 lg:p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Pick-up Point */}
                <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-3 sm:p-3.5 hover:border-slate-700 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{ui.pickupLabel}</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="hnd" className="bg-[#0E131F]">Haneda Airport (HND) [羽田空港]</option>
                    <option value="nrt" className="bg-[#0E131F]">Narita Airport (NRT) [成田空港]</option>
                    <option value="tokyo_hotel" className="bg-[#0E131F]">Tokyo Hotel / Central [都内ホテル]</option>
                    <option value="yokohama" className="bg-[#0E131F]">Yokohama Port / City [横浜]</option>
                  </select>
                </div>

                {/* 2. Destination Point */}
                <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-3 sm:p-3.5 hover:border-slate-700 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{ui.destLabel}</span>
                  </label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                  >
                    {serviceTab === 'airport' && (
                      <>
                        <option value="tokyo_hotel" className="bg-[#0E131F]">Tokyo Hotels (Grand Hyatt, Aman, etc.)</option>
                        <option value="hnd" className="bg-[#0E131F]">Haneda Airport (HND)</option>
                        <option value="nrt" className="bg-[#0E131F]">Narita Airport (NRT)</option>
                        <option value="tokyo_disney" className="bg-[#0E131F]">Tokyo Disney Resort (Maihama)</option>
                      </>
                    )}
                    {serviceTab === 'sightseeing' && (
                      <>
                        <option value="fuji-kawaguchiko" className="bg-[#0E131F]">Mt. Fuji &amp; Lake Kawaguchiko (10h)</option>
                        <option value="hakone-lake-ashi" className="bg-[#0E131F]">Hakone Onsen &amp; Lake Ashi (10h)</option>
                        <option value="kamakura-enoshima" className="bg-[#0E131F]">Kamakura &amp; Enoshima Coast (10h)</option>
                        <option value="nikko-unesco" className="bg-[#0E131F]">Nikko UNESCO World Heritage (10h)</option>
                        <option value="yokohama-bay" className="bg-[#0E131F]">Yokohama Port &amp; Bay Tour (10h)</option>
                        <option value="karuizawa-resort" className="bg-[#0E131F]">Karuizawa Mountain Retreat (10h)</option>
                      </>
                    )}
                    {serviceTab === 'ski' && (
                      <>
                        <option value="hakuba" className="bg-[#0E131F]">Hakuba Valley Ski Resort (Nagano)</option>
                        <option value="nozawa" className="bg-[#0E131F]">Nozawa Onsen Ski Resort (Nagano)</option>
                        <option value="shiga" className="bg-[#0E131F]">Shiga Kogen Ski Resort (Nagano)</option>
                        <option value="myoko" className="bg-[#0E131F]">Myoko Kogen Ski Resort (Niigata)</option>
                        <option value="madarao" className="bg-[#0E131F]">Madarao Mountain Resort (Nagano)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 3. Date Picker */}
                <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-3 sm:p-3.5 hover:border-slate-700 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{ui.dateLabel}</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                  />
                </div>

                {/* 4. Vehicle Class Selector */}
                <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-3 sm:p-3.5 hover:border-slate-700 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{ui.vehicleLabel}</span>
                  </label>
                  <select
                    value={selectedVehicleClass}
                    onChange={(e) => setSelectedVehicleClass(e.target.value as any)}
                    className="w-full bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="alphard" className="bg-[#0E131F]">Toyota Alphard (1-4 Pax)</option>
                    <option value="granace" className="bg-[#0E131F]">Toyota Granace 4WD (1-5 Pax)</option>
                    <option value="hiace" className="bg-[#0E131F]">Toyota HiAce Cabin (1-9 Pax)</option>
                  </select>
                </div>

              </div>

              {/* Action Button Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-[#25D366]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ja' ? '高速代・ガソリン代込' : 'All-Inclusive Tolls & Fuel'}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>{lang === 'ja' ? '緑ナンバー専属運行' : 'MLIT Green-Plate License'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#d8b46b] text-[#0A0D14] font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-[#C5A059]/25 transition-all cursor-pointer shrink-0"
                >
                  <span>{ui.searchBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          2. FEATURED TOURS & TRANSFERS PRODUCT CARDS (TRIP.COM STYLE)
          ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#07090E]">
        <div ref={productsRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
                Recommended Itineraries
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                {ui.popularToursTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {ui.popularToursSub}
              </p>
            </div>

            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:text-[#E5C378] transition-colors self-start md:self-auto"
            >
              <span>{lang === 'ja' ? 'すべての観光ツアーを見る' : 'View All Destinations'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group bg-[#0E131F] border border-slate-800/90 hover:border-[#C5A059]/70 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Container */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#0A0D14]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 object-[center_35%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="bg-[#0A0D14]/85 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {card.badge}
                      </span>
                      
                      <div className="flex items-center gap-1 bg-[#0A0D14]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{card.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({card.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#C5A059] block">
                      {card.category}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E5C378] transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                      {card.title}
                    </h3>

                    {/* Key Specs Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {card.specs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-[#0A0D14] border border-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-[#25D366] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Strip */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      {lang === 'ja' ? '完全定額参考料金' : 'All-Inclusive From'}
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#C5A059] font-mono">
                      {card.price}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 group-hover:bg-[#C5A059] text-[#E5C378] group-hover:text-[#0A0D14] font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                    <span>{lang === 'ja' ? '詳細・予約' : 'View & Book'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          3. TRIP.COM CAR HIRE MODULE — EXECUTIVE FLEET SHOWCASE
          ══════════════════════════════════════════════════════════ */}
      <section id="fleet" className="py-16 md:py-24 bg-[#0E131F] border-y border-slate-800/80">
        <div ref={fleetRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
              Official Executive Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {ui.fleetSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {ui.fleetSectionSub}
            </p>
          </div>

          {/* Fleet Vehicle Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {(['alphard', 'granace', 'hiace'] as const).map((key) => {
              const isActive = fleetTab === key;
              const vItem = fleetData[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFleetTab(key)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#C5A059] text-[#0A0D14] shadow-xl shadow-[#C5A059]/20'
                      : 'bg-[#0A0D14] border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>{vItem.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Fleet Details Display Card */}
          <div className="bg-[#0A0D14] border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Vehicle Image (Elevated object-position) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#05070B]">
                <Image
                  src={currentFleet.image}
                  alt={currentFleet.name}
                  fill
                  className="object-cover object-[center_35%] transition-all duration-500"
                />
              </div>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Passenger Limit</span>
                    <span className="text-xs sm:text-sm font-bold text-white">Max {currentFleet.maxPax} Guests</span>
                  </div>
                </div>

                <div className="bg-[#0E131F] border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                  <Luggage className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Suitcase Capacity</span>
                    <span className="text-xs sm:text-sm font-bold text-white">Max {currentFleet.maxLuggage} Large Bags</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Vehicle Features & Fixed Pricing Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="bg-[#C5A059]/15 text-[#E5C378] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Green-Plate Luxury Tier
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {currentFleet.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {currentFleet.tagline}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                {currentFleet.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Fixed Rates Matrix Strip */}
              <div className="bg-[#0E131F] border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Fixed Transparent Fares (+15% Tier)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#0A0D14] p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block truncate">Haneda HND</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#C5A059] block">{currentFleet.rates.airportHnd}</span>
                  </div>
                  <div className="bg-[#0A0D14] p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block truncate">Narita NRT</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#C5A059] block">{currentFleet.rates.airportNrt}</span>
                  </div>
                  <div className="bg-[#0A0D14] p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block truncate">10h Day Tour</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#C5A059] block">{currentFleet.rates.dayTour}</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Inquiry Button */}
              <div className="pt-2 flex gap-3">
                <a
                  href={whatsAppGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                  <span>{lang === 'ja' ? 'この車両をWhatsAppで問い合わせ' : 'Inquire This Vehicle on WhatsApp'}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          4. WHY BOOK WITH SK LIMO (TRIP.COM TRUST PILLARS)
          ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#07090E]">
        <div ref={trustRef} className="fade-in-section max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
              Official Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              {ui.whyChooseTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#E5C378] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">{t.greenPlateTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t.greenPlateDesc}</p>
            </div>

            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#E5C378] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#25D366]" />
              </div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'ja' ? '完全定額・追加料金なし' : 'All-Inclusive Fixed Rates'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ja'
                  ? '高速料金、燃料代、保険料、消費税すべてコミコミの一口価。当日の不当な追加請求は一切ございません。'
                  : 'All expressway tolls, fuel, vehicle insurance, and consumption taxes are included in our transparent fixed fares.'}
              </p>
            </div>

            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#E5C378] flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'ja' ? 'フライト遅延 60分無料待機' : 'Flight Delay Protection'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ja'
                  ? '便名をリアルタイム追跡。到着遅延時も追加料金なしで最大60分間無料で待機いたします。'
                  : 'Real-time flight monitoring at Haneda & Narita with complimentary 60-minute delay buffer.'}
              </p>
            </div>

            <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#E5C378] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#25D366]" />
              </div>
              <h4 className="font-bold text-white text-sm">
                {lang === 'ja' ? '24時間 WhatsApp コンシェルジュ' : '24/7 WhatsApp Concierge'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ja'
                  ? '英語・日本語・中国語に対応。旅程のカスタマイズや直前のご要望にも即座にお応えします。'
                  : 'Multilingual support in English, Japanese, and Chinese for custom routes and instant assistance.'}
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          5. MOBILE STICKY FLOATING BOOKING & CONCIERGE BAR
          ══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0A0D14]/95 backdrop-blur-xl border-t border-slate-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">All-Inclusive Charters</span>
          <span className="text-sm font-extrabold text-[#C5A059] font-mono">From ¥35,000</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsAppGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-[#0A0D14] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-[#0A0D14]" />
            <span>WhatsApp</span>
          </a>

          <Link
            href="/destinations"
            className="bg-[#C5A059] text-[#0A0D14] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
          >
            <span>Tours</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Official Legal Footer */}
      <SiteFooter />

    </div>
  );
}
