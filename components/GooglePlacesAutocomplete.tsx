'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapPin, Check, Building2, ChevronRight } from 'lucide-react';
import { searchTokyoPlaces, TokyoPlace } from '@/lib/tokyo-places';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onPlaceSelect?: (place: { name: string; formatted_address: string; lat?: number; lng?: number }) => void;
}

declare global {
  interface Window {
    google?: any;
    __googleMapsLoading?: Promise<void>;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  if (window.__googleMapsLoading) {
    return window.__googleMapsLoading;
  }

  window.__googleMapsLoading = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en&region=JP`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return window.__googleMapsLoading;
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = 'Search hotel, airport, or address in Tokyo...',
  className = '',
  onPlaceSelect,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Local Zero-API Instant Matches
  const localMatches = useMemo(() => {
    if (!value || value.length < 2) return [];
    return searchTokyoPlaces(value, 5);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        setIsScriptLoaded(true);
        if (!inputRef.current || !window.google?.maps?.places) return;

        // Initialize Google Places Autocomplete
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'jp' },
          fields: ['name', 'formatted_address', 'geometry', 'place_id'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place) return;

          const chosenAddress = place.name || place.formatted_address || '';
          onChange(chosenAddress);
          setShowDropdown(false);

          if (onPlaceSelect) {
            onPlaceSelect({
              name: place.name || '',
              formatted_address: place.formatted_address || '',
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
            });
          }
        });

        autocompleteRef.current = autocomplete;
      })
      .catch((err) => {
        console.warn('Google Maps Places Autocomplete load error:', err);
      });
  }, [apiKey, onChange, onPlaceSelect]);

  const handleSelectLocalPlace = (place: TokyoPlace) => {
    onChange(`${place.nameEn} (${place.district})`);
    setShowDropdown(false);
    if (onPlaceSelect) {
      onPlaceSelect({
        name: place.nameEn,
        formatted_address: place.formattedAddress,
      });
    }
  };

  const POPULAR_DESTINATIONS = [
    'Grand Hyatt Tokyo (Roppongi)',
    'Aman Tokyo (Otemachi)',
    'The Ritz-Carlton Tokyo',
    'Palace Hotel Tokyo',
    'Shinjuku',
    'Ginza',
  ];

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (value.length >= 2) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-9 pr-8 h-11 bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-700 rounded-xl text-xs text-[#1A1A1A] dark:text-white font-medium focus:outline-none focus:border-[#C5A059] transition-colors ${className}`}
        />
        {isScriptLoaded && (
          <span
            title="Google Places Verified Live Search"
            className="absolute right-2.5 flex items-center text-[10px] text-emerald-500 font-bold"
          >
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Instant Local Suggestions Dropdown (Zero Google API Quota Consumed) */}
      {showDropdown && localMatches.length > 0 && (
        <div className="absolute top-11 left-0 right-0 z-30 mt-1 bg-white dark:bg-[#0D121F] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in-50 duration-150">
          <div className="px-3.5 py-1 text-[10px] uppercase font-mono tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
            Suggested Tokyo Destinations
          </div>
          {localMatches.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => handleSelectLocalPlace(place)}
              className="w-full px-3.5 py-2.5 text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 dark:text-white block truncate">
                    {place.nameEn}
                    <span className="text-[11px] font-normal text-stone-500 ml-1.5 font-sans">
                      {place.nameJa}
                    </span>
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                    {place.district} • {place.formattedAddress}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}

      {/* Zero-API-Cost Quick Destination Chips */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10px] text-stone-400 font-mono">Quick:</span>
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            type="button"
            onClick={() => {
              onChange(dest);
              setShowDropdown(false);
            }}
            className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              value === dest
                ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] font-bold'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-400'
            }`}
          >
            {dest.split(' (')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
