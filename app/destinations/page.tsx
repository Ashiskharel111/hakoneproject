'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Car,
  Users,
  Luggage,
  Sparkles,
  ShieldCheck,
  Plane,
  ChevronDown,
  Globe,
  MessageSquare,
  ArrowRight,
  Star,
  Check,
  Compass,
  Mountain,
  Camera,
  Calendar,
  Lock,
  X,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { MULTILINGUAL_DESTINATIONS } from '@/lib/destinations-data';

/* ──────────────────────────────────────────────
   DATA: TOKYO & SURROUNDING SIGHTSEEING SPOTS
   ────────────────────────────────────────────── */
interface DestinationItem {
  id: string;
  name: string;
  nameJa: string;
  category: string;
  categoryJa: string;
  tag: string;
  tagJa: string;
  duration: string;
  durationHours: string;
  recommendedDuration: string;
  image: string;
  overview: string;
  overviewJa: string;
  highlights: string[];
  highlightsJa: string[];
  granacePrice: string;
  hiacePrice: string;
  popularFor: string;
  popularForJa: string;
}

const TOKYO_DESTINATIONS: DestinationItem[] = [
  {
    id: 'fuji-kawaguchiko',
    name: 'Mount Fuji & Lake Kawaguchiko',
    nameJa: '富士山・河口湖・忍野八海',
    category: 'Nature & Iconic Landmark',
    categoryJa: '絶景・世界遺産',
    tag: '⭐ Most Popular Day Trip',
    tagJa: '⭐ 人気No.1 定番ツアー',
    duration: '2.0h from Tokyo',
    durationHours: '10h Day Charter',
    recommendedDuration: '1 Day (10-12 hrs)',
    image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
    overview: 'Experience the majesty of Mount Fuji from Lake Kawaguchiko, Chureito Pagoda, Oshino Hakkai spring ponds, and Mt. Kachi Kachi Ropeway with private door-to-door luxury transport.',
    overviewJa: '東京発日帰り。富士山を望む新倉山浅間公園（五重塔）、河口湖畔、富士山の伏流水が湧く忍野八海など、四季折々の絶景スポットを専属ハイヤーで贅沢に周遊。',
    highlights: ['Chureito Pagoda Viewpoint', 'Oshino Hakkai Ancient Springs', 'Lake Kawaguchiko Oishi Park', 'Fuji 5th Station (Seasonal)'],
    highlightsJa: ['新倉山浅間公園（五重塔と富士山）', '世界遺産 忍野八海', '大石公園・河口湖畔散策', '富士山五合目（季節限定）'],
    granacePrice: '¥85,000〜',
    hiacePrice: '¥80,000〜',
    popularFor: 'First-time visitors & Photography',
    popularForJa: '写真撮影・家族旅行・海外ゲスト',
  },
  {
    id: 'hakone-lake-ashi',
    name: 'Hakone Onsen & Lake Ashi',
    nameJa: '箱根温泉・芦ノ湖・大涌谷',
    category: 'Hot Springs & Culture',
    categoryJa: '温泉・大自然・美術館',
    tag: 'Top Onsen Experience',
    tagJa: '極上の温泉＆絶景',
    duration: '1.5 - 2.0h from Tokyo',
    durationHours: '10h Day Charter',
    recommendedDuration: '1 Day / Overnight',
    image: '/images/dest-hakone-lake-ashi-1376x768.jpg',
    overview: 'Famous for geothermal hot spring baths, Lake Ashi floating Torii gate, volcanic Owakudani valley black eggs, and world-class Open-Air Museums.',
    overviewJa: '富士箱根伊豆国立公園の中心地。芦ノ湖の箱根神社・平和の鳥居、噴煙立ち込める大涌谷、名湯立ち寄り温泉や箱根彫刻の森美術館など優雅なひとときを。',
    highlights: ['Hakone Shrine Floating Torii', 'Owakudani Volcanic Valley', 'Hakone Open-Air Museum', 'Private Onsen Day Spa Stop'],
    highlightsJa: ['箱根神社・湖上の平和の鳥居', '大涌谷（名物黒たまご）', '箱根彫刻の森美術館', '日帰り個室温泉・足湯カフェ'],
    granacePrice: '¥85,000〜',
    hiacePrice: '¥80,000〜',
    popularFor: 'Couples, VIP Relax & Culture',
    popularForJa: 'ご夫婦・カップル・癒やしの旅',
  },
  {
    id: 'kamakura-enoshima',
    name: 'Kamakura & Enoshima Coast',
    nameJa: '古都鎌倉・湘南江ノ島',
    category: 'Ancient Temples & Coastline',
    categoryJa: '古都歴史・海岸リゾート',
    tag: 'Samurai History & Ocean',
    tagJa: '武士の都と湘南の海',
    duration: '1.0 - 1.5h from Tokyo',
    durationHours: '8-10h Day Charter',
    recommendedDuration: '1 Day (8-10 hrs)',
    image: '/images/dest-kamakura-enoshima-1376x768.jpg',
    overview: 'The ancient 12th-century capital of Japan featuring the iconic Great Bronze Buddha (Kotoku-in), bamboo gardens at Hokoku-ji, Tsurugaoka Hachimangu, and the Shonan coastline.',
    overviewJa: '武家政権発祥の地・鎌倉。高徳院の国宝鎌倉大仏、竹林が美しい報国寺、鶴岡八幡宮、そして湘南の風薫る江ノ島海岸・七里ヶ浜を巡る贅沢な一日。',
    highlights: ['Great Buddha of Kamakura', 'Hokoku-ji Bamboo Grove & Matcha', 'Tsurugaoka Hachimangu Shrine', 'Shonan Coastline & Enoshima Island'],
    highlightsJa: ['鎌倉大仏（高徳院）', '報国寺の竹寺・抹茶体験', '鶴岡八幡宮・小町通り散策', '湘南海岸・七里ヶ浜・江ノ島'],
    granacePrice: '¥75,000〜',
    hiacePrice: '¥70,000〜',
    popularFor: 'History, Temples & Coastal Views',
    popularForJa: '歴史散策・寺社巡り・グルメ',
  },
  {
    id: 'nikko-unesco',
    name: 'Nikko National Park & Toshogu Shrine',
    nameJa: '日光東照宮・中禅寺湖・華厳の滝',
    category: 'UNESCO World Heritage',
    categoryJa: '世界遺産・大自然',
    tag: 'UNESCO Heritage Gold',
    tagJa: '国宝・世界遺産',
    duration: '2.5h from Tokyo',
    durationHours: '10-12h Day Charter',
    recommendedDuration: '1 Full Day',
    image: '/images/dest-nikko-unesco-1376x768.jpg',
    overview: 'Spectacular UNESCO World Heritage shrines nestled in towering cedar forests. Visit the gold-leaf Toshogu Shrine, Kegon Falls, Lake Chuzenji, and the historic Irohazaka pass.',
    overviewJa: '徳川家康公を祀る豪華絢爛な世界遺産「日光東照宮」。日本三名瀑の「華厳の滝」、標高1,269mに位置する中禅寺湖、いろは坂の壮大な大自然を満喫。',
    highlights: ['UNESCO Toshogu Gold Shrine', 'Kegon Waterfall (100m Drop)', 'Lake Chuzenji Scenic Cruise', 'Historic Irohazaka Mountain Pass'],
    highlightsJa: ['国宝 日光東照宮（陽明門・眠り猫）', '日本三名瀑 華厳の滝', '中禅寺湖畔・英国大使館別荘', 'いろは坂パノラマドライブ'],
    granacePrice: '¥95,000〜',
    hiacePrice: '¥90,000〜',
    popularFor: 'UNESCO Enthusiasts & Nature Lovers',
    popularForJa: '歴史愛好家・雄大な自然・紅葉',
  },
  {
    id: 'yokohama-bay',
    name: 'Yokohama Minato Mirai & Chinatown',
    nameJa: '横浜みなとみらい・元町中華街',
    category: 'Modern Port & Dining',
    categoryJa: '港町・美食・夜景',
    tag: 'Harbor Lights & Cuisine',
    tagJa: '港の夜景と本格中華',
    duration: '45m from Tokyo',
    durationHours: '6-8h Day Charter',
    recommendedDuration: 'Half / Full Day',
    image: '/images/dest-yokohama-bay-4662x5828.jpg',
    overview: 'Japan’s historic international port city with the largest Chinatown, Sankeien traditional Japanese garden, Red Brick Warehouses, and dazzling waterfront skyline.',
    overviewJa: '開港の歴史を刻む港町・横浜。日本最大の中華街で本格飲茶、名園「三溪園」の日本建築散策、赤レンガ倉庫、そして大観覧車が彩るみなとみらいの絶景夜景。',
    highlights: ['Yokohama Chinatown Dim Sum', 'Sankeien Traditional Garden', 'Red Brick Warehouse Harbor', 'Minato Mirai Skyline Night View'],
    highlightsJa: ['日本最大の横浜中華街グルメ', '名勝 三溪園の日本庭園', '赤レンガ倉庫・山下公園', 'みなとみらい夜景ドライブ'],
    granacePrice: '¥65,000〜',
    hiacePrice: '¥60,000〜',
    popularFor: 'Foodies, Night View & City Tours',
    popularForJa: 'グルメ・夜景デート・短時間観光',
  },
  {
    id: 'karuizawa-retreat',
    name: 'Karuizawa Alpine Summer & Autumn Resort',
    nameJa: '軽井沢・白糸の滝・プリンスショッピング',
    category: 'Alpine Luxury Resort',
    categoryJa: '高原リゾート・避暑地',
    tag: 'Forest Luxury & Shopping',
    tagJa: '高原の清流とショッピング',
    duration: '2.5h from Tokyo',
    durationHours: '10-12h Day Charter',
    recommendedDuration: '1 Full Day / Overnight',
    image: '/images/dest-karuizawa-resort-1500x1001.jpg',
    overview: 'Japan’s premier highland getaway favored by royalty and celebrities. Features Shiraito Waterfalls, Kumoba Pond, Old Karuizawa Ginza, and the Prince Shopping Plaza.',
    overviewJa: 'ジョン・レノンも愛した日本を代表する高級高原リゾート。マイナスイオン溢れる「白糸の滝」、雲場池の絶景、旧軽井沢銀座、そして日本最大級のアウトレット。',
    highlights: ['Shiraito Waterfall Veil', 'Kumoba Pond Mirror Waters', 'Old Karuizawa Historic Street', 'Karuizawa Prince Shopping Plaza'],
    highlightsJa: ['清流が織りなす白糸の滝', '白鳥の湖・雲場池', '旧軽井沢銀座通り散策', '軽井沢プリンスショッピングプラザ'],
    granacePrice: '¥95,000〜',
    hiacePrice: '¥90,000〜',
    popularFor: 'Luxury Shoppers & Nature Retreat',
    popularForJa: 'ショッピング・避暑・紅葉狩り',
  },
];

