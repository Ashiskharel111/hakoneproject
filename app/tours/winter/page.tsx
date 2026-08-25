'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  MapPin,
  Car,
  Users,
  Luggage,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  Compass,
  Check,
  ChevronRight
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SkiTransferBookingModule from '@/components/SkiTransferBookingModule';
import { useLanguage } from '@/context/LanguageContext';

export default function WinterSkiToursPage() {
  const [lang] = useLanguage();
  const [showBookingWizard, setShowBookingWizard] = useState(false);

  const whatsAppSkiUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring about 4WD winter ski transfers from Tokyo / Haneda / Narita to Hakuba, Nozawa, and Shiga Kogen.'
  )}`;

  const skiResorts = [
    {
      id: 'hakuba',
      name: 'Hakuba Valley (Nagano)',
      region: 'Northern Alps, Nagano',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Host of the 1998 Winter Olympics, featuring 10 interconnected resorts, world-class terrain parks, and legendary alpine bowls.',
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      price: '¥110,000〜',
    },
    {
      id: 'nozawa',
      name: 'Nozawa Onsen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Historic hot spring ski village combining deep powder tree runs with 13 traditional public onsen thermal baths.',
      image: '/images/ski-nozawa-hero-4032x3024.jpg',
      price: '¥115,000〜',
    },
    {
      id: 'shigakogen',
      name: 'Shiga Kogen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Japan’s highest ski resort and largest linked ski area with ultra-dry microclimate powder snow.',
      image: '/images/ski-shiga-hero-4032x3024.jpg',
      price: '¥118,000〜',
    },
    {
      id: 'yuzawa',
      name: 'Yuzawa & Naeba (Niigata)',
      region: 'Niigata Prefecture',
      hours: '2.5–3.0 Hours from Tokyo',
      desc: 'Snow Country with convenient fast access from Tokyo, famous for vast resort facilities and hot springs.',
      image: '/images/ski-yuzawa-hero-4032x3024.jpg',
      price: '¥85,000〜',
    },
    {
      id: 'myoko',
      name: 'Myoko Kogen (Niigata)',
      region: 'Niigata Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Averaging over 13 meters of annual snowfall, famous for legendary tree runs, backcountry, and deep powder.',
      image: '/images/ski-myoko-hero-4032x3024.jpg',
      price: '¥125,000〜',
    },
    {
      id: 'karuizawa',
      name: 'Karuizawa Prince (Nagano)',
      region: 'Nagano Prefecture',
      hours: '2.0–2.5 Hours from Tokyo',
      desc: 'Only 2 hours from Tokyo with great weather and massive shopping outlet plaza attached right at the ski base.',
      image: '/images/ski-karuizawa-hero-4032x3024.jpg',
      price: '¥75,000〜',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="winter" />

      {/* ══════════════════════════════════════════════════
          1. EDITORIAL HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-xs font-bold px-3.5 py-1.5 rounded-full">
                <Snowflake className="w-4 h-4 shrink-0" />
                <span>4WD Mountain Fleet · Bridgestone Blizzak Studless Tires</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
                  Japan 4WD Ski Direct Chauffeur
                </h1>
                <p className="text-sm sm:text-base text-[#4B5563] dark:text-slate-300 max-w-xl leading-relaxed">
                  Direct door-to-door private transfers between Tokyo airports/hotels and Japan’s premier ski resorts. No train transfers or dragging heavy ski bags.
                </p>
              </div>

              {/* Inclusions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <Car className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">Dedicated 4WD Fleet</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Electronic traction control</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">Door-to-Chalet</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Direct front-door delivery</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">All Tolls Included</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Highway &amp; fuel flat rate</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingWizard(!showBookingWizard)}
                  className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{showBookingWizard ? 'Hide Booking Form' : 'Book Ski Transfer Online'}</span>
                </button>

                <a
                  href={whatsAppSkiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#131b2c] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#1A1A1A] dark:text-white border border-[#E5E8ED] dark:border-slate-700 px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Concierge 24/7</span>
                </a>
              </div>
            </div>

            {/* Visual Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-[#E5E8ED] dark:border-slate-800">
                <Image
                  src="/images/ski-hakuba-hero-4032x3024.jpg"
                  alt="Hakuba Valley 4WD Ski Direct Transfer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                  <span className="text-xs font-bold text-[#0068FF] bg-white px-2 py-0.5 rounded w-fit uppercase">
                    Winter Luxury Standard
                  </span>
                  <h2 className="font-extrabold text-base">Hakuba, Nozawa, Shiga Kogen &amp; Myoko</h2>
                  <p className="text-xs text-slate-300">
                    High-power 4WD executive vans equipped with heated captain seats and ski rack capacity.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TOGGLEABLE INTERACTIVE BOOKING WIZARD
          ══════════════════════════════════════════════════ */}
      {showBookingWizard && (
        <section id="booking-wizard" className="py-8 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors animate-fade-in">
          <SkiTransferBookingModule onBackToCatalog={() => setShowBookingWizard(false)} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS: DOOR-TO-CHALET PROTOCOL
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            Effortless Mountain Travel
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            How Your Ski Transfer Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
            From your Tokyo flight arrival or hotel directly to the slopes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Private Curbside Pickup
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Your chauffeur meets you at Haneda, Narita, or your Tokyo hotel lobby. Your heavy luggage, ski bags, and snowboards are securely loaded into the vehicle.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Expressway Mountain Transit
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Enjoy a continuous, quiet highway journey with comfortable scenic rest area stops along the Joshin-etsu and Chuo expressways for coffee, dining, and snacks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Direct Chalet Door-to-Door Arrival
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Arrive directly at your alpine lodge, hotel, or private chalet entrance without waiting for resort shuttle connections or walking through snowdrifts.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. SKI RESORT DIRECTORY & DESTINATIONS
          ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-white dark:bg-[#0E131F] border-y border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
              Popular Winter Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              Curated Japan Ski Resorts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skiResorts.map((resort) => (
              <div
                key={resort.id}
                className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={resort.image}
                      alt={resort.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {resort.hours}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-semibold uppercase text-[#0068FF] tracking-wider block">
                      {resort.region}
                    </span>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">{resort.name}</h3>
                    <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
                      {resort.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#E5E8ED] dark:border-slate-700/80 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">From</span>
                    <span className="text-base font-extrabold text-[#1A1A1A] dark:text-white font-mono">{resort.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingWizard(true);
                      setTimeout(() => {
                        document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. FLEET SPECIFICATIONS & SKI GEAR CAPACITY
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            4WD Commercial Fleet
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            Ski Gear &amp; Passenger Capacity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Alphard */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Alphard 4WD</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              Ideal for couples or small families seeking maximum heated captain chair comfort on mountain roads.
            </p>
            <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 space-y-2 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Seating:</span>
                <span>1–4 Passengers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ski Bags:</span>
                <span>Up to 4 Ski/Board Bags</span>
              </div>
            </div>
          </div>

          {/* Granace */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Granace 4WD VIP</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              Heavy-duty full-size luxury MPV with 4 independent leather captain chairs and high ground clearance.
            </p>
            <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 space-y-2 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Seating:</span>
                <span>1–5 Passengers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ski Bags:</span>
                <span>Up to 5 Ski/Board Bags</span>
              </div>
            </div>
          </div>

          {/* HiAce */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">HiAce Grand Cabin 4WD</h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              Massive cabin capacity engineered to transport large groups, families, and high volumes of ski equipment.
            </p>
            <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 space-y-2 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Seating:</span>
                <span>1–9 Passengers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ski Bags:</span>
                <span>Up to 9 Ski/Board Bags + Luggage</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. BOTTOM CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="py-12 bg-white dark:bg-[#0E131F] border-t border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] dark:text-white">
            Plan Your Winter Ski Transfer
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-xl mx-auto">
            Reserve your 4WD mountain vehicle or discuss custom multi-resort itineraries with our concierge.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/tours"
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Open Main Booking Portal</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
