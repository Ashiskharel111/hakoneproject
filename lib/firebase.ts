import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
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

/**
 * Generate Firestore Document ID:
 * Format: 3 letters of first name + date and time + cramped email
 * Example: JOH_20260915-093012_johndoe
 */
export function generateDocumentId(name?: string, email?: string, date?: Date): string {
  const d = date || new Date();
  
  // 1. 3 letters of first name (uppercase alphanumeric, padded to 3 chars, fallback 'GUE')
  const firstName = (name || '').trim().split(/\s+/)[0] || '';
  const sanitizedName = firstName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const namePart = (sanitizedName.length >= 3 
    ? sanitizedName.slice(0, 3) 
    : (sanitizedName + 'XXX').slice(0, 3)) || 'GUE';
  
  // 2. Date and Time (YYYYMMDD-HHMMSS)
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const dateTimePart = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  
  // 3. What we can cramp from their email (sanitized username/prefix, max 15 chars)
  const emailStr = (email || '').trim().toLowerCase();
  const emailPrefix = emailStr.split('@')[0] || '';
  const sanitizedEmail = emailPrefix.replace(/[^a-z0-9]/g, '') || 'guest';
  const emailPart = sanitizedEmail.slice(0, 15);
  
  return `${namePart}_${dateTimePart}_${emailPart}`;
}

export interface UserInquiry {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  date?: string;
  guests?: string | number;
  message?: string;
  status?: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt?: any;
  docId?: string;
}

/**
 * Save user inquiry to Cloud Firestore in the 'inquires' collection
 * with custom documentID: 3 letters of first name + date/time + cramped email
 */
export async function saveInquiry(inquiry: UserInquiry): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore database is not initialized.');
      return null;
    }
    const customDocId = inquiry.docId || generateDocumentId(inquiry.name, inquiry.email);
    const docRef = doc(db, 'inquires', customDocId);

    await setDoc(docRef, {
      ...inquiry,
      docId: customDocId,
      status: inquiry.status || 'new',
      createdAt: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    });

    return customDocId;
  } catch (error) {
    console.error('Error saving inquiry to Firestore (inquires collection):', error);
    return null;
  }
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
 * with custom documentID: 3 letters of first name + date/time + cramped email
 */
export async function saveUserRequest(request: UserBookingRequest): Promise<string | null> {
  try {
    if (!db) {
      console.warn('Firestore database is not initialized.');
      return null;
    }
    const customDocId = generateDocumentId(request.clientName, request.clientEmail);
    const docRef = doc(db, 'booking_requests', customDocId);

    await setDoc(docRef, {
      ...request,
      docId: customDocId,
      currency: request.currency || 'JPY',
      status: request.status || 'new',
      createdAt: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    });

    return customDocId;
  } catch (error) {
    console.error('Error saving user booking request to Firestore:', error);
    return null;
  }
}

export { app, db, analytics };

