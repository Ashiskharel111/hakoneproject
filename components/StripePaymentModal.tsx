'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, Lock, X, Loader2, CheckCircle2, AlertCircle, Sparkles, CreditCard, Smartphone, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export interface BookingPaymentDetails {
  bookingType: 'destination' | 'airport_transfer' | 'winter_transfer' | 'custom_charter';
  destinationId?: string;
  destinationTitle: string;
  pickupId?: string;
  pickupAddress?: string;
  vehicle: 'alphard' | 'granace' | 'hiace';
  vehicleName: string;
  passengers: number;
  luggageCount: number;
  skiBagCount?: number;
  addSecondVehicle?: boolean;
  travelDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  flightNumber?: string;
  notes?: string;
  amount: number;
  currency?: string;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingPaymentDetails;
  onSuccess: (bookingRef: string, paymentIntentId: string) => void;
}

function CheckoutForm({
  bookingDetails,
  clientSecret,
  bookingRef,
  isSandbox,
  onSuccess,
}: {
  bookingDetails: BookingPaymentDetails;
  clientSecret: string;
  bookingRef: string;
  isSandbox?: boolean;
  onSuccess: (bookingRef: string, paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [lang] = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExpressConfirm = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: bookingDetails.guestEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Express checkout payment failed.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent.id);
    } else {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent?.id || bookingRef);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSandbox || !stripe || !elements) {
      // Sandbox / Test Mode Instant Confirmation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(bookingRef, `pi_mock_${Date.now()}`);
      }, 1200);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: bookingDetails.guestEmail,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please check your card or wallet information.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent.id);
    } else {
      setIsProcessing(false);
      onSuccess(bookingRef, paymentIntent?.id || bookingRef);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Supported Payment Methods Ribbon */}
      <div className="bg-[#070A10] border border-slate-800/90 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {lang === 'ja' ? '対応決済方法 (即時・安全)' : 'Accepted Payment Methods'}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>PCI-DSS Level 1</span>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          {/* Apple Pay */}
          <div className="bg-black border border-slate-700/80 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-white text-[11px] font-semibold tracking-tight"> Pay</span>
          </div>

          {/* Google Pay */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-white text-[11px] font-bold tracking-tight">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span> Pay
            </span>
          </div>

          {/* WeChat Pay */}
          <div className="bg-[#07C160]/15 border border-[#07C160]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#07C160] text-[11px] font-bold">微信支付</span>
          </div>

          {/* Alipay */}
          <div className="bg-[#1677FF]/15 border border-[#1677FF]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#1677FF] text-[11px] font-bold">支付宝</span>
          </div>

          {/* PayPay */}
          <div className="bg-[#FF0033]/15 border border-[#FF0033]/40 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-[#FF0033] text-[11px] font-bold">PayPay</span>
          </div>

          {/* Major Cards */}
          <div className="flex items-center gap-1 bg-[#0E131F] border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-bold">
            <span className="text-[#1A1F71] bg-white px-1 rounded text-[9px]">VISA</span>
            <span className="text-[#EB001B] font-extrabold text-[9px]">MC</span>
            <span className="text-[#006FCF] font-extrabold text-[9px]">AMEX</span>
            <span className="text-[#005BAC] font-extrabold text-[9px]">JCB</span>
            <span className="text-[#D92D20] bg-white px-1 rounded text-[9px]">银联</span>
          </div>
        </div>
      </div>

      {isSandbox ? (
        <div className="bg-[#131926] border border-[#C5A059]/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ja' ? 'Stripe サンドボックス・デモ決済' : 'Stripe Secure Sandbox Mode'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {lang === 'ja'
              ? '本番APIキー設定前の安全なテスト環境です。Apple Pay、Google Pay、WeChat Pay、Alipay、PayPay、各種クレジットカード決済のシミュレーションが可能です。'
              : 'Stripe test environment active. Live Apple Pay, Google Pay, WeChat Pay, Alipay, PayPay, and Credit Cards will seamlessly process once live API keys are added in .env.local.'}
          </p>
          <div className="bg-[#0A0D14] rounded-xl p-3 text-[11px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Card Holder:</span>
              <span className="text-white font-bold">{bookingDetails.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Methods:</span>
              <span className="text-emerald-400 font-bold">Cards / Apple Pay / WeChat / Alipay / PayPay (TEST)</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-[#C5A059] font-bold">¥{bookingDetails.amount.toLocaleString()} JPY</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* 1-Click Express Checkout Buttons (Apple Pay & Google Pay) */}
          <div className="space-y-2">
            <ExpressCheckoutElement
              onConfirm={handleExpressConfirm}
              options={{
                buttonHeight: 46,
                buttonTheme: {
                  applePay: 'black',
                  googlePay: 'black',
                },
                paymentMethods: {
                  applePay: 'auto',
                  googlePay: 'auto',
                  link: 'auto',
                },
              }}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/80" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-[#0A0D14] px-2 text-slate-400">Payment Options</span>
            </div>
          </div>

          {/* Full Payment Element: Credit Cards, Alipay, WeChat Pay, PayPay */}
          <PaymentElement
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: 'always',
                spacedAccordionItems: true,
              },
              wallets: {
                applePay: 'auto',
                googlePay: 'auto',
              },
            }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-[#C5A059] via-[#d8b46b] to-[#C5A059] hover:opacity-95 text-[#0A0D14] font-extrabold py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0D14]" />
              <span>{lang === 'ja' ? '安全に決済処理中...' : 'Authorizing Secure Payment...'}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                {lang === 'ja'
                  ? `¥${bookingDetails.amount.toLocaleString()} を支払って予約確定`
                  : `Authorize & Pay ¥${bookingDetails.amount.toLocaleString()}`}
              </span>
            </>
          )}
        </button>

        {/* Triple Security Trust Badges */}
        <div className="bg-[#0A0D14]/80 border border-slate-800/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span className="font-semibold text-slate-200">256-Bit SSL</span>
            <span className="text-[9px] text-slate-500">Bank-Grade Encryption</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">3D Secure 2.0</span>
            <span className="text-[9px] text-slate-500">Biometric &amp; OTP Guard</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Zero Storage</span>
            <span className="text-[9px] text-slate-500">Encrypted Stripe Vault</span>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  bookingDetails,
  onSuccess,
}: StripePaymentModalProps) {
  const [lang] = useLanguage();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [isSandbox, setIsSandbox] = useState<boolean>(false);
  const [isLoadingIntent, setIsLoadingIntent] = useState<boolean>(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setInitError(null);
      return;
    }

    let isMounted = true;
    setIsLoadingIntent(true);
    setInitError(null);

    async function initPaymentIntent() {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingType: bookingDetails.bookingType,
            destinationId: bookingDetails.destinationId,
            pickupId: bookingDetails.pickupId,
            vehicle: bookingDetails.vehicle,
            passengers: bookingDetails.passengers,
            luggageCount: bookingDetails.luggageCount,
            skiBagCount: bookingDetails.skiBagCount,
            addSecondVehicle: bookingDetails.addSecondVehicle,
            travelDate: bookingDetails.travelDate,
            guestName: bookingDetails.guestName,
            guestEmail: bookingDetails.guestEmail,
            guestPhone: bookingDetails.guestPhone,
            pickupAddress: bookingDetails.pickupAddress,
            flightNumber: bookingDetails.flightNumber,
            notes: bookingDetails.notes,
            amount: bookingDetails.amount,
            currency: bookingDetails.currency || 'jpy',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment session.');
        }

        if (isMounted) {
          setClientSecret(data.clientSecret);
          setBookingRef(data.bookingRef);
          setIsSandbox(!!data.sandboxMode || !publishableKey);
          setIsLoadingIntent(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error initializing Stripe payment intent:', err);
          setInitError(err.message || 'Payment gateway connection error.');
          setIsLoadingIntent(false);
        }
      }
    }

    initPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingDetails]);

  if (!isOpen) return null;

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#C5A059',
        colorBackground: '#0A0D14',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #1e293b',
          backgroundColor: '#0A0D14',
        },
        '.Input:focus': {
          border: '1px solid #C5A059',
          boxShadow: '0 0 0 1px #C5A059',
        },
        '.Label': {
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: '500',
        },
        '.Tab': {
          border: '1px solid #1e293b',
          backgroundColor: '#0A0D14',
        },
        '.Tab--selected': {
          borderColor: '#C5A059',
          boxShadow: '0 0 0 1px #C5A059',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0E131F] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
              {lang === 'ja' ? 'Stripe 決済ゲートウェイ' : 'Official Stripe VIP Checkout'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {lang === 'ja' ? 'オンライン予約・事前決済' : 'Secure Private Charter Checkout'}
          </h3>
        </div>

        {/* Trip Summary Card */}
        <div className="bg-[#07090E] border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                {bookingDetails.destinationTitle}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {bookingDetails.vehicleName} • {bookingDetails.passengers} Pax • {bookingDetails.travelDate}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">Total</span>
              <span className="text-lg font-extrabold text-[#C5A059] font-mono">
                ¥{bookingDetails.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>
              <span className="block text-slate-500">Guest Name:</span>
              <span className="text-slate-300 font-medium truncate block">{bookingDetails.guestName}</span>
            </div>
            <div>
              <span className="block text-slate-500">Email:</span>
              <span className="text-slate-300 font-medium truncate block">{bookingDetails.guestEmail}</span>
            </div>
          </div>
        </div>

        {/* Main Payment Section */}
        {isLoadingIntent ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              {lang === 'ja' ? '安全な決済セッションを確立中...' : 'Establishing encrypted Stripe session...'}
            </p>
          </div>
        ) : initError ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <div className="text-xs text-rose-300 font-medium">{initError}</div>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Back to Trip Details
            </button>
          </div>
        ) : isSandbox ? (
          <CheckoutForm
            bookingDetails={bookingDetails}
            clientSecret={clientSecret || ''}
            bookingRef={bookingRef}
            isSandbox={true}
            onSuccess={onSuccess}
          />
        ) : clientSecret && stripePromise ? (
          <Elements key={clientSecret} stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm
              bookingDetails={bookingDetails}
              clientSecret={clientSecret}
              bookingRef={bookingRef}
              isSandbox={false}
              onSuccess={onSuccess}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
