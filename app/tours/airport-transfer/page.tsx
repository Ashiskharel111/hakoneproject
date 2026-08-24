'use client';

import React from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AirportTransferModule from '@/components/AirportTransferModule';

export default function AirportTransferDedicatedPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#080B11] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader activePage="airport" />

      {/* Hero Header */}
      <section className="pt-20 sm:pt-24 pb-4 sm:pb-6 bg-white dark:bg-[#0E131F] border-b border-[#E5E8ED] dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-white leading-tight">
            Airport Transfer
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 max-w-xl mx-auto">
            Fixed-rate private transfers between Haneda &amp; Narita airports and Tokyo hotels. Expressway tolls and 60-min flight delay buffer included.
          </p>
        </div>
      </section>

      {/* Reusable Airport Transfer Module */}
      <AirportTransferModule />

      <SiteFooter />
    </div>
  );
}
