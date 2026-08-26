'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Award, Lock } from 'lucide-react';
import { Language } from '@/lib/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function SiteFooter() {
  const [lang] = useLanguage();

  const t = {
    tagline: {
      ja: '国土交通省認可 緑ナンバー正規ハイヤー事業者。成田・羽田空港送迎、富士山・箱根観光、長野スキー送迎。',
      zh: '日本国土交通省正规绿牌营运。成田/羽田机场VIP接送、富士山包车、滑雪专车。',
      fr: 'Opérateur agréé MLIT. Transferts aéroports, excursions privées et ski VIP au Japon.',
      es: 'Operador licenciado MLIT. Traslados aeropuerto, tours privados y esquí VIP en Japón.',
      en: 'MLIT-licensed luxury private chauffeur. Airport transfers, sightseeing & ski charters across Japan.',
    }[lang],
    companyDetailsHeading: {
      ja: '会社概要・許認可情報', zh: '公司概要与法定许可', fr: 'Informations Légales', es: 'Información Legal', en: 'Legal & Licensing',
    }[lang],
    companyNameLabel: { ja: '会社名', zh: '公司名称', fr: 'Société', es: 'Razón Social', en: 'Company' }[lang],
    companyNameVal: 'SK LIMO Co., Ltd. (株式会社SKリモ)',
    corporateNumLabel: { ja: '法人番号', zh: '法人番号', fr: 'N° Enregistrement', es: 'N° Corporativo', en: 'Corporate ID' }[lang],
    corporateNumVal: '1010601058291',
    repLabel: { ja: '代表者', zh: '法定代表', fr: 'Dirigeant', es: 'Representante', en: 'CEO' }[lang],
    repVal: { ja: '代表取締役社長 北村 太郎', zh: '代表取缔役社长 北村 太郎', fr: 'Taro Kitamura', es: 'Taro Kitamura', en: 'Taro Kitamura' }[lang],
    licenseLabel: { ja: '事業認可', zh: '运营资质', fr: 'Agrément', es: 'Licencia', en: 'License' }[lang],
    licenseVal: {
      ja: '国土交通省 関東運輸局許可 関自旅第1234号',
      zh: '日本国土交通省 关自旅第1234号',
      fr: 'MLIT Licence N° 1234',
      es: 'MLIT Licencia N° 1234',
      en: 'MLIT License No. 1234',
    }[lang],
    partnerBadge: {
      ja: '柏レイソル オフィシャルパートナー',
      zh: '柏太阳神足球俱乐部官方赞助伙伴',
      fr: 'Partenaire Officiel Kashiwa Reysol FC',
      es: 'Socio Oficial Kashiwa Reysol FC',
      en: 'Official Partner — Kashiwa Reysol FC',
    }[lang],
    quickLinksTitle: {
      ja: 'クイックリンク',
      zh: '快捷导航',
      fr: 'Liens Rapides',
      es: 'Enlaces Rápidos',
      en: 'Quick Links',
    }[lang],
    linkExplore: {
      ja: '日本を探索 (ホーム)',
      zh: '探索日本 (主页)',
      fr: 'Explorer le Japon',
      es: 'Explorar Japón',
      en: 'Explore Japan',
    }[lang],
    linkBooking: {
      ja: 'オンライン予約ポータル',
      zh: '在线快速预订入口',
      fr: 'Portail de Réservation',
      es: 'Portal de Reservas',
      en: 'Start Booking (Portal)',
    }[lang],
    linkServices: {
      ja: 'サービス一覧・特徴',
      zh: '服务项目总览',
      fr: 'Aperçu des Services',
      es: 'Nuestros Servicios',
      en: 'Services Overview',
    }[lang],
    linkAirports: {
      ja: '空港定額送迎 (羽田/成田)',
      zh: '机场专车接送 (羽田/成田)',
      fr: 'Transferts Aéroports (Haneda/Narita)',
      es: 'Traslados Aeropuertos (Haneda/Narita)',
      en: 'Airport Transfers',
    }[lang],
    linkSki: {
      ja: '冬期4WDスキー送迎 (白馬/野沢)',
      zh: '4WD雪季滑雪专车 (白马/野泽)',
      fr: 'Transferts Ski 4x4 (Hakuba/Nozawa)',
      es: 'Traslados Esquí 4x4 (Hakuba/Nozawa)',
      en: 'Ski Transfers',
    }[lang],
    linkBlog: {
      ja: '旅のコラム＆旅行ガイド',
      zh: '日本旅游专栏与攻略',
      fr: 'Journal & Guides de Voyage',
      es: 'Diario y Guías de Viaje',
      en: 'Travel Journal & Guides',
    }[lang],
    linkContact: {
      ja: 'お問い合わせ・コンシェルジュ',
      zh: '联系在线管家',
      fr: 'Contacter la Conciergerie',
      es: 'Contacto y Conserjería',
      en: 'Contact Concierge',
    }[lang],
    contactTitle: {
      ja: 'お問い合わせ',
      zh: '联系我们',
      fr: 'Contact',
      es: 'Contacto',
      en: 'Contact',
    }[lang],
    hotlineDesc: {
      ja: '24時間年中無休 配車デスク',
      zh: '24/7 全天候中英日专车调度台',
      fr: 'Assistance & Chauffeurs 24/7',
      es: 'Línea Directa de Chóferes 24/7',
      en: '24/7 Chauffeur Dispatch Hotline',
    }[lang],
    emailDesc: {
      ja: '公式予約・請求書窓口',
      zh: '官方预订与发票支持',
      fr: 'Réservations & Facturation',
      es: 'Reservas y Facturación',
      en: 'Official Booking & Invoice Support',
    }[lang],
    locationVal: {
      ja: '東京都江東区枝川（本社）',
      zh: '日本东京都江东区枝川（总部）',
      fr: 'Edagawa, Koto-ku, Tokyo, Japon',
      es: 'Edagawa, Koto-ku, Tokio, Japón',
      en: 'Koto-ku, Tokyo, Japan',
    }[lang],
    stripeSecure: {
      ja: 'Stripe 暗号化決済:',
      zh: 'Stripe 安全加密支付:',
      fr: 'Paiement Sécurisé Stripe :',
      es: 'Pago Seguro Stripe:',
      en: 'Stripe Secure:',
    }[lang],
    allRightsReserved: {
      ja: '無断転載を禁じます。',
      zh: '保留所有权利。',
      fr: 'Tous droits réservés.',
      es: 'Todos los derechos reservados.',
      en: 'All rights reserved.',
    }[lang],
  };

  return (
    <footer className="bg-white dark:bg-[#05070B] border-t border-[#E5E8ED] dark:border-slate-800 text-[#6B7280] dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">

        {/* Top: Logo & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-3">
            <div className="relative h-8 w-28">
              <Image src="/images/brand-sklimo-official-logo-250x250.png" alt="SK Limo" fill className="object-contain dark:brightness-110" />
            </div>
            <p className="text-xs text-[#9CA3AF] dark:text-slate-400 leading-relaxed max-w-md">{t.tagline}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059] font-medium">
              <Award className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
              <span>{t.partnerBadge}</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] uppercase font-semibold text-[#1A1A1A] dark:text-white tracking-wider block">{t.quickLinksTitle}</span>
            <ul className="space-y-1.5 text-xs text-[#6B7280] dark:text-slate-400">
              <li><Link href="/explore" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkExplore}</Link></li>
              <li><Link href="/booking" className="hover:text-[#C5A059] dark:hover:text-[#E5C378] font-bold transition-colors">{t.linkBooking}</Link></li>
              <li><Link href="/services" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkServices}</Link></li>
              <li><Link href="/tours/airport-transfer" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkAirports}</Link></li>
              <li><Link href="/tours/winter" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkSki}</Link></li>
              <li><Link href="/blog" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkBlog}</Link></li>
              <li><Link href="/contact" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">{t.linkContact}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] uppercase font-semibold text-[#1A1A1A] dark:text-white tracking-wider block">{t.contactTitle}</span>
            <div className="space-y-2 text-xs text-[#6B7280] dark:text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#1A1A1A] dark:text-slate-200 font-semibold block">+81 80 1234 5678</span>
                  <span className="text-[10px] text-[#9CA3AF]">{t.hotlineDesc}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#1A1A1A] dark:text-slate-200 font-semibold block">contact@sklimojapan.com</span>
                  <span className="text-[10px] text-[#9CA3AF]">{t.emailDesc}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#1A1A1A] dark:text-slate-200 font-semibold block">{t.locationVal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MLIT Box */}
        <div className="bg-[#F5F7FA] dark:bg-[#0A0D14] border border-[#E5E8ED] dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] dark:text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B37E]" />
            <span>{t.companyDetailsHeading}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-[#9CA3AF] text-[10px] uppercase font-medium block">{t.companyNameLabel}</span>
              <span className="text-[#1A1A1A] dark:text-slate-200 font-medium">{t.companyNameVal}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] text-[10px] uppercase font-medium block">{t.corporateNumLabel}</span>
              <span className="text-[#1A1A1A] dark:text-[#E5C378] font-mono font-medium">{t.corporateNumVal}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] text-[10px] uppercase font-medium block">{t.repLabel}</span>
              <span className="text-[#1A1A1A] dark:text-slate-200 font-medium">{t.repVal}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] text-[10px] uppercase font-medium block">{t.licenseLabel}</span>
              <span className="text-[#00B37E] font-semibold">{t.licenseVal}</span>
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0F2F5] dark:border-slate-800 text-[11px] text-[#9CA3AF] dark:text-slate-500">
          <div className="flex items-center flex-wrap justify-center sm:justify-start gap-1.5">
            <span className="text-[#6B7280] dark:text-slate-400 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {t.stripeSecure}
            </span>

            {/* Apple Pay */}
            <span className="bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.75-11.64-14.13-5.77-9.03-10.25-19.46-13.44-31.28-3.19-11.83-4.78-22.95-4.78-33.37 0-14.24 3.48-26.04 10.44-35.4 6.96-9.35 15.88-14.17 26.76-14.46 4.8 0 10.21 1.25 16.24 3.75 6.02 2.51 10.15 3.82 12.38 3.94 1.8.12 6.07-1.25 12.8-4.11 6.74-2.86 12.5-4.13 17.29-3.82 12.82.72 23.01 5.37 30.58 13.97-11.3 6.86-16.83 16.31-16.59 28.34.25 9.4 3.84 17.3 10.77 23.71 6.94 6.41 15.34 10.08 25.21 11.01-2.17 6.64-4.76 13.06-7.77 19.26zM119.22 31.84c0-7.39 2.65-14.4 7.95-21.03 5.3-6.63 11.96-10.8 19.98-12.51.13 1.13.2 2.14.2 3.03 0 7.39-2.82 14.52-8.46 21.39-5.63 6.87-12.43 11.02-20.4 12.46-.27-1.12-.4-2.23-.4-3.34z"/>
              </svg>
              Pay
            </span>

            {/* Google Pay */}
            <span className="bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1">
              <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Pay
            </span>

            <span className="bg-[#1A1F71] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">VISA</span>
            <span className="bg-[#EB001B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MC</span>
            <span className="bg-[#006FCF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">AMEX</span>
            <span className="bg-[#005BAC] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">JCB</span>
          </div>
          <span>© {new Date().getFullYear()} SK LIMO Co., Ltd. {t.allRightsReserved}</span>
        </div>
      </div>
    </footer>
  );
}
