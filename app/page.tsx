'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  ChevronDown,
  Users,
  Luggage,
  Mail,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getFutureDateJST } from '@/lib/date-utils';

type ServiceCategory = 'airport' | 'sightseeing' | 'ski';
type FleetKey = 'alphard' | 'granace' | 'hiace';
type FleetPhotoTab = 'exterior' | 'interior' | 'trunk';

interface RouteCardItem {
  id: string;
  category: ServiceCategory;
  title: string;
  meta: string;
  priceFrom: string;
  image: string;
  defaultVehicle: FleetKey;
}

const ROUTE_CATALOG: RouteCardItem[] = [
  {
    id: 'hnd-tokyo',
    category: 'airport',
    title: 'Haneda Airport (HND) ↔ Tokyo',
    meta: '30 mins • All-inclusive flat rate',
    priceFrom: '¥24,000',
    image: '/images/dest-haneda-hero-1920x1080.jpg',
    defaultVehicle: 'alphard',
  },
  {
    id: 'nrt-tokyo',
    category: 'airport',
    title: 'Narita Airport (NRT) ↔ Tokyo',
    meta: '65 mins • All-inclusive flat rate',
    priceFrom: '¥36,000',
    image: '/images/dest-narita-hero-1920x1080.jpg',
    defaultVehicle: 'alphard',
  },
  {
    id: 'fuji-charter',
    category: 'sightseeing',
    title: 'Mt. Fuji & Kawaguchiko',
    meta: '10-hour private charter',
    priceFrom: '¥100,000',
    image: '/images/dest-fuji-hero-1920x1080.jpg',
    defaultVehicle: 'alphard',
  },
  {
    id: 'hakone-charter',
    category: 'sightseeing',
    title: 'Hakone & Lake Ashi',
    meta: '10-hour private charter',
    priceFrom: '¥90,000',
    image: '/images/dest-hakone-hero-1920x1080.jpg',
    defaultVehicle: 'alphard',
  },
  {
    id: 'kamakura-charter',
    category: 'sightseeing',
    title: 'Kamakura & Enoshima Coast',
    meta: '10-hour private charter',
    priceFrom: '¥80,000',
    image: '/images/dest-kamakura-hero-1920x1080.jpg',
    defaultVehicle: 'alphard',
  },
  {
    id: 'nikko-charter',
    category: 'sightseeing',
    title: 'Nikko UNESCO Heritage',
    meta: '10-hour private charter',
    priceFrom: '¥100,000',
    image: '/images/dest-nikko-hero-1920x1080.jpg',
    defaultVehicle: 'granace',
  },
  {
    id: 'hakuba-ski',
    category: 'ski',
    title: 'Hakuba Valley 4WD Ski Transfer',
    meta: 'Direct door-to-chalet',
    priceFrom: '¥130,000',
    image: '/images/ski-hakuba-hero-4032x3024.jpg',
    defaultVehicle: 'hiace',
  },
  {
    id: 'nozawa-shiga-ski',
    category: 'ski',
    title: 'Nozawa Onsen & Shiga Kogen',
    meta: 'Direct 4WD winter transfer',
    priceFrom: '¥130,000',
    image: '/images/ski-nozawa-hero-4032x3024.jpg',
    defaultVehicle: 'hiace',
  },
];

const FLEET_DATA: Record<
  FleetKey,
  {
    name: string;
    subtitle: string;
    capacity: string;
    luggage: string;
    rateSummary: string;
    exteriorImage: string;
    interiorImage: string;
    trunkImage: string;
    summary: string;
  }
