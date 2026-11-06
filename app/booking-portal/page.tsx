'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StepProgressBar from '@/components/StepProgressBar';
import BookingConfirmationModal from '@/components/BookingConfirmationModal';
import { BookingPaymentDetails } from '@/components/StripePaymentModal';
import TripSearchTab, {
  AirportSearchParams,
  SightseeingSearchParams,
  SkiSearchParams,
} from '@/components/TripSearchTab';
import { useLanguage } from '@/context/LanguageContext';
import { getTodayJST, getFutureDateJST } from '@/lib/date-utils';

const AirportTransferModule = dynamic(() => import('@/components/AirportTransferModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Airport Booking...</span>
      </div>
    </div>
  ),
});

const DayTourBookingModule = dynamic(() => import('@/components/DayTourBookingModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Charter Booking...</span>
      </div>
    </div>
  ),
});

const SkiTransferBookingModule = dynamic(() => import('@/components/SkiTransferBookingModule'), {
  loading: () => (
    <div className="w-full bg-white dark:bg-[#0E131F] border border-[#E8E2D8] dark:border-slate-800 rounded-3xl p-12 min-h-[460px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-[#C5A059]">Loading Ski Booking...</span>
      </div>
    </div>
  ),
});

type ServiceType = 'airport' | 'sightseeing' | 'ski';

