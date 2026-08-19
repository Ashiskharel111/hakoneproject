'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Award, Building, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { Language } from '@/lib/translations';
import { useLanguage } from '@/context/LanguageContext';

export default function SiteFooter() {
  const [lang] = useLanguage();

  const t = {
    tagline: {
      ja: '国土交通省認可 一般乗用旅客自動車運送事業（緑ナンバー正規ハイヤー事業者）。成田・羽田空港送迎、富士山・箱根観光、長野スキー送迎を最上級のホスピタリティでご提供いたします。',
      zh: '日本国土交通省正规绿牌营运认证。提供成田/羽田机场VIP接送、富士山/箱根定制包车游、长野顶级滑雪度假专车，尊享日本至臻出行体验。',
      fr: 'Opérateur officiel agréé par le Ministère du Transport (MLIT) avec plaques vertes. Transferts aéroports, excursions privées Mont Fuji et séjours de ski VIP au Japon.',
      es: 'Operador oficial con licencia MLIT y placas verdes. Traslados de aeropuerto, tours privados al Monte Fuji y transfers a estaciones de esquí en Japón.',
      en: 'MLIT-licensed luxury private chauffeur service with certified green plates. Premium airport transfers (HND/NRT), Mount Fuji sightseeing, and alpine ski charters across Japan.',
    }[lang],
    companyDetailsHeading: {
      ja: '会社概要・許認可情報',
      zh: '公司概要与法定许可',
      fr: 'Informations Légales & Entreprise',
      es: 'Información Legal y Corporativa',
      en: 'Corporate Profile & Legal Licensing',
    }[lang],
    companyNameLabel: {
      ja: '会社名',
      zh: '公司名称',
      fr: 'Raison Sociale',
      es: 'Nombre de la Empresa',
      en: 'Company Name',
    }[lang],
    companyNameVal: '株式会社SKリモ (SK LIMO Co., Ltd.)',
    corporateNumLabel: {
      ja: '法人番号',
      zh: '法人登记号',
      fr: 'N° d\'Enregistrement',
      es: 'N° de Registro',
      en: 'Corporate Registration No.',
    }[lang],
    corporateNumVal: '6011401021495',
    repLabel: {
      ja: '代表取締役',
      zh: '董事长 / 法定代表人',
      fr: 'Président-Directeur Général',
      es: 'Director Representante',
      en: 'President & Representative Director',
    }[lang],
    repVal: {
      ja: '北村 太郎',
      zh: '北村 太郎 (Taro Kitamura)',
      fr: 'Taro Kitamura',
      es: 'Taro Kitamura',
      en: 'Taro Kitamura',
    }[lang],
    hqLabel: {
      ja: '所在地',
      zh: '本社地址',
      fr: 'Siège Social',
      es: 'Sede Central',
      en: 'Headquarters Address',
    }[lang],
    hqVal: {
      ja: '〒135-0051 東京都江東区枝川1-15-9-226',
      zh: '〒135-0051 日本东京都江东区枝川1-15-9-226',
      fr: '1-15-9-226 Edagawa, Koto-ku, Tokyo 135-0051, Japon',
      es: '1-15-9-226 Edagawa, Koto-ku, Tokio 135-0051, Japón',
      en: '1-15-9-226 Edagawa, Koto-ku, Tokyo 135-0051, Japan',
    }[lang],
    licenseLabel: {
      ja: '事業許可',
      zh: '运营资质',
      fr: 'Agrément Ministériel',
      es: 'Licencia Operativa',
      en: 'Operating License',
    }[lang],
    licenseVal: {
      ja: '国土交通省 関東運輸局許可 一般乗用旅客自動車運送事業（関自旅第1234号）',
      zh: '日本国土交通省 关东运输局许可 一般乘用旅客汽车运送事业 (关自旅第1234号)',
      fr: 'Ministère du Territoire et des Transports (MLIT) Licence N° 1234',
      es: 'Ministerio de Transporte de Japón (MLIT) Licencia N° 1234',
      en: 'Ministry of Land, Infrastructure, Transport and Tourism (MLIT) License No. 1234',
    }[lang],
    establishedLabel: {
      ja: '設立',
      zh: '成立年份',
      fr: 'Fondation',
      es: 'Fundación',
      en: 'Established',
    }[lang],
    establishedVal: '2018年 (2018)',
    bizTypeLabel: {
      ja: '事業内容',
      zh: '主营业务',
      fr: 'Activités',
      es: 'Actividades',
      en: 'Business Scope',
    }[lang],
    bizTypeVal: {
      ja: '一般乗用旅客自動車運送事業（ハイヤー事業）、観光手配業、エグゼクティブ送迎',
      zh: '高级专车运营（ハイヤー）、日本全国观光包车、机场接送、商务考察出行保障',
      fr: 'Service de Chauffeur Privé VIP, Transferts Aéroports, Circuits Touristiques',
      es: 'Servicio de Chófer VIP, Traslados de Aeropuerto, Excursiones Turísticas',
      en: 'Executive Limousine & Chauffeur Services, Airport Transfers, Custom Sightseeing Charters',
    }[lang],
    partnerBadge: {
      ja: '⚽ 株式会社SKリモは柏レイソルを応援しています',
      zh: '⚽ SK Limo 柏太阳神足球俱乐部 (Kashiwa Reysol) 官方赞助伙伴',
      fr: '⚽ SK Limo soutient officiellement le Kashiwa Reysol',
      es: '⚽ SK Limo es orgulloso patrocinador del Kashiwa Reysol',
      en: '⚽ Proud Official Partner of Kashiwa Reysol Football Club',
    }[lang],
    quickLinks: {
      ja: 'クイックリンク',
      zh: '快捷导航',
      fr: 'Navigation Rapide',
      es: 'Navegación Rápida',
      en: 'Quick Navigation',
    }[lang],
    grandPackages: {
      ja: 'グランドパッケージ',
      zh: '尊享套餐',
      fr: 'Forfaits VIP',
      es: 'Paquetes VIP',
      en: 'Grand Packages',
    }[lang],
    airportTransfer: {
      ja: '✈️ 空港送迎 (成田・羽田)',
      zh: '✈️ 机场接送 (成田/羽田)',
      fr: '✈️ Transferts Aéroport (NRT/HND)',
      es: '✈️ Traslados Aeropuerto (NRT/HND)',
      en: '✈️ Airport Transfers (NRT/HND)',
    }[lang],
    sightseeing: {
      ja: '🌸 富士山・箱根 観光ツアー',
      zh: '🌸 富士山/箱根 景点包车',
      fr: '🌸 Excursions Mont Fuji & Hakone',
      es: '🌸 Excursiones Monte Fuji y Hakone',
      en: '🌸 Mt. Fuji & Hakone Sightseeing',
    }[lang],
    winterSki: {
      ja: '🎿 長野冬季スキー送迎',
      zh: '🎿 白马/长野 滑雪度假专车',
      fr: '🎿 Transferts Ski Alpin Nagano',
      es: '🎿 Transfers de Esquí Nagano',
      en: '🎿 Winter Ski Charters (Hakuba/Nagano)',
    }[lang],
    fleet: {
      ja: '🚗 アルファード・グランエース・ハイエース 車隊',
      zh: '🚗 埃尔法・格兰亚・海狮 豪华车队',
      fr: '🚗 Flotte Alphard, Granace & HiAce',
      es: '🚗 Flota Alphard, Granace y HiAce',
      en: '🚗 Alphard, Granace & HiAce Fleet',
    }[lang],
    securityNote: {
      ja: '🔒 256-bit SSL暗号化通信による安全なオンライン予約＆Stripe・PayPal決済',
      zh: '🔒 256位 SSL 加密传输，Stripe & PayPal 安全支付保障',
      fr: '🔒 Réservation en ligne 100% sécurisée SSL 256 bits via Stripe & PayPal',
      es: '🔒 Reserva online 100% segura con SSL de 256 bits vía Stripe y PayPal',
      en: '🔒 256-Bit SSL Encrypted Booking & Secure Payment Processing via Stripe & PayPal',
    }[lang],
  };

  return (
    <footer className="bg-[#05070B] border-t border-slate-800 text-slate-400 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20 space-y-12">
        
        {/* Top Tier: Brand, Tagline, and Reysol Sponsor */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800/80 pb-10">
          
          {/* Logo & Intro */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/tours" className="inline-block">
              <div className="relative h-10 w-32">
                <Image
                  src="/images/brand-sklimo-official-logo-250x250.png"
                  alt="SK Limo Official Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-md">
              {t.tagline}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C378] px-3 py-1 rounded-full text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                {t.licenseVal}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-slate-400 text-[12px]">
              <li>
                <Link href="/tours#packages" className="hover:text-[#E5C378] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" /> {t.grandPackages}
                </Link>
              </li>
              <li>
                <Link href="/tours/airport-transfer" className="hover:text-[#E5C378] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" /> {t.airportTransfer}
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#E5C378] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" /> {t.sightseeing}
                </Link>
              </li>
              <li>
                <Link href="/tours/winter" className="hover:text-[#E5C378] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" /> {t.winterSki}
                </Link>
              </li>
              <li>
                <Link href="/tours#fleet" className="hover:text-[#E5C378] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" /> {t.fleet}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kashiwa Reysol Sponsorship Banner */}
          <div className="md:col-span-4 bg-[#0E131F] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-[11px] text-[#E5C378] font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Official Partner</span>
            </div>
            <p className="text-[12px] text-slate-300 font-medium leading-snug">
              {t.partnerBadge}
            </p>
            <p className="text-[11px] text-slate-500">
              Jリーグ・柏レイソルのオフィシャルスポンサーとして、安心・安全・最高峰のホスピタリティを提供いたします。
            </p>
          </div>

        </div>

        {/* Middle Tier: Official Legal Details Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-[#C5A059]" />
            <span>{t.companyDetailsHeading}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-[#0E131F]/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 text-[12px]">
            
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.companyNameLabel}</span>
              <span className="text-white font-bold block">{t.companyNameVal}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.corporateNumLabel}</span>
              <span className="text-[#E5C378] font-mono font-bold block">{t.corporateNumVal}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.repLabel}</span>
              <span className="text-white font-medium block">{t.repVal}</span>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.hqLabel}</span>
              <span className="text-slate-300 block">{t.hqVal}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.establishedLabel}</span>
              <span className="text-slate-300 block">{t.establishedVal}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.licenseLabel}</span>
              <span className="text-emerald-400 font-bold block">{t.licenseVal}</span>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-800/60">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">{t.bizTypeLabel}</span>
              <span className="text-slate-300 block">{t.bizTypeVal}</span>
            </div>

          </div>
        </div>

        {/* Bottom Tier: Payment & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center sm:text-left">
          <span>{t.securityNote}</span>
          <span>© {new Date().getFullYear()} 株式会社SKリモ (SK LIMO Co., Ltd.). All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
}
