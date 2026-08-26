'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plane, Navigation, Clock, ShieldCheck, MapPin, Sparkles, CheckCircle2, Car, Loader2 } from 'lucide-react';
import { Airport } from '@/lib/airport-pricing';
import { useLanguage } from '@/context/LanguageContext';

interface AirportRouteVisualizerProps {
  selectedAirport: Airport;
  direction?: 'airport_to_hotel' | 'hotel_to_airport';
  hotelAddress?: string;
  className?: string;
}

const AIRPORT_CORRIDORS: Record<Airport, {
  name: string;
  shortName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationText: string;
  expressway: string;
  center: { lat: number; lng: number };
  zoom: number;
  waypoints: [number, number][]; // [lat, lng]
  corridorHighlights: string[];
}> = {
  HND: {
    name: 'Tokyo Haneda International Airport (HND)',
    shortName: 'Haneda Airport (HND)',
    origin: 'Tokyo Station, Japan',
    destination: 'Haneda Airport Terminal 3, Tokyo, Japan',
    distanceKm: 22,
    durationText: '25–35 Min',
    expressway: 'Shuto Expressway (Wangan Line & Route 1 Haneda)',
    center: { lat: 35.615, lng: 139.775 },
    zoom: 12,
    waypoints: [
      [35.6812, 139.7671], // Tokyo Station / Central
      [35.6695, 139.7640], // Ginza
      [35.6420, 139.7580], // Shibaura
      [35.6366, 139.7631], // Rainbow Bridge / Daiba
      [35.6080, 139.7550], // Oi Junction
      [35.5780, 139.7620], // Heiwajima
      [35.5494, 139.7798], // Haneda Airport Terminal 3
    ],
    corridorHighlights: ['Rainbow Bridge View', 'Shuto Wangan Line', 'Oi Junction Bypass', 'Terminal 2/3 VIP Curbside'],
  },
  NRT: {
    name: 'Tokyo Narita International Airport (NRT)',
    shortName: 'Narita Airport (NRT)',
    origin: 'Tokyo Station, Japan',
    destination: 'Narita International Airport Terminal 1, Chiba, Japan',
    distanceKm: 74,
    durationText: '60–75 Min',
    expressway: 'Higashi-Kanto & Shin-Kuko Expressway',
    center: { lat: 35.720, lng: 140.080 },
    zoom: 10,
    waypoints: [
      [35.6812, 139.7671], // Tokyo Station
      [35.6960, 139.8150], // Kinshicho / Shuto Route 7
      [35.7136, 139.9142], // Ichikawa / Keiyo Road
      [35.6850, 140.0120], // Wangan Ichikawa / Higashi-Kanto
      [35.6548, 140.1022], // Chiba North
      [35.7020, 140.1850], // Yotsukaido
      [35.7483, 140.2642], // Shisui Service Area
      [35.7720, 140.3550], // Narita IC
      [35.7647, 140.3863], // Narita Airport Terminal 1/2
    ],
    corridorHighlights: ['Higashi-Kanto Highway', 'Makuhari Bay Area', 'Shisui Rest Area', 'Shin-Kuko Direct Corridor'],
  },
};

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

