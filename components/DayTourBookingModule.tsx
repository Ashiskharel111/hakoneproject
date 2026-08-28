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
  Check,
  AlertTriangle,
  Navigation,
  Fuel,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import StripePaymentModal, { BookingPaymentDetails } from '@/components/StripePaymentModal';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import GoogleRouteMap from '@/components/GoogleRouteMap';
import { getTodayJST, getFutureDateJST, isValidEmail, isValidPhone } from '@/lib/date-utils';

export interface DayTourBookingModuleProps {
  initialDestination?: string;
  initialDate?: string;
  onBackToCatalog?: () => void;
}

export interface TourItineraryStop {
  time: string;
  badge: { en: string; ja: string; zh: string; fr: string; es: string };
  title: { en: string; ja: string; zh: string; fr: string; es: string };
  description: { en: string; ja: string; zh: string; fr: string; es: string };
}

export interface TourDestination {
  id: string;
  name: { en: string; ja: string; zh: string; fr: string; es: string };
  region: { en: string; ja: string; zh: string; fr: string; es: string };
  charterHours: string;
  baseTourRate: number;
  image: string;
  distanceKm: number;
  driveTime: string;
  expressway: string;
  mapQuery: string;
  highlights: { en: string[]; ja: string[]; zh: string[]; fr: string[]; es: string[] };
  itinerary: TourItineraryStop[];
}

