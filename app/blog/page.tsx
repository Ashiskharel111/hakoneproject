'use client';

import React, { useState, useEffect } from 'react';
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
import { subscribeToBlogPosts, BlogPost, DEFAULT_BLOG_POSTS } from '@/lib/blog-store';

export default function BlogPage() {
  const [lang] = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [articles, setArticles] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts((posts) => {
      if (posts && posts.length > 0) {
        setArticles(posts);
      }
    });
    return () => unsubscribe();
  }, []);

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
        en: '100% Free Flexible Wait — We won’t charge a penny for delays',
        ja: 'フライト遅延追加料金¥0・完全無料待機保証',
        zh: '航班延误0加价・100%免费灵活守候',
        fr: 'Attente 100% Flexible & Gratuite — Zéro frais de retard',
        es: 'Espera 100% Flexible y Gratuita — Sin cargos por retraso',
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

  const t = {
    heroBadge: {
      ja: '日本旅行＆専任ハイヤー・エグゼクティブ移動インサイト',
      zh: '日本深度旅行与高端专车出行洞察指南',
      fr: 'INSIGHTS VOYAGE & CHAUFFEUR PRIVÉ AU JAPON',
      es: 'GUÍAS Y CONSEJOS DE TRANSPORTE VIP EN JAPÓN',
      en: 'Japan Travel & Executive Chauffeur Insights',
    }[lang],
    heroTitle: {
      ja: 'SK LIMO 旅のインサイト＆トラベルガイド',
      zh: 'SK LIMO 专属专车出行专栏与日本旅游指南',
      fr: 'Le Journal du Chauffeur Privé & Guides de Voyage',
      es: 'El Diario del Chófer Privado y Guías de Viaje',
      en: 'The Private Chauffeur Journal & Travel Guides',
    }[lang],
    heroDesc: {
      ja: '羽田・成田空港の最新到着情報、富士山・箱根の極上ルート、冬期スキー送迎のロジスティクスを専門家が解説。',
      zh: '由日本本土客运专家深度撰写：机场抵离指引、富士山箱根优选路线、雪季滑雪专线与日本法定客运合规全景。',
      fr: 'Guides d\'itinéraires exclusifs, logistique aéroportuaire, transferts ski alpins et conformité rédigés par des professionnels.',
      es: 'Guías de rutas exclusivas, logística de aeropuertos, traslados de esquí y normativas redactadas por profesionales.',
      en: 'Insider route guides, airport logistics, alpine ski transfers, and regulatory insights written by Japanese ground transport professionals.',
    }[lang],
    editorialAuthor: {
      ja: 'SK LIMO 編集部',
      zh: 'SK LIMO 官方编辑团队',
      fr: 'Équipe Rédactionnelle SK Limo',
      es: 'Equipo Editorial SK Limo',
      en: 'SK Limo Editorial Team',
    }[lang],
    exploreRelatedBtn: {
      ja: '関連する旅程・ご予約詳細を見る',
      zh: '查看相关行程与预订通道',
      fr: 'Explorer les itinéraires & réserver',
      es: 'Explorar itinerarios y reservar',
      en: 'Explore related itineraries & booking',
    }[lang],
    faqBadge: {
      ja: '旅行者のための必須FAQ',
      zh: '出行必备常见问题',
      fr: 'FAQ Essentielle du Voyageur',
      es: 'Preguntas Frecuentes Esenciales',
      en: 'Essential Traveler FAQ',
    }[lang],
    faqTitle: {
      ja: 'よくあるご質問（空港送迎・運行保証・正規認可）',
      zh: '接送机服务、延误保障与正规资质常见问题',
      fr: 'Arrivée, Logistique & Engagements de Service',
      es: 'Llegada, Logística y Garantías del Servicio',
      en: 'Arrival, Logistics & Service Guarantees FAQ',
    }[lang],
    faqSubtitle: {
      ja: '空港でのお迎え方法、フライト遅延時の対応、会社認可情報についてご確認いただけます。',
      zh: '全景透明解答：举牌迎宾流程、延误无忧等候、替代赔付承诺与日本正规绿牌营运资质。',
      fr: 'Détails clairs sur l\'accueil aux arrivées, le suivi des retards et notre licence officielle au Japon.',
      es: 'Información clara sobre la recepción en llegadas, seguimiento de vuelos y nuestras licencias oficiales.',
      en: 'Clear, transparent details on meet & greet, delay tracking, driver guarantees, and our Japanese commercial licensing.',
    }[lang],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
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
                    <span className="text-[#0068FF] font-semibold">{t.editorialAuthor}</span>
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
                  <span>{t.exploreRelatedBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            TRAVELER & AIRPORT ARRIVAL FAQ SECTION
        ═════════════════════════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6D3F] dark:text-[#E5C378] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.faqBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              {t.faqTitle}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              {t.faqSubtitle}
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {blogFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const topicText = (faq.topic as any)[lang] || faq.topic.en;
              const qText = (faq.q as any)[lang] || faq.q.en;
              const aText = (faq.a as any)[lang] || faq.a.en;
              return (
                <div
                  key={`${idx}-${lang}`}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
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
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D3F] dark:text-[#E5C378] transition-opacity duration-300">
                          {topicText}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-white pt-0.5 transition-opacity duration-300">
                        {qText}
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
                      <p className="pt-3 font-medium transition-opacity duration-300">
                        {aText}
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
