'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';

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
  placeholder = 'Search hotel, airport, or address in Japan...',
  className = '',
  onPlaceSelect,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

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

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-[#8C6D3F] dark:text-[#C5A059] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
    </div>
  );
}
