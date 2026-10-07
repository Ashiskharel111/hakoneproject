'use client';

import React from 'react';
import { Check, MapPin, Car, Plane, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface StepProgressBarProps {
  currentStep: 1 | 2 | 3 | 4;
  activeService: 'airport' | 'sightseeing' | 'ski';
  routeSummary?: string;
  vehicleSummary?: string;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

export default function StepProgressBar({
  currentStep,
  activeService,
  routeSummary,
  vehicleSummary,
  onStepClick,
}: StepProgressBarProps) {
  const [lang] = useLanguage();

  const labels = {
    step1: {
      en: 'Route & Schedule',
      ja: '日程・区間設定',
      zh: '路线与时间',
      fr: 'Itinéraire & Date',
      es: 'Ruta y Fecha',
    }[lang],
    step2: {
      en: 'Choose Vehicle',
      ja: '車両クラス選択',
      zh: '选择专属车型',
      fr: 'Choisir le Véhicule',
      es: 'Elegir Vehículo',
    }[lang],
    step3: {
      en: activeService === 'airport' ? 'Flight & Passenger' : 'Passenger & Pickup',
      ja: activeService === 'airport' ? 'フライト・乗車情報' : 'お客様情報・集合場所',
      zh: activeService === 'airport' ? '航班与乘客信息' : '乘客与上车信息',
      fr: activeService === 'airport' ? 'Vol & Passagers' : 'Passagers & Prise en charge',
      es: activeService === 'airport' ? 'Vuelo y Pasajeros' : 'Pasajeros y Recogida',
    }[lang],
    step4: {
      en: 'Secure Checkout',
      ja: '安全決済・確定',
      zh: '安全支付与确认',
      fr: 'Paiement Sécurisé',
      es: 'Pago Seguro',
    }[lang],
    edit: {
      en: 'Edit',
      ja: '変更',
      zh: '修改',
      fr: 'Modifier',
      es: 'Modificar',
    }[lang],
    stepOf: {
      en: 'Step',
      ja: 'ステップ',
      zh: '步骤',
      fr: 'Étape',
      es: 'Paso',
    }[lang],
    of: {
      en: 'of',
      ja: '/',
      zh: '/',
      fr: 'sur',
      es: 'de',
    }[lang],
  };

  const steps = [
    {
      num: 1,
      title: labels.step1,
      icon: MapPin,
      subtitle: routeSummary || 'Route & Schedule',
    },
    {
      num: 2,
      title: labels.step2,
      icon: Car,
      subtitle: vehicleSummary || (currentStep >= 2 ? 'Select Alphard / HiAce' : 'Pending Route'),
    },
    {
      num: 3,
      title: labels.step3,
      icon: Plane,
      subtitle: currentStep >= 3 ? 'Live Flight Radar & Contact' : 'Pending Vehicle',
    },
    {
      num: 4,
      title: labels.step4,
      icon: ShieldCheck,
      subtitle: 'Stripe 256-bit Encrypted',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      {/* ── Desktop Step Bar ── */}
      <div className="hidden md:block bg-white dark:bg-[#0A0D14] border border-stone-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isActive = currentStep === step.num;
            const isClickable = isCompleted && onStepClick;
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                onClick={() => {
                  if (isClickable) {
                    onStepClick(step.num as 1 | 2 | 3);
                  }
                }}
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isClickable ? 'cursor-pointer hover:bg-stone-50 dark:hover:bg-white/[0.04]' : ''
                } ${
                  isActive
                    ? 'bg-[#C5A059]/10 border border-[#C5A059]/40 ring-1 ring-[#C5A059]/20'
                    : isCompleted
                    ? 'bg-stone-50/70 dark:bg-white/[0.02] border border-stone-200/60 dark:border-white/[0.05]'
                    : 'opacity-50 border border-transparent'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isActive
                      ? 'bg-[#C5A059] text-stone-950 shadow-md shadow-[#C5A059]/30 ring-2 ring-[#C5A059]/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.num}
                </div>

                {/* Step Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                        isActive
                          ? 'text-[#C5A059]'
                          : isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-stone-400'
                      }`}
                    >
                      {labels.stepOf} {step.num} {labels.of} 4
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] text-[#C5A059] underline font-medium ml-auto">
                        {labels.edit}
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-xs font-bold truncate ${
                      isActive
                        ? 'text-stone-950 dark:text-white'
                        : isCompleted
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {step.subtitle}
                  </p>
                </div>

                {/* Connector Arrow */}
                {idx < 3 && (
                  <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 hidden lg:block text-stone-300 dark:text-stone-700">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Compact Progress Header ── */}
      <div className="md:hidden bg-white dark:bg-[#0A0D14] border border-stone-200 dark:border-white/[0.08] rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-stone-950 font-black text-[11px] font-mono">
              {labels.stepOf} {currentStep} {labels.of} 4
            </span>
            <span className="text-xs font-bold text-stone-900 dark:text-white">
              {steps[currentStep - 1]?.title}
            </span>
          </div>

          {currentStep > 1 && onStepClick && (
            <button
              type="button"
              onClick={() => onStepClick(1)}
              className="text-[11px] font-semibold text-[#C5A059] hover:underline cursor-pointer"
            >
              {labels.edit}
            </button>
          )}
        </div>

        {/* 4 Segment Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 rounded-full transition-all ${
                currentStep >= stepNum
                  ? 'bg-[#C5A059]'
                  : 'bg-stone-200 dark:bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        {/* Current Context Pill */}
        <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between truncate pt-0.5">
          <span className="truncate">
            {currentStep === 1 && (routeSummary || 'Select your route, dates & passengers')}
            {currentStep === 2 && (vehicleSummary || 'Choose Alphard VIP or HiAce Grand Cabin')}
            {currentStep === 3 && 'Enter flight number for 90-min free tracking'}
            {currentStep === 4 && 'Review details & complete payment'}
          </span>
        </div>
      </div>
    </div>
  );
}
