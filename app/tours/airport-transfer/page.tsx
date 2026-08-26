'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  ShieldCheck,
  Clock,
  MapPin,
  Luggage,
  Users,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Check,
  Compass
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AirportTransferModule from '@/components/AirportTransferModule';
import { useLanguage } from '@/context/LanguageContext';

export default function AirportTransferDedicatedPage() {
  const [lang] = useLanguage();
  const [showBookingWizard, setShowBookingWizard] = useState(false);

  const whatsAppGeneralUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring about executive airport transfers for Tokyo Haneda (HND) / Narita (NRT).'
  )}`;

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="airport" />

      {/* ══════════════════════════════════════════════════
          1. EDITORIAL HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Text & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E8F1FF] dark:bg-[#0068FF]/15 text-[#0068FF] dark:text-[#3B82F6] text-xs font-bold px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>MLIT-Certified</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-F4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
                  Tokyo Airport Executive Chauffeur
                </h1>
                <p className="text-sm sm:text-base text-[#4B5563] dark:text-slate-300 max-w-xl leading-relaxed">
                  Seamless private transfers between Haneda (HND), Narita (NRT), and Central Tokyo hotels. All-inclusive fixed pricing, flight tracking, and personalized meet &amp; greet in the arrival hall.
                </p>
              </div>

              {/* Inclusions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">60-Min Flight Buffer</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Complimentary waiting</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">Fixed Flat Rate</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Tolls &amp; fuel included</span>
                </div>
                <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700/80 p-3 rounded-xl col-span-2 sm:col-span-1">
                  <Plane className="w-4 h-4 text-[#0068FF] mb-1" />
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-white block">Live Radar Sync</span>
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Auto delay tracking</span>
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
                  <span>{showBookingWizard ? 'Hide Booking Form' : 'Book Airport Transfer Online'}</span>
                </button>

                <a
                  href={whatsAppGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#131b2c] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 text-[#1A1A1A] dark:text-white border border-[#E5E8ED] dark:border-slate-700 px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Concierge 24/7</span>
                </a>
              </div>
            </div>

            {/* Visual Fleet Card */}
            <div className="lg:col-span-5">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-[#E5E8ED] dark:border-slate-800">
                <Image
                  src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                  alt="Toyota Alphard Executive Airport Transfer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                  <span className="text-xs font-bold text-[#0068FF] bg-white px-2 py-0.5 rounded w-fit uppercase">
                    VIP Flagship Fleet
                  </span>
                  <h2 className="font-extrabold text-base">Toyota Alphard &amp; Granace VIP</h2>
                  <p className="text-xs text-slate-300">
                    Quiet cabin acoustics, leather captain seats, and generous luggage capacity.
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
          <AirportTransferModule onBackToCatalog={() => setShowBookingWizard(false)} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS: STEP-BY-STEP ARRIVAL PROTOCOL
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            Seamless Passenger Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            How Your Airport Transfer Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
            From the moment your flight touches down in Tokyo to your hotel check-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Real-Time Flight Tracking
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Your chauffeur monitors your inbound aircraft live. If your flight arrives early or is delayed, pickup timing adjusts automatically with zero stress.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              60-Min Customs Buffer
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Take your time through immigration, baggage claim, and customs. We provide a full 60 minutes of complimentary wait time starting from actual touchdown.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Arrivals Hall Greeting
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              As you step out into the arrival lobby, your professional chauffeur awaits with an official nameboard. Immediate baggage assistance is provided.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-[#E8F1FF] dark:bg-[#0068FF]/20 text-[#0068FF] font-extrabold text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white">
              Direct Hotel Drop-Off
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Relax in a climate-controlled luxury vehicle with complimentary bottled water and device charging as you are smoothly chauffeured directly to your hotel lobby.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. AIRPORT TERMINAL GUIDE: HANEDA & NARITA
          ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-white dark:bg-[#0E131F] border-y border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
              Terminal Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
              Meeting Points at Tokyo Airports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Haneda Airport Card */}
            <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E8ED] dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-[#0068FF]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Haneda Airport (HND)</h3>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Tokyo International Airport (Ota-ku)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/20 px-2.5 py-1 rounded-full">
                  ~30 Min to City
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 3 (International Flagship)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Just outside Customs Exit Lobby, in front of the Information Counter.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 2 (ANA International &amp; Domestic)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Level 2 International Arrival Lobby main exit barrier.
                  </p>
                </div>
              </div>
            </div>

            {/* Narita Airport Card */}
            <div className="bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E8ED] dark:border-slate-700/80">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-[#0068FF]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Narita Airport (NRT)</h3>
                    <span className="text-[11px] text-[#6B7280] dark:text-slate-400">New Tokyo International Airport (Chiba)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0068FF] bg-[#E8F1FF] dark:bg-[#0068FF]/20 px-2.5 py-1 rounded-full">
                  ~60–75 Min to City
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 1 (North &amp; South Wings)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Central Arrivals Lobby outside South/North customs exit barriers.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0E131F] rounded-xl border border-[#E5E8ED] dark:border-slate-800">
                  <span className="font-bold text-[#1A1A1A] dark:text-white block mb-0.5">Terminal 2 (Main International Hub)</span>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    Meeting area: Level 1 International Arrival Lobby near central meeting points.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. FLEET SPECIFICATIONS & LUGGAGE CAPACITY
          ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#0068FF]">
            Commercial Fleet Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white">
            Luggage &amp; Seating Capacity
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400">
            Choose the ideal executive vehicle tailored to your group size and baggage requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Alphard */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                alt="Toyota Alphard"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                VIP 1–4 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Alphard Executive</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Ottoman power-reclining captain chairs with personal climate controls and premium ride comfort.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–4 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 3–4 Large Bags
                </span>
              </div>
            </div>
          </div>

          {/* Granace */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-granace-exterior-4032x3024.jpg"
                alt="Toyota Granace 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                VIP 1–5 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">Toyota Granace 4WD VIP</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Full-size executive transporter with 4 independent leather captain chairs across 2nd &amp; 3rd rows.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–5 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 4–5 Large Bags
                </span>
              </div>
            </div>
          </div>

          {/* HiAce */}
          <div className="bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/fleet-toyota-hiace-exterior-1477x1108.jpg"
                alt="HiAce Grand Cabin"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0068FF] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Groups 1–9 Guests
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">HiAce Grand Cabin VIP</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                High-roof wide cabin with massive luggage capacity for families, corporate teams, and golf groups.
              </p>
              <div className="pt-2 border-t border-[#F0F2F5] dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0068FF]" /> 1–9 Pax
                </span>
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-[#0068FF]" /> 9–10 Large Bags
                </span>
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
            Ready to Reserve Your Tokyo Airport Transfer?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-xl mx-auto">
            Book online with real-time flight tracking or connect with our concierge team on WhatsApp.
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
