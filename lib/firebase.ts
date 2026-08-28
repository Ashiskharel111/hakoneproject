import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Official Hakone Project Firebase Configuration
// All values read from environment variables — no hardcoded fallbacks
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase app singleton
let app: FirebaseApp;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics not supported in this environment
    });
  }
} catch (e) {
  console.warn('Firebase initialization warning:', e);
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export interface UserBookingRequest {
  serviceType: 'winter_ski_transfer' | 'airport_transfer' | 'day_tour' | 'custom_charter';
  bookingRef?: string;
  pickup: string;
  pickupId?: string;
  destination: string;
  destinationId?: string;
  transferType?: 'one_way' | 'round_trip';
  vehicleType: string;
  passengers: number;
  luggageCount?: number;
  skiBagCount?: number;
  travelDate?: string;
  totalPrice?: string | number;
  currency?: string;
  paymentTerms?: string;
  paymentIntentId?: string;
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  channel?: 'whatsapp_concierge' | 'web_inquiry' | 'direct_booking' | 'stripe_checkout';
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
  status?: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
}

/**
 * Save user booking request / quote lead to Cloud Firestore
 */
export async function saveUserRequest(request: UserBookingRequest): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore database is not initialized.');
      return null;
    }
    const docRef = await addDoc(collection(db, 'booking_requests'), {
      ...request,
      currency: request.currency || 'JPY',
      status: request.status || 'new',
      createdAt: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving user request to Firestore:', error);
    return null;
  }
}

export { app, db, analytics };

