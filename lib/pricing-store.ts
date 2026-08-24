import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface PickupLocation {
  id: string;
  name: string;
  nameJa: string;
  code: string;
  type: 'airport' | 'city';
}

export interface DestinationLocation {
  id: string;
  name: string;
  nameJa: string;
  region: string;
  distanceKm: number;
}

export interface SurchargesConfig {
  extraSuitcaseFee: number;
  extraSkiBagFee: number;
  lateNightFee: number;
  roundTripDiscountPercent: number;
  peakSeasonMultiplier: number;
}

export interface RoutePriceOverride {
  pickupId: string;
  destinationId: string;
  granacePrice: number;
  hiacePrice: number;
  tollEstimate: number;
  fuelEstimate: number;
}

export interface PricingConfig {
  vehicleBaseRates: Record<string, number>;
  surcharges: SurchargesConfig;
  routePrices: Record<string, RoutePriceOverride>;
  lastUpdated?: string;
}

export const PICKUP_LOCATIONS: PickupLocation[] = [
  { id: 'hnd', name: 'Haneda Airport', nameJa: '羽田空港', code: 'HND', type: 'airport' },
  { id: 'nrt', name: 'Narita Airport', nameJa: '成田空港', code: 'NRT', type: 'airport' },
  { id: 'tokyo_hotel', name: 'Central Tokyo Hotel / Residence', nameJa: '東京都内各ホテル・ご自宅', code: 'TYO', type: 'city' },
];