export const TOUR_DESTINATIONS: TourDestination[] = [
  {
    id: 'fuji-kawaguchiko',
    name: {
      en: 'Mount Fuji & Lake Kawaguchiko',
      ja: '富士山・河口湖・忍野八海 貸切チャーター',
      zh: '富士山・河口湖・忍野八海 经典尊享一日游',
      fr: 'Mont Fuji & Lac Kawaguchiko',
      es: 'Monte Fuji y Lago Kawaguchiko',
    },
    region: {
      en: 'Yamanashi Prefecture',
      ja: '山梨県・富士五湖',
      zh: '山梨县・富士五湖',
      fr: 'Préfecture de Yamanashi',
      es: 'Prefectura de Yamanashi',
    },
    charterHours: '10 Hours',
    baseTourRate: 75000,
    image: '/images/dest-fuji-hero-1920x1080.jpg',
    distanceKm: 118,
    driveTime: '1 hr 45 min',
    expressway: 'Chuo Expressway (中央道) & Kawaguchiko Route',
    mapQuery: 'Lake+Kawaguchiko+Mount+Fuji+Japan',
    highlights: {
      en: ['5th Station panoramic views', 'Oshino Hakkai crystal ponds', 'Arakurayama Sengen Pagoda', 'Lake Kawaguchi lakeside'],
      ja: ['富士山五合目パノラマ', '忍野八海の湧水群', '新倉山浅間公園 忠霊塔', '河口湖北岸の絶景'],
      zh: ['富士山五合目全景', '忍野八海清泉', '新仓山浅间公园五重塔', '河口湖畔远眺'],
      fr: ['5e station vue panoramique', 'Sources pures d\'Oshino Hakkai', 'Pagode Arakurayama', 'Rives du lac Kawaguchi'],
      es: ['Vistas panorámicas 5ª Estación', 'Manantiales sagrados Oshino Hakkai', 'Pagoda Arakurayama', 'Paseo por el lago Kawaguchi'],
    },
    itinerary: [
      {
        time: '08:30',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Tokyo Hotel Pick-Up',
          ja: '都内ホテル・ご指定場所へお迎え',
          zh: '东京都内酒店或指定地点大堂接驾',
          fr: 'Prise en charge à votre hôtel à Tokyo',
          es: 'Recogida en su hotel en Tokio',
        },
        description: {
          en: 'Chauffeur meets you in the hotel lobby with your name board and helps load all day bags into the VIP cabin.',
          ja: '専任乗務員がロビーでお出迎えし、お荷物を積載して中央自動車道経由で富士山麓へ向かいます。',
          zh: '专业司机在大堂举牌恭候，协助安放随身行李，舒适启程直奔富士山。',
          fr: 'Votre chauffeur privé vous accueille dans le hall et charge vos bagages pour le départ vers le Mont Fuji.',
          es: 'El chófer le recibe en el vestíbulo y carga su equipaje para partir hacia el Monte Fuji.',
        },
      },
      {
        time: '10:30',
        badge: { en: 'Iconic View', ja: '絶景', zh: '经典地标', fr: 'Vue Emblématique', es: 'Vista Icónica' },
        title: {
          en: 'Arakurayama Sengen Park (Chureito Pagoda)',
          ja: '新倉山浅間公園（忠霊塔と富士山）',
          zh: '新仓山浅间公园（经典五重塔同框）',
          fr: 'Parc Arakurayama Sengen (Pagode Chureito)',
          es: 'Parque Arakurayama Sengen (Pagoda Chureito)',
        },
        description: {
          en: 'Ascend to witness Japan’s most celebrated postcard viewpoint: the crimson 5-story pagoda framed by Mount Fuji.',
          ja: '朱色の五重塔と富士山が織りなす、世界的に有名な日本の象徴的パノラマビューを満喫。',
          zh: '登临观景台，拍摄朱红五重塔与富士山雄伟山姿融为一体的明信片级绝景。',
          fr: 'Admirez la célèbre pagode rouge à 5 étages parfaitement cadrée devant le Mont Fuji.',
          es: 'Suba para presenciar la postal más icónica de Japón: la pagoda roja enmarcada por el Monte Fuji.',
        },
      },
      {
        time: '12:00',
        badge: { en: 'Lunch', ja: '昼食', zh: '当地美食', fr: 'Déjeuner', es: 'Almuerzo' },
        title: {
          en: 'Lake Kawaguchiko Lakeside & Hoto Noodle Lunch',
          ja: '河口湖畔散策＆甲州名物ほうとうランチ',
          zh: '河口湖畔漫步与甲州名物馎饦面午餐',
          fr: 'Rives du Lac Kawaguchi & Déjeuner Hoto',
          es: 'Riberas del Lago Kawaguchi y Almuerzo Típico Hoto',
        },
        description: {
          en: 'Enjoy authentic Yamanashi Hoto noodles at a charming lakeside restaurant with tranquil views of Mount Fuji.',
          ja: '河口湖の風光明媚な景色を眺めながら、野菜たっぷりの郷土料理「甲州ほうとう」をご賞味。',
          zh: '在湖畔景观餐厅品尝山梨县特色热气腾腾的馎饦面（Hoto）及地方料理。',
          fr: 'Savourez les délicieuses nouilles Hoto traditionnelles face aux eaux paisibles du lac.',
          es: 'Disfrute de los auténticos fideos Hoto en un restaurante junto al lago con vistas al monte.',
        },
      },
      {
        time: '13:45',
        badge: { en: 'UNESCO Heritage', ja: '世界遺産', zh: '世界遗产', fr: 'Patrimoine UNESCO', es: 'Patrimonio UNESCO' },
        title: {
          en: 'Oshino Hakkai Sacred Spring Ponds',
          ja: '忍野八海（世界遺産・霊峰の湧水池群）',
          zh: '忍野八海（世界文化遗产・清泉古民家）',
          fr: 'Sources Sacrées d\'Oshino Hakkai',
          es: 'Manantiales Sagrados de Oshino Hakkai',
        },
        description: {
          en: 'Stroll through a traditional thatched-roof village fed by Mount Fuji’s filtered, crystal-clear 80-year snowmelt springs.',
          ja: '富士山の雪解け水が数十年の歳月をかけて湧き出る8つの神聖な湧水池と茅葺き屋根の集落を散策。',
          zh: '漫步于古朴的茅草屋集落间，欣赏富士山融雪经过数十年地层过滤而成的清澈八大涌泉。',
          fr: 'Découvrez les 8 étangs sacrés aux eaux cristallines issues de la fonte des neiges du Mont Fuji.',
          es: 'Pasee por una aldea tradicional con manantiales cristalinos formados por el deshielo del Fuji.',
        },
      },
      {
        time: '15:30',
        badge: { en: 'Photo Stop', ja: '散策', zh: '花海拍照', fr: 'Arrêt Photo', es: 'Parada Fotográfica' },
        title: {
          en: 'Oishi Park & Lake Flower Terrace',
          ja: '大石公園・富士大石ハナテラス',
          zh: '大石公园・花海露台与湖畔文创',
          fr: 'Parc Oishi & Terrasse Fleurie',
          es: 'Parque Oishi y Terraza Floral',
        },
        description: {
          en: 'Relax with panoramic views across Lake Kawaguchiko, seasonal flower fields (lavender/kochia), and artisan boutiques.',
          ja: '湖畔に広がる四季折々の花畑と逆さ富士の眺望を楽しみ、お洒落なカフェやお土産選びを満喫。',
          zh: '欣赏季节花海（薰衣草/扫帚草）与湖光山色倒影，并在文创小店品尝特色冰淇淋。',
          fr: 'Promenade au bord du lac parmi les champs de fleurs saisonnières et boutiques artisanales.',
          es: 'Relájese con vistas panorámicas al lago, campos de flores estacionales y tiendas de artesanía.',
        },
      },
      {
        time: '18:30',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Comfortable Return to Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '平稳送达东京都内酒店或晚餐餐厅',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Relax in reclining executive seats on the highway cruise back to your hotel in central Tokyo.',
          ja: '高速道路を快適にクルーズし、都内のホテルやご指定のディナー会場へお送りいたします。',
          zh: '在VIP头等舱座椅上舒适小憩，专车平稳送返东京酒店。',
          fr: 'Détendez-vous dans votre salon VIP privé sur le trajet de retour vers votre hôtel.',
          es: 'Relájese en los cómodos asientos reclinables mientras su chófer le lleva de regreso a Tokio.',
        },
      },
    ],
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
    region: {
      en: 'Kanagawa Prefecture',
      ja: '神奈川県・箱根町',
      zh: '神奈川县・箱根町',
      fr: 'Préfecture de Kanagawa',
      es: 'Prefectura de Kanagawa',
    },
    charterHours: '10 Hours',
    baseTourRate: 78000,
    image: '/images/dest-hakone-hero-1920x1080.jpg',
    distanceKm: 92,
    driveTime: '1 hr 30 min',
    expressway: 'Tomei (東名高速) & Odawara-Atsugi Highway',
    mapQuery: 'Hakone+Lake+Ashi+Kanagawa+Japan',
    highlights: {
      en: ['Lake Ashi Torii Gate', 'Owakudani geothermal valley', 'Hakone Open-Air Museum', 'Private onsen bath stops'],
      ja: ['箱根神社 平和の鳥居', '大涌谷の火山景観・黒たまご', '彫刻の森美術館', '日帰り温泉立寄り対応'],
      zh: ['芦之湖水中鸟居', '大涌谷地热与黑玉子', '雕刻之森美术馆', '顶级日归温泉体验'],
      fr: ['Torii flottant du lac Ashi', 'Vallée volcanique d\'Owakudani', 'Musée en plein air', 'Bains onsen privés'],
      es: ['Puerta Torii del Lago Ashi', 'Valle volcánico de Owakudani', 'Museo al aire libre', 'Baños termales onsen'],
    },
    itinerary: [
      {
        time: '08:30',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Tokyo Hotel Pick-Up',
          ja: '都内ホテルへお迎え',
          zh: '东京都内酒店出发',
          fr: 'Départ de votre hôtel à Tokyo',
          es: 'Salida del hotel en Tokio',
        },
        description: {
          en: 'Chauffeur departs along the Tomei Expressway towards scenic Hakone national park.',
          ja: 'ホテルロビーでお出迎えし、東名高速・小田原厚木道路経由で箱根へ向かいます。',
          zh: '专车从酒店出发，沿东名高速经小田原厚木道路直达箱根国立公园。',
          fr: 'Départ sur l\'autoroute Tomei vers les montagnes verdoyantes de Hakone.',
          es: 'Salida por la autopista Tomei hacia el parque nacional de Hakone.',
        },
      },
      {
        time: '10:30',
        badge: { en: 'Spiritual', ja: '名所', zh: '神社名所', fr: 'Sanctuaire', es: 'Santuario' },
        title: {
          en: 'Hakone Shrine & Floating Torii Gate',
          ja: '箱根神社・平和の鳥居（芦ノ湖畔）',
          zh: '箱根神社・芦之湖水中“和平鸟居”',
          fr: 'Sanctuaire de Hakone & Torii Flottant',
          es: 'Santuario de Hakone y Torii Flotante',
        },
        description: {
          en: 'Walk the ancient cedar paths to the serene red Torii gate standing directly inside Lake Ashi.',
          ja: '樹齢数百年の杉並木を歩き、芦ノ湖に浮かぶ朱色の「平和の鳥居」で記念撮影。',
          zh: '穿行于古老幽静的巨杉参道，前往芦之湖畔水中朱红鸟居打卡留影。',
          fr: 'Promenade sous les cèdres millénaires vers le torii rouge émergeant du lac Ashi.',
          es: 'Camine entre cedros milenarios hacia la majestuosa puerta Torii en el agua.',
        },
      },
      {
        time: '11:45',
        badge: { en: 'Lunch', ja: '昼食', zh: '午餐', fr: 'Déjeuner', es: 'Almuerzo' },
        title: {
          en: 'Lake Ashi Sightseeing Promenade & Soba Lunch',
          ja: '芦ノ湖畔散策＆絶景ランチ',
          zh: '芦之湖畔观光与名物荞麦面午餐',
          fr: 'Promenade au Lac Ashi & Déjeuner Soba',
          es: 'Paseo por el Lago Ashi y Almuerzo Soba',
        },
        description: {
          en: 'Stroll along Moto-Hakone harbor and enjoy artisan soba noodles or lakeside dining.',
          ja: '元箱根港周辺の絶景レストランで美味しいお蕎麦や洋食ランチをお楽しみください。',
          zh: '在元箱根港边远眺海盗船与山景，享用传统手打荞麦面或西式湖畔美馔。',
          fr: 'Dégustez un délicieux déjeuner face au lac et au port pittoresque de Moto-Hakone.',
          es: 'Pasee por el puerto de Moto-Hakone y disfrute de un almuerzo tradicional frente al lago.',
        },
      },
      {
        time: '13:30',
        badge: { en: 'Volcano', ja: '火山', zh: '地热奇观', fr: 'Volcan', es: 'Volcán' },
        title: {
          en: 'Owakudani Volcanic Valley & Black Eggs',
          ja: '大涌谷（火山噴煙と名物黒たまご）',
          zh: '大涌谷（地热喷烟与黑玉子）',
          fr: 'Vallée Volcanique d\'Owakudani & Œufs Noirs',
          es: 'Valle Volcánico de Owakudani y Huevos Negros',
        },
        description: {
          en: 'Witness dramatic sulfur steam vents and taste the famous Kuro-tamago boiled in mineral waters.',
          ja: '大迫力の白煙が立ち込める火山地帯を見学し、寿命が延びると伝わる名物「黒たまご」を賞味。',
          zh: '近距离观察白色硫磺喷烟奇景，品尝延年益寿的天然温泉煮黑鸡蛋。',
          fr: 'Observez les fumerolles volcaniques et goûtez les fameux œufs noirs cuits dans les sources.',
          es: 'Observe las fumarolas volcánicas y pruebe los famosos huevos negros cocidos en aguas termales.',
        },
      },
      {
        time: '15:15',
        badge: { en: 'Art / Onsen', ja: '温泉/芸術', zh: '温泉/美术馆', fr: 'Onsen / Art', es: 'Onsen / Arte' },
        title: {
          en: 'Hakone Open-Air Museum or Private Onsen Spa',
          ja: '彫刻の森美術館 または 日帰り貸切温泉',
          zh: '雕刻之森美术馆 或 顶级日归私汤温泉',
          fr: 'Musée en Plein Air de Hakone ou Onsen Privé',
          es: 'Museo al Aire Libre de Hakone o Baño Onsen Privado',
        },
        description: {
          en: 'Admire world-class outdoor masterworks by Picasso and Moore, or relax in a private mineral hot spring.',
          ja: '自然と現代彫刻が調和する美術館を鑑賞、または名湯箱根のプライベート温泉でリフレッシュ。',
          zh: '可自由选择漫步世界顶尖户外雕塑园，或由司机协助前往私汤温泉享受身心放松。',
          fr: 'Admirez les sculptures en plein air ou détendez-vous dans une source thermale privée.',
          es: 'Admire las esculturas al aire libre o relájese en un baño termal mineral privado.',
        },
      },
      {
        time: '18:30',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Drop-off at Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '安全返抵东京都内目的地',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Smooth evening highway cruise back to your hotel in central Tokyo.',
          ja: '高速道路をスムーズに走行し、ホテルロビーまで安全にお送りいたします。',
          zh: '避开公共交通拥挤，专车直达酒店门口，结束充实尊贵的箱根一日游。',
          fr: 'Retour serein et direct jusqu\'à votre hébergement à Tokyo.',
          es: 'Regreso directo y cómodo hasta su alojamiento en Tokio.',
        },
      },
    ],
  },
  {
    id: 'kamakura-enoshima',
    name: {
      en: 'Kamakura Great Buddha & Enoshima Coast',
      ja: '古都鎌倉 大仏・江の島 海岸プライベートツアー',
      zh: '古都镰仓 大佛・江之岛・湘南海岸 经典巡礼',
      fr: 'Kamakura, Grand Bouddha & Île d\'Enoshima',
      es: 'Kamakura, Gran Buda y Costa de Enoshima',
    },
    region: {
      en: 'Kanagawa Prefecture',
      ja: '神奈川県・鎌倉・湘南',
      zh: '神奈川县・镰仓与湘南',
      fr: 'Préfecture de Kanagawa',
      es: 'Prefectura de Kanagawa',
    },
    charterHours: '9 Hours',
    baseTourRate: 68000,
    image: '/images/dest-kamakura-hero-1920x1080.jpg',
    distanceKm: 62,
    driveTime: '1 hr 10 min',
    expressway: 'Shuto Expressway (首都高) & Yokohama-Yokosuka Road',
    mapQuery: 'Kotoku-in+Kamakura+Kanagawa+Japan',
    highlights: {
      en: ['Kotoku-in Great Bronze Buddha', 'Tsurugaoka Hachimangu Shrine', 'Shonan coastal road', 'Enoshima Sea Candle'],
      ja: ['高徳院 鎌倉大仏', '鶴岡八幡宮・小町通り', '湘南海岸ドライブ', '江の島シーキャンドル'],
      zh: ['高德院镰仓大佛', '鹤冈八幡宫・小町通', '湘南海岸灌篮高手巡礼', '江之岛灯塔风光'],
      fr: ['Grand Bouddha de Kotoku-in', 'Sanctuaire Tsurugaoka', 'Route côtière de Shonan', 'Phare d\'Enoshima'],
      es: ['Gran Buda de Kotoku-in', 'Santuario Tsurugaoka', 'Carretera costera de Shonan', 'Isla y faro de Enoshima'],
    },
    itinerary: [
      {
        time: '09:00',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Tokyo Hotel Pick-Up',
          ja: '都内ホテルへお迎え',
          zh: '东京都内出发',
          fr: 'Prise en charge à votre hôtel à Tokyo',
          es: 'Recogida en su hotel en Tokio',
        },
        description: {
          en: 'Chauffeur departs along the Shuto Expressway toward the historic seaside capital.',
          ja: '都内ホテルを出発し、首都高速経由で古都鎌倉へ向かいます。',
          zh: '专车出发经由高速公路，直抵武士之都镰仓。',
          fr: 'Départ vers l\'ancienne capitale des samouraïs et la côte Pacifique.',
          es: 'Salida hacia la antigua capital samurái y la costa del Pacífico.',
        },
      },
      {
        time: '10:15',
        badge: { en: 'Heritage', ja: '国宝', zh: '国宝古迹', fr: 'Trésor National', es: 'Tesoro Nacional' },
        title: {
          en: 'Kotoku-in Great Bronze Buddha (National Treasure)',
          ja: '高徳院・鎌倉大仏（国宝）',
          zh: '高德院・镰仓大佛（日本国宝）',
          fr: 'Grand Bouddha de Kotoku-in',
          es: 'Gran Buda de Kotoku-in',
        },
        description: {
          en: 'Admire the monumental 13-meter outdoor bronze Buddha statue cast in 1252.',
          ja: '1252年の造立から750年以上の歴史を刻む、国宝・鎌倉大仏の荘厳な姿を拝観。',
          zh: '瞻仰建于1252年、高逾13米露天青铜大佛的庄严雄姿。',
          fr: 'Admirez la majestueuse statue en bronze de 13 mètres érigée en 1252.',
          es: 'Admire la majestuosa estatua de bronce de 13 metros fundida en 1252.',
        },
      },
      {
        time: '11:30',
        badge: { en: 'Culture', ja: '竹寺', zh: '幽静竹林', fr: 'Bambouseraie', es: 'Bambudal' },
        title: {
          en: 'Hokoku-ji Bamboo Grove & Matcha Garden',
          ja: '報国寺（竹の寺・本格抹茶席）',
          zh: '报国寺（竹寺・古庵抹茶体验）',
          fr: 'Forêt de Bambous de Hokoku-ji',
          es: 'Bambudal de Hokoku-ji y Té Matcha',
        },
        description: {
          en: 'Walk among thousands of towering bamboo stalks and enjoy whisked ceremonial matcha tea.',
          ja: '約2,000本の孟宗竹が茂る幽玄な竹林を散策し、庵で一服の抹茶を味わう特別な時間。',
          zh: '漫步于2000多株苍翠孟宗竹林中，在木造茶庵品味地道现刷抹茶。',
          fr: 'Balade féérique parmi les bambous géants et dégustation de thé matcha.',
          es: 'Paseo mágico entre miles de bambúes y degustación de té verde matcha.',
        },
      },
      {
        time: '13:00',
        badge: { en: 'Lunch', ja: '昼食・散策', zh: '古街午餐', fr: 'Déjeuner & Ville', es: 'Almuerzo y Calle' },
        title: {
          en: 'Tsurugaoka Hachimangu & Komachi Street Lunch',
          ja: '鶴岡八幡宮 参拝＆小町通り散策・ランチ',
          zh: '鹤冈八幡宫 参拜与小町通美食街',
          fr: 'Sanctuaire Tsurugaoka & Rue Komachi',
          es: 'Santuario Tsurugaoka y Calle Komachi',
        },
        description: {
          en: 'Visit Kamakura’s spiritual heart and stroll bustling Komachi street with seafood and artisan shops.',
          ja: '鎌倉の象徴である鶴岡八幡宮を参拝後、小町通りで名物しらす丼や和スイーツを堪能。',
          zh: '参拜镰仓总镇守八幡宫，随后在热闹的小町通品尝吻仔鱼盖饭与日式甜点。',
          fr: 'Visite du cœur spirituel de Kamakura et déjeuner sur la rue animée de Komachi.',
          es: 'Visite el corazón espiritual de Kamakura y almuerce en la animada calle Komachi.',
        },
      },
      {
        time: '15:00',
        badge: { en: 'Ocean View', ja: '海岸', zh: '海岸绝景', fr: 'Vue Océan', es: 'Vista al Mar' },
        title: {
          en: 'Enoshima Island & Shonan Coastal Cruise',
          ja: '江ノ島・湘南海岸オーシャンドライブ',
          zh: '江之岛・湘南海岸线巡礼',
          fr: 'Île d\'Enoshima & Côte de Shonan',
          es: 'Isla de Enoshima y Costa de Shonan',
        },
        description: {
          en: 'Drive along the iconic Pacific coast with views of Mount Fuji and Enoshima Sea Candle lighthouse.',
          ja: '江ノ電沿線と湘南海岸の美しい海沿いを走り、江ノ島からの雄大な太平洋を望みます。',
          zh: '沿湘南黄金海岸兜风，打卡江之电镰仓高校前经典海景，远眺江之岛灯塔。',
          fr: 'Croisière routière sur la côte avec vue sur l\'océan et le phare d\'Enoshima.',
          es: 'Paseo en coche por la costa del Pacífico con vistas al faro de Enoshima.',
        },
      },
      {
        time: '18:00',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Return to Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '返抵东京都内酒店',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Comfortable VIP transfer back to your central Tokyo hotel.',
          ja: '夕暮れの湾岸線を抜け、都内ご指定の場所までお送りいたします。',
          zh: '避开傍晚通勤电车，在私家专车中悠然返抵都内酒店。',
          fr: 'Retour détendu dans votre véhicule privé jusqu\'à votre hôtel.',
          es: 'Regreso relajado en su vehículo privado hasta su hotel.',
        },
      },
    ],
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
    region: {
      en: 'Tochigi Prefecture',
      ja: '栃木県・日光国立公園',
      zh: '栃木县・日光国立公园',
      fr: 'Préfecture de Tochigi',
      es: 'Prefectura de Tochigi',
    },
    charterHours: '11 Hours',
    baseTourRate: 88000,
    image: '/images/dest-nikko-hero-1920x1080.jpg',
    distanceKm: 150,
    driveTime: '2 hr 15 min',
    expressway: 'Tohoku Expressway (東北道) & Nikko Tollway',
    mapQuery: 'Nikko+Toshogu+Tochigi+Japan',
    highlights: {
      en: ['Toshogu Shrine ornate gates', 'Kegon Waterfall gorge', 'Lake Chuzenji alpine lake', 'Irohazaka winding mountain pass'],
      ja: ['日光東照宮 陽明門・三猿', '日本三大名瀑 華厳の滝', '中禅寺湖畔の眺望', 'いろは坂パノラマドライブ'],
      zh: ['日光东照宫 阳明门', '日本三大名瀑 华严瀑布', '中禅寺湖高山湖泊', '伊吕波坂蜿蜒山道'],
      fr: ['Sanctuaire Toshogu', 'Cascade de Kegon', 'Lac d\'altitude Chuzenji', 'Col de montagne d\'Irohazaka'],
      es: ['Santuario Toshogu', 'Cascada de Kegon', 'Lago de montaña Chuzenji', 'Paso de montaña Irohazaka'],
    },
    itinerary: [
      {
        time: '08:00',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Early Tokyo Hotel Pick-Up',
          ja: '都内ホテルへ早朝お迎え',
          zh: '东京都内清晨出发',
          fr: 'Départ matinal de votre hôtel',
          es: 'Salida matutina del hotel',
        },
        description: {
          en: 'Chauffeur departs early along the Tohoku Expressway to maximize time in the northern mountain sanctuaries.',
          ja: '東北自動車道を経由し、杉並木に囲まれた北関東屈指の霊峰日光へ向かいます。',
          zh: '专车沿东北高速公路平稳北上，尽情饱览关东平原至日光群山的自然过渡。',
          fr: 'Départ sur l\'autoroute Tohoku vers les sanctuaires nichés dans les forêts de cèdres.',
          es: 'Salida por la autopista Tohoku hacia los santuarios sagrados del norte.',
        },
      },
      {
        time: '10:30',
        badge: { en: 'UNESCO', ja: '世界遺産', zh: '世界遗产', fr: 'UNESCO', es: 'UNESCO' },
        title: {
          en: 'Nikko Toshogu Shrine (UNESCO Gold Landmark)',
          ja: '日光東照宮（世界遺産・国宝 陽明門）',
          zh: '日光东照宫（国宝金碧阳明门・三猿）',
          fr: 'Sanctuaire Nikko Toshogu (Patrimoine UNESCO)',
          es: 'Santuario Nikko Toshogu (Patrimonio UNESCO)',
        },
        description: {
          en: 'Explore the master craftsmanship of the gold-leaf Yomeimon Gate, Three Wise Monkeys, and Sleeping Cat.',
          ja: '金箔と500以上の精密彫刻で覆われた国宝「陽明門」や「見ざる言わざる聞かざる」「眠り猫」をじっくり拝観。',
          zh: '参拜德川家康长眠之所，欣赏金箔璀璨的阳明门雕刻及“不见不言不听”三猿国宝。',
          fr: 'Découvrez la célèbre Porte Yomeimon et les sculptures dorées des trois singes de la sagesse.',
          es: 'Explore la famosa Puerta Yomeimon y las tallas doradas de los tres monos sabios.',
        },
      },
      {
        time: '12:45',
        badge: { en: 'Lunch', ja: '昼食', zh: '传统汤波', fr: 'Déjeuner', es: 'Almuerzo' },
        title: {
          en: 'Traditional Nikko Yuba (Tofu Skin) Kaiseki Lunch',
          ja: '日光名物「湯波（ゆば）料理」ランチ',
          zh: '日光传统御用名物“汤波”料理午餐',
          fr: 'Déjeuner Kaiseki Yuba Traditionnel',
          es: 'Almuerzo Tradicional de Yuba',
        },
        description: {
          en: 'Savor Nikko’s delicate artisan tofu skin delicacy served in traditional multi-course sets.',
          ja: '日光の清らかな伏流水が育んだ伝統の湯波料理や手打ち蕎麦を堪能。',
          zh: '在古风料亭享用以日光名水精制的传统豆皮（汤波）宴席料理。',
          fr: 'Savourez la délicate spécialité de tofu Yuba typique de la région de Nikko.',
          es: 'Disfrute de la exquisita especialidad culinaria de Yuba tradicional de Nikko.',
        },
      },
      {
        time: '14:00',
        badge: { en: 'Waterfall', ja: '名瀑', zh: '百米名瀑', fr: 'Cascade', es: 'Cascada' },
        title: {
          en: 'Irohazaka Pass & Kegon Waterfall (100m Drop)',
          ja: 'いろは坂ドライブ＆華厳の滝（落差97m）',
          zh: '伊吕波坂蜿蜒山道与华严瀑布（落差97米）',
          fr: 'Col d\'Irohazaka & Cascade de Kegon',
          es: 'Paso Irohazaka y Cascada de Kegon',
        },
        description: {
          en: 'Drive up the famous 48-hairpin scenic pass to witness Japan’s most celebrated vertical waterfall plunge.',
          ja: '48のカーブが続く絶景いろは坂を登り、エレベーターで滝壺近くから轟音響く日本三大名瀑を体感。',
          zh: '挑战48道连续弯道的伊吕波急弯山路，搭乘专用电梯直达百米名瀑下方感受轰鸣水雾。',
          fr: 'Traversez le col aux 48 virages et admirez l\'une des 3 plus grandes cascades du Japon.',
          es: 'Suba el puerto de 48 curvas y contemple una de las cascadas más imponentes de Japón.',
        },
      },
      {
        time: '15:15',
        badge: { en: 'Lake View', ja: '湖畔', zh: '高山湖泊', fr: 'Lac', es: 'Lago' },
        title: {
          en: 'Lake Chuzenji Scenic Promenade',
          ja: '中禅寺湖畔散策・男体山の絶景',
          zh: '中禅寺湖高山湖畔与男体山秀色',
          fr: 'Promenade au Bord du Lac Chuzenji',
          es: 'Paseo por el Lago Chuzenji',
        },
        description: {
          en: 'Enjoy alpine lakeside breezes and views of sacred Mount Nantai across the mirror-like waters.',
          ja: '男体山の麓に広がる美しい中禅寺湖の湖畔で、高原の澄んだ空気とカフェタイム。',
          zh: '漫步于海拔1269米的高山湖畔，享受清爽山风与倒映在湖面的神山雄姿。',
          fr: 'Profitez de la brise alpine et du reflet du Mont Nantai sur les eaux du lac.',
          es: 'Disfrute de la brisa alpina y las vistas del Monte Nantai reflejado en el lago.',
        },
      },
      {
        time: '19:00',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Return to Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '返抵东京都内酒店',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Recline in comfort as your chauffeur handles the highway cruise back into Tokyo.',
          ja: '高速道路を快適にクルーズし、都内のホテルへお送りいたします。',
          zh: '在VIP头等舱座椅上舒适小憩，专车平稳送返东京酒店。',
          fr: 'Retour tout confort dans votre véhicule de luxe jusqu\'à votre hôtel.',
          es: 'Regreso relajado y seguro hasta su hotel en el centro de Tokio.',
        },
      },
    ],
  },
  {
    id: 'yokohama-bay',
    name: {
      en: 'Yokohama Minato Mirai & Chinatown Harbor',
      ja: '横浜みなとみらい・元町中華街・三溪園',
      zh: '横滨未来港・中华街・三溪园名胜包车',
      fr: 'Yokohama Minato Mirai, Chinatown & Jardins',
      es: 'Yokohama Minato Mirai, Barrio Chino y Jardines',
    },
    region: {
      en: 'Kanagawa Prefecture',
      ja: '神奈川県・横浜港',
      zh: '神奈川县・横滨港湾',
      fr: 'Préfecture de Kanagawa',
      es: 'Prefectura de Kanagawa',
    },
    charterHours: '8 Hours',
    baseTourRate: 60000,
    image: '/images/dest-yokohama-bay-4662x5828.jpg',
    distanceKm: 38,
    driveTime: '45 min',
    expressway: 'Shuto Wangan Bay Route (首都高湾岸線)',
    mapQuery: 'Yokohama+Chinatown+Minato+Mirai+Japan',
    highlights: {
      en: ['Yokohama Chinatown Dim Sum', 'Sankeien Traditional Garden', 'Red Brick Warehouse Harbor', 'Minato Mirai Skyline Night View'],
      ja: ['日本最大の横浜中華街グルメ', '名勝 三溪園の日本庭園', '赤レンガ倉庫・山下公園', 'みなとみらい夜景ドライブ'],
      zh: ['日本最大的横滨中华街饮茶', '名胜三溪园古典园林', '红砖仓库・山下公园海风', '横滨港未来摩天轮与夜景'],
      fr: ['Chinatown de Yokohama', 'Jardin traditionnel Sankeien', 'Entrepôts de briques rouges', 'Skyline illuminée de Minato Mirai'],
      es: ['Barrio Chino de Yokohama', 'Jardín tradicional Sankeien', 'Almacén de ladrillos rojos', 'Skyline iluminado de Minato Mirai'],
    },
    itinerary: [
      {
        time: '10:00',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Tokyo Hotel Pick-Up',
          ja: '都内ホテルへお迎え',
          zh: '东京都内出发',
          fr: 'Départ de votre hôtel à Tokyo',
          es: 'Salida del hotel en Tokio',
        },
        description: {
          en: 'Smooth morning departure along the Shuto Bay Route highway directly to the port.',
          ja: '首都高速湾岸線を経由し、異国情緒あふれる港町横浜へ向けて出発。',
          zh: '专车经首都高湾岸线直达横滨港湾，沿途饱览东京湾海岸风光。',
          fr: 'Départ en direction du grand port historique de Yokohama.',
          es: 'Salida por la bahía hacia el histórico puerto de Yokohama.',
        },
      },
      {
        time: '10:45',
        badge: { en: 'Garden', ja: '庭園', zh: '名胜庭园', fr: 'Jardin', es: 'Jardín' },
        title: {
          en: 'Sankeien Traditional Japanese Garden',
          ja: '名勝 三溪園（歴史的建築と日本庭園）',
          zh: '名胜 三溪园（古建筑群与回游式庭园）',
          fr: 'Jardin Japonais Traditionnel Sankeien',
          es: 'Jardín Japonés Tradicional Sankeien',
        },
        description: {
          en: 'Stroll across 175,000 sqm of traditional landscapes featuring historic pagodas and lotus ponds.',
          ja: '京都や鎌倉から移築された重要文化財建築が点在する広大な日本庭園を優雅に散策。',
          zh: '漫步于移筑有京都古塔与历史茶室的17.5万平米回游式经典庭园。',
          fr: 'Promenade dans un immense parc traditionnel parsemé de pagodes historiques.',
          es: 'Paseo por un inmenso jardín tradicional con pagodas históricas y estanques.',
        },
      },
      {
        time: '12:30',
        badge: { en: 'Lunch', ja: '昼食', zh: '中华美食', fr: 'Déjeuner', es: 'Almuerzo' },
        title: {
          en: 'Yokohama Chinatown & Gourmet Dim Sum',
          ja: '横浜中華街 散策＆本格飲茶ランチ',
          zh: '横滨中华街 散策与正宗粤式饮茶',
          fr: 'Chinatown de Yokohama & Déjeuner Dim Sum',
          es: 'Barrio Chino de Yokohama y Dim Sum',
        },
        description: {
          en: 'Walk through colorful paifang gates and enjoy famous soup dumplings, dim sum, and bubble tea.',
          ja: '色鮮やかな牌楼が立ち並ぶ日本最大の中華街で、名物の小籠包や本格中国料理ランチを堪能。',
          zh: '穿行于五彩华丽的牌楼街巷，享用正宗小笼包、港式点心与特色甜品。',
          fr: 'Dégustez d\'authentiques raviolis vapeur dans le plus grand quartier chinois du Japon.',
          es: 'Disfrute de los famosos dim sum en el barrio chino más grande de Japón.',
        },
      },
      {
        time: '14:30',
        badge: { en: 'Harbor', ja: '港町', zh: '红砖港口', fr: 'Port', es: 'Puerto' },
        title: {
          en: 'Red Brick Warehouse & Yamashita Harbor Park',
          ja: '横浜赤レンガ倉庫・山下公園',
          zh: '横滨红砖仓库与山下公园海风',
          fr: 'Entrepôts de Briques Rouges & Parc Yamashita',
          es: 'Almacenes de Ladrillo Rojo y Parque Yamashita',
        },
        description: {
          en: 'Browse boutique shops in historic 1911 brick warehouses along the harbor promenade.',
          ja: '明治・大正の面影を残す赤レンガ倉庫でお買い物や港の海風を感じるカフェタイム。',
          zh: '在百余年历史的红砖建筑内淘选特色文创，于海滨长廊远眺客轮进出港。',
          fr: 'Flânez dans les entrepôts historiques rénovés au bord de l\'eau.',
          es: 'Pasee por los históricos almacenes portuarios reconvertidos en galerías.',
        },
      },
      {
        time: '16:30',
        badge: { en: 'Skyline', ja: '夜景', zh: '港湾夜景', fr: 'Skyline', es: 'Skyline' },
        title: {
          en: 'Minato Mirai Skyline & Yokohama Bay Bridge Drive',
          ja: 'みなとみらい21＆横浜ベイブリッジ絶景ドライブ',
          zh: '未来港21与横滨海湾大桥夜景巡礼',
          fr: 'Skyline Minato Mirai & Pont de la Baie',
          es: 'Skyline de Minato Mirai y Puente de la Bahía',
        },
        description: {
          en: 'Enjoy the illuminated city skyline, giant Cosmo Clock Ferris wheel, and bay bridge sunset.',
          ja: '大観覧車や高層ビル群がライトアップされる黄昏時のウォーターフロントを優雅にドライブ。',
          zh: '专车行驶于壮阔的海湾大桥，沉浸于摩天轮与摩天大楼交相辉映的璀璨夜景中。',
          fr: 'Admirez la grande roue illuminée et les gratte-ciels scintillants au crépuscule.',
          es: 'Admire la gran noria iluminada y los rascacielos reflejados en la bahía.',
        },
      },
      {
        time: '18:00',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Return to Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '返抵东京都内酒店',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Quick evening return to your hotel or Tokyo dinner destination.',
          ja: '都内ホテルまたはご指定のディナー会場へお送りいたします。',
          zh: '便捷送返都内酒店或银座/六本木预订餐厅。',
          fr: 'Retour rapide et fluide jusqu\'à votre hôtel à Tokyo.',
          es: 'Regreso rápido y fluido a su hotel en Tokio.',
        },
      },
    ],
  },
  {
    id: 'karuizawa-retreat',
    name: {
      en: 'Karuizawa Alpine Retreat & Outlet Shopping',
      ja: '軽井沢・白糸の滝・雲場池・プリンスショッピング',
      zh: '轻井泽皇家避暑胜地・白丝瀑布与名品奥莱',
      fr: 'Karuizawa Retraite Alpine & Shopping Outlet',
      es: 'Karuizawa Retiro Alpino y Compras Outlet',
    },
    region: {
      en: 'Nagano Prefecture',
      ja: '長野県・軽井沢高原',
      zh: '长野县・轻井泽高原',
      fr: 'Préfecture de Nagano',
      es: 'Prefectura de Nagano',
    },
    charterHours: '10 Hours',
    baseTourRate: 90000,
    image: '/images/dest-karuizawa-resort-1500x1001.jpg',
    distanceKm: 165,
    driveTime: '2 hr 20 min',
    expressway: 'Kan-etsu (関越道) & Joshin-etsu Expressway',
    mapQuery: 'Karuizawa+Prince+Shopping+Plaza+Nagano+Japan',
    highlights: {
      en: ['Shiraito Waterfall Veil', 'Kumoba Pond Mirror Waters', 'Old Karuizawa Historic Street', 'Karuizawa Prince Shopping Plaza'],
      ja: ['清流が織りなす白糸の滝', '白鳥の湖・雲場池', '旧軽井沢銀座通り散策', '軽井沢プリンスショッピングプラザ'],
      zh: ['白丝瀑布清凉水帘', '云场池四季倒影水镜', '旧轻井泽银座欧风街道', '日本最大级王子名品折扣城'],
      fr: ['Cascade de Shiraito', 'Étang miroir de Kumoba', 'Rue historique de Karuizawa Ginza', 'Grand Outlet Prince Plaza'],
      es: ['Cascada de Shiraito', 'Estanque espejo de Kumoba', 'Calle histórica Karuizawa Ginza', 'Gran Outlet Prince Plaza'],
    },
    itinerary: [
      {
        time: '08:00',
        badge: { en: 'Departure', ja: '出発', zh: '出发', fr: 'Départ', es: 'Salida' },
        title: {
          en: 'Tokyo Hotel Pick-Up',
          ja: '都内ホテルへお迎え',
          zh: '东京都内出发',
          fr: 'Départ de votre hôtel à Tokyo',
          es: 'Salida del hotel en Tokio',
        },
        description: {
          en: 'Chauffeur departs along the Kan-etsu Expressway towards the prestigious mountain highlands.',
          ja: '関越自動車道・上信越自動車道を経由して信州・軽井沢高原へ向けて出発。',
          zh: '专车经由关越与上信越高速平稳驶向长野避暑名胜轻井泽。',
          fr: 'Départ vers les hauts plateaux alpins de Karuizawa.',
          es: 'Salida hacia la prestigiosa meseta alpina de Karuizawa.',
        },
      },
      {
        time: '10:30',
        badge: { en: 'Nature', ja: '清流', zh: '清凉瀑布', fr: 'Nature', es: 'Naturaleza' },
        title: {
          en: 'Shiraito Waterfalls (Curtain of White Silk)',
          ja: '白糸の滝（清流が湧き出る天然のカーテン）',
          zh: '白丝瀑布（幅宽70米天然丝绢水帘）',
          fr: 'Cascades de Shiraito (Voile de Soie Blanche)',
          es: 'Cascadas de Shiraito (Velo de Seda Blanca)',
        },
        description: {
          en: 'Walk through fresh pine air to see natural spring waters cascading across a 70-meter wide rock face.',
          ja: 'マイナスイオン溢れる白糸ハイランドウェイを走り、幅70mにわたって湧水が糸のように流れ落ちる名瀑を散策。',
          zh: '漫步于落叶松林荫间，近赏数百道清澈地下涌泉如白丝般从岩壁倾泻而下的清凉景致。',
          fr: 'Admirez les centaines de filets d\'eau pure jaillissant d\'une falaise de 70 mètres.',
          es: 'Contemple cientos de hilos de agua cristalina manando de una pared de roca de 70 metros.',
        },
      },
      {
        time: '12:00',
        badge: { en: 'Lunch', ja: '昼食', zh: '欧风街道', fr: 'Déjeuner', es: 'Almuerzo' },
        title: {
          en: 'Old Karuizawa Ginza & French Bistro Lunch',
          ja: '旧軽井沢銀座通り散策＆ランチ',
          zh: '旧轻井泽银座古街与法式小馆午餐',
          fr: 'Vieux Karuizawa Ginza & Déjeuner Bistro',
          es: 'Antiguo Karuizawa Ginza y Almuerzo Bistro',
        },
        description: {
          en: 'Stroll along the historic summer street favored by celebrities and enjoy wood-fired pizza or French baking.',
          ja: '歴史ある教会や老舗ベーカリー、ジャム店が並ぶ旧軽井沢銀座で優雅なランチ＆散策。',
          zh: '漫步于披头士列侬曾钟爱的欧风复古街区，享用正宗法式窑烤披萨或烘焙咖啡。',
          fr: 'Promenade dans la charmante rue historique aux boutiques artisanales et cafés.',
          es: 'Pasee por la calle histórica con encanto europeo, panaderías y cafeterías.',
        },
      },
      {
        time: '13:45',
        badge: { en: 'Scenic Walk', ja: '名所', zh: '天鹅水镜', fr: 'Promenade', es: 'Paseo' },
        title: {
          en: 'Kumoba Pond (Swan Lake Mirror)',
          ja: '雲場池（白鳥の湖・四季折々の水鏡）',
          zh: '云场池（静谧天鹅湖・四季倒影）',
          fr: 'Étang de Kumoba (Reflets Miroir)',
          es: 'Estanque Kumoba (Reflejo Espejo)',
        },
        description: {
          en: 'Enjoy a tranquil walk around the pond reflecting vibrant alpine foliage or autumn maples.',
          ja: '水面に浅間山や木々が鮮やかに映り込む「スワンレイク」周辺の木漏れ日プロムナードを散策。',
          zh: '沿林间栈道环湖漫步，欣赏四周树影与浅间山倒映在如镜水面的绝美构图。',
          fr: 'Balade apaisante autour de l\'étang reflétant les érables et les forêts environnantes.',
          es: 'Paseo relajante alrededor del estanque que refleja los arces y los bosques.',
        },
      },
      {
        time: '15:00',
        badge: { en: 'Shopping', ja: '買い物', zh: '名品免税', fr: 'Shopping', es: 'Compras' },
        title: {
          en: 'Karuizawa Prince Shopping Plaza Luxury Outlet',
          ja: '軽井沢・プリンスショッピングプラザ',
          zh: '轻井泽・王子名品购物广场（240+国际大牌）',
          fr: 'Karuizawa Prince Shopping Plaza Outlet',
          es: 'Karuizawa Prince Shopping Plaza Outlet',
        },
        description: {
          en: 'Shop luxury international designer brands, outdoor lifestyle gear, and duty-free specialty stores.',
          ja: '広大な芝生広場を囲む日本最大級のリゾート型アウトレットで免税ショッピングを満喫。',
          zh: '在环湖绿色草坪围绕的日本顶尖度假式奥特莱斯尽享免税购物，行李随时存车上。',
          fr: 'Profitez du shopping détaxé dans l\'un des plus grands centres de marques du Japon.',
          es: 'Disfrute de las compras libres de impuestos en uno de los mayores outlets de Japón.',
        },
      },
      {
        time: '19:30',
        badge: { en: 'Arrival', ja: '帰着', zh: '返抵', fr: 'Arrivée', es: 'Llegada' },
        title: {
          en: 'Return to Tokyo Hotel',
          ja: '都内ホテル・空港へご到着',
          zh: '返抵东京都内酒店',
          fr: 'Retour à votre hôtel à Tokyo',
          es: 'Regreso a su hotel en Tokio',
        },
        description: {
          en: 'Relax in executive leather seating as your chauffeur loads all shopping bags and delivers you home.',
          ja: 'お買い物の荷物を載せたまま、ゆったりと都内ホテルまでお送りいたします。',
          zh: '战利品安心存放宽敞后备厢，尊享专车送返都内酒店。',
          fr: 'Retour confortable à Tokyo avec toutes vos emplettes en sécurité dans le coffre.',
          es: 'Regreso cómodo a Tokio con todas sus compras seguras en el maletero.',
        },
      },
    ],
  },
];