> = {
  alphard: {
    name: 'Toyota Alphard Executive Lounge',
    subtitle: 'First-Class VIP Sanctuary',
    capacity: 'Up to 4 Guests',
    luggage: '3–4 Suitcases',
    rateSummary: 'HND ¥30,000 · NRT ¥60,000 · Charter from ¥80,000',
    exteriorImage: '/images/fleet-toyota-alphard-exterior-1477x1108.jpg',
    interiorImage: '/images/fleet-toyota-alphard-interior-1477x1108.jpg',
    trunkImage: '/images/fleet-toyota-alphard-trunk-1477x1108.jpg',
    summary:
      'Power-reclining Ottoman captain chairs in Nappa leather with whisper-quiet acoustic glass.',
  },
  granace: {
    name: 'Toyota GranAce 4WD VIP',
    subtitle: 'Executive 6-Seater Flagship',
    capacity: 'Up to 5 Guests',
    luggage: '4–5 Suitcases',
    rateSummary: 'HND ¥30,000 · NRT ¥60,000 · Charter from ¥80,000',
    exteriorImage: '/images/fleet-toyota-granace-exterior-4032x3024.jpg',
    interiorImage: '/images/fleet-toyota-granace-interior-1477x1108.jpg',
    trunkImage: '/images/fleet-toyota-granace-trunk-1477x1108.jpg',
    summary:
      'Four independent executive captain chairs across two rows with commanding full-size cabin space.',
  },
  hiace: {
    name: 'Toyota HiAce Grand Cabin',
    subtitle: 'Private Group & Alpine Van',
    capacity: 'Up to 9 Guests',
    luggage: '9–10 Suitcases / Ski Gear',
    rateSummary: 'HND ¥24,000 · NRT ¥36,000 · Charter from ¥80,000',
    exteriorImage: '/images/fleet-toyota-hiace-exterior-1477x1108.jpg',
    interiorImage: '/images/fleet-toyota-hiace-interior-1477x1108.jpg',
    trunkImage: '/images/fleet-toyota-hiace-trunk-1477x1108.jpg',
    summary:
      'High-roof wide-body cabin engineered for larger families, private groups, and winter ski equipment.',
  },
};

const FAQ_ITEMS = [
  {
    q: 'Airport Meet & Greet Protocol',
    a: 'Your chauffeur tracks your flight in real time and meets you at the arrival gate with a personalized nameboard. 90 minutes of complimentary waiting time is included after landing.',
  },
  {
    q: 'All-Inclusive Fixed Pricing',
    a: 'Every quote includes expressway tolls, airport parking fees, fuel, commercial passenger insurance, and consumption tax—with zero hidden surcharges.',
  },
  {
    q: 'MLIT Green-Plate Licensing (License No. 1234)',
    a: 'SK Limo operates 100% government-licensed commercial green-plate vehicles with unlimited passenger liability coverage.',
  },
];

