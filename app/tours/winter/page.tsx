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
  ChevronRight,
  ArrowRight,
  Mountain,
  ThermometerSnowflake,
  ShieldAlert,
  Wind
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SkiTransferBookingModule from '@/components/SkiTransferBookingModule';
import { useLanguage } from '@/context/LanguageContext';

export default function WinterSkiToursPage() {
  const [lang] = useLanguage();
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedResortForWizard, setSelectedResortForWizard] = useState('hakuba');

  const whatsAppSkiUrl = `https://wa.me/818012345678?text=${encodeURIComponent(
    'Hello SK Limo! I am inquiring about private 4WD winter ski transfers from Tokyo / Haneda / Narita to Hakuba, Nozawa, and Shiga Kogen.'
  )}`;

  const skiResorts = [
    {
      id: 'hakuba',
      name: 'Hakuba Valley (Nagano)',
      region: 'Japan Northern Alps',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Host of the 1998 Winter Olympics. 10 interconnected world-class ski resorts, legendary alpine bowls, and vibrant international village dining.',
      image: '/images/ski-hakuba-hero-4032x3024.jpg',
      price: '¥110,000〜',
      tag: 'Olympic Alpine Standard',
    },
    {
      id: 'nozawa',
      name: 'Nozawa Onsen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Historic ski village combining deep powder tree runs with 13 traditional open-air public onsen hot springs throughout the cobblestone streets.',
      image: '/images/ski-nozawa-hero-4032x3024.jpg',
      price: '¥115,000〜',
      tag: 'Powder & Historic Onsen',
    },
    {
      id: 'shigakogen',
      name: 'Shiga Kogen (Nagano)',
      region: 'Nagano Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Japan’s highest ski resort and largest connected ski area (18 resorts on 1 lift pass), renowned for ultra-dry microclimate powder snow.',
      image: '/images/ski-shiga-hero-4032x3024.jpg',
      price: '¥118,000〜',
      tag: 'Highest Elevation in Japan',
    },
    {
      id: 'yuzawa',
      name: 'Yuzawa & Naeba (Niigata)',
      region: 'Niigata Prefecture',
      hours: '2.5–3.0 Hours from Tokyo',
      desc: 'Legendary Snow Country with the fastest access from Tokyo. Huge resort facilities, heated ski-in/ski-out hotels, and natural hot spring spas.',
      image: '/images/ski-yuzawa-hero-4032x3024.jpg',
      price: '¥85,000〜',
      tag: 'Closest Powder to Tokyo',
    },
    {
      id: 'myoko',
      name: 'Myoko Kogen (Niigata)',
      region: 'Niigata Prefecture',
      hours: '3.5–4.0 Hours from Tokyo',
      desc: 'Receiving over 13+ meters of annual snowfall from the Sea of Japan, world-famous for steep tree runs, backcountry, and authentic Japanese culture.',
      image: '/images/ski-myoko-hero-4032x3024.jpg',
      price: '¥125,000〜',
      tag: '13m+ Annual Snowfall',
    },
    {
      id: 'karuizawa',
      name: 'Karuizawa Prince (Nagano)',
      region: 'Nagano Prefecture',
      hours: '2.0–2.5 Hours from Tokyo',
      desc: 'An effortless luxury mountain escape only 2 hours from Tokyo, pairing pristine groomed ski slopes with Japan’s premier luxury shopping outlet.',
      image: '/images/ski-karuizawa-hero-4032x3024.jpg',
      price: '¥75,000〜',
      tag: 'Ski & Luxury Shopping',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="winter" />

      {/* ══════════════════════════════════════════════════
          1. IMMERSIVE CINEMATIC HERO WITH SKITRAILS BACKDROP
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
        
        {/* Background Image: skitrails.jpg with luxury gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/skitrails.jpg"
            alt="Alpine Ski Trails Japan"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-black/60 to-black/75" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-fade-in">
            <Snowflake className="w-4 h-4 text-[#38BDF8] animate-pulse" />
            <span>4WD Mountain Fleet · Bridgestone Blizzak Studless Tires</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              Door-to-Chalet <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                Private 4WD Ski Transfers
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
              Travel seamlessly from Tokyo, Haneda, or Narita directly to the ski lifts of Hakuba, Nozawa Onsen, Shiga Kogen, and Niigata. No train connections or dragging heavy ski bags.
            </p>
          </div>

          {/* Luxury Feature Pillars (Frosted Glass) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2 text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <Car className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">Full-Time 4WD / AWD</h3>
              <p className="text-[11px] text-slate-300">Electronic traction control</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <ThermometerSnowflake className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">Blizzak Studless</h3>
              <p className="text-[11px] text-slate-300">Japanese snow tires</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <Luggage className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">Ski Bag Capacity</h3>
              <p className="text-[11px] text-slate-300">Generous gear storage</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-1 shadow-lg">
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="font-bold text-xs text-white">Flat Rate Guarantee</h3>
              <p className="text-[11px] text-slate-300">All highway tolls &amp; fuel</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowBookingWizard(!showBookingWizard);
                if (!showBookingWizard) {
                  setTimeout(() => {
                    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-[#0068FF]/30 transition-all cursor-pointer hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              <span>{showBookingWizard ? 'Close Booking Module' : 'Configure Ski Transfer & Price'}</span>
            </button>

            <a
              href={whatsAppSkiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 px-7 py-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Ski Concierge 24/7</span>
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TOGGLEABLE INTERACTIVE BOOKING WIZARD
          ══════════════════════════════════════════════════ */}
      {showBookingWizard && (
        <section id="booking-wizard" className="py-10 bg-[#0E131F] border-y border-slate-800 transition-colors animate-fade-in">
          <SkiTransferBookingModule
            initialResort={selectedResortForWizard}
            onBackToCatalog={() => setShowBookingWizard(false)}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS: THE DOOR-TO-CHALET PROTOCOL
          ══════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8] flex items-center justify-center gap-1.5">
            <Mountain className="w-4 h-4" />
            Effortless Alpine Logistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How Your Ski Transfer Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From touchdown at Haneda/Narita or your Tokyo hotel lobby straight to the lodge fire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              01
            </div>
            <h3 className="font-bold text-lg text-white">
              Private Curbside Pickup &amp; Loading
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your professional chauffeur meets you at Haneda, Narita, or your Tokyo hotel. All oversized ski bags, snowboards, boots, and luggage are securely loaded into the vehicle for you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              02
            </div>
            <h3 className="font-bold text-lg text-white">
              Comfortable Highway Transit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Relax in climate-controlled leather captain chairs. Travel via scenic expressway passes with scheduled stops at premier Japanese Service Areas for hot ramen, artisan coffee, and snacks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl p-8 space-y-5 shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl group-hover:bg-[#38BDF8]/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-[#0068FF]/20 text-[#38BDF8] font-mono font-extrabold text-lg flex items-center justify-center border border-[#0068FF]/30">
              03
            </div>
            <h3 className="font-bold text-lg text-white">
              Direct Front-Door Chalet Delivery
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your 4WD vehicle drives right up to the entrance of your private chalet, hotel, or ryokan on snowy mountain roads. Step out directly onto the snow without ever catching a shuttle bus.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. CURATED SKI RESORTS DIRECTORY
          ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0A0E17] border-y border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8]">
              Premier Powder Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Curated Japan Ski Resorts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select your destination to preview direct transfer rates and travel times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skiResorts.map((resort) => (
              <div
                key={resort.id}
                className="bg-[#0E131F] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={resort.image}
                      alt={resort.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-black/40" />
                    <div className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {resort.tag}
                    </div>
                    <div className="absolute bottom-3.5 left-3.5 bg-white/15 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2.5 py-0.5 rounded border border-white/20">
                      {resort.hours}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase text-[#38BDF8] tracking-wider block">
                      {resort.region}
                    </span>
                    <h3 className="font-bold text-lg text-white group-hover:text-[#38BDF8] transition-colors">
                      {resort.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {resort.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Flat Rate From</span>
                    <span className="text-lg font-extrabold text-white font-mono">{resort.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResortForWizard(resort.id);
                      setShowBookingWizard(true);
                      setTimeout(() => {
                        document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>Reserve</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. 4WD FLEET SPECIFICATIONS & CAPACITY
          ══════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#38BDF8]">
            Commercial MLIT Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            4WD Winter Fleet &amp; Gear Capacities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered for mountain snow safety and passenger comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Alphard */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-alphard-exterior-1477x1108.jpg"
                alt="Toyota Alphard 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                VIP 1–4 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">Toyota Alphard 4WD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heated leather Ottoman captain chairs with personal climate controls and ultra-quiet mountain driving dynamics.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–4 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 4 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">3–4 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Granace */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-granace-exterior-4032x3024.jpg"
                alt="Toyota Granace 4WD VIP"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                VIP 1–5 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">Toyota Granace 4WD VIP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-size luxury MPV with 4 independent leather captain seats across 2nd &amp; 3rd rows and high ground clearance.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–5 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 5 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">4–5 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

          {/* HiAce */}
          <div className="bg-[#0E131F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-52 w-full bg-slate-900">
              <Image
                src="/images/fleet-toyota-hiace-exterior-1477x1108.jpg"
                alt="HiAce Grand Cabin 4WD"
                fill
                className="object-cover"
              />
              <span className="absolute top-3.5 left-3.5 bg-[#0068FF] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                Groups 1–9 Guests
              </span>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">HiAce Grand Cabin 4WD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-roof wide cabin with massive luggage capacity designed for large families, corporate ski retreats, and ski groups.
              </p>
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating:</span>
                  <span className="text-white">1–9 Passengers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ski / Board Bags:</span>
                  <span className="text-[#38BDF8]">Up to 9 Ski/Board Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suitcases:</span>
                  <span className="text-white">9–10 Large Luggage</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. BOTTOM CALL TO ACTION
          ══════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0E131F] border-t border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#0068FF]/20 text-[#38BDF8] flex items-center justify-center mx-auto border border-[#0068FF]/30">
            <Snowflake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready for the Ultimate Japan Winter Powder?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Book online with fixed flat rates or chat with our mountain logistics team for custom multi-resort transfers.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/tours"
              className="bg-[#0068FF] hover:bg-[#0050CC] text-white px-7 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Main Charters Portal</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
