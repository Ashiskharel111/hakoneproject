import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Official Hakone Project Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDyTxeXVlq-XczoSF_69hYX39xq-CVDDuE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hakoneproject.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hakoneproject",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hakoneproject.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "603564086253",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:603564086253:web:d0e1a96418359637d40de4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-GGY857PPJ7"
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

