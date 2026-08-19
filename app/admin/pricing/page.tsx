'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Shield,
  Cloud,
  Globe,
  Sliders
} from 'lucide-react';
import {
  PricingConfig,
  PICKUP_LOCATIONS,
  DESTINATION_LOCATIONS,
  getStoredPricingConfig,
  savePricingConfigToCloud,
  resetPricingConfig,
  calculateQuote,
  QuoteInputs,
  subscribeToPricingConfig,
} from '@/lib/pricing-store';

export default function PricingAdminPage() {
  const [config, setConfig] = useState<PricingConfig>(getStoredPricingConfig());
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedPickup, setSelectedPickup] = useState('hnd');
  const [selectedDest, setSelectedDest] = useState('hakuba');

  // Simulator
  const [simInputs, setSimInputs] = useState<QuoteInputs>({
    pickupId: 'hnd',
    destinationId: 'hakuba',
    transferType: 'one_way',
    passengers: 4,
    luggageCount: 4,
    skiBagCount: 2,
  });

  useEffect(() => {
    const unsubscribe = subscribeToPricingConfig((newConfig) => {
      setConfig(newConfig);
    });
    return () => unsubscribe();
  }, []);

  const handleBaseRateChange = (vehicleKey: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      vehicleBaseRates: {
        ...prev.vehicleBaseRates,
        [vehicleKey]: value,
      },
    }));
    setIsSaved(false);
  };

  const handleRoutePriceChange = (
    pickupId: string,
    destId: string,
    field: 'granacePrice' | 'hiacePrice' | 'tollEstimate' | 'fuelEstimate',
    value: number
  ) => {
    const routeKey = `${pickupId}_${destId}`;
    setConfig((prev) => {
      const existing = prev.routePrices[routeKey] || {
        pickupId,
        destinationId: destId,
        granacePrice: 120000,
        hiacePrice: 110000,
        tollEstimate: 12000,
        fuelEstimate: 8000,
      };
      return {
        ...prev,
        routePrices: {
          ...prev.routePrices,
          [routeKey]: {
            ...existing,
            [field]: value,
          },
        },
      };
    });
    setIsSaved(false);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    await savePricingConfigToCloud(config);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all prices to SK Limo factory default rates?')) {
      resetPricingConfig();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const simResult = calculateQuote(config, simInputs);
  const routeKey = `${selectedPickup}_${selectedDest}`;
  const currentRouteData = config.routePrices[routeKey] || {
    granacePrice: config.vehicleBaseRates['granace'] || 120000,
    hiacePrice: config.vehicleBaseRates['hiace'] || 110000,
    tollEstimate: 13000,
    fuelEstimate: 9000,
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 font-sans pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0D131F]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              SK
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">SK Limo Price Admin</h1>
              <p className="text-[10px] text-amber-400 font-mono">Firebase Cloud Sync Enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Published!
              </span>
            )}
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <Cloud className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Publish Rates'}
            </button>
            <Link
              href="/tours/winter"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1"
            >
              Site <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-xs">
        
        {/* Mobile Admin Alert Banner */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-slate-300">
          <div>
            <p className="font-bold text-amber-400 text-xs">On-The-Go Mobile Price Editor</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Updates published here instantly alter prices on live customer quote widgets via Firebase.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2.5 py-1 rounded"
          >
            Reset Defaults
          </button>
        </div>

        {/* 1. Base Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" /> Vehicle Baseline Flat Rates (JPY)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white">Toyota Granace Executive</span>
              <p className="text-[10px] text-slate-400">Max 5 Pax / Baseline Rate</p>
              <input
                type="number"
                step="1000"
                value={config.vehicleBaseRates['granace'] || 120000}
                onChange={(e) => handleBaseRateChange('granace', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-sm font-bold mt-1"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white">Toyota HiAce Grand Van</span>
              <p className="text-[10px] text-slate-400">Max 9 Pax / Baseline Rate</p>
              <input
                type="number"
                step="1000"
                value={config.vehicleBaseRates['hiace'] || 110000}
                onChange={(e) => handleBaseRateChange('hiace', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-sm font-bold mt-1"
              />
            </div>
          </div>
        </div>

        {/* 2. Route Matrix Overrides */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" /> Route Specific Rate Editor
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl">
            <div>
              <label className="text-[10px] text-slate-400 font-medium">Origin</label>
              <select
                value={selectedPickup}
                onChange={(e) => setSelectedPickup(e.target.value)}
                className="w-full mt-0.5 bg-slate-900 border border-slate-700 rounded p-2 text-white"
              >
                {PICKUP_LOCATIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.code}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-medium">Destination</label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full mt-0.5 bg-slate-900 border border-slate-700 rounded p-2 text-white"
              >
                {DESTINATION_LOCATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-slate-400">Granace Route Rate (JPY)</label>
              <input
                type="number"
                step="1000"
                value={currentRouteData.granacePrice}
                onChange={(e) =>
                  handleRoutePriceChange(selectedPickup, selectedDest, 'granacePrice', parseInt(e.target.value) || 0)
                }
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400">HiAce Route Rate (JPY)</label>
              <input
                type="number"
                step="1000"
                value={currentRouteData.hiacePrice}
                onChange={(e) =>
                  handleRoutePriceChange(selectedPickup, selectedDest, 'hiacePrice', parseInt(e.target.value) || 0)
                }
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Live Quote Simulator */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Live Calculation Preview
          </h3>

          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="text-slate-400">Calculated Vehicle:</span>
            <span className="text-white font-bold">{simResult.recommendedVehicleName}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-slate-300 font-semibold">Total Price Output:</span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {simResult.formattedTotalPrice}
            </span>
          </div>

          <button
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" /> Save &amp; Publish Rates Live to Cloud
          </button>
        </div>

      </main>
    </div>
  );
}
