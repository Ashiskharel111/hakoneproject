import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DETAILED_DESTINATIONS } from '@/lib/destinations-data';
import { DEFAULT_PRICING_CONFIG, calculateQuote, QuoteInputs, PricingConfig } from '@/lib/pricing-store';
import { calculateAirportTransferPrice, Airport, VehicleType, TimeOfDay } from '@/lib/airport-pricing';
import { saveUserRequest, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { checkRateLimit } from '@/lib/rate-limit';

const rawStripeApiKey = process.env.STRIPE_SECRET_KEY || '';
const stripeApiKey = rawStripeApiKey.trim().split('#')[0].trim().split(/\s+/)[0].replace(/^["']|["']$/g, '');
const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

// ── SECURITY: Absolute minimum price floor (JPY) ──
const ABSOLUTE_MINIMUM_PRICE_JPY = 10000;
const CUSTOM_CHARTER_MINIMUM_JPY = 65000;

// ── SECURITY: Allowed booking types (whitelist) ──
const VALID_BOOKING_TYPES = ['destination', 'airport_transfer', 'winter_transfer', 'custom_charter'] as const;
type BookingType = typeof VALID_BOOKING_TYPES[number];

const VALID_VEHICLES = ['alphard', 'granace', 'hiace', 'Foreign Large', 'Wagon'] as const;

interface CreatePaymentIntentRequestBody {
  bookingType: BookingType;
  destinationId?: string;
  pickupId?: string;
  vehicle?: typeof VALID_VEHICLES[number];
  vehicleType?: 'Foreign Large' | 'Wagon';
  vehicleCount?: number;
  timeOfDay?: 'Standard' | 'Late Night';
  nrtGreeter?: boolean;
  vipMeetCount?: number;
  passengers: number;
  luggageCount: number;
  skiBagCount?: number;
  addSecondVehicle?: boolean;
  travelDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  pickupAddress?: string;
  flightNumber?: string;
  notes?: string;
  currency?: string;
  // NOTE: 'amount' field intentionally REMOVED — all pricing is server-calculated
}

export async function POST(request: NextRequest) {
  try {
    // ── SECURITY: Rate limiting (5 requests/min per IP) ──
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimitResult = checkRateLimit(`payment:${clientIp}`, 5, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfterMs / 1000)) } }
      );
    }

    const body: CreatePaymentIntentRequestBody = await request.json();

    const {
      bookingType,
      destinationId,
      pickupId,
      vehicle = 'granace',
      vehicleCount = 1,
      passengers = 2,
      luggageCount = 2,
      skiBagCount = 0,
      addSecondVehicle = false,
      travelDate,
      guestName,
      guestEmail,
      guestPhone,
      pickupAddress,
      flightNumber,
      notes,
      currency = 'jpy',
    } = body;

    // ── SECURITY: Input Validation ──
    if (!guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Guest name and email are required for booking confirmation.' },
        { status: 400 }
      );
    }

    if (!VALID_BOOKING_TYPES.includes(bookingType)) {
      return NextResponse.json(
        { error: 'Invalid booking type.' },
        { status: 400 }
      );
    }

    if (!VALID_VEHICLES.includes(vehicle)) {
      return NextResponse.json(
        { error: 'Invalid vehicle selection.' },
        { status: 400 }
      );
    }

    const sanitizedPassengers = Math.max(1, Math.min(20, Math.floor(Number(passengers) || 2)));
    const sanitizedLuggage = Math.max(0, Math.min(30, Math.floor(Number(luggageCount) || 2)));
    const sanitizedSkiBags = Math.max(0, Math.min(20, Math.floor(Number(skiBagCount) || 0)));
    const sanitizedVehicleCount = Math.max(1, Math.min(5, Math.floor(Number(vehicleCount) || 1)));

    let calculatedAmount = 0;
    let description = '';
    let destinationLabel = destinationId || 'Charter Route';

    if (bookingType === 'destination' && destinationId) {
      // 1. Destination Day Charter
      const dest = DETAILED_DESTINATIONS[destinationId];
      if (dest) {
        destinationLabel = dest.name;
        const vehicleBasePrice =
          vehicle === 'alphard'
            ? (dest.alphardPrice || dest.granacePrice - 5000)
            : vehicle === 'granace'
            ? dest.granacePrice
            : dest.hiacePrice;

        const maxCap = vehicle === 'alphard' ? 4 : vehicle === 'granace' ? 5 : 9;
        const isExceeded = sanitizedPassengers > maxCap;
        const minPerPerson = Math.round(vehicleBasePrice / maxCap);
        const secondVehicleCost = minPerPerson + 30000;

        calculatedAmount = vehicleBasePrice + (isExceeded && addSecondVehicle ? secondVehicleCost : 0);
        description = `SK Limo Day Charter: ${dest.name} (${vehicle.toUpperCase()}${isExceeded && addSecondVehicle ? ' + 2nd Support Vehicle' : ''}) on ${travelDate || 'TBD'}`;
      } else {
        // Unknown destination — server-enforced minimum, never trust client
        calculatedAmount = CUSTOM_CHARTER_MINIMUM_JPY;
        description = `SK Limo Day Charter: ${destinationId} (${vehicle.toUpperCase()}) on ${travelDate || 'TBD'}`;
      }
    } else if (bookingType === 'airport_transfer') {
      // 2. Airport Transfer (server-side pricing calculator)
      const isNarita = pickupId === 'nrt' || destinationId === 'nrt' || destinationId === 'nrt_tokyo';
      const resolvedAirport: Airport = isNarita ? 'NRT' : 'HND';
      destinationLabel = isNarita ? 'Narita Airport (NRT) ⇄ Tokyo' : 'Haneda Airport (HND) ⇄ Tokyo';

      const resolvedVehicleType: VehicleType =
        vehicle === 'Foreign Large' || vehicle === 'alphard' ? 'Foreign Large' : 'Wagon';
      const resolvedTimeOfDay: TimeOfDay = (body.timeOfDay === 'Late Night' ? 'Late Night' : 'Standard');

      const pricingResult = calculateAirportTransferPrice({
        airport: resolvedAirport,
        vehicleType: resolvedVehicleType,
        vehicleCount: sanitizedVehicleCount,
        timeOfDay: resolvedTimeOfDay,
        nrtGreeter: Boolean(body.nrtGreeter),
        vipMeetCount: Math.max(0, Math.min(10, Number(body.vipMeetCount || 0))),
      });

      calculatedAmount = pricingResult.totalAmount;
      const vehicleDesc = sanitizedVehicleCount > 1 ? `${sanitizedVehicleCount}x ${resolvedVehicleType}` : resolvedVehicleType;
      description = `SK Limo Airport Transfer: ${destinationLabel} (${vehicleDesc} - ${resolvedTimeOfDay}${pricingResult.nrtGreeterFee ? ' + NRT Greeter' : ''}${pricingResult.vipMeetFee ? ` + VIP Meet (${body.vipMeetCount} Pax)` : ''}) on ${travelDate || 'TBD'}`;
    } else if (bookingType === 'winter_transfer') {
      // 3. Winter Ski Transfer (Fetch dynamic cloud pricing config from Firestore if available)
      let activePricingConfig: PricingConfig = DEFAULT_PRICING_CONFIG;
      if (db) {
        try {
          const docSnap = await getDoc(doc(db, 'config', 'pricing'));
          if (docSnap.exists()) {
            activePricingConfig = { ...DEFAULT_PRICING_CONFIG, ...docSnap.data() } as PricingConfig;
          }
        } catch (dbErr) {
          console.warn('Could not read cloud pricing config, using default:', dbErr);
        }
      }

      const quoteInputs: QuoteInputs = {
        pickupId: pickupId || 'hnd',
        destinationId: destinationId || 'hakuba',
        transferType: 'one_way',
        passengers: sanitizedPassengers,
        luggageCount: sanitizedLuggage,
        skiBagCount: sanitizedSkiBags,
      };

      const quote = calculateQuote(activePricingConfig, quoteInputs);
      calculatedAmount = quote.finalTotalPrice;
      destinationLabel = `${pickupId || 'Tokyo'} to ${destinationId || 'Ski Resort'}`;
      description = `SK Limo Winter Transfer: ${destinationLabel} (${quote.recommendedVehicleName}) on ${travelDate || 'TBD'}`;
    } else {
      // Custom charter — server-enforced minimum, never trust client
      calculatedAmount = CUSTOM_CHARTER_MINIMUM_JPY;
      description = `SK Limo Private Luxury Charter on ${travelDate || 'TBD'}`;
    }

    // ── SECURITY: Enforce absolute minimum price floor ──
    if (calculatedAmount < ABSOLUTE_MINIMUM_PRICE_JPY) {
      calculatedAmount = ABSOLUTE_MINIMUM_PRICE_JPY;
    }

    const bookingRef = `SK-${(destinationId || bookingType || 'TRIP').slice(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Record initial lead in Firestore with 'pending' payment status
    try {
      await saveUserRequest({
        serviceType:
          bookingType === 'destination'
            ? 'day_tour'
            : bookingType === 'airport_transfer'
            ? 'airport_transfer'
            : bookingType === 'winter_transfer'
            ? 'winter_ski_transfer'
            : 'custom_charter',
        bookingRef,
        pickup: pickupAddress || pickupId || 'Tokyo Central',
        pickupId,
        destination: destinationLabel,
        destinationId,
        vehicleType: vehicle.toUpperCase(),
        passengers: sanitizedPassengers,
        luggageCount: sanitizedLuggage,
        skiBagCount: sanitizedSkiBags,
        travelDate,
        totalPrice: calculatedAmount,
        currency: currency.toUpperCase(),
        paymentStatus: 'pending',
        channel: 'stripe_checkout',
        clientName: guestName,
        clientEmail: guestEmail,
        clientPhone: guestPhone,
        notes: [
          notes,
          flightNumber ? `Flight Number: ${flightNumber}` : null,
          addSecondVehicle ? 'Includes 2nd Support Vehicle' : null,
        ]
          .filter(Boolean)
          .join(' | '),
        status: 'new',
      });
    } catch (dbErr) {
      console.warn('Could not persist pending booking to Firestore:', dbErr);
    }

    // Create Stripe PaymentIntent if secret key configured
    if (stripe) {
      const paymentMethodConfig = process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION?.trim();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculatedAmount,
        currency: currency.toLowerCase(),
        description,
        receipt_email: guestEmail,
        metadata: {
          bookingRef,
          bookingType,
          destinationId: destinationId || '',
          destinationLabel,
          pickupId: pickupId || '',
          vehicle,
          passengers: String(sanitizedPassengers),
          luggageCount: String(sanitizedLuggage),
          travelDate: travelDate || '',
          guestName,
          guestEmail,
          guestPhone: guestPhone || '',
          pickupAddress: pickupAddress || '',
          flightNumber: flightNumber || '',
        },
        ...(paymentMethodConfig ? { payment_method_configuration: paymentMethodConfig } : {}),
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'always',
        },
        payment_method_options: {
          wechat_pay: {
            client: 'web',
          },
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: calculatedAmount,
        currency: currency.toLowerCase(),
        bookingRef,
        status: paymentIntent.status,
        description,
      });
    }

    // Fallback sandbox response when Stripe secret key is not set in .env.local
    return NextResponse.json({
      clientSecret: `pi_mock_${bookingRef.toLowerCase()}_secret_sandbox`,
      paymentIntentId: `pi_mock_${bookingRef.toLowerCase()}`,
      amount: calculatedAmount,
      currency: currency.toLowerCase(),
      bookingRef,
      status: 'requires_payment_method',
      sandboxMode: true,
      description,
      message: 'Payment intent initialized in sandbox mode. Set STRIPE_SECRET_KEY for live processing.',
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    return NextResponse.json(
      { error: 'Internal server error while creating payment intent.' },
      { status: 500 }
    );
  }
}

