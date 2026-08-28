import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from './firebase';
import { Language } from './translations';

export interface BlogPost {
  id: string;
  title: Record<Language, string>;
  category: string;
  readTime: string;
  date: string;
  image: string;
  summary: Record<Language, string>;
  content?: Record<Language, string> | string;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'haneda-vs-narita-executive-guide',
    title: {
      en: 'Haneda vs. Narita: The Executive Tokyo Airport Arrival Guide (2026)',
      ja: '羽田空港 vs 成田空港：エグゼクティブのための東京到着・専用車送迎完全ガイド',
      zh: '羽田 vs 成田：东京国际机场入境与专车接送指南（2026最新版）',
      fr: 'Haneda vs Narita : Guide de Transfert VIP pour Tokyo',
      es: 'Haneda vs Narita: Guía Ejecutiva de Traslados en Tokio',
    },
    category: 'Airport Logistics',
    readTime: '5 min read',
    date: 'Aug 2026',
    image: '/images/dest-haneda-hero-1920x1080.jpg',
    summary: {
      en: 'Everything you need to know about navigating customs, VIP curbside meeting points, flight tracking, and expressway drive times to Ginza, Roppongi, and Shinjuku.',
      ja: '通関手続き、VIPミートポイント、税関出口からのスムーズな導線、銀座・六本木・新宿までの所要時間を徹底比較。',
      zh: '全面解析出关流程、VIP专属举牌迎宾点、实时航班追踪以及前往银座、六本木与新宿的行车路线。',
      fr: 'Tout savoir sur le passage en douane, les points de rencontre VIP et les temps de trajet vers les grands quartiers de Tokyo.',
      es: 'Todo sobre aduanas, puntos de encuentro VIP y tiempos de trayecto hacia los principales distritos de Tokio.',
    },
    order: 1,
    published: true,
  },
  {
    id: 'tokyo-to-mt-fuji-private-chauffeur-itinerary',
    title: {
      en: 'Tokyo to Mount Fuji by Private Chauffeur: The Perfect 10-Hour Itinerary',
      ja: '東京発 富士山・河口湖プライベートチャーター：最高の10時間モデルコース',
      zh: '东京出发 富士山・河口湖私享包车：完美10小时一日游路线指南',
      fr: 'De Tokyo au Mont Fuji en Chauffeur Privé : L\'Itinéraire Idéal de 10 Heures',
      es: 'De Tokio al Monte Fuji con Chófer Privado: El Itinerario Perfecto de 10 Horas',
    },
    category: 'Sightseeing Curated',
    readTime: '7 min read',
    date: 'Aug 2026',
    image: '/images/dest-fuji-hero-1920x1080.jpg',
    summary: {
      en: 'Escape the crowded tour buses. Discover the iconic Arakurayama Pagoda, crystal springs of Oshino Hakkai, scenic lakeside dining, and 5th Station vistas in seamless luxury.',
      ja: '混雑する観光バスを避け、新倉山浅間公園、忍野八海、河口湖北岸カフェ、富士山五合目を専用ハイヤーで優雅に巡る旅程。',
      zh: '告别拥挤的大巴团。专属私家车带您领略新仓山浅间公园、忍野八海、湖畔餐厅与富士山五合目的绝美风光。',
      fr: 'Évitez les bus touristiques et profitez d\'une journée sur mesure entre la pagode d\'Arakurayama et les rives du lac Kawaguchi.',
      es: 'Evite los autobuses turísticos y disfrute de una jornada a medida entre la pagoda de Arakurayama y el lago Kawaguchi.',
    },
    order: 2,
    published: true,
  },
  {
    id: 'powder-snow-direct-4wd-ski-transfers',
    title: {
      en: 'Powder Snow Direct: Why 4WD Door-to-Chalet Transfers Beat the Shinkansen to Hakuba & Nozawa',
      ja: '新雪パウダースノー直行：新幹線より4WD専用車送迎が選ばれる理由（白馬・野沢温泉）',
      zh: '长野粉雪直达：为何4WD专车直达比新幹線转乘更受滑雪客青睐（白马・野泽）',
      fr: 'Transferts Ski Direct 4x4 : Pourquoi Choisir le VTC Plutôt que le Train pour Hakuba',
      es: 'Esquí 4x4 Directo: Por qué el Transporte Privado Supera al Tren hacia Hakuba y Nozawa',
    },
    category: 'Winter Alpine',
    readTime: '6 min read',
    date: 'Aug 2026',
    image: '/images/ski-hakuba-hero-4032x3024.jpg',
    summary: {
      en: 'Traveling with heavy ski bags, snowboards, and family gear? Learn how direct 4WD transfers with Bridgestone Blizzak studless tires eliminate station stairs, bus transfers, and luggage forwarding stress.',
      ja: 'かさばるスキーバッグやスノーボード板をお持ちの旅行に。駅の階段や路線バス乗り換えをゼロにする、4WDドアツードア送迎の圧倒的な利便性。',
      zh: '携带沉重的雪具包与家庭行李出行？全时四驱配雪地胎直达木屋门口，免去转乘新干线搬运行李的繁琐。',
      fr: 'Voyager avec du matériel de ski volumineux ? Découvrez le confort d\'un trajet direct de l\'aéroport jusqu\'à votre chalet alpin.',
      es: '¿Viaja con equipaje pesado de esquí? Descubra la comodidad del transporte directo puerta a puerta a su chalet en la nieve.',
    },
    order: 3,
    published: true,
  },
  {
    id: 'understanding-green-plate-transport-license-japan',
    title: {
      en: 'Why Commercial "Green-Plate" Licensing Matters for Travelers & DMCs in Japan',
      ja: 'なぜ正規「緑ナンバー」が必要なのか：訪日旅行者と旅行代理店が知るべき運行安全と法的認可',
      zh: '为什么日本正规营运“绿牌车”至关重要：乘车安全、高额保险与法定资质解析',
      fr: 'Pourquoi la Licence Commerciale "Plaque Verte" est Indispensable au Japon',
      es: 'Por qué la Licencia Comercial de "Matrícula Verde" es Fundamental en Japón',
    },
    category: 'Industry & Safety',
    readTime: '4 min read',
    date: 'Jul 2026',
    image: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
    summary: {
      en: 'An in-depth breakdown of Japanese transport regulations: the critical difference between legal commercial operators (Midori-Number) and illegal white-plate services (Shirotaku), passenger insurance coverage, and compliance standards.',
      ja: '違法な白タクと国土交通省正規認可ハイヤーの違い、旅客搭乗者保険の補償範囲、ドライバーの運行前点呼・アルコール検査基準を解説。',
      zh: '深度解析日本国土交通省绿牌正规营运与非法白牌黑车的根本区别、商业乘客保险责任与车辆每日安全点检标准。',
      fr: 'Comprendre les normes de transport au Japon : conformité légale, assurances passagers et sécurité absolue.',
      es: 'Conozca las normativas del transporte en Japón: cumplimiento legal, seguros para pasajeros y máxima seguridad.',
    },
    order: 4,
    published: true,
  },
];

