'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Plane,
  Building2,
  Users2
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
  const [lang] = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const blogFaqs = [
    {
      topic: {
        en: 'Meet at a specific point with a sign in your name',
        ja: 'お名前入りサインボードを持参し、指定場所でお出迎え',
        zh: '专属举牌接机，到达指定地点等候',
        fr: 'Point de rencontre précis avec pancarte à votre nom',
        es: 'Punto de encuentro específico con cartel a su nombre',
      },
      q: {
        en: 'How will my driver find me at the airport?',
        ja: '空港でドライバーとどのように合流できますか？',
        zh: '在机场司机将如何与我汇合？',
        fr: 'Comment mon chauffeur va-t-il me trouver à l\'aéroport ?',
        es: '¿Cómo me encontrará mi chófer en el aeropuerto?',
      },
      a: {
        en: 'Your driver waits at the arrival exit holding a sign with your name. If you can’t find them, you can message the agent on WhatsApp; we respond within a minute.',
        ja: '担当ドライバーが税関出口（到着ロビー）にてお客様のお名前を記載したサインボードを掲げてお待ちしております。万一見当たらない場合も、専任エージェントのWhatsAppにご連絡いただければ1分以内に迅速に対応・ご案内いたします。',
        zh: '您的专属司机将在到达出口手持标有您姓名的专属迎接牌守候。如果您未能立即找到司机，可随时在WhatsApp上联系我们的在线客服，我们将在1分钟内即时回复协助。',
        fr: 'Votre chauffeur vous attend à la sortie des arrivées avec une pancarte à votre nom. Si vous ne le trouvez pas, contactez notre agent sur WhatsApp : réponse en moins d\'une minute.',
        es: 'Su chófer le esperará en la salida de llegadas con un cartel con su nombre. Si no lo localiza, puede escribir al agente por WhatsApp; respondemos en menos de un minuto.',
      },
      icon: <Users2 className="w-5 h-5 text-[#C5A059]" />
    },
    {
      topic: {
        en: 'Flight tracked, 90-min free wait, any delay covered',
        ja: '便名追跡・90分無料待機・いかなるフライト遅延にも完全対応',
        zh: '实时航班追踪、90分钟免费等候、全时段延误全包',
        fr: 'Vol suivi en direct, 90 min d\'attente gratuite, tout retard couvert',
        es: 'Vuelo rastreado, 90 min de espera gratis, cualquier retraso cubierto',
      },
      q: {
        en: 'What happens if my flight is delayed or cancelled?',
        ja: 'フライトが遅延または欠航・変更になった場合はどうなりますか？',
        zh: '如果我的航班延误或被取消怎么办？',
        fr: 'Que se passe-t-il si mon vol est retardé ou annulé ?',
        es: '¿Qué ocurre si mi vuelo se retrasa o se cancela?',
      },
      a: {
        en: 'Your flight is automatically tracked from the Flight number and the date you’ve given us. Any delay length is covered, be it 30 minutes, or a few hours or over night - Your driver is auto updated. In case where your flight is cancelled or rescheduled to a different day due to mechanical failure or the weather, contact your agent we’ll issue a full refund.',
        ja: 'ご入力いただいた便名と搭乗日に基づき、システムがフライトを自動でリアルタイム追跡します。30分の遅延でも、数時間の遅延や夜間へのズレ込みでも、追加料金なしでドライバーの配車時刻が自動調整されます。機材トラブルや悪天候によりフライトが欠航または別日に変更となった場合は、エージェントにご連絡いただければ全額返金いたします。',
        zh: '根据您提供的航班号与日期，系统会自动实时跟踪航班动态。无论是延误30分钟、数小时还是跨夜，司机会自动根据实际落地时间调整等候，无需额外付费。若因机械故障或恶劣天气导致航班取消或改签至其他日期，只需联系客服即可获得全额退款。',
        fr: 'Votre vol est suivi automatiquement grâce au numéro et à la date fournis. Tout retard (30 minutes, plusieurs heures ou nuit) est couvert : votre chauffeur est mis à jour en direct. Si votre vol est annulé ou reporté à un autre jour pour cause météo ou panne, contactez-nous pour un remboursement intégral.',
        es: 'Su vuelo se rastrea automáticamente con el número y la fecha indicados. Cualquier retraso (30 minutos, varias horas o noche) está cubierto: el chófer se actualiza en tiempo real. Si su vuelo se cancela o se reprograma por mal tiempo o avería, contacte a su agente para un reembolso completo.',
      },
      icon: <Plane className="w-5 h-5 text-[#C5A059]" />
    },
    {
      topic: {
        en: 'Driver doesn’t show?',
        ja: '万一ドライバーが来ない場合（ノーショー補償保証）',
        zh: '司机未按时到达怎么办？（极速退赔保障）',
        fr: 'Et si le chauffeur ne se présente pas ?',
        es: '¿Y si el chófer no se presenta?',
      },
      q: {
        en: 'Driver doesn’t show?',
        ja: '万一ドライバーが時間通りに現れなかった場合はどうなりますか？',
        zh: '如果司机没有按时到达接送地点怎么办？',
        fr: 'Que se passe-t-il si le chauffeur ne vient pas ?',
        es: '¿Qué pasa si el chófer no se presenta?',
      },
      a: {
        en: 'We’ll refund your fare in full plus the fare for the transportation you used.',
        ja: 'SK LIMOの運賃を全額返金するだけでなく、お客様が代替としてご利用された交通機関（タクシー等）の実費も全額補償いたします。',
        zh: '我们将为您全额退还预订车费，并全额赔付您临时改用的替代交通工具（如现场出租车等）的全部实际费用。',
        fr: 'Nous vous remboursons l\'intégralité de votre trajet ainsi que les frais de transport de remplacement que vous aurez utilisés.',
        es: 'Le reembolsaremos el importe total del trayecto más el coste del transporte alternativo que haya utilizado.',
      },
      icon: <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
    },
    {
      topic: {
        en: 'English-speaking agent and professional driver',
        ja: '英語対応コンシェルジュエージェントと熟練プロドライバーの分業連携',
        zh: '专属英语调度管家与专业日本职业司机',
        fr: 'Agent anglophone dédié et chauffeur professionnel',
        es: 'Agente de habla inglesa y chófer profesional',
      },
      q: {
        en: 'How does English support and chauffeur service work?',
        ja: '英語サポートとドライバーの運行はどのように連携していますか？',
        zh: '英语客服管家与司机的服务是如何协同配合的？',
        fr: 'Comment s\'organise la coordination entre l\'agent anglophone et le chauffeur ?',
        es: '¿Cómo funciona la coordinación entre el agente en inglés y el chófer?',
      },
      a: {
        en: 'An English speaking agent will welcome you at the airport and will handle all the booking and logistics and coordinate everything with your driver. Your professional driver focuses on what they do best: safe driving on Japanese roads, flawless navigation, knowing local routes.',
        ja: '英語対応エージェントが空港にてお迎えを行い、予約管理・運行ロジスティクス・旅程調整のすべてをドライバーと綿密に連携します。プロドライバーは本来の強みである日本国内の安全運転、的確なルート選定、抜け道や交通状況を熟知したスムーズな移動に100%集中いたします。',
        zh: '专属英语管家将在机场迎接您，全面负责预订对接、行李协调以及与司机的全程沟通。专业日本司机则专注于他们最擅长的领域：日本道路的安全驾驶、精准导航以及熟悉最优本地行车路线。',
        fr: 'Un agent anglophone vous accueille à l\'aéroport et gère toute la logistique avec votre chauffeur. Votre chauffeur professionnel se concentre sur sa mission première : sécurité sur les routes japonaises, navigation optimale et connaissance parfaite du trafic local.',
        es: 'Un agente de habla inglesa le recibirá en el aeropuerto y coordinará la logística con su conductor. Su chófer profesional se concentra en lo que mejor sabe hacer: conducción segura en carreteras japonesas, navegación impecable y dominio de las mejores rutas.',
      },
      icon: <MessageSquare className="w-5 h-5 text-[#C5A059]" />
    },
    {
      topic: {
        en: 'A registered Japanese company you can verify',
        ja: '公式に登記・認可された日本法人（国土交通省正規営業認可）',
        zh: '正规日本政府注册法人实体与法定营运绿牌资质',
        fr: 'Une société japonaise officiellement enregistrée',
        es: 'Una empresa japonesa registrada y verificable',
      },
      q: {
        en: 'Is SK Limo a registered company in Japan?',
        ja: 'SK Limoは日本で正式に法人登記・許認可された企業ですか？',
        zh: 'SK Limo是否为日本正规注册备案的合法客运公司？',
        fr: 'SK Limo est-elle une entreprise enregistrée au Japon ?',
        es: '¿Es SK Limo una empresa registrada en Japón?',
      },
      a: {
        en: 'Yes. SK Limo is operated by 株式会社SKリモ (SK Limo Co., Ltd.), a registered limousine and transport company. Our head office is located in Edagawa, Koto-ku, Tokyo, Japan. 100% of our fleet operates under official Ministry of Land, Infrastructure, Transport and Tourism (MLIT) commercial Green Plates (緑ナンバー) with comprehensive commercial passenger liability insurance.',
        ja: 'はい。SK Limoは日本国内で登記されたハイヤー・旅客自動車運送事業法人「株式会社SKリモ（SK Limo Co., Ltd.）」によって運営されています。本社所在地：東京都江東区枝川。全保有車両が国土交通省関東運輸局認可の正規「緑ナンバー（営業ナンバー）」であり、搭乗者無制限補償の商業旅客保険を完備しております。',
        zh: '是的。SK Limo由在日本正式登记注册的客运法人“株式会社SKリモ (SK Limo Co., Ltd.)”合规运营。总部位于日本东京都江东区枝川。全线车队100%持有日本国土交通省正规商业客运营运绿牌（緑ナンバー），并依法投保全额乘客商业人身及意外责任险。',
        fr: 'Oui. SK Limo est exploitée par 株式会社SKリモ (SK Limo Co., Ltd.), société enregistrée à Edagawa, Koto-ku, Tokyo. 100% de notre flotte dispose de la licence commerciale officielle "Plaque Verte" du ministère des Transports (MLIT) avec assurance passagers complète.',
        es: 'Sí. SK Limo es operada por 株式会社SKリモ (SK Limo Co., Ltd.), empresa de transporte registrada con sede en Edagawa, Koto-ku, Tokio. Toda nuestra flota opera con matrícula comercial verde autorizada por el MLIT y seguro integral para pasajeros.',
      },
      icon: <Building2 className="w-5 h-5 text-[#C5A059]" />
    },
  ];

  const articles = [
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
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Japan Travel &amp; Executive Chauffeur Insights</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            {lang === 'ja'
              ? 'SK LIMO 旅のインサイト＆トラベルガイド'
              : 'The Private Chauffeur Journal & Travel Guides'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ja'
              ? '羽田・成田空港の最新到着情報、富士山・箱根の極上ルート、冬期スキー送迎のロジスティクスを専門家が解説。'
              : 'Insider route guides, airport logistics, alpine ski transfers, and regulatory insights written by Japanese ground transport professionals.'}
          </p>
        </div>
      </section>

      {/* Blog Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={art.image}
                    alt={art.title.en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {art.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#38BDF8]" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span className="text-[#0068FF] font-semibold">SK Limo Editorial Team</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#0068FF] transition-colors leading-snug">
                    {art.title[lang] || art.title.en}
                  </h3>

                  <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed">
                    {art.summary[lang] || art.summary.en}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0068FF] dark:text-[#3B82F6] hover:underline"
                >
                  <span>Explore related itineraries &amp; booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TRAVELER & AIRPORT ARRIVAL FAQ SECTION (User Specification)
        ═════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6D3F] dark:text-[#E5C378] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Essential Traveler FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              {lang === 'ja'
                ? 'よくあるご質問（空港送迎・運行保証・正規認可）'
                : 'Arrival, Logistics &amp; Service Guarantees FAQ'}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              {lang === 'ja'
                ? '空港でのお迎え方法、フライト遅延時の対応、会社認可情報についてご確認いただけます。'
                : 'Clear, transparent details on meet &amp; greet, delay tracking, driver guarantees, and our Japanese commercial licensing.'}
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {blogFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isOpen
                      ? 'border-[#C5A059]/60 bg-[#FAF8F4] dark:bg-[#131926] shadow-sm'
                      : 'border-[#E8E2D8] dark:border-slate-800 bg-white dark:bg-[#0A0E17]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {faq.icon}
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378]">
                          {(faq.topic as any)[lang] || faq.topic.en}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-white pt-0.5">
                        {(faq.q as any)[lang] || faq.q.en}
                      </h4>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#9CA3AF] shrink-0 mt-1" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed border-t border-[#E8E2D8]/70 dark:border-slate-800/80 mt-1">
                      <p className="pt-3 font-medium">
                        {(faq.a as any)[lang] || faq.a.en}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