export default function AirportRouteVisualizer({
  selectedAirport,
  direction = 'airport_to_hotel',
  hotelAddress,
  className = '',
}: AirportRouteVisualizerProps) {
  const [lang] = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  const corridor = AIRPORT_CORRIDORS[selectedAirport] || AIRPORT_CORRIDORS.HND;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDyTxeXVlq-XczoSF_69hYX39xq-CVDDuE';

  useEffect(() => {
    let isCancelled = false;

    if (!mapContainerRef.current) return;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (isCancelled || !mapContainerRef.current || !window.google?.maps) return;

        // Initialize Map
        if (!mapInstanceRef.current) {
          const map = new window.google.maps.Map(mapContainerRef.current, {
            zoom: corridor.zoom,
            center: corridor.center,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            gestureHandling: 'cooperative',
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
              { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
              { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
              { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
            ],
          });
          mapInstanceRef.current = map;
        }

        // Initialize Directions Renderer
        if (!directionsRendererRef.current) {
          const renderer = new window.google.maps.DirectionsRenderer({
            map: mapInstanceRef.current,
            polylineOptions: {
              strokeColor: '#C5A059',
              strokeWeight: 6,
              strokeOpacity: 0.95,
            },
          });
          directionsRendererRef.current = renderer;
        }

        // Request route from DirectionsService
        const directionsService = new window.google.maps.DirectionsService();
        const originQuery = direction === 'airport_to_hotel' ? corridor.destination : (hotelAddress && hotelAddress.length > 3 ? `${hotelAddress}, Tokyo, Japan` : corridor.origin);
        const destinationQuery = direction === 'airport_to_hotel' ? (hotelAddress && hotelAddress.length > 3 ? `${hotelAddress}, Tokyo, Japan` : corridor.origin) : corridor.destination;

        directionsService.route(
          {
            origin: originQuery,
            destination: destinationQuery,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (isCancelled) return;
            if (status === 'OK' && result) {
              directionsRendererRef.current.setDirections(result);
            } else {
              // Fallback: draw pre-computed polyline directly
              const pathCoords = corridor.waypoints.map(([lat, lng]) => ({ lat, lng }));
              const polyline = new window.google.maps.Polyline({
                path: pathCoords,
                geodesic: true,
                strokeColor: '#C5A059',
                strokeOpacity: 0.95,
                strokeWeight: 6,
              });
              polyline.setMap(mapInstanceRef.current);

              const bounds = new window.google.maps.LatLngBounds();
              pathCoords.forEach((pt) => bounds.extend(pt));
              mapInstanceRef.current.fitBounds(bounds);
            }
          }
        );
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Airport route map error:', err);
          setUseIframeFallback(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedAirport, direction, hotelAddress, corridor, apiKey]);

  const fallbackEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selectedAirport === 'HND' ? 'Haneda Airport Terminal 3 Tokyo' : 'Narita International Airport Terminal 1 Chiba'
  )}&t=&z=${selectedAirport === 'HND' ? '12' : '10'}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 ${className}`}>
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F2F5] dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8C6D3F] dark:text-[#E5C378] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
            <Navigation className="w-3 h-3" />
            <span>Expressway Route Corridor</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white">
            {corridor.shortName} ⇄ Tokyo Downtown
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E5E8ED] dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs shrink-0">
          <div>
            <span className="text-[9px] text-[#9CA3AF] uppercase font-bold block">Estimated Drive</span>
            <span className="font-extrabold text-[#00B37E] font-mono text-sm">{corridor.durationText}</span>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <span className="text-[9px] text-[#9CA3AF] uppercase font-bold block">Distance</span>
            <span className="font-extrabold text-[#1A1A1A] dark:text-white font-mono text-sm">~{corridor.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Interactive Map & Route Canvas */}
      <div className="relative aspect-[16/9] w-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner bg-[#080B11] border border-[#E5E8ED] dark:border-slate-800">
        
        {/* Real-time Google Vector Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

        {/* Fallback Interactive Iframe if script is blocked */}
        {useIframeFallback && (
          <iframe
            title={`Map of ${corridor.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={fallbackEmbedUrl}
            className="w-full h-full grayscale-[15%] contrast-[1.05] dark:invert-[90%] dark:hue-rotate-180"
          />
        )}

        {/* Top Destination Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow z-10">
          <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{corridor.shortName} (~{corridor.distanceKm} km)</span>
        </div>

        {/* Expressway Highway Badge */}
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md border border-[#C5A059]/40 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow z-10">
          <Car className="w-3.5 h-3.5 text-[#E5C378]" />
          <span className="text-slate-200">{corridor.expressway}</span>
        </div>
      </div>

      {/* Highlights & Guarantees Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {corridor.corridorHighlights.map((highlight, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 bg-[#FAF8F4] dark:bg-[#161f30] border border-[#E8E2D8] dark:border-slate-700/80 p-2.5 rounded-xl text-[11px] text-[#4B5563] dark:text-slate-300 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00B37E] shrink-0" />
            <span className="truncate">{highlight}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
