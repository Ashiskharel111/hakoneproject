'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Navigation, Sparkles } from 'lucide-react';

interface GoogleRouteMapProps {
  origin: string;
  destination: string;
  destinationName: string;
  fallbackQuery?: string;
  className?: string;
  onRouteCalculated?: (distanceKm: number, durationText: string) => void;
}

declare global {
  interface Window {
    google?: any;
    __googleMapsLoading?: Promise<void>;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google && window.google.maps && window.google.maps.DirectionsService) {
    return Promise.resolve();
  }
  if (window.__googleMapsLoading) {
    return window.__googleMapsLoading;
  }

  window.__googleMapsLoading = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      if (window.google?.maps?.DirectionsService) {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (e) => reject(e));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=en&region=JP`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return window.__googleMapsLoading;
}

export default function GoogleRouteMap({
  origin,
  destination,
  destinationName,
  fallbackQuery,
  className = '',
  onRouteCalculated,
}: GoogleRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [hasDirectionsError, setHasDirectionsError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setHasDirectionsError(false);

    if (!apiKey) {
      setIsLoading(false);
      setHasDirectionsError(true);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (isCancelled || !mapContainerRef.current || !window.google?.maps) return;

        // Initialize Map instance if not created
        if (!mapInstanceRef.current) {
          const map = new window.google.maps.Map(mapContainerRef.current, {
            zoom: 10,
            center: { lat: 35.6762, lng: 139.6503 }, // Tokyo center
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: 'cooperative',
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }],
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }],
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }],
              },
            ],
          });
          mapInstanceRef.current = map;
        }

        // Initialize Directions Renderer with custom styling
        if (!directionsRendererRef.current) {
          const renderer = new window.google.maps.DirectionsRenderer({
            map: mapInstanceRef.current,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#C5A059',
              strokeWeight: 6,
              strokeOpacity: 0.95,
            },
          });
          directionsRendererRef.current = renderer;
        }

        const directionsService = new window.google.maps.DirectionsService();

        // Standardize origin/destination string with Japan context for reliable geocoding
        const queryOrigin = origin.toLowerCase().includes('japan') || origin.toLowerCase().includes('tokyo') ? origin : `${origin}, Tokyo, Japan`;
        const queryDestination = destination.toLowerCase().includes('japan') ? destination : `${destination}, Japan`;

        directionsService.route(
          {
            origin: queryOrigin,
            destination: queryDestination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (isCancelled) return;
            setIsLoading(false);

            if (status === 'OK' && result) {
              directionsRendererRef.current.setDirections(result);
              const leg = result.routes[0]?.legs[0];
              if (leg) {
                const dist = leg.distance?.text || '';
                const dur = leg.duration?.text || '';
                setRouteInfo({ distance: dist, duration: dur });

                if (onRouteCalculated && leg.distance?.value) {
                  onRouteCalculated(Math.round(leg.distance.value / 1000), dur);
                }
              }
            } else {
              console.warn('Google Maps Directions status:', status);
              setHasDirectionsError(true);
            }
          }
        );
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Google Maps load error:', err);
          setIsLoading(false);
          setHasDirectionsError(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [apiKey, origin, destination, onRouteCalculated]);

  return (
    <div className={`relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-[#E5E8ED] dark:border-slate-800 shadow-inner bg-[#080B11] ${className}`}>
      {/* Real-time Google Maps Interactive Route Viewport */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[320px]" />

      {/* Fallback iframe if Directions API is unavailable */}
      {hasDirectionsError && (
        <iframe
          title={`Route to ${destinationName}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent((fallbackQuery || destination) + ' Japan')}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
          className="absolute inset-0 w-full h-full grayscale-[15%] contrast-[1.05] dark:invert-[90%] dark:hue-rotate-180"
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#080B11]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white z-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" />
          <span className="text-xs font-semibold text-slate-300">Calculating Driving Route...</span>
        </div>
      )}

      {/* Real-time Route Driving Badge Overlay */}
      {routeInfo && !isLoading && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-black/85 backdrop-blur-md border border-[#C5A059]/40 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between sm:justify-start gap-4 shadow-xl z-10">
          <div className="flex items-center gap-1.5 text-[#E5C378]">
            <Navigation className="w-3.5 h-3.5" />
            <span>Driving Route</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-white">{routeInfo.distance}</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#38BDF8]">{routeInfo.duration}</span>
          </div>
        </div>
      )}

      {/* Destination Tag */}
      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow z-10">
        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>{destinationName}</span>
      </div>
    </div>
  );
}
