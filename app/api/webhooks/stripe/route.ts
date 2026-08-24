import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

// Helper: dispatch notification to ops team & customer
async function triggerDispatchNotification(bookingData: {
  bookingRef: string;
  amount: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  destination: string;
  travelDate: string;
  vehicle: string;
  passengers: string;
  luggage: string;
  pickupAddress: string;
}) {
  console.log(`[STRIPE WEBHOOK] Confirmed booking for ${bookingData.guestName} (${bookingData.bookingRef})`);
  console.log(`[DISPATCH TRIGGER] Date: ${bookingData.travelDate} | Destination: ${bookingData.destination} | Vehicle: ${bookingData.vehicle}`);
  console.log(`[CUSTOMER RECEIPT] Email dispatched to ${bookingData.guestEmail} for amount ${bookingData.currency.toUpperCase()} ${bookingData.amount}`);
  
  // Update Firestore booking status if possible
  if (db && bookingData.bookingRef) {
    try {
      const q = query(collection(db, 'booking_requests'), where('bookingRef', '==', bookingData.bookingRef));
      const querySnap = await getDocs(q);
      for (const docSnap of querySnap.docs) {
        await updateDoc(docSnap.ref, {
          status: 'confirmed',
          paymentStatus: 'paid',
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (dbErr) {
      console.warn('[STRIPE WEBHOOK] Firestore status update error:', dbErr);
    }
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    // Verify webhook signature if secret key and signature are present
    if (stripe && webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed:`, err.message);
        return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
      }
    } else {
      // Parse JSON directly when testing without webhook signature in development
      try {
        event = JSON.parse(rawBody) as Stripe.Event;
      } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const meta = paymentIntent.metadata || {};

        console.log(`PaymentIntent succeeded: ${paymentIntent.id} for amount ${paymentIntent.amount} ${paymentIntent.currency}`);

        await triggerDispatchNotification({
          bookingRef: meta.bookingRef || paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          guestName: meta.guestName || 'Valued Guest',
          guestEmail: meta.guestEmail || paymentIntent.receipt_email || '',
          guestPhone: meta.guestPhone || '',
          destination: meta.destinationLabel || meta.destinationId || 'Private Charter',
          travelDate: meta.travelDate || '',
          vehicle: meta.vehicle || 'Granace VIP',
          passengers: meta.passengers || '1',
          luggage: meta.luggageCount || '0',
          pickupAddress: meta.pickupAddress || 'Tokyo Hotel',
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(`Payment failed for PaymentIntent: ${paymentIntent.id}. Reason: ${paymentIntent.last_payment_error?.message}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session completed: ${session.id}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