export const DESTINATION_LOCATIONS: DestinationLocation[] = [
  { id: 'hakuba', name: 'Hakuba Valley', nameJa: '白馬エリア', region: 'Nagano', distanceKm: 280 },
  { id: 'nozawa', name: 'Nozawa Onsen', nameJa: '野沢温泉', region: 'Nagano', distanceKm: 260 },
  { id: 'shiga_kogen', name: 'Shiga Kogen', nameJa: '志賀高原', region: 'Nagano', distanceKm: 270 },
  { id: 'myoko', name: 'Myoko Kogen', nameJa: '妙高高原', region: 'Niigata', distanceKm: 270 },
  { id: 'madarao', name: 'Madarao Mountain', nameJa: '斑尾高原', region: 'Nagano', distanceKm: 250 },
  { id: 'karuizawa', name: 'Karuizawa', nameJa: '軽井沢', region: 'Nagano', distanceKm: 170 },
  { id: 'tokyo_hotel', name: 'Tokyo Hotel / Residence', nameJa: '東京都内ホテル・ご自宅', region: 'Tokyo', distanceKm: 70 },
  { id: 'fuji', name: 'Mt. Fuji & Kawaguchi', nameJa: '富士山・河口湖', region: 'Yamanashi', distanceKm: 120 },
];

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  vehicleBaseRates: {
    alphard: 150000,
    granace: 150000,
    hiace: 130000,
    crown: 120000,
  },
  surcharges: {
    extraSuitcaseFee: 0,
    extraSkiBagFee: 0,
    lateNightFee: 10000,
    roundTripDiscountPercent: 5,
    peakSeasonMultiplier: 1.0,
  },
  routePrices: {
    'hnd_hakuba': { pickupId: 'hnd', destinationId: 'hakuba', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 14800, fuelEstimate: 9500 },
    'nrt_hakuba': { pickupId: 'nrt', destinationId: 'hakuba', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 17500, fuelEstimate: 11200 },
    'tokyo_hotel_hakuba': { pickupId: 'tokyo_hotel', destinationId: 'hakuba', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 13900, fuelEstimate: 8900 },
    
    'hnd_nozawa': { pickupId: 'hnd', destinationId: 'nozawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 13200, fuelEstimate: 8800 },
    'nrt_nozawa': { pickupId: 'nrt', destinationId: 'nozawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 16100, fuelEstimate: 10500 },
    'tokyo_hotel_nozawa': { pickupId: 'tokyo_hotel', destinationId: 'nozawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 12500, fuelEstimate: 8200 },

    'hnd_shiga_kogen': { pickupId: 'hnd', destinationId: 'shiga_kogen', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 13500, fuelEstimate: 9000 },
    'nrt_shiga_kogen': { pickupId: 'nrt', destinationId: 'shiga_kogen', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 16400, fuelEstimate: 10800 },
    'tokyo_hotel_shiga_kogen': { pickupId: 'tokyo_hotel', destinationId: 'shiga_kogen', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 12800, fuelEstimate: 8500 },

    'hnd_madarao': { pickupId: 'hnd', destinationId: 'madarao', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 12900, fuelEstimate: 8500 },
    'nrt_madarao': { pickupId: 'nrt', destinationId: 'madarao', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 15800, fuelEstimate: 10200 },
    'tokyo_hotel_madarao': { pickupId: 'tokyo_hotel', destinationId: 'madarao', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 12200, fuelEstimate: 8000 },

    'hnd_myoko': { pickupId: 'hnd', destinationId: 'myoko', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 14200, fuelEstimate: 9200 },
    'nrt_myoko': { pickupId: 'nrt', destinationId: 'myoko', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 17100, fuelEstimate: 11000 },
    'tokyo_hotel_myoko': { pickupId: 'tokyo_hotel', destinationId: 'myoko', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 13500, fuelEstimate: 8600 },

    'hnd_karuizawa': { pickupId: 'hnd', destinationId: 'karuizawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 8500, fuelEstimate: 5200 },
    'nrt_karuizawa': { pickupId: 'nrt', destinationId: 'karuizawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 11200, fuelEstimate: 6900 },
    'tokyo_hotel_karuizawa': { pickupId: 'tokyo_hotel', destinationId: 'karuizawa', granacePrice: 150000, hiacePrice: 130000, tollEstimate: 7800, fuelEstimate: 4800 },
  },
};

export interface QuoteInputs {
  pickupId: string;
  destinationId: string;
  transferType: 'one_way' | 'round_trip';
  passengers: number;
  luggageCount: number;
  skiBagCount: number;
  vehiclePreference?: 'alphard' | 'granace' | 'hiace';
  addSecondVehicle?: boolean;
  isLateNight?: boolean;
}

export interface QuoteCalculationResult {
  recommendedVehicle: 'alphard' | 'granace' | 'hiace';
  recommendedVehicleName: string;
  recommendedVehicleNameJa: string;
  recommendedVehicleTagline: string;
  recommendedVehicleTaglineJa: string;
  maxPassengers: number;
  maxSuitcases: number;
  maxSkiBags: number;
  isExceeded: boolean;
  secondVehicleSurcharge: number;
  vehicleImage: string;
  baseRate: number;
  extraPaxSurcharge: number;
  routeAdjustment: number;
  luggageSurcharge: number;
  skiBagSurcharge: number;
  lateNightSurcharge: number;
  roundTripDiscount: number;
  tollEstimate: number;
  fuelEstimate: number;
  subtotalOneWay: number;
  finalTotalPrice: number;
  formattedTotalPrice: string;
  whatsAppMessage: string;
}

export function getStoredPricingConfig(): PricingConfig {
  if (typeof window === 'undefined') return DEFAULT_PRICING_CONFIG;
  try {
    const item = localStorage.getItem('sklimo_pricing_config');
    return item ? JSON.parse(item) : DEFAULT_PRICING_CONFIG;
  } catch (e) {
    return DEFAULT_PRICING_CONFIG;
  }
}

export async function savePricingConfigToCloud(config: PricingConfig): Promise<boolean> {
  const updatedConfig = {
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sklimo_pricing_config', JSON.stringify(updatedConfig));
      window.dispatchEvent(new Event('sklimo_pricing_updated'));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }

  if (db) {
    try {
      const docRef = doc(db, 'config', 'pricing');
      await setDoc(docRef, updatedConfig);
      return true;
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  }
  return true;
}

export function subscribeToPricingConfig(callback: (config: PricingConfig) => void): () => void {
  // First emit local value
  callback(getStoredPricingConfig());

  if (db) {
    try {
      const docRef = doc(db, 'config', 'pricing');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const cloudConfig = snapshot.data() as PricingConfig;
          if (typeof window !== 'undefined') {
            localStorage.setItem('sklimo_pricing_config', JSON.stringify(cloudConfig));
          }
          callback(cloudConfig);
        }
      }, (err) => {
        console.warn('Firestore snapshot error fallback:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore subscription error fallback:', e);
    }
  }

  // Fallback to window event listener
  const handleEvent = () => {
    callback(getStoredPricingConfig());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('sklimo_pricing_updated', handleEvent);
    return () => window.removeEventListener('sklimo_pricing_updated', handleEvent);
  }
  return () => {};
}

export function resetPricingConfig(): void {
  savePricingConfigToCloud(DEFAULT_PRICING_CONFIG);
}

export function calculateQuote(
  config: PricingConfig,
  inputs: QuoteInputs
): QuoteCalculationResult {
  // Use selected vehicle preference if provided, otherwise default to alphard
  let selectedVehicle: 'alphard' | 'granace' | 'hiace' = inputs.vehiclePreference || 'alphard';

  const isAlphard = selectedVehicle === 'alphard';
  const isGranace = selectedVehicle === 'granace';
  const isHiace = selectedVehicle === 'hiace';

  const vehicleName = isAlphard
    ? 'Toyota Alphard Executive Lounge (Max 4 Pax)'
    : isGranace
    ? 'Toyota Granace Executive (Max 5 Pax)'
    : 'Toyota HiAce Grand Van (Max 9 Pax)';

  const vehicleNameJa = isAlphard
    ? 'トヨタ アルファード エグゼクティブ（最大4名様）'
    : isGranace
    ? 'トヨタ グランエース エグゼクティブ（最大5名様）'
    : 'トヨタ ハイエース グランドキャビン（最大9名様）';

  const vehicleTagline = isAlphard
    ? 'VIP Ottoman Captain Chairs & Whisper Quiet Cabin'
    : isGranace
    ? 'VIP Ultra-Luxury Captain Chairs & Ambient Snow Cruiser'
    : 'Extended Capacity High-Roof Van for Groups & Ski Gear';

  const vehicleTaglineJa = isAlphard
    ? 'オットマン本革シート・極上の静粛性と快適性'
    : isGranace
    ? '本革本物のキャプテンシート・最上の移動空間'
    : '長尺スキー荷物と大人数もゆったり積載可能なハイルーフ型';

  const vehicleImage = isAlphard
    ? '/images/fleet-toyota-alphard-exterior-1477x1108.jpg'
    : isGranace
    ? '/images/fleet-toyota-granace-exterior-4032x3024.jpg'
    : '/images/fleet-toyota-hiace-exterior-1477x1108.jpg';

  const maxPassengers = isAlphard ? 4 : isGranace ? 5 : 9;
  const maxSuitcases = isAlphard ? 4 : isGranace ? 4 : 9;
  const maxSkiBags = isAlphard ? 3 : isGranace ? 4 : 8;

  const isExceeded = inputs.passengers > maxPassengers;

  // Fixed winter rate: Alphard & Granace = 150,000 | HiAce = 130,000
  const baseRate = isHiace ? 130000 : 150000;

  // Extra Passenger Fee: For HiAce, if passengers > 4, add ¥5,000 per person beyond 4
  const extraPaxSurcharge = isHiace && inputs.passengers > 4 ? (inputs.passengers - 4) * 5000 : 0;

  const routeKey = `${inputs.pickupId}_${inputs.destinationId}`;
  const routeOverride = config.routePrices[routeKey];

  let routeRate = baseRate;
  let tollEstimate = 12000;
  let fuelEstimate = 8000;

  if (routeOverride) {
    tollEstimate = routeOverride.tollEstimate;
    fuelEstimate = routeOverride.fuelEstimate;
  }

  const excessSuitcases = Math.max(0, inputs.luggageCount - maxSuitcases);
  const excessSkiBags = Math.max(0, inputs.skiBagCount - maxSkiBags);

  const luggageSurcharge = excessSuitcases * (config.surcharges?.extraSuitcaseFee || 0);
  const skiBagSurcharge = excessSkiBags * (config.surcharges?.extraSkiBagFee || 0);
  const lateNightSurcharge = inputs.isLateNight ? (config.surcharges?.lateNightFee || 0) : 0;

  // Capacity Exceeded Second Vehicle Surcharge Formula (if exceeding max cap for the vehicle)
  const minPerPerson = Math.round(routeRate / maxPassengers);
  const secondVehicleSurcharge = minPerPerson + 30000;
  const multiVehicleSurcharge = isExceeded && inputs.addSecondVehicle ? secondVehicleSurcharge : 0;

  const subtotalOneWay = routeRate + extraPaxSurcharge + luggageSurcharge + skiBagSurcharge + lateNightSurcharge + multiVehicleSurcharge;

  let finalTotalPrice = subtotalOneWay;
  let roundTripDiscount = 0;

  if (inputs.transferType === 'round_trip') {
    const doublePrice = subtotalOneWay * 2;
    roundTripDiscount = Math.round(doublePrice * ((config.surcharges?.roundTripDiscountPercent || 5) / 100));
    finalTotalPrice = doublePrice - roundTripDiscount;
  }

  const pickupObj = PICKUP_LOCATIONS.find((p) => p.id === inputs.pickupId);
  const destObj = DESTINATION_LOCATIONS.find((d) => d.id === inputs.destinationId);

  const formattedTotalPrice = `¥${finalTotalPrice.toLocaleString('en-US')}`;

  const whatsAppText = encodeURIComponent(
    `Hello SK Limo Concierge Desk / SK Limo配車担当者様\n` +
    `I would like to lock in my private winter ski charter reservation:\n\n` +
    `📍 Route: ${pickupObj?.name || inputs.pickupId} (${pickupObj?.nameJa || ''}) ➔ ${destObj?.name || inputs.destinationId} (${destObj?.nameJa || ''})\n` +
    `🔄 Type: ${inputs.transferType === 'round_trip' ? 'Round Trip / 往復' : 'One Way / 片道'}\n` +
    `🚘 Vehicle: ${vehicleName}\n` +
    `👥 Guests & Gear: ${inputs.passengers} Pax | ${inputs.luggageCount} Suitcases | ${inputs.skiBagCount} Ski Bags\n` +
    `💰 Guaranteed Total Fare: ${formattedTotalPrice} JPY (All-Inclusive: Tolls, Fuel, Winter 4WD Snow Spec, Luggage Handling)\n` +
    `🛡️ Payment Terms: Settle after transfer completion via Bank Transfer or Cash (No Advance Deposit)\n\n` +
    `Please confirm vehicle availability and driver assignment.`
  );

  const whatsAppMessage = `https://wa.me/819000000000?text=${whatsAppText}`;

  return {
    recommendedVehicle: selectedVehicle,
    recommendedVehicleName: vehicleName,
    recommendedVehicleNameJa: vehicleNameJa,
    recommendedVehicleTagline: vehicleTagline,
    recommendedVehicleTaglineJa: vehicleTaglineJa,
    maxPassengers,
    maxSuitcases,
    maxSkiBags,
    isExceeded,
    secondVehicleSurcharge,
    vehicleImage,
    baseRate,
    extraPaxSurcharge,
    routeAdjustment: 0,
    luggageSurcharge,
    skiBagSurcharge,
    lateNightSurcharge,
    roundTripDiscount,
    tollEstimate,
    fuelEstimate,
    subtotalOneWay,
    finalTotalPrice,
    formattedTotalPrice,
    whatsAppMessage,
  };
}
