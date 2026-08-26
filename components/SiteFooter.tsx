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
            <span className="text-[11px] uppercase font-semibold text-[#1A1A1A] dark:text-white tracking-wider block">Quick Links</span>
            <ul className="space-y-1.5 text-xs text-[#6B7280] dark:text-slate-400">
              <li><Link href="/explore" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Explore Japan</Link></li>
              <li><Link href="/booking" className="hover:text-[#C5A059] dark:hover:text-[#E5C378] font-bold transition-colors">Start Booking (Portal)</Link></li>
              <li><Link href="/services" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Services Overview</Link></li>
              <li><Link href="/tours/airport-transfer" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Airport Transfers</Link></li>
              <li><Link href="/tours/winter" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Ski Transfers</Link></li>
              <li><Link href="/blog" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Travel Journal &amp; Guides</Link></li>
              <li><Link href="/contact" className="hover:text-[#0068FF] dark:hover:text-[#3B82F6] transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] uppercase font-semibold text-[#1A1A1A] dark:text-white tracking-wider block">Contact</span>
            <div className="space-y-1.5 text-xs text-[#6B7280] dark:text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#9CA3AF]" /><span>+81 80 1234 5678 (24/7)</span></p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#9CA3AF]" /><span>contact@sklimojapan.com</span></p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" /><span>Koto-ku, Tokyo, Japan</span></p>
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
              Stripe Secure:
            </span>
            <span className="bg-[#1A1A1A] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded"> Pay</span>
            <span className="bg-[#1A1A1A] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">G Pay</span>
            <span className="bg-[#1A1F71] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">VISA</span>
            <span className="bg-[#EB001B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MC</span>
            <span className="bg-[#006FCF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">AMEX</span>
            <span className="bg-[#005BAC] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">JCB</span>
          </div>
          <span>© {new Date().getFullYear()} SK LIMO Co., Ltd. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