import { useLanguage } from '@/context/LanguageContext';

export default function TokyoDestinationsPage() {
  const [lang, setLang] = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestForModal, setSelectedDestForModal] = useState<DestinationItem | null>(null);

  const t = TRANSLATIONS[lang];

  const getCardInfo = (dest: DestinationItem) => {
    if (lang === 'ja') {
      return {
        name: dest.nameJa,
        category: dest.categoryJa,
        tag: dest.tagJa,
        overview: dest.overviewJa,
      };
    }
    if (lang === 'zh' || lang === 'fr' || lang === 'es') {
      const ml = MULTILINGUAL_DESTINATIONS[dest.id]?.[lang];
      if (ml) {
        return {
          name: ml.name,
          category: ml.category,
          tag: ml.tag,
          overview: ml.overview,
        };
      }
    }
    return {
      name: dest.name,
      category: dest.category,
      tag: dest.tag,
      overview: dest.overview,
    };
  };

  // Form inputs for consultation modal
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [pax, setPax] = useState('4');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: lang === 'ja' ? 'すべて表示' : lang === 'zh' ? '全部目的地' : lang === 'fr' ? 'Toutes destinations' : lang === 'es' ? 'Todos los destinos' : 'All Destinations' },
    { id: 'fuji', label: lang === 'ja' ? '富士山・箱根' : lang === 'zh' ? '富士山与箱根' : lang === 'fr' ? 'Mont Fuji & Hakone' : lang === 'es' ? 'Monte Fuji y Hakone' : 'Mt. Fuji & Hakone' },
    { id: 'culture', label: lang === 'ja' ? '歴史・世界遺産' : lang === 'zh' ? '古都历史与世界遗产' : lang === 'fr' ? 'Culture & UNESCO' : lang === 'es' ? 'Cultura y UNESCO' : 'Culture & UNESCO' },
    { id: 'resort', label: lang === 'ja' ? '高原・港町' : lang === 'zh' ? '高原度假与港湾' : lang === 'fr' ? 'Villégiature & Côte' : lang === 'es' ? 'Resort y Costa' : 'Resorts & Coast' },
  ];

  const filteredDestinations = TOKYO_DESTINATIONS.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'fuji') return item.id.includes('fuji') || item.id.includes('hakone');
    if (selectedCategory === 'culture') return item.id.includes('kamakura') || item.id.includes('nikko');
    if (selectedCategory === 'resort') return item.id.includes('yokohama') || item.id.includes('karuizawa');
    return true;
  });

  const openInquiry = (dest: DestinationItem) => {
    setSelectedDestForModal(dest);
    setIsModalOpen(true);
    setSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsAppUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo! I am interested in a private chauffeur day trip to ${selectedDestForModal?.name || 'Tokyo Destinations'}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-[#C5A059]/30 selection:text-[#E5C378]">

      {/* Shared Unified Header Navigation */}
      <SiteHeader currentLang={lang} onLanguageChange={setLang} activePage="sightseeing" />

      {/* ═══════════════════════════════════════
          HERO BANNER (5-Language Native Translation)
          ═══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#05070B] via-[#0A0D14] to-[#0E131F]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C378] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            {
              {
                ja: '東京発・完全貸切プライベートハイヤー',
                zh: '东京出发・全包专属VIP包车一日游',
                fr: 'Excursions d\'un Jour & Circuits Privés',
                es: 'Excursiones Privadas y Tours a Medida',
                en: 'Private Chauffeur Day Trips & Custom Charters',
              }[lang]
            }
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            {
              {
                ja: '東京近郊の絶景・世界遺産を巡る旅',
                zh: '东京周边绝景・富士山与世界遗产之旅',
                fr: 'Les Plus Beaux Sites Autour de Tokyo',
                es: 'Destinos Emblemáticos Alrededor de Tokio',
                en: 'Iconic Destinations Around Tokyo',
              }[lang]
            }
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              {
                ja: '富士山、箱根温泉、古都鎌倉、日光東照宮など、東京から日帰りで満喫できる名所を専属ドライバーが贅沢にご案内いたします。',
                zh: '富士山、箱根温泉、古都镰仓、日光东照宫等，东京出发当日往返，专属司机为您提供无忧奢华游览体验。',
                fr: 'Explorez le Mont Fuji, les onsens de Hakone, Kamakura et les sanctuaires de Nikko dans le confort d\'un chauffeur VIP.',
                es: 'Descubra el Monte Fuji, los onsens de Hakone, los templos de Kamakura y Nikko con total comodidad y chofer privado.',
                en: 'Discover Mount Fuji, Hakone Onsens, ancient Kamakura temples, and UNESCO Nikko Shrines in unhurried, VIP door-to-door comfort.',
              }[lang]
            }
          </p>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              {
                {
                  ja: '国交省認可・緑ナンバー',
                  zh: '日本国土交通省正规绿牌认证',
                  fr: 'Opérateur Agréé Licence MLIT',
                  es: 'Operador Oficial Licencia MLIT',
                  en: '100% Licensed Commercial Operator',
                }[lang]
              }
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Car className="w-4 h-4 text-[#C5A059]" />
              {
                {
                  ja: '最高峰 Granace / HiAce',
                  zh: '丰田 Granace・HiAce 豪华车队',
                  fr: 'Flotte Toyota Granace & HiAce',
                  es: 'Flota Toyota Granace y HiAce',
                  en: 'Toyota Granace & HiAce Fleet',
                }[lang]
              }
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              {
                {
                  ja: '自由な旅程・ホテル送迎',
                  zh: '行程自由定制・酒店上门接送',
                  fr: 'Itinéraire Flexible & Prise en Charge',
                  es: 'Itinerario Flexible y Recogida en Hotel',
                  en: 'Flexible Itinerary & Hotel Pickup',
                }[lang]
              }
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORY FILTER TABS
          ═══════════════════════════════════════ */}
      <section className="bg-[#0E131F]/95 backdrop-blur-xl border-y border-slate-800/60 sticky top-16 sm:top-20 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A059] text-[#0A0D14] shadow-md'
                    : 'bg-[#0A0D14] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            {
              {
                ja: `全 ${filteredDestinations.length} エリア掲載中`,
                zh: `共显示 ${filteredDestinations.length} 个热门目的地`,
                fr: `Affichage de ${filteredDestinations.length} destinations`,
                es: `Mostrando ${filteredDestinations.length} destinos`,
                en: `Showing ${filteredDestinations.length} Destinations`,
              }[lang]
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DESTINATIONS GRID (Compact 50% Size, 2-in-a-row on Mobile)
          ═══════════════════════════════════════ */}
      <section className="py-10 md:py-16 bg-[#0A0D14]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredDestinations.map((dest) => {
              const cardInfo = getCardInfo(dest);
              return (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.id}`}
                  className="bg-[#0E131F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg hover:border-[#C5A059] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Compact Top Image */}
                    <div className="relative h-28 sm:h-44 md:h-48 w-full overflow-hidden">
                      <Image
                        src={dest.image}
                        alt={cardInfo.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-transparent opacity-80" />
                      
                      {/* Badge */}
                      <span className="absolute top-2 left-2 bg-[#0A0D14]/85 backdrop-blur-md text-[#E5C378] border border-[#C5A059]/40 text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                        {cardInfo.tag}
                      </span>

                      <span className="absolute bottom-2 right-2 bg-[#0A0D14]/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] sm:text-[11px] text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        <span>{dest.duration}</span>
                      </span>
                    </div>

                    {/* Compact Content */}
                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                        {cardInfo.category}
                      </span>
                      <h2 className="text-xs sm:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#E5C378] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                        {cardInfo.name}
                      </h2>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 hidden sm:block">
                        {cardInfo.overview}
                      </p>
                    </div>
                  </div>

                  {/* Compact Footer Pricing & CTA */}
                  <div className="p-3 sm:p-4 pt-0 border-t border-slate-800/50 mt-2 pt-2.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase block leading-tight">
                        {lang === 'ja' ? '定額チャーター' : lang === 'zh' ? '全包一口价' : lang === 'fr' ? 'Forfait dès' : lang === 'es' ? 'Tarifa desde' : 'Full Day From'}
                      </span>
                      <span className="text-xs sm:text-base font-bold font-mono text-[#C5A059]">
                        {dest.granacePrice}
                      </span>
                    </div>

                    <span className="bg-[#C5A059] group-hover:bg-[#b08e4c] text-[#0A0D14] font-bold px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow flex items-center gap-1 shrink-0">
                      <span>{lang === 'ja' ? '旅程/予約' : lang === 'zh' ? '行程/预订' : lang === 'fr' ? 'Détails' : lang === 'es' ? 'Itinerario' : 'Itinerary'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Payment Trust Bar (Credit Card + PayPal Supported) */}
          <div className="bg-[#0E131F]/80 border border-slate-800/80 rounded-2xl p-4 sm:p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#E5C378]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>
                {
                  {
                    ja: 'クレジットカード＆PayPal決済に対応',
                    zh: '支持国际信用卡与 PayPal 担保支付',
                    fr: 'Paiements par Carte Bancaire & PayPal',
                    es: 'Pagos con Tarjeta de Crédito y PayPal',
                    en: 'Credit Card & PayPal Payments Supported',
                  }[lang]
                }
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 max-w-xl mx-auto">
              {
                {
                  ja: 'Visa, MasterCard, American Express, JCB, PayPalによるオンライン即時決済・デポジット予約に対応しております。',
                  zh: '支持 Visa、MasterCard、Amex、JCB、PayPal 及 Apple Pay，256位 SSL 加密保障资金安全。',
                  fr: 'Cartes Visa, MasterCard, Amex, JCB et PayPal acceptées avec sécurité SSL 256 bits.',
                  es: 'Aceptamos Visa, MasterCard, Amex, JCB y PayPal con encriptación segura SSL de 256 bits.',
                  en: 'We accept all major credit cards (Visa, MasterCard, Amex, JCB), PayPal instant checkout, and Apple Pay with 256-bit SSL encryption.',
                }[lang]
              }
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3 pt-1 text-[11px] text-slate-300 font-mono">
              <span className="bg-[#0A0D14] border border-slate-800 px-2.5 py-1 rounded">Visa / MasterCard</span>
              <span className="bg-[#0A0D14] border border-slate-800 px-2.5 py-1 rounded">American Express</span>
              <span className="bg-[#0A0D14] border border-slate-800 px-2.5 py-1 rounded">JCB</span>
              <span className="bg-[#0A0D14] border border-slate-800 px-2.5 py-1 rounded">PayPal</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          CUSTOM TOUR CONCIERGE BANNER
          ═══════════════════════════════════════ */}
      <section className="bg-[#0E131F] border-t border-slate-800/40 py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center space-y-5">
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
            {
              {
                ja: '完全オーダーメイド旅程',
                zh: '私人定制专属行程',
                fr: 'Itinéraires Sur-Mesure',
                es: 'Itinerarios a Medida',
                en: 'Bespoke Private Itineraries',
              }[lang]
            }
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-normal" style={{ fontFamily: 'var(--font-serif)' }}>
            {
              {
                ja: 'お客様だけの特別な東京・近郊ツアーを設計',
                zh: '为您量身打造专属东京周边豪华游',
                fr: 'Concevez Votre Circuit Privé au Japon',
                es: 'Diseñe su Tour Privado por Japón',
                en: 'Craft Your Custom Japan Chauffeur Tour',
              }[lang]
            }
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {
              {
                ja: '「富士山と御殿場アウトレットを同日に巡りたい」「家族で鎌倉と横浜の夜景を楽しみたい」など、自由なルート作成と立ち寄り地のご要望に対応いたします。',
                zh: '无论是富士山搭配御殿场奥特莱斯购物，还是镰仓古寺与横滨夜景同游，我们的礼宾团队将为您精心定制每一分钟。',
                fr: 'Combinez le Mont Fuji et Gotemba Outlets, ou Kamakura et la baie de Yokohama. Notre conciergerie adapte chaque étape.',
                es: 'Combine el Monte Fuji con compras en Gotemba, o Kamakura con Yokohama. Nuestro concierge personalizará cada detalle.',
                en: 'Combine Mount Fuji with Gotemba Outlet shopping, or pair Kamakura temples with Yokohama sunset dining. Our concierge will tailor every minute.',
              }[lang]
            }
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://wa.me/818012345678?text=Hello%20SK%20Limo!%20I%20would%20like%20to%20plan%20a%20custom%20tour%20around%20Tokyo."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
              <span>
                {
                  {
                    ja: 'WhatsAppで旅程相談',
                    zh: 'WhatsApp 咨询定制',
                    fr: 'Consulter sur WhatsApp',
                    es: 'Consultar por WhatsApp',
                    en: 'WhatsApp Concierge',
                  }[lang]
                }
              </span>
            </a>
            <Link
              href="/tours/winter"
              className="border border-slate-700 hover:border-white text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
            >
              {
                {
                  ja: '冬季スキー送迎を見る',
                  zh: '查看冬季滑雪包车',
                  fr: 'Voir les Transferts Ski',
                  es: 'Ver Transfers de Esquí',
                  en: 'View Winter Ski Charters',
                }[lang]
              }
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OFFICIAL SK LIMO LEGAL FOOTER
          ═══════════════════════════════════════ */}
      <SiteFooter />

      {/* ═══════════════════════════════════════
          INQUIRY & PAYMENT MODAL (Credit Card + PayPal)
          ═══════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0E131F] border border-slate-800/80 rounded-2xl max-w-lg w-full p-5 sm:p-7 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">Reserve Private Charter</span>
                <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {selectedDestForModal?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name / お名前</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-3.5 py-2 text-white text-sm focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email / メールアドレス</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-3.5 py-2 text-white text-sm focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Date / 予定日</label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Guests / 人数</label>
                    <select
                      value={pax}
                      onChange={(e) => setPax(e.target.value)}
                      className="w-full bg-[#0A0D14] border border-slate-700/60 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C5A059] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={n}>{n} Guests ({n <= 5 ? 'Granace' : 'HiAce'})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="border-t border-slate-800/60 pt-3 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Preferred Payment / お支払い方法</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 bg-[#0A0D14] border border-[#C5A059]/40 p-2.5 rounded-lg cursor-pointer text-slate-200">
                      <input type="radio" name="paymentMethod" defaultChecked className="accent-[#C5A059]" />
                      <span>Credit Card</span>
                    </label>
                    <label className="flex items-center gap-2 bg-[#0A0D14] border border-slate-800 p-2.5 rounded-lg cursor-pointer text-slate-200">
                      <input type="radio" name="paymentMethod" className="accent-[#C5A059]" />
                      <span>PayPal</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#C5A059]" /> 256-bit Encrypted. Payment link sent upon reservation confirmation.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-[#0A0D14] font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                  >
                    <MessageSquare className="w-4 h-4 fill-[#0A0D14]" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="submit"
                    className="flex-1 bg-[#C5A059] hover:bg-[#b08e4c] text-[#0A0D14] font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow cursor-pointer"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  Reservation Request Received
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Thank you {name}. We have logged your booking for {selectedDestForModal?.name}. Our dispatch team is preparing your Credit Card / PayPal invoice and will email {email} within 2 hours.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