let hasAttemptedSeed = false;

export async function seedBlogPostsIfEmpty(): Promise<void> {
  if (!db || hasAttemptedSeed) return;
  hasAttemptedSeed = true;

  try {
    const snap = await getDocs(collection(db, 'blogs'));
    if (snap.empty) {
      for (const post of DEFAULT_BLOG_POSTS) {
        const docRef = doc(db, 'blogs', post.id);
        await setDoc(docRef, {
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Firestore blog seeding notice (fallback active):', err);
  }
}

export function subscribeToBlogPosts(callback: (posts: BlogPost[]) => void): () => void {
  // Emit initial local seed immediately
  callback(DEFAULT_BLOG_POSTS);

  if (!db) {
    return () => {};
  }

  try {
    seedBlogPostsIfEmpty();

    const q = query(collection(db, 'blogs'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPosts: BlogPost[] = snapshot.docs
            .map((docSnap) => {
              const data = docSnap.data() as BlogPost;
              return {
                ...data,
                id: docSnap.id,
              };
            })
            .filter((p) => p.published !== false);

          if (cloudPosts.length > 0) {
            cloudPosts.sort((a, b) => (a.order || 99) - (b.order || 99));
            callback(cloudPosts);
          }
        }
      },
      (err) => {
        console.warn('Firestore blogs snapshot fallback:', err);
      }
    );

    return () => unsubscribe();
  } catch (e) {
    console.warn('Firestore blogs subscription fallback:', e);
    return () => {};
  }
}

export async function saveBlogPost(post: BlogPost): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, 'blogs', post.id);
    await setDoc(
      docRef,
      {
        ...post,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Error saving blog post:', err);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, 'blogs', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return false;
  }
}
