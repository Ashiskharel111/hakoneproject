import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DETAILED_DESTINATIONS } from '@/lib/destinations-data';
import { DEFAULT_PRICING_CONFIG, calculateQuote, QuoteInputs } from '@/lib/pricing-store';

// Initialize Stripe instance if key exists, otherwise fallback to mock/sandbox
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

interface CreatePaymentIntentRequestBody {
  bookingType: 'destination' | 'winter_transfer';
  destinationId?: string;
  pickupId?: string;
  vehicle?: 'alphard' | 'granace' | 'hiace';
  passengers: number;
  luggageCount: number;
  skiBagCount?: number;
  addSecondVehicle?: boolean;
  travelDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  pickupAddress?: string;
  currency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequestBody = await request.json();

    const {
      bookingType,
      destinationId,
      pickupId,
      vehicle = 'granace',
      passengers,
      luggageCount,
      skiBagCount = 0,
      addSecondVehicle = false,
      travelDate,
      guestName,
      guestEmail,
      guestPhone,
      pickupAddress,
      currency = 'jpy',
    } = body;

    // Validate required fields
    if (!guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Guest name and email are required.' },
        { status: 400 }
      );
    }

    let calculatedAmount = 0;
    let description = '';

    if (bookingType === 'destination' && destinationId) {
      // Look up server-side price from DETAILED_DESTINATIONS to prevent tampering
      const dest = DETAILED_DESTINATIONS[destinationId];
      if (!dest) {
        return NextResponse.json(
          { error: `Destination "${destinationId}" not found.` },
          { status: 404 }
        );
      }

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
      description = `SK Limo Day Charter: ${dest.name} (${vehicle.toUpperCase()}${isExceeded && addSecondVehicle ? ' + 2nd Support Vehicle' : ''}) on ${travelDate}`;
    } else {
      // Winter ski transfer calculation
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
      description = `SK Limo Winter Transfer: ${pickupId || 'Tokyo'} to ${destinationId || 'Resort'} (${quote.recommendedVehicleName}) on ${travelDate}`;
    }

    // Safety check for minimum charge amount
    if (calculatedAmount <= 0) {
      calculatedAmount = 60000; // default base safe charter amount
    }

    const bookingRef = `SK-${(destinationId || 'TRIP').slice(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create real Stripe PaymentIntent if API key is provided
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
          pickupId: pickupId || '',
          vehicle,
          passengers: String(passengers),
          luggageCount: String(luggageCount),
          travelDate,
          guestName,
          guestEmail,
          guestPhone,
          pickupAddress: pickupAddress || '',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: calculatedAmount,
        currency: currency.toLowerCase(),
        bookingRef,
        status: paymentIntent.status,
      });
    }

    // Fallback sandbox response when Stripe secret key is not yet configured in .env
    return NextResponse.json({
      clientSecret: `pi_mock_${bookingRef.toLowerCase()}_secret_test`,
      paymentIntentId: `pi_mock_${bookingRef.toLowerCase()}`,
      amount: calculatedAmount,
      currency: currency.toLowerCase(),
      bookingRef,
      status: 'requires_payment_method',
      sandboxMode: true,
      message: 'Payment intent initialized in sandbox mode. Set STRIPE_SECRET_KEY in environment for live processing.',
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while creating payment intent.' },
      { status: 500 }
    );
  }
}