export default function SkLimoPreviewPage() {
  // Hero Quick Bar
  const [heroRouteId, setHeroRouteId] = useState<string>('hnd-tokyo');
  const [heroDate, setHeroDate] = useState<string>(() => getFutureDateJST(3));
  const [heroPax, setHeroPax] = useState<number>(2);

  // Fleet Showcase
  const [selectedFleet, setSelectedFleet] = useState<FleetKey>('alphard');
  const [fleetPhotoTab, setFleetPhotoTab] = useState<FleetPhotoTab>('exterior');

  // Route Filter
  const [routeFilter, setRouteFilter] = useState<'all' | ServiceCategory>('all');

  // Minimal Concierge Form
  const [inqService, setInqService] = useState<ServiceCategory>('airport');
  const [inqVehicle, setInqVehicle] = useState<FleetKey>('alphard');
  const [inqRoute, setInqRoute] = useState<string>('Haneda Airport (HND) ↔ Tokyo');
  const [inqDate, setInqDate] = useState<string>(() => getFutureDateJST(3));
  const [inqTime, setInqTime] = useState<string>('14:00');
  const [inqPax, setInqPax] = useState<number>(2);
  const [inqFlight, setInqFlight] = useState<string>('');
  const [inqName, setInqName] = useState<string>('');
  const [inqContact, setInqContact] = useState<string>('');
  const [inqNotes, setInqNotes] = useState<string>('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedInquiry, setCopiedInquiry] = useState<boolean>(false);

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedHeroRoute =
    ROUTE_CATALOG.find((r) => r.id === heroRouteId) || ROUTE_CATALOG[0];

  const filteredRoutes =
    routeFilter === 'all'
      ? ROUTE_CATALOG
      : ROUTE_CATALOG.filter((r) => r.category === routeFilter);

  const currentFleet = FLEET_DATA[selectedFleet];
  const currentFleetImage =
    fleetPhotoTab === 'interior'
      ? currentFleet.interiorImage
      : fleetPhotoTab === 'trunk'
      ? currentFleet.trunkImage
      : currentFleet.exteriorImage;

  const scrollToInquiryWithPreset = (opts: {
    category?: ServiceCategory;
    vehicle?: FleetKey;
    route?: string;
    date?: string;
    pax?: number;
  }) => {
    if (opts.category) setInqService(opts.category);
    if (opts.vehicle) setInqVehicle(opts.vehicle);
    if (opts.route) setInqRoute(opts.route);
    if (opts.date) setInqDate(opts.date);
    if (opts.pax) setInqPax(opts.pax);
    setSubmittedRef(null);

    const el = document.getElementById('inquire');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const buildInquiryMessage = (refCode?: string) => {
    const vehicleLabel = FLEET_DATA[inqVehicle].name;
    return [
      `Hello SK Limo Concierge! I would like to request a chauffeur reservation:`,
      refCode ? `Ref: ${refCode}` : undefined,
      `• Route: ${inqRoute}`,
      `• Vehicle: ${vehicleLabel}`,
      `• Date & Time: ${inqDate} at ${inqTime} JST`,
      `• Guests: ${inqPax}`,
      inqFlight.trim() ? `• Flight: ${inqFlight.trim()}` : undefined,
      inqName.trim() ? `• Name: ${inqName.trim()}` : undefined,
      inqContact.trim() ? `• Contact: ${inqContact.trim()}` : undefined,
      inqNotes.trim() ? `• Notes: ${inqNotes.trim()}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setSubmittedRef(`SK-${randomNum}`);
  };

  const whatsAppInquiryUrl = `https://wa.me/818038582729?text=${encodeURIComponent(
    buildInquiryMessage(submittedRef || undefined)
  )}`;

  const mailtoInquiryUrl = `mailto:tours@sk.limo?subject=${encodeURIComponent(
    `[sk.limo] ${inqRoute} (${inqDate})`
  )}&body=${encodeURIComponent(buildInquiryMessage(submittedRef || undefined))}`;

  const handleCopyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(buildInquiryMessage(submittedRef || undefined));
      setCopiedInquiry(true);
      setTimeout(() => setCopiedInquiry(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090E] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-200">
      <SiteHeader />

      <main className="pt-16">
        {/* ══════════════════════════════════════════════════════════════════
            1. MINIMALIST CINEMATIC HERO
           ══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[82vh] flex items-center bg-[#06080E] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/landing.jpg"
              alt="SK Limo Private Chauffeur Japan"
              fill
              preload
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-center opacity-45 scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/55 to-[#06080E]/75" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-3xl mx-auto text-center space-y-6 mb-14">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4B475]">
                PRIVATE CHAUFFEUR SERVICE • JAPAN
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-white">
                Effortless Private Travel{' '}
                <span className="font-semibold text-[#E5C378]">Across Japan.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300/90 max-w-xl mx-auto font-normal leading-relaxed">
                Haneda &amp; Narita airport transfers, bespoke sightseeing charters, and 4WD alpine
                ski journeys.
              </p>
            </div>

            {/* Sleek Single-Row Booking Bar */}
            <div className="max-w-4xl mx-auto bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-white/15">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                <div className="md:col-span-5 px-3 py-1.5">
                  <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                    Journey
                  </label>
                  <select
                    value={heroRouteId}
                    onChange={(e) => setHeroRouteId(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {ROUTE_CATALOG.map((route) => (
                      <option
                        key={route.id}
                        value={route.id}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        {route.title} — {route.priceFrom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 px-3 py-1.5 md:border-l border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={heroDate}
                    onChange={(e) => setHeroDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="md:col-span-2 px-3 py-1.5 md:border-l border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                    Guests
                  </label>
                  <select
                    value={heroPax}
                    onChange={(e) => setHeroPax(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option
                        key={n}
                        value={n}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() =>
                      scrollToInquiryWithPreset({
                        category: selectedHeroRoute.category,
                        vehicle: heroPax > 5 ? 'hiace' : selectedHeroRoute.defaultVehicle,
                        route: selectedHeroRoute.title,
                        date: heroDate,
                        pax: heroPax,
                      })
                    }
                    className="w-full h-12 rounded-xl bg-[#C5A059] hover:bg-[#d4b06a] text-[#0A0D14] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quiet Pillar Strip */}
            <div className="max-w-3xl mx-auto mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4B475] block">
                  MLIT License No. 1234
                </span>
                <span className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  Official Green-Plate Fleet
                </span>
              </div>
              <div className="border-x border-white/10 px-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4B475] block">
                  90-Min Free Wait
                </span>
                <span className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  Flight-Tracked Arrivals
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4B475] block">
                  All-Inclusive Rates
                </span>
                <span className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  Tolls &amp; Taxes Included
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            2. SERVICES — THREE VISUAL PILLARS (#services)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
                SERVICES
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
                Curated Chauffeur Experiences
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Door-to-door privacy with English concierge support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Airport Transfers',
                sub: 'Haneda (HND) & Narita (NRT) Meet & Greet',
                price: 'From ¥24,000',
                image: '/images/airport-transfer-vip-alphard-1376x768.jpg',
                cat: 'airport' as ServiceCategory,
                route: 'Haneda Airport (HND) ↔ Tokyo',
                vehicle: 'alphard' as FleetKey,
              },
              {
                title: 'Private Day Charters',
                sub: 'Mt. Fuji, Hakone, Nikko, Kamakura & Tokyo',
                price: 'From ¥80,000',
                image: '/images/dest-fuji-kawaguchiko-1376x768.jpg',
                cat: 'sightseeing' as ServiceCategory,
                route: 'Mt. Fuji & Kawaguchiko',
                vehicle: 'alphard' as FleetKey,
              },
              {
                title: '4WD Ski Transfers',
                sub: 'Hakuba, Nozawa Onsen & Shiga Kogen',
                price: 'From ¥130,000',
                image: '/images/ski-hakuba-hero-4032x3024.jpg',
                cat: 'ski' as ServiceCategory,
                route: 'Hakuba Valley 4WD Ski Transfer',
                vehicle: 'hiace' as FleetKey,
              },
            ].map((srv) => (
              <div
                key={srv.title}
                onClick={() =>
                  scrollToInquiryWithPreset({
                    category: srv.cat,
                    vehicle: srv.vehicle,
                    route: srv.route,
                  })
                }
                className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer bg-slate-950"
              >
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col justify-end text-white">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#E5C378] font-semibold mb-1">
                    {srv.price}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight mb-1">{srv.title}</h3>
                  <p className="text-xs text-slate-300 mb-4">{srv.sub}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white group-hover:text-[#E5C378] transition-colors">
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            3. THE FLEET — GALLERY-FIRST SHOWCASE (#fleet)
           ══════════════════════════════════════════════════════════════════ */}
        <section
          id="fleet"
          className="bg-[#F9FAFB] dark:bg-[#0B0E16] border-y border-slate-200/70 dark:border-slate-800/80 py-24 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
                  THE FLEET
                </span>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
                  Executive Commercial Vehicles
                </h2>
              </div>

              {/* Clean Model Selector */}
              <div className="flex flex-wrap gap-2">
                {(['alphard', 'granace', 'hiace'] as FleetKey[]).map((key) => {
                  const isSelected = selectedFleet === key;
                  const shortLabel =
                    key === 'alphard'
                      ? 'Alphard Executive'
                      : key === 'granace'
                      ? 'GranAce 4WD VIP'
                      : 'HiAce Grand Cabin';
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedFleet(key);
                        setFleetPhotoTab('exterior');
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#111827] dark:bg-[#C5A059] text-white dark:text-[#0A0D14]'
                          : 'bg-white dark:bg-[#111622] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#C5A059]'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Large Gallery Image */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src={currentFleetImage}
                    alt={currentFleet.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(
                    [
                      { id: 'exterior', label: 'Exterior' },
                      { id: 'interior', label: 'Cabin Interior' },
                      { id: 'trunk', label: 'Luggage Bay' },
                    ] as { id: FleetPhotoTab; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFleetPhotoTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        fleetPhotoTab === tab.id
                          ? 'bg-[#C5A059]/20 text-[#8C6D3F] dark:text-[#E5C378] border border-[#C5A059]/50'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimalist Specs */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold block mb-1">
                    {currentFleet.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {currentFleet.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3">
                    {currentFleet.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Capacity
                      </span>
                      <span className="text-xs font-semibold">{currentFleet.capacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Luggage className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Luggage
                      </span>
                      <span className="text-xs font-semibold">{currentFleet.luggage}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {currentFleet.rateSummary}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    scrollToInquiryWithPreset({
                      vehicle: selectedFleet,
                    })
                  }
                  className="w-full py-3.5 px-6 rounded-xl bg-[#C5A059] hover:bg-[#d4b06a] text-[#0A0D14] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Reserve {currentFleet.name.split(' ')[1]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            4. ROUTES & TRANSPARENT FARES (#destinations)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
                DESTINATIONS &amp; FARES
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
                Signature Routes &amp; Fixed Rates
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'airport', label: 'Airports' },
                  { id: 'sightseeing', label: 'Day Charters' },
                  { id: 'ski', label: 'Ski Resorts' },
                ] as { id: 'all' | ServiceCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRouteFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    routeFilter === tab.id
                      ? 'bg-[#111827] dark:bg-[#C5A059] text-white dark:text-[#0A0D14]'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() =>
                  scrollToInquiryWithPreset({
                    category: route.category,
                    vehicle: route.defaultVehicle,
                    route: route.title,
                  })
                }
                className="group bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800/90 rounded-2xl overflow-hidden hover:border-[#C5A059] transition-all cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={route.image}
                    alt={route.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {route.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{route.meta}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        From
                      </span>
                      <span className="text-base font-bold text-[#8C6D3F] dark:text-[#E5C378]">
                        {route.priceFrom}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#C5A059] inline-flex items-center gap-1">
                      Reserve <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            5. QUIET ARCHITECTURAL ASSURANCE (#compliance)
           ══════════════════════════════════════════════════════════════════ */}
        <section
          id="compliance"
          className="bg-[#090C14] text-white py-20 border-y border-slate-800/80 scroll-mt-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-semibold">Official Green-Plate Fleet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authorized by Japan’s Ministry of Land, Infrastructure, Transport &amp; Tourism
                  (License No. 1234) with unlimited commercial passenger insurance.
                </p>
              </div>

              <div className="space-y-2">
                <Clock className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-semibold">Punctual &amp; Flight-Tracked</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Chauffeurs arrive 15 minutes early and monitor flight arrivals in real time with
                  90 minutes of complimentary airport waiting time.
                </p>
              </div>

              <div className="space-y-2">
                <MessageSquare className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-semibold">24/7 English Concierge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct WhatsApp and email dispatch for bespoke itineraries, multi-vehicle
                  delegations, and corporate invoicing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            6. DIRECT CONCIERGE RESERVATION (#inquire)
           ══════════════════════════════════════════════════════════════════ */}
        <section id="inquire" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Concierge Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
                  RESERVATIONS
                </span>
                <h2 className="text-2xl sm:text-4xl font-light tracking-tight mb-3">
                  Request Your Chauffeur
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our Tokyo concierge desk responds promptly with confirmed availability and an
                  all-inclusive fixed quote.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/818038582729?text=Hello%20SK%20Limo!%20I%20would%20like%20to%20inquire%20about%20a%20private%20chauffeur%20in%20Japan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 hover:border-[#25D366] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        24/7 WhatsApp Concierge
                      </span>
                      <span className="text-sm font-semibold">+81 80 3858 2729</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="mailto:tours@sk.limo"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 hover:border-[#C5A059] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Email Desk
                      </span>
                      <span className="text-sm font-semibold">tours@sk.limo</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="tel:+818038582729"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 hover:border-[#C5A059] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Direct Dispatch Line
                      </span>
                      <span className="text-sm font-semibold">+81 80 3858 2729</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Right: Clean Inquiry Card */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Service
                    </label>
                    <select
                      value={inqService}
                      onChange={(e) => setInqService(e.target.value as ServiceCategory)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="airport">Airport Transfer (HND / NRT)</option>
                      <option value="sightseeing">10-Hour Private Charter</option>
                      <option value="ski">4WD Ski Resort Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Vehicle
                    </label>
                    <select
                      value={inqVehicle}
                      onChange={(e) => setInqVehicle(e.target.value as FleetKey)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="alphard">Toyota Alphard Executive (1–4 Pax)</option>
                      <option value="granace">Toyota GranAce 4WD VIP (1–5 Pax)</option>
                      <option value="hiace">Toyota HiAce Grand Cabin (1–9 Pax)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Route or Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={inqRoute}
                    onChange={(e) => setInqRoute(e.target.value)}
                    placeholder="e.g., Haneda Airport T3 → Aman Tokyo"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={inqDate}
                      onChange={(e) => setInqDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      value={inqTime}
                      onChange={(e) => setInqTime(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Guests
                    </label>
                    <select
                      value={inqPax}
                      onChange={(e) => setInqPax(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#C5A059]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                        <option key={n} value={n}>
                          {n} Pax
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={inqName}
                      onChange={(e) => setInqName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Email or WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={inqContact}
                      onChange={(e) => setInqContact(e.target.value)}
                      placeholder="name@domain.com or +1..."
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Flight No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={inqFlight}
                      onChange={(e) => setInqFlight(e.target.value)}
                      placeholder="e.g., NH105"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={inqNotes}
                      onChange={(e) => setInqNotes(e.target.value)}
                      placeholder="Child seat, ski bags, special requests"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#C5A059] hover:bg-[#d4b06a] text-[#0A0D14] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsAppInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {submittedRef && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Reference #{submittedRef} Ready
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyInquiry}
                        className="text-[11px] font-semibold underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedInquiry ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={whatsAppInquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-lg bg-[#25D366] text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp</span>
                      </a>
                      <a
                        href={mailtoInquiryUrl}
                        className="py-2.5 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email tours@sk.limo</span>
                      </a>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            7. CONCISE FAQ (#faq)
           ══════════════════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className="border-t border-slate-200/70 dark:border-slate-800/80 py-20 scroll-mt-16"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-center mb-8">
              Essential Information
            </h2>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-sm font-medium">{item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C5A059] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
