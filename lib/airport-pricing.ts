/**
 * Airport Transfer Pricing Calculator Module
 * Handles base rates, late-night surcharges, multi-vehicle fleets, NRT greeter, and VIP meet service calculation.
 */

export type Airport = 'NRT' | 'HND';
export type VehicleType = 'Foreign Large' | 'Wagon';
export type TimeOfDay = 'Standard' | 'Late Night';

export interface AirportTransferInputs {
  airport: Airport;
  vehicleType: VehicleType;
  vehicleCount?: number; // Number of vehicles (e.g., 2x Foreign Large for >4 pax)
  timeOfDay: TimeOfDay;
  nrtGreeter: boolean;
  vipMeetCount: number;
}

export interface AirportPricingBreakdown {
  airport: Airport;
  vehicleType: VehicleType;
  vehicleCount: number;
  timeOfDay: TimeOfDay;
  singleVehicleBaseFare: number;
  baseFare: number;
  lateNightSurcharge: number;
  nrtGreeterFee: number;
  vipMeetFee: number;
  totalAmount: number;
  currency: string;
}

// Base pricing matrix (in JPY) for a single vehicle
export const BASE_PRICING_RATES: Record<Airport, Record<VehicleType, number>> = {
  NRT: {
    'Foreign Large': 60000,
    Wagon: 36000,
  },
  HND: {
    'Foreign Large': 30000,
    Wagon: 24000,
  },
};

// Surcharges and Add-on Fees
export const LATE_NIGHT_SURCHARGE_PERCENT = 0.20; // 20%
export const NRT_GREETER_FEE = 10000;             // ¥10,000
export const VIP_MEET_FIRST_PERSON_FEE = 55000;   // ¥55,000
export const VIP_MEET_ADDITIONAL_PERSON_FEE = 22000; // ¥22,000

/**
 * Calculates the total cost for an airport transfer based on specific business rules:
 * - Step 1: Base Fare lookup by Airport and Vehicle Type, multiplied by vehicleCount
 * - Step 2: Time of Day Surcharge (20% on Base Fare if Late Night)
 * - Step 3: NRT Greeter Fee (¥10,000 if Airport is NRT and Greeter is selected)
 * - Step 4: VIP Meet Fee (¥55,000 for 1st person + ¥22,000 for each additional person)
 * - Step 5: Total Amount = Base Fare + Late Night Surcharge + NRT Greeter Fee + VIP Meet Fee
 */
export function calculateAirportTransferPrice(
  inputs: AirportTransferInputs
): AirportPricingBreakdown {
  const { airport, vehicleType, vehicleCount = 1, timeOfDay, nrtGreeter, vipMeetCount } = inputs;
  const count = Math.max(1, Math.floor(vehicleCount || 1));

  // Step 1: Base Fare
  const baseRateTable = BASE_PRICING_RATES[airport] || BASE_PRICING_RATES.HND;
  const singleVehicleBaseFare = baseRateTable[vehicleType] || baseRateTable.Wagon;
  const baseFare = singleVehicleBaseFare * count;

  // Step 2: Time Surcharge (20% on total base fare if Late Night)
  let lateNightSurcharge = 0;
  if (timeOfDay === 'Late Night') {
    lateNightSurcharge = Math.round(baseFare * LATE_NIGHT_SURCHARGE_PERCENT);
  }

  // Step 3: NRT Greeter Fee (¥10,000 only if NRT)
  let nrtGreeterFee = 0;
  if (airport === 'NRT' && nrtGreeter) {
    nrtGreeterFee = NRT_GREETER_FEE;
  }

  // Step 4: VIP Meet Fee (¥55,000 for 1st person + ¥22,000 for each additional person)
  let vipMeetFee = 0;
  const validVipCount = Math.max(0, Math.floor(vipMeetCount || 0));
  if (validVipCount > 0) {
    vipMeetFee = VIP_MEET_FIRST_PERSON_FEE + (validVipCount - 1) * VIP_MEET_ADDITIONAL_PERSON_FEE;
  }

  // Step 5: Total
  const totalAmount = baseFare + lateNightSurcharge + nrtGreeterFee + vipMeetFee;

  return {
    airport,
    vehicleType,
    vehicleCount: count,
    timeOfDay,
    singleVehicleBaseFare,
    baseFare,
    lateNightSurcharge,
    nrtGreeterFee,
    vipMeetFee,
    totalAmount,
    currency: 'JPY',
  };
}