const TOUR_VEHICLES = [
  {
    id: 'hiace' as const,
    name: 'HiAce Grand Cabin',
    tier: 'Standard',
    goldBadge: 'STANDARD',
    cap: '1-9 Pax',
    maxPax: 9,
    tag: 'Spacious Group Standard',
    img: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg'
  },
  {
    id: 'alphard' as const,
    name: 'Toyota Alphard Executive',
    tier: 'Premium',
    goldBadge: 'PREMIUM',
    cap: '1-4 Pax',
    maxPax: 4,
    tag: 'VIP Ottoman Captains',
    img: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg'
  },
  {
    id: 'granace' as const,
    name: 'Toyota Granace 4WD VIP',
    tier: 'Ultra Premium Vehicle',
    goldBadge: 'ULTRA PREMIUM',
    cap: '1-5 Pax',
    maxPax: 5,
    tag: 'Flagship 6-Seater Lounge',
    img: '/images/fleet-toyota-granace-exterior-4032x3024.jpg'
  },
];

export default function DayTourBookingModule({
  initialDestination = 'fuji-kawaguchiko',
  initialDate,
  onBackToCatalog,
}: DayTourBookingModuleProps) {
  const [lang] = useLanguage();

  // Normalize initialDestination
  const matchedInitial = useMemo(() => {
    if (!initialDestination) return 'fuji-kawaguchiko';
    if (initialDestination === 'hakone-lake-ashi') return 'hakone-luxury';
    if (initialDestination.includes('fuji')) return 'fuji-kawaguchiko';
    if (initialDestination.includes('hakone')) return 'hakone-luxury';
    if (initialDestination.includes('kamakura')) return 'kamakura-enoshima';
    if (initialDestination.includes('nikko')) return 'nikko-unesco';
    if (initialDestination.includes('yokohama')) return 'yokohama-bay';
    if (initialDestination.includes('karuizawa')) return 'karuizawa-retreat';
    return initialDestination;
  }, [initialDestination]);

  const [selectedDestId, setSelectedDestId] = useState<string>(matchedInitial);
  const [selectedVehicle, setSelectedVehicle] = useState<'alphard' | 'granace' | 'hiace'>('alphard');
  const [passengers, setPassengers] = useState<number>(3);
  const [travelDate, setTravelDate] = useState<string>(() => {
    if (initialDate) return initialDate;
    return getFutureDateJST(3);
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
  const maxCap = selectedVehicle === 'alphard' ? 4 : selectedVehicle === 'granace' ? 5 : 9;
  const isOverCapacity = passengers > maxCap;

  // Dynamic Pricing Calculation
  const vehiclePrice = useMemo(() => {
    const base = currentDest.baseTourRate;
    let fee = base;
    if (selectedVehicle === 'granace') fee = base + 5000;
    if (selectedVehicle === 'hiace') fee = base + 3000;
    return fee;
  }, [currentDest, selectedVehicle]);

  const t = {
    backToCatalog: {
      ja: 'すべてのツアー一覧に戻る',
      zh: '返回全部行程列表',
      fr: 'Retour au catalogue',
      es: 'Volver al catálogo',
      en: 'Back to Explore & Catalog',
    }[lang],
    badgeTop: {
      ja: 'GetYourGuide スタイル・完全プライベート観光チャーター',
      zh: 'GetYourGuide 标准・尊享私家定制观光包车',
      fr: 'Excursion Privée d\'une Journée — Itinéraire Guidé',
      es: 'Tour Privado de un Día — Itinerario Guiado',
      en: 'Curated Private Day Charter — Itinerary & Route',
    }[lang],
    switchTourLabel: {
      ja: '観光地を切り替える',
      zh: '快速切换目的地',
      fr: 'Changer de destination',
      es: 'Cambiar de destino',
      en: 'Explore Other Destinations',
    }[lang],
    itineraryHeading: {
      ja: 'ツアー旅程タイムライン',
      zh: '游览行程时间线',
      fr: 'Itinéraire Détaillé du Tour',
      es: 'Itinerario Detallado del Tour',
      en: 'Detailed Tour Itinerary',
    }[lang],
    itinerarySub: {
      ja: '専属ドライバーによる完全プライベート運行。ご希望に応じて立ち寄り時間や写真撮影のペースを自由に調整いただけます。',
      zh: '专属中文/日英文持证司机全程服务。可根据您的喜好灵活微调拍照与游览节奏。',
      fr: 'Prise en charge personnalisée avec chauffeur privé. Rythme et arrêts 100% modulables selon vos envies.',
      es: 'Servicio exclusivo con chófer privado. Ritmo y paradas 100% flexibles según sus preferencias.',
      en: 'Operated by your dedicated private bilingual chauffeur. Timing and photo stops are 100% flexible to your pace.',
    }[lang],
    stepVehicleTitle: {
      ja: '1. 車両クラスを選択',
      zh: '1. 选择专车车型等级',
      fr: '1. Choisir la Catégorie du Véhicule',
      es: '1. Elegir Categoría de Vehículo',
      en: '1. Select Executive Fleet Class',
    }[lang],
    greenPlateInsured: {
      ja: '緑ナンバー正規保険完備',
      zh: '正规绿牌商业全保',
      fr: 'Assuré Plaque Verte MLIT',
      es: 'Seguro Placa Verde MLIT',
      en: 'Green-Plate Insured',
    }[lang],
    stepDetailsTitle: {
      ja: '2. 乗車日程・お迎えホテル・連絡先',
      zh: '2. 出行日期・出发酒店与联系方式',
      fr: '2. Date, Hôtel & Coordonnées',
      es: '2. Fecha, Hotel y Contacto',
      en: '2. Tour Date, Hotel & Contact Info',
    }[lang],
    dateLabel: {
      ja: 'ご乗車日程',
      zh: '出行日期',
      fr: 'Date du tour',
      es: 'Fecha del tour',
      en: 'Tour Date',
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
    hotelLabel: {
      ja: 'お迎え先ホテル名・都内住所',
      zh: '出发地酒店名称或东京都内地址',
      fr: 'Nom de l\'hôtel ou adresse à Tokyo',
      es: 'Nombre del hotel o dirección en Tokio',
      en: 'Pickup Hotel Name or Tokyo Address',
    }[lang],
    hotelPlaceholder: {
      ja: '例: アマン東京、グランドハイアット東京（六本木）、都内ご自宅など',
      zh: '例如: 东京安缦、六本木君悦酒店或东京都内具体地址',
      fr: 'Ex: Aman Tokyo, Grand Hyatt Tokyo (Roppongi), ou adresse',
      es: 'Ej: Aman Tokyo, Grand Hyatt Tokyo (Roppongi), o dirección',
      en: 'e.g. Aman Tokyo, Grand Hyatt Tokyo (Roppongi), or Tokyo Address',
    }[lang],
    leadNameLabel: {
      ja: '代表者様氏名',
      zh: '代表乘客姓名',
      fr: 'Nom du passager principal',
      es: 'Nombre del pasajero principal',
      en: 'Lead Guest Full Name',
    }[lang],
    emailLabel: {
      ja: '予約確認書送信先メールアドレス',
      zh: '确认单接收邮箱',
      fr: 'Email de confirmation',
      es: 'Correo de confirmación',
      en: 'Confirmation Email',
    }[lang],
    specialRequestsLabel: {
      ja: 'ご要望・立ち寄り希望地（任意）',
      zh: '个性化定制与中途停靠需求 (选填)',
      fr: 'Demandes particulières / Arrêts souhaités (Optionnel)',
      es: 'Peticiones especiales / Paradas deseadas (Opcional)',
      en: 'Custom Requests / Stops (Optional)',
    }[lang],
    specialRequestsPlaceholder: {
      ja: '例: チャイルドシート希望、御殿場アウトレット立ち寄り、特定のレストラン予約など',
      zh: '例如: 需要儿童座椅、中途停靠御殿场奥特莱斯、推荐特色餐厅等',
      fr: 'Ex: Sièges enfant, arrêt shopping Gotemba Outlet, restaurant...',
      es: 'Ej: Sillas de niño, parada de compras en Gotemba Outlet, restaurante...',
      en: 'e.g. Child seat requested, stop by Gotemba Outlets, or scenic restaurant reservation',
    }[lang],
    agreementText: {
      ja: '旅程内容、ご乗車人数、お迎え先ホテル情報を確認し、正規運送事業運行規定およびキャンセル規定に同意します。',
      zh: '我确认行程内容、人数及出发酒店信息无误，并同意正规营运条款与取消政策。',
      fr: 'Je confirme l\'exactitude de l\'itinéraire, des passagers et de l\'hôtel, et j\'accepte les conditions de transport.',
      es: 'Confirmo la exactitud del itinerario, pasajeros y hotel, y acepto las condiciones de transporte.',
      en: 'I confirm my tour destination, guest count, and pickup hotel address are correct, and I agree to the MLIT licensed carrier terms & cancellation policy.',
    }[lang],
    quoteTitle: {
      ja: '観光チャーター定額見積り',
      zh: '一日游包车费用明细',
      fr: 'Récapitulatif du Devis',
      es: 'Resumen del Presupuesto',
      en: 'Charter Quote Summary',
    }[lang],
    allInclusive: {
      ja: '完全定額・高速代込',
      zh: '全包一口价',
      fr: 'Tout Compris Garanti',
      es: 'Todo Incluido Garantizado',
      en: 'All-Inclusive Fixed',
    }[lang],
    mapTitle: {
      ja: 'ルート＆マップ',
      zh: '行程地图与行驶路线',
      fr: 'Carte & Itinéraire Routier',
      es: 'Mapa e Itinerario',
      en: 'Interactive Route Map',
    }[lang],
    destinationLabel: { ja: '目的地:', zh: '目的地:', fr: 'Destination :', es: 'Destino:', en: 'Destination:' }[lang],
    vehicleLabel: { ja: '運行車両:', zh: '服务车型:', fr: 'Véhicule :', es: 'Vehículo:', en: 'Vehicle:' }[lang],
    dateAndGuestsLabel: { ja: '日程・人数:', zh: '日期与人数:', fr: 'Date & Passagers :', es: 'Fecha y Pasajeros:', en: 'Date & Guests:' }[lang],
    distanceLabel: { ja: '走行距離 / 所要時間', zh: '预估单程距离 / 时间', fr: 'Distance / Durée', es: 'Distancia / Tiempo', en: 'Est. Distance & Drive' }[lang],
    expresswayLabel: { ja: '主要高速道路', zh: '主经高速公路', fr: 'Autoroute Principale', es: 'Autopista Principal', en: 'Main Highway Route' }[lang],
    incTolls: {
      ja: '高速道路利用料・燃料代・駐車料金込',
      zh: '已含全程高速路桥费、燃油费及停车费',
      fr: 'Tous les péages d\'autoroute et carburant inclus',
      es: 'Peajes de autopista, combustible y parkings incluidos',
      en: 'All expressway highway tolls & fuel included',
    }[lang],
    incDriver: {
      ja: '経験豊富なプロ専任乗務員がご案内',
      zh: '资深持证专业司机全程贴心服务',
      fr: 'Chauffeur professionnel bilingue dédié',
      es: 'Chófer profesional bilingüe dedicado',
      en: 'Licensed bilingual professional chauffeur',
    }[lang],
    incStops: {
      ja: '自由な写真撮影スポット＆ペース配分',
      zh: '沿途自由停留拍照，自主掌控游览节奏',
      fr: 'Arrêts photo et rythme entièrement flexibles',
      es: 'Paradas fotográficas y ritmo totalmente flexible',
      en: 'Flexible customized stops & photography points',
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
      fr: 'WhatsApp Conciergerie',
      es: 'WhatsApp Conserjería',
      en: 'WhatsApp Concierge',
    }[lang],
  };

  const vehicleName =
    selectedVehicle === 'alphard'
      ? 'Toyota Alphard (1–4 Pax)'
      : selectedVehicle === 'granace'
      ? 'Toyota Granace VIP (1–5 Pax)'
      : 'Toyota HiAce Grand Cabin (1–9 Pax)';

  const bookingDetails: BookingPaymentDetails = {
    bookingType: 'destination',
    destinationId: currentDest.id,
    destinationTitle: `${currentDest.name[lang] || currentDest.name.en} (${currentDest.charterHours})`,
    vehicle: selectedVehicle,
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
    if (isOverCapacity) {
      setValidationError(
        lang === 'ja'
          ? `選択中の車両定員は最大${maxCap}名です（現在${passengers}名）。車両クラスを「Ultra Premium (5名)」または「Standard (9名)」に変更してください。`
          : lang === 'zh'
          ? `当前选择的车型最多可容纳${maxCap}人（当前已选${passengers}人）。请升级为更大车型。`
          : `${selectedVehicle === 'alphard' ? 'Toyota Alphard (Premium)' : 'Toyota Granace (Ultra Premium)'} capacity is max ${maxCap} guests. You have selected ${passengers} guests. Please choose a larger vehicle.`
      );
      return;
    }
    if (!pickupHotel.trim()) {
      setValidationError(
        lang === 'ja'
          ? 'お迎え先ホテル名または東京都内住所をご入力ください。'
          : lang === 'zh'
          ? '请输入出发地酒店名称或东京都内具体地址。'
          : 'Please enter your pickup hotel name or Tokyo address.'
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
    if (travelDate < getTodayJST()) {
      setValidationError(
        lang === 'ja'
          ? '乗車日程に過去の日付を選択することはできません。本日以降の日程をご指定ください。'
          : lang === 'zh'
          ? '出行日期不能为过去的时间，请选择今天或未来的日期。'
          : 'Tour date cannot be in the past. Please select today or a future date.'
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

  const whatsAppCharterUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `✨ *SK LIMO DAY CHARTER INQUIRY*\n\n` +
    `• Destination: ${currentDest.name.en} (${currentDest.charterHours})\n` +
    `• Vehicle: ${vehicleName}\n` +
    `• Date: ${travelDate}\n` +
    `• Guests: ${passengers} Pax\n` +
    `• Hotel: ${pickupHotel || 'Tokyo Hotel'}\n` +
    `• Lead Guest: ${guestName || 'Valued Guest'}\n` +
    (specialRequests ? `• Requests: ${specialRequests}\n` : '') +
    `• Quoted Fare: ¥${vehiclePrice.toLocaleString()} JPY\n\n` +
    `Please confirm vehicle availability.`
  )}`;

  return (
    <div className="w-full bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      
      {/* Top Bar / Back to Catalog & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between flex-wrap gap-2">
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
        <div className="inline-flex items-center gap-1.5 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-[11px] font-semibold px-3.5 py-1 rounded-full ml-auto">
          <Compass className="w-3.5 h-3.5" />
          <span>{t.badgeTop}</span>
        </div>
      </div>

      {/* Destination Switcher Tabs (Horizontal Pills) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] px-2 whitespace-nowrap shrink-0">
              {t.switchTourLabel}:
            </span>
            {TOUR_DESTINATIONS.map((dest) => {
              const isSelected = selectedDestId === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => {
                    setSelectedDestId(dest.id);
                    if (validationError) setValidationError(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#0068FF] text-white shadow-md shadow-[#0068FF]/20 scale-[1.02]'
                      : 'bg-[#F5F7FA] dark:bg-[#131b2c] text-[#4B5563] dark:text-slate-300 hover:bg-[#E5E8ED] dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{dest.name[lang] || dest.name.en}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {dest.charterHours}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Tour Hero, GetYourGuide Itinerary & Booking Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Tour Hero Card */}
            <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-[#E5E8ED] dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
              <div className="relative h-64 sm:h-72 w-full bg-slate-900">
                <Image
                  src={currentDest.image}
                  alt={currentDest.name.en}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#0068FF] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {currentDest.charterHours} Private Charter
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-[#38BDF8] text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    {currentDest.region[lang] || currentDest.region.en}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
                    {currentDest.name[lang] || currentDest.name.en}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-200">
                    <span className="flex items-center gap-1 font-semibold text-[#FFD700]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      4.99 (500+ VIP reviews)
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">All-Inclusive Fixed Tolls & Chauffeur</span>
                  </div>
                </div>
              </div>

              {/* Highlights Chips */}
              <div className="p-4 sm:p-5 border-b border-[#F0F2F5] dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#0B0F19]">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block mb-2">
                  Tour Highlights:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(currentDest.highlights[lang] || currentDest.highlights.en).map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 text-[#1A1A1A] dark:text-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
                    >
                      <Check className="w-3 h-3 text-[#00B37E] shrink-0" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* GetYourGuide Style Detailed Itinerary Timeline */}
              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                  <div className="space-y-0.5">
                    <h2 className="text-base font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0068FF]" />
                      {t.itineraryHeading}
                    </h2>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400">
                      {t.itinerarySub}
                    </p>
                  </div>
                </div>

                {/* Timeline Component */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E8ED] dark:before:bg-slate-800">
                  {currentDest.itinerary.map((stop, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Icon / Number */}
                      <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white dark:bg-[#0E131F] border-2 border-[#0068FF] text-[#0068FF] font-bold text-[10px] flex items-center justify-center shadow-sm group-hover:bg-[#0068FF] group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>

                      {/* Content Card */}
                      <div className="bg-[#F8FAFC] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 rounded-2xl p-4 space-y-1.5 hover:border-[#0068FF]/50 transition-colors shadow-2xs">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-[#0068FF] dark:text-[#38BDF8] bg-[#0068FF]/10 dark:bg-[#0068FF]/20 px-2 py-0.5 rounded-md">
                            {stop.time}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">
                            {stop.badge[lang] || stop.badge.en}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-white pt-0.5">
                          {stop.title[lang] || stop.title.en}
                        </h3>
                        <p className="text-xs text-[#4B5563] dark:text-slate-300 leading-relaxed">
                          {stop.description[lang] || stop.description.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Select Executive Fleet */}
            <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.stepVehicleTitle}
                  </h2>
                </div>
                <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.greenPlateInsured}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TOUR_VEHICLES.map((v) => {
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
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative ${
                        isSelected
                          ? 'border-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/15 ring-2 ring-[#0068FF]/40'
                          : 'border-[#E5E8ED] dark:border-slate-700 bg-white dark:bg-[#131b2c] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <Image src={v.img} alt={v.name} fill className="object-cover" />
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#C5A059]/40 shadow">
                          <span className="text-[#C5A059] font-extrabold text-[9px] tracking-wider uppercase">
                            {v.goldBadge}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`font-bold text-xs block truncate ${isSelected ? 'text-[#0068FF] dark:text-[#3B82F6]' : 'text-[#1A1A1A] dark:text-white'}`}>
                          {v.name}
                        </span>
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
                    You have selected <strong>{passengers} guests</strong>. Please switch to <strong>HiAce Grand Cabin (Standard - up to 9 pax)</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Date, Hotel & Contact Details */}
            <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                    {t.stepDetailsTitle}
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
                            setPassengers(Math.min(9, passengers + 1));
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
                    {t.hotelLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t.hotelPlaceholder}
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

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.specialRequestsLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.specialRequestsPlaceholder}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                  />
                </div>

                {/* Mandatory Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 cursor-pointer select-none">
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

          {/* Right Column: Sticky Route Map Visualizer & Price Quote (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-6 lg:sticky lg:top-24">

              {/* Interactive Route Map & Corridor Visualizer */}
              <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-[#E5E8ED] dark:border-slate-800 p-5 space-y-4 shadow-sm transition-colors">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#0068FF]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
                      {t.mapTitle}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#0068FF] dark:text-[#38BDF8] bg-[#0068FF]/10 px-2 py-0.5 rounded">
                    {currentDest.distanceKm} km · {currentDest.driveTime}
                  </span>
                </div>

                {/* Google Map Box */}
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-[#E5E8ED] dark:border-slate-700 shadow-inner">
                  <GoogleRouteMap
                    origin="Tokyo Central Hotels, Japan"
                    destination={currentDest.mapQuery}
                    destinationName={currentDest.name.en}
                    fallbackQuery={currentDest.mapQuery}
                    className="w-full h-full"
                  />
                </div>

                {/* Route specs */}
                <div className="bg-[#F8FAFC] dark:bg-[#131b2c] rounded-2xl p-3.5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block">
                      {t.expresswayLabel}
                    </span>
                    <span className="font-semibold text-[#1A1A1A] dark:text-slate-200">
                      {currentDest.expressway}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E8ED] dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Door-to-Door Chauffeur:</span>
                    <span className="font-semibold text-[#00B37E]">Tokyo ⇄ {currentDest.region[lang] || currentDest.region.en}</span>
                  </div>
                </div>
              </div>

              {/* Price Quote Summary Card */}
              <div className="bg-white dark:bg-[#0E131F] rounded-3xl border border-[#E5E8ED] dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-sm transition-colors">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-slate-800">
                  <span className="text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider">
                    {t.quoteTitle}
                  </span>
                  <span className="text-[11px] text-[#00B37E] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.allInclusive}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#4B5563] dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.destinationLabel}</span>
                    <span className="font-bold text-[#1A1A1A] dark:text-white text-right">
                      {currentDest.name[lang] || currentDest.name.en}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.vehicleLabel}</span>
                    <span className="font-bold text-[#1A1A1A] dark:text-white">{vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.dateAndGuestsLabel}</span>
                    <span className="font-bold text-[#1A1A1A] dark:text-white">{travelDate} · {passengers} {t.guestsUnit}</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] rounded-2xl p-3.5 space-y-1.5 text-[11px] text-[#4B5563] dark:text-slate-300">
                  <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.incTolls}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.incDriver}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[#00B37E] font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.incStops}</span>
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#6B7280] dark:text-slate-400 font-bold uppercase">{t.totalFareLabel}</span>
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
                      <span>{t.instantStripeBtn}</span>
                    </button>

                    <a
                      href={whatsAppCharterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t.whatsAppBtn}</span>
                    </a>
                  </div>
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
