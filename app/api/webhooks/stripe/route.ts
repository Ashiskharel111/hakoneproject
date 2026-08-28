import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

// ── PII Masking Helpers ──
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : local[0] + '***' + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '***';
  return phone.slice(0, 3) + '***' + phone.slice(-2);
}

function maskName(name: string): string {
  if (!name || name.length <= 1) return '***';
  return name[0] + '***';
}

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
  // Log only masked PII — never raw customer data
  console.log(`[STRIPE WEBHOOK] Confirmed booking ${bookingData.bookingRef}`);
  console.log(`[DISPATCH] Date: ${bookingData.travelDate} | Dest: ${bookingData.destination} | Vehicle: ${bookingData.vehicle} | Guest: ${maskName(bookingData.guestName)}`);
  console.log(`[RECEIPT] ${maskEmail(bookingData.guestEmail)} | ${bookingData.currency.toUpperCase()} ${bookingData.amount}`);
  
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
    // ── SECURITY: Require Stripe signature verification in all environments ──
    if (!stripe || !webhookSecret) {
      console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Webhook endpoint is not configured.' },
        { status: 503 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.warn('[STRIPE WEBHOOK] Rejected: Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header. Unsigned requests are rejected.' },
        { status: 401 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`[STRIPE WEBHOOK] Signature verification failed:`, err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed.' },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const meta = paymentIntent.metadata || {};

        console.log(`[STRIPE WEBHOOK] PaymentIntent succeeded: ${paymentIntent.id} amount=${paymentIntent.amount} ${paymentIntent.currency}`);

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
        console.warn(`[STRIPE WEBHOOK] Payment failed: ${paymentIntent.id}. Reason: ${paymentIntent.last_payment_error?.message}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[STRIPE WEBHOOK] Checkout session completed: ${session.id}`);
        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[STRIPE WEBHOOK] Processing error:', error.message);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

