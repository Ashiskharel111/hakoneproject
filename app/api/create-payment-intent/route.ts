import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DETAILED_DESTINATIONS } from '@/lib/destinations-data';
import { DEFAULT_PRICING_CONFIG, calculateQuote, QuoteInputs } from '@/lib/pricing-store';
import { calculateAirportTransferPrice, Airport, VehicleType, TimeOfDay } from '@/lib/airport-pricing';
import { saveUserRequest } from '@/lib/firebase';

const rawStripeApiKey = process.env.STRIPE_SECRET_KEY || '';
const stripeApiKey = rawStripeApiKey.trim().split('#')[0].trim().split(/\s+/)[0].replace(/^["']|["']$/g, '');
const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

interface CreatePaymentIntentRequestBody {
  bookingType: 'destination' | 'airport_transfer' | 'winter_transfer' | 'custom_charter';
  destinationId?: string;
  pickupId?: string;
  vehicle?: 'alphard' | 'granace' | 'hiace' | 'Foreign Large' | 'Wagon';
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
  amount?: number;
}

export async function POST(request: NextRequest) {
  try {
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
      amount: clientProvidedAmount,
    } = body;

    // Validate required fields
    if (!guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Guest name and email are required for booking confirmation.' },
        { status: 400 }
      );
    }

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
        const isExceeded = passengers > maxCap;
        const minPerPerson = Math.round(vehicleBasePrice / maxCap);
        const secondVehicleCost = minPerPerson + 30000;

        calculatedAmount = vehicleBasePrice + (isExceeded && addSecondVehicle ? secondVehicleCost : 0);
        description = `SK Limo Day Charter: ${dest.name} (${vehicle.toUpperCase()}${isExceeded && addSecondVehicle ? ' + 2nd Support Vehicle' : ''}) on ${travelDate || 'TBD'}`;
      } else {
        calculatedAmount = clientProvidedAmount || 85000;
        description = `SK Limo Day Charter: ${destinationId} (${vehicle.toUpperCase()}) on ${travelDate || 'TBD'}`;
      }
    } else if (bookingType === 'airport_transfer') {
      // 2. Airport Transfer (Uses official Airport Transfer Pricing Calculator module)
      const isNarita = pickupId === 'nrt' || destinationId === 'nrt' || destinationId === 'nrt_tokyo';
      const resolvedAirport: Airport = isNarita ? 'NRT' : 'HND';
      destinationLabel = isNarita ? 'Narita Airport (NRT) ⇄ Tokyo' : 'Haneda Airport (HND) ⇄ Tokyo';

      const resolvedVehicleType: VehicleType =
        vehicle === 'Foreign Large' || vehicle === 'alphard' ? 'Foreign Large' : 'Wagon';
      const resolvedTimeOfDay: TimeOfDay = (body.timeOfDay === 'Late Night' ? 'Late Night' : 'Standard');
      const resolvedVehicleCount = Math.max(1, Number(body.vehicleCount || 1));

      const pricingResult = calculateAirportTransferPrice({
        airport: resolvedAirport,
        vehicleType: resolvedVehicleType,
        vehicleCount: resolvedVehicleCount,
        timeOfDay: resolvedTimeOfDay,
        nrtGreeter: Boolean(body.nrtGreeter),
        vipMeetCount: Number(body.vipMeetCount || 0),
      });

      calculatedAmount = pricingResult.totalAmount;
      const vehicleDesc = resolvedVehicleCount > 1 ? `${resolvedVehicleCount}x ${resolvedVehicleType}` : resolvedVehicleType;
      description = `SK Limo Airport Transfer: ${destinationLabel} (${vehicleDesc} - ${resolvedTimeOfDay}${pricingResult.nrtGreeterFee ? ' + NRT Greeter' : ''}${pricingResult.vipMeetFee ? ` + VIP Meet (${body.vipMeetCount} Pax)` : ''}) on ${travelDate || 'TBD'}`;
    } else if (bookingType === 'winter_transfer') {
      // 3. Winter Ski Transfer
      const quoteInputs: QuoteInputs = {
        pickupId: pickupId || 'hnd',
        destinationId: destinationId || 'hakuba',
        transferType: 'one_way',
        passengers: passengers || 4,
        luggageCount: luggageCount || 4,
        skiBagCount: skiBagCount || 0,
      };

      const quote = calculateQuote(DEFAULT_PRICING_CONFIG, quoteInputs);
      calculatedAmount = quote.finalTotalPrice;
      destinationLabel = `${pickupId || 'Tokyo'} to ${destinationId || 'Ski Resort'}`;
      description = `SK Limo Winter Transfer: ${destinationLabel} (${quote.recommendedVehicleName}) on ${travelDate || 'TBD'}`;
    } else {
      // Custom / general charter
      calculatedAmount = clientProvidedAmount && clientProvidedAmount > 0 ? clientProvidedAmount : 65000;
      description = `SK Limo Private Luxury Charter on ${travelDate || 'TBD'}`;
    }

    // Safeguard minimum pricing threshold (JPY)
    if (calculatedAmount <= 0) {
      calculatedAmount = clientProvidedAmount || 50000;
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
        passengers,
        luggageCount,
        skiBagCount,
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

    // 4. Create Stripe PaymentIntent if secret key configured
    if (stripe) {
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
          passengers: String(passengers),
          luggageCount: String(luggageCount),
          travelDate: travelDate || '',
          guestName,
          guestEmail,
          guestPhone: guestPhone || '',
          pickupAddress: pickupAddress || '',
          flightNumber: flightNumber || '',
        },
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
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while creating payment intent.' },
      { status: 500 }
    );
  }
}
