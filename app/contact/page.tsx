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

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#080B11] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 Operations &amp; Dispatch Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            {lang === 'ja'
              ? 'お問い合わせ・コンシェルジュデスク'
              : 'Contact Concierge & 24/7 Dispatch Desk'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ja'
              ? '成田・羽田空港送迎、貸切観光チャーター、スキー送迎、法人手配のご相談。専任スタッフが迅速にご案内いたします。'
              : 'Whether booking airport VIP transfers, bespoke multi-day itineraries, or corporate roadshows, our bilingual dispatch team is available around the clock.'}
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0068FF]">Direct Channels</span>
                <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Get in Touch Instantly</h3>
              </div>

              <div className="space-y-4 text-xs text-[#4B5563] dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <Phone className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">+81 80 1234 5678</span>
                    <span className="text-[11px] text-[#9CA3AF]">24/7 Direct Chauffeur Hotline &amp; Dispatch</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <Mail className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">contact@sklimojapan.com</span>
                    <span className="text-[11px] text-[#9CA3AF]">Official Booking &amp; Invoice Support</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#131b2c] border border-[#E5E8ED] dark:border-slate-800">
                  <MapPin className="w-5 h-5 text-[#0068FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block text-sm">Tokyo Headquarters</span>
                    <span className="text-[11px] text-[#9CA3AF]">Koto-ku, Tokyo, Japan · MLIT Licensed</span>
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
                  <span>Chat on WhatsApp (Instant Response)</span>
                </a>
              </div>
            </div>

            {/* B2B Agency & SLA Card */}
            <div className="bg-[#080B11] border border-slate-800 rounded-3xl p-6 space-y-4 text-white">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>For Travel Agencies &amp; DMCs</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct ground operator partner for international travel agencies. Guaranteed net rates, itemized invoicing, and dedicated WhatsApp operation channels.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Average Response Time: Under 15 Minutes</span>
              </div>
            </div>

          </div>

          {/* Right Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0068FF]">Send An Inquiry</span>
              <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Custom Charter &amp; Rate Request</h3>
            </div>

            {isSubmitted ? (
              <div className="bg-[#E8F1FF] dark:bg-[#0068FF]/15 border border-[#0068FF]/30 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#0068FF] mx-auto" />
                <h4 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Inquiry Received Successfully</h4>
                <p className="text-xs text-[#4B5563] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Our bilingual concierge desk will review your itinerary details and reply to <strong>{formData.email}</strong> within 15 minutes with a formal quote.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#0068FF] hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      Full Name <span className="text-red-500">*</span>
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
                      Email Address <span className="text-red-500">*</span>
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
                      Service Type
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-[#F5F7FA] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#0068FF] cursor-pointer"
                    >
                      <option value="airport">Airport Transfer (Haneda / Narita)</option>
                      <option value="sightseeing">Private Day Charter (Fuji, Hakone, Nikko)</option>
                      <option value="ski">4WD Ski Transfer (Hakuba, Nozawa, Yuzawa)</option>
                      <option value="corporate">Corporate VIP Roadshow / B2B</option>
                      <option value="custom">Custom Multi-Day Itinerary</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 block mb-1">
                      Estimated Date &amp; Guests
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
                    Itinerary Details &amp; Special Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please share pickup location, destination, flight numbers, luggage requirements, or specific vehicle preferences (HiAce Standard, Alphard Premium, Granace Ultra Premium)..."
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
                  <span>Submit Inquiry</span>
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
