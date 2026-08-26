'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const [lang] = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'airport',
    date: '',
    guests: '2',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const whatsAppDirectUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    `Hello SK Limo Concierge! I have a private chauffeur booking inquiry for Japan.`
  )}`;

  const t = {
    heroBadge: {
      ja: '24時間 運行管理・配車デスク',
      zh: '24/7 全天候中枢调度与预订中心',
      fr: 'DESK OPÉRATIONNEL & DISPATCH 24/7',
      es: 'CENTRO OPERATIVO Y DISPATCH 24/7',
      en: '24/7 Operations & Dispatch Desk',
    }[lang],
    heroTitle: {
      ja: 'お問い合わせ・コンシェルジュデスク',
      zh: '联系专属礼宾客服与24小时调度中心',
      fr: 'Contactez la Conciergerie & le Desk 24/7',
      es: 'Contacto con Conserjería y Dispatch 24/7',
      en: 'Contact Concierge & 24/7 Dispatch Desk',
    }[lang],
    heroDesc: {
      ja: '成田・羽田空港送迎、貸切観光チャーター、スキー送迎、法人手配のご相談。専任スタッフが迅速にご案内いたします。',
      zh: '无论成田/羽田机场接送、多日深度定制游还是商务外事车队，中英日三语调度团队全天候竭诚服务。',
      fr: 'Pour vos transferts aéroports, circuits sur mesure ou déplacements professionnels, notre équipe bilingue est à votre écoute 24h/24.',
      es: 'Ya sea para traslados al aeropuerto, itinerarios a medida o eventos corporativos, nuestro equipo multilingüe le atiende las 24 horas.',
      en: 'Whether booking airport VIP transfers, bespoke multi-day itineraries, or corporate roadshows, our bilingual dispatch team is available around the clock.',
    }[lang],
    directChannelsTag: { ja: 'ダイレクト連絡先', zh: '即时联络通道', fr: 'Canaux Directs', es: 'Canales Directos', en: 'Direct Channels' }[lang],
    directChannelsHead: { ja: 'お急ぎの方はこちら', zh: '极速沟通与咨询', fr: 'Contactez-nous Directement', es: 'Póngase en Contacto', en: 'Get in Touch Instantly' }[lang],
    hotlineSub: { ja: '24時間 配車・運行管理ホットライン', zh: '24/7 司机调度与紧急联络热线', fr: 'Ligne directe chauffeur & dispatch 24/7', es: 'Línea directa chófer y dispatch 24/7', en: '24/7 Direct Chauffeur Hotline & Dispatch' }[lang],
    emailSub: { ja: '公式予約・請求書・法人お問い合わせ', zh: '官方预订咨询与企业发票支持', fr: 'Support réservations & facturation officielle', es: 'Soporte oficial de reservas y facturación', en: 'Official Booking & Invoice Support' }[lang],
    hqLocation: { ja: '東京本社 (国土交通省 認可事業所)', zh: '东京总部 (日本国土交通省 官方认证)', fr: 'Siège à Tokyo · Agréé MLIT', es: 'Sede en Tokio · Licencia MLIT', en: 'Tokyo Headquarters · MLIT Licensed' }[lang],
    whatsAppBtn: {
      ja: 'WhatsApp でチャット（即時対応）',
      zh: '通过 WhatsApp 咨询 (最快响应)',
      fr: 'Discuter sur WhatsApp (Réponse Rapide)',
      es: 'Chatear por WhatsApp (Respuesta Rápida)',
      en: 'Chat on WhatsApp (Instant Response)',
    }[lang],
    b2bTag: { ja: '旅行会社様・海外DMC様', zh: '面向旅行社与全球DMC', fr: 'Pour Agences de Voyages & DMC', es: 'Para Agencias y DMC', en: 'For Travel Agencies & DMCs' }[lang],
    b2bDesc: {
      ja: '海外旅行会社様の専任地上手配パートナー。確約ネットレート、適格請求書発行、専用WhatsAppホットライン。',
      zh: '海外旅行社的一级地接合作伙伴。保障净价合约、正规明细发票及专属WhatsApp团队协作群。',
      fr: 'Partenaire réceptif direct pour agences internationales. Tarifs nets garantis et facturation détaillée.',
      es: 'Socio receptivo directo para agencias de viajes internacionales. Tarifas netas y facturación detallada.',
      en: 'Direct ground operator partner for international travel agencies. Guaranteed net rates, itemized invoicing, and dedicated WhatsApp operation channels.',
    }[lang],
    slaResponse: { ja: '平均返答時間: 15分以内', zh: '平均响应时间: 15分钟以内', fr: 'Délai moyen de réponse : moins de 15 minutes', es: 'Tiempo medio de respuesta: menos de 15 min', en: 'Average Response Time: Under 15 Minutes' }[lang],
    formTag: { ja: 'お問い合わせフォーム', zh: '提交咨询意向', fr: 'Envoyer une Demande', es: 'Enviar Solicitud', en: 'Send An Inquiry' }[lang],
    formHead: { ja: 'オーダーメイド見積り・ご予約依頼', zh: '定制行程与定额报价申请', fr: 'Devis Sur Mesure & Réservation', es: 'Presupuesto Personalizado y Reserva', en: 'Custom Charter & Rate Request' }[lang],
    successTitle: { ja: 'お問い合わせを受信しました', zh: '咨询已成功送达', fr: 'Demande Reçue avec Succès', es: 'Solicitud Recibida con Éxito', en: 'Inquiry Received Successfully' }[lang],
    successDesc: (email: string) => ({
      ja: `ありがとうございます。専任コンシェルジュが旅程を確認し、15分以内に ${email} 宛てに正式なお見積りをご案内いたします。`,
      zh: `感谢您的咨询！我们的专属客服将在15分钟内查阅您的行程并向您的邮箱 ${email} 发送正式报价。`,
      fr: `Merci ! Notre conciergerie étudie vos détails et répondra à ${email} dans les 15 minutes avec un devis officiel.`,
      es: `¡Gracias! Nuestra conserjería revisará su solicitud y responderá a ${email} en menos de 15 minutos con un presupuesto formal.`,
      en: `Thank you! Our bilingual concierge desk will review your itinerary details and reply to ${email} within 15 minutes with a formal quote.`,
    }[lang]),
    sendAnotherBtn: { ja: '別の内容でお問い合わせする', zh: '发送另一条咨询', fr: 'Envoyer une autre demande', es: 'Enviar otra solicitud', en: 'Send another inquiry' }[lang],
    fullNameLabel: { ja: 'お名前（フルネーム）', zh: '贵宾全名', fr: 'Nom Complet', es: 'Nombre Completo', en: 'Full Name' }[lang],
    emailLabel: { ja: 'メールアドレス', zh: '电子邮箱', fr: 'Adresse Email', es: 'Correo Electrónico', en: 'Email Address' }[lang],
    serviceTypeLabel: { ja: 'ご希望サービス', zh: '服务类型', fr: 'Type de Service', es: 'Tipo de Servicio', en: 'Service Type' }[lang],
    optAirport: { ja: '空港送迎（成田・羽田）', zh: '机场接送（成田/羽田）', fr: 'Transfert Aéroport (Haneda / Narita)', es: 'Traslado de Aeropuerto (Haneda / Narita)', en: 'Airport Transfer (Haneda / Narita)' }[lang],
    optSightseeing: { ja: '日帰り観光チャーター（富士山・箱根・日光）', zh: '私享包车一日游（富士山/箱根/日光）', fr: 'Excursion d\'une Journée (Fuji, Hakone, Nikko)', es: 'Tour Privado de un Día (Fuji, Hakone, Nikko)', en: 'Private Day Charter (Fuji, Hakone, Nikko)' }[lang],
    optSki: { ja: '4WD スキー場送迎（白馬・野沢温泉・湯沢）', zh: '4WD 滑雪专车（白马/野泽温泉/汤泽）', fr: 'Transfert Ski 4x4 (Hakuba, Nozawa, Yuzawa)', es: 'Traslado de Esquí 4x4 (Hakuba, Nozawa, Yuzawa)', en: '4WD Ski Transfer (Hakuba, Nozawa, Yuzawa)' }[lang],
    optCorporate: { ja: '法人VIP輸送 / B2B視察', zh: '商务考察 / 外事车队接待', fr: 'Corporate VIP / Délégations B2B', es: 'Servicios Corporativos VIP / Delegaciones', en: 'Corporate VIP Roadshow / B2B' }[lang],
    optCustom: { ja: '複数日オーダーメイド周遊', zh: '多日定制深度周游行程', fr: 'Itinéraire Multi-Jours Sur Mesure', es: 'Itinerario Personalizado de Varios Días', en: 'Custom Multi-Day Itinerary' }[lang],
    dateAndGuestsLabel: { ja: 'ご利用日程＆ご乗車人数', zh: '预计出行日期与人数', fr: 'Date Estimée & Passagers', es: 'Fecha Estimada y Pasajeros', en: 'Estimated Date & Guests' }[lang],
    detailsLabel: { ja: '旅程詳細・ご要望・希望車種', zh: '行程详情与特殊需求', fr: 'Détails de l\'Itinéraire & Besoins Particuliers', es: 'Detalles del Itinerario y Requisitos', en: 'Itinerary Details & Special Requirements' }[lang],
    detailsPlaceholder: {
      ja: '乗車場所、目的地、フライト便名、お荷物の個数、ご希望の車両クラス（ハイエース、アルファード、グランエース）などをご記入ください...',
      zh: '请填写上车地点、目的地、航班号、行李件数或车型偏好（海狮标准、埃尔法尊享、格兰斯顶级头等舱）...',
      fr: 'Précisez le lieu de prise en charge, la destination, les numéros de vol, bagages ou choix du véhicule...',
      es: 'Indique lugar de recogida, destino, vuelos, equipaje o preferencia de vehículo...',
      en: 'Please share pickup location, destination, flight numbers, luggage requirements, or specific vehicle preferences (HiAce Standard, Alphard Premium, Granace Ultra Premium)...',
    }[lang],
    submitBtn: { ja: 'お問い合わせを送信', zh: '提交咨询申请', fr: 'Envoyer la Demande', es: 'Enviar Solicitud', en: 'Submit Inquiry' }[lang],
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Contact Info & Direct WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0068FF]">{t.directChannelsTag}</span>
                <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">{t.directChannelsHead}</h3>
              </div>

              <div className="space-y-4 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <Phone className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">+81 80 1234 5678</span>
                    <span className="text-[11px] text-[#9CA3AF]">{t.hotlineSub}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <Mail className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">contact@sklimojapan.com</span>
                    <span className="text-[11px] text-[#9CA3AF]">{t.emailSub}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <MapPin className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">Tokyo Headquarters</span>
                    <span className="text-[11px] text-[#9CA3AF]">{t.hqLocation}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick CTA */}
              <div className="pt-2">
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.whatsAppBtn}</span>
                </a>
              </div>
            </div>

            {/* B2B Agency & SLA Card */}
            <div className="bg-[#080B11] border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t.b2bTag}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.b2bDesc}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.slaResponse}</span>
              </div>
            </div>

          </div>

          {/* Right Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0068FF]">{t.formTag}</span>
              <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">{t.formHead}</h3>
            </div>

            {isSubmitted ? (
              <div className="bg-[#E8F1FF] dark:bg-[#0068FF]/15 border border-[#0068FF]/30 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#0068FF] mx-auto" />
                <h4 className="text-lg font-bold text-[#1A1A1A] dark:text-white">{t.successTitle}</h4>
                <p className="text-xs text-[#4B5563] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {t.successDesc(formData.email || 'your email')}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#0068FF] hover:underline"
                >
                  {t.sendAnotherBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {t.fullNameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {t.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {t.serviceTypeLabel}
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF] cursor-pointer"
                    >
                      <option value="airport">{t.optAirport}</option>
                      <option value="sightseeing">{t.optSightseeing}</option>
                      <option value="ski">{t.optSki}</option>
                      <option value="corporate">{t.optCorporate}</option>
                      <option value="custom">{t.optCustom}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      {t.dateAndGuestsLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-2 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                      />
                      <input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Pax"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                    {t.detailsLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={t.detailsPlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0068FF] hover:bg-[#0050CC] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.submitBtn}</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
