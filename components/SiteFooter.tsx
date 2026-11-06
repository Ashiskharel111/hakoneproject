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
    <footer className="bg-white dark:bg-[#05070B] border-t border-slate-200/70 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="relative h-8 w-28">
              <Image src="/images/brand-sklimo-official-logo-250x250.png" alt="SK Limo" fill className="object-contain dark:brightness-110" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.tagline}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <span className="text-[10px] uppercase font-semibold text-slate-900 dark:text-white tracking-[0.2em] block">
              {t.quickLinksTitle}
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-[#C5A059] transition-colors">Services</a></li>
              <li><a href="#fleet" className="hover:text-[#C5A059] transition-colors">The Fleet</a></li>
              <li><a href="#destinations" className="hover:text-[#C5A059] transition-colors">Routes &amp; Fares</a></li>
              <li><a href="#inquire" className="hover:text-[#C5A059] transition-colors">Reservations</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[10px] uppercase font-semibold text-slate-900 dark:text-white tracking-[0.2em] block">
              {t.contactTitle}
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <a href="tel:+818038582729" className="text-slate-900 dark:text-slate-200 font-medium hover:text-[#C5A059] transition-colors">
                  +81 80 3858 2729
                </a>
                <span className="text-slate-400 ml-2">• 24/7 WhatsApp &amp; Dispatch</span>
              </div>
              <div>
                <a href="mailto:tours@sk.limo" className="text-slate-900 dark:text-slate-200 font-medium hover:text-[#C5A059] transition-colors">
                  tours@sk.limo
                </a>
              </div>
              <div className="text-slate-400">
                {t.locationVal}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
          <span>
            {t.companyNameVal} • {t.licenseVal} • Corporate ID {t.corporateNumVal}
          </span>
          <span>© {new Date().getFullYear()} SK LIMO Co., Ltd. {t.allRightsReserved}</span>
        </div>
      </div>
    </footer>
  );
}
