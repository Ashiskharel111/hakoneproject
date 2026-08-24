/**
 * Unit Tests for Airport Transfer Pricing Calculator Module
 */

import {
  calculateAirportTransferPrice,
  AirportTransferInputs,
  BASE_PRICING_RATES,
} from '../lib/airport-pricing';

interface TestCase {
  name: string;
  input: AirportTransferInputs;
  expected: {
    baseFare: number;
    lateNightSurcharge: number;
    nrtGreeterFee: number;
    vipMeetFee: number;
    totalAmount: number;
  };
}

const testCases: TestCase[] = [
  // 1. Standard Base Rates Tests (Single Vehicle)
  {
    name: 'NRT + Foreign Large (Standard, No Add-ons)',
    input: { airport: 'NRT', vehicleType: 'Foreign Large', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 60000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 60000 },
  },
  {
    name: 'NRT + Wagon (Standard, No Add-ons)',
    input: { airport: 'NRT', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 36000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 36000 },
  },
  {
    name: 'HND + Foreign Large (Standard, No Add-ons)',
    input: { airport: 'HND', vehicleType: 'Foreign Large', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 30000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 30000 },
  },
  {
    name: 'HND + Wagon (Standard, No Add-ons)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 24000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 24000 },
  },

  // 2. Late Night Surcharge Tests (20% on Base Fare)
  {
    name: 'NRT + Foreign Large + Late Night (+20% = ¥12,000)',
    input: { airport: 'NRT', vehicleType: 'Foreign Large', timeOfDay: 'Late Night', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 60000, lateNightSurcharge: 12000, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 72000 },
  },
  {
    name: 'NRT + Wagon + Late Night (+20% = ¥7,200)',
    input: { airport: 'NRT', vehicleType: 'Wagon', timeOfDay: 'Late Night', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 36000, lateNightSurcharge: 7200, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 43200 },
  },
  {
    name: 'HND + Foreign Large + Late Night (+20% = ¥6,000)',
    input: { airport: 'HND', vehicleType: 'Foreign Large', timeOfDay: 'Late Night', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 30000, lateNightSurcharge: 6000, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 36000 },
  },
  {
    name: 'HND + Wagon + Late Night (+20% = ¥4,800)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Late Night', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 24000, lateNightSurcharge: 4800, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 28800 },
  },

  // 3. Multi-Vehicle Fleet Tests (e.g. 2x Foreign Large for >4 passengers)
  {
    name: 'HND + 2x Foreign Large (Standard, 5-8 Pax) = 2 * ¥30,000 = ¥60,000',
    input: { airport: 'HND', vehicleType: 'Foreign Large', vehicleCount: 2, timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 60000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 60000 },
  },
  {
    name: 'NRT + 2x Foreign Large (Standard, 5-8 Pax) = 2 * ¥60,000 = ¥120,000',
    input: { airport: 'NRT', vehicleType: 'Foreign Large', vehicleCount: 2, timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 120000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 120000 },
  },
  {
    name: 'NRT + 2x Foreign Large + Late Night (+20% on ¥120k = ¥24k)',
    input: { airport: 'NRT', vehicleType: 'Foreign Large', vehicleCount: 2, timeOfDay: 'Late Night', nrtGreeter: false, vipMeetCount: 0 },
    expected: { baseFare: 120000, lateNightSurcharge: 24000, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 144000 },
  },

  // 4. NRT Greeter Tests (+¥10,000 only for NRT)
  {
    name: 'NRT + Wagon + NRT Greeter (+¥10,000)',
    input: { airport: 'NRT', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: true, vipMeetCount: 0 },
    expected: { baseFare: 36000, lateNightSurcharge: 0, nrtGreeterFee: 10000, vipMeetFee: 0, totalAmount: 46000 },
  },
  {
    name: 'HND + Wagon + NRT Greeter is True (Should be IGNORED for HND)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: true, vipMeetCount: 0 },
    expected: { baseFare: 24000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 0, totalAmount: 24000 },
  },

  // 5. VIP Meet Service Tests
  {
    name: 'HND + Wagon + VIP Meet 1 Person (¥55,000)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 1 },
    expected: { baseFare: 24000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 55000, totalAmount: 79000 },
  },
  {
    name: 'HND + Wagon + VIP Meet 2 Persons (¥55,000 + ¥22,000 = ¥77,000)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 2 },
    expected: { baseFare: 24000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 77000, totalAmount: 101000 },
  },
  {
    name: 'HND + Wagon + VIP Meet 3 Persons (¥55,000 + 2*¥22,000 = ¥99,000)',
    input: { airport: 'HND', vehicleType: 'Wagon', timeOfDay: 'Standard', nrtGreeter: false, vipMeetCount: 3 },
    expected: { baseFare: 24000, lateNightSurcharge: 0, nrtGreeterFee: 0, vipMeetFee: 99000, totalAmount: 123000 },
  },

  // 6. Full Combination Scenario Test
  {
    name: 'NRT + 2x Foreign Large + Late Night + NRT Greeter + VIP Meet 2 Pax',
    input: { airport: 'NRT', vehicleType: 'Foreign Large', vehicleCount: 2, timeOfDay: 'Late Night', nrtGreeter: true, vipMeetCount: 2 },
    expected: {
      baseFare: 120000,
      lateNightSurcharge: 24000,
      nrtGreeterFee: 10000,
      vipMeetFee: 77000,
      totalAmount: 231000,
    },
  },
];

console.log('═══════════════════════════════════════════════════════════════');
console.log('  RUNNING AIRPORT PRICING CALCULATOR UNIT TESTS');
console.log('═══════════════════════════════════════════════════════════════\n');

let passedCount = 0;
let failedCount = 0;

for (const test of testCases) {
  const result = calculateAirportTransferPrice(test.input);
  const matchBase = result.baseFare === test.expected.baseFare;
  const matchSurcharge = result.lateNightSurcharge === test.expected.lateNightSurcharge;
  const matchGreeter = result.nrtGreeterFee === test.expected.nrtGreeterFee;
  const matchVip = result.vipMeetFee === test.expected.vipMeetFee;
  const matchTotal = result.totalAmount === test.expected.totalAmount;

  if (matchBase && matchSurcharge && matchGreeter && matchVip && matchTotal) {
    console.log(`✅ [PASS] ${test.name}`);
    console.log(`   ➔ Base: ¥${result.baseFare.toLocaleString()}, Surcharge: ¥${result.lateNightSurcharge.toLocaleString()}, Greeter: ¥${result.nrtGreeterFee.toLocaleString()}, VIP: ¥${result.vipMeetFee.toLocaleString()} = Total: ¥${result.totalAmount.toLocaleString()}\n`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${test.name}`);
    console.error(`   Expected:`, test.expected);
    console.error(`   Received:`, {
      baseFare: result.baseFare,
      lateNightSurcharge: result.lateNightSurcharge,
      nrtGreeterFee: result.nrtGreeterFee,
      vipMeetFee: result.vipMeetFee,
      totalAmount: result.totalAmount,
    });
    console.error('\n');
    failedCount++;
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log(`TEST SUMMARY: ${passedCount} Passed, ${failedCount} Failed`);
console.log('═══════════════════════════════════════════════════════════════');

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