export default function BookingPortalHomePage() {
  const [lang] = useLanguage();
  const [activeService, setActiveService] = useState<ServiceType>('airport');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [airportParams, setAirportParams] = useState<AirportSearchParams>({
    airport: 'HND',
    direction: 'airport_to_hotel',
    hotelAddress: '',
    travelDate: getTodayJST(),
    pickupTime: '10:00',
    passengers: 2,
    luggage: 2,
  });

  const [sightseeingParams, setSightseeingParams] = useState<SightseeingSearchParams>({
    destination: 'fuji-kawaguchiko',
    pickupHotel: 'tokyo',
    travelDate: getFutureDateJST(2),
    pickupTime: '09:00',
    passengers: 3,
  });

  const [skiParams, setSkiParams] = useState<SkiSearchParams>({
    resort: 'hakuba',
    pickupPoint: 'hnd',
    travelDate: getFutureDateJST(5),
    pickupTime: '08:00',
    passengers: 4,
    skiGearCount: 4,
  });

  const [rehydratedBooking, setRehydratedBooking] = useState<{
    bookingRef: string;
    paymentIntentId: string;
    bookingDetails: BookingPaymentDetails;
  } | null>(null);
  const [isRehydratedModalOpen, setIsRehydratedModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const isBookingSuccess =
      searchParams.get('booking_success') === 'true' ||
      searchParams.get('redirect_status') === 'succeeded';
    const urlRef = searchParams.get('booking_ref');
    const paymentIntentId = searchParams.get('payment_intent') || 'pi_confirmed';

    try {
      const savedConfirmed = sessionStorage.getItem('sk_confirmed_booking');
      if (savedConfirmed) {
        const parsed = JSON.parse(savedConfirmed);
        if (parsed && parsed.bookingRef && parsed.bookingDetails) {
          setRehydratedBooking({
            bookingRef: parsed.bookingRef,
            paymentIntentId: parsed.paymentIntentId || paymentIntentId,
            bookingDetails: parsed.bookingDetails,
          });
          setIsRehydratedModalOpen(true);
          return;
        }
      }

      if (isBookingSuccess) {
        const savedPending = sessionStorage.getItem('sk_pending_booking');
        if (savedPending) {
          const parsedPending = JSON.parse(savedPending);
          const resolvedRef = urlRef || parsedPending.bookingRef || 'SK-CONFIRMED';
          const confirmedObj = {
            bookingRef: resolvedRef,
            paymentIntentId: paymentIntentId,
            bookingDetails: parsedPending.bookingDetails,
          };
          sessionStorage.setItem('sk_confirmed_booking', JSON.stringify({
            ...confirmedObj,
            timestamp: Date.now(),
          }));
          sessionStorage.removeItem('sk_pending_booking');
          setRehydratedBooking(confirmedObj);
          setIsRehydratedModalOpen(true);
        }
      }
    } catch (e) {
      console.warn('Session rehydration notice:', e);
    }
  }, []);

  const scrollToBookingEngine = () => {
    setTimeout(() => {
      const el = document.getElementById('booking-engine');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToSearchConsole = () => {
    setTimeout(() => {
      const el = document.getElementById('trip-search-console');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleAirportSearch = (params: AirportSearchParams) => {
    setAirportParams(params);
    setHasSearched(true);
    setCurrentStep(2);
    scrollToBookingEngine();
  };

  const handleSightseeingSearch = (params: SightseeingSearchParams) => {
    setSightseeingParams(params);
    setHasSearched(true);
    setCurrentStep(2);
    scrollToBookingEngine();
  };

  const handleSkiSearch = (params: SkiSearchParams) => {
    setSkiParams(params);
    setHasSearched(true);
    setCurrentStep(2);
    scrollToBookingEngine();
  };

  const handleStepClick = (step: 1 | 2 | 3) => {
    if (step === 1) {
      setCurrentStep(1);
      scrollToSearchConsole();
    } else if (step === 2) {
      setCurrentStep(2);
      scrollToBookingEngine();
    }
  };

  const routeSummary = useMemo(() => {
    if (activeService === 'airport') {
      const apt = airportParams.airport === 'HND' ? 'Haneda (HND)' : 'Narita (NRT)';
      const dest = airportParams.hotelAddress.trim() || (airportParams.direction === 'airport_to_hotel' ? 'Tokyo Downtown' : 'Airport');
      return `${apt} ➔ ${dest} • ${airportParams.passengers} Pax • ${airportParams.travelDate}`;
    }
    if (activeService === 'sightseeing') {
      return `Charter: ${sightseeingParams.destination === 'fuji-kawaguchiko' ? 'Mt. Fuji & Kawaguchiko' : sightseeingParams.destination} • ${sightseeingParams.passengers} Pax`;
    }
    return `Alpine Ski: ${skiParams.resort.toUpperCase()} • ${skiParams.passengers} Pax`;
  }, [activeService, airportParams, sightseeingParams, skiParams]);

  const vehicleSummary = useMemo(() => {
    if (activeService === 'airport') {
      return airportParams.passengers > 4
        ? 'Toyota HiAce Grand Cabin VIP (or 2× Alphard Convoy)'
        : 'Toyota Alphard VIP Executive Lounge';
    }
    return undefined;
  }, [activeService, airportParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090E] text-[#1A1A1A] dark:text-[#F1F5F9] transition-colors duration-200">
      <SiteHeader
        activeService={activeService}
        onSelectService={(srv) => {
          setActiveService(srv);
        }}
      />
      <main className="pt-20 sm:pt-24 pb-16">
        {rehydratedBooking && !isRehydratedModalOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-300">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  {lang === 'ja'
                    ? `確定済みの予約: ${rehydratedBooking.bookingRef} (決済完了・運行保証)`
                    : lang === 'zh'
                    ? `当前已确认预约: ${rehydratedBooking.bookingRef} (已支付·席位保障)`
                    : `Active Confirmed Booking: ${rehydratedBooking.bookingRef} (Paid & Guaranteed)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRehydratedModalOpen(true)}
                  className="bg-emerald-500 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  View Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        <StepProgressBar
          currentStep={currentStep}
          activeService={activeService}
          routeSummary={hasSearched ? routeSummary : undefined}
          vehicleSummary={vehicleSummary}
          onStepClick={handleStepClick}
        />

        <TripSearchTab
          activeService={activeService}
          onServiceChange={(service) => {
            setActiveService(service);
          }}
          onSearchAirport={handleAirportSearch}
          onSearchSightseeing={handleSightseeingSearch}
          onSearchSki={handleSkiSearch}
          hasSearched={hasSearched}
        />

        {hasSearched && (
          <section id="booking-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24 animate-fade-in">
            <div className="transition-opacity duration-200">
              {activeService === 'airport' && (
                <AirportTransferModule
                  key={`airport-${airportParams.airport}-${airportParams.direction}-${airportParams.travelDate}-${airportParams.passengers}-${airportParams.luggage}-${airportParams.hotelAddress}`}
                  initialAirport={airportParams.airport}
                  initialDirection={airportParams.direction}
                  initialDate={airportParams.travelDate}
                  initialPassengers={airportParams.passengers}
                  initialLuggage={airportParams.luggage}
                  initialHotelAddress={airportParams.hotelAddress}
                  onStageChange={(stage) => setCurrentStep(stage === 'details' ? 3 : 2)}
                  onEditSearch={() => handleStepClick(1)}
                />
              )}

              {activeService === 'sightseeing' && (
                <DayTourBookingModule
                  key={`sightseeing-${sightseeingParams.destination}-${sightseeingParams.travelDate}-${sightseeingParams.passengers}-${sightseeingParams.pickupHotel}`}
                  initialDestination={sightseeingParams.destination}
                  initialDate={sightseeingParams.travelDate}
                  initialPassengers={sightseeingParams.passengers}
                  initialPickupHotel={sightseeingParams.pickupHotel}
                />
              )}

              {activeService === 'ski' && (
                <SkiTransferBookingModule
                  key={`ski-${skiParams.resort}-${skiParams.pickupPoint}-${skiParams.travelDate}-${skiParams.passengers}-${skiParams.skiGearCount}`}
                  initialResort={skiParams.resort}
                  initialPickup={skiParams.pickupPoint}
                  initialDate={skiParams.travelDate}
                  initialPassengers={skiParams.passengers}
                  initialSkiGearCount={skiParams.skiGearCount}
                />
              )}
            </div>
          </section>
        )}
      </main>

      {rehydratedBooking && (
        <BookingConfirmationModal
          isOpen={isRehydratedModalOpen}
          onClose={() => setIsRehydratedModalOpen(false)}
          bookingRef={rehydratedBooking.bookingRef}
          paymentIntentId={rehydratedBooking.paymentIntentId}
          bookingDetails={rehydratedBooking.bookingDetails}
        />
      )}

      <SiteFooter />
    </div>
  );
}

